# 🚀 Deploy COPARMEX Connect - AHORA

## 📍 Situación Actual
Estás en MongoDB Atlas seleccionando patrones arquitectónicos.

## ✅ Paso 1: Completar MongoDB Atlas

### En la pantalla actual (Architectural Patterns):
Selecciona estos patrones que coinciden con tu app:

- ✅ **API/ML** - Para Copar-IA (chatbot con OpenAI)
- ✅ **Search** - Para directorio B2B de socios  
- ✅ **Events** - Para sistema de trivia y gamificación
- ✅ **IoT** - Para geolocalización del Smart Wallet

### Después de seleccionar:
1. Click "Continue" o "Next"
2. Espera a que se cree el cluster (2-3 minutos)
3. Ve a "Database Access" y crea usuario:
   - Username: `tarturocisneros_db_user`
   - Password: `Pqb1RZxC73SMFm7m`
4. Ve a "Network Access" y agrega IP: `0.0.0.0/0`
5. Click "Connect" → "Connect your application"
6. Copia la URI que se ve así:
   ```
   mongodb+srv://coparmex-admin:CoparmexConnect2024!@coparmex-connect.xxxxx.mongodb.net/coparmex-connect
   ```

## ✅ Paso 2: Deploy Backend a Railway

Abre una nueva terminal en la carpeta backend y ejecuta:

```bash
# 1. Login en Railway
railway login

# 2. Inicializar proyecto
railway init

# 3. Configurar variables (REEMPLAZA la URI con la tuya)
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=coparmex-connect-jwt-secret-super-seguro-2024
railway variables set MONGODB_URI="mongodb+srv://tarturocisneros_db_user:Pqb1RZxC73SMFm7m@coparmex-connect.xxxxx.mongodb.net/coparmex-connect"
railway variables set OPENAI_API_KEY=demo-key
railway variables set CORS_ORIGINS=https://coparmex-connect.vercel.app,http://localhost:3000,http://localhost:19006

# 4. Deploy!
railway up
```

## ✅ Paso 3: Verificar Deploy

Una vez que Railway termine (2-3 minutos), obtendrás una URL como:
`https://coparmex-connect-backend-production.up.railway.app`

Prueba que funcione:
```bash
curl https://tu-url.railway.app/api/health
```

Deberías ver:
```json
{
  "status": "OK",
  "message": "COPARMEX Connect API is running",
  "timestamp": "2024-01-13T..."
}
```

## ✅ Paso 4: Actualizar Frontend

En `src/services/api.js`, cambia la línea 6:

```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api' 
  : 'https://TU-URL-DE-RAILWAY.railway.app/api';  // ← Pon tu URL aquí
```

## 🎯 Resultado Final

Tendrás:
- ✅ **Base de datos**: MongoDB Atlas (gratuito, 512MB)
- ✅ **Backend API**: Railway (gratuito, 500 horas/mes)
- ✅ **Frontend**: Funcionando con Expo
- ✅ **Todas las funciones**: Login, trivia, chat, directorio, beneficios

## 🆘 Si algo falla:

### Error de conexión MongoDB:
- Verifica que la IP `0.0.0.0/0` esté en Network Access
- Verifica usuario y password en Database Access

### Error en Railway:
```bash
railway logs  # Ver logs de error
railway status  # Ver estado del deploy
```

### Error en frontend:
- Verifica que la URL en `api.js` sea correcta
- Prueba la URL en el navegador: `https://tu-url/api/health`

## 🎉 ¡En 10 minutos tendrás tu app en producción!

**Siguiente paso**: Completa MongoDB Atlas y avísame para continuar con Railway.