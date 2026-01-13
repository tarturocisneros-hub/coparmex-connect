const mongoose = require('mongoose');

const businessListingSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  sector: {
    type: String,
    required: true,
    enum: [
      'Construcción',
      'Tecnología',
      'Manufactura',
      'Servicios',
      'Comercio',
      'Turismo',
      'Agricultura',
      'Energía',
      'Salud',
      'Educación',
      'Finanzas',
      'Inmobiliario',
      'Transporte',
      'Alimentario',
      'Textil',
      'Otro'
    ]
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  services: [{
    type: String,
    trim: true,
    maxlength: 100
  }],
  location: {
    state: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    address: String
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  certifications: [{
    name: String,
    issuedBy: String,
    validUntil: Date
  }],
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
  reviews: [{
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 500
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
businessListingSchema.index({ sector: 1 });
businessListingSchema.index({ 'location.state': 1 });
businessListingSchema.index({ 'location.city': 1 });
businessListingSchema.index({ owner: 1 });
businessListingSchema.index({ isActive: 1 });
businessListingSchema.index({ 'rating.average': -1 });

// Update lastUpdated on save
businessListingSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Calculate average rating
businessListingSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating.average = Math.round((sum / this.reviews.length) * 10) / 10;
    this.rating.count = this.reviews.length;
  }
};

module.exports = mongoose.model('BusinessListing', businessListingSchema);