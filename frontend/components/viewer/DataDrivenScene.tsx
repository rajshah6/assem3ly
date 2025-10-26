'use client'

import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei'
import { AnimatedPart } from './AnimatedPart'

interface SceneData {
  stepId: number
  title: string
  description: string
  parts: Array<{
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
    model: string
  }>
  assemblySequence: Array<{
    action: 'move' | 'rotate'
    targetId: string
    from?: { x: number; y: number; z: number }
    to?: { x: number; y: number; z: number }
    axis?: string
    angle?: number
    duration: number
  }>
  camera: {
    position: { x: number; y: number; z: number }
    lookAt: { x: number; y: number; z: number }
  }
  lighting: {
    ambient: { intensity: number }
    directional: { intensity: number; position: { x: number; y: number; z: number } }
  }
}

interface DataDrivenSceneProps {
  data: SceneData
  autoPlay?: boolean
}

/**
 * DataDrivenScene - Renders a complete 3D scene from JSON data
 */
export function DataDrivenScene({ data, autoPlay = true }: DataDrivenSceneProps) {
  const [animationKey, setAnimationKey] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)

  const handleReplay = () => {
    setAnimationKey(prev => prev + 1)
    setIsPlaying(true)
  }

  // Group animations by target part
  const getAnimationsForPart = (partId: string) => {
    return data.assemblySequence.filter(anim => anim.targetId === partId)
  }

  // Calculate start delay for staggered animations
  const getStartDelay = (partId: string) => {
    const partIndex = data.assemblySequence.findIndex(anim => anim.targetId === partId)
    return partIndex > 0 ? 0.5 * partIndex : 0
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Canvas shadows key={animationKey}>
        {/* Camera from JSON */}
        <PerspectiveCamera 
          makeDefault 
          position={[
            data.camera.position.x,
            data.camera.position.y,
            data.camera.position.z
          ]} 
        />

        {/* Lighting from JSON */}
        <ambientLight intensity={data.lighting.ambient.intensity} />
        <directionalLight
          position={[
            data.lighting.directional.position.x,
            data.lighting.directional.position.y,
            data.lighting.directional.position.z
          ]}
          intensity={data.lighting.directional.intensity}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-0.3}
          shadow-camera-right={0.3}
          shadow-camera-top={0.3}
          shadow-camera-bottom={-0.3}
        />
        <pointLight position={[-0.1, 0.1, 0.1]} intensity={0.3} />

        {/* Grid helper */}
        <Grid
          args={[0.5, 0.5]}
          cellSize={0.02}
          cellThickness={0.5}
          cellColor="#6b7280"
          sectionSize={0.1}
          sectionThickness={1}
          sectionColor="#9ca3af"
          fadeDistance={1}
          fadeStrength={1}
          followCamera={false}
        />

        {/* Render all parts with their animations */}
        {data.parts.map((part) => {
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
          minDistance={0.05}
          maxDistance={1.5}
          target={[
            data.camera.lookAt.x,
            data.camera.lookAt.y,
            data.camera.lookAt.z
          ]}
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white p-4 rounded-lg max-w-sm">
        <h2 className="text-xl font-bold mb-1">{data.title}</h2>
        <p className="text-sm text-gray-300 mb-4">{data.description}</p>
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
          Replay Assembly
        </button>
      </div>

      {/* Parts List */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white p-4 rounded-lg max-w-xs">
        <h3 className="font-bold mb-2">Parts Required</h3>
        <div className="text-sm space-y-2">
          {data.parts.map((part, index) => (
            <div key={part.id} className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-semibold">{part.name}</p>
                <p className="text-gray-400 text-xs">{part.type.replace(/_/g, ' ')}</p>
              </div>
              <span className="text-gray-400">×{part.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Assembly Progress */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white p-4 rounded-lg">
        <h3 className="font-bold mb-2">Step {data.stepId}</h3>
        <p className="text-sm text-gray-300">{data.assemblySequence.length} animations</p>
      </div>
    </div>
  )
}

