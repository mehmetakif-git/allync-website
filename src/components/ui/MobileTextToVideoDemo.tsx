import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './MobileTextToVideoDemo.css';

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

interface MobileTextToVideoDemoProps {
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

// Scenarios - Text to Video
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

export const MobileTextToVideoDemo: React.FC<MobileTextToVideoDemoProps> = ({
  language,
  onClose,
  onContactClick
}) => {
  // Entry time
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
    document.body.classList.add('mtv-modal-open');
    return () => {
      document.body.classList.remove('mtv-modal-open');
    };
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
    setIsMusicPlaying(false);
    setDynamicIslandState('collapsed');
    if (onClose) onClose();
  };

  const handleContactNavigation = () => {
    setIsMusicPlaying(false);
    setDynamicIslandState('collapsed');
    if (onClose) onClose();
    setTimeout(() => {
      if (onContactClick) onContactClick();
    }, 100);
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

  return createPortal(
    <div className="mtv-overlay">
      <div className="mtv-iphone-container">
        {/* iPhone Frame */}
        <div className="mtv-iphone-frame">
          {/* Side Buttons */}
          <div className="mtv-side-button mtv-silent-switch" />
          <div className="mtv-side-button mtv-volume-up" />
          <div className="mtv-side-button mtv-volume-down" />
          <div className="mtv-side-button mtv-power-button" />

          {/* Screen */}
          <div className="mtv-iphone-screen">
            {/* Wallpaper */}
            <div className="mtv-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`mtv-dynamic-island mtv-di-state-${dynamicIslandState}`}
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
              <div className="mtv-di-collapsed-content">
                <div className="mtv-di-camera" />
                <div className="mtv-di-sensor" />
              </div>

              {/* Compact Content */}
              <div className="mtv-di-compact-content">
                <div className="mtv-di-compact-left">
                  <div className="mtv-di-compact-album">
                    <img src={albumCover} alt="Album" className="mtv-di-album-img" />
                  </div>
                  <div className="mtv-di-compact-info">
                    <span className="mtv-di-compact-title">Blinding Lights</span>
                    <span className="mtv-di-compact-artist">The Weeknd</span>
                  </div>
                </div>
                <div className="mtv-di-compact-waves">
                  <div className="mtv-di-wave-bar" />
                  <div className="mtv-di-wave-bar" />
                  <div className="mtv-di-wave-bar" />
                </div>
              </div>

              {/* Expanded Content */}
              <div className="mtv-di-expanded-content">
                <div className="mtv-di-music-left">
                  <div className="mtv-di-album">
                    <img src={albumCover} alt="Album" className="mtv-di-album-img" />
                  </div>
                  <div className="mtv-di-track-info">
                    <h4>Blinding Lights</h4>
                    <p>The Weeknd</p>
                  </div>
                </div>
                <div className="mtv-di-music-right">
                  <div className="mtv-di-wave-bar" />
                  <div className="mtv-di-wave-bar" />
                  <div className="mtv-di-wave-bar" />
                  <div className="mtv-di-wave-bar" />
                  <div className="mtv-di-wave-bar" />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mtv-status-bar">
              <div className="mtv-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="mtv-status-right">
                <div className="mtv-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <span className="mtv-5g">5G</span>
                <div className="mtv-battery">
                  <div className="mtv-battery-body">
                    <div className="mtv-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`mtv-home-screen ${isAppOpen ? 'mtv-hidden' : ''}`}>
              {/* Volume HUD */}
              <div className={`mtv-volume-hud ${showVolumeControl ? 'mtv-volume-hud-visible' : ''}`}>
                <div className="mtv-volume-hud-container">
                  <div className="mtv-volume-hud-icon">
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
                  <div className="mtv-volume-hud-slider">
                    <div className="mtv-volume-hud-track">
                      <div
                        className="mtv-volume-hud-fill"
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
                      className="mtv-volume-hud-input"
                    />
                  </div>
                </div>
              </div>

              {/* Time Widget */}
              <div className="mtv-time-widget">
                <div className="mtv-time">{currentTime}</div>
                <div className="mtv-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="mtv-widgets-container">
                <div className="mtv-widget">
                  <div className="mtv-widget-header">
                    <div className="mtv-widget-icon mtv-weather-icon">
                      <img src={sunIcon} alt="Weather" className="mtv-widget-icon-img" />
                    </div>
                    <span>{t.weather}</span>
                  </div>
                  <div className="mtv-weather-temp">18°</div>
                  <div className="mtv-weather-desc">{language === 'tr' ? 'Açık, H:22° L:14°' : 'Clear, H:72° L:57°'}</div>
                </div>
                <div
                  className="mtv-widget"
                  onClick={() => {
                    if (!isMusicPlaying) {
                      setIsMusicPlaying(true);
                      setDynamicIslandState('expanded');
                    } else {
                      setIsMusicPlaying(false);
                      setDynamicIslandState('collapsed');
                    }
                  }}
                >
                  <div className="mtv-widget-header">
                    <div className="mtv-widget-icon mtv-music-icon">
                      <img src={musicIcon} alt="Music" className="mtv-widget-icon-img" />
                    </div>
                    <span>{t.music}</span>
                  </div>
                  <div className="mtv-music-playing">
                    <div className="mtv-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="mtv-album-img" />
                    </div>
                    <div className="mtv-music-info">
                      <h4>{isMusicPlaying ? t.nowPlaying : t.playNow}</h4>
                      <p>Blinding Lights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="mtv-dock">
                <div className="mtv-dock-icon mtv-close-icon" onClick={handleClose}>
                  <span className="mtv-close-tooltip">{language === 'tr' ? 'Çıkış' : 'Exit'} ✕</span>
                  <img src={closeIcon} alt="Close" className="mtv-close-img" />
                </div>
                <div className="mtv-dock-icon mtv-network-icon" onClick={handleContactNavigation}>
                  <img src={networkIcon} alt="Contact" className="mtv-icon-img" />
                </div>
                <div className="mtv-dock-icon mtv-call-icon" onClick={handleContactNavigation}>
                  <img src={callIcon} alt="Call" className="mtv-icon-img" />
                </div>
                <div className="mtv-dock-icon mtv-app-icon" onClick={openApp}>
                  <span className="mtv-app-tooltip">{t.tooltip} 🚀</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Text-to-Video App */}
            <div className={`mtv-app ${isAppOpen ? 'mtv-active' : ''}`}>
              {/* Scenario Screen */}
              {showScenarioScreen && (
                <div className="mtv-scenario-screen">
                  <div className="mtv-scenario-header">
                    <div className="mtv-logo">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="mtv-info">
                      <h3>Allync AI</h3>
                      <p>{t.selectScenario}</p>
                    </div>
                    <button className="mtv-close-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="mtv-scenario-list">
                    {Object.entries(scenarioData).map(([key, scenario]) => (
                      <button
                        key={key}
                        className="mtv-scenario-item"
                        onClick={() => selectScenario(key)}
                      >
                        <div className={`mtv-scenario-icon-wrapper ${key}`}>
                          <img src={scenarioIcons[key]} alt={scenario.title} className="mtv-scenario-icon" />
                        </div>
                        <div className="mtv-text">
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
                <div className="mtv-demo-screen">
                  <div className="mtv-demo-header">
                    <button className="mtv-back-btn" onClick={goBack}>
                      <img src={backwardIcon} alt="Back" className="mtv-back-img" />
                    </button>
                    <div className="mtv-profile">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="mtv-info">
                      <h3>Allync AI</h3>
                      <p>{getCurrentScenario()?.title}</p>
                    </div>
                    <button className="mtv-action-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="mtv-demo-content">
                    {/* Prompt Section */}
                    <div className="mtv-prompt-section">
                      <div className="mtv-prompt-label">
                        <span className="mtv-sparkle">✨</span>
                        {t.prompt}
                      </div>
                      <div className="mtv-prompt-box">
                        <p>
                          {typedText}
                          {phase === 'typing' && (
                            <span className="mtv-cursor" />
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Generating Phase */}
                    {phase === 'generating' && (
                      <div className="mtv-generating">
                        <div className="mtv-spinner">
                          <span className="mtv-sparkle-icon">✨</span>
                        </div>
                        <h4>{t.generating}</h4>
                        <p>{t.generatingDesc}</p>

                        <div className="mtv-progress-bar">
                          <div className="mtv-progress-fill" style={{ width: `${progress}%` }} />
                        </div>

                        <div className="mtv-steps">
                          {generationSteps.map((step, index) => (
                            <div
                              key={step.key}
                              className={`mtv-step ${index === currentStep ? 'mtv-active' : ''} ${index < currentStep ? 'mtv-done' : ''}`}
                            >
                              <div className="mtv-step-indicator">
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
                      <div className="mtv-complete">
                        <div className="mtv-success-badge">✓</div>
                        <h4>{t.complete}</h4>

                        {/* Video Placeholder */}
                        <div className="mtv-video-placeholder">
                          <div className="mtv-video-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                              <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z"/>
                            </svg>
                          </div>
                          <p>Video Preview</p>
                          <span>{getCurrentScenario()?.duration} • {getCurrentScenario()?.style}</span>
                        </div>

                        {/* Video Info */}
                        <div className="mtv-video-info">
                          <div className="mtv-info-box">
                            <span className="mtv-info-label">{t.duration}</span>
                            <span className="mtv-info-value">{getCurrentScenario()?.duration}</span>
                          </div>
                          <div className="mtv-info-box">
                            <span className="mtv-info-label">{t.style}</span>
                            <span className="mtv-info-value">{getCurrentScenario()?.style}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mtv-demo-actions">
                          <button className="mtv-restart-btn" onClick={restartDemo}>
                            🔄 {t.restart}
                          </button>
                          <button className="mtv-home-btn" onClick={closeApp}>
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
            <div className="mtv-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="mtv-screen-reflection" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
