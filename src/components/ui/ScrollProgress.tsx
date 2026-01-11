import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface ScrollProgressProps {
  showMilestones?: boolean;
  viewMode: string;
  language: 'tr' | 'en';
  visible?: boolean;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  showMilestones = true,
  viewMode,
  language,
  visible = true
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [currentSection, setCurrentSection] = useState(0);

  const aiMilestones = {
    colors: ['#0DA266', '#D542AE', '#2389D6', '#8F43EE', '#E94720', '#4C5564', '#0DA2AD', '#3464ED', '#EA820A', '#0DA266'],
    labels: {
      tr: ['WA Otomasyon', 'IG Otomasyon', 'Text→Video', 'Text→Image', 'Voice AI', 'Doc AI', 'Image→Video', 'Video→Video', 'Data AI', 'Custom AI'],
      en: ['WA Automation', 'IG Automation', 'Text→Video', 'Text→Image', 'Voice AI', 'Doc AI', 'Image→Video', 'Video→Video', 'Data AI', 'Custom AI']
    },
    slugs: ['whatsapp', 'instagram', 'text-to-video', 'text-to-image', 'voice-cloning', 'document-ai', 'image-to-video', 'video-to-video', 'data-analysis', 'custom-ai'],
    positions: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
  };

  const digitalMilestones = {
    colors: ['#547792', '#13AC63', '#2588D9', '#C938A5', '#E84520', '#0C9FAD', '#3D65EE', '#4F5867'],
    labels: {
      tr: ['SaaS', 'E-Ticaret', 'Kurumsal', 'Mobil App', 'Dijital Paz.', 'IoT', 'Bulut', 'Bakım'],
      en: ['SaaS', 'E-Commerce', 'Corporate', 'Mobile App', 'Digital Mkt', 'IoT', 'Cloud', 'Support']
    },
    slugs: ['saas-panels', 'ecommerce', 'corporate', 'mobile-app', 'digital-marketing', 'iot', 'cloud', 'maintenance'],
    positions: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875]
  };

  const config = viewMode === 'ai-view' ? aiMilestones : digitalMilestones;
  const labels = config.labels[language];
  const slugs = config.slugs;

  useEffect(() => {
    const updateSection = () => {
      const scrolled = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrolled / totalHeight;

      for (let i = config.positions.length - 1; i >= 0; i--) {
        if (progress >= config.positions[i]) {
          setCurrentSection(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', updateSection, { passive: true });
    updateSection();
    return () => window.removeEventListener('scroll', updateSection);
  }, [config.positions]);

  const progressGradient = viewMode === 'ai-view'
    ? 'linear-gradient(to right, #8F43EE, #2389D6, #0DA2AD)'
    : 'linear-gradient(to right, #0C9FAD, #13AC63, #2588D9)';

  if (!visible) return null;

  // Only render for solution views
  if (viewMode !== 'ai-view' && viewMode !== 'digital-view') return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
      <motion.div
        className="h-1 origin-left"
        style={{
          scaleX,
          background: progressGradient
        }}
      />

      {showMilestones && (
        <div className="absolute top-2 left-0 right-0 flex justify-between px-4 md:px-8 pointer-events-auto">
          {config.positions.map((position, index) => (
            <button
              key={index}
              onClick={() => {
                const serviceElement = document.getElementById(slugs[index]);
                if (serviceElement) {
                  serviceElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                  // Fallback to percentage-based scrolling
                  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
                  const targetScroll = position * totalHeight;
                  window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                }
              }}
              className={`group relative transition-all duration-300 ${
                currentSection === index ? 'scale-110' : 'scale-100 opacity-50 hover:opacity-100'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300`}
                style={{
                  backgroundColor: currentSection === index ? config.colors[index] : '#6b7280',
                  boxShadow: currentSection === index
                    ? `0 0 12px ${config.colors[index]}, 0 0 24px ${config.colors[index]}40`
                    : 'none'
                }}
              />

              <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                <div
                  className="backdrop-blur-[6px] rounded px-2 py-1 border"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    borderColor: config.colors[index]
                  }}
                >
                  <span
                    className="text-xs font-medium"
                    style={{ color: config.colors[index] }}
                  >
                    {labels[index]}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <motion.div
        className="absolute top-0 h-1 w-20 pointer-events-none"
        style={{
          left: scrollYProgress,
          background: `radial-gradient(circle, ${config.colors[currentSection]}cc 0%, transparent 70%)`,
          filter: 'blur(8px)',
          scaleX: 1
        }}
      />
    </div>
  );
};
