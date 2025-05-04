const sharp = require('sharp');
const path = require('path');

async function convert(inputPath, format) {
  const outputPath = path.join(
    path.dirname(inputPath),
    `converted-${Date.now()}.${format}`
  );
  await sharp(inputPath).toFormat(format).toFile(outputPath);
  return outputPath;
}

function cleanup(inputPath, outputPath) {
  [inputPath, outputPath].forEach(p => {
    try { require('fs').unlinkSync(p); } catch {};
  });
}

module.exports = { convert, cleanup };
