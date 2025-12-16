import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Used only in Navigation mobile menu
import {
  Menu,
  X,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Send,
  Users,
  Target,
  Award,
  TrendingUp,
  Check,
  Linkedin,
  Twitter
} from 'lucide-react';
import { useSoundEffect } from '../../contexts/SoundEffectContext';
import allyncLogo from '../../assets/logo.svg';
import { getTeamImage } from '../../assets/corporate-demo';

interface CorporateDemoProps {
  language: 'tr' | 'en';
  onContactClick?: () => void;
}

type DemoView = 'home' | 'about' | 'services' | 'contact';

// Navigation items
const navItems = {
  tr: ['Ana Sayfa', 'Hakkımızda', 'Hizmetler', 'İletişim'],
  en: ['Home', 'About', 'Services', 'Contact']
};

// Services data
const services = {
  tr: [
    { icon: Target, title: 'Strateji Danışmanlığı', desc: 'İşletmeniz için özel stratejiler' },
    { icon: TrendingUp, title: 'Büyüme Yönetimi', desc: 'Sürdürülebilir büyüme planları' },
    { icon: Users, title: 'İK Çözümleri', desc: 'Yetenek yönetimi ve gelişim' },
    { icon: Award, title: 'Kalite Güvence', desc: 'ISO standartları ve sertifikasyon' },
  ],
  en: [
    { icon: Target, title: 'Strategy Consulting', desc: 'Custom strategies for your business' },
    { icon: TrendingUp, title: 'Growth Management', desc: 'Sustainable growth plans' },
    { icon: Users, title: 'HR Solutions', desc: 'Talent management and development' },
    { icon: Award, title: 'Quality Assurance', desc: 'ISO standards and certification' },
  ]
};

// Team members
const team = {
  tr: [
    { name: 'Ahmet Yılmaz', role: 'CEO & Kurucu', color: 'from-blue-500 to-cyan-500', imageId: 'team-1' },
    { name: 'Elif Demir', role: 'CFO', color: 'from-purple-500 to-pink-500', imageId: 'team-2' },
    { name: 'Mehmet Kaya', role: 'CTO', color: 'from-green-500 to-emerald-500', imageId: 'team-3' },
  ],
  en: [
    { name: 'Ahmet Yilmaz', role: 'CEO & Founder', color: 'from-blue-500 to-cyan-500', imageId: 'team-1' },
    { name: 'Elif Demir', role: 'CFO', color: 'from-purple-500 to-pink-500', imageId: 'team-2' },
    { name: 'Mehmet Kaya', role: 'CTO', color: 'from-green-500 to-emerald-500', imageId: 'team-3' },
  ]
};

// Stats
const stats = [
  { value: '15+', label: { tr: 'Yıllık Deneyim', en: 'Years Experience' } },
  { value: '500+', label: { tr: 'Mutlu Müşteri', en: 'Happy Clients' } },
  { value: '50+', label: { tr: 'Uzman Ekip', en: 'Expert Team' } },
  { value: '99%', label: { tr: 'Müşteri Memnuniyeti', en: 'Client Satisfaction' } },
];

// Navigation Component
const Navigation = memo(({
  language,
  currentView,
  onNavigate,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}: {
  language: 'tr' | 'en';
  currentView: DemoView;
  onNavigate: (view: DemoView) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}) => {
  const views: DemoView[] = ['home', 'about', 'services', 'contact'];

  return (
    <nav className="sticky top-0 z-30 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/10">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center p-1.5">
            <img src={allyncLogo} alt="Allync" className="w-full h-full" />
          </div>
          <span className="text-white font-bold text-lg">Allync</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems[language].map((item, i) => (
            <button
              key={i}
              onClick={() => onNavigate(views[i])}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                currentView === views[i]
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Menu className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10"
          >
            {navItems[language].map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  onNavigate(views[i]);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                  currentView === views[i]
                    ? 'text-blue-400 bg-blue-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
});

export const CorporateDemo: React.FC<CorporateDemoProps> = ({ language, onContactClick }) => {
  const { playClickSound } = useSoundEffect();
  const [currentView, setCurrentView] = useState<DemoView>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleNavigate = (view: DemoView) => {
    playClickSound();
    setCurrentView(view);
  };

  // Home View - without animations to prevent re-render
  const HomeView = () => (
    <div className="min-h-full">
      {/* Hero Section */}
      <div className="relative px-4 py-12 md:py-16 overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'
          }}
        />

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div>
            <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full mb-4">
              {language === 'tr' ? '2009\'dan beri hizmetinizdeyiz' : 'Serving since 2009'}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {language === 'tr'
                ? 'İşletmenizi Geleceğe Taşıyoruz'
                : 'Taking Your Business to the Future'}
            </h1>
            <p className="text-gray-400 text-sm md:text-base mb-6">
              {language === 'tr'
                ? 'Kurumsal çözümler ve dijital dönüşüm hizmetleri ile işletmenizi bir adım öne taşıyoruz.'
                : 'We take your business one step ahead with corporate solutions and digital transformation services.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => handleNavigate('contact')}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                {language === 'tr' ? 'Bize Ulaşın' : 'Contact Us'}
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleNavigate('services')}
                className="px-5 py-2.5 bg-white/10 text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition-colors"
              >
                {language === 'tr' ? 'Hizmetlerimiz' : 'Our Services'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-8 bg-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-400">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label[language]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Services Preview */}
      <div className="px-4 py-8">
        <h2 className="text-lg font-bold text-white mb-4 text-center">
          {language === 'tr' ? 'Hizmetlerimiz' : 'Our Services'}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {services[language].slice(0, 4).map((service, i) => (
            <div
              key={i}
              className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/50 transition-colors cursor-pointer"
              onClick={() => handleNavigate('services')}
            >
              <service.icon className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white text-sm font-semibold mb-1">{service.title}</h3>
              <p className="text-gray-500 text-xs">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 py-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
        <div className="text-center">
          <h2 className="text-lg font-bold text-white mb-2">
            {language === 'tr' ? 'Projenizi Birlikte Hayata Geçirelim' : 'Let\'s Bring Your Project to Life'}
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            {language === 'tr'
              ? 'Ücretsiz danışmanlık için hemen iletişime geçin'
              : 'Contact us now for free consultation'}
          </p>
          <button
            onClick={() => handleNavigate('contact')}
            className="px-6 py-2.5 bg-white text-blue-600 text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            {language === 'tr' ? 'Ücretsiz Teklif Alın' : 'Get Free Quote'}
          </button>
        </div>
      </div>
    </div>
  );

  // About View - without animations
  const AboutView = () => (
    <div className="min-h-full px-4 py-8">
      <div>
        <h1 className="text-xl font-bold text-white mb-2">
          {language === 'tr' ? 'Hakkımızda' : 'About Us'}
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          {language === 'tr'
            ? '2009 yılından bu yana işletmelere kurumsal çözümler sunuyoruz. Deneyimli ekibimiz ve yenilikçi yaklaşımımızla müşterilerimizin başarısına katkı sağlıyoruz.'
            : 'Since 2009, we have been providing corporate solutions to businesses. With our experienced team and innovative approach, we contribute to our customers\' success.'}
        </p>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
            <h3 className="text-blue-400 font-semibold mb-2">
              {language === 'tr' ? 'Misyonumuz' : 'Our Mission'}
            </h3>
            <p className="text-gray-400 text-sm">
              {language === 'tr'
                ? 'İşletmelerin dijital dönüşümüne öncülük ederek sürdürülebilir büyüme sağlamak.'
                : 'To lead the digital transformation of businesses and ensure sustainable growth.'}
            </p>
          </div>
          <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
            <h3 className="text-cyan-400 font-semibold mb-2">
              {language === 'tr' ? 'Vizyonumuz' : 'Our Vision'}
            </h3>
            <p className="text-gray-400 text-sm">
              {language === 'tr'
                ? 'Türkiye\'nin lider kurumsal danışmanlık firması olmak.'
                : 'To become the leading corporate consulting firm in Turkey.'}
            </p>
          </div>
        </div>

        {/* Team */}
        <h2 className="text-lg font-bold text-white mb-4">
          {language === 'tr' ? 'Yönetim Ekibi' : 'Leadership Team'}
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {team[language].map((member, i) => {
            const teamImage = getTeamImage(member.imageId);
            return (
              <div key={i} className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center mb-2 overflow-hidden`}>
                  {teamImage ? (
                    <img src={teamImage} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                <h3 className="text-white text-sm font-semibold">{member.name}</h3>
                <p className="text-gray-500 text-xs">{member.role}</p>
              </div>
            );
          })}
        </div>

        {/* Values */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-white mb-4">
            {language === 'tr' ? 'Değerlerimiz' : 'Our Values'}
          </h2>
          <div className="space-y-2">
            {(language === 'tr'
              ? ['Müşteri Odaklılık', 'Yenilikçilik', 'Güvenilirlik', 'Şeffaflık']
              : ['Customer Focus', 'Innovation', 'Reliability', 'Transparency']
            ).map((value, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-300">
                <Check className="w-4 h-4 text-blue-400" />
                <span className="text-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Services View - without animations
  const ServicesView = () => (
    <div className="min-h-full px-4 py-8">
      <div>
        <h1 className="text-xl font-bold text-white mb-2">
          {language === 'tr' ? 'Hizmetlerimiz' : 'Our Services'}
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          {language === 'tr'
            ? 'İşletmenizin ihtiyaçlarına özel kapsamlı çözümler sunuyoruz.'
            : 'We offer comprehensive solutions tailored to your business needs.'}
        </p>

        <div className="space-y-4">
          {services[language].map((service, i) => (
            <div
              key={i}
              className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{service.title}</h3>
                  <p className="text-gray-400 text-sm">{service.desc}</p>
                  <button
                    onClick={() => handleNavigate('contact')}
                    className="mt-2 text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1"
                  >
                    {language === 'tr' ? 'Detaylı Bilgi' : 'Learn More'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing CTA */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl text-center">
          <h3 className="text-white font-semibold mb-2">
            {language === 'tr' ? 'Size Özel Teklif Alın' : 'Get Custom Quote'}
          </h3>
          <p className="text-gray-400 text-sm mb-3">
            {language === 'tr'
              ? 'İhtiyaçlarınıza uygun fiyatlandırma için bizimle iletişime geçin.'
              : 'Contact us for pricing tailored to your needs.'}
          </p>
          <button
            onClick={() => handleNavigate('contact')}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            {language === 'tr' ? 'İletişime Geç' : 'Contact Us'}
          </button>
        </div>
      </div>
    </div>
  );

  // Contact View - without animations for scroll
  const ContactView = () => (
    <div className="min-h-full px-4 py-8">
      {!formSubmitted ? (
        <div>
          <h1 className="text-xl font-bold text-white mb-2">
            {language === 'tr' ? 'İletişim' : 'Contact'}
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            {language === 'tr'
              ? 'Sorularınız için bize ulaşın, en kısa sürede dönüş yapalım.'
              : 'Reach out to us with your questions, we\'ll get back to you shortly.'}
          </p>

          {/* Contact Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Email</div>
                <div className="text-sm">info@allyncai.com</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-xs text-gray-500">{language === 'tr' ? 'Telefon' : 'Phone'}</div>
                <div className="text-sm">+90 212 555 0000</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-xs text-gray-500">{language === 'tr' ? 'Adres' : 'Address'}</div>
                <div className="text-sm">İstanbul, Türkiye</div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-4">
              {language === 'tr' ? 'Mesaj Gönderin' : 'Send Message'}
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder={language === 'tr' ? 'Adınız Soyadınız' : 'Full Name'}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50"
              />
              <input
                type="text"
                placeholder={language === 'tr' ? 'Konu' : 'Subject'}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50"
              />
              <textarea
                rows={3}
                placeholder={language === 'tr' ? 'Mesajınız...' : 'Your message...'}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 resize-none"
              />
              <button
                onClick={() => {
                  playClickSound();
                  setFormSubmitted(true);
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {language === 'tr' ? 'Gönder' : 'Send'}
              </button>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-6 flex justify-center gap-3">
            <button className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Linkedin className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Twitter className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            {language === 'tr' ? 'Mesajınız Alındı!' : 'Message Received!'}
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            {language === 'tr'
              ? 'En kısa sürede size dönüş yapacağız.'
              : 'We\'ll get back to you as soon as possible.'}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                playClickSound();
                setFormSubmitted(false);
                handleNavigate('home');
              }}
              className="w-full max-w-xs mx-auto py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity block"
            >
              {language === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home'}
            </button>
            {onContactClick && (
              <button
                onClick={onContactClick}
                className="w-full max-w-xs mx-auto py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors block"
              >
                {language === 'tr' ? 'Gerçek Web Sitesi İster misiniz?' : 'Want a Real Website?'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Footer
  const Footer = () => (
    <footer className="px-4 py-6 bg-[#050508] border-t border-white/10">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center p-1">
            <img src={allyncLogo} alt="Allync" className="w-full h-full" />
          </div>
          <span className="text-white font-semibold text-sm">Allync</span>
        </div>
        <p className="text-gray-500 text-xs">
          © 2025 Allync. {language === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
        </p>
      </div>
    </footer>
  );

  return (
    <div className="h-full flex flex-col">
      <Navigation
        language={language}
        currentView={currentView}
        onNavigate={handleNavigate}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {currentView === 'home' && <HomeView />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'services' && <ServicesView />}
        {currentView === 'contact' && <ContactView />}
      </div>

      <Footer />
    </div>
  );
};
