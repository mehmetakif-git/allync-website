import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { textToImageDemoScenarios, textToImageUIText, TextToImageDemoScenario } from '../../data/textToImageDemoScenarios';
import { useSoundEffect } from '../../contexts/SoundEffectContext';
import './MobileTextToImageDemo.css';

// Import icons
import closeIcon from '../../assets/demo-icons/Close_Cross_Circle.svg';
import networkIcon from '../../assets/demo-icons/Network.svg';
import backwardIcon from '../../assets/demo-icons/Backward.svg';
import callOutlineIcon from '../../assets/demo-icons/Call.svg';
import sunIcon from '../../assets/demo-icons/Sun_1_Fill.svg';
import musicIcon from '../../assets/demo-icons/music.svg';
import albumCover from '../../assets/demo-icons/The_Weeknd_-_Blinding_Lights.png';
import blindingLightsAudio from '../../assets/demo-icons/The Weeknd - Blinding Lights.mp3';
import cardIcon from '../../assets/demo-icons/Card_Fill.svg';
import pinIcon from '../../assets/demo-icons/Pin_Fill.svg';
import handIcon from '../../assets/demo-icons/Hand_Sparcles_Fill.svg';
import calendarIcon from '../../assets/demo-icons/Calendar_Plus.svg';
import checkIcon from '../../assets/demo-icons/Check.svg';

// Demo Logo
import demoLogo from '../../assets/whatsapp-demo-logo.png';

// Scenario icons mapping
const scenarioIcons: Record<string, string> = {
  'product-photo': cardIcon,
  'social-media': pinIcon,
  'illustration': handIcon,
  'portrait': calendarIcon
};

interface MobileTextToImageDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

type DemoPhase = 'selecting' | 'typing' | 'generating' | 'complete';
type DynamicIslandState = 'collapsed' | 'compact' | 'expanded';

// Generation steps
const generationSteps = [
  { key: 'analyzing', duration: 1200 },
  { key: 'composing', duration: 2000 },
  { key: 'rendering', duration: 2500 },
  { key: 'enhancing', duration: 1500 }
];

export const MobileTextToImageDemo: React.FC<MobileTextToImageDemoProps> = ({
  language,
  onClose,
  onContactClick
}) => {
  const { playClickSound, playBackSound, playSuccessSound } = useSoundEffect();

  // Demo states
  const [selectedScenario, setSelectedScenario] = useState<TextToImageDemoScenario | null>(null);
  const [phase, setPhase] = useState<DemoPhase>('selecting');
  const [typedText, setTypedText] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Dynamic Island states
  const [islandState, setIslandState] = useState<DynamicIslandState>('collapsed');
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicProgress, setMusicProgress] = useState(0);

  // Time
  const [currentTime, setCurrentTime] = useState(new Date());

  // Refs
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const t = textToImageUIText[language];

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(blindingLightsAudio);
    audioRef.current.loop = true;
    audioRef.current.volume = 0;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (musicIntervalRef.current) {
        clearInterval(musicIntervalRef.current);
      }
    };
  }, []);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Play/pause music
  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      const fadeOut = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.1) {
          audioRef.current.volume -= 0.1;
        } else {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.volume = 0;
          }
          clearInterval(fadeOut);
        }
      }, 50);

      if (musicIntervalRef.current) {
        clearInterval(musicIntervalRef.current);
      }
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      const fadeIn = setInterval(() => {
        if (audioRef.current && audioRef.current.volume < 0.3) {
          audioRef.current.volume += 0.05;
        } else {
          clearInterval(fadeIn);
        }
      }, 50);

      musicIntervalRef.current = setInterval(() => {
        setMusicProgress(prev => (prev + 1) % 100);
      }, 300);
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Typing animation
  const startTypingAnimation = useCallback((text: string) => {
    let index = 0;
    setTypedText('');

    const typeChar = () => {
      if (index < text.length) {
        setTypedText(text.slice(0, index + 1));
        index++;
        timeoutRef.current = setTimeout(typeChar, 25 + Math.random() * 15);
      } else {
        timeoutRef.current = setTimeout(() => {
          setPhase('generating');
          startGenerationAnimation();
        }, 600);
      }
    };

    timeoutRef.current = setTimeout(typeChar, 400);
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
          playSuccessSound();
        }, 400);
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
  }, [playSuccessSound]);

  // Handle scenario selection
  const handleScenarioSelect = (scenario: TextToImageDemoScenario) => {
    playClickSound();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSelectedScenario(scenario);
    setPhase('typing');
    setImageError(false);
    startTypingAnimation(scenario.prompt[language]);
  };

  // Handle back
  const handleBack = () => {
    playBackSound();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSelectedScenario(null);
    setPhase('selecting');
    setTypedText('');
    setCurrentStep(0);
    setProgress(0);
    setImageError(false);
  };

  // Handle restart
  const handleRestart = () => {
    playClickSound();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSelectedScenario(null);
    setPhase('selecting');
    setTypedText('');
    setCurrentStep(0);
    setProgress(0);
    setImageError(false);
  };

  // Handle close
  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (onClose) {
      onClose();
    }
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'tr' ? 'tr-TR' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // Dynamic Island Component
  const DynamicIsland = () => (
    <div className="mti-dynamic-island-container">
      <motion.div
        className={`mti-dynamic-island ${islandState}`}
        onClick={() => {
          if (islandState === 'collapsed') {
            setIslandState('compact');
          } else if (islandState === 'compact') {
            setIslandState('expanded');
          } else {
            setIslandState('collapsed');
          }
        }}
        layout
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
      >
        <AnimatePresence mode="wait">
          {islandState === 'collapsed' && (
            <motion.div
              key="collapsed"
              className="mti-island-collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mti-island-pill" />
            </motion.div>
          )}

          {islandState === 'compact' && (
            <motion.div
              key="compact"
              className="mti-island-compact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mti-compact-album">
                <img src={albumCover} alt="Album" />
              </div>
              <div className="mti-compact-info">
                <div className="mti-compact-title">Blinding Lights</div>
                <div className="mti-compact-bars">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="mti-bar"
                      animate={isPlaying ? {
                        height: ['40%', '100%', '60%', '80%', '40%']
                      } : { height: '40%' }}
                      transition={{
                        duration: 0.5,
                        repeat: isPlaying ? Infinity : 0,
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </div>
              </div>
              <button
                className="mti-compact-play"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMusic();
                }}
              >
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            </motion.div>
          )}

          {islandState === 'expanded' && (
            <motion.div
              key="expanded"
              className="mti-island-expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mti-expanded-header">
                <img src={albumCover} alt="Album" className="mti-expanded-album" />
                <div className="mti-expanded-info">
                  <div className="mti-expanded-title">Blinding Lights</div>
                  <div className="mti-expanded-artist">The Weeknd</div>
                </div>
                <img src={musicIcon} alt="Music" className="mti-expanded-icon" />
              </div>
              <div className="mti-expanded-progress">
                <div className="mti-progress-bar">
                  <motion.div
                    className="mti-progress-fill"
                    style={{ width: `${musicProgress}%` }}
                  />
                </div>
                <div className="mti-progress-time">
                  <span>1:23</span>
                  <span>-2:17</span>
                </div>
              </div>
              <div className="mti-expanded-controls">
                <button className="mti-control-btn">
                  <img src={backwardIcon} alt="Previous" />
                </button>
                <button
                  className="mti-control-btn mti-play-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMusic();
                  }}
                >
                  {isPlaying ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
                <button className="mti-control-btn">
                  <img src={backwardIcon} alt="Next" style={{ transform: 'rotate(180deg)' }} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );

  const content = (
    <div className="mti-demo-overlay">
      <div className="mti-iphone-container">
        {/* iPhone Frame */}
        <div className="mti-iphone-frame">
          {/* Side buttons */}
          <div className="mti-side-button mti-silent-switch" />
          <div className="mti-side-button mti-volume-up" />
          <div className="mti-side-button mti-volume-down" />
          <div className="mti-side-button mti-power-button" />

          {/* Screen */}
          <div className="mti-iphone-screen">
            {/* Status Bar */}
            <div className="mti-status-bar">
              <div className="mti-status-left">
                <span className="mti-time">{formatTime(currentTime)}</span>
              </div>
              <DynamicIsland />
              <div className="mti-status-right">
                <div className="mti-signal">
                  <div /><div /><div /><div />
                </div>
                <span className="mti-carrier">5G</span>
                <div className="mti-battery">
                  <div className="mti-battery-level" />
                </div>
              </div>
            </div>

            {/* Home Screen / App Screen */}
            <AnimatePresence mode="wait">
              {phase === 'selecting' ? (
                <motion.div
                  key="homescreen"
                  className="mti-home-screen"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  {/* Widgets */}
                  <div className="mti-widgets-row">
                    {/* Time Widget */}
                    <div className="mti-widget mti-time-widget">
                      <div className="mti-widget-city">{language === 'tr' ? 'Bursa' : 'Istanbul'}</div>
                      <div className="mti-widget-time">{formatTime(currentTime)}</div>
                    </div>

                    {/* Weather Widget */}
                    <div className="mti-widget mti-weather-widget">
                      <img src={sunIcon} alt="Sun" className="mti-weather-icon" />
                      <div className="mti-weather-temp">22°</div>
                    </div>

                    {/* Music Widget */}
                    <div
                      className="mti-widget mti-music-widget"
                      onClick={() => setIslandState('expanded')}
                    >
                      <img src={albumCover} alt="Album" className="mti-music-album" />
                      <div className="mti-music-info">
                        <div className="mti-music-title">Blinding Lights</div>
                        <div className="mti-music-artist">The Weeknd</div>
                      </div>
                    </div>
                  </div>

                  {/* Allync AI App */}
                  <div className="mti-app-section">
                    <div className="mti-app-header">
                      <div className="mti-app-icon">
                        <img src={demoLogo} alt="Allync AI" />
                      </div>
                      <div className="mti-app-title">
                        <h3>{t.headerTitle}</h3>
                        <p>{t.selectScenario}</p>
                      </div>
                    </div>

                    {/* Scenario Grid */}
                    <div className="mti-scenario-grid">
                      {textToImageDemoScenarios.map((scenario) => (
                        <motion.button
                          key={scenario.id}
                          className="mti-scenario-card"
                          onClick={() => handleScenarioSelect(scenario)}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="mti-scenario-icon">
                            <img
                              src={scenarioIcons[scenario.id] || cardIcon}
                              alt={scenario.title[language]}
                            />
                          </div>
                          <span className="mti-scenario-title">
                            {scenario.title[language]}
                          </span>
                          <span className="mti-scenario-meta">
                            {scenario.resolution}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="appscreen"
                  className="mti-app-screen"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                >
                  {/* App Header */}
                  <div className="mti-app-header-bar">
                    <button className="mti-back-btn" onClick={handleBack}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <div className="mti-header-info">
                      <div className="mti-header-icon">
                        <img src={demoLogo} alt="Allync AI" />
                      </div>
                      <div className="mti-header-text">
                        <h4>{t.headerTitle}</h4>
                        <p>{selectedScenario?.title[language]}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mti-content-area">
                    {/* Prompt Section */}
                    <div className="mti-prompt-section">
                      <div className="mti-prompt-label">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                        {t.prompt}
                      </div>
                      <div className="mti-prompt-box">
                        <p className="mti-prompt-text">
                          {typedText}
                          {phase === 'typing' && (
                            <motion.span
                              className="mti-cursor"
                              animate={{ opacity: [1, 0] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                            />
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Generation Progress */}
                    <AnimatePresence mode="wait">
                      {phase === 'generating' && (
                        <motion.div
                          className="mti-generating"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <motion.div
                            className="mti-gen-icon"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="M21 15l-5-5L5 21" />
                            </svg>
                          </motion.div>
                          <h4>{t.generating}</h4>
                          <p>{t.generatingDesc}</p>

                          <div className="mti-progress-container">
                            <div className="mti-progress-bar-bg">
                              <motion.div
                                className="mti-progress-bar-fill"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="mti-steps">
                            {generationSteps.map((step, index) => (
                              <div
                                key={step.key}
                                className={`mti-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                              >
                                <div className="mti-step-indicator">
                                  {index < currentStep ? (
                                    <img src={checkIcon} alt="Done" />
                                  ) : index === currentStep ? (
                                    <motion.div
                                      className="mti-step-dot"
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ duration: 0.5, repeat: Infinity }}
                                    />
                                  ) : (
                                    <div className="mti-step-dot inactive" />
                                  )}
                                </div>
                                <span>{t[step.key as keyof typeof t]}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {phase === 'complete' && (
                        <motion.div
                          className="mti-complete"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <motion.div
                            className="mti-success-badge"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 15 }}
                          >
                            <img src={checkIcon} alt="Success" />
                          </motion.div>
                          <h4>{t.complete}</h4>

                          {/* Image Preview */}
                          <div className="mti-image-preview">
                            {!imageError ? (
                              <>
                                <img
                                  src={selectedScenario?.imagePlaceholder}
                                  alt="Generated"
                                  onError={() => setImageError(true)}
                                />
                                <div className="mti-image-overlay">
                                  <div className="mti-image-resolution">
                                    {selectedScenario?.resolution}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="mti-image-placeholder">
                                <motion.div
                                  className="mti-placeholder-icon"
                                  animate={{
                                    scale: [1, 1.05, 1],
                                    opacity: [0.8, 1, 0.8]
                                  }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <path d="M21 15l-5-5L5 21" />
                                  </svg>
                                </motion.div>
                                <p>Image Preview</p>
                                <span>{selectedScenario?.resolution} • {selectedScenario?.style}</span>
                              </div>
                            )}
                          </div>

                          {/* Image Info */}
                          <div className="mti-image-info">
                            <div className="mti-info-item">
                              <span className="mti-info-label">{t.resolution}</span>
                              <span className="mti-info-value">{selectedScenario?.resolution}</span>
                            </div>
                            <div className="mti-info-item">
                              <span className="mti-info-label">{t.style}</span>
                              <span className="mti-info-value">{selectedScenario?.style}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mti-actions">
                            <button className="mti-btn mti-btn-primary" onClick={handleRestart}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                <path d="M1 4v6h6" />
                                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                              </svg>
                              {t.restart}
                            </button>
                            {onContactClick && (
                              <button className="mti-btn mti-btn-secondary" onClick={onContactClick}>
                                {t.contact}
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dock */}
            <div className="mti-dock">
              <div className="mti-dock-icons">
                <button className="mti-dock-icon" onClick={handleClose}>
                  <img src={closeIcon} alt="Close" />
                </button>
                <button className="mti-dock-icon">
                  <img src={networkIcon} alt="Network" />
                </button>
                <button className="mti-dock-icon">
                  <img src={callOutlineIcon} alt="Call" />
                </button>
                <button className="mti-dock-icon mti-dock-active">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </button>
              </div>
              <div className="mti-home-indicator" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};
