import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  textSuffix?: React.ReactNode
}

export function Logo({ className, showText = true, size = 'md', icon, textSuffix }: LogoProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const textClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  }

  return (
    <div className={cn('flex items-center gap-2 group select-none', className)}>
      <div className={cn('relative flex items-center justify-center', sizeClasses[size])}>
        {/* Outer glow/shield shape */}
        <div className="absolute inset-0 bg-primary/20 rounded-lg rotate-3 group-hover:rotate-6 transition-transform duration-150" />
        <div className="absolute inset-0 bg-primary rounded-lg -rotate-3 group-hover:-rotate-6 transition-transform duration-150 opacity-20" />

        {/* Main container */}
        <div className="relative w-full h-full bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
          {/* Inner detail - custom icon or default command prompt */}
          <div className="text-primary-foreground w-1/2 h-1/2 flex items-center justify-center">
            {icon || (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-full"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            )}
          </div>

          {/* Decorative element: Scanning line */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-500 ease-in-out" />
        </div>
      </div>

      {showText && (
        <div
          className={cn('font-bold tracking-tight leading-none flex flex-col', textClasses[size])}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-foreground">LifeCommandOS</span>
            {textSuffix}
          </div>
        </div>
      )}
    </div>
  )
}
