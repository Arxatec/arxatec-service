# 📘 Arxatec Service - Backend

## ✨ Descripción

Arxatec Service es un backend modular construido con Node.js, Express y TypeScript, siguiendo una arquitectura limpia (Clean Architecture) y Vertical Slices para asegurar escalabilidad y mantenibilidad.

### Incluye:

- Autenticación de usuarios
- Gestión de espacios, reservas y productos
- Cache con Redis
- Almacenamiento en AWS S3
- Documentación de API con Swagger
- Chat e integración en tiempo real con Socket.IO

## ✨ IA con Google Gemini para resumir artículos

### 🛠 Tecnologías

- Node.js v18+
- Express
- TypeScript
- Prisma ORM con PostgreSQL
- Redis (sesiones y cache)
- Zod para validación
- JWT y Bcrypt para autenticación
- Socket.IO comunicación en tiempo real
- AWS S3 almacenamiento de archivos
- Nodemailer envío de correos
- Swagger documentación interactiva
- Google Gemini IA generativa

### ⚙️ Requisitos del sistema

- Node.js v18+ (recomendado v20)
- PostgreSQL 16+ (local o Docker)
- Redis (local o Docker)
- Docker (opcional, para desarrollo en contenedores)

## 🚀 Instalación y Configuración

1. Clonar repositorio
   git clone <REPO_URL>
   cd arxatec_service

2. Instalar dependencias
   npm install

3. Configurar variables de entorno
   **Pedirle al encargado**

4. Configurar base de datos

- Opción A: Docker

  - docker-compose up -d
  - docker compose -f docker-compose.arxatec.yml up -d
    npx prisma migrate dev --name init

- Opción B: Local
  Instala PostgreSQL y Redis manualmente y luego:
  npx prisma migrate dev --name init

6. Iniciar servidor

- Modo desarrollo:
  npm run dev

- Modo producción:
  npm run build
  npm start

## 📊 Migraciones de Base de Datos

- Generar cliente Prisma:
  npm run prisma:generate

- Crear nueva migración:
  npm run prisma:migrate

- Abrir Prisma Studio:
  npm run prisma:studio

## 📱 API Documentation

- Swagger disponible en:
  http://localhost:3001/api-docs

## 🚀 Scripts disponibles

npm run dev # Desarrollo
npm run build # Compilación
npm start # Producción
npm run prisma:generate # Generar cliente Prisma
npm run prisma:migrate # Migraciones
npm run prisma:studio # UI Prisma

## ⚠️ Notas Importantes

- Redis es obligatorio para cache y sesiones
- Migraciones: hacer backup antes de aplicar en producción
- Gemini requiere clave API válida (configurar en .env)
- Docker facilita el levantado local de DB y Redis
