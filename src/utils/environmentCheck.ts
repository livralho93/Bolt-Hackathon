// Environment diagnostic utility
export async function checkEnvironment() {
  const results: string[] = []
  
  // Check 1: Basic environment info
  results.push('=== ENVIRONMENT CHECK ===')
  results.push(`User Agent: ${navigator.userAgent}`)
  results.push(`Current URL: ${window.location.href}`)
  results.push(`Protocol: ${window.location.protocol}`)
  results.push(`Host: ${window.location.host}`)
  
  // Check 2: Required environment variables
  results.push('\n=== ENVIRONMENT VARIABLES ===')
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ]
  
  requiredEnvVars.forEach(envVar => {
    const value = import.meta.env[envVar]
    if (value) {
      results.push(`✅ ${envVar}: ${value.substring(0, 30)}...`)
    } else {
      results.push(`❌ ${envVar}: MISSING`)
    }
  })
  
  // Check 3: Vite environment
  results.push('\n=== VITE ENVIRONMENT ===')
  results.push(`Mode: ${import.meta.env.MODE}`)
  results.push(`Dev: ${import.meta.env.DEV}`)
  results.push(`Prod: ${import.meta.env.PROD}`)
  results.push(`Base URL: ${import.meta.env.BASE_URL}`)
  
  // Check 4: Module imports
  results.push('\n=== MODULE IMPORTS ===')
  try {
    const React = await import('react')
    results.push('✅ React imported successfully')
  } catch (error) {
    results.push(`❌ React import failed: ${error}`)
  }
  
  try {
    const { supabase } = await import('../lib/supabase')
    results.push('✅ Supabase client imported successfully')
    
    // Test Supabase connection
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1)
      if (error) {
        results.push(`⚠️  Supabase connection issue: ${error.message}`)
      } else {
        results.push('✅ Supabase connection working')
      }
    } catch (connError) {
      results.push(`⚠️  Supabase connection test failed: ${connError}`)
    }
  } catch (error) {
    results.push(`❌ Supabase import failed: ${error}`)
  }
  
  try {
    const { BrowserRouter } = await import('react-router-dom')
    results.push('✅ React Router imported successfully')
  } catch (error) {
    results.push(`❌ React Router import failed: ${error}`)
  }
  
  // Check 5: CSS and Tailwind
  results.push('\n=== STYLING ===')
  const testElement = document.createElement('div')
  testElement.className = 'bg-primary-600 text-white p-4'
  testElement.style.position = 'absolute'
  testElement.style.left = '-9999px'
  document.body.appendChild(testElement)
  
  const styles = window.getComputedStyle(testElement)
  
  if (styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
    results.push('✅ Tailwind CSS is working')
    results.push(`   Background color: ${styles.backgroundColor}`)
  } else {
    results.push('❌ Tailwind CSS not loading properly')
  }
  
  document.body.removeChild(testElement)
  
  // Check 6: Network connectivity
  results.push('\n=== NETWORK TESTS ===')
  try {
    const response = await fetch('/vite.svg')
    if (response.ok) {
      results.push('✅ Can fetch static assets')
    } else {
      results.push(`⚠️  Static asset fetch returned: ${response.status}`)
    }
  } catch (error) {
    results.push(`❌ Cannot fetch static assets: ${error}`)
  }
  
  return results
}

export function getEnvironmentSummary() {
  return {
    isWebContainer: navigator.userAgent.includes('WebContainer'),
    isDev: import.meta.env.DEV,
    hasSupabaseConfig: !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY),
    currentUrl: window.location.href,
  }
}