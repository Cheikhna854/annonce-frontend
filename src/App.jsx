import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import RoleLayout from './layouts/RoleLayout';
import AdminLayout from './layouts/AdminLayout';

const ChooseRole = lazy(() => import('./pages/client/ChooseRole'));
const HomeGate = lazy(() => import('./pages/client/HomeGate'));
const Home = lazy(() => import('./pages/client/Home'));
const Login = lazy(() => import('./pages/client/Login'));
const Register = lazy(() => import('./pages/client/Register'));
const RegisterVendeur = lazy(() => import('./pages/client/RegisterVendeur'));
const ForgotPassword = lazy(() => import('./pages/client/ForgotPassword'));
const Categories = lazy(() => import('./pages/client/Categories'));
const Search = lazy(() => import('./pages/client/Search'));
const AnnonceDetail = lazy(() => import('./pages/client/AnnonceDetail'));
const SellerProfile = lazy(() => import('./pages/client/SellerProfile'));
const PublishAnnonce = lazy(() => import('./pages/client/PublishAnnonce'));
const MyAnnonces = lazy(() => import('./pages/client/MyAnnonces'));
const Messages = lazy(() => import('./pages/client/Messages'));
const Conversation = lazy(() => import('./pages/client/Conversation'));
const Profile = lazy(() => import('./pages/client/Profile'));
const EditProfile = lazy(() => import('./pages/client/EditProfile'));
const Settings = lazy(() => import('./pages/client/Settings'));
const Notifications = lazy(() => import('./pages/client/Notifications'));
const Favoris = lazy(() => import('./pages/client/Favoris'));

const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Users = lazy(() => import('./pages/admin/Users'));
const AnnoncesAdmin = lazy(() => import('./pages/admin/AnnoncesAdmin'));
const CategoriesAdmin = lazy(() => import('./pages/admin/CategoriesAdmin'));

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<div className="page-loading" role="status">Chargement de la page…</div>}>
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
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
