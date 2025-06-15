import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Settings } from 'lucide-react'
import { format } from 'date-fns'
import { useTripStore } from '../stores/tripStore'
import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/Button'
import { TripTabs } from '../components/trip/TripTabs'
import { ParticipantBubbles } from '../components/trip/ParticipantBubbles'
import { CostSummary } from '../components/trip/CostSummary'
import { InviteModal } from '../components/trip/InviteModal'

export function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { 
    currentTrip, 
    loading, 
    fetchTripDetails, 
    addLineItem, 
    updateLineItem, 
    deleteLineItem,
    inviteParticipant,
    calculateParticipantCosts 
  } = useTripStore()
  
  const [showInviteModal, setShowInviteModal] = useState(false)

  useEffect(() => {
    if (tripId) {
      fetchTripDetails(tripId)
    }
  }, [tripId, fetchTripDetails])

  const handleAddLineItem = async (lineItemData: any) => {
    const result = await addLineItem(lineItemData)
    if (result.error) {
      console.error('Error adding line item:', result.error)
    }
  }

  const handleUpdateLineItem = async (id: string, updates: any) => {
    const result = await updateLineItem(id, updates)
    if (result.error) {
      console.error('Error updating line item:', result.error)
    }
  }

  const handleDeleteLineItem = async (id: string) => {
    const result = await deleteLineItem(id)
    if (result.error) {
      console.error('Error deleting line item:', result.error)
    }
  }

  const handleInvite = async (email: string) => {
    if (!tripId || !user) return
    
    const result = await inviteParticipant(tripId, email)
    if (result.error) {
      console.error('Error inviting participant:', result.error)
    }
  }

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

  const userCosts = calculateParticipantCosts(currentTrip.id)

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
        <div className="flex items-center gap-4 mb-6">
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
        <ParticipantBubbles
          participants={currentTrip.participants}
          onInvite={() => setShowInviteModal(true)}
        />
      </div>

      {/* Cost Summary */}
      {user && (
        <div className="mb-8">
          <CostSummary
            trip={currentTrip}
            userCosts={userCosts}
            currentUserId={user.id}
          />
        </div>
      )}

      {/* Content Tabs */}
      <TripTabs
        trip={currentTrip}
        onAddLineItem={handleAddLineItem}
        onUpdateLineItem={handleUpdateLineItem}
        onDeleteLineItem={handleDeleteLineItem}
      />

      {/* Invite Modal */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        trip={currentTrip}
        onInvite={handleInvite}
      />
    </div>
  )
}