import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './DesktopTextToVideoDemo.css';

// Assets
import demoLogo from '../../assets/whatsapp-demo-logo.png';
import closeIcon from '../../assets/demo-icons/Close_Cross_Circle.svg';
import callIcon from '../../assets/demo-icons/Call_Fill.svg';
import networkIcon from '../../assets/demo-icons/Network.svg';
import backwardIcon from '../../assets/demo-icons/Backward.svg';
import sunIcon from '../../assets/demo-icons/Sun_1_Fill.svg';
import musicIcon from '../../assets/demo-icons/music.svg';
import albumCover from '../../assets/demo-icons/The_Weeknd_-_Blinding_Lights.png';
import blindingLightsAudio from '../../assets/demo-icons/The Weeknd - Blinding Lights.mp3';

// Scenario icons
import cardIcon from '../../assets/demo-icons/Card_Fill.svg';
import pinIcon from '../../assets/demo-icons/Pin_Fill.svg';
import calendarIcon from '../../assets/demo-icons/Calendar_Plus.svg';
import handIcon from '../../assets/demo-icons/Hand_Sparcles_Fill.svg';

// Scenario icons mapping
const scenarioIcons: Record<string, string> = {
  'product-ad': cardIcon,
  'social-media': pinIcon,
  'explainer': calendarIcon,
  'lifestyle': handIcon
};

interface DesktopTextToVideoDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

// Generation steps
const generationSteps = [
  { key: 'analyzing', duration: 1500 },
  { key: 'creating', duration: 2500 },
  { key: 'rendering', duration: 3000 },
  { key: 'finalizing', duration: 1500 }
];

// Scenarios
const scenarios = {
  tr: {
    'product-ad': {
      icon: '🛍️',
      title: 'Ürün Reklamı',
      duration: '15s',
      style: 'Cinematic',
      prompt: 'Modern bir akıllı saat için sinematik reklam videosu oluştur. Siyah arka plan, yumuşak ışıklandırma, 360 derece dönüş efekti.'
    },
    'social-media': {
      icon: '📱',
      title: 'Sosyal Medya',
      duration: '10s',
      style: 'Trendy',
      prompt: 'Instagram için dikkat çekici bir kahve dükkanı tanıtım videosu. Sıcak tonlar, dinamik geçişler, metin animasyonları.'
    },
    'explainer': {
      icon: '📊',
      title: 'Açıklayıcı Video',
      duration: '30s',
      style: 'Minimalist',
      prompt: 'Yapay zeka teknolojisini anlatan minimalist bir açıklayıcı video. Düz renkler, ikon animasyonları, profesyonel ses.'
    },
    'lifestyle': {
      icon: '✨',
      title: 'Yaşam Tarzı',
      duration: '20s',
      style: 'Calm',
      prompt: 'Yoga ve meditasyon uygulaması için huzurlu bir tanıtım videosu. Doğa sahneleri, yumuşak müzik, sakinleştirici geçişler.'
    }
  },
  en: {
    'product-ad': {
      icon: '🛍️',
      title: 'Product Ad',
      duration: '15s',
      style: 'Cinematic',
      prompt: 'Create a cinematic ad video for a modern smartwatch. Black background, soft lighting, 360-degree rotation effect.'
    },
    'social-media': {
      icon: '📱',
      title: 'Social Media',
      duration: '10s',
      style: 'Trendy',
      prompt: 'Eye-catching coffee shop promo video for Instagram. Warm tones, dynamic transitions, text animations.'
    },
    'explainer': {
      icon: '📊',
      title: 'Explainer Video',
      duration: '30s',
      style: 'Minimalist',
      prompt: 'Minimalist explainer video about AI technology. Flat colors, icon animations, professional voiceover.'
    },
    'lifestyle': {
      icon: '✨',
      title: 'Lifestyle',
      duration: '20s',
      style: 'Calm',
      prompt: 'Peaceful promo video for yoga and meditation app. Nature scenes, soft music, calming transitions.'
    }
  }
};

const uiText = {
  tr: {
    selectScenario: 'Video Türü Seçin',
    prompt: 'Prompt',
    generating: 'Video Oluşturuluyor...',
    generatingDesc: 'AI videonuzu oluşturuyor',
    complete: 'Video Hazır!',
    duration: 'Süre',
    style: 'Stil',
    restart: 'Başka Video Oluştur',
    backToHome: 'Ana Ekrana Dön',
    analyzing: 'Prompt analiz ediliyor...',
    creating: 'Sahneler oluşturuluyor...',
    rendering: 'Video render ediliyor...',
    finalizing: 'Son rötuşlar yapılıyor...',
    tooltip: "Demo'yu Başlat!",
    weather: 'Hava Durumu',
    music: 'Müzik',
    playNow: 'Şimdi Çal',
    nowPlaying: 'Şimdi Çalıyor'
  },
  en: {
    selectScenario: 'Select Video Type',
    prompt: 'Prompt',
    generating: 'Generating Video...',
    generatingDesc: 'AI is creating your video',
    complete: 'Video Ready!',
    duration: 'Duration',
    style: 'Style',
    restart: 'Create Another Video',
    backToHome: 'Back to Home',
    analyzing: 'Analyzing prompt...',
    creating: 'Creating scenes...',
    rendering: 'Rendering video...',
    finalizing: 'Finalizing...',
    tooltip: 'Start Demo!',
    weather: 'Weather',
    music: 'Music',
    playNow: 'Play Now',
    nowPlaying: 'Now Playing'
  }
};

type DemoPhase = 'selecting' | 'typing' | 'generating' | 'complete';

export const DesktopTextToVideoDemo: React.FC<DesktopTextToVideoDemoProps> = ({
  language,
  onClose,
  onContactClick
}) => {
  const [entryTime] = useState(() => new Date());
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isAppOpen, setIsAppOpen] = useState(false);
  const [showScenarioScreen, setShowScenarioScreen] = useState(true);
  const [currentScenario, setCurrentScenario] = useState<string | null>(null);
  const [phase, setPhase] = useState<DemoPhase>('selecting');
  const [typedText, setTypedText] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
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

  // Entrance animation
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  // Set time and date
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
    document.body.classList.add('dtv-modal-open');
    return () => {
      document.body.classList.remove('dtv-modal-open');
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

  // Typing animation
  const startTypingAnimation = useCallback((text: string) => {
    let index = 0;
    setTypedText('');

    const typeChar = () => {
      if (index < text.length) {
        setTypedText(text.slice(0, index + 1));
        index++;
        timeoutRef.current = setTimeout(typeChar, 30 + Math.random() * 20);
      } else {
        timeoutRef.current = setTimeout(() => {
          setPhase('generating');
          startGenerationAnimation();
        }, 800);
      }
    };

    timeoutRef.current = setTimeout(typeChar, 500);
  }, []);

  // Generation animation
  const startGenerationAnimation = useCallback(() => {
    let stepIndex = 0;
    const totalDuration = generationSteps.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;

    const updateProgress = () => {
      if (stepIndex >= generationSteps.length) {
        setProgress(100);
        timeoutRef.current = setTimeout(() => {
          setPhase('complete');
        }, 500);
        return;
      }

      setCurrentStep(stepIndex);
      const stepProgress = (elapsed / totalDuration) * 100;
      setProgress(Math.min(stepProgress, 99));

      elapsed += 100;

      if (elapsed >= generationSteps.slice(0, stepIndex + 1).reduce((acc, s) => acc + s.duration, 0)) {
        stepIndex++;
      }

      timeoutRef.current = setTimeout(updateProgress, 100);
    };

    updateProgress();
  }, []);

  const openApp = () => {
    setIsAppOpen(true);
  };

  const closeApp = () => {
    setIsAppOpen(false);
    setShowScenarioScreen(true);
    setCurrentScenario(null);
    setPhase('selecting');
    setTypedText('');
    setProgress(0);
    setCurrentStep(0);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setIsMusicPlaying(false);
    setDynamicIslandState('collapsed');
    setTimeout(() => {
      if (onClose) onClose();
    }, 400);
  };

  const handleContactNavigation = () => {
    if (isClosing) return;
    setIsClosing(true);
    setIsMusicPlaying(false);
    setDynamicIslandState('collapsed');
    setTimeout(() => {
      if (onClose) onClose();
      setTimeout(() => {
        if (onContactClick) onContactClick();
      }, 100);
    }, 400);
  };

  const selectScenario = (scenarioKey: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowScenarioScreen(false);
    setCurrentScenario(scenarioKey);
    setPhase('typing');
    const scenario = scenarioData[scenarioKey as keyof typeof scenarioData];
    startTypingAnimation(scenario.prompt);
  };

  const goBack = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowScenarioScreen(true);
    setCurrentScenario(null);
    setPhase('selecting');
    setTypedText('');
    setProgress(0);
    setCurrentStep(0);
  };

  const restartDemo = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowScenarioScreen(true);
    setCurrentScenario(null);
    setPhase('selecting');
    setTypedText('');
    setProgress(0);
    setCurrentStep(0);
  };

  const getCurrentScenario = () => {
    if (!currentScenario) return null;
    return scenarioData[currentScenario as keyof typeof scenarioData];
  };

  const getPhoneTransform = () => {
    if (!isHovering) return 'rotateY(0deg) rotateX(0deg)';
    const rotateY = mousePosition.x * 6;
    const rotateX = -mousePosition.y * 4;
    return `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  };

  return createPortal(
    <div className={`dtv-overlay ${isVisible ? 'dtv-visible' : ''} ${isClosing ? 'dtv-closing' : ''}`} onClick={handleClose}>
      <div
        className={`dtv-iphone-container ${isVisible ? 'dtv-visible' : ''} ${isClosing ? 'dtv-closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div
          className="dtv-iphone-frame"
          ref={phoneRef}
          style={{ transform: getPhoneTransform() }}
        >
          {/* Side Buttons */}
          <div className="dtv-side-button dtv-silent-switch" />
          <div className="dtv-side-button dtv-volume-up" />
          <div className="dtv-side-button dtv-volume-down" />
          <div className="dtv-side-button dtv-power-button" />

          <div className="dtv-iphone-screen">
            {/* Wallpaper */}
            <div className="dtv-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`dtv-dynamic-island dtv-di-state-${dynamicIslandState}`}
              onClick={() => {
                if (dynamicIslandState === 'collapsed') {
                  setIsMusicPlaying(true);
                  setDynamicIslandState('expanded');
                } else if (dynamicIslandState === 'expanded' && isMusicPlaying && isAppOpen) {
                  setDynamicIslandState('compact');
                } else if (dynamicIslandState === 'compact') {
                  setDynamicIslandState('expanded');
                }
              }}
            >
              {/* Collapsed Content */}
              <div className="dtv-di-collapsed-content">
                <div className="dtv-di-camera" />
                <div className="dtv-di-sensor" />
              </div>

              {/* Compact Content */}
              <div className="dtv-di-compact-content">
                <div className="dtv-di-compact-left">
                  <div className="dtv-di-compact-album">
                    <img src={albumCover} alt="Album" className="dtv-di-album-img" />
                  </div>
                  <div className="dtv-di-compact-info">
                    <span className="dtv-di-compact-title">Blinding Lights</span>
                    <span className="dtv-di-compact-artist">The Weeknd</span>
                  </div>
                </div>
                <div className="dtv-di-compact-waves">
                  <div className="dtv-di-wave-bar" />
                  <div className="dtv-di-wave-bar" />
                  <div className="dtv-di-wave-bar" />
                </div>
              </div>

              {/* Expanded Content */}
              <div className="dtv-di-expanded-content">
                <div className="dtv-di-music-left">
                  <div className="dtv-di-album">
                    <img src={albumCover} alt="Album" className="dtv-di-album-img" />
                  </div>
                  <div className="dtv-di-track-info">
                    <h4>Blinding Lights</h4>
                    <p>The Weeknd</p>
                  </div>
                </div>
                <div className="dtv-di-music-right">
                  <div className="dtv-di-wave-bar" />
                  <div className="dtv-di-wave-bar" />
                  <div className="dtv-di-wave-bar" />
                  <div className="dtv-di-wave-bar" />
                  <div className="dtv-di-wave-bar" />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="dtv-status-bar">
              <div className="dtv-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="dtv-status-right">
                <div className="dtv-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <span className="dtv-5g">5G</span>
                <div className="dtv-battery">
                  <div className="dtv-battery-body">
                    <div className="dtv-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`dtv-home-screen ${isAppOpen ? 'dtv-hidden' : ''}`}>
              {/* Volume HUD */}
              <div className={`dtv-volume-hud ${showVolumeControl ? 'dtv-volume-hud-visible' : ''}`}>
                <div className="dtv-volume-hud-container">
                  <div className="dtv-volume-hud-icon">
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
                  <div className="dtv-volume-hud-slider">
                    <div className="dtv-volume-hud-track">
                      <div
                        className="dtv-volume-hud-fill"
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
                      className="dtv-volume-hud-input"
                    />
                  </div>
                </div>
              </div>

              {/* Time Widget */}
              <div className="dtv-time-widget">
                <div className="dtv-time">{currentTime}</div>
                <div className="dtv-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="dtv-widgets-container">
                <div className="dtv-widget dtv-widget-hover">
                  <div className="dtv-widget-header">
                    <div className="dtv-widget-icon">
                      <img src={sunIcon} alt="Weather" className="dtv-widget-icon-img" />
                    </div>
                    <span>{t.weather}</span>
                  </div>
                  <div className="dtv-weather-temp">18°</div>
                  <div className="dtv-weather-desc">{language === 'tr' ? 'Açık, H:22° L:14°' : 'Clear, H:72° L:57°'}</div>
                </div>
                <div
                  className="dtv-widget dtv-widget-hover"
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
                  <div className="dtv-widget-header">
                    <div className="dtv-widget-icon">
                      <img src={musicIcon} alt="Music" className="dtv-widget-icon-img" />
                    </div>
                    <span>{t.music}</span>
                  </div>
                  <div className="dtv-music-playing">
                    <div className="dtv-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="dtv-album-img" />
                    </div>
                    <div className="dtv-music-info">
                      <h4>{isMusicPlaying ? t.nowPlaying : t.playNow}</h4>
                      <p>Blinding Lights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="dtv-dock">
                <div className="dtv-dock-icon dtv-close-icon dtv-dock-hover" onClick={handleClose}>
                  <span className="dtv-close-tooltip">{language === 'tr' ? 'Çıkış' : 'Exit'} ✕</span>
                  <img src={closeIcon} alt="Close" className="dtv-close-img" />
                </div>
                <div className="dtv-dock-icon dtv-safari-icon dtv-dock-hover" onClick={handleContactNavigation}>
                  <span className="dtv-safari-tooltip">{language === 'tr' ? 'İletişime Geçin' : 'Contact Us'}</span>
                  <img src={networkIcon} alt="Contact" className="dtv-icon-img" />
                </div>
                <div className="dtv-dock-icon dtv-call-icon dtv-dock-hover" onClick={handleContactNavigation}>
                  <img src={callIcon} alt="Call" className="dtv-icon-img" />
                </div>
                <div className="dtv-dock-icon dtv-video-icon dtv-dock-hover" onClick={openApp}>
                  <span className="dtv-video-tooltip">{t.tooltip}</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Text-to-Video App */}
            <div className={`dtv-app ${isAppOpen ? 'dtv-active' : ''}`}>
              {/* Scenario Screen */}
              {showScenarioScreen && (
                <div className="dtv-scenario-screen">
                  <div className="dtv-scenario-header">
                    <div className="dtv-logo">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="dtv-info">
                      <h3>Allync AI</h3>
                      <p>{t.selectScenario}</p>
                    </div>
                    <button className="dtv-close-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="dtv-scenario-list">
                    {Object.entries(scenarioData).map(([key, scenario]) => (
                      <button
                        key={key}
                        className="dtv-scenario-item"
                        onClick={() => selectScenario(key)}
                      >
                        <div className={`dtv-scenario-icon-wrapper ${key}`}>
                          <img src={scenarioIcons[key]} alt={scenario.title} className="dtv-scenario-icon" />
                        </div>
                        <div className="dtv-text">
                          <h4>{scenario.title}</h4>
                          <p>{scenario.duration} • {scenario.style}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Demo Screen */}
              {!showScenarioScreen && (
                <div className="dtv-demo-screen">
                  <div className="dtv-demo-header">
                    <button className="dtv-back-btn" onClick={goBack}>
                      <img src={backwardIcon} alt="Back" className="dtv-back-img" />
                    </button>
                    <div className="dtv-profile">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="dtv-info">
                      <h3>Allync AI</h3>
                      <p>{getCurrentScenario()?.title}</p>
                    </div>
                    <button className="dtv-action-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="dtv-demo-content">
                    {/* Prompt Section */}
                    <div className="dtv-prompt-section">
                      <div className="dtv-prompt-label">
                        <span className="dtv-sparkle">✨</span>
                        {t.prompt}
                      </div>
                      <div className="dtv-prompt-box">
                        <p>
                          {typedText}
                          {phase === 'typing' && (
                            <span className="dtv-cursor" />
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Generating Phase */}
                    {phase === 'generating' && (
                      <div className="dtv-generating">
                        <div className="dtv-spinner">
                          <span className="dtv-sparkle-icon">✨</span>
                        </div>
                        <h4>{t.generating}</h4>
                        <p>{t.generatingDesc}</p>

                        <div className="dtv-progress-bar">
                          <div className="dtv-progress-fill" style={{ width: `${progress}%` }} />
                        </div>

                        <div className="dtv-steps">
                          {generationSteps.map((step, index) => (
                            <div
                              key={step.key}
                              className={`dtv-step ${index === currentStep ? 'dtv-active' : ''} ${index < currentStep ? 'dtv-done' : ''}`}
                            >
                              <div className="dtv-step-indicator">
                                {index < currentStep ? '✓' : index === currentStep ? '●' : '○'}
                              </div>
                              <span>{t[step.key as keyof typeof t]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Complete Phase */}
                    {phase === 'complete' && (
                      <div className="dtv-complete">
                        <div className="dtv-success-badge">✓</div>
                        <h4>{t.complete}</h4>

                        {/* Video Placeholder */}
                        <div className="dtv-video-placeholder">
                          <div className="dtv-video-icon-box">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                              <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z"/>
                            </svg>
                          </div>
                          <p>Video Preview</p>
                          <span>{getCurrentScenario()?.duration} • {getCurrentScenario()?.style}</span>
                        </div>

                        {/* Video Info */}
                        <div className="dtv-video-info">
                          <div className="dtv-info-box">
                            <span className="dtv-info-label">{t.duration}</span>
                            <span className="dtv-info-value">{getCurrentScenario()?.duration}</span>
                          </div>
                          <div className="dtv-info-box">
                            <span className="dtv-info-label">{t.style}</span>
                            <span className="dtv-info-value">{getCurrentScenario()?.style}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="dtv-demo-actions">
                          <button className="dtv-restart-btn" onClick={restartDemo}>
                            🔄 {t.restart}
                          </button>
                          <button className="dtv-home-btn" onClick={closeApp}>
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
            <div className="dtv-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="dtv-screen-reflection" />
          </div>
        </div>

        {/* Click outside hint */}
        <div className="dtv-hint">
          {language === 'tr' ? 'Kapatmak için dışarı tıklayın' : 'Click outside to close'}
        </div>
      </div>
    </div>,
    document.body
  );
};
