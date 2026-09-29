/* ============================================================
   src/components/pricing/AnimatedPrice.tsx
   ------------------------------------------------------------
   The price, with every digit on its own vertical strip of 0-9.
   A changed digit springs to its new value; unchanged digits do
   not move. Digits are keyed from the RIGHT, so 999 -> 1,000
   rolls the units, tens and hundreds and slides the new leading
   digit in, instead of re-keying the whole number.

   Grouping separators and the currency mark are static. Under
   prefers-reduced-motion the strips jump without animating.
   ============================================================ */

import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { splitPrice, type Currency, type Lang } from '../../content/pricing';

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 26, mass: 0.8 };
const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const Digit: React.FC<{ d: number; reduced: boolean }> = ({ d, reduced }) => (
  <span className="pxc-digit" aria-hidden="true">
    <motion.span
      className="pxc-digit-strip"
      initial={false}
      animate={{ y: `${-d * 10}%` }}
      transition={reduced ? { duration: 0 } : SPRING}
    >
      {DIGITS.map((n) => (
        <span key={n}>{n}</span>
      ))}
    </motion.span>
  </span>
);

export const AnimatedPrice: React.FC<{
  value: number | null;
  currency: Currency;
  lang: Lang;
  suffix?: string;
  quoteLabel: string;
  className?: string;
}> = ({ value, currency, lang, suffix, quoteLabel, className }) => {
  const reduced = !!useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {value === null ? (
        <motion.span
          key="quote"
          className={`pxc-aprice quote${className ? ' ' + className : ''}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28 }}
        >
          {quoteLabel}
        </motion.span>
      ) : (
        <motion.span
          key="figure"
          className={`pxc-aprice${className ? ' ' + className : ''}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28 }}
        >
          <Figure value={value} currency={currency} lang={lang} reduced={reduced} />
          {suffix && <span className="per">{suffix}</span>}
        </motion.span>
      )}
    </AnimatePresence>
  );
};

const Figure: React.FC<{ value: number; currency: Currency; lang: Lang; reduced: boolean }> = ({
  value,
  currency,
  lang,
  reduced,
}) => {
  const { mark, digits } = splitPrice(value, currency, lang);
  const chars = digits.split('');
  return (
    <span className="pxc-aprice-num">
      {/* screen readers get the plain figure, not ten stacked digits each */}
      <span className="pxc-sr">{`${mark}${digits}`}</span>
      <span className="cur" aria-hidden="true">
        {mark.trim()}
      </span>
      <span className="digits" aria-hidden="true">
        {chars.map((c, i) => {
          const fromRight = chars.length - 1 - i;
          return /\d/.test(c) ? (
            <Digit key={`d${fromRight}`} d={Number(c)} reduced={reduced} />
          ) : (
            <span key={`s${fromRight}`} className="sep">
              {c}
            </span>
          );
        })}
      </span>
    </span>
  );
};

export default AnimatedPrice;
