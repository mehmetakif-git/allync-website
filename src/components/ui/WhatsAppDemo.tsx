import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Video, MoreVertical, Smile, Paperclip, Mic, ArrowLeft, RotateCcw, X } from 'lucide-react';
import { ChatBubble, TypingIndicator } from './ChatBubble';
import { whatsappDemoScenarios, whatsappUIText, DemoMessage, DemoScenario } from '../../data/whatsappDemoScenarios';

// WhatsApp Demo Logo - 40x40px display, provide 80x80px for retina
import demoLogo from '../../assets/whatsapp-demo-logo.png';

interface WhatsAppDemoProps {
  language: 'tr' | 'en';
  onContactClick?: () => void;
  onClose?: () => void;
}

export const WhatsAppDemo: React.FC<WhatsAppDemoProps> = ({ language, onContactClick, onClose }) => {
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario | null>(null);
  const [visibleMessages, setVisibleMessages] = useState<DemoMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { playBackSound } = useSoundEffect();

  const t = whatsappUIText[language];

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [visibleMessages, isTyping]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const playDemo = useCallback((scenario: DemoScenario) => {
    const messages = scenario.messages[language];
    let currentIndex = 0;
    setVisibleMessages([]);
    setDemoCompleted(false);
    setIsPlaying(true);
    setIsTyping(false);

    const showNextMessage = () => {
      if (currentIndex >= messages.length) {
        setDemoCompleted(true);
        setIsPlaying(false);
        setIsTyping(false);
        return;
      }

      const message = messages[currentIndex];

      // Show typing indicator for bot messages
      if (message.type === 'bot') {
        setIsTyping(true);
        timeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages(prev => [...prev, message]);
          currentIndex++;
          timeoutRef.current = setTimeout(showNextMessage, message.delay);
        }, 800); // Typing duration
      } else {
        // User messages appear directly
        setVisibleMessages(prev => [...prev, message]);
        currentIndex++;
        timeoutRef.current = setTimeout(showNextMessage, message.delay);
      }
    };

    // Start demo after initial delay
    timeoutRef.current = setTimeout(showNextMessage, 500);
  }, [language]);

  const handleScenarioSelect = (scenario: DemoScenario) => {
    // Clear any running demo
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSelectedScenario(scenario);
    playDemo(scenario);
  };

  const handleRestart = () => {
    if (selectedScenario) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      playDemo(selectedScenario);
    }
  };

  const handleBack = () => {
    playBackSound();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSelectedScenario(null);
    setVisibleMessages([]);
    setIsTyping(false);
    setDemoCompleted(false);
    setIsPlaying(false);
  };

  // Scenario Selection Screen
  if (!selectedScenario) {
    return (
      <div className="h-full flex flex-col bg-[#111b21]">
        {/* Header - pt-12 for desktop (Dynamic Island space), pt-3 for mobile */}
        <div className={`bg-[#202c33] px-4 py-3 flex items-center gap-3 ${onClose ? '' : 'pt-12'}`}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-[#00a884]">
            <img
              src={demoLogo}
              alt="Allync AI"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-white text-[15px] font-medium">{t.headerTitle}</h3>
            <p className="text-[#8696a0] text-[12px]">{t.selectScenario}</p>
          </div>
          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-[#aebac1]" />
            </button>
          )}
        </div>

        {/* Scenario List */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid gap-3">
            {whatsappDemoScenarios.map((scenario) => (
              <motion.button
                key={scenario.id}
                onClick={() => handleScenarioSelect(scenario)}
                className="w-full p-4 bg-[#202c33] rounded-xl flex items-center gap-4 hover:bg-[#2a3942] transition-colors text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl">{scenario.icon}</span>
                <div>
                  <h4 className="text-white text-[14px] font-medium">
                    {scenario.title[language]}
                  </h4>
                  <p className="text-[#8696a0] text-[12px]">
                    {scenario.messages[language].length} {language === 'tr' ? 'mesaj' : 'messages'}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Chat Screen
  return (
    <div className="h-full flex flex-col bg-[#0b141a]">
      {/* WhatsApp Header - pt-12 for desktop (Dynamic Island space) */}
      <div className={`bg-[#202c33] px-2 py-2 flex items-center gap-2 ${onClose ? '' : 'pt-12'}`}>
        <button
          onClick={handleBack}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#aebac1]" />
        </button>

        {/* Profile */}
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ring-2 ring-[#00a884]">
          <img
            src={demoLogo}
            alt="Allync AI"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white text-[15px] font-medium truncate">{t.headerTitle}</h3>
          <p className="text-[#8696a0] text-[11px]">
            {isTyping ? t.typing : t.online}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Video className="w-5 h-5 text-[#aebac1]" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Phone className="w-5 h-5 text-[#aebac1]" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-[#aebac1]" />
          </button>
          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors ml-1"
            >
              <X className="w-5 h-5 text-[#aebac1]" />
            </button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-3 py-2"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23182229\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundColor: '#0b141a'
        }}
      >
        {/* Messages */}
        <AnimatePresence>
          {visibleMessages.map((message) => (
            <ChatBubble
              key={message.id}
              type={message.type}
              content={message.content}
              buttons={message.buttons}
              isRead={true}
            />
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && <TypingIndicator />}
        </AnimatePresence>

        {/* Demo Completed Actions */}
        <AnimatePresence>
          {demoCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-2 mt-4 pb-2"
            >
              <button
                onClick={handleRestart}
                className="w-full py-2.5 bg-[#00a884] text-white rounded-lg text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[#00a884]/90 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                {t.restart}
              </button>
              {onContactClick && (
                <button
                  onClick={onContactClick}
                  className="w-full py-2.5 bg-[#202c33] text-[#00a884] rounded-lg text-[13px] font-medium hover:bg-[#2a3942] transition-colors"
                >
                  {t.contact}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="bg-[#202c33] px-2 py-2 flex items-center gap-2">
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <Smile className="w-6 h-6 text-[#8696a0]" />
        </button>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <Paperclip className="w-6 h-6 text-[#8696a0]" />
        </button>
        <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2">
          <span className="text-[#8696a0] text-[14px]">{t.inputPlaceholder}</span>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <Mic className="w-6 h-6 text-[#8696a0]" />
        </button>
      </div>
    </div>
  );
};
