import React, { useState, useMemo, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  Star,
  ChevronDown,
  Check,
  Package,
  ArrowLeft,
  CreditCard,
  Truck
} from 'lucide-react';
import {
  Product,
  CartItem,
  ProductCategory,
  categories,
  products,
  searchProducts
} from '../../data/ecommerceDemoData';
import { getProductImage } from '../../assets/ecommerce-demo';
import { useSoundEffect } from '../../contexts/SoundEffectContext';
import allyncLogo from '../../assets/logo.svg';

interface EcommerceDemoProps {
  language: 'tr' | 'en';
  onContactClick?: () => void;
}

type DemoView = 'shop' | 'cart' | 'checkout' | 'success';

// Product Image Component - defined outside to prevent re-creation
interface ProductImageProps {
  product: Product;
  className?: string;
  language: 'tr' | 'en';
}

const ProductImage: React.FC<ProductImageProps> = memo(({ product, className, language }) => {
  const image = getProductImage(product.id);
  if (image) {
    return <img src={image} alt={product.name[language]} className={className} />;
  }
  return (
    <div className={`${className} bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center`}>
      <Package className="w-12 h-12 text-gray-500" />
    </div>
  );
});

// Simple Product Card Component
interface ProductCardProps {
  product: Product;
  language: 'tr' | 'en';
  isSelected: boolean;
  onSelect: (productId: string | null) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = memo(({ product, language, isSelected, onSelect, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  // Currency symbol based on language
  const currency = language === 'tr' ? '₺' : '$';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, quantity);
    setQuantity(1);
    onSelect(null);
  };

  return (
    <div
      className="relative h-[280px] cursor-pointer"
      onClick={() => onSelect(isSelected ? null : product.id)}
    >
      {/* Front - Product Image & Info */}
      {!isSelected ? (
        <div className="h-full bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-green-500/50 transition-all">
          <div className="relative h-[180px] overflow-hidden">
            <ProductImage product={product} language={language} className="w-full h-full object-cover" />
            {product.badge && (
              <span className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                {product.badge[language]}
              </span>
            )}
            {/* Show quantity badge when quantity > 1 */}
            {quantity > 1 && (
              <span className="absolute top-2 right-2 w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {quantity}
              </span>
            )}
          </div>
          <div className="p-3">
            <h3 className="text-white text-sm font-medium truncate">{product.name[language]}</h3>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-gray-400">{product.rating} ({product.reviews})</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-green-400 font-bold">{currency}{product.price}</span>
              {product.originalPrice && (
                <span className="text-gray-500 text-sm line-through">{currency}{product.originalPrice}</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Back - Product Details & Add to Cart */
        <div className="h-full bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] rounded-xl overflow-hidden border border-green-500/30 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white text-sm font-bold truncate flex-1">{product.name[language]}</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(null);
              }}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <p className="text-gray-400 text-xs line-clamp-3 mb-3">{product.description[language]}</p>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-green-400 font-bold text-lg">{currency}{product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-500 text-sm line-through">{currency}{product.originalPrice}</span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(Math.max(1, quantity - 1));
              }}
              className="p-1.5 bg-white/10 rounded hover:bg-white/20 transition-colors"
            >
              <Minus className="w-3 h-3 text-white" />
            </button>
            <span className="text-white font-bold w-6 text-center text-sm">{quantity}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(quantity + 1);
              }}
              className="p-1.5 bg-white/10 rounded hover:bg-white/20 transition-colors"
            >
              <Plus className="w-3 h-3 text-white" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-auto w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            {language === 'tr' ? 'Sepete Ekle' : 'Add to Cart'}
          </button>
        </div>
      )}
    </div>
  );
});

export const EcommerceDemo: React.FC<EcommerceDemoProps> = ({ language, onContactClick }) => {
  const { playClickSound } = useSoundEffect();

  // Currency symbol based on language
  const currency = language === 'tr' ? '₺' : '$';

  // State
  const [view, setView] = useState<DemoView>('shop');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return searchProducts(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  // Cart helpers
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    playClickSound();
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  }, [playClickSound]);

  const updateQuantity = (productId: string, delta: number) => {
    playClickSound();
    setCart(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    playClickSound();
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const handleCheckout = () => {
    playClickSound();
    setIsCartOpen(false);
    setView('checkout');
  };

  const handleCompleteOrder = () => {
    playClickSound();
    setView('success');
  };

  const handleContinueShopping = () => {
    playClickSound();
    setCart([]);
    setView('shop');
  };

  // Handle product selection
  const handleSelect = useCallback((productId: string | null) => {
    playClickSound();
    setSelectedProductId(productId);
  }, [playClickSound]);

  // Shop View
  const ShopView = () => (
    <div className="min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/10">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center p-1.5">
              <img src={allyncLogo} alt="Allync" className="w-full h-full" />
            </div>
            <span className="text-white font-bold text-lg">AllyncShop</span>
          </div>
          {/* Cart Button & Dropdown Container */}
          <div className="relative">
            <button
              onClick={() => {
                playClickSound();
                setIsCartOpen(!isCartOpen);
              }}
              className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-white" />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </button>

            {/* Cart Dropdown */}
            <AnimatePresence>
              {isCartOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-80 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between p-3 border-b border-white/10">
                    <h3 className="text-sm font-bold text-white">
                      {language === 'tr' ? 'Sepetim' : 'My Cart'} ({cartItemCount})
                    </h3>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  <div className="max-h-64 overflow-y-auto p-2 space-y-2">
                    {cart.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{language === 'tr' ? 'Sepetiniz boş' : 'Your cart is empty'}</p>
                      </div>
                    ) : (
                      cart.map(item => (
                        <motion.div
                          key={item.id}
                          layout
                          className="flex gap-2 bg-white/5 rounded-lg p-2"
                        >
                          <ProductImage product={item} language={language} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-xs font-medium truncate">{item.name[language]}</h4>
                            <p className="text-green-400 text-sm font-bold">{currency}{item.price}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-0.5 bg-white/10 rounded hover:bg-white/20 transition-colors"
                              >
                                <Minus className="w-3 h-3 text-white" />
                              </button>
                              <span className="text-white text-xs w-5 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-0.5 bg-white/10 rounded hover:bg-white/20 transition-colors"
                              >
                                <Plus className="w-3 h-3 text-white" />
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 hover:bg-red-500/20 rounded transition-colors self-start"
                          >
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </button>
                        </motion.div>
                      ))
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="p-3 border-t border-white/10">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-400 text-sm">{language === 'tr' ? 'Toplam' : 'Total'}</span>
                        <span className="text-lg font-bold text-green-400">{currency}{cartTotal.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={handleCheckout}
                        className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
                      >
                        {language === 'tr' ? 'Ödemeye Geç' : 'Proceed to Checkout'}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="px-4 pb-3 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'tr' ? 'Ürün ara...' : 'Search products...'}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-green-500/50"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => {
                playClickSound();
                setIsCategoryOpen(!isCategoryOpen);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm hover:bg-white/10 transition-colors"
            >
              {categories.find(c => c.id === selectedCategory)?.name[language]}
              <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isCategoryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-1 w-40 bg-[#1a1a2e] border border-white/10 rounded-lg overflow-hidden z-30"
                >
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        playClickSound();
                        setSelectedCategory(cat.id);
                        setIsCategoryOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors ${selectedCategory === cat.id ? 'text-green-400 bg-white/5' : 'text-white'}`}
                    >
                      {cat.name[language]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              language={language}
              isSelected={selectedProductId === product.id}
              onSelect={handleSelect}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            {language === 'tr' ? 'Ürün bulunamadı' : 'No products found'}
          </div>
        )}
      </div>

    </div>
  );

  // Checkout View
  const CheckoutView = () => (
    <div className="min-h-full bg-[#0a0a0f]">
      <div className="sticky top-0 z-20 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => {
              playClickSound();
              setView('shop');
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">
            {language === 'tr' ? 'Ödeme' : 'Checkout'}
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Shipping Info */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="w-5 h-5 text-green-400" />
            <h2 className="text-white font-semibold">
              {language === 'tr' ? 'Teslimat Bilgileri' : 'Shipping Info'}
            </h2>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              placeholder={language === 'tr' ? 'Ad Soyad' : 'Full Name'}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500/50"
            />
            <input
              type="text"
              placeholder={language === 'tr' ? 'Adres' : 'Address'}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500/50"
            />
            <input
              type="tel"
              placeholder={language === 'tr' ? 'Telefon' : 'Phone'}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500/50"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-green-400" />
            <h2 className="text-white font-semibold">
              {language === 'tr' ? 'Ödeme Yöntemi' : 'Payment Method'}
            </h2>
          </div>
          <div className="space-y-2">
            {['Kredi Kartı', 'Havale/EFT', 'Kapıda Ödeme'].map((method, i) => (
              <label key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                <input type="radio" name="payment" defaultChecked={i === 0} className="accent-green-500" />
                <span className="text-white">{language === 'tr' ? method : ['Credit Card', 'Bank Transfer', 'Cash on Delivery'][i]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h2 className="text-white font-semibold mb-3">
            {language === 'tr' ? 'Sipariş Özeti' : 'Order Summary'}
          </h2>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-gray-400">{item.name[language]} x{item.quantity}</span>
              <span className="text-white">{currency}{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 mt-2 border-t border-white/10">
            <span className="text-white font-semibold">{language === 'tr' ? 'Toplam' : 'Total'}</span>
            <span className="text-xl font-bold text-green-400">{currency}{cartTotal.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={handleCompleteOrder}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
        >
          {language === 'tr' ? 'Siparişi Tamamla' : 'Complete Order'}
        </button>
      </div>
    </div>
  );

  // Success View
  const SuccessView = () => (
    <div className="min-h-full bg-[#0a0a0f] flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6"
      >
        <Check className="w-12 h-12 text-white" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-white mb-2"
      >
        {language === 'tr' ? 'Sipariş Alındı!' : 'Order Confirmed!'}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-400 mb-8"
      >
        {language === 'tr'
          ? 'Siparişiniz başarıyla oluşturuldu. Teşekkür ederiz!'
          : 'Your order has been placed successfully. Thank you!'}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3 w-full max-w-xs"
      >
        <button
          onClick={handleContinueShopping}
          className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          {language === 'tr' ? 'Alışverişe Devam Et' : 'Continue Shopping'}
        </button>
        {onContactClick && (
          <button
            onClick={onContactClick}
            className="w-full py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
          >
            {language === 'tr' ? 'Gerçek Mağaza Kurmak İster misiniz?' : 'Want to Build a Real Store?'}
          </button>
        )}
      </motion.div>
    </div>
  );

  return (
    <div className="h-full">
      <AnimatePresence mode="wait">
        {view === 'shop' && <ShopView key="shop" />}
        {view === 'checkout' && <CheckoutView key="checkout" />}
        {view === 'success' && <SuccessView key="success" />}
      </AnimatePresence>
    </div>
  );
};
