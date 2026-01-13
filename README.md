# COPARMEX Connect

Una plataforma móvil de alto impacto para socios de COPARMEX que combina Inteligencia Artificial y Gamificación para fomentar la participación y el networking estratégico.

## 🚀 Características Principales

### 🔐 Autenticación
- Login con número de socio
- Validación de membresía

### 📊 Test de Perfilamiento
- 12 preguntas situacionales
- 4 perfiles empresariales: Humanista, Técnico/Legal, Industrial/Económico, Innovación
- Recomendación de 3 comisiones por perfil

### 🎮 Copar-Trivia
- 96 preguntas en 8 categorías
- Sistema de desafíos entre socios
- Rankings nacional y local
- Gamificación con puntos

### 🤖 Copar-IA
- Chatbot especializado en legislación mexicana
- Consultas legales y fiscales instantáneas
- Entrenado en estatutos de COPARMEX

### 💼 Networking B2B
- Directorio exclusivo de socios
- Búsqueda por sector y ubicación
- Perfiles empresariales detallados

### 💳 Smart Wallet
- Mapa de beneficios geolocalizados
- Descuentos exclusivos para socios
- Alianzas comerciales

## 🛠 Stack Tecnológico

- **Frontend**: React Native + Expo
- **Navegación**: React Navigation
- **UI**: Expo Linear Gradient, Vector Icons
- **Estado**: Context API
- **Backend**: Node.js + Express (próximamente)
- **Base de datos**: MongoDB (próximamente)
- **IA**: OpenAI GPT-4 (próximamente)

## 📱 Instalación

1. Clona el repositorio
```bash
git clone [repository-url]
cd coparmex-connect
```

2. Instala las dependencias
```bash
npm install
```

3. Inicia el proyecto
```bash
npm start
```

4. Ejecuta en dispositivo/emulador
```bash
npm run android  # Para Android
npm run ios      # Para iOS
```

## 📋 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   └── ActionCard.js   # Tarjetas de acción principales
├── context/            # Context API para estado global
│   └── UserContext.js  # Contexto de usuario
├── data/               # Datos mock y configuraciones
│   ├── questions.js    # Preguntas del test de perfilamiento
│   └── triviaQuestions.js # Banco de preguntas trivia
├── screens/            # Pantallas principales
│   ├── LoginScreen.js
│   ├── OnboardingScreen.js
│   ├── HomeScreen.js
│   ├── TriviaScreen.js
│   ├── BusinessScreen.js
│   └── CoparIAScreen.js
└── assets/             # Recursos estáticos
    └── logocoparmex.png
```

## 🎯 Funcionalidades Implementadas

### ✅ Completadas
- [x] Pantalla de login con validación
- [x] Test de perfilamiento (12 preguntas)
- [x] Dashboard principal con Action Cards
- [x] Sistema de navegación con tabs
- [x] Módulo Copar-Trivia completo
- [x] Directorio B2B con búsqueda
- [x] Smart Wallet con beneficios
- [x] Chat Copar-IA con respuestas mock
- [x] Perfiles de usuario y recomendaciones

### 🔄 En Desarrollo
- [ ] Backend API con Node.js
- [ ] Base de datos MongoDB
- [ ] Integración con OpenAI
- [ ] Sistema de autenticación real
- [ ] Notificaciones push
- [ ] Geolocalización para beneficios

## 🎨 Diseño UX/UI

- **Action Cards**: Elementos grandes y pulsables
- **Hero Screen**: Pantalla inicial personalizada por perfil
- **Tab Navigation**: 4 secciones principales (Inicio, Desafío, Negocios, Copar-IA)
- **Gradientes**: Colores corporativos de COPARMEX
- **Responsive**: Adaptado para iOS y Android

## 📊 Perfiles de Usuario

### Humanista
- **Enfoque**: Desarrollo humano y responsabilidad social
- **Comisiones**: Educación, Responsabilidad Social, Salud
- **Color**: Verde (#10B981)

### Técnico/Legal
- **Enfoque**: Cumplimiento normativo y aspectos legales
- **Comisiones**: Fiscal, Laboral, Justicia y Seguridad
- **Color**: Azul (#3B82F6)

### Industrial/Económico
- **Enfoque**: Producción, infraestructura y desarrollo económico
- **Comisiones**: Energía, Infraestructura, Vivienda
- **Color**: Amarillo (#F59E0B)

### Innovación
- **Enfoque**: Tecnología y transformación digital
- **Comisiones**: Innovación, Negocios Digitales, Jóvenes Empresarios
- **Color**: Morado (#8B5CF6)

## 🎮 Categorías de Trivia

1. **Emprendimiento**: MVP, Burn Rate, Scalability
2. **Finanzas Sanas**: EBITDA, ROA, Flujo de Caja
3. **Gobernabilidad**: Compliance, Consejo de Administración
4. **Empresas Familiares**: Protocolo Familiar, Sucesión
5. **Economía**: PIB, Nearshoring, TIIE
6. **Leyes Laborales**: NOM-035, PTU, REPSE
7. **Comercio Exterior**: T-MEC, Incoterms, IMMEX
8. **Filosofía COPARMEX**: Luis G. Sada, Subsidiaridad, MDI

## 🤖 Capacidades de Copar-IA

- Consultas fiscales y tributarias
- Leyes laborales mexicanas
- Comercio exterior (T-MEC, IMMEX)
- Empresas familiares y gobernanza
- Estatutos y filosofía COPARMEX
- Respuestas contextualizadas en tiempo real

## 📈 Próximos Pasos

1. **Backend Development**
   - API REST con Node.js
   - Base de datos MongoDB
   - Sistema de autenticación JWT

2. **Integración IA**
   - Conexión con OpenAI GPT-4
   - Entrenamiento con documentos COPARMEX
   - Respuestas más precisas y contextuales

3. **Funcionalidades Avanzadas**
   - Notificaciones push para desafíos
   - Geolocalización para beneficios
   - Sistema de puntos y recompensas
   - Chat entre socios

4. **Optimización**
   - Performance y carga rápida
   - Offline capabilities
   - Analytics y métricas de uso

## 📞 Contacto

Para más información sobre el proyecto COPARMEX Connect, contacta al equipo de desarrollo.

---

**COPARMEX Connect** - Transformando la experiencia empresarial a través de la tecnología 🚀