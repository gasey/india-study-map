/* ============================================================================
   MPSC System Analyst — Calc Lab drill generators
   window.CALC_DRILLS = [ {id, group, title, sub, paper, unit, blurb, gen(rnd)} ]

   WHY THIS FILE EXISTS
   --------------------
   The concept guide explains subnetting, OSPF cost, STP elections and NAT well
   enough. What it cannot do is build the procedural fluency those topics are
   actually examined on. Measured before this was written, the whole
   1,082-question bank held **40** questions across all seventeen leaves of
   TECH1 Unit 1 — the entire networking core of the merit-bearing paper — and
   exactly ONE of them (`TECH1_2024-7`) is a genuine subnetting calculation:

     Sub-netting 2 · Spanning Tree Protocol 2 · Network Address Translation 2
     Virtual LANs 1 · IOS and Security Device Manager 1 · IP Routing 0
     EIGRP and OSPF 4

   You cannot drill a skill on a pool of one, and six of those leaves cannot be
   drilled from the bank at all. Hence generated items: the pool is unbounded.

   Every generator here is a pure function of a seeded RNG, so a drill set is
   reproducible from its seed, and every item carries a worked `steps` solution
   rather than just an answer letter — the method is the thing being taught.

   FORKED, NOT SHARED. This is a sibling of the System Manager app's
   `data/calc.js`, deliberately duplicated rather than factored out (see
   BUILD_GUIDE.md §4 — the two app.js files are a fork for the same reason).
   The syllabi genuinely differ: every generator is retagged to the System
   Analyst leaf names, which are not the same strings ("Sub-netting" is
   hyphenated here, IPv6 is its own TECH1 Unit 1 leaf), and this app has no
   operating-systems unit, so the System Manager's seven memory-allocation,
   paging and cache generators have no leaf to hang from and are absent.
   `conceptFor()` matches the full paper|unit|sub triple, so a stale tag from
   the other app would silently break the "read the concept" link.

   No network, no model, no build step. Add a generator by appending to the
   exported array; the Calc Lab view picks it up with no other change.

   CORRECTNESS RULE (from CLAUDE.md — a wrong answer teaches a false fact before
   a real exam): every generator computes its correct answer arithmetically and
   derives distractors from *named* mistakes. Nothing here hardcodes an answer
   key that could drift from the question text. The normalisation scenarios are
   the one exception and are hand-authored verbatim for exactly that reason —
   substituting random attribute names into a dependency structure is how you
   silently produce a scenario whose stated answer is no longer true.
   ========================================================================== */
'use strict';

(function () {

  /* ------------------------------------------------------------ utilities */
  const randInt = (rnd, lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));
  const pick = (rnd, arr) => arr[Math.floor(rnd() * arr.length)];

  function shuf(arr, rnd) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* Assemble a four-option MCQ from one correct value and a pool of candidate
     distractors. Candidates are deduplicated against the correct answer and
     against each other by string value, so a generator can throw plausible
     near-misses at this without checking whether any of them collide. */
  function build(correct, cands, rnd) {
    const right = String(correct);
    const seen = new Set([right]);
    const ds = [];
    for (const c of shuf(cands, rnd)) {
      const s = String(c);
      if (seen.has(s) || s === 'undefined' || s === 'NaN') continue;
      seen.add(s); ds.push(s);
      if (ds.length === 3) break;
    }
    // A generator that supplies too few distinct candidates is a bug, not a
    // runtime condition to paper over — but degrade to a shorter MCQ rather
    // than rendering duplicate options, which would make two letters correct.
    const all = shuf([right, ...ds], rnd);
    const keys = ['A', 'B', 'C', 'D'];
    const opts = {};
    all.forEach((v, i) => { opts[keys[i]] = v; });
    return { opts, ans: keys[all.indexOf(right)] };
  }

  /* --------------------------------------------------------------- IPv4 */
  const ipToInt = ip => ip.split('.').reduce((a, o) => (((a << 8) >>> 0) + (+o)) >>> 0, 0) >>> 0;
  const intToIp = n => [24, 16, 8, 0].map(s => (n >>> s) & 255).join('.');
  const maskInt = p => (p === 0 ? 0 : (0xFFFFFFFF << (32 - p)) >>> 0) >>> 0;
  const maskStr = p => intToIp(maskInt(p));
  const netOf = (ipn, p) => (ipn & maskInt(p)) >>> 0;
  const bcastOf = (ipn, p) => ((ipn | (~maskInt(p) >>> 0)) >>> 0);

  // A random host address inside a randomly chosen private network, with a
  // prefix in the range the exam actually asks about.
  function randHost(rnd, pLo, pHi) {
    const p = randInt(rnd, pLo, pHi);
    const base = pick(rnd, [
      ipToInt('192.168.' + randInt(rnd, 0, 30) + '.0'),
      ipToInt('172.' + randInt(rnd, 16, 31) + '.' + randInt(rnd, 0, 40) + '.0'),
      ipToInt('10.' + randInt(rnd, 0, 60) + '.' + randInt(rnd, 0, 40) + '.0'),
    ]);
    const net = netOf(base, p);
    const size = Math.pow(2, 32 - p);
    // strictly inside the block, never the network or broadcast address
    const off = size > 2 ? randInt(rnd, 1, size - 2) : 1;
    return { ip: (net + off) >>> 0, p, net, size };
  }

  const DRILLS = [];
  const G_IP = 'IP addressing & subnetting';
  const G_V6 = 'IPv6';
  const G_NUM = 'Number systems & data representation';
  const G_DB = 'DBMS: normalisation & ER mapping';
  const G_PROG = 'Programming traps, output & exceptions';
  // The six groups below cover TECH1 Unit 1 leaves that the System Manager
  // syllabus does not contain at all, so none of this is ported — it is new.
  const G_OSPF = 'OSPF & EIGRP';
  const G_STP = 'Spanning Tree Protocol';
  const G_ROUTE = 'IP routing & path selection';
  const G_VLAN = 'VLANs & trunking';
  const G_NAT = 'Network Address Translation';
  const G_IOS = 'Cisco IOS command modes';

  /* ====================================================== IPv4 SUBNETTING */

  DRILLS.push({
    id: 'hosts-per-subnet', group: G_IP, paper: 'TECH1', unit: '1', sub: 'Sub-netting',
    title: 'Usable hosts per subnet',
    blurb: 'The 2^h − 2 rule, and remembering to subtract the 2.',
    gen(rnd) {
      const p = randInt(rnd, 20, 30);
      const h = 32 - p;
      const usable = Math.pow(2, h) - 2;
      const { opts, ans } = build(usable, [
        Math.pow(2, h),                 // forgot to subtract network + broadcast
        Math.pow(2, h) - 1,             // subtracted only one
        Math.pow(2, h + 1) - 2,         // off by one bit the wrong way
        Math.pow(2, h - 1) - 2,
        Math.pow(2, 32 - p) / 2,
      ], rnd);
      return {
        q: `A network is subnetted with a /${p} prefix (${maskStr(p)}). How many usable host addresses does each subnet contain?`,
        opts, ans,
        steps: [
          `A /${p} prefix uses ${p} bits for the network, so 32 − ${p} = ${h} bits are left for hosts.`,
          `${h} host bits give 2^${h} = ${Math.pow(2, h)} total addresses in the block.`,
          `Two of those can never be given to a host: the all-zeros host value is the network address, and the all-ones host value is the broadcast address.`,
          `Usable hosts = 2^${h} − 2 = ${Math.pow(2, h)} − 2 = ${usable}.`,
        ],
        trap: 'The "− 2" is the single most common subnetting error. Subtract it when the question says hosts; do not subtract it when the question asks for the size of the block.',
      };
    },
  });

  DRILLS.push({
    id: 'network-address', group: G_IP, paper: 'TECH1', unit: '1', sub: 'Sub-netting',
    title: 'Find the network address',
    blurb: 'AND the address with its mask — the calculation a host performs on every packet.',
    gen(rnd) {
      const { ip, p, net } = randHost(rnd, 18, 29);
      const size = Math.pow(2, 32 - p);
      const oct = 32 - p >= 8 ? (32 - p >= 16 ? 1 : 2) : 3;   // interesting octet index
      // Candidates must not be able to collapse onto each other or onto the
      // answer. netOf(ip, p-1) and netOf(ip, 24) both equal `net` for many
      // (ip, p) pairs, and `net + 1` equals `ip` whenever the random host
      // landed on the first usable address — a fuzz run over 400 seeds hit
      // both collisions and produced three-option items. The neighbouring
      // blocks below are distinct from `net` by construction.
      const { opts, ans } = build(intToIp(net), [
        intToIp(ip),                                   // the address itself
        intToIp(bcastOf(ip, p)),                       // the broadcast instead
        intToIp((net + size) >>> 0),                   // next block along
        intToIp((net - size) >>> 0),                   // previous block
        intToIp(netOf(ip, 24)),                        // assumed a classful /24
        intToIp((net + 1) >>> 0),                      // first host instead
      ], rnd);
      return {
        q: `Which is the network address of the host ${intToIp(ip)}/${p}?`,
        opts, ans,
        steps: [
          `The mask for /${p} is ${maskStr(p)}.`,
          `The network address is the bitwise AND of the address and the mask, which in practice means: keep the octets the mask covers completely, and round the interesting octet down to a multiple of the block size.`,
          `Block size = 256 − ${maskStr(p).split('.')[oct]} = ${size >= 256 ? 256 : size} in octet ${oct + 1}.`,
          `${intToIp(ip)} AND ${maskStr(p)} = ${intToIp(net)}.`,
          `Sanity check: the network address always ends in the all-zeros host portion, and always falls on a multiple of the block size.`,
        ],
      };
    },
  });

  DRILLS.push({
    id: 'broadcast-address', group: G_IP, paper: 'TECH1', unit: '1', sub: 'Sub-netting',
    title: 'Find the broadcast address',
    blurb: 'One below the next subnet — the fastest way to get this right under time pressure.',
    gen(rnd) {
      const { ip, p, net } = randHost(rnd, 18, 29);
      const size = Math.pow(2, 32 - p);
      const bc = bcastOf(ip, p);
      const { opts, ans } = build(intToIp(bc), [
        intToIp(net),
        intToIp((bc - 1) >>> 0),                   // last usable host
        intToIp((bc + 1) >>> 0),                   // next subnet's network address
        intToIp(bcastOf(ip, 24)),
        intToIp(bcastOf(ip, p - 1)),
      ], rnd);
      return {
        q: `What is the broadcast address of the subnet containing ${intToIp(ip)}/${p}?`,
        opts, ans,
        steps: [
          `The mask for /${p} is ${maskStr(p)}, so each block holds ${size} addresses.`,
          `The network address of this block is ${intToIp(net)}.`,
          `The next block starts at ${intToIp((net + size) >>> 0)}.`,
          `The broadcast address is one address below that: ${intToIp(bc)}.`,
          `Equivalently, set every host bit to 1: ${intToIp(net)} with the last ${32 - p} bits turned on gives ${intToIp(bc)}.`,
        ],
        trap: 'The broadcast is the LAST address of the block, and the last usable host is one below it. Options offering both are testing whether you kept them apart.',
      };
    },
  });

  DRILLS.push({
    id: 'host-range', group: G_IP, paper: 'TECH1', unit: '1', sub: 'Sub-netting',
    title: 'Valid host range of a subnet',
    blurb: 'First and last assignable address, given any host inside the block.',
    gen(rnd) {
      const { ip, p, net } = randHost(rnd, 20, 29);
      const size = Math.pow(2, 32 - p);
      const bc = bcastOf(ip, p);
      const correct = `${intToIp((net + 1) >>> 0)} – ${intToIp((bc - 1) >>> 0)}`;
      const { opts, ans } = build(correct, [
        `${intToIp(net)} – ${intToIp(bc)}`,                       // included both reserved
        `${intToIp(net)} – ${intToIp((bc - 1) >>> 0)}`,           // included the network address
        `${intToIp((net + 1) >>> 0)} – ${intToIp(bc)}`,           // included the broadcast
        `${intToIp((net + size) >>> 0)} – ${intToIp((bc + size) >>> 0)}`,
      ], rnd);
      return {
        q: `Host ${intToIp(ip)} sits in a /${p} subnet. What is the range of valid host addresses in that subnet?`,
        opts, ans,
        steps: [
          `Block size for /${p} is 2^${32 - p} = ${size} addresses.`,
          `Rounding ${intToIp(ip)} down to a multiple of ${size} gives the network address ${intToIp(net)}.`,
          `The broadcast address is ${size} − 1 above it: ${intToIp(bc)}.`,
          `Valid hosts are everything strictly between the two: ${correct}.`,
          `That is ${size - 2} addresses, matching 2^${32 - p} − 2.`,
        ],
      };
    },
  });

  DRILLS.push({
    id: 'subnet-count', group: G_IP, paper: 'TECH1', unit: '1', sub: 'Sub-netting',
    title: 'How many subnets does borrowing n bits create?',
    blurb: '2^n subnets — and no, you do not subtract 2 from this one.',
    gen(rnd) {
      const base = pick(rnd, [24, 16, 8]);
      const borrowed = randInt(rnd, 2, base === 24 ? 6 : 8);
      const p = base + borrowed;
      const subnets = Math.pow(2, borrowed);
      const hosts = Math.pow(2, 32 - p) - 2;
      const netStr = base === 24 ? `192.168.${randInt(rnd, 1, 40)}.0/24`
        : base === 16 ? `172.${randInt(rnd, 16, 31)}.0.0/16`
          : `10.0.0.0/8`;
      const { opts, ans } = build(subnets, [
        subnets - 2,                       // the obsolete "subnet zero" subtraction
        Math.pow(2, 32 - p),               // counted host bits instead
        hosts,
        Math.pow(2, borrowed - 1),
        borrowed,
      ], rnd);
      return {
        q: `The network ${netStr} is subnetted to /${p}. How many subnets does that produce?`,
        opts, ans,
        steps: [
          `The original prefix is /${base}; the new prefix is /${p}.`,
          `Bits borrowed from the host portion = ${p} − ${base} = ${borrowed}.`,
          `Each borrowed bit doubles the subnet count, so subnets = 2^${borrowed} = ${subnets}.`,
          `Each of those subnets has 32 − ${p} = ${32 - p} host bits, giving ${hosts} usable hosts each.`,
          `Cross-check: ${subnets} subnets × ${Math.pow(2, 32 - p)} addresses = ${subnets * Math.pow(2, 32 - p)} addresses, the size of the original /${base}.`,
        ],
        trap: 'Subtract 2 from HOSTS, never from SUBNETS. The old "2^n − 2 subnets" rule assumed subnet zero was unusable; it has not applied on real equipment for decades, but it still appears as a distractor.',
      };
    },
  });

  DRILLS.push({
    id: 'mask-to-prefix', group: G_IP, paper: 'TECH1', unit: '1', sub: 'Sub-netting',
    title: 'Dotted-decimal mask ↔ CIDR prefix',
    blurb: 'Convert both directions without counting on your fingers.',
    gen(rnd) {
      const p = randInt(rnd, 8, 30);
      const toPrefix = rnd() < 0.5;
      if (toPrefix) {
        const { opts, ans } = build('/' + p, ['/' + (p + 1), '/' + (p - 1), '/' + (32 - p), '/' + (p + 8), '/' + (p - 8)], rnd);
        return {
          q: `The subnet mask ${maskStr(p)} is written in CIDR notation as:`,
          opts, ans,
          steps: [
            `Write each octet of ${maskStr(p)} in binary: ${maskStr(p).split('.').map(o => (+o).toString(2).padStart(8, '0')).join(' ')}.`,
            `CIDR notation is simply a count of the leading 1 bits.`,
            `Counting them: ${p} ones, so the prefix is /${p}.`,
            `Shortcut worth memorising: 255 = 8 bits, 254 = 7, 252 = 6, 248 = 5, 240 = 4, 224 = 3, 192 = 2, 128 = 1.`,
          ],
        };
      }
      const { opts, ans } = build(maskStr(p), [maskStr(p + 1), maskStr(p - 1), maskStr(32 - p), maskStr(p + 2)], rnd);
      return {
        q: `Written in dotted decimal, the mask for a /${p} prefix is:`,
        opts, ans,
        steps: [
          `/${p} means ${p} leading 1 bits followed by ${32 - p} zeros.`,
          `In binary: ${maskStr(p).split('.').map(o => (+o).toString(2).padStart(8, '0')).join(' ')}.`,
          `Converting each octet back to decimal: ${maskStr(p)}.`,
          `A valid mask is always contiguous 1s then contiguous 0s — an octet value that is not in {0,128,192,224,240,248,252,254,255} cannot be part of one.`,
        ],
      };
    },
  });

  DRILLS.push({
    id: 'wildcard-mask', group: G_IP, paper: 'TECH1', unit: '1', sub: 'Sub-netting',
    title: 'Wildcard mask from a subnet mask',
    blurb: 'The inverse mask used in access lists and OSPF statements.',
    gen(rnd) {
      const p = randInt(rnd, 16, 30);
      const wc = intToIp((~maskInt(p)) >>> 0);
      const { opts, ans } = build(wc, [
        maskStr(p),                                  // gave the mask back
        intToIp((~maskInt(p + 1)) >>> 0),
        intToIp((~maskInt(p - 1)) >>> 0),
        intToIp(((~maskInt(p)) >>> 0) + 1),
      ], rnd);
      return {
        q: `What is the wildcard mask corresponding to the subnet mask ${maskStr(p)} (/${p})?`,
        opts, ans,
        steps: [
          `A wildcard mask is the bitwise inverse of the subnet mask: 1 bits mark "don't care" positions.`,
          `Subtract each octet from 255: 255.255.255.255 − ${maskStr(p)} = ${wc}.`,
          `Check: the wildcard octets sum with the mask octets to 255 in every position.`,
          `Also note ${wc} is one less than the block size in the interesting octet — a wildcard mask always covers exactly the host portion.`,
        ],
      };
    },
  });

  DRILLS.push({
    id: 'same-subnet', group: G_IP, paper: 'TECH1', unit: '1', sub: 'Sub-netting',
    title: 'Which host is on the same subnet?',
    blurb: 'The decision a host makes before choosing between the LAN and the default gateway.',
    gen(rnd) {
      const { ip, p, net } = randHost(rnd, 25, 29);
      const size = Math.pow(2, 32 - p);
      // one address genuinely inside the same block, distinct from ip
      let same = (net + 1) >>> 0;
      if (same === ip) same = (net + 2) >>> 0;
      const cands = [
        intToIp((net + size + 1) >>> 0),          // next block along
        intToIp((net - size + 1) >>> 0),          // previous block
        intToIp((net + size + 5) >>> 0),
        intToIp(bcastOf(ip, p) + 2),
      ];
      const { opts, ans } = build(intToIp(same), cands, rnd);
      return {
        q: `Host ${intToIp(ip)} is configured with the mask ${maskStr(p)} (/${p}). Which of these addresses is on the SAME subnet, and can therefore be reached without going through the default gateway?`,
        opts, ans,
        steps: [
          `A /${p} block holds ${size} addresses, so subnet boundaries fall every ${size} addresses.`,
          `${intToIp(ip)} AND ${maskStr(p)} = ${intToIp(net)}, so this host's subnet runs ${intToIp(net)} to ${intToIp(bcastOf(ip, p))}.`,
          `${intToIp(same)} falls inside that range, so the host ARPs for it directly on the LAN.`,
          `Every other option lands in an adjacent block and would be handed to the default gateway instead.`,
        ],
        trap: 'Addresses that look numerically close are very often in different subnets — with a /' + p + ' the boundary comes every ' + size + ' addresses, not every 256.',
      };
    },
  });

  DRILLS.push({
    id: 'prefix-for-hosts', group: G_IP, paper: 'TECH1', unit: '1', sub: 'Sub-netting',
    title: 'Smallest subnet that fits N hosts',
    blurb: 'The VLSM design question — size each subnet to its requirement.',
    gen(rnd) {
      const need = pick(rnd, [6, 10, 12, 25, 28, 50, 60, 100, 120, 200, 300, 500]);
      let h = 1;
      while (Math.pow(2, h) - 2 < need) h++;
      const p = 32 - h;
      const { opts, ans } = build(`/${p} (${maskStr(p)})`, [
        `/${p + 1} (${maskStr(p + 1)})`,     // one bit too small — the classic miss
        `/${p - 1} (${maskStr(p - 1)})`,     // wasteful, one bit too large
        `/${p - 2} (${maskStr(p - 2)})`,
        `/${p + 2} (${maskStr(p + 2)})`,
      ], rnd);
      return {
        q: `A department needs ${need} usable host addresses on one subnet. What is the smallest subnet (longest prefix) that will fit them?`,
        opts, ans,
        steps: [
          `Usable hosts = 2^h − 2, where h is the number of host bits. Solve for the smallest h with 2^h − 2 ≥ ${need}.`,
          `2^${h - 1} − 2 = ${Math.pow(2, h - 1) - 2}, which is ${Math.pow(2, h - 1) - 2 < need ? 'too few' : 'enough'}.`,
          `2^${h} − 2 = ${Math.pow(2, h) - 2}, which covers ${need}.`,
          `So ${h} host bits are needed, giving a prefix of 32 − ${h} = /${p}, mask ${maskStr(p)}.`,
          `That leaves ${Math.pow(2, h) - 2 - need} addresses spare — the smallest waste any valid answer can have, because subnet sizes only come in powers of two.`,
        ],
        trap: 'Round UP to the next power of two, never down. A /' + (p + 1) + ' holds only ' + (Math.pow(2, h - 1) - 2) + ' hosts and is the planted wrong answer.',
      };
    },
  });

  DRILLS.push({
    id: 'summary-route', group: G_IP, paper: 'TECH1', unit: '1', sub: 'Sub-netting',
    title: 'Summarise contiguous networks into one route',
    blurb: 'Route summarisation / supernetting — find the common prefix.',
    gen(rnd) {
      const count = pick(rnd, [2, 4, 8]);
      const bits = Math.log2(count);
      const second = randInt(rnd, 16, 31);
      const start = randInt(rnd, 0, Math.floor(240 / count)) * count;   // aligned on a block boundary
      const nets = [];
      for (let i = 0; i < count; i++) nets.push(`172.${second}.${start + i}.0/24`);
      const p = 24 - bits;
      const correct = `172.${second}.${start}.0/${p}`;
      const { opts, ans } = build(correct, [
        `172.${second}.${start}.0/24`,                       // did not summarise at all
        `172.${second}.${start}.0/${p - 1}`,                 // summarised too far
        `172.${second}.${start}.0/${p + 1}`,                 // covers only half the range
        `172.${second}.0.0/16`,                              // over-summarised to the classful boundary
        `172.${second}.${start + count - 1}.0/${p}`,
      ], rnd);
      return {
        q: `A router advertises these networks: ${nets.join(', ')}. Which single summary route covers exactly these ${count} networks and no others?`,
        opts, ans,
        steps: [
          `Summarising ${count} contiguous networks removes log2(${count}) = ${bits} bit${bits === 1 ? '' : 's'} from the prefix.`,
          `The third octets are ${start} to ${start + count - 1}. In binary: ${start.toString(2).padStart(8, '0')} to ${(start + count - 1).toString(2).padStart(8, '0')}.`,
          `The first ${8 - bits} bits of that octet are identical in all ${count}; only the last ${bits} vary.`,
          `So the common prefix is 24 − ${bits} = /${p}, and the summary route is ${correct}.`,
          `The block must be aligned: ${start} is divisible by ${count}, which is what makes a single clean summary possible.`,
        ],
        trap: 'A summary that is one bit shorter (/' + (p - 1) + ') also covers all of them, but it covers ' + count + ' extra networks too — "exactly these and no others" rules it out.',
      };
    },
  });

  DRILLS.push({
    id: 'address-class', group: G_IP, paper: 'TECH1', unit: '1', sub: 'Sub-netting',
    title: 'Class, default mask and public vs private',
    blurb: 'First-octet ranges, the 127 exception, and the three RFC 1918 blocks.',
    gen(rnd) {
      const kinds = [
        { first: randInt(rnd, 1, 126), cls: 'A', p: 8 },
        { first: randInt(rnd, 128, 191), cls: 'B', p: 16 },
        { first: randInt(rnd, 192, 223), cls: 'C', p: 24 },
        { first: randInt(rnd, 224, 239), cls: 'D (multicast)', p: null },
        { first: randInt(rnd, 240, 254), cls: 'E (experimental)', p: null },
      ];
      const k = pick(rnd, kinds);
      const ip = `${k.first}.${randInt(rnd, 0, 255)}.${randInt(rnd, 0, 255)}.${randInt(rnd, 1, 254)}`;
      const correct = k.p ? `Class ${k.cls}, default mask ${maskStr(k.p)}` : `Class ${k.cls} — no default mask, not assigned to hosts`;
      const { opts, ans } = build(correct, [
        'Class A, default mask 255.0.0.0',
        'Class B, default mask 255.255.0.0',
        'Class C, default mask 255.255.255.0',
        'Class D (multicast) — no default mask, not assigned to hosts',
        'Class E (experimental) — no default mask, not assigned to hosts',
      ], rnd);
      return {
        q: `In the classful scheme, what is the address class and default mask of ${ip}?`,
        opts, ans,
        steps: [
          `Classful addressing is decided entirely by the first octet, here ${k.first}.`,
          `Ranges: A is 1–126, B is 128–191, C is 192–223, D is 224–239 (multicast), E is 240–255 (experimental).`,
          `${k.first} falls in the ${k.cls.split(' ')[0]} range.`,
          k.p ? `Class ${k.cls} carries a default mask of ${maskStr(k.p)} (/${k.p}).`
            : `Classes D and E have no network/host split, so no default mask, and neither is assigned to a host interface.`,
          `127 is missing from every class on purpose: it is the loopback block, which is why Class A stops at 126 rather than 127.`,
        ],
      };
    },
  });

  DRILLS.push({
    id: 'private-public', group: G_IP, paper: 'TECH1', unit: '1', sub: 'Sub-netting',
    title: 'Private, public, loopback or APIPA?',
    blurb: 'The 172.16–172.31 boundary is where this is usually lost.',
    gen(rnd) {
      const kinds = [
        { ip: `10.${randInt(rnd, 0, 255)}.${randInt(rnd, 0, 255)}.${randInt(rnd, 1, 254)}`, a: 'Private (RFC 1918) — needs NAT to reach the Internet' },
        { ip: `192.168.${randInt(rnd, 0, 255)}.${randInt(rnd, 1, 254)}`, a: 'Private (RFC 1918) — needs NAT to reach the Internet' },
        { ip: `172.${randInt(rnd, 16, 31)}.${randInt(rnd, 0, 255)}.${randInt(rnd, 1, 254)}`, a: 'Private (RFC 1918) — needs NAT to reach the Internet' },
        { ip: `172.${pick(rnd, [1, 5, 12, 15, 32, 40, 60])}.${randInt(rnd, 0, 255)}.${randInt(rnd, 1, 254)}`, a: 'Public — routable on the Internet' },
        { ip: `169.254.${randInt(rnd, 1, 254)}.${randInt(rnd, 1, 254)}`, a: 'APIPA / link-local — the host failed to get an address from DHCP' },
        { ip: `127.0.0.${randInt(rnd, 1, 9)}`, a: 'Loopback — refers to the local machine itself' },
        { ip: `${pick(rnd, [8, 49, 103, 202])}.${randInt(rnd, 0, 255)}.${randInt(rnd, 0, 255)}.${randInt(rnd, 1, 254)}`, a: 'Public — routable on the Internet' },
      ];
      const k = pick(rnd, kinds);
      const { opts, ans } = build(k.a, [
        'Private (RFC 1918) — needs NAT to reach the Internet',
        'Public — routable on the Internet',
        'APIPA / link-local — the host failed to get an address from DHCP',
        'Loopback — refers to the local machine itself',
      ], rnd);
      return {
        q: `How would you classify the address ${k.ip}?`,
        opts, ans,
        steps: [
          `The three private ranges are 10.0.0.0/8, 172.16.0.0 through 172.31.255.255, and 192.168.0.0/16.`,
          `169.254.x.x is APIPA: a Windows host assigns it to itself when no DHCP server answers. Seeing it on a workstation is a DHCP fault, not a configuration choice.`,
          `127.x.x.x is loopback; 127.0.0.1 tests the local TCP/IP stack without touching the network.`,
          `${k.ip} is therefore: ${k.a}.`,
        ],
        trap: 'The private 172 block is only 172.16 to 172.31 — a quarter of 172.x. 172.15.x.x and 172.32.x.x are public addresses, and this is the most frequently missed line in the whole topic.',
      };
    },
  });

  /* ================================================================= IPv6 */

  // Build an IPv6 address with exactly one run of zero hextets, starting at
  // index >= 2 so the "two double-colons" distractor is always constructible.
  function genV6(rnd) {
    const arr = new Array(8);
    for (let i = 0; i < 8; i++) arr[i] = randInt(rnd, 0, 0xFFFF);
    arr[0] = pick(rnd, [0x2001, 0x2404, 0x2620, 0x2a03]);
    // Deliberately below 0x1000, so this hextet always carries a leading zero.
    // Without that guarantee an address can come out with every hextet already
    // four digits wide, and then "leading zeros wrongly retained" is textually
    // identical to the correct answer — a duplicate option, caught by fuzzing.
    arr[1] = pick(rnd, [0x0db8, 0x0f8b, 0x0a2c, 0x00f3, 0x0e41]);
    const runStart = randInt(rnd, 2, 5);
    const runLen = Math.min(8 - runStart - 1, randInt(rnd, 2, 3));
    for (let i = runStart; i < runStart + runLen; i++) arr[i] = 0;
    // guarantee the remaining hextets are non-zero so there is exactly one run
    for (let i = 0; i < 8; i++) {
      if (i < runStart || i >= runStart + runLen) { if (arr[i] === 0) arr[i] = randInt(rnd, 1, 0xFFFF); }
    }
    return { arr, runStart, runLen };
  }
  const v6Full = arr => arr.map(h => h.toString(16).padStart(4, '0')).join(':');
  function v6Compress(arr) {
    const s = arr.map(h => h.toString(16));
    let bi = -1, bl = 0, i = 0;
    while (i < 8) {
      if (s[i] === '0') { let j = i; while (j < 8 && s[j] === '0') j++; if (j - i > bl) { bl = j - i; bi = i; } i = j; }
      else i++;
    }
    if (bl < 2) return s.join(':');
    return s.slice(0, bi).join(':') + '::' + s.slice(bi + bl).join(':');
  }

  DRILLS.push({
    id: 'ipv6-compress', group: G_V6, paper: 'TECH1', unit: '1', sub: 'IPv6',
    title: 'Compress an IPv6 address',
    blurb: 'Drop leading zeros, then one :: for the longest zero run — once only.',
    gen(rnd) {
      const { arr, runStart, runLen } = genV6(rnd);
      const full = v6Full(arr);
      const comp = v6Compress(arr);
      // padded-but-double-coloned: leading zeros wrongly retained
      const padded = arr.map(h => h.toString(16).padStart(4, '0'));
      const d1 = padded.slice(0, runStart).join(':') + '::' + padded.slice(runStart + runLen).join(':');
      // two double colons — always constructible because runStart >= 2
      const left = arr.slice(0, runStart).map(h => h.toString(16));
      const d2 = left.slice(0, -1).join(':') + '::' + left.slice(-1) + '::' + arr.slice(runStart + runLen).map(h => h.toString(16)).join(':');
      // leading zeros dropped but no :: at all — valid, just not shortest
      const d3 = arr.map(h => h.toString(16)).join(':');
      const { opts, ans } = build(comp, [d1, d2, d3], rnd);
      return {
        q: `Written in its shortest valid form, the IPv6 address ${full} is:`,
        opts, ans,
        steps: [
          `Rule 1 — drop leading zeros inside each hextet: ${d3}.`,
          `Rule 2 — replace one run of consecutive all-zero hextets with "::". The longest run here is ${runLen} hextets, at position ${runStart + 1}.`,
          `Applying both gives ${comp}.`,
          `"::" may appear at most ONCE in an address. Two of them would be ambiguous — a parser could not tell how many zero hextets belong to each.`,
        ],
        trap: 'Only LEADING zeros go. 0db8 becomes db8, but 6800 stays 6800 — dropping the trailing zeros would change the value.',
      };
    },
  });

  DRILLS.push({
    id: 'ipv6-expand', group: G_V6, paper: 'TECH1', unit: '1', sub: 'IPv6',
    title: 'Expand a compressed IPv6 address',
    blurb: 'Work out how many zero hextets the :: is standing in for.',
    gen(rnd) {
      const { arr, runStart, runLen } = genV6(rnd);
      const full = v6Full(arr);
      const comp = v6Compress(arr);
      const short = arr.map(h => h.toString(16));
      // one hextet too few / too many in the expansion
      const less = arr.slice(0, runStart).concat(new Array(runLen - 1).fill(0), arr.slice(runStart + runLen));
      const more = arr.slice(0, runStart).concat(new Array(runLen + 1).fill(0), arr.slice(runStart + runLen));
      const d1 = less.map(h => h.toString(16).padStart(4, '0')).join(':');
      const d2 = more.map(h => h.toString(16).padStart(4, '0')).join(':');
      const d3 = short.slice(0, runStart).concat(new Array(runLen).fill('0000'), short.slice(runStart + runLen)).join(':');
      const { opts, ans } = build(full, [d1, d2, d3], rnd);
      return {
        q: `Written out in full, with every hextet padded to four digits, the address ${comp} is:`,
        opts, ans,
        steps: [
          `An IPv6 address always has exactly 8 hextets. Count what is written either side of the "::".`,
          `${comp} shows ${runStart} hextet${runStart === 1 ? '' : 's'} before and ${8 - runStart - runLen} after, which is ${8 - runLen} in total.`,
          `So the "::" stands in for 8 − ${8 - runLen} = ${runLen} all-zero hextets.`,
          `Restore those, then pad every hextet back to four hex digits: ${full}.`,
        ],
        trap: 'Padding is per hextet, to exactly four digits. An answer with the right hextets but the wrong count of zero groups is the usual miss — always recount to 8.',
      };
    },
  });

  DRILLS.push({
    id: 'ipv6-type', group: G_V6, paper: 'TECH1', unit: '1', sub: 'IPv6',
    title: 'Identify the IPv6 address type',
    blurb: 'Global unicast, link-local, multicast, loopback, unique local.',
    gen(rnd) {
      const kinds = [
        { ip: `2001:db8:${randInt(rnd, 1, 0xffff).toString(16)}::${randInt(rnd, 1, 0xffff).toString(16)}`, a: 'Global unicast (2000::/3) — routable on the Internet' },
        { ip: `2404:6800::${randInt(rnd, 1, 0xffff).toString(16)}`, a: 'Global unicast (2000::/3) — routable on the Internet' },
        { ip: `fe80::${randInt(rnd, 1, 0xffff).toString(16)}:${randInt(rnd, 1, 0xffff).toString(16)}`, a: 'Link-local (fe80::/10) — valid on one link only, never routed' },
        { ip: `ff02::${pick(rnd, [1, 2, 5])}`, a: 'Multicast (ff00::/8) — delivered to a group of interfaces' },
        { ip: `::1`, a: 'Loopback (::1) — the local machine itself' },
        { ip: `fd${randInt(rnd, 16, 255).toString(16)}:${randInt(rnd, 1, 0xffff).toString(16)}::${randInt(rnd, 1, 0xffff).toString(16)}`, a: 'Unique local (fc00::/7) — the IPv6 equivalent of a private address' },
      ];
      const k = pick(rnd, kinds);
      const { opts, ans } = build(k.a, [
        'Global unicast (2000::/3) — routable on the Internet',
        'Link-local (fe80::/10) — valid on one link only, never routed',
        'Multicast (ff00::/8) — delivered to a group of interfaces',
        'Loopback (::1) — the local machine itself',
        'Unique local (fc00::/7) — the IPv6 equivalent of a private address',
      ], rnd);
      return {
        q: `What kind of IPv6 address is ${k.ip}?`,
        opts, ans,
        steps: [
          `IPv6 type is read straight off the leading bits, so learn the prefixes rather than reasoning about them.`,
          `2000::/3 global unicast · fe80::/10 link-local · fc00::/7 unique local · ff00::/8 multicast · ::1 loopback · :: unspecified.`,
          `${k.ip} matches: ${k.a}.`,
          `Every IPv6 interface holds a link-local address whether or not it has a global one — that is why fe80:: shows up constantly in real output.`,
        ],
        trap: 'IPv6 has NO broadcast address. Any option offering one is wrong by construction; multicast (ff02::1, all nodes) does that job.',
      };
    },
  });

  /* ====================================================== NUMBER SYSTEMS */

  const BASES = { 2: 'binary', 8: 'octal', 10: 'decimal', 16: 'hexadecimal' };
  const inBase = (n, b) => b === 16 ? n.toString(16).toUpperCase() : n.toString(b);

  DRILLS.push({
    id: 'base-convert', group: G_NUM, paper: 'TECH1', unit: '1', sub: 'Basic Computer System',
    title: 'Convert between number bases',
    blurb: 'Binary, octal, decimal and hexadecimal, in every direction.',
    gen(rnd) {
      const pairs = [[10, 2], [10, 16], [10, 8], [2, 10], [16, 10], [8, 10], [2, 16], [16, 2], [2, 8]];
      const [from, to] = pick(rnd, pairs);
      const n = randInt(rnd, 18, 255);
      const src = inBase(n, from);
      const correct = inBase(n, to);
      const cands = [
        inBase(n, to === 16 ? 8 : 16),               // converted to the wrong base
        inBase(n + 1, to),
        inBase(n - 1, to),
        String(correct).split('').reverse().join(''),
        inBase(parseInt(src, 10) || n, to),          // read the source as decimal
      ];
      const { opts, ans } = build(correct, cands, rnd);
      const dec = n;
      const steps = [
        `Convert to decimal first if you are not going straight there — decimal is the safe hub between any two bases.`,
      ];
      if (from !== 10) {
        const digits = String(src).split('');
        steps.push(`${src} in base ${from} = ` + digits.map((d, i) =>
          `${parseInt(d, from)}×${from}^${digits.length - 1 - i}`).join(' + ') + ` = ${dec} in decimal.`);
      } else {
        steps.push(`The source ${src} is already decimal: ${dec}.`);
      }
      if (to === 2 || to === 8 || to === 16) {
        steps.push(`Now divide ${dec} by ${to} repeatedly and read the remainders bottom-up: ${(() => {
          let v = dec; const rem = [];
          while (v > 0) { rem.push(inBase(v % to, to)); v = Math.floor(v / to); }
          return rem.join(', ') + ' → reading upward gives ' + correct;
        })()}.`);
      } else {
        steps.push(`Target base is decimal, so the answer is ${correct}.`);
      }
      if ((from === 2 && to === 16) || (from === 16 && to === 2)) {
        steps.push(`Faster route for binary↔hex: never go through decimal. One hex digit is exactly four bits, so group the binary into nibbles from the RIGHT and convert each one.`);
      }
      if ((from === 2 && to === 8)) {
        steps.push(`Faster route for binary↔octal: one octal digit is exactly three bits, so group into threes from the right.`);
      }
      return {
        q: `Convert ${src} from ${BASES[from]} to ${BASES[to]}.`,
        opts, ans, steps,
        trap: 'Group from the RIGHT, never the left. Padding the leftmost group with zeros is correct; padding the rightmost one changes the value.',
      };
    },
  });

  DRILLS.push({
    id: 'binary-hex-nibble', group: G_NUM, paper: 'TECH1', unit: '1', sub: 'Basic Computer System',
    title: 'Binary to hex by nibbles',
    blurb: 'The eight-bit-to-two-hex-digits drill, with the reversed-nibble trap.',
    gen(rnd) {
      const hi = randInt(rnd, 10, 15), lo = randInt(rnd, 10, 15);
      if (hi === lo) return this.gen(rnd);   // reversal distractor needs hi ≠ lo
      const n = hi * 16 + lo;
      const bin = n.toString(2).padStart(8, '0');
      const correct = '0x' + n.toString(16).toUpperCase();
      const swapped = '0x' + (lo * 16 + hi).toString(16).toUpperCase();
      const { opts, ans } = build(correct, [
        swapped,                                                   // nibbles read in the wrong order
        '0x' + (n + 1).toString(16).toUpperCase(),
        '0x' + parseInt(bin, 10).toString(16).toUpperCase().slice(0, 2),
        '0x' + (n >> 1).toString(16).toUpperCase(),
      ], rnd);
      return {
        q: `The binary number ${bin}₂ expressed in hexadecimal is:`,
        opts, ans,
        steps: [
          `Split the eight bits into two nibbles from the right: ${bin.slice(0, 4)} ${bin.slice(4)}.`,
          `${bin.slice(0, 4)} = ${hi} = ${hi.toString(16).toUpperCase()} in hex.`,
          `${bin.slice(4)} = ${lo} = ${lo.toString(16).toUpperCase()} in hex.`,
          `Reading left to right, exactly as the bits are written: ${correct}.`,
          `A group of four bits is a nibble, and one nibble is always exactly one hex digit. That is the whole reason hex is used to write binary.`,
        ],
        trap: `${swapped} is the planted answer — the two nibbles converted correctly but written in the wrong order. Keep them in the order the bits appear.`,
      };
    },
  });

  DRILLS.push({
    id: 'twos-complement', group: G_NUM, paper: 'TECH1', unit: '1', sub: 'Basic Computer System',
    title: "8-bit two's complement",
    blurb: 'How a computer actually stores a negative integer.',
    gen(rnd) {
      const n = randInt(rnd, 3, 120);
      const mag = n.toString(2).padStart(8, '0');
      const ones = mag.split('').map(b => b === '0' ? '1' : '0').join('');
      const twos = (256 - n).toString(2).padStart(8, '0');
      const signMag = '1' + mag.slice(1);
      const { opts, ans } = build(twos, [
        ones,                                    // stopped at one's complement
        signMag,                                 // used sign-magnitude
        mag,                                     // gave the positive value
        (256 - n + 1).toString(2).padStart(8, '0'),
      ], rnd);
      return {
        q: `How is −${n} represented in 8-bit two's complement?`,
        opts, ans,
        steps: [
          `Start from +${n} in 8 bits: ${mag}.`,
          `Invert every bit (this is the one's complement): ${ones}.`,
          `Add 1: ${ones} + 1 = ${twos}.`,
          `Check: ${twos} read as unsigned is ${256 - n}, and ${256 - n} + ${n} = 256, which overflows an 8-bit register back to zero. That is exactly what "negative ${n}" has to mean.`,
          `The leading bit is 1, which is the sign bit — in two's complement an 8-bit value covers −128 to +127.`,
        ],
        trap: "One's complement (invert only) and sign-magnitude (flip the top bit) are both offered as options. Two's complement is invert AND add one, and it is the only one of the three modern hardware uses.",
      };
    },
  });

  DRILLS.push({
    id: 'storage-units', group: G_NUM, paper: 'TECH1', unit: '1', sub: 'Basic Computer System',
    title: 'Storage unit arithmetic',
    blurb: 'Powers of 1024, and where the disk manufacturer\'s 1000 comes in.',
    gen(rnd) {
      const units = [['KB', 'MB', 1024], ['MB', 'GB', 1024], ['GB', 'TB', 1024], ['bytes', 'KB', 1024]];
      const [small, big, f] = pick(rnd, units);
      const n = pick(rnd, [2, 3, 4, 5, 8, 10, 16]);
      const correct = (n * f).toLocaleString('en-US');
      const { opts, ans } = build(correct, [
        (n * 1000).toLocaleString('en-US'),          // decimal SI factor
        (n * f * f).toLocaleString('en-US'),         // squared the factor
        (n / f).toFixed(4),
        (n * 512).toLocaleString('en-US'),
      ], rnd);
      return {
        q: `Using binary (power-of-two) units, how many ${small} are there in ${n} ${big}?`,
        opts, ans,
        steps: [
          `Each step up the storage ladder is a factor of 1024, which is 2^10 — not 1000.`,
          `${n} ${big} × 1024 = ${correct} ${small}.`,
          `The ladder: 1 byte = 8 bits, 1 KB = 1024 bytes, 1 MB = 1024 KB, 1 GB = 1024 MB, 1 TB = 1024 GB.`,
          `Why 1024: memory is addressed in binary, so capacities land on powers of two. 2^10 = 1024 is simply the closest one to a thousand.`,
        ],
        trap: 'Drive manufacturers use the decimal 1000 while operating systems report the binary 1024 — which is why a "1 TB" disk shows as about 931 GB in Windows. Read which convention the question wants.',
      };
    },
  });

  DRILLS.push({
    id: 'bit-capacity', group: G_NUM, paper: 'TECH1', unit: '1', sub: 'Basic Computer System',
    title: 'How much can n bits represent?',
    blurb: '2^n distinct values — the rule behind address spaces, colour depth and masks.',
    gen(rnd) {
      const mode = pick(rnd, ['values', 'max', 'bits']);
      const n = pick(rnd, [4, 6, 8, 10, 12, 16]);
      if (mode === 'bits') {
        const vals = Math.pow(2, n);
        const { opts, ans } = build(n, [n - 1, n + 1, n * 2, vals / 2], rnd);
        return {
          q: `How many bits are needed to represent ${vals.toLocaleString('en-US')} distinct values?`,
          opts, ans,
          steps: [
            `n bits give 2^n distinct combinations.`,
            `Solve 2^n = ${vals.toLocaleString('en-US')}.`,
            `2^${n} = ${vals.toLocaleString('en-US')}, so n = ${n}.`,
            `Familiar cases worth knowing cold: 8 bits = 256 values (one byte, one ASCII character), 10 bits = 1024, 16 bits = 65,536, 32 bits = about 4.3 billion (the size of the IPv4 address space).`,
          ],
        };
      }
      const vals = Math.pow(2, n);
      const correct = mode === 'values' ? vals.toLocaleString('en-US') : (vals - 1).toLocaleString('en-US');
      const { opts, ans } = build(correct, [
        vals.toLocaleString('en-US'),
        (vals - 1).toLocaleString('en-US'),
        (vals - 2).toLocaleString('en-US'),
        (n * 2).toLocaleString('en-US'),
        Math.pow(2, n - 1).toLocaleString('en-US'),
      ], rnd);
      return {
        q: mode === 'values'
          ? `How many distinct values can be represented in ${n} bits?`
          : `What is the largest unsigned integer that can be stored in ${n} bits?`,
        opts, ans,
        steps: [
          `Each bit doubles the number of combinations, so ${n} bits give 2^${n} = ${vals.toLocaleString('en-US')} distinct values.`,
          mode === 'values'
            ? `The question asks for the count of values, so the answer is ${vals.toLocaleString('en-US')}.`
            : `Those values run from 0 up to 2^${n} − 1, so the largest is ${(vals - 1).toLocaleString('en-US')}.`,
          `Count of values versus largest value differ by exactly 1, because the range starts at 0 and not at 1.`,
        ],
        trap: 'Read whether the question wants how MANY values (2^n) or the LARGEST value (2^n − 1). Both are always offered.',
      };
    },
  });

  DRILLS.push({
    id: 'address-lines', group: G_NUM, paper: 'TECH1', unit: '1', sub: 'Basic Computer System',
    title: 'Address lines to addressable memory',
    blurb: 'n address lines reach 2^n locations — the rule behind every memory-size question.',
    gen(rnd) {
      const n = pick(rnd, [10, 12, 16, 20, 22, 24, 32]);
      const locs = Math.pow(2, n);
      const human = locs >= 1073741824 ? (locs / 1073741824) + ' GB'
        : locs >= 1048576 ? (locs / 1048576) + ' MB'
          : locs >= 1024 ? (locs / 1024) + ' KB' : locs + ' bytes';
      const { opts, ans } = build(human, [
        (locs >= 1048576 ? (locs / 1048576) + ' MB' : (locs / 1024) + ' KB'),
        (Math.pow(2, n - 1) / 1048576) + ' MB',
        (Math.pow(2, n + 1) / 1048576) + ' MB',
        (n * 1024) + ' KB',
        (n) + ' MB',
      ], rnd);
      return {
        q: `A memory chip has ${n} address lines and an 8-bit (one byte) data bus. How much memory can it address?`,
        opts, ans,
        steps: [
          `Each address line carries one bit, so ${n} lines can express 2^${n} distinct addresses.`,
          `2^${n} = ${locs.toLocaleString('en-US')} locations.`,
          `The data bus is 8 bits, so each location holds one byte: ${locs.toLocaleString('en-US')} bytes.`,
          `Converting: ${locs.toLocaleString('en-US')} bytes = ${human}.`,
          `Worth memorising: 2^10 = 1 KB, 2^20 = 1 MB, 2^30 = 1 GB, 2^32 = 4 GB. That last one is why 32-bit systems cap out at 4 GB of RAM.`,
        ],
        trap: 'Address lines set how MANY locations exist; the data bus width sets how BIG each location is. Total capacity is the product of the two.',
      };
    },
  });

  /* ================================================ DBMS: NORMALISATION */

  /* Hand-authored verbatim. Randomising attribute names into a dependency
     structure is how you silently break the stated answer, so each scenario is
     a fixed, self-consistent case; the RNG only chooses among them. */
  const NF_CASES = [
    {
      nf: 'Unnormalised (not even in 1NF)',
      table: 'STUDENT(RollNo, Name, PhoneNumbers)',
      detail: 'One row reads: 21, Lalrinawma, "9862011234, 9436022345" — two phone numbers in a single column.',
      why: 'PhoneNumbers holds more than one value in one cell, so the attribute is not atomic.',
      fix: 'Split it out: either one row per phone number, or a separate STUDENT_PHONE(RollNo, PhoneNumber) table. The second is preferred — repeating rows would duplicate Name.',
    },
    {
      nf: 'Unnormalised (not even in 1NF)',
      table: 'EMPLOYEE(EmpID, Name, Skill1, Skill2, Skill3)',
      detail: 'Skills are stored in three numbered columns, most of them empty.',
      why: 'Skill1/Skill2/Skill3 is a repeating group. 1NF forbids repeating groups just as firmly as it forbids multivalued cells.',
      fix: 'Create EMPLOYEE_SKILL(EmpID, Skill) with a composite key. An employee can then hold any number of skills without altering the schema.',
    },
    {
      nf: '1NF only',
      table: 'ENROLMENT(StudentID, CourseID, StudentName, Grade)',
      detail: 'Primary key is the composite (StudentID, CourseID). StudentID → StudentName. (StudentID, CourseID) → Grade.',
      why: 'StudentName depends on StudentID alone, which is only part of the composite key. That is a partial dependency, and 2NF forbids it.',
      fix: 'Split into STUDENT(StudentID, StudentName) and ENROLMENT(StudentID, CourseID, Grade). Grade genuinely needs both halves of the key, so it stays.',
    },
    {
      nf: '1NF only',
      table: 'ORDER_LINE(OrderID, ProductID, ProductName, Quantity)',
      detail: 'Primary key is (OrderID, ProductID). ProductID → ProductName. (OrderID, ProductID) → Quantity.',
      why: 'ProductName depends on ProductID only, half of the composite key — a partial dependency, so the relation fails 2NF.',
      fix: 'Move ProductName into PRODUCT(ProductID, ProductName). Quantity depends on the whole key and remains in ORDER_LINE.',
    },
    {
      nf: '2NF only',
      table: 'EMPLOYEE(EmpID, EmpName, DeptID, DeptName)',
      detail: 'Primary key is EmpID alone. EmpID → DeptID and DeptID → DeptName.',
      why: 'DeptName depends on EmpID only through DeptID — a transitive dependency, which 3NF forbids. There is no partial dependency to worry about because the key is a single attribute, so 2NF is satisfied.',
      fix: 'Split into EMPLOYEE(EmpID, EmpName, DeptID) and DEPARTMENT(DeptID, DeptName). Renaming a department then touches exactly one row.',
    },
    {
      nf: '2NF only',
      table: 'BOOK(ISBN, Title, PublisherID, PublisherCity)',
      detail: 'Primary key is ISBN. ISBN → PublisherID and PublisherID → PublisherCity.',
      why: 'PublisherCity reaches the key only via PublisherID, so it is transitively dependent. A single-attribute key means 2NF cannot be violated, but 3NF is.',
      fix: 'Split into BOOK(ISBN, Title, PublisherID) and PUBLISHER(PublisherID, PublisherCity).',
    },
    {
      nf: '3NF (and BCNF)',
      table: 'DEPARTMENT(DeptID, DeptName, HeadEmpID)',
      detail: 'Primary key is DeptID. DeptName and HeadEmpID each depend on DeptID directly, and on nothing else.',
      why: 'The key is a single attribute, so no partial dependency is possible; no non-key attribute determines another, so no transitive dependency; and DeptID, the only determinant, is a candidate key, which satisfies BCNF too.',
      fix: 'Nothing to do. This relation is already in BCNF.',
    },
    {
      nf: '3NF (and BCNF)',
      table: 'INVOICE_LINE(InvoiceID, LineNo, ProductID, Quantity, UnitPrice)',
      detail: 'Primary key is (InvoiceID, LineNo). Every non-key attribute depends on the whole key and on nothing else — UnitPrice is the price charged on this line, not the product\'s catalogue price.',
      why: 'No non-key attribute depends on part of the key, and none determines another. The only determinant is the full composite key, which is a candidate key.',
      fix: 'Nothing to do. Note the reasoning turns on UnitPrice being line-specific — if it were the catalogue price, ProductID → UnitPrice would make this 2NF only.',
    },
    {
      nf: '3NF but not BCNF',
      table: 'CLASS(StudentID, Subject, Teacher)',
      detail: 'Each teacher teaches exactly one subject, and a student takes one teacher per subject. Candidate keys are (StudentID, Subject) and (StudentID, Teacher). The dependency Teacher → Subject also holds.',
      why: 'Every attribute is part of some candidate key, so there are no non-prime attributes to be partially or transitively dependent — it satisfies 3NF. But Teacher is a determinant and Teacher is not a candidate key on its own, which is exactly what BCNF forbids.',
      fix: 'Split into TEACHER(Teacher, Subject) and CLASS(StudentID, Teacher). BCNF decomposition here loses the ability to enforce the original key as a single constraint — the standard trade-off.',
    },
  ];

  DRILLS.push({
    id: 'highest-normal-form', group: G_DB, paper: 'TECH1', unit: '5', sub: 'The Relational Model and Normalization',
    title: 'What is the highest normal form?',
    blurb: 'Read the dependencies, name the highest form the relation satisfies.',
    gen(rnd) {
      const c = pick(rnd, NF_CASES);
      const { opts, ans } = build(c.nf, [
        'Unnormalised (not even in 1NF)',
        '1NF only',
        '2NF only',
        '3NF (and BCNF)',
        '3NF but not BCNF',
      ], rnd);
      return {
        q: `Consider ${c.table}. ${c.detail}\n\nWhat is the highest normal form this relation satisfies?`,
        opts, ans,
        steps: [
          `1NF: every attribute atomic, no repeating groups.`,
          `2NF: 1NF, plus no non-key attribute depends on only PART of a composite key (partial dependency). A relation with a single-attribute key is automatically in 2NF.`,
          `3NF: 2NF, plus no non-key attribute depends on another non-key attribute (transitive dependency).`,
          `BCNF: every determinant is a candidate key — stricter than 3NF, and it only bites when candidate keys overlap.`,
          `Here: ${c.why}`,
          `Fix: ${c.fix}`,
        ],
        trap: 'Work upward and stop at the first violation. The highest normal form a relation satisfies is one step below the first rule it breaks.',
      };
    },
  });

  DRILLS.push({
    id: 'dependency-type', group: G_DB, paper: 'TECH1', unit: '5', sub: 'The Relational Model and Normalization',
    title: 'Name the functional dependency',
    blurb: 'Partial, transitive, full or trivial — the vocabulary the question will use.',
    gen(rnd) {
      const cases = [
        {
          setup: 'ENROLMENT(StudentID, CourseID, StudentName) with primary key (StudentID, CourseID), and StudentID → StudentName.',
          a: 'Partial dependency',
          why: 'StudentName depends on StudentID, which is only part of the composite primary key. A dependency on part of a key is partial by definition, and it is exactly what 2NF exists to remove.',
        },
        {
          setup: 'EMPLOYEE(EmpID, DeptID, DeptName) with primary key EmpID, where EmpID → DeptID and DeptID → DeptName.',
          a: 'Transitive dependency',
          why: 'DeptName does not depend on the key directly; it depends on DeptID, which itself depends on the key. That chain is a transitive dependency, and 3NF removes it.',
        },
        {
          setup: 'ORDER_LINE(OrderID, ProductID, Quantity) with primary key (OrderID, ProductID), and (OrderID, ProductID) → Quantity, where neither half of the key determines Quantity alone.',
          a: 'Full functional dependency',
          why: 'Quantity needs the whole composite key and no proper subset of it will do. This is what a well-normalised composite-key relation looks like.',
        },
        {
          setup: 'STUDENT(RollNo, Name) with primary key RollNo, and the dependency (RollNo, Name) → Name.',
          a: 'Trivial dependency',
          why: 'The right-hand side is contained in the left-hand side. X → Y where Y is a subset of X always holds and tells you nothing about the design.',
        },
      ];
      const c = pick(rnd, cases);
      const { opts, ans } = build(c.a, [
        'Partial dependency', 'Transitive dependency', 'Full functional dependency', 'Trivial dependency',
      ], rnd);
      return {
        q: `In ${c.setup}\n\nWhat kind of functional dependency is described?`,
        opts, ans,
        steps: [
          `Partial: a non-key attribute depends on PART of a composite key. Removed by 2NF. Impossible when the key is a single attribute.`,
          `Transitive: key → A → B, so B depends on the key only indirectly. Removed by 3NF.`,
          `Full: the dependent attribute needs the ENTIRE key, no proper subset. This is the healthy case.`,
          `Trivial: X → Y where Y is already inside X. Always true, never informative.`,
          `Here: ${c.why}`,
        ],
      };
    },
  });

  DRILLS.push({
    id: 'er-to-tables', group: G_DB, paper: 'TECH1', unit: '5', sub: 'Data Models into Database Designs',
    title: 'How many tables does this ER diagram become?',
    blurb: 'Mapping entities, relationships and multivalued attributes to relations.',
    gen(rnd) {
      const cases = [
        {
          setup: 'Two entities, DOCTOR and PATIENT, joined by a many-to-many relationship TREATS which carries its own attribute, TreatmentDate.',
          n: 3,
          why: 'Each entity becomes a table, and an M:N relationship always needs a third junction table. TreatmentDate has nowhere else to live — it belongs to the pairing, not to either entity.',
        },
        {
          setup: 'Two entities, DEPARTMENT and EMPLOYEE, joined by a one-to-many relationship (one department has many employees).',
          n: 2,
          why: 'A 1:N relationship needs no table of its own. Post the key of the "one" side as a foreign key on the "many" side — DeptID goes into EMPLOYEE.',
        },
        {
          setup: 'A single entity EMPLOYEE with attributes EmpID, Name and PhoneNumbers, where PhoneNumbers is multivalued.',
          n: 2,
          why: 'A multivalued attribute cannot be stored in a column, because 1NF requires atomic values. It becomes its own table, keyed on the owner entity\'s key plus the attribute.',
        },
        {
          setup: 'A strong entity LOAN and a weak entity PAYMENT, which is identified by LOAN plus its own PaymentNo.',
          n: 2,
          why: 'A weak entity becomes a table of its own, with a composite primary key made of the owner\'s key plus the weak entity\'s discriminator (LoanID, PaymentNo). The identifying relationship itself needs no separate table.',
        },
        {
          setup: 'Three entities — SUPPLIER, PART and PROJECT — joined by one ternary many-to-many relationship SUPPLIES.',
          n: 4,
          why: 'Three entity tables, plus one relationship table whose key is the combination of all three entity keys. A ternary M:N relationship cannot be decomposed into three binary ones without losing information.',
        },
      ];
      const c = pick(rnd, cases);
      const { opts, ans } = build(String(c.n), ['1', '2', '3', '4', '5'], rnd);
      return {
        q: `${c.setup}\n\nWhen this is mapped to a relational schema, how many tables result?`,
        opts, ans,
        steps: [
          `Mapping rules, applied in order:`,
          `Every strong entity becomes one table. Every weak entity becomes one table, keyed on the owner's key plus its discriminator.`,
          `A 1:1 or 1:N relationship becomes a foreign key, NOT a table. Post the key of the "one" side onto the "many" side.`,
          `An M:N relationship always becomes its own table, keyed on the combination of both entity keys — and it is the only place a relationship attribute can live.`,
          `A multivalued attribute becomes its own table.`,
          `Here: ${c.why} Total: ${c.n} tables.`,
        ],
        trap: 'The reflex "one table per box and one per diamond" over-counts. Only M:N relationships earn a table of their own; 1:N ones collapse into a foreign key.',
      };
    },
  });

  DRILLS.push({
    id: 'degree-cardinality', group: G_DB, paper: 'TECH1', unit: '5', sub: 'The Relational Model and Normalization',
    title: 'Degree and cardinality of a relation',
    blurb: 'The pair swapped in options more often than any other in this unit.',
    gen(rnd) {
      const cols = randInt(rnd, 3, 9);
      const rows = randInt(rnd, 12, 400);
      const askDegree = rnd() < 0.5;
      const correct = String(askDegree ? cols : rows);
      const { opts, ans } = build(correct, [
        String(askDegree ? rows : cols),          // the swap — the whole point of the item
        String(cols + rows),
        String(askDegree ? cols - 1 : rows - 1),
        String(cols * rows),
      ], rnd);
      return {
        q: `A relation has ${cols} attributes and ${rows} tuples. What is its ${askDegree ? 'degree' : 'cardinality'}?`,
        opts, ans,
        steps: [
          `Relation = table, tuple = row, attribute = column.`,
          `Degree counts the ATTRIBUTES (columns). Cardinality counts the TUPLES (rows).`,
          `This relation has ${cols} attributes and ${rows} tuples, so its degree is ${cols} and its cardinality is ${rows}.`,
          `The question asked for the ${askDegree ? 'degree' : 'cardinality'}, so the answer is ${correct}.`,
          `Mnemonic: deGREE goes with the column headinGS at the top; cardinality counts the cards in the deck, and each row is a card.`,
        ],
        trap: 'Degree and cardinality are swapped in distractors more often than any other pair in this unit. Both numbers are always offered.',
      };
    },
  });









  /* ================================ PROGRAMMING TRAPS, OUTPUT & EXCEPTIONS */
  /* Maps to the official TECH1 Unit 4 leaf "OOPS and Core Java". These are the
     items where the arithmetic is trivial and the trap is the whole question —
     the examiner is testing one specific piece of language semantics, not
     maths. Every stem is posed in Java (or C where the two agree), because that
     is the language this syllabus actually names. */

  DRILLS.push({
    id: 'integer-division', group: G_PROG, paper: 'TECH1', unit: '4', sub: 'OOPS and Core Java',
    title: 'Integer division and modulo',
    blurb: 'Truncation, not rounding — and what % does with a negative operand.',
    gen(rnd) {
      const b = randInt(rnd, 3, 9);
      const a = b * randInt(rnd, 2, 12) + randInt(rnd, 1, b - 1);   // never divides evenly
      const mode = pick(rnd, ['div', 'mod', 'negdiv']);
      if (mode === 'mod') {
        const correct = a % b;
        // The first three are the pedagogically useful misses; the rest are
        // guaranteed-distinct backfill, because trunc/round and b−R collapse
        // onto each other for many (a, b) pairs and left three-option items.
        const { opts, ans } = build(correct, [
          Math.trunc(a / b), (a / b).toFixed(2), b - (a % b),
          correct + 1, correct - 1, Math.round(a / b), b,
        ], rnd);
        return {
          q: `In C or Java, what is the value of the expression  ${a} % ${b}  ?`,
          opts, ans,
          steps: [
            `% is the remainder (modulo) operator, not division.`,
            `${a} ÷ ${b} = ${Math.trunc(a / b)} remainder ${a % b}.`,
            `% yields the remainder, so the answer is ${a % b}.`,
            `Relationship worth holding onto: a == (a/b)*b + (a%b) in integer arithmetic. Here ${Math.trunc(a / b)}×${b} + ${a % b} = ${a}. ✓`,
          ],
          trap: '% gives the REMAINDER and / gives the QUOTIENT. Both are always offered as options.',
        };
      }
      if (mode === 'negdiv') {
        const correct = -a % b;   // C99/Java: sign follows the dividend
        // b − R is the Python answer and the distractor worth planting; the
        // trailing values guarantee three distinct options even when b = 2R
        // makes −(b − R) collapse onto the correct answer.
        const { opts, ans } = build(correct, [
          ((-a % b) + b) % b, a % b, -(b - (a % b)), 0, correct - 1, correct + 1,
        ], rnd);
        return {
          q: `In C (C99 or later) or Java, what is the value of  −${a} % ${b}  ?`,
          opts, ans,
          steps: [
            `In C99 and Java the result of % takes the sign of the DIVIDEND (the left operand), not the divisor.`,
            `${a} % ${b} = ${a % b}, so −${a} % ${b} = ${-a % b}.`,
            `Check with a == (a/b)*b + (a%b): integer division truncates toward zero, so −${a}/${b} = ${Math.trunc(-a / b)}, and ${Math.trunc(-a / b)}×${b} + (${-a % b}) = ${-a}. ✓`,
            `Python is DIFFERENT: there the result takes the sign of the divisor, so −${a} % ${b} would be ${((-a % b) + b) % b}. The language matters, which is why the question names it.`,
          ],
          trap: `The same expression gives ${-a % b} in C/Java and ${((-a % b) + b) % b} in Python. Read which language the question specifies before you answer.`,
        };
      }
      const correct = Math.trunc(a / b);
      // (a/b).toFixed(2) is always a non-integer string here (a never divides
      // evenly), and Q±1 are always distinct from Q — three distinct options
      // guaranteed before the collapsible ones are even considered.
      const { opts, ans } = build(correct, [
        (a / b).toFixed(2), Math.round(a / b), correct + 1, correct - 1, a % b,
      ], rnd);
      return {
        q: `In C or Java, integer variables hold  int x = ${a}, y = ${b};  What is the value of  x / y  ?`,
        opts, ans,
        steps: [
          `Both operands are int, so C and Java perform INTEGER division and the result is an int.`,
          `The true quotient is ${(a / b).toFixed(4)}.`,
          `Integer division truncates toward zero — it discards the fractional part rather than rounding it.`,
          `So x / y = ${correct}, not ${Math.round(a / b)} and not ${(a / b).toFixed(2)}.`,
          `To get the fractional answer you must force floating point, e.g. (float) x / y or x / (double) y.`,
        ],
        trap: `Truncation is not rounding. ${(a / b).toFixed(2)} rounds to ${Math.round(a / b)}, but integer division gives ${correct} — the two differ whenever the fraction is above .5.`,
      };
    },
  });

  DRILLS.push({
    id: 'operator-precedence', group: G_PROG, paper: 'TECH1', unit: '4', sub: 'OOPS and Core Java',
    title: 'Operator precedence',
    blurb: 'Multiplication before addition — evaluate, do not read left to right.',
    gen(rnd) {
      const a = randInt(rnd, 2, 12), b = randInt(rnd, 2, 9), c = randInt(rnd, 2, 9), d = randInt(rnd, 2, 9);
      const form = pick(rnd, ['mul', 'div', 'mixed']);
      let expr, correct, leftToRight, steps;
      if (form === 'mul') {
        expr = `${a} + ${b} * ${c}`; correct = a + b * c; leftToRight = (a + b) * c;
        steps = [`* binds tighter than +, so ${b} * ${c} is evaluated first: ${b * c}.`, `Then ${a} + ${b * c} = ${correct}.`,
          `Reading strictly left to right would give (${a} + ${b}) * ${c} = ${leftToRight}, which is the planted wrong answer.`];
      } else if (form === 'div') {
        expr = `${a * b * c} / ${b} / ${c}`; correct = (a * b * c) / b / c; leftToRight = (a * b * c) / (b / c);
        steps = [`/ is left-associative, so this groups as ((${a * b * c} / ${b}) / ${c}).`, `${a * b * c} / ${b} = ${(a * b * c) / b}, then ÷ ${c} = ${correct}.`,
          `It does NOT group as ${a * b * c} / (${b} / ${c}) = ${leftToRight}. Associativity decides, and for / it is left to right.`];
      } else {
        expr = `${a} + ${b} * ${c} - ${d}`; correct = a + b * c - d; leftToRight = (a + b) * c - d;
        steps = [`Highest precedence first: ${b} * ${c} = ${b * c}.`, `Then + and − left to right: ${a} + ${b * c} = ${a + b * c}, minus ${d} = ${correct}.`,
          `Evaluating strictly left to right gives ${leftToRight}.`];
      }
      const { opts, ans } = build(correct, [leftToRight, correct + 1, correct - 1, a * b + c], rnd);
      return {
        q: `What is the value of the expression  ${expr}  ?`,
        opts, ans,
        steps: steps.concat([
          `Precedence order to memorise, highest first: () then unary ! and − then * / % then + − then relational < > then == != then && then || then assignment =.`,
        ]),
        trap: 'Precedence decides which operator goes first; associativity decides ties between operators of equal precedence. Assignment is the one that associates right to left.',
      };
    },
  });

  DRILLS.push({
    id: 'loop-iterations', group: G_PROG, paper: 'TECH1', unit: '4', sub: 'OOPS and Core Java',
    title: 'How many times does the loop run?',
    blurb: 'The off-by-one that < and <= decide.',
    gen(rnd) {
      const start = pick(rnd, [0, 1, randInt(rnd, 2, 5)]);
      const end = start + randInt(rnd, 4, 20);
      const strict = rnd() < 0.5;
      const step = pick(rnd, [1, 1, 1, 2]);
      const count = Math.max(0, Math.ceil(((end - start) + (strict ? 0 : 1)) / step));
      // `end` and `end - start` both collapse onto `count` in the common
      // start=0, step=1, strict case — the ±1 and ±2 values are the only
      // ones distinct by construction.
      const { opts, ans } = build(count, [count + 1, count - 1, end, end - start, count + 2], rnd);
      return {
        q: `How many times does the body of this loop execute?\n\nfor (int i = ${start}; i ${strict ? '<' : '<='} ${end}; i ${step === 1 ? '++' : '+= ' + step}) { ... }`,
        opts, ans,
        steps: [
          `i starts at ${start} and the loop continues while i ${strict ? '<' : '<='} ${end}.`,
          strict
            ? `With < the final value ${end} is EXCLUDED, so i takes the values ${start} to ${end - 1}.`
            : `With <= the final value ${end} is INCLUDED, so i takes the values ${start} to ${end}.`,
          step === 1
            ? `That is ${end - start + (strict ? 0 : 1)} values, so the body runs ${count} times.`
            : `Stepping by ${step}, the count is ceil((${end} − ${start}${strict ? '' : ' + 1'}) ÷ ${step}) = ${count}.`,
          `The classic case: for (i = 0; i < n; i++) runs exactly n times, which is why array indices run 0 to n−1.`,
        ],
        trap: '< excludes the limit, <= includes it — a one-iteration difference. Both counts are always offered as options.',
      };
    },
  });

  DRILLS.push({
    id: 'exception-type', group: G_PROG, paper: 'TECH1', unit: '4', sub: 'OOPS and Core Java',
    title: 'Which exception is thrown?',
    blurb: 'Match the fault to the exception the runtime actually raises.',
    gen(rnd) {
      const cases = [
        { code: 'int[] a = new int[5];  a[5] = 1;', a: 'ArrayIndexOutOfBoundsException',
          why: 'A 5-element array has valid indices 0 to 4. Index 5 is one past the end — the single most common off-by-one in the language.' },
        { code: 'String s = null;  int n = s.length();', a: 'NullPointerException',
          why: 'Calling any instance method on a null reference throws NullPointerException. The variable exists; the object it should point to does not.' },
        { code: 'int x = 10, y = 0;  int z = x / y;', a: 'ArithmeticException',
          why: 'INTEGER division by zero throws ArithmeticException ("/ by zero"). Note that FLOATING-POINT division by zero does not throw at all — it yields Infinity or NaN.' },
        { code: 'Object o = new Integer(7);  String s = (String) o;', a: 'ClassCastException',
          why: 'The cast is accepted at compile time because Object could hold a String, but at run time the object is an Integer, so the cast fails.' },
        { code: 'int n = Integer.parseInt("12a4");', a: 'NumberFormatException',
          why: '"12a4" is not a valid integer literal. NumberFormatException is a subclass of IllegalArgumentException and is what every parse method throws on malformed input.' },
      ];
      const c = pick(rnd, cases);
      const { opts, ans } = build(c.a, [
        'ArrayIndexOutOfBoundsException', 'NullPointerException', 'ArithmeticException',
        'ClassCastException', 'NumberFormatException', 'StackOverflowError',
      ], rnd);
      return {
        q: `In Java, what does this code throw at run time?\n\n${c.code}`,
        opts, ans,
        steps: [
          `${c.why}`,
          `All five of these are UNCHECKED exceptions (subclasses of RuntimeException), so the compiler does not force you to catch or declare them.`,
          `Checked versus unchecked is the distinction most often examined: checked exceptions such as IOException and SQLException must be caught or declared with throws; unchecked ones (RuntimeException and its subclasses) need not be.`,
          `Error — such as OutOfMemoryError or StackOverflowError — is a third category, signalling problems an application is not expected to recover from.`,
        ],
        trap: 'Integer division by zero throws ArithmeticException, but floating-point division by zero throws nothing at all — 1.0/0.0 quietly gives Infinity. Questions exploit that asymmetry constantly.',
      };
    },
  });

  DRILLS.push({
    id: 'finally-semantics', group: G_PROG, paper: 'TECH1', unit: '4', sub: 'OOPS and Core Java',
    title: 'try / catch / finally — what actually runs?',
    blurb: 'finally runs even when try returns. Almost always.',
    gen(rnd) {
      const cases = [
        { q: 'A try block completes normally and no exception is thrown. Does the finally block run?',
          a: 'Yes — finally runs whether or not an exception occurred',
          why: 'That is the entire purpose of finally: cleanup code that must run on every path out of the block, which is why it is where files, sockets and database connections get closed.' },
        { q: 'A try block executes a return statement. Does the finally block run before the method returns?',
          a: 'Yes — finally runs after the return value is computed but before control leaves the method',
          why: 'The return value is evaluated and held, then finally executes, then the method returns. This is why assigning to the returned variable inside finally does not change what a caller sees for a primitive.' },
        { q: 'An exception is thrown inside try and there is no matching catch clause. Does the finally block run?',
          a: 'Yes — finally runs, then the exception continues propagating to the caller',
          why: 'finally is not conditional on the exception being handled. Cleanup happens, and then the exception carries on up the call stack unchanged.' },
        { q: 'A try block calls System.exit(0). Does the finally block run?',
          a: 'No — System.exit terminates the JVM immediately and finally is skipped',
          why: 'This is the one genuine exception to the rule. System.exit does not unwind the stack, so no finally block anywhere gets a chance to run. JVM crashes and killed threads behave the same way.' },
      ];
      const c = pick(rnd, cases);
      const { opts, ans } = build(c.a, [
        'Yes — finally runs whether or not an exception occurred',
        'Yes — finally runs after the return value is computed but before control leaves the method',
        'Yes — finally runs, then the exception continues propagating to the caller',
        'No — System.exit terminates the JVM immediately and finally is skipped',
        'No — finally runs only when an exception was actually caught',
      ], rnd);
      return {
        q: c.q,
        opts, ans,
        steps: [
          `${c.why}`,
          `The rule: finally runs on EVERY path out of the try block — normal completion, caught exception, uncaught exception, break, continue and return alike.`,
          `The only things that defeat it are System.exit(), a JVM crash, or the thread being killed outright.`,
          `Order when an exception is caught: try (up to the throw) → matching catch → finally.`,
        ],
        trap: '"finally runs only if an exception was caught" is the standard wrong option. It runs regardless — including when nothing went wrong at all.',
      };
    },
  });

  DRILLS.push({
    id: 'short-circuit', group: G_PROG, paper: 'TECH1', unit: '4', sub: 'OOPS and Core Java',
    title: 'Short-circuit evaluation',
    blurb: 'When the right-hand operand never gets evaluated at all.',
    gen(rnd) {
      const cases = [
        { expr: 'if (s != null && s.length() > 0)', a: 'Safe — if s is null the left operand is false, so s.length() is never evaluated',
          why: '&& stops as soon as it sees a false operand, because no value on the right could make the whole expression true. This is the standard null-guard idiom and it depends entirely on that guarantee.' },
        { expr: 'if (s.length() > 0 && s != null)', a: 'Unsafe — s.length() is evaluated first and throws NullPointerException when s is null',
          why: 'The operands are the right ones in the wrong order. Short-circuiting only protects what is to the RIGHT of the operator, so the null check has to come first.' },
        { expr: 'if (s == null || s.isEmpty())', a: 'Safe — if s is null the left operand is true, so s.isEmpty() is never evaluated',
          why: '|| stops as soon as it sees a true operand, because no value on the right could make the whole expression false. It is the mirror image of the && guard.' },
        { expr: 'if (s != null & s.length() > 0)', a: 'Unsafe — single & is the non-short-circuiting operator, so both sides are always evaluated',
          why: '& and | are bitwise/logical operators that evaluate BOTH operands unconditionally. Only the doubled forms && and || short-circuit, and a single & here defeats the null guard entirely.' },
      ];
      const c = pick(rnd, cases);
      const { opts, ans } = build(c.a, [
        'Safe — if s is null the left operand is false, so s.length() is never evaluated',
        'Unsafe — s.length() is evaluated first and throws NullPointerException when s is null',
        'Safe — if s is null the left operand is true, so s.isEmpty() is never evaluated',
        'Unsafe — single & is the non-short-circuiting operator, so both sides are always evaluated',
      ], rnd);
      return {
        q: `In Java, String s may be null. Is this line safe?\n\n${c.expr}`,
        opts, ans,
        steps: [
          `${c.why}`,
          `&& evaluates its right operand only if the left is true. || evaluates its right operand only if the left is false.`,
          `& and | never short-circuit — they always evaluate both sides, which matters when the right side has a side effect or can throw.`,
          `Order matters as much as the operator: the guard must sit to the LEFT of the thing it protects.`,
        ],
        trap: 'A single & or | looks like a typo but changes the semantics. It is a favourite one-character trap in output-prediction questions.',
      };
    },
  });

  DRILLS.push({
    id: 'pass-semantics', group: G_PROG, paper: 'TECH1', unit: '4', sub: 'OOPS and Core Java',
    title: 'Pass by value and reference semantics',
    blurb: 'Why swap() never works, and why the array version does.',
    gen(rnd) {
      const x = randInt(rnd, 2, 40), y = randInt(rnd, 41, 90);
      const cases = [
        { q: `int a = ${x}, b = ${y};  swap(a, b);  where swap(int p, int q) exchanges p and q internally. What are a and b afterwards?`,
          a: `a = ${x}, b = ${y} — unchanged`,
          ds: [`a = ${y}, b = ${x} — swapped`, `a = ${x}, b = ${x}`, `a = ${y}, b = ${y}`],
          why: `Java passes primitives BY VALUE. swap receives copies; exchanging the copies leaves the originals untouched. This is why a working swap in Java needs an array, a wrapper object, or a returned pair.` },
        { q: `int[] arr = {${x}, ${y}};  modify(arr);  where modify(int[] p) executes p[0] = 99. What is arr[0] afterwards?`,
          a: `99 — the change is visible to the caller`,
          ds: [`${x} — unchanged`, `${y}`, `0`],
          why: `The REFERENCE is copied, but both copies point at the same array object. Writing through either one mutates the same underlying object, so the caller sees it.` },
        { q: `String s = "abc";  change(s);  where change(String p) executes p = p + "def". What is s afterwards?`,
          a: `"abc" — unchanged`,
          ds: [`"abcdef"`, `"def"`, `null`],
          why: `Two things combine here. The reference is passed by value, so reassigning p inside the method cannot affect s. And String is immutable, so p + "def" builds a NEW String rather than modifying the existing one.` },
      ];
      const c = pick(rnd, cases);
      const { opts, ans } = build(c.a, c.ds, rnd);
      return {
        q: `In Java: ${c.q}`,
        opts, ans,
        steps: [
          `${c.why}`,
          `Java is pass-by-value in every case, with no exceptions. What trips people up is that for an object, the VALUE being copied is a reference.`,
          `Consequence: reassigning the parameter inside a method never affects the caller. MUTATING the object the parameter points to always does.`,
          `String, Integer and the other wrapper types are immutable, so they can never be mutated in place — only reassigned, which the caller never sees.`,
        ],
        trap: '"Java passes objects by reference" is the wrong-but-common phrasing. It passes object REFERENCES by value, and the difference is exactly what these questions are built on.',
      };
    },
  });

  /* ========================================================= OSPF & EIGRP */
  /* TECH1 Unit 1 leaf "EIGRP and OSPF". Absent from the System Manager
     syllabus entirely, so none of this section is ported — it is new, and the
     numbers are checked against the concept card's own facts (OSPF AD 110,
     cost = inverse bandwidth; EIGRP AD 90/170, bandwidth+delay composite). */

  DRILLS.push({
    id: 'ospf-cost', group: G_OSPF, paper: 'TECH1', unit: '1', sub: 'EIGRP and OSPF',
    title: 'OSPF cost from interface bandwidth',
    blurb: 'cost = 10^8 ÷ bandwidth in bits per second, truncated, never below 1.',
    gen(rnd) {
      const links = [
        { name: 'a 64 kbps serial link', bps: 64000 },
        { name: 'a 128 kbps serial link', bps: 128000 },
        { name: 'a 256 kbps serial link', bps: 256000 },
        { name: 'a 512 kbps serial link', bps: 512000 },
        { name: 'a T1 serial link (1544 kbps)', bps: 1544000 },
        { name: 'an E1 serial link (2048 kbps)', bps: 2048000 },
        { name: 'a 10 Mbps Ethernet interface', bps: 10000000 },
        { name: 'a 100 Mbps FastEthernet interface', bps: 100000000 },
        { name: 'a 1 Gbps GigabitEthernet interface', bps: 1000000000 },
      ];
      const L = pick(rnd, links);
      const raw = 1e8 / L.bps;
      const cost = Math.max(1, Math.floor(raw));
      // Distinct by construction: cost×2, cost×4 and cost×10 can never coincide
      // with cost or with each other for any positive integer cost.
      const { opts, ans } = build(cost, [
        cost * 2, cost * 4, cost * 10,
        cost + 1, Math.max(1, Math.floor(cost / 2)),
      ], rnd);
      return {
        q: `Using Cisco's default reference bandwidth, what OSPF cost is assigned to ${L.name}?`,
        opts, ans,
        steps: [
          `OSPF's metric is cost, and cost = reference bandwidth ÷ interface bandwidth, both expressed in bits per second.`,
          `Cisco's default reference bandwidth is 100 Mbps = 100,000,000 bps.`,
          `100,000,000 ÷ ${L.bps.toLocaleString('en-US')} = ${raw >= 1 ? raw.toFixed(raw === Math.floor(raw) ? 0 : 4) : raw}.`,
          `The result is truncated to an integer and clamped to a minimum of 1, giving a cost of ${cost}.`,
          cost === 1
            ? `Note the consequence: anything at or above 100 Mbps also comes out at 1, so OSPF cannot tell a FastEthernet link from a 10 Gbps one until you raise the reference with "auto-cost reference-bandwidth".`
            : `Lower cost is better. A path's total cost is the sum of the costs of the outgoing interfaces along it.`,
        ],
        trap: 'The division is TRUNCATED, not rounded — a T1 gives 64.76, and OSPF records 64. And the result can never drop below 1, which is why the default reference bandwidth flattens every link faster than 100 Mbps to the same cost.',
      };
    },
  });

  DRILLS.push({
    id: 'eigrp-metric', group: G_OSPF, paper: 'TECH1', unit: '1', sub: 'EIGRP and OSPF',
    title: 'EIGRP composite metric',
    blurb: 'With default K-values: 256 × (10^7 ÷ slowest bandwidth + total delay ÷ 10).',
    gen(rnd) {
      const bwOpts = [64, 128, 256, 512, 1024, 1544, 2048, 10000, 100000];
      const bwA = pick(rnd, bwOpts);
      let bwB = pick(rnd, bwOpts);
      while (bwB === bwA) bwB = pick(rnd, bwOpts);
      const lo = Math.min(bwA, bwB), hi = Math.max(bwA, bwB);
      const d1 = pick(rnd, [100, 1000, 2000, 20000]);
      const d2 = pick(rnd, [100, 1000, 2000, 20000]);
      const dly = d1 + d2;                       // microseconds, always a multiple of 10
      const bwTerm = Math.floor(1e7 / lo);
      const metric = 256 * (bwTerm + dly / 10);
      // Each distractor is a named mistake, and each is distinct from the answer
      // by construction: the ×256 term, the delay-unit term and the drop-delay
      // term all differ from `metric` whenever dly > 0, which it always is.
      const { opts, ans } = build(metric, [
        256 * (Math.floor(1e7 / hi) + dly / 10),   // used the fastest link, not the slowest
        bwTerm + dly / 10,                         // forgot to scale by 256
        256 * (bwTerm + dly),                      // left delay in microseconds
        256 * bwTerm,                              // ignored delay altogether
      ], rnd);
      return {
        q: `An EIGRP route crosses two links:\n\n  Link 1 — bandwidth ${bwA} kbps, delay ${d1} microseconds\n  Link 2 — bandwidth ${bwB} kbps, delay ${d2} microseconds\n\nWith the default K-values (K1 = K3 = 1, K2 = K4 = K5 = 0), what is the composite metric?`,
        opts, ans,
        steps: [
          `With default K-values the composite metric reduces to 256 × (10^7 ÷ bandwidth + delay ÷ 10), where bandwidth is in kbps and delay in microseconds.`,
          `Bandwidth is the SLOWEST link along the path — a bottleneck, not a sum. The slower of ${bwA} and ${bwB} kbps is ${lo} kbps.`,
          `Bandwidth term = 10,000,000 ÷ ${lo} = ${bwTerm.toLocaleString('en-US')} (integer division).`,
          `Delay is CUMULATIVE — add it along the path: ${d1} + ${d2} = ${dly} microseconds, then divide by 10 to get tens of microseconds: ${dly / 10}.`,
          `Metric = 256 × (${bwTerm.toLocaleString('en-US')} + ${dly / 10}) = ${metric.toLocaleString('en-US')}.`,
        ],
        trap: 'Bandwidth is the MINIMUM along the path; delay is the SUM along the path. Swapping those two treatments is the standard error, and both wrong figures are offered.',
      };
    },
  });

  DRILLS.push({
    id: 'dr-bdr-election', group: G_OSPF, paper: 'TECH1', unit: '1', sub: 'EIGRP and OSPF',
    title: 'OSPF DR / BDR election',
    blurb: 'Highest priority wins; priority 0 never stands; ties go to the highest router ID.',
    gen(rnd) {
      // Four routers with distinct router IDs, listed in ascending ID order so
      // the "highest ID" trap can be planted deliberately.
      const nums = shuf([11, 22, 33, 44, 55, 66, 77, 88, 99], rnd).slice(0, 4).sort((a, b) => a - b);
      const labels = shuf([1, 2, 3, 4], rnd);
      const rs = nums.map((n, i) => ({ name: 'R' + labels[i], rid: `10.0.0.${n}`, ridNum: n }));
      // The router with the HIGHEST router ID is set to priority 0 — it is
      // ineligible, which is the whole point of the item.
      rs[3].prio = 0;
      const tie = rnd() < 0.5;
      if (tie) {
        const top = pick(rnd, [1, 5, 20, 100, 150, 200]);
        rs[0].prio = top; rs[1].prio = top;
        rs[2].prio = Math.max(1, top - pick(rnd, [1, 5, 10]) * 1) === top ? 1 : Math.max(1, Math.floor(top / 2));
        if (rs[2].prio === top) rs[2].prio = Math.max(1, top - 1);
      } else {
        const base = pick(rnd, [60, 100, 150, 200, 250]);
        const ps = shuf([base, base - 20, base - 40], rnd);
        rs[0].prio = ps[0]; rs[1].prio = ps[1]; rs[2].prio = ps[2];
      }
      // Run the real election rather than asserting a winner: eligible routers
      // sorted by priority desc, then router ID desc.
      const eligible = rs.filter(r => r.prio > 0)
        .slice().sort((a, b) => (b.prio - a.prio) || (b.ridNum - a.ridNum));
      const askDR = rnd() < 0.5;
      const winner = askDR ? eligible[0] : eligible[1];
      const rows = rs.slice().sort((a, b) => a.name.localeCompare(b.name))
        .map(r => `  ${r.name}   priority ${r.prio}   router-ID ${r.rid}`).join('\n');
      const { opts, ans } = build(winner.name, rs.map(r => r.name), rnd);
      return {
        q: `Four OSPF routers share one multi-access Ethernet segment:\n\n${rows}\n\nWhich router is elected ${askDR ? 'the Designated Router (DR)' : 'the Backup Designated Router (BDR)'}?`,
        opts, ans,
        steps: [
          `A router with OSPF priority 0 never participates in the election, whatever its router ID. That rules ${rs[3].name} out immediately — and note it holds the HIGHEST router ID on the segment, which is exactly the trap.`,
          `Among the rest, the highest priority wins. Priorities offered: ${eligible.map(r => `${r.name} ${r.prio}`).join(', ')}.`,
          tie
            ? `The top priority (${eligible[0].prio}) is shared, so the tie breaks on the HIGHEST router ID, and ${eligible[0].rid} beats ${eligible[1].rid}.`
            : `No tie on priority, so the router ID is never consulted.`,
          `DR = ${eligible[0].name}, BDR = ${eligible[1].name}. The question asked for the ${askDR ? 'DR' : 'BDR'}, so the answer is ${winner.name}.`,
          `The election is NOT pre-emptive: a better router appearing later does not take the role until the current DR fails, at which point the BDR promotes and a new BDR is elected.`,
        ],
        trap: 'HIGHEST priority wins the OSPF DR election — the opposite of STP, where the LOWEST bridge ID wins the root election. Mixing up the two directions is the most common way to lose this mark.',
      };
    },
  });

  DRILLS.push({
    id: 'ospf-area-type', group: G_OSPF, paper: 'TECH1', unit: '1', sub: 'EIGRP and OSPF',
    title: 'Identify the OSPF area type',
    blurb: 'Backbone, standard, stub, totally stubby, NSSA — by what each one blocks.',
    gen(rnd) {
      const cases = [
        { d: 'Every other area must connect to it, directly or through a virtual link. All inter-area traffic passes through it.',
          a: 'Backbone area (Area 0)',
          why: 'OSPF is a two-level hierarchy and the backbone is the hub of it. Two non-backbone areas can never exchange routes without transiting Area 0.' },
        { d: 'It carries every LSA type, including Type 5 externals redistributed from other protocols, with no restriction on what may be flooded into it.',
          a: 'Standard (normal) area',
          why: 'This is the default. An area only becomes stub, totally stubby or NSSA when it is explicitly configured that way on every router inside it.' },
        { d: 'Type 5 external LSAs are blocked at the area border. The ABR injects a default route so the area can still reach external destinations.',
          a: 'Stub area',
          why: 'Stub areas trade detail for a smaller link-state database: routers inside no longer carry every redistributed external prefix, just a default pointing at the ABR.' },
        { d: 'Both Type 3 inter-area summaries and Type 5 externals are blocked. The ABR advertises nothing into the area but a single default route.',
          a: 'Totally stubby area (Cisco proprietary)',
          why: 'The most aggressive reduction, and a Cisco extension rather than part of RFC 2328. Routers inside hold only their own area\'s routes plus one default.' },
        { d: 'It behaves like a stub area, except that one router inside it does redistribute an external protocol. Those routes enter as Type 7 LSAs and the ABR translates them to Type 5 on the way out.',
          a: 'Not-so-stubby area (NSSA)',
          why: 'The Type 7 LSA exists solely to solve this contradiction: a stub area may not carry Type 5, but this area has a genuine external source that must be advertised.' },
      ];
      const c = pick(rnd, cases);
      const { opts, ans } = build(c.a, [
        'Backbone area (Area 0)', 'Standard (normal) area', 'Stub area',
        'Totally stubby area (Cisco proprietary)', 'Not-so-stubby area (NSSA)',
      ], rnd);
      return {
        q: `Which OSPF area type is being described?\n\n${c.d}`,
        opts, ans,
        steps: [
          `${c.why}`,
          `Read area types by what they BLOCK, working from least to most restrictive: standard blocks nothing; stub blocks Type 5; totally stubby blocks Type 3 and Type 5; NSSA is a stub that makes an exception for locally originated externals via Type 7.`,
          `Area 0 is the backbone and can never itself be a stub of any kind — the transit path for the whole domain has to carry everything.`,
          `The ABR (Area Border Router) is where all of this is enforced; it sits in two or more areas and decides what crosses between them.`,
        ],
        trap: 'Stub and totally stubby differ only in whether Type 3 inter-area summaries still get through. Both inject a default route, so "the ABR sends a default route" does not distinguish them on its own.',
      };
    },
  });

  DRILLS.push({
    id: 'ospf-network-wildcard', group: G_OSPF, paper: 'TECH1', unit: '1', sub: 'EIGRP and OSPF',
    title: 'The OSPF network statement',
    blurb: 'network <address> <wildcard> area <n> — the one place a wildcard is mandatory.',
    gen(rnd) {
      const { ip, p, net } = randHost(rnd, 16, 30);
      const wc = intToIp((~maskInt(p)) >>> 0);
      const area = pick(rnd, [0, 1, 2, 10, 20]);
      const correct = `network ${intToIp(net)} ${wc} area ${area}`;
      const { opts, ans } = build(correct, [
        `network ${intToIp(net)} ${maskStr(p)} area ${area}`,                                   // subnet mask instead of wildcard
        `network ${intToIp(ip)} ${wc} area ${area}`,                                            // the host address, not the network
        `network ${intToIp(net)} ${intToIp((~maskInt(Math.min(30, p + 1))) >>> 0)} area ${area}`, // wildcard one bit too narrow
        `network ${intToIp(net)} ${intToIp((~maskInt(Math.max(8, p - 1))) >>> 0)} area ${area}`,  // wildcard one bit too wide
      ], rnd);
      return {
        q: `An interface is configured with the address ${intToIp(ip)} and mask ${maskStr(p)} (/${p}). Which command enables OSPF on it and places it in area ${area}?`,
        opts, ans,
        steps: [
          `The syntax is: network <network-address> <wildcard-mask> area <area-id>. Note it takes a WILDCARD, not a subnet mask — this is the classic slip.`,
          `Find the network address first: ${intToIp(ip)} AND ${maskStr(p)} = ${intToIp(net)}.`,
          `Now invert the mask to get the wildcard. Subtract each octet from 255: 255.255.255.255 − ${maskStr(p)} = ${wc}.`,
          `So the command is: ${correct}.`,
          `What this statement really does is select INTERFACES: any interface whose address falls inside ${intToIp(net)}/${p} is enabled for OSPF and put into area ${area}.`,
        ],
        trap: 'OSPF network statements take a wildcard mask; EIGRP\'s take one too, but an interface\'s "ip address" command takes a subnet mask. Offering the subnet mask here is the planted answer.',
      };
    },
  });

  DRILLS.push({
    id: 'admin-distance-compare', group: G_OSPF, paper: 'TECH1', unit: '1', sub: 'IP Routing',
    title: 'Two protocols, one prefix — which route wins?',
    blurb: 'Administrative distance chooses the protocol; metric only chooses within one.',
    gen(rnd) {
      const SRC = [
        { n: 'a static route', ad: 1 },
        { n: 'internal EIGRP', ad: 90 },
        { n: 'OSPF', ad: 110 },
        { n: 'RIP', ad: 120 },
        { n: 'external EIGRP', ad: 170 },
      ];
      const two = shuf(SRC, rnd).slice(0, 2);
      const [w, l] = two[0].ad < two[1].ad ? two : [two[1], two[0]];
      const prefix = `10.${randInt(rnd, 1, 60)}.${randInt(rnd, 0, 250)}.0/24`;
      const correct = `The ${w.n} route — its administrative distance of ${w.ad} is lower, and lower means more trusted`;
      const { opts, ans } = build(correct, [
        `The ${l.n} route — its administrative distance of ${l.ad} is higher, and a higher distance means a more specific source`,
        `Both routes — the router installs each one and load-balances traffic across the two protocols`,
        `Whichever route has the lower metric, since administrative distance is only consulted when the metrics tie`,
        `Neither — the router discards the prefix until an administrator resolves the conflict by hand`,
      ], rnd);
      return {
        q: `A router learns a route to ${prefix} from two sources at once: ${w.n} and ${l.n}. Which route is installed in the routing table?`,
        opts, ans,
        steps: [
          `Administrative Distance is a trust rating applied BEFORE any metric is looked at. Lower is more trusted.`,
          `The defaults worth knowing cold: connected 0, static 1, internal EIGRP 90, OSPF 110, RIP 120, external EIGRP 170.`,
          `Here ${w.n} carries AD ${w.ad} and ${l.n} carries AD ${l.ad}. ${w.ad} < ${l.ad}, so the ${w.n} route is installed.`,
          `The losing route is not thrown away — it stays in that protocol's own topology table and is installed if the winner disappears.`,
          `Metrics never enter into this. The two protocols' metrics are not even on the same scale, so comparing an OSPF cost with an EIGRP composite would be meaningless.`,
        ],
        trap: 'AD picks the PROTOCOL, metric picks the PATH within that protocol. An option that compares metrics across two different protocols is wrong by construction — the numbers are not commensurable.',
      };
    },
  });

  /* =============================================== SPANNING TREE PROTOCOL */
  /* TECH1 Unit 1 leaf "Spanning Tree Protocol". New, not ported. Costs follow
     the revised IEEE 802.1D-1998 table the concept card teaches. */

  DRILLS.push({
    id: 'stp-root-bridge', group: G_STP, paper: 'TECH1', unit: '1', sub: 'Spanning Tree Protocol',
    title: 'Which switch becomes the Root Bridge?',
    blurb: 'Lowest Bridge ID wins — priority first, MAC address only as a tiebreak.',
    gen(rnd) {
      // Same OUI on every switch, so the MACs are fixed-width lowercase hex and
      // a plain string comparison is a correct numeric comparison.
      const macs = [];
      while (macs.length < 4) {
        const s = [randInt(rnd, 0, 255), randInt(rnd, 0, 255), randInt(rnd, 0, 255)]
          .map(b => b.toString(16).padStart(2, '0')).join(':');
        if (!macs.includes('00:1a:2b:' + s)) macs.push('00:1a:2b:' + s);
      }
      const sw = macs.map((m, i) => ({ name: 'SW' + (i + 1), mac: m, prio: 32768 }));
      const byMac = sw.slice().sort((a, b) => a.mac.localeCompare(b.mac));
      const tie = rnd() < 0.5;
      if (!tie) {
        // Give the HIGHEST-MAC switch the lowest priority, so priority and MAC
        // point at different switches and the item actually tests the order.
        byMac[3].prio = pick(rnd, [4096, 8192, 12288, 16384, 20480, 24576]);
      }
      const root = sw.slice().sort((a, b) => (a.prio - b.prio) || a.mac.localeCompare(b.mac))[0];
      const rows = sw.map(s => `  ${s.name}   priority ${s.prio}   MAC ${s.mac}`).join('\n');
      const { opts, ans } = build(root.name, sw.map(s => s.name), rnd);
      return {
        q: `Four switches are cabled together in a redundant loop:\n\n${rows}\n\nWhich one becomes the Root Bridge?`,
        opts, ans,
        steps: [
          `The Bridge ID is a two-byte priority followed by the switch's MAC address, and the LOWEST Bridge ID wins.`,
          `Because the priority is the high-order part, it is compared first, and the MAC address only decides a tie.`,
          tie
            ? `Every switch here is left at the default priority of 32768, so the election falls through to the MAC address. The lowest is ${byMac[0].mac}, which belongs to ${byMac[0].name}.`
            : `${byMac[3].name} has been configured with priority ${byMac[3].prio}, lower than the other three at 32768, so it wins outright — even though it holds the HIGHEST MAC address on the segment.`,
          `Root Bridge: ${root.name}.`,
          `Priority is configurable only in steps of 4096, so the values you will ever see are 0, 4096, 8192, … 61440, with 32768 as the default.`,
        ],
        trap: 'LOWEST Bridge ID wins the STP root election. OSPF\'s DR election runs the other way — HIGHEST priority wins there. Both appear in this unit and the directions are easy to swap.',
      };
    },
  });

  DRILLS.push({
    id: 'stp-root-port', group: G_STP, paper: 'TECH1', unit: '1', sub: 'Spanning Tree Protocol',
    title: 'Which interface becomes the Root Port?',
    blurb: 'Lowest cumulative path cost to the root — not the fastest first hop.',
    gen(rnd) {
      const COST = { '10 Mbps': 100, '100 Mbps': 19, '1 Gbps': 4, '10 Gbps': 2 };
      // Fixed menu of paths with pairwise-distinct totals, so whichever four are
      // drawn there is always exactly one lowest-cost path and no duplicate
      // options can arise.
      const MENU = [
        ['10 Gbps'], ['1 Gbps'], ['1 Gbps', '10 Gbps'], ['1 Gbps', '1 Gbps'],
        ['1 Gbps', '1 Gbps', '10 Gbps'], ['1 Gbps', '1 Gbps', '1 Gbps'],
        ['100 Mbps'], ['100 Mbps', '10 Gbps'], ['100 Mbps', '1 Gbps'],
        ['100 Mbps', '1 Gbps', '1 Gbps'], ['100 Mbps', '100 Mbps'],
        ['100 Mbps', '100 Mbps', '1 Gbps'], ['10 Mbps'], ['10 Mbps', '1 Gbps'],
        ['10 Mbps', '100 Mbps'], ['10 Mbps', '10 Mbps'],
      ].map(links => ({ links, total: links.reduce((a, s) => a + COST[s], 0) }));
      let sel = shuf(MENU, rnd).slice(0, 4);
      // Prefer a draw where the winner is NOT simply the shortest path, so the
      // item tests cost arithmetic rather than counting hops. Falling through
      // the guard costs nothing but an easier item.
      for (let guard = 0; guard < 40; guard++) {
        const best = sel.reduce((a, b) => (b.total < a.total ? b : a));
        const fewest = sel.reduce((a, b) => (b.links.length < a.links.length ? b : a));
        if (best !== fewest) break;
        sel = shuf(MENU, rnd).slice(0, 4);
      }
      const ports = sel.map((s, i) => Object.assign({ name: `Et0/${i + 1}` }, s));
      const win = ports.reduce((a, b) => (b.total < a.total ? b : a));
      const rows = ports.map(p =>
        `  ${p.name} — ${p.links.join(' link, then a ')} link to the root`).join('\n');
      const { opts, ans } = build(win.name, ports.map(p => p.name), rnd);
      return {
        q: `Switch SW3 is not the Root Bridge. Each of its four interfaces reaches the root over the links shown:\n\n${rows}\n\nWhich interface becomes SW3's Root Port?`,
        opts, ans,
        steps: [
          `The revised 802.1D cost table: 10 Mbps = 100, 100 Mbps = 19, 1 Gbps = 4, 10 Gbps = 2. Faster link, lower cost.`,
          `A path's cost is the SUM of the costs of every link along it, all the way to the root.`,
          ...ports.map(p => `${p.name}: ${p.links.map(l => `${l} (${COST[l]})`).join(' + ')} = ${p.total}.`),
          `The lowest total is ${win.total}, so ${win.name} becomes the Root Port and the other three do not.`,
          `Every non-root switch has exactly ONE Root Port. If two paths tied on cost, the tiebreak would be the lowest sender Bridge ID, then the lowest sender port ID.`,
        ],
        trap: 'The Root Port is decided on CUMULATIVE path cost, not on the speed of the first hop. Three gigabit hops total 12 and beat a single 100 Mbps link at 19 — the direct link is not automatically the winner.',
      };
    },
  });

  DRILLS.push({
    id: 'stp-states-timers', group: G_STP, paper: 'TECH1', unit: '1', sub: 'Spanning Tree Protocol',
    title: '802.1D port states and timers',
    blurb: 'Which states learn, which forward, and how long convergence takes.',
    gen(rnd) {
      const cases = [
        { q: 'An 802.1D port is in the Blocking state. What is it doing?',
          a: 'Receiving BPDUs only — it discards user frames and does not learn MAC addresses',
          ds: ['Forwarding user frames but not learning MAC addresses',
            'Learning MAC addresses but not forwarding user frames',
            'Nothing at all — the interface is administratively shut down'],
          why: 'Blocking is the loop-prevention state. The port stays alive enough to hear BPDUs, so it notices if the topology changes and it is needed, but no user traffic passes.' },
        { q: 'An 802.1D port is in the Listening state. What is it doing?',
          a: 'Processing BPDUs to work out the topology — it neither learns MAC addresses nor forwards frames',
          ds: ['Learning MAC addresses but not yet forwarding frames',
            'Forwarding frames and learning MAC addresses normally',
            'Discarding BPDUs while it waits for the forward delay to expire'],
          why: 'Listening is where the switch decides what the port\'s role will be. It has stopped blocking but has not yet begun populating the MAC table.' },
        { q: 'An 802.1D port is in the Learning state. What is it doing?',
          a: 'Building the MAC address table from incoming frames, but not yet forwarding them',
          ds: ['Forwarding frames while deliberately not learning addresses',
            'Neither learning nor forwarding — it only listens to BPDUs',
            'Forwarding and learning, exactly as in the Forwarding state'],
          why: 'Learning exists purely so the MAC table is already populated the moment the port starts forwarding, which avoids a burst of unnecessary flooding at the transition.' },
        { q: 'With default 802.1D timers, how long does a port take to get from Blocking to Forwarding?',
          a: '30 seconds — 15 seconds Listening plus 15 seconds Learning',
          ds: ['15 seconds — a single forward delay covers the whole transition',
            '2 seconds — one hello interval',
            '20 seconds — the max-age timer'],
          why: 'The forward delay is 15 seconds and it is served twice, once in Listening and once in Learning. That 30-second stall is the single biggest complaint about classic STP and the reason RSTP and PortFast exist.' },
        { q: 'How often does a switch send BPDUs on a working 802.1D topology?',
          a: 'Every 2 seconds — the hello time',
          ds: ['Every 15 seconds — the forward delay',
            'Every 20 seconds — the max age',
            'Only when the topology changes'],
          why: 'BPDUs are a steady heartbeat from the root, relayed hop by hop. Missing them for max-age (20 seconds) is what tells a switch the topology has broken and a recalculation is needed.' },
        { q: 'Which 802.1D port states pass user data?',
          a: 'Forwarding only',
          ds: ['Forwarding and Learning', 'Forwarding, Learning and Listening',
            'Every state except Blocking'],
          why: 'Learning populates the MAC table but still drops the frames it learns from. Only Forwarding actually moves user traffic.' },
      ];
      const c = pick(rnd, cases);
      const { opts, ans } = build(c.a, c.ds, rnd);
      return {
        q: c.q,
        opts, ans,
        steps: [
          `${c.why}`,
          `The 802.1D progression is Blocking → Listening → Learning → Forwarding, with Disabled sitting outside it as the administratively-down state.`,
          `What each state does: Blocking — BPDUs only. Listening — BPDUs only, role being decided. Learning — builds the MAC table, still no forwarding. Forwarding — the only state that passes user traffic.`,
          `Default timers: hello 2 s, forward delay 15 s (served once in Listening and once in Learning), max age 20 s. Convergence therefore runs 30–50 seconds depending on whether max-age has to expire first.`,
        ],
        trap: 'Learning builds the MAC table but does NOT forward. "Learning and Forwarding both pass data" is the standard wrong option, and the two states exist precisely so that they do not.',
      };
    },
  });

  DRILLS.push({
    id: 'stp-portfast-rstp', group: G_STP, paper: 'TECH1', unit: '1', sub: 'Spanning Tree Protocol',
    title: 'PortFast, BPDU Guard and RSTP',
    blurb: 'The three answers to "30 seconds is too slow" — and where each one is safe.',
    gen(rnd) {
      const cases = [
        { q: 'What does PortFast do to a switch port?',
          a: 'Moves it straight to Forwarding when it comes up, skipping Listening and Learning',
          ds: ['Blocks all BPDUs arriving on the port',
            'Doubles the forward delay so the port converges more gradually',
            'Forces the port to become the Root Port regardless of path cost'],
          why: 'PortFast exists for the workstation that boots, waits 30 seconds for a DHCP address and times out. Skipping the two transitional states removes that stall.' },
        { q: 'On which kind of port is PortFast safe to enable?',
          a: 'An access port with a single end device — a PC, printer or server — attached',
          ds: ['A trunk port carrying multiple VLANs to another switch',
            'The Root Port of a non-root switch',
            'Any port at all, since PortFast cannot create a loop'],
          why: 'A port that skips Listening and Learning forwards immediately, so if another switch is plugged into it a loop forms before STP has any chance to block. That is safe only where no switch can appear.' },
        { q: 'Why is BPDU Guard normally configured alongside PortFast?',
          a: 'A PortFast port that receives a BPDU must have a switch on it, and BPDU Guard shuts the port down before a loop can form',
          ds: ['It stops the port sending BPDUs, which halves STP overhead',
            'It makes the port converge even faster than PortFast alone',
            'It allows PortFast to be enabled safely on trunk ports'],
          why: 'PortFast is a promise that no switch will ever be attached. BPDU Guard enforces that promise: the arrival of a BPDU falsifies it, and the port is put into err-disabled state immediately.' },
        { q: 'How does Rapid STP (802.1w) improve on classic STP (802.1D)?',
          a: 'It converges in a few seconds by negotiating with a proposal/agreement handshake instead of waiting out timers',
          ds: ['It removes the root bridge election, so there is nothing to converge',
            'It is slower but consumes far less switch CPU',
            'It replaces path cost with a simple hop count, as RIP does'],
          why: 'Classic STP is timer-driven: it waits because it cannot be sure. RSTP asks its neighbour directly and acts on the reply, which is why the same topology converges in seconds rather than half a minute.' },
        { q: 'How many port states does RSTP (802.1w) define?',
          a: 'Three — Discarding, Learning and Forwarding',
          ds: ['Five — the same set as 802.1D', 'Two — Blocking and Forwarding',
            'Four — Blocking, Listening, Learning and Forwarding'],
          why: 'RSTP folds 802.1D\'s Disabled, Blocking and Listening into a single Discarding state, on the grounds that from a data-plane point of view all three do the same thing: drop the frame.' },
      ];
      const c = pick(rnd, cases);
      const { opts, ans } = build(c.a, c.ds, rnd);
      return {
        q: c.q,
        opts, ans,
        steps: [
          `${c.why}`,
          `The problem all three address is the same: 802.1D takes 30–50 seconds to bring a port up, which is unacceptable for an end device and merely annoying for a switch link.`,
          `PortFast is a local shortcut for edge ports; BPDU Guard is the safety catch that makes it survivable; RSTP is the protocol-level fix that makes the whole topology converge quickly.`,
          `RSTP is IEEE 802.1w and is the default on modern switches; 802.1D is what this syllabus still examines for states and timers, so keep the two sets of facts apart.`,
        ],
        trap: 'PortFast on a switch-to-switch link is the classic self-inflicted outage: the port forwards instantly and a broadcast storm forms before STP has run at all. "Safe on any port" is always the wrong answer.',
      };
    },
  });

  /* ============================================ IP ROUTING & PATH SELECTION */
  /* TECH1 Unit 1 leaf "IP Routing". New, not ported — the System Manager
     syllabus has no routing leaf at all. */

  DRILLS.push({
    id: 'longest-prefix-match', group: G_ROUTE, paper: 'TECH1', unit: '1', sub: 'IP Routing',
    title: 'Longest-prefix match against a routing table',
    blurb: 'Most specific MATCHING route wins — length alone is not enough.',
    gen(rnd) {
      const d = ipToInt(`10.${randInt(rnd, 1, 60)}.${randInt(rnd, 0, 255)}.${randInt(rnd, 1, 254)}`);
      const lens = shuf([16, 20, 24, 26, 27], rnd).slice(0, 2).sort((a, b) => a - b);
      const decoy = randInt(rnd, lens[1] + 1, 30);
      const hops = shuf(['192.0.2.1', '192.0.2.9', '192.0.2.17', '192.0.2.25'], rnd);
      const mk = (netInt, p, via) => ({ netInt, p, s: `${intToIp(netInt)}/${p} via ${via}` });
      const routes = [
        mk(0, 0, hops[0]),                                     // the default route
        mk(netOf(d, lens[0]), lens[0], hops[1]),               // matches, coarse
        mk(netOf(d, lens[1]), lens[1], hops[2]),               // matches, finer
        // Longest prefix in the table, deliberately in the NEXT block along, so
        // it cannot contain the destination however specific it looks.
        mk((netOf(d, decoy) + Math.pow(2, 32 - decoy)) >>> 0, decoy, hops[3]),
      ];
      // Run the real algorithm rather than asserting a winner. The default route
      // always matches, so `hits` is never empty.
      const hits = routes.filter(r => netOf(d, r.p) === r.netInt);
      const best = hits.reduce((a, b) => (b.p > a.p ? b : a));
      const rows = routes.map(r => '  ' + r.s).join('\n');
      const { opts, ans } = build(best.s, routes.map(r => r.s), rnd);
      return {
        q: `A router holds these four entries in its routing table:\n\n${rows}\n\nA packet arrives destined for ${intToIp(d)}. Which entry does the router use to forward it?`,
        opts, ans,
        steps: [
          `Forwarding is decided by LONGEST-PREFIX MATCH: of the routes that actually contain the destination, the one with the most mask bits wins.`,
          `Test each entry by masking the destination with that entry's prefix length and comparing against the entry's network.`,
          ...routes.map(r => `${r.s.split(' via ')[0]}: ${intToIp(d)} AND ${maskStr(r.p)} = ${intToIp(netOf(d, r.p))} — ${netOf(d, r.p) === r.netInt ? 'MATCHES' : 'does not match'}.`),
          `The /${decoy} entry is the longest prefix in the table, but ${intToIp(d)} does not fall inside it, so it is never a candidate.`,
          `Of the entries that do match, the longest is /${best.p}, so the packet is forwarded via ${best.s.split(' via ')[1]}.`,
        ],
        trap: 'Longest-prefix match means longest MATCHING prefix. A more specific route that does not contain the destination is irrelevant, and planting one is the standard way to catch a reader who sorts by mask length before checking containment.',
      };
    },
  });

  DRILLS.push({
    id: 'ad-values', group: G_ROUTE, paper: 'TECH1', unit: '1', sub: 'IP Routing',
    title: 'Default administrative distances',
    blurb: 'Connected 0, static 1, EIGRP 90, OSPF 110, RIP 120, external EIGRP 170.',
    gen(rnd) {
      const SRC = [
        { n: 'a directly connected interface', ad: 0 },
        { n: 'a static route', ad: 1 },
        { n: 'an internal EIGRP route', ad: 90 },
        { n: 'an OSPF route', ad: 110 },
        { n: 'a RIP route', ad: 120 },
        { n: 'an external EIGRP route', ad: 170 },
      ];
      const s = pick(rnd, SRC);
      // Every other AD in the table is distinct from this one by construction.
      const { opts, ans } = build(s.ad, SRC.filter(x => x.ad !== s.ad).map(x => x.ad), rnd);
      return {
        q: `What is the default administrative distance of ${s.n}?`,
        opts, ans,
        steps: [
          `Administrative Distance rates how much a router trusts the SOURCE of a route. Lower is more trusted, and it is compared before any metric.`,
          `The defaults: directly connected 0, static 1, internal EIGRP 90, OSPF 110, RIP 120, external EIGRP 170.`,
          `${s.n.charAt(0).toUpperCase() + s.n.slice(1)} therefore carries AD ${s.ad}.`,
          `The ordering encodes a judgement: what the router can see for itself (0) beats what an administrator typed (1), which beats anything learned from a neighbour.`,
          `An AD of 255 means "never install this route" — it is how a route is administratively disabled without deleting it.`,
        ],
        trap: 'Internal EIGRP is 90 but EXTERNAL EIGRP is 170 — redistributed routes are trusted less than the protocol\'s own. That pair is the most commonly offered distractor in this topic.',
      };
    },
  });

  DRILLS.push({
    id: 'default-route', group: G_ROUTE, paper: 'TECH1', unit: '1', sub: 'IP Routing',
    title: 'The default route and the gateway of last resort',
    blurb: 'When 0.0.0.0/0 is consulted, and what happens when it is missing.',
    gen(rnd) {
      const cases = [
        { q: 'How is an IPv4 default route written?',
          a: '0.0.0.0 0.0.0.0 — that is, the prefix 0.0.0.0/0',
          ds: ['255.255.255.255 255.255.255.255 — the prefix 255.255.255.255/32',
            '127.0.0.1 255.0.0.0 — the loopback network',
            '224.0.0.0 240.0.0.0 — the multicast range'],
          why: 'A mask of zero bits matches every possible destination, which is exactly what a route of last resort has to do.' },
        { q: 'When does a router actually use its default route?',
          a: 'Only when no more specific route in the table matches the destination',
          ds: ['Always, in preference to routes learned from a routing protocol',
            'Only when the routing table is completely empty',
            'Whenever the destination lies on a directly connected network'],
          why: 'The default route is simply the shortest possible prefix, so under longest-prefix match every other matching route beats it automatically. Nothing special is needed to make it a last resort.' },
        { q: 'What is the "gateway of last resort"?',
          a: 'The next hop of the default route — where anything the table does not otherwise cover is sent',
          ds: ['The router closest to the destination, chosen by hop count',
            'The interface with the lowest administrative distance',
            'A backup router that takes over when the primary one fails'],
          why: 'It is the IOS name for the default route\'s next hop, reported at the top of "show ip route". If it reads "not set", the router has no default and will drop anything it cannot match.' },
        { q: 'A packet arrives for a destination that matches no route, and no default route is configured. What does the router do?',
          a: 'Drops the packet and sends an ICMP destination-unreachable message back to the source',
          ds: ['Floods the packet out of every interface except the one it arrived on',
            'Broadcasts an ARP request for the destination address',
            'Queues the packet until a routing protocol learns a path to it'],
          why: 'A router that cannot match a destination discards the packet — it never floods, which is a Layer 2 switch behaviour. The ICMP unreachable is what makes the failure visible to traceroute.' },
      ];
      const c = pick(rnd, cases);
      const { opts, ans } = build(c.a, c.ds, rnd);
      return {
        q: c.q,
        opts, ans,
        steps: [
          `${c.why}`,
          `A default route is written 0.0.0.0/0 — zero mask bits, so it matches every destination.`,
          `Because longest-prefix match always prefers more mask bits, the default route loses to every other matching entry without needing any special rule.`,
          `Configured with: ip route 0.0.0.0 0.0.0.0 <next-hop>, which lands in the table as a static route with AD 1.`,
        ],
        trap: 'Routers DROP what they cannot match; switches flood what they cannot match. An option that has a router flooding an unmatched packet has confused the two layers.',
      };
    },
  });

  /* ======================================================= VLANS & TRUNKING */
  /* TECH1 Unit 1 leaf "Virtual LANs". New, not ported. */

  DRILLS.push({
    id: 'vlan-tagging', group: G_VLAN, paper: 'TECH1', unit: '1', sub: 'Virtual LANs',
    title: 'Is this frame tagged on the trunk?',
    blurb: '802.1Q tags everything except the native VLAN.',
    gen(rnd) {
      const native = pick(rnd, [1, 10, 99, 199]);
      const pool = [1, 10, 20, 30, 40, 99, 100, 200];
      let vlan;
      if (rnd() < 0.4) {
        vlan = native;                       // the untagged case
      } else {
        vlan = pick(rnd, pool);
        while (vlan === native) vlan = pick(rnd, pool);
      }
      const untagged = 'Sent untagged — it belongs to the native VLAN on this trunk';
      const tagged = `Tagged with an 802.1Q header carrying VLAN ID ${vlan}`;
      const correct = vlan === native ? untagged : tagged;
      // When vlan === native the "tagged with the native ID" candidate collapses
      // onto `tagged`; build() drops the duplicate and the last two candidates
      // still leave three distinct options.
      const { opts, ans } = build(correct, [
        untagged, tagged,
        `Tagged with an 802.1Q header carrying VLAN ID ${native}`,
        'Dropped — a trunk port carries tagged traffic only',
        'Encapsulated in an ISL header rather than tagged',
      ], rnd);
      return {
        q: `A frame belonging to VLAN ${vlan} leaves switch SW1 towards SW2 over a trunk. The trunk runs IEEE 802.1Q and its native VLAN is ${native}. How does the frame cross the trunk?`,
        opts, ans,
        steps: [
          `802.1Q inserts a 4-byte tag into the Ethernet header carrying a 12-bit VLAN ID, so the far end knows which VLAN each frame belongs to.`,
          `The one exception is the native VLAN, whose frames cross the trunk UNTAGGED.`,
          `This trunk's native VLAN is ${native}, and the frame belongs to VLAN ${vlan}.`,
          vlan === native
            ? `They are the same VLAN, so the frame is sent with no tag at all. The receiving switch will assign any untagged frame it sees to its own native VLAN.`
            : `They differ, so the frame is tagged with VLAN ID ${vlan}.`,
          `The native VLAN is untagged for backward compatibility — a device that cannot read an 802.1Q tag can still take part in that one VLAN.`,
        ],
        trap: 'The native VLAN is the exception, not the rule. "802.1Q tags every frame" is wrong, and a native-VLAN frame arriving tagged is a symptom of a misconfiguration, not normal operation.',
      };
    },
  });

  DRILLS.push({
    id: 'native-vlan', group: G_VLAN, paper: 'TECH1', unit: '1', sub: 'Virtual LANs',
    title: 'Native VLAN behaviour and mismatches',
    blurb: 'What untagged means at each end, and what happens when the ends disagree.',
    gen(rnd) {
      const cases = [
        { q: 'An untagged frame arrives on a switch\'s 802.1Q trunk port. Which VLAN does the switch place it in?',
          a: 'The native VLAN configured on that trunk port',
          ds: ['VLAN 1, always, regardless of how the trunk is configured',
            'It is dropped — an untagged frame is invalid on a trunk',
            'The VLAN of the access port it is eventually destined for'],
          why: 'Untagged carries no VLAN information, so the receiving switch has to supply one, and the native VLAN is the value it uses. This is the exact mirror of how it sends native-VLAN frames out.' },
        { q: 'SW1\'s trunk has native VLAN 1 and SW2\'s end of the same trunk has native VLAN 99. What is the consequence?',
          a: 'Traffic leaks between VLAN 1 and VLAN 99, because each switch reassigns the other\'s untagged frames to its own native VLAN',
          ds: ['The trunk stays down until the two native VLANs are made to agree',
            'Nothing — the native VLAN only matters for management traffic',
            'All VLANs stop crossing the trunk until the mismatch is corrected'],
          why: 'The trunk keeps working, which is what makes this dangerous: two VLANs are silently bridged together. CDP detects and logs the mismatch, but it does not stop the traffic.' },
        { q: 'What is the default native VLAN on a Cisco 802.1Q trunk?',
          a: 'VLAN 1',
          ds: ['VLAN 0', 'VLAN 99', 'VLAN 1005'],
          why: 'VLAN 1 is the default for everything on a Cisco switch — every access port starts in it, and it is the default native VLAN too. Changing it away from VLAN 1 is standard hardening advice.' },
        { q: 'Why does 802.1Q send the native VLAN untagged at all?',
          a: 'For backward compatibility with devices that cannot interpret an 802.1Q tag',
          ds: ['To save bandwidth, since untagged frames are 4 bytes shorter',
            'Because the native VLAN is reserved for switch management traffic',
            'Because VLAN 1 cannot be represented in a 12-bit VLAN ID field'],
          why: 'A hub, or an older NIC, would discard a tagged frame as malformed. Leaving one VLAN untagged means such a device can still participate in that VLAN across a trunk.' },
      ];
      const c = pick(rnd, cases);
      const { opts, ans } = build(c.a, c.ds, rnd);
      return {
        q: c.q,
        opts, ans,
        steps: [
          `${c.why}`,
          `The rule in both directions: frames in the native VLAN are sent untagged, and frames arriving untagged are assigned to the native VLAN.`,
          `Both ends of a trunk must therefore agree on the native VLAN, or untagged frames land in different VLANs at each end.`,
          `The default native VLAN is 1, and moving it to an unused VLAN is a standard hardening step because it also blunts VLAN-hopping attacks.`,
        ],
        trap: 'A native VLAN mismatch does NOT bring the trunk down — it silently merges two broadcast domains and keeps forwarding. An option that says the link fails has the failure mode backwards.',
      };
    },
  });

  DRILLS.push({
    id: 'broadcast-domains', group: G_VLAN, paper: 'TECH1', unit: '1', sub: 'Virtual LANs',
    title: 'How many broadcast domains?',
    blurb: 'One per VLAN — trunks extend a domain, they do not create one.',
    gen(rnd) {
      const vlans = randInt(rnd, 2, 6);
      const switches = randInt(rnd, 2, 4);
      const ports = pick(rnd, [8, 12, 24, 48]);
      // vlans×switches ≠ vlans because switches ≥ 2; 1 ≠ vlans because vlans ≥ 2;
      // ports ≥ 8 > 6 ≥ vlans. Three distinct distractors are guaranteed.
      const { opts, ans } = build(vlans, [
        vlans * switches, vlans + 1, 1, switches, ports, ports * switches,
      ], rnd);
      return {
        q: `${switches} switches, each with ${ports} ports, are connected to each other by 802.1Q trunks. ${vlans} VLANs are configured and in use across all of them. There is no router and no Layer 3 switch anywhere in the topology. How many broadcast domains are there?`,
        opts, ans,
        steps: [
          `A switch with no VLANs configured is a single broadcast domain, however many ports it has — a switch breaks up COLLISION domains, not broadcast domains.`,
          `VLANs are the exception: each VLAN is its own broadcast domain, which is the whole reason they exist.`,
          `A trunk EXTENDS each VLAN to the next switch. VLAN 10 spanning all ${switches} switches is still one broadcast domain, not ${switches}.`,
          `So the count is simply the number of VLANs: ${vlans}.`,
          `Only a Layer 3 device separates or joins broadcast domains, and there is none here — which is also why these ${vlans} VLANs currently cannot talk to each other at all.`,
        ],
        trap: 'Multiplying VLANs by switches is the planted wrong answer. Trunks join the pieces of a VLAN into ONE broadcast domain spanning every switch; they do not create a fresh domain per switch.',
      };
    },
  });

  /* ============================================ NETWORK ADDRESS TRANSLATION */
  /* TECH1 Unit 1 leaf "Network Address Translation". New, not ported. */

  DRILLS.push({
    id: 'nat-type', group: G_NAT, paper: 'TECH1', unit: '1', sub: 'Network Address Translation',
    title: 'Which flavour of NAT does this need?',
    blurb: 'Static, dynamic, PAT — or none at all.',
    gen(rnd) {
      const PAT = 'PAT / NAT overload — many inside addresses share one public address, kept apart by source port';
      const STATIC = 'Static NAT — one permanent, manually configured one-to-one mapping';
      const DYN = 'Dynamic NAT — temporary one-to-one mappings handed out from a pool as hosts need them';
      const NONE = 'None — NAT is only needed to reach the public Internet, and these addresses never leave the private network';
      const cases = [
        { s: `A branch office has ${randInt(rnd, 120, 400)} hosts on 192.168.1.0/24 and exactly one public IPv4 address from its ISP. Every host needs Internet access.`,
          a: PAT,
          why: 'One public address and far more hosts than addresses leaves only one option. PAT distinguishes the sessions by rewriting source port numbers, so a single public address can carry thousands of concurrent conversations.' },
        { s: 'An internal web server on 192.168.1.10 must be permanently reachable from the Internet at a fixed public address, so its DNS record never has to change.',
          a: STATIC,
          why: 'Inbound connections need a mapping that already exists before the first packet arrives. Dynamic mappings are created by outbound traffic, so they cannot serve an inbound session.' },
        { s: `A site has ${randInt(rnd, 30, 60)} hosts and a pool of ${randInt(rnd, 10, 14)} public addresses. Only a handful of users are online at any one time and none of them host services.`,
          a: DYN,
          why: 'There are enough public addresses for the hosts actually active, and nothing needs a fixed mapping, so allocating from a pool on demand fits exactly.' },
        { s: 'Two branch offices are joined by a private leased line. They use non-overlapping RFC 1918 addressing and exchange traffic only with each other.',
          a: NONE,
          why: 'Private addresses route perfectly well across a private link. NAT is about scarcity of PUBLIC addresses; nothing here ever touches the public Internet.' },
      ];
      const c = pick(rnd, cases);
      const { opts, ans } = build(c.a, [PAT, STATIC, DYN, NONE], rnd);
      return {
        q: `${c.s}\n\nWhich form of NAT does this call for?`,
        opts, ans,
        steps: [
          `${c.why}`,
          `Static NAT: one-to-one, permanent, configured by hand. Used when something must be reachable from outside at a known address.`,
          `Dynamic NAT: one-to-one, but allocated from a pool as needed and released afterwards. Needs at least as many public addresses as simultaneous users.`,
          `PAT (overload): many-to-one. Adds the Layer 4 port number to the translation so one public address serves many hosts. This is what every home router does.`,
          `Deciding question: how many public addresses are available, and does anything need to be reachable from the OUTSIDE?`,
        ],
        trap: 'Only PAT lets more simultaneous users than public addresses onto the Internet. Dynamic NAT is still one-to-one, so the 15th user of a 14-address pool simply fails.',
      };
    },
  });

  DRILLS.push({
    id: 'nat-translation', group: G_NAT, paper: 'TECH1', unit: '1', sub: 'Network Address Translation',
    title: 'What does the translation table show?',
    blurb: 'Follow one packet through and read the addresses off it.',
    gen(rnd) {
      const pub = `203.0.113.${randInt(rnd, 2, 250)}`;
      const third = randInt(rnd, 0, 20);
      const a = randInt(rnd, 10, 60);
      let b = randInt(rnd, 10, 60);
      while (b === a) b = randInt(rnd, 10, 60);
      const h1 = `192.168.${third}.${a}`, h2 = `192.168.${third}.${b}`;
      const port = randInt(rnd, 1100, 4000);
      if (rnd() < 0.5) {
        const correct = `Two entries, both translating to ${pub}, but with different global source ports — PAT rewrites one of them`;
        const { opts, ans } = build(correct, [
          `Two entries, both translating to ${pub} and both keeping source port ${port}, since the inside addresses already differ`,
          `One entry for ${h1}; ${h2} is refused until the first session closes`,
          `Two entries, each translating to a different public address drawn from the pool`,
          `No entries — PAT rewrites ports only, and leaves the addresses untouched`,
        ], rnd);
        return {
          q: `A router runs PAT with the single public address ${pub}. Host ${h1} opens a session using source port ${port}, and a moment later host ${h2} opens one using source port ${port} as well. What appears in the NAT translation table?`,
          opts, ans,
          steps: [
            `PAT overloads one public address by making the Layer 4 port part of the translation, so an entry is really (inside local address + port) ↔ (inside global address + port).`,
            `${h1}:${port} is translated first and can keep port ${port}: nothing else is using ${pub}:${port} yet.`,
            `${h2} then arrives with the same source port. ${pub}:${port} is already taken, so the router allocates a different global port for this session.`,
            `The result is two entries sharing the inside global address ${pub} but differing in the global port — that difference is the only thing that lets return traffic be sent back to the right host.`,
            `Nothing is refused. The reason PAT scales to thousands of hosts on one address is precisely that it can always pick another free port.`,
          ],
          trap: 'PAT does not need distinct inside ports to work — it CREATES distinct global ports when they collide. An option that keeps both source ports unchanged has missed what the "P" in PAT does.',
        };
      }
      const correct = `Source ${pub}, destination 8.8.8.8`;
      const { opts, ans } = build(correct, [
        `Source ${h1}, destination 8.8.8.8`,
        `Source 8.8.8.8, destination ${pub}`,
        `Source ${pub}, destination ${h1}`,
        `Source ${h1}, destination ${pub}`,
      ], rnd);
      return {
        q: `Static NAT maps the inside local address ${h1} to the inside global address ${pub}. Host ${h1} sends a packet to the public server 8.8.8.8. As the packet leaves the router's outside interface, what are its source and destination addresses?`,
        opts, ans,
        steps: [
          `NAT rewrites the packet on its way OUT of the inside network, and it rewrites the SOURCE address of an outbound packet.`,
          `Source before translation: ${h1}, the inside local address. After translation: ${pub}, the inside global address.`,
          `The destination is a public address already — 8.8.8.8 is outside, so NAT leaves it alone.`,
          `Leaving the outside interface, the packet reads: source ${pub}, destination 8.8.8.8.`,
          `On the reply, the router does the reverse: it looks up ${pub} in the translation table and rewrites the DESTINATION back to ${h1} before forwarding it inside.`,
        ],
        trap: 'Outbound NAT touches the source address; the return packet has its destination rewritten. An option that swaps source and destination is describing the reply, not the outbound packet.',
      };
    },
  });

  DRILLS.push({
    id: 'nat-naming', group: G_NAT, paper: 'TECH1', unit: '1', sub: 'Network Address Translation',
    title: 'Inside local, inside global, outside global, outside local',
    blurb: 'Inside/outside says whose host it is; local/global says which side of the router you are standing on.',
    gen(rnd) {
      const IL = 'Inside local', IG = 'Inside global', OG = 'Outside global', OL = 'Outside local';
      const cases = [
        { d: 'The private RFC 1918 address configured on a host inside your network, as that host sees itself — before any translation.',
          a: IL, why: 'Inside, because it is your host. Local, because it is the address as seen from within the inside network.' },
        { d: 'The public address that one of your internal hosts appears to come from once its traffic has crossed the NAT router.',
          a: IG, why: 'Inside, because it is still your host. Global, because it is the address the outside world sees.' },
        { d: 'The real registered address of a server on the Internet, exactly as its own administrator configured it.',
          a: OG, why: 'Outside, because it is someone else\'s host. Global, because it is the address in use on the public Internet.' },
        { d: 'The address by which an external host is known to machines inside your network, which may differ from its real one if the router also translates destinations.',
          a: OL, why: 'Outside, because it is someone else\'s host. Local, because it is the address presented on the inside. Usually identical to the outside global address, which is why this term is the least often used of the four.' },
      ];
      const c = pick(rnd, cases);
      const { opts, ans } = build(c.a, [IL, IG, OG, OL], rnd);
      return {
        q: `In Cisco NAT terminology, what is this address called?\n\n${c.d}`,
        opts, ans,
        steps: [
          `${c.why}`,
          `Read the two words separately. INSIDE or OUTSIDE says whose host the address belongs to: yours, or someone else's. It never changes when the packet is translated.`,
          `LOCAL or GLOBAL says which side of the router you are standing on when you look at it: local = as seen on the inside network, global = as seen on the public Internet.`,
          `So one host has two names: an inside local address (its private one) and an inside global address (its translated public one). Translation changes local↔global, never inside↔outside.`,
          `The pairing you will actually be asked about: inside local = private/before, inside global = public/after.`,
        ],
        trap: '"Local" does not mean private and "global" does not mean public in general — they mean "as seen from the inside" and "as seen from the outside". An outside global address is a public address belonging to someone else entirely.',
      };
    },
  });

  /* ================================================== CISCO IOS COMMAND MODES */
  /* TECH1 Unit 1 leaf "IOS and Security Device Manager". New, not ported. */

  DRILLS.push({
    id: 'ios-mode', group: G_IOS, paper: 'TECH1', unit: '1', sub: 'IOS and Security Device Manager',
    title: 'Identify the IOS command mode',
    blurb: 'Read the prompt, and know which command moves you between modes.',
    gen(rnd) {
      const MODES = [
        { prompt: 'Router>', name: 'User EXEC mode' },
        { prompt: 'Router#', name: 'Privileged EXEC mode' },
        { prompt: 'Router(config)#', name: 'Global configuration mode' },
        { prompt: 'Router(config-if)#', name: 'Interface configuration mode' },
        { prompt: 'Router(config-line)#', name: 'Line configuration mode' },
      ];
      if (rnd() < 0.5) {
        const m = pick(rnd, MODES);
        const { opts, ans } = build(m.name, MODES.map(x => x.name), rnd);
        return {
          q: `An IOS session is showing the prompt:\n\n  ${m.prompt}\n\nWhich command mode is this?`,
          opts, ans,
          steps: [
            `IOS shows the current mode in the prompt itself, so the prompt is always the answer to "where am I".`,
            `Router> is User EXEC — look but barely touch. Router# is Privileged EXEC, reached with "enable".`,
            `Router(config)# is Global configuration, reached from Privileged EXEC with "configure terminal".`,
            `Anything of the form Router(config-xxx)# is a sub-mode of Global configuration: (config-if)# for an interface, (config-line)# for a console or VTY line, (config-router)# for a routing process.`,
            `So ${m.prompt} is ${m.name}.`,
          ],
          trap: 'The difference between > and # is the whole security model: > cannot see the configuration or change anything, # can do everything. Missing that one character is missing the question.',
        };
      }
      const moves = [
        { from: 'User EXEC mode', to: 'Privileged EXEC mode', cmd: 'enable' },
        { from: 'Privileged EXEC mode', to: 'Global configuration mode', cmd: 'configure terminal' },
        { from: 'Global configuration mode', to: 'Interface configuration mode', cmd: 'interface GigabitEthernet0/0' },
        { from: 'Global configuration mode', to: 'Line configuration mode', cmd: 'line console 0' },
        { from: 'Privileged EXEC mode', to: 'User EXEC mode', cmd: 'disable' },
      ];
      const m = pick(rnd, moves);
      const { opts, ans } = build(m.cmd, moves.map(x => x.cmd).concat(['exit', 'end']), rnd);
      return {
        q: `Which command moves an IOS session from ${m.from} to ${m.to}?`,
        opts, ans,
        steps: [
          `The mode ladder runs: User EXEC (>) → Privileged EXEC (#) → Global configuration ((config)#) → a sub-mode such as (config-if)# or (config-line)#.`,
          `"enable" climbs from User EXEC to Privileged EXEC; "disable" goes back down.`,
          `"configure terminal" enters Global configuration from Privileged EXEC — and only from there, which is why you cannot configure an interface straight from Router#.`,
          `From Global configuration, naming the thing you want to configure enters its sub-mode: "interface Gi0/0", "line console 0", "router ospf 1".`,
          `So the answer is: ${m.cmd}.`,
          `Coming back out: "exit" drops one level, "end" (or Ctrl-Z) returns straight to Privileged EXEC from anywhere.`,
        ],
        trap: 'You cannot configure an interface directly from Privileged EXEC. Every configuration sub-mode is entered from Global configuration, so "configure terminal" always comes first.',
      };
    },
  });

  DRILLS.push({
    id: 'ios-command', group: G_IOS, paper: 'TECH1', unit: '1', sub: 'IOS and Security Device Manager',
    title: 'Which command does this?',
    blurb: 'The show commands, and the running-config / startup-config direction.',
    gen(rnd) {
      const cases = [
        { q: 'Which command saves the active configuration so that it survives a reload?',
          a: 'copy running-config startup-config',
          ds: ['copy startup-config running-config', 'erase startup-config', 'show running-config'],
          why: 'Copying runs FROM the running-config in RAM TO the startup-config in NVRAM. Reversing the two arguments overwrites your live configuration with the saved one — occasionally what you want, but never what "save" means.' },
        { q: 'Which command displays the configuration currently active in RAM?',
          a: 'show running-config',
          ds: ['show startup-config', 'show version', 'show flash'],
          why: '"show startup-config" reads the saved copy in NVRAM instead. If you have made changes and not saved, the two outputs differ — and that difference is exactly what the command is used to check.' },
        { q: 'Which command reports the IOS version, the uptime and the configuration register?',
          a: 'show version',
          ds: ['show running-config', 'show flash', 'show ip interface brief'],
          why: '"show version" is the device\'s summary card. The configuration register value it prints is what the password-recovery procedure changes, which is why it comes up so often.' },
        { q: 'Which command lists every interface with its IP address and its line and protocol status in one compact table?',
          a: 'show ip interface brief',
          ds: ['show interfaces', 'show ip route', 'show running-config'],
          why: '"show interfaces" gives the full multi-paragraph detail for each one; the "brief" form is the single-screen summary used to spot a down interface at a glance.' },
        { q: 'Which command sets an MD5-hashed password on Privileged EXEC mode?',
          a: 'enable secret cisco123',
          ds: ['enable password cisco123', 'service password-encryption', 'line vty 0 4'],
          why: '"enable password" stores the password in clear text, and "service password-encryption" only applies a trivially reversible Type 7 cipher. "enable secret" is the hashed one, and it overrides "enable password" whenever both are configured.' },
        { q: 'Which command displays the router\'s routing table?',
          a: 'show ip route',
          ds: ['show ip interface brief', 'show arp', 'show cdp neighbors'],
          why: 'It is also where the gateway of last resort is reported, and where the codes column tells you how each route was learned — C connected, S static, O OSPF, D EIGRP, R RIP.' },
      ];
      const c = pick(rnd, cases);
      const { opts, ans } = build(c.a, c.ds, rnd);
      return {
        q: c.q,
        opts, ans,
        steps: [
          `${c.why}`,
          `The two configuration files: running-config lives in RAM and is active but volatile; startup-config lives in NVRAM and is what the router loads at boot.`,
          `Direction matters in every copy command — "copy running-config startup-config" saves, and the reverse restores.`,
          `Configuration commands are typed from a config mode; "show" commands are run from Privileged EXEC.`,
          `SDM (Security Device Manager) is the browser-based GUI alternative to all of this for a single device, since superseded by Cisco Configuration Professional.`,
        ],
        trap: 'running-config = RAM, startup-config = NVRAM. Swapping the two, or reversing the arguments to copy, is the single most common error in this topic and both wrong forms are offered.',
      };
    },
  });

  window.CALC_DRILLS = DRILLS;
})();
