const fs = require('fs/promises');
const path = require('path');

const removeOldFiles = async (dir, cutoffTime) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      if (!entry.isFile()) return;
      if (entry.name === '.gitkeep') return;
      const filePath = path.join(dir, entry.name);
      const stat = await fs.stat(filePath);
      if (stat.mtimeMs < cutoffTime) {
        await fs.unlink(filePath);
      }
    })
  );
};

const cleanupOldUploads = async (ttlHours) => {
  const cutoffTime = Date.now() - ttlHours * 60 * 60 * 1000;
  const originalDir = path.join(__dirname, '..', 'uploads', 'original');
  const compressedDir = path.join(__dirname, '..', 'uploads', 'compressed');

  await Promise.all([
    removeOldFiles(originalDir, cutoffTime),
    removeOldFiles(compressedDir, cutoffTime)
  ]);
};

module.exports = cleanupOldUploads;
