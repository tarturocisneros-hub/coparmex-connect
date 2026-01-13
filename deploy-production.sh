#!/bin/bash

echo "🚀 COPARMEX Connect - Deploy a Producción"
echo "========================================"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Checklist pre-deploy:${NC}"
echo "✅ MongoDB Atlas configurado"
echo "✅ Railway CLI instalado"
echo "✅ Backend listo para deploy"

echo -e "\n${YELLOW}🔧 Configurando variables de entorno...${NC}"

# Variables de entorno para producción
echo "NODE_ENV=production"
echo "PORT=5000"
echo "JWT_SECRET=coparmex-connect-jwt-secret-super-seguro-2024-railway-production"
echo "OPENAI_API_KEY=demo-key"
echo "CORS_ORIGINS=https://coparmex-connect.vercel.app,http://localhost:3000,http://localhost:19006"

echo -e "\n${BLUE}📝 Pasos para completar el deploy:${NC}"
echo "1. Completa la configuración de MongoDB Atlas"
echo "2. Copia la URI de conexión de MongoDB"
echo "3. Ejecuta: railway login"
echo "4. Ejecuta: railway init"
echo "5. Configura las variables de entorno en Railway"
echo "6. Ejecuta: railway up"

echo -e "\n${GREEN}🎯 URLs de producción esperadas:${NC}"
echo "Backend API: https://coparmex-connect-api.railway.app"
echo "Frontend Web: https://coparmex-connect.vercel.app"

echo -e "\n${YELLOW}⚡ Comandos rápidos:${NC}"
echo "cd backend"
echo "railway login"
echo "railway init"
echo "railway variables set MONGODB_URI=\"tu-mongodb-uri-aqui\""
echo "railway variables set NODE_ENV=production"
echo "railway variables set JWT_SECRET=coparmex-connect-jwt-secret-super-seguro-2024"
echo "railway up"

echo -e "\n${GREEN}✨ ¡Una vez desplegado, tendrás tu API funcionando 24/7!${NC}"