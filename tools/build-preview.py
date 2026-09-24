"""Build classic-script and standalone preview. Run after npm install in site/."""
from pathlib import Path
import subprocess,base64,re,argparse,hashlib,json
p=argparse.ArgumentParser();p.add_argument('--esbuild');a=p.parse_args()
root=Path(__file__).resolve().parent.parent;site=root/'site'
(root/'validation').mkdir(exist_ok=True)
version=json.loads((site/'package.json').read_text())['version']
(site/'js/data/version.mjs').write_text('export const APP_VERSION = '+json.dumps(version)+';\n')
if a.esbuild:
    subprocess.run([a.esbuild,'js/app.mjs','--bundle','--format=iife','--target=es2020','--metafile='+str(root/'validation/build-inputs.json'),'--outfile=app.bundle.js'],cwd=site,check=True)
else:
    # Node API avoids platform-specific .cmd launchers on Windows.
    script="const fs=require('node:fs');const result=require('esbuild').buildSync({entryPoints:['js/app.mjs'],bundle:true,format:'iife',target:'es2020',outfile:'app.bundle.js',metafile:true});fs.writeFileSync(process.argv[1],JSON.stringify(result.metafile,null,2));"
    subprocess.run(['node','-e',script,str(root/'validation/build-inputs.json')],cwd=site,check=True)
s=(site/'index.html').read_text();css='\n'.join((site/f'css/{n}.css').read_text() for n in ['tokens','base','components','app'])
for name in ['tajawal-regular.ttf','tajawal-bold.ttf']:css=css.replace('../assets/fonts/'+name,'data:font/ttf;base64,'+base64.b64encode((site/'assets/fonts'/name).read_bytes()).decode())
s=re.sub(r'<link rel="stylesheet"[^>]+>','',s).replace('</head>','<style>'+css+'</style></head>')
s=s.replace('assets/icon.svg','data:image/svg+xml;base64,'+base64.b64encode((site/'assets/icon.svg').read_bytes()).decode())
s=s.replace('<script src="config.js"></script>','<script>'+(site/'config.js').read_text()+'</script>').replace('<script defer src="pwa.js"></script>','<script>'+(site/'pwa.js').read_text()+'</script>').replace('<link rel="manifest" href="manifest.webmanifest">','')
bundle=(site/'app.bundle.js').read_text().replace('assets/exercise-images/march.jpg','data:image/jpeg;base64,'+base64.b64encode((site/'assets/exercise-images/march.jpg').read_bytes()).decode())
s=s.replace('<script defer src="app.bundle.js"></script>','').replace('</body>','<script>'+bundle.replace('</script','<\\/script')+'</script></body>')
(root/'Haraka-Preview.html').write_text(s)

# Every shell change creates a distinct atomic offline cache generation.
sw=site/'sw.js';worker=sw.read_text();paths=json.loads(re.search(r'const CORE = (\[.*?\])\.map',worker,re.S).group(1));digest=hashlib.sha256()
for name in paths:
    if name=='./':name='index.html'
    digest.update(name.encode());digest.update((site/name).read_bytes())
worker=re.sub(r"const VERSION = '[^']+';", "const VERSION = 'release-"+version+"-"+digest.hexdigest()[:12]+"';",worker);sw.write_text(worker)

# Deployment contains only the static runtime shell, never sources/tests/artwork.
import shutil
out=root/'dist'
if out.exists():shutil.rmtree(out)
for name in sorted(set(['index.html' if n=='./' else n for n in paths]+['sw.js','_headers','LICENSE.txt','assets/fonts/OFL.txt'])):
    dest=out/name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(site/name,dest)
