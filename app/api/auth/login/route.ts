import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, supabase } from '@/lib/db/client'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    const supabaseServer = createServerClient()
    const supabaseClient = supabase

    // Sign in user
    const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { 
          error: 'Error al iniciar sesión',
          details: authError.message,
          code: authError.code
        },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'No se pudo autenticar el usuario' },
        { status: 400 }
      )
    }

    // Get user's restaurant
    const { data: userRestaurant, error: userRestaurantError } = await supabaseServer
      .from('users_restaurants')
      .select(`
        role,
        restaurant:restaurants(*)
      `)
      .eq('user_id', authData.user.id)
      .single()

    if (userRestaurantError || !userRestaurant) {
      console.error('User restaurant error:', userRestaurantError)
      return NextResponse.json(
        { error: 'No se encontró el restaurante asociado' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token: authData.session?.access_token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.name || authData.user.email,
        role: userRestaurant.role
      },
      restaurant: {
        id: userRestaurant.restaurant.id,
        name: userRestaurant.restaurant.name,
        slug: userRestaurant.restaurant.slug,
        address: userRestaurant.restaurant.address
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
