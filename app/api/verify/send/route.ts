import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/db/client';
import { checkRateLimit } from '@/lib/rate-limit/memory';
import { parsePhoneNumber } from 'libphonenumber-js';
import { randomInt } from 'crypto';
import { SMSProvider } from '@/lib/messaging/sms';

const sendVerificationSchema = z.object({
  phone: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await sendVerificationSchema.parse(await request.json());
    const { phone } = body;

    // Rate limiting by IP and phone
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    const ipLimit = await checkRateLimit(clientIP, 'verify_ip', 5, 15 * 60 * 1000); // 5 per 15 min
    const phoneLimit = await checkRateLimit(phone, 'verify_phone', 3, 5 * 60 * 1000); // 3 per 5 min

    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many verification attempts from this IP' },
        { status: 429 }
      );
    }

    if (!phoneLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many verification attempts for this phone number' },
        { status: 429 }
      );
    }

    // Normalize phone number
    let normalizedPhone: string;
    try {
      const phoneNumber = parsePhoneNumber(phone, 'AR');
      // For Argentina, remove the extra 9 that libphonenumber adds
      let formatted = phoneNumber.format('E.164');
      if (formatted.startsWith('+549')) {
        formatted = '+54' + formatted.substring(4);
      }
      normalizedPhone = formatted;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Generate 6-digit code
    const code = randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const supabase = createServerClient();

    // Store verification code
    const { error: insertError } = await supabase
      .from('phone_verifications')
      .insert({
        phone: normalizedPhone,
        code,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error('Error storing verification code:', insertError);
      return NextResponse.json(
        { error: 'Failed to create verification code' },
        { status: 500 }
      );
    }

    // Send verification code via SMS
    try {
      const smsProvider = new SMSProvider();
      await smsProvider.sendVerificationCode(normalizedPhone, code);
      
      console.log(`📱 Verification code sent to ${normalizedPhone}`);
    } catch (smsError) {
      console.error('Failed to send verification SMS:', smsError);
      
      // In development, still log the code for testing
      if (process.env.NODE_ENV === 'development') {
        console.log(`📱 Verification code for ${normalizedPhone}: ${code}`);
      } else {
        return NextResponse.json(
          { error: 'Failed to send verification code' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
      expiresIn: 600, // 10 minutes in seconds
    });

  } catch (error) {
    console.error('Send verification error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
