'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'

// Floating particle component
function Particle({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const shouldReduceMotion = useReducedMotion()

  useFrame((state) => {
    if (!meshRef.current || shouldReduceMotion) return

    // Float animation - more organic movement
    const time = state.clock.elapsedTime
    meshRef.current.position.y += Math.sin(time * 0.5 + position[0]) * 0.002
    meshRef.current.position.x += Math.cos(time * 0.3 + position[1]) * 0.001
    meshRef.current.rotation.x += 0.002
    meshRef.current.rotation.y += 0.003

    // Pulse animation with varied timing
    const scale = 1 + Math.sin(time * 2.5 + position[0]) * 0.15
    meshRef.current.scale.setScalar(scale)
  })

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[0.06, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.9}
      />
    </mesh>
  )
}

// Floating geometric shapes
function GeometricShape({
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

    // Slow rotation with varied speeds
    meshRef.current.rotation.x += 0.003
    meshRef.current.rotation.y += 0.004
    meshRef.current.rotation.z += 0.002

    // Float up and down with circular motion
    meshRef.current.position.y += Math.sin(time * 0.4 + position[0]) * 0.003
    meshRef.current.position.x += Math.cos(time * 0.3 + position[1]) * 0.002
  })

  const getGeometry = () => {
    switch (shape) {
      case 'box':
        return <boxGeometry args={[0.2, 0.2, 0.2]} />
      case 'tetrahedron':
        return <tetrahedronGeometry args={[0.15, 0]} />
      case 'octahedron':
        return <octahedronGeometry args={[0.15, 0]} />
    }
  }

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      {getGeometry()}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        roughness={0.3}
        metalness={0.8}
        transparent
        opacity={0.7}
      />
    </mesh>
  )
}

// Camera controller for mouse interaction
function CameraController() {
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

    // Smooth camera movement following mouse
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05
    camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })

  return null
}

// Animated light source
function AnimatedLight() {
  const lightRef = useRef<THREE.PointLight>(null)
  const lightRef2 = useRef<THREE.PointLight>(null)
  const lightRef3 = useRef<THREE.PointLight>(null)
  const shouldReduceMotion = useReducedMotion()

  useFrame((state) => {
    if (shouldReduceMotion) return

    // Move lights in circular patterns
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 3
      lightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.3) * 3
      lightRef.current.intensity = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.3
    }

    if (lightRef2.current) {
      lightRef2.current.position.x = Math.cos(state.clock.elapsedTime * 0.2) * 4
      lightRef2.current.position.z = Math.sin(state.clock.elapsedTime * 0.2) * 4
      lightRef2.current.intensity = 0.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2
    }

    if (lightRef3.current) {
      lightRef3.current.position.x = -Math.sin(state.clock.elapsedTime * 0.25) * 3
      lightRef3.current.position.z = -Math.cos(state.clock.elapsedTime * 0.25) * 3
      lightRef3.current.intensity = 0.5 + Math.cos(state.clock.elapsedTime * 1.8) * 0.2
    }
  })

  return (
    <>
      <pointLight ref={lightRef} intensity={1} color="#4f46e5" />
      <pointLight ref={lightRef2} intensity={0.5} color="#7c3aed" />
      <pointLight ref={lightRef3} intensity={0.5} color="#6366f1" />
      <ambientLight intensity={0.3} />
    </>
  )
}

// Main scene component
function Scene() {
  const shouldReduceMotion = useReducedMotion()

  // Create particles
  const particles = Array.from({ length: shouldReduceMotion ? 20 : 80 }, (_, i) => {
    const colors = ['#4f46e5', '#7c3aed', '#6366f1', '#3b82f6'] // Indigo, violet, indigo, blue
    return {
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      color: colors[Math.floor(Math.random() * colors.length)],
    }
  })

  // Create geometric shapes
  const shapes = Array.from({ length: shouldReduceMotion ? 3 : 8 }, (_, i) => {
    const colors = ['#4f46e5', '#7c3aed', '#6366f1'] // Indigo, violet, blue
    const shapeTypes: ('box' | 'tetrahedron' | 'octahedron')[] = [
      'box',
      'tetrahedron',
      'octahedron',
    ]
    return {
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
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
      <CameraController />
      <AnimatedLight />
      {particles.map((particle, i) => (
        <Particle key={i} position={particle.position} color={particle.color} />
      ))}
      {shapes.map((shape, i) => (
        <GeometricShape
          key={i}
          position={shape.position}
          rotation={shape.rotation}
          color={shape.color}
          shape={shape.shape}
        />
      ))}
      <fog attach="fog" args={['#0a0a0a', 8, 20]} />
    </>
  )
}

// Main component
export function ThreeBackground() {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    // Fallback to static gradient for users with reduced motion preference
    return (
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background opacity-40" />
    )
  }

  return (
    <div className="fixed inset-0 -z-10 opacity-40 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
