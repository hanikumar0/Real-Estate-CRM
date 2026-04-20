import activityService from '../services/activityService.js';

class ActivityController {
  async create(req, res) {
    try {
      const activity = await activityService.logActivity(req.body, req.user);
      res.status(201).json(activity);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getTimeline(req, res) {
    try {
      const timeline = await activityService.getTimeline(req.query, req.user);
      res.status(200).json(timeline);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getFollowUps(req, res) {
    try {
      const followups = await activityService.getFollowUps(req.user);
      res.status(200).json(followups);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async webhookIngest(req, res) {
    try {
      // n8n Specific Formatting
      const activity = await activityService.logActivity({
        ...req.body,
        source: 'N8N',
        isAutomated: true
      }, null);
      res.status(200).json({ status: 'success', activityId: activity._id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default new ActivityController();
