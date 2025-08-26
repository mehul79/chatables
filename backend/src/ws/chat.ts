import webSocketServer from "../chatServer";
import { v4 as uuidv4 } from 'uuid';
import { WebSocket } from 'ws';


class Client {
    public senderId: string;
    public receiverId: string;
    public isReceiver: boolean;
    public lastActive: Date;
    public socket: WebSocket;
    constructor(id: string, socket: WebSocket) {
        this.socket = socket;
    }
}

class Message {
    public id: string;
    public senderId: string;
    public receiverId: string;
    public type: 'text' | 'image';
    public image?: string
    constructor(id: string, content: string) {
        this.id = id;
        this.content = content;
    }
}

const clients = new Map<string, Client>();

webSocketServer.on("connection", (socket) => {
    console.log("new client connected");
    const clientId = uuidv4();
    clients.set(clientId, socket);

    socket.on("message", (message) => {
        console.log(message.toString());
        console.log(clientId);
    })

    socket.on("close", () => {
        clients.delete(clientId);
    })
})