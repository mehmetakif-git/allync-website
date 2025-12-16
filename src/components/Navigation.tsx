import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronUp, Phone, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { translations } from '../utils/translations';
import logoNavbar from '../assets/logo-navbar.svg';
import { useSoundEffect } from '../contexts/SoundEffectContext';

interface NavigationProps {
  language: 'tr' | 'en';
  onLanguageToggle: () => void;
  viewMode?: 'loading' | 'selection' | 'ai-view' | 'digital-view';
  onBackToSelection?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ language, onLanguageToggle, viewMode, onBackToSelection }) => {
  const t = translations[language];
  const { playBackSound, isMuted, toggleMute } = useSoundEffect();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(true);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const navItems = [
    { id: 'hero', label: language === 'tr' ? 'Ana Sayfa' : 'Home' },
    { id: 'chat-demo', label: 'Demo' },
    { id: 'packages', label: language === 'tr' ? 'Paketler' : 'Packages' },
    { id: 'industry-examples', label: language === 'tr' ? 'Sektörler' : 'Industries' },
    { id: 'features', label: language === 'tr' ? 'Özellikler' : 'Features' },
    { id: 'pricing', label: language === 'tr' ? 'Fiyatlar' : 'Pricing' },
    { id: 'contact', label: language === 'tr' ? 'İletişim' : 'Contact' }
  ];

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const sections = navItems.map(item => document.getElementById(item.id));
          const scrollPosition = currentScrollY + 100;

          // Update active section
          for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section && section.offsetTop <= scrollPosition) {
              setActiveSection(navItems[i].id);
              break;
            }
          }

          // Update scroll direction and visibility
          if (currentScrollY > lastScrollY) {
            setIsScrollingUp(false);
          } else {
            setIsScrollingUp(true);
          }

          setLastScrollY(currentScrollY);
          setIsVisible(currentScrollY < 100 || currentScrollY < lastScrollY);
          setShowBackToTop(currentScrollY > 300);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, navItems]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = sectionId === 'hero' ? 0 : element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  if (viewMode === 'selection' || viewMode === 'loading') return null;

  return (
    <>
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrollingUp ? 'translate-y-0' : '-translate-y-full'
      } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => {
                if (onBackToSelection) {
                  playBackSound();
                  onBackToSelection();
                } else {
                  scrollToSection('hero');
                }
              }}
            >
              <img src={logoNavbar} alt="Allync" className="h-14 w-auto transition-transform duration-300 group-hover:scale-105" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {(viewMode === 'ai-view' || viewMode === 'digital-view') && onBackToSelection ? (
                <button
                  onClick={() => {
                    playBackSound();
                    onBackToSelection();
                  }}
                  className="flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300 group"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span className="text-sm font-medium">{t.backToSolutions}</span>
                </button>
              ) : (
                navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                      activeSection === item.id
                        ? 'text-white'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {item.label}
                    {activeSection === item.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full"></div>
                    )}
                  </button>
                ))
              )}
              
              {/* Sound Toggle */}
              <button
                onClick={toggleMute}
                className="flex items-center p-2 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
                title={isMuted ? (language === 'tr' ? 'Sesi Aç' : 'Unmute') : (language === 'tr' ? 'Sesi Kapat' : 'Mute')}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              {/* Language Toggle */}
              <button
                onClick={onLanguageToggle}
                className="flex items-center px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-sm font-medium">{language === 'tr' ? 'EN' : 'TR'}</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="flex items-center p-2 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
                title={isMuted ? (language === 'tr' ? 'Sesi Aç' : 'Unmute') : (language === 'tr' ? 'Sesi Kapat' : 'Mute')}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <button
                onClick={onLanguageToggle}
                className="flex items-center px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-sm font-medium">{language === 'tr' ? 'EN' : 'TR'}</span>
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 bg-white/5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/5 backdrop-blur-xl border-t border-white/15">
            <div className="px-4 py-4 space-y-2">
              {(viewMode === 'ai-view' || viewMode === 'digital-view') && onBackToSelection ? (
                <button
                  onClick={() => {
                    playBackSound();
                    onBackToSelection();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">{t.backToSolutions}</span>
                </button>
              ) : (
                navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-300 ${
                      activeSection === item.id
                        ? 'text-white bg-white/10'
                        : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
          style={{
            marginBottom: 'env(safe-area-inset-bottom)',
            boxShadow: '0 4px 20px rgba(255, 255, 255, 0.1)'
          }}
        >
          <ChevronUp style={{width: '40px', height: '40px', minWidth: '40px', minHeight: '40px'}} />
        </button>
      )}
    </>
  );
};