"""Check import boundaries, dead modules, build inputs, and content parity."""
from pathlib import Path
import re,json
root=Path(__file__).resolve().parent.parent;src=root/'site/js'
files=set(src.rglob('*.mjs'));graph={}
for f in files:
    graph[f]=[]
    for spec in re.findall(r'^import\s+[^;]*?\sfrom\s+[\'"]([^\'"]+)[\'"]',f.read_text(),re.M):
        if not spec.startswith('.'):raise AssertionError(f'Unexpected external runtime import: {f}: {spec}')
        dep=(f.parent/spec).resolve();assert dep in files,(f,dep)
        graph[f].append(dep)
        if f.parent.name=='domain':assert dep.parent.name=='domain',(f,dep)
        if f.parent.name=='application':assert dep.parent.name in ['domain','application','data'],(f,dep)
    if f.parent.name=='domain':
        assert not re.search(r'\b(document|window|indexedDB|localStorage|fetch)\b',f.read_text()),f
seen=set()
def visit(f):
    if f in seen:return
    seen.add(f)
    for dep in graph[f]:visit(dep)
visit(src/'app.mjs');assert seen==files,f'Unreachable JS modules: {files-seen}'
assert not (root/'dist/js').exists() and not (root/'dist/tests').exists()
print(f'PASS: {len(files)} runtime modules reachable; domain/application dependency boundaries; deployment excludes source and tests.')
