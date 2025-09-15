import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/db/client'

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

    const supabase = createServerClient()

    // Get all parties for this restaurant
    const { data: parties, error: partiesError } = await supabase
      .from('parties')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false })
      .limit(100)

    if (partiesError) {
      console.error('Error fetching parties:', partiesError)
      return NextResponse.json(
        { error: 'Failed to fetch history' },
        { status: 500 }
      )
    }

    console.log('Parties found:', parties?.length || 0)

    // Calculate statistics
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    const todayParties = parties?.filter(party => {
      const partyDate = new Date(party.created_at)
      return partyDate >= today
    }) || []

    const servedParties = parties?.filter(party => party.state === 'seated') || []
    const noShowParties = parties?.filter(party => party.state === 'no_show') || []
    const cancelledParties = parties?.filter(party => party.state === 'cancelled') || []

    // Calculate average wait time for served parties
    const avgWaitTime = servedParties.length > 0 
      ? Math.round(
          servedParties.reduce((sum, party) => {
            const created = new Date(party.created_at)
            const updated = new Date(party.updated_at)
            const waitMinutes = Math.round((updated.getTime() - created.getTime()) / (1000 * 60))
            return sum + waitMinutes
          }, 0) / servedParties.length
        )
      : 0

    // Calculate hourly distribution for today
    const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => {
      const hourStart = new Date(today)
      hourStart.setHours(hour, 0, 0, 0)
      const hourEnd = new Date(today)
      hourEnd.setHours(hour + 1, 0, 0, 0)
      
      const count = todayParties.filter(party => {
        const partyTime = new Date(party.created_at)
        return partyTime >= hourStart && partyTime < hourEnd
      }).length

      return {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        count
      }
    })

    // Calculate daily distribution for last 7 days
    const dailyDistribution = Array.from({ length: 7 }, (_, dayOffset) => {
      const day = new Date(today)
      day.setDate(day.getDate() - dayOffset)
      
      const dayStart = new Date(day)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(day)
      dayEnd.setHours(23, 59, 59, 999)
      
      const count = parties?.filter(party => {
        const partyTime = new Date(party.created_at)
        return partyTime >= dayStart && partyTime <= dayEnd
      }).length || 0

      const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
      return {
        day: dayNames[day.getDay()],
        count,
        date: day.toISOString().split('T')[0]
      }
    }).reverse()

    // Calculate wait time distribution
    const waitTimeDistribution = [
      { range: '0-15 min', count: 0 },
      { range: '16-30 min', count: 0 },
      { range: '31-45 min', count: 0 },
      { range: '46-60 min', count: 0 },
      { range: '60+ min', count: 0 }
    ]

    servedParties.forEach(party => {
      const created = new Date(party.created_at)
      const updated = new Date(party.updated_at)
      const waitMinutes = Math.round((updated.getTime() - created.getTime()) / (1000 * 60))
      
      if (waitMinutes <= 15) waitTimeDistribution[0].count++
      else if (waitMinutes <= 30) waitTimeDistribution[1].count++
      else if (waitMinutes <= 45) waitTimeDistribution[2].count++
      else if (waitMinutes <= 60) waitTimeDistribution[3].count++
      else waitTimeDistribution[4].count++
    })

    // Find peak hour
    const peakHourData = hourlyDistribution.reduce((max, current) => 
      current.count > max.count ? current : max
    )
    const peakHour = peakHourData.count > 0 ? peakHourData.hour : 'N/A'

    // Find busiest day
    const busiestDayData = dailyDistribution.reduce((max, current) => 
      current.count > max.count ? current : max
    )
    const busiestDay = busiestDayData.count > 0 ? busiestDayData.day : 'N/A'

    // Calculate satisfaction score (mock calculation based on wait times and no-shows)
    const totalParties = parties?.length || 0
    const noShowRate = totalParties > 0 ? (noShowParties.length / totalParties) : 0
    const satisfaction = Math.max(1, Math.min(5, 5 - (noShowRate * 2) - (avgWaitTime > 60 ? 1 : 0)))

    // Format history entries
    const historyEntries = parties?.map(party => {
      const created = new Date(party.created_at)
      const updated = new Date(party.updated_at)
      const waitMinutes = Math.round((updated.getTime() - created.getTime()) / (1000 * 60))
      
      let status = 'queued'
      if (party.state === 'seated') status = 'served'
      else if (party.state === 'no_show') status = 'no_show'
      else if (party.state === 'cancelled') status = 'cancelled'

      return {
        id: party.id,
        name: party.name,
        phone: party.phone,
        size: party.size,
        joinedAt: party.created_at,
        servedAt: party.state === 'seated' ? party.updated_at : null,
        status,
        waitTime: waitMinutes,
        notes: party.notes || ''
      }
    }) || []

    return NextResponse.json({
      success: true,
      data: {
        history: historyEntries,
        stats: {
          totalServed: servedParties.length,
          noShows: noShowParties.length,
          cancelled: cancelledParties.length,
          avgWaitTime,
          totalCustomers: parties?.length || 0,
          peakHour,
          busiestDay,
          satisfaction: Math.round(satisfaction * 10) / 10
        },
        charts: {
          hourly: hourlyDistribution,
          daily: dailyDistribution,
          waitTimes: waitTimeDistribution
        }
      }
    })

  } catch (error) {
    console.error('History API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
