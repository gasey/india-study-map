window.MPSC.units.push({
  id: 'p4u1',
  paper: 'Paper IV — Cyber Forensic',
  title: 'Computer Fundamentals, OS & File Systems',
  marks: 40,
  syllabus: 'Computer Organization and Architecture: Cache memory. Primary and Secondary Storage devices, Number system - binary and hexadecimal, Endianness. Operating System and File System - Operating system - Windows, Linux, Android, iOS; layered architecture/logical structure of operating system, Types of OS, virtual machine, OS services, Process management, Memory management, Virtual Memory. OS service; Process Concept; Principles of concurrency, Process Generation; Process Scheduling; Scheduling criteria; Scheduling algorithms; Deadlocks; Memory Management; Swapping; Paging; Segmentation; File System concepts, naming, attributes, operations, types, structure, file organization & access (Sequential, Direct, Index Sequential) methods, memory mapped files, directory structures, Different files systems; Access methods; Disk management.',

  notes: [
    {
      h: 'Number systems and endianness',
      b: '<p>Conversions are guaranteed marks — practise until they are mechanical.</p>' +
         '<ul>' +
         '<li>One hex digit = exactly 4 bits (a <b>nibble</b>). One byte = 2 hex digits. This is why forensic hex editors display bytes in pairs.</li>' +
         '<li>Binary → hex: group bits in fours <em>from the right</em>, pad the leftmost group with zeros.</li>' +
         '<li>Decimal → binary: repeated division by 2, then read remainders <em>bottom-up</em>.</li>' +
         '</ul>' +
         '<p><b>Endianness</b> decides the byte order of a multi-byte value in memory or on disk. ' +
         'For the 32-bit value <code>0x12345678</code>:</p>' +
         '<ul>' +
         '<li><b>Little-endian</b> — least significant byte first: <code>78 56 34 12</code>. Used by x86/x64 and by ARM in its usual configuration, so it is what you meet in practice on PCs and phones.</li>' +
         '<li><b>Big-endian</b> — most significant byte first: <code>12 34 56 78</code>. Also called <em>network byte order</em>; used in TCP/IP headers and in formats such as JPEG and PNG.</li>' +
         '</ul>' +
         '<div class="tip"><b>Forensic relevance.</b> Misreading endianness silently corrupts every timestamp you ' +
         'recover. A Windows FILETIME or a Unix epoch value pulled raw out of a disk image must be byte-swapped ' +
         'before it means anything. This is a favourite examiner trap because it links Unit I to Unit III.</div>'
    },
    {
      h: 'Memory hierarchy and cache',
      b: '<p>Ordered by decreasing speed and increasing capacity: <b>registers → cache (L1, L2, L3) → main memory (RAM) → secondary storage (SSD/HDD) → tertiary/backup</b>. Cost per bit falls in the same direction.</p>' +
         '<ul>' +
         '<li><b>Cache</b> exploits <em>locality of reference</em> — temporal (a location used once is likely to be used again soon) and spatial (nearby locations are likely to be used next).</li>' +
         '<li><b>Hit ratio</b> = hits ÷ total accesses. Average access time = <code>h × T_cache + (1 − h) × T_memory</code>.</li>' +
         '<li>Mapping schemes: <b>direct</b> (each block has one possible line — simplest, most conflict misses), <b>fully associative</b> (any line — most flexible, costliest to search), <b>set-associative</b> (compromise, the usual real choice).</li>' +
         '<li>Write policies: <b>write-through</b> (update cache and memory together — safe, slower) vs <b>write-back</b> (update memory only on eviction — faster, risks loss on power failure).</li>' +
         '</ul>' +
         '<p><b>Volatility</b> is the distinction that matters forensically. RAM and cache are volatile and vanish on power-down; disks, SSDs and flash are non-volatile. This is the whole basis of the order of volatility in Unit III.</p>'
    },
    {
      h: 'Process management and scheduling',
      b: '<p>A <b>process</b> is a program in execution, tracked by the OS in a <b>Process Control Block</b> (PCB): PID, state, program counter, registers, memory limits, open file list. States: <em>new → ready → running → waiting → terminated</em>.</p>' +
         '<p>A <b>thread</b> shares the code, data and open files of its process but has its own stack, registers and program counter.</p>' +
         '<table>' +
         '<tr><th>Algorithm</th><th>Preemptive?</th><th>Key property</th></tr>' +
         '<tr><td>FCFS</td><td>No</td><td>Simple; suffers the <b>convoy effect</b> — one long job delays everything behind it</td></tr>' +
         '<tr><td>SJF</td><td>No</td><td><b>Provably optimal</b> average waiting time; needs burst length known in advance</td></tr>' +
         '<tr><td>SRTF</td><td>Yes</td><td>Preemptive SJF; risks starving long processes</td></tr>' +
         '<tr><td>Priority</td><td>Either</td><td>Starvation, solved by <b>ageing</b> (raise priority as a process waits)</td></tr>' +
         '<tr><td>Round Robin</td><td>Yes</td><td>Fair, response-time oriented; performance hinges on the time quantum</td></tr>' +
         '</table>' +
         '<p>Round Robin with a very large quantum degenerates into FCFS; with a very small quantum, context-switch overhead dominates.</p>'
    },
    {
      h: 'Deadlock',
      b: '<p>Four <b>Coffman conditions</b> must hold <em>simultaneously</em> for deadlock: <b>mutual exclusion</b>, <b>hold and wait</b>, <b>no preemption</b>, and <b>circular wait</b>. Break any one and deadlock cannot occur.</p>' +
         '<ul>' +
         '<li><b>Prevention</b> — structurally negate a condition (e.g. impose a global ordering on resource requests to kill circular wait).</li>' +
         '<li><b>Avoidance</b> — grant only requests that leave the system in a <em>safe state</em>. The <b>Banker\'s algorithm</b> does this; it requires advance knowledge of maximum resource needs.</li>' +
         '<li><b>Detection and recovery</b> — allow deadlock, detect cycles in the wait-for graph, then abort or roll back a victim.</li>' +
         '<li><b>Ignore it</b> — the "ostrich algorithm", which is what general-purpose OSes actually do.</li>' +
         '</ul>'
    },
    {
      h: 'Memory management: paging, segmentation, virtual memory',
      b: '<ul>' +
         '<li><b>Paging</b> splits memory into fixed-size <b>frames</b> (physical) and <b>pages</b> (logical). It eliminates external fragmentation but causes <b>internal</b> fragmentation in the last page.</li>' +
         '<li><b>Segmentation</b> uses variable-size, logically meaningful units (code, stack, heap). It causes <b>external</b> fragmentation.</li>' +
         '<li>The <b>TLB</b> caches recent page-table entries so address translation avoids a second memory access.</li>' +
         '<li><b>Virtual memory</b> lets a process run with only part of it resident, using <em>demand paging</em>. Excessive page faults cause <b>thrashing</b> — the machine spends more time paging than computing.</li>' +
         '<li>Replacement policies: FIFO (subject to <b>Belady\'s anomaly</b> — more frames can mean more faults), LRU, Optimal (a theoretical benchmark; unimplementable as it needs the future).</li>' +
         '</ul>' +
         '<div class="tip"><b>Forensic relevance.</b> Virtual memory is why <code>pagefile.sys</code>, <code>hiberfil.sys</code> and swap partitions are prize evidence — they hold pages evicted from RAM, so plaintext, keys and fragments of documents survive on disk after a reboot.</div>'
    },
    {
      h: 'File systems and access methods',
      b: '<table>' +
         '<tr><th>File system</th><th>Native to</th><th>Notes for the examiner</th></tr>' +
         '<tr><td>FAT32</td><td>Legacy Windows, removable media</td><td>Max file size <b>4 GB</b>; no permissions, no journaling</td></tr>' +
         '<tr><td>exFAT</td><td>Large flash media, SD cards</td><td>Lifts the 4 GB limit; still no journaling</td></tr>' +
         '<tr><td>NTFS</td><td>Windows</td><td>Journaling, ACLs, ADS, compression, encryption (EFS); metadata in the <b>MFT</b></td></tr>' +
         '<tr><td>ext4</td><td>Linux</td><td>Journaling, extents, inodes</td></tr>' +
         '<tr><td>APFS / HFS+</td><td>macOS, iOS</td><td>APFS is copy-on-write with snapshots; HFS+ is its predecessor</td></tr>' +
         '</table>' +
         '<p><b>Access methods:</b> <em>Sequential</em> (records read in order, as on tape); <em>Direct/random</em> (jump straight to record <em>n</em>, as on disk); <em>Indexed sequential</em> (ISAM — an index maps keys to block addresses, combining both).</p>' +
         '<p><b>Allocation strategies:</b> contiguous (fast, fragments badly), linked (no external fragmentation, no fast random access), indexed (an index block holds pointers — the basis of the Unix inode).</p>' +
         '<div class="tip"><b>Forensic relevance.</b> <b>Slack space</b> is the gap between where a file\'s data ends ' +
         'and the end of its last allocated cluster. It holds remnants of whatever occupied that cluster before, ' +
         'which is why it is searched. <b>Unallocated space</b> is clusters not currently claimed by any file — ' +
         'where deleted file content lives until overwritten.</div>'
    }
  ],

  questions: [
    { q: 'The 32-bit value 0x0A0B0C0D is written to memory on a little-endian machine. What is the byte sequence, lowest address first?',
      o: ['0A 0B 0C 0D', '0D 0C 0B 0A', '0B 0A 0D 0C', '0C 0D 0A 0B'], a: 1,
      e: '<p>Little-endian stores the <b>least significant byte at the lowest address</b>. The least significant byte of 0x0A0B0C0D is 0x0D, so the order is 0D 0C 0B 0A — a straight reversal of the bytes.</p><p>Option (a) is the big-endian layout. Option (c) swaps within pairs only, a common distractor.</p>' },

    { q: 'The binary number 110110102 expressed in hexadecimal is',
      o: ['0xDA', '0xAD', '0xBC', '0xD2'], a: 0,
      e: '<p>Group into nibbles from the right: <code>1101 1010</code>. 1101 = 13 = D, 1010 = 10 = A. Hence <b>0xDA</b>.</p><p>0xAD would be 10101101 — the nibbles read in the wrong order, which is the intended trap.</p>' },

    { q: 'Which scheduling algorithm gives provably minimum average waiting time?',
      o: ['First Come First Served', 'Round Robin', 'Shortest Job First', 'Priority scheduling'], a: 2,
      e: '<p><b>SJF is optimal</b> for average waiting time — this can be proved by an exchange argument: swapping any adjacent pair so the shorter job runs first never increases total waiting time.</p><p>Its practical problem is that burst length must be known in advance, so real systems estimate it by exponential averaging of past bursts. Note the question asks about <em>average waiting time</em>, not response time; Round Robin is the one favouring response time.</p>' },

    { q: 'Which of the following is NOT one of the four necessary conditions for deadlock?',
      o: ['Mutual exclusion', 'Hold and wait', 'Circular wait', 'Preemption'], a: 3,
      e: '<p>The Coffman conditions are mutual exclusion, hold and wait, <b>NO preemption</b>, and circular wait. <em>Preemption</em> as stated is the opposite of the required condition — if resources can be preempted, deadlock is broken rather than caused.</p><p>Watch the wording carefully: examiners flip "no preemption" to "preemption" precisely because candidates pattern-match on the word alone.</p>' },

    { q: 'Internal fragmentation is a characteristic problem of',
      o: ['Segmentation', 'Paging', 'Contiguous allocation with variable partitions', 'Linked allocation'], a: 1,
      e: '<p><b>Paging</b> uses fixed-size pages, so the final page of a process is usually partly unused — wasted space <em>inside</em> an allocated unit, i.e. internal fragmentation.</p><p>Segmentation and variable partitioning allocate exactly what is asked for, so their waste appears as unusable gaps <em>between</em> allocations — external fragmentation.</p>' },

    { q: 'The maximum size of a single file on a FAT32 volume is',
      o: ['2 GB', '4 GB', '32 GB', '2 TB'], a: 1,
      e: '<p>FAT32 records file size in a <b>32-bit</b> field, giving a ceiling of 2³² − 1 bytes ≈ <b>4 GB</b>. The volume itself can be much larger; it is the per-file limit that is capped.</p><p>This is why exFAT was introduced for large flash media, and why a forensic image over 4 GB must be split into segments when written to a FAT32 destination — a genuinely practical consequence.</p>' },

    { q: 'Belady\'s anomaly — where increasing the number of page frames increases the number of page faults — can occur in',
      o: ['LRU replacement', 'Optimal replacement', 'FIFO replacement', 'Any stack algorithm'], a: 2,
      e: '<p><b>FIFO</b> exhibits Belady\'s anomaly. LRU and Optimal are <em>stack algorithms</em>: the set of pages resident with <em>n</em> frames is always a subset of the set resident with <em>n</em>+1 frames, which mathematically forbids the anomaly.</p><p>Since LRU and Optimal are stack algorithms, option (d) is self-contradictory.</p>' },

    { q: 'In NTFS, the structure that stores metadata for every file and directory on the volume is the',
      o: ['File Allocation Table', 'Master File Table', 'Superblock', 'Inode table'], a: 1,
      e: '<p>The <b>Master File Table (MFT)</b> holds one record (normally 1 KB) per file or directory, carrying timestamps, permissions, and either the data itself (for very small files, "resident" data) or pointers to its clusters.</p><p>The FAT belongs to FAT file systems, the superblock and inode table to ext-family Linux file systems. MFT analysis is named explicitly in the Unit III syllabus, so this cross-links the two units.</p>' },

    { q: 'Slack space in a file system is best described as',
      o: ['Clusters not currently allocated to any file',
          'The unused area between the end of a file\'s data and the end of its last allocated cluster',
          'Space reserved by the OS for the page file',
          'The area of a disk damaged and marked as bad sectors'], a: 1,
      e: '<p>Because storage is allocated in whole clusters, a file rarely fills its last one exactly. That leftover is <b>slack space</b>, and it can still hold data from a previously deleted file that occupied the cluster.</p><p>Option (a) describes <b>unallocated space</b> — a different artefact, also forensically valuable, but distinct. Both terms appear verbatim in the Unit III syllabus ("artifacts recognition from slack space and unallocated space"), so the distinction is fair game.</p>' },

    { q: 'A cache has a hit ratio of 0.9, cache access time 10 ns and main memory access time 100 ns. The average access time is',
      o: ['19 ns', '55 ns', '90 ns', '100 ns'], a: 0,
      e: '<p>Average = <code>h × T_cache + (1 − h) × T_memory</code> = (0.9 × 10) + (0.1 × 100) = 9 + 10 = <b>19 ns</b>.</p><p>Some textbooks add the cache access to every miss as well, giving 0.9×10 + 0.1×110 = 20 ns. Read the question\'s phrasing; where it simply gives two access times as alternatives, use the simple weighted form.</p>' },

    { q: 'Which access method uses an index that maps key values to block addresses, allowing both ordered and direct retrieval?',
      o: ['Sequential access', 'Direct access', 'Indexed sequential access', 'Memory-mapped access'], a: 2,
      e: '<p><b>Indexed sequential (ISAM)</b> keeps records in sorted order <em>and</em> maintains an index, so a record can be reached directly via the index or the file can be read in key order.</p><p>All four terms are listed in the syllabus ("Sequential, Direct, Index Sequential" plus "memory mapped files"), so expect them to be tested against one another.</p>' },

    { q: 'Thrashing in a virtual memory system refers to',
      o: ['Physical damage to disk platters from repeated seeking',
          'A process spending more time servicing page faults than executing',
          'Two processes deadlocked over memory frames',
          'Fragmentation of the page table across memory'], a: 1,
      e: '<p><b>Thrashing</b> occurs when the resident set is too small for a process\'s working set, so nearly every access faults. Throughput collapses while disk activity peaks.</p><p>The standard remedies are the <em>working-set model</em> and <em>page-fault frequency</em> control, which suspend processes to free frames rather than admitting more.</p>' },

    { q: 'Which of the following is a volatile storage medium?',
      o: ['Solid State Drive', 'Cache memory', 'EEPROM', 'Optical disc'], a: 1,
      e: '<p><b>Cache</b> (like RAM and CPU registers) loses its contents when power is removed — it is volatile. SSDs, EEPROM and optical media all retain data without power.</p><p>This is the foundation of the <b>order of volatility</b> in evidence collection: registers and cache first, then RAM, then network state, then disk. Pulling the plug destroys everything above disk.</p>' },

    { q: 'The Banker\'s algorithm is used for deadlock',
      o: ['Prevention', 'Avoidance', 'Detection', 'Recovery'], a: 1,
      e: '<p>The Banker\'s algorithm is the classic deadlock <b>avoidance</b> method: before granting a request it simulates the allocation and grants it only if the resulting state remains <em>safe</em>.</p><p>Distinguish carefully — <b>prevention</b> structurally negates a Coffman condition in advance; <b>avoidance</b> makes a dynamic decision per request; <b>detection</b> lets deadlock happen and then finds it. Confusing prevention with avoidance is the most common error here.</p>' }
  ]
});
