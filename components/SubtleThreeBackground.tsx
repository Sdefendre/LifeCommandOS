'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'

// Subtle floating particles for content pages
function SubtleParticle({
  position,
  color,
}: {
  position: [number, number, number]
  color: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const shouldReduceMotion = useReducedMotion()

  useFrame((state) => {
    if (!meshRef.current || shouldReduceMotion) return

    const time = state.clock.elapsedTime
    // Gentle floating movement
    meshRef.current.position.y += Math.sin(time * 0.5 + position[0]) * 0.002
    meshRef.current.position.x += Math.cos(time * 0.4 + position[1]) * 0.0015
    meshRef.current.rotation.x += 0.002
    meshRef.current.rotation.y += 0.003

    // Subtle pulse
    const scale = 1 + Math.sin(time * 2.5 + position[0]) * 0.1
    meshRef.current.scale.setScalar(scale)
  })

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[0.04, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        roughness={0.4}
        metalness={0.7}
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

// Subtle geometric shapes
function SubtleGeometricShape({
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
    // Very slow rotation
    meshRef.current.rotation.x += 0.0025
    meshRef.current.rotation.y += 0.003
    meshRef.current.rotation.z += 0.002

    // Gentle float
    meshRef.current.position.y += Math.sin(time * 0.4 + position[0]) * 0.003
    meshRef.current.position.x += Math.cos(time * 0.35 + position[1]) * 0.002
  })

  const getGeometry = () => {
    switch (shape) {
      case 'box':
        return <boxGeometry args={[0.15, 0.15, 0.15]} />
      case 'tetrahedron':
        return <tetrahedronGeometry args={[0.12, 0]} />
      case 'octahedron':
        return <octahedronGeometry args={[0.12, 0]} />
    }
  }

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      {getGeometry()}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        roughness={0.5}
        metalness={0.6}
        transparent
        opacity={0.5}
      />
    </mesh>
  )
}

// Subtle camera controller
function SubtleCameraController() {
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

    // Very subtle camera movement
    camera.position.x += (mouse.x * 0.2 - camera.position.x) * 0.05
    camera.position.y += (mouse.y * 0.2 - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })

  return null
}

// Subtle animated lights
function SubtleAnimatedLight() {
  const lightRef = useRef<THREE.PointLight>(null)
  const lightRef2 = useRef<THREE.PointLight>(null)
  const shouldReduceMotion = useReducedMotion()

  useFrame((state) => {
    if (shouldReduceMotion) return

    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.35) * 3
      lightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.35) * 3
      lightRef.current.intensity = 0.5 + Math.sin(state.clock.elapsedTime * 2.5) * 0.2
    }

    if (lightRef2.current) {
      lightRef2.current.position.x = Math.cos(state.clock.elapsedTime * 0.3) * 4
      lightRef2.current.position.z = Math.sin(state.clock.elapsedTime * 0.3) * 4
      lightRef2.current.intensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.15
    }
  })

  return (
    <>
      <pointLight ref={lightRef} intensity={0.5} color="#4f46e5" />
      <pointLight ref={lightRef2} intensity={0.3} color="#6366f1" />
      <ambientLight intensity={0.2} />
    </>
  )
}

// Subtle scene
function SubtleScene() {
  const shouldReduceMotion = useReducedMotion()

  // Reduced particles for better performance
  const particles = Array.from({ length: shouldReduceMotion ? 10 : 35 }, (_, i) => {
    const colors = ['#4f46e5', '#6366f1', '#7c3aed']
    return {
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
      ] as [number, number, number],
      color: colors[Math.floor(Math.random() * colors.length)],
    }
  })

  // Reduced shapes for better performance
  const shapes = Array.from({ length: shouldReduceMotion ? 2 : 3 }, (_, i) => {
    const colors = ['#4f46e5', '#6366f1']
    const shapeTypes: ('box' | 'tetrahedron' | 'octahedron')[] = [
      'box',
      'tetrahedron',
      'octahedron',
    ]
    return {
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [
        number,
        number,
        number,
      ],
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
    }
  })

  return (
    <>
      <SubtleCameraController />
      <SubtleAnimatedLight />
      {particles.map((particle, i) => (
        <SubtleParticle key={i} position={particle.position} color={particle.color} />
      ))}
      {shapes.map((shape, i) => (
        <SubtleGeometricShape
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

// Subtle Three.js background for content pages
export function SubtleThreeBackground() {
  const shouldReduceMotion = useReducedMotion()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Pause animations when page is not visible
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  if (shouldReduceMotion) {
    return (
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-30" />
    )
  }

  return (
    <div className="fixed inset-0 -z-10 opacity-20 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{
          alpha: true,
          antialias: false, // Disable antialiasing for better performance
          powerPreference: 'high-performance',
          stencil: false,
          depth: false,
        }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]} // Reduce DPR for better performance
        frameloop={isVisible ? 'always' : 'never'} // Pause when not visible
        performance={{ min: 0.5 }} // Allow frame drops for better scroll performance
      >
        <SubtleScene />
      </Canvas>
    </div>
  )
}
