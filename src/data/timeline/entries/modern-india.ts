import type { TimelineEntry } from '../types';

// 1746 → 1858: Company conquest (Carnatic, Mysore, Maratha, Sikh wars),
// the great battles, land settlements, and the 1857 revolt that ends
// Company rule. company + crown-freedom eras. History track, with a few
// polity-track Acts threaded through the same span.

export const modernIndiaEntries: TimelineEntry[] = [
  {
    id: 'mod-carnatic-wars',
    track: 'history',
    kind: 'period',
    year: 1746,
    endYear: 1763,
    title: 'Carnatic Wars',
    summary: 'Anglo-French contest for south India; the English East India Company emerges as the dominant European power.',
    detail:
      'Three Carnatic Wars (1746–48, 1749–54, 1756–63), fought as extensions of European wars and over succession disputes in the Carnatic and Hyderabad, pitted the English Company against the French under Dupleix. The decisive English victory (aided by the Battle of Wandiwash, 1760) ended French political ambitions and left the English pre-eminent in the south.',
    importance: 3,
    tags: ['carnatic-wars', 'east-india-company', 'french', 'dupleix', 'wandiwash'],
  },
  {
    id: 'mod-plassey',
    track: 'history',
    kind: 'event',
    year: 1757,
    title: 'Battle of Plassey',
    summary: 'Clive defeats Siraj-ud-Daulah; the Company gains its first real territorial foothold in Bengal.',
    detail:
      "Fought 23 June 1757, the battle was decided less by arms than by conspiracy: the defection of Mir Jafar and other Bengal notables, arranged by Robert Clive, collapsed the Nawab Siraj-ud-Daulah's much larger army in under a day. It opened the door to Company control over the richest province in India.",
    importance: 1,
    tags: ['bengal', 'east-india-company', 'plassey', 'clive', 'mir-jafar'],
    chapterId: 'battle-of-plassey',
    linksTo: ['mod-buxar'],
  },
  {
    id: 'mod-buxar',
    track: 'history',
    kind: 'event',
    year: 1764,
    title: 'Battle of Buxar',
    summary: 'Company defeats the combined forces of Bengal, Awadh, and the Mughal emperor — far more decisive than Plassey.',
    detail:
      'On 22 October 1764 the Company under Hector Munro defeated the allied armies of Mir Qasim (Bengal), Shuja-ud-Daulah (Awadh), and the Mughal emperor Shah Alam II. It led directly to the Treaty of Allahabad (1765) and the grant of the Diwani — the right to collect revenue in Bengal, Bihar, and Odisha — the true legal foundation of Company rule.',
    importance: 2,
    tags: ['bengal', 'east-india-company', 'buxar', 'diwani', 'allahabad'],
  },
  {
    id: 'mod-bengal-famine-1770',
    track: 'history',
    kind: 'event',
    year: 1770,
    title: 'Great Bengal Famine',
    summary: 'Roughly a third of Bengal perishes; early Company revenue extraction and drought combine catastrophically.',
    detail:
      'The famine of 1770 killed an estimated ten million people — around a third of Bengal — as drought met the Company’s rigid, still-collected land revenue and grain speculation. It exposed the ruinous effects of the dual government (Company revenue, Nawabi administration) and hastened parliamentary intervention.',
    importance: 3,
    tags: ['bengal-famine', 'east-india-company', 'dual-government'],
  },
  {
    id: 'mod-regulating-act',
    track: 'polity',
    kind: 'event',
    year: 1773,
    title: 'Regulating Act',
    summary: "Parliament's first attempt to control the Company's Indian affairs — creates the Governor-General of Bengal.",
    detail:
      'The Regulating Act of 1773 made the Governor of Bengal the Governor-General of Bengal (Warren Hastings the first), with an executive council and a Supreme Court at Calcutta (1774), and subordinated Bombay and Madras to Bengal. A first, flawed step in Crown oversight of the Company.',
    importance: 2,
    tags: ['regulating-act', 'governor-general', 'warren-hastings', 'bengal'],
  },
  {
    id: 'mod-pitts-india-act',
    track: 'polity',
    kind: 'event',
    year: 1784,
    title: "Pitt's India Act",
    summary: 'Creates the Board of Control, establishing dual government of Company and Crown over Indian affairs.',
    detail:
      "Pitt's India Act placed the Company’s political affairs under a Board of Control representing the Crown, while commerce stayed with the Court of Directors — the ‘double government’ that lasted until 1858. It also barred aggressive expansion in principle (soon ignored).",
    importance: 3,
    tags: ['pitts-india-act', 'board-of-control', 'dual-government'],
  },
  {
    id: 'mod-mysore-wars',
    track: 'history',
    kind: 'period',
    year: 1767,
    endYear: 1799,
    title: 'Anglo-Mysore Wars',
    summary: 'Four wars against Hyder Ali and Tipu Sultan; Mysore falls at Seringapatam (1799).',
    detail:
      'Hyder Ali and his son Tipu Sultan built a formidable, French-allied Mysore that fought the Company in four wars (1767–99). Tipu — the "Tiger of Mysore", an early user of iron-cased rockets — was killed defending his capital at the Battle of Seringapatam (1799), removing the strongest south-Indian check on Company power.',
    importance: 2,
    tags: ['mysore', 'hyder-ali', 'tipu-sultan', 'seringapatam'],
  },
  {
    id: 'mod-permanent-settlement',
    track: 'history',
    kind: 'event',
    year: 1793,
    title: 'Permanent Settlement of Bengal',
    summary: 'Cornwallis fixes land revenue in perpetuity with zamindars as proprietors — reshaping rural Bengal.',
    detail:
      'Introduced by Lord Cornwallis, the Permanent Settlement made zamindars hereditary landowners liable for a fixed, unchanging revenue. It created a loyal landlord class but immiserated cultivators and, by fixing the demand, cost the state buoyant revenue as prices rose. Contrast with the later Ryotwari (Munro) and Mahalwari systems.',
    importance: 3,
    tags: ['permanent-settlement', 'cornwallis', 'zamindari', 'land-revenue'],
  },
  {
    id: 'mod-maratha-wars',
    track: 'history',
    kind: 'period',
    year: 1775,
    endYear: 1818,
    title: 'Anglo-Maratha Wars',
    summary: 'Three wars dismantle the Maratha confederacy, leaving the Company paramount across most of India.',
    detail:
      'The First (1775–82, Treaty of Salbai), Second (1803–05), and Third (1817–18) Anglo-Maratha Wars — waged partly through Wellesley’s Subsidiary Alliance system — broke the Scindia, Holkar, Bhonsle, and Peshwa powers. The Peshwa was pensioned off in 1818, making the Company the paramount power in the subcontinent.',
    importance: 2,
    tags: ['maratha-wars', 'subsidiary-alliance', 'wellesley', 'peshwa'],
  },
  {
    id: 'mod-sikh-wars',
    track: 'history',
    kind: 'period',
    year: 1845,
    endYear: 1849,
    title: 'Anglo-Sikh Wars & Annexation of Punjab',
    summary: 'Two wars end the Sikh Empire; Punjab is annexed in 1849, completing British conquest of the subcontinent.',
    detail:
      'After Ranjit Singh’s death, the First (1845–46) and Second (1848–49) Anglo-Sikh Wars — hard-fought battles like Sobraon and Chillianwala — ended in Dalhousie’s annexation of the Punjab in 1849. The Koh-i-Noor passed to the British Crown; the last major independent Indian power was gone.',
    importance: 3,
    tags: ['sikh-wars', 'punjab', 'dalhousie', 'annexation'],
  },
  {
    id: 'mod-doctrine-of-lapse',
    track: 'history',
    kind: 'event',
    year: 1848,
    title: 'Doctrine of Lapse',
    summary: "Dalhousie's annexation policy voids adopted heirs' succession — a major grievance behind 1857.",
    detail:
      'Under Governor-General Dalhousie, the Doctrine of Lapse annexed princely states whose rulers died without a natural heir (Satara, Jhansi, Nagpur, and others), rejecting adopted successors. Combined with the annexation of Awadh (1856) on grounds of misgovernment, it deeply alarmed Indian rulers and helped ignite the Revolt of 1857.',
    importance: 3,
    tags: ['doctrine-of-lapse', 'dalhousie', 'annexation', 'awadh', 'jhansi'],
  },
  {
    id: 'mod-1857-revolt',
    track: 'history',
    kind: 'event',
    year: 1857,
    title: 'Revolt of 1857',
    summary: "Sepoy uprising beginning at Meerut spreads across north India — the Company's rule ends in its aftermath.",
    detail:
      "Triggered by the greased-cartridge rumour but rooted in political annexations, economic distress, and military grievances, the revolt spread from Meerut to Delhi (Bahadur Shah Zafar proclaimed leader), Kanpur (Nana Sahib), Jhansi (Rani Lakshmibai), and Awadh (Begum Hazrat Mahal). Suppressed by 1858, it ended Company rule and Mughal sovereignty alike — India's 'First War of Independence' to nationalists, a 'mutiny' to the British.",
    importance: 1,
    tags: ['1857-revolt', 'sepoy-mutiny', 'meerut', 'rani-lakshmibai', 'bahadur-shah'],
    linksTo: ['mod-crown-rule'],
  },
  {
    id: 'mod-crown-rule',
    track: 'polity',
    kind: 'period',
    year: 1858,
    endYear: 1947,
    title: 'Crown Rule (British Raj)',
    summary: 'Government of India Act 1858 transfers power from the Company to the Crown; a Viceroy replaces the Governor-General.',
    detail:
      'The Government of India Act 1858 abolished the Company and the Board of Control, vesting rule in the Crown through a Secretary of State for India and a Viceroy (Canning the first). Queen Victoria’s Proclamation promised non-interference in religion and equal treatment — pledges the freedom struggle would repeatedly test.',
    importance: 1,
    tags: ['government-of-india-act', 'crown-rule', 'viceroy', 'secretary-of-state'],
  },
];
