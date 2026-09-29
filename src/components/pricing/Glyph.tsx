/* ============================================================
   src/components/pricing/Glyph.tsx
   ------------------------------------------------------------
   Every icon on /pricing, hand-rolled.

   WHY NOT lucide-react: index.css:1279-1283 (inside
   @media max-width:768px) force-sizes

     button … svg[class*="chevron"], button … svg[class*="arrow"]
       { width:20px !important; height:20px !important }

   and lucide 0.344 emits class="lucide lucide-chevron-left".
   An !important declaration beats any specificity, so the only
   defence is name avoidance. The class here is "pxc-g", which
   contains neither "chevron" nor "arrow".

   index.css:1287-1291 also force-sizes `.fixed[class*="bottom"] svg`
   to 40x40 — which is why the price slab carries no bottom-* class.
   ============================================================ */

import React from 'react';

type P = { size?: number; className?: string };

const base = (size: number, className?: string) => ({
  className: `pxc-g${className ? ' ' + className : ''}`,
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: 'false' as const,
});

export const GoBack: React.FC<P> = ({ size = 16, className }) => (
  <svg {...base(size, className)}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const GoNext: React.FC<P> = ({ size = 16, className }) => (
  <svg {...base(size, className)}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const Disclose: React.FC<P> = ({ size = 16, className }) => (
  <svg {...base(size, className)}>
    <path d="M6 9.5l6 6 6-6" />
  </svg>
);

export const Tick: React.FC<P> = ({ size = 16, className }) => (
  <svg {...base(size, className)} strokeWidth={2.2}>
    <path d="M4.5 12.5l5 5 10-11" />
  </svg>
);

export const Spark: React.FC<P> = ({ size = 16, className }) => (
  <svg {...base(size, className)}>
    <path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z" />
    <path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
  </svg>
);

export const Gift: React.FC<P> = ({ size = 16, className }) => (
  <svg {...base(size, className)}>
    <path d="M3.5 9.5h17v3h-17zM5 12.5v7a1 1 0 001 1h12a1 1 0 001-1v-7" />
    <path d="M12 9.5v11" />
    <path d="M12 9.5S10.8 4.5 8.5 4.5a2 2 0 000 5zM12 9.5s1.2-5 3.5-5a2 2 0 010 5z" />
  </svg>
);

export const Copy: React.FC<P> = ({ size = 16, className }) => (
  <svg {...base(size, className)}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M15 6.5V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2h.5" />
  </svg>
);

/* ---------- the three product marks ---------- */

/** Allync Hub — a unified inbox */
export const MarkHub: React.FC<P> = ({ size = 32, className }) => (
  <svg {...base(size, className)} strokeWidth={1.6}>
    <path d="M21 11.6a8.4 8.4 0 01-9 8.4A9 9 0 1121 11.6z" />
    <path d="M8 10h8M8 13.6h5" />
  </svg>
);

/** Allync Digital Signage — a screen */
export const MarkSignage: React.FC<P> = ({ size = 32, className }) => (
  <svg {...base(size, className)} strokeWidth={1.6}>
    <rect x="2.6" y="4" width="18.8" height="13" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);

/** Allync+ — a module grid */
export const MarkPlus: React.FC<P> = ({ size = 32, className }) => (
  <svg {...base(size, className)} strokeWidth={1.6}>
    <rect x="3" y="3" width="7.4" height="7.4" rx="1.6" />
    <rect x="13.6" y="3" width="7.4" height="7.4" rx="1.6" />
    <rect x="3" y="13.6" width="7.4" height="7.4" rx="1.6" />
    <rect x="13.6" y="13.6" width="7.4" height="7.4" rx="1.6" />
  </svg>
);

export const PRODUCT_MARK: Record<string, React.FC<P>> = {
  hub: MarkHub,
  signage: MarkSignage,
  plus: MarkPlus,
};
