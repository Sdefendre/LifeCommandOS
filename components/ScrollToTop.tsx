'use client'

import { useEffect, useState, useRef } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ticking = false
    let rafId: number | null = null

    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      const shouldShow = window.scrollY > 300

      if (shouldShow !== isVisible) {
        setIsVisible(shouldShow)

        // Use CSS transitions instead of Framer Motion for better performance
        if (buttonRef.current) {
          if (shouldShow) {
            buttonRef.current.style.opacity = '1'
            buttonRef.current.style.transform = 'scale(1)'
          } else {
            buttonRef.current.style.opacity = '0'
            buttonRef.current.style.transform = 'scale(0.8)'
          }
        }
      }
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        rafId = window.requestAnimationFrame(toggleVisibility)
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    toggleVisibility() // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [isVisible])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div
      ref={buttonRef}
      className="fixed z-50 transition-opacity duration-200 transition-transform duration-200 will-change-transform"
      style={{
        bottom: 'max(5.5rem, calc(env(safe-area-inset-bottom, 0px) + 5.5rem))',
        right: 'max(1.5rem, env(safe-area-inset-right, 0px) + 1.5rem)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.8)',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <Button
        onClick={scrollToTop}
        size="icon"
        className="rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-shadow min-h-[48px] min-w-[48px]"
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </Button>
    </div>
  )
}
