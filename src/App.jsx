import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import RoleLayout from './layouts/RoleLayout';
import AdminLayout from './layouts/AdminLayout';

import ChooseRole from './pages/client/ChooseRole';
import HomeGate from './pages/client/HomeGate';
import Home from './pages/client/Home';
import Login from './pages/client/Login';
import Register from './pages/client/Register';
import RegisterVendeur from './pages/client/RegisterVendeur';
import ForgotPassword from './pages/client/ForgotPassword';
import Categories from './pages/client/Categories';
import Search from './pages/client/Search';
import AnnonceDetail from './pages/client/AnnonceDetail';
import SellerProfile from './pages/client/SellerProfile';
import PublishAnnonce from './pages/client/PublishAnnonce';
import MyAnnonces from './pages/client/MyAnnonces';
import Messages from './pages/client/Messages';
import Conversation from './pages/client/Conversation';
import Profile from './pages/client/Profile';
import EditProfile from './pages/client/EditProfile';
import Settings from './pages/client/Settings';
import Notifications from './pages/client/Notifications';
import Favoris from './pages/client/Favoris';

import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import AnnoncesAdmin from './pages/admin/AnnoncesAdmin';
import CategoriesAdmin from './pages/admin/CategoriesAdmin';

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomeGate />} />
          <Route path="/demarrage" element={<Navigate to="/" replace />} />
          <Route path="/rejoindre" element={<ChooseRole />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/inscription-prestataire" element={<RegisterVendeur />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
          <Route path="/conversation/:contactId" element={<PrivateRoute roles={['client', 'prestataire']}><Conversation /></PrivateRoute>} />

          <Route element={<PrivateRoute roles={['client', 'prestataire']}><RoleLayout /></PrivateRoute>}>
            <Route path="/accueil" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/recherche" element={<Search />} />
            <Route path="/annonce/:id" element={<AnnonceDetail />} />
            <Route path="/vendeur/:id" element={<SellerProfile />} />
            <Route path="/favoris" element={<Favoris />} />
            <Route path="/publier" element={<PrivateRoute roles={['prestataire']}><PublishAnnonce /></PrivateRoute>} />
            <Route path="/mes-annonces" element={<PrivateRoute roles={['prestataire']}><MyAnnonces /></PrivateRoute>} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/profil/modifier" element={<EditProfile />} />
            <Route path="/profil/infos" element={<EditProfile />} />
            <Route path="/parametres" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          <Route element={<PrivateRoute adminOnly><AdminLayout /></PrivateRoute>}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/utilisateurs" element={<Users />} />
            <Route path="/admin/annonces" element={<AnnoncesAdmin />} />
            <Route path="/admin/categories" element={<CategoriesAdmin />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;