import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import logoSvg from '../assets/logo.svg';
import { ANIMATION_DELAYS } from '../constants/animations';
import { MultiStepLoader } from './ui/MultiStepLoader';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
  language?: 'tr' | 'en';
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete, language = 'tr' }) => {
  const [progress, setProgress] = useState(0);
  const [logoVisible, setLogoVisible] = useState(false);
  const [sloganText, setSloganText] = useState('');
  const [showSkip, setShowSkip] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const typeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sloganTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fullSlogan = "Beyond Human Automation";

  const loadingStates = [
    { text: language === 'tr' ? "AI Sistemleri Başlatılıyor..." : "Initializing AI Systems..." },
    { text: language === 'tr' ? "Çözümler Yükleniyor..." : "Loading Solutions..." },
    { text: language === 'tr' ? "Dashboard Hazırlanıyor..." : "Preparing Dashboard..." },
    { text: language === 'tr' ? "Neredeyse Hazır..." : "Almost Ready..." }
  ];

  useEffect(() => {
    // Logo animation
    setTimeout(() => setLogoVisible(true), ANIMATION_DELAYS.MODAL_ANIMATION);

    // Slogan typewriter effect
    sloganTimeoutRef.current = setTimeout(() => {
      let index = 0;
      typeIntervalRef.current = setInterval(() => {
        if (index < fullSlogan.length) {
          setSloganText(fullSlogan.slice(0, index + 1));
          index++;
        } else {
          if (typeIntervalRef.current) {
            clearInterval(typeIntervalRef.current);
            typeIntervalRef.current = null;
          }
        }
      }, ANIMATION_DELAYS.TYPING_SPEED);
    }, 1200);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsExiting(true);
            // Wait for fade animation to complete
            setTimeout(onLoadingComplete, 800);
          }, ANIMATION_DELAYS.ENABLE_ANIMATIONS);
          return 100;
        }
        return prev + 2;
      });
    }, ANIMATION_DELAYS.TYPING_SPEED);

    return () => {
      clearInterval(progressInterval);
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
      }
      if (sloganTimeoutRef.current) {
        clearTimeout(sloganTimeoutRef.current);
        sloganTimeoutRef.current = null;
      }
    };
  }, [onLoadingComplete]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(onLoadingComplete, 800);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Glassmorphism Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        <div className="loading-gradient"></div>
      </div>

      {/* Skip Button */}
      {showSkip && (
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 z-20 text-gray-400 hover:text-white transition-colors duration-300 text-sm"
        >
          Skip →
        </button>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo */}
        <div className={`loading-logo ${logoVisible ? 'visible' : ''}`}>
          <div className="flex items-center mb-8">
            <img src={logoSvg} alt="Allync" className="w-16 h-16 mr-4 logo-glow-pulse" />
            <span className="text-5xl font-bold text-white glitch-logo" data-text="Allync">
              Allync
            </span>
          </div>
        </div>

        {/* Slogan */}
        <div className="mb-12 h-8">
          <p className="text-xl text-gray-300 font-mono typewriter-slogan">
            {sloganText}
            <span className="cursor-blink">|</span>
          </p>
        </div>

        {/* Multi Step Loader */}
        <div className="w-full max-w-md">
          <MultiStepLoader
            loadingStates={loadingStates}
            loading={true}
            duration={1200}
            loop={false}
          />
        </div>

        {/* Floating Shapes */}
        <div className="loading-shapes">
          <div className="loading-shape loading-shape-1"></div>
          <div className="loading-shape loading-shape-2"></div>
          <div className="loading-shape loading-shape-3"></div>
        </div>
      </div>
    </motion.div>
  );
};
