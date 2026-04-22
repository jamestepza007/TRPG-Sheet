import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1f1f1f', color: '#e8e8e8', border: '1px solid #2a2a2a', fontFamily: 'Crimson Text, serif', fontSize: '16px' },
          success: { iconTheme: { primary: '#4ade80', secondary: '#000' } },
          error: { iconTheme: { primary: '#ff0033', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
