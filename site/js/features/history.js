import { recordTitle } from '../core/records.js';
import {
runtime
}
from '../core/store.js';
import {
main, icon, esc, showDialog, modalHead, closeDialog, toast, modal
}
from '../shared/ui.js';
import {
isMain
}
from './schedule.js';
import {
arDate
}
from '../shared/dates.js';
import {
D
}
from '../data/plans.js';
import {
noteForm, EFFORT_LABELS, FEELING_LABELS
}
from './completion.js';
import {
navigate
}
from '../core/router.js';
import {
save
}
from '../core/storage.js';
export function history(){
const h=[...runtime.state.history].sort((a,b)=>b.finishedAt-a.finishedAt);
main.innerHTML=`<div class="page-head"><div><span class="eyebrow">خطوة بخطوة</span><h1>سجلّي</h1></div><button class="secondary" data-action="export">${icon('download')} نسخة احتياطية</button></div>${h.length?`${h.map(r=>`<article class="card record"><div class="record-main"><span class="record-date">${arDate(r.date)}</span><h3>${recordTitle(r)}</h3>${r.scheduledDate&&r.scheduledDate!==r.date?`<p class="small muted">تعويض جلسة ${arDate(r.scheduledDate)}</p>`:''}<div class="summary-mini"><span>${r.closedReason==='next-session'?'حُفظ الجزء المنفّذ عند استحقاق جلسة جديدة':r.status==='stopped'?'توقفت مبكرًا':r.results.includes('skip')?'انتهت مع تخطّي بعض الخطوات':'مكتملة'}</span><span>${r.results.filter(x=>x==='done').length.toLocaleString('en-US')} / ${r.results.length.toLocaleString('en-US')} خطوة</span><span>${r.effort ? 'الجهد: '+EFFORT_LABELS[r.effort] : ''}${r.feeling ? ' · الشعور السابق: '+FEELING_LABELS[r.feeling] : ''}</span></div>${r.note?`<p style="margin-top:12px">${esc(r.note)}</p>`:''}</div><div class="record-actions"><button class="icon-btn" data-edit="${esc(r.id)}" aria-label="تعديل ملاحظة الجلسة">${icon('book')}</button><button class="text-btn danger" data-delete="${esc(r.id)}" aria-label="حذف جلسة ${esc(recordTitle(r))} بتاريخ ${arDate(r.date)}">حذف</button></div></article>`).join('')}`:`<div class="card empty">${icon('history')}<h2>رحلتك تبدأ من أول جلسة</h2><p>الجلسات والملاحظات ستظهر هنا، وتبقى محفوظة على هذا المتصفح.</p><button class="primary" data-action="home">عرض برنامجي</button></div>`}`;
}
export function editRecord(id){
const r=runtime.state.history.find(x=>x.id===id);
if(!r)return;
showDialog(`${modalHead(recordTitle(r))}<p class="eyebrow">${arDate(r.date)}</p>${noteForm(r)}<button class="primary full" data-save-note="${esc(id)}">حفظ الملاحظة</button>`);
}
export function deletePrompt(id){
const r=runtime.state.history.find(r=>r.id===id);
if(!r)return;
showDialog(`${modalHead('حذف الجلسة؟')}<p>${esc(recordTitle(r))} · ${arDate(r.date)}</p><p class="plan-note">ستُحذف الجلسة وملاحظتها من السجل. لا يمكن التراجع عن الحذف.</p><div class="button-row"><button class="secondary" data-action="close">إلغاء</button><button class="primary" data-confirm-delete="${esc(id)}">حذف الجلسة</button></div>`);
}
export function deleteRecord(id){
const previous=runtime.state.history;
if(!previous.some(r=>r.id===id)){
closeDialog();
navigate('history');
return;
}
runtime.state.history=previous.filter(r=>r.id!==id);
if(!save()){
runtime.state.history=previous;
toast('تعذّر حفظ الحذف. بقيت الجلسة في السجل.');
return;
}
closeDialog();
navigate('history');
toast('تم حذف الجلسة');
}
export function saveNote(id){
const r=runtime.state.history.find(x=>x.id===id);
if(!r)return;
const root=modal.open?modal:main;
const previous = r.note;
r.note=root.querySelector('#session-note').value.trim();
if (!save()) { r.note = previous; toast('تعذّر حفظ الملاحظة. حاول مجددًا.'); return; }
if(modal.open)closeDialog();
navigate('history');
toast('تم حفظ الملاحظة');
}
