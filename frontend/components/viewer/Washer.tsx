'use client'

import { useRef } from 'react'

interface WasherProps {
  radius?: number
  thickness?: number
  color?: string
}

/**
 * Washer component - Creates a metal washer (torus/ring shape)
 */
export function Washer({ 
  radius = 0.01, 
  thickness = 0.002,
  color = "#AAAAAA" 
}: WasherProps) {
  const groupRef = useRef<any>()

  const innerRadius = radius * 0.4 // Hole in the middle
  const outerRadius = radius

  return (
    <group ref={groupRef}>
      {/* Washer body using torus geometry */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[innerRadius + (outerRadius - innerRadius) / 2, (outerRadius - innerRadius) / 2, 16, 32]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  )
}

