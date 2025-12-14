// Voice Cloning Demo Scenarios - TR/EN

export interface VoiceCloningDemoScenario {
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
  sampleText: {
    tr: string;
    en: string;
  };
  voiceType: string;
  duration: string;
  audioSrc?: {
    tr?: string;
    en?: string;
  };
}

export const voiceCloningDemoScenarios: VoiceCloningDemoScenario[] = [
  {
    id: 'professional',
    title: {
      tr: 'Profesyonel Seslendirme',
      en: 'Professional Voiceover'
    },
    icon: '🎙️',
    description: {
      tr: 'Kurumsal videolar ve tanıtımlar için profesyonel ses tonu',
      en: 'Professional voice tone for corporate videos and promotions'
    },
    sampleText: {
      tr: 'Allync AI ile işletmenizi geleceğe taşıyın. Yapay zeka destekli çözümlerimiz, müşteri deneyiminizi bir üst seviyeye çıkarır.',
      en: 'Take your business to the future with Allync AI. Our AI-powered solutions elevate your customer experience to the next level.'
    },
    voiceType: 'Professional',
    duration: '8s',
    audioSrc: {
      tr: '/audio/voice-cloning/professional-tr.mp3',
      en: '/audio/voice-cloning/professional-en.mp3'
    }
  },
  {
    id: 'commercial',
    title: {
      tr: 'Reklam Sesi',
      en: 'Commercial Voice'
    },
    icon: '📺',
    description: {
      tr: 'Enerjik ve dikkat çekici reklam seslendirmesi',
      en: 'Energetic and attention-grabbing commercial voiceover'
    },
    sampleText: {
      tr: 'Kaçırılmayacak fırsat! Sadece bu hafta, tüm ürünlerde yüzde elli indirim. Hemen sipariş verin!',
      en: 'Don\'t miss this opportunity! Fifty percent off all products this week only. Order now!'
    },
    voiceType: 'Energetic',
    duration: '6s',
    audioSrc: {
      tr: '/audio/voice-cloning/commercial-tr.mp3',
      en: '/audio/voice-cloning/commercial-en.mp3'
    }
  },
  {
    id: 'narrator',
    title: {
      tr: 'Anlatıcı Ses',
      en: 'Narrator Voice'
    },
    icon: '📖',
    description: {
      tr: 'Hikaye anlatımı ve belgesel için sakin anlatıcı sesi',
      en: 'Calm narrator voice for storytelling and documentaries'
    },
    sampleText: {
      tr: 'Yüzyıllar önce, bu topraklarda büyük bir medeniyet yaşardı. Onların hikayeleri hâlâ rüzgârda fısıldanır.',
      en: 'Centuries ago, a great civilization lived on these lands. Their stories are still whispered in the wind.'
    },
    voiceType: 'Calm',
    duration: '10s',
    audioSrc: {
      tr: '/audio/voice-cloning/narrator-tr.mp3',
      en: '/audio/voice-cloning/narrator-en.mp3'
    }
  },
  {
    id: 'assistant',
    title: {
      tr: 'Asistan Sesi',
      en: 'Assistant Voice'
    },
    icon: '🤖',
    description: {
      tr: 'Sesli asistanlar ve IVR sistemleri için doğal ses',
      en: 'Natural voice for voice assistants and IVR systems'
    },
    sampleText: {
      tr: 'Merhaba, Allync AI asistanına hoş geldiniz. Size nasıl yardımcı olabilirim? Lütfen seçeneklerden birini söyleyin.',
      en: 'Hello, welcome to Allync AI assistant. How can I help you? Please say one of the options.'
    },
    voiceType: 'Friendly',
    duration: '7s',
    audioSrc: {
      tr: '/audio/voice-cloning/assistant-tr.mp3',
      en: '/audio/voice-cloning/assistant-en.mp3'
    }
  }
];

// Voice Cloning UI translations
export const voiceCloningUIText = {
  tr: {
    headerTitle: 'Allync AI',
    selectScenario: 'Ses Türü Seçin',
    sampleText: 'Örnek Metin',
    generating: 'Ses Oluşturuluyor...',
    generatingDesc: 'AI sesinizi klonluyor',
    complete: 'Ses Hazır!',
    voiceType: 'Ses Tipi',
    duration: 'Süre',
    restart: 'Başka Ses Oluştur',
    contact: 'İletişime Geç',
    analyzing: 'Ses profili analiz ediliyor...',
    cloning: 'Ses klonlanıyor...',
    synthesizing: 'Konuşma sentezleniyor...',
    enhancing: 'Ses kalitesi iyileştiriliyor...',
    playing: 'Oynatılıyor',
    paused: 'Duraklatıldı',
    originalVoice: 'Orijinal Ses',
    clonedVoice: 'Klonlanmış Ses'
  },
  en: {
    headerTitle: 'Allync AI',
    selectScenario: 'Select Voice Type',
    sampleText: 'Sample Text',
    generating: 'Generating Voice...',
    generatingDesc: 'AI is cloning your voice',
    complete: 'Voice Ready!',
    voiceType: 'Voice Type',
    duration: 'Duration',
    restart: 'Create Another Voice',
    contact: 'Contact Us',
    analyzing: 'Analyzing voice profile...',
    cloning: 'Cloning voice...',
    synthesizing: 'Synthesizing speech...',
    enhancing: 'Enhancing voice quality...',
    playing: 'Playing',
    paused: 'Paused',
    originalVoice: 'Original Voice',
    clonedVoice: 'Cloned Voice'
  }
};
