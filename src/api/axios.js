import axios from 'axios';

// URL de l'API (ex: https://annonce-backend-1.onrender.com/api)
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Racine du serveur pour afficher les fichiers/images (ex: https://annonce-backend-1.onrender.com)
export const SERVER_URL = API_BASE.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;