import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Play, Pause, Sparkles, Check, Mic, Volume2 } from 'lucide-react';
import { voiceCloningDemoScenarios, voiceCloningUIText, VoiceCloningDemoScenario } from '../../data/voiceCloningDemoScenarios';

// Demo Logo - same as other demos
import demoLogo from '../../assets/whatsapp-demo-logo.png';

interface VoiceCloningDemoProps {
  language: 'tr' | 'en';
  onContactClick?: () => void;
}

type DemoPhase = 'selecting' | 'typing' | 'generating' | 'complete';

// Progress steps for voice generation
const generationSteps = [
  { key: 'analyzing', duration: 1500 },
  { key: 'cloning', duration: 2000 },
  { key: 'synthesizing', duration: 2500 },
  { key: 'enhancing', duration: 1500 }
];

// Memoized bar heights to prevent recalculation on every render
const barHeights = Array.from({ length: 20 }, () => Math.random() * 40 + 20);

// Waveform visualization component - memoized to prevent unnecessary re-renders
const WaveformVisualizer = React.memo<{ isPlaying: boolean; color: string }>(({ isPlaying, color }) => {
  return (
    <div className="flex items-center justify-center gap-[3px] h-16">
      {barHeights.map((height, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ height: 8 }}
          animate={isPlaying ? {
            height: [8, height, 8],
          } : { height: 8 }}
          transition={{
            duration: 0.5,
            repeat: isPlaying ? Infinity : 0,
            delay: i * 0.05,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
});

export const VoiceCloningDemo: React.FC<VoiceCloningDemoProps> = ({ language, onContactClick }) => {
  const [selectedScenario, setSelectedScenario] = useState<VoiceCloningDemoScenario | null>(null);
  const [phase, setPhase] = useState<DemoPhase>('selecting');
  const [typedText, setTypedText] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { playBackSound } = useSoundEffect();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const t = voiceCloningUIText[language];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Initialize audio when scenario is selected and phase is complete
  useEffect(() => {
    if (phase === 'complete' && selectedScenario) {
      const audioSrc = selectedScenario.audioSrc?.[language];

      if (audioSrc) {
        // Create new audio element
        const audio = new Audio(audioSrc);
        audioRef.current = audio;

        // Named event handlers for proper cleanup
        const handleLoadedMetadata = () => {
          setAudioDuration(audio.duration);
        };

        const handleTimeUpdate = () => {
          setCurrentTime(audio.currentTime);
          if (audio.duration) {
            setPlaybackProgress((audio.currentTime / audio.duration) * 100);
          }
        };

        const handleEnded = () => {
          setIsPlaying(false);
          setPlaybackProgress(0);
          setCurrentTime(0);
        };

        const handleError = () => {
          console.log('Audio file not found, using simulated playback');
        };

        // Add event listeners
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);

        // Try to load the audio
        audio.load();

        // Cleanup function - remove all event listeners
        return () => {
          audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audio.removeEventListener('timeupdate', handleTimeUpdate);
          audio.removeEventListener('ended', handleEnded);
          audio.removeEventListener('error', handleError);
          audio.pause();
          audio.src = ''; // Release audio resource
          audioRef.current = null;
        };
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = ''; // Release audio resource
        audioRef.current = null;
      }
    };
  }, [phase, selectedScenario, language]);

  // Typing animation
  const startTypingAnimation = useCallback((text: string) => {
    let index = 0;
    setTypedText('');

    const typeChar = () => {
      if (index < text.length) {
        setTypedText(text.slice(0, index + 1));
        index++;
        timeoutRef.current = setTimeout(typeChar, 20 + Math.random() * 10);
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

  const handleScenarioSelect = (scenario: VoiceCloningDemoScenario) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSelectedScenario(scenario);
    setPhase('typing');
    setIsPlaying(false);
    setPlaybackProgress(0);
    setCurrentTime(0);
    setAudioDuration(0);
    startTypingAnimation(scenario.sampleText[language]);
  };

  const handleBack = () => {
    playBackSound();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSelectedScenario(null);
    setPhase('selecting');
    setTypedText('');
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
    setPlaybackProgress(0);
    setCurrentTime(0);
    setAudioDuration(0);
  };

  const handleRestart = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSelectedScenario(null);
    setPhase('selecting');
    setTypedText('');
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
    setPlaybackProgress(0);
    setCurrentTime(0);
    setAudioDuration(0);
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Reset if ended
        if (audioRef.current.ended) {
          audioRef.current.currentTime = 0;
        }
        audioRef.current.play().catch(() => {
          console.log('Audio playback failed');
        });
        setIsPlaying(true);
      }
    }
  };

  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Scenario Selection Screen
  if (phase === 'selecting') {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-[#1a0a0a] to-[#2e1a1a]">
        {/* Header */}
        <div className="px-4 py-3 pt-12 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl p-[2px] bg-gradient-to-br from-orange-500 to-red-600">
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
            {voiceCloningDemoScenarios.map((scenario) => (
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
                    {scenario.duration} • {scenario.voiceType}
                  </p>
                </div>
                <Mic className="w-5 h-5 text-orange-400" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Demo Screen (Typing, Generating, Complete)
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#1a0a0a] to-[#2e1a1a]">
      {/* Header */}
      <div className="px-2 py-2 pt-12 flex items-center gap-2 border-b border-white/10">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="w-9 h-9 rounded-xl p-[2px] bg-gradient-to-br from-orange-500 to-red-600 flex-shrink-0">
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
        {/* Sample Text Section */}
        <div className="mb-4">
          <div className="text-xs text-orange-400 font-medium mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {t.sampleText}
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-white text-[13px] leading-relaxed min-h-[60px]">
              {typedText}
              {phase === 'typing' && (
                <motion.span
                  className="inline-block w-0.5 h-4 bg-orange-400 ml-0.5"
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
                  className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Mic className="w-8 h-8 text-white" />
                </motion.div>
                <h4 className="text-white font-semibold">{t.generating}</h4>
                <p className="text-gray-400 text-sm">{t.generatingDesc}</p>
              </div>

              {/* Waveform Animation */}
              <div className="py-4">
                <WaveformVisualizer isPlaying={true} color="#f97316" />
              </div>

              {/* Progress Bar */}
              <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-600"
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
                          ? 'bg-orange-500'
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

          {/* Voice Result */}
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

              {/* Audio Player */}
              <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-4 border border-orange-500/20">
                {/* Waveform */}
                <div className="py-4">
                  <WaveformVisualizer isPlaying={isPlaying} color="#f97316" />
                </div>

                {/* Progress Bar */}
                <div className="bg-white/10 rounded-full h-1.5 overflow-hidden mb-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-600"
                    style={{ width: `${playbackProgress}%` }}
                  />
                </div>

                {/* Time Display */}
                <div className="flex justify-between text-xs text-gray-400 mb-4">
                  <span>{formatTime(currentTime)}</span>
                  <span>{audioDuration > 0 ? formatTime(audioDuration) : selectedScenario?.duration}</span>
                </div>

                {/* Play Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={togglePlayback}
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-1" />
                    )}
                  </button>
                </div>

                {/* Status */}
                <div className="text-center mt-3">
                  <p className="text-gray-400 text-sm">
                    {isPlaying ? t.playing : t.paused}
                  </p>
                </div>
              </div>

              {/* Voice Info */}
              <div className="flex gap-4">
                <div className="flex-1 bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs">{t.voiceType}</p>
                  <p className="text-white font-medium">{selectedScenario?.voiceType}</p>
                </div>
                <div className="flex-1 bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-gray-400 text-xs">{t.duration}</p>
                  <p className="text-white font-medium">{selectedScenario?.duration}</p>
                </div>
              </div>

              {/* Voice Comparison */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <Volume2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white text-sm flex-1">{t.originalVoice}</span>
                  <div className="w-20 h-1 bg-gray-600 rounded-full" />
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                    <Volume2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white text-sm flex-1">{t.clonedVoice}</span>
                  <motion.div
                    className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
                    animate={isPlaying ? { opacity: [1, 0.5, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleRestart}
                  className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg text-[13px] font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
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
