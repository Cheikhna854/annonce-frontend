import { useCallback, useEffect, useMemo, useState } from 'react';
import { Flag, RefreshCw } from 'lucide-react';
import api from '../../api/axios';

const nombreSignalements = (item) => {
  const valeur = item?.signalements ?? item?.nombreSignalements ?? item?.reports?.length ?? item?.signalementsDetails?.length;
  return Array.isArray(valeur) ? valeur.length : Number(valeur) || 0;
};

const SignalementsAdmin = () => {
  const [onglet, setOnglet] = useState('annonces');
  const [annonces, setAnnonces] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [action, setAction] = useState('');

  const charger = useCallback(async () => {
    setErreur('');
    setChargement(true);
    try {
      const [annoncesRes, utilisateursRes] = await Promise.all([
        api.get('/admin/annonces'),
        api.get('/admin/utilisateurs'),
      ]);
      setAnnonces(Array.isArray(annoncesRes.data) ? annoncesRes.data : annoncesRes.data?.annonces || []);
      setUtilisateurs(Array.isArray(utilisateursRes.data) ? utilisateursRes.data : utilisateursRes.data?.utilisateurs || []);
    } catch {
      setErreur('Impossible de charger les signalements. Réessayez.');
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => { charger(); }, [charger]);

  const annoncesSignalees = useMemo(() => annonces.filter((item) => nombreSignalements(item) > 0), [annonces]);
  const comptesSignales = useMemo(() => utilisateurs.filter((item) => nombreSignalements(item) > 0), [utilisateurs]);
  const liste = onglet === 'annonces' ? annoncesSignalees : comptesSignales;

  const traiterAnnonce = async (id) => {
    setAction(id);
    setErreur('');
    try {
      await api.patch(`/admin/annonces/${id}/signalements/traiter`);
      await charger();
    } catch {
      setErreur('Impossible de clôturer le signalement de cette annonce.');
    } finally {
      setAction('');
    }
  };

  const bloquerCompte = async (utilisateur) => {
    const id = utilisateur._id;
    setAction(id);
    setErreur('');
    try {
      await api.patch(`/admin/utilisateurs/${id}/bloquer`);
      await charger();
    } catch {
      setErreur('Impossible de modifier le statut de ce compte.');
    } finally {
      setAction('');
    }
  };

  return (
    <div className="page">
      <div className="admin-dashboard-heading">
        <div>
          <p className="admin-dashboard-kicker">MODÉRATION</p>
          <h1>Signalements</h1>
        </div>
        <button className="btn-secondary" onClick={charger} disabled={chargement}>
          <RefreshCw size={16} aria-hidden="true" /> Actualiser
        </button>
      </div>

      <div className="admin-report-tabs" role="tablist" aria-label="Type de signalement">
        <button role="tab" aria-selected={onglet === 'annonces'} className={onglet === 'annonces' ? 'active' : ''} onClick={() => setOnglet('annonces')}>
          Annonces <span>{annoncesSignalees.length}</span>
        </button>
        <button role="tab" aria-selected={onglet === 'comptes'} className={onglet === 'comptes' ? 'active' : ''} onClick={() => setOnglet('comptes')}>
          Comptes <span>{comptesSignales.length}</span>
        </button>
      </div>

      {erreur && <div className="alert-error" role="alert">{erreur}</div>}
      {chargement && <p className="empty-state">Chargement des signalements…</p>}
      {!chargement && !erreur && liste.length === 0 && (
        <div className="empty-state admin-reports-empty"><Flag size={22} aria-hidden="true" /><p>Aucun {onglet === 'annonces' ? 'produit' : 'compte'} signalé pour le moment.</p></div>
      )}
      {!chargement && liste.length > 0 && (
        <div className="table-responsive">
          <table className="admin-table">
            <thead><tr>
              <th>{onglet === 'annonces' ? 'Annonce' : 'Compte'}</th>
              <th>{onglet === 'annonces' ? 'Vendeur' : 'E-mail'}</th>
              <th>Signalements</th>
              <th>Statut</th>
              <th>Action</th>
            </tr></thead>
            <tbody>{liste.map((item) => {
              const id = item._id;
              const estAnnonce = onglet === 'annonces';
              const cible = estAnnonce ? item.titre : `${item.prenom || ''} ${item.nom || ''}`.trim() || item.email;
              const detail = estAnnonce
                ? `${item.utilisateur?.prenom || ''} ${item.utilisateur?.nom || ''}`.trim() || 'Vendeur inconnu'
                : item.email || '—';
              return <tr key={id}>
                <td><strong>{cible || 'Sans titre'}</strong>{estAnnonce && item.description && <small className="admin-report-description">{item.description}</small>}</td>
                <td>{detail}</td>
                <td><span className="badge badge-off">{nombreSignalements(item)}</span></td>
                <td><span className={`badge ${item.isBlocked ? 'badge-off' : 'badge-online'}`}>{item.isBlocked ? 'Bloqué' : 'Actif'}</span></td>
                <td>{estAnnonce ? (
                  <button onClick={() => traiterAnnonce(id)} disabled={action === id}>Clôturer</button>
                ) : (
                  <button className={item.isBlocked ? '' : 'text-danger'} onClick={() => bloquerCompte(item)} disabled={action === id}>{item.isBlocked ? 'Débloquer' : 'Bloquer le compte'}</button>
                )}</td>
              </tr>;
            })}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SignalementsAdmin;
