import { Request, Response } from 'express';
import prisma from '../db/db';
import cloudinary from '../utils/cloudinary';



const getUsersForSidebar = async (req: Request, res: Response): Promise <void> => {
    try{
        const userId = req.user.id;
        const otherUsers = [];
        otherUsers.push(await prisma.user.findMany({
            where: {
                NOT: {
                    id: userId
                }
            },
            select: {
                name: true,
                email: true
            }
        }))

        if(!otherUsers[0]){
            res.status(404).json({
                message: "No users found"
            })
            return;
        }
       
        res.status(200).json({
            users: otherUsers
        })


    }catch(e: any){
        console.log("error from message route: ", e.message);
        res.status(500).json({
            message: e.message
        })
        
    }
}


const getMessages = async (req: Request, res: Response): Promise <void> => {
    try{
        const params = req.params;
        const userToChatId = params.id;

        const myId = req.user.id;
        const ReceviedMessages = await prisma.message.findMany({
            where:{
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
            }
        })

        if(ReceviedMessages.length === 0){
            res.status(404).json({
                message: "No messages found"
            })
            return;
        }

        res.status(200).json({
            messages: ReceviedMessages
        })
    }catch(e: any){
        console.log("error from message route: ", e.message);
        res.status(500).json({
            message: e.message
        })
    }
}



const sendMessage = async (req: Request, res: Response): Promise <void> => {
    try{
        const params = req.params;
        const {text, image} = req.body;
        const userToChatId = params.id;
        const myId = req.user.id;

        let imageUrl = "";
        if(image){
            const uploadRes = await cloudinary.uploader.upload(image);
            imageUrl = uploadRes.secure_url;
        }

        const message  = await prisma.message.create({
            data:{
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


    }catch(e: any){
        console.log("error from message route: ", e.message);
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