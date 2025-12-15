import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Play, Pause, Check, Image as ImageIcon, Wand2 } from 'lucide-react';
import { imageToVideoDemoScenarios, imageToVideoUIText, ImageToVideoDemoScenario } from '../../data/imageToVideoDemoScenarios';
import { useSoundEffect } from '../../contexts/SoundEffectContext';

// Demo Logo
import demoLogo from '../../assets/whatsapp-demo-logo.png';

interface ImageToVideoDemoProps {
  language: 'tr' | 'en';
  onContactClick?: () => void;
}

type DemoPhase = 'selecting' | 'preview' | 'animating' | 'complete';

// Progress steps for animation generation
const animationSteps = [
  { key: 'analyzing', duration: 1200 },
  { key: 'detecting', duration: 1500 },
  { key: 'generating', duration: 2500 },
  { key: 'rendering', duration: 2000 }
];

export const ImageToVideoDemo: React.FC<ImageToVideoDemoProps> = ({ language, onContactClick }) => {
  const [selectedScenario, setSelectedScenario] = useState<ImageToVideoDemoScenario | null>(null);
  const [phase, setPhase] = useState<DemoPhase>('selecting');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { playBackSound } = useSoundEffect();

  const t = imageToVideoUIText[language];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Animation progress
  const startAnimationProcess = useCallback(() => {
    let stepIndex = 0;
    const totalDuration = animationSteps.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;
    setProgress(0);

    const updateProgress = () => {
      if (stepIndex >= animationSteps.length) {
        setProgress(100);
        timeoutRef.current = setTimeout(() => {
          setPhase('complete');
          setIsPlaying(true);
        }, 400);
        return;
      }

      setCurrentStep(stepIndex);

      const stepProgress = (elapsed / totalDuration) * 100;
      setProgress(Math.min(stepProgress, 99));

      elapsed += 100;

      if (elapsed >= animationSteps.slice(0, stepIndex + 1).reduce((acc, s) => acc + s.duration, 0)) {
        stepIndex++;
      }

      timeoutRef.current = setTimeout(updateProgress, 100);
    };

    updateProgress();
  }, []);

  const handleScenarioSelect = (scenario: ImageToVideoDemoScenario) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSelectedScenario(scenario);
    setPhase('preview');
    setCurrentStep(0);
    setProgress(0);
  };

  const handleStartAnimation = () => {
    setPhase('animating');
    startAnimationProcess();
  };

  const handleBack = () => {
    playBackSound();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSelectedScenario(null);
    setPhase('selecting');
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
  };

  const handleRestart = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSelectedScenario(null);
    setPhase('selecting');
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
  };

  // Scenario Selection Screen
  if (phase === 'selecting') {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-[#0a1a1a] to-[#1a2a2a]">
        {/* Header */}
        <div className="px-4 py-3 pt-12 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl p-[2px] bg-gradient-to-br from-teal-500 to-cyan-500">
            <div className="w-full h-full rounded-[10px] overflow-hidden">
              <img
                src={demoLogo}
                alt="Allync AI"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-white text-[15px] font-semibold">{t.headerTitle}</h3>
            <p className="text-gray-400 text-[12px]">{t.selectScenario}</p>
          </div>
        </div>

        {/* Scenario List */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid gap-3">
            {imageToVideoDemoScenarios.map((scenario) => (
              <motion.button
                key={scenario.id}
                onClick={() => handleScenarioSelect(scenario)}
                className="w-full p-4 bg-white/5 backdrop-blur-sm rounded-xl flex items-center gap-4 hover:bg-white/10 transition-colors text-left border border-white/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl">{scenario.icon}</span>
                <div className="flex-1">
                  <h4 className="text-white text-[14px] font-medium">
                    {scenario.title[language]}
                  </h4>
                  <p className="text-gray-400 text-[12px]">
                    {scenario.animationType} • {scenario.duration}
                  </p>
                </div>
                <Wand2 className="w-5 h-5 text-teal-400" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Demo Screen (Preview, Animating, Complete)
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#0a1a1a] to-[#1a2a2a]">
      {/* Header */}
      <div className="px-2 py-2 pt-12 flex items-center gap-2 border-b border-white/10">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="w-9 h-9 rounded-xl p-[2px] bg-gradient-to-br from-teal-500 to-cyan-500 flex-shrink-0">
          <div className="w-full h-full rounded-[8px] overflow-hidden">
            <img
              src={demoLogo}
              alt="Allync AI"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white text-[14px] font-semibold truncate">{t.headerTitle}</h3>
          <p className="text-gray-400 text-[11px]">
            {selectedScenario?.title[language]}
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {/* Preview Phase - Show source image */}
          {phase === 'preview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Source Image Label */}
              <div className="text-xs text-teal-400 font-medium flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                {t.sourceImage}
              </div>

              {/* Source Image Preview */}
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                <img
                  src={selectedScenario?.sourceImage}
                  alt="Source"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                {/* Fallback gradient */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal-900/50 to-cyan-900/50">
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-white/50 mx-auto mb-2" />
                    <p className="text-white/70 text-sm">{selectedScenario?.title[language]}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-white text-[13px] leading-relaxed">
                  {selectedScenario?.description[language]}
                </p>
              </div>

              {/* Info Tags */}
              <div className="flex gap-3">
                <div className="flex-1 bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs">{t.type}</p>
                  <p className="text-white font-medium text-sm">{selectedScenario?.animationType}</p>
                </div>
                <div className="flex-1 bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs">{t.duration}</p>
                  <p className="text-white font-medium text-sm">{selectedScenario?.duration}</p>
                </div>
              </div>

              {/* Start Animation Button */}
              <motion.button
                onClick={handleStartAnimation}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Wand2 className="w-5 h-5" />
                {language === 'tr' ? 'Animate Et' : 'Animate'}
              </motion.button>
            </motion.div>
          )}

          {/* Animating Phase */}
          {phase === 'animating' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Animation Preview with pulse effect */}
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                <motion.img
                  src={selectedScenario?.sourceImage}
                  alt="Animating"
                  className="w-full h-full object-cover"
                  animate={{
                    scale: [1, 1.02, 1],
                    filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)']
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                {/* Scanning line effect */}
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent"
                  animate={{ top: ['0%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                {/* Fallback */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal-900/30 to-cyan-900/30 pointer-events-none">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  >
                    <Wand2 className="w-8 h-8 text-teal-400" />
                  </motion.div>
                </div>
              </div>

              {/* Progress Header */}
              <div className="text-center">
                <h4 className="text-white font-semibold">{t.animating}</h4>
                <p className="text-gray-400 text-sm">{t.animatingDesc}</p>
              </div>

              {/* Progress Bar */}
              <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Steps */}
              <div className="space-y-2">
                {animationSteps.map((step, index) => (
                  <motion.div
                    key={step.key}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      index === currentStep ? 'bg-white/10' : ''
                    }`}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: index <= currentStep ? 1 : 0.5 }}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      index < currentStep
                        ? 'bg-green-500'
                        : index === currentStep
                          ? 'bg-teal-500'
                          : 'bg-white/20'
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
                    <span className={`text-sm ${
                      index <= currentStep ? 'text-white' : 'text-gray-500'
                    }`}>
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
              {/* Success Badge */}
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

              {/* Animated Result Preview */}
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                <motion.img
                  src={selectedScenario?.sourceImage}
                  alt="Result"
                  className="w-full h-full object-cover"
                  animate={
                    selectedScenario?.id === 'product-showcase'
                      ? { rotateY: [0, 360] }
                      : selectedScenario?.id === 'portrait-alive'
                        ? { scale: [1, 1.02, 1], x: [-2, 2, -2] }
                        : selectedScenario?.id === 'social-motion'
                          ? { scale: [1, 1.1, 1], filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'] }
                          : { y: [-5, 5, -5], scale: [1, 1.03, 1] }
                  }
                  transition={{
                    duration: selectedScenario?.id === 'product-showcase' ? 4 : 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                {/* Fallback with animation indicator */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-teal-900/50 to-cyan-900/50">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center mb-3"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white ml-1" />
                    )}
                  </motion.div>
                  <p className="text-white/80 text-sm font-medium">{selectedScenario?.animationType}</p>
                </div>

                {/* Play indicator */}
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 rounded text-white text-xs flex items-center gap-1">
                  <motion.div
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  {language === 'tr' ? 'Canlı' : 'Live'}
                </div>
              </div>

              {/* Video Info */}
              <div className="flex gap-3">
                <div className="flex-1 bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs">{t.type}</p>
                  <p className="text-white font-medium text-sm">{selectedScenario?.animationType}</p>
                </div>
                <div className="flex-1 bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs">{t.duration}</p>
                  <p className="text-white font-medium text-sm">{selectedScenario?.duration}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleRestart}
                  className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg text-[13px] font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t.restart}
                </button>
                {onContactClick && (
                  <button
                    onClick={onContactClick}
                    className="w-full py-2.5 bg-white/10 text-white rounded-lg text-[13px] font-medium hover:bg-white/20 transition-colors"
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
