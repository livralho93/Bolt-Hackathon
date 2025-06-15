import React from 'react'
import { DollarSign, TrendingUp } from 'lucide-react'
import type { TripWithDetails } from '../../types'

interface CostSummaryProps {
  trip: TripWithDetails
  userCosts: Record<string, number>
  currentUserId: string
}

export function CostSummary({ trip, userCosts, currentUserId }: CostSummaryProps) {
  const userTotal = userCosts[currentUserId] || 0
  const tripTotal = Object.values(userCosts).reduce((sum, cost) => sum + cost, 0)
  const itemCount = trip.lineItems.filter(item => item.cost && item.cost > 0).length

  return (
    <div className="bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-primary-900">Cost Summary</h3>
        </div>
        <div className="flex items-center gap-1 text-sm text-primary-700">
          <TrendingUp className="w-4 h-4" />
          {itemCount} cost item{itemCount !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-center p-4 bg-white rounded-lg border border-primary-100">
          <div className="text-2xl font-bold text-primary-900 mb-1">
            ${userTotal.toFixed(2)}
          </div>
          <div className="text-sm text-primary-700">Your total</div>
        </div>

        <div className="text-center p-4 bg-white rounded-lg border border-primary-100">
          <div className="text-2xl font-bold text-neutral-900 mb-1">
            ${tripTotal.toFixed(2)}
          </div>
          <div className="text-sm text-neutral-600">Trip total</div>
        </div>
      </div>

      {userTotal > 0 && (
        <div className="mt-4 text-center">
          <div className="text-xs text-primary-600 mb-2">
            Your share: {((userTotal / tripTotal) * 100).toFixed(1)}% of trip costs
          </div>
          <div className="w-full bg-primary-100 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((userTotal / tripTotal) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}