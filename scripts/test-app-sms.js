// scripts/test-app-sms.js
require('dotenv').config({ path: '.env.local' });

const twilio = require('twilio');

async function testAppSMS() {
  console.log('🧪 Testing SMS from app perspective...\n');

  // Check environment variables
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  
  if (!accountSid || !authToken) {
    console.error('❌ Missing Twilio credentials in .env.local');
    process.exit(1);
  }

  console.log('✅ Twilio credentials found');
  console.log(`📱 Messaging Service: ${messagingServiceSid || 'Not configured'}\n`);

  try {
    const client = twilio(accountSid, authToken);
    
    // Test phone number
    const testPhone = '+5491162148953';
    
    console.log('📤 Testing verification code SMS...');
    const verificationMessage = await client.messages.create({
      body: 'Tu código de verificación para FilaYA es: 123456. Válido por 10 minutos.',
      messagingServiceSid: messagingServiceSid,
      to: testPhone,
    });
    console.log(`✅ Verification SMS sent! ID: ${verificationMessage.sid}\n`);

    console.log('📤 Testing join confirmation SMS...');
    const joinMessage = await client.messages.create({
      body: 'Hola Test User, te anotamos en la lista de espera de Restaurante Test. Te avisaremos por mensaje cuando tu mesa esté lista. Ver tu lugar en la fila: https://filaya.com/status/test-token',
      messagingServiceSid: messagingServiceSid,
      to: testPhone,
    });
    console.log(`✅ Join confirmation SMS sent! ID: ${joinMessage.sid}\n`);

    console.log('📤 Testing table ready SMS...');
    const tableReadyMessage = await client.messages.create({
      body: '¡Tu mesa está lista! Restaurante Test te espera. Tienes 10 minutos para llegar. Ver detalles: https://filaya.com/status/test-token',
      messagingServiceSid: messagingServiceSid,
      to: testPhone,
    });
    console.log(`✅ Table ready SMS sent! ID: ${tableReadyMessage.sid}\n`);

    console.log('🎉 All SMS tests completed successfully!');
    console.log('📱 Check your phone for all 3 messages!');

  } catch (error) {
    console.error('❌ SMS test failed:', error);
  }
}

testAppSMS();
