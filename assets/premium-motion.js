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
    // Never transform SVG chart segments. Their geometry is viewBox-based.
    if (!target || target instanceof SVGElement || target.disabled || target.closest('[hidden]')) return;
    clearPress();
    lastPressed = target;
    target.classList.add('collins-touched');
  }, { passive: true });

  ['pointerup', 'pointercancel', 'scroll'].forEach(name =>
    document.addEventListener(name, clearPress, { passive: true })
  );
  window.addEventListener('blur', clearPress);

  document.addEventListener('DOMContentLoaded', () => {
    // Animate only opacity on a tab change; layout geometry remains stable.
    document.querySelectorAll('.screen').forEach(screen => {
      const observer = new MutationObserver(records => {
        if (!safeMotion()) return;
        if (!records.some(record => record.attributeName === 'hidden')) return;
        if (!screen.hidden && typeof screen.animate === 'function') {
          screen.animate([
            { opacity: .65 },
            { opacity: 1 }
          ], { duration: 170, easing: 'ease-out' });
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
