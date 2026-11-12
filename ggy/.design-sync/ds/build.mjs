#!/usr/bin/env node
// Prebuild for design-sync: turns the GGY Next.js site into a package-shaped
// dist the design-sync converter can consume. The website itself is untouched;
// everything is written to ggy/.ds-dist/ (gitignored).
//
//   .ds-dist/index.js      ESM bundle of .design-sync/ds/index.ts (react external)
//   .ds-dist/types/        .d.ts tree (tsc, aliases rewritten to relative paths)
//   .ds-dist/styles.css    Tailwind v4 build of the site's own CSS + component
//                          CSS + @font-face for the brand fonts
//   .ds-dist/fonts/        Gambetta, Switzer (app/fonts) + Anek (fontsource)
//
// Photographs referenced as "/images/…" are downscaled (sips) and inlined as
// data URLs: designs built in claude.ai/design have no /public to serve them.
//
// Run from ggy/:  node .design-sync/ds/build.mjs
// Needs the converter deps staged in .ds-sync/ (esbuild, @tailwindcss/cli,
// @fontsource-variable/anek-*), see .design-sync/NOTES.md.

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, join, relative, resolve } from 'node:path';

const ROOT = resolve('.');
if (!existsSync(join(ROOT, 'app/globals.css'))) { console.error('run from ggy/'); process.exit(1); }
const DS = join(ROOT, '.design-sync/ds');
const OUT = join(ROOT, '.ds-dist');
const SYNC = join(ROOT, '.ds-sync');
const req = createRequire(join(SYNC, 'package.json'));
const { build } = req('esbuild');

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'fonts'), { recursive: true });

// -- 1. photographs -> downscaled jpeg data URLs -----------------------------
const IMG_DIR = join(ROOT, 'public/images');
const IMG_CACHE = join(ROOT, '.design-sync/.cache/img');
mkdirSync(IMG_CACHE, { recursive: true });
const dataUrls = new Map();
function dataUrlFor(webPath) {
  if (dataUrls.has(webPath)) return dataUrls.get(webPath);
  const src = join(ROOT, 'public', webPath);
  if (!existsSync(src)) { console.error(`  ! image missing: ${webPath}`); return null; }
  const isPng = src.endsWith('.png');
  const small = webPath.includes('/map/') || isPng;
  const out = join(IMG_CACHE, webPath.replace(/[\/]/g, '__'));
  if (!existsSync(out) || statSync(out).mtimeMs < statSync(src).mtimeMs) {
    if (isPng) execFileSync('sips', ['-Z', '360', src, '--out', out], { stdio: 'ignore' });
    // sips' numeric quality is ignored on some macOS builds; "low" is ~q50 and
    // reads clean at these sizes (checked by eye, Nov 2026).
    else execFileSync('sips', ['-Z', small ? '720' : '1280', '-s', 'format', 'jpeg', '-s', 'formatOptions', 'low', src, '--out', out], { stdio: 'ignore' });
  }
  const url = `data:${isPng ? 'image/png' : 'image/jpeg'};base64,${readFileSync(out).toString('base64')}`;
  dataUrls.set(webPath, url);
  return url;
}
void IMG_DIR;

const inlineImages = {
  name: 'ggy-inline-images',
  setup(b) {
    b.onLoad({ filter: /\.(tsx?|jsx?)$/ }, (args) => {
      if (args.path.includes('/node_modules/')) return undefined;
      let src = readFileSync(args.path, 'utf8');
      if (!src.includes('/images/')) return undefined;
      src = src.replace(/(["'])(\/images\/[^"'\s]+\.(?:jpe?g|png|webp))\1/g, (m, q, p) => {
        const u = dataUrlFor(p);
        return u ? JSON.stringify(u) : m;
      });
      const ext = args.path.split('.').pop();
      return { contents: src, loader: ext === 'js' ? 'jsx' : ext };
    });
  },
};

// -- 2. JS bundle ----------------------------------------------------------
const alias = {
  name: 'ggy-alias',
  setup(b) {
    b.onResolve({ filter: /^next\/image$/ }, () => ({ path: join(DS, 'next-image.tsx') }));
    b.onResolve({ filter: /^@ds\// }, (a) => ({ path: resolveTs(join(DS, a.path.slice(4))) }));
    b.onResolve({ filter: /^@\// }, (a) => ({ path: resolveTs(join(ROOT, a.path.slice(2))) }));
  },
};
function resolveTs(stem) {
  for (const e of ['', '.tsx', '.ts', '.jsx', '.js', '.json', '/index.tsx', '/index.ts']) {
    const p = stem + e;
    if (existsSync(p) && statSync(p).isFile()) return p;
  }
  throw new Error(`cannot resolve ${stem}`);
}
const r = await build({
  entryPoints: [join(DS, 'index.ts')],
  outfile: join(OUT, 'index.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  jsx: 'automatic',
  external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client'],
  nodePaths: [join(ROOT, 'node_modules')],
  plugins: [alias, inlineImages],
  loader: { '.svg': 'dataurl', '.png': 'dataurl', '.woff2': 'dataurl' },
  define: { 'process.env.NODE_ENV': '"production"', 'process.env': '{}' },
  logLevel: 'error',
  metafile: true,
});
void r;
console.error(`  index.js: ${(statSync(join(OUT, 'index.js')).size / 1024).toFixed(0)} KB, ${dataUrls.size} photographs inlined`);

// -- 3. types ----------------------------------------------------------------
const tsc = join(ROOT, 'node_modules/.bin/tsc');
try {
  execFileSync(tsc, ['-p', join(DS, 'tsconfig.json')], { stdio: 'pipe' });
} catch (e) {
  // Type errors in the site don't block declaration emit; show them.
  const msg = String(e.stdout ?? '') + String(e.stderr ?? '');
  if (msg.trim()) console.error(`  tsc reported:\n${msg.split('\n').slice(0, 20).join('\n')}`);
}
const TYPES = join(OUT, 'types');
// Hand-written .d.ts for the React Bits .jsx files aren't emitted by tsc.
for (const f of readdirSync(join(ROOT, 'components'))) {
  if (f.endsWith('.d.ts')) cpSync(join(ROOT, 'components', f), join(TYPES, 'components', f));
}
// Rewrite @/… and @ds/… aliases to relative paths so ts-morph resolves them.
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (!e.name.endsWith('.d.ts')) continue;
    const txt = readFileSync(p, 'utf8').replace(/(from\s+|import\()(["'])(@ds|@)\/([^"']+)\2/g, (m, pre, q, a, rest) => {
      const target = a === '@ds' ? join(TYPES, '.design-sync/ds', rest) : join(TYPES, rest);
      let rel = relative(dirname(p), target);
      if (!rel.startsWith('.')) rel = './' + rel;
      return `${pre}${q}${rel}${q}`;
    });
    writeFileSync(p, txt);
  }
})(TYPES);
writeFileSync(join(TYPES, 'index.d.ts'), 'export * from "./.design-sync/ds/index";\n');

// -- 4. CSS: tailwind build of the site sheets + component CSS + fonts --------
const twOut = join(OUT, '.tw.css');
execFileSync(join(SYNC, 'node_modules/.bin/tailwindcss'), ['-i', join(DS, 'styles.src.css'), '-o', twOut], { cwd: ROOT, stdio: 'pipe' });
const compCss = existsSync(join(OUT, 'index.css')) ? readFileSync(join(OUT, 'index.css'), 'utf8') : '';
rmSync(join(OUT, 'index.css'), { force: true });

const fontFaces = [];
const face = (family, file, weight, style = 'normal', extra = '') => {
  fontFaces.push(`@font-face{font-family:"${family}";src:url(./fonts/${basename(file)}) format("woff2");font-weight:${weight};font-style:${style};font-display:swap;${extra}}`);
  cpSync(file, join(OUT, 'fonts', basename(file)));
};
const F = join(ROOT, 'app/fonts');
face('Gambetta', join(F, 'Gambetta-Light.woff2'), 300);
face('Gambetta', join(F, 'Gambetta-LightItalic.woff2'), 300, 'italic');
face('Gambetta', join(F, 'Gambetta-Regular.woff2'), 400);
face('Gambetta', join(F, 'Gambetta-Italic.woff2'), 400, 'italic');
face('Gambetta', join(F, 'Gambetta-Medium.woff2'), 500);
face('Switzer', join(F, 'Switzer-Regular.woff2'), 400);
face('Switzer', join(F, 'Switzer-Medium.woff2'), 500);
face('Switzer', join(F, 'Switzer-Semibold.woff2'), 600);
const FS = join(SYNC, 'node_modules/@fontsource-variable');
// Unicode ranges from fontsource's own wdth.css.
const ranges = (pkg, subset) => {
  const css = readFileSync(join(FS, pkg, 'wdth.css'), 'utf8');
  const m = new RegExp(`${pkg}-${subset}-wdth-normal\\.woff2\\)[^;]*;\\s*unicode-range:\\s*([^;]+);`).exec(css);
  return m ? `unicode-range:${m[1]};` : '';
};
const anek = (pkg, family, subsets) => {
  for (const s of subsets) face(family, join(FS, pkg, 'files', `${pkg}-${s}-wdth-normal.woff2`), '100 800', 'normal', `font-stretch:75% 125%;${ranges(pkg, s)}`);
};
anek('anek-latin', 'Anek Latin', ['latin', 'latin-ext']);
anek('anek-devanagari', 'Anek Devanagari', ['devanagari']);
anek('anek-gujarati', 'Anek Gujarati', ['gujarati']);
// next/font sets these variables on <html>; the design system sets them on :root.
const fontVars = `:root{--font-gambetta:"Gambetta";--font-switzer:"Switzer";--font-anek-latin:"Anek Latin";--font-anek-devanagari:"Anek Devanagari";--font-anek-gujarati:"Anek Gujarati"}`;

writeFileSync(join(OUT, 'styles.css'), [
  '/* GGY design system: site stylesheet (Tailwind build of app/*.css), component CSS, brand fonts. */',
  fontFaces.join('\n'),
  fontVars,
  readFileSync(twOut, 'utf8'),
  '/* component CSS (React Bits pieces) */',
  compCss,
].join('\n'));
rmSync(twOut, { force: true });
console.error(`  styles.css: ${(statSync(join(OUT, 'styles.css')).size / 1024).toFixed(0)} KB, ${fontFaces.length} @font-face`);

writeFileSync(join(OUT, 'package.json'), JSON.stringify({
  name: 'ggy',
  version: JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version,
  private: true,
  module: 'index.js',
  types: 'types/index.d.ts',
}, null, 2) + '\n');
console.error(`✓ .ds-dist ready`);
