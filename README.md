# 🍽️ FilaYA - Sistema de Gestión de Listas de Espera

FilaYA es una plataforma completa para restaurantes que permite gestionar listas de espera de manera eficiente, con notificaciones automáticas por SMS y WhatsApp, análisis en tiempo real y una interfaz moderna.

## ✨ Características

- 🎯 **Gestión de Listas de Espera** - Control completo de la fila de espera
- 📱 **Notificaciones Automáticas** - SMS y WhatsApp para clientes
- 📊 **Análisis en Tiempo Real** - Estadísticas y gráficos detallados
- 🔐 **Sistema de Autenticación** - Registro e inicio de sesión para restaurantes
- 📈 **Dashboard Dinámico** - Métricas actualizadas en tiempo real
- 🎨 **Interfaz Moderna** - Diseño responsive y profesional
- 🌍 **Localización** - Completamente en español para Argentina

## 🚀 Despliegue Rápido

### Opción 1: Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nicoespa/MesaYa)

1. Haz clic en el botón "Deploy with Vercel"
2. Conecta tu cuenta de GitHub
3. Configura las variables de entorno (ver sección de configuración)
4. ¡Despliega!

### Opción 2: Despliegue Manual

```bash
# Clonar el repositorio
git clone https://github.com/nicoespa/MesaYa.git
cd MesaYa

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.local.template .env.local

# Ejecutar en desarrollo
npm run dev
```

## ⚙️ Configuración

### Variables de Entorno Requeridas

Crea un archivo `.env.local` con las siguientes variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Twilio (para SMS)
TWILIO_ACCOUNT_SID=tu_twilio_account_sid
TWILIO_AUTH_TOKEN=tu_twilio_auth_token
TWILIO_FROM_NUMBER=tu_twilio_phone_number
TWILIO_MESSAGING_SERVICE_SID=tu_messaging_service_sid

# WhatsApp (opcional)
WHATSAPP_ACCESS_TOKEN=tu_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=tu_whatsapp_phone_id

# App
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

### Configuración de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta los scripts SQL en la carpeta `supabase/`
3. Habilita Row Level Security (RLS)
4. Configura las políticas de seguridad

### Configuración de Twilio

1. Crea una cuenta en [Twilio](https://twilio.com)
2. Obtén un número de teléfono
3. Configura un Messaging Service
4. Verifica tu número de teléfono para pruebas

## 📱 Funcionalidades

### Para Restaurantes
- **Dashboard Principal** - Vista general de la lista de espera
- **Gestión de Clientes** - Agregar, editar y gestionar clientes
- **Notificaciones** - Envío automático de SMS/WhatsApp
- **Análisis** - Estadísticas detalladas y gráficos
- **Historial** - Registro completo de todas las interacciones
- **QR Code** - Generación de códigos QR para unirse a la lista

### Para Clientes
- **Unirse a la Lista** - Formulario simple para registrarse
- **Seguimiento en Tiempo Real** - Ver posición en la fila
- **Notificaciones** - Recibir actualizaciones por SMS
- **Cancelar** - Removerse de la lista fácilmente

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Mensajería**: Twilio (SMS), WhatsApp Business API
- **Despliegue**: Vercel
- **UI Components**: Radix UI, Lucide React

## 📊 Estructura del Proyecto

```
filaya/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Páginas de autenticación
│   ├── api/               # API Routes
│   ├── dashboard/         # Dashboard del restaurante
│   └── status/            # Páginas públicas de estado
├── components/            # Componentes React
├── lib/                   # Utilidades y configuraciones
├── supabase/              # Scripts de base de datos
└── public/                # Archivos estáticos
```

## 🚀 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Construcción para producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run test         # Tests
```

## 📈 Roadmap

- [ ] Integración con sistemas de reservas
- [ ] App móvil nativa
- [ ] Integración con POS
- [ ] Análisis predictivo
- [ ] Multi-idioma
- [ ] API pública

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte, contacta a [nicoespa@gmail.com](mailto:nicoespa@gmail.com) o crea un issue en GitHub.

---

Desarrollado con ❤️ para restaurantes argentinos 🇦🇷