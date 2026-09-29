/* ============================================================
   src/content/products/plus.ts — ALLYNC+
   ------------------------------------------------------------
   `plans: []` is the launch state; the page renders the FORMING
   panel. Add plans here and the flow grows by itself.
   ============================================================ */

import type { Product } from '../pricing';

export const PLUS: Product = {
  id: 'plus',
  accent: '--plus',
  comingSoon: true,
  tr: {
    name: 'Allync+',
    tagline: 'İK’dan muhasebeye, CRM’den stoğa — tüm operasyon tek panelde.',
  },
  en: {
    name: 'Allync+',
    tagline: 'From HR to accounting, CRM to inventory — every operation in one panel.',
  },
  plans: [],
  included: {
    tr: [
      'Sektöre göre yapılandırılan iş modülleri',
      'İK, CRM, satış, muhasebe ve stok',
      'Müşteri ve personel için ayrı mobil uygulamalar',
      'Tek panel, tek giriş, tek altyapı',
    ],
    en: [
      'Business modules configured per sector',
      'HR, CRM, sales, accounting and inventory',
      'Separate mobile apps for customers and staff',
      'One panel, one login, one foundation',
    ],
  },
  finePrint: {
    tr: 'Fiyatlar aylık karşılıktır; vergiler ülkenize göre eklenir.',
    en: 'Prices are per month; taxes are added according to your country.',
  },
};
