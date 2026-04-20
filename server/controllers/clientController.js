import clientService from '../services/clientService.js';

class ClientController {
  async create(req, res) {
    try {
      const client = await clientService.createClient(req.body);
      res.status(201).json(client);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const clients = await clientService.getAllClients(req.query, req.user);
      res.status(200).json(clients);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getById(req, res) {
    try {
      const client = await clientService.getClientById(req.params.id);
      res.status(200).json(client);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  async addInteraction(req, res) {
    try {
      const client = await clientService.addInteraction(req.params.id, req.body);
      res.status(200).json(client);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async linkProperty(req, res) {
    try {
      const client = await clientService.linkProperty(req.params.id, req.body.propertyId);
      res.status(200).json(client);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

export default new ClientController();
