/* ============================================================
   src/components/pricing/copy.ts
   ------------------------------------------------------------
   Every chrome string on /pricing, in TR and EN. No component may
   hold a hardcoded string — the shared `Copy` interface is what
   stops the two languages drifting apart.

   Plan, feature, table, FAQ and note copy lives in
   src/content/products/*.ts. Wording here follows
   docs/ALLYNC-HUB-FIYAT-SAYFASI-ICERIK.md verbatim where that
   document specifies it.
   ============================================================ */

import type { Step } from '../../content/resolve';

export interface Copy {
  metaTitle: string;
  metaDesc: string;

  home: string;
  eyebrow: string;
  langSwitch: string;
  back: string;
  close: string;

  steps: Record<Step, string>;

  /* step 1 */
  q_product: string;
  planCount: (n: number) => string;
  soon: string;

  /* step 2 — scale */
  skip: string;

  /* step 3 — package */
  q_package: string;
  recommended: string;
  takeRecommended: string;
  planLimits: string;
  statUsers: string;
  statWhatsapp: string;
  statInstagram: string;
  statReplies: string;
  talkToTeam: string;

  /* step 4 — modules */
  q_modules: string;
  modulesLead: string;
  groupCount: (on: number, all: number) => string;
  requiresHint: (names: string) => string;
  switchedOff: (name: string) => string;
  deviation: (plan: string, n: number) => string;
  nudge: (plan: string) => string;
  cont: string;

  /* price surface */
  noPlan: string;
  perMonth: string;
  quoteFigure: string;
  quoteSub: string;
  firstMonthPill: string;
  billed: Record<'monthly' | 'sixMonth' | 'yearly', (total: string) => string>;
  /** the phone bar's one-line version, short enough never to truncate the total */
  billedShort: Record<'monthly' | 'sixMonth' | 'yearly', (total: string) => string>;
  savedPct: (n: number) => string;
  breakdown: string;

  /* quote */
  quoteReason: Record<'noPlans' | 'noTier' | 'plan' | 'feature' | 'cycle', string>;
  quoteTitle: string;
  requestQuote: string;
  specTitle: string;

  /* summary */
  q_summary: string;
  receiptTitle: string;
  cycleTitle: string;
  currencyTitle: string;
  costSentence: (a: { zero: string; cycle: string; total: string; perMonth: string | null; pct: number | null }) => string;
  copyConfig: string;
  copied: string;
  free: string;

  /* reference panels */
  comparePlans: string;
  compareLead: string;
  addOnsTitle: string;
  addOnsLead: string;
  faqTitle: string;
  notesTitle: string;
  terms: string;

  /* forming */
  formingTitle: string;
  formingLead: string;
  emailLabel: string;
  emailPlaceholder: string;
  emailSubmit: string;
  emailThanks: string;

  /* notices */
  droppedNotice: string;
  clearedNotice: string;

  /* the live card */
  pickPlanHint: string;
  chooseProduct: string;
  stepOf: (n: number, of: number) => string;
  summaryCta: string;
  summaryCtaShort: string;

  /* a11y */
  skipToPrice: string;
  announceStep: (n: number, label: string) => string;
  announcePrice: (figure: string, cycle: string) => string;
}

const TR: Copy = {
  metaTitle: 'Allync Hub Fiyatlandırma | Paketler ve Ek Modüller - Allync',
  metaDesc:
    'Allync Hub paketleri: Başlangıç, Pro, Premium ve Kurumsal. Aylık, 6 aylık (%10 indirim) ve yıllık (%20 indirim) ödeme. Tüm paketlerde ilk ay ücretsiz.',

  home: 'Ana Sayfa',
  eyebrow: 'Fiyatlandırma',
  langSwitch: 'Switch to English',
  back: 'Geri',
  close: 'Kapat',

  steps: {
    product: 'Ürün',
    scale: 'Ölçek',
    package: 'Paket',
    modules: 'Modüller',
    summary: 'Özet',
    quote: 'Teklif',
  },

  q_product: 'Neyi kuracağız?',
  planCount: (n) => `${n} paket`,
  soon: 'Yakında',

  skip: 'Atla',

  q_package: 'Hangi paketten başlayalım?',
  recommended: 'Önerilen',
  takeRecommended: 'Önerileni al',
  planLimits: 'Paket sınırları',
  statUsers: 'Kullanıcı',
  statWhatsapp: 'WhatsApp numarası',
  statInstagram: 'Instagram hesabı',
  statReplies: 'Allync AI yanıtı / ay',
  talkToTeam: 'Allync Ekibi ile görüşün: info@allyncai.com',

  q_modules: 'Ek modül eklemek ister misiniz?',
  modulesLead:
    'Paketinizde olmayan her modül aynı sabit ücretle eklenir. Kapasite ekleri ve tek seferlik hizmetler için Allync Ekibi fiyat verir.',
  groupCount: (on, all) => `${on}/${all}`,
  requiresHint: (names) => `Önce ${names} gerekiyor`,
  switchedOff: (name) => `${name} kapatıldı`,
  deviation: (plan, n) => (n > 0 ? `${plan} + ${n} modül` : plan),
  nudge: (plan) => `${plan}’a geçmek artık daha ucuz — geç`,
  cont: 'Devam',

  noPlan: 'Paket seçilmedi',
  perMonth: '/ ay',
  quoteFigure: 'Teklifle',
  quoteSub: 'Kullanıcı, numara ve Allync AI kapasitesine göre',
  firstMonthPill: 'İlk ay ücretsiz',
  billed: {
    monthly: () => 'Aylık faturalandırılır',
    sixMonth: (total) => `6 ayda bir faturalandırılır: ${total}`,
    yearly: (total) => `Yıllık faturalandırılır: ${total}`,
  },
  billedShort: {
    monthly: () => 'Aylık',
    sixMonth: (total) => `6 ayda bir ${total}`,
    yearly: (total) => `Yılda bir ${total}`,
  },
  savedPct: (n) => `%${n} indirim`,
  breakdown: 'Dökümü gör',

  quoteReason: {
    noPlans: 'Bu ürünün paketleri hazırlanıyor.',
    noTier: 'Bu seçim için uygun bir paket yok — size özel kuralım.',
    plan: 'Bu paket kullanımınıza göre fiyatlandırılır.',
    feature: 'Seçtiğiniz bir ek için Allync Ekibi fiyat verir.',
    cycle: 'Bu ödeme dönemi için özel fiyat gerekiyor.',
  },
  quoteTitle: 'Size özel kuralım',
  requestQuote: 'Teklif isteyin',
  specTitle: 'Yapılandırmanız',

  q_summary: 'Özetleyelim',
  receiptTitle: 'Seçtikleriniz',
  cycleTitle: 'Ödeme dönemi',
  currencyTitle: 'Para birimi',
  costSentence: ({ zero, cycle, total, perMonth, pct }) => {
    const parts = [`Bugün ${zero} ödüyorsunuz`];
    parts.push(perMonth ? `30 gün sonra ${cycle} ${total} (${perMonth}/ay)` : `30 gün sonra ${total}`);
    if (pct !== null) parts.push(`aylık ödemeye göre %${pct} tasarruf`);
    return parts.join(' · ');
  },
  copyConfig: 'Yapılandırmayı kopyala',
  copied: 'Kopyalandı',
  free: 'Dahil',

  comparePlans: 'Paketleri karşılaştırın',
  compareLead:
    'Her pakette ortak gelen kutusu, Allync AI, ekip araçları ve güvenlik vardır. Paketler kullanıcı, kanal ve iş modülleriyle büyür.',
  addOnsTitle: 'Ek paketler',
  addOnsLead:
    'İhtiyacınız paketin biraz ötesindeyse, üst pakete geçmeden ekleyebilirsiniz. Paketinizde olmayan her modül aynı sabit ücretle eklenir.',
  faqTitle: 'Sık sorulanlar',
  notesTitle: 'Bilmeniz gerekenler',
  terms: 'Hizmet Şartları',

  formingTitle: 'Paketler yolda',
  formingLead:
    'Bu ürünün abonelik paketleri çok yakında burada yayınlanacak. Bu arada size özel teklif için Allync Ekibi ile görüşün.',
  emailLabel: 'Yayınlandığında haber verelim',
  emailPlaceholder: 'E-posta adresiniz',
  emailSubmit: 'Haber ver',
  emailThanks: 'Teşekkürler — yayınlandığında yazacağız.',

  droppedNotice: 'Bazı seçimler artık mevcut değil, kaldırıldı.',
  clearedNotice: 'Önceki seçimleriniz sıfırlandı.',

  pickPlanHint: 'Bir paket seçin',
  chooseProduct: 'Bir ürün seçin',
  stepOf: (n, of) => `Adım ${n} / ${of}`,
  summaryCta: 'Allync Ekibi ile görüşün',
  summaryCtaShort: 'Görüşelim',

  skipToPrice: 'Fiyat özetine geç',
  announceStep: (n, label) => `Adım ${n}: ${label}`,
  announcePrice: (figure, cycle) => `${figure}, ${cycle}`,
};

const EN: Copy = {
  metaTitle: 'Allync Hub Pricing | Plans and Add-on Modules - Allync',
  metaDesc:
    'Allync Hub plans: Starter, Pro, Premium and Enterprise. Monthly, 6-month (10% off) and yearly (20% off) billing. First month free on every plan.',

  home: 'Home',
  eyebrow: 'Pricing',
  langSwitch: 'Türkçe’ye geç',
  back: 'Back',
  close: 'Close',

  steps: {
    product: 'Product',
    scale: 'Scale',
    package: 'Plan',
    modules: 'Modules',
    summary: 'Summary',
    quote: 'Quote',
  },

  q_product: 'What are we building?',
  planCount: (n) => `${n} plans`,
  soon: 'Soon',

  skip: 'Skip',

  q_package: 'Which plan shall we start from?',
  recommended: 'Recommended',
  takeRecommended: 'Take the recommended plan',
  planLimits: 'Plan limits',
  statUsers: 'Users',
  statWhatsapp: 'WhatsApp numbers',
  statInstagram: 'Instagram accounts',
  statReplies: 'Allync AI replies / month',
  talkToTeam: 'Talk to the Allync Team: info@allyncai.com',

  q_modules: 'Would you like to add any modules?',
  modulesLead:
    'Every module outside your plan is added at the same flat price. For capacity add-ons and one-time services, the Allync Team gives you a price.',
  groupCount: (on, all) => `${on}/${all}`,
  requiresHint: (names) => `Needs ${names} first`,
  switchedOff: (name) => `${name} was switched off`,
  deviation: (plan, n) => (n > 0 ? `${plan} + ${n} modules` : plan),
  nudge: (plan) => `${plan} is cheaper now — switch`,
  cont: 'Continue',

  noPlan: 'No plan selected',
  perMonth: '/ month',
  quoteFigure: 'Custom quote',
  quoteSub: 'Based on users, numbers and Allync AI capacity',
  firstMonthPill: 'First month free',
  billed: {
    monthly: () => 'Billed monthly',
    sixMonth: (total) => `Billed every 6 months: ${total}`,
    yearly: (total) => `Billed annually: ${total}`,
  },
  billedShort: {
    monthly: () => 'Monthly',
    sixMonth: (total) => `${total} / 6 months`,
    yearly: (total) => `${total} / year`,
  },
  savedPct: (n) => `${n}% off`,
  breakdown: 'See breakdown',

  quoteReason: {
    noPlans: 'Plans for this product are on the way.',
    noTier: 'No plan covers this selection — let us build one.',
    plan: 'This plan is priced to your usage.',
    feature: 'The Allync Team gives you a price for one of your selections.',
    cycle: 'This billing cycle is priced on request.',
  },
  quoteTitle: 'Let us build one for you',
  requestQuote: 'Request a quote',
  specTitle: 'Your configuration',

  q_summary: 'Let us recap',
  receiptTitle: 'What you picked',
  cycleTitle: 'Billing cycle',
  currencyTitle: 'Currency',
  costSentence: ({ zero, cycle, total, perMonth, pct }) => {
    const parts = [`You pay ${zero} today`];
    parts.push(perMonth ? `after 30 days, ${cycle} at ${total} (${perMonth}/mo)` : `after 30 days, ${total}`);
    if (pct !== null) parts.push(`saves ${pct}% vs monthly`);
    return parts.join(' · ');
  },
  copyConfig: 'Copy configuration',
  copied: 'Copied',
  free: 'Included',

  comparePlans: 'Compare plans',
  compareLead:
    'Every plan includes the shared inbox, Allync AI, team tools and security. Plans grow with users, channels and business modules.',
  addOnsTitle: 'Add-ons',
  addOnsLead:
    'If you need a little more than your plan offers, add it without moving up a plan. Every module outside your plan is added at the same flat price.',
  faqTitle: 'Frequently asked',
  notesTitle: 'Worth knowing',
  terms: 'Terms of Service',

  formingTitle: 'Packages arriving',
  formingLead:
    'Subscription plans for this product will be published here very soon. In the meantime, talk to the Allync Team for a tailored quote.',
  emailLabel: 'Tell me when it is live',
  emailPlaceholder: 'Your email address',
  emailSubmit: 'Notify me',
  emailThanks: 'Thank you — we will write when it is live.',

  droppedNotice: 'Some selections are no longer available and were removed.',
  clearedNotice: 'Your previous selections were cleared.',

  pickPlanHint: 'Pick a plan',
  chooseProduct: 'Choose a product',
  stepOf: (n, of) => `Step ${n} of ${of}`,
  summaryCta: 'Talk to the Allync Team',
  summaryCtaShort: 'Let’s talk',

  skipToPrice: 'Skip to the price summary',
  announceStep: (n, label) => `Step ${n}: ${label}`,
  announcePrice: (figure, cycle) => `${figure}, ${cycle}`,
};

export const COPY: Record<'tr' | 'en', Copy> = { tr: TR, en: EN };

/** cycle labels used inside the cost sentence, where they must read as prose */
export const CYCLE_PROSE: Record<'tr' | 'en', Record<'monthly' | 'sixMonth' | 'yearly', string>> = {
  tr: { monthly: 'aylık', sixMonth: '6 aylık', yearly: 'yıllık' },
  en: { monthly: 'monthly', sixMonth: '6 months', yearly: '12 months' },
};

/** short labels for the segmented control */
export const CYCLE_LABEL: Record<'tr' | 'en', Record<'monthly' | 'sixMonth' | 'yearly', string>> = {
  tr: { monthly: 'Aylık', sixMonth: '6 Aylık', yearly: 'Yıllık' },
  en: { monthly: 'Monthly', sixMonth: '6 Months', yearly: 'Yearly' },
};
