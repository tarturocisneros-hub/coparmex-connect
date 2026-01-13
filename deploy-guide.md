# 🚀 Guía de Deploy - COPARMEX Connect

Esta guía te ayudará a desplegar COPARMEX Connect en producción.

## 📋 Opciones de Deploy

### 1. 🚂 Railway (Recomendado para Backend)

Railway es perfecto para el backend Node.js con MongoDB.

#### Pasos:

1. **Crear cuenta en Railway**
   - Ve a [railway.app](https://railway.app)
   - Regístrate con GitHub

2. **Conectar repositorio**
   ```bash
   # Instalar Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Inicializar proyecto
   railway init
   ```

3. **Configurar variables de entorno**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=tu-jwt-secret-super-seguro
   railway variables set MONGODB_URI=tu-mongodb-uri
   railway variables set OPENAI_API_KEY=tu-openai-key
   ```

4. **Deploy**
   ```bash
   railway up
   ```

#### URL del backend: `https://tu-proyecto.railway.app`

### 2. ▲ Vercel (Para Frontend Web)

Vercel es excelente para el frontend y demos web.

#### Pasos:

1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

#### URL del frontend: `https://tu-proyecto.vercel.app`

### 3. 📱 Expo EAS (Para Apps Móviles)

Para crear APKs y publicar en stores.

#### Pasos:

1. **Instalar EAS CLI**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Configurar EAS**
   ```bash
   eas build:configure
   ```

3. **Build APK**
   ```bash
   # Android APK
   eas build --platform android --profile preview
   
   # iOS (requiere cuenta de desarrollador)
   eas build --platform ios --profile preview
   ```

## 🗄 Base de Datos

### MongoDB Atlas (Recomendado)

1. **Crear cuenta en MongoDB Atlas**
   - Ve a [mongodb.com/atlas](https://mongodb.com/atlas)
   - Crea un cluster gratuito

2. **Configurar acceso**
   - Whitelist IP: `0.0.0.0/0` (para desarrollo)
   - Crear usuario de base de datos

3. **Obtener URI de conexión**
   ```
   mongodb+srv://usuario:password@cluster.mongodb.net/coparmex-connect
   ```

## 🔧 Variables de Entorno de Producción

### Backend (.env)
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/coparmex-connect
JWT_SECRET=tu-jwt-secret-super-seguro-de-al-menos-32-caracteres
OPENAI_API_KEY=sk-tu-openai-api-key
CORS_ORIGINS=https://tu-frontend.vercel.app,https://coparmex-connect.com
```

### Frontend (actualizar src/services/api.js)
```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api' 
  : 'https://tu-backend.railway.app/api';
```

## 🌐 Dominios Personalizados

### Para Railway:
1. Ve a tu proyecto en Railway
2. Settings → Domains
3. Agregar dominio personalizado

### Para Vercel:
1. Ve a tu proyecto en Vercel
2. Settings → Domains
3. Agregar dominio personalizado

## 📊 Monitoreo

### Railway
- Logs automáticos en el dashboard
- Métricas de CPU y memoria
- Health checks configurados

### Vercel
- Analytics integrados
- Logs de funciones
- Performance insights

## 🔒 Seguridad en Producción

### Checklist:
- [ ] JWT_SECRET único y seguro (32+ caracteres)
- [ ] CORS configurado correctamente
- [ ] Rate limiting activado
- [ ] HTTPS habilitado
- [ ] Variables de entorno seguras
- [ ] MongoDB con autenticación
- [ ] Logs de seguridad activados

## 🚀 Deploy Automático

### GitHub Actions (Opcional)

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install Railway
      run: npm install -g @railway/cli
    - name: Deploy
      run: railway up --detach
      env:
        RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## 📱 Distribución de APK

### Opción 1: Direct Download
1. Build APK con EAS
2. Subir a Google Drive/Dropbox
3. Compartir link de descarga

### Opción 2: Google Play Store
1. Crear cuenta de desarrollador ($25)
2. Build AAB con EAS
3. Subir a Play Console

### Opción 3: TestFlight (iOS)
1. Cuenta de desarrollador Apple ($99/año)
2. Build con EAS
3. Subir a TestFlight

## 🎯 URLs de Producción Sugeridas

- **Backend API**: `https://coparmex-connect-api.railway.app`
- **Frontend Web**: `https://coparmex-connect.vercel.app`
- **Demo**: `https://demo.coparmex-connect.com`

## 📞 Soporte Post-Deploy

### Monitoreo recomendado:
- **Uptime**: UptimeRobot (gratuito)
- **Errors**: Sentry (plan gratuito)
- **Analytics**: Google Analytics
- **Performance**: Vercel Analytics

### Logs importantes:
```bash
# Railway logs
railway logs

# Vercel logs
vercel logs

# Local testing
npm run dev
```

## 🎉 ¡Deploy Completado!

Una vez desplegado, tendrás:

✅ **Backend API** funcionando en Railway  
✅ **Frontend web** en Vercel  
✅ **APK** para distribución  
✅ **Base de datos** en MongoDB Atlas  
✅ **Monitoreo** y logs configurados  

**¡Tu aplicación estará lista para competir con cualquier startup unicornio!** 🦄

---

**¿Necesitas ayuda?** Contacta al equipo de desarrollo.