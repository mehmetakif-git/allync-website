import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './DesktopIoTDemo.css';

// Assets
import closeIcon from '../../assets/demo-icons/Close_Cross_Circle.svg';
import callIcon from '../../assets/demo-icons/Call_Fill.svg';
import networkIcon from '../../assets/demo-icons/Network.svg';

// Icons
import {
  Wifi,
  Thermometer,
  Droplets,
  Zap,
  Lightbulb,
  Lock,
  Camera,
  Fan,
  AlertTriangle,
  CheckCircle,
  Activity,
  Power,
  Home,
  Settings,
  Bell,
  X
} from 'lucide-react';

interface DesktopIoTDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

type TabType = 'devices' | 'sensors' | 'alerts';

// Device data
const devices = {
  tr: [
    { id: 1, name: 'Oturma Odasi Isik', icon: Lightbulb, room: 'Oturma Odasi', status: true },
    { id: 2, name: 'Klima', icon: Fan, room: 'Yatak Odasi', status: false },
    { id: 3, name: 'Guvenlik Kamerasi', icon: Camera, room: 'Giris', status: true },
    { id: 4, name: 'Akilli Kilit', icon: Lock, room: 'Ana Kapi', status: true },
    { id: 5, name: 'Mutfak Isik', icon: Lightbulb, room: 'Mutfak', status: false },
    { id: 6, name: 'Termostat', icon: Thermometer, room: 'Koridor', status: true },
  ],
  en: [
    { id: 1, name: 'Living Room Light', icon: Lightbulb, room: 'Living Room', status: true },
    { id: 2, name: 'Air Conditioner', icon: Fan, room: 'Bedroom', status: false },
    { id: 3, name: 'Security Camera', icon: Camera, room: 'Entrance', status: true },
    { id: 4, name: 'Smart Lock', icon: Lock, room: 'Main Door', status: true },
    { id: 5, name: 'Kitchen Light', icon: Lightbulb, room: 'Kitchen', status: false },
    { id: 6, name: 'Thermostat', icon: Thermometer, room: 'Hallway', status: true },
  ]
};

// Alerts data
const alertsData = {
  tr: [
    { id: 1, type: 'warning', message: 'Nem seviyesi yuksek (%78)', time: '2 dk once', icon: Droplets },
    { id: 2, type: 'success', message: 'Guvenlik sistemi aktif', time: '15 dk once', icon: CheckCircle },
    { id: 3, type: 'warning', message: 'Enerji tuketimi ortalamanin ustunde', time: '1 saat once', icon: Zap },
    { id: 4, type: 'info', message: 'Termostat ayari guncellendi', time: '3 saat once', icon: Thermometer },
  ],
  en: [
    { id: 1, type: 'warning', message: 'Humidity level high (78%)', time: '2 min ago', icon: Droplets },
    { id: 2, type: 'success', message: 'Security system active', time: '15 min ago', icon: CheckCircle },
    { id: 3, type: 'warning', message: 'Energy consumption above average', time: '1 hour ago', icon: Zap },
    { id: 4, type: 'info', message: 'Thermostat setting updated', time: '3 hours ago', icon: Thermometer },
  ]
};

const uiText = {
  tr: {
    tooltip: "Demo'yu Baslat!",
    exit: 'Cikis',
    contact: 'Iletisim',
    sensors: 'Sensorler',
    devicesActive: 'cihaz aktif',
    smartHome: 'Akilli Ev',
    devicesTab: 'Cihazlar',
    sensorsTab: 'Sensorler',
    alertsTab: 'Uyarilar',
    total: 'Toplam',
    active: 'Aktif',
    off: 'Kapali',
    allDevices: 'Tum Cihazlar',
    temperature: 'Sicaklik',
    humidity: 'Nem',
    energy: 'Enerji',
    liveData: 'Canli Veriler',
    livingRoom: 'Oturma Odasi',
    bedroom: 'Yatak Odasi',
    kitchen: 'Mutfak',
    dailyEnergy: 'Gunluk Enerji',
    warnings: 'Uyari',
    success: 'Basarili',
    info: 'Bilgi',
    recentNotifications: 'Son Bildirimler',
    requestIoT: 'IoT Cozumu Isteyin'
  },
  en: {
    tooltip: 'Start Demo!',
    exit: 'Exit',
    contact: 'Contact',
    sensors: 'Sensors',
    devicesActive: 'devices active',
    smartHome: 'Smart Home',
    devicesTab: 'Devices',
    sensorsTab: 'Sensors',
    alertsTab: 'Alerts',
    total: 'Total',
    active: 'Active',
    off: 'Off',
    allDevices: 'All Devices',
    temperature: 'Temperature',
    humidity: 'Humidity',
    energy: 'Energy',
    liveData: 'Live Data',
    livingRoom: 'Living Room',
    bedroom: 'Bedroom',
    kitchen: 'Kitchen',
    dailyEnergy: 'Daily Energy',
    warnings: 'Warnings',
    success: 'Success',
    info: 'Info',
    recentNotifications: 'Recent Notifications',
    requestIoT: 'Request IoT Solution'
  }
};

// Animated sensor value hook
const useAnimatedValue = (target: number, duration: number = 1000) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
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
  }, [target, duration]);

  return value;
};

export const DesktopIoTDemo: React.FC<DesktopIoTDemoProps> = ({
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
  const [dynamicIslandState, setDynamicIslandState] = useState<'collapsed' | 'expanded'>('collapsed');

  // IoT App states
  const [activeTab, setActiveTab] = useState<TabType>('devices');
  const [deviceStates, setDeviceStates] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    devices[language].forEach(d => { initial[d.id] = d.status; });
    return initial;
  });

  // Animated sensor values
  const temperature = useAnimatedValue(24, 1200);
  const humidity = useAnimatedValue(65, 1400);
  const energy = useAnimatedValue(32, 1600);
  const activeDevices = Object.values(deviceStates).filter(Boolean).length;

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
    document.body.classList.add('diot-modal-open');
    return () => {
      document.body.classList.remove('diot-modal-open');
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
  };

  const closeApp = () => {
    setIsAppOpen(false);
    setActiveTab('devices');
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

  const toggleDevice = (id: number) => {
    setDeviceStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'devices', label: t.devicesTab, icon: Power },
    { id: 'sensors', label: t.sensorsTab, icon: Activity },
    { id: 'alerts', label: t.alertsTab, icon: Bell },
  ];

  // Circular Gauge Component
  const CircularGauge: React.FC<{
    value: number;
    max: number;
    label: string;
    unit: string;
    color: string;
    icon: React.ElementType;
  }> = ({ value, max, label, unit, color, icon: Icon }) => {
    const percentage = (value / max) * 100;
    const circumference = 2 * Math.PI * 36;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="diot-gauge">
        <div className="diot-gauge-circle">
          <svg width="80" height="80">
            <circle
              cx="40"
              cy="40"
              r="36"
              className="diot-gauge-bg"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              className="diot-gauge-fill"
              stroke={color}
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="diot-gauge-center">
            <Icon style={{ color }} />
            <span>{value}{unit}</span>
          </div>
        </div>
        <span className="diot-gauge-label">{label}</span>
      </div>
    );
  };

  // Devices Tab
  const DevicesTab = () => (
    <div className="diot-iot-content">
      {/* Quick Stats */}
      <div className="diot-quick-stats">
        <div className="diot-stat-card">
          <Wifi style={{ color: '#14b8a6' }} />
          <p>{devices[language].length}</p>
          <span>{t.total}</span>
        </div>
        <div className="diot-stat-card diot-highlight">
          <CheckCircle style={{ color: '#14b8a6' }} />
          <p>{activeDevices}</p>
          <span>{t.active}</span>
        </div>
        <div className="diot-stat-card">
          <Power style={{ color: 'rgba(255,255,255,0.5)' }} />
          <p>{devices[language].length - activeDevices}</p>
          <span>{t.off}</span>
        </div>
      </div>

      {/* Device Grid */}
      <h3 className="diot-section-title">{t.allDevices}</h3>
      <div className="diot-device-grid">
        {devices[language].map(device => {
          const Icon = device.icon;
          const isOn = deviceStates[device.id];
          return (
            <div key={device.id} className={`diot-device-card ${isOn ? 'diot-on' : ''}`}>
              <div className="diot-device-card-top">
                <div className="diot-device-icon">
                  <Icon />
                </div>
                <button
                  className={`diot-toggle ${isOn ? 'diot-on' : ''}`}
                  onClick={() => toggleDevice(device.id)}
                >
                  <div className="diot-toggle-knob" />
                </button>
              </div>
              <h4 className="diot-device-name">{device.name}</h4>
              <p className="diot-device-room">{device.room}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Sensors Tab
  const SensorsTab = () => (
    <div className="diot-iot-content">
      {/* Main Gauges */}
      <div className="diot-gauges-row">
        <CircularGauge
          value={temperature}
          max={40}
          label={t.temperature}
          unit="°C"
          color="#14b8a6"
          icon={Thermometer}
        />
        <CircularGauge
          value={humidity}
          max={100}
          label={t.humidity}
          unit="%"
          color="#06b6d4"
          icon={Droplets}
        />
        <CircularGauge
          value={Math.floor(energy / 10)}
          max={10}
          label={t.energy}
          unit="kW"
          color="#f59e0b"
          icon={Zap}
        />
      </div>

      {/* Live Data */}
      <h3 className="diot-section-title">{t.liveData}</h3>
      <div className="diot-live-data">
        <div className="diot-live-item">
          <div className="diot-live-item-left">
            <div className="diot-live-dot" />
            <span>{t.livingRoom}</span>
          </div>
          <strong>23°C</strong>
        </div>
        <div className="diot-live-item">
          <div className="diot-live-item-left">
            <div className="diot-live-dot" />
            <span>{t.bedroom}</span>
          </div>
          <strong>21°C</strong>
        </div>
        <div className="diot-live-item">
          <div className="diot-live-item-left">
            <div className="diot-live-dot" style={{ background: '#06b6d4' }} />
            <span>{t.kitchen}</span>
          </div>
          <strong>25°C</strong>
        </div>
      </div>

      {/* Energy Chart */}
      <h3 className="diot-section-title">{t.dailyEnergy}</h3>
      <div className="diot-energy-chart">
        {[2.1, 1.8, 2.4, 3.1, 2.8, 3.5, 3.2].map((val, i) => (
          <div key={i} className="diot-chart-bar-wrapper">
            <div
              className="diot-chart-bar"
              style={{ height: `${(val / 4) * 100}%` }}
            />
            <span className="diot-chart-label">
              {language === 'tr'
                ? ['Pzt', 'Sal', 'Car', 'Per', 'Cum', 'Cmt', 'Paz'][i]
                : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]
              }
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  // Alerts Tab
  const AlertsTab = () => (
    <div className="diot-iot-content">
      {/* Alert Summary */}
      <div className="diot-alert-summary">
        <div className="diot-alert-box diot-warning">
          <AlertTriangle />
          <p>2</p>
          <span>{t.warnings}</span>
        </div>
        <div className="diot-alert-box diot-success">
          <CheckCircle />
          <p>1</p>
          <span>{t.success}</span>
        </div>
        <div className="diot-alert-box diot-info">
          <Activity />
          <p>1</p>
          <span>{t.info}</span>
        </div>
      </div>

      {/* Alert List */}
      <h3 className="diot-section-title">{t.recentNotifications}</h3>
      <div className="diot-alert-list">
        {alertsData[language].map(alert => {
          const Icon = alert.icon;
          return (
            <div key={alert.id} className="diot-alert-item">
              <div className={`diot-alert-icon diot-${alert.type}`}>
                <Icon />
              </div>
              <div className="diot-alert-text">
                <p>{alert.message}</p>
                <span>{alert.time}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      {onContactClick && (
        <button onClick={handleContactNavigation} className="diot-cta-btn">
          {t.requestIoT}
        </button>
      )}
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'devices': return <DevicesTab />;
      case 'sensors': return <SensorsTab />;
      case 'alerts': return <AlertsTab />;
      default: return <DevicesTab />;
    }
  };

  return createPortal(
    <div className={`diot-overlay ${isVisible ? 'diot-visible' : ''} ${isClosing ? 'diot-closing' : ''}`} onClick={handleClose}>
      <div
        className={`diot-iphone-container ${isVisible ? 'diot-visible' : ''} ${isClosing ? 'diot-closing' : ''}`}
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
          className="diot-iphone-frame"
          ref={phoneRef}
        >
          {/* Side Buttons */}
          <div className="diot-side-button diot-silent-switch" />
          <div className="diot-side-button diot-volume-up" />
          <div className="diot-side-button diot-volume-down" />
          <div className="diot-side-button diot-power-button" />

          <div className="diot-iphone-screen">
            {/* Wallpaper */}
            <div className="diot-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`diot-dynamic-island diot-di-state-${dynamicIslandState}`}
              onClick={() => {
                if (dynamicIslandState === 'collapsed') {
                  setDynamicIslandState('expanded');
                } else {
                  setDynamicIslandState('collapsed');
                }
              }}
            >
              {/* Collapsed Content */}
              <div className="diot-di-collapsed-content">
                <div className="diot-di-camera" />
                <div className="diot-di-sensor" />
              </div>

              {/* Expanded Content */}
              <div className="diot-di-expanded-content">
                <div className="diot-di-status-left">
                  <div className="diot-di-status-icon">
                    <Home />
                  </div>
                  <div className="diot-di-status-info">
                    <h4>{t.smartHome}</h4>
                    <p>{activeDevices} {t.devicesActive}</p>
                  </div>
                </div>
                <div className="diot-di-status-right">
                  <div className="diot-di-sensor-badge">
                    <span>{temperature}°</span>
                    <small>Temp</small>
                  </div>
                  <div className="diot-di-sensor-badge">
                    <span>{humidity}%</span>
                    <small>Hum</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="diot-status-bar">
              <div className="diot-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="diot-status-right">
                <div className="diot-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <div className="diot-wifi-icon">
                  <Wifi />
                </div>
                <div className="diot-battery">
                  <div className="diot-battery-body">
                    <div className="diot-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`diot-home-screen ${isAppOpen ? 'diot-hidden' : ''}`}>
              {/* Time Widget */}
              <div className="diot-time-widget">
                <div className="diot-time">{currentTime}</div>
                <div className="diot-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="diot-widgets-container">
                {/* Sensors Widget */}
                <div className="diot-widget diot-widget-hover">
                  <div className="diot-widget-header">
                    <div className="diot-widget-icon">
                      <Activity />
                    </div>
                    <span>{t.sensors}</span>
                  </div>
                  <div className="diot-sensor-widget-content">
                    <div className="diot-sensor-row">
                      <div className="diot-sensor-row-left">
                        <Thermometer style={{ color: '#14b8a6' }} />
                        <span>{t.temperature}</span>
                      </div>
                      <strong>{temperature}°C</strong>
                    </div>
                    <div className="diot-sensor-row">
                      <div className="diot-sensor-row-left">
                        <Droplets style={{ color: '#06b6d4' }} />
                        <span>{t.humidity}</span>
                      </div>
                      <strong>{humidity}%</strong>
                    </div>
                    <div className="diot-sensor-row">
                      <div className="diot-sensor-row-left">
                        <Zap style={{ color: '#f59e0b' }} />
                        <span>{t.energy}</span>
                      </div>
                      <strong>3.2kW</strong>
                    </div>
                  </div>
                </div>

                {/* Devices Widget */}
                <div
                  className="diot-widget diot-widget-hover"
                  onClick={openApp}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="diot-widget-header">
                    <div className="diot-widget-icon">
                      <Home />
                    </div>
                    <span>{t.devicesTab}</span>
                  </div>
                  <div className="diot-devices-widget-content">
                    <div className="diot-device-count">
                      {activeDevices}<span>/{devices[language].length}</span>
                    </div>
                    <div className="diot-device-mini-grid">
                      {devices[language].slice(0, 6).map(device => {
                        const Icon = device.icon;
                        return (
                          <div
                            key={device.id}
                            className={`diot-device-mini ${deviceStates[device.id] ? 'diot-active' : 'diot-inactive'}`}
                          >
                            <Icon />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="diot-dock">
                <div className="diot-dock-icon diot-close-icon diot-dock-hover" onClick={handleClose}>
                  <span className="diot-close-tooltip">{t.exit} X</span>
                  <img src={closeIcon} alt="Close" className="diot-close-img" />
                </div>
                <div className="diot-dock-icon diot-contact-icon diot-dock-hover" onClick={handleContactNavigation}>
                  <img src={networkIcon} alt="Contact" className="diot-icon-img" />
                </div>
                <div className="diot-dock-icon diot-call-icon diot-dock-hover" onClick={handleContactNavigation}>
                  <img src={callIcon} alt="Call" className="diot-icon-img" />
                </div>
                <div className="diot-dock-icon diot-app-icon diot-dock-hover" onClick={openApp}>
                  <span className="diot-app-tooltip">{t.tooltip}</span>
                  <Wifi style={{ width: 28, height: 28, color: 'white' }} />
                </div>
              </div>
            </div>

            {/* App */}
            <div className={`diot-app ${isAppOpen ? 'diot-active' : ''}`}>
              <div className="diot-app-content" onWheel={(e) => e.stopPropagation()}>
                <div className="diot-iot-app">
                  {/* Header */}
                  <div className="diot-iot-header">
                    <div className="diot-iot-header-top">
                      <div className="diot-iot-header-left">
                        <div className="diot-iot-logo">
                          <Home />
                        </div>
                        <div className="diot-iot-header-text">
                          <h1>{t.smartHome}</h1>
                          <p>{activeDevices} {t.devicesActive}</p>
                        </div>
                      </div>
                      <button className="diot-iot-settings-btn" onClick={closeApp}>
                        <X />
                      </button>
                    </div>

                    {/* Tabs */}
                    <div className="diot-iot-tabs">
                      {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`diot-iot-tab ${activeTab === tab.id ? 'diot-active' : ''}`}
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
            <div className="diot-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="diot-screen-reflection" />
          </div>
        </div>

        {/* Click outside hint */}
        <div className="diot-hint">
          {language === 'tr' ? 'Kapatmak icin disari tiklayin' : 'Click outside to close'}
        </div>
      </div>
    </div>,
    document.body
  );
};
