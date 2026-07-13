import type { FlashCard } from './types';

// ============================================
// MIZORAM GS — curated from ok.zip sources:
//  • MIZORAM BUDGET 2026-27 HIGHLIGHTS.pptx
//  • Tourism in mizoram.pptx (GS V, Unit II)
//  • ISSUES RELATED TO SECURITY IN MIZORAM GS V Unit V No.4.pdf
// Extend by appending — Mizo Sakhua / Inneih Dan PDFs are
// scanned (need OCR) and will feed a Culture topic later.
// ============================================

const T = {
  budget: 'Budget 2026-27',
  tourism: 'Tourism (GS V U-II)',
  security: 'Security & Law (GS V U-V)',
} as const;

let n = 0;
const c = (topic: keyof typeof T, front: string, back: string, tags?: string[]): FlashCard => ({
  id: `mzgs-${topic}-${String(++n).padStart(3, '0')}`,
  topic,
  topicLabel: T[topic],
  front,
  back,
  ...(tags ? { tags } : {}),
});

export const mizoramGsCards: FlashCard[] = [
  // ---- Budget 2026-27 ----
  c('budget', 'Total size of the Mizoram Budget 2026-27?', '\u20B917,469.92 crore — up 14.9% over 2025-26 (\u20B915,198.76 cr).', ['mizoram']),
  c('budget', 'Revenue vs Development expenditure split in Mizoram Budget 2026-27?', 'Revenue Expenditure \u20B914,094.47 cr (82.53%); Development Expenditure \u20B93,375.43 cr (17.47%).', ['mizoram']),
  c('budget', 'Total Revenue receipts for 2026-27 and why they rose?', '\u20B914,994.31 crore — increased due to Mizoram\u2019s enhanced share in the divisible pool of central taxes.', ['mizoram']),
  c('budget', 'Mizoram\u2019s share in horizontal devolution under the 16th Finance Commission?', '0.564% (up from 0.500%).', ['mizoram']),
  c('budget', 'State\u2019s own revenue estimate for 2026-27 & growth?', '\u20B92,759.75 crore — 5.48% growth over 2025-26.', ['mizoram']),
  c('budget', 'Top contributors to Mizoram\u2019s own revenue?', 'GST 43.48%, power sector receipts 31.16%, taxes on sales & trade 7.25%.', ['mizoram']),
  c('budget', 'Revenue surplus for 2026-27 (BE)?', '\u20B9899.84 crore.', ['mizoram']),
  c('budget', 'Fiscal deficit 2025-26 vs the FRBM/16th-FC limit?', '4.58% of GSDP against the 3% limit (Mizoram FRBM Act 2006 & 16th FC).', ['mizoram']),
  c('budget', 'Debt-GSDP ratio projected for 2026-27?', '43.56%.', ['mizoram']),
  c('budget', 'Allocation for Bana Kaih (Handholding Scheme)?', '\u20B9350 crore, of which \u20B9150 crore is under "Thlaithar leina".', ['mizoram']),
  c('budget', 'Rural vs urban local body grants in Budget 2026-27?', 'Rural \u20B973 crore; urban \u20B949 crore.', ['mizoram']),
  c('budget', 'MLA Local Area Development Fund allocation?', '\u20B980 crore — \u20B92 crore per MLA.', ['mizoram']),
  c('budget', 'SDRMF (State Disaster Risk Management Fund) allocation?', '\u20B951.30 crore.', ['mizoram']),
  c('budget', 'Allocations for the state priority project and the 3rd Mizoram State Finance Commission?', '\u20B9100 crore each.', ['mizoram']),
  c('budget', 'Anticipated receipts under the road maintenance cess?', '\u20B945 crore (plus \u20B943.25 cr extra to the State Road Fund Board over its normal \u20B940 cr).', ['mizoram']),

  // ---- Tourism ----
  c('tourism', 'When did Mizoram declare tourism an "Industry"?', '18 March 1993.', ['mizoram']),
  c('tourism', 'Vision statement of the Mizoram Responsible Tourism Policy, 2020?', '"Mystical Mizoram: A Paradise for Everyone" — aligned with the National Tourism Policy (2002).', ['mizoram']),
  c('tourism', 'Core idea of the Responsible Tourism Policy 2020?', 'Inclusive, participatory and sustainable tourism benefiting visitors AND local communities — rooted in local values and environmental stewardship.', ['mizoram']),
  c('tourism', 'Four stated features of the Responsible Tourism Policy?', 'Inclusive socio-economic development; inter-departmental coordination & stakeholder engagement; preservation of cultural & natural heritage; mutual benefit for visitors and hosts.', ['mizoram']),
  c('tourism', 'Name five tourism prospects identified for Mizoram.', 'Any of: adventure/adventure-sports, wildlife & eco-tourism, cultural, heritage, village/rural homestay, nature-based, music, fashion, film, golf, wellness/herbal, religion, MICE, sports, voluntourism, weekend getaways.', ['mizoram']),
  c('tourism', 'Which connectivity project is cited as a strategic advantage for Mizoram tourism?', 'The Kaladan Multi-Modal Transit Transport Project (KMMTTP), plus the state\u2019s geopolitical location.', ['mizoram']),
  c('tourism', 'Common problems of Mizoram tourism (per GS V deck)?', 'Institutional/organisational limitations, low Foreign Tourist Arrivals, outdated practices, poor intra-state connectivity.', ['mizoram']),
  c('tourism', 'Significance of tourism for the state (5 points)?', 'Income & employment, infrastructure development, foreign exchange earnings, heritage & environment conservation, peace & stability.', ['mizoram']),
  c('tourism', 'PYQ 2025 (Mains) on tourism asked what?', 'Describe the prospects of the tourism sector in Mizoram and suggest points for its promotion — framed on "Mizoram is a high-potential state for tourism".', ['mizoram']),

  // ---- Security, Law & Order ----
  c('security', 'Which Article makes the Union responsible for protecting states against external aggression and internal disturbance?', 'Article 355 — executed through the Ministry of Home Affairs (advisories, intelligence, manpower, funds).', ['mizoram', 'constitution']),
  c('security', 'Under which Schedule/List do "public order" and "police" fall?', 'Seventh Schedule, List II (State List) — Entries 1 and 2.', ['mizoram', 'constitution']),
  c('security', 'Legal basis for Civil Defence operations in India?', 'The Civil Defence Act, 1968 — implemented in Mizoram by the Home Department per MHA directives.', ['mizoram']),
  c('security', 'Who heads the Mizoram Police, and name its specialised units.', 'The Director General of Police (DGP); units include the Crime Branch, Special Branch, Traffic Police and Armed Police.', ['mizoram']),
  c('security', 'Mizoram\u2019s literacy milestone per PLFS 2023-24?', '98.2% literacy — declared the first fully literate state in India.', ['mizoram']),
  c('security', 'Which Mizo moral code reinforces peaceful social conduct?', 'Tlawmngaihna — selflessness and service; part of the close-knit community structure.', ['mizoram']),
  c('security', 'Which district accounts for over 50% of Mizoram\u2019s crime cases?', 'Aizawl — mostly petty thefts, burglaries and Mizoram Liquor (Prohibition) Act, 2019 violations.', ['mizoram', 'aizawl']),
  c('security', 'Role of the Mizoram Home Guards & Civil Defence?', 'A wing of the Home Department: security at correctional facilities and financial institutions, rescue/relief, mock drills and blackout exercises.', ['mizoram']),
  c('security', 'Which grassroots institutions aid dispute resolution in Mizoram?', 'Traditional village councils — alongside police, district administration and the judiciary.', ['mizoram']),
  c('security', 'Which civil-society actors support law and order in Mizoram?', 'NGOs, student bodies and church-based institutions — active in peace promotion, crime prevention and rehabilitation.', ['mizoram']),
];
