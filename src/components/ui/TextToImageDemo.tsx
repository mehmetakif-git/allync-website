import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Sparkles, Check, ImageIcon, Download, ZoomIn } from 'lucide-react';
import { textToImageDemoScenarios, textToImageUIText, TextToImageDemoScenario } from '../../data/textToImageDemoScenarios';

// Demo Logo - same as other demos
import demoLogo from '../../assets/whatsapp-demo-logo.png';

interface TextToImageDemoProps {
  language: 'tr' | 'en';
  onContactClick?: () => void;
}

type DemoPhase = 'selecting' | 'typing' | 'generating' | 'complete';

// Progress steps for generation
const generationSteps = [
  { key: 'analyzing', duration: 1200 },
  { key: 'composing', duration: 2000 },
  { key: 'rendering', duration: 2500 },
  { key: 'enhancing', duration: 1500 }
];

export const TextToImageDemo: React.FC<TextToImageDemoProps> = ({ language, onContactClick }) => {
  const [selectedScenario, setSelectedScenario] = useState<TextToImageDemoScenario | null>(null);
  const [phase, setPhase] = useState<DemoPhase>('selecting');
  const [typedText, setTypedText] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [imageError, setImageError] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { playBackSound } = useSoundEffect();

  const t = textToImageUIText[language];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Typing animation
  const startTypingAnimation = useCallback((text: string) => {
    let index = 0;
    setTypedText('');

    const typeChar = () => {
      if (index < text.length) {
        setTypedText(text.slice(0, index + 1));
        index++;
        timeoutRef.current = setTimeout(typeChar, 25 + Math.random() * 15);
      } else {
        // Start generation phase after typing
        timeoutRef.current = setTimeout(() => {
          setPhase('generating');
          startGenerationAnimation();
        }, 600);
      }
    };

    timeoutRef.current = setTimeout(typeChar, 400);
  }, []);

  // Generation progress animation
  const startGenerationAnimation = useCallback(() => {
    let stepIndex = 0;
    const totalDuration = generationSteps.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;

    const updateProgress = () => {
      if (stepIndex >= generationSteps.length) {
        setProgress(100);
        timeoutRef.current = setTimeout(() => {
          setPhase('complete');
        }, 400);
        return;
      }

      setCurrentStep(stepIndex);

      // Animate progress within this step
      const stepProgress = (elapsed / totalDuration) * 100;
      setProgress(Math.min(stepProgress, 99));

      elapsed += 100;

      if (elapsed >= generationSteps.slice(0, stepIndex + 1).reduce((acc, s) => acc + s.duration, 0)) {
        stepIndex++;
      }

      timeoutRef.current = setTimeout(updateProgress, 100);
    };

    updateProgress();
  }, []);

  const handleScenarioSelect = (scenario: TextToImageDemoScenario) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSelectedScenario(scenario);
    setPhase('typing');
    setImageError(false);
    startTypingAnimation(scenario.prompt[language]);
  };

  const handleBack = () => {
    playBackSound();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSelectedScenario(null);
    setPhase('selecting');
    setTypedText('');
    setCurrentStep(0);
    setProgress(0);
    setImageError(false);
  };

  const handleRestart = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSelectedScenario(null);
    setPhase('selecting');
    setTypedText('');
    setCurrentStep(0);
    setProgress(0);
    setImageError(false);
  };

  // Scenario Selection Screen
  if (phase === 'selecting') {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-[#1a0a2e] to-[#2d1b4e]">
        {/* Header */}
        <div className="px-4 py-3 pt-12 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl p-[2px] bg-gradient-to-br from-violet-500 to-purple-600">
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
            {textToImageDemoScenarios.map((scenario) => (
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
                    {scenario.resolution} • {scenario.style}
                  </p>
                </div>
                <ImageIcon className="w-5 h-5 text-violet-400" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Demo Screen (Typing, Generating, Complete)
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#1a0a2e] to-[#2d1b4e]">
      {/* Header */}
      <div className="px-2 py-2 pt-12 flex items-center gap-2 border-b border-white/10">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="w-9 h-9 rounded-xl p-[2px] bg-gradient-to-br from-violet-500 to-purple-600 flex-shrink-0">
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
        {/* Prompt Section */}
        <div className="mb-4">
          <div className="text-xs text-violet-400 font-medium mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {t.prompt}
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-white text-[13px] leading-relaxed min-h-[60px]">
              {typedText}
              {phase === 'typing' && (
                <motion.span
                  className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              )}
            </p>
          </div>
        </div>

        {/* Generation Progress */}
        <AnimatePresence mode="wait">
          {phase === 'generating' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Progress Header */}
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <ImageIcon className="w-8 h-8 text-white" />
                </motion.div>
                <h4 className="text-white font-semibold">{t.generating}</h4>
                <p className="text-gray-400 text-sm">{t.generatingDesc}</p>
              </div>

              {/* Progress Bar */}
              <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-600"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              {/* Steps */}
              <div className="space-y-2">
                {generationSteps.map((step, index) => (
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
                          ? 'bg-violet-500'
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

          {/* Image Result */}
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

              {/* Image Preview */}
              <div className="relative rounded-xl overflow-hidden bg-black aspect-square">
                {!imageError ? (
                  <>
                    <img
                      src={selectedScenario?.imagePlaceholder}
                      alt="Generated"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                    {/* Image Controls Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                      <div className="flex items-center gap-2 w-full">
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                          <ZoomIn className="w-4 h-4 text-white" />
                        </button>
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                          <Download className="w-4 h-4 text-white" />
                        </button>
                        <div className="flex-1" />
                        <div className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                          {selectedScenario?.resolution}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Placeholder when image not available
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-violet-900/50 to-purple-900/50">
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-20 h-20 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center mb-3"
                    >
                      <ImageIcon className="w-10 h-10 text-white" />
                    </motion.div>
                    <p className="text-white/80 text-sm font-medium">Image Preview</p>
                    <p className="text-white/50 text-xs mt-1">{selectedScenario?.resolution} • {selectedScenario?.style}</p>
                  </div>
                )}
              </div>

              {/* Image Info */}
              <div className="flex gap-4">
                <div className="flex-1 bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs">{t.resolution}</p>
                  <p className="text-white font-medium">{selectedScenario?.resolution}</p>
                </div>
                <div className="flex-1 bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs">{t.style}</p>
                  <p className="text-white font-medium">{selectedScenario?.style}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleRestart}
                  className="w-full py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg text-[13px] font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
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
