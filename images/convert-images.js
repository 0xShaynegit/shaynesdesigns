const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertImages() {
  const imagesDir = process.cwd();
  const files = fs.readdirSync(imagesDir);
  const imageFiles = files.filter(f => /\.(png|jpg|jpeg|gif)$/i.test(f));
  
  console.log(`Found ${imageFiles.length} image files to process\n`);
  
  for (const file of imageFiles) {
    const inputPath = path.join(imagesDir, file);
    let newName = file.replace(/\.(png|jpg|jpeg|gif)$/i, '.webp');
    
    // Add prefix if not already there
    if (!newName.includes('shaynesdesigns-shaynes-designs')) {
      const baseName = newName.replace('.webp', '');
      newName = `shaynesdesigns-shaynes-designs-${baseName}.webp`;
    }
    
    const outputPath = path.join(imagesDir, newName);
    
    let quality = 80;
    
    try {
      // Try quality 80 first
      await sharp(inputPath)
        .webp({ quality })
        .toFile(outputPath);
      
      const stats = fs.statSync(outputPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      
      // If file is too large, reduce quality iteratively
      if (stats.size > 256000) { // 250KB threshold
        for (let q = 75; q >= 50; q -= 5) {
          fs.unlinkSync(outputPath);
          await sharp(inputPath)
            .webp({ quality: q })
            .toFile(outputPath);
          
          const newStats = fs.statSync(outputPath);
          if (newStats.size <= 256000) {
            console.log(`✓ ${file} → ${newName} (${(newStats.size / 1024).toFixed(2)}KB at quality ${q})`);
            break;
          }
        }
      } else {
        console.log(`✓ ${file} → ${newName} (${sizeKB}KB at quality ${quality})`);
      }
      
      // Remove original file if it's different from output
      if (inputPath !== outputPath && fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
      }
      
    } catch (err) {
      console.error(`✗ Error converting ${file}: ${err.message}`);
    }
  }
  
  console.log('\nConversion complete!');
}

convertImages().catch(console.error);
