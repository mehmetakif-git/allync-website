/* ============================================================
   src/components/pricing/Sheet.tsx
   ------------------------------------------------------------
   The panel that reference content opens in.

   Positioning is a flex wrapper, not margin arithmetic: the last
   version centred itself with `margin-left: min(-380px, …)`, which
   is the wrong function (it needed max) and pushed the panel 304px
   left of centre at 1440px. A fixed, full-screen flex container
   centres it on desktop and seats it on the bottom edge on phones,
   and framer-motion only ever animates transform/opacity on the
   panel inside — the two never fight over the same property.

   Motion:
     • backdrop fades and blurs in
     • desktop: the panel springs up from 18px below at 96.5% scale
     • phone: a real bottom sheet — springs up from off-screen and
       DRAGS TO DISMISS past 90px or on a fast downward throw
     • the body settles in just behind the frame
     • it EXITS, because AnimatePresence wraps it

   Escape closes, focus is kept inside while open and returned on
   close. Under prefers-reduced-motion it simply appears.
   ============================================================ */

import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'framer-motion';

export interface SheetProps {
  open: boolean;
  title: string;
  closeLabel: string;
  onClose: () => void;
  isMobile: boolean;
  wide?: boolean;
  children: React.ReactNode;
}

const SPRING = { type: 'spring' as const, stiffness: 340, damping: 34, mass: 0.9 };

export const Sheet: React.FC<SheetProps> = ({ open, title, closeLabel, onClose, isMobile, wide, children }) => {
  const reduced = !!useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const node = panelRef.current;
    window.setTimeout(() => node?.focus({ preventScroll: true }), 30);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !node) return;
      const f = node.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      prev?.focus?.();
    };
  }, [open, onClose]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 90 || info.velocity.y > 620) onClose();
  };

  const hidden = reduced
    ? { opacity: 0 }
    : isMobile
      ? { y: '104%', opacity: 1 }
      : { y: 18, scale: 0.965, opacity: 0 };
  const shown = reduced ? { opacity: 1 } : isMobile ? { y: 0, opacity: 1 } : { y: 0, scale: 1, opacity: 1 };
  const gone = reduced ? { opacity: 0 } : isMobile ? { y: '104%', opacity: 1 } : { y: 12, scale: 0.975, opacity: 0 };

  return (
    <AnimatePresence>
      {open && (
        <div className={`pxc-sheetwrap${isMobile ? ' bottom' : ''}`} key="sheet">
          <motion.div
            className="pxc-sheetback"
            aria-hidden="true"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.26 }}
          />
          <motion.div
            ref={panelRef}
            className={`pxc-sheet${wide ? ' wide' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={hidden}
            animate={shown}
            exit={gone}
            transition={reduced ? { duration: 0 } : SPRING}
            drag={isMobile && !reduced ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.02, bottom: 0.34 }}
            onDragEnd={onDragEnd}
          >
            {isMobile && <div className="pxc-handle" aria-hidden="true" />}
            <div className="pxc-sheet-head">
              <p className="pxc-sheettitle">{title}</p>
              <button type="button" className="pxc-sheet-x" onClick={onClose} aria-label={closeLabel}>
                <svg className="pxc-g" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                </svg>
              </button>
            </div>
            <motion.div
              className="pxc-sheet-body"
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.36, delay: reduced ? 0 : 0.08, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Sheet;
