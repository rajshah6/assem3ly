// Example: How to use the PDF processor in your code
import 'dotenv/config'
import { processPDF, processSinglePage } from './src/gemini/processor'
import path from 'path'

// Example 1: Process entire PDF
async function processEntirePDF() {
  console.log('Example 1: Processing entire PDF\n')
  
  const pdfPath = path.join(__dirname, 'src/public/tommaryd-underframe-anthracite__AA-2169157-3-100.pdf')
  
  const result = await processPDF(pdfPath, {
    productName: 'TOMMARYD Underframe',
    category: 'Table',
    productDimensions: {
      width: 1.30,
      height: 0.70,
      depth: 0.70
    }
  })
  
  console.log(`✅ Extracted ${result.steps.length} steps`)
  
  // Access each step
  result.steps.forEach(step => {
    console.log(`\nStep ${step.stepId}: ${step.title}`)
    console.log(`  Description: ${step.description}`)
    console.log(`  Parts needed: ${step.parts.map(p => p.name).join(', ')}`)
    console.log(`  Assembly actions: ${step.assemblySequence.length}`)
    
    // Access 3D data
    console.log(`  Camera position:`, step.camera.position)
    console.log(`  First part:`, step.parts[0])
  })
  
  return result
}

// Example 2: Process single page (useful for testing)
async function processSinglePageExample() {
  console.log('\n\nExample 2: Processing single page\n')
  
  const pdfPath = path.join(__dirname, 'src/public/tommaryd-underframe-anthracite__AA-2169157-3-100.pdf')
  
  const step = await processSinglePage(pdfPath, 3, {
    productName: 'TOMMARYD Underframe'
  })
  
  if (step) {
    console.log(`✅ Extracted: ${step.title}`)
    console.log(`Parts:`, step.parts.map(p => p.name))
  } else {
    console.log('❌ No assembly step found on this page')
  }
  
  return step
}

// Example 3: Use in an API endpoint
import express from 'express'

function setupAPIExample() {
  const app = express()
  app.use(express.json())
  
  app.post('/api/manual/process', async (req, res) => {
    try {
      const { pdfPath, productInfo } = req.body
      
      const result = await processPDF(pdfPath, productInfo)
      
      res.json({
        success: true,
        steps: result.steps,
        totalSteps: result.steps.length
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  })
  
  return app
}

// Example 4: Access specific data from a step
function accessStepData(step: any) {
  console.log('\n\nExample 4: Accessing step data for 3D rendering\n')
  
  // Get all parts for rendering
  const partsForThreeJS = step.parts.map((part: any) => ({
    id: part.id,
    model: part.model,
    position: [part.position.x, part.position.y, part.position.z],
    rotation: [part.rotation.x, part.rotation.y, part.rotation.z],
    color: part.color
  }))
  
  console.log('Parts for Three.js:', partsForThreeJS)
  
  // Get animation sequence
  const animations = step.assemblySequence.map((action: any) => ({
    type: action.action,
    target: action.targetId,
    duration: action.duration,
    ...action
  }))
  
  console.log('Animations:', animations)
  
  return { parts: partsForThreeJS, animations }
}

// Run examples
async function main() {
  console.log('🚀 PDF Processor Examples\n')
  console.log('=' .repeat(60))
  
  try {
    // Run example 1
    const result = await processEntirePDF()
    
    // Run example 4 with first step
    if (result.steps.length > 0) {
      accessStepData(result.steps[0])
    }
    
    // Run example 2
    // await processSinglePageExample()
    
    console.log('\n' + '='.repeat(60))
    console.log('✅ All examples completed!')
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  }
}

// Uncomment to run:
// main()

export { 
  processEntirePDF, 
  processSinglePageExample, 
  setupAPIExample, 
  accessStepData 
}

