import jwt from "jsonwebtoken"
import { Response } from "express";
import "dotenv/config"

export const generateTokenandCookie = (res: Response, userId: string)=>{
    const jwtSecret = process.env.JWT_AUTH_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_AUTH_SECRET is not defined in environment variables");
    }
    const token = jwt.sign({userId}, jwtSecret, {
        expiresIn: "7d",
    })

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",  
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
        maxAge: 7*24*60*60*1000,
    })

    return token;
}