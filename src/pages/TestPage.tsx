import React, { useState } from 'react'
import { testDatabaseConnection, testAuthFlow } from '../utils/testDatabase'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export function TestPage() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<string[]>([])

  const runTests = async () => {
    setTesting(true)
    setResults([])
    
    // Capture console logs
    const originalLog = console.log
    const originalError = console.error
    const logs: string[] = []
    
    console.log = (...args) => {
      logs.push(args.join(' '))
      originalLog(...args)
    }
    
    console.error = (...args) => {
      logs.push(`ERROR: ${args.join(' ')}`)
      originalError(...args)
    }

    try {
      await testDatabaseConnection()
      await testAuthFlow()
    } catch (error) {
      logs.push(`UNEXPECTED ERROR: ${error}`)
    }

    // Restore console
    console.log = originalLog
    console.error = originalError
    
    setResults(logs)
    setTesting(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Database Setup Verification</h1>
        <p className="text-neutral-600">
          Test the database connection and verify all tables are properly configured.
        </p>
      </div>

      <Card className="mb-6">
        <div className="text-center">
          <Button 
            onClick={runTests} 
            loading={testing}
            size="lg"
            className="mb-4"
          >
            {testing ? 'Running Tests...' : 'Run Database Tests'}
          </Button>
          <p className="text-sm text-neutral-600">
            This will verify tables, RLS policies, and authentication setup
          </p>
        </div>
      </Card>

      {results.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Test Results</h3>
          <div className="bg-neutral-900 text-neutral-100 p-4 rounded-lg font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div 
                key={index} 
                className={
                  result.includes('✅') ? 'text-green-400' :
                  result.includes('❌') || result.includes('ERROR') ? 'text-red-400' :
                  result.includes('⚠️') ? 'text-yellow-400' :
                  result.includes('ℹ️') ? 'text-blue-400' :
                  'text-neutral-300'
                }
              >
                {result}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}