// Text-to-Image Demo Scenarios - TR/EN

export interface TextToImageDemoScenario {
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
  imagePlaceholder: string; // Will be replaced with actual image path
  style: string;
  resolution: string;
}

export const textToImageDemoScenarios: TextToImageDemoScenario[] = [
  {
    id: 'product-photo',
    title: {
      tr: 'Ürün Fotoğrafı',
      en: 'Product Photo'
    },
    icon: '📦',
    prompt: {
      tr: 'Minimalist beyaz arka planda profesyonel parfüm şişesi fotoğrafı. Yumuşak stüdyo aydınlatması, yansımalar, yüksek kalite ürün çekimi.',
      en: 'Professional perfume bottle photo on minimalist white background. Soft studio lighting, reflections, high quality product shot.'
    },
    imagePlaceholder: '/images/demo-product.webp',
    style: 'Professional',
    resolution: '1024x1024'
  },
  {
    id: 'social-media',
    title: {
      tr: 'Sosyal Medya',
      en: 'Social Media'
    },
    icon: '📱',
    prompt: {
      tr: 'Instagram için renkli ve canlı kahve dükkanı atmosferi. Sıcak tonlar, latte art, rustik ahşap masa, doğal ışık.',
      en: 'Colorful and vibrant coffee shop atmosphere for Instagram. Warm tones, latte art, rustic wooden table, natural light.'
    },
    imagePlaceholder: '/images/demo-social.webp',
    style: 'Vibrant',
    resolution: '1080x1080'
  },
  {
    id: 'illustration',
    title: {
      tr: 'İllüstrasyon',
      en: 'Illustration'
    },
    icon: '🎨',
    prompt: {
      tr: 'Dijital sanat stilinde fütüristik şehir manzarası. Neon ışıklar, yağmurlu gece, cyberpunk estetik, detaylı mimari.',
      en: 'Futuristic cityscape in digital art style. Neon lights, rainy night, cyberpunk aesthetic, detailed architecture.'
    },
    imagePlaceholder: '/images/demo-illustration.webp',
    style: 'Digital Art',
    resolution: '1920x1080'
  },
  {
    id: 'portrait',
    title: {
      tr: 'Portre',
      en: 'Portrait'
    },
    icon: '👤',
    prompt: {
      tr: 'Profesyonel iş dünyası portresi. Stüdyo aydınlatması, gri arka plan, özgüvenli duruş, kurumsal görünüm.',
      en: 'Professional business portrait. Studio lighting, gray background, confident pose, corporate look.'
    },
    imagePlaceholder: '/images/demo-portrait.webp',
    style: 'Portrait',
    resolution: '1024x1024'
  }
];

// Text-to-Image UI translations
export const textToImageUIText = {
  tr: {
    headerTitle: 'Allync AI',
    selectScenario: 'Görsel Türü Seçin',
    prompt: 'Prompt',
    generating: 'Görsel Oluşturuluyor...',
    generatingDesc: 'AI görselinizi oluşturuyor',
    complete: 'Görsel Hazır!',
    style: 'Stil',
    resolution: 'Çözünürlük',
    restart: 'Başka Görsel Oluştur',
    contact: 'İletişime Geç',
    analyzing: 'Prompt analiz ediliyor...',
    composing: 'Kompozisyon oluşturuluyor...',
    rendering: 'Görsel render ediliyor...',
    enhancing: 'Detaylar iyileştiriliyor...'
  },
  en: {
    headerTitle: 'Allync AI',
    selectScenario: 'Select Image Type',
    prompt: 'Prompt',
    generating: 'Generating Image...',
    generatingDesc: 'AI is creating your image',
    complete: 'Image Ready!',
    style: 'Style',
    resolution: 'Resolution',
    restart: 'Create Another Image',
    contact: 'Contact Us',
    analyzing: 'Analyzing prompt...',
    composing: 'Composing layout...',
    rendering: 'Rendering image...',
    enhancing: 'Enhancing details...'
  }
};
