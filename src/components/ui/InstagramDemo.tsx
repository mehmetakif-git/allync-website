import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Video, Info, Camera, Image, Mic, Heart, ArrowLeft, RotateCcw } from 'lucide-react';
import { instagramDemoScenarios, instagramUIText, InstagramDemoMessage, InstagramDemoScenario } from '../../data/instagramDemoScenarios';
import { useSoundEffect } from '../../contexts/SoundEffectContext';

// Instagram Demo Logo - same as WhatsApp demo
import demoLogo from '../../assets/whatsapp-demo-logo.png';

interface InstagramDemoProps {
  language: 'tr' | 'en';
  onContactClick?: () => void;
}

// Instagram Chat Bubble Component
const InstagramChatBubble: React.FC<{
  type: 'user' | 'bot';
  content: string;
  buttons?: string[];
  isStoryReply?: boolean;
  onButtonClick?: (button: string) => void;
}> = ({ type, content, buttons, isStoryReply, onButtonClick }) => {
  const isUser = type === 'user';
  const hasContent = content && content.trim().length > 0;
  const hasButtons = buttons && buttons.length > 0;

  // Don't render anything if there's no content and no buttons
  if (!hasContent && !hasButtons) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div className={`max-w-[80%] ${isUser ? 'order-1' : 'order-1'}`}>
        {/* Story Reply Badge */}
        {isStoryReply && (
          <div className="text-[10px] text-gray-500 mb-1 text-center">
            Hikayenize yanıt verdi
          </div>
        )}

        {/* Message Bubble - only show if there's content */}
        {hasContent && (
          <div
            className={`px-4 py-2 rounded-3xl ${
              isUser
                ? 'bg-[#3797f0] text-white'
                : 'bg-[#262626] text-white'
            }`}
          >
            <p className="text-[14px] leading-[18px] whitespace-pre-wrap break-words">
              {content}
            </p>
          </div>
        )}

        {/* Buttons - Instagram style quick replies */}
        {hasButtons && (
          <div className={`flex flex-wrap gap-2 ${hasContent ? 'mt-2' : ''}`}>
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={() => onButtonClick?.(button)}
                className="px-4 py-2 text-[13px] font-medium text-white bg-[#262626] rounded-full border border-[#363636] hover:bg-[#363636] transition-colors"
              >
                {button}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Instagram Typing Indicator
const InstagramTypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start mb-2"
    >
      <div className="px-4 py-3 rounded-3xl bg-[#262626]">
        <div className="flex items-center gap-1">
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export const InstagramDemo: React.FC<InstagramDemoProps> = ({ language, onContactClick }) => {
  const [selectedScenario, setSelectedScenario] = useState<InstagramDemoScenario | null>(null);
  const [visibleMessages, setVisibleMessages] = useState<InstagramDemoMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { playBackSound } = useSoundEffect();

  const t = instagramUIText[language];

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

  const playDemo = useCallback((scenario: InstagramDemoScenario) => {
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

      if (message.type === 'bot') {
        setIsTyping(true);
        timeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages(prev => [...prev, message]);
          currentIndex++;
          timeoutRef.current = setTimeout(showNextMessage, message.delay);
        }, 800);
      } else {
        setVisibleMessages(prev => [...prev, message]);
        currentIndex++;
        timeoutRef.current = setTimeout(showNextMessage, message.delay);
      }
    };

    timeoutRef.current = setTimeout(showNextMessage, 500);
  }, [language]);

  const handleScenarioSelect = (scenario: InstagramDemoScenario) => {
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
      <div className="h-full flex flex-col bg-black">
        {/* Instagram Header - with Dynamic Island padding */}
        <div className="bg-black px-4 py-3 pt-12 flex items-center gap-3 border-b border-[#262626]">
          <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045]">
            <div className="w-full h-full rounded-full overflow-hidden">
              <img
                src={demoLogo}
                alt="Allync AI"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-white text-[15px] font-semibold">{t.headerTitle}</h3>
            <p className="text-[#a8a8a8] text-[12px]">{t.selectScenario}</p>
          </div>
        </div>

        {/* Scenario List */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid gap-3">
            {instagramDemoScenarios.map((scenario) => (
              <motion.button
                key={scenario.id}
                onClick={() => handleScenarioSelect(scenario)}
                className="w-full p-4 bg-[#262626] rounded-xl flex items-center gap-4 hover:bg-[#363636] transition-colors text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl">{scenario.icon}</span>
                <div>
                  <h4 className="text-white text-[14px] font-medium">
                    {scenario.title[language]}
                  </h4>
                  <p className="text-[#a8a8a8] text-[12px]">
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
    <div className="h-full flex flex-col bg-black">
      {/* Instagram DM Header - with Dynamic Island padding */}
      <div className="bg-black px-2 py-2 flex items-center gap-2 pt-12 border-b border-[#262626]">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Profile */}
        <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex-shrink-0">
          <div className="w-full h-full rounded-full overflow-hidden">
            <img
              src={demoLogo}
              alt="Allync AI"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white text-[14px] font-semibold truncate">{t.headerTitle}</h3>
          <p className="text-[#a8a8a8] text-[11px]">
            {isTyping ? t.typing : t.active}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Phone className="w-5 h-5 text-white" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Video className="w-5 h-5 text-white" />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Info className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4"
      >
        {/* Messages */}
        <AnimatePresence>
          {visibleMessages.map((message) => (
            <InstagramChatBubble
              key={message.id}
              type={message.type}
              content={message.content}
              buttons={message.buttons}
              isStoryReply={message.isStoryReply}
            />
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && <InstagramTypingIndicator />}
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
                className="w-full py-2.5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-lg text-[13px] font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <RotateCcw className="w-4 h-4" />
                {t.restart}
              </button>
              {onContactClick && (
                <button
                  onClick={onContactClick}
                  className="w-full py-2.5 bg-[#262626] text-white rounded-lg text-[13px] font-medium hover:bg-[#363636] transition-colors"
                >
                  {t.contact}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="bg-black px-4 py-3 flex items-center gap-3 border-t border-[#262626]">
        <button className="p-1 hover:opacity-70 transition-opacity">
          <Camera className="w-6 h-6 text-[#3797f0]" />
        </button>
        <div className="flex-1 bg-[#262626] rounded-full px-4 py-2 flex items-center">
          <span className="text-[#a8a8a8] text-[14px] flex-1">{t.inputPlaceholder}</span>
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-[#a8a8a8]" />
            <Image className="w-5 h-5 text-[#a8a8a8]" />
          </div>
        </div>
        <button className="p-1 hover:opacity-70 transition-opacity">
          <Heart className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};
