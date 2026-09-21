// ============================================
// INTERVIEW PREP — MUDAL System Manager
//
// Personal interview-prep content: likely questions grouped by theme,
// each with the key talking points to hit (not full scripted answers —
// the point is to walk in prepared, not recite). Content reflects the
// real July 2026 advertisement, the official syllabus (Technical Paper
// I & II), and the candidate's actual background (DILRMP, Shiksha,
// India Study Map, MPSC Question Bank) so the "points" are genuinely
// personal, not generic.
//
// Static reference data — no backend, no persistence needed for the
// content itself. The page persists "reviewed" checkmarks locally.
// ============================================

export interface InterviewQuestion {
  id: string;
  q: string;
  points: string[];
}

export interface InterviewCategory {
  id: string;
  title: string;
  glyph: string;
  blurb: string;
  questions: InterviewQuestion[];
}

export const interviewCategories: InterviewCategory[] = [
  {
    id: 'about-you',
    title: 'About You & Your Background',
    glyph: '🙋',
    blurb: 'The questions that open every interview — make them count.',
    questions: [
      {
        id: 'tell-us-about-yourself',
        q: 'Tell us about yourself.',
        points: [
          'B.E. Computer Science & Engineering, Jorhat Engineering College (Dibrugarh University).',
          'Programmer, Directorate of Land Revenue & Settlement (DILRMP), Aug 2023 – [confirm exact end date] — land record digitization, GIS, database unification, office network.',
          '⚠️ Confirm before the interview: exact DILRMP end date and CMES join date — get these consistent so you don\'t contradict yourself if asked.',
          'Currently Programmer & Team Leader at CMES, working on the Shiksha (shikshacom.com) LMS platform — full-stack ed-tech platform.',
          'Independently built two personal projects: India Study Map and an MPSC Question Bank pipeline.',
          'Applying for System Manager because the role combines exactly what you already do: systems, data, and leading a small technical team.',
        ],
      },
      {
        id: 'employer-cmes',
        q: 'Who do you actually work for — what is CM Engineering & Solution?',
        points: [
          'Registered name: CM Engineering & Solution — note the ampersand, and "Solution" is singular, not "Solutions". Confirmed identically across two independent trade directories, so use this exact form on the CV and say it this way.',
          'Line of business: consultancy for civil engineering and architecture — architectural drawing, architectural engineering, architecture planning, engineering drawings. Confirmed by both sources, and consistent with your "mostly civil work" description.',
          'Mr. Dhananjay Kumar is named as the principal/contact in both listings.',
          '⚠️ The two listings disagree on location: one shows Aizawl, Mizoram with GSTIN 15AAGFC0655D1ZY (15 = Mizoram state code, and the "F" in the PAN segment indicates a partnership firm); the other shows a Gurugram, Haryana address and an establishment year of 2014. Most likely a Haryana-based firm with a Mizoram GST registration — which fits your remote arrangement — but do not guess in the room.',
          '⚠️ Before the interview, read your own offer letter and experience certificate and settle: the registered office address, and whether the firm is a partnership or proprietorship. "Where is your company based?" is an easy question to be caught out on.',
          'You work in its IT division, which the firm established as a new branch, and you lead its software team. The division\'s main product is the Shiksha (shikshacom.com) learning platform. The role is remote.',
          'Lead with the plain description, not the acronym: "It is an engineering firm in Aizawl, mostly civil and architectural work. I am in the IT branch they set up, leading the software team."',
          '⚠️ It has no company website, but it is verifiable — a GST-verified IndiaMART listing exists. Still carry your offer letter, experience certificate and salary slips to Document Screening, and confirm the name on your certificate matches the registered form.',
          '⚠️ The IndiaMART listing names Dhananjay Kumar as the contact. Confirm who your actual employer-of-record signatory is before the interview — it is a partnership, so there may be several partners.',
          'Strongest point to make: you are currently the IT function inside a civil-engineering organisation. That is precisely the position a System Manager holds at MUDAL — see the dedicated question on this.',
        ],
      },
      {
        id: 'civil-org-it-parallel',
        q: 'What makes you suited to being the only IT person in an engineering organisation?',
        points: [
          'This is your single best structural argument, so make it deliberately. MUDAL advertised 12 posts: 2 Assistant Engineers (Civil), 4 Junior Engineers (Civil), 1 System Analyst, 1 System Manager, 4 MTS. It is a civil-engineering organisation with a small IT function.',
          'That is exactly your current situation: CMES is mostly civil work, and you run the IT division they established.',
          'You have already done the hard part once — setting up a technical function from scratch inside an organisation whose core business is not software: no inherited process, no existing standards, no documentation.',
          'It also means you are used to explaining technical work to non-technical colleagues, which is the daily reality of the MUDAL post and is itself a scored syllabus unit (Business Communication).',
        ],
      },
      {
        id: 'why-mudal',
        q: 'Why do you want to work at MUDAL specifically?',
        points: [
          'Genuine interest in urban e-governance — you already worked inside a similar national mission (DILRMP).',
          'You built a dedicated 843-question System Manager exam-prep module in your own app before even sitting the exam — say this plainly, it is your strongest single line.',
          'You see the ASCL→MUDAL transition as directly analogous to the database-consolidation work you already did at DILRMP.',
        ],
      },
      {
        id: 'why-system-manager-not-analyst',
        q: 'Your B.E. in Computer Science actually qualifies you for System Analyst, which pays more. Why apply for System Manager?',
        points: [
          "Be honest, not defensive: you applied broadly and this process is the one you're in.",
          "System Manager's scope — systems, infrastructure, and a small team — matches your Team Leader experience at Shiksha more directly than a pure analyst role would.",
          "Don't over-apologize for being over-qualified on paper; frame it as bringing more than the minimum bar.",
        ],
      },
      {
        id: 'dilrmp-walkthrough',
        q: 'Walk me through your work at the Directorate of Land Revenue & Settlement.',
        points: [
          'DILRMP = Digital India Land Records Modernization Programme — a central e-governance mission, same category of work as MUDAL.',
          'Digitized paper land records into structured digital data.',
          'Handled GIS and spatial database management for land-parcel mapping.',
          'Refactored and unified previously fragmented per-district/locality databases into one consolidated schema.',
          'Administered the directorate\'s office network.',
        ],
      },
      {
        id: 'team-leader-meaning',
        q: 'What does "Team Leader" actually mean in your current role — what do you personally decide or own?',
        points: [
          'Lead a team of ~6 engineers building Shiksha, a live production ed-tech platform.',
          'Personally authored a full platform audit and a 6-workstream delivery plan (backend, realtime, frontend, platform/design, integrations, QA/DevOps).',
          'Own the admin control plane, payment integration decisions, and real-time infrastructure choices (WebSockets, Celery).',
          'You write things down — the audit and delivery plan are real governance artifacts, not just code.',
        ],
      },
      {
        id: 'mistake-or-bug',
        q: 'Tell us about a mistake, bug, or failure you found and had to fix.',
        points: [
          'India Study Map: an OCR pipeline silently dropped ~280 questions with no numbering gap to reveal it — found by checking the pipeline\'s own output against source, not trusting it.',
          'Shiksha: an identity-isolation bug where the dashboard guessed "student vs teacher" from data shape instead of reading the JWT\'s actual claims — on a one-email-many-profiles account this was wrong in multiple ways (siblings saw each other\'s payment UTR numbers, notifications leaked across identities).',
          'The lesson to state explicitly: trace symptoms back to root cause (the JWT already carried the truth; the view just never read it) rather than patching around the visible symptom.',
        ],
      },
      {
        id: 'why-left-government',
        q: 'You left government service for the private sector. Why do you want to come back?',
        points: [
          'Your real situation: after DILRMP you took a remote role at CMES at the same pay, which kept you technically employed while you continued preparing for government service. That is honest and defensible — but the framing matters enormously.',
          '⚠️ The trap: do NOT say "I took this job because it let me prepare for exams." The panel hears "this candidate treats employment as a waiting room," and will assume MUDAL would be treated the same way.',
          'The correct framing is continuity of intent, not a gap to excuse: you have been consistently working toward public service, and the interim role kept your skills current rather than idle. Sustained preparation is evidence of commitment, not of drifting.',
          'Then pivot immediately to what the interim period gave you that a government post would not have at this stage: building an IT function from scratch, leading a six-person team, and owning a production system end to end. You are bringing that back, not starting over.',
          'Close by defusing the unspoken fear before they voice it: name what specifically holds you here — public infrastructure serving Aizawl, a system you would own long-term, work that continues past a single project cycle.',
          'Never criticise CMES, and never make the answer primarily about pay or stability — that invites "so you would leave for more pay elsewhere?"',
        ],
      },
      {
        id: 'five-years',
        q: 'Where do you see yourself in five years?',
        points: [
          'Growing into broader IT/e-governance leadership within MUDAL or UD&PA.',
          'Contributing to how the state sustains and expands digital infrastructure once mission-based central funding (like the closed Smart Cities Mission) is no longer the default.',
        ],
      },
    ],
  },

  {
    id: 'ask-them',
    title: 'Questions You Ask Them',
    glyph: '❓',
    blurb: 'Every interview ends with this. Most candidates waste it — you should not.',
    questions: [
      {
        id: 'ask-handover-state',
        q: '"What stage is the handover from Aizawl Smart City Ltd. currently at?"',
        points: [
          'Strongest question you can ask — it proves you understand MUDAL is a transition, not a settled organisation.',
          'Whatever they answer tells you what your first six months actually look like.',
          'Natural follow-up if invited: whether systems documentation and vendor contracts came across with the assets.',
        ],
      },
      {
        id: 'ask-iccc-ownership',
        q: '"Does the System Manager own the ICCC vendor and AMC relationship, or does that sit with the engineering wing?"',
        points: [
          'Shows you have thought about where the role\'s authority actually begins and ends.',
          'Also a polite way of finding out whether this post is strategic or purely operational.',
        ],
      },
      {
        id: 'ask-team-size',
        q: '"Is there an existing IT team, or would this be a single-person function to start with?"',
        points: [
          'Only 12 posts were advertised and just one System Manager, so this is a fair and informed question.',
          'If it is a single-person function, that is worth knowing — and worth saying you are comfortable with, given you already run systems end to end.',
        ],
      },
      {
        id: 'ask-first-year',
        q: '"What would success in this post look like at the end of the first year?"',
        points: [
          'Invites them to state their actual priorities, which is useful to you and flattering to them.',
          'Listen carefully — their answer is the brief you would be measured against.',
        ],
      },
      {
        id: 'ask-coordination',
        q: '"How does MUDAL coordinate with AMC and the Police on ICCC operations day to day?"',
        points: [
          'Signals that you see the ICCC as a multi-agency system, not just a technical installation.',
          'Use this one only if the ICCC has already come up — otherwise it can read as presumptuous about your posting.',
        ],
      },
      {
        id: 'ask-avoid',
        q: 'What NOT to ask in the first interview',
        points: [
          'Salary — it is fixed at ₹50,000/month in the advertisement. Asking suggests you did not read it.',
          'Leave, working hours, or transfer policy. Legitimate concerns, wrong moment.',
          '"What does MUDAL do?" — anything you could have found in the advertisement or on the department website.',
          'Never say "no, I have no questions." It reads as disinterest. Have two ready and ask at least one.',
        ],
      },
    ],
  },

  {
    id: 'mudal-udpa',
    title: 'MUDAL & UD&PA — Organisation',
    glyph: '🏛️',
    blurb: 'What the organisation is, why it exists now, and what it runs.',
    questions: [
      {
        id: 'what-is-mudal',
        q: 'What is MUDAL and why was it formed?',
        points: [
          'Mizoram Urban Development Agency Limited — a PSU (Government of Mizoram company) under UD&PA.',
          'Formed mid-2026, after the central Smart Cities Mission closed on 31 March 2025.',
          'Absorbs the assets, projects, and mandate of Aizawl Smart City Limited (ASCL), which no longer has a central funding source.',
          "It's UD&PA's implementing agency for Aizawl's Smart City legacy and future urban-development work.",
        ],
      },
      {
        id: 'what-is-udpa',
        q: "What is UD&PA's mandate?",
        points: [
          'Urban Development & Poverty Alleviation Department, Government of Mizoram — established 24 August 2006.',
          'Covers 28 towns across Mizoram; runs urban development, poverty alleviation, sanitation, and town & country planning.',
          'Implements AMRUT/AMRUT 2.0, PMAY-U, SBM-U, DAY-NULM, and Town & Country Planning.',
          'Structure: Directorate → TCP wing → Senior Sanitation Office → 9 District Urban Development Offices (DUDOs).',
        ],
      },
      {
        id: 'what-was-ascl',
        q: 'What was Aizawl Smart City Limited and what happened to it?',
        points: [
          "The SPV (Special Purpose Vehicle) that ran Aizawl's Smart Cities Mission projects — Aizawl was Mizoram's only Smart City.",
          '~43 projects; slower-than-planned completion (only 3 of 43 functional as of mid-2023, more finished by 2025).',
          'Wound up / absorbed once Smart Cities Mission funding closed — MUDAL is effectively its successor.',
        ],
      },
      {
        id: 'iccc-details',
        q: "Describe the Aizawl ICCC — what is it and what does it do?",
        points: [
          'Integrated Command & Control Centre — Aizawl\'s flagship Smart City asset. ₹87.18 crore project cost.',
          '237 fixed CCTV cameras + 39 PTZ cameras across 76 locations.',
          'Facial recognition at 5 critical locations; ANPR (Automatic Number Plate Recognition) for traffic.',
          'Variable Message Displays at 5 locations; free public Wi-Fi at 15 locations.',
          'Footage retained ~30 days, key data archived longer.',
          'Inaugurated 1 April 2023 by Union Home Minister Amit Shah.',
        ],
      },
      {
        id: 'sustaining-iccc',
        q: 'How would MUDAL sustain the ICCC now that Smart Cities Mission funding has ended?',
        points: [
          'Converge with AMRUT 2.0 or state budget lines rather than relying on a mission that no longer exists.',
          'Revenue from ANPR-based e-challans, shared with Police/Transport.',
          'CSR contributions — Toyota already donated CCTV equipment once.',
          'VMD advertising space; re-negotiated, SLA-linked AMC contracts instead of blanket renewals.',
          'Honest rationalization: not every camera/feature needs the same priority — triage by what\'s actually used.',
        ],
      },
      {
        id: 'other-schemes',
        q: 'What schemes does UD&PA implement besides Smart City?',
        points: [
          'AMRUT / AMRUT 2.0 — water supply, sewerage, urban infrastructure.',
          'PMAY-U — Pradhan Mantri Awas Yojana (Urban), housing.',
          'SBM-U — Swachh Bharat Mission (Urban), sanitation.',
          'DAY-NULM — urban poverty/livelihoods.',
          'Town & Country Planning — urban land-use planning.',
        ],
      },
      {
        id: 'biggest-challenge',
        q: "What's the biggest challenge MUDAL faces right now?",
        points: [
          "It's only a few months old — this is a transition, not a settled organisation.",
          'No dedicated new central funding pipeline post-Smart-Cities-Mission — the real work is establishing a sustainable operating model for assets already built.',
          "Migrating/consolidating ASCL's legacy systems, contracts, and data into MUDAL cleanly.",
          "Answering this honestly (rather than reciting achievements) signals maturity — this is your DILRMP-style consolidation problem, restated.",
        ],
      },
    ],
  },

  {
    id: 'local',
    title: 'Local & Current Affairs',
    glyph: '📍',
    blurb: 'Personal-locality facts — verify the ones flagged before the interview.',
    questions: [
      {
        id: 'cm',
        q: 'Who is the current Chief Minister of Mizoram?',
        points: ['Lalduhoma, Zoram People\'s Movement (ZPM) — in office since 8 December 2023.'],
      },
      {
        id: 'udpa-minister',
        q: 'Who is the UD&PA Minister?',
        points: ['K. Sapdanga — same cabinet, since 8 December 2023; still current.'],
      },
      {
        id: 'mla',
        q: 'Who is your MLA and which constituency do you fall under (Chanmari)?',
        points: [
          'Chanmari falls under Aizawl East–I Assembly constituency.',
          'MLA: Lalthansanga (ZPM) — won in 2023, notably defeating former CM Zoramthanga (MNF) by a 2,101-vote margin.',
        ],
      },
      {
        id: 'ward-council',
        q: 'What is your AMC ward number and who is your Local Council President?',
        points: [
          '⚠️ Not fully confirmed from research — one source points to Ward-V for Chanmari, but this needs your own verification before the interview.',
          'Confirm at amcmizoram.com/page/list-of-councillors, or ask directly at your Local Council office.',
          "Don't guess in the room — if unconfirmed, it's better to know it cold than to say the wrong name.",
        ],
      },
      {
        id: 'recent-initiative',
        q: 'Name a recent UD&PA / MUDAL initiative in Aizawl.',
        points: [
          '"Catch the Rain 2026" — a Jal Samvad grassroots water-conservation outreach across 10 locations in Aizawl City, run with AMC.',
        ],
      },
    ],
  },

  {
    id: 'fundamentals',
    title: 'Technical — Computer Fundamentals & OS',
    glyph: '💻',
    blurb: 'Syllabus Paper I, Units I–II. Likely rote-memorization MCQ territory — revise deliberately.',
    questions: [
      { id: 'ram-rom', q: 'Difference between RAM and ROM.', points: ['RAM: volatile, read/write, working memory.', 'ROM: non-volatile, mostly read-only, firmware/boot instructions.'] },
      { id: 'boot-process', q: 'Explain the boot process (BIOS/UEFI).', points: ['Power-on self test (POST) → firmware (BIOS/UEFI) locates boot device → bootloader loads OS kernel → OS initializes.', 'UEFI is the modern replacement for BIOS — faster, supports larger disks, secure boot.'] },
      { id: 'sys-vs-app-software', q: 'Difference between system software and application software.', points: ['System software (OS, drivers, firmware) manages hardware and provides a platform.', 'Application software (Word, browsers, Shiksha itself) performs user-facing tasks on top of that platform.'] },
      { id: 'generations', q: 'What are the generations of computers?', points: ['1st: vacuum tubes. 2nd: transistors. 3rd: integrated circuits. 4th: microprocessors. 5th: AI/parallel processing (current).'] },
      { id: 'process-vs-thread', q: 'Difference between a process and a thread.', points: ['Process: independent execution unit with its own memory space.', 'Thread: lightweight unit within a process, shares memory with sibling threads — e.g. how Django Channels handles concurrent WebSocket connections.'] },
      { id: 'virtual-memory', q: 'What is virtual memory?', points: ['Abstraction that lets the OS use disk space as an extension of RAM, via paging — lets programs use more memory than physically installed.'] },
      { id: 'linux-commands', q: 'What Linux commands do you use day to day, and for what?', points: ['ls/cd/grep for navigation and search, chmod/chown for permissions, systemctl for services, journalctl/tail for logs — tie directly to your own Linux system administration experience (Shiksha runs on Gunicorn/Daphne behind Nginx on Linux).'] },
      { id: 'digital-india-example', q: 'What is Digital India / e-governance? Give a real example.', points: ['Digital India: national programme to deliver government services digitally.', "You have a direct example, not a textbook one: DILRMP itself is a Digital India e-governance mission you worked inside."] },
    ],
  },

  {
    id: 'office',
    title: 'Technical — MS Office',
    glyph: '📊',
    blurb: 'Syllabus Paper I, Units III–V. Easy marks if revised, easy losses if skipped.',
    questions: [
      { id: 'mail-merge', q: 'How do you do a Mail Merge in MS Word?', points: ['Word\'s Mailings tab → Start Mail Merge → select a data source (e.g. Excel list) → insert merge fields → Finish & Merge to generate personalized letters/labels.'] },
      { id: 'vlookup-index-match', q: 'VLOOKUP vs INDEX-MATCH in Excel — what\'s the difference?', points: ['VLOOKUP searches a column left-to-right, breaks if columns are inserted/reordered.', 'INDEX-MATCH is more flexible — can look left, and is more resilient to structural changes.'] },
      { id: 'pivot-table', q: 'What is a Pivot Table used for?', points: ['Summarizing, grouping, and cross-tabulating large datasets interactively — e.g. total by category by month — without writing formulas.'] },
      { id: 'slide-master', q: 'What is Slide Master in PowerPoint?', points: ['A template layout that controls fonts, colors, and placeholders across every slide — edit once, applies everywhere.'] },
      { id: 'absolute-vs-relative', q: 'Absolute vs relative cell reference in Excel?', points: ['Relative (A1) shifts when copied to another cell.', 'Absolute ($A$1) stays fixed — useful for a constant like a tax rate referenced across many rows.'] },
    ],
  },

  {
    id: 'networking',
    title: 'Technical — Networking',
    glyph: '🌐',
    blurb: 'Syllabus Paper II, Unit I. A flagged weak spot — revise deliberately if your background is mostly Linux/cloud, not enterprise Windows networking.',
    questions: [
      { id: 'osi-model', q: 'Explain the OSI model\'s 7 layers.', points: ['Physical, Data Link, Network, Transport, Session, Presentation, Application (bottom to top). Mnemonic: "Please Do Not Throw Sausage Pizza Away."'] },
      { id: 'tcp-vs-udp', q: 'Difference between TCP and UDP.', points: ['TCP: connection-oriented, reliable, ordered (used for HTTP APIs).', 'UDP: connectionless, faster, no delivery guarantee (used for live video/voice where latency matters more than a dropped packet).'] },
      { id: 'subnetting', q: 'What is subnetting? Explain with an example.', points: ['Dividing a network into smaller sub-networks using a subnet mask.', 'Example: 192.168.1.0/24 gives 256 addresses (254 usable) on one subnet.'] },
      { id: 'dns-dhcp-nat-vpn', q: 'What do DNS, DHCP, NAT, and VPN each do?', points: ['DNS: translates domain names to IP addresses.', 'DHCP: automatically assigns IP addresses to devices on a network.', 'NAT: translates private IPs to a public IP for internet access.', 'VPN: creates an encrypted tunnel over a public network for secure remote access.'] },
      { id: 'switch-router-gateway', q: 'Difference between a switch, router, and gateway.', points: ['Switch: connects devices within one LAN, forwards by MAC address.', 'Router: connects different networks, forwards by IP address.', 'Gateway: connects networks using different protocols (e.g. LAN to internet).'] },
      { id: 'ad-gpo', q: 'What is Active Directory and Group Policy used for?', points: ['AD: centralized directory service for managing users, computers, and permissions on a Windows network.', 'Group Policy: enforces settings (security, software, restrictions) across all AD-joined machines from one place.'] },
      { id: 'troubleshoot-outage', q: 'How would you troubleshoot a network outage in an office?', points: ['Check physical layer first (cables, power, switch lights).', 'Ping the gateway, then an external address, to isolate LAN vs ISP issue.', 'Check DHCP/DNS are responding.', 'Isolate whether it\'s one switch/segment or the whole office.', 'Tie this to your real DILRMP office-network administration experience.'] },
    ],
  },

  {
    id: 'dbms',
    title: 'Technical — DBMS',
    glyph: '🗄️',
    blurb: 'Syllabus Paper II, Unit II. Your strongest technical unit — light revision.',
    questions: [
      { id: 'ddl-dml-dcl-tcl', q: 'Difference between DDL, DML, DCL, and TCL.', points: ['DDL: defines structure (CREATE, ALTER, DROP).', 'DML: manipulates data (SELECT, INSERT, UPDATE, DELETE).', 'DCL: controls access (GRANT, REVOKE).', 'TCL: manages transactions (COMMIT, ROLLBACK, SAVEPOINT).'] },
      { id: 'normalization', q: 'What is normalization? Explain 1NF/2NF/3NF.', points: ['Organizing data to reduce redundancy and avoid update anomalies.', '1NF: atomic values, no repeating groups.', '2NF: 1NF + no partial dependency on part of a composite key.', '3NF: 2NF + no transitive dependency on non-key columns.'] },
      { id: 'index', q: 'What is an index and why does it speed up queries?', points: ['A separate data structure (usually a B-tree) that lets the database find rows without scanning the whole table — trade-off is extra write cost and storage.'] },
      { id: 'stored-proc-vs-trigger', q: 'Difference between a stored procedure and a trigger.', points: ['Stored procedure: explicitly called by the application/user.', 'Trigger: automatically fires on an event (INSERT/UPDATE/DELETE) on a table.'] },
      { id: 'acid', q: 'What is a transaction, and what does ACID mean?', points: ['Atomicity: all-or-nothing.', 'Consistency: valid state before and after.', 'Isolation: concurrent transactions don\'t interfere.', 'Durability: once committed, survives a crash.'] },
      { id: 'sql-vs-nosql', q: 'SQL vs NoSQL — when would you use each?', points: ['SQL (PostgreSQL, MySQL): structured, relational, strong consistency — used for Shiksha\'s core data.', 'NoSQL: flexible schema, horizontal scale — better for unstructured or high-write-volume data.'] },
      { id: 'real-consolidation', q: 'Tell us about a real database consolidation you have done.', points: [
        'DILRMP: unified fragmented per-district/locality land-record databases into one consolidated schema — directly relevant to MUDAL absorbing ASCL\'s systems.',
        'MPSC Question Bank: consolidated 3,715 OCR\'d exam papers into a single PostgreSQL-backed bank of 77,751 questions, with deduplication and answer-verification tooling — and you tracked data-quality gaps honestly rather than claiming false completeness.',
      ] },
    ],
  },

  {
    id: 'webtech',
    title: 'Technical — Web Technologies',
    glyph: '🕸️',
    blurb: 'Syllabus Paper II, Unit III. Directly your stack — light revision.',
    questions: [
      { id: 'rest-api', q: 'What is a REST API and what are its principles?', points: ['Stateless, resource-based (URLs represent resources), uses standard HTTP verbs (GET/POST/PUT/DELETE) — exactly how Shiksha\'s Django REST Framework backend is structured.'] },
      { id: 'get-vs-post', q: 'Difference between GET and POST.', points: ['GET: retrieves data, parameters in URL, cacheable, no side effects intended.', 'POST: sends data to create/modify a resource, body-based, not cached.'] },
      { id: 'json-vs-xml', q: 'What is JSON and why is it preferred over XML?', points: ['Lightweight, human-readable key-value format; less verbose than XML, native to JavaScript, faster to parse.'] },
      { id: 'jwt-auth', q: 'What is JWT and how does authentication work with it?', points: [
        'JSON Web Token — a signed token carrying claims (user identity, roles) that the server can verify without a database lookup on every request.',
        'Your own real implementation: Shiksha stores JWTs in httpOnly cookies (access/refresh), shared across four subdomains (www/app/teacher/admin.shikshacom.com) for single sign-on.',
      ] },
      { id: 'websocket-vs-http', q: 'What is a WebSocket and how is it different from HTTP?', points: ['HTTP: request-response, connection closes after each exchange.', 'WebSocket: persistent, full-duplex connection — used in Shiksha for real-time chat and notifications via Django Channels + Redis.'] },
      { id: 'pwa', q: 'What is a Progressive Web App (PWA)?', points: ['A web app that behaves like a native app — installable, works offline via service workers, push notifications.'] },
    ],
  },

  {
    id: 'cybersecurity-ai',
    title: 'Technical — Cyber Security & AI',
    glyph: '🔐',
    blurb: 'Syllabus Paper II, Unit IV. Directly relevant to the ICCC\'s facial recognition capability.',
    questions: [
      { id: 'mfa', q: 'What is Multi-Factor Authentication and why does it matter?', points: ['Requires two or more independent proofs of identity (password + OTP/biometric) — reduces risk from a single compromised credential.'] },
      { id: 'encryption-vs-hashing', q: 'Difference between encryption and hashing.', points: ['Encryption: reversible, used to protect data in transit/storage (needs a key to decrypt).', 'Hashing: one-way, used for integrity checks and password storage (never decrypted, only compared).'] },
      { id: 'firewall', q: 'What is a firewall and how does it protect a network?', points: ['Filters incoming/outgoing traffic based on rules — blocks unauthorized access while allowing legitimate traffic.'] },
      { id: 'dpdp-act', q: 'What is the Digital Personal Data Protection (DPDP) Act, 2023?', points: [
        "India's current data-privacy law — governs consent, purpose limitation, and data-subject rights.",
        'Directly relevant to you: the Aizawl ICCC runs facial recognition at 5 locations — expect a question on who can access that footage and under what authority.',
      ] },
      { id: 'patch-management', q: 'What is patch management and why does it matter for a system like the ICCC?', points: ['Systematically applying security updates to close known vulnerabilities before they\'re exploited — critical for internet-facing camera/NVR systems, a common attack target.'] },
      { id: 'llm-genai', q: 'What is an LLM / Generative AI — have you used it in your own work?', points: [
        'Large Language Model: trained on text to generate/understand language; GenAI more broadly includes image/code generation.',
        'Honest, real answer: you use AI-assisted development daily, and your India Study Map project literally integrates Google\'s Generative AI and Groq APIs in its own content pipelines.',
      ] },
      { id: 'ai-ml-dl', q: 'Difference between AI, ML, and Deep Learning?', points: ['AI: the broad goal of machines performing intelligent tasks.', 'ML: a subset — systems that learn patterns from data.', 'Deep Learning: a subset of ML using multi-layer neural networks.'] },
    ],
  },

  {
    id: 'governance',
    title: 'Technical — IT Governance & Communication',
    glyph: '📋',
    blurb: 'Syllabus Paper II, Unit V. You have real artifacts to point to here — use them.',
    questions: [
      { id: 'itil-itsm', q: 'What is ITIL / ITSM?', points: ['ITSM: the practice of managing IT as a service to the business/organisation.', 'ITIL: the most widely used framework for ITSM — covers incident, problem, and change management.'] },
      { id: 'sla', q: 'What is an SLA and why does it matter for vendor AMC contracts?', points: ['Service Level Agreement — defines measurable commitments (uptime %, response time) a vendor must meet.', 'For MUDAL\'s ICCC vendors, this is the lever for holding an AMC accountable rather than just paying and hoping.'] },
      { id: 'bcp-vs-drp', q: 'Difference between Business Continuity Planning and Disaster Recovery Planning.', points: ['BCP: how the organisation keeps operating during a disruption.', 'DRP: the specific technical plan to restore IT systems after a disaster — a subset of BCP.'] },
      { id: 'documentation', q: 'How would you document a new IT system for handover to a successor?', points: [
        'Architecture overview, data flow, dependencies, known issues, and a runbook for common operational tasks.',
        'You have a real example: your Shiksha platform audit and 6-workstream delivery plan is exactly this kind of governance artifact, written from scratch.',
      ] },
      { id: 'procurement-priority', q: 'How do you prioritize IT asset procurement on a limited government budget?', points: ['Rank by risk (what fails first, what\'s a security exposure) and by what blocks core service delivery — not by what\'s newest or cheapest.'] },
      { id: 'leading-team', q: 'Describe your approach to leading a technical team.', points: [
        'Structure work into clear workstreams so priorities are visible — you did this concretely for a 6-engineer team at Shiksha.',
        'Track data-quality/progress honestly (confidence ratings, known gaps) rather than presenting things as more finished than they are — your MPSC Question Bank\'s verification-completion tracking is a real example of this instinct.',
      ] },
    ],
  },

  {
    id: 'scenario',
    title: 'Scenario / Situational',
    glyph: '🎯',
    blurb: 'How you\'d actually handle it — tie every answer back to something you\'ve genuinely done.',
    questions: [
      { id: 'iccc-outage', q: "The ICCC's camera network goes down city-wide at 2 AM. What do you do?", points: [
        'Triage by layer: power → network → software, in that order.',
        'Escalate per the vendor SLA if it\'s hardware/vendor-side.',
        'Prioritize restoring the highest-priority feeds first (police/traffic) rather than treating all 276 cameras equally.',
        'Document root cause afterward, don\'t just restart-and-forget.',
      ] },
      { id: 'amc-renewal', q: "A vendor's AMC is expiring and their renewal quote has doubled. How do you respond?", points: [
        'Benchmark against current market/tender rates before accepting or rejecting.',
        'Loop in procurement rather than deciding unilaterally.',
        'Consider whether some scope can be brought in-house.',
        'Push for SLA-linked pricing rather than a flat renewal.',
      ] },
      { id: 'unauthorized-facial-access', q: 'You discover facial recognition footage was accessed without proper authorization. What do you do?', points: [
        'Treat it as a governance incident, not a technical glitch — check access logs immediately.',
        'Escalate per whatever data-access policy exists (DPDP Act awareness matters here).',
        "Don't quietly patch access controls and move on — document and report through the proper chain.",
      ] },
      { id: 'zero-downtime-migration', q: "You're asked to migrate ASCL's old databases into MUDAL's new system with zero downtime. How do you approach it?", points: [
        'This is literally your DILRMP playbook, restated: audit the existing schema first, dry-run the migration against a copy, reconcile record counts before and after.',
        'Cut over in a planned maintenance window with a tested rollback plan — don\'t migrate live production data without one.',
      ] },
      { id: 'junior-data-leak', q: "A junior team member's code introduces a data leak between two users. How do you handle it?", points: [
        'Trace the root cause properly rather than patching the symptom — this is exactly the Shiksha identity-isolation bug you already found and fixed (the fix was reading the JWT\'s actual claims, not guessing from data shape).',
        'Write up what happened and why, and add a regression test so the same class of bug can\'t silently return.',
        "Handle it as a process gap, not a chance to blame the individual."
      ] },
    ],
  },
];

export const totalInterviewQuestions = interviewCategories.reduce((n, c) => n + c.questions.length, 0);
