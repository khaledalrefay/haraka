import { content } from '../data/content.mjs';
import { names, descriptions, levelText, levelName, sessionName } from '../data/program-labels.mjs';
import { esc, button } from './html.mjs';
const exercises = Object.fromEntries(content.exercises.map(e => [e.id,e]));
export function renderProgramDetails(program, level, heading) {
 return `<section class="v-program-details" data-program-id="${program}"><div class="v-details-sticky">${heading(names[program])}<div class="v-level-tabs" role="tablist" aria-label="المستوى">${[1,2,3].map(n=>`<button id="level-tab-${n}" role="tab" aria-selected="${n===level}" aria-controls="level-panel" tabindex="${n===level?0:-1}" data-action="detail-level" data-id="${program}" data-level-id="${n}">${levelName(n)}</button>`).join('')}</div></div><div role="tabpanel" id="level-panel" aria-labelledby="level-tab-${level}" tabindex="0"><p class="muted v-space">${descriptions[program]}</p><p class="v-level-description">${levelText[program][level-1]}</p>${['A','B','C'].map(letter=>{
 const w=content.workouts.find(w=>w.id===`${program}-${letter.toLowerCase()}-${level}`);
 return `<section class="v-detail-session"><h3>${sessionName(program,letter)}</h3>${w.blocks.filter(b=>!['warmup','cooldown'].includes(b.id)).map(b=>`<p class="pill">${b.kind==='repeat'?'دورتان':b.id==='strength'?'القوة':'التمارين'}</p><div class="v-detail-exercises">${b.items.filter(x=>x.exercise_id).map(x=>`<div class="v-detail-exercise"><strong data-fit-title>${esc(exercises[x.exercise_id].name_ar)}</strong><small>${x.target} ${x.unit==='seconds'?'ثانية':x.unit==='cycles'?'دورات':'عدّات'}${x.sides===2?' لكل جهة':''}${x.sets>1?` · ${x.sets} مجموعات`:''}${x.pause_seconds?` · توقف ${x.pause_seconds}ث`:''}</small></div>`).join('')}</div>`).join('')}${button('التسلسل الكامل','preview','secondary full',`data-workout="${w.id}"`)}</section>`;
 }).join('')}</div>${button('كل البرامج','preview-all','text-btn')}</section>`;
}
