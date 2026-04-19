import React from 'react';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';
import { translations } from '../utils/translations';
import { LegalModals } from './LegalModals';
import logoFooter from '../assets/logo-footer-en.svg';

interface FooterProps {
  language: 'tr' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language];

  return (
    <footer className="bg-black border-t border-white/10 relative">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4 sm:mb-6">
              <img src={logoFooter} alt="Allync" className="h-16 sm:h-20 w-auto" />
            </div>
            <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">{t.footerDesc}</p>
            <div className="flex space-x-3 sm:space-x-4">
              {/* X (Twitter) */}
              <a href="https://x.com/allync_ai" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors duration-300 cursor-pointer">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/allyncai" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors duration-300 cursor-pointer">
                <Instagram className="w-4 h-4 text-white" />
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/company/allyncai" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors duration-300 cursor-pointer">
                <span className="text-white text-sm font-bold">in</span>
              </a>
              {/* YouTube */}
              <a href="https://www.youtube.com/@allyncai" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors duration-300 cursor-pointer">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t.services}</h3>
            <ul className="space-y-2 sm:space-y-3 text-gray-400 text-xs sm:text-sm">
              <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">{t.whatsappAISetup}</a></li>
              <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">{t.customTraining}</a></li>
              <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">{t.databaseIntegration}</a></li>
              <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">{t.analyticsDashboard}</a></li>
              <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">{t.support247}</a></li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t.industries}</h3>
            <ul className="space-y-2 sm:space-y-3 text-gray-400 text-xs sm:text-sm">
              <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">{t.beautySalons}</a></li>
              <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">{t.lawFirms}</a></li>
              <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">{t.healthcare}</a></li>
              <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">{t.retail}</a></li>
              <li><a href="#" className="hover:text-gray-300 transition-colors duration-300">{t.restaurant}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t.contact}</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-300 flex-shrink-0" />
                <span className="text-xs sm:text-sm">info@allyncai.com</span>
              </div>
              <div className="flex items-start text-gray-400">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-300 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <a href="tel:+97451079565" className="hover:text-gray-300 transition-colors text-xs sm:text-sm">
                    {t.primaryPhone}
                  </a>
                  <a href="tel:+905362477824" className="hover:text-gray-300 transition-colors text-xs sm:text-sm">
                    {t.secondaryPhone}
                  </a>
                </div>
              </div>
              <div className="flex items-start text-gray-400">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-gray-300 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{language === 'tr' ? 'Katar Operasyon Merkezi' : 'Qatar Operations Center'}<br />{language === 'tr' ? 'Dünya Çapında Hizmet' : 'Worldwide Service'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8">
          {/* Company Compliance Section */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">{t.complianceTitle}</h4>
              <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">{t.companyCompliance}</p>
              <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">{t.dataProtection}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                <div className="flex items-center justify-center p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full mx-auto mb-1 sm:mb-2 animate-[breathing_2s_ease-in-out_infinite]"></div>
                    <span className="text-gray-300 text-xs sm:text-sm font-medium">ISO 27001</span>
                  </div>
                </div>
                <div className="flex items-center justify-center p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full mx-auto mb-1 sm:mb-2 animate-[breathing_2s_ease-in-out_infinite]"></div>
                    <span className="text-gray-300 text-xs sm:text-sm font-medium">GDPR</span>
                  </div>
                </div>
                <div className="flex items-center justify-center p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full mx-auto mb-1 sm:mb-2 animate-[breathing_2s_ease-in-out_infinite]"></div>
                    <span className="text-gray-300 text-xs sm:text-sm font-medium">SOC 2</span>
                  </div>
                </div>
                <div className="flex items-center justify-center p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-center">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full mx-auto mb-1 sm:mb-2 animate-[breathing_2s_ease-in-out_infinite]"></div>
                    <span className="text-gray-300 text-xs sm:text-sm font-medium">%99.9 SLA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Legal Info */}
          <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-white/10">
            <div className="flex flex-col gap-1.5 text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              <p>{t.registeredBrand}</p>
              <p>{t.companyAddress}</p>
              <p>{t.companyRegistrationNo}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <p className="text-gray-400 text-xs sm:text-sm">
              © 2026 ALLYNC. {t.allRightsReserved}
            </p>
            <LegalModals language={language} />
          </div>
        </div>
      </div>
    </footer>
  );
};