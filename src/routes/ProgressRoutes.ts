import express from 'express';
import {
  getLogs,
  createLog,
  deleteLog,
  getComparison,
} from '../controllers/ProgressController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware); 

router.get('/', getLogs);
router.post('/', createLog);
router.delete('/:id', deleteLog);
router.get('/comparison', getComparison);

export default router;