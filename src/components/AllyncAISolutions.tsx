import React from 'react';
import { MessageCircle, Instagram, Video, Image as ImageIcon, Mic, FileText, Play, Film, BarChart3, Sparkles } from 'lucide-react';
import { translations } from '../utils/translations';
import { SolutionsPage, Service } from './SolutionsPage';
import waImg1 from '../assets/gallery/wa/1.png';
import waImg2 from '../assets/gallery/wa/2.png';
import waImg3 from '../assets/gallery/wa/3.png';

interface AllyncAISolutionsProps {
  language: 'tr' | 'en';
}

export const AllyncAISolutions: React.FC<AllyncAISolutionsProps> = ({ language }) => {
  const t = translations[language];

  const services: Service[] = [
    {
      icon: MessageCircle,
      title: t.waAutomation,
      description: t.waAutomationDesc,
      benefits: t.waAutomationBenefits,
      gradient: 'from-green-500 to-emerald-600',
      glowColor: 'rgba(34, 197, 94, 0.5)',
      extendedContent: 'WhatsApp Automation ile işletmeniz 7/24 müşterilerinize anında yanıt verebilir. Gelişmiş yapay zeka teknolojisi sayesinde müşteri sorgularını anlayıp, randevu oluşturabilir, sık sorulan soruları yanıtlayabilir ve müşteri memnuniyetini artırabilirsiniz.\n\nÖzellikler:\n- Otomatik müşteri hizmetleri\n- Randevu yönetim sistemi\n- Çoklu dil desteği\n- CRM entegrasyonu\n- Detaylı raporlama ve analitik\n\nBu hizmet ile işletmeniz operasyonel maliyetleri düşürürken müşteri memnuniyetini maksimize edebilir.',
      galleryImages: [waImg1, waImg2, waImg3],
      demoType: 'whatsapp',
      audioSrc: language === 'en' ? '/audio/en/english-whatsapp-automations.mp3' : undefined,
      subtitles: language === 'en' ? [
        { start: 0, text: "Imagine never missing" },
        { start: 1.2, text: "a customer message again." },
        { start: 3, text: "With Allync" },
        { start: 4, text: "WhatsApp Automation," },
        { start: 5, text: "your business stays" },
        { start: 6.2, text: "connected twenty-four seven." },
        { start: 8, text: "Even while" },
        { start: 9, text: "you sleep." },
        { start: 11, text: "Our intelligent AI chatbot" },
        { start: 12.5, text: "understands your customers," },
        { start: 14, text: "answers their questions instantly," },
        { start: 16, text: "books appointments automatically," },
        { start: 18, text: "and handles inquiries" },
        { start: 19.5, text: "in multiple languages." },
        { start: 22, text: "No more overwhelmed staff." },
        { start: 24, text: "No more delayed responses." },
        { start: 26, text: "No more lost opportunities." },
        { start: 28, text: "Your customers get" },
        { start: 29.5, text: "instant satisfaction." },
        { start: 32, text: "You get more sales," },
        { start: 33.5, text: "happier clients," },
        { start: 34.5, text: "and precious time" },
        { start: 35.5, text: "back in your day." },
        { start: 37, text: "From small businesses" },
        { start: 38.5, text: "to large enterprises," },
        { start: 40, text: "Allync WhatsApp Automation" },
        { start: 42, text: "transforms how" },
        { start: 43, text: "you communicate." },
        { start: 44, text: "Ready to automate" },
        { start: 45.5, text: "your success?" },
        { start: 47, text: "Allync." },
        { start: 48, text: "Where AI meets business." },
        { start: 50, text: "..." },
      ] : undefined,
    },
    {
      icon: Instagram,
      title: t.instagramAutomation,
      description: t.instagramAutomationDesc,
      benefits: t.instagramAutomationBenefits,
      gradient: 'from-pink-500 to-purple-600',
      glowColor: 'rgba(236, 72, 153, 0.5)',
      extendedContent: 'Instagram Automation ile sosyal medya yönetiminizi otomatikleştirin. DM\'lere otomatik yanıt verin, yorumları yönetin ve potansiyel müşterileri yakalayın.\n\nÖzellikler:\n- Otomatik DM yanıtları\n- Yorum yönetimi\n- Hashtag analizi\n- Etkileşim raporları\n- Lead generation\n\nSosyal medya varlığınızı güçlendirin ve etkileşiminizi artırın.',
      galleryImages: ['Instagram Dashboard', 'Auto-Reply System', 'Engagement Analytics'],
      demoType: 'instagram',
    },
    {
      icon: Video,
      title: t.textToVideo,
      description: t.textToVideoDesc,
      benefits: t.textToVideoBenefits,
      gradient: 'from-blue-500 to-cyan-600',
      glowColor: 'rgba(59, 130, 246, 0.5)',
      extendedContent: 'Text-to-Video AI ile metinlerinizi profesyonel videolara dönüştürün. Pazarlama içeriklerinizi, eğitim materyallerinizi veya sosyal medya gönderilerinizi birkaç dakika içinde video formatına çevirin.\n\nÖzellikler:\n- Otomatik video oluşturma\n- Çoklu format desteği (4K, HD)\n- Voiceover entegrasyonu\n- Özel template\'ler\n- Hızlı render\n\nİçerik üretiminizi hızlandırın ve profesyonel videolar oluşturun.',
      galleryImages: ['Video Editor Interface', 'Template Gallery', 'Export Options'],
      demoType: 'text-to-video',
    },
    {
      icon: ImageIcon,
      title: t.textToImage,
      description: t.textToImageDesc,
      benefits: t.textToImageBenefits,
      gradient: 'from-violet-500 to-purple-600',
      glowColor: 'rgba(139, 92, 246, 0.5)',
      extendedContent: 'Text-to-Image AI ile hayal ettiğiniz görselleri oluşturun. Marketing materyalleri, sosyal medya içerikleri veya web tasarımı için benzersiz görseller üretin.\n\nÖzellikler:\n- Yüksek çözünürlüklü görsel üretimi\n- Çoklu stil seçenekleri\n- Ticari kullanım hakları\n- Toplu üretim\n- API entegrasyonu\n\nYaratıcılığınızı sınırsız hale getirin.',
      galleryImages: ['AI Image Generator', 'Style Options', 'Generated Gallery'],
      demoType: 'text-to-image',
    },
    {
      icon: Mic,
      title: t.voiceCloning,
      description: t.voiceCloningDesc,
      benefits: t.voiceCloningBenefits,
      gradient: 'from-orange-500 to-red-600',
      glowColor: 'rgba(249, 115, 22, 0.5)',
      extendedContent: 'Voice Cloning teknolojisi ile gerçekçi ses klonları oluşturun. Sesli asistanlar, reklam seslendirmeleri veya eğitim içerikleri için profesyonel ses üretimi.\n\nÖzellikler:\n- Gerçekçi ses klonlama\n- Çoklu dil ve aksan desteği\n- Emotion control\n- Hızlı üretim\n- Yüksek kalite\n\nSeslendirme projelerinizi bir üst seviyeye taşıyın.',
      galleryImages: ['Voice Studio', 'Cloning Interface', 'Audio Library'],
      demoType: 'voice-cloning',
    },
    {
      icon: FileText,
      title: t.documentAI,
      description: t.documentAIDesc,
      benefits: t.documentAIBenefits,
      gradient: 'from-gray-500 to-gray-700',
      glowColor: 'rgba(107, 114, 128, 0.5)',
      extendedContent: 'Document AI ile belgelerinizi otomatik olarak işleyin ve analiz edin. OCR, veri çıkarma ve akıllı kategorizasyon özellikleri ile iş süreçlerinizi hızlandırın.\n\nÖzellikler:\n- OCR ve metin tanıma\n- Otomatik veri çıkarma\n- Belge sınıflandırma\n- Doğrulama ve onay\n- Güvenli depolama\n\nDokümantasyon süreçlerinizi dijitalleştirin.',
      galleryImages: ['Document Scanner', 'Data Extraction', 'Classification System'],
      demoType: 'document-ai',
    },
    {
      icon: Play,
      title: t.imageToVideo,
      description: t.imageToVideoDesc,
      benefits: t.imageToVideoBenefits,
      gradient: 'from-teal-500 to-cyan-600',
      glowColor: 'rgba(20, 184, 166, 0.5)',
      extendedContent: 'Image-to-Video AI ile statik görsellerinizi dinamik içeriğe dönüştürün. AI destekli animasyonlar ve efektler ile sosyal medya içeriklerinizi canlandırın.\n\nÖzellikler:\n- Otomatik animasyon\n- Transition efektleri\n- Music ve ses ekleme\n- Sosyal medya formatları\n- Toplu işlem\n\nGörsellerinize hayat verin.',
      galleryImages: ['Animation Studio', 'Effect Library', 'Preview Screen']
    },
    {
      icon: Film,
      title: t.videoToVideo,
      description: t.videoToVideoDesc,
      benefits: t.videoToVideoBenefits,
      gradient: 'from-indigo-500 to-blue-600',
      glowColor: 'rgba(99, 102, 241, 0.5)',
      extendedContent: 'Video-to-Video AI ile videolarınızı dönüştürün. Stil transferi, yüz değiştirme ve gelişmiş düzenleme özellikleri ile videolarınızı yeniden oluşturun.\n\nÖzellikler:\n- AI video dönüşümü\n- Stil transferi\n- Kalite iyileştirme\n- Renklendir ve restorasy\n- Toplu düzenleme\n\nVideo üretim sürecinizi optimize edin.',
      galleryImages: ['Video Editor', 'Style Transfer', 'Enhancement Tools']
    },
    {
      icon: BarChart3,
      title: t.dataAnalysisAI,
      description: t.dataAnalysisAIDesc,
      benefits: t.dataAnalysisAIBenefits,
      gradient: 'from-yellow-500 to-orange-600',
      glowColor: 'rgba(245, 158, 11, 0.5)',
      extendedContent: 'Data Analysis AI ile büyük veri setlerinizi analiz edin ve değerli içgörüler elde edin. Tahmine dayalı analizler ve görselleştirme araçları ile iş kararlarınızı destekleyin.\n\nÖzellikler:\n- Büyük veri analizi\n- Tahmine dayalı modeller\n- Görselleştirme araçları\n- Otomatik raporlama\n- Real-time analytics\n\nVeriye dayalı kararlar alın.',
      galleryImages: ['Analytics Dashboard', 'Data Visualization', 'Report Generator']
    },
    {
      icon: Sparkles,
      title: t.customAISolutions,
      description: t.customAISolutionsDesc,
      benefits: t.customAISolutionsBenefits,
      gradient: 'from-fuchsia-500 to-pink-600',
      glowColor: 'rgba(217, 70, 239, 0.5)',
      extendedContent: 'Custom AI Solutions ile işletmenize özel yapay zeka çözümleri geliştirin. İhtiyaçlarınıza göre özelleştirilmiş AI sistemleri ile rekabet avantajı elde edin.\n\nÖzellikler:\n- Tam özelleştirilebilir\n- İş süreçlerine entegrasyon\n- Özel model eğitimi\n- Dedicated destek\n- Scalable altyapı\n\nHayalinizdeki AI çözümünü gerçekleştirin.',
      galleryImages: ['Custom AI Platform', 'Integration Options', 'Training Dashboard']
    }
  ];

  const flipWords = [
    language === 'tr' ? "WhatsApp Otomasyonu" : "WhatsApp Automation",
    language === 'tr' ? "Yapay Zeka Çözümleri" : "AI Solutions",
    language === 'tr' ? "Ses Klonlama" : "Voice Cloning",
    language === 'tr' ? "Görsel AI" : "Vision AI"
  ];

  return (
    <SolutionsPage
      language={language}
      services={services}
      pageTitle="Allync AI"
      pageSubtitle={t.aiSolutionSubtitle}
      flipWords={flipWords}
      ctaButtonGradient="from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:shadow-purple-500/50"
    />
  );
};
