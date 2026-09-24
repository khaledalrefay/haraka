import json
from pathlib import Path
P=Path(__file__).resolve().parent.parent
A=json.loads((P/'content-source/audit.json').read_text()); E=json.loads((P/'content-source/exercises.json').read_text())
W=[]
for w in A['workouts']:
 events=w['events'];first=next(i for i,e in enumerate(events) if e['type']=='work' and e['context'] not in ['warmup','cooldown']);last=next(i for i,e in enumerate(events) if e['type']=='work' and e['context']=='cooldown')
 def literal(es,phase):
  out=[]
  for e in es:
   if e['type']=='rest':out.append(dict(type='rest',seconds=e['seconds'],reason=e['reason']))
   else:
    q=dict(type='work',**e['prescription'],side=e.get('side'),phase=phase)
    if q['exercise_id']=='march':q['pace']=('gentle' if w['program']=='Move' else 'progressive') if phase=='warmup' else ('decelerating' if w['program'] in ['Hybrid','Circuit'] else 'slow')
    out.append(q)
  return out
 # Expanded warmup sides are kept as explicit steps; only main blocks expand prescriptions.
 blocks=[dict(id='warmup',kind='literal',items=literal(events[:first],'warmup'))]
 prog=w['program'];ps=w['main'];heavy={'floor-push','reverse-lunge','single-bridge'}
 floor={'bridge','single-bridge','heel-slide','heel-tap','bird-dog','dead-bug','quadruped-leg','cat-cow','forearm-knee-plank','forearm-plank','knee-side-plank','full-side-plank','floor-push','partial-crunch','reverse-crunch'}
 main=[]
 for i,p in enumerate(ps):
  q={**p,'sideRest':10 if prog=='Move' else 20,'setRest':90 if prog in ['Strength','Hybrid'] and p['exercise_id'] in heavy else 60}
  if prog=='Move' and i<len(ps)-1:q['after']=30 if ((p['exercise_id'] in floor)!=(ps[i+1]['exercise_id'] in floor)) else 20
  if prog=='Move' and i==len(ps)-1:q['after']=30 if p['exercise_id'] in floor else 20
  if prog=='Circuit':q['after']=90 if p['exercise_id'] in heavy else 60
  if prog=='Foundation':q['after']=15 if i==len(ps)-1 else 60
  if prog=='Strength':q['after']=30 if i==len(ps)-1 else 60
  if prog=='Hybrid':q['after']=20 if p['block']=='aerobic' else 60
  main.append(q)
 if prog=='Circuit':blocks.append(dict(id='main',kind='repeat',rounds=2,between=90,finalRest=0,items=main))
 elif prog=='Hybrid':
  blocks.append(dict(id='strength',kind='sets',items=[p for p in main if p['block']=='main']))
  blocks.append(dict(id='aerobic',kind='repeat',rounds=2,between=45,finalRest=0,items=[p for p in main if p['block']=='aerobic']))
 else:blocks.append(dict(id='main',kind='sets',items=main))
 blocks.append(dict(id='cooldown',kind='literal',items=literal(events[last:],'cooldown')))
 W.append(dict(id=w['id'],program=w['program'].lower(),level=w['level'],session=w['session'],plannedMinutes=w['approved_minutes'],blocks=blocks))
C=dict(contentVersion='2.0.0-alpha.1',schemaVersion=1,exercises=E['exercises'],programs=[dict(id=p,levels=[dict(id=f'{p}-{l}',number=l,workouts=[w['id'] for w in W if w['program']==p and w['level']==l]) for l in [1,2,3]]) for p in ['move','foundation','strength','hybrid','circuit']],workouts=W)
(P/'site/js/data/content.mjs').write_text('export const content = '+json.dumps(C,ensure_ascii=False,indent=2)+';\n')

(P/'site/js/data/estimates.mjs').write_text('export const estimates = '+(P/'content-source/estimates.json').read_text().strip()+';\n')
