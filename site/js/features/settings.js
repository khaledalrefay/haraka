import { reminderSection, refreshReminders } from './reminders.js';
import { $, icon, showDialog, modalHead, toast } from '../shared/ui.js';
import { scheduleFor } from './schedule.js';
import { runtime } from '../core/store.js';
import { save } from '../core/storage.js';
import { dayNames } from '../shared/dates.js';
import { roundsLabel } from '../data/plans.js';
import { today } from './today.js';
import { preferencesSection } from './preferences.js';

export function theme() {
  const dark = document.documentElement.dataset.theme === 'dark';
  $('#theme-btn').innerHTML = icon(dark ? 'sun' : 'moon');
  $('#theme-btn').setAttribute('aria-label', dark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن');
}
export function guide() {
  showDialog(`${modalHead('قواعد البرنامج')}
    <p>ثلاث جلسات مختلفة نسبيًا للقوة والتحكم والحركة. البرنامج للحركة العامة، ولا يشخّص أو يعالج سبب الألم.</p>
    <ul class="note-list">
      <li>ثلاث جلسات أسبوعيًا؛ تختار أيامها وترتيبها من الإعدادات.</li><li>التعويض اختياري في أيام الراحة التالية للجلسة الفائتة، ويتوقف عند موعد الجلسة الجديدة.</li>
      <li>ابدأ بجولة للتعرّف على الحركات. يمكن اختيار جولتين عندما يبقى الأداء متحكمًا ومريحًا.</li>
      <li>الجولة مرور واحد على التمارين الأساسية. التسخين والتهدئة مرة واحدة مهما كان عدد الجولات.</li>
      <li>حتى 10 عدّات لمعظم الحركات. الحركات المتبادلة 10 بالمجموع: 5 لكل جهة. البلانك الجانبي 10 ثوانٍ لكل جهة.</li>
      <li>الراحة بين التمارين حسب اختيارك في الإعدادات، ودقيقة بين الجولتين. عند تبديل جهة الحركة خذ وقتك وابدأ يدويًا عندما تكون جاهزًا.</li>
      <li>لا توجد زيادة تلقائية للعدّات أو الجولات. جودة الأداء أهم من إكمال الرقم، ولا تحبس النفس.</li>
      <li>توقف عن الحركة التي تزيد الألم. إذا استمر الانزعاج أو أثّر على النوم، اطلب تقييمًا من مختص.</li>
      <li>تعلّم الحركات الجديدة مع مدرّب مؤهل أو شخص بالغ موثوق عند الحاجة. استخدم كرسيًا ثابتًا وسطحًا مثبتًا يتحمل الاتكاء.</li>
    </ul>
    <p class="plan-note">المدة المعروضة تقديرية بحسب الحركات والراحة وعدد الجولات؛ يمكن أن تزيد مع الشرح أو الراحة الإضافية.</p>`);
}
export function setDefaultRounds(rounds) {
  if (![1, 2].includes(rounds)) return;
  const previous = runtime.state.settings.rounds;
  runtime.state.settings.rounds = rounds;
  if (!save()) {
    runtime.state.settings.rounds = previous;
    toast('تعذّر حفظ الإعداد. بقي اختيارك السابق.');
    return;
  }
  if (runtime.view === 'today') today();
  settings();
  toast('حُفظ عدد الجولات الافتراضي. الجلسة الجارية تبقى كما بدأت.');
}
export function settings() {
  showDialog(`${modalHead('الإعدادات')}
    <div class="setting-block"><h3>أيام التدريب</h3><p>${[...scheduleFor()].sort((a,b)=>a.day-b.day).map(e=>`${dayNames[e.day]}: ${e.session}`).join(' · ')}</p><button class="secondary" data-action="edit-schedule">تعديل الأيام والترتيب</button></div>
    <div class="setting-block">
      <fieldset class="round-picker"><legend>عدد الجولات الافتراضي</legend>
        <div class="button-row">${[1, 2].map(n => `<button class="${runtime.state.settings.rounds === n ? 'primary' : 'secondary'}" data-default-rounds="${n}" aria-pressed="${runtime.state.settings.rounds === n}">${roundsLabel(n)}</button>`).join('')}</div>
      </fieldset>
      <p>يمكنك تغييره للجلسة الحالية قبل البدء. إكمال العدد الذي اخترته يُحسب جلسة مكتملة، سواء جولة واحدة أو جولتين.</p>
    </div>
    ${preferencesSection()}
    ${reminderSection()}
    <div class="setting-block"><h3>بياناتك على هذا الجهاز</h3><p>لا يوجد حساب أو مزامنة. احتفظ بنسخة احتياطية دوريًا.</p><div class="button-row"><button class="secondary" data-action="export">${icon('download')} تصدير نسخة</button><button class="secondary" data-action="import">استيراد نسخة</button></div></div>
    <div class="setting-block"><h3>تثبيت التطبيق</h3><button class="secondary" data-action="install-app">تثبيت حركة</button><p id="install-status" role="status"></p></div>
    <button class="text-btn" data-action="guide">قواعد البرنامج</button>`);
  window.HarakaPWA?.refresh();
  refreshReminders();
}
