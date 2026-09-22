const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
let guard, displayed=[],clicked=false,focused=false;
const events={};const now=Date.parse('2026-09-20T15:00:00Z');
class Clock extends Date{constructor(...args){super(...(args.length?args:[now]))}static now(){return now}}
const indexedDB={open(){const request={};queueMicrotask(()=>{request.result={createObjectStore(){},close(){},transaction(){return {objectStore(){return {get(){const read={};queueMicrotask(()=>{read.result=guard;read.onsuccess()});return read}}}}}};request.onsuccess()});return request}};
const context={Date:Clock,Intl,URL,indexedDB,self:{addEventListener:(n,f)=>events[n]=f,registration:{scope:'https://site.test/haraka/',showNotification:async(title,options)=>displayed.push({title,options})},clients:{matchAll:async()=>[{url:'https://site.test/haraka/#history',navigate:async u=>{assert.equal(u,'https://site.test/haraka/#today');clicked=true},focus:async()=>focused=true}],openWindow:async()=>{throw Error('should focus existing')}}}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../push-handler.js'),'utf8'),context);
async function push(data){let task;events.push({data:{json:()=>data},waitUntil:p=>task=p});await task}
(async()=>{guard={enabled:true,timezone:'Asia/Damascus',entries:[{day:0,session:'C'}],doneKeys:[],skipDates:[]};const data={title:'حركة',body:'تجربة',expiresAt:now+300000,day:'2026-09-20',session:'C',occurrence:'2026-09-20:C'};
await push(data);assert.equal(displayed.length,1);assert.equal(displayed[0].options.tag,'haraka-2026-09-20');
guard.doneKeys=[data.occurrence];await push(data);assert.equal(displayed.length,1);
guard.doneKeys=[];guard.skipDates=[data.day];await push(data);assert.equal(displayed.length,1);
guard.skipDates=[];guard.enabled=false;await push({...data,test:true});assert.equal(displayed.length,1);
guard.enabled=true;await push({...data,expiresAt:now-1});await push({...data,day:'2026-09-19'});await push({...data,session:'A'});assert.equal(displayed.length,1);
await push({...data,test:true});assert.equal(displayed.length,2);
let click;events.notificationclick({notification:{close(){}},waitUntil:p=>click=p});await click;assert(clicked&&focused);
console.log('PASS: push display and local completed/disabled/expired/wrong-day/wrong-session suppression; test message; click focus.');})().catch(e=>{console.error(e);process.exitCode=1});
