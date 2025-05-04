const express = require('express');
const router = express.Router();
const upload = require('../config/storage');
const videoService = require('../services/videoService');
const stats = require('../utils/stats');

router.post('/', upload.single('file'), (req, res) => {
  const target = req.body.targetFormat;
  videoService.convert(req.file.path, target)
    .then(outputPath => {
      stats.increment();
      res.download(outputPath, `converted.${target}`, err => {
        res.on('finish', () => videoService.cleanup(req.file.path, outputPath));
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Video conversion failed' });
    });
});

module.exports = router;

