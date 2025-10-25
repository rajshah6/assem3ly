/**
 * Person 1: PDF Downloader
 * Downloads PDFs using Bright Data Web Unlocker
 */

import axios from 'axios'
import fs from 'fs'
import path from 'path'

const PDF_DIR = path.join(__dirname, '../data/pdfs')

export async function downloadPDF(pdfUrl: string, productId: string): Promise<string> {
  console.log('📥 Downloading PDF with Bright Data Web Unlocker...')
  console.log('   URL:', pdfUrl)
  
  // Ensure directory exists
  if (!fs.existsSync(PDF_DIR)) {
    fs.mkdirSync(PDF_DIR, { recursive: true })
  }
  
  const filePath = path.join(PDF_DIR, `${productId}.pdf`)
  
  try {
    // Use Bright Data Web Unlocker proxy
    const response = await axios.get(pdfUrl, {
      proxy: {
        host: 'brd.superproxy.io',
        port: 22225,
        auth: {
          username: `brd-customer-${process.env.BRIGHTDATA_CUSTOMER_ID}-zone-${process.env.BRIGHTDATA_ZONE}`,
          password: process.env.BRIGHTDATA_API_KEY
        }
      },
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    })
    
    fs.writeFileSync(filePath, response.data)
    console.log('💾 PDF saved to:', filePath)
    
    return filePath
    
  } catch (error: any) {
    console.error('❌ PDF download failed:', error.message)
    throw new Error(`Failed to download PDF: ${error.message}`)
  }
}

