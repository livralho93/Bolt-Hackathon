import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}