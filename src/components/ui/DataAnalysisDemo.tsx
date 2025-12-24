import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Check, BarChart3, TrendingUp, TrendingDown, Lightbulb, Zap } from 'lucide-react';
import { dataAnalysisDemoScenarios, dataAnalysisUIText, DataAnalysisDemoScenario } from '../../data/dataAnalysisDemoScenarios';

// Demo Logo
import demoLogo from '../../assets/whatsapp-demo-logo.png';

interface DataAnalysisDemoProps {
  language: 'tr' | 'en';
  onContactClick?: () => void;
}

type DemoPhase = 'selecting' | 'analyzing' | 'complete';

// Progress steps
const analysisSteps = [
  { key: 'loading', duration: 1000 },
  { key: 'processing', duration: 1500 },
  { key: 'generating', duration: 2000 },
  { key: 'visualizing', duration: 1500 }
];

// Mini Chart Component
const MiniChart: React.FC<{ type: 'line' | 'bar' | 'pie' | 'area'; color: string }> = ({ type, color }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (type === 'line') {
    return (
      <svg viewBox="0 0 100 40" className="w-full h-full">
        <motion.path
          d="M 0 35 Q 15 30, 25 25 T 50 20 T 75 10 T 100 5"
          fill="none"
          stroke={color}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: animated ? 1 : 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <motion.path
          d="M 0 35 Q 15 30, 25 25 T 50 20 T 75 10 T 100 5 V 40 H 0 Z"
          fill={`${color}30`}
          initial={{ opacity: 0 }}
          animate={{ opacity: animated ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </svg>
    );
  }

  if (type === 'bar') {
    const bars = [65, 45, 80, 55, 90, 70, 85];
    return (
      <svg viewBox="0 0 100 40" className="w-full h-full">
        {bars.map((height, i) => (
          <motion.rect
            key={i}
            x={i * 14 + 2}
            y={40 - (height * 0.4)}
            width="10"
            height={height * 0.4}
            fill={color}
            rx="2"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: animated ? 1 : 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{ transformOrigin: 'bottom' }}
          />
        ))}
      </svg>
    );
  }

  if (type === 'pie') {
    const segments = [
      { percent: 35, offset: 0 },
      { percent: 25, offset: 35 },
      { percent: 20, offset: 60 },
      { percent: 20, offset: 80 }
    ];
    const colors = [color, `${color}cc`, `${color}99`, `${color}66`];
    return (
      <svg viewBox="0 0 40 40" className="w-full h-full">
        {segments.map((seg, i) => (
          <motion.circle
            key={i}
            cx="20"
            cy="20"
            r="15"
            fill="none"
            stroke={colors[i]}
            strokeWidth="8"
            strokeDasharray={`${seg.percent} ${100 - seg.percent}`}
            strokeDashoffset={-seg.offset}
            initial={{ opacity: 0 }}
            animate={{ opacity: animated ? 1 : 0 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            transform="rotate(-90 20 20)"
          />
        ))}
      </svg>
    );
  }

  // Area chart
  return (
    <svg viewBox="0 0 100 40" className="w-full h-full">
      <defs>
        <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <motion.path
        d="M 0 35 Q 10 32, 20 28 T 40 22 T 60 18 T 80 12 T 100 8 V 40 H 0 Z"
        fill="url(#areaGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: animated ? 1 : 0 }}
        transition={{ duration: 1 }}
      />
      <motion.path
        d="M 0 35 Q 10 32, 20 28 T 40 22 T 60 18 T 80 12 T 100 8"
        fill="none"
        stroke={color}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: animated ? 1 : 0 }}
        transition={{ duration: 1.5 }}
      />
    </svg>
  );
};

export const DataAnalysisDemo: React.FC<DataAnalysisDemoProps> = ({ language, onContactClick }) => {
  const [selectedScenario, setSelectedScenario] = useState<DataAnalysisDemoScenario | null>(null);
  const [phase, setPhase] = useState<DemoPhase>('selecting');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visibleMetrics, setVisibleMetrics] = useState(0);
  const [visibleInsights, setVisibleInsights] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { playBackSound } = useSoundEffect();

  const t = dataAnalysisUIText[language];

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Analysis progress
  const startAnalysis = useCallback(() => {
    let stepIndex = 0;
    const totalDuration = analysisSteps.reduce((acc, step) => acc + step.duration, 0);
    let elapsed = 0;
    setProgress(0);

    const updateProgress = () => {
      if (stepIndex >= analysisSteps.length) {
        setProgress(100);
        timeoutRef.current = setTimeout(() => {
          setPhase('complete');
          animateResults();
        }, 400);
        return;
      }

      setCurrentStep(stepIndex);
      const stepProgress = (elapsed / totalDuration) * 100;
      setProgress(Math.min(stepProgress, 99));

      elapsed += 100;

      if (elapsed >= analysisSteps.slice(0, stepIndex + 1).reduce((acc, s) => acc + s.duration, 0)) {
        stepIndex++;
      }

      timeoutRef.current = setTimeout(updateProgress, 100);
    };

    updateProgress();
  }, []);

  // Animate results appearing
  const animateResults = useCallback(() => {
    // Animate metrics
    let metricIndex = 0;
    const showMetric = () => {
      if (metricIndex >= (selectedScenario?.metrics.length || 3)) {
        // Start showing insights
        animateInsights();
        return;
      }
      metricIndex++;
      setVisibleMetrics(metricIndex);
      timeoutRef.current = setTimeout(showMetric, 300);
    };
    timeoutRef.current = setTimeout(showMetric, 500);
  }, [selectedScenario]);

  const animateInsights = useCallback(() => {
    let insightIndex = 0;
    const showInsight = () => {
      if (insightIndex >= (selectedScenario?.insightCount || 5)) {
        return;
      }
      insightIndex++;
      setVisibleInsights(insightIndex);
      timeoutRef.current = setTimeout(showInsight, 400);
    };
    timeoutRef.current = setTimeout(showInsight, 300);
  }, [selectedScenario]);

  const handleScenarioSelect = (scenario: DataAnalysisDemoScenario) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSelectedScenario(scenario);
    setPhase('analyzing');
    setCurrentStep(0);
    setProgress(0);
    setVisibleMetrics(0);
    setVisibleInsights(0);
    startAnalysis();
  };

  const handleBack = () => {
    playBackSound();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSelectedScenario(null);
    setPhase('selecting');
    setCurrentStep(0);
    setProgress(0);
    setVisibleMetrics(0);
    setVisibleInsights(0);
  };

  const handleRestart = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSelectedScenario(null);
    setPhase('selecting');
    setCurrentStep(0);
    setProgress(0);
    setVisibleMetrics(0);
    setVisibleInsights(0);
  };

  const insights = [
    t.insight1, t.insight2, t.insight3, t.insight4, t.insight5
  ];

  // Selection Screen
  if (phase === 'selecting') {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-[#1a1500] to-[#2a2000]">
        {/* Header */}
        <div className="px-4 py-3 pt-12 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl p-[2px] bg-gradient-to-br from-yellow-500 to-orange-500">
            <div className="w-full h-full rounded-[10px] overflow-hidden">
              <img src={demoLogo} alt="Allync AI" className="w-full h-full object-cover" />
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
            {dataAnalysisDemoScenarios.map((scenario) => (
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
                    {scenario.metrics.length} {language === 'tr' ? 'metrik' : 'metrics'} • {scenario.insightCount} {language === 'tr' ? 'öngörü' : 'insights'}
                  </p>
                </div>
                <BarChart3 className="w-5 h-5 text-yellow-400" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Demo Screen
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#1a1500] to-[#2a2000]">
      {/* Header */}
      <div className="px-2 py-2 pt-12 flex items-center gap-2 border-b border-white/10">
        <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="w-9 h-9 rounded-xl p-[2px] bg-gradient-to-br from-yellow-500 to-orange-500 flex-shrink-0">
          <div className="w-full h-full rounded-[8px] overflow-hidden">
            <img src={demoLogo} alt="Allync AI" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white text-[14px] font-semibold truncate">{t.headerTitle}</h3>
          <p className="text-gray-400 text-[11px]">{selectedScenario?.title[language]}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {/* Analyzing Phase */}
          {phase === 'analyzing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Animated Chart Preview */}
              <div className="relative rounded-xl overflow-hidden bg-black/30 aspect-video flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center"
                >
                  <BarChart3 className="w-8 h-8 text-white" />
                </motion.div>
              </div>

              <div className="text-center">
                <h4 className="text-white font-semibold">{t.analyzing}</h4>
                <p className="text-gray-400 text-sm">{t.analyzingDesc}</p>
              </div>

              {/* Progress Bar */}
              <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Steps */}
              <div className="space-y-2">
                {analysisSteps.map((step, index) => (
                  <motion.div
                    key={step.key}
                    className={`flex items-center gap-3 p-2 rounded-lg ${index === currentStep ? 'bg-white/10' : ''}`}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: index <= currentStep ? 1 : 0.5 }}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      index < currentStep ? 'bg-green-500' : index === currentStep ? 'bg-yellow-500' : 'bg-white/20'
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
                  className="w-10 h-10 mx-auto mb-2 rounded-full bg-green-500 flex items-center justify-center"
                >
                  <Check className="w-5 h-5 text-white" />
                </motion.div>
                <h4 className="text-white font-semibold text-sm">{t.complete}</h4>
              </div>

              {/* Metrics */}
              <div>
                <div className="text-xs text-yellow-400 font-medium mb-2 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {t.metrics}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {selectedScenario?.metrics.slice(0, visibleMetrics).map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 rounded-lg p-2 text-center border border-white/10"
                    >
                      <p className="text-gray-400 text-[10px] truncate">{metric.label[language]}</p>
                      <p className="text-white font-bold text-sm">{metric.value}</p>
                      <div className={`flex items-center justify-center gap-0.5 text-[10px] ${metric.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {metric.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {metric.change}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div>
                <div className="text-xs text-yellow-400 font-medium mb-2">{t.chart}</div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10 h-24">
                  <MiniChart type={selectedScenario?.chartType || 'line'} color="#f59e0b" />
                </div>
              </div>

              {/* AI Insights */}
              <div>
                <div className="text-xs text-yellow-400 font-medium mb-2 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  {t.insights}
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {insights.slice(0, visibleInsights).map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-2 border border-yellow-500/20 flex items-start gap-2"
                    >
                      <div className="w-4 h-4 rounded-full bg-yellow-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] text-yellow-400">{index + 1}</span>
                      </div>
                      <p className="text-white text-[11px] leading-tight">{insight}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleRestart}
                  className="w-full py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg text-[13px] font-medium flex items-center justify-center gap-2 hover:opacity-90"
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
