/* ============================================================
   src/content/pricing.check.ts
   ------------------------------------------------------------
   RUN THIS AFTER ANY PRICE, PLAN OR CATALOGUE EDIT:

     npx esbuild src/content/pricing.check.ts --bundle        --platform=node --format=esm --outfile=.check.mjs        && node .check.mjs && rm .check.mjs

   It is never imported by the app, so it costs nothing at runtime.
   It asserts what a pricing page cannot afford to get wrong:
     • every transcribed figure yields EXACTLY the advertised
       -10% (6 months) and -20% (yearly)
     • the fixed 100 USD = 4,500 TL rate holds on every single line
     • the published per-month figures match the approved table
     • each plan offers exactly the add-ons the catalogue lists
     • the advertised discount stays invariant as modules are added
     • a capacity item moves the whole thing to a quote
     • a selection from another tier is never charged
     • the comparison table is 5 groups / 34 rows with no gaps
     • no AI, voice or infrastructure provider is named anywhere
     • nothing is ever NaN, and quoteOnly <=> total === null
     • the /pricing JSON-LD carries exactly the catalogue's figures

   It already caught one real defect: a circular import between
   pricing.ts and products/hub.ts left MODULE_PRICE in its temporal
   dead zone, silently turning every surcharge into NaN.
   ============================================================ */

import { CURRENCY_ORDER, CYCLE_ORDER, MODULE_PRICE, formatPrice, monthlyEquivalent, savingPercent, type Currency, type Cycle } from './pricing';
import { PRODUCTS } from './catalog';
import { resolve, stepsFor, type Selection } from './resolve';
import { pricingJsonLd } from './pricingSchema';

let fails = 0;
const ok = (name: string, cond: boolean, extra?: unknown) => {
  if (cond) console.log(`  PASS  ${name}`);
  else {
    fails++;
    console.log(`  FAIL  ${name}${extra !== undefined ? '  ->  ' + JSON.stringify(extra) : ''}`);
  }
};
const sel = (o: Partial<Selection> = {}): Selection => ({ planId: null, scaleId: null, on: [], ...o });
const finite = (n: number | null) => n === null || (Number.isFinite(n) && !Number.isNaN(n));

const hub = PRODUCTS.find((p) => p.id === 'hub')!;
const signage = PRODUCTS.find((p) => p.id === 'signage')!;
const RATE = 45; // 100 USD = 4,500 TL, fixed by the owner

/* ---------- 1. the advertised discounts must be EXACT ---------- */
console.log('\n[1] every plan yields exactly -10% (6 months) and -20% (yearly)');
for (const p of hub.plans) {
  if (p.quoteOnly) continue;
  for (const cu of CURRENCY_ORDER) {
    ok(`${p.id}/${cu}: 6 months = -10%`, savingPercent(p.price[cu], 'sixMonth') === 10, savingPercent(p.price[cu], 'sixMonth'));
    ok(`${p.id}/${cu}: yearly = -20%`, savingPercent(p.price[cu], 'yearly') === 20, savingPercent(p.price[cu], 'yearly'));
  }
}

/* ---------- 2. the fixed rate must hold on every single figure ---------- */
console.log('\n[2] 100 USD = 4,500 TL holds on every price in the catalogue');
for (const p of hub.plans) {
  if (p.quoteOnly) continue;
  for (const c of CYCLE_ORDER) {
    const u = p.price.USD[c];
    const t = p.price.TRY[c];
    ok(`${p.id}/${c}: TRY = USD x ${RATE}`, u !== null && t !== null && t === u * RATE, { usd: u, try: t, expected: u === null ? null : u * RATE });
  }
}
ok(`module price: TRY = USD x ${RATE}`, MODULE_PRICE.TRY === (MODULE_PRICE.USD as number) * RATE, MODULE_PRICE);

/* ---------- 3. the published per-month figures ---------- */
console.log('\n[3] per-month figures match the published table');
const table: Record<string, Record<Currency, [number, number, number]>> = {
  starter: { USD: [200, 180, 160], TRY: [9000, 8100, 7200] },
  pro: { USD: [350, 315, 280], TRY: [15750, 14175, 12600] },
  premium: { USD: [450, 405, 360], TRY: [20250, 18225, 16200] },
};
for (const [id, byCur] of Object.entries(table)) {
  const p = hub.plans.find((x) => x.id === id)!;
  for (const cu of CURRENCY_ORDER) {
    const want = byCur[cu];
    const got = CYCLE_ORDER.map((c) => monthlyEquivalent(p.price[cu], c));
    ok(`${id}/${cu} per-month = ${want.join(' / ')}`, JSON.stringify(got) === JSON.stringify(want), got);
  }
}

/* ---------- 4. add-on scoping matches the catalogue ---------- */
console.log('\n[4] each plan offers exactly the add-ons the catalogue lists for it');
const expectOffered: Record<string, string[]> = {
  starter: ['voice', 'second-module', 'gcal'],
  pro: ['accounts', 'kiosk', 'industry-extra', 'api'],
  premium: ['kiosk-extra', 'industry-extra', 'whitelabel'],
  enterprise: ['kiosk-extra'],
};
for (const [id, want] of Object.entries(expectOffered)) {
  const r = resolve(hub, sel({ planId: id }), 'tr', 'monthly', 'USD');
  const flat = r.pickable.filter((f) => f.group !== 'capacity').map((f) => f.id).sort();
  ok(`${id}: flat modules = ${want.sort().join(', ')}`, JSON.stringify(flat) === JSON.stringify(want.sort()), flat);
  const quoteItems = r.pickable.filter((f) => f.group === 'capacity');
  ok(`${id}: every capacity item is priced on request`, quoteItems.every((f) => f.priceDelta?.USD === null), quoteItems.map((f) => f.id));
}

/* ---------- 5. a flat module costs the flat price, and the % survives ---------- */
console.log('\n[5] one flat module: price rises, advertised discount unchanged');
for (const cu of CURRENCY_ORDER) {
  const bare = resolve(hub, sel({ planId: 'starter' }), 'tr', 'monthly', cu);
  const one = resolve(hub, sel({ planId: 'starter', on: ['voice'] }), 'tr', 'monthly', cu);
  ok(`${cu}: monthly rose by exactly the module price`, one.total === (bare.total as number) + (MODULE_PRICE[cu] as number), { bare: bare.total, one: one.total });
  for (const c of ['sixMonth', 'yearly'] as Cycle[]) {
    const b = resolve(hub, sel({ planId: 'starter' }), 'tr', c, cu);
    const o = resolve(hub, sel({ planId: 'starter', on: ['voice', 'gcal'] }), 'tr', c, cu);
    ok(`${cu}/${c}: discount invariant under add-ons`, o.savingPct === b.savingPct, { withAddons: o.savingPct, without: b.savingPct });
    ok(`${cu}/${c}: total actually rose`, (o.total as number) > (b.total as number), { o: o.total, b: b.total });
  }
}

/* ---------- 6. a capacity item forces a quote, keeping the configuration ---------- */
console.log('\n[6] a capacity item moves the whole configuration to a quote');
{
  const r = resolve(hub, sel({ planId: 'pro', on: ['accounts', 'cap-users'] }), 'tr', 'yearly', 'TRY');
  ok('quoteReason is feature', r.quoteReason === 'feature', r.quoteReason);
  ok('total is null', r.total === null);
  ok('savingPct is null', r.savingPct === null);
  ok('the receipt still lists both modules', r.items.filter((i) => i.kind === 'module').length === 2, r.items);
  ok('the capacity line reads as on request', r.items.some((i) => i.id === 'cap-users' && i.perMonth === null));
}

/* ---------- 7. the quote tier ---------- */
console.log('\n[7] Enterprise is quote-only but still carries first month free');
{
  const r = resolve(hub, sel({ planId: 'enterprise' }), 'en', 'monthly', 'USD');
  ok('quoteReason is plan', r.quoteReason === 'plan', r.quoteReason);
  ok('total null', r.total === null);
  ok('firstMonthFree still true', r.firstMonthFree === true);
  ok('three ghosts (the priced tiers)', r.ghosts.length === 3, r.ghosts.length);
}

/* ---------- 8. selections do not leak across tiers ---------- */
console.log('\n[8] a selection from another tier is ignored, not charged');
{
  /* 'whitelabel' is only offered on Premium; on Pro it must not be charged */
  const pro = resolve(hub, sel({ planId: 'pro', on: ['whitelabel'] }), 'tr', 'monthly', 'USD');
  ok('not active on Pro', !pro.active.includes('whitelabel'), pro.active);
  ok('and not charged', pro.total === 350, pro.total);
  const prem = resolve(hub, sel({ planId: 'premium', on: ['whitelabel'] }), 'tr', 'monthly', 'USD');
  ok('active on Premium', prem.active.includes('whitelabel'), prem.active);
  ok('and charged the flat price', prem.total === 450 + 50, prem.total);
}

/* ---------- 9. money formatting follows language for grouping, currency for the mark ---------- */
console.log('\n[9] money formatting');
ok('tr / USD  -> $1.080', formatPrice(1080, 'USD', 'tr') === '$1.080', formatPrice(1080, 'USD', 'tr'));
ok('en / USD  -> $1,080', formatPrice(1080, 'USD', 'en') === '$1,080', formatPrice(1080, 'USD', 'en'));
ok('tr / TRY  -> ₺48.600', formatPrice(48600, 'TRY', 'tr') === '₺48.600', formatPrice(48600, 'TRY', 'tr'));
ok('en / TRY  -> TRY 48,600', formatPrice(48600, 'TRY', 'en') === 'TRY 48,600', formatPrice(48600, 'TRY', 'en'));

/* ---------- 10. the forming state, and the computed step list ---------- */
console.log('\n[10] forming state and computed steps');
{
  const r = resolve(signage, sel(), 'tr', 'monthly', 'USD');
  ok('Signage routes to the quote terminal', JSON.stringify(stepsFor(signage, r)) === '["product","quote"]', stepsFor(signage, r));
  const h = resolve(hub, sel({ planId: 'pro' }), 'tr', 'monthly', 'USD');
  ok('Hub has product/package/modules/summary', JSON.stringify(stepsFor(hub, h)) === '["product","package","modules","summary"]', stepsFor(hub, h));
}

/* ---------- 11. the comparison table shape ---------- */
console.log('\n[11] comparison table: 5 groups, 34 rows, a cell for every plan');
{
  const groups = hub.compare ?? [];
  ok('5 groups', groups.length === 5, groups.length);
  const rows = groups.flatMap((g) => g.rows);
  ok('34 rows', rows.length === 34, rows.length);
  const planIds = hub.plans.map((p) => p.id);
  const missing = rows.filter((row) => planIds.some((id) => !row.cells[id]));
  ok('every row has a cell for all four plans', missing.length === 0, missing.map((m) => m.tr));
  const blank = rows.filter((row) => !row.tr || !row.en || planIds.some((id) => !row.cells[id].tr || !row.cells[id].en));
  ok('no blank label or cell in either language', blank.length === 0, blank.map((b) => b.tr));
}

/* ---------- 12. text rules: no provider or infrastructure name anywhere ---------- */
console.log('\n[12] text rules — no AI/voice provider, no infrastructure, no emoji');
const BANNED = ['Claude', 'Anthropic', 'Gemini', 'OpenAI', 'GPT', 'ElevenLabs', 'Whisper', 'Supabase', 'Postgres', 'Redis', 'Docker', 'Coolify', 'Traefik', 'Vercel', 'Hostinger', 'Sentry', 'GlitchTip', 'super admin', 'Super Admin'];
{
  const blob = JSON.stringify(PRODUCTS);
  const hits = BANNED.filter((w) => blob.toLowerCase().includes(w.toLowerCase()));
  ok('no banned provider or infrastructure name', hits.length === 0, hits);
  // eslint-disable-next-line no-misleading-character-class
  const emoji = blob.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu);
  ok('no emoji', !emoji, emoji);
  ok('Messenger is never listed as a live channel', !blob.includes('Messenger'), 'found Messenger');
  const teamRepliesTR = JSON.stringify(hub.notes?.tr).includes('Ekibinizin yanıtları sayılmaz');
  const teamRepliesEN = JSON.stringify(hub.notes?.en).includes('team’s replies don’t count');
  ok('the "team replies never count" note is present in both languages', teamRepliesTR && teamRepliesEN, { teamRepliesTR, teamRepliesEN });
}

/* ---------- 12b. the receipt must add up to the figure beneath it ---------- */
console.log('\n[12b] every receipt adds up to the monthly figure it sits above');
{
  let broken = 0;
  const flat = (hub.features ?? []).filter((f) => f.priceDelta && f.priceDelta.USD !== null).map((f) => f.id);
  for (const cu of CURRENCY_ORDER) {
    for (const c of CYCLE_ORDER) {
      for (const p of ['starter', 'pro', 'premium']) {
        for (let n = 0; n <= flat.length; n++) {
          const r = resolve(hub, sel({ planId: p, on: flat.slice(0, n) }), 'tr', c, cu);
          if (r.quoteOnly || r.monthlyEq === null) continue;
          const sum = r.items.reduce((a, i) => a + (i.perMonth ?? 0), 0);
          if (sum !== r.monthlyEq) { broken++; if (broken < 5) console.log('   off:', { cu, c, p, n, sum, monthlyEq: r.monthlyEq, items: r.items.map((i) => i.perMonth) }); }
        }
      }
    }
  }
  ok('lines sum exactly to the monthly equivalent, every cycle and currency', broken === 0, broken);
}

/* ---------- 13. exhaustive sweep ---------- */
console.log('\n[13] exhaustive sweep — no NaN, and quoteOnly <=> total === null');
{
  let bad = 0;
  let broken = 0;
  const ids = (hub.features ?? []).map((f) => f.id);
  for (const lang of ['tr', 'en'] as const) {
    for (const cu of CURRENCY_ORDER) {
      for (const c of CYCLE_ORDER) {
        for (const p of [null, 'starter', 'pro', 'premium', 'enterprise', 'nope']) {
          for (let n = 0; n <= ids.length; n++) {
            const r = resolve(hub, sel({ planId: p, on: ids.slice(0, n) }), lang, c, cu);
            const nums = [r.total, r.monthlyEq, r.listMonthly, r.savingPct, r.surchargePerMonth, r.fill, ...Object.values(r.cycleMasses), ...r.ghosts.map((g) => g.size), ...r.items.map((i) => i.perMonth)];
            if (!nums.every(finite)) { bad++; console.log('   NaN at:', { lang, cu, c, p, n }); }
            if (r.quoteOnly !== (r.total === null)) { broken++; console.log('   invariant broken:', { lang, cu, c, p, n, quoteOnly: r.quoteOnly, total: r.total }); }
            if (r.fill < 0.18 || r.fill > 1) { bad++; console.log('   fill out of range:', r.fill); }
          }
        }
      }
    }
  }
  ok('zero NaN / out-of-range across the full matrix', bad === 0, bad);
  ok('quoteOnly <=> total === null, everywhere', broken === 0, broken);
}

/* ---------- 14. the structured data is the catalogue, figure for figure ---------- */
console.log('\n[14] /pricing JSON-LD — every figure is the catalogue figure');
{
  type LdSpec = { price: number; priceCurrency: string; referenceQuantity: { value: number; unitCode: string }; valueAddedTaxIncluded: boolean };
  type LdOffer = { url: string; price: number; priceCurrency: string; seller: { '@id': string }; priceSpecification: LdSpec[] };
  type LdAgg = { '@type': string; priceCurrency: string; lowPrice: number; highPrice: number; offerCount: number; offers: LdOffer[] };
  type Ld = { '@type': string; name: string; offers: LdAgg[] };
  const CYCLE_OF: Record<string, Cycle> = { '1MON': 'monthly', '6MON': 'sixMonth', '1ANN': 'yearly' };
  const priced = hub.plans.filter((p) => !p.quoteOnly);
  const planOf = (o: LdOffer) => hub.plans.find((p) => o.url.includes(`&t=${p.id}&`));

  for (const lang of ['tr', 'en'] as const) {
    const raw = pricingJsonLd(lang);
    const ld = JSON.parse(raw) as Ld;
    ok(`${lang}: one Product, Allync Hub`, ld['@type'] === 'Product' && ld.name === 'Allync Hub', [ld['@type'], ld.name]);
    ok(`${lang}: no null, no NaN, no price as text, no .html`, !/null|NaN|"(price|lowPrice|highPrice)":"|\.html/.test(raw));
    ok(`${lang}: no banned provider name`, BANNED.every((w) => !raw.toLowerCase().includes(w.toLowerCase())));
    ok(`${lang}: one AggregateOffer per currency, in order`, ld.offers.map((a) => a.priceCurrency).join() === CURRENCY_ORDER.join());

    let wrong = 0;
    for (const agg of ld.offers) {
      const cu = agg.priceCurrency as Currency;
      const monthly = agg.offers.map((o) => o.price);
      if (agg['@type'] !== 'AggregateOffer') wrong++;
      if (agg.offers.map((o) => planOf(o)?.id).join() !== priced.map((p) => p.id).join()) wrong++; // Enterprise stays out
      if (agg.offerCount !== agg.offers.length || agg.lowPrice !== Math.min(...monthly) || agg.highPrice !== Math.max(...monthly)) wrong++;
      for (const o of agg.offers) {
        const plan = planOf(o);
        if (!plan || o.price !== plan.price[cu].monthly || o.priceCurrency !== cu) { wrong++; continue; }
        if (o.seller['@id'] !== 'https://www.allyncai.com/#organization') wrong++;
        const cycles = o.priceSpecification.map((s) => CYCLE_OF[`${s.referenceQuantity.value}${s.referenceQuantity.unitCode}`]);
        if (cycles.join() !== CYCLE_ORDER.join()) wrong++;
        o.priceSpecification.forEach((s, i) => {
          if (s.price !== plan.price[cu][cycles[i]] || s.priceCurrency !== cu || s.valueAddedTaxIncluded !== false) wrong++;
        });
      }
    }
    ok(`${lang}: every offer, range and cycle price equals the catalogue`, wrong === 0, wrong);

    const [usd, tl] = ld.offers;
    const rateOk = usd.offers.every((o, i) =>
      tl.offers[i].price === o.price * RATE &&
      o.priceSpecification.every((s, j) => tl.offers[i].priceSpecification[j].price === s.price * RATE),
    );
    ok(`${lang}: 100 USD = 4,500 TL holds in the markup too`, rateOk && tl.lowPrice === usd.lowPrice * RATE && tl.highPrice === usd.highPrice * RATE);
  }
  ok('tr and en carry identical figures', pricingJsonLd('tr').replace(/"(name|description|url)":"[^"]*"/g, '') === pricingJsonLd('en').replace(/"(name|description|url)":"[^"]*"/g, ''));
}

console.log(fails === 0 ? '\nALL ASSERTIONS PASSED\n' : `\n${fails} ASSERTION(S) FAILED\n`);
process.exit(fails === 0 ? 0 : 1);
