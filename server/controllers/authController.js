import authService from '../services/authService.js';

class AuthController {
  async register(req, res) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({ message: 'User registered', user });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);
      res.status(200).json({ 
        token, 
        name: user.name, 
        role: user.role,
        id: user._id 
      });
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  }

  async getMe(req, res) {
    try {
      const user = await (await import('../models/User.js')).default.findById(req.user.userId).select('-password');
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

export default new AuthController();
