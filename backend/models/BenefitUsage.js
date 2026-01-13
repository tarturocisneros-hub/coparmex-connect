const mongoose = require('mongoose');

const benefitUsageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  benefit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Benefit',
    required: true
  },
  usageDate: {
    type: Date,
    default: Date.now
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
    city: String,
    state: String
  },
  redemptionCode: {
    type: String,
    unique: true,
    sparse: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'used', 'expired', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: 500
  },
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 500
    },
    date: Date
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    deviceType: String
  }
}, {
  timestamps: true
});

// Indexes
benefitUsageSchema.index({ user: 1 });
benefitUsageSchema.index({ benefit: 1 });
benefitUsageSchema.index({ usageDate: -1 });
benefitUsageSchema.index({ status: 1 });
benefitUsageSchema.index({ redemptionCode: 1 });

// Compound indexes
benefitUsageSchema.index({ user: 1, benefit: 1 });
benefitUsageSchema.index({ user: 1, usageDate: -1 });

// Generate unique redemption code
benefitUsageSchema.pre('save', function(next) {
  if (!this.redemptionCode && this.isNew) {
    this.redemptionCode = generateRedemptionCode();
  }
  next();
});

// Helper function to generate redemption code
function generateRedemptionCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Static method to get user usage count for a benefit
benefitUsageSchema.statics.getUserUsageCount = function(userId, benefitId) {
  return this.countDocuments({ 
    user: userId, 
    benefit: benefitId,
    status: { $in: ['confirmed', 'used'] }
  });
};

// Static method to get usage statistics
benefitUsageSchema.statics.getUsageStats = function(benefitId, startDate, endDate) {
  const match = { benefit: benefitId };
  if (startDate || endDate) {
    match.usageDate = {};
    if (startDate) match.usageDate.$gte = startDate;
    if (endDate) match.usageDate.$lte = endDate;
  }

  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('BenefitUsage', benefitUsageSchema);