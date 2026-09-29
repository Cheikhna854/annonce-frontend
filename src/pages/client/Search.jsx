import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Phone, Search as SearchIcon } from 'lucide-react';
import api from '../../api/axios';
import { imageUrl } from '../../api/imageUrl';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [annonces, setAnnonces] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [filtres, setFiltres] = useState({
    q: searchParams.get('q') || '',
    categorie: searchParams.get('categorie') || '',
    ville: '',
    prixMin: '',
    prixMax: '',
    tri: '',
  });

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setFiltres((precedents) => ({
      ...precedents,
      q: searchParams.get('q') || '',
      categorie: searchParams.get('categorie') || '',
    }));
    let actif = true;
    const params = Object.fromEntries(
      ['q', 'categorie']
        .map((cle) => [cle, searchParams.get(cle) || ''])
        .filter(([, valeur]) => valeur),
    );
    setChargement(true);
    setErreur('');
    api.get('/annonces', { params })
      .then((res) => { if (actif) setAnnonces(Array.isArray(res.data) ? res.data : []); })
      .catch(() => { if (actif) setErreur('Impossible de charger les annonces. Réessayez.'); })
      .finally(() => { if (actif) setChargement(false); });
    return () => { actif = false; };
  }, [searchParams]);

  const rechercher = async (event) => {
    event?.preventDefault();
    const params = Object.fromEntries(Object.entries(filtres).filter(([, v]) => v));
    setErreur('');
    setChargement(true);
    try {
      const { data } = await api.get('/annonces', { params });
      setAnnonces(Array.isArray(data) ? data : []);
    } catch {
      setErreur('Impossible de charger les annonces. Vérifiez votre connexion et réessayez.');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="page">
      <h1>Explorer les annonces</h1>
      <form className="search-header" onSubmit={rechercher}>
        <input
          placeholder="Rechercher une annonce..."
          value={filtres.q}
          onChange={(e) => setFiltres({ ...filtres, q: e.target.value })}
        />
        <button type="submit" aria-label="Rechercher"><SearchIcon size={18} aria-hidden="true" /></button>
      </form>

      <div className="filters-panel">
        <label>Catégorie</label>
        <select
          value={filtres.categorie}
          onChange={(e) => setFiltres({ ...filtres, categorie: e.target.value })}
        >
          <option value="">Toutes</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.nom}
            </option>
          ))}
        </select>

        <label>Prix (FCFA)</label>
        <div className="filter-row">
          <input
            placeholder="Min"
            type="number"
            value={filtres.prixMin}
            onChange={(e) => setFiltres({ ...filtres, prixMin: e.target.value })}
          />
          <input
            placeholder="Max"
            type="number"
            value={filtres.prixMax}
            onChange={(e) => setFiltres({ ...filtres, prixMax: e.target.value })}
          />
        </div>

        <label>Localisation</label>
        <input
          placeholder="Ville"
          value={filtres.ville}
          onChange={(e) => setFiltres({ ...filtres, ville: e.target.value })}
        />

        <label>Trier par</label>
        <select value={filtres.tri} onChange={(e) => setFiltres({ ...filtres, tri: e.target.value })}>
          <option value="">Plus récent</option>
          <option value="popularite">Popularité</option>
          <option value="prix_asc">Prix croissant</option>
          <option value="prix_desc">Prix décroissant</option>
        </select>

        <button className="btn-primary" type="button" onClick={rechercher} disabled={chargement}>Voir les résultats</button>
      </div>

      <div className="annonces-list">
        {annonces.map((a) => (
          <Link to={`/annonce/${a._id}`} key={a._id} className="annonce-row">
            <img src={imageUrl(a.images?.[0])} alt={a.titre} />
            <div>
              <p className="annonce-titre">{a.titre}</p>
              <p className="annonce-prix">{Number(a.prix || 0).toLocaleString('fr-FR')} FCFA</p>
              <p className="annonce-ville">{a.ville}</p>
              {a.utilisateur?.telephone && (
                <p className="annonce-telephone"><Phone size={13} aria-hidden="true" /> {a.utilisateur.telephone}</p>
              )}
            </div>
          </Link>
        ))}
        {chargement && <p className="empty-state">Chargement des annonces...</p>}
        {!chargement && erreur && <p className="empty-state" role="alert">{erreur}</p>}
        {!chargement && !erreur && annonces.length === 0 && <p className="empty-state">Aucune annonce trouvée</p>}
      </div>
    </div>
  );
};

export default Search;