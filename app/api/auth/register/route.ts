import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, supabase } from '@/lib/db/client'
import { z } from 'zod'

const registerSchema = z.object({
  restaurant: z.object({
    name: z.string().min(1, 'El nombre del restaurante es requerido'),
    address: z.string().min(1, 'La dirección es requerida'),
    phone: z.string().min(1, 'El teléfono es requerido'),
    email: z.string().email('Email inválido').optional(),
    description: z.string().optional(),
  }),
  owner: z.object({
    name: z.string().min(1, 'El nombre del propietario es requerido'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { restaurant, owner } = registerSchema.parse(body)

    const supabaseServer = createServerClient()
    const supabaseClient = supabase

    // Check if restaurant email already exists (only if provided)
    if (restaurant.email) {
      const { data: existingRestaurant } = await supabaseServer
        .from('restaurants')
        .select('id')
        .eq('email', restaurant.email)
        .single()

      if (existingRestaurant) {
        return NextResponse.json(
          { error: 'Ya existe un restaurante con este email' },
          { status: 400 }
        )
      }
    }

    // Check if owner email already exists in auth
    const { data: existingAuthUser } = await supabaseClient.auth.getUser()
    
    // We'll check this after trying to create the user, since we can't easily check auth users

    // Create user account (using client with anon key)
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email: owner.email,
      password: owner.password,
      options: {
        data: {
          name: owner.name,
          role: 'restaurant_owner'
        }
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { 
          error: 'Error al crear la cuenta de usuario',
          details: authError.message,
          code: authError.code
        },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'No se pudo crear el usuario' },
        { status: 400 }
      )
    }

    // Generate restaurant slug
    const slug = restaurant.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // Create restaurant
    const { data: restaurantData, error: restaurantError } = await supabaseServer
      .from('restaurants')
      .insert({
        name: restaurant.name,
        address: restaurant.address,
        waba_phone_id: restaurant.phone, // Store phone in waba_phone_id field
        slug: slug,
        tz: 'America/Argentina/Buenos_Aires',
        plan: 'starter'
      })
      .select()
      .single()

    if (restaurantError) {
      console.error('Restaurant error:', restaurantError)
      // Clean up user if restaurant creation fails
      await supabaseServer.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { 
          error: 'Error al crear el restaurante',
          details: restaurantError.message,
          code: restaurantError.code
        },
        { status: 400 }
      )
    }

    // Create user-restaurant relationship
    const { error: userRestaurantError } = await supabaseServer
      .from('users_restaurants')
      .insert({
        user_id: authData.user.id,
        restaurant_id: restaurantData.id,
        role: 'owner'
      })

    if (userRestaurantError) {
      console.error('User-restaurant relationship error:', userRestaurantError)
      // Clean up if relationship creation fails
      await supabaseServer.from('restaurants').delete().eq('id', restaurantData.id)
      await supabaseServer.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'Error al vincular usuario con restaurante' },
        { status: 400 }
      )
    }

    // Create default waitlist for the restaurant
    const { error: waitlistError } = await supabaseServer
      .from('waitlists')
      .insert({
        restaurant_id: restaurantData.id,
        status: 'open'
      })

    if (waitlistError) {
      console.error('Waitlist error:', waitlistError)
      // Don't fail the registration for waitlist error, just log it
    }

    return NextResponse.json({
      success: true,
      message: 'Restaurante registrado exitosamente',
      data: {
        restaurant: {
          id: restaurantData.id,
          name: restaurantData.name,
          slug: restaurantData.slug
        },
        user: {
          id: authData.user.id,
          email: owner.email,
          name: owner.name
        }
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    
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
