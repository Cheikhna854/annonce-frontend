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
    { label: 'Favoris', valeur: stats.totalJaime, tone: 'jaime' },
    { label: 'Signalements', valeur: stats.signalements, tone: 'signalements' },
  ];
  const maximum = Math.max(1, ...indicateurs.map((item) => Number(item.valeur) || 0));
  const graduations = [maximum, Math.round(maximum * 0.75), Math.round(maximum * 0.5), Math.round(maximum * 0.25), 0];
  const couleurs = { users: '#e3b34c', annonces: '#168454', jaime: '#d94d67', signalements: '#dc2626' };
  const totalIndicateurs = indicateurs.reduce((total, item) => total + (Number(item.valeur) || 0), 0);
  let progression = 0;
  const partsCirculaires = indicateurs.map((item) => {
    const valeur = Number(item.valeur) || 0;
    const debut = totalIndicateurs ? progression / totalIndicateurs * 100 : 0;
    progression += valeur;
    const fin = totalIndicateurs ? progression / totalIndicateurs * 100 : 100;
    return `${couleurs[item.tone]} ${debut}% ${fin}%`;
  });
  const fondCirculaire = totalIndicateurs
    ? `conic-gradient(${partsCirculaires.join(', ')})`
    : 'conic-gradient(#e5e7eb 0% 100%)';

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

      <section className="admin-chart admin-pie-chart" aria-labelledby="admin-pie-title">
        <div className="admin-pie-heading">
          <h2 id="admin-pie-title">Répartition des indicateurs</h2>
          <p>Vue circulaire des données du tableau de bord</p>
        </div>
        <div className="admin-pie-content">
          <div
            className="admin-pie"
            style={{ background: fondCirculaire }}
            role="img"
            aria-label={indicateurs.map((item) => `${item.label} : ${item.valeur}`).join(', ')}
          >
            <span>Répartition</span>
          </div>
          <ul className="admin-pie-legend">
            {indicateurs.map((item) => (
              <li key={item.tone}>
                <span className="admin-pie-key" style={{ backgroundColor: couleurs[item.tone] }} aria-hidden="true" />
                <span>{item.label}</span>
                <strong>{item.valeur}</strong>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
