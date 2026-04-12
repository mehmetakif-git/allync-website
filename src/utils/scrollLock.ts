/**
 * Centralized scroll lock manager.
 * Multiple components can request a scroll lock independently.
 * Scroll is only unlocked when ALL locks are released.
 */

const DEBUG = import.meta.env.DEV;

let lockCount = 0;

function debugLog(action: string) {
  if (!DEBUG) return;
  const bodyStyles = {
    overflow: document.body.style.overflow,
    position: document.body.style.position,
    top: document.body.style.top,
    height: document.body.style.height,
  };
  const htmlOverflow = document.documentElement.style.overflow;
  console.log(
    `%c[ScrollLock] ${action} | lockCount: ${lockCount} | body: ${JSON.stringify(bodyStyles)} | html.overflow: "${htmlOverflow}"`,
    'color: #00ff88; font-weight: bold;'
  );
  // Stack trace to find caller
  console.trace('[ScrollLock] caller');
}

export function lockScroll() {
  lockCount++;
  if (lockCount === 1) {
    document.body.style.overflowY = 'hidden';
  }
  debugLog('LOCK');
}

export function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflowY = '';
  }
  debugLog('UNLOCK');
}

/**
 * Force reset - clears all locks and restores scroll.
 * Used by App.tsx on navigation to guarantee clean state.
 */
export function resetScrollLock() {
  lockCount = 0;
  document.body.style.overflowY = '';
  debugLog('RESET');
}

// Monitor any external changes to body scroll styles
if (DEBUG) {
  let lastOverflow = '';
  let lastPosition = '';
  let lastTop = '';
  setInterval(() => {
    const o = document.body.style.overflow;
    const p = document.body.style.position;
    const t = document.body.style.top;
    if (o !== lastOverflow || p !== lastPosition || t !== lastTop) {
      console.log(
        `%c[ScrollLock] EXTERNAL CHANGE detected! overflow: "${lastOverflow}"→"${o}" | position: "${lastPosition}"→"${p}" | top: "${lastTop}"→"${t}" | lockCount: ${lockCount}`,
        'color: #ff4444; font-weight: bold; font-size: 14px;'
      );
      console.trace('[ScrollLock] external change caller');
      lastOverflow = o;
      lastPosition = p;
      lastTop = t;
    }
  }, 200);
}
