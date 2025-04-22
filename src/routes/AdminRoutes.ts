import express from "express";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAdminStats,
} from "../controllers/AdminController";
import { authMiddleware, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.use(authMiddleware);
router.use((req, res, next) => {
  authorize("ADMIN")(req, res, next).catch(next);
});

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/role", updateUserRole);
router.get("/stats", getAdminStats);

export default router;