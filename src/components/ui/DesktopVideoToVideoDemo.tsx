import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './DesktopVideoToVideoDemo.css';

// Assets
import demoLogo from '../../assets/whatsapp-demo-logo.png';
import closeIcon from '../../assets/demo-icons/Close_Cross_Circle.svg';
import networkIcon from '../../assets/demo-icons/Network.svg';
import backwardIcon from '../../assets/demo-icons/Backward.svg';
import callIcon from '../../assets/demo-icons/Call_Fill.svg';
import sunIcon from '../../assets/demo-icons/Sun_1_Fill.svg';
import musicIcon from '../../assets/demo-icons/music.svg';
import albumCover from '../../assets/demo-icons/The_Weeknd_-_Blinding_Lights.png';
import blindingLightsAudio from '../../assets/demo-icons/The Weeknd - Blinding Lights.mp3';
import checkIcon from '../../assets/demo-icons/Check.svg';
import cardIcon from '../../assets/demo-icons/Card_Fill.svg';
import pinIcon from '../../assets/demo-icons/Pin_Fill.svg';
import handIcon from '../../assets/demo-icons/Hand_Sparcles_Fill.svg';
import calendarIcon from '../../assets/demo-icons/Calendar_Plus.svg';

// Scenario icons mapping
const scenarioIcons: Record<string, string> = {
  'style-transfer': cardIcon,
  'video-enhance': calendarIcon,
  'background-replace': pinIcon,
  'colorize': handIcon
};

interface DesktopVideoToVideoDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

// Scenarios
const scenarios = {
  tr: {
    'style-transfer': {
      title: 'Stil Transferi',
      desc: 'Video stilini dönüştür',
      prompt: 'Videonun stilini anime/çizgi film tarzına dönüştür.',
      transformationType: 'Style Transfer',
      processingTime: '~8s',
      beforeLabel: 'Orijinal Video',
      afterLabel: 'Anime Stili'
    },
    'video-enhance': {
      title: 'Video İyileştirme',
      desc: 'Kalite artırma',
      prompt: 'Düşük çözünürlüklü videoyu 4K kalitesine yükselt.',
      transformationType: 'Enhancement',
      processingTime: '~6s',
      beforeLabel: 'Düşük Kalite',
      afterLabel: 'Yüksek Kalite'
    },
    'background-replace': {
      title: 'Arka Plan Değiştirme',
      desc: 'Sanal arka plan',
      prompt: 'Video arka planını tropik plaj manzarasıyla değiştir.',
      transformationType: 'Background Replace',
      processingTime: '~5s',
      beforeLabel: 'Orijinal Arka Plan',
      afterLabel: 'Yeni Arka Plan'
    },
    'colorize': {
      title: 'Renklendirme',
      desc: 'S/B videoyu renklendir',
      prompt: 'Siyah beyaz videoyu doğal renklerle canlandır.',
      transformationType: 'Colorization',
      processingTime: '~7s',
      beforeLabel: 'Siyah Beyaz',
      afterLabel: 'Renkli'
    }
  },
  en: {
    'style-transfer': {
      title: 'Style Transfer',
      desc: 'Transform video style',
      prompt: 'Transform the video style to anime/cartoon style.',
      transformationType: 'Style Transfer',
      processingTime: '~8s',
      beforeLabel: 'Original Video',
      afterLabel: 'Anime Style'
    },
    'video-enhance': {
      title: 'Video Enhancement',
      desc: 'Quality upscaling',
      prompt: 'Upscale low resolution video to 4K quality.',
      transformationType: 'Enhancement',
      processingTime: '~6s',
      beforeLabel: 'Low Quality',
      afterLabel: 'High Quality'
    },
    'background-replace': {
      title: 'Background Replace',
      desc: 'Virtual background',
      prompt: 'Replace video background with tropical beach scenery.',
      transformationType: 'Background Replace',
      processingTime: '~5s',
      beforeLabel: 'Original Background',
      afterLabel: 'New Background'
    },
    'colorize': {
      title: 'Colorization',
      desc: 'Colorize B/W video',
      prompt: 'Bring black and white video to life with natural colors.',
      transformationType: 'Colorization',
      processingTime: '~7s',
      beforeLabel: 'Black & White',
      afterLabel: 'Colorized'
    }
  }
};

const uiText = {
  tr: {
    selectScenario: 'Dönüşüm Türü Seçin',
    prompt: 'Açıklama',
    processing: 'İşleniyor...',
    processingDesc: 'Video dönüştürülüyor...',
    complete: 'Dönüşüm Tamamlandı!',
    restart: 'Başka Video Dönüştür',
    backToHome: 'Ana Ekrana Dön',
    tooltip: "Demo'yu Başlat!",
    weather: 'Hava Durumu',
    music: 'Müzik',
    playNow: 'Şimdi Çal',
    nowPlaying: 'Şimdi Çalıyor',
    analyzing: 'Video analiz ediliyor...',
    detecting: 'Kareler tespit ediliyor...',
    transforming: 'Dönüşüm uygulanıyor...',
    rendering: 'Video render ediliyor...',
    type: 'Tür',
    time: 'Süre',
    before: 'Önce',
    after: 'Sonra',
    startTransform: 'Dönüştür'
  },
  en: {
    selectScenario: 'Select Transformation Type',
    prompt: 'Description',
    processing: 'Processing...',
    processingDesc: 'Transforming video...',
    complete: 'Transformation Complete!',
    restart: 'Transform Another Video',
    backToHome: 'Back to Home',
    tooltip: 'Start Demo!',
    weather: 'Weather',
    music: 'Music',
    playNow: 'Play Now',
    nowPlaying: 'Now Playing',
    analyzing: 'Analyzing video...',
    detecting: 'Detecting frames...',
    transforming: 'Applying transformation...',
    rendering: 'Rendering video...',
    type: 'Type',
    time: 'Duration',
    before: 'Before',
    after: 'After',
    startTransform: 'Transform'
  }
};

// Processing steps
const processingSteps = ['analyzing', 'detecting', 'transforming', 'rendering'];

export const DesktopVideoToVideoDemo: React.FC<DesktopVideoToVideoDemoProps> = ({
  language,
  onClose,
  onContactClick
}) => {
  // Entry time (once)
  const [entryTime] = useState(() => new Date());
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isAppOpen, setIsAppOpen] = useState(false);
  const [showScenarioScreen, setShowScenarioScreen] = useState(true);
  const [currentScenario, setCurrentScenario] = useState<string | null>(null);
  const [demoPhase, setDemoPhase] = useState<'preview' | 'processing' | 'complete'>('preview');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
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
  const sliderRef = useRef<HTMLDivElement>(null);

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

  // Set time and date based on entry time
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
    document.body.classList.add('dvv-modal-open');

    return () => {
      document.body.classList.remove('dvv-modal-open');
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
    setSliderPosition(50);
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
    setSliderPosition(50);
  };

  const startTransformation = () => {
    setDemoPhase('processing');

    let stepIndex = 0;
    let progressValue = 0;

    const updateProgress = () => {
      if (stepIndex >= processingSteps.length) {
        setProgress(100);
        timeoutRef.current = setTimeout(() => {
          setDemoPhase('complete');
          animateSlider();
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

  // Animate slider back and forth
  const animateSlider = () => {
    let pos = 50;
    let direction = 1;
    let cycles = 0;
    const maxCycles = 2;

    const animate = () => {
      pos += direction * 2;
      if (pos >= 85) {
        direction = -1;
      } else if (pos <= 15) {
        direction = 1;
        cycles++;
      }
      if (cycles >= maxCycles) {
        setSliderPosition(50);
        return;
      }
      setSliderPosition(pos);
      timeoutRef.current = setTimeout(animate, 30);
    };

    timeoutRef.current = setTimeout(animate, 500);
  };

  const goBack = () => {
    setShowScenarioScreen(true);
    setCurrentScenario(null);
    setDemoPhase('preview');
    setCurrentStep(0);
    setProgress(0);
    setSliderPosition(50);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const restartDemo = () => {
    setShowScenarioScreen(true);
    setCurrentScenario(null);
    setDemoPhase('preview');
    setCurrentStep(0);
    setProgress(0);
    setSliderPosition(50);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Slider drag handling
  const handleSliderMouseDown = () => setIsDragging(true);
  const handleSliderMouseUp = () => setIsDragging(false);
  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current || !isDragging) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  // Calculate 3D transform based on mouse position
  const getPhoneTransform = () => {
    if (!isHovering) return 'rotateY(0deg) rotateX(0deg)';
    const rotateY = mousePosition.x * 6;
    const rotateX = -mousePosition.y * 4;
    return `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  };

  return createPortal(
    <div className={`dvv-overlay ${isVisible ? 'dvv-visible' : ''} ${isClosing ? 'dvv-closing' : ''}`} onClick={handleClose}>
      <div
        className={`dvv-iphone-container ${isVisible ? 'dvv-visible' : ''} ${isClosing ? 'dvv-closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >

        <div
          className="dvv-iphone-frame"
          ref={phoneRef}
          style={{ transform: getPhoneTransform() }}
        >
          {/* Side Buttons */}
          <div className="dvv-side-button dvv-silent-switch" />
          <div className="dvv-side-button dvv-volume-up" />
          <div className="dvv-side-button dvv-volume-down" />
          <div className="dvv-side-button dvv-power-button" />

          <div className="dvv-iphone-screen">
            {/* Wallpaper */}
            <div className="dvv-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`dvv-dynamic-island dvv-di-state-${dynamicIslandState}`}
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
              <div className="dvv-di-collapsed-content">
                <div className="dvv-di-camera" />
                <div className="dvv-di-sensor" />
              </div>

              {/* Compact Content */}
              <div className="dvv-di-compact-content">
                <div className="dvv-di-compact-left">
                  <div className="dvv-di-compact-album">
                    <img src={albumCover} alt="Album" className="dvv-di-album-img" />
                  </div>
                  <div className="dvv-di-compact-info">
                    <span className="dvv-di-compact-title">Blinding Lights</span>
                    <span className="dvv-di-compact-artist">The Weeknd</span>
                  </div>
                </div>
                <div className="dvv-di-compact-waves">
                  <div className="dvv-di-wave-bar" />
                  <div className="dvv-di-wave-bar" />
                  <div className="dvv-di-wave-bar" />
                </div>
              </div>

              {/* Expanded Content */}
              <div className="dvv-di-expanded-content">
                <div className="dvv-di-music-left">
                  <div className="dvv-di-album">
                    <img src={albumCover} alt="Album" className="dvv-di-album-img" />
                  </div>
                  <div className="dvv-di-track-info">
                    <h4>Blinding Lights</h4>
                    <p>The Weeknd</p>
                  </div>
                </div>
                <div className="dvv-di-music-right">
                  <div className="dvv-di-wave-bar" />
                  <div className="dvv-di-wave-bar" />
                  <div className="dvv-di-wave-bar" />
                  <div className="dvv-di-wave-bar" />
                  <div className="dvv-di-wave-bar" />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="dvv-status-bar">
              <div className="dvv-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="dvv-status-right">
                <div className="dvv-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <span className="dvv-5g">5G</span>
                <div className="dvv-battery">
                  <div className="dvv-battery-body">
                    <div className="dvv-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`dvv-home-screen ${isAppOpen ? 'dvv-hidden' : ''}`}>
              {/* Volume HUD */}
              <div className={`dvv-volume-hud ${showVolumeControl ? 'dvv-volume-hud-visible' : ''}`}>
                <div className="dvv-volume-hud-container">
                  <div className="dvv-volume-hud-icon">
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
                  <div className="dvv-volume-hud-slider">
                    <div className="dvv-volume-hud-track">
                      <div
                        className="dvv-volume-hud-fill"
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
                      className="dvv-volume-hud-input"
                    />
                  </div>
                </div>
              </div>

              {/* Time Widget */}
              <div className="dvv-time-widget">
                <div className="dvv-time">{currentTime}</div>
                <div className="dvv-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="dvv-widgets-container">
                <div className="dvv-widget dvv-widget-hover">
                  <div className="dvv-widget-header">
                    <div className="dvv-widget-icon dvv-weather-icon">
                      <img src={sunIcon} alt="Weather" className="dvv-widget-icon-img" />
                    </div>
                    <span>{t.weather}</span>
                  </div>
                  <div className="dvv-weather-temp">18°</div>
                  <div className="dvv-weather-desc">{language === 'tr' ? 'Açık, H:22° L:14°' : 'Clear, H:72° L:57°'}</div>
                </div>
                <div
                  className="dvv-widget dvv-widget-hover"
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
                  <div className="dvv-widget-header">
                    <div className="dvv-widget-icon dvv-music-icon">
                      <img src={musicIcon} alt="Music" className="dvv-widget-icon-img" />
                    </div>
                    <span>{t.music}</span>
                  </div>
                  <div className="dvv-music-playing">
                    <div className="dvv-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="dvv-album-img" />
                    </div>
                    <div className="dvv-music-info">
                      <h4>{isMusicPlaying ? t.nowPlaying : t.playNow}</h4>
                      <p>Blinding Lights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="dvv-dock">
                <div className="dvv-dock-icon dvv-close-icon dvv-dock-hover" onClick={handleClose}>
                  <span className="dvv-close-tooltip">{language === 'tr' ? 'Çıkış' : 'Exit'} ✕</span>
                  <img src={closeIcon} alt="Close" className="dvv-close-img" />
                </div>
                <div className="dvv-dock-icon dvv-network-icon dvv-dock-hover" onClick={handleContactNavigation}>
                  <span className="dvv-network-tooltip">{language === 'tr' ? 'İletişime Geçin' : 'Contact Us'}</span>
                  <img src={networkIcon} alt="Contact" className="dvv-icon-img" />
                </div>
                <div className="dvv-dock-icon dvv-call-icon dvv-dock-hover" onClick={handleContactNavigation}>
                  <img src={callIcon} alt="Call" className="dvv-icon-img" />
                </div>
                <div className="dvv-dock-icon dvv-app-icon dvv-dock-hover" onClick={openApp}>
                  <span className="dvv-app-tooltip">{t.tooltip}</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
                  </svg>
                </div>
              </div>
            </div>

            {/* App */}
            <div className={`dvv-app ${isAppOpen ? 'dvv-active' : ''}`}>
              {/* Scenario Screen */}
              {showScenarioScreen && (
                <div className="dvv-scenario-screen">
                  <div className="dvv-scenario-header">
                    <div className="dvv-logo">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="dvv-info">
                      <h3>Allync AI</h3>
                      <p>{t.selectScenario}</p>
                    </div>
                    <button className="dvv-close-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="dvv-scenario-list">
                    {Object.entries(scenarioData).map(([key, scenario]) => (
                      <button
                        key={key}
                        className="dvv-scenario-item"
                        onClick={() => selectScenario(key)}
                      >
                        <div className={`dvv-scenario-icon-wrapper ${key}`}>
                          <img src={scenarioIcons[key]} alt={scenario.title} className="dvv-scenario-icon" />
                        </div>
                        <div className="dvv-text">
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
                <div className="dvv-demo-screen">
                  <div className="dvv-demo-header">
                    <button className="dvv-back-btn" onClick={goBack}>
                      <img src={backwardIcon} alt="Back" className="dvv-back-img" />
                    </button>
                    <div className="dvv-profile">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="dvv-info">
                      <h3>Allync AI</h3>
                      <p>{scenarioData[currentScenario as keyof typeof scenarioData].title}</p>
                    </div>
                    <button className="dvv-action-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="dvv-demo-content">
                    {/* Preview Phase */}
                    {demoPhase === 'preview' && (
                      <>
                        {/* Video Preview */}
                        <div className="dvv-source-section">
                          <div className="dvv-source-label">
                            <span className="dvv-sparkle">🎬</span> {language === 'tr' ? 'Kaynak Video' : 'Source Video'}
                          </div>
                          <div className="dvv-video-placeholder">
                            <div className="dvv-video-icon">🎥</div>
                            <p>{language === 'tr' ? 'Video Hazır' : 'Video Ready'}</p>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="dvv-prompt-section">
                          <div className="dvv-prompt-label">
                            <span className="dvv-sparkle">📝</span> {t.prompt}
                          </div>
                          <div className="dvv-prompt-box">
                            <p>{scenarioData[currentScenario as keyof typeof scenarioData].prompt}</p>
                          </div>
                        </div>

                        {/* Info Tags */}
                        <div className="dvv-info-tags">
                          <div className="dvv-info-tag">
                            <span className="dvv-info-label">{t.type}</span>
                            <span className="dvv-info-value">{scenarioData[currentScenario as keyof typeof scenarioData].transformationType}</span>
                          </div>
                          <div className="dvv-info-tag">
                            <span className="dvv-info-label">{t.time}</span>
                            <span className="dvv-info-value">{scenarioData[currentScenario as keyof typeof scenarioData].processingTime}</span>
                          </div>
                        </div>

                        {/* Start Button */}
                        <button className="dvv-start-btn" onClick={startTransformation}>
                          🪄 {t.startTransform}
                        </button>
                      </>
                    )}

                    {/* Processing Phase */}
                    {demoPhase === 'processing' && (
                      <div className="dvv-processing">
                        <div className="dvv-processing-preview">
                          <div className="dvv-processing-animation">
                            <div className="dvv-processing-icon">🎬</div>
                          </div>
                          <div className="dvv-processing-progress" style={{ width: `${progress}%` }} />
                          <div className="dvv-processing-percentage">{Math.round(progress)}%</div>
                        </div>

                        <h4>{t.processing}</h4>
                        <p className="dvv-processing-desc">{t.processingDesc}</p>

                        <div className="dvv-progress-bar">
                          <div className="dvv-progress-fill" style={{ width: `${progress}%` }} />
                        </div>

                        <div className="dvv-steps">
                          {processingSteps.map((step, index) => (
                            <div
                              key={step}
                              className={`dvv-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                            >
                              <div className="dvv-step-indicator">
                                {index < currentStep ? (
                                  <img src={checkIcon} alt="Done" />
                                ) : index === currentStep ? (
                                  <div className="dvv-step-dot active" />
                                ) : (
                                  <div className="dvv-step-dot" />
                                )}
                              </div>
                              <span>{t[step as keyof typeof t]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Complete Phase */}
                    {demoPhase === 'complete' && (
                      <div className="dvv-complete">
                        <div className="dvv-success-icon">
                          <img src={checkIcon} alt="Success" />
                        </div>
                        <h4>{t.complete}</h4>

                        {/* Before/After Comparison Slider */}
                        <div
                          ref={sliderRef}
                          className="dvv-comparison-slider"
                          onMouseDown={handleSliderMouseDown}
                          onMouseUp={handleSliderMouseUp}
                          onMouseLeave={handleSliderMouseUp}
                          onMouseMove={(e) => handleSliderMove(e.clientX)}
                          onTouchStart={handleSliderMouseDown}
                          onTouchEnd={handleSliderMouseUp}
                          onTouchMove={(e) => handleSliderMove(e.touches[0].clientX)}
                        >
                          {/* Before */}
                          <div className="dvv-before-side">
                            <div className="dvv-comparison-content">
                              <span className="dvv-comparison-icon">🎥</span>
                              <p>{scenarioData[currentScenario as keyof typeof scenarioData].beforeLabel}</p>
                            </div>
                            <div className="dvv-comparison-label dvv-before-label">{t.before}</div>
                          </div>

                          {/* After */}
                          <div className="dvv-after-side" style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}>
                            <div className="dvv-comparison-content">
                              <span className="dvv-comparison-icon animated">🎬</span>
                              <p>{scenarioData[currentScenario as keyof typeof scenarioData].afterLabel}</p>
                            </div>
                            <div className="dvv-comparison-label dvv-after-label">{t.after}</div>
                          </div>

                          {/* Slider Handle */}
                          <div className="dvv-slider-handle" style={{ left: `${sliderPosition}%` }}>
                            <div className="dvv-slider-line" />
                            <div className="dvv-slider-knob">↔</div>
                          </div>
                        </div>

                        <p className="dvv-drag-hint">
                          {language === 'tr' ? '← Karşılaştırmak için kaydırın →' : '← Drag to compare →'}
                        </p>

                        {/* Result Info */}
                        <div className="dvv-result-info">
                          <div className="dvv-result-item">
                            <span className="dvv-result-label">{t.type}</span>
                            <span className="dvv-result-value">{scenarioData[currentScenario as keyof typeof scenarioData].transformationType}</span>
                          </div>
                          <div className="dvv-result-item">
                            <span className="dvv-result-label">{t.time}</span>
                            <span className="dvv-result-value">{scenarioData[currentScenario as keyof typeof scenarioData].processingTime}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="dvv-demo-actions">
                          <button className="dvv-restart-btn" onClick={restartDemo}>
                            🔄 {t.restart}
                          </button>
                          <button className="dvv-back-home-btn" onClick={closeApp}>
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
            <div className="dvv-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="dvv-screen-reflection" />
          </div>
        </div>

        {/* Click outside hint */}
        <div className="dvv-hint">
          {language === 'tr' ? 'Kapatmak için dışarı tıklayın' : 'Click outside to close'}
        </div>
      </div>
    </div>,
    document.body
  );
};
