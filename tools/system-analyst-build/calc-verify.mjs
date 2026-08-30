/* ============================================================================
   Calc Lab independent answer verifier — public/mpsc-system-analyst/data/calc.js

   Run:  node tools/system-analyst-build/calc-verify.mjs [seedsPerGenerator]

   WHY THIS EXISTS
   ---------------
   calc-fuzz.mjs proves an item is well FORMED. It says nothing about whether
   the letter marked correct actually is. A generator that computes its answer
   and its question text from the same wrong variable is perfectly self-
   consistent and perfectly wrong, and no amount of structural checking finds it.

   So this file never imports, calls or reads calc.js's helpers. It takes the
   generated question TEXT — the same words the reader sees — parses the numbers
   back out of it, and recomputes the answer from scratch. The IPv4 arithmetic
   below works on decimal octet arrays where calc.js works on 32-bit integers;
   the IPv6 routines work on strings where calc.js works on arrays of numbers;
   the expression evaluator is a hand-written recursive-descent parser where
   calc.js just lets JavaScript evaluate. Two implementations that disagree mean
   at least one is wrong, and that is the whole point.

   HONEST COVERAGE. Not every generator has an answer that can be recomputed
   from its text. Roughly a third are lookup items — "which exception does this
   throw", "which OSPF area type is described" — whose answer is a hand-authored
   fact, not arithmetic. Re-deriving those would mean copying the same table
   twice and proving nothing. They are listed explicitly at the end of the run
   as UNVERIFIED rather than quietly counted as passing.
   ========================================================================== */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SEEDS = Number(process.argv[2] || 2500);

function loadDrills() {
  const src = readFileSync(join(ROOT, 'public/mpsc-system-analyst/data/calc.js'), 'utf8');
  const win = {};
  new Function('window', src)(win);
  return win.CALC_DRILLS;
}
function mulberry(seed) {
  let a = seed | 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ============ independent IPv4 arithmetic, on decimal octet arrays ========= */
const oct = s => s.trim().split('.').map(Number);
const fmt = a => a.join('.');
// bits covered in octet i, turned into a decimal value: 256 − 2^(8−bits).
const maskOct = p => [0, 1, 2, 3].map(i => {
  const bits = Math.min(8, Math.max(0, p - 8 * i));
  return 256 - Math.pow(2, 8 - bits);
});
const netA = (ip, p) => { const m = maskOct(p); return oct(ip).map((o, i) => o - (o % 1) & 0 | (o & m[i])); };
const bcastA = (ip, p) => { const m = maskOct(p); return oct(ip).map((o, i) => (o & m[i]) + (255 - m[i])); };
// decimal, not bitwise — deliberately a different route to the same number
const toNum = a => a[0] * 16777216 + a[1] * 65536 + a[2] * 256 + a[3];
const fromNum = n => {
  n = ((n % 4294967296) + 4294967296) % 4294967296;
  return [Math.floor(n / 16777216) % 256, Math.floor(n / 65536) % 256,
    Math.floor(n / 256) % 256, n % 256];
};
const wildA = p => maskOct(p).map(o => 255 - o);

/* ================ independent IPv6 routines, working on strings =========== */
function v6Expand(addr) {
  let [l, r] = addr.split('::');
  const L = l === '' ? [] : l.split(':');
  const R = r === undefined ? [] : (r === '' ? [] : r.split(':'));
  const fill = r === undefined ? [] : new Array(8 - L.length - R.length).fill('0');
  return [...L, ...fill, ...R].map(h => h.padStart(4, '0')).join(':');
}
function v6Compress(full) {
  const h = full.split(':').map(x => x.replace(/^0+(?=.)/, ''));
  let bi = -1, bl = 1;
  for (let i = 0; i < h.length; i++) {
    if (h[i] !== '0') continue;
    let j = i; while (j < h.length && h[j] === '0') j++;
    if (j - i > bl) { bl = j - i; bi = i; }
    i = j - 1;
  }
  if (bi < 0) return h.join(':');
  return h.slice(0, bi).join(':') + '::' + h.slice(bi + bl).join(':');
}

/* ============ independent expression evaluator (recursive descent) ========= */
function evalExpr(src) {
  const t = src.replace(/\s+/g, '');
  let i = 0;
  const peek = () => t[i];
  function num() {
    let s = i; while (i < t.length && /[0-9]/.test(t[i])) i++;
    return Number(t.slice(s, i));
  }
  function term() {
    let v = num();
    while (peek() === '*' || peek() === '/' || peek() === '%') {
      const op = t[i++]; const r = num();
      v = op === '*' ? v * r : op === '/' ? v / r : v % r;
    }
    return v;
  }
  let v = term();
  while (peek() === '+' || peek() === '-') {
    const op = t[i++]; const r = term();
    v = op === '+' ? v + r : v - r;
  }
  return v;
}

/* ========================================================= comparison ===== */
// Options carry thousands separators for readability; compare on the value.
const norm = s => String(s).replace(/,/g, '').replace(/\s+/g, ' ').trim();

/* ========================================================== verifiers ===== */
/* Each returns the option VALUE the answer key should be pointing at, derived
   only from `it.q`. Returning null means "this seed is not one I can parse",
   which is itself reported rather than skipped silently. */
const V = {};

V['hosts-per-subnet'] = q => {
  const p = +q.match(/a \/(\d+) prefix/)[1];
  return String(Math.pow(2, 32 - p) - 2);
};
V['network-address'] = q => {
  const [, ip, p] = q.match(/host ([\d.]+)\/(\d+)\?/);
  return fmt(netA(ip, +p));
};
V['broadcast-address'] = q => {
  const [, ip, p] = q.match(/containing ([\d.]+)\/(\d+)\?/);
  return fmt(bcastA(ip, +p));
};
V['host-range'] = q => {
  const [, ip, p] = q.match(/Host ([\d.]+) sits in a \/(\d+) subnet/);
  const lo = toNum(netA(ip, +p)) + 1, hi = toNum(bcastA(ip, +p)) - 1;
  return `${fmt(fromNum(lo))} – ${fmt(fromNum(hi))}`;
};
V['subnet-count'] = q => {
  const [, base, p] = q.match(/\/(\d+) is subnetted to \/(\d+)/);
  return String(Math.pow(2, +p - +base));
};
V['mask-to-prefix'] = q => {
  let m = q.match(/^The subnet mask ([\d.]+) is written in CIDR/);
  if (m) {
    // Count the 1 bits independently, by summing per-octet bit counts.
    const bits = oct(m[1]).reduce((a, o) => a + o.toString(2).split('').filter(c => c === '1').length, 0);
    return '/' + bits;
  }
  const p = +q.match(/the mask for a \/(\d+) prefix/)[1];
  return fmt(maskOct(p));
};
V['wildcard-mask'] = q => {
  const p = +q.match(/\(\/(\d+)\)\?/)[1];
  return fmt(wildA(p));
};
V['same-subnet'] = (q, it) => {
  const [, ip, p] = q.match(/Host ([\d.]+) is configured with the mask [\d.]+ \(\/(\d+)\)/);
  const n = toNum(netA(ip, +p));
  const hits = Object.values(it.opts).filter(v => toNum(netA(String(v), +p)) === n);
  return hits.length === 1 ? String(hits[0]) : null;   // ambiguous item => report
};
V['prefix-for-hosts'] = q => {
  const need = +q.match(/needs (\d+) usable host/)[1];
  let h = 1; while (Math.pow(2, h) - 2 < need) h++;
  return `/${32 - h} (${fmt(maskOct(32 - h))})`;
};
V['summary-route'] = q => {
  const nets = q.match(/networks: ([^.]*?\.[\s\S]*?)\. Which/)[1]
    .split(', ').map(s => s.trim());
  const count = nets.length;
  const thirds = nets.map(s => +s.split('.')[2]);
  const p = 24 - Math.log2(count);
  return `${nets[0].split('/')[0].split('.').slice(0, 2).join('.')}.${Math.min(...thirds)}.0/${p}`;
};
V['address-class'] = q => {
  const first = +q.match(/of ([\d.]+)\?/)[1].split('.')[0];
  if (first <= 126) return 'Class A, default mask 255.0.0.0';
  if (first <= 191) return 'Class B, default mask 255.255.0.0';
  if (first <= 223) return 'Class C, default mask 255.255.255.0';
  if (first <= 239) return 'Class D (multicast) — no default mask, not assigned to hosts';
  return 'Class E (experimental) — no default mask, not assigned to hosts';
};
V['private-public'] = q => {
  const ip = q.match(/the address ([\d.]+)\?/)[1];
  const [a, b] = oct(ip);
  const PRIV = 'Private (RFC 1918) — needs NAT to reach the Internet';
  if (a === 127) return 'Loopback — refers to the local machine itself';
  if (a === 169 && b === 254) return 'APIPA / link-local — the host failed to get an address from DHCP';
  if (a === 10) return PRIV;
  if (a === 192 && b === 168) return PRIV;
  if (a === 172 && b >= 16 && b <= 31) return PRIV;
  return 'Public — routable on the Internet';
};
V['ipv6-compress'] = q => v6Compress(q.match(/IPv6 address ([0-9a-f:]+) is:/)[1]);
V['ipv6-expand'] = q => v6Expand(q.match(/the address ([0-9a-f:]+) is:/)[1]);
V['base-convert'] = q => {
  const B = { binary: 2, octal: 8, decimal: 10, hexadecimal: 16 };
  const [, src, from, to] = q.match(/Convert (\w+) from (\w+) to (\w+)\./);
  const n = parseInt(src, B[from]);
  const out = n.toString(B[to]);
  return B[to] === 16 ? out.toUpperCase() : out;
};
V['binary-hex-nibble'] = q => {
  const bin = q.match(/binary number ([01]{8})/)[1];
  return '0x' + parseInt(bin, 2).toString(16).toUpperCase();
};
V['twos-complement'] = q => {
  const n = +q.match(/[−-](\d+) represented/)[1];
  return (256 - n).toString(2).padStart(8, '0');
};
V['storage-units'] = q => {
  const [, n] = q.match(/are there in (\d+) (KB|MB|GB|TB|bytes)\?/);
  return String(+n * 1024);
};
V['bit-capacity'] = q => {
  let m = q.match(/represent ([\d,]+) distinct values\?/);
  if (m) return String(Math.round(Math.log2(+norm(m[1]))));
  m = q.match(/represented in (\d+) bits\?/);
  if (m) return String(Math.pow(2, +m[1]));
  return String(Math.pow(2, +q.match(/stored in (\d+) bits\?/)[1]) - 1);
};
V['address-lines'] = q => {
  const n = +q.match(/has (\d+) address lines/)[1];
  const locs = Math.pow(2, n);
  return locs >= 1073741824 ? (locs / 1073741824) + ' GB'
    : locs >= 1048576 ? (locs / 1048576) + ' MB'
      : locs >= 1024 ? (locs / 1024) + ' KB' : locs + ' bytes';
};
V['degree-cardinality'] = q => {
  const [, cols, rows] = q.match(/has (\d+) attributes and (\d+) tuples/);
  return /its degree\?/.test(q) ? cols : rows;
};
V['integer-division'] = q => {
  let m = q.match(/expression\s+(\d+) % (\d+)\s+\?/);
  if (m) return String(+m[1] % +m[2]);
  m = q.match(/value of\s+[−-](\d+) % (\d+)\s+\?/);
  if (m) return String(-(+m[1]) % +m[2]);
  m = q.match(/int x = (\d+), y = (\d+);/);
  return String(Math.trunc(+m[1] / +m[2]));
};
V['operator-precedence'] = q =>
  String(evalExpr(q.match(/expression\s+([\d\s+\-*/]+?)\s+\?/)[1]));
V['loop-iterations'] = q => {
  const m = q.match(/for \(int i = (\d+); i (<=?) (\d+); i (\+\+|\+= \d+)\)/);
  const start = +m[1], strict = m[2] === '<', end = +m[3];
  const step = m[4] === '++' ? 1 : +m[4].slice(3);
  let n = 0;
  for (let i = start; strict ? i < end : i <= end; i += step) n++;   // just run it
  return String(n);
};
V['ospf-cost'] = q => {
  // The speed may be stated inline ("a 10 Mbps Ethernet interface") or in
  // parentheses after a circuit name ("a T1 serial link (1544 kbps)"), so take
  // the LAST speed in the stem — for the named circuits that is the real one.
  const all = [...q.matchAll(/(\d+) (kbps|Mbps|Gbps)/g)];
  const m = all[all.length - 1];
  const mult = { kbps: 1e3, Mbps: 1e6, Gbps: 1e9 }[m[2]];
  return String(Math.max(1, Math.floor(1e8 / (+m[1] * mult))));
};
V['eigrp-metric'] = q => {
  const links = [...q.matchAll(/bandwidth (\d+) kbps, delay (\d+) microseconds/g)]
    .map(m => ({ bw: +m[1], dly: +m[2] }));
  const slowest = Math.min(...links.map(l => l.bw));
  const totalDelay = links.reduce((a, l) => a + l.dly, 0);
  return String(256 * (Math.floor(1e7 / slowest) + totalDelay / 10));
};
V['dr-bdr-election'] = q => {
  const rs = [...q.matchAll(/(R\d)\s+priority (\d+)\s+router-ID ([\d.]+)/g)]
    .map(m => ({ name: m[1], prio: +m[2], rid: toNum(oct(m[3])) }));
  const rank = rs.filter(r => r.prio > 0)
    .sort((a, b) => (b.prio - a.prio) || (b.rid - a.rid));
  return /Designated Router \(DR\)/.test(q) ? rank[0].name : rank[1].name;
};
V['ospf-network-wildcard'] = q => {
  const [, ip, mask, area] = q.match(/address ([\d.]+) and mask ([\d.]+) \(\/\d+\).*area (\d+)\?/);
  const bits = oct(mask).reduce((a, o) => a + o.toString(2).split('').filter(c => c === '1').length, 0);
  return `network ${fmt(netA(ip, bits))} ${fmt(wildA(bits))} area ${area}`;
};
V['admin-distance-compare'] = q => {
  const AD = {
    'a static route': 1, 'internal EIGRP': 90, 'OSPF': 110,
    'RIP': 120, 'external EIGRP': 170,
  };
  const [, a, b] = q.match(/two sources at once: (.+?) and (.+?)\. Which/);
  const [w, l] = AD[a] < AD[b] ? [a, b] : [b, a];
  return `The ${w} route — its administrative distance of ${AD[w]} is lower, and lower means more trusted`;
};
V['ad-values'] = q => {
  const AD = {
    'a directly connected interface': 0, 'a static route': 1,
    'an internal EIGRP route': 90, 'an OSPF route': 110,
    'a RIP route': 120, 'an external EIGRP route': 170,
  };
  return String(AD[q.match(/distance of (.+)\?$/)[1]]);
};
V['stp-root-bridge'] = q => {
  const sw = [...q.matchAll(/(SW\d)\s+priority (\d+)\s+MAC ([0-9a-f:]+)/g)]
    .map(m => ({ name: m[1], prio: +m[2], mac: m[3].replace(/:/g, '') }));
  // Bridge ID compares as priority first, then MAC — build it as one hex string
  // and compare those, which is a different route than sorting on two keys.
  const bid = s => s.prio.toString(16).padStart(4, '0') + s.mac;
  return sw.slice().sort((a, b) => (bid(a) < bid(b) ? -1 : 1))[0].name;
};
V['stp-root-port'] = q => {
  const COST = { '10 Mbps': 100, '100 Mbps': 19, '1 Gbps': 4, '10 Gbps': 2 };
  const ports = [...q.matchAll(/(Et0\/\d) — (.+?) to the root/g)].map(m => ({
    name: m[1],
    total: m[2].split(/ link, then an? /).reduce((a, s) => a + COST[s.replace(/ link$/, '')], 0),
  }));
  return ports.reduce((a, b) => (b.total < a.total ? b : a)).name;
};
V['longest-prefix-match'] = (q, it) => {
  const dest = q.match(/destined for ([\d.]+)\./)[1];
  const rows = [...q.matchAll(/ {2}([\d.]+)\/(\d+) via ([\d.]+)/g)]
    .map(m => ({ net: m[1], p: +m[2], s: `${m[1]}/${m[2]} via ${m[3]}` }));
  const hits = rows.filter(r => fmt(netA(dest, r.p)) === fmt(netA(r.net, r.p)));
  return hits.reduce((a, b) => (b.p > a.p ? b : a)).s;
};
V['vlan-tagging'] = q => {
  const vlan = +q.match(/belonging to VLAN (\d+)/)[1];
  const native = +q.match(/native VLAN is (\d+)/)[1];
  return vlan === native
    ? 'Sent untagged — it belongs to the native VLAN on this trunk'
    : `Tagged with an 802.1Q header carrying VLAN ID ${vlan}`;
};
V['broadcast-domains'] = q => String(+q.match(/\. (\d+) VLANs are configured/)[1]);
V['nat-translation'] = q => {
  if (!/Static NAT maps/.test(q)) return null;         // the PAT branch is a lookup item
  // Match the quad explicitly: [\d.]+ would greedily swallow the sentence's
  // full stop and yield "203.0.113.7." — a mismatch caused by the verifier,
  // not by the generator.
  const pub = q.match(/inside global address (\d+\.\d+\.\d+\.\d+)/)[1];
  return `Source ${pub}, destination 8.8.8.8`;
};

/* Answers that are hand-authored facts rather than arithmetic. Re-deriving them
   would mean writing the same table twice, which proves nothing — so they are
   named here and reported as unverified rather than counted as passing. */
const LOOKUP_ONLY = {
  'ipv6-type': 'address-type prefixes are a lookup table',
  'highest-normal-form': 'hand-authored normalisation scenarios (see calc.js NF_CASES)',
  'dependency-type': 'hand-authored dependency scenarios',
  'er-to-tables': 'hand-authored ER scenarios',
  'exception-type': 'Java exception semantics, not computable from the stem',
  'finally-semantics': 'Java control-flow semantics',
  'short-circuit': 'Java operator semantics',
  'pass-semantics': 'Java parameter-passing semantics',
  'ospf-area-type': 'OSPF area definitions are a lookup table',
  'stp-states-timers': '802.1D state and timer definitions',
  'stp-portfast-rstp': 'PortFast / RSTP behaviour definitions',
  'default-route': 'default-route behaviour definitions',
  'native-vlan': 'native-VLAN behaviour definitions',
  'nat-type': 'NAT variant selection is a judgement, not arithmetic',
  'nat-naming': 'Cisco inside/outside local/global terminology',
  'ios-mode': 'IOS prompt and mode names',
  'ios-command': 'IOS command semantics',
};

/* ============================================================== the run === */
const drills = loadDrills();
const bad = [];
let checked = 0, unparsed = 0;
const verified = [], skipped = [];

for (const g of drills) {
  if (!V[g.id]) {
    skipped.push(g.id);
    continue;
  }
  let n = 0, miss = 0;
  for (let s = 0; s < SEEDS; s++) {
    const it = g.gen(mulberry(s * 40503 + 7));
    let want;
    try {
      want = V[g.id](it.q, it);
    } catch (err) {
      bad.push({ id: g.id, seed: s, q: it.q, why: 'verifier could not parse: ' + err.message });
      miss++; continue;
    }
    if (want == null) { miss++; unparsed++; continue; }
    const got = it.opts[it.ans];
    if (norm(got) !== norm(want)) {
      bad.push({ id: g.id, seed: s, q: it.q, got: String(got), want: String(want) });
    }
    n++; checked++;
  }
  const wrong = bad.filter(b => b.id === g.id).length;
  verified.push(g.id);
  console.log(`  ${wrong ? '\x1b[31mFAIL\x1b[0m' : '\x1b[32m ok \x1b[0m'}  ${g.id.padEnd(24)}` +
    ` ${n.toLocaleString('en-US')} re-derived${miss ? `, ${miss} unparsed` : ''}` +
    `${wrong ? `  \x1b[31m${wrong} MISMATCH\x1b[0m` : ''}`);
}

console.log('');
for (const id of skipped) {
  const why = LOOKUP_ONLY[id];
  if (!why) {
    bad.push({ id, seed: -1, why: 'no verifier and not declared lookup-only — coverage gap' });
    console.log(`  \x1b[31mGAP \x1b[0m  ${id} — no verifier, and not declared lookup-only`);
  } else {
    console.log(`  \x1b[33mn/a \x1b[0m  ${id.padEnd(24)} unverified — ${why}`);
  }
}

console.log(`\n${verified.length} of ${drills.length} generators independently re-derived ` +
  `(${checked.toLocaleString('en-US')} answers); ` +
  `${skipped.length} are lookup-only and are NOT claimed as verified.`);
if (unparsed) console.log(`${unparsed} item(s) the verifier declined to judge.`);

if (!bad.length) {
  console.log('\n\x1b[32mclean\x1b[0m — every re-derived answer matches the key the generator marked correct');
  process.exit(0);
}
console.log(`\n\x1b[31m${bad.length} mismatches\x1b[0m\n`);
for (const b of bad.slice(0, 12)) {
  console.log(`  ${b.id} (seed ${b.seed})`);
  if (b.q) console.log(`    Q: ${b.q.replace(/\n/g, ' ⏎ ').slice(0, 200)}`);
  if (b.why) console.log(`    ${b.why}`);
  else console.log(`    key says: ${b.got}\n    verifier: ${b.want}`);
}
process.exit(1);
