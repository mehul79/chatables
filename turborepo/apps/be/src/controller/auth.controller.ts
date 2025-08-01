import * as z from "zod";
import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import { generateTokenandCookie } from "../utils/generateTokenandCookie";
import prisma from "../db/db";
import cloudinary from "../utils/cloudinary";


const userSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(4, { message: "password must be 4 characters long" }),
  name: z.string().optional(),
});

const signup = async (req: Request, res: Response): Promise<void> => {
  const user = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
  };
  try {
    const result = userSchema.safeParse(user);
    if (!result.success) {
      res.status(411).json({
        msg: "incorrect data format",
        error: result.error.errors,
      });
      return;
    }
    const useralreadyexist = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (useralreadyexist) {
      res.status(411).send("User already exists");
      return;
    }
    const hash_password = await bcryptjs.hash(req.body.password, 10);
    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        password: hash_password,
        name: user.name,
      },
    });

    //jwt
    const token = generateTokenandCookie(res, createdUser.id);

    res.status(201).json({
      success: true,
      message: "User Created successfully",
      token: token, // Commented out as token is set in cookies via generateTokenandCookie
      user: {
        name: createdUser.name,
        email: createdUser.email,
      },
    });
    return;
  } catch (e) {
    res.status(404).json({
      error: e,
    });
    console.log("Error while loggin", e);
  }
};




const login = async (req: Request, res: Response): Promise<void> => {
  const incoming = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const user = await prisma.user.findUnique({
      where:{ 
        email: incoming.email 
      }
    });
    if (!user) {
      res.status(411).json({
        success: false,
        msg: "User not found",
      });
      return;
    }
    const passCheck = await bcryptjs.compare(incoming.password, user.password);
    if (!passCheck) {
      res.status(411).json({
        success: false,
        msg: "The password you entered is incorrect.",
      });
      return;
    }
    const token = generateTokenandCookie(res, user.id);
    user.updatedAt = new Date();

    res.status(200).json({
      success: true,
      msg: "user logged in",
      user: {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toLocaleDateString(),
      updatedAt: user.updatedAt.toLocaleString()
      },
    });
  } catch (e: any) {
    console.log("login error: ", e);
    res.status(404).json({
      success: false,
      msg: e.message,
    });
    return;
  }
};

const logout = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  try{
    res.clearCookie("token");
    res.status(200).json({
    logout: true,
    message: "logout Successfull",
    token: token, // to output the token in responce enable this
  });
  }catch(e:any){
    console.log(e);
    res.status(404).json({
      success: false,
      msg: e.message,
    });
    return;
  }
}


const updateProfile = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { userId } = req.body; // Getting userId from req.body

    if (!userId) {
      res.status(400).json({ msg: "User ID is required" });
      return;
    }

    if (!file) {
      res.status(411).json({ msg: "Profile Pic is required" });
      return;
    }

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${file.buffer.toString("base64")}`
    );

    // Update user in Prisma
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profilePic: uploadResponse.secure_url },
    });

    res.status(200).json({user: updatedUser, msg: "Profile updated Successfully"});
  } catch (e) {
    console.error("ERROR: ", e);
    res.status(500).json({ msg: "Something went wrong" });
  }
};







export {signup, login, logout,  updateProfile}