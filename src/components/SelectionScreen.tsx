import React from 'react';
import { translations } from '../utils/translations';
import { TextRevealCard, TextRevealCardTitle, TextRevealCardDescription } from './ui/TextRevealCard';
import { CometCard } from './ui/CometCard';

// Category Icons
import aiIcon from '../assets/Icon/ai.png';
import digitalIcon from '../assets/Icon/digital.png';

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
          <CometCard className="w-full max-w-sm mx-auto md:max-w-none">
            <button
              onClick={() => onSelectView('ai-view')}
              className="group relative bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl md:rounded-3xl p-6 md:p-10 lg:p-12 hover:bg-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 animate-scale-in w-full min-h-[220px] md:min-h-0"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-transparent rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <img src={aiIcon} alt="Allync AI" className="w-full h-full object-contain" />
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300 whitespace-nowrap">
                  {t.aiPillarTitle}
                </h2>

                <p className="text-lg md:text-xl text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {t.aiPillarSlogan}
                </p>
              </div>
            </button>
          </CometCard>

          <CometCard className="w-full max-w-sm mx-auto md:max-w-none">
            <button
              onClick={() => onSelectView('digital-view')}
              className="group relative bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl md:rounded-3xl p-6 md:p-10 lg:p-12 hover:bg-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 animate-scale-in w-full min-h-[220px] md:min-h-0"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 via-green-600/20 to-transparent rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                  <img src={digitalIcon} alt="Allync Digital" className="w-full h-full object-contain" />
                </div>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300 whitespace-nowrap">
                  {t.digitalPillarTitle}
                </h2>

                <p className="text-lg md:text-xl text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {t.digitalPillarSlogan}
                </p>
              </div>
            </button>
          </CometCard>
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

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.6s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
};
