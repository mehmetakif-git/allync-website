/* ============================================================
   src/content/resolve.ts — the ONE pure function.
   ------------------------------------------------------------
   Every figure on /pricing comes from resolve(). No component ever
   divides, so NaN, %NaN and -Infinity% are UNREACHABLE states
   rather than guarded ones.

   resolve() is pure and total: it never throws, never returns NaN,
   and silently drops ids that no longer exist while reporting them
   in `dropped`, so a stale shared link is surfaced instead of
   mispriced.

   Currency is passed IN, not derived from the language: it is an
   independent selector defaulting to USD (owner decision).
   ============================================================ */

import {
  CYCLE_MONTHS,
  CYCLE_ORDER,
  monthlyEquivalent,
  savingPercent,
  type Cycle,
  type CyclePrices,
  type Currency,
  type Feature,
  type Lang,
  type Plan,
  type Product,
} from './pricing';

export interface Selection {
  planId: string | null;
  scaleId: string | null;
  on: string[];
}

export interface LineItem {
  id: string;
  kind: 'plan' | 'module';
  label: string;
  /** per-month cost; null = priced on request; 0 = free */
  perMonth: number | null;
}

export interface Ghost {
  planId: string;
  label: string;
  /** 0..1 relative to this product's dearest priced tier.
   *  null = unpriceable -> render a hollow dashed ring, invent no size. */
  size: number | null;
}

export type QuoteReason = 'none' | 'noPlans' | 'noTier' | 'plan' | 'feature' | 'cycle';

export interface Resolved {
  plan: Plan | null;
  /** composed across ALL THREE cycles so discounts stay derivable */
  composed: CyclePrices;
  total: number | null;
  monthlyEq: number | null;
  /** the undiscounted monthly figure, for the struck-through reference price */
  listMonthly: number | null;
  savingPct: number | null;
  surchargePerMonth: number;
  firstMonthFree: boolean;
  quoteOnly: boolean;
  quoteReason: QuoteReason;
  items: LineItem[];
  /** features the picker shows, in catalogue order */
  pickable: Feature[];
  /** ids that are switched on AND offered on the active plan */
  active: string[];
  /** 0.18 .. 1 — the ONLY scalar the liquid core consumes */
  fill: number;
  ghosts: Ghost[];
  cycleMasses: Record<Cycle, number | null>;
  /** a higher tier that is now cheaper or equal with this selection */
  nudge: { planId: string; label: string; saves: number } | null;
  /** ids dropped from a stale shared link — surface this, never swallow it */
  dropped: string[];
  /** the recommended plan id, from the scale answer or `featured` */
  recommendedId: string | null;
}

/* ---------- internals ---------- */

/** which features the picker may show for a given plan.
 *  `includedIn` removes it (already covered); `addOnFor` scopes it to the plans
 *  that actually offer it, because the catalogue is explicit about that. */
const pickableFor = (features: Feature[], plan: Plan | null): Feature[] =>
  features.filter((f) => {
    if (f.fixed) return false;
    if (plan && f.includedIn && f.includedIn.includes(plan.id)) return false;
    if (f.addOnFor && (!plan || !f.addOnFor.includes(plan.id))) return false;
    return true;
  });

/** per-month surcharge of a selection against a given plan */
const surchargeFor = (
  byId: Record<string, Feature>,
  on: string[],
  currency: Currency,
): { perMonth: number; quote: boolean } => {
  let perMonth = 0;
  let quote = false;
  for (const id of on) {
    const f = byId[id];
    if (!f || !f.priceDelta) continue; // a free add-on
    const d = f.priceDelta[currency];
    if (d === null) {
      quote = true;
      continue;
    }
    /* defence in depth: anything that is not a finite number is treated as
       "priced on request" rather than added. A bad catalogue entry then shows a
       quote, which is honest, instead of poisoning every figure with NaN. */
    if (typeof d !== 'number' || !Number.isFinite(d)) {
      quote = true;
      continue;
    }
    perMonth += d;
  }
  return { perMonth, quote };
};

/** compose all three cycles, scaling the surcharge at the plan's OWN discount
 *  ratio. This is what makes the advertised percentage invariant under add-ons:
 *      composed.monthly = m + s
 *      composed.yearly  = 12·m·r + 12·s·r = 12r(m + s)
 *      savingPercent    = 1 − 12r(m+s) / (12(m+s)) = 1 − r
 *  identical to the plan's own 1 − r. So "−%20" stays true no matter how many
 *  modules are added, and the yearly total is never arithmetically embarrassing
 *  next to the monthly one. */
const composeCycles = (base: CyclePrices | null, surchargePerMonth: number): CyclePrices => {
  const out: CyclePrices = { monthly: null, sixMonth: null, yearly: null };
  if (!base) return out;
  const m = base.monthly;
  for (const k of CYCLE_ORDER) {
    const b = base[k];
    if (b === null) continue;
    const ratio = m !== null && m > 0 ? b / (m * CYCLE_MONTHS[k]) : 1;
    out[k] = b + Math.round(surchargePerMonth * CYCLE_MONTHS[k] * ratio);
  }
  return out;
};

/** total for an arbitrary plan under the same selection — used by the nudge */
const totalFor = (
  plan: Plan,
  features: Feature[],
  byId: Record<string, Feature>,
  on: string[],
  currency: Currency,
  cycle: Cycle,
): number | null => {
  const allowed = new Set(pickableFor(features, plan).map((f) => f.id));
  const kept = on.filter((id) => allowed.has(id));
  const { perMonth, quote } = surchargeFor(byId, kept, currency);
  if (quote) return null;
  return composeCycles(plan.price[currency], perMonth)[cycle];
};

/* ---------- the resolver ---------- */

export function resolve(
  product: Product | null,
  sel: Selection,
  lang: Lang,
  cycle: Cycle,
  currency: Currency,
): Resolved {
  const empty: Resolved = {
    plan: null,
    composed: { monthly: null, sixMonth: null, yearly: null },
    total: null,
    monthlyEq: null,
    listMonthly: null,
    savingPct: null,
    surchargePerMonth: 0,
    firstMonthFree: true,
    quoteOnly: true,
    quoteReason: 'noPlans',
    items: [],
    pickable: [],
    active: [],
    fill: 0.18,
    ghosts: [],
    cycleMasses: { monthly: null, sixMonth: null, yearly: null },
    nudge: null,
    dropped: [],
    recommendedId: null,
  };
  if (!product) return empty;

  const features = product.features ?? [];
  const byId: Record<string, Feature> = {};
  for (const f of features) byId[f.id] = f;

  /* ---- sanitise: drop ids that no longer exist ---- */
  const dropped: string[] = [];
  const on: string[] = [];
  for (const id of sel.on) {
    if (byId[id]) {
      if (!on.includes(id)) on.push(id);
    } else {
      dropped.push(id);
    }
  }

  let plan: Plan | null = product.plans.find((p) => p.id === sel.planId) ?? null;
  if (sel.planId && !plan) dropped.push(sel.planId);
  /* exactly one plan auto-selects, so the Paket step can be skipped */
  if (!plan && product.plans.length === 1) plan = product.plans[0];

  /* ---- what the picker offers on THIS plan, and what is actually on ----
     A selection carried over from another tier is silently ignored rather
     than charged, because the plan it belonged to no longer applies. */
  const pickable = pickableFor(features, plan);
  const allowed = new Set(pickable.map((f) => f.id));
  const covered = new Set(
    features.filter((f) => plan && f.includedIn && f.includedIn.includes(plan.id)).map((f) => f.id),
  );
  const satisfied = (f: Feature): boolean =>
    !f.requires || f.requires.every((rq) => on.includes(rq) || covered.has(rq));
  const active = on.filter((id) => allowed.has(id) && satisfied(byId[id]));

  /* ---- the monthly surcharge ---- */
  const { perMonth: surchargePerMonth, quote: featureQuote } = surchargeFor(byId, active, currency);

  /* ---- compose, then derive through the helpers ----
     A module priced on request makes the WHOLE configuration unpriceable, so
     every cycle goes null. Leaving a stale figure here while quoteOnly is true
     would let a caller render a number and "custom pricing" at the same time;
     the invariant `quoteOnly === (total === null)` removes that class of bug.
     The receipt still carries every line, so nothing is lost for the quote. */
  const composed = featureQuote
    ? ({ monthly: null, sixMonth: null, yearly: null } as CyclePrices)
    : composeCycles(plan ? plan.price[currency] : null, surchargePerMonth);
  const total = composed[cycle];
  const monthlyEq = monthlyEquivalent(composed, cycle);
  const savingPct = savingPercent(composed, cycle);
  /* the reference price the discount is measured against — shown struck through
     next to the discounted figure, never a bare percentage */
  const listMonthly = cycle === 'monthly' ? null : composed.monthly;

  /* ---- quote-only, with a reason, so it teaches rather than blocks ---- */
  const quoteOnly =
    product.plans.length === 0 || !plan || !!plan.quoteOnly || featureQuote || total === null;
  const quoteReason: QuoteReason =
    product.plans.length === 0
      ? 'noPlans'
      : !plan
        ? 'noTier'
        : plan.quoteOnly
          ? 'plan'
          : featureQuote
            ? 'feature'
            : total === null
              ? 'cycle'
              : 'none';

  /* ---- fill: bounded [0.18, 1], relative to this product's OWN ladder ---- */
  const tierRank = plan ? product.plans.findIndex((p) => p.id === plan.id) + 1 : 0;
  const tierMax = product.plans.length || 1;
  const taken = pickable.filter((f) => active.includes(f.id)).length;
  const w = pickable.length
    ? 0.62 * (tierRank / tierMax) + 0.38 * (taken / pickable.length)
    : tierRank / tierMax;
  const fill = Math.min(1, Math.max(0.18, 0.18 + 0.82 * w));

  /* ---- the receipt ---- */
  const items: LineItem[] = [];
  if (plan) {
    items.push({
      id: plan.id,
      kind: 'plan',
      label: plan[lang].name,
      perMonth: monthlyEquivalent(plan.price[currency], cycle),
    });
  }
  /* A module line shows what that module costs PER MONTH ON THIS CYCLE — the
     same discount ratio the plan gets. Showing the plan discounted and the
     modules at list price made the receipt add up to a different number than
     the total beneath it ($315 + $50 + $50 over a total of $405). */
  const planBase = plan ? plan.price[currency] : null;
  const cycleRatio =
    planBase && planBase.monthly && planBase[cycle] !== null
      ? (planBase[cycle] as number) / (planBase.monthly * CYCLE_MONTHS[cycle])
      : 1;
  for (const id of active) {
    const f = byId[id];
    if (!f) continue;
    const list = f.priceDelta ? f.priceDelta[currency] : 0;
    items.push({
      id: f.id,
      kind: 'module',
      label: f[lang].name,
      perMonth: list === null ? null : Math.round(list * cycleRatio),
    });
  }

  /* ---- ghosts: same-product comparison, so the scale constant cancels ---- */
  const eqs = product.plans.map((p) => monthlyEquivalent(p.price[currency], cycle));
  const priced = eqs.filter((n): n is number => n !== null);
  const maxEq = priced.length ? Math.max(...priced) : 0;
  const ghosts: Ghost[] = product.plans
    .filter((p) => !plan || p.id !== plan.id)
    .map((p) => {
      const e = monthlyEquivalent(p.price[currency], cycle);
      return { planId: p.id, label: p[lang].name, size: e !== null && maxEq > 0 ? e / maxEq : null };
    });

  /* ---- cycle masses: same configuration, so the ratio cancels ---- */
  const cycleMasses = CYCLE_ORDER.reduce(
    (acc, k) => {
      acc[k] = monthlyEquivalent(composed, k);
      return acc;
    },
    { monthly: null, sixMonth: null, yearly: null } as Record<Cycle, number | null>,
  );

  /* ---- the upgrade nudge: a higher tier that is now cheaper or equal ---- */
  let nudge: Resolved['nudge'] = null;
  if (plan && total !== null) {
    const better = product.plans
      .map((p, i) => ({ p, i, t: totalFor(p, features, byId, active, currency, cycle) }))
      .filter((x) => x.i > tierRank - 1 && x.t !== null && x.t <= total)
      .sort((a, b) => (a.t as number) - (b.t as number))[0];
    if (better) {
      nudge = { planId: better.p.id, label: better.p[lang].name, saves: total - (better.t as number) };
    }
  }

  /* ---- the recommendation: the scale answer, else the featured plan ---- */
  const scaleOpt = product.scale?.options.find((o) => o.id === sel.scaleId);
  const recommendedId = scaleOpt?.suggests ?? product.plans.find((p) => p.featured)?.id ?? null;

  return {
    plan,
    composed,
    total,
    monthlyEq,
    listMonthly,
    savingPct,
    surchargePerMonth,
    firstMonthFree: plan?.firstMonthFree ?? true,
    quoteOnly,
    quoteReason,
    items,
    pickable,
    active,
    fill,
    ghosts,
    cycleMasses,
    nudge,
    dropped,
    recommendedId,
  };
}

/* ---------- the step list is COMPUTED, never hard-coded ----------
   so the flow collapses instead of presenting empty rooms.
   Hub yields ['product','package','modules','summary'];
   Signage and Allync+ yield ['product','quote'].                    */

export type Step = 'product' | 'scale' | 'package' | 'modules' | 'summary' | 'quote';

export function stepsFor(product: Product | null, r: Resolved | null): Step[] {
  if (!product) return ['product'];
  if (product.plans.length === 0) return ['product', 'quote'];
  const steps: Step[] = ['product'];
  if (product.scale && product.scale.options.length > 1) steps.push('scale');
  if (product.plans.length > 1) steps.push('package');
  if (r && r.pickable.length > 0) steps.push('modules');
  steps.push('summary');
  return steps;
}
