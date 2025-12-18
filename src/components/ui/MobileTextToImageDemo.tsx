import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './MobileTextToImageDemo.css';

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

// Senaryo görselleri
const scenarioImages: Record<string, string> = {
  'product-photo': '/images/demo-product.webp',
  'social-media': '/images/demo-social.webp',
  'illustration': '/images/demo-illustration.webp',
  'portrait': '/images/demo-portrait.webp'
};

interface MobileTextToImageDemoProps {
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

export const MobileTextToImageDemo: React.FC<MobileTextToImageDemoProps> = ({
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
  // Dynamic Island states
  const [dynamicIslandState, setDynamicIslandState] = useState<'collapsed' | 'compact' | 'expanded'>('collapsed');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const t = uiText[language];
  const scenarioData = scenarios[language];

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
    const scrollY = window.scrollY;
    document.body.classList.add('mti-modal-open');
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.classList.remove('mti-modal-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
    setIsMusicPlaying(false);
    setDynamicIslandState('collapsed');
    if (onClose) {
      onClose();
    }
  };

  const handleContactNavigation = () => {
    setIsMusicPlaying(false);
    setDynamicIslandState('collapsed');
    document.body.classList.remove('mti-modal-open');
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

    // Typing animation
    const typeNext = () => {
      if (index < promptText.length) {
        setTypedText(promptText.slice(0, index + 1));
        index++;
        timeoutRef.current = setTimeout(typeNext, 25 + Math.random() * 15);
      } else {
        // Start generation
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

  return createPortal(
    <div className="mti-overlay">
      <div className="mti-iphone-container">
        <div className="mti-iphone-frame">
          {/* Side Buttons */}
          <div className="mti-side-button mti-silent-switch" />
          <div className="mti-side-button mti-volume-up" />
          <div className="mti-side-button mti-volume-down" />
          <div className="mti-side-button mti-power-button" />

          <div className="mti-iphone-screen">
            {/* Wallpaper */}
            <div className="mti-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`mti-dynamic-island mti-di-state-${dynamicIslandState}`}
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
              <div className="mti-di-collapsed-content">
                <div className="mti-di-camera" />
                <div className="mti-di-sensor" />
              </div>

              {/* Compact Content */}
              <div className="mti-di-compact-content">
                <div className="mti-di-compact-left">
                  <div className="mti-di-compact-album">
                    <img src={albumCover} alt="Album" className="mti-di-album-img" />
                  </div>
                  <div className="mti-di-compact-info">
                    <span className="mti-di-compact-title">Blinding Lights</span>
                    <span className="mti-di-compact-artist">The Weeknd</span>
                  </div>
                </div>
                <div className="mti-di-compact-waves">
                  <div className="mti-di-wave-bar" />
                  <div className="mti-di-wave-bar" />
                  <div className="mti-di-wave-bar" />
                </div>
              </div>

              {/* Expanded Content */}
              <div className="mti-di-expanded-content">
                <div className="mti-di-music-left">
                  <div className="mti-di-album">
                    <img src={albumCover} alt="Album" className="mti-di-album-img" />
                  </div>
                  <div className="mti-di-track-info">
                    <h4>Blinding Lights</h4>
                    <p>The Weeknd</p>
                  </div>
                </div>
                <div className="mti-di-music-right">
                  <div className="mti-di-wave-bar" />
                  <div className="mti-di-wave-bar" />
                  <div className="mti-di-wave-bar" />
                  <div className="mti-di-wave-bar" />
                  <div className="mti-di-wave-bar" />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mti-status-bar">
              <div className="mti-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="mti-status-right">
                <div className="mti-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <span className="mti-5g">5G</span>
                <div className="mti-battery">
                  <div className="mti-battery-body">
                    <div className="mti-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`mti-home-screen ${isAppOpen ? 'mti-hidden' : ''}`}>
              {/* Volume HUD */}
              <div className={`mti-volume-hud ${showVolumeControl ? 'mti-volume-hud-visible' : ''}`}>
                <div className="mti-volume-hud-container">
                  <div className="mti-volume-hud-icon">
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
                  <div className="mti-volume-hud-slider">
                    <div className="mti-volume-hud-track">
                      <div
                        className="mti-volume-hud-fill"
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
                      className="mti-volume-hud-input"
                    />
                  </div>
                </div>
              </div>

              {/* Time Widget */}
              <div className="mti-time-widget">
                <div className="mti-time">{currentTime}</div>
                <div className="mti-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="mti-widgets-container">
                <div className="mti-widget">
                  <div className="mti-widget-header">
                    <div className="mti-widget-icon mti-weather-icon">
                      <img src={sunIcon} alt="Weather" className="mti-widget-icon-img" />
                    </div>
                    <span>{t.weather}</span>
                  </div>
                  <div className="mti-weather-temp">18°</div>
                  <div className="mti-weather-desc">{language === 'tr' ? 'Açık, H:22° L:14°' : 'Clear, H:72° L:57°'}</div>
                </div>
                <div
                  className="mti-widget"
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
                  <div className="mti-widget-header">
                    <div className="mti-widget-icon mti-music-icon">
                      <img src={musicIcon} alt="Music" className="mti-widget-icon-img" />
                    </div>
                    <span>{t.music}</span>
                  </div>
                  <div className="mti-music-playing">
                    <div className="mti-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="mti-album-img" />
                    </div>
                    <div className="mti-music-info">
                      <h4>{isMusicPlaying ? t.nowPlaying : t.playNow}</h4>
                      <p>Blinding Lights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="mti-dock">
                <div className="mti-dock-icon mti-close-icon" onClick={handleClose}>
                  <span className="mti-close-tooltip">{language === 'tr' ? 'Çıkış' : 'Exit'} ✕</span>
                  <img src={closeIcon} alt="Close" className="mti-close-img" />
                </div>
                <div className="mti-dock-icon mti-network-icon" onClick={handleContactNavigation}>
                  <img src={networkIcon} alt="Network" className="mti-icon-img" />
                </div>
                <div className="mti-dock-icon mti-call-icon" onClick={handleContactNavigation}>
                  <img src={callOutlineIcon} alt="Call" className="mti-icon-img" />
                </div>
                <div className="mti-dock-icon mti-app-icon" onClick={openApp}>
                  <span className="mti-app-tooltip">{t.tooltip} 🚀</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" fill="white" stroke="none" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              </div>
            </div>

            {/* App */}
            <div className={`mti-app ${isAppOpen ? 'mti-active' : ''}`}>
              {/* Scenario Screen */}
              {showScenarioScreen && (
                <div className="mti-scenario-screen">
                  <div className="mti-scenario-header">
                    <div className="mti-logo">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="mti-info">
                      <h3>Allync AI</h3>
                      <p>{t.selectScenario}</p>
                    </div>
                    <button className="mti-close-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="mti-scenario-list">
                    {Object.entries(scenarioData).map(([key, scenario]) => (
                      <button
                        key={key}
                        className="mti-scenario-item"
                        onClick={() => selectScenario(key)}
                      >
                        <div className={`mti-scenario-icon-wrapper ${key}`}>
                          <img src={scenarioIcons[key]} alt={scenario.title} className="mti-scenario-icon" />
                        </div>
                        <div className="mti-text">
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
                <div className="mti-demo-screen">
                  <div className="mti-demo-header">
                    <button className="mti-back-btn" onClick={goBack}>
                      <img src={backwardIcon} alt="Back" className="mti-back-img" />
                    </button>
                    <div className="mti-profile">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="mti-info">
                      <h3>Allync AI</h3>
                      <p>{scenarioData[currentScenario as keyof typeof scenarioData].title}</p>
                    </div>
                    <button className="mti-action-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="mti-demo-content">
                    {/* Prompt Section */}
                    <div className="mti-prompt-section">
                      <div className="mti-prompt-label">
                        <span className="mti-sparkle">✨</span> {t.prompt}
                      </div>
                      <div className="mti-prompt-box">
                        <p>
                          {typedText}
                          {demoPhase === 'typing' && <span className="mti-cursor">|</span>}
                        </p>
                      </div>
                    </div>

                    {/* Generation Progress */}
                    {demoPhase === 'generating' && (
                      <div className="mti-generation">
                        <div className="mti-gen-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="M21 15l-5-5L5 21" />
                          </svg>
                        </div>
                        <h4>{t.generating}</h4>
                        <div className="mti-progress-bar">
                          <div className="mti-progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="mti-steps">
                          {generationSteps.map((step, index) => (
                            <div
                              key={step}
                              className={`mti-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                            >
                              <div className="mti-step-indicator">
                                {index < currentStep ? (
                                  <img src={checkIcon} alt="Done" />
                                ) : index === currentStep ? (
                                  <div className="mti-step-dot active" />
                                ) : (
                                  <div className="mti-step-dot" />
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
                      <div className="mti-complete">
                        <div className="mti-success-icon">
                          <img src={checkIcon} alt="Success" />
                        </div>
                        <h4>{t.complete}</h4>

                        {/* Image Preview */}
                        <div className="mti-image-preview">
                          <img
                            src={scenarioImages[currentScenario]}
                            alt="Generated"
                            className="mti-generated-image"
                          />
                          <div className="mti-image-badge">
                            {scenarioData[currentScenario as keyof typeof scenarioData].resolution}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="mti-image-info">
                          <div className="mti-info-item">
                            <span className="mti-info-label">{t.resolution}</span>
                            <span className="mti-info-value">{scenarioData[currentScenario as keyof typeof scenarioData].resolution}</span>
                          </div>
                          <div className="mti-info-item">
                            <span className="mti-info-label">{t.style}</span>
                            <span className="mti-info-value">{scenarioData[currentScenario as keyof typeof scenarioData].style}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mti-demo-actions">
                          <button className="mti-restart-btn" onClick={restartDemo}>
                            🔄 {t.restart}
                          </button>
                          <button className="mti-back-home-btn" onClick={closeApp}>
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
            <div className="mti-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="mti-screen-reflection" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
