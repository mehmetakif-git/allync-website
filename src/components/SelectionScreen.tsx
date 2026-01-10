import React from 'react';
import { translations } from '../utils/translations';
import { TextRevealCard, TextRevealCardTitle, TextRevealCardDescription } from './ui/TextRevealCard';
import { CometCard } from './ui/CometCard';
import HologramCard from './ui/HologramCard';

// Category Icons (SVG for hologram mask)
import aiIcon from '../assets/Icon/ai.svg';
import digitalIcon from '../assets/Icon/digital.svg';

interface SelectionScreenProps {
  language: 'tr' | 'en';
  onSelectView: (view: 'ai-view' | 'digital-view') => void;
  onLanguageToggle: () => void;
}

export const SelectionScreen: React.FC<SelectionScreenProps> = ({ language, onSelectView, onLanguageToggle }) => {
  const t = translations[language];

  return (
    <div className="h-screen min-h-screen flex items-center justify-center px-4 sm:px-6 relative overflow-hidden">

      <button
        onClick={onLanguageToggle}
        className="fixed top-4 right-4 sm:top-8 sm:right-8 text-sm px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all z-[100]"
      >
        {language === 'tr' ? 'EN' : 'TR'}
      </button>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Header - Simple Text */}
        <div className="block md:hidden text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-3">
            {language === 'tr' ? "Hangi Hizmeti İstersiniz?" : "Which Service Do You Need?"}
          </h1>
          <p className="text-lg text-gray-400">
            {language === 'tr' ? 'AI ve Dijital çözümlerimizi keşfedin' : 'Discover our AI and Digital solutions'}
          </p>
        </div>

        {/* Desktop Header - TextRevealCard */}
        <div className="hidden md:flex flex-col items-center justify-center mb-12 lg:mb-16 w-full">
          <TextRevealCard
            text={language === 'tr' ? "Hangi Hizmeti İstersiniz?" : "Which Service Do You Need?"}
            revealText={language === 'tr' ? "Dijital Geleceğinizi İnşa Edin" : "Build Your Digital Future"}
            className="w-full max-w-2xl lg:max-w-4xl"
          >
            <TextRevealCardTitle>
              {language === 'tr'
                ? 'Mouse ile kartın üzerinden geçin'
                : 'Hover over the card to reveal'}
            </TextRevealCardTitle>
            <TextRevealCardDescription>
              {language === 'tr'
                ? 'AI ve Dijital çözümlerimizi keşfedin'
                : 'Discover our AI and Digital solutions'}
            </TextRevealCardDescription>
          </TextRevealCard>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8 w-full">
          {/* Mobile: CometCard */}
          <div className="block md:hidden">
            <CometCard className="w-full max-w-sm mx-auto">
              <button
                onClick={() => onSelectView('ai-view')}
                className="group relative bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#94B4C1]/20 animate-scale-in w-full min-h-[220px]"
                style={{ animationDelay: '0.2s' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#547792]/20 via-[#94B4C1]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="icon-container ai-icon w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <img src={aiIcon} alt="Allync AI" className="w-full h-full object-contain" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-[#94B4C1] transition-colors duration-300 whitespace-nowrap">
                    {t.aiPillarTitle}
                  </h2>
                  <p className="text-lg text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {t.aiPillarSlogan}
                  </p>
                </div>
              </button>
            </CometCard>
          </div>

          {/* Desktop: HologramCard */}
          <div className="hidden md:block animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <HologramCard theme="ai" onClick={() => onSelectView('ai-view')} iconUrl={aiIcon} idlePulseOrder={0}>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 whitespace-nowrap">
                {t.aiPillarTitle}
              </h2>
              <p className="text-xl text-gray-400">
                {t.aiPillarSlogan}
              </p>
            </HologramCard>
          </div>

          {/* Mobile: CometCard */}
          <div className="block md:hidden">
            <CometCard className="w-full max-w-sm mx-auto">
              <button
                onClick={() => onSelectView('digital-view')}
                className="group relative bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#94B4C1]/20 animate-scale-in w-full min-h-[220px]"
                style={{ animationDelay: '0.4s' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#547792]/20 via-[#94B4C1]/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="icon-container digital-icon w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <img src={digitalIcon} alt="Allync Digital" className="w-full h-full object-contain" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-[#94B4C1] transition-colors duration-300 whitespace-nowrap">
                    {t.digitalPillarTitle}
                  </h2>
                  <p className="text-lg text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {t.digitalPillarSlogan}
                  </p>
                </div>
              </button>
            </CometCard>
          </div>

          {/* Desktop: HologramCard */}
          <div className="hidden md:block animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <HologramCard theme="digital" onClick={() => onSelectView('digital-view')} iconUrl={digitalIcon} idlePulseOrder={1}>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 whitespace-nowrap">
                {t.digitalPillarTitle}
              </h2>
              <p className="text-xl text-gray-400">
                {t.digitalPillarSlogan}
              </p>
            </HologramCard>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes icon-float {
          0%, 100% {
            transform: translateY(0) scale(1.1);
          }
          50% {
            transform: translateY(-8px) scale(1.1);
          }
        }

        @keyframes icon-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(148, 180, 193, 0.4);
          }
          50% {
            box-shadow: 0 0 30px 10px rgba(148, 180, 193, 0.2);
          }
        }

        @keyframes icon-pulse-cyan {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(148, 180, 193, 0.4);
          }
          50% {
            box-shadow: 0 0 30px 10px rgba(148, 180, 193, 0.2);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.6s ease-out;
          animation-fill-mode: both;
        }

        .icon-container {
          position: relative;
          border-radius: 1rem;
        }

        .icon-container::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 1.25rem;
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .ai-icon::before {
          background: linear-gradient(135deg, rgba(84, 119, 146, 0.5), rgba(148, 180, 193, 0.5));
          filter: blur(15px);
        }

        .digital-icon::before {
          background: linear-gradient(135deg, rgba(84, 119, 146, 0.5), rgba(148, 180, 193, 0.5));
          filter: blur(15px);
        }

        .group:hover .icon-container::before {
          opacity: 1;
        }

        .group:hover .ai-icon {
          animation: icon-float 2s ease-in-out infinite, icon-pulse 2s ease-in-out infinite;
        }

        .group:hover .digital-icon {
          animation: icon-float 2s ease-in-out infinite, icon-pulse-cyan 2s ease-in-out infinite;
        }

        .group:hover .icon-container img {
          filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
        }
      `}</style>
    </div>
  );
};
