import dealService from '../services/dealService.js';

class DealController {
  async create(req, res) {
    try {
      const deal = await dealService.createDeal(req.body, req.user);
      res.status(201).json(deal);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const deals = await dealService.getAllDeals(req.query, req.user);
      res.status(200).json(deals);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async updateStage(req, res) {
    try {
      const deal = await dealService.updateStage(req.params.id, req.body.stage, req.user);
      res.status(200).json(deal);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async update(req, res) {
    try {
      const deal = await dealService.updateDeal(req.params.id, req.body, req.user);
      res.status(200).json(deal);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getRevenue(req, res) {
    try {
      const summary = await dealService.getRevenueSummary();
      res.status(200).json(summary[0] || { totalRevenue: 0, totalCommission: 0, dealCount: 0 });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

export default new DealController();
