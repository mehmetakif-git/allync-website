/* ============================================================
   src/content/catalog.ts — the product registry
   ------------------------------------------------------------
   Separate from pricing.ts on purpose. A product file imports
   MODULE_PRICE and the types from pricing.ts, so if pricing.ts
   imported the products back, ESM hoisting would evaluate a product
   BEFORE pricing.ts's own consts existed — leaving MODULE_PRICE in
   its temporal dead zone and turning every surcharge into NaN.
   Types and money rules live in pricing.ts; the list lives here.

   To add a product: write src/content/products/<id>.ts and append
   it below. Nothing else needs to change — the step list, the
   picker and the quote terminal all derive from the data.
   ============================================================ */

import type { Product } from './pricing';
import { HUB } from './products/hub';
import { SIGNAGE } from './products/signage';
import { PLUS } from './products/plus';

export const PRODUCTS: Product[] = [HUB, SIGNAGE, PLUS];
