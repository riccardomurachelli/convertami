const express = require('express');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { fromPath } = require("pdf2pic");
const ffmpeg = require('fluent-ffmpeg');
const { exec } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' });

// Serve file statici dalla cartella "public"
app.use(express.static('public'));
app.use(express.json());

/* --- ENDPOINTS PER LE VALUTE --- */

// Endpoint per ottenere l'elenco completo delle valute
app.get('/api/currencies', async (req, res) => {
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/EUR');
    const rates = response.data.rates;
    const currencies = Object.keys(rates);
    res.json({ currencies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching currencies list' });
  }
});

// Endpoint per convertire le valute usando tassi aggiornati
app.get('/api/currency', async (req, res) => {
  const { from, to, amount } = req.query;
  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  const amt = parseFloat(amount);
  if (isNaN(amt)) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/EUR');
    const rates = response.data.rates;
    const rateFrom = rates[from];
    const rateTo = rates[to];
    if (!rateFrom || !rateTo) {
      return res.status(400).json({ error: 'Unsupported currency' });
    }
    // Conversione: da "from" a EUR e poi da EUR a "to"
    const result = (amt / rateFrom) * rateTo;
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching exchange rates' });
  }
});

/* --- ENDPOINT PER LA CONVERSIONE DEI FILE --- */

app.post('/api/convertFile', upload.single('file'), async (req, res) => {
  const targetFormat = req.body.targetFormat.toLowerCase(); // es. png, jpg, mp3, mp4, pdf, ecc.
  const filePath = req.file.path;
  const originalName = req.file.originalname;
  const ext = path.extname(originalName).toLowerCase();

  try {
    // --- IMMAGINI ---
    if (['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)) {
      const outputPath = `uploads/converted-${Date.now()}.${targetFormat}`;
      await sharp(filePath)
          .toFormat(targetFormat)
          .toFile(outputPath);
      return res.download(outputPath, `converted.${targetFormat}`, err => {
        fs.unlinkSync(filePath);
        fs.unlinkSync(outputPath);
      });
    }
    // --- PDF (conversione in immagine, sola prima pagina) ---
    else if (ext === '.pdf') {
      const options = {
          density: 100,
          saveFilename: "converted",
          savePath: "./uploads",
          format: targetFormat,
          width: 600,
          height: 800
      };
      const storeAsImage = fromPath(filePath, options);
      const pageToConvert = 1;
      const resultObj = await storeAsImage(pageToConvert);
      return res.download(resultObj.path, `converted.${targetFormat}`, err => {
        fs.unlinkSync(filePath);
        fs.unlinkSync(resultObj.path);
      });
    }
    // --- AUDIO ---
    else if (['.mp3', '.wav', '.aac', '.flac', '.ogg'].includes(ext)) {
      const outputPath = `uploads/converted-${Date.now()}.${targetFormat}`;
      ffmpeg(filePath)
        .toFormat(targetFormat)
        .on('end', () => {
          res.download(outputPath, `converted.${targetFormat}`, err => {
            fs.unlinkSync(filePath);
            fs.unlinkSync(outputPath);
          });
        })
        .on('error', (err) => {
          console.error(err);
          fs.unlinkSync(filePath);
          res.status(500).json({ error: 'Audio conversion error' });
        })
        .save(outputPath);
    }
    // --- VIDEO ---
    else if (['.mp4', '.avi', '.mkv', '.mov', '.wmv'].includes(ext)) {
      const outputPath = `uploads/converted-${Date.now()}.${targetFormat}`;
      ffmpeg(filePath)
        .toFormat(targetFormat)
        .on('end', () => {
          res.download(outputPath, `converted.${targetFormat}`, err => {
            fs.unlinkSync(filePath);
            fs.unlinkSync(outputPath);
          });
        })
        .on('error', (err) => {
          console.error(err);
          fs.unlinkSync(filePath);
          res.status(500).json({ error: 'Video conversion error' });
        })
        .save(outputPath);
    }
    // --- DOCUMENTI (Word, Excel, PowerPoint, txt, odt, ecc.) ---
    else if (['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.odt'].includes(ext)) {
      // Utilizziamo LibreOffice (soffice) in modalità headless per convertire il documento.
      // Il targetFormat, ad es., può essere "pdf" oppure altri formati supportati da LibreOffice.
      const outputDir = path.join(__dirname, 'uploads');
      const command = `soffice --headless --convert-to ${targetFormat} --outdir ${outputDir} ${filePath}`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(error);
          fs.unlinkSync(filePath);
          return res.status(500).json({ error: 'Document conversion error' });
        }
        // Supponiamo che il file convertito abbia lo stesso nome base ma con nuova estensione
        const baseName = path.basename(filePath);
        const outputFileName = baseName + '.' + targetFormat;
        const outputPath = path.join(outputDir, outputFileName);
        // Attesa minima per assicurarsi che il file sia scritto
        setTimeout(() => {
          res.download(outputPath, `converted.${targetFormat}`, err => {
            fs.unlinkSync(filePath);
            fs.unlinkSync(outputPath);
          });
        }, 1500);
      });
    }
    // --- ALTRO: formato non supportato ---
    else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Unsupported file format' });
    }
  } catch (error) {
    console.error(error);
    fs.unlinkSync(filePath);
    res.status(500).json({ error: 'Conversion error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
