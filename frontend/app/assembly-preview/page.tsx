'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CumulativeScene } from '@/components/viewer/CumulativeScene'

export default function AssemblyPreviewPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Initialize currentStep from URL query param or default to 0
  const [currentStep, setCurrentStep] = useState(() => {
    const stepParam = searchParams.get('step')
    return stepParam ? parseInt(stepParam, 10) : 0
  })
  const [assemblyData, setAssemblyData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/example_data_all_steps.json')
      .then(res => res.json())
      .then(data => {
        setAssemblyData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load assembly data:', err)
        setLoading(false)
      })
  }, [])

  // Update URL when step changes
  useEffect(() => {
    if (assemblyData && assemblyData.steps) {
      const validStep = Math.max(0, Math.min(currentStep, assemblyData.steps.length - 1))
      router.replace(`/assembly-preview?step=${validStep}`, { scroll: false })
    }
  }, [currentStep, assemblyData, router])

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading assembly data...</p>
        </div>
      </div>
    )
  }

  if (!assemblyData || !assemblyData.steps) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-xl">Failed to load assembly data</p>
          <p className="text-sm text-gray-400 mt-2">Please refresh the page</p>
        </div>
      </div>
    )
  }
  
  const steps = assemblyData.steps

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Step Navigation Bar */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between shadow-lg z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold">Assembly Preview</h1>
          <div className="text-sm text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
          >
            ← Previous
          </button>
          
          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="flex-1">
        <CumulativeScene 
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          height="100%"
        />
      </div>
    </div>
  )
}

