import React, { useState, useEffect } from 'react';
import {
  Cloud,
  Server,
  Database,
  HardDrive,
  Cpu,
  Activity,
  Upload,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Globe,
  Shield,
  Zap,
  TrendingUp,
  Settings
} from 'lucide-react';

interface CloudDemoProps {
  language: 'tr' | 'en';
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
    { id: 1, name: 'v2.4.1 - Hotfix', status: 'success', time: '2 dk önce', branch: 'main' },
    { id: 2, name: 'v2.4.0 - Feature', status: 'success', time: '1 saat önce', branch: 'main' },
    { id: 3, name: 'v2.3.9 - Bugfix', status: 'failed', time: '3 saat önce', branch: 'develop' },
    { id: 4, name: 'v2.3.8 - Update', status: 'success', time: '1 gün önce', branch: 'main' },
  ],
  en: [
    { id: 1, name: 'v2.4.1 - Hotfix', status: 'success', time: '2 min ago', branch: 'main' },
    { id: 2, name: 'v2.4.0 - Feature', status: 'success', time: '1 hour ago', branch: 'main' },
    { id: 3, name: 'v2.3.9 - Bugfix', status: 'failed', time: '3 hours ago', branch: 'develop' },
    { id: 4, name: 'v2.3.8 - Update', status: 'success', time: '1 day ago', branch: 'main' },
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

// Progress Bar Component
const ProgressBar: React.FC<{
  value: number;
  color: string;
  label: string;
}> = ({ value, color, label }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px]">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium">{value}%</span>
    </div>
    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

// Server Row Component
const ServerRow: React.FC<{
  server: typeof servers.tr[0];
  onToggle: () => void;
}> = ({ server, onToggle }) => {
  const isRunning = server.status === 'running';

  return (
    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400' : 'bg-gray-500'}`} />
          <span className="text-white text-xs font-medium">{server.name}</span>
        </div>
        <button
          onClick={onToggle}
          className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
            isRunning
              ? 'bg-green-500/20 text-green-400'
              : 'bg-gray-500/20 text-gray-400'
          }`}
        >
          {isRunning ? 'Running' : 'Stopped'}
        </button>
      </div>
      <div className="flex items-center justify-between text-[10px] text-gray-500 mb-2">
        <span>{server.type}</span>
        <span>{server.region}</span>
      </div>
      {isRunning && (
        <div className="space-y-1.5">
          <ProgressBar value={server.cpu} color="#6366f1" label="CPU" />
          <ProgressBar value={server.ram} color="#8b5cf6" label="RAM" />
        </div>
      )}
    </div>
  );
};

// Deployment Item Component
const DeploymentItem: React.FC<{
  deployment: typeof deployments.tr[0];
}> = ({ deployment }) => {
  const statusColors = {
    success: 'text-green-400 bg-green-500/20',
    failed: 'text-red-400 bg-red-500/20',
    pending: 'text-yellow-400 bg-yellow-500/20',
  };
  const StatusIcon = deployment.status === 'success' ? CheckCircle :
                     deployment.status === 'failed' ? AlertCircle : Clock;

  return (
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${statusColors[deployment.status as keyof typeof statusColors]?.split(' ')[1]}`}>
        <StatusIcon className={`w-4 h-4 ${statusColors[deployment.status as keyof typeof statusColors]?.split(' ')[0]}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-medium truncate">{deployment.name}</p>
        <div className="flex items-center gap-2 text-[10px] text-gray-500">
          <span>{deployment.branch}</span>
          <span>•</span>
          <span>{deployment.time}</span>
        </div>
      </div>
    </div>
  );
};

export const CloudDemo: React.FC<CloudDemoProps> = ({ language, onContactClick }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [serverStates, setServerStates] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    servers[language].forEach(s => { initial[s.id] = s.status; });
    return initial;
  });

  // Animated metrics
  const uptime = useAnimatedValue(99.9, 1200);
  const requests = useAnimatedValue(12847, 1400);
  const bandwidth = useAnimatedValue(847, 1600);
  const cost = useAnimatedValue(234, 1800);

  const runningServers = Object.values(serverStates).filter(s => s === 'running').length;
  const totalServers = servers[language].length;

  const tabs: { id: TabType; label: { tr: string; en: string }; icon: React.ElementType }[] = [
    { id: 'overview', label: { tr: 'Genel', en: 'Overview' }, icon: Activity },
    { id: 'servers', label: { tr: 'Sunucular', en: 'Servers' }, icon: Server },
    { id: 'deployments', label: { tr: 'Deploy', en: 'Deploys' }, icon: Upload },
  ];

  const toggleServer = (id: number) => {
    setServerStates(prev => ({
      ...prev,
      [id]: prev[id] === 'running' ? 'stopped' : 'running'
    }));
  };

  // Header
  const Header = () => (
    <div className="pt-8 px-4 pb-3 border-b border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
            <Cloud className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">Cloud Console</h1>
            <p className="text-gray-500 text-[10px]">
              {runningServers}/{totalServers} {language === 'tr' ? 'sunucu aktif' : 'servers active'}
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
                  ? 'bg-indigo-500/20 text-indigo-400'
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

  // Overview Tab
  const OverviewTab = () => (
    <div className="p-4">
      {/* Main Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-xl border border-indigo-500/30">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-gray-400 text-[10px]">Uptime</span>
          </div>
          <p className="text-white text-lg font-bold">{uptime}%</p>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-gray-400 text-[10px]">{language === 'tr' ? 'İstekler/dk' : 'Requests/min'}</span>
          </div>
          <p className="text-white text-lg font-bold">{requests.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-gray-400 text-[10px]">Bandwidth</span>
          </div>
          <p className="text-white text-lg font-bold">{bandwidth} GB</p>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-3.5 h-3.5 text-green-400" />
            <span className="text-gray-400 text-[10px]">{language === 'tr' ? 'Maliyet/ay' : 'Cost/month'}</span>
          </div>
          <p className="text-white text-lg font-bold">${cost}</p>
        </div>
      </div>

      {/* Resource Usage */}
      <h3 className="text-white text-xs font-semibold mb-3">
        {language === 'tr' ? 'Kaynak Kullanımı' : 'Resource Usage'}
      </h3>
      <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex-1">
            <ProgressBar value={58} color="#6366f1" label="CPU" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1">
            <ProgressBar value={72} color="#8b5cf6" label="Memory" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex-1">
            <ProgressBar value={45} color="#06b6d4" label="Storage" />
          </div>
        </div>
      </div>

      {/* Security Status */}
      <div className="mt-4 p-3 bg-green-500/10 rounded-xl border border-green-500/30 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <p className="text-white text-xs font-medium">
            {language === 'tr' ? 'Güvenlik Durumu' : 'Security Status'}
          </p>
          <p className="text-green-400 text-[10px]">
            {language === 'tr' ? 'Tüm sistemler güvenli' : 'All systems secure'}
          </p>
        </div>
      </div>
    </div>
  );

  // Servers Tab
  const ServersTab = () => (
    <div className="p-4">
      {/* Server Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2 bg-green-500/20 rounded-lg text-center">
          <p className="text-white text-sm font-bold">{runningServers}</p>
          <p className="text-gray-500 text-[10px]">{language === 'tr' ? 'Çalışan' : 'Running'}</p>
        </div>
        <div className="p-2 bg-gray-500/20 rounded-lg text-center">
          <p className="text-white text-sm font-bold">{totalServers - runningServers}</p>
          <p className="text-gray-500 text-[10px]">{language === 'tr' ? 'Durmuş' : 'Stopped'}</p>
        </div>
        <div className="p-2 bg-indigo-500/20 rounded-lg text-center">
          <p className="text-white text-sm font-bold">{totalServers}</p>
          <p className="text-gray-500 text-[10px]">{language === 'tr' ? 'Toplam' : 'Total'}</p>
        </div>
      </div>

      {/* Server List */}
      <h3 className="text-white text-xs font-semibold mb-3">
        {language === 'tr' ? 'Sunucu Listesi' : 'Server List'}
      </h3>
      <div className="space-y-2">
        {servers[language].map(server => (
          <ServerRow
            key={server.id}
            server={{ ...server, status: serverStates[server.id] }}
            onToggle={() => toggleServer(server.id)}
          />
        ))}
      </div>
    </div>
  );

  // Deployments Tab
  const DeploymentsTab = () => (
    <div className="p-4">
      {/* Deploy Stats */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 p-3 bg-green-500/20 rounded-lg text-center">
          <CheckCircle className="w-4 h-4 text-green-400 mx-auto mb-1" />
          <p className="text-white text-sm font-bold">23</p>
          <p className="text-gray-500 text-[10px]">{language === 'tr' ? 'Başarılı' : 'Success'}</p>
        </div>
        <div className="flex-1 p-3 bg-red-500/20 rounded-lg text-center">
          <AlertCircle className="w-4 h-4 text-red-400 mx-auto mb-1" />
          <p className="text-white text-sm font-bold">2</p>
          <p className="text-gray-500 text-[10px]">{language === 'tr' ? 'Başarısız' : 'Failed'}</p>
        </div>
        <div className="flex-1 p-3 bg-indigo-500/20 rounded-lg text-center">
          <Upload className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
          <p className="text-white text-sm font-bold">25</p>
          <p className="text-gray-500 text-[10px]">{language === 'tr' ? 'Bu Ay' : 'This Month'}</p>
        </div>
      </div>

      {/* Recent Deployments */}
      <h3 className="text-white text-xs font-semibold mb-3">
        {language === 'tr' ? 'Son Deploylar' : 'Recent Deployments'}
      </h3>
      <div className="space-y-2">
        {deployments[language].map(deployment => (
          <DeploymentItem key={deployment.id} deployment={deployment} />
        ))}
      </div>

      {/* Deploy Button */}
      <button className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
        <Upload className="w-4 h-4" />
        {language === 'tr' ? 'Yeni Deploy' : 'New Deploy'}
      </button>

      {/* CTA */}
      {onContactClick && (
        <button
          onClick={onContactClick}
          className="w-full mt-2 py-3 bg-white/10 text-white text-xs font-semibold rounded-lg active:scale-95 transition-transform"
        >
          {language === 'tr' ? 'Bulut Çözümü İsteyin' : 'Request Cloud Solution'}
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

  return (
    <div className="h-full bg-[#0a0a0f] overflow-auto">
      <Header />
      {renderTab()}
    </div>
  );
};
