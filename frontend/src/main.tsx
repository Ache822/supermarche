import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './store';
import App from './App';
import { ToastProvider } from './context/ToastContext';
import './locales/config';
import './index.css';

// Disable browser scroll restoration so the page always starts at the top on refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <ReduxProvider store={store}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ReduxProvider>
    </HelmetProvider>
  </React.StrictMode>
);

