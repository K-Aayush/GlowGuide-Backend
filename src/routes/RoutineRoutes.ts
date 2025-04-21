import express from 'express';
import {
  getRoutines,
  getRoutineById,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  addRoutineStep,
  deleteRoutineStep,
} from '../controllers/RoutineController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware); 

router.get('/', getRoutines);
router.get('/:id', getRoutineById);
router.post('/', createRoutine);
router.put('/:id', updateRoutine);
router.delete('/:id', deleteRoutine);
router.post('/steps', addRoutineStep);
router.delete('/steps/:id', deleteRoutineStep);

export default router;