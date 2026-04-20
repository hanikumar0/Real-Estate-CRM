import express from 'express';
import webhookController from '../controllers/webhookController.js';

const router = express.Router();

// No global protect middleware here as it's hit by n8n
// Security is handled via X-Webhook-Secret header
router.post('/lead-capture', webhookController.handleInboundLead);

export default router;
