/* Informatics Officer, ICT notification A-12038/68/2025-ICT, 30 July 2026.
 * Adapt the shared study corpus without changing the System Analyst assets.
 * Source question IDs/provenance stay stable; progress has its own namespace.
 */
(() => {
  const old = window.SYLLABUS;
  const clone = x => JSON.parse(JSON.stringify(x));
  const find = id => clone(old.papers.find(p => p.id === id));
  const unit = (no, title, marks, subtopics) => ({ no: String(no), title, marks, subtopics });
  const authority = 'ICT Department notification No. A-12038/68/2025-ICT, 30 July 2026';
  const ge = find('GE');
  ge.units = [
    unit(1, 'Precis writing', 14, old.papers[0].units[1].subtopics),
    unit(2, 'Letter writing', 10, ['Formal letter: purpose, format, register and concise organisation']),
    unit(3, 'Comprehension of given passages (MCQ)', 10, old.papers[0].units[0].subtopics),
    unit(4, 'Grammar: parts of speech (MCQ)', 30, ['Parts of speech in use', 'Articles and determiners', 'Prepositions and phrasal verbs', 'Modals', 'Non-finites: infinitive, gerund, participle']),
    unit(5, 'Correct usage and vocabularies (MCQ)', 16, ['Subject-verb agreement / concord', 'Common errors and confusables', 'Idioms and phrases', 'One-word substitution', 'Synonyms and antonyms', 'Spelling', 'Punctuation']),
    unit(6, 'Formation of sentence (MCQ)', 20, ['Tense and sequence of tenses', 'Voice: active and passive', 'Narration: direct and indirect speech', 'Conditionals and the subjunctive', 'Transformation of sentences', 'Synthesis of sentences', 'Analysis of complex and compound sentences', 'Connectors; affirmative, interrogative, negative and exclamatory sentences; phrases and clauses'])
  ];
  ge.type = 'Conventional: precis 14 + letter 10 marks; MCQ sections: 76 marks';
  ge.mock_enabled = false; // notification does not specify English question count/marks per MCQ
  ge.marks_per_question = 1;
  ge.scope_note = 'English practice uses one point per MCQ as a study convention. The notification specifies section marks, not the MCQ count. Precis and letters require written practice.';
  const gs = find('GS');
  const gsMap = { 9: '1', 4: '2', 3: '3', 1: '4', 2: '5', 8: '6', 6: '7', 5: '8' };
  gs.units = [
    unit(1, 'Current events of state, national and international importance', 12, []),
    unit(2, 'History of India and Indian National Movement', 12, []),
    unit(3, 'Indian and World Geography', 12, []),
    unit(4, 'Indian Polity and Governance', 12, []),
    unit(5, 'Economic and Social Development', 12, []),
    unit(6, 'Environmental Ecology, Biodiversity and Climate', 12, []),
    unit(7, 'General Science', 12, []),
    unit(8, 'Mizo culture, heritage and society', 16, [])
  ];
  for (const u of old.papers.find(p => p.id === 'GS').units) {
    if (gsMap[u.no]) gs.units.find(n => n.no === gsMap[u.no]).subtopics = [...u.subtopics];
  }
  gs.units[2].subtopics.push('Physical, social and economic geography of the world');
  gs.units[4].subtopics.push('Sustainable development, inclusion, demographics and social-sector initiatives');
  gs.type = 'MCQ with negative marking'; gs.questions = 100; gs.marks_per_question = 1;
  gs.scope_note = 'Cover Mizoram in each topic wherever applicable. 100 one-mark questions are used as the practice format; the notification fixes 100 marks, not a question count.';
  delete gs.scope_revision_2026_09_05; delete gs.weights_rebalanced_2026_09_05;
  const tech1 = find('TECH1'), tech2 = find('TECH2');
  delete tech2.coverage_note;
  const tech3 = {
    id: 'TECH3', name: 'Technical Subject Paper III', marks: 200,
    units: [
      unit(1, 'Computer Networks', 60, [
        'OSI and TCP/IP; layered architectures; network design',
        'Serial/parallel, simplex/duplex communication; switching; TDM, FDM, WDM',
        'CRC, checksum, Hamming code, FEC and ARQ; performance and QoS',
        'IPv4/IPv6, subnetting and CIDR; TCP, UDP, ICMP, DHCP, DNS and application protocols',
        'Routing and switching; OSPF, BGP, MPLS and SD-WAN',
        'Wi-Fi 6/6E, 5G/6G, cloud, edge, IoT, Zero Trust and SASE',
        'Transmission media, Ethernet, topologies, devices, VLANs and data centres',
        'Network OS; virtualization; container and Kubernetes networking',
        'Security, monitoring, fault management and disaster recovery',
        'SDN, NFV, AI-driven management, Python/Ansible automation, Wireshark, Packet Tracer and GNS3'
      ]),
      unit(2, 'Software Engineering', 60, [
        'SDLC; requirements analysis, SRS, validation and metrics',
        'Waterfall, prototyping, iterative, spiral and Agile models',
        'System design: abstraction, decomposition, top-down/bottom-up, functional and object-oriented approaches',
        'Coding: structured programming, information hiding, documentation and verification',
        'Testing levels, functional/structural testing, test plans, cases and reliability',
        'Project cost estimation, scheduling, staffing, configuration management, quality assurance and risk management'
      ]),
      unit(3, 'Artificial Intelligence & Machine Learning', 40, [
        'Agents, environments, uninformed/informed/adversarial search, CSP and alpha-beta pruning',
        'First-order logic; forward/backward chaining, unification and resolution',
        'Planning under uncertainty, probability and Bayesian belief networks',
        'Linear/logistic regression, gradient descent and concept learning',
        'Decision trees (ID3), inductive bias and support vector machines',
        'Clustering, Gaussian mixtures, PCA and EM',
        'Neural networks, ensemble methods and backpropagation',
        'Reinforcement learning: MDPs, Q-learning and SARSA',
        'Deep learning and Transformers: self-attention, multi-head attention and encoder-decoder models',
        'LLMs: tokenization, pretraining, fine-tuning and prompting',
        'NLP, formal grammars, syntax/semantics and machine translation',
        'Expert systems, fuzzy logic, genetic algorithms and swarm intelligence'
      ]),
      unit(4, 'Cybersecurity', 40, [
        'CIA triad, Zero Trust, threats, vulnerabilities, cybercrime and ethics',
        'Indian IT Act and data protection laws',
        'Malware, ransomware, phishing, social engineering, wireless/IoT and web/API attacks',
        'MFA, encryption, endpoint protection and backup strategies',
        'Ethical testing: OSINT, WHOIS, DNS enumeration, Netcraft, email harvesting, Google Dorking and Shodan',
        'Nmap SYN/FIN/NULL/XMAS/Idle scans, banner grabbing and OS fingerprinting',
        'Wireshark, Nessus, Burp Suite, Metasploit and OWASP Top 10',
        'HIDS/NIDS, Snort, SIEM, SOC, threat intelligence, honeypots and MITRE ATT&CK',
        'Incident response and log analysis',
        'Firewalls, VPNs, segmentation, cloud security, IAM, EDR/XDR and DevSecOps',
        'Docker/Kubernetes security, AI-assisted defence and prompt injection'
      ])
    ]
  };
  for (const p of [ge, gs, tech1, tech2, tech3]) {
    p.counts_for_merit = true; p.duration_hours = 3; p.authority = authority;
    delete p.qualifying_threshold_pct;
    if (p.id.startsWith('TECH')) {
      p.questions = 50; p.marks_per_question = 2; p.mcq_marks = 100;
      p.type = '50 MCQs × 2 marks (100) + conventional/essay questions (100); 3 hours for the full paper';
      p.structure_note = 'The timed drill covers only the MCQ component. Practise the separate 100-mark written component too. The 3-hour limit belongs to the complete paper, not an official MCQ-only duration.';
    }
  }
  const papers = [ge, gs, tech1, tech2, tech3];
  window.SYLLABUS = {
    post: 'Informatics Officer', employer: 'Information & Communication Technology Department, Government of Mizoram',
    pay: 'Level 10', selection_stages: ['Written examination (800 marks)', 'Personal interview (100 marks)'],
    scoring_note: '800 written marks + 100 interview marks = 900. English and General Studies count. Each paper lasts 3 hours. Wrong MCQs lose one third of their marks; unanswered questions lose nothing.',
    papers, interview: {marks: 100, counts_for_merit: true}, reading: [],
    source_note: 'Based on the notified syllabus of 30 July 2026. Recruitment dates, vacancies and eligibility must be checked in the applicable advertisement; no exam date is assumed.'
  };
  const geMap = row => {
    if (row.unit === '1') return '3';
    if (row.unit === '2') return '1';
    if (row.unit !== '3') return null;
    return ge.units.find(u => u.subtopics.includes(row.sub))?.no || '6';
  };
  function adapt(row) {
    const r = {...row};
    if (r.paper === 'GE') { r.unit = geMap(r); if (!r.unit) return null; }
    else if (r.paper === 'GS') { r.unit = gsMap[r.unit]; if (!r.unit) return null; }
    else if (r.paper === 'TECH1_LEGACY') {
      if (r.unit === '1' && r.sub !== 'Basic Computer System') {r.paper = 'TECH3'; r.unit = '1';}
      else if (['2','6'].includes(r.unit)) {r.paper = 'TECH3'; r.unit = '2';}
      else return null;
    } else if (!['TECH1','TECH2'].includes(r.paper)) return null;
    r.unitTitle = papers.find(p => p.id === r.paper).units.find(u => u.no === String(r.unit)).title;
    return r;
  }
  window.CONCEPTS = window.CONCEPTS.map(adapt).filter(Boolean);
  window.QUESTIONS = window.QUESTIONS.map(adapt).filter(Boolean);
  // Set A topic boundaries were checked against each supplied paper's text.
  const gsUnits = {
    1:[50,51,52,53,100], 2:[19,20,21,22,23,24,25,26,27,34,35,59,83,88,89],
    3:[28,29,30,31,32,33,60,68,69,70,71,73,81,84],
    4:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,55,56,57,61,74,75,76,79,82,85,90],
    5:[36,37,38,39,40,77,78,80,86,91], 6:[41,87], 8:[64],
    7:[42,43,44,45,46,47,48,49,54,58,62,63,65,66,67,72,92,93,94,95,96,97,98,99]
  };
  for (const q of window.IO_PAST_QUESTIONS) {
    const limits = q.paper === 'TECH1' ? [20,40,70,100] : q.paper === 'TECH2' ? [20,50,80,100] : [30,60,80,100];
    const n = q.paper === 'GS' ? Object.keys(gsUnits).find(k => gsUnits[k].includes(q.no)) : String(limits.findIndex(end => q.no <= end)+1);
    if (!n) throw new Error('Unmapped source question: '+q.id);
    const u = papers.find(p => p.id === q.paper).units.find(u => u.no === n);
    window.QUESTIONS.push({...q, unit: n, sub: u.title});
  }
  // Calc generator tags predate the 2026 migration; map their original units explicitly.
  window.CALC_DRILLS = (window.CALC_DRILLS || []).map(g => {
    if (g.paper !== 'TECH1') return null;
    if (g.unit === '1') return {...g, paper: g.sub === 'Basic Computer System' ? 'TECH1' : 'TECH3', unit: g.sub === 'Basic Computer System' ? '2' : '1'};
    if (g.unit === '5') return {...g, paper: 'TECH2', unit: '3'};
    if (g.unit === '4') return {...g, paper: 'TECH2', unit: '1'};
    return null;
  }).filter(Boolean);
  window.TRAINER_CONFIG = {
    storageKey: 'mpsc_io_2026_v1', examLabel: 'ICT syllabus · 30 July 2026',
    negativeMarking: 1/3, componentMocks: true,
    guideHref: '../mpsc-system-analyst/study-guide-tech1.html',
    paperNames: {TECH1:'Technical I · Maths, Architecture, DSA & OS', TECH2:'Technical II · OOP, Web, DBMS & Cloud', TECH3:'Technical III · Networks, SE, AI/ML & Cybersecurity'},
    resources: [
      ['Official syllabus · 30 July 2026', 'sources/informatics-officer-syllabus-2026.pdf', 'ICT Department notification; full paper structure and detailed topics.'],
      ['Official ICT publication page', 'https://dict.mizoram.gov.in/post/syllabus-for-direct-recruitment-to-the-post-of-informatics-officer-under-ict-department', 'Published 5 August 2026.'],
      ['MPSC recruitment portal', 'https://mpsconline.mizoram.gov.in/', 'Check the applicable advertisement and exam schedule.'],
      ...['i','ii','iii'].map((n,i) => [`System Analyst 2026 · Technical ${i+1} answer key`, `sources/system-analyst-technical-${n}-key.pdf`, 'User-supplied paper and bold answer key, all sets. Set A is available in Past Papers.']),
      ['System Analyst 2026 · GS final answer key', 'sources/system-analyst-gs-key.pdf', 'User-supplied final key, all sets. Historical current-affairs questions retain their exam date.'],
      ['System Analyst compensation notice · 14 September 2026', 'sources/system-analyst-compensation-2026-09-14.jpg', 'Paper I: A 56–65; B 53–61 & 65; C 52–57 & 59–62; D 51, 53–57 & 59–62. Ten questions / 20 marks compensated for printing errors. These rules belong to that System Analyst sitting.']
    ]
  };
})();
