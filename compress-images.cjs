const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

async function compressImages() {
  const files = fs.readdirSync(publicDir);
  const images = files.filter(f => /\.(png|jpe?g)$/i.test(f));

  console.log('Compressing images...');

  for (const file of images) {
    const filePath = path.join(publicDir, file);
    const ext = path.extname(file).toLowerCase();

    try {
      let info = await sharp(filePath).metadata();
      const originalSize = fs.statSync(filePath).size;

      if (ext === '.png') {
        await sharp(filePath)
          .png({ quality: 80, compressionLevel: 9 })
          .toFile(filePath + '.tmp');
      } else {
        await sharp(filePath)
          .jpeg({ quality: 80, mozjpeg: true })
          .toFile(filePath + '.tmp');
      }

      const newSize = fs.statSync(filePath + '.tmp').size;
      fs.unlinkSync(filePath);
      fs.renameSync(filePath + '.tmp', filePath);

      const saved = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      console.log(`${file}: ${(originalSize/1024).toFixed(1)}KB -> ${(newSize/1024).toFixed(1)}KB (saved ${saved}%)`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  }

  console.log('Done!');
}

compressImages();
