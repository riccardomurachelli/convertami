const { exec } = require('child_process');
const path = require('path');

function convert(inputPath, format) {
  return new Promise((resolve, reject) => {
    const outDir = path.dirname(inputPath);
    const cmd = `soffice --headless --convert-to ${format} --outdir ${outDir} ${inputPath}`;
    exec(cmd, (err) => {
      if (err) return reject(err);
      const base = path.basename(inputPath);
      const outputPath = path.join(outDir, `${base}.${format}`);
      // wait a moment to ensure file write
      setTimeout(() => resolve(outputPath), 500);
    });
  });
}

function cleanup(inputPath, outputPath) {
  [inputPath, outputPath].forEach(p => {
    try { require('fs').unlinkSync(p); } catch {};
  });
}

module.exports = { convert, cleanup };

