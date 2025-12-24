import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Check, Sparkles, Zap, Link, Clock, ChevronRight } from 'lucide-react';
import { customAIDemoScenarios, customAIUIText, CustomAIDemoScenario } from '../../data/customAIDemoScenarios';

// Demo Logo
import demoLogo from '../../assets/whatsapp-demo-logo.png';

interface CustomAIDemoProps {
  language: 'tr' | 'en';
  onContactClick?: () => void;
}

type DemoPhase = 'industry' | 'features' | 'building' | 'complete';

// Build steps
const buildSteps = [
  { key: 'analyzing', duration: 1200 },
  { key: 'configuring', duration: 1800 },
  { key: 'integrating', duration: 1500 },
  { key: 'testing', duration: 1200 }
];

export const CustomAIDemo: React.FC<CustomAIDemoProps> = ({ language, onContactClick }) => {
  const [selectedScenario, setSelectedScenario] = useState<CustomAIDemoScenario | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [phase, setPhase] = useState<DemoPhase>('industry');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visibleCapabilities, setVisibleCapabilities] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { playBackSound } = useSoundEffect();

  const t = customAIUIText[language];

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Build progress
  const startBuildProcess = useCallback(() => {
    let stepIndex = 0;
    const totalDuration = buildSteps.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;
    setProgress(0);

    const updateProgress = () => {
      if (stepIndex >= buildSteps.length) {
        setProgress(100);
        timeoutRef.current = setTimeout(() => {
          setPhase('complete');
          animateCapabilities();
        }, 400);
        return;
      }

      setCurrentStep(stepIndex);
      const stepProgress = (elapsed / totalDuration) * 100;
      setProgress(Math.min(stepProgress, 99));

      elapsed += 100;

      if (elapsed >= buildSteps.slice(0, stepIndex + 1).reduce((acc, s) => acc + s.duration, 0)) {
        stepIndex++;
      }

      timeoutRef.current = setTimeout(updateProgress, 100);
    };

    updateProgress();
  }, []);

  const animateCapabilities = useCallback(() => {
    let index = 0;
    const showNext = () => {
      if (index >= (selectedScenario?.result.capabilities.length || 3)) {
        return;
      }
      index++;
      setVisibleCapabilities(index);
      timeoutRef.current = setTimeout(showNext, 300);
    };
    timeoutRef.current = setTimeout(showNext, 300);
  }, [selectedScenario]);

  const handleIndustrySelect = (scenario: CustomAIDemoScenario) => {
    setSelectedScenario(scenario);
    setSelectedFeatures([]);
    setPhase('features');
  };

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(f => f !== featureId)
        : [...prev, featureId]
    );
  };

  const handleContinue = () => {
    if (selectedFeatures.length > 0) {
      setPhase('building');
      startBuildProcess();
    }
  };

  const handleBack = () => {
    playBackSound();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (phase === 'features') {
      setPhase('industry');
      setSelectedScenario(null);
    } else {
      setSelectedScenario(null);
      setSelectedFeatures([]);
      setPhase('industry');
      setCurrentStep(0);
      setProgress(0);
      setVisibleCapabilities(0);
    }
  };

  const handleRestart = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSelectedScenario(null);
    setSelectedFeatures([]);
    setPhase('industry');
    setCurrentStep(0);
    setProgress(0);
    setVisibleCapabilities(0);
  };

  // Industry Selection Screen
  if (phase === 'industry') {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-[#1a0a1a] to-[#2a1a2a]">
        {/* Header */}
        <div className="px-4 py-3 pt-12 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl p-[2px] bg-gradient-to-br from-fuchsia-500 to-pink-500">
            <div className="w-full h-full rounded-[10px] overflow-hidden">
              <img src={demoLogo} alt="Allync AI" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-white text-[15px] font-semibold">{t.headerTitle}</h3>
            <p className="text-gray-400 text-[12px]">{t.selectIndustry}</p>
          </div>
        </div>

        {/* Industry List */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid gap-3">
            {customAIDemoScenarios.map((scenario) => (
              <motion.button
                key={scenario.id}
                onClick={() => handleIndustrySelect(scenario)}
                className="w-full p-4 bg-white/5 backdrop-blur-sm rounded-xl flex items-center gap-4 hover:bg-white/10 transition-colors text-left border border-white/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl">{scenario.icon}</span>
                <div className="flex-1">
                  <h4 className="text-white text-[14px] font-medium">
                    {scenario.industry[language]}
                  </h4>
                  <p className="text-gray-400 text-[12px]">
                    {scenario.features.length} {language === 'tr' ? 'özellik' : 'features'}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-fuchsia-400" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Feature Selection Screen
  if (phase === 'features') {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-[#1a0a1a] to-[#2a1a2a]">
        {/* Header */}
        <div className="px-2 py-2 pt-12 flex items-center gap-2 border-b border-white/10">
          <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="w-9 h-9 rounded-xl p-[2px] bg-gradient-to-br from-fuchsia-500 to-pink-500 flex-shrink-0">
            <div className="w-full h-full rounded-[8px] overflow-hidden">
              <img src={demoLogo} alt="Allync AI" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white text-[14px] font-semibold truncate">{selectedScenario?.industry[language]}</h3>
            <p className="text-gray-400 text-[11px]">{t.selectFeatures}</p>
          </div>
        </div>

        {/* Feature Selection */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-3">
            {selectedScenario?.features.map((feature) => {
              const isSelected = selectedFeatures.includes(feature.id);
              return (
                <motion.button
                  key={feature.id}
                  onClick={() => toggleFeature(feature.id)}
                  className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all text-left border ${
                    isSelected
                      ? 'bg-fuchsia-500/20 border-fuchsia-500/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xl">{feature.icon}</span>
                  <span className="flex-1 text-white text-[14px]">{feature.name[language]}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-fuchsia-500 border-fuchsia-500'
                      : 'border-white/30'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Continue Button */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">
              {selectedFeatures.length} {t.featuresSelected}
            </span>
            <div className="flex gap-1">
              {selectedScenario?.features.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i < selectedFeatures.length ? 'bg-fuchsia-500' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
          <motion.button
            onClick={handleContinue}
            disabled={selectedFeatures.length === 0}
            className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              selectedFeatures.length > 0
                ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white'
                : 'bg-white/10 text-white/50 cursor-not-allowed'
            }`}
            whileHover={selectedFeatures.length > 0 ? { scale: 1.02 } : {}}
            whileTap={selectedFeatures.length > 0 ? { scale: 0.98 } : {}}
          >
            <Sparkles className="w-5 h-5" />
            {t.continue}
          </motion.button>
        </div>
      </div>
    );
  }

  // Building & Complete Screens
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#1a0a1a] to-[#2a1a2a]">
      {/* Header */}
      <div className="px-2 py-2 pt-12 flex items-center gap-2 border-b border-white/10">
        <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="w-9 h-9 rounded-xl p-[2px] bg-gradient-to-br from-fuchsia-500 to-pink-500 flex-shrink-0">
          <div className="w-full h-full rounded-[8px] overflow-hidden">
            <img src={demoLogo} alt="Allync AI" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white text-[14px] font-semibold truncate">{t.headerTitle}</h3>
          <p className="text-gray-400 text-[11px]">{selectedScenario?.industry[language]}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {/* Building Phase */}
          {phase === 'building' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Building Animation */}
              <div className="relative rounded-xl overflow-hidden bg-black/30 aspect-video flex items-center justify-center">
                <div className="relative">
                  <motion.div
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>
                  {/* Orbiting dots */}
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 bg-fuchsia-400 rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                      }}
                      animate={{
                        x: [0, Math.cos((i * Math.PI) / 2) * 50, 0],
                        y: [0, Math.sin((i * Math.PI) / 2) * 50, 0],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.25
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                <h4 className="text-white font-semibold">{t.building}</h4>
                <p className="text-gray-400 text-sm">{t.buildingDesc}</p>
              </div>

              {/* Progress Bar */}
              <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-fuchsia-500 to-pink-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Steps */}
              <div className="space-y-2">
                {buildSteps.map((step, index) => (
                  <motion.div
                    key={step.key}
                    className={`flex items-center gap-3 p-2 rounded-lg ${index === currentStep ? 'bg-white/10' : ''}`}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: index <= currentStep ? 1 : 0.5 }}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      index < currentStep ? 'bg-green-500' : index === currentStep ? 'bg-fuchsia-500' : 'bg-white/20'
                    }`}>
                      {index < currentStep ? (
                        <Check className="w-3 h-3 text-white" />
                      ) : index === currentStep ? (
                        <motion.div
                          className="w-2 h-2 bg-white rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        />
                      ) : (
                        <div className="w-2 h-2 bg-white/50 rounded-full" />
                      )}
                    </div>
                    <span className={`text-sm ${index <= currentStep ? 'text-white' : 'text-gray-500'}`}>
                      {t[step.key as keyof typeof t]}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Complete Phase */}
          {phase === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {/* Success */}
              <div className="text-center mb-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-500 flex items-center justify-center"
                >
                  <Check className="w-6 h-6 text-white" />
                </motion.div>
                <h4 className="text-white font-semibold">{t.complete}</h4>
              </div>

              {/* Solution Card */}
              <div className="bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 rounded-xl p-4 border border-fuchsia-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h5 className="text-white font-bold">{selectedScenario?.result.name[language]}</h5>
                    <p className="text-fuchsia-300 text-xs">{selectedScenario?.industry[language]}</p>
                  </div>
                </div>

                {/* Selected Features Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {selectedScenario?.features
                    .filter(f => selectedFeatures.includes(f.id))
                    .map(f => (
                      <span key={f.id} className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-white">
                        {f.icon} {f.name[language]}
                      </span>
                    ))}
                </div>
              </div>

              {/* Capabilities */}
              <div>
                <div className="text-xs text-fuchsia-400 font-medium mb-2 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {t.capabilities}
                </div>
                <div className="space-y-2">
                  {selectedScenario?.result.capabilities.slice(0, visibleCapabilities).map((cap, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
                    >
                      <div className="w-5 h-5 rounded-full bg-fuchsia-500/30 flex items-center justify-center">
                        <Check className="w-3 h-3 text-fuchsia-400" />
                      </div>
                      <span className="text-white text-[12px]">{cap[language]}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Info Row */}
              <div className="flex gap-2">
                <div className="flex-1 bg-white/5 rounded-lg p-2">
                  <div className="text-gray-400 text-[10px] flex items-center gap-1 mb-1">
                    <Link className="w-3 h-3" />
                    {t.integrations}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedScenario?.result.integrations.slice(0, 3).map((int, i) => (
                      <span key={i} className="text-[10px] text-white bg-white/10 px-1.5 py-0.5 rounded">{int}</span>
                    ))}
                    {(selectedScenario?.result.integrations.length || 0) > 3 && (
                      <span className="text-[10px] text-fuchsia-400">+{(selectedScenario?.result.integrations.length || 0) - 3}</span>
                    )}
                  </div>
                </div>
                <div className="flex-1 bg-white/5 rounded-lg p-2">
                  <div className="text-gray-400 text-[10px] flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3" />
                    {t.timeline}
                  </div>
                  <p className="text-white text-[11px] font-medium">{selectedScenario?.result.estimatedTime}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleRestart}
                  className="w-full py-2.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white rounded-lg text-[13px] font-medium flex items-center justify-center gap-2 hover:opacity-90"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t.restart}
                </button>
                {onContactClick && (
                  <button
                    onClick={onContactClick}
                    className="w-full py-2.5 bg-white/10 text-white rounded-lg text-[13px] font-medium hover:bg-white/20"
                  >
                    {t.contact}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
