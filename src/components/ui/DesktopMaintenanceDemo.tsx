import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './DesktopMaintenanceDemo.css';

// Assets
import closeIcon from '../../assets/demo-icons/Close_Cross_Circle.svg';
import callIcon from '../../assets/demo-icons/Call_Fill.svg';
import networkIcon from '../../assets/demo-icons/Network.svg';

// Icons
import {
  Shield,
  Activity,
  Server,
  Database,
  Wifi,
  HardDrive,
  Settings,
  Wrench,
  Headphones,
  CheckCircle,
  Clock,
  RefreshCw,
  MessageSquare,
  Send,
  X
} from 'lucide-react';

interface DesktopMaintenanceDemoProps {
  language: 'tr' | 'en';
  onContactClick: () => void;
  onClose: () => void;
}

type DynamicIslandState = 'collapsed' | 'compact' | 'expanded';
type TabType = 'status' | 'tickets' | 'support';

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

// System services data
const services = {
  tr: [
    { id: 1, name: 'Web Sunucusu', icon: Server, status: 'healthy', uptime: '99.9%' },
    { id: 2, name: 'Veritabanı', icon: Database, status: 'healthy', uptime: '99.8%' },
    { id: 3, name: 'CDN', icon: Wifi, status: 'warning', uptime: '98.5%' },
    { id: 4, name: 'Yedekleme', icon: HardDrive, status: 'healthy', uptime: '100%' },
    { id: 5, name: 'API Gateway', icon: Activity, status: 'healthy', uptime: '99.7%' },
  ],
  en: [
    { id: 1, name: 'Web Server', icon: Server, status: 'healthy', uptime: '99.9%' },
    { id: 2, name: 'Database', icon: Database, status: 'healthy', uptime: '99.8%' },
    { id: 3, name: 'CDN', icon: Wifi, status: 'warning', uptime: '98.5%' },
    { id: 4, name: 'Backup', icon: HardDrive, status: 'healthy', uptime: '100%' },
    { id: 5, name: 'API Gateway', icon: Activity, status: 'healthy', uptime: '99.7%' },
  ]
};

// Support tickets data
const tickets = {
  tr: [
    { id: 1, title: 'SSL Sertifika Yenileme', status: 'completed', priority: 'high', date: '2 gün önce' },
    { id: 2, title: 'Performans Optimizasyonu', status: 'in-progress', priority: 'medium', date: '1 gün önce' },
    { id: 3, title: 'Güvenlik Güncellemesi', status: 'pending', priority: 'high', date: 'Bugün' },
    { id: 4, title: 'Yedek Kontrolü', status: 'completed', priority: 'low', date: '3 gün önce' },
  ],
  en: [
    { id: 1, title: 'SSL Certificate Renewal', status: 'completed', priority: 'high', date: '2 days ago' },
    { id: 2, title: 'Performance Optimization', status: 'in-progress', priority: 'medium', date: '1 day ago' },
    { id: 3, title: 'Security Update', status: 'pending', priority: 'high', date: 'Today' },
    { id: 4, title: 'Backup Check', status: 'completed', priority: 'low', date: '3 days ago' },
  ]
};

export const DesktopMaintenanceDemo: React.FC<DesktopMaintenanceDemoProps> = ({
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
  const [activeTab, setActiveTab] = useState<TabType>('status');
  const [chatMessage, setChatMessage] = useState('');
  const [chatSent, setChatSent] = useState(false);

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
    document.body.classList.add('dmnt-modal-open');
    return () => {
      document.body.classList.remove('dmnt-modal-open');
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

  // Dynamic Island click handler - matches IoTDemo logic
  const handleDynamicIslandClick = () => {
    if (dynamicIslandState === 'collapsed') {
      // Collapsed -> Expanded (directly expand)
      setDynamicIslandState('expanded');
    } else if (dynamicIslandState === 'expanded') {
      // Expanded -> check if app is open
      if (isAppOpen) {
        // App open: go to compact (don't collapse while app is running)
        setDynamicIslandState('compact');
      } else {
        // App closed: collapse
        setDynamicIslandState('collapsed');
      }
    } else if (dynamicIslandState === 'compact') {
      // Compact -> Expanded
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
    setActiveTab('status');
    setDynamicIslandState('collapsed');
  };

  // Handle chat send
  const handleSendChat = () => {
    if (chatMessage.trim()) {
      setChatSent(true);
      setChatMessage('');
    }
  };

  // Calculate health stats
  const healthyServices = services[language].filter(s => s.status === 'healthy').length;
  const totalServices = services[language].length;

  // Tabs config
  const tabs: { id: TabType; label: { tr: string; en: string }; icon: React.ElementType }[] = [
    { id: 'status', label: { tr: 'Durum', en: 'Status' }, icon: Activity },
    { id: 'tickets', label: { tr: 'Talepler', en: 'Tickets' }, icon: Wrench },
    { id: 'support', label: { tr: 'Destek', en: 'Support' }, icon: Headphones },
  ];

  const content = (
    <div
      className={`dmnt-overlay ${isVisible ? 'dmnt-visible' : ''} ${isClosing ? 'dmnt-closing' : ''}`}
      onClick={handleClose}
    >
      <div
        className={`dmnt-iphone-container ${isVisible ? 'dmnt-visible' : ''} ${isClosing ? 'dmnt-closing' : ''}`}
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
        <div className="dmnt-iphone-frame" ref={phoneRef}>
          {/* Side buttons */}
          <div className="dmnt-side-button dmnt-silent-switch" />
          <div className="dmnt-side-button dmnt-volume-up" />
          <div className="dmnt-side-button dmnt-volume-down" />
          <div className="dmnt-side-button dmnt-power-button" />

          <div className="dmnt-iphone-screen">
            {/* Wallpaper */}
            <div className="dmnt-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`dmnt-dynamic-island dmnt-di-state-${dynamicIslandState}`}
              onClick={handleDynamicIslandClick}
            >
              {/* Collapsed content */}
              <div className="dmnt-di-collapsed-content">
                <div className="dmnt-di-camera" />
                <div className="dmnt-di-sensor" />
              </div>

              {/* Compact content */}
              <div className="dmnt-di-compact-content">
                <div className="dmnt-di-compact-left">
                  <div className="dmnt-di-compact-icon">
                    <Shield size={16} />
                  </div>
                  <div className="dmnt-di-compact-info">
                    <span className="dmnt-di-compact-title">
                      {language === 'tr' ? 'Sistem Durumu' : 'System Status'}
                    </span>
                    <span className="dmnt-di-compact-subtitle">
                      {healthyServices}/{totalServices} {language === 'tr' ? 'sağlıklı' : 'healthy'}
                    </span>
                  </div>
                </div>
                <div className="dmnt-di-compact-right">
                  <span className="dmnt-di-compact-health">99%</span>
                </div>
              </div>

              {/* Expanded content */}
              <div className="dmnt-di-expanded-content">
                <div className="dmnt-di-status-left">
                  <div className="dmnt-di-status-icon">
                    <Shield size={22} />
                  </div>
                  <div className="dmnt-di-status-info">
                    <h4>{language === 'tr' ? 'Tüm Sistemler Aktif' : 'All Systems Active'}</h4>
                    <p>{language === 'tr' ? 'Son kontrol: 2 dk önce' : 'Last check: 2 min ago'}</p>
                  </div>
                </div>
                <div className="dmnt-di-status-right">
                  <div className="dmnt-di-sensor-badge">
                    <span>45</span>
                    <small>ms</small>
                  </div>
                  <div className="dmnt-di-sensor-badge">
                    <span>99%</span>
                    <small>{language === 'tr' ? 'sağlık' : 'health'}</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="dmnt-status-bar">
              <div className="dmnt-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="dmnt-status-right">
                <div className="dmnt-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <div className="dmnt-wifi-icon">
                  <Wifi size={16} />
                </div>
                <div className="dmnt-battery">
                  <div className="dmnt-battery-body">
                    <div className="dmnt-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`dmnt-home-screen ${isAppOpen ? 'dmnt-hidden' : ''}`}>
              {/* Time Widget */}
              <div className="dmnt-time-widget">
                <div className="dmnt-time">{currentTime}</div>
                <div className="dmnt-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="dmnt-widgets-container">
                {/* System Widget */}
                <div
                  className="dmnt-widget dmnt-widget-hover"
                  onClick={openApp}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="dmnt-widget-header">
                    <div className="dmnt-widget-icon">
                      <Shield size={16} />
                    </div>
                    <span>{language === 'tr' ? 'Sistem' : 'System'}</span>
                  </div>
                  <div className="dmnt-system-widget-content">
                    <div className="dmnt-system-count">
                      {healthyServices}<span>/{totalServices}</span>
                    </div>
                    <div className="dmnt-system-mini-grid">
                      {services[language].map((service) => (
                        <div
                          key={service.id}
                          className={`dmnt-system-mini dmnt-${service.status}`}
                        >
                          <service.icon size={14} />
                        </div>
                      ))}
                      <div className="dmnt-system-mini dmnt-healthy">
                        <Activity size={14} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tickets Widget */}
                <div
                  className="dmnt-widget dmnt-widget-hover"
                  onClick={() => {
                    openApp();
                    setActiveTab('tickets');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="dmnt-widget-header">
                    <div className="dmnt-widget-icon">
                      <Wrench size={16} />
                    </div>
                    <span>{language === 'tr' ? 'Talepler' : 'Tickets'}</span>
                  </div>
                  <div className="dmnt-tickets-widget-content">
                    <div className="dmnt-ticket-row">
                      <div className="dmnt-ticket-row-left">
                        <CheckCircle size={14} color="#22c55e" />
                        <span>{language === 'tr' ? 'Çözüldü' : 'Resolved'}</span>
                      </div>
                      <strong style={{ color: '#22c55e' }}>12</strong>
                    </div>
                    <div className="dmnt-ticket-row">
                      <div className="dmnt-ticket-row-left">
                        <RefreshCw size={14} color="#3b82f6" />
                        <span>{language === 'tr' ? 'Aktif' : 'Active'}</span>
                      </div>
                      <strong style={{ color: '#3b82f6' }}>3</strong>
                    </div>
                    <div className="dmnt-ticket-row">
                      <div className="dmnt-ticket-row-left">
                        <Clock size={14} color="#f59e0b" />
                        <span>{language === 'tr' ? 'Bekliyor' : 'Pending'}</span>
                      </div>
                      <strong style={{ color: '#f59e0b' }}>2</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="dmnt-dock">
                <div className="dmnt-dock-icon dmnt-close-icon dmnt-dock-hover" onClick={handleClose}>
                  <span className="dmnt-close-tooltip">{t.exit} X</span>
                  <img src={closeIcon} alt="Close" className="dmnt-close-img" />
                </div>
                <div className="dmnt-dock-icon dmnt-contact-icon dmnt-dock-hover" onClick={handleContactNavigation}>
                  <span className="dmnt-contact-tooltip">{t.contact}</span>
                  <img src={networkIcon} alt="Contact" className="dmnt-icon-img" />
                </div>
                <div className="dmnt-dock-icon dmnt-call-icon dmnt-dock-hover" onClick={handleContactNavigation}>
                  <img src={callIcon} alt="Call" className="dmnt-icon-img" />
                </div>
                <div className="dmnt-dock-icon dmnt-app-icon dmnt-dock-hover" onClick={openApp}>
                  <span className="dmnt-app-tooltip">{t.openApp}</span>
                  <Shield style={{ width: 28, height: 28, color: 'white' }} />
                </div>
              </div>
            </div>

            {/* App */}
            <div className={`dmnt-app ${isAppOpen ? 'dmnt-active' : ''}`}>
              <div className="dmnt-app-content" onWheel={(e) => e.stopPropagation()}>
                <div className="dmnt-maintenance-app">
                  {/* Header */}
                  <div className="dmnt-maintenance-header">
                    <div className="dmnt-maintenance-header-top">
                      <div className="dmnt-maintenance-header-left">
                        <div className="dmnt-maintenance-logo">
                          <Shield size={18} />
                        </div>
                        <div className="dmnt-maintenance-header-text">
                          <h1>{language === 'tr' ? 'Bakım Paneli' : 'Maintenance Panel'}</h1>
                          <p>
                            {healthyServices}/{totalServices} {language === 'tr' ? 'sistem sağlıklı' : 'systems healthy'}
                          </p>
                        </div>
                      </div>
                      <button className="dmnt-maintenance-settings-btn" onClick={closeApp}>
                        <X size={18} />
                      </button>
                    </div>

                    {/* Tabs */}
                    <div className="dmnt-maintenance-tabs">
                      {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`dmnt-maintenance-tab ${activeTab === tab.id ? 'dmnt-active' : ''}`}
                          >
                            <Icon size={14} />
                            {tab.label[language]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="dmnt-maintenance-content">
                    {/* Status Tab */}
                    {activeTab === 'status' && (
                      <>
                        {/* Quick Stats */}
                        <div className="dmnt-quick-stats">
                          <div className="dmnt-stat-card dmnt-highlight">
                            <CheckCircle size={16} color="#22c55e" />
                            <p>99%</p>
                            <span>{language === 'tr' ? 'Sağlık' : 'Health'}</span>
                          </div>
                          <div className="dmnt-stat-card">
                            <Activity size={16} color="#94a3b8" />
                            <p>45ms</p>
                            <span>{language === 'tr' ? 'Yanıt' : 'Response'}</span>
                          </div>
                          <div className="dmnt-stat-card">
                            <CheckCircle size={16} color="#94a3b8" />
                            <p>98%</p>
                            <span>{language === 'tr' ? 'Çözüm' : 'Resolved'}</span>
                          </div>
                        </div>

                        {/* Services */}
                        <h3 className="dmnt-section-title">
                          {language === 'tr' ? 'Sistem Durumu' : 'System Status'}
                        </h3>
                        {services[language].map(service => {
                          const Icon = service.icon;
                          return (
                            <div key={service.id} className={`dmnt-service-card dmnt-${service.status}`}>
                              <div className="dmnt-service-card-header">
                                <div className="dmnt-service-card-left">
                                  <div className="dmnt-service-icon">
                                    <Icon size={16} />
                                  </div>
                                  <span className="dmnt-service-name">{service.name}</span>
                                </div>
                                <div className={`dmnt-service-status-dot dmnt-${service.status}`} />
                              </div>
                              <div className="dmnt-service-card-footer">
                                <span>Uptime</span>
                                <span>{service.uptime}</span>
                              </div>
                            </div>
                          );
                        })}

                        {/* Last Check */}
                        <div className="dmnt-last-check">
                          <div className="dmnt-last-check-left">
                            <RefreshCw size={16} />
                            <span>{language === 'tr' ? 'Son Kontrol' : 'Last Check'}</span>
                          </div>
                          <span>2 {language === 'tr' ? 'dk önce' : 'min ago'}</span>
                        </div>
                      </>
                    )}

                    {/* Tickets Tab */}
                    {activeTab === 'tickets' && (
                      <>
                        {/* Ticket Stats */}
                        <div className="dmnt-ticket-stats">
                          <div className="dmnt-ticket-stat dmnt-resolved">
                            <CheckCircle size={16} />
                            <div className="dmnt-ticket-stat-value">12</div>
                            <div className="dmnt-ticket-stat-label">{language === 'tr' ? 'Çözüldü' : 'Resolved'}</div>
                          </div>
                          <div className="dmnt-ticket-stat dmnt-active">
                            <RefreshCw size={16} />
                            <div className="dmnt-ticket-stat-value">3</div>
                            <div className="dmnt-ticket-stat-label">{language === 'tr' ? 'Aktif' : 'Active'}</div>
                          </div>
                          <div className="dmnt-ticket-stat dmnt-pending">
                            <Clock size={16} />
                            <div className="dmnt-ticket-stat-value">2</div>
                            <div className="dmnt-ticket-stat-label">{language === 'tr' ? 'Bekliyor' : 'Pending'}</div>
                          </div>
                        </div>

                        {/* Ticket List */}
                        <h3 className="dmnt-section-title">
                          {language === 'tr' ? 'Son Talepler' : 'Recent Tickets'}
                        </h3>
                        <div className="dmnt-ticket-list">
                          {tickets[language].map(ticket => (
                            <div key={ticket.id} className="dmnt-ticket-item">
                              <div className="dmnt-ticket-item-header">
                                <div className={`dmnt-ticket-priority-dot dmnt-${ticket.priority}`} />
                                <span className="dmnt-ticket-title">{ticket.title}</span>
                              </div>
                              <div className="dmnt-ticket-item-footer">
                                <span className={`dmnt-ticket-status dmnt-${ticket.status === 'completed' ? 'completed' : ticket.status === 'in-progress' ? 'in-progress' : 'waiting'}`}>
                                  {ticket.status === 'completed' ? (
                                    <>
                                      <CheckCircle size={10} />
                                      {language === 'tr' ? 'Tamamlandı' : 'Completed'}
                                    </>
                                  ) : ticket.status === 'in-progress' ? (
                                    <>
                                      <RefreshCw size={10} />
                                      {language === 'tr' ? 'Devam Ediyor' : 'In Progress'}
                                    </>
                                  ) : (
                                    <>
                                      <Clock size={10} />
                                      {language === 'tr' ? 'Bekliyor' : 'Pending'}
                                    </>
                                  )}
                                </span>
                                <span className="dmnt-ticket-date">{ticket.date}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* New Ticket Button */}
                        <button className="dmnt-new-ticket-btn">
                          <Wrench size={16} />
                          {language === 'tr' ? 'Yeni Talep Oluştur' : 'Create New Ticket'}
                        </button>
                      </>
                    )}

                    {/* Support Tab */}
                    {activeTab === 'support' && (
                      <>
                        {/* Support Info */}
                        <div className="dmnt-support-info">
                          <div className="dmnt-support-header">
                            <div className="dmnt-support-avatar">
                              <Headphones size={22} />
                            </div>
                            <div className="dmnt-support-text">
                              <h4>7/24 {language === 'tr' ? 'Destek' : 'Support'}</h4>
                              <p>{language === 'tr' ? 'Ortalama yanıt: 15 dk' : 'Avg. response: 15 min'}</p>
                            </div>
                          </div>
                          <div className="dmnt-support-contacts">
                            <div className="dmnt-support-contact">
                              <p>Email</p>
                              <span>support@allync.com</span>
                            </div>
                            <div className="dmnt-support-contact">
                              <p>{language === 'tr' ? 'Telefon' : 'Phone'}</p>
                              <span>+90 555 000</span>
                            </div>
                          </div>
                        </div>

                        {/* Chat Area */}
                        <div className="dmnt-chat-area">
                          {!chatSent ? (
                            <div className="dmnt-chat-empty">
                              <MessageSquare size={32} />
                              <p>{language === 'tr' ? 'Mesajınızı yazın' : 'Type your message'}</p>
                            </div>
                          ) : (
                            <div className="dmnt-chat-messages">
                              <div className="dmnt-chat-message dmnt-sent">
                                {language === 'tr' ? 'Merhaba, yardıma ihtiyacım var.' : 'Hello, I need help.'}
                              </div>
                              <div className="dmnt-chat-message dmnt-received">
                                {language === 'tr'
                                  ? 'Merhaba! Size nasıl yardımcı olabilirim?'
                                  : 'Hello! How can I help you?'}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Chat Input */}
                        <div className="dmnt-chat-input-wrapper">
                          <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                            placeholder={language === 'tr' ? 'Mesajınızı yazın...' : 'Type a message...'}
                            className="dmnt-chat-input"
                          />
                          <button onClick={handleSendChat} className="dmnt-chat-send-btn">
                            <Send size={18} />
                          </button>
                        </div>

                        {/* CTA */}
                        <button onClick={handleContactNavigation} className="dmnt-cta-btn">
                          {language === 'tr' ? 'Bakım Paketi İsteyin' : 'Request Maintenance Package'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Home Indicator */}
              <div className="dmnt-home-indicator" onClick={closeApp} />
            </div>

            {/* Home Indicator */}
            <div className="dmnt-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="dmnt-screen-reflection" />
          </div>
        </div>

        {/* Hint */}
        <div className="dmnt-hint">
          {t.closeHint}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};
