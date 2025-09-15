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

    // Check if party can be marked as on the way
    if (!['queued', 'notified'].includes(party.state)) {
      return NextResponse.json(
        { error: 'Party cannot be marked as on the way' },
        { status: 400 }
      )
    }

    // Update party state
    const { error: updateError } = await supabase
      .from('parties')
      .update({
        state: 'on_the_way',
      })
      .eq('id', partyId)

    if (updateError) {
      console.error('Error updating party:', updateError)
      return NextResponse.json(
        { error: 'Failed to update party status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Party marked as on the way',
    })

  } catch (error) {
    console.error('On the way party error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}