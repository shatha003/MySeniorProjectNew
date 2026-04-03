const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const toIco = require('to-ico');

const inputPath = path.join(__dirname, 'pic', 'icon.png');
const outputDir = path.join(__dirname, 'src-tauri', 'icons');

async function generateIcons() {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`Original dimensions: ${metadata.width}x${metadata.height}`);
    
    const size = Math.max(metadata.width, metadata.height);
    
    const resized = image.resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
    });
    
    const pngBuffer = await resized.png().toBuffer();
    
    const sizes = [32, 128, 256, 512];
    
    for (const s of sizes) {
        await sharp(pngBuffer)
            .resize(s, s)
            .png()
            .toFile(path.join(outputDir, `${s}x${s}.png`));
        console.log(`Created ${s}x${s}.png`);
    }
    
    await sharp(pngBuffer)
        .resize(128, 128)
        .png()
        .toFile(path.join(outputDir, '128x128@2x.png'));
    console.log('Created 128x128@2x.png');
    
    await sharp(pngBuffer)
        .resize(256, 256)
        .png()
        .toFile(path.join(outputDir, 'icon.png'));
    console.log('Created icon.png');
    
    const icoBuffer = await toIco([
        await sharp(pngBuffer).resize(256, 256).png().toBuffer()
    ]);
    fs.writeFileSync(path.join(outputDir, 'icon.ico'), icoBuffer);
    console.log('Created icon.ico');
    
    console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);
