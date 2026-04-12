import React, { useEffect } from 'react';
import './MobileIPhoneMockup.css';
import { lockScroll, unlockScroll } from '../../utils/scrollLock';

interface MobileIPhoneMockupProps {
  children: React.ReactNode;
}

export const MobileIPhoneMockup: React.FC<MobileIPhoneMockupProps> = ({ children }) => {
  // Disable body scroll when mounted
  useEffect(() => {
    lockScroll();
    return () => unlockScroll();
  }, []);

  return (
    <div className="mobile-iphone-overlay">
      <div className="mobile-iphone-container">
        {/* iPhone Frame - Titanium */}
        <div className="mobile-iphone-frame">
          {/* Side Buttons */}
          <div className="mobile-side-button mobile-silent-switch" />
          <div className="mobile-side-button mobile-volume-up" />
          <div className="mobile-side-button mobile-volume-down" />
          <div className="mobile-side-button mobile-power-button" />

          {/* Screen */}
          <div className="mobile-iphone-screen">
            {/* Dynamic Island */}
            <div className="mobile-dynamic-island">
              <div className="mobile-di-camera" />
              <div className="mobile-di-sensor" />
            </div>

            {/* Screen Content - Children go here */}
            <div className="mobile-screen-content">
              {children}
            </div>

            {/* Home Indicator */}
            <div className="mobile-home-indicator" />

            {/* Screen Reflection */}
            <div className="mobile-screen-reflection" />
          </div>
        </div>
      </div>
    </div>
  );
};
