import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './DesktopDataAnalysisDemo.css';

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

interface DesktopDataAnalysisDemoProps {
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
      <svg viewBox="0 0 100 40" className="dda-chart-svg">
        <path
          d="M 0 35 Q 15 30, 25 25 T 50 20 T 75 10 T 100 5"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          className={animated ? 'dda-line-animate' : ''}
        />
        <path
          d="M 0 35 Q 15 30, 25 25 T 50 20 T 75 10 T 100 5 V 40 H 0 Z"
          fill="rgba(245, 158, 11, 0.2)"
          className={animated ? 'dda-area-fade' : ''}
        />
      </svg>
    );
  }

  if (type === 'bar') {
    const bars = [65, 45, 80, 55, 90, 70, 85];
    return (
      <svg viewBox="0 0 100 40" className="dda-chart-svg">
        {bars.map((height, i) => (
          <rect
            key={i}
            x={i * 14 + 2}
            y={40 - (height * 0.4)}
            width="10"
            height={height * 0.4}
            fill="#f59e0b"
            rx="2"
            className={animated ? 'dda-bar-animate' : ''}
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
      <svg viewBox="0 0 40 40" className="dda-chart-svg dda-pie-chart">
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
            className={animated ? 'dda-pie-animate' : ''}
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </svg>
    );
  }

  // Area chart
  return (
    <svg viewBox="0 0 100 40" className="dda-chart-svg">
      <defs>
        <linearGradient id="ddaAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path
        d="M 0 35 Q 10 32, 20 28 T 40 22 T 60 18 T 80 12 T 100 8 V 40 H 0 Z"
        fill="url(#ddaAreaGrad)"
        className={animated ? 'dda-area-fade' : ''}
      />
      <path
        d="M 0 35 Q 10 32, 20 28 T 40 22 T 60 18 T 80 12 T 100 8"
        fill="none"
        stroke="#f59e0b"
        strokeWidth="2"
        className={animated ? 'dda-line-animate' : ''}
      />
    </svg>
  );
};

export const DesktopDataAnalysisDemo: React.FC<DesktopDataAnalysisDemoProps> = ({
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
    document.body.classList.add('dda-modal-open');

    return () => {
      document.body.classList.remove('dda-modal-open');
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

  // Calculate 3D transform based on mouse position
  const getPhoneTransform = () => {
    if (!isHovering) return 'rotateY(0deg) rotateX(0deg)';
    const rotateY = mousePosition.x * 6;
    const rotateX = -mousePosition.y * 4;
    return `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  };

  const insights = [t.insight1, t.insight2, t.insight3, t.insight4, t.insight5];

  return createPortal(
    <div className={`dda-overlay ${isVisible ? 'dda-visible' : ''} ${isClosing ? 'dda-closing' : ''}`} onClick={handleClose}>
      <div
        className={`dda-iphone-container ${isVisible ? 'dda-visible' : ''} ${isClosing ? 'dda-closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >

        <div
          className="dda-iphone-frame"
          ref={phoneRef}
          style={{ transform: getPhoneTransform() }}
        >
          {/* Side Buttons */}
          <div className="dda-side-button dda-silent-switch" />
          <div className="dda-side-button dda-volume-up" />
          <div className="dda-side-button dda-volume-down" />
          <div className="dda-side-button dda-power-button" />

          <div className="dda-iphone-screen">
            {/* Wallpaper */}
            <div className="dda-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`dda-dynamic-island dda-di-state-${dynamicIslandState}`}
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
              <div className="dda-di-collapsed-content">
                <div className="dda-di-camera" />
                <div className="dda-di-sensor" />
              </div>

              {/* Compact Content */}
              <div className="dda-di-compact-content">
                <div className="dda-di-compact-left">
                  <div className="dda-di-compact-album">
                    <img src={albumCover} alt="Album" className="dda-di-album-img" />
                  </div>
                  <div className="dda-di-compact-info">
                    <span className="dda-di-compact-title">Blinding Lights</span>
                    <span className="dda-di-compact-artist">The Weeknd</span>
                  </div>
                </div>
                <div className="dda-di-compact-waves">
                  <div className="dda-di-wave-bar" />
                  <div className="dda-di-wave-bar" />
                  <div className="dda-di-wave-bar" />
                </div>
              </div>

              {/* Expanded Content */}
              <div className="dda-di-expanded-content">
                <div className="dda-di-music-left">
                  <div className="dda-di-album">
                    <img src={albumCover} alt="Album" className="dda-di-album-img" />
                  </div>
                  <div className="dda-di-track-info">
                    <h4>Blinding Lights</h4>
                    <p>The Weeknd</p>
                  </div>
                </div>
                <div className="dda-di-music-right">
                  <div className="dda-di-wave-bar" />
                  <div className="dda-di-wave-bar" />
                  <div className="dda-di-wave-bar" />
                  <div className="dda-di-wave-bar" />
                  <div className="dda-di-wave-bar" />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="dda-status-bar">
              <div className="dda-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="dda-status-right">
                <div className="dda-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <span className="dda-5g">5G</span>
                <div className="dda-battery">
                  <div className="dda-battery-body">
                    <div className="dda-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`dda-home-screen ${isAppOpen ? 'dda-hidden' : ''}`}>
              {/* Volume HUD */}
              <div className={`dda-volume-hud ${showVolumeControl ? 'dda-volume-hud-visible' : ''}`}>
                <div className="dda-volume-hud-container">
                  <div className="dda-volume-hud-icon">
                    <svg viewBox="0 0 24 24" fill="white">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                  </div>
                  <div className="dda-volume-hud-slider">
                    <div className="dda-volume-hud-track">
                      <div className="dda-volume-hud-fill" style={{ width: `${volume * 100}%` }} />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="dda-volume-hud-input"
                    />
                  </div>
                </div>
              </div>

              {/* Time Widget */}
              <div className="dda-time-widget">
                <div className="dda-time">{currentTime}</div>
                <div className="dda-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="dda-widgets-container">
                <div className="dda-widget dda-widget-hover">
                  <div className="dda-widget-header">
                    <div className="dda-widget-icon dda-weather-icon">
                      <img src={sunIcon} alt="Weather" className="dda-widget-icon-img" />
                    </div>
                    <span>{t.weather}</span>
                  </div>
                  <div className="dda-weather-temp">18°</div>
                  <div className="dda-weather-desc">{language === 'tr' ? 'Açık, H:22° L:14°' : 'Clear, H:72° L:57°'}</div>
                </div>
                <div
                  className="dda-widget dda-widget-hover"
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
                  <div className="dda-widget-header">
                    <div className="dda-widget-icon dda-music-icon">
                      <img src={musicIcon} alt="Music" className="dda-widget-icon-img" />
                    </div>
                    <span>{t.music}</span>
                  </div>
                  <div className="dda-music-playing">
                    <div className="dda-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="dda-album-img" />
                    </div>
                    <div className="dda-music-info">
                      <h4>{isMusicPlaying ? t.nowPlaying : t.playNow}</h4>
                      <p>Blinding Lights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="dda-dock">
                <div className="dda-dock-icon dda-close-icon dda-dock-hover" onClick={handleClose}>
                  <span className="dda-close-tooltip">{language === 'tr' ? 'Çıkış' : 'Exit'} ✕</span>
                  <img src={closeIcon} alt="Close" className="dda-close-img" />
                </div>
                <div className="dda-dock-icon dda-network-icon dda-dock-hover" onClick={handleContactNavigation}>
                  <span className="dda-network-tooltip">{language === 'tr' ? 'İletişime Geçin' : 'Contact Us'}</span>
                  <img src={networkIcon} alt="Contact" className="dda-icon-img" />
                </div>
                <div className="dda-dock-icon dda-call-icon dda-dock-hover" onClick={handleContactNavigation}>
                  <img src={callIcon} alt="Call" className="dda-icon-img" />
                </div>
                <div className="dda-dock-icon dda-app-icon dda-dock-hover" onClick={openApp}>
                  <span className="dda-app-tooltip">{t.tooltip}</span>
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
            <div className={`dda-app ${isAppOpen ? 'dda-active' : ''}`}>
              {/* Scenario Screen */}
              {showScenarioScreen && (
                <div className="dda-scenario-screen">
                  <div className="dda-scenario-header">
                    <div className="dda-logo">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="dda-info">
                      <h3>Allync AI</h3>
                      <p>{t.selectScenario}</p>
                    </div>
                    <button className="dda-close-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="dda-scenario-list">
                    {Object.entries(scenarioData).map(([key, scenario]) => (
                      <button
                        key={key}
                        className="dda-scenario-item"
                        onClick={() => selectScenario(key)}
                      >
                        <div className={`dda-scenario-icon-wrapper ${key}`}>
                          <img src={scenarioIcons[key]} alt={scenario.title} className="dda-scenario-icon" />
                        </div>
                        <div className="dda-text">
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
                <div className="dda-demo-screen">
                  <div className="dda-demo-header">
                    <button className="dda-back-btn" onClick={goBack}>
                      <img src={backwardIcon} alt="Back" className="dda-back-img" />
                    </button>
                    <div className="dda-profile">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="dda-info">
                      <h3>Allync AI</h3>
                      <p>{scenarioData[currentScenario as keyof typeof scenarioData].title}</p>
                    </div>
                    <button className="dda-action-btn" onClick={closeApp}>✕</button>
                  </div>

                  <div className="dda-demo-content">
                    {/* Preview Phase */}
                    {demoPhase === 'preview' && (
                      <>
                        {/* Data Preview */}
                        <div className="dda-source-section">
                          <div className="dda-source-label">
                            <span className="dda-sparkle">📊</span> {language === 'tr' ? 'Veri Seti' : 'Data Set'}
                          </div>
                          <div className="dda-data-placeholder">
                            <div className="dda-data-icon">📈</div>
                            <p>{language === 'tr' ? 'Veriler Hazır' : 'Data Ready'}</p>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="dda-prompt-section">
                          <div className="dda-prompt-label">
                            <span className="dda-sparkle">📝</span> {t.prompt}
                          </div>
                          <div className="dda-prompt-box">
                            <p>{scenarioData[currentScenario as keyof typeof scenarioData].prompt}</p>
                          </div>
                        </div>

                        {/* Info Tags */}
                        <div className="dda-info-tags">
                          <div className="dda-info-tag">
                            <span className="dda-info-label">{t.type}</span>
                            <span className="dda-info-value">{scenarioData[currentScenario as keyof typeof scenarioData].analysisType}</span>
                          </div>
                          <div className="dda-info-tag">
                            <span className="dda-info-label">{t.metrics}</span>
                            <span className="dda-info-value">{scenarioData[currentScenario as keyof typeof scenarioData].metrics.length}</span>
                          </div>
                        </div>

                        {/* Start Button */}
                        <button className="dda-start-btn" onClick={startAnalysis}>
                          📊 {t.startAnalysis}
                        </button>
                      </>
                    )}

                    {/* Analyzing Phase */}
                    {demoPhase === 'analyzing' && (
                      <div className="dda-analyzing">
                        <div className="dda-analyzing-preview">
                          <div className="dda-analyzing-animation">
                            <div className="dda-analyzing-icon">📊</div>
                          </div>
                          <div className="dda-analyzing-progress" style={{ width: `${progress}%` }} />
                          <div className="dda-analyzing-percentage">{Math.round(progress)}%</div>
                        </div>

                        <h4>{t.analyzing}</h4>

                        <div className="dda-progress-bar">
                          <div className="dda-progress-fill" style={{ width: `${progress}%` }} />
                        </div>

                        <div className="dda-steps">
                          {analysisSteps.map((step, index) => (
                            <div
                              key={step}
                              className={`dda-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                            >
                              <div className="dda-step-indicator">
                                {index < currentStep ? (
                                  <img src={checkIcon} alt="Done" />
                                ) : index === currentStep ? (
                                  <div className="dda-step-dot active" />
                                ) : (
                                  <div className="dda-step-dot" />
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
                      <div className="dda-complete">
                        <div className="dda-success-icon">
                          <img src={checkIcon} alt="Success" />
                        </div>
                        <h4>{t.complete}</h4>

                        {/* Metrics */}
                        <div className="dda-metrics-section">
                          <div className="dda-section-label">{t.metrics}</div>
                          <div className="dda-metrics-grid">
                            {scenarioData[currentScenario as keyof typeof scenarioData].metrics
                              .slice(0, visibleMetrics)
                              .map((metric, index) => (
                                <div key={index} className="dda-metric-card">
                                  <div className="dda-metric-label">{metric.label}</div>
                                  <div className="dda-metric-value">{metric.value}</div>
                                  <div className={`dda-metric-change ${metric.isPositive ? 'positive' : 'negative'}`}>
                                    {metric.isPositive ? '↑' : '↓'} {metric.change}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Chart */}
                        <div className="dda-chart-section">
                          <div className="dda-section-label">{t.chart}</div>
                          <div className="dda-chart-container">
                            <MiniChart
                              type={scenarioData[currentScenario as keyof typeof scenarioData].chartType}
                              animated={true}
                            />
                          </div>
                        </div>

                        {/* AI Insights */}
                        <div className="dda-insights-section">
                          <div className="dda-section-label">{t.insights}</div>
                          <div className="dda-insights-list">
                            {insights.slice(0, visibleInsights).map((insight, index) => (
                              <div key={index} className="dda-insight-item">
                                <div className="dda-insight-number">{index + 1}</div>
                                <p>{insight}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="dda-demo-actions">
                          <button className="dda-restart-btn" onClick={restartDemo}>
                            🔄 {t.restart}
                          </button>
                          <button className="dda-back-home-btn" onClick={closeApp}>
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
            <div className="dda-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="dda-screen-reflection" />
          </div>
        </div>

        {/* Click outside hint */}
        <div className="dda-hint">
          {language === 'tr' ? 'Kapatmak için dışarı tıklayın' : 'Click outside to close'}
        </div>
      </div>
    </div>,
    document.body
  );
};
