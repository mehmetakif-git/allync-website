import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './DesktopTextToImageDemo.css';

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
  'product-photo': cardIcon,
  'social-media': pinIcon,
  'illustration': handIcon,
  'portrait': calendarIcon
};

interface DesktopTextToImageDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

// Senaryolar
const scenarios = {
  tr: {
    'product-photo': {
      title: 'Ürün Fotoğrafı',
      desc: 'Profesyonel ürün görseli',
      prompt: 'Minimalist beyaz arka planda profesyonel parfüm şişesi fotoğrafı. Yumuşak stüdyo aydınlatması, yansımalar, yüksek kalite ürün çekimi.',
      resolution: '1024x1024',
      style: 'Professional'
    },
    'social-media': {
      title: 'Sosyal Medya',
      desc: 'Instagram için görsel',
      prompt: 'Instagram için renkli ve canlı kahve dükkanı atmosferi. Sıcak tonlar, latte art, rustik ahşap masa, doğal ışık.',
      resolution: '1080x1080',
      style: 'Vibrant'
    },
    'illustration': {
      title: 'İllüstrasyon',
      desc: 'Dijital sanat eseri',
      prompt: 'Dijital sanat stilinde fütüristik şehir manzarası. Neon ışıklar, yağmurlu gece, cyberpunk estetik, detaylı mimari.',
      resolution: '1920x1080',
      style: 'Digital Art'
    },
    'portrait': {
      title: 'Portre',
      desc: 'Profesyonel portre',
      prompt: 'Profesyonel iş dünyası portresi. Stüdyo aydınlatması, gri arka plan, özgüvenli duruş, kurumsal görünüm.',
      resolution: '1024x1024',
      style: 'Portrait'
    }
  },
  en: {
    'product-photo': {
      title: 'Product Photo',
      desc: 'Professional product image',
      prompt: 'Professional perfume bottle photo on minimalist white background. Soft studio lighting, reflections, high quality product shot.',
      resolution: '1024x1024',
      style: 'Professional'
    },
    'social-media': {
      title: 'Social Media',
      desc: 'Image for Instagram',
      prompt: 'Colorful and vibrant coffee shop atmosphere for Instagram. Warm tones, latte art, rustic wooden table, natural light.',
      resolution: '1080x1080',
      style: 'Vibrant'
    },
    'illustration': {
      title: 'Illustration',
      desc: 'Digital artwork',
      prompt: 'Futuristic cityscape in digital art style. Neon lights, rainy night, cyberpunk aesthetic, detailed architecture.',
      resolution: '1920x1080',
      style: 'Digital Art'
    },
    'portrait': {
      title: 'Portrait',
      desc: 'Professional portrait',
      prompt: 'Professional business portrait. Studio lighting, gray background, confident pose, corporate look.',
      resolution: '1024x1024',
      style: 'Portrait'
    }
  }
};

const uiText = {
  tr: {
    selectScenario: 'Görsel Türü Seçin',
    prompt: 'Prompt',
    generating: 'Oluşturuluyor...',
    complete: 'Görsel Hazır!',
    restart: 'Tekrar Oluştur',
    backToHome: 'Ana Ekrana Dön',
    tooltip: "Demo'yu Başlat!",
    weather: 'Hava Durumu',
    music: 'Müzik',
    playNow: 'Şimdi Çal',
    nowPlaying: 'Şimdi Çalıyor',
    analyzing: 'Prompt analiz ediliyor...',
    composing: 'Kompozisyon oluşturuluyor...',
    rendering: 'Görsel render ediliyor...',
    enhancing: 'Detaylar iyileştiriliyor...',
    resolution: 'Çözünürlük',
    style: 'Stil'
  },
  en: {
    selectScenario: 'Select Image Type',
    prompt: 'Prompt',
    generating: 'Generating...',
    complete: 'Image Ready!',
    restart: 'Create Again',
    backToHome: 'Back to Home',
    tooltip: 'Start Demo!',
    weather: 'Weather',
    music: 'Music',
    playNow: 'Play Now',
    nowPlaying: 'Now Playing',
    analyzing: 'Analyzing prompt...',
    composing: 'Composing layout...',
    rendering: 'Rendering image...',
    enhancing: 'Enhancing details...',
    resolution: 'Resolution',
    style: 'Style'
  }
};

// Generation steps
const generationSteps = ['analyzing', 'composing', 'rendering', 'enhancing'];

export const DesktopTextToImageDemo: React.FC<DesktopTextToImageDemoProps> = ({
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
  const [demoPhase, setDemoPhase] = useState<'typing' | 'generating' | 'complete'>('typing');
  const [typedText, setTypedText] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
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
    document.body.classList.add('dti-modal-open');

    return () => {
      document.body.classList.remove('dti-modal-open');
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
    setDemoPhase('typing');
    setTypedText('');
    setCurrentStep(0);
    setProgress(0);
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
    setDemoPhase('typing');
    setTypedText('');
    setCurrentStep(0);
    setProgress(0);

    const scenario = scenarioData[scenarioKey as keyof typeof scenarioData];
    const promptText = scenario.prompt;
    let index = 0;

    const typeNext = () => {
      if (index < promptText.length) {
        setTypedText(promptText.slice(0, index + 1));
        index++;
        timeoutRef.current = setTimeout(typeNext, 25 + Math.random() * 15);
      } else {
        timeoutRef.current = setTimeout(() => {
          setDemoPhase('generating');
          startGeneration();
        }, 500);
      }
    };

    timeoutRef.current = setTimeout(typeNext, 500);
  };

  const startGeneration = () => {
    let stepIndex = 0;
    let progressValue = 0;

    const updateProgress = () => {
      if (stepIndex >= generationSteps.length) {
        setProgress(100);
        timeoutRef.current = setTimeout(() => {
          setDemoPhase('complete');
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
    setDemoPhase('typing');
    setTypedText('');
    setCurrentStep(0);
    setProgress(0);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const restartDemo = () => {
    if (currentScenario) {
      setDemoPhase('typing');
      setTypedText('');
      setCurrentStep(0);
      setProgress(0);
      selectScenario(currentScenario);
    }
  };

  // Calculate 3D transform based on mouse position
  const getPhoneTransform = () => {
    if (!isHovering) return 'rotateY(0deg) rotateX(0deg)';
    const rotateY = mousePosition.x * 6;
    const rotateX = -mousePosition.y * 4;
    return `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  };

  return createPortal(
    <div className={`dti-overlay ${isVisible ? 'dti-visible' : ''} ${isClosing ? 'dti-closing' : ''}`} onClick={handleClose}>
      <div
        className={`dti-iphone-container ${isVisible ? 'dti-visible' : ''} ${isClosing ? 'dti-closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >

        <div
          className="dti-iphone-frame"
          ref={phoneRef}
          style={{ transform: getPhoneTransform() }}
        >
          {/* Side Buttons */}
          <div className="dti-side-button dti-silent-switch" />
          <div className="dti-side-button dti-volume-up" />
          <div className="dti-side-button dti-volume-down" />
          <div className="dti-side-button dti-power-button" />

          <div className="dti-iphone-screen">
            {/* Wallpaper */}
            <div className="dti-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`dti-dynamic-island dti-di-state-${dynamicIslandState}`}
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
              <div className="dti-di-collapsed-content">
                <div className="dti-di-camera" />
                <div className="dti-di-sensor" />
              </div>

              {/* Compact Content */}
              <div className="dti-di-compact-content">
                <div className="dti-di-compact-left">
                  <div className="dti-di-compact-album">
                    <img src={albumCover} alt="Album" className="dti-di-album-img" />
                  </div>
                  <div className="dti-di-compact-info">
                    <span className="dti-di-compact-title">Blinding Lights</span>
                    <span className="dti-di-compact-artist">The Weeknd</span>
                  </div>
                </div>
                <div className="dti-di-compact-waves">
                  <div className="dti-di-wave-bar" />
                  <div className="dti-di-wave-bar" />
                  <div className="dti-di-wave-bar" />
                </div>
              </div>

              {/* Expanded Content */}
              <div className="dti-di-expanded-content">
                <div className="dti-di-music-left">
                  <div className="dti-di-album">
                    <img src={albumCover} alt="Album" className="dti-di-album-img" />
                  </div>
                  <div className="dti-di-track-info">
                    <h4>Blinding Lights</h4>
                    <p>The Weeknd</p>
                  </div>
                </div>
                <div className="dti-di-music-right">
                  <div className="dti-di-wave-bar" />
                  <div className="dti-di-wave-bar" />
                  <div className="dti-di-wave-bar" />
                  <div className="dti-di-wave-bar" />
                  <div className="dti-di-wave-bar" />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="dti-status-bar">
              <div className="dti-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="dti-status-right">
                <div className="dti-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <span className="dti-5g">5G</span>
                <div className="dti-battery">
                  <div className="dti-battery-body">
                    <div className="dti-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`dti-home-screen ${isAppOpen ? 'dti-hidden' : ''}`}>
              {/* Volume HUD */}
              <div className={`dti-volume-hud ${showVolumeControl ? 'dti-volume-hud-visible' : ''}`}>
                <div className="dti-volume-hud-container">
                  <div className="dti-volume-hud-icon">
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
                  <div className="dti-volume-hud-slider">
                    <div className="dti-volume-hud-track">
                      <div
                        className="dti-volume-hud-fill"
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
                      className="dti-volume-hud-input"
                    />
                  </div>
                </div>
              </div>

              {/* Time Widget */}
              <div className="dti-time-widget">
                <div className="dti-time">{currentTime}</div>
                <div className="dti-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="dti-widgets-container">
                <div className="dti-widget dti-widget-hover">
                  <div className="dti-widget-header">
                    <div className="dti-widget-icon dti-weather-icon">
                      <img src={sunIcon} alt="Weather" className="dti-widget-icon-img" />
                    </div>
                    <span>{t.weather}</span>
                  </div>
                  <div className="dti-weather-temp">18°</div>
                  <div className="dti-weather-desc">{language === 'tr' ? 'Açık, H:22° L:14°' : 'Clear, H:72° L:57°'}</div>
                </div>
                <div
                  className="dti-widget dti-widget-hover"
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
                  <div className="dti-widget-header">
                    <div className="dti-widget-icon dti-music-icon">
                      <img src={musicIcon} alt="Music" className="dti-widget-icon-img" />
                    </div>
                    <span>{t.music}</span>
                  </div>
                  <div className="dti-music-playing">
                    <div className="dti-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="dti-album-img" />
                    </div>
                    <div className="dti-music-info">
                      <h4>{isMusicPlaying ? t.nowPlaying : t.playNow}</h4>
                      <p>Blinding Lights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="dti-dock">
                <div className="dti-dock-icon dti-close-icon dti-dock-hover" onClick={handleClose}>
                  <span className="dti-close-tooltip">{language === 'tr' ? 'Çıkış' : 'Exit'} ✕</span>
                  <img src={closeIcon} alt="Close" className="dti-close-img" />
                </div>
                <div className="dti-dock-icon dti-network-icon dti-dock-hover" onClick={handleContactNavigation}>
                  <span className="dti-network-tooltip">{language === 'tr' ? 'İletişime Geçin' : 'Contact Us'}</span>
                  <img src={networkIcon} alt="Contact" className="dti-icon-img" />
                </div>
                <div className="dti-dock-icon dti-call-icon dti-dock-hover" onClick={handleContactNavigation}>
                  <img src={callOutlineIcon} alt="Call" className="dti-icon-img" />
                </div>
                <div className="dti-dock-icon dti-app-icon dti-dock-hover" onClick={openApp}>
                  <span className="dti-app-tooltip">{t.tooltip} 🚀</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" fill="white" stroke="none" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              </div>
            </div>

            {/* App */}
            <div className={`dti-app ${isAppOpen ? 'dti-active' : ''}`}>
              {/* Scenario Screen */}
              {showScenarioScreen && (
                <div className="dti-scenario-screen">
                  <div className="dti-scenario-header">
                    <div className="dti-logo">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="dti-info">
                      <h3>Allync AI</h3>
                      <p>{t.selectScenario}</p>
                    </div>
                    <button className="dti-close-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="dti-scenario-list">
                    {Object.entries(scenarioData).map(([key, scenario]) => (
                      <button
                        key={key}
                        className="dti-scenario-item"
                        onClick={() => selectScenario(key)}
                      >
                        <div className={`dti-scenario-icon-wrapper ${key}`}>
                          <img src={scenarioIcons[key]} alt={scenario.title} className="dti-scenario-icon" />
                        </div>
                        <div className="dti-text">
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
                <div className="dti-demo-screen">
                  <div className="dti-demo-header">
                    <button className="dti-back-btn" onClick={goBack}>
                      <img src={backwardIcon} alt="Back" className="dti-back-img" />
                    </button>
                    <div className="dti-profile">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="dti-info">
                      <h3>Allync AI</h3>
                      <p>{scenarioData[currentScenario as keyof typeof scenarioData].title}</p>
                    </div>
                    <button className="dti-action-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="dti-demo-content">
                    {/* Prompt Section */}
                    <div className="dti-prompt-section">
                      <div className="dti-prompt-label">
                        <span className="dti-sparkle">✨</span> {t.prompt}
                      </div>
                      <div className="dti-prompt-box">
                        <p>
                          {typedText}
                          {demoPhase === 'typing' && <span className="dti-cursor">|</span>}
                        </p>
                      </div>
                    </div>

                    {/* Generation Progress */}
                    {demoPhase === 'generating' && (
                      <div className="dti-generation">
                        <div className="dti-gen-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="M21 15l-5-5L5 21" />
                          </svg>
                        </div>
                        <h4>{t.generating}</h4>
                        <div className="dti-progress-bar">
                          <div className="dti-progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="dti-steps">
                          {generationSteps.map((step, index) => (
                            <div
                              key={step}
                              className={`dti-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                            >
                              <div className="dti-step-indicator">
                                {index < currentStep ? (
                                  <img src={checkIcon} alt="Done" />
                                ) : index === currentStep ? (
                                  <div className="dti-step-dot active" />
                                ) : (
                                  <div className="dti-step-dot" />
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
                      <div className="dti-complete">
                        <div className="dti-success-icon">
                          <img src={checkIcon} alt="Success" />
                        </div>
                        <h4>{t.complete}</h4>

                        {/* Image Preview */}
                        <div className="dti-image-preview">
                          <div className="dti-image-placeholder">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="M21 15l-5-5L5 21" />
                            </svg>
                            <span>AI Generated Image</span>
                          </div>
                          <div className="dti-image-badge">
                            {scenarioData[currentScenario as keyof typeof scenarioData].resolution}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="dti-image-info">
                          <div className="dti-info-item">
                            <span className="dti-info-label">{t.resolution}</span>
                            <span className="dti-info-value">{scenarioData[currentScenario as keyof typeof scenarioData].resolution}</span>
                          </div>
                          <div className="dti-info-item">
                            <span className="dti-info-label">{t.style}</span>
                            <span className="dti-info-value">{scenarioData[currentScenario as keyof typeof scenarioData].style}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="dti-demo-actions">
                          <button className="dti-restart-btn" onClick={restartDemo}>
                            🔄 {t.restart}
                          </button>
                          <button className="dti-back-home-btn" onClick={closeApp}>
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
            <div className="dti-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="dti-screen-reflection" />
          </div>
        </div>

        {/* Click outside hint */}
        <div className="dti-hint">
          {language === 'tr' ? 'Kapatmak için dışarı tıklayın' : 'Click outside to close'}
        </div>
      </div>
    </div>,
    document.body
  );
};
