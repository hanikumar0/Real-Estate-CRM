import Lead from '../models/Lead.js';

class LeadService {
  async createLead(data) {
    const lead = await Lead.create(data);

    // Notify n8n if configured
    if (process.env.N8N_WEBHOOK_URL) {
      this._notifyN8n('LEAD_CREATED', lead);
    }

    return lead;
  }

  async getAllLeads(filters, user) {
    const query = {};
    
    // Role-based isolation
    if (user.role === 'AGENT') {
      query.assignedAgent = user.userId;
    }

    query.archived = false;

    if (filters.status) query.status = filters.status;
    if (filters.source) query.source = filters.source;
    if (filters.search) {
      query.$or = [
        { name: new RegExp(filters.search, 'i') },
        { email: new RegExp(filters.search, 'i') },
        { phone: new RegExp(filters.search, 'i') }
      ];
    }

    return await Lead.find(query)
      .populate('assignedAgent', 'name email')
      .sort({ createdAt: -1 });
  }

  async getLeadById(id, user) {
    const lead = await Lead.findOne({ _id: id, archived: false }).populate('assignedAgent', 'name email');
    if (!lead) throw new Error('Lead not found');
    
    if (user.role === 'AGENT' && lead.assignedAgent?._id.toString() !== user.userId) {
      throw new Error('Access denied');
    }
    
    return lead;
  }

  async updateStatus(id, status, user) {
    const lead = await Lead.findOne({ _id: id, archived: false });
    if (!lead) throw new Error('Lead not found');

    // RBAC Check
    if (user.role === 'AGENT' && lead.assignedAgent?.toString() !== user.userId) {
      throw new Error('Access denied');
    }

    const oldStatus = lead.status;
    lead.status = status;
    lead.notes.push({
      message: `Status updated to ${status}`,
      createdBy: user.userId
    });
    
    const updatedLead = await lead.save();

    // Notify n8n of status change
    if (process.env.N8N_WEBHOOK_URL) {
      this._notifyN8n('LEAD_STATUS_UPDATED', {
        lead: updatedLead,
        oldStatus,
        newStatus: status,
        updatedBy: user.userId
      });
    }

    return updatedLead;
  }

  async assignLead(id, agentId) {
    const lead = await Lead.findById(id);
    if (!lead) throw new Error('Lead not found');

    lead.assignedAgent = agentId;
    lead.notes.push({
      message: `Lead assigned to agent ${agentId}`,
      createdBy: 'SYSTEM'
    });

    return await lead.save();
  }

  async addNote(id, content, user) {
    const lead = await Lead.findOne({ _id: id, archived: false });
    if (!lead) throw new Error('Lead not found');

    lead.notes.push({
      message: content,
      createdBy: user.userId
    });

    return await lead.save();
  }

  async archiveLead(id, user) {
    const lead = await Lead.findById(id);
    if (!lead) throw new Error('Lead not found');

    if (user.role === 'AGENT' && lead.assignedAgent?.toString() !== user.userId) {
      throw new Error('Access denied');
    }

    lead.archived = true;
    return await lead.save();
  }

  // Helper for n8n automation
  async _notifyN8n(event, payload) {
    try {
      await fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Webhook-Secret': process.env.WEBHOOK_SECRET || ''
        },
        body: JSON.stringify({
          source: 'ESTATEFLOW_CRM',
          event,
          timestamp: new Date().toISOString(),
          payload
        })
      });
    } catch (err) {
      console.warn(`[Automation] n8n notification failed for ${event}:`, err.message);
    }
  }
}

export default new LeadService();
