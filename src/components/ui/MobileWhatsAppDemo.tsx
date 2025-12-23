import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './MobileWhatsAppDemo.css';

// Assets
import demoLogo from '../../assets/whatsapp-demo-logo.png';
import closeIcon from '../../assets/demo-icons/Close_Cross_Circle.svg';
import callIcon from '../../assets/demo-icons/Call_Fill.svg';
import networkIcon from '../../assets/demo-icons/Network.svg';
import backwardIcon from '../../assets/demo-icons/Backward.svg';
import callOutlineIcon from '../../assets/demo-icons/Call.svg';
import videoCallIcon from '../../assets/demo-icons/Video Call.svg';
import sendMessageBar from '../../assets/demo-icons/Send Message.svg';
import sunIcon from '../../assets/demo-icons/Sun_1_Fill.svg';
import musicIcon from '../../assets/demo-icons/music.svg';
import albumCover from '../../assets/demo-icons/The_Weeknd_-_Blinding_Lights.png';
import blindingLightsAudio from '../../assets/demo-icons/The Weeknd - Blinding Lights.mp3';
import checkIcon from '../../assets/demo-icons/Check.svg';
import calendarIcon from '../../assets/demo-icons/Calendar_Plus.svg';
import cardIcon from '../../assets/demo-icons/Card_Fill.svg';
import pinIcon from '../../assets/demo-icons/Pin_Fill.svg';
import handIcon from '../../assets/demo-icons/Hand_Sparcles_Fill.svg';

// Senaryo ikonları mapping
const scenarioIcons: Record<string, string> = {
  appointment: calendarIcon,
  pricing: cardIcon,
  greeting: handIcon,
  company: pinIcon
};

interface MobileWhatsAppDemoProps {
  language: 'tr' | 'en';
  onClose?: () => void;
  onContactClick?: () => void;
}

// Senaryolar
const scenarios = {
  tr: {
    appointment: {
      icon: '📅',
      title: 'Randevu Alma',
      count: '6 mesaj',
      messages: [
        { type: 'user', content: 'Merhaba, randevu almak istiyorum' },
        { type: 'bot', content: 'Merhaba! 👋 Randevu almak istediğiniz için teşekkürler. Hangi hizmet için randevu almak istersiniz?' },
        { type: 'user', content: 'Saç kesimi için' },
        { type: 'bot', content: 'Harika seçim! Saç kesimi için müsait zamanlarımız:\n\n📅 Yarın 10:00\n📅 Yarın 14:00\n📅 Perşembe 11:00\n\nHangisi size uygun?' },
        { type: 'user', content: 'Yarın 14:00 olsun' },
        { type: 'bot', content: 'Mükemmel! ✅ Randevunuz onaylandı:\n\n📅 Tarih: Yarın\n⏰ Saat: 14:00\n✂️ Hizmet: Saç Kesimi\n\nGörüşmek üzere!' }
      ]
    },
    pricing: {
      icon: '💰',
      title: 'Fiyat Bilgisi',
      count: '2 mesaj',
      messages: [
        { type: 'user', content: 'Fiyat listesi alabilir miyim?' },
        { type: 'bot', content: 'Tabii ki! İşte güncel fiyat listemiz:\n\n💈 Saç Kesimi: 150₺\n🧔 Sakal Tıraşı: 80₺\n💇 Saç + Sakal: 200₺\n🎨 Saç Boyama: 300₺\n\nBaşka bir sorunuz var mı?' }
      ]
    },
    greeting: {
      icon: '👋',
      title: 'Selamlama',
      count: '2 mesaj',
      messages: [
        { type: 'user', content: 'Merhaba' },
        { type: 'bot', content: 'Merhaba! 👋 Allync AI\'ya hoş geldiniz! Size nasıl yardımcı olabilirim?\n\n📅 Randevu al\n💰 Fiyat bilgisi\n📍 Konum bilgisi\n❓ Soru sor' }
      ]
    },
    company: {
      icon: '📍',
      title: 'Şirket Bilgileri',
      count: '2 mesaj',
      messages: [
        { type: 'user', content: 'Adresiniz nedir?' },
        { type: 'bot', content: 'Bizi şu adreste bulabilirsiniz:\n\n📍 Atatürk Cad. No:123\n🏢 Merkez / İstanbul\n\n⏰ Çalışma Saatleri:\nPzt-Cum: 09:00-19:00\nCmt: 10:00-17:00\nPzr: Kapalı\n\n📞 0212 123 45 67' }
      ]
    }
  },
  en: {
    appointment: {
      icon: '📅',
      title: 'Book Appointment',
      count: '6 messages',
      messages: [
        { type: 'user', content: 'Hello, I want to book an appointment' },
        { type: 'bot', content: 'Hello! 👋 Thank you for booking. Which service would you like to book?' },
        { type: 'user', content: 'For a haircut' },
        { type: 'bot', content: 'Great choice! Available times for haircut:\n\n📅 Tomorrow 10:00\n📅 Tomorrow 14:00\n📅 Thursday 11:00\n\nWhich one works for you?' },
        { type: 'user', content: 'Tomorrow at 14:00' },
        { type: 'bot', content: 'Perfect! ✅ Your appointment is confirmed:\n\n📅 Date: Tomorrow\n⏰ Time: 14:00\n✂️ Service: Haircut\n\nSee you soon!' }
      ]
    },
    pricing: {
      icon: '💰',
      title: 'Pricing Info',
      count: '2 messages',
      messages: [
        { type: 'user', content: 'Can I get the price list?' },
        { type: 'bot', content: 'Of course! Here is our current price list:\n\n💈 Haircut: $15\n🧔 Beard Trim: $8\n💇 Hair + Beard: $20\n🎨 Hair Coloring: $30\n\nAny other questions?' }
      ]
    },
    greeting: {
      icon: '👋',
      title: 'Greeting',
      count: '2 messages',
      messages: [
        { type: 'user', content: 'Hello' },
        { type: 'bot', content: 'Hello! 👋 Welcome to Allync AI! How can I help you?\n\n📅 Book appointment\n💰 Pricing info\n📍 Location info\n❓ Ask a question' }
      ]
    },
    company: {
      icon: '📍',
      title: 'Company Info',
      count: '2 messages',
      messages: [
        { type: 'user', content: 'What is your address?' },
        { type: 'bot', content: 'You can find us at:\n\n📍 123 Main Street\n🏢 Downtown / New York\n\n⏰ Working Hours:\nMon-Fri: 09:00-19:00\nSat: 10:00-17:00\nSun: Closed\n\n📞 +1 212 123 4567' }
      ]
    }
  }
};

const uiText = {
  tr: {
    selectScenario: 'Senaryo Seçin',
    online: 'çevrimiçi',
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
    online: 'online',
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

export const MobileWhatsAppDemo: React.FC<MobileWhatsAppDemoProps> = ({
  language,
  onClose,
  onContactClick
}) => {
  // Siteye giriş zamanını kaydet (bir kere)
  const [entryTime] = useState(() => new Date());
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [showScenarioScreen, setShowScenarioScreen] = useState(true);
  const [currentScenario, setCurrentScenario] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{type: string; content: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [demoCompleted, setDemoCompleted] = useState(false);
  // Dynamic Island states: 'collapsed' | 'compact' | 'expanded'
  const [dynamicIslandState, setDynamicIslandState] = useState<'collapsed' | 'compact' | 'expanded'>('collapsed');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Disable body scroll and hide other elements
  useEffect(() => {
    // Save current scroll position
    const scrollY = window.scrollY;

    // Add class to body to hide everything else
    document.body.classList.add('mwd-modal-open');
    document.body.style.top = `-${scrollY}px`;

    return () => {
      // Remove class and restore scroll
      document.body.classList.remove('mwd-modal-open');
      document.body.style.top = '';
      window.scrollTo(0, scrollY);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

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

  // Handle Dynamic Island state changes based on WhatsApp open/close
  useEffect(() => {
    if (isMusicPlaying) {
      if (isWhatsAppOpen) {
        // WhatsApp açıldığında compact moda geç
        setDynamicIslandState('compact');
        setShowVolumeControl(false);
      } else {
        // WhatsApp kapandığında expanded moda dön
        setDynamicIslandState('expanded');
        setShowVolumeControl(true);
      }
    }
  }, [isWhatsAppOpen, isMusicPlaying]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current && isMusicPlaying) {
      audioRef.current.volume = volume;
    }
  }, [volume, isMusicPlaying]);

  // Auto scroll chat
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const openWhatsApp = () => {
    setIsWhatsAppOpen(true);
  };

  const closeWhatsApp = () => {
    setIsWhatsAppOpen(false);
    setShowScenarioScreen(true);
    setCurrentScenario(null);
    setMessages([]);
    setDemoCompleted(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleClose = () => {
    // Müziği durdur
    setIsMusicPlaying(false);
    setDynamicIslandState('collapsed');
    if (onClose) {
      onClose();
    }
  };

  const handleContactNavigation = () => {
    // Müziği durdur
    setIsMusicPlaying(false);
    setDynamicIslandState('collapsed');

    // Remove modal class first
    document.body.classList.remove('mwd-modal-open');
    document.body.style.top = '';

    // Close modal
    if (onClose) {
      onClose();
    }

    // Navigate to contact section after a short delay
    setTimeout(() => {
      if (onContactClick) {
        onContactClick();
      }
    }, 100);
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

  return createPortal(
    <div className="mwd-overlay">
      <div className="mwd-iphone-container">
        <div className="mwd-iphone-frame">
          {/* Side Buttons */}
          <div className="mwd-side-button mwd-silent-switch" />
          <div className="mwd-side-button mwd-volume-up" />
          <div className="mwd-side-button mwd-volume-down" />
          <div className="mwd-side-button mwd-power-button" />

          <div className="mwd-iphone-screen">
            {/* Wallpaper */}
            <div className="mwd-wallpaper" />

            {/* Dynamic Island */}
            <div
              className={`mwd-dynamic-island mwd-di-state-${dynamicIslandState}`}
              onClick={() => {
                if (dynamicIslandState === 'collapsed') {
                  // Collapsed'dan müziği başlat ve expanded yap
                  setIsMusicPlaying(true);
                  setDynamicIslandState('expanded');
                } else if (dynamicIslandState === 'expanded') {
                  // Expanded'dan: müzik çalıyorsa ve WhatsApp açıksa compact'a
                  if (isMusicPlaying && isWhatsAppOpen) {
                    setDynamicIslandState('compact');
                  }
                } else if (dynamicIslandState === 'compact') {
                  // Compact'tan expanded'a geç
                  setDynamicIslandState('expanded');
                }
              }}
            >
              {/* Collapsed Content - Camera & Sensor */}
              <div className="mwd-di-collapsed-content">
                <div className="mwd-di-camera" />
                <div className="mwd-di-sensor" />
              </div>

              {/* Compact Content - Album, Track Info & Waveform */}
              <div className="mwd-di-compact-content">
                <div className="mwd-di-compact-left">
                  <div className="mwd-di-compact-album">
                    <img src={albumCover} alt="Album" className="mwd-di-album-img" />
                  </div>
                  <div className="mwd-di-compact-info">
                    <span className="mwd-di-compact-title">Blinding Lights</span>
                    <span className="mwd-di-compact-artist">The Weeknd</span>
                  </div>
                </div>
                <div className="mwd-di-compact-waves">
                  <div className="mwd-di-wave-bar" />
                  <div className="mwd-di-wave-bar" />
                  <div className="mwd-di-wave-bar" />
                </div>
              </div>

              {/* Expanded Content - Full Music Player */}
              <div className="mwd-di-expanded-content">
                <div className="mwd-di-music-left">
                  <div className="mwd-di-album">
                    <img src={albumCover} alt="Album" className="mwd-di-album-img" />
                  </div>
                  <div className="mwd-di-track-info">
                    <h4>Blinding Lights</h4>
                    <p>The Weeknd</p>
                  </div>
                </div>
                <div className="mwd-di-music-right">
                  <div className="mwd-di-wave-bar" />
                  <div className="mwd-di-wave-bar" />
                  <div className="mwd-di-wave-bar" />
                  <div className="mwd-di-wave-bar" />
                  <div className="mwd-di-wave-bar" />
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mwd-status-bar">
              <div className="mwd-status-left">
                <span>{currentTime}</span>
              </div>
              <div className="mwd-status-right">
                <div className="mwd-signal-bars">
                  <span /><span /><span /><span />
                </div>
                <span className="mwd-5g">5G</span>
                <div className="mwd-battery">
                  <div className="mwd-battery-body">
                    <div className="mwd-battery-level" />
                  </div>
                </div>
              </div>
            </div>

            {/* Home Screen */}
            <div className={`mwd-home-screen ${isWhatsAppOpen ? 'mwd-hidden' : ''}`}>
              {/* iPhone Volume HUD - Inside Screen */}
              <div className={`mwd-volume-hud ${showVolumeControl ? 'mwd-volume-hud-visible' : ''}`}>
                <div className="mwd-volume-hud-container">
                  <div className="mwd-volume-hud-icon">
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
                  <div className="mwd-volume-hud-slider">
                    <div className="mwd-volume-hud-track">
                      <div
                        className="mwd-volume-hud-fill"
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
                      className="mwd-volume-hud-input"
                    />
                  </div>
                </div>
              </div>

              {/* Time Widget */}
              <div className="mwd-time-widget">
                <div className="mwd-time">{currentTime}</div>
                <div className="mwd-date">{currentDate}</div>
              </div>

              {/* Widgets */}
              <div className="mwd-widgets-container">
                <div className="mwd-widget">
                  <div className="mwd-widget-header">
                    <div className="mwd-widget-icon mwd-weather-icon">
                      <img src={sunIcon} alt="Weather" className="mwd-widget-icon-img" />
                    </div>
                    <span>{t.weather}</span>
                  </div>
                  <div className="mwd-weather-temp">18°</div>
                  <div className="mwd-weather-desc">{language === 'tr' ? 'Açık, H:22° L:14°' : 'Clear, H:72° L:57°'}</div>
                </div>
                <div
                  className="mwd-widget"
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
                  <div className="mwd-widget-header">
                    <div className="mwd-widget-icon mwd-music-icon">
                      <img src={musicIcon} alt="Music" className="mwd-widget-icon-img" />
                    </div>
                    <span>{t.music}</span>
                  </div>
                  <div className="mwd-music-playing">
                    <div className="mwd-music-album">
                      <img src={albumCover} alt="Blinding Lights" className="mwd-album-img" />
                    </div>
                    <div className="mwd-music-info">
                      <h4>{isMusicPlaying ? t.nowPlaying : t.playNow}</h4>
                      <p>Blinding Lights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dock */}
              <div className="mwd-dock">
                <div className="mwd-dock-icon mwd-close-icon" onClick={handleClose}>
                  <span className="mwd-close-tooltip">{language === 'tr' ? 'Çıkış' : 'Exit'} ✕</span>
                  <img src={closeIcon} alt="Close" className="mwd-close-img" />
                </div>
                <div className="mwd-dock-icon mwd-network-icon" onClick={handleContactNavigation}>
                  <img src={networkIcon} alt="Network" className="mwd-icon-img" />
                </div>
                <div className="mwd-dock-icon mwd-call-icon" onClick={handleContactNavigation}>
                  <img src={callIcon} alt="Call" className="mwd-icon-img" />
                </div>
                <div className="mwd-dock-icon mwd-whatsapp-icon" onClick={openWhatsApp}>
                  <span className="mwd-whatsapp-tooltip">{t.tooltip}</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* WhatsApp App */}
            <div className={`mwd-whatsapp-app ${isWhatsAppOpen ? 'mwd-active' : ''}`}>
              {/* Scenario Screen */}
              {showScenarioScreen && (
                <div className="mwd-scenario-screen">
                  <div className="mwd-scenario-header">
                    <div className="mwd-logo">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="mwd-info">
                      <h3>Allync AI</h3>
                      <p>{t.selectScenario}</p>
                    </div>
                    <button className="mwd-close-btn" onClick={closeWhatsApp}>✕</button>
                  </div>

                  <div className="mwd-scenario-list">
                    {Object.entries(scenarioData).map(([key, scenario]) => (
                      <button
                        key={key}
                        className="mwd-scenario-item"
                        onClick={() => selectScenario(key)}
                      >
                        <div className={`mwd-scenario-icon-wrapper ${key}`}>
                          <img src={scenarioIcons[key]} alt={scenario.title} className="mwd-scenario-icon" />
                        </div>
                        <div className="mwd-text">
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
                <div className="mwd-chat-screen">
                  <div className="mwd-chat-header">
                    <button className="mwd-back-btn" onClick={goBack}>
                      <img src={backwardIcon} alt="Back" className="mwd-back-img" />
                    </button>
                    <div className="mwd-profile">
                      <img src={demoLogo} alt="Allync AI" />
                    </div>
                    <div className="mwd-info">
                      <h3>Allync AI</h3>
                      <p className={isTyping ? 'mwd-typing' : ''}>
                        {isTyping ? t.typing : t.online}
                      </p>
                    </div>
                    <div className="mwd-actions">
                      <button className="mwd-action-btn">
                        <img src={videoCallIcon} alt="Video" className="mwd-action-icon" />
                      </button>
                      <button className="mwd-action-btn">
                        <img src={callOutlineIcon} alt="Call" className="mwd-action-icon mwd-call-action-icon" />
                      </button>
                      <button className="mwd-action-btn" onClick={closeWhatsApp}>✕</button>
                    </div>
                  </div>

                  <div className="mwd-chat-area" ref={chatAreaRef}>
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`mwd-message mwd-${msg.type}`}>
                        <div className="mwd-bubble">
                          <div className="mwd-bubble-content">
                            {msg.content.split('\n').map((line, i) => (
                              <React.Fragment key={i}>
                                {line}
                                {i < msg.content.split('\n').length - 1 && <br />}
                              </React.Fragment>
                            ))}
                          </div>
                          <span className="mwd-msg-time">
                            {getMessageTime(idx)}
                            {msg.type === 'user' && <img src={checkIcon} alt="sent" className="mwd-check" />}
                          </span>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="mwd-typing-indicator">
                        <span /><span /><span />
                      </div>
                    )}

                    {demoCompleted && (
                      <div className="mwd-demo-actions">
                        <button className="mwd-restart-btn" onClick={restartDemo}>
                          🔄 {t.restart}
                        </button>
                        <button className="mwd-contact-btn" onClick={closeWhatsApp}>
                          🏠 {t.backToHome}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mwd-input-area">
                    <img src={sendMessageBar} alt="Message input" className="mwd-input-bar-img" />
                  </div>
                </div>
              )}
            </div>

            {/* Home Indicator */}
            <div className="mwd-home-indicator" onClick={isWhatsAppOpen ? closeWhatsApp : handleClose} />

            {/* Screen Reflection */}
            <div className="mwd-screen-reflection" />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
