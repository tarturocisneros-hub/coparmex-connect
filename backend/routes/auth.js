const express = require('express');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/User');
const router = express.Router();

// Validation schemas
const loginSchema = Joi.object({
  memberNumber: Joi.string().required().min(3).max(20),
  password: Joi.string().min(6).max(100)
});

const registerSchema = Joi.object({
  memberNumber: Joi.string().required().min(3).max(20),
  email: Joi.string().email().required(),
  name: Joi.string().required().min(2).max(50),
  lastName: Joi.string().required().min(2).max(50),
  company: Joi.string().required().min(2).max(100),
  position: Joi.string().required().min(2).max(100),
  phone: Joi.string().required().min(10).max(15),
  location: Joi.object({
    state: Joi.string().required(),
    city: Joi.string().required(),
    address: Joi.string().optional()
  }).required(),
  password: Joi.string().min(6).max(100).required()
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'coparmex-connect-secret-key',
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/login
// @desc    Login user with member number
// @access  Public
router.post('/login', async (req, res) => {
  try {
    // Validate input
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { memberNumber, password } = req.body;

    // For demo purposes, allow login with just member number
    // In production, you'd verify against COPARMEX database
    let user = await User.findOne({ memberNumber });

    if (!user) {
      // Create demo user if doesn't exist
      user = new User({
        memberNumber,
        email: `${memberNumber}@coparmex.org.mx`,
        name: 'Usuario',
        lastName: 'Demo',
        company: 'Empresa Demo SA',
        position: 'Director General',
        phone: '5555555555',
        location: {
          state: 'CDMX',
          city: 'Ciudad de México'
        },
        membershipLevel: 'Socio Líder Bronce'
      });
      await user.save();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        memberNumber: user.memberNumber,
        name: user.name,
        lastName: user.lastName,
        fullName: user.fullName,
        company: user.company,
        position: user.position,
        membershipLevel: user.membershipLevel,
        profileType: user.profileType,
        location: user.location
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    // Validate input
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { memberNumber, email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ memberNumber }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'Ya existe un usuario con ese número de socio o email' 
      });
    }

    // Create new user
    const user = new User(req.body);
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        memberNumber: user.memberNumber,
        name: user.name,
        lastName: user.lastName,
        fullName: user.fullName,
        company: user.company,
        position: user.position,
        membershipLevel: user.membershipLevel,
        location: user.location
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   GET /api/auth/verify
// @desc    Verify JWT token
// @access  Private
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'coparmex-connect-secret-key');
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        memberNumber: user.memberNumber,
        name: user.name,
        lastName: user.lastName,
        fullName: user.fullName,
        company: user.company,
        position: user.position,
        membershipLevel: user.membershipLevel,
        profileType: user.profileType,
        location: user.location
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;