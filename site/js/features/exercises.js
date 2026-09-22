import { exerciseImage } from '../shared/exercise-image.js';
import {
D
}
from '../data/plans.js';
import {
runtime
}
from '../core/store.js';
import {
pauseTimer
}
from './timer.js';
import {
renderPlayer
}
from './workout.js';
import {
main, showDialog, modalHead, $, icon
}
from '../shared/ui.js';
export const itemName = i=>(D.E[i.id]?.name || 'تمرين من خطة سابقة')+(i.side?` — ${i.side}`:'');
export function exerciseDetails(id){
const e=D.E[id];
if(!e)return;
if(runtime.view==='session'){
pauseTimer();
renderPlayer();
main.querySelector('[data-exercise]')?.focus();
}
showDialog(`${modalHead(e.name)}${exerciseImage(e)}<p class="small muted">استخدم المدى المريح لك.</p><p class="eyebrow" dir="ltr">${e.en}</p><ol>${e.steps.map(s=>`<li>${s}</li>`).join('')}</ol><details open><summary>انتبه</summary><p>${e.avoid}</p></details><details open><summary>نسخة أسهل</summary><p>${e.easier}</p></details>`);
}
export function row(i){
const e=D.E[i.id];
return `<button class="exercise-row" aria-haspopup="dialog" data-exercise="${i.id}"><span class="row-text"><strong>${itemName(i)}</strong><small>${i.dose}</small></span><span class="row-help" aria-hidden="true">${icon('arrow')}</span></button>`;
}
export function library(){
main.innerHTML=`<div class="page-head"><div><h1>دليل الحركات</h1></div><span class="pill">${D.exercises.length.toLocaleString('en-US')} حركة</span></div><div class="library-grid">${D.exercises.map(e=>`<button class="exercise-card" aria-haspopup="dialog" data-exercise="${e.id}"><div class="exercise-caption"><span class="eyebrow">${e.area}</span><h3>${e.name}</h3><span class="row-help" aria-hidden="true">${icon('arrow')}</span></div></button>`).join('')}</div>`;
}
