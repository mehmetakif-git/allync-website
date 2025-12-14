// Instagram Demo Scenarios - TR/EN

export interface InstagramDemoMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  buttons?: string[];
  delay: number; // ms before this message appears
  isStoryReply?: boolean;
}

export interface InstagramDemoScenario {
  id: string;
  title: {
    tr: string;
    en: string;
  };
  icon: string;
  messages: {
    tr: InstagramDemoMessage[];
    en: InstagramDemoMessage[];
  };
}

export const instagramDemoScenarios: InstagramDemoScenario[] = [
  {
    id: 'product-inquiry',
    title: {
      tr: 'Ürün Bilgisi',
      en: 'Product Inquiry'
    },
    icon: '🛍️',
    messages: {
      tr: [
        { id: '1', type: 'user', content: 'Merhaba, bu ürün hala satışta mı?', delay: 500 },
        { id: '2', type: 'bot', content: 'Merhaba! 👋 Evet, ürünümüz stoklarımızda mevcut.', delay: 1200 },
        { id: '3', type: 'bot', content: 'Size nasıl yardımcı olabilirim?', delay: 600 },
        { id: '4', type: 'bot', content: '', buttons: ['Fiyat Bilgisi', 'Kargo Detayları', 'Beden/Renk'], delay: 400 },
        { id: '5', type: 'user', content: 'Fiyat Bilgisi', delay: 1500 },
        { id: '6', type: 'bot', content: '💰 Ürün Fiyatı: 299₺\n\n✨ Bugüne özel %20 indirim!\n📦 150₺ üzeri kargo bedava', delay: 1000 },
        { id: '7', type: 'bot', content: 'Sipariş vermek ister misiniz?', delay: 600 },
        { id: '8', type: 'bot', content: '', buttons: ['Sipariş Ver', 'Diğer Ürünler'], delay: 400 },
      ],
      en: [
        { id: '1', type: 'user', content: 'Hi, is this product still available?', delay: 500 },
        { id: '2', type: 'bot', content: 'Hello! 👋 Yes, the product is in stock.', delay: 1200 },
        { id: '3', type: 'bot', content: 'How can I help you?', delay: 600 },
        { id: '4', type: 'bot', content: '', buttons: ['Price Info', 'Shipping Details', 'Size/Color'], delay: 400 },
        { id: '5', type: 'user', content: 'Price Info', delay: 1500 },
        { id: '6', type: 'bot', content: '💰 Product Price: $29.99\n\n✨ 20% off today only!\n📦 Free shipping over $50', delay: 1000 },
        { id: '7', type: 'bot', content: 'Would you like to place an order?', delay: 600 },
        { id: '8', type: 'bot', content: '', buttons: ['Order Now', 'Other Products'], delay: 400 },
      ]
    }
  },
  {
    id: 'story-mention',
    title: {
      tr: 'Story Yanıtı',
      en: 'Story Reply'
    },
    icon: '📸',
    messages: {
      tr: [
        { id: '1', type: 'user', content: '🔥 Harika ürünler!', isStoryReply: true, delay: 500 },
        { id: '2', type: 'bot', content: 'Teşekkürler! 🙏❤️', delay: 1000 },
        { id: '3', type: 'bot', content: 'Bizi story\'nizde paylaştığınız için çok mutluyuz!', delay: 800 },
        { id: '4', type: 'bot', content: '🎁 Size özel %15 indirim kodunuz: STORY15', delay: 1000 },
        { id: '5', type: 'bot', content: 'Alışverişlerinizde kullanabilirsiniz!', delay: 600 },
        { id: '6', type: 'bot', content: '', buttons: ['Ürünleri Gör', 'Teşekkürler'], delay: 400 },
        { id: '7', type: 'user', content: 'Teşekkürler', delay: 1500 },
        { id: '8', type: 'bot', content: 'Rica ederiz! 💜 Bizi takip etmeye devam edin!', delay: 1000 },
      ],
      en: [
        { id: '1', type: 'user', content: '🔥 Amazing products!', isStoryReply: true, delay: 500 },
        { id: '2', type: 'bot', content: 'Thank you! 🙏❤️', delay: 1000 },
        { id: '3', type: 'bot', content: 'We\'re so happy you shared us in your story!', delay: 800 },
        { id: '4', type: 'bot', content: '🎁 Your exclusive discount code: STORY15', delay: 1000 },
        { id: '5', type: 'bot', content: 'Use it on your next purchase!', delay: 600 },
        { id: '6', type: 'bot', content: '', buttons: ['Shop Now', 'Thanks'], delay: 400 },
        { id: '7', type: 'user', content: 'Thanks', delay: 1500 },
        { id: '8', type: 'bot', content: 'You\'re welcome! 💜 Keep following us!', delay: 1000 },
      ]
    }
  },
  {
    id: 'order-tracking',
    title: {
      tr: 'Sipariş Takibi',
      en: 'Order Tracking'
    },
    icon: '📦',
    messages: {
      tr: [
        { id: '1', type: 'user', content: 'Siparişim nerede?', delay: 500 },
        { id: '2', type: 'bot', content: 'Merhaba! 📦 Sipariş takibi için yardımcı olayım.', delay: 1200 },
        { id: '3', type: 'bot', content: 'Lütfen sipariş numaranızı paylaşır mısınız?', delay: 800 },
        { id: '4', type: 'user', content: '#12345', delay: 1500 },
        { id: '5', type: 'bot', content: '✅ Sipariş #12345 bulundu!\n\n📍 Durum: Kargoya Verildi\n🚚 Kargo: Yurtiçi Kargo\n📅 Tahmini Teslimat: Yarın', delay: 1200 },
        { id: '6', type: 'bot', content: '', buttons: ['Kargo Takip', 'Başka Soru'], delay: 400 },
        { id: '7', type: 'user', content: 'Kargo Takip', delay: 1500 },
        { id: '8', type: 'bot', content: '🔗 Kargo takip linkiniz:\ntrack.yurtici.com/12345\n\nİyi alışverişler! 🛍️', delay: 1000 },
      ],
      en: [
        { id: '1', type: 'user', content: 'Where is my order?', delay: 500 },
        { id: '2', type: 'bot', content: 'Hello! 📦 Let me help you track your order.', delay: 1200 },
        { id: '3', type: 'bot', content: 'Please share your order number.', delay: 800 },
        { id: '4', type: 'user', content: '#12345', delay: 1500 },
        { id: '5', type: 'bot', content: '✅ Order #12345 found!\n\n📍 Status: Shipped\n🚚 Carrier: FedEx\n📅 Est. Delivery: Tomorrow', delay: 1200 },
        { id: '6', type: 'bot', content: '', buttons: ['Track Package', 'Other Question'], delay: 400 },
        { id: '7', type: 'user', content: 'Track Package', delay: 1500 },
        { id: '8', type: 'bot', content: '🔗 Your tracking link:\nfedex.com/track/12345\n\nHappy shopping! 🛍️', delay: 1000 },
      ]
    }
  },
  {
    id: 'collaboration',
    title: {
      tr: 'İşbirliği Talebi',
      en: 'Collaboration Request'
    },
    icon: '🤝',
    messages: {
      tr: [
        { id: '1', type: 'user', content: 'Merhaba, işbirliği yapmak istiyorum', delay: 500 },
        { id: '2', type: 'bot', content: 'Merhaba! 🌟 İşbirliği talebiniz için teşekkürler!', delay: 1200 },
        { id: '3', type: 'bot', content: 'Size daha iyi yardımcı olabilmemiz için birkaç bilgiye ihtiyacımız var.', delay: 800 },
        { id: '4', type: 'bot', content: '', buttons: ['Influencer', 'Marka/Şirket', 'Diğer'], delay: 400 },
        { id: '5', type: 'user', content: 'Influencer', delay: 1500 },
        { id: '6', type: 'bot', content: '📊 Harika! Lütfen şunları paylaşın:\n\n• Takipçi sayınız\n• İçerik türünüz\n• E-posta adresiniz', delay: 1000 },
        { id: '7', type: 'bot', content: 'Ekibimiz 24-48 saat içinde size dönüş yapacak! ✨', delay: 800 },
        { id: '8', type: 'bot', content: '', buttons: ['Tamam', 'Daha Fazla Bilgi'], delay: 400 },
      ],
      en: [
        { id: '1', type: 'user', content: 'Hi, I want to collaborate', delay: 500 },
        { id: '2', type: 'bot', content: 'Hello! 🌟 Thanks for your collaboration request!', delay: 1200 },
        { id: '3', type: 'bot', content: 'We need some information to assist you better.', delay: 800 },
        { id: '4', type: 'bot', content: '', buttons: ['Influencer', 'Brand/Company', 'Other'], delay: 400 },
        { id: '5', type: 'user', content: 'Influencer', delay: 1500 },
        { id: '6', type: 'bot', content: '📊 Great! Please share:\n\n• Follower count\n• Content type\n• Email address', delay: 1000 },
        { id: '7', type: 'bot', content: 'Our team will get back to you within 24-48 hours! ✨', delay: 800 },
        { id: '8', type: 'bot', content: '', buttons: ['Okay', 'More Info'], delay: 400 },
      ]
    }
  }
];

// Instagram UI translations
export const instagramUIText = {
  tr: {
    headerTitle: 'Allync AI',
    headerSubtitle: 'Genellikle anında yanıt verir',
    active: 'Aktif',
    typing: 'yazıyor...',
    inputPlaceholder: 'Mesaj gönder...',
    selectScenario: 'Senaryo Seçin',
    restart: 'Tekrar İzle',
    contact: 'İletişime Geç',
    storyReply: 'Hikayenize yanıt verdi'
  },
  en: {
    headerTitle: 'Allync AI',
    headerSubtitle: 'Typically replies instantly',
    active: 'Active',
    typing: 'typing...',
    inputPlaceholder: 'Message...',
    selectScenario: 'Select Scenario',
    restart: 'Watch Again',
    contact: 'Contact Us',
    storyReply: 'Replied to your story'
  }
};
