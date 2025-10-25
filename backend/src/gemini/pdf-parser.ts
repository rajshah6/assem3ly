// PDF parser - simpler approach using PDF metadata
import fs from 'fs/promises'
import * as pdfLib from 'pdf-lib'
import crypto from 'crypto'

export interface PDFInfo {
  totalPages: number
  pdfBuffer: Buffer
  pdfPath: string
  fileHash: string
}

/**
 * Loads PDF and extracts basic metadata
 * Gemini can read PDFs directly, so we don't need to convert to images!
 */
export async function loadPDF(pdfPath: string): Promise<PDFInfo> {
  console.log(`📄 Loading PDF: ${pdfPath}`)
  
  const pdfBuffer = await fs.readFile(pdfPath)
  const pdfDoc = await pdfLib.PDFDocument.load(pdfBuffer)
  const totalPages = pdfDoc.getPageCount()
  
  // Create hash for caching
  const fileHash = crypto.createHash('md5').update(pdfBuffer).digest('hex')
  
  console.log(`📊 Total pages: ${totalPages}`)
  console.log(`🔑 PDF hash: ${fileHash.substring(0, 12)}`)
  
  return {
    totalPages,
    pdfBuffer,
    pdfPath,
    fileHash
  }
}

/**
 * Converts PDF buffer to base64 for Gemini API
 */
export function pdfToBase64(buffer: Buffer): string {
  return buffer.toString('base64')
}

