'use client'

import { useState, useEffect } from 'react'
import { CumulativeScene } from '@/components/viewer/CumulativeScene'

export default function CumulativeTestPage() {
  const [assemblyData, setAssemblyData] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load the example_all_data.json from backend
    fetch('/api/test-data')
      .then(res => res.json())
      .then(data => {
        setAssemblyData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading test data:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading assembly data...</div>
      </div>
    )
  }

  if (!assemblyData || !assemblyData.steps) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">No assembly data available</div>
      </div>
    )
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(assemblyData.steps.length - 1, prev + 1))
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-black/80 text-white p-6 border-b border-gray-700">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            {assemblyData.metadata?.productName || 'Assembly Instructions'}
          </h1>
          <p className="text-gray-300">
            Category: {assemblyData.metadata?.category || 'Unknown'}
          </p>
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="flex-1 relative">
        <CumulativeScene
          steps={assemblyData.steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          height="calc(100vh - 180px)"
        />
      </div>

      {/* Navigation Controls */}
      <div className="bg-black/80 text-white p-6 border-t border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              ← Previous Step
            </button>
            
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                Step {currentStep + 1} of {assemblyData.steps.length}
              </div>
              <div className="text-sm text-gray-400">
                {assemblyData.steps[currentStep]?.title}
              </div>
            </div>
            
            <button
              onClick={handleNextStep}
              disabled={currentStep === assemblyData.steps.length - 1}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              Next Step →
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / assemblyData.steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

