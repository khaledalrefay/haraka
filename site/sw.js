/* Bump VERSION when deploying a changed offline shell. */
'use strict';
importScripts('./push-handler.js');
const VERSION = 'release-1.0.2';
const BASE = new URL('./', self.location.href);
const PREFIX = 'haraka-pwa-' + BASE.pathname + '-';
const CACHE = PREFIX + VERSION;
const CORE = [
  "./",
  "index.html",
  "pwa.js",
  "config.js",
  "app.bundle.js",
  "js/shared/exercise-image.js",
  "assets/exercise-images/march.jpg",
  "assets/exercise-images/shoulders.jpg",
  "assets/exercise-images/neck.jpg",
  "assets/exercise-images/wall-slide.jpg",
  "assets/exercise-images/wall-push.jpg",
  "assets/exercise-images/bridge.jpg",
  "assets/exercise-images/bird-dog.jpg",
  "assets/exercise-images/calf.jpg",
  "assets/exercise-images/side-plank.jpg",
  "assets/exercise-images/side-step.jpg",
  "assets/exercise-images/chest.jpg",
  "assets/exercise-images/breathe.jpg",
  "assets/exercise-images/chair-squat.jpg",
  "assets/exercise-images/incline-push.jpg",
  "assets/exercise-images/split-squat.jpg",
  "assets/exercise-images/heel-slide.jpg",
  "assets/exercise-images/active-march.jpg",
  "push-handler.js",
  "js/reminder-config.js",
  "js/shared/reminder-db.js",
  "js/features/reminders.js",
  "manifest.webmanifest",
  "assets/icon.svg",
  "assets/icon-192.png",
  "assets/icon-512.png",
  "assets/fonts/tajawal-regular.ttf",
  "assets/fonts/tajawal-bold.ttf",
  "js/core/store.js",
  "js/shared/ui.js",
  "js/shared/dates.js",
  "js/features/schedule.js",
  "js/features/workout.js",
  "js/features/exercises.js",
  "js/core/storage.js",
  "js/features/settings.js",
  "js/core/router.js",
  "js/features/today.js",
  "js/features/history.js",
  "js/features/timer.js",
  "js/features/completion.js",
  "js/features/backup.js",
  "js/core/events.js",
  "js/app.js",
  "js/data/exercises.js",
  "js/data/plans.js",
  "js/features/preferences.js",
  "js/data/palettes.js",
  "js/data/new-exercises.js",
  "js/core/records.js",
  "js/core/reconcile.js",
  "js/features/schedule-settings.js",
  "css/tokens.css",
  "css/base.css",
  "css/components.css",
  "css/screens.css"
].map(path => new URL(path, BASE).href);
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
