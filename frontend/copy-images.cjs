const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\bigchella\\.gemini\\antigravity-ide\\brain\\016c3011-23b1-41bc-8e7a-89fd42779226';
const destDir = 'c:\\Users\\bigchella\\BAMBE BOY\\BAMBE BOY\\public\\images';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const fileMap = {
  'hero_dispatch_banner_1786101644526.png': 'hero_banner.png',
  'gas_delivery_1786101656377.png': 'gas_delivery.png',
  'market_shopping_1786101667621.png': 'market_shopping.png',
  'back_to_school_1786101679712.png': 'back_to_school.png',
  'deep_cleaning_black_1786101848012.png': 'deep_cleaning.png',
  'digital_security_1786101703702.png': 'digital_security.png',
  'beauty_hair_1786101715841.png': 'beauty_hair.png',
  'home_repairs_black_1786101860315.png': 'home_repairs.png',
  'avatar_emmanuel_1786101754675.png': 'avatar_emmanuel.png',
  'avatar_vanessa_1786101770880.png': 'avatar_vanessa.png',
};

for (const [srcName, destName] of Object.entries(fileMap)) {
  const srcPath = path.join(srcDir, srcName);
  const destPath = path.join(destDir, destName);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${srcName} -> ${destName}`);
  }
}
