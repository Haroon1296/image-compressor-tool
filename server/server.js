require('dotenv').config();
const cron = require('node-cron');
const app = require('./app');
const db = require('./models');
const cleanupOldUploads = require('./utils/cleanupOldUploads');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    // Optional auto-sync for local development.
    if (process.env.DB_SYNC === 'true') {
      await db.sequelize.sync();
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Nightly cleanup of old uploads to keep storage in check.
    const ttlHours = Number(process.env.UPLOAD_TTL_HOURS) || 24;
    cron.schedule('0 2 * * *', () => {
      cleanupOldUploads(ttlHours).catch((err) => {
        console.error('Cleanup failed:', err.message);
      });
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
