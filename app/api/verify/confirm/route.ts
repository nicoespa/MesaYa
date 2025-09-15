import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/db/client';
import { parsePhoneNumber } from 'libphonenumber-js';

const confirmVerificationSchema = z.object({
  phone: z.string().min(1),
  code: z.string().length(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await confirmVerificationSchema.parse(await request.json());
    const { phone, code } = body;

    // Normalize phone number
    let normalizedPhone: string;
    try {
      const phoneNumber = parsePhoneNumber(phone, 'AR');
      normalizedPhone = phoneNumber.format('E.164');
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Find and verify the code
    const { data: verification, error: verificationError } = await supabase
      .from('phone_verifications')
      .select('*')
      .eq('phone', normalizedPhone)
      .eq('code', code)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (verificationError || !verification) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Mark as verified
    const { error: updateError } = await supabase
      .from('phone_verifications')
      .update({ verified: true })
      .eq('id', verification.id);

    if (updateError) {
      console.error('Error updating verification:', updateError);
      return NextResponse.json(
        { error: 'Failed to verify code' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Phone number verified successfully',
    });

  } catch (error) {
    console.error('Confirm verification error:', error);
    
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
