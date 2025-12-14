/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(InertiaPlugin);

// Helper function to limit how often a function can be called
const throttle = (func: (...args: any[]) => void, limit: number) => {
  let lastCall = 0;
  return function (this: any, ...args: any[]) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

interface Dot {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
  _inertiaApplied: boolean;
}

export interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  shockRadius?: number;
  shockStrength?: number;
  returnDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16)
  };
}

const surpriseMessages = [
  "Biraz mola ver istersen?", "Tıklama rekoru kırmaya mı çalışıyorsun?", "Vay canına, gizli bir dedektif!", "Aradığını buldun mu?", "Noktalar sana selam söylüyor.", "Allync AI was here.", "Bu kadar merak iyi değil.", "Ekranı kıracaksın!", "Sürpriz! Tekrar ben.", "Kahve içtin mi bugün?", "Sanırım burayı sevdin.", "Matrix'e hoş geldin.", "Dikkat et, noktalar ısırabilir!", "777 - Melekler seninle.", "Bir dilek tut!"
];

const DotGrid: React.FC<DotGridProps> = ({
  dotSize = 5,
  gap = 20,
  baseColor = '#FFFFFF',
  activeColor = '#8668ff',
  proximity = 150,
  shockRadius = 150,
  shockStrength = 7,
  returnDuration = 3,
  className = '',
  style
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const pointerRef = useRef({ x: 0, y: 0 });

  // --- Easter Egg State & Logic ---
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);
  const [popup, setPopup] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [globalAlpha, setGlobalAlpha] = useState(0);

  useEffect(() => {
    if (popup.visible) {
      const timer = setTimeout(() => setPopup({ visible: false, message: '' }), 2000);
      return () => clearTimeout(timer);
    }
  }, [popup.visible]);

  useEffect(() => {
    const fadeTarget = { val: 0 };
    const fadeTween = gsap.to(fadeTarget, {
      val: 1,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: function() {
        setGlobalAlpha(fadeTarget.val);
      }
    });

    return () => {
      fadeTween.kill();
    };
  }, []);
  // --- End of Easter Egg Logic ---

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const circlePath = useMemo(() => {
    if (typeof window === 'undefined' || !window.Path2D) return null;
    const p = new Path2D();
    p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
    return p;
  }, [dotSize]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    const cols = Math.floor((width + gap) / (dotSize + gap));
    const rows = Math.floor((height + gap) / (dotSize + gap));
    const cell = dotSize + gap;
    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;
    const startX = (width - gridW) / 2 + dotSize / 2;
    const startY = (height - gridH) / 2 + dotSize / 2;

    const dots: Dot[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        dots.push({ cx, cy, xOffset: 0, yOffset: 0, _inertiaApplied: false });
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap]);

  useEffect(() => {
    if (!circlePath) return;
    let rafId: number;
    const proxSq = proximity * proximity;

    const draw = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: px, y: py } = pointerRef.current;

      for (const dot of dotsRef.current) {
        const ox = dot.cx + dot.xOffset;
        const oy = dot.cy + dot.yOffset;
        const dx = dot.cx - px;
        const dy = dot.cy - py;
        const dsq = dx * dx + dy * dy;

        // 1. Proximity Opacity Calculation
        let proximityOpacity = 0.3;
        if (dsq <= proxSq) {
          const dist = Math.sqrt(dsq);
          proximityOpacity = 0.3 + (1 - dist / proximity) * 0.7;
        }

        // 2. Edge Fade Calculation
        const fadeMargin = canvas.width * 0.15; // 15% margin on each side for fading
        let edgeFade = 1.0;
        if (dot.cx < fadeMargin) {
          edgeFade = dot.cx / fadeMargin;
        } else if (dot.cx > canvas.width - fadeMargin) {
          edgeFade = (canvas.width - dot.cx) / fadeMargin;
        }
        edgeFade = gsap.utils.clamp(0, 1, edgeFade); // Ensure value is between 0 and 1

        // 3. Combine opacities and apply global fade-in
        const finalOpacity = proximityOpacity * edgeFade * globalAlpha;

        ctx.save();
        ctx.translate(ox, oy);
        ctx.fillStyle = `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, ${finalOpacity})`;
        ctx.fill(circlePath);
        ctx.restore();
      }
      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [proximity, baseColor, activeRgb, baseRgb, circlePath, globalAlpha]);

  useEffect(() => {
    buildGrid();
    const ro = new ResizeObserver(buildGrid);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [buildGrid]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (rect) {
        pointerRef.current.x = e.clientX - rect.left;
        pointerRef.current.y = e.clientY - rect.top;
      }
    };

    const onClick = (e: MouseEvent) => {
        const rect = wrapperRef.current?.getBoundingClientRect();
        if (!rect) return;

        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;

        for (const dot of dotsRef.current) {
            const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
            if (dist < shockRadius && !dot._inertiaApplied) {
                dot._inertiaApplied = true;
                gsap.killTweensOf(dot);
                const falloff = Math.max(0, 1 - dist / shockRadius);
                const pushX = (dot.cx - cx) * shockStrength * falloff;
                const pushY = (dot.cy - cy) * shockStrength * falloff;

                gsap.to(dot, {
                    xOffset: pushX,
                    yOffset: pushY,
                    duration: 0.3,
                    ease: 'power2.out',
                    onComplete: () => {
                        gsap.to(dot, {
                            xOffset: 0,
                            yOffset: 0,
                            duration: returnDuration,
                            ease: 'elastic.out(1,0.5)',
                            onComplete: () => { dot._inertiaApplied = false; }
                        });
                    }
                });
            }
        }

        // Easter egg logic
        const now = performance.now();
        if (now - lastClickTimeRef.current > 2000) {
            clickCountRef.current = 0;
        }
        clickCountRef.current += 1;
        lastClickTimeRef.current = now;

        if (clickCountRef.current === 10) {
            const randomMessage = surpriseMessages[Math.floor(Math.random() * surpriseMessages.length)];
            setPopupPosition({ x: e.clientX, y: e.clientY });
            setPopup({ visible: true, message: randomMessage });
            clickCountRef.current = 0;
        }
    };

    const throttledMove = throttle(onMove, 16);
    window.addEventListener('mousemove', throttledMove, { passive: true });
    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('mousemove', throttledMove);
      window.removeEventListener('click', onClick);
      // Kill all GSAP tweens on dots to prevent memory leaks
      for (const dot of dotsRef.current) {
        gsap.killTweensOf(dot);
      }
    };
  }, [shockRadius, shockStrength, returnDuration]);

  return (
    <>
      <div
        ref={wrapperRef}
        className={`fixed inset-0 -z-50 ${className}`}
        style={style}
      >
        <canvas ref={canvasRef} />
      </div>
      <AnimatePresence>
        {popup.visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed', top: popupPosition.y, left: popupPosition.x,
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: '20px 30px', borderRadius: '12px', zIndex: 100,
              color: 'white', textAlign: 'center',
              backdropFilter: 'blur(5px)'
            }}
          >
            {popup.message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DotGrid;
