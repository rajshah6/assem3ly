'use client'

import { CumulativeScene } from './CumulativeScene'

interface Step {
  stepId?: number
  title?: string
  description?: string
  parts?: any[]
  tools?: any[]
  sceneJson?: any
  assemblySequence?: any[]
  camera?: any
  lighting?: any
}

interface AssemblyViewerProps {
  steps?: Step[]
  currentStep?: number
  onStepChange?: (step: number) => void
  height?: string
}

/**
 * Main 3D Assembly Viewer Component
 * Displays parts in an interactive 3D environment with cumulative rendering
 */
function AssemblyViewer({ steps = [], currentStep = 0, onStepChange, height = "680px" }: AssemblyViewerProps = {}) {
  // If steps data is valid, use CumulativeScene
  if (steps.length > 0 && steps[0].assemblySequence !== undefined) {
    return (
      <CumulativeScene 
        steps={steps as any}
        currentStep={currentStep}
        onStepChange={onStepChange}
        height={height}
      />
    )
  }

  // Fallback: Simple placeholder
  return (
    <div className="relative w-full bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center" style={{ height }}>
      <div className="text-white text-center">
        <p className="text-lg">No assembly steps available</p>
        <p className="text-sm text-gray-400 mt-2">Waiting for data...</p>
      </div>
    </div>
  )
}

export default AssemblyViewer
