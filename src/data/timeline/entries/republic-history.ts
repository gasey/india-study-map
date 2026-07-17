import type { TimelineEntry } from '../types';

// 1947 → today, history track: integration of the princely states, the
// wars (1947-48, 1962, 1965, 1971, Kargil), the nuclear tests, and the
// economic turning points. republic era.

export const republicHistoryEntries: TimelineEntry[] = [
  {
    id: 'rh-integration-states',
    track: 'history',
    kind: 'event',
    year: 1948,
    title: 'Integration of the Princely States',
    summary: "Patel and V.P. Menon integrate ~565 princely states; Hyderabad is annexed by 'Operation Polo' (1948).",
    detail:
      'At independence some 565 princely states had to accede to India or Pakistan. Sardar Vallabhbhai Patel and V.P. Menon secured almost all through the Instrument of Accession and persuasion. The holdouts were resolved by force or plebiscite — Junagadh (1948 referendum) and Hyderabad, annexed in the five-day police action "Operation Polo" (Sept 1948); Kashmir’s accession triggered the first war with Pakistan.',
    importance: 2,
    tags: ['integration', 'patel', 'vp-menon', 'hyderabad', 'operation-polo', 'princely-states'],
  },
  {
    id: 'rh-indo-pak-1947',
    track: 'history',
    kind: 'event',
    year: 1947,
    title: 'First Indo-Pak War (Kashmir)',
    summary: "Pakistani tribal invasion of Kashmir; the Maharaja accedes to India, and a UN-brokered ceasefire fixes the LoC.",
    detail:
      'In October 1947, tribal raiders backed by Pakistan invaded Jammu & Kashmir; Maharaja Hari Singh acceded to India, and Indian troops were airlifted to Srinagar. The 1947–48 war ended with a UN-brokered ceasefire (Jan 1949) along what became the Line of Control, leaving Kashmir divided — the origin of the enduring dispute.',
    importance: 2,
    tags: ['indo-pak-war', 'kashmir', 'line-of-control', 'accession', 'un'],
  },
  {
    id: 'rh-sino-indian-1962',
    track: 'history',
    kind: 'event',
    year: 1962,
    title: 'Sino-Indian War',
    summary: 'China defeats India in a month-long Himalayan war over Aksai Chin and the eastern border.',
    detail:
      'In October–November 1962 China launched offensives in Ladakh (Aksai Chin) and NEFA (Arunachal) amid disputes over the McMahon Line and the "Forward Policy". The Indian army, unprepared for high-altitude war, was defeated before China declared a unilateral ceasefire. The shock reshaped India’s defence posture and its non-aligned foreign policy.',
    importance: 2,
    tags: ['sino-indian-war', 'china', 'aksai-chin', 'mcmahon-line', 'nefa'],
  },
  {
    id: 'rh-indo-pak-1965',
    track: 'history',
    kind: 'event',
    year: 1965,
    title: 'Second Indo-Pak War',
    summary: "Pakistan's Operation Gibraltar in Kashmir escalates to full war; ends in the Tashkent Declaration (1966).",
    detail:
      'Pakistan’s Operation Gibraltar (infiltration into Kashmir, 1965) escalated into full-scale war along the whole front, with the largest tank battles since WWII. A UN ceasefire and the Soviet-brokered Tashkent Declaration (Jan 1966) restored the pre-war lines; Prime Minister Lal Bahadur Shastri died in Tashkent hours after signing.',
    importance: 3,
    tags: ['indo-pak-war', 'operation-gibraltar', 'tashkent', 'shastri', 'kashmir'],
  },
  {
    id: 'rh-indo-pak-1971',
    track: 'history',
    kind: 'event',
    year: 1971,
    title: 'Bangladesh War of 1971',
    summary: 'India intervenes in the East Pakistan crisis; a decisive victory creates Bangladesh.',
    detail:
      'A brutal crackdown in East Pakistan sent millions of refugees into India. In December 1971 India intervened; in a swift 13-day campaign the Pakistani eastern command surrendered at Dhaka (some 93,000 POWs), giving birth to Bangladesh. The 1972 Simla Agreement formalized the outcome and converted the Kashmir ceasefire line into the Line of Control.',
    importance: 1,
    tags: ['bangladesh-war', 'indo-pak-war', 'dhaka', 'simla-agreement', 'indira-gandhi'],
  },
  {
    id: 'rh-pokhran-1',
    track: 'history',
    kind: 'event',
    year: 1974,
    title: 'Pokhran-I ("Smiling Buddha")',
    summary: "India's first nuclear test — described as a 'peaceful nuclear explosion' — at Pokhran, Rajasthan.",
    detail:
      'On 18 May 1974 India conducted its first nuclear test, code-named "Smiling Buddha", at Pokhran — the first confirmed nuclear test by a nation outside the five recognized powers. Officially a "peaceful nuclear explosion", it triggered technology sanctions and the formation of the Nuclear Suppliers Group.',
    importance: 3,
    tags: ['pokhran', 'nuclear-test', 'smiling-buddha', 'nsg'],
  },
  {
    id: 'rh-liberalization-1991',
    track: 'history',
    kind: 'event',
    year: 1991,
    title: 'Economic Liberalization',
    summary: 'A balance-of-payments crisis forces sweeping reforms — the end of the "Licence Raj".',
    detail:
      'Facing a severe balance-of-payments crisis (foreign reserves down to weeks of imports, gold pledged abroad), the Narasimha Rao government with finance minister Manmohan Singh launched the 1991 reforms: industrial de-licensing, trade and tariff liberalization, devaluation, and openness to foreign investment — ending the "Licence Raj" and reorienting the Indian economy.',
    importance: 1,
    tags: ['liberalization', 'lpg-reforms', 'manmohan-singh', 'narasimha-rao', 'licence-raj'],
  },
  {
    id: 'rh-pokhran-2',
    track: 'history',
    kind: 'event',
    year: 1998,
    title: 'Pokhran-II & Nuclear Weapons State',
    summary: 'A series of tests declares India a nuclear-weapons state; Pakistan responds within weeks.',
    detail:
      'In May 1998 India conducted the Pokhran-II series ("Operation Shakti"), declaring itself a nuclear-weapons state, followed by a "no first use" doctrine. Pakistan tested weeks later. The tests drew international sanctions but ultimately led toward the 2008 India–US civil nuclear deal.',
    importance: 3,
    tags: ['pokhran-2', 'operation-shakti', 'nuclear-weapons', 'no-first-use'],
  },
  {
    id: 'rh-kargil-1999',
    track: 'history',
    kind: 'event',
    year: 1999,
    title: 'Kargil War',
    summary: 'India repels Pakistani intrusion across the LoC in the Kargil heights of Ladakh.',
    detail:
      'In mid-1999 Pakistani soldiers and militants occupied heights on the Indian side of the LoC around Kargil. In "Operation Vijay", the Indian army — with air power (Operation Safed Sagar) — recaptured the peaks in hard high-altitude fighting. The conflict, fought by two overtly nuclear states, ended with the restoration of the LoC.',
    importance: 2,
    tags: ['kargil', 'operation-vijay', 'loc', 'ladakh', 'indo-pak'],
  },
];
