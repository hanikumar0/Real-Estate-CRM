import analyticsService from '../services/analyticsService.js';

class AnalyticsController {
  async getDashboard(req, res) {
    try {
      const stats = await analyticsService.getDashboardKPIs(req.user);
      res.status(200).json(stats);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getSalesTrends(req, res) {
    try {
      const trends = await analyticsService.getRevenueTrends();
      res.status(200).json(trends);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getLeaderboard(req, res) {
    try {
      const ranking = await analyticsService.getAgentLeaderboard();
      res.status(200).json(ranking);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getSources(req, res) {
    try {
      const sources = await analyticsService.getLeadSources();
      res.status(200).json(sources);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getAdminStats(req, res) {
    try {
      const stats = await analyticsService.getAdminOverview();
      res.status(200).json(stats);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async testN8n(req, res) {
    try {
      const success = await analyticsService.testAutomation(req.user);
      res.status(200).json({ success });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

export default new AnalyticsController();
