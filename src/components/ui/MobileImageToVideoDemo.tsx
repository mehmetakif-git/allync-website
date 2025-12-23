import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './MobileImageToVideoDemo.css';

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

// Senaryo sonuç videoları (mp4 veya gif)
const scenarioVideos: Record<string, string> = {
  'product-showcase': '/videos/image-to-video/product-showcase.webm',
  'portrait-alive': '/videos/image-to-video/portrait-alive.webm',
  'social-motion': '/videos/image-to-video/social-motion.webm',
  'art-illustration': '/videos/image-to-video/art-illustration.webm'
};

interface MobileImageToVideoDemoProps {
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

export const MobileImageToVideoDemo: React.FC<MobileImageToVideoDemoProps> = ({
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
    document.body.classList.add('miv-modal-open');
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.classList.remove('miv-modal-open');
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
    setDemoPhase('preview');
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
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
    document.body.classList.remove('miv-modal-open');
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

  return createPortal(
    <div className="miv-overlay">
      <div className="miv-iphone-container">
        <div className="miv-iphone-frame">
          {/* Side Buttons */}
          <div className="miv-side-button miv-silent-switch" />
          <div className="miv-side-button miv-volume-up" />
          <div className="miv-side-button miv-volume-down" />
          <div className="miv-side-button miv-power-button" />

          <div className="miv-iphone-screen">
            {/* Wallpaper */}
            <div className="miv-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`miv-dynamic-island miv-di-state-${dynamicIslandState}`}
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
              <div className="miv-di-collapsed-content">
                <div className="miv-di-camera" />
                <div className="miv-di-sensor" />
              </div>

              {/* Compact Content */}
              <div className="miv-di-compact-content">
                <div className="miv-di-compact-left">
                  <div className="miv-di-compact-album">
                    <img src={albumCover} alt="Album" className="miv-di-album-img" />
                  </div>
                  <div className="miv-di-compact-info">
                    <span className="miv-di-compact-title">Blinding Lights</span>
                    <span className="miv-di-compact-artist">The Weeknd</span>
                  </div>
                </div>
                <div className="miv-di-compact-waves">
                  <div className="miv-di-wave-bar" />
                  <div className="miv-di-wave-bar" />
                  <div className="miv-di-wave-bar" />
                </div>
              </div>

              {/* Expanded Content */}
              <div className="miv-di-expanded-content">
                <div className="miv-di-music-left">
                  <div className="miv-di-album">
                    <img src={albumCover} alt="Album" className="miv-di-album-img" />
                  </div>
                  <div className="miv-di-track-info">
                    <h4>Blinding Lights</h4>
                    <p>The Weeknd</p>
                  </div>
                </div>
                <div className="miv-di-music-right">
                  <div className="miv-di-wave-bar" />
                  <div className="miv-di-wave-bar" />
                  <div className="miv-di-wave-bar" />
                  <div className="miv-di-wave-bar" />
                  <div className="miv-di-wave-bar" />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="miv-status-bar">
              <div className="miv-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="miv-status-right">
                <div className="miv-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <span className="miv-5g">5G</span>
                <div className="miv-battery">
                  <div className="miv-battery-body">
                    <div className="miv-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`miv-home-screen ${isAppOpen ? 'miv-hidden' : ''}`}>
              {/* Volume HUD */}
              <div className={`miv-volume-hud ${showVolumeControl ? 'miv-volume-hud-visible' : ''}`}>
                <div className="miv-volume-hud-container">
                  <div className="miv-volume-hud-icon">
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
                  <div className="miv-volume-hud-slider">
                    <div className="miv-volume-hud-track">
                      <div
                        className="miv-volume-hud-fill"
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
                      className="miv-volume-hud-input"
                    />
                  </div>
                </div>
              </div>

              {/* Time Widget */}
              <div className="miv-time-widget">
                <div className="miv-time">{currentTime}</div>
                <div className="miv-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="miv-widgets-container">
                <div className="miv-widget">
                  <div className="miv-widget-header">
                    <div className="miv-widget-icon miv-weather-icon">
                      <img src={sunIcon} alt="Weather" className="miv-widget-icon-img" />
                    </div>
                    <span>{t.weather}</span>
                  </div>
                  <div className="miv-weather-temp">18°</div>
                  <div className="miv-weather-desc">{language === 'tr' ? 'Açık, H:22° L:14°' : 'Clear, H:72° L:57°'}</div>
                </div>
                <div
                  className="miv-widget"
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
                  <div className="miv-widget-header">
                    <div className="miv-widget-icon miv-music-icon">
                      <img src={musicIcon} alt="Music" className="miv-widget-icon-img" />
                    </div>
                    <span>{t.music}</span>
                  </div>
                  <div className="miv-music-playing">
                    <div className="miv-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="miv-album-img" />
                    </div>
                    <div className="miv-music-info">
                      <h4>{isMusicPlaying ? t.nowPlaying : t.playNow}</h4>
                      <p>Blinding Lights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="miv-dock">
                <div className="miv-dock-icon miv-close-icon" onClick={handleClose}>
                  <span className="miv-close-tooltip">{language === 'tr' ? 'Çıkış' : 'Exit'} ✕</span>
                  <img src={closeIcon} alt="Close" className="miv-close-img" />
                </div>
                <div className="miv-dock-icon miv-network-icon" onClick={handleContactNavigation}>
                  <img src={networkIcon} alt="Network" className="miv-icon-img" />
                </div>
                <div className="miv-dock-icon miv-call-icon" onClick={handleContactNavigation}>
                  <img src={callOutlineIcon} alt="Call" className="miv-icon-img" />
                </div>
                <div className="miv-dock-icon miv-app-icon" onClick={openApp}>
                  <span className="miv-app-tooltip">{t.tooltip}</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polygon points="5,3 19,12 5,21" fill="white" stroke="none" />
                  </svg>
                </div>
              </div>
            </div>

            {/* App */}
            <div className={`miv-app ${isAppOpen ? 'miv-active' : ''}`}>
              {/* Scenario Screen */}
              {showScenarioScreen && (
                <div className="miv-scenario-screen">
                  <div className="miv-scenario-header">
                    <div className="miv-logo">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="miv-info">
                      <h3>Allync AI</h3>
                      <p>{t.selectScenario}</p>
                    </div>
                    <button className="miv-close-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="miv-scenario-list">
                    {Object.entries(scenarioData).map(([key, scenario]) => (
                      <button
                        key={key}
                        className="miv-scenario-item"
                        onClick={() => selectScenario(key)}
                      >
                        <div className={`miv-scenario-icon-wrapper ${key}`}>
                          <img src={scenarioIcons[key]} alt={scenario.title} className="miv-scenario-icon" />
                        </div>
                        <div className="miv-text">
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
                <div className="miv-demo-screen">
                  <div className="miv-demo-header">
                    <button className="miv-back-btn" onClick={goBack}>
                      <img src={backwardIcon} alt="Back" className="miv-back-img" />
                    </button>
                    <div className="miv-profile">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="miv-info">
                      <h3>Allync AI</h3>
                      <p>{scenarioData[currentScenario as keyof typeof scenarioData].title}</p>
                    </div>
                    <button className="miv-action-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="miv-demo-content">
                    {/* Preview Phase */}
                    {demoPhase === 'preview' && (
                      <>
                        {/* Source Image Preview */}
                        <div className="miv-source-section">
                          <div className="miv-source-label">
                            <span className="miv-sparkle">🖼️</span> {language === 'tr' ? 'Kaynak Görsel' : 'Source Image'}
                          </div>
                          <div className="miv-source-preview">
                            <img
                              src={scenarioImages[currentScenario]}
                              alt="Source"
                              className="miv-source-image"
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div className="miv-prompt-section">
                          <div className="miv-prompt-label">
                            <span className="miv-sparkle">✨</span> {t.prompt}
                          </div>
                          <div className="miv-prompt-box">
                            <p>{scenarioData[currentScenario as keyof typeof scenarioData].prompt}</p>
                          </div>
                        </div>

                        {/* Info Tags */}
                        <div className="miv-info-tags">
                          <div className="miv-info-tag">
                            <span className="miv-info-label">{t.type}</span>
                            <span className="miv-info-value">{scenarioData[currentScenario as keyof typeof scenarioData].animationType}</span>
                          </div>
                          <div className="miv-info-tag">
                            <span className="miv-info-label">{t.duration}</span>
                            <span className="miv-info-value">{scenarioData[currentScenario as keyof typeof scenarioData].duration}</span>
                          </div>
                        </div>

                        {/* Start Button */}
                        <button className="miv-start-btn" onClick={startAnimation}>
                          🎬 {language === 'tr' ? 'Animate Et' : 'Animate'}
                        </button>
                      </>
                    )}

                    {/* Animating Phase */}
                    {demoPhase === 'animating' && (
                      <div className="miv-generation">
                        <div className="miv-gen-preview">
                          <img
                            src={scenarioImages[currentScenario]}
                            alt="Animating"
                            className="miv-animating-image"
                          />
                          <div className="miv-scan-line" />
                        </div>
                        <div className="miv-gen-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="5,3 19,12 5,21" />
                          </svg>
                        </div>
                        <h4>{t.animating}</h4>
                        <div className="miv-progress-bar">
                          <div className="miv-progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="miv-steps">
                          {animationSteps.map((step, index) => (
                            <div
                              key={step}
                              className={`miv-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                            >
                              <div className="miv-step-indicator">
                                {index < currentStep ? (
                                  <img src={checkIcon} alt="Done" />
                                ) : index === currentStep ? (
                                  <div className="miv-step-dot active" />
                                ) : (
                                  <div className="miv-step-dot" />
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
                      <div className="miv-complete">
                        <div className="miv-success-icon">
                          <img src={checkIcon} alt="Success" />
                        </div>
                        <h4>{t.complete}</h4>

                        {/* Video Preview */}
                        <div className="miv-video-preview">
                          <video
                            src={scenarioVideos[currentScenario as keyof typeof scenarioVideos]}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="miv-result-video"
                          />
                          <div className="miv-play-indicator">
                            <div className="miv-play-dot" />
                            {language === 'tr' ? 'Canlı' : 'Live'}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="miv-video-info">
                          <div className="miv-info-item">
                            <span className="miv-info-label">{t.type}</span>
                            <span className="miv-info-value">{scenarioData[currentScenario as keyof typeof scenarioData].animationType}</span>
                          </div>
                          <div className="miv-info-item">
                            <span className="miv-info-label">{t.duration}</span>
                            <span className="miv-info-value">{scenarioData[currentScenario as keyof typeof scenarioData].duration}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="miv-demo-actions">
                          <button className="miv-restart-btn" onClick={restartDemo}>
                            🔄 {t.restart}
                          </button>
                          <button className="miv-back-home-btn" onClick={closeApp}>
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
            <div className="miv-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="miv-screen-reflection" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
