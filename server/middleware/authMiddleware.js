import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.startsWith('Bearer') 
    ? req.headers.authorization.split(' ')[1] 
    : null;

  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

export const managerOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'MANAGER' || req.user.role === 'ADMIN')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a manager' });
  }
};
