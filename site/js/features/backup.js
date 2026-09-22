import {
runtime
}
from '../core/store.js';
import {
showDialog, modalHead, icon, esc
}
from '../shared/ui.js';
import {
pauseTimer
}
from './timer.js';
import {
dateKey
}
from '../shared/dates.js';
export function download(name,content){
if(runtime.backupUrl)URL.revokeObjectURL(runtime.backupUrl);
runtime.backupUrl=URL.createObjectURL(new Blob([content],{
type:'application/json'
}
));
showDialog(`${modalHead('نسختك الاحتياطية جاهزة')}<p class="plan-note">احفظ الملف في مكان آمن. إذا لم يسمح المتصفح بالتنزيل، انسخ النص واحتفظ به في ملف بامتداد .json.</p><a class="primary full" href="${runtime.backupUrl}" download="${name}">${icon('download')} تنزيل ملف JSON</a><details style="margin-top:18px"><summary>نسخ البيانات كنص</summary><div class="form-field"><label for="backup-text">بيانات النسخة</label><textarea id="backup-text" readonly dir="ltr">${esc(content)}</textarea><button class="secondary" data-action="copy-backup">نسخ النص</button></div></details>${runtime.pendingImport?'<button class="secondary full" style="margin-top:14px" data-action="confirm-import">استبدال البيانات بالنسخة المستوردة</button>':''}`);
}
export function exportData(){
pauseTimer();
if(runtime.rawBroken!==null){
download(`haraka-recovery-${dateKey()}.json`,runtime.rawBroken);
return;
}
download(`haraka-backup-${dateKey()}.json`,JSON.stringify({
app:'haraka',exportedAt:new Date().toISOString(),data:runtime.state
}
,null,2));
}
