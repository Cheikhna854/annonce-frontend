import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Splash = lazy(() => import('./Splash'));

const HomeGate = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Suspense fallback={<div className="page-loading" role="status">Chargement…</div>}><Splash /></Suspense>;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return <Navigate to="/accueil" replace />;
};

export default HomeGate;
