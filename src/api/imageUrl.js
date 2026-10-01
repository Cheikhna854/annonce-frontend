import { SERVER_URL } from './axios';

export const imageUrl = (path) => {
  if (!path || typeof path !== 'string') return '/images/annonce-placeholder.svg';
  const value = path.trim();
  if (!value) return '/images/annonce-placeholder.svg';
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:')) return value;
  
  // Formatage propre du chemin avec la racine du serveur
  const cleanPath = value.startsWith('/') ? value : `/${value}`;
  return `${SERVER_URL}${cleanPath}`;
};
