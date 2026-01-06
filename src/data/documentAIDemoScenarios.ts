// Document AI Demo Scenarios - TR/EN

export interface DocumentField {
  label: {
    tr: string;
    en: string;
  };
  value: string;
  confidence: number;
}

export interface DocumentAIDemoScenario {
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
  documentType: {
    tr: string;
    en: string;
  };
  extractedFields: DocumentField[];
  processingTime: string;
  accuracy: string;
}

export const documentAIDemoScenarios: DocumentAIDemoScenario[] = [
  {
    id: 'invoice',
    title: {
      tr: 'Fatura İşleme',
      en: 'Invoice Processing'
    },
    icon: '🧾',
    description: {
      tr: 'Faturaları otomatik okuyun ve verileri çıkarın',
      en: 'Automatically read invoices and extract data'
    },
    documentType: {
      tr: 'Fatura',
      en: 'Invoice'
    },
    extractedFields: [
      { label: { tr: 'Fatura No', en: 'Invoice No' }, value: 'INV-2024-0847', confidence: 99 },
      { label: { tr: 'Tarih', en: 'Date' }, value: '14.12.2024', confidence: 98 },
      { label: { tr: 'Firma', en: 'Company' }, value: 'Allync Teknoloji A.Ş.', confidence: 97 },
      { label: { tr: 'Toplam Tutar', en: 'Total Amount' }, value: '₺24,850.00', confidence: 99 },
      { label: { tr: 'KDV', en: 'VAT' }, value: '₺4,473.00', confidence: 98 }
    ],
    processingTime: '1.2s',
    accuracy: '98.5%'
  },
  {
    id: 'contract',
    title: {
      tr: 'Sözleşme Analizi',
      en: 'Contract Analysis'
    },
    icon: '📋',
    description: {
      tr: 'Sözleşmelerdeki önemli maddeleri tespit edin',
      en: 'Identify key clauses in contracts'
    },
    documentType: {
      tr: 'Sözleşme',
      en: 'Contract'
    },
    extractedFields: [
      { label: { tr: 'Sözleşme Türü', en: 'Contract Type' }, value: 'Hizmet Sözleşmesi', confidence: 96 },
      { label: { tr: 'Taraflar', en: 'Parties' }, value: 'ABC Ltd. - XYZ A.Ş.', confidence: 95 },
      { label: { tr: 'Başlangıç', en: 'Start Date' }, value: '01.01.2026', confidence: 99 },
      { label: { tr: 'Bitiş', en: 'End Date' }, value: '31.12.2026', confidence: 99 },
      { label: { tr: 'Değer', en: 'Value' }, value: '₺150,000.00', confidence: 97 }
    ],
    processingTime: '2.8s',
    accuracy: '96.2%'
  },
  {
    id: 'id-card',
    title: {
      tr: 'Kimlik Doğrulama',
      en: 'ID Verification'
    },
    icon: '🪪',
    description: {
      tr: 'Kimlik belgelerini hızlıca doğrulayın',
      en: 'Quickly verify identity documents'
    },
    documentType: {
      tr: 'Kimlik Kartı',
      en: 'ID Card'
    },
    extractedFields: [
      { label: { tr: 'Ad Soyad', en: 'Full Name' }, value: 'Ahmet Yılmaz', confidence: 99 },
      { label: { tr: 'TC Kimlik No', en: 'ID Number' }, value: '123*****890', confidence: 99 },
      { label: { tr: 'Doğum Tarihi', en: 'Birth Date' }, value: '15.03.1990', confidence: 98 },
      { label: { tr: 'Geçerlilik', en: 'Valid Until' }, value: '2030', confidence: 97 },
      { label: { tr: 'Doğrulama', en: 'Verification' }, value: '✓ Geçerli', confidence: 99 }
    ],
    processingTime: '0.8s',
    accuracy: '99.1%'
  },
  {
    id: 'receipt',
    title: {
      tr: 'Fiş Tarama',
      en: 'Receipt Scanning'
    },
    icon: '🧾',
    description: {
      tr: 'Alışveriş fişlerini dijitalleştirin',
      en: 'Digitize shopping receipts'
    },
    documentType: {
      tr: 'Fiş',
      en: 'Receipt'
    },
    extractedFields: [
      { label: { tr: 'Mağaza', en: 'Store' }, value: 'Migros', confidence: 98 },
      { label: { tr: 'Tarih', en: 'Date' }, value: '14.12.2024 15:32', confidence: 97 },
      { label: { tr: 'Ürün Sayısı', en: 'Items' }, value: '12 ürün', confidence: 95 },
      { label: { tr: 'Ara Toplam', en: 'Subtotal' }, value: '₺847.50', confidence: 98 },
      { label: { tr: 'Toplam', en: 'Total' }, value: '₺892.45', confidence: 99 }
    ],
    processingTime: '0.6s',
    accuracy: '97.4%'
  }
];

// Document AI UI translations
export const documentAIUIText = {
  tr: {
    headerTitle: 'Allync AI',
    selectScenario: 'Belge Türü Seçin',
    uploadPrompt: 'Belge Yükleniyor',
    processing: 'İşleniyor...',
    processingDesc: 'Belge analiz ediliyor',
    complete: 'Analiz Tamamlandı!',
    documentType: 'Belge Türü',
    processingTime: 'İşlem Süresi',
    accuracy: 'Doğruluk',
    extractedData: 'Çıkarılan Veriler',
    confidence: 'Güven',
    restart: 'Başka Belge Tara',
    contact: 'İletişime Geç',
    scanning: 'Belge taranıyor...',
    detecting: 'Metin algılanıyor...',
    extracting: 'Veriler çıkarılıyor...',
    validating: 'Doğrulama yapılıyor...'
  },
  en: {
    headerTitle: 'Allync AI',
    selectScenario: 'Select Document Type',
    uploadPrompt: 'Uploading Document',
    processing: 'Processing...',
    processingDesc: 'Analyzing document',
    complete: 'Analysis Complete!',
    documentType: 'Document Type',
    processingTime: 'Processing Time',
    accuracy: 'Accuracy',
    extractedData: 'Extracted Data',
    confidence: 'Confidence',
    restart: 'Scan Another Document',
    contact: 'Contact Us',
    scanning: 'Scanning document...',
    detecting: 'Detecting text...',
    extracting: 'Extracting data...',
    validating: 'Validating results...'
  }
};
