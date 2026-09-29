import { categoryIcon } from '../../api/categoryIcon';
import { imageUrl } from '../../api/imageUrl';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Bell, MapPin, Phone, Search } from 'lucide-react';
import api from '../../api/axios';
import heroImage from '../../images/Accueil.jpeg';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [annonces, setAnnonces] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [chargementAnnonces, setChargementAnnonces] = useState(true);
  const [erreurAnnonces, setErreurAnnonces] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCategories([]));
    api.get('/annonces')
      .then((res) => setAnnonces(Array.isArray(res.data) ? res.data : []))
      .catch(() => setErreurAnnonces('Impossible de charger les annonces. Réessayez dans un instant.'))
      .finally(() => setChargementAnnonces(false));
  }, []);

  return (
    <div className="page">
      <div className="home-header">
        <span className="home-location"><MapPin size={16} aria-hidden="true" /> Dakar, Sénégal</span>
        <Link to="/notifications" className="home-notifications" aria-label="Notifications">
          <Bell size={19} aria-hidden="true" />
        </Link>
      </div>

      <section className="home-intro" style={{ '--home-image': `url("${heroImage}")` }}>
        <p>LE MARCHÉ LOCAL, EN TOUTE SIMPLICITÉ</p>
        <h1>Les bonnes trouvailles sont près de vous.</h1>
      </section>

      <form
        className="search-bar"
        onSubmit={(e) => {
          e.preventDefault();
          navigate(`/recherche?q=${encodeURIComponent(recherche.trim())}`);
        }}
      >
        <input
          placeholder="Rechercher une annonce..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
        <button type="submit" aria-label="Rechercher"><Search size={19} aria-hidden="true" /></button>
      </form>

      <div className="section-header">
        <h3>Catégories</h3>
        <Link to="/categories">Voir tout</Link>
      </div>
      <div className="categories-grid">
        {categories.slice(0, 6).map((cat) => {
          const CategoryIcon = categoryIcon(cat.nom);
          return (
            <Link to={`/recherche?categorie=${cat._id}`} key={cat._id} className="category-item">
              <div className="category-icon"><CategoryIcon size={22} strokeWidth={1.7} aria-hidden="true" /></div>
              <span>{cat.nom}</span>
            </Link>
          );
        })}
      </div>

      <div className="section-header">
        <h3>Toutes les annonces</h3>
        <Link to="/recherche">Voir tout <ArrowRight size={14} aria-hidden="true" /></Link>
      </div>
      <div className="annonces-grid">
        {annonces.map((a) => (
          <Link to={`/annonce/${a._id}`} key={a._id} className="annonce-card">
            <img src={imageUrl(a.images?.[0])} alt={a.titre} />
            <div className="annonce-info">
              <p className="annonce-titre">{a.titre}</p>
              <p className="annonce-prix">{Number(a.prix || 0).toLocaleString('fr-FR')} FCFA</p>
              <p className="annonce-ville">{a.ville}</p>
              {a.utilisateur?.telephone && (
                <p className="annonce-telephone"><Phone size={13} aria-hidden="true" /> {a.utilisateur.telephone}</p>
              )}
            </div>
          </Link>
        ))}
        {chargementAnnonces && <p className="empty-state">Chargement des annonces...</p>}
        {!chargementAnnonces && erreurAnnonces && <p className="empty-state" role="alert">{erreurAnnonces}</p>}
        {!chargementAnnonces && !erreurAnnonces && annonces.length === 0 && (
          <p className="empty-state">Aucune annonce publiée pour le moment.</p>
        )}
      </div>
    </div>
  );
};

export default Home;