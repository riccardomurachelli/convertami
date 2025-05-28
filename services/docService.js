const fs = require('fs');
const path = require('path');
const libre = require('libreoffice-convert');

async function convert(inputPath, format) {
  return new Promise((resolve, reject) => {
    const ext = `.${format}`;
    const outputPath = path.join(
      path.dirname(inputPath),
      path.basename(inputPath, path.extname(inputPath)) + ext
    );

    // Legge il file in un buffer
    fs.readFile(inputPath, (readErr, data) => {
      if (readErr) return reject(readErr);

      // Converte il buffer
      libre.convert(data, ext, undefined, (convertErr, done) => {
        if (convertErr) return reject(convertErr);

        // Scrive il buffer convertito su file
        fs.writeFile(outputPath, done, writeErr => {
          if (writeErr) return reject(writeErr);
          resolve(outputPath);
        });
      });
    });
  });
}

function cleanup(...paths) {
  for (const p of paths) {
    try { fs.unlinkSync(p); }
    catch (e) { /* ignora errori */ }
  }
}

module.exports = { convert, cleanup };
