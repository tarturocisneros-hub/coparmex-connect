const mongoose = require('mongoose');

const triviaGameSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Emprendimiento', 'Finanzas Sanas', 'Gobernabilidad', 'Empresas Familiares', 'Economía', 'Leyes Laborales', 'Comercio Exterior', 'Filosofía COPARMEX']
  },
  questions: [{
    questionId: {
      type: Number,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: Number,
      required: true
    },
    userAnswer: {
      type: Number,
      default: null
    },
    isCorrect: {
      type: Boolean,
      default: false
    },
    timeSpent: {
      type: Number,
      default: 0
    },
    points: {
      type: Number,
      default: 0
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true
    },
    answered: {
      type: Boolean,
      default: false
    }
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  },
  totalAnswered: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TriviaChallenge',
    default: null
  },
  isChallenge: {
    type: Boolean,
    default: false
  }
});

// Index for better query performance
triviaGameSchema.index({ userId: 1, status: 1 });
triviaGameSchema.index({ category: 1, status: 1 });
triviaGameSchema.index({ totalPoints: -1 });
triviaGameSchema.index({ completedAt: -1 });

// Virtual for game duration
triviaGameSchema.virtual('duration').get(function() {
  if (this.completedAt && this.startedAt) {
    return Math.round((this.completedAt - this.startedAt) / 1000); // in seconds
  }
  return null;
});

// Virtual for accuracy percentage
triviaGameSchema.virtual('accuracy').get(function() {
  if (this.questions.length === 0) return 0;
  return Math.round((this.correctAnswers / this.questions.length) * 100);
});

// Ensure virtual fields are serialized
triviaGameSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('TriviaGame', triviaGameSchema);