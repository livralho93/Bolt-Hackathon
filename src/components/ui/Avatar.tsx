import React from 'react'
import { clsx } from 'clsx'

interface AvatarProps {
  src?: string | null
  alt?: string
  name?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const colorClasses = [
  'bg-primary-500',
  'bg-secondary-500', 
  'bg-accent-500',
  'bg-emerald-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getColorClass(name: string): string {
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colorClasses[index % colorClasses.length]
}

export function Avatar({ src, alt, name, size = 'md', className }: AvatarProps) {
  const displayName = name || alt || 'User'
  const initials = getInitials(displayName)
  const colorClass = getColorClass(displayName)

  if (src) {
    return (
      <img
        src={src}
        alt={alt || displayName}
        className={clsx(
          'avatar',
          {
            'avatar-sm': size === 'sm',
            'avatar-md': size === 'md',
            'avatar-lg': size === 'lg',
            'avatar-xl': size === 'xl',
          },
          className
        )}
      />
    )
  }

  return (
    <div
      className={clsx(
        'avatar',
        colorClass,
        {
          'avatar-sm': size === 'sm',
          'avatar-md': size === 'md',
          'avatar-lg': size === 'lg',
          'avatar-xl': size === 'xl',
        },
        className
      )}
    >
      {initials}
    </div>
  )
}