import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mountain, LogOut, User } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'

export function Header() {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Mountain className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-neutral-900">AI Itinerary</span>
          </Link>

          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar 
                  src={user.avatarUrl} 
                  name={user.fullName || user.email}
                  size="sm"
                />
                <span className="text-sm font-medium text-neutral-700 hidden sm:block">
                  {user.fullName || user.email}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/profile')}
                  className="p-2"
                >
                  <User className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="p-2"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}