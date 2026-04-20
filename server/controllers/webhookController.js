import leadService from '../services/leadService.js';

class WebhookController {
  async handleInboundLead(req, res) {
    const secret = req.headers['x-webhook-secret'];
    
    if (secret !== process.env.WEBHOOK_SECRET) {
      return res.status(401).json({ message: 'Invalid webhook secret' });
    }

    try {
      // Map common n8n/Typeform fields to our Lead model
      const leadData = {
        name: req.body.name || req.body.full_name || req.body.fullName,
        email: req.body.email,
        phone: req.body.phone || req.body.telephone,
        budget: req.body.budget || req.body.max_budget,
        locationPreference: req.body.location || req.body.region,
        source: req.body.source || 'WEBHOOK',
        notes: [{
          type: 'SYSTEM',
          message: `Captured via automated webhook. Raw data: ${JSON.stringify(req.body)}`
        }]
      };

      const lead = await leadService.createLead(leadData);
      res.status(201).json({ 
        message: 'Lead captured successfully', 
        leadId: lead._id 
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

export default new WebhookController();
