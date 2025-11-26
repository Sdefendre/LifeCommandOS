'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'

// Seeded random number generator for deterministic results
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Hero-specific floating particles with more intensity
function HeroParticle({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const shouldReduceMotion = useReducedMotion()

  useFrame((state) => {
    if (!meshRef.current || shouldReduceMotion) return

    const time = state.clock.elapsedTime
    // More dramatic floating around hero text
    meshRef.current.position.y += Math.sin(time * 1.0 + position[0]) * 0.005
    meshRef.current.position.x += Math.cos(time * 0.7 + position[1]) * 0.004
    meshRef.current.rotation.x += 0.006
    meshRef.current.rotation.y += 0.008

    // More pronounced pulse
    const scale = 1 + Math.sin(time * 4.5 + position[0]) * 0.2
    meshRef.current.scale.setScalar(scale)
  })

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[0.15, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  )
}

// Larger geometric shapes for hero
function HeroGeometricShape({
  position,
  rotation,
  color,
  shape,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  color: string
  shape: 'box' | 'tetrahedron' | 'octahedron'
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const shouldReduceMotion = useReducedMotion()

  useFrame((state) => {
    if (!meshRef.current || shouldReduceMotion) return

    const time = state.clock.elapsedTime
    meshRef.current.rotation.x += 0.008
    meshRef.current.rotation.y += 0.01
    meshRef.current.rotation.z += 0.006

    // Float around hero area
    meshRef.current.position.y += Math.sin(time * 0.8 + position[0]) * 0.006
    meshRef.current.position.x += Math.cos(time * 0.6 + position[1]) * 0.005
  })

  const getGeometry = () => {
    switch (shape) {
      case 'box':
        return <boxGeometry args={[0.3, 0.3, 0.3]} />
      case 'tetrahedron':
        return <tetrahedronGeometry args={[0.2, 0]} />
      case 'octahedron':
        return <octahedronGeometry args={[0.2, 0]} />
    }
  }

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      {getGeometry()}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.9}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

// Hero camera controller - more responsive to mouse
function HeroCameraController() {
  const { camera, size } = useThree()
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / size.width) * 2 - 1,
        y: -(e.clientY / size.height) * 2 + 1,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [size, shouldReduceMotion])

  useFrame(() => {
    if (shouldReduceMotion) return

    // More responsive camera movement for hero
    // eslint-disable-next-line react-hooks/immutability -- Camera mutation is standard Three.js pattern in useFrame
    camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.12
    camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.12
    camera.lookAt(0, 0, 0)
  })

  return null
}

// Enhanced lights for hero
function HeroAnimatedLight() {
  const lightRef = useRef<THREE.PointLight>(null)
  const lightRef2 = useRef<THREE.PointLight>(null)
  const lightRef3 = useRef<THREE.PointLight>(null)
  const shouldReduceMotion = useReducedMotion()

  useFrame((state) => {
    if (shouldReduceMotion) return

    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.6) * 4
      lightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.6) * 4
      lightRef.current.intensity = 1.2 + Math.sin(state.clock.elapsedTime * 3.5) * 0.4
    }

    if (lightRef2.current) {
      lightRef2.current.position.x = Math.cos(state.clock.elapsedTime * 0.5) * 5
      lightRef2.current.position.z = Math.sin(state.clock.elapsedTime * 0.5) * 5
      lightRef2.current.intensity = 0.7 + Math.sin(state.clock.elapsedTime * 3) * 0.3
    }

    if (lightRef3.current) {
      lightRef3.current.position.x = -Math.sin(state.clock.elapsedTime * 0.55) * 4
      lightRef3.current.position.z = -Math.cos(state.clock.elapsedTime * 0.55) * 4
      lightRef3.current.intensity = 0.7 + Math.cos(state.clock.elapsedTime * 3.2) * 0.3
    }
  })

  return (
    <>
      <pointLight ref={lightRef} intensity={1.2} color="#4f46e5" />
      <pointLight ref={lightRef2} intensity={0.7} color="#7c3aed" />
      <pointLight ref={lightRef3} intensity={0.7} color="#6366f1" />
      <ambientLight intensity={0.4} />
    </>
  )
}

// Hero scene
function HeroScene() {
  const shouldReduceMotion = useReducedMotion()

  // Reduced particles for better performance
  // Using useMemo with seeded random for deterministic, stable results
  const particles = useMemo(() => {
    const colors = ['#4f46e5', '#7c3aed', '#6366f1', '#3b82f6', '#8b5cf6']
    const count = shouldReduceMotion ? 20 : 60
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (seededRandom(i * 3) - 0.5) * 12,
        (seededRandom(i * 3 + 1) - 0.5) * 8, // More vertical spread
        (seededRandom(i * 3 + 2) - 0.5) * 12,
      ] as [number, number, number],
      color: colors[Math.floor(seededRandom(i * 4) * colors.length)],
    }))
  }, [shouldReduceMotion])

  // Reduced shapes for better performance
  const shapes = useMemo(() => {
    const colors = ['#4f46e5', '#7c3aed', '#6366f1', '#8b5cf6']
    const shapeTypes: ('box' | 'tetrahedron' | 'octahedron')[] = [
      'box',
      'tetrahedron',
      'octahedron',
    ]
    const count = shouldReduceMotion ? 3 : 6
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (seededRandom(i * 6 + 100) - 0.5) * 10,
        (seededRandom(i * 6 + 101) - 0.5) * 6,
        (seededRandom(i * 6 + 102) - 0.5) * 10,
      ] as [number, number, number],
      rotation: [
        seededRandom(i * 6 + 103) * Math.PI,
        seededRandom(i * 6 + 104) * Math.PI,
        seededRandom(i * 6 + 105) * Math.PI,
      ] as [number, number, number],
      color: colors[Math.floor(seededRandom(i * 7 + 200) * colors.length)],
      shape: shapeTypes[Math.floor(seededRandom(i * 7 + 201) * shapeTypes.length)],
    }))
  }, [shouldReduceMotion])

  return (
    <>
      <HeroCameraController />
      <HeroAnimatedLight />
      {particles.map((particle, i) => (
        <HeroParticle key={i} position={particle.position} color={particle.color} />
      ))}
      {shapes.map((shape, i) => (
        <HeroGeometricShape
          key={i}
          position={shape.position}
          rotation={shape.rotation}
          color={shape.color}
          shape={shape.shape}
        />
      ))}
      <fog attach="fog" args={['#0a0a0a', 10, 25]} />
    </>
  )
}

// Hero-specific Three.js background
export function HeroThreeBackground() {
  const shouldReduceMotion = useReducedMotion()
  const [isVisible, setIsVisible] = useState(true)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Delay loading Three.js to prioritize content rendering
    const timer = setTimeout(() => setIsReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Pause animations when page is not visible
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Show gradient fallback while loading or for reduced motion
  if (shouldReduceMotion || !isReady) {
    return (
      <div className="fixed inset-0 z-[1] bg-gradient-to-b from-primary/20 via-transparent to-transparent pointer-events-none" />
    )
  }

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        dpr={[1, 2]}
        frameloop={isVisible ? 'always' : 'never'}
      >
        <HeroScene />
      </Canvas>
    </div>
  )
}
