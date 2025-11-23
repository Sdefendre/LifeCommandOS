'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  baseOpacity: number
  speedX: number
  speedY: number
  phase: number
}

interface ShootingStar {
  id: number
  x: number
  y: number
  len: number
  speed: number
  size: number
  angle: number
  opacity: number
  trailLength: number
}

export function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // Refs to hold mutable state without triggering re-renders
  const starsRef = useRef<Star[]>([])
  const shootingStarsRef = useRef<ShootingStar[]>([])
  const frameRef = useRef<number>(0)
  const lastShootingStarTimeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })
    if (!ctx) return

    let isVisible = true
    let lastFrameTime = 0
    const targetFPS = 30 // Limit to 30fps for better scroll performance
    const frameInterval = 1000 / targetFPS

    // Handle visibility changes
    const handleVisibilityChange = () => {
      isVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Handle resize
    const handleResize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
    }

    // Initialize background stars - reduced count for better performance
    const initStars = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isSmall = width < 640
      const count = shouldReduceMotion ? 15 : isSmall ? 40 : 80

      const newStars: Star[] = []
      for (let i = 0; i < count; i++) {
        newStars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.5, // 0.5-2.5px
          baseOpacity: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.5 + 0.1,
          speedX: (Math.random() - 0.5) * 0.2, // Slow drift
          speedY: (Math.random() - 0.5) * 0.2,
          phase: Math.random() * Math.PI * 2,
        })
      }
      starsRef.current = newStars
    }

    // Create a new shooting star
    const createShootingStar = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      // Random start position (mostly top/left)
      const startX = Math.random() * width
      const startY = Math.random() * height * 0.5

      // Calculate angle (generally moving down/right)
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5 // ~45 degrees +/-

      const speed = Math.random() * 10 + 15 // Fast!

      shootingStarsRef.current.push({
        id: Date.now() + Math.random(),
        x: startX,
        y: startY,
        len: 0,
        speed,
        size: Math.random() * 2 + 1,
        angle,
        opacity: 1,
        trailLength: Math.random() * 100 + 100,
      })
    }

    // Animation loop with frame rate limiting
    const animate = (time: number) => {
      if (!canvas || !ctx || !isVisible) {
        frameRef.current = requestAnimationFrame(animate)
        return
      }

      // Frame rate limiting
      const elapsed = time - lastFrameTime
      if (elapsed < frameInterval) {
        frameRef.current = requestAnimationFrame(animate)
        return
      }
      lastFrameTime = time - (elapsed % frameInterval)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw Stars
      starsRef.current.forEach((star) => {
        // Update position if motion allowed
        if (!shouldReduceMotion) {
          star.x += star.speedX
          star.y += star.speedY

          // Wrap around screen
          if (star.x < 0) star.x = canvas.width
          if (star.x > canvas.width) star.x = 0
          if (star.y < 0) star.y = canvas.height
          if (star.y > canvas.height) star.y = 0

          // Twinkle effect
          star.phase += 0.02
          star.opacity = star.baseOpacity + Math.sin(star.phase) * 0.1
        }

        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, star.opacity)})`
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Handle Shooting Stars (only if motion enabled)
      if (!shouldReduceMotion) {
        // Spawn new shooting star occasionally
        if (time - lastShootingStarTimeRef.current > Math.random() * 2000 + 2000) {
          createShootingStar()
          lastShootingStarTimeRef.current = time
        }

        // Update and draw shooting stars
        for (let i = shootingStarsRef.current.length - 1; i >= 0; i--) {
          const star = shootingStarsRef.current[i]

          star.x += Math.cos(star.angle) * star.speed
          star.y += Math.sin(star.angle) * star.speed
          star.len += star.speed

          // Fade out trail
          if (star.len > star.trailLength) {
            star.opacity -= 0.05
          }

          if (star.opacity <= 0 || star.x > canvas.width || star.y > canvas.height) {
            shootingStarsRef.current.splice(i, 1)
            continue
          }

          // Draw trail
          const tailX = star.x - Math.cos(star.angle) * Math.min(star.len, star.trailLength)
          const tailY = star.y - Math.sin(star.angle) * Math.min(star.len, star.trailLength)

          const gradient = ctx.createLinearGradient(star.x, star.y, tailX, tailY)
          gradient.addColorStop(0, `rgba(147, 197, 253, ${star.opacity})`) // Blueish head
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)') // Transparent tail

          ctx.beginPath()
          ctx.strokeStyle = gradient
          ctx.lineWidth = star.size
          ctx.lineCap = 'round'
          ctx.moveTo(star.x, star.y)
          ctx.lineTo(tailX, tailY)
          ctx.stroke()

          // Draw head glow
          ctx.beginPath()
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    // Initial setup
    handleResize()
    window.addEventListener('resize', handleResize)
    frameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      cancelAnimationFrame(frameRef.current)
    }
  }, [shouldReduceMotion])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 will-change-transform"
      style={{ background: 'transparent' }}
    />
  )
}
