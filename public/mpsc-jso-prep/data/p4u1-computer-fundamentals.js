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
    },
    {
      h: 'Storage devices, OS types and virtual machines',
      b: '<p><b>Primary storage</b> (semiconductor memory) splits into two families:</p>' +
         '<ul>' +
         '<li><b>RAM</b> — <b>DRAM</b> (one capacitor + transistor per bit, leaks charge so needs <b>periodic refresh</b>, slower, cheap and dense — used as main memory) vs <b>SRAM</b> (flip-flop based, no refresh needed, faster, costlier — used for cache).</li>' +
         '<li><b>ROM family</b> — MROM (mask-programmed at the factory), PROM (user-programmable once, via fuses), EPROM (erasable with UV light), EEPROM (electrically erasable, byte-level), Flash (electrically erasable, block-level — the basis of USB drives and SSDs). All are non-volatile, unlike RAM.</li>' +
         '</ul>' +
         '<p><b>Secondary storage:</b> HDDs (magnetic platters; access time = seek time + rotational latency + transfer time) vs SSDs (NAND flash, no moving parts, faster random access, wear-levelled) vs optical media (CD/DVD/Blu-ray, laser-read).</p>' +
         '<p><b>Types of OS:</b> Batch (jobs queued, no interaction) → Multiprogrammed (several jobs resident, CPU switches to maximise utilisation) → Time-sharing (multiprogramming plus fast switching to give each user the illusion of a dedicated, interactive system) → Real-time (deadline-driven; see below) → Distributed (many autonomous computers presented <em>transparently</em> as one system) → Network OS (autonomous machines that stay visible as separate machines, sharing files/printers, e.g. Windows Server).</p>' +
         '<p><b>Logical/layered structure:</b> hardware → kernel (process, memory, device management) → shell/system-call interface → user applications. Kernel design styles: <b>monolithic</b> (all services in kernel space — fast, but one bug can crash everything; classic Unix/Linux), <b>microkernel</b> (only IPC, basic scheduling and memory in the kernel, the rest as user-space servers — fault-isolated, more IPC overhead; QNX, Minix), <b>layered</b>, and <b>hybrid</b> (Windows NT, macOS XNU).</p>' +
         '<div class="tip"><b>Virtual machines.</b> A <b>hypervisor (VMM)</b> lets one physical machine host several isolated guest OSes. <b>Type 1 / bare-metal</b> runs directly on hardware (VMware ESXi, Hyper-V, Xen — the data-centre choice). <b>Type 2 / hosted</b> runs as an application atop a conventional host OS (VirtualBox, VMware Workstation — convenient for a desktop, but adds a host-OS overhead layer). Forensically, a compromised guest can often be examined from its snapshot/memory-dump files without touching the live hypervisor.</div>'
    },
    {
      h: 'OS services, process concurrency and process generation',
      b: '<p><b>Classic OS services</b> (user-facing: program execution, I/O operations, file-system manipulation, communication/IPC, error detection; system-facing: resource allocation, accounting, protection & security, and the user interface itself — CLI, GUI or batch).</p>' +
         '<p><b>Principles of concurrency:</b> when processes/threads share data, uncontrolled interleaving causes a <b>race condition</b>. A correct solution to the <b>critical-section problem</b> must guarantee three things: <b>mutual exclusion</b> (only one process in its critical section at a time), <b>progress</b> (the choice of who enters next cannot be postponed forever by processes outside their critical/remainder sections), and <b>bounded waiting</b> (a cap on how many times others may enter before a waiting process is finally granted access).</p>' +
         '<p><b>Semaphores</b> are integer variables manipulated only through atomic <code>wait()</code>/<code>signal()</code> (P/V) operations. A <b>counting semaphore</b> guards a resource with several instances; a <b>binary semaphore</b> (0/1) resembles a lock.</p>' +
         '<p><b>Process generation:</b> on Unix/Linux, a process creates a child via <code>fork()</code> — the call returns twice, giving <b>0 to the child</b> and the <b>child\'s PID to the parent</b> (negative on failure). <code>exec()</code> then replaces the calling process\'s memory image with a new program — the common <code>fork()</code>+<code>exec()</code> pattern used to launch a different program. The parent uses <code>wait()</code>/<code>waitpid()</code> to reap a terminated child; an un-reaped terminated child is a <b>zombie</b>, and a child whose parent exits first is <b>orphaned</b> and adopted by init/systemd. Windows has no separate fork/exec split — a single <code>CreateProcess()</code> call does both.</p>' +
         '<div class="tip"><b>Classic exam trap.</b> A <b>mutex</b> has <em>ownership</em> — only the thread that locked it may unlock it. A <b>binary semaphore</b> has no ownership; any thread may signal it, even one that never waited on it, which is exactly what makes semaphores useful for signalling (e.g. producer–consumer) rather than pure exclusion.</div>'
    },
    {
      h: 'Swapping and directory structures',
      b: '<p><b>Swapping</b> moves an entire process (or a large chunk of its image) between main memory and a backing store (swap space) to change the degree of multiprogramming — classically the job of the medium-term scheduler. The key distinction from <b>paging</b> is <b>granularity</b>: swapping acts on a whole process, paging acts on individual fixed-size pages, enabling far finer-grained, on-demand movement (demand paging).</p>' +
         '<p><b>Directory structures</b>, in increasing order of flexibility:</p>' +
         '<ul>' +
         '<li><b>Single-level</b> — one directory for the whole system; no two files anywhere may share a name.</li>' +
         '<li><b>Two-level</b> — one directory per user; solves cross-user name clashes but files still can\'t be shared easily.</li>' +
         '<li><b>Tree-structured</b> — the familiar hierarchical model; every file has exactly one parent, so sharing is not possible.</li>' +
         '<li><b>Acyclic-graph</b> — permits a file/subdirectory to appear in more than one directory via links, while structurally forbidding cycles so deletion and traversal stay well-defined.</li>' +
         '<li><b>General graph</b> — unrestricted, cycles allowed; needs garbage collection (reference counting alone cannot reclaim a cycle), so it is rarely implemented.</li>' +
         '</ul>' +
         '<div class="tip"><b>Hard link vs symbolic link.</b> A <b>hard link</b> is simply another directory entry pointing at the same inode — the data survives as long as the link count stays above zero. A <b>symbolic link</b> is a separate small file holding a path string, which breaks if the target is moved or deleted.</div>'
    },
    {
      h: 'Disk management: scheduling, partitioning and RAID',
      b: '<p>Disk access time = <b>seek time</b> + <b>rotational latency</b> + <b>transfer time</b>. On a mechanical HDD, seek time dominates, so scheduling exists to minimise total head movement.</p>' +
         '<table>' +
         '<tr><th>Algorithm</th><th>Behaviour</th></tr>' +
         '<tr><td>FCFS</td><td>Services requests in arrival order — simple, but head movement can swing wildly</td></tr>' +
         '<tr><td>SSTF</td><td>Always services the request nearest the current head position — low average seek, but can <b>starve</b> far-away requests</td></tr>' +
         '<tr><td>SCAN ("elevator")</td><td>Sweeps to one end of the disk servicing requests, then reverses</td></tr>' +
         '<tr><td>C-SCAN</td><td>Services in one direction only; jumps back to the start without servicing on the return — gives more uniform wait times</td></tr>' +
         '<tr><td>LOOK / C-LOOK</td><td>Like SCAN/C-SCAN but reverses (or jumps) at the <b>last request</b>, not the physical end of the disk — avoids wasted travel</td></tr>' +
         '</table>' +
         '<p><b>Low-level (physical) formatting</b> lays down sectors with header/data/ECC fields, done at manufacture. <b>Partitioning</b> divides the disk into logical partitions. <b>High-level (logical) formatting</b> then writes a file system — boot block, FAT/MFT/inode tables, root directory — onto a partition.</p>' +
         '<div class="tip"><b>RAID.</b> RAID 0 = striping only, no redundancy (fast, one disk failure loses everything). RAID 1 = mirroring (full duplication, tolerates one failure, 50% capacity overhead). RAID 5 = striping with parity distributed across every disk (tolerates one disk failure, better capacity efficiency than mirroring). RAID 10 = striped mirrors. Forensic imaging of a RAID array must respect stripe size, disk order and parity rotation, or reconstruction produces garbage.</div>'
    },
    {
      h: 'File concepts, attributes, operations and memory-mapped files',
      b: '<p><b>File attributes:</b> name, identifier (a unique tag, e.g. an inode number), type, location, size, protection, and time/date/user identification — the <b>MAC times</b> (modified/accessed/created) that Unit III timeline analysis is built on.</p>' +
         '<p><b>File operations:</b> create, open, read, write, append, seek, truncate, rename, delete, close.</p>' +
         '<p><b>File types:</b> identified either by an extension/naming convention (<code>.exe</code>, <code>.txt</code> — a convention, not universally enforced) or by internal structure (text vs binary/executable, with defined header formats such as ELF on Linux or PE on Windows).</p>' +
         '<div class="tip"><b>Memory-mapped files.</b> <code>mmap()</code> (Unix) / <code>MapViewOfFile()</code> (Windows) maps a file directly into a process\'s virtual address space, so ordinary load/store instructions read and write it — the OS\'s paging mechanism transparently fetches and flushes data, and several processes can share one mapping as a form of IPC. Because these pages are ordinary pages, they can still be evicted to the pagefile/swap — so a document only ever "viewed" through a memory-mapped viewer can leave recoverable fragments on disk with no explicit save.</div>'
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
      e: '<p>The Banker\'s algorithm is the classic deadlock <b>avoidance</b> method: before granting a request it simulates the allocation and grants it only if the resulting state remains <em>safe</em>.</p><p>Distinguish carefully — <b>prevention</b> structurally negates a Coffman condition in advance; <b>avoidance</b> makes a dynamic decision per request; <b>detection</b> lets deadlock happen and then finds it. Confusing prevention with avoidance is the most common error here.</p>' },

    { q: 'The hexadecimal number 0x2F is equal to which decimal value?',
      o: ['47', '45', '63', '32'], a: 0,
      e: '<p>0x2F = (2 × 16) + 15 = 32 + 15 = <b>47</b>. Remember F = 15, not 5 — the most common slip in this kind of conversion.</p><p>A quick sanity check: 0x20 = 32 and 0x30 = 48, so 0x2F must land one below 48, confirming 47.</p>' },

    { q: 'Which cache write policy updates main memory only when the modified cache block is evicted, reducing memory traffic but risking data loss on power failure?',
      o: ['Write-through', 'Write-back', 'Write-allocate', 'Write-around'], a: 1,
      e: '<p><b>Write-back</b> marks a modified block with a <em>dirty bit</em> and defers the memory update until the block is evicted, cutting memory traffic at the cost of vulnerability to power loss. <b>Write-through</b> updates cache and memory on every write — slower but always consistent.</p><p>Write-allocate and write-around instead describe what happens on a write <em>miss</em>, a separate design axis from the write-hit policy tested here — a common source of confusion.</p>' },

    { q: 'In a resource-allocation graph where every resource type has exactly one instance, a cycle indicates:',
      o: ['Deadlock is impossible', 'Deadlock is certain', 'The system may or may not be deadlocked — further analysis is needed', 'Only ageing can resolve the situation'], a: 1,
      e: '<p>With single-instance resource types, a cycle in the resource-allocation graph is both <b>necessary and sufficient</b> for deadlock — deadlock is certain.</p><p>When a resource type has multiple instances, a cycle is still necessary but no longer sufficient; you must check whether the cycle actually blocks every process in it from ever proceeding. This single-vs-multiple-instance distinction is a frequent examiner trap.</p>' },

    { q: 'The Translation Lookaside Buffer (TLB) improves virtual memory performance by:',
      o: ['Storing recently used page-table entries so most address translations skip the extra memory access to the page table',
          'Reserving a dedicated physical frame for every process',
          'Replacing the page table entirely',
          'Compressing page-table entries so the whole table fits in cache'], a: 0,
      e: '<p>The <b>TLB</b> is a small, fast associative cache of recent virtual-to-physical page mappings. A hit avoids the extra memory access needed to walk the page table; a miss forces a page-table walk (potentially multiple memory accesses for a multi-level table), after which the result is cached in the TLB.</p><p>Do not confuse a <b>TLB miss</b> (translation not cached, but the page may well be resident in memory) with a <b>page fault</b> (the page is not in memory at all) — they trigger very different handling.</p>' },

    { q: 'Compared with SRAM, DRAM is:',
      o: ['Faster and needs no periodic refresh, which is why it is used for cache',
          'Slower and requires periodic refreshing, but denser and cheaper, which is why it is used for main memory',
          'Non-volatile, which is why it is used for BIOS firmware',
          'Used only inside secondary storage devices such as SSDs'], a: 1,
      e: '<p><b>DRAM</b> stores each bit as charge on a capacitor that leaks over time, so it needs <b>periodic refresh</b>; this makes it slower than <b>SRAM</b> (flip-flop based, no refresh needed) but far denser and cheaper per bit, so DRAM is the standard choice for main memory while the costlier SRAM is reserved for cache.</p><p>Neither is non-volatile — that territory belongs to ROM/EEPROM/Flash, a separate memory family entirely.</p>' },

    { q: 'An operating system in which missing a task\'s deadline is treated as a total system failure — as in an aircraft flight-control system — is classified as a:',
      o: ['Soft real-time OS', 'Hard real-time OS', 'Time-sharing OS', 'Batch OS'], a: 1,
      e: '<p>A <b>hard real-time</b> OS guarantees critical deadlines are met; missing one counts as a system failure, so such systems are used for safety-critical control tasks.</p><p>A <b>soft real-time</b> OS (e.g. audio/video streaming) prefers to meet deadlines but tolerates occasional misses with graceful degradation rather than catastrophic failure.</p>' },

    { q: 'A hypervisor that runs directly on the host\'s hardware, with no underlying host operating system, is called a:',
      o: ['Type 2 / hosted hypervisor', 'Type 1 / bare-metal hypervisor', 'Guest hypervisor', 'Shell hypervisor'], a: 1,
      e: '<p><b>Type 1 (bare-metal)</b> hypervisors — VMware ESXi, Microsoft Hyper-V, Xen — run directly on hardware, which is why they dominate data-centre virtualisation.</p><p><b>Type 2 (hosted)</b> hypervisors, such as VirtualBox or VMware Workstation, run as an ordinary application on top of a conventional host OS — more convenient for a desktop, but with an extra layer of overhead.</p>' },

    { q: 'Which of the following is NOT one of the three requirements a correct solution to the critical-section problem must satisfy?',
      o: ['Mutual exclusion', 'Progress', 'Bounded waiting', 'Fairness in overall CPU scheduling priority'], a: 3,
      e: '<p>The three formal requirements are <b>mutual exclusion</b> (only one process in its critical section at a time), <b>progress</b> (the decision on who enters next cannot be postponed indefinitely by processes outside their critical/remainder sections), and <b>bounded waiting</b> (a cap on how many times other processes may enter before a waiting process is finally granted access).</p><p>"Fairness in scheduling priority" is not part of this formal definition, although bounded waiting does prevent indefinite starvation as a side effect.</p>' },

    { q: 'The key distinction between a mutex lock and a binary semaphore is that:',
      o: ['A mutex can take more than two values, a binary semaphore cannot',
          'A mutex has ownership — only the thread that locked it may unlock it — while a binary semaphore has no such restriction',
          'Semaphores are used only for mutual exclusion, mutexes only for signalling between threads',
          'Mutexes always require busy-waiting, semaphores never do'], a: 1,
      e: '<p>A <b>mutex</b> is owned by whichever thread acquired it; only that thread may release it. A <b>binary semaphore</b> is just a 0/1 counter with no ownership — any thread can signal it, even one that never waited on it, which is exactly what makes semaphores useful for signalling between threads (e.g. producer–consumer), not just exclusion.</p><p>Busy-waiting vs blocking is an implementation choice available to either construct, so option (d) is not a valid general distinction.</p>' },

    { q: 'In a Unix/Linux system, immediately after a successful fork() call, the return value of fork() is:',
      o: ['The parent\'s PID, in both the parent and the child',
          '0 in the parent, and the child\'s PID in the child',
          '0 in the child, and the child\'s PID in the parent',
          'A negative number in both processes'], a: 2,
      e: '<p><code>fork()</code> returns <b>0 to the newly created child</b> and the <b>child\'s actual PID to the parent</b> — this is exactly what lets identical following code branch differently, e.g. <code>if (fork() == 0) { /* child */ } else { /* parent */ }</code>.</p><p>A negative return (in the caller only — there is no child in that case) signals failure, such as hitting a process-limit.</p>' },

    { q: 'Swapping, as a memory-management technique, differs from paging chiefly in that:',
      o: ['Swapping moves an entire process between memory and backing store, while paging moves individual fixed-size pages',
          'Swapping is used only on Linux, paging only on Windows',
          'Swapping eliminates the need for any backing store',
          'Paging can only ever be performed by the long-term scheduler'], a: 0,
      e: '<p>The distinction is <b>granularity</b>: <b>swapping</b> moves a whole process (or a large chunk of its image) wholesale between RAM and swap space, traditionally to adjust the degree of multiprogramming; <b>paging</b> moves individual fixed-size pages, enabling much finer-grained, on-demand movement.</p><p>Both techniques are available on Linux and Windows alike — the OS-specific option is a distractor, not a real distinction.</p>' },

    { q: 'A directory structure that lets a single file appear (be shared) in more than one directory via links, while still structurally preventing cycles, is called a:',
      o: ['Single-level directory structure', 'Two-level directory structure', 'Tree-structured directory', 'Acyclic-graph directory structure'], a: 3,
      e: '<p>The <b>acyclic-graph</b> structure generalises the tree by allowing shared subdirectories/files through links (hard or symbolic), while disallowing cycles so that traversal and deletion stay well-defined.</p><p>A pure <b>tree-structured</b> directory gives every file exactly one parent and no sharing at all — the feature this question is testing you can tell apart.</p>' },

    { q: 'RAID 5 tolerates the failure of a single disk in the array by:',
      o: ['Keeping a full mirrored copy of every disk',
          'Striping data across disks with no redundancy at all',
          'Distributing parity blocks across all the disks along with the striped data',
          'Storing every block twice on the same disk'], a: 2,
      e: '<p><b>RAID 5</b> stripes data across all disks and also computes parity, distributing the parity blocks across every disk in the array (no single dedicated parity disk); if one disk fails, its contents are reconstructed from the surviving data and parity.</p><p>RAID 1 is mirroring (full duplicate copies, 50% capacity overhead); RAID 0 is striping with no redundancy at all, so a single disk failure there loses everything.</p>' },

    { q: 'Memory-mapped file I/O (e.g. via mmap() on Unix) allows a process to:',
      o: ['Access a file\'s contents directly through ordinary memory load/store instructions, with the OS transparently paging data in and out',
          'Bypass the file system entirely and write straight to raw disk sectors',
          'Guarantee a file stays fully resident in RAM until the process exits',
          'Automatically encrypt a file as it is read'], a: 0,
      e: '<p><code>mmap()</code> maps a file\'s contents into the calling process\'s virtual address space; ordinary memory reads/writes then transparently trigger the OS\'s paging mechanism to fetch or flush data, avoiding explicit read()/write() calls and letting multiple processes share the mapping as a form of IPC.</p><p>It does not guarantee full residency — mapped pages are evicted and reloaded on demand just like any other page, which is why remnants of a memory-mapped document can end up in the pagefile/swap even though the user never explicitly saved it.</p>' }
  ]
});
