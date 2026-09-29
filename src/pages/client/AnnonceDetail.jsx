import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Flag, Heart, MapPin, MessageCircle, Phone, UserRound } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../../api/axios';
import { imageUrl } from '../../api/imageUrl';
import { whatsappUrl } from '../../api/whatsapp';
import { useAuth } from '../../context/AuthContext';

const AnnonceDetail = () => {
  const { id } = useParams();
  const [annonce, setAnnonce] = useState(null);
  const [signale, setSignale] = useState(false);
  const [favori, setFavori] = useState(false);
  const [erreur, setErreur] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let actif = true;
    api.get(`/annonces/${id}`)
      .then((res) => {
        if (!actif) return;
        setAnnonce(res.data);
        setFavori(user?.favoris?.some((item) => String(item._id || item) === id) || false);
      })
      .catch(() => { if (actif) setErreur('Cette annonce est introuvable ou n’est plus disponible.'); });
    return () => { actif = false; };
  }, [id, user?.favoris]);

  const envoyerMessage = () => {
    if (!user) return navigate('/connexion');
    navigate(`/conversation/${annonce.utilisateur._id}?annonce=${annonce._id}`);
  };

  const toggleFavori = async () => {
    if (!user) return navigate('/connexion');
    setErreur('');
    try {
      const { data } = await api.post(`/annonces/${id}/favori`);
      setFavori(data.favoris?.some((item) => String(item._id || item) === id) || false);
    } catch {
      setErreur('Impossible de mettre à jour vos favoris. Réessayez.');
    }
  };

  const signaler = async () => {
    if (!user) return navigate('/connexion');
    if (!window.confirm('Signaler cette annonce comme inappropriée ?')) return;
    setErreur('');
    try {
      await api.post(`/annonces/${id}/signaler`);
      setSignale(true);
    } catch {
      setErreur('Le signalement n’a pas pu être envoyé. Réessayez.');
    }
  };

  if (!annonce) return <div className="page">{erreur || 'Chargement de l’annonce...'}</div>;

  const vendeur = annonce.utilisateur;
  const estSaPropreAnnonce = Boolean(user && String(vendeur?._id) === String(user._id));
  const lienWhatsApp = whatsappUrl(
    vendeur?.telephone,
    `Bonjour, je vous contacte au sujet de l’annonce ${annonce.titre} sur Annonces.sn.`,
  );

  return (
    <div className="page">
      <div className="detail-header">
        <button onClick={() => navigate(-1)} aria-label="Retour"><ArrowLeft size={20} aria-hidden="true" /></button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={toggleFavori} title={favori ? 'Retirer des favoris' : 'Ajouter aux favoris'} aria-label={favori ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
            <Heart size={19} fill={favori ? 'currentColor' : 'none'} aria-hidden="true" />
          </button>
          <button onClick={signaler} title="Signaler" aria-label="Signaler l’annonce" disabled={signale}>
            <Flag size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {erreur && <div className="alert-error" role="alert">{erreur}</div>}

      <img
        src={imageUrl(annonce.images?.[0])}
        alt={annonce.titre}
        className="detail-image"
      />

      <h2>{annonce.titre}</h2>
      <p className="annonce-prix-large">{Number(annonce.prix || 0).toLocaleString('fr-FR')} FCFA</p>
      <p className="annonce-ville detail-location"><MapPin size={15} aria-hidden="true" /> {annonce.ville} · {new Date(annonce.createdAt).toLocaleDateString('fr-FR')}</p>

      <h4>Description</h4>
      <p>{annonce.description}</p>

      {vendeur?._id ? (
        <Link to={`/vendeur/${vendeur._id}`} className="vendeur-card" aria-label={`Voir le profil de ${vendeur.prenom} ${vendeur.nom}`}>
          {vendeur.photo ? <img src={imageUrl(vendeur.photo)} alt="" /> : <span className="vendeur-avatar-fallback"><UserRound size={21} aria-hidden="true" /></span>}
          <div className="vendeur-card-info">
            <span className="vendeur-card-label">Vendeur</span>
            <p>{vendeur.prenom} {vendeur.nom}</p>
            {vendeur.createdAt && <span>Membre depuis {new Date(vendeur.createdAt).getFullYear()}</span>}
          </div>
          <span className="vendeur-profile-link">Voir le profil <ArrowRight size={15} aria-hidden="true" /></span>
        </Link>
      ) : (
        <div className="vendeur-card">
          <span className="vendeur-avatar-fallback"><UserRound size={21} aria-hidden="true" /></span>
          <div className="vendeur-card-info"><p>{vendeur?.prenom} {vendeur?.nom}</p></div>
        </div>
      )}

      <div className="detail-actions">
        {vendeur?.telephone && (
          <a href={`tel:${vendeur.telephone}`} className="btn-secondary"><Phone size={17} aria-hidden="true" /> Appeler</a>
        )}
        {lienWhatsApp && (
          <a href={lienWhatsApp} className="seller-whatsapp-button" target="_blank" rel="noreferrer" aria-label={`Contacter ${vendeur.prenom} sur WhatsApp`}>
            <FaWhatsapp aria-hidden="true" /> WhatsApp
          </a>
        )}
        <button className="btn-primary" onClick={envoyerMessage} disabled={estSaPropreAnnonce}>
          <MessageCircle size={17} aria-hidden="true" />
          {estSaPropreAnnonce ? 'Votre annonce' : 'Envoyer un message'}
        </button>
      </div>
    </div>
  );
};

export default AnnonceDetail;