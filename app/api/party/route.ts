import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@/lib/db/client';
import { requireRestaurantAccess } from '@/lib/auth/server';
import { parsePhoneNumber } from 'libphonenumber-js';
import { randomBytes } from 'crypto';
import { sendWithFallback } from '@/lib/messaging/provider';
import { WhatsAppProvider } from '@/lib/messaging/whatsapp';
import { SMSProvider } from '@/lib/messaging/sms';

const createPartySchema = z.object({
  restaurantId: z.string().uuid(),
  name: z.string().min(1).max(100),
  phone: z.string().min(1),
  size: z.number().int().min(1).max(12),
  eta_minutes: z.number().int().min(5).max(120),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurantId, name, phone, size, eta_minutes, notes } = createPartySchema.parse(body);

    // Validate restaurant access
    await requireRestaurantAccess(restaurantId);

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

    const supabase = createServerClient();

    // Get the active waitlist for the restaurant
    const { data: waitlist, error: waitlistError } = await supabase
      .from('waitlists')
      .select('id')
      .eq('restaurant_id', restaurantId)
      .eq('status', 'open')
      .single();

    if (waitlistError || !waitlist) {
      return NextResponse.json(
        { error: 'No active waitlist found' },
        { status: 400 }
      );
    }

    // Generate unique token
    const token = randomBytes(32).toString('hex');

    // Create party
    const { data: party, error: partyError } = await supabase
      .from('parties')
      .insert({
        waitlist_id: waitlist.id,
        restaurant_id: restaurantId,
        name,
        phone: normalizedPhone,
        size,
        notes,
        token,
        eta_minutes,
      })
      .select()
      .single();

    if (partyError) {
      console.error('Error creating party:', partyError);
      return NextResponse.json(
        { error: 'Failed to create party' },
        { status: 500 }
      );
    }

    // Use the provided ETA (no need to calculate)

    // Get restaurant info for response
    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('name, slug')
      .eq('id', restaurantId)
      .single();

    const statusLink = `${process.env.NEXT_PUBLIC_APP_URL}/status/${token}`;

    // Send join confirmation SMS/WhatsApp
    try {
      const whatsappProvider = new WhatsAppProvider();
      const smsProvider = new SMSProvider();

      // Record notification function
      const recordNotification = async (record: any) => {
        await supabase.from('notifications').insert(record);
      };

      // Send join confirmation notification
      const result = await sendWithFallback(
        whatsappProvider,
        smsProvider,
        'join_confirm',
        {
          partyId: party.id,
          to: normalizedPhone,
          name: name,
          link: statusLink,
          restaurantName: restaurant?.name || 'Restaurante',
        },
        recordNotification
      );

      console.log(`📱 Join confirmation sent to ${name} via ${result.channel}`);
    } catch (notificationError) {
      console.error('Failed to send join confirmation:', notificationError);
      // Don't fail the party creation if notification fails
    }

    return NextResponse.json({
      success: true,
      party: {
        ...party,
        eta_minutes,
      },
      statusLink,
      restaurant: restaurant?.name,
    });

  } catch (error) {
    console.error('Create party error:', error);
    
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
