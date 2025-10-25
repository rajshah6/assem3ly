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

export default router

