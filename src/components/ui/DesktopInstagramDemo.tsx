import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './DesktopInstagramDemo.css';

// Assets
import demoLogo from '../../assets/whatsapp-demo-logo.png';
import closeIcon from '../../assets/demo-icons/Close_Cross_Circle.svg';
import callIcon from '../../assets/demo-icons/Call_Fill.svg';
import networkIcon from '../../assets/demo-icons/Network.svg';
import backwardIcon from '../../assets/demo-icons/Backward.svg';
import callOutlineIcon from '../../assets/demo-icons/Call.svg';
import videoCallIcon from '../../assets/demo-icons/Video Call.svg';
import sunIcon from '../../assets/demo-icons/Sun_1_Fill.svg';
import musicIcon from '../../assets/demo-icons/music.svg';
import albumCover from '../../assets/demo-icons/The_Weeknd_-_Blinding_Lights.png';
import blindingLightsAudio from '../../assets/demo-icons/The Weeknd - Blinding Lights.mp3';
import cardIcon from '../../assets/demo-icons/Card_Fill.svg';
import pinIcon from '../../assets/demo-icons/Pin_Fill.svg';
import calendarIcon from '../../assets/demo-icons/Calendar_Plus.svg';
import handIcon from '../../assets/demo-icons/Hand_Sparcles_Fill.svg';
import checkIcon from '../../assets/demo-icons/Check.svg';

// Senaryo ikonları mapping
const scenarioIcons: Record<string, string> = {
  'product-inquiry': cardIcon,
  'story-mention': pinIcon,
  'order-tracking': calendarIcon,
  'collaboration': handIcon
};

interface DesktopInstagramDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

// Senaryolar
const scenarios = {
  tr: {
    'product-inquiry': {
      icon: '🛍️',
      title: 'Ürün Bilgisi',
      count: '8 mesaj',
      messages: [
        { type: 'user', content: 'Merhaba, bu ürün hala satışta mı?' },
        { type: 'bot', content: 'Merhaba! 👋 Evet, ürünümüz stoklarımızda mevcut.' },
        { type: 'bot', content: 'Size nasıl yardımcı olabilirim?' },
        { type: 'user', content: 'Fiyat Bilgisi' },
        { type: 'bot', content: '💰 Ürün Fiyatı: 299₺\n\n✨ Bugüne özel %20 indirim!\n📦 150₺ üzeri kargo bedava' },
        { type: 'bot', content: 'Sipariş vermek ister misiniz?' }
      ]
    },
    'story-mention': {
      icon: '📸',
      title: 'Story Yanıtı',
      count: '8 mesaj',
      messages: [
        { type: 'user', content: '🔥 Harika ürünler!', isStoryReply: true },
        { type: 'bot', content: 'Teşekkürler! 🙏❤️' },
        { type: 'bot', content: 'Bizi story\'nizde paylaştığınız için çok mutluyuz!' },
        { type: 'bot', content: '🎁 Size özel %15 indirim kodunuz: STORY15' },
        { type: 'bot', content: 'Alışverişlerinizde kullanabilirsiniz!' },
        { type: 'user', content: 'Teşekkürler' },
        { type: 'bot', content: 'Rica ederiz! 💜 Bizi takip etmeye devam edin!' }
      ]
    },
    'order-tracking': {
      icon: '📦',
      title: 'Sipariş Takibi',
      count: '8 mesaj',
      messages: [
        { type: 'user', content: 'Siparişim nerede?' },
        { type: 'bot', content: 'Merhaba! 📦 Sipariş takibi için yardımcı olayım.' },
        { type: 'bot', content: 'Lütfen sipariş numaranızı paylaşır mısınız?' },
        { type: 'user', content: '#12345' },
        { type: 'bot', content: '✅ Sipariş #12345 bulundu!\n\n📍 Durum: Kargoya Verildi\n🚚 Kargo: Yurtiçi Kargo\n📅 Tahmini Teslimat: Yarın' },
        { type: 'user', content: 'Kargo Takip' },
        { type: 'bot', content: '🔗 Kargo takip linkiniz:\ntrack.yurtici.com/12345\n\nİyi alışverişler! 🛍️' }
      ]
    },
    'collaboration': {
      icon: '🤝',
      title: 'İşbirliği Talebi',
      count: '8 mesaj',
      messages: [
        { type: 'user', content: 'Merhaba, işbirliği yapmak istiyorum' },
        { type: 'bot', content: 'Merhaba! 🌟 İşbirliği talebiniz için teşekkürler!' },
        { type: 'bot', content: 'Size daha iyi yardımcı olabilmemiz için birkaç bilgiye ihtiyacımız var.' },
        { type: 'user', content: 'Influencer' },
        { type: 'bot', content: '📊 Harika! Lütfen şunları paylaşın:\n\n• Takipçi sayınız\n• İçerik türünüz\n• E-posta adresiniz' },
        { type: 'bot', content: 'Ekibimiz 24-48 saat içinde size dönüş yapacak! ✨' }
      ]
    }
  },
  en: {
    'product-inquiry': {
      icon: '🛍️',
      title: 'Product Inquiry',
      count: '8 messages',
      messages: [
        { type: 'user', content: 'Hi, is this product still available?' },
        { type: 'bot', content: 'Hello! 👋 Yes, the product is in stock.' },
        { type: 'bot', content: 'How can I help you?' },
        { type: 'user', content: 'Price Info' },
        { type: 'bot', content: '💰 Product Price: $29.99\n\n✨ 20% off today only!\n📦 Free shipping over $50' },
        { type: 'bot', content: 'Would you like to place an order?' }
      ]
    },
    'story-mention': {
      icon: '📸',
      title: 'Story Reply',
      count: '8 messages',
      messages: [
        { type: 'user', content: '🔥 Amazing products!', isStoryReply: true },
        { type: 'bot', content: 'Thank you! 🙏❤️' },
        { type: 'bot', content: 'We\'re so happy you shared us in your story!' },
        { type: 'bot', content: '🎁 Your exclusive discount code: STORY15' },
        { type: 'bot', content: 'Use it on your next purchase!' },
        { type: 'user', content: 'Thanks' },
        { type: 'bot', content: 'You\'re welcome! 💜 Keep following us!' }
      ]
    },
    'order-tracking': {
      icon: '📦',
      title: 'Order Tracking',
      count: '8 messages',
      messages: [
        { type: 'user', content: 'Where is my order?' },
        { type: 'bot', content: 'Hello! 📦 Let me help you track your order.' },
        { type: 'bot', content: 'Please share your order number.' },
        { type: 'user', content: '#12345' },
        { type: 'bot', content: '✅ Order #12345 found!\n\n📍 Status: Shipped\n🚚 Carrier: FedEx\n📅 Est. Delivery: Tomorrow' },
        { type: 'user', content: 'Track Package' },
        { type: 'bot', content: '🔗 Your tracking link:\nfedex.com/track/12345\n\nHappy shopping! 🛍️' }
      ]
    },
    'collaboration': {
      icon: '🤝',
      title: 'Collaboration Request',
      count: '8 messages',
      messages: [
        { type: 'user', content: 'Hi, I want to collaborate' },
        { type: 'bot', content: 'Hello! 🌟 Thanks for your collaboration request!' },
        { type: 'bot', content: 'We need some information to assist you better.' },
        { type: 'user', content: 'Influencer' },
        { type: 'bot', content: '📊 Great! Please share:\n\n• Follower count\n• Content type\n• Email address' },
        { type: 'bot', content: 'Our team will get back to you within 24-48 hours! ✨' }
      ]
    }
  }
};

const uiText = {
  tr: {
    selectScenario: 'Senaryo Seçin',
    active: 'Aktif',
    typing: 'yazıyor...',
    restart: 'Tekrar Oynat',
    backToHome: 'Ana Ekrana Dön',
    typeMessage: 'Mesaj yazın',
    tooltip: "Demo'yu Başlat!",
    weather: 'Hava Durumu',
    music: 'Müzik',
    playNow: 'Şimdi Çal',
    nowPlaying: 'Şimdi Çalıyor'
  },
  en: {
    selectScenario: 'Select Scenario',
    active: 'Active',
    typing: 'typing...',
    restart: 'Replay',
    backToHome: 'Back to Home',
    typeMessage: 'Type a message',
    tooltip: 'Start Demo!',
    weather: 'Weather',
    music: 'Music',
    playNow: 'Play Now',
    nowPlaying: 'Now Playing'
  }
};

export const DesktopInstagramDemo: React.FC<DesktopInstagramDemoProps> = ({
  language,
  onClose,
  onContactClick
}) => {
  // Siteye giriş zamanını kaydet (bir kere)
  const [entryTime] = useState(() => new Date());
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isInstagramOpen, setIsInstagramOpen] = useState(false);
  const [showScenarioScreen, setShowScenarioScreen] = useState(true);
  const [currentScenario, setCurrentScenario] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{type: string; content: string; isStoryReply?: boolean}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  // Dynamic Island states: 'collapsed' | 'compact' | 'expanded'
  const [dynamicIslandState, setDynamicIslandState] = useState<'collapsed' | 'compact' | 'expanded'>('collapsed');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(blindingLightsAudio);
    audioRef.current.loop = false;
    audioRef.current.volume = 0;

    // Müzik bitince collapsed moda dön
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

  // Handle music play/pause based on isMusicPlaying state
  useEffect(() => {
    if (!audioRef.current) return;

    if (isMusicPlaying) {
      // Play music with fade in
      audioRef.current.volume = 0;
      audioRef.current.play().catch(console.error);

      // Fade in
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
      // Fade out and pause
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

  // Handle Dynamic Island state changes based on Instagram open/close
  useEffect(() => {
    if (isMusicPlaying) {
      if (isInstagramOpen) {
        // Instagram açıldığında compact moda geç
        setDynamicIslandState('compact');
        setShowVolumeControl(false);
      } else {
        // Instagram kapandığında expanded moda dön
        setDynamicIslandState('expanded');
        setShowVolumeControl(true);
      }
    }
  }, [isInstagramOpen, isMusicPlaying]);

  // Update volume when slider changes
  useEffect(() => {
    if (audioRef.current && isMusicPlaying) {
      audioRef.current.volume = volume;
    }
  }, [volume, isMusicPlaying]);

  // Trigger entrance animation
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const t = uiText[language];
  const scenarioData = scenarios[language];

  // Giriş zamanını baz alarak tarih ve saati ayarla (bir kere)
  useEffect(() => {
    const hours = entryTime.getHours().toString().padStart(2, '0');
    const minutes = entryTime.getMinutes().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}`);

    const days = language === 'tr'
      ? ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
      : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = language === 'tr'
      ? ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    setCurrentDate(`${days[entryTime.getDay()]}, ${entryTime.getDate()} ${months[entryTime.getMonth()]}`);
  }, [language, entryTime]);

  // Disable body scroll
  useEffect(() => {
    document.body.classList.add('did-modal-open');

    return () => {
      document.body.classList.remove('did-modal-open');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Mouse tracking for 3D effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!phoneRef.current) return;

      const rect = phoneRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);

      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto scroll chat
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const openInstagram = () => {
    setIsInstagramOpen(true);
  };

  const closeInstagram = () => {
    setIsInstagramOpen(false);
    setShowScenarioScreen(true);
    setCurrentScenario(null);
    setMessages([]);
    setDemoCompleted(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    // Müziği durdur
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
    // Müziği durdur
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

  const selectScenario = (scenarioKey: string) => {
    setShowScenarioScreen(false);
    setCurrentScenario(scenarioKey);
    setMessages([]);
    setDemoCompleted(false);

    const scenarioMessages = scenarioData[scenarioKey as keyof typeof scenarioData].messages;
    let index = 0;

    const playNext = () => {
      if (index >= scenarioMessages.length) {
        setDemoCompleted(true);
        return;
      }

      const msg = scenarioMessages[index];

      if (msg.type === 'bot') {
        setIsTyping(true);
        timeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, msg]);
          index++;
          timeoutRef.current = setTimeout(playNext, 1000);
        }, 1000);
      } else {
        setMessages(prev => [...prev, msg]);
        index++;
        timeoutRef.current = setTimeout(playNext, 800);
      }
    };

    timeoutRef.current = setTimeout(playNext, 500);
  };

  const goBack = () => {
    setShowScenarioScreen(true);
    setCurrentScenario(null);
    setMessages([]);
    setDemoCompleted(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const restartDemo = () => {
    if (currentScenario) {
      setMessages([]);
      setDemoCompleted(false);
      selectScenario(currentScenario);
    }
  };

  // Mesaj zamanını hesapla - her mesaj için 1 dakika ekle
  const getMessageTime = (messageIndex: number) => {
    const msgTime = new Date(entryTime.getTime() + messageIndex * 60000); // Her mesaj 1 dakika sonra
    const hours = msgTime.getHours().toString().padStart(2, '0');
    const minutes = msgTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Calculate 3D transform based on mouse position (reduced rotation for subtlety)
  const getPhoneTransform = () => {
    if (!isHovering) return 'rotateY(0deg) rotateX(0deg)';
    const rotateY = mousePosition.x * 6;
    const rotateX = -mousePosition.y * 4;
    return `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  };

  return createPortal(
    <div className={`did-overlay ${isVisible ? 'did-visible' : ''} ${isClosing ? 'did-closing' : ''}`} onClick={handleClose}>
      <div
        className={`did-iphone-container ${isVisible ? 'did-visible' : ''} ${isClosing ? 'did-closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >

        <div
          className="did-iphone-frame"
          ref={phoneRef}
          style={{ transform: getPhoneTransform() }}
        >
          {/* Side Buttons */}
          <div className="did-side-button did-silent-switch" />
          <div className="did-side-button did-volume-up" />
          <div className="did-side-button did-volume-down" />
          <div className="did-side-button did-power-button" />

          <div className="did-iphone-screen">
            {/* Wallpaper */}
            <div className="did-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`did-dynamic-island did-di-state-${dynamicIslandState}`}
              onClick={() => {
                if (dynamicIslandState === 'collapsed') {
                  // Collapsed'dan müziği başlat ve expanded yap
                  setIsMusicPlaying(true);
                  setDynamicIslandState('expanded');
                } else if (dynamicIslandState === 'expanded') {
                  // Expanded'dan: müzik çalıyorsa ve Instagram açıksa compact'a, değilse expanded kal
                  if (isMusicPlaying && isInstagramOpen) {
                    setDynamicIslandState('compact');
                  }
                  // Ana ekrandaysa ve müzik çalıyorsa expanded kalır (bir şey yapma)
                } else if (dynamicIslandState === 'compact') {
                  // Compact'tan expanded'a geç
                  setDynamicIslandState('expanded');
                }
              }}
            >
              {/* Collapsed Content - Camera & Sensor */}
              <div className="did-di-collapsed-content">
                <div className="did-di-camera" />
                <div className="did-di-sensor" />
              </div>

              {/* Compact Content - Album, Track Info & Waveform (when Instagram is open) */}
              <div className="did-di-compact-content">
                <div className="did-di-compact-left">
                  <div className="did-di-compact-album">
                    <img src={albumCover} alt="Album" className="did-di-album-img" />
                  </div>
                  <div className="did-di-compact-info">
                    <span className="did-di-compact-title">Blinding Lights</span>
                    <span className="did-di-compact-artist">The Weeknd</span>
                  </div>
                </div>
                <div className="did-di-compact-waves">
                  <div className="did-di-wave-bar" />
                  <div className="did-di-wave-bar" />
                  <div className="did-di-wave-bar" />
                </div>
              </div>

              {/* Expanded Content - Full Music Player */}
              <div className="did-di-expanded-content">
                <div className="did-di-music-left">
                  <div className="did-di-album">
                    <img src={albumCover} alt="Album" className="did-di-album-img" />
                  </div>
                  <div className="did-di-track-info">
                    <h4>Blinding Lights</h4>
                    <p>The Weeknd</p>
                  </div>
                </div>
                <div className="did-di-music-right">
                  <div className="did-di-wave-bar" />
                  <div className="did-di-wave-bar" />
                  <div className="did-di-wave-bar" />
                  <div className="did-di-wave-bar" />
                  <div className="did-di-wave-bar" />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="did-status-bar">
              <div className="did-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="did-status-right">
                <div className="did-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <span className="did-5g">5G</span>
                <div className="did-battery">
                  <div className="did-battery-body">
                    <div className="did-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`did-home-screen ${isInstagramOpen ? 'did-hidden' : ''}`}>
              {/* iPhone Volume HUD - Inside Screen */}
              <div className={`did-volume-hud ${showVolumeControl ? 'did-volume-hud-visible' : ''}`}>
                <div className="did-volume-hud-container">
                  <div className="did-volume-hud-icon">
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
                  <div className="did-volume-hud-slider">
                    <div className="did-volume-hud-track">
                      <div
                        className="did-volume-hud-fill"
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
                      className="did-volume-hud-input"
                    />
                  </div>
                </div>
              </div>

              {/* Time Widget */}
              <div className="did-time-widget">
                <div className="did-time">{currentTime}</div>
                <div className="did-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="did-widgets-container">
                <div className="did-widget did-widget-hover">
                  <div className="did-widget-header">
                    <div className="did-widget-icon did-weather-icon">
                      <img src={sunIcon} alt="Weather" className="did-widget-icon-img" />
                    </div>
                    <span>{t.weather}</span>
                  </div>
                  <div className="did-weather-temp">18°</div>
                  <div className="did-weather-desc">{language === 'tr' ? 'Açık, H:22° L:14°' : 'Clear, H:72° L:57°'}</div>
                </div>
                <div
                  className="did-widget did-widget-hover"
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
                  <div className="did-widget-header">
                    <div className="did-widget-icon did-music-icon">
                      <img src={musicIcon} alt="Music" className="did-widget-icon-img" />
                    </div>
                    <span>{t.music}</span>
                  </div>
                  <div className="did-music-playing">
                    <div className="did-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="did-album-img" />
                    </div>
                    <div className="did-music-info">
                      <h4>{isMusicPlaying ? t.nowPlaying : t.playNow}</h4>
                      <p>Blinding Lights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="did-dock">
                <div className="did-dock-icon did-close-icon did-dock-hover" onClick={handleClose}>
                  <span className="did-close-tooltip">{language === 'tr' ? 'Çıkış' : 'Exit'} ✕</span>
                  <img src={closeIcon} alt="Close" className="did-close-img" />
                </div>
                <div className="did-dock-icon did-safari-icon did-dock-hover" onClick={handleContactNavigation}>
                  <span className="did-safari-tooltip">{language === 'tr' ? 'İletişime Geçin' : 'Contact Us'}</span>
                  <img src={networkIcon} alt="Contact" className="did-icon-img" />
                </div>
                <div className="did-dock-icon did-call-icon did-dock-hover" onClick={handleContactNavigation}>
                  <img src={callIcon} alt="Call" className="did-icon-img" />
                </div>
                <div className="did-dock-icon did-instagram-icon did-dock-hover" onClick={openInstagram}>
                  <span className="did-instagram-tooltip">{t.tooltip}</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Instagram App */}
            <div className={`did-instagram-app ${isInstagramOpen ? 'did-active' : ''}`}>
              {/* Scenario Screen */}
              {showScenarioScreen && (
                <div className="did-scenario-screen">
                  <div className="did-scenario-header">
                    <div className="did-logo">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="did-info">
                      <h3>Allync AI</h3>
                      <p>{t.selectScenario}</p>
                    </div>
                    <button className="did-close-btn" onClick={closeInstagram}>✕</button>
                  </div>

                  <div className="did-scenario-list">
                    {Object.entries(scenarioData).map(([key, scenario]) => (
                      <button
                        key={key}
                        className="did-scenario-item"
                        onClick={() => selectScenario(key)}
                      >
                        <div className={`did-scenario-icon-wrapper ${key}`}>
                          <img src={scenarioIcons[key]} alt={scenario.title} className="did-scenario-icon" />
                        </div>
                        <div className="did-text">
                          <h4>{scenario.title}</h4>
                          <p>{scenario.count}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Screen */}
              {!showScenarioScreen && (
                <div className="did-chat-screen">
                  <div className="did-chat-header">
                    <button className="did-back-btn" onClick={goBack}>
                      <img src={backwardIcon} alt="Back" className="did-back-img" />
                    </button>
                    <div className="did-profile">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="did-info">
                      <h3>Allync AI</h3>
                      <p className={isTyping ? 'did-typing' : ''}>
                        {isTyping ? t.typing : t.active}
                      </p>
                    </div>
                    <div className="did-actions">
                      <button className="did-action-btn">
                        <img src={videoCallIcon} alt="Video" className="did-action-icon" />
                      </button>
                      <button className="did-action-btn">
                        <img src={callOutlineIcon} alt="Call" className="did-action-icon did-call-action-icon" />
                      </button>
                      <button className="did-action-btn" onClick={closeInstagram}>✕</button>
                    </div>
                  </div>

                  <div className="did-chat-area" ref={chatAreaRef}>
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`did-message did-${msg.type}`}>
                        {msg.isStoryReply && (
                          <div className="did-story-reply-label">
                            {language === 'tr' ? 'Hikayenize yanıt verdi' : 'Replied to your story'}
                          </div>
                        )}
                        <div className="did-bubble">
                          <div className="did-bubble-content">
                            {msg.content.split('\n').map((line, i) => (
                              <React.Fragment key={i}>
                                {line}
                                {i < msg.content.split('\n').length - 1 && <br />}
                              </React.Fragment>
                            ))}
                          </div>
                          <span className="did-msg-time">
                            {getMessageTime(idx)}
                            {msg.type === 'user' && <img src={checkIcon} alt="sent" className="did-check" />}
                          </span>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="did-typing-indicator">
                        <span /><span /><span />
                      </div>
                    )}

                    {demoCompleted && (
                      <div className="did-demo-actions">
                        <button className="did-restart-btn" onClick={restartDemo}>
                          🔄 {t.restart}
                        </button>
                        <button className="did-contact-btn" onClick={closeInstagram}>
                          🏠 {t.backToHome}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="did-input-area">
                    <div className="did-input-container">
                      <span className="did-input-placeholder">{language === 'tr' ? 'Mesaj...' : 'Message...'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Home Indicator */}
            <div className="did-home-indicator" onClick={isInstagramOpen ? closeInstagram : handleClose} />

            {/* Screen Reflection */}
            <div className="did-screen-reflection" />
          </div>
        </div>

        {/* Click outside hint */}
        <div className="did-hint">
          {language === 'tr' ? 'Kapatmak için dışarı tıklayın' : 'Click outside to close'}
        </div>
      </div>
    </div>,
    document.body
  );
};
