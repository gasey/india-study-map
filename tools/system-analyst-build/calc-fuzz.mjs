/* ============================================================================
   Calc Lab structural fuzzer — public/mpsc-system-analyst/data/calc.js

   Run:  node tools/system-analyst-build/calc-fuzz.mjs [seedsPerGenerator]

   WHY THIS EXISTS
   ---------------
   Reading a generator tells you what it means to produce. It does not tell you
   what it produces on the (ip, prefix) pair where two of your distractors
   collapse onto each other. In the System Manager build this pass found four
   generators that emitted DUPLICATE OPTIONS on some seeds — which means two
   letters are correct and the item silently marks a right answer wrong. That is
   exactly the class of quiet-wrong-content CLAUDE.md exists to prevent, and it
   is invisible to inspection.

   Every assertion below is about structure, not about whether the answer is
   right — that is calc-verify.mjs's job, and it deliberately does not share a
   line of code with this file or with calc.js.
   ========================================================================== */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SEEDS = Number(process.argv[2] || 2500);

/* Load the generators the same way the browser does: as a classic script that
   assigns to `window`. No module wrapper, no build step. */
function loadDrills() {
  const src = readFileSync(join(ROOT, 'public/mpsc-system-analyst/data/calc.js'), 'utf8');
  const win = {};
  new Function('window', src)(win);
  if (!Array.isArray(win.CALC_DRILLS)) throw new Error('calc.js did not export CALC_DRILLS');
  return win.CALC_DRILLS;
}

/* The app's PRNG, copied because the drill runner seeds generators with it and
   a different generator would fuzz a different distribution than ships. */
function mulberry(seed) {
  let a = seed | 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const KEYS = ['A', 'B', 'C', 'D'];

/* A leaked placeholder is a template hole that interpolated `undefined` or
   `NaN` into prose. But two generators legitimately TALK about those tokens —
   Java's null, and floating-point NaN — so a blanket substring match reports
   real content as a defect. The rule below keeps the check strict and names the
   exceptions explicitly rather than loosening it for everyone:

     - "undefined" and "[object Object]" are never legitimate prose here.
     - "NaN" is legitimate only where a generator is teaching about it, which is
       declared per generator below. Anywhere else it still fails.
     - An OPTION is only a leak if its ENTIRE value is undefined/NaN. A value of
       "null" is real content (pass-semantics offers it as a distractor), and
       build() already refuses to place a literal undefined or NaN. */
const NAN_IS_CONTENT = new Set([
  'exception-type',   // "floating-point division by zero ... yields Infinity or NaN"
]);
const leakInProse = (id, s) =>
  /\bundefined\b|\[object Object\]/.test(s) || (!NAN_IS_CONTENT.has(id) && /\bNaN\b/.test(s));
const leakInOption = v => /^(undefined|NaN)$/.test(String(v).trim());
const problems = [];
const fail = (gen, seed, msg, detail) =>
  problems.push({ gen, seed, msg, detail });

const drills = loadDrills();
console.log(`fuzzing ${drills.length} generators × ${SEEDS.toLocaleString('en-US')} seeds ` +
  `= ${(drills.length * SEEDS).toLocaleString('en-US')} generated items\n`);

for (const g of drills) {
  let worst = null;
  for (let s = 0; s < SEEDS; s++) {
    let it;
    try {
      it = g.gen(mulberry(s * 2654435761 + 1));
    } catch (err) {
      fail(g.id, s, 'generator threw', err.message);
      continue;
    }

    if (!it || typeof it !== 'object') { fail(g.id, s, 'returned no item'); continue; }

    /* --- the stem ------------------------------------------------------- */
    if (typeof it.q !== 'string' || !it.q.trim()) fail(g.id, s, 'empty question text');
    if (leakInProse(g.id, it.q))
      fail(g.id, s, 'placeholder leaked into the question text', it.q.slice(0, 160));

    /* --- the options ---------------------------------------------------- */
    const present = KEYS.filter(k => it.opts && it.opts[k] != null);
    // Four options, always. A generator that cannot supply four distinct ones
    // degrades to three in build(), which is a bug in the generator's distractor
    // list — the whole reason this pass exists.
    if (present.length !== 4)
      fail(g.id, s, `${present.length} options, expected 4`, JSON.stringify(it.opts));

    const vals = present.map(k => String(it.opts[k]));
    const uniq = new Set(vals);
    if (uniq.size !== vals.length) {
      const dupes = vals.filter((v, i) => vals.indexOf(v) !== i);
      // The headline failure: duplicate options mean two letters are correct.
      fail(g.id, s, 'DUPLICATE OPTIONS — two letters would be correct', dupes.join(' | '));
    }
    for (const [k, v] of Object.entries(it.opts || {})) {
      if (v == null || String(v).trim() === '') fail(g.id, s, `option ${k} is blank`);
      if (leakInOption(v))
        fail(g.id, s, `option ${k} is a leaked placeholder value`, String(v));
    }

    /* --- the answer key ------------------------------------------------- */
    if (!KEYS.includes(it.ans))
      fail(g.id, s, 'answer key is not one of A–D', String(it.ans));
    else if (it.opts[it.ans] == null)
      fail(g.id, s, `answer key ${it.ans} points at a missing option`);

    /* --- the worked solution -------------------------------------------- */
    if (!Array.isArray(it.steps)) fail(g.id, s, 'steps is not an array');
    else {
      // The worked solution is the feature. Fewer than three lines is not a
      // method, it is a restatement of the answer.
      if (it.steps.length < 3) fail(g.id, s, `only ${it.steps.length} steps, expected >= 3`);
      it.steps.forEach((x, i) => {
        if (typeof x !== 'string' || !x.trim()) fail(g.id, s, `step ${i + 1} is empty`);
        else if (leakInProse(g.id, x))
          fail(g.id, s, `placeholder leaked into step ${i + 1}`, x.slice(0, 160));
      });
    }
    if (it.trap != null && (typeof it.trap !== 'string' || !it.trap.trim()))
      fail(g.id, s, 'trap present but not a usable string');

    if (!worst) worst = it;
  }

  const bad = problems.filter(p => p.gen === g.id).length;
  const mark = bad ? '[31mFAIL[0m' : '[32m ok [0m';
  console.log(`  ${mark}  ${g.id.padEnd(24)} ${bad ? bad + ' problems' : ''}`);
}

console.log('');
if (!problems.length) {
  console.log(`[32mclean[0m — ${(drills.length * SEEDS).toLocaleString('en-US')} items, ` +
    `no duplicate options, no missing keys, no placeholder values, every item >= 3 steps`);
  process.exit(0);
}

// Group so one systematically broken generator does not print 2,500 times.
const byGen = new Map();
for (const p of problems) {
  const k = `${p.gen} :: ${p.msg}`;
  if (!byGen.has(k)) byGen.set(k, { ...p, n: 0, seeds: [] });
  const e = byGen.get(k);
  e.n++; if (e.seeds.length < 5) e.seeds.push(p.seed);
}
console.log(`[31m${problems.length} problems across ${byGen.size} distinct failures[0m\n`);
for (const [k, e] of byGen) {
  console.log(`  ${k}`);
  console.log(`    ${e.n} seed(s), e.g. ${e.seeds.join(', ')}`);
  if (e.detail) console.log(`    ${e.detail}`);
}
process.exit(1);
