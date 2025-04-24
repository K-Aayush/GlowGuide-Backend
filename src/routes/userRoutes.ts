import express from "express";

import {
  deleteProfile,
  getDermatologist,
  getUser,
  updateProfile,
} from "../controllers/UserController";
import { authMiddleware } from "../middleware/authMiddleware";
import upload from "../config/multer";

const router = express.Router();

router.use(authMiddleware);

router.put("/profile", upload.single("image"), updateProfile);
router.delete("/profile", deleteProfile);
router.get("/dermotologist", getDermatologist);
router.get("/user", getUser);

export default router;
