import express from "express";
import {
  getProducts,
  getProductById,
  getRecommendedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/ProductController";
import { authMiddleware, authorize } from "../middleware/authMiddleware";
import upload from "../config/multer";

const router = express.Router();

router.get("/", getProducts);
router.get("/recommended", authMiddleware, getRecommendedProducts);
router.get("/:id", getProductById);

// Admin routes
router.use(authMiddleware);
router.use((req, res, next) => {
  authorize("ADMIN")(req, res, next).catch(next);
});

router.post("/", upload.single("image"), createProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
