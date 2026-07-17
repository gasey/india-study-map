import type { TimelineEntry } from '../types';

// 1885 → 1947: the organized national movement — Congress, the Swadeshi
// years, the Gandhian mass movements, and the road to Partition.
// crown-freedom era. Mostly history track, a couple of polity-track Acts.

export const freedomStruggleEntries: TimelineEntry[] = [
  {
    id: 'fs-inc-founded',
    track: 'history',
    kind: 'event',
    year: 1885,
    title: 'Indian National Congress Founded',
    summary: 'A.O. Hume and Indian moderates found the INC in Bombay — the platform of the national movement.',
    detail:
      'Founded in December 1885 (first president W.C. Bonnerjee, with A.O. Hume’s backing), the Congress began as a moderate body of educated professionals petitioning for reform, representation, and a share in administration. Its early "prayer and petition" methods (Naoroji, Gokhale, Ranade) later gave way to more assertive politics.',
    importance: 1,
    tags: ['congress', 'inc', 'moderates', 'hume', 'naoroji'],
  },
  {
    id: 'fs-partition-bengal',
    track: 'history',
    kind: 'event',
    year: 1905,
    title: 'Partition of Bengal & Swadeshi',
    summary: "Curzon's partition of Bengal sparks the Swadeshi and Boycott movement and the rise of the Extremists.",
    detail:
      'Lord Curzon’s 1905 partition of Bengal, ostensibly administrative but seen as divide-and-rule, ignited the Swadeshi (buy-Indian) and Boycott movements led by the Extremists (Tilak, Bipin Chandra Pal, Lala Lajpat Rai — "Lal-Bal-Pal") and Aurobindo. Mass agitation forced its annulment in 1911; the movement widened nationalist participation and methods.',
    importance: 2,
    tags: ['partition-bengal', 'swadeshi', 'boycott', 'curzon', 'extremists'],
  },
  {
    id: 'fs-morley-minto',
    track: 'polity',
    kind: 'event',
    year: 1909,
    title: 'Morley-Minto Reforms (Indian Councils Act)',
    summary: 'Expands legislative councils but introduces separate electorates for Muslims — a fateful precedent.',
    detail:
      'The Indian Councils Act 1909 enlarged the legislative councils and allowed limited Indian election, but its introduction of separate communal electorates for Muslims (a demand of the 1906 Simla Deputation / Muslim League) institutionalized religious division in representation — a step whose consequences ran to Partition.',
    importance: 3,
    tags: ['morley-minto', 'indian-councils-act', 'separate-electorates', 'muslim-league'],
  },
  {
    id: 'fs-goi-act-1919',
    track: 'polity',
    kind: 'event',
    year: 1919,
    title: 'Government of India Act 1919 (Montagu-Chelmsford)',
    summary: 'Introduces dyarchy in the provinces — a limited, disappointing devolution of power.',
    detail:
      'Based on the Montagu-Chelmsford Report, the 1919 Act introduced dyarchy in the provinces (splitting subjects into "transferred" and "reserved"), a bicameral central legislature, and a wider but still tiny franchise. Widely seen as too little, it fuelled rather than satisfied nationalist demands.',
    importance: 3,
    tags: ['montagu-chelmsford', 'government-of-india-act', 'dyarchy'],
  },
  {
    id: 'fs-jallianwala',
    track: 'history',
    kind: 'event',
    year: 1919,
    title: 'Rowlatt Act & Jallianwala Bagh',
    summary: 'The repressive Rowlatt Act and the Amritsar massacre turn moderate opinion decisively against the Raj.',
    detail:
      'The Rowlatt Act (1919) extended wartime detention-without-trial into peacetime, provoking Gandhi’s first all-India satyagraha. On 13 April 1919, General Dyer’s troops fired on a penned-in crowd at Jallianwala Bagh in Amritsar, killing hundreds. The massacre — and the official whitewash — shattered faith in British justice and propelled the Non-Cooperation Movement.',
    importance: 2,
    tags: ['rowlatt-act', 'jallianwala-bagh', 'amritsar', 'dyer', 'satyagraha'],
  },
  {
    id: 'fs-non-cooperation',
    track: 'history',
    kind: 'period',
    year: 1920,
    endYear: 1922,
    title: 'Non-Cooperation Movement',
    summary: "Gandhi's first mass movement — boycott of titles, schools, courts, and goods — called off after Chauri Chaura.",
    detail:
      'Launched with the Khilafat cause, Non-Cooperation (1920–22) mobilized millions in a boycott of British titles, institutions, courts, and foreign cloth, and the promotion of khadi and swadeshi. Gandhi abruptly suspended it after the Chauri Chaura violence (Feb 1922), insisting on non-violence — a decision that split the movement but defined its method.',
    importance: 2,
    tags: ['non-cooperation', 'gandhi', 'khilafat', 'chauri-chaura', 'khadi'],
  },
  {
    id: 'fs-simon-commission',
    track: 'history',
    kind: 'event',
    year: 1928,
    title: 'Simon Commission & "Go Back"',
    summary: 'An all-British statutory commission is met with "Simon Go Back"; Lala Lajpat Rai is fatally injured.',
    detail:
      'The all-white Simon Commission (1927–28), appointed to review the 1919 Act with no Indian member, was boycotted nationwide with black flags and "Simon Go Back". A lathi-charge at Lahore fatally injured Lala Lajpat Rai. The affront spurred the Indian-drafted Nehru Report (1928) and, at Lahore (1929), the Congress demand for Purna Swaraj (complete independence).',
    importance: 3,
    tags: ['simon-commission', 'lala-lajpat-rai', 'nehru-report', 'purna-swaraj'],
  },
  {
    id: 'fs-civil-disobedience',
    track: 'history',
    kind: 'period',
    year: 1930,
    endYear: 1934,
    title: 'Civil Disobedience & the Salt March',
    summary: "Gandhi's Dandi March breaks the salt law, launching a nationwide civil disobedience campaign.",
    detail:
      'On 12 March 1930 Gandhi began the 240-mile Dandi March to make salt in defiance of the salt monopoly, triggering mass civil disobedience — non-payment of taxes, boycott, and the breaking of colonial laws. The movement, punctuated by the Gandhi-Irwin Pact (1931) and the Round Table Conferences, drew unprecedented participation, notably by women.',
    importance: 2,
    tags: ['civil-disobedience', 'salt-march', 'dandi', 'gandhi', 'round-table'],
  },
  {
    id: 'fs-poona-pact',
    track: 'history',
    kind: 'event',
    year: 1932,
    title: 'Poona Pact',
    summary: 'Gandhi and Ambedkar agree on reserved seats for Depressed Classes within a joint electorate.',
    detail:
      'After the Communal Award granted separate electorates to the Depressed Classes, Gandhi’s fast unto death led to the Poona Pact (1932) between Gandhi and B.R. Ambedkar: reserved seats for the Depressed Classes within the general (joint) Hindu electorate rather than separate electorates — a landmark, and contested, moment in the politics of caste.',
    importance: 3,
    tags: ['poona-pact', 'ambedkar', 'gandhi', 'communal-award', 'depressed-classes'],
  },
  {
    id: 'fs-goi-act-1935',
    track: 'polity',
    kind: 'event',
    year: 1935,
    title: 'Government of India Act 1935',
    summary: 'Provincial autonomy and an (unimplemented) all-India federation — the direct template for the 1950 Constitution.',
    detail:
      'The 1935 Act — the longest British statute of its time — introduced provincial autonomy (ending dyarchy in provinces, applying it at the centre), a proposed all-India federation with the princely states (never implemented), a Federal Court, and an enlarged franchise. Much of its administrative scaffolding was carried directly into the Constitution of India.',
    importance: 2,
    tags: ['government-of-india-act', 'provincial-autonomy', 'federation', 'federal-court'],
  },
  {
    id: 'fs-quit-india',
    track: 'history',
    kind: 'event',
    year: 1942,
    title: 'Quit India Movement',
    summary: "Gandhi's 'Do or Die' call launches the final mass movement demanding immediate British withdrawal.",
    detail:
      'Launched at Bombay in August 1942 after the failure of the Cripps Mission, Quit India demanded an immediate end to British rule. The Congress leadership was jailed at once, and the leaderless movement turned into a wave of strikes, sabotage, and parallel governments (Satara, Ballia) — brutally suppressed but proof that the Raj could no longer govern by consent.',
    importance: 2,
    tags: ['quit-india', 'gandhi', 'cripps-mission', 'do-or-die'],
    linksTo: ['fs-independence'],
  },
  {
    id: 'fs-ina-bose',
    track: 'history',
    kind: 'event',
    year: 1943,
    title: 'Subhas Bose & the INA',
    summary: 'Bose leads the Azad Hind Fauj alongside Japan; the postwar INA trials galvanize national feeling.',
    detail:
      'Subhas Chandra Bose, having left the Congress, formed the Azad Hind government and revived the Indian National Army (INA) with Japanese support, marching toward the northeast frontier (Imphal-Kohima, 1944). Though militarily defeated, the 1945–46 INA trials at the Red Fort provoked huge public sympathy and unrest in the armed forces (the 1946 RIN Mutiny), hastening British departure.',
    importance: 3,
    tags: ['ina', 'subhas-bose', 'azad-hind', 'red-fort-trials'],
  },
  {
    id: 'fs-cabinet-mission',
    track: 'polity',
    kind: 'event',
    year: 1946,
    title: 'Cabinet Mission & Constituent Assembly',
    summary: 'The Cabinet Mission Plan frames a path to independence; the Constituent Assembly is elected to draft the Constitution.',
    detail:
      'The 1946 Cabinet Mission rejected a full Pakistan but proposed a loose three-tier federation and a Constituent Assembly, elected indirectly by the provincial assemblies, to frame India’s constitution. The League’s withdrawal and "Direct Action Day" (Aug 1946) unleashed communal violence, but the Assembly (first met 9 Dec 1946) began the work that produced the Constitution.',
    importance: 2,
    tags: ['cabinet-mission', 'constituent-assembly', 'direct-action', 'partition'],
    linksTo: ['pol-constitution-adopted'],
  },
  {
    id: 'fs-independence',
    track: 'history',
    kind: 'event',
    year: 1947,
    title: 'Independence & Partition',
    summary: 'India becomes independent at midnight on 15 August 1947, partitioned into India and Pakistan.',
    detail:
      'The Indian Independence Act 1947 (following the Mountbatten Plan of 3 June) partitioned British India into two dominions. Independence came at midnight on 14–15 August 1947, but the Radcliffe Line split Punjab and Bengal, triggering one of history’s largest and bloodiest migrations — up to a million dead and some fifteen million displaced.',
    importance: 1,
    tags: ['independence', 'partition', 'mountbatten', 'radcliffe', 'freedom-struggle'],
    chapterId: 'freedom-struggle-map',
  },
];
