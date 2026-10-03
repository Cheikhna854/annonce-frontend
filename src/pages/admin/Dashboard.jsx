import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Download, Flag, Heart, Megaphone, Printer, RefreshCw, UsersRound } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const palette = {
  users: '#dcae42',
  annonces: '#168454',
  jaime: '#ce5872',
  signalements: '#d94c45',
};

const indicateursBase = [
  { label: 'Utilisateurs', cle: 'totalUsers', tone: 'users', icon: UsersRound, destination: '/admin/utilisateurs', aide: 'Comptes inscrits' },
  { label: 'Annonces', cle: 'totalAnnonces', tone: 'annonces', icon: Megaphone, destination: '/admin/annonces', aide: 'Offres publiées' },
  { label: 'Favoris', cle: 'totalJaime', tone: 'jaime', icon: Heart, aide: 'Intérêt des membres' },
  { label: 'Signalements', cle: 'signalements', tone: 'signalements', icon: Flag, destination: '/admin/signalements', aide: 'À examiner' },
];

const nombre = (valeur) => Number(valeur) || 0;
const formatNombre = (valeur) => nombre(valeur).toLocaleString('fr-FR');

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(true);
  const [actualiseLe, setActualiseLe] = useState(null);
  const [indicateurChoisi, setIndicateurChoisi] = useState('users');

  const charger = useCallback(async () => {
    setErreur('');
    setChargement(true);
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
      setActualiseLe(new Date());
    } catch {
      setErreur('Impossible de charger les statistiques. Réessayez.');
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => { charger(); }, [charger]);

  const indicateurs = useMemo(() => indicateursBase.map((item) => ({
    ...item,
    valeur: nombre(stats?.[item.cle]),
  })), [stats]);
  const total = indicateurs.reduce((somme, item) => somme + item.valeur, 0);
  const maximum = Math.max(1, ...indicateurs.map((item) => item.valeur));
  const selection = indicateurs.find((item) => item.tone === indicateurChoisi) || indicateurs[0];
  const progression = indicateurs.reduce((state, item) => {
    const debut = total ? state.courant / total * 100 : 0;
    state.courant += item.valeur;
    const fin = total ? state.courant / total * 100 : 100;
    state.segments.push(`${palette[item.tone]} ${debut}% ${fin}%`);
    return state;
  }, { courant: 0, segments: [] });
  const donutStyle = { '--donut-fill': total ? `conic-gradient(${progression.segments.join(', ')})` : '#e5e9e2' };
  const date = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  const exporter = () => {
    const lignes = [['Indicateur', 'Valeur'], ...indicateurs.map(({ label, valeur }) => [label, valeur])];
    const contenu = `\uFEFF${lignes.map((ligne) => ligne.map((cellule) => `"${String(cellule).replaceAll('"', '""')}"`).join(';')).join('\n')}`;
    const url = URL.createObjectURL(new Blob([contenu], { type: 'text/csv;charset=utf-8' }));
    const lien = document.createElement('a');
    lien.href = url;
    lien.download = 'dashboard-sunumarche.csv';
    lien.click();
    URL.revokeObjectURL(url);
  };

  if (!stats && chargement) {
    return <div className="page admin-dashboard"><div className="admin-dashboard-loading"><span className="admin-dashboard-spinner" />Chargement de votre espace de pilotage…</div></div>;
  }
  if (!stats && erreur) return <div className="page admin-dashboard"><div className="alert-error" role="alert">{erreur} <button className="admin-dashboard-retry" onClick={charger}>Réessayer</button></div></div>;

  return (
    <div className="page admin-dashboard admin-dashboard-v2">
      <header className="dashboard-welcome">
        <div className="dashboard-welcome-copy">
          <p className="admin-dashboard-kicker"><Activity size={14} aria-hidden="true" /> CENTRE DE PILOTAGE</p>
          <h1>Vue générale<span className="dashboard-title-dot">.</span></h1>
          <p className="dashboard-date">{date.charAt(0).toLocaleUpperCase('fr-FR') + date.slice(1)} <span>·</span> Bonjour {user?.prenom || 'Admin'}, voici l’activité de la plateforme.</p>
        </div>
        <div className="dashboard-header-actions">
          <button className="dashboard-action-button" type="button" onClick={() => window.print()}><Printer size={16} aria-hidden="true" /> Imprimer</button>
          <button className="dashboard-action-button dashboard-action-primary" type="button" onClick={exporter}><Download size={16} aria-hidden="true" /> Exporter</button>
          <button className="dashboard-refresh" type="button" onClick={charger} disabled={chargement} aria-label="Actualiser les statistiques" title="Actualiser">
            <RefreshCw size={17} className={chargement ? 'is-spinning' : ''} aria-hidden="true" />
          </button>
        </div>
      </header>

      {erreur && <div className="alert-error" role="alert">{erreur} Les dernières données chargées restent affichées.</div>}

      <section className="dashboard-kpis" aria-label="Indicateurs clés">
        {indicateurs.map((item, index) => {
          const Icon = item.icon;
          const carte = <article className={`dashboard-kpi dashboard-kpi-${item.tone}`} style={{ '--kpi-delay': `${index * 80}ms` }}>
            <div className="dashboard-kpi-top"><span className="dashboard-kpi-icon"><Icon size={19} strokeWidth={2} aria-hidden="true" /></span>{item.destination && <ArrowRight className="dashboard-kpi-arrow" size={16} aria-hidden="true" />}</div>
            <p className="dashboard-kpi-label">{item.label}</p>
            <p className="dashboard-kpi-value">{formatNombre(item.valeur)}</p>
            <p className="dashboard-kpi-help">{item.aide}</p>
          </article>;
          return item.destination ? <Link to={item.destination} className="dashboard-kpi-link" key={item.tone}>{carte}</Link> : <div className="dashboard-kpi-link" key={item.tone}>{carte}</div>;
        })}
      </section>

      <div className="dashboard-section-heading">
        <div><p className="admin-dashboard-kicker">ANALYSE DE L’ACTIVITÉ</p><h2>Vue d’ensemble</h2></div>
        <span className="dashboard-live-label"><i /> Données globales {actualiseLe && `· ${actualiseLe.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}</span>
      </div>

      <section className="dashboard-analytics-grid">
        <article className="dashboard-panel dashboard-bars-panel">
          <div className="dashboard-panel-heading">
            <div><h3>Indicateurs de la plateforme</h3><p>Comparaison des volumes actuels</p></div>
            <span className="dashboard-panel-mark"><Activity size={17} aria-hidden="true" /></span>
          </div>
          <div className="dashboard-bars">
            {indicateurs.map((item, index) => {
              const hauteur = item.valeur ? Math.max(4, item.valeur / maximum * 100) : 0;
              return <div className="dashboard-bar-column" key={item.tone}>
                <div className="dashboard-bar-value">{formatNombre(item.valeur)}</div>
                <div className="dashboard-bar-track"><div className={`dashboard-bar dashboard-bar-${item.tone}`} style={{ '--bar-height': `${hauteur}%`, '--bar-delay': `${index * 110}ms` }} /></div>
                <span className="dashboard-bar-label">{item.label}</span>
              </div>;
            })}
          </div>
          <p className="dashboard-chart-note">Les barres sont mises à l’échelle selon l’indicateur le plus élevé.</p>
        </article>

        <article className="dashboard-panel dashboard-donut-panel">
          <div className="dashboard-panel-heading">
            <div><h3>Répartition des indicateurs</h3><p>Part de chaque volume dans le total affiché</p></div>
            <span className="dashboard-panel-mark"><Activity size={17} aria-hidden="true" /></span>
          </div>
          <div className="dashboard-donut-content">
            <div className="dashboard-donut" style={{ ...donutStyle, '--donut-color': palette[selection.tone] }} role="img" aria-label={indicateurs.map((item) => `${item.label} : ${formatNombre(item.valeur)}`).join(', ')}>
              <div className="dashboard-donut-center"><strong>{formatNombre(selection.valeur)}</strong><span>{selection.label}</span></div>
            </div>
            <ul className="dashboard-legend" aria-label="Sélectionner un indicateur">
              {indicateurs.map((item) => {
                const part = total ? Math.round(item.valeur / total * 100) : 0;
                return <li key={item.tone}><button type="button" className={selection.tone === item.tone ? 'selected' : ''} onClick={() => setIndicateurChoisi(item.tone)} aria-pressed={selection.tone === item.tone}>
                  <span className={`dashboard-legend-swatch dashboard-swatch-${item.tone}`} /><span className="dashboard-legend-name">{item.label}</span><span className="dashboard-legend-part">{part}%</span><strong>{formatNombre(item.valeur)}</strong>
                </button></li>;
              })}
            </ul>
          </div>
        </article>
      </section>

      <section className="dashboard-quick-actions">
        <div className="dashboard-quick-intro"><span className="dashboard-quick-icon"><Flag size={18} aria-hidden="true" /></span><div><strong>Gardez la plateforme saine</strong><span>Accédez rapidement aux tâches de modération.</span></div></div>
        <div className="dashboard-quick-links"><Link to="/admin/signalements">Examiner les signalements <ArrowRight size={15} aria-hidden="true" /></Link><Link to="/admin/annonces">Gérer les annonces <ArrowRight size={15} aria-hidden="true" /></Link></div>
      </section>
    </div>
  );
};

export default Dashboard;
