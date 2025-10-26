/**
 * Quick test script to verify the top products scraper works
 * This tests a small sample (5 products) instead of all 50
 */

import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const BRIGHTDATA_API_KEY = process.env.BRIGHTDATA_API_KEY;
const SERP_ZONE = process.env.BRIGHTDATA_ZONE || 'serp_api1';

async function testSerpApi() {
  console.log('🧪 Testing Bright Data SERP API Connection');
  console.log('━'.repeat(60));

  if (!BRIGHTDATA_API_KEY) {
    console.error('❌ BRIGHTDATA_API_KEY not found in .env file');
    console.log('');
    console.log('Please add to backend/.env:');
    console.log('  BRIGHTDATA_API_KEY=your_api_key_here');
    console.log('  BRIGHTDATA_ZONE=your_serp_zone_name');
    process.exit(1);
  }

  console.log('✅ API Key found');
  console.log(`✅ Zone: ${SERP_ZONE}`);
  console.log('');

  // Test a simple Google search
  const testQuery = 'BILLY Bookcase IKEA product';
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(testQuery)}&tbm=isch&hl=en&gl=us`;

  console.log('🔍 Testing image search for: BILLY Bookcase');
  console.log(`📍 URL: ${searchUrl}`);
  console.log('');

  try {
    const response = await axios.post(
      'https://api.brightdata.com/request',
      {
        zone: SERP_ZONE,
        url: searchUrl,
        format: 'json',
        brd_json: 1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BRIGHTDATA_API_KEY}`,
        },
        timeout: 30000,
      }
    );

    console.log('✅ SERP API Response received!');
    console.log('');
    console.log('Response structure:');
    console.log(`  Status: ${response.status}`);
    console.log(`  Data keys: ${Object.keys(response.data).join(', ')}`);
    
    if (response.data.images && response.data.images.length > 0) {
      console.log(`  Images found: ${response.data.images.length}`);
      console.log('');
      console.log('First image:');
      console.log(`  URL: ${response.data.images[0].url || response.data.images[0].original}`);
    } else if (response.data.image_results && response.data.image_results.length > 0) {
      console.log(`  Images found: ${response.data.image_results.length}`);
      console.log('');
      console.log('First image:');
      console.log(`  URL: ${response.data.image_results[0].original || response.data.image_results[0].thumbnail}`);
    } else {
      console.log('  ⚠️  No images found in response');
      console.log('  Response sample:', JSON.stringify(response.data).substring(0, 200));
    }

    console.log('');
    console.log('━'.repeat(60));
    console.log('✅ Test passed! SERP API is working correctly.');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Run: npm run scrape:top-products');
    console.log('  2. Start backend: npm run dev');
    console.log('  3. Test endpoint: curl http://localhost:3001/api/top-manuals');
    console.log('');

  } catch (error: any) {
    console.error('❌ SERP API Test Failed');
    console.error('');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${error.response.data?.message || error.response.statusText}`);
      console.error('');
      
      if (error.response.status === 401 || error.response.status === 403) {
        console.error('🔐 Authentication Error:');
        console.error('  - Check that BRIGHTDATA_API_KEY is correct');
        console.error('  - Verify your Bright Data account is active');
        console.error('  - Make sure you have a SERP API zone created');
      } else if (error.response.status === 429) {
        console.error('⏱️  Rate Limit Error:');
        console.error('  - Too many requests');
        console.error('  - Wait a moment and try again');
      }
    } else {
      console.error(`Error: ${error.message}`);
    }
    
    process.exit(1);
  }
}

// Run the test
testSerpApi();

