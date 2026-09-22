import {
  exportData
} from '../features/backup.js';
import { saveEffort } from '../features/completion.js';
import {
  exerciseDetails
} from '../features/exercises.js';
import {
  deletePrompt, deleteRecord, editRecord, saveNote
} from '../features/history.js';
import { applyPalette, setPreference } from '../features/preferences.js';
import { activateReminder, activationDialog, runReminderAction } from '../features/reminders.js';
import { changeScheduleDay, editSchedule, saveSchedule } from '../features/schedule-settings.js';
import { guide, setDefaultRounds, settings, theme } from '../features/settings.js';
import {
  pauseTimer,
  prepareSound,
  remaining,
  ringTimer,
  timeText,
  toggleTimer
} from '../features/timer.js';
import {
  today
} from '../features/today.js';
import { advance, chooseSessionRounds, confirmStart, finish, initTimer, renderPlayer, start, stopPrompt } from '../features/workout.js';
import {
  dateKey,
  parseDay
} from '../shared/dates.js';
import {
  $,
  closeDialog,
  icon, modal,
  modalHead,
  showDialog,
  toast
} from '../shared/ui.js';
import { reconcileActive } from './reconcile.js';
import {
  navigate,
  render,
  tabs
} from './router.js';
import {
  restoreData,
  save, validate
} from './storage.js';
import {
  KEY,
  runtime
} from './store.js';
export function actions(event){
const t=event.target.closest('button');
if(!t)return;
if(t.dataset.preference){setPreference(t.dataset.preference,t.dataset.value);return;}
if(t.dataset.scheduleSession){changeScheduleDay(t.dataset.scheduleSession,Number(t.dataset.scheduleDay));return;}
if (t.dataset.effortRecord !== undefined) { saveEffort(t.dataset.effortRecord, t.dataset.effort); return; }
if (t.dataset.sessionRounds) { chooseSessionRounds(Number(t.dataset.sessionRounds)); return; }
if (t.dataset.defaultRounds) { setDefaultRounds(Number(t.dataset.defaultRounds)); return; }
if(t.dataset.start||['confirm-start','timer','done','skip','resume','resume-close','extend'].includes(t.dataset.action))void prepareSound();
if(t.dataset.delete){
deletePrompt(t.dataset.delete);
return;
}
if(t.dataset.confirmDelete){
deleteRecord(t.dataset.confirmDelete);
return;
}
if(t.dataset.exercise){
exerciseDetails(t.dataset.exercise);
return;
}
if(t.dataset.day){
runtime.selected=t.dataset.day;
today();
return;
}
if(t.dataset.start){
start(t.dataset.start);
return;
}
if(t.dataset.edit){
editRecord(t.dataset.edit);
return;
}
if(t.dataset.saveNote){
saveNote(t.dataset.saveNote);
return;
}
switch(t.dataset.action){
case 'reminder-enable':activationDialog();break;
case 'reminder-confirm':void activateReminder();break;
case 'reminder-save':
case 'reminder-disable':
case 'reminder-test':
  void runReminderAction(t.dataset.action);
  break;
case 'edit-schedule':editSchedule();break;
case 'save-schedule':saveSchedule();break;
case 'confirm-start':confirmStart();break;
case 'install-app':void window.HarakaPWA?.install();
break;
case 'test-sound':void prepareSound().then(ok=>{
if(!ok||!ringTimer())toast('تعذّر تشغيل الصوت في هذا المتصفح.');
}
);
break;
case 'prev-week':case 'next-week':{
const d=parseDay(runtime.selected);
d.setDate(d.getDate()+(t.dataset.action==='prev-week'?-7:7));
runtime.selected=dateKey(d);
today();
break;
}
case 'current-day':runtime.selected=dateKey();
today();
break;
case 'close':closeDialog();
break;
case 'home':navigate('today');
break;
case 'resume':navigate('session');
break;
case 'resume-close':closeDialog();
navigate('session');
break;
case 'pause-home':pauseTimer();
navigate('today');
toast('حُفظت الخطوات. يمكنك المتابعة لاحقًا.');
break;
case 'done':advance('done');
break;
case 'skip':advance('skip');
break;
case 'timer':toggleTimer();
break;
case 'reset-timer':pauseTimer();
initTimer();
save();
renderPlayer();
break;
case 'extend':{
const a=runtime.state.active;
if(!a?.timer)break;
const n=remaining()+15000;
a.timer.remaining=n;
if(a.timer.running)a.timer.deadline=Date.now()+n;
save();
renderPlayer();
break;
}
case 'end-rest':if(runtime.state.active){
runtime.state.active.mode='exercise';
initTimer();
save();
renderPlayer();
}
break;
case 'stop':case 'stop-dialog':stopPrompt();
break;
case 'confirm-stop':closeDialog();
finish('stopped');
break;
case 'guide':guide();
break;
case 'copy-backup':{
const field=$('#backup-text');
field.focus();
field.select();
if(navigator.clipboard?.writeText)navigator.clipboard.writeText(field.value).then(()=>toast('تم نسخ بيانات النسخة')).catch(()=>toast('تم تحديد النص؛ اختر نسخ من قائمة المتصفح.'));
else toast('تم تحديد النص؛ اختر نسخ من قائمة المتصفح.');
break;
}
case 'export':exportData();
break;
case 'import':$('#import-file').click();
break;
case 'confirm-import':if(runtime.pendingImport){
try{
restoreData(runtime.pendingImport);
applyPalette();
reconcileActive();
runtime.pendingImport=null;
$('#storage-warning').hidden=true;
closeDialog();
navigate('today');
toast('تمت استعادة النسخة');
}
catch{
toast('تعذّر الحفظ؛ لم نستبدل البيانات الحالية.');
}
}
break;
}
}
export function bindEvents(){
$('#theme-btn').onclick=()=>{
const t=document.documentElement.dataset.theme==='dark'?'light':'dark';
document.documentElement.dataset.theme=t;
try{
localStorage.setItem('haraka-theme',t)
}
catch{
}
theme();
}
;
theme();
$('#settings-btn').innerHTML=icon('settings');
$('#settings-btn').onclick=settings;
tabs.forEach(([id,i,t])=>{
const b=$(`[data-nav=${id}]`);
b.innerHTML=icon(i)+t;
b.onclick=()=>navigate(id);
}
);
modal.addEventListener('click',e=>{
if(e.target===modal){
const r=modal.getBoundingClientRect();
if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();
}
}
);
$('#import-file').onchange=async e=>{
const f=e.target.files[0];
e.target.value='';
if(!f)return;
try{
if(f.size>8*1024*1024)throw Error();
const x=JSON.parse(await f.text());
if(x.app!=='haraka'||!validate(x.data))throw Error();
runtime.pendingImport=x.data;

if(runtime.pendingImport.active?.timer){
runtime.pendingImport.active.timer.running=false;
runtime.pendingImport.active.timer.deadline=0;
}
showDialog(`${modalHead('استعادة النسخة الاحتياطية')}<p>النسخة تحتوي على ${runtime.pendingImport.history.length.toLocaleString('en-US')} سجل${runtime.pendingImport.active?' وجلسة غير منتهية':''}. ستستبدل البيانات الحالية على هذا الجهاز.</p><p class="plan-note">صدّر بياناتك الحالية أولًا إذا أردت الاحتفاظ بها.</p><div class="button-row"><button class="secondary" data-action="export">تصدير الحالي</button><button class="primary" data-action="confirm-import">استبدال واستعادة</button></div>`);
}
catch{
toast('الملف غير صالح أو من إصدار غير مدعوم. لم تتغير بياناتك.');
}
}
;
document.addEventListener('click',actions);

setInterval(()=>{
const currentDay = dateKey();
if (currentDay !== runtime.observedDay) {
  if (runtime.selected === runtime.observedDay) runtime.selected = currentDay;
  runtime.observedDay = currentDay;
  reconcileActive();
  if (runtime.view === 'today' || runtime.view === 'session') render();
}
const t=runtime.state.active?.timer;
if(!t?.running)return;
const ms=remaining();
const node=$('#timer');
if(node)node.textContent=timeText(ms);
if(ms<=0){
ringTimer();
t.remaining=0;
t.running=false;
t.deadline=0;
save();
if(runtime.view==='session'){
renderPlayer();
toast(runtime.state.active.mode==='rest'?'انتهت الراحة؛ انتقل عندما تكون جاهزًا.':'انتهى الوقت؛ أكّد إنجاز الخطوة عندما تكون جاهزًا.');
}
}
}
,200);
document.addEventListener('visibilitychange',()=>{
if(document.hidden)pauseTimer();
else{
reconcileActive();
const now=dateKey();
if(now!==runtime.observedDay){
if(runtime.selected===runtime.observedDay)runtime.selected=now;
runtime.observedDay=now;
}
if(runtime.view==='session')renderPlayer();
else if(runtime.view==='today')today();
}
}
);
window.addEventListener('pagehide',pauseTimer);
window.addEventListener('storage',e=>{
if(e.key===KEY){
try{
const x=JSON.parse(e.newValue);
if(validate(x)){
runtime.state=x;
applyPalette();
reconcileActive();

if(runtime.state.active?.timer)runtime.state.active.timer.running=false;
render();
toast('تحدّث السجل من نافذة أخرى.');
}
}
catch{
}
}
}
);
window.addEventListener('hashchange',()=>{
const v=location.hash.slice(1);
if(['today','library','history','session','summary'].includes(v)){
runtime.view=v;
render();
}
}
);
const initial = location.hash.slice(1);
if(['today','library','history','session','summary'].includes(initial))runtime.view=initial;
render();
}
