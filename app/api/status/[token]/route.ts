import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/db/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;
    const supabase = createServerClient();

    // Get party by token (public access)
    const { data: party, error: partyError } = await supabase
      .from('parties')
      .select(`
        *,
        restaurant:restaurants(*)
      `)
      .eq('token', token)
      .single();

    if (partyError || !party) {
      return NextResponse.json(
        { error: 'Party not found' },
        { status: 404 }
      );
    }

    // Get full queue for this restaurant
    const { data: queueParties } = await supabase
      .from('parties')
      .select('id, name, size, created_at, state')
      .eq('restaurant_id', party.restaurant_id)
      .in('state', ['queued', 'notified', 'on_the_way'])
      .order('created_at', { ascending: true });

    const position = queueParties?.findIndex(p => p.id === party.id) + 1 || 0;

    // Calculate ETA
    const { data: etaResult } = await supabase
      .rpc('estimate_eta_minutes', { rid: party.restaurant_id });
    
    const etaMinutes = etaResult || 0;

    return NextResponse.json({
      success: true,
      party: {
        ...party,
        position,
        eta_minutes: etaMinutes,
      },
      queue: queueParties?.map((p, index) => ({
        ...p,
        position: index + 1,
        isCurrentParty: p.id === party.id,
      })) || [],
    });

  } catch (error) {
    console.error('Get status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;
    const body = await request.json();
    const { action } = body;

    const supabase = createServerClient();

    // Get party by token
    const { data: party, error: partyError } = await supabase
      .from('parties')
      .select('*')
      .eq('token', token)
      .single();

    if (partyError || !party) {
      return NextResponse.json(
        { error: 'Party not found' },
        { status: 404 }
      );
    }

    let newState = party.state;

    switch (action) {
      case 'on_the_way':
        if (['queued', 'notified'].includes(party.state)) {
          newState = 'on_the_way';
        }
        break;
      case 'delay':
        // For now, just log the delay request
        // In a full implementation, this might adjust the party's position
        console.log(`Party ${party.id} requested 10-minute delay`);
        break;
      case 'cancel':
        if (!['seated', 'no_show', 'canceled'].includes(party.state)) {
          newState = 'canceled';
        }
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    if (newState !== party.state) {
      const updateData: any = { state: newState };
      
      if (newState === 'canceled') {
        updateData.canceled_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from('parties')
        .update(updateData)
        .eq('id', party.id);

      if (updateError) {
        console.error('Error updating party:', updateError);
        return NextResponse.json(
          { error: 'Failed to update party' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Party ${action} successful`,
    });

  } catch (error) {
    console.error('Update status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
