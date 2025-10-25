// Main Gemini processor - orchestrates PDF parsing and AI analysis
import { GoogleGenerativeAI } from '@google/generative-ai'
import { loadPDF, PDFInfo, pdfToBase64 } from './pdf-parser'
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
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp'
const GEMINI_DELAY_MS = parseInt(process.env.GEMINI_DELAY_MS || '1000', 10)

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
  
  // Step 1: Load PDF
  const pdfInfo = await loadPDF(pdfPath)
  console.log(`✅ Loaded PDF with ${pdfInfo.totalPages} pages`)
  
  // Step 2: Process each page with Gemini
  const steps: AssemblyStep[] = []
  let stepCounter = 1
  
  // Skip first few pages (usually parts list/cover)
  const startPage = Math.min(2, pdfInfo.totalPages)
  
  for (let pageNum = startPage; pageNum <= pdfInfo.totalPages; pageNum++) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`🔍 Processing page ${pageNum}/${pdfInfo.totalPages}`)
    
    try {
      // Analyze page with Gemini
      const analysis = await analyzePageWithGemini(
        pdfInfo,
        pageNum,
        metadata
      )
      
      if (!analysis) {
        console.log(`⏭️  Skipping page ${pageNum} (no assembly step found)`)
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
      if (pageNum < pdfInfo.totalPages) {
        console.log(`⏳ Waiting ${GEMINI_DELAY_MS}ms before next request...`)
        await delay(GEMINI_DELAY_MS)
      }
      
    } catch (error) {
      console.error(`❌ Error processing page ${pageNum}:`, error)
      // Continue with next page
    }
  }
  
  console.log(`\n${'='.repeat(60)}`)
  console.log(`🎉 PDF processing complete!`)
  console.log(`📦 Total steps extracted: ${steps.length}`)
  
  return {
    totalPages: pdfInfo.totalPages,
    steps,
    metadata
  }
}

/**
 * Analyze a single page with Gemini PDF support
 */
async function analyzePageWithGemini(
  pdfInfo: PDFInfo,
  pageNumber: number,
  metadata?: ProductMetadata
): Promise<GeminiStepAnalysis | null> {
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })
  
  // Build prompt with page number specified
  const prompt = buildStepAnalysisPrompt(pageNumber, pdfInfo.totalPages, metadata) + 
    `\n\nAnalyze ONLY page ${pageNumber} of the PDF. Focus on the assembly step shown on this specific page.`
  
  // Convert PDF to base64
  const pdfBase64 = pdfToBase64(pdfInfo.pdfBuffer)
  
  console.log(`📤 Sending page ${pageNumber} to Gemini... (prompt length: ${prompt.length} chars)`)
  
  try {
    // Call Gemini with PDF and prompt
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: pdfBase64,
          mimeType: 'application/pdf'
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
      return analyzePageWithGemini(pdfInfo, pageNumber, metadata)
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
  const pdfInfo = await loadPDF(pdfPath)
  
  if (pageNumber < 1 || pageNumber > pdfInfo.totalPages) {
    throw new Error(`Page ${pageNumber} out of range (1-${pdfInfo.totalPages})`)
  }
  
  const analysis = await analyzePageWithGemini(pdfInfo, pageNumber, metadata)
  
  if (!analysis) {
    return null
  }
  
  return generateSceneFromAnalysis(analysis, pageNumber)
}

