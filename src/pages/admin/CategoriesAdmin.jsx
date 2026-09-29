import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { categoryIcon } from '../../api/categoryIcon';

const categoriesCourantes = [
  'Immobilier',
  'Automobile',
  'Emploi',
  'Téléphones',
  'Informatique',
  'Mode',
  'Services',
  'Électronique',
];

const CategoriesAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [nom, setNom] = useState('');
  const [erreur, setErreur] = useState('');
  const [message, setMessage] = useState('');

  const charger = () => api.get('/categories').then((res) => setCategories(res.data));

  useEffect(() => {
    const initialiser = async () => {
      setErreur('');
      try {
        const { data } = await api.get('/categories');
        const categoriesExistantes = Array.isArray(data) ? data : [];
        setCategories(categoriesExistantes);
        const nomsExistants = new Set(categoriesExistantes.map((categorie) => categorie.nom.trim().toLowerCase()));
        const categoriesManquantes = categoriesCourantes.filter((categorie) => !nomsExistants.has(categorie.toLowerCase()));

        if (categoriesManquantes.length) {
          await Promise.all(categoriesManquantes.map((categorie) =>
            api.post('/categories', { nom: categorie }),
          ));
          await charger();
          setMessage('Les catégories courantes ont été ajoutées.');
        }
      } catch (err) {
        setErreur(err.response?.data?.message || 'Impossible de charger ou d’initialiser les catégories.');
      }
    };

    initialiser();
  }, []);

  const ajouter = async (e) => {
    e.preventDefault();
    if (!nom.trim()) return;
    setErreur('');
    setMessage('');
    try {
      await api.post('/categories', { nom: nom.trim() });
      setNom('');
      await charger();
    } catch (err) {
      setErreur(err.response?.data?.message || 'Impossible d’ajouter cette catégorie.');
    }
  };

  const ajouterCategoriesCourantes = async () => {
    setErreur('');
    setMessage('');
    try {
      const nomsExistants = new Set(categories.map((categorie) => categorie.nom.trim().toLowerCase()));
      const categoriesManquantes = categoriesCourantes.filter((categorie) => !nomsExistants.has(categorie.toLowerCase()));
      await Promise.all(categoriesManquantes.map((categorie) =>
        api.post('/categories', { nom: categorie }),
      ));
      await charger();
      setMessage(categoriesManquantes.length ? 'Les catégories courantes ont été ajoutées.' : 'Toutes les catégories courantes sont déjà présentes.');
    } catch (err) {
      setErreur(err.response?.data?.message || 'Impossible d’ajouter les catégories courantes.');
    }
  };

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    setErreur('');
    try {
      await api.delete(`/categories/${id}`);
      await charger();
    } catch (err) {
      setErreur(err.response?.data?.message || 'Impossible de supprimer cette catégorie.');
    }
  };

  return (
    <div className="page">
      <h2>Catégories</h2>
      {erreur && <div className="alert-error">{erreur}</div>}
      {message && <p>{message}</p>}

      <form onSubmit={ajouter} className="category-form">
        <input
          placeholder="Nom de la catégorie"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary">Ajouter</button>
      </form>
      <button type="button" className="btn-primary" onClick={ajouterCategoriesCourantes}>
        Ajouter les catégories courantes
      </button>

      <div className="categories-admin-list">
        {categories.map((c) => (
          <div key={c._id} className="category-admin-item">
            <span className="category-admin-name">
              {(() => {
                const CategoryIcon = categoryIcon(c.nom);
                return <CategoryIcon size={18} aria-hidden="true" />;
              })()}
              {c.nom}
            </span>
            <button onClick={() => supprimer(c._id)} className="text-danger">Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesAdmin;