import { useEffect, useState } from "react";

const WS_URL = 'ws://localhost:8080'

export function useSocket(){
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);


    useEffect(() => {
        let newSocket: WebSocket| null;
        setIsConnecting(true);
        
        setTimeout(()=>{
            newSocket = new WebSocket(`${WS_URL}`);
            newSocket.onopen = () => { 
                console.log("connected");
                setSocket(newSocket);
                setIsConnected(true);
                setIsConnecting(false);
            };
            
            newSocket.onclose = () => {
                console.log("disconnected");
                setSocket(null);
                setIsConnected(false);
                setIsConnecting(false);
            };

            newSocket.onerror = () => {
                console.log("connection error");
                setIsConnected(false);
                setIsConnecting(false);
            };
            
            return () => {
                if(newSocket){
                    newSocket.close();    
                }
            };
        }, 2000)        
    }, []);

    return { socket, isConnected, isConnecting }
}