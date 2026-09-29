import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { ChartColumn, ClipboardList, FolderOpen, LogOut, UsersRound } from 'lucide-react';
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

  const deconnecter = () => {
    logout();
    navigate('/connexion', { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">Admin Dashboard</div>
        <nav>
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} aria-hidden="true" /> {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <span>{user?.prenom} {user?.nom}</span>
          <button onClick={deconnecter} className="btn-logout"><LogOut size={16} aria-hidden="true" /> Déconnexion</button>
        </div>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
