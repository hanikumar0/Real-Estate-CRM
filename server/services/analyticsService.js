import Lead from '../models/Lead.js';
import Deal from '../models/Deal.js';
import User from '../models/User.js';
import Property from '../models/Property.js';
import mongoose from 'mongoose';

class AnalyticsService {
  async getDashboardKPIs(user) {
    const filters = user.role === 'AGENT' ? { assignedAgent: new mongoose.Types.ObjectId(user.userId) } : {};
    const dealFilters = user.role === 'AGENT' ? { agentId: new mongoose.Types.ObjectId(user.userId) } : {};

    const [leads, deals, revenue] = await Promise.all([
      Lead.countDocuments(filters),
      Deal.countDocuments(dealFilters),
      Deal.aggregate([
        { $match: { ...dealFilters, stage: 'CLOSED' } },
        { $group: { _id: null, total: { $sum: '$dealValue' } } }
      ])
    ]);

    return {
      totalLeads: leads,
      totalDeals: deals,
      totalRevenue: revenue[0]?.total || 0,
      conversionRate: leads > 0 ? ((deals / leads) * 100).toFixed(1) : 0
    };
  }

  async getRevenueTrends() {
    return await Deal.aggregate([
      { $match: { stage: 'CLOSED' } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$dealValue" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
  }

  async getAgentLeaderboard() {
    return await User.aggregate([
      { $match: { role: 'AGENT', status: 'ACTIVE' } },
      {
        $project: {
          name: 1,
          revenue: "$performance.totalRevenue",
          deals: "$performance.dealsClosed",
          score: {
            $add: [
              { $multiply: ["$performance.dealsClosed", 50] },
              { $multiply: ["$performance.leadsConverted", 20] },
              { $divide: ["$performance.totalRevenue", 1000] }
            ]
          }
        }
      },
      { $sort: { score: -1 } },
      { $limit: 10 }
    ]);
  }

  async getLeadSources() {
    return await Lead.aggregate([
      { $group: { _id: "$source", value: { $sum: 1 } } },
      { $project: { name: "$_id", value: 1, _id: 0 } }
    ]);
  }

  /**
   * Monitor leaderboard changes and notify n8n on rank promotion
   */
  async checkAndNotifyRankChanges() {
    // 1. Calculate current global ranking
    const currentRanking = await this.getAgentLeaderboard();
    
    // 2. Iterate through Top 10
    for (let i = 0; i < currentRanking.length; i++) {
        const currentAgent = currentRanking[i];
        const newRank = i + 1;
        
        // Fetch full user to check saved rank
        const user = await User.findById(currentAgent._id);
        const oldRank = user.performance.lastKnownRank || 999;
        
        // 3. Detect promotion
        if (newRank < oldRank) {
            console.log(`[LEADERBOARD] Agent ${user.name} promoted from #${oldRank} to #${newRank}`);
            
            // Update saved rank
            user.performance.lastKnownRank = newRank;
            await user.save();
            
            // 4. Notify n8n
            await this._notifyN8n({
                event: 'AGENT_RANK_PROMOTED',
                agent: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.agentProfile?.phone
                },
                rank: {
                    previous: oldRank === 999 ? 'Unranked' : oldRank,
                    current: newRank
                },
                stats: {
                    score: currentAgent.score,
                    deals: currentAgent.deals,
                    revenue: currentAgent.revenue
                },
                timestamp: new Date().toISOString()
            });
        } else if (newRank > oldRank) {
            // Updated rank even if they moved down (to keep track)
            // but we don't notify them of demotion to keep it positive
            user.performance.lastKnownRank = newRank;
            await user.save();
        }
    }
  }

  async _notifyN8n(payload) {
    try {
      const webhookUrl = process.env.N8N_WEBHOOK_URL;
      const secret = process.env.WEBHOOK_SECRET;

      if (!webhookUrl) return;

      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': secret
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('[N8N_ERROR]', err.message);
    }
  }
}

export default new AnalyticsService();
