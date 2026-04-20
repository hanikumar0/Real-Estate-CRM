import express from 'express';
import analyticsController from '../controllers/analyticsController.js';
import { protect, managerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', analyticsController.getDashboard);
router.get('/sales-trends', managerOnly, analyticsController.getSalesTrends);
router.get('/leaderboard', managerOnly, analyticsController.getLeaderboard);
router.get('/sources', managerOnly, analyticsController.getSources);

export default router;
