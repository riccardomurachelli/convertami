const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const path = require('path');

function convert(inputPath, format) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(
      path.dirname(inputPath),
      `converted-${Date.now()}.${format}`
    );
    ffmpeg(inputPath)
      .toFormat(format)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .save(outputPath);
  });
}

function cleanup(inputPath, outputPath) {
  [inputPath, outputPath].forEach(p => {
    try { require('fs').unlinkSync(p); } catch {};
  });
}

module.exports = { convert, cleanup };

