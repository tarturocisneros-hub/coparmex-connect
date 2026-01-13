const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Profile questions data
const profileQuestions = [
  {
    id: 1,
    question: "¿Cuál es la mayor prioridad en tu agenda?",
    options: [
      { key: 'A', text: 'Talento humano', profile: 'humanista' },
      { key: 'B', text: 'Cumplimiento fiscal', profile: 'tecnico' },
      { key: 'C', text: 'Eficiencia operativa', profile: 'industrial' },
      { key: 'D', text: 'Innovación', profile: 'innovacion' }
    ]
  },
  {
    id: 2,
    question: "¿Qué impacto social buscas generar?",
    options: [
      { key: 'A', text: 'Educación', profile: 'humanista' },
      { key: 'B', text: 'Transparencia', profile: 'tecnico' },
      { key: 'C', text: 'Infraestructura', profile: 'industrial' },
      { key: 'D', text: 'Emprendimiento', profile: 'innovacion' }
    ]
  },
  {
    id: 3,
    question: "Ante una nueva reforma laboral...",
    options: [
      { key: 'A', text: 'Evalúo bienestar del empleado', profile: 'humanista' },
      { key: 'B', text: 'Evalúo costos de cumplimiento', profile: 'tecnico' },
      { key: 'C', text: 'Ajusto inversión operativa', profile: 'industrial' },
      { key: 'D', text: 'Busco automatizar procesos', profile: 'innovacion' }
    ]
  },
  {
    id: 4,
    question: "¿Qué red de contactos necesitas?",
    options: [
      { key: 'A', text: 'RH y ONGs', profile: 'humanista' },
      { key: 'B', text: 'Abogados y consultores', profile: 'tecnico' },
      { key: 'C', text: 'Proveedores industriales', profile: 'industrial' },
      { key: 'D', text: 'Inversionistas y startups', profile: 'innovacion' }
    ]
  },
  {
    id: 5,
    question: "¿Tu postura ante la sustentabilidad?",
    options: [
      { key: 'A', text: 'Es una responsabilidad ética', profile: 'humanista' },
      { key: 'B', text: 'Cumplir regulaciones ambientales', profile: 'tecnico' },
      { key: 'C', text: 'Oportunidad de ahorro energético', profile: 'industrial' },
      { key: 'D', text: 'Nuevo modelo de negocio', profile: 'innovacion' }
    ]
  },
  {
    id: 6,
    question: "¿Qué noticia económica sigues más?",
    options: [
      { key: 'A', text: 'Indicadores de empleo', profile: 'humanista' },
      { key: 'B', text: 'Miscelánea Fiscal', profile: 'tecnico' },
      { key: 'C', text: 'Precios de energía', profile: 'industrial' },
      { key: 'D', text: 'Inteligencia Artificial', profile: 'innovacion' }
    ]
  },
  {
    id: 7,
    question: "En COPARMEX buscas...",
    options: [
      { key: 'A', text: 'Proyectos de impacto social', profile: 'humanista' },
      { key: 'B', text: 'Fortalecimiento del estado de derecho', profile: 'tecnico' },
      { key: 'C', text: 'Alianzas comerciales estratégicas', profile: 'industrial' },
      { key: 'D', text: 'Ideas disruptivas y networking', profile: 'innovacion' }
    ]
  },
  {
    id: 8,
    question: "¿Cuál consideras tu mayor fortaleza?",
    options: [
      { key: 'A', text: 'Empatía y liderazgo', profile: 'humanista' },
      { key: 'B', text: 'Disciplina y cumplimiento', profile: 'tecnico' },
      { key: 'C', text: 'Visión de mercado', profile: 'industrial' },
      { key: 'D', text: 'Adaptabilidad al cambio', profile: 'innovacion' }
    ]
  },
  {
    id: 9,
    question: "¿Qué desafío del país te preocupa más?",
    options: [
      { key: 'A', text: 'Desigualdad social', profile: 'humanista' },
      { key: 'B', text: 'Inseguridad jurídica', profile: 'tecnico' },
      { key: 'C', text: 'Rezago en infraestructura energética', profile: 'industrial' },
      { key: 'D', text: 'Brecha digital', profile: 'innovacion' }
    ]
  },
  {
    id: 10,
    question: "¿Cómo prefieres capacitarte?",
    options: [
      { key: 'A', text: 'Habilidades blandas y liderazgo', profile: 'humanista' },
      { key: 'B', text: 'Leyes y finanzas corporativas', profile: 'tecnico' },
      { key: 'C', text: 'Comercio exterior y logística', profile: 'industrial' },
      { key: 'D', text: 'Bootcamps tecnológicos', profile: 'innovacion' }
    ]
  },
  {
    id: 11,
    question: "Tu empresa ideal es...",
    options: [
      { key: 'A', text: 'Un gran lugar para trabajar', profile: 'humanista' },
      { key: 'B', text: 'Ejemplo de cumplimiento normativo', profile: 'tecnico' },
      { key: 'C', text: 'Líder en producción y eficiencia', profile: 'industrial' },
      { key: 'D', text: 'Disruptiva e innovadora', profile: 'innovacion' }
    ]
  },
  {
    id: 12,
    question: "¿Qué esperas de la directiva de COPARMEX?",
    options: [
      { key: 'A', text: 'Mayor incidencia en políticas sociales', profile: 'humanista' },
      { key: 'B', text: 'Defensa jurídica del sector privado', profile: 'tecnico' },
      { key: 'C', text: 'Gestión de inversión en infraestructura', profile: 'industrial' },
      { key: 'D', text: 'Modernización y transformación digital', profile: 'innovacion' }
    ]
  }
];

const profileCommissions = {
  humanista: {
    name: 'Humanista',
    description: 'Enfocado en el desarrollo humano y responsabilidad social',
    commissions: [
      { name: 'Educación', priority: 1 },
      { name: 'Responsabilidad Social', priority: 2 },
      { name: 'Salud', priority: 3 }
    ],
    color: '#10B981'
  },
  tecnico: {
    name: 'Técnico/Legal',
    description: 'Especializado en cumplimiento normativo y aspectos legales',
    commissions: [
      { name: 'Fiscal', priority: 1 },
      { name: 'Laboral', priority: 2 },
      { name: 'Justicia y Seguridad', priority: 3 }
    ],
    color: '#3B82F6'
  },
  industrial: {
    name: 'Industrial/Económico',
    description: 'Orientado a la producción, infraestructura y desarrollo económico',
    commissions: [
      { name: 'Energía', priority: 1 },
      { name: 'Infraestructura', priority: 2 },
      { name: 'Vivienda', priority: 3 }
    ],
    color: '#F59E0B'
  },
  innovacion: {
    name: 'Innovación',
    description: 'Enfocado en tecnología, transformación digital y nuevos modelos de negocio',
    commissions: [
      { name: 'Innovación', priority: 1 },
      { name: 'Negocios Digitales', priority: 2 },
      { name: 'Jóvenes Empresarios', priority: 3 }
    ],
    color: '#8B5CF6'
  }
};

// Validation schema
const answersSchema = Joi.object({
  answers: Joi.array().items(
    Joi.object({
      questionId: Joi.number().required(),
      answer: Joi.string().required(),
      profile: Joi.string().valid('humanista', 'tecnico', 'industrial', 'innovacion').required()
    })
  ).min(12).max(12).required()
});

// @route   GET /api/profiles/questions
// @desc    Get profile assessment questions
// @access  Private
router.get('/questions', auth, (req, res) => {
  try {
    res.json({
      success: true,
      questions: profileQuestions
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   POST /api/profiles/submit
// @desc    Submit profile assessment answers
// @access  Private
router.post('/submit', auth, async (req, res) => {
  try {
    // Validate input
    const { error } = answersSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { answers } = req.body;
    const userId = req.user.userId;

    // Calculate profile
    const profileCounts = {
      humanista: 0,
      tecnico: 0,
      industrial: 0,
      innovacion: 0
    };

    answers.forEach(answer => {
      profileCounts[answer.profile]++;
    });

    // Find dominant profile
    const dominantProfile = Object.keys(profileCounts).reduce((a, b) =>
      profileCounts[a] > profileCounts[b] ? a : b
    );

    // Get profile data
    const profileData = profileCommissions[dominantProfile];

    // Update user profile
    const user = await User.findByIdAndUpdate(
      userId,
      {
        profileType: dominantProfile,
        profileAnswers: answers,
        recommendedCommissions: profileData.commissions.map(c => c.name),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      success: true,
      profile: {
        type: dominantProfile,
        ...profileData,
        scores: profileCounts
      },
      user: {
        id: user._id,
        profileType: user.profileType,
        recommendedCommissions: user.recommendedCommissions
      }
    });

  } catch (error) {
    console.error('Submit profile error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   GET /api/profiles/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (!user.profileType) {
      return res.json({
        success: true,
        hasProfile: false,
        message: 'Usuario no ha completado el test de perfilamiento'
      });
    }

    const profileData = profileCommissions[user.profileType];

    res.json({
      success: true,
      hasProfile: true,
      profile: {
        type: user.profileType,
        ...profileData,
        recommendedCommissions: user.recommendedCommissions
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   GET /api/profiles/stats
// @desc    Get profile statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $match: { profileType: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$profileType',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalUsers = await User.countDocuments({ profileType: { $exists: true, $ne: null } });

    const profileStats = stats.reduce((acc, stat) => {
      acc[stat._id] = {
        count: stat.count,
        percentage: Math.round((stat.count / totalUsers) * 100)
      };
      return acc;
    }, {});

    res.json({
      success: true,
      totalUsers,
      profileStats
    });

  } catch (error) {
    console.error('Get profile stats error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;