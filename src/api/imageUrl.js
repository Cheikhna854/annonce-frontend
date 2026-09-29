import { SERVER_URL } from './axios';

export const imageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/200';
  if (path.startsWith('http')) return path;
  
  // Formatage propre du chemin avec la racine du serveur
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SERVER_URL}${cleanPath}`;
};