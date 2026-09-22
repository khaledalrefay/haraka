import { runtime } from '../core/store.js';
import { save } from '../core/storage.js';
import { reconcileActive } from '../core/reconcile.js';
import { dateKey, dayNames } from '../shared/dates.js';
import { $, showDialog, modalHead, closeDialog, toast } from '../shared/ui.js';
import { D } from '../data/plans.js';
import { validSchedule, scheduleFor, consecutiveDays } from './schedule.js';
import { pauseTimer } from './timer.js';
import { render } from '../core/router.js';

export function editSchedule() {
  pauseTimer();
  runtime.scheduleDraft = scheduleFor().map(entry => ({ ...entry }));
  renderScheduleEditor();
}
export function renderScheduleEditor(error = '') {
  const entries = runtime.scheduleDraft;
  if (!entries) return;
  const sorted = [...entries].sort((a, b) => a.day - b.day);
  showDialog(`${modalHead('أيام التدريب وترتيب الجلسات')}
    <p class="plan-note">اضغط على يوم لكل جلسة. اختيار يوم مشغول يبدّل موعد الجلستين تلقائيًا.</p>
    ${['A', 'B', 'C'].map(id => `<fieldset class="schedule-session"><legend>${id} · ${D.sessions[id].title}</legend>
      <div class="day-choices">${dayNames.map((name, day) => `<button class="choice" data-schedule-session="${id}" data-schedule-day="${day}" aria-pressed="${entries.find(e => e.session === id).day === day}">${name}</button>`).join('')}</div></fieldset>`).join('')}
    <p class="schedule-preview">${sorted.map(e => `${dayNames[e.day]}: ${e.session}`).join(' · ')}</p>
    ${consecutiveDays(entries) ? '<p class="plan-note">اختر يوم راحة بين الجلسات قدر الإمكان؛ جدولك الحالي يتضمن يومين متتاليين.</p>' : ''}
    <p class="small muted">يسري التغيير من اليوم ضمن الأسبوع الحالي. تبقى سجلات الأيام السابقة محفوظة، ولا تتكرر جلسة سجّلتها لهذا الأسبوع بعد نقل يومها.</p>
    ${error ? `<p class="notice" role="alert">${error}</p>` : ''}
    <div class="button-row" style="margin-top:18px"><button class="secondary" data-action="close">إلغاء</button><button class="primary" data-action="save-schedule">حفظ الجدول</button></div>`);
}
export function changeScheduleDay(session, day) {
  if (!runtime.scheduleDraft || !['A', 'B', 'C'].includes(session) || !Number.isInteger(day) || day < 0 || day > 6) return;
  const selected = runtime.scheduleDraft.find(entry => entry.session === session);
  const occupied = runtime.scheduleDraft.find(entry => entry.day === day && entry.session !== session);
  if (occupied) occupied.day = selected.day;
  selected.day = day;
  renderScheduleEditor();
  $(`[data-schedule-session="${session}"][data-schedule-day="${day}"]`)?.focus();
}
export function saveSchedule() {
  const entries = runtime.scheduleDraft;
  if (!validSchedule(entries)) {
    renderScheduleEditor('اختر 3 أيام مختلفة؛ كل جلسة لها يوم مستقل.');
    return false;
  }
  if (runtime.storageBroken || !reconcileActive()) {
    renderScheduleEditor('تعذّر حفظ البيانات الحالية. لم نغيّر الجدول.');
    return false;
  }
  const previous = runtime.state;
  const next = JSON.parse(JSON.stringify(previous));
  const day = dateKey();
  next.scheduleRevisions = (next.scheduleRevisions || []).filter(revision => revision.effectiveFrom !== day);
  next.scheduleRevisions.push({ effectiveFrom: day, entries: [...entries].map(e => ({ ...e })).sort((a, b) => a.day - b.day) });
  next.scheduleRevisions.sort((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom));
  runtime.state = next;
  reconcileActive(day, false);
  if (!save()) {
    runtime.state = previous;
    renderScheduleEditor('تعذّر حفظ الجدول. بقي جدولك السابق.');
    return false;
  }
  runtime.pendingStart = null;
  runtime.scheduleDraft = null;
  closeDialog();
  render();
  toast('حُفظ الجدول وبدأ تطبيقه من اليوم.');
  return true;
}
