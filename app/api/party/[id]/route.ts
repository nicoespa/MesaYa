import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/db/client'
import { requireRestaurantAccess } from '@/lib/auth/server'
import { parsePhoneNumber } from 'libphonenumber-js'

const updatePartySchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().min(1),
  size: z.number().int().min(1).max(12),
  eta_minutes: z.number().int().min(5).max(120),
  notes: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const partyId = params.id
    const body = await request.json()
    const { name, phone, size, eta_minutes, notes } = updatePartySchema.parse(body)

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
      .select('restaurant_id')
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

    // Normalize phone number
    let normalizedPhone: string
    try {
      const phoneNumber = parsePhoneNumber(phone, 'AR')
      normalizedPhone = phoneNumber.format('E.164')
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // Update party
    const { error: updateError } = await supabase
      .from('parties')
      .update({
        name,
        phone: normalizedPhone,
        size,
        eta_minutes,
        notes,
      })
      .eq('id', partyId)

    if (updateError) {
      console.error('Error updating party:', updateError)
      return NextResponse.json(
        { error: 'Failed to update party' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Party updated successfully',
    })

  } catch (error) {
    console.error('Update party error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
