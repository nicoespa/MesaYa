import { createServerClient } from '@/lib/db/client';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function getServerUser() {
  const cookieStore = cookies();
  const supabase = createServerClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function getServerUserWithRestaurants() {
  const user = await getServerUser();
  if (!user) return null;

  const supabase = createServerClient();
  
  const { data: userRestaurants, error } = await supabase
    .from('users_restaurants')
    .select(`
      role,
      restaurant:restaurants(*)
    `)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching user restaurants:', error);
    return null;
  }

  return {
    user,
    restaurants: userRestaurants || [],
  };
}

export async function requireAuth() {
  // Development mode: bypass authentication
  if (process.env.NODE_ENV === 'development') {
    return { id: 'dev-user', email: 'dev@example.com' };
  }

  const user = await getServerUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export async function requireRestaurantAccess(restaurantId: string) {
  // Development mode: bypass authentication
  if (process.env.NODE_ENV === 'development') {
    return {
      user: { id: 'dev-user', email: 'dev@example.com' },
      restaurants: [{ restaurant: { id: restaurantId } }]
    };
  }

  const userData = await getServerUserWithRestaurants();
  if (!userData) {
    throw new Error('Authentication required');
  }

  const hasAccess = userData.restaurants.some(
    (ur: any) => ur.restaurant.id === restaurantId
  );

  if (!hasAccess) {
    throw new Error('Access denied to restaurant');
  }

  return userData;
}

export function createClientSupabase(request: NextRequest) {
  const supabase = createServerClient();
  return supabase;
}
