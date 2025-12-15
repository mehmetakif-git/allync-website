import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Check, Film, Wand2, ArrowLeftRight } from 'lucide-react';
import { videoToVideoDemoScenarios, videoToVideoUIText, VideoToVideoDemoScenario } from '../../data/videoToVideoDemoScenarios';
import { useSoundEffect } from '../../contexts/SoundEffectContext';

// Demo Logo
import demoLogo from '../../assets/whatsapp-demo-logo.png';

interface VideoToVideoDemoProps {
  language: 'tr' | 'en';
  onContactClick?: () => void;
}

type DemoPhase = 'selecting' | 'preview' | 'processing' | 'complete';

// Progress steps for transformation
const transformationSteps = [
  { key: 'analyzing', duration: 1200 },
  { key: 'detecting', duration: 1500 },
  { key: 'transforming', duration: 2500 },
  { key: 'rendering', duration: 2000 }
];

export const VideoToVideoDemo: React.FC<VideoToVideoDemoProps> = ({ language, onContactClick }) => {
  const [selectedScenario, setSelectedScenario] = useState<VideoToVideoDemoScenario | null>(null);
  const [phase, setPhase] = useState<DemoPhase>('selecting');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { playBackSound } = useSoundEffect();

  const t = videoToVideoUIText[language];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Transformation progress
  const startTransformationProcess = useCallback(() => {
    let stepIndex = 0;
    const totalDuration = transformationSteps.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;
    setProgress(0);

    const updateProgress = () => {
      if (stepIndex >= transformationSteps.length) {
        setProgress(100);
        timeoutRef.current = setTimeout(() => {
          setPhase('complete');
          // Animate slider to show transformation
          animateSlider();
        }, 400);
        return;
      }

      setCurrentStep(stepIndex);

      const stepProgress = (elapsed / totalDuration) * 100;
      setProgress(Math.min(stepProgress, 99));

      elapsed += 100;

      if (elapsed >= transformationSteps.slice(0, stepIndex + 1).reduce((acc, s) => acc + s.duration, 0)) {
        stepIndex++;
      }

      timeoutRef.current = setTimeout(updateProgress, 100);
    };

    updateProgress();
  }, []);

  // Animate slider back and forth to show before/after
  const animateSlider = useCallback(() => {
    let pos = 50;
    let direction = 1;
    let cycles = 0;
    const maxCycles = 2;

    const animate = () => {
      pos += direction * 2;

      if (pos >= 85) {
        direction = -1;
      } else if (pos <= 15) {
        direction = 1;
        cycles++;
      }

      if (cycles >= maxCycles) {
        setSliderPosition(50);
        return;
      }

      setSliderPosition(pos);
      timeoutRef.current = setTimeout(animate, 30);
    };

    timeoutRef.current = setTimeout(animate, 500);
  }, []);

  const handleScenarioSelect = (scenario: VideoToVideoDemoScenario) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSelectedScenario(scenario);
    setPhase('preview');
    setCurrentStep(0);
    setProgress(0);
    setSliderPosition(50);
  };

  const handleStartTransformation = () => {
    setPhase('processing');
    startTransformationProcess();
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
    setSliderPosition(50);
  };

  const handleRestart = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSelectedScenario(null);
    setPhase('selecting');
    setCurrentStep(0);
    setProgress(0);
    setSliderPosition(50);
  };

  // Slider drag handling
  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current || !isDragging) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => handleSliderMove(e.clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleSliderMove(e.touches[0].clientX);

  // Scenario Selection Screen
  if (phase === 'selecting') {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-[#0a0a1f] to-[#1a1a3e]">
        {/* Header */}
        <div className="px-4 py-3 pt-12 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl p-[2px] bg-gradient-to-br from-indigo-500 to-blue-500">
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
            {videoToVideoDemoScenarios.map((scenario) => (
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
                    {scenario.transformationType} • {scenario.processingTime}
                  </p>
                </div>
                <Film className="w-5 h-5 text-indigo-400" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Demo Screen (Preview, Processing, Complete)
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#0a0a1f] to-[#1a1a3e]">
      {/* Header */}
      <div className="px-2 py-2 pt-12 flex items-center gap-2 border-b border-white/10">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="w-9 h-9 rounded-xl p-[2px] bg-gradient-to-br from-indigo-500 to-blue-500 flex-shrink-0">
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
          {/* Preview Phase */}
          {phase === 'preview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Video Preview Placeholder */}
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900/50 to-blue-900/50">
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center mx-auto mb-3"
                    >
                      <Film className="w-8 h-8 text-white" />
                    </motion.div>
                    <p className="text-white/70 text-sm">{language === 'tr' ? 'Kaynak Video' : 'Source Video'}</p>
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
                  <p className="text-white font-medium text-sm">{selectedScenario?.transformationType}</p>
                </div>
                <div className="flex-1 bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs">{t.time}</p>
                  <p className="text-white font-medium text-sm">{selectedScenario?.processingTime}</p>
                </div>
              </div>

              {/* Start Transformation Button */}
              <motion.button
                onClick={handleStartTransformation}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Wand2 className="w-5 h-5" />
                {t.startTransform}
              </motion.button>
            </motion.div>
          )}

          {/* Processing Phase */}
          {phase === 'processing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Processing Animation */}
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900/50 to-blue-900/50">
                  {/* Transformation effect visualization */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(90deg, transparent ${progress}%, rgba(99, 102, 241, 0.3) ${progress}%, rgba(99, 102, 241, 0.3) 100%)`
                    }}
                  />
                  <div className="relative z-10 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center mx-auto mb-3"
                    >
                      <Wand2 className="w-8 h-8 text-white" />
                    </motion.div>
                    <p className="text-white font-medium">{Math.round(progress)}%</p>
                  </div>
                </div>
              </div>

              {/* Progress Header */}
              <div className="text-center">
                <h4 className="text-white font-semibold">{t.processing}</h4>
                <p className="text-gray-400 text-sm">{t.processingDesc}</p>
              </div>

              {/* Progress Bar */}
              <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Steps */}
              <div className="space-y-2">
                {transformationSteps.map((step, index) => (
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
                          ? 'bg-indigo-500'
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

          {/* Complete Phase - Before/After Comparison */}
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

              {/* Before/After Comparison Slider */}
              <div
                ref={sliderRef}
                className="relative rounded-xl overflow-hidden bg-black aspect-video cursor-ew-resize select-none"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                onTouchMove={handleTouchMove}
              >
                {/* Before (left side) */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Film className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-xs">{selectedScenario?.beforeLabel[language]}</p>
                    </div>
                  </div>
                  {/* Before label */}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 rounded text-white text-xs">
                    {t.before}
                  </div>
                </div>

                {/* After (right side - clips based on slider) */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-600 overflow-hidden"
                  style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        animate={{
                          filter: ['hue-rotate(0deg)', 'hue-rotate(30deg)', 'hue-rotate(0deg)']
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Film className="w-10 h-10 text-white mx-auto mb-2" />
                      </motion.div>
                      <p className="text-white text-xs">{selectedScenario?.afterLabel[language]}</p>
                    </div>
                  </div>
                  {/* After label */}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 rounded text-white text-xs">
                    {t.after}
                  </div>
                </div>

                {/* Slider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                  style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <ArrowLeftRight className="w-4 h-4 text-indigo-600" />
                  </div>
                </div>
              </div>

              {/* Drag hint */}
              <p className="text-center text-gray-500 text-xs">
                {language === 'tr' ? '← Karşılaştırmak için kaydırın →' : '← Drag to compare →'}
              </p>

              {/* Info Tags */}
              <div className="flex gap-3">
                <div className="flex-1 bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs">{t.type}</p>
                  <p className="text-white font-medium text-sm">{selectedScenario?.transformationType}</p>
                </div>
                <div className="flex-1 bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs">{t.time}</p>
                  <p className="text-white font-medium text-sm">{selectedScenario?.processingTime}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleRestart}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg text-[13px] font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
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
