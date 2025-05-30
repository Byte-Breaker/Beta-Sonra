
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize the app only when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("root");
  
  if (rootElement) {
    // Create root with concurrent mode
    createRoot(rootElement).render(<App />);
    
    // Register performance measure
    if ('performance' in window && 'mark' in performance && 'measure' in performance) {
      performance.mark('app-rendered');
      performance.measure('app-render-time', 'navigationStart', 'app-rendered');
    }
  }
});
