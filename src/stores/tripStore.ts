import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Trip, TripWithDetails, LineItem } from '../types'

interface TripState {
  trips: Trip[]
  currentTrip: TripWithDetails | null
  loading: boolean
  
  // Trip management (Mimi's section)
  fetchTrips: () => Promise<void>
  createTrip: (trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{ trip?: Trip; error?: string }>
  fetchTripDetails: (tripId: string) => Promise<void>
  
  // Line item management (Avril's section)
  addLineItem: (lineItem: Omit<LineItem, 'id' | 'createdAt' | 'updatedAt' | 'orderIndex'>) => Promise<{ error?: string }>
  updateLineItem: (id: string, updates: Partial<LineItem>) => Promise<{ error?: string }>
  deleteLineItem: (id: string) => Promise<{ error?: string }>
  reorderLineItems: (category: LineItem['category'], itemIds: string[]) => Promise<{ error?: string }>
  
  // Participant management (Emily's section)
  inviteParticipant: (tripId: string, email: string) => Promise<{ error?: string }>
  updateParticipantDates: (tripId: string, userId: string, startDate: string, endDate: string) => Promise<{ error?: string }>
  
  // Cost calculations (Emily's section)
  calculateParticipantCosts: (tripId: string) => Record<string, number>
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  currentTrip: null,
  loading: false,

  fetchTrips: async () => {
    try {
      set({ loading: true })
      
      const { data: trips, error } = await supabase
        .from('trips')
        .select(`
          *,
          trip_participants!inner(user_id)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      set({ trips: trips || [], loading: false })
    } catch (error) {
      console.error('Error fetching trips:', error)
      set({ loading: false })
    }
  },

  createTrip: async (tripData) => {
    try {
      const { data: trip, error } = await supabase
        .from('trips')
        .insert(tripData)
        .select()
        .single()

      if (error) return { error: error.message }

      // Add creator as owner participant
      await supabase
        .from('trip_participants')
        .insert({
          trip_id: trip.id,
          user_id: tripData.createdBy,
          role: 'owner',
          start_date: tripData.startDate,
          end_date: tripData.endDate,
        })

      // Update local state
      set(state => ({
        trips: [trip, ...state.trips]
      }))

      return { trip }
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  },

  fetchTripDetails: async (tripId: string) => {
    try {
      set({ loading: true })

      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .select(`
          *,
          trip_participants(
            *,
            profiles(*)
          ),
          line_items(
            *,
            profiles!line_items_assigned_to_fkey(*),
            line_item_participants(
              profiles(*)
            )
          )
        `)
        .eq('id', tripId)
        .single()

      if (tripError) throw tripError

      // Transform the data to match our types
      const tripWithDetails: TripWithDetails = {
        ...trip,
        participants: trip.trip_participants.map(tp => ({
          id: tp.id,
          tripId: tp.trip_id,
          userId: tp.user_id,
          startDate: tp.start_date,
          endDate: tp.end_date,
          role: tp.role,
          joinedAt: tp.joined_at,
          user: tp.profiles ? {
            id: tp.profiles.id,
            email: tp.profiles.email,
            fullName: tp.profiles.full_name,
            phone: tp.profiles.phone,
            avatarUrl: tp.profiles.avatar_url,
          } : undefined,
        })),
        lineItems: trip.line_items.map(li => ({
          id: li.id,
          tripId: li.trip_id,
          category: li.category,
          title: li.title,
          description: li.description,
          date: li.date,
          location: li.location,
          cost: li.cost,
          assignedTo: li.assigned_to,
          createdBy: li.created_by,
          orderIndex: li.order_index,
          createdAt: li.created_at,
          updatedAt: li.updated_at,
          assignedUser: li.profiles ? {
            id: li.profiles.id,
            email: li.profiles.email,
            fullName: li.profiles.full_name,
            phone: li.profiles.phone,
            avatarUrl: li.profiles.avatar_url,
          } : undefined,
          participants: li.line_item_participants.map(lip => ({
            id: lip.profiles.id,
            email: lip.profiles.email,
            fullName: lip.profiles.full_name,
            phone: lip.profiles.phone,
            avatarUrl: lip.profiles.avatar_url,
          })),
        })),
      }

      set({ currentTrip: tripWithDetails, loading: false })
    } catch (error) {
      console.error('Error fetching trip details:', error)
      set({ loading: false })
    }
  },

  addLineItem: async (lineItemData) => {
    try {
      const { currentTrip } = get()
      if (!currentTrip) return { error: 'No current trip' }

      // Get the next order index for this category
      const categoryItems = currentTrip.lineItems.filter(item => item.category === lineItemData.category)
      const nextOrderIndex = Math.max(...categoryItems.map(item => item.orderIndex), -1) + 1

      const { data: lineItem, error } = await supabase
        .from('line_items')
        .insert({
          ...lineItemData,
          order_index: nextOrderIndex,
        })
        .select()
        .single()

      if (error) return { error: error.message }

      // Refresh trip details to get updated data
      await get().fetchTripDetails(currentTrip.id)

      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  },

  updateLineItem: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('line_items')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) return { error: error.message }

      // Refresh current trip if it's loaded
      const { currentTrip } = get()
      if (currentTrip) {
        await get().fetchTripDetails(currentTrip.id)
      }

      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  },

  deleteLineItem: async (id) => {
    try {
      const { error } = await supabase
        .from('line_items')
        .delete()
        .eq('id', id)

      if (error) return { error: error.message }

      // Refresh current trip if it's loaded
      const { currentTrip } = get()
      if (currentTrip) {
        await get().fetchTripDetails(currentTrip.id)
      }

      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  },

  reorderLineItems: async (category, itemIds) => {
    try {
      // Update order_index for each item
      const updates = itemIds.map((id, index) => 
        supabase
          .from('line_items')
          .update({ order_index: index })
          .eq('id', id)
      )

      await Promise.all(updates)

      // Refresh current trip
      const { currentTrip } = get()
      if (currentTrip) {
        await get().fetchTripDetails(currentTrip.id)
      }

      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  },

  inviteParticipant: async (tripId, email) => {
    try {
      // Generate invite token
      const token = crypto.randomUUID()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

      const { error } = await supabase
        .from('trip_invites')
        .insert({
          trip_id: tripId,
          email,
          token,
          expires_at: expiresAt.toISOString(),
          created_by: '', // This will be set by the calling component
        })

      if (error) return { error: error.message }

      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  },

  updateParticipantDates: async (tripId, userId, startDate, endDate) => {
    try {
      const { error } = await supabase
        .from('trip_participants')
        .update({
          start_date: startDate,
          end_date: endDate,
        })
        .eq('trip_id', tripId)
        .eq('user_id', userId)

      if (error) return { error: error.message }

      // Refresh current trip
      await get().fetchTripDetails(tripId)

      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  },

  calculateParticipantCosts: (tripId) => {
    const { currentTrip } = get()
    if (!currentTrip || currentTrip.id !== tripId) return {}

    const costs: Record<string, number> = {}

    // Initialize costs for all participants
    currentTrip.participants.forEach(participant => {
      costs[participant.userId] = 0
    })

    // Calculate costs from line items
    currentTrip.lineItems.forEach(item => {
      if (item.cost && item.participants && item.participants.length > 0) {
        const costPerPerson = item.cost / item.participants.length
        item.participants.forEach(participant => {
          costs[participant.id] = (costs[participant.id] || 0) + costPerPerson
        })
      }
    })

    return costs
  },
}))