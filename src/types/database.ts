export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          name: string
          start_date: string
          end_date: string
          image_url: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          start_date: string
          end_date: string
          image_url?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          start_date?: string
          end_date?: string
          image_url?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      trip_participants: {
        Row: {
          id: string
          trip_id: string
          user_id: string
          start_date: string | null
          end_date: string | null
          role: 'owner' | 'participant'
          joined_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          user_id: string
          start_date?: string | null
          end_date?: string | null
          role?: 'owner' | 'participant'
          joined_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          user_id?: string
          start_date?: string | null
          end_date?: string | null
          role?: 'owner' | 'participant'
          joined_at?: string
        }
      }
      line_items: {
        Row: {
          id: string
          trip_id: string
          category: 'accommodation' | 'activity' | 'meal'
          title: string
          description: string | null
          date: string | null
          location: string | null
          cost: number | null
          assigned_to: string | null
          created_by: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          category: 'accommodation' | 'activity' | 'meal'
          title: string
          description?: string | null
          date?: string | null
          location?: string | null
          cost?: number | null
          assigned_to?: string | null
          created_by: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          category?: 'accommodation' | 'activity' | 'meal'
          title?: string
          description?: string | null
          date?: string | null
          location?: string | null
          cost?: number | null
          assigned_to?: string | null
          created_by?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      line_item_participants: {
        Row: {
          id: string
          line_item_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          line_item_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          line_item_id?: string
          user_id?: string
          created_at?: string
        }
      }
      trip_invites: {
        Row: {
          id: string
          trip_id: string
          email: string
          token: string
          expires_at: string
          used_at: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          trip_id: string
          email: string
          token: string
          expires_at: string
          used_at?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          trip_id?: string
          email?: string
          token?: string
          expires_at?: string
          used_at?: string | null
          created_by?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}