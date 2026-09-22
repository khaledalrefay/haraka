import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { createECDH, hkdfSync, createDecipheriv, generateKeyPairSync, createPublicKey, verify, randomBytes } from 'node:crypto';
import { encryptPayload, vapidHeader } from '../push.mjs';
import { validPrefs, dueReminder, allowedEndpoint, occurrence, localClock } from '../rules.mjs';
import { handleRequest, sendDue, hash } from '../worker.mjs';

const receiver = createECDH('prime256v1'); receiver.generateKeys();
const auth = randomBytes(16);
const subscription = { endpoint:'https://fcm.googleapis.com/fcm/send/test-device', keys: { p256dh: receiver.getPublicKey().toString('base64url'), auth: auth.toString('base64url') } };
const pair=generateKeyPairSync('ec',{namedCurve:'prime256v1'}),jwk=pair.privateKey.export({format:'jwk'});
const publicKey=Buffer.concat([Buffer.from([4]),Buffer.from(jwk.x,'base64url'),Buffer.from(jwk.y,'base64url')]).toString('base64url');
const db=new DatabaseSync(':memory:'); db.exec(readFileSync(new URL('../schema.sql',import.meta.url),'utf8'));
const DB = {
  prepare(sql) {
    return {
      bind(...values) {
        const stmt = db.prepare(sql);
        return {
          async run() { const result = stmt.run(...values); return { meta: { changes: Number(result.changes) } }; },
          async first() { return stmt.get(...values) || null; },
          async all() { return { results: stmt.all(...values) }; }
        };
      }
    };
  }
};
const env={DB,APP_ORIGIN:'https://example.com',PAIRING_TOKEN:'activation-test',VAPID_PUBLIC_KEY:publicKey,VAPID_PRIVATE_KEY:jwk.d,VAPID_SUBJECT:'mailto:test@example.com'};
const token=randomBytes(32).toString('base64url');
const p={enabled:true,time:'18:00',timezone:'Asia/Damascus',entries:[{day:0,session:'C'},{day:2,session:'A'},{day:5,session:'B'}],doneKeys:[],skipDates:[]};
const now=Date.parse('2026-09-20T15:00:00Z');
assert(validPrefs(p));assert(!validPrefs({...p,time:'25:00'}));assert(!validPrefs({...p,timezone:'Fake/Zone'}));assert(!validPrefs({...p,entries:[p.entries[0],p.entries[0],p.entries[2]]}));
assert.equal(dueReminder(p,now).session,'C');assert.equal(dueReminder(p,now-60000),null);assert(dueReminder(p,now+240000));assert.equal(dueReminder(p,now+300000),null);
assert.equal(dueReminder({...p,doneKeys:[occurrence('2026-09-20','C')]},now),null);assert.equal(dueReminder({...p,skipDates:['2026-09-20']},now),null);
assert.equal(dueReminder({...p,enabled:false},now),null);assert.equal(dueReminder(p,now+86400000),null);
assert.equal(localClock(Date.parse('2026-09-20T23:30:00Z'),'Asia/Damascus').date,'2026-09-21');
assert.equal(localClock(Date.parse('2026-09-20T02:00:00Z'),'America/New_York').date,'2026-09-19');
for(const u of ['http://fcm.googleapis.com/x','https://localhost/x','https://169.254.169.254/x','https://fcm.googleapis.com.evil.test/x','https://user@fcm.googleapis.com/x'])assert(!allowedEndpoint(u));
assert(allowedEndpoint(subscription.endpoint));
// Independent Node crypto receiver decrypts WebCrypto-produced RFC record.
const payload={title:'وقت حركة',body:'اختبار عربي',day:'2026-09-20'};
const record=Buffer.from(await encryptPayload(subscription,payload));
const salt=record.subarray(0,16);assert.equal(record.readUInt32BE(16),4096);assert.equal(record[20],65);
const senderPublic=record.subarray(21,86),shared=receiver.computeSecret(senderPublic);
const info=Buffer.concat([Buffer.from('WebPush: info\0'),receiver.getPublicKey(),senderPublic]);
const ikm=Buffer.from(hkdfSync('sha256',shared,auth,info,32));
const key=Buffer.from(hkdfSync('sha256',ikm,salt,Buffer.from('Content-Encoding: aes128gcm\0'),16));
const nonce=Buffer.from(hkdfSync('sha256',ikm,salt,Buffer.from('Content-Encoding: nonce\0'),12));
const encrypted=record.subarray(86),decipher=createDecipheriv('aes-128-gcm',key,nonce);decipher.setAuthTag(encrypted.subarray(-16));
const plain=Buffer.concat([decipher.update(encrypted.subarray(0,-16)),decipher.final()]);assert.equal(plain.at(-1),2);assert.deepEqual(JSON.parse(plain.subarray(0,-1)),payload);
const header=await vapidHeader(subscription.endpoint,env,now),jwt=header.match(/t=([^,]+)/)[1],parts=jwt.split('.');
assert(verify('sha256',Buffer.from(parts[0]+'.'+parts[1]),{key:createPublicKey({key:{...jwk,d:undefined},format:'jwk'}),dsaEncoding:'ieee-p1363'},Buffer.from(parts[2],'base64url')));
const claims=JSON.parse(Buffer.from(parts[1],'base64url'));assert.equal(claims.aud,'https://fcm.googleapis.com');assert.equal(claims.exp,Math.floor(now/1000)+43200);
let sends=[];const sender=async(s,p)=>{sends.push(p);return new Response('',{status:201})};
const req=(path,method,body,bearer=token,origin=env.APP_ORIGIN)=>new Request('https://api.example.com/v1/'+path,{method,headers:{Origin:origin,...(body?{'Content-Type':'application/json'}:{}),Authorization:'Bearer '+bearer},body:body?JSON.stringify(body):undefined});
assert.equal((await handleRequest(req('config','GET',null,token,'https://evil.test'),env,sender)).status,403);
assert.equal((await handleRequest(req('register','POST',{deviceToken:token,subscription,preferences:p},'wrong'),env,sender)).status,401);
const registration=await handleRequest(req('register','POST',{deviceToken:token,subscription,preferences:p},env.PAIRING_TOKEN),env,sender);assert.equal(registration.status,200);const {id}=await registration.json();
assert.equal(id,await hash(subscription.endpoint));
await Promise.all([sendDue(env,now,sender),sendDue(env,now,sender)]);assert.equal(sends.length,1);assert.equal(sends[0].session,'C');
await sendDue(env,now+60000,sender);assert.equal(sends.length,1);
db.prepare('UPDATE devices SET last_key=NULL').run();
const suppressed={...p,doneKeys:[occurrence('2026-09-20','C')]};
assert.equal((await handleRequest(req('device','PUT',{id,preferences:suppressed}),env,sender)).status,200);await sendDue(env,now,sender);assert.equal(sends.length,1);
assert.equal((await handleRequest(req('device','PUT',{id,preferences:p},'wrong'),env,sender)).status,401);
await handleRequest(req('device','PUT',{id,preferences:p}),env,sender);
let attempts=0;await sendDue(env,now,async()=>{attempts++;return new Response('',{status:503})});
assert.equal(db.prepare('SELECT last_key FROM devices').get().last_key,null);await sendDue(env,now+60000,sender);assert.equal(sends.length,2);assert.equal(attempts,1);
db.prepare('UPDATE devices SET last_key=NULL').run();await sendDue(env,now,async()=>new Response('',{status:410}));assert.equal(db.prepare('SELECT enabled FROM devices').get().enabled,0);
await handleRequest(req('device','PUT',{id,preferences:p}),env,sender);
assert.equal((await handleRequest(req('test','POST',{id}),env,sender)).status,200);assert.equal((await handleRequest(req('test','POST',{id}),env,sender)).status,429);
await handleRequest(req('device','DELETE',{id}),env,sender);assert.equal(db.prepare('SELECT count(*) AS n FROM devices').get().n,0);
// Local-day retry key differs from UTC date at late evening UTC.
const q={...p,timezone:'Pacific/Honolulu',time:'18:00',entries:[{day:6,session:'A'},{day:1,session:'B'},{day:3,session:'C'}]};
await handleRequest(req('register','POST',{deviceToken:token,subscription,preferences:q},env.PAIRING_TOKEN),env,sender);
await sendDue(env,Date.parse('2026-09-20T04:00:00Z'),async()=>{throw Error('offline')});assert.equal(db.prepare('SELECT last_key FROM devices').get().last_key,null);
console.log('PASS: Web Push encryption independently decrypted; VAPID independently verified; timezone/window/completion rules; actual SQLite API auth/upsert/delete; concurrent cron dedupe; retries and expired subscriptions; test throttle.');
