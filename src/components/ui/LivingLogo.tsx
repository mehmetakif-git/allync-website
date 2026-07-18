import {
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  type CSSProperties,
} from 'react';

const TEXT_PATHS = [
  'M211.61,186.83c-20.11,0-30.09-6.18-30.09-18.71v-8.01c0-12.38,9.98-18.56,30.09-18.56h59.78v-2.11c0-6.61-5.77-9.84-17.3-9.84h-19.83c-4.65,0-7.04-1.83-7.04-5.49s2.39-5.63,7.04-5.63h19.83c21.38,0,31.92,7.03,31.92,20.96v27.56c0,13.22-10.13,19.83-30.66,19.83h-43.75ZM271.39,166.57v-15.33h-58.65c-10.97,0-16.46,2.95-16.46,8.58v7.31c0,5.76,5.49,8.72,16.46,8.72h41.77c11.25,0,16.88-3.1,16.88-9.29Z',
  'M312.42,92.74c0-3.8,2.53-5.91,7.46-5.91s7.45,2.11,7.45,5.91v88.88c0,3.94-2.53,5.91-7.45,5.91s-7.46-1.97-7.46-5.91v-88.88Z',
  'M354.32,92.74c0-3.8,2.53-5.91,7.46-5.91s7.45,2.11,7.45,5.91v88.88c0,3.94-2.53,5.91-7.45,5.91s-7.46-1.97-7.46-5.91v-88.88Z',
  'M440.38,210.46c-4.65,0-7.04-1.83-7.04-5.49s2.39-5.49,7.04-5.49h21.23c12.8,0,19.41-3.37,19.41-9.98v-4.78h-48.81c-24.19,0-36.28-8.58-36.28-25.46v-35.58c0-3.8,2.53-5.91,7.45-5.91s7.46,2.11,7.46,5.91v36.29c0,9.42,6.61,13.92,19.83,13.92h50.35v-50.21c0-3.8,2.53-5.91,7.31-5.91,5.06,0,7.59,2.11,7.59,5.91v65.82c0,14.06-11.53,20.96-34.32,20.96h-21.23Z',
  'M607.43,140.84c0-7.31-7.03-10.83-20.96-10.83h-28.13c-13.78,0-20.82,3.52-20.82,10.83v40.79c0,3.94-2.53,5.91-7.45,5.91s-7.46-1.97-7.46-5.91v-40.79c0-14.91,12.1-22.36,36.29-22.36h27.15c24.19,0,36.28,7.45,36.28,22.36v40.79c0,3.94-2.53,5.91-7.46,5.91s-7.45-1.97-7.45-5.91v-40.79Z',
  'M684.75,186.83c-24.33,0-36.43-7.45-36.43-22.22v-23.77c0-14.91,12.1-22.36,36.43-22.36h48.66c4.78,0,7.31,1.97,7.31,5.77s-2.53,5.76-7.31,5.76h-49.23c-13.78,0-20.82,3.52-20.82,10.69v24.05c0,7.03,7.04,10.69,20.82,10.69h49.23c4.78,0,7.31,1.83,7.31,5.63s-2.53,5.76-7.31,5.76h-48.66Z',
];
const FACE_PATHS = [
  'M62.63,212.1c-36.08,0-39.32-18.78-42.18-35.34-.42-2.43-.85-4.94-1.38-7.39-4.4-20.38-9.56-28.51-19.07-30.01l.11-12.7H.02c.17-.02,4.17-.74,6.54-4.38,2.26-3.47,2.53-8.95.78-15.83-4.09-16.1-2.48-31.24,4.52-42.63,7.02-11.42,19.06-19.1,35.79-22.84l2.8,12.53c-13.22,2.95-22.52,8.68-27.65,17.03-6.98,11.35-4.88,25.39-3.02,32.75,2.73,10.76,1.84,19.6-2.65,26.28-.66.98-1.36,1.86-2.09,2.66,9.41,7.38,13.61,20.65,16.59,34.44.59,2.71,1.04,5.36,1.48,7.91,2.75,15.92,4.26,24.69,29.53,24.69v12.84Z',
  'M86.22,212.1v-12.84c25.26,0,26.78-8.77,29.53-24.69.44-2.56.9-5.2,1.48-7.91,2.98-13.8,7.18-27.06,16.59-34.44-.73-.8-1.43-1.68-2.09-2.66-4.49-6.68-5.38-15.52-2.65-26.28,1.87-7.36,3.96-21.4-3.02-32.75-5.13-8.35-14.44-14.08-27.65-17.03l2.8-12.53c16.73,3.74,28.77,11.42,35.79,22.84,7,11.39,8.61,26.53,4.52,42.63-1.75,6.88-1.48,12.36.78,15.83,2.36,3.64,6.37,4.37,6.53,4.4h-.09s.11,12.69.11,12.69c-9.51,1.5-14.68,9.64-19.07,30.01-.53,2.45-.96,4.96-1.38,7.39-2.86,16.57-6.1,35.34-42.18,35.34Z',
];
const EYE_PATHS = {
  right: 'M115.67,123.4c-18.7,0-33.86,15.16-33.86,33.86h0c18.7,0,33.86-15.16,33.86-33.86h0Z',
  left: 'M33.19,123.4h0c0,18.7,15.16,33.86,33.86,33.86h0c0-18.7-15.16-33.86-33.86-33.86Z',
};

const FULL_VIEWBOX = '0 0 740.72 305.43';
const ICON_VIEWBOX = '-5 40 160 180';

class Spring {
  v = 0;
  vel = 0;
  t = 0;
  s: number;
  d: number;
  constructor(s = 0.14, d = 0.78) {
    this.s = s;
    this.d = d;
  }
  setTarget(t: number) { this.t = t; }
  setConstants(s: number, d: number) { this.s = s; this.d = d; }
  setValue(v: number) { this.v = v; this.vel = 0; }
  step() {
    const f = (this.t - this.v) * this.s;
    this.vel = this.vel * this.d + f;
    this.v += this.vel;
    return this.v;
  }
}

type LogoState =
  | 'sleeping'
  | 'waking'
  | 'awake'
  | 'focused'
  | 'drowsy'
  | 'startled'
  | 'alert'
  | 'covered';

const STATE_GLOW: Record<LogoState, { r: string; c: string }> = {
  sleeping: { r: '2px', c: 'rgba(111, 181, 255, 0.4)' },
  waking: { r: '8px', c: 'rgba(255, 167, 94, 0.8)' },
  awake: { r: '3px', c: 'rgba(255, 167, 94, 0.5)' },
  focused: { r: '5px', c: 'rgba(255, 87, 34, 0.65)' },
  alert: { r: '6px', c: 'rgba(255, 87, 34, 0.8)' },
  drowsy: { r: '2px', c: 'rgba(255, 167, 94, 0.3)' },
  startled: { r: '10px', c: 'rgba(255, 87, 34, 1)' },
  covered: { r: '3px', c: 'rgba(140, 175, 210, 0.4)' },
};

const STATE_SPRING: Record<string, { pos: [number, number]; blink: [number, number] }> = {
  default: { pos: [0.14, 0.78], blink: [0.35, 0.55] },
  startled: { pos: [0.38, 0.5], blink: [0.55, 0.5] },
  alert: { pos: [0.24, 0.7], blink: [0.35, 0.55] },
  drowsy: { pos: [0.07, 0.85], blink: [0.18, 0.7] },
  covered: { pos: [0.14, 0.78], blink: [0.32, 0.6] },
};

export interface LivingLogoHandle {
  startle: () => void;
  flinch: () => void;
  peek: () => void;
  getState: () => LogoState;
}

export interface LivingLogoProps {
  size?: string;
  iconOnly?: boolean;
  tracking?: boolean;
  saccades?: boolean;
  coverEyes?: boolean;
  trackingScope?: 'viewport' | 'element';
  autoSleepDelayMs?: number;
  onClick?: (e: MouseEvent) => void;
  onStateChange?: (s: LogoState) => void;
  className?: string;
  style?: CSSProperties;
  fill?: string;
}

const LivingLogo = forwardRef<LivingLogoHandle, LivingLogoProps>(function LivingLogo(
  {
    size = '480px',
    iconOnly = false,
    tracking = true,
    saccades = true,
    coverEyes = false,
    trackingScope = 'viewport',
    autoSleepDelayMs = 12000,
    onClick,
    onStateChange,
    className = '',
    style = {},
    fill = '#F4F1EA',
  },
  ref,
) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const eyeLRef = useRef<SVGPathElement | null>(null);
  const eyeRRef = useRef<SVGPathElement | null>(null);
  const stateRef = useRef<LogoState>('sleeping');
  const rafRef = useRef<number | null>(null);

  const mouseRef = useRef({
    x: 0, y: 0, prevX: 0, prevY: 0,
    has: false, lastMoveAt: 0, vel: 0, velSmooth: 0,
  });

  const springs = useRef({
    x: new Spring(0.14, 0.78),
    y: new Spring(0.14, 0.78),
    b: new Spring(0.35, 0.55),
  }).current;

  const sm = useRef({
    enteredAt: performance.now(),
    nextBlinkAt: Infinity,
    blinkStart: 0,
    blinkEndAt: 0,
    blinkOnComplete: null as (() => void) | null,
    saccadeX: 0, saccadeY: 0,
    nextSaccadeAt: performance.now() + 400,
    startledUntil: 0,
    alertUntil: 0,
    coverActive: false,
    nextPeekAt: 0,
    peekUntil: 0,
    peekTarget: 0.45,
    flinchUntil: 0,
  }).current;

  const setGlow = useCallback((s: LogoState) => {
    if (!wrapRef.current) return;
    const g = STATE_GLOW[s] || STATE_GLOW.awake;
    wrapRef.current.style.setProperty('--glow-r', g.r);
    wrapRef.current.style.setProperty('--glow-c', g.c);
  }, []);

  const setSprings = useCallback((s: LogoState) => {
    const cfg = STATE_SPRING[s] || STATE_SPRING.default;
    springs.x.setConstants(cfg.pos[0], cfg.pos[1]);
    springs.y.setConstants(cfg.pos[0], cfg.pos[1]);
    springs.b.setConstants(cfg.blink[0], cfg.blink[1]);
  }, [springs]);

  const applyEye = useCallback((x: number, y: number, b: number) => {
    const tf = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scaleY(${b.toFixed(3)})`;
    if (eyeLRef.current) eyeLRef.current.style.transform = tf;
    if (eyeRRef.current) eyeRRef.current.style.transform = tf;
  }, []);

  const scheduleBlink = useCallback((delay: number, dur: number, onComplete?: () => void) => {
    const start = performance.now() + delay;
    sm.blinkStart = start;
    sm.blinkEndAt = start + dur;
    sm.blinkOnComplete = onComplete || null;
  }, [sm]);

  const scheduleRandomBlink = useCallback(() => {
    sm.nextBlinkAt = performance.now() + 3500 + Math.random() * 3000;
  }, [sm]);

  const scheduleDrowsyBlink = useCallback(() => {
    sm.nextBlinkAt = performance.now() + 1800 + Math.random() * 1700;
  }, [sm]);

  const enterState = useCallback((s: LogoState) => {
    if (stateRef.current === s) return;
    stateRef.current = s;
    sm.enteredAt = performance.now();
    setGlow(s);
    setSprings(s);
    onStateChange?.(s);

    const now = performance.now();
    if (s === 'sleeping' || s === 'covered') {
      sm.nextBlinkAt = Infinity;
    } else if (s === 'waking') {
      scheduleBlink(380, 170);
    } else if (s === 'awake') {
      scheduleRandomBlink();
    } else if (s === 'focused') {
      sm.nextBlinkAt = now + 5000 + Math.random() * 4000;
    } else if (s === 'alert') {
      sm.alertUntil = now + 400;
    } else if (s === 'drowsy') {
      scheduleDrowsyBlink();
    } else if (s === 'startled') {
      sm.startledUntil = now + 700;
      scheduleBlink(20, 110, () => scheduleBlink(70, 130));
    }
  }, [setGlow, setSprings, onStateChange, scheduleBlink, scheduleRandomBlink, scheduleDrowsyBlink, sm]);

  useEffect(() => {
    springs.b.setValue(0.04);
    applyEye(0, 0, 0.04);
    setGlow('sleeping');
  }, [applyEye, setGlow, springs.b]);

  useImperativeHandle(ref, () => ({
    startle: () => enterState('startled'),
    flinch: () => { sm.flinchUntil = performance.now() + 140; },
    peek: () => {
      if (!sm.coverActive) return;
      sm.nextPeekAt = performance.now();
    },
    getState: () => stateRef.current,
  }), [enterState, sm]);

  useEffect(() => {
    if (sm.coverActive === coverEyes) return;
    sm.coverActive = coverEyes;
    if (coverEyes) {
      enterState('covered');
      sm.nextPeekAt = performance.now() + 2800 + Math.random() * 2200;
    } else {
      enterState(mouseRef.current.has ? 'waking' : 'sleeping');
    }
  }, [coverEyes, enterState, sm]);

  useEffect(() => {
    const target: Document | HTMLDivElement | null =
      trackingScope === 'viewport' ? document : wrapRef.current;
    if (!target) return;

    const updateCursor = (clientX: number, clientY: number) => {
      const m = mouseRef.current;
      const now = performance.now();
      const dt = now - m.lastMoveAt;
      if (dt > 0 && m.lastMoveAt > 0) {
        const dx = clientX - m.prevX, dy = clientY - m.prevY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        m.vel = dist / (dt / 1000);
      }
      m.prevX = clientX; m.prevY = clientY;
      m.x = clientX; m.y = clientY; m.lastMoveAt = now;
    };

    const onMove = (e: Event) => {
      const me = e as MouseEvent;
      if (!mouseRef.current.has) {
        mouseRef.current.has = true;
        if (!sm.coverActive && (stateRef.current === 'sleeping' || stateRef.current === 'drowsy')) {
          enterState('waking');
        }
      }
      updateCursor(me.clientX, me.clientY);
    };
    const onLeave = () => {
      mouseRef.current.has = false;
      if (!sm.coverActive) enterState('sleeping');
    };
    const onEnter = () => { mouseRef.current.has = true; };
    const onClickInner = (e: Event) => {
      onClick?.(e as MouseEvent);
      const s = stateRef.current;
      if (!sm.coverActive && (s === 'awake' || s === 'focused' || s === 'alert')) {
        enterState('startled');
      }
    };

    target.addEventListener('mousemove', onMove);
    if (target === document) {
      document.addEventListener('mouseleave', onLeave);
    } else {
      (target as HTMLDivElement).addEventListener('mouseleave', onLeave);
      (target as HTMLDivElement).addEventListener('mouseenter', onEnter);
    }
    const wrap = wrapRef.current;
    if (wrap) wrap.addEventListener('click', onClickInner);

    return () => {
      target.removeEventListener('mousemove', onMove);
      if (target === document) {
        document.removeEventListener('mouseleave', onLeave);
      } else {
        (target as HTMLDivElement).removeEventListener('mouseleave', onLeave);
        (target as HTMLDivElement).removeEventListener('mouseenter', onEnter);
      }
      if (wrap) wrap.removeEventListener('click', onClickInner);
    };
  }, [trackingScope, enterState, onClick, sm]);

  useEffect(() => {
    const tick = (now: number) => {
      const m = mouseRef.current;
      const state = stateRef.current;

      const timeSinceMove = now - m.lastMoveAt;
      if (timeSinceMove > 80) m.vel *= 0.88;
      m.velSmooth += (m.vel - m.velSmooth) * 0.2;

      let logoCx = 0, logoCy = 0;
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        logoCx = rect.left + rect.width * 0.5;
        logoCy = rect.top + rect.height * 0.5;
      }

      if (!sm.coverActive && m.has) {
        const elapsed = now - sm.enteredAt;
        if (state === 'waking' && elapsed > 600) enterState('awake');
        if (state === 'startled' && now > sm.startledUntil && now > sm.blinkEndAt + 50) enterState('awake');

        if (m.velSmooth > 1800 && ['awake', 'focused', 'drowsy'].includes(state)) enterState('alert');
        if (state === 'alert' && now > sm.alertUntil && m.velSmooth < 800) enterState('awake');

        const dxc = m.x - logoCx, dyc = m.y - logoCy;
        const distToLogo = Math.sqrt(dxc * dxc + dyc * dyc);
        if (state === 'awake' && distToLogo < 120 && m.velSmooth < 400) enterState('focused');
        if (state === 'focused' && (distToLogo > 180 || m.velSmooth > 800)) enterState('awake');

        if ((state === 'awake' || state === 'focused') && timeSinceMove > autoSleepDelayMs) enterState('drowsy');
        if (state === 'drowsy' && m.velSmooth > 500) enterState('awake');
      }

      let blinkValue: number;
      if (sm.coverActive) {
        let target = 0.04;
        if (now < sm.flinchUntil) target = 0.02;
        if (now >= sm.nextPeekAt && now >= sm.peekUntil) {
          sm.peekUntil = now + 260;
          sm.nextPeekAt = now + 2800 + Math.random() * 2400;
          sm.peekTarget = 0.45;
        }
        if (now < sm.peekUntil) {
          const pTotal = 260;
          const pStart = sm.peekUntil - pTotal;
          const t = (now - pStart) / pTotal;
          const openT = 0.4;
          if (t < openT) target = 0.04 + (t / openT) * (sm.peekTarget - 0.04);
          else target = sm.peekTarget - ((t - openT) / (1 - openT)) * (sm.peekTarget - 0.04);
        }
        blinkValue = target;
      } else {
        if (sm.nextBlinkAt !== Infinity && now >= sm.nextBlinkAt && !sm.blinkEndAt) {
          const dur = state === 'drowsy' ? 260 : 140;
          scheduleBlink(0, dur);
          if (state === 'drowsy') scheduleDrowsyBlink();
          else if (['awake', 'focused', 'alert'].includes(state)) scheduleRandomBlink();
          else sm.nextBlinkAt = Infinity;
        }

        if (sm.blinkEndAt && now < sm.blinkEndAt) {
          const start = sm.blinkStart, dur = sm.blinkEndAt - start;
          const t = Math.max(0, Math.min(1, (now - start) / dur));
          const closeP = 0.5;
          blinkValue = t < closeP ? 1 - (t / closeP) * 0.96 : 0.04 + ((t - closeP) / (1 - closeP)) * 0.96;
        } else if (sm.blinkEndAt && now >= sm.blinkEndAt) {
          sm.blinkEndAt = 0;
          if (sm.blinkOnComplete) { const cb = sm.blinkOnComplete; sm.blinkOnComplete = null; cb(); }
          blinkValue = state === 'sleeping' ? 0.04 : state === 'drowsy' ? 0.85 : 1;
        } else {
          blinkValue = state === 'sleeping' ? 0.04 : state === 'drowsy' ? 0.85 : 1;
        }
      }

      springs.b.setTarget(blinkValue);
      springs.b.step();

      let tx = 0, ty = 0;
      if (tracking && !sm.coverActive && ['awake', 'focused', 'alert', 'drowsy'].includes(state)) {
        const dx = m.x - logoCx, dy = m.y - logoCy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const safeDist = dist || 1;
        const maxX = state === 'alert' ? 8 : 6.5;
        const maxY = state === 'alert' ? 4 : 3.5;
        const mag = Math.min(dist / 140, 1);
        tx = (dx / safeDist) * mag * maxX + sm.saccadeX;
        ty = (dy / safeDist) * mag * maxY + sm.saccadeY;
      }
      springs.x.setTarget(tx);
      springs.y.setTarget(ty);
      springs.x.step();
      springs.y.step();

      if (saccades && now >= sm.nextSaccadeAt && !sm.coverActive && ['awake', 'focused', 'drowsy'].includes(state)) {
        const intensity = state === 'drowsy' ? 0.5 : 1;
        sm.saccadeX = (Math.random() - 0.5) * 1.8 * intensity;
        sm.saccadeY = (Math.random() - 0.5) * 1.0 * intensity;
        setTimeout(() => { sm.saccadeX = 0; sm.saccadeY = 0; }, 60 + Math.random() * 60);
        sm.nextSaccadeAt = now + 280 + Math.random() * 620;
      }

      applyEye(springs.x.v, springs.y.v, springs.b.v);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [tracking, saccades, autoSleepDelayMs, enterState, applyEye, scheduleBlink, scheduleRandomBlink, scheduleDrowsyBlink, springs, sm]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        display: 'inline-block',
        cursor: 'default',
        width: size,
        lineHeight: 0,
        ...style,
      }}
    >
      <svg
        ref={svgRef}
        viewBox={iconOnly ? ICON_VIEWBOX : FULL_VIEWBOX}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          overflow: 'visible',
        }}
      >
        {!iconOnly && (
          <g>
            {TEXT_PATHS.map((d, i) => (
              <path key={`t-${i}`} d={d} style={{ fill }} />
            ))}
          </g>
        )}
        <g>
          {FACE_PATHS.map((d, i) => (
            <path key={`f-${i}`} d={d} style={{ fill }} />
          ))}
          <path
            ref={eyeRRef}
            d={EYE_PATHS.right}
            style={{
              fill,
              transformBox: 'fill-box',
              transformOrigin: 'center',
              filter: 'drop-shadow(0 0 var(--glow-r, 0px) var(--glow-c, transparent))',
              transition: 'filter 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
          <path
            ref={eyeLRef}
            d={EYE_PATHS.left}
            style={{
              fill,
              transformBox: 'fill-box',
              transformOrigin: 'center',
              filter: 'drop-shadow(0 0 var(--glow-r, 0px) var(--glow-c, transparent))',
              transition: 'filter 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
        </g>
      </svg>
    </div>
  );
});

export default LivingLogo;
