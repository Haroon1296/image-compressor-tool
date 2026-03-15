const Navbar = ({ theme, onToggleTheme }) => {
  return (
    <header className="px-6 py-5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-ocean text-white grid place-items-center font-display text-lg shadow-soft">
            C
          </div>
          <div>
            <p className="font-display text-xl">Compressify</p>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              TinyPNG-style compressor
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600 dark:text-slate-300">
            Fast. Private. Crisp.
          </span>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
            className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700 grid place-items-center bg-white/80 dark:bg-slate-900/70"
          >
            {theme === 'dark' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-citrus"
              >
                <path d="M12 3.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V4.5a.75.75 0 0 1 .75-.75ZM7.72 6.22a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06L7.72 7.28a.75.75 0 0 1 0-1.06Zm9.5 0a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 0 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0ZM12 8.25a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5ZM4.5 11.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm12 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm-7.66 4.97a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 0 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06Zm6.72 0a.75.75 0 0 1 0 1.06l-1.06 1.06a.75.75 0 1 1-1.06-1.06l1.06-1.06a.75.75 0 0 1 1.06 0ZM12 17.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V18a.75.75 0 0 1 .75-.75Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-slate-700"
              >
                <path d="M21.752 15.002A9.718 9.718 0 0 1 12.75 21c-5.385 0-9.75-4.365-9.75-9.75 0-4.006 2.417-7.45 5.87-8.98.38-.17.78.23.64.62A7.501 7.501 0 0 0 19.002 14.5c.39-.14.79.26.62.64a9.73 9.73 0 0 1 2.13-.138Z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
