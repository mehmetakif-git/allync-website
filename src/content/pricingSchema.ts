/* ============================================================
   src/content/pricingSchema.ts — structured data for /pricing
   ------------------------------------------------------------
   Built from the catalogue, never typed by hand: the figures in
   the markup are exactly the figures on the page, and
   pricing.check.ts asserts that they stay that way.

   Shape: one Product per product with published prices (today
   only Allync Hub) -> one AggregateOffer per currency, whose
   range is the monthly list prices -> one Offer per plan. An
   Offer's `price` is the plan's monthly list price, and its
   priceSpecification states what each billing cycle actually
   costs (1 month / 6 months / 1 year). Every price is tax-
   exclusive, as the page says.

   Deliberately left out:
   - quote-only plans (Enterprise): an Offer without a numeric
     price is an error in Google's eyes, and "custom" is not a
     number;
   - products with no plans yet (Digital Signage, Allync+);
   - FAQPage: the root index.html already ships one on every
     route, and two on one page is a Search Console error.

   The root Organization carries @id `/#organization`, so the
   seller below merges with the full company record.
   ============================================================ */

import { CURRENCY_ORDER, CYCLE_ORDER, type Currency, type Cycle, type Lang, type Plan, type Product } from './pricing';
import { PRODUCTS } from './catalog';

const SITE = 'https://www.allyncai.com';
const PAGE = `${SITE}/pricing`;

const SELLER = { '@type': 'Organization', '@id': `${SITE}/#organization`, name: 'ALLYNC', url: SITE };
const BRAND = { '@type': 'Brand', name: 'Allyncai' };

/** the period one payment covers, as a UN/CEFACT quantity */
const PERIOD: Record<Cycle, { value: number; unitCode: 'MON' | 'ANN' }> = {
  monthly: { value: 1, unitCode: 'MON' },
  sixMonth: { value: 6, unitCode: 'MON' },
  yearly: { value: 1, unitCode: 'ANN' },
};

/** a plan is published in a currency only when every cycle has a real number */
const isPriced = (plan: Plan, cu: Currency) =>
  !plan.quoteOnly && CYCLE_ORDER.every((c) => Number.isFinite(plan.price[cu][c]));

const offerFor = (product: Product, plan: Plan, cu: Currency, lang: Lang) => ({
  '@type': 'Offer',
  name: `${product[lang].name} ${plan[lang].name}`,
  description: plan[lang].pitch,
  /* opens the configurator on this plan, in this currency and language */
  url: `${PAGE}#p=${product.id}&t=${plan.id}&u=${cu}&l=${lang}`,
  price: plan.price[cu].monthly as number,
  priceCurrency: cu,
  availability: 'https://schema.org/InStock',
  seller: SELLER,
  priceSpecification: CYCLE_ORDER.map((c) => ({
    '@type': 'UnitPriceSpecification',
    price: plan.price[cu][c] as number,
    priceCurrency: cu,
    referenceQuantity: { '@type': 'QuantitativeValue', ...PERIOD[c] },
    valueAddedTaxIncluded: false,
  })),
});

const productFor = (product: Product, lang: Lang) => {
  const offers = CURRENCY_ORDER.flatMap((cu) => {
    const plans = product.plans.filter((p) => isPriced(p, cu));
    if (!plans.length) return [];
    const list = plans.map((p) => p.price[cu].monthly as number);
    return [
      {
        '@type': 'AggregateOffer',
        priceCurrency: cu,
        lowPrice: Math.min(...list),
        highPrice: Math.max(...list),
        offerCount: plans.length,
        offers: plans.map((p) => offerFor(product, p, cu, lang)),
      },
    ];
  });
  if (!offers.length) return null;
  return {
    '@type': 'Product',
    '@id': `${PAGE}#${product.id}`,
    name: product[lang].name,
    /* both sentences are the approved page copy: the tagline and the fine print */
    description: [product[lang].tagline, product.finePrint?.[lang]].filter(Boolean).join(' '),
    brand: BRAND,
    image: `${SITE}/allync-social-media-logo.png`,
    url: `${PAGE}#p=${product.id}`,
    offers,
  };
};

/** the JSON-LD object for /pricing in one language */
export const pricingSchema = (lang: Lang) => {
  const nodes = PRODUCTS.map((p) => productFor(p, lang)).filter((n) => n !== null);
  return nodes.length === 1
    ? { '@context': 'https://schema.org', ...nodes[0] }
    : { '@context': 'https://schema.org', '@graph': nodes };
};

/** serialised for a <script type="application/ld+json">; `<` is escaped so no text can close the tag */
export const pricingJsonLd = (lang: Lang): string => JSON.stringify(pricingSchema(lang)).replace(/</g, '\\u003c');
