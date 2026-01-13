# COPARMEX Connect - Backend API

Backend API para la plataforma móvil COPARMEX Connect, construido con Node.js, Express y MongoDB.

## 🚀 Características

- **Autenticación JWT** - Sistema seguro de login con tokens
- **Perfilamiento Empresarial** - Test de 12 preguntas con 4 perfiles
- **Sistema de Trivia** - 96+ preguntas en 8 categorías
- **Copar-IA** - Chatbot especializado en legislación mexicana
- **Directorio B2B** - Networking empresarial con búsqueda avanzada
- **Smart Wallet** - Sistema de beneficios geolocalizados
- **Panel Administrativo** - Dashboard con analytics completos

## 📋 Requisitos

- Node.js 16+
- MongoDB 4.4+
- npm o yarn

## 🛠 Instalación

1. **Clonar el repositorio**
```bash
git clone [repository-url]
cd coparmex-connect/backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Iniciar MongoDB**
```bash
# En Windows con MongoDB instalado
mongod

# O usar MongoDB Atlas (cloud)
```

5. **Iniciar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/login` - Login con número de socio
- `POST /api/auth/register` - Registro de nuevo usuario
- `GET /api/auth/verify` - Verificar token JWT

### Usuarios
- `GET /api/users/me` - Obtener perfil del usuario
- `PUT /api/users/me` - Actualizar perfil
- `GET /api/users/stats` - Estadísticas del usuario
- `GET /api/users/leaderboard` - Tabla de posiciones

### Perfiles
- `GET /api/profiles/questions` - Obtener preguntas del test
- `POST /api/profiles/submit` - Enviar respuestas del test
- `GET /api/profiles/me` - Obtener perfil empresarial
- `GET /api/profiles/stats` - Estadísticas de perfiles

### Trivia
- `GET /api/trivia/categories` - Obtener categorías
- `POST /api/trivia/start` - Iniciar nuevo juego
- `POST /api/trivia/answer` - Enviar respuesta
- `GET /api/trivia/leaderboard` - Tabla de posiciones
- `GET /api/trivia/stats` - Estadísticas del usuario

### Chat (Copar-IA)
- `POST /api/chat/message` - Enviar mensaje al chatbot
- `GET /api/chat/sessions` - Obtener sesiones de chat
- `GET /api/chat/session/:id` - Obtener sesión específica
- `GET /api/chat/quick-questions` - Preguntas frecuentes

### Negocios (B2B)
- `GET /api/business/directory` - Directorio de empresas
- `GET /api/business/sectors` - Sectores disponibles
- `GET /api/business/profile/:id` - Perfil de empresa
- `PUT /api/business/profile` - Actualizar perfil empresarial
- `POST /api/business/review` - Agregar reseña

### Beneficios
- `GET /api/benefits` - Obtener beneficios disponibles
- `GET /api/benefits/featured` - Beneficios destacados
- `GET /api/benefits/categories` - Categorías de beneficios
- `GET /api/benefits/:id` - Detalles de beneficio
- `POST /api/benefits/:id/use` - Usar beneficio
- `GET /api/benefits/nearby` - Beneficios cercanos

### Administración
- `GET /api/admin/dashboard` - Dashboard administrativo
- `GET /api/admin/users` - Lista de usuarios
- `GET /api/admin/analytics` - Analytics detallados

## 🗄 Modelos de Datos

### Usuario
```javascript
{
  memberNumber: String,
  email: String,
  name: String,
  lastName: String,
  company: String,
  position: String,
  phone: String,
  location: {
    state: String,
    city: String,
    address: String
  },
  membershipLevel: String,
  profileType: String,
  profileAnswers: Array,
  recommendedCommissions: Array,
  triviaStats: Object,
  businessProfile: Object,
  preferences: Object
}
```

### Juego de Trivia
```javascript
{
  userId: ObjectId,
  category: String,
  questions: Array,
  status: String,
  totalAnswered: Number,
  correctAnswers: Number,
  totalPoints: Number,
  startedAt: Date,
  completedAt: Date
}
```

### Sesión de Chat
```javascript
{
  userId: ObjectId,
  title: String,
  messages: Array,
  status: String,
  category: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `NODE_ENV` | Entorno (development/production) | No |
| `PORT` | Puerto del servidor | No |
| `MONGODB_URI` | URI de conexión a MongoDB | Sí |
| `JWT_SECRET` | Clave secreta para JWT | Sí |
| `OPENAI_API_KEY` | API key de OpenAI | No |

### Base de Datos

El sistema usa MongoDB con las siguientes colecciones:
- `users` - Usuarios y perfiles
- `triviagames` - Juegos de trivia
- `chatsessions` - Sesiones de chat
- `benefitusages` - Uso de beneficios

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

## 📊 Monitoreo

### Health Check
```bash
GET /api/health
```

### Logs
Los logs se almacenan en:
- Consola (desarrollo)
- Archivo `logs/app.log` (producción)

## 🚀 Deployment

### Docker
```bash
# Construir imagen
docker build -t coparmex-connect-api .

# Ejecutar contenedor
docker run -p 5000:5000 coparmex-connect-api
```

### PM2 (Producción)
```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicación
pm2 start server.js --name "coparmex-api"

# Monitorear
pm2 monit
```

## 🔒 Seguridad

- **Helmet** - Headers de seguridad
- **CORS** - Control de acceso entre dominios
- **Rate Limiting** - Límite de peticiones por IP
- **JWT** - Tokens seguros para autenticación
- **Validación** - Joi para validar entrada de datos
- **Sanitización** - Limpieza de datos de entrada

## 📈 Performance

- **Índices MongoDB** - Optimización de consultas
- **Agregaciones** - Consultas eficientes para estadísticas
- **Paginación** - Límite de resultados por página
- **Caché** - Redis para datos frecuentes (próximamente)

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico, contactar a:
- Email: dev@coparmex.org.mx
- Slack: #coparmex-connect-dev

---

**COPARMEX Connect API** - Transformando el networking empresarial mexicano 🇲🇽