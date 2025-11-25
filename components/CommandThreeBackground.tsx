'use client'

import { useEffect, useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'

function ShootingStar() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!ref.current) return

    // Check if currently "active" (visible in the scene range)
    // We use z position as a flag: if z > -50, it's active in the scene
    if (ref.current.position.z > -50) {
      // Move the star (slower speed)
      ref.current.position.x -= 1
      ref.current.position.y -= 0.25

      // Reset if it goes off screen
      if (ref.current.position.x < -50 || ref.current.position.y < -50) {
        ref.current.position.z = -100 // Move to "inactive" holding z-depth
      }
    } else {
      // It's inactive, check for random spawn
      // 0.3% chance per frame (approx every 5-6 seconds at 60fps)
      if (Math.random() < 0.003) {
        const startX = 30 + Math.random() * 20
        const startY = 10 + Math.random() * 20
        const startZ = -10 - Math.random() * 20
        ref.current.position.set(startX, startY, startZ)

        // Align rotation with movement vector [-1, -0.25]
        ref.current.rotation.z = Math.atan2(-0.25, -1)
      }
    }
  })

  return (
    <mesh ref={ref} position={[0, 0, -100]}>
      {/* Long thin streak */}
      <boxGeometry args={[4, 0.05, 0.05]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
    </mesh>
  )
}

function GalaxyScene() {
  const starsRef = useRef<THREE.Group>(null)
  const shouldReduceMotion = useReducedMotion()

  useFrame((state) => {
    if (!starsRef.current || shouldReduceMotion) return

    // Slow rotation for the galaxy effect
    starsRef.current.rotation.y = state.clock.elapsedTime * 0.002
    starsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.02
  })

  return (
    <>
      <group ref={starsRef}>
        {/* Distant starfield */}
        <Stars radius={150} depth={100} count={3000} factor={4} saturation={0} fade speed={0.02} />
      </group>
      <ShootingStar />
    </>
  )
}

export function CommandThreeBackground() {
  const shouldReduceMotion = useReducedMotion()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  if (shouldReduceMotion) {
    return <div className="fixed inset-0 -z-10 bg-black" />
  }

  return (
    <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 45 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        frameloop={isVisible ? 'always' : 'never'}
        performance={{ min: 0.5 }}
      >
        <GalaxyScene />
      </Canvas>
    </div>
  )
}
