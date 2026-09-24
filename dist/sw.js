/* Bump VERSION when deploying a changed offline shell. */
'use strict';
importScripts('./push-handler.js');
const VERSION = 'release-2.0.0-beta.13-d150c77d53ee';
const BASE = new URL('./', self.location.href);
const PREFIX = 'haraka-pwa-' + BASE.pathname + '-';
const CACHE = PREFIX + VERSION;
const CORE = ["./", "index.html", "app.bundle.js", "config.js", "pwa.js", "push-handler.js", "manifest.webmanifest", "assets/exercise-images/march.jpg", "assets/icon.svg", "assets/icon-192.png", "assets/icon-512.png", "assets/fonts/tajawal-regular.ttf", "assets/fonts/tajawal-bold.ttf", "css/tokens.css", "css/base.css", "css/components.css", "css/app.css"].map(path => new URL(path, BASE).href);
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
  // One installed shell is served as a unit until the next worker activates.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const key = new URL(url.origin + url.pathname);
    const cached = await cache.match(key.href);
    if(cached) return cached;
    if(navigation){const shell=await cache.match(new URL('index.html',BASE).href);if(shell)return shell;}
    return fetch(request);
  })());
});
