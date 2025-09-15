import { useEffect, useState } from 'react'
import { supabase } from '@/lib/db/client'
import { PartyWithDetails, QueueStats } from '@/lib/db/types'

interface UseRealtimeQueueProps {
  restaurantId: string
  enabled?: boolean
}

export function useRealtimeQueue({ restaurantId, enabled = true }: UseRealtimeQueueProps) {
  const [parties, setParties] = useState<PartyWithDetails[]>([])
  const [stats, setStats] = useState<QueueStats>({
    waiting: 0,
    avg_wait_minutes: 0,
    seated_today: 0,
    no_shows_today: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQueue = async () => {
    try {
      setError(null)
      const response = await fetch(`/api/queue?restaurantId=${restaurantId}`)
      const data = await response.json()
      
      if (data.success) {
        setParties(data.parties)
        setStats(data.stats)
      } else {
        setError(data.error || 'Failed to fetch queue')
      }
    } catch (err) {
      setError('Network error')
      console.error('Error fetching queue:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!enabled || !restaurantId) return

    // Initial fetch
    fetchQueue()

    // Set up real-time subscription
    const channel = supabase
      .channel('queue-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parties',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          console.log('Real-time update:', payload)
          // Refetch data when parties change
          fetchQueue()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'waitlists',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          console.log('Waitlist update:', payload)
          fetchQueue()
        }
      )
      .subscribe()

    // Update wait times every minute
    const interval = setInterval(() => {
      if (parties.length > 0) {
        // Update wait times without refetching
        setParties(prevParties => 
          prevParties.map(party => {
            const createdAt = new Date(party.created_at)
            const now = new Date()
            const waitTimeMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60))
            
            return {
              ...party,
              wait_time_minutes: waitTimeMinutes,
              eta_minutes: party.eta_minutes || Math.max(0, waitTimeMinutes),
            }
          })
        )
      }
    }, 60000) // Update every minute

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [restaurantId, enabled, parties.length])

  return {
    parties,
    stats,
    loading,
    error,
    refetch: fetchQueue,
  }
}
