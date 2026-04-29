import axios from 'axios';

const isProduction = window.location.hostname.includes('vercel.app');
const productionUrl = 'https://mini-business-crm-backend.vercel.app/api';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isProduction ? productionUrl : 'http://localhost:5000/api')
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token && token !== 'undefined' && token !== 'null') {
    console.log(`[Axios Debug]: Token found. Attaching to ${config.url}`);
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['X-Authorization'] = `Bearer ${token}`; // Fallback for Vercel stripping
  } else {
    console.log(`[Axios Debug]: No valid token found for ${config.url}`);
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
