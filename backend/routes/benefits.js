const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const Benefit = require('../models/Benefit');
const BenefitUsage = require('../models/BenefitUsage');
const auth = require('../middleware/auth');
const router = express.Router();

// Mock benefits data (in production, this would come from database)
const mockBenefits = [
  {
    id: 1,
    company: 'Aeroméxico',
    category: 'Viajes',
    discount: '20% OFF',
    description: 'Descuento en vuelos nacionales e internacionales',
    terms: 'Válido para vuelos directos. No aplica en temporada alta (diciembre-enero).',
    icon: 'airplane',
    color: '#1E40AF',
    validUntil: new Date('2024-12-31'),
    locations: [
      { city: 'Ciudad de México', state: 'CDMX', lat: 19.4326, lng: -99.1332 },
      { city: 'Guadalajara', state: 'Jalisco', lat: 20.6597, lng: -103.3496 },
      { city: 'Monterrey', state: 'Nuevo León', lat: 25.6866, lng: -100.3161 }
    ],
    membershipLevels: ['Socio Activo', 'Socio Líder Bronce', 'Socio Líder Plata', 'Socio Líder Oro', 'Socio Líder Platino'],
    website: 'https://aeromexico.com',
    phone: '800-021-4000',
    code: 'COPARMEX20',
    usageCount: 1250,
    rating: 4.5,
    featured: true
  },
  {
    id: 2,
    company: 'Hertz',
    category: 'Renta de autos',
    discount: '15% OFF',
    description: 'Descuento en renta de vehículos en todo México',
    terms: 'Válido para rentas mínimas de 2 días. Sujeto a disponibilidad.',
    icon: 'car',
    color: '#059669',
    validUntil: new Date('2024-12-31'),
    locations: [
      { city: 'Ciudad de México', state: 'CDMX', lat: 19.4326, lng: -99.1332 },
      { city: 'Cancún', state: 'Quintana Roo', lat: 21.1619, lng: -86.8515 },
      { city: 'Puerto Vallarta', state: 'Jalisco', lat: 20.6534, lng: -105.2253 }
    ],
    membershipLevels: ['Socio Líder Bronce', 'Socio Líder Plata', 'Socio Líder Oro', 'Socio Líder Platino'],
    website: 'https://hertz.com.mx',
    phone: '800-709-5000',
    code: 'COPARMEX15',
    usageCount: 890,
    rating: 4.3,
    featured: true
  },
  {
    id: 3,
    company: 'Hotel City Express',
    category: 'Hospedaje',
    discount: '25% OFF',
    description: 'Descuento en hoteles de la cadena City Express',
    terms: 'Válido de lunes a jueves. Reserva con 48 horas de anticipación.',
    icon: 'bed',
    color: '#DC2626',
    validUntil: new Date('2024-12-31'),
    locations: [
      { city: 'Ciudad de México', state: 'CDMX', lat: 19.4326, lng: -99.1332 },
      { city: 'Guadalajara', state: 'Jalisco', lat: 20.6597, lng: -103.3496 },
      { city: 'Tijuana', state: 'Baja California', lat: 32.5149, lng: -117.0382 }
    ],
    membershipLevels: ['Socio Líder Plata', 'Socio Líder Oro', 'Socio Líder Platino'],
    website: 'https://cityexpress.com',
    phone: '800-248-9397',
    code: 'COPARMEX25',
    usageCount: 650,
    rating: 4.7,
    featured: true
  },
  {
    id: 4,
    company: 'Office Depot',
    category: 'Oficina',
    discount: '10% OFF',
    description: 'Descuento en artículos de oficina y tecnología',
    terms: 'Válido en compras mayores a $500 pesos. No aplica en ofertas.',
    icon: 'briefcase',
    color: '#7C3AED',
    validUntil: new Date('2024-12-31'),
    locations: [
      { city: 'Ciudad de México', state: 'CDMX', lat: 19.4326, lng: -99.1332 },
      { city: 'Monterrey', state: 'Nuevo León', lat: 25.6866, lng: -100.3161 },
      { city: 'Puebla', state: 'Puebla', lat: 19.0414, lng: -98.2063 }
    ],
    membershipLevels: ['Socio Activo', 'Socio Líder Bronce', 'Socio Líder Plata', 'Socio Líder Oro', 'Socio Líder Platino'],
    website: 'https://officedepot.com.mx',
    phone: '800-633-3768',
    code: 'COPARMEX10',
    usageCount: 2100,
    rating: 4.2,
    featured: false
  },
  {
    id: 5,
    company: 'Liverpool',
    category: 'Retail',
    discount: '12% OFF',
    description: 'Descuento en departamental Liverpool',
    terms: 'Válido en ropa, hogar y tecnología. Excluye perfumería.',
    icon: 'storefront',
    color: '#F59E0B',
    validUntil: new Date('2024-12-31'),
    locations: [
      { city: 'Ciudad de México', state: 'CDMX', lat: 19.4326, lng: -99.1332 },
      { city: 'Guadalajara', state: 'Jalisco', lat: 20.6597, lng: -103.3496 }
    ],
    membershipLevels: ['Socio Líder Oro', 'Socio Líder Platino'],
    website: 'https://liverpool.com.mx',
    phone: '800-713-5555',
    code: 'COPARMEX12',
    usageCount: 450,
    rating: 4.4,
    featured: false
  },
  {
    id: 6,
    company: 'Starbucks',
    category: 'Restaurantes',
    discount: '8% OFF',
    description: 'Descuento en bebidas y alimentos Starbucks',
    terms: 'Válido en todas las sucursales. No acumulable con otras promociones.',
    icon: 'cafe',
    color: '#10B981',
    validUntil: new Date('2024-12-31'),
    locations: [
      { city: 'Ciudad de México', state: 'CDMX', lat: 19.4326, lng: -99.1332 },
      { city: 'Monterrey', state: 'Nuevo León', lat: 25.6866, lng: -100.3161 }
    ],
    membershipLevels: ['Socio Activo', 'Socio Líder Bronce', 'Socio Líder Plata', 'Socio Líder Oro', 'Socio Líder Platino'],
    website: 'https://starbucks.com.mx',
    phone: '800-782-7282',
    code: 'COPARMEX8',
    usageCount: 3200,
    rating: 4.1,
    featured: false
  }
];

// Validation schemas
const benefitSearchSchema = Joi.object({
  category: Joi.string().optional().allow(''),
  location: Joi.string().optional().allow(''),
  featured: Joi.boolean().optional(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(50).default(20),
  sortBy: Joi.string().valid('relevance', 'discount', 'rating', 'usage').default('relevance')
});

const useBenefitSchema = Joi.object({
  benefitId: Joi.number().required(),
  location: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required()
  }).optional()
});

// @route   GET /api/benefits
// @desc    Get available benefits for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Validate query parameters
    const { error } = benefitSearchSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { category, location, featured, page, limit, sortBy } = req.query;
    const userId = req.user.userId;

    // Get user to check membership level
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Filter benefits based on user's membership level
    let filteredBenefits = mockBenefits.filter(benefit => 
      benefit.membershipLevels.includes(user.membershipLevel)
    );

    // Apply filters
    if (category) {
      filteredBenefits = filteredBenefits.filter(benefit => 
        benefit.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (location) {
      filteredBenefits = filteredBenefits.filter(benefit =>
        benefit.locations.some(loc => 
          loc.state.toLowerCase().includes(location.toLowerCase()) ||
          loc.city.toLowerCase().includes(location.toLowerCase())
        )
      );
    }

    if (featured !== undefined) {
      filteredBenefits = filteredBenefits.filter(benefit => benefit.featured === featured);
    }

    // Sort benefits
    switch (sortBy) {
      case 'discount':
        filteredBenefits.sort((a, b) => {
          const aDiscount = parseInt(a.discount.match(/\d+/)?.[0] || 0);
          const bDiscount = parseInt(b.discount.match(/\d+/)?.[0] || 0);
          return bDiscount - aDiscount;
        });
        break;
      case 'rating':
        filteredBenefits.sort((a, b) => b.rating - a.rating);
        break;
      case 'usage':
        filteredBenefits.sort((a, b) => b.usageCount - a.usageCount);
        break;
      default:
        // Keep original order (relevance)
        break;
    }

    // Paginate results
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedBenefits = filteredBenefits.slice(startIndex, endIndex);

    res.json({
      success: true,
      benefits: paginatedBenefits,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredBenefits.length,
        pages: Math.ceil(filteredBenefits.length / parseInt(limit))
      },
      filters: {
        category,
        location,
        featured,
        sortBy
      },
      userMembershipLevel: user.membershipLevel
    });

  } catch (error) {
    console.error('Get benefits error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   GET /api/benefits/categories
// @desc    Get benefit categories
// @access  Private
router.get('/categories', auth, (req, res) => {
  try {
    const categories = [...new Set(mockBenefits.map(benefit => benefit.category))];
    const categoryStats = categories.map(category => ({
      name: category,
      count: mockBenefits.filter(benefit => benefit.category === category).length
    }));

    res.json({
      success: true,
      categories: categoryStats
    });

  } catch (error) {
    console.error('Get benefit categories error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   GET /api/benefits/featured
// @desc    Get featured benefits
// @access  Private
router.get('/featured', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user to check membership level
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Get featured benefits for user's membership level
    const featuredBenefits = mockBenefits
      .filter(benefit => 
        benefit.featured && 
        benefit.membershipLevels.includes(user.membershipLevel)
      )
      .slice(0, 6); // Limit to 6 featured benefits

    res.json({
      success: true,
      benefits: featuredBenefits,
      userMembershipLevel: user.membershipLevel
    });

  } catch (error) {
    console.error('Get featured benefits error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   GET /api/benefits/:benefitId
// @desc    Get specific benefit details
// @access  Private
router.get('/:benefitId', auth, async (req, res) => {
  try {
    const { benefitId } = req.params;
    const userId = req.user.userId;

    // Get user to check membership level
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Find benefit
    const benefit = mockBenefits.find(b => b.id === parseInt(benefitId));
    if (!benefit) {
      return res.status(404).json({ message: 'Beneficio no encontrado' });
    }

    // Check if user has access to this benefit
    if (!benefit.membershipLevels.includes(user.membershipLevel)) {
      return res.status(403).json({ 
        message: 'Este beneficio no está disponible para tu nivel de membresía',
        requiredLevels: benefit.membershipLevels
      });
    }

    // Get user's usage history for this benefit
    const usageHistory = await BenefitUsage.find({ 
      userId, 
      benefitId: parseInt(benefitId) 
    })
    .sort({ usedAt: -1 })
    .limit(10);

    res.json({
      success: true,
      benefit,
      usageHistory,
      hasAccess: true
    });

  } catch (error) {
    console.error('Get benefit details error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   POST /api/benefits/:benefitId/use
// @desc    Use a benefit (generate code/track usage)
// @access  Private
router.post('/:benefitId/use', auth, async (req, res) => {
  try {
    // Validate input
    const { error } = useBenefitSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { benefitId } = req.params;
    const { location } = req.body;
    const userId = req.user.userId;

    // Get user to check membership level
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Find benefit
    const benefit = mockBenefits.find(b => b.id === parseInt(benefitId));
    if (!benefit) {
      return res.status(404).json({ message: 'Beneficio no encontrado' });
    }

    // Check if user has access to this benefit
    if (!benefit.membershipLevels.includes(user.membershipLevel)) {
      return res.status(403).json({ 
        message: 'Este beneficio no está disponible para tu nivel de membresía' 
      });
    }

    // Check if benefit is still valid
    if (new Date() > benefit.validUntil) {
      return res.status(400).json({ message: 'Este beneficio ha expirado' });
    }

    // Generate unique usage code
    const usageCode = `${benefit.code}-${Date.now().toString(36).toUpperCase()}`;

    // Record benefit usage
    const benefitUsage = new BenefitUsage({
      userId,
      benefitId: parseInt(benefitId),
      company: benefit.company,
      discount: benefit.discount,
      code: usageCode,
      location: location || null,
      usedAt: new Date()
    });

    await benefitUsage.save();

    // Update benefit usage count (in production, this would be in database)
    const benefitIndex = mockBenefits.findIndex(b => b.id === parseInt(benefitId));
    if (benefitIndex !== -1) {
      mockBenefits[benefitIndex].usageCount += 1;
    }

    res.json({
      success: true,
      message: 'Beneficio activado correctamente',
      usageCode,
      benefit: {
        company: benefit.company,
        discount: benefit.discount,
        description: benefit.description,
        terms: benefit.terms,
        phone: benefit.phone,
        website: benefit.website
      },
      validUntil: benefit.validUntil,
      instructions: `Presenta este código: ${usageCode} en ${benefit.company} para obtener tu descuento del ${benefit.discount}`
    });

  } catch (error) {
    console.error('Use benefit error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   GET /api/benefits/my/usage
// @desc    Get user's benefit usage history
// @access  Private
router.get('/my/usage', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;

    const usageHistory = await BenefitUsage.find({ userId })
      .sort({ usedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await BenefitUsage.countDocuments({ userId });

    // Get usage statistics
    const stats = await BenefitUsage.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$company',
          count: { $sum: 1 },
          lastUsed: { $max: '$usedAt' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      usageHistory,
      stats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get usage history error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   GET /api/benefits/nearby
// @desc    Get benefits near user's location
// @access  Private
router.get('/nearby', auth, async (req, res) => {
  try {
    const { lat, lng, radius = 50 } = req.query; // radius in km
    const userId = req.user.userId;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitud y longitud son requeridas' });
    }

    // Get user to check membership level
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const radiusKm = parseFloat(radius);

    // Filter benefits by user's membership level and proximity
    const nearbyBenefits = mockBenefits
      .filter(benefit => benefit.membershipLevels.includes(user.membershipLevel))
      .map(benefit => {
        // Find closest location for each benefit
        const closestLocation = benefit.locations.reduce((closest, location) => {
          const distance = calculateDistance(userLat, userLng, location.lat, location.lng);
          return distance < closest.distance ? { ...location, distance } : closest;
        }, { distance: Infinity });

        return {
          ...benefit,
          closestLocation,
          distance: closestLocation.distance
        };
      })
      .filter(benefit => benefit.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      benefits: nearbyBenefits,
      userLocation: { lat: userLat, lng: userLng },
      radius: radiusKm
    });

  } catch (error) {
    console.error('Get nearby benefits error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Helper function to calculate distance between two points
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = router;