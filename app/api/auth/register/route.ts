import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/db/client'
import { z } from 'zod'

const registerSchema = z.object({
  restaurant: z.object({
    name: z.string().min(1, 'El nombre del restaurante es requerido'),
    address: z.string().min(1, 'La dirección es requerida'),
    phone: z.string().min(1, 'El teléfono es requerido'),
    email: z.string().email('Email inválido'),
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

    const supabase = createServerClient()

    // Check if restaurant email already exists
    const { data: existingRestaurant } = await supabase
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

    // Check if owner email already exists
    const { data: existingOwner } = await supabase
      .from('users')
      .select('id')
      .eq('email', owner.email)
      .single()

    if (existingOwner) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con este email' },
        { status: 400 }
      )
    }

    // Create user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
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
        { error: 'Error al crear la cuenta de usuario' },
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
    const { data: restaurantData, error: restaurantError } = await supabase
      .from('restaurants')
      .insert({
        name: restaurant.name,
        address: restaurant.address,
        phone: restaurant.phone,
        email: restaurant.email,
        description: restaurant.description || '',
        slug: slug,
        owner_id: authData.user.id,
        status: 'active'
      })
      .select()
      .single()

    if (restaurantError) {
      console.error('Restaurant error:', restaurantError)
      // Clean up user if restaurant creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'Error al crear el restaurante' },
        { status: 400 }
      )
    }

    // Create user record
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: owner.email,
        name: owner.name,
        role: 'restaurant_owner',
        restaurant_id: restaurantData.id,
        created_at: new Date().toISOString()
      })

    if (userError) {
      console.error('User record error:', userError)
      // Clean up if user record creation fails
      await supabase.from('restaurants').delete().eq('id', restaurantData.id)
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'Error al crear el registro de usuario' },
        { status: 400 }
      )
    }

    // Create default waitlist for the restaurant
    const { error: waitlistError } = await supabase
      .from('waitlists')
      .insert({
        restaurant_id: restaurantData.id,
        name: 'Lista Principal',
        status: 'open',
        max_capacity: 50,
        estimated_wait_time: 30
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
