import { formatBytes } from '../utils/helpers';

const ImagePreview = ({ file, previewUrl }) => {
  return (
    <div className="bg-white/90 dark:bg-slate-900/70 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60">
      <img
        src={previewUrl}
        alt={file.name}
        className="w-full h-44 object-cover rounded-xl"
      />
      <div className="mt-3">
        <p className="text-sm font-medium">{file.name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-300">
          {formatBytes(file.size)}
        </p>
      </div>
    </div>
  );
};

export default ImagePreview;
