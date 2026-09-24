import { icon } from "./icons.mjs";
import { executionDate } from "../domain/schedule.mjs";
import { pageHeading } from './page-heading.mjs';
import { esc, button } from './html.mjs';
import { names, levelName, sessionName } from '../data/program-labels.mjs';
import { todayKey, shift, weekday, slotFor, opportunity, days } from '../domain/schedule.mjs';
import { estimates } from '../data/estimates.mjs';
export function renderHome({settings, selected, active, history}) {
  const t = todayKey(), start = shift(selected, -weekday(selected)), current = slotFor(settings, selected), offer = selected === t ? opportunity(settings, history, t) : null, record = history.find((r) => r.dateKey === selected || r.completedDate === selected);
  const chosen = active && selected === t ? { workoutId: active.snapshot.workout.id, session: active.snapshot.workout.session, program: active.snapshot.workout.program, level: active.snapshot.workout.level } : offer || current;
  const makeup = offer?.kind === 'makeup' && !active;
  const pending=settings.revisions.find(r=>r.effectiveFrom>t);
  let card;
  if (active && selected === t) card = `<span class="pill">جلسة محفوظة</span><h2>${sessionName(chosen.program, chosen.session)}</h2><p>${names[chosen.program]} · ${levelName(chosen.level)}</p>${button("أكمل جلستك", "resume", "primary")}`;
  else if (record) card = `<span class="pill">${record.status === "completed" ? "جلسة منتهية" : "انتهاء مبكر"}</span><h2>${sessionName(record.snapshot.workout.program, record.snapshot.workout.session)}</h2><p>${names[record.snapshot.workout.program]} · ${levelName(record.snapshot.workout.level)}</p>${record.hidden ? `<p>هذه الجلسة مخفية، وما زال موعدها محجوزًا.</p>${button("حذف الجلسة وإتاحة الموعد", "delete-record", "secondary", `data-id="${esc(record.id)}"`)}` : button("عرض السجل", "record", "primary", `data-id="${esc(record.id)}"`)}`;
  else if (chosen && !makeup) card = `<span class="pill">${offer?.kind === "makeup" ? "تعويض جلسة فائتة" : selected === t ? "جلسة اليوم" : "معاينة"}</span><h2>${sessionName(chosen.program, chosen.session)}</h2><p>${names[chosen.program]} · ${levelName(chosen.level)}</p><p class="v-space small">${estimates[chosen.workoutId].join("–")} دقيقة تقديريًا</p>${offer ? button("ابدأ الجلسة", "start", "primary", `data-workout="${chosen.workoutId}"`) : ""}${button("معاينة التمارين", "preview", "secondary", `data-workout="${chosen.workoutId}"`)}`;
  else card = '<span class="pill">يوم راحة</span><h2>مساحة للراحة</h2><p>ستظهر جلستك عند موعدها القادم.</p>';
  return `<div class="home-content">${pageHeading("برنامجي اليومي")}<section class="weekly-calendar"><div class="v-calendar-head">${button("→", "prev-week", "icon-btn", 'aria-label="الأسبوع السابق"')}${selected !== t ? button("العودة لليوم", "today", "text-btn") : `<span>${esc(start)} — ${esc(shift(start, 6))}</span>`}${button("←", "next-week", "icon-btn", 'aria-label="الأسبوع التالي"')}</div><div class="week-strip">${Array.from({ length: 7 }, (_, i) => {
    const d = shift(start, i);
    const completed = history.some(r => executionDate(r) === d && r.status === "completed");
    const training = completed || Boolean(slotFor(settings, d));
    return `<button class="day-button ${d === selected ? "selected" : ""}" data-day="${d}" aria-label="${days[i]} ${d} — ${completed ? "تمرين منجز" : training ? "تمرين" : "راحة"}" aria-pressed="${d === selected}"><span>${days[i]}</span><b>${Number(d.slice(-2))}</b><span class="day-marker ${completed ? "is-completed" : ""} ${training ? "" : "is-rest"}">${icon(completed ? "check" : training ? "dumbbell" : "coffee")}</span></button>`;
  }).join("")}</div></section>${makeup ? `<section class="v-makeup-card"><span class="pill">جلسة فائتة متاحة اليوم</span><h2>${sessionName(offer.program,offer.session)}</h2><p>موعدها الأصلي: ${days[weekday(offer.date)]} · ${offer.date}</p>${button('ابدأ تعويض الجلسة','start','primary full',`data-workout="${offer.workoutId}"`)}</section>` : ''}<section class="session-hero v-hero">${card}</section>${pending?`<p class="v-pending-plan">خطة جديدة تبدأ يوم الأحد ${pending.effectiveFrom}</p>`:''}</div>`;
}
