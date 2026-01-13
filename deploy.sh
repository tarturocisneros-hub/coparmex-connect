#!/bin/bash

echo "🚀 Iniciando deploy de COPARMEX Connect..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    print_warning "Railway CLI no está instalado. Instalando..."
    npm install -g @railway/cli
    if [ $? -eq 0 ]; then
        print_success "Railway CLI instalado correctamente"
    else
        print_error "Error instalando Railway CLI"
        exit 1
    fi
fi

# Verificar si el usuario está logueado en Railway
print_status "Verificando autenticación en Railway..."
railway whoami &> /dev/null
if [ $? -ne 0 ]; then
    print_warning "No estás logueado en Railway. Iniciando login..."
    railway login
    if [ $? -ne 0 ]; then
        print_error "Error en el login de Railway"
        exit 1
    fi
fi

# Cambiar al directorio del backend
print_status "Cambiando al directorio del backend..."
cd backend

# Verificar que package.json existe
if [ ! -f "package.json" ]; then
    print_error "package.json no encontrado en el directorio backend"
    exit 1
fi

# Instalar dependencias localmente para verificar
print_status "Verificando dependencias..."
npm install --silent
if [ $? -ne 0 ]; then
    print_error "Error instalando dependencias"
    exit 1
fi

# Inicializar proyecto Railway si no existe
if [ ! -f "railway.toml" ]; then
    print_status "Inicializando proyecto Railway..."
    railway init
fi

# Configurar variables de entorno
print_status "Configurando variables de entorno..."

# Variables básicas
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set JWT_SECRET=coparmex-connect-jwt-secret-super-seguro-2024-railway-production
railway variables set OPENAI_API_KEY=demo-key
railway variables set CORS_ORIGINS="https://coparmex-connect.vercel.app,http://localhost:3000,http://localhost:19006"

# Solicitar MongoDB URI al usuario
echo ""
print_warning "IMPORTANTE: Necesitas configurar MongoDB Atlas"
echo "1. Ve a https://mongodb.com/atlas"
echo "2. Crea una cuenta gratuita"
echo "3. Crea un cluster M0 (gratuito)"
echo "4. Configura un usuario de base de datos"
echo "5. Permite acceso desde cualquier IP (0.0.0.0/0)"
echo "6. Obtén la URI de conexión"
echo ""
read -p "Ingresa tu MongoDB URI (o presiona Enter para usar demo): " MONGODB_URI

if [ -z "$MONGODB_URI" ]; then
    print_warning "Usando MongoDB demo (datos no persistirán)"
    railway variables set MONGODB_URI="mongodb://localhost:27017/coparmex-connect-demo"
else
    print_success "Configurando MongoDB Atlas"
    railway variables set MONGODB_URI="$MONGODB_URI"
fi

# Deploy
print_status "Iniciando deploy en Railway..."
railway up --detach

if [ $? -eq 0 ]; then
    print_success "¡Deploy completado exitosamente!"
    echo ""
    print_status "Obteniendo URL del proyecto..."
    
    # Obtener la URL del proyecto
    PROJECT_URL=$(railway status --json | grep -o '"url":"[^"]*' | cut -d'"' -f4)
    
    if [ ! -z "$PROJECT_URL" ]; then
        print_success "Tu API está disponible en: $PROJECT_URL"
        print_success "Health check: $PROJECT_URL/api/health"
        print_success "Documentación: $PROJECT_URL/api"
        
        echo ""
        print_status "URLs importantes:"
        echo "• API Base: $PROJECT_URL/api"
        echo "• Login: $PROJECT_URL/api/auth/login"
        echo "• Trivia: $PROJECT_URL/api/trivia/categories"
        echo "• Chat: $PROJECT_URL/api/chat/quick-questions"
        echo "• Business: $PROJECT_URL/api/business/directory"
        echo "• Benefits: $PROJECT_URL/api/benefits"
        
        echo ""
        print_success "¡Tu backend está listo para usar!"
        print_status "Actualiza src/services/api.js con la nueva URL"
        
    else
        print_warning "No se pudo obtener la URL automáticamente"
        print_status "Ve a https://railway.app/dashboard para ver tu proyecto"
    fi
    
else
    print_error "Error durante el deploy"
    exit 1
fi

echo ""
print_success "🎉 Deploy completado! Tu aplicación está en producción."