import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './MobileMobileAppDemo.css';

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
  Send,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface MobileMobileAppDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

type DemoStage = 'app-type' | 'features' | 'preview';

const uiText = {
  tr: {
    tooltip: "Demo'yu Baslat!",
    exitTooltip: 'Cikis',
    weather: 'Hava Durumu',
    music: 'Muzik',
    playNow: 'Simdi Cal',
    nowPlaying: 'Simdi Caliyor',
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
    contactUs: 'Bize Ulasin',
    pricingInfo: 'Fiyat ve teslim suresi icin bizimle iletisime gecin'
  },
  en: {
    tooltip: 'Start Demo!',
    exitTooltip: 'Exit',
    weather: 'Weather',
    music: 'Music',
    playNow: 'Play Now',
    nowPlaying: 'Now Playing',
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
    contactUs: 'Contact Us',
    pricingInfo: 'Contact us for pricing and delivery time'
  }
};

// Confetti colors matching the purple/pink theme
const CONFETTI_COLORS = ['#8b5cf6', '#ec4899', '#a855f7', '#f472b6', '#c084fc', '#f9a8d4', '#7c3aed', '#db2777'];

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
    <div className="mma-confetti-wrapper">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="mma-confetti-piece"
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

export const MobileMobileAppDemo: React.FC<MobileMobileAppDemoProps> = ({
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

  // App Builder states
  const [stage, setStage] = useState<DemoStage>('app-type');
  const [selectedAppType, setSelectedAppType] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [currentPreviewScreen, setCurrentPreviewScreen] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const t = uiText[language];

  // Get selected app type data
  const appTypeData = useMemo(() => {
    return selectedAppType ? getAppTypeById(selectedAppType) : null;
  }, [selectedAppType]);

  // Get selected features data
  const selectedFeaturesData = useMemo(() => {
    return selectedFeatures.map(id => features.find(f => f.id === id)!).filter(Boolean);
  }, [selectedFeatures]);

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
    document.body.classList.add('mma-modal-open');
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.classList.remove('mma-modal-open');
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
    setStage('app-type');
    setSelectedAppType(null);
    setSelectedFeatures([]);
    setCurrentPreviewScreen(0);
    setShowSuccess(false);
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

    document.body.classList.remove('mma-modal-open');
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

  // App Builder Handlers
  const handleSelectAppType = useCallback((typeId: string) => {
    const appType = getAppTypeById(typeId);
    setSelectedAppType(typeId);
    setSelectedFeatures(appType?.defaultFeatures || []);
    setTimeout(() => setStage('features'), 300);
  }, []);

  const handleToggleFeature = useCallback((featureId: string) => {
    setSelectedFeatures(prev => {
      if (prev.includes(featureId)) {
        return prev.filter(id => id !== featureId);
      }
      if (prev.length < 8) {
        return [...prev, featureId];
      }
      return prev;
    });
  }, []);

  const handleContinueToPreview = useCallback(() => {
    if (selectedFeatures.length >= 2) {
      setStage('preview');
    }
  }, [selectedFeatures.length]);

  const handleBack = useCallback(() => {
    if (stage === 'features') {
      setStage('app-type');
    } else if (stage === 'preview') {
      setStage('features');
    }
  }, [stage]);

  const handleReset = useCallback(() => {
    setStage('app-type');
    setSelectedAppType(null);
    setSelectedFeatures([]);
    setCurrentPreviewScreen(0);
    setShowSuccess(false);
  }, []);

  const handleRequestQuote = useCallback(() => {
    setShowConfetti(true);
    setShowSuccess(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  // App Type Selection Stage
  const AppTypeSelectionStage = () => (
    <div className="mma-stage-content">
      <div className="mma-stage-header">
        <div className="mma-stage-icon">
          <Smartphone />
        </div>
        <h2 className="mma-stage-title">{t.chooseAppType}</h2>
        <p className="mma-stage-desc">{t.whatType}</p>
      </div>

      <div className="mma-app-types-grid">
        {appTypes.map((appType) => (
          <button
            key={appType.id}
            onClick={() => handleSelectAppType(appType.id)}
            className={`mma-app-type-card ${selectedAppType === appType.id ? 'mma-selected' : ''}`}
          >
            <div className={`mma-app-type-icon bg-gradient-to-br ${appType.color}`}>
              <appType.icon />
            </div>
            <span className="mma-app-type-name">{appType.name[language]}</span>
          </button>
        ))}
      </div>

      <p className="mma-stage-hint">{t.defaultFeatures}</p>
    </div>
  );

  // Feature Selection Stage
  const FeatureSelectionStage = () => (
    <div className="mma-stage-content mma-features-stage">
      <div className="mma-features-header">
        <p className="mma-features-count">{selectedFeatures.length}/8 {t.features}</p>
      </div>

      <div className="mma-progress-bar">
        <div
          className="mma-progress-fill"
          style={{ width: `${(selectedFeatures.length / 8) * 100}%` }}
        />
      </div>

      <div className="mma-features-grid">
        {features.map((feature) => {
          const isSelected = selectedFeatures.includes(feature.id);
          return (
            <button
              key={feature.id}
              onClick={() => handleToggleFeature(feature.id)}
              disabled={!isSelected && selectedFeatures.length >= 8}
              className={`mma-feature-card ${isSelected ? 'mma-selected' : ''} ${!isSelected && selectedFeatures.length >= 8 ? 'mma-disabled' : ''}`}
            >
              <div className={`mma-feature-icon ${isSelected ? 'mma-active' : ''}`}>
                <feature.icon />
              </div>
              <div className="mma-feature-info">
                <h4 className="mma-feature-name">{feature.name[language]}</h4>
              </div>
              {isSelected && (
                <div className="mma-feature-check">
                  <Check />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mma-features-bottom">
        <button
          onClick={handleContinueToPreview}
          disabled={selectedFeatures.length < 2}
          className={`mma-continue-btn ${selectedFeatures.length >= 2 ? '' : 'mma-disabled'}`}
        >
          {t.preview}
          <ArrowRight />
        </button>
      </div>
    </div>
  );

  // Preview Stage
  const PreviewStage = () => (
    <div className="mma-stage-content mma-preview-stage">
      <div className="mma-preview-header">
        <p className="mma-preview-app-name">{appTypeData?.name[language]}</p>
      </div>

      <div className="mma-preview-content">
        {/* Mini iPhone Preview */}
        <div className="mma-mini-iphone-container">
          <div className="mma-mini-iphone">
            <div className="mma-mini-notch" />
            <div className="mma-mini-screen">
              {selectedFeaturesData[currentPreviewScreen] && (
                <FeatureScreen
                  feature={selectedFeaturesData[currentPreviewScreen]}
                  appType={appTypeData!}
                  language={language}
                />
              )}
              <div className="mma-mini-dots">
                {selectedFeaturesData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPreviewScreen(idx)}
                    className={`mma-mini-dot ${idx === currentPreviewScreen ? 'mma-active' : ''}`}
                  />
                ))}
              </div>
            </div>
            <div className="mma-mini-home-indicator" />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentPreviewScreen(prev => Math.max(0, prev - 1))}
            disabled={currentPreviewScreen === 0}
            className="mma-preview-nav mma-prev"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => setCurrentPreviewScreen(prev => Math.min(selectedFeaturesData.length - 1, prev + 1))}
            disabled={currentPreviewScreen === selectedFeaturesData.length - 1}
            className="mma-preview-nav mma-next"
          >
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>
        </div>

        {/* Summary */}
        <div className="mma-summary-card">
          <h3 className="mma-summary-title">
            <Check />
            {t.selectedFeatures}
          </h3>
          <div className="mma-summary-features">
            {selectedFeaturesData.map((feature) => (
              <div key={feature.id} className="mma-summary-feature">
                <feature.icon />
                <span>{feature.name[language]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Info */}
        <div className="mma-pricing-card">
          <div className="mma-pricing-info">
            <Sparkles />
            <span>{t.pricingInfo}</span>
          </div>
        </div>
      </div>

      <div className="mma-preview-actions">
        <button onClick={handleRequestQuote} className="mma-quote-btn">
          <Send />
          {t.getQuote}
        </button>
        <button onClick={handleReset} className="mma-reset-btn">
          <RotateCcw />
          {t.startOver}
        </button>
      </div>
    </div>
  );

  // Success Stage
  const SuccessStage = () => (
    <div className="mma-success-view">
      <div className="mma-success-icon">
        <Sparkles />
      </div>
      <h1 className="mma-success-title">{t.requestReceived}</h1>
      <p className="mma-success-message">{t.willContact}</p>

      <div className="mma-success-summary">
        <div className="mma-success-row">
          <span>{t.app}</span>
          <span>{appTypeData?.name[language]}</span>
        </div>
        <div className="mma-success-row">
          <span>{t.features}</span>
          <span>{selectedFeatures.length}</span>
        </div>
      </div>

      <div className="mma-success-actions">
        <button onClick={handleReset} className="mma-success-btn mma-primary">
          {t.newApp}
        </button>
        {onContactClick && (
          <button onClick={handleContactNavigation} className="mma-success-btn mma-secondary">
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
    <div className="mma-overlay">
      <div className="mma-iphone-container">
        <div className="mma-iphone-frame">
          {/* Side Buttons */}
          <div className="mma-side-button mma-silent-switch" />
          <div className="mma-side-button mma-volume-up" />
          <div className="mma-side-button mma-volume-down" />
          <div className="mma-side-button mma-power-button" />

          <div className="mma-iphone-screen">
            {/* Wallpaper */}
            <div className="mma-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`mma-dynamic-island mma-di-state-${dynamicIslandState}`}
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
              <div className="mma-di-collapsed-content">
                <div className="mma-di-camera" />
                <div className="mma-di-sensor" />
              </div>

              {/* Compact Content */}
              <div className="mma-di-compact-content">
                <div className="mma-di-compact-left">
                  <div className="mma-di-compact-album">
                    <img src={albumCover} alt="Album" className="mma-di-album-img" />
                  </div>
                  <div className="mma-di-compact-info">
                    <span className="mma-di-compact-title">Blinding Lights</span>
                    <span className="mma-di-compact-artist">The Weeknd</span>
                  </div>
                </div>
                <div className="mma-di-compact-waves">
                  <div className="mma-di-wave-bar" />
                  <div className="mma-di-wave-bar" />
                  <div className="mma-di-wave-bar" />
                </div>
              </div>

              {/* Expanded Content */}
              <div className="mma-di-expanded-content">
                <div className="mma-di-music-left">
                  <div className="mma-di-album">
                    <img src={albumCover} alt="Album" className="mma-di-album-img" />
                  </div>
                  <div className="mma-di-track-info">
                    <h4>Blinding Lights</h4>
                    <p>The Weeknd</p>
                  </div>
                </div>
                <div className="mma-di-music-right">
                  <div className="mma-di-wave-bar" />
                  <div className="mma-di-wave-bar" />
                  <div className="mma-di-wave-bar" />
                  <div className="mma-di-wave-bar" />
                  <div className="mma-di-wave-bar" />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mma-status-bar">
              <div className="mma-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="mma-status-right">
                <div className="mma-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <span className="mma-5g">5G</span>
                <div className="mma-battery">
                  <div className="mma-battery-body">
                    <div className="mma-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`mma-home-screen ${isAppOpen ? 'mma-hidden' : ''}`}>
              {/* Volume HUD */}
              <div className={`mma-volume-hud ${showVolumeControl ? 'mma-volume-hud-visible' : ''}`}>
                <div className="mma-volume-hud-container">
                  <div className="mma-volume-hud-icon">
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
                  <div className="mma-volume-hud-slider">
                    <div className="mma-volume-hud-track">
                      <div
                        className="mma-volume-hud-fill"
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
                      className="mma-volume-hud-input"
                    />
                  </div>
                </div>
              </div>

              {/* Time Widget */}
              <div className="mma-time-widget">
                <div className="mma-time">{currentTime}</div>
                <div className="mma-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="mma-widgets-container">
                <div className="mma-widget">
                  <div className="mma-widget-header">
                    <div className="mma-widget-icon mma-weather-icon">
                      <img src={sunIcon} alt="Weather" className="mma-widget-icon-img" />
                    </div>
                    <span>{t.weather}</span>
                  </div>
                  <div className="mma-weather-temp">18°</div>
                  <div className="mma-weather-desc">{language === 'tr' ? 'Acik, H:22° L:14°' : 'Clear, H:72° L:57°'}</div>
                </div>
                <div
                  className="mma-widget"
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
                  <div className="mma-widget-header">
                    <div className="mma-widget-icon mma-music-icon">
                      <img src={musicIcon} alt="Music" className="mma-widget-icon-img" />
                    </div>
                    <span>{t.music}</span>
                  </div>
                  <div className="mma-music-playing">
                    <div className="mma-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="mma-album-img" />
                    </div>
                    <div className="mma-music-info">
                      <h4>{isMusicPlaying ? t.nowPlaying : t.playNow}</h4>
                      <p>Blinding Lights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock with Tooltips */}
              <div className="mma-dock">
                <div className="mma-dock-icon mma-close-icon" onClick={handleClose}>
                  <span className="mma-close-tooltip">{t.exitTooltip} ✕</span>
                  <img src={closeIcon} alt="Close" className="mma-close-img" />
                </div>
                <div className="mma-dock-icon mma-network-icon" onClick={handleContactNavigation}>
                  <img src={networkIcon} alt="Network" className="mma-icon-img" />
                </div>
                <div className="mma-dock-icon mma-call-icon" onClick={handleContactNavigation}>
                  <img src={callIcon} alt="Call" className="mma-icon-img" />
                </div>
                <div className="mma-dock-icon mma-app-icon" onClick={openApp}>
                  <span className="mma-app-tooltip">{t.tooltip}</span>
                  <Smartphone style={{ width: '60%', height: '60%', color: 'white' }} />
                </div>
              </div>
            </div>

            {/* App Builder */}
            <div className={`mma-app ${isAppOpen ? 'mma-active' : ''}`}>
              <div className="mma-app-header">
                {stage !== 'app-type' && !showSuccess ? (
                  <button className="mma-app-back-btn" onClick={handleBack}>
                    <span className="mma-icon-wrapper">
                      <ArrowLeft size={32} strokeWidth={2.5} />
                    </span>
                  </button>
                ) : (
                  <div className="mma-app-back-placeholder" />
                )}
                <span className="mma-app-header-title">
                  {showSuccess ? (language === 'tr' ? 'Basarili!' : 'Success!') :
                   stage === 'app-type' ? (language === 'tr' ? 'Uygulama Tipi' : 'App Type') :
                   stage === 'features' ? (language === 'tr' ? 'Ozellikler' : 'Features') :
                   (language === 'tr' ? 'Onizleme' : 'Preview')}
                </span>
                <button className="mma-app-close-btn" onClick={closeApp}>
                  <span className="mma-icon-wrapper">
                    <X size={28} strokeWidth={2.5} />
                  </span>
                </button>
              </div>
              <div className="mma-app-content">
                {renderStage()}
              </div>

              {/* Confetti Effect */}
              {showConfetti && <ConfettiExplosion />}
            </div>

            {/* Home Indicator */}
            <div className="mma-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="mma-screen-reflection" />
          </div>
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
          <div className="mma-screen-auth">
            <div className="mma-screen-auth-icon">
              <IconComponent />
            </div>
            <h3>{language === 'tr' ? 'Giris Yap' : 'Sign In'}</h3>
            <div className="mma-screen-inputs">
              <div className="mma-screen-input">Email</div>
              <div className="mma-screen-input">{language === 'tr' ? 'Sifre' : 'Password'}</div>
              <div className="mma-screen-btn">{language === 'tr' ? 'Giris' : 'Login'}</div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="mma-screen-payment">
            <h3>{language === 'tr' ? 'Odeme' : 'Payment'}</h3>
            <div className="mma-screen-card">
              <div className="mma-screen-card-chip" />
              <div className="mma-screen-card-number">**** **** **** 4242</div>
            </div>
            <div className="mma-screen-pay-btn">{language === 'tr' ? 'Ode' : 'Pay'}</div>
          </div>
        );

      case 'chat':
        return (
          <div className="mma-screen-chat">
            <h3>{language === 'tr' ? 'Mesajlar' : 'Chat'}</h3>
            <div className="mma-screen-messages">
              <div className="mma-msg mma-sent">Merhaba!</div>
              <div className="mma-msg mma-received">Hey! Nasilsin?</div>
              <div className="mma-msg mma-sent">Harika!</div>
            </div>
            <div className="mma-screen-chat-input">
              {language === 'tr' ? 'Mesaj...' : 'Message...'}
            </div>
          </div>
        );

      case 'push':
        return (
          <div className="mma-screen-notifications">
            <h3>{language === 'tr' ? 'Bildirimler' : 'Notifications'}</h3>
            <div className="mma-notif-list">
              <div className="mma-notif">
                <div className="mma-notif-icon"><IconComponent /></div>
                <div className="mma-notif-text">
                  <p>{language === 'tr' ? 'Yeni mesaj!' : 'New message!'}</p>
                  <span>2m</span>
                </div>
              </div>
              <div className="mma-notif">
                <div className="mma-notif-icon"><IconComponent /></div>
                <div className="mma-notif-text">
                  <p>{language === 'tr' ? 'Siparis yolda' : 'Order on the way'}</p>
                  <span>1h</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'map':
        return (
          <div className="mma-screen-map">
            <div className="mma-map-grid" />
            <div className="mma-map-marker">
              <IconComponent />
            </div>
            <div className="mma-map-info">
              <p>{language === 'tr' ? 'Konum' : 'Location'}</p>
              <span>Istanbul, Turkey</span>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="mma-screen-analytics">
            <h3>{language === 'tr' ? 'Istatistik' : 'Analytics'}</h3>
            <div className="mma-chart">
              {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
                <div key={i} className="mma-chart-bar" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="mma-stats-row">
              <div className="mma-stat-box">
                <p>2.4K</p>
                <span>{language === 'tr' ? 'Kullanici' : 'Users'}</span>
              </div>
              <div className="mma-stat-box">
                <p>+18%</p>
                <span>{language === 'tr' ? 'Buyume' : 'Growth'}</span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="mma-screen-default">
            <div className={`mma-screen-default-icon bg-gradient-to-br ${appType.color}`}>
              <IconComponent />
            </div>
            <h3>{feature.name[language]}</h3>
            <p>{feature.description[language]}</p>
          </div>
        );
    }
  };

  return (
    <div className="mma-feature-screen">
      <div className="mma-screen-status-bar">
        <span>9:41</span>
        <div className="mma-screen-battery" />
      </div>
      {renderContent()}
    </div>
  );
};
