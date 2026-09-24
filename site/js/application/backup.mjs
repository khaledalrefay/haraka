import { compileWorkout, remaining } from "../domain/engine.mjs";
import { validPlan } from "../domain/schedule.mjs";
import { palettes } from "../data/palettes.mjs";
import { sounds } from "../data/sounds.mjs";
const date = (x) => typeof x === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x) && !Number.isNaN(Date.parse(x + "T12:00:00Z")) && (/* @__PURE__ */ new Date(x + "T12:00:00Z")).toISOString().slice(0, 10) === x;
const integer = (x, min = 0) => Number.isSafeInteger(x) && x >= min;
const canonical = (x) => JSON.stringify(x, (_, v) => v && typeof v === "object" && !Array.isArray(v) ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, v[k]])) : v);
const check = (ok) => {
  if (!ok) throw Error("ملف النسخة الاحتياطية غير صالح أو من إصدار غير متوافق. لم تتغير بياناتك.");
};
function validateBackup(input, content, now = Date.now()) {
  check(input?.format === "haraka-v2" && input.version === 1 && input.contentVersion === content.contentVersion);
  const data = structuredClone(input.data), s = data?.settings;
  check(s?.schemaVersion === 1 && ["light", "dark"].includes(s.theme) && palettes.some((p) => p[0] === s.palette) && sounds.some((p) => p[0] === s.sound));
  check(Array.isArray(s.revisions) && s.revisions.length > 0 && s.revisions.length <= 1e4 && s.revisions.every((p, i) => validPlan(p) && date(p.effectiveFrom) && (!i || p.effectiveFrom > s.revisions[i - 1].effectiveFrom)));
  check(s.levels && ["move", "foundation", "strength", "hybrid", "circuit"].every((p) => [1, 2, 3].includes(s.levels[p])));
  check(Array.isArray(data.history) && data.history.length <= 1e4);
  const ids = /* @__PURE__ */ new Set(), slots = /* @__PURE__ */ new Set();
  for (const r of [...data.history, ...data.active ? [data.active] : []]) {
    check(r && typeof r.id === "string" && r.id.length > 0 && r.id.length <= 128 && !ids.has(r.id));
    ids.add(r.id);
    check(r.schemaVersion === 1 && date(r.dateKey) && date(r.scheduledDate) && r.dateKey >= r.scheduledDate && (!r.completedDate || date(r.completedDate)));
    check(!slots.has(r.scheduledDate));
    slots.add(r.scheduledDate);
    check(integer(r.revision) && integer(r.startedAt) && r.startedAt <= now + 864e5 && integer(r.cursor) && Array.isArray(r.results) && r.results.length === r.cursor);
    check(r.snapshot?.contentVersion === content.contentVersion && content.workouts.some((w) => w.id === r.snapshot.workout?.id));
    check(canonical(r.snapshot) === canonical(compileWorkout(content, r.snapshot.workout.id)));
    check(r.cursor <= r.snapshot.steps.length && r.results.every((x, i) => x.stepId === r.snapshot.steps[i].id && ["done", "skipped"].includes(x.outcome) && integer(x.at)));
    check(r === data.active ? r.status === "active" && r.cursor < r.snapshot.steps.length : ["completed", "stopped"].includes(r.status) && integer(r.finishedAt));
    check(r.status !== "completed" || r.cursor === r.snapshot.steps.length);
    check(r.hidden === void 0 || typeof r.hidden === "boolean");
    if (r.timer) {
      const step = r.snapshot.steps[r.cursor];
      check(step && (step.type === "rest" || step.unit === "seconds") && Number.isFinite(r.timer.remainingMs) && r.timer.remainingMs >= 0 && typeof r.timer.running === "boolean" && (!r.timer.running || integer(r.timer.startedAt)));
      r.timer = { remainingMs: remaining(r, now), running: false, startedAt: null };
    }
  }
  check(!data.active || !data.history.some((r) => r.dateKey === data.active.dateKey || r.completedDate === data.active.dateKey));
  return data;
}
async function makeBackup(repo, content) {
  return { format: "haraka-v2", version: 1, contentVersion: content.contentVersion, exportedAt: (/* @__PURE__ */ new Date()).toISOString(), data: await repo.exportData() };
}
export {
  makeBackup,
  validateBackup
};
