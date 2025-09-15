'use client'

import { useState, useEffect } from 'react'
import { useRestaurant } from '@/lib/contexts/RestaurantContext'

interface HistoryEntry {
  id: string
  name: string
  phone: string
  size: number
  joinedAt: string
  servedAt: string | null
  status: 'served' | 'no_show' | 'cancelled' | 'queued'
  waitTime: number
  notes: string
}

interface HistoryStats {
  totalServed: number
  noShows: number
  cancelled: number
  avgWaitTime: number
  totalCustomers: number
  peakHour: string
  busiestDay: string
  satisfaction: number
}

interface ChartData {
  hourly: Array<{ hour: string; count: number }>
  daily: Array<{ day: string; count: number; date: string }>
  waitTimes: Array<{ range: string; count: number }>
}

interface HistoryData {
  history: HistoryEntry[]
  stats: HistoryStats
  charts: ChartData
}

export function useHistoryData() {
  const { restaurant, loading: restaurantLoading } = useRestaurant()
  const [data, setData] = useState<HistoryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!restaurant) return

    const fetchHistoryData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/history?restaurantId=${restaurant.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch history data')
        }
        
        const result = await response.json()
        
        if (result.success) {
          setData(result.data)
        } else {
          throw new Error(result.error || 'Failed to fetch history data')
        }
      } catch (err) {
        console.error('Error fetching history data:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
        
        // Fallback to mock data
        const mockData: HistoryData = {
          history: [
            {
              id: '1',
              name: 'María González',
              phone: '+5491123456789',
              size: 4,
              joinedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              servedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
              status: 'served',
              waitTime: 60,
              notes: 'Mesa cerca de la ventana'
            },
            {
              id: '2',
              name: 'Carlos Rodríguez',
              phone: '+5491123456790',
              size: 2,
              joinedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
              servedAt: null,
              status: 'no_show',
              waitTime: 90,
              notes: ''
            }
          ],
          stats: {
            totalServed: 15,
            noShows: 3,
            cancelled: 2,
            avgWaitTime: 35,
            totalCustomers: 20,
            peakHour: '20:00',
            busiestDay: 'Sábado',
            satisfaction: 4.2
          },
          charts: {
            hourly: Array.from({ length: 24 }, (_, hour) => ({
              hour: `${hour.toString().padStart(2, '0')}:00`,
              count: Math.floor(Math.random() * 10)
            })),
            daily: [
              { day: 'Lun', count: 15, date: '2024-01-15' },
              { day: 'Mar', count: 18, date: '2024-01-16' },
              { day: 'Mié', count: 22, date: '2024-01-17' },
              { day: 'Jue', count: 25, date: '2024-01-18' },
              { day: 'Vie', count: 35, date: '2024-01-19' },
              { day: 'Sáb', count: 45, date: '2024-01-20' },
              { day: 'Dom', count: 30, date: '2024-01-21' }
            ],
            waitTimes: [
              { range: '0-15 min', count: 5 },
              { range: '16-30 min', count: 8 },
              { range: '31-45 min', count: 4 },
              { range: '46-60 min', count: 2 },
              { range: '60+ min', count: 1 }
            ]
          }
        }
        
        setData(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchHistoryData()

    // Refresh data every 2 minutes
    const interval = setInterval(fetchHistoryData, 120000)

    return () => clearInterval(interval)
  }, [restaurant])

  return {
    data,
    loading: restaurantLoading || loading,
    error,
    refetch: () => {
      if (restaurant) {
        setLoading(true)
        setData(null)
      }
    }
  }
}
