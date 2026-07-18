import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigation } from './components/Navigation';
import { SelectionScreen } from './components/SelectionScreen';
import { HelmetManager } from './components/HelmetManager';
import { InactivityWarning } from './components/InactivityWarning';
import { NotFound } from './components/NotFound';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { CompanyProfile } from './components/CompanyProfile';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { lockScroll, unlockScroll, resetScrollLock } from './utils/scrollLock';
import { ScrollDownIndicator } from './components/ui/ScrollDownIndicator';

// Lazy load heavy components - Three.js only
const FloatingLines = React.lazy(() => import('./components/ui/FloatingLines'));
const Lanyard = React.lazy(() => import('./components/Lanyard'));

// Direct imports for solution pages (no lazy loading for smoother transitions)
import { AllyncAISolutions } from './components/AllyncAISolutions';
import { DigitalSolutions } from './components/DigitalSolutions';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceSlug } = useParams<{ serviceSlug?: string }>();

  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const [viewMode, setViewMode] = useState<'selection' | 'ai-view' | 'digital-view'>(() =>
    location.pathname.startsWith('/ai')
      ? 'ai-view'
      : location.pathname.startsWith('/digital')
        ? 'digital-view'
        : 'selection'
  );
  const [animationsEnabled, setAnimationsEnabled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showLanyard, setShowLanyard] = useState(false);
  const [scrollJolt, setScrollJolt] = useState(0);
  const [clickJolt, setClickJolt] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningCountdown, setWarningCountdown] = useState(10);
  const [lanyardSnapped, setLanyardSnapped] = useState(false);
  const [snapMessage, setSnapMessage] = useState('');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'tr' ? 'en' : 'tr');
  };

  // No loading screen — the initial view is resolved synchronously from the URL.
  // Enable animations shortly after first paint, and scroll to the requested
  // service section if a slug is present.
  useEffect(() => {
    const animTimer = setTimeout(() => setAnimationsEnabled(true), 500);
    let scrollTimer: ReturnType<typeof setTimeout> | undefined;
    if (serviceSlug && (viewMode === 'ai-view' || viewMode === 'digital-view')) {
      scrollTimer = setTimeout(() => {
        const section = document.getElementById(serviceSlug);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 1000);
    }
    return () => {
      clearTimeout(animTimer);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectView = (view: 'ai-view' | 'digital-view') => {
    window.scrollTo(0, 0);
    setViewMode(view);
    navigate(view === 'ai-view' ? '/ai' : '/digital');
  };

  const handleBackToSelection = () => {
    // Instant scroll to top before transition
    window.scrollTo(0, 0);
    setViewMode('selection');
    navigate('/');
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

  // DEBUG: Monitor scroll state
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const debugWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      console.log(
        `%c[SCROLL DEBUG] wheel fired | deltaY: ${e.deltaY} | scrollY: ${window.scrollY} | scrollHeight: ${document.body.scrollHeight} | viewportHeight: ${window.innerHeight} | target: ${target.tagName}.${target.className?.toString().slice(0, 50)} | body.overflow: "${document.body.style.overflow}" | body.position: "${document.body.style.position}" | html.overflow: "${document.documentElement.style.overflow}" | computedOverflow: "${getComputedStyle(document.body).overflow}"`,
        'color: #ffaa00;'
      );
    };

    window.addEventListener('wheel', debugWheel, { passive: true });
    return () => window.removeEventListener('wheel', debugWheel);
  }, []);

  // Click anywhere to shake lanyard and show hint when it's visible
  useEffect(() => {
    if (!showLanyard) return;

    const handleClick = () => {
      // Trigger click jolt for all clicks - shows hint bubble and shakes lanyard
      const joltValue = Date.now();
      setClickJolt(joltValue);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [showLanyard]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync viewMode with URL path (for browser back/forward navigation)
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/ai') && viewMode !== 'ai-view') {
      window.scrollTo(0, 0);
      setViewMode('ai-view');
      // Scroll to service if slug provided
      if (serviceSlug) {
        setTimeout(() => {
          const section = document.getElementById(serviceSlug);
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      }
    } else if (path.startsWith('/digital') && viewMode !== 'digital-view') {
      window.scrollTo(0, 0);
      setViewMode('digital-view');
      // Scroll to service if slug provided
      if (serviceSlug) {
        setTimeout(() => {
          const section = document.getElementById(serviceSlug);
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      }
    } else if (path === '/' && viewMode !== 'selection') {
      window.scrollTo(0, 0);
      setViewMode('selection');
    }
  }, [location.pathname, serviceSlug]);

  // Lock scroll only on selection screen
  useEffect(() => {
    if (viewMode === 'selection') {
      lockScroll();
      return () => unlockScroll();
    } else {
      // Force reset on navigation - clears any stuck scroll locks
      resetScrollLock();
    }
  }, [viewMode]);

  // Effect to show warning at 50 seconds and Lanyard after 60 seconds of inactivity
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
          }, 50000); // 50 seconds, then 10 second countdown = 60 seconds total
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
    // Reset snap state after exit animation completes
    setTimeout(() => {
      setLanyardSnapped(false);
      setSnapMessage('');
    }, 1000);
  };

  const handleLanyardSnap = (message: string) => {
    setLanyardSnapped(true);
    setSnapMessage(message);
    // Dismiss lanyard immediately - it will fall down due to snap animation
    setTimeout(() => {
      setShowLanyard(false);
    }, 300); // Short delay so user sees the snap effect
    // Clear snap message after it's been visible for a while
    setTimeout(() => {
      setSnapMessage('');
      setLanyardSnapped(false);
    }, 2500);
  };

  const renderLanyard = () => (
    <>
      <AnimatePresence>
        {showLanyard && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            initial={{ y: '-100vh', opacity: 0 }}
            animate={{ y: '0vh', opacity: 1 }}
            exit={{
              y: lanyardSnapped ? '100vh' : '-100vh', // Fall DOWN when snapped, go UP otherwise
              opacity: 0
            }}
            transition={{
              type: lanyardSnapped ? 'tween' : 'spring',
              duration: lanyardSnapped ? 0.8 : undefined,
              ease: lanyardSnapped ? 'easeIn' : undefined,
              stiffness: lanyardSnapped ? undefined : 50,
              damping: lanyardSnapped ? undefined : 15
            }}
          >
            <Suspense fallback={null}>
              <Lanyard
                onDismiss={handleLanyardDismiss}
                scrollJolt={scrollJolt}
                clickJolt={clickJolt}
                onSnap={handleLanyardSnap}
                language={language}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snap Message - Stays visible independently of lanyard exit */}
      <AnimatePresence>
        {snapMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-gradient-to-br from-red-600 to-red-500 text-white px-8 py-6 rounded-2xl shadow-2xl"
            >
              <p className="text-2xl md:text-3xl font-bold text-center">{snapMessage}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
                interactive={true}
                parallax={false}
                mixBlendMode="normal"
                linesGradient={['#213448', '#547792', '#94B4C1', '#EAE0CF']}
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
                linesGradient={['#213448', '#547792', '#94B4C1', '#EAE0CF']}
              />
            )}
          </Suspense>

          <HelmetManager language={language} activeSection={activeSection} />
          <AnimatePresence>
            {(viewMode === 'ai-view' || viewMode === 'digital-view') && (
              <motion.div
                key="navigation"
                initial={{ y: '-100%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{
                  duration: 0.5,
                  ease: [0.4, 0, 0.2, 1],
                  delay: 0.4
                }}
              >
                <Navigation
                  language={language}
                  onLanguageToggle={toggleLanguage}
                  viewMode={viewMode}
                  onBackToSelection={handleBackToSelection}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <ScrollProgress
            showMilestones={!isMobile}
            viewMode={viewMode}
            language={language}
            visible={viewMode === 'ai-view' || viewMode === 'digital-view'}
          />
          {(viewMode === 'ai-view' || viewMode === 'digital-view') && (
            <ScrollDownIndicator language={language} delay={4000} />
          )}
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {viewMode === 'selection' && (
                <motion.div
                  key="selection"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98, y: -20 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <SelectionScreen
                    language={language}
                    onSelectView={handleSelectView}
                    onLanguageToggle={toggleLanguage}
                  />
                </motion.div>
              )}
              {viewMode === 'ai-view' && (
                <motion.div
                  key="ai-view"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                    delay: 0.1
                  }}
                >
                  <AllyncAISolutions language={language} />
                </motion.div>
              )}
              {viewMode === 'digital-view' && (
                <motion.div
                  key="digital-view"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                    delay: 0.1
                  }}
                >
                  <DigitalSolutions language={language} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {!isMobile && (
            <>
              <AnimatePresence>
                {showWarning && <InactivityWarning countdown={warningCountdown} language={language} />}
              </AnimatePresence>
              {renderLanyard()}
            </>
          )}
        </div>
    </HelmetProvider>
  );
}

// Contact redirect component
function ContactRedirect() {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate('/ai#contact', { replace: true });
    // Scroll to contact after navigation
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  }, [navigate]);

  return null;
}

// Wrapper component with routes
function AppWithRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppContent />} />
      <Route path="/ai" element={<AppContent />} />
      <Route path="/ai/:serviceSlug" element={<AppContent />} />
      <Route path="/digital" element={<AppContent />} />
      <Route path="/digital/:serviceSlug" element={<AppContent />} />
      <Route path="/contact" element={<ContactRedirect />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/company-profile" element={<CompanyProfile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Main App with BrowserRouter
function App() {
  return (
    <BrowserRouter>
      <AppWithRoutes />
    </BrowserRouter>
  );
}

export default App;