# 🚀 COMANDOS FINALES - COPARMEX Connect

## ✅ Tu URI MongoDB está lista:
```
mongodb+srv://tarturocisneros_db_user:Pqb1RZxC73SMFm7m@cluster0.uk4bsyj.mongodb.net/coparmex-connect?retryWrites=true&w=majority
```

## 🎯 EJECUTA ESTOS COMANDOS EN ORDEN:

### 1. Ir al directorio backend:
```bash
cd backend
```

### 2. Login en Railway:
```bash
railway login
```

### 3. Inicializar proyecto:
```bash
railway init
```

### 4. Configurar variables de entorno (COPIA Y PEGA CADA LÍNEA):

```bash
railway variables set NODE_ENV=production
```

```bash
railway variables set JWT_SECRET=coparmex-connect-jwt-secret-super-seguro-2024
```

```bash
railway variables set OPENAI_API_KEY=demo-key
```

```bash
railway variables set CORS_ORIGINS=https://coparmex-connect.vercel.app,http://localhost:3000,http://localhost:19006
```

### 5. Configurar MongoDB URI (COPIA COMPLETA):
```bash
railway variables set MONGODB_URI="mongodb+srv://tarturocisneros_db_user:Pqb1RZxC73SMFm7m@cluster0.uk4bsyj.mongodb.net/coparmex-connect?retryWrites=true&w=majority"
```

### 6. DEPLOY FINAL:
```bash
railway up
```

## ⏱ Tiempo estimado: 3-5 minutos

## ✅ Resultado esperado:
- URL del backend: `https://tu-proyecto.railway.app`
- Health check: `https://tu-proyecto.railway.app/api/health`

## 🆘 Si hay errores:
```bash
railway logs
```

¡EJECUTA LOS COMANDOS Y AVÍSAME CUANDO TERMINE!