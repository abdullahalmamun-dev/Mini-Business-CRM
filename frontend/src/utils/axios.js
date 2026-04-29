import axios from 'axios';

const isProduction = window.location.hostname.includes('vercel.app');
const productionUrl = 'https://mini-business-crm-backend.vercel.app/api';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isProduction ? productionUrl : 'http://localhost:5000/api')
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    console.log(`[Axios Debug]: Attaching token to ${config.url}`);
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log(`[Axios Debug]: No token found for ${config.url}`);
  }
  return config;
});

export default instance;
