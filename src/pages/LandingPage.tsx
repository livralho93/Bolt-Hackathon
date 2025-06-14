import React from 'react'
import { Link } from 'react-router-dom'
import { Mountain, Users, Calendar, DollarSign } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Mountain className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-neutral-900">AI Itinerary</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-neutral-900 mb-6 text-balance">
            Plan Group Trips
            <span className="text-primary-600"> Together</span>
          </h1>
          <p className="text-xl text-neutral-600 mb-8 text-balance max-w-2xl mx-auto">
            Coordinate accommodations, activities, and expenses in one place. 
            No more spreadsheets, no more confusion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Create Your First Trip
              </Button>
            </Link>
            <Link to="/signin">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                I Have an Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-neutral-900 mb-12">
            Everything you need for group travel
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Invite Everyone
              </h3>
              <p className="text-neutral-600">
                Send invites via email or shareable link. Everyone can contribute to the planning.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Organize Everything
              </h3>
              <p className="text-neutral-600">
                Accommodations, activities, and meals all in one organized timeline.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Split Costs Fairly
              </h3>
              <p className="text-neutral-600">
                Automatic cost calculations show exactly what each person owes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to plan your next adventure?
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Join thousands of groups who've made trip planning effortless.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-neutral-50">
              Start Planning Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}