import {
runtime
}
from '../core/store.js';
export const $ = s=>document.querySelector(s);
export const main = $('#main');
export const modal = $('#modal');
export const latin = s=>String(s??'').replace(/[٠-٩۰-۹]/g,c=>String(c.charCodeAt(0)-(c>='۰'?1776:1632)));
export const esc = s=>latin(s).replace(/[&<>"']/g,c=>({
'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}
[c]));
export const icons = {
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',moon:'<path d="M20 14a8 8 0 0 1-10-10 8 8 0 1 0 10 10Z"/>',settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>',home:'<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>',book:'<path d="M12 5v16M12 5Q7 2 2 4v15q5-2 10 2 5-4 10-2V4q-5-2-10 1Z"/>',history:'<path d="M4 8a9 9 0 1 1-1 7M4 3v5h5M12 7v5l3 2"/>',arrow:'<path d="m14 5-7 7 7 7M7 12h14"/>',check:'<path d="m5 12 4 4L19 6"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',play:'<path d="m8 4 12 8-12 8Z"/>',pause:'<path d="M8 5v14M16 5v14"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',coffee:'<path d="M4 8h12v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5ZM16 8h2a3 3 0 0 1 0 6h-2M6 3v2m5-2v2"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>'
}
;
export const icon = n=>`<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[n]||icons.info}</svg>`;
export function warn(text){
const w=$('#storage-warning');
w.hidden=false;
w.textContent=text;
}
export function toast(s){
const t=$('#toast');
t.textContent=s;
t.hidden=false;
clearTimeout(runtime.toastTimeout);
runtime.toastTimeout=setTimeout(()=>t.hidden=true,4200);
}
export function showDialog(content){
runtime.lastFocus=document.activeElement;
$('#modal-content').innerHTML=content;
if(!modal.open)modal.showModal();
}
export function closeDialog(){
modal.close();
if(runtime.lastFocus?.isConnected)runtime.lastFocus.focus();
}
export const modalHead = t=>`<div class="modal-head"><h2>${t}</h2><button class="icon-btn" data-action="close" aria-label="إغلاق">${icon('close')}</button></div>`;
