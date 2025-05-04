// Simple JSON-based counter without lowdb to avoid ESM issues
const fs = require('fs');
const path = require('path');

const statsFile = path.join(__dirname, '../stats.json');

// Read stats JSON, or initialize if missing
function readStats() {
  try {
    const content = fs.readFileSync(statsFile, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return { total: 0 };
  }
}

// Write stats JSON
function writeStats(data) {
  fs.writeFileSync(statsFile, JSON.stringify(data, null, 2));
}

module.exports = {
  increment: async () => {
    const stats = readStats();
    stats.total = (stats.total || 0) + 1;
    writeStats(stats);
  },
  getTotalCount: () => {
    const stats = readStats();
    return stats.total || 0;
  }
};
