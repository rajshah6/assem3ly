// Test script to process the IKEA PDF
import 'dotenv/config'
import path from 'path'
import fs from 'fs/promises'
import { processPDF } from './gemini/processor'

async function main() {
  console.log('🧪 Testing PDF Processor\n')
  
  // Check for API key
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not set in environment!')
    console.error('Please create backend/.env with your Gemini API key')
    process.exit(1)
  }
  
  // Path to the test PDF
  const pdfPath = path.join(__dirname, 'public', 'tommaryd-underframe-anthracite__AA-2169157-3-100.pdf')
  
  // Check if PDF exists
  try {
    await fs.access(pdfPath)
    console.log(`✅ Found PDF: ${pdfPath}\n`)
  } catch {
    console.error(`❌ PDF not found: ${pdfPath}`)
    process.exit(1)
  }
  
  // Process the PDF
  try {
    const result = await processPDF(pdfPath, {
      productName: 'TOMMARYD Underframe',
      category: 'Table',
      productDimensions: {
        width: 1.30,
        height: 0.70,
        depth: 0.70
      }
    })
    
    console.log('\n' + '='.repeat(60))
    console.log('🎉 PROCESSING COMPLETE!')
    console.log('='.repeat(60))
    console.log(`Total Pages: ${result.totalPages}`)
    console.log(`Steps Extracted: ${result.steps.length}`)
    console.log('')
    
    // Display each step
    result.steps.forEach((step, index) => {
      console.log(`Step ${step.stepId}: ${step.title}`)
      console.log(`  Description: ${step.description}`)
      console.log(`  Parts: ${step.parts.length}`)
      console.log(`  Actions: ${step.assemblySequence.length}`)
      console.log('')
    })
    
    // Save to file
    const outputPath = path.join(__dirname, '../output', 'processed-steps.json')
    await fs.mkdir(path.dirname(outputPath), { recursive: true })
    await fs.writeFile(outputPath, JSON.stringify(result, null, 2))
    console.log(`💾 Saved results to: ${outputPath}`)
    
    // Save individual steps
    for (const step of result.steps) {
      const stepPath = path.join(__dirname, '../output', `step-${step.stepId}.json`)
      await fs.writeFile(stepPath, JSON.stringify(step, null, 2))
      console.log(`💾 Saved step ${step.stepId} to: ${stepPath}`)
    }
    
    console.log('\n✅ Test completed successfully!')
    
  } catch (error: any) {
    console.error('\n❌ Error processing PDF:', error.message)
    console.error(error)
    process.exit(1)
  }
}

main()

