// E-commerce Demo Data

export type ProductCategory = 'all' | 'electronics' | 'clothing' | 'accessories';

export interface Product {
  id: string;
  name: { tr: string; en: string };
  description: { tr: string; en: string };
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  image: string | null;
  badge?: { tr: string; en: string };
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export const categories: { id: ProductCategory; name: { tr: string; en: string } }[] = [
  { id: 'all', name: { tr: 'Tümü', en: 'All' } },
  { id: 'electronics', name: { tr: 'Elektronik', en: 'Electronics' } },
  { id: 'clothing', name: { tr: 'Giyim', en: 'Clothing' } },
  { id: 'accessories', name: { tr: 'Aksesuar', en: 'Accessories' } },
];

export const products: Product[] = [
  {
    id: 'product-1',
    name: { tr: 'Kablosuz Kulaklık Pro', en: 'Wireless Headphones Pro' },
    description: {
      tr: 'Aktif gürültü engelleme, 30 saat pil ömrü, premium ses kalitesi',
      en: 'Active noise cancellation, 30-hour battery life, premium sound quality'
    },
    price: 1299,
    originalPrice: 1599,
    category: 'electronics',
    image: null,
    badge: { tr: 'İndirim', en: 'Sale' },
    rating: 4.8,
    reviews: 234,
  },
  {
    id: 'product-2',
    name: { tr: 'Akıllı Saat Ultra', en: 'Smart Watch Ultra' },
    description: {
      tr: 'GPS, kalp ritmi takibi, 7 gün pil ömrü, su geçirmez',
      en: 'GPS, heart rate monitoring, 7-day battery life, waterproof'
    },
    price: 2499,
    category: 'electronics',
    image: null,
    badge: { tr: 'Yeni', en: 'New' },
    rating: 4.9,
    reviews: 189,
  },
  {
    id: 'product-3',
    name: { tr: 'Premium Pamuklu T-Shirt', en: 'Premium Cotton T-Shirt' },
    description: {
      tr: '%100 organik pamuk, nefes alan kumaş, rahat kesim',
      en: '100% organic cotton, breathable fabric, comfortable fit'
    },
    price: 299,
    originalPrice: 399,
    category: 'clothing',
    image: null,
    badge: { tr: '%25 İndirim', en: '25% Off' },
    rating: 4.6,
    reviews: 412,
  },
  {
    id: 'product-4',
    name: { tr: 'Spor Ayakkabı Air', en: 'Air Sport Sneakers' },
    description: {
      tr: 'Hafif tasarım, jel tabanlık, maksimum konfor',
      en: 'Lightweight design, gel insole, maximum comfort'
    },
    price: 899,
    category: 'clothing',
    image: null,
    rating: 4.7,
    reviews: 328,
  },
  {
    id: 'product-5',
    name: { tr: 'Deri Sırt Çantası', en: 'Leather Backpack' },
    description: {
      tr: 'Gerçek deri, laptop bölmesi, su geçirmez astar',
      en: 'Genuine leather, laptop compartment, waterproof lining'
    },
    price: 1199,
    originalPrice: 1499,
    category: 'accessories',
    image: null,
    badge: { tr: 'Popüler', en: 'Popular' },
    rating: 4.8,
    reviews: 156,
  },
  {
    id: 'product-6',
    name: { tr: 'Polarize Güneş Gözlüğü', en: 'Polarized Sunglasses' },
    description: {
      tr: 'UV400 koruma, titanyum çerçeve, premium lens',
      en: 'UV400 protection, titanium frame, premium lens'
    },
    price: 599,
    category: 'accessories',
    image: null,
    rating: 4.5,
    reviews: 267,
  },
];

export const getProductsByCategory = (category: ProductCategory): Product[] => {
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
};

export const searchProducts = (query: string, category: ProductCategory = 'all'): Product[] => {
  const filtered = getProductsByCategory(category);
  if (!query.trim()) return filtered;

  const lowerQuery = query.toLowerCase();
  return filtered.filter(p =>
    p.name.tr.toLowerCase().includes(lowerQuery) ||
    p.name.en.toLowerCase().includes(lowerQuery) ||
    p.description.tr.toLowerCase().includes(lowerQuery) ||
    p.description.en.toLowerCase().includes(lowerQuery)
  );
};
