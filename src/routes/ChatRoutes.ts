import express from "express";
import {
  getChats,
  getChatMessages,
  createChat,
} from "../controllers/ChatController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getChats);
router.get("/:chatId/messages", getChatMessages);
router.post("/", createChat);

export default router;
