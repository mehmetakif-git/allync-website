import React, { useState, useRef, useEffect, useMemo, memo } from 'react';
import { Video as LucideIcon, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { GlowingEffect } from '../ui/GlowingEffect';
import { useOutsideClick } from '../../hooks/use-outside-click';
import { ServiceDetailModal } from '../ServiceDetailModal';
import logoSvg from '../../assets/logo.svg';
import soundWavesAnimation from '../../assets/sound-waves.json';
import { TextGenerateEffect } from '../ui/TextGenerateEffect';
import { useSoundEffect } from '../../contexts/SoundEffectContext';
import { IPhoneMockup } from '../ui/IPhoneMockup';
import { WhatsAppDemo } from '../ui/WhatsAppDemo';
import { InstagramDemo } from '../ui/InstagramDemo';
import { TextToVideoDemo } from '../ui/TextToVideoDemo';
import { TextToImageDemo } from '../ui/TextToImageDemo';
import { VoiceCloningDemo } from '../ui/VoiceCloningDemo';
import { DocumentAIDemo } from '../ui/DocumentAIDemo';
import { ImageToVideoDemo } from '../ui/ImageToVideoDemo';
import { VideoToVideoDemo } from '../ui/VideoToVideoDemo';
import { DataAnalysisDemo } from '../ui/DataAnalysisDemo';
import { CustomAIDemo } from '../ui/CustomAIDemo';
import { BrowserMockup } from '../ui/BrowserMockup';
import { EcommerceDemo } from '../ui/EcommerceDemo';
import { CorporateDemo } from '../ui/CorporateDemo';
import { MobileAppDemo } from '../ui/MobileAppDemo';
import { DigitalMarketingDemo } from '../ui/DigitalMarketingDemo';
import { IoTDemo } from '../ui/IoTDemo';
import { CloudDemo } from '../ui/CloudDemo';
import { UIUXDemo } from '../ui/UIUXDemo';
import { MaintenanceDemo } from '../ui/MaintenanceDemo';
import { IPhoneMockup as MobileIPhoneMockup } from '../ui/IPhoneMockup';
import { getDemoThumbnail } from '../../assets/demo-thumbnails';

// Helper function to convert hex color to hue rotation
const getHueRotation = (hexColor: string): number => {
  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;

  if (max !== min) {
    const d = max - min;
    if (max === r) {
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      h = ((b - r) / d + 2) / 6;
    } else {
      h = ((r - g) / d + 4) / 6;
    }
  }

  // The Lottie animation is likely in a base color (blue/cyan around 180-200 deg)
  // We need to rotate from that base to the target hue
  const targetHue = h * 360;
  const baseHue = 200; // Assuming the original animation is cyan/blue
  return targetHue - baseHue;
};

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
  gradient: string;
  extendedContent: string;
  galleryImages: string[];
  glowColor?: string;
  audioSrc?: string;
  subtitles?: Array<{ start: number; text: string }>;
  demoType?: 'whatsapp' | 'instagram' | 'text-to-video' | 'text-to-image' | 'voice-cloning' | 'document-ai' | 'image-to-video' | 'video-to-video' | 'data-analysis' | 'custom-ai' | 'ecommerce' | 'corporate' | 'mobile-app' | 'digital-marketing' | 'iot' | 'cloud' | 'uiux' | 'maintenance';
}

interface ServiceCardProps {
  service: Service;
  language: 'tr' | 'en';
  isOdd: boolean;
  index: number;
  onDetailClick: () => void;
  onContactClick: () => void;
}

// Audio Modal Component - Full screen with logo and waveform
const AudioModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  themeColor: string;
}> = ({ isOpen, onClose, service, themeColor }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const lottieRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(-1);
  const { playBackSound, isMuted } = useSoundEffect();

  const handleClose = () => {
    playBackSound();
    onClose();
  };

  useEffect(() => {
    if (isOpen && audioRef.current && service.audioSrc) {
      audioRef.current.muted = isMuted;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      // Destroy Lottie animation to prevent memory leak
      if (lottieRef.current) {
        lottieRef.current.destroy();
        lottieRef.current = null;
      }
    };
  }, [isOpen, service.audioSrc, isMuted]);

  // Update muted state when isMuted changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Control Lottie animation based on isPlaying state
  useEffect(() => {
    if (lottieRef.current) {
      if (isPlaying) {
        lottieRef.current.play();
      } else {
        lottieRef.current.stop();
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);

      if (service.subtitles) {
        let newIndex = -1;
        for (let i = service.subtitles.length - 1; i >= 0; i--) {
          if (time >= service.subtitles[i].start) {
            newIndex = i;
            break;
          }
        }
        setCurrentSubtitleIndex(newIndex);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    handleClose();
  };

  const currentSubtitle = service.subtitles && currentSubtitleIndex >= 0
    ? service.subtitles[currentSubtitleIndex]?.text
    : '';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
          onClick={handleClose}
        >
          {/* Backdrop with glass blur */}
          <div
            className="absolute inset-0 backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}
          />

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleClose}
            className="absolute top-8 right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </motion.button>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {/* Audio element */}
            {service.audioSrc && (
              <audio
                ref={audioRef}
                src={service.audioSrc}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                preload="auto"
              />
            )}

            {/* Logo with waveform inside */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center"
            >
              {/* Glowing background */}
              <div
                className="absolute inset-0 rounded-full opacity-30"
                style={{
                  background: `radial-gradient(circle, ${themeColor}60 0%, transparent 70%)`,
                  filter: 'blur(40px)',
                }}
              />

              {/* Logo */}
              <motion.img
                src={logoSvg}
                alt="Allync Logo"
                className="absolute w-full h-full"
                style={{
                  filter: `drop-shadow(0 0 30px ${themeColor}) drop-shadow(0 0 60px ${themeColor}50)`,
                }}
                animate={{
                  filter: isPlaying
                    ? [
                        `drop-shadow(0 0 30px ${themeColor}) drop-shadow(0 0 60px ${themeColor}50)`,
                        `drop-shadow(0 0 50px ${themeColor}) drop-shadow(0 0 80px ${themeColor}70)`,
                        `drop-shadow(0 0 30px ${themeColor}) drop-shadow(0 0 60px ${themeColor}50)`,
                      ]
                    : `drop-shadow(0 0 30px ${themeColor}) drop-shadow(0 0 60px ${themeColor}50)`,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Lottie sound waves around logo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="absolute w-[200%] h-[200%]"
                  style={{
                    filter: `drop-shadow(0 0 10px ${themeColor}) drop-shadow(0 0 20px ${themeColor})`,
                  }}
                >
                  <Lottie
                    lottieRef={lottieRef}
                    animationData={soundWavesAnimation}
                    loop={true}
                    autoplay={false}
                    style={{
                      width: '100%',
                      height: '100%',
                      opacity: isPlaying ? 1 : 0.3,
                      filter: `hue-rotate(${getHueRotation(themeColor)}deg) saturate(1.5)`,
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Subtitle display with text generate effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 min-h-[100px] max-w-3xl px-4 flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                {currentSubtitle && (
                  <motion.div
                    key={currentSubtitleIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative px-8 py-5 rounded-2xl text-center"
                    style={{
                      background: `linear-gradient(135deg, ${themeColor}12 0%, ${themeColor}05 100%)`,
                      border: `1px solid ${themeColor}25`,
                      boxShadow: `0 8px 32px ${themeColor}15, inset 0 1px 0 ${themeColor}15`,
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    {/* Glow effect behind text */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-40"
                      style={{
                        background: `radial-gradient(ellipse at center, ${themeColor}15 0%, transparent 70%)`,
                      }}
                    />
                    <div className="relative z-10">
                      <TextGenerateEffect
                        words={currentSubtitle}
                        duration={0.3}
                        staggerDelay={0.08}
                        themeColor={themeColor}
                        className="text-center"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* No audio message */}
            {!service.audioSrc && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-center text-gray-400"
              >
                <p className="text-lg">Audio coming soon...</p>
              </motion.div>
            )}

            {/* Exit hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-gray-500 text-sm"
            >
              Press ESC or click anywhere to close
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AnimatedIcon = ({ IconComponent, glowColor }: { IconComponent: any, glowColor?: string }) => {
  const iconRef = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    if (iconRef.current) {
      const pathElements = iconRef.current.querySelectorAll('path, circle, line, polyline, polygon, rect, ellipse');
      const pathData: string[] = [];
      pathElements.forEach((el) => {
        pathData.push(el.outerHTML);
      });
      setPaths(pathData);
    }
  }, []);

  return (
    <div className="relative">
      <IconComponent ref={iconRef} className="w-10 h-10 opacity-0 absolute" />
      <motion.svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="text-white"
        style={{
          filter: `drop-shadow(0 0 8px ${glowColor || 'currentColor'})`
        }}
      >
        {paths.map((pathHTML, index) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(pathHTML, 'text/html');
          const element = doc.body.firstChild as SVGElement;
          const tagName = element?.tagName.toLowerCase();

          if (tagName === 'path') {
            const d = element.getAttribute('d') || '';
            return (
              <motion.path
                key={index}
                d={d}
                variants={{
                  hidden: {
                    pathLength: 0,
                    opacity: 0
                  },
                  visible: {
                    pathLength: 1,
                    opacity: 1,
                    transition: {
                      pathLength: { duration: 1.5, ease: "easeInOut", delay: index * 0.1 },
                      opacity: { duration: 0.3, delay: index * 0.1 }
                    }
                  }
                }}
              />
            );
          } else if (tagName === 'circle') {
            const cx = element.getAttribute('cx') || '0';
            const cy = element.getAttribute('cy') || '0';
            const r = element.getAttribute('r') || '0';
            return (
              <motion.circle
                key={index}
                cx={cx}
                cy={cy}
                r={r}
                variants={{
                  hidden: {
                    pathLength: 0,
                    opacity: 0
                  },
                  visible: {
                    pathLength: 1,
                    opacity: 1,
                    transition: {
                      pathLength: { duration: 1.5, ease: "easeInOut", delay: index * 0.1 },
                      opacity: { duration: 0.3, delay: index * 0.1 }
                    }
                  }
                }}
              />
            );
          } else if (tagName === 'line') {
            const x1 = element.getAttribute('x1') || '0';
            const y1 = element.getAttribute('y1') || '0';
            const x2 = element.getAttribute('x2') || '0';
            const y2 = element.getAttribute('y2') || '0';
            return (
              <motion.line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                variants={{
                  hidden: {
                    pathLength: 0,
                    opacity: 0
                  },
                  visible: {
                    pathLength: 1,
                    opacity: 1,
                    transition: {
                      pathLength: { duration: 1.5, ease: "easeInOut", delay: index * 0.1 },
                      opacity: { duration: 0.3, delay: index * 0.1 }
                    }
                  }
                }}
              />
            );
          } else if (tagName === 'polyline') {
            const points = element.getAttribute('points') || '';
            return (
              <motion.polyline
                key={index}
                points={points}
                variants={{
                  hidden: {
                    pathLength: 0,
                    opacity: 0
                  },
                  visible: {
                    pathLength: 1,
                    opacity: 1,
                    transition: {
                      pathLength: { duration: 1.5, ease: "easeInOut", delay: index * 0.1 },
                      opacity: { duration: 0.3, delay: index * 0.1 }
                    }
                  }
                }}
              />
            );
          } else if (tagName === 'rect') {
            const x = element.getAttribute('x') || '0';
            const y = element.getAttribute('y') || '0';
            const width = element.getAttribute('width') || '0';
            const height = element.getAttribute('height') || '0';
            const rx = element.getAttribute('rx') || '0';
            return (
              <motion.rect
                key={index}
                x={x}
                y={y}
                width={width}
                height={height}
                rx={rx}
                variants={{
                  hidden: {
                    pathLength: 0,
                    opacity: 0
                  },
                  visible: {
                    pathLength: 1,
                    opacity: 1,
                    transition: {
                      pathLength: { duration: 1.5, ease: "easeInOut", delay: index * 0.1 },
                      opacity: { duration: 0.3, delay: index * 0.1 }
                    }
                  }
                }}
              />
            );
          } else if (tagName === 'polygon') {
            const points = element.getAttribute('points') || '';
            return (
              <motion.polygon
                key={index}
                points={points}
                variants={{
                  hidden: {
                    pathLength: 0,
                    opacity: 0
                  },
                  visible: {
                    pathLength: 1,
                    opacity: 1,
                    transition: {
                      pathLength: { duration: 1.5, ease: "easeInOut", delay: index * 0.1 },
                      opacity: { duration: 0.3, delay: index * 0.1 }
                    }
                  }
                }}
              />
            );
          } else if (tagName === 'ellipse') {
            const cx = element.getAttribute('cx') || '0';
            const cy = element.getAttribute('cy') || '0';
            const rx = element.getAttribute('rx') || '0';
            const ry = element.getAttribute('ry') || '0';
            return (
              <motion.ellipse
                key={index}
                cx={cx}
                cy={cy}
                rx={rx}
                ry={ry}
                variants={{
                  hidden: {
                    pathLength: 0,
                    opacity: 0
                  },
                  visible: {
                    pathLength: 1,
                    opacity: 1,
                    transition: {
                      pathLength: { duration: 1.5, ease: "easeInOut", delay: index * 0.1 },
                      opacity: { duration: 0.3, delay: index * 0.1 }
                    }
                  }
                }}
              />
            );
          }
          return null;
        })}
      </motion.svg>
    </div>
  );
};

export const ServiceCard: React.FC<ServiceCardProps> = memo(({
  service,
  language,
  isOdd,
  index,
  onDetailClick,
  onContactClick,
}) => {
  const Icon = service.icon;
  const { playBackSound, playHoldSound, stopHoldSound } = useSoundEffect();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Hold-to-listen state
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const demoModalRef = useRef<HTMLDivElement>(null);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const HOLD_DURATION = 1500;

  const closeGalleryModal = () => {
    playBackSound();
    setExpandedIndex(null);
  };

  useOutsideClick(modalRef, closeGalleryModal);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (expandedIndex === null) return;
      if (e.key === 'Escape') closeGalleryModal();
      if (e.key === 'ArrowLeft') setCurrentIndex(prev => prev === 0 ? service.galleryImages.length - 1 : prev - 1);
      if (e.key === 'ArrowRight') setCurrentIndex(prev => prev === service.galleryImages.length - 1 ? 0 : prev + 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedIndex, service.galleryImages.length]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (expandedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [expandedIndex]);

  const handleThumbnailClick = (idx: number) => {
    setExpandedIndex(idx);
    setCurrentIndex(idx);
  };

  // Hold handlers
  const startHold = () => {
    if (isAudioModalOpen) return;
    setIsHolding(true);
    setHoldProgress(0);
    playHoldSound();

    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setHoldProgress(progress);
    }, 16);

    holdTimerRef.current = setTimeout(() => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      stopHoldSound();
      setIsHolding(false);
      setHoldProgress(0);
      setIsAudioModalOpen(true);
    }, HOLD_DURATION);
  };

  const cancelHold = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    stopHoldSound();
    setIsHolding(false);
    setHoldProgress(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (leftSectionRef.current && isDesktop) {
      const rect = leftSectionRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && isDesktop) {
      startHold();
    }
  };

  const handleMouseUp = () => {
    cancelHold();
  };

  const handleMouseEnter = () => {
    setIsCardHovered(true);
  };

  const handleMouseLeave = () => {
    setIsCardHovered(false);
    cancelHold();
  };

  // Calculate card scale based on hold progress
  const cardScale = 1 + (holdProgress / 100) * 0.05;
  const tooltipText = language === 'tr' ? 'Dinlemek için basılı tut' : 'Hold to listen';
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (holdProgress / 100) * circumference;

  return (
    <motion.div
      className={`flex flex-col ${isOdd ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-6 sm:gap-8 lg:gap-12 items-center`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        ref={leftSectionRef}
        className="flex-1 w-full relative"
        style={{ cursor: isCardHovered && isDesktop ? 'none' : 'auto' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div
          className="w-full"
          style={{
            transform: `scale(${cardScale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.05s linear',
            willChange: isHolding ? 'transform' : 'auto',
          }}
        >
          <div
            className="bg-white/5 backdrop-blur-[6px] border border-white/10 rounded-3xl p-8 md:p-12 w-full h-full relative overflow-hidden"
          >
            <GlowingEffect
              color={service.glowColor}
              blur={20}
              borderWidth={1.8}
              spread={100}
              glow={false}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              movementDuration={2}
            />
            <AnimatePresence>
              {isCardHovered && isDesktop && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
                  animate={{ opacity: 0.2, scale: 1.5, x: '-50%', y: '-50%' }}
                  exit={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="absolute pointer-events-none z-10"
                  style={{
                    top: '50%',
                    left: '50%',
                    filter: `blur(0px) drop-shadow(0 0 20px ${service.glowColor || '#ffffff'}) drop-shadow(0 0 40px ${service.glowColor || '#ffffff'}) drop-shadow(0 0 60px ${service.glowColor || '#ffffff'})`,
                    mixBlendMode: 'screen'
                  }}
                >
                  <img
                    src={logoSvg}
                    alt="Allync Logo"
                    className="w-[180px] h-[180px]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="w-full relative z-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`w-20 h-20 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 relative z-20`}
              >
                {isDesktop ? (
                  <AnimatedIcon IconComponent={Icon} glowColor={service.glowColor} />
                ) : (
                  <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                )}
              </motion.div>
            </div>

            <div className="w-full relative z-20">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {service.title}
              </h2>
            </div>

            <div className="w-full relative z-20">
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="w-full relative z-20">
              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {language === 'tr' ? 'Temel Özellikler' : 'Key Benefits'}
                </h3>
                {service.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start">
                    <div
                      className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient} mt-2 mr-3 flex-shrink-0 animate-[breathing_2s_ease-in-out_infinite]`}
                      style={{
                        boxShadow: `0 0 8px ${service.glowColor}, 0 0 12px ${service.glowColor}`
                      }}
                    ></div>
                    <p className="text-gray-300">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full relative z-20">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    if (isDesktop) {
                      setIsModalOpen(true);
                    } else {
                      onDetailClick();
                    }
                  }}
                  className={`flex-1 px-6 py-3 bg-gradient-to-r ${service.gradient} text-white font-semibold rounded-lg hover:scale-105 transition-transform animate-[breathing_2s_ease-in-out_infinite]`}
                  style={{
                    boxShadow: `0 0 12px ${service.glowColor}, 0 0 20px ${service.glowColor}`
                  }}
                >
                  {language === 'tr' ? 'Daha Detaylı İncele' : 'View More Details'}
                </button>
                <button
                  onClick={onContactClick}
                  className="w-full sm:w-auto sm:flex-1 min-w-[200px] px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 relative"
                >
                  <span className="relative z-10">
                    {language === 'tr' ? 'Özel Teklif İsteyin' : 'Request Custom Quote'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mouse-following tooltip with progress circle */}
        <AnimatePresence>
          {isCardHovered && isDesktop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute pointer-events-none z-[99999]"
              style={{
                left: mousePos.x,
                top: mousePos.y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Progress circle (visible when holding) */}
              {isHolding ? (
                <div className="relative flex items-center justify-center">
                  <svg width="100" height="100" className="transform -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="4"
                      fill="none"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke={service.glowColor || '#00d9ff'}
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      style={{
                        filter: `drop-shadow(0 0 8px ${service.glowColor || '#00d9ff'})`,
                      }}
                    />
                  </svg>
                  <span className="absolute text-white text-2xl">🎧</span>
                </div>
              ) : (
                <div
                  className="px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap text-white flex items-center gap-2"
                  style={{
                    background: '#1a1a2e',
                    boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5), 0 0 20px ${service.glowColor || '#00d9ff'}40`,
                    border: `2px solid ${service.glowColor || '#00d9ff'}`,
                  }}
                >
                  <span>🎧</span>
                  {tooltipText}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 w-full min-w-0 overflow-hidden">
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-[6px] border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-5 lg:p-6 hover:border-white/20 w-full relative pointer-events-auto cursor-pointer overflow-hidden">
          <GlowingEffect
            color={service.glowColor}
            blur={0}
            borderWidth={1}
            spread={80}
            glow={false}
            disabled={false}
            proximity={0}
            inactiveZone={0.7}
            movementDuration={2}
          />
          <div className="relative z-10 w-full overflow-hidden rounded-lg sm:rounded-xl" style={{ paddingBottom: '56.25%' }}>
            {/* Demo View for services with demoType */}
            {service.demoType ? (
              <motion.button
                onClick={() => setIsDemoModalOpen(true)}
                className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center cursor-pointer overflow-hidden rounded-lg sm:rounded-xl"
                whileTap={{ scale: 0.98 }}
              >
                {/* Thumbnail image if available */}
                {getDemoThumbnail(service.demoType) && (
                  <img
                    src={getDemoThumbnail(service.demoType)!}
                    alt={`${service.title} demo`}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                )}

                {/* Overlay gradient */}
                <div
                  className={`absolute inset-0 ${getDemoThumbnail(service.demoType) ? 'bg-black/40' : 'opacity-20'}`}
                  style={!getDemoThumbnail(service.demoType) ? {
                    background: `radial-gradient(circle at center, ${service.glowColor || '#00d9ff'}40 0%, transparent 70%)`
                  } : undefined}
                />

                {/* Play icon */}
                <motion.div
                  className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mb-2"
                  style={{
                    background: `linear-gradient(135deg, ${service.glowColor || '#00d9ff'}30, ${service.glowColor || '#00d9ff'}10)`,
                    border: `2px solid ${service.glowColor || '#00d9ff'}50`,
                    boxShadow: `0 0 30px ${service.glowColor || '#00d9ff'}30`,
                    backdropFilter: 'blur(8px)'
                  }}
                  animate={{
                    boxShadow: [
                      `0 0 20px ${service.glowColor || '#00d9ff'}20`,
                      `0 0 40px ${service.glowColor || '#00d9ff'}40`,
                      `0 0 20px ${service.glowColor || '#00d9ff'}20`,
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Play
                    className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ml-0.5"
                    style={{
                      color: service.glowColor?.replace('0.5)', '1)') || '#00d9ff',
                      filter: `drop-shadow(0 0 8px ${service.glowColor || '#00d9ff'})`
                    }}
                    fill={service.glowColor?.replace('0.5)', '1)') || '#00d9ff'}
                  />
                </motion.div>

                {/* Text */}
                <p className="relative z-10 text-white font-semibold text-sm sm:text-base lg:text-lg drop-shadow-lg">
                  {language === 'tr' ? 'Aksiyonda Gör' : 'View in Action'}
                </p>
                <p className="relative z-10 text-gray-300 text-xs sm:text-sm mt-1 drop-shadow-lg">
                  {language === 'tr' ? 'Canlı demo izle' : 'Watch live demo'}
                </p>
              </motion.button>
            ) : service.galleryImages && service.galleryImages.length > 0 ? (
              <motion.button
                layoutId={`gallery-${service.title}-0`}
                onClick={() => handleThumbnailClick(0)}
                className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer overflow-hidden rounded-lg sm:rounded-xl group"
              >
                <img
                  src={service.galleryImages[0]}
                  alt={`${service.title} preview`}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <p className="text-white font-semibold text-xs sm:text-sm lg:text-base opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    {language === 'tr' ? 'Galeriyi Görüntüle' : 'View Gallery'}
                  </p>
                </div>
              </motion.button>
            ) : (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center rounded-lg sm:rounded-xl">
                <p className="text-gray-500 text-xs sm:text-sm">{language === 'tr' ? 'Görsel Yok' : 'No Image'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {expandedIndex !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99998]"
            />
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-6xl transform-gpu"
              >
                <button
                  onClick={closeGalleryModal}
                  className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all z-[100000]"
                >
                  <X className="w-6 h-6 text-white" />
                </button>

                <motion.div
                  layoutId={`gallery-${service.title}-${expandedIndex}`}
                  className="aspect-video bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center relative overflow-hidden group"
                >
                  <img
                    src={service.galleryImages[currentIndex]}
                    alt={`${service.title} preview`}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 group-hover:blur-sm transition-all duration-300"
                  />
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <p className="text-white text-3xl font-bold">{service.galleryImages[currentIndex]}</p>
                    <p className="text-gray-300 text-base mt-2">{language === 'tr' ? 'Görsel' : 'Image'} {currentIndex + 1} / {service.galleryImages.length}</p>
                  </div>
                </motion.div>

                {service.galleryImages.length > 1 && isDesktop && (
                  <>
                    <button
                      onClick={() => setCurrentIndex(prev => prev === 0 ? service.galleryImages.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={() => setCurrentIndex(prev => prev === service.galleryImages.length - 1 ? 0 : prev + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                  </>
                )}

                <div className="flex gap-2 mt-8 justify-center overflow-x-auto pb-4 pt-1">
                  {service.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg bg-white/5 border-2 flex items-center justify-center transition-all ${
                        idx === currentIndex ? 'border-white scale-110' : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <span className="text-xs text-gray-400">{idx + 1}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <ServiceDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={service.title}
        extendedContent={service.extendedContent}
        gradient={service.gradient}
        ctaText={language === 'tr' ? 'Özel Teklif İsteyin' : 'Request Custom Quote'}
        onCtaClick={onContactClick}
      />

      {/* Audio Modal */}
      <AudioModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        service={service}
        themeColor={service.glowColor || '#00d9ff'}
      />

      {/* Demo Modal - WhatsApp Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'whatsapp' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
            onClick={() => {
              playBackSound();
              setIsDemoModalOpen(false);
            }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                playBackSound();
                setIsDemoModalOpen(false);
              }}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[100001]"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              ref={demoModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-[100000] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-xl md:text-2xl font-bold mb-6 text-center"
              >
                {language === 'tr' ? 'WhatsApp Otomasyon Demo' : 'WhatsApp Automation Demo'}
              </motion.h3>

              {/* iPhone Mockup with WhatsApp Demo */}
              <IPhoneMockup className="max-w-[360px] w-full">
                <WhatsAppDemo
                  language={language}
                  onContactClick={() => {
                    setIsDemoModalOpen(false);
                    onContactClick();
                  }}
                />
              </IPhoneMockup>

              {/* Bottom hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-gray-500 text-sm text-center"
              >
                {language === 'tr' ? 'Demo otomatik olarak oynatılıyor' : 'Demo plays automatically'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Modal - Instagram Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'instagram' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
            onClick={() => {
              playBackSound();
              setIsDemoModalOpen(false);
            }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                playBackSound();
                setIsDemoModalOpen(false);
              }}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[100001]"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              ref={demoModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-[100000] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-xl md:text-2xl font-bold mb-6 text-center"
              >
                {language === 'tr' ? 'Instagram Otomasyon Demo' : 'Instagram Automation Demo'}
              </motion.h3>

              {/* iPhone Mockup with Instagram Demo */}
              <IPhoneMockup className="max-w-[360px] w-full">
                <InstagramDemo
                  language={language}
                  onContactClick={() => {
                    setIsDemoModalOpen(false);
                    onContactClick();
                  }}
                />
              </IPhoneMockup>

              {/* Bottom hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-gray-500 text-sm text-center"
              >
                {language === 'tr' ? 'Demo otomatik olarak oynatılıyor' : 'Demo plays automatically'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Modal - Text-to-Video Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'text-to-video' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
            onClick={() => {
              playBackSound();
              setIsDemoModalOpen(false);
            }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                playBackSound();
                setIsDemoModalOpen(false);
              }}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[100001]"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              ref={demoModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-[100000] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-xl md:text-2xl font-bold mb-6 text-center"
              >
                {language === 'tr' ? 'Text-to-Video AI Demo' : 'Text-to-Video AI Demo'}
              </motion.h3>

              {/* iPhone Mockup with Text-to-Video Demo */}
              <IPhoneMockup className="max-w-[360px] w-full">
                <TextToVideoDemo
                  language={language}
                  onContactClick={() => {
                    setIsDemoModalOpen(false);
                    onContactClick();
                  }}
                />
              </IPhoneMockup>

              {/* Bottom hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-gray-500 text-sm text-center"
              >
                {language === 'tr' ? 'Senaryo seçin ve izleyin' : 'Select a scenario and watch'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Modal - Text-to-Image Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'text-to-image' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
            onClick={() => {
              playBackSound();
              setIsDemoModalOpen(false);
            }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                playBackSound();
                setIsDemoModalOpen(false);
              }}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[100001]"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              ref={demoModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-[100000] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-xl md:text-2xl font-bold mb-6 text-center"
              >
                {language === 'tr' ? 'Text-to-Image AI Demo' : 'Text-to-Image AI Demo'}
              </motion.h3>

              {/* iPhone Mockup with Text-to-Image Demo */}
              <IPhoneMockup className="max-w-[360px] w-full">
                <TextToImageDemo
                  language={language}
                  onContactClick={() => {
                    setIsDemoModalOpen(false);
                    onContactClick();
                  }}
                />
              </IPhoneMockup>

              {/* Bottom hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-gray-500 text-sm text-center"
              >
                {language === 'tr' ? 'Senaryo seçin ve izleyin' : 'Select a scenario and watch'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Modal - Voice Cloning Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'voice-cloning' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
            onClick={() => {
              playBackSound();
              setIsDemoModalOpen(false);
            }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                playBackSound();
                setIsDemoModalOpen(false);
              }}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[100001]"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              ref={demoModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-[100000] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-xl md:text-2xl font-bold mb-6 text-center"
              >
                {language === 'tr' ? 'Ses Klonlama AI Demo' : 'Voice Cloning AI Demo'}
              </motion.h3>

              {/* iPhone Mockup with Voice Cloning Demo */}
              <IPhoneMockup className="max-w-[360px] w-full">
                <VoiceCloningDemo
                  language={language}
                  onContactClick={() => {
                    setIsDemoModalOpen(false);
                    onContactClick();
                  }}
                />
              </IPhoneMockup>

              {/* Bottom hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-gray-500 text-sm text-center"
              >
                {language === 'tr' ? 'Senaryo seçin ve dinleyin' : 'Select a scenario and listen'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Modal - Document AI Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'document-ai' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
            onClick={() => {
              playBackSound();
              setIsDemoModalOpen(false);
            }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                playBackSound();
                setIsDemoModalOpen(false);
              }}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[100001]"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              ref={demoModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-[100000] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-xl md:text-2xl font-bold mb-6 text-center"
              >
                {language === 'tr' ? 'Document AI Demo' : 'Document AI Demo'}
              </motion.h3>

              {/* iPhone Mockup with Document AI Demo */}
              <IPhoneMockup className="max-w-[360px] w-full">
                <DocumentAIDemo
                  language={language}
                  onContactClick={() => {
                    setIsDemoModalOpen(false);
                    onContactClick();
                  }}
                />
              </IPhoneMockup>

              {/* Bottom hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-gray-500 text-sm text-center"
              >
                {language === 'tr' ? 'Belge türü seçin ve izleyin' : 'Select document type and watch'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Modal - Image to Video Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'image-to-video' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
            onClick={() => {
              playBackSound();
              setIsDemoModalOpen(false);
            }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                playBackSound();
                setIsDemoModalOpen(false);
              }}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[100001]"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              ref={demoModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-[100000] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-xl md:text-2xl font-bold mb-6 text-center"
              >
                {language === 'tr' ? 'Görselden Videoya AI Demo' : 'Image to Video AI Demo'}
              </motion.h3>

              {/* iPhone Mockup with Image to Video Demo */}
              <IPhoneMockup className="max-w-[360px] w-full">
                <ImageToVideoDemo
                  language={language}
                  onContactClick={() => {
                    setIsDemoModalOpen(false);
                    onContactClick();
                  }}
                />
              </IPhoneMockup>

              {/* Bottom hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-gray-500 text-sm text-center"
              >
                {language === 'tr' ? 'Animasyon türü seçin ve izleyin' : 'Select animation type and watch'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Modal - Video to Video Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'video-to-video' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
            onClick={() => {
              playBackSound();
              setIsDemoModalOpen(false);
            }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                playBackSound();
                setIsDemoModalOpen(false);
              }}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[100001]"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              ref={demoModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-[100000] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-xl md:text-2xl font-bold mb-6 text-center"
              >
                {language === 'tr' ? 'Videodan Videoya AI Demo' : 'Video to Video AI Demo'}
              </motion.h3>

              {/* iPhone Mockup with Video to Video Demo */}
              <IPhoneMockup className="max-w-[360px] w-full">
                <VideoToVideoDemo
                  language={language}
                  onContactClick={() => {
                    setIsDemoModalOpen(false);
                    onContactClick();
                  }}
                />
              </IPhoneMockup>

              {/* Bottom hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-gray-500 text-sm text-center"
              >
                {language === 'tr' ? 'Dönüşüm türü seçin ve izleyin' : 'Select transformation type and watch'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Modal - Data Analysis Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'data-analysis' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
            onClick={() => {
              playBackSound();
              setIsDemoModalOpen(false);
            }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                playBackSound();
                setIsDemoModalOpen(false);
              }}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[100001]"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              ref={demoModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-[100000] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-xl md:text-2xl font-bold mb-6 text-center"
              >
                {language === 'tr' ? 'Veri Analizi AI Demo' : 'Data Analysis AI Demo'}
              </motion.h3>

              {/* iPhone Mockup with Data Analysis Demo */}
              <IPhoneMockup className="max-w-[360px] w-full">
                <DataAnalysisDemo
                  language={language}
                  onContactClick={() => {
                    setIsDemoModalOpen(false);
                    onContactClick();
                  }}
                />
              </IPhoneMockup>

              {/* Bottom hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-gray-500 text-sm text-center"
              >
                {language === 'tr' ? 'Analiz türü seçin ve izleyin' : 'Select analysis type and watch'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Modal - Custom AI Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'custom-ai' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
            onClick={() => {
              playBackSound();
              setIsDemoModalOpen(false);
            }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                playBackSound();
                setIsDemoModalOpen(false);
              }}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[100001]"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              ref={demoModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-[100000] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-xl md:text-2xl font-bold mb-6 text-center"
              >
                {language === 'tr' ? 'Özel AI Çözümleri Demo' : 'Custom AI Solutions Demo'}
              </motion.h3>

              {/* iPhone Mockup with Custom AI Demo */}
              <IPhoneMockup className="max-w-[360px] w-full">
                <CustomAIDemo
                  language={language}
                  onContactClick={() => {
                    setIsDemoModalOpen(false);
                    onContactClick();
                  }}
                />
              </IPhoneMockup>

              {/* Bottom hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-gray-500 text-sm text-center"
              >
                {language === 'tr' ? 'Sektör ve özellik seçin' : 'Select industry and features'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Modal - E-commerce Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'ecommerce' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-2 md:p-4"
            onClick={() => {
              playBackSound();
              setIsDemoModalOpen(false);
            }}
          >
            {/* Backdrop - visual only */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                playBackSound();
                setIsDemoModalOpen(false);
              }}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[100001]"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Modal Content - pointer-events-none so clicks pass through, children have pointer-events-auto */}
            <motion.div
              ref={demoModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-[100000] flex flex-col items-center pointer-events-none"
            >
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-xl md:text-2xl font-bold mb-4 text-center pointer-events-auto"
              >
                {language === 'tr' ? 'E-Ticaret Web Sitesi Demo' : 'E-commerce Website Demo'}
              </motion.h3>

              {/* Browser Mockup with E-commerce Demo */}
              <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                <BrowserMockup
                  url="shop.allyncai.com"
                  themeColor={service.glowColor?.replace('0.5)', '1)') || '#22C55E'}
                >
                <EcommerceDemo
                  language={language}
                  onContactClick={() => {
                    setIsDemoModalOpen(false);
                    onContactClick();
                  }}
                />
              </BrowserMockup>
              </div>

              {/* Bottom hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-gray-500 text-sm text-center pointer-events-auto"
              >
                {language === 'tr' ? 'Ürünlere tıklayın, sepete ekleyin ve alışverişi tamamlayın' : 'Click products, add to cart, and complete your shopping'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Modal - Corporate Website Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'corporate' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-2 md:p-4"
            onClick={() => {
              playBackSound();
              setIsDemoModalOpen(false);
            }}
          >
            {/* Backdrop - visual only */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                playBackSound();
                setIsDemoModalOpen(false);
              }}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[100001]"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              ref={demoModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-[100000] flex flex-col items-center pointer-events-none"
            >
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-xl md:text-2xl font-bold mb-4 text-center pointer-events-auto"
              >
                {language === 'tr' ? 'Kurumsal Web Sitesi Demo' : 'Corporate Website Demo'}
              </motion.h3>

              {/* Browser Mockup with Corporate Demo */}
              <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                <BrowserMockup
                  url="commercial.allyncai.com"
                  themeColor={service.glowColor?.replace('0.5)', '1)') || '#3B82F6'}
                >
                  <CorporateDemo
                    language={language}
                    onContactClick={() => {
                      setIsDemoModalOpen(false);
                      onContactClick();
                    }}
                  />
                </BrowserMockup>
              </div>

              {/* Bottom hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-gray-500 text-sm text-center pointer-events-auto"
              >
                {language === 'tr' ? 'Sayfalar arasında gezinin ve iletişim formunu deneyin' : 'Navigate between pages and try the contact form'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Modal - Mobile App Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'mobile-app' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-2 md:p-4"
            onClick={() => {
              playBackSound();
              setIsDemoModalOpen(false);
            }}
          >
            {/* Backdrop - visual only */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                playBackSound();
                setIsDemoModalOpen(false);
              }}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[100001]"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              ref={demoModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-[100000] flex flex-col items-center pointer-events-none"
            >
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-xl md:text-2xl font-bold mb-4 text-center pointer-events-auto"
              >
                {language === 'tr' ? 'Mobil Uygulama Yapılandırıcı' : 'Mobile App Builder'}
              </motion.h3>

              {/* iPhone Mockup with Mobile App Demo */}
              <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                <MobileIPhoneMockup
                  themeColor={service.glowColor?.replace('0.5)', '1)') || '#D946EF'}
                  hideNotch={false}
                >
                  <MobileAppDemo
                    language={language}
                    onContactClick={() => {
                      setIsDemoModalOpen(false);
                      onContactClick();
                    }}
                  />
                </MobileIPhoneMockup>
              </div>

              {/* Bottom hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-gray-500 text-sm text-center pointer-events-auto"
              >
                {language === 'tr' ? 'Uygulama tipini ve özellikleri seçerek fiyat tahmini alın' : 'Select app type and features to get a price estimate'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Modal - Digital Marketing Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'digital-marketing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-2 md:p-4"
            onClick={() => {
              playBackSound();
              setIsDemoModalOpen(false);
            }}
          >
            {/* Backdrop - visual only */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                playBackSound();
                setIsDemoModalOpen(false);
              }}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[100001]"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              ref={demoModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-[100000] flex flex-col items-center pointer-events-none"
            >
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-xl md:text-2xl font-bold mb-4 text-center pointer-events-auto"
              >
                {language === 'tr' ? 'Dijital Pazarlama Dashboard' : 'Digital Marketing Dashboard'}
              </motion.h3>

              {/* iPhone Mockup with Digital Marketing Demo */}
              <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                <MobileIPhoneMockup
                  themeColor={service.glowColor?.replace('0.5)', '1)') || '#F97316'}
                  hideNotch={false}
                >
                  <DigitalMarketingDemo
                    language={language}
                    onContactClick={() => {
                      setIsDemoModalOpen(false);
                      onContactClick();
                    }}
                  />
                </MobileIPhoneMockup>
              </div>

              {/* Bottom hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-gray-500 text-sm text-center pointer-events-auto"
              >
                {language === 'tr' ? 'Kampanya metrikleri ve analitik verilerinizi görün' : 'View campaign metrics and analytics data'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Modal - IoT Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'iot' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-2 md:p-4"
            onClick={() => {
              playBackSound();
              setIsDemoModalOpen(false);
            }}
          >
            {/* Backdrop - visual only */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                playBackSound();
                setIsDemoModalOpen(false);
              }}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[100001]"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              ref={demoModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-[100000] flex flex-col items-center pointer-events-none"
            >
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-xl md:text-2xl font-bold mb-4 text-center pointer-events-auto"
              >
                {language === 'tr' ? 'IoT Akıllı Ev Dashboard' : 'IoT Smart Home Dashboard'}
              </motion.h3>

              {/* iPhone Mockup with IoT Demo */}
              <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                <MobileIPhoneMockup
                  themeColor={service.glowColor?.replace('0.5)', '1)') || '#14B8A6'}
                  hideNotch={false}
                >
                  <IoTDemo
                    language={language}
                    onContactClick={() => {
                      setIsDemoModalOpen(false);
                      onContactClick();
                    }}
                  />
                </MobileIPhoneMockup>
              </div>

              {/* Bottom hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-gray-500 text-sm text-center pointer-events-auto"
              >
                {language === 'tr' ? 'Cihazları kontrol edin ve sensör verilerini görün' : 'Control devices and view sensor data'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Modal - Cloud Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'cloud' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-2 md:p-4"
            onClick={() => {
              playBackSound();
              setIsDemoModalOpen(false);
            }}
          >
            {/* Backdrop - visual only */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                playBackSound();
                setIsDemoModalOpen(false);
              }}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[100001]"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              ref={demoModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-[100000] flex flex-col items-center pointer-events-none"
            >
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-xl md:text-2xl font-bold mb-4 text-center pointer-events-auto"
              >
                {language === 'tr' ? 'Cloud Console Dashboard' : 'Cloud Console Dashboard'}
              </motion.h3>

              {/* iPhone Mockup with Cloud Demo */}
              <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                <MobileIPhoneMockup
                  themeColor={service.glowColor?.replace('0.5)', '1)') || '#6366F1'}
                  hideNotch={false}
                >
                  <CloudDemo
                    language={language}
                    onContactClick={() => {
                      setIsDemoModalOpen(false);
                      onContactClick();
                    }}
                  />
                </MobileIPhoneMockup>
              </div>

              {/* Bottom hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-gray-500 text-sm text-center pointer-events-auto"
              >
                {language === 'tr' ? 'Sunucuları yönetin ve deployment durumunu görün' : 'Manage servers and view deployment status'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Modal - UI/UX Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'uiux' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-2 md:p-4"
            onClick={() => {
              playBackSound();
              setIsDemoModalOpen(false);
            }}
          >
            {/* Backdrop - visual only */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                playBackSound();
                setIsDemoModalOpen(false);
              }}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[100001]"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              ref={demoModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-[100000] flex flex-col items-center pointer-events-none"
            >
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-xl md:text-2xl font-bold mb-4 text-center pointer-events-auto"
              >
                {language === 'tr' ? 'Design System Önizleme' : 'Design System Preview'}
              </motion.h3>

              {/* iPhone Mockup with UI/UX Demo */}
              <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                <MobileIPhoneMockup
                  themeColor={service.glowColor?.replace('0.5)', '1)') || '#C026D3'}
                  hideNotch={false}
                >
                  <UIUXDemo
                    language={language}
                    onContactClick={() => {
                      setIsDemoModalOpen(false);
                      onContactClick();
                    }}
                  />
                </MobileIPhoneMockup>
              </div>

              {/* Bottom hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-gray-500 text-sm text-center pointer-events-auto"
              >
                {language === 'tr' ? 'Renk paletleri, tipografi ve bileşenleri keşfedin' : 'Explore color palettes, typography and components'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Modal - Maintenance Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'maintenance' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-2 md:p-4"
            onClick={() => {
              playBackSound();
              setIsDemoModalOpen(false);
            }}
          >
            {/* Backdrop - visual only */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => {
                playBackSound();
                setIsDemoModalOpen(false);
              }}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[100001]"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Modal Content */}
            <motion.div
              ref={demoModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-[100000] flex flex-col items-center pointer-events-none"
            >
              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-xl md:text-2xl font-bold mb-4 text-center pointer-events-auto"
              >
                {language === 'tr' ? 'Bakım ve Destek Paneli' : 'Maintenance & Support Panel'}
              </motion.h3>

              {/* iPhone Mockup with Maintenance Demo */}
              <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                <MobileIPhoneMockup
                  themeColor={service.glowColor?.replace('0.5)', '1)') || '#6B7280'}
                  hideNotch={false}
                >
                  <MaintenanceDemo
                    language={language}
                    onContactClick={() => {
                      setIsDemoModalOpen(false);
                      onContactClick();
                    }}
                  />
                </MobileIPhoneMockup>
              </div>

              {/* Bottom hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-gray-500 text-sm text-center pointer-events-auto"
              >
                {language === 'tr' ? 'Sistem durumu ve destek taleplerini yönetin' : 'Manage system status and support tickets'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
});
