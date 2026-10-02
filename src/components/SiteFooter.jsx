import { Link } from 'react-router-dom';

const SiteFooter = () => (
  <footer className="site-footer">
    <div className="site-footer-grid">
      <section className="site-footer-about" id="site-footer-about">
        <Link to="/" className="site-footer-brand">SenAnnonces</Link>
        <p>La plateforme de petites annonces gratuites au Sénégal. Achetez et vendez en neuf ou occasion à Dakar, Thiès, Touba, Saint-Louis et partout dans le pays.</p>
      </section>

      <nav className="site-footer-column" aria-label="Catégories">
        <h2>Catégories</h2>
        <Link to="/categories">Véhicules</Link>
        <Link to="/categories">Immobilier</Link>
        <Link to="/categories">Électronique</Link>
        <Link to="/categories">Emplois</Link>
      </nav>

      <nav className="site-footer-column" aria-label="À propos">
        <h2>À propos</h2>
        <a href="#site-footer-about">Qui sommes-nous</a>
        <Link to="/inscription-prestataire">Compte PRO</Link>
        <span>Conditions d’utilisation</span>
        <span>Confidentialité</span>
      </nav>

      <section className="site-footer-column">
        <h2>Contact</h2>
        <a href="mailto:senegal24@gmail.com">senegal24@gmail.com</a>
        <a href="tel:+221776280304">+221 77 628 03 04</a>
        <a href="mailto:senegal24@gmail.com?subject=Centre%20d'aide">Centre d’aide</a>
      </section>
    </div>
    <div className="site-footer-bottom">© {new Date().getFullYear()} SenAnnonces. Tous droits réservés.</div>
  </footer>
);

export default SiteFooter;
