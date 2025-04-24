import express from "express";
import {
  getSkinProfile,
  createSkinProfile,
  updateSkinProfile,
} from "../controllers/SkinProfileController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getSkinProfile);
router.post("/", createSkinProfile);
router.put("/", updateSkinProfile);

export default router;
