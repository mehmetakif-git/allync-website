import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  MousePointer,
  Eye,
  DollarSign,
  BarChart3,
  PieChart,
  Target,
  Share2,
  Search,
  Mail,
  Instagram,
  Facebook,
  ChevronRight,
  ArrowUpRight,
  Zap,
  Globe
} from 'lucide-react';
import { useSoundEffect } from '../../contexts/SoundEffectContext';

interface DigitalMarketingDemoProps {
  language: 'tr' | 'en';
  onContactClick?: () => void;
}

type DemoTab = 'overview' | 'campaigns' | 'analytics';

// Animated counter hook
const useAnimatedCounter = (end: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
};

// Metric Card Component
const MetricCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  change: number;
  color: string;
}> = ({ icon: Icon, label, value, change, color }) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className={`flex items-center gap-0.5 text-[10px] ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? '+' : ''}{change}%
        </div>
      </div>
      <p className="text-white font-bold text-lg">{value}</p>
      <p className="text-gray-500 text-[10px]">{label}</p>
    </div>
  );
};

// Mini Bar Chart Component
const MiniBarChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const max = Math.max(...data);

  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((value, i) => (
        <div
          key={i}
          className={`flex-1 ${color} rounded-t transition-all duration-500`}
          style={{
            height: `${(value / max) * 100}%`,
            opacity: 0.5 + (value / max) * 0.5
          }}
        />
      ))}
    </div>
  );
};

// Donut Chart Component
const DonutChart: React.FC<{ segments: { value: number; color: string; label: string }[] }> = ({ segments }) => {
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  let currentAngle = 0;

  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg viewBox="0 0 100 100" className="transform -rotate-90">
        {segments.map((segment, i) => {
          const angle = (segment.value / total) * 360;
          const startAngle = currentAngle;
          currentAngle += angle;

          const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
          const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);
          const largeArc = angle > 180 ? 1 : 0;

          return (
            <path
              key={i}
              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={segment.color}
              className="transition-all duration-500"
            />
          );
        })}
        <circle cx="50" cy="50" r="25" fill="#0a0a0f" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-sm">{total.toLocaleString()}</span>
      </div>
    </div>
  );
};

// Campaign Row Component
const CampaignRow: React.FC<{
  name: string;
  platform: 'google' | 'facebook' | 'instagram' | 'email';
  status: 'active' | 'paused';
  spend: number;
  conversions: number;
  language: 'tr' | 'en';
}> = ({ name, platform, status, spend, conversions, language }) => {
  const platformIcons = {
    google: Search,
    facebook: Facebook,
    instagram: Instagram,
    email: Mail
  };
  const platformColors = {
    google: 'from-blue-500 to-green-500',
    facebook: 'from-blue-600 to-blue-400',
    instagram: 'from-pink-500 to-purple-500',
    email: 'from-orange-500 to-red-500'
  };

  const Icon = platformIcons[platform];

  return (
    <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${platformColors[platform]} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-medium truncate">{name}</p>
        <p className={`text-[10px] ${status === 'active' ? 'text-green-400' : 'text-gray-500'}`}>
          {status === 'active' ? (language === 'tr' ? 'Aktif' : 'Active') : (language === 'tr' ? 'Duraklatıldı' : 'Paused')}
        </p>
      </div>
      <div className="text-right">
        <p className="text-white text-xs font-bold">${spend}</p>
        <p className="text-gray-500 text-[10px]">{conversions} conv.</p>
      </div>
    </div>
  );
};

export const DigitalMarketingDemo: React.FC<DigitalMarketingDemoProps> = ({ language, onContactClick }) => {
  const { playClickSound } = useSoundEffect();
  const [activeTab, setActiveTab] = useState<DemoTab>('overview');
  const [animationKey, setAnimationKey] = useState(0);

  // Trigger animation on tab change
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [activeTab]);

  // Animated values
  const visitors = useAnimatedCounter(24853, 1200);
  const conversions = useAnimatedCounter(1247, 1200);
  const revenue = useAnimatedCounter(45200, 1200);

  const tabs: { id: DemoTab; label: { tr: string; en: string }; icon: React.ElementType }[] = [
    { id: 'overview', label: { tr: 'Genel', en: 'Overview' }, icon: BarChart3 },
    { id: 'campaigns', label: { tr: 'Kampanyalar', en: 'Campaigns' }, icon: Target },
    { id: 'analytics', label: { tr: 'Analitik', en: 'Analytics' }, icon: PieChart }
  ];

  const campaigns = [
    { name: language === 'tr' ? 'Yaz İndirimi' : 'Summer Sale', platform: 'google' as const, status: 'active' as const, spend: 1250, conversions: 89 },
    { name: language === 'tr' ? 'Marka Bilinirliği' : 'Brand Awareness', platform: 'facebook' as const, status: 'active' as const, spend: 800, conversions: 156 },
    { name: language === 'tr' ? 'Ürün Lansmanı' : 'Product Launch', platform: 'instagram' as const, status: 'active' as const, spend: 650, conversions: 72 },
    { name: language === 'tr' ? 'Bülten Kampanyası' : 'Newsletter Campaign', platform: 'email' as const, status: 'paused' as const, spend: 120, conversions: 245 }
  ];

  const trafficSources = [
    { value: 45, color: '#3B82F6', label: 'Organic' },
    { value: 30, color: '#F97316', label: 'Paid' },
    { value: 15, color: '#8B5CF6', label: 'Social' },
    { value: 10, color: '#10B981', label: 'Direct' }
  ];

  // Overview Tab
  const OverviewTab = () => (
    <div className="space-y-4" key={animationKey}>
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        <MetricCard
          icon={Eye}
          label={language === 'tr' ? 'Ziyaretçi' : 'Visitors'}
          value={visitors.toLocaleString()}
          change={12.5}
          color="from-blue-500 to-cyan-500"
        />
        <MetricCard
          icon={MousePointer}
          label={language === 'tr' ? 'Dönüşüm' : 'Conversions'}
          value={conversions.toLocaleString()}
          change={8.3}
          color="from-green-500 to-emerald-500"
        />
        <MetricCard
          icon={DollarSign}
          label={language === 'tr' ? 'Gelir' : 'Revenue'}
          value={`$${Math.floor(revenue / 1000)}K`}
          change={15.2}
          color="from-orange-500 to-red-500"
        />
        <MetricCard
          icon={Users}
          label={language === 'tr' ? 'Yeni Müşteri' : 'New Customers'}
          value="847"
          change={-2.1}
          color="from-purple-500 to-pink-500"
        />
      </div>

      {/* Weekly Performance Chart */}
      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white text-sm font-semibold">
            {language === 'tr' ? 'Haftalık Performans' : 'Weekly Performance'}
          </h3>
          <span className="text-green-400 text-xs flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18%
          </span>
        </div>
        <MiniBarChart
          data={[65, 78, 52, 91, 83, 97, 89]}
          color="bg-gradient-to-t from-orange-500 to-red-400"
        />
        <div className="flex justify-between mt-2 text-[9px] text-gray-500">
          <span>{language === 'tr' ? 'Pzt' : 'Mon'}</span>
          <span>{language === 'tr' ? 'Sal' : 'Tue'}</span>
          <span>{language === 'tr' ? 'Çar' : 'Wed'}</span>
          <span>{language === 'tr' ? 'Per' : 'Thu'}</span>
          <span>{language === 'tr' ? 'Cum' : 'Fri'}</span>
          <span>{language === 'tr' ? 'Cmt' : 'Sat'}</span>
          <span>{language === 'tr' ? 'Paz' : 'Sun'}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-3 border border-orange-500/30">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-orange-400" />
          <span className="text-white text-sm font-semibold">
            {language === 'tr' ? 'Bugünün Özeti' : "Today's Highlights"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-orange-400 text-lg font-bold">2.4K</p>
            <p className="text-gray-400 text-[9px]">{language === 'tr' ? 'Tıklama' : 'Clicks'}</p>
          </div>
          <div>
            <p className="text-orange-400 text-lg font-bold">3.2%</p>
            <p className="text-gray-400 text-[9px]">CTR</p>
          </div>
          <div>
            <p className="text-orange-400 text-lg font-bold">$1.2K</p>
            <p className="text-gray-400 text-[9px]">{language === 'tr' ? 'Harcama' : 'Spend'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Campaigns Tab
  const CampaignsTab = () => (
    <div className="space-y-3" key={animationKey}>
      {/* Active Campaigns Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-white text-sm font-semibold">
          {language === 'tr' ? 'Aktif Kampanyalar' : 'Active Campaigns'}
        </h3>
        <span className="text-orange-400 text-xs">4 {language === 'tr' ? 'kampanya' : 'campaigns'}</span>
      </div>

      {/* Campaign List */}
      <div className="space-y-2">
        {campaigns.map((campaign, i) => (
          <CampaignRow key={i} {...campaign} language={language} />
        ))}
      </div>

      {/* Total Spend Card */}
      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs">{language === 'tr' ? 'Toplam Harcama' : 'Total Spend'}</p>
            <p className="text-white text-xl font-bold">$2,820</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs">{language === 'tr' ? 'Toplam Dönüşüm' : 'Total Conversions'}</p>
            <p className="text-green-400 text-xl font-bold">562</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: '72%' }} />
        </div>
        <p className="text-gray-500 text-[10px] mt-1">72% {language === 'tr' ? 'bütçe kullanıldı' : 'budget used'}</p>
      </div>

      {/* Quick Action */}
      <button
        onClick={() => {
          playClickSound();
          onContactClick?.();
        }}
        className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 active:scale-95"
      >
        <Target className="w-4 h-4" />
        {language === 'tr' ? 'Yeni Kampanya' : 'New Campaign'}
      </button>
    </div>
  );

  // Analytics Tab
  const AnalyticsTab = () => (
    <div className="space-y-4" key={animationKey}>
      {/* Traffic Sources */}
      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
        <h3 className="text-white text-sm font-semibold mb-3">
          {language === 'tr' ? 'Trafik Kaynakları' : 'Traffic Sources'}
        </h3>
        <div className="flex items-center gap-4">
          <DonutChart segments={trafficSources} />
          <div className="flex-1 space-y-1.5">
            {trafficSources.map((source, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                <span className="text-gray-400 text-[10px] flex-1">{source.label}</span>
                <span className="text-white text-[10px] font-medium">{source.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
        <h3 className="text-white text-sm font-semibold mb-3">
          {language === 'tr' ? 'En Çok Ziyaret Edilen' : 'Top Pages'}
        </h3>
        <div className="space-y-2">
          {[
            { page: '/products', views: '4.2K', change: 12 },
            { page: '/pricing', views: '2.8K', change: 8 },
            { page: '/about', views: '1.5K', change: -3 },
            { page: '/contact', views: '892', change: 15 }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <Globe className="w-3 h-3 text-gray-500" />
              <span className="text-white text-xs flex-1 truncate">{item.page}</span>
              <span className="text-gray-400 text-[10px]">{item.views}</span>
              <span className={`text-[10px] ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {item.change >= 0 ? '+' : ''}{item.change}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Score */}
      <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-3 border border-green-500/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-green-400" />
            <span className="text-white text-sm font-semibold">SEO Score</span>
          </div>
          <span className="text-green-400 text-lg font-bold">87/100</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000" style={{ width: '87%' }} />
        </div>
        <div className="flex justify-between mt-2 text-[9px]">
          <span className="text-gray-500">{language === 'tr' ? 'Düşük' : 'Low'}</span>
          <span className="text-green-400">{language === 'tr' ? 'İyi' : 'Good'}</span>
          <span className="text-gray-500">{language === 'tr' ? 'Mükemmel' : 'Excellent'}</span>
        </div>
      </div>

      {/* Social Media Stats */}
      <div className="bg-white/5 rounded-xl p-3 border border-white/10">
        <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-orange-400" />
          {language === 'tr' ? 'Sosyal Medya' : 'Social Media'}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <Instagram className="w-4 h-4 text-pink-400 mx-auto mb-1" />
            <p className="text-white text-xs font-bold">12.4K</p>
            <p className="text-gray-500 text-[8px]">{language === 'tr' ? 'Takipçi' : 'Followers'}</p>
          </div>
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <Facebook className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <p className="text-white text-xs font-bold">8.7K</p>
            <p className="text-gray-500 text-[8px]">{language === 'tr' ? 'Takipçi' : 'Followers'}</p>
          </div>
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <Globe className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <p className="text-white text-xs font-bold">5.2K</p>
            <p className="text-gray-500 text-[8px]">{language === 'tr' ? 'Trafik' : 'Traffic'}</p>
          </div>
        </div>
      </div>
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

  return (
    <div className="h-full bg-[#0a0a0f] flex flex-col">
      {/* Header - with padding for dynamic island */}
      <div className="pt-8 px-4 pb-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-white font-bold text-base">Marketing Hub</h1>
            <p className="text-gray-500 text-[10px]">{language === 'tr' ? 'Son 30 gün' : 'Last 30 days'}</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 text-[10px]">{language === 'tr' ? 'Canlı' : 'Live'}</span>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playClickSound();
                setActiveTab(tab.id);
              }}
              className={`flex-1 py-1.5 px-2 rounded-md text-[10px] font-medium transition-all flex items-center justify-center gap-1
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              <tab.icon className="w-3 h-3" />
              {tab.label[language]}
            </button>
          ))}
        </div>
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderTab()}
      </div>

      {/* Bottom CTA */}
      <div className="p-3 border-t border-white/10 bg-[#0a0a0f]/95">
        <button
          onClick={() => {
            playClickSound();
            onContactClick?.();
          }}
          className="w-full py-2.5 bg-white/5 text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 active:scale-95"
        >
          {language === 'tr' ? 'Strateji Görüşmesi Al' : 'Get Strategy Call'}
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
