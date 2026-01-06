import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import './HologramCard.css';

interface HologramCardProps {
  children: React.ReactNode;
  theme: 'ai' | 'digital';
  className?: string;
  onClick?: () => void;
  iconUrl?: string;
  idlePulseOrder?: number; // 0 = first to pulse, 1 = second to pulse
}

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  ENTER_TRANSITION_MS: 180,
  IDLE_TIMEOUT_MS: 12000, // 12 seconds before pulse starts
  PULSE_INTERVAL_MS: 5000, // 5 seconds between pulses
  PULSE_DURATION_MS: 2500 // Duration of single pulse animation
} as const;

const clamp = (v: number, min = 0, max = 100): number => Math.min(Math.max(v, min), max);
const round = (v: number, precision = 3): number => parseFloat(v.toFixed(precision));
const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number): number =>
  round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

const HologramCardComponent: React.FC<HologramCardProps> = ({
  children,
  theme,
  className = '',
  onClick,
  iconUrl,
  idlePulseOrder = 0
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const enterTimerRef = useRef<number | null>(null);
  const leaveRafRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const pulseIntervalRef = useRef<number | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const themeColors = useMemo(() => {
    if (theme === 'ai') {
      return {
        glowColor: 'rgba(168, 85, 247, 0.5)',
        gradient: 'linear-gradient(145deg, rgba(96, 73, 110, 0.6) 0%, rgba(168, 85, 247, 0.3) 100%)',
        sunpillar1: 'hsl(280, 100%, 73%)',
        sunpillar2: 'hsl(260, 100%, 69%)',
        sunpillar3: 'hsl(240, 100%, 69%)',
        sunpillar4: 'hsl(220, 100%, 76%)',
        sunpillar5: 'hsl(200, 100%, 74%)',
        sunpillar6: 'hsl(290, 100%, 73%)',
        pulseColor: 'rgba(168, 85, 247, 0.4)'
      };
    }
    return {
      glowColor: 'rgba(34, 211, 238, 0.5)',
      gradient: 'linear-gradient(145deg, rgba(13, 74, 74, 0.6) 0%, rgba(34, 211, 238, 0.3) 100%)',
      sunpillar1: 'hsl(170, 100%, 73%)',
      sunpillar2: 'hsl(150, 100%, 69%)',
      sunpillar3: 'hsl(130, 100%, 69%)',
      sunpillar4: 'hsl(180, 100%, 76%)',
      sunpillar5: 'hsl(200, 100%, 74%)',
      sunpillar6: 'hsl(160, 100%, 73%)',
      pulseColor: 'rgba(34, 211, 238, 0.4)'
    };
  }, [theme]);

  const tiltEngine = useMemo(() => {
    let rafId: number | null = null;
    let running = false;
    let lastTs = 0;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const DEFAULT_TAU = 0.14;
    const INITIAL_TAU = 0.6;
    let initialUntil = 0;

    const setVarsFromXY = (x: number, y: number) => {
      const shell = shellRef.current;
      const wrap = wrapRef.current;
      if (!shell || !wrap) return;

      const width = shell.clientWidth || 1;
      const height = shell.clientHeight || 1;

      const percentX = clamp((100 / width) * x);
      const percentY = clamp((100 / height) * y);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
        '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        '--pointer-from-top': `${percentY / 100}`,
        '--pointer-from-left': `${percentX / 100}`,
        '--rotate-x': `${round(-(centerX / 6))}deg`,
        '--rotate-y': `${round(centerY / 5)}deg`
      } as Record<string, string>;

      for (const [k, v] of Object.entries(properties)) wrap.style.setProperty(k, v);
    };

    const step = (ts: number) => {
      if (!running) return;
      if (lastTs === 0) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
      const k = 1 - Math.exp(-dt / tau);

      currentX += (targetX - currentX) * k;
      currentY += (targetY - currentY) * k;

      setVarsFromXY(currentX, currentY);

      const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;

      if (stillFar || document.hasFocus()) {
        rafId = requestAnimationFrame(step);
      } else {
        running = false;
        lastTs = 0;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTs = 0;
      rafId = requestAnimationFrame(step);
    };

    return {
      setImmediate(x: number, y: number) {
        currentX = x;
        currentY = y;
        setVarsFromXY(currentX, currentY);
      },
      setTarget(x: number, y: number) {
        targetX = x;
        targetY = y;
        start();
      },
      toCenter() {
        const shell = shellRef.current;
        if (!shell) return;
        this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
      },
      beginInitial(durationMs: number) {
        initialUntil = performance.now() + durationMs;
        start();
      },
      getCurrent() {
        return { x: currentX, y: currentY, tx: targetX, ty: targetY };
      },
      cancel() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        running = false;
        lastTs = 0;
      }
    };
  }, []);

  const getOffsets = (evt: PointerEvent, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  };

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const shell = shellRef.current;
      if (!shell) return;
      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine]
  );

  const handlePointerEnter = useCallback(
    (event: PointerEvent) => {
      const shell = shellRef.current;
      if (!shell) return;

      shell.classList.add('active');
      shell.classList.add('entering');
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      enterTimerRef.current = window.setTimeout(() => {
        shell.classList.remove('entering');
      }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine]
  );

  const handlePointerLeave = useCallback(() => {
    const shell = shellRef.current;
    if (!shell) return;

    tiltEngine.toCenter();

    const checkSettle = () => {
      const { x, y, tx, ty } = tiltEngine.getCurrent();
      const settled = Math.hypot(tx - x, ty - y) < 0.6;
      if (settled) {
        shell.classList.remove('active');
        leaveRafRef.current = null;
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle);
      }
    };
    if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [tiltEngine]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    // Check if we're on mobile
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;

    const pointerMoveHandler = handlePointerMove as EventListener;
    const pointerEnterHandler = handlePointerEnter as EventListener;
    const pointerLeaveHandler = handlePointerLeave as EventListener;

    shell.addEventListener('pointerenter', pointerEnterHandler);
    shell.addEventListener('pointermove', pointerMoveHandler);
    shell.addEventListener('pointerleave', pointerLeaveHandler);

    const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    tiltEngine.setImmediate(initialX, initialY);
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    return () => {
      shell.removeEventListener('pointerenter', pointerEnterHandler);
      shell.removeEventListener('pointermove', pointerMoveHandler);
      shell.removeEventListener('pointerleave', pointerLeaveHandler);
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
      tiltEngine.cancel();
      shell.classList.remove('entering');
    };
  }, [tiltEngine, handlePointerMove, handlePointerEnter, handlePointerLeave]);

  const cardStyle = useMemo(
    () =>
      ({
        '--behind-glow-color': themeColors.glowColor,
        '--inner-gradient': themeColors.gradient,
        '--sunpillar-clr-1': themeColors.sunpillar1,
        '--sunpillar-clr-2': themeColors.sunpillar2,
        '--sunpillar-clr-3': themeColors.sunpillar3,
        '--sunpillar-clr-4': themeColors.sunpillar4,
        '--sunpillar-clr-5': themeColors.sunpillar5,
        '--sunpillar-clr-6': themeColors.sunpillar6,
        '--icon': iconUrl ? `url(${iconUrl})` : 'none',
        '--pulse-color': themeColors.pulseColor
      }) as React.CSSProperties,
    [themeColors, iconUrl]
  );

  // Idle pulse effect
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;

    const triggerPulse = () => {
      wrap.classList.add('idle-pulse');
      setTimeout(() => {
        wrap.classList.remove('idle-pulse');
      }, ANIMATION_CONFIG.PULSE_DURATION_MS);
    };

    const startPulseSequence = () => {
      // Calculate delay based on order (0 = immediate, 1 = after half interval)
      const initialDelay = idlePulseOrder * (ANIMATION_CONFIG.PULSE_INTERVAL_MS / 2);

      // First pulse after initial delay
      idleTimerRef.current = window.setTimeout(() => {
        triggerPulse();

        // Then pulse at regular intervals
        pulseIntervalRef.current = window.setInterval(() => {
          triggerPulse();
        }, ANIMATION_CONFIG.PULSE_INTERVAL_MS);
      }, initialDelay);
    };

    const resetIdleTimer = () => {
      lastActivityRef.current = Date.now();

      // Clear existing timers
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
      if (pulseIntervalRef.current) {
        window.clearInterval(pulseIntervalRef.current);
        pulseIntervalRef.current = null;
      }

      // Remove pulse class if active
      wrap.classList.remove('idle-pulse');

      // Start new idle timer
      idleTimerRef.current = window.setTimeout(() => {
        startPulseSequence();
      }, ANIMATION_CONFIG.IDLE_TIMEOUT_MS);
    };

    // Listen to global mouse/touch activity
    const activityEvents = ['mousemove', 'mousedown', 'touchstart', 'keydown', 'scroll'];
    activityEvents.forEach(event => {
      window.addEventListener(event, resetIdleTimer, { passive: true });
    });

    // Start initial idle timer
    resetIdleTimer();

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetIdleTimer);
      });
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      if (pulseIntervalRef.current) window.clearInterval(pulseIntervalRef.current);
    };
  }, [idlePulseOrder]);

  return (
    <div
      ref={wrapRef}
      className={`holo-card-wrapper ${className}`.trim()}
      style={cardStyle}
    >
      {/* SVG Filter for pixelated/glitch effect */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="holo-pixelate" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      {/* Idle pulse glow effect */}
      <div className="holo-idle-glow" />
      <div ref={shellRef} className="holo-card-shell" onClick={onClick}>
        <div className="holo-card">
          <div className="holo-inside">
            <div className="holo-shine" />
            <div className="holo-glare" />
            <div className="holo-content">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HologramCard = React.memo(HologramCardComponent);
export default HologramCard;
