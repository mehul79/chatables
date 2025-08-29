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

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";


app.listen(PORT, HOST, () => {
    console.log(`Server listening at http://${HOST}:${PORT}`);
  });


export default app;
