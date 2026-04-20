import express from 'express';
import activityController from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Webhook endpoint (Public/API Key required in production)
router.post('/webhook', activityController.webhookIngest);

router.use(protect);

router.post('/', activityController.create);
router.get('/timeline', activityController.getTimeline);
router.get('/follow-ups', activityController.getFollowUps);

export default router;
