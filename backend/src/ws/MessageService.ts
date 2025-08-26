import ws from "ws"
import dotenv from "dotenv"
dotenv.config()
const port = 8080;
const webSocketServer = new ws.Server({ port: Number(port)});

