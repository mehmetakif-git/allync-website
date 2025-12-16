import React, { useState } from 'react';
import {
  Palette,
  Type,
  Layout,
  Layers,
  Eye,
  Grid3X3,
  Smartphone,
  Monitor,
  MousePointer,
  Sparkles,
  Check,
  Settings
} from 'lucide-react';

interface UIUXDemoProps {
  language: 'tr' | 'en';
  onContactClick?: () => void;
}

type TabType = 'colors' | 'typography' | 'components';

// Color palettes
const colorPalettes = [
  {
    name: 'Primary',
    colors: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'],
  },
  {
    name: 'Success',
    colors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'],
  },
  {
    name: 'Warning',
    colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7'],
  },
  {
    name: 'Error',
    colors: ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'],
  },
];

// Typography scales
const typographyScales = {
  tr: [
    { name: 'Başlık 1', size: '24px', weight: 'Bold', sample: 'Merhaba Dünya' },
    { name: 'Başlık 2', size: '20px', weight: 'Semibold', sample: 'Alt Başlık' },
    { name: 'Başlık 3', size: '16px', weight: 'Medium', sample: 'Küçük Başlık' },
    { name: 'Gövde', size: '14px', weight: 'Regular', sample: 'Normal metin içeriği' },
    { name: 'Küçük', size: '12px', weight: 'Regular', sample: 'Açıklama metni' },
    { name: 'Etiket', size: '10px', weight: 'Medium', sample: 'ETİKET' },
  ],
  en: [
    { name: 'Heading 1', size: '24px', weight: 'Bold', sample: 'Hello World' },
    { name: 'Heading 2', size: '20px', weight: 'Semibold', sample: 'Subheading' },
    { name: 'Heading 3', size: '16px', weight: 'Medium', sample: 'Small Title' },
    { name: 'Body', size: '14px', weight: 'Regular', sample: 'Regular text content' },
    { name: 'Small', size: '12px', weight: 'Regular', sample: 'Caption text' },
    { name: 'Label', size: '10px', weight: 'Medium', sample: 'LABEL' },
  ],
};

// UI Components
const uiComponents = {
  tr: [
    { name: 'Buton', type: 'button' },
    { name: 'Giriş Alanı', type: 'input' },
    { name: 'Kart', type: 'card' },
    { name: 'Badge', type: 'badge' },
    { name: 'Toggle', type: 'toggle' },
    { name: 'Avatar', type: 'avatar' },
  ],
  en: [
    { name: 'Button', type: 'button' },
    { name: 'Input Field', type: 'input' },
    { name: 'Card', type: 'card' },
    { name: 'Badge', type: 'badge' },
    { name: 'Toggle', type: 'toggle' },
    { name: 'Avatar', type: 'avatar' },
  ],
};

// Color Swatch Component
const ColorSwatch: React.FC<{
  color: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ color, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-8 h-8 rounded-lg transition-all ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0f] scale-110' : ''}`}
    style={{ backgroundColor: color }}
  />
);

// Component Preview
const ComponentPreview: React.FC<{
  type: string;
  accentColor: string;
}> = ({ type, accentColor }) => {
  const [toggleOn, setToggleOn] = useState(true);

  switch (type) {
    case 'button':
      return (
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 rounded-lg text-white text-xs font-medium"
            style={{ backgroundColor: accentColor }}
          >
            Primary
          </button>
          <button className="px-3 py-1.5 rounded-lg text-white text-xs font-medium bg-white/10 border border-white/20">
            Secondary
          </button>
        </div>
      );
    case 'input':
      return (
        <input
          type="text"
          placeholder="Type here..."
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-xs placeholder:text-gray-500 focus:outline-none"
          style={{ borderColor: accentColor + '50' }}
        />
      );
    case 'card':
      return (
        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
          <div className="w-full h-8 rounded bg-white/10 mb-2" />
          <div className="w-3/4 h-2 rounded bg-white/20 mb-1" />
          <div className="w-1/2 h-2 rounded bg-white/10" />
        </div>
      );
    case 'badge':
      return (
        <div className="flex gap-2 flex-wrap">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-medium text-white"
            style={{ backgroundColor: accentColor }}
          >
            New
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/20 text-green-400">
            Active
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-500/20 text-yellow-400">
            Pending
          </span>
        </div>
      );
    case 'toggle':
      return (
        <button
          onClick={() => setToggleOn(!toggleOn)}
          className={`w-10 h-5 rounded-full transition-all relative`}
          style={{ backgroundColor: toggleOn ? accentColor : 'rgba(255,255,255,0.2)' }}
        >
          <div
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
              toggleOn ? 'left-5' : 'left-0.5'
            }`}
          />
        </button>
      );
    case 'avatar':
      return (
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 border-2 border-[#0a0a0f]" />
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-[#0a0a0f]" />
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 border-2 border-[#0a0a0f]" />
          <div
            className="w-8 h-8 rounded-full border-2 border-[#0a0a0f] flex items-center justify-center text-[10px] text-white font-medium"
            style={{ backgroundColor: accentColor }}
          >
            +5
          </div>
        </div>
      );
    default:
      return null;
  }
};

export const UIUXDemo: React.FC<UIUXDemoProps> = ({ language, onContactClick }) => {
  const [activeTab, setActiveTab] = useState<TabType>('colors');
  const [selectedColor, setSelectedColor] = useState('#c026d3');
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  const tabs: { id: TabType; label: { tr: string; en: string }; icon: React.ElementType }[] = [
    { id: 'colors', label: { tr: 'Renkler', en: 'Colors' }, icon: Palette },
    { id: 'typography', label: { tr: 'Tipografi', en: 'Typography' }, icon: Type },
    { id: 'components', label: { tr: 'Bileşenler', en: 'Components' }, icon: Layers },
  ];

  // Header
  const Header = () => (
    <div className="pt-8 px-4 pb-3 border-b border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">Design System</h1>
            <p className="text-gray-500 text-[10px]">
              {language === 'tr' ? 'Tasarım Sistemi' : 'UI Kit Preview'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-1.5 rounded ${viewMode === 'mobile' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'text-gray-500'}`}
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-1.5 rounded ${viewMode === 'desktop' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'text-gray-500'}`}
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>
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
                  ? 'bg-fuchsia-500/20 text-fuchsia-400'
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

  // Colors Tab
  const ColorsTab = () => (
    <div className="p-4">
      {/* Current Selection */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl"
            style={{ backgroundColor: selectedColor }}
          />
          <div>
            <p className="text-white text-xs font-medium">{language === 'tr' ? 'Seçili Renk' : 'Selected Color'}</p>
            <p className="text-gray-500 text-[10px] uppercase">{selectedColor}</p>
          </div>
        </div>
        <button className="p-2 bg-white/5 rounded-lg">
          <Eye className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Color Palettes */}
      <h3 className="text-white text-xs font-semibold mb-3">
        {language === 'tr' ? 'Renk Paletleri' : 'Color Palettes'}
      </h3>
      <div className="space-y-3">
        {colorPalettes.map((palette, i) => (
          <div
            key={palette.name}
            className={`p-3 rounded-xl border transition-all ${
              selectedPalette === i
                ? 'bg-white/10 border-fuchsia-500/50'
                : 'bg-white/5 border-white/10'
            }`}
            onClick={() => setSelectedPalette(i)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-xs font-medium">{palette.name}</span>
              {selectedPalette === i && (
                <Check className="w-3.5 h-3.5 text-fuchsia-400" />
              )}
            </div>
            <div className="flex gap-1.5">
              {palette.colors.map((color, j) => (
                <ColorSwatch
                  key={j}
                  color={color}
                  isSelected={selectedColor === color}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Colors */}
      <h3 className="text-white text-xs font-semibold mt-4 mb-3">
        {language === 'tr' ? 'Hızlı Seçim' : 'Quick Pick'}
      </h3>
      <div className="flex gap-2 flex-wrap">
        {['#c026d3', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'].map(color => (
          <ColorSwatch
            key={color}
            color={color}
            isSelected={selectedColor === color}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>
    </div>
  );

  // Typography Tab
  const TypographyTab = () => (
    <div className="p-4">
      {/* Font Preview */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-4">
        <p className="text-gray-500 text-[10px] mb-2">Inter / SF Pro</p>
        <p className="text-white text-2xl font-bold mb-1">Aa Bb Cc</p>
        <p className="text-gray-400 text-sm">0123456789</p>
      </div>

      {/* Type Scale */}
      <h3 className="text-white text-xs font-semibold mb-3">
        {language === 'tr' ? 'Tip Ölçeği' : 'Type Scale'}
      </h3>
      <div className="space-y-2">
        {typographyScales[language].map((item, i) => (
          <div
            key={i}
            className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between"
          >
            <div>
              <p
                className="text-white"
                style={{
                  fontSize: item.size,
                  fontWeight: item.weight === 'Bold' ? 700 : item.weight === 'Semibold' ? 600 : item.weight === 'Medium' ? 500 : 400,
                }}
              >
                {item.sample}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-[10px]">{item.name}</p>
              <p className="text-gray-600 text-[10px]">{item.size} • {item.weight}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Components Tab
  const ComponentsTab = () => (
    <div className="p-4">
      {/* Preview Mode */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-xs font-semibold">
          {language === 'tr' ? 'Bileşen Kütüphanesi' : 'Component Library'}
        </h3>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: selectedColor }}
          />
          <span className="text-gray-500 text-[10px]">Accent</span>
        </div>
      </div>

      {/* Component List */}
      <div className="space-y-3">
        {uiComponents[language].map((component, i) => (
          <div
            key={i}
            className="p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-white text-xs font-medium">{component.name}</span>
              <Grid3X3 className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <ComponentPreview type={component.type} accentColor={selectedColor} />
          </div>
        ))}
      </div>

      {/* CTA */}
      {onContactClick && (
        <button
          onClick={onContactClick}
          className="w-full mt-4 py-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <MousePointer className="w-4 h-4" />
          {language === 'tr' ? 'UI/UX Tasarım İsteyin' : 'Request UI/UX Design'}
        </button>
      )}
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'colors': return <ColorsTab />;
      case 'typography': return <TypographyTab />;
      case 'components': return <ComponentsTab />;
      default: return <ColorsTab />;
    }
  };

  return (
    <div className="h-full bg-[#0a0a0f] overflow-auto">
      <Header />
      {renderTab()}
    </div>
  );
};
