import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Conversation = () => {
  const { contactId } = useParams();
  const [searchParams] = useSearchParams();
  const annonceId = searchParams.get('annonce');
  const [messages, setMessages] = useState([]);
  const [texte, setTexte] = useState('');
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  useEffect(() => {
    let actif = true;
    const charger = async () => {
      try {
        const { data } = await api.get(`/messages/${contactId}`);
        if (actif) {
          setMessages(Array.isArray(data) ? data : []);
          setErreur('');
        }
      } catch {
        if (actif) setErreur('Impossible de charger la conversation. Vérifiez votre connexion.');
      }
    };
    charger();
    const interval = setInterval(charger, 5000);
    return () => {
      actif = false;
      clearInterval(interval);
    };
  }, [contactId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const envoyer = async (e) => {
    e.preventDefault();
    if (!texte.trim() || envoi) return;
    setErreur('');
    setEnvoi(true);
    try {
      const { data } = await api.post('/messages', {
        recepteur: contactId,
        contenu: texte.trim(),
        annonce: annonceId,
      });
      setMessages((precedents) => [...precedents, data]);
      setTexte('');
    } catch (error) {
      setErreur(error.response?.data?.message || 'Votre message n’a pas pu être envoyé. Réessayez.');
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="page conversation-page">
      <div className="conversation-header">
        <button onClick={() => navigate(-1)} aria-label="Retour"><ArrowLeft size={20} aria-hidden="true" /></button>
        <span>Conversation</span>
      </div>

      <div className="conversation-body">
        {erreur && <p className="conversation-error" role="alert">{erreur}</p>}
        {messages.map((m) => (
          <div
            key={m._id}
            className={`bulle ${m.expediteur === user._id ? 'bulle-moi' : 'bulle-autre'}`}
          >
            {m.contenu}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form className="conversation-input" onSubmit={envoyer}>
        <input
          placeholder="Écrire un message..."
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          aria-label="Votre message"
        />
        <button type="submit" aria-label="Envoyer le message" disabled={envoi || !texte.trim()}>
          <Send size={18} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
};

export default Conversation;
