import express from "express";
import { getCurrentUser, loginUser, registerUser } from "../controllers/AuthController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get('/me', authMiddleware, getCurrentUser);

export default router;
