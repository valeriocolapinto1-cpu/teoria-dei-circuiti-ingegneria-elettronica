import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = new URL('../', import.meta.url).pathname;
const pages = (d = root) => readdirSync(d).flatMap((f) => { const p = join(d, f); if (['node_modules', '.git', 'tests', 'tools', 'sources-private', '_site'].includes(f)) return []; return statSync(p).isDirectory() ? pages(p) : p.endsWith('.html') ? [p] : []; });

test('CSP: ogni pagina ha una Content-Security-Policy compatibile con KaTeX e con i provider AI, senza unsafe-eval né script inline', () => {
  for (const p of pages()) {
    const s = readFileSync(p, 'utf8');
    const m = /http-equiv="Content-Security-Policy" content="([^"]+)"/.exec(s);
    assert.ok(m, 'CSP mancante in ' + p);
    const csp = m[1];
    assert.ok(!/unsafe-eval/.test(csp), p);
    assert.ok(!/script-src[^;]*unsafe-inline/.test(csp), p);
    assert.match(csp, /object-src 'none'|default-src 'none'/);
    if (!p.endsWith('404.html')) {
      assert.match(csp, /script-src 'self';/);
      assert.ok(!/cdnjs|cloudflare/.test(csp), 'nessun CDN nella CSP');
      assert.match(csp, /font-src 'self'/); // KaTeX e Geist locali
      assert.match(csp, /connect-src 'self' https:/); // chiamate al provider AI scelto
    }
  }
});

// Il sito si è spostato su Study Hub: le pagine sono rimandi e il service worker si disattiva.
test('manifest PWA valido e icona presente', () => {
  const m = JSON.parse(readFileSync(join(root, 'manifest.webmanifest'), 'utf8'));
  for (const k of ['name', 'short_name', 'start_url', 'display', 'icons']) assert.ok(m[k], k);
  for (const i of m.icons) assert.ok(existsSync(join(root, i.src)), i.src);
});

test('service worker: kill switch che svuota le cache e si deregistra', () => {
  const sw = readFileSync(join(root, 'sw.js'), 'utf8');
  assert.match(sw, /caches\.delete/);
  assert.match(sw, /registration\.unregister\(\)/);
  assert.ok(!/addEventListener\('fetch'/.test(sw), 'nessuna intercettazione delle richieste');
});

test('ogni pagina rimanda a Study Hub (refresh, canonical, link visibile)', () => {
  const HUB = 'https://valeriocolapinto1-cpu.github.io/study-hub/it/';
  for (const p of pages()) {
    const s = readFileSync(p, 'utf8');
    const target = /<link rel="canonical" href="([^"]+)">/.exec(s)?.[1];
    assert.ok(target && target.startsWith(HUB), 'canonical in ' + p);
    assert.ok(s.includes(`content="0; url=${target}"`), 'refresh in ' + p);
    assert.ok(s.includes(`<a href="${target}">`) && /Il sito si è spostato/.test(s), 'link visibile in ' + p);
  }
  const studio = readFileSync(join(root, 'assets/js/rimando.js'), 'utf8');
  const ids = readdirSync(join(root, 'data/studio')).map((f) => f.replace(/\.json$/, ''));
  assert.equal(ids.length, 49);
  for (const id of ids) assert.ok(studio.includes(`"${id}"`), 'argomento senza rimando: ' + id);
});

test('registrazione del service worker non obbligatoria: protetta da try/catch', () => {
  const app = readFileSync(join(root, 'assets/js/app.js'), 'utf8');
  assert.match(app, /function registerSW\(\)[\s\S]*try[\s\S]*catch/);
  assert.match(app, /\.catch\(\(\) => \{\}\)/);
});

test('tutti i percorsi nelle pagine sono relativi (compatibili con https://utente.github.io/repo/)', () => {
  for (const p of pages()) {
    const s = readFileSync(p, 'utf8');
    for (const m of s.matchAll(/(?:href|src)="(\/[^"/][^"]*)"/g)) assert.fail(`${p}: percorso assoluto ${m[1]}`);
  }
  for (const f of ['assets/js/ui.js']) assert.match(readFileSync(join(root, f), 'utf8'), /new URL\('\.\.\/\.\.\/', import\.meta\.url\)/);
  assert.ok(existsSync(join(root, '.nojekyll')) && existsSync(join(root, '404.html')));
});

test('check-links: nessun link interno rotto', () => {
  execFileSync('node', [join(root, 'tools/check-links/check.mjs')], { stdio: 'pipe' });
});
