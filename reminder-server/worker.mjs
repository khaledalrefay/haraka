import { sendPush, decode } from './push.mjs';
import { validPrefs, dueReminder, allowedEndpoint } from './rules.mjs';
const titles = { A: 'قوة أساسية', B: 'توازن وتحكّم', C: 'قوة وتحمّل حركي' };
export async function hash(value) {
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))).map(n => n.toString(16).padStart(2, '0')).join('');
}
function equal(a, b) { if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false; let diff = 0; for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i); return diff === 0; }
function configured(env) { return env.DB && env.APP_ORIGIN && env.PAIRING_TOKEN && env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY && /^(mailto:|https:\/\/)/.test(env.VAPID_SUBJECT || ''); }
function response(request, env, data, status = 200) {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', Vary: 'Origin' };
  if (request.headers.get('Origin') === env.APP_ORIGIN) Object.assign(headers, { 'Access-Control-Allow-Origin': env.APP_ORIGIN, 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' });
  return new Response(JSON.stringify(data), { status, headers });
}
async function validSubscription(s) {
  if (!s || !allowedEndpoint(s.endpoint) || s.endpoint.length > 3000) return false;
  try {
    if (decode(s.keys.auth).length !== 16 || decode(s.keys.p256dh).length !== 65) return false;
    await crypto.subtle.importKey('raw', decode(s.keys.p256dh), { name: 'ECDH', namedCurve: 'P-256' }, false, []);
    return true;
  } catch { return false; }
}
export async function handleRequest(request, env, sender = sendPush) {
  const reply = (data, status) => response(request, env, data, status);
  if (request.headers.get('Origin') !== env.APP_ORIGIN) return reply({ error: 'Origin not allowed' }, 403);
  if (request.method === 'OPTIONS') return reply({ ok: true });
  if (!configured(env)) return reply({ error: 'Service not configured' }, 503);
  const path = new URL(request.url).pathname;
  if (path === '/v1/config' && request.method === 'GET') return reply({ publicKey: env.VAPID_PUBLIC_KEY });
  const token = request.headers.get('Authorization')?.replace(/^Bearer /, '') || '';
  let data;
  try {
    if (!request.headers.get('Content-Type')?.startsWith('application/json')) return reply({ error: 'JSON required' }, 415);
    const body = await request.text();
    if (body.length > 16000) return reply({ error: 'Request too large' }, 413);
    data = JSON.parse(body);
  } catch { return reply({ error: 'Invalid request' }, 400); }
  if (path === '/v1/register' && request.method === 'POST') {
    if (!equal(token, env.PAIRING_TOKEN)) return reply({ error: 'Invalid activation code' }, 401);
    if (!/^[A-Za-z0-9_-]{43}$/.test(data.deviceToken || '') || !validPrefs(data.preferences) || !await validSubscription(data.subscription)) return reply({ error: 'Invalid subscription' }, 400);
    const id = await hash(data.subscription.endpoint);
    await env.DB.prepare('INSERT INTO devices (id,token_hash,subscription,preferences,enabled,updated_at) VALUES (?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET token_hash=excluded.token_hash,subscription=excluded.subscription,preferences=excluded.preferences,enabled=excluded.enabled,updated_at=excluded.updated_at').bind(id, await hash(data.deviceToken), JSON.stringify(data.subscription), JSON.stringify(data.preferences), data.preferences.enabled ? 1 : 0, Date.now()).run();
    return reply({ id });
  }
  if (!/^[a-f0-9]{64}$/.test(data?.id || '') || !/^[A-Za-z0-9_-]{43}$/.test(token)) return reply({ error: 'Unauthorized' }, 401);
  const device = await env.DB.prepare('SELECT * FROM devices WHERE id=?').bind(data.id).first();
  if (!device || !equal(await hash(token), device.token_hash)) return reply({ error: 'Unauthorized' }, 401);
  if (path === '/v1/device' && request.method === 'PUT') {
    if (!validPrefs(data.preferences)) return reply({ error: 'Invalid preferences' }, 400);
    await env.DB.prepare('UPDATE devices SET preferences=?,enabled=?,updated_at=? WHERE id=?').bind(JSON.stringify(data.preferences), data.preferences.enabled ? 1 : 0, Date.now(), device.id).run();
    return reply({ ok: true });
  }
  if (path === '/v1/device' && request.method === 'DELETE') {
    await env.DB.prepare('DELETE FROM devices WHERE id=?').bind(device.id).run();
    return reply({ ok: true });
  }
  if (path === '/v1/test' && request.method === 'POST') {
    if (!device.enabled) return reply({ error: 'Disabled' }, 409);
    const now = Date.now();
    const claim = await env.DB.prepare('UPDATE devices SET last_test=? WHERE id=? AND last_test<?').bind(now, device.id, now - 60000).run();
    if (!claim.meta.changes) return reply({ error: 'Wait a minute before another test' }, 429);
    try {
      const result = await sender(JSON.parse(device.subscription), { title: 'تذكير حركة', body: 'وصل إشعار التجربة. إعداد التذكير جاهز.', test: true, expiresAt: now + 300000 }, env);
      if (!result.ok) return reply({ error: 'Push provider rejected test' }, 502);
      return reply({ accepted: true });
    } catch { return reply({ error: 'Push provider unavailable' }, 502); }
  }
  return reply({ error: 'Not found' }, 404);
}
export async function sendDue(env, now = Date.now(), sender = sendPush) {
  if (!configured(env)) return;
  let cursor = '';
  while (true) {
    const batch = await env.DB.prepare('SELECT * FROM devices WHERE enabled=1 AND id>? ORDER BY id LIMIT 100').bind(cursor).all();
    for (const device of batch.results) {
      cursor = device.id;
      let claimedDay = null;
      try {
        const due = dueReminder(JSON.parse(device.preferences), now);
        if (!due || device.last_key === due.day) continue;
        const claim = await env.DB.prepare('UPDATE devices SET last_key=? WHERE id=? AND enabled=1 AND (last_key IS NULL OR last_key!=?)').bind(due.day, device.id, due.day).run();
        if (!claim.meta.changes) continue;
        claimedDay = due.day;
        // Recheck the latest completion/disable sync after taking the sending slot.
        const fresh = await env.DB.prepare('SELECT * FROM devices WHERE id=?').bind(device.id).first();
        const freshDue = fresh?.enabled ? dueReminder(JSON.parse(fresh.preferences), now) : null;
        if (!freshDue) continue;
        const result = await sender(JSON.parse(fresh.subscription), { title: 'وقت حركة', body: `جلستك اليوم: ${titles[freshDue.session]}. ابدأ عندما يناسبك.`, ...freshDue, expiresAt: now + 300000 }, env);
        if (result.status === 404 || result.status === 410) await env.DB.prepare('UPDATE devices SET enabled=0 WHERE id=?').bind(device.id).run();
        else if (!result.ok) throw Error('Push rejected');
      } catch {
        // Retry next minute, inside the five-minute window only. Notification tags deduplicate display.
        if (claimedDay) await env.DB.prepare('UPDATE devices SET last_key=NULL WHERE id=? AND last_key=?').bind(device.id, claimedDay).run();
      }
    }
    if (batch.results.length < 100) break;
  }
}
export default {
  async fetch(request, env) { try { return await handleRequest(request, env); } catch { return response(request, env, { error: 'Temporary service error' }, 503); } },
  scheduled(event, env, context) { context.waitUntil(sendDue(env, event.scheduledTime)); }
};
