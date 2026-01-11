import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import scrollDownAnimation from '../../assets/Scroll down.json';

interface ScrollDownIndicatorProps {
  delay?: number;
  language: 'tr' | 'en';
}

export const ScrollDownIndicator: React.FC<ScrollDownIndicatorProps> = ({
  delay = 3000,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const startTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    };

    const handleScroll = () => {
      setIsVisible(false);
      startTimer();
    };

    // Start initial timer
    startTimer();

    // Only hide on scroll, not on mouse/touch/keyboard
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [delay]);

  const handleClick = () => {
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    });
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 cursor-pointer"
          onClick={handleClick}
        >
          <Lottie
            animationData={scrollDownAnimation}
            loop={true}
            autoplay={true}
            style={{ width: 60, height: 60 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
