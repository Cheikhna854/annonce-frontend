import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { ChartColumn, ClipboardList, FolderOpen, Flag, LogOut, UsersRound, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Tous les éléments du menu
const menuItems = [
  { to: '/admin', label: 'Dashboard', icon: ChartColumn },
  { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: UsersRound },
  { to: '/admin/annonces', label: 'Annonces', icon: ClipboardList },
  { to: '/admin/signalements', label: 'Signalements', icon: Flag },
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

  // Si vous souhaitez restreindre 'Utilisateurs' uniquement à l'Admin/SuperAdmin,
  // vérifiez la casse du rôle (ex: user?.role === 'admin' ou user?.role === 'super_admin')
  const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'ADMIN';

  const itemsToDisplay = menuItems.filter(item => {
    // Si c'est la page utilisateurs et que l'utilisateur n'est pas admin, on cache (sinon on affiche tout)
    if (item.to === '/admin/utilisateurs' && !isSuperAdmin) {
      return false;
    }
    return true;
  });

  return (
    <div className="admin-shell">
      {/* Header Mobile */}
      <header className="admin-mobile-header">
        <span className="admin-logo-text">Admin Dashboard</span>
        <button 
          className="admin-menu-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Overlay mobile */}
      {mobileMenuOpen && <div className="admin-overlay" onClick={closeMenu}></div>}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div>
          <div className="admin-sidebar-header desktop-only">
            <h2 className="admin-logo-text">Admin Dashboard</h2>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {itemsToDisplay.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin'}
                  onClick={closeMenu}
                  className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            {user?.prenom || 'Super'} {user?.nom || 'Admin'}
          </div>
          <button onClick={deconnecter} className="btn-logout">
            <LogOut size={16} aria-hidden="true" />
            <span>Déconnexion</span>
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
