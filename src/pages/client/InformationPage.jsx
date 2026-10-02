import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SiteFooter from '../../components/SiteFooter';

const contenu = {
  '/a-propos': {
    surtitre: 'NOTRE PLATEFORME',
    titre: 'Qui sommes-nous ?',
    intro: 'SenAnnonces rapproche les personnes qui vendent et celles qui recherchent de bonnes affaires au Sénégal.',
    sections: [
      ['Notre objectif', 'Nous proposons un espace simple pour publier, découvrir et gérer des petites annonces dans des catégories comme l’immobilier, l’automobile, l’emploi, les téléphones, l’informatique, la mode, les services et l’électronique.'],
      ['Acheter et vendre', 'Les acheteurs peuvent parcourir les annonces et contacter les vendeurs. Les vendeurs peuvent publier leurs produits, modifier leurs annonces et échanger avec les personnes intéressées.'],
      ['Besoin d’aide ?', 'Notre équipe est à votre disposition par email à annonce854@gmail.com ou par téléphone au +221 77 857 96 93.'],
    ],
  },
  '/conditions-utilisation': {
    surtitre: 'INFORMATIONS PRATIQUES',
    titre: 'Conditions d’utilisation',
    intro: 'En utilisant SenAnnonces, vous vous engagez à respecter les règles suivantes.',
    sections: [
      ['Votre compte', 'Gardez vos informations de connexion confidentielles et fournissez des informations exactes lors de la création de votre compte. Vous êtes responsable de l’activité effectuée depuis celui-ci.'],
      ['Vos annonces', 'Publiez des annonces exactes, avec des photos correspondant au produit ou au service proposé. Ne publiez pas de contenu illégal, trompeur, frauduleux ou portant atteinte aux droits d’autrui.'],
      ['Échanges entre utilisateurs', 'Avant une transaction, vérifiez les informations du vendeur et du produit. Les acheteurs et vendeurs conviennent directement des modalités de paiement, de livraison et de remise du bien.'],
      ['Modération', 'SenAnnonces peut examiner, désactiver ou retirer une annonce qui ne respecte pas ces règles, et prendre des mesures sur les comptes concernés.'],
      ['Contact', 'Pour toute question sur ces conditions, écrivez à annonce854@gmail.com.'],
    ],
  },
  '/confidentialite': {
    surtitre: 'VOS DONNÉES',
    titre: 'Confidentialité',
    intro: 'Nous utilisons les informations nécessaires au fonctionnement de votre compte et des services de SenAnnonces.',
    sections: [
      ['Informations utilisées', 'Les informations de compte, annonces, favoris et échanges servent à fournir les fonctionnalités de la plateforme, sécuriser les comptes et répondre aux demandes d’assistance.'],
      ['Visibilité', 'Les annonces publiées sont visibles par les visiteurs de la plateforme. Évitez d’inclure dans leur description des informations personnelles que vous ne souhaitez pas rendre publiques.'],
      ['Vos choix', 'Vous pouvez gérer votre profil et vos annonces depuis votre espace. Pour toute demande concernant vos informations, contactez-nous à annonce854@gmail.com.'],
    ],
  },
};

const InformationPage = () => {
  const { pathname } = useLocation();
  const page = contenu[pathname] || contenu['/a-propos'];

  return (
    <div className="information-page-shell">
      <main className="information-page">
        <Link to="/" className="information-back"><ArrowLeft size={16} aria-hidden="true" /> Retour à l’accueil</Link>
        <p className="information-eyebrow">{page.surtitre}</p>
        <h1>{page.titre}</h1>
        <p className="information-intro">{page.intro}</p>
        <div className="information-sections">
          {page.sections.map(([titre, texte]) => (
            <section key={titre}>
              <h2>{titre}</h2>
              <p>{texte}</p>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default InformationPage;
