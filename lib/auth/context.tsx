'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/db/client'
import { Restaurant } from '@/lib/db/types'

interface AuthContextType {
  user: User | null
  restaurant: Restaurant | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchUserRestaurant(session.user.id)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserRestaurant(session.user.id)
        } else {
          setRestaurant(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserRestaurant = async (userId: string) => {
    try {
      // First try to get restaurant from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          restaurant_id,
          restaurant:restaurants(*)
        `)
        .eq('id', userId)
        .single()

      if (userError) {
        console.error('Error fetching user restaurant:', userError)
        return
      }

      if (userData.restaurant) {
        setRestaurant(userData.restaurant)
        // Save restaurant to localStorage for persistence
        localStorage.setItem('selectedRestaurant', JSON.stringify(userData.restaurant))
        return
      }

      // Fallback: try users_restaurants table
      const { data, error } = await supabase
        .from('users_restaurants')
        .select(`
          restaurant:restaurants(*)
        `)
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching user restaurant from users_restaurants:', error)
        return
      }

      setRestaurant(data.restaurant)
      // Save restaurant to localStorage for persistence
      localStorage.setItem('selectedRestaurant', JSON.stringify(data.restaurant))
    } catch (error) {
      console.error('Error fetching user restaurant:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) {
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw error
    }
    
    // Clear restaurant from localStorage
    localStorage.removeItem('selectedRestaurant')
    setRestaurant(null)
  }

  const value = {
    user,
    restaurant,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
