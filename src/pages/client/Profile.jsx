import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, ClipboardList, Heart, LogOut, MessageCircle, Settings, UserRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { imageUrl } from '../../api/imageUrl';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isVendeur = user?.role === 'prestataire' || user?.role === 'admin';

  const menu = [
    { to: '/profil/modifier', label: 'Informations personnelles', icon: UserRound },
    ...(isVendeur ? [{ to: '/mes-annonces', label: 'Mes annonces', icon: ClipboardList }] : []),
    { to: '/favoris', label: 'Favoris', icon: Heart },
    { to: '/messages', label: 'Messages', icon: MessageCircle },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/parametres', label: 'Paramètres', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  return (
    <div className="page">
      <div className="profile-header">
        <Link to="/profil/modifier" className="profile-avatar-link" aria-label="Modifier la photo de profil">
          {user?.photo ? <img src={imageUrl(user.photo)} alt="Profil" /> : <UserRound size={34} aria-hidden="true" />}
        </Link>
        <h2>{user?.prenom} {user?.nom}</h2>
        <p>
          {isVendeur ? 'Compte vendeur' : 'Compte client'} · Membre depuis{' '}
          {new Date(user?.createdAt || Date.now()).getFullYear()}
        </p>
      </div>

      <div className="profile-menu">
        {menu.map((item) => (
          <Link to={item.to} key={item.to} className="profile-menu-item">
            <item.icon size={18} strokeWidth={1.8} aria-hidden="true" />
            <span>{item.label}</span>
            <ChevronRight className="chevron" size={16} aria-hidden="true" />
          </Link>
        ))}
        <button onClick={handleLogout} className="profile-menu-item text-danger">
          <LogOut size={18} aria-hidden="true" /> <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;