import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Avatar } from '../ui/Avatar'
import type { TripWithDetails, LineItem } from '../../types'

interface EditLineItemModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (updates: Partial<LineItem>) => Promise<void>
  item: LineItem
  trip: TripWithDetails
}

export function EditLineItemModal({ isOpen, onClose, onUpdate, item, trip }: EditLineItemModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: item.title,
    description: item.description || '',
    date: item.date || '',
    location: item.location || '',
    cost: item.cost?.toString() || '',
    assignedTo: item.assignedTo || '',
    participantIds: item.participants?.map(p => p.id) || [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await onUpdate({
        title: formData.title,
        description: formData.description || null,
        date: formData.date || null,
        location: formData.location || null,
        cost: formData.cost ? parseFloat(formData.cost) : null,
        assignedTo: formData.assignedTo || null,
      })
    } catch (error) {
      console.error('Error updating line item:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleParticipant = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      participantIds: prev.participantIds.includes(userId)
        ? prev.participantIds.filter(id => id !== userId)
        : [...prev.participantIds, userId]
    }))
  }

  const categoryLabels = {
    accommodation: 'Accommodation',
    activity: 'Activity',
    meal: 'Meal'
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${categoryLabels[item.category]}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Add more details about this item..."
            rows={3}
            className="input resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            min={trip.startDate}
            max={trip.endDate}
          />

          <Input
            label="Cost (optional)"
            type="number"
            step="0.01"
            min="0"
            value={formData.cost}
            onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
            placeholder="0.00"
          />
        </div>

        <Input
          label="Location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          placeholder="Enter location..."
        />

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Assigned to
          </label>
          <select
            value={formData.assignedTo}
            onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
            className="input"
          >
            <option value="">No one assigned</option>
            {trip.participants.map((participant) => (
              <option key={participant.userId} value={participant.userId}>
                {participant.user?.fullName || participant.user?.email}
                {participant.role === 'owner' && ' (Owner)'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Participants
          </label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {trip.participants.map((participant) => (
              <label
                key={participant.userId}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.participantIds.includes(participant.userId)}
                  onChange={() => toggleParticipant(participant.userId)}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <Avatar
                  src={participant.user?.avatarUrl}
                  name={participant.user?.fullName || participant.user?.email}
                  size="sm"
                />
                <span className="text-sm text-neutral-700">
                  {participant.user?.fullName || participant.user?.email}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="flex-1"
          >
            Update {categoryLabels[item.category]}
          </Button>
        </div>
      </form>
    </Modal>
  )
}