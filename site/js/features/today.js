import { weekDates, workoutFor, isMain, opportunityFor, occurrenceRecord, performedToday } from './schedule.js';
import { runtime } from '../core/store.js';
import { reconcileActive } from '../core/reconcile.js';
import { D, durationLabel, roundsLabel } from '../data/plans.js';
import { recordVersion, recordSequence, recordTitle } from '../core/records.js';
import { dateKey, parseDay, arDate, dayNames } from '../shared/dates.js';
import { main, icon, esc } from '../shared/ui.js';
import { row } from './exercises.js';

function preview(sequence, rounds) {
  return `<details class="exercise-outline"><summary>تمارين هذه الجلسة</summary>
    <div class="phase"><div class="phase-heading">التسخين</div>${sequence.filter(i => i.phase === 'التسخين').map(row).join('')}</div>
    <div class="phase"><div class="phase-heading">التمارين الأساسية · ${roundsLabel(rounds)}</div>${sequence.filter(i => i.phase === 'التمارين' && i.round === 1).map(row).join('')}</div>
    <div class="phase"><div class="phase-heading">التهدئة</div>${sequence.filter(i => i.phase === 'التهدئة').map(row).join('')}</div>
  </details>`;
}
function recordBadge(record) {
  if (record.closedReason === 'next-session') return 'حُفظ الجزء المنفّذ';
  if (record.status === 'stopped') return 'جلسة مسجّلة · انتهاء مبكر';
  return record.results.includes('skip') ? 'منتهية مع تخطّي' : 'جلسة مكتملة';
}
export function today() {
  reconcileActive();
  const selected = runtime.selected, isToday = selected === dateKey();
  const weeks = weekDates(), planned = workoutFor(selected), active = runtime.state.active;
  const opportunity = isToday ? opportunityFor() : null;
  const actualRecord = isToday ? performedToday() : runtime.state.history.find(r => isMain(r.session) && r.date === selected);
  const slotRecord = planned ? occurrenceRecord(selected, planned) : null;
  const record = actualRecord || slotRecord;
  const showingActive = active && isMain(active.session) && (isToday || active.date === selected);
  const shown = showingActive ? active : record;
  // On a rest day the primary card stays a rest card; makeup is a separate optional action.
  const id = shown ? shown.session : planned;
  let content = '';
  if (id) {
    const rounds = shown ? shown.rounds : runtime.state.settings.rounds;
    const version = shown ? recordVersion(shown) : D.version;
    const sequence = shown ? recordSequence(shown) : D.sequence(id, rounds);
    const title = shown ? recordTitle(shown) : D.sessions[id].title;
    const label = showingActive ? 'جلسة محفوظة' : record ? recordBadge(record) : isToday ? 'جلسة اليوم' : 'معاينة فقط';
    let action = '';
    if (showingActive) action = '<button class="primary" data-action="resume">أكمل الجلسة المحفوظة</button>';
    else if (record) action = `<button class="primary" data-edit="${esc(record.id)}">عرض الجلسة المسجّلة</button>`;
    else if (isToday && opportunity?.session === id) action = `<button class="primary" data-start="${id}">${icon('play')} ابدأ الجلسة</button>`;
    else action = '<p class="start-help">معاينة الجلسة؛ البدء متاح عند استحقاقها.</p>';
    content = `<section class="session-hero main-session"><span class="pill">${label}</span>
      <h2>${title}</h2><p class="eyebrow">${arDate(shown ? shown.date : selected)}</p>
      ${shown?.scheduledDate && shown.scheduledDate !== shown.date ? `<p class="small">تعويض جلسة ${arDate(shown.scheduledDate)}</p>` : ''}
      ${record && record.date !== selected ? '<p class="small">هذه الجلسة مسجّلة لهذا الأسبوع؛ تغيير اليوم لا يكررها.</p>' : ''}
      <div class="hero-meta"><span>${icon('clock')} ${durationLabel(id, rounds, version, runtime.state.settings.rest)}</span><span>${roundsLabel(rounds)}</span><span>راحة ${runtime.state.settings.rest} ثانية</span></div>
      ${action}${preview(sequence, rounds)}</section>`;
  } else {
    content = `<section class="card rest-day"><span class="pill">${isToday ? 'اليوم راحة' : 'يوم راحة · معاينة'}</span>
      <h2>يوم راحة</h2><p class="eyebrow">${arDate(selected)}</p><p>حركات خفيفة إن أحببت.</p>
      ${isToday ? '<button class="secondary" data-start="mobility">ابدأ الحركات الاختيارية</button>' : ''}
      <div class="optional-moves">${D.sessions.mobility.items.map(row).join('')}</div></section>`;
  }
  if (isToday && opportunity?.kind === 'makeup' && !showingActive) {
    content += `<section class="card makeup-card"><span class="eyebrow">اختياري · دون تراكم</span>
      <h3>تعويض جلسة فائتة</h3><p>${D.sessions[opportunity.session].title} · ${arDate(opportunity.scheduledDate)}</p>
      <p class="small muted">إن ناسبك اليوم يمكنك تنفيذها. عند موعد الجلسة التالية تختفي هذه الفرصة وتتابع جدولك.</p>
      <button class="secondary" data-start="${opportunity.session}">تعويض الجلسة</button></section>`;
  }
  if (active && !showingActive) content += `<section class="card saved-session"><span class="eyebrow">جلسة محفوظة · ${arDate(active.date)}</span><h3>${recordTitle(active)}</h3><button class="secondary" data-action="resume">أكمل الجلسة المحفوظة</button></section>`;
  main.innerHTML = `<div class="home-content"><h1 class="home-title">برنامجي اليومي</h1>
    <section class="weekly-calendar" aria-label="التقويم الأسبوعي"><div class="calendar-head">
      <button class="icon-btn" data-action="prev-week" aria-label="الأسبوع السابق">${icon('arrow')}</button>
      <span>${parseDay(weeks[0]).toLocaleDateString('ar-SY-u-nu-latn', { day: 'numeric', month: 'short' })} — ${parseDay(weeks[6]).toLocaleDateString('ar-SY-u-nu-latn', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
      <button class="icon-btn next-week" data-action="next-week" aria-label="الأسبوع التالي">${icon('arrow')}</button></div>
      <button class="text-btn calendar-today${isToday ? ' is-hidden' : ''}" data-action="current-day" ${isToday ? 'aria-hidden="true" tabindex="-1"' : ''}>العودة لليوم</button>
      <div class="week-strip" aria-label="أيام الأسبوع">${weeks.map((day, index) => {
        const finished = runtime.state.history.some(r => isMain(r.session) && r.date === day && r.status === 'finished' && !r.results.includes('skip'));
        return `<button class="day-button ${selected === day ? 'selected' : ''}" data-day="${day}" aria-pressed="${selected === day}" ${day === dateKey() ? 'aria-current="date"' : ''}><span>${dayNames[index]}</span><b>${parseDay(day).getDate()}</b><span class="day-marker">${finished ? '✓ تم' : workoutFor(day) ? 'تمرين' : 'راحة'}</span></button>`;
      }).join('')}</div></section><div class="day-workout">${content}</div></div>`;
}
