import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { categoryIcon } from '../../api/categoryIcon';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data))
      .catch(() => setErreur('Impossible de charger les catégories.'));
  }, []);

  return (
    <div className="page">
      <h2>Catégories</h2>
      {erreur && <p className="empty-state">{erreur}</p>}
      {!erreur && categories.length === 0 && <p className="empty-state">Aucune catégorie disponible</p>}
      <div className="categories-grid">
        {categories.map((categorie) => (
          (() => {
            const CategoryIcon = categoryIcon(categorie.nom);
            return (
              <Link
                to={`/recherche?categorie=${categorie._id}`}
                key={categorie._id}
                className="category-item"
              >
                <div className="category-icon"><CategoryIcon size={22} strokeWidth={1.7} aria-hidden="true" /></div>
                <span>{categorie.nom}</span>
              </Link>
            );
          })()
        ))}
      </div>
    </div>
  );
};

export default Categories;
