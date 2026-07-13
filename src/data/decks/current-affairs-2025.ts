import type { FlashCard } from './types';

// ============================================
// CURRENT AFFAIRS 2025 — curated one-liners
// mined from "Current Affairs June 2025.pdf" (ok.zip).
// Topics: days, national, appointments, awards, rankings.
// Extend by appending cards (July/Aug CA PDFs are next).
// ============================================

const T = {
  days: 'Important Days',
  national: 'National & State',
  appoint: 'Appointments',
  awards: 'Awards & Honours',
  rank: 'Rankings & Reports',
} as const;

let n = 0;
const c = (topic: keyof typeof T, front: string, back: string, tags?: string[]): FlashCard => ({
  id: `ca25-${topic}-${String(++n).padStart(3, '0')}`,
  topic,
  topicLabel: T[topic],
  front,
  back,
  ...(tags ? { tags } : {}),
});

export const currentAffairs2025Cards: FlashCard[] = [
  // ---- Important Days (June 2025) ----
  c('days', 'World Milk Day 2025 — date & theme?', 'June 1 — "Let\u2019s Celebrate the Power of Dairy".'),
  c('days', 'Telangana Formation Day is observed on?', 'June 2 — marks the state\u2019s creation in 2014, separated from Andhra Pradesh.', ['states']),
  c('days', 'World Bicycle Day 2025 — date & theme?', 'June 3 — "Cycling for a Sustainable Future".'),
  c('days', 'World Environment Day 2025 — date, lead agency & theme?', 'June 5 — led by UNEP; theme "Beat Plastic Pollution".'),
  c('days', 'International Day for the Fight against IUU Fishing?', 'June 5 — against Illegal, Unreported and Unregulated fishing.'),
  c('days', 'Global Parents Day 2025 — date & theme?', 'June 1 — theme "Raising Parents", parenting as a learned, evolving skill.'),
  c('days', 'Global Forgiveness Day 2025 is observed on?', 'July 7.'),
  c('days', 'World Youth Skills Day 2025 theme?', '"Youth Empowerment Through Artificial Intelligence (AI) and Digital Skills".'),
  c('days', 'International Moon Day 2025 theme?', '"One Moon, One Vision, One Future".'),

  // ---- National & State ----
  c('national', 'World\u2019s highest railway arch bridge, inaugurated 2025?', 'Chenab Rail Bridge (359 m), J&K — completes the USBRL project.'),
  c('national', 'India\u2019s first AI SEZ is coming up at?', 'Nava Raipur, Chhattisgarh.'),
  c('national', 'India\u2019s first E-Waste Eco Park announced in?', 'Delhi (Holambi Kalan).'),
  c('national', 'Snow leopard count in Ladakh under the SPAI census?', '477 snow leopards confirmed.'),
  c('national', 'Which two wetlands joined the Ramsar List, and India\u2019s new total?', 'Khichan & Menar (Rajasthan) — India now has 91 Ramsar sites.'),
  c('national', 'India\u2019s first Butterfly Sanctuary?', 'Aralam Sanctuary, Kerala (renamed 2025).'),
  c('national', 'Dhanushkodi (Tamil Nadu) was declared a sanctuary for?', 'Greater Flamingo.'),
  c('national', 'India\u2019s first wildlife overpass is on which expressway?', 'Delhi\u2013Mumbai Expressway.'),
  c('national', 'BharatGen is?', 'India\u2019s first government-funded multimodal LLM.'),
  c('national', 'DHRUVA, launched by the Department of Posts, is?', 'A digital address system.'),
  c('national', 'Quantum Valley is planned in which city?', 'Amaravati (launch by Jan 2026).'),
  c('national', 'Gorakhpur Link Expressway cost & who inaugurated it?', '\u20B97,283 crore — inaugurated by UP CM Yogi Adityanath.'),
  c('national', 'New tiger corridor declared in Telangana (2025)?', 'Kumram Bheem Reserve.'),
  c('national', '\u20B960,000 crore ITI Upgrade Scheme targets?', 'Modernising 1,000 ITIs and skilling 20 lakh youth.'),
  c('national', 'India\u2019s first state-level industrial reform campaign?', 'Punjab "Udyog Kranti" (with the FastTrack Punjab portal).'),
  c('national', 'RECLAIM Framework, launched by the Ministry of Coal, is for?', 'Inclusive & sustainable mine closure.'),

  // ---- Appointments ----
  c('appoint', 'Three judges appointed to the Supreme Court in May 2025 (full strength 34)?', 'Justices N.V. Anjaria, Vijay Bishnoi and Atul Chandurkar.'),
  c('appoint', 'Economic Affairs Secretary appointed from July 1, 2025?', 'Anuradha Thakur — also joins SEBI and RBI Boards.'),
  c('appoint', 'Part-time member appointed to the 16th Finance Commission (2025)?', 'RBI Deputy Governor T. Rabi Sankar.'),
  c('appoint', 'Chairperson of the PM\u2019s Economic Advisory Council (2025)?', 'S. Mahendra Dev.'),
  c('appoint', 'PFRDA Chairperson who assumed charge June 20, 2025?', 'Sivasubramanian Ramann.'),
  c('appoint', 'Director of the Prime Minister\u2019s Museum & Library (June 2025)?', 'Ashwani Lohani.'),
  c('appoint', 'Union Bank of India MD & CEO appointed in 2025?', 'Asheesh Pandey (earlier ED at Bank of Maharashtra).'),
  c('appoint', 'Central Bank of India MD & CEO appointed in 2025?', 'Kalyan Kumar (earlier ED at Punjab National Bank).'),
  c('appoint', 'Recommended by FSIB as next LIC CEO & MD (2025)?', 'R. Doraiswamy (Sat Pal Bhanoo interim CEO Jun 8\u2013Sep 7).'),
  c('appoint', 'Senior Air Staff Officer, Western Air Command (June 2025)?', 'Air Marshal Jasvir Singh Mann.'),

  // ---- Awards & Honours ----
  c('awards', 'Princess of Asturias Award for Sports 2025 went to?', 'Serena Williams — 73 titles, 23 Grand Slams, 4 Olympic golds.'),
  c('awards', 'Footballer to be knighted in King Charles III\u2019s 2025 Birthday Honours?', 'David Beckham.'),
  c('awards', 'Honorary Leopard at the 78th Locarno Film Festival?', 'Alexander Payne — lifetime achievement in cinema.'),
  c('awards', 'Miss World 2025 was held in which Indian city?', 'Hyderabad (Monica Kezia Sembiring of Indonesia won the Talent Finale).'),
  c('awards', 'Food Planet Prize 2025 ($2 million) winner?', 'NitroCapt (Sweden) — eco-friendly green fertiliser innovation.'),
  c('awards', 'Indian film that won the Jury Prize at Annecy Animation Festival 2025?', '"Desi Oon" — Best Commissioned Film.'),
  c('awards', 'Grand Cross of the Order of Makarios III was conferred on?', 'PM Narendra Modi — Cyprus\u2019 highest civilian award.'),

  // ---- Rankings & Reports ----
  c('rank', 'India\u2019s rank in the Global Gender Gap Index 2025 (WEF)?', '131st — overall parity score 64.1%.'),
  c('rank', 'India\u2019s rank in the UN SDG Index 2025?', '99th of 193 countries (UN SDSN) — first time in the top 100.'),
  c('rank', 'India\u2019s rank in the Global Peace Index 2025?', '115th — released by the Institute for Economics and Peace (IEP).'),
  c('rank', 'India\u2019s rank in the WEF Energy Transition Index 2025?', '71st — published by WEF & Accenture.'),
  c('rank', 'Mumbai\u2019s global rank in under-construction data centre capacity?', '6th globally, 1st in Asia-Pacific — 335 MW (Cushman & Wakefield 2025).'),
  c('rank', 'India\u2019s rank in global power generation growth 2019\u201324 (IEA)?', '3rd.'),
  c('rank', 'SIPRI 2025 lists India among how many nations modernising nuclear arsenals?', 'Nine.'),
];
