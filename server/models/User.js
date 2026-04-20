import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  password: { type: String, required: true },

  // Role System
  role: { 
    type: String, 
    enum: ['ADMIN', 'MANAGER', 'AGENT'], 
    default: 'AGENT',
    index: true 
  },

  // Status Control
  status: { 
    type: String, 
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], 
    default: 'ACTIVE',
    index: true 
  },

  // Agent-Specific Data
  agentProfile: {
    phone: String,
    experience: Number,
    specialization: { type: String, enum: ['RESIDENTIAL', 'COMMERCIAL', 'BOTH'] },
    region: String,
    commissionRate: { type: Number, default: 0 }
  },

  // Performance Metrics (Real-time snapshots)
  performance: {
    leadsAssigned: { type: Number, default: 0 },
    leadsConverted: { type: Number, default: 0 },
    dealsClosed: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    lastKnownRank: { type: Number, default: 0 }
  },

  // Workload Tracking
  workload: {
    activeLeads: { type: Number, default: 0 },
    activeDeals: { type: Number, default: 0 },
    activeProperties: { type: Number, default: 0 }
  },

  // System Metadata
  lastLogin: Date
}, { timestamps: true });

// Password hashing handled in auth service or here
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export default mongoose.model('User', userSchema);
