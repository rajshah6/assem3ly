/**
 * Update frontend data file with local image paths
 * 
 * Usage:
 *   cd backend
 *   npm run update:frontend-data
 */

import * as fs from 'fs';
import * as path from 'path';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
}

function updateFrontendData(): void {
  console.log('🔄 Updating frontend data with local image paths...');
  console.log('');

  // Read the products JSON with local paths
  const dataDir = path.join(__dirname, '..', 'data');
  const productsPath = path.join(dataDir, 'top-50-products-local.json');

  if (!fs.existsSync(productsPath)) {
    console.error('❌ top-50-products-local.json not found!');
    console.log('   Run: npm run download:images first');
    process.exit(1);
  }

  const products: Product[] = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

  // Generate TypeScript file content
  const tsContent = `/**
 * Top 50 IKEA Products - Static Data with Local Images
 * Images downloaded using Bright Data SERP API
 * Generated automatically - do not edit manually
 */

import { Manual } from './api-client';

export const TOP_50_PRODUCTS: Manual[] = ${JSON.stringify(products, null, 2)};
`;

  // Write to frontend
  const frontendDataPath = path.join(__dirname, '..', '..', 'frontend', 'lib', 'top-50-data.ts');
  fs.writeFileSync(frontendDataPath, tsContent);

  console.log('✅ Updated frontend/lib/top-50-data.ts');
  console.log(`   ${products.length} products with local image paths`);
  console.log('');
  console.log('Next step:');
  console.log('   Restart frontend: cd frontend && npm run dev');
}

if (require.main === module) {
  try {
    updateFrontendData();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

export { updateFrontendData };

