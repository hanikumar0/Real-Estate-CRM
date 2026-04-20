import propertyService from '../services/propertyService.js';
import matchingService from '../services/matchingService.js';

class PropertyController {
  async create(req, res) {
    try {
      const property = await propertyService.createProperty(req.body, req.user);
      res.status(201).json(property);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const properties = await propertyService.getAllProperties(req.query, req.user);
      res.status(200).json(properties);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async update(req, res) {
    try {
      const property = await propertyService.updateProperty(req.params.id, req.body, req.user);
      res.status(200).json(property);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async linkLead(req, res) {
    try {
      const { leadId } = req.body;
      const property = await propertyService.linkLead(req.params.id, leadId);
      res.status(200).json(property);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getMatches(req, res) {
    try {
      const matches = await matchingService.getLeadsForProperty(req.params.id);
      res.status(200).json(matches);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

export default new PropertyController();
