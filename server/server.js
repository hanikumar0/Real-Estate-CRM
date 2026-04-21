import dotenv from 'dotenv';
import app from './app.js';
import mongoose from 'mongoose';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Database Connection Logic
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ EstateFlow SaaS DB Connected (MongoDB)');
  } catch (err) {
    console.error('❌ DB Connection Error:', err.message);
  }
};

// Middleware to ensure DB is connected for every request on Vercel
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Only listen if running locally (Vercel ignores this)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 EstateFlow Master API running on port ${PORT}`);
    });
  });
}

// Export for Vercel Serverless Functions
export default app;
