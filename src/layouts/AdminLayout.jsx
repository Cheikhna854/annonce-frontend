import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { ChartColumn, ClipboardList, FolderOpen, LogOut, UsersRound, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const menu = [
  { to: '/admin', label: 'Dashboard', icon: ChartColumn },
  { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: UsersRound },
  { to: '/admin/annonces', label: 'Annonces', icon: ClipboardList },
  { to: '/admin/categories', label: 'Catégories', icon: FolderOpen },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const deconnecter = () => {
    logout();
    navigate('/connexion', { replace: true });
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="admin-shell">
      {/* Header mobile avec bouton hamburger */}
      <header className="admin-mobile-header">
        <span className="admin-logo">Admin Dashboard</span>
        <button 
          className="admin-menu-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Overlay sombre en arrière-plan sur mobile quand le menu est ouvert */}
      {mobileMenuOpen && <div className="admin-overlay" onClick={closeMenu}></div>}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="admin-logo desktop-only">Admin Dashboard</div>
        <nav>
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              onClick={closeMenu}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} aria-hidden="true" /> {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <span>{user?.prenom} {user?.nom}</span>
          <button onClick={deconnecter} className="btn-logout">
            <LogOut size={16} aria-hidden="true" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;