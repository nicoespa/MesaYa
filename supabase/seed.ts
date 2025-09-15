import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSeed() {
  try {
    console.log('🌱 Running database seed...');

    // Read and execute schema
    const schemaPath = join(__dirname, '001_schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Creating schema...');
    const { error: schemaError } = await supabase.rpc('exec_sql', { sql: schema });
    if (schemaError) {
      console.error('Schema error:', schemaError);
      throw schemaError;
    }

    // Read and execute seed data
    const seedPath = join(__dirname, '002_seed.sql');
    const seed = readFileSync(seedPath, 'utf8');
    
    console.log('🌱 Inserting seed data...');
    const { error: seedError } = await supabase.rpc('exec_sql', { sql: seed });
    if (seedError) {
      console.error('Seed error:', seedError);
      throw seedError;
    }

    console.log('✅ Database seeded successfully!');
    console.log('📱 Test restaurant: Kansas Belgrano (slug: kansas-belgrano)');
    console.log('🔗 Join URL: http://localhost:3000/join/kansas-belgrano');
    console.log('📊 Dashboard: http://localhost:3000/dashboard');
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

runSeed();
