'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Restaurant } from '@/lib/db/types'

interface RestaurantContextType {
  restaurant: Restaurant | null
  setRestaurant: (restaurant: Restaurant) => void
  loading: boolean
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined)

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if there's a selected restaurant in localStorage
    const savedRestaurant = localStorage.getItem('selectedRestaurant')
    
    if (savedRestaurant) {
      try {
        const restaurant = JSON.parse(savedRestaurant)
        setRestaurant({
          id: restaurant.id,
          name: restaurant.name,
          slug: restaurant.slug,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      } catch (error) {
        console.error('Error parsing saved restaurant:', error)
        setRestaurant(null)
      }
    } else {
      setRestaurant(null)
    }
    
    setLoading(false)
  }, [])


  return (
    <RestaurantContext.Provider value={{ restaurant, setRestaurant, loading }}>
      {children}
    </RestaurantContext.Provider>
  )
}

export function useRestaurant() {
  const context = useContext(RestaurantContext)
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider')
  }
  return context
}
