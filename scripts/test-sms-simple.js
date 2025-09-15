#!/usr/bin/env node

/**
 * Simple SMS test using Twilio directly
 */

require('dotenv').config({ path: '.env.local' });
const twilio = require('twilio');

async function testSMS() {
  console.log('🧪 Testing SMS functionality...\n');

  // Check environment variables
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  
  if (!accountSid || !authToken) {
    console.error('❌ Missing Twilio credentials in .env.local');
    process.exit(1);
  }

  console.log('✅ Twilio credentials found');
  console.log(`📱 From number: ${fromNumber}`);
  console.log(`📱 Messaging Service: ${messagingServiceSid || 'Not configured'}\n`);

  try {
    const client = twilio(accountSid, authToken);
    
    // Test phone number (replace with your real number)
    const testPhone = process.env.TEST_PHONE || '+5491123456789';
    
    console.log(`📤 Sending test SMS to ${testPhone}...`);
    
    // Use Messaging Service if available, otherwise use from number
    const messageOptions = {
      body: '¡Hola! Este es un mensaje de prueba de FilaYA. Tu sistema de SMS está funcionando correctamente. 🎉',
      to: testPhone,
    };

    if (messagingServiceSid) {
      messageOptions.messagingServiceSid = messagingServiceSid;
      console.log('📱 Using Messaging Service...');
    } else {
      messageOptions.from = fromNumber;
      console.log('📱 Using direct phone number...');
    }
    
    const message = await client.messages.create(messageOptions);

    console.log('✅ SMS sent successfully!');
    console.log(`   Message ID: ${message.sid}`);
    console.log(`   Status: ${message.status}`);
    console.log(`   To: ${message.to}`);
    console.log(`   From: ${message.from}`);
    
    console.log('\n📱 Check your phone for the message!');
    
  } catch (error) {
    console.error('❌ SMS test failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.code === 21211) {
      console.error('\n💡 The phone number is not valid. Make sure it includes country code (e.g., +5491123456789)');
    } else if (error.code === 21614) {
      console.error('\n💡 The "To" number is not a valid mobile number.');
    } else if (error.code === 21212) {
      console.error('\n💡 The "From" number is not a valid phone number.');
    } else if (error.code === 20003) {
      console.error('\n💡 Authentication failed. Check your Account SID and Auth Token.');
    }
    
    process.exit(1);
  }
}

// Run the test
testSMS().catch(console.error);
