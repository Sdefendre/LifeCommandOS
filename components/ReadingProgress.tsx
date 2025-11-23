'use client'

import { useEffect, useRef } from 'react'

export function ReadingProgress() {
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    if (!progressRef.current) return

    let ticking = false
    let rafId: number | null = null

    const updateProgress = () => {
      if (!progressRef.current) return

      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const scrollableHeight = documentHeight - windowHeight
      const progressPercent = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0
      const clampedProgress = Math.min(100, Math.max(0, progressPercent))

      // Use CSS transform for GPU-accelerated animation
      progressRef.current.style.transform = `scaleX(${clampedProgress / 100})`
      progressRef.current.style.transformOrigin = 'left'

      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        rafId = window.requestAnimationFrame(updateProgress)
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateProgress() // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-border/20 z-50 overflow-hidden">
      <div
        ref={progressRef}
        className="h-full w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 will-change-transform"
        style={{ transform: 'scaleX(0)', transformOrigin: 'left' }}
      />
    </div>
  )
}
