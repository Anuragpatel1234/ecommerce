import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

// Axios Interceptor to dynamically redirect localhost requests to the deployed API base URL
axios.interceptors.request.use(
  (config) => {
    const apiBase = process.env.REACT_APP_API_URL;
    if (apiBase && config.url && config.url.startsWith('http://localhost:5000')) {
      config.url = config.url.replace('http://localhost:5000', apiBase);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);