import React from 'react';
import { Lock, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface BrowserMockupProps {
  children: React.ReactNode;
  url?: string;
  className?: string;
  themeColor?: string;
}

export const BrowserMockup: React.FC<BrowserMockupProps> = ({
  children,
  url = 'shop.allync.com',
  className = '',
  themeColor = '#22C55E'
}) => {
  return (
    <div
      className={`relative w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[900px] ${className}`}
    >
      {/* Browser Frame */}
      <div
        className="relative rounded-lg sm:rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #2a2a3e 0%, #1a1a2e 100%)',
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px ${themeColor}20`,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Title Bar */}
        <div
          className="flex items-center px-2 sm:px-4 py-2 sm:py-3 border-b border-white/10"
          style={{
            background: 'linear-gradient(180deg, #3a3a4e 0%, #2a2a3e 100%)',
          }}
        >
          {/* Traffic Lights */}
          <div className="flex items-center gap-1.5 sm:gap-2 mr-2 sm:mr-4">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#ff5f57] shadow-[0_0_6px_#ff5f57]" />
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e] shadow-[0_0_6px_#ffbd2e]" />
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#28c840] shadow-[0_0_6px_#28c840]" />
          </div>

          {/* Navigation Buttons - Hidden on mobile */}
          <div className="hidden sm:flex items-center gap-1 mr-3">
            <button className="p-1 rounded hover:bg-white/10 transition-colors">
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-1 rounded hover:bg-white/10 transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-1 rounded hover:bg-white/10 transition-colors">
              <RotateCw className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* URL Bar */}
          <div
            className="flex-1 flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg"
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-400" />
            <span className="text-xs sm:text-sm text-gray-300 font-mono truncate">
              https://{url}
            </span>
          </div>

          {/* Right side placeholder - Hidden on mobile */}
          <div className="hidden sm:block w-20" />
        </div>

        {/* Content Area */}
        <div
          className="relative bg-[#0a0a0f]"
          style={{
            height: '50vh',
            minHeight: '300px',
            maxHeight: '500px',
          }}
        >
          {/* Scrollable Content */}
          <div
            className="absolute inset-0 overflow-y-auto overflow-x-hidden custom-scrollbar"
            style={{ scrollBehavior: 'smooth' }}
          >
            {children}
          </div>
        </div>

        {/* Bottom reflection effect */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%)',
          }}
        />
      </div>

      {/* Glow effect behind browser */}
      <div
        className="absolute -inset-4 -z-10 rounded-2xl opacity-30 blur-2xl"
        style={{
          background: `radial-gradient(ellipse at center, ${themeColor}40 0%, transparent 70%)`,
        }}
      />

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};
