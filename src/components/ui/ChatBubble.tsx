import React from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck } from 'lucide-react';

interface ChatBubbleProps {
  type: 'user' | 'bot';
  content: string;
  buttons?: string[];
  timestamp?: string;
  isRead?: boolean;
  onButtonClick?: (button: string) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  type,
  content,
  buttons,
  timestamp,
  isRead = true,
  onButtonClick
}) => {
  const isUser = type === 'user';
  const currentTime = timestamp || new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-1`}
    >
      <div
        className={`relative max-w-[85%] ${isUser ? 'order-1' : 'order-1'}`}
      >
        {/* Message Bubble */}
        <div
          className={`relative px-3 py-1.5 rounded-lg ${
            isUser
              ? 'bg-[#005c4b] text-white rounded-tr-none'
              : 'bg-[#202c33] text-white rounded-tl-none'
          }`}
          style={{
            boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)'
          }}
        >
          {/* Tail */}
          <div
            className={`absolute top-0 w-3 h-3 ${
              isUser
                ? 'right-[-8px] bg-[#005c4b]'
                : 'left-[-8px] bg-[#202c33]'
            }`}
            style={{
              clipPath: isUser
                ? 'polygon(0 0, 100% 0, 0 100%)'
                : 'polygon(100% 0, 0 0, 100% 100%)'
            }}
          />

          {/* Content */}
          {content && (
            <p className="text-[13px] leading-[19px] whitespace-pre-wrap break-words pr-12">
              {content}
            </p>
          )}

          {/* Buttons */}
          {buttons && buttons.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {buttons.map((button, index) => (
                <button
                  key={index}
                  onClick={() => onButtonClick?.(button)}
                  className="px-3 py-1.5 text-[12px] font-medium text-[#00a884] bg-[#0b141a] rounded-full border border-[#00a884]/30 hover:bg-[#00a884]/10 transition-colors"
                >
                  {button}
                </button>
              ))}
            </div>
          )}

          {/* Timestamp & Read Status */}
          <div className={`absolute bottom-1 right-2 flex items-center gap-0.5 ${content ? '' : 'relative mt-1'}`}>
            <span className="text-[10px] text-white/60">
              {currentTime}
            </span>
            {isUser && (
              <span className="ml-0.5">
                {isRead ? (
                  <CheckCheck className="w-4 h-4 text-[#53bdeb]" />
                ) : (
                  <Check className="w-3.5 h-3.5 text-white/60" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Typing Indicator Component
export const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start mb-1"
    >
      <div
        className="relative px-4 py-2.5 rounded-lg bg-[#202c33] rounded-tl-none"
        style={{ boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)' }}
      >
        {/* Tail */}
        <div
          className="absolute top-0 left-[-8px] w-3 h-3 bg-[#202c33]"
          style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
        />

        {/* Dots */}
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
