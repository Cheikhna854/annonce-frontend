import { useEffect, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const PublishAnnonce = () => {
  const [categories, setCategories] = useState([]);
  const [chargementCategories, setChargementCategories] = useState(true);
  const [erreurCategories, setErreurCategories] = useState('');
  const [form, setForm] = useState({ titre: '', prix: '', categorie: '', ville: '', description: '' });
  const [images, setImages] = useState([]);
  const [apercus, setApercus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => setErreurCategories('Impossible de charger les catégories. Réessayez plus tard.'))
      .finally(() => setChargementCategories(false));
  }, []);

  useEffect(() => () => apercus.forEach((url) => URL.revokeObjectURL(url)), [apercus]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImages = (e) => {
    const fichiers = Array.from(e.target.files || []);
    if (fichiers.length > 5) {
      setErreur('Vous pouvez ajouter jusqu’à 5 photos.');
      e.target.value = '';
      return;
    }
    const invalide = fichiers.find((fichier) => (
      !['image/jpeg', 'image/png', 'image/webp'].includes(fichier.type)
      || fichier.size > 5 * 1024 * 1024
    ));
    if (invalide) {
      setErreur('Chaque photo doit être au format JPG, PNG ou WebP et ne pas dépasser 5 Mo.');
      e.target.value = '';
      return;
    }
    setErreur('');
    setImages(fichiers);
    setApercus(fichiers.map((fichier) => URL.createObjectURL(fichier)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      images.forEach((img) => data.append('images', img));

      await api.post('/annonces', data);
      navigate('/mes-annonces');
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de la publication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Publier une annonce</h1>
      <p className="page-subtitle">Présentez votre produit avec des informations claires et de belles photos.</p>
      {erreur && <div className="alert-error">{erreur}</div>}

      <form onSubmit={handleSubmit} className="publish-form">
        <label htmlFor="annonce-photos" className="publish-photo-label">
          <ImagePlus size={17} aria-hidden="true" /> Photos (jusqu’à 5)
        </label>
        <input
          id="annonce-photos"
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImages}
        />
        {apercus.length > 0 && (
          <div className="publish-photo-grid" aria-label="Aperçu des photos sélectionnées">
            {apercus.map((url, index) => <img src={url} alt={`Photo sélectionnée ${index + 1}`} key={url} />)}
          </div>
        )}

        <label>Titre de l'annonce</label>
        <input name="titre" placeholder="Ex: iPhone 13 Pro" value={form.titre} onChange={handleChange} required />

        <label>Catégorie</label>
        <select name="categorie" value={form.categorie} onChange={handleChange} required>
          <option value="">
            {chargementCategories ? 'Chargement des catégories...' : 'Sélectionner une catégorie'}
          </option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.nom}</option>
          ))}
        </select>
        {erreurCategories && <p className="empty-state">{erreurCategories}</p>}
        {!chargementCategories && !erreurCategories && categories.length === 0 && (
          <p className="empty-state">Aucune catégorie disponible. Demandez à l’administrateur de les ajouter.</p>
        )}

        <label>Prix (FCFA)</label>
        <input name="prix" type="number" min="0" step="1" placeholder="Ex: 350000" value={form.prix} onChange={handleChange} required />

        <label>Localisation</label>
        <input name="ville" placeholder="Dakar" value={form.ville} onChange={handleChange} required />

        <label>Description</label>
          <textarea
          name="description"
          placeholder="Décrivez votre produit..."
          value={form.description}
          onChange={handleChange}
          rows={4}
          required
        />

        <button type="submit" className="btn-primary" disabled={loading || chargementCategories || categories.length === 0}>
          {loading ? 'Publication...' : "Publier l'annonce"}
        </button>
      </form>
    </div>
  );
};

export default PublishAnnonce;
