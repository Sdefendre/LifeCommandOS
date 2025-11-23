'use client'

import { useReducedMotion } from 'framer-motion'

/**
 * MovingGradientBackground - A vibrant lava lamp style animated gradient background
 *
 * This component creates colorful, organic-moving blobs that flow like a lava lamp.
 * It adapts to light/dark mode and respects user motion preferences.
 */
export function MovingGradientBackground() {
  const shouldReduceMotion = useReducedMotion()

  // For users who prefer reduced motion, show a static gradient
  if (shouldReduceMotion) {
    return (
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#657832]/30 via-[#b4a078]/30 to-[#785a3c]/30" />
    )
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base background - lighter for better text visibility */}
      <div className="absolute inset-0 bg-background/80 dark:bg-background/90" />

      {/* Lava lamp blob 1 - Olive Green - Large, slow movement */}
      <div
        className="absolute rounded-full blur-[120px] opacity-30 dark:opacity-40"
        style={{
          width: '800px',
          height: '800px',
          left: '10%',
          top: '20%',
          background:
            'radial-gradient(circle, rgba(101, 120, 50, 0.6) 0%, rgba(120, 130, 60, 0.4) 30%, rgba(101, 120, 50, 0.3) 60%, transparent 80%)',
          animation: 'lava-blob-1 12s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* Lava lamp blob 2 - Khaki/Tan - Medium, medium speed */}
      <div
        className="absolute rounded-full blur-[120px] opacity-30 dark:opacity-40"
        style={{
          width: '700px',
          height: '700px',
          left: '70%',
          top: '30%',
          background:
            'radial-gradient(circle, rgba(180, 160, 120, 0.6) 0%, rgba(200, 180, 140, 0.4) 30%, rgba(180, 160, 120, 0.3) 60%, transparent 80%)',
          animation: 'lava-blob-2 10s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* Lava lamp blob 3 - Military Brown - Small, fast movement */}
      <div
        className="absolute rounded-full blur-[120px] opacity-25 dark:opacity-35"
        style={{
          width: '600px',
          height: '600px',
          left: '30%',
          top: '50%',
          background:
            'radial-gradient(circle, rgba(120, 90, 60, 0.6) 0%, rgba(140, 100, 70, 0.4) 30%, rgba(120, 90, 60, 0.3) 60%, transparent 80%)',
          animation: 'lava-blob-3 8s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* Lava lamp blob 4 - Dark Olive - Large, slow reverse */}
      <div
        className="absolute rounded-full blur-[120px] opacity-30 dark:opacity-40"
        style={{
          width: '750px',
          height: '750px',
          left: '50%',
          top: '10%',
          background:
            'radial-gradient(circle, rgba(80, 100, 40, 0.6) 0%, rgba(100, 120, 50, 0.4) 30%, rgba(80, 100, 40, 0.3) 60%, transparent 80%)',
          animation: 'lava-blob-4 11s ease-in-out infinite reverse',
          willChange: 'transform',
        }}
      />

      {/* Lava lamp blob 5 - Military Blue - Medium, medium reverse */}
      <div
        className="absolute rounded-full blur-[120px] opacity-25 dark:opacity-35"
        style={{
          width: '650px',
          height: '650px',
          left: '20%',
          top: '60%',
          background:
            'radial-gradient(circle, rgba(60, 80, 100, 0.6) 0%, rgba(70, 90, 110, 0.4) 30%, rgba(60, 80, 100, 0.3) 60%, transparent 80%)',
          animation: 'lava-blob-5 9s ease-in-out infinite reverse',
          willChange: 'transform',
        }}
      />

      {/* Lava lamp blob 6 - Olive/Khaki - Small, fast reverse */}
      <div
        className="absolute rounded-full blur-[120px] opacity-25 dark:opacity-35"
        style={{
          width: '550px',
          height: '550px',
          left: '80%',
          top: '40%',
          background:
            'radial-gradient(circle, rgba(110, 130, 70, 0.6) 0%, rgba(130, 150, 90, 0.4) 30%, rgba(110, 130, 70, 0.3) 60%, transparent 80%)',
          animation: 'lava-blob-6 7s ease-in-out infinite reverse',
          willChange: 'transform',
        }}
      />
    </div>
  )
}
