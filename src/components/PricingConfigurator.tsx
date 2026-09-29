/* ============================================================
   src/components/PricingConfigurator.tsx   —   route root for /pricing
   ------------------------------------------------------------
   Service first, then plan, then add-on modules, then a summary —
   with the configuration assembling itself live beside the steps.

   DESKTOP  a rail (brand, steps, currency, language) over two
            columns: the LIVE CARD on the left, the step on the
            right. The live card is where the price lives; it grows
            and shrinks on a spring as the configuration changes.
   PHONE    a header (back, step, currency, language), one scroll
            container for the step, and a two-line price bar. The
            live card appears inline at the summary.

   There is deliberately no decorative object on this page. Motion
   is reserved for things that change: the configuration taking
   shape, the selection travelling between cards, the price rolling.

   Root position is INLINE: `#root > div` (index.css:49-53) carries
   ID specificity and would silently beat any class-based position.
   No Navigation, no Footer, no FloatingLines, no <section> layouts.
   ============================================================ */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import './pricing/configurator.css';
import logo from '../assets/logo.svg';
import { GoBack } from './pricing/Glyph';
import { COPY, CYCLE_LABEL } from './pricing/copy';
import { Segmented } from './pricing/Segmented';
import { useConfig } from './pricing/useConfig';
import { LiveCard } from './pricing/LiveCard';
import { PriceBar } from './pricing/PriceBar';
import Sheet from './pricing/Sheet';
import { buildInquiry, stashInquiry } from './pricing/inquiry';
import { StepModules, StepPackage, StepProduct, StepScale, StepSummary, type Rect } from './pricing/Steps';
import {
  AddOnsPanel,
  ComparePanel,
  FaqPanel,
  FormingPanel,
  LimitsList,
  QuotePanel,
  specBlock,
} from './pricing/Panels';
import {
  CURRENCY_ORDER,
  CYCLE_ORDER,
  formatPrice,
  savingPercent,
  type Currency,
  type Cycle,
  type Feature,
  type Plan,
} from '../content/pricing';
import { PRODUCTS } from '../content/catalog';
import { resolve, stepsFor, type Step } from '../content/resolve';
import { lockScroll, unlockScroll } from '../utils/scrollLock';

const CONTACT = '/digital/contact';
const MOBILE_Q = '(max-width: 899px)';
const EASE = [0.22, 0.61, 0.36, 1] as const;

const useMedia = (query: string) => {
  const [hit, setHit] = useState(() => {
    try {
      return window.matchMedia(query).matches;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    let mq: MediaQueryList;
    try {
      mq = window.matchMedia(query);
    } catch {
      return;
    }
    const on = () => setHit(mq.matches);
    on();
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, [query]);
  return hit;
};

const CYCLE_CODE: Record<Cycle, string> = { monthly: 'm', sixMonth: '6m', yearly: 'y' };

const Inner: React.FC = () => {
  const { cfg, dispatch, product, shareUrl } = useConfig();
  const navigate = useNavigate();
  const isMobile = useMedia(MOBILE_Q);
  const reduced = !!useReducedMotion();

  const t = COPY[cfg.lang];
  const { lang, currency, cycle } = cfg;

  const r = useMemo(
    () => resolve(product, { planId: cfg.planId, scaleId: cfg.scaleId, on: cfg.on }, lang, cycle, currency),
    [product, cfg.planId, cfg.scaleId, cfg.on, lang, cycle, currency],
  );
  const steps = useMemo(() => stepsFor(product, r), [product, r]);
  const stepIndex = Math.max(0, steps.indexOf(cfg.step));
  const step: Step = steps[stepIndex] ?? 'product';

  /* the step list is computed, so a step can disappear under us: clamp */
  useEffect(() => {
    if (!steps.includes(cfg.step)) dispatch({ t: 'step', v: steps[steps.length - 1] });
  }, [steps, cfg.step, dispatch]);

  /* a stale shared link must never silently price something else */
  useEffect(() => {
    if (r.dropped.length) dispatch({ t: 'notice', v: 'dropped' });
  }, [r.dropped.length, dispatch]);

  /* focus the arrived step's heading without yanking the scroll */
  const headRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    headRef.current?.focus({ preventScroll: true });
  }, [step]);

  /* a new step starts at the top of its own scroll container */
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [step, cfg.productId]);

  /* the page owns the viewport; go through scrollLock, never body.style */
  useEffect(() => {
    lockScroll();
    window.scrollTo(0, 0);
    return () => unlockScroll();
  }, []);

  const [copied, setCopied] = useState(false);
  const copy = useCallback((text: string) => {
    try {
      void navigator.clipboard?.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the URL is still in the address bar */
    }
  }, []);

  const url = shareUrl();
  const spec = product ? specBlock(lang, currency, cycle, product, r, url) : '';

  const goto = (s: Step) => dispatch({ t: 'step', v: s });
  const next = () => {
    const i = steps.indexOf(step);
    if (i >= 0 && i < steps.length - 1) goto(steps[i + 1]);
  };
  const back = () => {
    const i = steps.indexOf(step);
    if (i > 0) goto(steps[i - 1]);
  };

  const pickProduct = (id: string) => {
    dispatch({ t: 'product', v: id });
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    /* a short confirm beat, then move on — no Next button on a single-select */
    window.setTimeout(() => {
      if (p.plans.length === 0) goto('quote');
      else if (p.scale && p.scale.options.length > 1) goto('scale');
      else if (p.plans.length > 1) goto('package');
      else goto('summary');
    }, 320);
  };

  const pickPlan = (plan: Plan, _rect: Rect) => {
    const already = cfg.planId === plan.id;
    dispatch({ t: 'plan', v: plan.id, preset: plan.preset });
    if (already) next();
  };

  const toggle = (f: Feature, _rect: Rect, _willBeOn: boolean, turnOff: string[]) => {
    dispatch({ t: 'toggle', v: f.id, off: turnOff });
  };

  /* ---------- the one action, and whether it can act ---------- */
  const atEnd = step === 'summary' || step === 'quote';
  const ctaEnabled =
    step === 'product' ? !!product : step === 'package' ? !!r.plan : true;
  const ctaLabel = atEnd ? (r.quoteOnly ? t.requestQuote : t.summaryCta) : t.cont;
  /* the configuration's own address, built from state rather than read back
     from the location bar — the hash is written on a debounce and may lag */
  const configUrl = () => {
    const q = new URLSearchParams();
    if (cfg.productId) q.set('p', cfg.productId);
    if (cfg.planId) q.set('t', cfg.planId);
    if (cfg.on.length) q.set('f', cfg.on.join(','));
    q.set('c', CYCLE_CODE[cycle]);
    q.set('u', currency);
    q.set('l', lang);
    return `https://www.allyncai.com/pricing#${q.toString()}`;
  };

  /* hand the whole configuration to the contact form as a ready message,
     instead of navigating there empty-handed */
  const requestContact = () => {
    if (!product) {
      navigate(CONTACT);
      return;
    }
    const inquiry = buildInquiry(lang, currency, cycle, product, r, configUrl());
    stashInquiry(inquiry);
    /* written synchronously here — the usual mirror is debounced by 500ms, and
       someone who switches to English and presses at once must still land on
       an English contact form */
    try {
      window.localStorage.setItem('allync_language', lang);
    } catch {
      /* private mode */
    }
    navigate(CONTACT, { state: { inquiry } });
  };

  const onCta = () => {
    if (!ctaEnabled) return;
    if (atEnd) requestContact();
    else next();
  };

  const barNote = !r.plan
    ? ''
    : r.quoteOnly || r.total === null
      ? t.quoteSub
      : cycle === 'monthly'
        ? t.billedShort.monthly('')
        : t.billedShort[cycle](formatPrice(r.total, currency, lang));

  const heading =
    step === 'product'
      ? t.q_product
      : step === 'scale'
        ? (product?.scale?.[lang] ?? t.steps.scale)
        : step === 'package'
          ? (product?.hero?.[lang].title ?? t.q_package)
          : step === 'modules'
            ? t.q_modules
            : step === 'summary'
              ? t.q_summary
              : product && product.plans.length === 0
                ? product[lang].name
                : t.quoteTitle;

  const lead =
    step === 'modules' ? t.modulesLead : step === 'product' ? null : null;

  const openSheet = (v: 'compare' | 'faq' | 'addons') => dispatch({ t: 'sheet', v });

  /* the cycle control, with each chip DERIVED — absent when not derivable */
  const cycleItems = CYCLE_ORDER.map((c) => {
    const basis = r.plan ? r.composed : (product?.plans[0]?.price[currency] ?? { monthly: null, sixMonth: null, yearly: null });
    const pct = savingPercent(basis, c);
    return { id: c, label: CYCLE_LABEL[lang][c], sub: pct !== null ? (lang === 'tr' ? `−%${pct}` : `−${pct}%`) : undefined };
  });
  const currencyItems = CURRENCY_ORDER.map((c) => ({ id: c, label: c }));
  const hasPlans = !!product && product.plans.length > 0;

  const liveCard = (
    <LiveCard
      t={t}
      lang={lang}
      currency={currency}
      cycle={cycle}
      product={product}
      r={r}
      steps={steps}
      stepIndex={stepIndex}
      onCycle={(c) => dispatch({ t: 'cycle', v: c })}
      onCta={onCta}
      ctaLabel={ctaLabel}
      ctaEnabled={ctaEnabled}
      id={isMobile ? undefined : 'pxc-price'}
    />
  );

  const body = (
    <>
      {step === 'product' && <StepProduct t={t} lang={lang} activeId={cfg.productId} onPick={pickProduct} />}
      {step === 'scale' && product && (
        <StepScale
          t={t}
          lang={lang}
          product={product}
          activeId={cfg.scaleId}
          onPick={(id) => {
            dispatch({ t: 'scale', v: id });
            window.setTimeout(next, 260);
          }}
          onSkip={next}
        />
      )}
      {step === 'package' && product && (
        <>
          <StepPackage
            t={t}
            lang={lang}
            currency={currency}
            cycle={cycle}
            product={product}
            activeId={cfg.planId}
            recommendedId={r.recommendedId}
            onPick={pickPlan}
            onLimits={(planId) => dispatch({ t: 'sheet', v: 'limits', arg: planId })}
            showHero
            beforePlans={
              /* on a phone there is no live card beside the plans, so the cycle
                 control sits directly above them; on desktop it lives in the card */
              isMobile && hasPlans ? (
                <div className="pxc-inline-cycle">
                  <Segmented
                    items={cycleItems}
                    active={cycle}
                    onChange={(c: Cycle) => dispatch({ t: 'cycle', v: c })}
                    ariaLabel={t.cycleTitle}
                    block
                  />
                </div>
              ) : null
            }
          />
        </>
      )}
      {step === 'modules' && product && (
        <StepModules
          t={t}
          lang={lang}
          currency={currency}
          product={product}
          r={r}
          onToggle={toggle}
          onSwap={(id) => dispatch({ t: 'swapPlan', v: id })}
        />
      )}
      {step === 'summary' && product && (
        <>
          {isMobile && <div className="pxc-inline-live pxc-nofoot">{liveCard}</div>}
          <StepSummary
            t={t}
            lang={lang}
            currency={currency}
            cycle={cycle}
            product={product}
            r={r}
            onCopy={() => copy(spec)}
            copied={copied}
            termsHref="/terms"
            onOpen={openSheet}
          />
        </>
      )}
      {step === 'quote' &&
        product &&
        (product.plans.length === 0 ? (
          <FormingPanel t={t} lang={lang} product={product} onRequest={requestContact} />
        ) : (
          <QuotePanel
            t={t}
            lang={lang}
            product={product}
            r={r}
            onRequest={requestContact}
            spec={spec}
            onCopy={() => copy(spec)}
            copied={copied}
          />
        ))}
    </>
  );

  const notice = cfg.notice === 'cleared' ? t.clearedNotice : cfg.notice === 'dropped' ? t.droppedNotice : null;
  /* never read "complete" on step one just because the flow is not known yet */
  const progress = `${((stepIndex + 1) / Math.max(steps.length, 4)) * 100}%`;

  const sheetTitle =
    cfg.sheet === 'limits'
      ? t.planLimits
      : cfg.sheet === 'compare'
        ? t.comparePlans
        : cfg.sheet === 'addons'
          ? t.addOnsTitle
          : cfg.sheet === 'faq'
            ? t.faqTitle
            : t.specTitle;

  const stepMotion = {
    initial: reduced ? { opacity: 0 } : isMobile ? { opacity: 0, y: 18 } : { opacity: 0, x: 24 },
    animate: reduced ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 },
    exit: reduced ? { opacity: 0 } : isMobile ? { opacity: 0, y: -12 } : { opacity: 0, x: -18 },
    transition: { duration: reduced ? 0.12 : 0.34, ease: EASE },
  };

  const stepHead = (
    <>
      <h2 className={isMobile ? 'pxc-mq' : 'pxc-q'} ref={headRef} tabIndex={-1}>
        {heading}
      </h2>
      {lead && <p className="pxc-lead">{lead}</p>}
      {notice && <p className="pxc-note plain">{notice}</p>}
    </>
  );

  return (
    <div
      className="pxc"
      lang={lang}
      data-product={product?.id ?? 'none'}
      style={{ position: 'fixed', left: 0, right: 0, top: 0, zIndex: 0, overflow: 'hidden' }}
    >
      <Helmet>
        <html lang={lang} />
        <title>{t.metaTitle}</title>
        <meta name="description" content={t.metaDesc} />
        <link rel="canonical" href="https://www.allyncai.com/pricing" />
        <link rel="alternate" hrefLang="tr" href="https://www.allyncai.com/pricing" />
        <link rel="alternate" hrefLang="en" href="https://www.allyncai.com/pricing" />
        <link rel="alternate" hrefLang="x-default" href="https://www.allyncai.com/pricing" />
        <meta property="og:title" content={t.metaTitle} />
        <meta property="og:description" content={t.metaDesc} />
        <meta property="og:url" content="https://www.allyncai.com/pricing" />
      </Helmet>

      <div className="pxc-floor" aria-hidden="true">
        <i className="pxc-haze a" />
        <i className="pxc-haze b" />
        <i className="pxc-grain" />
      </div>
      <div className="pxc-scrim" aria-hidden="true" />

      <a href="#pxc-price" className="pxc-sr">
        {t.skipToPrice}
      </a>

      {isMobile ? (
        /* ================= PHONE ================= */
        <div className="pxc-ui pxc-ui-m">
          <header className="pxc-mchrome">
            {stepIndex === 0 ? (
              <Link to="/" className="pxc-hit" aria-label={t.home}>
                <GoBack size={18} />
              </Link>
            ) : (
              <button type="button" className="pxc-hit" onClick={back} aria-label={t.back}>
                <GoBack size={18} />
              </button>
            )}
            <span className="pxc-mstep">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={step}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {t.steps[step]}
                </motion.span>
              </AnimatePresence>
            </span>
            {/* grouped, so the header can be a 1fr/auto/1fr grid and the step
                name sits on the true centre of the screen whatever is on the right */}
            <div className="pxc-mright">
              {hasPlans && (
                <button
                  type="button"
                  className="pxc-hit pxc-cur"
                  onClick={() => dispatch({ t: 'currency', v: currency === 'USD' ? 'TRY' : 'USD' })}
                  aria-label={t.currencyTitle}
                >
                  {currency}
                </button>
              )}
              <button
                type="button"
                className="pxc-hit pxc-langbtn"
                onClick={() => dispatch({ t: 'lang', v: lang === 'tr' ? 'en' : 'tr' })}
                aria-label={t.langSwitch}
              >
                {lang === 'tr' ? 'EN' : 'TR'}
              </button>
            </div>
          </header>
          <div className="pxc-mprog">
            <motion.i animate={{ width: progress }} transition={{ duration: reduced ? 0 : 0.5, ease: EASE }} />
          </div>

          <div className="pxc-mtray" ref={scrollRef}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={`${step}-${cfg.productId}`} className="pxc-step" {...stepMotion}>
                {stepHead}
                {body}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="pxc-barwrap">
            <PriceBar
              t={t}
              lang={lang}
              currency={currency}
              monthlyEq={r.monthlyEq}
              quoteOnly={r.quoteOnly}
              hasPlan={!!r.plan}
              hasProduct={!!product}
              firstMonthFree={r.firstMonthFree}
              note={barNote}
              ctaLabel={atEnd ? (r.quoteOnly ? t.requestQuote : t.summaryCtaShort) : ctaLabel}
              ctaEnabled={ctaEnabled}
              onCta={onCta}
              onOpen={() => dispatch({ t: 'sheet', v: 'breakdown' })}
            />
          </div>
        </div>
      ) : (
        /* ================= DESKTOP ================= */
        <div className="pxc-ui">
          <header className="pxc-rail">
            <div className="pxc-rail-in">
              <div className="pxc-brand">
                <Link to="/" aria-label={t.home}>
                  <img src={logo} alt="Allync" />
                </Link>
              </div>

              {/* role=navigation on a div: index.css gives every <nav> a 1rem
                  safe-area padding-top that would drop these words off-centre */}
              <div className="pxc-steps" role="navigation" aria-label={t.eyebrow}>
                {(steps.length >= 2 ? steps : (['product', 'package', 'modules', 'summary'] as Step[])).map((s, i) => {
                  const done = i < stepIndex;
                  const live = i === stepIndex;
                  return (
                    <React.Fragment key={s}>
                      {i > 0 && <span className="pxc-step-dot" aria-hidden="true" />}
                      {done ? (
                        <button type="button" className="pxc-step-word done" onClick={() => goto(s)}>
                          <span className="num">{i + 1}</span>
                          {t.steps[s]}
                        </button>
                      ) : (
                        <span className={`pxc-step-word${live ? ' live' : ''}`} aria-current={live ? 'step' : undefined}>
                          <span className="num">{i + 1}</span>
                          {t.steps[s]}
                          {live && <motion.span layoutId="pxc-step-underline" className="pxc-step-underline" />}
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="pxc-rail-right">
                {hasPlans && (
                  <Segmented
                    items={currencyItems}
                    active={currency}
                    onChange={(c: Currency) => dispatch({ t: 'currency', v: c })}
                    ariaLabel={t.currencyTitle}
                  />
                )}
                <button
                  type="button"
                  className="pxc-lang"
                  onClick={() => dispatch({ t: 'lang', v: lang === 'tr' ? 'en' : 'tr' })}
                  aria-label={t.langSwitch}
                >
                  {lang === 'tr' ? 'EN' : 'TR'}
                </button>
              </div>
            </div>
            <div className="pxc-prog">
              <motion.i animate={{ width: progress }} transition={{ duration: reduced ? 0 : 0.5, ease: EASE }} />
            </div>
          </header>

          <div className="pxc-body">
            <aside className="pxc-side">{liveCard}</aside>

            <main className="pxc-bench" ref={scrollRef}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={`${step}-${cfg.productId}`} className="pxc-step" {...stepMotion}>
                  <span className="pxc-eyebrow">{product?.hero?.[lang].eyebrow ?? t.eyebrow}</span>
                  {stepHead}
                  <div className="pxc-stepbody">{body}</div>
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      )}

      {product && (
        <Sheet
          open={cfg.sheet !== 'none'}
          isMobile={isMobile}
          title={sheetTitle}
          closeLabel={t.close}
          wide={cfg.sheet === 'compare'}
          onClose={() => dispatch({ t: 'sheet', v: 'none' })}
        >
          {cfg.sheet === 'limits' && <LimitsList lang={lang} product={product} planId={cfg.sheetArg} />}
          {cfg.sheet === 'compare' && <ComparePanel t={t} lang={lang} product={product} activePlanId={cfg.planId} />}
          {cfg.sheet === 'addons' && <AddOnsPanel t={t} lang={lang} product={product} />}
          {cfg.sheet === 'faq' && <FaqPanel lang={lang} product={product} />}
          {cfg.sheet === 'breakdown' && liveCard}
        </Sheet>
      )}

      {/* ONE polite region for the compact price line; never the receipt */}
      <p className="pxc-sr" aria-live="polite" aria-atomic="true">
        {r.plan
          ? r.quoteOnly
            ? t.quoteFigure
            : r.monthlyEq !== null
              ? t.announcePrice(formatPrice(r.monthlyEq, currency, lang) + t.perMonth, CYCLE_LABEL[lang][cycle])
              : ''
          : ''}
      </p>
      <p className="pxc-sr" aria-live="polite" aria-atomic="true">
        {t.announceStep(stepIndex + 1, t.steps[step])}
      </p>
    </div>
  );
};

export const PricingConfigurator: React.FC = () => (
  <HelmetProvider>
    <Inner />
  </HelmetProvider>
);

export default PricingConfigurator;
