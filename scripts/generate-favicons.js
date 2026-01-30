/**
 * Favicon Generator for ARU Learning
 * 
 * Generates all necessary favicon files from logo.svg
 * Uses Sharp library for high-quality image conversion
 * 
 * Usage:
 *   cd scripts && npm install && npm run generate-favicons
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const LOGO_SVG = path.join(__dirname, '../public/logo.svg');
const PUBLIC_DIR = path.join(__dirname, '../public');

const SIZES = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

async function generateFavicons() {
  console.log('🎨 Generating favicons from logo.svg...\n');

  // Check if logo.svg exists
  if (!fs.existsSync(LOGO_SVG)) {
    console.error(`❌ Error: ${LOGO_SVG} not found`);
    process.exit(1);
  }

  try {
    // Generate PNG files
    for (const { name, size } of SIZES) {
      const outputPath = path.join(PUBLIC_DIR, name);
      
      await sharp(LOGO_SVG)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ ${name} created (${size}x${size})`);
    }

    // Generate favicon.ico (multi-size)
    // Note: Sharp doesn't directly create .ico files, so we'll create a 32x32 PNG
    // and rename it. For true .ico support, consider using 'to-ico' package.
    const faviconPath = path.join(PUBLIC_DIR, 'favicon.png');
    await sharp(LOGO_SVG)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(faviconPath);
    
    console.log('✅ favicon.png created (32x32)');
    console.log('   Note: Rename to favicon.ico or use online converter');

    console.log('\n🎉 All favicons generated successfully!\n');
    console.log('Generated files:');
    console.log('  - favicon-16x16.png');
    console.log('  - favicon-32x32.png');
    console.log('  - apple-touch-icon.png');
    console.log('  - android-chrome-192x192.png');
    console.log('  - android-chrome-512x512.png');
    console.log('  - favicon.png (rename to .ico)');
    console.log('\n✅ Your application is now ready with all favicon files!');

  } catch (error) {
    console.error('❌ Error generating favicons:', error.message);
    process.exit(1);
  }
}

generateFavicons();
