#!/usr/bin/env node

/**
 * Test Spanish SMS functionality
 * 
 * This script tests the Spanish SMS templates and flow.
 * Make sure to set up your .env.local file with Twilio credentials first.
 */

require('dotenv').config({ path: '.env.local' });
const { SMSProvider } = require('../lib/messaging/sms');

async function testSpanishSMS() {
  console.log('🧪 Testing Spanish SMS functionality...\n');

  // Check environment variables
  const requiredVars = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_FROM_NUMBER'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease set up your .env.local file with Twilio credentials.');
    console.error('See env.local.template for reference.');
    process.exit(1);
  }

  console.log('✅ Environment variables configured');
  console.log(`📱 From number: ${process.env.TWILIO_FROM_NUMBER}\n`);

  try {
    const smsProvider = new SMSProvider();
    console.log('✅ SMS provider initialized successfully');

    const testPhone = process.env.TEST_PHONE || '+1234567890';
    
    // Test 1: Verification Code
    console.log('📤 Test 1: Sending verification code...');
    const verificationResult = await smsProvider.sendVerificationCode(testPhone, '123456');
    console.log('✅ Verification SMS sent!');
    console.log(`   Message ID: ${verificationResult.id}`);
    console.log(`   Cost: $${verificationResult.cost || 'N/A'}\n`);

    // Test 2: Join Confirmation
    console.log('📤 Test 2: Sending join confirmation...');
    const joinResult = await smsProvider.sendTemplateJoinConfirm({
      to: testPhone,
      name: 'María González',
      link: 'https://filaya.com/status/demo-token-123',
      restaurantName: 'Kansas Belgrano'
    });
    console.log('✅ Join confirmation SMS sent!');
    console.log(`   Message ID: ${joinResult.id}`);
    console.log(`   Cost: $${joinResult.cost || 'N/A'}\n`);

    // Test 3: Table Ready Notification
    console.log('📤 Test 3: Sending table ready notification...');
    const tableReadyResult = await smsProvider.sendTemplateTableReady({
      to: testPhone,
      name: 'María González',
      link: 'https://filaya.com/status/demo-token-123',
      restaurantName: 'Kansas Belgrano'
    });
    console.log('✅ Table ready SMS sent!');
    console.log(`   Message ID: ${tableReadyResult.id}`);
    console.log(`   Cost: $${tableReadyResult.cost || 'N/A'}\n`);

    // Test 4: Reminder
    console.log('📤 Test 4: Sending reminder...');
    const reminderResult = await smsProvider.sendTemplateReminder({
      to: testPhone,
      name: 'María González',
      link: 'https://filaya.com/status/demo-token-123',
      restaurantName: 'Kansas Belgrano',
      etaMinutes: 15
    });
    console.log('✅ Reminder SMS sent!');
    console.log(`   Message ID: ${reminderResult.id}`);
    console.log(`   Cost: $${reminderResult.cost || 'N/A'}\n`);

    console.log('🎉 All Spanish SMS tests completed successfully!');
    console.log('\n📱 Check your phone for the Spanish messages:');
    console.log('   1. Verification code message');
    console.log('   2. Join confirmation message');
    console.log('   3. Table ready notification');
    console.log('   4. Reminder message');
    
  } catch (error) {
    console.error('❌ Spanish SMS test failed:');
    console.error(error.message);
    
    if (error.message.includes('Missing Twilio credentials')) {
      console.error('\n💡 Make sure your .env.local file has the correct Twilio credentials.');
    } else if (error.message.includes('Invalid phone number')) {
      console.error('\n💡 Make sure TWILIO_FROM_NUMBER is in E.164 format (e.g., +1234567890)');
    } else if (error.message.includes('not a valid phone number')) {
      console.error('\n💡 Make sure the test phone number is valid.');
    }
    
    process.exit(1);
  }
}

// Run the test
testSpanishSMS().catch(console.error);
