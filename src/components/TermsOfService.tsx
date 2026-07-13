import React, { useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HelmetProvider } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ArrowLeft, FileText, BookOpen, Briefcase, UserCheck, Users, Ban,
  Copyright, Globe, RefreshCw, CreditCard, Shield, Cpu, AlertTriangle,
  Scale, LogOut, Gavel, Edit3, Layers, Mail, Monitor
} from 'lucide-react';
import logo from '../assets/logo.svg';

const FloatingLines = React.lazy(() => import('./ui/FloatingLines'));

interface Section {
  icon: React.FC<{ className?: string }>;
  heading: string;
  content: React.ReactNode;
}

const SectionCard: React.FC<{ section: Section; index: number }> = ({ section, index }) => {
  const IconComponent = section.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.03 }}
      className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5 sm:p-8 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#547792]/20 to-[#94B4C1]/20 border border-[#547792]/30 rounded-xl flex items-center justify-center">
          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-[#94B4C1]" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
            {section.heading}
          </h2>
          <div className="text-gray-400 leading-relaxed text-sm sm:text-base space-y-3">
            {section.content}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DataTable: React.FC<{ headers: string[]; rows: string[][] }> = ({ headers, rows }) => (
  <div className="overflow-x-auto mt-3">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-white/10">
          {headers.map((h, i) => (
            <th key={i} className="text-left py-2 pr-4 text-gray-300 font-medium text-xs sm:text-sm">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-white/5">
            {row.map((cell, j) => (
              <td key={j} className="py-2 pr-4 text-gray-400 text-xs sm:text-sm">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const BulletList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="space-y-1.5">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2">
        <span className="text-[#94B4C1] mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#94B4C1]" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const SubHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-white font-medium text-sm sm:text-base mt-4 mb-2">{children}</h3>
);

const Notice: React.FC<{ tone?: 'warning' | 'info'; children: React.ReactNode }> = ({ tone = 'info', children }) => (
  <div className={`mt-3 rounded-xl p-4 border ${tone === 'warning' ? 'bg-amber-500/[0.05] border-amber-500/20 text-amber-100/90' : 'bg-white/[0.03] border-white/[0.08] text-gray-300'}`}>
    {children}
  </div>
);

export const TermsOfService: React.FC = () => {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const sections: Section[] = language === 'tr' ? [
    {
      icon: FileText,
      heading: '1. Giriş ve Şartların Kabulü',
      content: (
        <>
          <p>Allync ("biz", "bizim", "Allync", "AllyncAI") platformuna ve hizmetlerine hoş geldiniz. Bu Hizmet Şartları ("Şartlar"), web sitemizi (allyncai.com), WhatsApp Business API ve Instagram Business mesajlaşma hizmetlerimizi, yapay zeka destekli asistanlarımızı, SaaS panellerimizi, mobil uygulamalarımızı, özel yazılım geliştirme hizmetlerimizi ve sunduğumuz tüm dijital hizmetleri (toplu olarak "Hizmetler") kullanımınızı düzenler.</p>
          <p className="text-gray-300 bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 mt-3">Hizmetlere kayıt olarak, hesabınıza erişerek veya Hizmetleri kullanarak bu Şartları, Gizlilik Politikamızı ve atıfta bulunulan tüm ek politikaları okuduğunuzu, anladığınızı ve bunlara hukuki olarak bağlı olmayı kabul ettiğinizi beyan edersiniz. Şartları kabul etmiyorsanız Hizmetleri kullanmamalısınız.</p>
          <p>ALLYNC, Türkiye Cumhuriyeti yasalarına göre kurulu, Tescil No <strong>8950466196</strong> ile kayıtlı, merkezi Yeni Mah. Sefer Sk. No:1 İç Kapı No:1 İnegöl/Bursa adresinde bulunan bir teknoloji şirketidir. Allyncai, ALLYNC'in tescilli markasıdır. ALLYNC, Meta Platforms, Inc. tarafından <strong>Doğrulanmış Teknoloji Sağlayıcı (Verified Tech Provider)</strong> olarak yetkilendirilmiştir.</p>
        </>
      )
    },
    {
      icon: BookOpen,
      heading: '2. Tanımlar',
      content: (
        <>
          <DataTable
            headers={['Terim', 'Tanım']}
            rows={[
              ['"ALLYNC", "biz", "bizim", "Hizmet Sağlayıcı"', 'ALLYNC ve tescilli markası Allyncai'],
              ['"Hizmetler"', 'Allync tarafından sunulan tüm dijital ürün, platform, API ve danışmanlık hizmetleri'],
              ['"Kullanıcı", "Tenant", "İşletme Yöneticisi"', 'Hizmetlere abone olan tüzel kişi (şirket) veya bu şirket adına yetkilendirilmiş kişi'],
              ['"Son Kullanıcı"', 'Kullanıcının müşterisi olan ve WhatsApp/Instagram üzerinden Kullanıcı ile etkileşime giren kişi'],
              ['"İçerik"', 'Hizmetlere yüklenen, oluşturulan veya iletilen tüm metin, görsel, ses, video, belge ve veri'],
              ['"Meta"', 'Meta Platforms, Inc. (WhatsApp, Instagram, Facebook ana şirketi)'],
              ['"AI Çıktısı"', 'Yapay zeka modelleri tarafından oluşturulan tüm yanıt, sınıflandırma, transkript ve çıktılar'],
              ['"Veri Sorumlusu / Veri İşleyen"', 'KVKK ve GDPR\'da tanımlanan rollerdir; bu Şartlar kapsamında genellikle Kullanıcı Veri Sorumlusu, ALLYNC Veri İşleyendir'],
              ['"Doğrulanmış Teknoloji Sağlayıcı"', 'ALLYNC\'in Meta tarafından WhatsApp Business ve Instagram Business için aldığı resmi yetkilendirme statüsü'],
              ['"Ücret Mücbir Sebep"', 'ALLYNC kontrolü dışındaki olaylar (savaş, doğal afet, üçüncü taraf altyapı kesintisi, devlet kararı, vb.)']
            ]}
          />
        </>
      )
    },
    {
      icon: Briefcase,
      heading: '3. Hizmet Tanımı',
      content: (
        <>
          <p>Allync, işletmelere aşağıdaki ürün ve hizmetleri sunar:</p>
          <BulletList items={[
            'WhatsApp Business API üzerinde yapay zeka destekli müşteri hizmetleri asistanları (Meta Embedded Signup ile resmi onboarding)',
            'Instagram Graph API üzerinde DM otomasyonu ve yorum yanıtlama (asgari kapsamlı izinlerle)',
            'Çok kiracılı (multi-tenant) SaaS yönetim panelleri ve sektörel modüller',
            'Web sitesi, e-ticaret platformu ve mobil uygulama geliştirme',
            'Dijital pazarlama, SEO ve içerik üretimi danışmanlığı',
            'Duygu analizi, niyet sınıflandırması ve sesli mesaj transkripsiyonu (opsiyonel özellikler)',
            'CRM, ERP, takvim ve dosya servisleriyle entegrasyon',
            'Audit log, izleme ve denetim altyapısı'
          ]} />
          <p>Hizmetlerin kapsamı, sunum modeli ve özellik seti zaman içinde gelişebilir. Her Kullanıcı yalnızca abone olduğu plana, sözleşmeye veya proje teklifine dahil olan Hizmetlere erişim hakkına sahiptir.</p>
        </>
      )
    },
    {
      icon: UserCheck,
      heading: '4. Hesap Kaydı ve Uygunluk',
      content: (
        <>
          <SubHeading>4.1 Uygunluk</SubHeading>
          <BulletList items={[
            'Hizmetler yalnızca tüzel kişiler ve 18 yaşını doldurmuş ve sözleşme ehliyetine sahip kişiler tarafından kullanılabilir',
            'Bir tüzel kişi adına kayıt yapan kişi, o tüzel kişiyi bağlayıcı şekilde temsile yetkili olduğunu beyan eder',
            'Daha önce ALLYNC tarafından askıya alınmış veya feshedilmiş bir hesabı olan kişi/işletme tekrar kayıt yapamaz'
          ]} />
          <SubHeading>4.2 Doğru Bilgi Verme Yükümlülüğü</SubHeading>
          <BulletList items={[
            'Kayıt sırasında doğru, güncel ve eksiksiz bilgi vermek zorundasınız',
            'Şirket adı, vergi numarası, yetkili kişi, fatura adresi gibi bilgilerinizdeki değişiklikleri zamanında bildirmelisiniz',
            'ALLYNC, gerekli gördüğü hallerde kimlik ve yetki belgesi talep edebilir; doğrulanamayan hesaplar askıya alınabilir'
          ]} />
          <SubHeading>4.3 Hesap Güvenliği</SubHeading>
          <BulletList items={[
            'Şifre, API anahtarı ve oturum belirteçlerinizin gizliliğinden tamamen siz sorumlusunuz',
            'Çok faktörlü kimlik doğrulamayı (MFA) etkinleştirmenizi şiddetle tavsiye ederiz',
            'Yetkisiz erişim şüphesi durumunda derhal info@allyncai.com adresine bildirim yapın',
            'Hesabınızdaki tüm faaliyetlerden ve bu faaliyetlerin sonuçlarından siz sorumlusunuz'
          ]} />
        </>
      )
    },
    {
      icon: Users,
      heading: '5. Kullanıcı Sorumlulukları ve Yükümlülükleri',
      content: (
        <>
          <SubHeading>5.1 Yasal Uyumluluk</SubHeading>
          <BulletList items={[
            'Yürürlükteki tüm yasalara, KVKK, GDPR, Katar PDPPL ve diğer ilgili veri koruma mevzuatlarına uymakla yükümlüsünüz',
            'Meta\'nın WhatsApp Business Politikası, WhatsApp Ticari Politikası ve Instagram Platform Politikasına eksiksiz uymak Kullanıcının sorumluluğundadır',
            'Reklam, vergi, tüketici hakları ve sektörel düzenlemeler (sağlık, finans, eğitim) Kullanıcı tarafından gözetilir'
          ]} />
          <SubHeading>5.2 Veri Sorumlusu / Veri İşleyen Rolleri</SubHeading>
          <p>Hizmetler kapsamında işlenen Son Kullanıcı verileri için Kullanıcı <strong>Veri Sorumlusu (Data Controller)</strong>, ALLYNC ise <strong>Veri İşleyen (Data Processor)</strong> sıfatına sahiptir. Bu kapsamda Kullanıcı:</p>
          <BulletList items={[
            'Son Kullanıcılarına gerekli aydınlatma metnini sunmak',
            'AI ile otomatik mesajlaşma, duygu analizi, sesli mesaj transkripsiyonu için Son Kullanıcıdan açık rıza almak',
            'Mesajlaşma kanallarına yalnızca opt-in vermiş kişileri eklemek',
            'Son Kullanıcıların KVKK / GDPR kapsamındaki haklarını (erişim, silme, düzeltme) yanıtlamak'
          ]} />
          <SubHeading>5.3 İçerik Doğruluğu</SubHeading>
          <BulletList items={[
            'Hizmetlere yüklediğiniz tüm İçeriğin doğruluğundan, yasallığından ve fikri mülkiyet uygunluğundan siz sorumlusunuz',
            'Şablon, ürün bilgisi, fiyat ve hukuki bildirimler gibi kritik İçerikleri düzenli olarak gözden geçirmelisiniz'
          ]} />
          <SubHeading>5.4 AI Çıktısının Denetimi</SubHeading>
          <BulletList items={[
            'Yapay zeka tarafından üretilen yanıtlar zaman zaman hatalı, yanlı veya yanıltıcı olabilir (bkz. Bölüm 12)',
            'Sağlık, hukuk, finans ve güvenlik gibi kritik alanlarda AI Çıktısını otomatik göndermeden önce inceleme süreci kurmak Kullanıcının sorumluluğundadır',
            'Yanlış AI Çıktısı nedeniyle Son Kullanıcılara verilebilecek zararlardan ALLYNC sorumlu tutulamaz'
          ]} />
        </>
      )
    },
    {
      icon: Ban,
      heading: '6. Yasaklı Kullanım',
      content: (
        <>
          <p>Hizmetleri aşağıdaki amaçlarla kullanmak kesinlikle yasaktır:</p>
          <BulletList items={[
            'Spam, oltalama, dolandırıcılık veya istenmeyen pazarlama mesajları gönderme',
            'Hukuka aykırı içerik (uyuşturucu, silah, lisanssız kumar, çocuk istismarı, telif ihlali, vb.) iletme',
            'Nefret söylemi, taciz, iftira, tehdit veya ayrımcı içerik üretme',
            'Meta\'nın yasakladığı sektör veya içeriklerde kullanım (Meta\'nın güncel politikalarına bkz.)',
            'Meta\'nın 24 saatlik müşteri hizmetleri penceresini sahte konuşmalar başlatarak suistimal etme',
            'Sahibi olmadığınız üçüncü taraf verilerini kazıma (scraping) veya çıkarma',
            'Hizmetleri tersine mühendislik (reverse engineering) yapma, kaynak kodunu çıkarmaya çalışma',
            'API hız sınırlarını veya kullanım kotalarını sistematik olarak aşma',
            'ALLYNC\'in yazılı izni olmadan Hizmetleri yeniden satma, white-label etme veya alt-lisanslama',
            'Platforma, diğer Kullanıcılara veya Son Kullanıcılara zarar verecek kötü amaçlı yazılım, virüs veya istismar yükleme',
            'Diğer Kullanıcı veya Son Kullanıcı hesaplarına yetkisiz erişim girişiminde bulunma'
          ]} />
          <Notice tone="warning">
            <strong>Önemli:</strong> Bu maddenin ihlali derhal hesap askıya alma veya feshe yol açar; geri ödeme yapılmaz ve gerekli durumlarda yasal makamlara bildirim yapılır.
          </Notice>
        </>
      )
    },
    {
      icon: Copyright,
      heading: '7. Fikri Mülkiyet Hakları',
      content: (
        <>
          <SubHeading>7.1 ALLYNC Mülkiyeti</SubHeading>
          <BulletList items={[
            'Platform, kaynak kod, tasarım, kullanıcı arayüzü, görsel öğeler, dokümantasyon, eğitim materyalleri ve markalama tüm dünyada ALLYNC\'in mülkiyetindedir',
            '"ALLYNC" ve "Allyncai" tescilli markalardır',
            'ALLYNC tarafından geliştirilen veya iyileştirilen yapay zeka modelleri, prompt mühendisliği şablonları ve algoritmalar ALLYNC\'e aittir'
          ]} />
          <SubHeading>7.2 Kullanıcı İçeriği</SubHeading>
          <BulletList items={[
            'Hizmetlere yüklediğiniz İçeriğin mülkiyeti sizde kalır',
            'ALLYNC\'e, Hizmetleri sağlamak için gerekli olan sınırlı, dünya çapında, telif ücretsiz, devredilemez bir lisans verirsiniz',
            'Bu lisans yalnızca Hizmet sunumu, depolama, analiz ve istatistiklerin (anonimleştirilmiş şekilde) çıkarılması için geçerlidir; reklam veya yeniden satış için kullanılmaz'
          ]} />
          <SubHeading>7.3 AI Çıktısının Mülkiyeti</SubHeading>
          <BulletList items={[
            'Sizin için üretilen AI Çıktısı üzerinde, abonelik koşulları çerçevesinde ticari kullanım hakkına sahip olursunuz',
            'AI çıktısının mevcut bir telif hakkını ihlal etmediğinden emin olmak Kullanıcının sorumluluğundadır',
            'Üretilen çıktıların özgün olduğu garanti edilmez (örn. genel kalıplar, dünyadaki ortak ifadeler benzeyebilir)'
          ]} />
          <SubHeading>7.4 Geri Bildirim</SubHeading>
          <p>Bize gönderdiğiniz öneri, hata bildirimi veya geri bildirimleri (toplu olarak "Geri Bildirim") herhangi bir kısıtlama olmaksızın ürünümüzü iyileştirmek için kullanma hakkımız vardır.</p>
        </>
      )
    },
    {
      icon: Globe,
      heading: '8. Üçüncü Taraf Hizmetleri ve Entegrasyonlar',
      content: (
        <>
          <p>Hizmetlerimiz aşağıdaki üçüncü taraf platformlarla entegre çalışır:</p>
          <DataTable
            headers={['Üçüncü Taraf', 'Kullanım Amacı', 'Bağlayıcı Şartlar']}
            rows={[
              ['Meta Platforms', 'WhatsApp Business API & Instagram Graph API', 'Meta Ticari Şartları, WhatsApp Business Politikası, Instagram Platform Politikası'],
              ['Anthropic (Claude)', 'AI yanıt üretimi ve duygu analizi', 'Anthropic Hizmet Şartları (kurumsal API anlaşması)'],
              ['OpenAI', 'Sesli mesaj transkripsiyonu (Whisper) ve sesli yanıt (TTS)', 'OpenAI API Hizmet Şartları'],
              ['Google', 'Calendar, Sheets, Drive entegrasyonları (yetkilendirildiğinde)', 'Google API Hizmet Şartları'],
              ['Bulut altyapı sağlayıcıları', 'Barındırma ve veritabanı', 'İlgili sağlayıcı şartları'],
              ['Ödeme işlemcileri', 'Faturalandırma ve tahsilat (PCI DSS uyumlu)', 'İlgili sağlayıcı şartları']
            ]}
          />
          <BulletList items={[
            'Üçüncü taraf entegrasyonlarını kullanırken o platformların kendi şartlarına da uymakla yükümlüsünüz',
            'Üçüncü tarafın hizmet kesintisi, politika değişikliği veya hesap kapatma kararından ALLYNC sorumlu tutulamaz',
            'Meta dilediği zaman bir entegrasyonu askıya alabilir veya bir özelliği kaldırabilir',
            'ALLYNC, Meta Verified Tech Provider statüsüne sahip olmakla birlikte Meta\'nın ürünlerinin sahibi değildir; aracı / entegrasyon hizmeti sağlar'
          ]} />
        </>
      )
    },
    {
      icon: RefreshCw,
      heading: '9. Hizmet Kullanılabilirliği ve Değişiklikler',
      content: (
        <>
          <SubHeading>9.1 Kullanılabilirlik</SubHeading>
          <BulletList items={[
            'Hedef hizmet seviyesi (SLA): aylık %99,9 erişilebilirlik (planlı bakım hariç)',
            'Planlı bakım çalışmaları, mümkün olduğunda en az 24 saat öncesinden duyurulur',
            'Acil güvenlik yamaları için önceden bildirim yapılamayabilir; bu durumda mümkün olan en kısa sürede bilgilendirme yapılır'
          ]} />
          <SubHeading>9.2 Değişiklikler</SubHeading>
          <BulletList items={[
            'Hizmetlerin özellik setini, kullanıcı arayüzünü, fiyatlandırmasını ve teknik altyapısını güncelleme hakkımız saklıdır',
            'Önemli değişiklikler için makul ölçüde önceden bildirim yapılır',
            'Beta veya deneysel olarak işaretlenen özellikler önceden bildirim olmaksızın değişebilir, bozulabilir veya kaldırılabilir; üretim ortamında kritik süreçlerde kullanılması tavsiye edilmez'
          ]} />
          <SubHeading>9.3 Mücbir Sebepler</SubHeading>
          <p>Doğal afet, savaş, terör, salgın, devlet kararı, kamu hizmeti kesintisi, üçüncü taraf altyapı arızaları veya internet omurga kesintileri gibi makul kontrolümüz dışındaki olaylardan kaynaklanan kullanılamama durumlarından ALLYNC sorumlu tutulamaz.</p>
        </>
      )
    },
    {
      icon: CreditCard,
      heading: '10. Ücretler, Ödeme ve İade Politikası',
      content: (
        <>
          <SubHeading>10.1 Abonelik ve Proje Ücretleri</SubHeading>
          <BulletList items={[
            'Aylık veya yıllık abonelik ücretleri, seçtiğiniz plana göre tahsil edilir',
            'Özel yazılım geliştirme projeleri ayrı bir teklifle ücretlendirilir; ödeme genellikle kilometre taşları üzerinden yapılır',
            'AI kullanım tabanlı ücretler (mesaj sayısı, transkripsiyon dakikası, LLM token vb.) kullanım miktarına göre faturalanır',
            'Tüm ücretler TL veya USD cinsinden, KDV veya yerel vergiler hariç fiyatlanır; ilgili vergiler ayrıca eklenir'
          ]} />
          <SubHeading>10.2 Ödeme ve Geç Ödeme</SubHeading>
          <BulletList items={[
            'Ödeme, PCI DSS uyumlu işlemcilerle (iyzico, PayTR, Stripe vb.) gerçekleştirilir',
            'Aboneliklerde ödemenin gecikmesi durumunda 7 gün hatırlatma, sonrasında 15 gün ek süre verilir; süre sonunda hizmet askıya alınır',
            'Askıya alınmış hesabın yeniden aktivasyonunda yeniden bağlantı / yapılandırma ücreti talep edilebilir'
          ]} />
          <SubHeading>10.3 İADE POLİTİKASI — İADE YAPILMAZ</SubHeading>
          <Notice tone="warning">
            <p><strong>ALLYNC Hizmetleri için tahsil edilen tüm ücretler kesinlikle iade edilemez (non-refundable).</strong> Bu husus, abonelik dönemi başlamış olsun olmasın, tüm ödemeler için geçerlidir.</p>
          </Notice>
          <BulletList items={[
            'Özel yazılım geliştirme: Kabul edilen kilometre taşı için ödenen tutar iade edilmez',
            'Aylık / yıllık abonelikler: Erken iptal halinde kalan dönem için orantılı iade yapılmaz',
            'AI kullanım ücretleri: Tüketilen mesaj, token veya dakika için iade söz konusu değildir',
            'Eğitim, kurulum, danışmanlık ve özel hizmetler: Hizmetin tamamı veya bir kısmı sunulmuş ise iade edilmez',
            'Yalnızca yürürlükteki tüketici koruması mevzuatının emredici hükümleri (örn. KVKK\'nın belirli durumlarında) saklıdır'
          ]} />
          <SubHeading>10.4 Fiyat Değişiklikleri</SubHeading>
          <p>Fiyatlarımızı, en az 30 gün önceden bildirimde bulunarak güncelleme hakkımız saklıdır. Yeni fiyat, bildirimden sonraki ilk yenilenme döneminde geçerli olur. Yeni fiyatı kabul etmeyen Kullanıcı, yeni dönem başlamadan önce aboneliğini sonlandırabilir.</p>
        </>
      )
    },
    {
      icon: Shield,
      heading: '11. Veri Güvenliği ve Kullanıcı Sorumluluğu',
      content: (
        <>
          <SubHeading>11.1 ALLYNC\'in Sağladığı Güvenlik</SubHeading>
          <BulletList items={[
            'Aktarımda TLS 1.3, depolamada AES-256 şifreleme',
            'Yönetici hesapları için çok faktörlü kimlik doğrulama (MFA)',
            'Audit log: hassas tüm işlemler kayıt altına alınır (varsayılan 90 gün, tenant yapılandırılabilir)',
            'Düzenli sızma testleri ve güvenlik denetimleri',
            'SOC 2 Type II kontrol çerçevesine uyumlu altyapı kontrolleri',
            'KVKK, GDPR, Katar PDPPL ve ISO 27001 standartlarına uygun kontrol çerçevesi',
            '%99,9 erişilebilirlik SLA hedefi'
          ]} />
          <SubHeading>11.2 ALLYNC\'in Garantisi</SubHeading>
          <p>ALLYNC, sahip olduğu altyapı üzerinde verilerinizin <strong>aktarım ve depolama sırasında</strong> endüstri standartlarında güvenliğini sağlamayı taahhüt eder. Bu kapsamda:</p>
          <BulletList items={[
            'Sunucularımızda yetkisiz erişimi önlemek için makul tüm teknik ve idari tedbirler alınır',
            'Şifreli yedeklemeler düzenli olarak alınır',
            'Güvenlik açığı tespitinde 72 saat içinde KVKK / GDPR\'ın gerektirdiği bildirimler yapılır'
          ]} />
          <SubHeading>11.3 Kullanıcının Veri Sorumluluğu</SubHeading>
          <Notice tone="warning">
            <p><strong>Önemli:</strong> Aşağıdaki konularda sorumluluk Kullanıcıya aittir; ALLYNC bu konularda hiçbir taahhüt veya tazminat yükümlülüğü altında değildir.</p>
          </Notice>
          <BulletList items={[
            'Hesap kimlik bilgilerinin (şifre, API anahtarı, oturum tokenı) güvenli saklanması ve paylaşılmaması',
            'Kullanıcı tarafından silinen veya kasıtlı olarak temizlenen verilerin sonradan geri getirilmesi mümkün olmayabilir; silme işlemleri kalıcıdır',
            'WhatsApp veya Instagram bağlantısının kullanıcı tarafından kesilmesi durumunda, sonraki yeniden bağlantı isteğinde geçmiş veri ve konuşmalara erişim sağlanamayabilir',
            'Kullanıcının kendi sistemlerinden, cihazlarından veya çalışanlarından kaynaklı veri sızıntıları',
            'Kullanıcının yedek alma ve veri ihracat (data export) yükümlülüklerini yerine getirmemesi',
            'Kullanıcının Son Kullanıcılarına yönelik aydınlatma ve rıza yükümlülüklerini ihmal etmesi'
          ]} />
          <SubHeading>11.4 Veri Silme ve Geri Dönüş İmkânsızlığı</SubHeading>
          <BulletList items={[
            'Tenant yöneticisi panel üzerinden konuşma, mesaj veya tüm tenant\'ı silebilir',
            'Silme işlemi tamamlandıktan sonra veri kurtarma talepleri kabul edilmez',
            'Yedeklerimizden geri yükleme yalnızca ALLYNC kaynaklı bir veri kaybı durumunda yapılır; Kullanıcı kaynaklı silmeler bu kapsamın dışındadır',
            'Meta\'nın "Deauthorize" veya "Data Deletion Request" geri çağrıları, Kullanıcının veya Son Kullanıcının talebi üzerine tetiklendiğinde, ilgili veriler ALLYNC sistemlerinden silinir; geri dönüş mümkün değildir'
          ]} />
        </>
      )
    },
    {
      icon: Cpu,
      heading: '12. Yapay Zeka Çıktıları Hakkında Önemli Bildirim',
      content: (
        <>
          <p>Yapay zeka teknolojilerinin doğası gereği:</p>
          <BulletList items={[
            'AI Çıktısı bazen yanlış, yanıltıcı, eksik veya bağlamla uyumsuz olabilir ("halüsinasyon")',
            'Aynı girdiyle farklı zamanlarda farklı çıktılar üretilebilir',
            'AI Çıktısı yasal, tıbbi, mali, güvenlik veya hayati öneme sahip kararların tek kaynağı olamaz',
            'AI modellerinin eğitim verisinde önyargılar (bias) bulunabilir; çıktıda zaman zaman bu önyargılar yansıyabilir',
            'Üretken AI çıktıları, üçüncü tarafların telif hakkına benzeyebilir; benzersizlik garanti edilmez'
          ]} />
          <Notice tone="warning">
            <strong>Kullanıcı taahhüdü:</strong> AI Çıktısını Son Kullanıcılarınıza iletmeden önce, özellikle kritik süreçlerde (rezervasyon onayı, ödeme tutarı, randevu, sağlık tavsiyesi vb.), uygun gözden geçirme süreçlerini kurmak ve uygulamakla yükümlüsünüz. AI Çıktısının Son Kullanıcılarınıza yol açabileceği zararlardan ALLYNC sorumlu tutulamaz.
          </Notice>
        </>
      )
    },
    {
      icon: AlertTriangle,
      heading: '13. Sorumluluk Sınırlaması ve Garanti Reddi',
      content: (
        <>
          <SubHeading>13.1 Garanti Reddi</SubHeading>
          <p>Hizmetler "OLDUĞU GİBİ" ve "MEVCUT OLDUĞU ŞEKİLDE" sunulur. Yürürlükteki yasaların izin verdiği azami ölçüde, ALLYNC açık veya zımni şu garantileri vermez:</p>
          <BulletList items={[
            'Belirli bir amaca uygunluk garantisi',
            'Kesintisizlik veya hata içermezlik garantisi',
            'Belirli bir performans veya iş sonucu garantisi',
            'Üçüncü taraf hizmetlerinin (Meta, AI sağlayıcılar, bulut, ödeme) sürekli erişilebilirlik garantisi'
          ]} />
          <SubHeading>13.2 Sorumluluk Sınırı</SubHeading>
          <p>Yürürlükteki yasaların izin verdiği azami ölçüde, ALLYNC\'in herhangi bir Kullanıcıya karşı toplam sorumluluğu, Kullanıcının ilgili olayın tarihinden önceki <strong>12 ay içinde</strong> ALLYNC\'e ödediği toplam ücret tutarıyla sınırlıdır.</p>
          <SubHeading>13.3 Kapsam Dışı Zararlar</SubHeading>
          <p>ALLYNC hiçbir koşulda aşağıdakilerden sorumlu tutulamaz:</p>
          <BulletList items={[
            'Dolaylı, arızi, özel, sonuç olarak ortaya çıkan veya cezai zararlar',
            'Kâr kaybı, gelir kaybı, iş kaybı, itibar kaybı',
            'Veri kaybı (yalnızca Hizmet kaynaklı, telafi edilebilir veri kayıpları için ALLYNC\'in olası yedekleme yükümlülükleri saklıdır)',
            'Üçüncü taraf hizmetlerinin (Meta, AI sağlayıcılar, internet, ödeme) kesintilerinden kaynaklı zararlar',
            'Kullanıcının yasalara, Meta politikalarına veya bu Şartlara aykırı davranışlarından kaynaklı her türlü zarar',
            'Son Kullanıcıların eylemlerinden veya entegrasyonun kötüye kullanımından kaynaklı zararlar'
          ]} />
          <p className="text-xs text-gray-500">Bazı yetki bölgelerinde belirli sorumluluk sınırlamaları geçerli olmayabilir; bu durumda yürürlükteki yasaların izin verdiği azami ölçüde sınırlama uygulanır.</p>
        </>
      )
    },
    {
      icon: Scale,
      heading: '14. Tazminat',
      content: (
        <>
          <p>Kullanıcı, aşağıdakilerden kaynaklanan tüm üçüncü taraf talep, dava ve zararlarına karşı ALLYNC\'i, yöneticilerini, çalışanlarını, danışmanlarını ve iş ortaklarını savunmayı, masun tutmayı ve tazmin etmeyi kabul eder:</p>
          <BulletList items={[
            'Bu Şartların ihlali',
            'Yürürlükteki yasalara veya Meta politikalarına aykırı kullanım',
            'Kullanıcı İçeriği veya Kullanıcının AI Çıktısını kullanma biçimi',
            'Kullanıcının Son Kullanıcılarına karşı yükümlülüklerini yerine getirmemesi',
            'Üçüncü kişilere ait fikri mülkiyet veya kişilik haklarının ihlali',
            'Kullanıcının ihmali veya kasıtlı eylemlerinden kaynaklanan zararlar'
          ]} />
        </>
      )
    },
    {
      icon: LogOut,
      heading: '15. Hesap Askıya Alma ve Fesih',
      content: (
        <>
          <SubHeading>15.1 ALLYNC Tarafından Fesih</SubHeading>
          <p>ALLYNC, aşağıdaki durumlarda hesabınızı önceden bildirim yapmaksızın askıya alabilir veya feshedebilir:</p>
          <BulletList items={[
            'Bu Şartların önemli bir maddesinin ihlali',
            'Ödeme yükümlülüklerinin yerine getirilmemesi (15 günlük ek süreden sonra)',
            'Meta\'nın WhatsApp / Instagram politikalarının ihlali',
            'Hukuka aykırı faaliyetler veya yasadışı içerik',
            'Platformun istikrarına veya diğer Kullanıcılara yönelik tehdit',
            'Resmi makamlardan gelen yasal talepler'
          ]} />
          <SubHeading>15.2 Kullanıcı Tarafından Fesih</SubHeading>
          <BulletList items={[
            'Aboneliğinizi panelden veya yazılı bildirimle istediğiniz zaman sonlandırabilirsiniz',
            'Aylık aboneliklerde fesih, mevcut dönemin sonunda yürürlüğe girer; orantılı iade yapılmaz (bkz. Bölüm 10.3)',
            'Yıllık aboneliklerde dönem sonuna kadar erişim devam eder; iade yapılmaz',
            'Özel yazılım projelerinde, sözleşmede yer alan fesih hükümleri uygulanır'
          ]} />
          <SubHeading>15.3 Fesih Sonrası</SubHeading>
          <BulletList items={[
            'Hesabınıza erişim sonlandırılır; API anahtarları geçersiz kılınır',
            'Verileriniz Gizlilik Politikasında belirtilen saklama sürelerine göre silinir veya anonimleştirilir',
            'Vade gelmiş tüm ücretler derhal muaccel hale gelir',
            'Bu Şartların 7 (Fikri Mülkiyet), 11.3-11.4 (Veri Sorumluluğu), 13 (Sorumluluk), 14 (Tazminat) ve 16 (Geçerli Hukuk) bölümleri fesihten sonra da yürürlükte kalır'
          ]} />
        </>
      )
    },
    {
      icon: Gavel,
      heading: '16. Geçerli Hukuk ve Uyuşmazlık Çözümü',
      content: (
        <>
          <SubHeading>16.1 Geçerli Hukuk</SubHeading>
          <p>Bu Şartlar, kanunlar ihtilafı kuralları dikkate alınmaksızın <strong>Türkiye Cumhuriyeti yasalarına</strong> tabidir.</p>
          <SubHeading>16.2 Yetkili Mahkeme</SubHeading>
          <BulletList items={[
            'Türkiye\'deki Kullanıcılar için: Bursa Mahkemeleri ve İcra Daireleri münhasıran yetkilidir',
            'Yurt dışındaki Kullanıcılar için: Tarafların aksini yazılı olarak kararlaştırmadığı sürece, yine Bursa Mahkemeleri yetkilidir; alternatif olarak ICC kuralları çerçevesinde İstanbul\'da tek hakemli tahkim seçilebilir (dil: İngilizce)'
          ]} />
          <SubHeading>16.3 İyi Niyetli Müzakere</SubHeading>
          <p>Yasal yola başvurmadan önce taraflar, herhangi bir uyuşmazlığı yazılı bildirimden itibaren <strong>30 gün boyunca iyi niyetle müzakere ederek</strong> çözmeye çalışacaktır. Bu süre zarfında çözüm sağlanamazsa yetkili merciye başvurulabilir.</p>
          <SubHeading>16.4 Toplu Dava Feragati</SubHeading>
          <p>Yürürlükteki yasaların izin verdiği ölçüde, taraflar bu Şartlardan kaynaklanan uyuşmazlıkları yalnızca bireysel olarak ileri süreceklerini, toplu dava (class action) açmayacaklarını kabul eder.</p>
        </>
      )
    },
    {
      icon: Edit3,
      heading: '17. Şartlardaki Değişiklikler',
      content: (
        <>
          <BulletList items={[
            'Bu Şartları zaman zaman güncelleme hakkımız saklıdır',
            'Önemli değişiklikler için en az 30 gün önceden e-posta veya panel duyurusu ile bildirim yapılır',
            'Önemsiz değişiklikler (yazım hatası, açıklama, yeniden yapılandırma) bildirim olmaksızın yapılabilir',
            'Değişiklikler yürürlüğe girdikten sonra Hizmetleri kullanmaya devam etmeniz, yeni Şartları kabul ettiğiniz anlamına gelir',
            'Önemli değişiklikleri kabul etmiyorsanız, bildirim süresi içinde aboneliğinizi feshederek Hizmetleri kullanmayı bırakabilirsiniz',
            'Bu Şartların sürüm geçmişi talep üzerine info@allyncai.com adresinden temin edilebilir'
          ]} />
        </>
      )
    },
    {
      icon: Layers,
      heading: '18. Diğer Hükümler',
      content: (
        <>
          <SubHeading>18.1 Tam Anlaşma</SubHeading>
          <p>Bu Şartlar (Gizlilik Politikası ve atıfta bulunulan diğer politikalarla birlikte), ALLYNC ile Kullanıcı arasındaki tam anlaşmayı oluşturur ve önceki tüm sözlü veya yazılı iletişimleri geçersiz kılar.</p>
          <SubHeading>18.2 Bölünebilirlik</SubHeading>
          <p>Bu Şartların herhangi bir hükmünün geçersiz veya uygulanamaz bulunması durumunda, kalan hükümler tam olarak yürürlükte kalır.</p>
          <SubHeading>18.3 Feragat</SubHeading>
          <p>ALLYNC\'in herhangi bir hakkını kullanmaması veya geç kullanması, o haktan feragat ettiği anlamına gelmez.</p>
          <SubHeading>18.4 Devir</SubHeading>
          <BulletList items={[
            'ALLYNC, bu Şartlardaki haklarını ve yükümlülüklerini iştiraklerine veya bir devralan üçüncü tarafa (örneğin birleşme/satın alma durumunda) devredebilir',
            'Kullanıcı, ALLYNC\'in yazılı izni olmaksızın bu Şartlardan doğan haklarını veya yükümlülüklerini devredemez'
          ]} />
          <SubHeading>18.5 İlişkinin Niteliği</SubHeading>
          <p>Bu Şartlar, taraflar arasında bir ortaklık, ortak girişim, acente veya işveren-işçi ilişkisi yaratmaz; her iki taraf da bağımsız akit taraflardır.</p>
          <SubHeading>18.6 Bildirimler</SubHeading>
          <p>ALLYNC tarafından yapılacak resmi bildirimler, Kullanıcının panel hesabında kayıtlı e-posta adresine veya panel içi duyuruyla yapılabilir; Kullanıcı, info@allyncai.com adresine yazılı bildirimde bulunabilir.</p>
        </>
      )
    },
    {
      icon: Monitor,
      heading: '19. Ürün-Spesifik Şartlar: Allync Digital Signage',
      content: (
        <>
          <p>Bu bölüm, Allync Digital Signage ürününe (signage.allyncai.com ve tenant alt-alanlarına) özgü ek hükümleri düzenler. Bu hükümler, yukarıdaki genel Şartlara <strong>ek olarak</strong> uygulanır; çakışma halinde Digital Signage hizmeti kapsamında bu bölüm öncelikli olarak uygulanır.</p>
          <SubHeading>19.1 Hizmet Kapsamı</SubHeading>
          <BulletList items={[
            'Allync Digital Signage, Kullanıcının kendi cihazlarında (Android, Windows ve uyumlu web tarayıcıları) içerik göstermesini ve uzaktan yönetmesini sağlayan SaaS platformudur',
            'ALLYNC yalnızca yazılım, API\'ler, bulut altyapısı ve yönetim panelini sağlar',
            'Hizmet `signage.allyncai.com` ana domaininde ve her tenant için ayrılmış alt-alanlarda (`{tenant}.signage.allyncai.com`) sunulur',
            'Süper-yönetici (Allync), tenant yöneticisi ve tenant kullanıcısı olmak üzere üç seviyeli rol-bazlı erişim modeli (RBAC) uygulanır'
          ]} />
          <SubHeading>19.2 Cihaz Donanımı (BYOD — Bring Your Own Device)</SubHeading>
          <BulletList items={[
            'ALLYNC donanım (TV, kiosk, monitör, set-top box, oynatıcı) satmaz, kiralamaz, garanti vermez veya tamir etmez',
            'Cihazın satın alınması, kurulumu, güncellenmesi, fiziksel güvenliği, anti-vandalizm önlemleri, elektrik beslemesi ve internet bağlantısı tamamen Kullanıcının sorumluluğundadır',
            'Cihaz arızası, kaybolması, çalınması veya hasar görmesi nedeniyle hizmet kullanılamazlığı, abonelik ücretlerinde iade veya orantı hakkı doğurmaz',
            'Cihazların yerleştirildiği fiziksel mekânın (mağaza, vitrin, bekleme alanı, ofis lobisi vb.) yasal kullanım hakkını veya sahipliğini Kullanıcı taahhüt eder',
            'Desteklenen platformlar: Android (APK), Windows ve modern web tarayıcılar; bunların dışındaki ortamlar için uyumluluk garanti edilmez'
          ]} />
          <SubHeading>19.3 İçerik Sorumluluğu ve Halka Açık Görüntüleme</SubHeading>
          <BulletList items={[
            'Ekranlarda görüntülenen tüm içerik (görsel, video, metin, müzik, animasyon) için telif hakkı, ticari marka, kişilik hakkı ve gizlilik hakkı uyumluluğu Kullanıcının sorumluluğundadır',
            'Halka açık alanlarda (mağaza, AVM, restoran, hastane, otel, ofis lobisi, spor salonu, vb.) gösterilen içerik için yerel reklam mevzuatı, yaş kısıtlamaları, dil zorunlulukları ve sektörel düzenlemelere uyumdan Kullanıcı sorumludur',
            'Bölüm 6 (Yasaklı Kullanım) hükümlerine ek olarak, Digital Signage üzerinde şunlar kesinlikle yasaktır: pornografi veya açık cinsel içerik, aşırı şiddet, ırkçı/ayrımcı/nefret içeren semboller, sahte sağlık iddiaları, lisanssız kumar veya bahis reklamı, doğrulanmamış mali tavsiye',
            'ALLYNC içerik onay (moderation) iş akışı sunar (taslak → onay → yayın); ancak son yayın kararı ve içerik uygunluğu Kullanıcıya aittir',
            'Müzik ve arka plan ses (background music) özelliği kullanıldığında, ilgili telif lisanslarının (örn. MESAM, MSG, PRS, ASCAP) edinilmesi Kullanıcı sorumluluğundadır'
          ]} />
          <SubHeading>19.4 Telemetri, Konum ve Dikkat Analitiği (Attention Analytics)</SubHeading>
          <BulletList items={[
            'Cihaz oynatıcıları, hizmet sürekliliği için ALLYNC sunucularına düzenli aralıklarla telemetri (heartbeat) gönderir: cihaz sağlık metrikleri (pil, depolama, CPU, ağ hızı), kayıtlı GPS konumu, tanılama ekran görüntüleri ve hata logları',
            'Bu telemetri yalnızca lisans doğrulama, hizmet kalitesi ve sorun giderme için kullanılır',
            '"Attention Analytics" özelliği etkinleştirildiğinde, ekran karşısındaki seyirci sayısı, dikkat süresi ve isteğe bağlı demografik tahminler (yaş aralığı, cinsiyet, duygu) cihaz üzerinde lokal olarak işlenir; ham görüntü veya video ALLYNC sunucularına asla gönderilmez',
            'AB ve Birleşik Krallık\'ta GDPR Uyumlu Mod (`gdpr_compliance_mode`) etkinleştirildiğinde demografik analitik bastırılır; yalnızca anonim, toplu metrikler işlenir',
            'Halka açık alanlarda "attention analytics" veya kameralı ölçüm kullanımının yerel veri koruma ve CCTV bildirim mevzuatına uyumlu olduğunu (örn. AB GDPR, Türkiye KVKK) garanti etmek Kullanıcının sorumluluğundadır',
            'Kullanıcı, bu özelliği kullanması halinde son kullanıcılarına gerekli bildirim/ikaz tabelalarını sunmakla yükümlüdür'
          ]} />
          <SubHeading>19.5 Lisans, Plan Limitleri ve Aşım</SubHeading>
          <BulletList items={[
            'Hizmet, ekran adedi, depolama, AI tokenı, API çağrı sayısı, kullanıcı sayısı ve oynatma listesi gibi plan-bazlı limitlerle sunulur',
            'Plan limitlerini aşan kullanım için ek ücret tahakkuk ettirilebilir veya bir üst plana yükseltme talep edilebilir',
            'Aylık veya yıllık faturalandırma seçenekleri ve özel limit (custom_limits) yapılandırması mevcuttur',
            'Lisans iptali veya ödeme gecikmesi nedeniyle hesabın askıya alınması durumunda cihazlardaki içerik gösterimi ALLYNC tarafından durdurulabilir',
            'Kullanıcı, Hizmetin lisans doğrulama için telemetriye dayandığını ve uzun süreli internet kesintilerinin oynatımı etkileyebileceğini kabul eder'
          ]} />
          <SubHeading>19.6 Süper-Yönetici Müdahalesi ve Acil Durdurma</SubHeading>
          <BulletList items={[
            'ALLYNC süper-yöneticileri, platform genelinde acil müdahale yetkisine sahiptir: yasaklı içeriği zorla kaldırma, ekranları acil duruma alma, lisansı askıya alma veya hesabı zorla çıkış yaptırma',
            'Bu yetki yalnızca açık politika ihlalleri, hukuka aykırılık şikâyetleri veya platform güvenliğini tehdit eden durumlarda kullanılır',
            'Olağan koşullarda, müdahale öncesi Kullanıcıya yazılı bildirim yapılır; ciddi acil durumlarda bildirim sonradan iletilebilir'
          ]} />
          <SubHeading>19.7 Yapay Zeka Asistanı ve Üretken İçerik</SubHeading>
          <BulletList items={[
            'Digital Signage AI asistan özelliği; metin promptlarına göre tasarım, metin, görsel ve şablon üretebilir',
            'Üretken içerik için Anthropic Claude ve Google Gemini API\'leri kullanılır; bu sağlayıcıların hizmet şartları geçerlidir',
            'Üretilen içeriğin telif hakkı uygunluğu, doğruluğu ve halka açık görüntüleme uygunluğu kontrolü Kullanıcıya aittir',
            'Bölüm 12 (Yapay Zeka Çıktıları) hükümleri Digital Signage AI çıktıları için de aynen geçerlidir',
            'AI tokenı tüketimi plan limitlerinizden düşer; tüketilen tokenlar Bölüm 10.3 uyarınca iade edilmez'
          ]} />
          <SubHeading>19.8 Çoklu Kiracılık (Multi-Tenancy) ve Veri İzolasyonu</SubHeading>
          <BulletList items={[
            'Her tenant, satır seviyesinde güvenlik (Row Level Security) ile diğer tenantlardan izole edilmiş veri tabanı şemasına sahiptir',
            'Tenant yöneticileri yalnızca kendi tenantlarındaki verilere erişebilir; tenantlar arası veri aktarımı varsayılan olarak yasaktır',
            'Kullanıcı, kendi tenant kullanıcıları için izinleri (RBAC) doğru yapılandırmaktan sorumludur (admin / editor / viewer rolleri ve izin grupları)',
            'Tenantın silinmesi durumunda tüm veriler Gizlilik Politikasında belirtilen saklama sürelerine göre silinir veya anonimleştirilir; ekstra bir geri yükleme garantisi verilmez'
          ]} />
        </>
      )
    },
    {
      icon: Mail,
      heading: '20. İletişim',
      content: (
        <>
          <p>Bu Şartlarla ilgili soru, talep ve bildirimleriniz için bizimle iletişime geçebilirsiniz:</p>
          <SubHeading>Şirket Bilgileri</SubHeading>
          <BulletList items={[
            'Yasal Unvan: ALLYNC',
            'Tescilli Marka: Allyncai (ALLYNC\'in tescilli markasıdır)',
            'Şirket Tescil No: 8950466196',
            'D-U-N-S No: 751168710',
            'Adres: Yeni Mah. Sefer Sk. No:1 İç Kapı No:1 İnegöl/Bursa - Türkiye',
            'Meta Statüsü: Verified Tech Provider'
          ]} />
          <SubHeading>İletişim Kanalları</SubHeading>
          <BulletList items={[
            'E-posta: info@allyncai.com',
            'Web: https://www.allyncai.com',
            'İletişim Formu: https://www.allyncai.com/digital/contact',
            'Konu: "Hizmet Şartları Talebi"'
          ]} />
          <p className="text-xs text-gray-500 mt-3">Yasal tebligat ve resmî yazışmalar yukarıdaki adrese yapılır. Yanıt süresi en fazla 30 gündür.</p>
        </>
      )
    }
  ] : [
    {
      icon: FileText,
      heading: '1. Introduction & Acceptance of Terms',
      content: (
        <>
          <p>Welcome to Allync ("we", "us", "our", "Allync", "AllyncAI"). These Terms of Service ("Terms") govern your access to and use of our website (allyncai.com), our WhatsApp Business API and Instagram Business messaging services, our AI-powered assistants, our SaaS panels, our mobile applications, our custom software development services, and any other digital services we provide (collectively, the "Services").</p>
          <p className="text-gray-300 bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 mt-3">By registering for the Services, accessing your account, or using the Services in any way, you represent that you have read, understood and agree to be legally bound by these Terms, our Privacy Policy and any additional policies referenced herein. If you do not agree, you must not use the Services.</p>
          <p>ALLYNC is a technology company organized under the laws of the Republic of Türkiye, registered under No. <strong>8950466196</strong>, with its registered address at Yeni Mah. Sefer Sk. No:1 Ic Kapi No:1 Inegol/Bursa, Türkiye. Allyncai is a registered brand of ALLYNC. ALLYNC is authorized by Meta Platforms, Inc. as a <strong>Verified Tech Provider</strong>.</p>
        </>
      )
    },
    {
      icon: BookOpen,
      heading: '2. Definitions',
      content: (
        <>
          <DataTable
            headers={['Term', 'Definition']}
            rows={[
              ['"ALLYNC", "we", "us", "Service Provider"', 'ALLYNC and its registered brand Allyncai'],
              ['"Services"', 'All digital products, platforms, APIs and consultancy services offered by Allync'],
              ['"User", "Tenant", "Business Owner"', 'The legal entity (or its authorized representative) that subscribes to the Services'],
              ['"End User"', 'A customer of the User who interacts with the User via WhatsApp / Instagram'],
              ['"Content"', 'All text, images, audio, video, documents and data uploaded, generated or transmitted through the Services'],
              ['"Meta"', 'Meta Platforms, Inc. (parent of WhatsApp, Instagram, Facebook)'],
              ['"AI Output"', 'Any responses, classifications, transcripts and outputs produced by AI models'],
              ['"Data Controller / Data Processor"', 'Roles defined under GDPR / KVKK; under these Terms the User is generally the Data Controller and ALLYNC the Data Processor'],
              ['"Verified Tech Provider"', 'Official authorization status granted by Meta to ALLYNC for WhatsApp Business and Instagram Business'],
              ['"Force Majeure"', 'Events outside the reasonable control of ALLYNC (war, natural disaster, third-party infrastructure outage, government action, etc.)']
            ]}
          />
        </>
      )
    },
    {
      icon: Briefcase,
      heading: '3. Service Description',
      content: (
        <>
          <p>Allync offers the following products and services to businesses:</p>
          <BulletList items={[
            'AI-powered customer service assistants on the WhatsApp Business API (official onboarding via Meta Embedded Signup)',
            'Direct Message automation and comment replies on the Instagram Graph API (with minimum-scope permissions)',
            'Multi-tenant SaaS management panels and industry-specific modules',
            'Website, e-commerce platform and mobile application development',
            'Digital marketing, SEO and content production consultancy',
            'Sentiment analysis, intent classification and voice message transcription (optional features)',
            'Integrations with CRM, ERP, calendar and file services',
            'Audit log, monitoring and compliance infrastructure'
          ]} />
          <p>The scope, delivery model and feature set of the Services may evolve over time. Each User has access only to those Services included in the plan, contract or project quote they have subscribed to.</p>
        </>
      )
    },
    {
      icon: UserCheck,
      heading: '4. Account Registration & Eligibility',
      content: (
        <>
          <SubHeading>4.1 Eligibility</SubHeading>
          <BulletList items={[
            'The Services may only be used by legal entities and by individuals who are at least 18 years old and have full contractual capacity',
            'The person registering on behalf of a legal entity represents that they have the authority to bind that entity',
            'A person/business whose account has previously been suspended or terminated by ALLYNC may not re-register']} />
          <SubHeading>4.2 Duty to Provide Accurate Information</SubHeading>
          <BulletList items={[
            'You must provide accurate, current and complete information at registration',
            'You must keep your business name, tax ID, authorized contact and billing address up to date',
            'ALLYNC may request identity and authorization documents where reasonably necessary; unverifiable accounts may be suspended'
          ]} />
          <SubHeading>4.3 Account Security</SubHeading>
          <BulletList items={[
            'You are solely responsible for the confidentiality of your password, API keys and session tokens',
            'We strongly recommend that you enable multi-factor authentication (MFA)',
            'Notify us immediately at info@allyncai.com if you suspect unauthorized access',
            'You are responsible for all activity that takes place under your account'
          ]} />
        </>
      )
    },
    {
      icon: Users,
      heading: '5. User Responsibilities and Obligations',
      content: (
        <>
          <SubHeading>5.1 Legal Compliance</SubHeading>
          <BulletList items={[
            'You must comply with all applicable laws including KVKK, GDPR, Qatar PDPPL and any other relevant data-protection regulation',
            'You are responsible for full compliance with Meta\'s WhatsApp Business Policy, WhatsApp Commerce Policy and Instagram Platform Policy',
            'You are responsible for advertising, tax, consumer-rights and sector-specific regulations (health, finance, education) that apply to your business'
          ]} />
          <SubHeading>5.2 Data Controller / Data Processor Roles</SubHeading>
          <p>For End User data processed through the Services, the User acts as the <strong>Data Controller</strong> and ALLYNC as the <strong>Data Processor</strong>. Accordingly, the User is responsible for:</p>
          <BulletList items={[
            'Providing the necessary privacy notice to End Users',
            'Obtaining valid, explicit consent from End Users for AI-driven messaging, sentiment analysis and voice transcription',
            'Adding only opt-in End Users to messaging channels',
            'Responding to End Users\' KVKK / GDPR rights requests (access, deletion, rectification)'
          ]} />
          <SubHeading>5.3 Content Accuracy</SubHeading>
          <BulletList items={[
            'You are responsible for the accuracy, legality and intellectual-property compliance of all Content you upload',
            'You must regularly review business-critical Content (templates, product information, pricing, legal notices)'
          ]} />
          <SubHeading>5.4 AI Output Review</SubHeading>
          <BulletList items={[
            'AI-generated responses can sometimes be inaccurate, biased or misleading (see Section 12)',
            'For sensitive areas (health, legal, financial, safety), the User is responsible for establishing a review process before sending AI Output to End Users',
            'ALLYNC is not liable for harm caused by inaccurate AI Output delivered to End Users'
          ]} />
        </>
      )
    },
    {
      icon: Ban,
      heading: '6. Prohibited Use',
      content: (
        <>
          <p>The following uses of the Services are strictly prohibited:</p>
          <BulletList items={[
            'Spam, phishing, fraud or unsolicited marketing messages',
            'Transmission of unlawful content (drugs, weapons, unlicensed gambling, child exploitation, copyright infringement, etc.)',
            'Hate speech, harassment, defamation, threats or discriminatory content',
            'Use in industries or content categories prohibited by Meta (refer to Meta\'s current policies)',
            'Abusing Meta\'s 24-hour customer service window by initiating fake conversations',
            'Scraping or extracting third-party data that does not belong to you',
            'Reverse engineering, attempting to extract source code or circumvent technical measures',
            'Systematically exceeding API rate limits or usage quotas',
            'Reselling, white-labelling or sub-licensing the Services without ALLYNC\'s written consent',
            'Uploading malware, viruses or exploits that may harm the platform, other Users or End Users',
            'Attempting unauthorized access to other User or End User accounts'
          ]} />
          <Notice tone="warning">
            <strong>Important:</strong> Violation of this section will result in immediate account suspension or termination, with no refund, and may be reported to law enforcement where required.
          </Notice>
        </>
      )
    },
    {
      icon: Copyright,
      heading: '7. Intellectual Property Rights',
      content: (
        <>
          <SubHeading>7.1 ALLYNC Ownership</SubHeading>
          <BulletList items={[
            'The platform, source code, design, user interface, visual elements, documentation, training materials and branding are the worldwide property of ALLYNC',
            '"ALLYNC" and "Allyncai" are registered trademarks',
            'AI models, prompt-engineering templates and algorithms developed or improved by ALLYNC are owned by ALLYNC'
          ]} />
          <SubHeading>7.2 User Content</SubHeading>
          <BulletList items={[
            'You retain ownership of the Content you upload to the Services',
            'You grant ALLYNC a limited, worldwide, royalty-free, non-transferable license necessary to provide the Services',
            'This license is used solely for service delivery, storage, analytics and the production of (anonymized) statistics; it is never used for advertising or resale'
          ]} />
          <SubHeading>7.3 Ownership of AI Output</SubHeading>
          <BulletList items={[
            'You receive a commercial-use right over AI Output generated for you, within the scope of your subscription',
            'It is your responsibility to ensure that the AI Output does not infringe any existing copyright',
            'No guarantee is made that AI Output is unique (e.g. common phrases or generic patterns may resemble existing material)'
          ]} />
          <SubHeading>7.4 Feedback</SubHeading>
          <p>We may use suggestions, bug reports or other feedback you send us (collectively, "Feedback") to improve our products without restriction.</p>
        </>
      )
    },
    {
      icon: Globe,
      heading: '8. Third-Party Services & Integrations',
      content: (
        <>
          <p>Our Services integrate with the following third-party platforms:</p>
          <DataTable
            headers={['Third Party', 'Purpose', 'Binding Terms']}
            rows={[
              ['Meta Platforms', 'WhatsApp Business API & Instagram Graph API', 'Meta Commercial Terms, WhatsApp Business Policy, Instagram Platform Policy'],
              ['Anthropic (Claude)', 'AI response generation and sentiment analysis', 'Anthropic Terms of Service (enterprise API agreement)'],
              ['OpenAI', 'Voice transcription (Whisper) and voice replies (TTS)', 'OpenAI API Terms of Service'],
              ['Google', 'Calendar, Sheets, Drive integrations (when authorized)', 'Google API Terms of Service'],
              ['Cloud infrastructure providers', 'Hosting and database', 'Applicable provider terms'],
              ['Payment processors', 'Billing and collection (PCI DSS compliant)', 'Applicable provider terms']
            ]}
          />
          <BulletList items={[
            'When using third-party integrations you must also comply with those platforms\' own terms',
            'ALLYNC is not responsible for any third-party service interruption, policy change or account suspension',
            'Meta may suspend an integration or remove a feature at any time',
            'While ALLYNC is a Meta Verified Tech Provider, ALLYNC does not own Meta\'s products and acts as an intermediary / integration provider'
          ]} />
        </>
      )
    },
    {
      icon: RefreshCw,
      heading: '9. Service Availability and Modifications',
      content: (
        <>
          <SubHeading>9.1 Availability</SubHeading>
          <BulletList items={[
            'Target service-level: 99.9% monthly availability (excluding scheduled maintenance)',
            'Scheduled maintenance is announced at least 24 hours in advance where possible',
            'Emergency security patches may be applied without prior notice; we will inform you as soon as reasonably possible'
          ]} />
          <SubHeading>9.2 Modifications</SubHeading>
          <BulletList items={[
            'We reserve the right to update the feature set, user interface, pricing and technical infrastructure of the Services',
            'For material changes we provide reasonable advance notice',
            'Beta or experimental features may change, break, or be removed without prior notice and are not recommended for production-critical use'
          ]} />
          <SubHeading>9.3 Force Majeure</SubHeading>
          <p>ALLYNC is not liable for unavailability caused by events outside our reasonable control, including natural disaster, war, terrorism, pandemic, government action, public utility disruption, third-party infrastructure failure or internet backbone outage.</p>
        </>
      )
    },
    {
      icon: CreditCard,
      heading: '10. Fees, Payment and No-Refund Policy',
      content: (
        <>
          <SubHeading>10.1 Subscription and Project Fees</SubHeading>
          <BulletList items={[
            'Monthly or annual subscription fees are charged in accordance with your selected plan',
            'Custom software development projects are quoted separately, with payment generally tied to delivery milestones',
            'Usage-based AI fees (number of messages, transcription minutes, LLM tokens, etc.) are billed according to actual consumption',
            'All fees are quoted in TRY or USD, exclusive of VAT or local taxes; applicable taxes are added on top'
          ]} />
          <SubHeading>10.2 Payment and Late Payment</SubHeading>
          <BulletList items={[
            'Payment is processed through PCI DSS compliant providers (e.g. iyzico, PayTR, Stripe)',
            'For late subscription payments: a 7-day reminder is followed by a 15-day grace period; the Service is suspended thereafter',
            'A reconnection / configuration fee may apply when reactivating a suspended account'
          ]} />
          <SubHeading>10.3 REFUND POLICY — NO REFUNDS</SubHeading>
          <Notice tone="warning">
            <p><strong>All fees paid for ALLYNC Services are strictly non-refundable</strong>, regardless of whether the subscription period has started. The only exceptions are mandatory refund obligations imposed by applicable consumer-protection law.</p>
          </Notice>
          <BulletList items={[
            'Custom software development: amounts paid for accepted milestones are non-refundable',
            'Monthly / annual subscriptions: no pro-rated refund will be provided for early cancellation',
            'AI usage fees: consumed messages, tokens or minutes are not refundable',
            'Training, setup, consultancy and bespoke services: not refundable once delivery (in whole or in part) has occurred',
            'Only the mandatory provisions of applicable consumer-protection law (e.g. certain KVKK situations) remain reserved'
          ]} />
          <SubHeading>10.4 Price Changes</SubHeading>
          <p>We reserve the right to update our pricing with at least 30 days\' prior notice. New pricing applies from the next renewal cycle following the notice. Users who do not accept the new pricing may cancel their subscription before the new term begins.</p>
        </>
      )
    },
    {
      icon: Shield,
      heading: '11. Data Security & User Responsibility',
      content: (
        <>
          <SubHeading>11.1 Security Provided by ALLYNC</SubHeading>
          <BulletList items={[
            'TLS 1.3 in transit, AES-256 at rest',
            'Multi-factor authentication (MFA) for administrator accounts',
            'Audit logs for every sensitive action (default 90 days, tenant-configurable)',
            'Regular penetration testing and security reviews',
            'SOC 2 Type II control framework aligned infrastructure',
            'Aligned with control frameworks: KVKK, GDPR, Qatar PDPPL and ISO 27001',
            '99.9% availability SLA target'
          ]} />
          <SubHeading>11.2 ALLYNC\'s Guarantee</SubHeading>
          <p>ALLYNC commits to industry-standard security for your data <strong>in transit and at rest</strong> on our infrastructure. Specifically:</p>
          <BulletList items={[
            'We apply all reasonable technical and organizational measures to prevent unauthorized access on our servers',
            'Encrypted backups are taken regularly',
            'In the event of a security breach, we issue the notifications required by KVKK / GDPR within 72 hours'
          ]} />
          <SubHeading>11.3 User\'s Responsibility for Data</SubHeading>
          <Notice tone="warning">
            <p><strong>Important:</strong> The matters listed below are the User\'s responsibility. ALLYNC accepts no obligation, guarantee or compensation in respect of these matters.</p>
          </Notice>
          <BulletList items={[
            'Secure storage and non-disclosure of account credentials (password, API keys, session tokens)',
            'Data deleted or intentionally cleared by the User may not be recoverable; deletion operations are permanent',
            'If the User disconnects WhatsApp or Instagram, access to historical data and conversations may not be available on subsequent reconnection',
            'Data leaks originating from the User\'s own systems, devices or staff',
            'The User\'s failure to perform their backup or data-export obligations',
            'The User\'s failure to fulfill privacy-notice and consent obligations toward End Users'
          ]} />
          <SubHeading>11.4 Data Deletion and Irreversibility</SubHeading>
          <BulletList items={[
            'A tenant administrator can delete conversations, messages or the entire tenant from the panel',
            'Once deletion is complete, data-recovery requests will not be accepted',
            'Restoration from our backups is performed only in the event of a data loss caused by ALLYNC; deletions caused by the User are out of scope',
            'Meta\'s "Deauthorize" or "Data Deletion Request" callbacks, when triggered by the User or End User, will permanently delete the relevant data from ALLYNC systems with no possibility of restoration'
          ]} />
        </>
      )
    },
    {
      icon: Cpu,
      heading: '12. Important Notice on AI Output',
      content: (
        <>
          <p>Due to the inherent nature of AI technologies:</p>
          <BulletList items={[
            'AI Output may sometimes be inaccurate, misleading, incomplete, or out of context ("hallucination")',
            'Identical inputs may produce different outputs at different times',
            'AI Output cannot be the sole basis for legal, medical, financial, security or life-critical decisions',
            'Bias may be present in AI training data and may at times be reflected in the output',
            'Generative AI outputs may resemble third-party copyrighted material; uniqueness is not guaranteed'
          ]} />
          <Notice tone="warning">
            <strong>User undertaking:</strong> You are responsible for establishing and operating an appropriate review process before forwarding AI Output to End Users, especially in critical workflows (booking confirmations, payment amounts, appointments, medical advice, etc.). ALLYNC is not liable for any harm AI Output may cause to End Users.
          </Notice>
        </>
      )
    },
    {
      icon: AlertTriangle,
      heading: '13. Limitation of Liability and Disclaimer of Warranties',
      content: (
        <>
          <SubHeading>13.1 Disclaimer of Warranties</SubHeading>
          <p>The Services are provided on an "AS IS" and "AS AVAILABLE" basis. To the maximum extent permitted by applicable law, ALLYNC disclaims all warranties, express or implied, including:</p>
          <BulletList items={[
            'Warranty of fitness for a particular purpose',
            'Warranty of uninterrupted or error-free operation',
            'Warranty of any specific performance or business outcome',
            'Warranty of continuous availability of third-party services (Meta, AI providers, cloud, payment)'
          ]} />
          <SubHeading>13.2 Liability Cap</SubHeading>
          <p>To the maximum extent permitted by applicable law, ALLYNC\'s total aggregate liability to any User is limited to the total amount of fees paid by that User to ALLYNC in the <strong>twelve (12) months</strong> preceding the event giving rise to the claim.</p>
          <SubHeading>13.3 Excluded Damages</SubHeading>
          <p>In no event will ALLYNC be liable for:</p>
          <BulletList items={[
            'Indirect, incidental, special, consequential or punitive damages',
            'Loss of profit, loss of revenue, loss of business or loss of goodwill',
            'Loss of data (subject to ALLYNC\'s backup obligations for data loss caused by the Service that is reasonably recoverable)',
            'Damages caused by interruption of third-party services (Meta, AI providers, internet, payment)',
            'Any damage caused by the User\'s breach of law, Meta policy or these Terms',
            'Damages caused by End User actions or misuse of integrations'
          ]} />
          <p className="text-xs text-gray-500">In some jurisdictions certain limitations of liability may not apply; in those cases, liability is limited to the maximum extent permitted by applicable law.</p>
        </>
      )
    },
    {
      icon: Scale,
      heading: '14. Indemnification',
      content: (
        <>
          <p>The User agrees to defend, hold harmless and indemnify ALLYNC, its directors, employees, consultants and partners from and against all third-party claims, lawsuits and damages arising from:</p>
          <BulletList items={[
            'Any breach of these Terms',
            'Any use that violates applicable law or Meta policies',
            'User Content or the User\'s use of AI Output',
            'The User\'s failure to meet obligations toward End Users',
            'Infringement of any third-party intellectual-property or personality rights',
            'Damages caused by the User\'s negligent or willful acts'
          ]} />
        </>
      )
    },
    {
      icon: LogOut,
      heading: '15. Suspension and Termination',
      content: (
        <>
          <SubHeading>15.1 Termination by ALLYNC</SubHeading>
          <p>ALLYNC may suspend or terminate your account, with or without prior notice, in case of:</p>
          <BulletList items={[
            'Material breach of these Terms',
            'Failure to meet payment obligations (after the 15-day grace period)',
            'Violation of Meta\'s WhatsApp / Instagram policies',
            'Unlawful activity or illegal content',
            'Threat to platform stability or to other Users',
            'Legal demands from competent authorities'
          ]} />
          <SubHeading>15.2 Termination by the User</SubHeading>
          <BulletList items={[
            'You may cancel your subscription at any time from the panel or via written notice',
            'For monthly subscriptions, termination takes effect at the end of the current billing cycle; no pro-rated refund is provided (see Section 10.3)',
            'For annual subscriptions, access continues until the end of the term; no refund is provided',
            'For custom software projects, the termination provisions in the underlying contract apply'
          ]} />
          <SubHeading>15.3 Effects of Termination</SubHeading>
          <BulletList items={[
            'Access to your account is revoked; API keys are invalidated',
            'Your data is deleted or anonymized in accordance with the retention schedule in our Privacy Policy',
            'All accrued fees become immediately payable',
            'Sections 7 (IP), 11.3-11.4 (User Data Responsibility), 13 (Liability), 14 (Indemnification) and 16 (Governing Law) survive termination'
          ]} />
        </>
      )
    },
    {
      icon: Gavel,
      heading: '16. Governing Law and Dispute Resolution',
      content: (
        <>
          <SubHeading>16.1 Governing Law</SubHeading>
          <p>These Terms are governed by the <strong>laws of the Republic of Türkiye</strong>, without regard to conflict-of-laws rules.</p>
          <SubHeading>16.2 Jurisdiction</SubHeading>
          <BulletList items={[
            'For Users in Türkiye: the Bursa Courts and Enforcement Offices have exclusive jurisdiction',
            'For international Users: unless otherwise agreed in writing, the Bursa Courts also have jurisdiction; alternatively a single-arbitrator ICC arbitration in Istanbul (English) may be agreed upon'
          ]} />
          <SubHeading>16.3 Good-Faith Negotiation</SubHeading>
          <p>Before initiating any legal action, the parties agree to attempt to resolve any dispute by <strong>good-faith negotiation for 30 days</strong> from the date of written notice. If no resolution is reached during that period, either party may proceed to the competent forum.</p>
          <SubHeading>16.4 Class-Action Waiver</SubHeading>
          <p>To the maximum extent permitted by applicable law, the parties agree that disputes arising under these Terms may be brought only on an individual basis and not as a class action.</p>
        </>
      )
    },
    {
      icon: Edit3,
      heading: '17. Changes to These Terms',
      content: (
        <>
          <BulletList items={[
            'We reserve the right to update these Terms from time to time',
            'For material changes we provide at least 30 days\' prior notice via email or panel announcement',
            'Non-material changes (typo fixes, clarifications, restructuring) may be made without notice',
            'Continued use of the Services after the changes take effect constitutes acceptance of the updated Terms',
            'If you do not accept material changes, you may terminate your subscription within the notice period and stop using the Services',
            'A version history of these Terms is available on request from info@allyncai.com'
          ]} />
        </>
      )
    },
    {
      icon: Layers,
      heading: '18. Miscellaneous',
      content: (
        <>
          <SubHeading>18.1 Entire Agreement</SubHeading>
          <p>These Terms, together with the Privacy Policy and any other policies referenced herein, constitute the entire agreement between ALLYNC and the User and supersede all prior oral or written communications.</p>
          <SubHeading>18.2 Severability</SubHeading>
          <p>If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions remain in full force and effect.</p>
          <SubHeading>18.3 Waiver</SubHeading>
          <p>ALLYNC\'s failure or delay in exercising any right under these Terms does not constitute a waiver of that right.</p>
          <SubHeading>18.4 Assignment</SubHeading>
          <BulletList items={[
            'ALLYNC may assign its rights and obligations under these Terms to its affiliates or to a third-party assignee (for example in a merger / acquisition)',
            'The User may not assign its rights or obligations under these Terms without ALLYNC\'s prior written consent'
          ]} />
          <SubHeading>18.5 Nature of the Relationship</SubHeading>
          <p>These Terms do not create a partnership, joint venture, agency or employer-employee relationship between the parties; both parties act as independent contracting parties.</p>
          <SubHeading>18.6 Notices</SubHeading>
          <p>Formal notices from ALLYNC may be sent to the email address registered in your panel account or as in-panel announcements. The User may submit written notices to info@allyncai.com.</p>
        </>
      )
    },
    {
      icon: Monitor,
      heading: '19. Product-Specific Terms: Allync Digital Signage',
      content: (
        <>
          <p>This section sets out additional terms specific to the Allync Digital Signage product (signage.allyncai.com and tenant subdomains). These provisions apply <strong>in addition to</strong> the general Terms above; in case of any conflict, this section prevails for the Digital Signage Service.</p>
          <SubHeading>19.1 Service Scope</SubHeading>
          <BulletList items={[
            'Allync Digital Signage is a SaaS platform that enables the User to display and remotely manage content on the User\'s own devices (Android, Windows and compatible web browsers)',
            'ALLYNC provides software, APIs, cloud infrastructure and the management dashboard only',
            'The Service is delivered at the main domain `signage.allyncai.com` and at per-tenant subdomains (`{tenant}.signage.allyncai.com`)',
            'A three-tier role-based access control (RBAC) model is enforced: Super Administrator (Allync), Tenant Administrator and Tenant User'
          ]} />
          <SubHeading>19.2 Device Hardware (BYOD — Bring Your Own Device)</SubHeading>
          <BulletList items={[
            'ALLYNC does not sell, rent, warrant or repair hardware (TVs, kiosks, monitors, set-top boxes, players)',
            'Procurement, installation, software updates, physical security, anti-tampering measures, electrical supply and internet connectivity for devices are entirely the User\'s responsibility',
            'Service unavailability caused by device failure, loss, theft or damage does not entitle the User to any refund or pro-rata adjustment of subscription fees',
            'The User represents that they have the legal right or ownership to operate devices in the physical premises (store, window display, waiting area, office lobby, etc.) where they are placed',
            'Supported platforms: Android (APK), Windows and modern web browsers; compatibility with environments outside this list is not guaranteed'
          ]} />
          <SubHeading>19.3 Content Responsibility and Public Display</SubHeading>
          <BulletList items={[
            'The User is responsible for copyright, trademark, personality-right and privacy compliance of all content (images, video, text, music, animation) displayed on the screens',
            'When content is displayed in public spaces (retail stores, malls, restaurants, hospitals, hotels, office lobbies, gyms, etc.), the User is responsible for compliance with local advertising regulations, age restrictions, language requirements and sector-specific rules',
            'In addition to Section 6 (Prohibited Use), the following are strictly prohibited on Digital Signage: pornography or explicit sexual content, extreme violence, racist / discriminatory / hateful symbols, false health claims, unlicensed gambling or betting advertisements, unverified financial advice',
            'ALLYNC provides a content moderation workflow (draft → approval → publish), but final publication and content fitness remain the User\'s responsibility',
            'When the background-music feature is used, securing the appropriate music licenses (e.g. MESAM, MSG, PRS, ASCAP) is the User\'s responsibility'
          ]} />
          <SubHeading>19.4 Telemetry, Location and Attention Analytics</SubHeading>
          <BulletList items={[
            'Device players send periodic telemetry (heartbeat) to ALLYNC servers for service continuity: device health metrics (battery, storage, CPU, network speed), registered GPS location, diagnostic screenshots and error logs',
            'This telemetry is used solely for license validation, service quality and troubleshooting',
            'When the "Attention Analytics" feature is enabled, audience count, dwell time and optional demographic estimates (age range, gender, sentiment) are processed locally on the device; raw images or video are never transmitted to ALLYNC servers',
            'In the EU and UK, when GDPR Compliance Mode (`gdpr_compliance_mode`) is enabled, demographic analytics are suppressed and only anonymized aggregate metrics are processed',
            'It is the User\'s responsibility to ensure that the use of Attention Analytics or any camera-based measurement in public spaces complies with applicable data-protection and CCTV-notice regulations (e.g. EU GDPR, Türkiye KVKK)',
            'When using such features, the User must display the appropriate notices / signage to inform end-viewers'
          ]} />
          <SubHeading>19.5 Licensing, Plan Limits and Overage</SubHeading>
          <BulletList items={[
            'The Service is provided with plan-based limits on number of screens, storage, AI tokens, API calls, users and playlists',
            'Usage exceeding plan limits may incur overage charges or require an upgrade to a higher plan',
            'Monthly or annual billing is available, and custom limits (custom_limits) may be configured for enterprise plans',
            'In the event of license cancellation or suspension due to non-payment, ALLYNC may stop content playback on connected devices',
            'The User acknowledges that the Service relies on telemetry for license validation and that prolonged internet outages on the device side may affect playback'
          ]} />
          <SubHeading>19.6 Super-Administrator Override and Emergency Stop</SubHeading>
          <BulletList items={[
            'ALLYNC Super Administrators have platform-wide intervention rights: forced removal of prohibited content, emergency screen blackout, license suspension, and forced sign-out of accounts',
            'Such authority is exercised only in cases of clear policy violations, complaints of unlawful content or threats to platform security',
            'Under normal circumstances, the User receives written notice before intervention; in serious emergencies, notice may be provided after the fact'
          ]} />
          <SubHeading>19.7 AI Assistant and Generative Content</SubHeading>
          <BulletList items={[
            'The Digital Signage AI Assistant feature can generate designs, text, images and templates from user prompts',
            'Generative content uses Anthropic Claude and Google Gemini APIs; the terms of service of those providers apply',
            'Verification of the copyright fitness, accuracy and public-display suitability of generated content is the User\'s responsibility',
            'Section 12 (AI Output) applies in full to Digital Signage AI Output',
            'AI token consumption is deducted from your plan limits; consumed tokens are non-refundable in accordance with Section 10.3'
          ]} />
          <SubHeading>19.8 Multi-Tenancy and Data Isolation</SubHeading>
          <BulletList items={[
            'Each tenant operates on a database schema isolated from other tenants via Row Level Security (RLS)',
            'Tenant administrators may access only data within their own tenant; cross-tenant data sharing is disabled by default',
            'The User is responsible for correctly configuring RBAC for their own tenant users (admin / editor / viewer roles and permission groups)',
            'Upon tenant deletion, all data is deleted or anonymized in accordance with the retention schedule in our Privacy Policy; no separate restoration guarantee is provided'
          ]} />
        </>
      )
    },
    {
      icon: Mail,
      heading: '20. Contact',
      content: (
        <>
          <p>Please contact us with any questions, requests or notices about these Terms:</p>
          <SubHeading>Company Information</SubHeading>
          <BulletList items={[
            'Legal Name: ALLYNC',
            'Registered Brand: Allyncai (a registered brand of ALLYNC)',
            'Company Registration No: 8950466196',
            'D-U-N-S No: 751168710',
            'Address: Yeni Mah. Sefer Sk. No:1 Ic Kapi No:1 Inegol/Bursa - Türkiye',
            'Meta Status: Verified Tech Provider'
          ]} />
          <SubHeading>Contact Channels</SubHeading>
          <BulletList items={[
            'Email: info@allyncai.com',
            'Web: https://www.allyncai.com',
            'Contact Form: https://www.allyncai.com/digital/contact',
            'Subject: "Terms of Service Inquiry"'
          ]} />
          <p className="text-xs text-gray-500 mt-3">Legal service of process and official correspondence should be sent to the address above. Response time is up to 30 days.</p>
        </>
      )
    }
  ];

  const title = language === 'tr' ? 'Hizmet Şartları' : 'Terms of Service';
  const subtitle = language === 'tr' ? 'Hizmetlerimizi kullanırken geçerli olan kurallar, sorumluluklar ve haklar' : 'Rules, responsibilities and rights that apply when using our Services';
  const lastUpdated = language === 'tr' ? 'Son Güncelleme: 2 Mayıs 2026' : 'Last Updated: May 2, 2026';
  const backHome = language === 'tr' ? 'Ana Sayfa' : 'Home';

  return (
    <HelmetProvider>
      <Helmet>
        <title>{title} | Allync</title>
        <meta name="description" content={language === 'tr' ? 'Allync AI Hizmet Şartları. Allyncai platformunun kullanım koşulları, kullanıcı sorumlulukları, iade politikası ve hukuki çerçeve. Türkiye, AB ve Katar için kapsamlı şartlar.' : 'Allync AI Terms of Service. Comprehensive usage terms, user responsibilities, no-refund policy and legal framework for the Allyncai platform across Türkiye, EU and Qatar.'} />
        <link rel="canonical" href="https://www.allyncai.com/terms" />
      </Helmet>

      <div className="min-h-screen bg-black relative">
        <Suspense fallback={null}>
          {!isMobile ? (
            <FloatingLines
              enabledWaves={['top', 'middle', 'bottom']}
              lineCount={5}
              lineDistance={5}
              bendRadius={5.0}
              bendStrength={-0.5}
              interactive={true}
              parallax={false}
              mixBlendMode="normal"
              linesGradient={['#213448', '#547792', '#94B4C1', '#EAE0CF']}
            />
          ) : (
            <FloatingLines
              enabledWaves={['bottom']}
              lineCount={2}
              lineDistance={8}
              animationSpeed={0.5}
              interactive={false}
              parallax={false}
              mixBlendMode="normal"
              pixelRatio={1}
              linesGradient={['#213448', '#547792', '#94B4C1', '#EAE0CF']}
            />
          )}
        </Suspense>

        <div className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 text-sm px-3 py-1.5 sm:px-4 sm:py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{backHome}</span>
              </Link>
              <img src={logo} alt="Allync" className="h-7 sm:h-9" />
            </div>
            <button
              onClick={() => setLanguage(prev => prev === 'tr' ? 'en' : 'tr')}
              className="text-sm px-3 py-1.5 sm:px-4 sm:py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all"
            >
              {language === 'tr' ? 'EN' : 'TR'}
            </button>
          </div>
        </div>

        <div className="relative z-10 pt-24 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 sm:mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
                <FileText className="w-4 h-4 text-[#94B4C1]" />
                <span className="text-sm text-gray-400">{lastUpdated}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                {title}
              </h1>
              <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
                {subtitle}
              </p>
            </motion.div>

            <div className="space-y-4 sm:space-y-6">
              {sections.map((section, index) => (
                <SectionCard key={index} section={section} index={index} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-12 sm:mt-16 text-center"
            >
              <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-6 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl">
                {['Meta Verified Tech Provider', 'ISO 27001 Aligned', 'GDPR', 'KVKK', 'SOC 2 Aligned', 'Qatar PDPPL'].map((badge) => (
                  <div key={badge} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-[breathing_2s_ease-in-out_infinite]" />
                    <span className="text-gray-400 text-xs sm:text-sm">{badge}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-gray-500 text-xs sm:text-sm space-y-1.5">
                <p>{language === 'tr' ? 'Allyncai, ALLYNC\'in tescilli markasıdır' : 'Allyncai is a registered brand of ALLYNC'}</p>
                <p>{language === 'tr' ? 'Yeni Mah. Sefer Sk. No:1 İç Kapı No:1 İnegöl/Bursa - Türkiye' : 'Yeni Mah. Sefer Sk. No:1 Ic Kapi No:1 Inegol/Bursa - Turkiye'}</p>
                <p>{language === 'tr' ? 'Şirket Tescil No:' : 'Company Registration No:'} 8950466196 · DUNS: 751168710</p>
                <p className="pt-3">Copyright 2024-2026 ALLYNC. {language === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};
