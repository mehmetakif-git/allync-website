import React, { createContext, useContext, useEffect, useRef, useCallback, useState } from 'react';

interface SoundEffectContextType {
  playHoverSound: () => void;
  playClickSound: () => void;
  playBackSound: () => void;
  playHoldSound: () => void;
  stopHoldSound: () => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const SoundEffectContext = createContext<SoundEffectContextType | null>(null);

export const useSoundEffect = () => {
  const context = useContext(SoundEffectContext);
  if (!context) {
    throw new Error('useSoundEffect must be used within a SoundEffectProvider');
  }
  return context;
};

interface SoundEffectProviderProps {
  children: React.ReactNode;
}

export const SoundEffectProvider: React.FC<SoundEffectProviderProps> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('allync-sound-muted');
    return saved === 'true';
  });
  const hoverAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const backAudioRef = useRef<HTMLAudioElement | null>(null);
  const holdAudioRef = useRef<HTMLAudioElement | null>(null);
  const holdFadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastHoverPlayedRef = useRef<number>(0);
  const lastClickPlayedRef = useRef<number>(0);
  const lastBackPlayedRef = useRef<number>(0);
  const HOVER_DEBOUNCE_MS = 50;
  const CLICK_DEBOUNCE_MS = 100;
  const BACK_DEBOUNCE_MS = 100;
  const HOLD_FADE_DURATION = 500; // Fade in over 500ms
  const HOLD_TARGET_VOLUME = 0.7;

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newValue = !prev;
      localStorage.setItem('allync-sound-muted', String(newValue));
      return newValue;
    });
  }, []);

  // Initialize audio on mount
  useEffect(() => {
    // Hover sound
    hoverAudioRef.current = new Audio('/audio/sound_effects/hover.mp3');
    hoverAudioRef.current.volume = 1.0;
    hoverAudioRef.current.preload = 'auto';
    hoverAudioRef.current.load();

    // Click sound
    clickAudioRef.current = new Audio('/audio/sound_effects/click.mp3');
    clickAudioRef.current.volume = 0.6;
    clickAudioRef.current.preload = 'auto';
    clickAudioRef.current.load();

    // Back sound
    backAudioRef.current = new Audio('/audio/sound_effects/back.mp3');
    backAudioRef.current.volume = 0.6;
    backAudioRef.current.preload = 'auto';
    backAudioRef.current.load();

    // Hold sound
    holdAudioRef.current = new Audio('/audio/sound_effects/hold.mp3');
    holdAudioRef.current.volume = 0.7;
    holdAudioRef.current.preload = 'auto';
    holdAudioRef.current.load();

    return () => {
      if (hoverAudioRef.current) {
        hoverAudioRef.current.pause();
        hoverAudioRef.current.src = ''; // Release audio resource
        hoverAudioRef.current = null;
      }
      if (clickAudioRef.current) {
        clickAudioRef.current.pause();
        clickAudioRef.current.src = ''; // Release audio resource
        clickAudioRef.current = null;
      }
      if (backAudioRef.current) {
        backAudioRef.current.pause();
        backAudioRef.current.src = ''; // Release audio resource
        backAudioRef.current = null;
      }
      if (holdFadeIntervalRef.current) {
        clearInterval(holdFadeIntervalRef.current);
        holdFadeIntervalRef.current = null;
      }
      if (holdAudioRef.current) {
        holdAudioRef.current.pause();
        holdAudioRef.current.src = ''; // Release audio resource
        holdAudioRef.current = null;
      }
    };
  }, []);

  const playHoverSound = useCallback(() => {
    if (isMuted) return;
    const now = Date.now();
    if (now - lastHoverPlayedRef.current < HOVER_DEBOUNCE_MS) return;
    lastHoverPlayedRef.current = now;

    if (hoverAudioRef.current) {
      hoverAudioRef.current.currentTime = 0;
      hoverAudioRef.current.play().catch(() => {});
    }
  }, [isMuted]);

  const playClickSound = useCallback(() => {
    if (isMuted) return;
    const now = Date.now();
    if (now - lastClickPlayedRef.current < CLICK_DEBOUNCE_MS) return;
    lastClickPlayedRef.current = now;

    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch(() => {});
    }
  }, [isMuted]);

  const playBackSound = useCallback(() => {
    if (isMuted) return;
    const now = Date.now();
    if (now - lastBackPlayedRef.current < BACK_DEBOUNCE_MS) return;
    lastBackPlayedRef.current = now;

    if (backAudioRef.current) {
      backAudioRef.current.currentTime = 0;
      backAudioRef.current.play().catch(() => {});
    }
  }, [isMuted]);

  const playHoldSound = useCallback(() => {
    if (isMuted) return;
    if (holdAudioRef.current) {
      // Clear any existing fade interval
      if (holdFadeIntervalRef.current) {
        clearInterval(holdFadeIntervalRef.current);
        holdFadeIntervalRef.current = null;
      }

      // Start at volume 0 for fade-in effect
      holdAudioRef.current.volume = 0;
      holdAudioRef.current.currentTime = 0;
      holdAudioRef.current.play().catch(() => {});

      // Gradually fade in over HOLD_FADE_DURATION
      const startTime = Date.now();
      const fadeStep = 16; // ~60fps

      holdFadeIntervalRef.current = setInterval(() => {
        if (!holdAudioRef.current) {
          if (holdFadeIntervalRef.current) {
            clearInterval(holdFadeIntervalRef.current);
            holdFadeIntervalRef.current = null;
          }
          return;
        }

        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / HOLD_FADE_DURATION, 1);

        // Ease-out curve for more natural fade in
        const easedProgress = 1 - Math.pow(1 - progress, 2);
        holdAudioRef.current.volume = easedProgress * HOLD_TARGET_VOLUME;

        if (progress >= 1) {
          if (holdFadeIntervalRef.current) {
            clearInterval(holdFadeIntervalRef.current);
            holdFadeIntervalRef.current = null;
          }
        }
      }, fadeStep);
    }
  }, [isMuted]);

  const stopHoldSound = useCallback(() => {
    // Clear fade interval
    if (holdFadeIntervalRef.current) {
      clearInterval(holdFadeIntervalRef.current);
      holdFadeIntervalRef.current = null;
    }

    if (holdAudioRef.current) {
      holdAudioRef.current.pause();
      holdAudioRef.current.currentTime = 0;
      holdAudioRef.current.volume = HOLD_TARGET_VOLUME; // Reset volume for next play
    }
  }, []);

  // Check if element is interactive
  const isInteractiveElement = (target: HTMLElement): boolean => {
    return !!(
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.closest('button') ||
      target.closest('a') ||
      (target.hasAttribute('role') && target.getAttribute('role') === 'button') ||
      target.classList.contains('cursor-pointer') ||
      target.closest('[role="button"]') ||
      target.closest('.cursor-pointer')
    );
  };

  // Global event listener for hover on interactive elements
  useEffect(() => {
    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isInteractiveElement(target)) {
        playHoverSound();
      }
    };

    document.addEventListener('mouseenter', handleMouseEnter, true);
    return () => document.removeEventListener('mouseenter', handleMouseEnter, true);
  }, [playHoverSound]);

  // Global event listener for click on interactive elements
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isInteractiveElement(target)) {
        playClickSound();
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [playClickSound]);

  return (
    <SoundEffectContext.Provider value={{ playHoverSound, playClickSound, playBackSound, playHoldSound, stopHoldSound, isMuted, toggleMute }}>
      {children}
    </SoundEffectContext.Provider>
  );
};
