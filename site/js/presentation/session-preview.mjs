import { esc, button, movementName, goal } from './html.mjs';
import { pageHeading } from './page-heading.mjs';
import { names, levelName, sessionName } from '../data/program-labels.mjs';
import { estimates } from '../data/estimates.mjs';
const phases = {warmup:['الإحماء','بداية هادئة وتجهيز للحركة'],main:['التمارين','القسم الرئيسي من الجلسة'],strength:['القوة','مجموعات التمارين بالترتيب'],aerobic:['الحركة الهوائية','تسلسل الحركة والإيقاع'],cooldown:['التهدئة','ختام هادئ للجلسة']};
const pace = {gentle:'إيقاع هادئ',progressive:'ارفع الإيقاع تدريجيًا',active:'إيقاع نشيط يسمح بالكلام',slow:'إيقاع بطيء',decelerating:'خفّف الإيقاع تدريجيًا'};
const clock = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
export function renderSessionPreview(snapshot) {
 const w=snapshot.workout,work=snapshot.steps.filter(s=>s.type==='work');
 const blocks=[];for(const step of snapshot.steps){if(blocks.at(-1)?.id!==step.block)blocks.push({id:step.block,steps:[]});blocks.at(-1).steps.push(step);}
 let number=0;
 const type = {move:'حركة متنوعة',foundation:'تمارين بمجموعات',strength:'قوة بمجموعات',hybrid:'قوة ثم حركة هوائية',circuit:'محطات ضمن دورتين'}[w.program];
 return `<section class="v-session-preview">${pageHeading('معاينة الجلسة',button('رجوع','preview-back','text-btn'))}<div class="v-preview-intro"><span class="eyebrow">${names[w.program]} · ${levelName(w.level)}</span><h2>${esc(sessionName(w.program,w.session))}</h2><div class="v-preview-stats"><span>${estimates[w.id].join('–')} دقيقة تقديريًا</span><span>${new Set(work.map(s=>s.exerciseId)).size} تمارين مختلفة</span><span>${type}</span></div><p class="small muted">المدة تشمل الاستراحات وتتغير حسب سرعة الأداء وتمديد الوقت.</p></div><div class="v-flow">${blocks.map((block,index)=>{
 const [title,description]=phases[block.id]||phases.main;let round=0;
 return `<section class="v-flow-phase phase-${block.id}"><header class="v-flow-phase-head"><span class="v-phase-number">${String(index+1).padStart(2,'0')}</span><div><h2>${title}</h2><p>${description}</p></div></header><ol class="v-flow-steps">${block.steps.map(s=>{
 if(s.type==='rest')return `<li class="v-flow-rest" data-step-id="${esc(s.id)}"><span class="v-flow-dot" aria-hidden="true"></span><span>${clock}راحة · ${s.seconds} ثانية${s.reason==='side_switch'?' · تبديل الجهة':''}</span></li>`;
 const e=snapshot.exercises[s.exerciseId];let divider='';if(s.round && s.round!==round){round=s.round;divider=`<li class="v-flow-divider">الدورة ${s.round} من ${s.rounds}</li>`;}
 const notes=[s.side?`${e.counting.side_means||'الجهة'}: ${s.side==='right'?'يمين':'يسار'}`:'',s.sides===2?'بالتبادل · كل جهة تُحسب منفردة':'',s.pauseSeconds?`توقف ${s.pauseSeconds} ثانية داخل كل عدّة`:'',pace[s.pace]||''].filter(Boolean);
 return `${divider}<li class="v-flow-work" data-step-id="${esc(s.id)}"><span class="v-flow-node" aria-hidden="true">${++number}</span><article><div class="v-flow-meta">${s.round?`المحطة ${s.station} من ${s.stations}`:s.set?`المجموعة ${s.set} من ${s.sets}`:'تمرين'}</div><h3>${esc(movementName(s,snapshot.exercises))}</h3><span class="v-flow-goal">${goal(s)}</span>${notes.length?`<p class="v-flow-notes">${notes.map(esc).join(' · ')}</p>`:''}</article></li>`;
 }).join('')}</ol></section>`;
 }).join('')}<div class="v-flow-end"><span aria-hidden="true">✓</span><strong>نهاية الجلسة</strong></div></div></section>`;
}
