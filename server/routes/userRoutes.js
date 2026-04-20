import express from 'express';
import userController from '../controllers/userController.js';
import { protect, adminOnly, managerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Admin Only - Lifecycle Management
router.post('/', adminOnly, userController.create);
router.get('/', managerOnly, userController.getAll);

// Performance & Analytics
router.get('/performance', managerOnly, userController.getPerformance);

// Role & Status
router.patch('/:id/role', adminOnly, userController.updateRole);
router.patch('/:id/status', adminOnly, userController.updateStatus);

export default router;
