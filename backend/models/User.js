const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  memberNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
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
  membershipLevel: {
    type: String,
    enum: ['Socio Activo', 'Socio Líder Bronce', 'Socio Líder Plata', 'Socio Líder Oro', 'Socio Líder Platino'],
    default: 'Socio Activo'
  },
  profileType: {
    type: String,
    enum: ['humanista', 'tecnico', 'industrial', 'innovacion'],
    default: null
  },
  profileAnswers: [{
    questionId: Number,
    answer: String,
    profile: String
  }],
  recommendedCommissions: [String],
  triviaStats: {
    totalGames: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    categoryStats: {
      emprendimiento: { played: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
      finanzas: { played: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
      gobernabilidad: { played: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
      empresasFamiliares: { played: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
      economia: { played: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
      leyesLaborales: { played: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
      comercioExterior: { played: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
      filosofiaCoparmex: { played: { type: Number, default: 0 }, correct: { type: Number, default: 0 } }
    }
  },
  businessProfile: {
    sector: String,
    services: [String],
    description: String,
    website: String,
    socialMedia: {
      linkedin: String,
      facebook: String,
      twitter: String,
      instagram: String
    },
    verified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviews: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: Number,
      comment: String,
      date: { type: Date, default: Date.now }
    }]
  },
  preferences: {
    notifications: {
      challenges: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      benefits: { type: Boolean, default: true },
      news: { type: Boolean, default: true }
    },
    privacy: {
      showProfile: { type: Boolean, default: true },
      showCompany: { type: Boolean, default: true },
      showLocation: { type: Boolean, default: true }
    }
  },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.name} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);