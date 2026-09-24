const {chromium}=require('playwright');const http=require('node:http');const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
(async()=>{
 const server=http.createServer((req,res)=>{if(req.url==='/test'){res.setHeader('Content-Type','text/html');return res.end('<!doctype html><title>Storage test</title>');}const file=path.resolve(root,'.'+req.url);if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type','text/javascript');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let browser;
 try{
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});const context=await browser.newContext();let page=await context.newPage();const url=`http://127.0.0.1:${server.address().port}/test`;await page.goto(url);
 const setup=async(page)=>page.evaluate(async()=>{const {openStorage}=await import('/js/infrastructure/workout-repository.mjs');const {WorkoutService}=await import('/js/application/workout-service.mjs');const {content}=await import('/js/data/content.mjs');window.repo=await openStorage({name:'haraka-test'});window.svc=new WorkoutService(repo,content);window.engine=await import('/js/domain/engine.mjs');});
 await setup(page);
 await page.evaluate(async()=>{await repo.saveSettings({program:'strength',level:1});await svc.start('strength-a-1',{id:'first',dateKey:'2026-09-23',now:1000});const s=await svc.resume();await svc.dispatch({type:'startTimer',stepId:s.snapshot.steps[0].id},1000);});
 await page.close();page=await context.newPage();await page.goto(url);await setup(page);
 const resumed=await page.evaluate(async()=>{const s=await svc.resume();await repo.saveSettings({program:'circuit',level:3});return {id:s.id,remaining:engine.remaining(s,101000),program:(await svc.resume()).snapshot.workout.program};});assert.deepEqual(resumed,{id:'first',remaining:0,program:'strength'});
 const other=await context.newPage();await other.goto(url);await setup(other);await other.evaluate(async()=>{window.stale=await svc.resume();});
 await page.evaluate(async()=>{const s=await svc.resume();await svc.dispatch({type:'elapsed',stepId:s.snapshot.steps[s.cursor].id},101000);});
 const conflict=await other.evaluate(async()=>{try{await repo.save(engine.reduceSession(stale,{type:'pause'},2000),stale.revision);return false;}catch(e){return e.message==='Session write conflict';}});assert.equal(conflict,true);
 const duplicate=await page.evaluate(async()=>{const s=await svc.resume();const command={type:'skip',stepId:s.snapshot.steps[s.cursor].id};await Promise.all([svc.dispatch(command,102000),svc.dispatch(command,102000)]);return (await svc.resume()).cursor;});assert.equal(duplicate,2);
 // Real IDB atomic active->history transition, not a mocked store.
 const finished=await page.evaluate(async()=>{let s=await svc.resume();while(s){await svc.dispatch({type:'skip',stepId:s.snapshot.steps[s.cursor].id},103000);s=await svc.resume();}let blocked=false;try{await svc.start('circuit-a-3',{id:'second',dateKey:'2026-09-23'});}catch(e){blocked=e.message==='Date already completed';}return {history:(await repo.listHistory()).length,blocked,active:!!await repo.getActive()};});assert.deepEqual(finished,{history:1,blocked:true,active:false});
 const stopped=await page.evaluate(async()=>{await svc.start('circuit-b-3',{id:'next',dateKey:'2026-09-24'});await svc.dispatch({type:'stop'});return (await repo.listHistory()).map(s=>s.status).sort();});assert.deepEqual(stopped,['completed','stopped']);
 console.log('PASS: real Chromium IndexedDB; page close/reopen; timer expiry; settings isolation; cross-tab conflict; double tap; atomic history; same-date guard; stop.');
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
