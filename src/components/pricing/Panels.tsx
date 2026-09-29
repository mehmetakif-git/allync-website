/* ============================================================
   src/components/pricing/Panels.tsx
   ------------------------------------------------------------
   FormingPanel  — the state that ships TODAY for two of three
                   products. A designed state, not a placeholder.
   QuotePanel    — the quote outcome as a destination, never a dead
                   end. Each reason gets its own line so quote-only
                   TEACHES rather than blocks.
   ComparePanel  — the 34-row comparison table. Required content.
   AddOnsPanel   — the three add-on sections.
   FaqPanel      — the questions, as disclosures.
   LimitsList    — the per-plan "Paket sınırları" list.
   Sheet         — the container they all open in.
   ============================================================ */

import React, { useState } from 'react';
import { Disclose, GoNext, Tick } from './Glyph';
import type { Copy } from './copy';
import { CYCLE_PROSE } from './copy';
import { formatPrice, type Currency, type Cycle, type Lang, type Product } from '../../content/pricing';
import type { Resolved } from '../../content/resolve';

/* ============================================================
   FORMING — plans: [] is the launch state
   ============================================================ */
export const FormingPanel: React.FC<{
  t: Copy;
  lang: Lang;
  product: Product;
  /** hands the product over to the contact form as a ready message */
  onRequest: () => void;
}> = ({ t, lang, product, onRequest }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const perks = product.included[lang];

  return (
    <>
      <p className="pxc-lead pxc-in" style={{ marginTop: 0 }}>
        {product[lang].tagline}
      </p>

      <h3 className="pxc-q pxc-in" style={{ marginTop: 14 }}>
        {t.formingTitle}
      </h3>

      <p className="pxc-lead pxc-in">{t.formingLead}</p>

      {perks.length > 0 && (
        <ul className="pxc-in pxc-ticklist">
          {perks.map((p) => (
            <li key={p}>
              <Tick size={15} />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="pxc-in" style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <button type="button" className="pxc-cta solid" onClick={onRequest}>
          {t.requestQuote}
          <GoNext />
        </button>
      </div>

      <form
        className="pxc-in"
        style={{ marginTop: 18 }}
        onSubmit={(e) => {
          e.preventDefault();
          if (email.includes('@')) setSent(true);
        }}
      >
        <label className="pxc-sechead" htmlFor="pxc-email">
          {t.emailLabel}
        </label>
        {sent ? (
          <p className="pxc-lead" style={{ marginTop: 6 }}>
            {t.emailThanks}
          </p>
        ) : (
          <div className="pxc-email">
            <input
              id="pxc-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="pxc-cta">
              {t.emailSubmit}
            </button>
          </div>
        )}
      </form>

      <p className="pxc-fine pxc-in" style={{ marginTop: 18 }}>
        {t.talkToTeam}
      </p>
    </>
  );
};

/* ============================================================
   QUOTE — the configuration stays intact and is carried into
   contact as a readable sentence plus a copyable spec block.
   ============================================================ */
export const specBlock = (
  lang: Lang,
  currency: Currency,
  cycle: Cycle,
  product: Product,
  r: Resolved,
  url: string,
): string => {
  const L: string[] = [];
  L.push(product[lang].name);
  if (r.plan) L.push(`${lang === 'tr' ? 'Paket' : 'Plan'}: ${r.plan[lang].name}`);
  L.push(`${lang === 'tr' ? 'Ödeme' : 'Billing'}: ${CYCLE_PROSE[lang][cycle]}`);
  const mods = r.items.filter((i) => i.kind === 'module');
  if (mods.length) {
    L.push(`${lang === 'tr' ? 'Ekler' : 'Add-ons'}:`);
    for (const m of mods) {
      const v =
        m.perMonth === null
          ? lang === 'tr'
            ? 'Allync Ekibi fiyat verir'
            : 'priced by the Allync Team'
          : m.perMonth === 0
            ? '—'
            : formatPrice(m.perMonth, currency, lang);
      L.push(`  · ${m.label} (${v})`);
    }
  }
  L.push(
    r.total === null
      ? `${lang === 'tr' ? 'Toplam' : 'Total'}: ${lang === 'tr' ? 'teklif gerekli' : 'quote required'}`
      : `${lang === 'tr' ? 'Toplam' : 'Total'}: ${formatPrice(r.total, currency, lang)}`,
  );
  L.push(url);
  return L.join('\n');
};

export const QuotePanel: React.FC<{
  t: Copy;
  lang: Lang;
  product: Product;
  r: Resolved;
  onRequest: () => void;
  spec: string;
  onCopy: () => void;
  copied: boolean;
}> = ({ t, lang, product, r, onRequest, spec, onCopy, copied }) => (
  <>
    <h3 className="pxc-q pxc-in" style={{ marginTop: 0 }}>
      {t.quoteTitle}
    </h3>
    <p className="pxc-lead pxc-in">{t.quoteReason[r.quoteReason === 'none' ? 'plan' : r.quoteReason]}</p>

    <div className="pxc-in">
      <p className="pxc-sechead" style={{ marginTop: 20 }}>
        {t.specTitle}
      </p>
      <pre className="pxc-spec">{spec}</pre>
    </div>

    <div className="pxc-in" style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      <button type="button" className="pxc-cta solid" onClick={onRequest}>
        {t.requestQuote}
        <GoNext />
      </button>
      <button type="button" className="pxc-cta" onClick={onCopy}>
        {copied ? t.copied : t.copyConfig}
      </button>
    </div>

    <p className="pxc-fine pxc-in" style={{ marginTop: 16 }}>
      {product.finePrint?.[lang]}
    </p>
    <p className="pxc-fine pxc-in" style={{ marginTop: 6 }}>
      {t.talkToTeam}
    </p>
  </>
);

/* ============================================================
   THE COMPARISON TABLE — 34 rows over 5 groups.
   On a phone the TABLE scrolls horizontally inside its own box and
   the page does not move: the wrapper owns the scroll and contains
   its overscroll, and the first column is sticky so a row never
   loses its label.
   ============================================================ */
export const ComparePanel: React.FC<{
  t: Copy;
  lang: Lang;
  product: Product;
  activePlanId: string | null;
}> = ({ t, lang, product, activePlanId }) => {
  const plans = product.plans;
  const groups = product.compare ?? [];
  return (
    <>
      <p className="pxc-lead pxc-in" style={{ marginTop: 0 }}>
        {t.compareLead}
      </p>
      <div className="pxc-tablewrap pxc-in">
        <table className="pxc-table">
          <thead>
            <tr>
              <th scope="col">{lang === 'tr' ? 'Özellik' : 'Feature'}</th>
              {plans.map((p) => (
                <th key={p.id} scope="col" className={p.id === activePlanId ? 'on' : p.featured ? 'rec' : undefined}>
                  {p[lang].name}
                </th>
              ))}
            </tr>
          </thead>
          {groups.map((g) => (
            <tbody key={g.tr}>
              <tr className="grp">
                <th scope="colgroup" colSpan={plans.length + 1}>
                  {g[lang]}
                </th>
              </tr>
              {g.rows.map((row) => (
                <tr key={row.tr}>
                  <th scope="row">{row[lang]}</th>
                  {plans.map((p) => (
                    <td key={p.id} className={p.id === activePlanId ? 'on' : p.featured ? 'rec' : undefined}>
                      {row.cells[p.id]?.[lang] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </>
  );
};

/* ============================================================
   ADD-ONS — the three sections, with their own price lines
   ============================================================ */
export const AddOnsPanel: React.FC<{ t: Copy; lang: Lang; product: Product }> = ({ t, lang, product }) => (
  <>
    <p className="pxc-lead pxc-in" style={{ marginTop: 0 }}>
      {t.addOnsLead}
    </p>
    {(product.addOns?.[lang] ?? []).map((s) => (
      <div className="pxc-in pxc-addon" key={s.title}>
        <p className="t">{s.title}</p>
        <p className="p">{s.price}</p>
        <ul className="pxc-ticklist">
          {s.items.map((i) => (
            <li key={i}>
              <Tick size={14} />
              <span>{i}</span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </>
);

/* ============================================================
   FAQ — disclosures, one open at a time
   ============================================================ */
export const FaqPanel: React.FC<{ lang: Lang; product: Product }> = ({ lang, product }) => {
  const [open, setOpen] = useState<number | null>(0);
  const items = product.faq?.[lang] ?? [];
  return (
    <div className="pxc-in">
      {items.map((qa, i) => (
        <div className="pxc-qa" key={qa.q}>
          <button
            type="button"
            className="q"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span>{qa.q}</span>
            <span className="chev">
              <Disclose size={15} />
            </span>
          </button>
          {open === i && <p className="a">{qa.a}</p>}
        </div>
      ))}
    </div>
  );
};

/** the per-plan "Paket sınırları" list */
export const LimitsList: React.FC<{ lang: Lang; product: Product; planId: string | null }> = ({
  lang,
  product,
  planId,
}) => {
  const plan = product.plans.find((p) => p.id === planId) ?? null;
  const items = plan ? plan[lang].limits : product.included[lang];
  return (
    <ul className="pxc-ticklist">
      {items.map((s) => (
        <li key={s}>
          <Tick size={15} />
          <span>{s}</span>
        </li>
      ))}
    </ul>
  );
};
