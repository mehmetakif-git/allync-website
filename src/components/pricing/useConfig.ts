/* ============================================================
   src/components/pricing/useConfig.ts
   ------------------------------------------------------------
   The configurator's state, its URL codec and its localStorage
   mirror.

   The hash is written with history.replaceState, NEVER pushState:
   the configurator is one page, not a history stack, so browser
   back leaves /pricing instead of walking backwards through the
   steps (the in-page rail is what walks steps).

   On mount the precedence is URL > localStorage > defaults, so a
   shared link always wins over whatever this browser remembers.
   Every storage access is wrapped: private mode throws on write.
   ============================================================ */

import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { DEFAULT_CURRENCY, type Cycle, type Currency, type Lang } from '../../content/pricing';
import { PRODUCTS } from '../../content/catalog';
import type { Step } from '../../content/resolve';

const LS_CFG = 'allync_pricing_cfg';
const LS_LANG = 'allync_language';

const CYCLE_CODE: Record<Cycle, string> = { monthly: 'm', sixMonth: '6m', yearly: 'y' };
const CODE_CYCLE: Record<string, Cycle> = { m: 'monthly', '6m': 'sixMonth', y: 'yearly' };
const isCurrency = (v: string | null): v is Currency => v === 'USD' || v === 'TRY';

export interface Config {
  lang: Lang;
  step: Step;
  productId: string | null;
  scaleId: string | null;
  planId: string | null;
  on: string[];
  cycle: Cycle;
  /** an INDEPENDENT selector, default USD — it does not follow the language */
  currency: Currency;
  /** which reference panel is open, if any */
  sheet: 'none' | 'breakdown' | 'limits' | 'compare' | 'addons' | 'faq';
  /** the plan whose limits the sheet is showing */
  sheetArg: string | null;
  /** why the figure last changed — picks the animation vocabulary */
  reason: 'module' | 'cycle';
  /** a one-shot notice under the step heading */
  notice: 'none' | 'cleared' | 'dropped';
}

type Action =
  | { t: 'lang'; v: Lang }
  | { t: 'step'; v: Step }
  | { t: 'product'; v: string }
  | { t: 'scale'; v: string | null }
  | { t: 'plan'; v: string; preset?: string[] }
  | { t: 'swapPlan'; v: string }
  | { t: 'toggle'; v: string; off?: string[] }
  | { t: 'cycle'; v: Cycle }
  | { t: 'currency'; v: Currency }
  | { t: 'sheet'; v: Config['sheet']; arg?: string | null }
  | { t: 'notice'; v: Config['notice'] }
  | { t: 'hydrate'; v: Partial<Config> };

const initial: Config = {
  lang: 'tr',
  step: 'product',
  productId: null,
  scaleId: null,
  planId: null,
  on: [],
  cycle: 'monthly',
  currency: DEFAULT_CURRENCY,
  sheet: 'none',
  sheetArg: null,
  reason: 'module',
  notice: 'none',
};

function reducer(s: Config, a: Action): Config {
  switch (a.t) {
    case 'lang':
      return { ...s, lang: a.v };
    case 'step':
      return { ...s, step: a.v, sheet: 'none' };
    case 'product':
      /* changing the product invalidates the plan and the selection. No modal,
         no confirm — one quiet notice instead. */
      return s.productId === a.v
        ? s
        : {
            ...s,
            productId: a.v,
            planId: null,
            scaleId: null,
            on: [],
            cycle: 'monthly',
            sheet: 'none',
            notice: s.planId || s.on.length ? 'cleared' : 'none',
          };
    case 'scale':
      return { ...s, scaleId: a.v };
    case 'plan':
      /* a preset IS a saved set of toggles, which is what makes "compare our
         packages" and "build your own" one data path instead of two */
      return { ...s, planId: a.v, on: a.preset ? [...a.preset] : s.on, reason: 'module' };
    case 'swapPlan':
      /* the upgrade nudge: change tier, KEEP the selection */
      return { ...s, planId: a.v, reason: 'module' };
    case 'toggle': {
      const has = s.on.includes(a.v);
      let on = has ? s.on.filter((x) => x !== a.v) : [...s.on, a.v];
      if (!has && a.off && a.off.length) on = on.filter((x) => !a.off!.includes(x));
      return { ...s, on, reason: 'module' };
    }
    case 'cycle':
      return { ...s, cycle: a.v, reason: 'cycle' };
    case 'currency':
      /* the whole figure slides horizontally, the same vocabulary as a cycle
         change, because both re-price the same configuration */
      return { ...s, currency: a.v, reason: 'cycle' };
    case 'sheet':
      return { ...s, sheet: a.v, sheetArg: a.arg ?? null };
    case 'notice':
      return { ...s, notice: a.v };
    case 'hydrate':
      return { ...s, ...a.v };
    default:
      return s;
  }
}

const readHash = (): Partial<Config> => {
  try {
    const h = window.location.hash.replace(/^#/, '');
    if (!h) return {};
    const q = new URLSearchParams(h);
    const out: Partial<Config> = {};
    const p = q.get('p');
    if (p && PRODUCTS.some((x) => x.id === p)) out.productId = p;
    const t = q.get('t');
    if (t) out.planId = t;
    const s = q.get('s');
    if (s) out.scaleId = s;
    const f = q.get('f');
    if (f) out.on = f.split(',').filter(Boolean);
    const c = q.get('c');
    if (c && CODE_CYCLE[c]) out.cycle = CODE_CYCLE[c];
    const u = q.get('u');
    if (isCurrency(u)) out.currency = u;
    const l = q.get('l');
    if (l === 'tr' || l === 'en') out.lang = l;
    return out;
  } catch {
    return {};
  }
};

const readStore = (): Partial<Config> => {
  const out: Partial<Config> = {};
  try {
    const lang = window.localStorage.getItem(LS_LANG);
    if (lang === 'tr' || lang === 'en') out.lang = lang;
  } catch {
    /* private mode */
  }
  try {
    const raw = window.localStorage.getItem(LS_CFG);
    if (raw) {
      const j = JSON.parse(raw) as Partial<Config>;
      if (j.productId && PRODUCTS.some((x) => x.id === j.productId)) out.productId = j.productId;
      if (typeof j.planId === 'string') out.planId = j.planId;
      if (typeof j.scaleId === 'string') out.scaleId = j.scaleId;
      if (Array.isArray(j.on)) out.on = j.on.filter((x) => typeof x === 'string');
      if (j.cycle && CYCLE_CODE[j.cycle]) out.cycle = j.cycle;
      if (isCurrency(j.currency ?? null)) out.currency = j.currency;
    }
  } catch {
    /* corrupt or blocked — defaults are fine */
  }
  return out;
};

export function useConfig() {
  const [cfg, dispatch] = useReducer(reducer, initial);

  /* mount: URL wins over localStorage wins over defaults */
  useEffect(() => {
    const merged = { ...readStore(), ...readHash() };
    if (Object.keys(merged).length) {
      /* a restored configuration lands on the summary when it is complete
         enough to be worth reading, otherwise on the product step */
      dispatch({ t: 'hydrate', v: { ...merged, step: merged.planId ? 'summary' : 'product' } });
    }
  }, []);

  /* mirror out, debounced, never on the first paint */
  useEffect(() => {
    const id = window.setTimeout(() => {
      const q = new URLSearchParams();
      if (cfg.productId) q.set('p', cfg.productId);
      if (cfg.scaleId) q.set('s', cfg.scaleId);
      if (cfg.planId) q.set('t', cfg.planId);
      if (cfg.on.length) q.set('f', cfg.on.join(','));
      q.set('c', CYCLE_CODE[cfg.cycle]);
      q.set('u', cfg.currency);
      q.set('l', cfg.lang);
      const hash = q.toString();
      try {
        window.history.replaceState(null, '', `${window.location.pathname}${hash ? '#' + hash : ''}`);
      } catch {
        /* ignore: a failed URL write must never break the page */
      }
      try {
        window.localStorage.setItem(
          LS_CFG,
          JSON.stringify({ productId: cfg.productId, planId: cfg.planId, scaleId: cfg.scaleId, on: cfg.on, cycle: cfg.cycle, currency: cfg.currency }),
        );
        window.localStorage.setItem(LS_LANG, cfg.lang);
      } catch {
        /* private mode: the page works, it just will not remember */
      }
    }, 500);
    return () => window.clearTimeout(id);
  }, [cfg.productId, cfg.planId, cfg.scaleId, cfg.on, cfg.cycle, cfg.currency, cfg.lang]);

  /* the one-shot notice clears itself */
  useEffect(() => {
    if (cfg.notice === 'none') return;
    const id = window.setTimeout(() => dispatch({ t: 'notice', v: 'none' }), 6000);
    return () => window.clearTimeout(id);
  }, [cfg.notice]);

  const product = useMemo(() => PRODUCTS.find((p) => p.id === cfg.productId) ?? null, [cfg.productId]);

  const shareUrl = useCallback(() => {
    try {
      return window.location.href;
    } catch {
      return 'https://www.allyncai.com/pricing';
    }
  }, []);

  return { cfg, dispatch, product, shareUrl };
}

export type Dispatch = ReturnType<typeof useConfig>['dispatch'];
