import { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.events': 'Events',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    
    // Events
    'events.title': 'Discover Amazing Events',
    'events.subtitle': 'Find and book events that match your interests',
    'events.noResults': 'No events found',
    'events.bookNow': 'Book Now',
    'events.viewDetails': 'View Details',
    'events.category': 'Category',
    'events.date': 'Date',
    'events.location': 'Location',
    'events.price': 'Price',
    
    // Admin
    'admin.dashboard': 'Admin Dashboard',
    'admin.totalEvents': 'Total Events',
    'admin.pendingApprovals': 'Pending Approvals',
    'admin.activeUsers': 'Active Users',
    'admin.approve': 'Approve',
    'admin.reject': 'Reject',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in touch with our team',
    'contact.name': 'Your Name',
    'contact.email': 'Your Email',
    'contact.subject': 'Subject',
    'contact.message': 'Your Message',
    'contact.send': 'Send Message'
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.events': 'Eventos',
    'nav.about': 'Acerca de',
    'nav.contact': 'Contacto',
    'nav.login': 'Iniciar Sesión',
    'nav.signup': 'Registrarse',
    
    // Common
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.view': 'Ver',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    
    // Events
    'events.title': 'Descubre Eventos Increíbles',
    'events.subtitle': 'Encuentra y reserva eventos que coincidan con tus intereses',
    'events.noResults': 'No se encontraron eventos',
    'events.bookNow': 'Reservar Ahora',
    'events.viewDetails': 'Ver Detalles',
    'events.category': 'Categoría',
    'events.date': 'Fecha',
    'events.location': 'Ubicación',
    'events.price': 'Precio',
    
    // Admin
    'admin.dashboard': 'Panel de Administración',
    'admin.totalEvents': 'Total de Eventos',
    'admin.pendingApprovals': 'Aprobaciones Pendientes',
    'admin.activeUsers': 'Usuarios Activos',
    'admin.approve': 'Aprobar',
    'admin.reject': 'Rechazar',
    
    // Contact
    'contact.title': 'Contáctanos',
    'contact.subtitle': 'Ponte en contacto con nuestro equipo',
    'contact.name': 'Tu Nombre',
    'contact.email': 'Tu Email',
    'contact.subject': 'Asunto',
    'contact.message': 'Tu Mensaje',
    'contact.send': 'Enviar Mensaje'
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.events': 'Événements',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.login': 'Connexion',
    'nav.signup': 'S\'inscrire',
    
    // Common
    'common.loading': 'Chargement...',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.view': 'Voir',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    
    // Events
    'events.title': 'Découvrez des Événements Incroyables',
    'events.subtitle': 'Trouvez et réservez des événements qui correspondent à vos intérêts',
    'events.noResults': 'Aucun événement trouvé',
    'events.bookNow': 'Réserver Maintenant',
    'events.viewDetails': 'Voir les Détails',
    'events.category': 'Catégorie',
    'events.date': 'Date',
    'events.location': 'Lieu',
    'events.price': 'Prix'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const t = (key) => {
    return translations[currentLanguage]?.[key] || key;
  };

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language Selector Component
export const LanguageSelector = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  return (
    <div className="language-selector">
      <select 
        value={currentLanguage} 
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-dropdown"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};