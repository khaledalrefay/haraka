export function localClock(now, zone) {
  const values = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(now)).map(p => [p.type, p.value]));
  const date = `${values.year}-${values.month}-${values.day}`;
  return { date, minute: Number(values.hour) * 60 + Number(values.minute), weekday: new Date(`${date}T12:00:00Z`).getUTCDay() };
}
export function occurrence(date, session) {
  const day = new Date(`${date}T12:00:00Z`);
  day.setUTCDate(day.getUTCDate() - day.getUTCDay());
  return `${day.toISOString().slice(0, 10)}:${session}`;
}
export function validPrefs(p) {
  if (!p || typeof p.enabled !== 'boolean' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(p.time || '') || typeof p.timezone !== 'string' || p.timezone.length > 80) return false;
  try { localClock(Date.now(), p.timezone); } catch { return false; }
  if (!Array.isArray(p.entries) || p.entries.length !== 3 || !p.entries.every(e => e && Number.isInteger(e.day) && e.day >= 0 && e.day <= 6 && ['A', 'B', 'C'].includes(e.session)) || new Set(p.entries.map(e => e.day)).size !== 3 || new Set(p.entries.map(e => e.session)).size !== 3) return false;
  if(p.occurrenceMode!==undefined&&p.occurrenceMode!=='date')return false;
  if(p.scheduleRevisions!==undefined&&(!Array.isArray(p.scheduleRevisions)||p.scheduleRevisions.length>50||!p.scheduleRevisions.every((r,i)=>/^\d{4}-\d{2}-\d{2}$/.test(r.effectiveFrom||'')&&(!i||p.scheduleRevisions[i-1].effectiveFrom<r.effectiveFrom)&&validPrefs({...p,entries:r.entries,scheduleRevisions:undefined}))))return false;
  return Array.isArray(p.doneKeys) && p.doneKeys.length <= 100 && p.doneKeys.every(k => /^\d{4}-\d{2}-\d{2}:[ABC]$/.test(k)) && Array.isArray(p.skipDates) && p.skipDates.length <= 10 && p.skipDates.every(d => /^\d{4}-\d{2}-\d{2}$/.test(d));
}
export function dueReminder(p, now) {
  if (!p.enabled) return null;
  const clock = localClock(now, p.timezone);
  const [h, m] = p.time.split(':').map(Number);
  // Catch up within five minutes only, never send a stale workout hours later.
  if (clock.minute < h * 60 + m || clock.minute >= h * 60 + m + 5) return null;
  const entries = p.scheduleRevisions ? ([...p.scheduleRevisions].reverse().find(r=>r.effectiveFrom<=clock.date)?.entries||[]) : p.entries;
  const session = entries.find(e => e.day === clock.weekday)?.session;
  if (!session || p.skipDates.includes(clock.date)) return null;
  const key = p.occurrenceMode==='date'?`${clock.date}:${session}`:occurrence(clock.date, session);
  return p.doneKeys.includes(key) ? null : { day: clock.date, session, occurrence: key };
}
export function allowedEndpoint(endpoint) {
  try {
    const u = new URL(endpoint);
    return u.protocol === 'https:' && !u.username && !u.password && !u.port &&
      (['fcm.googleapis.com', 'android.googleapis.com', 'web.push.apple.com'].includes(u.hostname) || u.hostname === 'updates.push.services.mozilla.com' || u.hostname.endsWith('.push.services.mozilla.com'));
  } catch { return false; }
}
