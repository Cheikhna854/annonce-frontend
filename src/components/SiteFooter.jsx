import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import whatsappQr from '../images/whatsapp-qr.png';

const categoriesFallback = ['Immobilier', 'Automobile', 'Emploi', 'Téléphones', 'Informatique', 'Mode', 'Services', 'Électronique'];

const SiteFooter = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let actif = true;
    api.get('/categories')
      .then(({ data }) => { if (actif && Array.isArray(data)) setCategories(data); })
      .catch(() => {});
    return () => { actif = false; };
  }, []);

  return (
  <footer className="site-footer">
    <div className="site-footer-grid">
      <section className="site-footer-about" id="site-footer-about">
        <Link to="/" className="site-footer-brand">SenAnnonces</Link>
        <p>Petites annonces gratuites dans nos catégories : immobilier, automobile, emploi, téléphones, informatique, mode, services et électronique. Nous sommes à votre disposition.</p>
      </section>

      <nav className="site-footer-column site-footer-categories" aria-label="Catégories">
        <h2>Catégories</h2>
        {categories.length > 0
          ? categories.map((categorie) => (
            <Link to={`/explorer?categorie=${categorie._id}`} key={categorie._id}>{categorie.nom}</Link>
          ))
          : categoriesFallback.map((categorie) => <Link to="/explorer" key={categorie}>{categorie}</Link>)}
      </nav>

      <nav className="site-footer-column" aria-label="À propos">
        <h2>À propos</h2>
        <Link to="/a-propos">Qui sommes-nous</Link>
        <Link to="/inscription-prestataire">Compte PRO</Link>
        <Link to="/conditions-utilisation">Conditions d’utilisation</Link>
        <Link to="/confidentialite">Confidentialité</Link>
      </nav>

      <section className="site-footer-column">
        <h2>Contact</h2>
        <Link to="/contact">annonce854@gmail.com</Link>
        <a href="tel:+221778579693">+221 77 857 96 93</a>
        <a className="site-footer-whatsapp" href="https://wa.me/221778579693?text=Bonjour%20SenAnnonces%2C%20je%20vous%20contacte%20depuis%20votre%20plateforme." target="_blank" rel="noreferrer" aria-label="Nous écrire sur WhatsApp">
          <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <path d="M16 3.2A12.3 12.3 0 0 0 5.4 21.7L3.7 28l6.5-1.7A12.4 12.4 0 1 0 16 3.2Z" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
            <path d="M12.1 10.2c-.4-.8-.8-.8-1.2-.8h-.9c-.3 0-.8.1-1.2.6-.4.5-1.6 1.6-1.6 3.9s1.7 4.5 1.9 4.8c.2.3 3.2 5.1 7.8 6.9 3.9 1.5 4.7 1.2 5.5 1.1.8-.1 2.5-1 2.9-2.1.4-1 .4-1.9.3-2.1-.1-.2-.4-.3-.9-.6-.5-.2-2.5-1.2-2.9-1.3-.4-.2-.7-.2-1 .3-.3.5-1.1 1.3-1.4 1.6-.3.3-.5.4-1 .1-.5-.2-1.9-.7-3.6-2.2-1.3-1.2-2.2-2.6-2.5-3.1-.3-.5 0-.7.2-.9.2-.2.5-.6.7-.8.2-.3.3-.5.5-.8.2-.3.1-.6 0-.8-.1-.2-.9-2.2-1.3-3Z" fill="currentColor" transform="translate(4 1) scale(.78)" />
          </svg>
          Écrire sur WhatsApp
        </a>
        <a className="site-footer-qr" href="https://wa.me/221778579693?text=Bonjour%20SenAnnonces" target="_blank" rel="noreferrer" aria-label="Scanner le QR code pour ouvrir WhatsApp">
          <img src={whatsappQr} alt="QR code pour contacter SenAnnonces sur WhatsApp" loading="lazy" />
          <span>Scannez pour nous écrire</span>
        </a>
      </section>
    </div>
    <div className="site-footer-bottom">© {new Date().getFullYear()} SenAnnonces. Tous droits réservés.</div>
  </footer>
  );
};

export default SiteFooter;
