import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './MobileDocumentAIDemo.css';

// Assets
import demoLogo from '../../assets/whatsapp-demo-logo.png';
import closeIcon from '../../assets/demo-icons/Close_Cross_Circle.svg';
import callIcon from '../../assets/demo-icons/Call_Fill.svg';
import networkIcon from '../../assets/demo-icons/Network.svg';
import backwardIcon from '../../assets/demo-icons/Backward.svg';
import callOutlineIcon from '../../assets/demo-icons/Call.svg';
import videoCallIcon from '../../assets/demo-icons/Video Call.svg';
import sunIcon from '../../assets/demo-icons/Sun_1_Fill.svg';
import musicIcon from '../../assets/demo-icons/music.svg';
import albumCover from '../../assets/demo-icons/The_Weeknd_-_Blinding_Lights.png';
import blindingLightsAudio from '../../assets/demo-icons/The Weeknd - Blinding Lights.mp3';
import checkIcon from '../../assets/demo-icons/Check.svg';

// Import scenarios
import { documentAIDemoScenarios, documentAIUIText, DocumentAIDemoScenario } from '../../data/documentAIDemoScenarios';

interface MobileDocumentAIDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

type DemoPhase = 'selecting' | 'uploading' | 'processing' | 'complete';

// Processing steps
const processingSteps = [
  { key: 'scanning', duration: 800 },
  { key: 'detecting', duration: 1000 },
  { key: 'extracting', duration: 1200 },
  { key: 'validating', duration: 600 }
];

const uiTextExtended = {
  tr: {
    tooltip: "Demo'yu Başlat!",
    weather: 'Hava Durumu',
    music: 'Müzik',
    playNow: 'Şimdi Çal',
    nowPlaying: 'Şimdi Çalıyor'
  },
  en: {
    tooltip: 'Start Demo!',
    weather: 'Weather',
    music: 'Music',
    playNow: 'Play Now',
    nowPlaying: 'Now Playing'
  }
};

export const MobileDocumentAIDemo: React.FC<MobileDocumentAIDemoProps> = ({
  language,
  onClose,
  onContactClick
}) => {
  // Entry time - saved once
  const [entryTime] = useState(() => new Date());
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isAppOpen, setIsAppOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<DocumentAIDemoScenario | null>(null);
  const [phase, setPhase] = useState<DemoPhase>('selecting');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visibleFields, setVisibleFields] = useState<number>(0);
  // Dynamic Island states: 'collapsed' | 'compact' | 'expanded'
  const [dynamicIslandState, setDynamicIslandState] = useState<'collapsed' | 'compact' | 'expanded'>('collapsed');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = documentAIUIText[language];
  const tExt = uiTextExtended[language];

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

  // Disable body scroll and hide other elements
  useEffect(() => {
    // Save current scroll position
    const scrollY = window.scrollY;

    // Add class to body to hide everything else
    document.body.classList.add('mdoc-modal-open');
    document.body.style.top = `-${scrollY}px`;

    return () => {
      // Remove class and restore scroll
      document.body.classList.remove('mdoc-modal-open');
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

    // When music ends, go back to collapsed mode
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

  // Handle music play/pause based on isMusicPlaying state
  useEffect(() => {
    if (!audioRef.current) return;

    if (isMusicPlaying) {
      // Play music with fade in
      audioRef.current.volume = 0;
      audioRef.current.play().catch(console.error);

      // Fade in
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

      // Show volume control
      setShowVolumeControl(true);
    } else {
      // Fade out and pause
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

      // Hide volume control with delay
      volumeTimeoutRef.current = setTimeout(() => {
        setShowVolumeControl(false);
      }, 500);
    }
  }, [isMusicPlaying, volume]);

  // Handle Dynamic Island state changes based on app open/close
  useEffect(() => {
    if (isMusicPlaying) {
      if (isAppOpen) {
        // When app opens, switch to compact mode
        setDynamicIslandState('compact');
        setShowVolumeControl(false);
      } else {
        // When app closes, switch back to expanded mode
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
    setPhase('selecting');
    setSelectedScenario(null);
    setCurrentStep(0);
    setProgress(0);
    setVisibleFields(0);
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

  const selectScenario = (scenario: DocumentAIDemoScenario) => {
    setSelectedScenario(scenario);
    setPhase('uploading');

    // Uploading phase
    timeoutRef.current = setTimeout(() => {
      setPhase('processing');
      startProcessing();
    }, 1500);
  };

  const startProcessing = () => {
    let stepIndex = 0;
    let elapsed = 0;
    const totalDuration = processingSteps.reduce((acc, step) => acc + step.duration, 0);

    const updateProgress = () => {
      if (stepIndex >= processingSteps.length) {
        setProgress(100);
        timeoutRef.current = setTimeout(() => {
          setPhase('complete');
          // Animate fields appearing
          let fieldIndex = 0;
          const showNextField = () => {
            if (!selectedScenario || fieldIndex >= selectedScenario.extractedFields.length) return;
            fieldIndex++;
            setVisibleFields(fieldIndex);
            timeoutRef.current = setTimeout(showNextField, 150);
          };
          timeoutRef.current = setTimeout(showNextField, 200);
        }, 300);
        return;
      }

      setCurrentStep(stepIndex);
      const stepProgress = (elapsed / totalDuration) * 100;
      setProgress(Math.min(stepProgress, 99));

      elapsed += 80;

      if (elapsed >= processingSteps.slice(0, stepIndex + 1).reduce((acc, s) => acc + s.duration, 0)) {
        stepIndex++;
      }

      timeoutRef.current = setTimeout(updateProgress, 80);
    };

    timeoutRef.current = setTimeout(updateProgress, 300);
  };

  const restartDemo = () => {
    setPhase('selecting');
    setSelectedScenario(null);
    setCurrentStep(0);
    setProgress(0);
    setVisibleFields(0);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const getStepText = (stepKey: string) => {
    const stepTexts: Record<string, { tr: string; en: string }> = {
      scanning: { tr: 'Belge taranıyor...', en: 'Scanning document...' },
      detecting: { tr: 'Metin algılanıyor...', en: 'Detecting text...' },
      extracting: { tr: 'Veriler çıkarılıyor...', en: 'Extracting data...' },
      validating: { tr: 'Doğrulama yapılıyor...', en: 'Validating results...' }
    };
    return stepTexts[stepKey]?.[language] || stepKey;
  };

  return createPortal(
    <div className={`mdoc-overlay ${isVisible ? 'mdoc-visible' : ''} ${isClosing ? 'mdoc-closing' : ''}`} onClick={handleClose}>
      <div
        className={`mdoc-iphone-container ${isVisible ? 'mdoc-visible' : ''} ${isClosing ? 'mdoc-closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mdoc-iphone-frame">

          <div className="mdoc-iphone-screen">
            {/* Wallpaper */}
            <div className="mdoc-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`mdoc-dynamic-island mdoc-di-state-${dynamicIslandState}`}
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
              {/* Collapsed Content - Camera & Sensor */}
              <div className="mdoc-di-collapsed-content">
                <div className="mdoc-di-camera" />
                <div className="mdoc-di-sensor" />
              </div>

              {/* Compact Content - Album, Track Info & Waveform */}
              <div className="mdoc-di-compact-content">
                <div className="mdoc-di-compact-left">
                  <div className="mdoc-di-compact-album">
                    <img src={albumCover} alt="Album" className="mdoc-di-album-img" />
                  </div>
                  <div className="mdoc-di-compact-info">
                    <span className="mdoc-di-compact-title">Blinding Lights</span>
                    <span className="mdoc-di-compact-artist">The Weeknd</span>
                  </div>
                </div>
                <div className="mdoc-di-compact-waves">
                  <div className="mdoc-di-wave-bar" />
                  <div className="mdoc-di-wave-bar" />
                  <div className="mdoc-di-wave-bar" />
                </div>
              </div>

              {/* Expanded Content - Full Music Player */}
              <div className="mdoc-di-expanded-content">
                <div className="mdoc-di-music-left">
                  <div className="mdoc-di-album">
                    <img src={albumCover} alt="Album" className="mdoc-di-album-img" />
                  </div>
                  <div className="mdoc-di-track-info">
                    <h4>Blinding Lights</h4>
                    <p>The Weeknd</p>
                  </div>
                </div>
                <div className="mdoc-di-music-right">
                  <div className="mdoc-di-wave-bar" />
                  <div className="mdoc-di-wave-bar" />
                  <div className="mdoc-di-wave-bar" />
                  <div className="mdoc-di-wave-bar" />
                  <div className="mdoc-di-wave-bar" />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mdoc-status-bar">
              <div className="mdoc-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="mdoc-status-right">
                <div className="mdoc-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <span className="mdoc-5g">5G</span>
                <div className="mdoc-battery">
                  <div className="mdoc-battery-body">
                    <div className="mdoc-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`mdoc-home-screen ${isAppOpen ? 'mdoc-hidden' : ''}`}>
              {/* iPhone Volume HUD - Inside Screen */}
              <div className={`mdoc-volume-hud ${showVolumeControl ? 'mdoc-volume-hud-visible' : ''}`}>
                <div className="mdoc-volume-hud-container">
                  <div className="mdoc-volume-hud-icon">
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
                  <div className="mdoc-volume-hud-slider">
                    <div className="mdoc-volume-hud-track">
                      <div
                        className="mdoc-volume-hud-fill"
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
                      className="mdoc-volume-hud-input"
                    />
                  </div>
                </div>
              </div>

              {/* Time Widget */}
              <div className="mdoc-time-widget">
                <div className="mdoc-time">{currentTime}</div>
                <div className="mdoc-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="mdoc-widgets-container">
                <div className="mdoc-widget">
                  <div className="mdoc-widget-header">
                    <div className="mdoc-widget-icon mdoc-weather-icon">
                      <img src={sunIcon} alt="Weather" className="mdoc-widget-icon-img" />
                    </div>
                    <span>{tExt.weather}</span>
                  </div>
                  <div className="mdoc-weather-temp">18°</div>
                  <div className="mdoc-weather-desc">{language === 'tr' ? 'Açık, H:22° L:14°' : 'Clear, H:72° L:57°'}</div>
                </div>
                <div
                  className="mdoc-widget"
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
                  <div className="mdoc-widget-header">
                    <div className="mdoc-widget-icon mdoc-music-icon">
                      <img src={musicIcon} alt="Music" className="mdoc-widget-icon-img" />
                    </div>
                    <span>{tExt.music}</span>
                  </div>
                  <div className="mdoc-music-playing">
                    <div className="mdoc-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="mdoc-album-img" />
                    </div>
                    <div className="mdoc-music-info">
                      <h4>{isMusicPlaying ? tExt.nowPlaying : tExt.playNow}</h4>
                      <p>Blinding Lights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="mdoc-dock">
                <div className="mdoc-dock-icon mdoc-close-icon" onClick={handleClose}>
                  <span className="mdoc-close-tooltip">{language === 'tr' ? 'Çıkış' : 'Exit'} ✕</span>
                  <img src={closeIcon} alt="Close" className="mdoc-close-img" />
                </div>
                <div className="mdoc-dock-icon mdoc-network-icon" onClick={handleContactNavigation}>
                  <img src={networkIcon} alt="Network" className="mdoc-icon-img" />
                </div>
                <div className="mdoc-dock-icon mdoc-call-icon" onClick={handleContactNavigation}>
                  <img src={callIcon} alt="Call" className="mdoc-icon-img" />
                </div>
                <div className="mdoc-dock-icon mdoc-whatsapp-icon" onClick={openApp}>
                  <span className="mdoc-whatsapp-tooltip">{tExt.tooltip}</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" fill="none" stroke="white" strokeWidth="2" />
                    <line x1="16" y1="13" x2="8" y2="13" stroke="white" strokeWidth="2" />
                    <line x1="16" y1="17" x2="8" y2="17" stroke="white" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Document AI App */}
            <div className={`mdoc-whatsapp-app ${isAppOpen ? 'mdoc-active' : ''}`}>
              {/* Scenario Selection Screen */}
              {phase === 'selecting' && (
                <div className="mdoc-scenario-screen">
                  <div className="mdoc-scenario-header">
                    <div className="mdoc-logo">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="mdoc-info">
                      <h3>{t.headerTitle}</h3>
                      <p>{t.selectScenario}</p>
                    </div>
                    <button className="mdoc-close-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="mdoc-scenario-list">
                    {documentAIDemoScenarios.map((scenario) => (
                      <button
                        key={scenario.id}
                        className="mdoc-scenario-item"
                        onClick={() => selectScenario(scenario)}
                      >
                        <div className="mdoc-scenario-icon-wrapper">
                          <span style={{ fontSize: '24px' }}>{scenario.icon}</span>
                        </div>
                        <div className="mdoc-text">
                          <h4>{scenario.title[language]}</h4>
                          <p>{scenario.description[language]}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Uploading Phase */}
              {phase === 'uploading' && selectedScenario && (
                <div className="mdoc-uploading-screen">
                  <div className="mdoc-uploading-icon">{selectedScenario.icon}</div>
                  <h3 className="mdoc-uploading-title">{t.uploadPrompt}</h3>
                  <p className="mdoc-uploading-desc">{selectedScenario.documentType[language]}</p>
                  <div className="mdoc-uploading-bar">
                    <div className="mdoc-uploading-progress" />
                  </div>
                </div>
              )}

              {/* Processing Phase */}
              {phase === 'processing' && selectedScenario && (
                <div className="mdoc-processing-screen">
                  <div className="mdoc-processing-icon">{selectedScenario.icon}</div>
                  <h3 className="mdoc-processing-title">{t.processing}</h3>
                  <p className="mdoc-processing-step">
                    {processingSteps[currentStep] && getStepText(processingSteps[currentStep].key)}
                  </p>
                  <div className="mdoc-progress-bar">
                    <div className="mdoc-progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mdoc-progress-text">{Math.round(progress)}%</p>
                </div>
              )}

              {/* Complete Phase */}
              {phase === 'complete' && selectedScenario && (
                <div className="mdoc-complete-screen">
                  {/* Header */}
                  <div className="mdoc-complete-header">
                    <button className="mdoc-back-btn" onClick={restartDemo}>
                      <img src={backwardIcon} alt="Back" className="mdoc-back-img" />
                    </button>
                    <div className="mdoc-complete-info">
                      <h3>{t.complete}</h3>
                      <p>{selectedScenario.documentType[language]}</p>
                    </div>
                    <button className="mdoc-close-btn" onClick={closeApp}>✕</button>
                  </div>

                  {/* Results */}
                  <div className="mdoc-results-area">
                    {/* Stats */}
                    <div className="mdoc-stats-row">
                      <div className="mdoc-stat-card">
                        <p className="mdoc-stat-label">{t.processingTime}</p>
                        <p className="mdoc-stat-value">{selectedScenario.processingTime}</p>
                      </div>
                      <div className="mdoc-stat-card">
                        <p className="mdoc-stat-label">{t.accuracy}</p>
                        <p className="mdoc-stat-value mdoc-stat-green">{selectedScenario.accuracy}</p>
                      </div>
                    </div>

                    {/* Extracted Fields */}
                    <p className="mdoc-fields-label">{t.extractedData}</p>
                    {selectedScenario.extractedFields.slice(0, visibleFields).map((field, idx) => (
                      <div key={idx} className="mdoc-field-item">
                        <div className="mdoc-field-content">
                          <p className="mdoc-field-label">{field.label[language]}</p>
                          <p className="mdoc-field-value">{field.value}</p>
                        </div>
                        <div className={`mdoc-field-confidence ${field.confidence >= 98 ? 'mdoc-conf-high' : field.confidence >= 95 ? 'mdoc-conf-mid' : 'mdoc-conf-low'}`}>
                          {field.confidence}%
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="mdoc-demo-actions">
                    <button className="mdoc-restart-btn" onClick={restartDemo}>
                      🔄 {t.restart}
                    </button>
                    <button className="mdoc-contact-btn" onClick={handleContactNavigation}>
                      📞 {t.contact}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Home Indicator */}
            <div className="mdoc-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="mdoc-screen-reflection" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
