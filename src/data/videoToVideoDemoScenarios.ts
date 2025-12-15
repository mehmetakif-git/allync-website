// Video-to-Video Demo Scenarios - TR/EN

export interface VideoToVideoDemoScenario {
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
  beforeLabel: {
    tr: string;
    en: string;
  };
  afterLabel: {
    tr: string;
    en: string;
  };
  transformationType: string;
  processingTime: string;
}

export const videoToVideoDemoScenarios: VideoToVideoDemoScenario[] = [
  {
    id: 'style-transfer',
    title: {
      tr: 'Stil Transferi',
      en: 'Style Transfer'
    },
    icon: '🎨',
    description: {
      tr: 'Videonuza sanatsal stiller uygulayın. Van Gogh, anime, sinematik ve daha fazlası.',
      en: 'Apply artistic styles to your video. Van Gogh, anime, cinematic and more.'
    },
    beforeLabel: {
      tr: 'Orijinal Video',
      en: 'Original Video'
    },
    afterLabel: {
      tr: 'Anime Stili',
      en: 'Anime Style'
    },
    transformationType: 'Artistic',
    processingTime: '~30s'
  },
  {
    id: 'video-enhance',
    title: {
      tr: 'Video İyileştirme',
      en: 'Video Enhancement'
    },
    icon: '✨',
    description: {
      tr: 'Düşük kaliteli videoları 4K kalitesine yükseltin. Gürültü azaltma ve keskinleştirme.',
      en: 'Upscale low quality videos to 4K. Noise reduction and sharpening.'
    },
    beforeLabel: {
      tr: '480p Orijinal',
      en: '480p Original'
    },
    afterLabel: {
      tr: '4K İyileştirilmiş',
      en: '4K Enhanced'
    },
    transformationType: 'Upscale 4K',
    processingTime: '~45s'
  },
  {
    id: 'background-replace',
    title: {
      tr: 'Arka Plan Değiştirme',
      en: 'Background Replace'
    },
    icon: '🌆',
    description: {
      tr: 'Video arka planını otomatik olarak değiştirin. Yeşil ekran gerektirmez.',
      en: 'Automatically replace video background. No green screen required.'
    },
    beforeLabel: {
      tr: 'Orijinal Arka Plan',
      en: 'Original Background'
    },
    afterLabel: {
      tr: 'Yeni Arka Plan',
      en: 'New Background'
    },
    transformationType: 'AI Segmentation',
    processingTime: '~20s'
  },
  {
    id: 'colorize',
    title: {
      tr: 'Renklendirme',
      en: 'Colorization'
    },
    icon: '🎬',
    description: {
      tr: 'Siyah beyaz videoları yapay zeka ile otomatik olarak renkli hale getirin.',
      en: 'Automatically colorize black and white videos using AI.'
    },
    beforeLabel: {
      tr: 'Siyah & Beyaz',
      en: 'Black & White'
    },
    afterLabel: {
      tr: 'Renklendirilmiş',
      en: 'Colorized'
    },
    transformationType: 'AI Colorization',
    processingTime: '~35s'
  }
];

// Video-to-Video UI translations
export const videoToVideoUIText = {
  tr: {
    headerTitle: 'Allync AI',
    selectScenario: 'Dönüşüm Türü Seçin',
    processing: 'İşleniyor...',
    processingDesc: 'AI videonuzu dönüştürüyor',
    complete: 'Dönüşüm Tamamlandı!',
    type: 'Tür',
    time: 'Süre',
    restart: 'Başka Video Dönüştür',
    contact: 'İletişime Geç',
    before: 'Önce',
    after: 'Sonra',
    analyzing: 'Video analiz ediliyor...',
    detecting: 'Öğeler tespit ediliyor...',
    transforming: 'Dönüşüm uygulanıyor...',
    rendering: 'Video render ediliyor...',
    startTransform: 'Dönüştür'
  },
  en: {
    headerTitle: 'Allync AI',
    selectScenario: 'Select Transformation Type',
    processing: 'Processing...',
    processingDesc: 'AI is transforming your video',
    complete: 'Transformation Complete!',
    type: 'Type',
    time: 'Duration',
    restart: 'Transform Another Video',
    contact: 'Contact Us',
    before: 'Before',
    after: 'After',
    analyzing: 'Analyzing video...',
    detecting: 'Detecting elements...',
    transforming: 'Applying transformation...',
    rendering: 'Rendering video...',
    startTransform: 'Transform'
  }
};
