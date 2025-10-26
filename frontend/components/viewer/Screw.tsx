'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

interface ScrewProps {
  animated?: boolean
  animationDuration?: number
}

/**
 * Screw component - Creates a flathead screw with optional insertion animation
 * Based on the dimensions from example_data.json
 */
export function Screw({ animated = false, animationDuration = 3.0 }: ScrewProps) {
  const groupRef = useRef<Group>(null)
  const animationProgress = useRef(0)
  const isAnimating = useRef(animated)

  // Dimensions from example_data.json
  const shaftLength = 0.04
  const shaftRadius = 0.004
  const headRadius = shaftRadius * 2
  const headHeight = 0.003

  // Animation parameters
  const startOffset = 0.08 // Start position away from hole
  const rotations = 8 // Number of full rotations during insertion

  // Metal screw color
  const screwColor = "#777777"

  useEffect(() => {
    if (animated) {
      animationProgress.current = 0
      isAnimating.current = true
    }
  }, [animated])

  useFrame((state, delta) => {
    if (groupRef.current && isAnimating.current) {
      // Update animation progress
      animationProgress.current += delta / animationDuration

      if (animationProgress.current >= 1) {
        animationProgress.current = 1
        isAnimating.current = false
      }

      // Ease-in-out function for smooth animation
      const easeProgress = animationProgress.current < 0.5
        ? 2 * animationProgress.current * animationProgress.current
        : 1 - Math.pow(-2 * animationProgress.current + 2, 2) / 2

      // Animate position (moving into the hole)
      groupRef.current.position.x = startOffset * (1 - easeProgress)

      // Animate rotation (screwing motion)
      groupRef.current.rotation.x = easeProgress * rotations * Math.PI * 2
    }
  })

  return (
    <group ref={groupRef}>
      {/* Screw shaft (cylinder) */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[shaftRadius, shaftRadius, shaftLength, 16]} />
        <meshStandardMaterial color={screwColor} metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Flathead (wider cylinder) */}
      <mesh position={[shaftLength / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[headRadius, headRadius, headHeight, 16]} />
        <meshStandardMaterial color={screwColor} metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Screw head slot (small indentation) */}
      <mesh position={[shaftLength / 2 + headHeight / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.001, shaftRadius * 1.5, headRadius * 1.5]} />
        <meshStandardMaterial color="#555555" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Pointed tip (cone) */}
      <mesh position={[-shaftLength / 2 - 0.002, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <coneGeometry args={[shaftRadius * 0.8, 0.004, 8]} />
        <meshStandardMaterial color={screwColor} metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  )
}

