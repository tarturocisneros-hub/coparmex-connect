# 🗄 Configuración MongoDB Atlas

## Pasos para configurar la base de datos:

### 1. Crear cuenta gratuita
1. Ve a [mongodb.com/atlas](https://mongodb.com/atlas)
2. Crea una cuenta gratuita
3. Selecciona el plan **M0 Sandbox (FREE)**

### 2. Crear cluster
1. Selecciona **AWS** como proveedor
2. Región: **N. Virginia (us-east-1)** (más cercana)
3. Nombre del cluster: `coparmex-connect`

### 3. Configurar acceso
1. **Database Access**:
   - Username: `coparmex-admin`
   - Password: `CoparmexConnect2024!`
   - Role: `Atlas admin`

2. **Network Access**:
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
   - Comment: "Railway deployment"

### 4. Obtener URI de conexión
1. Click en **Connect**
2. Selecciona **Connect your application**
3. Driver: **Node.js**
4. Copia la URI:

```
mongodb+srv://coparmex-admin:CoparmexConnect2024!@coparmex-connect.xxxxx.mongodb.net/coparmex-connect?retryWrites=true&w=majority
```

### 5. Variables de entorno para Railway
```bash
MONGODB_URI=mongodb+srv://coparmex-admin:CoparmexConnect2024!@coparmex-connect.xxxxx.mongodb.net/coparmex-connect?retryWrites=true&w=majority
NODE_ENV=production
JWT_SECRET=coparmex-connect-jwt-secret-super-seguro-2024-railway-production
PORT=5000
OPENAI_API_KEY=demo-key
CORS_ORIGINS=https://coparmex-connect.vercel.app,http://localhost:3000,http://localhost:19006
```

## ✅ Una vez configurado:
- La base de datos estará disponible 24/7
- 512 MB de almacenamiento gratuito
- Suficiente para miles de usuarios
- Backups automáticos
- Monitoreo incluido