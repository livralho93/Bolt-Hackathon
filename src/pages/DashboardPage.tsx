import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Calendar, Users } from 'lucide-react'
import { format } from 'date-fns'
import { useTripStore } from '../stores/tripStore'
import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Avatar } from '../components/ui/Avatar'

export function DashboardPage() {
  const { trips, loading, fetchTrips } = useTripStore()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchTrips()
  }, [fetchTrips])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 rounded w-1/4" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-neutral-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">My Trips</h1>
          <p className="text-neutral-600 mt-1">
            {trips.length === 0 
              ? "Ready to plan your first adventure?" 
              : `You have ${trips.length} trip${trips.length === 1 ? '' : 's'}`
            }
          </p>
        </div>
        <Link to="/create-trip">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Trip
          </Button>
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            No trips yet
          </h3>
          <p className="text-neutral-600 mb-6 max-w-md mx-auto">
            Create your first trip to start coordinating accommodations, activities, and expenses with your group.
          </p>
          <Link to="/create-trip">
            <Button size="lg">
              Create Your First Trip
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <Link key={trip.id} to={`/trip/${trip.id}`}>
              <Card className="hover:shadow-medium transition-shadow duration-200 cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-primary-400 to-accent-400 rounded-lg mb-4 flex items-center justify-center">
                  {trip.imageUrl ? (
                    <img 
                      src={trip.imageUrl} 
                      alt={trip.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-white text-4xl">🏔️</div>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {trip.name}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Users className="w-4 h-4" />
                    <span>Planning...</span>
                  </div>
                  
                  <div className="flex -space-x-2">
                    {/* Placeholder for participant avatars - Emily will implement */}
                    <Avatar name={user?.fullName || user?.email || 'User'} size="sm" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}