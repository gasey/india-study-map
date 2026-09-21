// ============================================
// INTERVIEW PREP — CONCEPT LIBRARY
//
// Detailed explanations for the Technical Paper I & II syllabus, weighted
// toward the units flagged as weak spots (networking, Windows Server,
// governance vocabulary) rather than spread evenly. Each concept carries:
//   short   — one-line definition, for fast recall
//   explain — the actual understanding, 2-4 points
//   example — something concrete, where an example helps
//   exam    — the MCQ angle or the trap people fall into
//
// GIS is included as its own unit even though it is not a named syllabus
// heading: it is the candidate's own domain and the strongest bridge to
// MUDAL's work (see the Correlation brief).
// ============================================

export interface Concept {
  id: string;
  term: string;
  unit: string;
  short: string;
  explain: string[];
  example?: string;
  exam?: string;
}

export const conceptUnits: string[] = [
  'Computer Fundamentals & OS',
  'Networking',
  'Windows Server & Directory Services',
  'DBMS',
  'Web Technologies',
  'Cyber Security',
  'IT Governance & Service Management',
  'AI, Cloud & Emerging Tech',
  'GIS & Spatial Data',
];

export const concepts: Concept[] = [
  // ==================================================================
  // COMPUTER FUNDAMENTALS & OS
  // ==================================================================
  {
    id: 'c-memory-hierarchy',
    term: 'Memory hierarchy (registers → cache → RAM → storage)',
    unit: 'Computer Fundamentals & OS',
    short: 'Faster memory is smaller and costlier per byte, so computers layer it.',
    explain: [
      'Registers sit inside the CPU and are the fastest but measured in bytes. Cache (L1/L2/L3) is next — small, very fast, holds recently used data. RAM is the main working memory, volatile. Secondary storage (SSD/HDD) is slow but large and non-volatile.',
      'The whole design exists because fast memory is expensive. The system keeps what you are actively using near the CPU and pushes the rest outward.',
      'Volatile means contents are lost on power-off (registers, cache, RAM). Non-volatile means retained (SSD, HDD, ROM).',
    ],
    exam: 'Order questions are common: fastest→slowest is register, cache, RAM, SSD, HDD, tape. Cost per byte runs in the same direction; capacity runs opposite.',
  },
  {
    id: 'c-ram-rom',
    term: 'RAM vs ROM',
    unit: 'Computer Fundamentals & OS',
    short: 'RAM is volatile read/write working memory; ROM is non-volatile and holds firmware.',
    explain: [
      'RAM (Random Access Memory) holds the programs and data currently in use. Cut the power and it is gone. Two main types: DRAM (needs constant refresh, used as main memory) and SRAM (faster, no refresh, used as cache).',
      'ROM (Read-Only Memory) retains contents without power and holds boot firmware. Variants: PROM (write once), EPROM (erasable with UV light), EEPROM (electrically erasable — this is what modern flash and BIOS chips descend from).',
    ],
    exam: '"Which is volatile?" is the standard question. Also know that DRAM needs refreshing and SRAM does not — that is the usual distinguishing detail.',
  },
  {
    id: 'c-boot',
    term: 'Boot process, BIOS and UEFI',
    unit: 'Computer Fundamentals & OS',
    short: 'Firmware tests the hardware, finds a boot device, and hands control to the OS kernel.',
    explain: [
      'Sequence: power on → POST (Power-On Self Test) checks hardware → firmware (BIOS or UEFI) locates the boot device → the bootloader loads → the OS kernel initialises → user session starts.',
      'BIOS is the legacy firmware: 16-bit, uses the MBR partition scheme, limited to 2 TB boot disks.',
      'UEFI is the modern replacement: faster, supports GPT partitioning and disks beyond 2 TB, has a proper pre-boot environment, and supports Secure Boot (which checks the bootloader signature to block boot-level malware).',
    ],
    exam: 'BIOS↔MBR and UEFI↔GPT is the pairing they test. Secure Boot belongs to UEFI, not BIOS.',
  },
  {
    id: 'c-process-thread',
    term: 'Process vs thread',
    unit: 'Computer Fundamentals & OS',
    short: 'A process has its own memory space; threads live inside a process and share its memory.',
    explain: [
      'A process is an independent running program with its own address space. Two processes cannot read each other\'s memory directly — they need inter-process communication.',
      'A thread is a lighter unit of execution inside a process. Threads of the same process share memory and file handles, which makes communication cheap but creates the risk of race conditions.',
      'Context switching between processes is more expensive than between threads, because the whole memory map must be swapped.',
    ],
    example: 'Your Shiksha backend: Django Channels handles many concurrent WebSocket connections without spawning a separate process per user — that is the practical payoff of lightweight concurrency.',
    exam: 'Remember: threads share memory, processes do not. That one line answers most MCQs on this.',
  },
  {
    id: 'c-virtual-memory',
    term: 'Virtual memory, paging and thrashing',
    unit: 'Computer Fundamentals & OS',
    short: 'The OS pretends there is more RAM than exists by moving inactive pages to disk.',
    explain: [
      'Memory is divided into fixed-size blocks called pages. The OS keeps active pages in RAM and moves inactive ones to a swap area on disk.',
      'When a program touches a page that is not in RAM, a page fault occurs and the OS fetches it. Normal in moderation.',
      'Thrashing is the failure mode: so little real RAM is available that the system spends most of its time swapping pages instead of doing work. Symptom is heavy disk activity with near-zero throughput.',
    ],
    exam: 'Paging uses fixed-size blocks; segmentation uses variable-size logical units. That distinction is a frequent MCQ.',
  },
  {
    id: 'c-deadlock',
    term: 'Deadlock and its four conditions',
    unit: 'Computer Fundamentals & OS',
    short: 'Two or more processes each hold a resource the other needs, so none can proceed.',
    explain: [
      'All four Coffman conditions must hold simultaneously for deadlock: mutual exclusion, hold and wait, no preemption, and circular wait.',
      'Break any one condition and deadlock cannot occur — that is the basis of every prevention strategy.',
      'Handling approaches: prevention (design it out), avoidance (Banker\'s algorithm), detection and recovery (kill or roll back a process), or simply ignoring it, which most general-purpose operating systems actually do.',
    ],
    exam: 'The four conditions are asked by name. Mnemonic: Mutual exclusion, Hold and wait, No preemption, Circular wait.',
  },
  {
    id: 'c-scheduling',
    term: 'CPU scheduling algorithms',
    unit: 'Computer Fundamentals & OS',
    short: 'How the OS decides which ready process runs next.',
    explain: [
      'FCFS (First Come First Served) — simple, but one long job delays everything behind it (the convoy effect).',
      'SJF (Shortest Job First) — optimal average waiting time, but requires knowing burst times in advance and can starve long jobs.',
      'Round Robin — each process gets a fixed time quantum in turn. Fair and responsive; the quantum size is the tuning knob.',
      'Priority scheduling — highest priority first; risks starvation, solved by ageing (gradually raising the priority of waiting processes).',
    ],
    exam: 'Preemptive vs non-preemptive is the usual split. Round Robin is always preemptive; FCFS is always non-preemptive.',
  },
  {
    id: 'c-kernel',
    term: 'Kernel, shell and system calls',
    unit: 'Computer Fundamentals & OS',
    short: 'The kernel is the core of the OS; the shell is the interface to it; system calls are the bridge.',
    explain: [
      'The kernel manages CPU, memory, devices and files, and runs in privileged kernel mode.',
      'User programs run in user mode and cannot touch hardware directly. When they need to, they make a system call, which switches to kernel mode temporarily.',
      'The shell (bash, PowerShell) is just a program that accepts commands and asks the kernel to execute them.',
      'Monolithic kernels (Linux) put most services in kernel space for speed; microkernels keep the kernel minimal and push services to user space for robustness.',
    ],
    exam: 'Linux is a monolithic kernel (though modular). The kernel/user mode distinction is the core idea being tested.',
  },
  {
    id: 'c-filesystem',
    term: 'File systems',
    unit: 'Computer Fundamentals & OS',
    short: 'How the OS organises data on storage into files, directories and metadata.',
    explain: [
      'Windows: FAT32 (legacy, 4 GB max file size, still used on USB drives for compatibility) and NTFS (journaling, permissions, encryption, large files).',
      'Linux: ext4 is the common default; XFS and Btrfs are alternatives.',
      'Journaling means the file system records intended changes before making them, so an unexpected power loss can be recovered without full corruption.',
    ],
    exam: 'FAT32\'s 4 GB per-file limit is the classic question. NTFS supports permissions and journaling; FAT32 does not.',
  },
  {
    id: 'c-software-types',
    term: 'System vs application software',
    unit: 'Computer Fundamentals & OS',
    short: 'System software runs the machine; application software does the user\'s work.',
    explain: [
      'System software: operating systems, device drivers, firmware, utilities. It exists to make the hardware usable.',
      'Application software: word processors, browsers, the Shiksha platform. It exists to accomplish a task for a person.',
      'Middleware sits between the two — database engines, web servers, message queues — providing services applications depend on.',
    ],
    exam: 'Compilers, assemblers and interpreters are usually classified as system software (specifically, system utility/translator software).',
  },

  // ==================================================================
  // NETWORKING  (flagged weak area — covered heavily)
  // ==================================================================
  {
    id: 'c-osi',
    term: 'The OSI model — all seven layers',
    unit: 'Networking',
    short: 'A seven-layer reference model describing how data moves from application to wire and back.',
    explain: [
      '7 Application — what the user\'s program speaks: HTTP, FTP, SMTP, DNS.',
      '6 Presentation — translation, encryption, compression. TLS is usually placed here.',
      '5 Session — establishing, maintaining and terminating sessions between applications.',
      '4 Transport — end-to-end delivery, reliability and ports. TCP and UDP live here. Unit of data: segment.',
      '3 Network — logical addressing and routing between networks. IP lives here. Unit: packet. Device: router.',
      '2 Data Link — node-to-node delivery on the same physical network, MAC addressing, error detection. Unit: frame. Device: switch.',
      '1 Physical — the actual electrical, optical or radio signalling. Unit: bits. Device: hub, cable, repeater.',
    ],
    example: 'Mnemonic bottom-up: "Please Do Not Throw Sausage Pizza Away" — Physical, Data Link, Network, Transport, Session, Presentation, Application.',
    exam: 'They test layer→protocol and layer→device mapping constantly. Router = Layer 3, Switch = Layer 2, Hub = Layer 1. The TCP/IP model collapses this into 4 layers (Link, Internet, Transport, Application).',
  },
  {
    id: 'c-tcp-udp',
    term: 'TCP vs UDP',
    unit: 'Networking',
    short: 'TCP is reliable and ordered; UDP is fast and makes no guarantees.',
    explain: [
      'TCP is connection-oriented: it performs a three-way handshake (SYN → SYN-ACK → ACK) before sending data, acknowledges receipt, retransmits losses, and delivers bytes in order. It also does flow control and congestion control.',
      'UDP is connectionless: it just sends datagrams. No handshake, no acknowledgement, no ordering, no retransmission. Lower overhead and lower latency.',
      'Choose TCP when every byte must arrive correctly (web pages, file transfer, email, database connections). Choose UDP when timeliness beats completeness (live video/voice, DNS lookups, gaming).',
    ],
    example: 'On the ICCC: live camera streams typically favour UDP-based transport — a dropped frame is better than a delayed one. The management API around it would be TCP.',
    exam: 'The three-way handshake is a guaranteed question. TCP header is 20 bytes minimum, UDP header is 8 bytes.',
  },
  {
    id: 'c-ip-classes',
    term: 'IP addressing and address classes',
    unit: 'Networking',
    short: 'A 32-bit IPv4 address identifies a host and the network it sits on.',
    explain: [
      'IPv4 is 32 bits, written as four octets (e.g. 192.168.1.10). IPv6 is 128 bits, written in hexadecimal groups.',
      'Classful ranges: Class A 1–126 (default mask /8), Class B 128–191 (/16), Class C 192–223 (/24), Class D 224–239 (multicast), Class E 240–255 (experimental). 127.x.x.x is reserved for loopback.',
      'Private ranges that never route on the public internet: 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.',
    ],
    exam: '127.0.0.1 is loopback, not Class A usable space — that catches people. Know the three private ranges by heart; they appear constantly.',
  },
  {
    id: 'c-subnetting',
    term: 'Subnetting — with the actual arithmetic',
    unit: 'Networking',
    short: 'Splitting one network into smaller ones by borrowing bits from the host portion.',
    explain: [
      'The subnet mask marks which bits are network and which are host. /24 means 24 network bits, leaving 8 host bits.',
      'Usable hosts = 2^(host bits) − 2. You subtract two because the all-zeros address is the network address and the all-ones address is the broadcast address.',
      'To subnet further, borrow bits from the host side. Each borrowed bit doubles the number of subnets and halves the hosts per subnet.',
    ],
    example: '192.168.1.0/24 → 2^8 − 2 = 254 usable hosts. Borrow 2 bits to make /26 → four subnets, each with 2^6 − 2 = 62 usable hosts. The /26 blocks are .0, .64, .128, .192.',
    exam: 'Memorise the mask values: /24 = 255.255.255.0, /25 = .128, /26 = .192, /27 = .224, /28 = .240, /29 = .248, /30 = .252. A /30 gives 2 usable addresses — the standard point-to-point link.',
  },
  {
    id: 'c-mac-vs-ip',
    term: 'MAC address vs IP address (and ARP)',
    unit: 'Networking',
    short: 'MAC is the permanent hardware address; IP is the logical, routable address.',
    explain: [
      'A MAC address is 48 bits, burned into the network interface, and works only within a single local network segment (Layer 2).',
      'An IP address is logical, assignable, and routable across networks (Layer 3).',
      'ARP (Address Resolution Protocol) is the bridge: given an IP address on the local network, it discovers the corresponding MAC address so the frame can actually be delivered.',
    ],
    exam: 'ARP maps IP → MAC. RARP does the reverse. A packet keeps the same source/destination IP end to end, but the MAC addresses change at every hop.',
  },
  {
    id: 'c-dns',
    term: 'DNS',
    unit: 'Networking',
    short: 'Translates human-readable domain names into IP addresses.',
    explain: [
      'Hierarchy: root servers → TLD servers (.in, .com) → authoritative name servers for the domain.',
      'A resolver query walks that hierarchy (recursively or iteratively) and caches the result for the record\'s TTL.',
      'Record types worth knowing: A (name → IPv4), AAAA (name → IPv6), CNAME (alias to another name), MX (mail server), NS (name server), TXT (arbitrary text, used for SPF and domain verification), PTR (reverse lookup).',
    ],
    example: 'map.hawayu.in resolves through an A or CNAME record pointing at your hosting provider — that is DNS doing exactly this job.',
    exam: 'DNS uses UDP port 53 for ordinary queries and TCP port 53 for zone transfers and oversized responses. That split is a favourite question.',
  },
  {
    id: 'c-dhcp',
    term: 'DHCP',
    unit: 'Networking',
    short: 'Automatically assigns IP configuration to devices joining a network.',
    explain: [
      'Hands out IP address, subnet mask, default gateway and DNS servers, so devices need no manual configuration.',
      'The exchange is four steps, DORA: Discover (client broadcasts) → Offer (server proposes) → Request (client accepts) → Acknowledge (server confirms).',
      'Leases are time-limited and renewed; addresses return to the pool when they expire.',
    ],
    exam: 'DORA is asked by name. DHCP uses UDP ports 67 (server) and 68 (client).',
  },
  {
    id: 'c-nat',
    term: 'NAT',
    unit: 'Networking',
    short: 'Translates private internal addresses to a public address so many devices share one public IP.',
    explain: [
      'Static NAT maps one private address to one public address. Dynamic NAT maps from a pool.',
      'PAT (Port Address Translation), also called NAT overload, is what home and office routers actually do — many internal hosts share a single public IP, distinguished by port number.',
      'NAT was adopted largely because IPv4 addresses ran short. It also incidentally hides internal addressing from the outside, though that is not real security.',
    ],
    exam: 'PAT = NAT overload = "many-to-one". This is the one that appears most often.',
  },
  {
    id: 'c-vpn',
    term: 'VPN',
    unit: 'Networking',
    short: 'An encrypted tunnel carrying private traffic across a public network.',
    explain: [
      'Site-to-site VPN connects two offices permanently. Remote-access VPN connects an individual user to an office network.',
      'Common protocols: IPsec (operates at Layer 3, standard for site-to-site), SSL/TLS VPN (browser-friendly, good for remote users), and modern options like WireGuard.',
      'The value is confidentiality and integrity over an untrusted path — not anonymity, despite consumer marketing.',
    ],
    exam: 'IPsec has two modes: transport mode (encrypts payload only) and tunnel mode (encrypts the whole original packet). Tunnel mode is used for site-to-site.',
  },
  {
    id: 'c-network-devices',
    term: 'Hub vs Switch vs Router vs Gateway',
    unit: 'Networking',
    short: 'Four devices at three different OSI layers doing progressively smarter forwarding.',
    explain: [
      'Hub (Layer 1) — repeats every incoming signal to every other port. No intelligence, creates one big collision domain. Obsolete.',
      'Switch (Layer 2) — learns MAC addresses and forwards frames only to the correct port. Each port is its own collision domain.',
      'Router (Layer 3) — forwards packets between different networks using IP addresses and a routing table. Separates broadcast domains.',
      'Gateway — a device that translates between different protocols or architectures. Often the term simply means "the router that leads out of this network."',
    ],
    exam: 'Classic MCQ: "which device separates broadcast domains?" → router. "Which separates collision domains?" → switch (per port).',
  },
  {
    id: 'c-ports',
    term: 'Well-known port numbers',
    unit: 'Networking',
    short: 'Standard numbers identifying which service a transport-layer connection is for.',
    explain: [
      'FTP 20/21, SSH 22, Telnet 23, SMTP 25, DNS 53, DHCP 67/68, HTTP 80, POP3 110, IMAP 143, HTTPS 443, RDP 3389.',
      'Also worth knowing for your own stack: PostgreSQL 5432, Redis 6379, MySQL 3306.',
      'Ranges: 0–1023 well-known, 1024–49151 registered, 49152–65535 dynamic/ephemeral.',
    ],
    exam: 'HTTP 80 / HTTPS 443 / SSH 22 / RDP 3389 are near-guaranteed. Learn the list above cold — these are free marks.',
  },
  {
    id: 'c-topology',
    term: 'Network topologies',
    unit: 'Networking',
    short: 'The physical or logical arrangement of nodes in a network.',
    explain: [
      'Bus — one shared backbone. Cheap, but a break kills the whole segment.',
      'Star — all nodes connect to a central switch. The dominant modern layout; a single node failure is isolated, but the central device is a single point of failure.',
      'Ring — each node connects to two neighbours; data travels in a loop.',
      'Mesh — nodes interconnect directly. Highly fault-tolerant, expensive. A full mesh of n nodes needs n(n−1)/2 links.',
      'Hybrid — combinations, which is what real networks are.',
    ],
    exam: 'The full-mesh link formula n(n−1)/2 is a common calculation question.',
  },
  {
    id: 'c-lan-wan',
    term: 'LAN, MAN, WAN and bandwidth vs latency',
    unit: 'Networking',
    short: 'Network scale categories, and the two different things people mean by "speed".',
    explain: [
      'LAN — single building or campus. MAN — city scale. WAN — across cities or countries; the internet is the largest WAN.',
      'Bandwidth is capacity: how much data per second. Latency is delay: how long one packet takes to arrive. They are independent — a satellite link can have high bandwidth and terrible latency.',
      'Jitter is variation in latency, and it is what actually degrades live video and voice.',
    ],
    example: 'Relevant to the ICCC: 276 cameras across 76 hillside locations is a bandwidth aggregation problem at the NOC, but a latency and jitter problem for live PTZ control.',
    exam: 'Do not confuse bandwidth with speed. Also know: bandwidth is usually bits per second, storage is bytes — an 8× difference people get wrong.',
  },
  {
    id: 'c-troubleshoot',
    term: 'Network troubleshooting commands',
    unit: 'Networking',
    short: 'The standard diagnostic toolkit, and the order to use it in.',
    explain: [
      'ping — tests basic reachability using ICMP. Start here.',
      'tracert (Windows) / traceroute (Linux) — shows each hop, so you can see where the path breaks.',
      'ipconfig (Windows) / ifconfig or ip addr (Linux) — shows local interface configuration.',
      'nslookup / dig — tests DNS resolution specifically.',
      'netstat / ss — shows active connections and listening ports.',
      'Method: work up the layers. Check physical (cable, link light), then local IP config, then gateway reachability, then external reachability, then DNS. Isolating layer by layer beats guessing.',
    ],
    example: 'This is exactly the sequence you would describe if asked how you handled office network issues at the Directorate.',
    exam: 'ping uses ICMP, not TCP or UDP. That is the trap.',
  },

  // ==================================================================
  // WINDOWS SERVER & DIRECTORY SERVICES  (flagged weak area)
  // ==================================================================
  {
    id: 'c-active-directory',
    term: 'Active Directory',
    unit: 'Windows Server & Directory Services',
    short: 'Microsoft\'s centralised directory service for managing users, computers and permissions.',
    explain: [
      'AD stores objects (users, computers, groups, printers) in a hierarchical structure and authenticates them centrally, so one account works across the whole network.',
      'Structure, smallest to largest: Object → Organisational Unit (OU) → Domain → Tree → Forest. An OU is the unit you attach policy to; a forest is the outermost security boundary.',
      'A Domain Controller (DC) is a server running AD Domain Services and handling authentication.',
      'Authentication uses Kerberos by default (with NTLM as legacy fallback); directory lookups use LDAP.',
    ],
    exam: 'The forest is the security boundary, not the domain — that is a frequent trick question. Kerberos is the default authentication protocol.',
  },
  {
    id: 'c-group-policy',
    term: 'Group Policy (GPO)',
    unit: 'Windows Server & Directory Services',
    short: 'Centrally enforced configuration and security settings pushed to AD-joined machines.',
    explain: [
      'A GPO is a set of rules — password policy, software deployment, drive mappings, USB restrictions, desktop settings — linked to a site, domain or OU.',
      'Processing order is LSDOU: Local, then Site, then Domain, then OU. Later settings overwrite earlier ones, so OU-level policy wins by default.',
      'Exceptions: "Enforced" on a higher-level GPO overrides lower ones, and "Block Inheritance" on an OU stops inherited policies — except enforced ones.',
    ],
    exam: 'LSDOU order and "the last one applied wins" is the standard question. Enforced beats Block Inheritance.',
  },
  {
    id: 'c-server-roles',
    term: 'Common Windows Server roles',
    unit: 'Windows Server & Directory Services',
    short: 'The standard service roles a Windows server is deployed to fill.',
    explain: [
      'AD DS — Active Directory Domain Services, the directory and authentication role.',
      'DNS and DHCP — name resolution and address assignment, usually co-located with AD.',
      'File and Print Services — shared storage with NTFS permissions, and print queue management.',
      'IIS — Internet Information Services, Microsoft\'s web server.',
      'Hyper-V — the hypervisor role for running virtual machines.',
      'RDS — Remote Desktop Services for session-based remote access.',
    ],
    exam: 'Know that AD DS requires DNS to function — AD cannot work without name resolution, and they like asking this dependency.',
  },
  {
    id: 'c-ntfs-permissions',
    term: 'NTFS vs share permissions',
    unit: 'Windows Server & Directory Services',
    short: 'Two separate permission layers on Windows file shares; the stricter one wins.',
    explain: [
      'Share permissions apply only when a folder is accessed over the network. NTFS permissions apply both locally and over the network.',
      'When both apply, the effective permission is the most restrictive of the two.',
      'Explicit Deny always overrides Allow, including inherited Allow.',
      'Standard NTFS levels: Full Control, Modify, Read & Execute, List Folder Contents, Read, Write.',
    ],
    exam: '"Most restrictive wins" and "Deny overrides Allow" are both near-certain MCQs.',
  },
  {
    id: 'c-raid',
    term: 'RAID levels',
    unit: 'Windows Server & Directory Services',
    short: 'Combining multiple disks for performance, redundancy, or both.',
    explain: [
      'RAID 0 — striping. Fast, uses full capacity, zero redundancy. One disk fails and everything is lost.',
      'RAID 1 — mirroring. Full duplicate; usable capacity is half; survives one disk failure.',
      'RAID 5 — striping with distributed parity. Needs at least 3 disks, survives one failure, loses one disk\'s worth of capacity.',
      'RAID 6 — like RAID 5 but double parity; survives two simultaneous failures; needs at least 4 disks.',
      'RAID 10 — mirrored pairs, then striped. Best performance plus redundancy, but half the capacity.',
    ],
    example: 'Directly relevant to the ICCC: 276 cameras at 30-day retention is a large storage array, and the RAID choice is a real operational decision balancing cost against tolerable data loss.',
    exam: 'Usable capacity questions are common. RAID 5 with n disks of size s gives (n−1)×s. RAID 1 gives s regardless of disk count. Also: RAID is not a backup.',
  },

  // ==================================================================
  // DBMS
  // ==================================================================
  {
    id: 'c-dbms-rdbms',
    term: 'DBMS vs RDBMS',
    unit: 'DBMS',
    short: 'An RDBMS is a DBMS that stores data in related tables and enforces relational rules.',
    explain: [
      'A DBMS manages data generally; it may store data as files, hierarchies or networks.',
      'An RDBMS organises data into tables (relations) of rows and columns, supports keys and foreign-key relationships, and enforces integrity constraints.',
      'Codd\'s rules define what qualifies as truly relational. PostgreSQL, MySQL, Oracle and SQL Server are RDBMSs.',
    ],
    exam: 'Every RDBMS is a DBMS, not the reverse. Relationships and constraints are the distinguishing feature.',
  },
  {
    id: 'c-keys',
    term: 'Keys — primary, foreign, candidate, composite, super',
    unit: 'DBMS',
    short: 'Attributes that uniquely identify rows or link tables together.',
    explain: [
      'Super key — any set of attributes that uniquely identifies a row (possibly with redundant attributes).',
      'Candidate key — a minimal super key, with no unnecessary attributes. A table can have several.',
      'Primary key — the candidate key actually chosen. Unique, and cannot be NULL.',
      'Alternate key — the candidate keys not chosen as primary.',
      'Composite key — a primary key made of two or more columns together.',
      'Foreign key — a column referencing another table\'s primary key, enforcing referential integrity. It may be NULL and may repeat.',
    ],
    exam: 'Primary key cannot be NULL; unique key can hold one NULL. That distinction is asked constantly.',
  },
  {
    id: 'c-normalization',
    term: 'Normalization — 1NF through BCNF',
    unit: 'DBMS',
    short: 'Structuring tables to remove redundancy and prevent update anomalies.',
    explain: [
      '1NF — every value is atomic; no repeating groups or multi-valued columns.',
      '2NF — in 1NF, and every non-key attribute depends on the whole primary key, not part of it. Only matters with composite keys (removes partial dependency).',
      '3NF — in 2NF, and no non-key attribute depends on another non-key attribute (removes transitive dependency).',
      'BCNF — a stricter 3NF: for every functional dependency X → Y, X must be a super key.',
      'The anomalies being prevented: insertion (cannot add data without unrelated data), update (must change the same fact in many rows), and deletion (removing a row loses unrelated information).',
    ],
    example: 'Your DILRMP consolidation was normalization in practice — separate district tables holding overlapping, inconsistently duplicated data, merged into one schema where each fact lives in exactly one place.',
    exam: 'Mnemonic: 1NF kills repeating groups, 2NF kills partial dependency, 3NF kills transitive dependency. Denormalization is the deliberate reverse, done for read performance.',
  },
  {
    id: 'c-acid',
    term: 'ACID properties',
    unit: 'DBMS',
    short: 'The four guarantees that make database transactions trustworthy.',
    explain: [
      'Atomicity — a transaction happens completely or not at all. A partial transfer never persists.',
      'Consistency — the database moves from one valid state to another, respecting all constraints.',
      'Isolation — concurrent transactions do not interfere; the result matches some serial ordering.',
      'Durability — once committed, the change survives a crash or power loss.',
    ],
    example: 'A payment on Shiksha: debiting the payer and recording the enrolment must both happen or neither. That is atomicity doing real work.',
    exam: 'Isolation levels are the follow-up: Read Uncommitted, Read Committed, Repeatable Read, Serializable — increasing safety, decreasing concurrency. Know the anomalies they prevent: dirty read, non-repeatable read, phantom read.',
  },
  {
    id: 'c-sql-sublanguages',
    term: 'DDL, DML, DCL, TCL',
    unit: 'DBMS',
    short: 'The four functional categories of SQL commands.',
    explain: [
      'DDL (Data Definition Language) — defines structure: CREATE, ALTER, DROP, TRUNCATE. Auto-commits.',
      'DML (Data Manipulation Language) — works with data: SELECT, INSERT, UPDATE, DELETE.',
      'DCL (Data Control Language) — controls access: GRANT, REVOKE.',
      'TCL (Transaction Control Language) — manages transactions: COMMIT, ROLLBACK, SAVEPOINT.',
    ],
    exam: 'DELETE vs TRUNCATE vs DROP is the favourite question. DELETE is DML, removes rows, can be rolled back, fires triggers. TRUNCATE is DDL, removes all rows fast, cannot be rolled back, resets identity. DROP removes the table itself.',
  },
  {
    id: 'c-joins',
    term: 'SQL joins',
    unit: 'DBMS',
    short: 'Combining rows from two tables based on a related column.',
    explain: [
      'INNER JOIN — only rows with a match in both tables.',
      'LEFT (OUTER) JOIN — all rows from the left table, with NULLs where the right has no match.',
      'RIGHT (OUTER) JOIN — the mirror image.',
      'FULL OUTER JOIN — all rows from both sides, NULLs where either lacks a match.',
      'CROSS JOIN — Cartesian product, every row paired with every row.',
      'SELF JOIN — a table joined to itself, typically for hierarchies like employee→manager.',
    ],
    exam: 'If a CROSS JOIN of m and n rows is asked: the result has m×n rows. LEFT JOIN returning NULLs is the other standard question.',
  },
  {
    id: 'c-index',
    term: 'Indexes',
    unit: 'DBMS',
    short: 'A separate structure that lets the engine find rows without scanning the whole table.',
    explain: [
      'Usually a B-tree. It stores sorted key values with pointers to the rows, turning a full scan into a logarithmic lookup.',
      'The trade-off: indexes speed up reads but slow down writes, because every INSERT, UPDATE and DELETE must also maintain the index. They also consume storage.',
      'A clustered index determines the physical row order — one per table. Non-clustered indexes are separate structures, and you can have many.',
      'Index the columns you filter and join on, not every column.',
    ],
    exam: 'One clustered index per table maximum. "Why not index everything?" → write cost and storage.',
  },
  {
    id: 'c-view-proc-trigger',
    term: 'View vs stored procedure vs trigger',
    unit: 'DBMS',
    short: 'Three different stored database objects, distinguished by how they are invoked.',
    explain: [
      'View — a stored query that behaves like a virtual table. Simplifies complex queries and can restrict which columns a user sees.',
      'Stored procedure — precompiled SQL executed on explicit call. Accepts parameters, can contain control flow.',
      'Trigger — SQL that fires automatically in response to an event (BEFORE/AFTER INSERT, UPDATE or DELETE). Never called directly.',
      'Function — like a procedure but must return a value and can be used inside a query.',
    ],
    exam: 'The dividing line they test: a procedure is called, a trigger fires by itself. Materialized views store results physically; ordinary views do not.',
  },
  {
    id: 'c-sql-nosql',
    term: 'SQL vs NoSQL',
    unit: 'DBMS',
    short: 'Relational, schema-fixed, strongly consistent versus flexible-schema, horizontally scalable.',
    explain: [
      'SQL databases use fixed schemas, guarantee ACID, and scale mainly by adding power to one machine (vertical scaling). Best for structured, relational, transaction-critical data.',
      'NoSQL covers document stores (MongoDB), key-value stores (Redis), column-family stores (Cassandra) and graph databases (Neo4j). Flexible schema, horizontal scaling, often eventual rather than strict consistency.',
      'The CAP theorem says a distributed system can guarantee at most two of Consistency, Availability and Partition tolerance.',
    ],
    example: 'Your Shiksha stack uses both deliberately: PostgreSQL for the relational core where correctness matters, Redis as a key-value store for ephemeral real-time state.',
    exam: 'CAP theorem is asked by name. Note that partition tolerance is not really optional in a distributed system, so the real choice is C versus A.',
  },
  {
    id: 'c-backup-recovery',
    term: 'Backup types and recovery objectives',
    unit: 'DBMS',
    short: 'Full, incremental and differential backups, measured against RPO and RTO.',
    explain: [
      'Full — everything, every time. Slowest to take, fastest to restore.',
      'Incremental — only what changed since the last backup of any kind. Fastest to take, slowest to restore (needs the full plus every increment in order).',
      'Differential — everything changed since the last full backup. Middle ground: restore needs only the full plus the latest differential.',
      'RPO (Recovery Point Objective) — how much data you can afford to lose, i.e. how far back you fall. RTO (Recovery Time Objective) — how quickly you must be running again.',
      'The 3-2-1 rule: three copies, on two different media, one offsite.',
    ],
    example: 'The ICCC\'s 30-day retention is effectively an RPO statement about surveillance footage — worth framing it that way if asked.',
    exam: 'RPO = data loss tolerance (time before the incident). RTO = downtime tolerance (time after). People reverse these constantly.',
  },

  // ==================================================================
  // WEB TECHNOLOGIES
  // ==================================================================
  {
    id: 'c-http',
    term: 'HTTP methods and status codes',
    unit: 'Web Technologies',
    short: 'The verbs and response codes of web communication.',
    explain: [
      'Methods: GET (retrieve, safe, cacheable), POST (create/submit), PUT (replace fully), PATCH (partial update), DELETE (remove), HEAD (headers only), OPTIONS (capability discovery).',
      'Status families: 1xx informational, 2xx success (200 OK, 201 Created, 204 No Content), 3xx redirection (301 permanent, 302 temporary, 304 Not Modified), 4xx client error (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests), 5xx server error (500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable).',
      'HTTP is stateless — each request stands alone, which is why cookies, sessions and tokens exist.',
    ],
    exam: '401 means "not authenticated" (who are you?); 403 means "authenticated but not permitted" (I know you, and no). That distinction is a reliable question.',
  },
  {
    id: 'c-rest',
    term: 'REST and REST APIs',
    unit: 'Web Technologies',
    short: 'An architectural style treating everything as a resource addressed by URL and acted on with HTTP verbs.',
    explain: [
      'Core constraints: stateless (the server keeps no client session between requests), client-server separation, uniform interface, cacheable, layered system.',
      'Resources are nouns in the URL; the HTTP method is the verb. GET /courses/12 retrieves; DELETE /courses/12 removes.',
      'Idempotence matters: GET, PUT and DELETE are idempotent (repeating them has the same effect as doing them once); POST is not.',
    ],
    example: 'Shiksha\'s backend is Django REST Framework, so this is your own daily working model, not theory.',
    exam: 'Statelessness is the defining REST constraint. Also know REST vs SOAP: SOAP is a strict XML-based protocol; REST is a lighter architectural style, usually JSON.',
  },
  {
    id: 'c-cookies-sessions-jwt',
    term: 'Cookies, sessions and JWT',
    unit: 'Web Technologies',
    short: 'Three ways to carry identity across stateless HTTP requests.',
    explain: [
      'Cookie — a small piece of data the browser stores and sends back with each request to that domain.',
      'Session — the server stores the real state and gives the browser only a session ID in a cookie. Server-side memory required; easy to revoke.',
      'JWT (JSON Web Token) — a signed token containing claims (user id, role, expiry). The server verifies the signature rather than looking up state, which scales well but makes immediate revocation harder.',
      'Security flags on cookies: HttpOnly (JavaScript cannot read it, blocking XSS theft), Secure (HTTPS only), SameSite (limits cross-site sending, mitigating CSRF).',
    ],
    example: 'Shiksha stores JWTs in HttpOnly cookies scoped to the parent domain, which is what gives single sign-on across all four subdomains. Your identity-isolation bug was precisely a case of not reading the claims that token already carried.',
    exam: 'JWT has three parts separated by dots: header.payload.signature. The payload is Base64-encoded, not encrypted — anyone can read it, so never put secrets in it. That is the trap.',
  },
  {
    id: 'c-websocket',
    term: 'WebSockets',
    unit: 'Web Technologies',
    short: 'A persistent, full-duplex connection between browser and server.',
    explain: [
      'Ordinary HTTP is request-response: the client must ask before the server can speak. WebSockets keep one connection open so either side can send at any time.',
      'It begins as an HTTP request with an Upgrade header, then switches protocol on the same TCP connection.',
      'Used for chat, live notifications, dashboards and collaborative editing. The older workaround was polling (repeatedly asking) or long-polling.',
    ],
    example: 'Shiksha\'s real-time chat and notifications run on Django Channels over WebSockets with Redis as the channel layer — that is why Daphne/ASGI sits beside Gunicorn in the architecture.',
    exam: 'ws:// and wss:// are the schemes (wss is the TLS-secured one). The handshake starts as HTTP — that detail is frequently asked.',
  },
  {
    id: 'c-https-tls',
    term: 'HTTPS and TLS',
    unit: 'Web Technologies',
    short: 'HTTP carried inside an encrypted, authenticated TLS channel.',
    explain: [
      'TLS provides confidentiality (encryption), integrity (tamper detection) and authentication (the server proves who it is via a certificate).',
      'The handshake uses asymmetric cryptography to agree a shared symmetric key, then switches to fast symmetric encryption for the actual data. This hybrid approach is the key idea.',
      'A Certificate Authority (CA) signs the server\'s certificate; the browser trusts the CA, and therefore the server.',
    ],
    exam: 'Why hybrid? Asymmetric crypto is secure for key exchange but slow; symmetric is fast but needs a shared key. TLS uses each for what it is good at. HTTPS is port 443.',
  },
  {
    id: 'c-json-xml',
    term: 'JSON vs XML',
    unit: 'Web Technologies',
    short: 'Two data-interchange formats; JSON is lighter and now dominant for APIs.',
    explain: [
      'JSON uses key-value pairs and arrays, maps directly onto data structures in most languages, and is far less verbose.',
      'XML uses nested tags, supports attributes, namespaces, schema validation (XSD) and transformation (XSLT) — heavier but more formally specified.',
      'JSON dominates REST APIs; XML persists in enterprise systems, SOAP services and document formats (including .docx and .xlsx internals).',
    ],
    exam: 'JSON supports fewer data types than people assume — string, number, boolean, null, object, array. No date type; dates are strings by convention.',
  },
  {
    id: 'c-frontend-backend',
    term: 'Client-side vs server-side',
    unit: 'Web Technologies',
    short: 'What runs in the user\'s browser versus what runs on your server.',
    explain: [
      'Client-side (HTML, CSS, JavaScript, React) runs in the browser. Fast to respond, but fully visible and modifiable by the user — never trust it for security.',
      'Server-side (Django, Node, PHP) runs on your infrastructure. This is where authentication, authorisation and business rules must be enforced.',
      'Rendering strategies: SSR (server-side rendering) sends finished HTML — better for first load and SEO; CSR (client-side rendering) sends a shell and builds the page in the browser — better for app-like interactivity.',
    ],
    exam: 'The security principle is the exam point and the real-world one: client-side validation is for user experience only. All validation must be repeated server-side.',
  },

  // ==================================================================
  // CYBER SECURITY
  // ==================================================================
  {
    id: 'c-cia',
    term: 'The CIA triad',
    unit: 'Cyber Security',
    short: 'Confidentiality, Integrity, Availability — the three goals of information security.',
    explain: [
      'Confidentiality — only authorised parties can read the data. Achieved by encryption and access control.',
      'Integrity — data has not been altered without authorisation. Achieved by hashing, checksums and digital signatures.',
      'Availability — the system is usable when needed. Achieved by redundancy, backups and DDoS protection.',
      'Often extended with Authentication, Authorisation, Non-repudiation and Accountability.',
    ],
    example: 'ICCC framing: encryption of footage is confidentiality, tamper-evident logs are integrity, and NOC power redundancy is availability. Using the triad to structure an answer about the ICCC sounds well-organised.',
    exam: 'Given a scenario, identify which pillar is violated. A defaced website breaks integrity; a leaked database breaks confidentiality; a DDoS breaks availability.',
  },
  {
    id: 'c-symmetric-asymmetric',
    term: 'Symmetric vs asymmetric encryption',
    unit: 'Cyber Security',
    short: 'One shared key versus a public/private key pair.',
    explain: [
      'Symmetric — the same key encrypts and decrypts. Fast, good for bulk data. Algorithms: AES, DES, 3DES. The hard problem is distributing the key safely.',
      'Asymmetric — a public key encrypts, the matching private key decrypts. Solves key distribution but is computationally slow. Algorithms: RSA, ECC, Diffie-Hellman (key exchange).',
      'Practical systems combine them: asymmetric to agree a key, symmetric for the data. That is exactly what TLS does.',
    ],
    exam: 'AES is symmetric; RSA is asymmetric — a very common MCQ. For confidentiality you encrypt with the recipient\'s public key; for a signature you encrypt (sign) with your own private key. The direction is the trap.',
  },
  {
    id: 'c-hashing',
    term: 'Hashing',
    unit: 'Cyber Security',
    short: 'A one-way function producing a fixed-length fingerprint of data.',
    explain: [
      'Hashing is not encryption — it cannot be reversed. It verifies integrity and stores passwords safely.',
      'Properties required: deterministic, fast, irreversible, collision-resistant, and exhibiting the avalanche effect (a tiny input change alters the whole output).',
      'Algorithms: MD5 (128-bit, broken, do not use), SHA-1 (160-bit, deprecated), SHA-256 (current standard). For passwords specifically use bcrypt, scrypt or Argon2, which are deliberately slow.',
      'Salt is random data added per password before hashing, so identical passwords produce different hashes and precomputed rainbow tables fail.',
    ],
    example: 'Your India Study Map question bank uses content hashing for deduplication — the same integrity principle applied to data quality rather than security.',
    exam: 'Encryption is two-way, hashing is one-way. MD5 and SHA-1 are considered broken. Salting defeats rainbow tables.',
  },
  {
    id: 'c-pki-dsc',
    term: 'PKI, digital signatures and DSC',
    unit: 'Cyber Security',
    short: 'The public-key infrastructure that makes digital signatures legally and technically trustworthy.',
    explain: [
      'To sign, you hash the document and encrypt the hash with your private key. Anyone can decrypt it with your public key and compare hashes — proving both integrity and origin.',
      'This gives non-repudiation: the signer cannot plausibly deny signing, since only they hold the private key.',
      'PKI is the surrounding machinery: Certificate Authorities issue certificates binding a public key to an identity, Registration Authorities verify identity, and CRLs or OCSP handle revocation.',
      'In India, a DSC (Digital Signature Certificate) is issued by licensed CAs under the Controller of Certifying Authorities, and is legally recognised under the IT Act, 2000. Government e-Office file approvals, tenders and filings depend on it.',
    ],
    example: 'Directly relevant: a System Manager in a government PSU will administer DSC tokens for officers approving files in e-Office, and handle their renewal.',
    exam: 'Signing uses the private key; verification uses the public key. Encryption for confidentiality is the reverse. Non-repudiation is the property digital signatures uniquely add.',
  },
  {
    id: 'c-authn-authz',
    term: 'Authentication vs authorisation, and MFA',
    unit: 'Cyber Security',
    short: 'Authentication proves who you are; authorisation decides what you may do.',
    explain: [
      'Authentication factors: something you know (password), something you have (OTP token, smart card), something you are (biometric). MFA requires two or more from different categories.',
      'A password plus a security question is not MFA — both are "something you know".',
      'Authorisation models: RBAC (role-based, permissions attached to roles), ABAC (attribute-based), and the principle of least privilege — grant the minimum needed.',
      'SSO (Single Sign-On) lets one authentication serve many systems.',
    ],
    example: 'Shiksha does both: JWT cookies authenticate across four subdomains (SSO), and the claims in the token drive what each identity is authorised to see.',
    exam: 'AuthN = identity, AuthZ = permissions. 401 vs 403 in HTTP maps onto exactly this pair.',
  },
  {
    id: 'c-attacks',
    term: 'Common attack types',
    unit: 'Cyber Security',
    short: 'The standard catalogue of threats you are expected to name and define.',
    explain: [
      'Phishing — fraudulent messages inducing users to reveal credentials. Spear phishing is targeted; whaling targets executives.',
      'SQL injection — untrusted input interpreted as SQL. Prevented by parameterised queries, not by input filtering alone.',
      'XSS (Cross-Site Scripting) — injecting script that runs in another user\'s browser. Prevented by output encoding and Content Security Policy.',
      'CSRF (Cross-Site Request Forgery) — tricking a logged-in user\'s browser into submitting an unintended request. Prevented by anti-CSRF tokens and SameSite cookies.',
      'DoS / DDoS — exhausting resources so legitimate users cannot connect. DDoS uses many distributed sources, often a botnet.',
      'MITM (Man-in-the-Middle) — intercepting communication between two parties. Defeated by TLS with proper certificate validation.',
      'Ransomware — encrypting a victim\'s data and demanding payment. Offline, tested backups are the real defence.',
      'Zero-day — exploiting a vulnerability before a patch exists.',
    ],
    example: 'Surveillance systems have a specific weak point worth naming: internet-exposed cameras and NVRs left on default credentials with unpatched firmware. That is a real ICCC risk, not a hypothetical one.',
    exam: 'SQL injection → parameterised queries. XSS → output encoding. CSRF → tokens. They test the attack-to-mitigation pairing.',
  },
  {
    id: 'c-firewall-ids',
    term: 'Firewall, IDS and IPS',
    unit: 'Cyber Security',
    short: 'Filtering traffic, detecting intrusions, and actively blocking them.',
    explain: [
      'Firewall — enforces rules on traffic. Packet-filtering firewalls inspect headers; stateful firewalls track connection state; next-generation firewalls inspect application content.',
      'IDS (Intrusion Detection System) — monitors and alerts, but does not block. Passive.',
      'IPS (Intrusion Prevention System) — sits inline and actively blocks detected attacks.',
      'DMZ — a network segment between internal network and internet, hosting public-facing services so a compromise does not reach the internal network directly.',
      'Network segmentation using VLANs is the practical defence for a camera network — keeping cameras off the same segment as office machines limits lateral movement.',
    ],
    exam: 'IDS detects and alerts; IPS detects and blocks. That is the entire distinction they test.',
  },
  {
    id: 'c-dpdp',
    term: 'DPDP Act, 2023 and the IT Act, 2000',
    unit: 'Cyber Security',
    short: 'India\'s data protection law, and the older statute underpinning cyber law.',
    explain: [
      'The Digital Personal Data Protection Act, 2023 governs processing of digital personal data. Key roles: Data Principal (the individual), Data Fiduciary (who decides purpose and means), Data Processor (who processes on their behalf).',
      'Core obligations: lawful purpose and consent, purpose limitation, data minimisation, accuracy, storage limitation, reasonable security safeguards, and breach notification. The Data Protection Board of India adjudicates.',
      'The IT Act, 2000 is the older framework covering cybercrime and electronic records. Section 43A concerns compensation for failure to protect sensitive data; Section 66 covers computer-related offences; Section 72 covers breach of confidentiality; Sections 66C and 66D cover identity theft and impersonation.',
    ],
    example: 'This is the framework that governs ICCC footage and facial recognition data. If asked, lead with governance — documented purpose, defined access, audit logs, retention limits — and treat the technology as secondary.',
    exam: 'Know the DPDP role names (Principal, Fiduciary, Processor) and that the IT Act, 2000 gave legal recognition to electronic records and digital signatures.',
  },
  {
    id: 'c-patch-vuln',
    term: 'Patch management and vulnerability management',
    unit: 'Cyber Security',
    short: 'Systematically closing known weaknesses before they are exploited.',
    explain: [
      'Vulnerability management is the cycle: discover assets, scan for known vulnerabilities, prioritise by risk, remediate, verify.',
      'Patch management is the disciplined application of vendor updates — test in a staging environment, schedule a maintenance window, deploy, verify, and keep a rollback path.',
      'CVE is the public identifier scheme for known vulnerabilities; CVSS scores their severity.',
      'The hard cases in practice are embedded devices — cameras, NVRs, routers — which are frequently left unpatched because updating them is disruptive.',
    ],
    exam: 'Expect a scenario question. The answer structure is: inventory first, risk-prioritise second, test before deploying, and always have rollback.',
  },

  // ==================================================================
  // IT GOVERNANCE & SERVICE MANAGEMENT
  // ==================================================================
  {
    id: 'c-itil',
    term: 'ITIL / ITSM — incident, problem, change',
    unit: 'IT Governance & Service Management',
    short: 'The standard vocabulary for running IT as a service, and three processes you must not confuse.',
    explain: [
      'ITSM is the practice of delivering IT as a service to an organisation. ITIL is the dominant framework describing how.',
      'Incident management — restore normal service as fast as possible. The goal is restoration, not diagnosis. A workaround is an acceptable outcome.',
      'Problem management — find and eliminate the underlying root cause so incidents stop recurring. Slower, investigative.',
      'Change management — control modifications to live systems so changes do not cause incidents. Includes approval, scheduling and rollback planning.',
      'Also: Service Request (a routine ask, like new access) is distinct from an Incident (something is broken).',
    ],
    example: 'Concretely: the ICCC video wall goes blank → incident (restore it). It has gone blank four times this month → problem (find out why). Replacing the failing switch → change (plan, approve, schedule, roll back if needed).',
    exam: 'Incident = restore service. Problem = remove root cause. This exact distinction is the most commonly tested governance item.',
  },
  {
    id: 'c-sla',
    term: 'SLA, OLA and KPIs',
    unit: 'IT Governance & Service Management',
    short: 'The measurable commitments that make a vendor contract enforceable.',
    explain: [
      'An SLA (Service Level Agreement) is between the service provider and the customer, and states measurable targets: uptime percentage, response time, resolution time, and penalties for breach.',
      'An OLA (Operational Level Agreement) is internal, between teams supporting the same service.',
      'An underpinning contract is with an external third party supporting delivery.',
      'Uptime targets in practice: 99% allows about 7.2 hours of downtime a month; 99.9% allows about 43 minutes; 99.99% allows about 4.3 minutes.',
      'Response time and resolution time are different commitments — a vendor can respond in 15 minutes and still take three days to fix, unless both are specified.',
    ],
    example: 'This is the practical lever for ICCC AMC renewals: tying payment to measured SLA performance rather than renewing a flat annual fee is a concrete, credible thing to propose in the interview.',
    exam: 'SLA is external (provider↔customer); OLA is internal. Know the "number of nines" downtime figures.',
  },
  {
    id: 'c-bcp-drp',
    term: 'BCP vs DRP',
    unit: 'IT Governance & Service Management',
    short: 'Keeping the organisation running versus restoring the IT systems.',
    explain: [
      'BCP (Business Continuity Plan) is the broader plan for how the organisation keeps functioning during a disruption — including manual fallback procedures, alternate sites and staff arrangements.',
      'DRP (Disaster Recovery Plan) is the IT-specific subset: how systems and data are restored, in what order, within what time.',
      'Both are driven by a Business Impact Analysis, which establishes RTO and RPO per system.',
      'A plan that has never been tested is not a plan. Tabletop exercises and restore drills are the point.',
    ],
    exam: 'DRP is a subset of BCP — they like reversing this. RTO is downtime tolerance, RPO is data-loss tolerance.',
  },
  {
    id: 'c-sdlc',
    term: 'SDLC models',
    unit: 'IT Governance & Service Management',
    short: 'The phased approaches to building software.',
    explain: [
      'Phases in general: requirements, design, implementation, testing, deployment, maintenance.',
      'Waterfall — strictly sequential; each phase completes before the next. Works where requirements are fixed and documentation is contractual, as in much government procurement.',
      'Agile — iterative increments with continuous feedback. Scrum uses fixed sprints and defined roles; Kanban uses continuous flow with work-in-progress limits.',
      'V-model — waterfall with each development phase paired to a corresponding test phase.',
      'Spiral — iterative with explicit risk analysis each cycle.',
    ],
    example: 'Your Shiksha delivery plan splits work into six parallel workstreams with defined ownership — that is an agile-leaning structure, and worth describing in those terms if asked about methodology.',
    exam: 'Waterfall\'s weakness is that requirement changes late are very costly. Agile\'s weakness is weaker upfront documentation and scope predictability — relevant in government contexts.',
  },
  {
    id: 'c-asset-management',
    term: 'IT asset management and documentation',
    unit: 'IT Governance & Service Management',
    short: 'Knowing what you own, where it is, and what condition it is in.',
    explain: [
      'An asset register records every device: identifier, location, owner, purchase date, warranty and AMC expiry, and lifecycle stage.',
      'A CMDB (Configuration Management Database) extends this to relationships — which server runs which service, which depends on what.',
      'Documentation that actually matters for handover: architecture overview, data flows, dependency map, credentials handling procedure, runbooks for routine tasks, and known issues.',
      'Lifecycle: procure → deploy → maintain → refresh → securely dispose (with certified data destruction).',
    ],
    example: 'This is precisely your credible first-90-days answer at MUDAL: you cannot manage 276 cameras, 15 Wi-Fi sites and an inherited software estate without an inventory and an AMC expiry calendar. Say that.',
    exam: 'The asset register underpins everything else — you cannot secure, patch or budget for what you have not catalogued.',
  },
  {
    id: 'c-eoffice',
    term: 'e-Office and government digital workflow',
    unit: 'IT Governance & Service Management',
    short: 'NIC\'s digital file-movement system replacing physical government files.',
    explain: [
      'e-Office is an NIC product suite. Its core module is eFile, which digitises receipts, files, notes and approvals so a file moves electronically through the hierarchy.',
      'Other modules cover knowledge management (KMS), leave, tours and personnel information (PIMS).',
      'Approvals are authenticated with a DSC or e-Sign, giving legal validity under the IT Act.',
      'Benefits typically cited: traceability of who held a file and for how long, reduced physical movement, and searchable records.',
    ],
    example: 'A System Manager in a state PSU would realistically handle e-Office user onboarding, DSC issuance and renewal, and workflow configuration — worth mentioning as something you expect to own.',
    exam: 'NIC is the implementing agency. eFile is the flagship module. Know that DSC/e-Sign provides the legal validity.',
  },

  // ==================================================================
  // AI, CLOUD & EMERGING TECH
  // ==================================================================
  {
    id: 'c-ai-ml-dl',
    term: 'AI vs ML vs Deep Learning',
    unit: 'AI, Cloud & Emerging Tech',
    short: 'Three nested circles, not three separate fields.',
    explain: [
      'AI is the broadest: any technique making machines perform tasks that would need human intelligence, including rule-based expert systems.',
      'ML is a subset: systems that learn patterns from data rather than following explicitly written rules.',
      'Deep Learning is a subset of ML using multi-layer neural networks, and is what made modern image recognition and language models work.',
      'ML learning types: supervised (labelled data — classification, regression), unsupervised (unlabelled — clustering), and reinforcement (learning from reward signals).',
    ],
    example: 'The ICCC uses all three layers in practice: ANPR and facial recognition are deep-learning computer vision, deployed inside a broader rule-driven alerting system.',
    exam: 'AI ⊃ ML ⊃ DL is the relationship they test. Supervised needs labelled data; unsupervised does not.',
  },
  {
    id: 'c-llm',
    term: 'LLMs and Generative AI',
    unit: 'AI, Cloud & Emerging Tech',
    short: 'Models trained on large text corpora that generate language, plus the broader generative family.',
    explain: [
      'An LLM is a deep-learning model, typically a transformer, trained to predict text and thereby able to summarise, translate, answer and write code.',
      'Generative AI is broader: text, images, audio, video and code generation.',
      'Prompt engineering is the practice of structuring input to get reliable output. Key limitation to name: hallucination — confident, fluent, factually wrong output.',
      'RAG (Retrieval-Augmented Generation) grounds a model in your own documents by retrieving relevant passages and supplying them as context, which reduces hallucination.',
    ],
    example: 'Honest and verifiable: your India Study Map content pipelines call Google Generative AI and Groq APIs, and your question bank labels AI-derived answers with an explicit confidence rating rather than presenting them as authoritative. That is responsible AI use you can describe first-hand.',
    exam: 'Hallucination is the standard named limitation. Know that a transformer architecture and the attention mechanism underpin modern LLMs.',
  },
  {
    id: 'c-cloud-models',
    term: 'Cloud service and deployment models',
    unit: 'AI, Cloud & Emerging Tech',
    short: 'IaaS, PaaS, SaaS — and public, private, hybrid, community.',
    explain: [
      'IaaS — you rent raw infrastructure (VMs, storage, network) and manage the OS upward. Example: a bare cloud server.',
      'PaaS — you deploy code and the provider manages the runtime and OS. Example: Vercel, which hosts map.hawayu.in.',
      'SaaS — you use finished software over the internet and manage nothing. Example: Gmail.',
      'Deployment models: public (shared infrastructure), private (dedicated, often on-premises), hybrid (both, connected), community (shared by organisations with common requirements).',
      'Five essential characteristics from the NIST definition: on-demand self-service, broad network access, resource pooling, rapid elasticity, measured service.',
    ],
    example: 'In government contexts, MeghRaj (the National Cloud initiative) and empanelled cloud providers matter, because data-localisation and security requirements often rule out ordinary public cloud.',
    exam: 'Responsibility questions are standard: in IaaS you patch the OS; in PaaS the provider does. Know the IaaS→PaaS→SaaS ordering of decreasing control.',
  },
  {
    id: 'c-virtualization',
    term: 'Virtualisation and containers',
    unit: 'AI, Cloud & Emerging Tech',
    short: 'Running many isolated environments on one physical machine, at two different weights.',
    explain: [
      'A hypervisor creates virtual machines. Type 1 (bare-metal: ESXi, Hyper-V) runs directly on hardware; Type 2 (hosted: VirtualBox) runs on top of an OS.',
      'Each VM contains a full guest operating system, which makes it heavy but strongly isolated.',
      'Containers (Docker) share the host kernel and package only the application and its dependencies. Far lighter and faster to start, with weaker isolation than a VM.',
      'Kubernetes orchestrates containers across machines — scheduling, scaling, health checking.',
    ],
    exam: 'The distinguishing line: VMs virtualise hardware and include a guest OS; containers virtualise the OS and share the host kernel. Type 1 versus Type 2 hypervisor is the other standard question.',
  },
  {
    id: 'c-iot',
    term: 'IoT',
    unit: 'AI, Cloud & Emerging Tech',
    short: 'Networked physical devices with sensors reporting data and accepting control.',
    explain: [
      'Typical architecture layers: perception (sensors and actuators), network (connectivity), processing (edge or cloud analytics), application (the user-facing service).',
      'Edge computing processes data near the device rather than shipping everything to a central server — reducing bandwidth and latency.',
      'Security is the recurring weakness: default credentials, no update mechanism, and devices deployed in physically accessible locations.',
    ],
    example: 'An ICCC is effectively a large municipal IoT deployment — cameras, sensors, VMD boards and Wi-Fi nodes reporting to a central platform. Framing it that way in the interview sounds current.',
    exam: 'Common IoT protocols: MQTT (lightweight publish-subscribe) and CoAP. Edge computing\'s purpose is latency and bandwidth reduction.',
  },
  {
    id: 'c-blockchain',
    term: 'Blockchain',
    unit: 'AI, Cloud & Emerging Tech',
    short: 'A distributed, append-only ledger secured by cryptographic linking and consensus.',
    explain: [
      'Each block contains transactions plus the hash of the previous block, so altering any earlier block invalidates every block after it.',
      'Consensus mechanisms decide which version of the chain is authoritative: Proof of Work (computational effort), Proof of Stake (economic stake).',
      'Permissionless chains are open to anyone; permissioned chains restrict participation, which is what government and enterprise use.',
      'Smart contracts are programs that execute automatically when conditions are met.',
    ],
    example: 'Land records are the most-discussed government blockchain use case in India precisely because tamper-evidence matters for title. Worth knowing given your DILRMP background — though be honest that adoption remains limited and pilot-stage.',
    exam: 'Immutability comes from hash chaining, not from encryption. Blockchain is not inherently a database replacement.',
  },

  // ==================================================================
  // GIS & SPATIAL DATA  (his domain — and the MUDAL bridge)
  // ==================================================================
  {
    id: 'c-gis-basics',
    term: 'What GIS actually is',
    unit: 'GIS & Spatial Data',
    short: 'A system for capturing, storing, analysing and displaying data tied to locations.',
    explain: [
      'A GIS combines spatial data (where something is) with attribute data (what it is) so both can be queried together.',
      'Five components usually cited: hardware, software, data, people, and methods.',
      'Its distinctive power is spatial analysis — proximity, overlay, containment — which ordinary databases cannot do natively.',
      'Data is organised in layers, each representing one theme (roads, parcels, water lines), overlaid on a common coordinate framework.',
    ],
    example: 'This is your own working domain from DILRMP, and it is the single strongest bridge to MUDAL — AMRUT\'s GIS-based Master Plan sub-scheme requires exactly this capability for urban land use.',
    exam: 'Spatial data answers "where"; attribute data answers "what". The layer model is the core organising idea.',
  },
  {
    id: 'c-vector-raster',
    term: 'Vector vs raster data',
    unit: 'GIS & Spatial Data',
    short: 'Discrete features as points, lines and polygons, versus a continuous grid of cells.',
    explain: [
      'Vector represents discrete objects: points (a streetlight, a borewell), lines (roads, pipelines), polygons (land parcels, ward boundaries). Precise, scalable, and efficient for features with clear edges.',
      'Raster represents a continuous surface as a grid of cells, each with a value: satellite imagery, elevation models, rainfall surfaces. Resolution is the cell size.',
      'Use vector for cadastral parcels and infrastructure; raster for imagery, terrain and continuous phenomena.',
    ],
    example: 'Land parcels in your DILRMP work are vector polygons; a satellite base image under them is raster. Most real GIS work combines both.',
    exam: 'Vector scales without quality loss; raster becomes blocky when magnified beyond its resolution. Topology (adjacency, connectivity) is a vector concept.',
  },
  {
    id: 'c-georeferencing',
    term: 'Georeferencing, projections and coordinate systems',
    unit: 'GIS & Spatial Data',
    short: 'Tying data to real-world locations, and the unavoidable distortion of flattening a globe.',
    explain: [
      'Georeferencing assigns real-world coordinates to an image or scanned map, so a scanned cadastral sheet can align with live spatial data.',
      'A geographic coordinate system uses latitude and longitude on a model of the earth (a datum, e.g. WGS84).',
      'A projected coordinate system flattens that onto a plane for measurement in metres — UTM is the common example.',
      'Every projection distorts something: area, shape, distance or direction. You choose the projection that preserves what your analysis needs.',
    ],
    example: 'Georeferencing scanned historical land documents is exactly the class of work you did — and the same technique applies to old urban building-permission maps at UD&PA.',
    exam: 'A datum defines the earth model; a projection defines the flattening. WGS84 is the GPS datum. No projection preserves all properties at once.',
  },
  {
    id: 'c-spatial-analysis',
    term: 'Core spatial analysis operations',
    unit: 'GIS & Spatial Data',
    short: 'Buffer, overlay, spatial join and network analysis — what GIS does that a spreadsheet cannot.',
    explain: [
      'Buffer — generate a zone of a given distance around a feature. Used for setback rules, service radii, and impact zones.',
      'Overlay — combine layers to find intersections, unions or differences. This is how you answer "which parcels fall inside the proposed road alignment?"',
      'Spatial join — attach attributes from one layer to another based on location rather than a shared key.',
      'Network analysis — shortest path, service area and routing along a connected network.',
      'Geocoding — converting an address into coordinates.',
    ],
    example: 'A concrete MUDAL-relevant example worth having ready: buffer the ICCC camera locations, overlay with ward boundaries, and you have a coverage-gap map for planning the next phase.',
    exam: 'Buffer is proximity; overlay is combination. Know that overlay operations mirror set operations — intersect, union, difference.',
  },
  {
    id: 'c-gis-governance',
    term: 'GIS in urban governance',
    unit: 'GIS & Spatial Data',
    short: 'Where spatial data actually earns its keep in a municipal or state urban body.',
    explain: [
      'Master plan preparation and land-use zoning — the AMRUT GIS sub-scheme exists specifically for this.',
      'Property tax base mapping — linking parcels and buildings to tax records to find unassessed or under-assessed properties. This is where land records and municipal revenue genuinely meet.',
      'Utility asset management — water lines, drains, streetlights, with maintenance history attached to each asset.',
      'Building permission and development control — checking applications against zoning and setback rules spatially.',
      'Disaster and slope management — particularly relevant in Aizawl, where landslide-prone slopes are a real planning constraint.',
    ],
    example: 'If asked what you would build for MUDAL, a defensible answer is a unified urban asset GIS — every ICCC camera, Wi-Fi node, VMD board and Smart City asset as a mapped, attributed feature with its AMC status attached. That merges your GIS background with the asset-register problem MUDAL actually has.',
    exam: 'Know that TCPO is the nodal body for the AMRUT GIS master plan sub-scheme, and that NRSC was contracted for geospatial database creation.',
  },
];

export const totalConcepts = concepts.length;
