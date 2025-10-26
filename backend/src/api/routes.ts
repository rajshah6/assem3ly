/**
 * API Routes
 * Connects frontend to backend services
 */

import { Router } from 'express'
import { scrapeProduct } from '../../brightdata/scraper'

const router = Router()

/**
 * POST /api/scrape-product
 * Main endpoint: Scrapes IKEA product using Bright Data
 * 
 * Body: { query: "billy bookcase" }
 * Returns: ScrapedProduct with PDF path
 */
router.post('/scrape-product', async (req, res, next) => {
  try {
    const { query } = req.body

    if (!query) {
      return res.status(400).json({ 
        error: 'Query parameter is required',
        example: { query: 'billy bookcase' }
      })
    }

    console.log('\n' + '='.repeat(60))
    console.log('📥 API Request: /api/scrape-product')
    console.log('🔍 Query:', query)
    console.log('='.repeat(60))

    // Person 1: Bright Data scraping
    const scrapedData = await scrapeProduct(query)
    
    console.log('✅ API Response: Success')
    console.log('='.repeat(60) + '\n')

    // TODO: Person 3 - Call AI processing here
    // const steps = await extractSteps({
    //   pdfPath: scrapedData.pdfPath,
    //   manualTitle: scrapedData.productName,
    //   metadata: scrapedData.metadata
    // })

    // For now, return just the scraped data
    res.json({
      product: scrapedData,
      // steps: [] // TODO: Add when Person 3 completes AI processing
    })

  } catch (error: any) {
    console.error('❌ API Error:', error.message)
    next(error)
  }
})

/**
 * GET /api/assembly/:id
 * Retrieve cached assembly data by product ID (TODO)
 */
router.get('/assembly/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    
    // TODO: Implement caching system
    res.status(501).json({ 
      error: 'Caching not implemented yet',
      productId: id 
    })
    
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/scrape-url
 * Scrape IKEA product directly from URL
 * 
 * Body: { url: "https://www.ikea.com/us/en/p/billy-bookcase-white-00263850/" }
 * Returns: ScrapedProduct with PDF path
 */
router.post('/scrape-url', async (req, res, next) => {
  try {
    const { url } = req.body

    if (!url || !url.includes('ikea.com')) {
      return res.status(400).json({ 
        error: 'Valid IKEA URL is required',
        example: { url: 'https://www.ikea.com/us/en/p/billy-bookcase-white-00263850/' }
      })
    }

    console.log('\n' + '='.repeat(60))
    console.log('📥 API Request: /api/scrape-url')
    console.log('🔗 URL:', url)
    console.log('='.repeat(60))

    // Person 1: Bright Data scraping (already supports URLs!)
    const scrapedData = await scrapeProduct(url)
    
    console.log('✅ API Response: Success')
    console.log('📄 PDF saved to:', scrapedData.pdfPath)
    console.log('='.repeat(60) + '\n')

    res.json({
      success: true,
      product: scrapedData,
    })

  } catch (error: any) {
    console.error('❌ API Error:', error.message)
    next(error)
  }
})

/**
 * GET /api/top-manuals
 * Returns the top 50 most popular IKEA products
 * Data is loaded from backend/data/top-50-products.json
 */
router.get('/top-manuals', async (req: any, res: any, next: any) => {
  try {
    const fs = await import('fs')
    const path = await import('path')
    
    const dataPath = path.join(__dirname, '..', '..', 'data', 'top-50-products.json')
    
    // Check if file exists
    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({
        error: 'Top products data not found',
        message: 'Run "npm run scrape:top-products" to generate the data',
      })
    }
    
    // Read and parse the JSON file
    const data = fs.readFileSync(dataPath, 'utf-8')
    const products = JSON.parse(data)
    
    res.json(products)
    
  } catch (error: any) {
    console.error('❌ Error loading top manuals:', error.message)
    next(error)
  }
})

export default router

