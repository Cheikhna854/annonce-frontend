import { useEffect, useState } from 'react';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '../../images/Accueil.jpeg';
import api from '../../api/axios';
import AnnonceImage from '../../components/AnnonceImage';
import SiteFooter from '../../components/SiteFooter';
import formatAnnonceDate from '../../utils/formatAnnonceDate';

const Splash = () => {
  const [categories, setCategories] = useState([]);
  const [annonces, setAnnonces] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    Promise.allSettled([api.get('/categories'), api.get('/annonces')]).then(([cats, ads]) => {
      if (cats.status === 'fulfilled' && Array.isArray(cats.value.data)) {
        setCategories(cats.value.data);
      }
      if (ads.status === 'fulfilled' && Array.isArray(ads.value.data)) {
        setAnnonces(ads.value.data);
      }
      setChargement(false);
    });
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('.landing-discovery, .landing-listings-heading, .landing-annonces-grid .annonce-card');
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

    elements.forEach((element) => {
      element.classList.add('landing-reveal');
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, [annonces, categories]);

  return (
    <main className="landing-page">
      <section className="landing-hero" style={{ '--landing-image': `url("${heroImage}")` }}>
        <header className="landing-nav">
          <Link to="/" className="landing-brand"><span className="landing-brand-name">Sunu<br />Marché</span><ShoppingCart size={34} strokeWidth={2.8} aria-hidden="true" /></Link>
          <nav aria-label="Navigation principale">
            <Link to="/connexion" className="landing-login">Connexion</Link>
            <Link to="/rejoindre" className="landing-signup">Créer un compte</Link>
          </nav>
        </header>

        <div className="landing-copy">
          <p className="landing-eyebrow">LE MARCHÉ LOCAL AU SÉNÉGAL</p>
          <h1 className="landing-title-brand"><span>Sunu<br />Marché</span><ShoppingCart size={58} strokeWidth={2.6} aria-hidden="true" /></h1>
          <p className="landing-description">Notre marché, en ligne. Achetez et vendez près de chez vous.</p>
          <div className="landing-actions">
            <Link to="/recherche" className="landing-primary">Explorer les annonces <span aria-hidden="true">↗</span></Link>
            <Link to="/rejoindre" className="landing-secondary">Publier une annonce</Link>
          </div>
        </div>

        <p className="landing-location">Dakar · Sénégal</p>
      </section>

      <section className="landing-discovery">
        <div>
          <p className="landing-section-label">ACHETER · VENDRE · TROUVER</p>
          <h2>Les bonnes affaires commencent ici.</h2>
        </div>
        <div className="landing-category-list" aria-label="Catégories populaires">
          {categories.map((categorie) => (
            <Link to={`/recherche?categorie=${categorie._id}`} key={categorie._id}>
              {categorie.nom}
            </Link>
          ))}
        </div>
      </section>

      <section className="landing-listings">
        <div className="landing-listings-heading">
          <div>
            <p className="landing-section-label">ANNONCES VALIDÉES ET DISPONIBLES</p>
            <h2>Toutes les annonces</h2>
          </div>
          <Link to="/recherche" className="landing-view-all">Toutes les annonces <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="annonces-grid landing-annonces-grid">
          {annonces.slice(0, 12).map((annonce, index) => (
            <Link to={`/annonce/${annonce._id}`} key={annonce._id} className="annonce-card">
              <AnnonceImage src={annonce.images?.[0]} alt={annonce.titre} loading={index < 2 ? 'eager' : 'lazy'} />
              <div className="annonce-info">
                <p className="annonce-titre">{annonce.titre}</p>
                <p className="annonce-prix">{Number(annonce.prix || 0).toLocaleString('fr-FR')} FCFA</p>
                <p className="annonce-ville">{annonce.ville}</p>
                <p className="annonce-date">Publiée {formatAnnonceDate(annonce.createdAt)}</p>
              </div>
            </Link>
          ))}
          {chargement && <p className="empty-state">Chargement des annonces...</p>}
          {!chargement && annonces.length === 0 && <p className="empty-state">Aucune annonce disponible pour le moment.</p>}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
};

export default Splash;
