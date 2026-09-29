/* ============================================================
   src/components/pricing/LiveCard.tsx — "Yapılandırmanız"
   ------------------------------------------------------------
   The live configuration. It replaces the decorative object that
   used to sit in this column with the one thing a buyer actually
   wants to watch while configuring: what they are building, and
   what it costs.

   It is the ONLY place a total is rendered, so two live totals can
   never disagree.

   Motion is structural, not decorative:
     • the card is a framer-motion `layout` container, so as lines
       are added or removed it grows and shrinks on a spring rather
       than jumping — the configuration visibly takes shape
     • each line slides in from the right and collapses out
     • the product chip cross-fades when the product changes
     • the price rolls digit by digit (AnimatedPrice)
   ============================================================ */

import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { GoNext, Tick } from './Glyph';
import { Segmented } from './Segmented';
import { AnimatedPrice } from './AnimatedPrice';
import { CYCLE_LABEL, type Copy } from './copy';
import {
  CYCLE_ORDER,
  formatPrice,
  savingPercent,
  type Currency,
  type Cycle,
  type Lang,
  type Product,
} from '../../content/pricing';
import type { Resolved, Step } from '../../content/resolve';

const SPRING = { type: 'spring' as const, stiffness: 380, damping: 34, mass: 0.9 };

export interface LiveCardProps {
  t: Copy;
  lang: Lang;
  currency: Currency;
  cycle: Cycle;
  product: Product | null;
  r: Resolved;
  steps: Step[];
  stepIndex: number;
  onCycle: (c: Cycle) => void;
  onCta: () => void;
  ctaLabel: string;
  /** false while there is nothing to act on yet */
  ctaEnabled: boolean;
  id?: string;
}

export const LiveCard: React.FC<LiveCardProps> = ({
  t,
  lang,
  currency,
  cycle,
  product,
  r,
  steps,
  stepIndex,
  onCycle,
  onCta,
  ctaLabel,
  ctaEnabled,
  id,
}) => {
  const reduced = !!useReducedMotion();
  const layoutT = reduced ? { duration: 0 } : SPRING;
  const hasPlans = !!product && product.plans.length > 0;
  const showPrice = hasPlans && !!r.plan;

  const cycleItems = CYCLE_ORDER.map((c) => {
    const basis = r.plan ? r.composed : (product?.plans[0]?.price[currency] ?? { monthly: null, sixMonth: null, yearly: null });
    const pct = savingPercent(basis, c);
    return { id: c, label: CYCLE_LABEL[lang][c], sub: pct !== null ? (lang === 'tr' ? `−%${pct}` : `−${pct}%`) : undefined };
  });

  const note = !r.plan
    ? ''
    : r.quoteOnly || r.total === null
      ? t.quoteSub
      : cycle === 'monthly'
        ? t.billed.monthly('')
        : t.billed[cycle](formatPrice(r.total, currency, lang));

  return (
    /* a div with role=region, NOT a <section>: index.css forces
       `section { background: transparent !important; padding: 80px 0 }` and,
       on phones, `padding: 2rem 0 !important` — both would gut this card */
    <motion.div layout transition={{ layout: layoutT }} className="pxc-lc" id={id} role="region" aria-label={t.specTitle}>
      <motion.div layout="position" className="pxc-lc-head">
        <span className="pxc-lc-eyebrow">{t.specTitle}</span>
        <AnimatePresence mode="popLayout" initial={false}>
          {product && (
            <motion.span
              key={product.id}
              className="pxc-lc-chip"
              style={{ ['--c' as string]: `var(${product.accent})` }}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
            >
              <i />
              {product[lang].name}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ---- nothing chosen yet: the four steps, as a quiet checklist ---- */}
      {!product && (
        <motion.ol layout className="pxc-lc-empty" initial={false}>
          {(['product', 'package', 'modules', 'summary'] as Step[]).map((s, i) => (
            <li key={s} className={i === 0 ? 'now' : undefined}>
              <span className="n">{i + 1}</span>
              {t.steps[s]}
            </li>
          ))}
        </motion.ol>
      )}

      {/* ---- the lines: the plan, then one per module ---- */}
      {product && (
        <motion.ul layout className="pxc-lc-lines">
          <AnimatePresence initial={false} mode="popLayout">
            {r.items.map((li) => (
              <motion.li
                key={`${li.kind}-${li.id}`}
                layout
                className={li.kind === 'plan' ? 'plan' : 'mod'}
                initial={reduced ? false : { opacity: 0, x: 22 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, x: -14, transition: { duration: 0.18 } }}
                transition={layoutT}
              >
                <span className="l">
                  {li.kind === 'module' && <span className="plus">+</span>}
                  {li.label}
                </span>
                <span className="v">
                  {li.perMonth === null
                    ? t.quoteFigure
                    : li.perMonth === 0
                      ? t.free
                      : `${li.kind === 'module' ? '+' : ''}${formatPrice(li.perMonth, currency, lang)}`}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
          {!r.plan && hasPlans && (
            <motion.li layout key="hint" className="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {t.pickPlanHint}
            </motion.li>
          )}
          {!hasPlans && (
            <motion.li layout key="forming" className="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {t.formingTitle}
            </motion.li>
          )}
        </motion.ul>
      )}

      {/* ---- the money ---- */}
      {hasPlans && (
        <motion.div layout="position" className="pxc-lc-cycle">
          <Segmented items={cycleItems} active={cycle} onChange={onCycle} ariaLabel={t.cycleTitle} block />
        </motion.div>
      )}

      <AnimatePresence initial={false}>
        {showPrice && (
          <motion.div
            layout="position"
            key="price"
            className="pxc-lc-price"
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.32 }}
          >
            <AnimatedPrice
              value={r.quoteOnly ? null : r.monthlyEq}
              currency={currency}
              lang={lang}
              suffix={t.perMonth}
              quoteLabel={t.quoteFigure}
              className="big"
            />
            <AnimatePresence initial={false}>
              {!r.quoteOnly && r.listMonthly !== null && r.listMonthly !== r.monthlyEq && (
                <motion.div
                  key="ref"
                  className="pxc-lc-ref"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.26 }}
                >
                  <span className="ref">
                    <s>{formatPrice(r.listMonthly, currency, lang)}</s>
                    {r.savingPct !== null && <b>{t.savedPct(r.savingPct)}</b>}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <p className="pxc-lc-note">{note}</p>
            {r.firstMonthFree && (
              <p className="pxc-lc-free">
                <Tick size={13} />
                {t.firstMonthPill}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div layout="position" className="pxc-lc-foot">
        <button
          type="button"
          className="pxc-cta solid wide"
          onClick={onCta}
          disabled={!ctaEnabled}
          aria-disabled={!ctaEnabled}
        >
          {ctaLabel}
          <GoNext />
        </button>
        <p className="pxc-lc-step">
          {t.stepOf(Math.min(stepIndex + 1, Math.max(steps.length, 1)), Math.max(steps.length, 4))}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LiveCard;
