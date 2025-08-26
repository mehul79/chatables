import ws from "ws"
import { v4 as uuidv4 } from 'uuid';
import {user, message} from "./types"

export class messages {
  public id: message["id"];
  public senderId: message["senderId"];
  public receiverId: message["receiverId"];
  public createdAt: message["createdAt"];
  public text: message["text"];
  public image: message["image"];

  constructor(id: string, senderId: string, receiverId: string, createdAt: Date, text: string, image?: string){
    this.id = id;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.createdAt = createdAt;
    this.text = text;
    this.image = image || null;
  }
}