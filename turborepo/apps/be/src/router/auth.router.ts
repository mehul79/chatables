import express from "express";
import { signup, login, logout, updateProfile } from "../controller/auth.controller";
import { protectRoute } from "../utils/protectedRoute";
import multer from "multer";
const router = express.Router();


const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage });

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.get("/check", protectRoute);
router.post("/update-profile", upload.single("profilePic"), updateProfile);


export { router as authRouter };
