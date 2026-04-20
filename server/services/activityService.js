import Activity from '../models/Activity.js';

class ActivityService {
  async logActivity(data, user) {
    const activity = await Activity.create({
      ...data,
      createdBy: user ? user.userId : null,
      isAutomated: !user
    });

    // Trigger Side-Effects (Rule Engine)
    await this.processAutomationRules(activity);

    // Notify n8n
    if (process.env.N8N_WEBHOOK_URL) {
      this._notifyN8n('ACTIVITY_LOGGED', activity);
    }

    return activity;
  }

  async getTimeline(filters, user) {
    const query = {};
    if (filters.relatedId) query.relatedId = filters.relatedId;
    if (filters.relatedType) query.relatedType = filters.relatedType;
    if (filters.type) query.type = filters.type;

    const limit = Number(filters.limit) || 30;
    const skip = (Number(filters.page) - 1 || 0) * limit;

    return await Activity.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async getFollowUps(user) {
    const query = { type: 'FOLLOW_UP', followUpStatus: 'PENDING' };
    if (user.role === 'AGENT') query.createdBy = user.userId;

    return await Activity.find(query)
      .sort({ followUpDate: 1 })
      .limit(50);
  }

  async processAutomationRules(activity) {
    // Lightweight Automation Engine IF/THEN logic
    if (activity.type === 'FOLLOW_UP' && !activity.isNotified) {
      console.log(`[AUTOMATION] Notification triggered for follow-up: ${activity._id}`);
      
      // Notify n8n for real-time alerting (WhatsApp/Slack)
      if (process.env.N8N_WEBHOOK_URL) {
        this._notifyN8n('FOLLOW_UP_TRIGGERED', activity);
      }
    }
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

export default new ActivityService();
