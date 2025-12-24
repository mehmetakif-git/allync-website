import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  DollarSign,
  Smartphone,
  RotateCcw,
  Send,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import {
  appTypes,
  features,
  calculatePrice,
  calculateTime,
  getAppTypeById,
  AppType,
  Feature
} from '../../data/mobileAppDemoData';

interface MobileAppDemoProps {
  language: 'tr' | 'en';
  onContactClick?: () => void;
}

type DemoStage = 'app-type' | 'features' | 'preview';

export const MobileAppDemo: React.FC<MobileAppDemoProps> = ({ language, onContactClick }) => {
  const { playClickSound } = useSoundEffect();

  // State
  const [stage, setStage] = useState<DemoStage>('app-type');
  const [selectedAppType, setSelectedAppType] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [currentPreviewScreen, setCurrentPreviewScreen] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Get selected app type data
  const appTypeData = useMemo(() => {
    return selectedAppType ? getAppTypeById(selectedAppType) : null;
  }, [selectedAppType]);

  // Calculate price and time
  const priceEstimate = useMemo(() => calculatePrice(selectedFeatures), [selectedFeatures]);
  const timeEstimate = useMemo(() => calculateTime(selectedFeatures.length), [selectedFeatures.length]);

  // Get selected features data
  const selectedFeaturesData = useMemo(() => {
    return selectedFeatures.map(id => features.find(f => f.id === id)!).filter(Boolean);
  }, [selectedFeatures]);

  // Handlers
  const handleSelectAppType = (typeId: string) => {
    playClickSound();
    const appType = getAppTypeById(typeId);
    setSelectedAppType(typeId);
    setSelectedFeatures(appType?.defaultFeatures || []);
    setTimeout(() => setStage('features'), 300);
  };

  const handleToggleFeature = (featureId: string) => {
    playClickSound();
    setSelectedFeatures(prev => {
      if (prev.includes(featureId)) {
        return prev.filter(id => id !== featureId);
      }
      if (prev.length < 8) {
        return [...prev, featureId];
      }
      return prev;
    });
  };

  const handleContinueToPreview = () => {
    if (selectedFeatures.length >= 2) {
      playClickSound();
      setStage('preview');
    }
  };

  const handleBack = () => {
    playClickSound();
    if (stage === 'features') {
      setStage('app-type');
    } else if (stage === 'preview') {
      setStage('features');
    }
  };

  const handleReset = () => {
    playClickSound();
    setStage('app-type');
    setSelectedAppType(null);
    setSelectedFeatures([]);
    setCurrentPreviewScreen(0);
    setShowSuccess(false);
  };

  const handleRequestQuote = () => {
    playClickSound();
    setShowSuccess(true);
  };

  // Currency symbol based on language
  const currency = language === 'tr' ? '₺' : '$';
  const priceMultiplier = language === 'tr' ? 1 : 0.03;

  // Format price
  const formatPrice = (price: number) => {
    const converted = Math.round(price * priceMultiplier);
    return converted.toLocaleString();
  };

  // Stage 1: App Type Selection - NO motion wrapper to prevent scroll re-render
  const AppTypeSelectionStage = () => (
    <div className="h-full flex flex-col p-4 pt-10">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
          <Smartphone className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-lg font-bold text-white mb-1">
          {language === 'tr' ? 'Uygulama Tipini Seçin' : 'Choose App Type'}
        </h2>
        <p className="text-gray-400 text-xs">
          {language === 'tr'
            ? 'Hangi tür uygulama istiyorsunuz?'
            : 'What type of app do you want?'}
        </p>
      </div>

      {/* App Type Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {appTypes.map((appType) => (
          <button
            key={appType.id}
            onClick={() => handleSelectAppType(appType.id)}
            className={`relative p-3 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-2
              ${selectedAppType === appType.id
                ? 'border-purple-500 bg-purple-500/20'
                : 'border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-white/10 active:scale-95'
              }`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${appType.color} flex items-center justify-center`}>
              <appType.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-medium text-sm">
              {appType.name[language]}
            </span>
          </button>
        ))}
      </div>

      {/* Hint */}
      <p className="text-center text-gray-500 text-[10px] mt-3">
        {language === 'tr'
          ? 'Varsayılan özellikler otomatik eklenecek'
          : 'Default features will be added'}
      </p>
    </div>
  );

  // Stage 2: Feature Selection - NO motion wrapper
  const FeatureSelectionStage = () => (
    <div className="h-full flex flex-col">
      {/* Header - with padding for dynamic island */}
      <div className="pt-8 px-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div>
            <h2 className="text-base font-bold text-white">
              {language === 'tr' ? 'Özellikleri Seçin' : 'Select Features'}
            </h2>
            <p className="text-gray-400 text-xs">
              {selectedFeatures.length}/8 {language === 'tr' ? 'özellik' : 'features'}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${(selectedFeatures.length / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* Feature Grid - scrollable */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2">
          {features.map((feature) => {
            const isSelected = selectedFeatures.includes(feature.id);
            return (
              <button
                key={feature.id}
                onClick={() => handleToggleFeature(feature.id)}
                disabled={!isSelected && selectedFeatures.length >= 8}
                className={`relative p-2.5 rounded-xl border transition-all text-left active:scale-95
                  ${isSelected
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                  }
                  ${!isSelected && selectedFeatures.length >= 8 ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex items-start gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isSelected ? 'bg-purple-500' : 'bg-white/10'}`}
                  >
                    <feature.icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-[11px] font-medium truncate">
                      {feature.name[language]}
                    </h4>
                    <p className="text-gray-500 text-[9px] truncate">
                      +{currency}{formatPrice(feature.price)}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-purple-500 rounded-full flex items-center justify-center">
                    <Check className="w-2 h-2 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="p-3 border-t border-white/10 bg-[#0a0a0f]/95">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-gray-400 text-[10px]">{language === 'tr' ? 'Tahmini' : 'Estimate'}</p>
            <p className="text-white font-bold text-sm">
              {currency}{formatPrice(priceEstimate.min)} - {currency}{formatPrice(priceEstimate.max)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-[10px]">{language === 'tr' ? 'Süre' : 'Time'}</p>
            <p className="text-white font-bold text-sm">{timeEstimate[language]}</p>
          </div>
        </div>
        <button
          onClick={handleContinueToPreview}
          disabled={selectedFeatures.length < 2}
          className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95
            ${selectedFeatures.length >= 2
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:opacity-90'
              : 'bg-white/10 text-gray-500 cursor-not-allowed'
            }`}
        >
          {language === 'tr' ? 'Önizleme' : 'Preview'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Stage 3: Preview - NO motion wrapper
  const PreviewStage = () => (
    <div className="h-full flex flex-col">
      {/* Header - with padding for dynamic island */}
      <div className="pt-8 px-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div>
            <h2 className="text-base font-bold text-white">
              {language === 'tr' ? 'Önizleme' : 'Preview'}
            </h2>
            <p className="text-gray-400 text-xs">
              {appTypeData?.name[language]}
            </p>
          </div>
        </div>
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Mini iPhone Preview */}
        <div className="relative mx-auto mb-4" style={{ width: '160px' }}>
          {/* iPhone Frame */}
          <div className="relative bg-[#1a1a2e] rounded-[24px] p-1.5 border-2 border-gray-700">
            {/* Notch */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-3 bg-black rounded-full z-10" />

            {/* Screen */}
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-[18px] overflow-hidden" style={{ height: '280px' }}>
              {/* App Screen Content - Simple fade, no complex animations */}
              {selectedFeaturesData[currentPreviewScreen] && (
                <FeatureScreen
                  feature={selectedFeaturesData[currentPreviewScreen]}
                  appType={appTypeData!}
                  language={language}
                />
              )}

              {/* Screen Navigation Dots */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {selectedFeaturesData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      playClickSound();
                      setCurrentPreviewScreen(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentPreviewScreen ? 'bg-purple-500 w-3' : 'bg-white/30 w-1.5'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Home Indicator */}
            <div className="w-16 h-1 bg-gray-600 rounded-full mx-auto mt-1.5" />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => {
              playClickSound();
              setCurrentPreviewScreen(prev => Math.max(0, prev - 1));
            }}
            disabled={currentPreviewScreen === 0}
            className="absolute left-[-32px] top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
          >
            <ChevronLeft className="w-3 h-3 text-white" />
          </button>
          <button
            onClick={() => {
              playClickSound();
              setCurrentPreviewScreen(prev => Math.min(selectedFeaturesData.length - 1, prev + 1));
            }}
            disabled={currentPreviewScreen === selectedFeaturesData.length - 1}
            className="absolute right-[-32px] top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
          >
            <ChevronRight className="w-3 h-3 text-white" />
          </button>
        </div>

        {/* Summary */}
        <div className="bg-white/5 rounded-xl p-3 border border-white/10 mb-3">
          <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-purple-400" />
            {language === 'tr' ? 'Seçilen Özellikler' : 'Selected Features'}
          </h3>
          <div className="grid grid-cols-2 gap-1.5">
            {selectedFeaturesData.map((feature) => (
              <div key={feature.id} className="flex items-center gap-1.5 text-gray-300 text-xs">
                <feature.icon className="w-3 h-3 text-purple-400" />
                <span className="truncate">{feature.name[language]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-3 border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300 text-xs">{language === 'tr' ? 'Fiyat' : 'Price'}</span>
            </div>
            <span className="text-base font-bold text-white">
              {currency}{formatPrice(priceEstimate.min)} - {currency}{formatPrice(priceEstimate.max)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300 text-xs">{language === 'tr' ? 'Süre' : 'Time'}</span>
            </div>
            <span className="text-sm font-bold text-white">{timeEstimate[language]}</span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-white/10 bg-[#0a0a0f]/95 space-y-2">
        <button
          onClick={handleRequestQuote}
          className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 active:scale-95"
        >
          <Send className="w-4 h-4" />
          {language === 'tr' ? 'Teklif Al' : 'Get Quote'}
        </button>
        <button
          onClick={handleReset}
          className="w-full py-2.5 bg-white/5 text-gray-300 font-medium text-sm rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          {language === 'tr' ? 'Baştan Başla' : 'Start Over'}
        </button>
      </div>
    </div>
  );

  // Success Stage - can keep animation since it's not scrollable
  const SuccessStage = () => (
    <div className="h-full flex flex-col items-center justify-center p-6 pt-12 text-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-5">
        <Sparkles className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">
        {language === 'tr' ? 'Talebiniz Alındı!' : 'Request Received!'}
      </h2>
      <p className="text-gray-400 text-sm mb-5">
        {language === 'tr'
          ? 'En kısa sürede iletişime geçeceğiz.'
          : "We'll contact you soon."}
      </p>

      <div className="bg-white/5 rounded-xl p-3 w-full max-w-xs mb-5">
        <div className="flex items-center justify-between mb-1.5 text-sm">
          <span className="text-gray-400">{language === 'tr' ? 'Uygulama' : 'App'}</span>
          <span className="text-white font-medium">{appTypeData?.name[language]}</span>
        </div>
        <div className="flex items-center justify-between mb-1.5 text-sm">
          <span className="text-gray-400">{language === 'tr' ? 'Özellik' : 'Features'}</span>
          <span className="text-white font-medium">{selectedFeatures.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">{language === 'tr' ? 'Tahmini' : 'Estimate'}</span>
          <span className="text-purple-400 font-bold">
            {currency}{formatPrice(priceEstimate.min)} - {currency}{formatPrice(priceEstimate.max)}
          </span>
        </div>
      </div>

      <div className="space-y-2 w-full max-w-xs">
        <button
          onClick={handleReset}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity active:scale-95"
        >
          {language === 'tr' ? 'Yeni Uygulama' : 'New App'}
        </button>
        {onContactClick && (
          <button
            onClick={() => {
              playClickSound();
              onContactClick();
            }}
            className="w-full py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors active:scale-95"
          >
            {language === 'tr' ? 'Bize Ulaşın' : 'Contact Us'}
          </button>
        )}
      </div>
    </div>
  );

  // Render current stage - simple conditional, no AnimatePresence to avoid re-render
  const renderStage = () => {
    if (showSuccess) return <SuccessStage />;
    switch (stage) {
      case 'app-type': return <AppTypeSelectionStage />;
      case 'features': return <FeatureSelectionStage />;
      case 'preview': return <PreviewStage />;
      default: return <AppTypeSelectionStage />;
    }
  };

  return (
    <div className="h-full bg-[#0a0a0f] overflow-hidden">
      {renderStage()}
    </div>
  );
};

// Feature Screen Component for Preview
interface FeatureScreenProps {
  feature: Feature;
  appType: AppType;
  language: 'tr' | 'en';
}

const FeatureScreen: React.FC<FeatureScreenProps> = ({ feature, appType, language }) => {
  const IconComponent = feature.icon;

  const renderContent = () => {
    switch (feature.id) {
      case 'user-auth':
        return (
          <div className="p-3 pt-6">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3">
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white text-center font-bold text-sm mb-3">
              {language === 'tr' ? 'Giriş Yap' : 'Sign In'}
            </h3>
            <div className="space-y-2">
              <div className="h-8 bg-white/10 rounded-lg px-2 flex items-center">
                <span className="text-gray-500 text-xs">Email</span>
              </div>
              <div className="h-8 bg-white/10 rounded-lg px-2 flex items-center">
                <span className="text-gray-500 text-xs">{language === 'tr' ? 'Şifre' : 'Password'}</span>
              </div>
              <div className="h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-medium text-xs">{language === 'tr' ? 'Giriş' : 'Login'}</span>
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="p-3 pt-6">
            <h3 className="text-white font-bold text-sm mb-3">{language === 'tr' ? 'Ödeme' : 'Payment'}</h3>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-3 mb-3">
              <div className="flex justify-between items-start mb-4">
                <div className="w-8 h-6 bg-yellow-300 rounded" />
                <IconComponent className="w-4 h-4 text-white/50" />
              </div>
              <div className="text-white/70 text-[10px] mb-0.5">Card</div>
              <div className="text-white font-mono text-xs">•••• •••• •••• 4242</div>
            </div>
            <div className="h-8 bg-white text-gray-900 rounded-lg flex items-center justify-center">
              <span className="font-medium text-xs">{language === 'tr' ? 'Öde' : 'Pay'}</span>
            </div>
          </div>
        );

      case 'chat':
        return (
          <div className="flex flex-col h-full pt-5">
            <h3 className="text-white font-bold text-sm px-3 mb-3">{language === 'tr' ? 'Mesajlar' : 'Chat'}</h3>
            <div className="flex-1 px-3 space-y-2">
              <div className="flex justify-end">
                <div className="bg-purple-500 rounded-xl rounded-br-sm px-2 py-1.5">
                  <span className="text-white text-[10px]">Merhaba!</span>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-xl rounded-bl-sm px-2 py-1.5">
                  <span className="text-white text-[10px]">Hey! Nasılsın?</span>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-purple-500 rounded-xl rounded-br-sm px-2 py-1.5">
                  <span className="text-white text-[10px]">Harika!</span>
                </div>
              </div>
            </div>
            <div className="p-3">
              <div className="h-7 bg-white/10 rounded-full px-3 flex items-center">
                <span className="text-gray-500 text-[10px]">{language === 'tr' ? 'Mesaj...' : 'Message...'}</span>
              </div>
            </div>
          </div>
        );

      case 'push':
        return (
          <div className="p-3 pt-6">
            <h3 className="text-white font-bold text-sm mb-3">{language === 'tr' ? 'Bildirimler' : 'Notifications'}</h3>
            <div className="space-y-1.5">
              {[
                { time: '2m', text: language === 'tr' ? 'Yeni mesaj!' : 'New message!' },
                { time: '1h', text: language === 'tr' ? 'Sipariş yolda' : 'Order on the way' },
                { time: '3h', text: language === 'tr' ? '%20 indirim!' : '20% off!' }
              ].map((notif, i) => (
                <div key={i} className="bg-white/10 rounded-lg p-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-[10px]">{notif.text}</p>
                    <p className="text-gray-500 text-[8px]">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'map':
        return (
          <div className="h-full relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-blue-900/20">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                `,
                backgroundSize: '15px 15px'
              }} />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <IconComponent className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="absolute bottom-3 left-3 right-3 bg-[#1a1a2e] rounded-lg p-2">
              <p className="text-white text-[10px] font-medium">{language === 'tr' ? 'Konum' : 'Location'}</p>
              <p className="text-gray-400 text-[8px]">Istanbul, Turkey</p>
            </div>
          </div>
        );

      case 'camera':
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 bg-gray-900 relative">
              <div className="absolute inset-3 border border-white/20 rounded-lg" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-10 h-10 border border-white/50 rounded-full" />
              </div>
            </div>
            <div className="h-16 bg-black flex items-center justify-center gap-6">
              <div className="w-8 h-8 rounded-full bg-white/10" />
              <div className="w-12 h-12 rounded-full bg-white border-2 border-white/50 flex items-center justify-center">
                <IconComponent className="w-5 h-5 text-gray-800" />
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10" />
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="p-3 pt-6">
            <h3 className="text-white font-bold text-sm mb-3">{language === 'tr' ? 'İstatistik' : 'Analytics'}</h3>
            <div className="bg-white/5 rounded-lg p-2 mb-3">
              <div className="flex items-end justify-between h-16 gap-1">
                {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-white/5 rounded-lg p-2 text-center">
                <p className="text-purple-400 text-sm font-bold">2.4K</p>
                <p className="text-gray-500 text-[8px]">{language === 'tr' ? 'Kullanıcı' : 'Users'}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-2 text-center">
                <p className="text-pink-400 text-sm font-bold">+18%</p>
                <p className="text-gray-500 text-[8px]">{language === 'tr' ? 'Büyüme' : 'Growth'}</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="h-full flex flex-col items-center justify-center p-3">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${appType.color} flex items-center justify-center mb-3`}>
              <IconComponent className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-white font-bold text-sm text-center mb-1">
              {feature.name[language]}
            </h3>
            <p className="text-gray-400 text-center text-[10px]">
              {feature.description[language]}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-[#0f0f1a]">
      {/* Status bar */}
      <div className="h-5 flex items-center justify-between px-3 pt-0.5">
        <span className="text-white text-[8px]">9:41</span>
        <div className="flex items-center gap-0.5">
          <div className="w-3 h-1.5 bg-white rounded-sm" />
        </div>
      </div>
      {renderContent()}
    </div>
  );
};
