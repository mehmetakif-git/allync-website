import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import './DesktopMobileAppDemo.css';

// Assets
import closeIcon from '../../assets/demo-icons/Close_Cross_Circle.svg';
import callIcon from '../../assets/demo-icons/Call_Fill.svg';
import networkIcon from '../../assets/demo-icons/Network.svg';
import sunIcon from '../../assets/demo-icons/Sun_1_Fill.svg';
import musicIcon from '../../assets/demo-icons/music.svg';
import albumCover from '../../assets/demo-icons/The_Weeknd_-_Blinding_Lights.png';
import blindingLightsAudio from '../../assets/demo-icons/The Weeknd - Blinding Lights.mp3';

// Data
import {
  appTypes,
  features,
  calculatePrice,
  calculateTime,
  getAppTypeById,
  AppType,
  Feature
} from '../../data/mobileAppDemoData';

// Icons
import {
  X,
  Smartphone,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Send,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface DesktopMobileAppDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

type DemoStage = 'app-type' | 'features' | 'preview';

const uiText = {
  tr: {
    tooltip: "Demo'yu Baslat!",
    weather: 'Hava Durumu',
    music: 'Muzik',
    playNow: 'Simdi Cal',
    nowPlaying: 'Simdi Caliyor',
    exit: 'Cikis',
    contact: 'Iletisim',
    chooseAppType: 'Uygulama Tipini Secin',
    whatType: 'Hangi tur uygulama istiyorsunuz?',
    defaultFeatures: 'Varsayilan ozellikler otomatik eklenecek',
    selectFeatures: 'Ozellikleri Secin',
    features: 'ozellik',
    estimate: 'Tahmini',
    time: 'Sure',
    preview: 'Onizleme',
    selectedFeatures: 'Secilen Ozellikler',
    price: 'Fiyat',
    getQuote: 'Teklif Al',
    startOver: 'Bastan Basla',
    requestReceived: 'Talebiniz Alindi!',
    willContact: 'En kisa surede iletisime gececegiz.',
    app: 'Uygulama',
    newApp: 'Yeni Uygulama',
    contactUs: 'Bize Ulasin'
  },
  en: {
    tooltip: 'Start Demo!',
    weather: 'Weather',
    music: 'Music',
    playNow: 'Play Now',
    nowPlaying: 'Now Playing',
    exit: 'Exit',
    contact: 'Contact',
    chooseAppType: 'Choose App Type',
    whatType: 'What type of app do you want?',
    defaultFeatures: 'Default features will be added',
    selectFeatures: 'Select Features',
    features: 'features',
    estimate: 'Estimate',
    time: 'Time',
    preview: 'Preview',
    selectedFeatures: 'Selected Features',
    price: 'Price',
    getQuote: 'Get Quote',
    startOver: 'Start Over',
    requestReceived: 'Request Received!',
    willContact: "We'll contact you soon.",
    app: 'App',
    newApp: 'New App',
    contactUs: 'Contact Us'
  }
};

// Confetti colors matching the theme
const CONFETTI_COLORS = ['#8b5cf6', '#ec4899', '#a855f7', '#f472b6', '#c084fc', '#f9a8d4', '#7c3aed', '#db2777'];

// Pre-generate confetti particles for smooth animation
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

  for (let i = 0; i < 60; i++) {
    const spreadAngle = -90 + (Math.random() - 0.5) * 140;
    const distance = 150 + Math.random() * 200;
    const radians = (spreadAngle * Math.PI) / 180;

    particles.push({
      id: i,
      x: Math.cos(radians) * distance,
      y: Math.sin(radians) * distance,
      rotation: Math.random() * 1080 - 540,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 0.15,
      duration: 1.8 + Math.random() * 0.8,
      size: 6 + Math.random() * 8,
    });
  }
  return particles;
};

// Confetti Explosion Component
const ConfettiExplosion: React.FC = () => {
  const particles = useMemo(() => generateConfettiParticles(), []);

  return (
    <div className="dma-confetti-wrapper">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="dma-confetti-piece"
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

export const DesktopMobileAppDemo: React.FC<DesktopMobileAppDemoProps> = ({
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

  // App Builder states
  const [stage, setStage] = useState<DemoStage>('app-type');
  const [selectedAppType, setSelectedAppType] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [currentPreviewScreen, setCurrentPreviewScreen] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const phoneRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const t = uiText[language];

  // Get selected app type data
  const appTypeData = useMemo(() => {
    return selectedAppType ? getAppTypeById(selectedAppType) : null;
  }, [selectedAppType]);

  // Calculate price and time
  const priceEstimate = useMemo(() => calculatePrice(selectedFeatures), [selectedFeatures]);
  const timeEstimate = useMemo(() => calculateTime(selectedFeatures.length), [selectedFeatures.length]);

  // Get selected features data
  const selectedFeaturesData = useMemo(() => {
    return selectedFeatures.map(id => features.find(f => f.id === id)!).filter(Boolean);
  }, [selectedFeatures]);

  // Currency symbol based on language
  const currency = language === 'tr' ? '₺' : '$';
  const priceMultiplier = language === 'tr' ? 1 : 0.03;

  // Format price
  const formatPrice = (price: number) => {
    const converted = Math.round(price * priceMultiplier);
    return converted.toLocaleString();
  };

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
    document.body.classList.add('dma-modal-open');
    return () => {
      document.body.classList.remove('dma-modal-open');
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
        audioRef.current.src = '';
        audioRef.current = null;
      }
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
        volumeTimeoutRef.current = null;
      }
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
    };
  }, []);

  // Handle music play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    if (isMusicPlaying) {
      audioRef.current.volume = 0;
      audioRef.current.play().catch(console.error);

      let currentVolume = 0;
      fadeIntervalRef.current = setInterval(() => {
        currentVolume += 0.05;
        if (currentVolume >= volume) {
          currentVolume = volume;
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
          }
        }
        if (audioRef.current) {
          audioRef.current.volume = currentVolume;
        }
      }, 50);

      setShowVolumeControl(true);
    } else {
      let currentVolume = audioRef.current.volume;
      fadeIntervalRef.current = setInterval(() => {
        currentVolume -= 0.05;
        if (currentVolume <= 0) {
          currentVolume = 0;
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
          }
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

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
    };
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

  // Handle hover state changes
  useEffect(() => {
    if (!isHovering && phoneRef.current) {
      phoneRef.current.style.transform = 'rotateY(0deg) rotateX(0deg)';
    }
  }, [isHovering]);

  const openApp = () => {
    setIsAppOpen(true);
  };

  const closeApp = () => {
    setIsAppOpen(false);
    setStage('app-type');
    setSelectedAppType(null);
    setSelectedFeatures([]);
    setCurrentPreviewScreen(0);
    setShowSuccess(false);
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

  // App Builder Handlers
  const handleSelectAppType = (typeId: string) => {
    const appType = getAppTypeById(typeId);
    setSelectedAppType(typeId);
    setSelectedFeatures(appType?.defaultFeatures || []);
    setTimeout(() => setStage('features'), 300);
  };

  const handleToggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => {
      if (prev.includes(featureId)) {
        return prev.filter(id => id !== featureId);
      }
      if (prev.length < 8) {
        return [...prev, featureId];
      }
      return prev;
    });
  };

  const handleContinueToPreview = () => {
    if (selectedFeatures.length >= 2) {
      setStage('preview');
    }
  };

  const handleBack = () => {
    if (stage === 'features') {
      setStage('app-type');
    } else if (stage === 'preview') {
      setStage('features');
    }
  };

  const handleReset = () => {
    setStage('app-type');
    setSelectedAppType(null);
    setSelectedFeatures([]);
    setCurrentPreviewScreen(0);
    setShowSuccess(false);
  };

  const handleRequestQuote = () => {
    setShowConfetti(true);
    setShowSuccess(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // App Type Selection Stage
  const AppTypeSelectionStage = () => (
    <div className="dma-stage-content">
      <div className="dma-stage-header">
        <div className="dma-stage-icon">
          <Smartphone />
        </div>
        <h2 className="dma-stage-title">{t.chooseAppType}</h2>
        <p className="dma-stage-desc">{t.whatType}</p>
      </div>

      <div className="dma-app-types-grid">
        {appTypes.map((appType) => (
          <button
            key={appType.id}
            onClick={() => handleSelectAppType(appType.id)}
            className={`dma-app-type-card ${selectedAppType === appType.id ? 'dma-selected' : ''}`}
          >
            <div className={`dma-app-type-icon bg-gradient-to-br ${appType.color}`}>
              <appType.icon />
            </div>
            <span className="dma-app-type-name">{appType.name[language]}</span>
          </button>
        ))}
      </div>

      <p className="dma-stage-hint">{t.defaultFeatures}</p>
    </div>
  );

  // Feature Selection Stage
  const FeatureSelectionStage = () => (
    <div className="dma-stage-content dma-features-stage">
      <div className="dma-features-header">
        <button onClick={handleBack} className="dma-back-btn">
          <ArrowLeft />
        </button>
        <div className="dma-features-header-text">
          <h2 className="dma-stage-title">{t.selectFeatures}</h2>
          <p className="dma-features-count">{selectedFeatures.length}/8 {t.features}</p>
        </div>
      </div>

      <div className="dma-progress-bar">
        <div
          className="dma-progress-fill"
          style={{ width: `${(selectedFeatures.length / 8) * 100}%` }}
        />
      </div>

      <div className="dma-features-grid">
        {features.map((feature) => {
          const isSelected = selectedFeatures.includes(feature.id);
          return (
            <button
              key={feature.id}
              onClick={() => handleToggleFeature(feature.id)}
              disabled={!isSelected && selectedFeatures.length >= 8}
              className={`dma-feature-card ${isSelected ? 'dma-selected' : ''} ${!isSelected && selectedFeatures.length >= 8 ? 'dma-disabled' : ''}`}
            >
              <div className={`dma-feature-icon ${isSelected ? 'dma-active' : ''}`}>
                <feature.icon />
              </div>
              <div className="dma-feature-info">
                <h4 className="dma-feature-name">{feature.name[language]}</h4>
                <p className="dma-feature-price">+{currency}{formatPrice(feature.price)}</p>
              </div>
              {isSelected && (
                <div className="dma-feature-check">
                  <Check />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="dma-features-bottom">
        <div className="dma-estimate-row">
          <div className="dma-estimate-item">
            <p className="dma-estimate-label">{t.estimate}</p>
            <p className="dma-estimate-value">
              {currency}{formatPrice(priceEstimate.min)} - {currency}{formatPrice(priceEstimate.max)}
            </p>
          </div>
          <div className="dma-estimate-item">
            <p className="dma-estimate-label">{t.time}</p>
            <p className="dma-estimate-value">{timeEstimate[language]}</p>
          </div>
        </div>
        <button
          onClick={handleContinueToPreview}
          disabled={selectedFeatures.length < 2}
          className={`dma-continue-btn ${selectedFeatures.length >= 2 ? '' : 'dma-disabled'}`}
        >
          {t.preview}
          <ArrowRight />
        </button>
      </div>
    </div>
  );

  // Preview Stage
  const PreviewStage = () => (
    <div className="dma-stage-content dma-preview-stage">
      <div className="dma-preview-header">
        <button onClick={handleBack} className="dma-back-btn">
          <ArrowLeft />
        </button>
        <div className="dma-preview-header-text">
          <h2 className="dma-stage-title">{t.preview}</h2>
          <p className="dma-preview-app-name">{appTypeData?.name[language]}</p>
        </div>
      </div>

      <div className="dma-preview-content">
        {/* Mini iPhone Preview */}
        <div className="dma-mini-iphone-container">
          <div className="dma-mini-iphone">
            <div className="dma-mini-notch" />
            <div className="dma-mini-screen">
              {selectedFeaturesData[currentPreviewScreen] && (
                <FeatureScreen
                  feature={selectedFeaturesData[currentPreviewScreen]}
                  appType={appTypeData!}
                  language={language}
                />
              )}
              <div className="dma-mini-dots">
                {selectedFeaturesData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPreviewScreen(idx)}
                    className={`dma-mini-dot ${idx === currentPreviewScreen ? 'dma-active' : ''}`}
                  />
                ))}
              </div>
            </div>
            <div className="dma-mini-home-indicator" />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentPreviewScreen(prev => Math.max(0, prev - 1))}
            disabled={currentPreviewScreen === 0}
            className="dma-preview-nav dma-prev"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => setCurrentPreviewScreen(prev => Math.min(selectedFeaturesData.length - 1, prev + 1))}
            disabled={currentPreviewScreen === selectedFeaturesData.length - 1}
            className="dma-preview-nav dma-next"
          >
            <ChevronRight />
          </button>
        </div>

        {/* Summary */}
        <div className="dma-summary-card">
          <h3 className="dma-summary-title">
            <Check />
            {t.selectedFeatures}
          </h3>
          <div className="dma-summary-features">
            {selectedFeaturesData.map((feature) => (
              <div key={feature.id} className="dma-summary-feature">
                <feature.icon />
                <span>{feature.name[language]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Info */}
        <div className="dma-pricing-card">
          <div className="dma-pricing-info">
            <Sparkles />
            <span>{language === 'tr' ? 'Fiyat ve teslim suresi icin bizimle iletisime gecin' : 'Contact us for pricing and delivery time'}</span>
          </div>
        </div>
      </div>

      <div className="dma-preview-actions">
        <button onClick={handleRequestQuote} className="dma-quote-btn">
          <Send />
          {t.getQuote}
        </button>
        <button onClick={handleReset} className="dma-reset-btn">
          <RotateCcw />
          {t.startOver}
        </button>
      </div>
    </div>
  );

  // Success Stage
  const SuccessStage = () => (
    <div className="dma-success-view">
      <div className="dma-success-icon">
        <Sparkles />
      </div>
      <h1 className="dma-success-title">{t.requestReceived}</h1>
      <p className="dma-success-message">{t.willContact}</p>

      <div className="dma-success-summary">
        <div className="dma-success-row">
          <span>{t.app}</span>
          <span>{appTypeData?.name[language]}</span>
        </div>
        <div className="dma-success-row">
          <span>{t.features}</span>
          <span>{selectedFeatures.length}</span>
        </div>
        <div className="dma-success-row">
          <span>{t.estimate}</span>
          <span className="dma-success-price">
            {currency}{formatPrice(priceEstimate.min)} - {currency}{formatPrice(priceEstimate.max)}
          </span>
        </div>
      </div>

      <div className="dma-success-actions">
        <button onClick={handleReset} className="dma-success-btn dma-primary">
          {t.newApp}
        </button>
        {onContactClick && (
          <button onClick={handleContactNavigation} className="dma-success-btn dma-secondary">
            {t.contactUs}
          </button>
        )}
      </div>
    </div>
  );

  // Render current stage
  const renderStage = () => {
    if (showSuccess) return <SuccessStage />;
    switch (stage) {
      case 'app-type': return <AppTypeSelectionStage />;
      case 'features': return <FeatureSelectionStage />;
      case 'preview': return <PreviewStage />;
      default: return <AppTypeSelectionStage />;
    }
  };

  return createPortal(
    <div className={`dma-overlay ${isVisible ? 'dma-visible' : ''} ${isClosing ? 'dma-closing' : ''}`} onClick={handleClose}>
      <div
        className={`dma-iphone-container ${isVisible ? 'dma-visible' : ''} ${isClosing ? 'dma-closing' : ''}`}
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
          className="dma-iphone-frame"
          ref={phoneRef}
        >
          {/* Side Buttons */}
          <div className="dma-side-button dma-silent-switch" />
          <div className="dma-side-button dma-volume-up" />
          <div className="dma-side-button dma-volume-down" />
          <div className="dma-side-button dma-power-button" />

          <div className="dma-iphone-screen">
            {/* Wallpaper */}
            <div className="dma-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`dma-dynamic-island dma-di-state-${dynamicIslandState}`}
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
              <div className="dma-di-collapsed-content">
                <div className="dma-di-camera" />
                <div className="dma-di-sensor" />
              </div>

              {/* Compact Content */}
              <div className="dma-di-compact-content">
                <div className="dma-di-compact-left">
                  <div className="dma-di-compact-album">
                    <img src={albumCover} alt="Album" className="dma-di-album-img" />
                  </div>
                  <div className="dma-di-compact-info">
                    <span className="dma-di-compact-title">Blinding Lights</span>
                    <span className="dma-di-compact-artist">The Weeknd</span>
                  </div>
                </div>
                <div className="dma-di-compact-waves">
                  <div className="dma-di-wave-bar" />
                  <div className="dma-di-wave-bar" />
                  <div className="dma-di-wave-bar" />
                </div>
              </div>

              {/* Expanded Content */}
              <div className="dma-di-expanded-content">
                <div className="dma-di-music-left">
                  <div className="dma-di-album">
                    <img src={albumCover} alt="Album" className="dma-di-album-img" />
                  </div>
                  <div className="dma-di-track-info">
                    <h4>Blinding Lights</h4>
                    <p>The Weeknd</p>
                  </div>
                </div>
                <div className="dma-di-music-right">
                  <div className="dma-di-wave-bar" />
                  <div className="dma-di-wave-bar" />
                  <div className="dma-di-wave-bar" />
                  <div className="dma-di-wave-bar" />
                  <div className="dma-di-wave-bar" />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="dma-status-bar">
              <div className="dma-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="dma-status-right">
                <div className="dma-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <span className="dma-5g">5G</span>
                <div className="dma-battery">
                  <div className="dma-battery-body">
                    <div className="dma-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`dma-home-screen ${isAppOpen ? 'dma-hidden' : ''}`}>
              {/* Volume HUD */}
              <div className={`dma-volume-hud ${showVolumeControl ? 'dma-volume-hud-visible' : ''}`}>
                <div className="dma-volume-hud-container">
                  <div className="dma-volume-hud-icon">
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
                  <div className="dma-volume-hud-slider">
                    <div className="dma-volume-hud-track">
                      <div
                        className="dma-volume-hud-fill"
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
                      className="dma-volume-hud-input"
                    />
                  </div>
                </div>
              </div>

              {/* Time Widget */}
              <div className="dma-time-widget">
                <div className="dma-time">{currentTime}</div>
                <div className="dma-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="dma-widgets-container">
                <div className="dma-widget dma-widget-hover">
                  <div className="dma-widget-header">
                    <div className="dma-widget-icon dma-weather-icon">
                      <img src={sunIcon} alt="Weather" className="dma-widget-icon-img" />
                    </div>
                    <span>{t.weather}</span>
                  </div>
                  <div className="dma-weather-temp">18°</div>
                  <div className="dma-weather-desc">{language === 'tr' ? 'Acik, H:22° L:14°' : 'Clear, H:72° L:57°'}</div>
                </div>
                <div
                  className="dma-widget dma-widget-hover"
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
                  <div className="dma-widget-header">
                    <div className="dma-widget-icon dma-music-icon">
                      <img src={musicIcon} alt="Music" className="dma-widget-icon-img" />
                    </div>
                    <span>{t.music}</span>
                  </div>
                  <div className="dma-music-playing">
                    <div className="dma-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="dma-album-img" />
                    </div>
                    <div className="dma-music-info">
                      <h4>{isMusicPlaying ? t.nowPlaying : t.playNow}</h4>
                      <p>Blinding Lights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="dma-dock">
                <div className="dma-dock-icon dma-close-icon dma-dock-hover" onClick={handleClose}>
                  <span className="dma-close-tooltip">{t.exit} X</span>
                  <img src={closeIcon} alt="Close" className="dma-close-img" />
                </div>
                <div className="dma-dock-icon dma-safari-icon dma-dock-hover" onClick={handleContactNavigation}>
                  <span className="dma-safari-tooltip">{t.contact}</span>
                  <img src={networkIcon} alt="Contact" className="dma-icon-img" />
                </div>
                <div className="dma-dock-icon dma-call-icon dma-dock-hover" onClick={handleContactNavigation}>
                  <img src={callIcon} alt="Call" className="dma-icon-img" />
                </div>
                <div className="dma-dock-icon dma-app-icon dma-dock-hover" onClick={openApp}>
                  <span className="dma-app-tooltip">{t.tooltip}</span>
                  <Smartphone style={{ width: 28, height: 28, color: 'white' }} />
                </div>
              </div>
            </div>

            {/* App */}
            <div className={`dma-app ${isAppOpen ? 'dma-active' : ''}`}>
              <div className="dma-app-content" onWheel={(e) => e.stopPropagation()}>
                {/* App Header */}
                <div className="dma-app-header">
                  <button className="dma-app-close-btn" onClick={closeApp}>
                    <X />
                  </button>
                </div>

                {renderStage()}
              </div>

              {/* Confetti Effect */}
              {showConfetti && <ConfettiExplosion />}
            </div>

            {/* Home Indicator */}
            <div className="dma-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="dma-screen-reflection" />
          </div>
        </div>

        {/* Click outside hint */}
        <div className="dma-hint">
          {language === 'tr' ? 'Kapatmak icin disari tiklayin' : 'Click outside to close'}
        </div>
      </div>
    </div>,
    document.body
  );
};

// Feature Screen Component for Preview
interface FeatureScreenProps {
  feature: Feature;
  appType: AppType;
  language: 'tr' | 'en';
}

const FeatureScreen: React.FC<FeatureScreenProps> = ({ feature, appType, language }) => {
  const IconComponent = feature.icon;

  const renderContent = () => {
    switch (feature.id) {
      case 'user-auth':
        return (
          <div className="dma-screen-auth">
            <div className="dma-screen-auth-icon">
              <IconComponent />
            </div>
            <h3>{language === 'tr' ? 'Giris Yap' : 'Sign In'}</h3>
            <div className="dma-screen-inputs">
              <div className="dma-screen-input">Email</div>
              <div className="dma-screen-input">{language === 'tr' ? 'Sifre' : 'Password'}</div>
              <div className="dma-screen-btn">{language === 'tr' ? 'Giris' : 'Login'}</div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="dma-screen-payment">
            <h3>{language === 'tr' ? 'Odeme' : 'Payment'}</h3>
            <div className="dma-screen-card">
              <div className="dma-screen-card-chip" />
              <div className="dma-screen-card-number">**** **** **** 4242</div>
            </div>
            <div className="dma-screen-pay-btn">{language === 'tr' ? 'Ode' : 'Pay'}</div>
          </div>
        );

      case 'chat':
        return (
          <div className="dma-screen-chat">
            <h3>{language === 'tr' ? 'Mesajlar' : 'Chat'}</h3>
            <div className="dma-screen-messages">
              <div className="dma-msg dma-sent">Merhaba!</div>
              <div className="dma-msg dma-received">Hey! Nasilsin?</div>
              <div className="dma-msg dma-sent">Harika!</div>
            </div>
            <div className="dma-screen-chat-input">
              {language === 'tr' ? 'Mesaj...' : 'Message...'}
            </div>
          </div>
        );

      case 'push':
        return (
          <div className="dma-screen-notifications">
            <h3>{language === 'tr' ? 'Bildirimler' : 'Notifications'}</h3>
            <div className="dma-notif-list">
              <div className="dma-notif">
                <div className="dma-notif-icon"><IconComponent /></div>
                <div className="dma-notif-text">
                  <p>{language === 'tr' ? 'Yeni mesaj!' : 'New message!'}</p>
                  <span>2m</span>
                </div>
              </div>
              <div className="dma-notif">
                <div className="dma-notif-icon"><IconComponent /></div>
                <div className="dma-notif-text">
                  <p>{language === 'tr' ? 'Siparis yolda' : 'Order on the way'}</p>
                  <span>1h</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'map':
        return (
          <div className="dma-screen-map">
            <div className="dma-map-grid" />
            <div className="dma-map-marker">
              <IconComponent />
            </div>
            <div className="dma-map-info">
              <p>{language === 'tr' ? 'Konum' : 'Location'}</p>
              <span>Istanbul, Turkey</span>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="dma-screen-analytics">
            <h3>{language === 'tr' ? 'Istatistik' : 'Analytics'}</h3>
            <div className="dma-chart">
              {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
                <div key={i} className="dma-chart-bar" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="dma-stats-row">
              <div className="dma-stat-box">
                <p>2.4K</p>
                <span>{language === 'tr' ? 'Kullanici' : 'Users'}</span>
              </div>
              <div className="dma-stat-box">
                <p>+18%</p>
                <span>{language === 'tr' ? 'Buyume' : 'Growth'}</span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="dma-screen-default">
            <div className={`dma-screen-default-icon bg-gradient-to-br ${appType.color}`}>
              <IconComponent />
            </div>
            <h3>{feature.name[language]}</h3>
            <p>{feature.description[language]}</p>
          </div>
        );
    }
  };

  return (
    <div className="dma-feature-screen">
      <div className="dma-screen-status-bar">
        <span>9:41</span>
        <div className="dma-screen-battery" />
      </div>
      {renderContent()}
    </div>
  );
};
