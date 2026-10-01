import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import AnnonceImage from '../../components/AnnonceImage';

const MyAnnonces = () => {
  const [annonces, setAnnonces] = useState([]);
  const [filtre, setFiltre] = useState('toutes');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [actionEnCours, setActionEnCours] = useState('');

  const charger = async () => {
    setErreur('');
    try {
      const { data } = await api.get('/annonces/mes-annonces');
      setAnnonces(Array.isArray(data) ? data : []);
    } catch {
      setErreur('Impossible de charger vos annonces. Réessayez.');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => { charger(); }, []);

  const toggleStatut = async (id) => {
    setActionEnCours(id);
    try {
      await api.patch(`/annonces/${id}/statut`);
      await charger();
    } catch {
      setErreur('Impossible de modifier le statut de cette annonce.');
    } finally {
      setActionEnCours('');
    }
  };

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer cette annonce ?')) return;
    setActionEnCours(id);
    try {
      await api.delete(`/annonces/${id}`);
      await charger();
    } catch {
      setErreur('Impossible de supprimer cette annonce. Réessayez.');
    } finally {
      setActionEnCours('');
    }
  };

  const statutBadge = (a) => {
    if (a.statut === 'en_attente') return <span className="badge badge-pending">En attente de validation</span>;
    if (a.statut === 'refusee') return <span className="badge badge-off">Refusée</span>;
    return (
      <span className={`badge ${a.actif ? 'badge-online' : 'badge-off'}`}>
        {a.actif ? 'En ligne' : 'Désactivée'}
      </span>
    );
  };

  const annoncesFiltrees = annonces.filter((a) => {
    if (filtre === 'actives') return a.actif && a.statut === 'validee';
    if (filtre === 'inactives') return !a.actif && a.statut === 'validee';
    return true;
  });

  return (
    <div className="page">
      <h2>Mes annonces</h2>
      {erreur && <div className="alert-error" role="alert">{erreur}</div>}
      <div className="tabs">
        <button className={filtre === 'toutes' ? 'active' : ''} onClick={() => setFiltre('toutes')}>Toutes</button>
        <button className={filtre === 'actives' ? 'active' : ''} onClick={() => setFiltre('actives')}>En ligne</button>
        <button className={filtre === 'inactives' ? 'active' : ''} onClick={() => setFiltre('inactives')}>Désactivées</button>
      </div>

      <div className="mes-annonces-list">
        {annoncesFiltrees.map((a) => (
          <div key={a._id} className="mes-annonce-item">
            <AnnonceImage src={a.images?.[0]} alt={a.titre} />
            <div className="mes-annonce-info">
              <p className="annonce-titre">{a.titre}</p>
              <p className="annonce-prix">{Number(a.prix || 0).toLocaleString('fr-FR')} FCFA</p>
              {statutBadge(a)}
            </div>
            <div className="mes-annonce-actions">
              <Link to={`/annonce/${a._id}`}>Voir</Link>
              <Link to={`/mes-annonces/${a._id}/modifier`}>Modifier</Link>
              {a.statut === 'validee' && (
                <button onClick={() => toggleStatut(a._id)} disabled={actionEnCours === a._id}>
                  {actionEnCours === a._id ? 'Mise à jour...' : a.actif ? 'Désactiver' : 'Activer'}
                </button>
              )}
              <button onClick={() => supprimer(a._id)} className="text-danger" disabled={actionEnCours === a._id}>
                {actionEnCours === a._id ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        ))}
        {chargement && <p className="empty-state">Chargement de vos annonces...</p>}
        {!chargement && !erreur && annoncesFiltrees.length === 0 && <p className="empty-state">Aucune annonce</p>}
      </div>

      <Link to="/publier" className="btn-primary fab-button">Publier une nouvelle annonce</Link>
    </div>
  );
};

export default MyAnnonces;
