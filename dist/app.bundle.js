(() => {
  // js/presentation/html.mjs
  var esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  function button(text, action, cls = "secondary", extra = "") {
    return `<button type="button" class="${cls}" data-action="${action}" ${extra}>${text}</button>`;
  }
  function movementName(s, map) {
    return s.exerciseId === "march" ? { gentle: "\u0645\u0634\u064A \u0647\u0627\u062F\u0626 \u0628\u0627\u0644\u0645\u0643\u0627\u0646", progressive: "\u0645\u0634\u064A \u0645\u062A\u062F\u0631\u062C \u0628\u0627\u0644\u0645\u0643\u0627\u0646", active: "\u0645\u0634\u064A \u0646\u0634\u064A\u0637 \u0628\u0627\u0644\u0645\u0643\u0627\u0646", slow: "\u0645\u0634\u064A \u0628\u0637\u064A\u0621 \u0628\u0627\u0644\u0645\u0643\u0627\u0646", decelerating: "\u0645\u0634\u064A \u064A\u062A\u0628\u0627\u0637\u0623 \u062A\u062F\u0631\u064A\u062C\u064A\u064B\u0627" }[s.pace] || "\u0645\u0634\u064A \u0628\u0627\u0644\u0645\u0643\u0627\u0646" : map[s.exerciseId].name_ar;
  }
  function goal(s) {
    if (s.type === "rest") return `${s.seconds} \u062B\u0627\u0646\u064A\u0629`;
    return `${s.target} ${s.unit === "seconds" ? "\u062B\u0627\u0646\u064A\u0629" : s.unit === "cycles" ? "\u062F\u0648\u0631\u0627\u062A" : "\u0639\u062F\u0651\u0627\u062A"}${s.sides === 2 ? " \u0644\u0643\u0644 \u062C\u0647\u0629" : ""}`;
  }

  // js/data/program-labels.mjs
  var names = { move: "Move", foundation: "Foundation", strength: "Strength", hybrid: "Hybrid", circuit: "Circuit" };
  var descriptions = { move: "\u062D\u0631\u0643\u0629 \u0642\u0635\u064A\u0631\u0629 \u0648\u062E\u0641\u064A\u0641\u0629\u060C \u0645\u0639 \u0627\u0647\u062A\u0645\u0627\u0645 \u0628\u0627\u0644\u0631\u0642\u0628\u0629 \u0648\u0627\u0644\u0643\u062A\u0641\u064A\u0646 \u0648\u0627\u0644\u0638\u0647\u0631.", foundation: "\u062A\u0623\u0633\u064A\u0633 \u0627\u0644\u062D\u0631\u0643\u0627\u062A \u0648\u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0627\u062A \u0628\u0648\u0632\u0646 \u0627\u0644\u062C\u0633\u0645\u060C \u062B\u0645 \u0627\u0633\u062A\u0642\u0644\u0627\u0644 \u0648\u062A\u062D\u0643\u0645 \u0623\u0643\u0628\u0631.", strength: "\u0642\u0648\u0629 \u0628\u0645\u062C\u0645\u0648\u0639\u0627\u062A \u0645\u0633\u062A\u0642\u0644\u0629\u061B \u0623\u0643\u0645\u0644 \u0645\u062C\u0645\u0648\u0639\u0627\u062A \u0627\u0644\u062D\u0631\u0643\u0629 \u0642\u0628\u0644 \u0627\u0644\u0627\u0646\u062A\u0642\u0627\u0644.", hybrid: "\u0642\u0633\u0645 \u0642\u0648\u0629 \u0645\u0633\u062A\u0642\u0644 \u064A\u062A\u0628\u0639\u0647 \u062A\u0633\u0644\u0633\u0644 \u0647\u0648\u0627\u0626\u064A \u0645\u062A\u0643\u0631\u0631.", circuit: "\u0645\u062D\u0637\u0627\u062A \u0645\u0642\u0627\u0648\u0645\u0629 \u0648\u062D\u0631\u0643\u0629 \u0645\u062A\u062F\u0627\u062E\u0644\u0629 \u0636\u0645\u0646 \u062F\u0648\u0631\u062A\u064A\u0646." };
  var levelText = { move: ["\u062D\u0631\u0643\u0627\u062A \u0648\u0627\u0642\u0641\u0629 \u0648\u062C\u0627\u0644\u0633\u0629 \u0641\u0642\u0637.", "\u064A\u062A\u0636\u0645\u0646 \u0627\u0644\u0646\u0632\u0648\u0644 \u0644\u0644\u0628\u0633\u0627\u0637 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0648\u0642\u0648\u0641.", "\u062A\u0646\u0633\u064A\u0642 \u0648\u062A\u0648\u0627\u0632\u0646 \u0648\u062D\u0631\u0643\u0627\u062A \u0623\u0631\u0636\u064A\u0629 \u0623\u0643\u062B\u0631 \u062A\u0646\u0648\u0639\u064B\u0627."], foundation: ["\u0646\u0633\u062E \u062A\u0623\u0633\u064A\u0633\u064A\u0629 \u0648\u0645\u062C\u0645\u0648\u0639\u0627\u062A \u0642\u0644\u064A\u0644\u0629.", "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644 \u0648\u0645\u062C\u0645\u0648\u0639\u0627\u062A \u0623\u0643\u062B\u0631 \u0645\u0639 \u062A\u062D\u0643\u0645 \u0628\u0627\u0644\u062D\u0631\u0643\u0629.", "\u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u0646\u0642\u0633\u0645\u0629 \u062F\u0648\u0646 \u0645\u0633\u0627\u0646\u062F\u0629 \u0648\u0628\u0644\u0627\u0646\u0643 \u0639\u0644\u0649 \u0627\u0644\u0642\u062F\u0645\u064A\u0646."], strength: ["\u062A\u062D\u0643\u0645 \u0641\u064A \u0627\u0644\u0636\u063A\u0637 \u0627\u0644\u0645\u0627\u0626\u0644 \u0648\u0627\u0644\u0642\u0631\u0641\u0635\u0627\u0621.", "\u064A\u062A\u0636\u0645\u0646 \u0636\u063A\u0637\u064B\u0627 \u0623\u0631\u0636\u064A\u064B\u0627 \u0643\u0627\u0645\u0644\u064B\u0627 \u0648\u062C\u0633\u0631\u064B\u0627 \u0628\u0631\u062C\u0644 \u0648\u0627\u062D\u062F\u0629.", "\u064A\u062A\u0636\u0645\u0646 \u0627\u0646\u062F\u0641\u0627\u0639\u064B\u0627 \u062E\u0644\u0641\u064A\u064B\u0627 \u0648\u0628\u0644\u0627\u0646\u0643 \u062C\u0627\u0646\u0628\u064A\u064B\u0627 \u0643\u0627\u0645\u0644\u064B\u0627."], hybrid: ["\u0642\u0648\u0629 \u0623\u0633\u0627\u0633\u064A\u0629 \u062B\u0645 \u062D\u0631\u0643\u0627\u062A \u0647\u0648\u0627\u0626\u064A\u0629 \u062F\u0648\u0646 \u0642\u0641\u0632.", "\u0636\u063A\u0637 \u0623\u0631\u0636\u064A \u0648\u062A\u0646\u0633\u064A\u0642 \u0647\u0648\u0627\u0626\u064A \u0623\u0643\u062B\u0631.", "\u0627\u0646\u062F\u0641\u0627\u0639 \u062E\u0644\u0641\u064A \u0648\u062C\u0633\u0631 \u0623\u062D\u0627\u062F\u064A \u0648\u062A\u0646\u0633\u064A\u0642 \u0645\u062A\u0642\u062F\u0645."], circuit: ["\u0645\u062D\u0637\u0627\u062A \u0628\u0646\u0633\u062E \u062A\u0623\u0633\u064A\u0633\u064A\u0629 \u062F\u0648\u0646 \u0642\u0641\u0632.", "\u062A\u062D\u0643\u0645 \u0623\u0643\u0628\u0631 \u0645\u0639 \u0628\u0642\u0627\u0621 \u0627\u0644\u062F\u0648\u0631\u062A\u064A\u0646.", "\u0636\u063A\u0637 \u0623\u0631\u0636\u064A \u0648\u0627\u0646\u062F\u0641\u0627\u0639 \u0648\u062C\u0633\u0631 \u0623\u062D\u0627\u062F\u064A\u061B \u062F\u0648\u0631\u062A\u0627\u0646 \u0623\u064A\u0636\u064B\u0627."] };
  var levelName = (n) => ({ 1: "\u0623\u0633\u0627\u0633\u064A", 2: "\u0645\u062A\u0648\u0633\u0637", 3: "\u0645\u062A\u0642\u062F\u0645" })[n] || "\u0623\u0633\u0627\u0633\u064A";
  var sessions = {
    move: ["\u062A\u0646\u0634\u064A\u0637 \u0627\u0644\u062C\u0633\u0645", "\u062D\u0631\u0643\u0629 \u0648\u062A\u0648\u0627\u0632\u0646", "\u062D\u0631\u0643\u0629 \u0648\u062A\u0646\u0633\u064A\u0642"],
    foundation: ["\u062A\u0623\u0633\u064A\u0633 \u0627\u0644\u0642\u0648\u0629", "\u062A\u0623\u0633\u064A\u0633 \u0627\u0644\u0631\u062C\u0644\u064A\u0646 \u0648\u0627\u0644\u062C\u0630\u0639", "\u062A\u0623\u0633\u064A\u0633 \u0627\u0644\u062B\u0628\u0627\u062A"],
    strength: ["\u0642\u0648\u0629 \u0627\u0644\u062C\u0633\u0645", "\u0642\u0648\u0629 \u0627\u0644\u0631\u062C\u0644\u064A\u0646 \u0648\u0627\u0644\u062B\u0628\u0627\u062A", "\u0642\u0648\u0629 \u0627\u0644\u062C\u0633\u0645 \u0648\u0627\u0644\u062C\u0630\u0639"],
    hybrid: ["\u0642\u0648\u0629 \u0648\u062D\u0631\u0643\u0629", "\u0642\u0648\u0629 \u0627\u0644\u0631\u062C\u0644\u064A\u0646 \u0648\u0627\u0644\u062E\u0637\u0648\u0627\u062A", "\u0642\u0648\u0629 \u0648\u062A\u0646\u0633\u064A\u0642"],
    circuit: ["\u062F\u0627\u0626\u0631\u0629 \u0627\u0644\u062C\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644", "\u062F\u0627\u0626\u0631\u0629 \u0627\u0644\u0631\u062C\u0644\u064A\u0646 \u0648\u0627\u0644\u062B\u0628\u0627\u062A", "\u062F\u0627\u0626\u0631\u0629 \u0627\u0644\u062C\u0630\u0639 \u0648\u0627\u0644\u062A\u0646\u0633\u064A\u0642"]
  };
  var sessionName = (program, session) => sessions[program]?.[["A", "B", "C"].indexOf(session)] || session;

  // js/domain/schedule.mjs
  var days = ["\u0627\u0644\u0623\u062D\u062F", "\u0627\u0644\u0625\u062B\u0646\u064A\u0646", "\u0627\u0644\u062B\u0644\u0627\u062B\u0627\u0621", "\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621", "\u0627\u0644\u062E\u0645\u064A\u0633", "\u0627\u0644\u062C\u0645\u0639\u0629", "\u0627\u0644\u0633\u0628\u062A"];
  function todayKey(now = /* @__PURE__ */ new Date()) {
    return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Damascus", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  }
  function shift(day, n) {
    const d = /* @__PURE__ */ new Date(day + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }
  var weekday = (day) => (/* @__PURE__ */ new Date(day + "T12:00:00Z")).getUTCDay();
  function planFor(settings2, day) {
    return [...settings2.revisions].reverse().find((r) => r.effectiveFrom <= day) || null;
  }
  function slotFor(settings2, day) {
    const p = planFor(settings2, day);
    const entry = p?.schedule.find((e) => e.day === weekday(day));
    return entry ? { date: day, session: entry.session, workoutId: `${p.program}-${entry.session.toLowerCase()}-${p.level}`, program: p.program, level: p.level } : null;
  }
  function opportunity(settings2, history2, day = todayKey()) {
    if (history2.some((r) => r.dateKey === day || r.completedDate === day)) return null;
    const slot = slotFor(settings2, day) || slotFor(settings2, shift(day, -1));
    if (!slot || history2.some((r) => (r.scheduledDate || r.dateKey) === slot.date)) return null;
    return { ...slot, kind: slot.date === day ? "scheduled" : "makeup" };
  }
  function validPlan(p) {
    return ["move", "foundation", "strength", "hybrid", "circuit"].includes(p.program) && [1, 2, 3].includes(p.level) && Array.isArray(p.schedule) && p.schedule.length === 3 && new Set(p.schedule.map((e) => e.day)).size === 3 && new Set(p.schedule.map((e) => e.session)).size === 3 && p.schedule.every((e) => Number.isInteger(e.day) && e.day >= 0 && e.day <= 6 && ["A", "B", "C"].includes(e.session));
  }
  function changePlan(settings2, plan, day = todayKey(), { applyToday = false } = {}) {
    if (!validPlan(plan)) throw Error("\u0627\u062E\u062A\u0631 \u062B\u0644\u0627\u062B\u0629 \u0623\u064A\u0627\u0645 \u0645\u062E\u062A\u0644\u0641\u0629 \u0648\u062C\u0644\u0633\u0627\u062A A \u0648B \u0648C \u062F\u0648\u0646 \u062A\u0643\u0631\u0627\u0631.");
    const effectiveFrom = settings2.revisions.length && !applyToday ? shift(day, 1) : day;
    return { ...settings2, revisions: [...settings2.revisions.filter((r) => r.effectiveFrom < effectiveFrom), { ...plan, effectiveFrom }] };
  }
  function activeExpired(settings2, session, day = todayKey()) {
    const scheduled = session.scheduledDate || session.dateKey;
    return day > scheduled && (day > shift(scheduled, 1) || Boolean(slotFor(settings2, day)));
  }
  function updatePlan(settings2, plan, { active: active2 = null, history: history2 = [], day = todayKey() } = {}) {
    const old = settings2.revisions.at(-1);
    const protectedDay = Boolean(active2) || history2.some((r) => r.dateKey === day || r.completedDate === day);
    if (old && (old.effectiveFrom <= day || protectedDay) && old.program === plan.program && old.level === plan.level && old.schedule.every((a) => plan.schedule.some((b) => a.session === b.session && a.day === b.day))) return settings2;
    return changePlan(settings2, plan, day, { applyToday: !protectedDay });
  }
  function swapScheduleDay(schedule, session, day) {
    const selected2 = schedule.find((s) => s.session === session);
    if (!selected2 || !Number.isInteger(day) || day < 0 || day > 6) throw Error("Invalid schedule choice");
    const other = schedule.find((s) => s.session !== session && s.day === day);
    return schedule.map((s) => ({ ...s, day: s.session === session ? day : s.session === other?.session ? selected2.day : s.day }));
  }

  // js/data/estimates.mjs
  var estimates = {
    "move-a-1": [
      7,
      8
    ],
    "move-a-2": [
      9,
      11
    ],
    "move-a-3": [
      9,
      11
    ],
    "move-b-1": [
      8,
      10
    ],
    "move-b-2": [
      8,
      10
    ],
    "move-b-3": [
      10,
      12
    ],
    "move-c-1": [
      8,
      9
    ],
    "move-c-2": [
      9,
      10
    ],
    "move-c-3": [
      9,
      11
    ],
    "foundation-a-1": [
      18,
      20
    ],
    "foundation-a-2": [
      23,
      26
    ],
    "foundation-a-3": [
      24,
      27
    ],
    "foundation-b-1": [
      18,
      20
    ],
    "foundation-b-2": [
      23,
      26
    ],
    "foundation-b-3": [
      25,
      28
    ],
    "foundation-c-1": [
      19,
      21
    ],
    "foundation-c-2": [
      23,
      26
    ],
    "foundation-c-3": [
      26,
      29
    ],
    "strength-a-1": [
      22,
      24
    ],
    "strength-a-2": [
      24,
      27
    ],
    "strength-a-3": [
      27,
      30
    ],
    "strength-b-1": [
      22,
      25
    ],
    "strength-b-2": [
      25,
      28
    ],
    "strength-b-3": [
      25,
      28
    ],
    "strength-c-1": [
      19,
      22
    ],
    "strength-c-2": [
      23,
      27
    ],
    "strength-c-3": [
      26,
      29
    ],
    "hybrid-a-1": [
      25,
      27
    ],
    "hybrid-a-2": [
      26,
      29
    ],
    "hybrid-a-3": [
      27,
      30
    ],
    "hybrid-b-1": [
      24,
      27
    ],
    "hybrid-b-2": [
      26,
      29
    ],
    "hybrid-b-3": [
      29,
      32
    ],
    "hybrid-c-1": [
      26,
      28
    ],
    "hybrid-c-2": [
      29,
      32
    ],
    "hybrid-c-3": [
      28,
      31
    ],
    "circuit-a-1": [
      28,
      31
    ],
    "circuit-a-2": [
      29,
      32
    ],
    "circuit-a-3": [
      31,
      34
    ],
    "circuit-b-1": [
      29,
      32
    ],
    "circuit-b-2": [
      31,
      34
    ],
    "circuit-b-3": [
      34,
      38
    ],
    "circuit-c-1": [
      29,
      32
    ],
    "circuit-c-2": [
      31,
      34
    ],
    "circuit-c-3": [
      32,
      35
    ]
  };

  // js/presentation/home.mjs
  function renderHome({ settings: settings2, selected: selected2, active: active2, history: history2 }) {
    const t = todayKey(), start = shift(selected2, -weekday(selected2)), current = slotFor(settings2, selected2), offer = selected2 === t ? opportunity(settings2, history2, t) : null, record = history2.find((r) => r.dateKey === selected2 || r.completedDate === selected2);
    const chosen = active2 && selected2 === t ? { workoutId: active2.snapshot.workout.id, session: active2.snapshot.workout.session, program: active2.snapshot.workout.program, level: active2.snapshot.workout.level } : offer || current;
    let card;
    if (active2 && selected2 === t) card = `<span class="pill">\u062C\u0644\u0633\u0629 \u0645\u062D\u0641\u0648\u0638\u0629</span><h2>${sessionName(chosen.program, chosen.session)}</h2><p>${names[chosen.program]} \xB7 ${levelName(chosen.level)}</p>${button("\u0623\u0643\u0645\u0644 \u062C\u0644\u0633\u062A\u0643", "resume", "primary")}`;
    else if (record) card = `<span class="pill">${record.status === "completed" ? "\u062C\u0644\u0633\u0629 \u0645\u0646\u062A\u0647\u064A\u0629" : "\u0627\u0646\u062A\u0647\u0627\u0621 \u0645\u0628\u0643\u0631"}</span><h2>${sessionName(record.snapshot.workout.program, record.snapshot.workout.session)}</h2><p>${names[record.snapshot.workout.program]} \xB7 ${levelName(record.snapshot.workout.level)}</p>${record.hidden ? `<p>\u0647\u0630\u0647 \u0627\u0644\u062C\u0644\u0633\u0629 \u0645\u062E\u0641\u064A\u0629\u060C \u0648\u0645\u0627 \u0632\u0627\u0644 \u0645\u0648\u0639\u062F\u0647\u0627 \u0645\u062D\u062C\u0648\u0632\u064B\u0627.</p>${button("\u062D\u0630\u0641 \u0627\u0644\u062C\u0644\u0633\u0629 \u0648\u0625\u062A\u0627\u062D\u0629 \u0627\u0644\u0645\u0648\u0639\u062F", "delete-record", "secondary", `data-id="${esc(record.id)}"`)}` : button("\u0639\u0631\u0636 \u0627\u0644\u0633\u062C\u0644", "record", "primary", `data-id="${esc(record.id)}"`)}`;
    else if (chosen) card = `<span class="pill">${offer?.kind === "makeup" ? "\u062A\u0639\u0648\u064A\u0636 \u062C\u0644\u0633\u0629 \u0641\u0627\u0626\u062A\u0629" : selected2 === t ? "\u062C\u0644\u0633\u0629 \u0627\u0644\u064A\u0648\u0645" : "\u0645\u0639\u0627\u064A\u0646\u0629"}</span><h2>${sessionName(chosen.program, chosen.session)}</h2><p>${names[chosen.program]} \xB7 ${levelName(chosen.level)}</p><p class="v-space small">${estimates[chosen.workoutId].join("\u2013")} \u062F\u0642\u064A\u0642\u0629 \u062A\u0642\u062F\u064A\u0631\u064A\u064B\u0627</p>${offer ? button("\u0627\u0628\u062F\u0623 \u0627\u0644\u062C\u0644\u0633\u0629", "start", "primary", `data-workout="${chosen.workoutId}"`) : ""}${button("\u0645\u0639\u0627\u064A\u0646\u0629 \u0627\u0644\u062A\u0645\u0627\u0631\u064A\u0646", "preview", "secondary", `data-workout="${chosen.workoutId}"`)}`;
    else card = '<span class="pill">\u064A\u0648\u0645 \u0631\u0627\u062D\u0629</span><h2>\u0645\u0633\u0627\u062D\u0629 \u0644\u0644\u0631\u0627\u062D\u0629</h2><p>\u0633\u062A\u0638\u0647\u0631 \u062C\u0644\u0633\u062A\u0643 \u0639\u0646\u062F \u0645\u0648\u0639\u062F\u0647\u0627 \u0627\u0644\u0642\u0627\u062F\u0645.</p>';
    return `<div class="home-content"><h1 class="home-title">\u0628\u0631\u0646\u0627\u0645\u062C\u064A \u0627\u0644\u064A\u0648\u0645\u064A</h1><section class="weekly-calendar"><div class="v-calendar-head">${button("\u2192", "prev-week", "icon-btn", 'aria-label="\u0627\u0644\u0623\u0633\u0628\u0648\u0639 \u0627\u0644\u0633\u0627\u0628\u0642"')}${selected2 !== t ? button("\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u064A\u0648\u0645", "today", "text-btn") : `<span>${esc(start)} \u2014 ${esc(shift(start, 6))}</span>`}${button("\u2190", "next-week", "icon-btn", 'aria-label="\u0627\u0644\u0623\u0633\u0628\u0648\u0639 \u0627\u0644\u062A\u0627\u0644\u064A"')}</div><div class="week-strip">${Array.from({ length: 7 }, (_, i) => {
      const d = shift(start, i);
      return `<button class="day-button ${d === selected2 ? "selected" : ""}" data-day="${d}" aria-label="${days[i]} ${d} \u2014 ${history2.some((r) => r.dateKey === d) ? "\u062C\u0644\u0633\u0629 \u0645\u0633\u062C\u0644\u0629" : slotFor(settings2, d) ? "\u062A\u0645\u0631\u064A\u0646" : "\u0631\u0627\u062D\u0629"}" aria-pressed="${d === selected2}"><span>${days[i]}</span><b>${Number(d.slice(-2))}</b><span class="day-marker">${history2.some((r) => r.dateKey === d) ? "\u2713" : slotFor(settings2, d) ? "\u25CF" : "\xB7"}</span></button>`;
    }).join("")}</div></section><section class="session-hero v-hero">${card}</section></div>`;
  }

  // js/presentation/icons.mjs
  var paths = {
    programs: '<rect x="5" y="7" width="15" height="14" rx="3"/><path d="M16 3H6a3 3 0 0 0-3 3v10M9 12h7M9 16h5"/>',
    moon: '<path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a8.5 8.5 0 1 0 11.5 11.5Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    settings: '<path d="m9 3-.7 2.2-2 .9-2.1-.5-2 3.4 1.5 1.7v2.6L2.2 15l2 3.4 2.1-.5 2 .9L9 21h4l.7-2.2 2-.9 2.1.5 2-3.4-1.5-1.7v-2.6L19.8 9l-2-3.4-2.1.5-2-.9L13 3Z"/><circle cx="11" cy="12" r="3"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 10v7m0-11v2"/>',
    trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
    play: '<path d="m9 5 11 7-11 7Z"/>'
  };
  var icon = (name) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.info}</svg>`;

  // js/presentation/history.mjs
  var executionDate = (r) => r.completedDate || (r.finishedAt ? todayKey(new Date(r.finishedAt)) : r.dateKey);
  function renderHistory(history2, month, hidden) {
    const rows = history2.filter((r) => !r.hidden && executionDate(r).startsWith(month)).sort((a, b) => b.finishedAt - a.finishedAt);
    return `<h1 class="v-space">\u0633\u062C\u0644\u0651\u064A</h1><div class="v-month-nav">${button("\u2192", "history-prev", "icon-btn", 'aria-label="\u0627\u0644\u0634\u0647\u0631 \u0627\u0644\u0633\u0627\u0628\u0642"')}<label>\u0627\u0644\u0634\u0647\u0631<input type="month" id="history-month" value="${month}"></label>${button("\u2190", "history-next", "icon-btn", 'aria-label="\u0627\u0644\u0634\u0647\u0631 \u0627\u0644\u062A\u0627\u0644\u064A"')}</div><p class="small muted v-space">${rows.length} \u062C\u0644\u0633\u0629 \u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631</p>${rows.length ? rows.map((r) => {
      const w = r.snapshot.workout;
      return `<article class="card record v-compact-record"><div><h3>${esc(sessionName(w.program, w.session))}</h3><small>${executionDate(r)}</small><p class="small muted">${names[w.program]} \xB7 ${levelName(w.level)} \xB7 ${r.status === "completed" ? "\u0645\u0643\u062A\u0645\u0644\u0629" : "\u0627\u0646\u062A\u0647\u0627\u0621 \u0645\u0628\u0643\u0631"}</p></div><div class="v-record-actions">${button(icon("info"), "record", "icon-btn", `data-id="${esc(r.id)}" aria-label="\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u062C\u0644\u0633\u0629"`)}${button(icon("trash"), "delete-record", "icon-btn v-delete", `data-id="${esc(r.id)}" aria-label="\u062D\u0630\u0641 \u0627\u0644\u062C\u0644\u0633\u0629"`)}</div></article>`;
    }).join("") : '<section class="card empty"><p>\u0644\u0627 \u062A\u0648\u062C\u062F \u062C\u0644\u0633\u0627\u062A \u0645\u0633\u062C\u0651\u0644\u0629 \u0641\u064A \u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631.</p></section>'}${hidden}`;
  }

  // js/data/sounds.mjs
  var sounds = [["chime", "\u0631\u0646\u064A\u0646 \u0645\u062A\u062F\u0631\u0651\u062C"], ["bell", "\u062C\u0631\u0633"], ["pulse", "\u0646\u0628\u0636\u062A\u0627\u0646"], ["soft", "\u0646\u063A\u0645\u0629 \u0647\u0627\u062F\u0626\u0629"], ["rise", "\u0625\u0634\u0631\u0627\u0642\u0629"], ["silent", "\u0628\u062F\u0648\u0646 \u0635\u0648\u062A"]];

  // js/data/version.mjs
  var APP_VERSION = "2.0.0-beta.8";

  // js/data/palettes.mjs
  var palettes = [
    [
      "classic",
      "\u0643\u062D\u0644\u064A \u0648\u0628\u0631\u062A\u0642\u0627\u0644\u064A",
      "#24415D",
      "#E58A48"
    ],
    [
      "ocean",
      "\u0628\u062A\u0631\u0648\u0644\u064A \u0648\u0645\u0631\u062C\u0627\u0646\u064A",
      "#164E63",
      "#FB836F"
    ],
    [
      "forest",
      "\u0623\u062E\u0636\u0631 \u063A\u0627\u0628\u0629 \u0648\u0645\u0634\u0645\u0634\u064A",
      "#245447",
      "#F4A56B"
    ],
    [
      "slate",
      "\u0641\u062D\u0645\u064A \u0648\u0644\u0627\u064A\u0645",
      "#303B45",
      "#B9DB68"
    ],
    [
      "ink",
      "\u062D\u0628\u0631\u064A \u0648\u0630\u0647\u0628\u064A",
      "#292B35",
      "#D5AE58"
    ],
    [
      "earth",
      "\u0642\u0647\u0648\u0629 \u0648\u0643\u0631\u0627\u0645\u064A\u0644",
      "#49362F",
      "#C89462"
    ],
    [
      "olive",
      "\u0632\u064A\u062A\u0648\u0646\u064A \u0648\u0642\u0645\u062D\u064A",
      "#535C38",
      "#D9BF74"
    ],
    [
      "rose",
      "\u0623\u062D\u0645\u0631 \u0643\u0631\u0632\u064A \u0648\u062D\u062C\u0631\u064A",
      "#9B3545",
      "#C8BDB3"
    ],
    [
      "plum",
      "\u0646\u064A\u0644\u064A \u0648\u0623\u0632\u0631\u0642 \u0628\u0646\u0641\u0633\u062C\u064A",
      "#393B78",
      "#9999F5"
    ]
  ];
  var paletteIds = palettes.map((p) => p[0]);

  // js/presentation/settings.mjs
  var swatches = (p) => `<span class="v-swatches" aria-hidden="true"><i style="background:${p[2]}"></i><i style="background:${p[3]}"></i><i class="v-swatch-bg"></i></span>`;
  function palettePicker(value) {
    const selected2 = palettes.find((p) => p[0] === value) || palettes[0];
    return `<label id="palette-label">\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u062A\u0637\u0628\u064A\u0642</label><details class="v-palette-picker"><summary aria-labelledby="palette-label palette-value"><span id="palette-value">${selected2[1]}</span>${swatches(selected2)}<span aria-hidden="true">\u2304</span></summary><div class="v-palette-options">${palettes.map((p) => `<label><input type="radio" name="palette" value="${p[0]}" ${p[0] === selected2[0] ? "checked" : ""}><span>${p[1]}</span>${swatches(p)}</label>`).join("")}</div></details><div class="v-theme-preview"><span>\u0645\u0639\u0627\u064A\u0646\u0629 \u0627\u0644\u0623\u0644\u0648\u0627\u0646</span><strong>\u062D\u0631\u0643\u0629</strong><span class="v-preview-chip">\u0627\u0628\u062F\u0623 \u0627\u0644\u062C\u0644\u0633\u0629</span></div>`;
  }
  function renderSettings({ settings: settings2, formDraft: formDraft2, settingsPage: settingsPage2, draftProgram: draftProgram2, active: active2, history: history2, programCards: programCards2, levels: levels2, requirement: requirement2, reminderSection: reminderSection2 }) {
    const plan = settings2.revisions.at(-1), draft = formDraft2 || {};
    if (settingsPage2 === "plan") return `<section class="card v-settings">${button("\u0631\u062C\u0648\u0639 \u0644\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A", "settings-back", "text-btn")}<h1>\u0628\u0631\u0646\u0627\u0645\u062C\u064A</h1><form id="settings-form" data-section="plan"><h2 class="v-space">\u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062C \u0648\u0627\u0644\u0645\u0633\u062A\u0648\u0649</h2><div class="v-choices">${programCards2()}</div><div class="v-choices v-levels">${levels2()}</div><p>${requirement2()}</p><p class="small muted">${active2 ? "\u0644\u062F\u064A\u0643 \u062C\u0644\u0633\u0629 \u0645\u062D\u0641\u0648\u0638\u0629 \u0645\u0646 " + names[active2.snapshot.workout.program] + ". \u0633\u062A\u0628\u0642\u0649 \u0628\u0645\u062D\u062A\u0648\u0627\u0647\u0627\u060C \u0648\u064A\u0633\u0631\u064A \u0627\u0644\u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u062C\u062F\u064A\u062F \u0645\u0646 \u0627\u0644\u063A\u062F. \u064A\u0645\u0643\u0646\u0643 \u0645\u0639\u0627\u064A\u0646\u0629 \u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062C \u0627\u0644\u062C\u062F\u064A\u062F \u0627\u0644\u0622\u0646." : history2.some((r) => r.dateKey === todayKey() || r.completedDate === todayKey()) ? "\u062C\u0644\u0633\u0629 \u0627\u0644\u064A\u0648\u0645 \u0645\u0633\u062C\u0651\u0644\u0629\u061B \u064A\u0633\u0631\u064A \u0627\u0644\u062A\u063A\u064A\u064A\u0631 \u0645\u0646 \u0627\u0644\u063A\u062F. \u0644\u062A\u063A\u064A\u064A\u0631 \u062C\u0644\u0633\u0629 \u0627\u0644\u064A\u0648\u0645 \u0627\u062D\u0630\u0641 \u0633\u062C\u0644\u0647\u0627 \u0623\u0648\u0644\u064B\u0627." : "\u064A\u0633\u0631\u064A \u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062C \u0648\u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0648\u0627\u0644\u062C\u062F\u0648\u0644 \u0645\u0646 \u0627\u0644\u064A\u0648\u0645 \u0639\u0646\u062F \u0627\u0644\u062D\u0641\u0638\u061B \u062A\u0628\u0642\u0649 \u0627\u0644\u062C\u0644\u0633\u0627\u062A \u0627\u0644\u0633\u0627\u0628\u0642\u0629 \u0645\u062D\u0641\u0648\u0638\u0629."}</p>${button("\u0645\u0639\u0627\u064A\u0646\u0629 \u0627\u0644\u062C\u0644\u0633\u0627\u062A", "preview-plan", "text-btn", 'type="button"')}<h2 class="v-space">\u062C\u062F\u0648\u0644\u064A \u0627\u0644\u0623\u0633\u0628\u0648\u0639\u064A</h2><p class="small muted">\u0627\u062E\u062A\u064A\u0627\u0631 \u064A\u0648\u0645 \u0645\u0634\u063A\u0648\u0644 \u064A\u0628\u062F\u0651\u0644 \u064A\u0648\u0645\u064A \u0627\u0644\u062C\u0644\u0633\u062A\u064A\u0646 \u062A\u0644\u0642\u0627\u0626\u064A\u064B\u0627.</p><div class="v-schedule">${["A", "B", "C"].map((letter) => `<label>${sessionName(draftProgram2, letter)}<select name="day-${letter}">${days.map((name, i) => `<option value="${i}" ${Number(draft[`day-${letter}`] ?? plan.schedule.find((s) => s.session === letter)?.day) === i ? "selected" : ""}>${name}</option>`).join("")}</select></label>`).join("")}</div><button class="primary full v-space" type="submit">\u0627\u0639\u062A\u0645\u0627\u062F \u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062C \u0648\u0627\u0644\u062C\u062F\u0648\u0644</button></form></section>`;
    return `<section class="card v-settings"><h1>\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A</h1>${button(`<span><strong>\u0628\u0631\u0646\u0627\u0645\u062C\u064A</strong><small>${names[plan.program]} \xB7 ${levelName(plan.level)}</small></span><span aria-hidden="true">\u2190</span>`, "settings-plan", "v-settings-link")}<form id="settings-form" data-section="appearance"><h2 class="v-space">\u0627\u0644\u0645\u0638\u0647\u0631 \u0648\u0627\u0644\u0635\u0648\u062A</h2>${palettePicker(draft.palette ?? settings2.palette)}<label>\u0646\u063A\u0645\u0629 \u0627\u0644\u0645\u0624\u0642\u062A<div class="v-sound-picker"><select name="sound">${sounds.map(([id, name]) => `<option value="${id}" ${(draft.sound ?? settings2.sound) === id ? "selected" : ""}>${name}</option>`).join("")}</select>${button(icon("play"), "test-sound", "icon-btn", 'type="button" aria-label="\u0627\u0633\u062A\u0645\u0639 \u0644\u0644\u0646\u063A\u0645\u0629" title="\u0627\u0633\u062A\u0645\u0639 \u0644\u0644\u0646\u063A\u0645\u0629"')}</div></label><div class="v-buttons v-space"><button class="primary" type="submit">\u062D\u0641\u0638 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A</button>${button("\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u062A\u063A\u064A\u064A\u0631\u0627\u062A", "appearance-cancel", "secondary", 'type="button"')}</div></form><hr><section class="v-space"><h2>\u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629</h2><p class="muted">\u0627\u062D\u0641\u0638 \u0625\u0639\u062F\u0627\u062F\u0627\u062A\u0643 \u0648\u0633\u062C\u0644\u0651\u0643 \u0648\u0627\u0644\u062C\u0644\u0633\u0629 \u0627\u0644\u062C\u0627\u0631\u064A\u0629 \u0641\u064A \u0645\u0644\u0641.</p><div class="v-buttons">${button("\u062A\u0635\u062F\u064A\u0631 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A", "export")}${button("\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0645\u0646 \u0645\u0644\u0641", "import")}</div><input id="backup-file" type="file" accept="application/json,.json" hidden></section><hr>${reminderSection2()}<hr><h2 class="v-space">\u0627\u0644\u062A\u0637\u0628\u064A\u0642</h2>${button("\u062A\u062B\u0628\u064A\u062A \u062D\u0631\u0643\u0629", "install-app")}<p id="install-status" class="small muted"></p><p class="small muted v-space">\u0627\u0644\u0625\u0635\u062F\u0627\u0631 ${APP_VERSION} \xB7 \u0627\u0644\u0635\u0648\u0631 \u0627\u0644\u062A\u0648\u0636\u064A\u062D\u064A\u0629 \u0642\u064A\u062F \u0627\u0644\u062A\u062C\u0647\u064A\u0632</p></section>`;
  }

  // js/infrastructure/download.mjs
  function downloadBackup(value) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(value)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "Haraka-Backup-" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) + ".json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
  }

  // js/presentation/player.mjs
  function renderPlayer(active2) {
    const s = active2.snapshot.steps[active2.cursor], e = active2.snapshot.exercises[s.exerciseId], isRest = s.type === "rest", timed = isRest || s.unit === "seconds", next = active2.snapshot.steps.slice(active2.cursor + 1).find((x) => x.type === "work"), w = active2.snapshot.workout;
    const phase = { warmup: "\u0627\u0644\u0625\u062D\u0645\u0627\u0621", cooldown: "\u0627\u0644\u062A\u0647\u062F\u0626\u0629", aerobic: "\u0627\u0644\u0642\u0633\u0645 \u0627\u0644\u0647\u0648\u0627\u0626\u064A", strength: "\u0627\u0644\u0642\u0648\u0629", main: "\u0627\u0644\u062A\u0645\u0627\u0631\u064A\u0646" }[s.block] || "\u0627\u0644\u062A\u0645\u0627\u0631\u064A\u0646";
    const position = s.round ? `\u0627\u0644\u062F\u0648\u0631\u0629 ${s.round} \u0645\u0646 ${s.rounds}` : s.set && s.sets > 1 ? `\u0627\u0644\u0645\u062C\u0645\u0648\u0639\u0629 ${s.set} \u0645\u0646 ${s.sets}` : "";
    const context = [s.round ? `\u0627\u0644\u0645\u062D\u0637\u0629 ${s.station} \u0645\u0646 ${s.stations}` : "", s.side ? `${e?.counting.side_means || "\u0627\u0644\u062C\u0647\u0629"}: ${s.side === "right" ? "\u064A\u0645\u064A\u0646" : "\u064A\u0633\u0627\u0631"}` : ""].filter(Boolean).join(" \xB7 ");
    const cue = s.pauseSeconds ? `\u062A\u0648\u0642\u0641 ${s.pauseSeconds} \u062B\u0627\u0646\u064A\u0629 \u062F\u0627\u062E\u0644 \u0643\u0644 \u0639\u062F\u0651\u0629` : s.sides === 2 ? "\u0628\u0627\u0644\u062A\u0628\u0627\u062F\u0644 \xB7 \u0643\u0644 \u062C\u0647\u0629 \u062A\u064F\u062D\u0633\u0628 \u0645\u0646\u0641\u0631\u062F\u0629" : s.pace ? { gentle: "\u0645\u0634\u064A \u0647\u0627\u062F\u0626", progressive: "\u0627\u0631\u0641\u0639 \u0627\u0644\u0625\u064A\u0642\u0627\u0639 \u062A\u062F\u0631\u064A\u062C\u064A\u064B\u0627", active: "\u0625\u064A\u0642\u0627\u0639 \u0646\u0634\u064A\u0637 \u064A\u0633\u0645\u062D \u0628\u0627\u0644\u0643\u0644\u0627\u0645", slow: "\u0645\u0634\u064A \u0628\u0637\u064A\u0621", decelerating: "\u062E\u0641\u0651\u0641 \u0627\u0644\u0625\u064A\u0642\u0627\u0639 \u062A\u062F\u0631\u064A\u062C\u064A\u064B\u0627" }[s.pace] : "";
    const timerControls = timed ? `<div class="v-timer-actions">${button(active2.timer?.running ? "\u0625\u064A\u0642\u0627\u0641 \u0645\u0624\u0642\u062A" : active2.timer ? "\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u0645\u0624\u0642\u062A" : "\u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u0645\u0624\u0642\u062A", "timer", "secondary", 'id="timer-button"')}${button("+15 \u062B\u0627\u0646\u064A\u0629", "extend", "secondary", 'aria-label="\u0632\u064A\u0627\u062F\u0629 \u0627\u0644\u0648\u0642\u062A 15 \u062B\u0627\u0646\u064A\u0629"')}</div>` : "";
    const total = active2.snapshot.steps.length;
    return `<section class="v-player"><div class="v-player-head"><span>${names[w.program]} \xB7 ${sessionName(w.program, w.session)} \xB7 ${levelName(w.level)}</span>${button("\u062E\u0631\u0648\u062C", "leave", "text-btn")}</div><div class="v-segments" aria-label="\u0627\u0644\u062E\u0637\u0648\u0629 ${active2.cursor + 1} \u0645\u0646 ${total}">${active2.snapshot.steps.map((_, i) => `<i class="${i < active2.cursor ? "done" : i === active2.cursor ? "current" : ""}"></i>`).join("")}</div><div class="card v-stage ${isRest ? "v-rest" : "v-work"}"><header class="v-exercise-heading"><div class="v-phase-row"><span class="v-phase">${isRest ? "\u0627\u0633\u062A\u0631\u0627\u062D\u0629 \xB7 " : ""}${phase}</span>${position ? `<div class="v-position muted">${position ? `<span>${esc(position)}</span>` : ""}</div>` : ""}</div><div class="v-title"><h1>${isRest ? "\u0648\u0642\u062A \u0644\u0644\u0631\u0627\u062D\u0629" : esc(movementName(s, active2.snapshot.exercises))}</h1>${!isRest ? button('<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 10v7M12 6v2"/></svg>', "instruction", "icon-btn", `data-id="${e.id}" aria-label="\u0643\u064A\u0641\u064A\u0629 \u0627\u0644\u0623\u062F\u0627\u0621"`) : ""}</div></header>${isRest ? `<div class="v-rest-center"><div class="v-clock" id="clock-ring"><span id="timer-text"></span></div><p class="small muted">\u0627\u0644\u062A\u0627\u0644\u064A: ${esc(next ? movementName(next, active2.snapshot.exercises) : "\u0627\u0646\u062A\u0647\u0627\u0621 \u0627\u0644\u062C\u0644\u0633\u0629")}</p></div>` : `<figure class="v-exercise-image is-loading" aria-busy="true"><div class="v-image-frame"><img src="assets/exercise-images/march.jpg" alt="\u0639\u064A\u0646\u0629 \u0645\u0624\u0642\u062A\u0629 \u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0634\u064A \u0644\u0627\u062E\u062A\u0628\u0627\u0631 \u0627\u0644\u0639\u0631\u0636" decoding="async"><span class="v-image-fallback" hidden>\u062A\u0639\u0630\u0651\u0631 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0639\u064A\u0646\u0629 \u2014 \u0627\u0641\u062A\u062D \u0643\u064A\u0641\u064A\u0629 \u0627\u0644\u0623\u062F\u0627\u0621</span></div><figcaption class="v-exercise-caption">${context ? `<strong>${esc(context)}</strong>` : ""}${cue ? `<span>${esc(cue)}</span>` : ""}<small>\u0639\u064A\u0646\u0629 \u0639\u0631\u0636 \u0645\u0624\u0642\u062A\u0629 \xB7 \u0644\u064A\u0633\u062A \u0634\u0631\u062D\u064B\u0627 \u0644\u0644\u062A\u0645\u0631\u064A\u0646 \u0627\u0644\u062D\u0627\u0644\u064A</small></figcaption></figure><div class="v-dose-panel"><div class="v-target"><span class="small muted">\u0627\u0644\u0647\u062F\u0641</span><strong class="v-goal">${goal(s)}</strong></div>${timed ? '<div class="v-timer-readout"><span class="small muted">\u0627\u0644\u0648\u0642\u062A \u0627\u0644\u0645\u062A\u0628\u0642\u064A</span><div class="timer-value" id="timer-text"></div></div>' : ""}</div>`}<div class="v-controls">${timerControls}${button(isRest ? "\u0625\u0646\u0647\u0627\u0621 \u0627\u0644\u0631\u0627\u062D\u0629" : "\u0623\u0646\u0647\u064A\u062A \u0627\u0644\u062A\u0645\u0631\u064A\u0646", isRest ? "finish-rest" : "done", "primary full v-finish")}</div></div><div class="v-session-footer">${button(isRest ? "\u062A\u062E\u0637\u064A \u0627\u0644\u0631\u0627\u062D\u0629" : "\u062A\u062E\u0637\u064A \u0627\u0644\u062A\u0645\u0631\u064A\u0646", "skip", "secondary")}${button("\u0625\u0646\u0647\u0627\u0621 \u0627\u0644\u062C\u0644\u0633\u0629 \u0645\u0628\u0643\u0631\u064B\u0627", "stop", "text-btn")}</div></section>`;
  }

  // js/data/content.mjs
  var content = {
    "contentVersion": "2.0.0-alpha.1",
    "schemaVersion": 1,
    "exercises": [
      {
        "id": "march",
        "name_ar": "\u0645\u0634\u064A \u0628\u0627\u0644\u0645\u0643\u0627\u0646: \u0647\u0627\u062F\u0626/\u0645\u062A\u062F\u0631\u062C/\u0646\u0634\u064A\u0637/\u0628\u0637\u064A\u0621",
        "equipment": "\u0644\u0627 \u0634\u064A\u0621",
        "setup": "\u0642\u0641 \u0641\u064A \u0645\u0633\u0627\u062D\u0629 \u062E\u0627\u0644\u064A\u0629 \u0648\u0642\u062F\u0645\u0627\u0643 \u0639\u0644\u0649 \u0627\u0644\u0623\u0631\u0636 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0645\u0631\u062A\u062E\u064A\u062A\u0627\u0646.",
        "steps": [
          "\u0627\u0631\u0641\u0639 \u0642\u062F\u0645\u064B\u0627 \u062B\u0645 \u0627\u0644\u0623\u062E\u0631\u0649 \u0628\u062E\u0637\u0648\u0627\u062A \u0642\u0635\u064A\u0631\u0629 \u0641\u064A \u0645\u0643\u0627\u0646\u0643\u060C \u0648\u0641\u0642 \u0627\u0644\u0625\u064A\u0642\u0627\u0639 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0644\u0644\u062C\u0644\u0633\u0629.",
          "\u0648\u0627\u0635\u0644 \u062F\u0648\u0646 \u0642\u0641\u0632\u060C \u0648\u062E\u0641\u0641 \u0627\u0644\u0625\u064A\u0642\u0627\u0639 \u0641\u064A \u0627\u0644\u062A\u0647\u062F\u0626\u0629 \u0645\u0639 \u062A\u0646\u0641\u0633 \u0645\u0631\u064A\u062D."
        ],
        "common_error": "\u0644\u0627 \u062A\u062D\u0648\u0651\u0644 \u0627\u0644\u0645\u0634\u064A \u0625\u0644\u0649 \u0631\u0643\u0636 \u0623\u0648 \u062A\u0631\u0641\u0639 \u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646 \u0628\u0627\u0644\u0642\u0648\u0629.",
        "counting": {
          "unit": "seconds",
          "mode": "continuous",
          "side_means": null,
          "rule_ar": "\u064A\u062D\u062F\u062F \u0627\u0644\u0645\u0624\u0642\u062A \u0627\u0644\u0645\u062F\u0629\u061B \u0644\u0627 \u064A\u0637\u0644\u0628 \u0639\u062F\u0651 \u0627\u0644\u062D\u0631\u0643\u0627\u062A."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-a-1",
          "circuit-a-2",
          "circuit-a-3",
          "circuit-b-1",
          "circuit-b-2",
          "circuit-b-3",
          "circuit-c-1",
          "circuit-c-2",
          "circuit-c-3",
          "foundation-a-1",
          "foundation-a-2",
          "foundation-a-3",
          "foundation-b-1",
          "foundation-b-2",
          "foundation-b-3",
          "foundation-c-1",
          "foundation-c-2",
          "foundation-c-3",
          "hybrid-a-1",
          "hybrid-a-2",
          "hybrid-a-3",
          "hybrid-b-1",
          "hybrid-b-2",
          "hybrid-b-3",
          "hybrid-c-1",
          "hybrid-c-2",
          "hybrid-c-3",
          "move-a-1",
          "move-a-2",
          "move-a-3",
          "move-b-1",
          "move-b-2",
          "move-b-3",
          "move-c-1",
          "move-c-2",
          "move-c-3",
          "strength-a-1",
          "strength-a-2",
          "strength-a-3",
          "strength-b-1",
          "strength-b-2",
          "strength-b-3",
          "strength-c-1",
          "strength-c-2",
          "strength-c-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "shoulder-roll",
        "name_ar": "\u0644\u0641 \u0627\u0644\u0643\u062A\u0641\u064A\u0646 \u0644\u0644\u062E\u0644\u0641",
        "equipment": "\u0644\u0627 \u0634\u064A\u0621",
        "setup": "\u0642\u0641 \u0628\u0627\u0633\u062A\u0642\u0627\u0645\u0629 \u0645\u0631\u064A\u062D\u0629 \u0648\u0627\u062A\u0631\u0643 \u0627\u0644\u0630\u0631\u0627\u0639\u064A\u0646 \u0642\u0631\u0628 \u0627\u0644\u062C\u0627\u0646\u0628\u064A\u0646.",
        "steps": [
          "\u0627\u0631\u0641\u0639 \u0627\u0644\u0643\u062A\u0641\u064A\u0646 \u0642\u0644\u064A\u0644\u064B\u0627 \u062B\u0645 \u062D\u0631\u0651\u0643\u0647\u0645\u0627 \u0644\u0644\u062E\u0644\u0641 \u0648\u0644\u0644\u0623\u0633\u0641\u0644 \u0628\u062F\u0627\u0626\u0631\u0629 \u0645\u0631\u064A\u062D\u0629.",
          "\u0639\u062F \u0644\u0648\u0636\u0639 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0648\u0623\u0643\u0645\u0644 \u0627\u0644\u0644\u0641\u0627\u062A \u0644\u0644\u062E\u0644\u0641."
        ],
        "common_error": "\u0644\u0627 \u062A\u062D\u0631\u0643 \u0627\u0644\u0631\u0623\u0633 \u0645\u0639 \u0627\u0644\u0643\u062A\u0641\u064A\u0646 \u0623\u0648 \u062A\u0636\u063A\u0637\u0647\u0645\u0627 \u0628\u0639\u0646\u0641.",
        "counting": {
          "unit": "reps",
          "mode": "bilateral",
          "side_means": null,
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-a-1",
          "circuit-a-2",
          "circuit-a-3",
          "circuit-b-1",
          "circuit-b-2",
          "circuit-b-3",
          "circuit-c-1",
          "circuit-c-2",
          "circuit-c-3",
          "foundation-a-1",
          "foundation-a-2",
          "foundation-a-3",
          "foundation-b-1",
          "foundation-b-2",
          "foundation-b-3",
          "foundation-c-1",
          "foundation-c-2",
          "foundation-c-3",
          "hybrid-a-1",
          "hybrid-a-2",
          "hybrid-a-3",
          "hybrid-b-1",
          "hybrid-b-2",
          "hybrid-b-3",
          "hybrid-c-1",
          "hybrid-c-2",
          "hybrid-c-3",
          "move-a-1",
          "move-a-2",
          "move-a-3",
          "move-b-1",
          "move-b-2",
          "move-b-3",
          "move-c-1",
          "move-c-2",
          "move-c-3",
          "strength-a-1",
          "strength-a-2",
          "strength-a-3",
          "strength-b-1",
          "strength-b-2",
          "strength-b-3",
          "strength-c-1",
          "strength-c-2",
          "strength-c-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "neck-turn-seated",
        "name_ar": "\u0627\u0644\u062A\u0641\u0627\u062A \u0627\u0644\u0631\u0642\u0628\u0629 \u062C\u0627\u0644\u0633\u064B\u0627",
        "equipment": "\u0643\u0631\u0633\u064A",
        "setup": "\u0627\u062C\u0644\u0633 \u0639\u0644\u0649 \u0643\u0631\u0633\u064A \u062B\u0627\u0628\u062A\u060C \u0648\u0627\u0644\u0642\u062F\u0645\u0627\u0646 \u0639\u0644\u0649 \u0627\u0644\u0623\u0631\u0636 \u0648\u0627\u0644\u0643\u062A\u0641\u0627\u0646 \u0645\u0631\u062A\u062E\u064A\u0627\u0646.",
        "steps": [
          "\u0627\u0644\u062A\u0641\u062A \u0625\u0644\u0649 \u0627\u0644\u064A\u0645\u064A\u0646 \u0636\u0645\u0646 \u0645\u062F\u0649 \u0645\u0631\u064A\u062D \u0645\u0639 \u0628\u0642\u0627\u0621 \u0627\u0644\u062C\u0630\u0639 \u0645\u0648\u0627\u062C\u0647\u064B\u0627 \u0644\u0644\u0623\u0645\u0627\u0645.",
          "\u0639\u062F \u0644\u0644\u0648\u0633\u0637 \u062B\u0645 \u0643\u0631\u0631 \u064A\u0633\u0627\u0631\u064B\u0627\u061B \u0627\u0644\u062A\u0648\u0642\u0641 \u062F\u0627\u062E\u0644 \u0627\u0644\u062D\u0631\u0643\u0629 \u0628\u062D\u0633\u0628 \u0627\u0644\u0648\u0635\u0641\u0629."
        ],
        "common_error": "\u0644\u0627 \u062A\u0633\u062D\u0628 \u0627\u0644\u0631\u0623\u0633 \u0628\u0627\u0644\u064A\u062F\u060C \u0648\u062A\u0648\u0642\u0641 \u0639\u0646\u062F \u0623\u0644\u0645 \u0623\u0648 \u062F\u0648\u062E\u0629.",
        "counting": {
          "unit": "reps",
          "mode": "alternating",
          "side_means": "\u0627\u062A\u062C\u0627\u0647 \u0627\u0644\u0627\u0644\u062A\u0641\u0627\u062A",
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629. \u0643\u0644 \u062C\u0647\u0629 \u062A\u064F\u062D\u0633\u0628 \u0645\u0646\u0641\u0631\u062F\u0629\u061B \u064A\u0645\u064A\u0646 \u062B\u0645 \u064A\u0633\u0627\u0631 \u0628\u0627\u0644\u062A\u0628\u0627\u062F\u0644\u060C \u062F\u0648\u0646 \u0631\u0627\u062D\u0629 \u0644\u0643\u0644 \u0639\u062F\u0651\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "move-a-1",
          "move-a-2",
          "move-a-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "sit-stand",
        "name_ar": "\u062C\u0644\u0648\u0633 \u0648\u0648\u0642\u0648\u0641",
        "equipment": "\u0643\u0631\u0633\u064A",
        "setup": "\u0627\u062C\u0644\u0633 \u0639\u0644\u0649 \u0643\u0631\u0633\u064A \u062B\u0627\u0628\u062A \u063A\u064A\u0631 \u0645\u0646\u0632\u0644\u0642\u060C \u0648\u0627\u0644\u0642\u062F\u0645\u0627\u0646 \u0628\u0639\u0631\u0636 \u0645\u0631\u064A\u062D \u0648\u0627\u0644\u064A\u062F\u0627\u0646 \u0623\u0645\u0627\u0645\u0643 \u062F\u0648\u0646 \u062F\u0641\u0639 \u0627\u0644\u0645\u0642\u0639\u062F.",
        "steps": [
          "\u0645\u0644 \u0628\u0627\u0644\u062C\u0630\u0639 \u0642\u0644\u064A\u0644\u064B\u0627 \u0644\u0644\u0623\u0645\u0627\u0645 \u0648\u0627\u062F\u0641\u0639 \u0628\u0627\u0644\u0642\u062F\u0645\u064A\u0646 \u0625\u0644\u0649 \u0627\u0644\u0648\u0642\u0648\u0641.",
          "\u0627\u0631\u062C\u0639 \u0625\u0644\u0649 \u062C\u0644\u0648\u0633 \u0641\u0639\u0644\u064A \u0628\u062A\u062D\u0643\u0645\u061B \u0647\u0630\u0647 \u062F\u0648\u0631\u0629 \u0648\u0627\u062D\u062F\u0629."
        ],
        "common_error": "\u0644\u0627 \u062A\u0633\u0642\u0637 \u0639\u0644\u0649 \u0627\u0644\u0645\u0642\u0639\u062F \u0623\u0648 \u062A\u0633\u062A\u062E\u062F\u0645 \u0643\u0631\u0633\u064A\u064B\u0627 \u0628\u0639\u062C\u0644\u0627\u062A.",
        "counting": {
          "unit": "reps",
          "mode": "bilateral",
          "side_means": null,
          "rule_ar": "\u0645\u0646 \u0627\u0644\u062C\u0644\u0648\u0633 \u0625\u0644\u0649 \u0627\u0644\u0648\u0642\u0648\u0641 \u062B\u0645 \u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u062C\u0644\u0648\u0633 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "foundation-a-1",
          "foundation-a-2",
          "foundation-a-3",
          "foundation-b-1",
          "foundation-b-2",
          "foundation-b-3",
          "foundation-c-1",
          "foundation-c-2",
          "foundation-c-3",
          "move-a-1",
          "move-c-1"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "chair-squat",
        "name_ar": "\u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u0644\u0627\u0645\u0633\u0629 \u0627\u0644\u0643\u0631\u0633\u064A",
        "equipment": "\u0643\u0631\u0633\u064A",
        "setup": "\u0642\u0641 \u0623\u0645\u0627\u0645 \u0643\u0631\u0633\u064A \u062B\u0627\u0628\u062A \u062E\u0644\u0641\u0643\u060C \u0648\u0627\u0644\u0642\u062F\u0645\u0627\u0646 \u0628\u0639\u0631\u0636 \u0645\u0631\u064A\u062D \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0623\u0645\u0627\u0645\u0643.",
        "steps": [
          "\u0627\u062B\u0646 \u0627\u0644\u0648\u0631\u0643\u064A\u0646 \u0648\u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646 \u0648\u0627\u0646\u0632\u0644 \u0628\u0627\u062A\u062C\u0627\u0647 \u0627\u0644\u0645\u0642\u0639\u062F.",
          "\u0627\u0644\u0645\u0633 \u0627\u0644\u0645\u0642\u0639\u062F \u0628\u062E\u0641\u0629 \u062B\u0645 \u0642\u0641\u061B \u0644\u0627 \u062A\u0633\u062A\u0642\u0631 \u062C\u0627\u0644\u0633\u064B\u0627."
        ],
        "common_error": "\u0644\u0627 \u062A\u0631\u0645\u0650 \u0648\u0632\u0646\u0643 \u0639\u0644\u0649 \u0627\u0644\u0643\u0631\u0633\u064A \u0623\u0648 \u062A\u0631\u0641\u0639 \u0627\u0644\u0643\u0639\u0628\u064A\u0646.",
        "counting": {
          "unit": "reps",
          "mode": "bilateral",
          "side_means": null,
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-a-1",
          "circuit-a-2",
          "circuit-a-3",
          "circuit-b-1",
          "circuit-b-2",
          "circuit-b-3",
          "circuit-c-1",
          "circuit-c-2",
          "circuit-c-3",
          "foundation-a-1",
          "foundation-b-1",
          "hybrid-a-1",
          "hybrid-a-2",
          "hybrid-a-3",
          "hybrid-b-1",
          "hybrid-b-2",
          "hybrid-b-3",
          "hybrid-c-1",
          "hybrid-c-2",
          "hybrid-c-3",
          "move-a-2",
          "move-c-2",
          "strength-a-1",
          "strength-a-2",
          "strength-a-3",
          "strength-b-1",
          "strength-b-2",
          "strength-b-3",
          "strength-c-1",
          "strength-c-2",
          "strength-c-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "squat",
        "name_ar": "\u0642\u0631\u0641\u0635\u0627\u0621 \u062D\u0631\u0629",
        "equipment": "\u0644\u0627 \u0634\u064A\u0621",
        "setup": "\u0642\u0641 \u0648\u0642\u062F\u0645\u0627\u0643 \u0628\u0639\u0631\u0636 \u0645\u0631\u064A\u062D \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0623\u0645\u0627\u0645\u0643 \u0644\u0644\u062A\u0648\u0627\u0632\u0646.",
        "steps": [
          "\u0627\u062B\u0646 \u0627\u0644\u0648\u0631\u0643\u064A\u0646 \u0648\u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646 \u0648\u0627\u0646\u0632\u0644 \u0644\u0639\u0645\u0642 \u062A\u0633\u062A\u0637\u064A\u0639 \u0627\u0644\u062A\u062D\u0643\u0645 \u0641\u064A\u0647.",
          "\u0642\u0641 \u0628\u062A\u062D\u0643\u0645\u061B \u0623\u0636\u0641 \u0627\u0644\u062A\u0648\u0642\u0641 \u0623\u0633\u0641\u0644 \u0627\u0644\u062D\u0631\u0643\u0629 \u0641\u0642\u0637 \u0639\u0646\u062F\u0645\u0627 \u062A\u0646\u0635 \u0627\u0644\u0648\u0635\u0641\u0629 \u0639\u0644\u064A\u0647."
        ],
        "common_error": "\u0644\u0627 \u062A\u0641\u0631\u0636 \u0639\u0645\u0642\u064B\u0627 \u0645\u0639\u064A\u0646\u064B\u0627 \u0623\u0648 \u062A\u062F\u0639 \u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646 \u062A\u0646\u0647\u0627\u0631\u0627\u0646 \u0644\u0644\u062F\u0627\u062E\u0644.",
        "counting": {
          "unit": "reps",
          "mode": "bilateral",
          "side_means": null,
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-a-2",
          "circuit-a-3",
          "circuit-c-1",
          "circuit-c-2",
          "circuit-c-3",
          "foundation-a-2",
          "foundation-a-3",
          "hybrid-a-1",
          "hybrid-a-2",
          "hybrid-a-3",
          "move-a-3",
          "strength-a-1",
          "strength-a-2",
          "strength-a-3",
          "strength-c-1",
          "strength-c-2",
          "strength-c-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "wall-push",
        "name_ar": "\u0636\u063A\u0637 \u062D\u0627\u0626\u0637",
        "equipment": "\u062D\u0627\u0626\u0637",
        "setup": "\u0636\u0639 \u0631\u0627\u062D\u062A\u064A\u0643 \u0639\u0644\u0649 \u062D\u0627\u0626\u0637 \u062B\u0627\u0628\u062A \u0642\u0631\u0628 \u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0643\u062A\u0641\u064A\u0646 \u0648\u0623\u0628\u0639\u062F \u0627\u0644\u0642\u062F\u0645\u064A\u0646 \u0644\u062A\u0643\u0648\u064A\u0646 \u0645\u064A\u0644 \u0645\u0631\u064A\u062D.",
        "steps": [
          "\u0627\u062B\u0646 \u0627\u0644\u0645\u0631\u0641\u0642\u064A\u0646 \u0644\u064A\u0642\u062A\u0631\u0628 \u0627\u0644\u062C\u0633\u0645 \u0645\u0646 \u0627\u0644\u062D\u0627\u0626\u0637 \u0643\u0648\u062D\u062F\u0629 \u0648\u0627\u062D\u062F\u0629.",
          "\u0627\u062F\u0641\u0639 \u0627\u0644\u062D\u0627\u0626\u0637 \u0644\u0644\u0639\u0648\u062F\u0629 \u0645\u0639 \u0627\u0644\u0632\u0641\u064A\u0631."
        ],
        "common_error": "\u0644\u0627 \u062A\u0647\u0628\u0637 \u0628\u0627\u0644\u062D\u0648\u0636 \u0623\u0648 \u062A\u0631\u0641\u0639 \u0627\u0644\u0643\u062A\u0641\u064A\u0646 \u0646\u062D\u0648 \u0627\u0644\u0623\u0630\u0646\u064A\u0646.",
        "counting": {
          "unit": "reps",
          "mode": "bilateral",
          "side_means": null,
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-a-1",
          "circuit-a-2",
          "circuit-a-3",
          "circuit-b-1",
          "circuit-b-2",
          "circuit-b-3",
          "circuit-c-1",
          "circuit-c-2",
          "circuit-c-3",
          "foundation-a-1",
          "foundation-b-1",
          "foundation-b-2",
          "foundation-c-1",
          "hybrid-a-1",
          "hybrid-a-2",
          "hybrid-a-3",
          "hybrid-b-1",
          "hybrid-b-2",
          "hybrid-b-3",
          "hybrid-c-1",
          "hybrid-c-2",
          "hybrid-c-3",
          "move-a-1",
          "move-a-2",
          "move-a-3",
          "move-c-1",
          "move-c-3",
          "strength-a-1",
          "strength-a-2",
          "strength-a-3",
          "strength-b-1",
          "strength-b-2",
          "strength-b-3",
          "strength-c-1",
          "strength-c-2",
          "strength-c-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "wall-slide",
        "name_ar": "\u0627\u0646\u0632\u0644\u0627\u0642 \u0627\u0644\u0630\u0631\u0627\u0639\u064A\u0646 \u0628\u0627\u0644\u062D\u0627\u0626\u0637",
        "equipment": "\u062D\u0627\u0626\u0637",
        "setup": "\u0642\u0641 \u0648\u0638\u0647\u0631\u0643 \u0642\u0631\u064A\u0628 \u0645\u0646 \u0627\u0644\u062D\u0627\u0626\u0637 \u0648\u0642\u062F\u0645\u0627\u0643 \u0623\u0645\u0627\u0645\u0647 \u0642\u0644\u064A\u0644\u064B\u0627\u061B \u0627\u062B\u0646 \u0627\u0644\u0645\u0631\u0641\u0642\u064A\u0646 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0628\u0634\u0643\u0644 W.",
        "steps": [
          "\u062D\u0631\u0651\u0643 \u0627\u0644\u0630\u0631\u0627\u0639\u064A\u0646 \u0644\u0644\u0623\u0639\u0644\u0649 \u0636\u0645\u0646 \u0645\u062F\u0649 \u0645\u0631\u064A\u062D.",
          "\u0623\u0639\u062F\u0647\u0645\u0627 \u0644\u0648\u0636\u0639 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0628\u0628\u0637\u0621."
        ],
        "common_error": "\u0644\u0627 \u062A\u0642\u0648\u0651\u0633 \u0623\u0633\u0641\u0644 \u0627\u0644\u0638\u0647\u0631 \u0623\u0648 \u062A\u062C\u0628\u0631 \u0627\u0644\u0631\u0633\u063A\u064A\u0646 \u0639\u0644\u0649 \u0645\u0644\u0627\u0645\u0633\u0629 \u0627\u0644\u062D\u0627\u0626\u0637.",
        "counting": {
          "unit": "reps",
          "mode": "bilateral",
          "side_means": null,
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-a-1",
          "circuit-a-2",
          "circuit-a-3",
          "circuit-b-1",
          "circuit-b-2",
          "circuit-b-3",
          "circuit-c-1",
          "circuit-c-2",
          "circuit-c-3",
          "foundation-a-1",
          "foundation-a-2",
          "foundation-a-3",
          "foundation-b-1",
          "foundation-b-2",
          "foundation-b-3",
          "foundation-c-1",
          "foundation-c-2",
          "foundation-c-3",
          "hybrid-a-1",
          "hybrid-a-2",
          "hybrid-a-3",
          "hybrid-b-1",
          "hybrid-b-2",
          "hybrid-b-3",
          "hybrid-c-1",
          "hybrid-c-2",
          "hybrid-c-3",
          "move-a-1",
          "move-c-2",
          "strength-a-1",
          "strength-a-2",
          "strength-a-3",
          "strength-b-1",
          "strength-b-2",
          "strength-b-3",
          "strength-c-1",
          "strength-c-2",
          "strength-c-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "cross-march",
        "name_ar": "\u0645\u0634\u064A \u0646\u0634\u064A\u0637 \u0628\u0630\u0631\u0627\u0639 \u0645\u0642\u0627\u0628\u0644\u0629",
        "equipment": "\u0644\u0627 \u0634\u064A\u0621",
        "setup": "\u0642\u0641 \u0641\u064A \u0645\u0633\u0627\u062D\u0629 \u062E\u0627\u0644\u064A\u0629 \u0645\u0639 \u062B\u0646\u064A \u0645\u0631\u064A\u062D \u0644\u0644\u0645\u0631\u0641\u0642\u064A\u0646.",
        "steps": [
          "\u0627\u0631\u0641\u0639 \u0627\u0644\u0631\u0643\u0628\u0629 \u0627\u0644\u064A\u0645\u0646\u0649 \u0645\u0639 \u062A\u062D\u0631\u064A\u0643 \u0627\u0644\u0630\u0631\u0627\u0639 \u0627\u0644\u064A\u0633\u0631\u0649 \u0644\u0644\u0623\u0645\u0627\u0645.",
          "\u0623\u0646\u0632\u0644 \u0627\u0644\u0642\u062F\u0645 \u0648\u0628\u062F\u0651\u0644 \u0625\u0644\u0649 \u0627\u0644\u0631\u0643\u0628\u0629 \u0627\u0644\u064A\u0633\u0631\u0649 \u0648\u0627\u0644\u0630\u0631\u0627\u0639 \u0627\u0644\u064A\u0645\u0646\u0649\u061B \u0648\u0627\u0635\u0644 \u062F\u0648\u0646 \u0642\u0641\u0632."
        ],
        "common_error": "\u0644\u0627 \u062A\u062D\u0648\u0651\u0644 \u0627\u0644\u062D\u0631\u0643\u0629 \u0625\u0644\u0649 \u0644\u0645\u0633 \u0627\u0644\u0631\u0643\u0628\u0629 \u0623\u0648 \u0644\u0641 \u0642\u0648\u064A \u0644\u0644\u062C\u0630\u0639.",
        "counting": {
          "unit": "seconds",
          "mode": "continuous",
          "side_means": null,
          "rule_ar": "\u064A\u062D\u062F\u062F \u0627\u0644\u0645\u0624\u0642\u062A \u0627\u0644\u0645\u062F\u0629\u061B \u0644\u0627 \u064A\u0637\u0644\u0628 \u0639\u062F\u0651 \u0627\u0644\u062D\u0631\u0643\u0627\u062A."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-a-2",
          "circuit-b-2",
          "foundation-a-2",
          "foundation-a-3",
          "hybrid-a-2",
          "hybrid-b-2",
          "move-a-2",
          "move-a-3",
          "move-b-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "bridge",
        "name_ar": "\u062C\u0633\u0631 \u0628\u0627\u0644\u0642\u062F\u0645\u064A\u0646",
        "equipment": "\u0628\u0633\u0627\u0637",
        "setup": "\u0627\u0633\u062A\u0644\u0642\u0650 \u0639\u0644\u0649 \u0627\u0644\u0628\u0633\u0627\u0637\u060C \u0648\u0627\u0644\u0631\u0643\u0628\u062A\u0627\u0646 \u0645\u062B\u0646\u064A\u062A\u0627\u0646 \u0648\u0627\u0644\u0642\u062F\u0645\u0627\u0646 \u062B\u0627\u0628\u062A\u062A\u0627\u0646 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0642\u0631\u0628 \u0627\u0644\u062C\u0633\u0645.",
        "steps": [
          "\u0627\u0631\u0641\u0639 \u0627\u0644\u062D\u0648\u0636 \u0628\u062A\u062D\u0643\u0645 \u0645\u0639 \u0628\u0642\u0627\u0621 \u0627\u0644\u0623\u0636\u0644\u0627\u0639 \u0648\u0627\u0644\u062D\u0648\u0636 \u0645\u062A\u0648\u0627\u0632\u0646\u064A\u0646.",
          "\u0623\u0646\u0632\u0644 \u0627\u0644\u062D\u0648\u0636 \u0628\u0647\u062F\u0648\u0621\u061B \u0627\u0644\u062A\u0648\u0642\u0641 \u0623\u0639\u0644\u0649 \u0627\u0644\u062D\u0631\u0643\u0629 \u062A\u062D\u062F\u062F\u0647 \u0627\u0644\u0648\u0635\u0641\u0629."
        ],
        "common_error": "\u0644\u0627 \u062A\u0631\u0641\u0639 \u0627\u0644\u062D\u0648\u0636 \u0628\u062A\u0642\u0648\u064A\u0633 \u0623\u0633\u0641\u0644 \u0627\u0644\u0638\u0647\u0631.",
        "counting": {
          "unit": "reps",
          "mode": "bilateral",
          "side_means": null,
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-a-1",
          "circuit-a-2",
          "circuit-a-3",
          "circuit-b-1",
          "circuit-b-2",
          "foundation-a-1",
          "foundation-a-2",
          "foundation-a-3",
          "foundation-b-1",
          "foundation-b-2",
          "foundation-b-3",
          "hybrid-b-1",
          "hybrid-b-2",
          "move-a-2",
          "move-a-3",
          "move-c-2",
          "move-c-3",
          "strength-a-1",
          "strength-a-2",
          "strength-a-3",
          "strength-b-1"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "heel-slide",
        "name_ar": "\u0627\u0646\u0632\u0644\u0627\u0642 \u0627\u0644\u0643\u0639\u0628 \u0628\u0627\u0644\u062A\u0628\u0627\u062F\u0644",
        "equipment": "\u0628\u0633\u0627\u0637",
        "setup": "\u0627\u0633\u062A\u0644\u0642\u0650 \u0648\u0627\u0644\u0631\u0643\u0628\u062A\u0627\u0646 \u0645\u062B\u0646\u064A\u062A\u0627\u0646 \u0648\u0627\u0644\u0642\u062F\u0645\u0627\u0646 \u0639\u0644\u0649 \u0627\u0644\u0628\u0633\u0627\u0637.",
        "steps": [
          "\u0627\u0632\u0644\u0642 \u0643\u0639\u0628\u064B\u0627 \u0628\u0639\u064A\u062F\u064B\u0627 \u0639\u0646 \u0627\u0644\u062D\u0648\u0636 \u0645\u0639 \u0628\u0642\u0627\u0621 \u0627\u0644\u0643\u0639\u0628 \u0645\u0644\u0627\u0645\u0633\u064B\u0627 \u0644\u0644\u0623\u0631\u0636.",
          "\u0623\u0639\u062F \u0627\u0644\u0642\u062F\u0645 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u062B\u0645 \u0628\u062F\u0651\u0644 \u0627\u0644\u0631\u062C\u0644."
        ],
        "common_error": "\u0644\u0627 \u062A\u0631\u0641\u0639 \u0627\u0644\u0642\u062F\u0645 \u0639\u0646 \u0627\u0644\u0628\u0633\u0627\u0637 \u0623\u0648 \u062A\u0645\u062F \u0625\u0644\u0649 \u0645\u062F\u0649 \u064A\u0641\u0642\u062F\u0643 \u062B\u0628\u0627\u062A \u0627\u0644\u062D\u0648\u0636.",
        "counting": {
          "unit": "reps",
          "mode": "alternating",
          "side_means": "\u0627\u0644\u0631\u062C\u0644 \u0627\u0644\u0645\u062A\u062D\u0631\u0643\u0629",
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629. \u0643\u0644 \u062C\u0647\u0629 \u062A\u064F\u062D\u0633\u0628 \u0645\u0646\u0641\u0631\u062F\u0629\u061B \u064A\u0645\u064A\u0646 \u062B\u0645 \u064A\u0633\u0627\u0631 \u0628\u0627\u0644\u062A\u0628\u0627\u062F\u0644\u060C \u062F\u0648\u0646 \u0631\u0627\u062D\u0629 \u0644\u0643\u0644 \u0639\u062F\u0651\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-c-1",
          "foundation-b-1",
          "hybrid-b-1",
          "move-a-2",
          "move-c-2",
          "move-c-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "bird-dog",
        "name_ar": "Bird Dog",
        "equipment": "\u0628\u0633\u0627\u0637",
        "setup": "\u0627\u0628\u062F\u0623 \u0639\u0644\u0649 \u0627\u0644\u064A\u062F\u064A\u0646 \u0648\u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646\u060C \u0627\u0644\u064A\u062F\u0627\u0646 \u062A\u062D\u062A \u0627\u0644\u0643\u062A\u0641\u064A\u0646 \u0648\u0627\u0644\u0631\u0643\u0628\u062A\u0627\u0646 \u062A\u062D\u062A \u0627\u0644\u0648\u0631\u0643\u064A\u0646.",
        "steps": [
          "\u0645\u062F \u0631\u062C\u0644\u064B\u0627 \u0644\u0644\u062E\u0644\u0641 \u0648\u0627\u0644\u0630\u0631\u0627\u0639 \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u0623\u0645\u0627\u0645 \u062F\u0648\u0646 \u0631\u0641\u0639\u0647\u0645\u0627 \u0641\u0648\u0642 \u0627\u0644\u062C\u0630\u0639.",
          "\u0639\u062F \u0625\u0644\u0649 \u0648\u0636\u0639 \u0627\u0644\u0623\u0631\u0628\u0639 \u062B\u0645 \u0628\u062F\u0651\u0644\u061B \u0627\u0644\u062A\u0648\u0642\u0641 \u0625\u0646 \u0648\u064F\u062C\u062F \u062A\u062D\u062F\u062F\u0647 \u0627\u0644\u0648\u0635\u0641\u0629."
        ],
        "common_error": "\u0644\u0627 \u062A\u062F\u0631 \u0627\u0644\u062D\u0648\u0636 \u0623\u0648 \u062A\u0631\u0641\u0639 \u0627\u0644\u0631\u0623\u0633 \u0644\u0644\u0623\u0639\u0644\u0649.",
        "counting": {
          "unit": "reps",
          "mode": "alternating",
          "side_means": "\u0627\u0644\u0631\u062C\u0644 \u0627\u0644\u0645\u0645\u062F\u0648\u062F\u0629 \u0645\u0639 \u0627\u0644\u0630\u0631\u0627\u0639 \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629",
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629. \u0643\u0644 \u062C\u0647\u0629 \u062A\u064F\u062D\u0633\u0628 \u0645\u0646\u0641\u0631\u062F\u0629\u061B \u064A\u0645\u064A\u0646 \u062B\u0645 \u064A\u0633\u0627\u0631 \u0628\u0627\u0644\u062A\u0628\u0627\u062F\u0644\u060C \u062F\u0648\u0646 \u0631\u0627\u062D\u0629 \u0644\u0643\u0644 \u0639\u062F\u0651\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-b-2",
          "circuit-b-3",
          "foundation-c-2",
          "foundation-c-3",
          "move-a-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "thoracic-rotation-seated",
        "name_ar": "\u062F\u0648\u0631\u0627\u0646 \u0635\u062F\u0631\u064A \u062C\u0627\u0644\u0633",
        "equipment": "\u0643\u0631\u0633\u064A",
        "setup": "\u0627\u062C\u0644\u0633 \u0648\u0642\u062F\u0645\u0627\u0643 \u062B\u0627\u0628\u062A\u062A\u0627\u0646 \u0648\u0627\u0644\u062D\u0648\u0636 \u0645\u0633\u062A\u0642\u0631\u060C \u0648\u0636\u0639 \u0627\u0644\u064A\u062F\u064A\u0646 \u0639\u0644\u0649 \u0627\u0644\u0635\u062F\u0631 \u062F\u0648\u0646 \u0636\u063A\u0637.",
        "steps": [
          "\u0623\u062F\u0631 \u0623\u0639\u0644\u0649 \u0627\u0644\u062C\u0630\u0639 \u0628\u0644\u0637\u0641 \u0625\u0644\u0649 \u062C\u0647\u0629 \u0648\u0627\u062D\u062F\u0629.",
          "\u0639\u062F \u0644\u0644\u0648\u0633\u0637 \u062B\u0645 \u0628\u062F\u0651\u0644 \u0627\u0644\u062C\u0647\u0629."
        ],
        "common_error": "\u0644\u0627 \u062A\u062D\u0631\u0643 \u0627\u0644\u062D\u0648\u0636 \u0645\u0639 \u0627\u0644\u062F\u0648\u0631\u0627\u0646 \u0623\u0648 \u062A\u062C\u0630\u0628 \u0627\u0644\u062C\u0633\u0645 \u0628\u0627\u0644\u064A\u062F\u064A\u0646.",
        "counting": {
          "unit": "reps",
          "mode": "alternating",
          "side_means": "\u0627\u062A\u062C\u0627\u0647 \u0627\u0644\u062F\u0648\u0631\u0627\u0646",
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629. \u0643\u0644 \u062C\u0647\u0629 \u062A\u064F\u062D\u0633\u0628 \u0645\u0646\u0641\u0631\u062F\u0629\u061B \u064A\u0645\u064A\u0646 \u062B\u0645 \u064A\u0633\u0627\u0631 \u0628\u0627\u0644\u062A\u0628\u0627\u062F\u0644\u060C \u062F\u0648\u0646 \u0631\u0627\u062D\u0629 \u0644\u0643\u0644 \u0639\u062F\u0651\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "move-b-1",
          "move-b-2",
          "move-b-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "new_detail_documented",
        "qualified_review": "pending"
      },
      {
        "id": "wall-hinge",
        "name_ar": "\u062F\u0641\u0639 \u0627\u0644\u0648\u0631\u0643 \u0644\u0644\u062D\u0627\u0626\u0637",
        "equipment": "\u062D\u0627\u0626\u0637",
        "setup": "\u0642\u0641 \u0648\u0638\u0647\u0631\u0643 \u0644\u0644\u062D\u0627\u0626\u0637 \u0639\u0644\u0649 \u0645\u0633\u0627\u0641\u0629 \u0642\u0635\u064A\u0631\u0629\u060C \u0648\u0627\u0644\u0642\u062F\u0645\u0627\u0646 \u0628\u0639\u0631\u0636 \u0645\u0631\u064A\u062D \u0648\u0627\u0644\u0631\u0643\u0628\u062A\u0627\u0646 \u0645\u0631\u062A\u062E\u064A\u062A\u0627\u0646.",
        "steps": [
          "\u0627\u062F\u0641\u0639 \u0627\u0644\u0648\u0631\u0643 \u0644\u0644\u062E\u0644\u0641 \u0644\u064A\u0644\u0627\u0645\u0633 \u0627\u0644\u062D\u0627\u0626\u0637 \u0628\u062E\u0641\u0629 \u0645\u0639 \u0645\u064A\u0644 \u0627\u0644\u062C\u0630\u0639 \u0645\u0646 \u0627\u0644\u0648\u0631\u0643\u064A\u0646.",
          "\u0639\u062F \u0644\u0644\u0648\u0642\u0648\u0641 \u0628\u062A\u062D\u0643\u0645."
        ],
        "common_error": "\u0644\u0627 \u062A\u062D\u0648\u0644 \u0627\u0644\u062D\u0631\u0643\u0629 \u0625\u0644\u0649 \u0627\u0646\u062D\u0646\u0627\u0621 \u0645\u0646 \u0627\u0644\u062E\u0635\u0631 \u0623\u0648 \u0642\u0631\u0641\u0635\u0627\u0621 \u0639\u0645\u064A\u0642\u0629.",
        "counting": {
          "unit": "reps",
          "mode": "bilateral",
          "side_means": null,
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "foundation-a-1",
          "foundation-a-2",
          "foundation-a-3",
          "foundation-b-1",
          "foundation-b-2",
          "foundation-b-3",
          "foundation-c-1",
          "foundation-c-2",
          "foundation-c-3",
          "move-b-1",
          "move-b-2"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "supported-side-leg-raise",
        "name_ar": "\u0631\u0641\u0639 \u0631\u062C\u0644 \u062C\u0627\u0646\u0628\u064B\u0627 \u0628\u0645\u0633\u0627\u0646\u062F\u0629",
        "equipment": "\u062D\u0627\u0626\u0637",
        "setup": "\u0642\u0641 \u0642\u0631\u0628 \u0627\u0644\u062D\u0627\u0626\u0637 \u0648\u0636\u0639 \u064A\u062F\u064B\u0627 \u0639\u0644\u064A\u0647\u060C \u0648\u0627\u0644\u0642\u062F\u0645\u0627\u0646 \u0644\u0644\u0623\u0645\u0627\u0645 \u0648\u0627\u0644\u062C\u0630\u0639 \u0645\u0633\u062A\u0642\u064A\u0645.",
        "steps": [
          "\u0627\u0631\u0641\u0639 \u0627\u0644\u0631\u062C\u0644 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0642\u0644\u064A\u0644\u064B\u0627 \u0625\u0644\u0649 \u0627\u0644\u062C\u0627\u0646\u0628 \u0645\u0639 \u0628\u0642\u0627\u0621 \u0627\u0644\u062D\u0648\u0636 \u0645\u0633\u062A\u0648\u064A\u064B\u0627.",
          "\u0623\u0639\u062F\u0647\u0627 \u0644\u0644\u0623\u0631\u0636\u061B \u0623\u0643\u0645\u0644 \u0627\u0644\u062C\u0647\u0629 \u0642\u0628\u0644 \u0627\u0644\u062A\u0628\u062F\u064A\u0644."
        ],
        "common_error": "\u0644\u0627 \u062A\u0645\u0644 \u0628\u0627\u0644\u062C\u0630\u0639 \u0623\u0648 \u062A\u062F\u0648\u0631 \u0627\u0644\u0642\u062F\u0645 \u0644\u0644\u062E\u0627\u0631\u062C \u0644\u062A\u0632\u064A\u062F \u0627\u0644\u0627\u0631\u062A\u0641\u0627\u0639.",
        "counting": {
          "unit": "reps",
          "mode": "sequential",
          "side_means": "\u0627\u0644\u0631\u062C\u0644 \u0627\u0644\u0645\u062A\u062D\u0631\u0643\u0629",
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629. \u0623\u0643\u0645\u0644 \u0647\u062F\u0641 \u0627\u0644\u064A\u0645\u064A\u0646 \u062B\u0645 \u0641\u0627\u0635\u0644 \u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u0645\u062D\u062F\u062F \u0641\u064A \u0627\u0644\u062C\u0644\u0633\u0629 \u062B\u0645 \u0647\u062F\u0641 \u0627\u0644\u064A\u0633\u0627\u0631\u061B \u0627\u0644\u062C\u0647\u062A\u0627\u0646 \u0645\u0639\u064B\u0627 \u0645\u062C\u0645\u0648\u0639\u0629 \u0648\u0627\u062D\u062F\u0629 \u0623\u0648 \u0645\u062D\u0637\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "move-b-1"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "new_detail_documented",
        "qualified_review": "pending"
      },
      {
        "id": "calf-raise",
        "name_ar": "\u0631\u0641\u0639 \u0643\u0639\u0628\u064A\u0646 \u0628\u0645\u0633\u0627\u0646\u062F\u0629",
        "equipment": "\u062D\u0627\u0626\u0637",
        "setup": "\u0642\u0641 \u0639\u0644\u0649 \u0623\u0631\u0636 \u0645\u0633\u062A\u0648\u064A\u0629 \u0648\u0627\u0644\u064A\u062F\u0627\u0646 \u0639\u0644\u0649 \u0627\u0644\u062D\u0627\u0626\u0637 \u0644\u0644\u0645\u0633\u0627\u0646\u062F\u0629.",
        "steps": [
          "\u0627\u0631\u0641\u0639 \u0627\u0644\u0643\u0639\u0628\u064A\u0646 \u0645\u0639\u064B\u0627 \u0628\u062A\u062D\u0643\u0645 \u0645\u0639 \u0628\u0642\u0627\u0621 \u0645\u0642\u062F\u0645\u062A\u064A \u0627\u0644\u0642\u062F\u0645\u064A\u0646 \u0639\u0644\u0649 \u0627\u0644\u0623\u0631\u0636.",
          "\u0623\u0646\u0632\u0644 \u0627\u0644\u0643\u0639\u0628\u064A\u0646 \u0628\u0647\u062F\u0648\u0621."
        ],
        "common_error": "\u0644\u0627 \u062A\u0646\u0637 \u0623\u0648 \u062A\u062D\u0645\u0644 \u0627\u0644\u0648\u0632\u0646 \u0639\u0644\u0649 \u0627\u0644\u062D\u0627\u0641\u0629 \u0627\u0644\u062E\u0627\u0631\u062C\u064A\u0629 \u0644\u0644\u0642\u062F\u0645.",
        "counting": {
          "unit": "reps",
          "mode": "bilateral",
          "side_means": null,
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-b-1",
          "circuit-b-2",
          "circuit-b-3",
          "foundation-b-1",
          "foundation-b-2",
          "foundation-b-3",
          "move-b-1",
          "move-b-2",
          "move-b-3",
          "strength-b-1",
          "strength-b-2"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "supported-tandem",
        "name_ar": "\u0648\u0642\u0648\u0641 \u0645\u062A\u062F\u0631\u062C \u0628\u0645\u0633\u0627\u0646\u062F\u0629",
        "equipment": "\u062D\u0627\u0626\u0637",
        "setup": "\u0642\u0641 \u0628\u062C\u0627\u0646\u0628 \u0627\u0644\u062D\u0627\u0626\u0637 \u0645\u0639 \u0645\u0633\u0627\u0646\u062F\u0629 \u064A\u062F\u060C \u0648\u0642\u062F\u0651\u0645 \u0627\u0644\u0642\u062F\u0645 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629 \u0623\u0645\u0627\u0645 \u0627\u0644\u0623\u062E\u0631\u0649 \u0645\u0639 \u0641\u0635\u0644 \u062C\u0627\u0646\u0628\u064A \u0628\u0633\u064A\u0637.",
        "steps": [
          "\u0648\u0632\u0639 \u0627\u0644\u0648\u0632\u0646 \u0628\u062D\u064A\u062B \u062A\u0633\u062A\u0637\u064A\u0639 \u0627\u0644\u062B\u0628\u0627\u062A \u0648\u0627\u0644\u062A\u0646\u0641\u0633 \u0628\u0631\u0627\u062D\u0629.",
          "\u0628\u0639\u062F \u0632\u0645\u0646 \u0627\u0644\u0648\u0636\u0639\u064A\u0629 \u0628\u062F\u0651\u0644 \u0627\u0644\u0642\u062F\u0645 \u0627\u0644\u0623\u0645\u0627\u0645\u064A\u0629 \u062E\u0644\u0627\u0644 \u0641\u0627\u0635\u0644 \u0627\u0644\u062A\u0628\u062F\u064A\u0644."
        ],
        "common_error": "\u0644\u0627 \u062A\u0642\u0641 \u0639\u0644\u0649 \u062E\u0637 \u0636\u064A\u0642 \u0642\u0633\u0631\u064A \u0623\u0648 \u062A\u062A\u062E\u0644 \u0639\u0646 \u0627\u0644\u0645\u0633\u0627\u0646\u062F\u0629.",
        "counting": {
          "unit": "seconds",
          "mode": "sequential",
          "side_means": "\u0627\u0644\u0642\u062F\u0645 \u0627\u0644\u0623\u0645\u0627\u0645\u064A\u0629",
          "rule_ar": "\u064A\u062D\u062F\u062F \u0627\u0644\u0645\u0624\u0642\u062A \u0627\u0644\u0645\u062F\u0629\u061B \u0644\u0627 \u064A\u0637\u0644\u0628 \u0639\u062F\u0651 \u0627\u0644\u062D\u0631\u0643\u0627\u062A. \u0623\u0643\u0645\u0644 \u0647\u062F\u0641 \u0627\u0644\u064A\u0645\u064A\u0646 \u062B\u0645 \u0641\u0627\u0635\u0644 \u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u0645\u062D\u062F\u062F \u0641\u064A \u0627\u0644\u062C\u0644\u0633\u0629 \u062B\u0645 \u0647\u062F\u0641 \u0627\u0644\u064A\u0633\u0627\u0631\u061B \u0627\u0644\u062C\u0647\u062A\u0627\u0646 \u0645\u0639\u064B\u0627 \u0645\u062C\u0645\u0648\u0639\u0629 \u0648\u0627\u062D\u062F\u0629 \u0623\u0648 \u0645\u062D\u0637\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "move-b-1"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "side-step",
        "name_ar": "\u062E\u0637\u0648\u0627\u062A \u062C\u0627\u0646\u0628\u064A\u0629 \u0645\u0639 \u0636\u0645 \u0627\u0644\u0642\u062F\u0645",
        "equipment": "\u0644\u0627 \u0634\u064A\u0621",
        "setup": "\u0642\u0641 \u0648\u0642\u062F\u0645\u0627\u0643 \u0645\u062A\u0642\u0627\u0631\u0628\u062A\u0627\u0646 \u0628\u0645\u0633\u0627\u0641\u0629 \u0645\u0631\u064A\u062D\u0629 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0645\u0631\u062A\u062E\u064A\u062A\u0627\u0646.",
        "steps": [
          "\u0627\u062E\u0637\u064F \u064A\u0645\u064A\u0646\u064B\u0627 \u062B\u0645 \u0642\u0631\u0651\u0628 \u0627\u0644\u0642\u062F\u0645 \u0627\u0644\u064A\u0633\u0631\u0649 \u062F\u0648\u0646 \u062A\u0642\u0627\u0637\u0639.",
          "\u0627\u062E\u0637\u064F \u064A\u0633\u0627\u0631\u064B\u0627 \u0648\u0642\u0631\u0651\u0628 \u0627\u0644\u064A\u0645\u0646\u0649\u060C \u0648\u0648\u0627\u0635\u0644 \u0628\u0627\u0644\u062A\u0628\u0627\u062F\u0644."
        ],
        "common_error": "\u0644\u0627 \u062A\u0642\u0641\u0632 \u0623\u0648 \u062A\u062A\u0642\u0627\u0637\u0639 \u0627\u0644\u0642\u062F\u0645\u0627\u0646.",
        "counting": {
          "unit": "seconds",
          "mode": "continuous",
          "side_means": null,
          "rule_ar": "\u064A\u062D\u062F\u062F \u0627\u0644\u0645\u0624\u0642\u062A \u0627\u0644\u0645\u062F\u0629\u061B \u0644\u0627 \u064A\u0637\u0644\u0628 \u0639\u062F\u0651 \u0627\u0644\u062D\u0631\u0643\u0627\u062A."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-a-1",
          "circuit-a-2",
          "circuit-a-3",
          "circuit-b-1",
          "circuit-b-2",
          "circuit-b-3",
          "circuit-c-1",
          "circuit-c-2",
          "circuit-c-3",
          "foundation-a-1",
          "foundation-a-2",
          "foundation-a-3",
          "foundation-b-1",
          "foundation-b-2",
          "foundation-b-3",
          "foundation-c-1",
          "foundation-c-2",
          "foundation-c-3",
          "hybrid-a-1",
          "hybrid-a-2",
          "hybrid-a-3",
          "hybrid-b-1",
          "hybrid-b-2",
          "hybrid-b-3",
          "hybrid-c-1",
          "hybrid-c-2",
          "hybrid-c-3",
          "move-b-1",
          "move-c-1",
          "strength-a-1",
          "strength-a-2",
          "strength-a-3",
          "strength-b-1",
          "strength-b-2",
          "strength-b-3",
          "strength-c-1",
          "strength-c-2",
          "strength-c-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "supported-single-balance",
        "name_ar": "\u0648\u0642\u0648\u0641 \u0631\u062C\u0644 \u0648\u0627\u062D\u062F\u0629 \u0628\u0645\u0633\u0627\u0646\u062F\u0629",
        "equipment": "\u062D\u0627\u0626\u0637",
        "setup": "\u0642\u0641 \u0642\u0631\u0628 \u0627\u0644\u062D\u0627\u0626\u0637 \u0645\u0639 \u0645\u0633\u0627\u0646\u062F\u0629 \u0627\u0644\u064A\u062F\u060C \u0648\u0627\u0646\u0642\u0644 \u0627\u0644\u0648\u0632\u0646 \u0625\u0644\u0649 \u0627\u0644\u0631\u062C\u0644 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629.",
        "steps": [
          "\u0627\u062B\u0646 \u0631\u0643\u0628\u0629 \u0627\u0644\u0631\u062C\u0644 \u0627\u0644\u062D\u0631\u0629 \u0642\u0644\u064A\u0644\u064B\u0627 \u0648\u0627\u0631\u0641\u0639 \u0642\u062F\u0645\u0647\u0627 \u0639\u0646 \u0627\u0644\u0623\u0631\u0636 \u0642\u0631\u0628 \u0631\u062C\u0644 \u0627\u0644\u0627\u0631\u062A\u0643\u0627\u0632 \u062F\u0648\u0646 \u0625\u0633\u0646\u0627\u062F\u0647\u0627 \u0639\u0644\u064A\u0647\u0627.",
          "\u062D\u0627\u0641\u0638 \u0639\u0644\u0649 \u0627\u0644\u062D\u0648\u0636 \u0645\u0633\u062A\u0648\u064A\u064B\u0627 \u062B\u0645 \u0623\u0639\u062F \u0627\u0644\u0642\u062F\u0645 \u0648\u0628\u062F\u0651\u0644 \u0628\u0639\u062F \u0627\u0644\u0641\u0627\u0635\u0644."
        ],
        "common_error": "\u0644\u0627 \u062A\u0642\u0641\u0644 \u0631\u0643\u0628\u0629 \u0627\u0644\u0627\u0631\u062A\u0643\u0627\u0632 \u0628\u0642\u0648\u0629 \u0623\u0648 \u062A\u062A\u062E\u0644 \u0639\u0646 \u0627\u0644\u062D\u0627\u0626\u0637.",
        "counting": {
          "unit": "seconds",
          "mode": "sequential",
          "side_means": "\u0631\u062C\u0644 \u0627\u0644\u0627\u0631\u062A\u0643\u0627\u0632",
          "rule_ar": "\u064A\u062D\u062F\u062F \u0627\u0644\u0645\u0624\u0642\u062A \u0627\u0644\u0645\u062F\u0629\u061B \u0644\u0627 \u064A\u0637\u0644\u0628 \u0639\u062F\u0651 \u0627\u0644\u062D\u0631\u0643\u0627\u062A. \u0623\u0643\u0645\u0644 \u0647\u062F\u0641 \u0627\u0644\u064A\u0645\u064A\u0646 \u062B\u0645 \u0641\u0627\u0635\u0644 \u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u0645\u062D\u062F\u062F \u0641\u064A \u0627\u0644\u062C\u0644\u0633\u0629 \u062B\u0645 \u0647\u062F\u0641 \u0627\u0644\u064A\u0633\u0627\u0631\u061B \u0627\u0644\u062C\u0647\u062A\u0627\u0646 \u0645\u0639\u064B\u0627 \u0645\u062C\u0645\u0648\u0639\u0629 \u0648\u0627\u062D\u062F\u0629 \u0623\u0648 \u0645\u062D\u0637\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "move-b-2",
          "move-b-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "new_detail_documented",
        "qualified_review": "pending"
      },
      {
        "id": "cat-cow",
        "name_ar": "Cat\u2013Cow",
        "equipment": "\u0628\u0633\u0627\u0637",
        "setup": "\u0627\u0628\u062F\u0623 \u0639\u0644\u0649 \u0627\u0644\u064A\u062F\u064A\u0646 \u0648\u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646 \u0645\u0639 \u0631\u0642\u0628\u0629 \u0645\u0631\u062A\u0627\u062D\u0629.",
        "steps": [
          "\u062F\u0648\u0651\u0631 \u0627\u0644\u0638\u0647\u0631 \u0628\u0631\u0641\u0642 \u0644\u0644\u0623\u0639\u0644\u0649 \u062B\u0645 \u0627\u0646\u062A\u0642\u0644 \u0625\u0644\u0649 \u062A\u0642\u0648\u0633 \u0644\u0637\u064A\u0641 \u0648\u0645\u062A\u062D\u0643\u0645 \u0641\u064A \u0627\u0644\u0627\u062A\u062C\u0627\u0647 \u0627\u0644\u0622\u062E\u0631.",
          "\u0627\u0631\u062C\u0639 \u0625\u0644\u0649 \u0627\u0644\u0648\u0636\u0639\u064A\u0629 \u0627\u0644\u0623\u0648\u0644\u0649 \u0644\u0625\u0643\u0645\u0627\u0644 \u062F\u0648\u0631\u0629 \u0648\u0627\u062D\u062F\u0629."
        ],
        "common_error": "\u0644\u0627 \u062A\u062F\u0641\u0639 \u0627\u0644\u0638\u0647\u0631 \u0625\u0644\u0649 \u0646\u0647\u0627\u064A\u0627\u062A \u0627\u0644\u0645\u062F\u0649 \u0623\u0648 \u062A\u0631\u0645\u0650 \u0627\u0644\u0631\u0623\u0633 \u0644\u0644\u062E\u0644\u0641.",
        "counting": {
          "unit": "cycles",
          "mode": "bilateral",
          "side_means": null,
          "rule_ar": "\u0627\u0644\u0627\u0646\u062A\u0642\u0627\u0644 \u0628\u064A\u0646 \u0648\u0636\u0639\u064A\u062A\u064A Cat\u2013Cow \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0623\u0648\u0644\u0649 \u062F\u0648\u0631\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "move-b-2",
          "move-b-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "supported-split",
        "name_ar": "\u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u0646\u0642\u0633\u0645\u0629 \u0628\u0645\u0633\u0627\u0646\u062F\u0629 \u0627\u0644\u062D\u0627\u0626\u0637",
        "equipment": "\u062D\u0627\u0626\u0637",
        "setup": "\u0642\u0641 \u0628\u062C\u0627\u0646\u0628 \u0627\u0644\u062D\u0627\u0626\u0637 \u0645\u0639 \u0645\u0633\u0627\u0646\u062F\u0629 \u064A\u062F\u060C \u0642\u062F\u0645 \u0623\u0645\u0627\u0645 \u0627\u0644\u0623\u062E\u0631\u0649 \u0648\u0641\u0635\u0644 \u062C\u0627\u0646\u0628\u064A \u0644\u0644\u062A\u0648\u0627\u0632\u0646.",
        "steps": [
          "\u0627\u062B\u0646 \u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646 \u0648\u0627\u0646\u0632\u0644 \u0639\u0645\u0648\u062F\u064A\u064B\u0627 \u0628\u0642\u062F\u0631 \u0645\u0631\u064A\u062D \u0645\u0639 \u062B\u0628\u0627\u062A \u0627\u0644\u0642\u062F\u0645\u064A\u0646.",
          "\u0627\u0631\u062A\u0641\u0639 \u0628\u062A\u062D\u0643\u0645\u061B \u0623\u0643\u0645\u0644 \u062C\u0647\u0629 \u0627\u0644\u0642\u062F\u0645 \u0627\u0644\u0623\u0645\u0627\u0645\u064A\u0629 \u062B\u0645 \u0628\u062F\u0651\u0644."
        ],
        "common_error": "\u0644\u0627 \u062A\u062E\u0637\u064F \u0644\u0644\u062E\u0644\u0641 \u0641\u064A \u0643\u0644 \u0639\u062F\u0651\u0629 \u0623\u0648 \u062A\u0641\u0631\u0636 \u0645\u0644\u0627\u0645\u0633\u0629 \u0627\u0644\u0631\u0643\u0628\u0629 \u0644\u0644\u0623\u0631\u0636.",
        "counting": {
          "unit": "reps",
          "mode": "sequential",
          "side_means": "\u0627\u0644\u0642\u062F\u0645 \u0627\u0644\u0623\u0645\u0627\u0645\u064A\u0629",
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629. \u0623\u0643\u0645\u0644 \u0647\u062F\u0641 \u0627\u0644\u064A\u0645\u064A\u0646 \u062B\u0645 \u0641\u0627\u0635\u0644 \u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u0645\u062D\u062F\u062F \u0641\u064A \u0627\u0644\u062C\u0644\u0633\u0629 \u062B\u0645 \u0647\u062F\u0641 \u0627\u0644\u064A\u0633\u0627\u0631\u061B \u0627\u0644\u062C\u0647\u062A\u0627\u0646 \u0645\u0639\u064B\u0627 \u0645\u062C\u0645\u0648\u0639\u0629 \u0648\u0627\u062D\u062F\u0629 \u0623\u0648 \u0645\u062D\u0637\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-b-1",
          "circuit-b-2",
          "circuit-b-3",
          "foundation-b-2",
          "foundation-b-3",
          "foundation-c-1",
          "foundation-c-2",
          "foundation-c-3",
          "hybrid-b-1",
          "hybrid-b-2",
          "hybrid-b-3",
          "hybrid-c-1",
          "hybrid-c-2",
          "hybrid-c-3",
          "move-b-3",
          "strength-b-1",
          "strength-b-2",
          "strength-b-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "neck-tilt-seated",
        "name_ar": "\u0645\u064A\u0644 \u0627\u0644\u0631\u0623\u0633 \u0627\u0644\u062C\u0627\u0646\u0628\u064A \u062C\u0627\u0644\u0633\u064B\u0627",
        "equipment": "\u0643\u0631\u0633\u064A",
        "setup": "\u0627\u062C\u0644\u0633 \u0628\u0627\u0633\u062A\u0642\u0627\u0645\u0629 \u0645\u0631\u064A\u062D\u0629 \u0648\u0627\u0644\u0642\u062F\u0645\u0627\u0646 \u062B\u0627\u0628\u062A\u062A\u0627\u0646 \u0648\u0627\u0644\u0643\u062A\u0641\u0627\u0646 \u0645\u0631\u062A\u062E\u064A\u0627\u0646.",
        "steps": [
          "\u0645\u0644 \u0627\u0644\u0623\u0630\u0646 \u0646\u062D\u0648 \u0627\u0644\u0643\u062A\u0641 \u0642\u0644\u064A\u0644\u064B\u0627 \u062F\u0648\u0646 \u0631\u0641\u0639 \u0627\u0644\u0643\u062A\u0641.",
          "\u0639\u062F \u0644\u0644\u0648\u0633\u0637 \u062B\u0645 \u0628\u062F\u0651\u0644 \u0627\u0644\u062C\u0647\u0629\u060C \u0648\u0627\u0644\u062A\u0648\u0642\u0641 \u0628\u062D\u0633\u0628 \u0627\u0644\u0648\u0635\u0641\u0629."
        ],
        "common_error": "\u0644\u0627 \u062A\u0633\u062D\u0628 \u0627\u0644\u0631\u0623\u0633 \u0628\u064A\u062F\u0643 \u0623\u0648 \u062A\u0643\u0645\u0644 \u0639\u0646\u062F \u0623\u0644\u0645 \u0623\u0648 \u062F\u0648\u062E\u0629.",
        "counting": {
          "unit": "reps",
          "mode": "alternating",
          "side_means": "\u0627\u062A\u062C\u0627\u0647 \u0627\u0644\u0645\u064A\u0644",
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629. \u0643\u0644 \u062C\u0647\u0629 \u062A\u064F\u062D\u0633\u0628 \u0645\u0646\u0641\u0631\u062F\u0629\u061B \u064A\u0645\u064A\u0646 \u062B\u0645 \u064A\u0633\u0627\u0631 \u0628\u0627\u0644\u062A\u0628\u0627\u062F\u0644\u060C \u062F\u0648\u0646 \u0631\u0627\u062D\u0629 \u0644\u0643\u0644 \u0639\u062F\u0651\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "move-c-1",
          "move-c-2",
          "move-c-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "side-squat",
        "name_ar": "\u062E\u0637\u0648\u0629 \u062C\u0627\u0646\u0628\u064A\u0629 \u0625\u0644\u0649 \u0642\u0631\u0641\u0635\u0627\u0621",
        "equipment": "\u0644\u0627 \u0634\u064A\u0621",
        "setup": "\u0642\u0641 \u0648\u0642\u062F\u0645\u0627\u0643 \u0628\u0645\u0633\u0627\u0641\u0629 \u0645\u0631\u064A\u062D\u0629 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0623\u0645\u0627\u0645\u0643.",
        "steps": [
          "\u0627\u062E\u0637\u064F \u0625\u0644\u0649 \u0627\u0644\u062C\u0627\u0646\u0628 \u062B\u0645 \u0646\u0641\u0651\u0630 \u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u062A\u062D\u0643\u0645\u0629 \u0639\u0644\u0649 \u0627\u0644\u0642\u062F\u0645\u064A\u0646.",
          "\u0642\u0641 \u0648\u0623\u0639\u062F \u0627\u0644\u0642\u062F\u0645 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u062B\u0645 \u0628\u062F\u0651\u0644 \u0627\u062A\u062C\u0627\u0647 \u0627\u0644\u062E\u0637\u0648\u0629."
        ],
        "common_error": "\u0644\u0627 \u062A\u062C\u0645\u0639 \u0627\u062A\u062C\u0627\u0647\u064A\u0646 \u0641\u064A \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629 \u0623\u0648 \u062A\u0642\u0641\u0632 \u0644\u0644\u0639\u0648\u062F\u0629.",
        "counting": {
          "unit": "reps",
          "mode": "alternating",
          "side_means": "\u0627\u062A\u062C\u0627\u0647 \u0627\u0644\u062E\u0637\u0648\u0629",
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629. \u0643\u0644 \u062C\u0647\u0629 \u062A\u064F\u062D\u0633\u0628 \u0645\u0646\u0641\u0631\u062F\u0629\u061B \u064A\u0645\u064A\u0646 \u062B\u0645 \u064A\u0633\u0627\u0631 \u0628\u0627\u0644\u062A\u0628\u0627\u062F\u0644\u060C \u062F\u0648\u0646 \u0631\u0627\u062D\u0629 \u0644\u0643\u0644 \u0639\u062F\u0651\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "move-c-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "chest-open",
        "name_ar": "\u0641\u062A\u062D \u0635\u062F\u0631 \u0644\u0637\u064A\u0641 \u062B\u0627\u0628\u062A",
        "equipment": "\u0644\u0627 \u0634\u064A\u0621",
        "setup": "\u0642\u0641 \u0628\u0627\u0633\u062A\u0642\u0627\u0645\u0629 \u0645\u0631\u064A\u062D\u0629 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0645\u0646\u062E\u0641\u0636\u062A\u0627\u0646 \u0642\u0631\u0628 \u0627\u0644\u062C\u0627\u0646\u0628\u064A\u0646.",
        "steps": [
          "\u0627\u0641\u062A\u062D \u0627\u0644\u0630\u0631\u0627\u0639\u064A\u0646 \u0642\u0644\u064A\u0644\u064B\u0627 \u0644\u0644\u062E\u0644\u0641 \u0648\u0648\u062C\u0651\u0647 \u0631\u0627\u062D\u062A\u064A \u0627\u0644\u064A\u062F\u064A\u0646 \u0644\u0644\u0623\u0645\u0627\u0645 \u062F\u0648\u0646 \u0634\u062F.",
          "\u0627\u0628\u0642\u064E \u0641\u064A \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0645\u0631\u064A\u062D \u0645\u0639 \u062A\u0646\u0641\u0633 \u0637\u0628\u064A\u0639\u064A \u0637\u0648\u0627\u0644 \u0632\u0645\u0646 \u0627\u0644\u062B\u0628\u0627\u062A."
        ],
        "common_error": "\u0644\u0627 \u062A\u062F\u0641\u0639 \u0627\u0644\u0635\u062F\u0631 \u0644\u0644\u0623\u0645\u0627\u0645 \u0628\u062A\u0642\u0648\u064A\u0633 \u0627\u0644\u0638\u0647\u0631 \u0623\u0648 \u062A\u0634\u0628\u0643 \u0627\u0644\u064A\u062F\u064A\u0646 \u0648\u062A\u0633\u062D\u0628 \u0628\u0642\u0648\u0629.",
        "counting": {
          "unit": "seconds",
          "mode": "continuous",
          "side_means": null,
          "rule_ar": "\u064A\u062D\u062F\u062F \u0627\u0644\u0645\u0624\u0642\u062A \u0627\u0644\u0645\u062F\u0629\u061B \u0644\u0627 \u064A\u0637\u0644\u0628 \u0639\u062F\u0651 \u0627\u0644\u062D\u0631\u0643\u0627\u062A."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "move-c-1"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "new_detail_documented",
        "qualified_review": "pending"
      },
      {
        "id": "heel-touch",
        "name_ar": "\u0644\u0645\u0633 \u0627\u0644\u0643\u0639\u0628 \u0644\u0644\u0623\u0645\u0627\u0645",
        "equipment": "\u0644\u0627 \u0634\u064A\u0621",
        "setup": "\u0642\u0641 \u0648\u0627\u0644\u0631\u0643\u0628\u062A\u0627\u0646 \u0645\u0631\u062A\u062E\u064A\u062A\u0627\u0646 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0642\u0631\u0628 \u0627\u0644\u062C\u0627\u0646\u0628\u064A\u0646.",
        "steps": [
          "\u0645\u062F \u0642\u062F\u0645\u064B\u0627 \u0642\u0644\u064A\u0644\u064B\u0627 \u0644\u0644\u0623\u0645\u0627\u0645 \u0648\u0627\u0644\u0645\u0633 \u0627\u0644\u0623\u0631\u0636 \u0628\u0627\u0644\u0643\u0639\u0628 \u0645\u0639 \u0627\u0631\u062A\u0641\u0627\u0639 \u0645\u0642\u062F\u0645 \u0627\u0644\u0642\u062F\u0645.",
          "\u0623\u0639\u062F \u0627\u0644\u0642\u062F\u0645 \u0648\u0628\u062F\u0651\u0644 \u0627\u0644\u062C\u0647\u0629 \u0628\u0627\u0633\u062A\u0645\u0631\u0627\u0631."
        ],
        "common_error": "\u0644\u0627 \u062A\u0646\u0642\u0644 \u0643\u0627\u0645\u0644 \u0627\u0644\u0648\u0632\u0646 \u0625\u0644\u0649 \u0627\u0644\u0642\u062F\u0645 \u0627\u0644\u0623\u0645\u0627\u0645\u064A\u0629 \u0623\u0648 \u062A\u0642\u0641\u0632.",
        "counting": {
          "unit": "seconds",
          "mode": "continuous",
          "side_means": null,
          "rule_ar": "\u064A\u062D\u062F\u062F \u0627\u0644\u0645\u0624\u0642\u062A \u0627\u0644\u0645\u062F\u0629\u061B \u0644\u0627 \u064A\u0637\u0644\u0628 \u0639\u062F\u0651 \u0627\u0644\u062D\u0631\u0643\u0627\u062A."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-b-1",
          "hybrid-a-1",
          "hybrid-b-1",
          "hybrid-c-1",
          "move-c-1"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "step-jack",
        "name_ar": "\u0641\u062A\u062D \u062C\u0627\u0646\u0628\u064A \u062F\u0648\u0646 \u0642\u0641\u0632 \u0645\u0639 \u0627\u0644\u0630\u0631\u0627\u0639\u064A\u0646",
        "equipment": "\u0644\u0627 \u0634\u064A\u0621",
        "setup": "\u0642\u0641 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0642\u0631\u0628 \u0627\u0644\u062C\u0627\u0646\u0628\u064A\u0646.",
        "steps": [
          "\u0627\u062E\u0637\u064F \u0628\u0642\u062F\u0645 \u0625\u0644\u0649 \u0627\u0644\u062C\u0627\u0646\u0628 \u0645\u0639 \u0631\u0641\u0639 \u0627\u0644\u0630\u0631\u0627\u0639\u064A\u0646 \u062C\u0627\u0646\u0628\u064B\u0627 \u0625\u0644\u0649 \u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0643\u062A\u0641\u064A\u0646.",
          "\u0623\u0639\u062F \u0627\u0644\u0642\u062F\u0645 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u064A\u0646 \u062B\u0645 \u0628\u062F\u0651\u0644 \u0627\u0644\u062C\u0647\u0629 \u062F\u0648\u0646 \u0642\u0641\u0632."
        ],
        "common_error": "\u0644\u0627 \u062A\u0631\u0641\u0639 \u0627\u0644\u0630\u0631\u0627\u0639\u064A\u0646 \u0641\u0648\u0642 \u0627\u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0645\u062D\u062F\u062F \u0623\u0648 \u062A\u0648\u0633\u0639 \u0627\u0644\u062E\u0637\u0648\u0629 \u0642\u0633\u0631\u064B\u0627.",
        "counting": {
          "unit": "seconds",
          "mode": "continuous",
          "side_means": null,
          "rule_ar": "\u064A\u062D\u062F\u062F \u0627\u0644\u0645\u0624\u0642\u062A \u0627\u0644\u0645\u062F\u0629\u061B \u0644\u0627 \u064A\u0637\u0644\u0628 \u0639\u062F\u0651 \u0627\u0644\u062D\u0631\u0643\u0627\u062A."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-a-2",
          "circuit-a-3",
          "foundation-b-2",
          "foundation-b-3",
          "hybrid-a-2",
          "hybrid-a-3",
          "hybrid-c-2",
          "hybrid-c-3",
          "move-c-2"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "cross-knee",
        "name_ar": "\u0631\u0641\u0639 \u0631\u0643\u0628\u0629 \u0648\u0644\u0645\u0633 \u0628\u0627\u0644\u064A\u062F \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629",
        "equipment": "\u0644\u0627 \u0634\u064A\u0621",
        "setup": "\u0642\u0641 \u0628\u0627\u0633\u062A\u0642\u0627\u0645\u0629 \u0645\u0631\u064A\u062D\u0629 \u0641\u064A \u0645\u0633\u0627\u062D\u0629 \u062E\u0627\u0644\u064A\u0629.",
        "steps": [
          "\u0627\u0631\u0641\u0639 \u0631\u0643\u0628\u0629 \u0648\u0642\u0631\u0628 \u0645\u0646\u0647\u0627 \u0627\u0644\u064A\u062F \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u0645\u0633 \u0645\u0631\u064A\u062D.",
          "\u0623\u0646\u0632\u0644 \u0627\u0644\u0642\u062F\u0645 \u0648\u0628\u062F\u0651\u0644 \u0627\u0644\u0631\u0643\u0628\u0629 \u0648\u0627\u0644\u064A\u062F."
        ],
        "common_error": "\u0644\u0627 \u062A\u0646\u062D\u0646\u0650 \u0623\u0648 \u062A\u0644\u0648\u0650 \u0627\u0644\u062C\u0630\u0639 \u0628\u0627\u0644\u0642\u0648\u0629 \u0644\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0627\u0644\u0631\u0643\u0628\u0629.",
        "counting": {
          "unit": "seconds",
          "mode": "continuous",
          "side_means": null,
          "rule_ar": "\u064A\u062D\u062F\u062F \u0627\u0644\u0645\u0624\u0642\u062A \u0627\u0644\u0645\u062F\u0629\u061B \u0644\u0627 \u064A\u0637\u0644\u0628 \u0639\u062F\u0651 \u0627\u0644\u062D\u0631\u0643\u0627\u062A."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-a-3",
          "circuit-c-2",
          "circuit-c-3",
          "foundation-c-2",
          "foundation-c-3",
          "hybrid-a-3",
          "hybrid-c-2",
          "hybrid-c-3",
          "move-c-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "supported-row",
        "name_ar": "\u0633\u062D\u0628 \u062F\u0645\u0628\u0644 \u0645\u0633\u0646\u0648\u062F",
        "equipment": "\u062F\u0645\u0628\u0644 \u0648\u0627\u062D\u062F \u0648\u0633\u0637\u062D \u062B\u0627\u0628\u062A",
        "setup": "\u0642\u0641 \u0628\u0642\u062F\u0645\u064A\u0646 \u0645\u062A\u0628\u0627\u0639\u062F\u062A\u064A\u0646 \u0625\u062D\u062F\u0627\u0647\u0645\u0627 \u0623\u0645\u0627\u0645 \u0627\u0644\u0623\u062E\u0631\u0649\u060C \u0648\u0645\u0644 \u0645\u0646 \u0627\u0644\u0648\u0631\u0643\u064A\u0646\u061B \u0623\u0633\u0646\u062F \u0627\u0644\u064A\u062F \u063A\u064A\u0631 \u0627\u0644\u062D\u0627\u0645\u0644\u0629 \u0639\u0644\u0649 \u0633\u0637\u062D \u062B\u0627\u0628\u062A\u060C \u0648\u0627\u0644\u0642\u062F\u0645\u0627\u0646 \u0639\u0644\u0649 \u0627\u0644\u0623\u0631\u0636.",
        "steps": [
          "\u0627\u0633\u062D\u0628 \u0627\u0644\u062F\u0645\u0628\u0644 \u0628\u0627\u0644\u064A\u062F \u0627\u0644\u0623\u062E\u0631\u0649 \u0646\u062D\u0648 \u062C\u0627\u0646\u0628 \u0627\u0644\u062E\u0635\u0631 \u0645\u0639 \u0627\u0642\u062A\u0631\u0627\u0628 \u0627\u0644\u0645\u0631\u0641\u0642 \u0645\u0646 \u0627\u0644\u062C\u0630\u0639.",
          "\u0623\u0646\u0632\u0644 \u0627\u0644\u062F\u0645\u0628\u0644 \u0628\u062A\u062D\u0643\u0645\u061B \u0627\u0644\u062C\u0647\u0629 \u0628\u0627\u0633\u0645 \u0627\u0644\u064A\u062F \u0627\u0644\u062D\u0627\u0645\u0644\u0629."
        ],
        "common_error": "\u0644\u0627 \u062A\u0644\u0641 \u0627\u0644\u062C\u0630\u0639 \u0623\u0648 \u062A\u0646\u0641\u0636 \u0627\u0644\u0648\u0632\u0646\u061B \u0627\u0633\u062A\u062E\u062F\u0645 \u062D\u0645\u0644\u064B\u0627 \u062A\u0633\u062A\u0637\u064A\u0639 \u0627\u0644\u062A\u062D\u0643\u0645 \u0628\u0647 \u062F\u0648\u0646 \u062D\u0628\u0633 \u0627\u0644\u0646\u0641\u0633.",
        "counting": {
          "unit": "reps",
          "mode": "sequential",
          "side_means": "\u0627\u0644\u064A\u062F \u0627\u0644\u062D\u0627\u0645\u0644\u0629 \u0644\u0644\u062F\u0645\u0628\u0644",
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629. \u0623\u0643\u0645\u0644 \u0647\u062F\u0641 \u0627\u0644\u064A\u0645\u064A\u0646 \u062B\u0645 \u0641\u0627\u0635\u0644 \u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u0645\u062D\u062F\u062F \u0641\u064A \u0627\u0644\u062C\u0644\u0633\u0629 \u062B\u0645 \u0647\u062F\u0641 \u0627\u0644\u064A\u0633\u0627\u0631\u061B \u0627\u0644\u062C\u0647\u062A\u0627\u0646 \u0645\u0639\u064B\u0627 \u0645\u062C\u0645\u0648\u0639\u0629 \u0648\u0627\u062D\u062F\u0629 \u0623\u0648 \u0645\u062D\u0637\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-a-1",
          "circuit-a-2",
          "circuit-a-3",
          "circuit-c-1",
          "circuit-c-2",
          "circuit-c-3",
          "foundation-a-1",
          "foundation-a-2",
          "foundation-a-3",
          "foundation-c-1",
          "foundation-c-2",
          "foundation-c-3",
          "hybrid-a-1",
          "hybrid-a-2",
          "hybrid-a-3",
          "hybrid-c-1",
          "hybrid-c-2",
          "hybrid-c-3",
          "strength-a-1",
          "strength-a-2",
          "strength-a-3",
          "strength-c-1",
          "strength-c-2",
          "strength-c-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "new_detail_documented",
        "qualified_review": "pending"
      },
      {
        "id": "incline-push",
        "name_ar": "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644",
        "equipment": "\u0633\u0637\u062D \u062B\u0627\u0628\u062A \u0642\u0631\u0628 \u0627\u0644\u062E\u0635\u0631",
        "setup": "\u0636\u0639 \u0627\u0644\u064A\u062F\u064A\u0646 \u0639\u0644\u0649 \u0633\u0637\u062D \u062B\u0627\u0628\u062A \u0645\u0646\u0627\u0633\u0628 \u0642\u0631\u0628 \u0627\u0631\u062A\u0641\u0627\u0639 \u0627\u0644\u062E\u0635\u0631\u060C \u0648\u0627\u0644\u0642\u062F\u0645\u0627\u0646 \u0644\u0644\u062E\u0644\u0641 \u0648\u0627\u0644\u062C\u0633\u0645 \u0645\u0633\u062A\u0642\u064A\u0645.",
        "steps": [
          "\u0627\u062B\u0646 \u0627\u0644\u0645\u0631\u0641\u0642\u064A\u0646 \u0644\u064A\u0642\u062A\u0631\u0628 \u0627\u0644\u0635\u062F\u0631 \u0645\u0646 \u0627\u0644\u0633\u0637\u062D.",
          "\u0627\u062F\u0641\u0639 \u0644\u0644\u0639\u0648\u062F\u0629 \u0645\u0639 \u0627\u0644\u0632\u0641\u064A\u0631."
        ],
        "common_error": "\u0644\u0627 \u062A\u0633\u062A\u062E\u062F\u0645 \u0633\u0637\u062D\u064B\u0627 \u064A\u0646\u0632\u0644\u0642 \u0623\u0648 \u064A\u0646\u0642\u0644\u0628 \u0623\u0648 \u062A\u0633\u0645\u062D \u0628\u0647\u0628\u0648\u0637 \u0627\u0644\u062D\u0648\u0636.",
        "counting": {
          "unit": "reps",
          "mode": "bilateral",
          "side_means": null,
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-a-2",
          "circuit-b-2",
          "circuit-b-3",
          "circuit-c-1",
          "circuit-c-2",
          "foundation-a-2",
          "foundation-a-3",
          "foundation-b-3",
          "foundation-c-2",
          "foundation-c-3",
          "hybrid-a-1",
          "hybrid-b-1",
          "hybrid-b-2",
          "hybrid-b-3",
          "hybrid-c-1",
          "strength-a-1",
          "strength-b-1",
          "strength-b-2",
          "strength-b-3",
          "strength-c-1"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "forearm-knee-plank",
        "name_ar": "\u0628\u0644\u0627\u0646\u0643 \u0633\u0627\u0639\u062F\u064A\u0646 \u0648\u0631\u0643\u0628\u062A\u064A\u0646",
        "equipment": "\u0628\u0633\u0627\u0637",
        "setup": "\u0636\u0639 \u0627\u0644\u0633\u0627\u0639\u062F\u064A\u0646 \u0639\u0644\u0649 \u0627\u0644\u0628\u0633\u0627\u0637 \u0648\u0627\u0644\u0645\u0631\u0641\u0642\u064A\u0646 \u062A\u062D\u062A \u0627\u0644\u0643\u062A\u0641\u064A\u0646\u060C \u0648\u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646 \u062E\u0644\u0641 \u0627\u0644\u0648\u0631\u0643\u064A\u0646 \u0642\u0644\u064A\u0644\u064B\u0627.",
        "steps": [
          "\u0627\u0631\u0641\u0639 \u0627\u0644\u062D\u0648\u0636 \u0644\u064A\u0635\u0628\u062D \u0627\u0644\u062C\u0630\u0639 \u0648\u0627\u0644\u0641\u062E\u0630\u0627\u0646 \u0639\u0644\u0649 \u0627\u0645\u062A\u062F\u0627\u062F \u0645\u0631\u064A\u062D \u0645\u0646 \u0627\u0644\u0631\u0623\u0633 \u0625\u0644\u0649 \u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646.",
          "\u062A\u0646\u0641\u0633 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u062B\u0628\u0627\u062A \u062B\u0645 \u0623\u0646\u0632\u0644 \u0627\u0644\u062D\u0648\u0636 \u0628\u062A\u062D\u0643\u0645."
        ],
        "common_error": "\u0644\u0627 \u062A\u062C\u0639\u0644 \u0627\u0644\u0648\u0631\u0643\u064A\u0646 \u0641\u0648\u0642 \u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646 \u0645\u0628\u0627\u0634\u0631\u0629 \u0623\u0648 \u062A\u062F\u0639 \u0623\u0633\u0641\u0644 \u0627\u0644\u0638\u0647\u0631 \u064A\u0647\u0628\u0637.",
        "counting": {
          "unit": "seconds",
          "mode": "continuous",
          "side_means": null,
          "rule_ar": "\u064A\u062D\u062F\u062F \u0627\u0644\u0645\u0624\u0642\u062A \u0627\u0644\u0645\u062F\u0629\u061B \u0644\u0627 \u064A\u0637\u0644\u0628 \u0639\u062F\u0651 \u0627\u0644\u062D\u0631\u0643\u0627\u062A."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-a-1",
          "circuit-a-2",
          "foundation-a-1",
          "foundation-a-2",
          "hybrid-a-1",
          "strength-a-1"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "forearm-plank",
        "name_ar": "\u0628\u0644\u0627\u0646\u0643 \u0633\u0627\u0639\u062F\u064A\u0646 \u0648\u0642\u062F\u0645\u064A\u0646",
        "equipment": "\u0628\u0633\u0627\u0637",
        "setup": "\u0636\u0639 \u0627\u0644\u0633\u0627\u0639\u062F\u064A\u0646 \u0639\u0644\u0649 \u0627\u0644\u0628\u0633\u0627\u0637 \u0648\u0627\u0644\u0645\u0631\u0641\u0642\u064A\u0646 \u062A\u062D\u062A \u0627\u0644\u0643\u062A\u0641\u064A\u0646\u060C \u0648\u0645\u062F \u0627\u0644\u0631\u062C\u0644\u064A\u0646 \u0648\u0627\u0631\u062A\u0643\u0632 \u0639\u0644\u0649 \u0645\u0642\u062F\u0645\u062A\u064A \u0627\u0644\u0642\u062F\u0645\u064A\u0646.",
        "steps": [
          "\u0627\u0631\u0641\u0639 \u0627\u0644\u062C\u0633\u0645 \u0645\u0639 \u0628\u0642\u0627\u0621 \u0627\u0644\u0631\u0623\u0633 \u0648\u0627\u0644\u062C\u0630\u0639 \u0648\u0627\u0644\u062D\u0648\u0636 \u0639\u0644\u0649 \u0627\u0645\u062A\u062F\u0627\u062F \u0648\u0627\u062D\u062F.",
          "\u062A\u0646\u0641\u0633 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u062B\u0628\u0627\u062A \u062B\u0645 \u0623\u0646\u0632\u0644 \u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646 \u0628\u062A\u062D\u0643\u0645."
        ],
        "common_error": "\u0644\u0627 \u062A\u0631\u0641\u0639 \u0627\u0644\u062D\u0648\u0636 \u0643\u062B\u064A\u0631\u064B\u0627 \u0623\u0648 \u062A\u062A\u0631\u0643\u0647 \u064A\u0647\u0628\u0637 \u0623\u0648 \u062A\u062D\u0628\u0633 \u0627\u0644\u0646\u0641\u0633.",
        "counting": {
          "unit": "seconds",
          "mode": "continuous",
          "side_means": null,
          "rule_ar": "\u064A\u062D\u062F\u062F \u0627\u0644\u0645\u0624\u0642\u062A \u0627\u0644\u0645\u062F\u0629\u061B \u0644\u0627 \u064A\u0637\u0644\u0628 \u0639\u062F\u0651 \u0627\u0644\u062D\u0631\u0643\u0627\u062A."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-a-3",
          "foundation-a-3",
          "hybrid-a-2",
          "hybrid-a-3",
          "strength-a-2",
          "strength-a-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "heel-tap",
        "name_ar": "\u0644\u0645\u0633 \u0627\u0644\u0643\u0639\u0628 \u0644\u0644\u0623\u0631\u0636 \u0645\u0646 \u0631\u0643\u0628\u062A\u064A\u0646 \u0645\u0631\u0641\u0648\u0639\u062A\u064A\u0646 \u0645\u062B\u0646\u064A\u062A\u064A\u0646",
        "equipment": "\u0628\u0633\u0627\u0637",
        "setup": "\u0627\u0633\u062A\u0644\u0642\u0650 \u0648\u0627\u0631\u0641\u0639 \u0627\u0644\u0631\u062C\u0644\u064A\u0646 \u0645\u0639 \u062B\u0646\u064A \u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646\u060C \u0648\u0627\u0644\u0641\u062E\u0630\u0627\u0646 \u0628\u0627\u062A\u062C\u0627\u0647 \u0627\u0644\u0623\u0639\u0644\u0649 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0642\u0631\u0628 \u0627\u0644\u062C\u0633\u0645.",
        "steps": [
          "\u0623\u0646\u0632\u0644 \u0643\u0639\u0628\u064B\u0627 \u0646\u062D\u0648 \u0627\u0644\u0623\u0631\u0636 \u0645\u0639 \u0627\u0644\u062D\u0641\u0627\u0638 \u0639\u0644\u0649 \u062B\u0646\u064A \u0627\u0644\u0631\u0643\u0628\u0629 \u0648\u062B\u0628\u0627\u062A \u0627\u0644\u062D\u0648\u0636.",
          "\u0627\u0644\u0645\u0633 \u0627\u0644\u0623\u0631\u0636 \u0628\u0644\u0637\u0641 \u062B\u0645 \u0639\u062F \u0648\u0628\u062F\u0651\u0644 \u0627\u0644\u0631\u062C\u0644."
        ],
        "common_error": "\u0644\u0627 \u062A\u0641\u0631\u062F \u0627\u0644\u0631\u0643\u0628\u0629 \u0643\u0623\u0646\u0647\u0627 \u0627\u0646\u0632\u0644\u0627\u0642 \u0643\u0639\u0628 \u0623\u0648 \u062A\u0648\u0633\u0639 \u0627\u0644\u0645\u062F\u0649 \u0645\u0639 \u062A\u0642\u0648\u0633 \u0627\u0644\u0638\u0647\u0631.",
        "counting": {
          "unit": "reps",
          "mode": "alternating",
          "side_means": "\u0627\u0644\u0631\u062C\u0644 \u0627\u0644\u0645\u062A\u062D\u0631\u0643\u0629",
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629. \u0643\u0644 \u062C\u0647\u0629 \u062A\u064F\u062D\u0633\u0628 \u0645\u0646\u0641\u0631\u062F\u0629\u061B \u064A\u0645\u064A\u0646 \u062B\u0645 \u064A\u0633\u0627\u0631 \u0628\u0627\u0644\u062A\u0628\u0627\u062F\u0644\u060C \u062F\u0648\u0646 \u0631\u0627\u062D\u0629 \u0644\u0643\u0644 \u0639\u062F\u0651\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "foundation-b-2"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "dead-bug",
        "name_ar": "Dead Bug",
        "equipment": "\u0628\u0633\u0627\u0637",
        "setup": "\u0627\u0633\u062A\u0644\u0642\u0650 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0628\u0627\u062A\u062C\u0627\u0647 \u0627\u0644\u0633\u0642\u0641 \u0648\u0627\u0644\u0641\u062E\u0630\u0627\u0646 \u0645\u0631\u0641\u0648\u0639\u0627\u0646 \u0648\u0627\u0644\u0631\u0643\u0628\u062A\u0627\u0646 \u0645\u062B\u0646\u064A\u062A\u0627\u0646.",
        "steps": [
          "\u0645\u062F \u0630\u0631\u0627\u0639\u064B\u0627 \u062E\u0644\u0641 \u0627\u0644\u0631\u0623\u0633 \u0648\u0627\u0644\u0631\u062C\u0644 \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u0623\u0645\u0627\u0645 \u0636\u0645\u0646 \u0645\u062F\u0649 \u0645\u062A\u062D\u0643\u0645.",
          "\u0639\u062F \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u062B\u0645 \u0628\u062F\u0651\u0644 \u0627\u0644\u0637\u0631\u0641\u064A\u0646."
        ],
        "common_error": "\u0644\u0627 \u062A\u0641\u0631\u0636 \u0644\u0645\u0633 \u0627\u0644\u0642\u062F\u0645 \u0644\u0644\u0623\u0631\u0636 \u0623\u0648 \u062A\u0641\u0642\u062F \u062B\u0628\u0627\u062A \u0627\u0644\u062D\u0648\u0636.",
        "counting": {
          "unit": "reps",
          "mode": "alternating",
          "side_means": "\u0627\u0644\u0631\u062C\u0644 \u0627\u0644\u0645\u0645\u062F\u0648\u062F\u0629 \u0645\u0639 \u0627\u0644\u0630\u0631\u0627\u0639 \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629",
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629. \u0643\u0644 \u062C\u0647\u0629 \u062A\u064F\u062D\u0633\u0628 \u0645\u0646\u0641\u0631\u062F\u0629\u061B \u064A\u0645\u064A\u0646 \u062B\u0645 \u064A\u0633\u0627\u0631 \u0628\u0627\u0644\u062A\u0628\u0627\u062F\u0644\u060C \u062F\u0648\u0646 \u0631\u0627\u062D\u0629 \u0644\u0643\u0644 \u0639\u062F\u0651\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-c-2",
          "circuit-c-3",
          "foundation-b-3",
          "hybrid-b-2",
          "hybrid-b-3",
          "strength-c-1",
          "strength-c-2",
          "strength-c-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "split-squat",
        "name_ar": "\u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u0646\u0642\u0633\u0645\u0629 \u062F\u0648\u0646 \u0645\u0633\u0627\u0646\u062F\u0629",
        "equipment": "\u0644\u0627 \u0634\u064A\u0621",
        "setup": "\u0642\u0641 \u0648\u0642\u062F\u0645 \u0623\u0645\u0627\u0645 \u0627\u0644\u0623\u062E\u0631\u0649 \u0645\u0639 \u0641\u0635\u0644 \u062C\u0627\u0646\u0628\u064A \u0644\u0644\u062A\u0648\u0627\u0632\u0646\u060C \u0648\u0627\u0644\u064A\u062F\u0627\u0646 \u0639\u0644\u0649 \u0627\u0644\u0648\u0631\u0643\u064A\u0646 \u062F\u0648\u0646 \u0645\u0633\u0627\u0646\u062F\u0629.",
        "steps": [
          "\u0627\u062B\u0646 \u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646 \u0648\u0627\u0646\u0632\u0644 \u0639\u0645\u0648\u062F\u064A\u064B\u0627 \u0636\u0645\u0646 \u0645\u062F\u0649 \u0645\u062A\u062D\u0643\u0645\u060C \u0648\u0627\u0644\u0642\u062F\u0645\u0627\u0646 \u062B\u0627\u0628\u062A\u062A\u0627\u0646.",
          "\u0639\u062F \u0644\u0644\u0627\u0631\u062A\u0641\u0627\u0639 \u0648\u0623\u0643\u0645\u0644 \u062C\u0647\u0629 \u0627\u0644\u0642\u062F\u0645 \u0627\u0644\u0623\u0645\u0627\u0645\u064A\u0629 \u0642\u0628\u0644 \u0627\u0644\u062A\u0628\u062F\u064A\u0644."
        ],
        "common_error": "\u0644\u0627 \u062A\u062C\u0645\u0639 \u0627\u0644\u0642\u062F\u0645\u064A\u0646 \u0639\u0644\u0649 \u062E\u0637 \u0636\u064A\u0642 \u0623\u0648 \u062A\u062D\u0648\u0651\u0644\u0647\u0627 \u0625\u0644\u0649 \u062E\u0637\u0648\u0629 \u0627\u0646\u062F\u0641\u0627\u0639 \u0645\u062A\u0643\u0631\u0631\u0629.",
        "counting": {
          "unit": "reps",
          "mode": "sequential",
          "side_means": "\u0627\u0644\u0642\u062F\u0645 \u0627\u0644\u0623\u0645\u0627\u0645\u064A\u0629",
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629. \u0623\u0643\u0645\u0644 \u0647\u062F\u0641 \u0627\u0644\u064A\u0645\u064A\u0646 \u062B\u0645 \u0641\u0627\u0635\u0644 \u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u0645\u062D\u062F\u062F \u0641\u064A \u0627\u0644\u062C\u0644\u0633\u0629 \u062B\u0645 \u0647\u062F\u0641 \u0627\u0644\u064A\u0633\u0627\u0631\u061B \u0627\u0644\u062C\u0647\u062A\u0627\u0646 \u0645\u0639\u064B\u0627 \u0645\u062C\u0645\u0648\u0639\u0629 \u0648\u0627\u062D\u062F\u0629 \u0623\u0648 \u0645\u062D\u0637\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-b-2",
          "foundation-c-3",
          "hybrid-b-2",
          "hybrid-b-3",
          "hybrid-c-2",
          "strength-b-2"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "quadruped-leg",
        "name_ar": "\u0645\u062F \u0631\u062C\u0644 \u0645\u0646 \u0627\u0644\u064A\u062F\u064A\u0646 \u0648\u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646",
        "equipment": "\u0628\u0633\u0627\u0637",
        "setup": "\u0627\u0628\u062F\u0623 \u0639\u0644\u0649 \u0627\u0644\u064A\u062F\u064A\u0646 \u0648\u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646\u060C \u0648\u0627\u0644\u0638\u0647\u0631 \u0645\u062D\u0627\u064A\u062F \u0648\u0627\u0644\u064A\u062F\u0627\u0646 \u062B\u0627\u0628\u062A\u062A\u0627\u0646.",
        "steps": [
          "\u0645\u062F \u0631\u062C\u0644\u064B\u0627 \u0648\u0627\u062D\u062F\u0629 \u0644\u0644\u062E\u0644\u0641 \u062D\u062A\u0649 \u062A\u0628\u062A\u0639\u062F \u0627\u0644\u0642\u062F\u0645 \u0639\u0646 \u0627\u0644\u0628\u0633\u0627\u0637\u060C \u062F\u0648\u0646 \u0631\u0641\u0639\u0647\u0627 \u0641\u0648\u0642 \u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u062C\u0630\u0639.",
          "\u0623\u0639\u062F \u0627\u0644\u0631\u0643\u0628\u0629 \u0625\u0644\u0649 \u0645\u0648\u0636\u0639\u0647\u0627 \u062B\u0645 \u0628\u062F\u0651\u0644 \u0627\u0644\u0631\u062C\u0644\u060C \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u062B\u0627\u0628\u062A\u062A\u0627\u0646."
        ],
        "common_error": "\u0644\u0627 \u062A\u0631\u0641\u0639 \u0630\u0631\u0627\u0639\u064B\u0627 \u0623\u0648 \u062A\u062F\u0648\u0631 \u0627\u0644\u062D\u0648\u0636 \u0623\u0648 \u062A\u0642\u0648\u0651\u0633 \u0627\u0644\u0638\u0647\u0631 \u0644\u0631\u0641\u0639 \u0627\u0644\u0642\u062F\u0645.",
        "counting": {
          "unit": "reps",
          "mode": "alternating",
          "side_means": "\u0627\u0644\u0631\u062C\u0644 \u0627\u0644\u0645\u0645\u062F\u0648\u062F\u0629",
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629. \u0643\u0644 \u062C\u0647\u0629 \u062A\u064F\u062D\u0633\u0628 \u0645\u0646\u0641\u0631\u062F\u0629\u061B \u064A\u0645\u064A\u0646 \u062B\u0645 \u064A\u0633\u0627\u0631 \u0628\u0627\u0644\u062A\u0628\u0627\u062F\u0644\u060C \u062F\u0648\u0646 \u0631\u0627\u062D\u0629 \u0644\u0643\u0644 \u0639\u062F\u0651\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-b-1",
          "foundation-c-1"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "new_detail_documented",
        "qualified_review": "pending"
      },
      {
        "id": "knee-side-plank",
        "name_ar": "\u0628\u0644\u0627\u0646\u0643 \u062C\u0627\u0646\u0628\u064A \u0639\u0644\u0649 \u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646",
        "equipment": "\u0628\u0633\u0627\u0637",
        "setup": "\u0627\u0633\u062A\u0644\u0642\u0650 \u0639\u0644\u0649 \u0627\u0644\u062C\u0627\u0646\u0628 \u0645\u0639 \u062B\u0646\u064A \u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646 \u0648\u0625\u0631\u062C\u0627\u0639 \u0627\u0644\u0642\u062F\u0645\u064A\u0646 \u062E\u0644\u0641\u0643\u060C \u0648\u0627\u0644\u0633\u0627\u0639\u062F \u062A\u062D\u062A \u0627\u0644\u0643\u062A\u0641.",
        "steps": [
          "\u0627\u0631\u0641\u0639 \u0627\u0644\u062D\u0648\u0636 \u0645\u0631\u062A\u0643\u0632\u064B\u0627 \u0639\u0644\u0649 \u0627\u0644\u0633\u0627\u0639\u062F \u0648\u062C\u0627\u0646\u0628 \u0627\u0644\u0631\u0643\u0628\u0629 \u0627\u0644\u0633\u0641\u0644\u0649\u060C \u0648\u0627\u0644\u062C\u0630\u0639 \u0648\u0627\u0644\u0641\u062E\u0630\u0627\u0646 \u0639\u0644\u0649 \u0627\u0645\u062A\u062F\u0627\u062F \u0648\u0627\u062D\u062F.",
          "\u062A\u0646\u0641\u0633 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u062B\u0628\u0627\u062A \u062B\u0645 \u0623\u0646\u0632\u0644 \u0627\u0644\u062D\u0648\u0636 \u0648\u0628\u062F\u0651\u0644 \u0627\u0644\u062C\u0647\u0629 \u0628\u0639\u062F \u0627\u0644\u0641\u0627\u0635\u0644."
        ],
        "common_error": "\u0644\u0627 \u062A\u0631\u062A\u0643\u0632 \u0639\u0644\u0649 \u0627\u0644\u0642\u062F\u0645\u064A\u0646 \u0628\u062F\u0644 \u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646 \u0623\u0648 \u062A\u062F\u0639 \u0627\u0644\u0643\u062A\u0641 \u064A\u0646\u0647\u0627\u0631.",
        "counting": {
          "unit": "seconds",
          "mode": "sequential",
          "side_means": "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0633\u0641\u0644\u064A \u0627\u0644\u0645\u0631\u062A\u0643\u0632",
          "rule_ar": "\u064A\u062D\u062F\u062F \u0627\u0644\u0645\u0624\u0642\u062A \u0627\u0644\u0645\u062F\u0629\u061B \u0644\u0627 \u064A\u0637\u0644\u0628 \u0639\u062F\u0651 \u0627\u0644\u062D\u0631\u0643\u0627\u062A. \u0623\u0643\u0645\u0644 \u0647\u062F\u0641 \u0627\u0644\u064A\u0645\u064A\u0646 \u062B\u0645 \u0641\u0627\u0635\u0644 \u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u0645\u062D\u062F\u062F \u0641\u064A \u0627\u0644\u062C\u0644\u0633\u0629 \u062B\u0645 \u0647\u062F\u0641 \u0627\u0644\u064A\u0633\u0627\u0631\u061B \u0627\u0644\u062C\u0647\u062A\u0627\u0646 \u0645\u0639\u064B\u0627 \u0645\u062C\u0645\u0648\u0639\u0629 \u0648\u0627\u062D\u062F\u0629 \u0623\u0648 \u0645\u062D\u0637\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-c-1",
          "circuit-c-2",
          "foundation-c-1",
          "foundation-c-2",
          "foundation-c-3",
          "hybrid-c-1",
          "hybrid-c-2",
          "strength-b-1",
          "strength-b-2"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "floor-push",
        "name_ar": "\u0636\u063A\u0637 \u0623\u0631\u0636\u064A \u0643\u0627\u0645\u0644",
        "equipment": "\u0628\u0633\u0627\u0637",
        "setup": "\u0627\u0628\u062F\u0623 \u0645\u0631\u062A\u0643\u0632\u064B\u0627 \u0639\u0644\u0649 \u0627\u0644\u064A\u062F\u064A\u0646 \u0648\u0645\u0642\u062F\u0645\u062A\u064A \u0627\u0644\u0642\u062F\u0645\u064A\u0646\u060C \u0648\u0627\u0644\u064A\u062F\u0627\u0646 \u0628\u0639\u0631\u0636 \u0645\u0631\u064A\u062D \u0642\u0631\u0628 \u0627\u0644\u0643\u062A\u0641\u064A\u0646.",
        "steps": [
          "\u0627\u062B\u0646 \u0627\u0644\u0645\u0631\u0641\u0642\u064A\u0646 \u0648\u0627\u0646\u0632\u0644 \u0628\u0627\u0644\u062C\u0633\u0645 \u0643\u0648\u062D\u062F\u0629 \u0648\u0627\u062D\u062F\u0629 \u0636\u0645\u0646 \u0645\u062F\u0649 \u0645\u062A\u062D\u0643\u0645.",
          "\u0627\u062F\u0641\u0639 \u0627\u0644\u0623\u0631\u0636 \u0644\u0644\u0639\u0648\u062F\u0629 \u0645\u0639 \u0627\u0644\u0632\u0641\u064A\u0631."
        ],
        "common_error": "\u0644\u0627 \u062A\u0647\u0628\u0637 \u0628\u0627\u0644\u062D\u0648\u0636 \u0623\u0648 \u062A\u0645\u062F \u0627\u0644\u0631\u0623\u0633 \u0625\u0644\u0649 \u0627\u0644\u0623\u0631\u0636 \u0628\u062F\u0644 \u062E\u0641\u0636 \u0627\u0644\u062C\u0633\u0645.",
        "counting": {
          "unit": "reps",
          "mode": "bilateral",
          "side_means": null,
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-a-3",
          "circuit-c-3",
          "hybrid-a-2",
          "hybrid-a-3",
          "hybrid-c-2",
          "hybrid-c-3",
          "strength-a-2",
          "strength-a-3",
          "strength-c-2",
          "strength-c-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "reverse-lunge",
        "name_ar": "\u0627\u0646\u062F\u0641\u0627\u0639 \u062E\u0644\u0641\u064A",
        "equipment": "\u0644\u0627 \u0634\u064A\u0621",
        "setup": "\u0642\u0641 \u062F\u0648\u0646 \u062D\u0645\u0644 \u0648\u0627\u0644\u064A\u062F\u0627\u0646 \u0639\u0644\u0649 \u0627\u0644\u0648\u0631\u0643\u064A\u0646\u060C \u0648\u062D\u062F\u062F \u062C\u0647\u0629 \u0627\u0644\u0642\u062F\u0645 \u0627\u0644\u062A\u064A \u0633\u062A\u0628\u0642\u0649 \u0623\u0645\u0627\u0645\u064B\u0627.",
        "steps": [
          "\u0627\u062E\u0637\u064F \u0628\u0627\u0644\u0631\u062C\u0644 \u0627\u0644\u0623\u062E\u0631\u0649 \u0644\u0644\u062E\u0644\u0641 \u0648\u0627\u062B\u0646 \u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646 \u0644\u0646\u0632\u0648\u0644 \u0645\u062A\u062D\u0643\u0645.",
          "\u0627\u062F\u0641\u0639 \u0628\u0627\u0644\u0642\u062F\u0645 \u0627\u0644\u0623\u0645\u0627\u0645\u064A\u0629 \u0648\u0623\u0639\u062F \u0627\u0644\u062E\u0644\u0641\u064A\u0629 \u0644\u0644\u0648\u0642\u0648\u0641\u061B \u0623\u0643\u0645\u0644 \u0627\u0644\u062C\u0647\u0629 \u062B\u0645 \u0628\u062F\u0651\u0644."
        ],
        "common_error": "\u0644\u0627 \u062A\u0628\u062F\u0651\u0644 \u0645\u0639\u0646\u0649 \u0627\u0644\u062C\u0647\u0629 \u0625\u0644\u0649 \u0627\u0644\u0631\u062C\u0644 \u0627\u0644\u0631\u0627\u062C\u0639\u0629 \u0623\u0648 \u062A\u0631\u062A\u0637\u0645 \u0627\u0644\u0631\u0643\u0628\u0629 \u0628\u0627\u0644\u0623\u0631\u0636.",
        "counting": {
          "unit": "reps",
          "mode": "sequential",
          "side_means": "\u0627\u0644\u0642\u062F\u0645 \u0627\u0644\u0623\u0645\u0627\u0645\u064A\u0629 \u0627\u0644\u062B\u0627\u0628\u062A\u0629",
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629. \u0623\u0643\u0645\u0644 \u0647\u062F\u0641 \u0627\u0644\u064A\u0645\u064A\u0646 \u062B\u0645 \u0641\u0627\u0635\u0644 \u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u0645\u062D\u062F\u062F \u0641\u064A \u0627\u0644\u062C\u0644\u0633\u0629 \u062B\u0645 \u0647\u062F\u0641 \u0627\u0644\u064A\u0633\u0627\u0631\u061B \u0627\u0644\u062C\u0647\u062A\u0627\u0646 \u0645\u0639\u064B\u0627 \u0645\u062C\u0645\u0648\u0639\u0629 \u0648\u0627\u062D\u062F\u0629 \u0623\u0648 \u0645\u062D\u0637\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-b-3",
          "hybrid-c-3",
          "strength-b-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "single-bridge",
        "name_ar": "\u062C\u0633\u0631 \u0628\u0631\u062C\u0644 \u0648\u0627\u062D\u062F\u0629",
        "equipment": "\u0628\u0633\u0627\u0637",
        "setup": "\u0627\u0633\u062A\u0644\u0642\u0650 \u0645\u0639 \u0642\u062F\u0645 \u0627\u0644\u0627\u0631\u062A\u0643\u0627\u0632 \u0639\u0644\u0649 \u0627\u0644\u0623\u0631\u0636 \u0648\u0631\u0643\u0628\u062A\u0647\u0627 \u0645\u062B\u0646\u064A\u0629\u061B \u0627\u0631\u0641\u0639 \u0627\u0644\u0631\u062C\u0644 \u0627\u0644\u062D\u0631\u0629 \u0645\u0639 \u0628\u0642\u0627\u0621 \u0631\u0643\u0628\u062A\u0647\u0627 \u0645\u062B\u0646\u064A\u0629 \u0648\u0627\u0644\u0641\u062E\u0630 \u0646\u062D\u0648 \u0627\u0644\u062C\u0630\u0639 \u062F\u0648\u0646 \u062C\u0630\u0628 \u0628\u0627\u0644\u064A\u062F.",
        "steps": [
          "\u0627\u0631\u0641\u0639 \u0627\u0644\u062D\u0648\u0636 \u0628\u0642\u062F\u0645 \u0627\u0644\u0627\u0631\u062A\u0643\u0627\u0632 \u0645\u0639 \u0628\u0642\u0627\u0621 \u0627\u0644\u0631\u062C\u0644 \u0627\u0644\u062D\u0631\u0629 \u0641\u064A \u0648\u0636\u0639\u0647\u0627.",
          "\u0623\u0646\u0632\u0644 \u0627\u0644\u062D\u0648\u0636 \u0628\u062A\u062D\u0643\u0645 \u0648\u0623\u0643\u0645\u0644 \u062C\u0647\u0629 \u0642\u062F\u0645 \u0627\u0644\u0627\u0631\u062A\u0643\u0627\u0632 \u0642\u0628\u0644 \u0627\u0644\u062A\u0628\u062F\u064A\u0644."
        ],
        "common_error": "\u0644\u0627 \u062A\u062F\u0648\u0631 \u0627\u0644\u062D\u0648\u0636 \u0623\u0648 \u062A\u062F\u0641\u0639 \u0628\u0627\u0644\u0631\u062C\u0644 \u0627\u0644\u062D\u0631\u0629 \u0623\u0648 \u062A\u0645\u062F\u0647\u0627 \u0631\u0643\u0644\u0629\u064B \u0644\u0644\u0623\u0645\u0627\u0645.",
        "counting": {
          "unit": "reps",
          "mode": "sequential",
          "side_means": "\u0642\u062F\u0645 \u0627\u0644\u0627\u0631\u062A\u0643\u0627\u0632",
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629. \u0623\u0643\u0645\u0644 \u0647\u062F\u0641 \u0627\u0644\u064A\u0645\u064A\u0646 \u062B\u0645 \u0641\u0627\u0635\u0644 \u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u0645\u062D\u062F\u062F \u0641\u064A \u0627\u0644\u062C\u0644\u0633\u0629 \u062B\u0645 \u0647\u062F\u0641 \u0627\u0644\u064A\u0633\u0627\u0631\u061B \u0627\u0644\u062C\u0647\u062A\u0627\u0646 \u0645\u0639\u064B\u0627 \u0645\u062C\u0645\u0648\u0639\u0629 \u0648\u0627\u062D\u062F\u0629 \u0623\u0648 \u0645\u062D\u0637\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-b-3",
          "hybrid-b-3",
          "strength-b-2",
          "strength-b-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "new_detail_documented",
        "qualified_review": "pending"
      },
      {
        "id": "single-calf",
        "name_ar": "\u0631\u0641\u0639 \u0643\u0639\u0628 \u0631\u062C\u0644 \u0648\u0627\u062D\u062F\u0629 \u0628\u0645\u0633\u0627\u0646\u062F\u0629",
        "equipment": "\u062D\u0627\u0626\u0637",
        "setup": "\u0642\u0641 \u0642\u0631\u0628 \u0627\u0644\u062D\u0627\u0626\u0637 \u0645\u0639 \u0645\u0633\u0627\u0646\u062F\u0629 \u0627\u0644\u064A\u062F\u064A\u0646\u060C \u0648\u0627\u0646\u0642\u0644 \u0627\u0644\u0648\u0632\u0646 \u0625\u0644\u0649 \u0627\u0644\u0642\u062F\u0645 \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629\u061B \u0627\u062B\u0646 \u0627\u0644\u0631\u0643\u0628\u0629 \u0627\u0644\u062D\u0631\u0629 \u0648\u0627\u0631\u0641\u0639 \u0642\u062F\u0645\u0647\u0627 \u062F\u0648\u0646 \u0627\u0644\u0627\u062A\u0643\u0627\u0621 \u0628\u0647\u0627.",
        "steps": [
          "\u0627\u0631\u0641\u0639 \u0643\u0639\u0628 \u0642\u062F\u0645 \u0627\u0644\u0627\u0631\u062A\u0643\u0627\u0632 \u0639\u0644\u0649 \u0623\u0631\u0636 \u0645\u0633\u062A\u0648\u064A\u0629.",
          "\u0623\u0646\u0632\u0644 \u0627\u0644\u0643\u0639\u0628 \u0628\u062A\u062D\u0643\u0645 \u0648\u0623\u0643\u0645\u0644 \u0627\u0644\u062C\u0647\u0629 \u062B\u0645 \u0628\u062F\u0651\u0644."
        ],
        "common_error": "\u0644\u0627 \u062A\u0633\u062A\u062E\u062F\u0645 \u062D\u0627\u0641\u0629 \u062F\u0631\u062C\u0629 \u0623\u0648 \u062A\u062F\u0641\u0639 \u0628\u0627\u0644\u0631\u062C\u0644 \u0627\u0644\u062D\u0631\u0629.",
        "counting": {
          "unit": "reps",
          "mode": "sequential",
          "side_means": "\u0642\u062F\u0645 \u0627\u0644\u0627\u0631\u062A\u0643\u0627\u0632",
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629. \u0623\u0643\u0645\u0644 \u0647\u062F\u0641 \u0627\u0644\u064A\u0645\u064A\u0646 \u062B\u0645 \u0641\u0627\u0635\u0644 \u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u0645\u062D\u062F\u062F \u0641\u064A \u0627\u0644\u062C\u0644\u0633\u0629 \u062B\u0645 \u0647\u062F\u0641 \u0627\u0644\u064A\u0633\u0627\u0631\u061B \u0627\u0644\u062C\u0647\u062A\u0627\u0646 \u0645\u0639\u064B\u0627 \u0645\u062C\u0645\u0648\u0639\u0629 \u0648\u0627\u062D\u062F\u0629 \u0623\u0648 \u0645\u062D\u0637\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "strength-b-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "new_detail_documented",
        "qualified_review": "pending"
      },
      {
        "id": "full-side-plank",
        "name_ar": "\u0628\u0644\u0627\u0646\u0643 \u062C\u0627\u0646\u0628\u064A \u0643\u0627\u0645\u0644 \u0628\u0642\u062F\u0645\u064A\u0646 \u0645\u062A\u062F\u0631\u062C\u062A\u064A\u0646",
        "equipment": "\u0628\u0633\u0627\u0637",
        "setup": "\u0627\u0633\u062A\u0644\u0642\u0650 \u0639\u0644\u0649 \u0627\u0644\u062C\u0627\u0646\u0628 \u0648\u0627\u0644\u0633\u0627\u0639\u062F \u062A\u062D\u062A \u0627\u0644\u0643\u062A\u0641 \u0648\u0627\u0644\u0631\u062C\u0644\u0627\u0646 \u0645\u0645\u062F\u0648\u062F\u062A\u0627\u0646\u061B \u0636\u0639 \u0627\u0644\u0642\u062F\u0645 \u0627\u0644\u0639\u0644\u064A\u0627 \u0623\u0645\u0627\u0645 \u0627\u0644\u0633\u0641\u0644\u0649 \u0642\u0644\u064A\u0644\u064B\u0627 \u0628\u062D\u064A\u062B \u062A\u0644\u0627\u0645\u0633\u0627\u0646 \u0627\u0644\u0623\u0631\u0636.",
        "steps": [
          "\u0627\u0631\u0641\u0639 \u0627\u0644\u062D\u0648\u0636 \u0645\u0639 \u0627\u0644\u0627\u0631\u062A\u0643\u0627\u0632 \u0639\u0644\u0649 \u0627\u0644\u0633\u0627\u0639\u062F \u0648\u0627\u0644\u0642\u062F\u0645\u064A\u0646 \u0627\u0644\u0645\u062A\u062F\u0631\u062C\u062A\u064A\u0646.",
          "\u062A\u0646\u0641\u0633 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u062B\u0628\u0627\u062A \u062B\u0645 \u0623\u0646\u0632\u0644 \u0627\u0644\u062D\u0648\u0636 \u0648\u0628\u062F\u0651\u0644 \u0627\u0644\u062C\u0627\u0646\u0628."
        ],
        "common_error": "\u0644\u0627 \u062A\u0643\u062F\u0633 \u0627\u0644\u0642\u062F\u0645\u064A\u0646 \u0623\u0648 \u062A\u062F\u0639 \u0627\u0644\u062D\u0648\u0636 \u064A\u0647\u0628\u0637 \u0623\u0648 \u064A\u0644\u062A\u0641 \u0644\u0644\u0623\u0645\u0627\u0645.",
        "counting": {
          "unit": "seconds",
          "mode": "sequential",
          "side_means": "\u0627\u0644\u062C\u0627\u0646\u0628 \u0627\u0644\u0633\u0641\u0644\u064A \u0627\u0644\u0645\u0631\u062A\u0643\u0632",
          "rule_ar": "\u064A\u062D\u062F\u062F \u0627\u0644\u0645\u0624\u0642\u062A \u0627\u0644\u0645\u062F\u0629\u061B \u0644\u0627 \u064A\u0637\u0644\u0628 \u0639\u062F\u0651 \u0627\u0644\u062D\u0631\u0643\u0627\u062A. \u0623\u0643\u0645\u0644 \u0647\u062F\u0641 \u0627\u0644\u064A\u0645\u064A\u0646 \u062B\u0645 \u0641\u0627\u0635\u0644 \u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u062C\u0647\u0629 \u0627\u0644\u0645\u062D\u062F\u062F \u0641\u064A \u0627\u0644\u062C\u0644\u0633\u0629 \u062B\u0645 \u0647\u062F\u0641 \u0627\u0644\u064A\u0633\u0627\u0631\u061B \u0627\u0644\u062C\u0647\u062A\u0627\u0646 \u0645\u0639\u064B\u0627 \u0645\u062C\u0645\u0648\u0639\u0629 \u0648\u0627\u062D\u062F\u0629 \u0623\u0648 \u0645\u062D\u0637\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-c-3",
          "hybrid-c-3",
          "strength-b-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "new_detail_documented",
        "qualified_review": "pending"
      },
      {
        "id": "partial-crunch",
        "name_ar": "\u0643\u0631\u0646\u0634 \u062C\u0632\u0626\u064A",
        "equipment": "\u0628\u0633\u0627\u0637",
        "setup": "\u0627\u0633\u062A\u0644\u0642\u0650 \u0648\u0627\u0644\u0631\u0643\u0628\u062A\u0627\u0646 \u0645\u062B\u0646\u064A\u062A\u0627\u0646 \u0648\u0627\u0644\u0642\u062F\u0645\u0627\u0646 \u0639\u0644\u0649 \u0627\u0644\u0623\u0631\u0636\u060C \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0645\u0645\u062F\u0648\u062F\u062A\u0627\u0646 \u0628\u0627\u062A\u062C\u0627\u0647 \u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646.",
        "steps": [
          "\u0627\u0632\u0641\u0631 \u0648\u0627\u0631\u0641\u0639 \u0627\u0644\u0631\u0623\u0633 \u0648\u0644\u0648\u062D\u064A \u0627\u0644\u0643\u062A\u0641\u064A\u0646 \u0645\u0633\u0627\u0641\u0629 \u0635\u063A\u064A\u0631\u0629 \u0645\u0639 \u0631\u0642\u0628\u0629 \u0645\u0631\u064A\u062D\u0629.",
          "\u0639\u062F \u0644\u0644\u0628\u0633\u0627\u0637 \u0628\u0628\u0637\u0621."
        ],
        "common_error": "\u0644\u0627 \u062A\u062A\u062D\u0648\u0644 \u0625\u0644\u0649 \u062C\u0644\u0648\u0633 \u0643\u0627\u0645\u0644 \u0623\u0648 \u062A\u0633\u062D\u0628 \u0627\u0644\u0631\u0642\u0628\u0629 \u0628\u0627\u0644\u064A\u062F\u064A\u0646.",
        "counting": {
          "unit": "reps",
          "mode": "bilateral",
          "side_means": null,
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "strength-c-1",
          "strength-c-2"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "reverse-crunch",
        "name_ar": "\u0643\u0631\u0646\u0634 \u0639\u0643\u0633\u064A",
        "equipment": "\u0628\u0633\u0627\u0637",
        "setup": "\u0627\u0633\u062A\u0644\u0642\u0650 \u0648\u0627\u0644\u0631\u0643\u0628\u062A\u0627\u0646 \u0645\u062B\u0646\u064A\u062A\u0627\u0646 \u0648\u0645\u0631\u0641\u0648\u0639\u062A\u0627\u0646 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0642\u0631\u0628 \u0627\u0644\u062C\u0633\u0645.",
        "steps": [
          "\u0627\u0632\u0641\u0631 \u0648\u0644\u0641 \u0627\u0644\u062D\u0648\u0636 \u0642\u0644\u064A\u0644\u064B\u0627 \u0644\u064A\u0631\u062A\u0641\u0639 \u0639\u0646 \u0627\u0644\u0628\u0633\u0627\u0637 \u062F\u0648\u0646 \u062A\u0623\u0631\u062C\u062D.",
          "\u0623\u0639\u062F \u0627\u0644\u062D\u0648\u0636 \u0628\u0628\u0637\u0621 \u0645\u0639 \u0628\u0642\u0627\u0621 \u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646 \u0645\u062B\u0646\u064A\u062A\u064A\u0646."
        ],
        "common_error": "\u0644\u0627 \u062A\u0642\u0630\u0641 \u0627\u0644\u0631\u062C\u0644\u064A\u0646 \u0646\u062D\u0648 \u0627\u0644\u0631\u0623\u0633 \u0623\u0648 \u062A\u062D\u0645\u0644 \u0627\u0644\u0648\u0632\u0646 \u0639\u0644\u0649 \u0627\u0644\u0631\u0642\u0628\u0629.",
        "counting": {
          "unit": "reps",
          "mode": "bilateral",
          "side_means": null,
          "rule_ar": "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u062D\u0631\u0643\u0629 \u0648\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0628\u062F\u0627\u064A\u0629 \u0639\u062F\u0651\u0629 \u0648\u0627\u062D\u062F\u0629."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "strength-c-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "lateral-double",
        "name_ar": "\u062E\u0637\u0648\u062A\u0627\u0646 \u062C\u0627\u0646\u0628\u064A\u062A\u0627\u0646 \u062B\u0645 \u0627\u0644\u0639\u0648\u062F\u0629",
        "equipment": "\u0644\u0627 \u0634\u064A\u0621",
        "setup": "\u0642\u0641 \u0641\u064A \u0645\u0633\u0627\u062D\u0629 \u062E\u0627\u0644\u064A\u0629 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0645\u0631\u062A\u062E\u064A\u062A\u0627\u0646.",
        "steps": [
          "\u0627\u062E\u0637\u064F \u064A\u0645\u064A\u0646\u064B\u0627 \u0648\u0642\u0631\u0651\u0628 \u0627\u0644\u064A\u0633\u0631\u0649\u060C \u062B\u0645 \u0643\u0631\u0631 \u062E\u0637\u0648\u0629 \u0648\u0636\u0645\u064B\u0627 \u0625\u0644\u0649 \u0627\u0644\u064A\u0645\u064A\u0646.",
          "\u0646\u0641\u0651\u0630 \u062E\u0637\u0648\u062A\u064A\u0646 \u0645\u0639 \u0627\u0644\u0636\u0645 \u0644\u0644\u0639\u0648\u062F\u0629 \u064A\u0633\u0627\u0631\u064B\u0627 \u0648\u0648\u0627\u0635\u0644."
        ],
        "common_error": "\u0644\u0627 \u062A\u0642\u0627\u0637\u0639 \u0627\u0644\u0642\u062F\u0645\u064A\u0646 \u0623\u0648 \u062A\u0636\u0641 \u0642\u0641\u0632\u0629.",
        "counting": {
          "unit": "seconds",
          "mode": "continuous",
          "side_means": null,
          "rule_ar": "\u064A\u062D\u062F\u062F \u0627\u0644\u0645\u0624\u0642\u062A \u0627\u0644\u0645\u062F\u0629\u061B \u0644\u0627 \u064A\u0637\u0644\u0628 \u0639\u062F\u0651 \u0627\u0644\u062D\u0631\u0643\u0627\u062A."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-c-2",
          "hybrid-a-2",
          "hybrid-c-2"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "lateral-double-arms",
        "name_ar": "\u062E\u0637\u0648\u062A\u0627\u0646 \u062C\u0627\u0646\u0628\u064A\u062A\u0627\u0646 \u0645\u0639 \u062A\u062D\u0631\u064A\u0643 \u0627\u0644\u0630\u0631\u0627\u0639\u064A\u0646",
        "equipment": "\u0644\u0627 \u0634\u064A\u0621",
        "setup": "\u0642\u0641 \u0648\u0627\u0644\u0645\u0631\u0641\u0642\u0627\u0646 \u0645\u062B\u0646\u064A\u0627\u0646 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0642\u0631\u0628 \u0627\u0644\u062C\u0627\u0646\u0628\u064A\u0646.",
        "steps": [
          "\u0646\u0641\u0651\u0630 \u062E\u0637\u0648\u062A\u064A\u0646 \u062C\u0627\u0646\u0628\u064A\u062A\u064A\u0646 \u0645\u0639 \u0627\u0644\u0636\u0645\u061B \u062D\u0631\u0651\u0643 \u0627\u0644\u0633\u0627\u0639\u062F\u064A\u0646 \u0645\u0639\u064B\u0627 \u0644\u0644\u0623\u0645\u0627\u0645 \u0639\u0646\u062F \u0643\u0644 \u062E\u0637\u0648\u0629 \u062C\u0627\u0646\u0628\u064A\u0629\u060C \u0648\u0623\u0639\u062F\u0647\u0645\u0627 \u0639\u0646\u062F \u0636\u0645 \u0627\u0644\u0642\u062F\u0645.",
          "\u0627\u0631\u062C\u0639 \u0628\u062E\u0637\u0648\u062A\u064A\u0646 \u0644\u0644\u062C\u0647\u0629 \u0627\u0644\u0623\u062E\u0631\u0649 \u0645\u0639 \u0627\u0644\u062A\u0646\u0633\u064A\u0642 \u0646\u0641\u0633\u0647 \u0648\u0627\u0644\u064A\u062F\u064A\u0646 \u062F\u0648\u0646 \u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0643\u062A\u0641\u064A\u0646."
        ],
        "common_error": "\u0644\u0627 \u062A\u0631\u0641\u0639 \u0627\u0644\u0630\u0631\u0627\u0639\u064A\u0646 \u0641\u0648\u0642 \u0627\u0644\u0631\u0623\u0633 \u0623\u0648 \u062A\u062C\u0639\u0644 \u062D\u0631\u0643\u062A\u0647\u0645\u0627 \u062A\u0633\u0628\u0628 \u062F\u0648\u0631\u0627\u0646 \u0627\u0644\u062C\u0630\u0639.",
        "counting": {
          "unit": "seconds",
          "mode": "continuous",
          "side_means": null,
          "rule_ar": "\u064A\u062D\u062F\u062F \u0627\u0644\u0645\u0624\u0642\u062A \u0627\u0644\u0645\u062F\u0629\u061B \u0644\u0627 \u064A\u0637\u0644\u0628 \u0639\u062F\u0651 \u0627\u0644\u062D\u0631\u0643\u0627\u062A."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-c-3",
          "hybrid-a-3",
          "hybrid-c-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "new_detail_documented",
        "qualified_review": "pending"
      },
      {
        "id": "heel-touch-arm",
        "name_ar": "\u0644\u0645\u0633 \u0627\u0644\u0643\u0639\u0628 \u0644\u0644\u0623\u0645\u0627\u0645 \u0645\u0639 \u0645\u062F \u0627\u0644\u0630\u0631\u0627\u0639 \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629",
        "equipment": "\u0644\u0627 \u0634\u064A\u0621",
        "setup": "\u0642\u0641 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0642\u0631\u0628 \u0627\u0644\u062C\u0627\u0646\u0628\u064A\u0646 \u0648\u0627\u0644\u0631\u0643\u0628\u062A\u0627\u0646 \u0645\u0631\u062A\u062E\u064A\u062A\u0627\u0646.",
        "steps": [
          "\u0627\u0644\u0645\u0633 \u0627\u0644\u0623\u0631\u0636 \u0628\u0643\u0639\u0628 \u0642\u062F\u0645 \u0623\u0645\u0627\u0645\u064B\u0627 \u0648\u0645\u062F \u0627\u0644\u0630\u0631\u0627\u0639 \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u0623\u0645\u0627\u0645 \u062F\u0648\u0646 \u062A\u062C\u0627\u0648\u0632 \u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0643\u062A\u0641.",
          "\u0623\u0639\u062F \u0627\u0644\u0642\u062F\u0645 \u0648\u0627\u0644\u0630\u0631\u0627\u0639 \u062B\u0645 \u0628\u062F\u0651\u0644 \u0627\u0644\u0637\u0631\u0641\u064A\u0646."
        ],
        "common_error": "\u0644\u0627 \u062A\u0645\u062F \u0630\u0631\u0627\u0639 \u0627\u0644\u062C\u0647\u0629 \u0646\u0641\u0633\u0647\u0627 \u0623\u0648 \u062A\u0646\u062D\u0646\u0650 \u0644\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0627\u0644\u0642\u062F\u0645.",
        "counting": {
          "unit": "seconds",
          "mode": "continuous",
          "side_means": null,
          "rule_ar": "\u064A\u062D\u062F\u062F \u0627\u0644\u0645\u0624\u0642\u062A \u0627\u0644\u0645\u062F\u0629\u061B \u0644\u0627 \u064A\u0637\u0644\u0628 \u0639\u062F\u0651 \u0627\u0644\u062D\u0631\u0643\u0627\u062A."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-b-2",
          "circuit-b-3",
          "hybrid-b-2",
          "hybrid-b-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "hamstring-curl",
        "name_ar": "\u062B\u0646\u064A \u0631\u0643\u0628\u0629 \u0648\u0631\u0641\u0639 \u0643\u0639\u0628 \u0644\u0644\u062E\u0644\u0641 \u0628\u0627\u0644\u062A\u0628\u0627\u062F\u0644",
        "equipment": "\u0644\u0627 \u0634\u064A\u0621",
        "setup": "\u0642\u0641 \u0628\u0627\u0633\u062A\u0642\u0627\u0645\u0629 \u0645\u0631\u064A\u062D\u0629 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0642\u0631\u0628 \u0627\u0644\u062C\u0627\u0646\u0628\u064A\u0646.",
        "steps": [
          "\u0627\u062B\u0646 \u0631\u0643\u0628\u0629 \u0648\u0627\u0631\u0641\u0639 \u0627\u0644\u0643\u0639\u0628 \u0644\u0644\u062E\u0644\u0641 \u0646\u062D\u0648 \u0627\u0644\u062C\u0633\u0645 \u0636\u0645\u0646 \u0645\u062F\u0649 \u0645\u0631\u064A\u062D \u0645\u0639 \u0628\u0642\u0627\u0621 \u0627\u0644\u0641\u062E\u0630 \u0642\u0631\u064A\u0628\u064B\u0627 \u0645\u0646 \u0648\u0636\u0639 \u0627\u0644\u0648\u0642\u0648\u0641.",
          "\u0623\u0639\u062F \u0627\u0644\u0642\u062F\u0645 \u0648\u0628\u062F\u0651\u0644 \u0627\u0644\u0631\u062C\u0644 \u062F\u0648\u0646 \u0642\u0641\u0632."
        ],
        "common_error": "\u0644\u0627 \u062A\u0642\u0648\u0651\u0633 \u0627\u0644\u0638\u0647\u0631 \u0623\u0648 \u062A\u062F\u0641\u0639 \u0627\u0644\u0631\u0643\u0628\u0629 \u0644\u0644\u0623\u0645\u0627\u0645 \u0628\u0642\u0648\u0629.",
        "counting": {
          "unit": "seconds",
          "mode": "continuous",
          "side_means": null,
          "rule_ar": "\u064A\u062D\u062F\u062F \u0627\u0644\u0645\u0624\u0642\u062A \u0627\u0644\u0645\u062F\u0629\u061B \u0644\u0627 \u064A\u0637\u0644\u0628 \u0639\u062F\u0651 \u0627\u0644\u062D\u0631\u0643\u0627\u062A."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "hybrid-b-1",
          "hybrid-b-2"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "hamstring-curl-arms",
        "name_ar": "\u062B\u0646\u064A \u0631\u0643\u0628\u0629 \u0644\u0644\u062E\u0644\u0641 \u0645\u0639 \u062A\u062D\u0631\u064A\u0643 \u0627\u0644\u0630\u0631\u0627\u0639\u064A\u0646",
        "equipment": "\u0644\u0627 \u0634\u064A\u0621",
        "setup": "\u0642\u0641 \u0648\u0627\u0644\u0645\u0631\u0641\u0642\u0627\u0646 \u0645\u062B\u0646\u064A\u0627\u0646 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0642\u0631\u0628 \u0627\u0644\u062C\u0627\u0646\u0628\u064A\u0646.",
        "steps": [
          "\u0627\u062B\u0646 \u0631\u0643\u0628\u0629 \u0648\u0627\u0631\u0641\u0639 \u0643\u0639\u0628\u0647\u0627 \u0644\u0644\u062E\u0644\u0641 \u0645\u0639 \u062A\u062D\u0631\u064A\u0643 \u0627\u0644\u0630\u0631\u0627\u0639 \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u0623\u0645\u0627\u0645 \u0648\u0627\u0644\u0630\u0631\u0627\u0639 \u0627\u0644\u0623\u062E\u0631\u0649 \u0644\u0644\u062E\u0644\u0641 \u062D\u0631\u0643\u0629 \u0642\u0635\u064A\u0631\u0629.",
          "\u0623\u0639\u062F \u0627\u0644\u0642\u062F\u0645 \u062B\u0645 \u0628\u062F\u0651\u0644 \u0627\u0644\u0631\u062C\u0644 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u064A\u0646 \u062F\u0648\u0646 \u0642\u0641\u0632."
        ],
        "common_error": "\u0644\u0627 \u062A\u0631\u0641\u0639 \u0627\u0644\u0630\u0631\u0627\u0639\u064A\u0646 \u0639\u0627\u0644\u064A\u064B\u0627 \u0623\u0648 \u062A\u0644\u0641 \u0627\u0644\u062C\u0630\u0639 \u0644\u0645\u062A\u0627\u0628\u0639\u062A\u0647\u0645\u0627.",
        "counting": {
          "unit": "seconds",
          "mode": "continuous",
          "side_means": null,
          "rule_ar": "\u064A\u062D\u062F\u062F \u0627\u0644\u0645\u0624\u0642\u062A \u0627\u0644\u0645\u062F\u0629\u061B \u0644\u0627 \u064A\u0637\u0644\u0628 \u0639\u062F\u0651 \u0627\u0644\u062D\u0631\u0643\u0627\u062A."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "hybrid-b-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "new_detail_documented",
        "qualified_review": "pending"
      },
      {
        "id": "forward-back",
        "name_ar": "\u062E\u0637\u0648\u062A\u0627\u0646 \u0644\u0644\u0623\u0645\u0627\u0645 \u062B\u0645 \u062E\u0637\u0648\u062A\u0627\u0646 \u0644\u0644\u062E\u0644\u0641",
        "equipment": "\u0644\u0627 \u0634\u064A\u0621",
        "setup": "\u0642\u0641 \u0641\u064A \u0645\u0633\u0627\u062D\u0629 \u062E\u0627\u0644\u064A\u0629 \u062A\u0643\u0641\u064A \u0644\u062E\u0637\u0648\u0627\u062A \u0642\u0635\u064A\u0631\u0629 \u0623\u0645\u0627\u0645\u0643 \u0648\u062E\u0644\u0641\u0643.",
        "steps": [
          "\u0627\u062E\u0637\u064F \u062E\u0637\u0648\u062A\u064A\u0646 \u0642\u0635\u064A\u0631\u062A\u064A\u0646 \u0644\u0644\u0623\u0645\u0627\u0645 \u062B\u0645 \u062E\u0637\u0648\u062A\u064A\u0646 \u0644\u0644\u062E\u0644\u0641 \u0644\u0644\u0639\u0648\u062F\u0629\u060C \u0645\u0639 \u0628\u0642\u0627\u0621 \u0627\u0644\u0648\u062C\u0647 \u0644\u0644\u0623\u0645\u0627\u0645.",
          "\u0648\u0627\u0635\u0644 \u0627\u0644\u062A\u0633\u0644\u0633\u0644 \u0628\u0625\u064A\u0642\u0627\u0639 \u0645\u062A\u062D\u0643\u0645 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u062A\u062A\u062D\u0631\u0643\u0627\u0646 \u0637\u0628\u064A\u0639\u064A\u064B\u0627."
        ],
        "common_error": "\u0644\u0627 \u062A\u062F\u064F\u0631 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u0639\u0648\u062F\u0629 \u0623\u0648 \u062A\u0631\u062C\u0639 \u0628\u062E\u0637\u0648\u0627\u062A \u0637\u0648\u064A\u0644\u0629 \u0644\u0627 \u062A\u0631\u0649 \u0645\u062C\u0627\u0644\u0647\u0627.",
        "counting": {
          "unit": "seconds",
          "mode": "continuous",
          "side_means": null,
          "rule_ar": "\u064A\u062D\u062F\u062F \u0627\u0644\u0645\u0624\u0642\u062A \u0627\u0644\u0645\u062F\u0629\u061B \u0644\u0627 \u064A\u0637\u0644\u0628 \u0639\u062F\u0651 \u0627\u0644\u062D\u0631\u0643\u0627\u062A."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-b-3",
          "hybrid-b-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      },
      {
        "id": "seated-breath",
        "name_ar": "\u062A\u0646\u0641\u0633 \u0637\u0628\u064A\u0639\u064A \u062C\u0627\u0644\u0633\u064B\u0627",
        "equipment": "\u0643\u0631\u0633\u064A",
        "setup": "\u0627\u062C\u0644\u0633 \u0639\u0644\u0649 \u0643\u0631\u0633\u064A \u062B\u0627\u0628\u062A \u0648\u0627\u0644\u0642\u062F\u0645\u0627\u0646 \u0639\u0644\u0649 \u0627\u0644\u0623\u0631\u0636 \u0648\u0627\u0644\u064A\u062F\u0627\u0646 \u0645\u0631\u062A\u0627\u062D\u062A\u0627\u0646 \u0639\u0644\u0649 \u0627\u0644\u0641\u062E\u0630\u064A\u0646.",
        "steps": [
          "\u0623\u0631\u062E\u0650 \u0627\u0644\u0643\u062A\u0641\u064A\u0646 \u0648\u062A\u0646\u0641\u0633 \u0628\u0625\u064A\u0642\u0627\u0639\u0643 \u0627\u0644\u0637\u0628\u064A\u0639\u064A.",
          "\u062F\u0639 \u0627\u0644\u0646\u0641\u0633 \u064A\u0647\u062F\u0623 \u062F\u0648\u0646 \u062A\u0648\u0642\u064A\u062A \u0644\u0644\u0634\u0647\u064A\u0642 \u0648\u0627\u0644\u0632\u0641\u064A\u0631."
        ],
        "common_error": "\u0644\u0627 \u062A\u062D\u0628\u0633 \u0627\u0644\u0646\u0641\u0633 \u0623\u0648 \u062A\u062C\u0628\u0631\u0647 \u0639\u0644\u0649 \u0627\u0644\u0639\u0645\u0642 \u0623\u0648 \u0627\u0644\u0633\u0631\u0639\u0629.",
        "counting": {
          "unit": "seconds",
          "mode": "continuous",
          "side_means": null,
          "rule_ar": "\u064A\u062D\u062F\u062F \u0627\u0644\u0645\u0624\u0642\u062A \u0627\u0644\u0645\u062F\u0629\u061B \u0644\u0627 \u064A\u0637\u0644\u0628 \u0639\u062F\u0651 \u0627\u0644\u062D\u0631\u0643\u0627\u062A."
        },
        "dose_source": "workout_prescription_only",
        "pause_source": "workout_prescription_only",
        "used_by": [
          "circuit-a-1",
          "circuit-a-2",
          "circuit-a-3",
          "circuit-b-1",
          "circuit-b-2",
          "circuit-b-3",
          "circuit-c-1",
          "circuit-c-2",
          "circuit-c-3",
          "foundation-a-1",
          "foundation-a-2",
          "foundation-a-3",
          "foundation-b-1",
          "foundation-b-2",
          "foundation-b-3",
          "foundation-c-1",
          "foundation-c-2",
          "foundation-c-3",
          "hybrid-a-1",
          "hybrid-a-2",
          "hybrid-a-3",
          "hybrid-b-1",
          "hybrid-b-2",
          "hybrid-b-3",
          "hybrid-c-1",
          "hybrid-c-2",
          "hybrid-c-3",
          "move-a-1",
          "move-a-2",
          "move-a-3",
          "move-b-1",
          "move-b-2",
          "move-b-3",
          "move-c-1",
          "move-c-2",
          "move-c-3",
          "strength-a-1",
          "strength-a-2",
          "strength-a-3",
          "strength-b-1",
          "strength-b-2",
          "strength-b-3",
          "strength-c-1",
          "strength-c-2",
          "strength-c-3"
        ],
        "image": null,
        "image_status": "deferred_by_user",
        "editorial_status": "expanded_from_spec",
        "qualified_review": "pending"
      }
    ],
    "programs": [
      {
        "id": "move",
        "levels": [
          {
            "id": "move-1",
            "number": 1,
            "workouts": [
              "move-a-1",
              "move-b-1",
              "move-c-1"
            ]
          },
          {
            "id": "move-2",
            "number": 2,
            "workouts": [
              "move-a-2",
              "move-b-2",
              "move-c-2"
            ]
          },
          {
            "id": "move-3",
            "number": 3,
            "workouts": [
              "move-a-3",
              "move-b-3",
              "move-c-3"
            ]
          }
        ]
      },
      {
        "id": "foundation",
        "levels": [
          {
            "id": "foundation-1",
            "number": 1,
            "workouts": [
              "foundation-a-1",
              "foundation-b-1",
              "foundation-c-1"
            ]
          },
          {
            "id": "foundation-2",
            "number": 2,
            "workouts": [
              "foundation-a-2",
              "foundation-b-2",
              "foundation-c-2"
            ]
          },
          {
            "id": "foundation-3",
            "number": 3,
            "workouts": [
              "foundation-a-3",
              "foundation-b-3",
              "foundation-c-3"
            ]
          }
        ]
      },
      {
        "id": "strength",
        "levels": [
          {
            "id": "strength-1",
            "number": 1,
            "workouts": [
              "strength-a-1",
              "strength-b-1",
              "strength-c-1"
            ]
          },
          {
            "id": "strength-2",
            "number": 2,
            "workouts": [
              "strength-a-2",
              "strength-b-2",
              "strength-c-2"
            ]
          },
          {
            "id": "strength-3",
            "number": 3,
            "workouts": [
              "strength-a-3",
              "strength-b-3",
              "strength-c-3"
            ]
          }
        ]
      },
      {
        "id": "hybrid",
        "levels": [
          {
            "id": "hybrid-1",
            "number": 1,
            "workouts": [
              "hybrid-a-1",
              "hybrid-b-1",
              "hybrid-c-1"
            ]
          },
          {
            "id": "hybrid-2",
            "number": 2,
            "workouts": [
              "hybrid-a-2",
              "hybrid-b-2",
              "hybrid-c-2"
            ]
          },
          {
            "id": "hybrid-3",
            "number": 3,
            "workouts": [
              "hybrid-a-3",
              "hybrid-b-3",
              "hybrid-c-3"
            ]
          }
        ]
      },
      {
        "id": "circuit",
        "levels": [
          {
            "id": "circuit-1",
            "number": 1,
            "workouts": [
              "circuit-a-1",
              "circuit-b-1",
              "circuit-c-1"
            ]
          },
          {
            "id": "circuit-2",
            "number": 2,
            "workouts": [
              "circuit-a-2",
              "circuit-b-2",
              "circuit-c-2"
            ]
          },
          {
            "id": "circuit-3",
            "number": 3,
            "workouts": [
              "circuit-a-3",
              "circuit-b-3",
              "circuit-c-3"
            ]
          }
        ]
      }
    ],
    "workouts": [
      {
        "id": "move-a-1",
        "program": "move",
        "level": 1,
        "session": "A",
        "plannedMinutes": [
          8,
          10
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "gentle"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "move-a-1-1",
                "source_line": 80,
                "source": "\u0627\u0644\u062A\u0641\u0627\u062A \u0627\u0644\u0631\u0642\u0628\u0629 \u062C\u0627\u0644\u0633\u064B\u0627:2 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "neck-turn-seated",
                "sets": 1,
                "target": 2,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 3,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-a-1-2",
                "source_line": 81,
                "source": "\u062C\u0644\u0648\u0633 \u0648\u0648\u0642\u0648\u0641:8",
                "pace": null,
                "exercise_id": "sit-stand",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-a-1-3",
                "source_line": 82,
                "source": "\u0636\u063A\u0637 \u062D\u0627\u0626\u0637:8",
                "pace": null,
                "exercise_id": "wall-push",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-a-1-4",
                "source_line": 83,
                "source": "\u0627\u0646\u0632\u0644\u0627\u0642 \u0627\u0644\u0630\u0631\u0627\u0639\u064A\u0646 \u0628\u0627\u0644\u062D\u0627\u0626\u0637:6",
                "pace": null,
                "exercise_id": "wall-slide",
                "sets": 1,
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-a-1-5",
                "source_line": 84,
                "source": "\u0645\u0634\u064A \u0646\u0634\u064A\u0637:45\u062B",
                "pace": "active",
                "exercise_id": "march",
                "sets": 1,
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "move-a-2",
        "program": "move",
        "level": 2,
        "session": "A",
        "plannedMinutes": [
          10,
          12
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "gentle"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "move-a-2-1",
                "source_line": 80,
                "source": "\u0646\u0641\u0633\u0647:2 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "neck-turn-seated",
                "sets": 1,
                "target": 2,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 3,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-a-2-2",
                "source_line": 81,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u0644\u0627\u0645\u0633\u0629 \u0627\u0644\u0643\u0631\u0633\u064A:10",
                "pace": null,
                "exercise_id": "chair-squat",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-a-2-3",
                "source_line": 82,
                "source": "\u0636\u063A\u0637 \u062D\u0627\u0626\u0637:10",
                "pace": null,
                "exercise_id": "wall-push",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-a-2-4",
                "source_line": 83,
                "source": "\u0645\u0634\u064A \u0646\u0634\u064A\u0637 \u0628\u0630\u0631\u0627\u0639 \u0645\u0642\u0627\u0628\u0644\u0629:60\u062B",
                "pace": null,
                "exercise_id": "cross-march",
                "sets": 1,
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 30
              },
              {
                "id": "move-a-2-5",
                "source_line": 84,
                "source": "\u062C\u0633\u0631:10",
                "pace": null,
                "exercise_id": "bridge",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 1,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-a-2-6",
                "source_line": 85,
                "source": "\u0627\u0646\u0632\u0644\u0627\u0642 \u0643\u0639\u0628:5 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "heel-slide",
                "sets": 1,
                "target": 5,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 30
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "move-a-3",
        "program": "move",
        "level": 3,
        "session": "A",
        "plannedMinutes": [
          10,
          12
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "gentle"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "move-a-3-1",
                "source_line": 80,
                "source": "\u0646\u0641\u0633\u0647:2 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "neck-turn-seated",
                "sets": 1,
                "target": 2,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 3,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-a-3-2",
                "source_line": 81,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u062D\u0631\u0629:10",
                "pace": null,
                "exercise_id": "squat",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-a-3-3",
                "source_line": 82,
                "source": "\u0636\u063A\u0637 \u062D\u0627\u0626\u0637:10",
                "pace": null,
                "exercise_id": "wall-push",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-a-3-4",
                "source_line": 83,
                "source": "\u0646\u0641\u0633\u0647:60\u062B",
                "pace": null,
                "exercise_id": "cross-march",
                "sets": 1,
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 30
              },
              {
                "id": "move-a-3-5",
                "source_line": 84,
                "source": "Bird Dog:5 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "bird-dog",
                "sets": 1,
                "target": 5,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 2,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-a-3-6",
                "source_line": 85,
                "source": "\u062C\u0633\u0631:12",
                "pace": null,
                "exercise_id": "bridge",
                "sets": 1,
                "target": 12,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 1,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 30
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "move-b-1",
        "program": "move",
        "level": 1,
        "session": "B",
        "plannedMinutes": [
          9,
          11
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "gentle"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "move-b-1-1",
                "source_line": 91,
                "source": "\u062F\u0648\u0631\u0627\u0646 \u0635\u062F\u0631\u064A \u062C\u0627\u0644\u0633:5 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "thoracic-rotation-seated",
                "sets": 1,
                "target": 5,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-b-1-2",
                "source_line": 92,
                "source": "\u062F\u0641\u0639 \u0627\u0644\u0648\u0631\u0643 \u0644\u0644\u062D\u0627\u0626\u0637:8",
                "pace": null,
                "exercise_id": "wall-hinge",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-b-1-3",
                "source_line": 93,
                "source": "\u0631\u0641\u0639 \u0631\u062C\u0644 \u062C\u0627\u0646\u0628\u064B\u0627 \u0628\u0645\u0633\u0627\u0646\u062F\u0629:5 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-side-leg-raise",
                "sets": 1,
                "target": 5,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-b-1-4",
                "source_line": 94,
                "source": "\u0631\u0641\u0639 \u0643\u0639\u0628\u064A\u0646 \u0628\u0645\u0633\u0627\u0646\u062F\u0629:10",
                "pace": null,
                "exercise_id": "calf-raise",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-b-1-5",
                "source_line": 95,
                "source": "\u0648\u0642\u0648\u0641 \u0645\u062A\u062F\u0631\u062C \u0628\u0645\u0633\u0627\u0646\u062F\u0629:15\u062B \u0644\u0643\u0644 \u0648\u0636\u0639\u064A\u0629",
                "pace": null,
                "exercise_id": "supported-tandem",
                "sets": 1,
                "target": 15,
                "unit": "seconds",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-b-1-6",
                "source_line": 96,
                "source": "\u062E\u0637\u0648\u0627\u062A \u062C\u0627\u0646\u0628\u064A\u0629:45\u062B",
                "pace": null,
                "exercise_id": "side-step",
                "sets": 1,
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "move-b-2",
        "program": "move",
        "level": 2,
        "session": "B",
        "plannedMinutes": [
          9,
          11
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "gentle"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "move-b-2-1",
                "source_line": 91,
                "source": "\u0646\u0641\u0633\u0647:5 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "thoracic-rotation-seated",
                "sets": 1,
                "target": 5,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-b-2-2",
                "source_line": 92,
                "source": "\u062F\u0641\u0639 \u0627\u0644\u0648\u0631\u0643 \u0644\u0644\u062D\u0627\u0626\u0637:10",
                "pace": null,
                "exercise_id": "wall-hinge",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-b-2-3",
                "source_line": 93,
                "source": "\u0631\u0641\u0639 \u0643\u0639\u0628\u064A\u0646 \u0628\u0645\u0633\u0627\u0646\u062F\u0629:12",
                "pace": null,
                "exercise_id": "calf-raise",
                "sets": 1,
                "target": 12,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-b-2-4",
                "source_line": 94,
                "source": "\u0648\u0642\u0648\u0641 \u0631\u062C\u0644 \u0648\u0627\u062D\u062F\u0629 \u0628\u0645\u0633\u0627\u0646\u062F\u0629:20\u062B \u0644\u0643\u0644 \u0631\u062C\u0644",
                "pace": null,
                "exercise_id": "supported-single-balance",
                "sets": 1,
                "target": 20,
                "unit": "seconds",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 30
              },
              {
                "id": "move-b-2-5",
                "source_line": 95,
                "source": "Cat\u2013Cow:6 \u062F\u0648\u0631\u0627\u062A",
                "pace": null,
                "exercise_id": "cat-cow",
                "sets": 1,
                "target": 6,
                "unit": "cycles",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 30
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "move-b-3",
        "program": "move",
        "level": 3,
        "session": "B",
        "plannedMinutes": [
          11,
          14
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "gentle"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "move-b-3-1",
                "source_line": 91,
                "source": "\u0646\u0641\u0633\u0647:5 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "thoracic-rotation-seated",
                "sets": 1,
                "target": 5,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-b-3-2",
                "source_line": 92,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u0646\u0642\u0633\u0645\u0629 \u0628\u0645\u0633\u0627\u0646\u062F\u0629:8 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-split",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-b-3-3",
                "source_line": 93,
                "source": "\u0631\u0641\u0639 \u0643\u0639\u0628\u064A\u0646 \u0628\u0645\u0633\u0627\u0646\u062F\u0629:15",
                "pace": null,
                "exercise_id": "calf-raise",
                "sets": 1,
                "target": 15,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-b-3-4",
                "source_line": 94,
                "source": "\u0646\u0641\u0633\u0647:20\u062B \u0644\u0643\u0644 \u0631\u062C\u0644",
                "pace": null,
                "exercise_id": "supported-single-balance",
                "sets": 1,
                "target": 20,
                "unit": "seconds",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 30
              },
              {
                "id": "move-b-3-5",
                "source_line": 95,
                "source": "Cat\u2013Cow:6 \u062F\u0648\u0631\u0627\u062A",
                "pace": null,
                "exercise_id": "cat-cow",
                "sets": 1,
                "target": 6,
                "unit": "cycles",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 30
              },
              {
                "id": "move-b-3-6",
                "source_line": 96,
                "source": "\u0645\u0634\u064A \u0646\u0634\u064A\u0637 \u0628\u0630\u0631\u0627\u0639 \u0645\u0642\u0627\u0628\u0644\u0629:60\u062B",
                "pace": null,
                "exercise_id": "cross-march",
                "sets": 1,
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "move-c-1",
        "program": "move",
        "level": 1,
        "session": "C",
        "plannedMinutes": [
          9,
          11
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "gentle"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "move-c-1-1",
                "source_line": 104,
                "source": "\u0645\u064A\u0644 \u0627\u0644\u0631\u0623\u0633 \u0627\u0644\u062C\u0627\u0646\u0628\u064A \u062C\u0627\u0644\u0633\u064B\u0627:2 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "neck-tilt-seated",
                "sets": 1,
                "target": 2,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 3,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-c-1-2",
                "source_line": 105,
                "source": "\u062C\u0644\u0648\u0633 \u0648\u0648\u0642\u0648\u0641:8",
                "pace": null,
                "exercise_id": "sit-stand",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-c-1-3",
                "source_line": 106,
                "source": "\u0636\u063A\u0637 \u062D\u0627\u0626\u0637:8",
                "pace": null,
                "exercise_id": "wall-push",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-c-1-4",
                "source_line": 107,
                "source": "\u0641\u062A\u062D \u0635\u062F\u0631 \u0644\u0637\u064A\u0641 \u062B\u0627\u0628\u062A:20\u062B",
                "pace": null,
                "exercise_id": "chest-open",
                "sets": 1,
                "target": 20,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-c-1-5",
                "source_line": 108,
                "source": "\u0644\u0645\u0633 \u0627\u0644\u0643\u0639\u0628 \u0644\u0644\u0623\u0645\u0627\u0645:40\u062B",
                "pace": null,
                "exercise_id": "heel-touch",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-c-1-6",
                "source_line": 109,
                "source": "\u062E\u0637\u0648\u0627\u062A \u062C\u0627\u0646\u0628\u064A\u0629:40\u062B",
                "pace": null,
                "exercise_id": "side-step",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "move-c-2",
        "program": "move",
        "level": 2,
        "session": "C",
        "plannedMinutes": [
          10,
          12
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "gentle"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "move-c-2-1",
                "source_line": 104,
                "source": "\u0646\u0641\u0633\u0647:2 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "neck-tilt-seated",
                "sets": 1,
                "target": 2,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 3,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-c-2-2",
                "source_line": 105,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u0644\u0627\u0645\u0633\u0629 \u0627\u0644\u0643\u0631\u0633\u064A:10",
                "pace": null,
                "exercise_id": "chair-squat",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-c-2-3",
                "source_line": 106,
                "source": "\u0627\u0646\u0632\u0644\u0627\u0642 \u0627\u0644\u0630\u0631\u0627\u0639\u064A\u0646 \u0628\u0627\u0644\u062D\u0627\u0626\u0637:6",
                "pace": null,
                "exercise_id": "wall-slide",
                "sets": 1,
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-c-2-4",
                "source_line": 107,
                "source": "\u0641\u062A\u062D \u062C\u0627\u0646\u0628\u064A \u062F\u0648\u0646 \u0642\u0641\u0632 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0643\u062A\u0641\u064A\u0646:45\u062B",
                "pace": null,
                "exercise_id": "step-jack",
                "sets": 1,
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 30
              },
              {
                "id": "move-c-2-5",
                "source_line": 108,
                "source": "\u0627\u0646\u0632\u0644\u0627\u0642 \u0627\u0644\u0643\u0639\u0628:5 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "heel-slide",
                "sets": 1,
                "target": 5,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-c-2-6",
                "source_line": 109,
                "source": "\u062C\u0633\u0631:10",
                "pace": null,
                "exercise_id": "bridge",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 1,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 30
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "move-c-3",
        "program": "move",
        "level": 3,
        "session": "C",
        "plannedMinutes": [
          11,
          13
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "gentle"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "move-c-3-1",
                "source_line": 104,
                "source": "\u0646\u0641\u0633\u0647:2 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "neck-tilt-seated",
                "sets": 1,
                "target": 2,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 3,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-c-3-2",
                "source_line": 105,
                "source": "\u062E\u0637\u0648\u0629 \u062C\u0627\u0646\u0628\u064A\u0629 \u0625\u0644\u0649 \u0642\u0631\u0641\u0635\u0627\u0621:5 \u0644\u0643\u0644 \u062C\u0647\u0629 \u0628\u0627\u0644\u062A\u0628\u0627\u062F\u0644",
                "pace": null,
                "exercise_id": "side-squat",
                "sets": 1,
                "target": 5,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-c-3-3",
                "source_line": 106,
                "source": "\u0636\u063A\u0637 \u062D\u0627\u0626\u0637:10",
                "pace": null,
                "exercise_id": "wall-push",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-c-3-4",
                "source_line": 107,
                "source": "\u0631\u0641\u0639 \u0631\u0643\u0628\u0629 \u0648\u0644\u0645\u0633 \u0628\u0627\u0644\u064A\u062F \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629:45\u062B",
                "pace": null,
                "exercise_id": "cross-knee",
                "sets": 1,
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 30
              },
              {
                "id": "move-c-3-5",
                "source_line": 108,
                "source": "\u062C\u0633\u0631:12",
                "pace": null,
                "exercise_id": "bridge",
                "sets": 1,
                "target": 12,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 1,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "move-c-3-6",
                "source_line": 109,
                "source": "\u0627\u0646\u0632\u0644\u0627\u0642 \u0627\u0644\u0643\u0639\u0628:6 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "heel-slide",
                "sets": 1,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 10,
                "setRest": 60,
                "after": 30
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "foundation-a-1",
        "program": "foundation",
        "level": 1,
        "session": "A",
        "plannedMinutes": [
          19,
          23
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "sit-stand",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-hinge",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "foundation-a-1-1",
                "source_line": 126,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u0644\u0627\u0645\u0633\u0629 \u0643\u0631\u0633\u064A:2\xD78",
                "pace": null,
                "exercise_id": "chair-squat",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-a-1-2",
                "source_line": 127,
                "source": "\u0636\u063A\u0637 \u062D\u0627\u0626\u0637:2\xD78",
                "pace": null,
                "exercise_id": "wall-push",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-a-1-3",
                "source_line": 128,
                "source": "\u0633\u062D\u0628 \u062F\u0645\u0628\u0644 \u0645\u0633\u0646\u0648\u062F:1\xD78 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-a-1-4",
                "source_line": 129,
                "source": "\u062C\u0633\u0631:1\xD710",
                "pace": null,
                "exercise_id": "bridge",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-a-1-5",
                "source_line": 130,
                "source": "\u0628\u0644\u0627\u0646\u0643 \u0633\u0627\u0639\u062F\u064A\u0646 \u0648\u0631\u0643\u0628\u062A\u064A\u0646:1\xD715\u062B",
                "pace": null,
                "exercise_id": "forearm-knee-plank",
                "sets": 1,
                "target": 15,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-a-1-6",
                "source_line": 131,
                "source": "\u0645\u0634\u064A \u0646\u0634\u064A\u0637:60\u062B",
                "pace": "active",
                "exercise_id": "march",
                "sets": 1,
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 15
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "foundation-a-2",
        "program": "foundation",
        "level": 2,
        "session": "A",
        "plannedMinutes": [
          23,
          28
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "sit-stand",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-hinge",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "foundation-a-2-1",
                "source_line": 126,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u062D\u0631\u0629:2\xD78",
                "pace": null,
                "exercise_id": "squat",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-a-2-2",
                "source_line": 127,
                "source": "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644:2\xD76",
                "pace": null,
                "exercise_id": "incline-push",
                "sets": 2,
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-a-2-3",
                "source_line": 128,
                "source": "\u0646\u0641\u0633\u0647:2\xD78 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-a-2-4",
                "source_line": 129,
                "source": "\u062C\u0633\u0631:2\xD710",
                "pace": null,
                "exercise_id": "bridge",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-a-2-5",
                "source_line": 130,
                "source": "\u0646\u0641\u0633\u0647:2\xD720\u062B",
                "pace": null,
                "exercise_id": "forearm-knee-plank",
                "sets": 2,
                "target": 20,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-a-2-6",
                "source_line": 131,
                "source": "\u0645\u0634\u064A \u0646\u0634\u064A\u0637 \u0628\u0630\u0631\u0627\u0639 \u0645\u0642\u0627\u0628\u0644\u0629:75\u062B",
                "pace": null,
                "exercise_id": "cross-march",
                "sets": 1,
                "target": 75,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 15
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "foundation-a-3",
        "program": "foundation",
        "level": 3,
        "session": "A",
        "plannedMinutes": [
          24,
          30
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "sit-stand",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-hinge",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "foundation-a-3-1",
                "source_line": 126,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u062D\u0631\u0629 \u062A\u0648\u0642\u06411\u062B \u0623\u0633\u0641\u0644:2\xD78",
                "pace": null,
                "exercise_id": "squat",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 1,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-a-3-2",
                "source_line": 127,
                "source": "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644:2\xD710",
                "pace": null,
                "exercise_id": "incline-push",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-a-3-3",
                "source_line": 128,
                "source": "\u0646\u0641\u0633\u0647:2\xD710 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-a-3-4",
                "source_line": 129,
                "source": "\u062C\u0633\u0631:2\xD710",
                "pace": null,
                "exercise_id": "bridge",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-a-3-5",
                "source_line": 130,
                "source": "\u0628\u0644\u0627\u0646\u0643 \u0633\u0627\u0639\u062F\u064A\u0646 \u0648\u0642\u062F\u0645\u064A\u0646:2\xD715\u062B",
                "pace": null,
                "exercise_id": "forearm-plank",
                "sets": 2,
                "target": 15,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-a-3-6",
                "source_line": 131,
                "source": "\u0646\u0641\u0633\u0647:90\u062B",
                "pace": null,
                "exercise_id": "cross-march",
                "sets": 1,
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 15
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "foundation-b-1",
        "program": "foundation",
        "level": 1,
        "session": "B",
        "plannedMinutes": [
          19,
          24
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "sit-stand",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-hinge",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "foundation-b-1-1",
                "source_line": 137,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u0644\u0627\u0645\u0633\u0629 \u0643\u0631\u0633\u064A:2\xD78",
                "pace": null,
                "exercise_id": "chair-squat",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-b-1-2",
                "source_line": 138,
                "source": "\u0636\u063A\u0637 \u062D\u0627\u0626\u0637:2\xD78",
                "pace": null,
                "exercise_id": "wall-push",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-b-1-3",
                "source_line": 139,
                "source": "\u0631\u0641\u0639 \u0643\u0639\u0628\u064A\u0646 \u0628\u0645\u0633\u0627\u0646\u062F\u0629:1\xD710",
                "pace": null,
                "exercise_id": "calf-raise",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-b-1-4",
                "source_line": 140,
                "source": "\u062C\u0633\u0631:1\xD710",
                "pace": null,
                "exercise_id": "bridge",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-b-1-5",
                "source_line": 141,
                "source": "\u0627\u0646\u0632\u0644\u0627\u0642 \u0643\u0639\u0628:1\xD75 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "heel-slide",
                "sets": 1,
                "target": 5,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-b-1-6",
                "source_line": 142,
                "source": "\u062E\u0637\u0648\u0627\u062A \u062C\u0627\u0646\u0628\u064A\u0629:60\u062B",
                "pace": null,
                "exercise_id": "side-step",
                "sets": 1,
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 15
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "foundation-b-2",
        "program": "foundation",
        "level": 2,
        "session": "B",
        "plannedMinutes": [
          23,
          29
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "sit-stand",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-hinge",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition_assumed_for_extra"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "right",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "side_switch"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "left",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "foundation-b-2-1",
                "source_line": 137,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u0646\u0642\u0633\u0645\u0629 \u0628\u0645\u0633\u0627\u0646\u062F\u0629:2\xD76 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-split",
                "sets": 2,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-b-2-2",
                "source_line": 138,
                "source": "\u0636\u063A\u0637 \u062D\u0627\u0626\u0637:2\xD710",
                "pace": null,
                "exercise_id": "wall-push",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-b-2-3",
                "source_line": 139,
                "source": "\u0646\u0641\u0633\u0647:2\xD710",
                "pace": null,
                "exercise_id": "calf-raise",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-b-2-4",
                "source_line": 140,
                "source": "\u062C\u0633\u0631:2\xD710",
                "pace": null,
                "exercise_id": "bridge",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-b-2-5",
                "source_line": 141,
                "source": "\u0644\u0645\u0633 \u0627\u0644\u0643\u0639\u0628 \u0644\u0644\u0623\u0631\u0636 \u0645\u0646 \u0631\u0643\u0628\u062A\u064A\u0646 \u0645\u0631\u0641\u0648\u0639\u062A\u064A\u0646 \u0645\u062B\u0646\u064A\u062A\u064A\u0646:1\xD75 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "heel-tap",
                "sets": 1,
                "target": 5,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-b-2-6",
                "source_line": 142,
                "source": "\u0641\u062A\u062D \u062C\u0627\u0646\u0628\u064A \u062F\u0648\u0646 \u0642\u0641\u0632 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0643\u062A\u0641\u064A\u0646:60\u062B",
                "pace": null,
                "exercise_id": "step-jack",
                "sets": 1,
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 15
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "foundation-b-3",
        "program": "foundation",
        "level": 3,
        "session": "B",
        "plannedMinutes": [
          24,
          30
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "sit-stand",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-hinge",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition_assumed_for_extra"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "right",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "side_switch"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "left",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "foundation-b-3-1",
                "source_line": 137,
                "source": "\u0646\u0641\u0633\u0647:2\xD78 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-split",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-b-3-2",
                "source_line": 138,
                "source": "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644:2\xD78",
                "pace": null,
                "exercise_id": "incline-push",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-b-3-3",
                "source_line": 139,
                "source": "\u0646\u0641\u0633\u0647:2\xD715",
                "pace": null,
                "exercise_id": "calf-raise",
                "sets": 2,
                "target": 15,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-b-3-4",
                "source_line": 140,
                "source": "\u062C\u0633\u0631 \u062A\u0648\u0642\u06412\u062B \u0623\u0639\u0644\u0649:2\xD710",
                "pace": null,
                "exercise_id": "bridge",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 2,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-b-3-5",
                "source_line": 141,
                "source": "Dead Bug:1\xD75 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "dead-bug",
                "sets": 1,
                "target": 5,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-b-3-6",
                "source_line": 142,
                "source": "\u0646\u0641\u0633\u0647:75\u062B",
                "pace": null,
                "exercise_id": "step-jack",
                "sets": 1,
                "target": 75,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 15
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "foundation-c-1",
        "program": "foundation",
        "level": 1,
        "session": "C",
        "plannedMinutes": [
          19,
          24
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "sit-stand",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-hinge",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition_assumed_for_extra"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "right",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "side_switch"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "left",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "foundation-c-1-1",
                "source_line": 148,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u0646\u0642\u0633\u0645\u0629 \u0628\u0645\u0633\u0627\u0646\u062F\u0629:1\xD76 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-split",
                "sets": 1,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-c-1-2",
                "source_line": 149,
                "source": "\u0633\u062D\u0628 \u062F\u0645\u0628\u0644 \u0645\u0633\u0646\u0648\u062F:1\xD78 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-c-1-3",
                "source_line": 150,
                "source": "\u0636\u063A\u0637 \u062D\u0627\u0626\u0637:2\xD78",
                "pace": null,
                "exercise_id": "wall-push",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-c-1-4",
                "source_line": 151,
                "source": "\u0645\u062F \u0631\u062C\u0644 \u0645\u0646 \u0648\u0636\u0639 \u0627\u0644\u064A\u062F\u064A\u0646 \u0648\u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646 \u0628\u0627\u0644\u062A\u0628\u0627\u062F\u0644:1\xD75 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "quadruped-leg",
                "sets": 1,
                "target": 5,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-c-1-5",
                "source_line": 152,
                "source": "\u0628\u0644\u0627\u0646\u0643 \u062C\u0627\u0646\u0628\u064A \u0639\u0644\u0649 \u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646:1\xD710\u062B \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "knee-side-plank",
                "sets": 1,
                "target": 10,
                "unit": "seconds",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-c-1-6",
                "source_line": 153,
                "source": "\u0645\u0634\u064A \u0646\u0634\u064A\u0637:60\u062B",
                "pace": "active",
                "exercise_id": "march",
                "sets": 1,
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 15
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "foundation-c-2",
        "program": "foundation",
        "level": 2,
        "session": "C",
        "plannedMinutes": [
          23,
          29
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "sit-stand",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-hinge",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition_assumed_for_extra"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "right",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "side_switch"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "left",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "foundation-c-2-1",
                "source_line": 148,
                "source": "\u0646\u0641\u0633\u0647:2\xD76 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-split",
                "sets": 2,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-c-2-2",
                "source_line": 149,
                "source": "\u0646\u0641\u0633\u0647:2\xD78 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-c-2-3",
                "source_line": 150,
                "source": "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644:2\xD76",
                "pace": null,
                "exercise_id": "incline-push",
                "sets": 2,
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-c-2-4",
                "source_line": 151,
                "source": "Bird Dog:1\xD75 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "bird-dog",
                "sets": 1,
                "target": 5,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-c-2-5",
                "source_line": 152,
                "source": "\u0646\u0641\u0633\u0647:1\xD715\u062B \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "knee-side-plank",
                "sets": 1,
                "target": 15,
                "unit": "seconds",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-c-2-6",
                "source_line": 153,
                "source": "\u0631\u0641\u0639 \u0631\u0643\u0628\u0629 \u0648\u0644\u0645\u0633 \u0628\u0627\u0644\u064A\u062F \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629:60\u062B",
                "pace": null,
                "exercise_id": "cross-knee",
                "sets": 1,
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 15
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "foundation-c-3",
        "program": "foundation",
        "level": 3,
        "session": "C",
        "plannedMinutes": [
          25,
          32
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "sit-stand",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-hinge",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition_assumed_for_extra"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "right",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "side_switch"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "left",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "foundation-c-3-1",
                "source_line": 148,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u0646\u0642\u0633\u0645\u0629 \u062F\u0648\u0646 \u0645\u0633\u0627\u0646\u062F\u0629:2\xD76 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "split-squat",
                "sets": 2,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-c-3-2",
                "source_line": 149,
                "source": "\u0646\u0641\u0633\u0647:2\xD710 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-c-3-3",
                "source_line": 150,
                "source": "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644:2\xD710",
                "pace": null,
                "exercise_id": "incline-push",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-c-3-4",
                "source_line": 151,
                "source": "Bird Dog \u062A\u0648\u0642\u06412\u062B:1\xD76 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "bird-dog",
                "sets": 1,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 2,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-c-3-5",
                "source_line": 152,
                "source": "\u0646\u0641\u0633\u0647:2\xD715\u062B \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "knee-side-plank",
                "sets": 2,
                "target": 15,
                "unit": "seconds",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "foundation-c-3-6",
                "source_line": 153,
                "source": "\u0646\u0641\u0633\u0647:75\u062B",
                "pace": null,
                "exercise_id": "cross-knee",
                "sets": 1,
                "target": 75,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 15
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "strength-a-1",
        "program": "strength",
        "level": 1,
        "session": "A",
        "plannedMinutes": [
          24,
          30
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "strength-a-1-1",
                "source_line": 168,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u062D\u0631\u0629:2\xD710",
                "pace": null,
                "exercise_id": "squat",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-a-1-2",
                "source_line": 169,
                "source": "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644:2\xD78",
                "pace": null,
                "exercise_id": "incline-push",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-a-1-3",
                "source_line": 170,
                "source": "\u0633\u062D\u0628 \u062F\u0645\u0628\u0644 \u0645\u0633\u0646\u0648\u062F:2\xD78 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-a-1-4",
                "source_line": 171,
                "source": "\u062C\u0633\u0631:2\xD710",
                "pace": null,
                "exercise_id": "bridge",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-a-1-5",
                "source_line": 172,
                "source": "\u0628\u0644\u0627\u0646\u0643 \u0633\u0627\u0639\u062F\u064A\u0646 \u0648\u0631\u0643\u0628\u062A\u064A\u0646:2\xD720\u062B",
                "pace": null,
                "exercise_id": "forearm-knee-plank",
                "sets": 2,
                "target": 20,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 30
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "strength-a-2",
        "program": "strength",
        "level": 2,
        "session": "A",
        "plannedMinutes": [
          28,
          35
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "strength-a-2-1",
                "source_line": 168,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u062D\u0631\u0629:3\xD78",
                "pace": null,
                "exercise_id": "squat",
                "sets": 3,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-a-2-2",
                "source_line": 169,
                "source": "\u0636\u063A\u0637 \u0623\u0631\u0636\u064A \u0643\u0627\u0645\u0644:2\xD76",
                "pace": null,
                "exercise_id": "floor-push",
                "sets": 2,
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 90,
                "after": 60
              },
              {
                "id": "strength-a-2-3",
                "source_line": 170,
                "source": "\u0646\u0641\u0633\u0647:2\xD710 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-a-2-4",
                "source_line": 171,
                "source": "\u062C\u0633\u0631 \u062A\u0648\u0642\u06412\u062B \u0623\u0639\u0644\u0649:2\xD710",
                "pace": null,
                "exercise_id": "bridge",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 2,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-a-2-5",
                "source_line": 172,
                "source": "\u0628\u0644\u0627\u0646\u0643 \u0633\u0627\u0639\u062F\u064A\u0646 \u0648\u0642\u062F\u0645\u064A\u0646:2\xD715\u062B",
                "pace": null,
                "exercise_id": "forearm-plank",
                "sets": 2,
                "target": 15,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 30
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "strength-a-3",
        "program": "strength",
        "level": 3,
        "session": "A",
        "plannedMinutes": [
          31,
          39
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "strength-a-3-1",
                "source_line": 168,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u062A\u0648\u0642\u06412\u062B \u0623\u0633\u0641\u0644:3\xD78",
                "pace": null,
                "exercise_id": "squat",
                "sets": 3,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 2,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-a-3-2",
                "source_line": 169,
                "source": "\u0636\u063A\u0637 \u0623\u0631\u0636\u064A \u0643\u0627\u0645\u0644:3\xD76",
                "pace": null,
                "exercise_id": "floor-push",
                "sets": 3,
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 90,
                "after": 60
              },
              {
                "id": "strength-a-3-3",
                "source_line": 170,
                "source": "\u0646\u0641\u0633\u0647:2\xD710 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-a-3-4",
                "source_line": 171,
                "source": "\u0646\u0641\u0633\u0647:2\xD710",
                "pace": null,
                "exercise_id": "bridge",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 2,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-a-3-5",
                "source_line": 172,
                "source": "\u0646\u0641\u0633\u0647:2\xD725\u062B",
                "pace": null,
                "exercise_id": "forearm-plank",
                "sets": 2,
                "target": 25,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 30
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "strength-b-1",
        "program": "strength",
        "level": 1,
        "session": "B",
        "plannedMinutes": [
          24,
          31
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition_assumed_for_extra"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "right",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "side_switch"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "left",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "strength-b-1-1",
                "source_line": 178,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u0646\u0642\u0633\u0645\u0629 \u0628\u0645\u0633\u0627\u0646\u062F\u0629:2\xD78 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-split",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-b-1-2",
                "source_line": 179,
                "source": "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644:2\xD78",
                "pace": null,
                "exercise_id": "incline-push",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-b-1-3",
                "source_line": 180,
                "source": "\u062C\u0633\u0631 \u0628\u0627\u0644\u0642\u062F\u0645\u064A\u0646:2\xD710",
                "pace": null,
                "exercise_id": "bridge",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-b-1-4",
                "source_line": 181,
                "source": "\u0631\u0641\u0639 \u0643\u0639\u0628\u064A\u0646 \u0628\u0645\u0633\u0627\u0646\u062F\u0629:2\xD712",
                "pace": null,
                "exercise_id": "calf-raise",
                "sets": 2,
                "target": 12,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-b-1-5",
                "source_line": 182,
                "source": "\u0628\u0644\u0627\u0646\u0643 \u062C\u0627\u0646\u0628\u064A \u0639\u0644\u0649 \u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646:1\xD715\u062B \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "knee-side-plank",
                "sets": 1,
                "target": 15,
                "unit": "seconds",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 30
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "strength-b-2",
        "program": "strength",
        "level": 2,
        "session": "B",
        "plannedMinutes": [
          29,
          37
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition_assumed_for_extra"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "right",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "side_switch"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "left",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "strength-b-2-1",
                "source_line": 178,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u0646\u0642\u0633\u0645\u0629 \u062F\u0648\u0646 \u0645\u0633\u0627\u0646\u062F\u0629:2\xD76 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "split-squat",
                "sets": 2,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-b-2-2",
                "source_line": 179,
                "source": "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644:2\xD710",
                "pace": null,
                "exercise_id": "incline-push",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-b-2-3",
                "source_line": 180,
                "source": "\u062C\u0633\u0631 \u0628\u0631\u062C\u0644 \u0648\u0627\u062D\u062F\u0629:2\xD76 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "single-bridge",
                "sets": 2,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 90,
                "after": 60
              },
              {
                "id": "strength-b-2-4",
                "source_line": 181,
                "source": "\u0646\u0641\u0633\u0647:2\xD715",
                "pace": null,
                "exercise_id": "calf-raise",
                "sets": 2,
                "target": 15,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-b-2-5",
                "source_line": 182,
                "source": "\u0646\u0641\u0633\u0647:2\xD715\u062B \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "knee-side-plank",
                "sets": 2,
                "target": 15,
                "unit": "seconds",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 30
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "strength-b-3",
        "program": "strength",
        "level": 3,
        "session": "B",
        "plannedMinutes": [
          32,
          41
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition_assumed_for_extra"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "right",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "side_switch"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "left",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "strength-b-3-1",
                "source_line": 178,
                "source": "\u0627\u0646\u062F\u0641\u0627\u0639 \u062E\u0644\u0641\u064A:2\xD76 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "reverse-lunge",
                "sets": 2,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 90,
                "after": 60
              },
              {
                "id": "strength-b-3-2",
                "source_line": 179,
                "source": "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644:2\xD710",
                "pace": null,
                "exercise_id": "incline-push",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-b-3-3",
                "source_line": 180,
                "source": "\u0646\u0641\u0633\u0647:2\xD78 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "single-bridge",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 90,
                "after": 60
              },
              {
                "id": "strength-b-3-4",
                "source_line": 181,
                "source": "\u0631\u0641\u0639 \u0643\u0639\u0628 \u0631\u062C\u0644 \u0648\u0627\u062D\u062F\u0629 \u0628\u0645\u0633\u0627\u0646\u062F\u0629:2\xD78 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "single-calf",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-b-3-5",
                "source_line": 182,
                "source": "\u0628\u0644\u0627\u0646\u0643 \u062C\u0627\u0646\u0628\u064A \u0643\u0627\u0645\u0644 \u0628\u0642\u062F\u0645\u064A\u0646 \u0645\u062A\u062F\u0631\u062C\u062A\u064A\u0646:1\xD715\u062B \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "full-side-plank",
                "sets": 1,
                "target": 15,
                "unit": "seconds",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 30
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "strength-c-1",
        "program": "strength",
        "level": 1,
        "session": "C",
        "plannedMinutes": [
          23,
          29
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "strength-c-1-1",
                "source_line": 190,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u062D\u0631\u0629:2\xD78",
                "pace": null,
                "exercise_id": "squat",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-c-1-2",
                "source_line": 191,
                "source": "\u0633\u062D\u0628 \u062F\u0645\u0628\u0644 \u0645\u0633\u0646\u0648\u062F:2\xD78 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-c-1-3",
                "source_line": 192,
                "source": "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644:2\xD78",
                "pace": null,
                "exercise_id": "incline-push",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-c-1-4",
                "source_line": 193,
                "source": "Dead Bug:1\xD75 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "dead-bug",
                "sets": 1,
                "target": 5,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-c-1-5",
                "source_line": 194,
                "source": "\u0643\u0631\u0646\u0634 \u062C\u0632\u0626\u064A:1\xD78",
                "pace": null,
                "exercise_id": "partial-crunch",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 30
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "strength-c-2",
        "program": "strength",
        "level": 2,
        "session": "C",
        "plannedMinutes": [
          28,
          35
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "strength-c-2-1",
                "source_line": 190,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u062A\u0648\u0642\u06412\u062B:2\xD78",
                "pace": null,
                "exercise_id": "squat",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 2,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-c-2-2",
                "source_line": 191,
                "source": "\u0646\u0641\u0633\u0647:2\xD710 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-c-2-3",
                "source_line": 192,
                "source": "\u0636\u063A\u0637 \u0623\u0631\u0636\u064A \u0643\u0627\u0645\u0644:2\xD76",
                "pace": null,
                "exercise_id": "floor-push",
                "sets": 2,
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 90,
                "after": 60
              },
              {
                "id": "strength-c-2-4",
                "source_line": 193,
                "source": "\u0646\u0641\u0633\u0647:2\xD75 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "dead-bug",
                "sets": 2,
                "target": 5,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-c-2-5",
                "source_line": 194,
                "source": "\u0643\u0631\u0646\u0634 \u062C\u0632\u0626\u064A:2\xD78",
                "pace": null,
                "exercise_id": "partial-crunch",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 30
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "strength-c-3",
        "program": "strength",
        "level": 3,
        "session": "C",
        "plannedMinutes": [
          31,
          39
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "sets",
            "items": [
              {
                "id": "strength-c-3-1",
                "source_line": 190,
                "source": "\u0646\u0641\u0633\u0647:3\xD78",
                "pace": null,
                "exercise_id": "squat",
                "sets": 3,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 2,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-c-3-2",
                "source_line": 191,
                "source": "\u0646\u0641\u0633\u0647:3\xD78 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 3,
                "target": 8,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-c-3-3",
                "source_line": 192,
                "source": "\u0646\u0641\u0633\u0647:2\xD78",
                "pace": null,
                "exercise_id": "floor-push",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 90,
                "after": 60
              },
              {
                "id": "strength-c-3-4",
                "source_line": 193,
                "source": "\u0646\u0641\u0633\u0647:2\xD76 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "dead-bug",
                "sets": 2,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "strength-c-3-5",
                "source_line": 194,
                "source": "\u0643\u0631\u0646\u0634 \u0639\u0643\u0633\u064A:1\xD78",
                "pace": null,
                "exercise_id": "reverse-crunch",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 30
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 60,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "slow"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "hybrid-a-1",
        "program": "hybrid",
        "level": 1,
        "session": "A",
        "plannedMinutes": [
          25,
          31
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "strength",
            "kind": "sets",
            "items": [
              {
                "id": "hybrid-a-1-\u0642\u0648\u06291",
                "source_line": 213,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u062D\u0631\u0629:2\xD78",
                "pace": null,
                "exercise_id": "squat",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "hybrid-a-1-\u0642\u0648\u06292",
                "source_line": 214,
                "source": "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644:2\xD78",
                "pace": null,
                "exercise_id": "incline-push",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "hybrid-a-1-\u0642\u0648\u06293",
                "source_line": 215,
                "source": "\u0633\u062D\u0628 \u062F\u0645\u0628\u0644 \u0645\u0633\u0646\u0648\u062F:2\xD78 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "hybrid-a-1-\u0642\u0648\u06294",
                "source_line": 216,
                "source": "\u0628\u0644\u0627\u0646\u0643 \u0633\u0627\u0639\u062F\u064A\u0646 \u0648\u0631\u0643\u0628\u062A\u064A\u0646:2\xD720\u062B",
                "pace": null,
                "exercise_id": "forearm-knee-plank",
                "sets": 2,
                "target": 20,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              }
            ]
          },
          {
            "id": "aerobic",
            "kind": "repeat",
            "rounds": 2,
            "between": 45,
            "finalRest": 0,
            "items": [
              {
                "id": "hybrid-a-1-\u0647\u0648\u0627\u0626\u064A1",
                "source_line": 217,
                "source": "\u0645\u0634\u064A \u0646\u0634\u064A\u0637:30\u062B",
                "pace": "active",
                "exercise_id": "march",
                "sets": 1,
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "hybrid-a-1-\u0647\u0648\u0627\u0626\u064A2",
                "source_line": 218,
                "source": "\u062E\u0637\u0648\u0627\u062A \u062C\u0627\u0646\u0628\u064A\u0629 \u0645\u0639 \u0636\u0645 \u0627\u0644\u0642\u062F\u0645:30\u062B",
                "pace": null,
                "exercise_id": "side-step",
                "sets": 1,
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "hybrid-a-1-\u0647\u0648\u0627\u0626\u064A3",
                "source_line": 219,
                "source": "\u0644\u0645\u0633 \u0627\u0644\u0643\u0639\u0628 \u0644\u0644\u0623\u0645\u0627\u0645:30\u062B",
                "pace": null,
                "exercise_id": "heel-touch",
                "sets": 1,
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "decelerating"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "hybrid-a-2",
        "program": "hybrid",
        "level": 2,
        "session": "A",
        "plannedMinutes": [
          28,
          35
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "strength",
            "kind": "sets",
            "items": [
              {
                "id": "hybrid-a-2-\u0642\u0648\u06291",
                "source_line": 213,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u062D\u0631\u0629:2\xD710",
                "pace": null,
                "exercise_id": "squat",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "hybrid-a-2-\u0642\u0648\u06292",
                "source_line": 214,
                "source": "\u0636\u063A\u0637 \u0623\u0631\u0636\u064A \u0643\u0627\u0645\u0644:2\xD76",
                "pace": null,
                "exercise_id": "floor-push",
                "sets": 2,
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 90,
                "after": 60
              },
              {
                "id": "hybrid-a-2-\u0642\u0648\u06293",
                "source_line": 215,
                "source": "\u0646\u0641\u0633\u0647:2\xD710 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "hybrid-a-2-\u0642\u0648\u06294",
                "source_line": 216,
                "source": "\u0628\u0644\u0627\u0646\u0643 \u0633\u0627\u0639\u062F\u064A\u0646 \u0648\u0642\u062F\u0645\u064A\u0646:2\xD715\u062B",
                "pace": null,
                "exercise_id": "forearm-plank",
                "sets": 2,
                "target": 15,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              }
            ]
          },
          {
            "id": "aerobic",
            "kind": "repeat",
            "rounds": 2,
            "between": 45,
            "finalRest": 0,
            "items": [
              {
                "id": "hybrid-a-2-\u0647\u0648\u0627\u0626\u064A1",
                "source_line": 217,
                "source": "\u0645\u0634\u064A \u0646\u0634\u064A\u0637 \u0628\u0630\u0631\u0627\u0639 \u0645\u0642\u0627\u0628\u0644\u0629:40\u062B",
                "pace": null,
                "exercise_id": "cross-march",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "hybrid-a-2-\u0647\u0648\u0627\u0626\u064A2",
                "source_line": 218,
                "source": "\u062E\u0637\u0648\u062A\u0627\u0646 \u062C\u0627\u0646\u0628\u064A\u062A\u0627\u0646 \u062B\u0645 \u0627\u0644\u0639\u0648\u062F\u0629:40\u062B",
                "pace": null,
                "exercise_id": "lateral-double",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "hybrid-a-2-\u0647\u0648\u0627\u0626\u064A3",
                "source_line": 219,
                "source": "\u0641\u062A\u062D \u062C\u0627\u0646\u0628\u064A \u062F\u0648\u0646 \u0642\u0641\u0632 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0643\u062A\u0641\u064A\u0646:40\u062B",
                "pace": null,
                "exercise_id": "step-jack",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "decelerating"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "hybrid-a-3",
        "program": "hybrid",
        "level": 3,
        "session": "A",
        "plannedMinutes": [
          29,
          36
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "strength",
            "kind": "sets",
            "items": [
              {
                "id": "hybrid-a-3-\u0642\u0648\u06291",
                "source_line": 213,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u062A\u0648\u0642\u06412\u062B:2\xD78",
                "pace": null,
                "exercise_id": "squat",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 2,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "hybrid-a-3-\u0642\u0648\u06292",
                "source_line": 214,
                "source": "\u0646\u0641\u0633\u0647:2\xD78",
                "pace": null,
                "exercise_id": "floor-push",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 90,
                "after": 60
              },
              {
                "id": "hybrid-a-3-\u0642\u0648\u06293",
                "source_line": 215,
                "source": "\u0646\u0641\u0633\u0647:2\xD710 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "hybrid-a-3-\u0642\u0648\u06294",
                "source_line": 216,
                "source": "\u0646\u0641\u0633\u0647:2\xD725\u062B",
                "pace": null,
                "exercise_id": "forearm-plank",
                "sets": 2,
                "target": 25,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              }
            ]
          },
          {
            "id": "aerobic",
            "kind": "repeat",
            "rounds": 2,
            "between": 45,
            "finalRest": 0,
            "items": [
              {
                "id": "hybrid-a-3-\u0647\u0648\u0627\u0626\u064A1",
                "source_line": 217,
                "source": "\u0631\u0641\u0639 \u0631\u0643\u0628\u0629 \u0648\u0644\u0645\u0633 \u0628\u0627\u0644\u064A\u062F \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629:40\u062B",
                "pace": null,
                "exercise_id": "cross-knee",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "hybrid-a-3-\u0647\u0648\u0627\u0626\u064A2",
                "source_line": 218,
                "source": "\u0646\u0641\u0633 \u0627\u0644\u062E\u0637\u0648\u062A\u064A\u0646 \u0645\u0639 \u062A\u062D\u0631\u064A\u0643 \u0627\u0644\u0630\u0631\u0627\u0639\u064A\u0646:40\u062B",
                "pace": null,
                "exercise_id": "lateral-double-arms",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "hybrid-a-3-\u0647\u0648\u0627\u0626\u064A3",
                "source_line": 219,
                "source": "\u0646\u0641\u0633\u0647:40\u062B",
                "pace": null,
                "exercise_id": "step-jack",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "decelerating"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "hybrid-b-1",
        "program": "hybrid",
        "level": 1,
        "session": "B",
        "plannedMinutes": [
          25,
          32
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition_assumed_for_extra"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "right",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "side_switch"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "left",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "strength",
            "kind": "sets",
            "items": [
              {
                "id": "hybrid-b-1-\u0642\u0648\u06291",
                "source_line": 225,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u0646\u0642\u0633\u0645\u0629 \u0628\u0645\u0633\u0627\u0646\u062F\u0629:2\xD76 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-split",
                "sets": 2,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "hybrid-b-1-\u0642\u0648\u06292",
                "source_line": 226,
                "source": "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644:2\xD78",
                "pace": null,
                "exercise_id": "incline-push",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "hybrid-b-1-\u0642\u0648\u06293",
                "source_line": 227,
                "source": "\u062C\u0633\u0631:2\xD710",
                "pace": null,
                "exercise_id": "bridge",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "hybrid-b-1-\u0642\u0648\u06294",
                "source_line": 228,
                "source": "\u0627\u0646\u0632\u0644\u0627\u0642 \u0643\u0639\u0628:1\xD76 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "heel-slide",
                "sets": 1,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              }
            ]
          },
          {
            "id": "aerobic",
            "kind": "repeat",
            "rounds": 2,
            "between": 45,
            "finalRest": 0,
            "items": [
              {
                "id": "hybrid-b-1-\u0647\u0648\u0627\u0626\u064A1",
                "source_line": 229,
                "source": "\u0645\u0634\u064A \u0646\u0634\u064A\u0637:30\u062B",
                "pace": "active",
                "exercise_id": "march",
                "sets": 1,
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "hybrid-b-1-\u0647\u0648\u0627\u0626\u064A2",
                "source_line": 230,
                "source": "\u0644\u0645\u0633 \u0627\u0644\u0643\u0639\u0628 \u0644\u0644\u0623\u0645\u0627\u0645:30\u062B",
                "pace": null,
                "exercise_id": "heel-touch",
                "sets": 1,
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "hybrid-b-1-\u0647\u0648\u0627\u0626\u064A3",
                "source_line": 231,
                "source": "\u062B\u0646\u064A \u0631\u0643\u0628\u0629 \u0648\u0631\u0641\u0639 \u0643\u0639\u0628 \u0644\u0644\u062E\u0644\u0641 \u0628\u0627\u0644\u062A\u0628\u0627\u062F\u0644 \u062F\u0648\u0646 \u0642\u0641\u0632:30\u062B",
                "pace": null,
                "exercise_id": "hamstring-curl",
                "sets": 1,
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "decelerating"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "hybrid-b-2",
        "program": "hybrid",
        "level": 2,
        "session": "B",
        "plannedMinutes": [
          28,
          35
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition_assumed_for_extra"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "right",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "side_switch"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "left",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "strength",
            "kind": "sets",
            "items": [
              {
                "id": "hybrid-b-2-\u0642\u0648\u06291",
                "source_line": 225,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u0646\u0642\u0633\u0645\u0629 \u062F\u0648\u0646 \u0645\u0633\u0627\u0646\u062F\u0629:2\xD76 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "split-squat",
                "sets": 2,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "hybrid-b-2-\u0642\u0648\u06292",
                "source_line": 226,
                "source": "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644:2\xD710",
                "pace": null,
                "exercise_id": "incline-push",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "hybrid-b-2-\u0642\u0648\u06293",
                "source_line": 227,
                "source": "\u062C\u0633\u0631 \u062A\u0648\u0642\u06412\u062B:2\xD710",
                "pace": null,
                "exercise_id": "bridge",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 2,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "hybrid-b-2-\u0642\u0648\u06294",
                "source_line": 228,
                "source": "Dead Bug:1\xD75 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "dead-bug",
                "sets": 1,
                "target": 5,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              }
            ]
          },
          {
            "id": "aerobic",
            "kind": "repeat",
            "rounds": 2,
            "between": 45,
            "finalRest": 0,
            "items": [
              {
                "id": "hybrid-b-2-\u0647\u0648\u0627\u0626\u064A1",
                "source_line": 229,
                "source": "\u0645\u0634\u064A \u0646\u0634\u064A\u0637 \u0628\u0630\u0631\u0627\u0639 \u0645\u0642\u0627\u0628\u0644\u0629:40\u062B",
                "pace": null,
                "exercise_id": "cross-march",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "hybrid-b-2-\u0647\u0648\u0627\u0626\u064A2",
                "source_line": 230,
                "source": "\u0646\u0641\u0633\u0647 \u0645\u0639 \u0645\u062F \u0627\u0644\u0630\u0631\u0627\u0639 \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u0623\u0645\u0627\u0645:40\u062B",
                "pace": null,
                "exercise_id": "heel-touch-arm",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "hybrid-b-2-\u0647\u0648\u0627\u0626\u064A3",
                "source_line": 231,
                "source": "\u0646\u0641\u0633\u0647:40\u062B",
                "pace": null,
                "exercise_id": "hamstring-curl",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "decelerating"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "hybrid-b-3",
        "program": "hybrid",
        "level": 3,
        "session": "B",
        "plannedMinutes": [
          31,
          39
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition_assumed_for_extra"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "right",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "side_switch"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "left",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "strength",
            "kind": "sets",
            "items": [
              {
                "id": "hybrid-b-3-\u0642\u0648\u06291",
                "source_line": 225,
                "source": "\u0646\u0641\u0633\u0647:2\xD78 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "split-squat",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "hybrid-b-3-\u0642\u0648\u06292",
                "source_line": 226,
                "source": "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644:2\xD710",
                "pace": null,
                "exercise_id": "incline-push",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "hybrid-b-3-\u0642\u0648\u06293",
                "source_line": 227,
                "source": "\u062C\u0633\u0631 \u0631\u062C\u0644 \u0648\u0627\u062D\u062F\u0629:2\xD76 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "single-bridge",
                "sets": 2,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 90,
                "after": 60
              },
              {
                "id": "hybrid-b-3-\u0642\u0648\u06294",
                "source_line": 228,
                "source": "\u0646\u0641\u0633\u0647:2\xD75 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "dead-bug",
                "sets": 2,
                "target": 5,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              }
            ]
          },
          {
            "id": "aerobic",
            "kind": "repeat",
            "rounds": 2,
            "between": 45,
            "finalRest": 0,
            "items": [
              {
                "id": "hybrid-b-3-\u0647\u0648\u0627\u0626\u064A1",
                "source_line": 229,
                "source": "\u062E\u0637\u0648\u062A\u0627\u0646 \u0644\u0644\u0623\u0645\u0627\u0645 \u062B\u0645 \u062E\u0637\u0648\u062A\u0627\u0646 \u0644\u0644\u062E\u0644\u0641:40\u062B",
                "pace": null,
                "exercise_id": "forward-back",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "hybrid-b-3-\u0647\u0648\u0627\u0626\u064A2",
                "source_line": 230,
                "source": "\u0646\u0641\u0633\u0647 \u0627\u0644\u0645\u0646\u0633\u0642:40\u062B",
                "pace": null,
                "exercise_id": "heel-touch-arm",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "hybrid-b-3-\u0647\u0648\u0627\u0626\u064A3",
                "source_line": 231,
                "source": "\u0646\u0641\u0633\u0647 \u0645\u0639 \u062A\u062D\u0631\u064A\u0643 \u0627\u0644\u0630\u0631\u0627\u0639\u064A\u0646:40\u062B",
                "pace": null,
                "exercise_id": "hamstring-curl-arms",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "decelerating"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "hybrid-c-1",
        "program": "hybrid",
        "level": 1,
        "session": "C",
        "plannedMinutes": [
          27,
          34
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition_assumed_for_extra"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "right",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "side_switch"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "left",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "strength",
            "kind": "sets",
            "items": [
              {
                "id": "hybrid-c-1-\u0642\u0648\u06291",
                "source_line": 237,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u0646\u0642\u0633\u0645\u0629 \u0628\u0645\u0633\u0627\u0646\u062F\u0629:2\xD76 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-split",
                "sets": 2,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "hybrid-c-1-\u0642\u0648\u06292",
                "source_line": 238,
                "source": "\u0633\u062D\u0628 \u062F\u0645\u0628\u0644 \u0645\u0633\u0646\u0648\u062F:2\xD78 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "hybrid-c-1-\u0642\u0648\u06293",
                "source_line": 239,
                "source": "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644:2\xD78",
                "pace": null,
                "exercise_id": "incline-push",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "hybrid-c-1-\u0642\u0648\u06294",
                "source_line": 240,
                "source": "\u0628\u0644\u0627\u0646\u0643 \u062C\u0627\u0646\u0628\u064A \u0639\u0644\u0649 \u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646:1\xD715\u062B \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "knee-side-plank",
                "sets": 1,
                "target": 15,
                "unit": "seconds",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              }
            ]
          },
          {
            "id": "aerobic",
            "kind": "repeat",
            "rounds": 2,
            "between": 45,
            "finalRest": 0,
            "items": [
              {
                "id": "hybrid-c-1-\u0647\u0648\u0627\u0626\u064A1",
                "source_line": 241,
                "source": "\u062E\u0637\u0648\u0627\u062A \u062C\u0627\u0646\u0628\u064A\u0629:30\u062B",
                "pace": null,
                "exercise_id": "side-step",
                "sets": 1,
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "hybrid-c-1-\u0647\u0648\u0627\u0626\u064A2",
                "source_line": 242,
                "source": "\u0645\u0634\u064A \u0646\u0634\u064A\u0637:30\u062B",
                "pace": "active",
                "exercise_id": "march",
                "sets": 1,
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "hybrid-c-1-\u0647\u0648\u0627\u0626\u064A3",
                "source_line": 243,
                "source": "\u0644\u0645\u0633 \u0627\u0644\u0643\u0639\u0628 \u0644\u0644\u0623\u0645\u0627\u0645:30\u062B",
                "pace": null,
                "exercise_id": "heel-touch",
                "sets": 1,
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "decelerating"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "hybrid-c-2",
        "program": "hybrid",
        "level": 2,
        "session": "C",
        "plannedMinutes": [
          30,
          38
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition_assumed_for_extra"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "right",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "side_switch"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "left",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "strength",
            "kind": "sets",
            "items": [
              {
                "id": "hybrid-c-2-\u0642\u0648\u06291",
                "source_line": 237,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u0646\u0642\u0633\u0645\u0629 \u062F\u0648\u0646 \u0645\u0633\u0627\u0646\u062F\u0629:2\xD76 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "split-squat",
                "sets": 2,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "hybrid-c-2-\u0642\u0648\u06292",
                "source_line": 238,
                "source": "\u0646\u0641\u0633\u0647:2\xD710 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "hybrid-c-2-\u0642\u0648\u06293",
                "source_line": 239,
                "source": "\u0636\u063A\u0637 \u0623\u0631\u0636\u064A \u0643\u0627\u0645\u0644:2\xD76",
                "pace": null,
                "exercise_id": "floor-push",
                "sets": 2,
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 90,
                "after": 60
              },
              {
                "id": "hybrid-c-2-\u0642\u0648\u06294",
                "source_line": 240,
                "source": "\u0646\u0641\u0633\u0647:2\xD715\u062B \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "knee-side-plank",
                "sets": 2,
                "target": 15,
                "unit": "seconds",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              }
            ]
          },
          {
            "id": "aerobic",
            "kind": "repeat",
            "rounds": 2,
            "between": 45,
            "finalRest": 0,
            "items": [
              {
                "id": "hybrid-c-2-\u0647\u0648\u0627\u0626\u064A1",
                "source_line": 241,
                "source": "\u062E\u0637\u0648\u062A\u0627\u0646 \u062C\u0627\u0646\u0628\u064A\u062A\u0627\u0646 \u062B\u0645 \u0627\u0644\u0639\u0648\u062F\u0629:40\u062B",
                "pace": null,
                "exercise_id": "lateral-double",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "hybrid-c-2-\u0647\u0648\u0627\u0626\u064A2",
                "source_line": 242,
                "source": "\u0631\u0641\u0639 \u0631\u0643\u0628\u0629 \u0648\u0644\u0645\u0633 \u0628\u0627\u0644\u064A\u062F \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629:40\u062B",
                "pace": null,
                "exercise_id": "cross-knee",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "hybrid-c-2-\u0647\u0648\u0627\u0626\u064A3",
                "source_line": 243,
                "source": "\u0641\u062A\u062D \u062C\u0627\u0646\u0628\u064A \u062F\u0648\u0646 \u0642\u0641\u0632 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0643\u062A\u0641\u064A\u0646:40\u062B",
                "pace": null,
                "exercise_id": "step-jack",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "decelerating"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "hybrid-c-3",
        "program": "hybrid",
        "level": 3,
        "session": "C",
        "plannedMinutes": [
          31,
          39
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition_assumed_for_extra"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "right",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "side_switch"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "left",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "strength",
            "kind": "sets",
            "items": [
              {
                "id": "hybrid-c-3-\u0642\u0648\u06291",
                "source_line": 237,
                "source": "\u0627\u0646\u062F\u0641\u0627\u0639 \u062E\u0644\u0641\u064A:2\xD76 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "reverse-lunge",
                "sets": 2,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 90,
                "after": 60
              },
              {
                "id": "hybrid-c-3-\u0642\u0648\u06292",
                "source_line": 238,
                "source": "\u0646\u0641\u0633\u0647:2\xD710 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 2,
                "target": 10,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "hybrid-c-3-\u0642\u0648\u06293",
                "source_line": 239,
                "source": "\u0646\u0641\u0633\u0647:2\xD78",
                "pace": null,
                "exercise_id": "floor-push",
                "sets": 2,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 90,
                "after": 60
              },
              {
                "id": "hybrid-c-3-\u0642\u0648\u06294",
                "source_line": 240,
                "source": "\u0628\u0644\u0627\u0646\u0643 \u062C\u0627\u0646\u0628\u064A \u0643\u0627\u0645\u0644 \u0628\u0642\u062F\u0645\u064A\u0646 \u0645\u062A\u062F\u0631\u062C\u062A\u064A\u0646:1\xD715\u062B \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "full-side-plank",
                "sets": 1,
                "target": 15,
                "unit": "seconds",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              }
            ]
          },
          {
            "id": "aerobic",
            "kind": "repeat",
            "rounds": 2,
            "between": 45,
            "finalRest": 0,
            "items": [
              {
                "id": "hybrid-c-3-\u0647\u0648\u0627\u0626\u064A1",
                "source_line": 241,
                "source": "\u0646\u0641\u0633\u0647 \u0645\u0639 \u062A\u062D\u0631\u064A\u0643 \u0627\u0644\u0630\u0631\u0627\u0639\u064A\u0646:40\u062B",
                "pace": null,
                "exercise_id": "lateral-double-arms",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "hybrid-c-3-\u0647\u0648\u0627\u0626\u064A2",
                "source_line": 242,
                "source": "\u0646\u0641\u0633\u0647:40\u062B",
                "pace": null,
                "exercise_id": "cross-knee",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              },
              {
                "id": "hybrid-c-3-\u0647\u0648\u0627\u0626\u064A3",
                "source_line": 243,
                "source": "\u0646\u0641\u0633\u0647:40\u062B",
                "pace": null,
                "exercise_id": "step-jack",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "aerobic",
                "sideRest": 20,
                "setRest": 60,
                "after": 20
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "decelerating"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "circuit-a-1",
        "program": "circuit",
        "level": 1,
        "session": "A",
        "plannedMinutes": [
          28,
          34
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "repeat",
            "rounds": 2,
            "between": 90,
            "finalRest": 0,
            "items": [
              {
                "id": "circuit-a-1-1",
                "source_line": 264,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u0644\u0627\u0645\u0633\u0629 \u0643\u0631\u0633\u064A:8",
                "pace": null,
                "exercise_id": "chair-squat",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-a-1-2",
                "source_line": 265,
                "source": "\u0633\u062D\u0628 \u062F\u0645\u0628\u0644 \u0645\u0633\u0646\u0648\u062F:8 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-a-1-3",
                "source_line": 266,
                "source": "\u0645\u0634\u064A \u0646\u0634\u064A\u0637:30\u062B",
                "pace": "active",
                "exercise_id": "march",
                "sets": 1,
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-a-1-4",
                "source_line": 267,
                "source": "\u0636\u063A\u0637 \u062D\u0627\u0626\u0637:8",
                "pace": null,
                "exercise_id": "wall-push",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-a-1-5",
                "source_line": 268,
                "source": "\u062C\u0633\u0631:10",
                "pace": null,
                "exercise_id": "bridge",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-a-1-6",
                "source_line": 269,
                "source": "\u0628\u0644\u0627\u0646\u0643 \u0633\u0627\u0639\u062F\u064A\u0646 \u0648\u0631\u0643\u0628\u062A\u064A\u0646:15\u062B",
                "pace": null,
                "exercise_id": "forearm-knee-plank",
                "sets": 1,
                "target": 15,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-a-1-7",
                "source_line": 270,
                "source": "\u062E\u0637\u0648\u0627\u062A \u062C\u0627\u0646\u0628\u064A\u0629:30\u062B",
                "pace": null,
                "exercise_id": "side-step",
                "sets": 1,
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "decelerating"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "circuit-a-2",
        "program": "circuit",
        "level": 2,
        "session": "A",
        "plannedMinutes": [
          30,
          36
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "repeat",
            "rounds": 2,
            "between": 90,
            "finalRest": 0,
            "items": [
              {
                "id": "circuit-a-2-1",
                "source_line": 264,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u062D\u0631\u0629:8",
                "pace": null,
                "exercise_id": "squat",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-a-2-2",
                "source_line": 265,
                "source": "\u0646\u0641\u0633\u0647:10 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-a-2-3",
                "source_line": 266,
                "source": "\u0645\u0634\u064A \u0646\u0634\u064A\u0637 \u0628\u0630\u0631\u0627\u0639 \u0645\u0642\u0627\u0628\u0644\u0629:40\u062B",
                "pace": null,
                "exercise_id": "cross-march",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-a-2-4",
                "source_line": 267,
                "source": "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644:8",
                "pace": null,
                "exercise_id": "incline-push",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-a-2-5",
                "source_line": 268,
                "source": "\u062C\u0633\u0631:12",
                "pace": null,
                "exercise_id": "bridge",
                "sets": 1,
                "target": 12,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-a-2-6",
                "source_line": 269,
                "source": "\u0646\u0641\u0633\u0647:20\u062B",
                "pace": null,
                "exercise_id": "forearm-knee-plank",
                "sets": 1,
                "target": 20,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-a-2-7",
                "source_line": 270,
                "source": "\u0641\u062A\u062D \u062C\u0627\u0646\u0628\u064A \u062F\u0648\u0646 \u0642\u0641\u0632 \u0648\u0627\u0644\u0630\u0631\u0627\u0639\u0627\u0646 \u0644\u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0643\u062A\u0641\u064A\u0646:40\u062B",
                "pace": null,
                "exercise_id": "step-jack",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "decelerating"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "circuit-a-3",
        "program": "circuit",
        "level": 3,
        "session": "A",
        "plannedMinutes": [
          32,
          39
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "repeat",
            "rounds": 2,
            "between": 90,
            "finalRest": 0,
            "items": [
              {
                "id": "circuit-a-3-1",
                "source_line": 264,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u062A\u0648\u0642\u06412\u062B:8",
                "pace": null,
                "exercise_id": "squat",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 2,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-a-3-2",
                "source_line": 265,
                "source": "\u0646\u0641\u0633\u0647:10 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-a-3-3",
                "source_line": 266,
                "source": "\u0631\u0641\u0639 \u0631\u0643\u0628\u0629 \u0648\u0644\u0645\u0633 \u0628\u0627\u0644\u064A\u062F \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629:40\u062B",
                "pace": null,
                "exercise_id": "cross-knee",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-a-3-4",
                "source_line": 267,
                "source": "\u0636\u063A\u0637 \u0623\u0631\u0636\u064A \u0643\u0627\u0645\u0644:6",
                "pace": null,
                "exercise_id": "floor-push",
                "sets": 1,
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 90
              },
              {
                "id": "circuit-a-3-5",
                "source_line": 268,
                "source": "\u062C\u0633\u0631 \u062A\u0648\u0642\u06412\u062B:10",
                "pace": null,
                "exercise_id": "bridge",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 2,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-a-3-6",
                "source_line": 269,
                "source": "\u0628\u0644\u0627\u0646\u0643 \u0633\u0627\u0639\u062F\u064A\u0646 \u0648\u0642\u062F\u0645\u064A\u0646:15\u062B",
                "pace": null,
                "exercise_id": "forearm-plank",
                "sets": 1,
                "target": 15,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-a-3-7",
                "source_line": 270,
                "source": "\u0646\u0641\u0633\u0647:40\u062B",
                "pace": null,
                "exercise_id": "step-jack",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "decelerating"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "circuit-b-1",
        "program": "circuit",
        "level": 1,
        "session": "B",
        "plannedMinutes": [
          29,
          35
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition_assumed_for_extra"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "right",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "side_switch"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "left",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "repeat",
            "rounds": 2,
            "between": 90,
            "finalRest": 0,
            "items": [
              {
                "id": "circuit-b-1-1",
                "source_line": 276,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u0646\u0642\u0633\u0645\u0629 \u0628\u0645\u0633\u0627\u0646\u062F\u0629:6 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-split",
                "sets": 1,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-b-1-2",
                "source_line": 277,
                "source": "\u0636\u063A\u0637 \u062D\u0627\u0626\u0637:8",
                "pace": null,
                "exercise_id": "wall-push",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-b-1-3",
                "source_line": 278,
                "source": "\u0645\u0634\u064A \u0646\u0634\u064A\u0637:30\u062B",
                "pace": "active",
                "exercise_id": "march",
                "sets": 1,
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-b-1-4",
                "source_line": 279,
                "source": "\u0631\u0641\u0639 \u0643\u0639\u0628\u064A\u0646 \u0628\u0645\u0633\u0627\u0646\u062F\u0629:10",
                "pace": null,
                "exercise_id": "calf-raise",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-b-1-5",
                "source_line": 280,
                "source": "\u062C\u0633\u0631:10",
                "pace": null,
                "exercise_id": "bridge",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-b-1-6",
                "source_line": 281,
                "source": "\u0645\u062F \u0631\u062C\u0644 \u0644\u0644\u062E\u0644\u0641 \u0645\u0646 \u0627\u0644\u064A\u062F\u064A\u0646 \u0648\u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646 \u0628\u0627\u0644\u062A\u0628\u0627\u062F\u0644:4 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "quadruped-leg",
                "sets": 1,
                "target": 4,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-b-1-7",
                "source_line": 282,
                "source": "\u0644\u0645\u0633 \u0627\u0644\u0643\u0639\u0628 \u0644\u0644\u0623\u0645\u0627\u0645:30\u062B",
                "pace": null,
                "exercise_id": "heel-touch",
                "sets": 1,
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "decelerating"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "circuit-b-2",
        "program": "circuit",
        "level": 2,
        "session": "B",
        "plannedMinutes": [
          31,
          38
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition_assumed_for_extra"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "right",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "side_switch"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "left",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "repeat",
            "rounds": 2,
            "between": 90,
            "finalRest": 0,
            "items": [
              {
                "id": "circuit-b-2-1",
                "source_line": 276,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u0645\u0646\u0642\u0633\u0645\u0629 \u062F\u0648\u0646 \u0645\u0633\u0627\u0646\u062F\u0629:6 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "split-squat",
                "sets": 1,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-b-2-2",
                "source_line": 277,
                "source": "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644:6",
                "pace": null,
                "exercise_id": "incline-push",
                "sets": 1,
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-b-2-3",
                "source_line": 278,
                "source": "\u0645\u0634\u064A \u0646\u0634\u064A\u0637 \u0628\u0630\u0631\u0627\u0639 \u0645\u0642\u0627\u0628\u0644\u0629:40\u062B",
                "pace": null,
                "exercise_id": "cross-march",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-b-2-4",
                "source_line": 279,
                "source": "\u0646\u0641\u0633\u0647:15",
                "pace": null,
                "exercise_id": "calf-raise",
                "sets": 1,
                "target": 15,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-b-2-5",
                "source_line": 280,
                "source": "\u062C\u0633\u0631 \u062A\u0648\u0642\u06412\u062B:10",
                "pace": null,
                "exercise_id": "bridge",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 2,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-b-2-6",
                "source_line": 281,
                "source": "Bird Dog:4 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "bird-dog",
                "sets": 1,
                "target": 4,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-b-2-7",
                "source_line": 282,
                "source": "\u0646\u0641\u0633\u0647 \u0645\u0639 \u0645\u062F \u0627\u0644\u0630\u0631\u0627\u0639 \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629:40\u062B",
                "pace": null,
                "exercise_id": "heel-touch-arm",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "decelerating"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "circuit-b-3",
        "program": "circuit",
        "level": 3,
        "session": "B",
        "plannedMinutes": [
          35,
          43
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition_assumed_for_extra"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "right",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 20,
                "reason": "side_switch"
              },
              {
                "type": "work",
                "exercise_id": "supported-split",
                "target": 3,
                "unit": "reps",
                "sides": 1,
                "side_mode": "sequential",
                "sets": 1,
                "pause_seconds": 0,
                "side": "left",
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "repeat",
            "rounds": 2,
            "between": 90,
            "finalRest": 0,
            "items": [
              {
                "id": "circuit-b-3-1",
                "source_line": 276,
                "source": "\u0627\u0646\u062F\u0641\u0627\u0639 \u062E\u0644\u0641\u064A:6 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "reverse-lunge",
                "sets": 1,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 90
              },
              {
                "id": "circuit-b-3-2",
                "source_line": 277,
                "source": "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644:8",
                "pace": null,
                "exercise_id": "incline-push",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-b-3-3",
                "source_line": 278,
                "source": "\u062E\u0637\u0648\u062A\u0627\u0646 \u0644\u0644\u0623\u0645\u0627\u0645 \u062B\u0645 \u062E\u0637\u0648\u062A\u0627\u0646 \u0644\u0644\u062E\u0644\u0641:40\u062B",
                "pace": null,
                "exercise_id": "forward-back",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-b-3-4",
                "source_line": 279,
                "source": "\u0646\u0641\u0633\u0647:15",
                "pace": null,
                "exercise_id": "calf-raise",
                "sets": 1,
                "target": 15,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-b-3-5",
                "source_line": 280,
                "source": "\u062C\u0633\u0631 \u0631\u062C\u0644 \u0648\u0627\u062D\u062F\u0629:6 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "single-bridge",
                "sets": 1,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 90
              },
              {
                "id": "circuit-b-3-6",
                "source_line": 281,
                "source": "Bird Dog \u062A\u0648\u0642\u06412\u062B:5 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "bird-dog",
                "sets": 1,
                "target": 5,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 2,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-b-3-7",
                "source_line": 282,
                "source": "\u0646\u0641\u0633\u0647 \u0627\u0644\u0645\u0646\u0633\u0642:40\u062B",
                "pace": null,
                "exercise_id": "heel-touch-arm",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "decelerating"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "circuit-c-1",
        "program": "circuit",
        "level": 1,
        "session": "C",
        "plannedMinutes": [
          29,
          35
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "repeat",
            "rounds": 2,
            "between": 90,
            "finalRest": 0,
            "items": [
              {
                "id": "circuit-c-1-1",
                "source_line": 288,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u062D\u0631\u0629:8",
                "pace": null,
                "exercise_id": "squat",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-c-1-2",
                "source_line": 289,
                "source": "\u0633\u062D\u0628 \u062F\u0645\u0628\u0644 \u0645\u0633\u0646\u0648\u062F:8 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-c-1-3",
                "source_line": 290,
                "source": "\u062E\u0637\u0648\u0627\u062A \u062C\u0627\u0646\u0628\u064A\u0629:30\u062B",
                "pace": null,
                "exercise_id": "side-step",
                "sets": 1,
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-c-1-4",
                "source_line": 291,
                "source": "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644:6",
                "pace": null,
                "exercise_id": "incline-push",
                "sets": 1,
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-c-1-5",
                "source_line": 292,
                "source": "\u0627\u0646\u0632\u0644\u0627\u0642 \u0643\u0639\u0628:5 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "heel-slide",
                "sets": 1,
                "target": 5,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-c-1-6",
                "source_line": 293,
                "source": "\u0628\u0644\u0627\u0646\u0643 \u062C\u0627\u0646\u0628\u064A \u0639\u0644\u0649 \u0627\u0644\u0631\u0643\u0628\u062A\u064A\u0646:10\u062B \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "knee-side-plank",
                "sets": 1,
                "target": 10,
                "unit": "seconds",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-c-1-7",
                "source_line": 294,
                "source": "\u0645\u0634\u064A \u0646\u0634\u064A\u0637:30\u062B",
                "pace": "active",
                "exercise_id": "march",
                "sets": 1,
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "decelerating"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "circuit-c-2",
        "program": "circuit",
        "level": 2,
        "session": "C",
        "plannedMinutes": [
          31,
          38
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "repeat",
            "rounds": 2,
            "between": 90,
            "finalRest": 0,
            "items": [
              {
                "id": "circuit-c-2-1",
                "source_line": 288,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u062D\u0631\u0629:10",
                "pace": null,
                "exercise_id": "squat",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-c-2-2",
                "source_line": 289,
                "source": "\u0646\u0641\u0633\u0647:10 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-c-2-3",
                "source_line": 290,
                "source": "\u062E\u0637\u0648\u062A\u0627\u0646 \u062C\u0627\u0646\u0628\u064A\u062A\u0627\u0646 \u062B\u0645 \u0627\u0644\u0639\u0648\u062F\u0629:40\u062B",
                "pace": null,
                "exercise_id": "lateral-double",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-c-2-4",
                "source_line": 291,
                "source": "\u0636\u063A\u0637 \u0645\u0627\u0626\u0644:8",
                "pace": null,
                "exercise_id": "incline-push",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-c-2-5",
                "source_line": 292,
                "source": "Dead Bug:5 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "dead-bug",
                "sets": 1,
                "target": 5,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-c-2-6",
                "source_line": 293,
                "source": "\u0646\u0641\u0633\u0647:15\u062B \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "knee-side-plank",
                "sets": 1,
                "target": 15,
                "unit": "seconds",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-c-2-7",
                "source_line": 294,
                "source": "\u0631\u0641\u0639 \u0631\u0643\u0628\u0629 \u0648\u0644\u0645\u0633 \u0628\u0627\u0644\u064A\u062F \u0627\u0644\u0645\u0642\u0627\u0628\u0644\u0629:40\u062B",
                "pace": null,
                "exercise_id": "cross-knee",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "decelerating"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      },
      {
        "id": "circuit-c-3",
        "program": "circuit",
        "level": 3,
        "session": "C",
        "plannedMinutes": [
          33,
          40
        ],
        "blocks": [
          {
            "id": "warmup",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup",
                "pace": "progressive"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "side-step",
                "target": 45,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "shoulder-roll",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-slide",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "wall-push",
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "warmup_transition"
              },
              {
                "type": "work",
                "exercise_id": "chair-squat",
                "target": 5,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "warmup"
              },
              {
                "type": "rest",
                "seconds": 30,
                "reason": "main_setup"
              }
            ]
          },
          {
            "id": "main",
            "kind": "repeat",
            "rounds": 2,
            "between": 90,
            "finalRest": 0,
            "items": [
              {
                "id": "circuit-c-3-1",
                "source_line": 288,
                "source": "\u0642\u0631\u0641\u0635\u0627\u0621 \u062A\u0648\u0642\u06412\u062B:8",
                "pace": null,
                "exercise_id": "squat",
                "sets": 1,
                "target": 8,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 2,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-c-3-2",
                "source_line": 289,
                "source": "\u0646\u0641\u0633\u0647:10 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "supported-row",
                "sets": 1,
                "target": 10,
                "unit": "reps",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-c-3-3",
                "source_line": 290,
                "source": "\u0646\u0641\u0633\u0647 \u0645\u0639 \u062A\u062D\u0631\u064A\u0643 \u0627\u0644\u0630\u0631\u0627\u0639\u064A\u0646:40\u062B",
                "pace": null,
                "exercise_id": "lateral-double-arms",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-c-3-4",
                "source_line": 291,
                "source": "\u0636\u063A\u0637 \u0623\u0631\u0636\u064A \u0643\u0627\u0645\u0644:6",
                "pace": null,
                "exercise_id": "floor-push",
                "sets": 1,
                "target": 6,
                "unit": "reps",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 90
              },
              {
                "id": "circuit-c-3-5",
                "source_line": 292,
                "source": "\u0646\u0641\u0633\u0647:6 \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "dead-bug",
                "sets": 1,
                "target": 6,
                "unit": "reps",
                "sides": 2,
                "side_mode": "alternating",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-c-3-6",
                "source_line": 293,
                "source": "\u0628\u0644\u0627\u0646\u0643 \u062C\u0627\u0646\u0628\u064A \u0643\u0627\u0645\u0644 \u0628\u0642\u062F\u0645\u064A\u0646 \u0645\u062A\u062F\u0631\u062C\u062A\u064A\u0646:10\u062B \u0644\u0643\u0644 \u062C\u0647\u0629",
                "pace": null,
                "exercise_id": "full-side-plank",
                "sets": 1,
                "target": 10,
                "unit": "seconds",
                "sides": 2,
                "side_mode": "sequential",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              },
              {
                "id": "circuit-c-3-7",
                "source_line": 294,
                "source": "\u0646\u0641\u0633\u0647:40\u062B",
                "pace": null,
                "exercise_id": "cross-knee",
                "sets": 1,
                "target": 40,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "pause_seconds": 0,
                "block": "main",
                "sideRest": 20,
                "setRest": 60,
                "after": 60
              }
            ]
          },
          {
            "id": "cooldown",
            "kind": "literal",
            "items": [
              {
                "type": "work",
                "exercise_id": "march",
                "target": 90,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown",
                "pace": "decelerating"
              },
              {
                "type": "rest",
                "seconds": 15,
                "reason": "sit_down"
              },
              {
                "type": "work",
                "exercise_id": "seated-breath",
                "target": 30,
                "unit": "seconds",
                "sides": 1,
                "side_mode": "bilateral",
                "sets": 1,
                "pause_seconds": 0,
                "side": null,
                "phase": "cooldown"
              }
            ]
          }
        ]
      }
    ]
  };

  // js/presentation/library.mjs
  var $ = (s) => document.querySelector(s);
  var libraryQuery = "";
  var normalizeSearch = (text) => text.normalize("NFKD").replace(/[\u064B-\u065F\u0670ـ]/g, "").replace(/[أإآ]/g, "\u0627").replace(/ى/g, "\u064A").toLowerCase();
  var libraryName = (e) => e.id === "march" ? "\u0645\u0634\u064A \u0628\u0627\u0644\u0645\u0643\u0627\u0646" : e.name_ar;
  var libraryGroups = [
    ["walk", "\u0627\u0644\u0645\u0634\u064A \u0648\u0627\u0644\u062D\u0631\u0643\u0629 \u0627\u0644\u0647\u0648\u0627\u0626\u064A\u0629", "march cross-march side-step side-squat heel-touch step-jack cross-knee lateral-double lateral-double-arms heel-touch-arm hamstring-curl hamstring-curl-arms forward-back"],
    ["mobility", "\u0627\u0644\u0645\u0631\u0648\u0646\u0629 \u0648\u0627\u0644\u062A\u0647\u062F\u0626\u0629", "shoulder-roll neck-turn-seated wall-slide thoracic-rotation-seated cat-cow neck-tilt-seated chest-open seated-breath"],
    ["legs", "\u062A\u0642\u0648\u064A\u0629 \u0627\u0644\u0633\u0627\u0642\u064A\u0646 \u0648\u0627\u0644\u0648\u0631\u0643", "sit-stand chair-squat squat bridge wall-hinge supported-side-leg-raise calf-raise supported-split split-squat reverse-lunge single-bridge single-calf"],
    ["upper", "\u0627\u0644\u062F\u0641\u0639 \u0648\u0627\u0644\u0633\u062D\u0628", "wall-push supported-row incline-push floor-push"],
    ["core", "\u0627\u0644\u062A\u062D\u0643\u0645 \u0628\u0627\u0644\u062C\u0630\u0639 \u0648\u0627\u0644\u0628\u0637\u0646", "heel-slide bird-dog heel-tap dead-bug quadruped-leg partial-crunch reverse-crunch"],
    ["plank", "\u062A\u0645\u0627\u0631\u064A\u0646 \u0627\u0644\u0628\u0644\u0627\u0646\u0643", "forearm-knee-plank forearm-plank knee-side-plank full-side-plank"],
    ["balance", "\u0627\u0644\u062A\u0648\u0627\u0632\u0646", "supported-tandem supported-single-balance"]
  ].map(([id, name, ids]) => ({ id, name, ids: ids.split(" ") }));
  function library() {
    return `<section class="v-library"><div class="page-head"><h1>\u0645\u0643\u062A\u0628\u0629 \u0627\u0644\u062A\u0645\u0627\u0631\u064A\u0646</h1><span class="pill">${content.exercises.length} \u062D\u0631\u0643\u0629</span></div><p class="library-intro">\u0627\u062E\u062A\u0631 \u0641\u0626\u0629\u060C \u062B\u0645 \u0627\u0641\u062A\u062D \u0627\u0644\u062A\u0645\u0631\u064A\u0646 \u0644\u0642\u0631\u0627\u0621\u0629 \u0643\u064A\u0641\u064A\u0629 \u0627\u0644\u0623\u062F\u0627\u0621.</p><label class="v-search-label" for="search">\u0627\u0644\u0628\u062D\u062B \u0639\u0646 \u062A\u0645\u0631\u064A\u0646</label><input class="v-search" id="search" type="search" value="${esc(libraryQuery)}" placeholder="\u0627\u0633\u0645 \u0627\u0644\u062A\u0645\u0631\u064A\u0646 \u0623\u0648 \u0627\u0644\u0623\u062F\u0627\u0629 \u0623\u0648 \u0627\u0644\u0641\u0626\u0629"><p id="library-count" class="small muted" role="status"></p><div id="library-list">${libraryRows()}</div></section>`;
  }
  function filteredExercises() {
    const q = normalizeSearch(libraryQuery.trim());
    return content.exercises.filter((e) => normalizeSearch(e.name_ar + " " + e.id + " " + e.equipment + " " + libraryGroups.find((g) => g.ids.includes(e.id))?.name).includes(q)).sort((a, b) => libraryName(a).localeCompare(libraryName(b), "ar"));
  }
  function libraryCard(e) {
    return `<button class="exercise-card" data-action="instruction" data-id="${e.id}"><span class="v-library-icon" aria-hidden="true"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H4zM13 7a3 3 0 0 1 3-3h4v14h-3a4 4 0 0 0-4 3"/></svg></span><span class="exercise-caption"><strong dir="auto">${esc(libraryName(e))}</strong>${e.id === "march" ? '<span class="v-library-note">\u0647\u0627\u062F\u0626 \xB7 \u0645\u062A\u062F\u0631\u062C \xB7 \u0646\u0634\u064A\u0637 \xB7 \u0628\u0637\u064A\u0621</span>' : ""}<small>${e.equipment === "\u0644\u0627 \u0634\u064A\u0621" ? "\u062F\u0648\u0646 \u0623\u062F\u0648\u0627\u062A" : esc(e.equipment)}</small></span><span class="v-library-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="m14 6-6 6 6 6"/></svg></span></button>`;
  }
  function libraryRows() {
    const rows = filteredExercises();
    return libraryGroups.map((g) => {
      const items = rows.filter((e) => g.ids.includes(e.id));
      return items.length ? `<details class="v-library-group" ${libraryQuery.trim() ? "open" : ""}><summary><span>${g.name}</span><span class="v-group-count">${items.length}</span><svg class="v-group-chevron" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary><div class="library-grid">${items.map(libraryCard).join("")}</div></details>` : "";
    }).join("") || '<p class="v-library-empty">\u0644\u0627 \u062A\u0648\u062C\u062F \u0646\u062A\u0627\u0626\u062C. \u062C\u0631\u0651\u0628 \u0627\u0633\u0645\u064B\u0627 \u0622\u062E\u0631 \u0623\u0648 \u0627\u0633\u0645 \u0627\u0644\u0641\u0626\u0629.</p>';
  }
  function updateLibrary() {
    if (!$("#library-list")) return;
    $("#library-list").innerHTML = libraryRows();
    $("#library-count").textContent = `${filteredExercises().length} \u0645\u0646 ${content.exercises.length} \u062D\u0631\u0643\u0629 \xB7 \u062D\u0633\u0628 \u0646\u0648\u0639 \u0627\u0644\u062D\u0631\u0643\u0629`;
  }
  function searchLibrary(value) {
    libraryQuery = value;
    updateLibrary();
  }

  // js/domain/engine.mjs
  var copy = (x) => structuredClone(x);
  var positive = (n) => Number.isInteger(n) && n > 0;
  function compileWorkout(content2, id) {
    const w = content2.workouts.find((w2) => w2.id === id);
    if (!w) throw Error("Unknown workout");
    const exercises = Object.fromEntries(content2.exercises.map((e) => [e.id, e]));
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
    return copy({ contentVersion: content2.contentVersion, workout: w, exercises: Object.fromEntries([...new Set(steps.filter((s) => s.type === "work").map((s) => s.exerciseId))].map((id2) => [id2, exercises[id2]])), steps: steps.map((s, i) => ({ ...s, id: `${id}:${i}` })) });
  }
  function createSession(snapshot, { id, dateKey, scheduledDate = dateKey, now = Date.now() } = {}) {
    if (!id || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) throw Error("Session identity required");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(scheduledDate)) throw Error("Scheduled date required");
    return { id, dateKey, scheduledDate, schemaVersion: 1, revision: 0, status: "active", startedAt: now, snapshot: copy(snapshot), cursor: 0, results: [], timer: null };
  }
  function remaining(s, now = Date.now()) {
    return s.timer ? Math.max(0, s.timer.remainingMs - (s.timer.running ? Math.max(0, now - s.timer.startedAt) : 0)) : null;
  }
  function reduceSession(session, command2, now = Date.now()) {
    const s = copy(session), step = s.snapshot.steps[s.cursor];
    if (s.status !== "active" || command2.stepId && command2.stepId !== step.id) return s;
    const timed = step.type === "rest" || step.unit === "seconds";
    if (command2.type === "startTimer") {
      if (!timed || s.timer?.running) return s;
      s.timer = { totalMs: s.timer?.totalMs ?? (step.seconds ?? step.target) * 1e3, remainingMs: s.timer?.remainingMs ?? (step.seconds ?? step.target) * 1e3, running: true, startedAt: now };
    } else if (command2.type === "pause") {
      if (!s.timer?.running) return s;
      s.timer = { ...s.timer, remainingMs: remaining(s, now), running: false, startedAt: null };
    } else if (command2.type === "extendRest" || command2.type === "extendTimer") {
      if (!timed || command2.type === "extendRest" && step.type !== "rest" || !positive(command2.seconds) || command2.seconds > 3600) throw Error("Invalid rest extension");
      s.timer = { totalMs: (s.timer?.totalMs ?? (step.seconds ?? step.target) * 1e3) + command2.seconds * 1e3, remainingMs: (remaining(s, now) ?? (step.seconds ?? step.target) * 1e3) + command2.seconds * 1e3, running: s.timer?.running ?? false, startedAt: s.timer?.running ? now : null };
    } else if (["done", "skip", "elapsed"].includes(command2.type)) {
      if (!command2.stepId) throw Error("stepId required");
      if (command2.type === "elapsed" && (!s.timer || remaining(s, now) > 0)) return s;
      if (command2.type === "done" && step.type === "rest") throw Error("Rest uses elapsed or skip");
      s.results.push({ stepId: step.id, outcome: command2.type === "skip" ? "skipped" : "done", at: now });
      s.cursor++;
      s.timer = null;
      if (s.cursor === s.snapshot.steps.length) {
        s.status = "completed";
        s.finishedAt = now;
      }
    } else if (command2.type === "stop") {
      s.status = "stopped";
      s.finishedAt = now;
      if (s.timer) s.timer = { ...s.timer, remainingMs: remaining(s, now), running: false, startedAt: null };
    } else throw Error("Unknown command");
    s.revision++;
    return s;
  }

  // js/application/backup.mjs
  var date = (x) => typeof x === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x) && !Number.isNaN(Date.parse(x + "T12:00:00Z")) && (/* @__PURE__ */ new Date(x + "T12:00:00Z")).toISOString().slice(0, 10) === x;
  var integer = (x, min = 0) => Number.isSafeInteger(x) && x >= min;
  var canonical = (x) => JSON.stringify(x, (_, v) => v && typeof v === "object" && !Array.isArray(v) ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, v[k]])) : v);
  var check = (ok) => {
    if (!ok) throw Error("\u0645\u0644\u0641 \u0627\u0644\u0646\u0633\u062E\u0629 \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D \u0623\u0648 \u0645\u0646 \u0625\u0635\u062F\u0627\u0631 \u063A\u064A\u0631 \u0645\u062A\u0648\u0627\u0641\u0642. \u0644\u0645 \u062A\u062A\u063A\u064A\u0631 \u0628\u064A\u0627\u0646\u0627\u062A\u0643.");
  };
  function validateBackup(input, content2, now = Date.now()) {
    check(input?.format === "haraka-v2" && input.version === 1 && input.contentVersion === content2.contentVersion);
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
      check(r.snapshot?.contentVersion === content2.contentVersion && content2.workouts.some((w) => w.id === r.snapshot.workout?.id));
      check(canonical(r.snapshot) === canonical(compileWorkout(content2, r.snapshot.workout.id)));
      check(r.cursor <= r.snapshot.steps.length && r.results.every((x, i) => x.stepId === r.snapshot.steps[i].id && ["done", "skipped"].includes(x.outcome) && integer(x.at)));
      check(r === data.active ? r.status === "active" && r.cursor < r.snapshot.steps.length : ["completed", "stopped"].includes(r.status) && integer(r.finishedAt));
      check(r.status !== "completed" || r.cursor === r.snapshot.steps.length);
      check(r.hidden === void 0 || typeof r.hidden === "boolean");
      if (r.timer) {
        const step = r.snapshot.steps[r.cursor];
        check(step && (step.type === "rest" || step.unit === "seconds") && Number.isFinite(r.timer.remainingMs) && r.timer.remainingMs >= 0 && typeof r.timer.running === "boolean" && (!r.timer.running || integer(r.timer.startedAt)));
        check(r.timer.totalMs === void 0 || Number.isFinite(r.timer.totalMs) && r.timer.totalMs > 0 && r.timer.totalMs >= r.timer.remainingMs);
        r.timer = { totalMs: r.timer.totalMs ?? Math.max((step.seconds ?? step.target) * 1e3, r.timer.remainingMs), remainingMs: remaining(r, now), running: false, startedAt: null };
      }
    }
    check(!data.active || !data.history.some((r) => r.dateKey === data.active.dateKey || r.completedDate === data.active.dateKey));
    return data;
  }
  async function makeBackup(repo2, content2) {
    return { format: "haraka-v2", version: 1, contentVersion: content2.contentVersion, exportedAt: (/* @__PURE__ */ new Date()).toISOString(), data: await repo2.exportData() };
  }

  // js/infrastructure/reminder-config.mjs
  var REMINDER_API = globalThis.HarakaConfig?.reminderApi || "";

  // js/infrastructure/reminder-guard.mjs
  function writeReminderGuard(value) {
    return new Promise((resolve, reject) => {
      const request2 = indexedDB.open("haraka-reminder-guard", 1);
      request2.onupgradeneeded = () => request2.result.createObjectStore("settings");
      request2.onerror = () => reject(request2.error);
      request2.onsuccess = () => {
        const db = request2.result;
        const tx = db.transaction("settings", "readwrite");
        tx.objectStore("settings").put(value, "current");
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error);
        };
        tx.onabort = () => {
          db.close();
          reject(tx.error);
        };
      };
    });
  }

  // js/infrastructure/reminders.mjs
  var adapter;
  function configureReminders(value) {
    adapter = value;
  }
  var $2 = (s) => document.querySelector(s);
  var showDialog = (h) => adapter.show(h);
  var modalHead = (t) => adapter.modalHead(t);
  var closeDialog = () => adapter.close();
  var toast = (t) => adapter.toast(t);
  function preferences(device = readDevice()) {
    const { settings: settings2, history: history2 } = adapter.state(), day = todayKey(), plan = planFor(settings2, day);
    const occurrence = (d, s) => `${d}:${s}`;
    return {
      source: "v2",
      occurrenceMode: "date",
      enabled: Boolean(device.enabled) && Notification.permission === "granted",
      time: device.time || "18:00",
      timezone: "Asia/Damascus",
      entries: plan?.schedule || settings2.revisions.at(-1).schedule,
      scheduleRevisions: settings2.revisions.map((r) => ({ effectiveFrom: r.effectiveFrom, entries: r.schedule })).slice(-50),
      doneKeys: [...new Set([...history2].sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate)).map((r) => occurrence(r.scheduledDate || r.dateKey, r.snapshot.workout.session)))].slice(-100),
      skipDates: [...new Set(history2.flatMap((r) => [r.dateKey, r.completedDate].filter(Boolean)))].sort().slice(-10)
    };
  }
  var DEVICE_KEY = "haraka-reminders-v1";
  var status = "";
  var busy = false;
  var syncing = false;
  var queued = false;
  var timer = null;
  var lastSent = "";
  var configured = () => /^https:\/\//.test(REMINDER_API);
  var supported = () => typeof Notification !== "undefined" && "serviceWorker" in navigator && typeof PushManager !== "undefined" && typeof indexedDB !== "undefined" && location.protocol !== "file:" && window.isSecureContext;
  function readDevice() {
    try {
      const value = JSON.parse(localStorage.getItem(DEVICE_KEY));
      return value && typeof value === "object" ? value : { enabled: false, time: "18:00" };
    } catch {
      return { enabled: false, time: "18:00" };
    }
  }
  function writeDevice(device) {
    localStorage.setItem(DEVICE_KEY, JSON.stringify(device));
  }
  async function api(path, token, data, method = "POST") {
    const response = await fetch(`${REMINDER_API.replace(/\/$/, "")}/v1/${path}`, { method, headers: { ...data ? { "Content-Type": "application/json" } : {}, ...token ? { Authorization: `Bearer ${token}` } : {} }, body: data ? JSON.stringify(data) : void 0, signal: AbortSignal.timeout(12e3) });
    if (!response.ok) {
      if (response.status === 401) throw Error("\u0631\u0645\u0632 \u0627\u0644\u062A\u0641\u0639\u064A\u0644 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D \u0623\u0648 \u0627\u0646\u062A\u0647\u0649 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062C\u0647\u0627\u0632. \u0623\u0639\u062F \u0627\u0644\u062A\u0641\u0639\u064A\u0644.");
      if (response.status === 429) throw Error("\u0627\u0646\u062A\u0638\u0631 \u062F\u0642\u064A\u0642\u0629 \u0642\u0628\u0644 \u0625\u0639\u0627\u062F\u0629 \u062A\u062C\u0631\u0628\u0629 \u0627\u0644\u0625\u0634\u0639\u0627\u0631.");
      throw Error("\u062A\u0639\u0630\u0651\u0631 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u062E\u062F\u0645\u0629 \u0627\u0644\u062A\u0630\u0643\u064A\u0631. \u062C\u0631\u0651\u0628 \u0645\u062C\u062F\u062F\u064B\u0627 \u0628\u0639\u062F \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0627\u062A\u0635\u0627\u0644.");
    }
    return response.json();
  }
  function setStatus(message) {
    status = message;
    refreshReminders();
  }
  var initialized = false;
  var pendingReminderAction = "";
  var reminderLoadingLabels = {
    "reminder-save": "\u062C\u0627\u0631\u064D \u062D\u0641\u0638 \u0627\u0644\u0645\u0648\u0639\u062F\u2026",
    "reminder-test": "\u062C\u0627\u0631\u064D \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062A\u062C\u0631\u0628\u0629\u2026",
    "reminder-disable": "\u062C\u0627\u0631\u064D \u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u062A\u0630\u0643\u064A\u0631\u2026"
  };
  function refreshReminderControls() {
    const device = readDevice();
    const pending = Boolean(pendingReminderAction);
    const labels = {
      "reminder-save": "\u062D\u0641\u0638 \u0627\u0644\u0645\u0648\u0639\u062F",
      "reminder-test": "\u062A\u062C\u0631\u0628\u0629 \u0627\u0644\u0625\u0634\u0639\u0627\u0631",
      "reminder-enable": device.enabled ? "\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u062A\u0641\u0639\u064A\u0644" : "\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062A\u0630\u0643\u064A\u0631",
      "reminder-disable": "\u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u062A\u0630\u0643\u064A\u0631"
    };
    const available = {
      "reminder-save": configured() && Boolean(device.id),
      "reminder-test": configured() && Boolean(device.id) && Boolean(device.enabled) && typeof Notification !== "undefined" && Notification.permission === "granted",
      "reminder-enable": configured(),
      "reminder-disable": Boolean(device.id) && Boolean(device.enabled)
    };
    document.querySelectorAll(".reminder-settings button[data-action]").forEach((button2) => {
      const action = button2.dataset.action;
      if (!(action in labels)) return;
      const loading = action === pendingReminderAction;
      button2.disabled = pending || !available[action];
      button2.classList.toggle("is-loading", loading);
      button2.setAttribute("aria-busy", String(loading));
      button2.textContent = loading ? reminderLoadingLabels[action] : labels[action];
    });
    const timeInput = $2("#reminder-time");
    if (timeInput) timeInput.disabled = pending || !configured();
  }
  async function runReminderAction(action) {
    const tasks = {
      "reminder-save": saveReminderTime,
      "reminder-test": testReminder,
      "reminder-disable": disableReminder
    };
    const task = tasks[action];
    if (!task || pendingReminderAction || busy) return;
    pendingReminderAction = action;
    setStatus(reminderLoadingLabels[action]);
    try {
      await task();
    } catch (error) {
      setStatus(error?.message || "\u062A\u0639\u0630\u0651\u0631 \u062A\u0646\u0641\u064A\u0630 \u0627\u0644\u0639\u0645\u0644\u064A\u0629. \u062D\u0627\u0648\u0644 \u0645\u062C\u062F\u062F\u064B\u0627.");
    } finally {
      pendingReminderAction = "";
      refreshReminders();
    }
  }
  function reminderSection() {
    const device = readDevice();
    return `<div class="setting-block reminder-settings"><h3>\u062A\u0630\u0643\u064A\u0631 \u0627\u0644\u062C\u0644\u0633\u0629</h3>
    <label class="reminder-time-label" for="reminder-time">\u0627\u0644\u0633\u0627\u0639\u0629 \u0641\u064A \u0623\u064A\u0627\u0645 \u0627\u0644\u062A\u062F\u0631\u064A\u0628</label>
    <input id="reminder-time" type="time" value="${/^([01]\d|2[0-3]):[0-5]\d$/.test(device.time) ? device.time : "18:00"}" ${configured() ? "" : "disabled"}>
    <p>\u062D\u0633\u0628 \u062A\u0648\u0642\u064A\u062A \u062F\u0645\u0634\u0642\u060C \u0628\u0623\u064A\u0627\u0645 \u0627\u0644\u062A\u062F\u0631\u064A\u0628 \u0641\u0642\u0637. \u0644\u0627 \u064A\u064F\u0631\u0633\u0644 \u062A\u0630\u0643\u064A\u0631 \u0625\u0636\u0627\u0641\u064A \u0644\u0644\u062A\u0639\u0648\u064A\u0636.</p>
    <div class="reminder-actions">
      <button type="button" class="primary" data-action="reminder-save" ${device.id && configured() ? "" : "disabled"} ${device.id ? "" : "hidden"}>\u062D\u0641\u0638 \u0627\u0644\u0645\u0648\u0639\u062F</button>
      <button type="button" class="secondary" data-action="reminder-test" ${device.enabled && configured() ? "" : "disabled"} ${device.id ? "" : "hidden"}>\u062A\u062C\u0631\u0628\u0629 \u0627\u0644\u0625\u0634\u0639\u0627\u0631</button>
      <div class="reminder-management">
        <button type="button" class="${device.id ? "text-btn" : "primary"}" data-action="reminder-enable" ${configured() ? "" : "disabled"}>${device.enabled ? "\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u062A\u0641\u0639\u064A\u0644" : "\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062A\u0630\u0643\u064A\u0631"}</button>
        <button type="button" class="text-btn" data-action="reminder-disable" ${device.enabled ? "" : "disabled"} ${device.id ? "" : "hidden"}>\u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u062A\u0630\u0643\u064A\u0631</button>
      </div>
    </div>
    <p id="reminder-status" role="status" aria-live="polite" aria-atomic="true"></p>
  </div>`;
  }
  function refreshReminders() {
    refreshReminderControls();
    const node = $2("#reminder-status");
    if (configured() && typeof Notification !== "undefined" && Notification.permission === "denied") {
      if (node) node.textContent = "\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0627\u0644\u0645\u0648\u0642\u0639 \u0645\u062D\u0638\u0648\u0631\u0629. \u063A\u064A\u0651\u0631 \u0627\u0644\u0625\u0630\u0646 \u0645\u0646 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u062A\u0635\u0641\u062D \u0644\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u062A\u0641\u0639\u064A\u0644.";
      return;
    }
    if (node) node.textContent = !configured() ? "\u0627\u0644\u062A\u0630\u0643\u064A\u0631\u0627\u062A \u062A\u062D\u062A\u0627\u062C \u0625\u0643\u0645\u0627\u0644 \u0625\u0639\u062F\u0627\u062F \u062E\u062F\u0645\u0629 \u0627\u0644\u0625\u0631\u0633\u0627\u0644. \u0628\u0642\u064A\u0629 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u064A\u0639\u0645\u0644 \u0643\u0627\u0644\u0645\u0639\u062A\u0627\u062F." : (location.protocol === "file:" ? "\u0627\u0644\u062A\u0630\u0643\u064A\u0631\u0627\u062A \u062A\u0639\u0645\u0644 \u0639\u0628\u0631 \u0631\u0627\u0628\u0637 \u0627\u0644\u0645\u0648\u0642\u0639 \u0627\u0644\u0645\u0646\u0634\u0648\u0631\u060C \u0648\u0644\u064A\u0633\u062A \u0645\u062A\u0627\u062D\u0629 \u0641\u064A \u0645\u0644\u0641 \u0627\u0644\u0645\u0639\u0627\u064A\u0646\u0629." : status) || (readDevice().enabled ? "\u0627\u0644\u062A\u0630\u0643\u064A\u0631 \u0645\u0641\u0639\u0651\u0644 \u0639\u0644\u0649 \u0647\u0630\u0627 \u0627\u0644\u062C\u0647\u0627\u0632\u061B \u064A\u062D\u062A\u0627\u062C \u0627\u062A\u0635\u0627\u0644\u064B\u0627 \u0628\u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A." : "\u0627\u0644\u062A\u0630\u0643\u064A\u0631 \u063A\u064A\u0631 \u0645\u0641\u0639\u0651\u0644.");
  }
  function activationDialog() {
    if (!configured()) {
      setStatus("\u0623\u0643\u0645\u0644 \u0625\u0639\u062F\u0627\u062F \u0627\u0644\u062E\u062F\u0645\u0629 \u0623\u0648\u0644\u064B\u0627.");
      return;
    }
    if (!supported()) {
      setStatus("\u0627\u0641\u062A\u062D \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0639\u0628\u0631 HTTPS \u0641\u064A \u0645\u062A\u0635\u0641\u062D \u064A\u062F\u0639\u0645 \u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0627\u0644\u0648\u064A\u0628.");
      return;
    }
    const time = $2("#reminder-time")?.value || readDevice().time;
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time || "")) {
      setStatus("\u0627\u062E\u062A\u0631 \u0633\u0627\u0639\u0629 \u0635\u062D\u064A\u062D\u0629 \u0644\u0644\u062A\u0630\u0643\u064A\u0631.");
      return;
    }
    showDialog(`${modalHead("\u062A\u0641\u0639\u064A\u0644 \u062A\u0630\u0643\u064A\u0631 \u0627\u0644\u062C\u0644\u0633\u0629")}
    <p>\u0633\u064A\u0637\u0644\u0628 \u0627\u0644\u0645\u062A\u0635\u0641\u062D \u0625\u0630\u0646 \u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A. \u0623\u062F\u062E\u0644 \u0631\u0645\u0632 \u0627\u0644\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062E\u0627\u0635 \u0628\u0643 \u0645\u0631\u0629 \u0648\u0627\u062D\u062F\u0629 \u0644\u0647\u0630\u0627 \u0627\u0644\u062C\u0647\u0627\u0632.</p>
    <div class="form-field"><label for="reminder-code">\u0631\u0645\u0632 \u0627\u0644\u062A\u0641\u0639\u064A\u0644</label><input id="reminder-code" type="password" autocomplete="off"></div>
    <input id="reminder-chosen-time" type="hidden" value="${time}">
    <button class="primary full" data-action="reminder-confirm">\u0627\u0644\u0633\u0645\u0627\u062D \u0648\u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062A\u0630\u0643\u064A\u0631</button>
    <p id="activation-status" role="status"></p>`);
  }
  function base64Bytes(value) {
    return Uint8Array.from(atob(value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - value.length % 4) % 4)), (c) => c.charCodeAt(0));
  }
  function deviceToken() {
    return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }
  async function activateReminder() {
    if (busy) return;
    const code = $2("#reminder-code")?.value.trim(), time = $2("#reminder-chosen-time")?.value;
    if (!code) {
      $2("#activation-status").textContent = "\u0623\u062F\u062E\u0644 \u0631\u0645\u0632 \u0627\u0644\u062A\u0641\u0639\u064A\u0644.";
      return;
    }
    busy = true;
    let registered = null;
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw Error("\u0644\u0645 \u064A\u064F\u0645\u0646\u062D \u0625\u0630\u0646 \u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A. \u064A\u0645\u0643\u0646\u0643 \u062A\u063A\u064A\u064A\u0631\u0647 \u0645\u0646 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u0648\u0642\u0639 \u0641\u064A \u0627\u0644\u0645\u062A\u0635\u0641\u062D.");
      $2("#activation-status").textContent = "\u062C\u0627\u0631\u064D \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062A\u0630\u0643\u064A\u0631\u2026";
      const config = await api("config", null, null, "GET");
      const registration = await navigator.serviceWorker.register("./sw.js", { scope: "./", updateViaCache: "none" });
      await Promise.race([navigator.serviceWorker.ready, new Promise((_, reject) => setTimeout(() => reject(Error("\u0623\u063A\u0644\u0642 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0648\u0627\u0641\u062A\u062D\u0647 \u0644\u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u062B\u0645 \u0623\u0639\u062F \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629.")), 15e3))]);
      if (registration.installing) {
        const installing = registration.installing;
        await Promise.race([
          new Promise((resolve) => installing.addEventListener("statechange", () => {
            if (["installed", "activated", "redundant"].includes(installing.state)) resolve();
          })),
          new Promise((_, reject) => setTimeout(() => reject(Error("\u0623\u063A\u0644\u0642 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0648\u0627\u0641\u062A\u062D\u0647 \u0628\u0639\u062F \u0627\u0643\u062A\u0645\u0627\u0644 \u0627\u0644\u062A\u062D\u062F\u064A\u062B.")), 15e3))
        ]);
      }
      if (registration.waiting) throw Error("\u0627\u0644\u062A\u062D\u062F\u064A\u062B \u062C\u0627\u0647\u0632. \u0623\u063A\u0644\u0642 \u062C\u0645\u064A\u0639 \u0646\u0648\u0627\u0641\u0630 \u062D\u0631\u0643\u0629 \u0648\u0627\u0641\u062A\u062D\u0647 \u0645\u0646 \u062C\u062F\u064A\u062F \u062B\u0645 \u0641\u0639\u0651\u0644 \u0627\u0644\u062A\u0630\u0643\u064A\u0631.");
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: base64Bytes(config.publicKey) });
      const device = { enabled: true, time, token: deviceToken() };
      const prefs = preferences(device);
      await writeReminderGuard({ ...prefs, enabled: false });
      const result = await api("register", code, { deviceToken: device.token, subscription: subscription.toJSON(), preferences: prefs });
      device.id = result.id;
      registered = device;
      writeDevice(device);
      await writeReminderGuard(prefs);
      lastSent = JSON.stringify(prefs);
      registered = null;
      closeDialog();
      toast("\u062A\u0645 \u062A\u0641\u0639\u064A\u0644 \u0627\u0644\u062A\u0630\u0643\u064A\u0631. \u064A\u0645\u0643\u0646\u0643 \u062A\u062C\u0631\u0628\u0629 \u0627\u0644\u0625\u0634\u0639\u0627\u0631 \u0645\u0646 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A.");
      setStatus("\u062A\u0645 \u0627\u0644\u062A\u0641\u0639\u064A\u0644 \u0648\u062D\u0641\u0638 \u0627\u0644\u0645\u0648\u0639\u062F. \u062C\u0631\u0651\u0628 \u0625\u0631\u0633\u0627\u0644 \u0625\u0634\u0639\u0627\u0631 \u0644\u0644\u062A\u0623\u0643\u062F \u0645\u0646 \u0648\u0635\u0648\u0644\u0647.");
    } catch (error) {
      if (registered) {
        try {
          await api("device", registered.token, { id: registered.id }, "DELETE");
        } catch {
        }
        try {
          writeDevice({ ...registered, enabled: false });
        } catch {
        }
      }
      const node = $2("#activation-status");
      if (node) node.textContent = error.message;
      setStatus(error.message);
    } finally {
      busy = false;
    }
  }
  async function syncReminders(force = false) {
    const device = readDevice();
    if (!configured() || !device.id || !supported()) return;
    if (syncing) {
      queued = true;
      return;
    }
    syncing = true;
    try {
      const prefs = preferences(device);
      await writeReminderGuard(prefs);
      const serialized = JSON.stringify(prefs);
      if (force || serialized !== lastSent) {
        await api("device", device.token, { id: device.id, preferences: prefs }, "PUT");
        lastSent = serialized;
      }
      setStatus(device.enabled ? "\u0627\u0644\u0645\u0648\u0639\u062F \u0648\u0627\u0644\u062C\u062F\u0648\u0644 \u0645\u062A\u0632\u0627\u0645\u0646\u0627\u0646. \u0627\u0644\u062C\u0644\u0633\u0629 \u0627\u0644\u0645\u0646\u0641\u0651\u0630\u0629 \u0644\u0646 \u062A\u064F\u0630\u0643\u0651\u0631 \u0628\u0647\u0627 \u0627\u0644\u064A\u0648\u0645." : "\u0627\u0644\u062A\u0630\u0643\u064A\u0631 \u0645\u062A\u0648\u0642\u0641.");
    } catch (error) {
      setStatus(`${error.message} \u0633\u062A\u064F\u0639\u0627\u062F \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629 \u0639\u0646\u062F \u0641\u062A\u062D \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0623\u0648 \u0639\u0648\u062F\u0629 \u0627\u0644\u0627\u062A\u0635\u0627\u0644.`);
    } finally {
      syncing = false;
      if (queued) {
        queued = false;
        void syncReminders();
      }
    }
  }
  async function saveReminderTime() {
    const time = $2("#reminder-time")?.value, device = readDevice();
    if (!device.id || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time || "")) {
      setStatus("\u0641\u0639\u0651\u0644 \u0627\u0644\u062A\u0630\u0643\u064A\u0631 \u0648\u0627\u062E\u062A\u0631 \u0633\u0627\u0639\u0629 \u0635\u062D\u064A\u062D\u0629 \u0623\u0648\u0644\u064B\u0627.");
      return;
    }
    try {
      writeDevice({ ...device, time });
      await syncReminders(true);
    } catch {
      setStatus("\u062A\u0639\u0630\u0651\u0631 \u062D\u0641\u0638 \u0627\u0644\u0648\u0642\u062A \u0639\u0644\u0649 \u0627\u0644\u062C\u0647\u0627\u0632.");
    }
  }
  async function disableReminder() {
    const device = readDevice();
    try {
      const prefs = preferences({ ...device, enabled: false });
      await writeReminderGuard(prefs);
      writeDevice({ ...device, enabled: false });
      setStatus("\u0623\u064F\u0648\u0642\u0641 \u0627\u0644\u062A\u0630\u0643\u064A\u0631 \u0645\u062D\u0644\u064A\u064B\u0627\u061B \u062C\u0627\u0631\u064D \u062A\u062D\u062F\u064A\u062B \u062E\u062F\u0645\u0629 \u0627\u0644\u0625\u0631\u0633\u0627\u0644.");
      await syncReminders(true);
    } catch {
      setStatus("\u062A\u0639\u0630\u0651\u0631 \u062D\u0641\u0638 \u0627\u0644\u0625\u064A\u0642\u0627\u0641. \u064A\u0645\u0643\u0646\u0643 \u0645\u0646\u0639 \u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A \u0645\u0646 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u0648\u0642\u0639 \u0641\u064A \u0627\u0644\u0645\u062A\u0635\u0641\u062D.");
    }
  }
  async function testReminder() {
    const device = readDevice();
    if (!device.enabled || !device.id) {
      setStatus("\u0641\u0639\u0651\u0644 \u0627\u0644\u062A\u0630\u0643\u064A\u0631 \u0623\u0648\u0644\u064B\u0627.");
      return;
    }
    if (busy) return;
    busy = true;
    try {
      await syncReminders(true);
      await api("test", device.token, { id: device.id });
      setStatus("\u0642\u0628\u0644\u062A \u062E\u062F\u0645\u0629 \u0627\u0644\u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628 \u0627\u0644\u062A\u062C\u0631\u0628\u0629. \u062A\u062D\u0642\u0642 \u0645\u0646 \u0638\u0647\u0648\u0631 \u0627\u0644\u0625\u0634\u0639\u0627\u0631 \u0639\u0644\u0649 \u0627\u0644\u0647\u0627\u062A\u0641.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      busy = false;
    }
  }
  function initReminders() {
    if (!configured() || initialized) return;
    initialized = true;
    const scheduleSync = () => {
      const device = readDevice();
      if (device.id && supported()) void writeReminderGuard(preferences(device)).catch(() => setStatus("\u062A\u0639\u0630\u0651\u0631 \u062A\u062D\u062F\u064A\u062B \u062D\u0627\u0644\u0629 \u0627\u0644\u062A\u0630\u0643\u064A\u0631 \u0627\u0644\u0645\u062D\u0644\u064A\u0629."));
      clearTimeout(timer);
      timer = setTimeout(() => {
        void syncReminders();
      }, 150);
    };
    window.addEventListener("haraka-state-saved", scheduleSync);
    window.addEventListener("online", () => {
      void syncReminders(true);
    });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) void syncReminders(true);
    });
    window.addEventListener("storage", (event) => {
      if (event.key === "haraka-v2-change" || event.key === DEVICE_KEY) scheduleSync();
    });
    setInterval(() => {
      if (!document.hidden) void syncReminders();
    }, 6e4);
    void syncReminders(true);
  }

  // js/infrastructure/workout-repository.mjs
  var DATABASE_NAME = "haraka-vnext";
  var DATABASE_VERSION = 1;
  function openStorage({ name = DATABASE_NAME, factory = globalThis.indexedDB } = {}) {
    return new Promise((resolve, reject) => {
      if (!factory) return reject(Error("IndexedDB unavailable"));
      const r = factory.open(name, DATABASE_VERSION);
      r.onupgradeneeded = () => {
        const db = r.result;
        for (const n of ["settings", "active", "history"]) if (!db.objectStoreNames.contains(n)) db.createObjectStore(n);
      };
      r.onerror = () => reject(r.error);
      r.onblocked = () => reject(Error("Database upgrade blocked: close other tabs"));
      r.onsuccess = () => {
        const db = r.result;
        db.onversionchange = () => db.close();
        resolve(new Repository(db));
      };
    });
  }
  function request(r) {
    return new Promise((resolve, reject) => {
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
  }
  var Repository = class {
    constructor(db) {
      this.db = db;
    }
    close() {
      this.db.close();
    }
    async transaction(names2, mode, run2) {
      const tx = this.db.transaction(names2, mode);
      const done = new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error || Error("Transaction aborted"));
      });
      try {
        const result = await run2((n) => tx.objectStore(n));
        await done;
        return result;
      } catch (e) {
        try {
          tx.abort();
        } catch {
        }
        await done.catch(() => {
        });
        throw e;
      }
    }
    getActive() {
      return this.transaction(["active"], "readonly", (s) => request(s("active").get("current")));
    }
    getSettings() {
      return this.transaction(["settings"], "readonly", (s) => request(s("settings").get("preferences")));
    }
    saveSettings(settings2) {
      return this.transaction(["settings"], "readwrite", (s) => request(s("settings").put(structuredClone(settings2), "preferences")));
    }
    exportData() {
      return this.transaction(["settings", "active", "history"], "readonly", async (s) => ({ settings: await request(s("settings").get("preferences")), active: await request(s("active").get("current")) || null, history: await request(s("history").getAll()) }));
    }
    restoreData(data) {
      return this.transaction(["settings", "active", "history"], "readwrite", async (s) => {
        for (const n of ["settings", "active", "history"]) await request(s(n).clear());
        await request(s("settings").put(structuredClone(data.settings), "preferences"));
        if (data.active) await request(s("active").put(structuredClone(data.active), "current"));
        for (const h of data.history) await request(s("history").put(structuredClone(h), h.id));
      });
    }
    deleteRecord(id) {
      return this.transaction(["history"], "readwrite", (s) => request(s("history").delete(id)));
    }
    listHistory() {
      return this.transaction(["history"], "readonly", (s) => request(s("history").getAll()));
    }
    start(session) {
      if (session.status !== "active" || session.cursor !== 0 || session.revision !== 0 || !session.snapshot?.steps?.length) throw Error("Invalid new session");
      return this.transaction(["active", "history"], "readwrite", async (s) => {
        if (await request(s("active").get("current"))) throw Error("Active session already exists");
        const history2 = await request(s("history").getAll());
        if (history2.some((x) => x.id === session.id)) throw Error("Session id already used");
        if (history2.some((x) => x.dateKey === session.dateKey || x.completedDate === session.dateKey)) throw Error("Date already completed");
        if (history2.some((x) => (x.scheduledDate || x.dateKey) === (session.scheduledDate || session.dateKey))) throw Error("Scheduled slot already recorded");
        await request(s("active").put(structuredClone(session), "current"));
        return session;
      });
    }
    save(session, expectedRevision) {
      return this.transaction(["active", "history"], "readwrite", async (s) => {
        const old = await request(s("active").get("current"));
        if (!old || old.id !== session.id || old.revision !== expectedRevision) throw Error("Session write conflict");
        if (session.revision !== expectedRevision + 1 || session.dateKey !== old.dateKey || session.cursor < old.cursor || session.cursor > old.snapshot.steps.length) throw Error("Invalid session update");
        const value = { ...structuredClone(session), snapshot: old.snapshot, startedAt: old.startedAt, scheduledDate: old.scheduledDate };
        if (["completed", "stopped"].includes(value.status)) {
          if (value.status === "completed" && value.cursor !== old.snapshot.steps.length) throw Error("Incomplete session");
          await request(s("history").put(value, value.id));
          await request(s("active").delete("current"));
        } else if (value.status === "active") await request(s("active").put(value, "current"));
        else throw Error("Invalid status");
        return value;
      });
    }
  };

  // js/application/workout-service.mjs
  var WorkoutService = class {
    constructor(repository, content2) {
      this.repository = repository;
      this.content = content2;
      this.queue = Promise.resolve();
    }
    start(workoutId, options) {
      return this.repository.start(createSession(compileWorkout(this.content, workoutId), options));
    }
    dispatch(command2, now = Date.now()) {
      const op = this.queue.then(async () => {
        const old = await this.repository.getActive();
        if (!old) throw Error("No active session");
        const next = reduceSession(old, command2, now);
        if (next.revision === old.revision) return old;
        if (next.status !== "active") next.completedDate = todayKey(new Date(now));
        return this.repository.save(next, old.revision);
      });
      this.queue = op.catch(() => {
      });
      return op;
    }
    async reconcile(settings2, now = Date.now()) {
      const session = await this.resume();
      if (!session || !activeExpired(settings2, session, todayKey(new Date(now)))) return session;
      const next = reduceSession(session, { type: "stop" }, now);
      next.endReason = "expired";
      await this.repository.save(next, session.revision);
      return null;
    }
    resume() {
      return this.repository.getActive();
    }
  };

  // js/infrastructure/audio.mjs
  var ctx;
  async function prepareSound() {
    try {
      ctx ?? (ctx = new (window.AudioContext || window.webkitAudioContext)());
      await ctx.resume();
    } catch {
    }
  }
  function ring(sound) {
    if (!ctx || ctx.state !== "running") return;
    const notes = { chime: [[0, 523, 0.28], [0.22, 659, 0.28], [0.44, 784, 0.32], [0.72, 1047, 0.8]], bell: [[0, 880, 1], [0.45, 1320, 0.8]], pulse: [[0, 660, 0.18], [0.32, 660, 0.18]], soft: [[0, 392, 0.8], [0.5, 523, 0.8]], rise: [[0, 440, 0.2], [0.16, 554, 0.2], [0.32, 659, 0.2], [0.48, 880, 0.6]], silent: [] }[sound] || [];
    for (const [offset, hz, duration] of notes) {
      const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + offset;
      o.frequency.value = hz;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.16, t + 0.02);
      g.gain.exponentialRampToValueAtTime(1e-3, t + duration);
      o.connect(g);
      g.connect(ctx.destination);
      o.onended = () => {
        o.disconnect();
        g.disconnect();
      };
      o.start(t);
      o.stop(t + duration + 0.02);
    }
  }

  // js/app.mjs
  var $3 = (s) => document.querySelector(s);
  var exerciseMap = Object.fromEntries(content.exercises.map((e) => [e.id, e]));
  var repo;
  var svc;
  var settings;
  var active;
  var history = [];
  var view = "today";
  var selected = todayKey();
  var busy2 = false;
  var onboardingStage = 0;
  var draftProgram = "move";
  var draftLevel = 1;
  var lastFocus;
  var toastTimer;
  var formDraft;
  var pendingBackup = null;
  var observedDay = todayKey();
  var historyMonth = todayKey().slice(0, 7);
  var settingsPage = "main";
  var changes = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("haraka-v2-change") : null;
  var notifyChange = () => {
    changes?.postMessage("changed");
    window.dispatchEvent(new Event("haraka-state-saved"));
  };
  var defaultSettings = () => ({ schemaVersion: 1, palette: "classic", sound: "chime", theme: matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light", revisions: [], levels: { move: 1, foundation: 1, strength: 1, hybrid: 1, circuit: 1 } });
  function toast2(text) {
    $3("#toast").textContent = text;
    $3("#toast").hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $3("#toast").hidden = true, 3500);
  }
  function fail(e) {
    $3("#error").hidden = false;
    $3("#error").textContent = e.message === "Session write conflict" ? "\u062A\u063A\u064A\u0631\u062A \u0627\u0644\u062C\u0644\u0633\u0629 \u0641\u064A \u0646\u0627\u0641\u0630\u0629 \u0623\u062E\u0631\u0649. \u062D\u062F\u0651\u062B \u0627\u0644\u0635\u0641\u062D\u0629 \u0642\u0628\u0644 \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629." : `\u062A\u0639\u0630\u0651\u0631 \u0625\u0643\u0645\u0627\u0644 \u0627\u0644\u0639\u0645\u0644\u064A\u0629: ${e.message}. \u0644\u0645 \u0646\u062A\u062C\u0627\u0647\u0644 \u062E\u0637\u0623 \u0627\u0644\u062D\u0641\u0638.`;
  }
  function apply() {
    document.documentElement.dataset.palette = view === "settings" ? formDraft?.palette ?? settings.palette : settings.palette;
    document.documentElement.dataset.theme = settings.theme;
  }
  function show(html) {
    lastFocus = document.activeElement;
    $3("#modal-content").innerHTML = html;
    $3("#modal").classList.toggle("wide", html.includes("v-comparison"));
    if (!$3("#modal").open) $3("#modal").showModal();
  }
  function modalHead2(title) {
    return `<div class="modal-head"><h2>${esc(title)}</h2>${button("\xD7", "close", "icon-btn", 'aria-label="\u0625\u063A\u0644\u0627\u0642"')}</div>`;
  }
  function close() {
    $3("#modal").close();
    $3("#modal-content").replaceChildren();
    lastFocus?.focus?.();
  }
  function instruction(id, snapshot) {
    const e = (snapshot?.exercises || exerciseMap)[id];
    if (!e) return;
    show(`${modalHead2(e.name_ar)}<span class="pill">${esc(e.equipment)}</span><p class="v-space">${esc(e.setup)}</p><ol>${e.steps.map((t) => `<li>${esc(t)}</li>`).join("")}</ol><p class="notice">${esc(e.common_error)}</p><p class="muted">${esc(e.counting.rule_ar)}</p>`);
  }
  function programCards() {
    return Object.keys(names).map((p) => `<button type="button" class="v-program ${p === draftProgram ? "selected" : ""}" data-program="${p}" aria-pressed="${p === draftProgram}"><strong>${names[p]}</strong><span>${descriptions[p]}</span></button>`).join("");
  }
  function levels() {
    return [1, 2, 3].map((n) => `<button type="button" class="v-program ${n === draftLevel ? "selected" : ""}" data-level="${n}" aria-pressed="${n === draftLevel}"><strong>${levelName(n)}</strong><span>${levelText[draftProgram][n - 1]}</span></button>`).join("");
  }
  function requirement() {
    return draftProgram === "move" ? "\u062D\u0627\u0626\u0637 \u0648\u0643\u0631\u0633\u064A \u062B\u0627\u0628\u062A\u060C \u0648\u0628\u0633\u0627\u0637 \u0641\u064A \u0627\u0644\u0645\u0633\u062A\u0648\u064A\u064A\u0646 2 \u06483." : "\u0628\u0633\u0627\u0637 \u0648\u062D\u0627\u0626\u0637 \u0648\u0643\u0631\u0633\u064A \u0648\u0633\u0637\u062D \u062B\u0627\u0628\u062A \u0645\u0646\u0627\u0633\u0628\u061B \u062F\u0645\u0628\u0644 \u0648\u0627\u062D\u062F \u0644\u062C\u0644\u0633\u0627\u062A \u0627\u0644\u0633\u062D\u0628.";
  }
  function onboarding() {
    return `<section class="card v-onboarding"><span class="eyebrow">${onboardingStage === 0 ? "1 \u2014 \u0627\u062E\u062A\u0631 \u0628\u0631\u0646\u0627\u0645\u062C\u0643" : "2 \u2014 \u0627\u062E\u062A\u0631 \u0645\u0633\u062A\u0648\u0627\u0643"}</span><h1>${onboardingStage === 0 ? "\u0645\u0627 \u0646\u0648\u0639 \u0627\u0644\u062D\u0631\u0643\u0629 \u0627\u0644\u0630\u064A \u064A\u0646\u0627\u0633\u0628\u0643\u061F" : names[draftProgram]}</h1><p class="muted v-space">${onboardingStage === 0 ? "\u064A\u0645\u0643\u0646\u0643 \u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062C \u0644\u0627\u062D\u0642\u064B\u0627 \u0645\u0646 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A." : "\u0627\u0644\u0645\u0633\u062A\u0648\u064A\u0627\u062A \u062E\u0627\u0635\u0629 \u0628\u0647\u0630\u0627 \u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062C\u060C \u0648\u0627\u0644\u0627\u062E\u062A\u064A\u0627\u0631 \u064A\u062F\u0648\u064A \u062F\u0648\u0646 \u0627\u062E\u062A\u0628\u0627\u0631."}</p><div class="v-choices">${onboardingStage === 0 ? programCards() : levels()}</div>${onboardingStage === 1 ? `<p class="v-space">${requirement()}</p><p class="small muted">\u062A\u0639\u0644\u0645 \u0627\u0644\u0645\u0642\u0627\u0648\u0645\u0629 \u064A\u062D\u062A\u0627\u062C \u062A\u0648\u062C\u064A\u0647\u064B\u0627 \u0645\u0624\u0647\u0644\u064B\u0627 \u0644\u0644\u064A\u0627\u0641\u0639\u064A\u0646\u061B \u062A\u0648\u0642\u0641 \u0639\u0646\u062F \u0627\u0644\u0623\u0644\u0645 \u0623\u0648 \u0641\u0642\u062F\u0627\u0646 \u0627\u0644\u062A\u062D\u0643\u0645.</p><div class="v-buttons">${button("\u0631\u062C\u0648\u0639", "onboard-back")}${button("\u0645\u0639\u0627\u064A\u0646\u0629 \u0627\u0644\u062C\u0644\u0633\u0627\u062A", "preview-plan")}${button("\u0627\u0639\u062A\u0645\u0627\u062F \u0627\u062E\u062A\u064A\u0627\u0631\u064A", "onboard-save", "primary")}</div>` : `<div class="v-buttons">${button("\u0627\u0644\u062A\u0627\u0644\u064A", "onboard-next", "primary")}</div>`}</section>`;
  }
  function preview(id) {
    const snap = compileWorkout(content, id);
    show(`${modalHead2(`${names[snap.workout.program]} \xB7 ${sessionName(snap.workout.program, snap.workout.session)} \xB7 ${levelName(snap.workout.level)}`)}${button("\u0645\u0642\u0627\u0631\u0646\u0629 \u0645\u0633\u062A\u0648\u064A\u0627\u062A \u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062C", "browse-program", "text-btn", `data-id="${snap.workout.program}"`)}<p class="small muted">\u0627\u0644\u0645\u062F\u0629 \u0627\u0644\u0645\u062D\u0633\u0648\u0628\u0629 ${estimates[id].join("\u2013")} \u062F\u0642\u064A\u0642\u0629\u061B \u0627\u0644\u062A\u0642\u062F\u064A\u0631 \u0627\u0644\u0623\u0635\u0644\u064A ${snap.workout.plannedMinutes.join("\u2013")} \u062F\u0642\u064A\u0642\u0629. \u064A\u0634\u0645\u0644 \u0627\u0644\u062D\u0633\u0627\u0628 \u0627\u0644\u0631\u0627\u062D\u0629\u060C \u0648\u064A\u062E\u062A\u0644\u0641 \u062D\u0633\u0628 \u0633\u0631\u0639\u0629 \u0627\u0644\u0639\u062F\u0651\u0627\u062A \u0648\u062A\u0645\u062F\u064A\u062F\u0647\u0627. \u0644\u0645 \u062A\u064F\u0642\u064E\u0633 \u0627\u0644\u0645\u062F\u0629 \u0628\u062A\u062C\u0631\u0628\u0629 \u0641\u0639\u0644\u064A\u0629.</p>${["warmup", "main", "strength", "aerobic", "cooldown"].map((block) => {
      const items = snap.steps.filter((s) => s.block === block);
      if (!items.length) return "";
      return `<h3 class="v-space">${{ warmup: "\u0627\u0644\u0625\u062D\u0645\u0627\u0621", main: "\u0627\u0644\u062A\u0645\u0627\u0631\u064A\u0646", strength: "\u0627\u0644\u0642\u0648\u0629", aerobic: "\u0627\u0644\u0647\u0648\u0627\u0626\u064A", cooldown: "\u0627\u0644\u062A\u0647\u062F\u0626\u0629" }[block]}</h3>${items.map((s) => s.type === "rest" ? `<div class="v-preview-rest">\u0631\u0627\u062D\u0629 \xB7 ${s.seconds} \u062B\u0627\u0646\u064A\u0629</div>` : `<div class="v-preview-row"><span>${esc(movementName(s, snap.exercises))}</span><small>${goal(s)} ${s.set ? `\xB7 \u0645\u062C\u0645\u0648\u0639\u0629 ${s.set}/${s.sets}` : ""}${s.round ? `\xB7 \u062F\u0648\u0631\u0629 ${s.round}/${s.rounds}` : ""}${s.side ? ` \xB7 ${s.side === "right" ? "\u064A\u0645\u064A\u0646" : "\u064A\u0633\u0627\u0631"}` : ""}${s.pauseSeconds ? ` \xB7 \u062A\u0648\u0642\u0641 ${s.pauseSeconds}\u062B \u062F\u0627\u062E\u0644 \u0627\u0644\u0639\u062F\u0651\u0629` : ""}</small></div>`).join("")}`;
    }).join("")}`);
  }
  function home() {
    return renderHome({ settings, selected, active, history });
  }
  function player() {
    if (!active) {
      view = "today";
      return home();
    }
    return renderPlayer(active);
  }
  function hiddenHistory() {
    const rows = history.filter((r) => r.hidden);
    return rows.length ? `<details class="v-hidden-records"><summary>\u062C\u0644\u0633\u0627\u062A \u0645\u062E\u0641\u064A\u0629 \u0633\u0627\u0628\u0642\u064B\u0627 (${rows.length})</summary><p class="small muted">\u0627\u062D\u062A\u0641\u0638 \u0627\u0644\u0625\u0635\u062F\u0627\u0631 \u0627\u0644\u0633\u0627\u0628\u0642 \u0628\u0645\u0648\u0627\u0639\u064A\u062F\u0647\u0627. \u062D\u0630\u0641\u0647\u0627 \u0646\u0647\u0627\u0626\u064A\u064B\u0627 \u064A\u0632\u064A\u0644 \u062D\u062C\u0632 \u0627\u0644\u0645\u0648\u0639\u062F.</p>${rows.map((r) => `<div class="v-hidden-row"><span>${esc(r.dateKey)} \xB7 ${names[r.snapshot.workout.program]} ${sessionName(r.snapshot.workout.program, r.snapshot.workout.session)}</span>${button("\u062D\u0630\u0641 \u0646\u0647\u0627\u0626\u064A", "delete-record", "secondary v-delete", `data-id="${esc(r.id)}"`)}</div>`).join("")}</details>` : "";
  }
  function historyView() {
    return renderHistory(history, historyMonth, hiddenHistory());
  }
  function recordView(id) {
    const r = history.find((r2) => r2.id === id);
    show(`${modalHead2("\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u062C\u0644\u0633\u0629")}<p>${names[r.snapshot.workout.program]} \xB7 ${sessionName(r.snapshot.workout.program, r.snapshot.workout.session)} \xB7 ${levelName(r.snapshot.workout.level)}</p><p class="muted">\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062A\u0646\u0641\u064A\u0630: ${executionDate(r)}</p>${r.scheduledDate && r.scheduledDate !== executionDate(r) ? `<p class="small muted">\u0627\u0644\u0645\u0648\u0639\u062F \u0627\u0644\u0623\u0635\u0644\u064A: ${r.scheduledDate}</p>` : ""}${r.results.filter((x) => r.snapshot.steps.find((s) => s.id === x.stepId)?.type === "work").map((x) => {
      const s = r.snapshot.steps.find((s2) => s2.id === x.stepId);
      return `<div class="v-preview-row"><strong>${esc(movementName(s, r.snapshot.exercises))}</strong><small>${goal(s)}${s.side ? ` \xB7 ${s.side === "right" ? "\u064A\u0645\u064A\u0646" : "\u064A\u0633\u0627\u0631"}` : ""}${s.set ? ` \xB7 \u0645\u062C\u0645\u0648\u0639\u0629 ${s.set}/${s.sets}` : ""}${s.round ? ` \xB7 \u062F\u0648\u0631\u0629 ${s.round}/${s.rounds}` : ""} \xB7 ${x.outcome === "done" ? "\u062A\u0645" : "\u062A\u062C\u0627\u0648\u0632"}</small></div>`;
    }).join("") || "<p>\u0644\u0645 \u062A\u064F\u0633\u062C\u0644 \u062E\u0637\u0648\u0627\u062A \u0645\u0643\u062A\u0645\u0644\u0629.</p>"}${button("\u062D\u0630\u0641 \u0645\u0646 \u0627\u0644\u0633\u062C\u0644", "delete-record", "text-btn", `data-id="${esc(r.id)}"`)}`);
  }
  function settingsView() {
    return renderSettings({ settings, formDraft, settingsPage, draftProgram, active, history, programCards, levels, requirement, reminderSection });
  }
  function refreshImages() {
    document.querySelectorAll(".v-exercise-image img").forEach((img) => {
      const frame = img.closest(".v-exercise-image");
      const finish = () => {
        frame.classList.remove("is-loading");
        frame.setAttribute("aria-busy", "false");
        const failed = !img.naturalWidth;
        img.hidden = failed;
        frame.querySelector(".v-image-fallback").hidden = !failed;
      };
      img.onload = finish;
      img.onerror = finish;
      if (img.complete) finish();
    });
  }
  function render() {
    apply();
    if (view === "session") $3("#toast").hidden = true;
    const first = !settings.revisions.length;
    document.body.classList.toggle("training", !first && view === "session");
    document.body.classList.toggle("home-screen", !first && view === "today");
    $3(".bottom-nav").hidden = first || view === "session";
    $3(".header-actions").hidden = first || view === "session";
    $3(".header-actions").innerHTML = `${button(icon("programs"), "preview-all", "icon-btn", 'title="\u0627\u0633\u062A\u0639\u0631\u0627\u0636 \u0627\u0644\u0628\u0631\u0627\u0645\u062C" aria-label="\u0627\u0633\u062A\u0639\u0631\u0627\u0636 \u0627\u0644\u0628\u0631\u0627\u0645\u062C"')}${button(icon(settings.theme === "dark" ? "sun" : "moon"), "theme", "icon-btn", 'title="\u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u0645\u0638\u0647\u0631" aria-label="\u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u0645\u0638\u0647\u0631"')}<button class="icon-btn" data-view="settings" aria-label="\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A" title="\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A">${icon("settings")}</button>`;
    $3("#main").innerHTML = first ? onboarding() : view === "session" ? player() : view === "library" ? library() : view === "history" ? historyView() : view === "settings" ? settingsView() : home();
    document.querySelectorAll("[data-view]").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
    refreshClock();
    if (view === "library") updateLibrary();
    refreshImages();
    if (view === "settings") {
      refreshReminders();
      window.HarakaPWA?.refresh();
    }
  }
  async function refreshState() {
    settings = await repo.getSettings() || settings;
    active = await svc.reconcile(settings);
    history = await repo.listHistory();
  }
  async function navigate(v) {
    if (!settings.revisions.length) return;
    if (view === "session" && v !== "session" && active?.timer?.running) await svc.dispatch({ type: "pause" });
    view = v;
    if (v === "settings") {
      formDraft = null;
      settingsPage = "main";
      const p = settings.revisions.at(-1);
      draftProgram = p.program;
      draftLevel = settings.levels?.[p.program] || p.level;
    }
    location.hash = v;
    await refreshState();
    render();
    $3("#main").focus({ preventScroll: true });
  }
  async function saveSettings(value) {
    await repo.saveSettings(value);
    settings = value;
    apply();
    notifyChange();
  }
  async function run(fn) {
    if (busy2) return;
    busy2 = true;
    const trigger = document.activeElement;
    trigger?.classList.add("is-loading");
    document.querySelectorAll("button").forEach((b) => b.disabled = true);
    try {
      await fn();
      $3("#error").hidden = true;
    } catch (e) {
      fail(e);
    } finally {
      busy2 = false;
      trigger?.classList.remove("is-loading");
      document.querySelectorAll("button").forEach((b) => b.disabled = false);
      if (view === "settings") {
        refreshReminders();
        window.HarakaPWA?.refresh();
      }
    }
  }
  async function command(type, extra = {}) {
    if (!active) return;
    const s = active.snapshot.steps[active.cursor];
    const result = await svc.dispatch({ type, stepId: s.id, ...extra });
    await refreshState();
    notifyChange();
    if (!active) {
      view = "history";
      toast2(result.status === "completed" ? "\u062D\u064F\u0641\u0638\u062A \u0627\u0644\u062C\u0644\u0633\u0629" : "\u062D\u064F\u0641\u0638 \u0627\u0644\u062C\u0632\u0621 \u0627\u0644\u0645\u0646\u0641\u0630");
    } else if (active.snapshot.steps[active.cursor].type === "rest" && !active.timer) {
      await svc.dispatch({ type: "startTimer", stepId: active.snapshot.steps[active.cursor].id });
      await refreshState();
    }
    render();
  }
  var clockFrame = null;
  function animateClock() {
    clockFrame = null;
    refreshClock();
  }
  function refreshClock() {
    if (!active || view !== "session") return;
    const s = active.snapshot.steps[active.cursor];
    if (s.type !== "rest" && s.unit !== "seconds") return;
    const ms = remaining(active) ?? (s.seconds ?? s.target) * 1e3, n = Math.ceil(ms / 1e3), text = $3("#timer-text");
    const display = `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
    if (text && text.textContent !== display) text.textContent = display;
    const ratio = 1 - Math.min(1, ms / (active.timer?.totalMs ?? (s.seconds ?? s.target) * 1e3));
    $3("#clock-ring")?.style.setProperty("--progress", `${ratio * 360}deg`);
    if (s.type !== "rest") $3("#timer-button")?.style.setProperty("--fill", `${ratio * 100}%`);
    if (active.timer?.running && ms > 0 && !document.hidden && clockFrame === null) clockFrame = requestAnimationFrame(animateClock);
    if (active.timer?.running && ms === 0 && !busy2 && !document.hidden) run(async () => {
      ring(settings.sound);
      await command("elapsed");
    });
  }
  setInterval(() => {
    if (todayKey() !== observedDay && !busy2) {
      observedDay = todayKey();
      selected = observedDay;
      run(async () => {
        await refreshState();
        notifyChange();
        render();
      });
    } else refreshClock();
  }, 250);
  if (changes) changes.onmessage = () => {
    if (!busy2) run(async () => {
      await refreshState();
      render();
    });
  };
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && svc) run(async () => {
      await refreshState();
      render();
    });
  });
  window.addEventListener("hashchange", () => {
    const next = location.hash.slice(1);
    if (["today", "library", "history", "settings", "session"].includes(next) && next !== view) run(() => navigate(next));
  });
  document.addEventListener("input", (e) => {
    if (e.target.id === "search") {
      searchLibrary(e.target.value);
    }
  });
  document.addEventListener("submit", (e) => {
    if (e.target.id !== "settings-form") return;
    e.preventDefault();
    const form = new FormData(e.target);
    const section = e.target.dataset.section;
    run(async () => {
      if (section === "appearance") {
        await saveSettings({ ...settings, palette: form.get("palette"), sound: form.get("sound") });
        formDraft = null;
        toast2("\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A");
        render();
        return;
      }
      const plan = { program: draftProgram, level: draftLevel, schedule: ["A", "B", "C"].map((session) => ({ session, day: Number(form.get(`day-${session}`)) })) };
      await refreshState();
      let next = updatePlan(settings, plan, { active, history });
      next = { ...next, levels: { ...settings.levels, [draftProgram]: draftLevel } };
      await saveSettings(next);
      formDraft = null;
      toast2("\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A" + (next.revisions.at(-1).effectiveFrom > todayKey() ? " \xB7 \u0627\u0644\u062E\u0637\u0629 \u0627\u0644\u062C\u062F\u064A\u062F\u0629 \u0645\u0646 \u0627\u0644\u063A\u062F" : " \xB7 \u0627\u0644\u062E\u0637\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 \u062C\u0627\u0647\u0632\u0629"));
      render();
    });
  });
  document.addEventListener("click", (e) => {
    const b = e.target.closest("button,a.brand");
    if (!b || busy2) return;
    if (b.matches("a.brand")) {
      e.preventDefault();
      run(() => navigate("today"));
      return;
    }
    if (b.dataset.view) {
      run(() => navigate(b.dataset.view));
      return;
    }
    if (b.dataset.day) {
      selected = b.dataset.day;
      render();
      return;
    }
    if (b.dataset.program) {
      if (view === "settings") formDraft = Object.fromEntries(new FormData($3("#settings-form")));
      draftProgram = b.dataset.program;
      draftLevel = settings.levels?.[draftProgram] || 1;
      render();
      return;
    }
    if (b.dataset.level) {
      if (view === "settings") formDraft = Object.fromEntries(new FormData($3("#settings-form")));
      draftLevel = Number(b.dataset.level);
      render();
      return;
    }
    const a = b.dataset.action;
    if (!a) return;
    if (view === "settings" && $3("#settings-form")) formDraft = Object.fromEntries(new FormData($3("#settings-form")));
    if (a === "settings-plan" || a === "settings-back" || a === "appearance-cancel") {
      settingsPage = a === "settings-plan" ? "plan" : "main";
      formDraft = null;
      const plan = settings.revisions.at(-1);
      draftProgram = plan.program;
      draftLevel = plan.level;
      render();
      return;
    }
    if (a === "history-prev" || a === "history-next") {
      const [y, m] = historyMonth.split("-").map(Number);
      const date2 = new Date(Date.UTC(y, m - 1 + (a === "history-prev" ? -1 : 1), 1));
      historyMonth = date2.toISOString().slice(0, 7);
      render();
      return;
    }
    if (a === "preview-all") {
      show(`${modalHead2("\u0627\u0633\u062A\u0639\u0631\u0627\u0636 \u0627\u0644\u0628\u0631\u0627\u0645\u062C")}<p class="muted">\u0627\u0644\u0645\u0639\u0627\u064A\u0646\u0629 \u0644\u0627 \u062A\u063A\u064A\u0651\u0631 \u0628\u0631\u0646\u0627\u0645\u062C\u0643 \u0623\u0648 \u062C\u062F\u0648\u0644\u0643.</p><div class="v-choices">${Object.keys(names).map((p) => button(names[p] + " \u2014 " + descriptions[p], "browse-program", "v-program", `data-id="${p}"`)).join("")}</div>`);
      return;
    }
    if (a === "browse-program") {
      show(programComparison(b.dataset.id));
      return;
    }
    if (a === "install-app") {
      window.HarakaPWA?.install();
      return;
    }
    if (a === "reminder-enable") {
      activationDialog();
      return;
    }
    if (a === "reminder-confirm") {
      run(() => activateReminder());
      return;
    }
    if (["reminder-save", "reminder-test", "reminder-disable"].includes(a)) {
      run(() => runReminderAction(a));
      return;
    }
    if (a === "import") {
      $3("#backup-file").click();
      return;
    }
    if (a === "delete-record") {
      show(`${modalHead2("\u062D\u0630\u0641 \u0627\u0644\u062C\u0644\u0633\u0629 \u0646\u0647\u0627\u0626\u064A\u064B\u0627\u061F")}<p>\u0633\u062A\u064F\u062D\u0630\u0641 \u062A\u0641\u0627\u0635\u064A\u0644 \u0647\u0630\u0647 \u0627\u0644\u062C\u0644\u0633\u0629 \u0645\u0646 \u0627\u0644\u062C\u0647\u0627\u0632 \u0648\u064A\u064F\u0632\u0627\u0644 \u062D\u062C\u0632 \u0645\u0648\u0639\u062F\u0647\u0627. \u0625\u0630\u0627 \u0643\u0627\u0646 \u0627\u0644\u0645\u0648\u0639\u062F \u0645\u062A\u0627\u062D\u064B\u0627 \u0627\u0644\u064A\u0648\u0645\u060C \u064A\u0645\u0643\u0646\u0643 \u0628\u062F\u0621 \u0627\u0644\u062C\u0644\u0633\u0629 \u0645\u0646 \u062C\u062F\u064A\u062F.</p><p class="small muted v-space">\u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639 \u0639\u0646 \u0627\u0644\u062D\u0630\u0641 \u0625\u0644\u0627 \u0628\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 \u0633\u0627\u0628\u0642\u0629.</p>${button("\u0625\u0644\u063A\u0627\u0621", "close")}${button("\u062D\u0630\u0641", "confirm-delete", "primary", `data-id="${esc(b.dataset.id)}"`)}`);
      return;
    }
    if (a === "close") {
      pendingBackup = null;
      close();
      return;
    }
    if (a === "instruction") {
      instruction(b.dataset.id, view === "session" ? active?.snapshot : null);
      return;
    }
    if (a === "preview") {
      preview(b.dataset.workout);
      return;
    }
    if (a === "record") {
      recordView(b.dataset.id);
      return;
    }
    if (a === "preview-plan") {
      show(`${modalHead2("\u0645\u0639\u0627\u064A\u0646\u0629 \u062C\u0644\u0633\u0627\u062A \u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062C")}<div class="v-buttons">${["A", "B", "C"].map((l) => button(sessionName(draftProgram, l), "preview", "secondary", `data-workout="${draftProgram}-${l.toLowerCase()}-${draftLevel}"`)).join("")}</div>`);
      return;
    }
    if (a === "leave") {
      show(`${modalHead2("\u0627\u0644\u062C\u0644\u0633\u0629 \u0645\u062D\u0641\u0648\u0638\u0629")}<div class="v-buttons">${button("\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0631\u0626\u064A\u0633\u064A\u0629", "leave-home")}${button("\u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u062C\u0644\u0633\u0629", "stop")}${button("\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u062A\u0645\u0631\u064A\u0646", "close")}</div>`);
      return;
    }
    if (a === "stop") {
      show(`${modalHead2("\u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u062C\u0644\u0633\u0629\u061F")}<p>\u0633\u064A\u064F\u062D\u0641\u0638 \u0627\u0644\u062C\u0632\u0621 \u0627\u0644\u0645\u0646\u0641\u0630 \u0641\u064A \u0633\u062C\u0644\u0651\u0643.</p><div class="v-buttons">${button("\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u062A\u0645\u0631\u064A\u0646", "close")}${button("\u0625\u0646\u0647\u0627\u0621 \u0648\u062D\u0641\u0638", "confirm-stop", "primary")}</div>`);
      return;
    }
    run(async () => {
      if (a === "export") {
        downloadBackup(await makeBackup(repo, content));
        toast2("\u062A\u0645 \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u0646\u0633\u062E\u0629 \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629");
        return;
      } else if (a === "confirm-import") {
        if (!pendingBackup) return;
        const data = pendingBackup;
        pendingBackup = null;
        await repo.restoreData(data);
        close();
        formDraft = null;
        view = "today";
        selected = todayKey();
        await refreshState();
        notifyChange();
        toast2("\u062A\u0645\u062A \u0627\u0644\u0627\u0633\u062A\u0639\u0627\u062F\u0629\u061B \u0627\u0644\u0645\u0624\u0642\u062A \u0645\u062D\u0641\u0648\u0638 \u0628\u0648\u0636\u0639 \u0627\u0644\u0625\u064A\u0642\u0627\u0641 \u0627\u0644\u0645\u0624\u0642\u062A");
      } else if (a === "confirm-delete") {
        await repo.deleteRecord(b.dataset.id);
        close();
        await refreshState();
        notifyChange();
        toast2("\u062D\u064F\u0630\u0641\u062A \u0627\u0644\u062C\u0644\u0633\u0629 \u0648\u0623\u064F\u0632\u064A\u0644 \u062D\u062C\u0632 \u0645\u0648\u0639\u062F\u0647\u0627");
      } else if (a === "onboard-next") onboardingStage = 1;
      else if (a === "onboard-back") onboardingStage = 0;
      else if (a === "onboard-save") {
        await saveSettings({ ...changePlan(settings, { program: draftProgram, level: draftLevel, schedule: [{ day: 0, session: "A" }, { day: 2, session: "B" }, { day: 4, session: "C" }] }), levels: { ...settings.levels, [draftProgram]: draftLevel } });
        initReminders();
      } else if (a === "theme") {
        await saveSettings({ ...settings, theme: settings.theme === "dark" ? "light" : "dark" });
      } else if (a === "start") {
        await refreshState();
        const offer = opportunity(settings, history);
        if (!offer || offer.workoutId !== b.dataset.workout) throw Error("\u062A\u063A\u064A\u0631 \u0645\u0648\u0639\u062F \u0627\u0644\u062C\u0644\u0633\u0629\u061B \u0627\u0631\u062C\u0639 \u0644\u0644\u064A\u0648\u0645");
        await prepareSound();
        await svc.start(offer.workoutId, { id: crypto.randomUUID(), dateKey: todayKey(), scheduledDate: offer.date });
        view = "session";
        notifyChange();
      } else if (a === "resume") {
        await prepareSound();
        view = "session";
      } else if (a === "leave-home") {
        close();
        if (active?.timer?.running) await svc.dispatch({ type: "pause" });
        view = "today";
      } else if (a === "confirm-stop") {
        close();
        await command("stop");
        return;
      } else if (a === "timer") {
        await prepareSound();
        await command(active.timer?.running ? "pause" : "startTimer");
        return;
      } else if (a === "done" || a === "skip" || a === "finish-rest") {
        await command(a === "finish-rest" ? "skip" : a);
        return;
      } else if (a === "extend") {
        await command("extendTimer", { seconds: 15 });
        return;
      } else if (a === "today") selected = todayKey();
      else if (a === "prev-week") selected = shift(selected, -7);
      else if (a === "next-week") selected = shift(selected, 7);
      else if (a === "test-sound") {
        await prepareSound();
        ring($3("#settings-form select[name=sound]").value);
        return;
      }
      await refreshState();
      render();
    });
  });
  document.addEventListener("change", (e) => {
    if (e.target.name === "palette") {
      formDraft = Object.fromEntries(new FormData($3("#settings-form")));
      render();
      document.querySelector(".v-palette-picker summary")?.focus();
      return;
    }
    if (e.target.id === "history-month") {
      historyMonth = e.target.value || todayKey().slice(0, 7);
      render();
      return;
    }
    if (e.target.matches("#settings-form select[name^=day-]")) {
      const session = e.target.name.slice(4), plan = settings.revisions.at(-1);
      const previous = ["A", "B", "C"].map((letter) => ({ session: letter, day: Number(formDraft?.[`day-${letter}`] ?? plan.schedule.find((s) => s.session === letter).day) }));
      const swapped = swapScheduleDay(previous, session, Number(e.target.value));
      for (const item of swapped) $3("#settings-form select[name=day-" + item.session + "]").value = String(item.day);
      formDraft = Object.fromEntries(new FormData($3("#settings-form")));
      return;
    }
    if (e.target.id !== "backup-file") return;
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    run(async () => {
      if (file.size > 30 * 1024 * 1024) throw Error("\u0627\u0644\u0645\u0644\u0641 \u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u062D\u062F \u0627\u0644\u0645\u0633\u0645\u0648\u062D 30 \u0645\u064A\u063A\u0627\u0628\u0627\u064A\u062A");
      pendingBackup = validateBackup(JSON.parse(await file.text()), content);
      show(`${modalHead2("\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u0646\u0633\u062E\u0629 \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629\u061F")}<p>\u0633\u062A\u064F\u0633\u062A\u0628\u062F\u0644 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0647\u0630\u0627 \u0627\u0644\u062C\u0647\u0627\u0632 \u0648\u0633\u062C\u0644\u0651\u0647 \u0628\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0645\u062E\u062A\u0627\u0631: ${pendingBackup.history.filter((r) => !r.hidden).length} \u062C\u0644\u0633\u0629\u060C ${pendingBackup.active ? "\u0645\u0639 \u062C\u0644\u0633\u0629 \u062C\u0627\u0631\u064A\u0629" : "\u062F\u0648\u0646 \u062C\u0644\u0633\u0629 \u062C\u0627\u0631\u064A\u0629"}. \u0635\u062F\u0651\u0631 \u0628\u064A\u0627\u0646\u0627\u062A\u0643 \u0623\u0648\u0644\u064B\u0627 \u0625\u0630\u0627 \u0623\u0631\u062F\u062A \u0627\u0644\u0627\u062D\u062A\u0641\u0627\u0638 \u0628\u0647\u0627.</p><p>\u0627\u0644\u062A\u0630\u0643\u064A\u0631\u0627\u062A \u0645\u0631\u062A\u0628\u0637\u0629 \u0628\u0627\u0644\u062C\u0647\u0627\u0632 \u0648\u0644\u0627 \u062A\u064F\u0646\u0642\u0644 \u0628\u0627\u0644\u0645\u0644\u0641.</p><div class="v-buttons">${button("\u0625\u0644\u063A\u0627\u0621", "close")}${button("\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0648\u0627\u0633\u062A\u0628\u062F\u0627\u0644", "confirm-import", "primary")}</div>`);
    });
  });
  function programComparison(p) {
    return `${modalHead2(names[p])}<p class="muted">${descriptions[p]}</p><p class="small muted v-space">\u0639\u0644\u0649 \u0627\u0644\u0647\u0627\u062A\u0641\u060C \u0627\u0633\u062D\u0628 \u0627\u0644\u062C\u062F\u0648\u0644 \u0623\u0641\u0642\u064A\u064B\u0627 \u0644\u0645\u0642\u0627\u0631\u0646\u0629 \u0627\u0644\u0645\u0633\u062A\u0648\u064A\u0627\u062A.</p>${["A", "B", "C"].map((letter) => `<h3 class="v-space">${sessionName(p, letter)}</h3><div class="v-comparison" role="region" aria-label="\u0645\u0642\u0627\u0631\u0646\u0629 \u0645\u0633\u062A\u0648\u064A\u0627\u062A ${sessionName(p, letter)}" tabindex="0"><table><thead><tr>${[1, 2, 3].map((l) => `<th scope="col">${levelName(l)}</th>`).join("")}</tr></thead><tbody><tr>${[1, 2, 3].map((l) => {
      const w = content.workouts.find((w2) => w2.id === `${p}-${letter.toLowerCase()}-${l}`);
      return `<td><p class="small muted">${levelText[p][l - 1]}</p>${w.blocks.filter((b) => !["warmup", "cooldown"].includes(b.id)).map((b) => `<p class="pill">${b.kind === "repeat" ? `\u062F\u0648\u0631\u062A\u0627\u0646` : b.id === "strength" ? "\u0627\u0644\u0642\u0648\u0629" : "\u0627\u0644\u062A\u0645\u0627\u0631\u064A\u0646"}</p>${b.items.filter((x) => x.exercise_id).map((x) => `<div class="v-preview-row"><strong>${esc(exerciseMap[x.exercise_id].name_ar)}</strong><small>${x.target} ${x.unit === "seconds" ? "\u062B\u0627\u0646\u064A\u0629" : x.unit === "cycles" ? "\u062F\u0648\u0631\u0627\u062A" : "\u0639\u062F\u0651\u0627\u062A"}${x.sides === 2 ? " \u0644\u0643\u0644 \u062C\u0647\u0629" : ""}${x.sets > 1 ? ` \xB7 ${x.sets} \u0645\u062C\u0645\u0648\u0639\u0627\u062A` : ""}${x.pause_seconds ? ` \xB7 \u062A\u0648\u0642\u0641 ${x.pause_seconds}\u062B` : ""}</small></div>`).join("")}`).join("")}${button("\u0627\u0644\u062A\u0633\u0644\u0633\u0644 \u0627\u0644\u0643\u0627\u0645\u0644", "preview", "secondary", `data-workout="${w.id}"`)}</td>`;
    }).join("")}</tr></tbody></table></div>`).join("")}${button("\u0643\u0644 \u0627\u0644\u0628\u0631\u0627\u0645\u062C", "preview-all", "text-btn")}`;
  }
  async function boot() {
    try {
      repo = await openStorage();
      settings = await repo.getSettings() || defaultSettings();
      settings.levels ?? (settings.levels = { move: 1, foundation: 1, strength: 1, hybrid: 1, circuit: 1 });
      svc = new WorkoutService(repo, content);
      configureReminders({ show, modalHead: modalHead2, close, toast: toast2, state: () => ({ settings, history }) });
      await refreshState();
      if (settings.revisions.length) initReminders();
      const requested = location.hash.slice(1);
      if (["today", "library", "history", "settings", "session"].includes(requested)) view = requested;
      render();
    } catch (e) {
      fail(e);
      $3("#main").innerHTML = '<section class="card"><h1>\u062A\u0639\u0630\u0651\u0631 \u0641\u062A\u062D \u0628\u064A\u0627\u0646\u0627\u062A\u0643</h1><p>\u0623\u0639\u062F \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0635\u0641\u062D\u0629 \u0644\u0644\u0645\u062D\u0627\u0648\u0644\u0629 \u0645\u062C\u062F\u062F\u064B\u0627. \u0644\u0646 \u0646\u0628\u062F\u0623 \u062C\u0644\u0633\u0629 \u062F\u0648\u0646 \u062D\u0641\u0638.</p></section>';
    } finally {
      window.harakaBootFinished = true;
    }
  }
  boot();
})();
