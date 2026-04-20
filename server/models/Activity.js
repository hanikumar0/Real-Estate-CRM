import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  // Polymorphic Relation
  relatedType: { 
    type: String, 
    enum: ['LEAD', 'CLIENT', 'DEAL', 'PROPERTY'], 
    required: true,
    index: true 
  },
  relatedId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    index: true 
  },

  // Activity Definition
  type: { 
    type: String, 
    enum: ['CALL', 'EMAIL', 'SMS', 'NOTE', 'SYSTEM', 'FOLLOW_UP'], 
    required: true,
    index: true 
  },

  title: String,
  message: { type: String, required: true },

  // Ownership
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },

  // Automation & Metadata
  isAutomated: { type: Boolean, default: false },
  source: { 
    type: String, 
    enum: ['MANUAL', 'SYSTEM', 'N8N', 'TRIGGER'], 
    default: 'MANUAL' 
  },

  // Follow-up Logic
  followUpDate: { type: Date, index: true },
  followUpStatus: { 
    type: String, 
    enum: ['PENDING', 'DONE', 'MISSED'], 
    default: 'PENDING' 
  },

  isNotified: { type: Boolean, default: false }
}, { timestamps: true });

activitySchema.index({ createdAt: -1 });

export default mongoose.model('Activity', activitySchema);
