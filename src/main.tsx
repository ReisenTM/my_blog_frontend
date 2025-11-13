import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { applyDesignTokens } from './styles/theme';
import './styles/global.css';

applyDesignTokens();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
