const express = require('express');
const router = express.Router();
const upload = require('../config/storage');
const imageService = require('../services/imageService');
const stats = require('../utils/stats');

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const outputPath = await imageService.convert(req.file.path, req.body.targetFormat);
    stats.increment();
    res.download(outputPath, `converted.${req.body.targetFormat}`, err => {
      res.on('finish', () => imageService.cleanup(req.file.path, outputPath));
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Image conversion failed' });
  }
});

module.exports = router;
