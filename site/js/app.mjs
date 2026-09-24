import { renderSessionPreview } from "./presentation/session-preview.mjs";
import { renderHome } from "./presentation/home.mjs";
import { renderHistory } from "./presentation/history.mjs";
import { renderSettings } from "./presentation/settings.mjs";
import { icon } from "./presentation/icons.mjs";
import { downloadBackup } from "./infrastructure/download.mjs";
import { esc, button, movementName, goal } from "./presentation/html.mjs";
import { names, descriptions, levelText, levelName, sessionName } from "./data/program-labels.mjs";
import { renderPlayer } from "./presentation/player.mjs";
import { library, updateLibrary, searchLibrary } from "./presentation/library.mjs";
import { estimates } from "./data/estimates.mjs";
import { makeBackup, validateBackup } from "./application/backup.mjs";
import * as reminders from "./infrastructure/reminders.mjs";
import { content } from "./data/content.mjs";
import { openStorage } from "./infrastructure/workout-repository.mjs";
import { WorkoutService } from "./application/workout-service.mjs";
import { remaining, compileWorkout } from "./domain/engine.mjs";
import { executionDate, todayKey, shift, weekday, days, planFor, slotFor, opportunity, changePlan, swapScheduleDay } from "./domain/schedule.mjs";
import { prepareSound, ring } from "./infrastructure/audio.mjs";
const $ = (s) => document.querySelector(s);
const exerciseMap = Object.fromEntries(content.exercises.map((e) => [e.id, e]));
let repo, svc, settings, active, history = [], view = "today", selected = todayKey(), busy = false, onboardingStage = 0, draftProgram = "move", draftLevel = 1, lastFocus, toastTimer, formDraft;
let pendingBackup = null, observedDay = todayKey(), historyMonth = todayKey().slice(0,7), settingsPage = "main";
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
  document.documentElement.dataset.palette = view === "settings" ? (formDraft?.palette ?? settings.palette) : settings.palette;
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
  return [1, 2, 3].map((n) => `<button type="button" class="v-program ${n === draftLevel ? "selected" : ""}" data-level="${n}" aria-pressed="${n === draftLevel}"><strong>${levelName(n)}</strong><span>${levelText[draftProgram][n - 1]}</span></button>`).join("");
}
function requirement() {
  return draftProgram === "move" ? "حائط وكرسي ثابت، وبساط في المستويين 2 و3." : "بساط وحائط وكرسي وسطح ثابت مناسب؛ دمبل واحد لجلسات السحب.";
}
function onboarding() {
  return `<section class="card v-onboarding"><span class="eyebrow">${onboardingStage === 0 ? "1 — اختر برنامجك" : "2 — اختر مستواك"}</span><h1>${onboardingStage === 0 ? "ما نوع الحركة الذي يناسبك؟" : names[draftProgram]}</h1><p class="muted v-space">${onboardingStage === 0 ? "يمكنك تغيير البرنامج لاحقًا من الإعدادات." : "المستويات خاصة بهذا البرنامج، والاختيار يدوي دون اختبار."}</p><div class="v-choices">${onboardingStage === 0 ? programCards() : levels()}</div>${onboardingStage === 1 ? `<p class="v-space">${requirement()}</p><p class="small muted">تعلم المقاومة يحتاج توجيهًا مؤهلًا لليافعين؛ توقف عند الألم أو فقدان التحكم.</p><div class="v-buttons">${button("رجوع", "onboard-back")}${button("معاينة الجلسات", "preview-plan")}${button("اعتماد اختياري", "onboard-save", "primary")}</div>` : `<div class="v-buttons">${button("التالي", "onboard-next", "primary")}</div>`}</section>`;
}
let previewSnapshot = null, previewReturn = null;
function preview(id) {
 previewSnapshot = compileWorkout(content,id);
 previewReturn = {view, scroll:window.scrollY, modal:$('#modal').open ? $('#modal-content').innerHTML : null};
 if($('#modal').open) close();
 view='preview'; window.history.pushState(null,'','#preview-'+id); render(); window.scrollTo({top:0,behavior:'instant'});
}
function returnFromPreview() {
 const target=previewReturn;previewReturn=null;view=target?.view||'today';render();
 if(target?.modal)show(target.modal);
 window.scrollTo({top:target?.scroll||0,behavior:'instant'});
}
function home() { return renderHome({settings, selected, active, history}); }
function player() {
  if (!active) {
    view = "today";
    return home();
  }
  return renderPlayer(active);
}
function hiddenHistory() {
  const rows = history.filter((r) => r.hidden);
  return rows.length ? `<details class="v-hidden-records"><summary>جلسات مخفية سابقًا (${rows.length})</summary><p class="small muted">احتفظ الإصدار السابق بمواعيدها. حذفها نهائيًا يزيل حجز الموعد.</p>${rows.map((r) => `<div class="v-hidden-row"><span>${esc(r.dateKey)} · ${names[r.snapshot.workout.program]} ${sessionName(r.snapshot.workout.program, r.snapshot.workout.session)}</span>${button("حذف نهائي", "delete-record", "secondary v-delete", `data-id="${esc(r.id)}"`)}</div>`).join("")}</details>` : "";
}
function historyView() { return renderHistory(history, historyMonth, hiddenHistory()); }
function recordView(id) {
  const r = history.find((r2) => r2.id === id);
  show(`${modalHead("تفاصيل الجلسة")}<p>${names[r.snapshot.workout.program]} · ${sessionName(r.snapshot.workout.program, r.snapshot.workout.session)} · ${levelName(r.snapshot.workout.level)}</p><p class="muted">تاريخ التنفيذ: ${executionDate(r)}</p>${r.scheduledDate && r.scheduledDate !== executionDate(r) ? `<p class="small muted">الموعد الأصلي: ${r.scheduledDate}</p>` : ""}${r.results.filter((x) => r.snapshot.steps.find((s) => s.id === x.stepId)?.type === "work").map((x) => {
    const s = r.snapshot.steps.find((s2) => s2.id === x.stepId);
    return `<div class="v-preview-row"><strong>${esc(movementName(s, r.snapshot.exercises))}</strong><small>${goal(s)}${s.side ? ` · ${s.side === "right" ? "يمين" : "يسار"}` : ""}${s.set ? ` · مجموعة ${s.set}/${s.sets}` : ""}${s.round ? ` · دورة ${s.round}/${s.rounds}` : ""} · ${x.outcome === "done" ? "تم" : "تجاوز"}</small></div>`;
  }).join("") || "<p>لم تُسجل خطوات مكتملة.</p>"}${button("حذف من السجل", "delete-record", "text-btn", `data-id="${esc(r.id)}"`)}`);
}
function settingsView() { return renderSettings({settings, formDraft, settingsPage, draftProgram, active, history, programCards, levels, requirement, reminderSection: reminders.reminderSection}); }
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
  document.body.classList.toggle("home-screen", !first && view === "today");
  $(".bottom-nav").hidden = first || view === "session" || view === "preview";
  $(".header-actions").hidden = first || view === "session" || view === "preview";
  $(".header-actions").innerHTML = `${button(icon('programs'), 'preview-all', 'icon-btn', 'title="استعراض البرامج" aria-label="استعراض البرامج"')}${button(icon(settings.theme === 'dark' ? 'sun' : 'moon'), 'theme', 'icon-btn', 'title="تبديل المظهر" aria-label="تبديل المظهر"')}<button class="icon-btn" data-view="settings" aria-label="الإعدادات" title="الإعدادات">${icon('settings')}</button>`;
  $("#main").innerHTML = view === "preview" && previewSnapshot ? renderSessionPreview(previewSnapshot) : first ? onboarding() : view === "session" ? player() : view === "library" ? library() : view === "history" ? historyView() : view === "settings" ? settingsView() : home();
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
    settingsPage = "main";
    const p = settings.revisions.at(-1);
    draftProgram = p.program;
    draftLevel = settings.levels?.[p.program] || p.level;
  }
  location.hash = v;
  await refreshState();
  render();
  window.scrollTo({top:0,behavior:"instant"});
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
  const ratio = 1 - Math.min(1, ms / (active.timer?.totalMs ?? (s.seconds ?? s.target) * 1e3));
  $("#clock-ring")?.style.setProperty("--progress", `${ratio * 360}deg`);
  if (s.type !== "rest") $("#timer-button")?.style.setProperty("--fill", `${ratio * 100}%`);
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
  if(view === 'preview' && !next.startsWith('preview-')) {returnFromPreview();return;}
  if(next.startsWith('preview-') && content.workouts.some(w=>w.id===next.slice(8))) {previewSnapshot=compileWorkout(content,next.slice(8));view='preview';render();window.scrollTo({top:0,behavior:'instant'});return;}
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
    if(section === 'appearance') {
      await saveSettings({...settings, palette: form.get('palette'), sound: form.get('sound')});
      formDraft = null; toast('تم حفظ الإعدادات'); render(); return;
    }
    const plan = { program: draftProgram, level: draftLevel, schedule: ["A", "B", "C"].map((session) => ({ session, day: Number(form.get(`day-${session}`)) })) };
    await refreshState();
    const next = await svc.savePlan(settings, plan);
    settings = next;
    await refreshState();
    apply();
    notifyChange();
    formDraft = null;
    settingsPage = "main";
    window.scrollTo({top:0,behavior:'instant'});
    toast(next.revisions.at(-1).effectiveFrom > todayKey() ? "تم حفظ الجدول · يبدأ من الغد" : "تم الحفظ وتحديث خطة اليوم");
    render();
    window.scrollTo({top:0,behavior:"instant"});
    $("#main").focus({preventScroll:true});
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
  if(a === 'preview-back') {if(previewReturn) window.history.back(); else {window.history.replaceState(null,'','#today');returnFromPreview();}return;}
  if (a === 'settings-plan' || a === 'settings-back' || a === 'appearance-cancel') {
    settingsPage = a === 'settings-plan' ? 'plan' : 'main'; formDraft = null;
    const plan = settings.revisions.at(-1); draftProgram = plan.program; draftLevel = plan.level;
    render(); return;
  }
  if (a === 'history-prev' || a === 'history-next') {
    const [y,m] = historyMonth.split('-').map(Number);
    const date = new Date(Date.UTC(y,m-1+(a === 'history-prev' ? -1 : 1),1));
    historyMonth = date.toISOString().slice(0,7); render(); return;
  }
  if (a === 'preview-all') {
    show(`${modalHead("استعراض البرامج")}<p class="muted">المعاينة لا تغيّر برنامجك أو جدولك.</p><div class="v-choices">${Object.keys(names).map((p) => button(names[p] + " — " + descriptions[p], "browse-program", "v-program", `data-id="${p}"`)).join("")}</div>`);
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
    show(`${modalHead("معاينة جلسات البرنامج")}<div class="v-buttons">${["A", "B", "C"].map((l) => button(sessionName(draftProgram, l), "preview", "secondary", `data-workout="${draftProgram}-${l.toLowerCase()}-${draftLevel}"`)).join("")}</div>`);
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
  if(e.target.name === 'palette') {
    formDraft = Object.fromEntries(new FormData($('#settings-form'))); render();
    document.querySelector('.v-palette-picker summary')?.focus(); return;
  }
  if(e.target.id === 'history-month') {historyMonth = e.target.value || todayKey().slice(0,7); render(); return;}

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
  return `${modalHead(names[p])}<p class="muted">${descriptions[p]}</p><p class="small muted v-space">على الهاتف، اسحب الجدول أفقيًا لمقارنة المستويات.</p>${["A", "B", "C"].map((letter) => `<h3 class="v-space">${sessionName(p, letter)}</h3><div class="v-comparison" role="region" aria-label="مقارنة مستويات ${sessionName(p, letter)}" tabindex="0"><table><thead><tr>${[1, 2, 3].map((l) => `<th scope="col">${levelName(l)}</th>`).join("")}</tr></thead><tbody><tr>${[1, 2, 3].map((l) => {
    const w = content.workouts.find((w2) => w2.id === `${p}-${letter.toLowerCase()}-${l}`);
    return `<td><p class="small muted">${levelText[p][l - 1]}</p>${w.blocks.filter((b) => !["warmup", "cooldown"].includes(b.id)).map((b) => `<p class="pill">${b.kind === "repeat" ? `دورتان` : b.id === "strength" ? "القوة" : "التمارين"}</p>${b.items.filter((x) => x.exercise_id).map((x) => `<div class="v-preview-row"><strong>${esc(exerciseMap[x.exercise_id].name_ar)}</strong><small>${x.target} ${x.unit === "seconds" ? "ثانية" : x.unit === "cycles" ? "دورات" : "عدّات"}${x.sides === 2 ? " لكل جهة" : ""}${x.sets > 1 ? ` · ${x.sets} مجموعات` : ""}${x.pause_seconds ? ` · توقف ${x.pause_seconds}ث` : ""}</small></div>`).join("")}`).join("")}</td>`;
  }).join("")}</tr><tr class="v-comparison-actions">${[1,2,3].map(l=>`<td>${button("التسلسل الكامل", "preview", "secondary", `data-workout="${p}-${letter.toLowerCase()}-${l}"`)}</td>`).join('')}</tr></tbody></table></div>`).join("")}${button("كل البرامج", "preview-all", "text-btn")}`;
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
    if(requested.startsWith('preview-') && content.workouts.some(w=>w.id===requested.slice(8))) {previewSnapshot=compileWorkout(content,requested.slice(8));view='preview';}
    if (["today", "library", "history", "settings", "session"].includes(requested)) view = requested;
    render();
  } catch (e) {
    fail(e);
    $("#main").innerHTML = '<section class="card"><h1>تعذّر فتح بياناتك</h1><p>أعد تحميل الصفحة للمحاولة مجددًا. لن نبدأ جلسة دون حفظ.</p></section>';
  } finally {
    window.harakaBootFinished = true;
  }
}
boot();
