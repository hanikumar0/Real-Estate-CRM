import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, index: 'text' },
  description: { type: String, required: true, index: 'text' },
  type: { 
    type: String, 
    enum: ['RESIDENTIAL', 'COMMERCIAL'], 
    default: 'RESIDENTIAL' 
  },
  price: { type: Number, required: true, index: true },
  location: { type: String, required: true, index: true },
  coordinates: {
    lat: Number,
    lng: Number
  },
  size: { type: Number }, // sqft
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  amenities: [String],
  images: {
    type: [{
      url: String,
      publicId: String
    }],
    validate: [arrayLimit, '{PATH} exceeds the limit of 10']
  },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  linkedLeads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lead' }],
  status: { 
    type: String, 
    enum: ['AVAILABLE', 'SOLD', 'RENTED', 'INACTIVE'], 
    default: 'AVAILABLE' 
  }
}, { timestamps: true });

propertySchema.index({ price: 1, type: 1, status: 1 });

function arrayLimit(val) {
  return val.length <= 10;
}

export default mongoose.model('Property', propertySchema);
