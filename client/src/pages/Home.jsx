import { useEffect, useMemo, useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import CompressionOptions from '../components/CompressionOptions';
import CompressionResult from '../components/CompressionResult';
import { compressSingle, createZip, fetchHistory } from '../services/api';
import { downloadFile, formatBytes, supportsImageFormat } from '../utils/helpers';

const Home = () => {
  const [items, setItems] = useState([]);
  const [level, setLevel] = useState('medium');
  const defaultFormat = useMemo(() => 'auto', []);
  const [format, setFormat] = useState(defaultFormat);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zipUrl, setZipUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory()
      .then((data) => setHistory(data.logs || []))
      .catch(() => null);
  }, []);

  const handleDrop = (acceptedFiles) => {
    const enriched = acceptedFiles.map((file, index) => ({
      id: crypto.randomUUID ? crypto.randomUUID() : `${file.name}-${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'queued',
      progress: 0,
      result: null,
      error: ''
    }));
    setItems((prev) => [...prev, ...enriched]);
    setError('');
  };

  const handleRemove = (index) => {
    setItems((prev) => {
      const next = [...prev];
      const removed = next.splice(index, 1);
      if (removed[0]) URL.revokeObjectURL(removed[0].preview);
      return next;
    });
  };

  const handleClear = () => {
    items.forEach((item) => URL.revokeObjectURL(item.preview));
    setItems([]);
  };

  const updateItem = (id, patch) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const handleCompress = async () => {
    if (!items.length) return;
    setLoading(true);
    setError('');
    setResults([]);
    setZipUrl('');

    try {
      const collectedResults = [];

      for (const item of items) {
        updateItem(item.id, { status: 'uploading', progress: 0, error: '' });
        try {
          const data = await compressSingle({
            file: item.file,
            level,
            format,
            onUploadProgress: (progressEvent) => {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              updateItem(item.id, { progress: percent });
            }
          });
          const result = data.results?.[0];
          if (result) {
            collectedResults.push(result);
            updateItem(item.id, { status: 'done', progress: 100, result });
          } else {
            updateItem(item.id, {
              status: 'error',
              error: 'No result returned.'
            });
          }
        } catch (err) {
          updateItem(item.id, {
            status: 'error',
            error: err.response?.data?.error || 'Compression failed.'
          });
        }
      }

      setResults(collectedResults);

      if (collectedResults.length) {
        const zipData = await createZip(collectedResults.map((item) => item.filename));
        setZipUrl(zipData.zip_url || '');
      }

      const historyData = await fetchHistory();
      setHistory(historyData.logs || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Compression failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (result) => {
    try {
      await downloadFile(result.download_url, result.filename);
    } catch (err) {
      window.open(result.download_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleZipDownload = async () => {
    if (!zipUrl) return;
    try {
      await downloadFile(zipUrl, 'compressed_images.zip');
    } catch (err) {
      window.open(zipUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <section className="text-center pt-6">
        <h1 className="font-display text-4xl md:text-5xl text-ink dark:text-slate-100">
          Compress images without the bloat.
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mt-4 max-w-2xl mx-auto">
          Drop multiple files, choose your compression level, and download crisp,
          lightweight images in seconds.
        </p>
      </section>

      <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
        <ImageUploader
          items={items}
          onDrop={handleDrop}
          onRemove={handleRemove}
          onClear={handleClear}
        />
        <CompressionOptions
          level={level}
          onLevelChange={setLevel}
          format={format}
          onFormatChange={setFormat}
        />
      </section>

      <section className="glass rounded-3xl p-6 shadow-soft space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">Ready to compress</h2>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            {items.length} file(s) queued • {format.toUpperCase()} • {level}
          </p>
        </div>
          <button
            type="button"
            onClick={handleCompress}
            disabled={loading || items.length === 0}
            className="px-6 py-3 rounded-full bg-citrus text-ink font-medium shadow-soft disabled:opacity-60"
          >
            {loading ? 'Compressing...' : 'Compress now'}
          </button>
        </div>

        {loading && (
          <p className="text-sm text-slate-500 dark:text-slate-300 animate-pulse">
            Working through your images...
          </p>
        )}

        {error && <p className="text-sm text-rose-500">{error}</p>}
      </section>

      {items.length > 0 && (
        <section className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-display text-xl">Originals</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {items.map((item) => (
                <ImagePreview key={item.id} file={item.file} previewUrl={item.preview} />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">Compressed</h3>
              {zipUrl && (
                <button
                  type="button"
                  onClick={handleZipDownload}
                  className="text-sm text-ocean underline"
                >
                  Download ZIP
                </button>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {results.map((result) => (
                <CompressionResult
                  key={result.filename}
                  result={result}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="glass rounded-3xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl">Recent history</h3>
          <span className="text-xs text-slate-500 dark:text-slate-300">Last 100 entries</span>
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-300">No compression logs yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500 dark:text-slate-300">
                <tr>
                  <th className="py-2">Filename</th>
                  <th className="py-2">Original</th>
                  <th className="py-2">Compressed</th>
                  <th className="py-2">Saved</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="py-2">{item.filename}</td>
                    <td className="py-2">{formatBytes(item.original_size)}</td>
                    <td className="py-2">{formatBytes(item.compressed_size)}</td>
                    <td className="py-2 text-emerald-600">{item.compression_ratio}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
