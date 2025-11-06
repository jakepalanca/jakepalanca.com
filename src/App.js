import React, { useEffect } from 'react';
import './App.css';
import Terminal from './components/Terminal';

function App() {
  useEffect(() => {
    const updateTitle = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      document.title = `jake — -zsh — ${width}×${height}`;
    };

    // Set initial title
    updateTitle();

    // Update title on window resize
    window.addEventListener('resize', updateTitle);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateTitle);
    };
  }, []);

  return (
    <div className="App">
      <Terminal />
    </div>
  );
}

export default App;