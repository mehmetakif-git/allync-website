import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import LivingLogo from './ui/LivingLogo';
import './CompanyProfile.css';

const FloatingLines = React.lazy(() => import('./ui/FloatingLines'));

type Lang = 'tr' | 'en';

/* ---------- bilingual content ---------- */
const C = {
  tr: {
    metaTitle: 'Şirket Profili — ALLYNC | AI İş Ekosistemi',
    metaDesc:
      'ALLYNC şirket profili: iletişim, dijital ekranlar ve operasyonları tek AI destekli ekosistemde birleştiren Allync Hub, Digital Signage ve Allync+ platformları.',
    brand: 'ALLYNC',
    home: 'Ana Sayfa',
    cover: {
      eyebrow: 'AI İş Ekosistemi · Şirket Profili',
      slogan: 'Akıllı İşin Yeni Dili',
      sub: 'The New Language of Smart Business',
      chips: ['Meta Doğrulanmış Sağlayıcı', 'Kuruluş 2024', 'Türkiye · Katar · Dünya geneli'],
      duns: 'DUNS 751168710',
      scroll: 'Kaydırarak keşfet',
    },
    who: {
      eyebrow: 'Biz Kimiz',
      title: ['Tek bir yazılım değil,', 'uçtan uca bir ekosistem.'],
      lead: 'ALLYNC; işletmelerin **iletişimini**, **dijital ekranlarını** ve **tüm operasyonlarını** tek bağlantılı, AI destekli bir ekosistemden yönetmesini sağlar. Onlarca kopuk araç yerine — tek platform.',
      pillars: [
        { c: '--hub', tag: 'İletişim', h: 'Allync Hub', p: "WhatsApp, Instagram ve Messenger'ı tek AI gelen kutusunda birleştiren iletişim platformu." },
        { c: '--signage', tag: 'Ekranlar', h: 'Digital Signage', p: 'Android ve Windows ekranları tek buluttan gerçek zamanlı yöneten akıllı dijital tabela.' },
        { c: '--plus', tag: 'Operasyon', h: 'Allync+', p: '~40 modüllü iş yönetim platformu: İK, CRM, satış, muhasebe, stok ve sektöre özel modüller.' },
      ],
      oneline: ['Tek giriş.', 'Tek panel.', 'Tek altyapı.', 'Tek partner.'],
    },
    hub: {
      eyebrow: '01 — AI İletişim Platformu',
      title: 'Allync Hub',
      lead: 'Müşteri hangi kanaldan yazarsa yazsın, yapay zeka önceki konuşmayı bilir ve kaldığı yerden devam eder. **Tek AI motoru, tek müşteri hafızası.**',
      feat: ['WhatsApp · Instagram · Messenger tek kutuda', '7/24 AI asistan + tek tıkla insana devir', 'Randevu & onaylı kampanyalar', 'Duygu analizi & canlı analitik', 'Function Calling — gerçek işlem yürütür', '2FA · white-label · multi-tenant'],
      chip: 'Web · Android · iOS canlı',
      demo: { name: 'Allync Hub', status: 'AI aktif', input: 'AI yanıtlıyor…', msgs: [
        { side: 'in', who: 'WhatsApp', t: "Yarın 15:00'e randevu var mı?" },
        { side: 'ai', t: 'Tabii! Yarın 15:00 uygun. Adınıza oluşturayım mı? 💫' },
        { side: 'in', who: 'Instagram', t: 'Fiyat listesi paylaşır mısınız?' },
        { side: 'ai', t: 'Size özel paketleri gönderdim ✓' },
        { side: 'in', who: 'Messenger', t: 'Teşekkürler!' },
      ] },
    },
    signage: {
      eyebrow: '02 — Akıllı Dijital Tabela',
      title: 'Digital Signage',
      lead: 'Ekranları **akıllı cihazlara** dönüştürün. Tek buluttan binlerce ekrana gerçek zamanlı; çevrimdışıyken bile kesintisiz.',
      feat: ['AI ile anlık görsel üretimi', 'Video wall — bölmeli yansıtma', 'Emergency & bakım modu', 'Realtime + scheduled komutlar', 'Restart · ekran görüntüsü · uptime', "Moments — check-in'de kişisel kutlama", 'DOOH reklam · kiosk · heatmap', 'Android TV/tablet + Windows native'],
      demo: { live: 'CANLI', cap: ['Yaza Özel', 'Kampanya'], w1: { lbl: 'Hava · Bursa', big: '24°', sm: 'Parçalı bulutlu' }, w2: { lbl: 'Dijital Menü', big: 'Latte · Mocha', sm: '₺ Güncel fiyat' } },
    },
    plus: {
      eyebrow: '03 — İşletme Yönetim Platformu',
      title: 'Allync+',
      lead: "İK'dan muhasebeye, CRM'den stoğa — tüm operasyon tek panelde. **Her sektöre göre yapılandırılan** ~40 modül; ERP genişliği, tek panel sadeliği.",
      feat: ['İK · bordro · vardiya · devamlılık', 'CRM · satış · faturalama · muhasebe', 'Stok · ödemeler · raporlama · RBAC', 'Fitness, Güzellik & onlarca sektör modülü', 'Native Müşteri & Personel uygulamaları', 'Biostar · kamera · NFC · QR entegrasyonu'],
      dash: { menu: ['Panel', 'İK', 'CRM', 'Satış', 'Muhasebe', 'Stok', 'Raporlar'], kpis: [['1.284', 'Üye'], ['₺ 342K', 'Gelir ▲'], ['96%', 'Doluluk']] },
    },
    journey: {
      eyebrow: 'Ekosistem İş Başında',
      title: ['Bir spor salonu günü —', 'tek ekosistemde.'],
      lead: 'Üç platform + donanım, tek üye yolculuğunda birlikte çalışır.',
      nodes: [
        { c: '--hub', n: '01', h: 'Rezervasyon', p: "Üye WhatsApp'tan dersini ayırtır, AI anında onaylar.", via: 'Allync Hub' },
        { c: '--plus', n: '02', h: 'Giriş', p: 'Biostar kapıdan NFC/QR ile içeri girer.', via: 'Allync+ · Donanım' },
        { c: '--signage', n: '03', h: 'Karşılama', p: 'Ekranda doğum günü kutlaması & günün programı belirir.', via: 'Signage · Moments' },
        { c: '--plus', n: '04', h: 'Ödeme', p: 'Üyeliğini mobil uygulamadan yeniler.', via: 'Allync+ Müşteri App' },
      ],
    },
    security: {
      eyebrow: 'Güvenlik & Uyumluluk',
      title: ['Güven, sonradan eklenmez —', 'her katmana işlenir.'],
      badges: [
        { h: 'Önce Gizlilik', p: 'İşletme verisi işletmeye aittir. Asla satılmaz, paylaşılmaz.' },
        { h: 'GDPR · KVKK', p: 'ISO 27001 / SOC 2 kontrol çerçevelerine uyumlu.' },
        { h: 'Veri Sahipliği', p: 'Dışa aktarma, anında silme, saklama kontrolü.' },
        { h: 'Bölgesel Barındırma', p: 'Türk verisi Türkiye\'de — veri residency.' },
        { h: 'Kimlik Doğrulama', p: 'MFA · 2FA · Face ID · parmak izi · RBAC.' },
        { h: 'Süreklilik', p: 'Uçtan uca şifreleme, yedekleme, felaket kurtarma.' },
      ],
    },
    tech: {
      eyebrow: 'Teknoloji Altyapısı',
      title: ['Üç büyük AI sağlayıcı,', 'tek zeki motor.'],
      provs: [['OpenAI', 'GPT + Whisper/TTS ses'], ['Anthropic', 'Claude — yanıt & duygu analizi'], ['Google', 'Gemini — üretken içerik']],
      stack: ['Meta WhatsApp Business', 'Instagram API', 'Supabase', 'React · Next.js', 'React Native · Kotlin · Swift', 'Function Calling', 'Biostar · IoT · NFC · QR', 'Multi-tenant SaaS'],
    },
    why: {
      eyebrow: 'Neden ALLYNC',
      title: 'Neden 10 tedarikçi? Tek partner yeter.',
      scatter: ['CRM', 'İK', 'Dijital Tabela', 'Mobil App', 'AI', 'İletişim', 'IoT', 'Analitik', 'Erişim Kontrolü', 'Rezervasyon'],
      sub: 'Tek giriş · tek panel · tek altyapı · tek partner',
    },
    contact: {
      eyebrow: 'Şirket Bilgileri & İletişim',
      title: 'Konuşalım.',
      corpH: 'Kurumsal',
      corp: [['Yasal ad', 'ALLYNC'], ['Genel merkez', 'İnegöl / Bursa · Türkiye'], ['Operasyon merkezi', 'Doha · Katar'], ['Vergi / Tescil', '8950466196'], ['D-U-N-S', '751168710']],
      contactH: 'İletişim',
      cont: [['Katar', '+974 5107 9565'], ['Türkiye', '+90 536 247 7824'], ['E-posta', 'info@allyncai.com'], ['Web', 'allyncai.com']],
    },
    closing: {
      big: ['Biz yazılım geliştirmiyoruz.', 'Biz', 'akıllı iş ekosistemleri', 'kuruyoruz.'],
      sig: 'Akıllı İşin Yeni Dili',
      chips: ['allyncai.com', 'Meta Doğrulanmış Teknoloji Sağlayıcı'],
    },
    labels: ['Kapak', 'Biz Kimiz', 'Allync Hub', 'Digital Signage', 'Allync+', 'İş Başında', 'Güvenlik', 'Teknoloji', 'Neden ALLYNC', 'İletişim', 'Kapanış'],
  },
  en: {
    metaTitle: 'Company Profile — ALLYNC | AI Business Ecosystem',
    metaDesc:
      'ALLYNC company profile: Allync Hub, Digital Signage and Allync+ — communication, screens and operations unified in one AI-powered business ecosystem.',
    brand: 'ALLYNC',
    home: 'Home',
    cover: {
      eyebrow: 'AI Business Ecosystem · Company Profile',
      slogan: 'The New Language of Smart Business',
      sub: 'Akıllı İşin Yeni Dili',
      chips: ['Meta-Verified Provider', 'Founded 2024', 'Türkiye · Qatar · Worldwide'],
      duns: 'DUNS 751168710',
      scroll: 'Scroll to explore',
    },
    who: {
      eyebrow: 'Who We Are',
      title: ['Not a single tool —', 'an end-to-end ecosystem.'],
      lead: 'ALLYNC lets businesses run their **communication**, **digital screens** and **entire operations** from one connected, AI-powered ecosystem. Instead of dozens of disconnected tools — one platform.',
      pillars: [
        { c: '--hub', tag: 'Communication', h: 'Allync Hub', p: 'The communication platform that unifies WhatsApp, Instagram and Messenger into one AI inbox.' },
        { c: '--signage', tag: 'Screens', h: 'Digital Signage', p: 'Smart signage that manages Android and Windows screens in real time from one cloud.' },
        { c: '--plus', tag: 'Operations', h: 'Allync+', p: 'A ~40-module business platform: HR, CRM, sales, accounting, inventory and industry modules.' },
      ],
      oneline: ['One login.', 'One panel.', 'One infrastructure.', 'One partner.'],
    },
    hub: {
      eyebrow: '01 — AI Communication Platform',
      title: 'Allync Hub',
      lead: 'Whatever channel a customer writes from, the AI knows the prior conversation and continues where it left off. **One AI engine, one customer memory.**',
      feat: ['WhatsApp · Instagram · Messenger in one inbox', '24/7 AI assistant + one-tap human handoff', 'Bookings & approved campaigns', 'Sentiment analysis & live analytics', 'Function Calling — executes real actions', '2FA · white-label · multi-tenant'],
      chip: 'Web · Android · iOS live',
      demo: { name: 'Allync Hub', status: 'AI active', input: 'AI is replying…', msgs: [
        { side: 'in', who: 'WhatsApp', t: 'Any slot tomorrow at 3 PM?' },
        { side: 'ai', t: 'Of course! Tomorrow 3 PM is free. Shall I book it for you? 💫' },
        { side: 'in', who: 'Instagram', t: 'Could you share the price list?' },
        { side: 'ai', t: 'Sent your tailored packages ✓' },
        { side: 'in', who: 'Messenger', t: 'Thank you!' },
      ] },
    },
    signage: {
      eyebrow: '02 — Smart Digital Signage',
      title: 'Digital Signage',
      lead: 'Turn screens into **smart devices**. Real time to thousands of screens from one cloud; uninterrupted even offline.',
      feat: ['Instant AI image generation', 'Video wall — zoned display', 'Emergency & maintenance mode', 'Realtime + scheduled commands', 'Restart · screenshot · uptime', 'Moments — personal celebration on check-in', 'DOOH ads · kiosk · heatmap', 'Android TV/tablet + Windows native'],
      demo: { live: 'LIVE', cap: ['Summer', 'Campaign'], w1: { lbl: 'Weather · Bursa', big: '24°', sm: 'Partly cloudy' }, w2: { lbl: 'Digital Menu', big: 'Latte · Mocha', sm: 'Live pricing' } },
    },
    plus: {
      eyebrow: '03 — Business Management Platform',
      title: 'Allync+',
      lead: 'From HR to accounting, CRM to inventory — all operations in one panel. **~40 modules configured per industry**; ERP breadth, single-panel simplicity.',
      feat: ['HR · payroll · shifts · attendance', 'CRM · sales · invoicing · accounting', 'Inventory · payments · reporting · RBAC', 'Fitness, Beauty & dozens of industry modules', 'Native Customer & Staff apps', 'Biostar · camera · NFC · QR integration'],
      dash: { menu: ['Panel', 'HR', 'CRM', 'Sales', 'Finance', 'Stock', 'Reports'], kpis: [['1,284', 'Members'], ['$ 342K', 'Revenue ▲'], ['96%', 'Occupancy']] },
    },
    journey: {
      eyebrow: 'The Ecosystem at Work',
      title: ['A day at a gym —', 'in one ecosystem.'],
      lead: 'Three platforms + hardware, working together in a single member journey.',
      nodes: [
        { c: '--hub', n: '01', h: 'Booking', p: 'The member books a class over WhatsApp; the AI confirms instantly.', via: 'Allync Hub' },
        { c: '--plus', n: '02', h: 'Entry', p: 'Enters through the Biostar door with NFC/QR.', via: 'Allync+ · Hardware' },
        { c: '--signage', n: '03', h: 'Welcome', p: 'A birthday celebration & the day\'s program appear on screen.', via: 'Signage · Moments' },
        { c: '--plus', n: '04', h: 'Payment', p: 'Renews the membership from the mobile app.', via: 'Allync+ Customer App' },
      ],
    },
    security: {
      eyebrow: 'Security & Compliance',
      title: ['Trust isn\'t bolted on —', 'it\'s built into every layer.'],
      badges: [
        { h: 'Privacy First', p: 'Business data belongs to the business. Never sold, never shared.' },
        { h: 'GDPR · KVKK', p: 'Aligned with ISO 27001 / SOC 2 control frameworks.' },
        { h: 'Data Ownership', p: 'Export, instant deletion, retention control.' },
        { h: 'Regional Hosting', p: 'Turkish data in Türkiye — data residency.' },
        { h: 'Authentication', p: 'MFA · 2FA · Face ID · fingerprint · RBAC.' },
        { h: 'Continuity', p: 'End-to-end encryption, backups, disaster recovery.' },
      ],
    },
    tech: {
      eyebrow: 'Technology Stack',
      title: ['Three major AI providers,', 'one intelligent engine.'],
      provs: [['OpenAI', 'GPT + Whisper/TTS voice'], ['Anthropic', 'Claude — replies & sentiment'], ['Google', 'Gemini — generative content']],
      stack: ['Meta WhatsApp Business', 'Instagram API', 'Supabase', 'React · Next.js', 'React Native · Kotlin · Swift', 'Function Calling', 'Biostar · IoT · NFC · QR', 'Multi-tenant SaaS'],
    },
    why: {
      eyebrow: 'Why ALLYNC',
      title: 'Why 10 vendors? One partner is enough.',
      scatter: ['CRM', 'HR', 'Signage', 'Mobile App', 'AI', 'Comms', 'IoT', 'Analytics', 'Access Control', 'Booking'],
      sub: 'One login · one panel · one infrastructure · one partner',
    },
    contact: {
      eyebrow: 'Company Details & Contact',
      title: 'Let\'s talk.',
      corpH: 'Corporate',
      corp: [['Legal name', 'ALLYNC'], ['Headquarters', 'İnegöl / Bursa · Türkiye'], ['Operations hub', 'Doha · Qatar'], ['Tax / Reg. No', '8950466196'], ['D-U-N-S', '751168710']],
      contactH: 'Contact',
      cont: [['Qatar', '+974 5107 9565'], ['Türkiye', '+90 536 247 7824'], ['Email', 'info@allyncai.com'], ['Web', 'allyncai.com']],
    },
    closing: {
      big: ['We don\'t build software.', 'We build', 'smart business ecosystems', '.'],
      sig: 'The New Language of Smart Business',
      chips: ['allyncai.com', 'Meta-Verified Technology Provider'],
    },
    labels: ['Cover', 'Who We Are', 'Allync Hub', 'Digital Signage', 'Allync+', 'At Work', 'Security', 'Technology', 'Why ALLYNC', 'Contact', 'Closing'],
  },
} as const;

/* real app screenshots placed inside the crossed iPhone duo (Hub panel).
   null slots render a "Görsel N" placeholder until an image is provided. */
const HUB_SHOTS: (string | null)[] = [
  '/assets/blog/Allync-Hub-Home.png',
  '/assets/blog/Allync-Hub-Conversations.png',
];
/* real content shown on the Digital Signage screen (null = CSS zone mockup) */
const SIGNAGE_SHOT: string | null = '/assets/blog/unnamed.png';

/* tiny **bold** -> <strong> renderer */
function rich(s: string): React.ReactNode {
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : <React.Fragment key={i}>{p}</React.Fragment>
  );
}

const CompanyProfileInner: React.FC = () => {
  const [lang, setLang] = useState<Lang>('tr');
  const [idx, setIdx] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const deckRef = useRef<HTMLDivElement | null>(null);
  const t = C[lang];
  const N = t.labels.length;

  // carousel behaviour (wheel / drag / keyboard / observer)
  useEffect(() => {
    const deck = deckRef.current;
    const root = rootRef.current;
    if (!deck || !root) return;
    const panels = Array.from(deck.querySelectorAll<HTMLElement>('.panel'));
    const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const mqMob = window.matchMedia('(max-width:900px)');
    const isMob = () => mqMob.matches;
    let cur = 0;

    const setAccent = (p: HTMLElement) => {
      const a = p.dataset.accent || '--ice';
      root.style.setProperty('--accent', `var(${a})`);
    };
    const go = (i: number) => {
      i = Math.max(0, Math.min(panels.length - 1, i));
      panels[i].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', inline: 'center', block: 'center' });
    };
    (root as any)._go = go;

    const update = (i: number) => {
      if (i === cur) return;
      cur = i;
      setIdx(i);
      panels.forEach((p, k) => p.classList.toggle('active', k === i));
      setAccent(panels[i]);
    };

    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting && e.intersectionRatio > 0.55) update(panels.indexOf(e.target as HTMLElement)); }),
      { root: deck, threshold: [0.55, 0.75] }
    );
    panels.forEach((p) => io.observe(p));
    panels[0]?.classList.add('active');

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(cur + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(cur - 1); }
      else if (e.key === 'Home') { e.preventDefault(); go(0); }
      else if (e.key === 'End') { e.preventDefault(); go(panels.length - 1); }
    };
    window.addEventListener('keydown', onKey);

    let lock = false;
    const onWheel = (e: WheelEvent) => {
      if (isMob()) return;
      const d = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(d) < 8) return;
      e.preventDefault();
      if (lock) return;
      lock = true;
      go(cur + (d > 0 ? 1 : -1));
      setTimeout(() => { lock = false; }, reduce ? 150 : 620);
    };
    deck.addEventListener('wheel', onWheel, { passive: false });

    let down = false, sx = 0, sl = 0, moved = false;
    const onDown = (e: PointerEvent) => {
      if (isMob() || (e.target as HTMLElement).closest('.nav')) return;
      down = true; moved = false; sx = e.clientX; sl = deck.scrollLeft; deck.style.scrollBehavior = 'auto';
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; deck.scrollLeft = sl - dx;
    };
    const onUp = () => {
      if (!down) return; down = false; deck.style.scrollBehavior = '';
      if (moved) { const w = window.innerWidth; go(Math.round(deck.scrollLeft / w)); }
    };
    deck.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    return () => {
      io.disconnect();
      window.removeEventListener('keydown', onKey);
      deck.removeEventListener('wheel', onWheel);
      deck.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [lang]);

  // lock body scroll while the takeover carousel is mounted
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const go = (i: number) => (rootRef.current as any)?._go?.(i);
  const cur2 = ('0' + (idx + 1)).slice(-2);
  const tot = ('0' + N).slice(-2);

  return (
    <div className="cprofile" ref={rootRef} lang={lang}>
      <Helmet>
        <html lang={lang} />
        <title>{t.metaTitle}</title>
        <meta name="description" content={t.metaDesc} />
        <link rel="canonical" href="https://www.allyncai.com/company-profile" />
        <link rel="alternate" hrefLang="tr" href="https://www.allyncai.com/company-profile" />
        <link rel="alternate" hrefLang="en" href="https://www.allyncai.com/company-profile" />
        <link rel="alternate" hrefLang="x-default" href="https://www.allyncai.com/company-profile" />
        <meta property="og:title" content={t.metaTitle} />
        <meta property="og:description" content={t.metaDesc} />
        <meta property="og:url" content="https://www.allyncai.com/company-profile" />
      </Helmet>

      <Suspense fallback={null}>
        <FloatingLines
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[4, 4, 4]}
          lineDistance={[6, 6, 6]}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive
          parallax={false}
          mixBlendMode="normal"
          linesGradient={['#213448', '#547792', '#94B4C1', '#EAE0CF']}
        />
      </Suspense>
      <div className="cp-grain" />
      <div className="cp-vign" />
      <div className="cp-frame">
        <span className="corner tl" /><span className="corner tr" />
        <span className="corner bl" /><span className="corner br" />
      </div>

      {/* chrome */}
      <div className="topbar">
        <LivingLogo iconOnly size="40px" fill="#EAE0CF" className="mark" trackingScope="viewport" />
        <Link to="/" className="home-link">
          <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
          <span>{t.home}</span>
        </Link>
      </div>
      <div className="counter"><b>{cur2}</b> / <span>{tot}</span></div>

      <div className="deck" ref={deckRef}>

        {/* 01 COVER */}
        <section className="panel active" data-accent="--hub">
          <div className="wrap cover">
            <div className="eyebrow fadein">{t.cover.eyebrow}</div>
            <div className="fadein"><LivingLogo size="clamp(300px,46vw,600px)" fill="#EAE0CF" className="cover-logo" trackingScope="viewport" /></div>
            <div className="slogan fadein">{t.cover.slogan}</div>
            <div className="cover-sub fadein">{t.cover.sub}</div>
            <div className="chips cover-chips fadein">
              {t.cover.chips.map((c, i) => (
                <span className="chip" key={i}>{i === 0 && <span className="dot" />}{c}</span>
              ))}
              <span className="chip mono">{t.cover.duns}</span>
            </div>
            <div className="scrollcue fadein">{t.cover.scroll}
              <svg width="34" height="12" viewBox="0 0 34 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6h28m0 0l-6-4m6 4l-6 4" /></svg>
            </div>
          </div>
        </section>

        {/* 02 WHO */}
        <section className="panel" data-accent="--ice">
          <div className="wrap">
            <div className="eyebrow fadein">{t.who.eyebrow}</div>
            <h2 className="ptitle fadein">{t.who.title[0]}<br /><span className="kicker">{t.who.title[1]}</span></h2>
            <p className="lead fadein">{rich(t.who.lead)}</p>
            <div className="pillars fadein">
              {t.who.pillars.map((p, i) => (
                <article className="pillar glass" style={{ ['--c' as any]: `var(${p.c})` }} key={i}>
                  <div className="glow" />
                  <div className="picon">{PILLAR_ICONS[i]}</div>
                  <div className="tag" style={{ marginTop: '.8rem' }}>{p.tag}</div>
                  <h3>{p.h}</h3>
                  <p>{p.p}</p>
                </article>
              ))}
            </div>
            <div className="oneline fadein">
              {t.who.oneline.map((o, i) => (
                <React.Fragment key={i}>{i > 0 && <span>·</span>}<b>{o}</b></React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* 03 HUB */}
        <section className="panel" data-accent="--hub">
          <div className="wrap split">
            <div className="stack">
              <div className="eyebrow fadein" style={{ ['--accent' as any]: 'var(--hub)' }}>{t.hub.eyebrow}</div>
              <h2 className="ptitle fadein">{t.hub.title}</h2>
              <p className="lead fadein">{rich(t.hub.lead)}</p>
              <ul className="feat fadein" style={{ ['--accent' as any]: 'var(--hub)' }}>
                {t.hub.feat.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
              <div className="chips fadein"><span className="chip" style={{ ['--accent' as any]: 'var(--hub)' }}><span className="dot" />{t.hub.chip}</span></div>
            </div>
            <div className="device-stage fadein">
              <div className="phone-duo">
                <div className="iphone dp-back">
                  <span className="ip-btn sw" /><span className="ip-btn vu" /><span className="ip-btn vd" />
                  <div className="scr">
                    <div className="island"><span className="cam" /></div>
                    {HUB_SHOTS[0]
                      ? <img className="shot" src={HUB_SHOTS[0]} alt="Allync Hub" />
                      : <div className="shot-ph">Görsel 1</div>}
                    <div className="glare" /><div className="home-ind" />
                  </div>
                </div>
                <div className="iphone dp-front">
                  <span className="ip-btn pw" />
                  <div className="scr">
                    <div className="island"><span className="cam" /></div>
                    {HUB_SHOTS[1]
                      ? <img className="shot" src={HUB_SHOTS[1]} alt="Allync Hub" />
                      : <div className="shot-ph">Görsel 2</div>}
                    <div className="glare" /><div className="home-ind" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 SIGNAGE */}
        <section className="panel" data-accent="--signage">
          <div className="wrap split">
            <div className="device-stage fadein">
              <div className="signage float">
                <div className="disp">
                  <div className="scr">
                    {SIGNAGE_SHOT ? (
                      <img className="dev-shot" src={SIGNAGE_SHOT} alt="Allync Digital Signage" />
                    ) : (
                      <div className="zones">
                        <div className="zmain">
                          <div className="play">{t.signage.demo.live}</div>
                          <div className="cap">{t.signage.demo.cap[0]}<br />{t.signage.demo.cap[1]}</div>
                        </div>
                        <div className="zwidget"><div className="lbl">{t.signage.demo.w1.lbl}</div><div className="big">{t.signage.demo.w1.big}</div><div className="sm">{t.signage.demo.w1.sm}</div></div>
                        <div className="zwidget"><div className="lbl">{t.signage.demo.w2.lbl}</div><div className="big" style={{ fontSize: '.6rem' }}>{t.signage.demo.w2.big}</div><div className="sm">{t.signage.demo.w2.sm}</div></div>
                      </div>
                    )}
                    <div className="live-badge">{t.signage.demo.live}</div>
                  </div>
                </div>
                <div className="neck" /><div className="foot" />
                <div className="ctrl-phone"><div className="cs"><div className="ttl">Signage</div><div className="row a" /><div className="row" /><div className="row" style={{ width: '88%' }} /><div className="btn" /></div></div>
              </div>
            </div>
            <div className="stack">
              <div className="eyebrow fadein" style={{ ['--accent' as any]: 'var(--signage)' }}>{t.signage.eyebrow}</div>
              <h2 className="ptitle fadein">{t.signage.title}</h2>
              <p className="lead fadein">{rich(t.signage.lead)}</p>
              <ul className="feat fadein" style={{ ['--accent' as any]: 'var(--signage)' }}>
                {t.signage.feat.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* 05 PLUS */}
        <section className="panel" data-accent="--plus">
          <div className="wrap split">
            <div className="stack">
              <div className="eyebrow fadein" style={{ ['--accent' as any]: 'var(--plus)' }}>{t.plus.eyebrow}</div>
              <h2 className="ptitle fadein">{t.plus.title}</h2>
              <p className="lead fadein">{rich(t.plus.lead)}</p>
              <ul className="feat fadein" style={{ ['--accent' as any]: 'var(--plus)' }}>
                {t.plus.feat.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
            <div className="device-stage fadein">
              <div className="macbook float">
                <div className="lid">
                  <span className="cam" />
                  <div className="scr">
                    <div className="dash">
                      <div className="side">
                        <div className="logo">Allync<b>+</b></div>
                        {t.plus.dash.menu.map((m, i) => <div className={`mrow${i === 0 ? ' on' : ''}`} key={i}>{m}</div>)}
                      </div>
                      <div className="main">
                        <div className="kpis">
                          {t.plus.dash.kpis.map((k, i) => (
                            <div className="kpi" key={i}><div className="n">{k[0]}</div><div className="l">{k[1]}</div></div>
                          ))}
                        </div>
                        <div className="chart">
                          {[45, 62, 38, 78, 55, 90, 70, 82].map((h, i) => <div className="bar" style={{ height: `${h}%` }} key={i} />)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="base" />
              </div>
            </div>
          </div>
        </section>

        {/* 06 JOURNEY */}
        <section className="panel" data-accent="--hub">
          <div className="wrap">
            <div className="eyebrow fadein">{t.journey.eyebrow}</div>
            <h2 className="ptitle fadein">{t.journey.title[0]}<br /><span className="kicker">{t.journey.title[1]}</span></h2>
            <p className="lead fadein">{t.journey.lead}</p>
            <div className="journey fadein">
              {t.journey.nodes.map((n, i) => (
                <div className="jnode glass" style={{ ['--accent' as any]: `var(${n.c})` }} key={i}>
                  <div className="num">{n.n}</div><h4>{n.h}</h4><p>{n.p}</p><div className="via">{n.via}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 07 SECURITY */}
        <section className="panel" data-accent="--plus">
          <div className="wrap">
            <div className="eyebrow fadein">{t.security.eyebrow}</div>
            <h2 className="ptitle fadein">{t.security.title[0]}<br /><span className="kicker">{t.security.title[1]}</span></h2>
            <div className="bgrid fadein">
              {t.security.badges.map((b, i) => (
                <div className="badge glass" key={i}><h4><span className="d" />{b.h}</h4><p>{b.p}</p></div>
              ))}
            </div>
          </div>
        </section>

        {/* 08 TECH */}
        <section className="panel" data-accent="--ice">
          <div className="wrap" style={{ textAlign: 'center' }}>
            <div className="eyebrow fadein" style={{ justifyContent: 'center' }}>{t.tech.eyebrow}</div>
            <h2 className="ptitle fadein">{t.tech.title[0]}<br /><span className="kicker">{t.tech.title[1]}</span></h2>
            <div className="provs fadein">
              {t.tech.provs.map((p, i) => (
                <div className="prov glass" key={i}><div className="pn">{p[0]}</div><div className="pr">{p[1]}</div></div>
              ))}
            </div>
            <div className="stackline fadein">
              {t.tech.stack.map((s, i) => <span className="chip" key={i}>{s}</span>)}
            </div>
          </div>
        </section>

        {/* 09 WHY */}
        <section className="panel" data-accent="--hub">
          <div className="wrap">
            <div className="eyebrow fadein" style={{ justifyContent: 'center', display: 'flex' }}>{t.why.eyebrow}</div>
            <h2 className="ptitle fadein" style={{ textAlign: 'center' }}>{t.why.title}</h2>
            <div className="vs fadein">
              <div className="scatter">
                {t.why.scatter.map((s, i) => <span className="chip" key={i}>{s}</span>)}
              </div>
              <div className="arrow">→</div>
              <div className="one glass"><div className="glow" /><div className="bm">ALLYNC</div><div className="sub">{t.why.sub}</div></div>
            </div>
          </div>
        </section>

        {/* 10 CONTACT */}
        <section className="panel" data-accent="--ice">
          <div className="wrap">
            <div className="eyebrow fadein">{t.contact.eyebrow}</div>
            <h2 className="ptitle fadein">{t.contact.title}</h2>
            <div className="cgrid fadein">
              <div className="cbox glass">
                <h4>{t.contact.corpH}</h4>
                {t.contact.corp.map((r, i) => (
                  <div className="crow" key={i}><span className="k">{r[0]}</span><span className={`v${i >= 3 ? ' mono' : ''}`}>{r[1]}</span></div>
                ))}
              </div>
              <div className="cbox glass">
                <h4>{t.contact.contactH}</h4>
                {t.contact.cont.map((r, i) => (
                  <div className="crow" key={i}><span className="k">{r[0]}</span><span className="v">{r[1]}</span></div>
                ))}
                <div className="socs"><span className="soc">X</span><span className="soc">IG</span><span className="soc">in</span><span className="soc">YT</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* 11 CLOSING */}
        <section className="panel" data-accent="--hub">
          <div className="wrap closing">
            <div className="eyebrow fadein" style={{ justifyContent: 'center', display: 'flex' }}>ALLYNC</div>
            <div className="big fadein">{t.closing.big[0]}<br />{t.closing.big[1]} <em>{t.closing.big[2]}</em>{t.closing.big[3]}</div>
            <div className="sig fadein">{t.closing.sig}</div>
            <div className="chips fadein" style={{ justifyContent: 'center', marginTop: '1.4rem' }}>
              <span className="chip"><span className="dot" />{t.closing.chips[0]}</span>
              <span className="chip">{t.closing.chips[1]}</span>
            </div>
          </div>
        </section>

      </div>

      <nav className="nav">
        <button className="nbtn" onClick={() => go(idx - 1)} aria-label="prev"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg></button>
        <div className="dots">
          {t.labels.map((l, i) => (
            <button className={`dot-i${i === idx ? ' on' : ''}`} key={i} aria-label={l} onClick={() => go(i)} />
          ))}
        </div>
        <button className="nbtn" onClick={() => go(idx + 1)} aria-label="next"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg></button>
        <span className="divider" />
        <button className="lang" onClick={() => setLang((l) => (l === 'tr' ? 'en' : 'tr'))}>{lang === 'tr' ? 'EN' : 'TR'}</button>
      </nav>
    </div>
  );
};

const PILLAR_ICONS = [
  <svg viewBox="0 0 24 24" key="0"><path d="M21 11.5a8.38 8.38 0 0 1-9 8.34A9 9 0 1 1 21 11.5z" /><path d="M8 10h8M8 13.5h5" /></svg>,
  <svg viewBox="0 0 24 24" key="1"><rect x="2.5" y="4" width="19" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg>,
  <svg viewBox="0 0 24 24" key="2"><rect x="3" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" /></svg>,
];

export const CompanyProfile: React.FC = () => (
  <HelmetProvider>
    <CompanyProfileInner />
  </HelmetProvider>
);

export default CompanyProfile;
