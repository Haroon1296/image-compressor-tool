import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

const App = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const initial = storedTheme || (prefersDark.matches ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');

    const handleChange = (event) => {
      if (localStorage.getItem('theme')) return;
      const nextTheme = event.matches ? 'dark' : 'light';
      setTheme(nextTheme);
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    };

    prefersDark.addEventListener('change', handleChange);
    return () => prefersDark.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return (
    <div className="min-h-screen flex flex-col text-ink dark:text-slate-100">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main className="flex-1 px-4 pb-16">
        <Home />
      </main>
      <Footer />
    </div>
  );
};

export default App;
