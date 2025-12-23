import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './DesktopEcommerceDemo.css';

// Assets
import demoLogo from '../../assets/whatsapp-demo-logo.png';
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

interface DesktopEcommerceDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

type DemoView = 'shop' | 'checkout' | 'success';

const uiText = {
  tr: {
    tooltip: "Demo'yu Baslat!",
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
    noProducts: 'Urun bulunamadi',
    exit: 'Cikis',
    contact: 'Iletisime Gecin'
  },
  en: {
    tooltip: 'Start Demo!',
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
    noProducts: 'No products found',
    exit: 'Exit',
    contact: 'Contact Us'
  }
};

// Product Image Component
const ProductImage: React.FC<{ product: Product; language: 'tr' | 'en'; className?: string }> = ({ product, language, className }) => {
  const image = getProductImage(product.id);
  if (image) {
    return <img src={image} alt={product.name[language]} className={className} />;
  }
  return (
    <div className={`${className} dec-product-placeholder`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)' }}>
      <Package style={{ width: 32, height: 32, color: 'rgba(255,255,255,0.3)' }} />
    </div>
  );
};

export const DesktopEcommerceDemo: React.FC<DesktopEcommerceDemoProps> = ({
  language,
  onClose,
  onContactClick
}) => {
  // Entry time for clock
  const [entryTime] = useState(() => new Date());
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isAppOpen, setIsAppOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Use refs to avoid re-renders and stale closures
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

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

  const phoneRef = useRef<HTMLDivElement>(null);
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

  // Trigger entrance animation
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

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
    document.body.classList.add('dec-modal-open');
    return () => {
      document.body.classList.remove('dec-modal-open');
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

  // Update volume
  useEffect(() => {
    if (audioRef.current && isMusicPlaying) {
      audioRef.current.volume = volume;
    }
  }, [volume, isMusicPlaying]);

  // Mouse tracking for 3D effect - uses ref to avoid re-renders
  useEffect(() => {
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      // Only process if hovering and phone ref exists
      if (!phoneRef.current || !isHoveringRef.current) return;

      // Cancel any pending animation frame
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        if (!phoneRef.current || !isHoveringRef.current) return;

        const rect = phoneRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const x = (e.clientX - centerX) / (rect.width / 2);
        const y = (e.clientY - centerY) / (rect.height / 2);

        mousePositionRef.current = { x, y };

        // Directly update transform without causing React re-render
        const rotateY = x * 6;
        const rotateX = -y * 4;
        phoneRef.current.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

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
    if (isClosing) return;
    setIsClosing(true);
    setIsMusicPlaying(false);
    setDynamicIslandState('collapsed');
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 400);
  };

  const handleContactNavigation = () => {
    if (isClosing) return;
    setIsClosing(true);
    setIsMusicPlaying(false);
    setDynamicIslandState('collapsed');
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
      setTimeout(() => {
        if (onContactClick) {
          onContactClick();
        }
      }, 100);
    }, 400);
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

  // Handle hover state changes - reset transform when not hovering
  useEffect(() => {
    if (!isHovering && phoneRef.current) {
      phoneRef.current.style.transform = 'rotateY(0deg) rotateX(0deg)';
    }
  }, [isHovering]);

  // Shop View Component
  const ShopView = () => (
    <div className="dec-app-content">
      <div className="dec-shop-header">
        <div className="dec-shop-header-top">
          <button className="dec-shop-close-btn" onClick={closeApp}>
            <X />
          </button>
          <div className="dec-shop-logo">
            <div className="dec-shop-logo-icon">
              <img src={allyncLogo} alt="Allync" />
            </div>
            <span className="dec-shop-logo-text">AllyncShop</span>
          </div>
          <div style={{ position: 'relative' }}>
            <button className="dec-shop-cart-btn" onClick={() => setIsCartOpen(!isCartOpen)}>
              <ShoppingCart />
              {cartItemCount > 0 && (
                <span className="dec-shop-cart-badge">{cartItemCount}</span>
              )}
            </button>

            {/* Cart Dropdown */}
            {isCartOpen && (
              <div className="dec-cart-dropdown" onClick={(e) => e.stopPropagation()}>
                <div className="dec-cart-header">
                  <h3>{t.myCart} ({cartItemCount})</h3>
                  <button className="dec-cart-close" onClick={() => setIsCartOpen(false)}>
                    <X />
                  </button>
                </div>
                <div className="dec-cart-items">
                  {cart.length === 0 ? (
                    <div className="dec-cart-empty">
                      <ShoppingCart />
                      <p>{t.emptyCart}</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="dec-cart-item">
                        <div className="dec-cart-item-image">
                          <ProductImage product={item} language={language} className="" />
                        </div>
                        <div className="dec-cart-item-info">
                          <p className="dec-cart-item-name">{item.name[language]}</p>
                          <p className="dec-cart-item-price">{currency}{item.price}</p>
                          <div className="dec-cart-item-qty">
                            <button className="dec-cart-qty-btn" onClick={() => updateCartQuantity(item.id, -1)}>
                              <Minus />
                            </button>
                            <span className="dec-cart-qty-value">{item.quantity}</span>
                            <button className="dec-cart-qty-btn" onClick={() => updateCartQuantity(item.id, 1)}>
                              <Plus />
                            </button>
                          </div>
                        </div>
                        <button className="dec-cart-item-remove" onClick={() => removeFromCart(item.id)}>
                          <Trash2 />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                {cart.length > 0 && (
                  <div className="dec-cart-footer">
                    <div className="dec-cart-total">
                      <span>{t.total}</span>
                      <span>{currency}{cartTotal.toLocaleString()}</span>
                    </div>
                    <button className="dec-checkout-btn" onClick={handleCheckout}>
                      {t.checkout}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="dec-shop-search">
          <div className="dec-search-input-wrapper">
            <Search />
            <input
              type="text"
              className="dec-search-input"
              placeholder={t.searchProducts}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <button
              className={`dec-category-btn ${isCategoryOpen ? 'dec-open' : ''}`}
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              {categories.find(c => c.id === selectedCategory)?.name[language]}
              <ChevronDown />
            </button>
            {isCategoryOpen && (
              <div className="dec-category-dropdown">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`dec-category-item ${selectedCategory === cat.id ? 'dec-active' : ''}`}
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

      <div className="dec-products-grid">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="dec-product-card"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="dec-product-image">
              <ProductImage product={product} language={language} className="" />
              {product.badge && (
                <span className="dec-product-badge">{product.badge[language]}</span>
              )}
            </div>
            <div className="dec-product-info">
              <h3 className="dec-product-name">{product.name[language]}</h3>
              <div className="dec-product-rating">
                <Star />
                <span>{product.rating} ({product.reviews})</span>
              </div>
              <div className="dec-product-price">
                <span className="dec-price-current">{currency}{product.price}</span>
                {product.originalPrice && (
                  <span className="dec-price-original">{currency}{product.originalPrice}</span>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="dec-empty-products">
            <p>{t.noProducts}</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="dec-product-detail" onClick={() => setSelectedProduct(null)}>
          <div className="dec-product-detail-content" onClick={(e) => e.stopPropagation()}>
            <div className="dec-detail-header">
              <h3 className="dec-detail-title">{selectedProduct.name[language]}</h3>
              <button className="dec-detail-close" onClick={() => setSelectedProduct(null)}>
                <X />
              </button>
            </div>
            <div className="dec-detail-image">
              <ProductImage product={selectedProduct} language={language} className="" />
              {selectedProduct.badge && (
                <span className="dec-detail-badge">{selectedProduct.badge[language]}</span>
              )}
            </div>
            <p className="dec-detail-description">{selectedProduct.description[language]}</p>
            <div className="dec-detail-rating">
              <Star />
              <span>{selectedProduct.rating} ({selectedProduct.reviews} {language === 'tr' ? 'değerlendirme' : 'reviews'})</span>
            </div>
            <div className="dec-detail-price">
              <span className="dec-detail-price-current">{currency}{selectedProduct.price}</span>
              {selectedProduct.originalPrice && (
                <span className="dec-detail-price-original">{currency}{selectedProduct.originalPrice}</span>
              )}
            </div>
            <div className="dec-quantity-selector">
              <button className="dec-qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus />
              </button>
              <span className="dec-qty-value">{quantity}</span>
              <button className="dec-qty-btn" onClick={() => setQuantity(quantity + 1)}>
                <Plus />
              </button>
            </div>
            <button className="dec-add-to-cart-btn" onClick={() => addToCart(selectedProduct, quantity)}>
              <ShoppingCart />
              {t.addToCart}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Checkout View Component
  const CheckoutView = () => (
    <div className="dec-checkout-view">
      <div className="dec-checkout-header">
        <button className="dec-back-btn" onClick={() => setView('shop')}>
          <ArrowLeft />
        </button>
        <h1 className="dec-checkout-title">{t.payment}</h1>
      </div>
      <div className="dec-checkout-content">
        {/* Shipping Info */}
        <div className="dec-checkout-section">
          <div className="dec-section-header">
            <Truck />
            <h3>{t.shippingInfo}</h3>
          </div>
          <input type="text" className="dec-checkout-input" placeholder={t.fullName} />
          <input type="text" className="dec-checkout-input" placeholder={t.address} />
          <input type="tel" className="dec-checkout-input" placeholder={t.phone} />
        </div>

        {/* Payment Method */}
        <div className="dec-checkout-section">
          <div className="dec-section-header">
            <CreditCard />
            <h3>{t.paymentMethod}</h3>
          </div>
          <label className="dec-payment-option">
            <input type="radio" name="payment" defaultChecked />
            <span>{t.creditCard}</span>
          </label>
          <label className="dec-payment-option">
            <input type="radio" name="payment" />
            <span>{t.bankTransfer}</span>
          </label>
          <label className="dec-payment-option">
            <input type="radio" name="payment" />
            <span>{t.cashOnDelivery}</span>
          </label>
        </div>

        {/* Order Summary */}
        <div className="dec-checkout-section">
          <div className="dec-section-header">
            <Package />
            <h3>{t.orderSummary}</h3>
          </div>
          {cart.map(item => (
            <div key={item.id} className="dec-order-item">
              <span className="dec-order-item-name">{item.name[language]} x{item.quantity}</span>
              <span className="dec-order-item-price">{currency}{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="dec-order-total">
            <span>{t.total}</span>
            <span>{currency}{cartTotal.toLocaleString()}</span>
          </div>
        </div>

        <button className="dec-complete-order-btn" onClick={handleCompleteOrder}>
          {t.completeOrder}
        </button>
      </div>
    </div>
  );

  // Success View Component
  const SuccessView = () => (
    <div className="dec-success-view">
      <div className="dec-success-icon">
        <Check />
      </div>
      <h1 className="dec-success-title">{t.orderConfirmed}</h1>
      <p className="dec-success-message">{t.orderMessage}</p>
      <div className="dec-success-actions">
        <button className="dec-continue-btn" onClick={handleContinueShopping}>
          {t.continueShopping}
        </button>
        {onContactClick && (
          <button className="dec-contact-btn" onClick={handleContactNavigation}>
            {t.wantRealStore}
          </button>
        )}
      </div>
    </div>
  );

  return createPortal(
    <div className={`dec-overlay ${isVisible ? 'dec-visible' : ''} ${isClosing ? 'dec-closing' : ''}`} onClick={handleClose}>
      <div
        className={`dec-iphone-container ${isVisible ? 'dec-visible' : ''} ${isClosing ? 'dec-closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => {
          isHoveringRef.current = true;
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          isHoveringRef.current = false;
          setIsHovering(false);
        }}
      >
        <div
          className="dec-iphone-frame"
          ref={phoneRef}
        >
          {/* Side Buttons */}
          <div className="dec-side-button dec-silent-switch" />
          <div className="dec-side-button dec-volume-up" />
          <div className="dec-side-button dec-volume-down" />
          <div className="dec-side-button dec-power-button" />

          <div className="dec-iphone-screen">
            {/* Wallpaper */}
            <div className="dec-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`dec-dynamic-island dec-di-state-${dynamicIslandState}`}
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
              <div className="dec-di-collapsed-content">
                <div className="dec-di-camera" />
                <div className="dec-di-sensor" />
              </div>

              {/* Compact Content */}
              <div className="dec-di-compact-content">
                <div className="dec-di-compact-left">
                  <div className="dec-di-compact-album">
                    <img src={albumCover} alt="Album" className="dec-di-album-img" />
                  </div>
                  <div className="dec-di-compact-info">
                    <span className="dec-di-compact-title">Blinding Lights</span>
                    <span className="dec-di-compact-artist">The Weeknd</span>
                  </div>
                </div>
                <div className="dec-di-compact-waves">
                  <div className="dec-di-wave-bar" />
                  <div className="dec-di-wave-bar" />
                  <div className="dec-di-wave-bar" />
                </div>
              </div>

              {/* Expanded Content */}
              <div className="dec-di-expanded-content">
                <div className="dec-di-music-left">
                  <div className="dec-di-album">
                    <img src={albumCover} alt="Album" className="dec-di-album-img" />
                  </div>
                  <div className="dec-di-track-info">
                    <h4>Blinding Lights</h4>
                    <p>The Weeknd</p>
                  </div>
                </div>
                <div className="dec-di-music-right">
                  <div className="dec-di-wave-bar" />
                  <div className="dec-di-wave-bar" />
                  <div className="dec-di-wave-bar" />
                  <div className="dec-di-wave-bar" />
                  <div className="dec-di-wave-bar" />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="dec-status-bar">
              <div className="dec-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="dec-status-right">
                <div className="dec-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <span className="dec-5g">5G</span>
                <div className="dec-battery">
                  <div className="dec-battery-body">
                    <div className="dec-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`dec-home-screen ${isAppOpen ? 'dec-hidden' : ''}`}>
              {/* Volume HUD */}
              <div className={`dec-volume-hud ${showVolumeControl ? 'dec-volume-hud-visible' : ''}`}>
                <div className="dec-volume-hud-container">
                  <div className="dec-volume-hud-icon">
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
                  <div className="dec-volume-hud-slider">
                    <div className="dec-volume-hud-track">
                      <div
                        className="dec-volume-hud-fill"
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
                      className="dec-volume-hud-input"
                    />
                  </div>
                </div>
              </div>

              {/* Time Widget */}
              <div className="dec-time-widget">
                <div className="dec-time">{currentTime}</div>
                <div className="dec-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="dec-widgets-container">
                <div className="dec-widget dec-widget-hover">
                  <div className="dec-widget-header">
                    <div className="dec-widget-icon dec-weather-icon">
                      <img src={sunIcon} alt="Weather" className="dec-widget-icon-img" />
                    </div>
                    <span>{t.weather}</span>
                  </div>
                  <div className="dec-weather-temp">18</div>
                  <div className="dec-weather-desc">{language === 'tr' ? 'Acik, H:22 L:14' : 'Clear, H:72 L:57'}</div>
                </div>
                <div
                  className="dec-widget dec-widget-hover"
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
                  <div className="dec-widget-header">
                    <div className="dec-widget-icon dec-music-icon">
                      <img src={musicIcon} alt="Music" className="dec-widget-icon-img" />
                    </div>
                    <span>{t.music}</span>
                  </div>
                  <div className="dec-music-playing">
                    <div className="dec-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="dec-album-img" />
                    </div>
                    <div className="dec-music-info">
                      <h4>{isMusicPlaying ? t.nowPlaying : t.playNow}</h4>
                      <p>Blinding Lights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="dec-dock">
                <div className="dec-dock-icon dec-close-icon dec-dock-hover" onClick={handleClose}>
                  <span className="dec-close-tooltip">{t.exit} X</span>
                  <img src={closeIcon} alt="Close" className="dec-close-img" />
                </div>
                <div className="dec-dock-icon dec-safari-icon dec-dock-hover" onClick={handleContactNavigation}>
                  <span className="dec-safari-tooltip">{t.contact}</span>
                  <img src={networkIcon} alt="Contact" className="dec-icon-img" />
                </div>
                <div className="dec-dock-icon dec-call-icon dec-dock-hover" onClick={handleContactNavigation}>
                  <img src={callIcon} alt="Call" className="dec-icon-img" />
                </div>
                <div className="dec-dock-icon dec-app-icon dec-dock-hover" onClick={openApp}>
                  <span className="dec-app-tooltip">{t.tooltip}</span>
                  <ShoppingCart style={{ width: 28, height: 28, color: 'white' }} />
                </div>
              </div>
            </div>

            {/* App */}
            <div className={`dec-app ${isAppOpen ? 'dec-active' : ''}`}>
              {view === 'shop' && <ShopView />}
              {view === 'checkout' && <CheckoutView />}
              {view === 'success' && <SuccessView />}
            </div>

            {/* Home Indicator */}
            <div className="dec-home-indicator" onClick={isAppOpen ? closeApp : handleClose} />

            {/* Screen Reflection */}
            <div className="dec-screen-reflection" />
          </div>
        </div>

        {/* Click outside hint */}
        <div className="dec-hint">
          {language === 'tr' ? 'Kapatmak icin disari tiklayin' : 'Click outside to close'}
        </div>
      </div>
    </div>,
    document.body
  );
};
