import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, FileText, Check, Scan, Upload } from 'lucide-react';
import { documentAIDemoScenarios, documentAIUIText, DocumentAIDemoScenario } from '../../data/documentAIDemoScenarios';

// Demo Logo - same as other demos
import demoLogo from '../../assets/whatsapp-demo-logo.png';

interface DocumentAIDemoProps {
  language: 'tr' | 'en';
  onContactClick?: () => void;
}

type DemoPhase = 'selecting' | 'uploading' | 'processing' | 'complete';

// Progress steps for document processing
const processingSteps = [
  { key: 'scanning', duration: 1200 },
  { key: 'detecting', duration: 1500 },
  { key: 'extracting', duration: 2000 },
  { key: 'validating', duration: 1000 }
];

// Scanning animation component
const ScanningAnimation: React.FC = () => {
  return (
    <div className="relative w-32 h-40 mx-auto">
      {/* Document */}
      <div className="absolute inset-0 bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Fake text lines */}
        <div className="p-3 space-y-2">
          <div className="h-2 bg-gray-300 rounded w-3/4" />
          <div className="h-2 bg-gray-300 rounded w-full" />
          <div className="h-2 bg-gray-300 rounded w-5/6" />
          <div className="h-2 bg-gray-300 rounded w-2/3" />
          <div className="h-4 mt-3" />
          <div className="h-2 bg-gray-300 rounded w-full" />
          <div className="h-2 bg-gray-300 rounded w-4/5" />
          <div className="h-2 bg-gray-300 rounded w-3/4" />
        </div>
      </div>
      {/* Scanning line */}
      <motion.div
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

export const DocumentAIDemo: React.FC<DocumentAIDemoProps> = ({ language, onContactClick }) => {
  const [selectedScenario, setSelectedScenario] = useState<DocumentAIDemoScenario | null>(null);
  const [phase, setPhase] = useState<DemoPhase>('selecting');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visibleFields, setVisibleFields] = useState<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { playBackSound } = useSoundEffect();

  const t = documentAIUIText[language];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Upload animation
  const startUploadAnimation = useCallback(() => {
    let uploadProgress = 0;

    const updateUpload = () => {
      if (uploadProgress >= 100) {
        setPhase('processing');
        startProcessingAnimation();
        return;
      }

      uploadProgress += 5;
      setProgress(uploadProgress);
      timeoutRef.current = setTimeout(updateUpload, 50);
    };

    timeoutRef.current = setTimeout(updateUpload, 300);
  }, []);

  // Processing animation
  const startProcessingAnimation = useCallback(() => {
    let stepIndex = 0;
    const totalDuration = processingSteps.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;
    setProgress(0);

    const updateProgress = () => {
      if (stepIndex >= processingSteps.length) {
        setProgress(100);
        timeoutRef.current = setTimeout(() => {
          setPhase('complete');
          // Animate fields appearing one by one
          animateFields();
        }, 400);
        return;
      }

      setCurrentStep(stepIndex);

      const stepProgress = (elapsed / totalDuration) * 100;
      setProgress(Math.min(stepProgress, 99));

      elapsed += 100;

      if (elapsed >= processingSteps.slice(0, stepIndex + 1).reduce((acc, s) => acc + s.duration, 0)) {
        stepIndex++;
      }

      timeoutRef.current = setTimeout(updateProgress, 100);
    };

    updateProgress();
  }, []);

  // Animate fields appearing
  const animateFields = useCallback(() => {
    if (!selectedScenario) return;

    let fieldIndex = 0;
    const showNextField = () => {
      if (fieldIndex >= selectedScenario.extractedFields.length) {
        return;
      }
      fieldIndex++;
      setVisibleFields(fieldIndex);
      timeoutRef.current = setTimeout(showNextField, 200);
    };

    timeoutRef.current = setTimeout(showNextField, 300);
  }, [selectedScenario]);

  const handleScenarioSelect = (scenario: DocumentAIDemoScenario) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSelectedScenario(scenario);
    setPhase('uploading');
    setCurrentStep(0);
    setProgress(0);
    setVisibleFields(0);
    startUploadAnimation();
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
    setVisibleFields(0);
  };

  const handleRestart = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSelectedScenario(null);
    setPhase('selecting');
    setCurrentStep(0);
    setProgress(0);
    setVisibleFields(0);
  };

  // Scenario Selection Screen
  if (phase === 'selecting') {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a]">
        {/* Header */}
        <div className="px-4 py-3 pt-12 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl p-[2px] bg-gradient-to-br from-gray-500 to-gray-700">
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
            {documentAIDemoScenarios.map((scenario) => (
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
                    {scenario.accuracy} {language === 'tr' ? 'doğruluk' : 'accuracy'}
                  </p>
                </div>
                <FileText className="w-5 h-5 text-gray-400" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Demo Screen (Uploading, Processing, Complete)
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a]">
      {/* Header */}
      <div className="px-2 py-2 pt-12 flex items-center gap-2 border-b border-white/10">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="w-9 h-9 rounded-xl p-[2px] bg-gradient-to-br from-gray-500 to-gray-700 flex-shrink-0">
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
          {/* Uploading Phase */}
          {phase === 'uploading' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-gray-500 to-gray-700 flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Upload className="w-8 h-8 text-white" />
                </motion.div>
                <h4 className="text-white font-semibold">{t.uploadPrompt}</h4>
              </div>

              {/* Upload Progress */}
              <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-gray-500 to-gray-600"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-center text-gray-400 text-sm">{progress}%</p>
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
              <div className="text-center">
                <h4 className="text-white font-semibold mb-2">{t.processing}</h4>
                <p className="text-gray-400 text-sm">{t.processingDesc}</p>
              </div>

              {/* Scanning Animation */}
              <div className="py-4">
                <ScanningAnimation />
              </div>

              {/* Progress Bar */}
              <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-gray-500 to-gray-600"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Steps */}
              <div className="space-y-2">
                {processingSteps.map((step, index) => (
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
                          ? 'bg-gray-500'
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

              {/* Document Info */}
              <div className="flex gap-3">
                <div className="flex-1 bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs">{t.processingTime}</p>
                  <p className="text-white font-medium">{selectedScenario?.processingTime}</p>
                </div>
                <div className="flex-1 bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs">{t.accuracy}</p>
                  <p className="text-green-400 font-medium">{selectedScenario?.accuracy}</p>
                </div>
              </div>

              {/* Extracted Data */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <Scan className="w-4 h-4 text-gray-400" />
                  <h5 className="text-white text-sm font-medium">{t.extractedData}</h5>
                </div>

                <div className="space-y-2">
                  {selectedScenario?.extractedFields.slice(0, visibleFields).map((field, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                    >
                      <div>
                        <p className="text-gray-400 text-xs">{field.label[language]}</p>
                        <p className="text-white text-sm font-medium">{field.value}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-green-500 to-green-400"
                          style={{ width: `${field.confidence * 0.4}px` }}
                        />
                        <span className="text-green-400 text-xs">{field.confidence}%</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleRestart}
                  className="w-full py-2.5 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-lg text-[13px] font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
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
