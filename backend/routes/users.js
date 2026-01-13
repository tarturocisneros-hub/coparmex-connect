const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Validation schemas
const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  company: Joi.string().min(2).max(100).optional(),
  position: Joi.string().min(2).max(100).optional(),
  phone: Joi.string().min(10).max(15).optional(),
  location: Joi.object({
    state: Joi.string().optional(),
    city: Joi.string().optional(),
    address: Joi.string().optional()
  }).optional(),
  preferences: Joi.object({
    notifications: Joi.object({
      challenges: Joi.boolean().optional(),
      messages: Joi.boolean().optional(),
      benefits: Joi.boolean().optional(),
      news: Joi.boolean().optional()
    }).optional(),
    privacy: Joi.object({
      showProfile: Joi.boolean().optional(),
      showCompany: Joi.boolean().optional(),
      showLocation: Joi.boolean().optional()
    }).optional()
  }).optional()
});

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   PUT /api/users/me
// @desc    Update current user profile
// @access  Private
router.put('/me', auth, async (req, res) => {
  try {
    // Validate input
    const { error } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userId = req.user.userId;
    const updateData = { ...req.body, updatedAt: new Date() };

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      success: true,
      message: 'Perfil actualizado correctamente',
      user
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Calculate days since joining
    const daysSinceJoining = Math.floor((new Date() - user.createdAt) / (1000 * 60 * 60 * 24));

    // Get user's ranking position (mock data for now)
    const nationalRanking = Math.floor(Math.random() * 1000) + 1;
    const localRanking = Math.floor(Math.random() * 50) + 1;

    const stats = {
      profile: {
        memberSince: user.createdAt,
        daysSinceJoining,
        membershipLevel: user.membershipLevel,
        profileType: user.profileType,
        hasBusinessProfile: !!user.businessProfile.sector
      },
      trivia: {
        totalGames: user.triviaStats.totalGames,
        totalCorrect: user.triviaStats.totalCorrect,
        totalPoints: user.triviaStats.totalPoints,
        bestStreak: user.triviaStats.bestStreak,
        accuracy: user.triviaStats.totalGames > 0 
          ? Math.round((user.triviaStats.totalCorrect / (user.triviaStats.totalGames * 5)) * 100)
          : 0,
        nationalRanking,
        localRanking
      },
      business: {
        profileViews: user.businessProfile.reviews?.length || 0,
        averageRating: user.businessProfile.rating || 0,
        totalReviews: user.businessProfile.reviews?.length || 0
      },
      activity: {
        lastLogin: user.lastLogin,
        profileCompleteness: calculateProfileCompleteness(user)
      }
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get users leaderboard
// @access  Private
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const { type = 'points', scope = 'national', limit = 50 } = req.query;

    let sortCriteria = {};
    switch (type) {
      case 'points':
        sortCriteria = { 'triviaStats.totalPoints': -1 };
        break;
      case 'games':
        sortCriteria = { 'triviaStats.totalGames': -1 };
        break;
      case 'accuracy':
        sortCriteria = { 'triviaStats.totalCorrect': -1 };
        break;
      default:
        sortCriteria = { 'triviaStats.totalPoints': -1 };
    }

    // Build match criteria based on scope
    let matchCriteria = { isActive: true };
    if (scope === 'local') {
      const currentUser = await User.findById(req.user.userId);
      if (currentUser && currentUser.location.state) {
        matchCriteria['location.state'] = currentUser.location.state;
      }
    }

    const leaderboard = await User.find(matchCriteria)
      .select('name lastName company location membershipLevel triviaStats')
      .sort(sortCriteria)
      .limit(parseInt(limit));

    // Add ranking and calculate accuracy
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      id: user._id,
      name: user.name,
      lastName: user.lastName,
      company: user.company,
      location: user.location,
      membershipLevel: user.membershipLevel,
      totalPoints: user.triviaStats.totalPoints,
      totalGames: user.triviaStats.totalGames,
      totalCorrect: user.triviaStats.totalCorrect,
      accuracy: user.triviaStats.totalGames > 0 
        ? Math.round((user.triviaStats.totalCorrect / (user.triviaStats.totalGames * 5)) * 100)
        : 0
    }));

    // Find current user's position
    const currentUserRank = rankedLeaderboard.findIndex(
      user => user.id.toString() === req.user.userId
    ) + 1;

    res.json({
      success: true,
      leaderboard: rankedLeaderboard,
      currentUserRank: currentUserRank || null,
      type,
      scope
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   POST /api/users/deactivate
// @desc    Deactivate user account
// @access  Private
router.post('/deactivate', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        isActive: false,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      success: true,
      message: 'Cuenta desactivada correctamente'
    });

  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Helper function to calculate profile completeness
function calculateProfileCompleteness(user) {
  let completeness = 0;
  const fields = [
    user.name,
    user.lastName,
    user.company,
    user.position,
    user.phone,
    user.location.state,
    user.location.city,
    user.profileType,
    user.businessProfile.sector
  ];

  const completedFields = fields.filter(field => field && field.trim() !== '').length;
  completeness = Math.round((completedFields / fields.length) * 100);

  return completeness;
}

module.exports = router;