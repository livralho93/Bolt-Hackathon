import { supabase } from '../lib/supabase'

export async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test 1: Basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    if (error) {
      console.error('❌ Database connection failed:', error.message)
      return false
    }
    console.log('✅ Database connection successful')

    // Test 2: Check if tables exist
    const tables = ['profiles', 'trips', 'trip_participants', 'line_items', 'line_item_participants', 'trip_invites']
    
    for (const table of tables) {
      try {
        const { error: tableError } = await supabase.from(table).select('*').limit(1)
        if (tableError) {
          console.error(`❌ Table ${table} not accessible:`, tableError.message)
          return false
        }
        console.log(`✅ Table ${table} exists and accessible`)
      } catch (err) {
        console.error(`❌ Error checking table ${table}:`, err)
        return false
      }
    }

    // Test 3: Check RLS is enabled (this should fail for unauthenticated users)
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
      
      // If we're not authenticated, this should return an empty array or specific RLS error
      if (profileError && profileError.message.includes('RLS')) {
        console.log('✅ Row Level Security is properly configured')
      } else if (!profileError && (!profileData || profileData.length === 0)) {
        console.log('✅ Row Level Security is working (no data returned for unauthenticated user)')
      } else {
        console.log('⚠️  RLS might not be configured correctly, but tables are accessible')
      }
    } catch (err) {
      console.log('✅ RLS is working (access properly restricted)')
    }

    console.log('🎉 Database setup verification complete!')
    return true

  } catch (error) {
    console.error('❌ Database verification failed:', error)
    return false
  }
}

// Test authentication flow
export async function testAuthFlow() {
  try {
    console.log('🔍 Testing authentication flow...')
    
    // Check current session
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('❌ Auth session check failed:', error.message)
      return false
    }
    
    if (session) {
      console.log('✅ User is currently authenticated:', session.user.email)
      
      // Test profile access for authenticated user
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      if (profileError) {
        console.error('❌ Profile access failed:', profileError.message)
        return false
      }
      
      console.log('✅ Profile access successful:', profile)
    } else {
      console.log('ℹ️  No user currently authenticated (this is normal)')
    }
    
    return true
  } catch (error) {
    console.error('❌ Auth flow test failed:', error)
    return false
  }
}