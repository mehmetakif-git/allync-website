import React, { useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { HelmetProvider } from 'react-helmet-async';

const FloatingLines = React.lazy(() => import('./ui/FloatingLines'));

export const NotFound: React.FC = () => {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <HelmetProvider>
      <Helmet>
        <title>404 - {language === 'tr' ? 'Sayfa Bulunamadı' : 'Page Not Found'} | Allync</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="h-screen min-h-screen flex items-center justify-center px-4 sm:px-6 relative overflow-hidden bg-black">
        {/* FloatingLines Background */}
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

        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(prev => prev === 'tr' ? 'en' : 'tr')}
          className="fixed top-4 right-4 sm:top-8 sm:right-8 text-sm px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all z-[100]"
        >
          {language === 'tr' ? 'EN' : 'TR'}
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 text-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <img src="/allync-social-media-logo.png" alt="Allync" className="h-12 sm:h-16 mx-auto" />
          </motion.div>

          {/* 404 Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 sm:p-12 max-w-lg mx-auto"
          >
            {/* 404 Number */}
            <h1 className="text-7xl sm:text-9xl font-bold bg-gradient-to-r from-[#547792] to-[#94B4C1] bg-clip-text text-transparent mb-4">
              404
            </h1>

            {/* Message */}
            <p className="text-xl sm:text-2xl text-white font-medium mb-2">
              {language === 'tr' ? 'Sayfa Bulunamadı' : 'Page Not Found'}
            </p>
            <p className="text-gray-400 mb-8">
              {language === 'tr'
                ? 'Aradığınız sayfa mevcut değil veya taşınmış olabilir.'
                : 'The page you are looking for does not exist or has been moved.'}
            </p>

            {/* Home Button */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#547792] to-[#94B4C1] text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              {language === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home'}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </HelmetProvider>
  );
};
