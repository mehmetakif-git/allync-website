import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './MobileVoiceCloningDemo.css';

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
import sendMessageIcon from '../../assets/demo-icons/Send Message.svg';
import calendarIcon from '../../assets/demo-icons/Calendar_Plus.svg';
import handIcon from '../../assets/demo-icons/Hand_Sparcles_Fill.svg';
import cardIcon from '../../assets/demo-icons/Card_Fill.svg';

// Senaryo ikonları mapping
const scenarioIcons: Record<string, string> = {
  'professional': sendMessageIcon,
  'commercial': calendarIcon,
  'narrator': handIcon,
  'assistant': cardIcon
};

// Ses dosyaları mapping
const getVoiceAudioPath = (scenario: string, lang: 'tr' | 'en'): string => {
  return `/audio/voice-cloning/${scenario}-${lang}.mp3`;
};

interface MobileVoiceCloningDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

// Senaryolar
const scenarios = {
  tr: {
    'professional': {
      title: 'Profesyonel Seslendirme',
      desc: 'Kurumsal videolar için',
      sampleText: 'Allync AI ile işletmenizi geleceğe taşıyın. Yapay zeka destekli çözümlerimiz, müşteri deneyiminizi bir üst seviyeye çıkarır.',
      voiceType: 'Professional',
      duration: '8s'
    },
    'commercial': {
      title: 'Reklam Sesi',
      desc: 'Enerjik seslendirme',
      sampleText: 'Kaçırılmayacak fırsat! Sadece bu hafta, tüm ürünlerde yüzde elli indirim. Hemen sipariş verin!',
      voiceType: 'Energetic',
      duration: '6s'
    },
    'narrator': {
      title: 'Anlatıcı Ses',
      desc: 'Hikaye anlatımı için',
      sampleText: 'Yüzyıllar önce, bu topraklarda büyük bir medeniyet yaşardı. Onların hikayeleri hâlâ rüzgârda fısıldanır.',
      voiceType: 'Calm',
      duration: '10s'
    },
    'assistant': {
      title: 'Asistan Sesi',
      desc: 'IVR ve sesli asistan',
      sampleText: 'Merhaba, Allync AI asistanına hoş geldiniz. Size nasıl yardımcı olabilirim? Lütfen seçeneklerden birini söyleyin.',
      voiceType: 'Friendly',
      duration: '7s'
    }
  },
  en: {
    'professional': {
      title: 'Professional Voiceover',
      desc: 'For corporate videos',
      sampleText: 'Take your business to the future with Allync AI. Our AI-powered solutions elevate your customer experience to the next level.',
      voiceType: 'Professional',
      duration: '8s'
    },
    'commercial': {
      title: 'Commercial Voice',
      desc: 'Energetic voiceover',
      sampleText: 'Don\'t miss this opportunity! Fifty percent off all products this week only. Order now!',
      voiceType: 'Energetic',
      duration: '6s'
    },
    'narrator': {
      title: 'Narrator Voice',
      desc: 'For storytelling',
      sampleText: 'Centuries ago, a great civilization lived on these lands. Their stories are still whispered in the wind.',
      voiceType: 'Calm',
      duration: '10s'
    },
    'assistant': {
      title: 'Assistant Voice',
      desc: 'IVR and voice assistant',
      sampleText: 'Hello, welcome to Allync AI assistant. How can I help you? Please say one of the options.',
      voiceType: 'Friendly',
      duration: '7s'
    }
  }
};

const uiText = {
  tr: {
    selectScenario: 'Ses Türü Seçin',
    sampleText: 'Örnek Metin',
    generating: 'Ses Oluşturuluyor...',
    complete: 'Ses Hazır!',
    restart: 'Tekrar Oluştur',
    backToHome: 'Ana Ekrana Dön',
    tooltip: "Demo'yu Başlat!",
    weather: 'Hava Durumu',
    music: 'Müzik',
    playNow: 'Şimdi Çal',
    nowPlaying: 'Şimdi Çalıyor',
    analyzing: 'Ses profili analiz ediliyor...',
    cloning: 'Ses klonlanıyor...',
    synthesizing: 'Konuşma sentezleniyor...',
    enhancing: 'Ses kalitesi iyileştiriliyor...',
    voiceType: 'Ses Tipi',
    duration: 'Süre',
    playing: 'Oynatılıyor',
    paused: 'Duraklatıldı',
    originalVoice: 'Orijinal Ses',
    clonedVoice: 'Klonlanmış Ses'
  },
  en: {
    selectScenario: 'Select Voice Type',
    sampleText: 'Sample Text',
    generating: 'Generating Voice...',
    complete: 'Voice Ready!',
    restart: 'Create Again',
    backToHome: 'Back to Home',
    tooltip: 'Start Demo!',
    weather: 'Weather',
    music: 'Music',
    playNow: 'Play Now',
    nowPlaying: 'Now Playing',
    analyzing: 'Analyzing voice profile...',
    cloning: 'Cloning voice...',
    synthesizing: 'Synthesizing speech...',
    enhancing: 'Enhancing voice quality...',
    voiceType: 'Voice Type',
    duration: 'Duration',
    playing: 'Playing',
    paused: 'Paused',
    originalVoice: 'Original Voice',
    clonedVoice: 'Cloned Voice'
  }
};

// Generation steps
const generationSteps = ['analyzing', 'cloning', 'synthesizing', 'enhancing'];

// Waveform bar heights
const waveformBars = Array.from({ length: 20 }, () => Math.random() * 40 + 20);

export const MobileVoiceCloningDemo: React.FC<MobileVoiceCloningDemoProps> = ({
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
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(0);
  // Dynamic Island states
  const [dynamicIslandState, setDynamicIslandState] = useState<'collapsed' | 'compact' | 'expanded'>('collapsed');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [voiceCurrentTime, setVoiceCurrentTime] = useState(0);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
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
    document.body.classList.add('mvc-modal-open');
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.classList.remove('mvc-modal-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (voiceAudioRef.current) {
        voiceAudioRef.current.pause();
      }
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

  // Voice audio initialization and event handlers
  useEffect(() => {
    return () => {
      if (voiceAudioRef.current) {
        voiceAudioRef.current.pause();
        voiceAudioRef.current = null;
      }
    };
  }, []);

  // Load voice audio when scenario changes or generation completes
  useEffect(() => {
    if (demoPhase === 'complete' && currentScenario) {
      const audioPath = getVoiceAudioPath(currentScenario, language);
      voiceAudioRef.current = new Audio(audioPath);
      voiceAudioRef.current.volume = 1;

      const handleLoadedMetadata = () => {
        if (voiceAudioRef.current) {
          setVoiceDuration(voiceAudioRef.current.duration);
        }
      };

      const handleTimeUpdate = () => {
        if (voiceAudioRef.current) {
          setVoiceCurrentTime(voiceAudioRef.current.currentTime);
          const progress = (voiceAudioRef.current.currentTime / voiceAudioRef.current.duration) * 100;
          setVoiceProgress(progress);
        }
      };

      const handleEnded = () => {
        setIsVoicePlaying(false);
        setVoiceProgress(0);
        setVoiceCurrentTime(0);
      };

      voiceAudioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      voiceAudioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      voiceAudioRef.current.addEventListener('ended', handleEnded);

      return () => {
        if (voiceAudioRef.current) {
          voiceAudioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
          voiceAudioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          voiceAudioRef.current.removeEventListener('ended', handleEnded);
          voiceAudioRef.current.pause();
        }
      };
    }
  }, [demoPhase, currentScenario, language]);

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
    setIsVoicePlaying(false);
    setVoiceProgress(0);
    setVoiceCurrentTime(0);
    setVoiceDuration(0);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
    }
  };

  const handleClose = () => {
    setIsMusicPlaying(false);
    setDynamicIslandState('collapsed');
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
    }
    if (onClose) {
      onClose();
    }
  };

  const handleContactNavigation = () => {
    setIsMusicPlaying(false);
    setDynamicIslandState('collapsed');
    document.body.classList.remove('mvc-modal-open');
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
    setIsVoicePlaying(false);
    setVoiceProgress(0);

    const scenario = scenarioData[scenarioKey as keyof typeof scenarioData];
    const sampleText = scenario.sampleText;
    let index = 0;

    // Typing animation
    const typeNext = () => {
      if (index < sampleText.length) {
        setTypedText(sampleText.slice(0, index + 1));
        index++;
        timeoutRef.current = setTimeout(typeNext, 20 + Math.random() * 10);
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
    setIsVoicePlaying(false);
    setVoiceProgress(0);
    setVoiceCurrentTime(0);
    setVoiceDuration(0);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
    }
  };

  const restartDemo = () => {
    if (currentScenario) {
      if (voiceAudioRef.current) {
        voiceAudioRef.current.pause();
        voiceAudioRef.current.currentTime = 0;
      }
      setDemoPhase('typing');
      setTypedText('');
      setCurrentStep(0);
      setProgress(0);
      setIsVoicePlaying(false);
      setVoiceProgress(0);
      setVoiceCurrentTime(0);
      setVoiceDuration(0);
      selectScenario(currentScenario);
    }
  };

  const toggleVoicePlayback = () => {
    if (!voiceAudioRef.current) return;

    if (isVoicePlaying) {
      voiceAudioRef.current.pause();
      setIsVoicePlaying(false);
    } else {
      voiceAudioRef.current.play().catch(console.error);
      setIsVoicePlaying(true);
    }
  };

  // Format time helper
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return createPortal(
    <div className="mvc-overlay">
      <div className="mvc-iphone-container">
        <div className="mvc-iphone-frame">
          {/* Side Buttons */}
          <div className="mvc-side-button mvc-silent-switch" />
          <div className="mvc-side-button mvc-volume-up" />
          <div className="mvc-side-button mvc-volume-down" />
          <div className="mvc-side-button mvc-power-button" />

          <div className="mvc-iphone-screen">
            {/* Wallpaper */}
            <div className="mvc-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`mvc-dynamic-island mvc-di-state-${dynamicIslandState}`}
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
              <div className="mvc-di-collapsed-content">
                <div className="mvc-di-camera" />
                <div className="mvc-di-sensor" />
              </div>

              {/* Compact Content */}
              <div className="mvc-di-compact-content">
                <div className="mvc-di-compact-left">
                  <div className="mvc-di-compact-album">
                    <img src={albumCover} alt="Album" className="mvc-di-album-img" />
                  </div>
                  <div className="mvc-di-compact-info">
                    <span className="mvc-di-compact-title">Blinding Lights</span>
                    <span className="mvc-di-compact-artist">The Weeknd</span>
                  </div>
                </div>
                <div className="mvc-di-compact-waves">
                  <div className="mvc-di-wave-bar" />
                  <div className="mvc-di-wave-bar" />
                  <div className="mvc-di-wave-bar" />
                </div>
              </div>

              {/* Expanded Content */}
              <div className="mvc-di-expanded-content">
                <div className="mvc-di-music-left">
                  <div className="mvc-di-album">
                    <img src={albumCover} alt="Album" className="mvc-di-album-img" />
                  </div>
                  <div className="mvc-di-track-info">
                    <h4>Blinding Lights</h4>
                    <p>The Weeknd</p>
                  </div>
                </div>
                <div className="mvc-di-music-right">
                  <div className="mvc-di-wave-bar" />
                  <div className="mvc-di-wave-bar" />
                  <div className="mvc-di-wave-bar" />
                  <div className="mvc-di-wave-bar" />
                  <div className="mvc-di-wave-bar" />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mvc-status-bar">
              <div className="mvc-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="mvc-status-right">
                <div className="mvc-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <span className="mvc-5g">5G</span>
                <div className="mvc-battery">
                  <div className="mvc-battery-body">
                    <div className="mvc-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`mvc-home-screen ${isAppOpen ? 'mvc-hidden' : ''}`}>
              {/* Volume HUD */}
              <div className={`mvc-volume-hud ${showVolumeControl ? 'mvc-volume-hud-visible' : ''}`}>
                <div className="mvc-volume-hud-container">
                  <div className="mvc-volume-hud-icon">
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
                  <div className="mvc-volume-hud-slider">
                    <div className="mvc-volume-hud-track">
                      <div
                        className="mvc-volume-hud-fill"
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
                      className="mvc-volume-hud-input"
                    />
                  </div>
                </div>
              </div>

              {/* Time Widget */}
              <div className="mvc-time-widget">
                <div className="mvc-time">{currentTime}</div>
                <div className="mvc-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="mvc-widgets-container">
                <div className="mvc-widget">
                  <div className="mvc-widget-header">
                    <div className="mvc-widget-icon mvc-weather-icon">
                      <img src={sunIcon} alt="Weather" className="mvc-widget-icon-img" />
                    </div>
                    <span>{t.weather}</span>
                  </div>
                  <div className="mvc-weather-temp">18°</div>
                  <div className="mvc-weather-desc">{language === 'tr' ? 'Açık, H:22° L:14°' : 'Clear, H:72° L:57°'}</div>
                </div>
                <div
                  className="mvc-widget"
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
                  <div className="mvc-widget-header">
                    <div className="mvc-widget-icon mvc-music-icon">
                      <img src={musicIcon} alt="Music" className="mvc-widget-icon-img" />
                    </div>
                    <span>{t.music}</span>
                  </div>
                  <div className="mvc-music-playing">
                    <div className="mvc-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="mvc-album-img" />
                    </div>
                    <div className="mvc-music-info">
                      <h4>{isMusicPlaying ? t.nowPlaying : t.playNow}</h4>
                      <p>Blinding Lights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="mvc-dock">
                <div className="mvc-dock-icon mvc-close-icon" onClick={handleClose}>
                  <span className="mvc-close-tooltip">{language === 'tr' ? 'Çıkış' : 'Exit'} ✕</span>
                  <img src={closeIcon} alt="Close" className="mvc-close-img" />
                </div>
                <div className="mvc-dock-icon mvc-network-icon" onClick={handleContactNavigation}>
                  <img src={networkIcon} alt="Network" className="mvc-icon-img" />
                </div>
                <div className="mvc-dock-icon mvc-call-icon" onClick={handleContactNavigation}>
                  <img src={callOutlineIcon} alt="Call" className="mvc-icon-img" />
                </div>
                <div className="mvc-dock-icon mvc-app-icon" onClick={openApp}>
                  <span className="mvc-app-tooltip">{t.tooltip}</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </div>
              </div>
            </div>

            {/* App */}
            <div className={`mvc-app ${isAppOpen ? 'mvc-active' : ''}`}>
              {/* Scenario Screen */}
              {showScenarioScreen && (
                <div className="mvc-scenario-screen">
                  <div className="mvc-scenario-header">
                    <div className="mvc-logo">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="mvc-info">
                      <h3>Allync AI</h3>
                      <p>{t.selectScenario}</p>
                    </div>
                    <button className="mvc-close-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="mvc-scenario-list">
                    {Object.entries(scenarioData).map(([key, scenario]) => (
                      <button
                        key={key}
                        className="mvc-scenario-item"
                        onClick={() => selectScenario(key)}
                      >
                        <div className={`mvc-scenario-icon-wrapper ${key}`}>
                          <img src={scenarioIcons[key]} alt={scenario.title} className="mvc-scenario-icon" />
                        </div>
                        <div className="mvc-text">
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
                <div className="mvc-demo-screen">
                  <div className="mvc-demo-header">
                    <button className="mvc-back-btn" onClick={goBack}>
                      <img src={backwardIcon} alt="Back" className="mvc-back-img" />
                    </button>
                    <div className="mvc-profile">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="mvc-info">
                      <h3>Allync AI</h3>
                      <p>{scenarioData[currentScenario as keyof typeof scenarioData].title}</p>
                    </div>
                    <button className="mvc-action-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="mvc-demo-content">
                    {/* Sample Text Section */}
                    <div className="mvc-prompt-section">
                      <div className="mvc-prompt-label">
                        <span className="mvc-sparkle">🎙️</span> {t.sampleText}
                      </div>
                      <div className="mvc-prompt-box">
                        <p>
                          {typedText}
                          {demoPhase === 'typing' && <span className="mvc-cursor">|</span>}
                        </p>
                      </div>
                    </div>

                    {/* Generation Progress */}
                    {demoPhase === 'generating' && (
                      <div className="mvc-generation">
                        <div className="mvc-gen-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" y1="19" x2="12" y2="23" />
                            <line x1="8" y1="23" x2="16" y2="23" />
                          </svg>
                        </div>
                        <h4>{t.generating}</h4>

                        {/* Waveform Animation */}
                        <div className="mvc-waveform">
                          {waveformBars.map((height, i) => (
                            <div
                              key={i}
                              className="mvc-waveform-bar"
                              style={{
                                animationDelay: `${i * 0.05}s`,
                                height: `${height}%`
                              }}
                            />
                          ))}
                        </div>

                        <div className="mvc-progress-bar">
                          <div className="mvc-progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="mvc-steps">
                          {generationSteps.map((step, index) => (
                            <div
                              key={step}
                              className={`mvc-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                            >
                              <div className="mvc-step-indicator">
                                {index < currentStep ? (
                                  <img src={checkIcon} alt="Done" />
                                ) : index === currentStep ? (
                                  <div className="mvc-step-dot active" />
                                ) : (
                                  <div className="mvc-step-dot" />
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
                      <div className="mvc-complete">
                        <div className="mvc-success-icon">
                          <img src={checkIcon} alt="Success" />
                        </div>
                        <h4>{t.complete}</h4>

                        {/* Audio Player */}
                        <div className="mvc-audio-player">
                          {/* Waveform */}
                          <div className="mvc-player-waveform">
                            {waveformBars.map((height, i) => (
                              <div
                                key={i}
                                className={`mvc-player-bar ${isVoicePlaying ? 'playing' : ''}`}
                                style={{
                                  animationDelay: `${i * 0.05}s`,
                                  height: `${height}%`
                                }}
                              />
                            ))}
                          </div>

                          {/* Progress Bar */}
                          <div className="mvc-player-progress">
                            <div
                              className="mvc-player-progress-fill"
                              style={{ width: `${voiceProgress}%` }}
                            />
                          </div>

                          {/* Time */}
                          <div className="mvc-player-time">
                            <span>{formatTime(voiceCurrentTime)}</span>
                            <span>{formatTime(voiceDuration)}</span>
                          </div>

                          {/* Play Button */}
                          <button className="mvc-play-btn" onClick={toggleVoicePlayback}>
                            {isVoicePlaying ? (
                              <svg viewBox="0 0 24 24" fill="white">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                              </svg>
                            ) : (
                              <svg viewBox="0 0 24 24" fill="white">
                                <polygon points="5,3 19,12 5,21" />
                              </svg>
                            )}
                          </button>

                          {/* Status */}
                          <div className="mvc-player-status">
                            {isVoicePlaying ? t.playing : t.paused}
                          </div>
                        </div>

                        {/* Voice Info */}
                        <div className="mvc-voice-info">
                          <div className="mvc-info-item">
                            <span className="mvc-info-label">{t.voiceType}</span>
                            <span className="mvc-info-value">{scenarioData[currentScenario as keyof typeof scenarioData].voiceType}</span>
                          </div>
                          <div className="mvc-info-item">
                            <span className="mvc-info-label">{t.duration}</span>
                            <span className="mvc-info-value">{scenarioData[currentScenario as keyof typeof scenarioData].duration}</span>
                          </div>
                        </div>

                        {/* Voice Comparison */}
                        <div className="mvc-voice-comparison">
                          <div className="mvc-voice-row mvc-original">
                            <div className="mvc-voice-icon">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 9v6h4l5 5V4L7 9H3z"/>
                              </svg>
                            </div>
                            <span>{t.originalVoice}</span>
                            <div className="mvc-voice-line" />
                          </div>
                          <div className={`mvc-voice-row mvc-cloned ${isVoicePlaying ? 'playing' : ''}`}>
                            <div className="mvc-voice-icon">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 9v6h4l5 5V4L7 9H3z"/>
                              </svg>
                            </div>
                            <span>{t.clonedVoice}</span>
                            <div className="mvc-voice-line" />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mvc-demo-actions">
                          <button className="mvc-restart-btn" onClick={restartDemo}>
                            🔄 {t.restart}
                          </button>
                          <button className="mvc-back-home-btn" onClick={closeApp}>
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
            <div className="mvc-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="mvc-screen-reflection" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
