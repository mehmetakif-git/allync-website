import React from 'react';

interface IPhoneMockupProps {
  children: React.ReactNode;
  className?: string;
}

export const IPhoneMockup: React.FC<IPhoneMockupProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* iPhone Frame */}
      <div
        className="relative bg-[#1a1a1a] rounded-[50px] p-[12px] shadow-2xl"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 0 1px rgba(255,255,255,0.05)'
        }}
      >
        {/* Side Buttons - Left */}
        <div className="absolute left-[-2px] top-[100px] w-[3px] h-[30px] bg-[#2a2a2a] rounded-l-sm" /> {/* Silent */}
        <div className="absolute left-[-2px] top-[150px] w-[3px] h-[50px] bg-[#2a2a2a] rounded-l-sm" /> {/* Volume Up */}
        <div className="absolute left-[-2px] top-[210px] w-[3px] h-[50px] bg-[#2a2a2a] rounded-l-sm" /> {/* Volume Down */}

        {/* Side Button - Right */}
        <div className="absolute right-[-2px] top-[140px] w-[3px] h-[70px] bg-[#2a2a2a] rounded-r-sm" /> {/* Power */}

        {/* Screen Container */}
        <div
          className="relative bg-black rounded-[38px] overflow-hidden"
          style={{
            aspectRatio: '9/19.5',
            width: '100%',
            maxWidth: '320px',
            minWidth: '300px'
          }}
        >
          {/* Dynamic Island */}
          <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 z-50">
            <div
              className="bg-black rounded-full flex items-center justify-center"
              style={{
                width: '90px',
                height: '28px',
              }}
            >
              {/* Camera dot */}
              <div className="absolute right-[18px] w-[10px] h-[10px] rounded-full bg-[#1a1a2a] ring-1 ring-[#2a2a3a]">
                <div className="absolute inset-[2px] rounded-full bg-[#0a0a15]" />
              </div>
            </div>
          </div>

          {/* Screen Content */}
          <div className="absolute inset-0 bg-black">
            {children}
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-[8px] left-1/2 transform -translate-x-1/2 z-50">
            <div className="w-[120px] h-[4px] bg-white/30 rounded-full" />
          </div>
        </div>
      </div>

      {/* Reflection effect */}
      <div
        className="absolute inset-0 rounded-[50px] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }}
      />
    </div>
  );
};
