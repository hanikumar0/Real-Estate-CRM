import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  phone: { type: String, required: true, index: true },
  email: { type: String, index: true },
  
  type: { 
    type: String, 
    enum: ['BUYER', 'SELLER'], 
    default: 'BUYER',
    index: true 
  },

  preferences: {
    budget: Number,
    location: String,
    propertyType: { type: String, enum: ['RESIDENTIAL', 'COMMERCIAL'] },
    bedrooms: Number,
    bathrooms: Number,
    notes: String
  },

  linkedLead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', index: true },
  interestedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  deals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Deal' }],

  interactions: [
    {
      type: { type: String, enum: ['CALL', 'EMAIL', 'MEETING', 'NOTE'] },
      message: String,
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    }
  ],

  status: { 
    type: String, 
    enum: ['ACTIVE', 'INACTIVE', 'CONVERTED'], 
    default: 'ACTIVE',
    index: true 
  }
}, { timestamps: true });

clientSchema.index({ email: 1, phone: 1 }, { unique: true });

export default mongoose.model('Client', clientSchema);
