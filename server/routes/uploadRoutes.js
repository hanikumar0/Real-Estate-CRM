import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import uploadController from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// protect middleware ensures only logged-in users can upload
router.post('/single', protect, upload.single('file'), uploadController.uploadSingle);
router.post('/multiple', protect, upload.array('files', 10), uploadController.uploadMultiple);

export default router;
