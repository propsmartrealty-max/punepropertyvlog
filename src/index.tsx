import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

import ErrorBoundary from './components/ErrorBoundary';

const init = () => {
  const container = document.getElementById('root');
  if (!container) {
    console.error("Failed to find root element");
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    console.error("React Mounting Error:", error);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}