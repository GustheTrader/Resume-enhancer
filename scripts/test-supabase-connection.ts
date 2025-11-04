/**
 * Test Supabase Connection
 * Run with: npx tsx scripts/test-supabase-connection.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    console.error('Required:');
    console.error('  - NEXT_PUBLIC_SUPABASE_URL');
    console.error('  - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  console.log('✅ Environment variables found');
  console.log(`   URL: ${supabaseUrl}`);
  console.log(`   Key: ${supabaseKey.substring(0, 20)}...`);
  console.log('');

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Test 1: List buckets
  console.log('📦 Test 1: Listing storage buckets...');
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
      console.error('❌ Error listing buckets:', error.message);
    } else {
      console.log('✅ Successfully connected to storage');
      console.log(`   Found ${buckets?.length || 0} bucket(s):`);
      buckets?.forEach(bucket => {
        console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      });

      // Check if resumes bucket exists
      const resumesBucket = buckets?.find(b => b.name === 'resumes');
      if (resumesBucket) {
        console.log('✅ "resumes" bucket exists and is configured correctly');
      } else {
        console.warn('⚠️  "resumes" bucket not found - you need to create it');
      }
    }
  } catch (error: any) {
    console.error('❌ Failed to connect:', error.message);
  }
  console.log('');

  // Test 2: Database connection (optional)
  console.log('🗄️  Test 2: Testing database connection...');
  try {
    const { data, error } = await supabase.from('User').select('count');

    if (error) {
      console.warn('⚠️  Database query failed:', error.message);
      console.log('   This is normal if you haven\'t run migrations yet');
    } else {
      console.log('✅ Database connection successful');
    }
  } catch (error: any) {
    console.warn('⚠️  Database test failed:', error.message);
    console.log('   This is normal if you haven\'t run migrations yet');
  }
  console.log('');

  // Test 3: Check Google API Key
  console.log('🔑 Test 3: Checking Google API Key...');
  const googleApiKey = process.env.GOOGLE_API_KEY;
  if (googleApiKey) {
    console.log('✅ Google API Key found');
    console.log(`   Key: ${googleApiKey.substring(0, 20)}...`);
  } else {
    console.warn('⚠️  GOOGLE_API_KEY not found in .env');
    console.log('   OCR functionality will not work without this key');
  }
  console.log('');

  console.log('🎉 Connection test complete!');
  console.log('');
  console.log('Next steps:');
  if (!buckets?.find(b => b.name === 'resumes')) {
    console.log('  1. Create the "resumes" bucket in Supabase dashboard');
  }
  console.log('  2. Run: npx prisma generate');
  console.log('  3. Run: npx prisma db push');
  console.log('  4. Start the app: npm run dev');
}

testSupabaseConnection().catch(console.error);
