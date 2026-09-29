import { useEffect, useState } from 'react';
import { ArrowLeft, ImagePlus, Save, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { imageUrl } from '../../api/imageUrl';

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    prenom: user?.prenom || '',
    nom: user?.nom || '',
    telephone: user?.telephone || '',
  });
  const [photo, setPhoto] = useState(null);
  const [apercu, setApercu] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  useEffect(() => () => {
    if (apercu) URL.revokeObjectURL(apercu);
  }, [apercu]);

  const modifierChamp = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const choisirPhoto = (event) => {
    const fichier = event.target.files?.[0];
    if (!fichier) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(fichier.type)) {
      setErreur('Choisissez une image JPG, PNG ou WebP.');
      event.target.value = '';
      return;
    }
    if (fichier.size > 5 * 1024 * 1024) {
      setErreur('La photo ne doit pas dépasser 5 Mo.');
      event.target.value = '';
      return;
    }
    setErreur('');
    setPhoto(fichier);
    setApercu(URL.createObjectURL(fichier));
  };

  const enregistrer = async (event) => {
    event.preventDefault();
    setErreur('');
    setChargement(true);
    const donnees = new FormData();
    Object.entries(form).forEach(([cle, valeur]) => donnees.append(cle, valeur.trim()));
    if (photo) donnees.append('photo', photo);

    try {
      await updateProfile(donnees);
      navigate('/profil', { replace: true });
    } catch (error) {
      setErreur(error.response?.data?.message || 'Impossible d’enregistrer votre profil.');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="page profile-edit-page">
      <button className="page-back" type="button" onClick={() => navigate(-1)} aria-label="Retour">
        <ArrowLeft size={20} aria-hidden="true" />
      </button>
      <h1>Informations personnelles</h1>
      <p className="page-subtitle">Gardez vos coordonnées à jour pour faciliter les échanges.</p>

      {erreur && <div className="alert-error" role="alert">{erreur}</div>}

      <form className="profile-edit-form" onSubmit={enregistrer}>
        <label className="profile-photo-picker">
          <span className="profile-photo-preview">
            {apercu || user?.photo ? (
              <img src={apercu || imageUrl(user.photo)} alt="Aperçu de la photo de profil" />
            ) : (
              <UserRound size={34} aria-hidden="true" />
            )}
          </span>
          <span><ImagePlus size={16} aria-hidden="true" /> Changer la photo</span>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={choisirPhoto} />
        </label>

        <label htmlFor="prenom">Prénom</label>
        <input id="prenom" name="prenom" value={form.prenom} onChange={modifierChamp} required />

        <label htmlFor="nom">Nom</label>
        <input id="nom" name="nom" value={form.nom} onChange={modifierChamp} required />

        <label htmlFor="telephone">Téléphone</label>
        <input id="telephone" name="telephone" type="tel" autoComplete="tel" value={form.telephone} onChange={modifierChamp} />

        <label>Email</label>
        <input value={user?.email || ''} readOnly aria-readonly="true" />

        <button type="submit" className="btn-primary" disabled={chargement}>
          <Save size={18} aria-hidden="true" />
          {chargement ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;