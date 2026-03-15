const path = require('path');
const sharp = require('sharp');

const QUALITY_MAP = {
  low: 80,
  medium: 60,
  high: 40
};

const PNG_COMPRESSION = {
  low: 3,
  medium: 6,
  high: 8
};

const getFormatFromExt = (ext) => {
  const normalized = ext.replace('.', '').toLowerCase();
  if (normalized === 'jpg') return 'jpeg';
  if (normalized === 'jpeg') return 'jpeg';
  if (normalized === 'png') return 'png';
  if (normalized === 'webp') return 'webp';
  if (normalized === 'avif') return 'avif';
  return 'jpeg';
};

const compressImage = async ({
  inputPath,
  outputPath,
  level,
  outputFormat,
  keepMetadata = false
}) => {
  const quality = QUALITY_MAP[level] || QUALITY_MAP.medium;
  const pngCompression = PNG_COMPRESSION[level] || PNG_COMPRESSION.medium;

  const ext = path.extname(inputPath);
  const detectedFormat = getFormatFromExt(ext);
  const finalFormat = outputFormat === 'auto' ? detectedFormat : outputFormat;

  // Sharp pipeline keeps memory usage low and supports format conversion.
  let pipeline = sharp(inputPath);

  if (keepMetadata) {
    pipeline = pipeline.withMetadata();
  }

  if (finalFormat === 'jpeg') {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true });
  }

  if (finalFormat === 'png') {
    pipeline = pipeline.png({ compressionLevel: pngCompression });
  }

  if (finalFormat === 'webp') {
    pipeline = pipeline.webp({ quality });
  }

  if (finalFormat === 'avif') {
    pipeline = pipeline.avif({ quality });
  }

  await pipeline.toFile(outputPath);

  return {
    format: finalFormat,
    quality
  };
};

module.exports = compressImage;
