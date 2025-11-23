'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'

// Dashboard-specific particles with data visualization theme
function DashboardParticle({
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
    // Smooth, data-like movement
    meshRef.current.position.y += Math.sin(time * 0.7 + position[0]) * 0.003
    meshRef.current.position.x += Math.cos(time * 0.5 + position[1]) * 0.002
    meshRef.current.rotation.x += 0.003
    meshRef.current.rotation.y += 0.004

    // Gentle pulse like data points
    const scale = 1 + Math.sin(time * 3 + position[0]) * 0.12
    meshRef.current.scale.setScalar(scale)
  })

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[0.05, 0]} />
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

// Dashboard geometric shapes - more structured
function DashboardGeometricShape({
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
    // Structured rotation
    meshRef.current.rotation.x += 0.004
    meshRef.current.rotation.y += 0.005
    meshRef.current.rotation.z += 0.003

    // Organized float pattern
    meshRef.current.position.y += Math.sin(time * 0.6 + position[0]) * 0.004
    meshRef.current.position.x += Math.cos(time * 0.45 + position[1]) * 0.003
  })

  const getGeometry = () => {
    switch (shape) {
      case 'box':
        return <boxGeometry args={[0.18, 0.18, 0.18]} />
      case 'tetrahedron':
        return <tetrahedronGeometry args={[0.14, 0]} />
      case 'octahedron':
        return <octahedronGeometry args={[0.14, 0]} />
    }
  }

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      {getGeometry()}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.35}
        roughness={0.35}
        metalness={0.75}
        transparent
        opacity={0.65}
      />
    </mesh>
  )
}

// Dashboard camera controller - professional feel
function DashboardCameraController() {
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

    // Professional, controlled camera movement
    camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.06
    camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.06
    camera.lookAt(0, 0, 0)
  })

  return null
}

// Dashboard lights - clean and professional
function DashboardAnimatedLight() {
  const lightRef = useRef<THREE.PointLight>(null)
  const lightRef2 = useRef<THREE.PointLight>(null)
  const lightRef3 = useRef<THREE.PointLight>(null)
  const shouldReduceMotion = useReducedMotion()

  useFrame((state) => {
    if (shouldReduceMotion) return

    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.45) * 3.5
      lightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.45) * 3.5
      lightRef.current.intensity = 0.7 + Math.sin(state.clock.elapsedTime * 3) * 0.25
    }

    if (lightRef2.current) {
      lightRef2.current.position.x = Math.cos(state.clock.elapsedTime * 0.35) * 4.5
      lightRef2.current.position.z = Math.sin(state.clock.elapsedTime * 0.35) * 4.5
      lightRef2.current.intensity = 0.5 + Math.sin(state.clock.elapsedTime * 2.5) * 0.2
    }

    if (lightRef3.current) {
      lightRef3.current.position.x = -Math.sin(state.clock.elapsedTime * 0.4) * 3
      lightRef3.current.position.z = -Math.cos(state.clock.elapsedTime * 0.4) * 3
      lightRef3.current.intensity = 0.4 + Math.cos(state.clock.elapsedTime * 3) * 0.15
    }
  })

  return (
    <>
      <pointLight ref={lightRef} intensity={0.7} color="#4f46e5" />
      <pointLight ref={lightRef2} intensity={0.5} color="#6366f1" />
      <pointLight ref={lightRef3} intensity={0.4} color="#7c3aed" />
      <ambientLight intensity={0.25} />
    </>
  )
}

// Dashboard scene
function DashboardScene() {
  const shouldReduceMotion = useReducedMotion()

  // Reduced particles for better performance
  const particles = Array.from({ length: shouldReduceMotion ? 15 : 40 }, () => {
    const colors = ['#4f46e5', '#6366f1', '#7c3aed', '#3b82f6']
    return {
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      color: colors[Math.floor(Math.random() * colors.length)],
    }
  })

  // Reduced shapes for better performance
  const shapes = Array.from({ length: shouldReduceMotion ? 2 : 4 }, () => {
    const colors = ['#4f46e5', '#6366f1', '#7c3aed']
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
      <DashboardCameraController />
      <DashboardAnimatedLight />
      {particles.map((particle, i) => (
        <DashboardParticle key={i} position={particle.position} color={particle.color} />
      ))}
      {shapes.map((shape, i) => (
        <DashboardGeometricShape
          key={i}
          position={shape.position}
          rotation={shape.rotation}
          color={shape.color}
          shape={shape.shape}
        />
      ))}
      <fog attach="fog" args={['#0a0a0a', 9, 22]} />
    </>
  )
}

// Dashboard Three.js background
export function DashboardThreeBackground() {
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
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background opacity-35" />
    )
  }

  return (
    <div className="fixed inset-0 -z-10 opacity-25 pointer-events-none">
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
        <DashboardScene />
      </Canvas>
    </div>
  )
}
