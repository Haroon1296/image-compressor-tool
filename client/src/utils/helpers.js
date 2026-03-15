export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
  return `${value} ${sizes[i]}`;
};

export const toPercentage = (value) => `${value.toFixed(2)}%`;

export const downloadFile = async (url, filename) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to download file.');
  }
  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  if (filename) link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
};

export const supportsImageFormat = (type) => {
  const canvas = document.createElement('canvas');
  if (!canvas.getContext) return false;
  return canvas.toDataURL(type).startsWith(`data:${type}`);
};
