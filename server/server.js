import dotenv from 'dotenv';
import app from './app.js';
import mongoose from 'mongoose';

// Load Env BEFORE any other imports use them
dotenv.config();

const PORT = process.env.PORT || 5000;

// Centralized Connection Logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ EstateFlow SaaS DB Connected (MongoDB)');
  } catch (err) {
    console.error('❌ DB Connection Error:', err.message);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 EstateFlow Master API running on port ${PORT}`);
  });
});
