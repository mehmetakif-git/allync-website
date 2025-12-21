import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './MobileDocumentAIDemo.css';

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

// Import scenarios
import { documentAIDemoScenarios, documentAIUIText, DocumentAIDemoScenario, DocumentField } from '../../data/documentAIDemoScenarios';

interface MobileDocumentAIDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

type DemoPhase = 'selecting' | 'uploading' | 'processing' | 'complete';

// Processing steps
const processingSteps = [
  { key: 'scanning', duration: 1200 },
  { key: 'detecting', duration: 1500 },
  { key: 'extracting', duration: 2000 },
  { key: 'validating', duration: 1000 }
];

export const MobileDocumentAIDemo: React.FC<MobileDocumentAIDemoProps> = ({
  language,
  onClose,
  onContactClick
}) => {
  // Entry time for clock
  const [entryTime] = useState(() => new Date());
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isAppOpen, setIsAppOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<DocumentAIDemoScenario | null>(null);
  const [phase, setPhase] = useState<DemoPhase>('selecting');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visibleFields, setVisibleFields] = useState<number>(0);

  // Dynamic Island states
  const [dynamicIslandState, setDynamicIslandState] = useState<'collapsed' | 'compact' | 'expanded'>('collapsed');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const t = documentAIUIText[language];

  // Set time and date from entry time
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
    document.body.classList.add('mda-modal-open');
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.classList.remove('mda-modal-open');
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

  // Upload animation
  const startUploadAnimation = useCallback(() => {
    let uploadProgress = 0;

    const updateUpload = () => {
      if (uploadProgress >= 100) {
        setPhase('processing');
        startProcessingAnimation();
        return;
      }

      uploadProgress += 5;
      setProgress(uploadProgress);
      timeoutRef.current = setTimeout(updateUpload, 50);
    };

    timeoutRef.current = setTimeout(updateUpload, 300);
  }, []);

  // Processing animation
  const startProcessingAnimation = useCallback(() => {
    let stepIndex = 0;
    const totalDuration = processingSteps.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;
    setProgress(0);

    const updateProgress = () => {
      if (stepIndex >= processingSteps.length) {
        setProgress(100);
        timeoutRef.current = setTimeout(() => {
          setPhase('complete');
          animateFields();
        }, 400);
        return;
      }

      setCurrentStep(stepIndex);

      const stepProgress = (elapsed / totalDuration) * 100;
      setProgress(Math.min(stepProgress, 99));

      elapsed += 100;

      if (elapsed >= processingSteps.slice(0, stepIndex + 1).reduce((acc, s) => acc + s.duration, 0)) {
        stepIndex++;
      }

      timeoutRef.current = setTimeout(updateProgress, 100);
    };

    updateProgress();
  }, []);

  // Animate fields appearing
  const animateFields = useCallback(() => {
    if (!selectedScenario) return;

    let fieldIndex = 0;
    const showNextField = () => {
      if (fieldIndex >= selectedScenario.extractedFields.length) {
        return;
      }
      fieldIndex++;
      setVisibleFields(fieldIndex);
      timeoutRef.current = setTimeout(showNextField, 200);
    };

    timeoutRef.current = setTimeout(showNextField, 300);
  }, [selectedScenario]);

  const openApp = () => {
    setIsAppOpen(true);
  };

  const closeApp = () => {
    setIsAppOpen(false);
    setSelectedScenario(null);
    setPhase('selecting');
    setCurrentStep(0);
    setProgress(0);
    setVisibleFields(0);
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
    document.body.classList.remove('mda-modal-open');
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

  const handleScenarioSelect = (scenario: DocumentAIDemoScenario) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSelectedScenario(scenario);
    setPhase('uploading');
    setCurrentStep(0);
    setProgress(0);
    setVisibleFields(0);
    startUploadAnimation();
  };

  const handleBack = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSelectedScenario(null);
    setPhase('selecting');
    setCurrentStep(0);
    setProgress(0);
    setVisibleFields(0);
  };

  const handleRestart = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSelectedScenario(null);
    setPhase('selecting');
    setCurrentStep(0);
    setProgress(0);
    setVisibleFields(0);
  };

  return createPortal(
    <div className="mda-overlay">
      <div className="mda-iphone-container">
        <div className="mda-iphone-frame">
          {/* Side Buttons */}
          <div className="mda-side-button mda-silent-switch" />
          <div className="mda-side-button mda-volume-up" />
          <div className="mda-side-button mda-volume-down" />
          <div className="mda-side-button mda-power-button" />

          <div className="mda-iphone-screen">
            {/* Wallpaper */}
            <div className="mda-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`mda-dynamic-island mda-di-state-${dynamicIslandState}`}
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
              <div className="mda-di-collapsed-content">
                <div className="mda-di-camera" />
                <div className="mda-di-sensor" />
              </div>

              {/* Compact Content */}
              <div className="mda-di-compact-content">
                <div className="mda-di-compact-left">
                  <div className="mda-di-compact-album">
                    <img src={albumCover} alt="Album" className="mda-di-album-img" />
                  </div>
                  <div className="mda-di-compact-info">
                    <span className="mda-di-compact-title">Blinding Lights</span>
                    <span className="mda-di-compact-artist">The Weeknd</span>
                  </div>
                </div>
                <div className="mda-di-compact-waves">
                  <div className="mda-di-wave-bar" />
                  <div className="mda-di-wave-bar" />
                  <div className="mda-di-wave-bar" />
                </div>
              </div>

              {/* Expanded Content */}
              <div className="mda-di-expanded-content">
                <div className="mda-di-music-left">
                  <div className="mda-di-album">
                    <img src={albumCover} alt="Album" className="mda-di-album-img" />
                  </div>
                  <div className="mda-di-track-info">
                    <h4>Blinding Lights</h4>
                    <p>The Weeknd</p>
                  </div>
                </div>
                <div className="mda-di-music-right">
                  <div className="mda-di-wave-bar" />
                  <div className="mda-di-wave-bar" />
                  <div className="mda-di-wave-bar" />
                  <div className="mda-di-wave-bar" />
                  <div className="mda-di-wave-bar" />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mda-status-bar">
              <div className="mda-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="mda-status-right">
                <div className="mda-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <span className="mda-5g">5G</span>
                <div className="mda-battery">
                  <div className="mda-battery-body">
                    <div className="mda-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`mda-home-screen ${isAppOpen ? 'mda-hidden' : ''}`}>
              {/* Volume HUD */}
              <div className={`mda-volume-hud ${showVolumeControl ? 'mda-volume-hud-visible' : ''}`}>
                <div className="mda-volume-hud-container">
                  <div className="mda-volume-hud-icon">
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
                  <div className="mda-volume-hud-slider">
                    <div className="mda-volume-hud-track">
                      <div
                        className="mda-volume-hud-fill"
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
                      className="mda-volume-hud-input"
                    />
                  </div>
                </div>
              </div>

              {/* Time Widget */}
              <div className="mda-time-widget">
                <div className="mda-time">{currentTime}</div>
                <div className="mda-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="mda-widgets-container">
                <div className="mda-widget">
                  <div className="mda-widget-header">
                    <div className="mda-widget-icon mda-weather-icon">
                      <img src={sunIcon} alt="Weather" className="mda-widget-icon-img" />
                    </div>
                    <span>{language === 'tr' ? 'Hava Durumu' : 'Weather'}</span>
                  </div>
                  <div className="mda-weather-temp">18°</div>
                  <div className="mda-weather-desc">{language === 'tr' ? 'Acik, H:22° L:14°' : 'Clear, H:72° L:57°'}</div>
                </div>
                <div
                  className="mda-widget"
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
                  <div className="mda-widget-header">
                    <div className="mda-widget-icon mda-music-icon">
                      <img src={musicIcon} alt="Music" className="mda-widget-icon-img" />
                    </div>
                    <span>{language === 'tr' ? 'Muzik' : 'Music'}</span>
                  </div>
                  <div className="mda-music-playing">
                    <div className="mda-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="mda-album-img" />
                    </div>
                    <div className="mda-music-info">
                      <h4>{isMusicPlaying ? (language === 'tr' ? 'Simdi Caliyor' : 'Now Playing') : (language === 'tr' ? 'Simdi Cal' : 'Play Now')}</h4>
                      <p>Blinding Lights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="mda-dock">
                <div className="mda-dock-icon mda-close-icon" onClick={handleClose}>
                  <span className="mda-close-tooltip">{language === 'tr' ? 'Cikis' : 'Exit'} X</span>
                  <img src={closeIcon} alt="Close" className="mda-close-img" />
                </div>
                <div className="mda-dock-icon mda-network-icon" onClick={handleContactNavigation}>
                  <img src={networkIcon} alt="Network" className="mda-icon-img" />
                </div>
                <div className="mda-dock-icon mda-call-icon" onClick={handleContactNavigation}>
                  <img src={callOutlineIcon} alt="Call" className="mda-icon-img" />
                </div>
                <div className="mda-dock-icon mda-app-icon" onClick={openApp}>
                  <span className="mda-app-tooltip">{language === 'tr' ? "Demo'yu Baslat!" : 'Start Demo!'}</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
              </div>
            </div>

            {/* App */}
            <div className={`mda-app ${isAppOpen ? 'mda-active' : ''}`}>
              {/* Scenario Selection Screen */}
              {phase === 'selecting' && (
                <div className="mda-scenario-screen">
                  <div className="mda-scenario-header">
                    <div className="mda-logo">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="mda-info">
                      <h3>Allync AI</h3>
                      <p>{t.selectScenario}</p>
                    </div>
                    <button className="mda-close-btn" onClick={closeApp}>X</button>
                  </div>

                  <div className="mda-scenario-list">
                    {documentAIDemoScenarios.map((scenario) => (
                      <button
                        key={scenario.id}
                        className="mda-scenario-item"
                        onClick={() => handleScenarioSelect(scenario)}
                      >
                        <div className={`mda-scenario-icon-wrapper ${scenario.id}`}>
                          <span className="mda-scenario-emoji">{scenario.icon}</span>
                        </div>
                        <div className="mda-text">
                          <h4>{scenario.title[language]}</h4>
                          <p>{scenario.accuracy} {language === 'tr' ? 'dogruluk' : 'accuracy'}</p>
                        </div>
                        <svg className="mda-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Demo Screen (Uploading, Processing, Complete) */}
              {phase !== 'selecting' && selectedScenario && (
                <div className="mda-demo-screen">
                  <div className="mda-demo-header">
                    <button className="mda-back-btn" onClick={handleBack}>
                      <img src={backwardIcon} alt="Back" className="mda-back-img" />
                    </button>
                    <div className="mda-profile">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="mda-info">
                      <h3>Allync AI</h3>
                      <p>{selectedScenario.title[language]}</p>
                    </div>
                    <button className="mda-action-btn" onClick={closeApp}>X</button>
                  </div>

                  <div className="mda-demo-content">
                    {/* Uploading Phase */}
                    {phase === 'uploading' && (
                      <div className="mda-uploading">
                        <div className="mda-upload-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <h4>{t.uploadPrompt}</h4>
                        <div className="mda-progress-bar">
                          <div className="mda-progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="mda-progress-text">{progress}%</p>
                      </div>
                    )}

                    {/* Processing Phase */}
                    {phase === 'processing' && (
                      <div className="mda-processing">
                        <div className="mda-scan-animation">
                          <div className="mda-document">
                            <div className="mda-doc-lines">
                              <div className="mda-doc-line" style={{ width: '75%' }} />
                              <div className="mda-doc-line" style={{ width: '100%' }} />
                              <div className="mda-doc-line" style={{ width: '85%' }} />
                              <div className="mda-doc-line" style={{ width: '65%' }} />
                              <div className="mda-doc-spacer" />
                              <div className="mda-doc-line" style={{ width: '100%' }} />
                              <div className="mda-doc-line" style={{ width: '80%' }} />
                              <div className="mda-doc-line" style={{ width: '70%' }} />
                            </div>
                            <div className="mda-scan-line" />
                          </div>
                        </div>
                        <h4>{t.processing}</h4>
                        <p className="mda-processing-desc">{t.processingDesc}</p>

                        <div className="mda-progress-bar">
                          <div className="mda-progress-fill" style={{ width: `${progress}%` }} />
                        </div>

                        <div className="mda-steps">
                          {processingSteps.map((step, index) => (
                            <div
                              key={step.key}
                              className={`mda-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                            >
                              <div className="mda-step-indicator">
                                {index < currentStep ? (
                                  <img src={checkIcon} alt="Done" />
                                ) : index === currentStep ? (
                                  <div className="mda-step-dot active" />
                                ) : (
                                  <div className="mda-step-dot" />
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
                      <div className="mda-complete">
                        <div className="mda-success-icon">
                          <img src={checkIcon} alt="Success" />
                        </div>
                        <h4>{t.complete}</h4>

                        {/* Document Info */}
                        <div className="mda-doc-info">
                          <div className="mda-info-card">
                            <p className="mda-info-label">{t.processingTime}</p>
                            <p className="mda-info-value">{selectedScenario.processingTime}</p>
                          </div>
                          <div className="mda-info-card">
                            <p className="mda-info-label">{t.accuracy}</p>
                            <p className="mda-info-value mda-green">{selectedScenario.accuracy}</p>
                          </div>
                        </div>

                        {/* Extracted Data */}
                        <div className="mda-extracted-data">
                          <div className="mda-data-header">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" y1="16" x2="12" y2="12" />
                              <line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
                            <span>{t.extractedData}</span>
                          </div>
                          <div className="mda-fields">
                            {selectedScenario.extractedFields.slice(0, visibleFields).map((field: DocumentField, index: number) => (
                              <div key={index} className="mda-field">
                                <div className="mda-field-content">
                                  <p className="mda-field-label">{field.label[language]}</p>
                                  <p className="mda-field-value">{field.value}</p>
                                </div>
                                <div className="mda-field-confidence">
                                  <div
                                    className="mda-confidence-bar"
                                    style={{ width: `${field.confidence * 0.4}px` }}
                                  />
                                  <span>{field.confidence}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mda-demo-actions">
                          <button className="mda-restart-btn" onClick={handleRestart}>
                            {t.restart}
                          </button>
                          {onContactClick && (
                            <button className="mda-contact-btn" onClick={handleContactNavigation}>
                              {t.contact}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Home Indicator */}
            <div className="mda-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="mda-screen-reflection" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
