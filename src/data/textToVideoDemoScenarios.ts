// Text-to-Video Demo Scenarios - TR/EN

export interface TextToVideoDemoScenario {
  id: string;
  title: {
    tr: string;
    en: string;
  };
  icon: string;
  prompt: {
    tr: string;
    en: string;
  };
  videoPlaceholder: string; // Will be replaced with actual video path
  duration: string;
  style: string;
}

export const textToVideoDemoScenarios: TextToVideoDemoScenario[] = [
  {
    id: 'product-ad',
    title: {
      tr: 'Ürün Reklamı',
      en: 'Product Ad'
    },
    icon: '🛍️',
    prompt: {
      tr: 'Modern bir akıllı saat için sinematik reklam videosu oluştur. Siyah arka plan, yumuşak ışıklandırma, 360 derece dönüş efekti.',
      en: 'Create a cinematic ad video for a modern smartwatch. Black background, soft lighting, 360-degree rotation effect.'
    },
    videoPlaceholder: '/videos/demo-product.mp4',
    duration: '15s',
    style: 'Cinematic'
  },
  {
    id: 'social-media',
    title: {
      tr: 'Sosyal Medya',
      en: 'Social Media'
    },
    icon: '📱',
    prompt: {
      tr: 'Instagram için dikkat çekici bir kahve dükkanı tanıtım videosu. Sıcak tonlar, dinamik geçişler, metin animasyonları.',
      en: 'Eye-catching coffee shop promo video for Instagram. Warm tones, dynamic transitions, text animations.'
    },
    videoPlaceholder: '/videos/demo-social.mp4',
    duration: '10s',
    style: 'Trendy'
  },
  {
    id: 'explainer',
    title: {
      tr: 'Açıklayıcı Video',
      en: 'Explainer Video'
    },
    icon: '📊',
    prompt: {
      tr: 'Yapay zeka teknolojisini anlatan minimalist bir açıklayıcı video. Düz renkler, ikon animasyonları, profesyonel ses.',
      en: 'Minimalist explainer video about AI technology. Flat colors, icon animations, professional voiceover.'
    },
    videoPlaceholder: '/videos/demo-explainer.mp4',
    duration: '30s',
    style: 'Minimalist'
  },
  {
    id: 'lifestyle',
    title: {
      tr: 'Yaşam Tarzı',
      en: 'Lifestyle'
    },
    icon: '✨',
    prompt: {
      tr: 'Yoga ve meditasyon uygulaması için huzurlu bir tanıtım videosu. Doğa sahneleri, yumuşak müzik, sakinleştirici geçişler.',
      en: 'Peaceful promo video for yoga and meditation app. Nature scenes, soft music, calming transitions.'
    },
    videoPlaceholder: '/videos/demo-lifestyle.mp4',
    duration: '20s',
    style: 'Calm'
  }
];

// Text-to-Video UI translations
export const textToVideoUIText = {
  tr: {
    headerTitle: 'Allync AI',
    selectScenario: 'Video Türü Seçin',
    prompt: 'Prompt',
    generating: 'Video Oluşturuluyor...',
    generatingDesc: 'AI videonuzu oluşturuyor',
    complete: 'Video Hazır!',
    duration: 'Süre',
    style: 'Stil',
    restart: 'Başka Video Oluştur',
    contact: 'İletişime Geç',
    processing: 'İşleniyor',
    analyzing: 'Prompt analiz ediliyor...',
    creating: 'Sahneler oluşturuluyor...',
    rendering: 'Video render ediliyor...',
    finalizing: 'Son rötuşlar yapılıyor...'
  },
  en: {
    headerTitle: 'Allync AI',
    selectScenario: 'Select Video Type',
    prompt: 'Prompt',
    generating: 'Generating Video...',
    generatingDesc: 'AI is creating your video',
    complete: 'Video Ready!',
    duration: 'Duration',
    style: 'Style',
    restart: 'Create Another Video',
    contact: 'Contact Us',
    processing: 'Processing',
    analyzing: 'Analyzing prompt...',
    creating: 'Creating scenes...',
    rendering: 'Rendering video...',
    finalizing: 'Finalizing...'
  }
};
