import { todayKey } from "../domain/schedule.mjs";
import { button, esc } from './html.mjs';
import { names, levelName, sessionName } from '../data/program-labels.mjs';
import { icon } from './icons.mjs';
export const executionDate = r => r.completedDate || (r.finishedAt ? todayKey(new Date(r.finishedAt)) : r.dateKey);
export function renderHistory(history, month, hidden) {
 const rows = history.filter(r=>!r.hidden && executionDate(r).startsWith(month)).sort((a,b)=>b.finishedAt-a.finishedAt);
 return `<h1 class="v-space">سجلّي</h1><div class="v-month-nav">${button('→','history-prev','icon-btn','aria-label="الشهر السابق"')}<label>الشهر<input type="month" id="history-month" value="${month}"></label>${button('←','history-next','icon-btn','aria-label="الشهر التالي"')}</div><p class="small muted v-space">${rows.length} جلسة هذا الشهر</p>${rows.length ? rows.map(r=>{const w=r.snapshot.workout;return `<article class="card record v-compact-record"><div><h3>${esc(sessionName(w.program,w.session))}</h3><small>${executionDate(r)}</small><p class="small muted">${names[w.program]} · ${levelName(w.level)} · ${r.status==='completed'?'مكتملة':'انتهاء مبكر'}</p></div><div class="v-record-actions">${button(icon('info'),'record','icon-btn',`data-id="${esc(r.id)}" aria-label="تفاصيل الجلسة"`)}${button(icon('trash'),'delete-record','icon-btn v-delete',`data-id="${esc(r.id)}" aria-label="حذف الجلسة"`)}</div></article>`}).join('') : '<section class="card empty"><p>لا توجد جلسات مسجّلة في هذا الشهر.</p></section>'}${hidden}`;
}
