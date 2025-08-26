import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../db/db';


// Message types for client-server communication
enum MESSAGE_TYPES {
    INIT = 'INIT',
    MESSAGE = 'MESSAGE',
    TYPING = 'TYPING',
    ONLINE_STATUS = 'ONLINE_STATUS',
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS'
}

type MessageType = MESSAGE_TYPES

// WebSocket message interfaces
interface WSMessage {
    type: MessageType;
    data: any;
}

interface InitMessage {
    type: 'INIT';
    data: {
        userId: string;
    };
}

interface ChatMessage {
    type: 'MESSAGE';
    data: {
        receiverId: string;
        text?: string;
        image?: string;
    };
}

interface TypingMessage {
    type: 'TYPING';
    data: {
        receiverId: string;
        isTyping: boolean;
    };
}

// Client class to manage connected users
class Client {
    public userId: string;
    public socket: WebSocket;
    public lastActive: Date;

    constructor(userId: string, socket: WebSocket) {
        this.userId = userId;
        this.socket = socket;
        this.lastActive = new Date();
        this.updateLastActive();
    }

    public updateLastActive(): void {
        this.lastActive = new Date();
        // Update user's last active time in database
        prisma.user.update({
            where: { id: this.userId },
            data: { lastActive: this.lastActive }
        }).catch(console.error);
    }

    public send(message: WSMessage): void {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        }
    }

    public isOnline(): boolean {
        return this.socket.readyState === WebSocket.OPEN;
    }
}

// Store connected clients
const clients = new Map<string, Client>();

// Create WebSocket server
const webSocketServer = new WebSocketServer({ 
    port: process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 8080 
});

console.log(`WebSocket server running on port ${process.env.WS_PORT || 8080}`);

webSocketServer.on('connection', (socket: WebSocket) => {
    console.log('New client connected');
    let currentClient: Client | null = null;

    socket.on('message', async (data: Buffer) => {
        try {
            const message: WSMessage = JSON.parse(data.toString());
            await handleMessage(socket, message, currentClient);
        } catch (error) {
            console.error('Error parsing message:', error);
            sendError(socket, 'Invalid message format');
        }
    });

    socket.on('close', () => {
        if (currentClient) {
            console.log(`Client ${currentClient.userId} disconnected`);
            clients.delete(currentClient.userId);
            
            // Notify other users that this user went offline
            // broadcastOnlineStatus(currentClient.userId, false);
        }
    });

    socket.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    // Handle message routing
    async function handleMessage(socket: WebSocket, message: WSMessage, client: Client | null) {
        switch (message.type) {
            case MESSAGE_TYPES.INIT:
                currentClient = await handleInit(socket, message as InitMessage);
                break;
            
            case MESSAGE_TYPES.MESSAGE:
                if (client) {
                    await handleChatMessage(client, message as ChatMessage);
                } else {
                    sendError(socket, 'Client not initialized');
                }
                break;
            
            case MESSAGE_TYPES.TYPING:
                if (client) {
                    await handleTyping(client, message as TypingMessage);
                } else {
                    sendError(socket, 'Client not initialized');
                }
                break;
            
            default:
                sendError(socket, 'Unknown message type');
        }
    }
});

// Handle client initialization
async function handleInit(socket: WebSocket, message: InitMessage): Promise<Client | null> {
    try {
        const { userId } = message.data;

        // Verify user exists in database
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            sendError(socket, 'User not found');
            return null;
        }

        // Remove existing connection if user is already connected
        if (clients.has(userId)) {
            const existingClient = clients.get(userId)!;
            existingClient.socket.close();
            clients.delete(userId);
        }

        // Create new client
        const client = new Client(userId, socket);
        clients.set(userId, client);

        console.log(`User ${user.name} (${userId}) connected`);

        // Send success response
        client.send({
            type: MESSAGE_TYPES.SUCCESS,
            data: {
                message: 'Connected successfully',
                userId: userId
            }
        });

        // Broadcast that this user is now online
        // broadcastOnlineStatus(userId, true);

        return client;
    } catch (error) {
        console.error('Error in handleInit:', error);
        sendError(socket, 'Initialization failed');
        return null;
    }
}

// Handle chat messages
async function handleChatMessage(client: Client, message: ChatMessage): Promise<void> {
    try {
        const { receiverId, text, image } = message.data;
        
        // Validate message
        if (!text && !image) {
            client.send({
                type: MESSAGE_TYPES.ERROR,
                data: { message: 'Message must contain text or image' }
            });
            return;
        }

        // Verify receiver exists
        const receiver = await prisma.user.findUnique({
            where: { id: receiverId }
        });

        if (!receiver) {
            client.send({
                type: MESSAGE_TYPES.ERROR,
                data: { message: 'Receiver not found' }
            });
            return;
        }

        // Save message to database
        const savedMessage = await prisma.message.create({
            data: {
                senderId: client.userId,
                receiverId: receiverId,
                text: text || null,
                image: image || null
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        profilePic: true
                    }
                }
            }
        });

        client.updateLastActive();

        // Prepare message for clients
        const messagePayload = {
            type: MESSAGE_TYPES.MESSAGE,
            data: {
                id: savedMessage.id,
                senderId: savedMessage.senderId,
                receiverId: savedMessage.receiverId,
                text: savedMessage.text,
                image: savedMessage.image,
                createdAt: savedMessage.createdAt,
                sender: savedMessage.sender
            }
        };

        // Send to sender (confirmation)
        client.send(messagePayload);

        // Send to receiver if online
        const receiverClient = clients.get(receiverId);
        if (receiverClient && receiverClient.isOnline()) {
            receiverClient.send(messagePayload);
            receiverClient.updateLastActive();
        }

        console.log(`Message sent from ${client.userId} to ${receiverId}`);
    } catch (error) {
        console.error('Error in handleChatMessage:', error);
        client.send({
            type: MESSAGE_TYPES.ERROR,
            data: { message: 'Failed to send message' }
        });
    }
}

// Handle typing indicators
async function handleTyping(client: Client, message: TypingMessage): Promise<void> {
    try {
        const { receiverId, isTyping } = message.data;
        
        const receiverClient = clients.get(receiverId);
        if (receiverClient && receiverClient.isOnline()) {
            receiverClient.send({
                type: MESSAGE_TYPES.TYPING,
                data: {
                    senderId: client.userId,
                    isTyping
                }
            });
        }
    } catch (error) {
        console.error('Error in handleTyping:', error);
    }
}

// Send error message
function sendError(socket: WebSocket, message: string): void {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.ERROR,
            data: { message }
        }));
    }
}



// Utility function to get online users (for potential use in API endpoints)
export function getOnlineUsers(): string[] {
    return Array.from(clients.keys());
}

// Utility function to check if a user is online
export function isUserOnline(userId: string): boolean {
    const client = clients.get(userId);
    return client ? client.isOnline() : false;
}

// Utility function to send message to a specific user (for potential API use)
export function sendToUser(userId: string, message: WSMessage): boolean {
    const client = clients.get(userId);
    if (client && client.isOnline()) {
        client.send(message);
        return true;
    }
    return false;
}

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down WebSocket server...');
    webSocketServer.close(() => {
        prisma.$disconnect();
        process.exit(0);
    });
});

export default webSocketServer;