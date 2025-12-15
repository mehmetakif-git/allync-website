// Custom AI Solutions Demo Scenarios - TR/EN

export interface CustomAIDemoScenario {
  id: string;
  industry: {
    tr: string;
    en: string;
  };
  icon: string;
  features: {
    id: string;
    name: { tr: string; en: string };
    icon: string;
  }[];
  result: {
    name: { tr: string; en: string };
    capabilities: { tr: string; en: string }[];
    integrations: string[];
    estimatedTime: string;
  };
}

export const customAIDemoScenarios: CustomAIDemoScenario[] = [
  {
    id: 'healthcare',
    industry: {
      tr: 'Sağlık Sektörü',
      en: 'Healthcare'
    },
    icon: '🏥',
    features: [
      { id: 'appointment', name: { tr: 'Randevu Yönetimi', en: 'Appointment Management' }, icon: '📅' },
      { id: 'patient', name: { tr: 'Hasta Takibi', en: 'Patient Tracking' }, icon: '👤' },
      { id: 'reminder', name: { tr: 'Hatırlatıcılar', en: 'Reminders' }, icon: '🔔' },
      { id: 'report', name: { tr: 'Rapor Oluşturma', en: 'Report Generation' }, icon: '📊' }
    ],
    result: {
      name: { tr: 'HealthBot Pro', en: 'HealthBot Pro' },
      capabilities: [
        { tr: '7/24 hasta desteği', en: '24/7 patient support' },
        { tr: 'Otomatik randevu', en: 'Auto scheduling' },
        { tr: 'İlaç hatırlatma', en: 'Medication reminders' }
      ],
      integrations: ['WhatsApp', 'SMS', 'Email', 'EHR'],
      estimatedTime: '2-3 hafta / weeks'
    }
  },
  {
    id: 'ecommerce',
    industry: {
      tr: 'E-Ticaret',
      en: 'E-Commerce'
    },
    icon: '🛒',
    features: [
      { id: 'recommend', name: { tr: 'Ürün Önerileri', en: 'Product Recommendations' }, icon: '🎯' },
      { id: 'support', name: { tr: 'Müşteri Desteği', en: 'Customer Support' }, icon: '💬' },
      { id: 'order', name: { tr: 'Sipariş Takibi', en: 'Order Tracking' }, icon: '📦' },
      { id: 'cart', name: { tr: 'Sepet Kurtarma', en: 'Cart Recovery' }, icon: '🛍️' }
    ],
    result: {
      name: { tr: 'ShopAssist AI', en: 'ShopAssist AI' },
      capabilities: [
        { tr: 'Kişiselleştirilmiş öneriler', en: 'Personalized recommendations' },
        { tr: 'Anlık sipariş durumu', en: 'Real-time order status' },
        { tr: 'Sepet hatırlatma', en: 'Cart reminders' }
      ],
      integrations: ['Shopify', 'WooCommerce', 'WhatsApp', 'Instagram'],
      estimatedTime: '1-2 hafta / weeks'
    }
  },
  {
    id: 'realestate',
    industry: {
      tr: 'Emlak',
      en: 'Real Estate'
    },
    icon: '🏠',
    features: [
      { id: 'listing', name: { tr: 'İlan Yönetimi', en: 'Listing Management' }, icon: '📋' },
      { id: 'virtual', name: { tr: 'Sanal Tur', en: 'Virtual Tours' }, icon: '🎥' },
      { id: 'lead', name: { tr: 'Lead Toplama', en: 'Lead Generation' }, icon: '🎯' },
      { id: 'schedule', name: { tr: 'Görüntüleme Planı', en: 'Viewing Schedule' }, icon: '📅' }
    ],
    result: {
      name: { tr: 'RealtyBot', en: 'RealtyBot' },
      capabilities: [
        { tr: 'Otomatik lead nitelendirme', en: 'Auto lead qualification' },
        { tr: '360° tur paylaşımı', en: '360° tour sharing' },
        { tr: 'Randevu otomasyonu', en: 'Appointment automation' }
      ],
      integrations: ['WhatsApp', 'Sahibinden', 'Hepsiemlak', 'CRM'],
      estimatedTime: '2-3 hafta / weeks'
    }
  },
  {
    id: 'education',
    industry: {
      tr: 'Eğitim',
      en: 'Education'
    },
    icon: '📚',
    features: [
      { id: 'tutor', name: { tr: 'AI Öğretmen', en: 'AI Tutor' }, icon: '🎓' },
      { id: 'quiz', name: { tr: 'Quiz Oluşturma', en: 'Quiz Generation' }, icon: '❓' },
      { id: 'progress', name: { tr: 'İlerleme Takibi', en: 'Progress Tracking' }, icon: '📈' },
      { id: 'parent', name: { tr: 'Veli Bilgilendirme', en: 'Parent Updates' }, icon: '👨‍👩‍👧' }
    ],
    result: {
      name: { tr: 'EduMentor AI', en: 'EduMentor AI' },
      capabilities: [
        { tr: 'Kişiselleştirilmiş öğrenme', en: 'Personalized learning' },
        { tr: 'Otomatik değerlendirme', en: 'Auto assessment' },
        { tr: 'Veli raporları', en: 'Parent reports' }
      ],
      integrations: ['LMS', 'WhatsApp', 'Google Classroom', 'Zoom'],
      estimatedTime: '3-4 hafta / weeks'
    }
  }
];

// Custom AI UI translations
export const customAIUIText = {
  tr: {
    headerTitle: 'Allync AI',
    selectIndustry: 'Sektörünüzü Seçin',
    selectFeatures: 'Özellik Seçin',
    building: 'AI Çözümünüz Oluşturuluyor...',
    buildingDesc: 'Özel ihtiyaçlarınıza göre yapılandırılıyor',
    complete: 'Çözümünüz Hazır!',
    capabilities: 'Yetenekler',
    integrations: 'Entegrasyonlar',
    timeline: 'Tahmini Süre',
    restart: 'Yeni Çözüm Oluştur',
    contact: 'Teklif Al',
    analyzing: 'İhtiyaçlar analiz ediliyor...',
    configuring: 'AI modeli yapılandırılıyor...',
    integrating: 'Entegrasyonlar hazırlanıyor...',
    testing: 'Test senaryoları oluşturuluyor...',
    featuresSelected: 'özellik seçildi',
    continue: 'Devam Et'
  },
  en: {
    headerTitle: 'Allync AI',
    selectIndustry: 'Select Your Industry',
    selectFeatures: 'Select Features',
    building: 'Building Your AI Solution...',
    buildingDesc: 'Configuring for your specific needs',
    complete: 'Your Solution is Ready!',
    capabilities: 'Capabilities',
    integrations: 'Integrations',
    timeline: 'Estimated Timeline',
    restart: 'Create New Solution',
    contact: 'Get Quote',
    analyzing: 'Analyzing requirements...',
    configuring: 'Configuring AI model...',
    integrating: 'Preparing integrations...',
    testing: 'Creating test scenarios...',
    featuresSelected: 'features selected',
    continue: 'Continue'
  }
};
