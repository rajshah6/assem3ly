/**
 * Test script for Bright Data scraper
 * Run: npx ts-node brightdata/test.ts
 */

import 'dotenv/config'
import { scrapeProduct } from './scraper'

async function test() {
  console.log('🧪 Testing Bright Data IKEA Scraper')
  console.log('=' .repeat(60))
  console.log('')
  
  // Check environment variables
  if (!process.env.BRIGHTDATA_CUSTOMER_ID) {
    console.error('❌ Missing BRIGHTDATA_CUSTOMER_ID in .env')
    process.exit(1)
  }
  if (!process.env.BRIGHTDATA_ZONE) {
    console.error('❌ Missing BRIGHTDATA_ZONE in .env')
    process.exit(1)
  }
  if (!process.env.BRIGHTDATA_API_KEY) {
    console.error('❌ Missing BRIGHTDATA_API_KEY in .env')
    process.exit(1)
  }
  
  console.log('✅ Environment variables loaded')
  console.log('')
  
  const testProducts = [
    // Test 1: Billy Bookcase (US site)
    //'https://www.ikea.com/us/en/p/billy-bookcase-white-20522046/',
    
    // Test 2: SEKTION Cabinet (Canadian site) - your example
    //'https://www.ikea.com/ca/en/p/sektion-base-cabinet-frame-white-90265388/',
    
    // Test 3: Search term - full product name (realistic user input)
    // 'sektion base cabinet frame',
    
    // More test products (uncomment to try):
    // 'https://www.ikea.com/us/en/p/malm-bed-frame-high-white-luroey-s69009475/',
    // 'https://www.ikea.com/us/en/p/kallax-shelf-unit-white-80275887/',
    
    // Search terms (uncomment to test search):
    'billy bookcase white'
    // 'malm dresser',
  ]
  
  for (const productName of testProducts) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`🧪 Testing: "${productName}"`)
    console.log('='.repeat(60))
    
    try {
      const startTime = Date.now()
      const result = await scrapeProduct(productName)
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
      
      console.log('\n✅ SUCCESS!')
      console.log('─'.repeat(60))
      console.log('Product Name:', result.productName)
      console.log('Product ID:', result.productId)
      console.log('Category:', result.metadata.category)
      console.log('Dimensions:', JSON.stringify(result.metadata.dimensions))
      console.log('Images:', result.metadata.images.length, 'images')
      console.log('PDF URL:', result.pdfUrl)
      console.log('PDF Path:', result.pdfPath || 'NOT DOWNLOADED')
      console.log('Source URL:', result.metadata.sourceUrl)
      console.log('Time taken:', elapsed, 'seconds')
      console.log('─'.repeat(60))
      
    } catch (error: any) {
      console.error('\n❌ FAILED!')
      console.error('Error:', error.message)
      if (error.stack) {
        console.error('\nStack trace:')
        console.error(error.stack)
      }
    }
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('🏁 Test complete!')
  console.log('='.repeat(60))
}

test().catch(console.error)

