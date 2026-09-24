import { icon } from './icons.mjs';
import { pageHeading } from './page-heading.mjs';
import { content } from "../data/content.mjs";
import { esc } from "./html.mjs";
const $ = (s) => document.querySelector(s);
let libraryQuery = "";
const normalizeSearch = (text) => text.normalize("NFKD").replace(/[\u064B-\u065F\u0670ـ]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").toLowerCase();
const libraryName = (e) => e.id === "march" ? "مشي بالمكان" : e.name_ar;
const libraryGroups = [
  ["walk", "المشي والحركة الهوائية", "march cross-march side-step side-squat heel-touch step-jack cross-knee lateral-double lateral-double-arms heel-touch-arm hamstring-curl hamstring-curl-arms forward-back"],
  ["mobility", "المرونة والتهدئة", "shoulder-roll neck-turn-seated wall-slide thoracic-rotation-seated cat-cow neck-tilt-seated chest-open seated-breath"],
  ["legs", "تقوية الساقين والورك", "sit-stand chair-squat squat bridge wall-hinge supported-side-leg-raise calf-raise supported-split split-squat reverse-lunge single-bridge single-calf"],
  ["upper", "الدفع والسحب", "wall-push supported-row incline-push floor-push"],
  ["core", "التحكم بالجذع والبطن", "heel-slide bird-dog heel-tap dead-bug quadruped-leg partial-crunch reverse-crunch"],
  ["plank", "تمارين البلانك", "forearm-knee-plank forearm-plank knee-side-plank full-side-plank"],
  ["balance", "التوازن", "supported-tandem supported-single-balance"]
].map(([id, name, ids]) => ({ id, name, ids: ids.split(" ") }));
function library() {
  return `<section class="v-library">${pageHeading("مكتبة التمارين", `<span class="pill">${content.exercises.length} حركة</span>`)}<p class="library-intro">اختر فئة، ثم افتح التمرين لقراءة كيفية الأداء.</p><label class="v-search-label" for="search">البحث عن تمرين</label><input class="v-search" id="search" type="search" value="${esc(libraryQuery)}" placeholder="اسم التمرين أو الأداة أو الفئة"><p id="library-count" class="small muted" role="status"></p><div id="library-list">${libraryRows()}</div></section>`;
}
function filteredExercises() {
  const q = normalizeSearch(libraryQuery.trim());
  return content.exercises.filter((e) => normalizeSearch(e.name_ar + " " + e.id + " " + e.equipment + " " + libraryGroups.find((g) => g.ids.includes(e.id))?.name).includes(q)).sort((a, b) => libraryName(a).localeCompare(libraryName(b), "ar"));
}
function libraryCard(e) {
  return `<button class="exercise-card" data-action="instruction" data-id="${e.id}"><span class="v-library-icon" aria-hidden="true">${icon('motion')}</span><span class="exercise-caption"><strong dir="auto" data-fit-title>${esc(libraryName(e))}</strong>${e.id === "march" ? '<span class="v-library-note">هادئ · متدرج · نشيط · بطيء</span>' : ""}<small>${e.equipment === "لا شيء" ? "دون أدوات" : esc(e.equipment)}</small></span><span class="v-library-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="m14 6-6 6 6 6"/></svg></span></button>`;
}
function libraryRows() {
  const rows = filteredExercises();
  return libraryGroups.map((g) => {
    const items = rows.filter((e) => g.ids.includes(e.id));
    return items.length ? `<details class="v-library-group" ${libraryQuery.trim() ? "open" : ""}><summary><span>${g.name}</span><span class="v-group-count">${items.length}</span><svg class="v-group-chevron" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary><div class="library-grid">${items.map(libraryCard).join("")}</div></details>` : "";
  }).join("") || '<p class="v-library-empty">لا توجد نتائج. جرّب اسمًا آخر أو اسم الفئة.</p>';
}
function updateLibrary() {
  if (!$("#library-list")) return;
  $("#library-list").innerHTML = libraryRows();
  $("#library-count").textContent = `${filteredExercises().length} من ${content.exercises.length} حركة · حسب نوع الحركة`;
}
function searchLibrary(value) {
  libraryQuery = value;
  updateLibrary();
}
export {
  library,
  searchLibrary,
  updateLibrary
};
