'use client'

import { useRef } from 'react'

export function LBracket() {
  const groupRef = useRef<any>()

  // Dimensions
  const longSide = 0.12    // Long arm (extends upward)
  const shortSide = 0.05   // Short arm (on ground)
  const thickness = 0.02   // Bracket thickness
  const width = 0.05       // Width/depth

  // Hole parameters
  const holeRadius = 0.006

  // Metal bracket color
  const bracketColor = "#C0C0C0"
  const holeColor = "#333333" // Darker color for holes

  return (
    <group ref={groupRef}>
      {/* Short arm (on ground) */}
      <mesh position={[shortSide / 2, thickness / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[shortSide, thickness, width]} />
        <meshStandardMaterial color={bracketColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Long arm (standing up from the short side) */}
      <mesh position={[thickness / 2, longSide / 2 + thickness / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[thickness, longSide, width]} />
        <meshStandardMaterial color={bracketColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Single mounting hole in the long arm (centered) */}
      <mesh
        position={[thickness / 2, longSide / 2 + thickness / 2, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[holeRadius, holeRadius, thickness * 1.2, 16]} />
        <meshStandardMaterial color={holeColor} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}
