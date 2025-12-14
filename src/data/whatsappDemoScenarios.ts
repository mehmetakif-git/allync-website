// WhatsApp Demo Scenarios - TR/EN

export interface DemoMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  buttons?: string[];
  delay: number; // ms before this message appears
}

export interface DemoScenario {
  id: string;
  title: {
    tr: string;
    en: string;
  };
  icon: string;
  messages: {
    tr: DemoMessage[];
    en: DemoMessage[];
  };
}

export const whatsappDemoScenarios: DemoScenario[] = [
  {
    id: 'appointment',
    title: {
      tr: 'Randevu Alma',
      en: 'Book Appointment'
    },
    icon: '📅',
    messages: {
      tr: [
        { id: '1', type: 'user', content: 'Merhaba, randevu almak istiyorum', delay: 500 },
        { id: '2', type: 'bot', content: 'Hoş geldiniz! 📅 Hangi hizmet için randevu almak istersiniz?', delay: 1200 },
        { id: '3', type: 'bot', content: '', buttons: ['Saç Kesimi', 'Sakal Tıraşı', 'Komple Bakım'], delay: 400 },
        { id: '4', type: 'user', content: 'Saç Kesimi', delay: 1500 },
        { id: '5', type: 'bot', content: 'Harika seçim! 💇 Müsait tarihlerimiz:', delay: 1000 },
        { id: '6', type: 'bot', content: '• Yarın 14:00\n• Cuma 10:00\n• Cumartesi 16:00', delay: 600 },
        { id: '7', type: 'user', content: 'Yarın 14:00 olsun', delay: 1800 },
        { id: '8', type: 'bot', content: 'Randevunuz onaylandı! ✅\n\n📍 Yarın saat 14:00\'te bekliyoruz.\n\nHatırlatma mesajı gönderilecektir.', delay: 1200 },
      ],
      en: [
        { id: '1', type: 'user', content: 'Hi, I want to book an appointment', delay: 500 },
        { id: '2', type: 'bot', content: 'Welcome! 📅 What service would you like to book?', delay: 1200 },
        { id: '3', type: 'bot', content: '', buttons: ['Haircut', 'Beard Trim', 'Full Package'], delay: 400 },
        { id: '4', type: 'user', content: 'Haircut', delay: 1500 },
        { id: '5', type: 'bot', content: 'Great choice! 💇 Available times:', delay: 1000 },
        { id: '6', type: 'bot', content: '• Tomorrow 2:00 PM\n• Friday 10:00 AM\n• Saturday 4:00 PM', delay: 600 },
        { id: '7', type: 'user', content: 'Tomorrow 2:00 PM please', delay: 1800 },
        { id: '8', type: 'bot', content: 'Your appointment is confirmed! ✅\n\n📍 See you tomorrow at 2:00 PM.\n\nA reminder will be sent.', delay: 1200 },
      ]
    }
  },
  {
    id: 'pricing',
    title: {
      tr: 'Fiyat Bilgisi',
      en: 'Price Info'
    },
    icon: '💰',
    messages: {
      tr: [
        { id: '1', type: 'user', content: 'Fiyatlarınız nedir?', delay: 500 },
        { id: '2', type: 'bot', content: 'Fiyat listemiz 💰', delay: 1000 },
        { id: '3', type: 'bot', content: '💇 Saç Kesimi: 150₺\n🧔 Sakal Tıraşı: 75₺\n✨ Komple Bakım: 200₺\n💆 Saç Bakımı: 100₺', delay: 800 },
        { id: '4', type: 'bot', content: 'Randevu almak ister misiniz?', delay: 600 },
        { id: '5', type: 'bot', content: '', buttons: ['Randevu Al', 'Başka Soru'], delay: 400 },
        { id: '6', type: 'user', content: 'Randevu Al', delay: 1500 },
        { id: '7', type: 'bot', content: 'Harika! 📅 Hangi hizmet için randevu almak istersiniz?', delay: 1000 },
        { id: '8', type: 'bot', content: '', buttons: ['Saç Kesimi', 'Sakal Tıraşı', 'Komple Bakım'], delay: 400 },
      ],
      en: [
        { id: '1', type: 'user', content: 'What are your prices?', delay: 500 },
        { id: '2', type: 'bot', content: 'Our price list 💰', delay: 1000 },
        { id: '3', type: 'bot', content: '💇 Haircut: $25\n🧔 Beard Trim: $15\n✨ Full Package: $35\n💆 Hair Treatment: $20', delay: 800 },
        { id: '4', type: 'bot', content: 'Would you like to book an appointment?', delay: 600 },
        { id: '5', type: 'bot', content: '', buttons: ['Book Now', 'Other Question'], delay: 400 },
        { id: '6', type: 'user', content: 'Book Now', delay: 1500 },
        { id: '7', type: 'bot', content: 'Great! 📅 What service would you like to book?', delay: 1000 },
        { id: '8', type: 'bot', content: '', buttons: ['Haircut', 'Beard Trim', 'Full Package'], delay: 400 },
      ]
    }
  },
  {
    id: 'greeting',
    title: {
      tr: 'Selamlama',
      en: 'Greeting'
    },
    icon: '👋',
    messages: {
      tr: [
        { id: '1', type: 'user', content: 'Selam!', delay: 500 },
        { id: '2', type: 'bot', content: 'Merhaba! 👋\n\nAllync AI Asistan\'a hoş geldiniz!', delay: 1000 },
        { id: '3', type: 'bot', content: 'Size nasıl yardımcı olabilirim?', delay: 800 },
        { id: '4', type: 'bot', content: '', buttons: ['Randevu', 'Fiyatlar', 'Konum', 'Çalışma Saatleri'], delay: 400 },
        { id: '5', type: 'user', content: 'Konum', delay: 1500 },
        { id: '6', type: 'bot', content: '📍 Adresimiz:\n\nKadıköy, Moda Caddesi No: 42\nİstanbul, Türkiye', delay: 1200 },
        { id: '7', type: 'bot', content: 'Yol tarifi ister misiniz?', delay: 600 },
        { id: '8', type: 'bot', content: '', buttons: ['Google Maps', 'Randevu Al'], delay: 400 },
      ],
      en: [
        { id: '1', type: 'user', content: 'Hello!', delay: 500 },
        { id: '2', type: 'bot', content: 'Hi there! 👋\n\nWelcome to Allync AI Assistant!', delay: 1000 },
        { id: '3', type: 'bot', content: 'How can I help you today?', delay: 800 },
        { id: '4', type: 'bot', content: '', buttons: ['Appointment', 'Prices', 'Location', 'Hours'], delay: 400 },
        { id: '5', type: 'user', content: 'Location', delay: 1500 },
        { id: '6', type: 'bot', content: '📍 Our address:\n\nKadıköy, Moda Street No: 42\nIstanbul, Turkey', delay: 1200 },
        { id: '7', type: 'bot', content: 'Would you like directions?', delay: 600 },
        { id: '8', type: 'bot', content: '', buttons: ['Google Maps', 'Book Appointment'], delay: 400 },
      ]
    }
  },
  {
    id: 'info',
    title: {
      tr: 'Şirket Bilgileri',
      en: 'Business Info'
    },
    icon: '📍',
    messages: {
      tr: [
        { id: '1', type: 'user', content: 'Neredesiniz? Çalışma saatleriniz nedir?', delay: 500 },
        { id: '2', type: 'bot', content: 'Bilgilerimiz 📋', delay: 1000 },
        { id: '3', type: 'bot', content: '📍 Adres:\nKadıköy, Moda Caddesi No: 42\nİstanbul, Türkiye', delay: 800 },
        { id: '4', type: 'bot', content: '🕐 Çalışma Saatleri:\n\nPazartesi - Cumartesi: 09:00 - 21:00\nPazar: Kapalı', delay: 800 },
        { id: '5', type: 'bot', content: '📞 İletişim: +90 555 123 4567', delay: 600 },
        { id: '6', type: 'bot', content: 'Size başka nasıl yardımcı olabilirim?', delay: 800 },
        { id: '7', type: 'bot', content: '', buttons: ['Randevu Al', 'Fiyatlar', 'Google Maps'], delay: 400 },
        { id: '8', type: 'user', content: 'Teşekkürler! 🙏', delay: 1500 },
      ],
      en: [
        { id: '1', type: 'user', content: 'Where are you located? What are your hours?', delay: 500 },
        { id: '2', type: 'bot', content: 'Our information 📋', delay: 1000 },
        { id: '3', type: 'bot', content: '📍 Address:\nKadıköy, Moda Street No: 42\nIstanbul, Turkey', delay: 800 },
        { id: '4', type: 'bot', content: '🕐 Business Hours:\n\nMonday - Saturday: 9:00 AM - 9:00 PM\nSunday: Closed', delay: 800 },
        { id: '5', type: 'bot', content: '📞 Contact: +90 555 123 4567', delay: 600 },
        { id: '6', type: 'bot', content: 'How else can I help you?', delay: 800 },
        { id: '7', type: 'bot', content: '', buttons: ['Book Appointment', 'Prices', 'Google Maps'], delay: 400 },
        { id: '8', type: 'user', content: 'Thank you! 🙏', delay: 1500 },
      ]
    }
  }
];

// WhatsApp UI translations
export const whatsappUIText = {
  tr: {
    headerTitle: 'Allync AI',
    headerSubtitle: 'Genellikle birkaç dakika içinde yanıt verir',
    online: 'çevrimiçi',
    typing: 'yazıyor...',
    inputPlaceholder: 'Mesaj yazın...',
    selectScenario: 'Senaryo Seçin',
    restart: 'Tekrar İzle',
    contact: 'İletişime Geç'
  },
  en: {
    headerTitle: 'Allync AI',
    headerSubtitle: 'Typically replies within minutes',
    online: 'online',
    typing: 'typing...',
    inputPlaceholder: 'Type a message...',
    selectScenario: 'Select Scenario',
    restart: 'Watch Again',
    contact: 'Contact Us'
  }
};
