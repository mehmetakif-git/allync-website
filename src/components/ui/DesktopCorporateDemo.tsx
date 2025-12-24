import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './DesktopCorporateDemo.css';

// Assets
import closeIcon from '../../assets/demo-icons/Close_Cross_Circle.svg';
import callIcon from '../../assets/demo-icons/Call_Fill.svg';
import networkIcon from '../../assets/demo-icons/Network.svg';
import sunIcon from '../../assets/demo-icons/Sun_1_Fill.svg';
import musicIcon from '../../assets/demo-icons/music.svg';
import albumCover from '../../assets/demo-icons/The_Weeknd_-_Blinding_Lights.png';
import blindingLightsAudio from '../../assets/demo-icons/The Weeknd - Blinding Lights.mp3';
import allyncLogo from '../../assets/logo.svg';
import { getTeamImage } from '../../assets/corporate-demo';

// Icons
import {
  X,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Send,
  Users,
  Target,
  Award,
  TrendingUp,
  Check,
  Linkedin,
  Twitter
} from 'lucide-react';

interface DesktopCorporateDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

type DemoView = 'home' | 'about' | 'services' | 'contact';

const uiText = {
  tr: {
    tooltip: "Demo'yu Baslat!",
    weather: 'Hava Durumu',
    music: 'Muzik',
    playNow: 'Simdi Cal',
    nowPlaying: 'Simdi Caliyor',
    exit: 'Cikis',
    contact: 'Iletisim',
    home: 'Ana Sayfa',
    about: 'Hakkimizda',
    services: 'Hizmetler',
    heroSince: "2009'dan beri hizmetinizdeyiz",
    heroTitle: 'Isletmenizi Gelecege Tasiyoruz',
    heroDesc: 'Kurumsal cozumler ve dijital donusum hizmetleri ile isletmenizi bir adim one tasiyoruz.',
    contactUs: 'Bize Ulasin',
    ourServices: 'Hizmetlerimiz',
    aboutTitle: 'Hakkimizda',
    aboutDesc: '2009 yilindan bu yana isletmelere kurumsal cozumler sunuyoruz. Deneyimli ekibimiz ve yenilikci yaklasimimizla musterilerimizin basarisina katki sagliyoruz.',
    mission: 'Misyonumuz',
    missionText: 'Isletmelerin dijital donusumune onculuk ederek surdurulebilir buyume saglamak.',
    vision: 'Vizyonumuz',
    visionText: "Turkiye'nin lider kurumsal danismanlik firmasi olmak.",
    leadershipTeam: 'Yonetim Ekibi',
    ourValues: 'Degerlerimiz',
    values: ['Musteri Odaklilik', 'Yenilkcilik', 'Guvenilirlik', 'Seffaflik'],
    servicesTitle: 'Hizmetlerimiz',
    servicesDesc: 'Isletmenizin ihtiyaclarina ozel kapsamli cozumler sunuyoruz.',
    learnMore: 'Detayli Bilgi',
    getQuote: 'Size Ozel Teklif Alin',
    getQuoteDesc: 'Ihtiyaclariniza uygun fiyatlandirma icin bizimle iletisime gecin.',
    contactTitle: 'Iletisim',
    contactDesc: 'Sorulariniz icin bize ulasin, en kisa surede donus yapalim.',
    sendMessage: 'Mesaj Gonderin',
    fullName: 'Adiniz Soyadiniz',
    subject: 'Konu',
    message: 'Mesajiniz...',
    send: 'Gonder',
    messageReceived: 'Mesajiniz Alindi!',
    messageReceivedDesc: 'En kisa surede size donus yapacagiz.',
    backToHome: 'Ana Sayfaya Don',
    wantRealSite: 'Gercek Web Sitesi Ister misiniz?',
    ctaTitle: 'Projenizi Birlikte Hayata Gecirelim',
    ctaDesc: 'Ucretsiz danismanlik icin hemen iletisime gecin',
    ctaBtn: 'Ucretsiz Teklif Alin'
  },
  en: {
    tooltip: 'Start Demo!',
    weather: 'Weather',
    music: 'Music',
    playNow: 'Play Now',
    nowPlaying: 'Now Playing',
    exit: 'Exit',
    contact: 'Contact',
    home: 'Home',
    about: 'About',
    services: 'Services',
    heroSince: 'Serving since 2009',
    heroTitle: 'Taking Your Business to the Future',
    heroDesc: 'We take your business one step ahead with corporate solutions and digital transformation services.',
    contactUs: 'Contact Us',
    ourServices: 'Our Services',
    aboutTitle: 'About Us',
    aboutDesc: 'Since 2009, we have been providing corporate solutions to businesses. With our experienced team and innovative approach, we contribute to our customers\' success.',
    mission: 'Our Mission',
    missionText: 'To lead the digital transformation of businesses and ensure sustainable growth.',
    vision: 'Our Vision',
    visionText: 'To become the leading corporate consulting firm in Turkey.',
    leadershipTeam: 'Leadership Team',
    ourValues: 'Our Values',
    values: ['Customer Focus', 'Innovation', 'Reliability', 'Transparency'],
    servicesTitle: 'Our Services',
    servicesDesc: 'We offer comprehensive solutions tailored to your business needs.',
    learnMore: 'Learn More',
    getQuote: 'Get Custom Quote',
    getQuoteDesc: 'Contact us for pricing tailored to your needs.',
    contactTitle: 'Contact',
    contactDesc: 'Reach out to us with your questions, we\'ll get back to you shortly.',
    sendMessage: 'Send Message',
    fullName: 'Full Name',
    subject: 'Subject',
    message: 'Your message...',
    send: 'Send',
    messageReceived: 'Message Received!',
    messageReceivedDesc: 'We\'ll get back to you as soon as possible.',
    backToHome: 'Back to Home',
    wantRealSite: 'Want a Real Website?',
    ctaTitle: 'Let\'s Bring Your Project to Life',
    ctaDesc: 'Contact us now for free consultation',
    ctaBtn: 'Get Free Quote'
  }
};

// Services data
const services = {
  tr: [
    { icon: Target, title: 'Strateji Danismanligi', desc: 'Isletmeniz icin ozel stratejiler' },
    { icon: TrendingUp, title: 'Buyume Yonetimi', desc: 'Surdurulebilir buyume planlari' },
    { icon: Users, title: 'IK Cozumleri', desc: 'Yetenek yonetimi ve gelisim' },
    { icon: Award, title: 'Kalite Guvence', desc: 'ISO standartlari ve sertifikasyon' },
  ],
  en: [
    { icon: Target, title: 'Strategy Consulting', desc: 'Custom strategies for your business' },
    { icon: TrendingUp, title: 'Growth Management', desc: 'Sustainable growth plans' },
    { icon: Users, title: 'HR Solutions', desc: 'Talent management and development' },
    { icon: Award, title: 'Quality Assurance', desc: 'ISO standards and certification' },
  ]
};

// Team members
const team = {
  tr: [
    { name: 'Ahmet Yilmaz', role: 'CEO & Kurucu', color: 'from-blue-500 to-cyan-500', imageId: 'team-1' },
    { name: 'Elif Demir', role: 'CFO', color: 'from-purple-500 to-pink-500', imageId: 'team-2' },
    { name: 'Mehmet Kaya', role: 'CTO', color: 'from-green-500 to-emerald-500', imageId: 'team-3' },
  ],
  en: [
    { name: 'Ahmet Yilmaz', role: 'CEO & Founder', color: 'from-blue-500 to-cyan-500', imageId: 'team-1' },
    { name: 'Elif Demir', role: 'CFO', color: 'from-purple-500 to-pink-500', imageId: 'team-2' },
    { name: 'Mehmet Kaya', role: 'CTO', color: 'from-green-500 to-emerald-500', imageId: 'team-3' },
  ]
};

// Stats
const stats = [
  { value: '15+', label: { tr: 'Yillik Deneyim', en: 'Years Experience' } },
  { value: '500+', label: { tr: 'Mutlu Musteri', en: 'Happy Clients' } },
  { value: '50+', label: { tr: 'Uzman Ekip', en: 'Expert Team' } },
  { value: '99%', label: { tr: 'Musteri Memnuniyeti', en: 'Client Satisfaction' } },
];

export const DesktopCorporateDemo: React.FC<DesktopCorporateDemoProps> = ({
  language,
  onClose,
  onContactClick
}) => {
  // Entry time for clock
  const [entryTime] = useState(() => new Date());
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isAppOpen, setIsAppOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Use refs to avoid re-renders and stale closures
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Dynamic Island states
  const [dynamicIslandState, setDynamicIslandState] = useState<'collapsed' | 'compact' | 'expanded'>('collapsed');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  // Corporate states
  const [view, setView] = useState<DemoView>('home');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const phoneRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const t = uiText[language];

  // Trigger entrance animation
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  // Set time and date from entry time
  useEffect(() => {
    const hours = entryTime.getHours().toString().padStart(2, '0');
    const minutes = entryTime.getMinutes().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}`);

    const days = language === 'tr'
      ? ['Pazar', 'Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi']
      : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = language === 'tr'
      ? ['Ocak', 'Subat', 'Mart', 'Nisan', 'Mayis', 'Haziran', 'Temmuz', 'Agustos', 'Eylul', 'Ekim', 'Kasim', 'Aralik']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    setCurrentDate(`${days[entryTime.getDay()]}, ${entryTime.getDate()} ${months[entryTime.getMonth()]}`);
  }, [language, entryTime]);

  // Disable body scroll
  useEffect(() => {
    document.body.classList.add('dcd-modal-open');
    return () => {
      document.body.classList.remove('dcd-modal-open');
    };
  }, []);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(blindingLightsAudio);
    audioRef.current.loop = false;
    audioRef.current.volume = 0;

    const handleEnded = () => {
      setIsMusicPlaying(false);
      setDynamicIslandState('collapsed');
    };

    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }
    };
  }, []);

  // Handle music play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    if (isMusicPlaying) {
      audioRef.current.volume = 0;
      audioRef.current.play().catch(console.error);

      let currentVolume = 0;
      const fadeIn = setInterval(() => {
        currentVolume += 0.05;
        if (currentVolume >= volume) {
          currentVolume = volume;
          clearInterval(fadeIn);
        }
        if (audioRef.current) {
          audioRef.current.volume = currentVolume;
        }
      }, 50);

      setShowVolumeControl(true);
    } else {
      let currentVolume = audioRef.current.volume;
      const fadeOut = setInterval(() => {
        currentVolume -= 0.05;
        if (currentVolume <= 0) {
          currentVolume = 0;
          clearInterval(fadeOut);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        }
        if (audioRef.current) {
          audioRef.current.volume = currentVolume;
        }
      }, 50);

      volumeTimeoutRef.current = setTimeout(() => {
        setShowVolumeControl(false);
      }, 500);
    }
  }, [isMusicPlaying, volume]);

  // Handle Dynamic Island state changes
  useEffect(() => {
    if (isMusicPlaying) {
      if (isAppOpen) {
        setDynamicIslandState('compact');
        setShowVolumeControl(false);
      } else {
        setDynamicIslandState('expanded');
        setShowVolumeControl(true);
      }
    }
  }, [isAppOpen, isMusicPlaying]);

  // Update volume
  useEffect(() => {
    if (audioRef.current && isMusicPlaying) {
      audioRef.current.volume = volume;
    }
  }, [volume, isMusicPlaying]);

  // Mouse tracking for 3D effect
  useEffect(() => {
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!phoneRef.current || !isHoveringRef.current) return;

      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        if (!phoneRef.current || !isHoveringRef.current) return;

        const rect = phoneRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const x = (e.clientX - centerX) / (rect.width / 2);
        const y = (e.clientY - centerY) / (rect.height / 2);

        mousePositionRef.current = { x, y };

        const rotateY = x * 6;
        const rotateX = -y * 4;
        phoneRef.current.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const openApp = () => {
    setIsAppOpen(true);
  };

  const closeApp = () => {
    setIsAppOpen(false);
    setView('home');
    setFormSubmitted(false);
  };

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setIsMusicPlaying(false);
    setDynamicIslandState('collapsed');
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 400);
  };

  const handleContactNavigation = () => {
    if (isClosing) return;
    setIsClosing(true);
    setIsMusicPlaying(false);
    setDynamicIslandState('collapsed');
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
      setTimeout(() => {
        if (onContactClick) {
          onContactClick();
        }
      }, 100);
    }, 400);
  };

  const handleNavigate = (newView: DemoView) => {
    setView(newView);
    setFormSubmitted(false);
  };

  // Handle hover state changes
  useEffect(() => {
    if (!isHovering && phoneRef.current) {
      phoneRef.current.style.transform = 'rotateY(0deg) rotateX(0deg)';
    }
  }, [isHovering]);

  // Navigation Component
  const Navigation = () => (
    <nav className="dcd-nav">
      <div className="dcd-nav-logo">
        <div className="dcd-nav-logo-icon">
          <img src={allyncLogo} alt="Allync" />
        </div>
        <span className="dcd-nav-logo-text">Allync</span>
      </div>
      <div className="dcd-nav-items">
        {(['home', 'about', 'services', 'contact'] as DemoView[]).map((v) => (
          <button
            key={v}
            className={`dcd-nav-item ${view === v ? 'dcd-nav-active' : ''}`}
            onClick={() => handleNavigate(v)}
          >
            {t[v]}
          </button>
        ))}
      </div>
      <button className="dcd-nav-close" onClick={closeApp}>
        <X />
      </button>
    </nav>
  );

  // Home View
  const HomeView = () => (
    <div className="dcd-content">
      {/* Hero Section */}
      <div className="dcd-hero">
        <div className="dcd-hero-bg" />
        <div className="dcd-hero-content">
          <span className="dcd-hero-badge">{t.heroSince}</span>
          <h1 className="dcd-hero-title">{t.heroTitle}</h1>
          <p className="dcd-hero-desc">{t.heroDesc}</p>
          <div className="dcd-hero-buttons">
            <button className="dcd-btn-primary" onClick={() => handleNavigate('contact')}>
              {t.contactUs}
              <ChevronRight />
            </button>
            <button className="dcd-btn-secondary" onClick={() => handleNavigate('services')}>
              {t.ourServices}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="dcd-stats">
        {stats.map((stat, i) => (
          <div key={i} className="dcd-stat">
            <div className="dcd-stat-value">{stat.value}</div>
            <div className="dcd-stat-label">{stat.label[language]}</div>
          </div>
        ))}
      </div>

      {/* Services Preview */}
      <div className="dcd-section">
        <h2 className="dcd-section-title">{t.ourServices}</h2>
        <div className="dcd-services-grid">
          {services[language].map((service, i) => (
            <div
              key={i}
              className="dcd-service-card"
              onClick={() => handleNavigate('services')}
            >
              <service.icon className="dcd-service-icon" />
              <h3 className="dcd-service-title">{service.title}</h3>
              <p className="dcd-service-desc">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="dcd-cta">
        <h2 className="dcd-cta-title">{t.ctaTitle}</h2>
        <p className="dcd-cta-desc">{t.ctaDesc}</p>
        <button className="dcd-cta-btn" onClick={() => handleNavigate('contact')}>
          {t.ctaBtn}
        </button>
      </div>
    </div>
  );

  // About View
  const AboutView = () => (
    <div className="dcd-content">
      <div className="dcd-about-content">
        <h1 className="dcd-about-title">{t.aboutTitle}</h1>
        <p className="dcd-about-desc">{t.aboutDesc}</p>

        {/* Mission & Vision */}
        <div className="dcd-mission-vision">
          <div className="dcd-mission-card dcd-mission">
            <h3 className="dcd-mission-title">{t.mission}</h3>
            <p className="dcd-mission-text">{t.missionText}</p>
          </div>
          <div className="dcd-mission-card dcd-vision">
            <h3 className="dcd-mission-title">{t.vision}</h3>
            <p className="dcd-mission-text">{t.visionText}</p>
          </div>
        </div>

        {/* Team */}
        <h2 className="dcd-team-title">{t.leadershipTeam}</h2>
        <div className="dcd-team-grid">
          {team[language].map((member, i) => {
            const teamImage = getTeamImage(member.imageId);
            return (
              <div key={i} className="dcd-team-member">
                <div className={`dcd-team-avatar bg-gradient-to-br ${member.color}`}>
                  {teamImage ? (
                    <img src={teamImage} alt={member.name} />
                  ) : (
                    <span>{member.name.split(' ').map(n => n[0]).join('')}</span>
                  )}
                </div>
                <h3 className="dcd-team-name">{member.name}</h3>
                <p className="dcd-team-role">{member.role}</p>
              </div>
            );
          })}
        </div>

        {/* Values */}
        <h2 className="dcd-values-title">{t.ourValues}</h2>
        <div className="dcd-values-list">
          {t.values.map((value, i) => (
            <div key={i} className="dcd-value-item">
              <Check />
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Services View
  const ServicesView = () => (
    <div className="dcd-content">
      <div className="dcd-services-content">
        <h1 className="dcd-services-title">{t.servicesTitle}</h1>
        <p className="dcd-services-desc">{t.servicesDesc}</p>

        <div className="dcd-services-list">
          {services[language].map((service, i) => (
            <div key={i} className="dcd-service-item">
              <div className="dcd-service-item-icon">
                <service.icon />
              </div>
              <div className="dcd-service-item-content">
                <h3 className="dcd-service-item-title">{service.title}</h3>
                <p className="dcd-service-item-desc">{service.desc}</p>
                <button className="dcd-service-item-link" onClick={() => handleNavigate('contact')}>
                  {t.learnMore}
                  <ChevronRight />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing CTA */}
        <div className="dcd-cta" style={{ marginTop: 24, borderRadius: 16 }}>
          <h3 className="dcd-cta-title">{t.getQuote}</h3>
          <p className="dcd-cta-desc">{t.getQuoteDesc}</p>
          <button className="dcd-cta-btn" onClick={() => handleNavigate('contact')}>
            {t.contactUs}
          </button>
        </div>
      </div>
    </div>
  );

  // Contact View
  const ContactView = () => (
    <div className="dcd-content">
      {!formSubmitted ? (
        <div className="dcd-contact-content">
          <h1 className="dcd-contact-title">{t.contactTitle}</h1>
          <p className="dcd-contact-desc">{t.contactDesc}</p>

          {/* Contact Info */}
          <div className="dcd-contact-info">
            <div className="dcd-contact-item">
              <div className="dcd-contact-icon">
                <Mail />
              </div>
              <div>
                <div className="dcd-contact-label">Email</div>
                <div className="dcd-contact-value">info@allyncai.com</div>
              </div>
            </div>
            <div className="dcd-contact-item">
              <div className="dcd-contact-icon">
                <Phone />
              </div>
              <div>
                <div className="dcd-contact-label">{language === 'tr' ? 'Telefon' : 'Phone'}</div>
                <div className="dcd-contact-value">+90 212 555 0000</div>
              </div>
            </div>
            <div className="dcd-contact-item">
              <div className="dcd-contact-icon">
                <MapPin />
              </div>
              <div>
                <div className="dcd-contact-label">{language === 'tr' ? 'Adres' : 'Address'}</div>
                <div className="dcd-contact-value">Istanbul, Turkiye</div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="dcd-contact-form">
            <h3 className="dcd-form-title">{t.sendMessage}</h3>
            <div className="dcd-form-inputs">
              <input type="text" className="dcd-form-input" placeholder={t.fullName} />
              <input type="email" className="dcd-form-input" placeholder="Email" />
              <input type="text" className="dcd-form-input" placeholder={t.subject} />
              <textarea className="dcd-form-input dcd-form-textarea" placeholder={t.message} />
              <button className="dcd-form-submit" onClick={() => setFormSubmitted(true)}>
                <Send />
                {t.send}
              </button>
            </div>
          </div>

          {/* Social Links */}
          <div className="dcd-social-links">
            <button className="dcd-social-btn">
              <Linkedin />
            </button>
            <button className="dcd-social-btn">
              <Twitter />
            </button>
          </div>
        </div>
      ) : (
        <div className="dcd-success-view">
          <div className="dcd-success-icon">
            <Check />
          </div>
          <h1 className="dcd-success-title">{t.messageReceived}</h1>
          <p className="dcd-success-message">{t.messageReceivedDesc}</p>
          <div className="dcd-success-actions">
            <button
              className="dcd-success-btn dcd-primary"
              onClick={() => {
                setFormSubmitted(false);
                handleNavigate('home');
              }}
            >
              {t.backToHome}
            </button>
            {onContactClick && (
              <button className="dcd-success-btn dcd-secondary" onClick={handleContactNavigation}>
                {t.wantRealSite}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Footer
  const Footer = () => (
    <footer className="dcd-footer">
      <div className="dcd-footer-logo">
        <div className="dcd-footer-logo-icon">
          <img src={allyncLogo} alt="Allync" />
        </div>
        <span className="dcd-footer-logo-text">Allync</span>
      </div>
      <p className="dcd-footer-copyright">
        2025 Allync. {language === 'tr' ? 'Tum haklari saklidir.' : 'All rights reserved.'}
      </p>
    </footer>
  );

  return createPortal(
    <div className={`dcd-overlay ${isVisible ? 'dcd-visible' : ''} ${isClosing ? 'dcd-closing' : ''}`} onClick={handleClose}>
      <div
        className={`dcd-iphone-container ${isVisible ? 'dcd-visible' : ''} ${isClosing ? 'dcd-closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => {
          isHoveringRef.current = true;
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          isHoveringRef.current = false;
          setIsHovering(false);
        }}
      >
        <div
          className="dcd-iphone-frame"
          ref={phoneRef}
        >
          {/* Side Buttons */}
          <div className="dcd-side-button dcd-silent-switch" />
          <div className="dcd-side-button dcd-volume-up" />
          <div className="dcd-side-button dcd-volume-down" />
          <div className="dcd-side-button dcd-power-button" />

          <div className="dcd-iphone-screen">
            {/* Wallpaper */}
            <div className="dcd-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`dcd-dynamic-island dcd-di-state-${dynamicIslandState}`}
              onClick={() => {
                if (dynamicIslandState === 'collapsed') {
                  setIsMusicPlaying(true);
                  setDynamicIslandState('expanded');
                } else if (dynamicIslandState === 'expanded') {
                  if (isMusicPlaying && isAppOpen) {
                    setDynamicIslandState('compact');
                  }
                } else if (dynamicIslandState === 'compact') {
                  setDynamicIslandState('expanded');
                }
              }}
            >
              {/* Collapsed Content */}
              <div className="dcd-di-collapsed-content">
                <div className="dcd-di-camera" />
                <div className="dcd-di-sensor" />
              </div>

              {/* Compact Content */}
              <div className="dcd-di-compact-content">
                <div className="dcd-di-compact-left">
                  <div className="dcd-di-compact-album">
                    <img src={albumCover} alt="Album" className="dcd-di-album-img" />
                  </div>
                  <div className="dcd-di-compact-info">
                    <span className="dcd-di-compact-title">Blinding Lights</span>
                    <span className="dcd-di-compact-artist">The Weeknd</span>
                  </div>
                </div>
                <div className="dcd-di-compact-waves">
                  <div className="dcd-di-wave-bar" />
                  <div className="dcd-di-wave-bar" />
                  <div className="dcd-di-wave-bar" />
                </div>
              </div>

              {/* Expanded Content */}
              <div className="dcd-di-expanded-content">
                <div className="dcd-di-music-left">
                  <div className="dcd-di-album">
                    <img src={albumCover} alt="Album" className="dcd-di-album-img" />
                  </div>
                  <div className="dcd-di-track-info">
                    <h4>Blinding Lights</h4>
                    <p>The Weeknd</p>
                  </div>
                </div>
                <div className="dcd-di-music-right">
                  <div className="dcd-di-wave-bar" />
                  <div className="dcd-di-wave-bar" />
                  <div className="dcd-di-wave-bar" />
                  <div className="dcd-di-wave-bar" />
                  <div className="dcd-di-wave-bar" />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="dcd-status-bar">
              <div className="dcd-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="dcd-status-right">
                <div className="dcd-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <span className="dcd-5g">5G</span>
                <div className="dcd-battery">
                  <div className="dcd-battery-body">
                    <div className="dcd-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`dcd-home-screen ${isAppOpen ? 'dcd-hidden' : ''}`}>
              {/* Volume HUD */}
              <div className={`dcd-volume-hud ${showVolumeControl ? 'dcd-volume-hud-visible' : ''}`}>
                <div className="dcd-volume-hud-container">
                  <div className="dcd-volume-hud-icon">
                    <svg viewBox="0 0 24 24" fill="white">
                      {volume === 0 ? (
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                      ) : volume < 0.5 ? (
                        <path d="M7 9v6h4l5 5V4l-5 5H7z"/>
                      ) : (
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      )}
                    </svg>
                  </div>
                  <div className="dcd-volume-hud-slider">
                    <div className="dcd-volume-hud-track">
                      <div
                        className="dcd-volume-hud-fill"
                        style={{ width: `${volume * 100}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="dcd-volume-hud-input"
                    />
                  </div>
                </div>
              </div>

              {/* Time Widget */}
              <div className="dcd-time-widget">
                <div className="dcd-time">{currentTime}</div>
                <div className="dcd-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="dcd-widgets-container">
                <div className="dcd-widget dcd-widget-hover">
                  <div className="dcd-widget-header">
                    <div className="dcd-widget-icon dcd-weather-icon">
                      <img src={sunIcon} alt="Weather" className="dcd-widget-icon-img" />
                    </div>
                    <span>{t.weather}</span>
                  </div>
                  <div className="dcd-weather-temp">18°</div>
                  <div className="dcd-weather-desc">{language === 'tr' ? 'Acik, H:22° L:14°' : 'Clear, H:72° L:57°'}</div>
                </div>
                <div
                  className="dcd-widget dcd-widget-hover"
                  onClick={() => {
                    if (!isMusicPlaying) {
                      setIsMusicPlaying(true);
                      setDynamicIslandState('expanded');
                    } else {
                      setIsMusicPlaying(false);
                      setDynamicIslandState('collapsed');
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="dcd-widget-header">
                    <div className="dcd-widget-icon dcd-music-icon">
                      <img src={musicIcon} alt="Music" className="dcd-widget-icon-img" />
                    </div>
                    <span>{t.music}</span>
                  </div>
                  <div className="dcd-music-playing">
                    <div className="dcd-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="dcd-album-img" />
                    </div>
                    <div className="dcd-music-info">
                      <h4>{isMusicPlaying ? t.nowPlaying : t.playNow}</h4>
                      <p>Blinding Lights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="dcd-dock">
                <div className="dcd-dock-icon dcd-close-icon dcd-dock-hover" onClick={handleClose}>
                  <span className="dcd-close-tooltip">{t.exit} X</span>
                  <img src={closeIcon} alt="Close" className="dcd-close-img" />
                </div>
                <div className="dcd-dock-icon dcd-safari-icon dcd-dock-hover" onClick={handleContactNavigation}>
                  <span className="dcd-safari-tooltip">{t.contact}</span>
                  <img src={networkIcon} alt="Contact" className="dcd-icon-img" />
                </div>
                <div className="dcd-dock-icon dcd-call-icon dcd-dock-hover" onClick={handleContactNavigation}>
                  <img src={callIcon} alt="Call" className="dcd-icon-img" />
                </div>
                <div className="dcd-dock-icon dcd-app-icon dcd-dock-hover" onClick={openApp}>
                  <span className="dcd-app-tooltip">{t.tooltip}</span>
                  <img src={allyncLogo} alt="App" style={{ width: 28, height: 28 }} />
                </div>
              </div>
            </div>

            {/* App */}
            <div className={`dcd-app ${isAppOpen ? 'dcd-active' : ''}`}>
              <div className="dcd-app-content">
                <Navigation />
                {view === 'home' && <HomeView />}
                {view === 'about' && <AboutView />}
                {view === 'services' && <ServicesView />}
                {view === 'contact' && <ContactView />}
                {view !== 'contact' || !formSubmitted ? <Footer /> : null}
              </div>
            </div>

            {/* Home Indicator */}
            <div className="dcd-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="dcd-screen-reflection" />
          </div>
        </div>

        {/* Click outside hint */}
        <div className="dcd-hint">
          {language === 'tr' ? 'Kapatmak icin disari tiklayin' : 'Click outside to close'}
        </div>
      </div>
    </div>,
    document.body
  );
};
