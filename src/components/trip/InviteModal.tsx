import React, { useState } from 'react'
import { Copy, Mail, Link as LinkIcon, Check } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import type { TripWithDetails } from '../../types'

interface InviteModalProps {
  isOpen: boolean
  onClose: () => void
  trip: TripWithDetails
  onInvite: (email: string) => Promise<void>
}

export function InviteModal({ isOpen, onClose, trip, onInvite }: InviteModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [inviteMethod, setInviteMethod] = useState<'email' | 'link'>('email')

  const shareableLink = `${window.location.origin}/join/${trip.id}`

  const handleEmailInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    try {
      await onInvite(email.trim())
      setEmail('')
      onClose()
    } catch (error) {
      console.error('Error sending invite:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite People to Trip"
      size="md"
    >
      <div className="space-y-6">
        {/* Trip Info */}
        <div className="bg-neutral-50 rounded-lg p-4">
          <h3 className="font-semibold text-neutral-900 mb-1">{trip.name}</h3>
          <p className="text-sm text-neutral-600">
            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
          </p>
        </div>

        {/* Invite Method Toggle */}
        <div className="flex bg-neutral-100 rounded-lg p-1">
          <button
            onClick={() => setInviteMethod('email')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              inviteMethod === 'email'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            Email Invite
          </button>
          <button
            onClick={() => setInviteMethod('link')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              inviteMethod === 'link'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            Share Link
          </button>
        </div>

        {/* Email Invite */}
        {inviteMethod === 'email' && (
          <form onSubmit={handleEmailInvite} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="friend@example.com"
              required
            />
            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              Send Invitation
            </Button>
          </form>
        )}

        {/* Share Link */}
        {inviteMethod === 'link' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Shareable Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareableLink}
                  readOnly
                  className="input flex-1 bg-neutral-50"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={copyToClipboard}
                  className="px-3"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <p className="text-sm text-neutral-600">
              Anyone with this link can join your trip. Share it via text, social media, or any messaging app.
            </p>
          </div>
        )}

        {/* Current Participants */}
        <div>
          <h4 className="text-sm font-medium text-neutral-700 mb-3">
            Current Participants ({trip.participants.length})
          </h4>
          <div className="space-y-2">
            {trip.participants.map((participant) => (
              <div key={participant.userId} className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {(participant.user?.fullName || participant.user?.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-neutral-900">
                    {participant.user?.fullName || participant.user?.email}
                  </div>
                  {participant.role === 'owner' && (
                    <div className="text-xs text-primary-600">Trip Owner</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}