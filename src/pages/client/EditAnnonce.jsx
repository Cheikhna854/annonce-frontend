import { useEffect, useState } from 'react';
import { ArrowLeft, ImagePlus, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import AnnonceImage from '../../components/AnnonceImage';

const EditAnnonce = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ titre: '', description: '', prix: '', categorie: '', ville: '' });
  const [image, setImage] = useState('');
  const [nouvelleImage, setNouvelleImage] = useState(null);
  const [apercuImage, setApercuImage] = useState('');
  const [chargement, setChargement] = useState(true);
  const [enregistrement, setEnregistrement] = useState(false);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    let actif = true;
    Promise.all([api.get('/annonces/mes-annonces'), api.get('/categories')])
      .then(([annoncesResponse, categoriesResponse]) => {
        if (!actif) return;
        const annonce = annoncesResponse.data.find((item) => String(item._id) === id);
        if (!annonce) {
          setErreur('Cette annonce ne fait pas partie de vos annonces.');
          return;
        }
        setForm({
          titre: annonce.titre || '',
          description: annonce.description || '',
          prix: annonce.prix ?? '',
          categorie: annonce.categorie?._id || annonce.categorie || '',
          ville: annonce.ville || '',
        });
        setImage(annonce.images?.[0] || '');
        setCategories(Array.isArray(categoriesResponse.data) ? categoriesResponse.data : []);
      })
      .catch(() => {
        if (actif) setErreur('Impossible de charger cette annonce. Vérifiez votre connexion et réessayez.');
      })
      .finally(() => { if (actif) setChargement(false); });
    return () => { actif = false; };
  }, [id]);

  const modifierChamp = (event) => {
    setForm((precedent) => ({ ...precedent, [event.target.name]: event.target.value }));
  };

  const choisirImage = (event) => {
    const fichier = event.target.files?.[0];
    if (!fichier) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(fichier.type) || fichier.size > 5 * 1024 * 1024) {
      setErreur('Choisissez une image JPG, PNG ou WebP de 5 Mo maximum.');
      event.target.value = '';
      return;
    }
    setErreur('');
    setNouvelleImage(fichier);
    setApercuImage(URL.createObjectURL(fichier));
  };

  useEffect(() => () => { if (apercuImage) URL.revokeObjectURL(apercuImage); }, [apercuImage]);

  const enregistrer = async (event) => {
    event.preventDefault();
    setErreur('');
    setEnregistrement(true);
    try {
      const donnees = new FormData();
      Object.entries({ ...form, prix: Number(form.prix) }).forEach(([cle, valeur]) => donnees.append(cle, valeur));
      if (nouvelleImage) donnees.append('images', nouvelleImage);
      await api.put(`/annonces/${id}`, donnees);
      navigate('/mes-annonces', { replace: true });
    } catch (error) {
      setErreur(error.response?.data?.message || 'La modification n’a pas pu être enregistrée. Réessayez.');
    } finally {
      setEnregistrement(false);
    }
  };

  if (chargement) return <div className="page"><p className="empty-state">Chargement de votre annonce…</p></div>;

  return (
    <div className="page edit-annonce-page">
      <button className="page-back" type="button" onClick={() => navigate('/mes-annonces')} aria-label="Retour à mes annonces">
        <ArrowLeft size={20} aria-hidden="true" />
      </button>
      <p className="messages-kicker">ESPACE VENDEUR</p>
      <h1>Modifier mon annonce</h1>
      <p className="page-subtitle">Mettez à jour les informations de votre produit.</p>

      {erreur && <div className="alert-error" role="alert">{erreur}</div>}
      {!erreur && (
        <form className="publish-form edit-annonce-form" onSubmit={enregistrer}>
          <label htmlFor="edit-annonce-image"><ImagePlus size={17} aria-hidden="true" /> Photo de l’annonce</label>
          <input id="edit-annonce-image" type="file" accept="image/png,image/jpeg,image/webp" onChange={choisirImage} />
          {(apercuImage || image) && <div className="edit-annonce-current-image"><AnnonceImage src={apercuImage || image} alt="Aperçu de la photo de l’annonce" /></div>}

          <label htmlFor="edit-annonce-titre">Titre de l’annonce</label>
          <input id="edit-annonce-titre" name="titre" value={form.titre} onChange={modifierChamp} required maxLength={100} />

          <label htmlFor="edit-annonce-categorie">Catégorie</label>
          <select id="edit-annonce-categorie" name="categorie" value={form.categorie} onChange={modifierChamp} required>
            <option value="">Sélectionner une catégorie</option>
            {categories.map((categorie) => <option key={categorie._id} value={categorie._id}>{categorie.nom}</option>)}
          </select>

          <label htmlFor="edit-annonce-prix">Prix (FCFA)</label>
          <input id="edit-annonce-prix" name="prix" type="number" min="0" step="1" value={form.prix} onChange={modifierChamp} required />

          <label htmlFor="edit-annonce-ville">Localisation</label>
          <input id="edit-annonce-ville" name="ville" value={form.ville} onChange={modifierChamp} required />

          <label htmlFor="edit-annonce-description">Description</label>
          <textarea id="edit-annonce-description" name="description" rows={5} value={form.description} onChange={modifierChamp} required />

          <div className="edit-annonce-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/mes-annonces')}>Annuler</button>
            <button type="submit" className="btn-primary" disabled={enregistrement}>
              <Save size={17} aria-hidden="true" />
              {enregistrement ? 'Enregistrement…' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditAnnonce;
