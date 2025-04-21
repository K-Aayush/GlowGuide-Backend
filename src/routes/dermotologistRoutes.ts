import express from "express";
import {
  getPatients,
  getPatientDetails,
  getDermatologistStats,
  getRecentActivity,
} from "../controllers/dermotologistController";
import { authMiddleware, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.use(authMiddleware);
router.use((req, res, next) => {
  authorize("DERMATOLOGISTS")(req, res, next).catch(next);
});

router.get("/patients", getPatients);
router.get("/patients/:id", getPatientDetails);
router.get("/stats", getDermatologistStats);
router.get("/activity", getRecentActivity);

export default router;
