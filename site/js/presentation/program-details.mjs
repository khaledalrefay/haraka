import { renderSessionPreview } from './session-preview.mjs';
import { names, levelName, sessionName } from '../data/program-labels.mjs';
export function renderProgramDetails(snapshot, heading) {
 const {program,level,session}=snapshot.workout;
 const tab=(value,label,kind,selected)=>`<button id="${kind}-tab-${value}" role="tab" aria-selected="${selected}" aria-controls="${kind}-panel" tabindex="${selected?0:-1}" data-action="detail-${kind}" data-id="${program}" data-level-id="${level}" data-session="${session}" data-value="${value}">${label}</button>`;
 return `<section class="v-program-details"><div class="v-details-sticky">${heading(names[program])}<div class="v-level-tabs" role="tablist" aria-label="المستوى">${[1,2,3].map(n=>tab(n,levelName(n),'level',n===level)).join('')}</div><div class="v-level-tabs v-session-tabs" role="tablist" aria-label="الجلسة">${['A','B','C'].map(letter=>tab(letter,sessionName(program,letter),'session',letter===session)).join('')}</div></div><div id="level-panel" role="tabpanel" aria-labelledby="level-tab-${level}"><div id="session-panel" role="tabpanel" aria-labelledby="session-tab-${session}" tabindex="0">${renderSessionPreview(snapshot,{embedded:true})}</div></div></section>`;
}
