import { formatBytes, toPercentage } from '../utils/helpers';

const CompressionResult = ({ result, onDownload }) => {
  return (
    <div className="bg-white/95 dark:bg-slate-900/70 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60">
      <img
        src={result.compressed_url}
        alt={result.filename}
        className="w-full h-44 object-cover rounded-xl"
      />
      <div className="mt-3 space-y-1">
        <p className="text-sm font-medium">{result.filename}</p>
        <p className="text-xs text-slate-500 dark:text-slate-300">
          {formatBytes(result.original_size)} → {formatBytes(result.compressed_size)}
        </p>
        <p className="text-xs text-emerald-600">
          Saved {toPercentage(result.compression_ratio)}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onDownload(result)}
        className="mt-3 inline-flex items-center justify-center w-full px-3 py-2 rounded-xl bg-ocean text-white text-sm"
      >
        Download
      </button>
    </div>
  );
};

export default CompressionResult;
