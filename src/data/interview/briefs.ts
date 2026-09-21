// ============================================
// INTERVIEW PREP — BRIEFS
//
// Reference dossiers to *learn from*, as opposed to questions.ts which is
// for rehearsal. Nine briefs: the self-introduction script, the three
// organisational dossiers (UD&PA / MUDAL / ICCC), the Smart Cities funding
// story that explains why MUDAL exists at all, the candidate's own three
// bodies of work (DILRMP, Shiksha/CMES, map.hawayu.in), and the
// centrepiece — the land-revenue ↔ urban-development correlation.
//
// Anything not independently verified carries an explicit ⚠️ marker in the
// text rather than being silently presented as fact. Do not remove those
// markers without actually confirming the underlying claim.
// ============================================

export interface BriefSection {
  heading: string;
  /** Optional lead paragraph for the section. */
  body?: string;
  /** Optional bullet list. */
  bullets?: string[];
}

export interface Brief {
  id: string;
  title: string;
  glyph: string;
  tagline: string;
  sections: BriefSection[];
}

export const briefs: Brief[] = [
  // ------------------------------------------------------------------
  {
    id: 'self-intro',
    title: 'Your Introduction — the script',
    glyph: '🗣️',
    tagline: 'A 60-second and a 2-minute version, plus the plain-language rules.',
    sections: [
      {
        heading: 'The 60-second version (default opening)',
        body:
          '"I am Lalhruaitluanga Sailo, from Chanmari, Aizawl. I hold a B.E. in Computer Science and Engineering from Jorhat Engineering College under Dibrugarh University. From August 2023 I worked as a Programmer at the Directorate of Land Revenue and Settlement under the DILRMP mission, where I digitised land records, managed GIS and spatial data, and consolidated separate district databases into one unified system. Since then I have been working as a Programmer and Team Leader at CMES on the Shiksha learning platform, where I lead a small engineering team on a live production system. Alongside that I build and maintain my own study platform at map.hawayu.in. I am applying for System Manager because the role brings together exactly the three things I already do — managing systems, managing data, and leading a small technical team."',
      },
      {
        heading: 'If they ask you to expand (the 2-minute version)',
        bullets: [
          'Add one concrete DILRMP detail: the old records were scattered across district offices in inconsistent formats, and you sorted and indexed scanned historical documents as part of bringing them into one system.',
          'Add one concrete Shiksha detail: live video classes, payments, real-time notifications — and that you wrote the platform audit and delivery plan the team works from.',
          'Add one line on why MUDAL specifically: it is a new agency inheriting systems from a closed mission, which is structurally the same consolidation problem you already solved once.',
          'Close by offering the technical depth rather than dumping it: "I am happy to go into the technical detail on any of that."',
        ],
      },
      {
        heading: 'Your timeline — memorise this, never contradict it',
        body:
          'Every date below should come out of your mouth identically each time it is asked, and must match your certificates. Inconsistent dates are the single easiest way to lose credibility at Document Screening.',
        bullets: [
          '2003–2015 — Kendriya Vidyalaya, Aizawl (CBSE). HSLC 2013, HSSLC 2015.',
          '2015–2019 — B.E. Computer Science & Engineering, Jorhat Engineering College, Dibrugarh University.',
          '2019 – Aug 2023 — preparing for government service. Recruitment cycles nationally were disrupted roughly 2020–2022. ⭐ If your 1-year computer diploma falls in this window, it belongs here.',
          'Aug 2023 – Aug 2025 — Programmer, Directorate of Land Revenue & Settlement, Govt. of Mizoram (DILRMP).',
          '⚠️ [confirm] 2025 – present — Programmer & Team Leader, CM Engineering & Solution, IT division (Shiksha). You have said "November"; confirm the exact month and year against your offer letter.',
          '2026 — cleared the MUDAL System Manager written examination.',
        ],
      },
      {
        heading: 'The two gaps, and the one story that covers both',
        body:
          'There are two gaps in that timeline: a four-year one (2019 to Aug 2023) and possibly a short one (Aug 2025 to your CMES start). The four-year gap is the one that will be asked.',
        bullets: [
          'Both gaps, and your reason for wanting this post, should resolve into a single consistent narrative: you have been oriented toward government service throughout, and everything in between kept your skills current rather than idle.',
          'The failure mode is telling three different stories — "I was preparing for exams" for the gap, "the contract ended" for DILRMP, and something unrelated for CMES. The panel hears inconsistency even if each answer is individually true.',
          'Your strongest corroboration is not a claim but an artefact: the MPSC Question Bank (3,715 papers, 77,751 questions) and the 843-question MUDAL module are documentary evidence of sustained, structured preparation.',
        ],
      },
      {
        heading: 'The plain-language rule',
        body:
          'Lead with what the work achieved for people, then one plain sentence on how, then stop. The panel is usually mixed — technical members plus administrative officers who will not follow acronyms, and Business Communication is itself a scored syllabus unit. Jargon-only reads as poor communication; vague-only reads as shallow. Layering demonstrates both.',
      },
      {
        heading: 'Translation table — say the left, not the right',
        bullets: [
          '"Linked land records to an actual location on a map" — not "GIS spatial database".',
          '"Combined several separate district systems into one" — not "unified schema / database consolidation".',
          '"Made two systems talk to each other automatically" — not "API integration".',
          '"Kept the login working across all four parts of the site" — not "cross-subdomain JWT cookie SSO".',
          '"Set up automatic background tasks so the site stays fast" — not "Celery and Redis async job queue".',
          '"Wrote down how the system works so someone else could take it over" — not "authored technical documentation".',
        ],
      },
      {
        heading: 'Do not over-simplify past the point of substance',
        body:
          'The plain version is your opening move, not your only move. If a technical panel member asks "what does unified system mean technically?", have the real term ready in the same breath. Being unable to produce it on request undoes the benefit.',
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: 'mock-lessons',
    title: '⭐ Mock interview — what actually went wrong',
    glyph: '🎤',
    tagline: 'Findings from a full mock panel. Read this before anything else.',
    sections: [
      {
        heading: 'The one habit that mattered most: you answer in lists, not sentences',
        body:
          'Across the mock this happened three times running. Asked how to fund the ICCC, the answer was "AMRUT 2.0 funding, ANPR e-challan revenue, and renegotiate the AMC" — three noun phrases, no explanation. The content was largely right; the delivery made it sound memorised, and the panel responded by demanding you defend one at random.',
        bullets: [
          'You know the material, so in your head the keyword contains the whole idea. The panel cannot see inside your head — they hear three terms and cannot tell understanding from memorisation.',
          'The fix is mechanical: NAME IT → THE MECHANISM IN ONE SENTENCE → ONE CONCRETE CONSEQUENCE. Three sentences per point.',
          'Worked example: "Cost rationalisation, based on the audit. Not every one of those 276 cameras carries equal operational value — some cover junctions the Police draw on constantly, others have produced nothing in two years. Once I can show which is which, the department is choosing where to spend rather than paying a flat maintenance bill for the whole estate."',
          'Same content, forty seconds instead of four. One lever explained properly beats three named.',
        ],
      },
      {
        heading: 'Second habit: you trail off mid-sentence',
        body:
          'Asked what you would do in your first month with the ICCC, the answer began "I will first identify what is the most significant part of the system, start from there and…" and faded into silence. In a real room that silence lasts a very long time and the panel simply watches you sit in it.',
        bullets: [
          'When you lose the thread, stop cleanly and restart: "Let me put that more concretely."',
          'A deliberate two-second pause reads as composure. A trailing sentence reads as uncertainty.',
          'This is pure habit and costs nothing to fix — but it is as damaging as weak content.',
        ],
      },
      {
        heading: 'What you did well',
        bullets: [
          'The System Analyst disclosure was excellent — honest, specific, and it dissolved a hostile framing completely.',
          'Your instinct on the ICCC was right: triage before action, prioritise, do not boil the ocean. Better than candidates who recite a shopping list.',
          'Second attempt at the ICCC question was a genuine step up — operational status and expiry tracking is a real System Manager answer.',
          'You dropped the AMRUT argument when challenged rather than defending it. That is exactly right.',
        ],
      },
      {
        heading: 'Precision fixes',
        bullets: [
          '"Expiring cameras" is loose — cameras do not expire. Say "AMC and warranty expiry, and hardware reaching end-of-life." Three different things with three different consequences: no support/no spares, billable repairs, and no firmware updates (a security exposure, not just maintenance).',
          'Naming a scheme without naming the mechanism invites exactly the follow-up that catches you out. If you cite a funding source, be ready to say which component pays and on what basis.',
        ],
      },
      {
        heading: 'The question you failed twice',
        body:
          '"What is it about System Manager specifically?" was asked twice and answered neither time — both answers were about jobs in general ("every new job is an opportunity to learn"). The Chairman eventually said so out loud, which in a real interview becomes a note in the file. Have the structural answer word-perfect: in a twelve-post organisation the System Manager is the entire IT function, and that matches leading a six-engineer team and building an IT department from nothing far better than a specialist analyst role would.',
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: 'udpa',
    title: 'UD&PA Department — dossier',
    glyph: '🏛️',
    tagline: 'The parent department: mandate, structure, schemes, and who signs what.',
    sections: [
      {
        heading: 'What it is',
        body:
          'Urban Development & Poverty Alleviation Department, Government of Mizoram. Established 24 August 2006 to implement urban development and poverty alleviation programmes across the state. Directorate located at New Secretariat Complex (MINECO), Khatla, Aizawl.',
      },
      {
        heading: 'Jurisdiction',
        bullets: [
          'Covers the Census Towns and Notified Towns of Mizoram — 28 towns in total.',
          'Responsible for urban development, poverty alleviation, sanitation and waste management, and town & country planning in urban areas.',
        ],
      },
      {
        heading: 'Organisational structure',
        bullets: [
          'Directorate Office (headquarters).',
          'Town & Country Planning (TCP) wing — urban planning and land-use.',
          'Senior Sanitation Office.',
          'Nine District Urban Development Offices (DUDOs): Lunglei, Champhai, Kolasib, Mamit, Serchhip, Khawzawl, Hnahthial, Saitual, and Aizawl.',
          'MUDAL — the department\'s PSU / implementing company (see the MUDAL brief).',
        ],
      },
      {
        heading: 'Schemes it implements',
        bullets: [
          'AMRUT / AMRUT 2.0 — Atal Mission for Rejuvenation and Urban Transformation. Water supply, sewerage, drainage, urban infrastructure. Critically, AMRUT also carries the GIS-based Master Plan sub-scheme (see the Correlation brief).',
          'PMAY-U — Pradhan Mantri Awas Yojana (Urban). Housing.',
          'SBM-U — Swachh Bharat Mission (Urban). Sanitation and solid waste.',
          'DAY-NULM — Deendayal Antyodaya Yojana / National Urban Livelihoods Mission. This is the "Poverty Alleviation" half of the department name.',
          'Smart Cities Mission — via Aizawl Smart City Ltd., now transitioning to MUDAL.',
          'Town & Country Planning — master plans, land-use zoning, development control.',
        ],
      },
      {
        heading: 'Who\'s who (know these names)',
        bullets: [
          'Minister, UD&PA: K. Sapdanga (in office since 8 December 2023; also holds Home).',
          'Commissioner & Secretary: V. Lalsangliana — signed your recruitment advertisement.',
          'Under Secretary: Lalrinsanga Hnamte — countersigned the same advertisement.',
          'Chief Minister of Mizoram: Lalduhoma (ZPM), since 8 December 2023.',
        ],
      },
      {
        heading: 'Why this matters for a System Manager',
        body:
          'Every one of those schemes reports to a central ministry (mostly MoHUA) and carries MIS, dashboard, and geo-tagging obligations. The IT function is not a side service — it is how the department proves delivery and draws down funds. Frame your role that way rather than as desktop support.',
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: 'mudal',
    title: 'MUDAL — dossier',
    glyph: '🏗️',
    tagline: 'The PSU you are joining: why it exists, what it inherited, what it runs.',
    sections: [
      {
        heading: 'What it is',
        body:
          'Mizoram Urban Development Agency Limited — a Government of Mizoram company (PSU) operating under the UD&PA Department. Formed in 2026 to carry forward Smart City work and the state\'s broader urban development mandate. It is, in effect, the successor vehicle to Aizawl Smart City Limited.',
      },
      {
        heading: 'It is brand new — say so',
        bullets: [
          'The Board of Directors held its first meeting on 28 July 2026 — and that meeting is what approved the syllabus and question pattern for your own exam. This detail is in the advertisement; citing it shows you read the source document, not a summary.',
          'The recruitment advertisement (No. 1 of 2026–2027) is dated 31 July 2026 — the very first recruitment MUDAL has run.',
          'You are therefore not joining a settled organisation with established SOPs. You are joining a transition. Every answer should reflect that.',
        ],
      },
      {
        heading: 'The posts advertised (know the whole list, not just yours)',
        bullets: [
          'Assistant Engineer (Civil) — ₹85,000/month, 2 posts.',
          'System Analyst — ₹85,000/month, 1 post.',
          'Junior Engineer (Civil) — ₹60,000/month, 4 posts (2 reserved for Diploma holders).',
          'System Manager — ₹50,000/month, 1 post. ← yours',
          'Multi-Tasking Staff — ₹30,000/month, 4 posts.',
          'Total: 12 posts. The organisation is small, which means the System Manager is likely the IT function, not one of several IT staff.',
        ],
      },
      {
        heading: 'Your post\'s stated eligibility',
        bullets: [
          'Graduate in any stream from a recognised university.',
          'One-year diploma or above in a computer-related field from a recognised institution.',
          'Mizo language to at least Middle School standard (or a Mizo Language Proficiency Certificate).',
          'Age 18–35 as on 29 August 2026, relaxable to 40 for SC/ST, plus a further 2 years for those with 5 years\' service in State Government / a government-controlled PSU or Autonomous Body.',
          'Selection: Written Exam → Document Screening → Personal Interview.',
        ],
      },
      {
        heading: 'What MUDAL actually runs today',
        bullets: [
          'The Aizawl ICCC — its single largest technical asset (see the ICCC brief).',
          'The residue of ~43 Smart City projects inherited from ASCL, including the Chaltlang Multi-Purpose Sports Complex and Laldenga Cultural Centre.',
          'Ongoing UD&PA scheme delivery in coordination with the department and Aizawl Municipal Corporation.',
          '"Catch the Rain 2026" / Jal Samvad — a water-conservation community outreach across 10 Aizawl locations, run with AMC.',
        ],
      },
      {
        heading: 'The honest answer to "what is next for MUDAL"',
        body:
          'There is no published new-construction pipeline. Saying so — and adding that the real near-term task is establishing a sustainable operating model for assets built under a mission that has now closed — reads as mature and informed, rather than reciting a press release. This is also precisely where you position your own consolidation experience.',
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: 'iccc',
    title: 'The Aizawl ICCC — dossier',
    glyph: '📹',
    tagline: 'MUDAL\'s flagship asset, and almost certainly the core of your job.',
    sections: [
      {
        heading: 'The specification — memorise these numbers',
        bullets: [
          'Integrated Command & Control Centre, locally "Aizawl Ven Buk".',
          'Capital cost: ₹87.18 crore.',
          'Monthly operating cost: approximately ₹7.8 lakh.',
          '237 fixed CCTV cameras + 39 PTZ (Pan-Tilt-Zoom) cameras = 276 cameras across 76 locations.',
          'Facial recognition at 5 critical locations.',
          'ANPR (Automatic Number Plate Recognition) for traffic enforcement.',
          'Variable Message Displays (VMD) at 5 locations.',
          'Free public Wi-Fi at 15 locations.',
          'Footage retention approximately 30 days, with important data archived longer.',
          'Inaugurated 1 April 2023 by Union Home Minister Amit Shah.',
          'Reported as among the top three ICCCs in India; ~600 cases identified since commissioning.',
          'Toyota contributed additional CCTV equipment via CSR.',
        ],
      },
      {
        heading: 'What a System Manager would actually own',
        bullets: [
          'Uptime of the camera fleet and the network carrying it.',
          'Vendor and AMC management against SLAs — the renewal cycle is the real lever.',
          'Storage sizing and the 30-day retention obligation.',
          'Integration and data-sharing with Police and Traffic.',
          'Access control and audit logging — especially for the facial recognition subsystem.',
          'Power, UPS, and disaster recovery at the NOC.',
        ],
      },
      {
        heading: 'The sustainability problem — the question they will ask',
        body:
          'Central grant funding ended with the Smart Cities Mission on 31 March 2025, but the ICCC still costs roughly ₹7.8 lakh a month to run, now against the State. This is the defining question for the post. The four arguments below are the ones that survive scrutiny:',
        bullets: [
          'State budget provision — the honest one. The asset is now a State liability and needs a recurring line in the department budget. Unglamorous and correct; say it first.',
          'Cost rationalisation from your own audit — 276 cameras do not carry equal operational value. Once you can show which produce case work and which have produced nothing, the department is choosing where to spend rather than paying a flat bill for the whole estate.',
          'SLA-linked AMC — pay against measured performance rather than renewing flat.',
          'CSR — with the Toyota equipment contribution as an existing precedent.',
          'Weaker, use with care: VMD advertising revenue.',
        ],
      },
      {
        heading: '⚠️ Two arguments that get demolished — corrected after a mock',
        bullets: [
          'AMRUT 2.0 does NOT fund this. AMRUT targets water supply, sewerage, septage, water-body rejuvenation and green spaces, and is largely capital expenditure against project proposals. Booking ₹7.8 lakh/month of control-room running cost against a water infrastructure mission will be rejected by anyone who has administered the scheme — and a UD&PA panel has. Do not lead with it.',
          'Where AMRUT genuinely helps you is elsewhere: the GIS-based Master Plan sub-scheme (₹515 cr, geo-referenced base and land-use maps, TCPO nodal, NRSC contracted). That is capital mapping work and it connects to your GIS background — use it there, never as ICCC O&M.',
          'ANPR e-challan revenue does not simply flow to MUDAL. MUDAL has no enforcement powers; challans are issued by Police and Transport, and the revenue accrues to them. Do not present it as MUDAL income.',
          'The recoverable version: a formal cost-sharing arrangement with Police and Transport, who are the operational beneficiaries of a system MUDAL maintains. They gain enforcement capability; they contribute to keeping it running. That is an institutional argument, not a revenue claim.',
          'If a panel catches you on either, concede immediately and offer a better answer. Dropping a bad argument fast reads far better than defending it.',
        ],
      },
      {
        heading: 'Rationalisation — the hard follow-up, and the mature answer',
        body:
          'Proposing to switch cameras off is politically loaded: the facility was inaugurated by the Union Home Minister, the department publicly claims a top-three national ranking, ~600 cases have been assisted, and Local Councils have asked for cameras and not received them. "Which camera goes dark, and who tells that Local Council?" is a fair and difficult question.',
        bullets: [
          'Rationalise the maintenance tier, not the camera. A camera that rarely produces evidence does not need a four-hour response SLA; it can sit on a lower support tier. Nothing goes dark.',
          'Let the Police own the priority list. You supply usage data; they decide what matters operationally. That puts a political decision with the body that has the mandate for it — and protects you when an incident occurs at a deprioritised junction.',
          'Redeploy rather than remove. A camera producing nothing where it stands has value where a Local Council has been requesting one. This turns the objection into your proposal.',
        ],
      },
      {
        heading: 'The governance angle — do not miss this',
        body:
          'Facial recognition at five locations plus 30-day retention puts this squarely inside the Digital Personal Data Protection (DPDP) Act, 2023. If asked about it, answer with governance first — who may access footage, under what written authority, with what audit trail — and technology second. A purely technical answer to a privacy question reads as a red flag.',
      },
      {
        heading: 'Terrain note worth raising unprompted',
        body:
          'Aizawl is steep and fibre-constrained. A distributed 276-camera fleet across 76 hillside locations has real backhaul, redundancy and power-continuity challenges that a flat-terrain city does not. Mentioning this shows you are thinking about the actual city rather than a generic deployment.',
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: 'scm',
    title: 'Smart Cities Mission & the funding cliff',
    glyph: '📉',
    tagline: 'The story that explains why MUDAL exists. Lead with this.',
    sections: [
      {
        heading: 'The mission',
        bullets: [
          'Smart Cities Mission (SCM), Ministry of Housing and Urban Affairs, launched 2015 for 100 cities.',
          'Delivered through Special Purpose Vehicles (SPVs) — separate companies set up per city to execute projects outside normal departmental machinery.',
          'Aizawl was Mizoram\'s single Smart City; its SPV was Aizawl Smart City Limited (ASCL).',
          'Two standard components: Area-Based Development (ABD) and Pan-City solutions. The ICCC is the classic Pan-City project.',
        ],
      },
      {
        heading: 'The closure',
        bullets: [
          'SCM formally ended 31 March 2025.',
          'Nationally: ~7,555 of 8,067 projects complete (~94%), roughly ₹1.51 lakh crore; 99.44% of the budget released.',
          'All 100 cities have operational ICCCs; 84,000+ CCTV cameras installed nationally.',
          'Aizawl\'s own delivery was slower than planned — only 3 of 43 projects were functional as of mid-2023, with more completed by 2025. COVID delays were the stated cause. Know this; do not pretend the record was spotless.',
        ],
      },
      {
        heading: 'The consequence — and Mizoram\'s answer',
        body:
          'Across India, SPVs were left holding expensive operational assets with no mission to fund them, and many have been wound up or absorbed. Mizoram\'s response was to wind up ASCL and constitute MUDAL as a broader state-level urban development PSU that inherits the Smart City assets while also carrying AMRUT, PMAY-U, SBM-U and NULM work. That is the single most important piece of context for this interview.',
      },
      {
        heading: 'The successor framework to know by name',
        body:
          'NUDM — the National Urban Digital Mission — is the post-SCM umbrella for urban digital governance, and is the more relevant framework to cite when talking about where ICCC-type work goes next. Mentioning it signals you are tracking current policy rather than the mission that just closed.',
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: 'dilrmp',
    title: 'Your DILRMP / Land Revenue work',
    glyph: '📜',
    tagline: 'August 2023 onward — what you did, and how to describe it.',
    sections: [
      {
        heading: 'The programme',
        body:
          'DILRMP — the Digital India Land Records Modernization Programme — is a centrally-sponsored mission to computerise and modernise land records nationally. You worked on it as a Programmer at the Directorate of Land Revenue & Settlement, Government of Mizoram, from August 2023.',
      },
      {
        heading: 'What you actually did',
        bullets: [
          'Digitisation of land records — converting paper and handwritten revenue records into structured digital data.',
          'Managing and sorting scanned historical documents — indexing old records so they could be attached to the right entries and actually retrieved.',
          'Data cleaning — reconciling inconsistent formats and entries across sources.',
          'GIS and spatial database management — tying land parcels to real mapped locations rather than text descriptions alone.',
          'Database refactoring — consolidating separate per-district/locality databases into a single unified schema.',
          'Office network administration for the directorate.',
        ],
      },
      {
        heading: 'The Mizoram land context',
        body:
          'Mizoram\'s land tenure system differs from mainland patterns — the Land Settlement Certificate (LSC) is the central document, and village-level institutions have a defined role in land allotment. You know this system first-hand, which is worth saying plainly: you have worked inside Mizoram\'s own land administration, not a generic one. ⚠️ Keep any statutory detail you cite to what you genuinely handled — do not improvise section numbers or act names in the room.',
      },
      {
        heading: 'The plain-language version',
        body:
          '"I worked on converting Mizoram\'s paper land records into a digital system. Many of the old records were handwritten or scanned documents held separately in different district offices, each in its own format. My job was to clean that data, organise the old scanned documents so they could be found again, and bring everything into one unified system so a record from any district could be looked up the same way. I also linked records to actual map locations, so land boundaries could be seen visually rather than only described in text."',
      },
      {
        heading: 'Date discipline',
        body:
          '⚠️ Start date is August 2023 — confirmed. The end date is still unresolved in your own account (you have given both August 2025 and a September 2025 date that does not exist). Fix this before Document Screening: the panel may hold your experience certificate while you answer. A date you state that contradicts your own certificate is an avoidable credibility hit.',
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: 'correlation',
    title: '⭐ Land Revenue ↔ UD&PA — the correlation',
    glyph: '🔗',
    tagline: 'Why your last job is the best possible preparation for this one. Know this cold.',
    sections: [
      {
        heading: 'The one-line version',
        body:
          '"Both jobs are the same discipline applied to different ground: building an authoritative spatial record that government decisions and citizen entitlements rest on. In land revenue it was the parcel. In urban development it is the plot, the building, and the asset."',
      },
      {
        heading: 'Bridge 1 — AMRUT literally funds GIS land-use mapping',
        body:
          'This is the strongest and most specific link, and most candidates will not know it. Under AMRUT there is a dedicated 100% centrally-funded sub-scheme, "Formulation of GIS-based Master Plans for 500 AMRUT Cities", approved in 2015 with a total outlay of about ₹515 crore. Its stated objective is to create common digital geo-referenced base maps and land-use maps using GIS, at 1:4000 scale, as the foundation for master plan formulation. MoHUA signed an MoU with NRSC in August 2016 for the geospatial database creation.',
        bullets: [
          'UD&PA runs AMRUT. UD&PA has a Town & Country Planning wing. TCPO is the nodal body for this sub-scheme.',
          'The skill the sub-scheme requires — geo-referenced base mapping and land-use data — is exactly what you built at DILRMP.',
          'Say it directly: "The GIS work I did on land parcels is the same class of work AMRUT\'s GIS master plan sub-scheme requires for urban land use."',
        ],
      },
      {
        heading: 'Bridge 2 — property tax is the join between the two domains',
        bullets: [
          'Urban local bodies levy property tax; the tax base is derived from land and building records.',
          'GIS-based property tax mapping is a standard urban reform precisely because it converts land records into revenue.',
          'You have worked on the record side of that equation. Very few IT candidates have.',
        ],
      },
      {
        heading: 'Bridge 3 — planning permission sits on cadastral data',
        body:
          'Master plans, land-use zoning and building/development permissions all sit on top of parcel-level land data. A TCP wing without reliable spatial land records is working blind. That is the same dependency you spent two years servicing.',
      },
      {
        heading: 'Bridge 4 — the same centrally-sponsored delivery machinery',
        bullets: [
          'DILRMP and AMRUT / SCM / PMAY-U are the same architecture: central mission, state implementing department, MIS and dashboard reporting upward, fund release tied to demonstrated progress.',
          'You already know how that discipline feels from the inside — physical verification, geo-tagging, progress reporting, audit trails.',
          'This is a genuine differentiator over a purely private-sector candidate.',
        ],
      },
      {
        heading: 'Bridge 5 — the scanned-document backlog is the identical problem',
        bullets: [
          'You sorted, indexed and digitised decades of historical land documents.',
          'UD&PA and MUDAL hold the same kind of backlog: old building permission files, property records, DPRs, scheme beneficiary records under PMAY-U and NULM.',
          'The workflow you built — scan, clean, sort, index, attach to the right record, make it retrievable — transfers directly.',
        ],
      },
      {
        heading: 'Bridge 6 — database consolidation is MUDAL\'s live problem',
        body:
          'You unified fragmented per-district databases into one schema. MUDAL right now must absorb Aizawl Smart City Ltd.\'s systems, records, contracts and data into a new organisation. This is the same problem with different labels, and it is happening this year. Offer it as your first-90-days contribution.',
      },
      {
        heading: 'Bridge 7 — data governance carries across',
        body:
          'Land records contain personal and ownership data; urban scheme databases contain beneficiary data; the ICCC contains biometric data. All three sit under the DPDP Act, 2023. Having handled citizen records in a government setting already, you understand that access control and audit are governance obligations rather than optional features.',
      },
      {
        heading: 'How to deploy this in the room',
        body:
          'Do not recite all seven. Lead with the one-line version, then pick the bridge that matches the question asked — AMRUT GIS if they ask about schemes, consolidation if they ask about the ASCL transition, the scanning backlog if they ask what you would do first, governance if they ask about the ICCC or privacy.',
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: 'shiksha',
    title: 'Shiksha / CMES — your current work',
    glyph: '🎓',
    tagline: 'What you build now, and what it proves you can do for MUDAL.',
    sections: [
      {
        heading: 'Who the employer actually is',
        body:
          'CM Engineering & Solution provides consultancy for civil engineering and architecture — architectural drawing, architectural engineering, architecture planning, engineering drawings. You work in its IT division, a branch the firm established, and you lead its software team. The division\'s main product is Shiksha. The "CM" derives from the proprietor\'s family initials, not from a technical term.',
        bullets: [
          'Exact registered name: "CM Engineering & Solution" — ampersand, "Solution" singular. Confirmed identically on two independent trade directories, so this is the form to use.',
          'Mr. Dhananjay Kumar is named as principal/contact in both listings.',
          'GSTIN 15AAGFC0655D1ZY — 15 is the Mizoram state code; the "F" in the PAN segment indicates a partnership firm.',
          '⚠️ The two listings conflict on location: one shows Aizawl, Mizoram; the other a Gurugram, Haryana address with establishment year 2014. Probably a Haryana firm holding a Mizoram GST registration, which fits your remote arrangement — but verify from your own offer letter rather than guessing.',
          '⚠️ Settle before the interview: registered office address, and whether it is a partnership or a proprietorship. "Where is your company based?" is an easy question to stumble on.',
          'No company website, but it is verifiable via GST-registered directory listings. Still carry your offer letter, experience certificate and salary slips to Document Screening.',
          'The role is remote, at the same pay as your DILRMP post.',
          'This matters more than it looks: you are the IT function inside a civil-engineering organisation, which is structurally identical to what a System Manager is at MUDAL (2 AE Civil + 4 JE Civil versus 1 System Analyst + 1 System Manager).',
        ],
      },
      {
        heading: 'What Shiksha is',
        body:
          'Shiksha (shikshacom.com) is the full-stack education platform CMES\'s IT division builds, and the system you lead development on. It runs two products on one shared account system: Academy — structured Class 8–12 board coursework taught by approved faculty, sold as per-course subscriptions; and Skill Dev — a marketplace of screened guest experts offering one-to-one sessions and self-paced skill courses. Currently in internal testing ahead of public rollout.',
      },
      {
        heading: 'The architecture (have this ready, do not lead with it)',
        bullets: [
          'Backend: Django 6 + Django REST Framework + SimpleJWT, Django Channels for WebSockets, Celery + Celery Beat for background jobs.',
          'Data: PostgreSQL for persistence; Redis serving double duty as the Channels layer and the Celery broker.',
          'Serving: Nginx in front of Gunicorn (HTTP/REST) and Daphne/ASGI (WebSockets), same Django codebase behind both.',
          'Four separate React + Vite front-ends: public site (www), student (app), teacher, and admin — each its own deployment.',
          'Single sign-on across all four via httpOnly JWT cookies scoped to the shared parent domain.',
          'Integrations: LiveKit (live video rooms), Bunny CDN/Stream (recorded video), Resend (transactional email), Razorpay (payments, togglable live without redeploy), Google OAuth, GNews. Teacher uploads use tus for resumable large-file transfer.',
        ],
      },
      {
        heading: 'What you personally own',
        bullets: [
          'Lead a team of roughly six engineers.',
          'Authored the full platform audit and a 6-workstream delivery plan — backend, realtime, frontend, platform/design, integrations, QA/DevOps — which is what the team works from.',
          'Own the admin control plane: user and teacher approvals, course catalogue, enrolment workflows, forum moderation.',
          'Make the infrastructure calls — why WebSockets, why Celery, what ships first.',
        ],
      },
      {
        heading: 'The bug worth telling them about',
        body:
          'The dashboard used to infer whether a user was a student or a teacher by inspecting their data — specifically, whether the account had any active enrolment. On a platform where one email can hold several learner profiles plus a teacher identity, that guess was wrong in several directions at once: a teacher with an enrolled child saw the child\'s classes instead of their own, two sibling profiles saw the union of each other\'s courses, and the payment history block exposed a sibling\'s transaction references. The authoritative answer was already present in the JWT claims; the view simply never read them. The fix was to branch on the claims. Tell it this way — it demonstrates tracing a symptom to root cause, and it is a data-isolation failure, which is directly relevant to an organisation running citizen surveillance infrastructure.',
      },
      {
        heading: 'The plain-language version',
        body:
          '"I lead a small team building an online school — live video classes, recorded lessons, quizzes and payments, all built from scratch. I make the technical decisions, guide the other developers on what to build and in what order, and I write the documentation the team works from."',
      },
      {
        heading: 'What it proves for MUDAL',
        bullets: [
          'You run production infrastructure that real users depend on — not coursework projects.',
          'You lead and coordinate a technical team, which is what "Manager" in the post title implies.',
          'You manage third-party vendor integrations and their failure modes — the same muscle as ICCC AMC management.',
          'You have shipped auth, access control and data isolation, which is the ICCC governance problem in a different costume.',
        ],
      },
      {
        heading: 'Open items to confirm',
        body:
          '⚠️ Still unsettled: your exact join date (you have said "November", almost certainly 2025), the DILRMP end date it must not overlap or gap awkwardly with, and the exact registered spelling of the company name. A date that conflicts with your own experience certificate is an unforced error at Document Screening — fix it before, not in the room.',
      },
      {
        heading: 'Setting up the IT function — use this, it is undersold',
        bullets: [
          'You did not join an existing software team. CMES established the IT branch and you built its engineering practice: process, technical standards, documentation, and the delivery plan the team now works from.',
          'MUDAL is in the same position — a two-month-old PSU with no established IT SOPs, inheriting systems from a wound-up SPV.',
          'So the honest pitch is not "I can maintain your systems." It is "I have already built a technical function inside an engineering organisation that had none, and that is precisely the task in front of MUDAL right now."',
        ],
      },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: 'hawayu',
    title: 'map.hawayu.in — your own platform',
    glyph: '🗺️',
    tagline: 'The project that makes you memorable. Use it deliberately.',
    sections: [
      {
        heading: 'What it is',
        body:
          'A personal interactive study platform, live at map.hawayu.in, that you designed and built alone. It presents Indian geography, history and polity as a clickable map with cross-linked concepts, rather than as disconnected facts to memorise — plus question banks, flashcards, spaced repetition, and dedicated exam-prep modules.',
      },
      {
        heading: 'The technology',
        bullets: [
          'React 18 + TypeScript, built with Vite.',
          'Leaflet / react-leaflet for the mapping layer.',
          'Zustand for state, persisted to the browser — the core app needs no backend at all.',
          'Tailwind CSS, Framer Motion, React Router.',
          'Deployed on Vercel behind your own custom domain.',
          'Content pipelines integrate Google Generative AI and Groq APIs — genuine AI-assisted data processing, not a buzzword.',
          'A separate FastAPI service handles question review and correction workflows.',
        ],
      },
      {
        heading: 'The features worth naming',
        bullets: [
          'A "Connections engine" — chapters sharing a concept surface as clickable cross-links automatically.',
          'Chronicle — a semantically zooming timeline where zooming changes what is shown (era → century → decade → year) rather than just text size, and which auto-links to any question tagged with a year.',
          'Author Mode — new map-based content can be created by clicking on the map, no GeoJSON editing, roughly fifteen minutes per chapter.',
          'Exam modules: MUDAL System Manager (843 questions, 296 concepts), MPSC System Analyst (857), MPSC JSO Cyber Forensic (543).',
          'An Interview Prep module — this one — built specifically for this interview.',
        ],
      },
      {
        heading: 'The line that lands',
        body:
          '"I was serious enough about this post that before the written exam I built my own 843-question study module for it, inside a platform I run myself at map.hawayu.in. The interview preparation I am using right now is also a module I built in it." That is verifiable, specific, and almost impossible for another candidate to match.',
      },
      {
        heading: 'The data-honesty angle — your best technical anecdote',
        bullets: [
          'The question banks are built from 3,715 historical MPSC exam papers processed through a self-hosted Tesseract OCR pipeline, consolidated into a PostgreSQL bank of 77,751 questions across 1,938 papers.',
          'Every answer carries a visible provenance badge — "official key" where a published key exists, otherwise "derived" with an honest confidence rating. Where an independent solve disagreed with the bank, both candidate answers are shown rather than one being silently chosen.',
          'You found and fixed a silent data-loss bug where the OCR extractor dropped roughly 280 questions leaving no numbering gap to reveal it, and a filter that inferred question type from a topic string and silently dropped anything tagged differently.',
          'Use this when asked about data quality, debugging, or integrity. The instinct it demonstrates — verify against source rather than trusting your own pipeline\'s output — is exactly what you would want in someone running a records system.',
        ],
      },
      {
        heading: 'How to handle the "will you be distracted?" question',
        body:
          'Government panels sometimes read a personal platform as divided attention. Pre-empt it: it is a personal study tool, not a commercial venture, it has no customers or obligations, and it is the reason you are as prepared for this exam as you are. Frame it as evidence of self-direction, which is precisely what a sole IT person in a twelve-person agency needs.',
      },
    ],
  },
];

export const totalBriefs = briefs.length;
