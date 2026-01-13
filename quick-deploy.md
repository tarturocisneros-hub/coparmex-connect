# ⚡ Deploy Rápido - COPARMEX Connect

## 🚀 Opción 1: Railway (Recomendado)

### Pasos simples:

1. **Instalar Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login en Railway**
```bash
railway login
```

3. **Deploy desde el directorio backend**
```bash
cd backend
railway init
railway up
```

4. **Configurar variables de entorno**
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=coparmex-connect-super-secret-2024
railway variables set MONGODB_URI=mongodb://localhost:27017/coparmex-connect
```

**¡Listo!** Tu API estará en: `https://tu-proyecto.railway.app`

---

## 🌐 Opción 2: Render (Alternativa gratuita)

1. Ve a [render.com](https://render.com)
2. Conecta tu repositorio GitHub
3. Selecciona "Web Service"
4. Build Command: `cd backend && npm install`
5. Start Command: `cd backend && npm start`
6. Agrega variables de entorno

---

## 📱 Opción 3: Heroku (Clásico)

```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Crear app
heroku create coparmex-connect-api

# Deploy
git subtree push --prefix backend heroku main
```

---

## 🗄 MongoDB Gratuito

### MongoDB Atlas (Recomendado):
1. [mongodb.com/atlas](https://mongodb.com/atlas)
2. Crear cluster M0 (gratuito)
3. Obtener URI de conexión
4. Configurar en Railway

### Alternativa - MongoDB en Railway:
```bash
railway add mongodb
```

---

## ✅ Verificar Deploy

Una vez desplegado, prueba:

```bash
curl https://tu-proyecto.railway.app/api/health
```

Deberías ver:
```json
{
  "status": "OK",
  "timestamp": "2024-01-13T...",
  "version": "1.0.0"
}
```

---

## 🔧 Actualizar Frontend

En `src/services/api.js`:

```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api' 
  : 'https://tu-proyecto.railway.app/api';
```

---

## 🎯 URLs de Prueba

Una vez desplegado:

- **Health**: `/api/health`
- **Login**: `POST /api/auth/login`
- **Trivia**: `GET /api/trivia/categories`
- **Chat**: `POST /api/chat/message`

---

**¡En 5 minutos tendrás tu API en producción!** 🚀