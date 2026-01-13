# 🚀 Deploy Final - COPARMEX Connect

## 📋 Tus credenciales MongoDB:
- **Username**: `tarturocisneros_db_user`
- **Password**: `Pqb1RZxC73SMFm7m`

## 🎯 Comandos para ejecutar AHORA:

### 1. Ir al directorio backend:
```bash
cd backend
```

### 2. Login en Railway:
```bash
railway login
```
(Se abrirá tu navegador para autenticarte)

### 3. Inicializar proyecto:
```bash
railway init
```

### 4. Configurar variables de entorno:
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=coparmex-connect-jwt-secret-super-seguro-2024
railway variables set OPENAI_API_KEY=demo-key
railway variables set CORS_ORIGINS=https://coparmex-connect.vercel.app,http://localhost:3000,http://localhost:19006
```

### 5. Configurar MongoDB URI:
**NECESITO QUE ME DIGAS EL NOMBRE DE TU CLUSTER**

Una vez que tengas el nombre del cluster, el comando será:
```bash
railway variables set MONGODB_URI="mongodb+srv://tarturocisneros_db_user:Pqb1RZxC73SMFm7m@TU-CLUSTER.xxxxx.mongodb.net/coparmex-connect"
```

### 6. Deploy:
```bash
railway up
```

## 🔍 ¿Cómo encontrar el nombre de tu cluster?

En MongoDB Atlas:
1. Ve a la página principal de tu proyecto
2. Verás tu cluster listado (algo como `Cluster0` o `coparmex-connect`)
3. Click en "Connect"
4. Selecciona "Connect your application"
5. Copia la URI completa

## 🎯 Una vez que tengas la URI completa:
Avísame y haremos el deploy final en 2 minutos.

## ✅ Resultado esperado:
- Backend funcionando en: `https://tu-proyecto.railway.app`
- Health check: `https://tu-proyecto.railway.app/api/health`
- API lista para la app móvil