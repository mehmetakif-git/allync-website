import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './MobileDataAnalysisDemo.css';

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
  'sales-analytics': cardIcon,
  'customer-behavior': calendarIcon,
  'financial-report': pinIcon,
  'marketing-performance': handIcon
};

interface MobileDataAnalysisDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

// Scenarios
const scenarios = {
  tr: {
    'sales-analytics': {
      title: 'Satış Analizi',
      desc: 'Satış trendleri ve tahminler',
      prompt: 'Son 12 ayın satış verilerini analiz et, trendleri belirle ve gelecek 3 ay için tahmin oluştur.',
      analysisType: 'Sales Analytics',
      metrics: [
        { label: 'Toplam Satış', value: '₺2.4M', change: '+23%', isPositive: true },
        { label: 'Ortalama Sipariş', value: '₺847', change: '+12%', isPositive: true },
        { label: 'Dönüşüm Oranı', value: '4.2%', change: '+0.8%', isPositive: true }
      ],
      chartType: 'line' as const
    },
    'customer-behavior': {
      title: 'Müşteri Davranışı',
      desc: 'Segmentasyon ve davranış analizi',
      prompt: 'Müşteri verilerini analiz et, segmentlere ayır ve satın alma kalıplarını belirle.',
      analysisType: 'Customer Behavior',
      metrics: [
        { label: 'Aktif Müşteri', value: '12.5K', change: '+18%', isPositive: true },
        { label: 'Elde Tutma', value: '67%', change: '+5%', isPositive: true },
        { label: 'NPS Skoru', value: '72', change: '+8', isPositive: true }
      ],
      chartType: 'pie' as const
    },
    'financial-report': {
      title: 'Finansal Rapor',
      desc: 'Gelir-gider analizi',
      prompt: 'Finansal verileri analiz et, kar-zarar durumunu hesapla ve bütçe önerileri oluştur.',
      analysisType: 'Financial Report',
      metrics: [
        { label: 'Net Gelir', value: '₺1.8M', change: '+15%', isPositive: true },
        { label: 'Kar Marjı', value: '24%', change: '+3%', isPositive: true },
        { label: 'Gider Oranı', value: '32%', change: '-4%', isPositive: true }
      ],
      chartType: 'bar' as const
    },
    'marketing-performance': {
      title: 'Pazarlama Performansı',
      desc: 'Kampanya ROI analizi',
      prompt: 'Pazarlama kampanyalarını analiz et, kanal performanslarını karşılaştır ve ROI hesapla.',
      analysisType: 'Marketing Performance',
      metrics: [
        { label: 'Reklam ROI', value: '340%', change: '+45%', isPositive: true },
        { label: 'Tıklama Oranı', value: '3.8%', change: '+0.6%', isPositive: true },
        { label: 'Lead Maliyeti', value: '₺42', change: '-18%', isPositive: true }
      ],
      chartType: 'area' as const
    }
  },
  en: {
    'sales-analytics': {
      title: 'Sales Analytics',
      desc: 'Sales trends and forecasts',
      prompt: 'Analyze last 12 months sales data, identify trends and generate forecast for next 3 months.',
      analysisType: 'Sales Analytics',
      metrics: [
        { label: 'Total Sales', value: '$24K', change: '+23%', isPositive: true },
        { label: 'Avg Order', value: '$847', change: '+12%', isPositive: true },
        { label: 'Conversion', value: '4.2%', change: '+0.8%', isPositive: true }
      ],
      chartType: 'line' as const
    },
    'customer-behavior': {
      title: 'Customer Behavior',
      desc: 'Segmentation and behavior analysis',
      prompt: 'Analyze customer data, segment customers and identify purchasing patterns.',
      analysisType: 'Customer Behavior',
      metrics: [
        { label: 'Active Users', value: '12.5K', change: '+18%', isPositive: true },
        { label: 'Retention', value: '67%', change: '+5%', isPositive: true },
        { label: 'NPS Score', value: '72', change: '+8', isPositive: true }
      ],
      chartType: 'pie' as const
    },
    'financial-report': {
      title: 'Financial Report',
      desc: 'Revenue-expense analysis',
      prompt: 'Analyze financial data, calculate profit-loss and generate budget recommendations.',
      analysisType: 'Financial Report',
      metrics: [
        { label: 'Net Revenue', value: '$18K', change: '+15%', isPositive: true },
        { label: 'Profit Margin', value: '24%', change: '+3%', isPositive: true },
        { label: 'Expense Ratio', value: '32%', change: '-4%', isPositive: true }
      ],
      chartType: 'bar' as const
    },
    'marketing-performance': {
      title: 'Marketing Performance',
      desc: 'Campaign ROI analysis',
      prompt: 'Analyze marketing campaigns, compare channel performance and calculate ROI.',
      analysisType: 'Marketing Performance',
      metrics: [
        { label: 'Ad ROI', value: '340%', change: '+45%', isPositive: true },
        { label: 'CTR', value: '3.8%', change: '+0.6%', isPositive: true },
        { label: 'Cost/Lead', value: '$42', change: '-18%', isPositive: true }
      ],
      chartType: 'area' as const
    }
  }
};

const uiText = {
  tr: {
    selectScenario: 'Analiz Türü Seçin',
    prompt: 'Açıklama',
    analyzing: 'Analiz Ediliyor...',
    complete: 'Analiz Tamamlandı!',
    restart: 'Başka Analiz Yap',
    backToHome: 'Ana Ekrana Dön',
    tooltip: "Demo'yu Başlat!",
    weather: 'Hava Durumu',
    music: 'Müzik',
    playNow: 'Şimdi Çal',
    nowPlaying: 'Şimdi Çalıyor',
    loading: 'Veriler yükleniyor...',
    processing: 'İstatistikler hesaplanıyor...',
    generating: 'Öngörüler oluşturuluyor...',
    visualizing: 'Grafikler hazırlanıyor...',
    type: 'Analiz Türü',
    metrics: 'Metrikler',
    insights: 'AI Öngörüleri',
    chart: 'Görselleştirme',
    startAnalysis: 'Analiz Başlat',
    insight1: 'Satışlar geçen aya göre %23 arttı',
    insight2: 'En yoğun satış saati: 14:00-16:00',
    insight3: 'Mobil kullanıcılar %45 daha fazla harcıyor',
    insight4: 'Müşteri kaybı riski: 12 hesap tespit edildi',
    insight5: 'Öneri: Hafta sonu kampanyaları %30 daha etkili'
  },
  en: {
    selectScenario: 'Select Analysis Type',
    prompt: 'Description',
    analyzing: 'Analyzing...',
    complete: 'Analysis Complete!',
    restart: 'Run Another Analysis',
    backToHome: 'Back to Home',
    tooltip: 'Start Demo!',
    weather: 'Weather',
    music: 'Music',
    playNow: 'Play Now',
    nowPlaying: 'Now Playing',
    loading: 'Loading data...',
    processing: 'Calculating statistics...',
    generating: 'Generating insights...',
    visualizing: 'Preparing charts...',
    type: 'Analysis Type',
    metrics: 'Metrics',
    insights: 'AI Insights',
    chart: 'Visualization',
    startAnalysis: 'Start Analysis',
    insight1: 'Sales increased 23% compared to last month',
    insight2: 'Peak sales hours: 2:00 PM - 4:00 PM',
    insight3: 'Mobile users spend 45% more',
    insight4: 'Churn risk: 12 accounts identified',
    insight5: 'Tip: Weekend campaigns are 30% more effective'
  }
};

// Analysis steps
const analysisSteps = ['loading', 'processing', 'generating', 'visualizing'];

// Mini Chart Component
const MiniChart: React.FC<{ type: 'line' | 'bar' | 'pie' | 'area'; animated: boolean }> = ({ type, animated }) => {
  if (type === 'line') {
    return (
      <svg viewBox="0 0 100 40" className="mda-chart-svg">
        <path
          d="M 0 35 Q 15 30, 25 25 T 50 20 T 75 10 T 100 5"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          className={animated ? 'mda-line-animate' : ''}
        />
        <path
          d="M 0 35 Q 15 30, 25 25 T 50 20 T 75 10 T 100 5 V 40 H 0 Z"
          fill="rgba(245, 158, 11, 0.2)"
          className={animated ? 'mda-area-fade' : ''}
        />
      </svg>
    );
  }

  if (type === 'bar') {
    const bars = [65, 45, 80, 55, 90, 70, 85];
    return (
      <svg viewBox="0 0 100 40" className="mda-chart-svg">
        {bars.map((height, i) => (
          <rect
            key={i}
            x={i * 14 + 2}
            y={40 - (height * 0.4)}
            width="10"
            height={height * 0.4}
            fill="#f59e0b"
            rx="2"
            className={animated ? 'mda-bar-animate' : ''}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </svg>
    );
  }

  if (type === 'pie') {
    const segments = [
      { percent: 35, offset: 0, color: '#f59e0b' },
      { percent: 25, offset: 35, color: '#f59e0bcc' },
      { percent: 20, offset: 60, color: '#f59e0b99' },
      { percent: 20, offset: 80, color: '#f59e0b66' }
    ];
    return (
      <svg viewBox="0 0 40 40" className="mda-chart-svg mda-pie-chart">
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx="20"
            cy="20"
            r="15"
            fill="none"
            stroke={seg.color}
            strokeWidth="8"
            strokeDasharray={`${seg.percent} ${100 - seg.percent}`}
            strokeDashoffset={-seg.offset}
            transform="rotate(-90 20 20)"
            className={animated ? 'mda-pie-animate' : ''}
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </svg>
    );
  }

  // Area chart
  return (
    <svg viewBox="0 0 100 40" className="mda-chart-svg">
      <defs>
        <linearGradient id="mdaAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path
        d="M 0 35 Q 10 32, 20 28 T 40 22 T 60 18 T 80 12 T 100 8 V 40 H 0 Z"
        fill="url(#mdaAreaGrad)"
        className={animated ? 'mda-area-fade' : ''}
      />
      <path
        d="M 0 35 Q 10 32, 20 28 T 40 22 T 60 18 T 80 12 T 100 8"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="2"
        className={animated ? 'mda-line-animate' : ''}
      />
    </svg>
  );
};

export const MobileDataAnalysisDemo: React.FC<MobileDataAnalysisDemoProps> = ({
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
  const [demoPhase, setDemoPhase] = useState<'preview' | 'analyzing' | 'complete'>('preview');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visibleMetrics, setVisibleMetrics] = useState(0);
  const [visibleInsights, setVisibleInsights] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
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
    document.body.classList.add('mda-modal-open');

    return () => {
      document.body.classList.remove('mda-modal-open');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
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
    setVisibleMetrics(0);
    setVisibleInsights(0);
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
    setShowScenarioScreen(false);
    setCurrentScenario(scenarioKey);
    setDemoPhase('preview');
    setCurrentStep(0);
    setProgress(0);
    setVisibleMetrics(0);
    setVisibleInsights(0);
  };

  // Animate results appearing
  const animateResults = useCallback(() => {
    if (!currentScenario) return;
    const scenario = scenarioData[currentScenario as keyof typeof scenarioData];

    let metricIndex = 0;
    const showMetric = () => {
      if (metricIndex >= (scenario?.metrics.length || 3)) {
        animateInsights();
        return;
      }
      metricIndex++;
      setVisibleMetrics(metricIndex);
      timeoutRef.current = setTimeout(showMetric, 300);
    };
    timeoutRef.current = setTimeout(showMetric, 500);
  }, [currentScenario, scenarioData]);

  const animateInsights = useCallback(() => {
    let insightIndex = 0;
    const showInsight = () => {
      if (insightIndex >= 5) {
        return;
      }
      insightIndex++;
      setVisibleInsights(insightIndex);
      timeoutRef.current = setTimeout(showInsight, 400);
    };
    timeoutRef.current = setTimeout(showInsight, 300);
  }, []);

  const startAnalysis = () => {
    setDemoPhase('analyzing');

    let stepIndex = 0;
    let progressValue = 0;

    const updateProgress = () => {
      if (stepIndex >= analysisSteps.length) {
        setProgress(100);
        timeoutRef.current = setTimeout(() => {
          setDemoPhase('complete');
          animateResults();
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
    setVisibleMetrics(0);
    setVisibleInsights(0);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const restartDemo = () => {
    setShowScenarioScreen(true);
    setCurrentScenario(null);
    setDemoPhase('preview');
    setCurrentStep(0);
    setProgress(0);
    setVisibleMetrics(0);
    setVisibleInsights(0);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const insights = [t.insight1, t.insight2, t.insight3, t.insight4, t.insight5];

  return createPortal(
    <div className={`mda-overlay ${isVisible ? 'mda-visible' : ''} ${isClosing ? 'mda-closing' : ''}`} onClick={handleClose}>
      <div
        className={`mda-iphone-container ${isVisible ? 'mda-visible' : ''} ${isClosing ? 'mda-closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
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
                } else if (dynamicIslandState === 'expanded' && isMusicPlaying && isAppOpen) {
                  setDynamicIslandState('compact');
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
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                  </div>
                  <div className="mda-volume-hud-slider">
                    <div className="mda-volume-hud-track">
                      <div className="mda-volume-hud-fill" style={{ width: `${volume * 100}%` }} />
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
                    <span>{t.weather}</span>
                  </div>
                  <div className="mda-weather-temp">18°</div>
                  <div className="mda-weather-desc">{language === 'tr' ? 'Açık' : 'Clear'}</div>
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
                >
                  <div className="mda-widget-header">
                    <div className="mda-widget-icon mda-music-icon">
                      <img src={musicIcon} alt="Music" className="mda-widget-icon-img" />
                    </div>
                    <span>{t.music}</span>
                  </div>
                  <div className="mda-music-playing">
                    <div className="mda-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="mda-album-img" />
                    </div>
                    <div className="mda-music-info">
                      <h4>{isMusicPlaying ? t.nowPlaying : t.playNow}</h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="mda-dock">
                <div className="mda-dock-icon mda-close-icon" onClick={handleClose}>
                  <img src={closeIcon} alt="Close" className="mda-close-img" />
                </div>
                <div className="mda-dock-icon mda-network-icon" onClick={handleContactNavigation}>
                  <img src={networkIcon} alt="Contact" className="mda-icon-img" />
                </div>
                <div className="mda-dock-icon mda-call-icon" onClick={handleContactNavigation}>
                  <img src={callIcon} alt="Call" className="mda-icon-img" />
                </div>
                <div className="mda-dock-icon mda-app-icon" onClick={openApp}>
                  <span className="mda-app-tooltip">{t.tooltip}</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </div>
              </div>
            </div>

            {/* App */}
            <div className={`mda-app ${isAppOpen ? 'mda-active' : ''}`}>
              {/* Scenario Screen */}
              {showScenarioScreen && (
                <div className="mda-scenario-screen">
                  <div className="mda-scenario-header">
                    <div className="mda-logo">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="mda-info">
                      <h3>Allync AI</h3>
                      <p>{t.selectScenario}</p>
                    </div>
                    <button className="mda-close-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="mda-scenario-list">
                    {Object.entries(scenarioData).map(([key, scenario]) => (
                      <button
                        key={key}
                        className="mda-scenario-item"
                        onClick={() => selectScenario(key)}
                      >
                        <div className={`mda-scenario-icon-wrapper ${key}`}>
                          <img src={scenarioIcons[key]} alt={scenario.title} className="mda-scenario-icon" />
                        </div>
                        <div className="mda-text">
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
                <div className="mda-demo-screen">
                  <div className="mda-demo-header">
                    <button className="mda-back-btn" onClick={goBack}>
                      <img src={backwardIcon} alt="Back" className="mda-back-img" />
                    </button>
                    <div className="mda-profile">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="mda-info">
                      <h3>Allync AI</h3>
                      <p>{scenarioData[currentScenario as keyof typeof scenarioData].title}</p>
                    </div>
                    <button className="mda-action-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="mda-demo-content">
                    {/* Preview Phase */}
                    {demoPhase === 'preview' && (
                      <>
                        {/* Data Preview */}
                        <div className="mda-source-section">
                          <div className="mda-source-label">
                            <span className="mda-sparkle">📊</span> {language === 'tr' ? 'Veri Seti' : 'Data Set'}
                          </div>
                          <div className="mda-data-placeholder">
                            <div className="mda-data-icon">📈</div>
                            <p>{language === 'tr' ? 'Veriler Hazır' : 'Data Ready'}</p>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="mda-prompt-section">
                          <div className="mda-prompt-label">
                            <span className="mda-sparkle">📝</span> {t.prompt}
                          </div>
                          <div className="mda-prompt-box">
                            <p>{scenarioData[currentScenario as keyof typeof scenarioData].prompt}</p>
                          </div>
                        </div>

                        {/* Info Tags */}
                        <div className="mda-info-tags">
                          <div className="mda-info-tag">
                            <span className="mda-info-label">{t.type}</span>
                            <span className="mda-info-value">{scenarioData[currentScenario as keyof typeof scenarioData].analysisType}</span>
                          </div>
                          <div className="mda-info-tag">
                            <span className="mda-info-label">{t.metrics}</span>
                            <span className="mda-info-value">{scenarioData[currentScenario as keyof typeof scenarioData].metrics.length}</span>
                          </div>
                        </div>

                        {/* Start Button */}
                        <button className="mda-start-btn" onClick={startAnalysis}>
                          📊 {t.startAnalysis}
                        </button>
                      </>
                    )}

                    {/* Analyzing Phase */}
                    {demoPhase === 'analyzing' && (
                      <div className="mda-analyzing">
                        <div className="mda-analyzing-preview">
                          <div className="mda-analyzing-animation">
                            <div className="mda-analyzing-icon">📊</div>
                          </div>
                          <div className="mda-analyzing-progress" style={{ width: `${progress}%` }} />
                          <div className="mda-analyzing-percentage">{Math.round(progress)}%</div>
                        </div>

                        <h4>{t.analyzing}</h4>

                        <div className="mda-progress-bar">
                          <div className="mda-progress-fill" style={{ width: `${progress}%` }} />
                        </div>

                        <div className="mda-steps">
                          {analysisSteps.map((step, index) => (
                            <div
                              key={step}
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
                              <span>{t[step as keyof typeof t]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Complete Phase */}
                    {demoPhase === 'complete' && (
                      <div className="mda-complete">
                        <div className="mda-success-icon">
                          <img src={checkIcon} alt="Success" />
                        </div>
                        <h4>{t.complete}</h4>

                        {/* Metrics */}
                        <div className="mda-metrics-section">
                          <div className="mda-section-label">{t.metrics}</div>
                          <div className="mda-metrics-grid">
                            {scenarioData[currentScenario as keyof typeof scenarioData].metrics
                              .slice(0, visibleMetrics)
                              .map((metric, index) => (
                                <div key={index} className="mda-metric-card">
                                  <div className="mda-metric-label">{metric.label}</div>
                                  <div className="mda-metric-value">{metric.value}</div>
                                  <div className={`mda-metric-change ${metric.isPositive ? 'positive' : 'negative'}`}>
                                    {metric.isPositive ? '↑' : '↓'} {metric.change}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Chart */}
                        <div className="mda-chart-section">
                          <div className="mda-section-label">{t.chart}</div>
                          <div className="mda-chart-container">
                            <MiniChart
                              type={scenarioData[currentScenario as keyof typeof scenarioData].chartType}
                              animated={true}
                            />
                          </div>
                        </div>

                        {/* AI Insights */}
                        <div className="mda-insights-section">
                          <div className="mda-section-label">{t.insights}</div>
                          <div className="mda-insights-list">
                            {insights.slice(0, visibleInsights).map((insight, index) => (
                              <div key={index} className="mda-insight-item">
                                <div className="mda-insight-number">{index + 1}</div>
                                <p>{insight}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mda-demo-actions">
                          <button className="mda-restart-btn" onClick={restartDemo}>
                            🔄 {t.restart}
                          </button>
                          <button className="mda-back-home-btn" onClick={closeApp}>
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
