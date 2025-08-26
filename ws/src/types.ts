import {z} from "zod"
import {v4 as uuidv4} from "uuid"

const UserSchema = z.object({
  id: z.uuidv4(),
  name: z.string(),
  email: z.email(),
  password: z.string(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});


const MessageSchema = z.object({
  id: z.string().cuid(),
  senderId: z.string().cuid(),   
  receiverId: z.string().cuid(), 
  text: z.string().nullable().optional(),
  image: z.string().url().nullable().optional(),
  createdAt: z.date().default(new Date()),
});


type message = z.infer<typeof MessageSchema>
type user = z.infer<typeof UserSchema>

export {message, user}