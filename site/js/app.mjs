import { downloadBackup } from "./infrastructure/download.mjs";
import { esc, button, movementName, goal } from "./presentation/html.mjs";
import { names, descriptions, levelText } from "./data/program-labels.mjs";
import { renderPlayer } from "./presentation/player.mjs";
import { library, updateLibrary, searchLibrary } from "./presentation/library.mjs";
import { APP_VERSION } from "./data/version.mjs";
import { estimates } from "./data/estimates.mjs";
import { makeBackup, validateBackup } from "./application/backup.mjs";
import * as reminders from "./infrastructure/reminders.mjs";
import { content } from "./data/content.mjs";
import { openStorage } from "./infrastructure/workout-repository.mjs";
import { WorkoutService } from "./application/workout-service.mjs";
import { remaining, compileWorkout } from "./domain/engine.mjs";
import { todayKey, shift, weekday, days, planFor, slotFor, opportunity, changePlan, updatePlan, swapScheduleDay } from "./domain/schedule.mjs";
import { palettes } from "./data/palettes.mjs";
import { prepareSound, ring, sounds } from "./infrastructure/audio.mjs";
const $ = (s) => document.querySelector(s);
const exerciseMap = Object.fromEntries(content.exercises.map((e) => [e.id, e]));
let repo, svc, settings, active, history = [], view = "today", selected = todayKey(), busy = false, onboardingStage = 0, draftProgram = "move", draftLevel = 1, lastFocus, toastTimer, formDraft;
let pendingBackup = null, observedDay = todayKey();
const changes = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("haraka-v2-change") : null;
const notifyChange = () => {
  changes?.postMessage("changed");
  window.dispatchEvent(new Event("haraka-state-saved"));
};
const defaultSettings = () => ({ schemaVersion: 1, palette: "classic", sound: "chime", theme: matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light", revisions: [], levels: { move: 1, foundation: 1, strength: 1, hybrid: 1, circuit: 1 } });
function toast(text) {
  $("#toast").textContent = text;
  $("#toast").hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").hidden = true, 3500);
}
function fail(e) {
  $("#error").hidden = false;
  $("#error").textContent = e.message === "Session write conflict" ? "تغيرت الجلسة في نافذة أخرى. حدّث الصفحة قبل المتابعة." : `تعذّر إكمال العملية: ${e.message}. لم نتجاهل خطأ الحفظ.`;
}
function apply() {
  document.documentElement.dataset.palette = settings.palette;
  document.documentElement.dataset.theme = settings.theme;
}
function show(html) {
  lastFocus = document.activeElement;
  $("#modal-content").innerHTML = html;
  $("#modal").classList.toggle("wide", html.includes("v-comparison"));
  if (!$("#modal").open) $("#modal").showModal();
}
function modalHead(title) {
  return `<div class="modal-head"><h2>${esc(title)}</h2>${button("×", "close", "icon-btn", 'aria-label="إغلاق"')}</div>`;
}
function close() {
  $("#modal").close();
  $("#modal-content").replaceChildren();
  lastFocus?.focus?.();
}
function instruction(id, snapshot) {
  const e = (snapshot?.exercises || exerciseMap)[id];
  if (!e) return;
  show(`${modalHead(e.name_ar)}<span class="pill">${esc(e.equipment)}</span><p class="v-space">${esc(e.setup)}</p><ol>${e.steps.map((t) => `<li>${esc(t)}</li>`).join("")}</ol><p class="notice">${esc(e.common_error)}</p><p class="muted">${esc(e.counting.rule_ar)}</p>`);
}
function programCards() {
  return Object.keys(names).map((p) => `<button type="button" class="v-program ${p === draftProgram ? "selected" : ""}" data-program="${p}" aria-pressed="${p === draftProgram}"><strong>${names[p]}</strong><span>${descriptions[p]}</span></button>`).join("");
}
function levels() {
  return [1, 2, 3].map((n) => `<button type="button" class="v-program ${n === draftLevel ? "selected" : ""}" data-level="${n}" aria-pressed="${n === draftLevel}"><strong>المستوى ${n}</strong><span>${levelText[draftProgram][n - 1]}</span></button>`).join("");
}
function requirement() {
  return draftProgram === "move" ? "حائط وكرسي ثابت، وبساط في المستويين 2 و3." : "بساط وحائط وكرسي وسطح ثابت مناسب؛ دمبل واحد للسحب في A وC.";
}
function onboarding() {
  return `<section class="card v-onboarding"><span class="eyebrow">${onboardingStage === 0 ? "1 — اختر برنامجك" : "2 — اختر مستواك"}</span><h1>${onboardingStage === 0 ? "ما نوع الحركة الذي يناسبك؟" : names[draftProgram]}</h1><p class="muted v-space">${onboardingStage === 0 ? "يمكنك تغيير البرنامج لاحقًا من الإعدادات." : "المستويات خاصة بهذا البرنامج، والاختيار يدوي دون اختبار."}</p><div class="v-choices">${onboardingStage === 0 ? programCards() : levels()}</div>${onboardingStage === 1 ? `<p class="v-space">${requirement()}</p><p class="small muted">تعلم المقاومة يحتاج توجيهًا مؤهلًا لليافعين؛ توقف عند الألم أو فقدان التحكم.</p><div class="v-buttons">${button("رجوع", "onboard-back")}${button("معاينة الجلسات", "preview-plan")}${button("اعتماد اختياري", "onboard-save", "primary")}</div>` : `<div class="v-buttons">${button("التالي", "onboard-next", "primary")}</div>`}</section>`;
}
function preview(id) {
  const snap = compileWorkout(content, id);
  show(`${modalHead(`${names[snap.workout.program]} · ${snap.workout.session} · المستوى ${snap.workout.level}`)}${button("مقارنة مستويات البرنامج", "browse-program", "text-btn", `data-id="${snap.workout.program}"`)}<p class="small muted">المدة المحسوبة ${estimates[id].join("–")} دقيقة؛ التقدير الأصلي ${snap.workout.plannedMinutes.join("–")} دقيقة. يشمل الحساب الراحة، ويختلف حسب سرعة العدّات وتمديدها. لم تُقَس المدة بتجربة فعلية.</p>${["warmup", "main", "strength", "aerobic", "cooldown"].map((block) => {
    const items = snap.steps.filter((s) => s.block === block);
    if (!items.length) return "";
    return `<h3 class="v-space">${{ warmup: "الإحماء", main: "التمارين", strength: "القوة", aerobic: "الهوائي", cooldown: "التهدئة" }[block]}</h3>${items.map((s) => s.type === "rest" ? `<div class="v-preview-rest">راحة · ${s.seconds} ثانية</div>` : `<div class="v-preview-row"><span>${esc(movementName(s, snap.exercises))}</span><small>${goal(s)} ${s.set ? `· مجموعة ${s.set}/${s.sets}` : ""}${s.round ? `· دورة ${s.round}/${s.rounds}` : ""}${s.side ? ` · ${s.side === "right" ? "يمين" : "يسار"}` : ""}${s.pauseSeconds ? ` · توقف ${s.pauseSeconds}ث داخل العدّة` : ""}</small></div>`).join("")}`;
  }).join("")}`);
}
function home() {
  const t = todayKey(), start = shift(selected, -weekday(selected)), current = slotFor(settings, selected), offer = selected === t ? opportunity(settings, history, t) : null, record = history.find((r) => r.dateKey === selected || r.completedDate === selected);
  const chosen = active && selected === t ? { workoutId: active.snapshot.workout.id, session: active.snapshot.workout.session, program: active.snapshot.workout.program, level: active.snapshot.workout.level } : offer || current;
  let card;
  if (active && selected === t) card = `<span class="pill">جلسة محفوظة</span><h2>${names[chosen.program]} · ${chosen.session}</h2><p>المستوى ${chosen.level}</p>${button("أكمل جلستك", "resume", "primary")}`;
  else if (record) card = `<span class="pill">${record.status === "completed" ? "جلسة منتهية" : "انتهاء مبكر"}</span><h2>${names[record.snapshot.workout.program]} · ${record.snapshot.workout.session}</h2>${record.hidden ? `<p>هذه الجلسة مخفية، وما زال موعدها محجوزًا.</p>${button("حذف الجلسة وإتاحة الموعد", "delete-record", "secondary", `data-id="${esc(record.id)}"`)}` : button("عرض السجل", "record", "primary", `data-id="${esc(record.id)}"`)}`;
  else if (chosen) card = `<span class="pill">${offer?.kind === "makeup" ? "تعويض جلسة فائتة" : selected === t ? "جلسة اليوم" : "معاينة"}</span><h2>${names[chosen.program]} · الجلسة ${chosen.session}</h2><p>المستوى ${chosen.level}</p><p class="v-space small">${estimates[chosen.workoutId].join("–")} دقيقة تقديريًا</p>${offer ? button("ابدأ الجلسة", "start", "primary", `data-workout="${chosen.workoutId}"`) : ""}${button("معاينة التمارين", "preview", "secondary", `data-workout="${chosen.workoutId}"`)}`;
  else card = '<span class="pill">يوم راحة</span><h2>مساحة للراحة</h2><p>ستظهر جلستك عند موعدها القادم.</p>';
  return `<div class="home-content"><h1 class="home-title">برنامجي اليومي</h1><div class="v-browse-link">${button("استعراض جميع البرامج والخطط", "preview-all", "secondary")}</div><section class="weekly-calendar"><div class="v-calendar-head">${button("→", "prev-week", "icon-btn", 'aria-label="الأسبوع السابق"')}<span>${esc(start)} — ${esc(shift(start, 6))}</span>${button("←", "next-week", "icon-btn", 'aria-label="الأسبوع التالي"')}</div><div class="week-strip">${Array.from({ length: 7 }, (_, i) => {
    const d = shift(start, i);
    return `<button class="day-button ${d === selected ? "selected" : ""}" data-day="${d}" aria-pressed="${d === selected}"><span>${days[i]}</span><b>${Number(d.slice(-2))}</b><span class="day-marker">${history.some((r) => r.dateKey === d) ? "✓" : slotFor(settings, d) ? "تمرين" : "راحة"}</span></button>`;
  }).join("")}</div>${selected !== t ? button("العودة لليوم", "today", "text-btn") : ""}</section><section class="session-hero v-hero">${card}</section></div>`;
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
  return rows.length ? `<details class="v-hidden-records"><summary>جلسات مخفية سابقًا (${rows.length})</summary><p class="small muted">احتفظ الإصدار السابق بمواعيدها. حذفها نهائيًا يزيل حجز الموعد.</p>${rows.map((r) => `<div class="v-hidden-row"><span>${esc(r.dateKey)} · ${names[r.snapshot.workout.program]} ${r.snapshot.workout.session}</span>${button("حذف نهائي", "delete-record", "secondary v-delete", `data-id="${esc(r.id)}"`)}</div>`).join("")}</details>` : "";
}
function historyView() {
  return `<h1 class="v-space">سجلّي</h1>${history.some((r) => !r.hidden) ? history.filter((r) => !r.hidden).sort((a, b) => b.finishedAt - a.finishedAt).map((r) => `<article class="card record"><div><small>${esc(r.dateKey)}</small><h3>${names[r.snapshot.workout.program]} · ${r.snapshot.workout.session} · المستوى ${r.snapshot.workout.level}</h3><span class="muted">${r.status === "completed" ? "منتهية" : r.endReason === "expired" ? "انتهت نافذة الاستكمال" : "انتهاء مبكر"}${r.results.some((x) => x.outcome === "skipped") ? " · مع تجاوز" : ""}</span></div><div class="v-record-actions">${button("التفاصيل", "record", "secondary", `data-id="${esc(r.id)}"`)}${button("حذف الجلسة", "delete-record", "secondary v-delete", `data-id="${esc(r.id)}"`)}</div></article>`).join("") : '<section class="card empty"><p>ستظهر جلساتك هنا بعد انتهائها.</p></section>'}${hiddenHistory()}`;
}
function recordView(id) {
  const r = history.find((r2) => r2.id === id);
  show(`${modalHead("تفاصيل الجلسة")}<p>${names[r.snapshot.workout.program]} · ${r.snapshot.workout.session} · المستوى ${r.snapshot.workout.level}</p><p class="muted">${r.dateKey}</p>${r.results.filter((x) => r.snapshot.steps.find((s) => s.id === x.stepId)?.type === "work").map((x) => {
    const s = r.snapshot.steps.find((s2) => s2.id === x.stepId);
    return `<div class="v-preview-row"><strong>${esc(movementName(s, r.snapshot.exercises))}</strong><small>${goal(s)}${s.side ? ` · ${s.side === "right" ? "يمين" : "يسار"}` : ""}${s.set ? ` · مجموعة ${s.set}/${s.sets}` : ""}${s.round ? ` · دورة ${s.round}/${s.rounds}` : ""} · ${x.outcome === "done" ? "تم" : "تجاوز"}</small></div>`;
  }).join("") || "<p>لم تُسجل خطوات مكتملة.</p>"}${button("حذف من السجل", "delete-record", "text-btn", `data-id="${esc(r.id)}"`)}`);
}
function settingsView() {
  const plan = settings.revisions.at(-1), draft = formDraft || {};
  return `<section class="card v-settings"><h1>الإعدادات</h1><form id="settings-form"><h2 class="v-space">البرنامج والمستوى</h2><div class="v-choices">${programCards()}</div><div class="v-choices v-levels">${levels()}</div><p>${requirement()}</p><p class="small muted">${active ? "لديك جلسة محفوظة من " + names[active.snapshot.workout.program] + ". ستبقى بمحتواها، ويسري الاختيار الجديد من الغد. يمكنك معاينة البرنامج الجديد الآن." : history.some((r) => r.dateKey === todayKey() || r.completedDate === todayKey()) ? "جلسة اليوم مسجّلة؛ يسري التغيير من الغد. لتغيير جلسة اليوم احذف سجلها أولًا." : "يسري تغيير البرنامج والمستوى والجدول من اليوم عند الحفظ؛ تبقى الجلسات السابقة محفوظة."}</p>${button("معاينة الجلسات", "preview-plan", "text-btn", 'type="button"')}<h2 class="v-space">جدولي الأسبوعي</h2><p class="small muted">اختيار يوم مشغول يبدّل يومي الجلستين تلقائيًا.</p><div class="v-schedule">${["A", "B", "C"].map((letter) => `<label>الجلسة ${letter}<select name="day-${letter}">${days.map((name, i) => `<option value="${i}" ${Number(draft[`day-${letter}`] ?? plan.schedule.find((s) => s.session === letter)?.day) === i ? "selected" : ""}>${name}</option>`).join("")}</select></label>`).join("")}</div><h2 class="v-space">المظهر</h2><label>الألوان<select name="palette">${palettes.map(([id, name]) => `<option value="${id}" ${(draft.palette ?? settings.palette) === id ? "selected" : ""}>${name}</option>`).join("")}</select></label><label>نغمة المؤقت<select name="sound">${sounds.map(([id, name]) => `<option value="${id}" ${(draft.sound ?? settings.sound) === id ? "selected" : ""}>${name}</option>`).join("")}</select></label>${button("استمع للنغمة", "test-sound", "text-btn", 'type="button"')}<button class="primary full v-space" type="submit">حفظ الإعدادات</button></form><hr><section class="v-space"><h2>نسخة احتياطية</h2><p class="muted">احفظ إعداداتك وسجلّك والجلسة الجارية في ملف.</p><div class="v-buttons">${button("تصدير البيانات", "export")}${button("استعادة من ملف", "import")}</div><input id="backup-file" type="file" accept="application/json,.json" hidden></section><hr>${reminders.reminderSection()}<hr><h2 class="v-space">التطبيق</h2>${button("تثبيت حركة", "install-app")}<p id="install-status" class="small muted"></p><p class="small muted v-space">الإصدار ${APP_VERSION} · الصور التوضيحية قيد التجهيز</p></section>`;
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
  if (view === "session") $("#toast").hidden = true;
  const first = !settings.revisions.length;
  document.body.classList.toggle("training", !first && view === "session");
  $(".bottom-nav").hidden = first || view === "session";
  $(".header-actions").hidden = first;
  $("#main").innerHTML = first ? onboarding() : view === "session" ? player() : view === "library" ? library() : view === "history" ? historyView() : view === "settings" ? settingsView() : home();
  document.querySelectorAll("[data-view]").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
  refreshClock();
  if (view === "library") updateLibrary();
  refreshImages();
  if (view === "settings") {
    reminders.refreshReminders();
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
    const p = settings.revisions.at(-1);
    draftProgram = p.program;
    draftLevel = settings.levels?.[p.program] || p.level;
  }
  location.hash = v;
  await refreshState();
  render();
  $("#main").focus({ preventScroll: true });
}
async function saveSettings(value) {
  await repo.saveSettings(value);
  settings = value;
  apply();
  notifyChange();
}
async function run(fn) {
  if (busy) return;
  busy = true;
  const trigger = document.activeElement;
  trigger?.classList.add("is-loading");
  document.querySelectorAll("button").forEach((b) => b.disabled = true);
  try {
    await fn();
    $("#error").hidden = true;
  } catch (e) {
    fail(e);
  } finally {
    busy = false;
    trigger?.classList.remove("is-loading");
    document.querySelectorAll("button").forEach((b) => b.disabled = false);
    if (view === "settings") {
      reminders.refreshReminders();
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
    toast(result.status === "completed" ? "حُفظت الجلسة" : "حُفظ الجزء المنفذ");
  } else if (active.snapshot.steps[active.cursor].type === "rest" && !active.timer) {
    await svc.dispatch({ type: "startTimer", stepId: active.snapshot.steps[active.cursor].id });
    await refreshState();
  }
  render();
}
let clockFrame = null;
function animateClock() {
  clockFrame = null;
  refreshClock();
}
function refreshClock() {
  if (!active || view !== "session") return;
  const s = active.snapshot.steps[active.cursor];
  if (s.type !== "rest" && s.unit !== "seconds") return;
  const ms = remaining(active) ?? (s.seconds ?? s.target) * 1e3, n = Math.ceil(ms / 1e3), text = $("#timer-text");
  const display = `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
  if (text && text.textContent !== display) text.textContent = display;
  const ratio = 1 - Math.min(1, ms / ((s.seconds ?? s.target) * 1e3));
  $("#clock-ring")?.style.setProperty("--progress", `${ratio * 360}deg`);
  $("#timer-button")?.style.setProperty("--fill", `${ratio * 100}%`);
  if (active.timer?.running && ms > 0 && !document.hidden && clockFrame === null) clockFrame = requestAnimationFrame(animateClock);
  if (active.timer?.running && ms === 0 && !busy && !document.hidden) run(async () => {
    ring(settings.sound);
    await command("elapsed");
  });
}
setInterval(() => {
  if (todayKey() !== observedDay && !busy) {
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
  if (!busy) run(async () => {
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
  run(async () => {
    const plan = { program: draftProgram, level: draftLevel, schedule: ["A", "B", "C"].map((session) => ({ session, day: Number(form.get(`day-${session}`)) })) };
    await refreshState();
    let next = updatePlan(settings, plan, { active, history });
    next = { ...next, palette: form.get("palette"), sound: form.get("sound"), levels: { ...settings.levels, [draftProgram]: draftLevel } };
    await saveSettings(next);
    formDraft = null;
    toast("تم حفظ الإعدادات" + (next.revisions.at(-1).effectiveFrom > todayKey() ? " · الخطة الجديدة من الغد" : " · الخطة الحالية جاهزة"));
    render();
  });
});
document.addEventListener("click", (e) => {
  const b = e.target.closest("button,a.brand");
  if (!b || busy) return;
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
    if (view === "settings") formDraft = Object.fromEntries(new FormData($("#settings-form")));
    draftProgram = b.dataset.program;
    draftLevel = settings.levels?.[draftProgram] || 1;
    render();
    return;
  }
  if (b.dataset.level) {
    if (view === "settings") formDraft = Object.fromEntries(new FormData($("#settings-form")));
    draftLevel = Number(b.dataset.level);
    render();
    return;
  }
  const a = b.dataset.action;
  if (!a) return;
  if (view === "settings" && $("#settings-form")) formDraft = Object.fromEntries(new FormData($("#settings-form")));
  if (a === "preview-all") {
    show(`${modalHead("استعراض البرامج")}<p class="muted">المعاينة لا تغيّر برنامجك أو جدولك.</p><div class="v-choices">${Object.keys(names).map((p) => button(names[p] + " — " + descriptions[p], "browse-program", "v-program", `data-id="${p}"`)).join("")}</div>`);
    return;
  }
  if (a === "browse-program") {
    show(programComparison(b.dataset.id));
    return;
  }
  if (a === "browse-program-old") {
    const p = b.dataset.id;
    show(`${modalHead(names[p])}<div class="v-choices">${[1, 2, 3].map((l) => `<section class="v-preview-row"><h3>المستوى ${l}</h3><p>${levelText[p][l - 1]}</p><div class="v-buttons">${["A", "B", "C"].map((a2) => button("الجلسة " + a2, "preview", "secondary", `data-workout="${p}-${a2.toLowerCase()}-${l}"`)).join("")}</div></section>`).join("")}</div>${button("كل البرامج", "preview-all", "text-btn")}`);
    return;
  }
  if (a === "install-app") {
    window.HarakaPWA?.install();
    return;
  }
  if (a === "reminder-enable") {
    reminders.activationDialog();
    return;
  }
  if (a === "reminder-confirm") {
    run(() => reminders.activateReminder());
    return;
  }
  if (["reminder-save", "reminder-test", "reminder-disable"].includes(a)) {
    run(() => reminders.runReminderAction(a));
    return;
  }
  if (a === "import") {
    $("#backup-file").click();
    return;
  }
  if (a === "delete-record") {
    show(`${modalHead("حذف الجلسة نهائيًا؟")}<p>ستُحذف تفاصيل هذه الجلسة من الجهاز ويُزال حجز موعدها. إذا كان الموعد متاحًا اليوم، يمكنك بدء الجلسة من جديد.</p><p class="small muted v-space">لا يمكن التراجع عن الحذف إلا باستعادة نسخة احتياطية سابقة.</p>${button("إلغاء", "close")}${button("حذف", "confirm-delete", "primary", `data-id="${esc(b.dataset.id)}"`)}`);
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
    show(`${modalHead("معاينة جلسات البرنامج")}<div class="v-buttons">${["A", "B", "C"].map((l) => button(`الجلسة ${l}`, "preview", "secondary", `data-workout="${draftProgram}-${l.toLowerCase()}-${draftLevel}"`)).join("")}</div>`);
    return;
  }
  if (a === "leave") {
    show(`${modalHead("الجلسة محفوظة")}<div class="v-buttons">${button("العودة للرئيسية", "leave-home")}${button("إيقاف الجلسة", "stop")}${button("متابعة التمرين", "close")}</div>`);
    return;
  }
  if (a === "stop") {
    show(`${modalHead("إيقاف الجلسة؟")}<p>سيُحفظ الجزء المنفذ في سجلّك.</p><div class="v-buttons">${button("متابعة التمرين", "close")}${button("إنهاء وحفظ", "confirm-stop", "primary")}</div>`);
    return;
  }
  run(async () => {
    if (a === "export") {
      downloadBackup(await makeBackup(repo, content));
      toast("تم تجهيز النسخة الاحتياطية");
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
      toast("تمت الاستعادة؛ المؤقت محفوظ بوضع الإيقاف المؤقت");
    } else if (a === "confirm-delete") {
      await repo.deleteRecord(b.dataset.id);
      close();
      await refreshState();
      notifyChange();
      toast("حُذفت الجلسة وأُزيل حجز موعدها");
    } else if (a === "onboard-next") onboardingStage = 1;
    else if (a === "onboard-back") onboardingStage = 0;
    else if (a === "onboard-save") {
      await saveSettings({ ...changePlan(settings, { program: draftProgram, level: draftLevel, schedule: [{ day: 0, session: "A" }, { day: 2, session: "B" }, { day: 4, session: "C" }] }), levels: { ...settings.levels, [draftProgram]: draftLevel } });
      reminders.initReminders();
    } else if (a === "theme") {
      await saveSettings({ ...settings, theme: settings.theme === "dark" ? "light" : "dark" });
    } else if (a === "start") {
      await refreshState();
      const offer = opportunity(settings, history);
      if (!offer || offer.workoutId !== b.dataset.workout) throw Error("تغير موعد الجلسة؛ ارجع لليوم");
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
      ring($("#settings-form select[name=sound]").value);
      return;
    }
    await refreshState();
    render();
  });
});
document.addEventListener("change", (e) => {
  if (e.target.matches("#settings-form select[name^=day-]")) {
    const session = e.target.name.slice(4), plan = settings.revisions.at(-1);
    const previous = ["A", "B", "C"].map((letter) => ({ session: letter, day: Number(formDraft?.[`day-${letter}`] ?? plan.schedule.find((s) => s.session === letter).day) }));
    const swapped = swapScheduleDay(previous, session, Number(e.target.value));
    for (const item of swapped) $("#settings-form select[name=day-" + item.session + "]").value = String(item.day);
    formDraft = Object.fromEntries(new FormData($("#settings-form")));
    return;
  }
  if (e.target.id !== "backup-file") return;
  const file = e.target.files[0];
  e.target.value = "";
  if (!file) return;
  run(async () => {
    if (file.size > 30 * 1024 * 1024) throw Error("الملف أكبر من الحد المسموح 30 ميغابايت");
    pendingBackup = validateBackup(JSON.parse(await file.text()), content);
    show(`${modalHead("استعادة النسخة الاحتياطية؟")}<p>ستُستبدل إعدادات هذا الجهاز وسجلّه بالملف المختار: ${pendingBackup.history.filter((r) => !r.hidden).length} جلسة، ${pendingBackup.active ? "مع جلسة جارية" : "دون جلسة جارية"}. صدّر بياناتك أولًا إذا أردت الاحتفاظ بها.</p><p>التذكيرات مرتبطة بالجهاز ولا تُنقل بالملف.</p><div class="v-buttons">${button("إلغاء", "close")}${button("استعادة واستبدال", "confirm-import", "primary")}</div>`);
  });
});
function programComparison(p) {
  return `${modalHead(names[p])}<p class="muted">${descriptions[p]}</p><p class="small muted v-space">على الهاتف، اسحب الجدول أفقيًا لمقارنة المستويات.</p>${["A", "B", "C"].map((letter) => `<h3 class="v-space">الجلسة ${letter}</h3><div class="v-comparison" role="region" aria-label="مقارنة مستويات الجلسة ${letter}" tabindex="0"><table><thead><tr>${[1, 2, 3].map((l) => `<th scope="col">المستوى ${l}</th>`).join("")}</tr></thead><tbody><tr>${[1, 2, 3].map((l) => {
    const w = content.workouts.find((w2) => w2.id === `${p}-${letter.toLowerCase()}-${l}`);
    return `<td><p class="small muted">${levelText[p][l - 1]}</p>${w.blocks.filter((b) => !["warmup", "cooldown"].includes(b.id)).map((b) => `<p class="pill">${b.kind === "repeat" ? `دورتان` : b.id === "strength" ? "القوة" : "التمارين"}</p>${b.items.filter((x) => x.exercise_id).map((x) => `<div class="v-preview-row"><strong>${esc(exerciseMap[x.exercise_id].name_ar)}</strong><small>${x.target} ${x.unit === "seconds" ? "ثانية" : x.unit === "cycles" ? "دورات" : "عدّات"}${x.sides === 2 ? " لكل جهة" : ""}${x.sets > 1 ? ` · ${x.sets} مجموعات` : ""}${x.pause_seconds ? ` · توقف ${x.pause_seconds}ث` : ""}</small></div>`).join("")}`).join("")}${button("التسلسل الكامل", "preview", "secondary", `data-workout="${w.id}"`)}</td>`;
  }).join("")}</tr></tbody></table></div>`).join("")}${button("كل البرامج", "preview-all", "text-btn")}`;
}
async function boot() {
  try {
    repo = await openStorage();
    settings = await repo.getSettings() || defaultSettings();
    settings.levels ??= { move: 1, foundation: 1, strength: 1, hybrid: 1, circuit: 1 };
    svc = new WorkoutService(repo, content);
    reminders.configureReminders({ show, modalHead, close, toast, state: () => ({ settings, history }) });
    await refreshState();
    if (settings.revisions.length) reminders.initReminders();
    const requested = location.hash.slice(1);
    if (["today", "library", "history", "session"].includes(requested)) view = requested;
    render();
  } catch (e) {
    fail(e);
    $("#main").innerHTML = '<section class="card"><h1>تعذّر فتح بياناتك</h1><p>أعد تحميل الصفحة للمحاولة مجددًا. لن نبدأ جلسة دون حفظ.</p></section>';
  } finally {
    window.harakaBootFinished = true;
  }
}
boot();
