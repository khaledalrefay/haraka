/* Leave the browser's native install promotion untouched: no preventDefault,
   forced prompt, custom button, or automatic reload during a workout. */
(() => {
  'use strict';
  if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' })
      .catch(error => console.warn('Haraka offline setup unavailable:', error));
  }, { once: true });
})();
