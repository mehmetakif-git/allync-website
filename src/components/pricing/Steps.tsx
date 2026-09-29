/* ============================================================
   src/components/pricing/Steps.tsx
   ------------------------------------------------------------
   The step bodies. Presentational only: every figure comes from
   resolve(), nothing here does arithmetic.

   Motion:
     • lists enter on a stagger (framer-motion variants)
     • the SELECTION is one element with a shared layoutId, so when
       you pick a different card the highlight travels to it instead
       of blinking off one and on the other
     • cards press in on tap

   Accessibility contracts that are load-bearing, not decoration:
     • product and plan pickers are radiogroups with a roving
       tabindex — one tab stop, arrow keys move within
     • module toggles are REAL checkboxes, visually hidden with a
       1px clip (not display:none) so they stay focusable, with the
       price delta wired through aria-describedby
     • the only multi-select step has an explicit Continue button;
       nothing auto-advances on a multi-select
   ============================================================ */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Disclose, GoNext, Tick } from './Glyph';
import { CYCLE_PROSE, type Copy } from './copy';
import {
  formatPrice,
  monthlyEquivalent,
  savingPercent,
  type Currency,
  type Cycle,
  type Feature,
  type Lang,
  type Plan,
  type Product,
} from '../../content/pricing';
import { PRODUCTS } from '../../content/catalog';
import type { Resolved } from '../../content/resolve';

export type Rect = { left: number; top: number; width: number; height: number };

const EASE = [0.22, 0.61, 0.36, 1] as const;
const SPRING = { type: 'spring' as const, stiffness: 420, damping: 36, mass: 0.8 };

const listV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.065, delayChildren: 0.06 } },
};
const itemV: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.46, ease: EASE } },
};

/* ---------- a roving-tabindex radiogroup ---------- */
function useRoving(count: number, index: number, onPick: (i: number) => void) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let n = index;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (index + 1 + count) % count;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (index - 1 + count) % count;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = count - 1;
      else return;
      e.preventDefault();
      onPick(n);
      refs.current[n]?.focus();
    },
    [count, index, onPick],
  );
  return { refs, onKeyDown };
}

/* ============================================================
   STEP 1 — PRODUCT
   ============================================================ */
export const StepProduct: React.FC<{
  t: Copy;
  lang: Lang;
  activeId: string | null;
  onPick: (id: string) => void;
}> = ({ t, lang, activeId, onPick }) => {
  const reduced = !!useReducedMotion();
  const idx = Math.max(0, PRODUCTS.findIndex((p) => p.id === activeId));
  const { refs, onKeyDown } = useRoving(PRODUCTS.length, idx, (i) => onPick(PRODUCTS[i].id));

  return (
    <fieldset onKeyDown={onKeyDown}>
      <legend className="pxc-sr">{t.q_product}</legend>
      <motion.div
        className="pxc-cards"
        role="radiogroup"
        aria-label={t.q_product}
        variants={listV}
        initial={reduced ? false : 'hidden'}
        animate="show"
      >
        {PRODUCTS.map((p, i) => {
          const checked = p.id === activeId;
          return (
            <motion.button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked || (!activeId && i === 0) ? 0 : -1}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className="pxc-card"
              style={{ ['--c' as string]: `var(${p.accent})` }}
              onClick={() => onPick(p.id)}
              variants={itemV}
              whileTap={reduced ? undefined : { scale: 0.985 }}
            >
              {checked && <motion.span layoutId="pxc-prod-ring" className="pxc-ring" transition={SPRING} />}
              <span className="mark" aria-hidden="true">
                <i />
              </span>
              <span className="body">
                <span className="name">{p[lang].name}</span>
                <span className="tag">{p[lang].tagline}</span>
                <span className="status">
                  {p.plans.length > 0 ? t.planCount(p.plans.length) : <span className="soon">{t.soon}</span>}
                </span>
              </span>
              <span className="tick" aria-hidden="true">
                <Tick size={16} />
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </fieldset>
  );
};

/* ============================================================
   STEP 2 — SCALE (only when a product defines one). Its ONLY job
   is to set the recommendation; it never multiplies a price.
   ============================================================ */
export const StepScale: React.FC<{
  t: Copy;
  lang: Lang;
  product: Product;
  activeId: string | null;
  onPick: (id: string) => void;
  onSkip: () => void;
}> = ({ t, lang, product, activeId, onPick, onSkip }) => {
  const opts = product.scale?.options ?? [];
  const idx = Math.max(0, opts.findIndex((o) => o.id === activeId));
  const { refs, onKeyDown } = useRoving(opts.length, idx, (i) => onPick(opts[i].id));
  return (
    <fieldset onKeyDown={onKeyDown}>
      <legend className="pxc-sr">{product.scale?.[lang]}</legend>
      <motion.div className="pxc-chips" role="radiogroup" variants={listV} initial="hidden" animate="show">
        {opts.map((o, i) => {
          const checked = o.id === activeId;
          const sub = lang === 'tr' ? o.trSub : o.enSub;
          return (
            <motion.button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked || (!activeId && i === 0) ? 0 : -1}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className="pxc-bigchip"
              onClick={() => onPick(o.id)}
              variants={itemV}
            >
              <span className="l">{o[lang]}</span>
              {sub && <span className="s">{sub}</span>}
            </motion.button>
          );
        })}
      </motion.div>
      <button type="button" className="pxc-quiet" onClick={onSkip}>
        {t.skip}
      </button>
    </fieldset>
  );
};

/* ---------- the entry pitch: "Eskiden -> Allync Hub ile" ---------- */
export const Hero: React.FC<{ lang: Lang; product: Product }> = ({ lang, product }) => {
  const h = product.hero?.[lang];
  if (!h) return null;
  return (
    <motion.div className="pxc-hero" variants={listV} initial="hidden" animate="show">
      <motion.p className="pxc-script" variants={itemV}>
        {h.script}
      </motion.p>
      <motion.p className="pxc-herosub" variants={itemV}>
        {h.sub}
      </motion.p>
      <motion.div className="pxc-ba" variants={itemV}>
        <div>
          <p className="pxc-sechead">{h.beforeTitle}</p>
          <ul className="pxc-balist before">
            {h.before.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="pxc-sechead accent">{h.afterTitle}</p>
          <ul className="pxc-balist after">
            {h.after.map((x) => (
              <li key={x}>
                <Tick size={14} />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ============================================================
   STEP 3 — PACKAGE
   First press SELECTS a plan (the live card fills in, the ring
   travels to it); a second press on the same plan moves on. That
   keeps the plans comparable while the buyer is still deciding.
   ============================================================ */
export const StepPackage: React.FC<{
  t: Copy;
  lang: Lang;
  currency: Currency;
  cycle: Cycle;
  product: Product;
  activeId: string | null;
  recommendedId: string | null;
  onPick: (plan: Plan, rect: Rect) => void;
  onLimits: (planId: string) => void;
  showHero: boolean;
  /** rendered between the hero and the plan cards (the phone's cycle control) */
  beforePlans?: React.ReactNode;
}> = ({ t, lang, currency, cycle, product, activeId, recommendedId, onPick, onLimits, showHero, beforePlans }) => {
  const reduced = !!useReducedMotion();
  return (
    <>
      {showHero && <Hero lang={lang} product={product} />}
      {beforePlans}

      <motion.div
        className="pxc-plans"
        role="radiogroup"
        aria-label={t.q_package}
        variants={listV}
        initial={reduced ? false : 'hidden'}
        animate="show"
      >
        {product.plans.map((p) => {
          const per = monthlyEquivalent(p.price[currency], cycle);
          const list = cycle === 'monthly' ? null : p.price[currency].monthly;
          const total = p.price[currency][cycle];
          const pct = savingPercent(p.price[currency], cycle);
          const stats = p.stats[lang];
          const checked = p.id === activeId;
          const recommended = recommendedId === p.id;

          return (
            <motion.div
              key={p.id}
              className={`pxc-plan${recommended ? ' is-rec' : ''}${checked ? ' is-on' : ''}`}
              variants={itemV}
              role="radio"
              aria-checked={checked}
            >
              {checked && <motion.span layoutId="pxc-plan-ring" className="pxc-ring" transition={SPRING} />}

              <div className="pxc-plan-top">
                <h3 className="name">{p[lang].name}</h3>
                {(p[lang].badge || recommended) && <span className="rec">{p[lang].badge ?? t.recommended}</span>}
              </div>
              <p className="pitch">{p[lang].pitch}</p>

              <div className="pricebox">
                {p.firstMonthFree !== false && (
                  <span className="pxc-freepill sm">
                    <i />
                    {t.firstMonthPill}
                  </span>
                )}
                {per === null ? (
                  <>
                    <div className="fig">{t.quoteFigure}</div>
                    <p className="billed">{t.quoteSub}</p>
                  </>
                ) : (
                  <>
                    <div className="fig">
                      {formatPrice(per, currency, lang)}
                      <span className="per">{t.perMonth}</span>
                    </div>
                    <p className="reference">
                      {list !== null && list !== per && <s>{formatPrice(list, currency, lang)}</s>}
                      {pct !== null && <b>{t.savedPct(pct)}</b>}
                    </p>
                    <p className="billed">{total === null ? '' : t.billed[cycle](formatPrice(total, currency, lang))}</p>
                  </>
                )}
              </div>

              <dl className="stats">
                <div>
                  <dt>{t.statUsers}</dt>
                  <dd>{stats.users}</dd>
                </div>
                <div>
                  <dt>{t.statWhatsapp}</dt>
                  <dd>{stats.whatsapp}</dd>
                </div>
                <div>
                  <dt>{t.statInstagram}</dt>
                  <dd>{stats.instagram}</dd>
                </div>
                <div>
                  <dt>{t.statReplies}</dt>
                  <dd>{stats.replies}</dd>
                </div>
              </dl>

              <ul className="bullets">
                {p[lang].features.map((f) => (
                  <li key={f}>
                    <Tick size={14} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                type="button"
                className={`pxc-cta wide${checked || recommended ? ' solid' : ''}`}
                aria-pressed={checked}
                onClick={(e) => onPick(p, (e.currentTarget as HTMLElement).getBoundingClientRect())}
                whileTap={reduced ? undefined : { scale: 0.98 }}
              >
                {checked ? t.cont : p[lang].cta}
                <GoNext />
              </motion.button>

              {checked && (
                <motion.p className="talk" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
                  {t.talkToTeam}
                </motion.p>
              )}

              <button type="button" className="inc" onClick={() => onLimits(p.id)}>
                {t.planLimits}
                <Disclose size={14} />
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
};

/* ============================================================
   STEP 4 — MODULES
   ============================================================ */
export const StepModules: React.FC<{
  t: Copy;
  lang: Lang;
  currency: Currency;
  product: Product;
  r: Resolved;
  onToggle: (f: Feature, rect: Rect, willBeOn: boolean, turnOff: string[]) => void;
  onSwap: (planId: string) => void;
}> = ({ t, lang, currency, product, r, onToggle, onSwap }) => {
  const reduced = !!useReducedMotion();
  const groups = product.groups ?? [];
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const byId = useMemo(() => {
    const m: Record<string, Feature> = {};
    (product.features ?? []).forEach((f) => {
      m[f.id] = f;
    });
    return m;
  }, [product.features]);

  const grouped = useMemo(
    () => groups.map((g) => ({ g, items: r.pickable.filter((f) => f.group === g.id) })).filter((x) => x.items.length > 0),
    [groups, r.pickable],
  );

  /* The FIRST VISIBLE group opens by default. This used to read `defaultOpen`
     from the catalogue — but the group marked open ("Allync AI") is empty on
     Pro, where voice is already included, so every visible group started
     collapsed and the step presented nothing to interact with. A group that
     already has something switched on also opens. */
  const firstVisible = grouped[0]?.g.id;
  const isOpen = (id: string, items: Feature[]) =>
    open[id] ?? (id === firstVisible || items.some((f) => r.active.includes(f.id)));

  const [pill, setPill] = useState<{ id: string; text: string; minus: boolean } | null>(null);
  const flash = (id: string, text: string, minus: boolean) => {
    setPill({ id, text, minus });
    window.setTimeout(() => setPill((p) => (p && p.id === id ? null : p)), 1300);
  };

  return (
    <>
      <motion.div variants={listV} initial={reduced ? false : 'hidden'} animate="show">
        {grouped.map(({ g, items }) => {
          const onCount = items.filter((f) => r.active.includes(f.id)).length;
          const opened = isOpen(g.id, items);
          return (
            <motion.div className="pxc-group" key={g.id} variants={itemV}>
              <button
                type="button"
                className="pxc-ghead"
                aria-expanded={opened}
                onClick={() => setOpen((o) => ({ ...o, [g.id]: !opened }))}
              >
                <span className="t">{g[lang]}</span>
                <span className="n">{t.groupCount(onCount, items.length)}</span>
                <motion.span className="chev" animate={{ rotate: opened ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <Disclose size={15} />
                </motion.span>
              </button>

              <motion.div
                className="pxc-rows"
                initial={false}
                animate={opened ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.32, ease: EASE }}
                style={{ overflow: 'hidden' }}
              >
                {items.map((f) => {
                  const on = r.active.includes(f.id);
                  const unmet = (f.requires ?? []).filter((id) => !r.active.includes(id));
                  const blocked = unmet.length > 0 && !on;
                  const delta = f.priceDelta ? f.priceDelta[currency] : undefined;
                  const descId = `pxc-desc-${f.id}`;
                  return (
                    <label key={f.id} className={`pxc-mod${on ? ' on' : ''}${blocked ? ' off' : ''}`}>
                      <input
                        type="checkbox"
                        checked={on}
                        disabled={blocked}
                        aria-describedby={delta !== undefined ? descId : undefined}
                        onChange={(e) => {
                          const host = e.currentTarget.closest('.pxc-mod') as HTMLElement | null;
                          const rect = host ? host.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
                          const willBeOn = !on;
                          const turnOff = willBeOn ? (f.conflicts ?? []).filter((id) => r.active.includes(id)) : [];
                          onToggle(f, rect, willBeOn, turnOff);
                          if (turnOff.length) {
                            const first = byId[turnOff[0]];
                            if (first) flash(f.id, t.switchedOff(first[lang].name), true);
                          }
                        }}
                      />
                      <span className="disc" aria-hidden="true">
                        <motion.i
                          initial={false}
                          animate={on ? { scale: [0.8, 1.12, 1] } : { scale: 1 }}
                          transition={{ duration: 0.32 }}
                        >
                          <Tick size={13} />
                        </motion.i>
                      </span>
                      <span className="txt">
                        <span className="nm">{f[lang].name}</span>
                        {(blocked || f[lang].hint) && (
                          <span className="hint">
                            {blocked
                              ? t.requiresHint(unmet.map((id) => byId[id]?.[lang].name ?? id).join(', '))
                              : f[lang].hint}
                          </span>
                        )}
                      </span>
                      {delta !== undefined && (
                        <span id={descId} className={`delta${delta === null ? ' quote' : ''}`}>
                          {delta === null ? t.quoteFigure : `+${formatPrice(delta, currency, lang)}`}
                        </span>
                      )}
                      {pill && pill.id === f.id && (
                        <motion.span
                          className={`pxc-pill${pill.minus ? ' minus' : ''}`}
                          initial={{ opacity: 0, y: 6, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                        >
                          {pill.text}
                        </motion.span>
                      )}
                    </label>
                  );
                })}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {r.nudge && (
        <button type="button" className="pxc-note" onClick={() => onSwap(r.nudge!.planId)}>
          {t.nudge(r.nudge.label)}
          <GoNext size={14} />
        </button>
      )}

    </>
  );
};

/* ============================================================
   STEP 5 — SUMMARY
   The receipt and the price live in the live card; this is what
   the buyer should know before talking to the team.
   ============================================================ */
export const StepSummary: React.FC<{
  t: Copy;
  lang: Lang;
  currency: Currency;
  cycle: Cycle;
  product: Product;
  r: Resolved;
  onCopy: () => void;
  copied: boolean;
  termsHref: string;
  onOpen: (panel: 'compare' | 'faq' | 'addons') => void;
}> = ({ t, lang, currency, cycle, product, r, onCopy, copied, termsHref, onOpen }) => {
  const zero = formatPrice(0, currency, lang);
  const sentence =
    r.quoteOnly || r.total === null
      ? t.quoteReason[r.quoteReason === 'none' ? 'plan' : r.quoteReason]
      : t.costSentence({
          zero,
          cycle: CYCLE_PROSE[lang][cycle],
          total: formatPrice(r.total, currency, lang),
          perMonth: cycle === 'monthly' || r.monthlyEq === null ? null : formatPrice(r.monthlyEq, currency, lang),
          pct: r.savingPct,
        });

  return (
    <motion.div variants={listV} initial="hidden" animate="show">
      <motion.p className="pxc-sentence" variants={itemV}>
        {sentence}
      </motion.p>

      {product.notes && (
        <motion.div className="pxc-notes" variants={listV}>
          {product.notes[lang].map((n) => (
            <motion.div key={n.title} className="pxc-noteblock" variants={itemV}>
              <p className="t">{n.title}</p>
              <p className="b">{n.body}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div className="pxc-refbar" variants={itemV}>
        {product.compare && (
          <button type="button" className="pxc-ref-link" onClick={() => onOpen('compare')}>
            {t.comparePlans}
            <GoNext size={13} />
          </button>
        )}
        {product.addOns && (
          <button type="button" className="pxc-ref-link" onClick={() => onOpen('addons')}>
            {t.addOnsTitle}
            <GoNext size={13} />
          </button>
        )}
        {product.faq && (
          <button type="button" className="pxc-ref-link" onClick={() => onOpen('faq')}>
            {t.faqTitle}
            <GoNext size={13} />
          </button>
        )}
      </motion.div>

      <motion.p className="pxc-fine" variants={itemV}>
        {product.finePrint?.[lang]} <a href={termsHref}>{t.terms}</a>
      </motion.p>
      <motion.p className="pxc-fine" variants={itemV}>
        {t.talkToTeam}
      </motion.p>
      <motion.div variants={itemV}>
        <button type="button" className="pxc-quiet" onClick={onCopy}>
          {copied ? t.copied : t.copyConfig}
        </button>
      </motion.div>
    </motion.div>
  );
};
