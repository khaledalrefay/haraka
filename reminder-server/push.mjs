// Web Push aes128gcm (RFC 8291/8188) + VAPID (RFC 8292), Web Crypto only.
const encoder = new TextEncoder();
export function base64url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
export function decode(value) {
  const string = atob(value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4));
  return Uint8Array.from(string, c => c.charCodeAt(0));
}
const concat = (...values) => {
  const result = new Uint8Array(values.reduce((size, value) => size + value.length, 0));
  let offset = 0;
  for (const value of values) { result.set(value, offset); offset += value.length; }
  return result;
};
async function hkdf(input, salt, info, length) {
  const key = await crypto.subtle.importKey('raw', input, 'HKDF', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt, info }, key, length * 8));
}
export async function encryptPayload(subscription, payload) {
  const plaintext = encoder.encode(JSON.stringify(payload));
  if (plaintext.length > 3000) throw Error('Payload too large');
  const clientPublic = decode(subscription.keys.p256dh);
  const clientKey = await crypto.subtle.importKey('raw', clientPublic, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const ephemeral = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const serverPublic = new Uint8Array(await crypto.subtle.exportKey('raw', ephemeral.publicKey));
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: clientKey }, ephemeral.privateKey, 256));
  const ikm = await hkdf(shared, decode(subscription.keys.auth), concat(encoder.encode('WebPush: info\0'), clientPublic, serverPublic), 32);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyBytes = await hkdf(ikm, salt, encoder.encode('Content-Encoding: aes128gcm\0'), 16);
  const nonce = await hkdf(ikm, salt, encoder.encode('Content-Encoding: nonce\0'), 12);
  const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['encrypt']);
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, key, concat(plaintext, new Uint8Array([2]))));
  const recordSize = new Uint8Array(4); new DataView(recordSize.buffer).setUint32(0, 4096);
  return concat(salt, recordSize, new Uint8Array([65]), serverPublic, ciphertext);
}
export async function vapidHeader(endpoint, env, now = Date.now()) {
  const raw = decode(env.VAPID_PUBLIC_KEY);
  const key = await crypto.subtle.importKey('jwk', { kty: 'EC', crv: 'P-256', x: base64url(raw.slice(1, 33)), y: base64url(raw.slice(33)), d: env.VAPID_PRIVATE_KEY }, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const encodeJSON = value => base64url(encoder.encode(JSON.stringify(value)));
  const token = `${encodeJSON({ typ: 'JWT', alg: 'ES256' })}.${encodeJSON({ aud: new URL(endpoint).origin, exp: Math.floor(now / 1000) + 12 * 3600, sub: env.VAPID_SUBJECT })}`;
  const signature = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, encoder.encode(token));
  return `vapid t=${token}.${base64url(signature)}, k=${env.VAPID_PUBLIC_KEY}`;
}
export async function sendPush(subscription, payload, env) {
  return fetch(subscription.endpoint, {
    method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(15000),
    headers: { Authorization: await vapidHeader(subscription.endpoint, env), 'Content-Encoding': 'aes128gcm', 'Content-Type': 'application/octet-stream', TTL: '300', Urgency: 'normal' },
    body: await encryptPayload(subscription, payload)
  });
}
