import { useAuth } from '../context/AuthContext';
import ClientLayout from './ClientLayout';
import VendeurLayout from './VendeurLayout';
import AdminLayout from './AdminLayout';

const RoleLayout = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminLayout />;
  if (user?.role === 'prestataire') return <VendeurLayout />;
  return <ClientLayout />;
};

export default RoleLayout;