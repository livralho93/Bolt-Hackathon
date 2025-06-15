import React from 'react'
import { Users, UserPlus } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import type { TripParticipant } from '../../types'

interface ParticipantBubblesProps {
  participants: TripParticipant[]
  onInvite: () => void
  maxVisible?: number
}

export function ParticipantBubbles({ participants, onInvite, maxVisible = 6 }: ParticipantBubblesProps) {
  const visibleParticipants = participants.slice(0, maxVisible)
  const remainingCount = Math.max(0, participants.length - maxVisible)

  return (
    <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-neutral-600" />
        <span className="text-sm font-medium text-neutral-700">
          {participants.length} participant{participants.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-1">
        <div className="flex -space-x-2">
          {visibleParticipants.map((participant) => (
            <Avatar
              key={participant.userId}
              src={participant.user?.avatarUrl}
              name={participant.user?.fullName || participant.user?.email}
              size="md"
              className="border-2 border-white hover:z-10 transition-transform hover:scale-110"
            />
          ))}
          {remainingCount > 0 && (
            <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center text-sm font-medium text-neutral-600 border-2 border-white">
              +{remainingCount}
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={onInvite}
        variant="secondary"
        size="sm"
        className="flex items-center gap-2"
      >
        <UserPlus className="w-4 h-4" />
        Invite
      </Button>
    </div>
  )
}