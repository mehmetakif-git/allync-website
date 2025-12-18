import React, { createContext, useContext, useEffect, useRef, useCallback, useState } from 'react';

interface SoundEffectContextType {
  playHoverSound: () => void;
  playClickSound: () => void;
  playBackSound: () => void;
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

// Check if device is mobile
const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const SoundEffectProvider: React.FC<SoundEffectProviderProps> = ({ children }) => {
  const [isMobile] = useState(() => isMobileDevice());
  const [isMuted, setIsMuted] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('allync-sound-muted');
    return saved === 'true';
  });
  const hoverAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const backAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastHoverPlayedRef = useRef<number>(0);
  const lastClickPlayedRef = useRef<number>(0);
  const lastBackPlayedRef = useRef<number>(0);
  const HOVER_DEBOUNCE_MS = 50;
  const CLICK_DEBOUNCE_MS = 100;
  const BACK_DEBOUNCE_MS = 100;

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newValue = !prev;
      localStorage.setItem('allync-sound-muted', String(newValue));
      return newValue;
    });
  }, []);

  // Initialize audio on mount (skip on mobile)
  useEffect(() => {
    if (isMobile) return;

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
    };
  }, []);

  const playHoverSound = useCallback(() => {
    if (isMobile || isMuted) return;
    const now = Date.now();
    if (now - lastHoverPlayedRef.current < HOVER_DEBOUNCE_MS) return;
    lastHoverPlayedRef.current = now;

    if (hoverAudioRef.current) {
      hoverAudioRef.current.currentTime = 0;
      hoverAudioRef.current.play().catch(() => {});
    }
  }, [isMuted]);

  const playClickSound = useCallback(() => {
    if (isMobile || isMuted) return;
    const now = Date.now();
    if (now - lastClickPlayedRef.current < CLICK_DEBOUNCE_MS) return;
    lastClickPlayedRef.current = now;

    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch(() => {});
    }
  }, [isMuted]);

  const playBackSound = useCallback(() => {
    if (isMobile || isMuted) return;
    const now = Date.now();
    if (now - lastBackPlayedRef.current < BACK_DEBOUNCE_MS) return;
    lastBackPlayedRef.current = now;

    if (backAudioRef.current) {
      backAudioRef.current.currentTime = 0;
      backAudioRef.current.play().catch(() => {});
    }
  }, [isMuted]);

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

  // Global event listener for hover on interactive elements (skip on mobile)
  useEffect(() => {
    if (isMobile) return;

    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isInteractiveElement(target)) {
        playHoverSound();
      }
    };

    document.addEventListener('mouseenter', handleMouseEnter, true);
    return () => document.removeEventListener('mouseenter', handleMouseEnter, true);
  }, [isMobile, playHoverSound]);

  // Global event listener for click on interactive elements (skip on mobile)
  useEffect(() => {
    if (isMobile) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isInteractiveElement(target)) {
        playClickSound();
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [isMobile, playClickSound]);

  return (
    <SoundEffectContext.Provider value={{ playHoverSound, playClickSound, playBackSound, isMuted, toggleMute }}>
      {children}
    </SoundEffectContext.Provider>
  );
};
