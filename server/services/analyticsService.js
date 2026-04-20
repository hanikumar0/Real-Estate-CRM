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

  async getAdminOverview() {
    const [agents, traffic, leads, deals] = await Promise.all([
      User.countDocuments({ role: 'AGENT' }),
      // Mocking traffic but could be from logs in real app
      Promise.resolve(98542), 
      Lead.countDocuments({}),
      Deal.countDocuments({})
    ]);

    return {
      totalAgents: agents,
      apiTraffic: traffic,
      totalLeads: leads,
      totalDeals: deals
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

  async testAutomation(user) {
    console.log(`[N8N_TEST] Manual trigger initiated by ${user.userId}`);
    return await this._notifyN8n('TEST_PULSE', {
      msg: 'EstateFlow Automation Health Check',
      triggeredBy: user.userId,
      timestamp: new Date().toISOString()
    });
  }

  async _notifyN8n(event, payload) {
    try {
      const webhookUrl = process.env.N8N_WEBHOOK_URL;
      const secret = process.env.WEBHOOK_SECRET;

      if (!webhookUrl) {
        console.warn('⚠️  [N8N_SKIP] No webhook URL configured. Skipping notification.');
        return;
      }

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': secret
        },
        body: JSON.stringify({ event, payload })
      });

      if (res.ok) {
        console.log(`🚀 [N8N_SUCCESS] Event: ${event} delivered successfully.`);
      } else {
        const errText = await res.text();
        console.error(`❌ [N8N_FAILURE] Event: ${event} failed with status ${res.status}: ${errText}`);
      }
      return res.ok;
    } catch (err) {
      console.error('❌ [N8N_ERROR]', err.message);
      return false;
    }
  }
}

export default new AnalyticsService();
