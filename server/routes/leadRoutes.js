import express from 'express';
import leadController from '../controllers/leadController.js';
import { protect, adminOnly, managerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.get('/track', leadController.getTrackedStatus);

// Protected Routes
router.use(protect);
router.post('/', leadController.create);
router.get('/', leadController.getAll);
router.patch('/:id/status', leadController.updateStatus);
router.put('/:id', leadController.update);
router.post('/:id/notes', leadController.addNote);
router.get('/:id/matches', leadController.getMatches);

router.get('/reminders', leadController.getUpcomingReminders);
router.post('/:id/follow-up', leadController.addFollowUp);

// Admin/Manager Only
router.patch('/:id/assign', managerOnly, leadController.assign);

export default router;
