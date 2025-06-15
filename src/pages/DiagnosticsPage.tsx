import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { checkEnvironment, getEnvironmentSummary } from '../utils/environmentCheck'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ArrowLeft, RefreshCw, ExternalLink } from 'lucide-react'

export function DiagnosticsPage() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState(getEnvironmentSummary())

  const runDiagnostics = async () => {
    setLoading(true)
    try {
      const diagnosticResults = await checkEnvironment()
      setResults(diagnosticResults)
      setSummary(getEnvironmentSummary())
    } catch (error) {
      setResults([`❌ Diagnostics failed: ${error}`])
    }
    setLoading(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  return (
    <div className="min-h-screen bg-neutral-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Environment Diagnostics</h1>
          <p className="text-neutral-600">
            Checking if all required dependencies and configurations are working properly.
          </p>
        </div>

        {/* Quick Summary */}
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Summary</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Environment:</span>
                <span className={summary.isWebContainer ? 'text-blue-600' : 'text-neutral-600'}>
                  {summary.isWebContainer ? 'WebContainer' : 'Standard Browser'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Mode:</span>
                <span className={summary.isDev ? 'text-green-600' : 'text-orange-600'}>
                  {summary.isDev ? 'Development' : 'Production'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Supabase Config:</span>
                <span className={summary.hasSupabaseConfig ? 'text-green-600' : 'text-red-600'}>
                  {summary.hasSupabaseConfig ? 'Configured' : 'Missing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Current URL:</span>
                <span className="text-neutral-600 truncate ml-2">
                  {summary.currentUrl}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card padding="sm">
            <div className="text-center">
              <Button 
                onClick={runDiagnostics} 
                loading={loading}
                className="w-full mb-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {loading ? 'Running...' : 'Run Diagnostics'}
              </Button>
              <p className="text-xs text-neutral-600">
                Test all systems
              </p>
            </div>
          </Card>

          <Card padding="sm">
            <div className="text-center">
              <Button 
                variant="secondary"
                onClick={() => window.location.reload()}
                className="w-full mb-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
              <p className="text-xs text-neutral-600">
                Fresh start
              </p>
            </div>
          </Card>

          <Card padding="sm">
            <div className="text-center">
              <Button 
                variant="accent"
                onClick={() => window.open('http://localhost:5173', '_blank')}
                className="w-full mb-2"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Localhost
              </Button>
              <p className="text-xs text-neutral-600">
                Direct link
              </p>
            </div>
          </Card>
        </div>

        {/* Diagnostic Results */}
        {results.length > 0 && (
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Diagnostic Results</h3>
            <div className="bg-neutral-900 text-neutral-100 p-4 rounded-lg font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div 
                  key={index} 
                  className={
                    result.includes('✅') ? 'text-green-400' :
                    result.includes('❌') ? 'text-red-400' :
                    result.includes('⚠️') ? 'text-yellow-400' :
                    result.includes('===') ? 'text-blue-400 font-bold' :
                    'text-neutral-300'
                  }
                >
                  {result}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Visual Tests */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">Styling Test</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-primary-600 rounded-full"></div>
                <span className="text-sm">Primary Color</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-secondary-500 rounded-full"></div>
                <span className="text-sm">Secondary Color</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-accent-500 rounded-full"></div>
                <span className="text-sm">Accent Color</span>
              </div>
              <Button size="sm" className="mt-2">Test Button</Button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">Component Test</h3>
            <div className="space-y-3">
              <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg">
                <p className="text-sm text-primary-800">This is a styled component</p>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm">Primary</Button>
                <Button variant="secondary" size="sm">Secondary</Button>
                <Button variant="accent" size="sm">Accent</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Troubleshooting Tips */}
        <Card>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Troubleshooting Tips</h3>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">If the preview isn't working:</h4>
              <ul className="text-blue-800 space-y-1 ml-4">
                <li>• Try clicking "Open Localhost" button above</li>
                <li>• Check if the Vite server is running in terminal</li>
                <li>• Try refreshing the preview window</li>
                <li>• Use the direct localhost:5173 link</li>
              </ul>
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-1">If Supabase isn't working:</h4>
              <ul className="text-green-800 space-y-1 ml-4">
                <li>• Check that .env file has correct VITE_SUPABASE_URL</li>
                <li>• Check that .env file has correct VITE_SUPABASE_ANON_KEY</li>
                <li>• Restart the dev server after changing .env</li>
              </ul>
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-1">If styles aren't loading:</h4>
              <ul className="text-yellow-800 space-y-1 ml-4">
                <li>• Check that Tailwind CSS is properly configured</li>
                <li>• Verify that index.css is being imported</li>
                <li>• Try clearing browser cache</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}