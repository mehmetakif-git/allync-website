import React from 'react';
import { Zap, Users, ArrowRight, Sparkles } from 'lucide-react';
import { translations } from '../utils/translations';
import logoSvg from '../assets/logo.svg';

interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
  language: 'tr' | 'en';
}

export const Hero: React.FC<HeroProps> = ({ language, ...props }) => {
  const t = translations[language];

  return (
    <div className="min-h-screen relative overflow-hidden bg-black py-8 md:py-12" {...props}>

      <div className="relative z-10 max-w-1200px mx-auto px-5 sm:px-6 lg:px-8 pt-24 pb-12" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'block', opacity: 1 }}>
        <div className="text-center">
          {/* Badge */}
          <div className="hero-logo inline-flex items-center px-4 py-2 rounded-full glass bg-white/5 border border-gray-600 mb-8 hover:bg-white/10 transition-all duration-500 magnetic">
            <Sparkles className="w-4 h-4 text-gray-300 mr-2 animate-pulse" />
            <span className="text-sm text-gray-300 typewriter">{t.heroSlogan}</span>
          </div>

          {/* Company Name */}
          <div className="hero-title mb-6">
            <div className="flex items-center justify-center mb-4">
              <img src={logoSvg} alt="Allync" className="h-16 md:h-24 w-auto mr-4" />
              <h1 className="text-6xl md:text-8xl font-bold text-white glitch text-glow" data-text="Allync">
                Allync
              </h1>
            </div>
            <p className="text-lg text-gray-400 italic gradient-text">Beyond Human Automation</p>
          </div>

          {/* Main headline */}
          <h2 className="hero-subtitle text-4xl md:text-6xl font-bold text-white mb-6 leading-tight text-reveal">
            {t.heroTitle}
            <span className="bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent block mt-2">
              WhatsApp AI Asistanları
            </span>
          </h2>

          <p className="hero-subtitle text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">{t.heroSubtitle}</p>

          {/* CTA buttons */}
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group btn-premium btn-glow btn-ripple magnetic px-8 py-4 rounded-lg font-semibold text-white flex items-center justify-center"
            >
              {t.getAssistant}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-500" />
            </button>
            <button
              onClick={() => {
                const demoSection = document.getElementById('chat-demo');
                if (demoSection) {
                  demoSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-8 py-4 glass bg-white/5 border border-gray-600 rounded-lg font-semibold text-white hover:bg-white/10 transition-all duration-500 magnetic animated-border"
            >
              {t.watchDemo}
            </button>
          </div>

          {/* Feature highlights */}
          <div className="hero-features grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto">
            <div className="group p-6 rounded-xl glass bg-white/5 border border-gray-600 hover:bg-white/10 transition-all duration-500 card-depth magnetic">
              <img src={logoSvg} alt="Allync" className="w-8 h-8 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">{t.humanLike}</h3>
              <p className="text-gray-400 text-sm">{t.humanLikeDesc}</p>
            </div>
            
            <div className="group p-6 rounded-xl glass bg-white/5 border border-gray-600 hover:bg-white/10 transition-all duration-500 card-depth magnetic delay-100">
              <Users className="w-8 h-8 text-gray-300 mb-4 mx-auto icon-rotate" />
              <h3 className="text-lg font-semibold text-white mb-2">{t.support247}</h3>
              <p className="text-gray-400 text-sm">{t.support247Desc}</p>
            </div>
            
            <div className="group p-6 rounded-xl glass bg-white/5 border border-gray-600 hover:bg-white/10 transition-all duration-500 card-depth magnetic delay-200">
              <Zap className="w-8 h-8 text-gray-400 mb-4 mx-auto icon-rotate" />
              <h3 className="text-lg font-semibold text-white mb-2">{t.oneTimePayment}</h3>
              <p className="text-gray-400 text-sm">{t.oneTimePaymentDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};