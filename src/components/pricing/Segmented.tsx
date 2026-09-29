/* ============================================================
   src/components/pricing/Segmented.tsx
   ------------------------------------------------------------
   A segmented control whose highlight is MEASURED off the active
   button, so it morphs to any label width in either language.
   Re-measures on [active, items] and through a ResizeObserver,
   because Turkish labels run 20-40% longer than English ones and
   the control reflows on rotation.

   position/top/bottom/left/width/transform on the thumb are set
   ENTIRELY INLINE. index.css:1784 rewrites the `.absolute` utility
   to position:relative under 768px; this is a pxc- class so that
   rule cannot match it, but the thumb is the one element whose
   collapse would be most visible, so it is belted as well.
   ============================================================ */

import React, { useLayoutEffect, useRef, useState } from 'react';

export interface SegItem<T extends string> {
  id: T;
  label: string;
  /** the derived discount chip, e.g. "-%10". Absent when not derivable. */
  sub?: string;
}

interface Props<T extends string> {
  items: SegItem<T>[];
  active: T;
  onChange: (id: T) => void;
  ariaLabel: string;
  /** full width on a phone, hugging on desktop */
  block?: boolean;
}

export function Segmented<T extends string>({ items, active, onChange, ariaLabel, block }: Props<T>) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const btns = useRef(new Map<T, HTMLButtonElement>());
  const [thumb, setThumb] = useState({ x: 0, w: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const el = btns.current.get(active);
      if (el) setThumb({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (ro && wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener('resize', measure);
    /* fonts land after first paint and change label widths */
    const t = window.setTimeout(measure, 120);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
      window.clearTimeout(t);
    };
  }, [active, items]);

  const onKey = (e: React.KeyboardEvent) => {
    const i = items.findIndex((it) => it.id === active);
    if (i < 0) return;
    let n = i;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % items.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + items.length) % items.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = items.length - 1;
    else return;
    e.preventDefault();
    onChange(items[n].id);
    btns.current.get(items[n].id)?.focus();
  };

  return (
    <div
      ref={wrapRef}
      className="pxc-seg"
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKey}
      style={{ position: 'relative', width: block ? '100%' : undefined }}
    >
      <span
        className="pxc-seg-thumb"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 5,
          bottom: 5,
          left: 0,
          width: thumb.w,
          transform: `translateX(${thumb.x}px)`,
          transition: 'transform 450ms cubic-bezier(.16,1,.3,1), width 450ms cubic-bezier(.16,1,.3,1)',
        }}
      />
      {items.map((it) => (
        <button
          key={it.id}
          ref={(el) => {
            if (el) btns.current.set(it.id, el);
            else btns.current.delete(it.id);
          }}
          type="button"
          role="tab"
          aria-selected={active === it.id}
          tabIndex={active === it.id ? 0 : -1}
          className={active === it.id ? 'on' : undefined}
          onClick={() => onChange(it.id)}
          style={{ position: 'relative', zIndex: 1 }}
        >
          {it.label}
          {it.sub && <span className="sub">{it.sub}</span>}
        </button>
      ))}
    </div>
  );
}

export default Segmented;
