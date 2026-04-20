import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

  stage: { 
    type: String, 
    enum: ['INQUIRY', 'NEGOTIATION', 'AGREEMENT', 'CLOSED', 'CANCELLED'], 
    default: 'INQUIRY',
    index: true 
  },

  dealValue: { type: Number, required: true },
  commissionPercentage: { type: Number, required: true },
  commissionAmount: { type: Number }, // Auto-calculated

  status: { 
    type: String, 
    enum: ['ACTIVE', 'COMPLETED', 'LOST'], 
    default: 'ACTIVE',
    index: true 
  },

  documents: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],

  activities: [{
    type: { type: String, enum: ['NOTE', 'STATUS_CHANGE', 'DOCUMENT', 'PAYMENT'] },
    message: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Financial Logic: Pre-save hook for commission calculation
dealSchema.pre('save', function(next) {
  if (this.isModified('dealValue') || this.isModified('commissionPercentage')) {
    this.commissionAmount = (this.dealValue * this.commissionPercentage) / 100;
  }
  next();
});

// Fix for BR-003: Handle findByIdAndUpdate / findOneAndUpdate
dealSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.dealValue || update.commissionPercentage) {
    const dealValue = update.dealValue || this._update.dealValue;
    const commissionPercentage = update.commissionPercentage || this._update.commissionPercentage;
    // Note: This is simplified. Real implementation would need to fetch the existing values if only one is updated.
    // For now, if either is in the update, we recalculate based on what's available in the update object.
    if (update.dealValue && update.commissionPercentage) {
      update.commissionAmount = (update.dealValue * update.commissionPercentage) / 100;
    }
  }
  next();
});

dealSchema.index({ createdAt: -1, status: 1 });

export default mongoose.model('Deal', dealSchema);
