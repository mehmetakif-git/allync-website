import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './MobileCloudDemo.css';

// Assets
import closeIcon from '../../assets/demo-icons/Close_Cross_Circle.svg';
import callIcon from '../../assets/demo-icons/Call_Fill.svg';
import networkIcon from '../../assets/demo-icons/Network.svg';

// Icons
import {
  Cloud,
  Server,
  Database,
  HardDrive,
  Cpu,
  Activity,
  Upload,
  CheckCircle,
  AlertCircle,
  Shield,
  Zap,
  TrendingUp,
  Wifi,
  X
} from 'lucide-react';

interface MobileCloudDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

type TabType = 'overview' | 'servers' | 'deployments';

// Server data
const servers = {
  tr: [
    { id: 1, name: 'Web Server', type: 'EC2', status: 'running', cpu: 45, ram: 62, region: 'EU-West' },
    { id: 2, name: 'API Gateway', type: 'Lambda', status: 'running', cpu: 23, ram: 41, region: 'EU-West' },
    { id: 3, name: 'Database', type: 'RDS', status: 'running', cpu: 67, ram: 78, region: 'EU-West' },
    { id: 4, name: 'Cache Server', type: 'Redis', status: 'stopped', cpu: 0, ram: 0, region: 'US-East' },
    { id: 5, name: 'Storage', type: 'S3', status: 'running', cpu: 12, ram: 35, region: 'EU-West' },
  ],
  en: [
    { id: 1, name: 'Web Server', type: 'EC2', status: 'running', cpu: 45, ram: 62, region: 'EU-West' },
    { id: 2, name: 'API Gateway', type: 'Lambda', status: 'running', cpu: 23, ram: 41, region: 'EU-West' },
    { id: 3, name: 'Database', type: 'RDS', status: 'running', cpu: 67, ram: 78, region: 'EU-West' },
    { id: 4, name: 'Cache Server', type: 'Redis', status: 'stopped', cpu: 0, ram: 0, region: 'US-East' },
    { id: 5, name: 'Storage', type: 'S3', status: 'running', cpu: 12, ram: 35, region: 'EU-West' },
  ]
};

// Deployments data
const deployments = {
  tr: [
    { id: 1, name: 'v2.4.1 - Hotfix', status: 'success', time: '2 dk once', branch: 'main' },
    { id: 2, name: 'v2.4.0 - Feature', status: 'success', time: '1 saat once', branch: 'main' },
    { id: 3, name: 'v2.3.9 - Bugfix', status: 'failed', time: '3 saat once', branch: 'develop' },
    { id: 4, name: 'v2.3.8 - Update', status: 'success', time: '1 gun once', branch: 'main' },
  ],
  en: [
    { id: 1, name: 'v2.4.1 - Hotfix', status: 'success', time: '2 min ago', branch: 'main' },
    { id: 2, name: 'v2.4.0 - Feature', status: 'success', time: '1 hour ago', branch: 'main' },
    { id: 3, name: 'v2.3.9 - Bugfix', status: 'failed', time: '3 hours ago', branch: 'develop' },
    { id: 4, name: 'v2.3.8 - Update', status: 'success', time: '1 day ago', branch: 'main' },
  ]
};

const uiText = {
  tr: {
    tooltip: "Demo'yu Baslat!",
    exit: 'Cikis',
    contact: 'Iletisim',
    cloudConsole: 'Cloud Console',
    serversActive: 'sunucu aktif',
    overview: 'Genel',
    serversTab: 'Sunucular',
    deploysTab: 'Deploy',
    uptime: 'Uptime',
    requests: 'Istekler/dk',
    resourceUsage: 'Kaynak Kullanimi',
    cpu: 'CPU',
    memory: 'Memory',
    storage: 'Storage',
    securityStatus: 'Guvenlik Durumu',
    allSecure: 'Tum sistemler guvenli',
    running: 'Calisan',
    stopped: 'Durmus',
    total: 'Toplam',
    serverList: 'Sunucu Listesi',
    successful: 'Basarili',
    failed: 'Basarisiz',
    thisMonth: 'Bu Ay',
    recentDeploys: 'Son Deploylar',
    newDeploy: 'Yeni Deploy',
    requestCloud: 'Bulut Cozumu Isteyin'
  },
  en: {
    tooltip: 'Start Demo!',
    exit: 'Exit',
    contact: 'Contact',
    cloudConsole: 'Cloud Console',
    serversActive: 'servers active',
    overview: 'Overview',
    serversTab: 'Servers',
    deploysTab: 'Deploys',
    uptime: 'Uptime',
    requests: 'Requests/min',
    resourceUsage: 'Resource Usage',
    cpu: 'CPU',
    memory: 'Memory',
    storage: 'Storage',
    securityStatus: 'Security Status',
    allSecure: 'All systems secure',
    running: 'Running',
    stopped: 'Stopped',
    total: 'Total',
    serverList: 'Server List',
    successful: 'Success',
    failed: 'Failed',
    thisMonth: 'This Month',
    recentDeploys: 'Recent Deployments',
    newDeploy: 'New Deploy',
    requestCloud: 'Request Cloud Solution'
  }
};

export const MobileCloudDemo: React.FC<MobileCloudDemoProps> = ({
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
  const [serverStates, setServerStates] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    servers[language].forEach(s => { initial[s.id] = s.status; });
    return initial;
  });

  const t = uiText[language];

  // Calculate stats
  const runningServers = Object.values(serverStates).filter(s => s === 'running').length;
  const totalServers = servers[language].length;

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
    document.body.classList.add('mcld-modal-open');
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.classList.remove('mcld-modal-open');
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
    document.body.classList.remove('mcld-modal-open');
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

  const toggleServer = (id: number) => {
    setServerStates(prev => ({
      ...prev,
      [id]: prev[id] === 'running' ? 'stopped' : 'running'
    }));
  };

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: t.overview, icon: Activity },
    { id: 'servers', label: t.serversTab, icon: Server },
    { id: 'deployments', label: t.deploysTab, icon: Upload },
  ];

  // Overview Tab
  const OverviewTab = () => (
    <div className="mcld-cloud-content">
      {/* Quick Stats */}
      <div className="mcld-quick-stats">
        <div className="mcld-stat-card mcld-highlight">
          <TrendingUp size={16} />
          <p>99%</p>
          <span>{t.uptime}</span>
        </div>
        <div className="mcld-stat-card">
          <Zap size={16} />
          <p>12.8K</p>
          <span>{t.requests}</span>
        </div>
      </div>

      {/* Resource Usage */}
      <h3 className="mcld-section-title">{t.resourceUsage}</h3>
      <div className="mcld-resource-card">
        <div className="mcld-resource-item">
          <div className="mcld-resource-icon mcld-cpu">
            <Cpu size={18} />
          </div>
          <div className="mcld-resource-info">
            <div className="mcld-resource-label">
              <span>{t.cpu}</span>
              <span>58%</span>
            </div>
            <div className="mcld-resource-bar">
              <div className="mcld-resource-bar-fill" style={{ width: '58%', background: 'linear-gradient(90deg, #6366f1, #818cf8)' }} />
            </div>
          </div>
        </div>
        <div className="mcld-resource-item">
          <div className="mcld-resource-icon mcld-memory">
            <HardDrive size={18} />
          </div>
          <div className="mcld-resource-info">
            <div className="mcld-resource-label">
              <span>{t.memory}</span>
              <span>72%</span>
            </div>
            <div className="mcld-resource-bar">
              <div className="mcld-resource-bar-fill" style={{ width: '72%', background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)' }} />
            </div>
          </div>
        </div>
        <div className="mcld-resource-item">
          <div className="mcld-resource-icon mcld-storage">
            <Database size={18} />
          </div>
          <div className="mcld-resource-info">
            <div className="mcld-resource-label">
              <span>{t.storage}</span>
              <span>45%</span>
            </div>
            <div className="mcld-resource-bar">
              <div className="mcld-resource-bar-fill" style={{ width: '45%', background: 'linear-gradient(90deg, #06b6d4, #22d3ee)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Security Status */}
      <div className="mcld-security-status">
        <div className="mcld-security-icon">
          <Shield size={18} />
        </div>
        <div className="mcld-security-info">
          <h5>{t.securityStatus}</h5>
          <p>{t.allSecure}</p>
        </div>
      </div>
    </div>
  );

  // Servers Tab
  const ServersTab = () => (
    <div className="mcld-cloud-content">
      {/* Server Stats */}
      <div className="mcld-server-stats">
        <div className="mcld-server-stat mcld-running-stat">
          <Server size={16} />
          <div className="mcld-server-stat-value">{runningServers}</div>
          <div className="mcld-server-stat-label">{t.running}</div>
        </div>
        <div className="mcld-server-stat mcld-stopped-stat">
          <Server size={16} />
          <div className="mcld-server-stat-value">{totalServers - runningServers}</div>
          <div className="mcld-server-stat-label">{t.stopped}</div>
        </div>
        <div className="mcld-server-stat mcld-total-stat">
          <Server size={16} />
          <div className="mcld-server-stat-value">{totalServers}</div>
          <div className="mcld-server-stat-label">{t.total}</div>
        </div>
      </div>

      {/* Server List */}
      <h3 className="mcld-section-title">{t.serverList}</h3>
      <div className="mcld-server-list">
        {servers[language].map(server => {
          const isRunning = serverStates[server.id] === 'running';
          return (
            <div key={server.id} className="mcld-server-row">
              <div className="mcld-server-row-header">
                <div className="mcld-server-row-left">
                  <div className={`mcld-server-status-dot ${isRunning ? 'mcld-running' : 'mcld-stopped'}`} />
                  <span className="mcld-server-name">{server.name}</span>
                </div>
                <button
                  className={`mcld-server-toggle ${isRunning ? 'mcld-running' : 'mcld-stopped'}`}
                  onClick={() => toggleServer(server.id)}
                >
                  {isRunning ? 'Running' : 'Stopped'}
                </button>
              </div>
              <div className="mcld-server-row-meta">
                <span>{server.type}</span>
                <span>{server.region}</span>
              </div>
              {isRunning && (
                <div className="mcld-server-bars">
                  <div className="mcld-resource-info">
                    <div className="mcld-resource-label">
                      <span>CPU</span>
                      <span>{server.cpu}%</span>
                    </div>
                    <div className="mcld-resource-bar">
                      <div className="mcld-resource-bar-fill" style={{ width: `${server.cpu}%`, background: 'linear-gradient(90deg, #6366f1, #818cf8)' }} />
                    </div>
                  </div>
                  <div className="mcld-resource-info">
                    <div className="mcld-resource-label">
                      <span>RAM</span>
                      <span>{server.ram}%</span>
                    </div>
                    <div className="mcld-resource-bar">
                      <div className="mcld-resource-bar-fill" style={{ width: `${server.ram}%`, background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Deployments Tab
  const DeploymentsTab = () => (
    <div className="mcld-cloud-content">
      {/* Deploy Stats */}
      <div className="mcld-deploy-stats">
        <div className="mcld-deploy-stat-card mcld-success">
          <CheckCircle size={16} />
          <div className="mcld-deploy-stat-card-value">23</div>
          <div className="mcld-deploy-stat-card-label">{t.successful}</div>
        </div>
        <div className="mcld-deploy-stat-card mcld-failed">
          <AlertCircle size={16} />
          <div className="mcld-deploy-stat-card-value">2</div>
          <div className="mcld-deploy-stat-card-label">{t.failed}</div>
        </div>
        <div className="mcld-deploy-stat-card mcld-total">
          <Upload size={16} />
          <div className="mcld-deploy-stat-card-value">25</div>
          <div className="mcld-deploy-stat-card-label">{t.thisMonth}</div>
        </div>
      </div>

      {/* Deploy List */}
      <h3 className="mcld-section-title">{t.recentDeploys}</h3>
      <div className="mcld-deploy-list">
        {deployments[language].map(deploy => (
          <div key={deploy.id} className="mcld-deploy-row">
            <div className={`mcld-deploy-icon ${deploy.status}`}>
              {deploy.status === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            </div>
            <div className="mcld-deploy-text">
              <p>{deploy.name}</p>
              <span>{deploy.branch} - {deploy.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      {onContactClick && (
        <button onClick={handleContactNavigation} className="mcld-cta-btn">
          {t.requestCloud}
        </button>
      )}
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'servers': return <ServersTab />;
      case 'deployments': return <DeploymentsTab />;
      default: return <OverviewTab />;
    }
  };

  return createPortal(
    <div className="mcld-overlay">
      <div className="mcld-iphone-container">
        <div className="mcld-iphone-frame">
          {/* Side Buttons */}
          <div className="mcld-side-button mcld-silent-switch" />
          <div className="mcld-side-button mcld-volume-up" />
          <div className="mcld-side-button mcld-volume-down" />
          <div className="mcld-side-button mcld-power-button" />

          <div className="mcld-iphone-screen">
            {/* Wallpaper */}
            <div className="mcld-wallpaper" />

            {/* Dynamic Island - Cloud Status */}
            <div
              className={`mcld-dynamic-island mcld-di-state-${dynamicIslandState}`}
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
              <div className="mcld-di-collapsed-content">
                <div className="mcld-di-camera" />
                <div className="mcld-di-sensor" />
              </div>

              {/* Compact Content */}
              <div className="mcld-di-compact-content">
                <div className="mcld-di-compact-left">
                  <div className="mcld-di-compact-icon">
                    <Cloud size={16} />
                  </div>
                  <div className="mcld-di-compact-info">
                    <span className="mcld-di-compact-title">{t.cloudConsole}</span>
                    <span className="mcld-di-compact-subtitle">{runningServers} {t.serversActive}</span>
                  </div>
                </div>
                <div className="mcld-di-compact-right">
                  <span className="mcld-di-compact-metric">99%</span>
                </div>
              </div>

              {/* Expanded Content */}
              <div className="mcld-di-expanded-content">
                <div className="mcld-di-status-left">
                  <div className="mcld-di-status-icon">
                    <Cloud size={22} />
                  </div>
                  <div className="mcld-di-status-info">
                    <h4>{t.cloudConsole}</h4>
                    <p>{runningServers}/{totalServers} {t.serversActive}</p>
                  </div>
                </div>
                <div className="mcld-di-status-right">
                  <div className="mcld-di-sensor-badge">
                    <span>99%</span>
                    <small>Uptime</small>
                  </div>
                  <div className="mcld-di-sensor-badge mcld-positive">
                    <span>12.8k</span>
                    <small>Req/m</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mcld-status-bar">
              <div className="mcld-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="mcld-status-right">
                <div className="mcld-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <div className="mcld-wifi-icon">
                  <Wifi size={16} />
                </div>
                <div className="mcld-battery">
                  <div className="mcld-battery-body">
                    <div className="mcld-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`mcld-home-screen ${isAppOpen ? 'mcld-hidden' : ''}`}>
              {/* Time Widget */}
              <div className="mcld-time-widget">
                <div className="mcld-time">{currentTime}</div>
                <div className="mcld-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="mcld-widgets-container">
                {/* Server Widget */}
                <div
                  className="mcld-widget mcld-widget-hover"
                  onClick={() => {
                    openApp();
                    setActiveTab('servers');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="mcld-widget-header">
                    <div className="mcld-widget-icon">
                      <Server size={16} />
                    </div>
                    <span>{t.serversTab}</span>
                  </div>
                  <div className="mcld-server-widget-content">
                    <div className="mcld-server-count">
                      {runningServers}<span>/{totalServers}</span>
                    </div>
                    <div className="mcld-server-label">{t.running}</div>
                    <div className="mcld-mini-servers">
                      {servers[language].slice(0, 5).map(server => (
                        <div
                          key={server.id}
                          className={`mcld-mini-server ${serverStates[server.id] === 'running' ? 'mcld-active' : ''}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Metrics Widget */}
                <div
                  className="mcld-widget mcld-widget-hover"
                  onClick={() => {
                    openApp();
                    setActiveTab('overview');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="mcld-widget-header">
                    <div className="mcld-widget-icon">
                      <Activity size={16} />
                    </div>
                    <span>{t.resourceUsage}</span>
                  </div>
                  <div className="mcld-metrics-widget-content">
                    <div className="mcld-mini-metric">
                      <span>CPU</span>
                      <div className="mcld-mini-bar">
                        <div className="mcld-mini-bar-fill" style={{ width: '58%' }} />
                      </div>
                      <span>58%</span>
                    </div>
                    <div className="mcld-mini-metric">
                      <span>RAM</span>
                      <div className="mcld-mini-bar">
                        <div className="mcld-mini-bar-fill mcld-purple" style={{ width: '72%' }} />
                      </div>
                      <span>72%</span>
                    </div>
                    <div className="mcld-mini-metric">
                      <span>Disk</span>
                      <div className="mcld-mini-bar">
                        <div className="mcld-mini-bar-fill mcld-cyan" style={{ width: '45%' }} />
                      </div>
                      <span>45%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="mcld-dock">
                <div className="mcld-dock-icon mcld-close-icon mcld-dock-hover" onClick={handleClose}>
                  <span className="mcld-close-tooltip">{t.exit} X</span>
                  <img src={closeIcon} alt="Close" className="mcld-close-img" />
                </div>
                <div className="mcld-dock-icon mcld-contact-icon mcld-dock-hover" onClick={handleContactNavigation}>
                  <span className="mcld-contact-tooltip">{t.contact}</span>
                  <img src={networkIcon} alt="Contact" className="mcld-icon-img" />
                </div>
                <div className="mcld-dock-icon mcld-call-icon mcld-dock-hover" onClick={handleContactNavigation}>
                  <img src={callIcon} alt="Call" className="mcld-icon-img" />
                </div>
                <div className="mcld-dock-icon mcld-app-icon mcld-dock-hover" onClick={openApp}>
                  <span className="mcld-app-tooltip">{t.tooltip}</span>
                  <Cloud style={{ width: 28, height: 28, color: 'white' }} />
                </div>
              </div>
            </div>

            {/* App */}
            <div className={`mcld-app ${isAppOpen ? 'mcld-active' : ''}`}>
              <div className="mcld-app-content" onWheel={(e) => e.stopPropagation()}>
                <div className="mcld-cloud-app">
                  {/* Header */}
                  <div className="mcld-cloud-header">
                    <div className="mcld-cloud-header-top">
                      <div className="mcld-cloud-header-left">
                        <div className="mcld-cloud-logo">
                          <Cloud size={18} />
                        </div>
                        <div className="mcld-cloud-header-text">
                          <h1>{t.cloudConsole}</h1>
                          <p>{runningServers} {t.serversActive}</p>
                        </div>
                      </div>
                      <button className="mcld-cloud-settings-btn" onClick={closeApp}>
                        <X size={18} />
                      </button>
                    </div>

                    {/* Tabs */}
                    <div className="mcld-cloud-tabs">
                      {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`mcld-cloud-tab ${activeTab === tab.id ? 'mcld-active' : ''}`}
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
            <div className="mcld-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="mcld-screen-reflection" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
