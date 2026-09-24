/* Service worker companion. IndexedDB schema shared with js/shared/reminder-db.js. */
function readReminderGuard() {
  return new Promise(resolve => {
    const request = indexedDB.open('haraka-reminder-guard', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('settings');
    request.onerror = () => resolve(null);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('settings', 'readonly');
      const get = tx.objectStore('settings').get('current');
      get.onsuccess = () => resolve(get.result || null);
      get.onerror = () => resolve(null);
      tx.oncomplete = () => db.close();
    };
  });
}
self.addEventListener('push', event => {
  event.waitUntil((async () => {
    let data;
    try { data = event.data?.json(); } catch { return; }
    if (!data || !Number.isFinite(data.expiresAt) || data.expiresAt < Date.now()) return;
    const guard = await readReminderGuard();
    if (!guard?.enabled) return;
    if (!data.test) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(data.day || '') || !['A', 'B', 'C'].includes(data.session)) return;
      const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: guard.timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map(p => [p.type, p.value]));
      const day = `${parts.year}-${parts.month}-${parts.day}`;
      if (data.day !== day || guard.skipDates?.includes(day) || guard.doneKeys?.includes(data.occurrence)) return;
      const weekday = new Date(`${day}T12:00:00Z`).getUTCDay();
      const entries=guard.scheduleRevisions?([...guard.scheduleRevisions].reverse().find(r=>r.effectiveFrom<=day)?.entries||[]):guard.entries;
      if (!entries?.some(e => e.day === weekday && e.session === data.session)) return;
    }
    await self.registration.showNotification(String(data.title || 'حركة').slice(0, 100), {
      body: String(data.body || '').slice(0, 300), lang: 'ar', dir: 'rtl',
      icon: new URL('assets/icon-192.png', self.registration.scope).href,
      tag: data.test ? 'haraka-test' : `haraka-${data.day}`, renotify: false,
      data: { url: new URL('./#today', self.registration.scope).href }
    });
  })());
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const target = new URL('./#today', self.registration.scope).href;
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const client = windows.find(c => c.url.startsWith(self.registration.scope));
    if (client) { await client.navigate(target); await client.focus(); }
    else await self.clients.openWindow(target);
  })());
});
