const express = require('express');
const User = require('../models/User');
const TriviaGame = require('../models/TriviaGame');
const ChatSession = require('../models/ChatSession');
const BenefitUsage = require('../models/BenefitUsage');
const auth = require('../middleware/auth');
const router = express.Router();

// Admin middleware (in production, implement proper admin role checking)
const adminAuth = async (req, res, next) => {
  try {
    // For demo purposes, allow all authenticated users to access admin routes
    // In production, check if user has admin role
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // In production, add: if (!user.isAdmin) return res.status(403).json({ message: 'Acceso denegado' });
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error de autenticación de administrador' });
  }
};

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', auth, adminAuth, async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });

    // Profile statistics
    const profileStats = await User.aggregate([
      { $match: { profileType: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$profileType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Membership level statistics
    const membershipStats = await User.aggregate([
      {
        $group: {
          _id: '$membershipLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    // Trivia statistics
    const totalGames = await TriviaGame.countDocuments();
    const completedGames = await TriviaGame.countDocuments({ status: 'completed' });
    const avgGameScore = await TriviaGame.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$totalPoints' }
        }
      }
    ]);

    // Chat statistics
    const totalChatSessions = await ChatSession.countDocuments();
    const activeChatSessions = await ChatSession.countDocuments({ status: 'active' });

    // Benefit usage statistics
    const totalBenefitUsage = await BenefitUsage.countDocuments();
    const benefitUsageThisMonth = await BenefitUsage.countDocuments({
      usedAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });

    // Location statistics
    const locationStats = await User.aggregate([
      {
        $group: {
          _id: '$location.state',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Business profile statistics
    const businessProfiles = await User.countDocuments({
      'businessProfile.verified': true
    });

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        newThisMonth: newUsersThisMonth,
        growthRate: totalUsers > 0 ? Math.round((newUsersThisMonth / totalUsers) * 100) : 0
      },
      profiles: {
        completed: profileStats.reduce((sum, p) => sum + p.count, 0),
        byType: profileStats,
        completionRate: totalUsers > 0 ? Math.round((profileStats.reduce((sum, p) => sum + p.count, 0) / totalUsers) * 100) : 0
      },
      membership: {
        byLevel: membershipStats
      },
      trivia: {
        totalGames,
        completedGames,
        completionRate: totalGames > 0 ? Math.round((completedGames / totalGames) * 100) : 0,
        avgScore: avgGameScore[0]?.avgScore || 0
      },
      chat: {
        totalSessions: totalChatSessions,
        activeSessions: activeChatSessions
      },
      benefits: {
        totalUsage: totalBenefitUsage,
        usageThisMonth: benefitUsageThisMonth
      },
      business: {
        totalProfiles: businessProfiles,
        verificationRate: totalUsers > 0 ? Math.round((businessProfiles / totalUsers) * 100) : 0
      },
      locations: {
        topStates: locationStats
      }
    };

    res.json({
      success: true,
      stats,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   GET /api/admin/users
// @desc    Get users list with filters
// @access  Private (Admin)
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      profileType = '', 
      membershipLevel = '',
      isActive = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build search criteria
    let searchCriteria = {};

    if (search) {
      searchCriteria.$or = [
        { name: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { memberNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (profileType) {
      searchCriteria.profileType = profileType;
    }

    if (membershipLevel) {
      searchCriteria.membershipLevel = membershipLevel;
    }

    if (isActive !== '') {
      searchCriteria.isActive = isActive === 'true';
    }

    // Build sort criteria
    const sortCriteria = {};
    sortCriteria[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const users = await User.find(searchCriteria)
      .select('-password')
      .sort(sortCriteria)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(searchCriteria);

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      filters: {
        search,
        profileType,
        membershipLevel,
        isActive,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get detailed analytics
// @access  Private (Admin)
router.get('/analytics', auth, adminAuth, async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    // Calculate date range
    let startDate;
    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // User registration trend
    const userRegistrations = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Trivia game trend
    const triviaGames = await TriviaGame.aggregate([
      { $match: { startedAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$startedAt' },
            month: { $month: '$startedAt' },
            day: { $dayOfMonth: '$startedAt' }
          },
          games: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Chat sessions trend
    const chatSessions = await ChatSession.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          sessions: { $sum: 1 },
          messages: { $sum: { $size: '$messages' } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Benefit usage trend
    const benefitUsage = await BenefitUsage.aggregate([
      { $match: { usedAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$usedAt' },
            month: { $month: '$usedAt' },
            day: { $dayOfMonth: '$usedAt' }
          },
          usage: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Most popular trivia categories
    const popularCategories = await TriviaGame.aggregate([
      { $match: { startedAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$category',
          games: { $sum: 1 },
          avgScore: { $avg: '$totalPoints' }
        }
      },
      { $sort: { games: -1 } }
    ]);

    // Most active users
    const activeUsers = await TriviaGame.aggregate([
      { $match: { startedAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$userId',
          games: { $sum: 1 },
          totalPoints: { $sum: '$totalPoints' }
        }
      },
      { $sort: { games: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          lastName: '$user.lastName',
          company: '$user.company',
          games: 1,
          totalPoints: 1
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        period,
        userRegistrations,
        triviaGames,
        chatSessions,
        benefitUsage,
        popularCategories,
        activeUsers
      },
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;