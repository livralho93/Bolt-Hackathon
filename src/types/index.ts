export interface User {
  id: string
  email: string
  fullName: string | null
  phone: string | null
  avatarUrl: string | null
}

export interface Trip {
  id: string
  name: string
  startDate: string
  endDate: string
  imageUrl: string | null
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface TripParticipant {
  id: string
  tripId: string
  userId: string
  startDate: string | null
  endDate: string | null
  role: 'owner' | 'participant'
  joinedAt: string
  user?: User
}

export interface LineItem {
  id: string
  tripId: string
  category: 'accommodation' | 'activity' | 'meal'
  title: string
  description: string | null
  date: string | null
  location: string | null
  cost: number | null
  assignedTo: string | null
  createdBy: string
  orderIndex: number
  createdAt: string
  updatedAt: string
  participants?: User[]
  assignedUser?: User
}

export interface TripInvite {
  id: string
  tripId: string
  email: string
  token: string
  expiresAt: string
  usedAt: string | null
  createdBy: string
  createdAt: string
}

export interface TripWithDetails extends Trip {
  participants: TripParticipant[]
  lineItems: LineItem[]
  userRole?: 'owner' | 'participant'
}