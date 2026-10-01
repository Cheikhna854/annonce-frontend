import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { imageUrl } from '../api/imageUrl';

const CurrentUserPresence = () => {
  const { user } = useAuth();
  const [photoErreur, setPhotoErreur] = useState(false);
  const [enLigne, setEnLigne] = useState(() => navigator.onLine && document.visibilityState === 'visible');

  useEffect(() => {
    const actualiserPresence = () => setEnLigne(navigator.onLine && document.visibilityState === 'visible');
    window.addEventListener('online', actualiserPresence);
    window.addEventListener('offline', actualiserPresence);
    document.addEventListener('visibilitychange', actualiserPresence);
    return () => {
      window.removeEventListener('online', actualiserPresence);
      window.removeEventListener('offline', actualiserPresence);
      document.removeEventListener('visibilitychange', actualiserPresence);
    };
  }, []);

  useEffect(() => setPhotoErreur(false), [user?.photo]);

  if (!user) return null;
  const nom = [user.prenom, user.nom].filter(Boolean).join(' ') || 'Mon profil';

  return (
    <Link to="/profil" className="current-user-presence" aria-label={`Profil de ${nom}${enLigne ? ', en ligne' : ', hors ligne'}`}>
      <span className="current-user-avatar">
        {user.photo && !photoErreur ? <img src={imageUrl(user.photo)} alt="" onError={() => setPhotoErreur(true)} /> : <UserRound size={20} aria-hidden="true" />}
        <span className={`presence-dot ${enLigne ? 'is-online' : ''}`} aria-hidden="true" />
      </span>
      <span className="current-user-details">
        <span className="current-user-name">{nom}</span>
        <span className={`current-user-status ${enLigne ? 'is-online' : ''}`}>
          <span className="presence-dot-small" aria-hidden="true" />
          {enLigne ? 'En ligne' : 'Hors ligne'}
        </span>
      </span>
    </Link>
  );
};

export default CurrentUserPresence;
