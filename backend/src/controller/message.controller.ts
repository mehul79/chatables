import { Request, Response } from 'express';
import prisma from '../db/db';
import cloudinary from '../utils/cloudinary';


const getUsersForSidebar = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const otherUsers = await prisma.user.findMany({
      where: {
        NOT: { id: userId }
      },
      select: {
        id: true,
        name: true,
        profilePic: true
      }
    });

    res.status(200).json({ users: otherUsers });
  } catch (e: any) {
    console.log("error from message route 1:", e.message);
    res.status(500).json({ message: e.message });
  }
};


const getMessages = async (req: Request, res: Response): Promise<void> => {
    try {
        const params = req.params;
        const userToChatId = params.id;

        const myId = req.user.id;
        const receivedMessages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: myId,
                        receiverId: userToChatId
                    },
                    {
                        senderId: userToChatId,
                        receiverId: myId
                    }
                ]
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        res.status(200).json({
            messages: receivedMessages
        })
    } catch (e: any) {
        console.log("error from message route 2: ", e.message);
        res.status(500).json({
            message: e.message
        })
    }
}



const sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const params = req.params;
        const { text, image } = req.body;
        const userToChatId = params.id;
        const myId = req.user.id;

        let imageUrl = "";
        if (image) {
            const uploadRes = await cloudinary.uploader.upload(image);
            imageUrl = uploadRes.secure_url;
        }

        const message = await prisma.message.create({
            data: {
                senderId: myId,
                receiverId: userToChatId,
                text: text,
                image: imageUrl
            }
        })

        //realtime message

        res.status(201).json({
            message: message
        })


    } catch (e: any) {
        console.log("error from message route 3: ", e.message);
        res.status(500).json({
            message: e.message
        })
    }
}


export {
    getUsersForSidebar,
    getMessages,
    sendMessage
}