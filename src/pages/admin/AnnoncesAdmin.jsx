import { useEffect, useState } from 'react';
import api from '../../api/axios';

const AnnoncesAdmin = () => {
  const [annonces, setAnnonces] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [actionEnCours, setActionEnCours] = useState('');

  const charger = async () => {
    setErreur('');
    try {
      const { data } = await api.get('/admin/annonces');
      setAnnonces(Array.isArray(data) ? data : []);
    } catch {
      setErreur('Impossible de charger les annonces. Réessayez.');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => { charger(); }, []);

  const valider = async (id) => {
    setActionEnCours(id);
    try {
      await api.patch(`/admin/annonces/${id}/valider`);
      await charger();
    } catch {
      setErreur('Impossible de valider cette annonce.');
    } finally {
      setActionEnCours('');
    }
  };

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer cette annonce ?')) return;
    setActionEnCours(id);
    try {
      await api.delete(`/admin/annonces/${id}`);
      await charger();
    } catch {
      setErreur('Impossible de supprimer cette annonce.');
    } finally {
      setActionEnCours('');
    }
  };

  const traiterSignalement = async (id) => {
    setActionEnCours(id);
    try {
      await api.patch(`/admin/annonces/${id}/signalements/traiter`);
      await charger();
    } catch {
      setErreur('Impossible de clôturer le signalement.');
    } finally {
      setActionEnCours('');
    }
  };

  const statutBadge = (statut) => {
    if (statut === 'en_attente') return <span className="badge badge-pending">En attente</span>;
    if (statut === 'refusee') return <span className="badge badge-off">Refusée</span>;
    return <span className="badge badge-online">Validée</span>;
  };

  return (
    <div className="page">
      <h1>Annonces</h1>
      {erreur && <div className="alert-error" role="alert">{erreur}</div>}
      {chargement && <p className="empty-state">Chargement des annonces...</p>}
      {!chargement && !erreur && annonces.length === 0 && <p className="empty-state">Aucune annonce à modérer.</p>}
      {!chargement && !erreur && annonces.length > 0 && (
      <table className="admin-table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Prix</th>
            <th>Catégorie</th>
            <th>Vendeur</th>
            <th>Statut</th>
            <th>Signalements</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {annonces.map((a) => (
            <tr key={a._id}>
              <td>{a.titre}</td>
              <td>{Number(a.prix || 0).toLocaleString('fr-FR')} FCFA</td>
              <td>{a.categorie?.nom}</td>
              <td>{a.utilisateur?.prenom} {a.utilisateur?.nom}</td>
              <td>{statutBadge(a.statut)}</td>
              <td>{a.signalements > 0 ? <span className="text-danger">{a.signalements}</span> : '—'}</td>
              <td>
                {a.statut === 'en_attente' && (
                  <button onClick={() => valider(a._id)} disabled={actionEnCours === a._id} style={{ color: 'var(--success)' }}>Valider</button>
                )}
                {a.signalements > 0 && (
                  <button onClick={() => traiterSignalement(a._id)} disabled={actionEnCours === a._id}>
                    Traiter ({a.signalements})
                  </button>
                )}
                <button onClick={() => supprimer(a._id)} disabled={actionEnCours === a._id} className="text-danger">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
};

export default AnnoncesAdmin;