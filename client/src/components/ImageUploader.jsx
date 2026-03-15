import { useDropzone } from 'react-dropzone';
import { formatBytes } from '../utils/helpers';

const STATUS_LABELS = {
  queued: 'Queued',
  uploading: 'Uploading',
  done: 'Done',
  error: 'Error'
};

const ImageUploader = ({ items, onDrop, onRemove, onClear }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: 10 * 1024 * 1024,
    multiple: true,
    onDrop
  });

  return (
    <div className="glass rounded-3xl p-6 shadow-soft">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition ${
          isDragActive
            ? 'border-ocean bg-ocean/10'
            : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60'
        }`}
      >
        <input {...getInputProps()} />
        <p className="font-display text-lg">Drag & drop your images</p>
        <p className="text-sm text-slate-500 dark:text-slate-300 mt-2">
          Or click to browse. JPG, PNG, WebP up to 10MB.
        </p>
      </div>

      {items.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-display">Queued files</h4>
            <button
              type="button"
              onClick={onClear}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Clear all
            </button>
          </div>
          {items.map((item, index) => (
            <div
              key={item.id}
              className="bg-white/80 dark:bg-slate-900/70 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700/60 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.file.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">
                    {formatBytes(item.file.size)}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium ${
                    item.status === 'error' ? 'text-rose-500' : 'text-slate-500'
                  }`}
                >
                  {STATUS_LABELS[item.status] || 'Queued'}
                </span>
              </div>
              {item.status === 'uploading' && (
                <div className="w-full bg-fog rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-ocean h-full transition-all"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
              {item.error && <p className="text-xs text-rose-500">{item.error}</p>}
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-300">
                  {item.result ? 'Compressed' : 'Awaiting compression'}
                </p>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="text-xs uppercase tracking-wide text-rose-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
