// Data Analysis AI Demo Scenarios - TR/EN

export interface DataAnalysisDemoScenario {
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
  metrics: {
    label: { tr: string; en: string };
    value: string;
    change: string;
    isPositive: boolean;
  }[];
  chartType: 'line' | 'bar' | 'pie' | 'area';
  insightCount: number;
}

export const dataAnalysisDemoScenarios: DataAnalysisDemoScenario[] = [
  {
    id: 'sales-analytics',
    title: {
      tr: 'Satış Analizi',
      en: 'Sales Analytics'
    },
    icon: '💰',
    description: {
      tr: 'Satış verilerinizi analiz edin, trendleri keşfedin ve gelecek tahminleri alın.',
      en: 'Analyze your sales data, discover trends and get future predictions.'
    },
    metrics: [
      { label: { tr: 'Toplam Satış', en: 'Total Sales' }, value: '₺2.4M', change: '+23%', isPositive: true },
      { label: { tr: 'Ortalama Sipariş', en: 'Avg Order' }, value: '₺847', change: '+12%', isPositive: true },
      { label: { tr: 'Dönüşüm Oranı', en: 'Conversion' }, value: '4.2%', change: '+0.8%', isPositive: true }
    ],
    chartType: 'line',
    insightCount: 5
  },
  {
    id: 'customer-behavior',
    title: {
      tr: 'Müşteri Davranışı',
      en: 'Customer Behavior'
    },
    icon: '👥',
    description: {
      tr: 'Müşteri segmentasyonu, satın alma kalıpları ve sadakat analizi.',
      en: 'Customer segmentation, purchase patterns and loyalty analysis.'
    },
    metrics: [
      { label: { tr: 'Aktif Müşteri', en: 'Active Users' }, value: '12.5K', change: '+18%', isPositive: true },
      { label: { tr: 'Elde Tutma', en: 'Retention' }, value: '67%', change: '+5%', isPositive: true },
      { label: { tr: 'NPS Skoru', en: 'NPS Score' }, value: '72', change: '+8', isPositive: true }
    ],
    chartType: 'pie',
    insightCount: 4
  },
  {
    id: 'financial-report',
    title: {
      tr: 'Finansal Rapor',
      en: 'Financial Report'
    },
    icon: '📊',
    description: {
      tr: 'Gelir-gider analizi, nakit akışı tahmini ve bütçe optimizasyonu.',
      en: 'Revenue-expense analysis, cash flow forecast and budget optimization.'
    },
    metrics: [
      { label: { tr: 'Net Gelir', en: 'Net Revenue' }, value: '₺1.8M', change: '+15%', isPositive: true },
      { label: { tr: 'Kar Marjı', en: 'Profit Margin' }, value: '24%', change: '+3%', isPositive: true },
      { label: { tr: 'Gider Oranı', en: 'Expense Ratio' }, value: '32%', change: '-4%', isPositive: true }
    ],
    chartType: 'bar',
    insightCount: 6
  },
  {
    id: 'marketing-performance',
    title: {
      tr: 'Pazarlama Performansı',
      en: 'Marketing Performance'
    },
    icon: '📈',
    description: {
      tr: 'Kampanya analizi, ROI hesaplama ve kanal performans karşılaştırması.',
      en: 'Campaign analysis, ROI calculation and channel performance comparison.'
    },
    metrics: [
      { label: { tr: 'Reklam ROI', en: 'Ad ROI' }, value: '340%', change: '+45%', isPositive: true },
      { label: { tr: 'Tıklama Oranı', en: 'CTR' }, value: '3.8%', change: '+0.6%', isPositive: true },
      { label: { tr: 'Lead Maliyeti', en: 'Cost/Lead' }, value: '₺42', change: '-18%', isPositive: true }
    ],
    chartType: 'area',
    insightCount: 5
  }
];

// Data Analysis UI translations
export const dataAnalysisUIText = {
  tr: {
    headerTitle: 'Allync AI',
    selectScenario: 'Analiz Türü Seçin',
    analyzing: 'Analiz Ediliyor...',
    analyzingDesc: 'AI verilerinizi işliyor',
    complete: 'Analiz Tamamlandı!',
    metrics: 'Temel Metrikler',
    insights: 'AI Öngörüleri',
    chart: 'Görselleştirme',
    restart: 'Başka Analiz Yap',
    contact: 'İletişime Geç',
    loading: 'Veriler yükleniyor...',
    processing: 'İstatistikler hesaplanıyor...',
    generating: 'Öngörüler oluşturuluyor...',
    visualizing: 'Grafikler hazırlanıyor...',
    insight1: 'Satışlar geçen aya göre %23 arttı',
    insight2: 'En yoğun satış saati: 14:00-16:00',
    insight3: 'Mobil kullanıcılar %45 daha fazla harcıyor',
    insight4: 'Müşteri kaybı riski: 12 hesap tespit edildi',
    insight5: 'Öneri: Hafta sonu kampanyaları %30 daha etkili'
  },
  en: {
    headerTitle: 'Allync AI',
    selectScenario: 'Select Analysis Type',
    analyzing: 'Analyzing...',
    analyzingDesc: 'AI is processing your data',
    complete: 'Analysis Complete!',
    metrics: 'Key Metrics',
    insights: 'AI Insights',
    chart: 'Visualization',
    restart: 'Run Another Analysis',
    contact: 'Contact Us',
    loading: 'Loading data...',
    processing: 'Calculating statistics...',
    generating: 'Generating insights...',
    visualizing: 'Preparing charts...',
    insight1: 'Sales increased 23% compared to last month',
    insight2: 'Peak sales hours: 2:00 PM - 4:00 PM',
    insight3: 'Mobile users spend 45% more',
    insight4: 'Churn risk: 12 accounts identified',
    insight5: 'Tip: Weekend campaigns are 30% more effective'
  }
};
