import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface HelmetManagerProps {
  language: 'tr' | 'en';
  activeSection?: string;
}

export const HelmetManager: React.FC<HelmetManagerProps> = ({ language, activeSection = 'hero' }) => {
  const location = useLocation();

  const getSectionTitle = () => {
    const baseTitles: Record<string, Record<string, string>> = {
      tr: {
        hero: 'Allync - WhatsApp AI Asistanları & Özel SaaS Çözümleri | AllyncAI',
        features: 'Allync | Özellikler',
        pricing: 'Allync | Fiyatlandırma',
        contact: 'Allync | İletişim',
        packages: 'Allync | Paketler',
        'chat-demo': 'Allync | Demo',
        'industry-examples': 'Allync | Sektörler'
      },
      en: {
        hero: 'Allync - WhatsApp AI Assistants & Custom SaaS Solutions | AllyncAI',
        features: 'Allync | Features',
        pricing: 'Allync | Pricing',
        contact: 'Allync | Contact Us',
        packages: 'Allync | Packages',
        'chat-demo': 'Allync | Demo',
        'industry-examples': 'Allync | Industries'
      }
    };

    return baseTitles[language][activeSection] || baseTitles[language].hero;
  };

  // Generate canonical URL based on current path
  const getCanonicalUrl = () => {
    const baseUrl = 'https://www.allyncai.com';
    const path = location.pathname;
    // Remove trailing slash except for root
    const cleanPath = path === '/' ? '' : path.replace(/\/$/, '');
    return `${baseUrl}${cleanPath}`;
  };

  return (
    <Helmet>
      <html lang={language} />
      <title>{getSectionTitle()}</title>
      <link rel="canonical" href={getCanonicalUrl()} />
      <meta property="og:url" content={getCanonicalUrl()} />
      <meta property="og:locale" content={language === 'tr' ? 'tr_TR' : 'en_US'} />
    </Helmet>
  );
};
