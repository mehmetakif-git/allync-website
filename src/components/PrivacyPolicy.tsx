import React, { useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HelmetProvider } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Shield, Lock, Eye, Database, Globe, Cookie, Clock,
  UserCheck, Mail, Share2, Plane, FileText, Users, Scale,
  Link2, RefreshCw, CheckCircle, Phone, MapPin, Building
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

export const PrivacyPolicy: React.FC = () => {
  const [language, setLanguage] = useState<'tr' | 'en'>('tr');
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const sections: Section[] = language === 'tr' ? [
    {
      icon: FileText,
      heading: '1. Giriş',
      content: (
        <>
          <p>Allync ("biz", "bizim", "Allync", "AllyncAI") gizliliğinize saygı duyar ve kişisel verilerinizi korumaya kararlıdır. Bu Gizlilik Politikası, web sitemizi (allyncai.com), mobil uygulamalarımızı, WhatsApp Business ve Instagram Business mesajlaşma hizmetlerimizi, yapay zeka destekli asistanlarımızı, SaaS platformlarımızı ve sunduğumuz diğer tüm dijital hizmetleri (toplu olarak "Hizmetler") kullandığınızda kişisel bilgilerinizi nasıl topladığımızı, kullandığımızı, sakladığımızı, paylaştığımızı ve koruduğumuzu açıklar.</p>
          <p className="text-gray-300 bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 mt-3">ALLYNC, Meta Platforms, Inc. tarafından <span className="font-medium">Doğrulanmış Teknoloji Sağlayıcı (Verified Tech Provider)</span> olarak yetkilendirilmiştir. Bu sıfatla işletmelerin WhatsApp Business API ve Instagram Business hesaplarını platformumuza Meta'nın resmi onay süreçleri çerçevesinde bağlamasına aracılık ederiz; Meta tarafından belirlenen veri işleme ve uyumluluk standartlarına bağlı kalırız.</p>
        </>
      )
    },
    {
      icon: Building,
      heading: '2. Veri Sorumlusu',
      content: (
        <>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 space-y-2">
            <p><span className="text-gray-300 font-medium">Şirket:</span> ALLYNC</p>
            <p><span className="text-gray-300 font-medium">Marka:</span> Allyncai, ALLYNC'in tescilli markasıdır</p>
            <p><span className="text-gray-300 font-medium">Şirket Tescil No:</span> 8950466196</p>
            <p><span className="text-gray-300 font-medium">D-U-N-S No:</span> 751168710</p>
            <p><span className="text-gray-300 font-medium">Merkez:</span> Yeni Mah. Sefer Sk. No:1 İç Kapı No:1 İnegöl/Bursa - Türkiye</p>
            <p><span className="text-gray-300 font-medium">Ek Ofis:</span> Doha, Katar</p>
            <p><span className="text-gray-300 font-medium">E-posta:</span> info@allyncai.com</p>
            <p><span className="text-gray-300 font-medium">Telefon:</span> +974 5107 9565 / +90 536 247 7824</p>
            <p><span className="text-gray-300 font-medium">Web:</span> allyncai.com</p>
          </div>
          <p className="mt-3">ALLYNC (Allyncai), Genel Veri Koruma Yönetmeliği (GDPR), Türk Kişisel Verilerin Korunması Kanunu (KVKK - 6698 sayılı Kanun) ve Katar Kişisel Verilerin Gizliliğini Koruma Kanunu (2016 tarihli 13 sayılı Kanun) uyarınca Hizmetlerimiz aracılığıyla işlenen kişisel veriler için Veri Sorumlusu olarak hareket etmektedir.</p>
        </>
      )
    },
    {
      icon: Database,
      heading: '3. Topladığımız Kişisel Veriler',
      content: (
        <>
          <SubHeading>3.1 Doğrudan Sağladığınız Veriler</SubHeading>
          <BulletList items={[
            'Kimlik Verileri: Ad-soyad, kullanıcı adı, unvan',
            'İletişim Verileri: E-posta adresi, telefon numarası, posta adresi',
            'İşletme Verileri: Şirket adı, sektör, iş unvanı, iş gereksinimleri',
            'Hesap Verileri: Giriş bilgileri, hesap tercihleri, ayarlar',
            'İletişim Verileri: WhatsApp, e-posta, iletişim formları veya destek kanalları üzerinden gönderilen mesajlar',
            'Ödeme Verileri: Fatura adresi, ödeme yöntemi detayları (üçüncü taraf ödeme sağlayıcıları tarafından işlenir)',
            'İçerik Verileri: Hizmetlerimize yüklediğiniz dosyalar, belgeler, görseller veya diğer içerikler'
          ]} />
          <SubHeading>3.2 Otomatik Toplanan Veriler</SubHeading>
          <BulletList items={[
            'Teknik Veriler: IP adresi, tarayıcı türü ve sürümü, işletim sistemi, cihaz türü, cihaz tanımlayıcıları',
            'Kullanım Verileri: Ziyaret edilen sayfalar, kullanılan özellikler, sayfalarda geçirilen süre, tıklama kalıpları',
            'Konum Verileri: IP adresine dayalı yaklaşık konum (hassas GPS konumu değil)',
            'Çerez Verileri: Çerezler ve benzer izleme teknolojileri aracılığıyla toplanan bilgiler'
          ]} />
          <SubHeading>3.3 WhatsApp Business API Verileri</SubHeading>
          <BulletList items={[
            'WhatsApp hesabınızla ilişkili telefon numarası',
            'Profil adı ve profil fotoğrafı',
            'Metin, görseller, belgeler, sesli mesajlar ve diğer medya dahil mesaj içerikleri',
            'Zaman damgaları, okundu bilgisi ve iletim durumu dahil mesaj meta verileri',
            'Aktif oturumlar içinde bağlam sürekliliği için konuşma geçmişi'
          ]} />
          <SubHeading>3.4 Instagram Business (Meta Graph API) Verileri</SubHeading>
          <p className="text-xs text-gray-500 -mt-1 mb-2">Bir Instagram Business hesabını platformumuza bağlamayı tercih ettiğinizde toplanır.</p>
          <BulletList items={[
            'Bağlanan Instagram Business hesabının kullanıcı adı (username) ve Instagram User ID',
            'Hesap profil fotoğrafı (yalnızca panel görüntüsü için)',
            'Yetkilendirme sırasında Meta tarafından sağlanan, 60 gün geçerli yenilenebilir uzun ömürlü erişim tokenı (yalnızca işletme hesabınız adına Meta Graph API çağrıları yapmak için, asla son kullanıcılarla paylaşılmaz)',
            'Talep edilen Meta izinleri: instagram_business_basic (hesap kimliği), instagram_business_manage_messages (Direct Mesajlara yanıt vermek için), instagram_business_manage_comments (yorumları okumak ve yanıtlamak için) — fazlası talep edilmez',
            'Hesabınıza Direct Mesaj gönderen son kullanıcıların IGSID değeri (Instagram-scoped ID), kullanıcı adı ve profil fotoğrafı URL\'si — yalnızca konuşma kimliği ve görüntüsü için',
            'Direct Mesaj içerikleri: metin, görseller, sesli mesajlar, hikaye yanıtları, paylaşılan medya ve sticker/etiket türleri',
            'Mesaj zaman damgaları, iletim durumu, okundu bilgisi (read receipts)',
            'İşletme gönderilerinin altındaki yalnızca üst seviye yorumlar — yorumcunun IGSID değeri, kullanıcı adı, yorum metni, gönderi (media) bağlantısı; yanıt verilen yorumlar (alt-yorumlar) işlenmez'
          ]} />
          <SubHeading>3.5 Yapay Zeka Hizmeti Verileri</SubHeading>
          <BulletList items={[
            'Yapay zeka sistemlerine sağlanan giriş verileri (metin, görseller, belgeler, ses)',
            'Yapay zeka sistemleri tarafından üretilen çıktı verileri',
            'Yapay zeka asistanlarıyla etkileşim kalıpları',
            'Yapay zeka yanıtlarına verdiğiniz geri bildirim ve değerlendirmeler'
          ]} />
          <SubHeading>3.6 Üçüncü Taraf Verileri</SubHeading>
          <BulletList items={[
            'Meta Platforms: WhatsApp Business API ve Instagram Graph API olay verileri (mesaj, yorum, durum güncellemeleri)',
            'Google Hizmetleri: Takvim, Sheets, Drive verileri (entegrasyonları yetkilendirdiğinizde)',
            'Analitik sağlayıcıları: Toplu kullanım istatistikleri',
            'İş ortakları: Referans bilgileri'
          ]} />
          <SubHeading>3.7 Türetilmiş ve Operasyonel Veriler</SubHeading>
          <p className="text-xs text-gray-500 -mt-1 mb-2">Hizmetin işletilmesi ve Meta uyumluluğu için sistem tarafından üretilen veya kayıt altına alınan veriler.</p>
          <BulletList items={[
            'Duygu analizi sonuçları: konuşmaya atanan duygu etiketi (pozitif/nötr/negatif), puan, özet, niyet (intent), konu etiketleri ve önerilen aksiyon',
            'Pazarlama vazgeçme (opt-out / STOP) bilgileri: müşterinin gönderdiği vazgeçme kelimesi, vazgeçme zaman damgası — Meta\'nın WhatsApp politikasına uyum için zorunludur',
            'SLA ve yanıt süresi metrikleri: ilk yanıt süresi, gecikmiş yanıt bayrakları (yalnızca toplam hesaplama için)',
            'Sesli mesaj transkriptleri ve sesli yanıt dosya referansları (bkz. Bölüm 5.7)',
            'Tarayıcı bildirim abonelikleri: tarayıcı tarafından üretilen endpoint ve şifreleme anahtarları (yalnızca panel bildirimi göndermek için kullanılır; içeriği üçüncü taraflara açılmaz)',
            'Geliştirici API anahtarları: kriptografik olarak geri çevrilemez biçimde hashlenmiş halde saklanır; ham anahtar tarafımızda tutulmaz',
            'Denetim (audit) kayıtları: kullanıcı eylemleri, IP adresi, tarayıcı kimliği (user agent), istek yolu, HTTP durum kodu — güvenlik ve hesap verebilirlik için (bkz. Bölüm 8)'
          ]} />
        </>
      )
    },
    {
      icon: Eye,
      heading: '4. Verilerinizi Nasıl Kullanıyoruz',
      content: (
        <>
          <SubHeading>4.1 Hizmet Sunumu</SubHeading>
          <BulletList items={[
            'Yapay zeka asistan hizmetlerimizi sağlama ve sürdürme',
            'WhatsApp mesajlarınızı işleme ve yanıtlama',
            'SaaS panel hesaplarınızı ve aboneliklerinizi yönetme',
            'Web, mobil ve dijital pazarlama hizmetleri sunma',
            'Randevu, sipariş ve hizmet taleplerini işleme'
          ]} />
          <SubHeading>4.2 Hizmet İyileştirme</SubHeading>
          <BulletList items={[
            'Hizmet kalitesini artırmak için kullanım kalıplarını analiz etme',
            'Yapay zeka model doğruluğunu eğitme ve iyileştirme (yalnızca anonimleştirilmiş ve toplu veriler kullanılarak)',
            'Yeni özellikler ve hizmetler geliştirme',
            'İç araştırma ve analitik yürütme'
          ]} />
          <SubHeading>4.3 İletişim</SubHeading>
          <BulletList items={[
            'Sorularınıza ve destek taleplerinize yanıt verme',
            'Hizmetle ilgili bildirimler gönderme',
            'Projeleriniz veya hizmetleriniz hakkında güncellemeler sağlama',
            'Pazarlama iletişimleri gönderme (yalnızca açık rızanızla)'
          ]} />
          <SubHeading>4.4 Hukuki İşleme Dayanağı (GDPR Madde 6)</SubHeading>
          <DataTable
            headers={['Amaç', 'Hukuki Dayanak']}
            rows={[
              ['Hizmet sunumu', 'Sözleşmenin ifası'],
              ['WhatsApp AI yanıtları', 'Meşru menfaat / Rıza'],
              ['Hizmet iyileştirme', 'Meşru menfaat'],
              ['Pazarlama iletişimleri', 'Açık rıza'],
              ['Hukuki uyumluluk', 'Hukuki yükümlülük'],
              ['Güvenlik ve dolandırıcılık önleme', 'Meşru menfaat'],
            ]}
          />
        </>
      )
    },
    {
      icon: Globe,
      heading: '5. WhatsApp Business API, Instagram Business & Yapay Zeka Entegrasyonu',
      content: (
        <>
          <SubHeading>5.1 WhatsApp Business API</SubHeading>
          <p>Hizmetlerimiz Meta Platforms, Inc. tarafından sağlanan WhatsApp Business API ile entegredir. ALLYNC, Meta\'nın Doğrulanmış Teknoloji Sağlayıcı (Verified Tech Provider) programı kapsamında resmi WhatsApp Embedded Signup akışı üzerinden işletmelerin WhatsApp Business hesabı bağlamasına aracılık eder.</p>
          <BulletList items={[
            'Mesajlar, Meta\'nın Gizlilik Politikasına tabi olan Meta altyapısı üzerinden iletilir',
            'Yapay zeka destekli yanıtlar sağlamak için mesajları alır ve işleriz',
            'Hizmet sunumu için açıkça gerekli olmadıkça mesaj içeriklerini aktif konuşma oturumunun ötesinde SAKLAMAYIZ',
            'WhatsApp mesajlarınızı reklam amaçlı üçüncü taraflarla SATMAZ veya PAYLAŞMAYIZ',
            'Mesajlarınızı talep ettiğiniz hizmetle ilgisi olmayan amaçlar için KULLANMAYIZ',
            'Meta\'nın 24 saatlik müşteri hizmetleri penceresi dışındaki tüm proaktif gönderimler yalnızca Meta tarafından önceden onaylanmış şablonlar ile yapılır'
          ]} />
          <SubHeading>5.2 Instagram Graph API</SubHeading>
          <p>Hizmetlerimiz Meta Platforms tarafından sağlanan Instagram Graph API ile entegredir. Instagram Business hesabınızı bağlamak için Meta\'nın resmi Instagram OAuth akışını kullanırız.</p>
          <BulletList items={[
            'WhatsApp ve Instagram entegrasyonları birbirinden tamamen izole edilmiş ayrı Meta uygulamalarında çalışır; birinin yetkilendirme tokenı diğerine erişim sağlamaz',
            'Yalnızca işletme hesabınız adına Direct Mesajları okumak/yanıtlamak ve yorumları işlemek için gerekli minimum izinleri talep ederiz (instagram_business_basic, instagram_business_manage_messages, instagram_business_manage_comments)',
            'Profil bilgilerinizi (takipçi listesi, hikaye görüntüleyenler, beğeniler, aramalar gibi) talep ETMEYİZ ve TOPLAMAYIZ — yalnızca DM ve yorum verisi işlenir',
            'Gelen webhook olayları, Meta\'nın gönderdiği `x-hub-signature-256` HMAC imzasıyla doğrulanır; geçersiz imzalı istekler reddedilir',
            'Yapay zeka tarafından üretilen yanıtlar yalnızca son kullanıcı tarafından başlatılan bir DM\'e ya da bir yoruma cevap olarak gönderilir; biz hiçbir zaman proaktif (kullanıcının başlatmadığı) DM göndermeyiz',
            'Instagram mesajlarınızı reklam amaçlı üçüncü taraflarla SATMAZ veya PAYLAŞMAYIZ',
            'Instagram konuşmalarınızı genel yapay zeka modellerini eğitmek için KULLANMAYIZ'
          ]} />
          <SubHeading>5.3 Instagram Yorum İşleme</SubHeading>
          <BulletList items={[
            'Yalnızca işletme gönderilerinin altındaki üst seviye yorumlar işlenir; başka kullanıcıların yorumlarına verilen alt-yorumlar yok sayılır',
            'Aynı son kullanıcı + aynı gönderi kombinasyonu için 24 saat içinde en fazla bir AI yanıtı verilir; bu sınır spam ve mükerrer cevapları önlemek için uygulanır',
            'Bir yoruma yanıt iki bölümden oluşabilir: (a) gönderi altında herkese açık kısa bir cevap (en fazla 900 karakter, hiçbir bağlantı veya kişisel bilgi içermez) ve (b) Meta\'nın 7 günlük "private reply" penceresinde gönderilen tek seferlik bir özel mesaj (en fazla 950 karakter)',
            'Yorum içeriği en fazla 4000 karakter olarak saklanır; daha uzun yorumlar Meta API gereği kırpılır'
          ]} />
          <SubHeading>5.4 Yapay Zeka İşleme</SubHeading>
          <BulletList items={[
            'Yapay zeka yanıtları, son kullanıcının gönderdiği mesaj metni temel alınarak gerçek zamanlı oluşturulur; önceden yazılmış değildir',
            'Kişisel konuşmalarınızı (WhatsApp veya Instagram) genel yapay zeka modellerini eğitmek için KULLANMAYIZ',
            'Yapay zeka modeli sağlayıcımıza (Anthropic) yalnızca mesaj metni iletilir; son kullanıcının profil fotoğrafı, telefon numarası veya IGSID değeri model çağrısına dahil edilmez',
            'Yapay zeka etkileşimleri güvenli, şifrelenmiş altyapıda işlenir',
            'İnsan incelemesi yalnızca işletme kullanıcısının (tenant) kendi panelinde gerçekleşir; Allync personeli müşteri konuşmalarını yalnızca açık bir destek/anlaşmazlık talebi olduğunda denetler ve bu eylem denetim kayıtlarına yazılır'
          ]} />
          <SubHeading>5.5 Mesaj Saklama</SubHeading>
          <BulletList items={[
            'Aktif konuşma bağlamı hizmet sürekliliği için korunur',
            'Profil fotoğrafları yalnızca konuşmayı tanımanız için Meta CDN URL\'si olarak saklanır; medya dosyalarını sunucularımıza kopyalamayız',
            'Mesaj meta verileri analitik ve hizmet iyileştirme için saklanabilir (anonimleştirilmiş)',
            'Konuşma geçmişinizin silinmesini istediğiniz zaman talep edebilirsiniz'
          ]} />
          <SubHeading>5.6 Bağlantıyı Kaldırma ve Veri Silme</SubHeading>
          <BulletList items={[
            'Hesabınızı panelden bağlantısını kestiğinizde, Allync sunucularındaki erişim tokenı geçersiz kılınır ve daha sonra Meta tarafına hiçbir API çağrısı yapılmaz',
            'Meta\'nın resmi "Deauthorize" ve "Data Deletion Request" geri çağrıları (deauthorize callback / data deletion callback) bizim tarafımızdan uygulanmıştır; Meta tarafından gönderilen silme talepleri Meta\'nın belirlediği biçimde yanıtlanır',
            'İşletme yöneticisi (tenant owner) panel üzerinden tek tek mesaj, konuşma veya tüm iletişim geçmişini silebilir',
            'Veri silme talebinizi info@allyncai.com adresinden 30 gün içinde işleme alırız (Bölüm 11 — Haklarınız)'
          ]} />
          <SubHeading>5.7 Sesli Mesaj İşleme (Opsiyonel Özellik)</SubHeading>
          <p>İşletme bir konuşmada gelen sesli mesajları yapay zeka tarafından işlenecek şekilde yapılandırırsa veya AI yanıtının sesli olarak gönderilmesini etkinleştirirse, sesli mesaj akışı şu şekilde çalışır:</p>
          <BulletList items={[
            'Gelen sesli mesajlar transkripsiyon için OpenAI\'nin Whisper konuşma-metin servisine iletilir',
            'OpenAI bu veriyi yalnızca sesli içeriğin metne dönüştürülmesi için kullanır; OpenAI API hizmet şartları gereği müşteri verisi genel model eğitiminde kullanılmaz',
            'Üretilen transkript, mesaj geçmişinin metin alanına kaydedilir; orijinal ses dosyası tarafımızca kalıcı olarak depolanmaz',
            'AI sesli yanıt verirse, yanıt OpenAI Text-to-Speech servisi ile üretilir ve teslimat amacıyla güvenli bir depolama alanında kısa süreli tutulur',
            'Sesli mesaj işleme özelliğini istediğiniz zaman tenant ayarlarından devre dışı bırakabilirsiniz'
          ]} />
          <SubHeading>5.8 Duygu Analizi (Tenant Tarafından Tetiklenir)</SubHeading>
          <BulletList items={[
            'İşletme kullanıcısı (tenant) bir konuşma için "Yeniden Analiz Et" eylemini tetiklerse, son mesajların metin içeriği Anthropic Claude modeline duygu, niyet ve konu sınıflandırması için iletilir',
            'Sonuç (duygu etiketi, puan, özet, niyet, konular, önerilen aksiyon) konuşma kaydına ve tarihsel bir kayıt olarak işlenir',
            'Anthropic\'e yalnızca mesaj içerikleri gönderilir; müşterinin profil fotoğrafı, telefon numarası veya IGSID değeri model çağrısına dahil edilmez',
            'Anthropic, müşteri konuşmalarını genel model eğitiminde kullanmaz (kurumsal API anlaşması kapsamında)'
          ]} />
        </>
      )
    },
    {
      icon: Share2,
      heading: '6. Veri Paylaşımı',
      content: (
        <>
          <SubHeading>6.1 Veri Paylaştığımız Taraflar</SubHeading>
          <BulletList items={[
            'Meta Platforms: WhatsApp Business API ve Instagram Graph API gereği (mesaj, yorum ve durum güncellemelerinin iletimi)',
            'Anthropic: AI yanıt üretimi ve duygu analizi için — kurumsal DPA kapsamında, yalnızca mesaj metni iletilir, müşteri konuşmaları model eğitiminde kullanılmaz',
            'OpenAI: Sesli mesaj transkripsiyonu ve sesli AI yanıtı için — yalnızca tenant bu özelliği etkinleştirdiğinde, API hizmet şartları kapsamında, model eğitiminde kullanılmaz',
            'Tarayıcı/işletim sistemi push hizmetleri: Tarayıcınız tarafından oluşturulan push abonelik endpoint\'i üzerinden yalnızca şifrelenmiş bildirim payload\'ı iletilir; mesaj içerikleri push servisine açılmaz',
            'Google: Yetkilendirdiğiniz Calendar / Sheets / Drive entegrasyonları için (yalnızca işletmenin paylaştığı kaynaklara erişilir)',
            'Bulut altyapı sağlayıcıları: Kurumsal sınıf barındırma ve veri tabanı hizmetleri (DPA anlaşmaları kapsamında)',
            'E-posta iletim sağlayıcısı: Davet, parola sıfırlama ve sistem bildirimleri için (yalnızca işletme kullanıcılarına gönderilir; son müşteri konuşma içeriği gönderilmez)',
            'Ödeme işlemcileri: Faturalandırma için (PCI DSS uyumlu sağlayıcılar)',
            'Analitik sağlayıcıları: Yalnızca toplu, anonimleştirilmiş kullanım verileri'
          ]} />
          <SubHeading>6.2 Yapmadıklarımız</SubHeading>
          <BulletList items={[
            'Kişisel verilerinizi üçüncü taraflara SATMAYIZ',
            'Verilerinizi üçüncü taraf reklam amaçları için PAYLAŞMAYIZ',
            'Uygun güvenceler olmadan yeterli veri korumasına sahip olmayan ülkelere veri AKTARMAYIZ',
            'WhatsApp veya Instagram mesajlarınızı hizmet sunumu kapsamı dışında kimseyle PAYLAŞMAYIZ',
            'Instagram takipçi listenizi, hikaye görüntüleyenleri, beğenileri veya keşfet/arama geçmişinizi TOPLAMAYIZ'
          ]} />
          <SubHeading>6.3 Yasal Açıklama</SubHeading>
          <p>Verilerinizi mahkeme kararları, kolluk kuvvetleri talepleri, yasal haklarımızın korunması veya dolandırıcılık önleme gerektirdiğinde açıklayabiliriz.</p>
        </>
      )
    },
    {
      icon: Plane,
      heading: '7. Uluslararası Veri Transferleri',
      content: (
        <>
          <p>Verileriniz, Türkiye, Katar, Amerika Birleşik Devletleri ve Avrupa Birliği dahil ancak bunlarla sınırlı olmamak üzere, ikamet ettiğiniz ülke dışındaki ülkelere aktarılabilir ve buralarda işlenebilir. Uluslararası veri aktarımlarında uygun güvencelerin mevcut olmasını sağlarız:</p>
          <BulletList items={[
            'Avrupa Komisyonu tarafından onaylanan Standart Sözleşme Hükümleri (SCC)',
            'Tüm hizmet sağlayıcılarla Veri İşleme Anlaşmaları (DPA)',
            'Uygulanabilir olduğunda yeterlilik kararları',
            'Gerektiğinde açık rızanız'
          ]} />
        </>
      )
    },
    {
      icon: Lock,
      heading: '8. Veri Güvenliği',
      content: (
        <>
          <SubHeading>Teknik Önlemler</SubHeading>
          <BulletList items={[
            'Aktarım halindeki tüm veriler için TLS/SSL şifreleme (HTTPS)',
            'Durağan veriler için AES-256 şifreleme',
            'Hassas iletişimler için uçtan uca şifreleme',
            'Düzenli güvenlik denetimleri ve sızma testleri',
            'Web Uygulaması Güvenlik Duvarı (WAF) koruması',
            'DDoS azaltma',
            'Otomatik güvenlik açığı taraması'
          ]} />
          <SubHeading>Organizasyonel Önlemler</SubHeading>
          <BulletList items={[
            'Tüm sistemler için rol tabanlı erişim kontrolü (RBAC)',
            'Çalışan güvenlik eğitimi ve farkındalık programları',
            'Tüm alt işlemcilerle veri işleme anlaşmaları',
            'Olay müdahale planı ve ihlal bildirim prosedürleri',
            'Düzenli güvenlik politikası incelemeleri',
            'ISO 27001 kontrol çerçevesine uygun güvenlik yönetimi'
          ]} />
          <SubHeading>Altyapı</SubHeading>
          <BulletList items={[
            'Kurumsal sınıf bulut altyapısında barındırma',
            'Coğrafi yedeklilik ile otomatik yedekleme',
            '%99.9 çalışma süresi SLA',
            'SOC 2 Type II kontrol çerçevesine uyumlu altyapı kontrolleri'
          ]} />
          <SubHeading>Denetim (Audit) Kayıtları</SubHeading>
          <p>Güvenlik, hesap verebilirlik ve mevzuat uyumluluğu (KVKK / GDPR) için her hassas eylem (giriş, bağlantı oluşturma/silme, veri silme talebi, yapay zeka ataması, izinli rol değişikliği vb.) denetim kaydına yazılır. Bu kayıtlar şunları içerir:</p>
          <BulletList items={[
            'Kullanıcı kimliği (user_id) ve rolü',
            'Olay tipi, kategori ve önem derecesi',
            'IP adresi ve tarayıcı kimlik bilgisi (user agent)',
            'Cihaz tipi, işletim sistemi ve tarayıcı (parse edilmiş)',
            'İstek yolu, HTTP metodu ve durum kodu',
            'Olaya özel meta veriler (örn. silinen kayıt sayısı; müşteri mesaj içeriği yazılmaz)'
          ]} />
          <p>Denetim kaydı saklama süresi tenant tarafından yapılandırılabilir; varsayılan en az 90 gündür. Kayıtlar yalnızca işletme yöneticisi (tenant owner) ve Allync süper-yöneticisi tarafından okunabilir.</p>
          <SubHeading>Hata İzleme</SubHeading>
          <p>Beklenmeyen hatalar, kendi altyapımızda barındırılan dahili bir hata izleme sistemine iletilir; üçüncü taraf bir SaaS hizmeti kullanılmaz. Telemetri payload\'larında telefon numaraları, e-posta adresleri, kimlik doğrulama token\'ları ve hizmet sağlayıcı gizli anahtarları gönderim öncesinde otomatik olarak maskelenir.</p>
        </>
      )
    },
    {
      icon: Cookie,
      heading: '9. Çerezler ve İzleme',
      content: (
        <>
          <SubHeading>9.1 Kullandığımız Çerez Türleri</SubHeading>
          <DataTable
            headers={['Çerez Türü', 'Amaç', 'Süre', 'Zorunlu']}
            rows={[
              ['Zorunlu', 'Site işlevselliği, güvenlik, oturum yönetimi', 'Oturum', 'Evet'],
              ['Analitik', 'Performans takibi, kullanım istatistikleri', '2 yıla kadar', 'Hayır'],
              ['Tercih', 'Dil, tema, görüntüleme ayarları', '1 yıla kadar', 'Hayır'],
              ['Pazarlama', 'Reklam performans takibi (yalnızca rızayla)', '1 yıla kadar', 'Hayır'],
            ]}
          />
          <SubHeading>9.2 Çerez Yönetimi</SubHeading>
          <BulletList items={[
            'Tarayıcı ayarlarınızdan çerez tercihlerini yönetebilirsiniz',
            'Zorunlu çerezler hizmet işletimi için gerekli olduğundan devre dışı bırakılamaz',
            'Analitik çerezleri istediğiniz zaman reddedebilirsiniz',
            '"İzlemeyin" tarayıcı sinyallerini dikkate alırız'
          ]} />
          <SubHeading>9.3 Üçüncü Taraf Çerezleri</SubHeading>
          <BulletList items={[
            'Google Analytics (analitik)',
            'Meta Pixel (pazarlama, yalnızca rızayla)',
            'Hotjar (kullanıcı deneyimi analizi, yalnızca rızayla)'
          ]} />
        </>
      )
    },
    {
      icon: Clock,
      heading: '10. Veri Saklama Süreleri',
      content: (
        <>
          <DataTable
            headers={['Veri Türü', 'Saklama Süresi', 'Dayanak']}
            rows={[
              ['Hesap verileri', 'Hizmet süresi + 2 yıl', 'Sözleşme'],
              ['WhatsApp mesajları', 'Yalnızca aktif oturum', 'Meşru menfaat'],
              ['Instagram Direct Mesajlar', 'Yalnızca aktif oturum', 'Meşru menfaat'],
              ['Instagram yorumları', 'İşletme silene kadar (üst seviye, en fazla 4000 karakter)', 'Meşru menfaat / Meta API gereği'],
              ['Meta erişim tokenları', 'Bağlantı kesilene kadar (60 günlük rotasyon)', 'Sözleşme / API gerekliliği'],
              ['Sesli mesaj transkriptleri', 'Konuşma ile aynı (ayrı saklanmaz)', 'Meşru menfaat'],
              ['Sesli AI yanıt dosyaları', 'Teslimat sonrası 24 saat içinde silinir', 'Operasyonel gereklilik'],
              ['Duygu analizi sonuçları + geçmişi', 'Konuşma süresi (silindiğinde birlikte silinir)', 'Meşru menfaat'],
              ['Pazarlama vazgeçme (STOP) kayıtları', 'İşletme bağlantısı süresi', 'Yasal yükümlülük (Meta WhatsApp politikası)'],
              ['Web Push abonelikleri', 'Kullanıcı silene veya tarayıcı geçersiz kılana kadar', 'Açık rıza'],
              ['Geliştirici API anahtarı (hash)', 'Anahtar iptal edilene kadar', 'Sözleşme'],
              ['Denetim (audit) kayıtları', 'Tenant tarafından yapılandırılır (varsayılan ≥ 90 gün)', 'Hukuki yükümlülük / Güvenlik'],
              ['Hata izleme olayları', '90 gün', 'Güvenlik / Hizmet sürekliliği'],
              ['İşlem kayıtları', '10 yıl', 'Yasal yükümlülük (vergi)'],
              ['Analitik verileri', '26 ay (anonimleştirilmiş)', 'Meşru menfaat'],
              ['Destek talepleri', 'Çözümden 3 yıl sonra', 'Meşru menfaat'],
              ['Pazarlama rıza kayıtları', 'Rıza süresi + 3 yıl', 'Yasal yükümlülük'],
              ['Sunucu günlükleri', '90 gün', 'Güvenlik'],
              ['Yedek veriler', 'Silme talebinden 30 gün sonra', 'Operasyonel gereklilik'],
            ]}
          />
          <p className="mt-3">Saklama süresi dolduğunda veriler güvenli bir şekilde silinir veya anonimleştirilir. Yasal saklama yükümlülüklerine tabi olarak erken silme talep edebilirsiniz.</p>
        </>
      )
    },
    {
      icon: UserCheck,
      heading: '11. Haklarınız',
      content: (
        <>
          <SubHeading>11.1 GDPR Kapsamında (AB Sakinleri)</SubHeading>
          <BulletList items={[
            'Erişim Hakkı: Kişisel verilerinizin bir kopyasını alma',
            'Düzeltme Hakkı: Yanlış veya eksik verileri düzeltme',
            'Silme Hakkı: Verilerinizin silinmesini talep etme ("unutulma hakkı")',
            'İşlemeyi Kısıtlama Hakkı: Verilerinizin nasıl kullanıldığını sınırlama',
            'Veri Taşınabilirliği Hakkı: Verilerinizi yapılandırılmış, makine tarafından okunabilir formatta alma',
            'İtiraz Hakkı: Meşru menfaate dayalı işlemeye itiraz etme',
            'Rızayı Geri Çekme Hakkı: Önceki işlemeyi etkilemeden rızanızı istediğiniz zaman geri çekme',
            'Şikayet Hakkı: Denetim makamına şikayette bulunma'
          ]} />
          <SubHeading>11.2 KVKK Kapsamında (Türkiye Sakinleri)</SubHeading>
          <p className="mb-2">6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında:</p>
          <BulletList items={[
            'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
            'İşlenmişse buna ilişkin bilgi talep etme',
            'İşleme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme',
            'Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme',
            'Eksik veya yanlış işlenmişse düzeltilmesini isteme',
            'KVKK\'nın 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme',
            'Yapılan işlemlerin kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme',
            'İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme',
            'Kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması halinde zararın giderilmesini talep etme'
          ]} />
          <SubHeading>11.3 Katar Kanunu Kapsamında (Katar Sakinleri)</SubHeading>
          <BulletList items={[
            'Veri işleme hakkında bilgilendirilme hakkı',
            'Kişisel verilerinize erişim hakkı',
            'Yanlış verileri düzeltme hakkı',
            'Silme talep etme hakkı',
            'İşlemeye itiraz hakkı'
          ]} />
          <SubHeading>11.4 Haklarınızı Nasıl Kullanabilirsiniz</SubHeading>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 space-y-2">
            <p><span className="text-gray-300 font-medium">E-posta:</span> info@allyncai.com</p>
            <p><span className="text-gray-300 font-medium">Konu Satırı:</span> "Gizlilik Hakları Talebi"</p>
            <p><span className="text-gray-300 font-medium">Yanıt Süresi:</span> Talebinizi aldıktan sonra 30 gün içinde</p>
            <p><span className="text-gray-300 font-medium">Doğrulama:</span> Talebinizi işlemeden önce kimliğinizi doğrulamamız gerekebilir</p>
          </div>
        </>
      )
    },
    {
      icon: Users,
      heading: '12. Çocukların Gizliliği',
      content: (
        <p>Hizmetlerimiz 16 yaşından küçük çocuklara yönelik değildir. Bilerek çocuklardan kişisel veri toplamayız. Bir çocuktan veri topladığımızı düşünüyorsanız, lütfen derhal info@allyncai.com adresinden bizimle iletişime geçin, ilgili verileri hemen sileceğiz.</p>
      )
    },
    {
      icon: Link2,
      heading: '13. Üçüncü Taraf Bağlantıları',
      content: (
        <p>Hizmetlerimiz üçüncü taraf web sitelerine ve hizmetlere bağlantılar içerebilir. Bu üçüncü tarafların gizlilik uygulamalarından sorumlu değiliz. Herhangi bir kişisel veri sağlamadan önce ilgili gizlilik politikalarını okumanızı tavsiye ederiz.</p>
      )
    },
    {
      icon: RefreshCw,
      heading: '14. Politika Değişiklikleri',
      content: (
        <>
          <p>Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler yaptığımızda:</p>
          <BulletList items={[
            'En üstteki "Son Güncelleme" tarihini güncelleyeceğiz',
            'Önemli değişiklikler için sizi e-posta veya Hizmetlerimiz aracılığıyla bilgilendireceğiz',
            'Değişikliklerden sonra Hizmetlerimizi kullanmaya devam etmeniz kabul anlamına gelir'
          ]} />
        </>
      )
    },
    {
      icon: Scale,
      heading: '15. Uyumluluk',
      content: (
        <>
          <p>Bu Gizlilik Politikası aşağıdakilerle uyumludur:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
            {[
              { label: 'GDPR', desc: 'Genel Veri Koruma Yönetmeliği (AB)' },
              { label: 'KVKK', desc: 'Kişisel Verilerin Korunması Kanunu (Türkiye)' },
              { label: 'Katar PDPPL', desc: 'Kişisel Veri Gizliliği Koruma Kanunu' },
              { label: 'Meta Verified Tech Provider', desc: 'WhatsApp Business ve Instagram Business için Meta tarafından onaylı sağlayıcı' },
              { label: 'WhatsApp Business Policy', desc: 'WhatsApp Business API gereksinimleri ve mesajlaşma politikası' },
              { label: 'Instagram Platform Policy', desc: 'Instagram Graph API ve mesajlaşma kuralları' },
              { label: 'ISO 27001 Aligned', desc: 'Bilgi Güvenliği Yönetimi kontrol çerçevesine uyumludur' },
              { label: 'SOC 2 Aligned', desc: 'Hizmet Organizasyonu Kontrolü çerçevesine uyumlu' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <div>
                  <span className="text-gray-300 font-medium text-sm">{item.label}</span>
                  <span className="text-gray-500 text-xs ml-1.5">- {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )
    },
    {
      icon: Mail,
      heading: '16. İletişim',
      content: (
        <>
          <p>Bu Gizlilik Politikası veya kişisel verilerinizle ilgili sorularınız, endişeleriniz veya talepleriniz için:</p>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 space-y-3 mt-3">
            <p className="text-gray-300 font-medium">ALLYNC</p>
            <p className="text-gray-500 text-xs">Allyncai, ALLYNC'in tescilli markasıdır · Şirket Tescil No: 8950466196</p>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#94B4C1]" /><span>info@allyncai.com</span></div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#94B4C1]" /><span>+974 5107 9565 / +90 536 247 7824</span></div>
            <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-[#94B4C1]" /><span>allyncai.com/contact</span></div>
            <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-[#94B4C1] mt-0.5 flex-shrink-0" /><span>Yeni Mah. Sefer Sk. No:1 İç Kapı No:1 İnegöl/Bursa - Türkiye</span></div>
          </div>
          <SubHeading>Veri Koruma Görevlisi</SubHeading>
          <p>E-posta: info@allyncai.com | Konu: "Veri Koruma Sorgusu"</p>
          <SubHeading>Çözülmemiş Gizlilik Endişeleri İçin</SubHeading>
          <BulletList items={[
            'Türkiye: Kişisel Verileri Koruma Kurumu (KVKK) - kvkk.gov.tr',
            'AB: Yerel denetim makamınız',
            'Katar: Uyumluluk ve Veri Koruma Departmanı'
          ]} />
        </>
      )
    }
  ] : [
    {
      icon: FileText,
      heading: '1. Introduction',
      content: (
        <>
          <p>Allync ("we", "us", "our", "Allync", "AllyncAI") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, share, and protect your personal information when you use our website (allyncai.com), mobile applications, WhatsApp Business and Instagram Business messaging services, AI-powered assistants, SaaS platforms, and any other digital services we provide (collectively, "Services").</p>
          <p className="text-gray-300 bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 mt-3">ALLYNC is authorized by Meta Platforms, Inc. as a <span className="font-medium">Verified Tech Provider</span>. In this capacity, we facilitate the secure connection of businesses' WhatsApp Business API and Instagram Business accounts to our platform under Meta's official approval processes, and we adhere to the data processing and compliance standards defined by Meta.</p>
        </>
      )
    },
    {
      icon: Building,
      heading: '2. Data Controller',
      content: (
        <>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 space-y-2">
            <p><span className="text-gray-300 font-medium">Company:</span> ALLYNC</p>
            <p><span className="text-gray-300 font-medium">Brand:</span> Allyncai is a registered brand of ALLYNC</p>
            <p><span className="text-gray-300 font-medium">Company Registration No:</span> 8950466196</p>
            <p><span className="text-gray-300 font-medium">D-U-N-S No:</span> 751168710</p>
            <p><span className="text-gray-300 font-medium">Headquarters:</span> Yeni Mah. Sefer Sk. No:1 Ic Kapi No:1 Inegol/Bursa - Turkiye</p>
            <p><span className="text-gray-300 font-medium">Additional Office:</span> Doha, Qatar</p>
            <p><span className="text-gray-300 font-medium">Email:</span> info@allyncai.com</p>
            <p><span className="text-gray-300 font-medium">Phone:</span> +974 5107 9565 / +90 536 247 7824</p>
            <p><span className="text-gray-300 font-medium">Website:</span> allyncai.com</p>
          </div>
          <p className="mt-3">ALLYNC (Allyncai) acts as the Data Controller for personal data processed through our Services in accordance with the General Data Protection Regulation (GDPR), Turkish Personal Data Protection Law (KVKK - Law No. 6698), and Qatar Personal Data Privacy Protection Law (Law No. 13 of 2016).</p>
        </>
      )
    },
    {
      icon: Database,
      heading: '3. Personal Data We Collect',
      content: (
        <>
          <SubHeading>3.1 Data You Provide Directly</SubHeading>
          <BulletList items={[
            'Identity Data: Full name, username, title',
            'Contact Data: Email address, phone number, mailing address',
            'Business Data: Company name, industry, job title, business requirements',
            'Account Data: Login credentials, account preferences, settings',
            'Communication Data: Messages sent through WhatsApp, email, contact forms, or support channels',
            'Payment Data: Billing address, payment method details (processed by third-party payment providers)',
            'Content Data: Files, documents, images, or other content you upload to our Services'
          ]} />
          <SubHeading>3.2 Data Collected Automatically</SubHeading>
          <BulletList items={[
            'Technical Data: IP address, browser type and version, operating system, device type, device identifiers',
            'Usage Data: Pages visited, features used, time spent on pages, click patterns, navigation paths',
            'Location Data: Approximate location based on IP address (not precise GPS location)',
            'Cookie Data: Information collected through cookies and similar tracking technologies'
          ]} />
          <SubHeading>3.3 WhatsApp Business API Data</SubHeading>
          <BulletList items={[
            'Phone number associated with your WhatsApp account',
            'Profile name and profile picture (as provided by WhatsApp)',
            'Message content including text, images, documents, voice messages, and other media',
            'Message metadata including timestamps, read receipts, and delivery status',
            'Conversation history for context continuity within active sessions'
          ]} />
          <SubHeading>3.4 Instagram Business (Meta Graph API) Data</SubHeading>
          <p className="text-xs text-gray-500 -mt-1 mb-2">Collected when you choose to connect an Instagram Business account to our platform.</p>
          <BulletList items={[
            'Username and Instagram User ID of the connected Instagram Business account',
            'Account profile picture (for in-panel display only)',
            '60-day refreshable long-lived access token issued by Meta during authorization (used solely to make Meta Graph API calls on behalf of your business account; never shared with end users)',
            'Meta permissions requested: instagram_business_basic (account identity), instagram_business_manage_messages (replying to Direct Messages), instagram_business_manage_comments (reading and replying to comments) — nothing beyond this scope is requested',
            'IGSID (Instagram-scoped ID), username and profile picture URL of end users who send Direct Messages to your account — used only for conversation identification and display',
            'Direct Message content: text, images, voice notes, story replies, shared media, stickers and tags',
            'Message timestamps, delivery status, read receipts',
            'Top-level comments under your business posts only — commenter IGSID, username, comment text, and post (media) link; replies to comments (sub-comments) are NOT processed'
          ]} />
          <SubHeading>3.5 AI Service Data</SubHeading>
          <BulletList items={[
            'Input data provided to AI systems (text, images, documents, voice)',
            'Output data generated by AI systems',
            'Interaction patterns with AI assistants',
            'Feedback and ratings you provide on AI responses'
          ]} />
          <SubHeading>3.6 Third-Party Data</SubHeading>
          <BulletList items={[
            'Meta Platforms: WhatsApp Business API and Instagram Graph API event data (messages, comments, status updates)',
            'Google Services: Calendar, Sheets, Drive data (when you authorize integrations)',
            'Analytics providers: Aggregated usage statistics',
            'Business partners: Referral information'
          ]} />
          <SubHeading>3.7 Derived and Operational Data</SubHeading>
          <p className="text-xs text-gray-500 -mt-1 mb-2">Data produced or recorded by the system to operate the Service and remain compliant with Meta requirements.</p>
          <BulletList items={[
            'Sentiment analysis output: sentiment label assigned to a conversation (positive/neutral/negative), score, summary, intent, topic tags, and suggested action',
            'Marketing opt-out / STOP data: the opt-out keyword sent by the customer and the opt-out timestamp — required for compliance with Meta\'s WhatsApp policy',
            'SLA and response-time metrics: first-response time, breach flags (only for aggregate reporting)',
            'Voice message transcripts and voice-response file references (see Section 5.7)',
            'Browser notification subscription data: the endpoint and cryptographic keys generated by the browser (used solely to deliver in-panel notifications; content is not exposed to third parties)',
            'Developer API keys: stored only in a cryptographically irreversible hashed form; the raw key is never retained on our side',
            'Audit logs: user actions, IP address, browser identifier (user agent), request path, HTTP status code — for security and accountability (see Section 8)'
          ]} />
        </>
      )
    },
    {
      icon: Eye,
      heading: '4. How We Use Your Data',
      content: (
        <>
          <SubHeading>4.1 Service Delivery</SubHeading>
          <BulletList items={[
            'Providing and maintaining our AI assistant services',
            'Processing and responding to your WhatsApp messages',
            'Managing your SaaS panel accounts and subscriptions',
            'Delivering web, mobile, and digital marketing services',
            'Processing appointments, orders, and service requests'
          ]} />
          <SubHeading>4.2 Service Improvement</SubHeading>
          <BulletList items={[
            'Analyzing usage patterns to improve service quality',
            'Training and improving AI model accuracy (using anonymized and aggregated data only)',
            'Developing new features and services',
            'Conducting internal research and analytics'
          ]} />
          <SubHeading>4.3 Communication</SubHeading>
          <BulletList items={[
            'Responding to your inquiries and support requests',
            'Sending service-related notifications',
            'Providing updates about your projects or services',
            'Sending marketing communications (only with your explicit consent)'
          ]} />
          <SubHeading>4.4 Legal Basis for Processing (GDPR Article 6)</SubHeading>
          <DataTable
            headers={['Purpose', 'Legal Basis']}
            rows={[
              ['Service delivery', 'Performance of contract'],
              ['WhatsApp AI responses', 'Legitimate interest / Consent'],
              ['Service improvement', 'Legitimate interest'],
              ['Marketing communications', 'Explicit consent'],
              ['Legal compliance', 'Legal obligation'],
              ['Security and fraud prevention', 'Legitimate interest'],
            ]}
          />
        </>
      )
    },
    {
      icon: Globe,
      heading: '5. WhatsApp Business API, Instagram Business & AI Integration',
      content: (
        <>
          <SubHeading>5.1 WhatsApp Business API</SubHeading>
          <p>Our services integrate with the WhatsApp Business API provided by Meta Platforms, Inc. ALLYNC operates under Meta\'s Verified Tech Provider program and facilitates business onboarding through Meta\'s official WhatsApp Embedded Signup flow.</p>
          <BulletList items={[
            'Messages are transmitted through Meta\'s infrastructure subject to Meta\'s Privacy Policy',
            'We receive and process messages to provide AI-powered responses',
            'We do NOT store message content beyond the active conversation session unless explicitly required for service delivery',
            'We do NOT sell or share your WhatsApp messages with third parties for advertising purposes',
            'We do NOT use your messages for purposes unrelated to the service you requested',
            'All proactive sends outside Meta\'s 24-hour customer service window use only Meta-pre-approved templates'
          ]} />
          <SubHeading>5.2 Instagram Graph API</SubHeading>
          <p>Our services integrate with the Instagram Graph API provided by Meta Platforms. To connect your Instagram Business account we use Meta\'s official Instagram OAuth flow.</p>
          <BulletList items={[
            'WhatsApp and Instagram integrations operate on entirely isolated, separate Meta apps; an authorization token for one does not grant access to the other',
            'We request only the minimum permissions required to read and reply to Direct Messages and process comments on your behalf (instagram_business_basic, instagram_business_manage_messages, instagram_business_manage_comments)',
            'We do NOT request and do NOT collect profile attributes such as your follower list, story viewers, likes, or searches — only DM and comment data is processed',
            'Incoming webhook events are verified using Meta\'s `x-hub-signature-256` HMAC signature; requests with invalid signatures are rejected',
            'AI-generated responses are sent only as a reply to a DM or comment that the end user initiated; we never send proactive (user-uninitiated) Direct Messages',
            'We do NOT sell or share your Instagram messages with third parties for advertising purposes',
            'We do NOT use your Instagram conversations to train general AI models'
          ]} />
          <SubHeading>5.3 Instagram Comment Processing</SubHeading>
          <BulletList items={[
            'Only top-level comments under business posts are processed; replies to other users\' comments (sub-comments) are ignored',
            'A maximum of one AI reply is issued per (end user, post) combination within any 24-hour window — this limit prevents spam and duplicate replies',
            'A reply to a comment may consist of two parts: (a) a short public reply under the post (up to 900 characters, containing no links or personal data), and (b) a single private DM sent within Meta\'s 7-day "private reply" window (up to 950 characters)',
            'Comment content is stored capped at 4,000 characters in line with Meta API conventions; longer comments are truncated'
          ]} />
          <SubHeading>5.4 AI Processing</SubHeading>
          <BulletList items={[
            'AI responses are generated in real-time based on the end user\'s message text; they are not pre-written',
            'We do NOT use your personal conversations (WhatsApp or Instagram) to train general AI models',
            'Only the message text is forwarded to our AI model provider (Anthropic); the end user\'s profile picture, phone number, or IGSID is not included in the model call',
            'AI interactions are processed on secure, encrypted infrastructure',
            'Human review occurs only inside the business user\'s (tenant) own panel; Allync staff inspect customer conversations only when there is an explicit support or dispute request, and such action is recorded in the audit log'
          ]} />
          <SubHeading>5.5 Message Retention</SubHeading>
          <BulletList items={[
            'Active conversation context is maintained for service continuity',
            'Profile pictures are stored only as Meta CDN URLs for the purpose of letting you recognize the conversation; we do not copy media files to our servers',
            'Message metadata may be retained for analytics and service improvement (anonymized)',
            'You may request deletion of your conversation history at any time'
          ]} />
          <SubHeading>5.6 Disconnection and Data Deletion</SubHeading>
          <BulletList items={[
            'When you disconnect an account from the panel, the access token on Allync servers is invalidated and no further API calls are made to Meta',
            'Meta\'s official "Deauthorize" and "Data Deletion Request" callbacks are implemented on our side; deletion requests sent by Meta are answered in the format defined by Meta',
            'A business owner (tenant owner) can delete individual messages, conversations or the entire communication history from the panel',
            'We process deletion requests received at info@allyncai.com within 30 days (see Section 11 — Your Rights)'
          ]} />
          <SubHeading>5.7 Voice Message Processing (Optional Feature)</SubHeading>
          <p>If a business chooses to have inbound voice messages processed by AI, or enables AI to reply with a voice note, the audio flow operates as follows:</p>
          <BulletList items={[
            'Inbound voice notes are forwarded to OpenAI\'s Whisper speech-to-text service for transcription',
            'OpenAI uses this data solely to convert the audio into text; under OpenAI\'s API terms, customer data is not used to train OpenAI\'s general models',
            'The resulting transcript is stored in the text field of the message history; the original audio file is not permanently retained on our side',
            'If the AI replies with voice, the response is generated via OpenAI\'s Text-to-Speech service and held briefly in secure storage for delivery to the end user',
            'You may disable voice processing at any time from tenant settings'
          ]} />
          <SubHeading>5.8 Sentiment Analysis (Triggered by Tenant)</SubHeading>
          <BulletList items={[
            'When a business user (tenant) triggers the "Re-analyze" action for a conversation, the text content of the most recent messages is forwarded to the Anthropic Claude model for sentiment, intent and topic classification',
            'The result (sentiment label, score, summary, intent, topics, suggested action) is attached to the conversation record and stored as a historical entry',
            'Only message content is sent to Anthropic; the customer\'s profile picture, phone number or IGSID is not included in the model call',
            'Anthropic does not use customer conversations to train its general models (under our enterprise API agreement)'
          ]} />
        </>
      )
    },
    {
      icon: Share2,
      heading: '6. Data Sharing',
      content: (
        <>
          <SubHeading>6.1 We Share Data With</SubHeading>
          <BulletList items={[
            'Meta Platforms: As required by WhatsApp Business API and Instagram Graph API (transmission of messages, comments and status updates)',
            'Anthropic: For AI response generation and sentiment analysis — under an enterprise DPA, only message text is transmitted; customer conversations are not used for model training',
            'OpenAI: For voice message transcription and voice AI replies — only when a tenant enables this feature, under OpenAI API terms, not used for model training',
            'Browser / OS push services: Only an encrypted notification payload is delivered through the push subscription endpoint generated by your browser; message content is not exposed to the push service',
            'Google: For Calendar / Sheets / Drive integrations you have authorized (limited to resources the business has shared)',
            'Cloud infrastructure providers: Enterprise-grade hosting and database services (under DPA agreements)',
            'Email delivery provider: For invitations, password resets and system alerts (sent only to business users; end-customer conversation content is not transmitted)',
            'Payment processors: For billing (PCI DSS compliant providers)',
            'Analytics providers: Aggregated, anonymized usage data only'
          ]} />
          <SubHeading>6.2 We Do NOT</SubHeading>
          <BulletList items={[
            'Sell your personal data to third parties',
            'Share your data for third-party advertising purposes',
            'Transfer your data to countries without adequate data protection without appropriate safeguards',
            'Share your WhatsApp or Instagram messages with anyone outside of the service delivery scope',
            'Collect your Instagram follower list, story viewers, likes, or explore/search history'
          ]} />
          <SubHeading>6.3 Legal Disclosure</SubHeading>
          <p>We may disclose your data when required by court orders, law enforcement requests, protection of our legal rights, or prevention of fraud or security threats.</p>
        </>
      )
    },
    {
      icon: Plane,
      heading: '7. International Data Transfers',
      content: (
        <>
          <p>Your data may be transferred to and processed in countries outside of your residence, including but not limited to Turkey, Qatar, the United States, and the European Union. When we transfer data internationally, we ensure appropriate safeguards are in place:</p>
          <BulletList items={[
            'Standard Contractual Clauses (SCCs) approved by the European Commission',
            'Data Processing Agreements (DPAs) with all service providers',
            'Adequacy decisions where applicable',
            'Your explicit consent where required'
          ]} />
        </>
      )
    },
    {
      icon: Lock,
      heading: '8. Data Security',
      content: (
        <>
          <SubHeading>Technical Measures</SubHeading>
          <BulletList items={[
            'TLS/SSL encryption for all data in transit (HTTPS)',
            'AES-256 encryption for data at rest',
            'End-to-end encryption for sensitive communications',
            'Regular security audits and penetration testing',
            'Web Application Firewall (WAF) protection',
            'DDoS mitigation',
            'Automated vulnerability scanning'
          ]} />
          <SubHeading>Organizational Measures</SubHeading>
          <BulletList items={[
            'Role-based access control (RBAC) for all systems',
            'Employee security training and awareness programs',
            'Data processing agreements with all subprocessors',
            'Incident response plan and breach notification procedures',
            'Regular security policy reviews',
            'ISO 27001 control framework aligned security management'
          ]} />
          <SubHeading>Infrastructure</SubHeading>
          <BulletList items={[
            'Hosted on enterprise-grade cloud infrastructure',
            'Automated backups with geographic redundancy',
            '99.9% uptime SLA',
            'SOC 2 Type II control framework aligned infrastructure'
          ]} />
          <SubHeading>Audit Logs</SubHeading>
          <p>For security, accountability and regulatory compliance (KVKK / GDPR), every sensitive action (login, connection create/delete, data deletion request, AI assignment, permission/role change, etc.) is recorded in an audit log. Each entry includes:</p>
          <BulletList items={[
            'User identifier (user_id) and role',
            'Event type, category and severity',
            'IP address and browser identifier (user agent)',
            'Device type, operating system and browser (parsed)',
            'Request path, HTTP method and status code',
            'Event-specific metadata (e.g. number of records deleted; customer message content is never written here)'
          ]} />
          <p>Audit log retention is configurable per tenant; the default is at least 90 days. Entries are readable only by the business owner (tenant owner) and Allync super-administrator.</p>
          <SubHeading>Error Monitoring</SubHeading>
          <p>Unexpected errors are forwarded to an internal error monitoring system hosted on our own infrastructure; no third-party SaaS service is used. Telemetry payloads automatically scrub phone numbers, email addresses, authentication tokens, and service-provider secret keys before transmission.</p>
        </>
      )
    },
    {
      icon: Cookie,
      heading: '9. Cookies and Tracking',
      content: (
        <>
          <SubHeading>9.1 Types of Cookies We Use</SubHeading>
          <DataTable
            headers={['Cookie Type', 'Purpose', 'Duration', 'Required']}
            rows={[
              ['Essential', 'Site functionality, security, session management', 'Session', 'Yes'],
              ['Analytics', 'Performance tracking, usage statistics', 'Up to 2 years', 'No'],
              ['Preference', 'Language, theme, display settings', 'Up to 1 year', 'No'],
              ['Marketing', 'Ad performance tracking (only with consent)', 'Up to 1 year', 'No'],
            ]}
          />
          <SubHeading>9.2 Cookie Management</SubHeading>
          <BulletList items={[
            'You can manage cookie preferences through your browser settings',
            'Essential cookies cannot be disabled as they are necessary for service operation',
            'You can opt out of analytics cookies at any time',
            'We respect "Do Not Track" browser signals'
          ]} />
          <SubHeading>9.3 Third-Party Cookies</SubHeading>
          <BulletList items={[
            'Google Analytics (analytics)',
            'Meta Pixel (marketing, only with consent)',
            'Hotjar (user experience analysis, only with consent)'
          ]} />
        </>
      )
    },
    {
      icon: Clock,
      heading: '10. Data Retention',
      content: (
        <>
          <DataTable
            headers={['Data Type', 'Retention Period', 'Basis']}
            rows={[
              ['Account data', 'Duration of service + 2 years', 'Contract'],
              ['WhatsApp messages', 'Active session only', 'Legitimate interest'],
              ['Instagram Direct Messages', 'Active session only', 'Legitimate interest'],
              ['Instagram comments', 'Until deleted by business (top-level, capped at 4,000 chars)', 'Legitimate interest / Meta API requirement'],
              ['Meta access tokens', 'Until disconnect (60-day rotation)', 'Contract / API requirement'],
              ['Voice message transcripts', 'Same as the conversation (not stored separately)', 'Legitimate interest'],
              ['Voice AI reply audio files', 'Deleted within 24 hours of delivery', 'Operational necessity'],
              ['Sentiment analysis results + history', 'Lifetime of the conversation (deleted together)', 'Legitimate interest'],
              ['Marketing opt-out (STOP) records', 'Lifetime of the business connection', 'Legal obligation (Meta WhatsApp policy)'],
              ['Web Push subscriptions', 'Until removed by the user or invalidated by the browser', 'Explicit consent'],
              ['Developer API key (hash)', 'Until the key is revoked', 'Contract'],
              ['Audit logs', 'Tenant-configurable (default ≥ 90 days)', 'Legal obligation / Security'],
              ['Error monitoring events', '90 days', 'Security / Service continuity'],
              ['Transaction records', '10 years', 'Legal obligation (tax law)'],
              ['Analytics data', '26 months (anonymized)', 'Legitimate interest'],
              ['Support tickets', '3 years after resolution', 'Legitimate interest'],
              ['Marketing consent records', 'Duration of consent + 3 years', 'Legal obligation'],
              ['Server logs', '90 days', 'Security'],
              ['Backup data', '30 days after deletion request', 'Operational necessity'],
            ]}
          />
          <p className="mt-3">Data is securely deleted or anonymized when the retention period expires. You may request early deletion subject to legal retention obligations.</p>
        </>
      )
    },
    {
      icon: UserCheck,
      heading: '11. Your Rights',
      content: (
        <>
          <SubHeading>11.1 Under GDPR (EU Residents)</SubHeading>
          <BulletList items={[
            'Right to Access: Obtain a copy of your personal data',
            'Right to Rectification: Correct inaccurate or incomplete data',
            'Right to Erasure: Request deletion of your data ("right to be forgotten")',
            'Right to Restrict Processing: Limit how we use your data',
            'Right to Data Portability: Receive your data in a structured, machine-readable format',
            'Right to Object: Object to processing based on legitimate interest',
            'Right to Withdraw Consent: Withdraw consent at any time without affecting prior processing',
            'Right to Lodge a Complaint: File a complaint with a supervisory authority'
          ]} />
          <SubHeading>11.2 Under KVKK (Turkish Residents)</SubHeading>
          <BulletList items={[
            'Right to learn whether your personal data is processed',
            'Right to request information if it has been processed',
            'Right to learn the purpose of processing and whether it is used accordingly',
            'Right to know third parties to whom personal data is transferred',
            'Right to request correction if processed incompletely or incorrectly',
            'Right to request deletion or destruction under conditions set out in Article 7 of KVKK',
            'Right to request notification of operations to third parties to whom data has been transferred',
            'Right to object to a result that is against you through analysis of processed data exclusively by automated systems',
            'Right to claim compensation for damages arising from unlawful processing'
          ]} />
          <SubHeading>11.3 Under Qatar Law (Qatar Residents)</SubHeading>
          <BulletList items={[
            'Right to be informed about data processing',
            'Right to access your personal data',
            'Right to correct inaccurate data',
            'Right to request deletion',
            'Right to object to processing'
          ]} />
          <SubHeading>11.4 How to Exercise Your Rights</SubHeading>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 space-y-2">
            <p><span className="text-gray-300 font-medium">Email:</span> info@allyncai.com</p>
            <p><span className="text-gray-300 font-medium">Subject Line:</span> "Privacy Rights Request"</p>
            <p><span className="text-gray-300 font-medium">Response Time:</span> Within 30 days of receiving your request</p>
            <p><span className="text-gray-300 font-medium">Verification:</span> We may need to verify your identity before processing your request</p>
          </div>
        </>
      )
    },
    {
      icon: Users,
      heading: "12. Children's Privacy",
      content: (
        <p>Our Services are not intended for children under the age of 16. We do not knowingly collect personal data from children. If you believe we have collected data from a child, please contact us immediately at info@allyncai.com and we will promptly delete such data.</p>
      )
    },
    {
      icon: Link2,
      heading: '13. Third-Party Links',
      content: (
        <p>Our Services may contain links to third-party websites and services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any personal data.</p>
      )
    },
    {
      icon: RefreshCw,
      heading: '14. Changes to This Policy',
      content: (
        <>
          <p>We may update this Privacy Policy from time to time. When we make significant changes:</p>
          <BulletList items={[
            'We will update the "Last Updated" date at the top',
            'We will notify you via email or through our Services for material changes',
            'Continued use of our Services after changes constitutes acceptance'
          ]} />
        </>
      )
    },
    {
      icon: Scale,
      heading: '15. Compliance',
      content: (
        <>
          <p>This Privacy Policy complies with:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
            {[
              { label: 'GDPR', desc: 'General Data Protection Regulation (EU)' },
              { label: 'KVKK', desc: 'Personal Data Protection Law (Turkey)' },
              { label: 'Qatar PDPPL', desc: 'Personal Data Privacy Protection Law' },
              { label: 'Meta Verified Tech Provider', desc: 'Meta-approved provider for WhatsApp Business and Instagram Business' },
              { label: 'WhatsApp Business Policy', desc: 'WhatsApp Business API requirements and messaging policy' },
              { label: 'Instagram Platform Policy', desc: 'Instagram Graph API and messaging rules' },
              { label: 'ISO 27001 Aligned', desc: 'Information Security Management control framework aligned' },
              { label: 'SOC 2 Aligned', desc: 'Service Organization Control framework aligned' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <div>
                  <span className="text-gray-300 font-medium text-sm">{item.label}</span>
                  <span className="text-gray-500 text-xs ml-1.5">- {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )
    },
    {
      icon: Mail,
      heading: '16. Contact',
      content: (
        <>
          <p>For any questions, concerns, or requests regarding this Privacy Policy or your personal data:</p>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 space-y-3 mt-3">
            <p className="text-gray-300 font-medium">ALLYNC</p>
            <p className="text-gray-500 text-xs">Allyncai is a registered brand of ALLYNC · Company Registration No: 8950466196</p>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#94B4C1]" /><span>info@allyncai.com</span></div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#94B4C1]" /><span>+974 5107 9565 / +90 536 247 7824</span></div>
            <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-[#94B4C1]" /><span>allyncai.com/contact</span></div>
            <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-[#94B4C1] mt-0.5 flex-shrink-0" /><span>Yeni Mah. Sefer Sk. No:1 Ic Kapi No:1 Inegol/Bursa - Turkiye</span></div>
          </div>
          <SubHeading>Data Protection Officer</SubHeading>
          <p>Email: info@allyncai.com | Subject: "Data Protection Inquiry"</p>
          <SubHeading>Unresolved Privacy Concerns</SubHeading>
          <BulletList items={[
            'Turkey: Kişisel Verileri Koruma Kurumu (KVKK) - kvkk.gov.tr',
            'EU: Your local supervisory authority',
            'Qatar: Compliance and Data Protection Department'
          ]} />
        </>
      )
    }
  ];

  const title = language === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy';
  const subtitle = language === 'tr' ? 'Verilerinizin güvenliği bizim önceliğimizdir' : 'Your data security is our priority';
  const lastUpdated = language === 'tr' ? 'Son Güncelleme: 2 Mayıs 2026' : 'Last Updated: May 2, 2026';
  const backHome = language === 'tr' ? 'Ana Sayfa' : 'Home';

  return (
    <HelmetProvider>
      <Helmet>
        <title>{title} | Allync</title>
        <meta name="description" content={language === 'tr' ? 'Allync AI gizlilik politikası. Kişisel verilerinizin nasıl toplandığı, işlendiği ve korunduğu hakkında kapsamlı bilgi. GDPR, KVKK ve Katar PDPPL uyumlu.' : 'Allync AI privacy policy. Comprehensive information about how your personal data is collected, processed and protected. GDPR, KVKK and Qatar PDPPL compliant.'} />
        <link rel="canonical" href="https://www.allyncai.com/privacy" />
      </Helmet>

      <div className="min-h-screen bg-black relative">
        {/* FloatingLines Background */}
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

        {/* Top Bar */}
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

        {/* Main Content */}
        <div className="relative z-10 pt-24 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 sm:mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
                <Shield className="w-4 h-4 text-[#94B4C1]" />
                <span className="text-sm text-gray-400">{lastUpdated}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                {title}
              </h1>
              <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
                {subtitle}
              </p>
            </motion.div>

            {/* Sections */}
            <div className="space-y-4 sm:space-y-6">
              {sections.map((section, index) => (
                <SectionCard key={index} section={section} index={index} />
              ))}
            </div>

            {/* Footer */}
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
