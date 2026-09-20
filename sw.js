/* Bump VERSION when deploying a changed offline shell. */
'use strict';
const VERSION = '2026-09-20-2';
const BASE = new URL('./', self.location.href);
const PREFIX = 'haraka-pwa-' + BASE.pathname + '-';
const CACHE = PREFIX + VERSION;
const CORE = ['./', 'index.html', 'style.css', 'data.js', 'app.js', 'pwa.js',
  'manifest.webmanifest', 'assets/icon.svg', 'assets/icon-192.png',
  'assets/icon-512.png', 'assets/fonts/tajawal-regular.ttf',
  'assets/fonts/tajawal-bold.ttf'].map(path => new URL(path, BASE).href);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(
    CORE.map(url => new Request(url, { cache: 'reload' }))
  )));
  // A replacement worker waits until open app windows close; no forced reload.
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== BASE.origin ||
      !url.pathname.startsWith(BASE.pathname)) return;
  const navigation = request.mode === 'navigate';
  const relative = url.pathname.slice(BASE.pathname.length);
  if (!navigation && !CORE.includes(url.origin + url.pathname) &&
      !relative.startsWith('assets/')) return;
  // Fresh files online; cached copies only when the network is unavailable.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request, { cache: 'no-cache' });
      if (response.ok && response.type !== 'opaque' && !response.redirected) {
        try { await cache.put(request, response.clone()); } catch (_) {}
      }
      return response;
    } catch (_) {
      const cached = await cache.match(request);
      if (cached) return cached;
      if (navigation) {
        const shell = await cache.match(new URL('index.html', BASE).href);
        if (shell) return shell;
      }
      return Response.error();
    }
  })());
});
