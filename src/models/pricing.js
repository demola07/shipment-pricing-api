import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema({
  cargoType: {
    type: String,
    required: true,
    enum: ['standard', 'express', 'bulk', 'fragile']
  },
  basePrice: {
    type: Number,
    required: true
  },
  pricePerKm: {
    type: Number,
    required: true
  },
  pricePerKg: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'NGN',
    enum: ['NGN'] // Only NGN is allowed for storage
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for optimizing queries
pricingSchema.index({ cargoType: 1 });

export default mongoose.model('Pricing', pricingSchema); 