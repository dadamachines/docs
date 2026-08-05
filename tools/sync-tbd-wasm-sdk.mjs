#!/usr/bin/env node
/*
 * assets/runtime/tbd-wasm-sdk/ is a vendored drop of the shared `tbd-wasm`
 * browser SDK. It is reusable host code owned by another repository, not
 * docs-specific runtime implementation.
 *
 * The rule this tool enforces: a vendored file is byte-identical to its
 * source, and the whole directory moves as one unit. Hand-editing a vendored
 * file is what makes a mirror unmaintainable — the next sync silently reverts
 * the edit, and nothing tells you it happened.
 *
 * This is not hypothetical. A `?v=…` cache-buster was once edited into one
 * vendored import. Because ES module identity is keyed by the *full* URL,
 * that made runtime-controller.js load twice as two independent module
 * instances: two copies of every class, and `instanceof` failing across the
 * boundary. GitHub Pages already serves these files with `max-age=600`, so
 * the cache-buster bought nothing. Version the directory if a hard cache
 * break is ever genuinely needed; never edit a vendored file.
 *
 *   verify (default)  recompute hashes, compare against MANIFEST.json.
 *                     Needs no access to the source repo, so CI can run it.
 *
 *   --sync --from D   copy D/*.js in, rewrite MANIFEST.json.
 *                     For maintainers who have the source repo checked out.
 *
 * Deliberately dependency-free and not wired into a build: the site is plain
 * Jekyll with no npm step.
 */

import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile, copyFile, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VENDOR_DIR = path.join(ROOT, 'assets/runtime/tbd-wasm-sdk');
const MANIFEST = path.join(VENDOR_DIR, 'MANIFEST.json');

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

async function jsFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.js'))
    .map(entry => entry.name)
    .sort();
}

async function hashDir(dir, names) {
  const out = {};
  for (const name of names) out[name] = sha256(await readFile(path.join(dir, name)));
  return out;
}

async function readManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function sync(from) {
  if (!from) throw new Error('--sync requires --from <path to the tbd-wasm sdk directory>');
  const source = path.resolve(from);
  const names = await jsFiles(source);
  if (!names.length) throw new Error(`no .js files found in ${source}`);

  // Remove vendored files that no longer exist upstream, so a deletion in the
  // SDK cannot leave a stale module behind that still resolves at runtime.
  for (const stale of (await jsFiles(VENDOR_DIR)).filter(name => !names.includes(name))) {
    await unlink(path.join(VENDOR_DIR, stale));
    console.log(`removed (gone upstream): ${stale}`);
  }

  for (const name of names) await copyFile(path.join(source, name), path.join(VENDOR_DIR, name));

  const files = await hashDir(VENDOR_DIR, names);
  // No source path or repository name is recorded: this repository is public.
  await writeFile(MANIFEST, JSON.stringify({
    description: 'Vendored drop of the shared tbd-wasm browser SDK. Do not hand-edit these files; see tools/sync-tbd-wasm-sdk.mjs.',
    syncedAt: new Date().toISOString().slice(0, 10),
    files
  }, null, 2) + '\n');

  console.log(`synced ${names.length} files from ${source}`);
  return 0;
}

async function verify() {
  const manifest = await readManifest();
  if (!manifest) {
    console.error('MANIFEST.json is missing. Run with --sync --from <sdk dir>.');
    return 1;
  }

  const expected = manifest.files || {};
  const actual = await hashDir(VENDOR_DIR, await jsFiles(VENDOR_DIR));
  const problems = [];

  for (const [name, hash] of Object.entries(expected)) {
    if (!(name in actual)) problems.push(`missing:  ${name} (in manifest, not on disk)`);
    else if (actual[name] !== hash) problems.push(`MODIFIED: ${name} — hand-edited or synced without updating the manifest`);
  }
  for (const name of Object.keys(actual)) {
    if (!(name in expected)) problems.push(`untracked: ${name} (on disk, not in manifest)`);
  }

  if (problems.length) {
    console.error('Vendored tbd-wasm SDK does not match MANIFEST.json:\n');
    for (const problem of problems) console.error(`  ${problem}`);
    console.error('\nVendored files must stay byte-identical to their source.');
    console.error('Never patch one in place — re-sync the directory as a unit instead.');
    return 1;
  }

  console.log(`tbd-wasm SDK vendor check: ${Object.keys(actual).length} files match MANIFEST.json`);
  return 0;
}

const argv = process.argv.slice(2);
const fromIndex = argv.indexOf('--from');
const exitCode = argv.includes('--sync')
  ? await sync(fromIndex === -1 ? process.env.TBD_WASM_SDK_DIR : argv[fromIndex + 1])
  : await verify();
process.exit(exitCode);
