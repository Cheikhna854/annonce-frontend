import { Bell, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Notifications = () => {
  return (
    <div className="page">
      <h1>Notifications</h1>
      <div className="notifications-empty">
        <Bell size={28} strokeWidth={1.6} aria-hidden="true" />
        <h2>Aucune notification pour le moment</h2>
        <p>Les nouvelles concernant vos annonces et vos échanges apparaîtront ici.</p>
        <Link to="/messages"><MessageCircle size={17} aria-hidden="true" /> Consulter mes messages</Link>
      </div>
    </div>
  );
};

export default Notifications;
