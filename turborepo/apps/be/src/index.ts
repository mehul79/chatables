import express from "express";
import "dotenv/config";
import { authRouter } from "./router/auth.router";
import { messageRouter } from "./router/message.router";
import cors from "cors"
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';


const app = express();
app.use(express.json());
app.use(cookieParser());




app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT"],
    credentials: true
}))



app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

app.get("/", (req,res)=>{
    res.send("API is working");
})

app.listen(process.env.PORT, () => {    
    console.log(`Server is running on port ${process.env.PORT}`);
});


export default app;
