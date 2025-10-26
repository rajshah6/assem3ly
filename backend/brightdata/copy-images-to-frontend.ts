/**
 * Copy downloaded images to frontend public directory
 * 
 * Usage:
 *   cd backend
 *   npm run copy:images
 */

import * as fs from 'fs';
import * as path from 'path';

function copyImages(): void {
  console.log('📦 Copying images to frontend...');
  console.log('');

  const backendImagesDir = path.join(__dirname, '..', 'data', 'images');
  const frontendPublicDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'products');

  // Check if source directory exists
  if (!fs.existsSync(backendImagesDir)) {
    console.error('❌ Backend images directory not found!');
    console.log('   Run: npm run download:images first');
    process.exit(1);
  }

  // Create frontend public/products directory
  if (!fs.existsSync(frontendPublicDir)) {
    fs.mkdirSync(frontendPublicDir, { recursive: true });
    console.log('📁 Created frontend/public/products directory');
  }

  // Copy all images
  const files = fs.readdirSync(backendImagesDir);
  let copiedCount = 0;

  files.forEach(file => {
    if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
      const sourcePath = path.join(backendImagesDir, file);
      const destPath = path.join(frontendPublicDir, file);
      
      fs.copyFileSync(sourcePath, destPath);
      copiedCount++;
      console.log(`   ✅ Copied: ${file}`);
    }
  });

  console.log('');
  console.log(`✅ Copied ${copiedCount} images to frontend/public/products/`);
  console.log('');
  console.log('Next step:');
  console.log('   Update frontend/lib/top-50-data.ts to use /products/[filename].jpg');
}

if (require.main === module) {
  try {
    copyImages();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

export { copyImages };

