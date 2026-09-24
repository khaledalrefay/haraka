import test from 'node:test';import assert from 'node:assert/strict';
import {schedulePlan,slotFor,opportunity,planFor,weekStart} from '../../js/domain/schedule.mjs';
const old={program:'move',level:1,schedule:[{day:0,session:'A'},{day:2,session:'B'},{day:4,session:'C'}],effectiveFrom:'2026-09-01'};
const settings={levels:{},revisions:[old]}, plan={...old,program:'strength',level:2};
test('Wednesday reset starts Sunday; retroactive calendar and nearest makeup; Thursday replaces makeup',()=>{
 const change=schedulePlan(settings,plan,'2026-09-23','this-week');assert.deepEqual(change.resetRange,{start:'2026-09-20',end:'2026-09-26'});
 for(const day of ['2026-09-20','2026-09-22','2026-09-24'])assert.equal(slotFor(change.settings,day).program,'strength');
 assert.equal(slotFor(change.settings,'2026-09-23'),null);assert.equal(opportunity(change.settings,[],'2026-09-23').date,'2026-09-22');
 assert.equal(opportunity(change.settings,[],'2026-09-24').kind,'scheduled');assert.equal(opportunity(change.settings,[{dateKey:'2026-09-23',scheduledDate:'2026-09-22'}],'2026-09-23'),null);
});
test('Next Sunday changes automatically, replacing pending revision without changing current week',()=>{
 const c=schedulePlan(settings,plan,'2026-09-23','next-week');assert.equal(c.resetRange,null);assert.equal(planFor(c.settings,'2026-09-26').program,'move');assert.equal(planFor(c.settings,'2026-09-27').program,'strength');
 const d=schedulePlan(c.settings,{...plan,level:3},'2026-09-24','next-week');assert.equal(d.settings.revisions.length,2);assert.equal(d.settings.revisions.at(-1).level,3);
 assert.equal(schedulePlan(d.settings,{...plan,level:3},'2026-09-24','this-week').settings,d.settings);
});
test('Sunday/year boundary and schedule-only reset',()=>{
 assert.equal(weekStart('2027-01-01'),'2026-12-27');
 const changed={...old,schedule:[{day:1,session:'A'},{day:3,session:'B'},{day:5,session:'C'}]};assert.ok(schedulePlan(settings,changed,'2026-09-23','this-week').resetRange);
 const sat={...settings,revisions:[{...old,schedule:[{day:2,session:'A'},{day:4,session:'B'},{day:6,session:'C'}]}]};assert.equal(opportunity(sat,[],'2026-09-27'),null);
});
