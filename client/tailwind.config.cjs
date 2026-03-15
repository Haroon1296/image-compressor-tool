module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['\"Space Grotesk\"', 'sans-serif'],
        body: ['\"Plus Jakarta Sans\"', 'sans-serif']
      },
      colors: {
        ink: '#0f172a',
        sand: '#f4f1ea',
        citrus: '#f9b233',
        ocean: '#0b5c5f',
        fog: '#e2e8f0'
      },
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.12)'
      },
      backgroundImage: {
        grain: 'radial-gradient(rgba(15, 23, 42, 0.08) 1px, transparent 0)'
      }
    }
  },
  plugins: []
};
