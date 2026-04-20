import express from 'express';
import clientController from '../controllers/clientController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', clientController.create);
router.get('/', clientController.getAll);
router.get('/:id', clientController.getById);
router.post('/:id/interactions', clientController.addInteraction);
router.patch('/:id/link-property', clientController.linkProperty);

export default router;
