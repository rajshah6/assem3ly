// PDF parser - converts PDF pages to images for Gemini processing
import fs from 'fs/promises'
import path from 'path'
import { createCanvas } from 'canvas'
import * as pdfLib from 'pdf-lib'
import sharp from 'sharp'
import crypto from 'crypto'

export interface PDFPage {
  pageNumber: number
  imageBuffer: Buffer
  width: number
  height: number
  imageHash: string // For debugging uniqueness
}

/**
 * Extracts all pages from a PDF as PNG images
 * Each page is converted to a high-quality image for Gemini vision processing
 */
export async function extractPagesAsImages(pdfPath: string): Promise<PDFPage[]> {
  console.log(`📄 Loading PDF: ${pdfPath}`)
  
  const pdfBytes = await fs.readFile(pdfPath)
  const pdfDoc = await pdfLib.PDFDocument.load(pdfBytes)
  const totalPages = pdfDoc.getPageCount()
  
  console.log(`📊 Total pages: ${totalPages}`)
  
  const pages: PDFPage[] = []
  
  // Load pdfjs-dist dynamically
  const pdfjs = require('pdfjs-dist/legacy/build/pdf.js')
  
  // Load PDF with pdfjs
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(pdfBytes)
  })
  
  const pdf = await loadingTask.promise
  
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    console.log(`🖼️  Extracting page ${pageNum}/${totalPages}...`)
    
    const page = await pdf.getPage(pageNum)
    const viewport = page.getViewport({ scale: 2.0 }) // High resolution
    
    // Create canvas
    const canvas = createCanvas(viewport.width, viewport.height)
    const context = canvas.getContext('2d')
    
    // Render PDF page to canvas
    const renderContext = {
      canvasContext: context as any,
      viewport: viewport
    }
    
    await page.render(renderContext).promise
    
    // Convert canvas to PNG buffer
    const imageBuffer = canvas.toBuffer('image/png')
    
    // Compress and optimize with sharp
    const optimizedBuffer = await sharp(imageBuffer)
      .png({ quality: 90, compressionLevel: 9 })
      .toBuffer()
    
    // Create hash for debugging
    const imageHash = crypto.createHash('md5').update(optimizedBuffer).digest('hex')
    
    console.log(`✅ Page ${pageNum} extracted - ${optimizedBuffer.length} bytes - Hash: ${imageHash.substring(0, 8)}`)
    
    pages.push({
      pageNumber: pageNum,
      imageBuffer: optimizedBuffer,
      width: viewport.width,
      height: viewport.height,
      imageHash
    })
  }
  
  return pages
}

/**
 * Saves page images to disk for debugging
 */
export async function savePageImages(pages: PDFPage[], outputDir: string): Promise<void> {
  await fs.mkdir(outputDir, { recursive: true })
  
  for (const page of pages) {
    const filename = path.join(outputDir, `page-${page.pageNumber}.png`)
    await fs.writeFile(filename, page.imageBuffer)
    console.log(`💾 Saved: ${filename}`)
  }
}

/**
 * Converts image buffer to base64 for Gemini API
 */
export function imageToBase64(buffer: Buffer): string {
  return buffer.toString('base64')
}

