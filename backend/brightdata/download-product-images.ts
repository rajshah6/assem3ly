/**
 * Download IKEA Product Images using Bright Data SERP API
 * 
 * This script:
 * 1. Uses SERP API to search Google Images for each product
 * 2. Downloads the first image for each product
 * 3. Saves images to backend/data/images/
 * 4. Updates the JSON file with local image paths
 * 
 * Usage:
 *   cd backend
 *   npm run download:images
 */

import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

dotenv.config();

const BRIGHTDATA_API_KEY = process.env.BRIGHTDATA_API_KEY;
const SERP_ZONE = process.env.BRIGHTDATA_ZONE || 'serp_api1';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
}

/**
 * Search Google Images using SERP API
 */
async function searchProductImage(productName: string): Promise<string | null> {
  if (!BRIGHTDATA_API_KEY) {
    throw new Error('BRIGHTDATA_API_KEY not found in environment variables');
  }

  const query = encodeURIComponent(`${productName} IKEA furniture`);
  const searchUrl = `https://www.google.com/search?q=${query}&tbm=isch&hl=en&gl=us`;

  console.log(`   🔍 Searching: ${productName}`);

  try {
    const response = await axios.post(
      'https://api.brightdata.com/request',
      {
        zone: SERP_ZONE,
        url: searchUrl,
        format: 'raw', // Get raw HTML
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BRIGHTDATA_API_KEY}`,
        },
        timeout: 30000,
      }
    );

    // Parse the HTML to extract image URLs
    const html = response.data;
    
    // Look for IKEA image URLs in the HTML
    const ikeaImageMatch = html.match(/https:\/\/www\.ikea\.com\/[^"'\s]+\.jpg/);
    if (ikeaImageMatch) {
      console.log(`   ✅ Found IKEA image`);
      return ikeaImageMatch[0];
    }

    // Fallback: look for any image URL
    const imageMatch = html.match(/https:\/\/[^"'\s]+\.(jpg|jpeg|png)/i);
    if (imageMatch) {
      console.log(`   ✅ Found image`);
      return imageMatch[0];
    }

    console.log(`   ⚠️  No image found`);
    return null;

  } catch (error: any) {
    console.error(`   ❌ SERP API Error:`, error.response?.data?.message || error.message);
    return null;
  }
}

/**
 * Download image from URL
 */
async function downloadImage(imageUrl: string, outputPath: string): Promise<boolean> {
  try {
    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'stream',
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const writer = createWriteStream(outputPath);
    await pipeline(response.data, writer);
    
    return true;
  } catch (error: any) {
    console.error(`   ❌ Download failed:`, error.message);
    return false;
  }
}

/**
 * Main function
 */
async function downloadAllImages(): Promise<void> {
  console.log('🚀 Starting IKEA Product Image Downloader');
  console.log('━'.repeat(60));
  console.log('');

  // Read the existing products JSON
  const dataDir = path.join(__dirname, '..', 'data');
  const productsPath = path.join(dataDir, 'top-50-products.json');

  if (!fs.existsSync(productsPath)) {
    console.error('❌ top-50-products.json not found!');
    console.log('   Run: npm run generate:top50');
    process.exit(1);
  }

  const products: Product[] = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
  console.log(`📊 Found ${products.length} products to process`);
  console.log('');

  // Create images directory
  const imagesDir = path.join(dataDir, 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
    console.log('📁 Created images directory');
  }

  const updatedProducts: Product[] = [];
  let successCount = 0;
  let failCount = 0;

  // Process each product
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`[${i + 1}/${products.length}] ${product.name}`);

    // Search for image using SERP API
    const imageUrl = await searchProductImage(product.name);

    if (imageUrl) {
      // Download the image
      const imageFilename = `${product.id}.jpg`;
      const imagePath = path.join(imagesDir, imageFilename);

      console.log(`   📥 Downloading...`);
      const downloaded = await downloadImage(imageUrl, imagePath);

      if (downloaded) {
        // Update product with local image path
        updatedProducts.push({
          ...product,
          imageUrl: `/products/${imageFilename}`, // Relative path for frontend
        });
        successCount++;
        console.log(`   💾 Saved to: ${imageFilename}`);
      } else {
        // Keep original URL if download fails
        updatedProducts.push(product);
        failCount++;
      }
    } else {
      // Keep original URL if no image found
      updatedProducts.push(product);
      failCount++;
    }

    console.log('');

    // Rate limiting: 2 seconds between requests
    if (i < products.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Save updated products JSON
  const updatedProductsPath = path.join(dataDir, 'top-50-products-local.json');
  fs.writeFileSync(updatedProductsPath, JSON.stringify(updatedProducts, null, 2));

  console.log('━'.repeat(60));
  console.log(`✅ Downloaded: ${successCount} images`);
  console.log(`❌ Failed: ${failCount} images`);
  console.log(`💾 Saved to: ${updatedProductsPath}`);
  console.log('');
  console.log('Next steps:');
  console.log('   1. Copy images to frontend: npm run copy:images');
  console.log('   2. Update frontend to use local images');
  console.log('');
}

// Run the downloader
if (require.main === module) {
  downloadAllImages()
    .then(() => {
      console.log('🎉 Image download complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('');
      console.error('💥 Download failed:', error.message);
      process.exit(1);
    });
}

export { downloadAllImages };

