import express from "express";
import {
  getProducts,
  getProductById,
  getRecommendedProducts,
} from "../controllers/ProductController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getProducts);
router.get("/recommended", authMiddleware, getRecommendedProducts);
router.get("/:id", getProductById);

export default router;
