// Image-to-Video Demo Scenarios - TR/EN

export interface ImageToVideoDemoScenario {
  id: string;
  title: {
    tr: string;
    en: string;
  };
  icon: string;
  description: {
    tr: string;
    en: string;
  };
  sourceImage: string;
  animationType: string;
  duration: string;
}

export const imageToVideoDemoScenarios: ImageToVideoDemoScenario[] = [
  {
    id: 'product-showcase',
    title: {
      tr: 'Ürün Animasyonu',
      en: 'Product Animation'
    },
    icon: '📦',
    description: {
      tr: 'Statik ürün görselini 360° dönen, parlayan bir vitrin videosuna dönüştür.',
      en: 'Transform static product image into a 360° rotating, gleaming showcase video.'
    },
    sourceImage: '/images/demo-product.webp',
    animationType: '360° Rotation',
    duration: '5s'
  },
  {
    id: 'portrait-alive',
    title: {
      tr: 'Portre Canlandırma',
      en: 'Portrait Animation'
    },
    icon: '🎭',
    description: {
      tr: 'Portre fotoğrafını hafif baş hareketleri ve göz kırpma ile canlandır.',
      en: 'Bring portrait photo to life with subtle head movements and blinking.'
    },
    sourceImage: '/images/demo-portrait.webp',
    animationType: 'Living Portrait',
    duration: '4s'
  },
  {
    id: 'social-motion',
    title: {
      tr: 'Sosyal Medya',
      en: 'Social Media'
    },
    icon: '📱',
    description: {
      tr: 'Sosyal medya görselini dinamik zoom, pan ve parıltı efektleriyle hareketlendir.',
      en: 'Add dynamic zoom, pan and sparkle effects to social media image.'
    },
    sourceImage: '/images/demo-social.webp',
    animationType: 'Dynamic Motion',
    duration: '3s'
  },
  {
    id: 'art-illustration',
    title: {
      tr: 'İllüstrasyon',
      en: 'Illustration'
    },
    icon: '🎨',
    description: {
      tr: 'Dijital illüstrasyonu katman katman animate et ve derinlik ekle.',
      en: 'Animate digital illustration layer by layer and add depth.'
    },
    sourceImage: '/images/demo-illustration.webp',
    animationType: 'Parallax Layers',
    duration: '6s'
  }
];

// Image-to-Video UI translations
export const imageToVideoUIText = {
  tr: {
    headerTitle: 'Allync AI',
    selectScenario: 'Animasyon Türü Seçin',
    sourceImage: 'Kaynak Görsel',
    animating: 'Animate Ediliyor...',
    animatingDesc: 'AI görselinizi canlandırıyor',
    complete: 'Video Hazır!',
    duration: 'Süre',
    type: 'Animasyon',
    restart: 'Başka Görsel Animate Et',
    contact: 'İletişime Geç',
    analyzing: 'Görsel analiz ediliyor...',
    detecting: 'Nesneler tespit ediliyor...',
    generating: 'Hareket oluşturuluyor...',
    rendering: 'Video render ediliyor...'
  },
  en: {
    headerTitle: 'Allync AI',
    selectScenario: 'Select Animation Type',
    sourceImage: 'Source Image',
    animating: 'Animating...',
    animatingDesc: 'AI is bringing your image to life',
    complete: 'Video Ready!',
    duration: 'Duration',
    type: 'Animation',
    restart: 'Animate Another Image',
    contact: 'Contact Us',
    analyzing: 'Analyzing image...',
    detecting: 'Detecting objects...',
    generating: 'Generating motion...',
    rendering: 'Rendering video...'
  }
};
