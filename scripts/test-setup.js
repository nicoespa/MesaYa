#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testSetup() {
  console.log('🧪 Testing FilaYA Setup...\n')

  // Check environment variables
  console.log('1. Checking environment variables...')
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE'
  ]

  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.log('❌ Missing environment variables:', missingVars.join(', '))
    console.log('   Please check your .env.local file')
    return false
  }
  console.log('✅ Environment variables configured')

  // Test Supabase connection
  console.log('\n2. Testing Supabase connection...')
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    // Test connection by fetching restaurants
    const { data: restaurants, error } = await supabase
      .from('restaurants')
      .select('id, name, slug')
      .limit(1)

    if (error) {
      console.log('❌ Supabase connection failed:', error.message)
      return false
    }

    console.log('✅ Supabase connection successful')
    if (restaurants && restaurants.length > 0) {
      console.log(`   Found restaurant: ${restaurants[0].name}`)
    }
  } catch (error) {
    console.log('❌ Supabase connection failed:', error.message)
    return false
  }

  // Test database schema
  console.log('\n3. Testing database schema...')
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE
    )

    // Check if all required tables exist
    const tables = ['restaurants', 'parties', 'waitlists', 'users_restaurants', 'tables', 'notifications', 'metrics_daily']
    
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1)

      if (error) {
        console.log(`❌ Table ${table} not found or not accessible`)
        return false
      }
    }

    console.log('✅ All required tables exist')
  } catch (error) {
    console.log('❌ Database schema test failed:', error.message)
    return false
  }

  // Test API endpoints (if server is running)
  console.log('\n4. Testing API endpoints...')
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    // Test queue endpoint
    const response = await fetch(`${baseUrl}/api/queue?restaurantId=550e8400-e29b-41d4-a716-446655440000`)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API endpoints working')
      console.log(`   Queue has ${data.parties?.length || 0} parties`)
    } else {
      console.log('⚠️  API endpoints not accessible (server may not be running)')
    }
  } catch (error) {
    console.log('⚠️  API endpoints not accessible (server may not be running)')
  }

  console.log('\n🎉 Setup test completed!')
  console.log('\nNext steps:')
  console.log('1. Run: npm run dev')
  console.log('2. Open: http://localhost:3000')
  console.log('3. Test the dashboard and party management')
  
  return true
}

testSetup().catch(console.error)
