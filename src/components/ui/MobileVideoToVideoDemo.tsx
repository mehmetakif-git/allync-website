import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './MobileVideoToVideoDemo.css';

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

// Scenario data
import { videoToVideoDemoScenarios, videoToVideoUIText, VideoToVideoDemoScenario } from '../../data/videoToVideoDemoScenarios';

// Senaryo ikonları mapping
const scenarioIcons: Record<string, string> = {
  'style-transfer': '🎨',
  'video-enhance': '✨',
  'background-replace': '🌆',
  'colorize': '🎬'
};

interface MobileVideoToVideoDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

// Progress steps for transformation
const transformationSteps = [
  { key: 'analyzing', duration: 1200 },
  { key: 'detecting', duration: 1500 },
  { key: 'transforming', duration: 2500 },
  { key: 'rendering', duration: 2000 }
];

export const MobileVideoToVideoDemo: React.FC<MobileVideoToVideoDemoProps> = ({
  language,
  onClose,
  onContactClick
}) => {
  // Entry time (frozen)
  const [entryTime] = useState(() => new Date());
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isAppOpen, setIsAppOpen] = useState(false);
  const [showScenarioScreen, setShowScenarioScreen] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState<VideoToVideoDemoScenario | null>(null);
  const [phase, setPhase] = useState<'selecting' | 'preview' | 'processing' | 'complete'>('selecting');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  // Dynamic Island states
  const [dynamicIslandState, setDynamicIslandState] = useState<'collapsed' | 'compact' | 'expanded'>('collapsed');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const t = videoToVideoUIText[language];

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
    const scrollY = window.scrollY;
    document.body.classList.add('mvv-modal-open');
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.classList.remove('mvv-modal-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (progressIntervalRef.current) clearTimeout(progressIntervalRef.current);
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
    setSelectedScenario(null);
    setPhase('selecting');
    setCurrentStep(0);
    setProgress(0);
    setSliderPosition(50);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (progressIntervalRef.current) clearTimeout(progressIntervalRef.current);
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
    document.body.classList.remove('mvv-modal-open');
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

  const selectScenario = (scenario: VideoToVideoDemoScenario) => {
    setShowScenarioScreen(false);
    setSelectedScenario(scenario);
    setPhase('preview');
    setCurrentStep(0);
    setProgress(0);
    setSliderPosition(50);
  };

  // Transformation progress
  const startTransformation = useCallback(() => {
    setPhase('processing');
    let stepIndex = 0;
    const totalDuration = transformationSteps.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;
    setProgress(0);

    const updateProgress = () => {
      if (stepIndex >= transformationSteps.length) {
        setProgress(100);
        timeoutRef.current = setTimeout(() => {
          setPhase('complete');
          animateSlider();
        }, 400);
        return;
      }

      setCurrentStep(stepIndex);
      const stepProgress = (elapsed / totalDuration) * 100;
      setProgress(Math.min(stepProgress, 99));
      elapsed += 100;

      if (elapsed >= transformationSteps.slice(0, stepIndex + 1).reduce((acc, s) => acc + s.duration, 0)) {
        stepIndex++;
      }

      progressIntervalRef.current = setTimeout(updateProgress, 100);
    };

    updateProgress();
  }, []);

  // Animate slider back and forth
  const animateSlider = useCallback(() => {
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
  }, []);

  const goBack = () => {
    setShowScenarioScreen(true);
    setSelectedScenario(null);
    setPhase('selecting');
    setCurrentStep(0);
    setProgress(0);
    setSliderPosition(50);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (progressIntervalRef.current) clearTimeout(progressIntervalRef.current);
  };

  const restartDemo = () => {
    setShowScenarioScreen(true);
    setSelectedScenario(null);
    setPhase('selecting');
    setCurrentStep(0);
    setProgress(0);
    setSliderPosition(50);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (progressIntervalRef.current) clearTimeout(progressIntervalRef.current);
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

  return createPortal(
    <div className="mvv-overlay">
      <div className="mvv-iphone-container">
        <div className="mvv-iphone-frame">
          {/* Side Buttons */}
          <div className="mvv-side-button mvv-silent-switch" />
          <div className="mvv-side-button mvv-volume-up" />
          <div className="mvv-side-button mvv-volume-down" />
          <div className="mvv-side-button mvv-power-button" />

          <div className="mvv-iphone-screen">
            {/* Wallpaper */}
            <div className="mvv-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`mvv-dynamic-island mvv-di-state-${dynamicIslandState}`}
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
              <div className="mvv-di-collapsed-content">
                <div className="mvv-di-camera" />
                <div className="mvv-di-sensor" />
              </div>

              {/* Compact Content */}
              <div className="mvv-di-compact-content">
                <div className="mvv-di-compact-left">
                  <div className="mvv-di-compact-album">
                    <img src={albumCover} alt="Album" className="mvv-di-album-img" />
                  </div>
                  <div className="mvv-di-compact-info">
                    <span className="mvv-di-compact-title">Blinding Lights</span>
                    <span className="mvv-di-compact-artist">The Weeknd</span>
                  </div>
                </div>
                <div className="mvv-di-compact-waves">
                  <div className="mvv-di-wave-bar" />
                  <div className="mvv-di-wave-bar" />
                  <div className="mvv-di-wave-bar" />
                </div>
              </div>

              {/* Expanded Content */}
              <div className="mvv-di-expanded-content">
                <div className="mvv-di-music-left">
                  <div className="mvv-di-album">
                    <img src={albumCover} alt="Album" className="mvv-di-album-img" />
                  </div>
                  <div className="mvv-di-track-info">
                    <h4>Blinding Lights</h4>
                    <p>The Weeknd</p>
                  </div>
                </div>
                <div className="mvv-di-music-right">
                  <div className="mvv-di-wave-bar" />
                  <div className="mvv-di-wave-bar" />
                  <div className="mvv-di-wave-bar" />
                  <div className="mvv-di-wave-bar" />
                  <div className="mvv-di-wave-bar" />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mvv-status-bar">
              <div className="mvv-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="mvv-status-right">
                <div className="mvv-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <span className="mvv-5g">5G</span>
                <div className="mvv-battery">
                  <div className="mvv-battery-body">
                    <div className="mvv-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`mvv-home-screen ${isAppOpen ? 'mvv-hidden' : ''}`}>
              {/* Volume HUD */}
              <div className={`mvv-volume-hud ${showVolumeControl ? 'mvv-volume-hud-visible' : ''}`}>
                <div className="mvv-volume-hud-container">
                  <div className="mvv-volume-hud-icon">
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
                  <div className="mvv-volume-hud-slider">
                    <div className="mvv-volume-hud-track">
                      <div
                        className="mvv-volume-hud-fill"
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
                      className="mvv-volume-hud-input"
                    />
                  </div>
                </div>
              </div>

              {/* Time Widget */}
              <div className="mvv-time-widget">
                <div className="mvv-time">{currentTime}</div>
                <div className="mvv-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="mvv-widgets-container">
                <div className="mvv-widget">
                  <div className="mvv-widget-header">
                    <div className="mvv-widget-icon mvv-weather-icon">
                      <img src={sunIcon} alt="Weather" className="mvv-widget-icon-img" />
                    </div>
                    <span>{language === 'tr' ? 'Hava Durumu' : 'Weather'}</span>
                  </div>
                  <div className="mvv-weather-temp">18°</div>
                  <div className="mvv-weather-desc">{language === 'tr' ? 'Açık, H:22° L:14°' : 'Clear, H:72° L:57°'}</div>
                </div>
                <div
                  className="mvv-widget"
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
                  <div className="mvv-widget-header">
                    <div className="mvv-widget-icon mvv-music-icon">
                      <img src={musicIcon} alt="Music" className="mvv-widget-icon-img" />
                    </div>
                    <span>{language === 'tr' ? 'Müzik' : 'Music'}</span>
                  </div>
                  <div className="mvv-music-playing">
                    <div className="mvv-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="mvv-album-img" />
                    </div>
                    <div className="mvv-music-info">
                      <h4>{isMusicPlaying ? (language === 'tr' ? 'Şimdi Çalıyor' : 'Now Playing') : (language === 'tr' ? 'Şimdi Çal' : 'Play Now')}</h4>
                      <p>Blinding Lights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="mvv-dock">
                <div className="mvv-dock-icon mvv-close-icon" onClick={handleClose}>
                  <span className="mvv-close-tooltip">{language === 'tr' ? 'Çıkış' : 'Exit'} ✕</span>
                  <img src={closeIcon} alt="Close" className="mvv-close-img" />
                </div>
                <div className="mvv-dock-icon mvv-network-icon" onClick={handleContactNavigation}>
                  <img src={networkIcon} alt="Network" className="mvv-icon-img" />
                </div>
                <div className="mvv-dock-icon mvv-call-icon" onClick={handleContactNavigation}>
                  <img src={callOutlineIcon} alt="Call" className="mvv-icon-img" />
                </div>
                <div className="mvv-dock-icon mvv-app-icon" onClick={openApp}>
                  <span className="mvv-app-tooltip">{language === 'tr' ? "Demo'yu Başlat!" : 'Start Demo!'}</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
                  </svg>
                </div>
              </div>
            </div>

            {/* App */}
            <div className={`mvv-app ${isAppOpen ? 'mvv-active' : ''}`}>
              {/* Scenario Screen */}
              {showScenarioScreen && (
                <div className="mvv-scenario-screen">
                  <div className="mvv-scenario-header">
                    <div className="mvv-logo">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="mvv-info">
                      <h3>Allync AI</h3>
                      <p>{t.selectScenario}</p>
                    </div>
                    <button className="mvv-close-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="mvv-scenario-list">
                    {videoToVideoDemoScenarios.map((scenario) => (
                      <button
                        key={scenario.id}
                        className="mvv-scenario-item"
                        onClick={() => selectScenario(scenario)}
                      >
                        <div className="mvv-scenario-icon-wrapper">
                          <span className="mvv-scenario-icon">{scenarioIcons[scenario.id]}</span>
                        </div>
                        <div className="mvv-text">
                          <h4>{scenario.title[language]}</h4>
                          <p>{scenario.transformationType} • {scenario.processingTime}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Demo Screen */}
              {!showScenarioScreen && selectedScenario && (
                <div className="mvv-demo-screen">
                  <div className="mvv-demo-header">
                    <button className="mvv-back-btn" onClick={goBack}>
                      <img src={backwardIcon} alt="Back" className="mvv-back-img" />
                    </button>
                    <div className="mvv-profile">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="mvv-info">
                      <h3>Allync AI</h3>
                      <p>{selectedScenario.title[language]}</p>
                    </div>
                    <button className="mvv-action-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="mvv-demo-content">
                    {/* Preview Phase */}
                    {phase === 'preview' && (
                      <>
                        {/* Source Video Preview */}
                        <div className="mvv-source-section">
                          <div className="mvv-source-label">
                            <span className="mvv-sparkle">🎬</span> {language === 'tr' ? 'Kaynak Video' : 'Source Video'}
                          </div>
                          <div className="mvv-source-preview">
                            <div className="mvv-video-placeholder">
                              <span className="mvv-video-icon">🎥</span>
                              <p>{language === 'tr' ? 'Video Hazır' : 'Video Ready'}</p>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="mvv-prompt-section">
                          <div className="mvv-prompt-label">
                            <span className="mvv-sparkle">📝</span> {language === 'tr' ? 'Açıklama' : 'Description'}
                          </div>
                          <div className="mvv-prompt-box">
                            <p>{selectedScenario.description[language]}</p>
                          </div>
                        </div>

                        {/* Info Tags */}
                        <div className="mvv-info-tags">
                          <div className="mvv-info-tag">
                            <span className="mvv-info-label">{t.type}</span>
                            <span className="mvv-info-value">{selectedScenario.transformationType}</span>
                          </div>
                          <div className="mvv-info-tag">
                            <span className="mvv-info-label">{t.time}</span>
                            <span className="mvv-info-value">{selectedScenario.processingTime}</span>
                          </div>
                        </div>

                        {/* Start Button */}
                        <button className="mvv-start-btn" onClick={startTransformation}>
                          🪄 {t.startTransform}
                        </button>
                      </>
                    )}

                    {/* Processing Phase */}
                    {phase === 'processing' && (
                      <div className="mvv-generation">
                        <div className="mvv-gen-preview">
                          <div className="mvv-processing-animation">
                            <div className="mvv-processing-icon">🎬</div>
                            <div className="mvv-processing-progress" style={{ width: `${progress}%` }} />
                          </div>
                          <div className="mvv-processing-percentage">{Math.round(progress)}%</div>
                        </div>
                        <div className="mvv-gen-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                          </svg>
                        </div>
                        <h4>{t.processing}</h4>
                        <p className="mvv-processing-desc">{t.processingDesc}</p>
                        <div className="mvv-progress-bar">
                          <div className="mvv-progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="mvv-steps">
                          {transformationSteps.map((step, index) => (
                            <div
                              key={step.key}
                              className={`mvv-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                            >
                              <div className="mvv-step-indicator">
                                {index < currentStep ? (
                                  <img src={checkIcon} alt="Done" />
                                ) : index === currentStep ? (
                                  <div className="mvv-step-dot active" />
                                ) : (
                                  <div className="mvv-step-dot" />
                                )}
                              </div>
                              <span>{t[step.key as keyof typeof t]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Complete Phase */}
                    {phase === 'complete' && (
                      <div className="mvv-complete">
                        <div className="mvv-success-icon">
                          <img src={checkIcon} alt="Success" />
                        </div>
                        <h4>{t.complete}</h4>

                        {/* Before/After Comparison Slider */}
                        <div
                          ref={sliderRef}
                          className="mvv-comparison-slider"
                          onMouseDown={handleSliderMouseDown}
                          onMouseUp={handleSliderMouseUp}
                          onMouseLeave={handleSliderMouseUp}
                          onMouseMove={(e) => handleSliderMove(e.clientX)}
                          onTouchStart={handleSliderMouseDown}
                          onTouchEnd={handleSliderMouseUp}
                          onTouchMove={(e) => handleSliderMove(e.touches[0].clientX)}
                        >
                          {/* Before Side */}
                          <div className="mvv-before-side">
                            <div className="mvv-comparison-content">
                              <span className="mvv-comparison-icon">🎥</span>
                              <p>{selectedScenario.beforeLabel[language]}</p>
                            </div>
                            <div className="mvv-comparison-label mvv-before-label">{t.before}</div>
                          </div>

                          {/* After Side */}
                          <div className="mvv-after-side" style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}>
                            <div className="mvv-comparison-content">
                              <span className="mvv-comparison-icon animated">🎬</span>
                              <p>{selectedScenario.afterLabel[language]}</p>
                            </div>
                            <div className="mvv-comparison-label mvv-after-label">{t.after}</div>
                          </div>

                          {/* Slider Handle */}
                          <div className="mvv-slider-handle" style={{ left: `${sliderPosition}%` }}>
                            <div className="mvv-slider-line" />
                            <div className="mvv-slider-knob">↔</div>
                          </div>
                        </div>

                        <p className="mvv-drag-hint">
                          {language === 'tr' ? '← Karşılaştırmak için kaydırın →' : '← Drag to compare →'}
                        </p>

                        {/* Result Info */}
                        <div className="mvv-video-info">
                          <div className="mvv-info-item">
                            <span className="mvv-info-label">{t.type}</span>
                            <span className="mvv-info-value">{selectedScenario.transformationType}</span>
                          </div>
                          <div className="mvv-info-item">
                            <span className="mvv-info-label">{t.time}</span>
                            <span className="mvv-info-value">{selectedScenario.processingTime}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mvv-demo-actions">
                          <button className="mvv-restart-btn" onClick={restartDemo}>
                            🔄 {t.restart}
                          </button>
                          <button className="mvv-back-home-btn" onClick={closeApp}>
                            🏠 {language === 'tr' ? 'Ana Ekrana Dön' : 'Back to Home'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Home Indicator */}
            <div className="mvv-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="mvv-screen-reflection" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
