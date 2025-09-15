# Guía de SMS en Español - FilaYA

Esta guía te ayudará a configurar y probar el sistema de SMS en español para tu aplicación FilaYA.

## 🎯 Lo que tienes ahora

### ✅ **Mensajes SMS en Español**
- **Código de verificación**: "Tu código de verificación para FilaYA es: 123456. Válido por 10 minutos."
- **Confirmación de ingreso**: "Hola María, te anotamos en la lista de espera de Kansas Belgrano. Te avisaremos por mensaje cuando tu mesa esté lista. Ver tu lugar en la fila: [link]"
- **Mesa lista**: "¡Hola María! Tu mesa está lista en Kansas Belgrano. Por favor acercate al restaurante. Ver detalles: [link]"
- **Recordatorio**: "Hola María, estás en la fila de Kansas Belgrano. Tiempo estimado: 15 minutos. Estado: En espera. Ver tu lugar: [link]"

### ✅ **Interfaz en Español**
- Página de unirse a la lista (join page)
- Página de estado con tabla de espera
- Botones y mensajes en español
- Diseño similar al que mostraste en las imágenes

## 🚀 Cómo probar el flujo completo

### Paso 1: Configurar Twilio
```bash
# 1. Crear cuenta en console.twilio.com
# 2. Obtener número de prueba
# 3. Configurar .env.local:
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_FROM_NUMBER=+1234567890
```

### Paso 2: Probar SMS en Español
```bash
# Probar todos los mensajes en español
node scripts/test-spanish-sms.js

# O probar con tu número específico
TEST_PHONE=+5491123456789 node scripts/test-spanish-sms.js
```

### Paso 3: Probar el flujo completo
```bash
# 1. Iniciar la aplicación
npm run dev

# 2. Ir a la página de unirse
# http://localhost:3000/join/kansas-belgrano

# 3. Completar el formulario:
#    - Nombre: María González
#    - Teléfono: +5491123456789
#    - Tamaño: 4 personas
#    - Notas: Mesa cerca de la ventana

# 4. Verificar el código SMS
# 5. Ver la página de estado en español
```

## 📱 Flujo de mensajes SMS

### 1. **Usuario se une a la lista**
```
Hola María, te anotamos en la lista de espera de Kansas Belgrano. 
Te avisaremos por mensaje cuando tu mesa esté lista. 
Ver tu lugar en la fila: https://filaya.com/status/demo-token-123
```

### 2. **Restaurante notifica que la mesa está lista**
```
¡Hola María! Tu mesa está lista en Kansas Belgrano. 
Por favor acercate al restaurante. 
Ver detalles: https://filaya.com/status/demo-token-123
```

### 3. **Recordatorio (opcional)**
```
Hola María, estás en la fila de Kansas Belgrano. 
Tiempo estimado: 15 minutos. 
Estado: En espera. 
Ver tu lugar: https://filaya.com/status/demo-token-123
```

## 🎨 Interfaz en Español

### Página de Estado
- **Título**: "Kansas Belgrano - RESTAURANTE & BAR"
- **Tiempo estimado**: "Tiempo estimado: 18 minutos"
- **Tabla de espera**: "# | Nombre | Tamaño"
- **Tu lugar**: Resaltado en azul
- **Botones**: "Voy en Camino", "Cancelar", "Posponer 10 min"

### Página de Unirse
- **Formulario**: "Tu nombre", "Teléfono", "¿Cuántas personas?"
- **Verificación**: "Código de verificación"
- **Botón**: "Unirme a la Lista"

## 🔧 Personalización

### Cambiar mensajes SMS
Edita `lib/messaging/sms.ts`:
```javascript
// Ejemplo: Cambiar mensaje de mesa lista
const body = `¡Hola ${args.name}! Tu mesa está lista en ${args.restaurantName}. 
Por favor acercate al restaurante. 
Ver detalles: ${args.link}`;
```

### Cambiar interfaz
Edita `app/status/[token]/page.tsx` y `app/join/[restaurantSlug]/page.tsx`

## 🐛 Solución de problemas

### SMS no se envían
1. Verificar credenciales de Twilio en `.env.local`
2. Verificar que el número esté en formato E.164 (+1234567890)
3. Verificar que el número de destino esté verificado (cuenta trial)

### Mensajes en inglés
1. Verificar que estés usando la versión actualizada del código
2. Reiniciar el servidor de desarrollo
3. Verificar que no haya caché del navegador

### Página no carga
1. Verificar que la base de datos esté configurada
2. Verificar que las variables de entorno estén configuradas
3. Verificar los logs del servidor

## 📊 Monitoreo

### Ver mensajes enviados
- Twilio Console → Messaging → Logs
- Base de datos → tabla `notifications`

### Costos
- SMS: ~$0.0075 por mensaje
- Verificar en Twilio Console → Billing

## 🎉 ¡Listo!

Tu sistema de SMS en español está completamente configurado. Los usuarios recibirán mensajes en español y podrán ver su estado en una interfaz moderna y clara.

### Próximos pasos:
1. Probar con números reales
2. Configurar WhatsApp (opcional)
3. Personalizar mensajes para tu restaurante
4. Configurar para producción

¡Disfruta tu sistema de lista de espera en español! 🇦🇷
