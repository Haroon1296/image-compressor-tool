const express = require('express');
const upload = require('../middlewares/uploadMiddleware');
const {
  compressImages,
  getHistory,
  createZip,
  downloadCompressed
} = require('../controllers/compressionController');

const router = express.Router();

router.post('/compress', upload.array('images', 20), compressImages);
router.get('/history', getHistory);
router.post('/zip', express.json(), createZip);
router.get('/download/:filename', downloadCompressed);

module.exports = router;
