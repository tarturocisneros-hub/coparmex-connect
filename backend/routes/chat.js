const express = require('express');
const Joi = require('joi');
const OpenAI = require('openai');
const User = require('../models/User');
const ChatSession = require('../models/ChatSession');
const auth = require('../middleware/auth');
const router = express.Router();

// Initialize OpenAI (will be configured with real API key in production)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key'
});

// COPARMEX knowledge base for AI responses
const coparmexKnowledge = {
  fiscal: {
    keywords: ['fiscal', 'impuesto', 'sat', 'rfc', 'cfdi', 'factura', 'declaracion'],
    responses: {
      obligaciones: "Las principales obligaciones fiscales para empresas en México incluyen:\n\n• Inscripción en el RFC\n• Presentación de declaraciones mensuales y anuales\n• Emisión de CFDI (Comprobantes Fiscales Digitales)\n• Llevar contabilidad electrónica\n• Cumplir con retenciones de ISR e IVA\n\nPara más detalles específicos de tu situación, te recomiendo consultar con un contador certificado.",
      cfdi: "Los CFDI (Comprobantes Fiscales Digitales por Internet) son obligatorios desde 2014. Características principales:\n\n• Deben tener sello digital del SAT\n• Incluir RFC del emisor y receptor\n• Especificar uso del CFDI\n• Timbrado dentro de 72 horas\n• Conservar por 5 años\n\n¿Necesitas ayuda con algún aspecto específico de facturación?"
    }
  },
  laboral: {
    keywords: ['ptu', 'nom-035', 'repse', 'vacaciones', 'laboral', 'trabajador', 'nomina'],
    responses: {
      ptu: "La Participación de los Trabajadores en las Utilidades (PTU) se calcula así:\n\n1. Base: Renta gravable del ejercicio fiscal\n2. Porcentaje: 10% de las utilidades\n3. Distribución: 50% por días trabajados, 50% por salarios\n\nFechas límite de pago:\n• Personas morales: 30 de mayo\n• Personas físicas: 29 de junio\n\n¿Necesitas ayuda con el cálculo específico?",
      nom035: "La NOM-035-STPS-2018 regula los factores de riesgo psicosocial:\n\n**Obligaciones:**\n• Identificar y analizar factores de riesgo\n• Implementar medidas preventivas\n• Realizar evaluaciones del entorno laboral\n• Capacitar a trabajadores\n\n**Aplica a:** Centros de trabajo con 15+ trabajadores\n**Vigencia:** Desde octubre 2019\n\n¿Te ayudo con la implementación específica?",
      vacaciones: "La reforma laboral de 2023 estableció:\n\n• Mínimo 12 días de vacaciones en el primer año\n• Incremento progresivo hasta 30 días\n• Prima vacacional mínima del 25%\n• Derecho irrenunciable\n\nEsto representa un cambio significativo respecto a los 6 días anteriores."
    }
  },
  comercioExterior: {
    keywords: ['tmec', 'usmca', 'aduanas', 'aranceles', 'exportacion', 'importacion', 'incoterms'],
    responses: {
      tmec: "El T-MEC (Tratado México-Estados Unidos-Canadá) ofrece beneficios clave:\n\n**Comercio:**\n• Eliminación de aranceles en productos específicos\n• Reglas de origen más claras\n• Facilitación aduanera\n\n**Sectores beneficiados:**\n• Automotriz (75% contenido regional)\n• Textil y confección\n• Agrícola\n• Servicios digitales\n\n¿Qué sector te interesa explorar?",
      incoterms: "Los Incoterms 2020 más utilizados en México:\n\n• **EXW** - Ex Works (mínima responsabilidad vendedor)\n• **FOB** - Free on Board (común en marítimo)\n• **CIF** - Cost, Insurance & Freight\n• **DDP** - Delivered Duty Paid (máxima responsabilidad vendedor)\n\n¿Necesitas ayuda eligiendo el Incoterm adecuado?"
    }
  },
  coparmex: {
    keywords: ['coparmex', 'fundador', 'sada', 'subsidiaridad', 'vertebracion', 'mdi'],
    responses: {
      historia: "COPARMEX fue fundada en 1936 por Luis G. Sada en Monterrey, Nuevo León. Nació como respuesta a la necesidad de defender los intereses del sector empresarial y promover el desarrollo económico del país.",
      subsidiaridad: "El principio de Subsidiaridad en COPARMEX significa que las decisiones deben tomarse en el nivel más cercano al ciudadano. Esto fortalece:\n\n• Gobiernos locales\n• Organizaciones intermedias\n• Participación ciudadana\n• Democracia participativa",
      mdi: "El Modelo de Desarrollo Inclusivo (MDI) de COPARMEX busca:\n\n• Crecimiento económico equitativo\n• Generación de empleos de calidad\n• Reducción de desigualdades\n• Fortalecimiento institucional\n• Desarrollo sustentable\n\nEs la propuesta empresarial para un México próspero e incluyente."
    }
  }
};

// Validation schema
const chatMessageSchema = Joi.object({
  message: Joi.string().required().min(1).max(1000),
  sessionId: Joi.string().optional()
});

// Helper function to generate AI response
const generateAIResponse = async (message, userContext = {}) => {
  const lowerMessage = message.toLowerCase();
  
  // Check for specific topics in COPARMEX knowledge base
  for (const [topic, data] of Object.entries(coparmexKnowledge)) {
    const hasKeyword = data.keywords.some(keyword => lowerMessage.includes(keyword));
    
    if (hasKeyword) {
      // Find specific response
      for (const [key, response] of Object.entries(data.responses)) {
        if (lowerMessage.includes(key) || data.keywords.some(k => k === key && lowerMessage.includes(k))) {
          return response;
        }
      }
      
      // Return general topic response
      const responses = Object.values(data.responses);
      return responses[0] || "Entiendo tu consulta sobre este tema. ¿Podrías ser más específico?";
    }
  }
  
  // Default responses for common queries
  if (lowerMessage.includes('hola') || lowerMessage.includes('buenos')) {
    return "¡Hola! Soy Copar-IA, tu asistente especializado en legislación mexicana y temas empresariales. ¿En qué puedo ayudarte hoy?";
  }
  
  if (lowerMessage.includes('gracias')) {
    return "¡De nada! Estoy aquí para ayudarte con cualquier consulta legal, fiscal o empresarial. ¿Hay algo más en lo que pueda asistirte?";
  }
  
  // General business/legal response
  return `Entiendo tu consulta sobre "${message}". Como especialista en legislación mexicana y temas empresariales, puedo ayudarte con:

• Obligaciones fiscales y tributarias
• Leyes laborales (NOM-035, PTU, REPSE)
• Comercio exterior (T-MEC, IMMEX)
• Empresas familiares y gobernanza
• Estatutos y filosofía COPARMEX

¿Podrías ser más específico sobre qué aspecto te interesa?`;
};

// @route   POST /api/chat/message
// @desc    Send message to Copar-IA
// @access  Private
router.post('/message', auth, async (req, res) => {
  try {
    // Validate input
    const { error } = chatMessageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { message, sessionId } = req.body;
    const userId = req.user.userId;

    // Get user context
    const user = await User.findById(userId);
    const userContext = {
      profileType: user?.profileType,
      company: user?.company,
      location: user?.location
    };

    // Find or create chat session
    let session;
    if (sessionId) {
      session = await ChatSession.findOne({ _id: sessionId, userId });
    }
    
    if (!session) {
      session = new ChatSession({
        userId,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        messages: []
      });
    }

    // Add user message
    session.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Generate AI response
    let aiResponse;
    try {
      if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'demo-key') {
        // Use real OpenAI API in production
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `Eres Copar-IA, un asistente especializado en legislación mexicana, temas empresariales y COPARMEX. 
              Responde de manera profesional, precisa y útil. Enfócate en:
              - Legislación fiscal y tributaria mexicana
              - Leyes laborales (NOM-035, PTU, REPSE, etc.)
              - Comercio exterior (T-MEC, IMMEX, Incoterms)
              - Empresas familiares y gobernanza corporativa
              - Historia y filosofía de COPARMEX
              
              Usuario: ${userContext.company || 'Empresa'} en ${userContext.location?.state || 'México'}
              Perfil: ${userContext.profileType || 'No definido'}`
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        });
        
        aiResponse = completion.choices[0].message.content;
      } else {
        // Use local knowledge base for demo
        aiResponse = await generateAIResponse(message, userContext);
      }
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      // Fallback to local response
      aiResponse = await generateAIResponse(message, userContext);
    }

    // Add AI response
    session.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });

    session.updatedAt = new Date();
    await session.save();

    res.json({
      success: true,
      sessionId: session._id,
      message: aiResponse,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Chat message error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   GET /api/chat/sessions
// @desc    Get user's chat sessions
// @access  Private
router.get('/sessions', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 20, page = 1 } = req.query;

    const sessions = await ChatSession.find({ userId })
      .select('title createdAt updatedAt messageCount')
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await ChatSession.countDocuments({ userId });

    res.json({
      success: true,
      sessions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get chat sessions error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   GET /api/chat/session/:sessionId
// @desc    Get specific chat session
// @access  Private
router.get('/session/:sessionId', auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    const session = await ChatSession.findOne({ _id: sessionId, userId });

    if (!session) {
      return res.status(404).json({ message: 'Sesión de chat no encontrada' });
    }

    res.json({
      success: true,
      session
    });

  } catch (error) {
    console.error('Get chat session error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   DELETE /api/chat/session/:sessionId
// @desc    Delete chat session
// @access  Private
router.delete('/session/:sessionId', auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    const session = await ChatSession.findOneAndDelete({ _id: sessionId, userId });

    if (!session) {
      return res.status(404).json({ message: 'Sesión de chat no encontrada' });
    }

    res.json({
      success: true,
      message: 'Sesión eliminada correctamente'
    });

  } catch (error) {
    console.error('Delete chat session error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   GET /api/chat/quick-questions
// @desc    Get quick question suggestions
// @access  Private
router.get('/quick-questions', auth, (req, res) => {
  try {
    const quickQuestions = [
      "¿Cuáles son las obligaciones fiscales de mi empresa?",
      "¿Cómo calcular la PTU correctamente?",
      "¿Qué es la NOM-035 y cómo cumplirla?",
      "¿Cuáles son los beneficios del T-MEC?",
      "¿Cómo implementar un protocolo familiar?",
      "¿Qué documentos necesito para exportar?",
      "¿Cuándo debo presentar declaraciones fiscales?",
      "¿Qué es REPSE y cómo me afecta?",
      "¿Cuáles son los nuevos días de vacaciones?",
      "¿Qué es la vertebración social en COPARMEX?"
    ];

    res.json({
      success: true,
      questions: quickQuestions
    });

  } catch (error) {
    console.error('Get quick questions error:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;