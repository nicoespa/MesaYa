import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/db/client'
import { requireRestaurantAccess } from '@/lib/auth/server'

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
      .select('restaurant_id, state')
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

    // Check if party can be marked as no show
    if (!['queued', 'notified', 'on_the_way'].includes(party.state)) {
      return NextResponse.json(
        { error: 'Party cannot be marked as no show' },
        { status: 400 }
      )
    }

    // Update party state
    const { error: updateError } = await supabase
      .from('parties')
      .update({
        state: 'no_show',
        no_show_at: new Date().toISOString(),
      })
      .eq('id', partyId)

    if (updateError) {
      console.error('Error updating party:', updateError)
      return NextResponse.json(
        { error: 'Failed to mark party as no show' },
        { status: 500 }
      )
    }

    // Update daily metrics
    const today = new Date().toISOString().split('T')[0]
    
    // Get current metrics or create new record
    const { data: existingMetrics } = await supabase
      .from('metrics_daily')
      .select('no_shows')
      .eq('restaurant_id', party.restaurant_id)
      .eq('day', today)
      .single()

    if (existingMetrics) {
      // Update existing record
      await supabase
        .from('metrics_daily')
        .update({
          no_shows: existingMetrics.no_shows + 1,
        })
        .eq('restaurant_id', party.restaurant_id)
        .eq('day', today)
    } else {
      // Create new record
      await supabase
        .from('metrics_daily')
        .insert({
          restaurant_id: party.restaurant_id,
          day: today,
          no_shows: 1,
        })
    }

    return NextResponse.json({
      success: true,
      message: 'Party marked as no show',
    })

  } catch (error) {
    console.error('No show party error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}