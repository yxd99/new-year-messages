# 🎉 New Year Messages

Sistema de envío automático de mensajes para **WhatsApp** (via WhatsApp Web) y **TikTok** con arquitectura limpia (Clean Architecture).

## 📋 Características

- ✅ **WhatsApp Web**: Conexión mediante código QR (sin API de Meta)
- ✅ **Clean Architecture**: Separación clara entre Domain, Application e Infrastructure
- ✅ **Validación de ENV con Zod**: Variables de entorno tipadas y validadas
- ✅ **TypeORM + PostgreSQL**: Persistencia de mensajes con estados (WAIT, SENDING, SENT)
- ✅ **Cron Jobs Configurables**: Tiempo de envío modificable desde la API
- ✅ **Path Aliases**: Imports limpios con @domain, @application, @infrastructure
- ✅ **Docker Ready**: Dockerfile y Docker Compose para desarrollo

## 🏗️ Arquitectura

```
src/
├── domain/                    # Capa de Dominio
│   ├── entities/              # Entidades (Message, CronConfig)
│   ├── enums/                 # Enumeraciones (MessageStatus, MessagePlatform)
│   └── repositories/          # Interfaces de repositorios
├── application/               # Capa de Aplicación
│   ├── dtos/                  # Data Transfer Objects
│   ├── ports/                 # Puertos/Interfaces de servicios externos
│   └── use-cases/             # Casos de uso
└── infrastructure/            # Capa de Infraestructura
    ├── adapters/              # Adaptadores (WhatsApp Web, TikTok)
    ├── config/                # Configuración (env.ts, database)
    ├── controllers/           # Controladores HTTP
    ├── cron/                  # Jobs programados
    ├── modules/               # Módulos NestJS
    └── repositories/          # Implementaciones de repositorios
```

## 🐳 Inicio Rápido con Docker

```bash
# Iniciar todo el entorno (app + PostgreSQL)
docker compose up -d

# Ver logs (IMPORTANTE: aquí aparece el código QR)
docker compose logs -f app
```

### 📱 Conectar WhatsApp

1. Ejecuta `docker compose logs -f app`
2. Espera a que aparezca el **código QR** en la consola
3. Abre WhatsApp en tu teléfono
4. Ve a **Configuración > Dispositivos vinculados > Vincular dispositivo**
5. Escanea el código QR
6. ¡Listo! La sesión se guarda automáticamente

La aplicación estará disponible en: `http://localhost:3000/api`

## 🚀 Instalación Local (sin Docker)

```bash
# Instalar dependencias
pnpm install

# Copiar archivo de variables de entorno
cp .env.example .env

# Iniciar PostgreSQL localmente o usar Docker solo para la DB
docker compose up postgres -d

# Iniciar en modo desarrollo
pnpm start:dev
```

## ⚙️ Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `NODE_ENV` | Entorno (development/production/test) | development |
| `PORT` | Puerto del servidor | 3000 |
| `DB_HOST` | Host de PostgreSQL | localhost |
| `DB_PORT` | Puerto de PostgreSQL | 5432 |
| `DB_USERNAME` | Usuario de PostgreSQL | postgres |
| `DB_PASSWORD` | Contraseña de PostgreSQL | postgres |
| `DB_DATABASE` | Nombre de la base de datos | new_year_messages |
| `DEFAULT_CRON_EXPRESSION` | Expresión cron por defecto | */5 * * * * |

> **Nota**: WhatsApp no necesita variables de entorno. Se conecta escaneando el código QR.

## 📡 API Endpoints

### Mensajes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/messages` | Crear un nuevo mensaje |
| `GET` | `/api/messages` | Listar todos los mensajes |
| `GET` | `/api/messages?status=WAIT` | Filtrar por estado |
| `GET` | `/api/messages/:id` | Obtener mensaje por ID |
| `PUT` | `/api/messages/:id` | Actualizar mensaje |
| `DELETE` | `/api/messages/:id` | Eliminar mensaje |
| `POST` | `/api/messages/:id/send` | Enviar mensaje manualmente |

### WhatsApp

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/whatsapp/status` | Estado de conexión de WhatsApp |

### Configuración de Cron

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/cron-config` | Crear configuración |
| `GET` | `/api/cron-config` | Listar configuraciones |
| `GET` | `/api/cron-config/active` | Listar configuraciones activas |
| `PUT` | `/api/cron-config/:id` | Actualizar (incluye expresión cron) |

### Health Check

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/health` | Estado del servidor |

## 📝 Ejemplos de Uso

### Verificar estado de WhatsApp

```bash
curl http://localhost:3000/api/whatsapp/status | jq
```

Respuesta cuando está conectado:
```json
{
  "platform": "whatsapp",
  "connected": true,
  "info": {
    "pushname": "Tu Nombre",
    "wid": "1234567890@c.us"
  },
  "message": "✅ WhatsApp conectado"
}
```

### Crear un mensaje para WhatsApp

```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "content": "¡Feliz Año Nuevo 2025! 🎉",
    "recipient": "+521234567890",
    "platform": "WHATSAPP"
  }'
```

> **Nota**: El número debe incluir código de país (ej: +52 para México, +1 para USA)

### Crear mensaje programado

```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "content": "¡Feliz Año Nuevo! 🎊",
    "recipient": "+521234567890",
    "platform": "WHATSAPP",
    "scheduledAt": "2025-01-01T00:00:00Z"
  }'
```

### Enviar mensaje manualmente

```bash
curl -X POST http://localhost:3000/api/messages/{id}/send
```

### Modificar el intervalo del cron job

```bash
# Obtener configuraciones
curl http://localhost:3000/api/cron-config

# Actualizar a cada 30 segundos (solo desarrollo)
curl -X PUT http://localhost:3000/api/cron-config/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "cronExpression": "*/30 * * * * *"
  }'
```

## 📊 Estados de Mensajes

| Estado | Descripción |
|--------|-------------|
| `WAIT` | Mensaje en espera de ser enviado |
| `SENDING` | Mensaje en proceso de envío |
| `SENT` | Mensaje enviado exitosamente |

## ⏰ Expresiones Cron

| Expresión | Descripción |
|-----------|-------------|
| `* * * * *` | Cada minuto |
| `*/5 * * * *` | Cada 5 minutos |
| `0 * * * *` | Cada hora |
| `0 0 * * *` | Cada día a medianoche |
| `0 0 1 1 *` | Cada 1 de enero |

## 🛠️ Scripts

```bash
# Desarrollo con Docker
docker compose up -d

# Ver logs de la app (y código QR)
docker compose logs -f app

# Desarrollo local
pnpm start:dev

# Build para producción
pnpm build

# Producción
pnpm start:prod
```

## 🐳 Comandos Docker

```bash
# Iniciar en segundo plano
docker compose up -d

# Ver logs de la aplicación (QR aparece aquí)
docker compose logs -f app

# Reiniciar la aplicación
docker compose restart app

# Detener todo
docker compose down

# Detener y eliminar volúmenes (⚠️ borra sesión de WhatsApp)
docker compose down -v

# Reconstruir imagen
docker compose build --no-cache
```

## 📱 Sobre WhatsApp Web

Este proyecto usa `whatsapp-web.js` para conectarse a WhatsApp Web:

- **Sin API de Meta**: No necesitas Business API ni plantillas aprobadas
- **Sesión persistente**: La sesión se guarda en `./whatsapp-session/` (o volumen Docker)
- **Código QR**: Solo necesitas escanearlo una vez
- **Reconexión automática**: Si el servidor reinicia, intenta reconectarse automáticamente

### ⚠️ Consideraciones

- WhatsApp puede detectar uso automatizado excesivo
- Recomendado para uso personal o bajo volumen
- No es una solución oficial de WhatsApp/Meta
- Para alto volumen, considera la API oficial de WhatsApp Business

## 📄 Licencia

UNLICENSED
