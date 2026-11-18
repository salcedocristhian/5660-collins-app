/* Progressive motion enhancement for 5660 Collins.
   No business state is read or changed; all effects are presentation-only. */
(() => {
  'use strict';
  if (window.__collinsPremiumMotionInstalled) return;
  window.__collinsPremiumMotionInstalled = true;
  document.documentElement.classList.add('collins-premium');

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const safeMotion = () => !motionPreference.matches;
  const interactive = 'button, a, summary, [role="button"]';
  let lastPressed = null;

  function clearPress() {
    if (lastPressed) lastPressed.classList.remove('collins-touched');
    lastPressed = null;
  }

  document.addEventListener('pointerdown', event => {
    if (!safeMotion()) return;
    const target = event.target.closest(interactive);
    if (!target || target.disabled || target.closest('[hidden]')) return;
    clearPress();
    lastPressed = target;
    target.classList.add('collins-touched');
  }, { passive: true });

  ['pointerup', 'pointercancel', 'scroll'].forEach(name =>
    document.addEventListener(name, clearPress, { passive: true })
  );
  window.addEventListener('blur', clearPress);

  document.addEventListener('click', event => {
    if (!safeMotion()) return;
    const target = event.target.closest('.project-row, .permit-row, .project-card, .hoa-category-choice, .hoa-tab, .ms-tabs button');
    if (!target || typeof target.animate !== 'function') return;
    try {
      target.animate([
        { transform: 'scale(.987)', opacity: .87 },
        { transform: 'scale(1)', opacity: 1 }
      ], { duration: 280, easing: 'cubic-bezier(.22,1,.36,1)' });
    } catch (_) { /* Optional enhancement only. */ }
  }, { passive: true });

  document.addEventListener('DOMContentLoaded', () => {
    // Keep model viewers intact: these observers never reach inside an iframe.
    const nav = document.querySelector('.bottom-tabs');
    if (nav && safeMotion()) {
      nav.animate?.([
        { opacity: .75, transform: window.innerWidth >= 1100 ? 'translateY(12px)' : 'translate(-50%, 14px)' },
        { opacity: 1, transform: window.innerWidth >= 1100 ? 'translateY(0)' : 'translate(-50%, 0)' }
      ], { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)' });
    }

    document.querySelectorAll('.screen').forEach(screen => {
      const observer = new MutationObserver(records => {
        if (!safeMotion()) return;
        if (!records.some(record => record.attributeName === 'hidden')) return;
        if (!screen.hidden && typeof screen.animate === 'function') {
          screen.animate([
            { opacity: .48, transform: 'translateY(9px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ], { duration: 310, easing: 'cubic-bezier(.22,1,.36,1)' });
        }
      });
      observer.observe(screen, { attributes: true, attributeFilter: ['hidden'] });
    });
  }, { once: true });

  window.__collinsMotionQA = Object.freeze({
    version: 'premium-cinematic-preview-1',
    reducedMotion: () => motionPreference.matches,
    enabled: true
  });
})();
