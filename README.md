# FilaYA - Lista de Espera para Restaurantes

Sistema de gestión de listas de espera para restaurantes en Argentina con notificaciones por WhatsApp, códigos QR para auto-registro y seguimiento en tiempo real.

## 🚀 Características

- **Dashboard en tiempo real** para operadores de restaurantes
- **Notificaciones por WhatsApp** con fallback a SMS
- **Códigos QR** para auto-registro de clientes
- **PWA** para seguimiento de posición en la fila
- **Multi-tenant** con Row Level Security (RLS)
- **Responsive design** optimizado para tablets y móviles
- **Verificación de teléfono** opcional
- **Métricas y estadísticas** en tiempo real

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Supabase (Postgres + Auth + RLS + Realtime)
- **Mensajería**: WhatsApp Business Cloud API + Twilio SMS
- **PWA**: Manifest + Service Worker
- **Testing**: Playwright e2e
- **CI/CD**: GitHub Actions
- **Deploy**: Vercel + Supabase

## 📋 Prerrequisitos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase
- Cuenta de WhatsApp Business (opcional)
- Cuenta de Twilio (opcional)

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/filaya.git
   cd filaya
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.local.example .env.local
   ```
   
   Editar `.env.local` con tus credenciales:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   SUPABASE_SERVICE_ROLE=tu_service_role_key
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   
   # WhatsApp Cloud API (opcional)
   WHATSAPP_BASE_URL=https://graph.facebook.com/v21.0
   WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id
   WHATSAPP_ACCESS_TOKEN=tu_access_token
   
   # Twilio SMS (opcional)
   TWILIO_ACCOUNT_SID=tu_account_sid
   TWILIO_AUTH_TOKEN=tu_auth_token
   TWILIO_FROM_NUMBER=tu_from_number
   
   # Configuración
   APP_TZ=America/Argentina/Buenos_Aires
   ```

4. **Configurar Supabase**
   ```bash
   # Crear proyecto en Supabase
   # Ejecutar migraciones
   npx supabase db reset
   
   # O ejecutar manualmente:
   # 1. Crear las tablas con supabase/001_schema.sql
   # 2. Insertar datos de prueba con supabase/002_seed.sql
   ```

5. **Ejecutar seed de datos de prueba**
   ```bash
   npm run seed:local
   ```

6. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

7. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🧪 Testing

```bash
# Ejecutar tests e2e
npm run test:e2e

# Ejecutar linting
npm run lint

# Verificar tipos
npm run typecheck
```

## 📱 Uso

### Para Restaurantes

1. **Acceder al dashboard**: `http://localhost:3000/dashboard`
2. **Agregar clientes** a la lista de espera
3. **Notificar** cuando la mesa esté lista
4. **Marcar como sentado** cuando lleguen
5. **Generar QR** para auto-registro

### Para Clientes

1. **Escanear QR** del restaurante
2. **Completar formulario** de registro
3. **Recibir notificaciones** por WhatsApp/SMS
4. **Seguir posición** en tiempo real

## 🏗️ Estructura del Proyecto

```
filaya/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── dashboard/         # Panel de operador
│   ├── join/              # Auto-registro con QR
│   ├── status/            # PWA de seguimiento
│   └── (auth)/            # Páginas de autenticación
├── components/            # Componentes React
│   └── ui/               # Componentes base (shadcn/ui)
├── lib/                  # Utilidades y lógica
│   ├── auth/             # Autenticación
│   ├── db/               # Base de datos
│   ├── messaging/        # WhatsApp + SMS
│   └── rate-limit/       # Rate limiting
├── supabase/             # Migraciones y seeds
├── tests/                # Tests e2e (Playwright)
└── public/               # Assets estáticos
    ├── icons/            # Iconos PWA
    └── manifest.webmanifest
```

## 🔧 API Endpoints

### Partys
- `POST /api/party` - Crear nueva fila
- `POST /api/party/[id]/notify` - Notificar cliente
- `POST /api/party/[id]/on-the-way` - Marcar como en camino
- `POST /api/party/[id]/seated` - Marcar como sentado
- `POST /api/party/[id]/no-show` - Marcar como no show
- `POST /api/party/[id]/cancel` - Cancelar

### Queue
- `GET /api/queue?restaurantId=` - Obtener lista actual

### Status (PWA)
- `GET /api/status/[token]` - Obtener estado de cliente
- `POST /api/status/[token]` - Actualizar estado (en camino, cancelar)

### Verificación
- `POST /api/verify/send` - Enviar código de verificación
- `POST /api/verify/confirm` - Confirmar código

## 🚀 Deploy

### Vercel + Supabase

1. **Conectar repositorio a Vercel**
2. **Configurar variables de entorno** en Vercel
3. **Deploy automático** en cada push a main

### Variables de entorno requeridas en producción:

```env
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
SUPABASE_SERVICE_ROLE=tu_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

## 📊 Monitoreo

- **Sentry** para error tracking (opcional)
- **Supabase Dashboard** para métricas de DB
- **Vercel Analytics** para métricas de performance

## 🤝 Contribuir

1. Fork el proyecto
2. Crear branch para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

- **Documentación**: [Wiki del proyecto]
- **Issues**: [GitHub Issues]
- **Email**: soporte@filaya.com

## 🗺️ Roadmap

- [ ] Autenticación con Supabase Auth
- [ ] Roles de usuario (operador, manager, owner)
- [ ] Exportación de datos CSV
- [ ] Integración con sistemas POS
- [ ] Notificaciones push nativas
- [ ] Dashboard de métricas avanzadas
- [ ] API pública para integraciones
- [ ] Temas personalizables
- [ ] Multi-idioma

---

**FilaYA** - Simplificando la gestión de listas de espera en restaurantes argentinos 🇦🇷
