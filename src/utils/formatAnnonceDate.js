const formateurRelatif = new Intl.RelativeTimeFormat('fr', { numeric: 'always' });

export default function formatAnnonceDate(date) {
  if (!date) return '';
  const tempsEcoule = Math.max(0, Date.now() - new Date(date).getTime());
  if (!Number.isFinite(tempsEcoule)) return '';

  const jours = Math.floor(tempsEcoule / 86_400_000);
  if (jours >= 365) return formateurRelatif.format(-Math.floor(jours / 365), 'year');
  if (jours >= 30) return formateurRelatif.format(-Math.floor(jours / 30), 'month');
  if (jours >= 1) return formateurRelatif.format(-jours, 'day');

  const heures = Math.floor(tempsEcoule / 3_600_000);
  if (heures >= 1) return formateurRelatif.format(-heures, 'hour');
  const minutes = Math.floor(tempsEcoule / 60_000);
  return minutes >= 1 ? formateurRelatif.format(-minutes, 'minute') : 'à l’instant';
}
