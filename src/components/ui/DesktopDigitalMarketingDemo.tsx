import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './DesktopDigitalMarketingDemo.css';

// Assets
import closeIcon from '../../assets/demo-icons/Close_Cross_Circle.svg';
import callIcon from '../../assets/demo-icons/Call_Fill.svg';
import networkIcon from '../../assets/demo-icons/Network.svg';

// Icons
import {
  TrendingUp,
  Users,
  DollarSign,
  MousePointer,
  BarChart3,
  Target,
  Eye,
  Wifi,
  Megaphone,
  Globe,
  Mail,
  ArrowUp,
  ArrowDown,
  X
} from 'lucide-react';

interface DesktopDigitalMarketingDemoProps {
  language: 'tr' | 'en';
  onContactClick: () => void;
  onClose: () => void;
}

type DynamicIslandState = 'collapsed' | 'compact' | 'expanded';
type TabType = 'overview' | 'campaigns' | 'analytics';

// UI Text
const uiText = {
  tr: {
    exit: 'Çıkış',
    contact: 'İletişim',
    openApp: 'Uygulamayı Aç',
    closeHint: 'Kapatmak için dışarı tıklayın'
  },
  en: {
    exit: 'Exit',
    contact: 'Contact',
    openApp: 'Open App',
    closeHint: 'Click outside to close'
  }
};

// Campaign data
const campaigns = {
  tr: [
    { id: 1, name: 'Google Ads - Arama', platform: 'google', budget: 5000, spent: 3420, conversions: 234, status: 'active' },
    { id: 2, name: 'Facebook Lead Gen', platform: 'facebook', budget: 3000, spent: 2180, conversions: 156, status: 'active' },
    { id: 3, name: 'Instagram Stories', platform: 'instagram', budget: 2000, spent: 1890, conversions: 89, status: 'active' },
    { id: 4, name: 'Email Bülteni', platform: 'email', budget: 500, spent: 320, conversions: 67, status: 'paused' },
  ],
  en: [
    { id: 1, name: 'Google Ads - Search', platform: 'google', budget: 5000, spent: 3420, conversions: 234, status: 'active' },
    { id: 2, name: 'Facebook Lead Gen', platform: 'facebook', budget: 3000, spent: 2180, conversions: 156, status: 'active' },
    { id: 3, name: 'Instagram Stories', platform: 'instagram', budget: 2000, spent: 1890, conversions: 89, status: 'active' },
    { id: 4, name: 'Email Newsletter', platform: 'email', budget: 500, spent: 320, conversions: 67, status: 'paused' },
  ]
};

// Traffic sources data
const trafficSources = [
  { name: { tr: 'Organik', en: 'Organic' }, value: 35, color: '#22c55e' },
  { name: { tr: 'Ücretli', en: 'Paid' }, value: 28, color: '#f97316' },
  { name: { tr: 'Sosyal', en: 'Social' }, value: 22, color: '#8b5cf6' },
  { name: { tr: 'Direkt', en: 'Direct' }, value: 15, color: '#06b6d4' },
];

// Weekly performance data
const weeklyData = [
  { day: { tr: 'Pzt', en: 'Mon' }, visitors: 1200 },
  { day: { tr: 'Sal', en: 'Tue' }, visitors: 1450 },
  { day: { tr: 'Çar', en: 'Wed' }, visitors: 1380 },
  { day: { tr: 'Per', en: 'Thu' }, visitors: 1620 },
  { day: { tr: 'Cum', en: 'Fri' }, visitors: 1890 },
  { day: { tr: 'Cmt', en: 'Sat' }, visitors: 980 },
  { day: { tr: 'Paz', en: 'Sun' }, visitors: 850 },
];

const DesktopDigitalMarketingDemo: React.FC<DesktopDigitalMarketingDemoProps> = ({
  language,
  onContactClick,
  onClose
}) => {
  // Entry time for clock (stored once, doesn't update)
  const [entryTime] = useState(() => new Date());
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isAppOpen, setIsAppOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Use refs to avoid re-renders and stale closures
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [dynamicIslandState, setDynamicIslandState] = useState<DynamicIslandState>('collapsed');
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const phoneRef = useRef<HTMLDivElement>(null);
  const t = uiText[language];

  // Handle close
  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setDynamicIslandState('collapsed');
    setTimeout(() => {
      onClose();
    }, 400);
  }, [onClose, isClosing]);

  // Handle contact click
  const handleContactNavigation = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setDynamicIslandState('collapsed');
    setTimeout(() => {
      onClose();
      setTimeout(() => {
        onContactClick();
      }, 100);
    }, 400);
  }, [onClose, onContactClick, isClosing]);

  // Trigger entrance animation
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  // Set time and date from entry time (stored once, doesn't update)
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
    document.body.classList.add('ddm-modal-open');
    return () => {
      document.body.classList.remove('ddm-modal-open');
    };
  }, []);

  // Mouse tracking for 3D effect with RAF optimization
  useEffect(() => {
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!phoneRef.current || !isHoveringRef.current) return;

      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        if (!phoneRef.current || !isHoveringRef.current) return;

        const rect = phoneRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const x = (e.clientX - centerX) / (rect.width / 2);
        const y = (e.clientY - centerY) / (rect.height / 2);

        mousePositionRef.current = { x, y };

        const rotateY = x * 6;
        const rotateX = -y * 4;
        phoneRef.current.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Handle hover state changes
  useEffect(() => {
    if (!isHovering && phoneRef.current) {
      phoneRef.current.style.transform = 'rotateY(0deg) rotateX(0deg)';
    }
  }, [isHovering]);

  // Dynamic Island click handler
  const handleDynamicIslandClick = () => {
    if (dynamicIslandState === 'collapsed') {
      setDynamicIslandState('expanded');
    } else if (dynamicIslandState === 'expanded') {
      if (isAppOpen) {
        setDynamicIslandState('compact');
      } else {
        setDynamicIslandState('collapsed');
      }
    } else if (dynamicIslandState === 'compact') {
      setDynamicIslandState('expanded');
    }
  };

  // Open app
  const openApp = () => {
    setIsAppOpen(true);
    setDynamicIslandState('compact');
  };

  // Close app
  const closeApp = () => {
    setIsAppOpen(false);
    setActiveTab('overview');
    setDynamicIslandState('collapsed');
  };

  // Calculate stats
  const activeCampaigns = campaigns[language].filter(c => c.status === 'active').length;
  const totalConversions = campaigns[language].reduce((sum, c) => sum + c.conversions, 0);

  // Tabs config
  const tabs: { id: TabType; label: { tr: string; en: string }; icon: React.ElementType }[] = [
    { id: 'overview', label: { tr: 'Genel', en: 'Overview' }, icon: Eye },
    { id: 'campaigns', label: { tr: 'Kampanyalar', en: 'Campaigns' }, icon: Target },
    { id: 'analytics', label: { tr: 'Analitik', en: 'Analytics' }, icon: BarChart3 },
  ];

  // Max visitors for chart scaling
  const maxVisitors = Math.max(...weeklyData.map(d => d.visitors));

  const content = (
    <div
      className={`ddm-overlay ${isVisible ? 'ddm-visible' : ''} ${isClosing ? 'ddm-closing' : ''}`}
      onClick={handleClose}
    >
      <div
        className={`ddm-iphone-container ${isVisible ? 'ddm-visible' : ''} ${isClosing ? 'ddm-closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => {
          isHoveringRef.current = true;
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          isHoveringRef.current = false;
          setIsHovering(false);
        }}
      >
        <div className="ddm-iphone-frame" ref={phoneRef}>
          {/* Side buttons */}
          <div className="ddm-side-button ddm-silent-switch" />
          <div className="ddm-side-button ddm-volume-up" />
          <div className="ddm-side-button ddm-volume-down" />
          <div className="ddm-side-button ddm-power-button" />

          <div className="ddm-iphone-screen">
            {/* Wallpaper */}
            <div className="ddm-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`ddm-dynamic-island ddm-di-state-${dynamicIslandState}`}
              onClick={handleDynamicIslandClick}
            >
              {/* Collapsed content */}
              <div className="ddm-di-collapsed-content">
                <div className="ddm-di-camera" />
                <div className="ddm-di-sensor" />
              </div>

              {/* Compact content */}
              <div className="ddm-di-compact-content">
                <div className="ddm-di-compact-left">
                  <div className="ddm-di-compact-icon">
                    <TrendingUp size={16} />
                  </div>
                  <div className="ddm-di-compact-info">
                    <span className="ddm-di-compact-title">
                      {language === 'tr' ? 'Canlı Analitik' : 'Live Analytics'}
                    </span>
                    <span className="ddm-di-compact-subtitle">
                      +12.5% {language === 'tr' ? 'bugün' : 'today'}
                    </span>
                  </div>
                </div>
                <div className="ddm-di-compact-right">
                  <span className="ddm-di-compact-metric">2.4K</span>
                </div>
              </div>

              {/* Expanded content */}
              <div className="ddm-di-expanded-content">
                <div className="ddm-di-status-left">
                  <div className="ddm-di-status-icon">
                    <BarChart3 size={22} />
                  </div>
                  <div className="ddm-di-status-info">
                    <h4>{language === 'tr' ? 'Canlı Analitik' : 'Live Analytics'}</h4>
                    <p>{language === 'tr' ? 'Son 24 saat' : 'Last 24 hours'}</p>
                  </div>
                </div>
                <div className="ddm-di-status-right">
                  <div className="ddm-di-sensor-badge">
                    <span>2.4K</span>
                    <small>{language === 'tr' ? 'ziyaret' : 'visits'}</small>
                  </div>
                  <div className="ddm-di-sensor-badge ddm-positive">
                    <span>+12.5%</span>
                    <small>{language === 'tr' ? 'artış' : 'growth'}</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="ddm-status-bar">
              <div className="ddm-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="ddm-status-right">
                <div className="ddm-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <div className="ddm-wifi-icon">
                  <Wifi size={16} />
                </div>
                <div className="ddm-battery">
                  <div className="ddm-battery-body">
                    <div className="ddm-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`ddm-home-screen ${isAppOpen ? 'ddm-hidden' : ''}`}>
              {/* Time Widget */}
              <div className="ddm-time-widget">
                <div className="ddm-time">{currentTime}</div>
                <div className="ddm-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="ddm-widgets-container">
                {/* Analytics Widget */}
                <div
                  className="ddm-widget ddm-widget-hover"
                  onClick={() => {
                    openApp();
                    setActiveTab('analytics');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="ddm-widget-header">
                    <div className="ddm-widget-icon">
                      <BarChart3 size={16} />
                    </div>
                    <span>{language === 'tr' ? 'Analitik' : 'Analytics'}</span>
                  </div>
                  <div className="ddm-analytics-widget-content">
                    <div className="ddm-analytics-count">
                      12.8K
                    </div>
                    <div className="ddm-analytics-label">
                      {language === 'tr' ? 'Ziyaretçi' : 'Visitors'}
                    </div>
                    <div className="ddm-analytics-trend ddm-positive">
                      <ArrowUp size={12} />
                      <span>8.2%</span>
                    </div>
                  </div>
                </div>

                {/* Campaigns Widget */}
                <div
                  className="ddm-widget ddm-widget-hover"
                  onClick={() => {
                    openApp();
                    setActiveTab('campaigns');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="ddm-widget-header">
                    <div className="ddm-widget-icon">
                      <Target size={16} />
                    </div>
                    <span>{language === 'tr' ? 'Kampanyalar' : 'Campaigns'}</span>
                  </div>
                  <div className="ddm-campaigns-widget-content">
                    <div className="ddm-campaigns-count">
                      {activeCampaigns}<span>/4</span>
                    </div>
                    <div className="ddm-campaigns-label">
                      {language === 'tr' ? 'Aktif' : 'Active'}
                    </div>
                    <div className="ddm-mini-bars">
                      <div className="ddm-mini-bar" style={{ height: '60%' }} />
                      <div className="ddm-mini-bar" style={{ height: '80%' }} />
                      <div className="ddm-mini-bar" style={{ height: '45%' }} />
                      <div className="ddm-mini-bar" style={{ height: '90%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="ddm-dock">
                <div className="ddm-dock-icon ddm-close-icon ddm-dock-hover" onClick={handleClose}>
                  <span className="ddm-close-tooltip">{t.exit} X</span>
                  <img src={closeIcon} alt="Close" className="ddm-close-img" />
                </div>
                <div className="ddm-dock-icon ddm-contact-icon ddm-dock-hover" onClick={handleContactNavigation}>
                  <span className="ddm-contact-tooltip">{t.contact}</span>
                  <img src={networkIcon} alt="Contact" className="ddm-icon-img" />
                </div>
                <div className="ddm-dock-icon ddm-call-icon ddm-dock-hover" onClick={handleContactNavigation}>
                  <img src={callIcon} alt="Call" className="ddm-icon-img" />
                </div>
                <div className="ddm-dock-icon ddm-app-icon ddm-dock-hover" onClick={openApp}>
                  <span className="ddm-app-tooltip">{t.openApp}</span>
                  <Megaphone style={{ width: 28, height: 28, color: 'white' }} />
                </div>
              </div>
            </div>

            {/* App */}
            <div className={`ddm-app ${isAppOpen ? 'ddm-active' : ''}`}>
              <div className="ddm-app-content" onWheel={(e) => e.stopPropagation()}>
                <div className="ddm-marketing-app">
                  {/* Header */}
                  <div className="ddm-marketing-header">
                    <div className="ddm-marketing-header-top">
                      <div className="ddm-marketing-header-left">
                        <div className="ddm-marketing-logo">
                          <Megaphone size={18} />
                        </div>
                        <div className="ddm-marketing-header-text">
                          <h1>{language === 'tr' ? 'Dijital Pazarlama' : 'Digital Marketing'}</h1>
                          <p>
                            {activeCampaigns} {language === 'tr' ? 'aktif kampanya' : 'active campaigns'}
                          </p>
                        </div>
                      </div>
                      <button className="ddm-marketing-settings-btn" onClick={closeApp}>
                        <X size={18} />
                      </button>
                    </div>

                    {/* Tabs */}
                    <div className="ddm-marketing-tabs">
                      {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`ddm-marketing-tab ${activeTab === tab.id ? 'ddm-active' : ''}`}
                          >
                            <Icon size={14} />
                            {tab.label[language]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="ddm-marketing-content">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                      <>
                        {/* Quick Stats */}
                        <div className="ddm-quick-stats">
                          <div className="ddm-stat-card ddm-highlight">
                            <Users size={16} />
                            <p>12.8K</p>
                            <span>{language === 'tr' ? 'Ziyaretçi' : 'Visitors'}</span>
                          </div>
                          <div className="ddm-stat-card">
                            <MousePointer size={16} />
                            <p>{totalConversions}</p>
                            <span>{language === 'tr' ? 'Dönüşüm' : 'Conv.'}</span>
                          </div>
                          <div className="ddm-stat-card">
                            <DollarSign size={16} />
                            <p>45K</p>
                            <span>{language === 'tr' ? 'Gelir' : 'Revenue'}</span>
                          </div>
                        </div>

                        {/* Metrics */}
                        <h3 className="ddm-section-title">
                          {language === 'tr' ? 'Temel Metrikler' : 'Key Metrics'}
                        </h3>
                        <div className="ddm-metrics-list">
                          <div className="ddm-metric-item">
                            <div className="ddm-metric-left">
                              <div className="ddm-metric-icon">
                                <TrendingUp size={16} />
                              </div>
                              <div className="ddm-metric-info">
                                <span className="ddm-metric-name">CTR</span>
                                <span className="ddm-metric-desc">{language === 'tr' ? 'Tıklama Oranı' : 'Click Rate'}</span>
                              </div>
                            </div>
                            <div className="ddm-metric-right">
                              <span className="ddm-metric-value">4.8%</span>
                              <span className="ddm-metric-change ddm-positive">
                                <ArrowUp size={10} />+2.1%
                              </span>
                            </div>
                          </div>
                          <div className="ddm-metric-item">
                            <div className="ddm-metric-left">
                              <div className="ddm-metric-icon">
                                <DollarSign size={16} />
                              </div>
                              <div className="ddm-metric-info">
                                <span className="ddm-metric-name">CPC</span>
                                <span className="ddm-metric-desc">{language === 'tr' ? 'Tıklama Maliyeti' : 'Cost Per Click'}</span>
                              </div>
                            </div>
                            <div className="ddm-metric-right">
                              <span className="ddm-metric-value">₺1.24</span>
                              <span className="ddm-metric-change ddm-negative">
                                <ArrowDown size={10} />-0.3%
                              </span>
                            </div>
                          </div>
                          <div className="ddm-metric-item">
                            <div className="ddm-metric-left">
                              <div className="ddm-metric-icon">
                                <Target size={16} />
                              </div>
                              <div className="ddm-metric-info">
                                <span className="ddm-metric-name">ROAS</span>
                                <span className="ddm-metric-desc">{language === 'tr' ? 'Reklam Getirisi' : 'Return on Ad'}</span>
                              </div>
                            </div>
                            <div className="ddm-metric-right">
                              <span className="ddm-metric-value">3.2x</span>
                              <span className="ddm-metric-change ddm-positive">
                                <ArrowUp size={10} />+0.4x
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Budget Progress */}
                        <div className="ddm-budget-card">
                          <div className="ddm-budget-header">
                            <span>{language === 'tr' ? 'Toplam Bütçe' : 'Total Budget'}</span>
                            <span>₺7.8K / ₺10.5K</span>
                          </div>
                          <div className="ddm-budget-bar">
                            <div className="ddm-budget-fill" style={{ width: '74%' }} />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Campaigns Tab */}
                    {activeTab === 'campaigns' && (
                      <>
                        {/* Campaign Stats */}
                        <div className="ddm-campaign-stats">
                          <div className="ddm-campaign-stat ddm-active-stat">
                            <Target size={16} />
                            <div className="ddm-campaign-stat-value">{activeCampaigns}</div>
                            <div className="ddm-campaign-stat-label">{language === 'tr' ? 'Aktif' : 'Active'}</div>
                          </div>
                          <div className="ddm-campaign-stat ddm-conv-stat">
                            <MousePointer size={16} />
                            <div className="ddm-campaign-stat-value">{totalConversions}</div>
                            <div className="ddm-campaign-stat-label">{language === 'tr' ? 'Dönüşüm' : 'Conv.'}</div>
                          </div>
                          <div className="ddm-campaign-stat ddm-paused-stat">
                            <Eye size={16} />
                            <div className="ddm-campaign-stat-value">1</div>
                            <div className="ddm-campaign-stat-label">{language === 'tr' ? 'Duraklatıldı' : 'Paused'}</div>
                          </div>
                        </div>

                        {/* Campaign List */}
                        <h3 className="ddm-section-title">
                          {language === 'tr' ? 'Kampanyalar' : 'Campaigns'}
                        </h3>
                        <div className="ddm-campaign-list">
                          {campaigns[language].map(campaign => {
                            const progress = (campaign.spent / campaign.budget) * 100;
                            return (
                              <div key={campaign.id} className="ddm-campaign-item">
                                <div className="ddm-campaign-item-header">
                                  <div className="ddm-campaign-platform">
                                    {campaign.platform === 'google' && <Globe size={14} className="ddm-google" />}
                                    {campaign.platform === 'facebook' && <Users size={14} className="ddm-facebook" />}
                                    {campaign.platform === 'instagram' && <Target size={14} className="ddm-instagram" />}
                                    {campaign.platform === 'email' && <Mail size={14} className="ddm-email" />}
                                  </div>
                                  <span className="ddm-campaign-name">{campaign.name}</span>
                                  <span className={`ddm-campaign-status-badge ${campaign.status}`}>
                                    {campaign.status === 'active'
                                      ? (language === 'tr' ? 'Aktif' : 'Active')
                                      : (language === 'tr' ? 'Duraklatıldı' : 'Paused')}
                                  </span>
                                </div>
                                <div className="ddm-campaign-progress">
                                  <div className="ddm-progress-bar">
                                    <div className="ddm-progress-fill" style={{ width: `${progress}%` }} />
                                  </div>
                                  <span className="ddm-progress-text">
                                    ₺{campaign.spent.toLocaleString()} / ₺{campaign.budget.toLocaleString()}
                                  </span>
                                </div>
                                <div className="ddm-campaign-footer">
                                  <span>{campaign.conversions} {language === 'tr' ? 'dönüşüm' : 'conversions'}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 'analytics' && (
                      <>
                        {/* Weekly Chart */}
                        <div className="ddm-chart-card">
                          <h3 className="ddm-chart-title">
                            {language === 'tr' ? 'Haftalık Performans' : 'Weekly Performance'}
                          </h3>
                          <div className="ddm-chart-bars">
                            {weeklyData.map((item, index) => (
                              <div key={index} className="ddm-chart-bar-container">
                                <div
                                  className="ddm-chart-bar"
                                  style={{ height: `${(item.visitors / maxVisitors) * 100}%` }}
                                />
                                <span className="ddm-chart-label">{item.day[language]}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Traffic Sources */}
                        <div className="ddm-donut-card">
                          <h3 className="ddm-chart-title">
                            {language === 'tr' ? 'Trafik Kaynakları' : 'Traffic Sources'}
                          </h3>
                          <div className="ddm-donut-content">
                            <div className="ddm-donut-visual">
                              <svg viewBox="0 0 100 100" className="ddm-donut-svg">
                                {(() => {
                                  const total = trafficSources.reduce((sum, item) => sum + item.value, 0);
                                  let currentAngle = 0;
                                  return trafficSources.map((item, index) => {
                                    const angle = (item.value / total) * 360;
                                    const startAngle = currentAngle;
                                    currentAngle += angle;

                                    const x1 = 50 + 35 * Math.cos((startAngle - 90) * Math.PI / 180);
                                    const y1 = 50 + 35 * Math.sin((startAngle - 90) * Math.PI / 180);
                                    const x2 = 50 + 35 * Math.cos((startAngle + angle - 90) * Math.PI / 180);
                                    const y2 = 50 + 35 * Math.sin((startAngle + angle - 90) * Math.PI / 180);

                                    const largeArc = angle > 180 ? 1 : 0;

                                    return (
                                      <path
                                        key={index}
                                        d={`M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                        fill={item.color}
                                      />
                                    );
                                  });
                                })()}
                                <circle cx="50" cy="50" r="20" fill="#0a0a0f" />
                              </svg>
                            </div>
                            <div className="ddm-donut-legend">
                              {trafficSources.map((item, index) => (
                                <div key={index} className="ddm-legend-item">
                                  <span className="ddm-legend-dot" style={{ backgroundColor: item.color }} />
                                  <span className="ddm-legend-text">{item.name[language]}</span>
                                  <span className="ddm-legend-value">{item.value}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* CTA */}
                        <button onClick={handleContactNavigation} className="ddm-cta-btn">
                          {language === 'tr' ? 'Pazarlama Danışmanlığı Al' : 'Get Marketing Consultation'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Home Indicator */}
              <div className="ddm-home-indicator" onClick={closeApp} />
            </div>

            {/* Home Indicator */}
            <div className="ddm-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="ddm-screen-reflection" />
          </div>
        </div>

        {/* Hint */}
        <div className="ddm-hint">
          {t.closeHint}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default DesktopDigitalMarketingDemo;
