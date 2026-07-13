import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface HelmetManagerProps {
  language: 'tr' | 'en';
  activeSection?: string;
}

// OG Images configuration — single brand logo across all routes
const OG_IMAGES = {
  default: '/allync-social-media-logo.png',
  ai: '/allync-social-media-logo.png',
  digital: '/allync-social-media-logo.png',
  whatsapp: '/allync-social-media-logo.png',
  contact: '/allync-social-media-logo.png',
  about: '/allync-social-media-logo.png',
};

// Per-route unique metadata for SEO (prevents duplicate content)
const ROUTE_META: Record<string, { tr: { title: string; description: string }; en: { title: string; description: string } }> = {
  '/': {
    tr: {
      title: 'Allync — AI İş Ekosistemi | WhatsApp AI, Dijital Signage, Allync+',
      description: 'Allync — işletmeler için uçtan uca AI iş ekosistemi: Allync Hub omnichannel iletişim (WhatsApp/Instagram/Messenger), Dijital Signage ve Allync+ iş yönetim platformu. Akıllı İşin Yeni Dili.',
    },
    en: {
      title: 'Allync — AI Business Ecosystem | WhatsApp AI, Digital Signage, Allync+',
      description: 'Allync — the end-to-end AI business ecosystem: Allync Hub omnichannel communication (WhatsApp/Instagram/Messenger), Digital Signage, and the Allync+ business management platform. The New Language of Smart Business.',
    },
  },
  '/ai': {
    tr: {
      title: 'AI Çözümleri | Yapay Zeka Otomasyonu - Allync',
      description: 'Allync Hub ile omnichannel müşteri iletişimi (WhatsApp, Instagram, Messenger) + Text-to-Video, Voice AI ve özel yapay zeka çözümleri. İşletmenizi AI ile dönüştürün.',
    },
    en: {
      title: 'AI Solutions | Artificial Intelligence Automation - Allync',
      description: 'Omnichannel customer communication with Allync Hub (WhatsApp, Instagram, Messenger) + Text-to-Video, Voice AI and custom AI solutions. Transform your business with AI.',
    },
  },
  '/ai/whatsapp': {
    tr: {
      title: 'WhatsApp AI Asistanı | 7/24 Müşteri Hizmeti - Allync',
      description: 'WhatsApp Business API ile entegre AI asistanı. 7/24 otomatik müşteri hizmeti, randevu, sipariş yönetimi. 48 saatte kurulum.',
    },
    en: {
      title: 'WhatsApp AI Assistant | 24/7 Customer Service - Allync',
      description: 'AI assistant integrated with WhatsApp Business API. 24/7 automated customer service, appointments, order management. 48-hour setup.',
    },
  },
  '/ai/instagram': {
    tr: {
      title: 'Instagram AI Otomasyonu | DM & Yorum Otomasyonu - Allync',
      description: 'Instagram DM\'leri, hikaye mention\'ları ve yorumları AI ile otomatik yanıtlayın. Instagram üzerinden lead generation.',
    },
    en: {
      title: 'Instagram AI Automation | DM & Comment Automation - Allync',
      description: 'Auto-respond Instagram DMs, story mentions and comments with AI. Generate leads directly through Instagram.',
    },
  },
  '/ai/text-to-video': {
    tr: {
      title: 'Text-to-Video AI | Metinden Video Üretimi - Allync',
      description: 'AI ile metinden otomatik video üretimi. Pazarlama videoları, sosyal medya içerikleri, ürün demoları saniyeler içinde.',
    },
    en: {
      title: 'Text-to-Video AI | Generate Videos from Text - Allync',
      description: 'AI-powered video generation from text prompts. Marketing videos, social media content, product demos in seconds.',
    },
  },
  '/ai/text-to-image': {
    tr: {
      title: 'Text-to-Image AI | Metinden Görsel Üretimi - Allync',
      description: 'AI ile metinden özel görseller üretin. Pazarlama görselleri, ürün mockup\'ları, sosyal medya grafiklerini saniyeler içinde oluşturun.',
    },
    en: {
      title: 'Text-to-Image AI | Generate Images from Text - Allync',
      description: 'Create custom images from text with AI. Marketing visuals, product mockups, social media graphics in seconds.',
    },
  },
  '/ai/voice-cloning': {
    tr: {
      title: 'Voice AI & Ses Klonlama | Sesli Asistan - Allync',
      description: 'Gelişmiş ses sentezi ve ses klonlama teknolojisi. Marka sesi dijitalleştirme, otomatik sesli yanıt sistemleri, IVR çözümleri.',
    },
    en: {
      title: 'Voice AI & Cloning | Voice Assistant - Allync',
      description: 'Advanced voice synthesis and cloning technology. Brand voice digitization, automated voice response, IVR systems.',
    },
  },
  '/ai/document-ai': {
    tr: {
      title: 'Document AI | Belge İşleme & Analiz - Allync',
      description: 'PDF, Word, Excel belgelerinden otomatik veri çıkarma. Fatura işleme, sözleşme analizi, doküman sınıflandırma.',
    },
    en: {
      title: 'Document AI | Document Processing & Analysis - Allync',
      description: 'Automatic data extraction from PDF, Word, Excel. Invoice processing, contract analysis, document classification.',
    },
  },
  '/ai/image-to-video': {
    tr: {
      title: 'Image-to-Video AI | Görselden Video - Allync',
      description: 'Statik görselleri AI ile dinamik videolara dönüştürün. Ürün animasyonları, sosyal medya içerikleri, pazarlama materyalleri.',
    },
    en: {
      title: 'Image-to-Video AI | Convert Images to Videos - Allync',
      description: 'Transform static images into dynamic videos with AI. Product animations, social media content, marketing materials.',
    },
  },
  '/ai/video-to-video': {
    tr: {
      title: 'Video-to-Video AI | Video Dönüştürme - Allync',
      description: 'Gelişmiş video dönüşüm ve düzenleme. Stil transferi, video iyileştirme, toplu işleme.',
    },
    en: {
      title: 'Video-to-Video AI | Video Transformation - Allync',
      description: 'Advanced video transformation and editing. Style transfer, video enhancement, batch processing.',
    },
  },
  '/ai/data-analysis': {
    tr: {
      title: 'Data Analysis AI | Veri Analizi & BI - Allync',
      description: 'AI destekli iş zekası ve analitik. Satış tahmini, müşteri davranış analizi, trend tespiti, otomatik raporlama.',
    },
    en: {
      title: 'Data Analysis AI | Business Intelligence - Allync',
      description: 'AI-powered business intelligence and analytics. Sales forecasting, customer behavior analysis, trend detection, automated reporting.',
    },
  },
  '/ai/custom-ai': {
    tr: {
      title: 'Custom AI | Özel AI Çözümleri - Allync',
      description: 'İşletmenize özel yapay zeka çözümleri. Sektöre özel eğitilmiş modeller, CRM entegrasyonu, otomatik lead generation.',
    },
    en: {
      title: 'Custom AI | Tailored AI Solutions - Allync',
      description: 'Custom-trained AI solutions for your business. Industry-specific models, CRM integration, automated lead generation.',
    },
  },
  '/ai/contact': {
    tr: {
      title: 'AI Çözümleri İletişim | Ücretsiz Danışmanlık - Allync',
      description: 'AI çözümleri için ücretsiz danışmanlık alın. WhatsApp AI, Instagram AI ve özel yapay zeka projeleri için iletişime geçin.',
    },
    en: {
      title: 'AI Solutions Contact | Free Consultation - Allync',
      description: 'Get free consultation for AI solutions. Contact us for WhatsApp AI, Instagram AI and custom AI projects.',
    },
  },
  '/digital': {
    tr: {
      title: 'Dijital Çözümler | Web, Mobil, SaaS - Allync',
      description: 'Kurumsal web geliştirme, mobil uygulama, özel SaaS panelleri, e-ticaret, IoT ve bulut hizmetleri. Ayrıca Allync Dijital Signage akıllı ekran platformu ve Allync+ iş yönetim platformu.',
    },
    en: {
      title: 'Digital Solutions | Web, Mobile, SaaS - Allync',
      description: 'Corporate web development, mobile apps, custom SaaS panels, e-commerce, IoT and cloud services. Plus Allync Digital Signage and the Allync+ business management platform.',
    },
  },
  '/digital/saas-panels': {
    tr: {
      title: 'Özel SaaS Panelleri | Yönetim Dashboard - Allync',
      description: 'İşletmenize özel yönetim panelleri ve bulut tabanlı yazılım çözümleri. Rol tabanlı erişim, API entegrasyonu, real-time veri.',
    },
    en: {
      title: 'Custom SaaS Panels | Management Dashboards - Allync',
      description: 'Custom management panels and cloud-based software solutions. Role-based access, API integrations, real-time data sync.',
    },
  },
  '/digital/ecommerce': {
    tr: {
      title: 'E-ticaret Çözümleri | Online Satış Platformu - Allync',
      description: 'Online satış platformları ve mağaza kurulumu. iyzico, PayTR, Stripe ödeme entegrasyonu, stok yönetimi, kargo entegrasyonu.',
    },
    en: {
      title: 'E-commerce Solutions | Online Sales Platform - Allync',
      description: 'Online sales platforms and store setup. Payment integrations (iyzico, PayTR, Stripe), inventory management, shipping.',
    },
  },
  '/digital/corporate': {
    tr: {
      title: 'Kurumsal Web Sitesi Geliştirme - Allync',
      description: 'Modern, hızlı ve SEO uyumlu kurumsal web siteleri. React, Next.js teknolojileri, responsive tasarım, CMS entegrasyonu.',
    },
    en: {
      title: 'Corporate Website Development - Allync',
      description: 'Modern, fast, SEO-optimized corporate websites. React, Next.js technologies, responsive design, CMS integration.',
    },
  },
  '/digital/mobile-app': {
    tr: {
      title: 'Mobil Uygulama Geliştirme | iOS & Android - Allync',
      description: 'iOS ve Android native ve cross-platform uygulamalar. React Native, Flutter. App Store & Google Play yayın.',
    },
    en: {
      title: 'Mobile App Development | iOS & Android - Allync',
      description: 'iOS and Android native and cross-platform applications. React Native, Flutter. App Store & Google Play publishing.',
    },
  },
  '/digital/digital-marketing': {
    tr: {
      title: 'Dijital Pazarlama | SEO, Google Ads - Allync',
      description: 'SEO, Google Ads ve sosyal medya reklamcılığı. İçerik pazarlama, e-posta pazarlama, dönüşüm optimizasyonu.',
    },
    en: {
      title: 'Digital Marketing | SEO, Google Ads - Allync',
      description: 'SEO, Google Ads, and social media advertising. Content marketing, email marketing, conversion optimization.',
    },
  },
  '/digital/iot': {
    tr: {
      title: 'IoT Çözümleri | Nesnelerin İnterneti - Allync',
      description: 'IoT entegrasyonu ve akıllı cihaz yönetimi. Sensör veri toplama, endüstriyel IoT, akıllı bina çözümleri.',
    },
    en: {
      title: 'IoT Solutions | Internet of Things - Allync',
      description: 'IoT integration and smart device management. Sensor data collection, industrial IoT, smart building solutions.',
    },
  },
  '/digital/cloud': {
    tr: {
      title: 'Bulut Çözümleri | AWS, Google Cloud, Azure - Allync',
      description: 'AWS, Google Cloud ve Azure altyapı hizmetleri. Sunucu kurulumu, yedekleme ve güvenlik, bulut göçü.',
    },
    en: {
      title: 'Cloud Solutions | AWS, Google Cloud, Azure - Allync',
      description: 'AWS, Google Cloud, and Azure infrastructure services. Server setup, backup and security, cloud migration.',
    },
  },
  '/digital/maintenance': {
    tr: {
      title: 'Bakım & Destek | Teknik Destek 7/24 - Allync',
      description: 'Sürekli bakım ve teknik destek. Proaktif sistem izleme, düzenli güvenlik güncellemeleri, 7/24 teknik destek.',
    },
    en: {
      title: 'Maintenance & Support | 24/7 Technical Support - Allync',
      description: 'Ongoing maintenance and technical support. Proactive system monitoring, regular security updates, 24/7 technical support.',
    },
  },
  '/digital/contact': {
    tr: {
      title: 'Dijital Çözümler İletişim | Ücretsiz Teklif - Allync',
      description: 'Dijital çözümler için ücretsiz teklif alın. Web, mobil, SaaS ve e-ticaret projeleri için bizimle iletişime geçin.',
    },
    en: {
      title: 'Digital Solutions Contact | Free Quote - Allync',
      description: 'Get a free quote for digital solutions. Contact us for web, mobile, SaaS and e-commerce projects.',
    },
  },
  '/privacy': {
    tr: {
      title: 'Gizlilik Politikası | KVKK & GDPR Uyumlu - Allync',
      description: 'Allync gizlilik politikası. Kişisel verilerinizin nasıl toplandığı, işlendiği ve korunduğu hakkında kapsamlı bilgi. KVKK, GDPR ve Katar PDPPL uyumlu.',
    },
    en: {
      title: 'Privacy Policy | GDPR & KVKK Compliant - Allync',
      description: 'Allync privacy policy. Comprehensive information about how your personal data is collected, processed and protected. GDPR, KVKK and Qatar PDPPL compliant.',
    },
  },
  '/terms': {
    tr: {
      title: 'Hizmet Şartları | Kullanım Koşulları ve Sorumluluklar - Allync',
      description: 'Allync hizmet şartları. Allyncai platformunun kullanım koşulları, kullanıcı sorumlulukları, iade politikası, sorumluluk sınırlaması ve hukuki çerçeve.',
    },
    en: {
      title: 'Terms of Service | Usage Terms & Responsibilities - Allync',
      description: 'Allync terms of service. Comprehensive usage terms, user responsibilities, no-refund policy, liability limitations and legal framework for the Allyncai platform.',
    },
  },
};

export const HelmetManager: React.FC<HelmetManagerProps> = ({ language, activeSection = 'hero' }) => {
  const location = useLocation();

  // Generate canonical URL based on current path
  const getCanonicalUrl = () => {
    const baseUrl = 'https://www.allyncai.com';
    const path = location.pathname;
    // Remove trailing slash except for root
    const cleanPath = path === '/' ? '' : path.replace(/\/$/, '');
    return `${baseUrl}${cleanPath}`;
  };

  // Get route-specific metadata (prevents duplicate content across routes)
  const getRouteMeta = () => {
    const path = location.pathname;

    // Exact match first
    if (ROUTE_META[path]) {
      return ROUTE_META[path][language];
    }

    // Match base route (e.g., /ai/whatsapp/something falls back to /ai/whatsapp)
    const pathSegments = path.split('/').filter(Boolean);
    while (pathSegments.length > 0) {
      const testPath = '/' + pathSegments.join('/');
      if (ROUTE_META[testPath]) {
        return ROUTE_META[testPath][language];
      }
      pathSegments.pop();
    }

    // Default to homepage meta
    return ROUTE_META['/'][language];
  };

  // Legacy: section-based title override for homepage scroll sections
  const getSectionTitle = () => {
    const path = location.pathname;
    const routeMeta = getRouteMeta();

    // Only apply section-based titles on homepage
    if (path !== '/' || !activeSection || activeSection === 'hero') {
      return routeMeta.title;
    }

    const sectionTitles: Record<string, Record<string, string>> = {
      tr: {
        features: 'Özellikler | Allync',
        pricing: 'Fiyatlandırma | Allync',
        contact: 'İletişim | Allync',
        packages: 'Paketler | Allync',
        'chat-demo': 'Demo | Allync',
        'industry-examples': 'Sektörler | Allync',
      },
      en: {
        features: 'Features | Allync',
        pricing: 'Pricing | Allync',
        contact: 'Contact | Allync',
        packages: 'Packages | Allync',
        'chat-demo': 'Demo | Allync',
        'industry-examples': 'Industries | Allync',
      },
    };

    return sectionTitles[language][activeSection] || routeMeta.title;
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
    } else if (path === '/contact' || path === '/privacy') {
      return `${baseUrl}${OG_IMAGES.contact}`;
    }

    return `${baseUrl}${OG_IMAGES.default}`;
  };

  const routeMeta = getRouteMeta();
  const title = getSectionTitle();
  const description = routeMeta.description;
  const canonical = getCanonicalUrl();
  const ogImage = getOgImage();

  return (
    <Helmet>
      <html lang={language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={language === 'tr' ? 'tr_TR' : 'en_US'} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1024" />
      <meta property="og:image:height" content="1024" />
      <meta property="og:image:alt" content="Allync Logo" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="Allync Logo" />
    </Helmet>
  );
};
