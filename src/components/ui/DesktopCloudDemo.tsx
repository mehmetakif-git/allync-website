import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './DesktopCloudDemo.css';

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

interface DesktopCloudDemoProps {
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
    bandwidth: 'Bandwidth',
    cost: 'Maliyet/ay',
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
    bandwidth: 'Bandwidth',
    cost: 'Cost/month',
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

// Animated value hook
const useAnimatedValue = (target: number, duration: number = 1000, trigger?: boolean) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (trigger) {
      setValue(0);
    }

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, trigger]);

  return value;
};

export const DesktopCloudDemo: React.FC<DesktopCloudDemoProps> = ({
  language,
  onClose,
  onContactClick
}) => {
  // Entry time for clock
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

  // Dynamic Island states
  const [dynamicIslandState, setDynamicIslandState] = useState<'collapsed' | 'compact' | 'expanded'>('collapsed');

  // Cloud App states
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [serverStates, setServerStates] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    servers[language].forEach(s => { initial[s.id] = s.status; });
    return initial;
  });

  // Animated values - trigger when Dynamic Island expands
  const isExpanded = dynamicIslandState === 'expanded';
  const uptime = useAnimatedValue(99, 1200, isExpanded);
  const requests = useAnimatedValue(12847, 1400, isExpanded);

  const runningServers = Object.values(serverStates).filter(s => s === 'running').length;
  const totalServers = servers[language].length;

  const phoneRef = useRef<HTMLDivElement>(null);
  const t = uiText[language];

  // Trigger entrance animation
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

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
    document.body.classList.add('dcld-modal-open');
    return () => {
      document.body.classList.remove('dcld-modal-open');
    };
  }, []);

  // Mouse tracking for 3D effect
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

  const openApp = () => {
    setIsAppOpen(true);
    setDynamicIslandState('compact');
  };

  const closeApp = () => {
    setIsAppOpen(false);
    setActiveTab('overview');
    setDynamicIslandState('collapsed');
  };

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setDynamicIslandState('collapsed');
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 400);
  };

  const handleContactNavigation = () => {
    if (isClosing) return;
    setIsClosing(true);
    setDynamicIslandState('collapsed');
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
      setTimeout(() => {
        if (onContactClick) {
          onContactClick();
        }
      }, 100);
    }, 400);
  };

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
    <div className="dcld-cloud-content">
      <div className="dcld-quick-stats">
        <div className="dcld-stat-card dcld-highlight">
          <div className="dcld-stat-card-header">
            <TrendingUp style={{ color: '#818cf8' }} />
            <span>{t.uptime}</span>
          </div>
          <div className="dcld-stat-card-value">{uptime}%</div>
        </div>
        <div className="dcld-stat-card">
          <div className="dcld-stat-card-header">
            <Zap style={{ color: '#facc15' }} />
            <span>{t.requests}</span>
          </div>
          <div className="dcld-stat-card-value">{requests.toLocaleString()}</div>
        </div>
      </div>

      <h3 className="dcld-section-title">{t.resourceUsage}</h3>
      <div className="dcld-resource-card">
        <div className="dcld-resource-item">
          <div className="dcld-resource-icon dcld-cpu">
            <Cpu />
          </div>
          <div className="dcld-resource-info">
            <div className="dcld-resource-label">
              <span>{t.cpu}</span>
              <span>58%</span>
            </div>
            <div className="dcld-resource-bar">
              <div className="dcld-resource-bar-fill" style={{ width: '58%', background: 'linear-gradient(90deg, #6366f1, #818cf8)' }} />
            </div>
          </div>
        </div>
        <div className="dcld-resource-item">
          <div className="dcld-resource-icon dcld-memory">
            <HardDrive />
          </div>
          <div className="dcld-resource-info">
            <div className="dcld-resource-label">
              <span>{t.memory}</span>
              <span>72%</span>
            </div>
            <div className="dcld-resource-bar">
              <div className="dcld-resource-bar-fill" style={{ width: '72%', background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)' }} />
            </div>
          </div>
        </div>
        <div className="dcld-resource-item">
          <div className="dcld-resource-icon dcld-storage">
            <Database />
          </div>
          <div className="dcld-resource-info">
            <div className="dcld-resource-label">
              <span>{t.storage}</span>
              <span>45%</span>
            </div>
            <div className="dcld-resource-bar">
              <div className="dcld-resource-bar-fill" style={{ width: '45%', background: 'linear-gradient(90deg, #06b6d4, #22d3ee)' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="dcld-security-status">
        <div className="dcld-security-icon">
          <Shield />
        </div>
        <div className="dcld-security-info">
          <h5>{t.securityStatus}</h5>
          <p>{t.allSecure}</p>
        </div>
      </div>
    </div>
  );

  // Servers Tab
  const ServersTab = () => (
    <div className="dcld-cloud-content">
      <div className="dcld-server-stats">
        <div className="dcld-server-stat dcld-running">
          <div className="dcld-server-stat-value">{runningServers}</div>
          <div className="dcld-server-stat-label">{t.running}</div>
        </div>
        <div className="dcld-server-stat dcld-stopped">
          <div className="dcld-server-stat-value">{totalServers - runningServers}</div>
          <div className="dcld-server-stat-label">{t.stopped}</div>
        </div>
        <div className="dcld-server-stat dcld-total">
          <div className="dcld-server-stat-value">{totalServers}</div>
          <div className="dcld-server-stat-label">{t.total}</div>
        </div>
      </div>

      <h3 className="dcld-section-title">{t.serverList}</h3>
      <div className="dcld-server-list">
        {servers[language].map(server => {
          const isRunning = serverStates[server.id] === 'running';
          return (
            <div key={server.id} className="dcld-server-row">
              <div className="dcld-server-row-header">
                <div className="dcld-server-row-left">
                  <div className={`dcld-server-status-dot ${isRunning ? 'dcld-running' : 'dcld-stopped'}`} />
                  <span className="dcld-server-name">{server.name}</span>
                </div>
                <button
                  className={`dcld-server-toggle ${isRunning ? 'dcld-running' : 'dcld-stopped'}`}
                  onClick={() => toggleServer(server.id)}
                >
                  {isRunning ? 'Running' : 'Stopped'}
                </button>
              </div>
              <div className="dcld-server-row-meta">
                <span>{server.type}</span>
                <span>{server.region}</span>
              </div>
              {isRunning && (
                <div className="dcld-server-bars">
                  <div className="dcld-resource-info">
                    <div className="dcld-resource-label">
                      <span>CPU</span>
                      <span>{server.cpu}%</span>
                    </div>
                    <div className="dcld-resource-bar">
                      <div className="dcld-resource-bar-fill" style={{ width: `${server.cpu}%`, background: 'linear-gradient(90deg, #6366f1, #818cf8)' }} />
                    </div>
                  </div>
                  <div className="dcld-resource-info">
                    <div className="dcld-resource-label">
                      <span>RAM</span>
                      <span>{server.ram}%</span>
                    </div>
                    <div className="dcld-resource-bar">
                      <div className="dcld-resource-bar-fill" style={{ width: `${server.ram}%`, background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)' }} />
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
    <div className="dcld-cloud-content">
      <div className="dcld-deploy-stats">
        <div className="dcld-deploy-stat-card dcld-success">
          <CheckCircle />
          <div className="dcld-deploy-stat-card-value">23</div>
          <div className="dcld-deploy-stat-card-label">{t.successful}</div>
        </div>
        <div className="dcld-deploy-stat-card dcld-failed">
          <AlertCircle />
          <div className="dcld-deploy-stat-card-value">2</div>
          <div className="dcld-deploy-stat-card-label">{t.failed}</div>
        </div>
        <div className="dcld-deploy-stat-card dcld-total">
          <Upload />
          <div className="dcld-deploy-stat-card-value">25</div>
          <div className="dcld-deploy-stat-card-label">{t.thisMonth}</div>
        </div>
      </div>

      <h3 className="dcld-section-title">{t.recentDeploys}</h3>
      <div className="dcld-deploy-list">
        {deployments[language].map(deploy => (
          <div key={deploy.id} className="dcld-deploy-row">
            <div className={`dcld-deploy-icon ${deploy.status}`}>
              {deploy.status === 'success' ? <CheckCircle /> : <AlertCircle />}
            </div>
            <div className="dcld-deploy-text">
              <p>{deploy.name}</p>
              <span>{deploy.branch} • {deploy.time}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="dcld-cta-btn">
        <Upload />
        {t.newDeploy}
      </button>

      {onContactClick && (
        <button className="dcld-contact-btn" onClick={handleContactNavigation}>
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
    <div className={`dcld-overlay ${isVisible ? 'dcld-visible' : ''} ${isClosing ? 'dcld-closing' : ''}`} onClick={handleClose}>
      <div
        className={`dcld-iphone-container ${isVisible ? 'dcld-visible' : ''} ${isClosing ? 'dcld-closing' : ''}`}
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
        <div
          className="dcld-iphone-frame"
          ref={phoneRef}
        >
          {/* Side Buttons */}
          <div className="dcld-side-button dcld-silent-switch" />
          <div className="dcld-side-button dcld-volume-up" />
          <div className="dcld-side-button dcld-volume-down" />
          <div className="dcld-side-button dcld-power-button" />

          <div className="dcld-iphone-screen">
            {/* Wallpaper */}
            <div className="dcld-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`dcld-dynamic-island dcld-di-state-${dynamicIslandState}`}
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
              <div className="dcld-di-collapsed-content">
                <div className="dcld-di-camera" />
                <div className="dcld-di-sensor" />
              </div>

              {/* Compact Content - shown when app is open */}
              <div className="dcld-di-compact-content">
                <div className="dcld-di-compact-left">
                  <div className="dcld-di-compact-icon">
                    <Cloud />
                  </div>
                  <div className="dcld-di-compact-info">
                    <span className="dcld-di-compact-title">{t.cloudConsole}</span>
                    <span className="dcld-di-compact-subtitle">{runningServers} {t.serversActive}</span>
                  </div>
                </div>
                <div className="dcld-di-compact-right">
                  <span className="dcld-di-compact-uptime">{uptime}%</span>
                </div>
              </div>

              {/* Expanded Content */}
              <div className="dcld-di-expanded-content">
                <div className="dcld-di-status-left">
                  <div className="dcld-di-status-icon">
                    <Cloud />
                  </div>
                  <div className="dcld-di-status-info">
                    <h4>{t.cloudConsole}</h4>
                    <p>{runningServers}/{totalServers} {t.serversActive}</p>
                  </div>
                </div>
                <div className="dcld-di-status-right">
                  <div className="dcld-di-sensor-badge">
                    <span>{uptime}%</span>
                    <small>Uptime</small>
                  </div>
                  <div className="dcld-di-sensor-badge">
                    <span>{(requests / 1000).toFixed(1)}k</span>
                    <small>Req/m</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="dcld-status-bar">
              <div className="dcld-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="dcld-status-right">
                <div className="dcld-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <div className="dcld-wifi-icon">
                  <Wifi />
                </div>
                <div className="dcld-battery">
                  <div className="dcld-battery-body">
                    <div className="dcld-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`dcld-home-screen ${isAppOpen ? 'dcld-hidden' : ''}`}>
              {/* Time Widget */}
              <div className="dcld-time-widget">
                <div className="dcld-time">{currentTime}</div>
                <div className="dcld-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="dcld-widgets-container">
                {/* Server Widget */}
                <div
                  className="dcld-widget dcld-widget-hover"
                  onClick={() => setDynamicIslandState(dynamicIslandState === 'expanded' ? 'collapsed' : 'expanded')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="dcld-widget-header">
                    <div className="dcld-widget-icon">
                      <Server />
                    </div>
                    <span>{t.serversTab}</span>
                  </div>
                  <div className="dcld-server-widget-content">
                    <div className="dcld-server-count">
                      {runningServers}<span>/{totalServers}</span>
                    </div>
                    <div className="dcld-server-mini-grid">
                      {servers[language].slice(0, 6).map(server => (
                        <div
                          key={server.id}
                          className={`dcld-server-mini ${serverStates[server.id] === 'running' ? 'dcld-active' : 'dcld-inactive'}`}
                        >
                          <Server />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Metrics Widget */}
                <div className="dcld-widget dcld-widget-hover">
                  <div className="dcld-widget-header">
                    <div className="dcld-widget-icon">
                      <Activity />
                    </div>
                    <span>{t.resourceUsage}</span>
                  </div>
                  <div className="dcld-metrics-widget-content">
                    <div className="dcld-metric-row">
                      <div className="dcld-metric-label">
                        <span>CPU</span>
                        <span>58%</span>
                      </div>
                      <div className="dcld-metric-bar">
                        <div className="dcld-metric-bar-fill" style={{ width: '58%', background: 'linear-gradient(90deg, #6366f1, #818cf8)' }} />
                      </div>
                    </div>
                    <div className="dcld-metric-row">
                      <div className="dcld-metric-label">
                        <span>Memory</span>
                        <span>72%</span>
                      </div>
                      <div className="dcld-metric-bar">
                        <div className="dcld-metric-bar-fill" style={{ width: '72%', background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)' }} />
                      </div>
                    </div>
                    <div className="dcld-metric-row">
                      <div className="dcld-metric-label">
                        <span>Storage</span>
                        <span>45%</span>
                      </div>
                      <div className="dcld-metric-bar">
                        <div className="dcld-metric-bar-fill" style={{ width: '45%', background: 'linear-gradient(90deg, #06b6d4, #22d3ee)' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="dcld-dock">
                <div className="dcld-dock-icon dcld-close-icon dcld-dock-hover" onClick={handleClose}>
                  <span className="dcld-close-tooltip">{t.exit} X</span>
                  <img src={closeIcon} alt="Close" className="dcld-close-img" />
                </div>
                <div className="dcld-dock-icon dcld-contact-icon dcld-dock-hover" onClick={handleContactNavigation}>
                  <span className="dcld-contact-tooltip">{t.contact}</span>
                  <img src={networkIcon} alt="Contact" className="dcld-icon-img" />
                </div>
                <div className="dcld-dock-icon dcld-call-icon dcld-dock-hover" onClick={handleContactNavigation}>
                  <img src={callIcon} alt="Call" className="dcld-icon-img" />
                </div>
                <div className="dcld-dock-icon dcld-app-icon dcld-dock-hover" onClick={openApp}>
                  <span className="dcld-app-tooltip">{t.tooltip}</span>
                  <Cloud style={{ width: 28, height: 28, color: 'white' }} />
                </div>
              </div>
            </div>

            {/* App */}
            <div className={`dcld-app ${isAppOpen ? 'dcld-active' : ''}`}>
              <div className="dcld-app-content" onWheel={(e) => e.stopPropagation()}>
                <div className="dcld-cloud-app">
                  {/* Header */}
                  <div className="dcld-cloud-header">
                    <div className="dcld-cloud-header-top">
                      <div className="dcld-cloud-header-left">
                        <div className="dcld-cloud-logo">
                          <Cloud />
                        </div>
                        <div className="dcld-cloud-header-text">
                          <h1>{t.cloudConsole}</h1>
                          <p>{runningServers} {t.serversActive}</p>
                        </div>
                      </div>
                      <button className="dcld-cloud-settings-btn" onClick={closeApp}>
                        <X />
                      </button>
                    </div>

                    {/* Tabs */}
                    <div className="dcld-cloud-tabs">
                      {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`dcld-cloud-tab ${activeTab === tab.id ? 'dcld-active' : ''}`}
                          >
                            <Icon />
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
            <div className="dcld-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="dcld-screen-reflection" />
          </div>
        </div>

        {/* Click outside hint */}
        <div className="dcld-hint">
          {language === 'tr' ? 'Kapatmak icin disari tiklayin' : 'Click outside to close'}
        </div>
      </div>
    </div>,
    document.body
  );
};
