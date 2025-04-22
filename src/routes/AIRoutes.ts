import express from "express";
import { getProductRecommendations } from "../controllers/AIController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/recommendations", getProductRecommendations);

export default router;
