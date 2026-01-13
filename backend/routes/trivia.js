const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const TriviaGame = require('../models/TriviaGame');
const auth = require('../middleware/auth');
const router = express.Router();

// Trivia questions database
const triviaQuestions = {
  'Emprendimiento': [
    {
      id: 1,
      question: "¿Qué significa MVP en el contexto empresarial?",
      options: ["Minimum Viable Product", "Maximum Value Proposition", "Most Valuable Player", "Market Value Projection"],
      correct: 0,
      difficulty: "medium",
      explanation: "MVP significa Minimum Viable Product, un producto con características mínimas para satisfacer a los primeros clientes."
    },
    {
      id: 2,
      question: "¿Qué es el Burn Rate?",
      options: ["Tasa de crecimiento", "Velocidad de gasto de capital", "Margen de ganancia", "Rotación de inventario"],
      correct: 1,
      difficulty: "medium",
      explanation: "El Burn Rate es la velocidad a la que una empresa gasta su capital disponible."
    },
    {
      id: 3,
      question: "¿Qué significa Scalability?",
      options: ["Capacidad de reducir costos", "Capacidad de crecer sin perder eficiencia", "Capacidad de diversificar", "Capacidad de automatizar"],
      correct: 1,
      difficulty: "easy",
      explanation: "Scalability es la capacidad de un negocio para crecer y manejar mayor demanda sin perder eficiencia."
    },
    {
      id: 4,
      question: "¿Qué es Bootstrapping?",
      options: ["Financiar con recursos propios", "Buscar inversionistas", "Solicitar créditos bancarios", "Vender acciones"],
      correct: 0,
      difficulty: "medium",
      explanation: "Bootstrapping es financiar un negocio usando recursos propios sin inversión externa."
    },
    {
      id: 5,
      question: "¿Qué indica el Product-Market Fit?",
      options: ["Precio competitivo", "Producto satisface necesidad del mercado", "Producto es innovador", "Producto es rentable"],
      correct: 1,
      difficulty: "hard",
      explanation: "Product-Market Fit indica que el producto satisface una fuerte demanda del mercado."
    }
  ],
  'Finanzas Sanas': [
    {
      id: 6,
      question: "¿Qué es el punto de equilibrio?",
      options: ["Máxima ganancia", "Ingresos = Gastos", "Mínima pérdida", "Capital inicial"],
      correct: 1,
      difficulty: "easy",
      explanation: "El punto de equilibrio es donde los ingresos totales igualan a los gastos totales."
    },
    {
      id: 7,
      question: "¿Qué significa EBITDA?",
      options: ["Earnings Before Interest, Taxes, Depreciation, Amortization", "Economic Business Income Tax Deduction Analysis", "Estimated Business Investment Total Debt Analysis", "Enterprise Business Income Tax Declaration Amount"],
      correct: 0,
      difficulty: "hard",
      explanation: "EBITDA son las ganancias antes de intereses, impuestos, depreciación y amortización."
    },
    {
      id: 8,
      question: "¿Qué es el flujo de caja?",
      options: ["Ganancias netas", "Movimiento de dinero entrante y saliente", "Capital de trabajo", "Activos líquidos"],
      correct: 1,
      difficulty: "medium",
      explanation: "El flujo de caja es el movimiento de dinero que entra y sale de la empresa."
    },
    {
      id: 9,
      question: "¿Qué es el capital de trabajo?",
      options: ["Dinero para inversiones", "Recursos para operaciones diarias", "Capital social", "Reservas de emergencia"],
      correct: 1,
      difficulty: "medium",
      explanation: "El capital de trabajo son los recursos necesarios para las operaciones diarias de la empresa."
    },
    {
      id: 10,
      question: "¿Qué mide el ROA?",
      options: ["Return on Assets", "Rate of Appreciation", "Risk of Assets", "Revenue over Assets"],
      correct: 0,
      difficulty: "medium",
      explanation: "ROA (Return on Assets) mide la eficiencia de una empresa para generar ganancias con sus activos."
    }
  ],
  'Filosofía COPARMEX': [
    {
      id: 11,
      question: "¿Quién fue el fundador de COPARMEX?",
      options: ["Carlos Slim", "Luis G. Sada", "Lorenzo Servitje", "Emilio Azcárraga"],
      correct: 1,
      difficulty: "easy",
      explanation: "Luis G. Sada fundó COPARMEX en 1936 en Monterrey, Nuevo León."
    },
    {
      id: 12,
      question: "¿Qué es el principio de Subsidiaridad en COPARMEX?",
      options: ["Apoyo gubernamental", "Decisiones en el nivel más cercano al ciudadano", "Subsidios empresariales", "Ayuda social"],
      correct: 1,
      difficulty: "hard",
      explanation: "La subsidiaridad significa que las decisiones deben tomarse en el nivel más cercano al ciudadano."
    },
    {
      id: 13,
      question: "¿Qué significa Vertebración Social?",
      options: ["Estructura organizacional", "Fortalecimiento del tejido social", "Jerarquía empresarial", "Red de contactos"],
      correct: 1,
      difficulty: "hard",
      explanation: "La vertebración social busca fortalecer el tejido social y las instituciones intermedias."
    },
    {
      id: 14,
      question: "¿Qué es el MDI (Modelo de Desarrollo Inclusivo)?",
      options: ["Modelo de crecimiento económico equitativo", "Método de inversión", "Marco de desarrollo tecnológico", "Modelo de diversificación"],
      correct: 0,
      difficulty: "hard",
      explanation: "El MDI es el Modelo de Desarrollo Inclusivo que promueve crecimiento económico equitativo."
    },
    {
      id: 15,
      question: "¿En qué año se fundó COPARMEX?",
      options: ["1929", "1936", "1942", "1950"],
      correct: 1,
      difficulty: "medium",
      explanation: "COPARMEX fue fundada en 1936 por Luis G. Sada en Monterrey."
    }
  ],
  'Leyes Laborales': [
    {
      id: 16,
      question: "¿Cuántos días de vacaciones mínimas establece la nueva ley?",
      options: ["6 días", "12 días", "15 días", "20 días"],
      correct: 1,
      difficulty: "easy",
      explanation: "La reforma laboral de 2023 estableció 12 días mínimos de vacaciones."
    },
    {
      id: 17,
      question: "¿Qué regula la NOM-035?",
      options: ["Seguridad industrial", "Factores de riesgo psicosocial", "Capacitación laboral", "Salarios mínimos"],
      correct: 1,
      difficulty: "medium",
      explanation: "La NOM-035 regula los factores de riesgo psicosocial en el trabajo."
    },
    {
      id: 18,
      question: "¿Qué es REPSE?",
      options: ["Registro de Prestadoras de Servicios Especializados", "Reglamento de Protección Social Empresarial", "Red de Empresas de Servicios Especiales", "Registro de Empleados del Sector Empresarial"],
      correct: 0,
      difficulty: "hard",
      explanation: "REPSE es el Registro de Prestadoras de Servicios Especializados u Obras Especializadas."
    },
    {
      id: 19,
      question: "¿Qué es la PTU?",
      options: ["Participación de los Trabajadores en las Utilidades", "Programa de Trabajo Unificado", "Plan de Trabajo Único", "Política de Trabajo Universal"],
      correct: 0,
      difficulty: "easy",
      explanation: "PTU es la Participación de los Trabajadores en las Utilidades, equivalente al 10% de las utilidades."
    },
    {
      id: 20,
      question: "¿Cuál es la jornada laboral máxima diaria?",
      options: ["7 horas", "8 horas", "9 horas", "10 horas"],
      correct: 1,
      difficulty: "easy",
      explanation: "La jornada laboral máxima diaria es de 8 horas según la Ley Federal del Trabajo."
    }
  ]
};

const categories = Object.keys(triviaQuestions);

// Validation schemas
const gameStartSchema = Joi.object({
  category: Joi.string().valid(...categories).required(),
  questionCount: Joi.number().min(1).max(10).default(5)
});

const gameAnswerSchema = Joi.object({
  gameId: Joi.string().required(),
  questionId: Joi.number().required(),
  answer: Joi.number().min(0).max(3).required(),
  timeSpent: Joi.number().min(0).max(60).required()
});

// Helper function to get random questions
const getRandomQuestions = (category, count = 5) => {
  const categoryQuestions = triviaQuestions[category] || [];
  const shuffled = [...categoryQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// @route   GET /api/trivia/categories
// @desc    Get trivia categories
// @access  Private
router.get('/categories', auth, (req, res) => {
  try {
    const categoryStats = categories.map(category => ({
      name: category,
      questionCount: triviaQuestions[category].length,
      difficulty: {
        easy: triviaQuestions[category].filter(q => q.difficulty === 'easy').length,
        medium: triviaQuestions[category].filter(q => q.difficulty === 'medium').length,
        hard: triviaQuestions[category].filter(q => q.difficulty === 'hard').length
      }
    }));

    res.json({
      success: true,
      categories: categoryStats
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   POST /api/trivia/start
// @desc    Start a new trivia game
// @access  Private
router.post('/start', auth, async (req, res) => {
  try {
    // Validate input
    const { error } = gameStartSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { category, questionCount = 5 } = req.body;
    const userId = req.user.userId;

    // Get random questions
    const questions = getRandomQuestions(category, questionCount);

    if (questions.length === 0) {
      return res.status(400).json({ message: 'No hay preguntas disponibles para esta categoría' });
    }

    // Create new game
    const game = new TriviaGame({
      userId,
      category,
      questions: questions.map(q => ({
        questionId: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correct,
        difficulty: q.difficulty
      })),
      status: 'active',
      startedAt: new Date()
    });

    await game.save();

    // Return questions without correct answers
    const gameQuestions = questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty
    }));

    res.json({
      success: true,
      gameId: game._id,
      category,
      questions: gameQuestions,
      totalQuestions: questions.length
    });

  } catch (error) {
    console.error('Start game error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   POST /api/trivia/answer
// @desc    Submit answer for a trivia question
// @access  Private
router.post('/answer', auth, async (req, res) => {
  try {
    // Validate input
    const { error } = gameAnswerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { gameId, questionId, answer, timeSpent } = req.body;
    const userId = req.user.userId;

    // Find game
    const game = await TriviaGame.findOne({ _id: gameId, userId });
    if (!game) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    if (game.status !== 'active') {
      return res.status(400).json({ message: 'El juego ya ha terminado' });
    }

    // Find question in game
    const question = game.questions.find(q => q.questionId === questionId);
    if (!question) {
      return res.status(404).json({ message: 'Pregunta no encontrada' });
    }

    if (question.answered) {
      return res.status(400).json({ message: 'Esta pregunta ya fue respondida' });
    }

    // Check answer
    const isCorrect = answer === question.correctAnswer;
    const points = isCorrect ? (question.difficulty === 'easy' ? 10 : question.difficulty === 'medium' ? 20 : 30) : 0;

    // Update question
    question.answered = true;
    question.userAnswer = answer;
    question.isCorrect = isCorrect;
    question.timeSpent = timeSpent;
    question.points = points;

    // Update game stats
    game.totalAnswered += 1;
    if (isCorrect) {
      game.correctAnswers += 1;
      game.totalPoints += points;
    }

    // Check if game is complete
    if (game.totalAnswered === game.questions.length) {
      game.status = 'completed';
      game.completedAt = new Date();
      
      // Update user stats
      await updateUserTriviaStats(userId, game);
    }

    await game.save();

    // Get explanation for the question
    const originalQuestion = Object.values(triviaQuestions)
      .flat()
      .find(q => q.id === questionId);

    res.json({
      success: true,
      isCorrect,
      points,
      correctAnswer: question.correctAnswer,
      explanation: originalQuestion?.explanation || '',
      gameStatus: game.status,
      currentScore: game.totalPoints,
      questionsRemaining: game.questions.length - game.totalAnswered
    });

  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   GET /api/trivia/leaderboard
// @desc    Get trivia leaderboard
// @access  Private
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const { category, scope = 'national' } = req.query;

    let matchStage = {};
    if (category && categories.includes(category)) {
      matchStage.category = category;
    }

    // Get top players
    const leaderboard = await TriviaGame.aggregate([
      { $match: { status: 'completed', ...matchStage } },
      {
        $group: {
          _id: '$userId',
          totalPoints: { $sum: '$totalPoints' },
          gamesPlayed: { $sum: 1 },
          correctAnswers: { $sum: '$correctAnswers' },
          totalQuestions: { $sum: { $size: '$questions' } }
        }
      },
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
          userId: '$_id',
          name: '$user.name',
          lastName: '$user.lastName',
          company: '$user.company',
          location: '$user.location',
          membershipLevel: '$user.membershipLevel',
          totalPoints: 1,
          gamesPlayed: 1,
          accuracy: {
            $round: [{ $multiply: [{ $divide: ['$correctAnswers', '$totalQuestions'] }, 100] }, 1]
          }
        }
      },
      { $sort: { totalPoints: -1 } },
      { $limit: 50 }
    ]);

    // Add ranking
    const rankedLeaderboard = leaderboard.map((player, index) => ({
      ...player,
      rank: index + 1
    }));

    res.json({
      success: true,
      leaderboard: rankedLeaderboard,
      category: category || 'all',
      scope
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   GET /api/trivia/stats
// @desc    Get user's trivia statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const stats = await TriviaGame.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId), status: 'completed' } },
      {
        $group: {
          _id: '$category',
          gamesPlayed: { $sum: 1 },
          totalPoints: { $sum: '$totalPoints' },
          correctAnswers: { $sum: '$correctAnswers' },
          totalQuestions: { $sum: { $size: '$questions' } },
          avgScore: { $avg: '$totalPoints' }
        }
      }
    ]);

    const overallStats = await TriviaGame.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId), status: 'completed' } },
      {
        $group: {
          _id: null,
          totalGames: { $sum: 1 },
          totalPoints: { $sum: '$totalPoints' },
          totalCorrect: { $sum: '$correctAnswers' },
          totalQuestions: { $sum: { $size: '$questions' } }
        }
      }
    ]);

    const overall = overallStats[0] || {
      totalGames: 0,
      totalPoints: 0,
      totalCorrect: 0,
      totalQuestions: 0
    };

    res.json({
      success: true,
      overall: {
        ...overall,
        accuracy: overall.totalQuestions > 0 
          ? Math.round((overall.totalCorrect / overall.totalQuestions) * 100) 
          : 0
      },
      byCategory: stats
    });

  } catch (error) {
    console.error('Get trivia stats error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Helper function to update user trivia stats
async function updateUserTriviaStats(userId, game) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Update overall stats
    user.triviaStats.totalGames += 1;
    user.triviaStats.totalCorrect += game.correctAnswers;
    user.triviaStats.totalPoints += game.totalPoints;

    // Update category stats
    const categoryKey = game.category.toLowerCase().replace(/\s+/g, '');
    if (user.triviaStats.categoryStats[categoryKey]) {
      user.triviaStats.categoryStats[categoryKey].played += 1;
      user.triviaStats.categoryStats[categoryKey].correct += game.correctAnswers;
    }

    await user.save();
  } catch (error) {
    console.error('Update user trivia stats error:', error);
  }
}

module.exports = router;