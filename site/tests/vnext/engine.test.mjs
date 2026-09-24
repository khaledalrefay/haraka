import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {content} from '../../js/data/content.mjs';
import {compileWorkout,createSession,reduceSession,remaining} from '../../js/domain/engine.mjs';
const audit=JSON.parse(fs.readFileSync(new URL('../../../content-source/audit.json',import.meta.url)));
test('45 workouts compile with every work dose, side, pause and rest matching audited sequence',()=>{
 assert.equal(content.workouts.length,45);assert.equal(content.exercises.length,50);
 for(const w of audit.workouts){const actual=compileWorkout(content,w.id).steps;
  const norm=s=>s.type==='rest'?['rest',s.seconds]:['work',s.exerciseId,s.target,s.unit,s.sides,s.side||null,s.pauseSeconds];
  const expected=w.events.map(e=>e.type==='rest'?['rest',e.seconds]:['work',e.prescription.exercise_id,e.prescription.target,e.prescription.unit,e.prescription.sides,e.side||null,e.prescription.pause_seconds||0]);
  assert.deepEqual(actual.map(norm),expected,w.id);
 }
});
test('Circuit is exactly two rounds and Hybrid strength is not repeated',()=>{
 const c=compileWorkout(content,'circuit-a-3').steps.filter(s=>s.type==='work'&&s.block==='main');assert.equal(Math.max(...c.map(s=>s.round)),2);assert.equal(c.filter(s=>s.station===1).length,2);
 const h=compileWorkout(content,'hybrid-a-3').steps;assert.equal(h.filter(s=>s.type==='work'&&s.block==='aerobic').length,6);assert.equal(h.filter(s=>s.type==='work'&&s.exerciseId==='squat'&&s.block==='strength').length,2);
});
test('timer resume, pause, stale taps and immutable snapshot',()=>{
 const snapshot=compileWorkout(content,'strength-a-1');let s=createSession(snapshot,{id:'s',dateKey:'2026-09-23',now:0});snapshot.steps[0].target=999;assert.equal(s.snapshot.steps[0].target,90);
 const stepId=s.snapshot.steps[0].id;s=reduceSession(s,{type:'startTimer',stepId},1000);assert.equal(remaining(s,31000),60000);
 s=reduceSession(s,{type:'pause'},31000);assert.equal(remaining(s,99999),60000);
 s=reduceSession(s,{type:'startTimer'},100000);assert.equal(remaining(s,170000),0);
 s=reduceSession(s,{type:'elapsed',stepId},170000);assert.equal(s.cursor,1);
 const duplicate=reduceSession(s,{type:'elapsed',stepId},170001);assert.equal(duplicate.cursor,1);
 s=reduceSession(s,{type:'extendRest',seconds:15},170002);assert.equal(remaining(s),30000);
});
test('manual reps do not acquire a timer and all 45 sessions finish',()=>{
 for(const w of content.workouts){let s=createSession(compileWorkout(content,w.id),{id:w.id,dateKey:'2026-09-23',now:0});while(s.status==='active'){
  const step=s.snapshot.steps[s.cursor];if(step.type==='work'&&step.unit!=='seconds'){assert.equal(reduceSession(s,{type:'startTimer'},0).timer,null);s=reduceSession(s,{type:'done',stepId:step.id},0);}else s=reduceSession(s,{type:'skip',stepId:step.id},0);
 }assert.equal(s.status,'completed');assert.equal(s.results.length,s.snapshot.steps.length);}
});
