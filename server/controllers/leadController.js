import leadService from '../services/leadService.js';
import matchingService from '../services/matchingService.js';

class LeadController {
  async create(req, res) {
    try {
      const lead = await leadService.createLead(req.body);
      res.status(201).json(lead);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const leads = await leadService.getAllLeads(req.query, req.user);
      res.status(200).json(leads);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const lead = await leadService.updateStatus(req.params.id, status, req.user);
      res.status(200).json(lead);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async assign(req, res) {
    try {
      const { agentId } = req.body;
      const lead = await leadService.assignLead(req.params.id, agentId);
      res.status(200).json(lead);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async addNote(req, res) {
    try {
      const { content } = req.body;
      const lead = await leadService.addNote(req.params.id, content, req.user);
      res.status(200).json(lead);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getMatches(req, res) {
    try {
      const matches = await matchingService.getMatchesForLead(req.params.id);
      res.status(200).json(matches);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async update(req, res) {
    try {
      const lead = await leadService.updateLead(req.params.id, req.body, req.user);
      res.status(200).json(lead);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getTrackedStatus(req, res) {
    try {
      const { phone } = req.query;
      if (!phone) throw new Error('Phone number is required');
      const lead = await leadService.getLeadByPhone(phone);
      if (!lead) throw new Error('No lead found with this number');
      
      // Return redacted info for client privacy
      res.status(200).json({
        name: lead.name,
        status: lead.status,
        updatedAt: lead.updatedAt,
        source: lead.source,
        hasAgent: !!lead.assignedAgent
      });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }
  async addFollowUp(req, res) {
    try {
      const { date, note } = req.body;
      const lead = await leadService.addFollowUp(req.params.id, date, note, req.user);
      res.status(200).json(lead);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getUpcomingReminders(req, res) {
    try {
      const reminders = await leadService.getUpcomingFollowUps(req.user);
      res.status(200).json(reminders);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

export default new LeadController();
