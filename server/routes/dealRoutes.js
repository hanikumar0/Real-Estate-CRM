import express from 'express';
import dealController from '../controllers/dealController.js';
import { protect, managerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', dealController.create);
router.get('/', dealController.getAll);
router.get('/revenue/summary', managerOnly, dealController.getRevenue);
router.patch('/:id/stage', dealController.updateStage);
router.put('/:id', dealController.update);

export default router;
