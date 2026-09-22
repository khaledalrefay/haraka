import { recordTitle } from '../core/records.js';
import { $, main, icon, esc, toast } from '../shared/ui.js';
import { arDate, dateKey } from '../shared/dates.js';
import { D } from '../data/plans.js';
import { runtime } from '../core/store.js';
import { save } from '../core/storage.js';
import { nextScheduledDay, occurrenceRecord } from './schedule.js';

export const EFFORT_LABELS = Object.freeze({ light: 'خفيف', suitable: 'مناسب', high: 'مرتفع' });
export const FEELING_LABELS = Object.freeze({ comfortable: 'أريح', same: 'نفس الشعور', uncomfortable: 'انزعاج أكثر' });
export function effortForm(record) {
  return `<fieldset class="effort-field"><legend>كيف كان الجهد؟ <span class="muted small">اختياري</span></legend>
    <div class="effort-options">${Object.entries(EFFORT_LABELS).map(([value, label]) => `<button type="button" class="effort-option ${record.effort === value ? 'is-selected' : ''}" data-effort-record="${esc(record.id)}" data-effort="${value}" aria-pressed="${record.effort === value}">${label}</button>`).join('')}</div>
    <button type="button" class="text-btn effort-clear" data-effort-record="${esc(record.id)}" data-effort="" ${record.effort ? '' : 'hidden'}>إزالة التقييم</button>
    <p class="small muted" id="effort-status" role="status">${record.effort ? 'التقييم محفوظ' : 'يمكنك المتابعة دون تقييم'}</p>
  </fieldset>`;
}
export function saveEffort(id, value) {
  if (value !== '' && !Object.hasOwn(EFFORT_LABELS, value)) return false;
  const record = runtime.state.history.find(r => r.id === id);
  if (!record) return false;
  const previous = record.effort;
  record.effort = value;
  if (!save()) {
    if (previous === undefined) delete record.effort;
    else record.effort = previous;
    toast('تعذّر حفظ تقييم الجهد. حاول مجددًا.');
    return false;
  }
  document.querySelectorAll('[data-effort-record]').forEach(button => {
    if (button.dataset.effortRecord !== id) return;
    if (button.dataset.effort === '') button.hidden = !value;
    else {
      const selected = button.dataset.effort === value;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    }
  });
  const status = $('#effort-status');
  if (status) status.textContent = value ? 'حُفظ تقييم الجهد' : 'أُزيل التقييم';
  return true;
}
export function nextWorkout() {
  let after = dateKey();
  for (let i = 0; i < 7; i++) {
    const next = nextScheduledDay(after);
    if (!next) return null;
    if (!occurrenceRecord(next.date, next.session)) return next;
    after = next.date;
  }
  return null;
}
export function summary(record) {
  $('.bottom-nav').hidden = false;
  const complete = record.status === 'finished' && !record.results.includes('skip');
  const next = nextWorkout();
  const heading = complete ? 'تمّت الجلسة، يعطيك العافية!' : record.status === 'finished' ? 'انتهت الجلسة، وحفظنا ما أنجزته' : 'حفظنا اللي أنجزته اليوم';
  main.innerHTML = `<div class="session-layout"><section class="card completion-card ${complete ? 'is-complete' : 'is-partial'}">
    <div class="completion-hero"><div class="completion-emblem" aria-hidden="true">${icon(complete ? 'check' : 'book')}<span class="completion-halo"></span></div>
      <p class="eyebrow">${arDate(record.date)}</p><h1>${heading}</h1><p class="completion-session">${esc(recordTitle(record))}</p>
      <p class="muted">${complete ? 'خطوة لطيفة ضمن يومك. خذ راحتك الآن.' : 'تقدر تتابع مع موعدك القادم، على مهلك.'}</p>
    </div>
    ${next ? `<div class="next-session-card"><span class="eyebrow">الجلسة القادمة</span><strong>${esc(D.sessions[next.session].title)}</strong><p>${arDate(next.date)}</p></div>` : ''}
    ${effortForm(record)}
    <button class="primary full" data-action="home">رجوع للرئيسية ${icon('arrow')}</button>
    <p class="small muted completion-saved">الجلسة محفوظة. تقييم الجهد اختياري ولا يغيّر الخطة تلقائيًا.</p>
  </section></div>`;
}
export function noteForm(record) {
  return `${effortForm(record)}
    ${record.feeling ? `<p class="small muted">الشعور المسجّل سابقًا: ${FEELING_LABELS[record.feeling] || ''}</p>` : ''}
    <div class="form-field"><label for="session-note">ملاحظة لنفسك <span class="muted">(اختيارية)</span></label>
      <textarea id="session-note" maxlength="2000" placeholder="ملاحظة تحب ترجع إلها لاحقًا">${esc(record.note)}</textarea></div>`;
}
