window.MPSC.units.push({
  id: 'p4u1',
  paper: 'Paper IV — Cyber Forensic',
  title: 'Computer Fundamentals, OS & File Systems',
  marks: 40,
  syllabus: 'Computer Organization and Architecture: Cache memory. Primary and Secondary Storage devices, Number system - binary and hexadecimal, Endianness. Operating System and File System - Operating system - Windows, Linux, Android, iOS; layered architecture/logical structure of operating system, Types of OS, virtual machine, OS services, Process management, Memory management, Virtual Memory. OS service; Process Concept; Principles of concurrency, Process Generation; Process Scheduling; Scheduling criteria; Scheduling algorithms; Deadlocks; Memory Management; Swapping; Paging; Segmentation; File System concepts, naming, attributes, operations, types, structure, file organization & access (Sequential, Direct, Index Sequential) methods, memory mapped files, directory structures, Different files systems; Access methods; Disk management.',

  notes: [
    {
      h: 'Number systems and endianness',
      b: '<p>Conversions and byte-order decoding are guaranteed marks on Paper IV — practise until they are mechanical.</p>' +
         '<ul>' +
         '<li>One hex digit = exactly 4 bits (a <b>nibble</b>). One byte = 8 bits = 2 hex digits (<code>0x00</code> to <code>0xFF</code>, or 0 to 255 unsigned). This is why forensic hex editors display bytes in two-character pairs.</li>' +
         '<li><b>Binary → Hex:</b> group bits in fours <em>from the right</em> (least significant bit), pad the leftmost group with zeros, and translate each 4-bit group (<code>0000=0</code> … <code>1001=9</code>, <code>1010=A</code>, <code>1011=B</code>, <code>1100=C</code>, <code>1101=D</code>, <code>1110=E</code>, <code>1111=F</code>).</li>' +
         '<li><b>Binary → Octal:</b> group bits in threes from the right (<code>000=0</code> … <code>111=7</code>).</li>' +
         '<li><b>Decimal → Binary:</b> repeated division by 2, then read remainders <em>bottom-up</em>. For fractional parts, multiply repeatedly by 2 and read integer carries <em>top-down</em>.</li>' +
         '<li><b>Signed integers (2\'s complement):</b> to negate a binary number, invert every bit (1\'s complement) and add 1 to the LSB. For an $n$-bit signed integer, the range is $-2^{n-1}$ to $+2^{n-1}-1$ (for 8 bits: $-128$ to $+127$). Unlike sign-magnitude or 1\'s complement, 2\'s complement has only <b>one representation of zero</b> (<code>00000000</code>).</li>' +
         '</ul>' +
         '<div class="analogy"><b>💡 Analogy — Endianness as Writing Dates:</b> Think of writing the date 25 December 2026. <b>Little-endian</b> is like Day-Month-Year (25-12-2026) — the <em>smallest, fastest-changing unit comes first</em> at the lowest memory address. <b>Big-endian</b> is like ISO Year-Month-Day (2026-12-25) — the <em>most significant unit comes first</em>, just as we read numbers left-to-right in English. Neither changes the date itself, only the order the bytes sit in memory boxes!</div>' +
         '<p><b>Endianness</b> decides the byte order of a multi-byte integer in memory or on disk. For the 32-bit value <code>0x12345678</code> stored starting at address <code>0x1000</code>:</p>' +
         '<div class="diagram"><div class="diag-title">Little-Endian (x86/x64, ARM default, NTFS, EXT4) vs Big-Endian (Network TCP/IP, JPEG, PNG)</div>' +
         '<p style="margin:4px 0;font-size:12px"><b>Little-Endian (LSB at lowest address):</b></p>' +
         '<div class="byte-grid">' +
         '<div class="byte-cell"><span class="addr">0x1000</span><span class="val">78</span><span class="lbl">LSB</span></div>' +
         '<div class="byte-cell"><span class="addr">0x1001</span><span class="val">56</span><span class="lbl">Byte 1</span></div>' +
         '<div class="byte-cell"><span class="addr">0x1002</span><span class="val">34</span><span class="lbl">Byte 2</span></div>' +
         '<div class="byte-cell"><span class="addr">0x1003</span><span class="val">12</span><span class="lbl">MSB</span></div>' +
         '</div>' +
         '<p style="margin:6px 0 4px;font-size:12px"><b>Big-Endian / Network Byte Order (MSB at lowest address):</b></p>' +
         '<div class="byte-grid">' +
         '<div class="byte-cell"><span class="addr">0x1000</span><span class="val">12</span><span class="lbl">MSB</span></div>' +
         '<div class="byte-cell"><span class="addr">0x1001</span><span class="val">34</span><span class="lbl">Byte 2</span></div>' +
         '<div class="byte-cell"><span class="addr">0x1002</span><span class="val">56</span><span class="lbl">Byte 1</span></div>' +
         '<div class="byte-cell"><span class="addr">0x1003</span><span class="val">78</span><span class="lbl">LSB</span></div>' +
         '</div></div>' +
         '<div class="example"><b>🔬 Worked Forensic Example — Decoding a Little-Endian Timestamp from a Hex Dump:</b><br>' +
         'While inspecting an NTFS partition in a hex editor, you find a 4-byte Unix timestamp at offset <code>0x0240</code> reading: <code>80 51 81 65</code>.<br>' +
         '1. <b>Reverse the byte pairs</b> (not the characters inside each byte!) because x86/NTFS is little-endian: <code>80 51 81 65</code> → <code>0x65815180</code>.<br>' +
         '2. <b>Convert to decimal:</b> $(6 \\times 16^7) + (5 \\times 16^6) + (8 \\times 16^5) + (1 \\times 16^4) + (5 \\times 16^3) + (1 \\times 16^2) + (8 \\times 16^1) + 0 = 1,702,973,824$ seconds since 1 Jan 1970 UTC.<br>' +
         '3. <b>Result:</b> 19 December 2023, 08:17:04 UTC. If you forgot to byte-swap and decoded <code>0x80518165</code> directly, you would get a date in the year 2038+ and ruin your timeline!</div>' +
         '<div class="tip"><b>⚠️ Examiner Trap:</b> When reversing for little-endian, reverse <em>whole bytes (pairs of hex digits)</em>, never individual hex digits! <code>0x12345678</code> becomes <code>78 56 34 12</code>, <b>never</b> <code>87 65 43 21</code>.</div>'
    },
    {
      h: 'Memory hierarchy and cache',
      b: '<p>Ordered by decreasing speed, decreasing cost per bit, and increasing capacity:</p>' +
         '<div class="diagram"><div class="diag-title">The Computer Memory Hierarchy & Volatility Boundary</div>' +
         '<div class="flow-row">' +
         '<div class="flow-step"><b>CPU Registers</b><small>&lt;1 ns · Bytes · Volatile</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>L1 / L2 / L3 Cache</b><small>1–15 ns · KB–MB (SRAM) · Volatile</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>Main Memory (RAM)</b><small>50–100 ns · GB (DRAM) · Volatile</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>Secondary (SSD / HDD)</b><small>0.1–10 ms · TB · Non-Volatile</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>Tertiary / Tape / Cloud</b><small>Seconds+ · PB · Non-Volatile</small></div>' +
         '</div></div>' +
         '<div class="analogy"><b>💡 Analogy — The Chef\'s Kitchen:</b> <b>Registers</b> are the ingredients currently in the chef\'s hands. <b>Cache (L1/L2/L3)</b> is the chopping board right in front of the chef (tiny, instant reach). <b>Main Memory (RAM)</b> is the kitchen refrigerator (walks a few steps). <b>Secondary storage (SSD/HDD)</b> is the warehouse down the street. You keep what you are using right now (<em>temporal locality</em>) and nearby ingredients for the same recipe (<em>spatial locality</em>) on the chopping board!</div>' +
         '<ul>' +
         '<li><b>Cache</b> exploits <em>locality of reference</em> — <b>temporal</b> (a memory address accessed once is likely to be accessed again soon, e.g., loop counters) and <b>spatial</b> (addresses near a recently accessed address are likely to be needed next, e.g., array elements or sequential instructions).</li>' +
         '<li><b>Hit ratio ($h$):</b> hits $\\div$ total accesses. <b>Effective / Average Memory Access Time (EMAT):</b>' +
         '<br>• <em>Simultaneous / look-aside lookup:</em> $T_{\\text{avg}} = h \\times T_{\\text{cache}} + (1 - h) \\times T_{\\text{memory}}$' +
         '<br>• <em>Hierarchical lookup (cache checked first, then RAM on miss):</em> $T_{\\text{avg}} = T_{\\text{cache}} + (1 - h) \\times T_{\\text{memory}}$</li>' +
         '<li><b>Cache mapping schemes</b> split a physical address into tag, index/set, and block offset:' +
         '<br>• <b>Direct mapping:</b> block $B$ can go only to line $(B \\bmod M)$. Address = <code>[Tag | Line Index | Word Offset]</code>. Simplest hardware, but suffers high <em>conflict/thrashing misses</em> when two active blocks map to the same line.' +
         '<br>• <b>Fully associative:</b> any block can occupy any cache line. Address = <code>[Tag | Word Offset]</code>. Zero conflict misses, but requires expensive parallel comparators across every line.' +
         '<br>• <b>$k$-way Set-Associative:</b> cache is divided into $S$ sets of $k$ lines each; block $B$ maps to set $(B \\bmod S)$ and can sit in any of its $k$ lines. Address = <code>[Tag | Set Index | Word Offset]</code>. Best practical trade-off.</li>' +
         '<li><b>Write policies:</b> <b>Write-through</b> updates cache and RAM simultaneously (always consistent, high bus traffic) vs <b>Write-back</b> (updates only cache and sets a <b>dirty bit</b>; writes to RAM only when the line is evicted — much faster, but unwritten dirty blocks are lost on power cut). On a write miss: <b>write-allocate</b> loads the block into cache first (paired with write-back), while <b>no-write-allocate / write-around</b> writes straight to RAM (paired with write-through).</li>' +
         '</ul>' +
         '<div class="example"><b>🔬 Worked Numerical — Cache Address Bit Split & EMAT:</b><br>' +
         '<b>Part A:</b> A system has 32-bit physical addresses, a 64 KB 4-way set-associative cache, and 64-byte blocks. Find the Tag, Set, and Offset bits.<br>' +
         '• Block size = $64 = 2^6$ bytes $\\Rightarrow$ <b>Byte Offset = 6 bits</b>.<br>' +
         '• Total cache lines = $64\\text{ KB} / 64\\text{ B} = 2^{16} / 2^6 = 2^{10} = 1024$ lines.<br>' +
         '• Number of sets (4-way) = $1024 / 4 = 256 = 2^8$ sets $\\Rightarrow$ <b>Set Index = 8 bits</b>.<br>' +
         '• <b>Tag bits</b> = $32 - 8 - 6 =$ <b>18 bits</b>.<br>' +
         '<b>Part B:</b> If $T_{\\text{cache}} = 4\\text{ ns}$, $T_{\\text{RAM}} = 80\\text{ ns}$, and hit ratio $h = 0.95$, then simultaneous $T_{\\text{avg}} = (0.95 \\times 4) + (0.05 \\times 80) = 3.8 + 4.0 =$ <b>7.8 ns</b>.</div>' +
         '<div class="tip"><b>⚠️ Forensic Relevance:</b> Volatility is the foundation of the <b>RFC 3227 Order of Volatility</b> in Unit III: registers and cache are the most ephemeral evidence on earth, followed by RAM, then disk. Pulling the power cord wipes dirty write-back cache lines and all of RAM instantly.</div>'
    },
    {
      h: 'Process management and scheduling',
      b: '<p>A <b>process</b> is a program in execution — an active entity with its own address space — tracked by the OS in a <b>Process Control Block (PCB)</b> containing: Process ID (PID), process state, program counter (PC), CPU registers, scheduling priority, memory management pointers (page/segment tables), accounting info, and open file descriptors.</p>' +
         '<div class="diagram"><div class="diag-title">5-State Process Lifecycle & Schedulers</div>' +
         '<div class="flow-row">' +
         '<div class="flow-step"><b>New</b><small>Long-Term Scheduler admits</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>Ready</b><small>In RAM, waiting for CPU</small></div><span class="flow-arrow">⇄</span>' +
         '<div class="flow-step"><b>Running</b><small>Short-Term dispatches; Preempt / Quantum expires</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>Terminated</b><small>exit() called</small></div>' +
         '</div>' +
         '<p style="margin:6px 0 0;font-size:12px"><em>Side loop:</em> <b>Running → Waiting/Blocked</b> (when requesting I/O or event) → <b>Ready</b> (when I/O interrupt completes). The <b>Medium-Term Scheduler</b> swaps blocked/ready processes out to disk (<em>Suspended</em> states) to control the degree of multiprogramming.</p></div>' +
         '<div class="vs-grid">' +
         '<div class="vs-card"><h4>Process (Heavyweight)</h4><p>Has its own isolated virtual address space (code, data, heap, stack) and PCB. Context switching between processes requires flushing/reloading the TLB and page tables — high overhead. Inter-process communication requires explicit IPC (pipes, shared memory, sockets).</p></div>' +
         '<div class="vs-card"><h4>Thread (Lightweight Process)</h4><p>Shares the <b>code, global data, heap, and open files</b> of its parent process, but has its own private <b>Program Counter, Register set, and Stack</b>. Switching threads within the same process is fast because the address space and TLB stay unchanged.</p></div>' +
         '</div>' +
         '<table>' +
         '<tr><th>Algorithm</th><th>Preemptive?</th><th>Key Property & Forensic / System Behaviour</th></tr>' +
         '<tr><td><b>FCFS</b> (First Come First Served)</td><td>No</td><td>Simple FIFO queue; suffers the <b>convoy effect</b> — one CPU-bound giant delays every short interactive job behind it. No starvation.</td></tr>' +
         '<tr><td><b>SJF</b> (Shortest Job First)</td><td>No</td><td><b>Provably optimal</b> minimum average waiting time among non-preemptive policies; needs next CPU burst predicted via exponential averaging. Can starve long jobs.</td></tr>' +
         '<tr><td><b>SRTF</b> (Shortest Remaining Time First)</td><td>Yes</td><td>Preemptive SJF; gives the absolute minimum average waiting time across all algorithms, but risks starving long processes and adds context-switch cost.</td></tr>' +
         '<tr><td><b>Priority</b></td><td>Either</td><td>Highest priority runs first. Suffers <b>indefinite blocking (starvation)</b> of low-priority tasks, solved by <b>ageing</b> (gradually boosting priority the longer a process waits).</td></tr>' +
         '<tr><td><b>Round Robin (RR)</b></td><td>Yes</td><td>Time-sharing favourite; each ready process gets a fixed <b>time quantum $q$</b>. No starvation; optimises <b>response time</b>. If $q \\to \\infty$, RR degenerates into FCFS; if $q \\to 0$, context-switch overhead dominates.</td></tr>' +
         '</table>'
    },
    {
      h: 'Scheduling criteria',
      b: '<p>Scheduling <b>algorithms</b> are the mechanism; scheduling <b>criteria</b> are the mathematical yardsticks used to evaluate them. Memorise the exact equations:</p>' +
         '<ul>' +
         '<li><b>Turnaround Time (TAT):</b> $\\text{TAT} = \\text{Completion Time (CT)} - \\text{Arrival Time (AT)}$ (total elapsed time from submission to completion).</li>' +
         '<li><b>Waiting Time (WT):</b> $\\text{WT} = \\text{TAT} - \\text{Burst Time (BT)}$ (total time spent sitting in the ready queue).</li>' +
         '<li><b>Response Time (RT):</b> $\\text{RT} = \\text{Time of FIRST CPU allocation} - \\text{Arrival Time}$ (crucial for interactive UI responsiveness).</li>' +
         '<li><b>CPU Utilization & Throughput:</b> we <b>maximize</b> CPU utilization (% busy time) and throughput (jobs finished per second), while we <b>minimize</b> TAT, WT, and RT.</li>' +
         '</ul>' +
         '<div class="example"><b>🔬 Worked Numerical — FCFS vs SJF vs SRTF Gantt Chart & Waiting Times:</b><br>' +
         'Consider 3 processes: <b>P1</b> (AT = 0, BT = 8), <b>P2</b> (AT = 1, BT = 4), <b>P3</b> (AT = 2, BT = 2).<br>' +
         '• <b>Under FCFS:</b> Order is <code>[P1: 0–8][P2: 8–12][P3: 12–14]</code>.<br>' +
         '  Waiting times: $\\text{WT}(P_1) = 0$; $\\text{WT}(P_2) = 8 - 1 = 7$; $\\text{WT}(P_3) = 12 - 2 = 10$. <b>Average WT</b> = $(0 + 7 + 10)/3 =$ <b>5.67 ms</b>.<br>' +
         '• <b>Under Non-preemptive SJF:</b> P1 starts at 0 and runs till 8. At $t=8$, both P2 (BT=4) and P3 (BT=2) have arrived; shorter P3 goes first: <code>[P1: 0–8][P3: 8–10][P2: 10–14]</code>.<br>' +
         '  Waiting times: $\\text{WT}(P_1) = 0$; $\\text{WT}(P_3) = 8 - 2 = 6$; $\\text{WT}(P_2) = 10 - 1 = 9$. <b>Average WT</b> = $(0 + 6 + 9)/3 =$ <b>5.00 ms</b>.<br>' +
         '• <b>Under Preemptive SRTF:</b> P1 runs 0–1 (rem=7); at $t=1$, P2 (BT=4 &lt; 7) preempts P1 and runs 1–2 (rem=3); at $t=2$, P3 (BT=2 &lt; 3) preempts P2 and runs 2–4; then P2 finishes 4–7; then P1 finishes 7–14.<br>' +
         '  Completion times: $P_3=4, P_2=7, P_1=14$.<br>' +
         '  Waiting times: $\\text{WT}(P_1) = (14 - 0) - 8 = 6$; $\\text{WT}(P_2) = (7 - 1) - 4 = 2$; $\\text{WT}(P_3) = (4 - 2) - 2 = 0$. <b>Average WT</b> = $(6 + 2 + 0)/3 =$ <b>2.67 ms</b>!</div>' +
         '<div class="tip"><b>⚠️ Examiner Trap — Turnaround vs Response Time:</b> A batch payroll job cares about <em>Turnaround Time</em> (when is the whole report done?). A user typing into a terminal cares about <em>Response Time</em> (how fast does the character echo on screen?). Round Robin has worse average turnaround time than SJF when jobs have similar lengths, yet wins on interactive desktops because it guarantees bounded <b>response time</b>.</div>'
    },
    {
      h: 'Deadlock',
      b: '<p>A set of processes is <b>deadlocked</b> when every process in the set is waiting for an event (resource release) that can only be caused by another process in the same waiting set.</p>' +
         '<div class="analogy"><b>💡 Analogy — Four Cars at a Single-Lane Four-Way Junction:</b> Imagine four cars arriving simultaneously at an intersection where each car has entered half of its lane (<b>Hold and Wait</b>), only one car can occupy a lane spot at a time (<b>Mutual Exclusion</b>), cars cannot be lifted out by a crane or forced to reverse (<b>No Preemption</b>), and North waits for East, East waits for South, South waits for West, and West waits for North (<b>Circular Wait</b>). Nobody moves forever!</div>' +
         '<p>Four <b>Coffman conditions</b> must hold <em>simultaneously</em> for deadlock to occur: <b>1. Mutual exclusion</b>, <b>2. Hold and wait</b>, <b>3. No preemption</b>, and <b>4. Circular wait</b>.</p>' +
         '<ul>' +
         '<li><b>Deadlock Prevention:</b> structurally falsify at least one Coffman condition before execution (e.g., eliminate <em>Hold and Wait</em> by requiring a process to request all resources at once before starting; or eliminate <em>Circular Wait</em> by assigning a strict global numerical ordering $R_1 < R_2 < \\dots < R_m$ and forcing processes to request resources only in increasing order).</li>' +
         '<li><b>Deadlock Avoidance:</b> dynamically inspect every resource request and grant it only if the resulting state is a <b>safe state</b> (one where at least one <em>safe sequence</em> $\\langle P_{i_1}, P_{i_2}, \\dots, P_{i_n}\\rangle$ exists allowing every process to finish even if all demand their maximum declared resources). Uses a <b>Resource-Allocation Graph (RAG)</b> with claim edges for single-instance resources, or Dijkstra\'s <b>Banker\'s Algorithm</b> for multi-instance resources.</li>' +
         '<li><b>Deadlock Detection & Recovery:</b> allow deadlock to occur, periodically run a cycle-detection / safety check on current requests, and recover by aborting all deadlocked processes, aborting one victim at a time, or preempting resources with rollback.</li>' +
         '<li><b>Ostrich Algorithm (Ignore):</b> pretend deadlocks never happen because the cost of constant prevention/avoidance exceeds the rare annoyance of a manual reboot (used by Windows, Linux, macOS).</li>' +
         '</ul>' +
         '<div class="clarity"><b>⚡ Concept Clarity — Safe vs Unsafe vs Deadlocked State:</b><br>' +
         'Every <b>deadlocked</b> state is an <b>unsafe</b> state, but <b>NOT every unsafe state is deadlocked!</b> An unsafe state simply means the OS can no longer <em>guarantee</em> deadlock avoidance if processes suddenly request their maximum remaining claims; if processes release resources early without asking for their maximums, an unsafe state can still complete without deadlocking.</div>' +
         '<div class="example"><b>🔬 Worked Numerical — Banker\'s Algorithm Safe Sequence:</b><br>' +
         'A system has <b>10 instances</b> of a resource. Currently <b>Available = 2</b>. Three processes have:<br>' +
         '• <b>P0:</b> Allocation = 3, Max = 9 $\\Rightarrow$ <b>Need</b> $= \\text{Max} - \\text{Alloc} = 6$<br>' +
         '• <b>P1:</b> Allocation = 3, Max = 5 $\\Rightarrow$ <b>Need</b> $= 5 - 3 = 2$<br>' +
         '• <b>P2:</b> Allocation = 2, Max = 6 $\\Rightarrow$ <b>Need</b> $= 6 - 2 = 4$<br>' +
         '<b>Step 1:</b> Compare $\\text{Need} \\le \\text{Available (2)}$. Only <b>P1</b> ($\text{Need}=2 \\le 2$) can be satisfied! Run P1 to completion; it releases its 3 allocated units. New $\\text{Available} = 2 + 3 = 5$.<br>' +
         '<b>Step 2:</b> Now with $\\text{Available} = 5$, <b>P2</b> ($\text{Need}=4 \\le 5$) can run! It finishes and releases its 2 units. New $\\text{Available} = 5 + 2 = 7$.<br>' +
         '<b>Step 3:</b> Now with $\\text{Available} = 7$, <b>P0</b> ($\text{Need}=6 \\le 7$) runs and finishes, bringing $\\text{Available} = 7 + 3 = 10$.<br>' +
         '<b>Conclusion:</b> The state is <b>SAFE</b> with safe sequence $\\langle P_1, P_2, P_0 \\rangle$.</div>'
    },
    {
      h: 'Memory management: paging, segmentation, virtual memory',
      b: '<div class="analogy"><b>💡 Analogy — Paging vs Segmentation:</b> Imagine moving a library of multi-chapter books into storage boxes. <b>Paging</b> chops every book into uniform 100-page stacks that fit into identical fixed-size plastic crates (<b>frames</b>). There is never wasted space between crates (no external fragmentation), though the last crate of a book may be half-empty (<b>internal fragmentation</b>). <b>Segmentation</b> keeps each logical chapter intact in a custom-sized box matching that chapter\'s exact length (Code segment, Stack segment, Heap segment). No space is wasted inside a box, but when chapters are removed and replaced, awkward gaps appear on the shelf between boxes (<b>external fragmentation</b>).</div>' +
         '<div class="vs-grid">' +
         '<div class="vs-card"><h4>Paging (Fixed-Size Units)</h4><p>• Logical memory split into <b>Pages</b>; physical RAM split into equal-sized <b>Frames</b>.<br>• Logical address $= \\langle \\text{Page Number } p, \\text{Page Offset } d \\rangle$.<br>• Invisible to the programmer.<br>• Causes <b>internal fragmentation</b> (average $\\frac{1}{2}$ page per process); zero external fragmentation.</p></div>' +
         '<div class="vs-card"><h4>Segmentation (Logical Variable Units)</h4><p>• Memory split into logical modules: <code>main()</code>, library, stack, symbol table.<br>• Logical address $= \\langle \\text{Segment } s, \\text{Offset } d \\rangle$; checked against Segment Table <code>(Base, Limit)</code>.<br>• Visible to compiler/programmer.<br>• Causes <b>external fragmentation</b>; zero internal fragmentation.</p></div>' +
         '</div>' +
         '<ul>' +
         '<li><b>Translation Lookaside Buffer (TLB):</b> a fast hardware associative cache storing recent $(p \\to f)$ page-table translations. With TLB lookup time $c$, memory access time $m$, and TLB hit ratio $\\alpha$, Effective Access Time (for a single-level page table in RAM, no page fault) is: $$\\text{EAT} = \\alpha(c + m) + (1 - \\alpha)(c + 2m)$$</li>' +
         '<li><b>Virtual Memory & Demand Paging:</b> allows a process whose logical size exceeds physical RAM to execute by bringing pages into RAM only when referenced. If the valid/invalid bit in the page table is <em>invalid</em>, the CPU traps to the OS via a <b>page fault</b>. With page-fault rate $p$ ($0 \\le p \\le 1$) and page-fault service time $S$: $$\\text{EAT} = (1 - p) \\times T_{\\text{mem}} + p \\times S$$</li>' +
         '<li><b>Page replacement algorithms:</b>' +
         '<br>• <b>FIFO:</b> replaces the oldest resident page; suffers from <b>Belady\'s Anomaly</b> (giving the process <em>more</em> physical frames can paradoxically cause <em>more</em> page faults, e.g., on reference string <code>1,2,3,4,1,2,5,1,2,3,4,5</code> going from 3 frames [9 faults] to 4 frames [10 faults]).' +
         '<br>• <b>Optimal (OPT / MIN):</b> replaces the page that will not be used for the longest period in the future; lowest possible fault rate, but unimplementable online (used as a benchmark).' +
         '<br>• <b>LRU (Least Recently Used):</b> replaces the page whose last use is furthest in the past. Both OPT and LRU are <b>stack algorithms</b> and are mathematically immune to Belady\'s anomaly.</li>' +
         '<li><b>Thrashing:</b> when the sum of working sets exceeds total physical frames ($\sum WSS_i > m$), processes fault continuously and CPU utilization plunges. Controlled using the <b>Working-Set Model</b> or <b>Page-Fault Frequency (PFF)</b>.</li>' +
         '</ul>' +
         '<div class="example"><b>🔬 Worked Numerical — Virtual Address Bit-Split & Page Table Size:</b><br>' +
         'A system has a 32-bit virtual address space, 4 GB of physical RAM, 4 KB page size, and 4-byte page-table entries (PTEs).<br>' +
         '1. Page size $= 4\\text{ KB} = 2^{12}$ bytes $\\Rightarrow$ <b>Page Offset $d = 12$ bits</b>.<br>' +
         '2. Virtual Page Number $p = 32 - 12 =$ <b>20 bits</b> $\\Rightarrow 2^{20} = 1\\text{ Million}$ pages per process.<br>' +
         '3. Single-level Page Table size per process $= 2^{20} \\text{ entries} \\times 4\\text{ bytes} =$ <b>4 MB</b>!</div>' +
         '<div class="tip"><b>⚠️ Forensic Relevance:</b> Virtual memory is why <code>pagefile.sys</code>, <code>swapfile.sys</code>, <code>hiberfil.sys</code> (Windows) and swap partitions (Linux) are goldmines in Cyber Forensics: when RAM fills up, pages containing decrypted passwords, chat messages, and unsaved Notepad buffers are evicted to disk where they survive reboots!</div>'
    },
    {
      h: 'File systems and access methods',
      b: '<table>' +
         '<tr><th>File System</th><th>Native OS</th><th>Key Internal Structures & Forensic Notes</th></tr>' +
         '<tr><td><b>FAT32</b></td><td>Legacy Windows, USB drives, SD cards</td><td>Max single file size = <b>4 GB − 1 byte</b> ($2^{32}-1$); max volume = 2 TB (with 512 B sectors). Uses a linked-allocation table (FAT); deleted files have first byte of directory entry overwritten with <code>0xE5</code>. No journaling, no ACL permissions.</td></tr>' +
         '<tr><td><b>exFAT</b></td><td>Large SDXC cards, flash drives</td><td>64-bit file size limit (16 EB theoretical); uses allocation bitmap; still no journaling or ACLs.</td></tr>' +
         '<tr><td><b>NTFS</b></td><td>Windows NT/10/11</td><td>Everything is a file described by a <b>1024-byte (1 KB) record</b> in the <b>Master File Table (<code>$MFT</code>)</b>. Supports journaling (<code>$LogFile</code> + <code>$UsnJrnl</code>), ACLs, Alternate Data Streams (ADS), BitLocker/EFS encryption, and resident files (&lt; ~700 B stored directly inside the MFT record).</td></tr>' +
         '<tr><td><b>ext4</b></td><td>Linux</td><td>Divided into block groups with <b>Superblock</b>, Group Descriptors, Block/Inode bitmaps, and <b>Inode table</b>. Uses <b>extents</b> (contiguous runs of blocks) instead of old indirect block lists, plus <code>jbd2</code> journaling.</td></tr>' +
         '<tr><td><b>APFS / HFS+</b></td><td>macOS, iOS, iPadOS</td><td><b>APFS</b> uses 64-bit inode numbers, <b>copy-on-write (CoW)</b> metadata (instead of traditional journaling), space sharing, native snapshots, and per-file encryption keys.</td></tr>' +
         '</table>' +
         '<p><b>Disk Block Allocation Strategies:</b></p>' +
         '<ul>' +
         '<li><b>Contiguous allocation:</b> each file occupies a single contiguous run of blocks (defined by start block + length). Fastest sequential and direct access, but suffers severe <b>external fragmentation</b> and files cannot grow easily (used on CD-ROM/ISO-9660).</li>' +
         '<li><b>Linked allocation:</b> each block holds a pointer to the next block (or pointers are centralised in a <b>FAT</b> table in RAM). Zero external fragmentation, files grow easily, but raw linked blocks have poor random access and losing one pointer breaks the chain.</li>' +
         '<li><b>Indexed allocation:</b> an <b>index block (inode)</b> holds an array of block pointers (e.g., 12 direct pointers + single, double, and triple indirect pointers in classic Unix). Supports fast random access without external fragmentation.</li>' +
         '</ul>' +
         '<div class="diagram"><div class="diag-title">Anatomy of a Cluster: Logical Size, RAM Slack, Drive Slack & Unallocated Space</div>' +
         '<div class="flow-row">' +
         '<div class="flow-step"><b>Allocated File Data</b><small>0 – 1,200 bytes (Logical EOF)</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>RAM Slack</b><small>1,201 – 1,536 B (Zero-padded to end of 512 B sector)</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>File / Drive Slack</b><small>1,537 – 4,096 B (Remnant sectors in 4 KB cluster!)</small></div><span class="flow-arrow">→</span>' +
         '<div class="flow-step"><b>Unallocated Clusters</b><small>Clusters marked free in $Bitmap / FAT</small></div>' +
         '</div></div>' +
         '<div class="clarity"><b>⚡ Concept Clarity — Slack Space vs Unallocated Space vs Resident Data:</b><br>' +
         '• <b>Slack Space:</b> the unused tail inside the <em>last cluster allocated to an active file</em> (between Logical Size and Physical Cluster Size). It cannot be used by any other file and preserves remnants of previously deleted files that once used those sectors.<br>' +
         '• <b>Unallocated Space:</b> whole clusters currently marked as <code>0</code> (free) in the volume bitmap or FAT; holds deleted files until overwritten by new files.<br>' +
         '• <b>NTFS Resident File:</b> if a file on NTFS is tiny (~100–700 bytes), NTFS stores its data <em>directly inside the 1024-byte MFT record itself</em> without allocating any external cluster at all — so it creates zero cluster slack!</div>'
    },
    {
      h: 'Storage devices, OS types and virtual machines',
      b: '<p><b>Primary storage (Semiconductor memory):</b></p>' +
         '<div class="vs-grid">' +
         '<div class="vs-card"><h4>SRAM (Static RAM)</h4><p>• 6-transistor flip-flop latch per bit.<br>• Retains data as long as power is on — <b>no refresh</b> needed.<br>• Very fast (~1–10 ns), low density, expensive, high heat.<br>• Used for <b>CPU Cache (L1, L2, L3)</b> and registers.</p></div>' +
         '<div class="vs-card"><h4>DRAM (Dynamic RAM)</h4><p>• 1 MOSFET transistor + 1 tiny capacitor per bit.<br>• Capacitor leaks charge in milliseconds — requires <b>periodic refresh circuitry</b>.<br>• Slower (~50–80 ns), very high density, cheap.<br>• Used for <b>Main System Memory (DDR4/DDR5 RAM)</b>.</p></div>' +
         '</div>' +
         '<ul>' +
         '<li><b>ROM family (Non-volatile):</b> <b>MROM</b> (hardwired at factory), <b>PROM</b> (burnt once via fusible links), <b>EPROM</b> (erased entirely via quartz-window UV light for ~20 min), <b>EEPROM</b> (electrically erasable at the individual <b>byte level</b>), and <b>Flash memory</b> (electrically erasable at the <b>block/page level</b> — NOR flash allows byte-level execute-in-place for firmware; <b>NAND flash</b> provides high density for SSDs, USB thumb drives, and SD cards).</li>' +
         '<li><b>Secondary storage:</b> <b>HDDs</b> (magnetic platters spinning at 5400–15000 RPM; overwriting a sector destroys prior data immediately) vs <b>SSDs</b> (NAND flash managed by a Flash Translation Layer [FTL] with <b>wear-levelling</b> and <b>TRIM/garbage collection</b> — when an OS deletes a file and sends TRIM, the SSD controller proactively zeroes out unallocated blocks in the background, frustrating traditional file carving!).</li>' +
         '<li><b>Types of Operating Systems:</b>' +
         '<br>• <b>Batch OS:</b> jobs with similar needs grouped and run without user interaction.' +
         '<br>• <b>Multiprogrammed OS:</b> keeps multiple jobs in RAM simultaneously; when the running job waits for I/O, the CPU switches to another job so the CPU is never idle.' +
         '<br>• <b>Time-Sharing (Multitasking) OS:</b> logical extension of multiprogramming where CPU switches rapidly via short time quanta so interactive users feel they own the machine.' +
         '<br>• <b>Real-Time OS (RTOS):</b> defined by deterministic timing constraints. <b>Hard RTOS</b> (pacemaker, airbag, missile guidance) treats a single missed deadline as total system failure; <b>Soft RTOS</b> (live video streaming, VoIP) tolerates occasional late frames with degraded quality.' +
         '<br>• <b>Distributed OS vs Network OS:</b> a <b>Distributed OS</b> (LOCUS, Amoeba) presents multiple autonomous machines as a <em>single transparent system image</em> where users do not know which node runs their file/process; a <b>Network OS</b> (Windows Server, Novel NetWare) keeps each host visible as an independent machine that shares files/printers over explicit network paths.</li>' +
         '</ul>' +
         '<div class="vs-grid">' +
         '<div class="vs-card"><h4>Type 1 Hypervisor (Bare-Metal)</h4><p>Runs <b>directly on physical hardware</b> with no host OS underneath (e.g., <b>VMware ESXi, Microsoft Hyper-V, Citrix XenServer, KVM</b>). Minimal overhead, strongest isolation, enterprise/cloud standard.</p></div>' +
         '<div class="vs-card"><h4>Type 2 Hypervisor (Hosted)</h4><p>Runs as an <b>application on top of a conventional Host OS</b> (e.g., <b>Oracle VirtualBox, VMware Workstation, QEMU</b>). Ideal for forensic analysts sandbox-testing malware on a laptop.</p></div>' +
         '</div>' +
         '<div class="tip"><b>⚠️ Forensic Relevance of VMs:</b> Virtual machines store entire disks as files (<code>.vmdk</code>, <code>.vhdx</code>, <code>.vdi</code>) and suspended RAM states as snapshot files (<code>.vmem</code>, <code>.vmss</code>). An investigator can copy a <code>.vmem</code> file from the host and feed it straight into <b>Volatility</b> to get a bit-perfect memory dump of the guest OS without ever alerting malware running inside the guest!</div>'
    },
    {
      h: 'OS services, process concurrency and process generation',
      b: '<p><b>OS Services:</b> User-facing services include <em>user interfaces (CLI/GUI/Batch), program execution, I/O operations, file-system manipulation, inter-process communication (IPC), and error detection</em>. System-efficiency services include <em>resource allocation, accounting/auditing, and protection & security</em>.</p>' +
         '<p><b>Principles of Concurrency & The Critical-Section Problem:</b> When concurrent processes access shared data, the final outcome can depend on the exact interleaving order — a <b>race condition</b>. Any valid solution to the critical-section problem (such as <b>Peterson\'s solution</b> or hardware atomic instructions <code>TestAndSet</code> / <code>CompareAndSwap</code>) must satisfy three conditions:</p>' +
         '<ol>' +
         '<li><b>Mutual Exclusion:</b> at most one process can be executing inside its critical section at any instant.</li>' +
         '<li><b>Progress:</b> if no process is in its critical section and some processes wish to enter, only those processes <em>not in their remainder sections</em> can participate in deciding who enters next, and this decision cannot be postponed indefinitely (no deadlock when the lock is free).</li>' +
         '<li><b>Bounded Waiting:</b> there exists a strict upper bound on the number of times other processes are allowed to enter their critical sections after a process has made a request to enter and before that request is granted (no starvation).</li>' +
         '</ol>' +
         '<div class="clarity"><b>⚡ Concept Clarity — Mutex Lock vs Binary Semaphore vs Counting Semaphore:</b><br>' +
         '• <b>Mutex Lock:</b> has strict <b>ownership</b> — the exact thread that calls <code>acquire()</code> is the <em>only</em> thread permitted to call <code>release()</code>. Supports priority-inheritance to prevent priority inversion.<br>' +
         '• <b>Binary Semaphore (0 or 1):</b> has <b>no ownership</b> — Thread A can call <code>wait(S)</code> and Thread B can call <code>signal(S)</code>. Used for event signalling and producer-consumer ordering.<br>' +
         '• <b>Counting Semaphore:</b> integer initialised to $N$ (the number of identical resource instances available). Each <code>wait(S)</code> (or Dijkstra\'s <code>P(S)</code>) decrements $S$; each <code>signal(S)</code> (or <code>V(S)</code>) increments $S$. If $S < 0$, the magnitude $|S|$ equals the exact number of processes currently blocked on that semaphore!</div>' +
         '<p><b>Process Generation (`fork`, `exec`, Zombie vs Orphan):</b></p>' +
         '<ul>' +
         '<li>On Unix/Linux/macOS/Android, <code>fork()</code> duplicates the calling process. It is called once but <b>returns twice</b>: returning <b><code>0</code> in the child process</b> and the <b>positive PID of the child in the parent process</b> (or <code>-1</code> on failure). Modern kernels use <b>Copy-on-Write (CoW)</b> so parent and child share physical frames read-only until one modifies a page.</li>' +
         '<li><code>exec()</code> wipes the calling process\'s code/data/heap/stack and loads a new binary executable in its place while <b>keeping the same PID</b>.</li>' +
         '<li><b>Zombie process (<code>&lt;defunct&gt;</code>):</b> a child that has finished execution via <code>exit()</code>, releasing its memory, but whose entry remains in the process table because its parent has not yet called <code>wait()</code> to read its exit status.</li>' +
         '<li><b>Orphan process:</b> a running child whose parent terminated early; it is immediately adopted by <code>init</code> / <code>systemd</code> (PID 1), which periodically calls <code>wait()</code> to reap it cleanly.</li>' +
         '</ul>' +
         '<div class="example"><b>🔬 Worked Formula — Counting `fork()` Processes:</b><br>' +
         'If a program executes $n$ unconditional consecutive <code>fork();</code> statements:<br>' +
         '• <b>Total processes</b> in existence $= 2^n$<br>' +
         '• <b>Newly created child processes</b> $= 2^n - 1$<br>' +
         'For example, 3 unconditional <code>fork()</code> calls result in $2^3 = 8$ total processes ($8 - 1 = 7$ child processes). Read the question carefully to see whether it asks for <em>total processes</em> or <em>child processes</em>!</div>'
    },
    {
      h: 'Swapping and directory structures',
      b: '<p><b>Swapping vs Paging:</b> <b>Swapping</b> moves an <em>entire process image</em> between main memory and a backing store (swap partition/file) under the control of the medium-term scheduler to reduce the degree of multiprogramming. <b>Paging</b> moves individual fixed-size pages (typically 4 KB) on demand. Modern OSes blend the two as "page-level swapping".</p>' +
         '<p><b>Directory Structures (in order of increasing flexibility):</b></p>' +
         '<ul>' +
         '<li><b>Single-level directory:</b> all files for all users sit in one flat root directory; suffers naming collisions and no grouping.</li>' +
         '<li><b>Two-level directory:</b> Master File Directory (MFD) points to a separate User File Directory (UFD) per user; isolates names across users, but makes file sharing awkward.</li>' +
         '<li><b>Tree-structured directory:</b> arbitrary depth of subdirectories; every file has a unique absolute path and <b>exactly one parent directory</b>.</li>' +
         '<li><b>Acyclic-graph directory:</b> extends a tree by permitting shared files or subdirectories via <b>links</b>, so a file can have multiple paths while still forbidding directory cycles.</li>' +
         '<li><b>General graph directory:</b> permits arbitrary links including cycles; requires expensive garbage collection (since reference counts stays non-zero inside a cycle) and cycle-avoidance during directory tree walks.</li>' +
         '</ul>' +
         '<div class="vs-grid">' +
         '<div class="vs-card"><h4>Hard Link (<code>ln target link</code>)</h4><p>• Creates a second directory entry pointing directly to the <b>exact same Inode number</b> (or MFT record ID).<br>• Increments the inode\'s link counter.<br>• If the original filename is deleted, the file\'s data and inode remain completely intact until the <b>last hard link is removed</b> (link count = 0).<br>• Cannot span across different file systems/partitions and normally cannot link directories.</p></div>' +
         '<div class="vs-card"><h4>Symbolic / Soft Link (<code>ln -s target link</code>)</h4><p>• Creates a brand-new file with its <b>own distinct Inode number</b> whose data payload simply stores the text pathname of the target.<br>• Does NOT increment the target\'s link counter.<br>• If the original target file is deleted or moved, the symlink becomes a <b>dangling (broken) link</b>.<br>• Can span across different partitions, disks, and network mounts, and can link to directories.</p></div>' +
         '</div>' +
         '<div class="tip"><b>⚠️ Forensic Relevance:</b> On Linux/macOS, an attacker or suspect may "delete" an incriminating file with <code>rm</code>, thinking it is gone — or keep a hidden hard link to it under <code>/var/tmp/.cache</code>. Searching the volume by <b>inode number</b> (<code>find / -inum 48291</code>) immediately exposes all hard-linked aliases pointing to the same file data!</div>'
    },
    {
      h: 'Disk management: scheduling, partitioning and RAID',
      b: '<p>On a mechanical Hard Disk Drive (HDD), reading or writing a sector requires three time components:</p>' +
         '$$T_{\\text{access}} = T_{\\text{seek}} \\text{ (arm moves to cylinder)} + T_{\\text{rotational latency}} \\text{ (platter spins sector under head)} + T_{\\text{transfer}}$$' +
         '<p>Average rotational latency is the time for <b>half a revolution</b>: for a $7200\\text{ RPM}$ drive ($120\\text{ rev/sec}$, so $8.33\\text{ ms}$ per full rotation), average rotational latency $= 4.17\\text{ ms}$. Because <b>seek time</b> dominates, disk scheduling algorithms reorder pending cylinder requests to minimise total head movement.</p>' +
         '<table>' +
         '<tr><th>Algorithm</th><th>Head Movement Pattern</th><th>Pros & Cons</th></tr>' +
         '<tr><td><b>FCFS</b></td><td>Services cylinder requests strictly in arrival order</td><td>Fair, zero starvation; wild back-and-forth head swings.</td></tr>' +
         '<tr><td><b>SSTF</b> (Shortest Seek Time First)</td><td>Greedily picks the pending request closest to current head position</td><td>Low average seek time, but can <b>starve</b> requests near the inner/outer edges (analogous to SJF).</td></tr>' +
         '<tr><td><b>SCAN</b> (Elevator)</td><td>Sweeps in one direction to the <b>physical end of the disk</b> (cylinder 0 or max), then reverses</td><td>No starvation; slightly penalises cylinders just behind the reversing head.</td></tr>' +
         '<tr><td><b>C-SCAN</b> (Circular SCAN)</td><td>Services in one direction to the physical end, jumps to the opposite physical end, and sweeps again in the same direction</td><td>Provides the most uniform waiting time across all cylinders.</td></tr>' +
         '<tr><td><b>LOOK / C-LOOK</b></td><td>Identical to SCAN / C-SCAN except the arm reverses (or jumps) at the <b>furthest pending request</b> rather than travelling all the way to the physical boundary</td><td>Eliminates wasted travel to empty disk edges.</td></tr>' +
         '</table>' +
         '<div class="example"><b>🔬 Worked Numerical — Disk Head Movement Across All 6 Algorithms:</b><br>' +
         'Disk cylinders: <code>0 to 199</code>. Head starts at <b>50</b>, moving towards <b>199 (upward)</b>. Queue: <code>82, 170, 43, 140, 24, 16, 190</code>.<br>' +
         '• <b>FCFS:</b> $50 \\to 82 \\to 170 \\to 43 \\to 140 \\to 24 \\to 16 \\to 190 = 32 + 88 + 127 + 97 + 116 + 8 + 174 =$ <b>642 cylinders</b>.<br>' +
         '• <b>SSTF:</b> $50 \\to 43 \\to 24 \\to 16 \\to 82 \\to 140 \\to 170 \\to 190 = (50 - 16) + (190 - 16) = 34 + 174 =$ <b>208 cylinders</b>.<br>' +
         '• <b>SCAN (upward):</b> $50 \\to 82 \\to 140 \\to 170 \\to 190 \\to \\mathbf{199} \\text{ (physical end)} \\to 43 \\to 24 \\to 16 = (199 - 50) + (199 - 16) = 149 + 183 =$ <b>332 cylinders</b>.<br>' +
         '• <b>LOOK (upward):</b> stops at last request 190 instead of 199: $(190 - 50) + (190 - 16) = 140 + 174 =$ <b>314 cylinders</b>.<br>' +
         '• <b>C-SCAN (upward, counting jump):</b> $(199 - 50) + (199 - 0) + (43 - 0) = 149 + 199 + 43 =$ <b>391 cylinders</b>.<br>' +
         '• <b>C-LOOK (upward, counting jump):</b> $(190 - 50) + (190 - 16) + (43 - 16) = 140 + 174 + 27 =$ <b>341 cylinders</b>.</div>' +
         '<p><b>RAID Levels (Redundant Array of Independent Disks):</b></p>' +
         '<table>' +
         '<tr><th>RAID Level</th><th>Mechanism</th><th>Min Disks</th><th>Usable Capacity ($N$ disks)</th><th>Fault Tolerance</th></tr>' +
         '<tr><td><b>RAID 0</b></td><td>Block-level striping only (no parity/mirror)</td><td>2</td><td>$100\\%$ ($N$)</td><td><b>0 disks</b> (one disk fails $\\Rightarrow$ all data lost!)</td></tr>' +
         '<tr><td><b>RAID 1</b></td><td>Exact disk mirroring</td><td>2</td><td>$50\\%$ ($N/2$)</td><td>1 disk per mirror pair</td></tr>' +
         '<tr><td><b>RAID 5</b></td><td>Block-level striping with <b>distributed XOR parity</b></td><td>3</td><td>$(N - 1)$ disks</td><td><b>1 disk</b></td></tr>' +
         '<tr><td><b>RAID 6</b></td><td>Block-level striping with <b>double distributed parity</b></td><td>4</td><td>$(N - 2)$ disks</td><td><b>2 simultaneous disks</b></td></tr>' +
         '<tr><td><b>RAID 10 (1+0)</b></td><td>Stripe of mirrors (mirrored pairs striped together)</td><td>4 (even)</td><td>$50\\%$ ($N/2$)</td><td>At least 1 disk (up to 1 per mirror pair)</td></tr>' +
         '</table>' +
         '<div class="tip"><b>⚠️ Forensic RAID Reconstruction:</b> When seizing a multi-bay NAS or server running RAID 5, label every drive\'s bay number before imaging each disk individually via write-blockers. Because RAID 5 uses XOR parity ($A \\oplus B \\oplus C = P$), if one disk in a 4-disk RAID 5 array is physically dead, forensic software can still mathematically reconstruct 100% of the missing drive\'s sectors by XORing the remaining 3 drives!</div>'
    },
    {
      h: 'File concepts, attributes, operations and memory-mapped files',
      b: '<p><b>File Attributes (stored in directory entry / Inode / MFT record):</b> Name, Identifier (unique internal number: Inode # on Linux, MFT Entry # on NTFS), Type, Location (pointer to device and blocks), Size, Protection (rwx bits or ACLs), and <b>MACB Timestamps</b>:</p>' +
         '<ul>' +
         '<li><b>M — Modified (mtime):</b> when the file\'s actual data content was last written/changed.</li>' +
         '<li><b>A — Accessed (atime):</b> when the file was last opened/read (often throttled by <code>relatime</code> or disabled on modern OSes to save SSD writes).</li>' +
         '<li><b>C — Changed / MFT Modified (ctime):</b> on Unix/Linux and NTFS, when the file\'s <em>metadata</em> (permissions, owner, link count, filename) was last altered.</li>' +
         '<li><b>B — Birth / Created (btime / crtime):</b> when the file was created on that volume.</li>' +
         '</ul>' +
         '<div class="clarity"><b>⚡ Concept Clarity — Why Moving vs Copying a File Changes Timestamps Differently (Windows NTFS):</b><br>' +
         '• If a user <b>copies</b> a file formed in 2022 onto a USB drive in 2026, the new copy gets a <b>Created (Birth) time of 2026</b> while keeping its <b>Modified time of 2022</b> — leading to the famous forensic signature where <code>Created &gt; Modified</code>!<br>' +
         '• If a file is <b>moved within the same NTFS volume</b>, only its parent directory pointer updates, so both Created and Modified times stay unchanged.</div>' +
         '<p><b>Memory-Mapped Files (<code>mmap()</code> on POSIX / <code>CreateFileMapping()</code> + <code>MapViewOfFile()</code> on Windows):</b> Maps a disk file (or portion of it) directly into a process\'s virtual address space. After mapping, the process reads and writes the file using ordinary CPU memory pointers rather than calling <code>read()</code>/<code>write()</code> system calls on every access. Multiple processes can map the same file simultaneously for ultra-fast shared-memory IPC. Forensically, because memory-mapped file regions are backed by the virtual memory pager, pages modified in private mappings can be flushed to swap/pagefile.</div>'
    },
    {
      h: 'Layered architecture and kernel design',
      b: '<p>Operating systems vary in how they organise kernel privileges and internal subsystems:</p>' +
         '<div class="stack-diagram">' +
         '<div class="stack-layer"><b>Layer N: User Applications & Forensics Tools</b><span>Ring 3 (User Mode) — Unprivileged</span></div>' +
         '<div class="stack-layer"><b>Layer N−1: Shell / GUI / System Library Wrappers (libc, Win32 API, NTDLL)</b><span>Ring 3 — Issues syscall trap (int 0x80 / syscall)</span></div>' +
         '<div class="stack-layer"><b>Layer 2: File Systems, VFS, IPC & Network Stack</b><span>Ring 0 (Kernel Mode) — Monolithic/Hybrid</span></div>' +
         '<div class="stack-layer"><b>Layer 1: Process Scheduler, Virtual Memory Manager & Device Drivers</b><span>Ring 0 (Kernel Mode)</span></div>' +
         '<div class="stack-layer"><b>Layer 0: Physical Hardware (CPU, MMU, RAM, Disks, Buses)</b><span>Hardware / Firmware</span></div>' +
         '</div>' +
         '<p>In Dijkstra\'s strict <b>Layered Approach</b> (e.g., the <b>THE system</b>, 1968), Layer $k$ may invoke operations <b>only on Layer $k-1$ immediately below it</b>, and never upward. This makes debugging and verification modular, though choosing a strict ordering without circular dependencies is difficult and crossing many layers adds call overhead.</p>' +
         '<table>' +
         '<tr><th>Kernel Architecture</th><th>What Runs in Kernel Mode (Ring 0)</th><th>Examples & Forensic / Security Impact</th></tr>' +
         '<tr><td><b>Monolithic Kernel</b></td><td>Scheduler, VM, File Systems, Network Stack, and Device Drivers all share one kernel address space (with loadable modules <code>.ko</code>)</td><td><b>Linux, classic Unix</b>. Fast direct function calls; but a single buggy driver or kernel-mode rootkit (LKM) has full access to all kernel memory.</td></tr>' +
         '<tr><td><b>Microkernel</b></td><td>Only minimal IPC (message passing), basic thread scheduling, and low-level address space management; File systems & drivers run in <b>User Mode</b></td><td><b>QNX, Minix 3, Mach, seL4</b>. High reliability and fault isolation (a crashed driver restarts without kernel panic), but higher IPC context-switch overhead.</td></tr>' +
         '<tr><td><b>Hybrid Kernel</b></td><td>Looks like a microkernel architecturally, but keeps performance-critical subsystems and drivers in kernel space for speed</td><td><b>Windows NT (<code>ntoskrnl.exe</code>), macOS / iOS XNU</b> (combines Mach + BSD).</td></tr>' +
         '<tr><td><b>Mobile OS Stacks</b></td><td><b>Android:</b> Linux kernel + HAL + Android Runtime (ART) + Java/Kotlin API Framework.<br><b>iOS:</b> XNU (Mach+BSD) Darwin kernel + Core OS + Core Services + Media + Cocoa Touch.</td><td>Both enforce strict <b>per-app sandboxing</b> (Android assigns a unique Linux UID per app; iOS uses mandatory access control profiles & Secure Enclave hardware encryption).</td></tr>' +
         '</table>'
    },
    {
      h: 'File organization and access methods',
      b: '<p>A file\'s <b>organization</b> describes how records are structured on storage; its <b>access method</b> defines how programs locate and retrieve those records:</p>' +
         '<div class="vs-grid">' +
         '<div class="vs-card"><h4>1. Sequential Access</h4><p>Records are processed strictly in order from the beginning via an implicit <em>current position pointer</em> (<code>read_next</code> / <code>write_next</code> / <code>rewind</code>). Reaching record $N$ requires scanning past records $1 \\dots N-1$ ($O(N)$ time). Native to magnetic tape, audit log files, and streaming pipes.</p></div>' +
         '<div class="vs-card"><h4>2. Direct (Random / Relative) Access</h4><p>File is viewed as a numbered array of fixed-length logical blocks. Any block $k$ can be read or written directly in $O(1)$ time via <code>read(k)</code> / <code>seek(k * record_size)</code> without scanning prior records. Used by relational database data files and hash files.</p></div>' +
         '<div class="vs-card"><h4>3. Indexed Sequential Access (ISAM)</h4><p>Data records are stored sequentially sorted by primary key, and a compact <b>Index</b> (often kept in RAM) maps key ranges to disk block addresses. To find a key, binary-search the index ($O(\\log I)$) then scan a single data block — supporting <b>both fast single-record point lookups and fast ordered range scans</b>! Overflow records land in a chained overflow area.</p></div>' +
         '</div>'
    },
    {
      h: 'Comparative overview of file systems',
      b: '<p>Use this master reference table to answer cross-platform comparison questions across Units I, III, and V:</p>' +
         '<table>' +
         '<tr><th>Feature</th><th>FAT32</th><th>exFAT</th><th>NTFS</th><th>ext4</th><th>APFS</th></tr>' +
         '<tr><td><b>Primary OS</b></td><td>Cross-platform / Legacy Win</td><td>SDXC / Flash drives</td><td>Windows NT–11</td><td>Linux, Android (/data)</td><td>macOS, iOS, watchOS</td></tr>' +
         '<tr><td><b>Max File Size</b></td><td><b>4 GB − 1 B</b></td><td>16 EB (64-bit)</td><td>16 TB – 8 PB</td><td>16 TB</td><td>8 EB</td></tr>' +
         '<tr><td><b>Metadata Core</b></td><td>FAT1, FAT2 + Dir entries</td><td>Allocation Bitmap + Up-case</td><td><code>$MFT</code> (1 KB records)</td><td>Superblock + Inodes</td><td>Container Superblock + B-Trees</td></tr>' +
         '<tr><td><b>Journaling / Crash Safety</b></td><td>None</td><td>None (TexFAT optional)</td><td>Yes (<code>$LogFile</code>, <code>$UsnJrnl</code>)</td><td>Yes (<code>jbd2</code> journal)</td><td><b>Copy-on-Write (CoW)</b></td></tr>' +
         '<tr><td><b>Access Control</b></td><td>4 attribute bits (R, H, S, A)</td><td>4 attribute bits</td><td>Full NTFS ACLs (SIDs)</td><td>POSIX rwx + extended ACLs</td><td>POSIX + NFSv4 ACLs</td></tr>' +
         '<tr><td><b>Timestamp Resolution</b></td><td>mtime: 2 sec; ctime: 10 ms; atime: <b>1 day (date only!)</b></td><td>10 ms (with timezone offset)</td><td><b>100 nanoseconds</b> (8 timestamps: 4 in <code>$SI</code>, 4 in <code>$FN</code>)</td><td><b>1 nanosecond</b> (256-byte inodes include <code>crtime</code>)</td><td><b>1 nanosecond</b></td></tr>' +
         '<tr><td><b>Built-in Encryption</b></td><td>No</td><td>No</td><td>EFS (file) / BitLocker (vol)</td><td>fscrypt (file/dir) / LUKS</td><td>Multi-key FileVault / Data Protection</td></tr>' +
         '</table>' +
         '<div class="tip"><b>⚠️ Classic Forensic Exam Fact:</b> Notice FAT32\'s timestamp quirk: its Last Modified time only has <b>2-second resolution</b> (so odd seconds are rounded!), and its Last Accessed field stores <b>only the calendar date (no time of day)</b>. Meanwhile, NTFS stores two completely separate sets of 4 MACB timestamps per file: one in <code>$STANDARD_INFORMATION ($SI)</code> (which user-space timestomping tools easily forge) and one in <code>$FILE_NAME ($FN)</code> (which only the Windows kernel can modify)!</div>'
    }
  ],

  questions: [
    { q: 'The 32-bit value 0x0A0B0C0D is written to memory on a little-endian machine. What is the byte sequence, lowest address first?',
      o: ['0A 0B 0C 0D', '0D 0C 0B 0A', '0B 0A 0D 0C', '0C 0D 0A 0B'], a: 1,
      e: '<p>Little-endian stores the <b>least significant byte at the lowest address</b>. The least significant byte of 0x0A0B0C0D is 0x0D, so the order is 0D 0C 0B 0A — a straight reversal of the bytes.</p><p>Option (a) is the big-endian layout. Option (c) swaps within pairs only, a common distractor.</p>' },

    { q: 'The binary number 11011010 expressed in hexadecimal is',
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
      e: '<p><code>mmap()</code> maps a file\'s contents into the calling process\'s virtual address space; ordinary memory reads/writes then transparently trigger the OS\'s paging mechanism to fetch or flush data, avoiding explicit read()/write() calls and letting multiple processes share the mapping as a form of IPC.</p><p>It does not guarantee full residency — mapped pages are evicted and reloaded on demand just like any other page, which is why remnants of a memory-mapped document can end up in the pagefile/swap even though the user never explicitly saved it.</p>' },

    { q: 'In the classic layered approach to operating system design, a routine in layer N is permitted to:',
      o: ['Call routines in any layer, above or below',
          'Call only routines in layer N+1, the layer immediately above it',
          'Call only routines in layer N−1, the layer immediately below it',
          'Call routines only within its own layer'], a: 2,
      e: '<p>Each layer is built using only the operations exported by the layer <b>immediately below</b> it, and hides its own implementation from layers above. This strict, one-directional dependency is what let Dijkstra\'s THE system verify each layer using only the already-proven guarantees of the layer beneath it.</p><p>A layer never calls upward — that would break the whole point of the hierarchy, which is to bound how far a bug or a change can propagate.</p>' },

    { q: 'Which kernel design keeps only IPC, minimal scheduling and basic memory management running with kernel privilege, moving services such as device drivers and file systems into user-space servers?',
      o: ['Monolithic kernel', 'Microkernel', 'Layered kernel', 'Exokernel-only design'], a: 1,
      e: '<p>A <b>microkernel</b> (Minix, QNX) minimises what runs in kernel space; everything else runs as isolated user-space servers reached via IPC. This isolates faults — a crashed file-system server can often be restarted without taking the whole OS down — at the cost of extra message-passing overhead versus a direct in-kernel call.</p><p>A <b>monolithic kernel</b> (classic Linux) is the opposite: process management, memory management, drivers and file systems all share one kernel address space for speed.</p>' },

    { q: 'A process arrives at time 3, has a CPU burst of 6, and completes execution at time 15. Its waiting time is:',
      o: ['12', '9', '6', '3'], a: 2,
      e: '<p>Turnaround time = Completion − Arrival = 15 − 3 = 12. Waiting time = Turnaround time − Burst time = 12 − 6 = <b>6</b>.</p><p>A common slip is stopping at turnaround time (12) and forgetting to subtract the burst — waiting time only counts time spent in the ready queue, not time actually running on the CPU.</p>' },

    { q: 'Which scheduling criterion is measured from the time a process is submitted until it produces its FIRST output, rather than until it finishes entirely?',
      o: ['Turnaround time', 'Waiting time', 'Response time', 'Throughput'], a: 2,
      e: '<p><b>Response time</b> measures submission-to-first-response, not submission-to-completion. It is the criterion that matters for interactive, time-sharing systems, which is exactly why Round Robin — mediocre on average turnaround time — is the standard choice there: it is tuned to give quick response time to everyone.</p><p><b>Turnaround time</b>, by contrast, runs all the way to completion, which is what batch systems care about instead.</p>' },

    { q: 'Which file access method is most appropriate for data stored on magnetic tape, where reaching record n requires passing every record before it?',
      o: ['Direct access', 'Indexed sequential access', 'Sequential access', 'Memory-mapped access'], a: 2,
      e: '<p><b>Sequential access</b> reads/writes records strictly in order via a "read next"/"write next" pointer, matching the physical constraint of tape (no way to jump straight to an arbitrary point without winding through everything before it).</p><p><b>Direct access</b> requires a device that can address any block in roughly equal time — a property tape does not have but disk does.</p>' },

    { q: 'Indexed sequential access (ISAM) combines which two properties?',
      o: ['Fixed block size with variable record length',
          'Fast direct lookup via an index, together with efficient ordered/range scans via the underlying sequential order',
          'Encryption of records with compression of the index',
          'Random block allocation with contiguous free-space tracking'], a: 1,
      e: '<p><b>ISAM</b> keeps the base file sorted by key and layers an index on top mapping keys/ranges to block addresses. A lookup can jump near the target via the index (fast, close to direct access) or scan the file in key order for a range query (retaining the benefit of sequential organization) — the best of both single methods.</p><p>New records that don\'t fit in place typically land in an <b>overflow area</b>, chained until the file is next reorganized.</p>' },

    { q: 'Which file system uses a copy-on-write metadata scheme (rather than a traditional write-ahead journal) to maintain crash consistency, and natively supports space-efficient snapshots?',
      o: ['FAT32', 'exFAT', 'APFS', 'ext4'], a: 2,
      e: '<p><b>APFS</b> (Apple File System) uses copy-on-write for its metadata structures — updates are written to new blocks rather than overwritten in place, so a crash mid-update simply leaves the old, still-consistent version intact — and this same COW foundation is what makes cheap, instantaneous snapshots possible.</p><p><b>ext4</b> instead relies on a conventional journal; FAT32 and exFAT have no crash-consistency mechanism of either kind, which is why they need a full CHKDSK/scandisk pass after an unclean removal.</p>' },

    { q: 'Which pair of file systems has NO journaling and NO built-in permissions model, relying only on simple attribute bits (read-only, hidden, system, archive)?',
      o: ['NTFS and ext4', 'FAT32 and exFAT', 'APFS and HFS+', 'ext4 and HFS+'], a: 1,
      e: '<p><b>FAT32</b> and <b>exFAT</b> are both from the FAT family: no journal, and no POSIX/ACL-style permissions — only legacy attribute bits. That simplicity is exactly why they remain the lowest-common-denominator choice for USB drives, SD cards and camera media that must be readable across Windows, macOS and embedded devices alike.</p><p><b>NTFS</b> and <b>ext4</b> both journal and both express real permissions (ACLs and POSIX bits respectively); HFS+ also journals.</p>' },

    { q: 'What is the 8-bit 2\'s complement binary and hexadecimal representation of the signed decimal integer −45?',
      o: ['11010011 (0xD3)', '10101101 (0xAD)', '11010010 (0xD2)', '00101101 (0x2D)'], a: 0,
      e: '<p>First express $+45$ in 8-bit binary: $45 = 32 + 8 + 4 + 1 = \\texttt{00101101}$ (which is <code>0x2D</code>). Next, invert every bit to get the 1\'s complement: <code>11010010</code> (<code>0xD2</code>). Finally, add 1 to the least significant bit: <code>11010010 + 1 = 11010011</code>, which in hex is <b><code>0xD3</code></b>.</p><p>Option (b) <code>10101101</code> is the sign-magnitude representation; option (c) <code>11010010</code> stops at 1\'s complement without adding 1.</p>' },

    { q: 'A forensic analyst inspects a TCP packet header captured on the wire and sees a 16-bit destination port field containing the bytes 01 BB (in order of arrival). Given that TCP/IP uses network byte order, what is the decimal port number?',
      o: ['443', '47873', '177', '8080'], a: 0,
      e: '<p>Network byte order is <b>Big-Endian</b> (most significant byte first). Therefore, the bytes <code>01 BB</code> are read directly without reversing as <code>0x01BB</code>. In decimal: $(1 \\times 256) + (11 \\times 16) + 11 = 256 + 176 + 11 =$ <b>443</b> (HTTPS).</p><p>If you mistakenly treated network headers as little-endian and swapped them to <code>0xBB01</code>, you would get 47,873 — a classic trap when moving between disk forensics (mostly little-endian) and network forensics (big-endian).</p>' },

    { q: 'Convert the binary number 10111101.101 into its octal and hexadecimal equivalents:',
      o: ['Octal 275.5 and Hex 0xBD.A', 'Octal 571.1 and Hex 0xDB.5', 'Octal 275.1 and Hex 0xBD.5', 'Octal 135.5 and Hex 0xBC.A'], a: 0,
      e: '<p>Always group away from the radix point! For <b>octal</b> (groups of 3): integer part <code>010 111 101</code> $= 2\\;7\\;5$; fractional part (pad on the right with zeros!) <code>.101</code> $= 5 \\Rightarrow$ <b>275.5₈</b>.</p><p>For <b>hexadecimal</b> (groups of 4): integer part <code>1011 1101</code> $= \\text{B}\\;\\text{D}$; fractional part (padded on the right to 4 bits!) <code>.1010</code> $= 10 = \\text{A} \\Rightarrow$ <b>0xBD.A</b>. Failing to right-pad the fractional nibble gives <code>.5</code> (option c), the classic trap.</p>' },

    { q: 'A computer has a 32-bit physical address space and a 128 KB, 4-way set-associative cache with a 64-byte block (line) size. How many bits are in the Tag, Set Index, and Byte Offset fields respectively?',
      o: ['Tag = 17 bits, Set = 9 bits, Offset = 6 bits',
          'Tag = 15 bits, Set = 11 bits, Offset = 6 bits',
          'Tag = 18 bits, Set = 8 bits, Offset = 6 bits',
          'Tag = 16 bits, Set = 10 bits, Offset = 6 bits'], a: 0,
      e: '<p>1. Block size $= 64\\text{ B} = 2^6 \\Rightarrow$ <b>Offset = 6 bits</b>.<br>2. Total cache lines $= 128\\text{ KB} / 64\\text{ B} = 2^{17} / 2^6 = 2^{11} = 2048$ lines.<br>3. Because the cache is 4-way set-associative ($2^2$ lines per set), number of sets $= 2^{11} / 2^2 = 2^9 = 512$ sets $\\Rightarrow$ <b>Set Index = 9 bits</b>.<br>4. <b>Tag</b> $= 32 - 9 - 6 =$ <b>17 bits</b>. (Option b forgets to divide by 4 ways and gives the direct-mapped split.)</p>' },

    { q: 'When a context switch occurs between two threads belonging to the SAME process, which of the following does NOT need to be saved or switched by the OS?',
      o: ['The Program Counter (PC)',
          'The CPU general-purpose registers',
          'The Stack Pointer (SP)',
          'The virtual memory Page Table / TLB address space'], a: 3,
      e: '<p>Threads within the same process share the <b>same virtual address space, page table, global variables, heap, and open file descriptors</b>, so the MMU page-table base register and TLB entries remain valid across a same-process thread switch.</p><p>However, each thread executes independently with its own call chain and local variables, so each thread has its own private <b>Program Counter, CPU registers, and Stack</b>, which must be saved and restored on every thread switch.</p>' },

    { q: 'A C program on Linux executes the following code with no errors:\nfork();\nfork();\nfork();\nHow many NEW child processes are created in total?',
      o: ['3', '7', '8', '6'], a: 1,
      e: '<p>With $n = 3$ unconditional <code>fork()</code> calls, total processes in existence $= 2^3 = 8$. Subtracting the 1 original parent process gives $2^3 - 1 =$ <b>7 newly created child processes</b>.</p><p>Always check whether the question asks for <em>total processes</em> ($2^n = 8$) or <em>new child processes</em> ($2^n - 1 = 7$).</p>' },

    { q: 'On a Linux server under forensic investigation, `ps aux` shows a process marked `<defunct>` with state `Z`. What does this indicate?',
      o: ['A process whose parent has terminated and which has been adopted by systemd (PID 1)',
          'A zombie process that has completed execution via exit(), but whose parent has not yet called wait() to read its exit status',
          'A process swapped completely out to disk by the medium-term scheduler',
          'A kernel thread locked in an uninterruptible disk I/O sleep'], a: 1,
      e: '<p>State <code>Z</code> (<code>&lt;defunct&gt;</code>) is a <b>zombie process</b>: the child has already terminated and released its user memory, but its PCB/process-table slot must remain so the parent can retrieve its exit code via <code>wait()</code>/<code>waitpid()</code>. Notably, you cannot kill a zombie with <code>kill -9</code> because it is already dead — you must signal or terminate its parent!</p><p>Option (a) describes an <b>orphan process</b>; option (d) describes state <code>D</code> (uninterruptible sleep).</p>' },

    { q: 'A counting semaphore S is initialized to 10. Subsequently, 6 wait(S) (P) operations and 4 signal(S) (V) operations are completed on S. What is the current value of S?',
      o: ['8', '12', '2', '0'], a: 0,
      e: '<p>Each <code>wait(S)</code> decrements the semaphore by 1, and each <code>signal(S)</code> increments it by 1. Therefore: $S_{\\text{final}} = 10 - 6 + 4 =$ <b>8</b>.</p><p>If a counting semaphore initialized to 3 had 8 <code>wait()</code> calls and 2 <code>signal()</code> calls, its value would be $3 - 8 + 2 = -3$, meaning <b>3 processes are currently blocked</b> in its wait queue.</p>' },

    { q: 'Three processes arrive at time 0 with burst times P1 = 24 ms, P2 = 3 ms, P3 = 3 ms. If they arrive in the order P1, P2, P3, what is the average waiting time under FCFS compared with SJF?',
      o: ['FCFS = 17 ms; SJF = 3 ms',
          'FCFS = 27 ms; SJF = 13 ms',
          'FCFS = 10 ms; SJF = 3 ms',
          'FCFS = 17 ms; SJF = 6 ms'], a: 0,
      e: '<p>Under <b>FCFS</b> (<code>P1 [0–24], P2 [24–27], P3 [27–30]</code>): waiting times are $P_1 = 0$, $P_2 = 24$, $P_3 = 27$. Average WT $= (0 + 24 + 27) / 3 = 51 / 3 =$ <b>17 ms</b> (a textbook demonstration of the <b>convoy effect</b>).</p><p>Under <b>SJF</b> (<code>P2 [0–3], P3 [3–6], P1 [6–30]</code>): waiting times are $P_2 = 0$, $P_3 = 3$, $P_1 = 6$. Average WT $= (0 + 3 + 6) / 3 = 9 / 3 =$ <b>3 ms</b>.</p>' },

    { q: 'In a system with 5 processes, each process requires at most 3 instances of resource R. What is the MINIMUM number of instances of R required to guarantee that deadlock can NEVER occur?',
      o: ['11', '15', '10', '12'], a: 0,
      e: '<p>In the worst-case deadlock scenario, each of the $P$ processes holds $(\\text{Max}_i - 1)$ resources and is waiting for 1 more. Adding just <b>1 extra instance</b> lets at least one process finish and release all its resources. Formula: $$R_{\\min} = \\sum_{i=1}^{P} (\\text{Max}_i - 1) + 1 = P(K - 1) + 1$$ Here, $5 \\times (3 - 1) + 1 = 10 + 1 =$ <b>11 instances</b>.</p>' },

    { q: 'Which of the following statements about safe, unsafe, and deadlocked states in deadlock avoidance is TRUE?',
      o: ['Every unsafe state is immediately a deadlocked state',
          'A system in a safe state can still deadlock if processes request their maximum declared resources',
          'Every deadlocked state is an unsafe state, but not every unsafe state leads to a deadlock',
          'Safe and unsafe states are defined only for single-instance resources'], a: 2,
      e: '<p>Deadlock is a strict subset of unsafe states: <b>Deadlocked $\\subset$ Unsafe</b>. Being in an <em>unsafe state</em> means no safe sequence can be guaranteed if every process demands its maximum claim; however, if processes voluntarily release resources early without requesting their full maximums, execution can still complete without deadlocking.</p>' },

    { q: 'A virtual memory system has a 36-bit virtual address space, 64 MB of physical RAM, and a 4 KB page size. How many bits are used for the Virtual Page Number (VPN), the Physical Frame Number (PFN), and the Page Offset respectively?',
      o: ['VPN = 24 bits, PFN = 14 bits, Offset = 12 bits',
          'VPN = 24 bits, PFN = 26 bits, Offset = 12 bits',
          'VPN = 20 bits, PFN = 14 bits, Offset = 16 bits',
          'VPN = 26 bits, PFN = 16 bits, Offset = 10 bits'], a: 0,
      e: '<p>1. Page size $= 4\\text{ KB} = 2^{12}$ bytes $\\Rightarrow$ <b>Page Offset = 12 bits</b> (identical in virtual and physical addresses).<br>2. Virtual address $= 36$ bits $\\Rightarrow$ <b>VPN</b> $= 36 - 12 =$ <b>24 bits</b>.<br>3. Physical RAM $= 64\\text{ MB} = 2^{26}$ bytes $\\Rightarrow$ physical address is 26 bits $\\Rightarrow$ <b>PFN</b> $= 26 - 12 =$ <b>14 bits</b> ($2^{14} = 16,384$ physical frames).</p>' },

    { q: 'In a paged system using a Segment Table where segment 2 has Base = 4000 and Limit = 500, what physical address corresponds to the logical address (Segment 2, Offset 600)?',
      o: ['4600', '3400', '600', 'A segmentation fault / addressing trap to the OS occurs'], a: 3,
      e: '<p>For every segmented address $(s, d)$, hardware first checks whether $d < \\text{Limit}[s]$. Here, offset $600 \\ge \\text{Limit } (500)$, which violates the segment boundary! Hardware immediately raises a <b>segmentation fault (addressing trap)</b> instead of computing $4000 + 600 = 4600$. Watch out for out-of-bounds offsets in numerical questions!</p>' },

    { q: 'A system has a TLB hit ratio of 80%, TLB lookup time of 10 ns, and main memory access time of 100 ns. Assuming a single-level page table in main memory and no page faults, what is the Effective Memory Access Time (EAT)?',
      o: ['130 ns', '110 ns', '128 ns', '210 ns'], a: 0,
      e: '<p>On a <b>TLB hit</b> (80%), we spend $T_{\\text{TLB}} + T_{\\text{MEM}} = 10 + 100 = 110\\text{ ns}$.<br>On a <b>TLB miss</b> (20%), we spend $T_{\\text{TLB}} + T_{\\text{MEM (page table)}} + T_{\\text{MEM (data)}} = 10 + 100 + 100 = 210\\text{ ns}$.<br>Therefore: $\\text{EAT} = 0.80 \\times 110 + 0.20 \\times 210 = 88 + 42 =$ <b>130 ns</b>.</p>' },

    { q: 'Consider the page reference string: 7, 0, 1, 2, 0, 3, 0, 4 with 3 initially empty page frames. How many page faults occur under the LRU (Least Recently Used) replacement algorithm?',
      o: ['6', '5', '7', '8'], a: 0,
      e: '<p>Trace step by step:<br>• <code>7</code> → [7] (Fault 1)<br>• <code>0</code> → [7, 0] (Fault 2)<br>• <code>1</code> → [7, 0, 1] (Fault 3)<br>• <code>2</code> → replaces LRU page 7 → [2, 0, 1] (Fault 4)<br>• <code>0</code> → Hit! (now 0 is most recent)<br>• <code>3</code> → between 2, 0, 1, page 1 was used least recently → replaces 1 → [2, 0, 3] (Fault 5)<br>• <code>0</code> → Hit!<br>• <code>4</code> → between 2, 0, 3, page 2 is LRU → replaces 2 → [4, 0, 3] (Fault 6).<br>Total = <b>6 page faults</b>.</p>' },

    { q: 'A Linux ext4 inode has 12 direct block pointers, 1 single-indirect, 1 double-indirect, and 1 triple-indirect pointer. If the disk block size is 4 KB and each block pointer is 4 bytes, what is the maximum file size addressable using ONLY the 12 direct and 1 single-indirect pointers?',
      o: ['4 MB + 48 KB (1,036 blocks)',
          '4 GB + 48 KB',
          '16 MB + 48 KB',
          '48 KB'], a: 0,
      e: '<p>1. Number of pointers that fit in one 4 KB indirect block $= 4096\\text{ B} / 4\\text{ B} = 1024$ pointers.<br>2. Total blocks via direct + single-indirect $= 12 + 1024 = 1036$ blocks.<br>3. Maximum size $= (12 \\times 4\\text{ KB}) + (1024 \\times 4\\text{ KB}) =$ <b>48 KB + 4 MB</b>.</p>' },

    { q: 'A forensic investigator creates a hard link `backup.log` and a symbolic link `shortcut.log` both pointing to `/var/log/auth.log` (inode 9912). If `/var/log/auth.log` is then deleted via `rm /var/log/auth.log`, what happens?',
      o: ['Both `backup.log` and `shortcut.log` become broken links and the data is unallocated',
          '`backup.log` still accesses the full file contents at inode 9912, whereas `shortcut.log` becomes a dangling (broken) link',
          '`shortcut.log` still accesses the file contents, whereas `backup.log` breaks',
          'The OS refuses to delete `/var/log/auth.log` while any link exists'], a: 1,
      e: '<p>A <b>hard link</b> (`backup.log`) points directly to <b>inode 9912</b> and raises its link count to 2. Removing `/var/log/auth.log` merely removes one directory name and decrements the link count to 1 — since the link count is $> 0$, the inode and data blocks remain completely allocated and readable via `backup.log`!</p><p>By contrast, the <b>symbolic link</b> (`shortcut.log`) stores the path string `"/var/log/auth.log"`, which no longer exists, turning it into a dangling link.</p>' },

    { q: 'A disk has 200 cylinders (0 to 199). The disk head is currently at cylinder 53, and the queue of pending requests is: 98, 183, 37, 122, 14, 124, 65, 67. What is the total head movement (in cylinders) under the SSTF (Shortest Seek Time First) algorithm?',
      o: ['236 cylinders', '640 cylinders', '208 cylinders', '331 cylinders'], a: 0,
      e: '<p>Starting at <b>53</b>, SSTF always moves to the closest pending cylinder:<br>• $53 \\to 65$ (dist 12) $\\to 67$ (dist 2) $\\to 37$ (dist 30) $\\to 14$ (dist 23) $\\to 98$ (dist 84) $\\to 122$ (dist 24) $\\to 124$ (dist 2) $\\to 183$ (dist 59).<br>Total movement $= (67 - 53) + (67 - 14) + (183 - 14) = 14 + 53 + 169 =$ <b>236 cylinders</b>. (640 is the FCFS total for this classic Silberschatz textbook queue!)</p>' },

    { q: 'A server uses 6 identical 2 TB hard drives configured in a RAID 6 array. What is the total usable storage capacity, and how many simultaneous drive failures can the array survive without losing data?',
      o: ['8 TB usable; survives up to 2 simultaneous drive failures',
          '10 TB usable; survives up to 1 drive failure',
          '6 TB usable; survives up to 3 simultaneous drive failures',
          '12 TB usable; survives 0 drive failures'], a: 0,
      e: '<p><b>RAID 6</b> stripes data with <b>two independent distributed parity blocks</b> ($P$ and $Q$) across all $N$ drives. Usable capacity $= (N - 2) \\times \\text{Drive Size} = (6 - 2) \\times 2\\text{ TB} =$ <b>8 TB</b>, and it survives any <b>2 simultaneous disk failures</b>.</p><p>Option (b) 10 TB / 1 failure is RAID 5; option (c) 6 TB is RAID 10; option (d) 12 TB / 0 failures is RAID 0.</p>' },

    { q: 'On an NTFS volume with a 4 KB (4,096-byte) cluster size and 512-byte sectors, a suspect saves a 900-byte text file that is stored non-residently in one cluster. How much total Slack Space is created, and how is it divided between RAM Slack and File (Drive) Slack?',
      o: ['Total slack = 3,196 bytes (124 bytes RAM slack + 3,072 bytes Drive slack)',
          'Total slack = 4,096 bytes (all Drive slack)',
          'Total slack = 124 bytes (all RAM slack)',
          'Total slack = 3,196 bytes (512 bytes RAM slack + 2,684 bytes Drive slack)'], a: 0,
      e: '<p>1. <b>Total Slack</b> $= \\text{Cluster Size} - \\text{File Size} = 4096 - 900 =$ <b>3,196 bytes</b>.<br>2. The 900-byte file spans the first two 512-byte sectors ($2 \\times 512 = 1024$ bytes). The unused tail of the second sector is <b>RAM Slack</b> $= 1024 - 900 =$ <b>124 bytes</b> (zero-padded by modern OSes).<br>3. The remaining 6 whole sectors in the 8-sector cluster are untouched <b>Drive / File Slack</b> $= 6 \\times 512 =$ <b>3,072 bytes</b>, which still hold raw remnants of whatever deleted file previously occupied that cluster!</p>' },

    { q: 'Why does a very small file (e.g., a 250-byte batch script) created on an NTFS volume typically produce ZERO cluster slack space?',
      o: ['Because NTFS automatically compresses all files under 1 KB to 0 bytes',
          'Because NTFS stores files smaller than ~700 bytes directly inside their 1,024-byte MFT record as a "resident" $DATA attribute without allocating any external cluster',
          'Because NTFS uses 1-byte clusters for small text files',
          'Because Windows stores files under 1 KB exclusively in the Registry'], a: 1,
      e: '<p>Every file on NTFS has a <b>1,024-byte (1 KB) record</b> in the Master File Table (<code>$MFT</code>). If the file\'s payload fits inside the space remaining after the record header and metadata attributes (typically up to ~700 bytes), NTFS marks the <code>$DATA</code> attribute as <b>resident</b> and stores the file bytes right inside the MFT record itself — no external data cluster is allocated, so no cluster slack is formed.</p>' },

    { q: 'During a timeline investigation of a Windows NTFS workstation, a file shows a Created (Birth) timestamp of 14 Nov 2026 10:00 AM, while its Last Modified timestamp is 03 May 2024 04:15 PM (Created > Modified). What normal user action explains this without any timestamp tampering?',
      o: ['The file was originally modified in 2024 and was COPIED to this NTFS volume on 14 Nov 2026',
          'The file was MOVED between two folders on the same NTFS volume on 14 Nov 2026',
          'The file was opened read-only in Notepad on 14 Nov 2026',
          'The system CMOS battery failed'], a: 0,
      e: '<p>When a file is <b>copied</b> on Windows, Windows creates a brand-new file object at the destination (setting the <code>$STANDARD_INFORMATION</code> <b>Created</b> timestamp to the time of the copy, Nov 2026) while preserving the original content\'s <b>Last Modified</b> timestamp (May 2024). Thus <code>Created &gt; Modified</code> is the textbook forensic indicator of a <b>copied (or downloaded/extracted) file</b>!</p><p>By contrast, <b>moving</b> a file within the same NTFS volume preserves both Created and Modified timestamps.</p>' },

    { q: 'Which file system stores ONLY the calendar date (with NO time-of-day hours, minutes, or seconds) for its Last Accessed timestamp, and rounds Last Modified times to 2-second intervals?',
      o: ['NTFS', 'ext4', 'FAT32', 'APFS'], a: 2,
      e: '<p>In a 32-byte <b>FAT32</b> directory entry, only 16 bits (2 bytes) are allocated to the Last Accessed field — enough for Year (7 bits), Month (4 bits), and Day (5 bits), with <b>no bits left for time of day</b>! Similarly, the 16-bit Last Modified time field uses 5 bits for hours, 6 bits for minutes, and only <b>5 bits for seconds</b> ($2^5 = 32$ values), forcing a <b>2-second granularity</b>.</p>' },

    { q: 'In Android\'s operating system architecture, how is application isolation (sandboxing) enforced at the OS level?',
      o: ['Every app runs inside a separate Type 1 Hyper-V virtual machine',
          'The underlying Linux kernel assigns each installed Android app a distinct Linux User ID (UID) and runs it in its own isolated process and `/data/data/<package>` directory',
          'Android relies purely on cooperative Java bytecode verification with no kernel separation',
          'All apps share a single root process and rely on FAT32 attribute bits'], a: 1,
      e: '<p>Android is built on top of the <b>Linux kernel</b> and repurposes standard Linux discretionary and mandatory access controls (DAC + SELinux) for app isolation: each installed application is assigned a <b>unique Linux UID</b> (e.g., <code>u0_a142</code>) at install time, ensuring one app cannot read another app\'s private SQLite databases in <code>/data/data/&lt;package_name&gt;</code> unless the device is rooted.</p>' },

    { q: 'Consider 4 processes arriving at time 0 with burst times P1 = 5 ms, P2 = 4 ms, P3 = 2 ms, P4 = 1 ms. Under Round Robin scheduling with a time quantum of q = 2 ms, what is the completion time of P1?',
      o: ['12 ms', '11 ms', '5 ms', '9 ms'], a: 0,
      e: '<p>Trace the Round Robin execution timeline ($q = 2\\text{ ms}$):<br>• <code>0–2</code>: P1 runs (remaining = 3)<br>• <code>2–4</code>: P2 runs (remaining = 2)<br>• <code>4–6</code>: P3 runs and finishes! (remaining = 0)<br>• <code>6–7</code>: P4 needs only 1 ms and finishes! (remaining = 0)<br>• <code>7–9</code>: P1 runs (remaining = 1)<br>• <code>9–11</code>: P2 runs and finishes! (remaining = 0)<br>• <code>11–12</code>: P1 runs its final 1 ms and finishes at <b>12 ms</b>.</p>' },

    { q: 'Which scheduler is responsible for controlling the "degree of multiprogramming" (the total number of processes resident in main memory) by admitting new jobs from the job pool or swapping processes out and in?',
      o: ['Long-term scheduler (and Medium-term swapper)',
          'Short-term (CPU) dispatcher only',
          'Disk arm scheduler',
          'TLB hardware walker'], a: 0,
      e: '<p>The <b>Long-Term (Job) Scheduler</b> selects jobs from disk to load into memory (`New → Ready`), directly increasing the degree of multiprogramming, while the <b>Medium-Term Scheduler</b> swaps processes out to backing store (`Ready/Blocked → Suspended`) to reduce the degree of multiprogramming when memory is overcommitted. The <b>Short-Term Scheduler</b> merely picks which already-resident `Ready` process gets the CPU next.</p>' },

    { q: 'In Peterson\'s two-process solution to the critical-section problem, what are the two shared variables used to coordinate entry between Process Pi and Process Pj?',
      o: ['`boolean flag[2]` (indicating readiness to enter) and `int turn` (breaking ties in favour of the other process)',
          '`int mutex` and `int count`',
          '`pid_t fork_id` and `int status`',
          '`int base` and `int limit`'], a: 0,
      e: '<p>Peterson\'s software algorithm uses <code>boolean flag[2]</code> (where <code>flag[i] = true</code> states that $P_i$ wants to enter its critical section) and <code>int turn</code> (where $P_i$ politely sets <code>turn = j</code> so if both try to enter simultaneously, the tie is broken deterministically). This satisfies Mutual Exclusion, Progress, and Bounded Waiting.</p>' },

    { q: 'A demand-paged virtual memory system has a main memory access time of 100 ns and a page-fault service time of 8 ms (8,000,000 ns). If the page-fault rate p is 1 in 10,000 accesses (p = 0.0001), what is the Effective Access Time (EAT)?',
      o: ['900 ns (a 9× slowdown compared with 100 ns)',
          '100.8 ns',
          '8,100 ns',
          '180 ns'], a: 0,
      e: '<p>Using the demand-paging EAT formula: $$\\text{EAT} = (1 - p) \\times T_{\\text{mem}} + p \\times S = (0.9999 \\times 100\\text{ ns}) + (0.0001 \\times 8,000,000\\text{ ns}) \\approx 100 + 800 = \\mathbf{900\\text{ ns}}$$ Notice how even a tiny $0.01\\%$ page-fault rate degrades memory performance by $9\\times$ — illustrating why avoiding thrashing is critical!</p>' },

    { q: 'When a child process is created via `fork()` on a modern Linux or macOS kernel, how does "Copy-on-Write" (CoW) optimise memory usage?',
      o: ['Parent and child initially share the exact same physical memory frames marked read-only; a physical frame is duplicated only when either process attempts to write to (modify) that page',
          'The entire physical RAM of the parent is copied byte-by-byte before `fork()` returns',
          'The child process is written directly to the swap partition without using RAM',
          'Copy-on-Write deletes the parent process as soon as the child starts'], a: 0,
      e: '<p>Because most `fork()` calls are immediately followed by `exec()` (which replaces the address space anyway), duplicating all of the parent\'s pages upfront would be wasteful. <b>Copy-on-Write (CoW)</b> lets parent and child share the same physical frames marked read-only in their page tables; if either writes to a shared page, a page-protection trap triggers the kernel to allocate a new frame and copy just that single 4 KB page!</p>' }
  ]
});
