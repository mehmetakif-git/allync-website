import React, { useState, useEffect, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import { LoadingScreen } from './components/LoadingScreen';
import { Navigation } from './components/Navigation';
import { SelectionScreen } from './components/SelectionScreen';
import { HelmetManager } from './components/HelmetManager';
import { InactivityWarning } from './components/InactivityWarning';
import { ScrollProgress } from './components/ui/ScrollProgress';

// Lazy load heavy components - Three.js and solutions pages
const FloatingLines = React.lazy(() => import('./components/ui/FloatingLines'));
const Lanyard = React.lazy(() => import('./components/Lanyard'));
const AllyncAISolutions = React.lazy(() => import('./components/AllyncAISolutions').then(m => ({ default: m.AllyncAISolutions })));
const DigitalSolutions = React.lazy(() => import('./components/DigitalSolutions').then(m => ({ default: m.DigitalSolutions })));

function App() {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [viewMode, setViewMode] = useState<'loading' | 'selection' | 'ai-view' | 'digital-view'>('loading');
  const [animationsEnabled, setAnimationsEnabled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showLanyard, setShowLanyard] = useState(false);
  const [scrollJolt, setScrollJolt] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningCountdown, setWarningCountdown] = useState(10);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'tr' ? 'en' : 'tr');
  };

  const handleLoadingComplete = () => {
    // Check if there's a hash in the URL for direct section linking (Google Ads etc.)
    const hash = window.location.hash.replace('#', '');
    const validSections = ['contact', 'iletisim', 'pricing', 'fiyat', 'features', 'packages', 'hero'];

    if (hash && validSections.includes(hash)) {
      // Map Turkish aliases to actual section IDs
      const sectionMap: { [key: string]: string } = {
        'iletisim': 'contact',
        'fiyat': 'pricing'
      };
      const targetSection = sectionMap[hash] || hash;

      // Skip selection, go directly to ai-view
      setViewMode('ai-view');
      setTimeout(() => {
        setAnimationsEnabled(true);
        // Scroll to target section after a brief delay
        setTimeout(() => {
          const section = document.getElementById(targetSection);
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      }, 500);
    } else {
      setViewMode('selection');
      setTimeout(() => {
        setAnimationsEnabled(true);
      }, 500);
    }
  };

  const handleSelectView = (view: 'ai-view' | 'digital-view') => {
    setViewMode(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSelection = () => {
    // Instant scroll to top before transition
    window.scrollTo(0, 0);
    setViewMode('selection');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (viewMode === 'ai-view' || viewMode === 'digital-view') {
        const sections = ['hero', 'chat-demo', 'packages', 'industry-examples', 'features', 'pricing', 'contact'];
        const scrollPosition = window.scrollY + 100;

        for (let i = sections.length - 1; i >= 0; i--) {
          const section = document.getElementById(sections[i]);
          if (section && section.offsetTop <= scrollPosition) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewMode]);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      setScrollJolt(event.deltaY);
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent scroll flash during ALL view transitions
  useEffect(() => {
    // Lock body scroll during transition
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      // Only unlock if not on selection screen
      if (viewMode !== 'selection') {
        document.body.style.overflow = '';
      }
    }, 600); // Match animation duration

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [viewMode]);

  // Effect to show warning at 80 seconds and Lanyard after 90 seconds of inactivity
  useEffect(() => {
    if (isMobile) return; // Don't run inactivity timer on mobile

    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      setShowWarning(false);
      setWarningCountdown(10);

      if (!showLanyard) { // Don't set a new timer if lanyard is already trying to show or is shown
          inactivityTimer = setTimeout(() => {
              setShowWarning(true);
          }, 80000);
      }
    };

    const activityEvents: (keyof WindowEventMap)[] = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(event => window.addEventListener(event, resetTimer, { passive: true }));
    resetTimer(); // Start the timer initially

    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [showLanyard, isMobile]); // Dependency on showLanyard to help manage timer state correctly

  // Effect to handle countdown when warning is shown
  useEffect(() => {
    if (!showWarning) return;

    const countdownInterval = setInterval(() => {
      setWarningCountdown((prev) => {
        if (prev <= 1) {
          setShowWarning(false);
          setShowLanyard(true);
          setWarningCountdown(10);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [showWarning]);

  const handleLanyardDismiss = () => {
    setShowLanyard(false);
  };

  const renderLanyard = () => (
    <AnimatePresence>
      {showLanyard && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ y: '-100vh', opacity: 0 }}
          animate={{ y: '0vh', opacity: 1 }}
          exit={{ y: '-100vh', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 50, damping: 15 }}
        >
          <Suspense fallback={null}>
            <Lanyard onDismiss={handleLanyardDismiss} scrollJolt={scrollJolt} />
          </Suspense>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <HelmetProvider>
        <div className={`min-h-screen bg-black app-loaded ${animationsEnabled ? 'animations-enabled' : 'animations-disabled'}`}>
          {/* FloatingLines - Lazy loaded Three.js component */}
          <Suspense fallback={null}>
            {!isMobile ? (
              <FloatingLines
                enabledWaves={['top', 'middle', 'bottom']}
                lineCount={5}
                lineDistance={5}
                bendRadius={5.0}
                bendStrength={-0.5}
                interactive={viewMode !== 'loading'}
                parallax={false}
                mixBlendMode="normal"
              />
            ) : (
              <FloatingLines
                enabledWaves={['bottom']}
                lineCount={2}
                lineDistance={8}
                animationSpeed={0.5}
                interactive={false}
                parallax={false}
                mixBlendMode="normal"
                pixelRatio={1}
              />
            )}
          </Suspense>

          {/* Loading Screen */}
          {viewMode === 'loading' && (
            <LoadingScreen onLoadingComplete={handleLoadingComplete} language={language} />
          )}

          <HelmetManager language={language} activeSection={activeSection} />
          <Navigation
            language={language}
            onLanguageToggle={toggleLanguage}
            viewMode={viewMode}
            onBackToSelection={viewMode !== 'selection' ? handleBackToSelection : undefined}
          />
          {(viewMode === 'ai-view' || viewMode === 'digital-view') && (
            <ScrollProgress
              showMilestones={!isMobile}
              viewMode={viewMode}
              language={language}
            />
          )}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative z-10"
            >
              {viewMode === 'selection' && (
                <SelectionScreen
                  language={language}
                  onSelectView={handleSelectView}
                  onLanguageToggle={toggleLanguage}
                />
              )}
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              }>
                {viewMode === 'ai-view' && (
                  <AllyncAISolutions language={language} />
                )}
                {viewMode === 'digital-view' && (
                  <DigitalSolutions language={language} />
                )}
              </Suspense>
            </motion.div>
          </AnimatePresence>
          {!isMobile && (
            <>
              <AnimatePresence>
                {showWarning && <InactivityWarning countdown={warningCountdown} />}
              </AnimatePresence>
              {renderLanyard()}
            </>
          )}
        </div>
    </HelmetProvider>
  );
}

export default App;