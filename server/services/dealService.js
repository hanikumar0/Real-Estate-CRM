import Deal from '../models/Deal.js';
import mongoose from 'mongoose';
import analyticsService from './analyticsService.js';

class DealService {
  async createDeal(data, user) {
    const deal = await Deal.create({
      ...data,
      activities: [{
        type: 'STATUS_CHANGE',
        message: 'Deal initialized in Inquiry stage',
        createdBy: user.userId
      }]
    });

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
