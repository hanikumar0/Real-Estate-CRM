import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

class AuthService {
  async register(userData) {
    const { email, password, name } = userData;
    // Explicitly ignore any 'role' passed in userData to prevent privilege escalation (BR-001)

    const normalizedEmail = email.toLowerCase().trim(); // BR-005
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) throw new Error('User already exists');

    return await User.create({
      name,
      email: normalizedEmail,
      password,
      role: 'AGENT' // Default role for new signups
    });
  }

  async login(email, password) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { user, token };
  }
}

export default new AuthService();
