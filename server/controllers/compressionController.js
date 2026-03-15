const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const archiver = require('archiver');
const TaskQueue = require('../utils/taskQueue');
const CompressionLog = require('../models/CompressionLog');
const compressImage = require('../utils/compressImage');
const queue = new TaskQueue(Number(process.env.MAX_CONCURRENT_JOBS) || 2);

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_LEVELS = new Set(['low', 'medium', 'high']);
const ALLOWED_FORMATS = new Set(['auto', 'jpeg', 'png', 'webp', 'avif']);

let cachedFileTypeFromFile = null;
const getFileTypeFromFile = async () => {
  if (!cachedFileTypeFromFile) {
    const module = await import('file-type');
    cachedFileTypeFromFile = module.fileTypeFromFile;
  }
  return cachedFileTypeFromFile;
};

const buildUrl = (baseUrl, filePath) => {
  const normalized = filePath.replace(/\\\\/g, '/');
  const trimmedBase = baseUrl.replace(/\/+$/, '');
  const trimmedPath = normalized.replace(/^\/+/, '');
  return `${trimmedBase}/${trimmedPath}`;
};

const compressImages = async (req, res, next) => {
  try {
    const { level = 'medium', format = 'auto' } = req.body;
    const files = req.files || [];
    const clientId = req.get('x-client-id');

    if (!files.length) {
      return res.status(400).json({ error: 'No files received.' });
    }
    if (!clientId) {
      return res.status(400).json({ error: 'Missing client id.' });
    }

    if (!ALLOWED_LEVELS.has(level)) {
      return res.status(400).json({ error: 'Invalid compression level.' });
    }

    if (!ALLOWED_FORMATS.has(format)) {
      return res.status(400).json({ error: 'Invalid output format.' });
    }

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const results = [];

    for (const file of files) {
      const inputPath = file.path;
      const originalSize = file.size;

      const originalExt = path.extname(file.originalname).replace('.', '').toLowerCase();
      const finalExt = format === 'auto' ? originalExt : format;
      const safeBase = path
        .parse(file.originalname)
        .name.replace(/[^a-zA-Z0-9_-]+/g, '_')
        .slice(0, 40);
      const suffix = path.parse(file.filename).name.slice(0, 8);
      const outputName = `${safeBase || 'image'}-${suffix}.${finalExt}`;
      const outputPath = path.join(__dirname, '..', 'uploads', 'compressed', outputName);

      const fileTypeFromFile = await getFileTypeFromFile();
      const detected = await fileTypeFromFile(inputPath);
      if (!detected || !ALLOWED_MIME.has(detected.mime)) {
        await fsp.unlink(inputPath);
        const error = new Error('Invalid image type. Only JPG, PNG, and WebP are allowed.');
        error.status = 400;
        throw error;
      }

      await queue.add(() =>
        compressImage({
          inputPath,
          outputPath,
          level,
          outputFormat: format,
          keepMetadata: false
        })
      );

      const compressedStat = await fsp.stat(outputPath);
      const compressedSize = compressedStat.size;
      const ratio = Number(((1 - compressedSize / originalSize) * 100).toFixed(2));

      await CompressionLog.create({
        filename: outputName,
        original_size: originalSize,
        compressed_size: compressedSize,
        compression_ratio: ratio,
        client_id: clientId
      });

      results.push({
        filename: outputName,
        original_size: originalSize,
        compressed_size: compressedSize,
        compression_ratio: ratio,
        original_url: buildUrl(baseUrl, `uploads/original/${file.filename}`),
        compressed_url: buildUrl(baseUrl, `uploads/compressed/${outputName}`),
        download_url: buildUrl(baseUrl, `api/download/${outputName}`)
      });
    }

    res.json({ results });
  } catch (err) {
    next(err);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const clientId = req.get('x-client-id');
    if (!clientId) {
      return res.json({ logs: [] });
    }
    const logs = await CompressionLog.findAll({
      where: { client_id: clientId },
      order: [['created_at', 'DESC']],
      limit: 100
    });
    res.json({ logs });
  } catch (err) {
    next(err);
  }
};

const createZip = async (req, res, next) => {
  try {
    const { files } = req.body;
    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'No files provided for ZIP.' });
    }

    const zipName = `compressed_${Date.now()}.zip`;
    const zipPath = path.join(__dirname, '..', 'uploads', 'compressed', zipName);

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);

    for (const fileName of files) {
      const filePath = path.join(__dirname, '..', 'uploads', 'compressed', fileName);
      archive.file(filePath, { name: fileName });
    }

    await archive.finalize();

    await new Promise((resolve, reject) => {
      output.on('close', resolve);
      output.on('error', reject);
    });

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    res.json({ zip_url: buildUrl(baseUrl, `api/download/${zipName}`) });
  } catch (err) {
    next(err);
  }
};

const downloadCompressed = async (req, res, next) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(__dirname, '..', 'uploads', 'compressed', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found.' });
    }

    res.download(filePath, filename);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  compressImages,
  getHistory,
  createZip,
  downloadCompressed
};
