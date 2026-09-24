import { REMINDER_API } from "./reminder-config.mjs";
import { todayKey, planFor, shift, weekday } from "../domain/schedule.mjs";
import { writeReminderGuard } from "./reminder-guard.mjs";
let adapter;
function configureReminders(value) {
  adapter = value;
}
const $ = (s) => document.querySelector(s), showDialog = (h) => adapter.show(h), modalHead = (t) => adapter.modalHead(t), closeDialog = () => adapter.close(), toast = (t) => adapter.toast(t);
function preferences(device = readDevice()) {
  const { settings, history } = adapter.state(), day = todayKey(), plan = planFor(settings, day);
  const occurrence = (d, s) => `${d}:${s}`;
  return {
    source: "v2",
    occurrenceMode: "date",
    enabled: Boolean(device.enabled) && Notification.permission === "granted",
    time: device.time || "18:00",
    timezone: "Asia/Damascus",
    entries: plan?.schedule || settings.revisions.at(-1).schedule,
    scheduleRevisions: settings.revisions.map((r) => ({ effectiveFrom: r.effectiveFrom, entries: r.schedule })).slice(-50),
    doneKeys: [...new Set([...history].sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate)).map((r) => occurrence(r.scheduledDate || r.dateKey, r.snapshot.workout.session)))].slice(-100),
    skipDates: [...new Set(history.flatMap((r) => [r.dateKey, r.completedDate].filter(Boolean)))].sort().slice(-10)
  };
}
const DEVICE_KEY = "haraka-reminders-v1";
let status = "", busy = false, syncing = false, queued = false, timer = null, lastSent = "";
const configured = () => /^https:\/\//.test(REMINDER_API);
const supported = () => typeof Notification !== "undefined" && "serviceWorker" in navigator && typeof PushManager !== "undefined" && typeof indexedDB !== "undefined" && location.protocol !== "file:" && window.isSecureContext;
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
    if (response.status === 401) throw Error("رمز التفعيل غير صحيح أو انتهى تسجيل الجهاز. أعد التفعيل.");
    if (response.status === 429) throw Error("انتظر دقيقة قبل إعادة تجربة الإشعار.");
    throw Error("تعذّر الاتصال بخدمة التذكير. جرّب مجددًا بعد التحقق من الاتصال.");
  }
  return response.json();
}
function setStatus(message) {
  status = message;
  refreshReminders();
}
let initialized = false;
let pendingReminderAction = "";
const reminderLoadingLabels = {
  "reminder-save": "جارٍ حفظ الموعد…",
  "reminder-test": "جارٍ إرسال التجربة…",
  "reminder-disable": "جارٍ إيقاف التذكير…"
};
function refreshReminderControls() {
  const device = readDevice();
  const pending = Boolean(pendingReminderAction);
  const labels = {
    "reminder-save": "حفظ الموعد",
    "reminder-test": "تجربة الإشعار",
    "reminder-enable": device.enabled ? "إعادة التفعيل" : "تفعيل التذكير",
    "reminder-disable": "إيقاف التذكير"
  };
  const available = {
    "reminder-save": configured() && Boolean(device.id),
    "reminder-test": configured() && Boolean(device.id) && Boolean(device.enabled) && typeof Notification !== "undefined" && Notification.permission === "granted",
    "reminder-enable": configured(),
    "reminder-disable": Boolean(device.id) && Boolean(device.enabled)
  };
  document.querySelectorAll(".reminder-settings button[data-action]").forEach((button) => {
    const action = button.dataset.action;
    if (!(action in labels)) return;
    const loading = action === pendingReminderAction;
    button.disabled = pending || !available[action];
    button.classList.toggle("is-loading", loading);
    button.setAttribute("aria-busy", String(loading));
    button.textContent = loading ? reminderLoadingLabels[action] : labels[action];
  });
  const timeInput = $("#reminder-time");
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
    setStatus(error?.message || "تعذّر تنفيذ العملية. حاول مجددًا.");
  } finally {
    pendingReminderAction = "";
    refreshReminders();
  }
}
function reminderSection() {
  const device = readDevice();
  return `<div class="setting-block reminder-settings"><h3>تذكير الجلسة</h3>
    <label class="reminder-time-label" for="reminder-time">الساعة في أيام التدريب</label>
    <input id="reminder-time" type="time" value="${/^([01]\d|2[0-3]):[0-5]\d$/.test(device.time) ? device.time : "18:00"}" ${configured() ? "" : "disabled"}>
    <p>حسب توقيت دمشق، بأيام التدريب فقط. لا يُرسل تذكير إضافي للتعويض.</p>
    <div class="reminder-actions">
      <button type="button" class="primary" data-action="reminder-save" ${device.id && configured() ? "" : "disabled"} ${device.id ? "" : "hidden"}>حفظ الموعد</button>
      <button type="button" class="secondary" data-action="reminder-test" ${device.enabled && configured() ? "" : "disabled"} ${device.id ? "" : "hidden"}>تجربة الإشعار</button>
      <div class="reminder-management">
        <button type="button" class="${device.id ? "text-btn" : "primary"}" data-action="reminder-enable" ${configured() ? "" : "disabled"}>${device.enabled ? "إعادة التفعيل" : "تفعيل التذكير"}</button>
        <button type="button" class="text-btn" data-action="reminder-disable" ${device.enabled ? "" : "disabled"} ${device.id ? "" : "hidden"}>إيقاف التذكير</button>
      </div>
    </div>
    <p id="reminder-status" role="status" aria-live="polite" aria-atomic="true"></p>
  </div>`;
}
function refreshReminders() {
  refreshReminderControls();
  const node = $("#reminder-status");
  if (configured() && typeof Notification !== "undefined" && Notification.permission === "denied") {
    if (node) node.textContent = "إشعارات الموقع محظورة. غيّر الإذن من إعدادات المتصفح لإعادة التفعيل.";
    return;
  }
  if (node) node.textContent = !configured() ? "التذكيرات تحتاج إكمال إعداد خدمة الإرسال. بقية التطبيق يعمل كالمعتاد." : (location.protocol === "file:" ? "التذكيرات تعمل عبر رابط الموقع المنشور، وليست متاحة في ملف المعاينة." : status) || (readDevice().enabled ? "التذكير مفعّل على هذا الجهاز؛ يحتاج اتصالًا بالإنترنت." : "التذكير غير مفعّل.");
}
function activationDialog() {
  if (!configured()) {
    setStatus("أكمل إعداد الخدمة أولًا.");
    return;
  }
  if (!supported()) {
    setStatus("افتح التطبيق عبر HTTPS في متصفح يدعم إشعارات الويب.");
    return;
  }
  const time = $("#reminder-time")?.value || readDevice().time;
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time || "")) {
    setStatus("اختر ساعة صحيحة للتذكير.");
    return;
  }
  showDialog(`${modalHead("تفعيل تذكير الجلسة")}
    <p>سيطلب المتصفح إذن الإشعارات. أدخل رمز التفعيل الخاص بك مرة واحدة لهذا الجهاز.</p>
    <div class="form-field"><label for="reminder-code">رمز التفعيل</label><input id="reminder-code" type="password" autocomplete="off"></div>
    <input id="reminder-chosen-time" type="hidden" value="${time}">
    <button class="primary full" data-action="reminder-confirm">السماح وتفعيل التذكير</button>
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
  const code = $("#reminder-code")?.value.trim(), time = $("#reminder-chosen-time")?.value;
  if (!code) {
    $("#activation-status").textContent = "أدخل رمز التفعيل.";
    return;
  }
  busy = true;
  let registered = null;
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") throw Error("لم يُمنح إذن الإشعارات. يمكنك تغييره من إعدادات الموقع في المتصفح.");
    $("#activation-status").textContent = "جارٍ تفعيل التذكير…";
    const config = await api("config", null, null, "GET");
    const registration = await navigator.serviceWorker.register("./sw.js", { scope: "./", updateViaCache: "none" });
    await Promise.race([navigator.serviceWorker.ready, new Promise((_, reject) => setTimeout(() => reject(Error("أغلق التطبيق وافتحه لتجهيز الإشعارات ثم أعد المحاولة.")), 15e3))]);
    if (registration.installing) {
      const installing = registration.installing;
      await Promise.race([
        new Promise((resolve) => installing.addEventListener("statechange", () => {
          if (["installed", "activated", "redundant"].includes(installing.state)) resolve();
        })),
        new Promise((_, reject) => setTimeout(() => reject(Error("أغلق التطبيق وافتحه بعد اكتمال التحديث.")), 15e3))
      ]);
    }
    if (registration.waiting) throw Error("التحديث جاهز. أغلق جميع نوافذ حركة وافتحه من جديد ثم فعّل التذكير.");
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
    toast("تم تفعيل التذكير. يمكنك تجربة الإشعار من الإعدادات.");
    setStatus("تم التفعيل وحفظ الموعد. جرّب إرسال إشعار للتأكد من وصوله.");
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
    const node = $("#activation-status");
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
    setStatus(device.enabled ? "الموعد والجدول متزامنان. الجلسة المنفّذة لن تُذكّر بها اليوم." : "التذكير متوقف.");
  } catch (error) {
    setStatus(`${error.message} ستُعاد المحاولة عند فتح التطبيق أو عودة الاتصال.`);
  } finally {
    syncing = false;
    if (queued) {
      queued = false;
      void syncReminders();
    }
  }
}
async function saveReminderTime() {
  const time = $("#reminder-time")?.value, device = readDevice();
  if (!device.id || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time || "")) {
    setStatus("فعّل التذكير واختر ساعة صحيحة أولًا.");
    return;
  }
  try {
    writeDevice({ ...device, time });
    await syncReminders(true);
  } catch {
    setStatus("تعذّر حفظ الوقت على الجهاز.");
  }
}
async function disableReminder() {
  const device = readDevice();
  try {
    const prefs = preferences({ ...device, enabled: false });
    await writeReminderGuard(prefs);
    writeDevice({ ...device, enabled: false });
    setStatus("أُوقف التذكير محليًا؛ جارٍ تحديث خدمة الإرسال.");
    await syncReminders(true);
  } catch {
    setStatus("تعذّر حفظ الإيقاف. يمكنك منع الإشعارات من إعدادات الموقع في المتصفح.");
  }
}
async function testReminder() {
  const device = readDevice();
  if (!device.enabled || !device.id) {
    setStatus("فعّل التذكير أولًا.");
    return;
  }
  if (busy) return;
  busy = true;
  try {
    await syncReminders(true);
    await api("test", device.token, { id: device.id });
    setStatus("قبلت خدمة الإرسال طلب التجربة. تحقق من ظهور الإشعار على الهاتف.");
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
    if (device.id && supported()) void writeReminderGuard(preferences(device)).catch(() => setStatus("تعذّر تحديث حالة التذكير المحلية."));
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
export {
  activateReminder,
  activationDialog,
  configureReminders,
  disableReminder,
  initReminders,
  preferences,
  refreshReminders,
  reminderSection,
  runReminderAction,
  saveReminderTime,
  setStatus,
  syncReminders,
  testReminder
};
