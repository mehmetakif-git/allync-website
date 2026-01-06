import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './MobileIoTDemo.css';

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
  Bell,
  X
} from 'lucide-react';

interface MobileIoTDemoProps {
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

export const MobileIoTDemo: React.FC<MobileIoTDemoProps> = ({
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

  // IoT App states
  const [activeTab, setActiveTab] = useState<TabType>('devices');
  const [deviceStates, setDeviceStates] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    devices[language].forEach(d => { initial[d.id] = d.status; });
    return initial;
  });

  const t = uiText[language];

  // Animated sensor values - trigger when Dynamic Island expands
  const isExpanded = dynamicIslandState === 'expanded';
  const temperature = useAnimatedValue(24, 1200, isExpanded);
  const humidity = useAnimatedValue(65, 1400, isExpanded);
  const energy = useAnimatedValue(32, 1600, isExpanded);
  const activeDevices = Object.values(deviceStates).filter(Boolean).length;

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
    document.body.classList.add('miot-modal-open');
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.classList.remove('miot-modal-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  const toggleDevice = useCallback((id: number) => {
    setDeviceStates(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const openApp = () => {
    setIsAppOpen(true);
    setDynamicIslandState('compact');
  };

  const closeApp = () => {
    setIsAppOpen(false);
    setActiveTab('devices');
    setDynamicIslandState('collapsed');
  };

  const handleClose = () => {
    setDynamicIslandState('collapsed');
    if (onClose) {
      onClose();
    }
  };

  const handleContactNavigation = () => {
    setDynamicIslandState('collapsed');
    document.body.classList.remove('miot-modal-open');
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
      <div className="miot-gauge">
        <div className="miot-gauge-circle">
          <svg width="80" height="80">
            <circle
              cx="40"
              cy="40"
              r="36"
              className="miot-gauge-bg"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              className="miot-gauge-fill"
              stroke={color}
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="miot-gauge-center">
            <Icon style={{ color }} />
            <span>{value}{unit}</span>
          </div>
        </div>
        <span className="miot-gauge-label">{label}</span>
      </div>
    );
  };

  // Devices Tab
  const DevicesTab = () => (
    <div className="miot-iot-content">
      {/* Quick Stats */}
      <div className="miot-quick-stats">
        <div className="miot-stat-card">
          <Wifi style={{ color: '#14b8a6' }} />
          <p>{devices[language].length}</p>
          <span>{t.total}</span>
        </div>
        <div className="miot-stat-card miot-highlight">
          <CheckCircle style={{ color: '#14b8a6' }} />
          <p>{activeDevices}</p>
          <span>{t.active}</span>
        </div>
        <div className="miot-stat-card">
          <Power style={{ color: 'rgba(255,255,255,0.5)' }} />
          <p>{devices[language].length - activeDevices}</p>
          <span>{t.off}</span>
        </div>
      </div>

      {/* Device Grid */}
      <h3 className="miot-section-title">{t.allDevices}</h3>
      <div className="miot-device-grid">
        {devices[language].map(device => {
          const Icon = device.icon;
          const isOn = deviceStates[device.id];
          return (
            <div key={device.id} className={`miot-device-card ${isOn ? 'miot-on' : ''}`}>
              <div className="miot-device-card-top">
                <div className="miot-device-icon">
                  <Icon />
                </div>
                <button
                  className={`miot-toggle ${isOn ? 'miot-on' : ''}`}
                  onClick={() => toggleDevice(device.id)}
                >
                  <div className="miot-toggle-knob" />
                </button>
              </div>
              <h4 className="miot-device-name">{device.name}</h4>
              <p className="miot-device-room">{device.room}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Sensors Tab
  const SensorsTab = () => (
    <div className="miot-iot-content">
      {/* Main Gauges */}
      <div className="miot-gauges-row">
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
      <h3 className="miot-section-title">{t.liveData}</h3>
      <div className="miot-live-data">
        <div className="miot-live-item">
          <div className="miot-live-item-left">
            <div className="miot-live-dot" />
            <span>{t.livingRoom}</span>
          </div>
          <strong>23°C</strong>
        </div>
        <div className="miot-live-item">
          <div className="miot-live-item-left">
            <div className="miot-live-dot" />
            <span>{t.bedroom}</span>
          </div>
          <strong>21°C</strong>
        </div>
        <div className="miot-live-item">
          <div className="miot-live-item-left">
            <div className="miot-live-dot" style={{ background: '#06b6d4' }} />
            <span>{t.kitchen}</span>
          </div>
          <strong>25°C</strong>
        </div>
      </div>

      {/* Energy Chart */}
      <h3 className="miot-section-title">{t.dailyEnergy}</h3>
      <div className="miot-energy-chart">
        {[2.1, 1.8, 2.4, 3.1, 2.8, 3.5, 3.2].map((val, i) => (
          <div key={i} className="miot-chart-bar-wrapper">
            <div
              className="miot-chart-bar"
              style={{ height: `${(val / 4) * 100}%` }}
            />
            <span className="miot-chart-label">
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
    <div className="miot-iot-content">
      {/* Alert Summary */}
      <div className="miot-alert-summary">
        <div className="miot-alert-box miot-warning">
          <AlertTriangle />
          <p>2</p>
          <span>{t.warnings}</span>
        </div>
        <div className="miot-alert-box miot-success">
          <CheckCircle />
          <p>1</p>
          <span>{t.success}</span>
        </div>
        <div className="miot-alert-box miot-info">
          <Activity />
          <p>1</p>
          <span>{t.info}</span>
        </div>
      </div>

      {/* Alert List */}
      <h3 className="miot-section-title">{t.recentNotifications}</h3>
      <div className="miot-alert-list">
        {alertsData[language].map(alert => {
          const Icon = alert.icon;
          return (
            <div key={alert.id} className="miot-alert-item">
              <div className={`miot-alert-icon miot-${alert.type}`}>
                <Icon />
              </div>
              <div className="miot-alert-text">
                <p>{alert.message}</p>
                <span>{alert.time}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      {onContactClick && (
        <button onClick={handleContactNavigation} className="miot-cta-btn">
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
    <div className="miot-overlay">
      <div className="miot-iphone-container">
        <div className="miot-iphone-frame">
          {/* Side Buttons */}
          <div className="miot-side-button miot-silent-switch" />
          <div className="miot-side-button miot-volume-up" />
          <div className="miot-side-button miot-volume-down" />
          <div className="miot-side-button miot-power-button" />

          <div className="miot-iphone-screen">
            {/* Wallpaper */}
            <div className="miot-wallpaper" />

            {/* Dynamic Island - IoT Status */}
            <div
              className={`miot-dynamic-island miot-di-state-${dynamicIslandState}`}
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
              <div className="miot-di-collapsed-content">
                <div className="miot-di-camera" />
                <div className="miot-di-sensor" />
              </div>

              {/* Compact Content - shown when app is open */}
              <div className="miot-di-compact-content">
                <div className="miot-di-compact-left">
                  <div className="miot-di-compact-icon">
                    <Home />
                  </div>
                  <div className="miot-di-compact-info">
                    <span className="miot-di-compact-title">{t.smartHome}</span>
                    <span className="miot-di-compact-subtitle">{activeDevices} {t.devicesActive}</span>
                  </div>
                </div>
                <div className="miot-di-compact-right">
                  <span className="miot-di-compact-temp">{temperature}°</span>
                </div>
              </div>

              {/* Expanded Content - IoT Status */}
              <div className="miot-di-expanded-content">
                <div className="miot-di-status-left">
                  <div className="miot-di-status-icon">
                    <Home />
                  </div>
                  <div className="miot-di-status-info">
                    <h4>{t.smartHome}</h4>
                    <p>{activeDevices} {t.devicesActive}</p>
                  </div>
                </div>
                <div className="miot-di-status-right">
                  <div className="miot-di-sensor-badge">
                    <span>{temperature}°</span>
                    <small>Temp</small>
                  </div>
                  <div className="miot-di-sensor-badge">
                    <span>{humidity}%</span>
                    <small>Hum</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="miot-status-bar">
              <div className="miot-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="miot-status-right">
                <div className="miot-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <div className="miot-wifi-icon">
                  <Wifi />
                </div>
                <div className="miot-battery">
                  <div className="miot-battery-body">
                    <div className="miot-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`miot-home-screen ${isAppOpen ? 'miot-hidden' : ''}`}>
              {/* Time Widget */}
              <div className="miot-time-widget">
                <div className="miot-time">{currentTime}</div>
                <div className="miot-date">{currentDate}</div>
              </div>

              {/* Widgets - Sensors and Devices */}
              <div className="miot-widgets-container">
                {/* Sensors Widget */}
                <div className="miot-widget miot-widget-hover">
                  <div className="miot-widget-header">
                    <div className="miot-widget-icon">
                      <Activity />
                    </div>
                    <span>{t.sensors}</span>
                  </div>
                  <div className="miot-sensor-widget-content">
                    <div className="miot-sensor-row">
                      <div className="miot-sensor-row-left">
                        <Thermometer style={{ color: '#14b8a6' }} />
                        <span>{t.temperature}</span>
                      </div>
                      <strong>{temperature}°C</strong>
                    </div>
                    <div className="miot-sensor-row">
                      <div className="miot-sensor-row-left">
                        <Droplets style={{ color: '#06b6d4' }} />
                        <span>{t.humidity}</span>
                      </div>
                      <strong>{humidity}%</strong>
                    </div>
                    <div className="miot-sensor-row">
                      <div className="miot-sensor-row-left">
                        <Zap style={{ color: '#f59e0b' }} />
                        <span>{t.energy}</span>
                      </div>
                      <strong>3.2kW</strong>
                    </div>
                  </div>
                </div>

                {/* Devices Widget */}
                <div
                  className="miot-widget miot-widget-hover"
                  onClick={() => setDynamicIslandState(dynamicIslandState === 'expanded' ? 'collapsed' : 'expanded')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="miot-widget-header">
                    <div className="miot-widget-icon">
                      <Home />
                    </div>
                    <span>{t.devicesTab}</span>
                  </div>
                  <div className="miot-devices-widget-content">
                    <div className="miot-device-count">
                      {activeDevices}<span>/{devices[language].length}</span>
                    </div>
                    <div className="miot-device-mini-grid">
                      {devices[language].slice(0, 6).map(device => {
                        const Icon = device.icon;
                        return (
                          <div
                            key={device.id}
                            className={`miot-device-mini ${deviceStates[device.id] ? 'miot-active' : 'miot-inactive'}`}
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
              <div className="miot-dock">
                <div className="miot-dock-icon miot-close-icon miot-dock-hover" onClick={handleClose}>
                  <span className="miot-close-tooltip">{t.exit} X</span>
                  <img src={closeIcon} alt="Close" className="miot-close-img" />
                </div>
                <div className="miot-dock-icon miot-contact-icon miot-dock-hover" onClick={handleContactNavigation}>
                  <span className="miot-contact-tooltip">{t.contact}</span>
                  <img src={networkIcon} alt="Contact" className="miot-icon-img" />
                </div>
                <div className="miot-dock-icon miot-call-icon miot-dock-hover" onClick={handleContactNavigation}>
                  <img src={callIcon} alt="Call" className="miot-icon-img" />
                </div>
                <div className="miot-dock-icon miot-app-icon miot-dock-hover" onClick={openApp}>
                  <span className="miot-app-tooltip">{t.tooltip}</span>
                  <Wifi style={{ width: 28, height: 28, color: 'white' }} />
                </div>
              </div>
            </div>

            {/* App */}
            <div className={`miot-app ${isAppOpen ? 'miot-active' : ''}`}>
              <div className="miot-app-content" onWheel={(e) => e.stopPropagation()}>
                <div className="miot-iot-app">
                  {/* Header */}
                  <div className="miot-iot-header">
                    <div className="miot-iot-header-top">
                      <div className="miot-iot-header-left">
                        <div className="miot-iot-logo">
                          <Home />
                        </div>
                        <div className="miot-iot-header-text">
                          <h1>{t.smartHome}</h1>
                          <p>{activeDevices} {t.devicesActive}</p>
                        </div>
                      </div>
                      <button className="miot-iot-settings-btn" onClick={closeApp}>
                        <X />
                      </button>
                    </div>

                    {/* Tabs */}
                    <div className="miot-iot-tabs">
                      {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`miot-iot-tab ${activeTab === tab.id ? 'miot-active' : ''}`}
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
            <div className="miot-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="miot-screen-reflection" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
