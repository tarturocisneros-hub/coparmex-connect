const mongoose = require('mongoose');

const benefitUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  benefitId: {
    type: Number,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  discount: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  status: {
    type: String,
    enum: ['active', 'used', 'expired'],
    default: 'active'
  },
  usedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Codes expire after 24 hours
      return new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
  },
  metadata: {
    deviceInfo: String,
    ipAddress: String,
    userAgent: String
  }
});

// Index for better query performance
benefitUsageSchema.index({ userId: 1, usedAt: -1 });
benefitUsageSchema.index({ benefitId: 1 });
benefitUsageSchema.index({ code: 1 });
benefitUsageSchema.index({ expiresAt: 1 });

// Virtual for checking if code is expired
benefitUsageSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiresAt;
});

// Ensure virtual fields are serialized
benefitUsageSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('BenefitUsage', benefitUsageSchema);