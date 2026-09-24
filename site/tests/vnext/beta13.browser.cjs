const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),shots=path.resolve(root,'../validation/beta13');fs.mkdirSync(shots,{recursive:true});
(async()=>{const server=http.createServer((req,res)=>{const file=path.join(root,new URL(req.url,'http://local').pathname==='/'?'index.html':new URL(req.url,'http://local').pathname);try{res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});const page=await browser.newPage({viewport:{width:393,height:852},serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.clock.setFixedTime(new Date('2026-09-23T12:00Z'));await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.locator('[data-action=onboard-next]').click();await page.locator('[data-action=onboard-save]').click();

await page.locator('.home-content').waitFor();
const seed=await page.evaluate(async()=>{
 const {openStorage}=await import('/js/infrastructure/workout-repository.mjs'),{createSession,compileWorkout}=await import('/js/domain/engine.mjs'),{content}=await import('/js/data/content.mjs');const repo=await openStorage();
 const s=createSession(compileWorkout(content,'move-b-1'),{id:'open',dateKey:'2026-09-23',scheduledDate:'2026-09-22',now:Date.now()});
 await repo.transaction(['active','history'],'readwrite',async st=>{st('active').put(s,'current');for(const [id,date]of [['past','2026-09-15'],['week','2026-09-20']])st('history').put({...s,id,dateKey:date,scheduledDate:date,completedDate:date,status:'completed'},id);});repo.close();return true;});
const planUI=async(program,level)=>{await page.locator('[data-view=settings]').click();await page.locator('[data-action=settings-plan]').click();await page.locator(`[data-program=${program}]`).click();await page.locator(`[data-level="${level}"]`).click();await page.locator('#settings-form button[type=submit]').click();await page.locator('[data-timing=this-week]').waitFor();};
await planUI('strength',2);await page.screenshot({path:path.join(shots,'confirm.png')});await page.locator('[data-timing=this-week]').click();await page.locator('.v-makeup-card').waitFor();
assert.ok(await page.evaluate(()=>document.querySelector('.v-makeup-card').nextElementSibling.classList.contains('v-hero')));assert.match(await page.locator('.v-makeup-card').innerText(),/2026-09-22/);
for(const day of ['2026-09-20','2026-09-22','2026-09-24'])assert.match(await page.locator(`[data-day="${day}"]`).getAttribute('aria-label'),/تمرين/);
const read=()=>page.evaluate(async()=>{const {openStorage}=await import('/js/infrastructure/workout-repository.mjs');const repo=await openStorage();const result=await repo.exportData();repo.close();return result;});
let data=await read();assert.equal(data.active,null);assert.deepEqual(data.history.map(x=>x.id),['past']);assert.equal(data.settings.revisions.at(-1).effectiveFrom,'2026-09-20');await page.screenshot({path:path.join(shots,'makeup.png')});
await planUI('foundation',3);await page.locator('[data-timing=next-week]').click();await page.locator('.v-pending-plan').waitFor();data=await read();assert.equal(data.settings.revisions.at(-1).effectiveFrom,'2026-09-27');assert.deepEqual(data.history.map(x=>x.id),['past']);
await page.locator('[data-action=next-week]').click();await page.waitForTimeout(80);await page.locator('[data-day="2026-09-27"]').click();await page.waitForTimeout(80);assert.match(await page.locator('.v-hero').innerText(),/Foundation/);await page.locator('[data-action=today]').click();await page.waitForTimeout(80);
const before=JSON.stringify((await read()).settings);await page.locator('[data-action=preview-all]').click();await page.locator('[data-action=browse-program][data-id=strength]').click();
for(const width of [320,393,768]) {await page.setViewportSize({width,height:852});for(const level of [1,2,3])for(const session of ['A','B','C']){
 await page.locator(`#level-tab-${level}`).click();await page.locator(`#session-tab-${session}`).click();await page.locator('.v-flow-end').waitFor();
 assert.equal(await page.locator('.v-program-details .v-flow').count(),1);assert.equal(await page.locator('.v-program-details [data-action=preview]').count(),0);
 assert.ok(await page.locator('#modal').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
}if(width===393)await page.screenshot({path:path.join(shots,'explorer.png')});}
assert.equal(JSON.stringify((await read()).settings),before);
await page.locator('#modal [data-action=close]').click();await page.setViewportSize({width:393,height:852});await page.locator('.v-makeup-card [data-action=start]').click();await page.locator('#timer-button').click();await page.waitForTimeout(150);
assert.ok(await page.locator('#timer-button').evaluate(e=>e.classList.contains('timer-running')));await page.locator('#timer-button').click();await page.waitForFunction(()=>document.querySelector('#timer-button')?.textContent.includes('متابعة'));assert.ok(await page.locator('#timer-button').evaluate(e=>getComputedStyle(e,'::before').animationPlayState==='paused'));await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('#timer-button').evaluate(e=>getComputedStyle(e,'::before').display),'none');
const atomic=await page.evaluate(async()=>{
 const {openStorage}=await import('/js/infrastructure/workout-repository.mjs'),{WorkoutService}=await import('/js/application/workout-service.mjs'),{content}=await import('/js/data/content.mjs');const repo=await openStorage({name:'week-atomic-test'}),svc=new WorkoutService(repo,content);
 const plan={program:'move',level:1,schedule:[{day:0,session:'A'},{day:2,session:'B'},{day:4,session:'C'}]},settings={levels:{},revisions:[{...plan,effectiveFrom:'2026-09-20'}]};await repo.saveSettings(settings);await svc.start('move-b-1',{id:'keep',dateKey:'2026-09-23',scheduledDate:'2026-09-22',now:Date.now()});
 const pending=await svc.savePlan(settings,{...plan,program:'strength'},'2026-09-23','next-week');if((await repo.getActive())?.id!=='keep')throw Error('next week cleared current active');
 await svc.savePlan(pending,{...plan,program:'strength'},'2026-09-23','this-week');if((await repo.getActive())?.id!=='keep')throw Error('unchanged plan reset active');
 const before=JSON.stringify(await repo.exportData());let failed=false;
 try{await repo.savePlan({...pending,sound:'test-rollback'},{resetRange:{get start(){throw Error('injected transaction fault');},end:'2026-09-26'}});}catch{failed=true;}
 if(!failed||JSON.stringify(await repo.exportData())!==before)throw Error('transaction did not roll back');repo.close();return true;
});assert.ok(atomic);
assert.deepEqual(errors,[]);console.log('PASS: actual settings UI this/next week; immediate Wednesday calendar/makeup; past history preserved and active cleared; next week calendar; two tab groups across sizes without writes; wave pause/reduced motion.');
}finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
