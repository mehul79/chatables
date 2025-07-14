import {z} from "zod"

const UserSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});


const MessageSchema = z.object({
  id: z.string().cuid(),
  senderId: z.string().cuid(),   
  receiverId: z.string().cuid(), 
  text: z.string().nullable(),
  image: z.string().url().nullable().optional(),
  createdAt: z.date().default(new Date()),
});


type message = z.infer<typeof MessageSchema>
type user = z.infer<typeof UserSchema>

export {message, user}