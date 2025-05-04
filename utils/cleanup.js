const fs = require('fs');
const path = require('path');

module.exports = function() {
  const dir = path.join(__dirname, '../tmp/uploads');
  const now = Date.now();
  fs.readdir(dir, (err, files) => {
    if (err) return;
    files.forEach(file => {
      const fp = path.join(dir, file);
      fs.stat(fp, (e, stat) => {
        if (!e && now - stat.mtimeMs > 30 * 60 * 1000) {
          fs.unlink(fp, () => {});
        }
      });
    });
  });
};

