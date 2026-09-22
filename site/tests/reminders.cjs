/* Run: node --experimental-vm-modules tests/reminders.cjs
   Deterministic application tests with a small DOM/storage harness, not a browser. */
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert');
const root = path.resolve(__dirname, '..');
let timestamp = Date.parse('2026-09-20T12:00:00');
class TestDate extends Date { constructor(...args) { super(...(args.length ? args : [timestamp])); } static now() { return timestamp; } }
const nodes = new Map(), listeners = new Map(), mem = new Map();
let failSave = false;
let networkFails = false; const requests = [], guards = [];
const subscription = { toJSON: () => ({ endpoint:'https://fcm.googleapis.com/test',keys:{p256dh:'test',auth:'test'} }) };
const registration = { pushManager: { getSubscription: async () => subscription }, waiting: null };
const permission = { permission:'granted', requestPermission:async()=>permission.permission }; 
function node(key) {
  if (!nodes.has(key)) nodes.set(key, {
    innerHTML: '', hidden: false, value: '', dataset: { nav: key.match(/data-nav=([^\]]+)/)?.[1] },
    classList: { toggle() {}, remove() {} }, setAttribute() {}, focus() {}, addEventListener() {},
    querySelector: selector => node(selector), showModal() { this.open = true; }, close() { this.open = false; },
    getBoundingClientRect() { return {}; }
  });
  return nodes.get(key);
}
const context = vm.createContext({
  captureGuard: value => guards.push(JSON.parse(JSON.stringify(value))), console, Intl, Notification: permission, PushManager: function(){}, indexedDB: {}, atob, btoa, AbortSignal,
  fetch: async (url, options) => { if(networkFails) throw Error('offline'); requests.push({url,options}); return {ok:true,json:async()=>url.endsWith('/config')?{publicKey:'BA'}:url.endsWith('/register')?{id:'a'.repeat(64)}:{accepted:true}}; }, Date: TestDate, Math, JSON, Number, String, Object, Array, Set, Map, RegExp, Error, URL, Blob,
  crypto: global.crypto, setTimeout: () => 0, clearTimeout() {}, setInterval() {},
  location: { hash: '' }, navigator: { serviceWorker: { register: async () => registration, ready: Promise.resolve(registration) } },
  localStorage: { getItem: key => mem.get(key) || null, setItem: (key, value) => { if (failSave) throw Error('full'); mem.set(key, value); } },
  document: { querySelector: node, querySelectorAll: () => ['today', 'library', 'history'].map(k => node('[data-nav=' + k + ']')),
    documentElement: { dataset: { theme: 'light' } }, addEventListener() {} },
  window: { isSecureContext: true, addEventListener: (name, fn) => listeners.set(name, fn), scrollTo() {} }
});
const modules = new Map();
function get(file) {
  file = path.resolve(file);
  if (!modules.has(file)) modules.set(file, new vm.SourceTextModule(file.endsWith('/reminder-config.js') ? "export const REMINDER_API='https://push.test';" : file.endsWith('/reminder-db.js') ? "export const writeReminderGuard = async value => captureGuard(value);" : fs.readFileSync(file, 'utf8'), { context, identifier: file }));
  return modules.get(file);
}
(async () => {
  const app = get(root + '/js/app.js');
  await app.link((specifier, module) => get(path.resolve(path.dirname(module.identifier), specifier)));
  await app.evaluate();
  const mod = name => get(root + '/js/' + name + '.js').namespace;
  const plans = mod('data/plans'), { D } = plans, { runtime: rt, defaults } = mod('core/store');
  const storage = mod('core/storage'), workout = mod('features/workout'), settings = mod('features/settings');
  const records = mod('core/records'), events = mod('core/events');
  const click = dataset => events.actions({ target: { closest: () => ({ dataset }) } });
  const reset = () => { rt.state = defaults(); rt.storageBroken = false; rt.pendingStart = null; rt.selected = '2026-09-20'; rt.view = 'today'; timestamp = Date.parse('2026-09-20T12:00:00'); };
  const reminders=mod('features/reminders');
  node('#reminder-code').value='activation';node('#reminder-chosen-time').value='18:00';
  await reminders.activateReminder();
  const device=JSON.parse(mem.get('haraka-reminders-v1'));assert(device.enabled);assert(device.id);assert.equal(device.token.length,43);
  const registered=JSON.parse(requests.find(r=>r.url.endsWith('/register')).options.body);
  assert.equal(registered.preferences.time,'18:00');assert(!JSON.stringify(registered).includes('note'));
  rt.state.history=[{id:'completed',session:'A',date:'2026-09-20',rounds:1,planVersion:3,results:D.sequence('A',1).map(()=>'done'),status:'finished',note:'PRIVATE_NOTE',feeling:'',effort:'high',finishedAt:TestDate.now()}];
  await reminders.syncReminders(true);
  assert(guards.at(-1).doneKeys.includes('2026-09-20:A'));assert(guards.at(-1).skipDates.includes('2026-09-20'));
  const update=JSON.parse(requests.at(-1).options.body);assert(!JSON.stringify(update).includes('PRIVATE_NOTE'));assert(!JSON.stringify(update).includes('effort'));
  const count=requests.length;await reminders.syncReminders();assert.equal(requests.length,count);
  node('#reminder-time').value='20:30';await reminders.saveReminderTime();assert.equal(JSON.parse(mem.get('haraka-reminders-v1')).time,'20:30');
  networkFails=true;await reminders.disableReminder();assert.equal(guards.at(-1).enabled,false);assert.equal(JSON.parse(mem.get('haraka-reminders-v1')).enabled,false);
  networkFails=false;await reminders.syncReminders(true);assert.equal(JSON.parse(requests.at(-1).options.body).preferences.enabled,false);
  permission.permission='denied';reminders.refreshReminders();assert(node('#reminder-status').textContent.includes('محظورة'));
  assert(!JSON.stringify(rt.state).includes(device.token));
  console.log('PASS: activation, preferences sync, no health notes/effort/credentials in shared data or backups, deduplicated sync, time save, offline local disable and reconnect, denied permission state.');
})().catch(error=>{console.error(error);process.exitCode=1});
