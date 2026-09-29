import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import api from '../../api/axios';
import { imageUrl } from '../../api/imageUrl';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    let actif = true;
    api.get('/messages/conversations')
      .then((res) => { if (actif) setConversations(Array.isArray(res.data) ? res.data : []); })
      .catch(() => { if (actif) setErreur('Impossible de charger vos conversations. Réessayez.'); })
      .finally(() => { if (actif) setChargement(false); });
    return () => { actif = false; };
  }, []);

  return (
    <div className="page">
      <h2>Messages</h2>
      <div className="conversations-list">
        {conversations.filter((conv) => conv.contact?._id).map((conv) => (
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
        {chargement && <p className="empty-state">Chargement des conversations...</p>}
        {!chargement && erreur && <p className="empty-state" role="alert">{erreur}</p>}
        {!chargement && !erreur && conversations.length === 0 && (
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
