import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface LegalModalsProps {
  language: 'tr' | 'en';
}

export const LegalModals: React.FC<LegalModalsProps> = ({ language }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };

    if (activeModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [activeModal]);

  const openModal = (modalType: string) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const privacyContent = language === 'tr' ? {
    title: 'Gizlilik Politikası',
    lastUpdated: 'Son Güncelleme: 15 Ocak 2026',
    content: [
      {
        heading: '1. Veri Sorumlusu',
        text: 'Bu gizlilik politikası, Allync AI hizmetleri kapsamında toplanan kişisel verilerin işlenmesi hakkında bilgi vermektedir. Veri sorumlusu olarak Allync, kişisel verilerinizin korunması konusunda azami özen göstermektedir.'
      },
      {
        heading: '2. Toplanan Kişisel Veriler',
        text: 'Hizmetlerimizi kullanırken aşağıdaki kişisel verileriniz toplanabilir: Ad-soyad, e-posta adresi, telefon numarası, işletme bilgileri, WhatsApp mesaj içerikleri, IP adresi ve cihaz bilgileri.'
      },
      {
        heading: '3. Veri Toplama Amaçları',
        text: 'Kişisel verileriniz; AI asistan hizmetinin sağlanması, müşteri desteği, hizmet geliştirme, yasal yükümlülüklerin yerine getirilmesi ve istatistiksel analiz amaçlarıyla işlenmektedir.'
      },
      {
        heading: '4. WhatsApp Business API Entegrasyonu',
        text: 'Hizmetimiz WhatsApp Business API kullanmaktadır. WhatsApp ile paylaşılan veriler, WhatsApp\'ın kendi gizlilik politikasına tabidir. Mesaj içerikleri şifrelenmiş olarak saklanır ve sadece hizmet sağlama amacıyla kullanılır.'
      },
      {
        heading: '5. Çerez Kullanımı',
        text: 'Web sitemizde kullanıcı deneyimini iyileştirmek için çerezler kullanılmaktadır. Zorunlu çerezler hizmetin çalışması için gereklidir. Analitik çerezler ise performans takibi için kullanılır ve reddedilebilir.'
      },
      {
        heading: '6. Veri Saklama Süreleri',
        text: 'Kişisel verileriniz, hizmet sözleşmesi süresince ve yasal saklama yükümlülükleri gereği en fazla 10 yıl süreyle saklanır. Hizmet sonlandırıldığında veriler güvenli şekilde silinir.'
      },
      {
        heading: '7. Veri Güvenliği',
        text: 'Verileriniz ISO 27001 standartlarında, end-to-end şifreleme ile korunmaktadır. Düzenli güvenlik denetimleri yapılır ve yetkisiz erişime karşı teknik ve idari önlemler alınır.'
      },
      {
        heading: '8. Kullanıcı Hakları',
        text: 'KVKK kapsamında verilerinize erişim, düzeltme, silme, işlemeyi durdurma ve veri taşınabilirliği haklarınız bulunmaktadır. Bu haklarınızı kullanmak için info@allyncai.com adresine başvurabilirsiniz.'
      },
      {
        heading: '9. İletişim',
        text: 'Gizlilik politikası ile ilgili sorularınız için: E-posta: info@allyncai.com | Telefon: +974 5107 9565 / +90 536 247 7824'
      }
    ]
  } : {
    title: 'Privacy Policy',
    lastUpdated: 'Last Updated: January 15, 2026',
    content: [
      {
        heading: '1. Data Controller',
        text: 'This privacy policy provides information about the processing of personal data collected within the scope of Allync AI services. As the data controller, Allync takes utmost care in protecting your personal data.'
      },
      {
        heading: '2. Personal Data Collected',
        text: 'When using our services, the following personal data may be collected: Name-surname, email address, phone number, business information, WhatsApp message contents, IP address and device information.'
      },
      {
        heading: '3. Data Collection Purposes',
        text: 'Your personal data is processed for: providing AI assistant service, customer support, service improvement, fulfilling legal obligations, and statistical analysis purposes.'
      },
      {
        heading: '4. WhatsApp Business API Integration',
        text: 'Our service uses WhatsApp Business API. Data shared with WhatsApp is subject to WhatsApp\'s own privacy policy. Message contents are stored encrypted and used only for service provision.'
      },
      {
        heading: '5. Cookie Usage',
        text: 'Cookies are used on our website to improve user experience. Essential cookies are necessary for service operation. Analytics cookies are used for performance tracking and can be declined.'
      },
      {
        heading: '6. Data Retention Periods',
        text: 'Your personal data is stored during the service contract period and for a maximum of 10 years as required by legal retention obligations. Data is securely deleted when service is terminated.'
      },
      {
        heading: '7. Data Security',
        text: 'Your data is protected with ISO 27001 standards and end-to-end encryption. Regular security audits are conducted and technical and administrative measures are taken against unauthorized access.'
      },
      {
        heading: '8. User Rights',
        text: 'Under GDPR, you have rights to access, correct, delete, stop processing and data portability of your data. You can contact info@allyncai.com to exercise these rights.'
      },
      {
        heading: '9. Contact',
        text: 'For questions about privacy policy: Email: info@allyncai.com | Phone: +974 5107 9565 / +90 536 247 7824'
      }
    ]
  };

  const termsContent = language === 'tr' ? {
    title: 'Hizmet Şartları',
    lastUpdated: 'Son Güncelleme: 15 Ocak 2026',
    content: [
      {
        heading: '1. Hizmet Kapsamı',
        text: 'Allync, WhatsApp üzerinden çalışan yapay zeka destekli müşteri hizmetleri asistanı sağlamaktadır. Hizmet kapsamında 7/24 müşteri desteği, randevu yönetimi, veri analizi ve raporlama bulunmaktadır.'
      },
      {
        heading: '2. Kullanım Koşulları',
        text: 'Hizmeti yasal amaçlar için kullanmalısınız. Spam, zararlı içerik veya yanıltıcı bilgi paylaşımı yasaktır. Sistem kaynaklarını aşırı kullanmak veya güvenlik açığı aramak yasaktır.'
      },
      {
        heading: '3. Fikri Mülkiyet Hakları',
        text: 'Allync AI teknolojisi, yazılım kodları, algoritmalar ve marka unsurları Allync\'in fikri mülkiyetidir. İzinsiz kopyalama, dağıtım veya ters mühendislik yasaktır.'
      },
      {
        heading: '4. Hizmet Seviyesi Garantisi',
        text: '%99.9 çalışma süresi garantisi sunulmaktadır. Planlı bakım çalışmaları önceden bildirilir. Hizmet kesintilerinde telafi mekanizmaları uygulanır.'
      },
      {
        heading: '5. Sorumluluk Sınırları',
        text: 'Allync, hizmet kesintilerinden kaynaklanan dolaylı zararlardan sorumlu değildir. Maksimum sorumluluk tutarı ödenen hizmet bedeliyle sınırlıdır. Üçüncü taraf entegrasyonlarından kaynaklanan sorunlar kapsam dışındadır.'
      },
      {
        heading: '6. Ödeme Koşulları',
        text: 'Hizmet bedeli tek seferlik ödeme veya anlaşılan taksitlerle tahsil edilir. Gecikme durumunda yasal faiz uygulanır. İade koşulları ayrı sözleşmede belirtilir.'
      },
      {
        heading: '7. Sözleşme Feshi',
        text: 'Taraflar 30 gün önceden bildirimle sözleşmeyi feshedebilir. Önemli sebep durumunda derhal fesih mümkündür. Fesih sonrası veri silme işlemleri 90 gün içinde tamamlanır.'
      },
      {
        heading: '8. Değişiklik Hakkı',
        text: 'Allync bu şartları değiştirme hakkını saklı tutar. Önemli değişiklikler 30 gün önceden bildirilir. Devam eden kullanım değişikliklerin kabulü anlamına gelir.'
      },
      {
        heading: '9. Uygulanacak Hukuk',
        text: 'Bu sözleşme Türk Hukuku\'na tabidir. Uyuşmazlıklar İstanbul mahkemelerinde çözülür. Alternatif uyuşmazlık çözüm yolları da kullanılabilir.'
      }
    ]
  } : {
    title: 'Terms of Service',
    lastUpdated: 'Last Updated: January 15, 2026',
    content: [
      {
        heading: '1. Service Scope',
        text: 'Allync provides AI-powered customer service assistant operating through WhatsApp. Service includes 24/7 customer support, appointment management, data analysis and reporting.'
      },
      {
        heading: '2. Usage Conditions',
        text: 'You must use the service for legal purposes. Spam, harmful content or misleading information sharing is prohibited. Excessive use of system resources or security vulnerability research is prohibited.'
      },
      {
        heading: '3. Intellectual Property Rights',
        text: 'Allync AI technology, software codes, algorithms and brand elements are Allync\'s intellectual property. Unauthorized copying, distribution or reverse engineering is prohibited.'
      },
      {
        heading: '4. Service Level Guarantee',
        text: '99.9% uptime guarantee is provided. Planned maintenance work is notified in advance. Compensation mechanisms are applied during service interruptions.'
      },
      {
        heading: '5. Liability Limitations',
        text: 'Allync is not responsible for indirect damages caused by service interruptions. Maximum liability amount is limited to the service fee paid. Issues from third-party integrations are out of scope.'
      },
      {
        heading: '6. Payment Terms',
        text: 'Service fee is collected as one-time payment or agreed installments. Legal interest applies in case of delay. Refund conditions are specified in separate contract.'
      },
      {
        heading: '7. Contract Termination',
        text: 'Parties can terminate the contract with 30 days notice. Immediate termination is possible in case of important reason. Data deletion processes are completed within 90 days after termination.'
      },
      {
        heading: '8. Right to Change',
        text: 'Allync reserves the right to change these terms. Important changes are notified 30 days in advance. Continued use means acceptance of changes.'
      },
      {
        heading: '9. Applicable Law',
        text: 'This contract is subject to Turkish Law. Disputes are resolved in Istanbul courts. Alternative dispute resolution methods can also be used.'
      }
    ]
  };

  const cookieContent = language === 'tr' ? {
    title: 'Çerez Politikası',
    lastUpdated: 'Son Güncelleme: 15 Ocak 2026',
    content: [
      {
        heading: '1. Çerez Nedir?',
        text: 'Çerezler, web sitesini ziyaret ettiğinizde cihazınızda saklanan küçük metin dosyalarıdır. Bu dosyalar web sitesinin daha iyi çalışmasını ve kullanıcı deneyiminin iyileştirilmesini sağlar.'
      },
      {
        heading: '2. Zorunlu Çerezler',
        text: 'Web sitesinin temel işlevlerinin çalışması için gerekli çerezlerdir. Güvenlik, oturum yönetimi ve temel site işlevselliği için kullanılır. Bu çerezler reddedilemez.'
      },
      {
        heading: '3. Analitik Çerezler',
        text: 'Site performansını ölçmek ve kullanıcı davranışlarını anlamak için kullanılır. Google Analytics ve benzeri araçlarla toplanan veriler anonim hale getirilir. Bu çerezler reddedilebilir.'
      },
      {
        heading: '4. İşlevsel Çerezler',
        text: 'Kullanıcı tercihlerini hatırlamak ve kişiselleştirilmiş deneyim sunmak için kullanılır. Dil seçimi, tema tercihleri ve form verileri bu kapsamdadır.'
      },
      {
        heading: '5. Pazarlama Çerezi',
        text: 'Şu anda pazarlama çerezi kullanılmamaktadır. Gelecekte kullanılması durumunda açık rıza alınacaktır.'
      },
      {
        heading: '6. Çerez Yönetimi',
        text: 'Tarayıcı ayarlarından çerezleri yönetebilir, silebilir veya engelleyebilirsiniz. Ancak zorunlu çerezlerin engellenmesi site işlevselliğini etkileyebilir.'
      },
      {
        heading: '7. Üçüncü Taraf Çerezleri',
        text: 'WhatsApp Business API, Google Analytics gibi üçüncü taraf hizmetler kendi çerezlerini kullanabilir. Bu çerezler ilgili şirketlerin politikalarına tabidir.'
      },
      {
        heading: '8. Çerez Saklama Süreleri',
        text: 'Oturum çerezleri tarayıcı kapatıldığında silinir. Kalıcı çerezler 1 ay ile 2 yıl arasında saklanır. Analitik çerezler maksimum 26 ay saklanır.'
      },
      {
        heading: '9. İletişim',
        text: 'Çerez politikası hakkında sorularınız için: info@allyncai.com | Telefon: +974 5107 9565 / +90 536 247 7824'
      }
    ]
  } : {
    title: 'Cookie Policy',
    lastUpdated: 'Last Updated: January 15, 2026',
    content: [
      {
        heading: '1. What are Cookies?',
        text: 'Cookies are small text files stored on your device when you visit a website. These files help the website work better and improve user experience.'
      },
      {
        heading: '2. Essential Cookies',
        text: 'Cookies necessary for basic website functions to work. Used for security, session management and basic site functionality. These cookies cannot be declined.'
      },
      {
        heading: '3. Analytics Cookies',
        text: 'Used to measure site performance and understand user behavior. Data collected with Google Analytics and similar tools is anonymized. These cookies can be declined.'
      },
      {
        heading: '4. Functional Cookies',
        text: 'Used to remember user preferences and provide personalized experience. Language selection, theme preferences and form data are in this scope.'
      },
      {
        heading: '5. Marketing Cookies',
        text: 'Currently no marketing cookies are used. If used in the future, explicit consent will be obtained.'
      },
      {
        heading: '6. Cookie Management',
        text: 'You can manage, delete or block cookies from browser settings. However, blocking essential cookies may affect site functionality.'
      },
      {
        heading: '7. Third Party Cookies',
        text: 'Third party services like WhatsApp Business API, Google Analytics may use their own cookies. These cookies are subject to respective companies\' policies.'
      },
      {
        heading: '8. Cookie Storage Periods',
        text: 'Session cookies are deleted when browser is closed. Persistent cookies are stored between 1 month to 2 years. Analytics cookies are stored maximum 26 months.'
      },
      {
        heading: '9. Contact',
        text: 'For questions about cookie policy: info@allyncai.com | Phone: +974 5107 9565 / +90 536 247 7824'
      }
    ]
  };

  const renderModal = (content: any) => (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 legal-modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div className="legal-modal-container">
        <div className="legal-modal-header">
          <h2 className="text-2xl font-bold text-white">{content.title}</h2>
          <button
            onClick={closeModal}
            className="legal-modal-close"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="legal-modal-content">
          <p className="text-sm text-gray-400 mb-6">{content.lastUpdated}</p>
          
          {content.content.map((section: any, index: number) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">{section.heading}</h3>
              <p className="text-gray-300 leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="legal-links">
        <button
          onClick={() => openModal('privacy')}
          className="legal-link"
        >
          {language === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}
        </button>
        <button
          onClick={() => openModal('terms')}
          className="legal-link"
        >
          {language === 'tr' ? 'Hizmet Şartları' : 'Terms of Service'}
        </button>
        <button
          onClick={() => openModal('cookies')}
          className="legal-link"
        >
          {language === 'tr' ? 'Çerez Politikası' : 'Cookie Policy'}
        </button>
      </div>

      {activeModal === 'privacy' && renderModal(privacyContent)}
      {activeModal === 'terms' && renderModal(termsContent)}
      {activeModal === 'cookies' && renderModal(cookieContent)}
    </>
  );
};