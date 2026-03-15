import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
});

// Sends a single file as multipart with compression options.
export const compressSingle = async ({ file, level, format, onUploadProgress }) => {
  const formData = new FormData();
  formData.append('images', file);
  formData.append('level', level);
  formData.append('format', format);

  const response = await api.post('/compress', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress
  });

  return response.data;
};

export const fetchHistory = async () => {
  const response = await api.get('/history');
  return response.data;
};

export const createZip = async (files) => {
  const response = await api.post('/zip', { files });
  return response.data;
};

export default api;
