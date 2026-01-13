@echo off
echo.
echo ========================================
echo 🚀 COPARMEX Connect - Deploy AHORA
echo ========================================
echo.

echo 📋 Tu configuracion:
echo Username: tarturocisneros_db_user
echo Password: Pqb1RZxC73SMFm7m
echo.

echo 🔧 Comandos para ejecutar en orden:
echo.

echo 1. Ir al directorio backend:
echo cd backend
echo.

echo 2. Login en Railway:
echo railway login
echo.

echo 3. Inicializar proyecto:
echo railway init
echo.

echo 4. Configurar variables (COPIA Y PEGA CADA LINEA):
echo.
echo railway variables set NODE_ENV=production
echo railway variables set JWT_SECRET=coparmex-connect-jwt-secret-super-seguro-2024
echo railway variables set OPENAI_API_KEY=demo-key
echo railway variables set CORS_ORIGINS=https://coparmex-connect.vercel.app,http://localhost:3000,http://localhost:19006
echo.

echo 5. IMPORTANTE - Configura MongoDB URI (REEMPLAZA xxxxx con tu cluster):
echo railway variables set MONGODB_URI="mongodb+srv://tarturocisneros_db_user:Pqb1RZxC73SMFm7m@coparmex-connect.xxxxx.mongodb.net/coparmex-connect"
echo.

echo 6. Deploy:
echo railway up
echo.

echo 🎯 Necesito que me digas:
echo - El nombre de tu cluster de MongoDB
echo - La URI completa que te dio Atlas
echo.

echo ✨ ¡Presiona cualquier tecla para continuar!
pause > nul