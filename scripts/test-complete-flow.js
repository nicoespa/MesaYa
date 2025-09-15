// scripts/test-complete-flow.js
require('dotenv').config({ path: '.env.local' });

async function testCompleteFlow() {
  console.log('🧪 Testing complete SMS flow...\n');

  const smsModule = await import('../lib/messaging/sms.js');
  const SMSProvider = smsModule.SMSProvider;
  const smsProvider = new SMSProvider();

  const testPhone = '+5491162148953';
  const testName = 'Test User';

  try {
    console.log('📤 Step 1: Testing verification code SMS...');
    const verificationResult = await smsProvider.sendVerificationCode(testPhone, '123456');
    console.log(`✅ Verification SMS sent! ID: ${verificationResult.id}\n`);

    console.log('📤 Step 2: Testing join confirmation SMS...');
    const joinResult = await smsProvider.sendTemplateJoinConfirm({
      to: testPhone,
      name: testName,
      link: 'https://filaya.com/status/test-token',
      restaurantName: 'Restaurante Test'
    });
    console.log(`✅ Join confirmation SMS sent! ID: ${joinResult.id}\n`);

    console.log('📤 Step 3: Testing table ready SMS...');
    const tableReadyResult = await smsProvider.sendTemplateTableReady({
      to: testPhone,
      name: testName,
      link: 'https://filaya.com/status/test-token',
      restaurantName: 'Restaurante Test'
    });
    console.log(`✅ Table ready SMS sent! ID: ${tableReadyResult.id}\n`);

    console.log('📤 Step 4: Testing reminder SMS...');
    const reminderResult = await smsProvider.sendTemplateReminder({
      to: testPhone,
      name: testName,
      link: 'https://filaya.com/status/test-token',
      restaurantName: 'Restaurante Test'
    });
    console.log(`✅ Reminder SMS sent! ID: ${reminderResult.id}\n`);

    console.log('🎉 All SMS tests completed successfully!');
    console.log('📱 Check your phone for all 4 messages!');

  } catch (error) {
    console.error('❌ SMS test failed:', error);
  }
}

testCompleteFlow();
