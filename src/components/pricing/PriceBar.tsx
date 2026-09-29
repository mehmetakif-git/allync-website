/* ============================================================
   src/components/pricing/PriceBar.tsx — the phone's price surface
   ------------------------------------------------------------
   Two lines on the left, one action on the right. It used to stack
   a pill, a figure and a note into a 72px bar, so the pill sat on
   top of the figure. Now the figure owns the first line and the
   note — with the first-month mark folded into it — the second.

   When nothing is chosen yet it says so, instead of claiming a
   "custom quote" for a configuration that does not exist, and the
   action is disabled rather than doing nothing on tap.

   Positioning is done by the parent (fixed, inline). This element
   carries no bottom-* class name: index.css force-sizes
   `.fixed[class*="bottom"] svg` to 40x40 with !important.
   ============================================================ */

import React from 'react';
import { motion } from 'framer-motion';
import { GoNext } from './Glyph';
import { AnimatedPrice } from './AnimatedPrice';
import type { Copy } from './copy';
import type { Currency, Lang } from '../../content/pricing';

export interface PriceBarProps {
  t: Copy;
  lang: Lang;
  currency: Currency;
  /** null with hasPlan = a quote; null without = nothing chosen yet */
  monthlyEq: number | null;
  quoteOnly: boolean;
  hasPlan: boolean;
  hasProduct: boolean;
  firstMonthFree: boolean;
  note: string;
  ctaLabel: string;
  ctaEnabled: boolean;
  onCta: () => void;
  onOpen: () => void;
}

export const PriceBar: React.FC<PriceBarProps> = ({
  t,
  lang,
  currency,
  monthlyEq,
  quoteOnly,
  hasPlan,
  hasProduct,
  firstMonthFree,
  note,
  ctaLabel,
  ctaEnabled,
  onCta,
  onOpen,
}) => (
  <div className="pxc-bar" id="pxc-price">
    <button type="button" className="pxc-bar-info" onClick={onOpen} disabled={!hasPlan} aria-label={t.breakdown}>
      {hasPlan ? (
        <AnimatedPrice
          value={quoteOnly ? null : monthlyEq}
          currency={currency}
          lang={lang}
          suffix={t.perMonth}
          quoteLabel={t.quoteFigure}
          className="bar"
        />
      ) : (
        <span className="pxc-bar-empty">{hasProduct ? t.pickPlanHint : t.chooseProduct}</span>
      )}
      <span className="pxc-bar-note">
        {firstMonthFree && hasPlan && <i className="free">{t.firstMonthPill}</i>}
        {hasPlan && note && <span className="txt">{note}</span>}
      </span>
    </button>
    <motion.button
      type="button"
      className="pxc-cta solid"
      onClick={onCta}
      disabled={!ctaEnabled}
      aria-disabled={!ctaEnabled}
      whileTap={ctaEnabled ? { scale: 0.97 } : undefined}
    >
      {ctaLabel}
      <GoNext />
    </motion.button>
  </div>
);

export default PriceBar;
