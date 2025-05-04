const multer = require('multer');
const path = require('path');

const upload = multer({
  dest: path.join(__dirname, '../tmp/uploads'),
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB
});

module.exports = upload;
