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
    nowPlaying: 'Now Playing'
  }
};

export const MobileWhatsAppDemo: React.FC<MobileWhatsAppDemoProps> = ({
  language,
  onClose,
  onContactClick
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [showScenarioScreen, setShowScenarioScreen] = useState(true);
  const [currentScenario, setCurrentScenario] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{type: string; content: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [demoCompleted, setDemoCompleted] = useState(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const t = uiText[language];
  const scenarioData = scenarios[language];

  // Update time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);

      const days = language === 'tr'
        ? ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
        : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = language === 'tr'
        ? ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
        : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      setCurrentDate(`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

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
    if (onClose) {
      onClose();
    }
  };

  const handleContactNavigation = () => {
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

  const getTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString(language === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
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
            <div className="mwd-dynamic-island">
              <div className="mwd-di-camera" />
              <div className="mwd-di-sensor" />
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
                <div className="mwd-widget">
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
                      <h4>{t.nowPlaying}</h4>
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
                  <span className="mwd-whatsapp-tooltip">{t.tooltip} 🚀</span>
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
                        <span className="mwd-icon">{scenario.icon}</span>
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
                          {msg.content.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                              {line}
                              {i < msg.content.split('\n').length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </div>
                        <div className="mwd-time">
                          {getTimeString()}
                          {msg.type === 'user' && <span className="mwd-check">✓✓</span>}
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
