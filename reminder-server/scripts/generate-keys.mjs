import { generateKeyPairSync, randomBytes } from 'node:crypto';
import { writeFileSync, existsSync } from 'node:fs';
const file = new URL('../.secrets.json', import.meta.url);
const subject = process.argv[2];
if (!subject || !/^(mailto:|https:\/\/)/.test(subject)) {
  console.error('Usage: node scripts/generate-keys.mjs mailto:YOUR_EMAIL'); process.exit(1);
}
if (existsSync(file)) { console.error('.secrets.json already exists. Keep existing keys for installed devices.'); process.exit(1); }
const pair = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
const jwk = pair.privateKey.export({ format: 'jwk' });
const publicKey = Buffer.concat([Buffer.from([4]), Buffer.from(jwk.x, 'base64url'), Buffer.from(jwk.y, 'base64url')]).toString('base64url');
writeFileSync(file, JSON.stringify({ VAPID_PUBLIC_KEY: publicKey, VAPID_PRIVATE_KEY: jwk.d, VAPID_SUBJECT: subject, PAIRING_TOKEN: randomBytes(32).toString('base64url') }, null, 2), { mode: 0o600, flag: 'wx' });
console.log('Created server/.secrets.json locally. Upload as Worker secrets; never commit it.');
