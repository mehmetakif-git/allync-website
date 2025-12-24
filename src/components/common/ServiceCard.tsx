import React, { useState, useRef, useEffect, useMemo, memo } from 'react';
import { Video as LucideIcon, X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlowingEffect } from '../ui/GlowingEffect';
import { useOutsideClick } from '../../hooks/use-outside-click';
import { ServiceDetailModal } from '../ServiceDetailModal';
import logoSvg from '../../assets/logo.svg';
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
// Note: CustomAIDemo import removed - using MobileCustomAIDemo and DesktopCustomAIDemo instead
import { BrowserMockup } from '../ui/BrowserMockup';
// Note: EcommerceDemo import removed - using MobileEcommerceDemo and DesktopEcommerceDemo instead
import { CorporateDemo } from '../ui/CorporateDemo';
import { MobileAppDemo } from '../ui/MobileAppDemo';
import { DigitalMarketingDemo } from '../ui/DigitalMarketingDemo';
import { IoTDemo } from '../ui/IoTDemo';
import { CloudDemo } from '../ui/CloudDemo';
import { UIUXDemo } from '../ui/UIUXDemo';
import { MaintenanceDemo } from '../ui/MaintenanceDemo';
import { MobileIPhoneMockup } from '../ui/MobileIPhoneMockup';
import { MobileWhatsAppDemo } from '../ui/MobileWhatsAppDemo';
import { DesktopWhatsAppDemo } from '../ui/DesktopWhatsAppDemo';
import { MobileInstagramDemo } from '../ui/MobileInstagramDemo';
import { DesktopInstagramDemo } from '../ui/DesktopInstagramDemo';
import { MobileTextToVideoDemo } from '../ui/MobileTextToVideoDemo';
import { DesktopTextToVideoDemo } from '../ui/DesktopTextToVideoDemo';
import { MobileTextToImageDemo } from '../ui/MobileTextToImageDemo';
import { DesktopTextToImageDemo } from '../ui/DesktopTextToImageDemo';
import { MobileVoiceCloningDemo } from '../ui/MobileVoiceCloningDemo';
import { DesktopVoiceCloningDemo } from '../ui/DesktopVoiceCloningDemo';
import { MobileDocumentAIDemo } from '../ui/MobileDocumentAIDemo';
import { DesktopDocumentAIDemo } from '../ui/DesktopDocumentAIDemo';
import { MobileImageToVideoDemo } from '../ui/MobileImageToVideoDemo';
import { DesktopImageToVideoDemo } from '../ui/DesktopImageToVideoDemo';
import { MobileVideoToVideoDemo } from '../ui/MobileVideoToVideoDemo';
import { DesktopVideoToVideoDemo } from '../ui/DesktopVideoToVideoDemo';
import { MobileDataAnalysisDemo } from '../ui/MobileDataAnalysisDemo';
import { DesktopDataAnalysisDemo } from '../ui/DesktopDataAnalysisDemo';
import { MobileCustomAIDemo } from '../ui/MobileCustomAIDemo';
import { DesktopCustomAIDemo } from '../ui/DesktopCustomAIDemo';
import { DesktopEcommerceDemo } from '../ui/DesktopEcommerceDemo';
import { MobileEcommerceDemo } from '../ui/MobileEcommerceDemo';
import { DesktopCorporateDemo } from '../ui/DesktopCorporateDemo';
import { getDemoThumbnail } from '../../assets/demo-thumbnails';

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
  const { playBackSound } = useSoundEffect();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isPlayHovered, setIsPlayHovered] = useState(false);
  const demoModalRef = useRef<HTMLDivElement>(null);

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
    if (expandedIndex !== null || isDemoModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [expandedIndex, isDemoModalOpen]);

  const handleThumbnailClick = (idx: number) => {
    setExpandedIndex(idx);
    setCurrentIndex(idx);
  };

  const handleMouseEnter = () => {
    setIsCardHovered(true);
  };

  const handleMouseLeave = () => {
    setIsCardHovered(false);
  };

  return (
    <motion.div
      className={`flex flex-col ${isOdd ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-6 sm:gap-8 lg:gap-12 items-center`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        className="flex-1 w-full relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-full">
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
      </div>

      <div className="flex-1 w-full min-w-0">
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-[6px] border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-5 lg:p-6 hover:border-white/20 w-full relative pointer-events-auto cursor-pointer">
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
          <div
            className="relative z-10 w-full aspect-video rounded-lg sm:rounded-xl overflow-hidden bg-gray-900"
            onMouseEnter={() => isDesktop && setIsPlayHovered(true)}
            onMouseLeave={() => isDesktop && setIsPlayHovered(false)}
          >
            {/* Demo View for services with demoType */}
            {service.demoType ? (
              <>
                {/* Thumbnail image - absolutely positioned background */}
                {getDemoThumbnail(service.demoType) && (
                  <img
                    src={getDemoThumbnail(service.demoType)!}
                    alt={`${service.title} demo`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease-out',
                      transform: isPlayHovered ? 'scale(1.08)' : 'scale(1)'
                    }}
                  />
                )}
                {/* Overlay gradient */}
                <div
                  className={`absolute inset-0 ${getDemoThumbnail(service.demoType) ? 'bg-black/40' : 'opacity-20'}`}
                  style={!getDemoThumbnail(service.demoType) ? {
                    background: `radial-gradient(circle at center, ${service.glowColor || '#00d9ff'}40 0%, transparent 70%)`
                  } : undefined}
                />
                {/* Clickable overlay with centered content */}
                <motion.button
                  onClick={() => setIsDemoModalOpen(true)}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                  whileTap={{ scale: 0.98 }}
                >
                {/* Backdrop container for play icon and text */}
                <div className="flex flex-col items-center justify-center px-6 py-4 rounded-2xl bg-black/40 backdrop-blur-sm">
                  {/* Play/Pause icon */}
                  <motion.div
                    className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mb-3 relative overflow-hidden"
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
                      ],
                      scale: isPlayHovered ? 1.1 : 1
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <AnimatePresence mode="wait">
                      {isPlayHovered ? (
                        <motion.div
                          key="pause"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Pause
                            className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                            style={{
                              color: service.glowColor?.replace('0.5)', '1)') || '#00d9ff',
                              filter: `drop-shadow(0 0 8px ${service.glowColor || '#00d9ff'})`
                            }}
                            fill={service.glowColor?.replace('0.5)', '1)') || '#00d9ff'}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="play"
                          initial={{ scale: 0, rotate: 90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: -90 }}
                          transition={{ duration: 0.2 }}
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
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Text */}
                  <p className="text-white font-semibold text-sm sm:text-base lg:text-lg">
                    {language === 'tr' ? 'Aksiyonda Gör' : 'View in Action'}
                  </p>
                  <p className="text-gray-300 text-xs sm:text-sm mt-1">
                    {language === 'tr' ? 'Canlı demo izle' : 'Watch live demo'}
                  </p>
                </div>
                </motion.button>
              </>
            ) : service.galleryImages && service.galleryImages.length > 0 ? (
              <motion.button
                layoutId={`gallery-${service.title}-0`}
                onClick={() => handleThumbnailClick(0)}
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
              >
                <img
                  src={service.galleryImages[0]}
                  alt={`${service.title} preview`}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <p className="text-white font-semibold text-xs sm:text-sm lg:text-base opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    {language === 'tr' ? 'Galeriyi Görüntüle' : 'View Gallery'}
                  </p>
                </div>
              </motion.button>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
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

      {/* Demo Modal - WhatsApp Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'whatsapp' && (
          <>
            {/* Mobile Version - Full iPhone experience */}
            {!isDesktop && (
              <MobileWhatsAppDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}

            {/* Desktop Version - Full iPhone experience with mouse effects */}
            {isDesktop && (
              <DesktopWhatsAppDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* Demo Modal - Instagram Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'instagram' && (
          <>
            {/* Mobile Version - Full iPhone experience */}
            {!isDesktop && (
              <MobileInstagramDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}

            {/* Desktop Version - Full iPhone experience with mouse effects */}
            {isDesktop && (
              <DesktopInstagramDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* Demo Modal - Text-to-Video Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'text-to-video' && (
          <>
            {/* Mobile Version - Full iPhone experience */}
            {!isDesktop && (
              <MobileTextToVideoDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}

            {/* Desktop Version - Full iPhone experience with mouse effects */}
            {isDesktop && (
              <DesktopTextToVideoDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* Demo Modal - Text-to-Image Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'text-to-image' && (
          <>
            {/* Mobile Version - Full iPhone experience */}
            {!isDesktop && (
              <MobileTextToImageDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}

            {/* Desktop Version - Full iPhone experience with mouse effects */}
            {isDesktop && (
              <DesktopTextToImageDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* Demo Modal - Voice Cloning Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'voice-cloning' && (
          <>
            {/* Mobile Version - Full iPhone experience */}
            {!isDesktop && (
              <MobileVoiceCloningDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}

            {/* Desktop Version - Full iPhone experience with mouse effects */}
            {isDesktop && (
              <DesktopVoiceCloningDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* Demo Modal - Document AI Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'document-ai' && (
          <>
            {/* Mobile Version - Full iPhone experience */}
            {!isDesktop && (
              <MobileDocumentAIDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}

            {/* Desktop Version - Full iPhone experience with mouse effects */}
            {isDesktop && (
              <DesktopDocumentAIDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* Demo Modal - Image to Video Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'image-to-video' && (
          <>
            {/* Mobile Version - Full iPhone experience */}
            {!isDesktop && (
              <MobileImageToVideoDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}

            {/* Desktop Version - Full iPhone experience with mouse effects */}
            {isDesktop && (
              <DesktopImageToVideoDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* Demo Modal - Video to Video Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'video-to-video' && (
          <>
            {/* Mobile Version - Full iPhone experience */}
            {!isDesktop && (
              <MobileVideoToVideoDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}

            {/* Desktop Version - Full iPhone experience with mouse effects */}
            {isDesktop && (
              <DesktopVideoToVideoDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* Demo Modal - Data Analysis Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'data-analysis' && (
          <>
            {/* Mobile Version - Full iPhone experience */}
            {!isDesktop && (
              <MobileDataAnalysisDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}

            {/* Desktop Version - Full iPhone experience with mouse effects */}
            {isDesktop && (
              <DesktopDataAnalysisDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* Demo Modal - Custom AI Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'custom-ai' && (
          <>
            {/* Mobile Version - Full iPhone experience */}
            {!isDesktop && (
              <MobileCustomAIDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}

            {/* Desktop Version - Full iPhone experience with mouse effects */}
            {isDesktop && (
              <DesktopCustomAIDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* Demo Modal - E-commerce Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'ecommerce' && (
          <>
            {/* Desktop Version - Full iPhone experience with mouse effects */}
            {isDesktop && (
              <DesktopEcommerceDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}

            {/* Mobile Version - Full iPhone experience */}
            {!isDesktop && (
              <MobileEcommerceDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}
          </>
        )}
      </AnimatePresence>

      {/* Demo Modal - Corporate Website Demo */}
      <AnimatePresence>
        {isDemoModalOpen && service.demoType === 'corporate' && (
          <>
            {/* Desktop Version - Full iPhone experience with mouse effects */}
            {isDesktop && (
              <DesktopCorporateDemo
                language={language}
                onContactClick={() => {
                  setIsDemoModalOpen(false);
                  onContactClick();
                }}
                onClose={() => {
                  playBackSound();
                  setIsDemoModalOpen(false);
                }}
              />
            )}

            {/* Mobile Version - Browser Mockup for now */}
            {!isDesktop && (
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
          </>
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
