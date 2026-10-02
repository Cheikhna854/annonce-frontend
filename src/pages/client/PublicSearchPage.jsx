import { Link } from 'react-router-dom';
import SearchPage from './Search';
import SiteFooter from '../../components/SiteFooter';

const PublicSearchPage = () => (
  <div className="public-search-shell">
    <header className="public-search-header">
      <Link to="/" className="public-search-brand">SenAnnonces</Link>
      <Link to="/connexion" className="public-search-login">Connexion</Link>
    </header>
    <SearchPage />
    <SiteFooter />
  </div>
);

export default PublicSearchPage;
