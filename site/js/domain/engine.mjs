const copy = (x) => structuredClone(x);
const positive = (n) => Number.isInteger(n) && n > 0;
function compileWorkout(content, id) {
  const w = content.workouts.find((w2) => w2.id === id);
  if (!w) throw Error("Unknown workout");
  const exercises = Object.fromEntries(content.exercises.map((e) => [e.id, e]));
  const steps = [];
  const rest = (seconds, reason, meta = {}) => {
    if (seconds) steps.push({ type: "rest", seconds, reason, ...meta });
  };
  const work = (p, meta = {}) => {
    if (!exercises[p.exercise_id] || !positive(p.target) || !["seconds", "reps", "cycles"].includes(p.unit) || ![1, 2].includes(p.sides)) throw Error("Invalid prescription");
    steps.push({ type: "work", exerciseId: p.exercise_id, target: p.target, unit: p.unit, sides: p.sides, sideMode: p.side_mode, pauseSeconds: p.pause_seconds || 0, pace: p.pace || null, prescriptionId: p.id || null, ...meta });
  };
  const perform = (p, meta) => {
    if (p.side_mode === "sequential" && p.sides === 2) {
      work({ ...p, sides: 1 }, { ...meta, side: "right" });
      rest(p.sideRest, "side_switch", meta);
      work({ ...p, sides: 1 }, { ...meta, side: "left" });
    } else work(p, meta);
  };
  for (const b of w.blocks) {
    if (b.kind === "literal") for (const p of b.items) {
      if (p.type === "rest") rest(p.seconds, p.reason, { block: b.id });
      else work(p, { block: b.id, side: p.side });
    }
    else if (b.kind === "sets") for (const p of b.items) {
      if (!positive(p.sets)) throw Error("Invalid sets");
      for (let set = 1; set <= p.sets; set++) {
        perform(p, { block: b.id, set, sets: p.sets });
        if (set < p.sets) rest(p.setRest, "between_sets", { block: b.id });
      }
      rest(p.after, "transition", { block: b.id });
    }
    else if (b.kind === "repeat") {
      if (!positive(b.rounds)) throw Error("Invalid rounds");
      for (let round = 1; round <= b.rounds; round++) for (let i = 0; i < b.items.length; i++) {
        const p = b.items[i];
        if (p.sets !== 1) throw Error("Repeat stations require one set");
        perform(p, { block: b.id, round, rounds: b.rounds, station: i + 1, stations: b.items.length });
        rest(i < b.items.length - 1 ? p.after : round < b.rounds ? b.between : b.finalRest, "repeat_transition", { block: b.id });
      }
    } else throw Error("Unknown block");
  }
  if (steps.some((s, i) => s.type === "rest" && steps[i - 1]?.type === "rest")) throw Error("Stacked rests");
  return copy({ contentVersion: content.contentVersion, workout: w, exercises: Object.fromEntries([...new Set(steps.filter((s) => s.type === "work").map((s) => s.exerciseId))].map((id2) => [id2, exercises[id2]])), steps: steps.map((s, i) => ({ ...s, id: `${id}:${i}` })) });
}
function createSession(snapshot, { id, dateKey, scheduledDate = dateKey, now = Date.now() } = {}) {
  if (!id || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) throw Error("Session identity required");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(scheduledDate)) throw Error("Scheduled date required");
  return { id, dateKey, scheduledDate, schemaVersion: 1, revision: 0, status: "active", startedAt: now, snapshot: copy(snapshot), cursor: 0, results: [], timer: null };
}
function remaining(s, now = Date.now()) {
  return s.timer ? Math.max(0, s.timer.remainingMs - (s.timer.running ? Math.max(0, now - s.timer.startedAt) : 0)) : null;
}
function reduceSession(session, command, now = Date.now()) {
  const s = copy(session), step = s.snapshot.steps[s.cursor];
  if (s.status !== "active" || command.stepId && command.stepId !== step.id) return s;
  const timed = step.type === "rest" || step.unit === "seconds";
  if (command.type === "startTimer") {
    if (!timed || s.timer?.running) return s;
    s.timer = { totalMs: s.timer?.totalMs ?? (step.seconds ?? step.target) * 1e3, remainingMs: s.timer?.remainingMs ?? (step.seconds ?? step.target) * 1e3, running: true, startedAt: now };
  } else if (command.type === "pause") {
    if (!s.timer?.running) return s;
    s.timer = { ...s.timer, remainingMs: remaining(s, now), running: false, startedAt: null };
  } else if (command.type === "extendRest" || command.type === "extendTimer") {
    if (!timed || command.type === "extendRest" && step.type !== "rest" || !positive(command.seconds) || command.seconds > 3600) throw Error("Invalid rest extension");
    s.timer = { totalMs: (s.timer?.totalMs ?? (step.seconds ?? step.target) * 1e3) + command.seconds * 1e3, remainingMs: (remaining(s, now) ?? (step.seconds ?? step.target) * 1e3) + command.seconds * 1e3, running: s.timer?.running ?? false, startedAt: s.timer?.running ? now : null };
  } else if (["done", "skip", "elapsed"].includes(command.type)) {
    if (!command.stepId) throw Error("stepId required");
    if (command.type === "elapsed" && (!s.timer || remaining(s, now) > 0)) return s;
    if (command.type === "done" && step.type === "rest") throw Error("Rest uses elapsed or skip");
    s.results.push({ stepId: step.id, outcome: command.type === "skip" ? "skipped" : "done", at: now });
    s.cursor++;
    s.timer = null;
    if (s.cursor === s.snapshot.steps.length) {
      s.status = "completed";
      s.finishedAt = now;
    }
  } else if (command.type === "stop") {
    s.status = "stopped";
    s.finishedAt = now;
    if (s.timer) s.timer = { ...s.timer, remainingMs: remaining(s, now), running: false, startedAt: null };
  } else throw Error("Unknown command");
  s.revision++;
  return s;
}
export {
  compileWorkout,
  createSession,
  reduceSession,
  remaining
};
