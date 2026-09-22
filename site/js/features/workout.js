import { exerciseImage } from '../shared/exercise-image.js';
import { opportunityFor } from './schedule.js';
import { reconcileActive } from '../core/reconcile.js';
import { durationLabel, roundsLabel, restBetween } from '../data/plans.js';
import { recordVersion, recordSequence, recordTitle } from '../core/records.js';
export { recordVersion, recordSequence } from '../core/records.js';
import { closeDialog } from '../shared/ui.js';
import {
D
}
from '../data/plans.js';
import {
isMain, workoutFor
}
from './schedule.js';
import {
runtime, uid
}
from '../core/store.js';
import {
dateKey
}
from '../shared/dates.js';
import {
toast, showDialog, modalHead, main, icon
}
from '../shared/ui.js';
import {
navigate
}
from '../core/router.js';
import {
editRecord
}
from './history.js';
import {
save
}
from '../core/storage.js';
import {
timeText, remaining, pauseTimer
}
from './timer.js';
import {
itemName
}
from './exercises.js';
import {
summary
}
from './completion.js';
export function start(id, requestedRounds = null){
if(!D.sessions[id])return;
if (!reconcileActive()) { toast('تعذّر حفظ الجلسة السابقة. حاول مجددًا قبل البدء.'); return; }
const opportunity = opportunityFor();
if(isMain(id)&&(runtime.selected!==dateKey()||opportunity?.session!==id)){
toast('هذه الجلسة غير مستحقة الآن، أو سبق تسجيل جلسة اليوم.');
return;
}
if(id==='mobility'&&(runtime.selected!==dateKey()||workoutFor(dateKey()))){
toast('حركات يوم الراحة متاحة في يوم الراحة الحالي.');
return;
}
if(runtime.storageBroken){
toast('استعد نسخة سليمة من الإعدادات أولًا لحماية حفظك السابق.');
return;
}
if(runtime.state.active){
if(runtime.state.active.session===id){
navigate('session');
return;
}
showDialog(`${modalHead('لديك جلسة محفوظة')}<p>أكملها أو أنهِها مبكرًا قبل بدء جلسة أخرى.</p><div class="button-row" style="margin-top:20px"><button class="primary" data-action="resume-close">أكمل الجلسة</button><button class="secondary" data-action="stop-dialog">إنهاء مبكر</button></div>`);
return;
}
const done=runtime.state.history.find(r=>r.date===dateKey()&&r.session===id&&r.status==='finished');
if(id!=='break'&&done){
editRecord(done.id);
return;
}
if (isMain(id) && requestedRounds === null) {
  runtime.pendingStart = { id, rounds: runtime.state.settings.rounds, date: dateKey(), scheduledDate: opportunity.scheduledDate, kind: opportunity.kind };
  renderStartOptions();
  return;
}
if (isMain(id) && ![1, 2].includes(requestedRounds)) return;
const rounds = isMain(id) ? requestedRounds : 1;
const seq = D.sequence(id, rounds);
runtime.state.active={
id:uid(),session:id,date:dateKey(),rounds,planVersion:D.version,cursor:0,results:seq.map(()=>null),mode:'exercise',timer:null,startedAt:Date.now()
}
;
if (isMain(id)) runtime.state.active.scheduledDate = opportunity.scheduledDate;
initTimer();
if (!save()) {
  runtime.state.active = null;
  toast('تعذّر حفظ بداية الجلسة. لم نبدأها؛ جرّب مجددًا.');
  return;
}
runtime.pendingStart = null;
closeDialog();
navigate('session');
}
export function initTimer(){
const a=runtime.state.active;
if(!a)return;
const item=recordSequence(a)[a.cursor];
a.timer=item.seconds?{
remaining:item.seconds*1000,running:false,deadline:0
}
:null;
}
export function renderPlayer(){
if (!reconcileActive()) { main.innerHTML='<p class="notice">تعذّر حفظ إغلاق الجلسة السابقة. جرّب إعادة الفتح بعد التأكد من توفر التخزين.</p>'; return; }
const a=runtime.state.active;
if(!a){
navigate('today');
return;
}
const seq=recordSequence(a),i=seq[a.cursor],e=D.E[i.id];
main.innerHTML=`<div class="session-layout"><div class="player-head"><button class="text-btn" data-action="pause-home">${icon('pause')} حفظ وخروج</button><span class="small muted">${recordTitle(a)}</span></div><div class="session-progress" role="progressbar" aria-label="تقدم الجلسة" aria-valuetext="${a.cursor} من ${seq.length} خطوات" aria-valuenow="${a.cursor}" aria-valuemin="0" aria-valuemax="${seq.length}">${seq.map((step,index)=>`<span class="${index<a.cursor?(a.results[index]==='skip'?'skipped':'complete'):index===a.cursor?'current':''}" aria-hidden="true"></span>`).join('')}</div>${a.mode==='rest'?`<section class="card rest-panel"><span class="pill">استراحة</span><h2 style="margin-top:18px">خذ نفسًا، على مهلك</h2><p>يمكنك تمديد الراحة قبل الحركة التالية.</p><div class="timer-value" id="timer">${timeText(remaining())}</div><div class="timer-controls"><button class="secondary" data-action="timer">${icon(a.timer.running?'pause':'play')} ${a.timer.running?'إيقاف مؤقت':'تشغيل'}</button><button class="secondary" data-action="extend">+ 15 ثانية</button></div><div class="next-preview"><span class="eyebrow">التالي · ${i.phase}${i.round?' · الجولة '+i.round:''}</span><h3>${itemName(i)}</h3><span class="small muted">${i.dose}</span></div><button class="primary full" data-action="end-rest">جاهز، انتقل للتمرين ${icon('arrow')}</button></section>`:`<section class="card player-card"><div class="player-body"><span class="eyebrow">${i.phase}${i.round&&isMain(a.session)?` · الجولة ${i.round} من ${a.rounds}`:''} · الخطوة ${a.cursor+1} من ${seq.length}</span><div class="exercise-heading"><h1>${itemName(i)}</h1><button class="icon-btn" data-exercise="${e.id}" aria-label="طريقة أداء ${e.name}" title="طريقة الأداء">${icon('info')}</button></div>${exerciseImage(e)}<div class="dose"><div><small>الهدف المريح</small><strong>${i.dose}</strong></div><span class="pill">بدون استعجال</span></div>${i.side?'<p class="small muted">خذ وقتك عند تبديل الجهة؛ ابدأ عندما تكون جاهزًا.</p>':''}${i.id==='chest'&&i.seconds===40?'<p class="small muted">أرخِ الذراعين لحظة بين المرتين.</p>':''}${i.seconds?`<div class="timer-value" id="timer">${timeText(remaining())}</div><div class="timer-controls"><button class="secondary" data-action="timer">${icon(a.timer?.running?'pause':'play')} ${a.timer?.running?'إيقاف المؤقّت':'ابدأ المؤقّت'}</button><button class="text-btn" data-action="reset-timer">إعادة الوقت</button></div>`:''}<div class="player-actions"><button class="primary" data-action="done">${icon('check')} ${i.phase==='التمارين'?'أنهيت المجموعة':'أنهيت الخطوة'}</button><button class="text-btn" data-action="skip">تخطّي</button></div><p class="small muted" style="margin-top:12px">إذا زاد الانزعاج، توقف. يمكنك إنهاء الخطوة قبل العدد أو الوقت المستهدف.</p></div></section>`}<div class="button-row" style="margin-top:14px"><button class="text-btn" data-action="stop">إنهاء الجلسة مبكرًا</button></div></div>`;
}
export function advance(result){
if (!reconcileActive()) return;
const a=runtime.state.active;
if(!a||a.mode!=='exercise')return;
pauseTimer();
const beforeAdvance = JSON.parse(JSON.stringify(a));
const seq=recordSequence(a),previous=seq[a.cursor];
a.results[a.cursor]=result;
a.cursor++;
if(a.cursor>=seq.length){
finish('finished', beforeAdvance);
return;
}
const next=seq[a.cursor];
const rest = restBetween(previous, next, recordVersion(a), runtime.state.settings.rest);
if(rest > 0){
a.mode='rest';
a.timer={
remaining:rest*1000,running:true,deadline:Date.now()+rest*1000
}
;
}
else{
a.mode='exercise';
initTimer();
}
save();
renderPlayer();
}
export function finish(status, retryActive = null){
if (!reconcileActive()) return;
const a=runtime.state.active;
if(!a)return;
pauseTimer();
const r={
id:a.id,session:a.session,date:a.date,rounds:a.rounds,planVersion:recordVersion(a),results:a.results.map(v=>v||'skip'),status,note:'',feeling:'',finishedAt:Date.now()
}
;
if (a.scheduledDate) r.scheduledDate = a.scheduledDate;
const previousHistory = runtime.state.history;
if(!runtime.state.history.some(x=>x.id===r.id))runtime.state.history = [...previousHistory, r];
runtime.state.active=null;
if (!save()) {
  runtime.state.history = previousHistory;
  runtime.state.active = retryActive || a;
  renderPlayer();
  toast('تعذّر حفظ نهاية الجلسة. بقيت جلستك مفتوحة لتعيد محاولة الحفظ.');
  return;
}
runtime.view='summary';
location.hash='summary';
summary(r);
}
export function stopPrompt(){
pauseTimer();
showDialog(`${modalHead('إنهاء الجلسة مبكرًا؟')}<p>سنحفظ ما نفّذته ونضع بقية الخطوات كمتخطّاة. لن تُحسب كجلسة مكتملة.</p><div class="button-row" style="margin-top:20px"><button class="secondary" data-action="close">متابعة الجلسة</button><button class="primary" data-action="confirm-stop">إنهاء وحفظ</button></div>`);
}

export function renderStartOptions() {
  const draft = runtime.pendingStart;
  if (!draft) return;
  showDialog(`${modalHead('قبل أن تبدأ')}
    <p class="eyebrow">${D.sessions[draft.id].title}${draft.kind === 'makeup' ? ' · تعويض اختياري' : ''}</p>
    <fieldset class="round-picker"><legend>عدد الجولات لهذه الجلسة</legend>
      <div class="button-row">${[1, 2].map(n => `<button class="${n === draft.rounds ? 'primary' : 'secondary'}" aria-pressed="${n === draft.rounds}" data-session-rounds="${n}">${roundsLabel(n)}</button>`).join('')}</div>
    </fieldset>
    <p class="duration-note" role="status">${durationLabel(draft.id, draft.rounds, D.version, runtime.state.settings.rest)}</p>
    <p class="plan-note">الجولة تعني المرور على التمارين الأساسية مرة واحدة. التسخين والتهدئة مرة واحدة فقط. هذا الاختيار لا يغيّر إعدادك الافتراضي.</p>
    <p class="small muted">ابدأ بجولة للتعرّف على الحركات. يمكنك إنهاء العدّات قبل الهدف إذا احتجت؛ جودة الحركة أولًا.</p>
    <button class="primary full" style="margin-top:18px" data-action="confirm-start">${icon('play')} ابدأ الجلسة</button>`);
}
export function chooseSessionRounds(rounds) {
  if (!runtime.pendingStart || ![1, 2].includes(rounds)) return;
  runtime.pendingStart.rounds = rounds;
  renderStartOptions();
}
export function confirmStart() {
  if (!reconcileActive()) return;
  const draft = runtime.pendingStart;
  if (!draft) return;
  if (draft.date !== dateKey()) {
    runtime.pendingStart = null;
    closeDialog();
    runtime.selected = dateKey();
    navigate('today');
    toast('تغيّر اليوم. راجع جلسة اليوم قبل البدء.');
    return;
  }
  const opportunity = opportunityFor();
  if (!opportunity || opportunity.session !== draft.id || opportunity.scheduledDate !== draft.scheduledDate) {
    runtime.pendingStart = null;
    closeDialog();
    navigate('today');
    toast('تغيّر الجدول أو استحقاق الجلسة. راجع جلسة اليوم.');
    return;
  }
  start(draft.id, draft.rounds);
}
