import { mkdir, cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const out = new URL('dist/', root);
if (path.resolve(fileURLToPath(out)) !== path.join(path.resolve(fileURLToPath(root)), 'dist')) throw new Error('Ungültiges Ausgabeverzeichnis');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'data.js', 'matching.js', 'assets']) {
  await cp(new URL(file, root), new URL(file, out), { recursive: true });
}
await cp(new URL('.nojekyll', root), new URL('.nojekyll', out));
console.log('Fertig: dist/ — statische Dateien, ohne Laufzeit-Abhängigkeiten.');
