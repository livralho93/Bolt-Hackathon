import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../ui/Button'
import { LineItemList } from './LineItemList'
import { AddLineItemModal } from './AddLineItemModal'
import type { TripWithDetails, LineItem } from '../../types'

interface TripTabsProps {
  trip: TripWithDetails
  onAddLineItem: (lineItem: Omit<LineItem, 'id' | 'createdAt' | 'updatedAt' | 'orderIndex'>) => Promise<void>
  onUpdateLineItem: (id: string, updates: Partial<LineItem>) => Promise<void>
  onDeleteLineItem: (id: string) => Promise<void>
}

export function TripTabs({ trip, onAddLineItem, onUpdateLineItem, onDeleteLineItem }: TripTabsProps) {
  const [activeTab, setActiveTab] = useState<'accommodation' | 'activity' | 'meal'>('accommodation')
  const [showAddModal, setShowAddModal] = useState(false)

  const tabs = [
    { id: 'accommodation' as const, label: 'Accommodations', icon: '🏠' },
    { id: 'activity' as const, label: 'Activities', icon: '🎯' },
    { id: 'meal' as const, label: 'Meals', icon: '🍽️' },
  ]

  const activeItems = trip.lineItems
    .filter(item => item.category === activeTab)
    .sort((a, b) => a.orderIndex - b.orderIndex)

  const handleAddItem = async (itemData: Omit<LineItem, 'id' | 'createdAt' | 'updatedAt' | 'orderIndex'>) => {
    await onAddLineItem(itemData)
    setShowAddModal(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-soft border border-neutral-200">
      {/* Tab Navigation */}
      <div className="border-b border-neutral-200">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                  : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">
            {tabs.find(t => t.id === activeTab)?.label}
          </h3>
          <Button
            onClick={() => setShowAddModal(true)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add {tabs.find(t => t.id === activeTab)?.label.slice(0, -1)}
          </Button>
        </div>

        {activeItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">{tabs.find(t => t.id === activeTab)?.icon}</span>
            </div>
            <h4 className="text-lg font-semibold text-neutral-900 mb-2">
              No {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} yet
            </h4>
            <p className="text-neutral-600 mb-4">
              Add your first {tabs.find(t => t.id === activeTab)?.label.slice(0, -1).toLowerCase()} to get started
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              Add {tabs.find(t => t.id === activeTab)?.label.slice(0, -1)}
            </Button>
          </div>
        ) : (
          <LineItemList
            items={activeItems}
            trip={trip}
            onUpdate={onUpdateLineItem}
            onDelete={onDeleteLineItem}
          />
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <AddLineItemModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddItem}
          category={activeTab}
          trip={trip}
        />
      )}
    </div>
  )
}