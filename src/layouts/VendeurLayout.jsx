import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FolderOpen, House, LogOut, MessageCircle, Plus, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CurrentUserPresence from '../components/CurrentUserPresence';
import SiteFooter from '../components/SiteFooter';

const navItems = [
  { to: '/accueil', label: 'Accueil', icon: House },
  { to: '/categories', label: 'Catégories', icon: FolderOpen },
  { to: '/publier', label: 'Publier', icon: Plus },
  { to: '/messages', label: 'Messages', icon: MessageCircle },
  { to: '/profil', label: 'Profil', icon: UserRound },
];

const VendeurLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  return (
    <div className="app-shell">
      <div className="top-bar">
        <span className="top-bar-logo">Annonces.sn</span>
        <CurrentUserPresence />
        <button onClick={handleLogout} className="top-bar-logout" title="Déconnexion" aria-label="Déconnexion">
          <LogOut size={18} aria-hidden="true" />
        </button>
      </div>
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end={item.to === '/accueil'}
          >
            <item.icon className="nav-icon" size={20} strokeWidth={1.8} aria-hidden="true" />
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <main className="app-content">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
};

export default VendeurLayout;
