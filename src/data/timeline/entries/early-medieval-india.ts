import type { TimelineEntry } from '../types';

// c. 550–1206: regional kingdoms (Chalukyas, Pallavas, Rashtrakutas),
// the tripartite struggle for Kannauj, the imperial Cholas, the Rajputs,
// and the first Islamic incursions (Arab Sindh, Ghaznavids, Ghurids).
// early-medieval era, history track.

export const earlyMedievalIndiaEntries: TimelineEntry[] = [
  {
    id: 'em-chalukya-pallava',
    track: 'history',
    kind: 'period',
    year: 543,
    endYear: 897,
    circa: true,
    title: 'Chalukyas & Pallavas',
    summary: 'Deccan–south rivalry: Chalukyas of Badami and Pallavas of Kanchi, patrons of the first great stone temples.',
    detail:
      'The Chalukyas of Badami (Vatapi), founded by Pulakeshin I, peaked under Pulakeshin II, who checked Harsha but fell to the Pallava Narasimhavarman I. The Pallavas of Kanchi pioneered Dravidian temple architecture at Mahabalipuram (rathas, Shore Temple). Their long conflict shaped early-medieval south India before the Rashtrakutas eclipsed the Chalukyas.',
    importance: 3,
    tags: ['chalukya', 'pallava', 'badami', 'kanchi', 'mahabalipuram', 'dravidian'],
  },
  {
    id: 'em-arab-sindh',
    track: 'history',
    kind: 'event',
    year: 712,
    title: 'Arab Conquest of Sindh',
    summary: 'Muhammad bin Qasim conquers Sindh for the Umayyad Caliphate — the first Muslim political foothold in India.',
    detail:
      "Sent by the Umayyad governor al-Hajjaj, the young general Muhammad bin Qasim defeated Raja Dahir and took Sindh and Multan in 712 CE. Though limited in extent and largely contained thereafter, it established the first enduring Muslim presence in the subcontinent and a template of jizya and local accommodation.",
    importance: 3,
    tags: ['arab', 'sindh', 'muhammad-bin-qasim', 'umayyad', 'dahir'],
  },
  {
    id: 'em-tripartite-struggle',
    track: 'history',
    kind: 'period',
    year: 750,
    endYear: 950,
    circa: true,
    title: 'Tripartite Struggle for Kannauj',
    summary: 'Gurjara-Pratiharas, Palas, and Rashtrakutas contest Kannauj, the symbolic throne of the north.',
    detail:
      'For two centuries the Gurjara-Pratiharas (west/north India, Bhoja I), the Palas of Bengal-Bihar (Dharmapala, Devapala; great patrons of Nalanda and Vikramshila), and the Rashtrakutas of the Deccan (Amoghavarsha; the Kailasa temple at Ellora) fought over Kannauj. The stalemate exhausted all three and left a fragmented north exposed to later raids.',
    importance: 2,
    tags: ['pratihara', 'pala', 'rashtrakuta', 'kannauj', 'ellora'],
  },
  {
    id: 'em-chola-empire',
    track: 'history',
    kind: 'period',
    year: 848,
    endYear: 1279,
    circa: true,
    title: 'Imperial Cholas',
    summary: 'South India’s great maritime empire — Rajaraja I and Rajendra I project power across the Indian Ocean.',
    detail:
      'The imperial Cholas revived from Vijayalaya. Rajaraja I built the Brihadeeswarar (Thanjavur) temple and conquered Sri Lanka and the Maldives; his son Rajendra I marched to the Ganga (taking the title Gangaikonda) and launched a naval expedition against Srivijaya in Southeast Asia. Notable for sophisticated local self-government (Uttaramerur inscriptions), bronze sculpture, and Indian Ocean trade.',
    importance: 2,
    tags: ['chola', 'rajaraja', 'rajendra', 'thanjavur', 'maritime', 'uttaramerur'],
  },
  {
    id: 'em-rajput-kingdoms',
    track: 'history',
    kind: 'period',
    year: 900,
    endYear: 1200,
    circa: true,
    title: 'Rajput Kingdoms',
    summary: 'Chahamanas, Chandelas, Paramaras, Solankis and others dominate north-central India before the Ghurid conquest.',
    detail:
      'The post-Pratihara north fragmented into Rajput dynasties — Chahamanas (Chauhans) of Ajmer, Chandelas of Bundelkhand (Khajuraho temples), Paramaras of Malwa (Raja Bhoja), Solankis (Chaulukyas) of Gujarat, and the Tomaras of Delhi. Their mutual rivalry and code of chivalric war left them unable to combine against the Ghurids.',
    importance: 3,
    tags: ['rajput', 'chauhan', 'chandela', 'khajuraho', 'paramara'],
  },
  {
    id: 'em-mahmud-ghazni',
    track: 'history',
    kind: 'event',
    year: 1025,
    circa: true,
    title: 'Mahmud of Ghazni’s Raids',
    summary: 'Seventeen plundering raids from Afghanistan into north-west India, culminating in the sack of Somnath (1025).',
    detail:
      'Mahmud of Ghazni raided India some seventeen times between c. 1000 and 1027, targeting wealthy temple-towns — most infamously the sack of the Somnath temple in Gujarat (1025). His campaigns were extractive rather than settling, but they exposed the wealth and disunity of the north and annexed the Punjab to the Ghaznavid realm. Al-Biruni, in his retinue, wrote the Kitab-ul-Hind.',
    importance: 3,
    tags: ['ghazni', 'mahmud', 'somnath', 'al-biruni', 'raids'],
  },
  {
    id: 'em-tarain',
    track: 'history',
    kind: 'event',
    year: 1192,
    title: 'Battles of Tarain (1191–1192)',
    summary: 'Prithviraj Chauhan beats Muhammad Ghori in 1191 but is defeated in 1192 — opening the north to Turkish rule.',
    detail:
      'At the First Battle of Tarain (1191) the Chahamana ruler Prithviraj III repelled Muhammad Ghori. In the Second Battle of Tarain (1192) Ghori returned with a disciplined mounted-archer army and crushed the Rajput confederacy. The victory shattered Rajput power in the Ganga plains and, via Ghori’s general Qutb-ud-din Aibak, led directly to the founding of the Delhi Sultanate.',
    importance: 2,
    tags: ['tarain', 'prithviraj-chauhan', 'muhammad-ghori', 'ghurid'],
    linksTo: ['med-delhi-sultanate'],
  },
];
