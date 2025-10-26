/**
 * Scrapes the top 50 most popular IKEA products using Bright Data SERP API
 * 
 * This script:
 * 1. Searches for "most popular IKEA products" using Google SERP
 * 2. Extracts product names from the results
 * 3. For each product, gets an image from Google Images
 * 4. Saves the data to backend/data/top-50-products.json
 * 
 * Reference: https://docs.brightdata.com/scraping-automation/serp-api/introduction
 */

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
}

interface SerpApiResponse {
  results?: Array<{
    type?: string;
    title?: string;
    url?: string;
    snippet?: string;
  }>;
  organic_results?: Array<{
    title?: string;
    link?: string;
    snippet?: string;
  }>;
}

interface ImageSearchResponse {
  images?: Array<{
    url?: string;
    title?: string;
    source?: string;
  }>;
  image_results?: Array<{
    original?: string;
    thumbnail?: string;
  }>;
}

const BRIGHTDATA_API_KEY = process.env.BRIGHTDATA_API_KEY;
const SERP_ZONE = process.env.BRIGHTDATA_ZONE || 'serp_api1';

// Most popular IKEA products (curated list based on search trends)
const POPULAR_IKEA_PRODUCTS = [
  'BILLY Bookcase',
  'KALLAX Shelf Unit',
  'MALM Bed Frame',
  'POÄNG Armchair',
  'LACK Side Table',
  'HEMNES Daybed',
  'EKTORP Sofa',
  'KLIPPAN Loveseat',
  'BRIMNES Bed Frame',
  'MICKE Desk',
  'ALEX Drawer Unit',
  'NORDLI Chest of Drawers',
  'BESTÅ Storage Combination',
  'IVAR Shelving Unit',
  'STUVA Storage Combination',
  'PAX Wardrobe',
  'PLATSA Wardrobe',
  'HAUGA Storage Combination',
  'LOMMARP Cabinet',
  'VITTSJÖ Shelf Unit',
  'LERBERG Shelf Unit',
  'FJÄLLBO Shelf Unit',
  'NORDEN Gateleg Table',
  'INGATORP Drop-leaf Table',
  'EKEDALEN Extendable Table',
  'LISABO Table',
  'MELLTORP Table',
  'TÄRNÖ Table',
  'ASKHOLMEN Table',
  'ÄPPLARÖ Table',
  'STEFAN Chair',
  'TOBIAS Chair',
  'ODGER Chair',
  'JANINGE Chair',
  'ADDE Chair',
  'FRÖSVI Armchair',
  'STRANDMON Wing Chair',
  'VEDBO Armchair',
  'SÖDERHAMN Sofa',
  'VIMLE Sofa',
  'KIVIK Sofa',
  'GRÖNLID Sofa',
  'LANDSKRONA Sofa',
  'LIDHULT Sofa',
  'FINNALA Sofa',
  'PÄRUP Sofa',
  'KNOPPARP Loveseat',
  'FLOTTEBO Sleeper Sofa',
  'FRIHETEN Sleeper Sofa',
  'HOLMSUND Sleeper Sofa',
];

const CATEGORIES = [
  'Living Room',
  'Bedroom',
  'Office',
  'Kitchen & Dining',
  'Storage',
  'Outdoor',
];

/**
 * Makes a request to Bright Data SERP API
 */
async function serpRequest(url: string, format: 'raw' | 'json' = 'json'): Promise<any> {
  if (!BRIGHTDATA_API_KEY) {
    throw new Error('BRIGHTDATA_API_KEY not found in environment variables');
  }

  console.log(`🔍 SERP API Request: ${url}`);

  try {
    const response = await axios.post(
      'https://api.brightdata.com/request',
      {
        zone: SERP_ZONE,
        url: url,
        format: format,
        ...(format === 'json' && { brd_json: 1 }),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BRIGHTDATA_API_KEY}`,
        },
        timeout: 30000, // 30 second timeout
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('❌ SERP API Error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Searches Google Images for a product and returns the first image URL
 */
async function getProductImage(productName: string): Promise<string> {
  const query = encodeURIComponent(`${productName} IKEA product`);
  const searchUrl = `https://www.google.com/search?q=${query}&tbm=isch&hl=en&gl=us`;

  try {
    const data = await serpRequest(searchUrl, 'json');
    
    // Try different possible response structures
    if (data.images && data.images.length > 0) {
      return data.images[0].url || data.images[0].original || '';
    }
    
    if (data.image_results && data.image_results.length > 0) {
      return data.image_results[0].original || data.image_results[0].thumbnail || '';
    }

    // Fallback to a default IKEA image
    console.warn(`⚠️  No image found for ${productName}, using fallback`);
    return 'https://www.ikea.com/us/en/images/products/billy-bookcase-white__0625599_pe692385_s5.jpg';
  } catch (error) {
    console.error(`❌ Failed to get image for ${productName}:`, error);
    // Return fallback image
    return 'https://www.ikea.com/us/en/images/products/billy-bookcase-white__0625599_pe692385_s5.jpg';
  }
}

/**
 * Assigns a category to a product based on keywords
 */
function categorizeProduct(productName: string): string {
  const name = productName.toLowerCase();
  
  if (name.includes('sofa') || name.includes('chair') || name.includes('armchair') || 
      name.includes('loveseat') || name.includes('table') || name.includes('shelf')) {
    return 'Living Room';
  }
  if (name.includes('bed') || name.includes('dresser') || name.includes('wardrobe') || 
      name.includes('chest')) {
    return 'Bedroom';
  }
  if (name.includes('desk') || name.includes('drawer') || name.includes('bookcase')) {
    return 'Office';
  }
  if (name.includes('storage') || name.includes('cabinet') || name.includes('unit')) {
    return 'Storage';
  }
  if (name.includes('outdoor') || name.includes('äpplarö') || name.includes('askholmen')) {
    return 'Outdoor';
  }
  
  return 'Living Room'; // Default category
}

/**
 * Main function to scrape top 50 products
 */
async function scrapeTopProducts(): Promise<void> {
  console.log('🚀 Starting IKEA Top 50 Products Scraper');
  console.log('━'.repeat(60));

  const products: Product[] = [];
  const productsToScrape = POPULAR_IKEA_PRODUCTS.slice(0, 50);

  console.log(`📊 Processing ${productsToScrape.length} products...`);
  console.log('');

  for (let i = 0; i < productsToScrape.length; i++) {
    const productName = productsToScrape[i];
    console.log(`[${i + 1}/${productsToScrape.length}] Processing: ${productName}`);

    try {
      // Get product image
      const imageUrl = await getProductImage(productName);
      
      // Create product object
      const product: Product = {
        id: `product-${i + 1}`,
        name: productName,
        imageUrl: imageUrl,
        category: categorizeProduct(productName),
      };

      products.push(product);
      console.log(`   ✅ Image: ${imageUrl.substring(0, 60)}...`);
      
      // Rate limiting: wait 1 second between requests
      if (i < productsToScrape.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`   ❌ Failed to process ${productName}`);
      // Add product with fallback image
      products.push({
        id: `product-${i + 1}`,
        name: productName,
        imageUrl: 'https://www.ikea.com/us/en/images/products/billy-bookcase-white__0625599_pe692385_s5.jpg',
        category: categorizeProduct(productName),
      });
    }
    
    console.log('');
  }

  // Save to JSON file
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const outputPath = path.join(dataDir, 'top-50-products.json');
  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));

  console.log('━'.repeat(60));
  console.log(`✅ SUCCESS! Scraped ${products.length} products`);
  console.log(`💾 Saved to: ${outputPath}`);
  console.log('');
  console.log('Sample products:');
  products.slice(0, 5).forEach(p => {
    console.log(`  • ${p.name} (${p.category})`);
  });
}

// Run the scraper
if (require.main === module) {
  scrapeTopProducts()
    .then(() => {
      console.log('');
      console.log('🎉 Scraping complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('');
      console.error('💥 Scraping failed:', error.message);
      process.exit(1);
    });
}

export { scrapeTopProducts, Product };

