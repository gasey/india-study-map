/* ============================================================================
   MUDAL System Manager — Calc Lab drill generators
   window.CALC_DRILLS = [ {id, group, title, sub, paper, unit, blurb, gen(rnd)} ]

   WHY THIS FILE EXISTS
   --------------------
   The concept guide explains subnetting, IP addressing, base conversion and
   normalisation well enough. What it cannot do is build the procedural fluency
   those topics are actually examined on. Measured before this was written, the
   whole 843-question bank held ONE real subnetting calculation and ONE hex
   conversion (and that one was borrowed from the JSO prep set, not a System
   Manager past paper). You cannot drill a skill on a pool of one.

   Every generator here is a pure function of a seeded RNG, so a drill set is
   reproducible from its seed, and every item carries a worked `steps` solution
   rather than just an answer letter — the method is the thing being taught.

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
  const G_MEM = 'Memory allocation, paging & cache';
  const G_PROG = 'Programming traps, output & exceptions';

  /* ====================================================== IPv4 SUBNETTING */

  DRILLS.push({
    id: 'hosts-per-subnet', group: G_IP, paper: 'TECH2', unit: 'I', sub: 'Subnetting',
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
    id: 'network-address', group: G_IP, paper: 'TECH2', unit: 'I', sub: 'Subnetting',
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
    id: 'broadcast-address', group: G_IP, paper: 'TECH2', unit: 'I', sub: 'Subnetting',
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
    id: 'host-range', group: G_IP, paper: 'TECH2', unit: 'I', sub: 'Subnetting',
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
    id: 'subnet-count', group: G_IP, paper: 'TECH2', unit: 'I', sub: 'Subnetting',
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
    id: 'mask-to-prefix', group: G_IP, paper: 'TECH2', unit: 'I', sub: 'Subnetting',
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
    id: 'wildcard-mask', group: G_IP, paper: 'TECH2', unit: 'I', sub: 'Subnetting',
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
    id: 'same-subnet', group: G_IP, paper: 'TECH2', unit: 'I', sub: 'Subnetting',
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
    id: 'prefix-for-hosts', group: G_IP, paper: 'TECH2', unit: 'I', sub: 'Subnetting',
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
    id: 'summary-route', group: G_IP, paper: 'TECH2', unit: 'I', sub: 'Routers',
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
    id: 'address-class', group: G_IP, paper: 'TECH2', unit: 'I', sub: 'IP Addressing',
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
    id: 'private-public', group: G_IP, paper: 'TECH2', unit: 'I', sub: 'IP Addressing',
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
    id: 'ipv6-compress', group: G_V6, paper: 'TECH2', unit: 'I', sub: 'IPv4 and IPv6',
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
    id: 'ipv6-expand', group: G_V6, paper: 'TECH2', unit: 'I', sub: 'IPv4 and IPv6',
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
    id: 'ipv6-type', group: G_V6, paper: 'TECH2', unit: 'I', sub: 'IPv4 and IPv6',
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
    id: 'base-convert', group: G_NUM, paper: 'TECH1', unit: 'I', sub: 'Number Systems and Data Representation',
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
    id: 'binary-hex-nibble', group: G_NUM, paper: 'TECH1', unit: 'I', sub: 'Number Systems and Data Representation',
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
    id: 'twos-complement', group: G_NUM, paper: 'TECH1', unit: 'I', sub: 'Number Systems and Data Representation',
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
    id: 'storage-units', group: G_NUM, paper: 'TECH1', unit: 'I', sub: 'Number Systems and Data Representation',
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
    id: 'bit-capacity', group: G_NUM, paper: 'TECH1', unit: 'I', sub: 'Number Systems and Data Representation',
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
    id: 'highest-normal-form', group: G_DB, paper: 'TECH2', unit: 'II', sub: 'Normalisation',
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
    id: 'dependency-type', group: G_DB, paper: 'TECH2', unit: 'II', sub: 'Normalisation',
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
    id: 'er-to-tables', group: G_DB, paper: 'TECH2', unit: 'II', sub: 'ER Modelling',
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
    id: 'degree-cardinality', group: G_DB, paper: 'TECH2', unit: 'II', sub: 'Relational Database Management System',
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

  /* ============================================ MEMORY ALLOCATION & PAGING */

  DRILLS.push({
    id: 'fit-strategy', group: G_MEM, paper: 'TECH1', unit: 'II', sub: 'Memory Management',
    title: 'First fit, best fit or worst fit — which hole?',
    blurb: 'The three placement strategies, on a partition list built so they disagree.',
    gen(rnd) {
      const req = pick(rnd, [112, 150, 212, 256, 320, 380]);
      const best = req + randInt(rnd, 10, 40);          // tightest hole that still fits
      const first = best + randInt(rnd, 50, 110);       // fits, and appears earlier in the list
      const worst = first + randInt(rnd, 150, 350);     // largest hole overall
      const small1 = Math.max(20, req - randInt(rnd, 30, 80));
      const small2 = Math.max(20, req - randInt(rnd, 40, 90));
      // Order matters: the first hole large enough must NOT be the smallest that fits.
      const holes = [small1, first, small2, best, worst];
      const strat = pick(rnd, ['first', 'best', 'worst']);
      const chosenSize = strat === 'first' ? first : strat === 'best' ? best : worst;
      const idx = holes.indexOf(chosenSize);
      const label = h => `Block ${holes.indexOf(h) + 1} (${h} KB)`;
      const { opts, ans } = build(label(chosenSize), [label(first), label(best), label(worst), label(small1)], rnd);
      const names = { first: 'first fit', best: 'best fit', worst: 'worst fit' };
      return {
        q: `Memory holds free blocks of ${holes.join(' KB, ')} KB, in that order. A process requesting ${req} KB arrives. Which block does ${names[strat]} allocate?`,
        opts, ans,
        steps: [
          `First fit scans from the start and takes the first hole big enough — that is Block 2 (${first} KB), because Block 1 (${small1} KB) is too small.`,
          `Best fit checks every hole and takes the SMALLEST one that fits — Block 4 (${best} KB), a waste of only ${best - req} KB.`,
          `Worst fit takes the LARGEST hole regardless — Block 5 (${worst} KB), on the theory that the leftover is big enough to be reused.`,
          `The question asked for ${names[strat]}, so the answer is Block ${idx + 1} (${chosenSize} KB), leaving ${chosenSize - req} KB unused inside the partition.`,
          `First fit is fastest because it stops scanning early. Best fit wastes least per allocation but leaves a trail of slivers too small to use. Worst fit is the slowest to run and generally performs worst of the three.`,
        ],
        trap: 'Best fit means the smallest adequate hole, not the largest. The names describe the fit quality, not the hole size — "best" is the tightest squeeze.',
      };
    },
  });

  DRILLS.push({
    id: 'internal-fragmentation', group: G_MEM, paper: 'TECH1', unit: 'II', sub: 'Memory Management',
    title: 'Internal fragmentation in the last page',
    blurb: 'Paging always rounds up, and the rounding is wasted memory.',
    gen(rnd) {
      const pageKB = pick(rnd, [2, 4, 8]);
      const pages = randInt(rnd, 5, 40);
      const waste = randInt(rnd, 1, pageKB * 1024 - 1);
      const sizeBytes = pages * pageKB * 1024 - waste;
      const sizeKB = (sizeBytes / 1024).toFixed(2);
      const { opts, ans } = build(`${waste} bytes`, [
        `${pageKB * 1024 - waste} bytes`,        // measured the used part of the last page
        `0 bytes`,
        `${pageKB * 1024} bytes`,
        `${waste * pages} bytes`,
      ], rnd);
      return {
        q: `A process of ${sizeBytes.toLocaleString('en-US')} bytes runs on a system with a page size of ${pageKB} KB. How much internal fragmentation does it suffer?`,
        opts, ans,
        steps: [
          `Page size = ${pageKB} KB = ${(pageKB * 1024).toLocaleString('en-US')} bytes.`,
          `Pages needed = ceil(${sizeBytes.toLocaleString('en-US')} ÷ ${(pageKB * 1024).toLocaleString('en-US')}) = ceil(${(sizeBytes / (pageKB * 1024)).toFixed(3)}) = ${pages} pages.`,
          `Memory actually allocated = ${pages} × ${(pageKB * 1024).toLocaleString('en-US')} = ${(pages * pageKB * 1024).toLocaleString('en-US')} bytes.`,
          `Internal fragmentation = allocated − requested = ${(pages * pageKB * 1024).toLocaleString('en-US')} − ${sizeBytes.toLocaleString('en-US')} = ${waste} bytes.`,
          `Only the LAST page is ever partly empty, so internal fragmentation in paging averages half a page per process, whatever the process size.`,
        ],
        trap: 'Internal fragmentation is the unused space INSIDE an allocated block. External fragmentation is free memory scattered between blocks. Paging eliminates external fragmentation entirely and accepts a little internal in exchange.',
      };
    },
  });

  DRILLS.push({
    id: 'page-count', group: G_MEM, paper: 'TECH1', unit: 'II', sub: 'Memory Management',
    title: 'How many pages and page-table entries?',
    blurb: 'Divide and round up — the page table has one entry per page.',
    gen(rnd) {
      const pageKB = pick(rnd, [1, 2, 4, 8]);
      const procMB = pick(rnd, [1, 2, 4, 8, 16]);
      const pages = (procMB * 1024) / pageKB;
      const { opts, ans } = build(pages.toLocaleString('en-US'), [
        (pages / 2).toLocaleString('en-US'),
        (pages * 2).toLocaleString('en-US'),
        (procMB * 1024).toLocaleString('en-US'),
        pageKB.toLocaleString('en-US'),
      ], rnd);
      return {
        q: `A process occupies ${procMB} MB of logical address space on a system with ${pageKB} KB pages. How many entries does its page table contain?`,
        opts, ans,
        steps: [
          `Convert both to the same unit: ${procMB} MB = ${(procMB * 1024).toLocaleString('en-US')} KB.`,
          `Pages = process size ÷ page size = ${(procMB * 1024).toLocaleString('en-US')} ÷ ${pageKB} = ${pages.toLocaleString('en-US')} pages.`,
          `The page table holds exactly one entry per page, so it has ${pages.toLocaleString('en-US')} entries.`,
          `Each entry maps one page number to one frame number — which is why a small page size means a fast lookup but a very large table.`,
        ],
        trap: 'Pages are the logical side, frames are the physical side, and they are always the SAME size. The page table has one entry per PAGE, not per frame.',
      };
    },
  });

  DRILLS.push({
    id: 'address-split', group: G_MEM, paper: 'TECH1', unit: 'II', sub: 'Memory Management',
    title: 'Split a logical address into page number and offset',
    blurb: 'Page size fixes the offset bits; whatever is left is the page number.',
    gen(rnd) {
      const addrBits = pick(rnd, [16, 20, 24, 32]);
      const offBits = pick(rnd, [10, 11, 12, 13]);
      const pgBits = addrBits - offBits;
      const pageSize = Math.pow(2, offBits);
      const correct = `${pgBits} bits page number, ${offBits} bits offset`;
      const { opts, ans } = build(correct, [
        `${offBits} bits page number, ${pgBits} bits offset`,     // the swap
        `${pgBits + 1} bits page number, ${offBits - 1} bits offset`,
        `${pgBits - 1} bits page number, ${offBits + 1} bits offset`,
        `${addrBits} bits page number, ${offBits} bits offset`,
      ], rnd);
      return {
        q: `A system uses ${addrBits}-bit logical addresses and a page size of ${pageSize >= 1024 ? (pageSize / 1024) + ' KB' : pageSize + ' bytes'}. How is a logical address divided?`,
        opts, ans,
        steps: [
          `The offset must be able to name every byte within one page, so offset bits = log2(page size).`,
          `Page size = ${pageSize.toLocaleString('en-US')} bytes = 2^${offBits}, so the offset takes ${offBits} bits.`,
          `Everything left over is the page number: ${addrBits} − ${offBits} = ${pgBits} bits.`,
          `That gives 2^${pgBits} = ${Math.pow(2, pgBits).toLocaleString('en-US')} pages in the logical address space.`,
          `The offset passes through address translation untouched — only the page number is looked up and replaced by a frame number.`,
        ],
        trap: 'The offset is fixed by the PAGE SIZE, not by the address width. Work it out first, then subtract; doing it the other way round is how the two halves get swapped.',
      };
    },
  });

  DRILLS.push({
    id: 'address-lines', group: G_MEM, paper: 'TECH1', unit: 'I', sub: 'RAM, ROM and Virtual Memory',
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

  DRILLS.push({
    id: 'effective-access-time', group: G_MEM, paper: 'TECH1', unit: 'I', sub: 'Cache Memory',
    title: 'Effective access time from a hit ratio',
    blurb: 'Weight each access time by how often it happens.',
    gen(rnd) {
      const h = pick(rnd, [0.8, 0.85, 0.9, 0.95]);
      const tc = pick(rnd, [10, 20, 25]);
      const tm = tc * pick(rnd, [4, 5, 8, 10]);
      const eat = +(h * tc + (1 - h) * tm).toFixed(2);
      const { opts, ans } = build(`${eat} ns`, [
        `${+(h * tm + (1 - h) * tc).toFixed(2)} ns`,      // weights the wrong way round
        `${+((tc + tm) / 2).toFixed(2)} ns`,              // plain average, ignores the ratio
        `${+(tc + (1 - h) * tm).toFixed(2)} ns`,
        `${tm} ns`,
      ], rnd);
      return {
        q: `A cache has a hit ratio of ${(h * 100).toFixed(0)}%. A cache access takes ${tc} ns and a main-memory access takes ${tm} ns. Taking the effective access time as (hit ratio × cache time) + (miss ratio × memory time), what is it?`,
        opts, ans,
        steps: [
          `Hit ratio h = ${h}, so the miss ratio is 1 − ${h} = ${+(1 - h).toFixed(2)}.`,
          `Hits cost ${tc} ns each: ${h} × ${tc} = ${+(h * tc).toFixed(2)} ns.`,
          `Misses cost ${tm} ns each: ${+(1 - h).toFixed(2)} × ${tm} = ${+((1 - h) * tm).toFixed(2)} ns.`,
          `EAT = ${+(h * tc).toFixed(2)} + ${+((1 - h) * tm).toFixed(2)} = ${eat} ns.`,
          `Note how close ${eat} is to ${tc} rather than to the midpoint — a high hit ratio pulls the average almost all the way down to cache speed, which is the entire justification for having a cache.`,
        ],
        trap: 'Read which model the question states. Some versions charge a miss the cache time AND the memory time (tc + tm), giving a larger figure. The formula is given in the question here — always use the one printed.',
      };
    },
  });

  DRILLS.push({
    id: 'external-fragmentation', group: G_MEM, paper: 'TECH1', unit: 'II', sub: 'Memory Management',
    title: 'External fragmentation and compaction',
    blurb: 'Enough free memory in total, but no single hole big enough.',
    gen(rnd) {
      const holes = shuf([randInt(rnd, 40, 90), randInt(rnd, 100, 160), randInt(rnd, 60, 120), randInt(rnd, 80, 140)], rnd);
      const total = holes.reduce((a, b) => a + b, 0);
      const largest = Math.max(...holes);
      const req = largest + randInt(rnd, 20, 60);        // fits the total, fits no single hole
      const correct = `No — the request fits the ${total} KB total, but the largest single hole is only ${largest} KB`;
      const { opts, ans } = build(correct, [
        `Yes — there is ${total} KB free in total, which is more than ${req} KB`,
        `Yes — the request is split across the ${holes.length} holes automatically`,
        `No — there is less free memory in total than the process requires`,
      ], rnd);
      return {
        q: `Under contiguous allocation, memory has free holes of ${holes.join(' KB, ')} KB. A process requests ${req} KB. Can it be loaded?`,
        opts, ans,
        steps: [
          `Total free memory = ${holes.join(' + ')} = ${total} KB, which is more than the ${req} KB requested.`,
          `But contiguous allocation requires one unbroken block. The largest single hole is ${largest} KB, which is less than ${req} KB.`,
          `So the request fails despite there being enough memory overall. That is the definition of external fragmentation.`,
          `Two fixes: COMPACTION shuffles the allocated blocks together to merge the holes into one ${total} KB block — but it is expensive and needs relocatable addresses. PAGING avoids the problem entirely by dropping the contiguity requirement.`,
        ],
        trap: 'External fragmentation is not a shortage of memory. The memory is there; it is in the wrong shape. Options that say "not enough free memory" are describing a different failure.',
      };
    },
  });

  /* ================================ PROGRAMMING TRAPS, OUTPUT & EXCEPTIONS */
  /* Maps to the official TECH1 Unit I leaves Programming Languages, Object-
     Oriented Programming Concepts and Scripting Languages. These are the items
     where the arithmetic is trivial and the trap is the whole question — the
     examiner is testing one specific piece of language semantics, not maths. */

  DRILLS.push({
    id: 'integer-division', group: G_PROG, paper: 'TECH1', unit: 'I', sub: 'Programming Languages',
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
    id: 'operator-precedence', group: G_PROG, paper: 'TECH1', unit: 'I', sub: 'Programming Languages',
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
    id: 'loop-iterations', group: G_PROG, paper: 'TECH1', unit: 'I', sub: 'Programming Languages',
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
    id: 'exception-type', group: G_PROG, paper: 'TECH1', unit: 'I', sub: 'Object-Oriented Programming Concepts',
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
    id: 'finally-semantics', group: G_PROG, paper: 'TECH1', unit: 'I', sub: 'Object-Oriented Programming Concepts',
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
    id: 'short-circuit', group: G_PROG, paper: 'TECH1', unit: 'I', sub: 'Programming Languages',
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
    id: 'pass-semantics', group: G_PROG, paper: 'TECH1', unit: 'I', sub: 'Object-Oriented Programming Concepts',
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

  window.CALC_DRILLS = DRILLS;
})();
