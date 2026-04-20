import express from 'express';
import propertyController from '../controllers/propertyController.js';
import { protect, managerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', propertyController.create);
router.get('/', propertyController.getAll);
router.put('/:id', propertyController.update);
router.patch('/:id/link-lead', propertyController.linkLead);
router.get('/:id/matches', propertyController.getMatches);

export default router;
