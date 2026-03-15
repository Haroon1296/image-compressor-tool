const LEVELS = ['low', 'medium', 'high'];

const CompressionOptions = ({ level, onLevelChange, format, onFormatChange }) => {
  const currentIndex = LEVELS.indexOf(level);

  return (
    <div className="glass rounded-3xl p-6 shadow-soft space-y-6">
      <div>
        <h3 className="font-display text-lg">Compression level</h3>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Balance quality and file size.
        </p>
        <div className="mt-4">
          <input
            type="range"
            min="0"
            max="2"
            step="1"
            value={currentIndex}
            onChange={(event) => onLevelChange(LEVELS[Number(event.target.value)])}
            className="w-full accent-ocean"
          />
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-300 mt-2">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg">Output format</h3>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Keep original or convert.
        </p>
        <div className="mt-3 flex gap-3 flex-wrap">
          {['auto', 'jpeg', 'png', 'webp', 'avif'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onFormatChange(option)}
              className={`px-4 py-2 rounded-full border text-sm transition ${
                format === option
                  ? 'bg-ocean text-white border-ocean'
                  : 'border-slate-200 dark:border-slate-700 hover:border-ocean'
              }`}
            >
              {option.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompressionOptions;
