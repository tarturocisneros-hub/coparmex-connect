const mongoose = require('mongoose');

const benefitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Descuentos',
      'Servicios',
      'Capacitación',
      'Networking',
      'Tecnología',
      'Salud',
      'Viajes',
      'Entretenimiento',
      'Financiero',
      'Legal',
      'Otro'
    ]
  },
  provider: {
    name: {
      type: String,
      required: true
    },
    contact: {
      email: String,
      phone: String,
      website: String
    },
    logo: String
  },
  discount: {
    type: {
      type: String,
      enum: ['percentage', 'fixed', 'special'],
      default: 'percentage'
    },
    value: Number,
    description: String
  },
  location: {
    type: {
      type: String,
      enum: ['national', 'regional', 'local', 'online'],
      default: 'national'
    },
    states: [String],
    cities: [String],
    addresses: [String]
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },
  terms: {
    type: String,
    maxlength: 2000
  },
  howToRedeem: {
    type: String,
    required: true,
    maxlength: 500
  },
  maxUsagePerUser: {
    type: Number,
    default: null // null = unlimited
  },
  totalUsageLimit: {
    type: Number,
    default: null // null = unlimited
  },
  currentUsage: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  images: [String],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
benefitSchema.index({ category: 1 });
benefitSchema.index({ isActive: 1 });
benefitSchema.index({ isFeatured: 1 });
benefitSchema.index({ validUntil: 1 });
benefitSchema.index({ 'location.type': 1 });
benefitSchema.index({ tags: 1 });

// Check if benefit is still valid
benefitSchema.methods.isValid = function() {
  return this.isActive && this.validUntil > new Date();
};

// Check if benefit has usage left
benefitSchema.methods.hasUsageLeft = function() {
  if (this.totalUsageLimit === null) return true;
  return this.currentUsage < this.totalUsageLimit;
};

module.exports = mongoose.model('Benefit', benefitSchema);