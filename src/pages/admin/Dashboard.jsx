import { useEffect, useState } from 'react';
import api from '../../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    let actif = true;
    api.get('/admin/stats')
      .then((res) => { if (actif) setStats(res.data); })
      .catch(() => { if (actif) setErreur('Impossible de charger les statistiques.'); });
    return () => { actif = false; };
  }, []);

  if (!stats && erreur) return <div className="page"><div className="alert-error" role="alert">{erreur}</div></div>;
  if (!stats) return <div className="page">Chargement des statistiques...</div>;

  const indicateurs = [
    { label: 'Utilisateurs', valeur: stats.totalUsers, tone: 'users' },
    { label: 'Annonces', valeur: stats.totalAnnonces, tone: 'annonces' },
    { label: 'En attente', valeur: stats.enAttente, tone: 'attente' },
    { label: 'Signalements', valeur: stats.signalements, tone: 'signalements' },
  ];
  const maximum = Math.max(1, ...indicateurs.map((item) => Number(item.valeur) || 0));
  const graduations = [maximum, Math.round(maximum * 0.75), Math.round(maximum * 0.5), Math.round(maximum * 0.25), 0];

  return (
    <div className="page admin-dashboard">
      <div className="admin-dashboard-heading">
        <div>
          <p className="admin-dashboard-kicker">SUPERVISION</p>
          <h1>Dashboard Admin</h1>
        </div>
        <span className="admin-session-label">Vue générale</span>
      </div>

      <div className="stats-grid">
        {indicateurs.map((item) => (
          <article className={`stat-card stat-card-${item.tone}`} key={item.tone}>
            <p className="stat-label">{item.label}</p>
            <p className="stat-value">{item.valeur}</p>
          </article>
        ))}
      </div>

      <section className="admin-chart" aria-labelledby="admin-chart-title">
        <h2 id="admin-chart-title">Vue d’ensemble</h2>
        <div className="admin-chart-plot">
          <div className="admin-chart-scale" aria-hidden="true">
            {graduations.map((tick, index) => <span key={`${tick}-${index}`}>{tick}</span>)}
          </div>
          <div className="admin-chart-columns">
            {indicateurs.map((item) => {
              const valeur = Number(item.valeur) || 0;
              const hauteur = valeur === 0 ? 0 : Math.max(3, (valeur / maximum) * 100);
              return (
                <div className="admin-chart-column" key={item.tone}>
                  <div className="admin-chart-track">
                    <div
                      className={`admin-chart-bar admin-chart-bar-${item.tone}`}
                      style={{ height: `${hauteur}%` }}
                      title={`${item.label}: ${valeur}`}
                    />
                  </div>
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
