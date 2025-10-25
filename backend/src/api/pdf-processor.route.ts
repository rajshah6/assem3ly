// API route for PDF processing
import { Router, Request, Response } from 'express'
import path from 'path'
import fs from 'fs/promises'
import { processPDF } from '../gemini/processor'
import { ProductMetadata } from '../gemini/types'

const router = Router()

/**
 * POST /api/process-pdf
 * Process a PDF and extract assembly steps
 * 
 * Body:
 * {
 *   "pdfPath": "path/to/pdf",
 *   "metadata": { "productName": "...", ... }
 * }
 */
router.post('/process-pdf', async (req: Request, res: Response) => {
  try {
    const { pdfPath, metadata } = req.body
    
    if (!pdfPath) {
      return res.status(400).json({
        error: 'Missing required field: pdfPath'
      })
    }
    
    // Validate PDF exists
    try {
      await fs.access(pdfPath)
    } catch {
      return res.status(404).json({
        error: `PDF not found: ${pdfPath}`
      })
    }
    
    console.log(`📥 Processing PDF: ${pdfPath}`)
    
    // Process PDF with Gemini
    const result = await processPDF(pdfPath, metadata as ProductMetadata)
    
    console.log(`✅ Processing complete: ${result.steps.length} steps extracted`)
    
    return res.json({
      success: true,
      totalPages: result.totalPages,
      stepsExtracted: result.steps.length,
      steps: result.steps,
      metadata: result.metadata
    })
    
  } catch (error: any) {
    console.error('❌ Error processing PDF:', error)
    return res.status(500).json({
      error: 'Failed to process PDF',
      message: error.message
    })
  }
})

/**
 * POST /api/process-pdf/page
 * Process a single page from a PDF (for testing)
 * 
 * Body:
 * {
 *   "pdfPath": "path/to/pdf",
 *   "pageNumber": 1,
 *   "metadata": { ... }
 * }
 */
router.post('/process-pdf/page', async (req: Request, res: Response) => {
  try {
    const { pdfPath, pageNumber, metadata } = req.body
    
    if (!pdfPath || !pageNumber) {
      return res.status(400).json({
        error: 'Missing required fields: pdfPath, pageNumber'
      })
    }
    
    const { processSinglePage } = await import('../gemini/processor')
    const step = await processSinglePage(pdfPath, pageNumber, metadata)
    
    if (!step) {
      return res.json({
        success: false,
        message: 'No assembly step found on this page'
      })
    }
    
    return res.json({
      success: true,
      step
    })
    
  } catch (error: any) {
    console.error('❌ Error processing page:', error)
    return res.status(500).json({
      error: 'Failed to process page',
      message: error.message
    })
  }
})

export default router

