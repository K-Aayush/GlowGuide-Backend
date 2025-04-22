import express from "express";
import {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from "../controllers/AppointmentController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAppointments);
router.post("/", createAppointment);
router.patch("/:id/status", updateAppointmentStatus);
router.delete("/:id", deleteAppointment);

export default router;
