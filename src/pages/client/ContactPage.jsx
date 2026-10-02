import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import api from '../../api/axios';
import SiteFooter from '../../components/SiteFooter';

const ContactPage = () => {
  const [form, setForm] = useState({ nom: '', email: '', message: '' });
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState(false);

  const envoyer = async (event) => {
    event.preventDefault();
    setErreur('');
    setSucces(false);
    setEnvoi(true);
    try {
      await api.post('/contact', form);
      setSucces(true);
      setForm({ nom: '', email: '', message: '' });
    } catch (error) {
      setErreur(error.response?.data?.message || 'Le message n’a pas pu être envoyé. Réessayez ou écrivez-nous à annonce854@gmail.com.');
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="contact-page-shell">
      <main className="contact-page">
        <Link to="/" className="information-back"><ArrowLeft size={16} aria-hidden="true" /> Retour à l’accueil</Link>
        <div className="contact-card">
          <div className="contact-heading-icon"><Mail size={23} aria-hidden="true" /></div>
          <p className="information-eyebrow">NOUS SOMMES À VOTRE ÉCOUTE</p>
          <h1>Envoyer un email</h1>
          <p className="information-intro">Une question ou besoin d’aide ? Écrivez à notre équipe. Nous vous répondrons à l’adresse email indiquée.</p>

          {erreur && <div className="alert-error" role="alert">{erreur}</div>}
          {succes && <div className="contact-success" role="status">Votre message a bien été envoyé. Merci de nous avoir contactés.</div>}

          <form className="contact-form" onSubmit={envoyer}>
            <label htmlFor="contact-nom">Votre nom</label>
            <input id="contact-nom" name="nom" autoComplete="name" maxLength={80} required value={form.nom} onChange={(event) => setForm({ ...form, nom: event.target.value })} />

            <label htmlFor="contact-email">Votre email</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />

            <label htmlFor="contact-message">Votre message</label>
            <textarea id="contact-message" name="message" rows={6} maxLength={2000} required value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />

            <button type="submit" className="btn-primary" disabled={envoi}>
              <Send size={17} aria-hidden="true" /> {envoi ? 'Envoi en cours…' : 'Envoyer le message'}
            </button>
          </form>
          <p className="contact-direct-email">Ou écrivez directement à <a href="mailto:annonce854@gmail.com">annonce854@gmail.com</a></p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ContactPage;
