import { parseDay, dateKey } from '../shared/dates.js';
import { runtime } from '../core/store.js';

export const isMain = id => ['A', 'B', 'C'].includes(id);
export const DEFAULT_SCHEDULE = Object.freeze([
  Object.freeze({ day: 0, session: 'A' }),
  Object.freeze({ day: 2, session: 'B' }),
  Object.freeze({ day: 4, session: 'C' })
]);
export function validSchedule(entries) {
  return Array.isArray(entries) && entries.length === 3 &&
    entries.every(e => e && Number.isInteger(e.day) && e.day >= 0 && e.day <= 6 && isMain(e.session)) &&
    new Set(entries.map(e => e.day)).size === 3 && new Set(entries.map(e => e.session)).size === 3;
}
export function shiftDay(day, amount) {
  const d = parseDay(day);
  d.setDate(d.getDate() + amount);
  return dateKey(d);
}
export function weekStart(day) { return shiftDay(day, -parseDay(day).getDay()); }
export function scheduleFor(day = dateKey(), state = runtime.state) {
  const revisions = state.scheduleRevisions || [];
  let entries = DEFAULT_SCHEDULE;
  for (const revision of revisions) {
    if (revision.effectiveFrom > day) break;
    entries = revision.entries;
  }
  return entries;
}
export function workoutFor(day, state = runtime.state) {
  return scheduleFor(day, state).find(e => e.day === parseDay(day).getDay())?.session || null;
}
export function weekDates(day = runtime.selected) {
  const first = weekStart(day);
  return Array.from({ length: 7 }, (_, i) => shiftDay(first, i));
}
export function occurrenceKey(day, session) { return `${weekStart(day)}:${session}`; }
export function recordOccurrence(record) {
  return occurrenceKey(record.scheduledDate || record.date, record.session);
}
export function occurrenceRecord(day, session, state = runtime.state) {
  const key = occurrenceKey(day, session);
  return state.history.find(r => isMain(r.session) && recordOccurrence(r) === key) || null;
}
export function performedToday(day = dateKey(), state = runtime.state) {
  // Any closed main session reserves this day. Deleting a record is an explicit separate action.
  return state.history.find(r => isMain(r.session) && (r.date === day || (r.closedReason !== 'next-session' && dateKey(new Date(r.finishedAt)) === day))) || null;
}
export function nextScheduledDay(after, state = runtime.state) {
  // A revision may be effective today; walk dates rather than weekday offsets.
  for (let i = 1; i <= 14; i++) {
    const day = shiftDay(after, i);
    const session = workoutFor(day, state);
    if (session) return { date: day, session };
  }
  return null;
}
export function activeExpiry(active = runtime.state.active, state = runtime.state) {
  if (!active) return null;
  return nextScheduledDay(active.scheduledDate || active.date, state)?.date || null;
}
export function activeIsExpired(day = dateKey(), state = runtime.state) {
  const expiry = activeExpiry(state.active, state);
  return Boolean(expiry && day >= expiry);
}
export function opportunityFor(day = dateKey(), state = runtime.state) {
  if (performedToday(day, state)) return null;
  const session = workoutFor(day, state);
  if (session) {
    // A scheduled day never offers an older missed workout, even if today's slot is already fulfilled.
    return occurrenceRecord(day, session, state) ? null : { session, scheduledDate: day, kind: 'scheduled' };
  }
  for (let i = 1; i <= 7; i++) {
    const previous = shiftDay(day, -i);
    const missed = workoutFor(previous, state);
    if (!missed) continue;
    if (occurrenceRecord(previous, missed, state)) return null;
    return { session: missed, scheduledDate: previous, kind: 'makeup' };
  }
  return null;
}
export function consecutiveDays(entries) {
  const days = new Set(entries.map(e => e.day));
  return entries.some(e => days.has((e.day + 1) % 7));
}
