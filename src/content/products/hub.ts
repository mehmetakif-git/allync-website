/* ============================================================
   src/content/products/hub.ts — ALLYNC HUB
   ------------------------------------------------------------
   Content, numbers and rules transcribed verbatim from
   docs/ALLYNC-HUB-FIYAT-SAYFASI-ICERIK.md (owner-approved
   2026-09-29). The design may be reworked; THIS CONTENT MAY NOT.

   If a price, the exchange rule or a plan's contents change, that
   document is the source and this file follows it.

   Text rules enforced here: the AI is only ever "Allync AI"; no AI,
   voice or infrastructure provider is named; the operators are the
   "Allync Ekibi" / "Allync Team"; no emoji; Messenger and connected
   apps are "Yakında" / "Coming soon" and are never shown as live;
   Allync AI answering WhatsApp calls is "Erken erişim" / "Early
   access"; reply quotas cover Allync AI replies only.
   ============================================================ */

import { MODULE_PRICE, type CompareGroup, type Feature, type Money, type Product } from '../pricing';

/* ---------- comparison-table cell shorthands ---------- */
const INC = { tr: 'Dahil', en: 'Included' };
const NO = { tr: '—', en: '—' };
const CONTRACT = { tr: 'Sözleşmeyle', en: 'By contract' };
const ADDON = { tr: 'Ek paket', en: 'Add-on' };
const ids = ['starter', 'pro', 'premium', 'enterprise'] as const;
/** the same cell on all four plans */
const all = (v: { tr: string; en: string }) =>
  Object.fromEntries(ids.map((id) => [id, v])) as Record<string, { tr: string; en: string }>;
/** one cell per plan, in order */
const row = (
  tr: string,
  en: string,
  cells: [
    { tr: string; en: string },
    { tr: string; en: string },
    { tr: string; en: string },
    { tr: string; en: string },
  ],
) => ({ tr, en, cells: Object.fromEntries(ids.map((id, i) => [id, cells[i]])) });

const COMPARE: CompareGroup[] = [
  {
    tr: 'Ekip ve kanallar',
    en: 'Team and channels',
    rows: [
      row('Kullanıcı', 'Users', [{ tr: '3', en: '3' }, { tr: '5', en: '5' }, { tr: '10', en: '10' }, CONTRACT]),
      row('WhatsApp numarası', 'WhatsApp numbers', [{ tr: '1', en: '1' }, { tr: '2', en: '2' }, { tr: '5', en: '5' }, CONTRACT]),
      row('Instagram mesajları', 'Instagram messages', [
        { tr: '1 hesap', en: '1 account' },
        { tr: '2 hesap', en: '2 accounts' },
        { tr: '3 hesap', en: '3 accounts' },
        CONTRACT,
      ]),
      {
        tr: 'Müşteri kartı: aynı kişinin WhatsApp ve Instagram sohbetleri tek kartta, birleştirme ve ayırma',
        en: "Customer card: one person's WhatsApp and Instagram chats on one card, merge and split",
        cells: all(INC),
      },
      { tr: 'Web, Android ve iPhone uygulamaları', en: 'Web, Android and iPhone apps', cells: all(INC) },
    ],
  },
  {
    tr: 'Allync AI',
    en: 'Allync AI',
    rows: [
      row('Allync AI yanıtları (ayda)', 'Allync AI replies (per month)', [
        { tr: '3.000', en: '3,000' },
        { tr: '10.000', en: '10,000' },
        { tr: '25.000', en: '25,000' },
        { tr: 'Taahhüt + %20 tampon', en: 'Commitment + 20% buffer' },
      ]),
      {
        tr: 'Ekibin yanıtları',
        en: "Your team's replies",
        cells: all({ tr: 'Dahil, sınırsız', en: 'Included, unlimited' }),
      },
      row('Instagram yorumlarına Allync AI yanıtı', 'Allync AI replies to Instagram comments', [NO, INC, INC, INC]),
      {
        tr: 'Duygu analizi ve kişi kartında duygu değişimi grafiği',
        en: 'Sentiment analysis and a sentiment-over-time chart on the customer card',
        cells: all(INC),
      },
      {
        tr: "Instagram'da müşteri doğrulama: Allync AI müşteriyi kaydıyla güvenle eşleştirir",
        en: 'Instagram customer verification: Allync AI safely matches the customer to their record',
        cells: all(INC),
      },
      row('Sesli mesajı anlama ve sesli yanıt', 'Voice message understanding and voice replies', [
        ADDON,
        { tr: 'günlük bütçe', en: 'daily budget' },
        { tr: 'yüksek günlük bütçe', en: 'higher daily budget' },
        CONTRACT,
      ]),
      row('VIP müşteriye özel talimat', 'Custom instructions for VIP customers', [
        NO,
        { tr: '50 kişi', en: '50 contacts' },
        { tr: '200 kişi', en: '200 contacts' },
        CONTRACT,
      ]),
      row('AI medya kütüphanesi', 'AI media library', [
        NO,
        { tr: '100 dosya', en: '100 files' },
        { tr: '300 dosya', en: '300 files' },
        CONTRACT,
      ]),
      row("WhatsApp aramalarını Allync AI'ın yanıtlaması", 'Allync AI answers WhatsApp calls', [
        NO,
        NO,
        NO,
        { tr: 'Erken erişim', en: 'Early access' },
      ]),
    ],
  },
  {
    tr: 'Ekip araçları ve güvenlik',
    en: 'Team tools and security',
    rows: [
      {
        tr: 'Konuşmayı devralma, hazır yanıt, AI öneri ve özet',
        en: 'Takeover, saved replies, AI suggestions and summaries',
        cells: all(INC),
      },
      {
        tr: 'Kişiye özel izinler, otomatik dağıtım, ilk yanıt hedefi',
        en: 'Per-person permissions, auto-assignment, first-response targets',
        cells: all(INC),
      },
      {
        tr: 'Müşteri numarasını kişiye özel gizleme',
        en: 'Hide customer numbers per team member',
        cells: all(INC),
      },
      { tr: 'Ekip performansı ve AI Karnesi', en: 'Team performance and AI Report Card', cells: all(INC) },
      {
        tr: 'İki adımlı doğrulama, etkinlik kaydı, KVKK araçları',
        en: 'Two-step verification, activity log, data-protection tools',
        cells: all(INC),
      },
    ],
  },
  {
    tr: 'İş modülleri',
    en: 'Business modules',
    rows: [
      row('Randevu (Allync Takvim)', 'Appointments (Allync Calendar)', [
        { tr: 'randevu ya da sipariş', en: 'appointments or orders' },
        INC,
        INC,
        INC,
      ]),
      row('Katalog ve sipariş', 'Catalog and orders', [
        { tr: 'randevu ya da sipariş', en: 'appointments or orders' },
        INC,
        INC,
        INC,
      ]),
      row('Katalogdaki ürün', 'Products in catalog', [
        { tr: '200', en: '200' },
        { tr: '1.000', en: '1,000' },
        { tr: '5.000', en: '5,000' },
        CONTRACT,
      ]),
      { tr: 'WhatsApp içi formlar', en: 'In-WhatsApp forms', cells: all(INC) },
      {
        tr: 'Onaylı WhatsApp şablonları ve hazır kütüphane',
        en: 'Approved WhatsApp templates and ready-made library',
        cells: all(INC),
      },
      row('Kampanya (toplu gönderim)', 'Campaigns (broadcasts)', [NO, INC, INC, INC]),
      row('Google Takvim', 'Google Calendar', [ADDON, INC, INC, INC]),
      row('Google E-Tablolar kataloğu', 'Google Sheets catalog', [NO, INC, INC, INC]),
      row('Sektör modül seti', 'Industry module sets', [
        NO,
        { tr: '1 set', en: '1 set' },
        { tr: '2 set', en: '2 sets' },
        { tr: 'Dahil, hepsi', en: 'Included, all' },
      ]),
      row('Müşteri hesabı ve personel komisyonu', 'Customer accounts and staff commission', [NO, ADDON, INC, INC]),
      row('Kiosk (kayıt tableti)', 'Kiosk (sign-in tablet)', [
        NO,
        ADDON,
        { tr: '3 cihaz', en: '3 devices' },
        CONTRACT,
      ]),
    ],
  },
  {
    tr: 'Entegrasyon, marka ve kurulum',
    en: 'Integrations, brand and setup',
    rows: [
      row('REST API ve webhook', 'REST API and webhooks', [NO, ADDON, INC, INC]),
      row('Beyaz etiket (kendi markanız)', 'White label (your own brand)', [NO, NO, ADDON, INC]),
      row('Bağlı uygulamalar', 'Connected apps', [NO, NO, NO, { tr: 'Yakında', en: 'Coming soon' }]),
      row('Kurulum ve eğitim', 'Setup and training', [
        { tr: 'Asistan kurulumu dahil', en: 'Assistant setup included' },
        { tr: 'Asistan kurulumu dahil', en: 'Assistant setup included' },
        { tr: 'Asistan kurulumu dahil', en: 'Assistant setup included' },
        { tr: 'Kapsamlı kurulum ve eğitim dahil', en: 'Full setup and training included' },
      ]),
    ],
  },
];

/* ---------- the add-on modules, at the one flat price ----------
   Every module outside your plan costs $50 / ₺2.250 a month.
   `addOnFor` is which plans OFFER it; `includedIn` is which plans
   already contain it. A module is only ever shown on a plan that
   offers it, because the catalogue is explicit about that.        */
const FLAT = MODULE_PRICE;
const QUOTE: Money = { USD: null, TRY: null };

const FEATURES: Feature[] = [
  /* --- Allync AI --- */
  {
    id: 'voice',
    group: 'ai',
    tr: { name: 'Sesli mesaj', hint: 'Allync AI WhatsApp sesli mesajlarını anlar ve yanıtlar, günlük bütçeyle' },
    en: { name: 'Voice messages', hint: 'Allync AI understands and answers WhatsApp voice messages, within a daily budget' },
    addOnFor: ['starter'],
    includedIn: ['pro', 'premium', 'enterprise'],
    priceDelta: FLAT,
  },

  /* --- business modules --- */
  {
    id: 'second-module',
    group: 'modules',
    tr: { name: 'İkinci iş modülü', hint: 'Randevuya sipariş ya da siparişe randevu' },
    en: { name: 'Second business module', hint: 'Add orders to appointments, or appointments to orders' },
    addOnFor: ['starter'],
    includedIn: ['pro', 'premium', 'enterprise'],
    priceDelta: FLAT,
  },
  {
    id: 'gcal',
    group: 'modules',
    tr: { name: 'Google Takvim' },
    en: { name: 'Google Calendar' },
    addOnFor: ['starter'],
    includedIn: ['pro', 'premium', 'enterprise'],
    priceDelta: FLAT,
  },
  {
    id: 'accounts',
    group: 'modules',
    tr: { name: 'Müşteri hesabı ve personel komisyonu' },
    en: { name: 'Customer accounts and staff commission' },
    addOnFor: ['pro'],
    includedIn: ['premium', 'enterprise'],
    priceDelta: FLAT,
  },
  {
    id: 'kiosk',
    group: 'modules',
    tr: { name: 'Kiosk', hint: 'İşletmenizde kayıt tableti' },
    en: { name: 'Kiosk', hint: 'A sign-in tablet at your location' },
    addOnFor: ['pro'],
    includedIn: ['premium', 'enterprise'],
    priceDelta: FLAT,
  },
  {
    id: 'kiosk-extra',
    group: 'modules',
    tr: { name: 'Ek kiosk cihazı' },
    en: { name: 'Extra kiosk device' },
    addOnFor: ['premium', 'enterprise'],
    priceDelta: FLAT,
  },
  {
    id: 'industry-extra',
    group: 'modules',
    tr: { name: 'Ek sektör seti' },
    en: { name: 'Extra industry set' },
    addOnFor: ['pro', 'premium'],
    priceDelta: FLAT,
  },

  /* --- integrations and brand --- */
  {
    id: 'api',
    group: 'brand',
    tr: { name: 'API ve webhook', hint: 'Verileriniz kendi sisteminize akar' },
    en: { name: 'API and webhooks', hint: 'Your data flows into your own systems' },
    addOnFor: ['pro'],
    includedIn: ['premium', 'enterprise'],
    priceDelta: FLAT,
  },
  {
    id: 'whitelabel',
    group: 'brand',
    tr: { name: 'Beyaz etiket', hint: 'Logonuz, renkleriniz, şablon alt bilginiz' },
    en: { name: 'White label', hint: 'Your logo, your colours, your template footer' },
    addOnFor: ['premium'],
    includedIn: ['enterprise'],
    priceDelta: FLAT,
  },

  /* --- capacity: priced on request, so selecting one moves the whole
         configuration to a quote instead of inventing a number --- */
  {
    id: 'cap-users',
    group: 'capacity',
    tr: { name: 'Ek kullanıcı paketi', hint: '5 kullanıcı' },
    en: { name: 'Extra users', hint: 'Pack of 5' },
    priceDelta: QUOTE,
  },
  {
    id: 'cap-whatsapp',
    group: 'capacity',
    tr: { name: 'Ek WhatsApp numarası', hint: 'Tek seferlik kurulum bedeliyle' },
    en: { name: 'Extra WhatsApp number', hint: 'With a one-time setup fee' },
    priceDelta: QUOTE,
  },
  {
    id: 'cap-instagram',
    group: 'capacity',
    tr: { name: 'Ek Instagram hesabı' },
    en: { name: 'Extra Instagram account' },
    priceDelta: QUOTE,
  },
  {
    id: 'cap-replies',
    group: 'capacity',
    tr: { name: 'Ek Allync AI yanıt bloğu', hint: 'Aylık' },
    en: { name: 'Extra Allync AI reply block', hint: 'Monthly' },
    priceDelta: QUOTE,
  },
  {
    id: 'cap-limits',
    group: 'capacity',
    tr: { name: 'Kapasite artışı', hint: 'Ürün, medya, VIP, takip edilen uçuş' },
    en: { name: 'More capacity', hint: 'Products, media, VIP contacts, tracked flights' },
    priceDelta: QUOTE,
  },
  {
    id: 'cap-voice',
    group: 'capacity',
    tr: { name: 'Ek sesli mesaj kapasitesi' },
    en: { name: 'Extra voice message capacity' },
    addOnFor: ['pro', 'premium', 'enterprise'],
    priceDelta: QUOTE,
  },
  {
    id: 'cap-setup',
    group: 'capacity',
    tr: { name: 'Kurulum, eğitim ve içerik hizmeti', hint: 'Tek seferlik' },
    en: { name: 'Setup, training and content service', hint: 'One-time' },
    priceDelta: QUOTE,
  },
];

export const HUB: Product = {
  id: 'hub',
  accent: '--hub',
  tr: { name: 'Allync Hub', tagline: 'WhatsApp ve Instagram tek ortak gelen kutusunda, Allync AI gece gündüz yanıtta.' },
  en: { name: 'Allync Hub', tagline: 'WhatsApp and Instagram in one shared inbox, with Allync AI replying day and night.' },

  hero: {
    tr: {
      eyebrow: 'Allync Hub paketleri',
      title: 'Bütün ekibiniz, her kanalda, her cihazdan.',
      script: 'tek telefondan bütün ekibe',
      sub: "WhatsApp'ınız tek telefondan çıkar. Ekibiniz WhatsApp ve Instagram mesajlarını bilgisayardan ve telefondan, herkes kendi yetkisiyle yanıtlar; Allync AI gece gündüz karşılar, siz kimin neye ne kadar sürede yanıt verdiğini görürsünüz.",
      beforeTitle: 'Eskiden',
      before: [
        'WhatsApp tek telefonda, tek kişinin cebinde',
        'Instagram mesajları ayrı bir uygulamada',
        'Kim neye ne zaman cevap verdi, bilinmez',
        'Gece gelen mesaj sabaha kalır',
      ],
      afterTitle: 'Allync Hub ile',
      after: [
        'WhatsApp ve Instagram tek ortak gelen kutusunda',
        'Bütün ekip bilgisayardan ve telefondan, herkes kendi yetkisiyle cevaplar',
        'Kimin neye ne kadar sürede cevap verdiğini görürsünüz',
        'Allync AI gece gündüz karşılar, gerekince ekibe devreder',
      ],
    },
    en: {
      eyebrow: 'Allync Hub plans',
      title: 'Your whole team, on every channel, from any device.',
      script: 'from one phone to the whole team',
      sub: 'Your WhatsApp leaves the single phone. Your team answers WhatsApp and Instagram from computer and phone, each with their own permissions; Allync AI replies day and night, and you see who answered what, and how fast.',
      beforeTitle: 'Before',
      before: [
        'WhatsApp lives on one phone, in one person’s pocket',
        'Instagram messages sit in a separate app',
        'Nobody knows who answered what, or when',
        'Messages that arrive at night wait until morning',
      ],
      afterTitle: 'With Allync Hub',
      after: [
        'WhatsApp and Instagram in one shared inbox',
        'The whole team answers from computer and phone, each with their own permissions',
        'You see who answered what, and how fast',
        'Allync AI replies day and night and hands over to your team when needed',
      ],
    },
  },

  groups: [
    { id: 'ai', tr: 'Allync AI', en: 'Allync AI', defaultOpen: true },
    { id: 'modules', tr: 'İş modülleri', en: 'Business modules' },
    { id: 'brand', tr: 'Entegrasyon ve marka', en: 'Integrations and brand' },
    { id: 'capacity', tr: 'Kapasite ve hizmetler', en: 'Capacity and services' },
  ],
  features: FEATURES,

  plans: [
    {
      id: 'starter',
      firstMonthFree: true,
      price: {
        USD: { monthly: 200, sixMonth: 1080, yearly: 1920 },
        TRY: { monthly: 9000, sixMonth: 48600, yearly: 86400 },
      },
      stats: {
        tr: { users: '3', whatsapp: '1', instagram: '1', replies: '3.000' },
        en: { users: '3', whatsapp: '1', instagram: '1', replies: '3,000' },
      },
      tr: {
        name: 'Başlangıç',
        pitch: "Tek telefondaki WhatsApp'ınız ve Instagram'ınız artık bütün ekibinizin; Allync AI gece gündüz yanıt verir.",
        cta: 'Hemen başlayın',
        features: [
          '1 WhatsApp numarası, 1 Instagram hesabı, 3 kullanıcı',
          'Allync AI müşterinin dilinde 7/24 yanıt verir, bilmediğini uydurmaz',
          'Ayda 3.000 Allync AI yanıtı; ekibinizin yanıtları sayılmaz',
          'Randevu ya da sipariş: Allync AI sohbetten alır, panelinize düşer',
          'Müşteri kartı: aynı kişinin WhatsApp ve Instagram sohbetleri tek kartta, duygu değişimiyle',
          'Tek dokunuşla devralma, hazır yanıtlar ve iç notlar',
          'Kişiye özel izinler, müşteri numarası gizleme ve ekip performansı',
          'Web, Android ve iPhone uygulamaları',
        ],
        limits: [
          '3 kullanıcı (sahip dahil)',
          '1 WhatsApp numarası',
          '1 Instagram hesabı',
          "Google Takvim ek paket; Instagram yorumlarına Allync AI yanıtı Pro'da",
          'Ayda 3.000 Allync AI yanıtı (WhatsApp)',
          '200 ürün ya da hizmet',
          'Randevu ya da sipariş modülünden biri',
          'Kampanya, sesli mesaj, VIP, medya kütüphanesi, sektör seti yok',
        ],
      },
      en: {
        name: 'Starter',
        pitch: 'The WhatsApp and Instagram on one phone now belong to your whole team; Allync AI replies day and night.',
        cta: 'Get started',
        features: [
          '1 WhatsApp number, 1 Instagram account, 3 users',
          "Allync AI replies 24/7 in your customer's language and never makes things up",
          "3,000 Allync AI replies a month; your team's replies don't count",
          'Appointments or orders: Allync AI takes them in the chat and they land in your panel',
          "Customer card: one person's WhatsApp and Instagram chats on one card, with sentiment over time",
          'One-tap takeover, saved replies and internal notes',
          'Per-person permissions, customer number masking and team performance',
          'Web, Android and iPhone apps',
        ],
        limits: [
          '3 users (owner included)',
          '1 WhatsApp number',
          '1 Instagram account',
          'Google Calendar as an add-on; Allync AI replies to Instagram comments from Pro',
          '3,000 Allync AI replies a month (WhatsApp)',
          '200 products or services',
          'One of appointments or orders',
          'No campaigns, voice messages, VIP, media library or industry set',
        ],
      },
    },

    {
      id: 'pro',
      featured: true,
      firstMonthFree: true,
      price: {
        USD: { monthly: 350, sixMonth: 1890, yearly: 3360 },
        TRY: { monthly: 15750, sixMonth: 85050, yearly: 151200 },
      },
      stats: {
        tr: { users: '5', whatsapp: '2', instagram: '2', replies: '10.000' },
        en: { users: '5', whatsapp: '2', instagram: '2', replies: '10,000' },
      },
      tr: {
        name: 'Pro',
        pitch: 'WhatsApp ve Instagram tek gelen kutusunda; kampanya, randevu ve sipariş aynı ekipte.',
        badge: 'Önerilen',
        cta: "Pro'yu seçin",
        features: [
          "Başlangıç'taki her şey; 5 kullanıcı, 2 WhatsApp numarası, 2 Instagram hesabı",
          'Allync AI Instagram yorumlarına da yanıt verir',
          'Ayda 10.000 Allync AI yanıtı',
          'Allync AI WhatsApp sesli mesajlarını anlar ve yanıtlar',
          'Onaylı şablonlarla kampanya ve ileri tarihli gönderim',
          'Randevu ve sipariş birlikte; Google Takvim ve E-Tablolar bağlantısı',
          'Sektörünüze özel bir modül seti',
        ],
        limits: [
          '5 kullanıcı',
          '2 WhatsApp numarası, 2 Instagram hesabı, 2 Google bağlantısı',
          'Ayda 10.000 Allync AI yanıtı',
          '1.000 ürün, 100 medya dosyası, 50 VIP kişi',
          'Sesli mesaj günlük adil kullanım bütçesiyle',
          '1 sektör seti',
          "Kampanya hacmi Meta'nın numaranıza tanıdığı limitle sınırlı",
        ],
      },
      en: {
        name: 'Pro',
        pitch: 'WhatsApp and Instagram in one inbox; campaigns, appointments and orders for the whole team.',
        badge: 'Recommended',
        cta: 'Choose Pro',
        features: [
          'Everything in Starter; 5 users, 2 WhatsApp numbers, 2 Instagram accounts',
          'Allync AI also replies to Instagram comments',
          '10,000 Allync AI replies a month',
          'Allync AI understands and answers WhatsApp voice messages',
          'Campaigns with approved templates, sent now or scheduled',
          'Appointments and orders together; Google Calendar and Sheets',
          'One module set built for your industry',
        ],
        limits: [
          '5 users',
          '2 WhatsApp numbers, 2 Instagram accounts, 2 Google connections',
          '10,000 Allync AI replies a month',
          '1,000 products, 100 media files, 50 VIP contacts',
          'Voice messages within a daily fair-use budget',
          '1 industry set',
          "Campaign volume limited by Meta's limit for your number",
        ],
      },
    },

    {
      id: 'premium',
      firstMonthFree: true,
      price: {
        USD: { monthly: 450, sixMonth: 2430, yearly: 4320 },
        TRY: { monthly: 20250, sixMonth: 109350, yearly: 194400 },
      },
      stats: {
        tr: { users: '10', whatsapp: '5', instagram: '3', replies: '25.000' },
        en: { users: '10', whatsapp: '5', instagram: '3', replies: '25,000' },
      },
      tr: {
        name: 'Premium',
        pitch: 'Şubeleriniz, numaralarınız ve 10 kişilik ekibiniz tek panelde.',
        cta: "Premium'u seçin",
        features: [
          "Pro'daki her şey; 10 kullanıcı, 5 WhatsApp numarası, 3 Instagram hesabı",
          'Ayda 25.000 Allync AI yanıtı',
          'Müşteri hesabı: satış, tahsilat, bakiye ve personel komisyonu',
          'İki sektör modül seti',
          'Kiosk: işletmenizde kayıt tableti',
          'REST API ve webhook: verileriniz kendi sisteminize akar',
        ],
        limits: [
          '10 kullanıcı',
          '5 WhatsApp numarası, 3 Instagram hesabı, 5 Google bağlantısı',
          'Ayda 25.000 Allync AI yanıtı',
          '5.000 ürün, 300 medya dosyası, 200 VIP kişi, 100 takip edilen uçuş',
          '3 kiosk cihazı (Allync ID hesabı gerekir)',
          '2 sektör seti',
          'Beyaz etiket ek paket',
        ],
      },
      en: {
        name: 'Premium',
        pitch: 'Your branches, numbers and a 10-person team in one panel.',
        cta: 'Choose Premium',
        features: [
          'Everything in Pro; 10 users, 5 WhatsApp numbers, 3 Instagram accounts',
          '25,000 Allync AI replies a month',
          'Customer accounts: sales, payments, balances and staff commission',
          'Two industry module sets',
          'Kiosk: a sign-in tablet at your location',
          'REST API and webhooks: your data flows into your own systems',
        ],
        limits: [
          '10 users',
          '5 WhatsApp numbers, 3 Instagram accounts, 5 Google connections',
          '25,000 Allync AI replies a month',
          '5,000 products, 300 media files, 200 VIP contacts, 100 tracked flights',
          '3 kiosk devices (Allync ID account required)',
          '2 industry sets',
          'White label as an add-on',
        ],
      },
    },

    {
      id: 'enterprise',
      quoteOnly: true,
      firstMonthFree: true,
      price: {
        USD: { monthly: null, sixMonth: null, yearly: null },
        TRY: { monthly: null, sixMonth: null, yearly: null },
      },
      stats: {
        tr: { users: 'Sözleşmeyle', whatsapp: 'Sözleşmeyle', instagram: 'Sözleşmeyle', replies: 'Taahhütle' },
        en: { users: 'By contract', whatsapp: 'By contract', instagram: 'By contract', replies: 'By commitment' },
      },
      tr: {
        name: 'Kurumsal',
        pitch: 'Kendi markanızla, ihtiyacınız kadar kapasiteyle; Allync Ekibi yanınızda.',
        cta: 'Teklif isteyin',
        features: [
          "Premium'daki her şey ve bütün sektör modülleri",
          'Kullanıcı, numara ve Allync AI kapasitesi ihtiyacınıza göre',
          'Kendi markanız: logonuz, renkleriniz, şablon alt bilginiz',
          'Taahhüdü aştığınız ayda Allync AI susmaz',
          "Kurulum ve ekip eğitimi Allync Ekibi'nden",
          'Erken erişim: WhatsApp aramalarını Allync AI yanıtlar',
        ],
        limits: [
          'Kullanıcı, kanal ve kaynak sınırları sözleşmeyle',
          'Yıllık taahhütlü Allync AI kapasitesi, %20 tampon',
          'Sesli arama erken erişim, numara bazında ve günlük bütçeyle',
          'Bağlı uygulamalar yakında',
          'Yalnızca yıllık sözleşme',
        ],
      },
      en: {
        name: 'Enterprise',
        pitch: 'Your brand, the capacity you need, and the Allync Team at your side.',
        cta: 'Request a quote',
        features: [
          'Everything in Premium, plus every industry module',
          'Users, numbers and Allync AI capacity sized to you',
          'Your own brand: logo, colours and template footer',
          'Allync AI keeps answering when you go over your commitment',
          'Setup and team training by the Allync Team',
          'Early access: Allync AI answers your WhatsApp calls',
        ],
        limits: [
          'Users, channels and resources set by contract',
          'Annual committed Allync AI capacity with a 20% buffer',
          'Voice calls in early access, per number and with a daily budget',
          'Connected apps coming soon',
          'Annual contract only',
        ],
      },
    },
  ],

  included: {
    tr: [
      'Ortak gelen kutusu, Allync AI, ekip araçları ve güvenlik her pakette',
      'Web, Android ve iPhone uygulamaları',
      'İki adımlı doğrulama, etkinlik kaydı ve KVKK araçları',
      'İlk asistan kurulumu her pakette dahil',
    ],
    en: [
      'The shared inbox, Allync AI, team tools and security on every plan',
      'Web, Android and iPhone apps',
      'Two-step verification, activity log and data-protection tools',
      'The first assistant setup is included on every plan',
    ],
  },

  compare: COMPARE,

  notes: {
    tr: [
      {
        title: 'Ekibinizin yanıtları sayılmaz',
        body: 'Paketteki kota yalnızca Allync AI’ın verdiği yanıtları kapsar. Ekibinizin yazdığı her mesaj her pakette sınırsızdır.',
      },
      {
        title: 'Şablon mesajlarının ücretini Meta alır',
        body: 'Allync yalnızca paket ücretini alır. Kampanya ve hatırlatma gibi onaylı şablon mesajlarını Meta ücretlendirir ve ücreti doğrudan işletmenizin Meta hesabından alır; Allync bu ücrete ekleme yapmaz. Müşteriniz yazdıktan sonraki 24 saat içindeki yanıtlar ücretsizdir.',
      },
      {
        title: 'Numaranız sizin kalır',
        body: 'WhatsApp numaranız Meta’nın resmi bağlantısıyla sizin hesabınıza bağlanır. Kurulumda Allync Ekibi yanınızdadır.',
      },
    ],
    en: [
      {
        title: 'Your team’s replies don’t count',
        body: 'The plan quota covers only replies written by Allync AI. Every message your team writes is unlimited on every plan.',
      },
      {
        title: 'Meta charges for template messages',
        body: 'Allync charges only the plan fee. Meta charges for approved template messages such as campaigns and reminders, directly to your business’s Meta account; Allync adds nothing on top. Replies within 24 hours of your customer’s message are free.',
      },
      {
        title: 'Your number stays yours',
        body: 'Your WhatsApp number is connected to your own account through Meta’s official connection. The Allync Team is with you during setup.',
      },
    ],
  },

  faq: {
    tr: [
      {
        q: 'Allync AI yanıtı nedir?',
        a: 'Allync AI’ın müşterinizin bir mesajına verdiği yanıttır. Yanıt birkaç balona bölünse de bir sayılır. Ekibinizin yazdığı yanıtlar hiçbir pakette sayılmaz.',
      },
      {
        q: 'Kullanıcı ne demek?',
        a: 'Allync Hub’a kendi adıyla giren her ekip üyesi bir kullanıcıdır. Herkes kendi girişiyle bilgisayardan ya da telefondan çalışır; bir kullanıcı aynı anda tek cihazda açık kalır.',
      },
      {
        q: 'Ödeme seçenekleri neler?',
        a: 'Aylık, 6 aylık ya da yıllık ödeyebilirsiniz. 6 aylık ödemede %10, yıllık ödemede %20 indirim uygulanır. Hangi seçeneği seçerseniz seçin, her pakette ilk ay ücretsizdir.',
      },
      {
        q: 'Ek modüller ne kadar?',
        a: 'Paketinizde olmayan her modül ayda 50 $ (2.250 TL) ek ücretle eklenir. Kullanıcı, numara ve Allync AI kapasitesi eklemek için Allync Ekibi ile görüşün.',
      },
      {
        q: 'Hangi cihazlardan kullanılır?',
        a: 'Web paneli, Android ve iPhone uygulamaları her pakette vardır. Ekibiniz nerede olursa olsun aynı gelen kutusunu görür.',
      },
      {
        q: 'Hazır şablonları gönderince ücret öder miyim?',
        a: 'Allync şablon başına ücret almaz, yalnızca paket ücretini alır. Onaylı şablon mesajlarını (kampanya, hatırlatma, sipariş ve randevu bildirimi) Meta ücretlendirir ve ücreti doğrudan işletmenizin Meta hesabından alır. Müşteriniz yazdıktan sonraki 24 saat içindeki yanıtlar ücretsizdir.',
      },
      {
        q: 'Aynı müşteri hem WhatsApp’tan hem Instagram’dan yazarsa?',
        a: 'Müşteri kartında iki kanalın sohbetleri birbirine bağlanır; yanlış eşleşen kişileri birleştirebilir ya da ayırabilirsiniz. Instagram’dan yazan müşteri telefon numarasını verdiğinde Allync AI, yalnızca gerçek müşterinin bilebileceği bir soruyla onu kaydına güvenle bağlar.',
      },
      {
        q: 'Ekibim müşteri numaralarını görmesin istiyorum.',
        a: 'Her ekip üyesi için numaraları tam görme, hiç görmeme ya da yalnızca seçtiğiniz müşterilerin numaralarını gizleme seçebilirsiniz. Gizleme panelde ve uygulama ekranlarında uygulanır; sahip numaraları her zaman görür.',
      },
      {
        q: 'Kurulum nasıl olur?',
        a: 'Numaranız Meta’nın resmi bağlantısıyla sizin hesabınıza bağlanır, Allync Ekibi asistanınızı işletmenize göre hazırlar. İlk asistan kurulumu her pakette dahildir.',
      },
    ],
    en: [
      {
        q: 'What is an Allync AI reply?',
        a: 'A reply Allync AI gives to one of your customer’s messages. It counts once, even when it is split into several bubbles. Replies your team writes never count on any plan.',
      },
      {
        q: 'What is a user?',
        a: 'Every team member who signs in to Allync Hub under their own name. Everyone works from a computer or phone with their own login; one user stays signed in on one device at a time.',
      },
      {
        q: 'How can we pay?',
        a: 'Monthly, every 6 months or yearly. Paying every 6 months saves 10%, paying yearly saves 20%. Whichever you choose, the first month is free on every plan.',
      },
      {
        q: 'How much are add-on modules?',
        a: 'Every module outside your plan is added for USD 50 (TRY 2,250) a month. To add users, numbers or Allync AI capacity, talk to the Allync Team.',
      },
      {
        q: 'Which devices can we use?',
        a: 'The web panel and the Android and iPhone apps are included on every plan. Your team sees the same inbox wherever they are.',
      },
      {
        q: 'Do I pay when I send ready-made templates?',
        a: 'Allync does not charge per template; you pay only the plan fee. Meta charges for approved template messages (campaigns, reminders, order and appointment notices), directly to your business’s Meta account. Replies within 24 hours of your customer’s message are free.',
      },
      {
        q: 'What if the same customer writes on WhatsApp and Instagram?',
        a: 'The customer card links both channels’ chats; you can merge or split people who were matched wrongly. When a customer on Instagram shares their phone number, Allync AI links them to their record with a question only the real customer can answer.',
      },
      {
        q: 'I don’t want my team to see customer numbers.',
        a: 'For each team member you can show all numbers, hide all of them, or hide only the customers you choose. Masking applies in the panel and app screens; the owner always sees the numbers.',
      },
      {
        q: 'How does setup work?',
        a: 'Your number is connected to your own account through Meta’s official connection, and the Allync Team prepares your assistant for your business. The first assistant setup is included on every plan.',
      },
    ],
  },

  addOns: {
    tr: [
      {
        title: 'Ek modüller',
        price: '$50 / modül / ay (₺2.250)',
        items: [
          'Sesli mesaj (Başlangıç): Allync AI WhatsApp sesli mesajlarını anlar ve yanıtlar, günlük bütçeyle',
          'İkinci iş modülü (Başlangıç): randevuya sipariş ya da siparişe randevu',
          'Google Takvim (Başlangıç)',
          'Müşteri hesabı ve personel komisyonu (Pro)',
          'API ve webhook (Pro)',
          'Kiosk (Pro) ve ek kiosk cihazı (Premium ve üstü)',
          'Ek sektör seti (Pro, Premium)',
          'Beyaz etiket (Premium)',
        ],
      },
      {
        title: 'Kapasite ekleri',
        price: 'Fiyat için Allync Ekibi ile görüşün',
        items: [
          'Ek kullanıcı paketi: 5 kullanıcı',
          'Ek WhatsApp numarası (tek seferlik kurulum bedeliyle)',
          'Ek Instagram hesabı (her paket)',
          'Ek Allync AI yanıt bloğu (aylık)',
          'Kapasite artışı: ürün, medya, VIP, takip edilen uçuş',
          'Ek sesli mesaj kapasitesi (Pro ve üstü)',
        ],
      },
      {
        title: 'Tek seferlik hizmetler',
        price: 'Fiyat için Allync Ekibi ile görüşün',
        items: ['Kurulum, eğitim ve içerik hizmeti (tek seferlik)'],
      },
    ],
    en: [
      {
        title: 'Add-on modules',
        price: '$50 / module / month (TRY 2,250)',
        items: [
          'Voice messages (Starter): Allync AI understands and answers WhatsApp voice messages, within a daily budget',
          'Second business module (Starter): add orders to appointments, or appointments to orders',
          'Google Calendar (Starter)',
          'Customer accounts and staff commission (Pro)',
          'API and webhooks (Pro)',
          'Kiosk (Pro) and extra kiosk devices (Premium and above)',
          'Extra industry set (Pro, Premium)',
          'White label (Premium)',
        ],
      },
      {
        title: 'Capacity add-ons',
        price: 'Talk to the Allync Team for pricing',
        items: [
          'Extra users: pack of 5',
          'Extra WhatsApp number (with a one-time setup fee)',
          'Extra Instagram account (any plan)',
          'Extra Allync AI reply block (monthly)',
          'More capacity: products, media, VIP contacts, tracked flights',
          'Extra voice message capacity (Pro and above)',
        ],
      },
      {
        title: 'One-time services',
        price: 'Talk to the Allync Team for pricing',
        items: ['Setup, training and content service (one-time)'],
      },
    ],
  },

  finePrint: {
    tr: 'Fiyatlar aylık karşılıktır; vergiler ülkenize göre eklenir. Her pakette ilk ay ücretsizdir.',
    en: 'Prices are per month; taxes are added according to your country. The first month is free on every plan.',
  },
};
