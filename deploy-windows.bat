@echo off
echo.
echo ========================================
echo 🚀 COPARMEX Connect - Deploy Produccion
echo ========================================
echo.

echo 📋 Checklist pre-deploy:
echo ✅ MongoDB Atlas configurado
echo ✅ Railway CLI instalado  
echo ✅ Backend listo para deploy
echo.

echo 🔧 Pasos para deploy:
echo.
echo 1. Asegurate de tener la URI de MongoDB Atlas
echo 2. Ejecuta los siguientes comandos:
echo.

echo cd backend
echo railway login
echo railway init
echo.

echo 3. Configura las variables de entorno:
echo railway variables set NODE_ENV=production
echo railway variables set JWT_SECRET=coparmex-connect-jwt-secret-super-seguro-2024
echo railway variables set MONGODB_URI="tu-mongodb-uri-de-atlas"
echo railway variables set OPENAI_API_KEY=demo-key
echo railway variables set CORS_ORIGINS=https://coparmex-connect.vercel.app,http://localhost:3000
echo.

echo 4. Deploy:
echo railway up
echo.

echo 🎯 URLs esperadas:
echo Backend: https://tu-proyecto.railway.app
echo Health: https://tu-proyecto.railway.app/api/health
echo.

echo ✨ ¡Presiona cualquier tecla para continuar!
pause > nul