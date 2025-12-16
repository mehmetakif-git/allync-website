import React, { useState, useEffect } from 'react';
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
  Bell
} from 'lucide-react';

interface IoTDemoProps {
  language: 'tr' | 'en';
  onContactClick?: () => void;
}

type TabType = 'devices' | 'sensors' | 'alerts';

// Device data
const devices = {
  tr: [
    { id: 1, name: 'Oturma Odası Işık', icon: Lightbulb, room: 'Oturma Odası', status: true },
    { id: 2, name: 'Klima', icon: Fan, room: 'Yatak Odası', status: false },
    { id: 3, name: 'Güvenlik Kamerası', icon: Camera, room: 'Giriş', status: true },
    { id: 4, name: 'Akıllı Kilit', icon: Lock, room: 'Ana Kapı', status: true },
    { id: 5, name: 'Mutfak Işık', icon: Lightbulb, room: 'Mutfak', status: false },
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
    { id: 1, type: 'warning', message: 'Nem seviyesi yüksek (%78)', time: '2 dk önce', icon: Droplets },
    { id: 2, type: 'success', message: 'Güvenlik sistemi aktif', time: '15 dk önce', icon: CheckCircle },
    { id: 3, type: 'warning', message: 'Enerji tüketimi ortalamanın üstünde', time: '1 saat önce', icon: Zap },
    { id: 4, type: 'info', message: 'Termostat ayarı güncellendi', time: '3 saat önce', icon: Thermometer },
  ],
  en: [
    { id: 1, type: 'warning', message: 'Humidity level high (78%)', time: '2 min ago', icon: Droplets },
    { id: 2, type: 'success', message: 'Security system active', time: '15 min ago', icon: CheckCircle },
    { id: 3, type: 'warning', message: 'Energy consumption above average', time: '1 hour ago', icon: Zap },
    { id: 4, type: 'info', message: 'Thermostat setting updated', time: '3 hours ago', icon: Thermometer },
  ]
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
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="w-4 h-4 mb-0.5" style={{ color }} />
          <span className="text-white text-sm font-bold">{value}{unit}</span>
        </div>
      </div>
      <span className="text-gray-400 text-xs mt-1">{label}</span>
    </div>
  );
};

// Device Card Component
const DeviceCard: React.FC<{
  device: typeof devices.tr[0];
  isOn: boolean;
  onToggle: () => void;
}> = ({ device, isOn, onToggle }) => {
  const Icon = device.icon;

  return (
    <div
      className={`p-3 rounded-xl border transition-all ${
        isOn
          ? 'bg-teal-500/20 border-teal-500/50'
          : 'bg-white/5 border-white/10'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          isOn ? 'bg-teal-500' : 'bg-white/10'
        }`}>
          <Icon className={`w-4 h-4 ${isOn ? 'text-white' : 'text-gray-400'}`} />
        </div>
        <button
          onClick={onToggle}
          className={`w-10 h-5 rounded-full transition-all relative ${
            isOn ? 'bg-teal-500' : 'bg-white/20'
          }`}
        >
          <div
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
              isOn ? 'left-5' : 'left-0.5'
            }`}
          />
        </button>
      </div>
      <h4 className="text-white text-xs font-medium truncate">{device.name}</h4>
      <p className="text-gray-500 text-[10px]">{device.room}</p>
    </div>
  );
};

// Alert Item Component
const AlertItem: React.FC<{
  alert: typeof alertsData.tr[0];
}> = ({ alert }) => {
  const Icon = alert.icon;
  const colors = {
    warning: 'text-amber-400 bg-amber-500/20',
    success: 'text-teal-400 bg-teal-500/20',
    info: 'text-blue-400 bg-blue-500/20',
  };
  const colorClass = colors[alert.type as keyof typeof colors] || colors.info;

  return (
    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass.split(' ')[1]}`}>
        <Icon className={`w-4 h-4 ${colorClass.split(' ')[0]}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs">{alert.message}</p>
        <p className="text-gray-500 text-[10px] mt-0.5">{alert.time}</p>
      </div>
    </div>
  );
};

export const IoTDemo: React.FC<IoTDemoProps> = ({ language, onContactClick }) => {
  const [activeTab, setActiveTab] = useState<TabType>('devices');
  const [deviceStates, setDeviceStates] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    devices[language].forEach(d => { initial[d.id] = d.status; });
    return initial;
  });

  // Animated sensor values
  const temperature = useAnimatedValue(24, 1200);
  const humidity = useAnimatedValue(65, 1400);
  const energy = useAnimatedValue(3.2, 1600);
  const activeDevices = Object.values(deviceStates).filter(Boolean).length;

  const tabs: { id: TabType; label: { tr: string; en: string }; icon: React.ElementType }[] = [
    { id: 'devices', label: { tr: 'Cihazlar', en: 'Devices' }, icon: Power },
    { id: 'sensors', label: { tr: 'Sensörler', en: 'Sensors' }, icon: Activity },
    { id: 'alerts', label: { tr: 'Uyarılar', en: 'Alerts' }, icon: Bell },
  ];

  const toggleDevice = (id: number) => {
    setDeviceStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Header
  const Header = () => (
    <div className="pt-8 px-4 pb-3 border-b border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
            <Home className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">
              {language === 'tr' ? 'Akıllı Ev' : 'Smart Home'}
            </h1>
            <p className="text-gray-500 text-[10px]">
              {activeDevices} {language === 'tr' ? 'cihaz aktif' : 'devices active'}
            </p>
          </div>
        </div>
        <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
          <Settings className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mt-4">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-teal-500/20 text-teal-400'
                  : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label[language]}
            </button>
          );
        })}
      </div>
    </div>
  );

  // Devices Tab
  const DevicesTab = () => (
    <div className="p-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-white/5 rounded-xl text-center">
          <Wifi className="w-4 h-4 text-teal-400 mx-auto mb-1" />
          <p className="text-white text-sm font-bold">{devices[language].length}</p>
          <p className="text-gray-500 text-[10px]">{language === 'tr' ? 'Toplam' : 'Total'}</p>
        </div>
        <div className="p-3 bg-teal-500/20 rounded-xl text-center">
          <CheckCircle className="w-4 h-4 text-teal-400 mx-auto mb-1" />
          <p className="text-white text-sm font-bold">{activeDevices}</p>
          <p className="text-gray-500 text-[10px]">{language === 'tr' ? 'Aktif' : 'Active'}</p>
        </div>
        <div className="p-3 bg-white/5 rounded-xl text-center">
          <Power className="w-4 h-4 text-gray-400 mx-auto mb-1" />
          <p className="text-white text-sm font-bold">{devices[language].length - activeDevices}</p>
          <p className="text-gray-500 text-[10px]">{language === 'tr' ? 'Kapalı' : 'Off'}</p>
        </div>
      </div>

      {/* Device Grid */}
      <h3 className="text-white text-xs font-semibold mb-3">
        {language === 'tr' ? 'Tüm Cihazlar' : 'All Devices'}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {devices[language].map(device => (
          <DeviceCard
            key={device.id}
            device={device}
            isOn={deviceStates[device.id]}
            onToggle={() => toggleDevice(device.id)}
          />
        ))}
      </div>
    </div>
  );

  // Sensors Tab
  const SensorsTab = () => (
    <div className="p-4">
      {/* Main Gauges */}
      <div className="flex justify-around mb-6">
        <CircularGauge
          value={temperature}
          max={40}
          label={language === 'tr' ? 'Sıcaklık' : 'Temperature'}
          unit="°C"
          color="#14b8a6"
          icon={Thermometer}
        />
        <CircularGauge
          value={humidity}
          max={100}
          label={language === 'tr' ? 'Nem' : 'Humidity'}
          unit="%"
          color="#06b6d4"
          icon={Droplets}
        />
        <CircularGauge
          value={Math.floor(energy * 10) / 10}
          max={10}
          label={language === 'tr' ? 'Enerji' : 'Energy'}
          unit="kW"
          color="#f59e0b"
          icon={Zap}
        />
      </div>

      {/* Live Data */}
      <h3 className="text-white text-xs font-semibold mb-3">
        {language === 'tr' ? 'Canlı Veriler' : 'Live Data'}
      </h3>
      <div className="space-y-2">
        <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-gray-300 text-xs">
              {language === 'tr' ? 'Oturma Odası' : 'Living Room'}
            </span>
          </div>
          <span className="text-white text-xs font-medium">23°C</span>
        </div>
        <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-gray-300 text-xs">
              {language === 'tr' ? 'Yatak Odası' : 'Bedroom'}
            </span>
          </div>
          <span className="text-white text-xs font-medium">21°C</span>
        </div>
        <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-gray-300 text-xs">
              {language === 'tr' ? 'Mutfak' : 'Kitchen'}
            </span>
          </div>
          <span className="text-white text-xs font-medium">25°C</span>
        </div>
      </div>

      {/* Energy Chart */}
      <h3 className="text-white text-xs font-semibold mt-4 mb-3">
        {language === 'tr' ? 'Günlük Enerji' : 'Daily Energy'}
      </h3>
      <div className="h-20 flex items-end gap-1">
        {[2.1, 1.8, 2.4, 3.1, 2.8, 3.5, 3.2].map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-gradient-to-t from-teal-500 to-cyan-400 rounded-t"
              style={{ height: `${(val / 4) * 100}%` }}
            />
            <span className="text-gray-500 text-[8px] mt-1">
              {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  // Alerts Tab
  const AlertsTab = () => (
    <div className="p-4">
      {/* Alert Summary */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 p-3 bg-amber-500/20 rounded-lg text-center">
          <AlertTriangle className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <p className="text-white text-sm font-bold">2</p>
          <p className="text-gray-500 text-[10px]">{language === 'tr' ? 'Uyarı' : 'Warnings'}</p>
        </div>
        <div className="flex-1 p-3 bg-teal-500/20 rounded-lg text-center">
          <CheckCircle className="w-4 h-4 text-teal-400 mx-auto mb-1" />
          <p className="text-white text-sm font-bold">1</p>
          <p className="text-gray-500 text-[10px]">{language === 'tr' ? 'Başarılı' : 'Success'}</p>
        </div>
        <div className="flex-1 p-3 bg-blue-500/20 rounded-lg text-center">
          <Activity className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <p className="text-white text-sm font-bold">1</p>
          <p className="text-gray-500 text-[10px]">{language === 'tr' ? 'Bilgi' : 'Info'}</p>
        </div>
      </div>

      {/* Alert List */}
      <h3 className="text-white text-xs font-semibold mb-3">
        {language === 'tr' ? 'Son Bildirimler' : 'Recent Notifications'}
      </h3>
      <div className="space-y-2">
        {alertsData[language].map(alert => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </div>

      {/* CTA */}
      {onContactClick && (
        <button
          onClick={onContactClick}
          className="w-full mt-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-xs font-bold rounded-lg active:scale-95 transition-transform"
        >
          {language === 'tr' ? 'IoT Çözümü İsteyin' : 'Request IoT Solution'}
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

  return (
    <div className="h-full bg-[#0a0a0f] overflow-auto">
      <Header />
      {renderTab()}
    </div>
  );
};
