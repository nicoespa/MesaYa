import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/db/client'
import { requireRestaurantAccess } from '@/lib/auth/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get('restaurantId')

    if (!restaurantId) {
      return NextResponse.json(
        { error: 'Restaurant ID is required' },
        { status: 400 }
      )
    }

    // Validate restaurant access
    await requireRestaurantAccess(restaurantId)

    const supabase = createServerClient()

    // Get active waitlist
    const { data: waitlist, error: waitlistError } = await supabase
      .from('waitlists')
      .select('id, status')
      .eq('restaurant_id', restaurantId)
      .eq('status', 'open')
      .single()

    if (waitlistError || !waitlist) {
      return NextResponse.json(
        { error: 'No active waitlist found' },
        { status: 404 }
      )
    }

    // Get parties with position calculation
    const { data: parties, error: partiesError } = await supabase
      .from('parties')
      .select(`
        *,
        restaurant:restaurants(name, slug)
      `)
      .eq('restaurant_id', restaurantId)
      .in('state', ['queued', 'notified', 'on_the_way'])
      .order('created_at', { ascending: true })

    if (partiesError) {
      console.error('Error fetching parties:', partiesError)
      return NextResponse.json(
        { error: 'Failed to fetch parties' },
        { status: 500 }
      )
    }

    // Calculate positions and add to parties with real wait time
    const partiesWithPosition = parties.map((party, index) => {
      const createdAt = new Date(party.created_at)
      const now = new Date()
      const waitTimeMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60))
      
      return {
        ...party,
        position: index + 1,
        eta_minutes: party.eta_minutes || Math.max(0, waitTimeMinutes),
        wait_time_minutes: waitTimeMinutes,
      }
    })

    // Calculate real-time stats
    const waiting = partiesWithPosition.length
    
    // Get today's seated parties
    const today = new Date().toISOString().split('T')[0]
    const { data: seatedToday } = await supabase
      .from('parties')
      .select('id')
      .eq('restaurant_id', restaurantId)
      .eq('state', 'seated')
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`)

    // Get today's no shows
    const { data: noShowsToday } = await supabase
      .from('parties')
      .select('id')
      .eq('restaurant_id', restaurantId)
      .eq('state', 'no_show')
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`)

    // Calculate average wait time from current parties
    const avgWaitMinutes = partiesWithPosition.length > 0 
      ? Math.round(partiesWithPosition.reduce((sum, party) => sum + (party.eta_minutes || 0), 0) / partiesWithPosition.length)
      : 0

    const stats = {
      waiting,
      avg_wait_minutes: avgWaitMinutes,
      seated_today: seatedToday?.length || 0,
      no_shows_today: noShowsToday?.length || 0,
    }

    return NextResponse.json({
      success: true,
      parties: partiesWithPosition,
      stats,
      waitlist: {
        id: waitlist.id,
        status: waitlist.status,
      },
    })

  } catch (error) {
    console.error('Queue API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}