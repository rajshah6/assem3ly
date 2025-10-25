/**
 * Person 1: Bright Data Types
 * TypeScript interfaces for scraping
 */

export interface ScrapedProduct {
  productName: string
  productId: string
  pdfUrl: string
  pdfPath: string  // Local path after download
  metadata: {
    dimensions: {
      width?: string
      height?: string
      depth?: string
    }
    weight?: string
    parts?: string[]
    images: string[]
    category: string
    sourceUrl: string
    scrapedAt: string  // ISO 8601 format
  }
}

export interface BrightDataConfig {
  customerId: string
  zone: string
  apiKey: string
}

