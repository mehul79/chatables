import ws from "ws"
import dotenv from "dotenv"
dotenv.config()
const port = process.env.PORT || 8080;
import { messages } from "./messageClass";
import { receiving, sending } from "./utils/messages";

const webSocketServer = new ws.Server({ port: Number(port) });

webSocketServer.on('connection', (socket) => {
  console.log('New client connected!');
  // Handle incoming messages
  socket.on('message', (message) => {
    const data = message.toString();
    console.log('Received:', data);
    webSocketServer.clients.forEach((client)=>{
      if(client != socket){
        client.send(data);  
      }
    })
  });

  // Handle client disconnection
  socket.on('close', () => {
    console.log('Client disconnected');
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log(`WebSocket server is running on port ${port}`);
