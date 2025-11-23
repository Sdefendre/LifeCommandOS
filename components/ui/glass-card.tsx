import * as React from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'hover' | 'heavy'
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'glass rounded-2xl transition-all duration-300',
          variant === 'hover' && 'glass-hover hover:scale-[1.02] cursor-pointer',
          variant === 'heavy' && 'bg-white/20 dark:bg-black/20 backdrop-blur-2xl border-white/30',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
GlassCard.displayName = 'GlassCard'

export { GlassCard }
