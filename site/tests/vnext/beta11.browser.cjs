const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),shots=path.resolve(root,'../validation/beta11');fs.mkdirSync(shots,{recursive:true});
(async()=>{const server=http.createServer((req,res)=>{const file=path.join(root,new URL(req.url,'http://local').pathname==='/'?'index.html':new URL(req.url,'http://local').pathname);try{res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;try{
browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});const page=await browser.newPage({viewport:{width:393,height:852},serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.clock.setFixedTime(new Date('2026-09-24T12:00Z'));await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.locator('[data-action=onboard-next]').click();await page.locator('[data-action=onboard-save]').click();

const state=()=>page.evaluate(async()=>{const {openStorage}=await import('/js/infrastructure/workout-repository.mjs');const r=await openStorage();const s=await r.getSettings();r.close();return JSON.stringify(s);});
const before=await state();
await page.locator('[data-action=preview-all]').click();await page.locator('[data-action=browse-program][data-id=strength]').click();
for(const n of [2,3,1]) { await page.locator(`#level-tab-${n}`).click();assert.equal(await page.locator('[role=tab][aria-selected=true]').getAttribute('id'),`level-tab-${n}`);assert.equal(await page.locator('.v-detail-session').count(),3); }
await page.locator('#level-tab-1').press('ArrowLeft');assert.equal(await page.locator('#level-tab-2').getAttribute('aria-selected'),'true');
assert.equal(await state(),before,'preview tabs must never save settings');
await page.screenshot({path:path.join(shots,'details.png')});
await page.locator('[data-action=close]').click();
await page.locator('[data-view=library]').click();await page.locator('.v-library').waitFor();await page.waitForTimeout(80);
for(const width of [320,360,393,768]) {
 await page.setViewportSize({width,height:852});await page.locator('.v-library-group').evaluateAll(els=>els.forEach(e=>e.open=true));await page.waitForTimeout(100);
 const m=await page.locator('.exercise-card').evaluateAll(els=>els.map(e=>({height:e.getBoundingClientRect().height,overflow:e.scrollWidth>e.clientWidth+1,title:e.querySelector('strong').scrollHeight>e.querySelector('strong').clientHeight+1})));
 assert.ok(m.every(e=>!e.overflow&&!e.title),JSON.stringify({width,m}));assert.equal(new Set(m.map(e=>e.height)).size,1,`library card heights at ${width}`);
 if(width===393)await page.screenshot({path:path.join(shots,'library.png'),fullPage:true});
 const previewMetrics=await page.evaluate(async()=>{
 const {renderSessionPreview}=await import('/js/presentation/session-preview.mjs'),{compileWorkout}=await import('/js/domain/engine.mjs'),{content}=await import('/js/data/content.mjs');const failures=[];
 for(const w of content.workouts){document.querySelector('#main').innerHTML=renderSessionPreview(compileWorkout(content,w.id));await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 for(const e of document.querySelectorAll('.v-flow-work article')){const r=e.getBoundingClientRect();if(e.scrollWidth>e.clientWidth+1||[...e.children].some(c=>c.getBoundingClientRect().bottom>r.bottom+1))failures.push({id:w.id,text:e.innerText});}
 }return failures;});assert.deepEqual(previewMetrics,[],`all 45 previews at ${width}`);
 await page.locator('[data-view=library]').click();await page.locator('.v-library').waitFor();await page.waitForTimeout(80);
}
await page.setViewportSize({width:393,height:852});
await page.evaluate(()=>location.hash='preview-strength-c-3');await page.locator('.v-session-preview').waitFor();await page.waitForTimeout(100);await page.screenshot({path:path.join(shots,'preview.png')});
await page.locator('[data-action=preview-back]').click();await page.locator('.home-content').waitFor();await page.locator('[data-view=settings]').click();await page.locator('.v-settings').waitFor();assert.ok(await page.evaluate(()=>{const h=[...document.querySelectorAll('h2,h3')].map(e=>e.textContent);return h.findIndex(x=>x.includes('تذكير'))<h.indexOf('نسخة احتياطية');}));
assert.deepEqual(errors,[]);console.log('PASS: tabs/keyboard/no settings mutation; all 50 library cards and 45 previews at four widths; no clipped text; reminder ordering; no runtime errors.');
}finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
