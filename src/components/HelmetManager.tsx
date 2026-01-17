import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface HelmetManagerProps {
  language: 'tr' | 'en';
  activeSection?: string;
}

// OG Images configuration
const OG_IMAGES = {
  default: '/allyncai-og-future-is-now-holographic-hero.jpg',
  ai: '/allyncai-og-innovation-lab-ai-powered.jpg',
  digital: '/allyncai-og-3d-ecosystem-floating-island.jpg',
  whatsapp: '/allyncai-og-dynamic-motion-always-on-24-7.jpg',
  contact: '/allyncai-og-dynamic-motion-always-on-24-7.jpg',
  about: '/allyncai-og-success-story-1000-businesses.jpg',
};

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

  // Get OG image based on current route
  const getOgImage = () => {
    const baseUrl = 'https://www.allyncai.com';
    const path = location.pathname;

    if (path.includes('/ai/whatsapp')) {
      return `${baseUrl}${OG_IMAGES.whatsapp}`;
    } else if (path.startsWith('/ai')) {
      return `${baseUrl}${OG_IMAGES.ai}`;
    } else if (path.startsWith('/digital')) {
      return `${baseUrl}${OG_IMAGES.digital}`;
    } else if (path === '/contact') {
      return `${baseUrl}${OG_IMAGES.contact}`;
    }

    return `${baseUrl}${OG_IMAGES.default}`;
  };

  // Get description based on route and language
  const getDescription = () => {
    const path = location.pathname;

    if (path.startsWith('/ai')) {
      return language === 'tr'
        ? 'Allync AI çözümleri ile işletmenizi geleceğe taşıyın. WhatsApp AI asistanları, chatbotlar ve yapay zeka otomasyonu.'
        : 'Transform your business with Allync AI solutions. WhatsApp AI assistants, chatbots and AI automation.';
    } else if (path.startsWith('/digital')) {
      return language === 'tr'
        ? 'Allync dijital çözümleri: Özel SaaS panelleri, web sitesi, mobil uygulama ve e-ticaret geliştirme.'
        : 'Allync digital solutions: Custom SaaS panels, websites, mobile apps and e-commerce development.';
    }

    return language === 'tr'
      ? 'Allync - WhatsApp AI asistanları ile 7/24 müşteri hizmeti. İşletmenize özel SaaS ve yönetim panelleri.'
      : 'Allync - 24/7 customer service with WhatsApp AI assistants. Custom SaaS and management panels for your business.';
  };

  return (
    <Helmet>
      <html lang={language} />
      <title>{getSectionTitle()}</title>
      <meta name="description" content={getDescription()} />
      <link rel="canonical" href={getCanonicalUrl()} />
      <meta property="og:url" content={getCanonicalUrl()} />
      <meta property="og:locale" content={language === 'tr' ? 'tr_TR' : 'en_US'} />
      <meta property="og:image" content={getOgImage()} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:image" content={getOgImage()} />
    </Helmet>
  );
};
