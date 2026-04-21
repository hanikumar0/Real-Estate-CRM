import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import dealRoutes from './routes/dealRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import userRoutes from './routes/userRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import path from 'path';

dotenv.config();

const app = express();

// Security Middlewares
const allowedOrigins = [
  'http://localhost:3000',
  'https://real-estate-crm-hazel.vercel.app',
  'https://real-estate-crm-git-main-hani-kumars-projects.vercel.app',
  'https://real-estate-crm-71em.vercel.app',
  process.env.FRONTEND_URL 
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      return origin.startsWith(allowedOrigin) || allowedOrigin.includes(origin);
    });

    if (isAllowed || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error('Blocked by CORS Production Policy'));
    }
  },
  credentials: true 
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Health Check / Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "EstateFlow SaaS Backend Running Successfully",
    version: "1.0.0",
    currentTime: new Date().toISOString()
  });
});

// Module Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/upload', uploadRoutes);

// 404 Handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: `API route ${req.originalUrl} not found` });
});

export default app;
