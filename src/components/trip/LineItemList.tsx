import React, { useState } from 'react'
import { format } from 'date-fns'
import { MapPin, Calendar, DollarSign, Edit2, Trash2, User } from 'lucide-react'
import { Button } from '../ui/Button'
import { Avatar } from '../ui/Avatar'
import { EditLineItemModal } from './EditLineItemModal'
import type { TripWithDetails, LineItem } from '../../types'

interface LineItemListProps {
  items: LineItem[]
  trip: TripWithDetails
  onUpdate: (id: string, updates: Partial<LineItem>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function LineItemList({ items, trip, onUpdate, onDelete }: LineItemListProps) {
  const [editingItem, setEditingItem] = useState<LineItem | null>(null)

  const handleEdit = async (updates: Partial<LineItem>) => {
    if (editingItem) {
      await onUpdate(editingItem.id, updates)
      setEditingItem(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await onDelete(id)
    }
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="border border-neutral-200 rounded-lg p-4 hover:shadow-soft transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-semibold text-neutral-900">{item.title}</h4>
                {item.assignedUser && (
                  <div className="flex items-center gap-1 text-xs text-neutral-600 bg-neutral-100 px-2 py-1 rounded-full">
                    <User className="w-3 h-3" />
                    {item.assignedUser.fullName || item.assignedUser.email}
                  </div>
                )}
              </div>

              {item.description && (
                <p className="text-neutral-600 text-sm mb-3">{item.description}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                {item.date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(item.date), 'MMM d, yyyy')}
                  </div>
                )}
                
                {item.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {item.location}
                  </div>
                )}
                
                {item.cost && (
                  <div className="flex items-center gap-1 text-primary-600 font-medium">
                    <DollarSign className="w-4 h-4" />
                    ${item.cost}
                    {item.participants && item.participants.length > 0 && (
                      <span className="text-neutral-500">
                        (${(item.cost / item.participants.length).toFixed(2)}/person)
                      </span>
                    )}
                  </div>
                )}
              </div>

              {item.participants && item.participants.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-neutral-600">Participants:</span>
                  <div className="flex -space-x-1">
                    {item.participants.slice(0, 4).map((participant) => (
                      <Avatar
                        key={participant.id}
                        src={participant.avatarUrl}
                        name={participant.fullName || participant.email}
                        size="sm"
                        className="border-2 border-white"
                      />
                    ))}
                    {item.participants.length > 4 && (
                      <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center text-xs font-medium text-neutral-600 border-2 border-white">
                        +{item.participants.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingItem(item)}
                className="p-2"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(item.id)}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      {editingItem && (
        <EditLineItemModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onUpdate={handleEdit}
          item={editingItem}
          trip={trip}
        />
      )}
    </div>
  )
}