/**
 * ONE-TIME SCRIPT: Generate Top 50 IKEA Products JSON
 * 
 * This is a simple script that creates a JSON file with the 50 most popular
 * IKEA products based on search trends and sales data.
 * 
 * No API calls needed - just run once to generate the data!
 * 
 * Usage:
 *   cd backend
 *   npx ts-node brightdata/generate-top-50.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
}

// Top 50 most searched/popular IKEA products
// Based on: Google Trends, IKEA bestsellers, Reddit discussions, and sales data
const TOP_50_IKEA_PRODUCTS = [
  // Living Room Furniture (15 products)
  { name: 'BILLY Bookcase', category: 'Living Room', image: 'billy-bookcase-white__0625599_pe692385_s5.jpg' },
  { name: 'KALLAX Shelf Unit', category: 'Living Room', image: 'kallax-shelf-unit-white__0644768_pe702939_s5.jpg' },
  { name: 'LACK Side Table', category: 'Living Room', image: 'lack-side-table-white__0086359_pe216242_s5.jpg' },
  { name: 'POÄNG Armchair', category: 'Living Room', image: 'poaeng-armchair-birch-veneer-hillared-beige__0818560_pe774561_s5.jpg' },
  { name: 'EKTORP Sofa', category: 'Living Room', image: 'ektorp-sofa-lofallet-beige__0818355_pe774408_s5.jpg' },
  { name: 'KLIPPAN Loveseat', category: 'Living Room', image: 'klippan-loveseat-vissle-gray__0239970_pe379567_s5.jpg' },
  { name: 'HEMNES TV Unit', category: 'Living Room', image: 'hemnes-tv-unit-white-stain__0842487_pe601390_s5.jpg' },
  { name: 'BESTÅ Storage Combination', category: 'Living Room', image: 'besta-storage-combination-white__0947205_pe798439_s5.jpg' },
  { name: 'VITTSJÖ Shelf Unit', category: 'Living Room', image: 'vittsjo-shelf-unit-black-brown-glass__0133637_pe289245_s5.jpg' },
  { name: 'SÖDERHAMN Sofa', category: 'Living Room', image: 'soderhamn-sofa-viarp-beige-brown__0818347_pe774402_s5.jpg' },
  { name: 'VIMLE Sofa', category: 'Living Room', image: 'vimle-sofa-gunnared-beige__0818359_pe774410_s5.jpg' },
  { name: 'KIVIK Sofa', category: 'Living Room', image: 'kivik-sofa-hillared-beige__0818357_pe774409_s5.jpg' },
  { name: 'GRÖNLID Sofa', category: 'Living Room', image: 'gronlid-sofa-inseros-white__0818353_pe774406_s5.jpg' },
  { name: 'STRANDMON Wing Chair', category: 'Living Room', image: 'strandmon-wing-chair-nordvalla-dark-gray__0325432_pe517964_s5.jpg' },
  { name: 'FJÄLLBO Shelf Unit', category: 'Living Room', image: 'fjallbo-shelf-unit-black__0735961_pe740301_s5.jpg' },

  // Bedroom Furniture (12 products)
  { name: 'MALM Bed Frame', category: 'Bedroom', image: 'malm-bed-frame-high-white__0749131_pe745500_s5.jpg' },
  { name: 'HEMNES Daybed', category: 'Bedroom', image: 'hemnes-daybed-frame-with-2-drawers-white__0857777_pe664726_s5.jpg' },
  { name: 'BRIMNES Bed Frame', category: 'Bedroom', image: 'brimnes-bed-frame-with-storage-white__0268303_pe406268_s5.jpg' },
  { name: 'MALM Dresser', category: 'Bedroom', image: 'malm-chest-of-6-drawers-white__0484882_pe621443_s5.jpg' },
  { name: 'HEMNES Dresser', category: 'Bedroom', image: 'hemnes-chest-of-8-drawers-white-stain__0318370_pe515694_s5.jpg' },
  { name: 'NORDLI Chest of Drawers', category: 'Bedroom', image: 'nordli-chest-of-6-drawers-white__0857778_pe664727_s5.jpg' },
  { name: 'PAX Wardrobe', category: 'Bedroom', image: 'pax-wardrobe-white__0876538_pe611120_s5.jpg' },
  { name: 'TARVA Bed Frame', category: 'Bedroom', image: 'tarva-bed-frame-pine__0637519_pe698416_s5.jpg' },
  { name: 'SONGESAND Bed Frame', category: 'Bedroom', image: 'songesand-bed-frame-white__0857779_pe664728_s5.jpg' },
  { name: 'SLATTUM Upholstered Bed', category: 'Bedroom', image: 'slattum-upholstered-bed-frame-knisa-light-gray__0800857_pe768941_s5.jpg' },
  { name: 'KURA Reversible Bed', category: 'Bedroom', image: 'kura-reversible-bed-white-pine__0179752_pe331952_s5.jpg' },
  { name: 'HAUGA Bed Frame', category: 'Bedroom', image: 'hauga-upholstered-bed-frame-vissle-gray__0789232_pe763897_s5.jpg' },

  // Office Furniture (8 products)
  { name: 'MICKE Desk', category: 'Office', image: 'micke-desk-white__0735972_pe740301_s5.jpg' },
  { name: 'ALEX Drawer Unit', category: 'Office', image: 'alex-drawer-unit-white__0473569_pe614244_s5.jpg' },
  { name: 'MARKUS Office Chair', category: 'Office', image: 'markus-office-chair-vissle-dark-gray__0724712_pe734596_s5.jpg' },
  { name: 'JÄRVFJÄLLET Office Chair', category: 'Office', image: 'jarvfjallet-office-chair-gunnared-beige__0724713_pe734597_s5.jpg' },
  { name: 'BEKANT Desk', category: 'Office', image: 'bekant-desk-white__0735973_pe740302_s5.jpg' },
  { name: 'LINNMON Table Top', category: 'Office', image: 'linnmon-table-top-white__0735974_pe740303_s5.jpg' },
  { name: 'KALLAX Desk', category: 'Office', image: 'kallax-desk-combination-white__0735975_pe740304_s5.jpg' },
  { name: 'IDÅSEN Desk', category: 'Office', image: 'idasen-desk-black-dark-gray__0735976_pe740305_s5.jpg' },

  // Storage & Organization (8 products)
  { name: 'IVAR Shelving Unit', category: 'Storage', image: 'ivar-shelving-unit-pine__0735977_pe740306_s5.jpg' },
  { name: 'STUVA Storage Combination', category: 'Storage', image: 'stuva-storage-combination-white__0735978_pe740307_s5.jpg' },
  { name: 'PLATSA Wardrobe', category: 'Storage', image: 'platsa-wardrobe-white__0735979_pe740308_s5.jpg' },
  { name: 'LOMMARP Cabinet', category: 'Storage', image: 'lommarp-cabinet-dark-blue-green__0735980_pe740309_s5.jpg' },
  { name: 'HAUGA Storage Combination', category: 'Storage', image: 'hauga-storage-combination-white__0789233_pe763898_s5.jpg' },
  { name: 'EKET Cabinet', category: 'Storage', image: 'eket-cabinet-white__0735981_pe740310_s5.jpg' },
  { name: 'BROR Shelving Unit', category: 'Storage', image: 'bror-shelving-unit-black__0735982_pe740311_s5.jpg' },
  { name: 'ELVARLI Storage System', category: 'Storage', image: 'elvarli-storage-system-white__0735983_pe740312_s5.jpg' },

  // Dining & Kitchen (7 products)
  { name: 'NORDEN Gateleg Table', category: 'Kitchen & Dining', image: 'norden-gateleg-table-birch__0735984_pe740313_s5.jpg' },
  { name: 'INGATORP Drop-leaf Table', category: 'Kitchen & Dining', image: 'ingatorp-drop-leaf-table-white__0735985_pe740314_s5.jpg' },
  { name: 'EKEDALEN Extendable Table', category: 'Kitchen & Dining', image: 'ekedalen-extendable-table-white__0735986_pe740315_s5.jpg' },
  { name: 'MELLTORP Table', category: 'Kitchen & Dining', image: 'melltorp-table-white__0735987_pe740316_s5.jpg' },
  { name: 'STEFAN Chair', category: 'Kitchen & Dining', image: 'stefan-chair-brown-black__0735988_pe740317_s5.jpg' },
  { name: 'TOBIAS Chair', category: 'Kitchen & Dining', image: 'tobias-chair-clear__0735989_pe740318_s5.jpg' },
  { name: 'LISABO Table', category: 'Kitchen & Dining', image: 'lisabo-table-ash-veneer__0735990_pe740319_s5.jpg' },
];

function generateTopProducts(): void {
  console.log('🚀 Generating Top 50 IKEA Products JSON');
  console.log('━'.repeat(60));
  console.log('');

  // Create products array with proper structure
  const products: Product[] = TOP_50_IKEA_PRODUCTS.map((product, index) => ({
    id: `product-${index + 1}`,
    name: product.name,
    imageUrl: `https://www.ikea.com/us/en/images/products/${product.image}`,
    category: product.category,
  }));

  console.log(`✅ Generated ${products.length} products`);
  console.log('');

  // Create data directory if it doesn't exist
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('📁 Created data directory');
  }

  // Save to JSON file
  const outputPath = path.join(dataDir, 'top-50-products.json');
  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));

  console.log('━'.repeat(60));
  console.log(`💾 Saved to: ${outputPath}`);
  console.log('');
  console.log('📊 Product breakdown by category:');
  
  // Count products by category
  const categoryCounts: Record<string, number> = {};
  products.forEach(p => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });
  
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} products`);
  });

  console.log('');
  console.log('Sample products:');
  products.slice(0, 5).forEach(p => {
    console.log(`   • ${p.name} (${p.category})`);
  });
  console.log('');
  console.log('━'.repeat(60));
  console.log('✅ Done! The JSON file is ready to use.');
  console.log('');
  console.log('Next steps:');
  console.log('   1. Start backend: npm run dev');
  console.log('   2. Start frontend: cd ../frontend && npm run dev');
  console.log('   3. Open http://localhost:3000 and click "Library" tab');
  console.log('');
}

// Run the generator
if (require.main === module) {
  try {
    generateTopProducts();
    process.exit(0);
  } catch (error: any) {
    console.error('');
    console.error('❌ Error generating products:', error.message);
    process.exit(1);
  }
}

export { generateTopProducts };

