import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './MobileDigitalMarketingDemo.css';

// Assets
import closeIcon from '../../assets/demo-icons/Close_Cross_Circle.svg';
import callIcon from '../../assets/demo-icons/Call_Fill.svg';
import networkIcon from '../../assets/demo-icons/Network.svg';

// Icons
import {
  Wifi,
  TrendingUp,
  Users,
  DollarSign,
  MousePointer,
  BarChart3,
  Target,
  Eye,
  Megaphone,
  Globe,
  Mail,
  ArrowUp,
  ArrowDown,
  X
} from 'lucide-react';

interface MobileDigitalMarketingDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

type TabType = 'overview' | 'campaigns' | 'analytics';

// Campaign data
const campaigns = {
  tr: [
    { id: 1, name: 'Google Ads - Arama', platform: 'google', budget: 5000, spent: 3420, conversions: 234, status: 'active' },
    { id: 2, name: 'Facebook Lead Gen', platform: 'facebook', budget: 3000, spent: 2180, conversions: 156, status: 'active' },
    { id: 3, name: 'Instagram Stories', platform: 'instagram', budget: 2000, spent: 1890, conversions: 89, status: 'active' },
    { id: 4, name: 'Email Bulteni', platform: 'email', budget: 500, spent: 320, conversions: 67, status: 'paused' },
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
  { name: { tr: 'Ucretli', en: 'Paid' }, value: 28, color: '#f97316' },
  { name: { tr: 'Sosyal', en: 'Social' }, value: 22, color: '#8b5cf6' },
  { name: { tr: 'Direkt', en: 'Direct' }, value: 15, color: '#06b6d4' },
];

// Weekly performance data
const weeklyData = [
  { day: { tr: 'Pzt', en: 'Mon' }, visitors: 1200 },
  { day: { tr: 'Sal', en: 'Tue' }, visitors: 1450 },
  { day: { tr: 'Car', en: 'Wed' }, visitors: 1380 },
  { day: { tr: 'Per', en: 'Thu' }, visitors: 1620 },
  { day: { tr: 'Cum', en: 'Fri' }, visitors: 1890 },
  { day: { tr: 'Cmt', en: 'Sat' }, visitors: 980 },
  { day: { tr: 'Paz', en: 'Sun' }, visitors: 850 },
];

const uiText = {
  tr: {
    tooltip: "Demo'yu Baslat!",
    exit: 'Cikis',
    contact: 'Iletisim',
    digitalMarketing: 'Dijital Pazarlama',
    activeCampaigns: 'aktif kampanya',
    liveAnalytics: 'Canli Analitik',
    last24Hours: 'Son 24 saat',
    visits: 'ziyaret',
    growth: 'artis',
    today: 'bugun',
    overview: 'Genel',
    campaignsTab: 'Kampanyalar',
    analytics: 'Analitik',
    visitors: 'Ziyaretci',
    conversions: 'Donusum',
    revenue: 'Gelir',
    keyMetrics: 'Temel Metrikler',
    clickRate: 'Tiklama Orani',
    costPerClick: 'Tiklama Maliyeti',
    returnOnAd: 'Reklam Getirisi',
    totalBudget: 'Toplam Butce',
    active: 'Aktif',
    paused: 'Duraklatildi',
    weeklyPerformance: 'Haftalik Performans',
    trafficSources: 'Trafik Kaynaklari',
    getConsultation: 'Pazarlama Danismanligi Al'
  },
  en: {
    tooltip: 'Start Demo!',
    exit: 'Exit',
    contact: 'Contact',
    digitalMarketing: 'Digital Marketing',
    activeCampaigns: 'active campaigns',
    liveAnalytics: 'Live Analytics',
    last24Hours: 'Last 24 hours',
    visits: 'visits',
    growth: 'growth',
    today: 'today',
    overview: 'Overview',
    campaignsTab: 'Campaigns',
    analytics: 'Analytics',
    visitors: 'Visitors',
    conversions: 'Conv.',
    revenue: 'Revenue',
    keyMetrics: 'Key Metrics',
    clickRate: 'Click Rate',
    costPerClick: 'Cost Per Click',
    returnOnAd: 'Return on Ad',
    totalBudget: 'Total Budget',
    active: 'Active',
    paused: 'Paused',
    weeklyPerformance: 'Weekly Performance',
    trafficSources: 'Traffic Sources',
    getConsultation: 'Get Marketing Consultation'
  }
};

export const MobileDigitalMarketingDemo: React.FC<MobileDigitalMarketingDemoProps> = ({
  language,
  onClose,
  onContactClick
}) => {
  // Entry time for clock
  const [entryTime] = useState(() => new Date());
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isAppOpen, setIsAppOpen] = useState(false);

  // Dynamic Island states
  const [dynamicIslandState, setDynamicIslandState] = useState<'collapsed' | 'compact' | 'expanded'>('collapsed');

  // App states
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const t = uiText[language];

  // Calculate stats
  const activeCampaignsCount = campaigns[language].filter(c => c.status === 'active').length;
  const totalConversions = campaigns[language].reduce((sum, c) => sum + c.conversions, 0);
  const maxVisitors = Math.max(...weeklyData.map(d => d.visitors));

  // Set time and date from entry time
  useEffect(() => {
    const hours = entryTime.getHours().toString().padStart(2, '0');
    const minutes = entryTime.getMinutes().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}`);

    const days = language === 'tr'
      ? ['Pazar', 'Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi']
      : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = language === 'tr'
      ? ['Ocak', 'Subat', 'Mart', 'Nisan', 'Mayis', 'Haziran', 'Temmuz', 'Agustos', 'Eylul', 'Ekim', 'Kasim', 'Aralik']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    setCurrentDate(`${days[entryTime.getDay()]}, ${entryTime.getDate()} ${months[entryTime.getMonth()]}`);
  }, [language, entryTime]);

  // Disable body scroll
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.classList.add('mdm-modal-open');
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.classList.remove('mdm-modal-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  const openApp = useCallback(() => {
    setIsAppOpen(true);
    setDynamicIslandState('compact');
  }, []);

  const closeApp = useCallback(() => {
    setIsAppOpen(false);
    setActiveTab('overview');
    setDynamicIslandState('collapsed');
  }, []);

  const handleClose = useCallback(() => {
    setDynamicIslandState('collapsed');
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const handleContactNavigation = useCallback(() => {
    setDynamicIslandState('collapsed');
    document.body.classList.remove('mdm-modal-open');
    document.body.style.top = '';

    if (onClose) {
      onClose();
    }

    setTimeout(() => {
      if (onContactClick) {
        onContactClick();
      }
    }, 100);
  }, [onClose, onContactClick]);

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: t.overview, icon: Eye },
    { id: 'campaigns', label: t.campaignsTab, icon: Target },
    { id: 'analytics', label: t.analytics, icon: BarChart3 },
  ];

  // Overview Tab
  const OverviewTab = () => (
    <div className="mdm-marketing-content">
      {/* Quick Stats */}
      <div className="mdm-quick-stats">
        <div className="mdm-stat-card mdm-highlight">
          <Users size={16} />
          <p>12.8K</p>
          <span>{t.visitors}</span>
        </div>
        <div className="mdm-stat-card">
          <MousePointer size={16} />
          <p>{totalConversions}</p>
          <span>{t.conversions}</span>
        </div>
        <div className="mdm-stat-card">
          <DollarSign size={16} />
          <p>45K</p>
          <span>{t.revenue}</span>
        </div>
      </div>

      {/* Metrics */}
      <h3 className="mdm-section-title">{t.keyMetrics}</h3>
      <div className="mdm-metrics-list">
        <div className="mdm-metric-item">
          <div className="mdm-metric-left">
            <div className="mdm-metric-icon">
              <TrendingUp size={16} />
            </div>
            <div className="mdm-metric-info">
              <span className="mdm-metric-name">CTR</span>
              <span className="mdm-metric-desc">{t.clickRate}</span>
            </div>
          </div>
          <div className="mdm-metric-right">
            <span className="mdm-metric-value">4.8%</span>
            <span className="mdm-metric-change mdm-positive">
              <ArrowUp size={10} />+2.1%
            </span>
          </div>
        </div>
        <div className="mdm-metric-item">
          <div className="mdm-metric-left">
            <div className="mdm-metric-icon">
              <DollarSign size={16} />
            </div>
            <div className="mdm-metric-info">
              <span className="mdm-metric-name">CPC</span>
              <span className="mdm-metric-desc">{t.costPerClick}</span>
            </div>
          </div>
          <div className="mdm-metric-right">
            <span className="mdm-metric-value">$1.24</span>
            <span className="mdm-metric-change mdm-negative">
              <ArrowDown size={10} />-0.3%
            </span>
          </div>
        </div>
        <div className="mdm-metric-item">
          <div className="mdm-metric-left">
            <div className="mdm-metric-icon">
              <Target size={16} />
            </div>
            <div className="mdm-metric-info">
              <span className="mdm-metric-name">ROAS</span>
              <span className="mdm-metric-desc">{t.returnOnAd}</span>
            </div>
          </div>
          <div className="mdm-metric-right">
            <span className="mdm-metric-value">3.2x</span>
            <span className="mdm-metric-change mdm-positive">
              <ArrowUp size={10} />+0.4x
            </span>
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="mdm-budget-card">
        <div className="mdm-budget-header">
          <span>{t.totalBudget}</span>
          <span>$7.8K / $10.5K</span>
        </div>
        <div className="mdm-budget-bar">
          <div className="mdm-budget-fill" style={{ width: '74%' }} />
        </div>
      </div>
    </div>
  );

  // Campaigns Tab
  const CampaignsTab = () => (
    <div className="mdm-marketing-content">
      {/* Campaign Stats */}
      <div className="mdm-campaign-stats">
        <div className="mdm-campaign-stat mdm-active-stat">
          <Target size={16} />
          <div className="mdm-campaign-stat-value">{activeCampaignsCount}</div>
          <div className="mdm-campaign-stat-label">{t.active}</div>
        </div>
        <div className="mdm-campaign-stat mdm-conv-stat">
          <MousePointer size={16} />
          <div className="mdm-campaign-stat-value">{totalConversions}</div>
          <div className="mdm-campaign-stat-label">{t.conversions}</div>
        </div>
        <div className="mdm-campaign-stat mdm-paused-stat">
          <Eye size={16} />
          <div className="mdm-campaign-stat-value">1</div>
          <div className="mdm-campaign-stat-label">{t.paused}</div>
        </div>
      </div>

      {/* Campaign List */}
      <h3 className="mdm-section-title">{t.campaignsTab}</h3>
      <div className="mdm-campaign-list">
        {campaigns[language].map(campaign => {
          const progress = (campaign.spent / campaign.budget) * 100;
          return (
            <div key={campaign.id} className="mdm-campaign-item">
              <div className="mdm-campaign-item-header">
                <div className="mdm-campaign-platform">
                  {campaign.platform === 'google' && <Globe size={14} className="mdm-google" />}
                  {campaign.platform === 'facebook' && <Users size={14} className="mdm-facebook" />}
                  {campaign.platform === 'instagram' && <Target size={14} className="mdm-instagram" />}
                  {campaign.platform === 'email' && <Mail size={14} className="mdm-email" />}
                </div>
                <span className="mdm-campaign-name">{campaign.name}</span>
                <span className={`mdm-campaign-status-badge ${campaign.status}`}>
                  {campaign.status === 'active' ? t.active : t.paused}
                </span>
              </div>
              <div className="mdm-campaign-progress">
                <div className="mdm-progress-bar">
                  <div className="mdm-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <span className="mdm-progress-text">
                  ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                </span>
              </div>
              <div className="mdm-campaign-footer">
                <span>{campaign.conversions} {t.conversions.toLowerCase()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Analytics Tab
  const AnalyticsTab = () => (
    <div className="mdm-marketing-content">
      {/* Weekly Chart */}
      <div className="mdm-chart-card">
        <h3 className="mdm-chart-title">{t.weeklyPerformance}</h3>
        <div className="mdm-chart-bars">
          {weeklyData.map((item, index) => (
            <div key={index} className="mdm-chart-bar-container">
              <div
                className="mdm-chart-bar"
                style={{ height: `${(item.visitors / maxVisitors) * 100}%` }}
              />
              <span className="mdm-chart-label">{item.day[language]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="mdm-donut-card">
        <h3 className="mdm-chart-title">{t.trafficSources}</h3>
        <div className="mdm-donut-content">
          <div className="mdm-donut-visual">
            <svg viewBox="0 0 100 100" className="mdm-donut-svg">
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
              <circle cx="50" cy="50" r="20" fill="#0a0505" />
            </svg>
          </div>
          <div className="mdm-donut-legend">
            {trafficSources.map((item, index) => (
              <div key={index} className="mdm-legend-item">
                <span className="mdm-legend-dot" style={{ backgroundColor: item.color }} />
                <span className="mdm-legend-text">{item.name[language]}</span>
                <span className="mdm-legend-value">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      {onContactClick && (
        <button onClick={handleContactNavigation} className="mdm-cta-btn">
          {t.getConsultation}
        </button>
      )}
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'campaigns': return <CampaignsTab />;
      case 'analytics': return <AnalyticsTab />;
      default: return <OverviewTab />;
    }
  };

  return createPortal(
    <div className="mdm-overlay">
      <div className="mdm-iphone-container">
        <div className="mdm-iphone-frame">
          {/* Side Buttons */}
          <div className="mdm-side-button mdm-silent-switch" />
          <div className="mdm-side-button mdm-volume-up" />
          <div className="mdm-side-button mdm-volume-down" />
          <div className="mdm-side-button mdm-power-button" />

          <div className="mdm-iphone-screen">
            {/* Wallpaper */}
            <div className="mdm-wallpaper" />

            {/* Dynamic Island - Marketing Status */}
            <div
              className={`mdm-dynamic-island mdm-di-state-${dynamicIslandState}`}
              onClick={() => {
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
              }}
            >
              {/* Collapsed Content */}
              <div className="mdm-di-collapsed-content">
                <div className="mdm-di-camera" />
                <div className="mdm-di-sensor" />
              </div>

              {/* Compact Content */}
              <div className="mdm-di-compact-content">
                <div className="mdm-di-compact-left">
                  <div className="mdm-di-compact-icon">
                    <TrendingUp size={16} />
                  </div>
                  <div className="mdm-di-compact-info">
                    <span className="mdm-di-compact-title">{t.liveAnalytics}</span>
                    <span className="mdm-di-compact-subtitle">+12.5% {t.today}</span>
                  </div>
                </div>
                <div className="mdm-di-compact-right">
                  <span className="mdm-di-compact-metric">2.4K</span>
                </div>
              </div>

              {/* Expanded Content */}
              <div className="mdm-di-expanded-content">
                <div className="mdm-di-status-left">
                  <div className="mdm-di-status-icon">
                    <BarChart3 size={22} />
                  </div>
                  <div className="mdm-di-status-info">
                    <h4>{t.liveAnalytics}</h4>
                    <p>{t.last24Hours}</p>
                  </div>
                </div>
                <div className="mdm-di-status-right">
                  <div className="mdm-di-sensor-badge">
                    <span>2.4K</span>
                    <small>{t.visits}</small>
                  </div>
                  <div className="mdm-di-sensor-badge mdm-positive">
                    <span>+12.5%</span>
                    <small>{t.growth}</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mdm-status-bar">
              <div className="mdm-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="mdm-status-right">
                <div className="mdm-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <div className="mdm-wifi-icon">
                  <Wifi size={16} />
                </div>
                <div className="mdm-battery">
                  <div className="mdm-battery-body">
                    <div className="mdm-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`mdm-home-screen ${isAppOpen ? 'mdm-hidden' : ''}`}>
              {/* Time Widget */}
              <div className="mdm-time-widget">
                <div className="mdm-time">{currentTime}</div>
                <div className="mdm-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="mdm-widgets-container">
                {/* Analytics Widget */}
                <div
                  className="mdm-widget mdm-widget-hover"
                  onClick={() => {
                    openApp();
                    setActiveTab('analytics');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="mdm-widget-header">
                    <div className="mdm-widget-icon">
                      <BarChart3 size={16} />
                    </div>
                    <span>{t.analytics}</span>
                  </div>
                  <div className="mdm-analytics-widget-content">
                    <div className="mdm-analytics-count">12.8K</div>
                    <div className="mdm-analytics-label">{t.visitors}</div>
                    <div className="mdm-analytics-trend mdm-positive">
                      <ArrowUp size={12} />
                      <span>8.2%</span>
                    </div>
                  </div>
                </div>

                {/* Campaigns Widget */}
                <div
                  className="mdm-widget mdm-widget-hover"
                  onClick={() => {
                    openApp();
                    setActiveTab('campaigns');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="mdm-widget-header">
                    <div className="mdm-widget-icon">
                      <Target size={16} />
                    </div>
                    <span>{t.campaignsTab}</span>
                  </div>
                  <div className="mdm-campaigns-widget-content">
                    <div className="mdm-campaigns-count">
                      {activeCampaignsCount}<span>/4</span>
                    </div>
                    <div className="mdm-campaigns-label">{t.active}</div>
                    <div className="mdm-mini-bars">
                      <div className="mdm-mini-bar" style={{ height: '60%' }} />
                      <div className="mdm-mini-bar" style={{ height: '80%' }} />
                      <div className="mdm-mini-bar" style={{ height: '45%' }} />
                      <div className="mdm-mini-bar" style={{ height: '90%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="mdm-dock">
                <div className="mdm-dock-icon mdm-close-icon mdm-dock-hover" onClick={handleClose}>
                  <span className="mdm-close-tooltip">{t.exit} X</span>
                  <img src={closeIcon} alt="Close" className="mdm-close-img" />
                </div>
                <div className="mdm-dock-icon mdm-contact-icon mdm-dock-hover" onClick={handleContactNavigation}>
                  <span className="mdm-contact-tooltip">{t.contact}</span>
                  <img src={networkIcon} alt="Contact" className="mdm-icon-img" />
                </div>
                <div className="mdm-dock-icon mdm-call-icon mdm-dock-hover" onClick={handleContactNavigation}>
                  <img src={callIcon} alt="Call" className="mdm-icon-img" />
                </div>
                <div className="mdm-dock-icon mdm-app-icon mdm-dock-hover" onClick={openApp}>
                  <span className="mdm-app-tooltip">{t.tooltip}</span>
                  <Megaphone style={{ width: 28, height: 28, color: 'white' }} />
                </div>
              </div>
            </div>

            {/* App */}
            <div className={`mdm-app ${isAppOpen ? 'mdm-active' : ''}`}>
              <div className="mdm-app-content" onWheel={(e) => e.stopPropagation()}>
                <div className="mdm-marketing-app">
                  {/* Header */}
                  <div className="mdm-marketing-header">
                    <div className="mdm-marketing-header-top">
                      <div className="mdm-marketing-header-left">
                        <div className="mdm-marketing-logo">
                          <Megaphone size={18} />
                        </div>
                        <div className="mdm-marketing-header-text">
                          <h1>{t.digitalMarketing}</h1>
                          <p>{activeCampaignsCount} {t.activeCampaigns}</p>
                        </div>
                      </div>
                      <button className="mdm-marketing-settings-btn" onClick={closeApp}>
                        <X size={18} />
                      </button>
                    </div>

                    {/* Tabs */}
                    <div className="mdm-marketing-tabs">
                      {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`mdm-marketing-tab ${activeTab === tab.id ? 'mdm-active' : ''}`}
                          >
                            <Icon size={14} />
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {renderTab()}
                </div>
              </div>
            </div>

            {/* Home Indicator */}
            <div className="mdm-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="mdm-screen-reflection" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
