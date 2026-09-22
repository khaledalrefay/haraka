import { paletteIds } from '../data/palettes.js';
import { validSchedule } from '../features/schedule.js';
import {
recordVersion, recordSequence
}
from './records.js';
import {
D
}
from '../data/plans.js';
import {
validDate
}
from '../shared/dates.js';
import {
finite, KEY, runtime
}
from './store.js';
import {
warn
}
from '../shared/ui.js';
export function validRecord(r){
return r&&(r.effort===undefined||['','light','suitable','high'].includes(r.effort))&&validSchedulingFields(r)&&[3].includes(recordVersion(r))&&typeof r.id==='string'&&r.id.length<100&&D.sessions[r.session]&&validDate(r.date)&&[1,2].includes(r.rounds)&&Array.isArray(r.results)&&r.results.length===recordSequence(r).length&&r.results.every(v=>['done','skip'].includes(v))&&typeof r.note==='string'&&r.note.length<=2000&&['','comfortable','same','uncomfortable'].includes(r.feeling)&&finite(r.finishedAt)&&['finished','stopped'].includes(r.status);
}
function validSchedulingFields(r) {
  return (r.scheduledDate === undefined || (validDate(r.scheduledDate) && r.scheduledDate <= r.date)) &&
    (r.closedReason === undefined || (r.closedReason === 'next-session' && r.status === 'stopped'));
}
function validRevisions(revisions) {
  return revisions === undefined || (Array.isArray(revisions) && revisions.length <= 10000 &&
    revisions.every((r, i) => r && validDate(r.effectiveFrom) && validSchedule(r.entries) &&
      (i === 0 || revisions[i - 1].effectiveFrom < r.effectiveFrom)));
}
export function validate(x){
if (!x || !validRevisions(x.scheduleRevisions)) return false;
if(!x||x.schema!==2||!x.settings||![1,2].includes(x.settings.rounds)||![20,25,30,35,40,45,50,55,60].includes(x.settings.rest)||!paletteIds.includes(x.settings.palette)||!["chime","bell","pulse","soft","rise","silent"].includes(x.settings.sound)||!Array.isArray(x.history)||x.history.length>10000||!x.history.every(validRecord))return false;
if(new Set(x.history.map(r=>r.id)).size!==x.history.length)return false;
const a=x.active;
if(a!==null){
if(!a||!validSchedulingFields(a)||![3].includes(recordVersion(a))||typeof a.id!=='string'||a.id.length>100||!D.sessions[a.session]||!validDate(a.date)||![1,2].includes(a.rounds)||!Number.isInteger(a.cursor)||!finite(a.startedAt)||!Array.isArray(a.results)||a.results.length!==recordSequence(a).length||a.cursor<0||a.cursor>=a.results.length||!a.results.every((v,i)=>i<a.cursor?['done','skip'].includes(v):v===null)||!['exercise','rest'].includes(a.mode))return false;
if(a.timer!==null&&(!a.timer||!finite(a.timer.remaining)||a.timer.remaining<0||a.timer.remaining>3600000||typeof a.timer.running!=='boolean'||!finite(a.timer.deadline)))return false;
}
return true;
}
export function loadStorage(){
try{
const raw=localStorage.getItem(KEY);
// Experimental records are intentionally retired for the first public release.
localStorage.removeItem('haraka-data-v1');
if(raw){
const x=JSON.parse(raw);
if(!validate(x))throw Error('invalid');
runtime.state=x;
}
if(runtime.state.active?.timer){
runtime.state.active.timer.running=false;
runtime.state.active.timer.deadline=0;
}
}
catch(e){
runtime.storageBroken=true;
try{
runtime.rawBroken=localStorage.getItem(KEY)
}
catch{
}
warn('تعذّر قراءة الحفظ المحلي. لم نغيّر بياناتك السابقة. صدّر نسخة من الإعدادات قبل استعادة نسخة سليمة.');
}
}
export function save(){
if(runtime.storageBroken)return false;
try{
localStorage.setItem(KEY,JSON.stringify(runtime.state));
if (window.dispatchEvent) window.dispatchEvent(new Event('haraka-state-saved'));
return true;
}
catch{
warn('تعذّر حفظ التقدم على الجهاز. صدّر نسخة احتياطية الآن؛ قد يكون التخزين ممتلئًا أو محظورًا.');
return false;
}
}
// Validate and persist before replacing the in-memory state.
export function restoreData(data) {
if (!validate(data)) throw new Error('Invalid backup');
localStorage.setItem(KEY, JSON.stringify(data));
runtime.state = data;
runtime.storageBroken = false;
runtime.rawBroken = null;
if (window.dispatchEvent) window.dispatchEvent(new Event('haraka-state-saved'));
}
