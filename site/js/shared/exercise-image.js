import { esc } from './ui.js';
export function exerciseImage(e) {
 return `<figure class="exercise-illustration"><img data-exercise-image src="assets/exercise-images/${esc(e.id)}.jpg" alt="${esc(e.name)}" width="1024" height="572"><figcaption class="small muted" hidden></figcaption></figure>`;
}
export function bindExerciseImages() {
 document.addEventListener('error', event => {
 const img = event.target;
 if (!img?.matches?.('[data-exercise-image]')) return;
 img.hidden = true;
 const caption = img.parentElement?.querySelector('figcaption');
 if (caption) { caption.hidden=false; caption.textContent='تعذّر تحميل الصورة؛ شرح الأداء متاح من أيقونة المعلومات.'; }
 }, true);
}
