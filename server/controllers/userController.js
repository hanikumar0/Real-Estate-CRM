import userService from '../services/userService.js';

class UserController {
  async create(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const users = await userService.getAllUsers(req.query);
      res.status(200).json(users);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getPerformance(req, res) {
    try {
      const analytics = await userService.getPerformanceAnalytics();
      res.status(200).json(analytics);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async updateRole(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, { role: req.body.role });
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

export default new UserController();
