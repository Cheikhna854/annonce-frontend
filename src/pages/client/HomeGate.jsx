import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Splash from './Splash';

const HomeGate = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Splash />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return <Navigate to="/accueil" replace />;
};

export default HomeGate;