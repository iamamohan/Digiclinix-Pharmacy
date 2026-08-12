const sharp = require('sharp');
const path = require('path');

async function processHeroSlide(srcName, outName, leftW = 480, rightW = 480, bgColor = { r: 204, g: 234, b: 241, alpha: 1 }) {
  const srcPath = path.join(__dirname, '../public/images/hero', srcName);
  const outPath = path.join(__dirname, '../public/images/hero', outName);

  const W = 1920;
  const H = 1080;

  const img = sharp(srcPath);
  const fullResized = await img.resize(H, H).toBuffer();

  const leftBuf = await sharp(fullResized)
    .extract({ left: 0, top: 0, width: leftW, height: H })
    .toBuffer();

  const rightBuf = await sharp(fullResized)
    .extract({ left: H - rightW, top: 0, width: rightW, height: H })
    .toBuffer();

  const leftMaskSvg = `<svg width="${leftW}" height="${H}">
    <defs>
      <linearGradient id="g1" x1="0" y1="0" x2="100%" y2="0">
        <stop offset="0%" stop-color="#fff" stop-opacity="1"/>
        <stop offset="65%" stop-color="#fff" stop-opacity="1"/>
        <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="${leftW}" height="${H}" fill="url(#g1)"/>
  </svg>`;

  const rightMaskSvg = `<svg width="${rightW}" height="${H}">
    <defs>
      <linearGradient id="g2" x1="0" y1="0" x2="100%" y2="0">
        <stop offset="0%" stop-color="#fff" stop-opacity="0"/>
        <stop offset="35%" stop-color="#fff" stop-opacity="1"/>
        <stop offset="100%" stop-color="#fff" stop-opacity="1"/>
      </linearGradient>
    </defs>
    <rect width="${rightW}" height="${H}" fill="url(#g2)"/>
  </svg>`;

  const leftMaskBuf = await sharp(Buffer.from(leftMaskSvg)).png().toBuffer();
  const rightMaskBuf = await sharp(Buffer.from(rightMaskSvg)).png().toBuffer();

  const leftFeathered = await sharp(leftBuf)
    .ensureAlpha()
    .composite([{ input: leftMaskBuf, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const rightFeathered = await sharp(rightBuf)
    .ensureAlpha()
    .composite([{ input: rightMaskBuf, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const bgBuf = await sharp({
    create: {
      width: W,
      height: H,
      channels: 4,
      background: bgColor
    }
  }).png().toBuffer();

  await sharp(bgBuf)
    .composite([
      { input: leftFeathered, top: 0, left: 0 },
      { input: rightFeathered, top: 0, left: W - rightW }
    ])
    .png()
    .toFile(outPath);

  console.log(`Successfully created ${outName}`);
}

async function main() {
  await processHeroSlide('sky-blue-hero-1.png', 'sky-blue-hero-1-wide.png', 480, 480);
  await processHeroSlide('sky-blue-hero-2.png', 'sky-blue-hero-2-wide.png', 480, 480);
  await processHeroSlide('sky-blue-hero-3.png', 'sky-blue-hero-3-wide.png', 500, 500);
  // Also update hero-slide-3.png
  await processHeroSlide('sky-blue-hero-3.png', 'hero-slide-3.png', 500, 500);
}

main().catch(console.error);
