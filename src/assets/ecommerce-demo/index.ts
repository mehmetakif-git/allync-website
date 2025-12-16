// E-commerce Demo Product Images
// ================================

import product1 from './product-1.webp';
import product2 from './product-2.webp';
import product3 from './product-3.webp';
import product4 from './product-4.webp';
import product5 from './product-5.webp';
import product6 from './product-6.webp';

export const productImages: Record<string, string | null> = {
  'product-1': product1,
  'product-2': product2,
  'product-3': product3,
  'product-4': product4,
  'product-5': product5,
  'product-6': product6,
};

export const getProductImage = (productId: string): string | null => {
  return productImages[productId] || null;
};
