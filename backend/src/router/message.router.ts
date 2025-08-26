import express from 'express';
import { protectRoute } from '../utils/protectedRoute';
import { getMessages, getUsersForSidebar, sendMessage } from '../controller/message.controller';
const messageRouter = express.Router();


messageRouter.get("/users", protectRoute, getUsersForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);

messageRouter.post("/send/:id", protectRoute, sendMessage);

export {
    messageRouter
}