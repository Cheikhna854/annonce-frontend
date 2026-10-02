import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import api from '../../api/axios';

const normaliserRole = (role = '') => {
  const valeur = String(role).toLowerCase().trim();
  if (['vendeur', 'prestataire', 'seller'].includes(valeur)) return 'vendeur';
  if (['client', 'customer'].includes(valeur)) return 'client';
  if (['admin', 'administrateur', 'super_admin', 'superadmin'].includes(valeur)) return 'admin';
  return valeur || 'autre';
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filtre, setFiltre] = useState('tous');
  const [recherche, setRecherche] = useState('');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [action, setAction] = useState('');

  const charger = async () => {
    setErreur('');
    try {
      const { data } = await api.get('/admin/utilisateurs');
      setUsers(Array.isArray(data) ? data : data?.utilisateurs || []);
    } catch {
      setErreur('Impossible de charger les utilisateurs. Réessayez.');
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => { charger(); }, []);

  const compteurs = useMemo(() => users.reduce((compte, user) => {
    compte[normaliserRole(user.role)] = (compte[normaliserRole(user.role)] || 0) + 1;
    compte.tous += 1;
    return compte;
  }, { tous: 0 }), [users]);

  const utilisateursFiltres = useMemo(() => {
    const terme = recherche.trim().toLocaleLowerCase('fr');
    return users.filter((user) => {
      const roleCorrespond = filtre === 'tous' || normaliserRole(user.role) === filtre;
      const nom = `${user.prenom || ''} ${user.nom || ''}`.trim();
      const rechercheCorrespond = !terme || `${nom} ${user.email || ''}`.toLocaleLowerCase('fr').includes(terme);
      return roleCorrespond && rechercheCorrespond;
    });
  }, [users, filtre, recherche]);

  const toggleBloquer = async (user) => {
    setAction(user._id);
    setErreur('');
    try {
      await api.patch(`/admin/utilisateurs/${user._id}/bloquer`);
      await charger();
    } catch {
      setErreur('Impossible de modifier le statut de cet utilisateur.');
    } finally {
      setAction('');
    }
  };

  const filtres = [
    { id: 'tous', label: 'Tous' },
    { id: 'client', label: 'Clients' },
    { id: 'vendeur', label: 'Vendeurs' },
    { id: 'admin', label: 'Administrateurs' },
  ];

  return (
    <div className="page admin-users-page">
      <div className="admin-dashboard-heading">
        <div><p className="admin-dashboard-kicker">GESTION DES COMPTES</p><h1>Utilisateurs</h1></div>
      </div>
      <div className="admin-users-toolbar">
        <label className="admin-users-search">
          <Search size={16} aria-hidden="true" />
          <input value={recherche} onChange={(event) => setRecherche(event.target.value)} placeholder="Recherchez un nom ou un email..." aria-label="Rechercher un utilisateur par nom ou email" />
        </label>
        <div className="admin-users-filters" role="tablist" aria-label="Filtrer les utilisateurs par rôle">
          {filtres.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={filtre === item.id} className={filtre === item.id ? 'active' : ''} onClick={() => setFiltre(item.id)}>
              {item.label} <span>{compteurs[item.id] || 0}</span>
            </button>
          ))}
        </div>
      </div>
      {erreur && <div className="alert-error" role="alert">{erreur}</div>}
      {chargement ? <p className="empty-state">Chargement des utilisateurs…</p> : (
        <div className="table-responsive">
          <table className="admin-table admin-users-table">
            <thead><tr><th>Utilisateur</th><th>E-mail</th><th>Rôle</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {utilisateursFiltres.map((user) => {
                const nom = `${user.prenom || ''} ${user.nom || ''}`.trim() || 'Utilisateur';
                const role = normaliserRole(user.role);
                const labelRole = role === 'vendeur' ? 'Vendeur' : role === 'client' ? 'Client' : role === 'admin' ? 'Administrateur' : user.role || 'Autre';
                const initiales = nom.split(/\s+/).slice(0, 2).map((partie) => partie[0]).join('').toUpperCase();
                return <tr key={user._id}>
                  <td><span className={`admin-user-avatar role-${role}`} aria-hidden="true">{initiales}</span><strong>{nom}</strong></td>
                  <td>{user.email || '—'}</td>
                  <td><span className={`admin-role-pill role-${role}`}>{labelRole}</span></td>
                  <td><span className={`badge ${user.isBlocked ? 'badge-off' : 'badge-online'}`}><span className="admin-status-dot" />{user.isBlocked ? 'Bloqué' : 'Actif'}</span></td>
                  <td><button className={user.isBlocked ? '' : 'text-danger'} onClick={() => toggleBloquer(user)} disabled={action === user._id}>{user.isBlocked ? 'Débloquer' : 'Bloquer'}</button></td>
                </tr>;
              })}
              {!utilisateursFiltres.length && <tr><td colSpan="5" className="admin-users-empty">Aucun utilisateur ne correspond à cette recherche.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
