import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Route Imports
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

dotenv.config();

const app = express();

const allowedOrigins = [/localhost/, /\.vercel\.app$/];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.some(pattern => {
      if (typeof pattern === 'string') return origin === pattern;
      return pattern.test(origin);
    })) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked by Production Policy"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

app.options("*", cors()); // Enable pre-flight for all routes

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ======================
// CORE SYSTEM ROUTES
// ======================

// Root Health Check
app.get("/", (req, res) => {
  res.status(200).send("Backend Running Successfully");
});

// API Health Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "API Healthy",
    timestamp: new Date().toISOString()
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

// ======================
// ERROR MIDDLEWARE
// ======================
app.use((err, req, res, next) => {
  console.error(`[Error] ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export default app;
