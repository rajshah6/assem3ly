'use client'

import { useState, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei'
import { AnimatedPart } from './AnimatedPart'

interface Part {
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
  geometry?: any
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

interface Step {
  stepId: number
  title: string
  description: string
  parts: Part[]
  assemblySequence: AnimationStep[]
  camera: {
    position: { x: number; y: number; z: number }
    lookAt: { x: number; y: number; z: number }
  }
  lighting: {
    ambient: { intensity: number }
    directional: { intensity: number; position: { x: number; y: number; z: number } }
  }
}

interface CumulativeSceneProps {
  steps: Step[]
  currentStep: number
  onStepChange?: (step: number) => void
  height?: string
}

/**
 * CumulativeScene - Renders all parts from previous steps + current step
 * Each step builds on top of the previous ones
 */
export function CumulativeScene({ 
  steps, 
  currentStep = 0, 
  onStepChange,
  height = "680px" 
}: CumulativeSceneProps) {
  const [animationKey, setAnimationKey] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const currentStepData = steps[currentStep]

  // Get all parts from steps 0 to currentStep (cumulative)
  const allParts = useMemo(() => {
    const partsMap = new Map<string, Part>()
    
    for (let i = 0; i <= currentStep; i++) {
      const step = steps[i]
      step.parts.forEach(part => {
        // Use part ID as key - later parts with same ID will override earlier ones
        partsMap.set(part.id, part)
      })
    }
    
    return Array.from(partsMap.values())
  }, [steps, currentStep])

  // Get only the parts that are NEW in the current step (for animation)
  const newPartsInCurrentStep = useMemo(() => {
    if (currentStep === 0) return currentStepData.parts.map(p => p.id)
    
    const previousPartIds = new Set<string>()
    for (let i = 0; i < currentStep; i++) {
      steps[i].parts.forEach(part => previousPartIds.add(part.id))
    }
    
    return currentStepData.parts
      .filter(part => !previousPartIds.has(part.id))
      .map(p => p.id)
  }, [steps, currentStep, currentStepData])

  const handleReplay = () => {
    setAnimationKey(prev => prev + 1)
    setIsPlaying(true)
  }

  // Get animations for a specific part (only from current step)
  const getAnimationsForPart = (partId: string) => {
    // Only animate if this part is new in the current step
    if (!newPartsInCurrentStep.includes(partId)) {
      return []
    }
    return currentStepData.assemblySequence.filter(anim => anim.targetId === partId)
  }

  // Calculate start delay for staggered animations
  const getStartDelay = (partId: string) => {
    if (!newPartsInCurrentStep.includes(partId)) return 0
    
    const partIndex = currentStepData.assemblySequence.findIndex(anim => anim.targetId === partId)
    return partIndex > 0 ? 0.5 * partIndex : 0
  }

  // Reset animation when step changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1)
    setIsPlaying(true)
  }, [currentStep])

  return (
    <div className="relative w-full bg-gradient-to-b from-gray-900 to-gray-800" style={{ height }}>
      <Canvas shadows key={animationKey}>
        {/* Camera from current step */}
        <PerspectiveCamera 
          makeDefault 
          position={[
            currentStepData.camera.position.x,
            currentStepData.camera.position.y,
            currentStepData.camera.position.z
          ]} 
        />

        {/* Lighting from current step */}
        <ambientLight intensity={currentStepData.lighting.ambient.intensity} />
        <directionalLight
          position={[
            currentStepData.lighting.directional.position.x,
            currentStepData.lighting.directional.position.y,
            currentStepData.lighting.directional.position.z
          ]}
          intensity={currentStepData.lighting.directional.intensity}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-0.5}
          shadow-camera-right={0.5}
          shadow-camera-top={0.5}
          shadow-camera-bottom={-0.5}
        />
        <pointLight position={[-0.2, 0.2, 0.2]} intensity={0.3} />

        {/* Grid helper */}
        <Grid
          args={[2, 2]}
          cellSize={0.05}
          cellThickness={0.5}
          cellColor="#6b7280"
          sectionSize={0.2}
          sectionThickness={1}
          sectionColor="#9ca3af"
          fadeDistance={3}
          fadeStrength={1}
          followCamera={false}
        />

        {/* Render ALL accumulated parts */}
        {allParts.map((part) => {
          const animations = getAnimationsForPart(part.id)
          const startDelay = isPlaying ? getStartDelay(part.id) : 0

          return (
            <AnimatedPart
              key={`${part.id}-${animationKey}`}
              part={part}
              animations={animations}
              startDelay={startDelay}
            />
          )
        })}

        {/* Camera Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={0.1}
          maxDistance={3}
          target={[
            currentStepData.camera.lookAt.x,
            currentStepData.camera.lookAt.y,
            currentStepData.camera.lookAt.z
          ]}
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white p-4 rounded-lg max-w-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">Step {currentStepData.stepId}</h2>
          <span className="text-sm text-gray-300">{currentStep + 1} / {steps.length}</span>
        </div>
        <h3 className="text-lg font-semibold mb-1">{currentStepData.title}</h3>
        <p className="text-sm text-gray-300 mb-4">{currentStepData.description}</p>
        <div className="text-sm space-y-1 mb-4">
          <p>🖱️ Click and drag to rotate</p>
          <p>🔍 Scroll to zoom</p>
          <p>⌨️ Right-click to pan</p>
        </div>
        <button
          onClick={handleReplay}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <span>🔄</span>
          Replay Step
        </button>
      </div>

      {/* Parts Count */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white p-4 rounded-lg">
        <h3 className="font-bold mb-2">Parts in Assembly</h3>
        <div className="text-sm space-y-1">
          <p><span className="text-gray-400">Total parts:</span> {allParts.length}</p>
          <p><span className="text-gray-400">New in this step:</span> {newPartsInCurrentStep.length}</p>
          <p><span className="text-gray-400">Animations:</span> {currentStepData.assemblySequence.length}</p>
        </div>
      </div>
    </div>
  )
}

