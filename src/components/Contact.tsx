import React, { useState } from 'react';
import { Send, Phone, Mail, Calendar } from 'lucide-react';
import { translations } from '../utils/translations';
import { InputGlow, LabelGlow, LabelInputContainer, BottomGradient } from './ui/InputGlow';
import GradientText from './ui/GradientText';
import confetti from 'canvas-confetti';

interface ContactProps {
  language: 'tr' | 'en';
}

export const Contact: React.FC<ContactProps> = ({ language }) => {
  const t = translations[language];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    message: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

  const handleSuccessConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return window.clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    setStatusMessage('');

    console.log('Form submission started');
    console.log('Form data:', formData);
    console.log('Is form valid:', isFormValid);
    console.log('Errors:', errors);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, language }),
      });

      const data = await response.json();
      console.log('✅ API response:', data);

      if (response.ok) {
        setStatusMessage(language === 'tr' ? 'Mesajınız başarıyla gönderildi!' : 'Your message has been sent successfully!');
        handleSuccessConfetti();
        setFormData({ name: '', email: '', phone: '', business: '', message: '' });

        // Google Ads Conversion Tracking
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'conversion_event_submit_lead_form', {
            'event_callback': () => console.log('Google Ads conversion tracked'),
            'event_timeout': 2000,
          });
        }
      } else {
        throw new Error(data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('❌ Form submission failed:', error);
      setStatusMessage(language === 'tr' ? 'Bir hata oluştu, lütfen tekrar deneyin.' : 'An error occurred, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email') {
      if (value && !emailRegex.test(value)) {
        setErrors({ ...errors, email: language === 'tr' ? 'Geçerli bir e-posta adresi girin' : 'Enter a valid email address' });
      } else {
        setErrors({ ...errors, email: '' });
      }
    }

    if (name === 'phone') {
      if (!value) {
        setErrors(prev => ({ ...prev, phone: language === 'tr' ? 'Telefon numarası zorunludur' : 'Phone number is required' }));
      } else if (value.length < 10) {
        setErrors(prev => ({ ...prev, phone: language === 'tr' ? 'Telefon numarası en az 10 karakter olmalıdır' : 'Phone number must be at least 10 characters' }));
      } else if (!phoneRegex.test(value)) {
        setErrors(prev => ({ ...prev, phone: language === 'tr' ? 'Geçerli bir telefon numarası girin' : 'Enter a valid phone number' }));
      } else {
        setErrors(prev => ({ ...prev, phone: '' }));
      }
    }

    if (name === 'message') {
      if (!value || value.trim() === '') {
        setErrors(prev => ({ ...prev, message: language === 'tr' ? 'Mesaj alanı zorunludur' : 'Message is required' }));
      } else if (value.trim().length < 10) {
        setErrors(prev => ({ ...prev, message: language === 'tr' ? 'Mesaj en az 10 karakter olmalıdır' : 'Message must be at least 10 characters' }));
      } else {
        setErrors(prev => ({ ...prev, message: '' }));
      }
    }
  };

  const isFormValid =
    formData.name && formData.name.trim() !== '' &&
    formData.email && !errors.email &&
    formData.phone && !errors.phone &&
    formData.business &&
    formData.message && formData.message.trim() !== '' && !errors.message;

  return (
    <section className="py-12 md:py-16 relative bg-black contact-section" id="contact">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12 section-reveal">
          <GradientText
            colors={["#22d3ee", "#3b82f6", "#22d3ee", "#3b82f6", "#22d3ee"]}
            animationSpeed={4}
            showBorder={false}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            {t.contactTitle}
          </GradientText>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">{t.contactSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Contact Form */}
          <div className="w-full bg-white/5 backdrop-blur-[6px] border border-white/10 rounded-2xl p-5 sm:p-6 lg:p-8 contact-form relative">
            <h3 className="text-2xl font-bold text-white mb-6">{t.getCustomDemo}</h3>

            <form onSubmit={handleSubmit} className="space-y-6 form-grid">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <LabelInputContainer>
                  <LabelGlow htmlFor="name">{t.fullName} *</LabelGlow>
                  <InputGlow
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={language === 'tr' ? 'Ahmet Yılmaz' : 'John Smith'}
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <LabelGlow htmlFor="email">{t.emailAddress} *</LabelGlow>
                  <InputGlow
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={language === 'tr' ? 'ahmet@sirket.com' : 'john@business.com'}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </LabelInputContainer>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <LabelInputContainer>
                  <LabelGlow htmlFor="phone">{t.phoneNumber} *</LabelGlow>
                  <InputGlow
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={language === 'tr' ? '+90 555 123 4567' : '+1 (555) 123-4567'}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </LabelInputContainer>

                <LabelInputContainer>
                  <LabelGlow htmlFor="business">{t.businessType} *</LabelGlow>
                  <select
                    id="business"
                    name="business"
                    required
                    value={formData.business}
                    onChange={handleChange}
                    className="w-full h-11 px-4 bg-gray-800 border-none rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all duration-300 text-sm sm:text-base cursor-pointer"
                  >
                    <option value="">{t.selectIndustry}</option>
                    <option value="salon">{t.salon}</option>
                    <option value="law">{t.law}</option>
                    <option value="healthcare">{t.healthcare}</option>
                    <option value="retail">{t.retail}</option>
                    <option value="restaurant">{t.restaurant}</option>
                    <option value="fitness">{t.fitness}</option>
                    <option value="veterinarian">{language === 'tr' ? 'Veteriner' : 'Veterinarian'}</option>
                    <option value="psychologist">{language === 'tr' ? 'Psikolog' : 'Psychologist'}</option>
                    <option value="dentist">{language === 'tr' ? 'Diş Hekimi' : 'Dentist'}</option>
                    <option value="photographer">{language === 'tr' ? 'Fotoğrafçı' : 'Photographer'}</option>
                    <option value="tailor">{language === 'tr' ? 'Terzi' : 'Tailor'}</option>
                    <option value="autoservice">{language === 'tr' ? 'Oto Servis' : 'Auto Service'}</option>
                    <option value="cleaning">{language === 'tr' ? 'Temizlik' : 'Cleaning'}</option>
                    <option value="electrician">{language === 'tr' ? 'Elektrikçi' : 'Electrician'}</option>
                    <option value="education">{language === 'tr' ? 'Eğitim' : 'Education'}</option>
                    <option value="other">{t.other}</option>
                  </select>
                </LabelInputContainer>
              </div>

              <LabelInputContainer>
                <LabelGlow htmlFor="message">{t.tellUsNeeds} *</LabelGlow>
                <InputGlow
                  id="message"
                  name="message"
                  isTextarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t.needsPlaceholder}
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </LabelInputContainer>

              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="group/btn relative h-12 sm:h-14 w-full rounded-md bg-gradient-to-br from-gray-700 to-gray-800 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="absolute inset-0 flex items-center justify-center">
                  {isSubmitting ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <span className="flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base px-4">
                      <span>{t.requestCustomQuote}</span>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                    </span>
                  )}
                </span>
                <BottomGradient />
              </button>
              {statusMessage && (
                <p className={`mt-4 text-center ${statusMessage.includes('hata') || statusMessage.includes('error') ? 'text-red-500' : 'text-green-500'}`}>
                  {statusMessage}
                </p>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div className="w-full flex flex-col gap-5 sm:gap-6 contact-info">
            <div className="bg-gradient-to-br from-gray-500/10 to-gray-400/10 backdrop-blur-[6px] border border-gray-500/20 rounded-2xl p-5 sm:p-6 lg:p-8 relative">
              <h3 className="text-xl sm:text-2xl font-bold text-white pb-4 sm:pb-6 border-b border-white/10 mb-5 sm:mb-6">{t.whyChooseAI}</h3>

              <div className="space-y-5 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/20">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">{t.quickSetup}</h4>
                    <p className="text-gray-400 text-sm sm:text-base">{t.quickSetupDesc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/20">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">{t.dedicatedSupport}</h4>
                    <p className="text-gray-400 text-sm sm:text-base">{t.dedicatedSupportDesc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/20">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">{t.provenResults}</h4>
                    <p className="text-gray-400 text-sm sm:text-base">{t.provenResultsDesc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats & Guarantee - consistent spacing */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-[6px] border border-white/10 rounded-xl p-4 text-center relative">
                <p className="text-2xl sm:text-3xl font-bold text-gray-300">500+</p>
                <p className="text-gray-400 text-xs sm:text-sm">{t.businessesAutomated}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-[6px] border border-white/10 rounded-xl p-4 text-center relative">
                <p className="text-2xl sm:text-3xl font-bold text-gray-400">98.5%</p>
                <p className="text-gray-400 text-xs sm:text-sm">{t.clientSatisfaction}</p>
              </div>
              {/* Guarantee - spans full width */}
              <div className="col-span-2 bg-gradient-to-r from-gray-500/10 to-gray-400/10 backdrop-blur-[6px] border border-gray-500/20 rounded-xl p-4 text-center relative">
                <h4 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">{t.guarantee}</h4>
                <p className="text-gray-400 text-xs sm:text-sm">{t.guaranteeDesc}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
