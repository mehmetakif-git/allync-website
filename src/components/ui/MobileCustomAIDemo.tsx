import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { customAIDemoScenarios, customAIUIText, CustomAIDemoScenario } from '../../data/customAIDemoScenarios';
import './MobileCustomAIDemo.css';

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
  'healthcare': cardIcon,
  'ecommerce': calendarIcon,
  'realestate': pinIcon,
  'education': handIcon
};

interface MobileCustomAIDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

// Build steps
const buildSteps = ['analyzing', 'configuring', 'integrating', 'testing'];

export const MobileCustomAIDemo: React.FC<MobileCustomAIDemoProps> = ({
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
  const [currentScenario, setCurrentScenario] = useState<CustomAIDemoScenario | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [demoPhase, setDemoPhase] = useState<'industry' | 'features' | 'building' | 'complete'>('industry');
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

  const t = customAIUIText[language];

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
    document.body.classList.add('mca-modal-open');
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.classList.remove('mca-modal-open');
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
    setSelectedFeatures([]);
    setDemoPhase('industry');
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
    document.body.classList.remove('mca-modal-open');
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

  const selectScenario = (scenario: CustomAIDemoScenario) => {
    setShowScenarioScreen(false);
    setCurrentScenario(scenario);
    setDemoPhase('features');
    setSelectedFeatures([]);
  };

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(f => f !== featureId)
        : [...prev, featureId]
    );
  };

  const startBuilding = () => {
    if (selectedFeatures.length === 0) return;

    setDemoPhase('building');
    let stepIndex = 0;
    let progressValue = 0;

    const updateProgress = () => {
      if (stepIndex >= buildSteps.length) {
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
    if (demoPhase === 'features') {
      setShowScenarioScreen(true);
      setCurrentScenario(null);
      setDemoPhase('industry');
    } else if (demoPhase === 'building' || demoPhase === 'complete') {
      setDemoPhase('features');
      setCurrentStep(0);
      setProgress(0);
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const restartDemo = () => {
    setShowScenarioScreen(true);
    setCurrentScenario(null);
    setSelectedFeatures([]);
    setDemoPhase('industry');
    setCurrentStep(0);
    setProgress(0);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return createPortal(
    <div className="mca-overlay">
      <div className="mca-iphone-container">
        <div className="mca-iphone-frame">
          {/* Side Buttons */}
          <div className="mca-side-button mca-silent-switch" />
          <div className="mca-side-button mca-volume-up" />
          <div className="mca-side-button mca-volume-down" />
          <div className="mca-side-button mca-power-button" />

          <div className="mca-iphone-screen">
            {/* Wallpaper */}
            <div className="mca-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`mca-dynamic-island mca-di-state-${dynamicIslandState}`}
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
              <div className="mca-di-collapsed-content">
                <div className="mca-di-camera" />
                <div className="mca-di-sensor" />
              </div>

              {/* Compact Content */}
              <div className="mca-di-compact-content">
                <div className="mca-di-compact-left">
                  <div className="mca-di-compact-album">
                    <img src={albumCover} alt="Album" className="mca-di-album-img" />
                  </div>
                  <div className="mca-di-compact-info">
                    <span className="mca-di-compact-title">Blinding Lights</span>
                    <span className="mca-di-compact-artist">The Weeknd</span>
                  </div>
                </div>
                <div className="mca-di-compact-waves">
                  <div className="mca-di-wave-bar" />
                  <div className="mca-di-wave-bar" />
                  <div className="mca-di-wave-bar" />
                </div>
              </div>

              {/* Expanded Content */}
              <div className="mca-di-expanded-content">
                <div className="mca-di-music-left">
                  <div className="mca-di-album">
                    <img src={albumCover} alt="Album" className="mca-di-album-img" />
                  </div>
                  <div className="mca-di-track-info">
                    <h4>Blinding Lights</h4>
                    <p>The Weeknd</p>
                  </div>
                </div>
                <div className="mca-di-music-right">
                  <div className="mca-di-wave-bar" />
                  <div className="mca-di-wave-bar" />
                  <div className="mca-di-wave-bar" />
                  <div className="mca-di-wave-bar" />
                  <div className="mca-di-wave-bar" />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mca-status-bar">
              <div className="mca-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="mca-status-right">
                <div className="mca-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <span className="mca-5g">5G</span>
                <div className="mca-battery">
                  <div className="mca-battery-body">
                    <div className="mca-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`mca-home-screen ${isAppOpen ? 'mca-hidden' : ''}`}>
              {/* Volume HUD */}
              <div className={`mca-volume-hud ${showVolumeControl ? 'mca-volume-hud-visible' : ''}`}>
                <div className="mca-volume-hud-container">
                  <div className="mca-volume-hud-icon">
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
                  <div className="mca-volume-hud-slider">
                    <div className="mca-volume-hud-track">
                      <div
                        className="mca-volume-hud-fill"
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
                      className="mca-volume-hud-input"
                    />
                  </div>
                </div>
              </div>

              {/* Time Widget */}
              <div className="mca-time-widget">
                <div className="mca-time">{currentTime}</div>
                <div className="mca-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="mca-widgets-container">
                <div className="mca-widget">
                  <div className="mca-widget-header">
                    <div className="mca-widget-icon mca-weather-icon">
                      <img src={sunIcon} alt="Weather" className="mca-widget-icon-img" />
                    </div>
                    <span>{language === 'tr' ? 'Hava Durumu' : 'Weather'}</span>
                  </div>
                  <div className="mca-weather-temp">18°</div>
                  <div className="mca-weather-desc">{language === 'tr' ? 'Açık, H:22° L:14°' : 'Clear, H:72° L:57°'}</div>
                </div>
                <div
                  className="mca-widget"
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
                  <div className="mca-widget-header">
                    <div className="mca-widget-icon mca-music-icon">
                      <img src={musicIcon} alt="Music" className="mca-widget-icon-img" />
                    </div>
                    <span>{language === 'tr' ? 'Müzik' : 'Music'}</span>
                  </div>
                  <div className="mca-music-playing">
                    <div className="mca-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="mca-album-img" />
                    </div>
                    <div className="mca-music-info">
                      <h4>{isMusicPlaying ? (language === 'tr' ? 'Şimdi Çalıyor' : 'Now Playing') : (language === 'tr' ? 'Şimdi Çal' : 'Play Now')}</h4>
                      <p>Blinding Lights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="mca-dock">
                <div className="mca-dock-icon mca-close-icon" onClick={handleClose}>
                  <span className="mca-close-tooltip">{language === 'tr' ? 'Çıkış' : 'Exit'} ✕</span>
                  <img src={closeIcon} alt="Close" className="mca-close-img" />
                </div>
                <div className="mca-dock-icon mca-network-icon" onClick={handleContactNavigation}>
                  <img src={networkIcon} alt="Network" className="mca-icon-img" />
                </div>
                <div className="mca-dock-icon mca-call-icon" onClick={handleContactNavigation}>
                  <img src={callOutlineIcon} alt="Call" className="mca-icon-img" />
                </div>
                <div className="mca-dock-icon mca-app-icon" onClick={openApp}>
                  <span className="mca-app-tooltip">{language === 'tr' ? "Demo'yu Başlat!" : 'Start Demo!'}</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polygon points="5,3 19,12 5,21" fill="white" stroke="none" />
                  </svg>
                </div>
              </div>
            </div>

            {/* App */}
            <div className={`mca-app ${isAppOpen ? 'mca-active' : ''}`}>
              {/* Industry Selection Screen */}
              {showScenarioScreen && demoPhase === 'industry' && (
                <div className="mca-scenario-screen">
                  <div className="mca-scenario-header">
                    <div className="mca-logo">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="mca-info">
                      <h3>{t.headerTitle}</h3>
                      <p>{t.selectIndustry}</p>
                    </div>
                    <button className="mca-close-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="mca-scenario-list">
                    {customAIDemoScenarios.map((scenario) => (
                      <button
                        key={scenario.id}
                        className="mca-scenario-item"
                        onClick={() => selectScenario(scenario)}
                      >
                        <div className={`mca-scenario-icon-wrapper ${scenario.id}`}>
                          <img src={scenarioIcons[scenario.id]} alt={scenario.industry[language]} className="mca-scenario-icon" />
                        </div>
                        <div className="mca-text">
                          <h4>{scenario.industry[language]}</h4>
                          <p>{scenario.icon} {scenario.features.length} {language === 'tr' ? 'özellik' : 'features'}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Feature Selection Screen */}
              {!showScenarioScreen && demoPhase === 'features' && currentScenario && (
                <div className="mca-demo-screen">
                  <div className="mca-demo-header">
                    <button className="mca-back-btn" onClick={goBack}>
                      <img src={backwardIcon} alt="Back" className="mca-back-img" />
                    </button>
                    <div className="mca-profile">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="mca-info">
                      <h3>{currentScenario.industry[language]}</h3>
                      <p>{t.selectFeatures}</p>
                    </div>
                    <button className="mca-action-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="mca-demo-content">
                    {/* Features Grid */}
                    <div className="mca-features-grid">
                      {currentScenario.features.map((feature) => (
                        <button
                          key={feature.id}
                          className={`mca-feature-item ${selectedFeatures.includes(feature.id) ? 'mca-selected' : ''}`}
                          onClick={() => toggleFeature(feature.id)}
                        >
                          <div className="mca-feature-icon">{feature.icon}</div>
                          <span>{feature.name[language]}</span>
                          {selectedFeatures.includes(feature.id) && (
                            <div className="mca-check-icon">
                              <img src={checkIcon} alt="Selected" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Selected Count */}
                    {selectedFeatures.length > 0 && (
                      <div className="mca-selected-count">
                        {selectedFeatures.length} {t.featuresSelected}
                      </div>
                    )}

                    {/* Continue Button */}
                    <button
                      className={`mca-start-btn ${selectedFeatures.length === 0 ? 'mca-disabled' : ''}`}
                      onClick={startBuilding}
                      disabled={selectedFeatures.length === 0}
                    >
                      🚀 {t.continue}
                    </button>
                  </div>
                </div>
              )}

              {/* Building Phase */}
              {demoPhase === 'building' && (
                <div className="mca-demo-screen">
                  <div className="mca-demo-header">
                    <button className="mca-back-btn" onClick={goBack}>
                      <img src={backwardIcon} alt="Back" className="mca-back-img" />
                    </button>
                    <div className="mca-profile">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="mca-info">
                      <h3>{t.headerTitle}</h3>
                      <p>{currentScenario?.industry[language]}</p>
                    </div>
                    <button className="mca-action-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="mca-demo-content">
                    <div className="mca-generation">
                      <div className="mca-gen-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                      </div>
                      <h4>{t.building}</h4>
                      <p className="mca-building-desc">{t.buildingDesc}</p>
                      <div className="mca-progress-bar">
                        <div className="mca-progress-fill" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="mca-steps">
                        {buildSteps.map((step, index) => (
                          <div
                            key={step}
                            className={`mca-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                          >
                            <div className="mca-step-indicator">
                              {index < currentStep ? (
                                <img src={checkIcon} alt="Done" />
                              ) : index === currentStep ? (
                                <div className="mca-step-dot active" />
                              ) : (
                                <div className="mca-step-dot" />
                              )}
                            </div>
                            <span>{t[step as keyof typeof t]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Complete Phase */}
              {demoPhase === 'complete' && currentScenario && (
                <div className="mca-demo-screen">
                  <div className="mca-demo-header">
                    <button className="mca-back-btn" onClick={goBack}>
                      <img src={backwardIcon} alt="Back" className="mca-back-img" />
                    </button>
                    <div className="mca-profile">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="mca-info">
                      <h3>{currentScenario.result.name[language]}</h3>
                      <p>{currentScenario.industry[language]}</p>
                    </div>
                    <button className="mca-action-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="mca-demo-content">
                    <div className="mca-complete">
                      <div className="mca-success-icon">
                        <img src={checkIcon} alt="Success" />
                      </div>
                      <h4>{t.complete}</h4>

                      {/* Capabilities */}
                      <div className="mca-result-section">
                        <div className="mca-result-label">✨ {t.capabilities}</div>
                        <div className="mca-capabilities-list">
                          {currentScenario.result.capabilities.map((cap, index) => (
                            <div key={index} className="mca-capability-item">
                              <img src={checkIcon} alt="" className="mca-cap-check" />
                              <span>{cap[language]}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Integrations */}
                      <div className="mca-result-section">
                        <div className="mca-result-label">🔗 {t.integrations}</div>
                        <div className="mca-integrations-list">
                          {currentScenario.result.integrations.map((integration, index) => (
                            <span key={index} className="mca-integration-tag">{integration}</span>
                          ))}
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="mca-info-tags">
                        <div className="mca-info-tag">
                          <span className="mca-info-label">{t.timeline}</span>
                          <span className="mca-info-value">{currentScenario.result.estimatedTime}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mca-demo-actions">
                        <button className="mca-contact-btn" onClick={handleContactNavigation}>
                          📩 {t.contact}
                        </button>
                        <button className="mca-restart-btn" onClick={restartDemo}>
                          🔄 {t.restart}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Home Indicator */}
            <div className="mca-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="mca-screen-reflection" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
