import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './MobileEcommerceDemo.css';

// Assets
import closeIcon from '../../assets/demo-icons/Close_Cross_Circle.svg';
import callIcon from '../../assets/demo-icons/Call_Fill.svg';
import networkIcon from '../../assets/demo-icons/Network.svg';
import sunIcon from '../../assets/demo-icons/Sun_1_Fill.svg';
import musicIcon from '../../assets/demo-icons/music.svg';
import albumCover from '../../assets/demo-icons/The_Weeknd_-_Blinding_Lights.png';
import blindingLightsAudio from '../../assets/demo-icons/The Weeknd - Blinding Lights.mp3';
import allyncLogo from '../../assets/logo.svg';

// Data imports
import {
  Product,
  CartItem,
  ProductCategory,
  categories,
  searchProducts
} from '../../data/ecommerceDemoData';
import { getProductImage } from '../../assets/ecommerce-demo';

// Icons
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

interface MobileEcommerceDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

type DemoView = 'shop' | 'checkout' | 'success';

const uiText = {
  tr: {
    tooltip: "Demo'yu Baslat!",
    exitTooltip: 'Cikis',
    weather: 'Hava Durumu',
    music: 'Muzik',
    playNow: 'Simdi Cal',
    nowPlaying: 'Simdi Caliyor',
    myCart: 'Sepetim',
    emptyCart: 'Sepetiniz bos',
    total: 'Toplam',
    checkout: 'Odemeye Gec',
    payment: 'Odeme',
    shippingInfo: 'Teslimat Bilgileri',
    fullName: 'Ad Soyad',
    address: 'Adres',
    phone: 'Telefon',
    paymentMethod: 'Odeme Yontemi',
    creditCard: 'Kredi Karti',
    bankTransfer: 'Havale/EFT',
    cashOnDelivery: 'Kapida Odeme',
    orderSummary: 'Siparis Ozeti',
    completeOrder: 'Siparisi Tamamla',
    orderConfirmed: 'Siparis Alindi!',
    orderMessage: 'Siparisiz basariyla olusturuldu. Tesekkur ederiz!',
    continueShopping: 'Alisverise Devam Et',
    wantRealStore: 'Gercek Magaza Kurmak Ister misiniz?',
    searchProducts: 'Urun ara...',
    addToCart: 'Sepete Ekle',
    noProducts: 'Urun bulunamadi'
  },
  en: {
    tooltip: 'Start Demo!',
    exitTooltip: 'Exit',
    weather: 'Weather',
    music: 'Music',
    playNow: 'Play Now',
    nowPlaying: 'Now Playing',
    myCart: 'My Cart',
    emptyCart: 'Your cart is empty',
    total: 'Total',
    checkout: 'Checkout',
    payment: 'Payment',
    shippingInfo: 'Shipping Info',
    fullName: 'Full Name',
    address: 'Address',
    phone: 'Phone',
    paymentMethod: 'Payment Method',
    creditCard: 'Credit Card',
    bankTransfer: 'Bank Transfer',
    cashOnDelivery: 'Cash on Delivery',
    orderSummary: 'Order Summary',
    completeOrder: 'Complete Order',
    orderConfirmed: 'Order Confirmed!',
    orderMessage: 'Your order has been placed successfully. Thank you!',
    continueShopping: 'Continue Shopping',
    wantRealStore: 'Want to Build a Real Store?',
    searchProducts: 'Search products...',
    addToCart: 'Add to Cart',
    noProducts: 'No products found'
  }
};

// Product Image Component
const ProductImage: React.FC<{ product: Product; language: 'tr' | 'en'; className?: string }> = ({ product, language, className }) => {
  const image = getProductImage(product.id);
  if (image) {
    return <img src={image} alt={product.name[language]} className={className} />;
  }
  return (
    <div className={`${className} mec-product-placeholder`}>
      <Package />
    </div>
  );
};

export const MobileEcommerceDemo: React.FC<MobileEcommerceDemoProps> = ({
  language,
  onClose,
  onContactClick
}) => {
  // Entry time for clock
  const [entryTime] = useState(() => new Date());
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isAppOpen, setIsAppOpen] = useState(false);

  // Dynamic Island states
  const [dynamicIslandState, setDynamicIslandState] = useState<'collapsed' | 'compact' | 'expanded'>('collapsed');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeControl, setShowVolumeControl] = useState(false);

  // E-commerce states
  const [view, setView] = useState<DemoView>('shop');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const t = uiText[language];
  const currency = language === 'tr' ? '₺' : '$';

  // Filtered products
  const filteredProducts = useMemo(() => {
    return searchProducts(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  // Cart helpers
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Set time and date from entry time
  useEffect(() => {
    const hours = entryTime.getHours().toString().padStart(2, '0');
    const minutes = entryTime.getMinutes().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}`);

    const days = language === 'tr'
      ? ['Pazar', 'Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi']
      : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = language === 'tr'
      ? ['Ocak', 'Subat', 'Mart', 'Nisan', 'Mayis', 'Haziran', 'Temmuz', 'Agustos', 'Eylul', 'Ekim', 'Kasim', 'Aralik']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    setCurrentDate(`${days[entryTime.getDay()]}, ${entryTime.getDate()} ${months[entryTime.getMonth()]}`);
  }, [language, entryTime]);

  // Disable body scroll
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.classList.add('mec-modal-open');
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.classList.remove('mec-modal-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollY);

      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }
    };
  }, []);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(blindingLightsAudio);
    audioRef.current.loop = false;
    audioRef.current.volume = 0;

    const handleEnded = () => {
      setIsMusicPlaying(false);
      setDynamicIslandState('collapsed');
    };

    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }
    };
  }, []);

  // Handle music play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    if (isMusicPlaying) {
      audioRef.current.volume = 0;
      audioRef.current.play().catch(console.error);

      let currentVolume = 0;
      const fadeIn = setInterval(() => {
        currentVolume += 0.05;
        if (currentVolume >= volume) {
          currentVolume = volume;
          clearInterval(fadeIn);
        }
        if (audioRef.current) {
          audioRef.current.volume = currentVolume;
        }
      }, 50);

      // Show volume control
      setShowVolumeControl(true);
    } else {
      let currentVolume = audioRef.current.volume;
      const fadeOut = setInterval(() => {
        currentVolume -= 0.05;
        if (currentVolume <= 0) {
          currentVolume = 0;
          clearInterval(fadeOut);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        }
        if (audioRef.current) {
          audioRef.current.volume = currentVolume;
        }
      }, 50);

      // Hide volume control with delay
      volumeTimeoutRef.current = setTimeout(() => {
        setShowVolumeControl(false);
      }, 500);
    }
  }, [isMusicPlaying, volume]);

  // Handle Dynamic Island state changes
  useEffect(() => {
    if (isMusicPlaying) {
      if (isAppOpen) {
        setDynamicIslandState('compact');
        setShowVolumeControl(false);
      } else {
        setDynamicIslandState('expanded');
        setShowVolumeControl(true);
      }
    }
  }, [isAppOpen, isMusicPlaying]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current && isMusicPlaying) {
      audioRef.current.volume = volume;
    }
  }, [volume, isMusicPlaying]);

  // Cart functions
  const addToCart = useCallback((product: Product, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    setSelectedProduct(null);
    setQuantity(1);
  }, []);

  const updateCartQuantity = useCallback((productId: string, delta: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }, []);

  const openApp = () => {
    setIsAppOpen(true);
  };

  const closeApp = () => {
    setIsAppOpen(false);
    setView('shop');
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCategoryOpen(false);
  };

  const handleClose = () => {
    setIsMusicPlaying(false);
    setDynamicIslandState('collapsed');
    if (onClose) {
      onClose();
    }
  };

  const handleContactNavigation = () => {
    setIsMusicPlaying(false);
    setDynamicIslandState('collapsed');

    document.body.classList.remove('mec-modal-open');
    document.body.style.top = '';

    if (onClose) {
      onClose();
    }

    setTimeout(() => {
      if (onContactClick) {
        onContactClick();
      }
    }, 100);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setView('checkout');
  };

  const handleCompleteOrder = () => {
    setView('success');
  };

  const handleContinueShopping = () => {
    setCart([]);
    setView('shop');
  };

  // Shop View Component
  const ShopView = () => (
    <>
      <div className="mec-shop-header">
        <div className="mec-shop-header-top">
          <button className="mec-shop-close-btn" onClick={closeApp}>
            <X />
          </button>
          <div className="mec-shop-logo">
            <div className="mec-shop-logo-icon">
              <img src={allyncLogo} alt="Allync" />
            </div>
            <span className="mec-shop-logo-text">AllyncShop</span>
          </div>
          <div style={{ position: 'relative' }}>
            <button className="mec-shop-cart-btn" onClick={() => { setIsCategoryOpen(false); setIsCartOpen(!isCartOpen); }}>
              <ShoppingCart />
              {cartItemCount > 0 && (
                <span className="mec-shop-cart-badge">{cartItemCount}</span>
              )}
            </button>

            {/* Cart Dropdown */}
            {isCartOpen && (
              <div className="mec-cart-dropdown" onClick={(e) => e.stopPropagation()}>
                <div className="mec-cart-header">
                  <h3>{t.myCart} ({cartItemCount})</h3>
                  <button className="mec-cart-close" onClick={() => setIsCartOpen(false)}>
                    <X />
                  </button>
                </div>
                <div className="mec-cart-items">
                  {cart.length === 0 ? (
                    <div className="mec-cart-empty">
                      <ShoppingCart />
                      <p>{t.emptyCart}</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="mec-cart-item">
                        <div className="mec-cart-item-image">
                          <ProductImage product={item} language={language} className="" />
                        </div>
                        <div className="mec-cart-item-info">
                          <p className="mec-cart-item-name">{item.name[language]}</p>
                          <p className="mec-cart-item-price">{currency}{item.price}</p>
                          <div className="mec-cart-item-qty">
                            <button className="mec-cart-qty-btn" onClick={() => updateCartQuantity(item.id, -1)}>
                              <Minus />
                            </button>
                            <span className="mec-cart-qty-value">{item.quantity}</span>
                            <button className="mec-cart-qty-btn" onClick={() => updateCartQuantity(item.id, 1)}>
                              <Plus />
                            </button>
                          </div>
                        </div>
                        <button className="mec-cart-item-remove" onClick={() => removeFromCart(item.id)}>
                          <Trash2 />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                {cart.length > 0 && (
                  <div className="mec-cart-footer">
                    <div className="mec-cart-total">
                      <span>{t.total}</span>
                      <span>{currency}{cartTotal.toLocaleString()}</span>
                    </div>
                    <button className="mec-checkout-btn" onClick={handleCheckout}>
                      {t.checkout}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="mec-shop-search">
          <div className="mec-search-input-wrapper">
            <Search />
            <input
              type="text"
              className="mec-search-input"
              placeholder={t.searchProducts}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <button
              className={`mec-category-btn ${isCategoryOpen ? 'mec-open' : ''}`}
              onClick={() => { setIsCartOpen(false); setIsCategoryOpen(!isCategoryOpen); }}
            >
              {categories.find(c => c.id === selectedCategory)?.name[language]}
              <ChevronDown />
            </button>
            {isCategoryOpen && (
              <div className="mec-category-dropdown">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`mec-category-item ${selectedCategory === cat.id ? 'mec-active' : ''}`}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setIsCategoryOpen(false);
                    }}
                  >
                    {cat.name[language]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mec-products-grid">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="mec-product-card"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="mec-product-image">
              <ProductImage product={product} language={language} className="" />
              {product.badge && (
                <span className="mec-product-badge">{product.badge[language]}</span>
              )}
            </div>
            <div className="mec-product-info">
              <h3 className="mec-product-name">{product.name[language]}</h3>
              <div className="mec-product-rating">
                <Star />
                <span>{product.rating} ({product.reviews})</span>
              </div>
              <div className="mec-product-price">
                <span className="mec-price-current">{currency}{product.price}</span>
                {product.originalPrice && (
                  <span className="mec-price-original">{currency}{product.originalPrice}</span>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="mec-empty-products">
            <p>{t.noProducts}</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="mec-product-detail" onClick={() => setSelectedProduct(null)}>
          <div className="mec-product-detail-content" onClick={(e) => e.stopPropagation()}>
            <div className="mec-detail-header">
              <h3 className="mec-detail-title">{selectedProduct.name[language]}</h3>
              <button className="mec-detail-close" onClick={() => setSelectedProduct(null)}>
                <X />
              </button>
            </div>
            <div className="mec-detail-image">
              <ProductImage product={selectedProduct} language={language} className="" />
              {selectedProduct.badge && (
                <span className="mec-detail-badge">{selectedProduct.badge[language]}</span>
              )}
            </div>
            <p className="mec-detail-description">{selectedProduct.description[language]}</p>
            <div className="mec-detail-rating">
              <Star />
              <span>{selectedProduct.rating} ({selectedProduct.reviews} {language === 'tr' ? 'degerlendirme' : 'reviews'})</span>
            </div>
            <div className="mec-detail-price">
              <span className="mec-detail-price-current">{currency}{selectedProduct.price}</span>
              {selectedProduct.originalPrice && (
                <span className="mec-detail-price-original">{currency}{selectedProduct.originalPrice}</span>
              )}
            </div>
            <div className="mec-quantity-selector">
              <button className="mec-qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus />
              </button>
              <span className="mec-qty-value">{quantity}</span>
              <button className="mec-qty-btn" onClick={() => setQuantity(quantity + 1)}>
                <Plus />
              </button>
            </div>
            <button className="mec-add-to-cart-btn" onClick={() => addToCart(selectedProduct, quantity)}>
              <ShoppingCart />
              {t.addToCart}
            </button>
          </div>
        </div>
      )}
    </>
  );

  // Checkout View Component
  const CheckoutView = () => (
    <div className="mec-checkout-view">
      <div className="mec-checkout-header">
        <button className="mec-back-btn" onClick={() => setView('shop')}>
          <ArrowLeft />
        </button>
        <h1 className="mec-checkout-title">{t.payment}</h1>
      </div>
      <div className="mec-checkout-content">
        {/* Shipping Info */}
        <div className="mec-checkout-section">
          <div className="mec-section-header">
            <Truck />
            <h3>{t.shippingInfo}</h3>
          </div>
          <input type="text" className="mec-checkout-input" placeholder={t.fullName} />
          <input type="text" className="mec-checkout-input" placeholder={t.address} />
          <input type="tel" className="mec-checkout-input" placeholder={t.phone} />
        </div>

        {/* Payment Method */}
        <div className="mec-checkout-section">
          <div className="mec-section-header">
            <CreditCard />
            <h3>{t.paymentMethod}</h3>
          </div>
          <label className="mec-payment-option">
            <input type="radio" name="payment" defaultChecked />
            <span>{t.creditCard}</span>
          </label>
          <label className="mec-payment-option">
            <input type="radio" name="payment" />
            <span>{t.bankTransfer}</span>
          </label>
          <label className="mec-payment-option">
            <input type="radio" name="payment" />
            <span>{t.cashOnDelivery}</span>
          </label>
        </div>

        {/* Order Summary */}
        <div className="mec-checkout-section">
          <div className="mec-section-header">
            <Package />
            <h3>{t.orderSummary}</h3>
          </div>
          {cart.map(item => (
            <div key={item.id} className="mec-order-item">
              <span className="mec-order-item-name">{item.name[language]} x{item.quantity}</span>
              <span className="mec-order-item-price">{currency}{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="mec-order-total">
            <span>{t.total}</span>
            <span>{currency}{cartTotal.toLocaleString()}</span>
          </div>
        </div>

        <button className="mec-complete-order-btn" onClick={handleCompleteOrder}>
          {t.completeOrder}
        </button>
      </div>
    </div>
  );

  // Success View Component
  const SuccessView = () => (
    <div className="mec-success-view">
      <div className="mec-success-icon">
        <Check />
      </div>
      <h1 className="mec-success-title">{t.orderConfirmed}</h1>
      <p className="mec-success-message">{t.orderMessage}</p>
      <div className="mec-success-actions">
        <button className="mec-continue-btn" onClick={handleContinueShopping}>
          {t.continueShopping}
        </button>
        {onContactClick && (
          <button className="mec-contact-btn" onClick={handleContactNavigation}>
            {t.wantRealStore}
          </button>
        )}
      </div>
    </div>
  );

  return createPortal(
    <div className="mec-overlay">
      <div className="mec-iphone-container">
        <div className="mec-iphone-frame">
          {/* Side Buttons */}
          <div className="mec-side-button mec-silent-switch" />
          <div className="mec-side-button mec-volume-up" />
          <div className="mec-side-button mec-volume-down" />
          <div className="mec-side-button mec-power-button" />

          <div className="mec-iphone-screen">
            {/* Wallpaper */}
            <div className="mec-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`mec-dynamic-island mec-di-state-${dynamicIslandState}`}
              onClick={() => {
                if (dynamicIslandState === 'collapsed') {
                  setIsMusicPlaying(true);
                  setDynamicIslandState('expanded');
                } else if (dynamicIslandState === 'expanded') {
                  if (isMusicPlaying && isAppOpen) {
                    setDynamicIslandState('compact');
                  }
                } else if (dynamicIslandState === 'compact') {
                  setDynamicIslandState('expanded');
                }
              }}
            >
              {/* Collapsed Content */}
              <div className="mec-di-collapsed-content">
                <div className="mec-di-camera" />
                <div className="mec-di-sensor" />
              </div>

              {/* Compact Content */}
              <div className="mec-di-compact-content">
                <div className="mec-di-compact-left">
                  <div className="mec-di-compact-album">
                    <img src={albumCover} alt="Album" className="mec-di-album-img" />
                  </div>
                  <div className="mec-di-compact-info">
                    <span className="mec-di-compact-title">Blinding Lights</span>
                    <span className="mec-di-compact-artist">The Weeknd</span>
                  </div>
                </div>
                <div className="mec-di-compact-waves">
                  <div className="mec-di-wave-bar" />
                  <div className="mec-di-wave-bar" />
                  <div className="mec-di-wave-bar" />
                </div>
              </div>

              {/* Expanded Content */}
              <div className="mec-di-expanded-content">
                <div className="mec-di-music-left">
                  <div className="mec-di-album">
                    <img src={albumCover} alt="Album" className="mec-di-album-img" />
                  </div>
                  <div className="mec-di-track-info">
                    <h4>Blinding Lights</h4>
                    <p>The Weeknd</p>
                  </div>
                </div>
                <div className="mec-di-music-right">
                  <div className="mec-di-wave-bar" />
                  <div className="mec-di-wave-bar" />
                  <div className="mec-di-wave-bar" />
                  <div className="mec-di-wave-bar" />
                  <div className="mec-di-wave-bar" />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mec-status-bar">
              <div className="mec-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="mec-status-right">
                <div className="mec-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <span className="mec-5g">5G</span>
                <div className="mec-battery">
                  <div className="mec-battery-body">
                    <div className="mec-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`mec-home-screen ${isAppOpen ? 'mec-hidden' : ''}`}>
              {/* Volume HUD */}
              <div className={`mec-volume-hud ${showVolumeControl ? 'mec-volume-hud-visible' : ''}`}>
                <div className="mec-volume-hud-container">
                  <div className="mec-volume-hud-icon">
                    <svg viewBox="0 0 24 24" fill="white">
                      {volume === 0 ? (
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                      ) : volume < 0.5 ? (
                        <path d="M7 9v6h4l5 5V4l-5 5H7z"/>
                      ) : (
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      )}
                    </svg>
                  </div>
                  <div className="mec-volume-hud-slider">
                    <div className="mec-volume-hud-track">
                      <div
                        className="mec-volume-hud-fill"
                        style={{ width: `${volume * 100}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="mec-volume-hud-input"
                    />
                  </div>
                </div>
              </div>

              {/* Time Widget */}
              <div className="mec-time-widget">
                <div className="mec-time">{currentTime}</div>
                <div className="mec-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="mec-widgets-container">
                <div className="mec-widget">
                  <div className="mec-widget-header">
                    <div className="mec-widget-icon mec-weather-icon">
                      <img src={sunIcon} alt="Weather" className="mec-widget-icon-img" />
                    </div>
                    <span>{t.weather}</span>
                  </div>
                  <div className="mec-weather-temp">18°</div>
                  <div className="mec-weather-desc">{language === 'tr' ? 'Acik, H:22° L:14°' : 'Clear, H:72° L:57°'}</div>
                </div>
                <div
                  className="mec-widget"
                  onClick={() => {
                    if (!isMusicPlaying) {
                      setIsMusicPlaying(true);
                      setDynamicIslandState('expanded');
                    } else {
                      setIsMusicPlaying(false);
                      setDynamicIslandState('collapsed');
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="mec-widget-header">
                    <div className="mec-widget-icon mec-music-icon">
                      <img src={musicIcon} alt="Music" className="mec-widget-icon-img" />
                    </div>
                    <span>{t.music}</span>
                  </div>
                  <div className="mec-music-playing">
                    <div className="mec-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="mec-album-img" />
                    </div>
                    <div className="mec-music-info">
                      <h4>{isMusicPlaying ? t.nowPlaying : t.playNow}</h4>
                      <p>Blinding Lights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock with Tooltips */}
              <div className="mec-dock">
                <div className="mec-dock-icon mec-close-icon" onClick={handleClose}>
                  <span className="mec-close-tooltip">{t.exitTooltip} ✕</span>
                  <img src={closeIcon} alt="Close" className="mec-close-img" />
                </div>
                <div className="mec-dock-icon mec-network-icon" onClick={handleContactNavigation}>
                  <img src={networkIcon} alt="Network" className="mec-icon-img" />
                </div>
                <div className="mec-dock-icon mec-call-icon" onClick={handleContactNavigation}>
                  <img src={callIcon} alt="Call" className="mec-icon-img" />
                </div>
                <div className="mec-dock-icon mec-shop-icon" onClick={openApp}>
                  <span className="mec-shop-tooltip">{t.tooltip}</span>
                  <ShoppingCart style={{ width: '60%', height: '60%', color: 'white' }} />
                </div>
              </div>
            </div>

            {/* E-commerce App */}
            <div className={`mec-ecommerce-app ${isAppOpen ? 'mec-active' : ''}`}>
              {view === 'shop' && <ShopView />}
              {view === 'checkout' && <CheckoutView />}
              {view === 'success' && <SuccessView />}
            </div>

            {/* Home Indicator */}
            <div className="mec-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="mec-screen-reflection" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
