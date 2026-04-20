import express from 'express';
import leadController from '../controllers/leadController.js';
import { protect, adminOnly, managerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', leadController.create);
router.get('/', leadController.getAll);
router.patch('/:id/status', leadController.updateStatus);
router.post('/:id/notes', leadController.addNote);
router.get('/:id/matches', leadController.getMatches);

// Admin/Manager Only
router.patch('/:id/assign', managerOnly, leadController.assign);

export default router;
