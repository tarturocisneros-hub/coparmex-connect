const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const BusinessListing = require('../models/BusinessListing');
const auth = require('../middleware/auth');
const router = express.Router();

// Validation schemas
const businessProfileSchema = Joi.object({
  sector: Joi.string().required().min(2).max(100),
  services: Joi.array().items(Joi.string().min(2).max(100)).min(1).max(10),
  description: Joi.string().required().min(10).max(500),
  website: Joi.string().uri().optional().allow(''),
  socialMedia: Joi.object({
    linkedin: Joi.string().uri().optional().allow(''),
    facebook: Joi.string().uri().optional().allow(''),
    twitter: Joi.string().uri().optional().allow(''),
    instagram: Joi.string().uri().optional().allow('')
  }).optional()
});

const searchSchema = Joi.object({
  query: Joi.string().optional().allow(''),
  sector: Joi.string().optional().allow(''),
  location: Joi.string().optional().allow(''),
  services: Joi.string().optional().allow(''),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(50).default(20),
  sortBy: Joi.string().valid('relevance', 'rating', 'recent', 'name').default('relevance')
});

const reviewSchema = Joi.object({
  businessId: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().min(10).max(500).required()
});

// @route   GET /api/business/directory
// @desc    Get business directory with search and filters
// @access  Private
router.get('/directory', auth, async (req, res) => {
  try {
    // Validate query parameters
    const { error } = searchSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { query, sector, location, services, page, limit, sortBy } = req.query;

    // Build search criteria
    let searchCriteria = {
      'businessProfile.verified': true,
      isActive: true
    };

    // Text search
    if (query) {
      searchCriteria.$or = [
        { name: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { 'businessProfile.description': { $regex: query, $options: 'i' } },
        { 'businessProfile.services': { $in: [new RegExp(query, 'i')] } }
      ];
    }

    // Sector filter
    if (sector) {
      searchCriteria['businessProfile.sector'] = { $regex: sector, $options: 'i' };
    }

    // Location filter
    if (location) {
      searchCriteria.$or = [
        { 'location.state': { $regex: location, $options: 'i' } },
        { 'location.city': { $regex: location, $options: 'i' } }
      ];
    }

    // Services filter
    if (services) {
      searchCriteria['businessProfile.services'] = { $in: [new RegExp(services, 'i')] };
    }

    // Build sort criteria
    let sortCriteria = {};
    switch (sortBy) {
      case 'rating':
        sortCriteria = { 'businessProfile.rating': -1 };
        break;
      case 'recent':
        sortCriteria = { createdAt: -1 };
        break;
      case 'name':
        sortCriteria = { name: 1 };
        break;
      default:
        sortCriteria = { 'businessProfile.rating': -1, createdAt: -1 };
    }

    // Execute search
    const businesses = await User.find(searchCriteria)
      .select('name company position location businessProfile membershipLevel createdAt')
      .sort(sortCriteria)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(searchCriteria);

    // Format response
    const formattedBusinesses = businesses.map(business => ({
      id: business._id,
      name: business.name,
      company: business.company,
      position: business.position,
      location: business.location,
      sector: business.businessProfile.sector,
      services: business.businessProfile.services,
      description: business.businessProfile.description,
      website: business.businessProfile.website,
      socialMedia: business.businessProfile.socialMedia,
      rating: business.businessProfile.rating,
      reviewCount: business.businessProfile.reviews.length,
      membershipLevel: business.membershipLevel,
      verified: business.businessProfile.verified,
      joinedDate: business.createdAt
    }));

    res.json({
      success: true,
      businesses: formattedBusinesses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      filters: {
        query,
        sector,
        location,
        services,
        sortBy
      }
    });

  } catch (error) {
    console.error('Get business directory error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   GET /api/business/sectors
// @desc    Get available business sectors
// @access  Private
router.get('/sectors', auth, async (req, res) => {
  try {
    const sectors = await User.aggregate([
      { $match: { 'businessProfile.sector': { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$businessProfile.sector',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    const formattedSectors = sectors.map(sector => ({
      name: sector._id,
      count: sector.count
    }));

    res.json({
      success: true,
      sectors: formattedSectors
    });

  } catch (error) {
    console.error('Get sectors error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   GET /api/business/profile/:userId
// @desc    Get specific business profile
// @access  Private
router.get('/profile/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    const business = await User.findById(userId)
      .select('name company position location businessProfile membershipLevel createdAt');

    if (!business || !business.businessProfile.verified) {
      return res.status(404).json({ message: 'Perfil de negocio no encontrado' });
    }

    res.json({
      success: true,
      business: {
        id: business._id,
        name: business.name,
        company: business.company,
        position: business.position,
        location: business.location,
        sector: business.businessProfile.sector,
        services: business.businessProfile.services,
        description: business.businessProfile.description,
        website: business.businessProfile.website,
        socialMedia: business.businessProfile.socialMedia,
        rating: business.businessProfile.rating,
        reviews: business.businessProfile.reviews,
        membershipLevel: business.membershipLevel,
        verified: business.businessProfile.verified,
        joinedDate: business.createdAt
      }
    });

  } catch (error) {
    console.error('Get business profile error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   PUT /api/business/profile
// @desc    Update user's business profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    // Validate input
    const { error } = businessProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userId = req.user.userId;
    const profileData = req.body;

    // Update user's business profile
    const user = await User.findByIdAndUpdate(
      userId,
      {
        'businessProfile.sector': profileData.sector,
        'businessProfile.services': profileData.services,
        'businessProfile.description': profileData.description,
        'businessProfile.website': profileData.website || '',
        'businessProfile.socialMedia': profileData.socialMedia || {},
        'businessProfile.verified': true, // Auto-verify for COPARMEX members
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      success: true,
      message: 'Perfil de negocio actualizado correctamente',
      businessProfile: user.businessProfile
    });

  } catch (error) {
    console.error('Update business profile error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   POST /api/business/review
// @desc    Add review to a business
// @access  Private
router.post('/review', auth, async (req, res) => {
  try {
    // Validate input
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { businessId, rating, comment } = req.body;
    const userId = req.user.userId;

    // Check if user is trying to review their own business
    if (businessId === userId) {
      return res.status(400).json({ message: 'No puedes calificar tu propio negocio' });
    }

    // Find the business
    const business = await User.findById(businessId);
    if (!business || !business.businessProfile.verified) {
      return res.status(404).json({ message: 'Negocio no encontrado' });
    }

    // Check if user already reviewed this business
    const existingReview = business.businessProfile.reviews.find(
      review => review.userId.toString() === userId
    );

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.date = new Date();
    } else {
      // Add new review
      business.businessProfile.reviews.push({
        userId,
        rating,
        comment,
        date: new Date()
      });
    }

    // Recalculate average rating
    const reviews = business.businessProfile.reviews;
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    business.businessProfile.rating = Math.round(averageRating * 10) / 10;

    await business.save();

    res.json({
      success: true,
      message: 'Reseña agregada correctamente',
      newRating: business.businessProfile.rating,
      reviewCount: reviews.length
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   GET /api/business/my-profile
// @desc    Get current user's business profile
// @access  Private
router.get('/my-profile', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId)
      .select('businessProfile');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      success: true,
      hasBusinessProfile: !!user.businessProfile.sector,
      businessProfile: user.businessProfile
    });

  } catch (error) {
    console.error('Get my business profile error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   GET /api/business/stats
// @desc    Get business directory statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const totalBusinesses = await User.countDocuments({
      'businessProfile.verified': true,
      isActive: true
    });

    const sectorStats = await User.aggregate([
      { $match: { 'businessProfile.verified': true, isActive: true } },
      {
        $group: {
          _id: '$businessProfile.sector',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const locationStats = await User.aggregate([
      { $match: { 'businessProfile.verified': true, isActive: true } },
      {
        $group: {
          _id: '$location.state',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const ratingStats = await User.aggregate([
      { $match: { 'businessProfile.verified': true, isActive: true } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$businessProfile.rating' },
          totalReviews: { $sum: { $size: '$businessProfile.reviews' } }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalBusinesses,
        averageRating: ratingStats[0]?.avgRating || 0,
        totalReviews: ratingStats[0]?.totalReviews || 0,
        topSectors: sectorStats.map(s => ({ name: s._id, count: s.count })),
        topLocations: locationStats.map(l => ({ name: l._id, count: l.count }))
      }
    });

  } catch (error) {
    console.error('Get business stats error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;