const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
function todayKey(now = /* @__PURE__ */ new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Damascus", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
export const executionDate = r => r.completedDate || (r.finishedAt ? todayKey(new Date(r.finishedAt)) : r.dateKey);
function shift(day, n) {
  const d = /* @__PURE__ */ new Date(day + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
const weekday = (day) => (/* @__PURE__ */ new Date(day + "T12:00:00Z")).getUTCDay();
function planFor(settings, day) {
  return [...settings.revisions].reverse().find((r) => r.effectiveFrom <= day) || null;
}
function slotFor(settings, day) {
  const p = planFor(settings, day);
  const entry = p?.schedule.find((e) => e.day === weekday(day));
  return entry ? { date: day, session: entry.session, workoutId: `${p.program}-${entry.session.toLowerCase()}-${p.level}`, program: p.program, level: p.level } : null;
}
function opportunity(settings, history, day = todayKey()) {
  if (history.some((r) => r.dateKey === day || r.completedDate === day)) return null;
  const slot = slotFor(settings, day) || slotFor(settings, shift(day, -1));
  if (!slot || slot.program !== planFor(settings, day)?.program || slot.level !== planFor(settings, day)?.level || history.some((r) => (r.scheduledDate || r.dateKey) === slot.date)) return null;
  return { ...slot, kind: slot.date === day ? "scheduled" : "makeup" };
}
function validPlan(p) {
  return ["move", "foundation", "strength", "hybrid", "circuit"].includes(p.program) && [1, 2, 3].includes(p.level) && Array.isArray(p.schedule) && p.schedule.length === 3 && new Set(p.schedule.map((e) => e.day)).size === 3 && new Set(p.schedule.map((e) => e.session)).size === 3 && p.schedule.every((e) => Number.isInteger(e.day) && e.day >= 0 && e.day <= 6 && ["A", "B", "C"].includes(e.session));
}
function changePlan(settings, plan, day = todayKey(), { applyToday = false } = {}) {
  if (!validPlan(plan)) throw Error("اختر ثلاثة أيام مختلفة وجلسات A وB وC دون تكرار.");
  const effectiveFrom = settings.revisions.length && !applyToday ? shift(day, 1) : day;
  return { ...settings, revisions: [...settings.revisions.filter((r) => r.effectiveFrom < effectiveFrom), { ...plan, effectiveFrom }] };
}
function activeExpired(settings, session, day = todayKey()) {
  const scheduled = session.scheduledDate || session.dateKey;
  return day > scheduled && (day > shift(scheduled, 1) || Boolean(slotFor(settings, day)));
}
function updatePlan(settings, plan, { active = null, history = [], day = todayKey() } = {}) {
  const old = settings.revisions.at(-1), current = planFor(settings, day);
  const protectedDay = Boolean(active) || history.some((r) => r.dateKey === day || r.completedDate === day);
  if (old && old.effectiveFrom <= day && old.program === plan.program && old.level === plan.level && old.schedule.every((a) => plan.schedule.some((b) => a.session === b.session && a.day === b.day))) return settings;
  return changePlan(settings, plan, day, { applyToday: !protectedDay || current?.program !== plan.program || current?.level !== plan.level });
}
function swapScheduleDay(schedule, session, day) {
  const selected = schedule.find((s) => s.session === session);
  if (!selected || !Number.isInteger(day) || day < 0 || day > 6) throw Error("Invalid schedule choice");
  const other = schedule.find((s) => s.session !== session && s.day === day);
  return schedule.map((s) => ({ ...s, day: s.session === session ? day : s.session === other?.session ? selected.day : s.day }));
}
export {
  activeExpired,
  changePlan,
  days,
  opportunity,
  planFor,
  shift,
  slotFor,
  swapScheduleDay,
  todayKey,
  updatePlan,
  validPlan,
  weekday
};
