/* Native browser promotion stays enabled; install UI exists only in settings. */
(() => {
  'use strict';
  let deferred=null,installed=false,busy=false,message='',workerError=false;
  const display=window.matchMedia('(display-mode: standalone)');
  const isInstalled=()=>installed||display.matches||navigator.standalone===true;
  function refresh(){
    const button=document.querySelector('[data-action="install-app"]');
    const status=document.querySelector('#install-status');
    if(!button||!status)return;
    button.disabled=isInstalled()||busy;
    button.textContent=isInstalled()?'التطبيق مثبّت':busy?'جارٍ فتح التثبيت…':'تثبيت حركة';
    status.textContent=isInstalled()?'تستخدم حركة كتطبيق مستقل.':message||(
      !window.isSecureContext?'التثبيت يحتاج فتح الموقع عبر HTTPS.':
      deferred?'التثبيت متاح من المتصفح.':workerError?'تعذّر تجهيز ملفات التطبيق. تحقق من الاتصال وحدّث الصفحة.':
      'إذا لم تظهر نافذة التثبيت، افتح الموقع في Chrome واستخدم خيار تثبيت التطبيق من قائمته.');
  }
  window.addEventListener('beforeinstallprompt',event=>{
    // Do not cancel the browser's own promotion.
    deferred=event;message='';refresh();
  });
  window.addEventListener('appinstalled',()=>{installed=true;deferred=null;busy=false;message='';refresh();});
  display.addEventListener?.('change',refresh);
  async function install(){
    if(isInstalled()||busy)return;
    if(!deferred){message=window.isSecureContext?
      'لم يُتح المتصفح نافذة التثبيت بعد. افتح الرابط مباشرة في Chrome، تفاعل مع الصفحة، ثم جرّب مجددًا أو اختر تثبيت التطبيق من قائمة Chrome.':
      'افتح رابط الموقع عبر HTTPS لتثبيت التطبيق.';refresh();return;}
    const event=deferred;deferred=null;busy=true;message='';refresh();
    try{
      const result=await event.prompt();
      const choice=result||await event.userChoice;
      message=choice?.outcome==='accepted'?'تم قبول طلب التثبيت؛ انتظر اكتماله من المتصفح.':'تم إغلاق طلب التثبيت. يمكنك المحاولة من قائمة Chrome.';
    }catch{message='لم يتمكّن المتصفح من فتح التثبيت. جرّب خيار تثبيت التطبيق في قائمة Chrome.';}
    finally{busy=false;refresh();}
  }
  window.HarakaPWA={install,refresh};
  if(location.protocol !== 'file:' && 'serviceWorker' in navigator&&window.isSecureContext){
    window.addEventListener('load',()=>{
      navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'})
        .then(()=>{workerError=false;refresh();})
        .catch(error=>{workerError=true;refresh();console.warn('Haraka offline setup unavailable:',error);});
    },{once:true});
  }
})();
