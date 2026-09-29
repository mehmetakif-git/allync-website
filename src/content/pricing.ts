/* ============================================================
   src/content/pricing.ts — types, money rules and the registry
   ------------------------------------------------------------
   Product CONTENT lives one file per product under
   src/content/products/. This file holds only the shape, the
   money rules and the derived helpers.

   MONEY RULES (owner-approved 2026-09-29, see
   docs/ALLYNC-HUB-FIYAT-SAYFASI-ICERIK.md):
     • Currencies are USD and TRY. No EUR.
     • Currency is an INDEPENDENT selector, default USD — it does
       NOT follow the page language.
     • Number grouping follows the LANGUAGE, the symbol follows the
       CURRENCY: tr -> "$1.080" / "₺48.600",
                 en -> "$1,080" / "TRY 48,600".
     • Cycles: monthly, 6-month (-10%), yearly (-20%). Discounts are
       always DERIVED from the monthly price, never typed by hand.
     • First month free on EVERY plan, including the quote tier.
     • Every module outside your plan: a flat $50 / ₺2,250 a month.
     • Prices exclude tax.

   TEXT RULES (mandatory, same source):
     • The AI is always "Allync AI". No AI or voice provider is ever
       named. No infrastructure is ever named. The operators are
       "Allync Ekibi" / "the Allync Team", never "super admin".
     • No emoji. Full Turkish characters.
     • Status labels are preserved and never shown as live:
       Messenger and connected apps = "Yakında" / "Coming soon";
       Allync AI answering WhatsApp calls = "Erken erişim" /
       "Early access".
     • Reply quotas cover ALLYNC AI replies only — the sentence
       saying the team's replies never count must stay on the page.
   ============================================================ */

export type Lang = 'tr' | 'en';
export type Cycle = 'monthly' | 'sixMonth' | 'yearly';
export type Currency = 'USD' | 'TRY';

/** months covered by one payment of each cycle — drives every derived figure */
export const CYCLE_MONTHS: Record<Cycle, number> = {
  monthly: 1,
  sixMonth: 6,
  yearly: 12,
};

export const CYCLE_ORDER: Cycle[] = ['monthly', 'sixMonth', 'yearly'];
export const CURRENCY_ORDER: Currency[] = ['USD', 'TRY'];

/** the default currency is USD on both languages — an owner decision */
export const DEFAULT_CURRENCY: Currency = 'USD';

/** price paid PER PAYMENT for each cycle (not per month). null = quote */
export type CyclePrices = Record<Cycle, number | null>;

/** a per-month surcharge in both currencies. null in a currency = quote */
export type Money = Record<Currency, number | null>;

/** the flat price of any module outside your plan */
export const MODULE_PRICE: Money = { USD: 50, TRY: 2250 };

/* ---------------- selectable features ---------------- */

export interface FeatureGroup {
  id: string;
  tr: string;
  en: string;
  /** exactly one group should set this; otherwise the first is opened */
  defaultOpen?: boolean;
}

export interface Feature {
  id: string;
  /** must match a FeatureGroup.id on the same product */
  group: string;
  tr: { name: string; hint?: string };
  en: { name: string; hint?: string };
  /** plan ids that already contain this at no extra cost. A feature included in
   *  the ACTIVE plan is never shown as a toggle — it collapses into the
   *  read-only "N özellik dahil" line. */
  includedIn?: string[];
  /** plan ids where this is offered as a paid add-on. When set, the feature is
   *  hidden on any other plan, because the catalogue is explicit about which
   *  plan each add-on belongs to. */
  addOnFor?: string[];
  /** per-MONTH surcharge when not included.
   *  omitted  -> MODULE_PRICE (the flat module price)
   *  a number -> that surcharge
   *  null     -> priced on request; selecting it forces the quote outcome */
  priceDelta?: Money;
  /** feature ids that must all be on before this is selectable */
  requires?: string[];
  /** feature ids switched off when this is switched on */
  conflicts?: string[];
  /** never shown in the picker; still listed in the included sheet */
  fixed?: boolean;
}

export interface ScaleOption {
  id: string;
  tr: string;
  en: string;
  trSub?: string;
  enSub?: string;
  /** the plan this answer marks recommended. Advisory only — a scale answer
   *  MUST NOT multiply any price. */
  suggests?: string;
}

export interface ScaleQuestion {
  tr: string;
  en: string;
  options: ScaleOption[];
}

/* ---------------- plans ---------------- */

/** the four headline numbers shown as stat rows on every card */
export interface PlanStats {
  users: string;
  whatsapp: string;
  instagram: string;
  replies: string;
}

export interface PlanCopy {
  name: string;
  /** the one-sentence promise */
  pitch: string;
  /** ribbon, e.g. "Önerilen" */
  badge?: string;
  cta: string;
  /** the card's bullet list */
  features: string[];
  /** the collapsible "Paket sınırları" list */
  limits: string[];
}

export interface Plan {
  id: string;
  featured?: boolean;
  /** true = no figure anywhere, quote outcome, CTA instead */
  quoteOnly?: boolean;
  price: Record<Currency, CyclePrices>;
  stats: Record<Lang, PlanStats>;
  /** defaults to TRUE — the commercial rule is "every plan, every cycle" */
  firstMonthFree?: boolean;
  /** feature ids this plan pre-selects */
  preset?: string[];
  tr: PlanCopy;
  en: PlanCopy;
}

/* ---------------- editorial content ---------------- */

/** the "Eskiden -> Allync Hub ile" entry pitch */
export interface HeroCopy {
  eyebrow: string;
  title: string;
  /** the ONE handwriting line (Qwitcher Grypen) */
  script: string;
  sub: string;
  beforeTitle: string;
  before: string[];
  afterTitle: string;
  after: string[];
}

/** a row of the comparison table. cells are indexed by plan id. */
export interface CompareRow {
  tr: string;
  en: string;
  cells: Record<string, { tr: string; en: string }>;
}

export interface CompareGroup {
  tr: string;
  en: string;
  rows: CompareRow[];
}

export interface NoteCopy {
  title: string;
  body: string;
}

export interface QA {
  q: string;
  a: string;
}

/** the add-on sections that are informational rather than selectable */
export interface AddOnSection {
  title: string;
  /** the flat price line, or the "talk to us" line */
  price: string;
  items: string[];
}

export interface Product {
  id: string;
  /** a css custom property NAME: '--hub' | '--signage' | '--plus' */
  accent: string;
  comingSoon?: boolean;
  tr: { name: string; tagline: string };
  en: { name: string; tagline: string };
  /** [] is a first-class state: the product routes to the forming panel */
  plans: Plan[];
  /** perks true of every plan */
  included: { tr: string[]; en: string[] };
  /* --- all optional: add them per product, later --- */
  hero?: Record<Lang, HeroCopy>;
  groups?: FeatureGroup[];
  features?: Feature[];
  scale?: ScaleQuestion;
  compare?: CompareGroup[];
  notes?: Record<Lang, NoteCopy[]>;
  faq?: Record<Lang, QA[]>;
  addOns?: Record<Lang, AddOnSection[]>;
  /** the line under everything: tax and first-month wording */
  finePrint?: Record<Lang, string>;
}

/* The registry deliberately lives in ./catalog — this file must never import a
   product, because a product imports MODULE_PRICE and the types from here. That
   cycle left MODULE_PRICE in its temporal dead zone while hub.ts evaluated, so
   every surcharge silently became NaN. Types and money rules here; the list
   there. */

/* ---------------- derived helpers ---------------- */

/** what one month of a cycle effectively costs */
export const monthlyEquivalent = (prices: CyclePrices, cycle: Cycle): number | null => {
  const total = prices[cycle];
  if (total === null) return null;
  return Math.round(total / CYCLE_MONTHS[cycle]);
};

/** whole-percent saving of a cycle against paying monthly; null when it cannot
 *  be derived. A percentage is NEVER typed by hand anywhere on the page. */
export const savingPercent = (prices: CyclePrices, cycle: Cycle): number | null => {
  const total = prices[cycle];
  const base = prices.monthly;
  if (total === null || base === null || cycle === 'monthly') return null;
  const full = base * CYCLE_MONTHS[cycle];
  if (full <= 0) return null;
  const pct = Math.round((1 - total / full) * 100);
  return pct > 0 ? pct : null;
};

/** best saving offered by any plan on a cycle — used before a plan is picked */
export const bestSaving = (product: Product, currency: Currency, cycle: Cycle): number | null => {
  const all = product.plans
    .map((p) => savingPercent(p.price[currency], cycle))
    .filter((n): n is number => n !== null);
  return all.length ? Math.max(...all) : null;
};

/** grouping follows the LANGUAGE, the symbol follows the CURRENCY.
 *  tr: "$1.080" / "₺48.600"      en: "$1,080" / "TRY 48,600"
 *  No minor units anywhere; discounted figures are whole numbers. */
export const formatPrice = (value: number, currency: Currency, lang: Lang): string => {
  const n = new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
    maximumFractionDigits: 0,
  }).format(value);
  if (currency === 'USD') return `$${n}`;
  return lang === 'tr' ? `₺${n}` : `TRY ${n}`;
};

/** the symbol and the digits separately, so the mark can be typeset smaller */
export const splitPrice = (
  value: number,
  currency: Currency,
  lang: Lang,
): { mark: string; digits: string; markFirst: boolean } => {
  const digits = new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
    maximumFractionDigits: 0,
  }).format(value);
  if (currency === 'USD') return { mark: '$', digits, markFirst: true };
  return lang === 'tr'
    ? { mark: '₺', digits, markFirst: true }
    : { mark: 'TRY ', digits, markFirst: true };
};
