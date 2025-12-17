import React from 'react';

interface IPhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const IPhoneMockup: React.FC<IPhoneMockupProps> = ({ children, className = '', style }) => {
  return (
    <div
      className={`relative ${className}`}
      style={{
        width: '320px',
        height: '680px',
        ...style
      }}
    >
      {/* iPhone Frame */}
      <div
        className="absolute inset-0 bg-[#1a1a1a] rounded-[50px] shadow-2xl"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 0 1px rgba(255,255,255,0.05)'
        }}
      >
        {/* Screen Container */}
        <div className="absolute inset-[8px] bg-black rounded-[42px] overflow-hidden">
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-50">
            <div
              className="bg-black rounded-full flex items-center justify-center"
              style={{
                width: '90px',
                height: '28px'
              }}
            >
              {/* Camera dot */}
              <div className="absolute right-4 w-3 h-3 rounded-full bg-[#1a1a2a] ring-1 ring-[#2a2a3a]">
                <div className="absolute inset-[3px] rounded-full bg-[#0a0a15]" />
              </div>
            </div>
          </div>

          {/* Screen Content */}
          <div className="absolute inset-0 bg-black">
            {children}
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-50">
            <div
              className="bg-white/30 rounded-full"
              style={{
                width: '120px',
                height: '4px'
              }}
            />
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
