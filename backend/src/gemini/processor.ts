// Main Gemini processor - orchestrates PDF parsing and AI analysis
import { GoogleGenerativeAI } from '@google/generative-ai'
import { extractPagesAsImages, PDFPage, imageToBase64 } from './pdf-parser'
import { buildStepAnalysisPrompt } from './prompt-builder'
import { generateSceneFromAnalysis } from './scene-generator'
import { 
  ProcessedPDF, 
  AssemblyStep, 
  ProductMetadata, 
  GeminiStepAnalysis 
} from './types'

// Initialize Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
const GEMINI_DELAY_MS = parseInt(process.env.GEMINI_DELAY_MS || '500', 10)

if (!GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY not set in environment variables!')
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

/**
 * Main function: Process entire PDF and return assembly steps
 */
export async function processPDF(
  pdfPath: string,
  metadata?: ProductMetadata
): Promise<ProcessedPDF> {
  console.log('🚀 Starting PDF processing...')
  console.log(`📁 PDF Path: ${pdfPath}`)
  
  // Step 1: Extract pages as images
  const pages = await extractPagesAsImages(pdfPath)
  console.log(`✅ Extracted ${pages.length} pages`)
  
  // Step 2: Process each page with Gemini
  const steps: AssemblyStep[] = []
  let stepCounter = 1
  
  for (const page of pages) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`🔍 Processing page ${page.pageNumber}/${pages.length}`)
    console.log(`📊 Image hash: ${page.imageHash}`)
    
    try {
      // Analyze page with Gemini
      const analysis = await analyzeStepWithGemini(
        page,
        pages.length,
        metadata
      )
      
      if (!analysis) {
        console.log(`⏭️  Skipping page ${page.pageNumber} (no assembly step found)`)
        continue
      }
      
      // Generate 3D scene from analysis
      const assemblyStep = generateSceneFromAnalysis(analysis, stepCounter)
      steps.push(assemblyStep)
      
      console.log(`✅ Step ${stepCounter} completed: ${assemblyStep.title}`)
      console.log(`   Parts: ${assemblyStep.parts.length}`)
      console.log(`   Actions: ${assemblyStep.assemblySequence.length}`)
      
      stepCounter++
      
      // Rate limiting
      if (page.pageNumber < pages.length) {
        console.log(`⏳ Waiting ${GEMINI_DELAY_MS}ms before next request...`)
        await delay(GEMINI_DELAY_MS)
      }
      
    } catch (error) {
      console.error(`❌ Error processing page ${page.pageNumber}:`, error)
      // Continue with next page
    }
  }
  
  console.log(`\n${'='.repeat(60)}`)
  console.log(`🎉 PDF processing complete!`)
  console.log(`📦 Total steps extracted: ${steps.length}`)
  
  return {
    totalPages: pages.length,
    steps,
    metadata
  }
}

/**
 * Analyze a single page with Gemini vision API
 */
async function analyzeStepWithGemini(
  page: PDFPage,
  totalPages: number,
  metadata?: ProductMetadata
): Promise<GeminiStepAnalysis | null> {
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })
  
  // Build prompt
  const prompt = buildStepAnalysisPrompt(page.pageNumber, totalPages, metadata)
  
  // Convert image to base64
  const imageBase64 = imageToBase64(page.imageBuffer)
  
  console.log(`📤 Sending to Gemini... (prompt length: ${prompt.length} chars)`)
  
  try {
    // Call Gemini with image and prompt
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/png'
        }
      }
    ])
    
    const response = result.response
    const text = response.text()
    
    console.log(`📥 Received response (${text.length} chars)`)
    
    // Parse JSON response
    const analysis = parseGeminiResponse(text)
    
    if (!analysis) {
      console.log(`⚠️  Could not parse response as valid step`)
      return null
    }
    
    // Validate response
    if (!analysis.stepNumber || !analysis.title || !analysis.partsUsed?.length) {
      console.log(`⚠️  Incomplete step data, skipping`)
      return null
    }
    
    console.log(`✅ Parsed step ${analysis.stepNumber}: ${analysis.title}`)
    
    return analysis
    
  } catch (error: any) {
    console.error(`❌ Gemini API error:`, error.message)
    
    // Retry logic
    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      console.log(`⏳ Rate limited, waiting 5 seconds...`)
      await delay(5000)
      // Retry once
      return analyzeStepWithGemini(page, totalPages, metadata)
    }
    
    throw error
  }
}

/**
 * Parse Gemini's text response into structured data
 */
function parseGeminiResponse(text: string): GeminiStepAnalysis | null {
  try {
    // Remove markdown code blocks if present
    let cleanText = text.trim()
    
    // Remove ```json and ``` markers
    cleanText = cleanText.replace(/```json\s*/gi, '')
    cleanText = cleanText.replace(/```\s*/g, '')
    
    // Find JSON object
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error(`⚠️  No JSON object found in response`)
      return null
    }
    
    const json = JSON.parse(jsonMatch[0])
    
    // Normalize field names (handle variations)
    return {
      stepNumber: json.stepNumber || json.step || 0,
      title: json.title || 'Assembly Step',
      description: json.description || '',
      partsUsed: json.partsUsed || json.parts || [],
      tools: json.tools || [],
      actions: json.actions || []
    }
    
  } catch (error: any) {
    console.error(`❌ JSON parse error:`, error.message)
    console.error(`Raw text:`, text.substring(0, 200))
    return null
  }
}

/**
 * Utility: Delay execution
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Process a single page (for testing)
 */
export async function processSinglePage(
  pdfPath: string,
  pageNumber: number,
  metadata?: ProductMetadata
): Promise<AssemblyStep | null> {
  const pages = await extractPagesAsImages(pdfPath)
  const page = pages.find(p => p.pageNumber === pageNumber)
  
  if (!page) {
    throw new Error(`Page ${pageNumber} not found`)
  }
  
  const analysis = await analyzeStepWithGemini(page, pages.length, metadata)
  
  if (!analysis) {
    return null
  }
  
  return generateSceneFromAnalysis(analysis, pageNumber)
}

