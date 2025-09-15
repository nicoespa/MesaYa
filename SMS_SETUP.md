# SMS Setup Guide

This guide will help you set up SMS functionality using Twilio for your FilaYA application.

## Prerequisites

1. A Twilio account (sign up at [twilio.com](https://www.twilio.com))
2. A verified phone number for sending SMS

## Step 1: Create Twilio Account

1. Go to [console.twilio.com](https://console.twilio.com)
2. Sign up for a free account
3. Verify your phone number
4. Note down your Account SID and Auth Token from the dashboard

## Step 2: Get a Phone Number

### Option A: Use Trial Account (Free, Limited)
- Trial accounts can only send SMS to verified phone numbers
- Perfect for testing and development

### Option B: Purchase a Phone Number (Recommended for Production)
1. In Twilio Console, go to Phone Numbers > Manage > Buy a number
2. Choose a number with SMS capabilities
3. Purchase the number

## Step 3: Configure Environment Variables

1. Copy the template file:
   ```bash
   cp env.local.template .env.local
   ```

2. Edit `.env.local` and add your Twilio credentials:
   ```env
   # Twilio SMS Configuration
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_FROM_NUMBER=+1234567890
   ```

## Step 4: Test SMS Functionality

1. Make the test script executable:
   ```bash
   chmod +x scripts/test-sms.js
   ```

2. Run the SMS test:
   ```bash
   node scripts/test-sms.js
   ```

3. For testing with a specific phone number:
   ```bash
   TEST_PHONE=+1234567890 node scripts/test-sms.js
   ```

## Step 5: Test in Development

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try the phone verification flow:
   - Go to `/join/[restaurant-slug]`
   - Enter a phone number
   - Check the console for the verification code (in development mode)
   - Or check your phone for the actual SMS (if configured)

## Features Implemented

### ✅ Phone Verification
- Sends 6-digit verification codes via SMS
- Rate limiting to prevent abuse
- Fallback to console logging in development

### ✅ Party Notifications
- Table ready notifications via SMS
- Fallback from WhatsApp to SMS
- Notification tracking in database

### ✅ Message Templates
- Join confirmation messages
- Reminder messages
- Table ready messages
- Verification code messages

## Troubleshooting

### Common Issues

1. **"Missing Twilio credentials" error**
   - Check your `.env.local` file has the correct variables
   - Make sure there are no extra spaces or quotes

2. **"Invalid phone number" error**
   - Ensure `TWILIO_FROM_NUMBER` is in E.164 format (+1234567890)
   - Check that the number has SMS capabilities

3. **"SMS send failed" error**
   - Verify your Twilio account is active
   - Check that you have sufficient credits
   - Ensure the destination number is valid

4. **Trial account limitations**
   - Can only send to verified phone numbers
   - Messages include "Sent from your Twilio trial account"

### Getting Help

- Check Twilio Console for error logs
- Review the application console for detailed error messages
- Test with the provided test script first

## Production Considerations

1. **Upgrade from Trial Account**
   - Add payment method to Twilio account
   - Remove trial limitations

2. **Phone Number Verification**
   - Verify your business phone number
   - Set up proper messaging compliance

3. **Rate Limiting**
   - The app includes built-in rate limiting
   - Monitor usage in Twilio Console

4. **Cost Monitoring**
   - SMS costs approximately $0.0075 per message
   - Set up billing alerts in Twilio

## Next Steps

Once SMS is working:

1. Test the complete user flow
2. Set up WhatsApp integration (optional)
3. Configure production environment variables
4. Monitor usage and costs

Your SMS functionality is now ready to use! 🎉
