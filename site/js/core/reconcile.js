import { runtime } from './store.js';
import { dateKey } from '../shared/dates.js';
import { recordVersion } from './records.js';
import { activeIsExpired } from '../features/schedule.js';
import { save } from './storage.js';

// No background clock is required. Reconcile on startup, return, midnight and schedule changes.
// Keep mutation and persistence atomic: a failed write leaves the active session intact.
export function reconcileActive(day = dateKey(), persist = true) {
  const active = runtime.state.active;
  if (!active || !activeIsExpired(day)) return true;
  const previousHistory = runtime.state.history;
  const record = {
    id: active.id, session: active.session, date: active.date, rounds: active.rounds,
    planVersion: recordVersion(active), results: active.results.map(result => result || 'skip'),
    status: 'stopped', note: '', feeling: '', finishedAt: Date.now(), closedReason: 'next-session'
  };
  if (active.scheduledDate) record.scheduledDate = active.scheduledDate;
  runtime.state.history = previousHistory.some(r => r.id === record.id) ? previousHistory : [...previousHistory, record];
  runtime.state.active = null;
  if (persist && !save()) {
    runtime.state.history = previousHistory;
    runtime.state.active = active;
    return false;
  }
  runtime.pendingStart = null;
  return true;
}
