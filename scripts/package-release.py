import hashlib,json,pathlib,subprocess,zipfile
root=pathlib.Path(__file__).resolve().parents[1]
meta=json.loads((root/'release.json').read_text(encoding='utf-8-sig'))
out=root/'releases'/meta['version']
out.mkdir(parents=True,exist_ok=True)
subprocess.run(['node','scripts/build-extension.mjs'],cwd=root,check=True)
with zipfile.ZipFile(out/f"big-eye-extension-{meta['version']}.zip",'w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted((out/'extension').rglob('*')):
  if p.is_file(): z.write(p,p.relative_to(out/'extension'))
files=subprocess.check_output(['git','-c',f'safe.directory={root.as_posix()}','ls-files','-z'],cwd=root).decode().split('\0')
if not any(files): raise RuntimeError('Stage or commit the source files before packaging.')
with zipfile.ZipFile(out/f"big-eye-source-{meta['version']}.zip",'w',zipfile.ZIP_DEFLATED) as z:
 for name in files:
  if name and (root/name).is_file(): z.write(root/name,name)
web=root/'apps/web/dist'
if web.exists():
 with zipfile.ZipFile(out/f"big-eye-web-{meta['version']}.zip",'w',zipfile.ZIP_DEFLATED) as z:
  for p in sorted(web.rglob('*')):
   if p.is_file(): z.write(p,p.relative_to(web))
checks=[]
for p in sorted(out.glob('*.zip')):
 checks.append(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.name)
(out/'SHA256SUMS.txt').write_text('\n'.join(checks)+'\n')
print(out)
