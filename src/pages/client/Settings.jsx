import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, LogOut, MessageCircle, UserRound, ClipboardList } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isVendeur = user?.role === 'prestataire' || user?.role === 'admin';
  const links = [
    { to: '/profil/modifier', label: 'Informations personnelles', icon: UserRound },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/messages', label: 'Messages', icon: MessageCircle },
    ...(isVendeur ? [{ to: '/mes-annonces', label: 'Mes annonces', icon: ClipboardList }] : []),
  ];

  const deconnecter = () => {
    logout();
    navigate('/connexion', { replace: true });
  };

  return (
    <div className="page">
      <h1>Paramètres</h1>
      <p className="page-subtitle">Gérez votre compte et retrouvez vos espaces personnels.</p>
      <div className="profile-menu settings-menu">
        {links.map((item) => (
          <Link to={item.to} key={item.to} className="profile-menu-item">
            <item.icon size={18} strokeWidth={1.8} aria-hidden="true" />
            <span>{item.label}</span>
            <ChevronRight className="chevron" size={16} aria-hidden="true" />
          </Link>
        ))}
        <button onClick={deconnecter} className="profile-menu-item text-danger">
          <LogOut size={18} aria-hidden="true" /> <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;