import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  phone: { type: String, required: true },
  email: { type: String },
  budget: { type: Number },
  locationPreference: { type: String },
  source: { 
    type: String, 
    enum: ['website', 'ads', 'referral', 'manual', 'n8n'], 
    default: 'manual' 
  },
  status: { 
    type: String, 
    enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'IN_DEAL', 'CONVERTED', 'LOST'], 
    default: 'NEW' 
  },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  notes: [{
    message: String,
    date: { type: Date, default: Date.now }
  }],
  followUps: [{
    date: Date,
    note: String,
    completed: { type: Boolean, default: false }
  }],
  archived: { type: Boolean, default: false, index: true }
}, { timestamps: true });

leadSchema.index({ status: 1, assignedAgent: 1 });

export default mongoose.model('Lead', leadSchema);
