import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/db/client'
import { requireRestaurantAccess } from '@/lib/auth/server'
import { sendWithFallback } from '@/lib/messaging/provider'
import { WhatsAppProvider } from '@/lib/messaging/whatsapp'
import { SMSProvider } from '@/lib/messaging/sms'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const partyId = params.id

    if (!partyId) {
      return NextResponse.json(
        { error: 'Party ID is required' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // Get party details first
    const { data: party, error: partyError } = await supabase
      .from('parties')
      .select('restaurant_id, state, name, phone, token, size, eta_minutes')
      .eq('id', partyId)
      .single()

    if (partyError || !party) {
      return NextResponse.json(
        { error: 'Party not found' },
        { status: 404 }
      )
    }

    // Validate restaurant access
    await requireRestaurantAccess(party.restaurant_id)

    // Check if party can be notified
    if (party.state !== 'queued') {
      return NextResponse.json(
        { error: 'Party is not in queued state' },
        { status: 400 }
      )
    }

    // Update party state
    const { error: updateError } = await supabase
      .from('parties')
      .update({
        state: 'notified',
        notified_at: new Date().toISOString(),
      })
      .eq('id', partyId)

    if (updateError) {
      console.error('Error updating party:', updateError)
      return NextResponse.json(
        { error: 'Failed to notify party' },
        { status: 500 }
      )
    }

    // Send notification via WhatsApp/SMS
    try {
      const whatsappProvider = new WhatsAppProvider();
      const smsProvider = new SMSProvider();
      
      // Get restaurant details for the notification
      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('name, slug')
        .eq('id', party.restaurant_id)
        .single();

      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      const statusLink = `${process.env.NEXT_PUBLIC_APP_URL}/status/${party.token}`;
      
      // Record notification function
      const recordNotification = async (record: any) => {
        await supabase.from('notifications').insert(record);
      };

      // Send notification with fallback
      const result = await sendWithFallback(
        whatsappProvider,
        smsProvider,
        'table_ready',
        {
          partyId: partyId,
          to: party.phone,
          name: party.name,
          link: statusLink,
          restaurantName: restaurant.name,
        },
        recordNotification
      );

      console.log(`📱 Notification sent to ${party.name} via ${result.channel}`);

      return NextResponse.json({
        success: true,
        message: 'Party notified successfully',
        channel: result.channel,
      });
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError);
      
      // Still update the party state even if notification fails
      return NextResponse.json({
        success: true,
        message: 'Party state updated, but notification failed',
        warning: 'Notification could not be sent',
      });
    }

  } catch (error) {
    console.error('Notify party error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}