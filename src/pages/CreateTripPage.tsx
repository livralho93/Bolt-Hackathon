import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useTripStore } from '../stores/tripStore'
import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'

export function CreateTripPage() {
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { createTrip } = useTripStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')

    const result = await createTrip({
      name,
      startDate,
      endDate,
      imageUrl: null,
      createdBy: user.id,
    })
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else if (result.trip) {
      navigate(`/trip/${result.trip.id}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Create New Trip</h1>
        <p className="text-neutral-600">
          Set up the basic details for your group trip
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Trip Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Tahoe Skiing Weekend"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              required
            />
          </div>

          <div className="text-center py-8">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-accent-400 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🏔️</span>
            </div>
            <p className="text-sm text-neutral-600 mb-2">AI-generated trip image</p>
            <Button type="button" variant="secondary" size="sm">
              Change Image
            </Button>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/dashboard')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1"
            >
              Create Trip
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}