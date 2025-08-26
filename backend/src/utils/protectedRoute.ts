import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../db/db";


// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  
    try {
      const token = req.cookies.token; // Safely access cookies
      
      if (!token) {
        res.status(401).json({ message: "hehe: Unauthorized - No Token Provided" });
        return;
      }
  
      const JWT_SECRET = process.env.JWT_AUTH_SECRET;
      if(!JWT_SECRET) {
        res.status(500).json({ message: "Internal server error - JWT Secret not defined" });
        return;
      }
      const decoded = jwt.verify(token, JWT_SECRET);
  
      if (!decoded) {
        res.status(401).json({ message: "Unauthorized - Invalid Token" });
        return;
      }
  
      const user = await prisma.user.findFirst({
          where:{
              id: (decoded as { userId: string }).userId,
          }
      })
  
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      req.user = user; // Attach the user to the request object for further use in the route handler
      console.log(`user ${user.name} accessed protected route`);
      next(); // Proceed to the next middleware or route handler
    } catch (error: any) {
      console.log("Error in protectRoute middleware: ", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };


  export const checkAuth = async(req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  res.status(200).json({
    message: "Protected route accessed",
    user: req.user,
  });
};
