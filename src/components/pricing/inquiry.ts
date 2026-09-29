/* ============================================================
   src/components/pricing/inquiry.ts
   ------------------------------------------------------------
   The hand-off from /pricing to the contact form.

   Pressing the final action used to navigate to /digital/contact
   with ?p=&t= query parameters that the form never read, so every
   choice the buyer had just made was thrown away at the exact
   moment they asked to talk to someone.

   Now the configuration is written out as a ready-to-send message
   in the buyer's language, handed over twice — as react-router
   navigation state (clean URL, survives a reload through
   history.state) and in sessionStorage (survives any internal
   replace-navigation that would drop the state) — and the form
   takes it exactly once.
   ============================================================ */

import { CYCLE_PROSE } from './copy';
import { formatPrice, savingPercent, type Currency, type Cycle, type Lang, type Product } from '../../content/pricing';
import type { Resolved } from '../../content/resolve';

export const INQUIRY_KEY = 'allync_pricing_inquiry';
/** an inquiry older than this is stale and is ignored rather than surprising someone */
const MAX_AGE_MS = 30 * 60 * 1000;

export interface Inquiry {
  /** the ready-to-send message body */
  message: string;
  /** a one-line summary for the confirmation note above the form */
  summary: string;
  lang: Lang;
  at: number;
}

export function buildInquiry(
  lang: Lang,
  currency: Currency,
  cycle: Cycle,
  product: Product,
  r: Resolved,
  url: string,
): Inquiry {
  const tr = lang === 'tr';
  const L: string[] = [];
  const productName = product[lang].name;
  const planName = r.plan ? r.plan[lang].name : null;

  L.push(tr ? 'Merhaba Allync Ekibi,' : 'Hello Allync Team,');
  L.push('');

  if (product.plans.length === 0) {
    L.push(
      tr
        ? `${productName} için teklif almak ve paketler yayınlandığında bilgi almak istiyorum.`
        : `I would like a quote for ${productName}, and to hear when its plans are published.`,
    );
  } else {
    L.push(
      tr
        ? 'Fiyatlandırma sayfasında aşağıdaki yapılandırmayı oluşturdum, bunun için görüşmek istiyorum:'
        : 'I put together the configuration below on your pricing page and would like to talk it through:',
    );
    L.push('');
    L.push(`• ${tr ? 'Ürün' : 'Product'}: ${productName}`);
    if (planName) L.push(`• ${tr ? 'Paket' : 'Plan'}: ${planName}`);

    const mods = r.items.filter((i) => i.kind === 'module');
    if (mods.length) {
      const list = mods
        .map((m) =>
          m.perMonth === null
            ? `${m.label} (${tr ? 'fiyat Allync Ekibi’nden' : 'priced by the Allync Team'})`
            : m.perMonth === 0
              ? m.label
              : `${m.label} (+${formatPrice(m.perMonth, currency, lang)}${tr ? '/ay' : '/mo'})`,
        )
        .join(', ');
      L.push(`• ${tr ? 'Ek modüller' : 'Add-ons'}: ${list}`);
    }

    const pct = savingPercent(r.composed, cycle);
    L.push(
      `• ${tr ? 'Ödeme dönemi' : 'Billing'}: ${CYCLE_PROSE[lang][cycle]}${
        pct !== null ? (tr ? ` (%${pct} indirim)` : ` (${pct}% off)`) : ''
      }`,
    );

    if (r.quoteOnly || r.total === null || r.monthlyEq === null) {
      L.push(`• ${tr ? 'Tutar' : 'Price'}: ${tr ? 'teklif — Allync Ekibi fiyat verecek' : 'on request — the Allync Team will quote'}`);
    } else if (cycle === 'monthly') {
      L.push(`• ${tr ? 'Tutar' : 'Price'}: ${formatPrice(r.monthlyEq, currency, lang)}${tr ? '/ay' : '/mo'}`);
    } else {
      L.push(
        `• ${tr ? 'Tutar' : 'Price'}: ${formatPrice(r.monthlyEq, currency, lang)}${tr ? '/ay' : '/mo'} — ${
          tr
            ? `${cycle === 'sixMonth' ? '6 ayda bir' : 'yılda bir'} ${formatPrice(r.total, currency, lang)}`
            : `${formatPrice(r.total, currency, lang)} ${cycle === 'sixMonth' ? 'every 6 months' : 'per year'}`
        }`,
      );
    }
    if (r.firstMonthFree) L.push(`• ${tr ? 'İlk ay ücretsiz' : 'First month free'}`);
  }

  L.push('');
  L.push(`${tr ? 'Yapılandırmam' : 'My configuration'}: ${url}`);

  const summary = [productName, planName].filter(Boolean).join(' · ');
  const modCount = r.items.filter((i) => i.kind === 'module').length;

  return {
    message: L.join('\n'),
    summary: modCount > 0 ? `${summary} + ${modCount} ${tr ? 'modül' : modCount === 1 ? 'module' : 'modules'}` : summary,
    lang,
    at: Date.now(),
  };
}

export function stashInquiry(inq: Inquiry): void {
  try {
    window.sessionStorage.setItem(INQUIRY_KEY, JSON.stringify(inq));
  } catch {
    /* private mode: router state still carries it */
  }
}

/** read the inquiry ONCE — from navigation state first, storage second — and
 *  clear the stored copy so a later, unrelated visit starts empty */
export function takeInquiry(state: unknown): Inquiry | null {
  let inq: Inquiry | null = null;
  const fromState = (state as { inquiry?: Inquiry } | null)?.inquiry;
  if (fromState && typeof fromState.message === 'string') inq = fromState;
  try {
    const raw = window.sessionStorage.getItem(INQUIRY_KEY);
    if (!inq && raw) inq = JSON.parse(raw) as Inquiry;
    window.sessionStorage.removeItem(INQUIRY_KEY);
  } catch {
    /* storage blocked: state was the only carrier */
  }
  if (!inq || typeof inq.message !== 'string') return null;
  if (typeof inq.at === 'number' && Date.now() - inq.at > MAX_AGE_MS) return null;
  return inq;
}
