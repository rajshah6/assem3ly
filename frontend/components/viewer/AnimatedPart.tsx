'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Vector3, Euler } from 'three'
import { LBracket } from './LBracket'
import { Screw } from './Screw'
import { Washer } from './Washer'

interface PartData {
  id: string
  name: string
  type: string
  quantity: number
  dimensions: any
  material: string
  color: string
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
}

interface AnimationStep {
  action: 'move' | 'rotate'
  targetId: string
  from?: { x: number; y: number; z: number }
  to?: { x: number; y: number; z: number }
  axis?: string
  angle?: number
  duration: number
}

interface AnimatedPartProps {
  part: PartData
  animations?: AnimationStep[]
  startDelay?: number
  onAnimationComplete?: () => void
}

/**
 * AnimatedPart - Wraps any part and animates it based on animation sequence
 */
export function AnimatedPart({ 
  part, 
  animations = [], 
  startDelay = 0,
  onAnimationComplete 
}: AnimatedPartProps) {
  const groupRef = useRef<Group>(null)
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(-1)
  const animationProgress = useRef(0)
  const delayTimer = useRef(startDelay)
  const startPosition = useRef(new Vector3())
  const targetPosition = useRef(new Vector3())
  const startRotation = useRef(0)
  const targetRotation = useRef(0)
  const rotationAxis = useRef('x')

  useEffect(() => {
    if (animations.length > 0 && startDelay === 0) {
      setCurrentAnimationIndex(0)
    }
  }, [animations, startDelay])

  // Helper function to render geometry from JSON spec
  const renderGeometry = (geometry: any, color: string, material: string) => {
    const getMaterialProps = () => {
      if (material?.toLowerCase() === 'plastic') {
        return { metalness: 0.2, roughness: 0.7 }
      } else if (material?.toLowerCase() === 'metal') {
        return { metalness: 0.8, roughness: 0.3 }
      } else if (material?.toLowerCase() === 'wood') {
        return { metalness: 0.1, roughness: 0.9 }
      }
      return { metalness: 0.5, roughness: 0.5 }
    }

    const matProps = getMaterialProps()

    switch (geometry.type) {
      case 'box':
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={geometry.args} />
            <meshStandardMaterial color={color} {...matProps} />
          </mesh>
        )
      
      case 'cylinder':
        return (
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={geometry.args} />
            <meshStandardMaterial color={color} {...matProps} />
          </mesh>
        )
      
      case 'torus':
        return (
          <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={geometry.args} />
            <meshStandardMaterial color={color} {...matProps} />
          </mesh>
        )
      
      case 'sphere':
        return (
          <mesh castShadow receiveShadow>
            <sphereGeometry args={geometry.args} />
            <meshStandardMaterial color={color} {...matProps} />
          </mesh>
        )
      
      default:
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.02, 0.02, 0.02]} />
            <meshStandardMaterial color={color} {...matProps} />
          </mesh>
        )
    }
  }

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Handle delay before starting animation
    if (delayTimer.current > 0) {
      delayTimer.current -= delta
      if (delayTimer.current <= 0 && animations.length > 0) {
        setCurrentAnimationIndex(0)
      }
      return
    }

    // No active animation
    if (currentAnimationIndex < 0 || currentAnimationIndex >= animations.length) {
      return
    }

    const currentAnimation = animations[currentAnimationIndex]
    
    // Initialize animation
    if (animationProgress.current === 0) {
      if (currentAnimation.action === 'move' && currentAnimation.from && currentAnimation.to) {
        startPosition.current.set(currentAnimation.from.x, currentAnimation.from.y, currentAnimation.from.z)
        targetPosition.current.set(currentAnimation.to.x, currentAnimation.to.y, currentAnimation.to.z)
        groupRef.current.position.copy(startPosition.current)
      } else if (currentAnimation.action === 'rotate') {
        startRotation.current = 0
        targetRotation.current = ((currentAnimation.angle || 0) * Math.PI) / 180 // Convert to radians
        rotationAxis.current = currentAnimation.axis || 'x'
      }
    }

    // Update animation progress
    animationProgress.current += delta / currentAnimation.duration

    if (animationProgress.current >= 1) {
      animationProgress.current = 1
    }

    // Ease-in-out function
    const easeProgress = animationProgress.current < 0.5
      ? 2 * animationProgress.current * animationProgress.current
      : 1 - Math.pow(-2 * animationProgress.current + 2, 2) / 2

    // Apply animation
    if (currentAnimation.action === 'move' && currentAnimation.from && currentAnimation.to) {
      groupRef.current.position.lerpVectors(startPosition.current, targetPosition.current, easeProgress)
    } else if (currentAnimation.action === 'rotate') {
      const rotation = startRotation.current + (targetRotation.current - startRotation.current) * easeProgress
      if (rotationAxis.current === 'y') {
        groupRef.current.rotation.y = rotation
      } else if (rotationAxis.current === 'z') {
        groupRef.current.rotation.z = rotation
      } else {
        groupRef.current.rotation.x = rotation
      }
    }

    // Check if animation complete
    if (animationProgress.current >= 1) {
      animationProgress.current = 0
      
      if (currentAnimationIndex < animations.length - 1) {
        setCurrentAnimationIndex(currentAnimationIndex + 1)
      } else {
        setCurrentAnimationIndex(-1) // All animations complete
        if (onAnimationComplete) {
          onAnimationComplete()
        }
      }
    }
  })

  // Render the appropriate part based on type
  const renderPart = () => {
    const { type, dimensions, color, geometry } = part

    // If geometry is specified, use it directly
    if (geometry && geometry.type && geometry.args) {
      return renderGeometry(geometry, color, part.material)
    }

    // Otherwise, fall back to type-based rendering
    switch (type) {
      case 'metal_bracket':
      case 'l-bracket':
        return <LBracket />
      
      case 'metal_washer':
        return <Washer radius={dimensions.radius} thickness={dimensions.thickness} color={color} />
      
      case 'screw_flathead':
        const shaftLength = dimensions.length
        const shaftRadius = dimensions.radius
        const headRadius = shaftRadius * 2
        const headHeight = 0.003
        
        return (
          <group>
            {/* Screw shaft */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
              <cylinderGeometry args={[shaftRadius, shaftRadius, shaftLength, 16]} />
              <meshStandardMaterial color={color} metalness={0.9} roughness={0.3} />
            </mesh>
            
            {/* Flathead */}
            <mesh position={[shaftLength / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[headRadius, headRadius, headHeight, 16]} />
              <meshStandardMaterial color={color} metalness={0.9} roughness={0.3} />
            </mesh>
            
            {/* Screw slot */}
            <mesh position={[shaftLength / 2 + headHeight / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[0.001, shaftRadius * 1.5, headRadius * 1.5]} />
              <meshStandardMaterial color="#555555" metalness={0.9} roughness={0.2} />
            </mesh>
            
            {/* Pointed tip */}
            <mesh position={[-shaftLength / 2 - 0.002, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
              <coneGeometry args={[shaftRadius * 0.8, 0.004, 8]} />
              <meshStandardMaterial color={color} metalness={0.9} roughness={0.3} />
            </mesh>
          </group>
        )
      
      case 'block':
      case 'bracket':
      case 'plastic foot':
        // Mounting block/bracket - plastic or metal rectangular block
        const blockWidth = dimensions.width || 0.05
        const blockHeight = dimensions.height || 0.04
        const blockDepth = dimensions.depth || 0.03
        
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[blockWidth, blockHeight, blockDepth]} />
            <meshStandardMaterial 
              color={color} 
              metalness={part.material?.toLowerCase() === 'plastic' ? 0.2 : 0.7} 
              roughness={part.material?.toLowerCase() === 'plastic' ? 0.7 : 0.3}
            />
          </mesh>
        )
      
      case 'rail':
      case 'bar':
      case 'leg':
        // Long cylindrical or box parts
        const railLength = dimensions.width || dimensions.depth || 0.5
        const railThickness = 0.03
        
        return (
          <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[railThickness / 2, railThickness / 2, railLength, 16]} />
            <meshStandardMaterial 
              color={color} 
              metalness={part.material?.toLowerCase() === 'metal' ? 0.8 : 0.3} 
              roughness={0.3}
            />
          </mesh>
        )
      
      case 'screw':
      case 'bolt':
        // Generic screw/bolt (simple cylinder)
        const screwLength = dimensions.width || dimensions.depth || 0.04
        const screwRadius = 0.004
        
        return (
          <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[screwRadius, screwRadius, screwLength, 16]} />
            <meshStandardMaterial color={color} metalness={0.9} roughness={0.3} />
          </mesh>
        )
      
      case 'washer':
      case 'lock washer':
        // Simple washer using torus
        const washerRadius = dimensions.radius || 0.01
        const washerThickness = dimensions.thickness || 0.002
        
        return <Washer radius={washerRadius} thickness={washerThickness} color={color} />
      
      case 'nut':
        // Hexagonal nut (simplified as box for now)
        const nutSize = dimensions.width || 0.01
        
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[nutSize, nutSize * 0.5, nutSize]} />
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.3} />
          </mesh>
        )
      
      case 'panel':
        // Large flat panel (like table top)
        const panelWidth = dimensions.width || 1.0
        const panelHeight = 0.02 // Thin panel
        const panelDepth = dimensions.depth || 0.5
        
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[panelWidth, panelHeight, panelDepth]} />
            <meshStandardMaterial 
              color={color} 
              metalness={part.material?.toLowerCase() === 'wood' ? 0.1 : 0.3} 
              roughness={part.material?.toLowerCase() === 'wood' ? 0.9 : 0.5}
            />
          </mesh>
        )
      
      case 'flathead screw':
        // Already handled above
        const fhShaftLength = dimensions.length || dimensions.width || 0.04
        const fhShaftRadius = dimensions.radius || 0.004
        const fhHeadRadius = fhShaftRadius * 2
        const fhHeadHeight = 0.003
        
        return (
          <group>
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
              <cylinderGeometry args={[fhShaftRadius, fhShaftRadius, fhShaftLength, 16]} />
              <meshStandardMaterial color={color} metalness={0.9} roughness={0.3} />
            </mesh>
            <mesh position={[fhShaftLength / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[fhHeadRadius, fhHeadRadius, fhHeadHeight, 16]} />
              <meshStandardMaterial color={color} metalness={0.9} roughness={0.3} />
            </mesh>
          </group>
        )
      
      default:
        // Generic box for unknown types
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[
              dimensions.width || 0.02,
              dimensions.height || 0.02,
              dimensions.depth || 0.02
            ]} />
            <meshStandardMaterial color={color} />
          </mesh>
        )
    }
  }

  return (
    <group 
      ref={groupRef}
      position={[part.position.x, part.position.y, part.position.z]}
      rotation={[part.rotation.x, part.rotation.y, part.rotation.z]}
      scale={[part.scale.x, part.scale.y, part.scale.z]}
    >
      {renderPart()}
    </group>
  )
}

