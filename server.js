const express = require('express');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { fromPath } = require("pdf2pic");

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

// Serve file statici dalla cartella "public"
app.use(express.static('public'));
app.use(express.json());

// Endpoint per la conversione di valute con tassi aggiornati
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
    // Chiamata all’API per ottenere i tassi aggiornati (qui usiamo exchangerate-api)
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/EUR');
    const rates = response.data.rates;
    const rateFrom = rates[from];
    const rateTo = rates[to];
    if (!rateFrom || !rateTo) {
      return res.status(400).json({ error: 'Unsupported currency' });
    }
    // Conversione: prima in EUR, poi nella valuta target
    const result = (amt / rateFrom) * rateTo;
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching exchange rates' });
  }
});

// Endpoint per la conversione dei file
app.post('/api/convertFile', upload.single('file'), async (req, res) => {
  const targetFormat = req.body.targetFormat; // es. "png", "jpg", "webp"
  const filePath = req.file.path;
  const originalName = req.file.originalname;
  const ext = path.extname(originalName).toLowerCase();
  
  try {
    if (ext === '.pdf') {
      // Conversione PDF → immagine (converte solo la prima pagina)
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
      res.download(resultObj.path, `converted.${targetFormat}`, err => {
        fs.unlinkSync(filePath);
        fs.unlinkSync(resultObj.path);
      });
    } else if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
      // Conversione tra formati immagine con Sharp
      const outputPath = `uploads/converted-${Date.now()}.${targetFormat}`;
      await sharp(filePath)
          .toFormat(targetFormat)
          .toFile(outputPath);
      res.download(outputPath, `converted.${targetFormat}`, err => {
        fs.unlinkSync(filePath);
        fs.unlinkSync(outputPath);
      });
    } else {
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
