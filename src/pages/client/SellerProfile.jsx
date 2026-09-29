import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, MessageCircle, Phone, UserRound } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { imageUrl } from '../../api/imageUrl';
import { whatsappUrl } from '../../api/whatsapp';
import { useAuth } from '../../context/AuthContext';

const SellerProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vendeur, setVendeur] = useState(null);
  const [annonces, setAnnonces] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    let actif = true;
    api.get(`/annonces/vendeur/${id}`)
      .then(({ data }) => {
        if (!actif) return;
        setVendeur(data.vendeur);
        setAnnonces(Array.isArray(data.annonces) ? data.annonces : []);
      })
      .catch(() => { if (actif) setErreur('Ce profil vendeur est introuvable.'); })
      .finally(() => { if (actif) setChargement(false); });
    return () => { actif = false; };
  }, [id]);

  if (chargement) return <div className="page">Chargement du profil vendeur...</div>;
  if (erreur || !vendeur) return <div className="page"><p className="empty-state" role="alert">{erreur || 'Vendeur introuvable.'}</p></div>;

  const estSonProfil = String(user?._id) === String(vendeur._id);
  const lienWhatsApp = whatsappUrl(
    vendeur.telephone,
    'Bonjour, je souhaite vous contacter au sujet de vos annonces sur Annonces.sn.',
  );

  return (
    <div className="page seller-profile-page">
      <button className="page-back" type="button" onClick={() => navigate(-1)} aria-label="Retour">
        <ArrowLeft size={20} aria-hidden="true" />
      </button>

      <section className="seller-profile-card">
        <div className="seller-profile-avatar">
          {vendeur.photo ? <img src={imageUrl(vendeur.photo)} alt={`Photo de ${vendeur.prenom} ${vendeur.nom}`} /> : <UserRound size={38} aria-hidden="true" />}
        </div>
        <div className="seller-profile-identity">
          <p className="seller-profile-label">PROFIL VENDEUR</p>
          <h1>{vendeur.prenom} {vendeur.nom}</h1>
          {vendeur.createdAt && <p>Membre depuis {new Date(vendeur.createdAt).getFullYear()}</p>}
          {vendeur.telephone && <p className="seller-profile-phone"><Phone size={15} aria-hidden="true" /> {vendeur.telephone}</p>}
        </div>
        {!estSonProfil && (
          <div className="seller-profile-actions">
            {vendeur.telephone && lienWhatsApp && (
              <a className="seller-whatsapp-button" href={lienWhatsApp} target="_blank" rel="noreferrer" aria-label={`Contacter ${vendeur.prenom} sur WhatsApp`}>
                <FaWhatsapp aria-hidden="true" /> WhatsApp
              </a>
            )}
            <Link className="btn-secondary seller-message-button" to={`/conversation/${vendeur._id}`}>
              <MessageCircle size={17} aria-hidden="true" /> Message
            </Link>
          </div>
        )}
      </section>

      <div className="section-header seller-listings-heading">
        <h2>Annonces disponibles</h2>
        <span>{annonces.length}</span>
      </div>

      {annonces.length === 0 ? (
        <p className="empty-state">Ce vendeur n’a pas d’annonce disponible pour le moment.</p>
      ) : (
        <div className="annonces-grid">
          {annonces.map((annonce) => (
            <Link to={`/annonce/${annonce._id}`} key={annonce._id} className="annonce-card">
              <img src={imageUrl(annonce.images?.[0])} alt={annonce.titre} />
              <div className="annonce-info">
                <p className="annonce-titre">{annonce.titre}</p>
                <p className="annonce-prix">{Number(annonce.prix || 0).toLocaleString('fr-FR')} FCFA</p>
                <p className="annonce-ville"><MapPin size={13} aria-hidden="true" /> {annonce.ville}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerProfile;