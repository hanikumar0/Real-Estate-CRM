import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Route Imports (Point to the existing routes folder)
import authRoutes from '../routes/authRoutes.js';
import leadRoutes from '../routes/leadRoutes.js';
import propertyRoutes from '../routes/propertyRoutes.js';
import clientRoutes from '../routes/clientRoutes.js';
import dealRoutes from '../routes/dealRoutes.js';
import activityRoutes from '../routes/activityRoutes.js';
import userRoutes from '../routes/userRoutes.js';
import analyticsRoutes from '../routes/analyticsRoutes.js';
import webhookRoutes from '../routes/webhookRoutes.js';
import uploadRoutes from '../routes/uploadRoutes.js';

dotenv.config();

const app = express();

// ==================================================
// DATABASE CONNECTION (SERVERLESS READY)
// ==================================================
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Production DB Connected');
    } catch (err) {
        console.error('❌ DB Error:', err.message);
    }
};

app.use(cors({
  origin: (origin, callback) => {
    // Allow if no origin (server-to-server), localhost, or any vercel.app subdomain
    if (!origin || origin.includes('localhost') || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

// Handle OPTIONS preflight globally
app.options("*", cors());

// ==================================================
// MIDDLEWARE ORDERING
// ==================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to DB for every request
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// ==================================================
// CORE ROUTES
// ==================================================

// Root route
app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

// API health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API Healthy" });
});

// Module routes
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

// ==================================================
// GLOBAL ERROR HANDLER
// ==================================================
app.use((err, req, res, next) => {
  console.error(`[Production Error] ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

export default app;
