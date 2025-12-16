import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Shield,
  Activity,
  HardDrive,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Database,
  Server,
  Wifi,
  MessageSquare,
  Send,
  Headphones,
  Settings
} from 'lucide-react';

interface MaintenanceDemoProps {
  language: 'tr' | 'en';
  onContactClick?: () => void;
}

type TabType = 'status' | 'tickets' | 'support';

// System services
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

// Support tickets
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

// Animated value hook
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

// Status Badge Component
const StatusBadge: React.FC<{
  status: string;
  language: 'tr' | 'en';
}> = ({ status, language }) => {
  const configs = {
    healthy: { color: 'bg-green-500/20 text-green-400', icon: CheckCircle, label: { tr: 'Sağlıklı', en: 'Healthy' } },
    warning: { color: 'bg-yellow-500/20 text-yellow-400', icon: AlertTriangle, label: { tr: 'Uyarı', en: 'Warning' } },
    error: { color: 'bg-red-500/20 text-red-400', icon: XCircle, label: { tr: 'Hata', en: 'Error' } },
    completed: { color: 'bg-green-500/20 text-green-400', icon: CheckCircle, label: { tr: 'Tamamlandı', en: 'Completed' } },
    'in-progress': { color: 'bg-blue-500/20 text-blue-400', icon: RefreshCw, label: { tr: 'Devam Ediyor', en: 'In Progress' } },
    pending: { color: 'bg-yellow-500/20 text-yellow-400', icon: Clock, label: { tr: 'Bekliyor', en: 'Pending' } },
  };

  const config = configs[status as keyof typeof configs] || configs.healthy;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label[language]}
    </span>
  );
};

// Service Card Component
const ServiceCard: React.FC<{
  service: typeof services.tr[0];
  language: 'tr' | 'en';
}> = ({ service, language }) => {
  const Icon = service.icon;
  const statusColors = {
    healthy: 'border-green-500/30 bg-green-500/10',
    warning: 'border-yellow-500/30 bg-yellow-500/10',
    error: 'border-red-500/30 bg-red-500/10',
  };

  return (
    <div className={`p-3 rounded-xl border ${statusColors[service.status as keyof typeof statusColors]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-400" />
          <span className="text-white text-xs font-medium">{service.name}</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${
          service.status === 'healthy' ? 'bg-green-400' :
          service.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
        }`} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-[10px]">Uptime</span>
        <span className="text-white text-xs font-medium">{service.uptime}</span>
      </div>
    </div>
  );
};

// Ticket Row Component
const TicketRow: React.FC<{
  ticket: typeof tickets.tr[0];
  language: 'tr' | 'en';
}> = ({ ticket, language }) => {
  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-gray-500',
  };

  return (
    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${priorityColors[ticket.priority as keyof typeof priorityColors]}`} />
          <span className="text-white text-xs font-medium">{ticket.title}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <StatusBadge status={ticket.status} language={language} />
        <span className="text-gray-500 text-[10px]">{ticket.date}</span>
      </div>
    </div>
  );
};

export const MaintenanceDemo: React.FC<MaintenanceDemoProps> = ({ language, onContactClick }) => {
  const [activeTab, setActiveTab] = useState<TabType>('status');
  const [chatMessage, setChatMessage] = useState('');
  const [chatSent, setChatSent] = useState(false);

  // Animated metrics
  const responseTime = useAnimatedValue(45, 1200);
  const resolvedTickets = useAnimatedValue(98, 1400);
  const systemHealth = useAnimatedValue(99, 1600);

  const healthyServices = services[language].filter(s => s.status === 'healthy').length;
  const totalServices = services[language].length;

  const tabs: { id: TabType; label: { tr: string; en: string }; icon: React.ElementType }[] = [
    { id: 'status', label: { tr: 'Durum', en: 'Status' }, icon: Activity },
    { id: 'tickets', label: { tr: 'Talepler', en: 'Tickets' }, icon: Wrench },
    { id: 'support', label: { tr: 'Destek', en: 'Support' }, icon: Headphones },
  ];

  const handleSendChat = () => {
    if (chatMessage.trim()) {
      setChatSent(true);
      setChatMessage('');
    }
  };

  // Header
  const Header = () => (
    <div className="pt-8 px-4 pb-3 border-b border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">
              {language === 'tr' ? 'Bakım Paneli' : 'Maintenance Panel'}
            </h1>
            <p className="text-gray-500 text-[10px]">
              {healthyServices}/{totalServices} {language === 'tr' ? 'sistem sağlıklı' : 'systems healthy'}
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
                  ? 'bg-gray-500/20 text-gray-300'
                  : 'text-gray-500 hover:bg-white/5'
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

  // Status Tab
  const StatusTab = () => (
    <div className="p-4">
      {/* Overview Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/30 text-center">
          <p className="text-white text-lg font-bold">{systemHealth}%</p>
          <p className="text-gray-500 text-[10px]">{language === 'tr' ? 'Sağlık' : 'Health'}</p>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
          <p className="text-white text-lg font-bold">{responseTime}ms</p>
          <p className="text-gray-500 text-[10px]">{language === 'tr' ? 'Yanıt' : 'Response'}</p>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
          <p className="text-white text-lg font-bold">{resolvedTickets}%</p>
          <p className="text-gray-500 text-[10px]">{language === 'tr' ? 'Çözüm' : 'Resolved'}</p>
        </div>
      </div>

      {/* System Status */}
      <h3 className="text-white text-xs font-semibold mb-3">
        {language === 'tr' ? 'Sistem Durumu' : 'System Status'}
      </h3>
      <div className="space-y-2">
        {services[language].map(service => (
          <ServiceCard key={service.id} service={service} language={language} />
        ))}
      </div>

      {/* Last Check */}
      <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400 text-xs">
            {language === 'tr' ? 'Son Kontrol' : 'Last Check'}
          </span>
        </div>
        <span className="text-white text-xs">2 {language === 'tr' ? 'dk önce' : 'min ago'}</span>
      </div>
    </div>
  );

  // Tickets Tab
  const TicketsTab = () => (
    <div className="p-4">
      {/* Ticket Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2 bg-green-500/20 rounded-lg text-center">
          <CheckCircle className="w-4 h-4 text-green-400 mx-auto mb-1" />
          <p className="text-white text-sm font-bold">12</p>
          <p className="text-gray-500 text-[10px]">{language === 'tr' ? 'Çözüldü' : 'Resolved'}</p>
        </div>
        <div className="p-2 bg-blue-500/20 rounded-lg text-center">
          <RefreshCw className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <p className="text-white text-sm font-bold">3</p>
          <p className="text-gray-500 text-[10px]">{language === 'tr' ? 'Aktif' : 'Active'}</p>
        </div>
        <div className="p-2 bg-yellow-500/20 rounded-lg text-center">
          <Clock className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
          <p className="text-white text-sm font-bold">2</p>
          <p className="text-gray-500 text-[10px]">{language === 'tr' ? 'Bekliyor' : 'Pending'}</p>
        </div>
      </div>

      {/* Ticket List */}
      <h3 className="text-white text-xs font-semibold mb-3">
        {language === 'tr' ? 'Son Talepler' : 'Recent Tickets'}
      </h3>
      <div className="space-y-2">
        {tickets[language].map(ticket => (
          <TicketRow key={ticket.id} ticket={ticket} language={language} />
        ))}
      </div>

      {/* New Ticket Button */}
      <button className="w-full mt-4 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
        <Wrench className="w-4 h-4" />
        {language === 'tr' ? 'Yeni Talep Oluştur' : 'Create New Ticket'}
      </button>
    </div>
  );

  // Support Tab
  const SupportTab = () => (
    <div className="p-4 flex flex-col h-[calc(100%-120px)]">
      {/* Support Info */}
      <div className="p-4 bg-gradient-to-br from-gray-500/20 to-gray-700/20 rounded-xl border border-gray-500/30 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-500/30 flex items-center justify-center">
            <Headphones className="w-5 h-5 text-gray-300" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">7/24 {language === 'tr' ? 'Destek' : 'Support'}</p>
            <p className="text-gray-400 text-xs">{language === 'tr' ? 'Ortalama yanıt: 15 dk' : 'Avg. response: 15 min'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 p-2 bg-white/5 rounded-lg text-center">
            <p className="text-white text-xs font-medium">Email</p>
            <p className="text-gray-500 text-[10px]">support@allync.com</p>
          </div>
          <div className="flex-1 p-2 bg-white/5 rounded-lg text-center">
            <p className="text-white text-xs font-medium">{language === 'tr' ? 'Telefon' : 'Phone'}</p>
            <p className="text-gray-500 text-[10px]">+90 555 000</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white/5 rounded-xl border border-white/10 p-3 mb-3 overflow-y-auto">
        {!chatSent ? (
          <div className="text-center py-6">
            <MessageSquare className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-500 text-xs">
              {language === 'tr' ? 'Mesajınızı yazın' : 'Type your message'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-end">
              <div className="bg-gray-500/30 rounded-lg rounded-br-sm px-3 py-2 max-w-[80%]">
                <p className="text-white text-xs">{language === 'tr' ? 'Merhaba, yardıma ihtiyacım var.' : 'Hello, I need help.'}</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-white/10 rounded-lg rounded-bl-sm px-3 py-2 max-w-[80%]">
                <p className="text-white text-xs">
                  {language === 'tr'
                    ? 'Merhaba! Size nasıl yardımcı olabilirim?'
                    : 'Hello! How can I help you?'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          placeholder={language === 'tr' ? 'Mesajınızı yazın...' : 'Type a message...'}
          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-gray-500/50"
        />
        <button
          onClick={handleSendChat}
          className="p-2 bg-gray-500 rounded-lg active:scale-95 transition-transform"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* CTA */}
      {onContactClick && (
        <button
          onClick={onContactClick}
          className="w-full mt-3 py-3 bg-white/10 text-white text-xs font-semibold rounded-lg active:scale-95 transition-transform"
        >
          {language === 'tr' ? 'Bakım Paketi İsteyin' : 'Request Maintenance Package'}
        </button>
      )}
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'status': return <StatusTab />;
      case 'tickets': return <TicketsTab />;
      case 'support': return <SupportTab />;
      default: return <StatusTab />;
    }
  };

  return (
    <div className="h-full bg-[#0a0a0f] overflow-auto">
      <Header />
      {renderTab()}
    </div>
  );
};
