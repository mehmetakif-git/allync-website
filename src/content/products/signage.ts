/* ============================================================
   src/content/products/signage.ts — ALLYNC DIGITAL SIGNAGE
   ------------------------------------------------------------
   `plans: []` is not an edge case: it is the launch state, and the
   page renders it as the FORMING panel — a designed state, not a
   placeholder. Add plans here and the flow grows by itself.
   ============================================================ */

import type { Product } from '../pricing';

export const SIGNAGE: Product = {
  id: 'signage',
  accent: '--signage',
  comingSoon: true,
  tr: {
    name: 'Digital Signage',
    tagline: 'Android ve Windows ekranları tek buluttan yöneten akıllı dijital tabela.',
  },
  en: {
    name: 'Digital Signage',
    tagline: 'Smart digital signage running Android and Windows screens from one cloud.',
  },
  plans: [],
  included: {
    tr: [
      'Tek buluttan binlerce ekran, gerçek zamanlı',
      'Çevrimdışıyken bile kesintisiz yayın',
      'Video wall, kiosk ve dijital menü',
      'Android TV, tablet ve Windows ekranlar',
    ],
    en: [
      'Thousands of screens from one cloud, in real time',
      'Uninterrupted playback even while offline',
      'Video wall, kiosk and digital menus',
      'Android TV, tablet and Windows screens',
    ],
  },
  finePrint: {
    tr: 'Fiyatlar aylık karşılıktır; vergiler ülkenize göre eklenir.',
    en: 'Prices are per month; taxes are added according to your country.',
  },
};
