#!/usr/bin/env node

// Test Supabase connection
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase credentials in .env.local')
    console.log('📖 Please follow SETUP_GUIDE.md to configure Supabase')
    process.exit(1)
  }
  
  if (supabaseUrl.includes('your-project-id')) {
    console.log('❌ Supabase URL not configured (still has placeholder)')
    console.log('📖 Please update .env.local with your actual Supabase URL')
    process.exit(1)
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Test connection by fetching restaurants
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ Supabase connection failed:')
      console.log('   Error:', error.message)
      console.log('📖 Please check your Supabase configuration')
      process.exit(1)
    }
    
    console.log('✅ Supabase connection successful!')
    console.log(`   Found ${data.length} restaurant(s)`)
    
    // Test if sample data exists
    if (data.length > 0) {
      console.log('✅ Sample data found')
      console.log(`   Restaurant: ${data[0].name}`)
    } else {
      console.log('⚠️  No restaurants found - you may need to run the seed data')
    }
    
  } catch (err) {
    console.log('❌ Connection test failed:')
    console.log('   Error:', err.message)
    process.exit(1)
  }
}

testConnection()
