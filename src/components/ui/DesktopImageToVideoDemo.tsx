import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './DesktopImageToVideoDemo.css';

// Assets
import demoLogo from '../../assets/whatsapp-demo-logo.png';
import closeIcon from '../../assets/demo-icons/Close_Cross_Circle.svg';
import networkIcon from '../../assets/demo-icons/Network.svg';
import backwardIcon from '../../assets/demo-icons/Backward.svg';
import callOutlineIcon from '../../assets/demo-icons/Call.svg';
import sunIcon from '../../assets/demo-icons/Sun_1_Fill.svg';
import musicIcon from '../../assets/demo-icons/music.svg';
import albumCover from '../../assets/demo-icons/The_Weeknd_-_Blinding_Lights.png';
import blindingLightsAudio from '../../assets/demo-icons/The Weeknd - Blinding Lights.mp3';
import checkIcon from '../../assets/demo-icons/Check.svg';
import cardIcon from '../../assets/demo-icons/Card_Fill.svg';
import pinIcon from '../../assets/demo-icons/Pin_Fill.svg';
import handIcon from '../../assets/demo-icons/Hand_Sparcles_Fill.svg';
import calendarIcon from '../../assets/demo-icons/Calendar_Plus.svg';

// Senaryo ikonları mapping
const scenarioIcons: Record<string, string> = {
  'product-showcase': cardIcon,
  'portrait-alive': calendarIcon,
  'social-motion': pinIcon,
  'art-illustration': handIcon
};

// Senaryo görselleri
const scenarioImages: Record<string, string> = {
  'product-showcase': '/images/demo-product.webp',
  'portrait-alive': '/images/demo-portrait.webp',
  'social-motion': '/images/demo-social.webp',
  'art-illustration': '/images/demo-illustration.webp'
};

interface DesktopImageToVideoDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

// Senaryolar
const scenarios = {
  tr: {
    'product-showcase': {
      title: 'Ürün Animasyonu',
      desc: '360° dönen ürün videosu',
      prompt: 'Statik ürün görselini 360° dönen, parlayan bir vitrin videosuna dönüştür.',
      animationType: '360° Rotation',
      duration: '5s'
    },
    'portrait-alive': {
      title: 'Portre Canlandırma',
      desc: 'Canlı portre efekti',
      prompt: 'Portre fotoğrafını hafif baş hareketleri ve göz kırpma ile canlandır.',
      animationType: 'Living Portrait',
      duration: '4s'
    },
    'social-motion': {
      title: 'Sosyal Medya',
      desc: 'Dinamik hareket efekti',
      prompt: 'Sosyal medya görselini dinamik zoom, pan ve parıltı efektleriyle hareketlendir.',
      animationType: 'Dynamic Motion',
      duration: '3s'
    },
    'art-illustration': {
      title: 'İllüstrasyon',
      desc: 'Parallax katman animasyonu',
      prompt: 'Dijital illüstrasyonu katman katman animate et ve derinlik ekle.',
      animationType: 'Parallax Layers',
      duration: '6s'
    }
  },
  en: {
    'product-showcase': {
      title: 'Product Animation',
      desc: '360° rotating product video',
      prompt: 'Transform static product image into a 360° rotating, gleaming showcase video.',
      animationType: '360° Rotation',
      duration: '5s'
    },
    'portrait-alive': {
      title: 'Portrait Animation',
      desc: 'Living portrait effect',
      prompt: 'Bring portrait photo to life with subtle head movements and blinking.',
      animationType: 'Living Portrait',
      duration: '4s'
    },
    'social-motion': {
      title: 'Social Media',
      desc: 'Dynamic motion effect',
      prompt: 'Add dynamic zoom, pan and sparkle effects to social media image.',
      animationType: 'Dynamic Motion',
      duration: '3s'
    },
    'art-illustration': {
      title: 'Illustration',
      desc: 'Parallax layer animation',
      prompt: 'Animate digital illustration layer by layer and add depth.',
      animationType: 'Parallax Layers',
      duration: '6s'
    }
  }
};

const uiText = {
  tr: {
    selectScenario: 'Animasyon Türü Seçin',
    prompt: 'Açıklama',
    animating: 'Animate Ediliyor...',
    complete: 'Video Hazır!',
    restart: 'Başka Görsel Animate Et',
    backToHome: 'Ana Ekrana Dön',
    tooltip: "Demo'yu Başlat!",
    weather: 'Hava Durumu',
    music: 'Müzik',
    playNow: 'Şimdi Çal',
    nowPlaying: 'Şimdi Çalıyor',
    analyzing: 'Görsel analiz ediliyor...',
    detecting: 'Nesneler tespit ediliyor...',
    generating: 'Hareket oluşturuluyor...',
    rendering: 'Video render ediliyor...',
    type: 'Animasyon',
    duration: 'Süre'
  },
  en: {
    selectScenario: 'Select Animation Type',
    prompt: 'Description',
    animating: 'Animating...',
    complete: 'Video Ready!',
    restart: 'Animate Another Image',
    backToHome: 'Back to Home',
    tooltip: 'Start Demo!',
    weather: 'Weather',
    music: 'Music',
    playNow: 'Play Now',
    nowPlaying: 'Now Playing',
    analyzing: 'Analyzing image...',
    detecting: 'Detecting objects...',
    generating: 'Generating motion...',
    rendering: 'Rendering video...',
    type: 'Animation',
    duration: 'Duration'
  }
};

// Animation steps
const animationSteps = ['analyzing', 'detecting', 'generating', 'rendering'];

export const DesktopImageToVideoDemo: React.FC<DesktopImageToVideoDemoProps> = ({
  language,
  onClose,
  onContactClick
}) => {
  // Siteye giriş zamanını kaydet (bir kere)
  const [entryTime] = useState(() => new Date());
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isAppOpen, setIsAppOpen] = useState(false);
  const [showScenarioScreen, setShowScenarioScreen] = useState(true);
  const [currentScenario, setCurrentScenario] = useState<string | null>(null);
  const [demoPhase, setDemoPhase] = useState<'preview' | 'animating' | 'complete'>('preview');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  // Dynamic Island states
  const [dynamicIslandState, setDynamicIslandState] = useState<'collapsed' | 'compact' | 'expanded'>('collapsed');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const phoneRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const t = uiText[language];
  const scenarioData = scenarios[language];

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

  // Trigger entrance animation
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  // Giriş zamanını baz alarak tarih ve saati ayarla
  useEffect(() => {
    const hours = entryTime.getHours().toString().padStart(2, '0');
    const minutes = entryTime.getMinutes().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}`);

    const days = language === 'tr'
      ? ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
      : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = language === 'tr'
      ? ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    setCurrentDate(`${days[entryTime.getDay()]}, ${entryTime.getDate()} ${months[entryTime.getMonth()]}`);
  }, [language, entryTime]);

  // Disable body scroll
  useEffect(() => {
    document.body.classList.add('div-modal-open');

    return () => {
      document.body.classList.remove('div-modal-open');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Mouse tracking for 3D effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!phoneRef.current) return;

      const rect = phoneRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);

      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const openApp = () => {
    setIsAppOpen(true);
  };

  const closeApp = () => {
    setIsAppOpen(false);
    setShowScenarioScreen(true);
    setCurrentScenario(null);
    setDemoPhase('preview');
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
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

  const selectScenario = (scenarioKey: string) => {
    setShowScenarioScreen(false);
    setCurrentScenario(scenarioKey);
    setDemoPhase('preview');
    setCurrentStep(0);
    setProgress(0);
  };

  const startAnimation = () => {
    setDemoPhase('animating');

    let stepIndex = 0;
    let progressValue = 0;

    const updateProgress = () => {
      if (stepIndex >= animationSteps.length) {
        setProgress(100);
        timeoutRef.current = setTimeout(() => {
          setDemoPhase('complete');
          setIsPlaying(true);
        }, 300);
        return;
      }

      setCurrentStep(stepIndex);
      progressValue += 2;
      setProgress(Math.min(progressValue, 99));

      if (progressValue >= (stepIndex + 1) * 25) {
        stepIndex++;
      }

      timeoutRef.current = setTimeout(updateProgress, 100);
    };

    timeoutRef.current = setTimeout(updateProgress, 100);
  };

  const goBack = () => {
    setShowScenarioScreen(true);
    setCurrentScenario(null);
    setDemoPhase('preview');
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const restartDemo = () => {
    setShowScenarioScreen(true);
    setCurrentScenario(null);
    setDemoPhase('preview');
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Calculate 3D transform based on mouse position
  const getPhoneTransform = () => {
    if (!isHovering) return 'rotateY(0deg) rotateX(0deg)';
    const rotateY = mousePosition.x * 6;
    const rotateX = -mousePosition.y * 4;
    return `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  };

  return createPortal(
    <div className={`div-overlay ${isVisible ? 'div-visible' : ''} ${isClosing ? 'div-closing' : ''}`} onClick={handleClose}>
      <div
        className={`div-iphone-container ${isVisible ? 'div-visible' : ''} ${isClosing ? 'div-closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >

        <div
          className="div-iphone-frame"
          ref={phoneRef}
          style={{ transform: getPhoneTransform() }}
        >
          {/* Side Buttons */}
          <div className="div-side-button div-silent-switch" />
          <div className="div-side-button div-volume-up" />
          <div className="div-side-button div-volume-down" />
          <div className="div-side-button div-power-button" />

          <div className="div-iphone-screen">
            {/* Wallpaper */}
            <div className="div-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`div-dynamic-island div-di-state-${dynamicIslandState}`}
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
              <div className="div-di-collapsed-content">
                <div className="div-di-camera" />
                <div className="div-di-sensor" />
              </div>

              {/* Compact Content */}
              <div className="div-di-compact-content">
                <div className="div-di-compact-left">
                  <div className="div-di-compact-album">
                    <img src={albumCover} alt="Album" className="div-di-album-img" />
                  </div>
                  <div className="div-di-compact-info">
                    <span className="div-di-compact-title">Blinding Lights</span>
                    <span className="div-di-compact-artist">The Weeknd</span>
                  </div>
                </div>
                <div className="div-di-compact-waves">
                  <div className="div-di-wave-bar" />
                  <div className="div-di-wave-bar" />
                  <div className="div-di-wave-bar" />
                </div>
              </div>

              {/* Expanded Content */}
              <div className="div-di-expanded-content">
                <div className="div-di-music-left">
                  <div className="div-di-album">
                    <img src={albumCover} alt="Album" className="div-di-album-img" />
                  </div>
                  <div className="div-di-track-info">
                    <h4>Blinding Lights</h4>
                    <p>The Weeknd</p>
                  </div>
                </div>
                <div className="div-di-music-right">
                  <div className="div-di-wave-bar" />
                  <div className="div-di-wave-bar" />
                  <div className="div-di-wave-bar" />
                  <div className="div-di-wave-bar" />
                  <div className="div-di-wave-bar" />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="div-status-bar">
              <div className="div-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="div-status-right">
                <div className="div-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <span className="div-5g">5G</span>
                <div className="div-battery">
                  <div className="div-battery-body">
                    <div className="div-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`div-home-screen ${isAppOpen ? 'div-hidden' : ''}`}>
              {/* Volume HUD */}
              <div className={`div-volume-hud ${showVolumeControl ? 'div-volume-hud-visible' : ''}`}>
                <div className="div-volume-hud-container">
                  <div className="div-volume-hud-icon">
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
                  <div className="div-volume-hud-slider">
                    <div className="div-volume-hud-track">
                      <div
                        className="div-volume-hud-fill"
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
                      className="div-volume-hud-input"
                    />
                  </div>
                </div>
              </div>

              {/* Time Widget */}
              <div className="div-time-widget">
                <div className="div-time">{currentTime}</div>
                <div className="div-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="div-widgets-container">
                <div className="div-widget div-widget-hover">
                  <div className="div-widget-header">
                    <div className="div-widget-icon div-weather-icon">
                      <img src={sunIcon} alt="Weather" className="div-widget-icon-img" />
                    </div>
                    <span>{t.weather}</span>
                  </div>
                  <div className="div-weather-temp">18°</div>
                  <div className="div-weather-desc">{language === 'tr' ? 'Açık, H:22° L:14°' : 'Clear, H:72° L:57°'}</div>
                </div>
                <div
                  className="div-widget div-widget-hover"
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
                  <div className="div-widget-header">
                    <div className="div-widget-icon div-music-icon">
                      <img src={musicIcon} alt="Music" className="div-widget-icon-img" />
                    </div>
                    <span>{t.music}</span>
                  </div>
                  <div className="div-music-playing">
                    <div className="div-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="div-album-img" />
                    </div>
                    <div className="div-music-info">
                      <h4>{isMusicPlaying ? t.nowPlaying : t.playNow}</h4>
                      <p>Blinding Lights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="div-dock">
                <div className="div-dock-icon div-close-icon div-dock-hover" onClick={handleClose}>
                  <span className="div-close-tooltip">{language === 'tr' ? 'Çıkış' : 'Exit'} ✕</span>
                  <img src={closeIcon} alt="Close" className="div-close-img" />
                </div>
                <div className="div-dock-icon div-network-icon div-dock-hover" onClick={handleContactNavigation}>
                  <span className="div-network-tooltip">{language === 'tr' ? 'İletişime Geçin' : 'Contact Us'}</span>
                  <img src={networkIcon} alt="Contact" className="div-icon-img" />
                </div>
                <div className="div-dock-icon div-call-icon div-dock-hover" onClick={handleContactNavigation}>
                  <img src={callOutlineIcon} alt="Call" className="div-icon-img" />
                </div>
                <div className="div-dock-icon div-app-icon div-dock-hover" onClick={openApp}>
                  <span className="div-app-tooltip">{t.tooltip}</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polygon points="5,3 19,12 5,21" fill="white" stroke="none" />
                  </svg>
                </div>
              </div>
            </div>

            {/* App */}
            <div className={`div-app ${isAppOpen ? 'div-active' : ''}`}>
              {/* Scenario Screen */}
              {showScenarioScreen && (
                <div className="div-scenario-screen">
                  <div className="div-scenario-header">
                    <div className="div-logo">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="div-info">
                      <h3>Allync AI</h3>
                      <p>{t.selectScenario}</p>
                    </div>
                    <button className="div-close-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="div-scenario-list">
                    {Object.entries(scenarioData).map(([key, scenario]) => (
                      <button
                        key={key}
                        className="div-scenario-item"
                        onClick={() => selectScenario(key)}
                      >
                        <div className={`div-scenario-icon-wrapper ${key}`}>
                          <img src={scenarioIcons[key]} alt={scenario.title} className="div-scenario-icon" />
                        </div>
                        <div className="div-text">
                          <h4>{scenario.title}</h4>
                          <p>{scenario.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Demo Screen */}
              {!showScenarioScreen && currentScenario && (
                <div className="div-demo-screen">
                  <div className="div-demo-header">
                    <button className="div-back-btn" onClick={goBack}>
                      <img src={backwardIcon} alt="Back" className="div-back-img" />
                    </button>
                    <div className="div-profile">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="div-info">
                      <h3>Allync AI</h3>
                      <p>{scenarioData[currentScenario as keyof typeof scenarioData].title}</p>
                    </div>
                    <button className="div-action-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="div-demo-content">
                    {/* Preview Phase */}
                    {demoPhase === 'preview' && (
                      <>
                        {/* Source Image Preview */}
                        <div className="div-source-section">
                          <div className="div-source-label">
                            <span className="div-sparkle">🖼️</span> {language === 'tr' ? 'Kaynak Görsel' : 'Source Image'}
                          </div>
                          <div className="div-source-preview">
                            <img
                              src={scenarioImages[currentScenario]}
                              alt="Source"
                              className="div-source-image"
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="div-prompt-section">
                          <div className="div-prompt-label">
                            <span className="div-sparkle">✨</span> {t.prompt}
                          </div>
                          <div className="div-prompt-box">
                            <p>{scenarioData[currentScenario as keyof typeof scenarioData].prompt}</p>
                          </div>
                        </div>

                        {/* Info Tags */}
                        <div className="div-info-tags">
                          <div className="div-info-tag">
                            <span className="div-info-label">{t.type}</span>
                            <span className="div-info-value">{scenarioData[currentScenario as keyof typeof scenarioData].animationType}</span>
                          </div>
                          <div className="div-info-tag">
                            <span className="div-info-label">{t.duration}</span>
                            <span className="div-info-value">{scenarioData[currentScenario as keyof typeof scenarioData].duration}</span>
                          </div>
                        </div>

                        {/* Start Button */}
                        <button className="div-start-btn" onClick={startAnimation}>
                          🎬 {language === 'tr' ? 'Animate Et' : 'Animate'}
                        </button>
                      </>
                    )}

                    {/* Animating Phase */}
                    {demoPhase === 'animating' && (
                      <div className="div-generation">
                        <div className="div-gen-preview">
                          <img
                            src={scenarioImages[currentScenario]}
                            alt="Animating"
                            className="div-animating-image"
                          />
                          <div className="div-scan-line" />
                        </div>
                        <div className="div-gen-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="5,3 19,12 5,21" />
                          </svg>
                        </div>
                        <h4>{t.animating}</h4>
                        <div className="div-progress-bar">
                          <div className="div-progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="div-steps">
                          {animationSteps.map((step, index) => (
                            <div
                              key={step}
                              className={`div-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                            >
                              <div className="div-step-indicator">
                                {index < currentStep ? (
                                  <img src={checkIcon} alt="Done" />
                                ) : index === currentStep ? (
                                  <div className="div-step-dot active" />
                                ) : (
                                  <div className="div-step-dot" />
                                )}
                              </div>
                              <span>{t[step as keyof typeof t]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Complete */}
                    {demoPhase === 'complete' && (
                      <div className="div-complete">
                        <div className="div-success-icon">
                          <img src={checkIcon} alt="Success" />
                        </div>
                        <h4>{t.complete}</h4>

                        {/* Video Preview with animation */}
                        <div className="div-video-preview">
                          <img
                            src={scenarioImages[currentScenario]}
                            alt="Result"
                            className={`div-result-image ${isPlaying ? 'playing' : ''}`}
                            data-animation={currentScenario}
                          />
                          <div className="div-play-indicator">
                            <div className="div-play-dot" />
                            {language === 'tr' ? 'Canlı' : 'Live'}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="div-video-info">
                          <div className="div-info-item">
                            <span className="div-info-label">{t.type}</span>
                            <span className="div-info-value">{scenarioData[currentScenario as keyof typeof scenarioData].animationType}</span>
                          </div>
                          <div className="div-info-item">
                            <span className="div-info-label">{t.duration}</span>
                            <span className="div-info-value">{scenarioData[currentScenario as keyof typeof scenarioData].duration}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="div-demo-actions">
                          <button className="div-restart-btn" onClick={restartDemo}>
                            🔄 {t.restart}
                          </button>
                          <button className="div-back-home-btn" onClick={closeApp}>
                            🏠 {t.backToHome}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Home Indicator */}
            <div className="div-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="div-screen-reflection" />
          </div>
        </div>

        {/* Click outside hint */}
        <div className="div-hint">
          {language === 'tr' ? 'Kapatmak için dışarı tıklayın' : 'Click outside to close'}
        </div>
      </div>
    </div>,
    document.body
  );
};
