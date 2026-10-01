import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import api from '../../api/axios';
import { imageUrl } from '../../api/imageUrl';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [tentative, setTentative] = useState(0);

  useEffect(() => {
    let actif = true;
    const controller = new AbortController();
    setChargement(true);
    setErreur('');

    api.get('/messages/conversations', { signal: controller.signal, timeout: 20000 })
      .then(({ data }) => {
        if (actif) setConversations(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        if (!actif || error.code === 'ERR_CANCELED') return;
        setErreur(error.code === 'ECONNABORTED'
          ? 'Le serveur met trop de temps à répondre. Réessayez.'
          : 'Impossible de charger vos conversations. Vérifiez votre connexion puis réessayez.');
      })
      .finally(() => {
        if (actif) setChargement(false);
      });

    return () => {
      actif = false;
      controller.abort();
    };
  }, [tentative]);

  const conversationsVisibles = conversations.filter((conv) => conv.contact?._id);

  return (
    <div className="page messages-page">
      <header className="messages-heading">
        <p className="messages-kicker">VOTRE ESPACE D’ÉCHANGE</p>
        <h1>Messages</h1>
        <p>Retrouvez ici vos conversations avec les membres.</p>
      </header>

      <div className="conversations-list">
        {conversationsVisibles.map((conv) => (
          <Link
            to={`/conversation/${conv.contact._id}`}
            key={conv.contact._id}
            className="conversation-item"
          >
            <img src={imageUrl(conv.contact.photo)} alt={`${conv.contact.prenom || ''} ${conv.contact.nom || ''}`} />
            <div className="conversation-info">
              <p className="conversation-nom">{conv.contact.prenom} {conv.contact.nom}</p>
              <p className="conversation-preview">{conv.dernierMessage?.contenu || 'Nouvelle conversation'}</p>
            </div>
            {conv.nonLus > 0 && <span className="badge-count">{conv.nonLus}</span>}
          </Link>
        ))}

        {chargement && (
          <div className="conversation-loading" role="status" aria-live="polite">
            <span className="loading-spinner" aria-hidden="true" />
            Chargement des conversations…
          </div>
        )}

        {!chargement && erreur && (
          <div className="messages-error">
            <p role="alert">{erreur}</p>
            <button type="button" onClick={() => setTentative((value) => value + 1)}>Réessayer</button>
          </div>
        )}

        {!chargement && !erreur && conversationsVisibles.length === 0 && (
          <div className="empty-state">
            <MessageCircle size={30} aria-hidden="true" />
            <p>Aucune conversation pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
