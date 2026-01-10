import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronUp, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { translations } from '../utils/translations';
import logoNavbar from '../assets/logo-navbar.svg';

interface NavigationProps {
  language: 'tr' | 'en';
  onLanguageToggle: () => void;
  viewMode?: 'loading' | 'selection' | 'ai-view' | 'digital-view';
  onBackToSelection?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ language, onLanguageToggle, viewMode, onBackToSelection }) => {
  const t = translations[language];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Mark as ready after initial mount animation
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 600);
    return () => clearTimeout(timer);
  }, []);

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

          // Update scroll direction - also show navbar when near top
          if (currentScrollY < 100) {
            setIsScrollingUp(true); // Always show when near top
          } else if (currentScrollY > lastScrollY) {
            setIsScrollingUp(false);
          } else {
            setIsScrollingUp(true);
          }

          setLastScrollY(currentScrollY);
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

  return (
    <>
      {/* Navigation Bar */}
      <motion.nav
        initial={false}
        animate={{
          y: isReady && !isScrollingUp ? '-100%' : '0%',
          opacity: isReady && !isScrollingUp ? 0 : 1
        }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          paddingTop: 'max(1rem, env(safe-area-inset-top))',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => {
                if (onBackToSelection) {
                  onBackToSelection();
                } else {
                  scrollToSection('hero');
                }
              }}
            >
              <img src={logoNavbar} alt="Allync" className="h-10 sm:h-14 w-auto transition-transform duration-300 group-hover:scale-105" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {(viewMode === 'ai-view' || viewMode === 'digital-view') && onBackToSelection ? (
                <button
                  onClick={() => onBackToSelection()}
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
      </motion.nav>

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