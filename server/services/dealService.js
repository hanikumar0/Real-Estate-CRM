import Deal from '../models/Deal.js';
import Lead from '../models/Lead.js';
import Client from '../models/Client.js';
import mongoose from 'mongoose';
import analyticsService from './analyticsService.js';

class DealService {
  async createDeal(data, user) {
    // BR-002: Fetch client and linked lead to validate status and update it
    const client = await Client.findById(data.clientId).populate('linkedLead');
    if (!client) throw new Error('Client not found');
    
    const lead = client.linkedLead;
    if (!lead) throw new Error('No linked lead found for this client');

    // PRD Validation: A Deal cannot be created unless the Lead's status is "QUALIFIED"
    if (lead.status !== 'QUALIFIED') {
      throw new Error(`Lead must be QUALIFIED to create a deal. Current status: ${lead.status}`);
    }

    const deal = await Deal.create({
      ...data,
      activities: [{
        type: 'STATUS_CHANGE',
        message: 'Deal initialized in Inquiry stage',
        createdBy: user.userId
      }]
    });

    // BR-002 Fix: Update lead status to uppercase 'IN_DEAL'
    lead.status = 'IN_DEAL';
    lead.notes.push({
      message: `Lead moved to Deal phase (Deal ID: ${deal._id})`,
      createdBy: user.userId
    });
    await lead.save();

    // Notify n8n
    if (process.env.N8N_WEBHOOK_URL) {
      this._notifyN8n('DEAL_INITIALIZED', deal);
    }

    return deal;
  }

  async getAllDeals(filters, user) {
    const query = {};
    if (user.role === 'AGENT') query.agentId = user.userId;
    if (filters.stage) query.stage = filters.stage;

    return await Deal.find(query)
      .populate('clientId', 'name email')
      .populate('propertyId', 'title price')
      .populate('agentId', 'name')
      .sort({ createdAt: -1 });
  }

  async updateStage(id, stage, user) {
    const deal = await Deal.findById(id);
    if (!deal) throw new Error('Deal not found');

    if (user.role === 'AGENT' && deal.agentId.toString() !== user.userId) {
      throw new Error('Unauthorized');
    }

    deal.stage = stage;
    deal.activities.push({
      type: 'STATUS_CHANGE',
      message: `Stage updated to ${stage}`,
      createdBy: user.userId
    });

    if (stage === 'CLOSED') {
      deal.status = 'COMPLETED';
    }

    const updatedDeal = await deal.save();

    // Notify n8n
    if (process.env.N8N_WEBHOOK_URL) {
      this._notifyN8n('DEAL_STAGE_UPDATED', {
        dealId: id,
        newStage: stage,
        updatedBy: user.userId
      });
      
      if (stage === 'CLOSED') {
        this._notifyN8n('DEAL_CLOSED', {
          dealId: id,
          revenue: updatedDeal.dealValue,
          commission: updatedDeal.commissionAmount
        });

        // Trigger leaderboard re-evaluation and n8n notifications for promotions
        analyticsService.checkAndNotifyRankChanges().catch(err => 
          console.error('[Analytics_Trigger_Error]', err.message)
        );
      }
    }

    return updatedDeal;
  }

  async updateDeal(id, updateData, user) {
    const deal = await Deal.findById(id);
    if (!deal) throw new Error('Deal not found');

    if (user.role === 'AGENT' && deal.agentId.toString() !== user.userId) {
      throw new Error('Unauthorized');
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      deal[key] = updateData[key];
    });

    // Save triggers the pre('save') hook in Deal.js for commission calculation
    return await deal.save();
  }

  async addDocument(id, documentData, user) {
    const deal = await Deal.findById(id);
    if (!deal) throw new Error('Deal not found');

    if (user.role === 'AGENT' && deal.agentId.toString() !== user.userId) {
      throw new Error('Unauthorized');
    }

    deal.documents.push(documentData);
    deal.activities.push({
      type: 'DOCUMENT_UPLOAD',
      message: `Document added: ${documentData.title}`,
      createdBy: user.userId
    });

    return await deal.save();
  }

  async getRevenueSummary() {
    return await Deal.aggregate([
      { $match: { stage: 'CLOSED' } },
      { 
        $group: { 
          _id: null, 
          totalRevenue: { $sum: '$dealValue' }, 
          totalCommission: { $sum: '$commissionAmount' },
          dealCount: { $sum: 1 }
        } 
      }
    ]);
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

export default new DealService();
