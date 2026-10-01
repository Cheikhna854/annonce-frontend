import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [etape, setEtape] = useState(1);
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setLoading(true);
    try {
      if (etape === 1) {
        await api.post('/auth/mot-de-passe-oublie', { email });
        setEtape(2);
      } else if (etape === 2) {
        if (!/^\d{6}$/.test(code.trim())) throw new Error('Le code doit contenir 6 chiffres.');
        setEtape(3);
      } else {
        if (motDePasse.length < 8) throw new Error('Le mot de passe doit contenir au moins 8 caractères.');
        if (motDePasse !== confirmation) throw new Error('Les mots de passe ne correspondent pas.');
        await api.post('/auth/reinitialiser-mot-de-passe', { email, code, nouveauMotDePasse: motDePasse });
        setEtape(4);
      }
    } catch (err) {
      setErreur(err.response?.data?.message || err.message || 'Une erreur est survenue. Vérifiez vos informations et réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="lock-icon" aria-hidden="true">🔒</div>
      <h1>{etape === 4 ? 'Mot de passe modifié' : 'Mot de passe oublié'}</h1>
      <p className="subtitle">{etape === 1 ? 'Entrez l’adresse e-mail associée à votre compte.' : etape === 2 ? `Saisissez le code reçu à ${email}.` : etape === 3 ? 'Choisissez un nouveau mot de passe.' : 'Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.'}</p>

      {erreur && <div className="alert-error" role="alert">{erreur}</div>}
      {etape === 4 ? (
        <div className="alert-success">Votre mot de passe a été réinitialisé.</div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          {etape === 1 && <input type="email" autoComplete="email" placeholder="Adresse e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />}
          {etape === 2 && <input type="text" inputMode="numeric" autoComplete="one-time-code" placeholder="Code reçu par e-mail" value={code} onChange={(e) => setCode(e.target.value)} required />}
          {etape === 3 && <>
            <input type="password" autoComplete="new-password" placeholder="Nouveau mot de passe (8 caractères minimum)" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} minLength={8} required />
            <input type="password" autoComplete="new-password" placeholder="Confirmer le mot de passe" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} minLength={8} required />
          </>}
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Veuillez patienter…' : etape === 1 ? 'Recevoir un code' : etape === 2 ? 'Vérifier le code' : 'Réinitialiser le mot de passe'}</button>
        </form>
      )}

      <p className="auth-footer">
        <Link to="/connexion">Retour à la connexion</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
