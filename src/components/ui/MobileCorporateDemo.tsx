import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './MobileCorporateDemo.css';

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
  Twitter,
  ArrowLeft,
  Building2
} from 'lucide-react';

interface MobileCorporateDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

type DemoView = 'home' | 'about' | 'services' | 'contact';

const uiText = {
  tr: {
    tooltip: "Demo'yu Baslat!",
    exitTooltip: 'Cikis',
    weather: 'Hava Durumu',
    music: 'Muzik',
    playNow: 'Simdi Cal',
    nowPlaying: 'Simdi Caliyor',
    home: 'Ana Sayfa',
    about: 'Hakkimizda',
    services: 'Hizmetler',
    contact: 'Iletisim',
    heroSince: "2009'dan beri hizmetinizdeyiz",
    heroTitle: 'Isletmenizi Gelecege Tasiyoruz',
    heroDesc: 'Kurumsal cozumler ve dijital donusum hizmetleri ile isletmenizi one tasiyoruz.',
    contactUs: 'Bize Ulasin',
    ourServices: 'Hizmetlerimiz',
    aboutTitle: 'Hakkimizda',
    aboutDesc: '2009 yilindan bu yana isletmelere kurumsal cozumler sunuyoruz.',
    mission: 'Misyonumuz',
    missionText: 'Isletmelerin dijital donusumune onculuk etmek.',
    vision: 'Vizyonumuz',
    visionText: "Turkiye'nin lider kurumsal danismanlik firmasi olmak.",
    leadershipTeam: 'Yonetim Ekibi',
    ourValues: 'Degerlerimiz',
    values: ['Musteri Odaklilik', 'Yenilikcilik', 'Guvenilirlik', 'Seffaflik'],
    servicesTitle: 'Hizmetlerimiz',
    servicesDesc: 'Isletmenizin ihtiyaclarina ozel cozumler.',
    learnMore: 'Detayli Bilgi',
    getQuote: 'Teklif Alin',
    getQuoteDesc: 'Ozel fiyatlandirma icin iletisime gecin.',
    contactTitle: 'Iletisim',
    contactDesc: 'Sorulariniz icin bize ulasin.',
    sendMessage: 'Mesaj Gonderin',
    fullName: 'Adiniz Soyadiniz',
    subject: 'Konu',
    message: 'Mesajiniz...',
    send: 'Gonder',
    messageReceived: 'Mesajiniz Alindi!',
    messageReceivedDesc: 'En kisa surede donus yapacagiz.',
    backToHome: 'Ana Sayfaya Don',
    wantRealSite: 'Web Sitesi Ister misiniz?',
    ctaTitle: 'Projenizi Hayata Gecirelim',
    ctaDesc: 'Ucretsiz danismanlik icin iletisime gecin',
    ctaBtn: 'Ucretsiz Teklif'
  },
  en: {
    tooltip: 'Start Demo!',
    exitTooltip: 'Exit',
    weather: 'Weather',
    music: 'Music',
    playNow: 'Play Now',
    nowPlaying: 'Now Playing',
    home: 'Home',
    about: 'About',
    services: 'Services',
    contact: 'Contact',
    heroSince: 'Serving since 2009',
    heroTitle: 'Taking Your Business Forward',
    heroDesc: 'Corporate solutions and digital transformation to move your business ahead.',
    contactUs: 'Contact Us',
    ourServices: 'Our Services',
    aboutTitle: 'About Us',
    aboutDesc: 'Since 2009, providing corporate solutions to businesses.',
    mission: 'Our Mission',
    missionText: 'Leading digital transformation of businesses.',
    vision: 'Our Vision',
    visionText: 'To be the leading corporate consulting firm.',
    leadershipTeam: 'Leadership Team',
    ourValues: 'Our Values',
    values: ['Customer Focus', 'Innovation', 'Reliability', 'Transparency'],
    servicesTitle: 'Our Services',
    servicesDesc: 'Solutions tailored to your business needs.',
    learnMore: 'Learn More',
    getQuote: 'Get Quote',
    getQuoteDesc: 'Contact us for custom pricing.',
    contactTitle: 'Contact',
    contactDesc: 'Reach out with your questions.',
    sendMessage: 'Send Message',
    fullName: 'Full Name',
    subject: 'Subject',
    message: 'Your message...',
    send: 'Send',
    messageReceived: 'Message Received!',
    messageReceivedDesc: 'We\'ll get back to you soon.',
    backToHome: 'Back to Home',
    wantRealSite: 'Want a Real Website?',
    ctaTitle: 'Let\'s Build Your Project',
    ctaDesc: 'Contact us for free consultation',
    ctaBtn: 'Free Quote'
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
  { value: '15+', label: { tr: 'Yil', en: 'Years' } },
  { value: '500+', label: { tr: 'Musteri', en: 'Clients' } },
  { value: '50+', label: { tr: 'Uzman', en: 'Experts' } },
  { value: '99%', label: { tr: 'Memnuniyet', en: 'Satisfaction' } },
];

// Confetti colors matching the theme
const CONFETTI_COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#facc15'];

// Pre-generate confetti particles
const generateConfettiParticles = () => {
  const particles: Array<{
    id: number;
    x: number;
    y: number;
    rotation: number;
    color: string;
    delay: number;
    duration: number;
    size: number;
  }> = [];

  for (let i = 0; i < 50; i++) {
    const spreadAngle = -90 + (Math.random() - 0.5) * 140;
    const distance = 100 + Math.random() * 150;
    const radians = (spreadAngle * Math.PI) / 180;

    particles.push({
      id: i,
      x: Math.cos(radians) * distance,
      y: Math.sin(radians) * distance,
      rotation: Math.random() * 1080 - 540,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 0.15,
      duration: 1.6 + Math.random() * 0.6,
      size: 5 + Math.random() * 6,
    });
  }
  return particles;
};

// Confetti Explosion Component
const ConfettiExplosion: React.FC = () => {
  const particles = useMemo(() => generateConfettiParticles(), []);

  return (
    <div className="mcd-confetti-wrapper">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="mcd-confetti-piece"
          style={{
            '--end-x': `${particle.x}px`,
            '--end-y': `${particle.y}px`,
            '--rotation': `${particle.rotation}deg`,
            '--delay': `${particle.delay}s`,
            '--duration': `${particle.duration}s`,
            '--size': `${particle.size}px`,
            backgroundColor: particle.color,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export const MobileCorporateDemo: React.FC<MobileCorporateDemoProps> = ({
  language,
  onClose,
  onContactClick
}) => {
  // Entry time for clock
  const [entryTime] = useState(() => new Date());
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isAppOpen, setIsAppOpen] = useState(false);

  // Dynamic Island states
  const [dynamicIslandState, setDynamicIslandState] = useState<'collapsed' | 'compact' | 'expanded'>('collapsed');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  // Corporate states
  const [view, setView] = useState<DemoView>('home');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const t = uiText[language];

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
    const scrollY = window.scrollY;
    document.body.classList.add('mcd-modal-open');
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.classList.remove('mcd-modal-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollY);

      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }
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

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current && isMusicPlaying) {
      audioRef.current.volume = volume;
    }
  }, [volume, isMusicPlaying]);

  const openApp = () => {
    setIsAppOpen(true);
  };

  const closeApp = () => {
    setIsAppOpen(false);
    setView('home');
    setFormSubmitted(false);
  };

  const handleClose = () => {
    setIsMusicPlaying(false);
    setDynamicIslandState('collapsed');
    if (onClose) {
      onClose();
    }
  };

  const handleContactNavigation = () => {
    setIsMusicPlaying(false);
    setDynamicIslandState('collapsed');

    document.body.classList.remove('mcd-modal-open');
    document.body.style.top = '';

    if (onClose) {
      onClose();
    }

    setTimeout(() => {
      if (onContactClick) {
        onContactClick();
      }
    }, 100);
  };

  const handleNavigate = useCallback((newView: DemoView) => {
    if (newView === view) return;
    setView(newView);
    setFormSubmitted(false);
  }, [view]);

  const handleFormSubmit = useCallback(() => {
    setShowConfetti(true);
    setFormSubmitted(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  // Navbar Component - shown on all pages
  const Navbar = () => (
    <div className="mcd-navbar">
      <div className="mcd-page-logo" onClick={() => handleNavigate('home')}>
        <div className="mcd-page-logo-icon">
          <img src={allyncLogo} alt="Allync" />
        </div>
        <span className="mcd-page-logo-text">Allync</span>
      </div>
      <div className="mcd-nav-items">
        {(['about', 'services', 'contact'] as DemoView[]).map((v) => (
          <button
            key={v}
            className={`mcd-nav-item ${view === v ? 'mcd-nav-active' : ''}`}
            onClick={() => handleNavigate(v)}
          >
            {t[v]}
          </button>
        ))}
      </div>
      <button className="mcd-page-close-btn" onClick={closeApp}>
        <X />
      </button>
    </div>
  );

  // Footer Component
  const Footer = () => (
    <footer className="mcd-footer">
      <div className="mcd-footer-logo">
        <div className="mcd-footer-logo-icon">
          <img src={allyncLogo} alt="Allync" />
        </div>
        <span className="mcd-footer-logo-text">Allync</span>
      </div>
      <p className="mcd-footer-copyright">
        2026 Allync. {language === 'tr' ? 'Tum haklari saklidir.' : 'All rights reserved.'}
      </p>
    </footer>
  );

  // Home View
  const HomeView = () => (
    <div className="mcd-page-content">
        {/* Hero Section */}
        <div className="mcd-hero">
          <div className="mcd-hero-bg" />
          <span className="mcd-hero-badge">{t.heroSince}</span>
          <h1 className="mcd-hero-title">{t.heroTitle}</h1>
          <p className="mcd-hero-desc">{t.heroDesc}</p>
          <div className="mcd-hero-buttons">
            <button className="mcd-btn-primary" onClick={() => handleNavigate('contact')}>
              {t.contactUs}
              <ChevronRight />
            </button>
            <button className="mcd-btn-secondary" onClick={() => handleNavigate('services')}>
              {t.ourServices}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mcd-stats">
          {stats.map((stat, i) => (
            <div key={i} className="mcd-stat">
              <div className="mcd-stat-value">{stat.value}</div>
              <div className="mcd-stat-label">{stat.label[language]}</div>
            </div>
          ))}
        </div>

        {/* Services Preview */}
        <div className="mcd-section">
          <h2 className="mcd-section-title">{t.ourServices}</h2>
          <div className="mcd-services-grid">
            {services[language].map((service, i) => (
              <div
                key={i}
                className="mcd-service-card"
                onClick={() => handleNavigate('services')}
              >
                <service.icon className="mcd-service-icon" />
                <h3 className="mcd-service-title">{service.title}</h3>
                <p className="mcd-service-desc">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mcd-cta">
          <h2 className="mcd-cta-title">{t.ctaTitle}</h2>
          <p className="mcd-cta-desc">{t.ctaDesc}</p>
          <button className="mcd-cta-btn" onClick={() => handleNavigate('contact')}>
            {t.ctaBtn}
          </button>
        </div>
    </div>
  );

  // About View
  const AboutView = () => (
    <div className="mcd-page-content">
        <p className="mcd-about-desc">{t.aboutDesc}</p>

        {/* Mission & Vision */}
        <div className="mcd-mission-vision">
          <div className="mcd-mission-card mcd-mission">
            <h3 className="mcd-mission-title">{t.mission}</h3>
            <p className="mcd-mission-text">{t.missionText}</p>
          </div>
          <div className="mcd-mission-card mcd-vision">
            <h3 className="mcd-mission-title">{t.vision}</h3>
            <p className="mcd-mission-text">{t.visionText}</p>
          </div>
        </div>

        {/* Team */}
        <h2 className="mcd-team-title">{t.leadershipTeam}</h2>
        <div className="mcd-team-grid">
          {team[language].map((member, i) => {
            const teamImage = getTeamImage(member.imageId);
            return (
              <div key={i} className="mcd-team-member">
                <div className={`mcd-team-avatar bg-gradient-to-br ${member.color}`}>
                  {teamImage ? (
                    <img src={teamImage} alt={member.name} />
                  ) : (
                    <span>{member.name.split(' ').map(n => n[0]).join('')}</span>
                  )}
                </div>
                <h3 className="mcd-team-name">{member.name}</h3>
                <p className="mcd-team-role">{member.role}</p>
              </div>
            );
          })}
        </div>

        {/* Values */}
        <h2 className="mcd-values-title">{t.ourValues}</h2>
        <div className="mcd-values-list">
          {t.values.map((value, i) => (
            <div key={i} className="mcd-value-item">
              <Check />
              <span>{value}</span>
            </div>
          ))}
        </div>
    </div>
  );

  // Services View
  const ServicesView = () => (
    <div className="mcd-page-content">
        <p className="mcd-services-desc">{t.servicesDesc}</p>

        <div className="mcd-services-list">
          {services[language].map((service, i) => (
            <div key={i} className="mcd-service-item">
              <div className="mcd-service-item-icon">
                <service.icon />
              </div>
              <div className="mcd-service-item-content">
                <h3 className="mcd-service-item-title">{service.title}</h3>
                <p className="mcd-service-item-desc">{service.desc}</p>
                <button className="mcd-service-item-link" onClick={() => handleNavigate('contact')}>
                  {t.learnMore}
                  <ChevronRight />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing CTA */}
        <div className="mcd-cta">
          <h3 className="mcd-cta-title">{t.getQuote}</h3>
          <p className="mcd-cta-desc">{t.getQuoteDesc}</p>
          <button className="mcd-cta-btn" onClick={() => handleNavigate('contact')}>
            {t.contactUs}
          </button>
        </div>
    </div>
  );

  // Contact View
  const ContactView = () => (
    <div className="mcd-page-content">
        {!formSubmitted ? (
          <>
            <p className="mcd-contact-desc">{t.contactDesc}</p>

            {/* Contact Info */}
            <div className="mcd-contact-info">
              <div className="mcd-contact-item">
                <div className="mcd-contact-icon">
                  <Mail />
                </div>
                <div>
                  <div className="mcd-contact-label">Email</div>
                  <div className="mcd-contact-value">info@allyncai.com</div>
                </div>
              </div>
              <div className="mcd-contact-item">
                <div className="mcd-contact-icon">
                  <Phone />
                </div>
                <div>
                  <div className="mcd-contact-label">{language === 'tr' ? 'Telefon' : 'Phone'}</div>
                  <div className="mcd-contact-value">+90 212 555 0000</div>
                </div>
              </div>
              <div className="mcd-contact-item">
                <div className="mcd-contact-icon">
                  <MapPin />
                </div>
                <div>
                  <div className="mcd-contact-label">{language === 'tr' ? 'Adres' : 'Address'}</div>
                  <div className="mcd-contact-value">Istanbul, Turkiye</div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="mcd-contact-form">
              <h3 className="mcd-form-title">{t.sendMessage}</h3>
              <input type="text" className="mcd-form-input" placeholder={t.fullName} />
              <input type="email" className="mcd-form-input" placeholder="Email" />
              <input type="text" className="mcd-form-input" placeholder={t.subject} />
              <textarea className="mcd-form-input mcd-form-textarea" placeholder={t.message} />
              <button className="mcd-form-submit" onClick={handleFormSubmit}>
                <Send />
                {t.send}
              </button>
            </div>

            {/* Social Links */}
            <div className="mcd-social-links">
              <button className="mcd-social-btn">
                <Linkedin />
              </button>
              <button className="mcd-social-btn">
                <Twitter />
              </button>
            </div>
          </>
        ) : (
          <div className="mcd-success-view">
            <div className="mcd-success-icon">
              <Check />
            </div>
            <h1 className="mcd-success-title">{t.messageReceived}</h1>
            <p className="mcd-success-message">{t.messageReceivedDesc}</p>
            <div className="mcd-success-actions">
              <button
                className="mcd-continue-btn"
                onClick={() => {
                  setFormSubmitted(false);
                  handleNavigate('home');
                }}
              >
                {t.backToHome}
              </button>
              {onContactClick && (
                <button className="mcd-contact-btn" onClick={handleContactNavigation}>
                  {t.wantRealSite}
                </button>
              )}
            </div>
          </div>
        )}
    </div>
  );

  return createPortal(
    <div className="mcd-overlay">
      <div className="mcd-iphone-container">
        <div className="mcd-iphone-frame">
          {/* Side Buttons */}
          <div className="mcd-side-button mcd-silent-switch" />
          <div className="mcd-side-button mcd-volume-up" />
          <div className="mcd-side-button mcd-volume-down" />
          <div className="mcd-side-button mcd-power-button" />

          <div className="mcd-iphone-screen">
            {/* Wallpaper */}
            <div className="mcd-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`mcd-dynamic-island mcd-di-state-${dynamicIslandState}`}
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
              <div className="mcd-di-collapsed-content">
                <div className="mcd-di-camera" />
                <div className="mcd-di-sensor" />
              </div>

              {/* Compact Content */}
              <div className="mcd-di-compact-content">
                <div className="mcd-di-compact-left">
                  <div className="mcd-di-compact-album">
                    <img src={albumCover} alt="Album" className="mcd-di-album-img" />
                  </div>
                  <div className="mcd-di-compact-info">
                    <span className="mcd-di-compact-title">Blinding Lights</span>
                    <span className="mcd-di-compact-artist">The Weeknd</span>
                  </div>
                </div>
                <div className="mcd-di-compact-waves">
                  <div className="mcd-di-wave-bar" />
                  <div className="mcd-di-wave-bar" />
                  <div className="mcd-di-wave-bar" />
                </div>
              </div>

              {/* Expanded Content */}
              <div className="mcd-di-expanded-content">
                <div className="mcd-di-music-left">
                  <div className="mcd-di-album">
                    <img src={albumCover} alt="Album" className="mcd-di-album-img" />
                  </div>
                  <div className="mcd-di-track-info">
                    <h4>Blinding Lights</h4>
                    <p>The Weeknd</p>
                  </div>
                </div>
                <div className="mcd-di-music-right">
                  <div className="mcd-di-wave-bar" />
                  <div className="mcd-di-wave-bar" />
                  <div className="mcd-di-wave-bar" />
                  <div className="mcd-di-wave-bar" />
                  <div className="mcd-di-wave-bar" />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mcd-status-bar">
              <div className="mcd-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="mcd-status-right">
                <div className="mcd-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <span className="mcd-5g">5G</span>
                <div className="mcd-battery">
                  <div className="mcd-battery-body">
                    <div className="mcd-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`mcd-home-screen ${isAppOpen ? 'mcd-hidden' : ''}`}>
              {/* Volume HUD */}
              <div className={`mcd-volume-hud ${showVolumeControl ? 'mcd-volume-hud-visible' : ''}`}>
                <div className="mcd-volume-hud-container">
                  <div className="mcd-volume-hud-icon">
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
                  <div className="mcd-volume-hud-slider">
                    <div className="mcd-volume-hud-track">
                      <div
                        className="mcd-volume-hud-fill"
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
                      className="mcd-volume-hud-input"
                    />
                  </div>
                </div>
              </div>

              {/* Time Widget */}
              <div className="mcd-time-widget">
                <div className="mcd-time">{currentTime}</div>
                <div className="mcd-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="mcd-widgets-container">
                <div className="mcd-widget">
                  <div className="mcd-widget-header">
                    <div className="mcd-widget-icon mcd-weather-icon">
                      <img src={sunIcon} alt="Weather" className="mcd-widget-icon-img" />
                    </div>
                    <span>{t.weather}</span>
                  </div>
                  <div className="mcd-weather-temp">18°</div>
                  <div className="mcd-weather-desc">{language === 'tr' ? 'Acik, H:22° L:14°' : 'Clear, H:72° L:57°'}</div>
                </div>
                <div
                  className="mcd-widget"
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
                  <div className="mcd-widget-header">
                    <div className="mcd-widget-icon mcd-music-icon">
                      <img src={musicIcon} alt="Music" className="mcd-widget-icon-img" />
                    </div>
                    <span>{t.music}</span>
                  </div>
                  <div className="mcd-music-playing">
                    <div className="mcd-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="mcd-album-img" />
                    </div>
                    <div className="mcd-music-info">
                      <h4>{isMusicPlaying ? t.nowPlaying : t.playNow}</h4>
                      <p>Blinding Lights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock with Tooltips */}
              <div className="mcd-dock">
                <div className="mcd-dock-icon mcd-close-icon" onClick={handleClose}>
                  <span className="mcd-close-tooltip">{t.exitTooltip} ✕</span>
                  <img src={closeIcon} alt="Close" className="mcd-close-img" />
                </div>
                <div className="mcd-dock-icon mcd-network-icon" onClick={handleContactNavigation}>
                  <img src={networkIcon} alt="Network" className="mcd-icon-img" />
                </div>
                <div className="mcd-dock-icon mcd-call-icon" onClick={handleContactNavigation}>
                  <img src={callIcon} alt="Call" className="mcd-icon-img" />
                </div>
                <div className="mcd-dock-icon mcd-corp-icon" onClick={openApp}>
                  <span className="mcd-corp-tooltip">{t.tooltip}</span>
                  <Building2 style={{ width: '60%', height: '60%', color: 'white' }} />
                </div>
              </div>
            </div>

            {/* Corporate App */}
            <div className={`mcd-corporate-app ${isAppOpen ? 'mcd-active' : ''}`}>
              <Navbar />
              {view === 'home' && <HomeView />}
              {view === 'about' && <AboutView />}
              {view === 'services' && <ServicesView />}
              {view === 'contact' && <ContactView />}
              {(view !== 'contact' || !formSubmitted) && <Footer />}

              {/* Confetti Effect */}
              {showConfetti && <ConfettiExplosion />}
            </div>

            {/* Home Indicator */}
            <div className="mcd-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="mcd-screen-reflection" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
