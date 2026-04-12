import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useOutsideClick } from '../hooks/use-outside-click';
import { lockScroll, unlockScroll } from '../utils/scrollLock';

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  extendedContent: string;
  ctaText: string;
  closeText: string;
  onCtaClick: () => void;
  gradient: string;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  isOpen,
  onClose,
  title,
  extendedContent,
  ctaText,
  closeText,
  onCtaClick,
  gradient
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    onClose();
  };

  useOutsideClick(modalRef, () => {
    if (isOpen) handleClose();
  });

  useEffect(() => {
    if (isOpen) {
      lockScroll();
      return () => unlockScroll();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden"
          >
            <div className="sticky top-0 z-10 bg-black/60 backdrop-blur-lg border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {title}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all duration-300 hover:scale-110"
                aria-label={closeText}
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 md:p-8">
              <div className={`w-full h-2 bg-gradient-to-r ${gradient} rounded-full mb-6`}></div>

              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {extendedContent}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  {closeText}
                </button>
                <button
                  onClick={() => {
                    onCtaClick();
                    handleClose();
                  }}
                  className={`px-6 py-3 bg-gradient-to-r ${gradient} text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                >
                  {ctaText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
