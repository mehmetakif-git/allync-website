import { Helmet } from 'react-helmet-async';

interface HelmetManagerProps {
  language: 'tr' | 'en';
  activeSection?: string;
}

export const HelmetManager: React.FC<HelmetManagerProps> = ({ language, activeSection = 'hero' }) => {
  const getSectionTitle = () => {
    const baseTitles: Record<string, Record<string, string>> = {
      tr: {
        hero: 'Allync - AI & Digital Business Automation | AllyncAI',
        features: 'Allync | Özellikler',
        pricing: 'Allync | Fiyatlandırma',
        contact: 'Allync | İletişim',
        packages: 'Allync | Paketler',
        'chat-demo': 'Allync | Demo',
        'industry-examples': 'Allync | Sektörler'
      },
      en: {
        hero: 'Allync - AI & Digital Business Automation | AllyncAI',
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

  // Only update dynamic elements, not meta description or canonical (handled in index.html)
  return (
    <Helmet>
      <html lang={language} />
      <title>{getSectionTitle()}</title>
      <meta property="og:locale" content={language === 'tr' ? 'tr_TR' : 'en_US'} />
    </Helmet>
  );
};
