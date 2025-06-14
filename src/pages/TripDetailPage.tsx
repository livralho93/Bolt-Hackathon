import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Settings } from 'lucide-react'
import { format } from 'date-fns'
import { useTripStore } from '../stores/tripStore'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'

export function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const { currentTrip, loading, fetchTripDetails } = useTripStore()

  useEffect(() => {
    if (tripId) {
      fetchTripDetails(tripId)
    }
  }, [tripId, fetchTripDetails])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 rounded w-1/4" />
          <div className="h-32 bg-neutral-200 rounded" />
          <div className="h-96 bg-neutral-200 rounded" />
        </div>
      </div>
    )
  }

  if (!currentTrip) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Trip not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="-ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          My Trips
        </Button>
        
        <Button variant="ghost" className="p-2">
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Trip Header */}
      <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-400 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🏔️</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{currentTrip.name}</h1>
            <p className="text-neutral-600">
              {format(new Date(currentTrip.startDate), 'MMM d')} - {format(new Date(currentTrip.endDate), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        {/* Participants */}
        <div className="flex items-center gap-3 mb-4">
          {currentTrip.participants.map((participant) => (
            <Avatar
              key={participant.id}
              src={participant.user?.avatarUrl}
              name={participant.user?.fullName || participant.user?.email}
              size="md"
            />
          ))}
        </div>

        {/* Cost Summary - Emily will implement */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 text-center">
          <div className="text-lg font-semibold text-primary-900">Your total: $0</div>
          <div className="text-sm text-primary-700">Cost calculation coming soon</div>
        </div>
      </div>

      {/* Content Tabs - Avril will implement */}
      <div className="bg-white rounded-xl shadow-soft border border-neutral-200">
        <div className="border-b border-neutral-200">
          <nav className="flex">
            <button className="px-6 py-4 text-sm font-medium text-primary-600 border-b-2 border-primary-600">
              Accommodations
            </button>
            <button className="px-6 py-4 text-sm font-medium text-neutral-500 hover:text-neutral-700">
              Activities
            </button>
            <button className="px-6 py-4 text-sm font-medium text-neutral-500 hover:text-neutral-700">
              Meals
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏠</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              No accommodations yet
            </h3>
            <p className="text-neutral-600 mb-4">
              Add your first accommodation to get started
            </p>
            <Button>Add Accommodation</Button>
          </div>
        </div>
      </div>
    </div>
  )
}