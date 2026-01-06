import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface InactivityWarningProps {
  countdown: number;
  language?: 'tr' | 'en';
}

const messagesTr = [
  'Bir anomali tespit edildi...',
  'Farklı bir cisim yaklaşıyor...',
  'Allync-AI geliyor...',
  'Hazır mısın?',
  'Sistem yanıt veriyor...'
];

const messagesEn = [
  'An anomaly detected...',
  'A different object approaching...',
  'Allync-AI is coming...',
  'Are you ready?',
  'System responding...'
];

export const InactivityWarning: React.FC<InactivityWarningProps> = ({ countdown, language = 'tr' }) => {
  const messages = language === 'tr' ? messagesTr : messagesEn;

  // Select one random message when the component is first mounted
  const randomMessage = useMemo(() => {
    return messages[Math.floor(Math.random() * messages.length)];
  }, [language]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="fixed bottom-10 right-10 z-50 pointer-events-none"
    >
      <div className="bg-black/80 backdrop-blur-md border border-red-500/50 rounded-xl p-4 shadow-2xl shadow-red-500/20">
        <div className="flex items-center gap-4">
          <motion.div
            className="w-3 h-3 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div>
            <p className="text-white font-semibold">{randomMessage}</p>
            <p className="text-red-400 text-sm">
              {language === 'tr'
                ? `Sistemle temas kuruluyor: ${countdown}`
                : `Establishing contact: ${countdown}`}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
