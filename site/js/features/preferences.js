import { runtime } from '../core/store.js';
import { save } from '../core/storage.js';
import { settings } from './settings.js';
import { render } from '../core/router.js';
import { $, toast } from '../shared/ui.js';
import { prepareSound, ringTimer } from './timer.js';
import { palettes } from '../data/palettes.js';
export { palettes } from '../data/palettes.js';
export const sounds = [['chime','رنين متدرّج'],['bell','جرس'],['pulse','نبضتان'],['soft','نغمة هادئة'],['rise','إشراقة'],['silent','بدون صوت']];
export function applyPalette(){document.documentElement.dataset.palette=runtime.state.settings.palette;}
export function preferencesSection(){
 const s=runtime.state.settings;
 return `<section class="setting-block"><h3>وقت الاستراحة</h3><p>بين التمارين الأساسية · دقيقة ثابتة بين الجولتين.</p><div class="rest-choices" aria-label="وقت الاستراحة بالثواني">${[20,25,30,35,40,45,50,55,60].map(n=>`<button class="choice" data-preference="rest" data-value="${n}" aria-pressed="${s.rest===n}">${n}<small> ثانية</small></button>`).join('')}</div></section>
 <section class="setting-block"><h3>نغمة المؤقّت</h3><p>اختر نغمة لسماعها. يعمل التنبيه أثناء بقاء الصفحة ظاهرة.</p><div class="sound-choices">${sounds.map(([id,name])=>`<button class="choice" data-preference="sound" data-value="${id}" aria-pressed="${s.sound===id}">${name}</button>`).join('')}</div><button class="text-btn" data-action="test-sound">إعادة الاستماع</button></section>
 <section class="setting-block"><h3>ألوان التطبيق</h3><p>تُطبّق مباشرة في الوضعين الفاتح والداكن.</p><div class="palette-choices">${palettes.map(([id,name,base,accent])=>`<button class="choice palette-choice" data-preference="palette" data-value="${id}" aria-pressed="${s.palette===id}"><span class="swatches" aria-hidden="true"><i style="background:${base}"></i><i style="background:${accent}"></i></span><span class="palette-name">${name}</span><span class="palette-check" aria-hidden="true">${s.palette===id?'✓':''}</span></button>`).join('')}</div></section>`;
}
export async function setPreference(key,value){
 if(key==='rest')value=Number(value);
 if(!((key==='rest'&&[20,25,30,35,40,45,50,55,60].includes(value))||(key==='palette'&&palettes.some(p=>p[0]===value))||(key==='sound'&&sounds.some(p=>p[0]===value))))return;
 const previous=runtime.state.settings[key];runtime.state.settings[key]=value;
 if(!save()){runtime.state.settings[key]=previous;toast('تعذّر الحفظ؛ بقي اختيارك السابق.');return;}
 const scroll=$('#modal').scrollTop;
 applyPalette();render();settings();$('#modal').scrollTop=scroll;
 $(`[data-preference="${key}"][data-value="${value}"]`)?.focus({preventScroll:true});
 if(key==='sound'&&value!=='silent'&&(!(await prepareSound())||!ringTimer()))toast('تعذّر تشغيل الصوت في هذا المتصفح.');
}
