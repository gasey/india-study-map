#!/usr/bin/env node
// ============================================
// Builds the offline Nihongo dictionary shipped at
// public/data/nihongo/{jmdict,kanjidic2}.json.
//
// Source: scriptin/jmdict-simplified GitHub releases — pre-parsed JSON
// exports of JMdict (EDRDG) and KANJIDIC2 (EDRDG), so this script never
// has to touch raw XML. We pull the full `jmdict-eng` word list (all
// ~218k entries with English glosses) and `kanjidic2-en` (~10k kanji).
//
// Both source dictionaries are EDRDG's, licensed CC BY-SA 4.0 — see the
// generated ATTRIBUTION.txt.
//
// Output is deliberately NOT pretty-printed (saves ~15% before gzip) and
// drops any field the app doesn't render (xrefs, per-form kanji/kana
// tags, dialect/field detail beyond a flattened tag list, dictionary
// cross-reference numbers, radical/codepoint data, etc).
//
// Re-run with: npm run build:dict
// ============================================

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '../../public/data/nihongo');
const RELEASES_API = 'https://api.github.com/repos/scriptin/jmdict-simplified/releases/latest';

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'india-study-map-nihongo-dict-build' } });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.json();
}

async function downloadFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fsp.writeFile(dest, buf);
}

function findAsset(assets, matcher) {
  const asset = assets.find(matcher);
  if (!asset) throw new Error('No matching release asset found');
  return asset;
}

async function downloadAndExtractJson(asset, tmpDir) {
  const zipPath = path.join(tmpDir, asset.name);
  console.log(`  downloading ${asset.name} (${(asset.size / 1024 / 1024).toFixed(1)}MB)...`);
  await downloadFile(asset.browser_download_url, zipPath);
  execFileSync('unzip', ['-o', '-q', zipPath, '-d', tmpDir]);
  const jsonPath = fs.readdirSync(tmpDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => path.join(tmpDir, f))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
  console.log(`  parsing ${path.basename(jsonPath)}...`);
  const data = JSON.parse(await fsp.readFile(jsonPath, 'utf8'));
  await fsp.rm(jsonPath, { force: true });
  await fsp.rm(zipPath, { force: true });
  return data;
}

function transformWords(raw) {
  const words = raw.words
    .map((w) => {
      const kanji = w.kanji.map((k) => k.text);
      const kana = w.kana.map((k) => k.text);
      const common = w.kanji.some((k) => k.common) || w.kana.some((k) => k.common);
      const senses = w.sense
        .map((s) => {
          const tags = [...new Set([...(s.partOfSpeech || []), ...(s.misc || []), ...(s.field || []), ...(s.dialect || [])])];
          const gloss = s.gloss.filter((g) => g.lang === 'eng').map((g) => g.text);
          return { tags, gloss };
        })
        .filter((s) => s.gloss.length > 0);
      return { id: w.id, kanji, kana, common, senses };
    })
    .filter((w) => w.senses.length > 0);
  return { version: raw.version, dictDate: raw.dictDate, posTags: raw.tags, words };
}

function transformKanji(raw) {
  const kanji = raw.characters
    .map((c) => {
      const groups = c.readingMeaning?.groups || [];
      const onReadings = [...new Set(groups.flatMap((g) => g.readings.filter((r) => r.type === 'ja_on').map((r) => r.value)))];
      const kunReadings = [...new Set(groups.flatMap((g) => g.readings.filter((r) => r.type === 'ja_kun').map((r) => r.value)))];
      const meanings = [...new Set(groups.flatMap((g) => g.meanings.filter((m) => m.lang === 'en').map((m) => m.value)))];
      return {
        literal: c.literal,
        meanings,
        onReadings,
        kunReadings,
        strokeCount: c.misc?.strokeCounts?.[0] ?? null,
        jlpt: c.misc?.jlptLevel ?? null,
        grade: c.misc?.grade ?? null,
        frequency: c.misc?.frequency ?? null,
      };
    })
    .filter((k) => k.meanings.length > 0 || k.onReadings.length > 0 || k.kunReadings.length > 0);
  return { version: raw.version, dictDate: raw.dictDate, kanji };
}

function writeJson(filePath, data) {
  const json = JSON.stringify(data);
  fs.writeFileSync(filePath, json);
  const gz = zlib.gzipSync(json, { level: 9 }).length;
  console.log(`  wrote ${path.basename(filePath)}: ${(json.length / 1024 / 1024).toFixed(1)}MB (${(gz / 1024 / 1024).toFixed(1)}MB gzipped)`);
}

async function main() {
  await fsp.mkdir(OUT_DIR, { recursive: true });
  const tmpDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'nihongo-dict-'));

  console.log('Fetching latest jmdict-simplified release info...');
  const release = await fetchJson(RELEASES_API);
  console.log(`  release: ${release.tag_name}`);

  // "jmdict-eng-*" but not "-common" or "-examples"
  const jmdictAsset = findAsset(release.assets, (a) => /^jmdict-eng-[\d.+-]+\.json\.zip$/.test(a.name));
  const kanjidicAsset = findAsset(release.assets, (a) => /^kanjidic2-en-[\d.+-]+\.json\.zip$/.test(a.name));

  console.log('Downloading + parsing JMdict (eng)...');
  const jmdictRaw = await downloadAndExtractJson(jmdictAsset, tmpDir);
  console.log('Downloading + parsing KANJIDIC2 (en)...');
  const kanjidicRaw = await downloadAndExtractJson(kanjidicAsset, tmpDir);

  await fsp.rm(tmpDir, { recursive: true, force: true });

  console.log('Transforming...');
  const words = transformWords(jmdictRaw);
  const kanji = transformKanji(kanjidicRaw);
  console.log(`  ${words.words.length} word entries, ${kanji.kanji.length} kanji entries`);

  console.log('Writing output...');
  writeJson(path.join(OUT_DIR, 'jmdict.json'), words);
  writeJson(path.join(OUT_DIR, 'kanjidic2.json'), kanji);

  await fsp.writeFile(
    path.join(OUT_DIR, 'ATTRIBUTION.txt'),
    `Dictionary data in this directory is derived from JMdict and KANJIDIC2,
property of the Electronic Dictionary Research and Development Group
(EDRDG), used and redistributed under the Creative Commons
Attribution-ShareAlike Licence (V4.0): https://www.edrdg.org/edrdg/licence.html

Source data via jmdict-simplified (${release.tag_name}):
https://github.com/scriptin/jmdict-simplified

See https://www.edrdg.org/jmdict/j_jmdict.html and
https://www.edrdg.org/wiki/index.php/KANJIDIC_Project for details.
`
  );

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
