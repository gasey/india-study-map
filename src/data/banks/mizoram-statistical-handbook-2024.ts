import type { BankQuestion, QuestionBank } from './types';

// ============================================
// MIZORAM STATISTICAL HANDBOOK 2024 — QUESTION BANK
//
// Source: "Statistical Handbook Mizoram 2024" (25th in the series),
// Directorate of Economics & Statistics, Government of Mizoram.
// Published 2025. 279 pp., 48 chapters.
//
// 169 MCQs + 7 descriptive/essay questions across 16 topics.
//
// PROVENANCE: every figure was transcribed from the source PDF in this
// repo's usual way — `pdftotext -layout` for the tables, plus direct
// page-image reads for the dense bilingual "Mizoram at a Glance" and
// "State Information" pages (pp. v-xiv), which the text extractor
// mangles. Questions were written only from figures verified against
// one of those two views.
//
// `answerSource` is 'derived' throughout: these are authored questions,
// not questions from a published MPSC paper with an official key. The
// underlying STATISTICS are official; the question framing is not.
//
// KNOWN SOURCE INCONSISTENCIES that questions deliberately avoid or
// explicitly disambiguate (the handbook itself is not self-consistent):
//   - Mizoram's Census 2011 population is 10,97,206 in the state
//     chapters but 10,91,014 in the All-India chapter (Table 47.1);
//     literacy likewise 91.33% vs 91.58%. Questions name the table.
//   - Forest cover is quoted against BOTH ISFR 2021 (17,820.03 sq km,
//     84.53%) and ISFR 2023 (17,990.46 sq km, 85.34%). Questions always
//     state which report.
//   - Annual normal rainfall is 2,090.33 mm in Table 2.1 but 2,213.51 mm
//     in Table 2.2. Only the Table 2.1 figure is used, and it is named.
//   - Table 20.3's per-district "% electrified" column does not
//     reconcile with its own village counts (e.g. Kolasib 36/36 shown as
//     99.21%), so only the counts and the state total are used.
//   - Table 13.6 files Dampa Tiger Reserve under the "National Park"
//     heading; the National Parks question notes that Mizoram has two
//     (Murlen, Phawngpui) and that Dampa is a tiger reserve.
//   - Table 24.10 (drop-out rate) is entirely NA and Table 24.11 (GER)
//     prints ratios rather than percentages, so neither is used.
// ============================================

export const mizoramStatHandbook2024Questions: BankQuestion[] = [
  {
    id: "mzshb24-geo-area-001",
    type: "mcq",
    subject: "geography",
    topic: "geo_area",
    topicLabel: "Geography, Area & Boundaries",
    difficulty: "easy",
    question: "What is the total geographical area of Mizoram?",
    options: [
      "21,081 sq km",
      "22,327 sq km",
      "20,081 sq km",
      "16,579 sq km"
    ],
    answerIndex: 0,
    explanation: "Mizoram's geographical area is 21,081 sq km (Mizoram at a Glance, SN 2). The same figure is used as the denominator in the forest-cover tables, where total forest cover of 17,990.46 sq km works out to 85.34% of 21,081 sq km.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "geography",
      "area"
    ]
  },
  {
    id: "mzshb24-geo-area-002",
    type: "mcq",
    subject: "geography",
    topic: "geo_area",
    topicLabel: "Geography, Area & Boundaries",
    difficulty: "medium",
    question: "Mizoram's longitudinal extent, as given in the Statistical Handbook, is:",
    options: [
      "92°15' E to 93°29' E",
      "91°15' E to 92°29' E",
      "92°58' E to 94°35' E",
      "93°15' E to 94°29' E"
    ],
    answerIndex: 0,
    explanation: "Mizoram lies between 92°15' E and 93°29' E longitude, and between 21°58' N and 24°35' N latitude (Mizoram at a Glance, SN 3).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "geography",
      "coordinates",
      "tropic-of-cancer"
    ]
  },
  {
    id: "mzshb24-geo-area-003",
    type: "mcq",
    subject: "geography",
    topic: "geo_area",
    topicLabel: "Geography, Area & Boundaries",
    difficulty: "medium",
    question: "Mizoram's latitudinal extent is:",
    options: [
      "21°58' N to 24°35' N",
      "21°15' N to 23°29' N",
      "22°58' N to 25°35' N",
      "20°58' N to 23°35' N"
    ],
    answerIndex: 0,
    explanation: "Mizoram extends from 21°58' N to 24°35' N latitude (Mizoram at a Glance, SN 3). Note the Tropic of Cancer (23°26' N) passes through the state.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "geography",
      "coordinates",
      "tropic-of-cancer"
    ]
  },
  {
    id: "mzshb24-geo-area-004",
    type: "mcq",
    subject: "geography",
    topic: "geo_area",
    topicLabel: "Geography, Area & Boundaries",
    difficulty: "medium",
    question: "What are the north-to-south and east-to-west lengths of Mizoram respectively?",
    options: [
      "277 km and 121 km",
      "121 km and 277 km",
      "310 km and 180 km",
      "277 km and 210 km"
    ],
    answerIndex: 0,
    explanation: "Mizoram measures 277 km from north to south and 121 km from east to west (Mizoram at a Glance, SN 4) — a markedly elongated north–south shape.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "geography",
      "extent"
    ]
  },
  {
    id: "mzshb24-geo-area-005",
    type: "mcq",
    subject: "geography",
    topic: "geo_area",
    topicLabel: "Geography, Area & Boundaries",
    difficulty: "easy",
    question: "Mizoram shares its longest international border with which country?",
    options: [
      "Myanmar",
      "Bangladesh",
      "China",
      "Bhutan"
    ],
    answerIndex: 0,
    explanation: "Mizoram shares a 510 km border with Myanmar and a 318 km border with Bangladesh (Mizoram at a Glance, SN 5) — a total international boundary of 828 km.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "geography",
      "borders",
      "myanmar",
      "northeast"
    ]
  },
  {
    id: "mzshb24-geo-area-006",
    type: "mcq",
    subject: "geography",
    topic: "geo_area",
    topicLabel: "Geography, Area & Boundaries",
    difficulty: "medium",
    question: "The length of Mizoram's international border with Bangladesh is:",
    options: [
      "318 km",
      "510 km",
      "404 km",
      "123 km"
    ],
    answerIndex: 0,
    explanation: "Mizoram's border with Bangladesh runs 318 km; the Myanmar border runs 510 km (Mizoram at a Glance, SN 5).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "geography",
      "borders",
      "bangladesh",
      "northeast"
    ]
  },
  {
    id: "mzshb24-geo-area-007",
    type: "mcq",
    subject: "geography",
    topic: "geo_area",
    topicLabel: "Geography, Area & Boundaries",
    difficulty: "hard",
    question: "Mizoram's total international boundary length (Myanmar + Bangladesh) is:",
    options: [
      "828 km",
      "784 km",
      "892 km",
      "740 km"
    ],
    answerIndex: 0,
    explanation: "510 km (Myanmar) + 318 km (Bangladesh) = 828 km. By contrast the total inter-State boundary is only 284 km (Assam 123 + Manipur 95 + Tripura 66), so Mizoram's international border is nearly three times its domestic one.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "geography",
      "borders",
      "northeast",
      "assam",
      "tripura"
    ]
  },
  {
    id: "mzshb24-geo-area-008",
    type: "mcq",
    subject: "geography",
    topic: "geo_area",
    topicLabel: "Geography, Area & Boundaries",
    difficulty: "hard",
    question: "Match Mizoram's inter-State boundary lengths: Assam, Tripura and Manipur respectively.",
    options: [
      "123 km, 66 km, 95 km",
      "95 km, 123 km, 66 km",
      "66 km, 95 km, 123 km",
      "123 km, 95 km, 66 km"
    ],
    answerIndex: 0,
    explanation: "Mizoram's inter-State borders are Assam 123 km, Tripura 66 km and Manipur 95 km (Mizoram at a Glance, SN 6). Assam is the longest, Tripura the shortest.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "geography",
      "borders",
      "assam",
      "tripura",
      "manipur",
      "northeast"
    ]
  },
  {
    id: "mzshb24-geo-area-009",
    type: "mcq",
    subject: "geography",
    topic: "geo_area",
    topicLabel: "Geography, Area & Boundaries",
    difficulty: "medium",
    question: "Which State shares the longest inter-State boundary with Mizoram?",
    options: [
      "Assam",
      "Manipur",
      "Tripura",
      "Nagaland"
    ],
    answerIndex: 0,
    explanation: "Assam, at 123 km, has the longest inter-State boundary with Mizoram, ahead of Manipur (95 km) and Tripura (66 km). Nagaland does not border Mizoram.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "geography",
      "borders",
      "assam",
      "northeast",
      "tripura"
    ]
  },
  {
    id: "mzshb24-geo-area-010",
    type: "mcq",
    subject: "geography",
    topic: "geo_area",
    topicLabel: "Geography, Area & Boundaries",
    difficulty: "easy",
    question: "How many districts does Mizoram have, as recorded in the Statistical Handbook 2024?",
    options: [
      "11",
      "8",
      "9",
      "12"
    ],
    answerIndex: 0,
    explanation: "Mizoram has 11 districts (Mizoram at a Glance, SN 7). The three newest — Saitual, Khawzawl and Hnahthial — were created in 2019, which is why Census 2011 tables still show only 8 districts.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "geography",
      "districts",
      "administration"
    ]
  },
  {
    id: "mzshb24-geo-area-011",
    type: "mcq",
    subject: "geography",
    topic: "geo_area",
    topicLabel: "Geography, Area & Boundaries",
    difficulty: "medium",
    question: "How many Autonomous District Councils are there in Mizoram?",
    options: [
      "3",
      "2",
      "4",
      "1"
    ],
    answerIndex: 0,
    explanation: "Mizoram has 3 Autonomous District Councils (Mizoram at a Glance, SN 7): the Chakma (CADC), Lai (LADC) and Mara (MADC) Autonomous District Councils, constituted under the Sixth Schedule of the Constitution.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "geography",
      "adc",
      "sixth-schedule",
      "administration",
      "sixth-schedule-adc",
      "mizoram",
      "northeast"
    ]
  },
  {
    id: "mzshb24-geo-area-012",
    type: "mcq",
    subject: "geography",
    topic: "geo_area",
    topicLabel: "Geography, Area & Boundaries",
    difficulty: "medium",
    question: "The number of Sub-Divisions and R.D. Blocks in Mizoram is respectively:",
    options: [
      "23 and 27",
      "27 and 23",
      "22 and 26",
      "23 and 26"
    ],
    answerIndex: 0,
    explanation: "Mizoram has 23 Sub-Divisions and 27 Rural Development Blocks (Mizoram at a Glance, SN 7 and SN 10).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "geography",
      "administration"
    ]
  },
  {
    id: "mzshb24-geo-area-013",
    type: "mcq",
    subject: "geography",
    topic: "geo_area",
    topicLabel: "Geography, Area & Boundaries",
    difficulty: "hard",
    question: "As per Census 2011, the total number of villages in Mizoram was 830, of which the number of uninhabited villages was:",
    options: [
      "126",
      "704",
      "106",
      "146"
    ],
    answerIndex: 0,
    explanation: "Of 830 villages, 704 were inhabited and 126 uninhabited (Mizoram at a Glance, SN 7). Note that the 2025 Village Council election table also records exactly 830 Village Councils.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "geography",
      "villages",
      "census-2011",
      "panchayat",
      "mizoram"
    ]
  },
  {
    id: "mzshb24-geo-area-014",
    type: "mcq",
    subject: "geography",
    topic: "geo_area",
    topicLabel: "Geography, Area & Boundaries",
    difficulty: "medium",
    question: "The total number of households in Mizoram as per Census 2011 was:",
    options: [
      "222,853",
      "212,853",
      "232,853",
      "202,853"
    ],
    answerIndex: 0,
    explanation: "Census 2011 recorded 222,853 households in Mizoram (Mizoram at a Glance, SN 8). Against a population of 10,97,206 this implies an average household size of about 4.9 persons.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "geography",
      "households",
      "census-2011"
    ]
  },
  {
    id: "mzshb24-geo-area-015",
    type: "mcq",
    subject: "geography",
    topic: "geo_area",
    topicLabel: "Geography, Area & Boundaries",
    difficulty: "easy",
    question: "Aizawl, the capital of Mizoram, is located at an altitude of approximately:",
    options: [
      "1,132 metres above sea level",
      "1,320 metres above sea level",
      "932 metres above sea level",
      "2,157 metres above sea level"
    ],
    answerIndex: 0,
    explanation: "Aizawl lies in the northern part of Mizoram at an altitude of 1,132 metres above sea level (State Information, SN 2). 2,157 m is the height of Phawngpui, the state's highest peak.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "geography",
      "aizawl",
      "capital",
      "mizo-hills",
      "purvanchal"
    ]
  },
  {
    id: "mzshb24-geo-area-016",
    type: "mcq",
    subject: "geography",
    topic: "geo_area",
    topicLabel: "Geography, Area & Boundaries",
    difficulty: "hard",
    question: "Which district of Mizoram has the largest number of R.D. Blocks (as on 2024)?",
    options: [
      "Mamit and Aizawl and Lawngtlai (4 each)",
      "Lunglei (5)",
      "Champhai (4)",
      "Serchhip (4)"
    ],
    answerIndex: 0,
    explanation: "Mamit, Aizawl and Lawngtlai each have 4 R.D. Blocks — the joint highest (Mizoram at a Glance, SN 10). Khawzawl and Hnahthial have just 1 each.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "geography",
      "administration",
      "districts",
      "lawngtlai"
    ]
  },
  {
    id: "mzshb24-geo-area-017",
    type: "mcq",
    subject: "geography",
    topic: "geo_area",
    topicLabel: "Geography, Area & Boundaries",
    difficulty: "hard",
    question: "Which two districts of Mizoram have only one Sub-Division and one R.D. Block each?",
    options: [
      "Khawzawl and Hnahthial",
      "Saitual and Khawzawl",
      "Siaha and Serchhip",
      "Champhai and Kolasib"
    ],
    answerIndex: 0,
    explanation: "Khawzawl and Hnahthial each have 1 Sub-Division and 1 R.D. Block (Mizoram at a Glance, SN 10) — both are among the districts created in 2019. Champhai is the only other district with a single Sub-Division, but it has 2 R.D. Blocks.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "geography",
      "administration",
      "districts"
    ]
  },
  {
    id: "mzshb24-demography-001",
    type: "mcq",
    subject: "geography",
    topic: "demography",
    topicLabel: "Population & Census 2011",
    difficulty: "easy",
    question: "The total population of Mizoram as per Census 2011 was:",
    options: [
      "10,97,206",
      "10,91,014",
      "8,88,573",
      "11,97,206"
    ],
    answerIndex: 0,
    explanation: "Census 2011 recorded Mizoram's population at 10,97,206 — 5,55,339 males and 5,41,867 females (Table 1.1 and Mizoram at a Glance, SN 9). Note that the Handbook's All-India chapter (Table 47.1) prints a slightly different figure of 10,91,014 for Mizoram; the state chapters use 10,97,206.",
    sourceNote: "The Handbook contradicts itself: the state chapters (Table 1.1, Mizoram at a Glance) print 10,97,206, but the All-India chapter (Table 47.1) prints 10,91,014 for the same Census. Both are answered here as 10,97,206 since that is the figure used throughout the state-specific chapters.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "census-2011",
      "demography",
      "population"
    ]
  },
  {
    id: "mzshb24-demography-002",
    type: "mcq",
    subject: "geography",
    topic: "demography",
    topicLabel: "Population & Census 2011",
    difficulty: "medium",
    question: "The decadal population growth rate of Mizoram during 2001–2011 was:",
    options: [
      "23.48%",
      "28.82%",
      "27.28%",
      "22.92%"
    ],
    answerIndex: 0,
    explanation: "Mizoram's population grew 23.48% between 2001 and 2011, an absolute increase of 2,08,633 persons (Table 1.1). The previous decade (1991–2001) had recorded 28.82%.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "census-2011",
      "demography",
      "growth-rate"
    ]
  },
  {
    id: "mzshb24-demography-003",
    type: "mcq",
    subject: "geography",
    topic: "demography",
    topicLabel: "Population & Census 2011",
    difficulty: "easy",
    question: "The population density of Mizoram as per Census 2011 is:",
    options: [
      "52 persons per sq km",
      "62 persons per sq km",
      "42 persons per sq km",
      "382 persons per sq km"
    ],
    answerIndex: 0,
    explanation: "Mizoram's density is 52 persons per sq km (Table 1.2) — far below the all-India figure of 382. Only Arunachal Pradesh (17) is sparser among the States.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "census-2011",
      "demography",
      "density"
    ]
  },
  {
    id: "mzshb24-demography-004",
    type: "mcq",
    subject: "geography",
    topic: "demography",
    topicLabel: "Population & Census 2011",
    difficulty: "easy",
    question: "The sex ratio of Mizoram as per Census 2011 is:",
    options: [
      "976 females per 1000 males",
      "940 females per 1000 males",
      "1,009 females per 1000 males",
      "975 females per 1000 males"
    ],
    answerIndex: 0,
    explanation: "Mizoram's sex ratio is 976 females per 1000 males (Table 1.2), above the all-India figure of 940. 1,009 is Aizawl district's ratio — the only district above 1000.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "census-2011",
      "demography",
      "sex-ratio"
    ]
  },
  {
    id: "mzshb24-demography-005",
    type: "mcq",
    subject: "geography",
    topic: "demography",
    topicLabel: "Population & Census 2011",
    difficulty: "easy",
    question: "The literacy rate of Mizoram as per Census 2011 is:",
    options: [
      "91.33%",
      "91.58%",
      "93.72%",
      "89.40%"
    ],
    answerIndex: 0,
    explanation: "Mizoram's literacy rate is 91.33% (male 4,38,529 and female 4,09,646 literates out of 8,48,175 total). Note the All-India chapter (Table 47.3) prints 91.58% for Mizoram — quote whichever table the question cites.",
    sourceNote: "The Handbook contradicts itself: Table 1.4/1.5 (state chapter) give 91.33%, while Table 47.3 (All-India chapter) gives 91.58% for the same Census. Answered here as 91.33%, the state-chapter figure.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "census-2011",
      "demography",
      "literacy"
    ]
  },
  {
    id: "mzshb24-demography-006",
    type: "mcq",
    subject: "geography",
    topic: "demography",
    topicLabel: "Population & Census 2011",
    difficulty: "hard",
    question: "A distinctive feature of Mizoram's Census 2011 population distribution is that:",
    options: [
      "The urban population exceeds the rural population",
      "The rural population exceeds the urban population by a wide margin",
      "The population is exactly evenly split between rural and urban",
      "More than 80% of the population is rural"
    ],
    answerIndex: 0,
    explanation: "Mizoram's urban population (5,71,771) exceeds its rural population (5,25,435) — an urbanisation level of about 52%, one of the highest among Indian states (Mizoram at a Glance, SN 9). This is a frequently tested and counter-intuitive fact about a hill state.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "census-2011",
      "demography",
      "urbanisation"
    ]
  },
  {
    id: "mzshb24-demography-007",
    type: "mcq",
    subject: "geography",
    topic: "demography",
    topicLabel: "Population & Census 2011",
    difficulty: "medium",
    question: "The 0–6 age group population of Mizoram as per Census 2011 was:",
    options: [
      "1,68,531",
      "1,58,531",
      "1,78,531",
      "1,48,531"
    ],
    answerIndex: 0,
    explanation: "The 0–6 population was 1,68,531 — 85,561 males and 82,970 females (Mizoram at a Glance, SN 9E), about 15.4% of the total population.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "census-2011",
      "demography",
      "age-structure"
    ]
  },
  {
    id: "mzshb24-demography-008",
    type: "mcq",
    subject: "geography",
    topic: "demography",
    topicLabel: "Population & Census 2011",
    difficulty: "medium",
    question: "The total number of workers in Mizoram as per Census 2011, and their share of total population, was:",
    options: [
      "4,86,705 and 44.36%",
      "4,15,030 and 37.82%",
      "4,86,705 and 40.36%",
      "5,86,705 and 44.36%"
    ],
    answerIndex: 0,
    explanation: "Total workers numbered 4,86,705 — 44.36% of the population — comprising 4,15,030 main workers and 71,675 marginal workers (Mizoram at a Glance, SN 9G).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "census-2011",
      "demography",
      "workers",
      "employment"
    ]
  },
  {
    id: "mzshb24-demography-009",
    type: "mcq",
    subject: "geography",
    topic: "demography",
    topicLabel: "Population & Census 2011",
    difficulty: "medium",
    question: "In which decade did Mizoram record its highest ever decadal population growth rate?",
    options: [
      "1971–1981 (48.55%)",
      "1991–2001 (28.82%)",
      "1961–1971 (24.93%)",
      "1981–1991 (39.70%)"
    ],
    answerIndex: 0,
    explanation: "The 1971–81 decade recorded 48.55% growth, the highest in the 1901–2011 series (Table 1.1) — a period covering the Mizo insurgency-era grouping of villages and large-scale resettlement. The lowest was 1911–21 at 7.90%.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "census-2011",
      "demography",
      "growth-rate",
      "population-trend"
    ]
  },
  {
    id: "mzshb24-demography-010",
    type: "mcq",
    subject: "geography",
    topic: "demography",
    topicLabel: "Population & Census 2011",
    difficulty: "hard",
    question: "In which decade did Mizoram record its LOWEST decadal population growth rate between 1901 and 2011?",
    options: [
      "1911–1921 (7.90%)",
      "1901–1911 (10.64%)",
      "2001–2011 (23.48%)",
      "1931–1941 (22.81%)"
    ],
    answerIndex: 0,
    explanation: "The 1911–21 decade recorded just 7.90% growth (Table 1.1), the lowest in the series — the decade of the 1918–19 influenza pandemic. 1901–11 at 10.64% was the second lowest.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "census-2011",
      "demography",
      "growth-rate",
      "population-trend"
    ]
  },
  {
    id: "mzshb24-demography-011",
    type: "mcq",
    subject: "geography",
    topic: "demography",
    topicLabel: "Population & Census 2011",
    difficulty: "hard",
    question: "Mizoram's population first crossed the one-million mark in which Census year?",
    options: [
      "2011",
      "2001",
      "1991",
      "2021"
    ],
    answerIndex: 0,
    explanation: "Mizoram's population reached 10,97,206 in 2011, crossing one million for the first time; in 2001 it stood at 8,88,573 (Table 1.1).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "census-2011",
      "demography",
      "population-trend"
    ]
  },
  {
    id: "mzshb24-demography-012",
    type: "mcq",
    subject: "geography",
    topic: "demography",
    topicLabel: "Population & Census 2011",
    difficulty: "hard",
    question: "A notable feature of Mizoram's population in the Censuses from 1901 to 1961 was that:",
    options: [
      "Females outnumbered males in every one of those Censuses",
      "Males outnumbered females in every one of those Censuses",
      "The population declined in absolute terms",
      "The sex ratio was below 900 throughout"
    ],
    answerIndex: 0,
    explanation: "From 1901 to 1961 females outnumbered males in every Census — e.g. in 1901, 43,430 females against 39,004 males (Table 1.1). Males have outnumbered females in every Census since 1971.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "census-2011",
      "demography",
      "sex-ratio",
      "population-trend"
    ]
  },
  {
    id: "mzshb24-demography-013",
    type: "mcq",
    subject: "geography",
    topic: "demography",
    topicLabel: "Population & Census 2011",
    difficulty: "medium",
    question: "As per Census 2011, which was the most populous district of Mizoram?",
    options: [
      "Aizawl",
      "Lunglei",
      "Champhai",
      "Lawngtlai"
    ],
    answerIndex: 0,
    explanation: "Mizoram had only 8 districts at the 2011 Census; Saitual, Khawzawl and Hnahthial were created in 2019, so all Census 2011 district tables use the 8-district basis. Aizawl district had 4,00,309 persons — well over twice Lunglei's 1,61,428, the second largest (Table 1.2).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "census-2011",
      "demography",
      "districts"
    ]
  },
  {
    id: "mzshb24-demography-014",
    type: "mcq",
    subject: "geography",
    topic: "demography",
    topicLabel: "Population & Census 2011",
    difficulty: "medium",
    question: "As per Census 2011, which district of Mizoram had the smallest population?",
    options: [
      "Siaha",
      "Serchhip",
      "Kolasib",
      "Mamit"
    ],
    answerIndex: 0,
    explanation: "Mizoram had only 8 districts at the 2011 Census; Saitual, Khawzawl and Hnahthial were created in 2019, so all Census 2011 district tables use the 8-district basis. Siaha had 56,574 persons, the smallest; Serchhip followed with 64,937 (Table 1.2).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "census-2011",
      "demography",
      "districts",
      "siaha"
    ]
  },
  {
    id: "mzshb24-demography-015",
    type: "mcq",
    subject: "geography",
    topic: "demography",
    topicLabel: "Population & Census 2011",
    difficulty: "medium",
    question: "Which is the largest district of Mizoram by geographical area?",
    options: [
      "Lunglei (4,536 sq km)",
      "Aizawl (3,576 sq km)",
      "Champhai (3,185 sq km)",
      "Mamit (3,025 sq km)"
    ],
    answerIndex: 0,
    explanation: "Lunglei, at 4,536 sq km, is the largest district by area, followed by Aizawl (3,576) and Champhai (3,185). Kolasib is the smallest at 1,382 sq km (Table 1.2).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "census-2011",
      "demography",
      "districts",
      "area"
    ]
  },
  {
    id: "mzshb24-demography-016",
    type: "mcq",
    subject: "geography",
    topic: "demography",
    topicLabel: "Population & Census 2011",
    difficulty: "hard",
    question: "Which district recorded a NEGATIVE decadal population growth rate in Mizoram during 2001–2011?",
    options: [
      "Siaha (−7.34%)",
      "Champhai (−1.60%)",
      "Serchhip (−2.05%)",
      "No district recorded negative growth"
    ],
    answerIndex: 0,
    explanation: "Mizoram had only 8 districts at the 2011 Census; Saitual, Khawzawl and Hnahthial were created in 2019, so all Census 2011 district tables use the 8-district basis. Siaha was the only district to record negative growth, at −7.34% (Table 1.2). At the other extreme Lawngtlai grew 60.14%.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "census-2011",
      "demography",
      "districts",
      "growth-rate",
      "lawngtlai",
      "siaha"
    ]
  },
  {
    id: "mzshb24-demography-017",
    type: "mcq",
    subject: "geography",
    topic: "demography",
    topicLabel: "Population & Census 2011",
    difficulty: "hard",
    question: "Which district of Mizoram recorded the highest decadal growth rate (2001–2011)?",
    options: [
      "Lawngtlai (60.14%)",
      "Mamit (37.56%)",
      "Kolasib (27.28%)",
      "Aizawl (22.92%)"
    ],
    answerIndex: 0,
    explanation: "Mizoram had only 8 districts at the 2011 Census; Saitual, Khawzawl and Hnahthial were created in 2019, so all Census 2011 district tables use the 8-district basis. Lawngtlai recorded 60.14% growth, by far the highest, ahead of Mamit at 37.56% (Table 1.2).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "census-2011",
      "demography",
      "districts",
      "growth-rate",
      "lawngtlai"
    ]
  },
  {
    id: "mzshb24-demography-018",
    type: "mcq",
    subject: "geography",
    topic: "demography",
    topicLabel: "Population & Census 2011",
    difficulty: "hard",
    question: "Which is the only district of Mizoram with a sex ratio above 1000 (Census 2011)?",
    options: [
      "Aizawl (1,009)",
      "Siaha (979)",
      "Serchhip (977)",
      "Champhai (984)"
    ],
    answerIndex: 0,
    explanation: "Mizoram had only 8 districts at the 2011 Census; Saitual, Khawzawl and Hnahthial were created in 2019, so all Census 2011 district tables use the 8-district basis. Aizawl, with 1,009 females per 1000 males, is the only district above parity (Table 1.2). Mamit has the lowest at 927.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "census-2011",
      "demography",
      "districts",
      "sex-ratio"
    ]
  },
  {
    id: "mzshb24-demography-019",
    type: "mcq",
    subject: "geography",
    topic: "demography",
    topicLabel: "Population & Census 2011",
    difficulty: "hard",
    question: "Which district of Mizoram has the LOWEST population density (Census 2011)?",
    options: [
      "Mamit (29 per sq km)",
      "Lunglei (36 per sq km)",
      "Siaha (40 per sq km)",
      "Champhai (39 per sq km)"
    ],
    answerIndex: 0,
    explanation: "Mizoram had only 8 districts at the 2011 Census; Saitual, Khawzawl and Hnahthial were created in 2019, so all Census 2011 district tables use the 8-district basis. Mamit has the lowest density at 29 persons per sq km; Aizawl has the highest at 112 (Table 1.2). Mamit also has the lowest sex ratio (927).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "census-2011",
      "demography",
      "districts",
      "density"
    ]
  },
  {
    id: "mzshb24-demography-020",
    type: "mcq",
    subject: "geography",
    topic: "demography",
    topicLabel: "Population & Census 2011",
    difficulty: "hard",
    question: "Which district of Mizoram has BOTH the lowest population density and the lowest sex ratio as per Census 2011?",
    options: [
      "Mamit",
      "Lawngtlai",
      "Siaha",
      "Lunglei"
    ],
    answerIndex: 0,
    explanation: "Mizoram had only 8 districts at the 2011 Census; Saitual, Khawzawl and Hnahthial were created in 2019, so all Census 2011 district tables use the 8-district basis. Mamit is lowest on both counts — density 29 per sq km and sex ratio 927 (Table 1.2).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "census-2011",
      "demography",
      "districts"
    ]
  },
  {
    id: "mzshb24-symbols-gk-001",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "easy",
    question: "The State Animal of Mizoram is:",
    options: [
      "Saza (Serow)",
      "Sangha (Barking Deer)",
      "Vawk (Wild Boar)",
      "Sakei (Tiger)"
    ],
    answerIndex: 0,
    explanation: "Mizoram's State Animal is the Saza or Serow, a goat-antelope of the Himalayan and North-East hill forests (State Information, SN 3).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "state-symbols"
    ]
  },
  {
    id: "mzshb24-symbols-gk-002",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "easy",
    question: "The State Bird of Mizoram is:",
    options: [
      "Vavu (Pheasant)",
      "Vahui (Hornbill)",
      "Savawm (Peacock)",
      "Chawnghnawtchhi (Sunbird)"
    ],
    answerIndex: 0,
    explanation: "The State Bird is the Vavu, or Pheasant (State Information, SN 4). Hume's Pheasant and the Great Indian Hornbill are separately listed among Mizoram's important birds.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "state-symbols"
    ]
  },
  {
    id: "mzshb24-symbols-gk-003",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "medium",
    question: "The State Tree of Mizoram is:",
    options: [
      "Herhse (Iron Wood)",
      "Thingsia (Oak)",
      "Mau (Bamboo)",
      "Fartuah (Pine)"
    ],
    answerIndex: 0,
    explanation: "Mizoram's State Tree is Herhse, the Iron Wood tree (State Information, SN 5).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "state-symbols"
    ]
  },
  {
    id: "mzshb24-symbols-gk-004",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "easy",
    question: "The State Flower of Mizoram is:",
    options: [
      "Senhri (Red Vanda)",
      "Senhri (Blue Vanda)",
      "Tlaizawng (Rhododendron)",
      "Zawngtah (Orchid)"
    ],
    answerIndex: 0,
    explanation: "The State Flower is Senhri, the Red Vanda orchid (State Information, SN 6).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "state-symbols"
    ]
  },
  {
    id: "mzshb24-symbols-gk-005",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "easy",
    question: "The highest mountain peak in Mizoram is:",
    options: [
      "Phawngpui (Blue Mountain)",
      "Lengteng",
      "Surtlang",
      "Tantlang"
    ],
    answerIndex: 0,
    explanation: "Phawngpui, also called the Blue Mountain, is Mizoram's highest peak at 2,157 metres (7,077 feet) and lies in Lawngtlai district (Table 46.1 and State Information, SN 7). Lengteng is second at 2,141 m.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "mountains",
      "phawngpui",
      "mizo-hills",
      "purvanchal",
      "lawngtlai"
    ]
  },
  {
    id: "mzshb24-symbols-gk-006",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "medium",
    question: "The height of Phawngpui, Mizoram's highest peak, is:",
    options: [
      "2,157 metres",
      "2,141 metres",
      "1,967 metres",
      "1,132 metres"
    ],
    answerIndex: 0,
    explanation: "Phawngpui stands at 2,157 metres (7,077 feet) — Table 46.1. 2,141 m is Lengteng, the second highest; 1,132 m is the altitude of Aizawl city.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "mountains",
      "phawngpui",
      "mizo-hills",
      "purvanchal"
    ]
  },
  {
    id: "mzshb24-symbols-gk-007",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "medium",
    question: "Phawngpui, the highest peak of Mizoram, is located in which district?",
    options: [
      "Lawngtlai",
      "Champhai",
      "Serchhip",
      "Siaha"
    ],
    answerIndex: 0,
    explanation: "Phawngpui lies in Lawngtlai district (State Information, SN 7). Phawngpui National Park, at Sangau in Lawngtlai, protects the peak and its surroundings.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "mountains",
      "phawngpui",
      "lawngtlai",
      "mizo-hills",
      "purvanchal"
    ]
  },
  {
    id: "mzshb24-symbols-gk-008",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "hard",
    question: "Which is the SECOND highest mountain peak in Mizoram?",
    options: [
      "Lengteng (2,141 m)",
      "Surtlang (1,967 m)",
      "Lurhtlang (1,935 m)",
      "Tantlang (1,929 m)"
    ],
    answerIndex: 0,
    explanation: "Lengteng, at 2,141 metres (7,024 feet), is second only to Phawngpui's 2,157 m — a margin of just 16 metres (Table 46.1). Lengteng also gives its name to the Lengteng Wildlife Sanctuary.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "mountains",
      "mizo-hills",
      "purvanchal"
    ]
  },
  {
    id: "mzshb24-symbols-gk-009",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "hard",
    question: "In the Statistical Handbook's list of the Ten Highest Mountains of Mizoram, which peak ranks third?",
    options: [
      "Surtlang (1,967 m)",
      "Lurhtlang (1,935 m)",
      "Tantlang (1,929 m)",
      "Vapartlang (1,897 m)"
    ],
    answerIndex: 0,
    explanation: "The order is Phawngpui 2,157 m, Lengteng 2,141 m, Surtlang 1,967 m, Lurhtlang 1,935 m, Tantlang 1,929 m (Table 46.1).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "mountains",
      "mizo-hills",
      "purvanchal"
    ]
  },
  {
    id: "mzshb24-symbols-gk-010",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "hard",
    question: "Which peak completes the list of the Ten Highest Mountains of Mizoram at rank 10?",
    options: [
      "Tawizo (1,837 m)",
      "Zopuitlang (1,850 m)",
      "Hrangturzotlang (1,854 m)",
      "Chalfilhtlang (1,866 m)"
    ],
    answerIndex: 0,
    explanation: "Tawizo, at 1,837 metres (6,027 feet), is tenth in Table 46.1. The full order from 6th to 10th is Vapartlang, Chalfilhtlang, Hrangturzotlang, Zopuitlang, Tawizo.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "mountains",
      "mizo-hills",
      "purvanchal"
    ]
  },
  {
    id: "mzshb24-symbols-gk-011",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "easy",
    question: "The longest river in Mizoram is:",
    options: [
      "Tlawng",
      "Tiau",
      "Chhimtuipui",
      "Tuivai"
    ],
    answerIndex: 0,
    explanation: "The Tlawng, at 185.15 km, is Mizoram's longest river (Table 46.2). It rises in Zopui Hill near Zobawk in Lunglei district at an elevation of 1,395 metres (4,577 feet).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "rivers",
      "tlawng",
      "mizo-hills"
    ]
  },
  {
    id: "mzshb24-symbols-gk-012",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "medium",
    question: "The length of the Tlawng, Mizoram's longest river, is:",
    options: [
      "185.15 km",
      "159.39 km",
      "138.46 km",
      "128.08 km"
    ],
    answerIndex: 0,
    explanation: "The Tlawng measures 185.15 km (Table 46.2). The Tiau is second at 159.39 km.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "rivers",
      "tlawng",
      "mizo-hills"
    ]
  },
  {
    id: "mzshb24-symbols-gk-013",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "hard",
    question: "The Tlawng river originates from which hill?",
    options: [
      "Zopui Hill, near Zobawk in Lunglei district",
      "Phawngpui, in Lawngtlai district",
      "Reiek Tlang, in Mamit district",
      "Lengteng, in Champhai district"
    ],
    answerIndex: 0,
    explanation: "The Tlawng originates in Zopui Hill near Zobawk in Lunglei district, at an elevation of 1,395 metres or 4,577 feet (State Information, SN 8).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "rivers",
      "tlawng",
      "mizo-hills"
    ]
  },
  {
    id: "mzshb24-symbols-gk-014",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "hard",
    question: "Which is the SECOND longest river in Mizoram?",
    options: [
      "Tiau (159.39 km)",
      "Chhimtuipui (138.46 km)",
      "Tut (138.25 km)",
      "Tuivai (134.61 km)"
    ],
    answerIndex: 0,
    explanation: "The Tiau, at 159.39 km, is second longest (Table 46.2). The Tiau also forms part of the international boundary between Mizoram and Myanmar.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "rivers",
      "northeast"
    ]
  },
  {
    id: "mzshb24-symbols-gk-015",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "hard",
    question: "The Chhimtuipui river of Mizoram is also known as:",
    options: [
      "Kolodyne",
      "Karnaphuli",
      "Barak",
      "Dhaleswari"
    ],
    answerIndex: 0,
    explanation: "The Chhimtuipui (138.46 km) is also called the Kolodyne (Table 46.2). Separately, the Khawthlangtuipui (128.08 km) is known as the Karnaphuli.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "rivers",
      "kaladan",
      "karnaphuli"
    ]
  },
  {
    id: "mzshb24-symbols-gk-016",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "hard",
    question: "In Mizoram, the river Khawthlangtuipui is better known by which other name?",
    options: [
      "Karnaphuli",
      "Kolodyne",
      "Kaladan",
      "Gomti"
    ],
    answerIndex: 0,
    explanation: "The Khawthlangtuipui, 128.08 km long, is the Karnaphuli (Table 46.2) — it flows on into Bangladesh. The Chhimtuipui is the Kolodyne.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "rivers",
      "kaladan",
      "karnaphuli",
      "northeast"
    ]
  },
  {
    id: "mzshb24-symbols-gk-017",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "hard",
    question: "Arrange these Mizoram rivers in DESCENDING order of length: Tut, Tiau, Tuivai, Tuichang.",
    options: [
      "Tiau > Tut > Tuivai > Tuichang",
      "Tut > Tiau > Tuichang > Tuivai",
      "Tuivai > Tiau > Tut > Tuichang",
      "Tiau > Tuivai > Tut > Tuichang"
    ],
    answerIndex: 0,
    explanation: "Tiau 159.39 km > Tut 138.25 km > Tuivai 134.61 km > Tuichang 120.75 km (Table 46.2).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "rivers"
    ]
  },
  {
    id: "mzshb24-symbols-gk-018",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "easy",
    question: "Chapchar Kut, the best known festival of Mizoram, is celebrated on:",
    options: [
      "The first Friday of March",
      "The first Friday of January",
      "The second week of December",
      "25th December"
    ],
    answerIndex: 0,
    explanation: "Chapchar Kut is celebrated on the first Friday of March (State Information, SN 13) — a spring festival marking the completion of jhum clearing.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "festivals",
      "chapchar-kut",
      "culture"
    ]
  },
  {
    id: "mzshb24-symbols-gk-019",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "medium",
    question: "Pawl Kut, one of Mizoram's important festivals, is celebrated during which month?",
    options: [
      "January",
      "March",
      "December",
      "October"
    ],
    answerIndex: 0,
    explanation: "Pawl Kut is celebrated during January (State Information, SN 13). It is a harvest festival. Chapchar Kut falls on the first Friday of March.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "festivals",
      "culture"
    ]
  },
  {
    id: "mzshb24-symbols-gk-020",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "hard",
    question: "The Winter Festival of Mizoram is held in:",
    options: [
      "The second week of December",
      "The first week of March",
      "The last week of January",
      "The first week of December"
    ],
    answerIndex: 0,
    explanation: "The Winter Festival is held in the second week of December (State Information, SN 13). Lyuva Khutla and Hlukhla are both held in the first week of March.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "festivals",
      "culture"
    ]
  },
  {
    id: "mzshb24-symbols-gk-021",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "medium",
    question: "Kawtchhuah Ropui, the noted archaeological site of menhirs, is located in which district?",
    options: [
      "Champhai (at Vangchhia)",
      "Mamit (at Ailawng)",
      "Lunglei (at Tlabung)",
      "Serchhip (at Thenzawl)"
    ],
    answerIndex: 0,
    explanation: "Kawtchhuah Ropui is at Vangchhia in Champhai district (State Information, SN 14). The Vangchhia monoliths are among Mizoram's most important archaeological remains.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "heritage",
      "champhai"
    ]
  },
  {
    id: "mzshb24-symbols-gk-022",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "hard",
    question: "Mizoram's oldest Post Office, oldest Police Station and oldest Hospital are all located at:",
    options: [
      "Tlabung, in Lunglei district",
      "Serkawn, in Lunglei district",
      "Falkawn, in Aizawl district",
      "Zanlawn, in Kolasib district"
    ],
    answerIndex: 0,
    explanation: "All three — along with the oldest Bungalow — are at Tlabung in Lunglei district (State Information, SN 14). Tlabung, near the Bangladesh border, was an early administrative and trading centre.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "heritage",
      "lunglei",
      "northeast"
    ]
  },
  {
    id: "mzshb24-symbols-gk-023",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "hard",
    question: "The Pioneer Missionary Bungalow, an important heritage site of Mizoram, is located at:",
    options: [
      "Serkawn, in Lunglei district",
      "Tlabung, in Lunglei district",
      "Mission Veng, in Aizawl district",
      "Theiriat, in Lunglei district"
    ],
    answerIndex: 0,
    explanation: "The Pioneer Missionary Bungalow is at Serkawn in Lunglei district (State Information, SN 14). Serkawn was the base of the Baptist Missionary Society in south Mizoram.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "heritage",
      "lunglei"
    ]
  },
  {
    id: "mzshb24-symbols-gk-024",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "medium",
    question: "Vantawng Khawhthla, the well known waterfall of Mizoram, is located near:",
    options: [
      "Thenzawl, in Serchhip district",
      "Sangau, in Lawngtlai district",
      "Reiek, in Mamit district",
      "Murlen, in Champhai district"
    ],
    answerIndex: 0,
    explanation: "Vantawng Khawhthla is at Thenzawl in Serchhip district (State Information, SN 15) — Mizoram's highest waterfall. Thenzawl also has the state's golf course and a deer park.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "tourism",
      "serchhip"
    ]
  },
  {
    id: "mzshb24-symbols-gk-025",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "medium",
    question: "Solomon's Temple, a prominent tourist attraction, is located at:",
    options: [
      "Chawlhhmun, in Aizawl district",
      "Hlimen, in Aizawl district",
      "Falkawn, in Aizawl district",
      "Lungverh, in Aizawl district"
    ],
    answerIndex: 0,
    explanation: "Solomon's Temple is at Chawlhhmun in Aizawl district (State Information, SN 15). Lungverh is the site of the Zoological Garden and Hlimen of Lalsavunga Park.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "tourism",
      "aizawl"
    ]
  },
  {
    id: "mzshb24-symbols-gk-026",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "hard",
    question: "Tam Dil, the natural lake and tourist spot, lies in which district of Mizoram?",
    options: [
      "Saitual",
      "Mamit",
      "Kolasib",
      "Siaha"
    ],
    answerIndex: 0,
    explanation: "Tam Dil is in Saitual district (State Information, SN 15). Dil Nupa is in Mamit, Serlui B Lake in Kolasib, and Pala Tipo (Palak Dil) in Siaha.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "tourism",
      "saitual",
      "lakes",
      "siaha"
    ]
  },
  {
    id: "mzshb24-symbols-gk-027",
    type: "mcq",
    subject: "gk",
    topic: "symbols_gk",
    topicLabel: "State Symbols, Peaks, Rivers & Heritage",
    difficulty: "hard",
    question: "Reiek Tlang, a popular tourist destination near Aizawl, falls within which district?",
    options: [
      "Mamit",
      "Aizawl",
      "Kolasib",
      "Serchhip"
    ],
    answerIndex: 0,
    explanation: "Reiek Tlang is in Mamit district (State Information, SN 15), though it is a short drive from Aizawl city.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "state-gk",
      "tourism",
      "mamit"
    ]
  },
  {
    id: "mzshb24-economy-001",
    type: "mcq",
    subject: "economics",
    topic: "economy",
    topicLabel: "State Economy, GSDP & Budget",
    difficulty: "medium",
    question: "Mizoram's Gross State Domestic Product (GSDP) at current prices in 2023-24 (P) was:",
    options: [
      "Rs. 33,276.73 crore",
      "Rs. 21,663.97 crore",
      "Rs. 30,184.18 crore",
      "Rs. 29,233.56 crore"
    ],
    answerIndex: 0,
    explanation: "All GSDP/NSDP figures follow the 2011-12 base-year series; 2023-24 figures are Provisional (P). GSDP at current prices for 2023-24 (P) was Rs. 33,276.73 crore; at constant prices it was Rs. 21,663.97 crore (Table 3.1). Rs. 29,233.56 crore is the NSDP at current prices.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "economy",
      "gsdp"
    ]
  },
  {
    id: "mzshb24-economy-002",
    type: "mcq",
    subject: "economics",
    topic: "economy",
    topicLabel: "State Economy, GSDP & Budget",
    difficulty: "medium",
    question: "Mizoram's Per Capita Income (NSDP) at current prices in 2023-24 (P) was:",
    options: [
      "Rs. 2,34,996",
      "Rs. 1,51,676",
      "Rs. 2,13,665",
      "Rs. 1,95,365"
    ],
    answerIndex: 0,
    explanation: "All GSDP/NSDP figures follow the 2011-12 base-year series; 2023-24 figures are Provisional (P). Per capita income at current prices was Rs. 2,34,996 in 2023-24 (P); at constant prices it was Rs. 1,51,676 (Table 3.1). Rs. 2,13,665 was the 2022-23 current-price figure.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "economy",
      "gsdp",
      "per-capita-income"
    ]
  },
  {
    id: "mzshb24-economy-003",
    type: "mcq",
    subject: "economics",
    topic: "economy",
    topicLabel: "State Economy, GSDP & Budget",
    difficulty: "hard",
    question: "Mizoram's Net State Domestic Product (NSDP) at current prices in 2023-24 (P) was:",
    options: [
      "Rs. 29,233.56 crore",
      "Rs. 33,276.73 crore",
      "Rs. 18,868.48 crore",
      "Rs. 26,344.96 crore"
    ],
    answerIndex: 0,
    explanation: "All GSDP/NSDP figures follow the 2011-12 base-year series; 2023-24 figures are Provisional (P). NSDP at current prices was Rs. 29,233.56 crore, against a GSDP of Rs. 33,276.73 crore (Table 3.1).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "economy",
      "gsdp"
    ]
  },
  {
    id: "mzshb24-economy-004",
    type: "mcq",
    subject: "economics",
    topic: "economy",
    topicLabel: "State Economy, GSDP & Budget",
    difficulty: "hard",
    question: "In which year did Mizoram's GSDP at current prices CONTRACT compared with the previous year?",
    options: [
      "2020-21",
      "2019-20",
      "2022-23",
      "2021-22"
    ],
    answerIndex: 0,
    explanation: "GSDP at current prices fell from Rs. 24,989.60 crore in 2019-20 to Rs. 23,922.94 crore in 2020-21 — the COVID-19 contraction and the only decline in the series (Table 3.1). Per capita income also fell, from Rs. 1,95,365 to Rs. 1,73,521.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "economy",
      "gsdp",
      "covid"
    ]
  },
  {
    id: "mzshb24-economy-005",
    type: "mcq",
    subject: "economics",
    topic: "economy",
    topicLabel: "State Economy, GSDP & Budget",
    difficulty: "medium",
    question: "As per the percentage sectoral share of Mizoram's GSDP in 2023-24 (P), which sector contributed the most?",
    options: [
      "Service sector (49.33%)",
      "Industry sector (31.06%)",
      "Agriculture & allied sector (19.61%)",
      "The three are nearly equal"
    ],
    answerIndex: 0,
    explanation: "The service sector contributed 49.33%, industry 31.06% and agriculture & allied 19.61% in 2023-24 (P) — Table 3.4. Services have been the largest sector throughout the series.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "economy",
      "gsdp",
      "sectoral-share"
    ]
  },
  {
    id: "mzshb24-economy-006",
    type: "mcq",
    subject: "economics",
    topic: "economy",
    topicLabel: "State Economy, GSDP & Budget",
    difficulty: "hard",
    question: "Between 2014-15 and 2023-24 (P), the share of the agriculture & allied sector in Mizoram's GSDP:",
    options: [
      "Fell sharply, from 31.49% to 19.61%",
      "Rose from 19.61% to 31.49%",
      "Remained almost unchanged at about 30%",
      "Fell slightly, from 31.49% to 28.65%"
    ],
    answerIndex: 0,
    explanation: "Agriculture's share fell from 31.49% in 2014-15 to 19.61% in 2023-24 (P), while industry's share rose from 20.87% to 31.06% (Table 3.4) — a structural shift in which industry overtook agriculture.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "economy",
      "gsdp",
      "sectoral-share",
      "structural-change"
    ]
  },
  {
    id: "mzshb24-economy-007",
    type: "mcq",
    subject: "economics",
    topic: "economy",
    topicLabel: "State Economy, GSDP & Budget",
    difficulty: "hard",
    question: "In Mizoram's GSDP sectoral composition, the industry sector overtook the agriculture & allied sector in which year?",
    options: [
      "2017-18",
      "2014-15",
      "2020-21",
      "2023-24"
    ],
    answerIndex: 0,
    explanation: "In 2017-18 industry reached 26.64% against agriculture's 26.51% — the first year industry exceeded agriculture (Table 3.4). The gap has widened since, to 31.06% versus 19.61% in 2023-24 (P).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "economy",
      "gsdp",
      "sectoral-share",
      "structural-change"
    ]
  },
  {
    id: "mzshb24-economy-008",
    type: "mcq",
    subject: "economics",
    topic: "economy",
    topicLabel: "State Economy, GSDP & Budget",
    difficulty: "medium",
    question: "Mizoram's total revenue receipt in 2023-24 (Actual) was:",
    options: [
      "Rs. 11,41,405.07 lakh",
      "Rs. 13,29,437.94 lakh",
      "Rs. 10,83,696.04 lakh",
      "Rs. 6,42,599.71 lakh"
    ],
    answerIndex: 0,
    explanation: "Total revenue receipt in 2023-24 (Actual) was Rs. 11,41,405.07 lakh; the 2024-25 Revised Estimate is Rs. 13,29,437.94 lakh (Mizoram at a Glance, SN 12A). Rs. 10,83,696.04 lakh was revenue expenditure.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "economy",
      "gsdp",
      "budget",
      "state-finance"
    ]
  },
  {
    id: "mzshb24-economy-009",
    type: "mcq",
    subject: "economics",
    topic: "economy",
    topicLabel: "State Economy, GSDP & Budget",
    difficulty: "hard",
    question: "Comparing Mizoram's 2023-24 (Actual) budget figures, which statement is correct?",
    options: [
      "Revenue receipt exceeded revenue expenditure, giving a revenue surplus",
      "Revenue expenditure exceeded revenue receipt, giving a revenue deficit",
      "Revenue receipt and expenditure were exactly equal",
      "Capital receipt exceeded total revenue receipt"
    ],
    answerIndex: 0,
    explanation: "In 2023-24 (Actual) revenue receipt was Rs. 11,41,405.07 lakh against revenue expenditure of Rs. 10,83,696.04 lakh — a revenue surplus of about Rs. 57,709 lakh (Mizoram at a Glance, SN 12). In the 2024-25 R.E., however, revenue expenditure (Rs. 13,33,357.15 lakh) slightly exceeds revenue receipt (Rs. 13,29,437.94 lakh).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "economy",
      "gsdp",
      "budget",
      "state-finance"
    ]
  },
  {
    id: "mzshb24-economy-010",
    type: "mcq",
    subject: "economics",
    topic: "economy",
    topicLabel: "State Economy, GSDP & Budget",
    difficulty: "hard",
    question: "Mizoram's total capital expenditure in 2023-24 (Actual) was:",
    options: [
      "Rs. 6,16,734.68 lakh",
      "Rs. 3,08,219.35 lakh",
      "Rs. 6,42,599.71 lakh",
      "Rs. 2,09,863.00 lakh"
    ],
    answerIndex: 0,
    explanation: "Total capital expenditure in 2023-24 (Actual) was Rs. 6,16,734.68 lakh, against a capital receipt of Rs. 6,42,599.71 lakh (Mizoram at a Glance, SN 12C and 12D).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "economy",
      "gsdp",
      "budget",
      "state-finance"
    ]
  },
  {
    id: "mzshb24-forest-env-001",
    type: "mcq",
    subject: "geography",
    topic: "forest_env",
    topicLabel: "Forest, Environment & Wildlife",
    difficulty: "easy",
    question: "As per India State of Forest Report (ISFR) 2023, the total forest cover of Mizoram is:",
    options: [
      "17,990.46 sq km",
      "17,820.03 sq km",
      "18,434.46 sq km",
      "9,891.29 sq km"
    ],
    answerIndex: 0,
    explanation: "ISFR 2023 puts Mizoram's forest cover at 17,990.46 sq km (Table 13.1). 17,820.03 sq km was the ISFR 2021 figure; 18,434.46 sq km is forest AND tree cover combined under ISFR 2023.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "forest",
      "environment",
      "isfr",
      "forest-cover"
    ]
  },
  {
    id: "mzshb24-forest-env-002",
    type: "mcq",
    subject: "geography",
    topic: "forest_env",
    topicLabel: "Forest, Environment & Wildlife",
    difficulty: "easy",
    question: "As per ISFR 2023, forest cover as a percentage of Mizoram's geographical area is:",
    options: [
      "85.34%",
      "84.53%",
      "46.92%",
      "90.76%"
    ],
    answerIndex: 0,
    explanation: "Note the two ISFR vintages carried in the Handbook: the At-a-Glance section quotes ISFR 2021 (17,820.03 sq km, 84.53%), while Chapter 13 carries both ISFR 2021 and ISFR 2023 (17,990.46 sq km, 85.34%). Always check which report a question refers to. ISFR 2023 gives 85.34% (Table 13.1). 84.53% is the ISFR 2021 figure quoted in the At-a-Glance section; 46.92% is the Recorded Forest Area share; 90.76% is Siaha district's forest cover.",
    sourceNote: "Not a printing error but two different, correctly-dated figures in the same Handbook: 'Mizoram at a Glance' (front matter) quotes ISFR 2021 (84.53%), while Chapter 13's own Table 13.1 carries both ISFR 2021 and the newer ISFR 2023 (85.34%). Always check which report a question means.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "forest",
      "environment",
      "isfr",
      "forest-cover",
      "siaha"
    ]
  },
  {
    id: "mzshb24-forest-env-003",
    type: "mcq",
    subject: "geography",
    topic: "forest_env",
    topicLabel: "Forest, Environment & Wildlife",
    difficulty: "medium",
    question: "As per ISFR 2021 — the figure quoted in the Handbook's 'State Information' section — Mizoram's forest area was:",
    options: [
      "17,820 sq km, or 84.53% of the geographical area",
      "17,990 sq km, or 85.34% of the geographical area",
      "9,891 sq km, or 46.92% of the geographical area",
      "15,850 sq km, or 75.18% of the geographical area"
    ],
    answerIndex: 0,
    explanation: "Note the two ISFR vintages carried in the Handbook: the At-a-Glance section quotes ISFR 2021 (17,820.03 sq km, 84.53%), while Chapter 13 carries both ISFR 2021 and ISFR 2023 (17,990.46 sq km, 85.34%). Always check which report a question refers to. State Information SN 12 quotes ISFR 2021: 17,820 sq km, 84.53% of the state's geographical area.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "forest",
      "environment",
      "isfr",
      "forest-cover"
    ]
  },
  {
    id: "mzshb24-forest-env-004",
    type: "mcq",
    subject: "geography",
    topic: "forest_env",
    topicLabel: "Forest, Environment & Wildlife",
    difficulty: "hard",
    question: "Between ISFR 2021 and ISFR 2023, the most striking change in Mizoram's forest cover was:",
    options: [
      "A large rise in moderately dense forest and a corresponding fall in open forest",
      "A large fall in total forest cover",
      "A sharp fall in very dense forest",
      "No change in any category"
    ],
    answerIndex: 0,
    explanation: "Moderately dense forest rose from 5,715.24 to 8,635.76 sq km while open forest fell from 11,948.00 to 9,093.18 sq km (Table 13.1) — largely a reclassification of open forest into denser classes. Very dense forest also rose, from 156.79 to 261.52 sq km, and total cover rose only modestly, from 17,820.03 to 17,990.46 sq km.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "forest",
      "environment",
      "isfr",
      "forest-cover"
    ]
  },
  {
    id: "mzshb24-forest-env-005",
    type: "mcq",
    subject: "geography",
    topic: "forest_env",
    topicLabel: "Forest, Environment & Wildlife",
    difficulty: "hard",
    question: "As per ISFR 2023, which district of Mizoram has the HIGHEST percentage of forest cover to its geographical area?",
    options: [
      "Siaha (90.76%)",
      "Mamit (89.30%)",
      "Lunglei (88.42%)",
      "Hnahthial (86.37%)"
    ],
    answerIndex: 0,
    explanation: "Siaha leads at 90.76%, followed by Mamit (89.30%) and Lunglei (88.42%) — Table 13.2. Khawzawl is lowest at 75.64%.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "forest",
      "environment",
      "isfr",
      "districts",
      "siaha"
    ]
  },
  {
    id: "mzshb24-forest-env-006",
    type: "mcq",
    subject: "geography",
    topic: "forest_env",
    topicLabel: "Forest, Environment & Wildlife",
    difficulty: "hard",
    question: "As per ISFR 2023, which district of Mizoram has the LOWEST percentage of forest cover?",
    options: [
      "Khawzawl (75.64%)",
      "Lawngtlai (80.09%)",
      "Saitual (82.35%)",
      "Champhai (83.17%)"
    ],
    answerIndex: 0,
    explanation: "Khawzawl has the lowest forest-cover percentage at 75.64%, with Lawngtlai next at 80.09% (Table 13.2). Every district nonetheless exceeds 75%.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "forest",
      "environment",
      "isfr",
      "districts",
      "khawzawl",
      "lawngtlai"
    ]
  },
  {
    id: "mzshb24-forest-env-007",
    type: "mcq",
    subject: "geography",
    topic: "forest_env",
    topicLabel: "Forest, Environment & Wildlife",
    difficulty: "hard",
    question: "As per ISFR 2023, which district has the largest forest cover by AREA?",
    options: [
      "Lunglei (3,258.43 sq km)",
      "Mamit (2,722.05 sq km)",
      "Aizawl (1,899.89 sq km)",
      "Siaha (1,388.10 sq km)"
    ],
    answerIndex: 0,
    explanation: "Lunglei has the largest forest area at 3,258.43 sq km — it is also the largest district by geographical area (Table 13.2). Hnahthial has the smallest forest area, 735.46 sq km. Note the distinction from Siaha, which leads on PERCENTAGE but not area.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "forest",
      "environment",
      "isfr",
      "districts",
      "lunglei",
      "siaha"
    ]
  },
  {
    id: "mzshb24-forest-env-008",
    type: "mcq",
    subject: "geography",
    topic: "forest_env",
    topicLabel: "Forest, Environment & Wildlife",
    difficulty: "hard",
    question: "As per ISFR 2023, which district of Mizoram records NIL very dense forest?",
    options: [
      "Hnahthial",
      "Siaha",
      "Kolasib",
      "Khawzawl"
    ],
    answerIndex: 0,
    explanation: "Hnahthial records 0.00 sq km of very dense forest (Table 13.2). Siaha (0.49 sq km) and Kolasib (1.32 sq km) have the next lowest — notably Siaha has the highest overall forest-cover percentage yet almost no very dense forest.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "forest",
      "environment",
      "isfr",
      "districts",
      "siaha"
    ]
  },
  {
    id: "mzshb24-forest-env-009",
    type: "mcq",
    subject: "geography",
    topic: "forest_env",
    topicLabel: "Forest, Environment & Wildlife",
    difficulty: "hard",
    question: "The Recorded Forest Area (RFA) of Mizoram, as a percentage of the state's geographical area, is:",
    options: [
      "46.92%",
      "85.34%",
      "84.53%",
      "62.50%"
    ],
    answerIndex: 0,
    explanation: "Recorded Forest Area is 9,891.29 sq km, or 46.92% of the state's area (Table 13.3). This is a legal/administrative category and is quite distinct from satellite-assessed forest COVER of 85.34% — a classic distractor pair.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "forest",
      "environment",
      "recorded-forest-area"
    ]
  },
  {
    id: "mzshb24-forest-env-010",
    type: "mcq",
    subject: "geography",
    topic: "forest_env",
    topicLabel: "Forest, Environment & Wildlife",
    difficulty: "hard",
    question: "Among the categories of Recorded Forest Area in Mizoram, the largest is:",
    options: [
      "Reserved Forests (4,498.54 sq km)",
      "District Council Forests (2,562.00 sq km)",
      "Protected Forests (1,997.75 sq km)",
      "Unclassed Forests (833.00 sq km)"
    ],
    answerIndex: 0,
    explanation: "Reserved Forests account for 4,498.54 sq km of the 9,891.29 sq km Recorded Forest Area, followed by District Council Forests (2,562.00), Protected Forests (1,997.75) and Unclassed Forests (833.00) — Table 13.3.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "forest",
      "environment",
      "recorded-forest-area"
    ]
  },
  {
    id: "mzshb24-forest-env-011",
    type: "mcq",
    subject: "geography",
    topic: "forest_env",
    topicLabel: "Forest, Environment & Wildlife",
    difficulty: "medium",
    question: "How many National Parks are there in Mizoram?",
    options: [
      "2 — Murlen and Phawngpui",
      "1 — only Murlen",
      "3 — Murlen, Phawngpui and Dampa",
      "4"
    ],
    answerIndex: 0,
    explanation: "Mizoram has two National Parks: Murlen (100 sq km) and Phawngpui or Blue Mountain (50 sq km) — State Information SN 9. Dampa, though listed under the National Park heading in Table 13.6, is a Tiger Reserve, not a National Park.",
    sourceNote: "Table 13.6 itself mis-files Dampa Tiger Reserve under its 'B. National Park' heading. State Information SN 9 correctly names only Murlen and Phawngpui as National Parks — that count is used here, not Table 13.6's heading.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "forest",
      "environment",
      "national-parks",
      "protected-areas",
      "mizo-hills",
      "purvanchal"
    ]
  },
  {
    id: "mzshb24-forest-env-012",
    type: "mcq",
    subject: "geography",
    topic: "forest_env",
    topicLabel: "Forest, Environment & Wildlife",
    difficulty: "hard",
    question: "Dampa Tiger Reserve, Mizoram's largest protected area, covers an area of:",
    options: [
      "500 sq km",
      "110 sq km",
      "100 sq km",
      "50 sq km"
    ],
    answerIndex: 0,
    explanation: "Dampa Tiger Reserve covers 500 sq km and was finally notified on 07.12.1994 — both the largest and the earliest-notified protected area in Table 13.6. It lies in Mamit district.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "forest",
      "environment",
      "protected-areas",
      "dampa",
      "mamit"
    ]
  },
  {
    id: "mzshb24-forest-env-013",
    type: "mcq",
    subject: "geography",
    topic: "forest_env",
    topicLabel: "Forest, Environment & Wildlife",
    difficulty: "hard",
    question: "Which is the largest Wildlife Sanctuary in Mizoram by area?",
    options: [
      "Ngengpui (110 sq km)",
      "Lengteng (60 sq km)",
      "Thorangtlang (50 sq km)",
      "Khawnglung (35.75 sq km)"
    ],
    answerIndex: 0,
    explanation: "Ngengpui Wildlife Sanctuary, at 110 sq km, is the largest of the six wildlife sanctuaries listed in Table 13.6. Tawi, at 35 sq km, is the smallest.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "forest",
      "environment",
      "protected-areas",
      "wildlife-sanctuary"
    ]
  },
  {
    id: "mzshb24-forest-env-014",
    type: "mcq",
    subject: "geography",
    topic: "forest_env",
    topicLabel: "Forest, Environment & Wildlife",
    difficulty: "hard",
    question: "Murlen National Park, Mizoram, was finally notified in which year?",
    options: [
      "2003",
      "1997",
      "1994",
      "2002"
    ],
    answerIndex: 0,
    explanation: "Murlen National Park (100 sq km) was finally notified on 24.01.2003. Phawngpui National Park (50 sq km) was notified earlier, on 22.07.1997 (Table 13.6).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "forest",
      "environment",
      "protected-areas",
      "national-parks",
      "mizo-hills",
      "purvanchal"
    ]
  },
  {
    id: "mzshb24-forest-env-015",
    type: "mcq",
    subject: "geography",
    topic: "forest_env",
    topicLabel: "Forest, Environment & Wildlife",
    difficulty: "hard",
    question: "Which of these Mizoram protected areas was notified EARLIEST?",
    options: [
      "Dampa Tiger Reserve (1994)",
      "Ngengpui Wildlife Sanctuary (1997)",
      "Murlen National Park (2003)",
      "Pualreng Wildlife Sanctuary (2004)"
    ],
    answerIndex: 0,
    explanation: "Dampa Tiger Reserve was finally notified on 07.12.1994, the earliest in Table 13.6. Pualreng (29.07.2004) is the latest.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "forest",
      "environment",
      "protected-areas"
    ]
  },
  {
    id: "mzshb24-forest-env-016",
    type: "mcq",
    subject: "geography",
    topic: "forest_env",
    topicLabel: "Forest, Environment & Wildlife",
    difficulty: "medium",
    question: "Which of the following is listed among Mizoram's important wildlife in the Statistical Handbook?",
    options: [
      "Hoolock Gibbon",
      "Asiatic Lion",
      "One-horned Rhinoceros",
      "Snow Leopard"
    ],
    answerIndex: 0,
    explanation: "The Handbook lists Serow, Hoolock Gibbon, Binturong, Indian Bison and Clouded Leopard among Mizoram's important animals (State Information, SN 11). Important birds include Hume's Pheasant and the Great Indian Hornbill.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "forest",
      "environment",
      "wildlife"
    ]
  },
  {
    id: "mzshb24-climate-001",
    type: "mcq",
    subject: "geography",
    topic: "climate",
    topicLabel: "Climate & Rainfall",
    difficulty: "medium",
    question: "The annual normal rainfall of Mizoram, as given in Table 2.1 of the Statistical Handbook, is:",
    options: [
      "2,090.33 mm",
      "1,547.80 mm",
      "2,974.90 mm",
      "1,473.10 mm"
    ],
    answerIndex: 0,
    explanation: "Table 2.1 gives Mizoram's annual normal rainfall as 2,090.33 mm. (Table 2.2 carries a differing normal of 2,213.51 mm computed on monthly data, so always name the table.)",
    sourceNote: "Table 2.1 prints the normal as 2,090.33 mm; Table 2.2, in the same chapter, prints 2,213.51 mm for the same 'annual normal rainfall'. This question is scoped to Table 2.1's figure specifically — a question scoped to Table 2.2 would need the other number.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "climate",
      "rainfall"
    ]
  },
  {
    id: "mzshb24-climate-002",
    type: "mcq",
    subject: "geography",
    topic: "climate",
    topicLabel: "Climate & Rainfall",
    difficulty: "medium",
    question: "Mizoram's actual annual rainfall in 2024 was:",
    options: [
      "1,547.80 mm",
      "1,473.10 mm",
      "2,090.33 mm",
      "1,622.10 mm"
    ],
    answerIndex: 0,
    explanation: "Rainfall in 2024 was 1,547.80 mm (Table 2.1) — well below the annual normal of 2,090.33 mm, and only slightly above 2023's 1,473.10 mm.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "climate",
      "rainfall"
    ]
  },
  {
    id: "mzshb24-climate-003",
    type: "mcq",
    subject: "geography",
    topic: "climate",
    topicLabel: "Climate & Rainfall",
    difficulty: "hard",
    question: "In the twenty-year series 2005–2024, Mizoram recorded its LOWEST annual rainfall in which year?",
    options: [
      "2023 (1,473.10 mm)",
      "2024 (1,547.80 mm)",
      "2021 (1,551.60 mm)",
      "2019 (1,812.74 mm)"
    ],
    answerIndex: 0,
    explanation: "2023 recorded the lowest rainfall of the series at 1,473.10 mm, followed by 2024 (1,547.80 mm) and 2021 (1,551.60 mm) — Table 2.1. The state has run below normal for several consecutive years.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "climate",
      "rainfall"
    ]
  },
  {
    id: "mzshb24-climate-004",
    type: "mcq",
    subject: "geography",
    topic: "climate",
    topicLabel: "Climate & Rainfall",
    difficulty: "hard",
    question: "In the series 2005–2024, Mizoram's HIGHEST annual rainfall was recorded in:",
    options: [
      "2010 (2,974.90 mm)",
      "2007 (2,962.90 mm)",
      "2011 (2,526.40 mm)",
      "2013 (2,422.50 mm)"
    ],
    answerIndex: 0,
    explanation: "2010 recorded 2,974.90 mm, narrowly ahead of 2007's 2,962.90 mm (Table 2.1).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "climate",
      "rainfall"
    ]
  },
  {
    id: "mzshb24-agriculture-001",
    type: "mcq",
    subject: "geography",
    topic: "agriculture",
    topicLabel: "Agriculture & Land Use",
    difficulty: "medium",
    question: "In Mizoram, the crop occupying the largest area under cultivation in 2023-24 was:",
    options: [
      "Rice",
      "Maize",
      "Oilseeds",
      "Sugarcane"
    ],
    answerIndex: 0,
    explanation: "Figures are from Table 8.1, area in hectares, production in metric tonnes, yield in kg per hectare. Rice occupied 24,615 ha in 2023-24 (jhum rice 14,684 ha plus WRC 9,931 ha), far ahead of maize at 6,398 ha.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "agriculture",
      "rice",
      "crops"
    ]
  },
  {
    id: "mzshb24-agriculture-002",
    type: "mcq",
    subject: "geography",
    topic: "agriculture",
    topicLabel: "Agriculture & Land Use",
    difficulty: "hard",
    question: "Total rice production in Mizoram in 2023-24 was:",
    options: [
      "39,924 MT",
      "58,836 MT",
      "22,008 MT",
      "17,916 MT"
    ],
    answerIndex: 0,
    explanation: "Figures are from Table 8.1, area in hectares, production in metric tonnes, yield in kg per hectare. Total rice production was 39,924 MT in 2023-24, down sharply from 58,836 MT in 2022-23. Of this, wet rice cultivation contributed 22,008 MT and jhum rice 17,916 MT.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "agriculture",
      "rice",
      "crops"
    ]
  },
  {
    id: "mzshb24-agriculture-003",
    type: "mcq",
    subject: "geography",
    topic: "agriculture",
    topicLabel: "Agriculture & Land Use",
    difficulty: "hard",
    question: "Comparing jhum rice and wet rice cultivation (WRC) in Mizoram in 2023-24, which statement is correct?",
    options: [
      "Jhum occupied more area but WRC gave a higher yield per hectare",
      "WRC occupied more area and also gave a higher yield per hectare",
      "Jhum gave a higher yield per hectare than WRC",
      "Jhum and WRC had identical yields per hectare"
    ],
    answerIndex: 0,
    explanation: "Figures are from Table 8.1, area in hectares, production in metric tonnes, yield in kg per hectare. Jhum rice covered 14,684 ha against WRC's 9,931 ha, but WRC yielded 2,216 kg/ha against jhum's 1,220 kg/ha — WRC is roughly 1.8 times as productive per hectare. This contrast underpins Mizoram's policy of promoting WRC over shifting cultivation.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "agriculture",
      "rice",
      "jhum",
      "wrc"
    ]
  },
  {
    id: "mzshb24-agriculture-004",
    type: "mcq",
    subject: "geography",
    topic: "agriculture",
    topicLabel: "Agriculture & Land Use",
    difficulty: "hard",
    question: "Among the crops listed in Table 8.1 for 2023-24, which recorded the highest yield rate per hectare?",
    options: [
      "Sugarcane (23,394 kg/ha)",
      "Potato (5,857 kg/ha)",
      "WRC-Rabi rice (2,079 kg/ha)",
      "Maize (1,668 kg/ha)"
    ],
    answerIndex: 0,
    explanation: "Figures are from Table 8.1, area in hectares, production in metric tonnes, yield in kg per hectare. Sugarcane yielded 23,394 kg/ha in 2023-24, an order of magnitude above the cereals; potato was next at 5,857 kg/ha.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "agriculture",
      "crops",
      "yield"
    ]
  },
  {
    id: "mzshb24-agriculture-005",
    type: "mcq",
    subject: "geography",
    topic: "agriculture",
    topicLabel: "Agriculture & Land Use",
    difficulty: "medium",
    question: "The area under current jhum (shifting cultivation) in Mizoram in 2022-23 was approximately:",
    options: [
      "18.10 thousand hectares",
      "1.81 thousand hectares",
      "181 thousand hectares",
      "38.10 thousand hectares"
    ],
    answerIndex: 0,
    explanation: "Current jhum covered 18.10 thousand hectares in 2022-23, down from 18.89 thousand hectares in 2021-22 (Table 8.3, Land Use Statistics).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "agriculture",
      "jhum",
      "land-use"
    ]
  },
  {
    id: "mzshb24-agriculture-006",
    type: "mcq",
    subject: "geography",
    topic: "agriculture",
    topicLabel: "Agriculture & Land Use",
    difficulty: "hard",
    question: "As per Mizoram's Land Use Statistics for 2022-23, the net irrigated area was:",
    options: [
      "12.24 thousand hectares",
      "20.32 thousand hectares",
      "19.24 thousand hectares",
      "214 thousand hectares"
    ],
    answerIndex: 0,
    explanation: "Net irrigated area was 12.24 thousand hectares in 2022-23, down from 19.24 thousand ha in 2021-22; gross irrigated area was 20.32 thousand ha (Table 8.3).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "agriculture",
      "irrigation",
      "land-use"
    ]
  },
  {
    id: "mzshb24-health-001",
    type: "mcq",
    subject: "gk",
    topic: "health",
    topicLabel: "Health, NFHS-5 & Vital Statistics",
    difficulty: "medium",
    question: "As per NFHS-5 (2019-21), the Total Fertility Rate (TFR) of Mizoram is:",
    options: [
      "1.9 children per woman",
      "2.2 children per woman",
      "1.6 children per woman",
      "2.4 children per woman"
    ],
    answerIndex: 0,
    explanation: "From Table 23.10, Key Indicators of NFHS-5 (2019-21), Mizoram. Mizoram's TFR is 1.9 — urban 1.6 and rural 2.2. This is below the replacement level of 2.1.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "health",
      "nfhs-5",
      "tfr"
    ]
  },
  {
    id: "mzshb24-health-002",
    type: "mcq",
    subject: "gk",
    topic: "health",
    topicLabel: "Health, NFHS-5 & Vital Statistics",
    difficulty: "medium",
    question: "As per NFHS-5 (2019-21), the percentage of institutional births in Mizoram is:",
    options: [
      "85.7%",
      "95.5%",
      "72.5%",
      "83.7%"
    ],
    answerIndex: 0,
    explanation: "From Table 23.10, Key Indicators of NFHS-5 (2019-21), Mizoram. Institutional births stand at 85.7% overall, but with a wide gap — 98.8% in urban areas against just 72.5% in rural areas, the largest urban-rural divide among the NFHS-5 indicators for Mizoram.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "health",
      "nfhs-5",
      "institutional-births"
    ]
  },
  {
    id: "mzshb24-health-003",
    type: "mcq",
    subject: "gk",
    topic: "health",
    topicLabel: "Health, NFHS-5 & Vital Statistics",
    difficulty: "hard",
    question: "As per NFHS-5 (2019-21), what percentage of children aged 12–23 months in Mizoram are fully immunized?",
    options: [
      "83.7%",
      "85.7%",
      "95.2%",
      "72.5%"
    ],
    answerIndex: 0,
    explanation: "From Table 23.10, Key Indicators of NFHS-5 (2019-21), Mizoram. 83.7% of children aged 12–23 months are fully immunized (BCG, measles and three doses each of polio and DPT). Unusually, rural coverage (85.1%) is HIGHER than urban (82.2%) — an inversion worth noting.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "health",
      "nfhs-5",
      "immunization"
    ]
  },
  {
    id: "mzshb24-health-004",
    type: "mcq",
    subject: "gk",
    topic: "health",
    topicLabel: "Health, NFHS-5 & Vital Statistics",
    difficulty: "hard",
    question: "Which NFHS-5 (2019-21) indicator for Mizoram shows rural performance BETTER than urban?",
    options: [
      "Children aged 12–23 months fully immunized",
      "Institutional births",
      "Mothers with antenatal check-up in the first trimester",
      "Households using improved sanitation"
    ],
    answerIndex: 0,
    explanation: "From Table 23.10, Key Indicators of NFHS-5 (2019-21), Mizoram. Full immunization is 85.1% rural against 82.2% urban — the one indicator where rural Mizoram outperforms urban. Institutional births (72.5% rural vs 98.8% urban), first-trimester ANC (63.9% vs 81.0%) and improved sanitation (93.2% vs 97.1%) all favour urban areas.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "health",
      "nfhs-5",
      "immunization"
    ]
  },
  {
    id: "mzshb24-health-005",
    type: "mcq",
    subject: "gk",
    topic: "health",
    topicLabel: "Health, NFHS-5 & Vital Statistics",
    difficulty: "hard",
    question: "As per NFHS-5 (2019-21), the percentage of children under five years in Mizoram who are stunted is:",
    options: [
      "28.7%",
      "46.2%",
      "25.5%",
      "31.9%"
    ],
    answerIndex: 0,
    explanation: "From Table 23.10, Key Indicators of NFHS-5 (2019-21), Mizoram. 28.7% of under-five children are stunted (urban 25.5%, rural 31.9%). Separately, 46.2% of children aged 6–59 months are anaemic.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "health",
      "nfhs-5",
      "nutrition",
      "stunting"
    ]
  },
  {
    id: "mzshb24-health-006",
    type: "mcq",
    subject: "gk",
    topic: "health",
    topicLabel: "Health, NFHS-5 & Vital Statistics",
    difficulty: "hard",
    question: "As per NFHS-5 (2019-21), the percentage of children aged 6–59 months in Mizoram who are anaemic is:",
    options: [
      "46.2%",
      "28.7%",
      "42.8%",
      "49.6%"
    ],
    answerIndex: 0,
    explanation: "From Table 23.10, Key Indicators of NFHS-5 (2019-21), Mizoram. 46.2% of children aged 6–59 months are anaemic — 42.8% urban and 49.6% rural.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "health",
      "nfhs-5",
      "nutrition",
      "anaemia"
    ]
  },
  {
    id: "mzshb24-health-007",
    type: "mcq",
    subject: "gk",
    topic: "health",
    topicLabel: "Health, NFHS-5 & Vital Statistics",
    difficulty: "hard",
    question: "As per NFHS-5 (2019-21), tobacco use in Mizoram stands at:",
    options: [
      "62.6% of women and 73.5% of men",
      "24.0% of women and 62.6% of men",
      "0.9% of women and 24.0% of men",
      "46.2% of women and 56.6% of men"
    ],
    answerIndex: 0,
    explanation: "From Table 23.10, Key Indicators of NFHS-5 (2019-21), Mizoram. 62.6% of women and 73.5% of men in Mizoram use some form of tobacco — among the highest rates in India. By contrast alcohol consumption is low: 0.9% of women and 24.0% of men.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "health",
      "nfhs-5",
      "tobacco"
    ]
  },
  {
    id: "mzshb24-health-008",
    type: "mcq",
    subject: "gk",
    topic: "health",
    topicLabel: "Health, NFHS-5 & Vital Statistics",
    difficulty: "hard",
    question: "As per NFHS-5 (2019-21), what percentage of households in Mizoram have an improved drinking-water source?",
    options: [
      "95.5%",
      "95.2%",
      "92.6%",
      "98.4%"
    ],
    answerIndex: 0,
    explanation: "From Table 23.10, Key Indicators of NFHS-5 (2019-21), Mizoram. 95.5% of households have an improved drinking-water source (urban 98.4%, rural 92.6%). A near-identical 95.2% use an improved sanitation facility.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "health",
      "nfhs-5",
      "water-sanitation"
    ]
  },
  {
    id: "mzshb24-health-009",
    type: "mcq",
    subject: "gk",
    topic: "health",
    topicLabel: "Health, NFHS-5 & Vital Statistics",
    difficulty: "hard",
    question: "As per the Civil Registration System, Mizoram's Infant Mortality Rate (IMR) in 2024 was:",
    options: [
      "8.75 per 1000",
      "13.25 per 1000",
      "20.11 per 1000",
      "5.96 per 1000"
    ],
    answerIndex: 0,
    explanation: "IMR as per CRS fell sharply from 13.25 per 1000 in 2023 to 8.75 per 1000 in 2024 (Table 23.15). 20.11 is the 2024 birth rate and 5.96 the 2024 death rate.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "health",
      "imr",
      "crs",
      "vital-statistics"
    ]
  },
  {
    id: "mzshb24-health-010",
    type: "mcq",
    subject: "gk",
    topic: "health",
    topicLabel: "Health, NFHS-5 & Vital Statistics",
    difficulty: "hard",
    question: "As per the Civil Registration System, Mizoram's birth rate and death rate in 2024 were respectively:",
    options: [
      "20.11 and 5.96 per 1000",
      "18.89 and 6.28 per 1000",
      "22.24 and 6.92 per 1000",
      "17.68 and 4.87 per 1000"
    ],
    answerIndex: 0,
    explanation: "In 2024 Mizoram's birth rate was 20.11 and death rate 5.96 per 1000 (Table 23.15). The 2023 figures were 18.89 and 6.28. Urban birth rates (22.24) exceed rural (17.68).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "health",
      "crs",
      "vital-statistics"
    ]
  },
  {
    id: "mzshb24-health-011",
    type: "mcq",
    subject: "gk",
    topic: "health",
    topicLabel: "Health, NFHS-5 & Vital Statistics",
    difficulty: "hard",
    question: "In 2023-24, the number of Health Sub Centres (SC) in Mizoram was:",
    options: [
      "408",
      "322",
      "372",
      "54"
    ],
    answerIndex: 0,
    explanation: "There were 408 Health Sub Centres in 2023-24, up from 372 in 2022-23 (Table 23.1). 322 is the number of Health Sub Centre Clinics and 54 the number of Primary Health Centres.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "health",
      "health-infrastructure"
    ]
  },
  {
    id: "mzshb24-health-012",
    type: "mcq",
    subject: "gk",
    topic: "health",
    topicLabel: "Health, NFHS-5 & Vital Statistics",
    difficulty: "hard",
    question: "Between 2022-23 and 2023-24, the number of Community Health Centres (CHC) in Mizoram:",
    options: [
      "Rose from 9 to 16",
      "Fell from 16 to 9",
      "Remained unchanged at 9",
      "Rose from 9 to 10"
    ],
    answerIndex: 0,
    explanation: "CHCs rose from 9 to 16 (Table 23.1). Over the same period Primary Health Centres fell from 61 to 54, and Health Sub Centre Clinics rose sharply from 175 to 322.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "health",
      "health-infrastructure"
    ]
  },
  {
    id: "mzshb24-education-001",
    type: "mcq",
    subject: "gk",
    topic: "education",
    topicLabel: "Education",
    difficulty: "medium",
    question: "The total number of primary schools in Mizoram in 2023-24 was:",
    options: [
      "1,920",
      "1,477",
      "713",
      "1,922"
    ],
    answerIndex: 0,
    explanation: "Mizoram had 1,920 primary schools in 2023-24, down marginally from 1,922 in 2022-23 (Table 24.1). Middle schools numbered 1,477, high schools 713 and higher secondary schools 206.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "education",
      "schools"
    ]
  },
  {
    id: "mzshb24-education-002",
    type: "mcq",
    subject: "gk",
    topic: "education",
    topicLabel: "Education",
    difficulty: "hard",
    question: "Between 2022-23 and 2023-24, which category of school in Mizoram saw the LARGEST decline in number?",
    options: [
      "Middle (Upper Primary) schools, from 1,552 to 1,477",
      "Primary schools, from 1,922 to 1,920",
      "High schools, from 718 to 713",
      "Higher secondary schools, from 204 to 206"
    ],
    answerIndex: 0,
    explanation: "Middle schools fell by 75, from 1,552 to 1,477 (Table 24.1) — much the largest drop. Higher secondary schools actually rose, from 204 to 206.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "education",
      "schools"
    ]
  },
  {
    id: "mzshb24-education-003",
    type: "mcq",
    subject: "gk",
    topic: "education",
    topicLabel: "Education",
    difficulty: "hard",
    question: "Among the management types of primary schools in Mizoram in 2023-24, which accounted for the largest number?",
    options: [
      "State Government (789)",
      "Private unaided (653)",
      "Local bodies (289)",
      "Samagra Shiksha / SSA (189)"
    ],
    answerIndex: 0,
    explanation: "State Government ran 789 of the 1,920 primary schools, ahead of private unaided (653), local bodies (289) and Samagra Shiksha (189) — Table 24.2. Central Government schools fell from 4 to 0.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "education",
      "schools",
      "management"
    ]
  },
  {
    id: "mzshb24-education-004",
    type: "mcq",
    subject: "gk",
    topic: "education",
    topicLabel: "Education",
    difficulty: "medium",
    question: "The number of universities in Mizoram, as recorded in the Statistical Handbook 2024, is:",
    options: [
      "2 (Mizoram University and ICFAI)",
      "1 (Mizoram University only)",
      "3",
      "4"
    ],
    answerIndex: 0,
    explanation: "Mizoram has 2 universities — Mizoram University (MZU, a central university) and ICFAI University (Table 24.12).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "education",
      "higher-education",
      "universities"
    ]
  },
  {
    id: "mzshb24-education-005",
    type: "mcq",
    subject: "gk",
    topic: "education",
    topicLabel: "Education",
    difficulty: "hard",
    question: "In 2023-24, the total number of Arts/Science/Commerce colleges in Mizoram was:",
    options: [
      "29 (21 Government and 8 private)",
      "43 (all types of college)",
      "21 (all Government)",
      "30 (22 Government and 8 private)"
    ],
    answerIndex: 0,
    explanation: "There were 29 Arts/Science/Commerce colleges — 21 Government (State) and 8 private (Table 24.12). The total of ALL colleges, including nursing, theological, law, veterinary and NIT, was 43.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "education",
      "higher-education",
      "colleges"
    ]
  },
  {
    id: "mzshb24-education-006",
    type: "mcq",
    subject: "gk",
    topic: "education",
    topicLabel: "Education",
    difficulty: "hard",
    question: "How many Colleges of Nursing were there in Mizoram in 2023-24?",
    options: [
      "6",
      "2",
      "1",
      "9"
    ],
    answerIndex: 0,
    explanation: "Mizoram had 6 Colleges of Nursing in 2023-24 (Table 24.12) — the largest single category after Arts/Science/Commerce colleges. There were 2 theological colleges and one each of law, veterinary science, Hindi training, IASE, Pachhunga University College and NIT.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "education",
      "higher-education",
      "nursing"
    ]
  },
  {
    id: "mzshb24-power-001",
    type: "mcq",
    subject: "gk",
    topic: "power",
    topicLabel: "Power & Electricity",
    difficulty: "medium",
    question: "Mizoram's total installed power generation capacity in 2023-24 was:",
    options: [
      "62.70 MW",
      "31.70 MW",
      "222.51 MW",
      "159.12 MW"
    ],
    answerIndex: 0,
    explanation: "Total installed capacity was 62.70 MW in 2023-24 — hydro 38.35 MW, solar 23.85 MW and diesel 0.50 MW, with no thermal capacity (Table 20.1). Capacity had nearly doubled from 31.70 MW in 2021-22.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "power",
      "infrastructure",
      "installed-capacity"
    ]
  },
  {
    id: "mzshb24-power-002",
    type: "mcq",
    subject: "gk",
    topic: "power",
    topicLabel: "Power & Electricity",
    difficulty: "hard",
    question: "The sharp rise in Mizoram's installed capacity between 2021-22 and 2022-23 was driven mainly by:",
    options: [
      "A large addition of solar capacity, from 2.35 MW to 23.85 MW",
      "New thermal power plants",
      "A doubling of hydro capacity",
      "New diesel generating sets"
    ],
    answerIndex: 0,
    explanation: "Solar capacity rose from 2.35 MW to 23.85 MW, and hydro from 29.35 MW to 38.35 MW, taking the total from 31.70 MW to 62.70 MW (Table 20.1). Mizoram has no thermal capacity at all.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "power",
      "infrastructure",
      "solar",
      "renewables"
    ]
  },
  {
    id: "mzshb24-power-003",
    type: "mcq",
    subject: "gk",
    topic: "power",
    topicLabel: "Power & Electricity",
    difficulty: "hard",
    question: "Mizoram's estimated hydropower potential, as recorded in the Statistical Handbook, is:",
    options: [
      "3,500 MW",
      "222.51 MW",
      "159.12 MW",
      "62.70 MW"
    ],
    answerIndex: 0,
    explanation: "Estimated power potential is 3,500 MW (Table 20.2) — against an installed capacity of just 62.70 MW and a peak demand of 159.12 MW, showing how little of the potential is developed.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "power",
      "infrastructure",
      "hydropower",
      "potential",
      "mizo-hills"
    ]
  },
  {
    id: "mzshb24-power-004",
    type: "mcq",
    subject: "gk",
    topic: "power",
    topicLabel: "Power & Electricity",
    difficulty: "hard",
    question: "Mizoram's peak power demand and allocated share of power in 2023-24 were respectively:",
    options: [
      "159.12 MW and 222.51 MW",
      "222.51 MW and 159.12 MW",
      "62.70 MW and 159.12 MW",
      "3,500 MW and 222.51 MW"
    ],
    answerIndex: 0,
    explanation: "Peak power demand was 159.12 MW while the allocated share of power was 222.51 MW (Table 20.2).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "power",
      "infrastructure",
      "demand",
      "mizo-hills"
    ]
  },
  {
    id: "mzshb24-power-005",
    type: "mcq",
    subject: "gk",
    topic: "power",
    topicLabel: "Power & Electricity",
    difficulty: "hard",
    question: "A striking change in Mizoram's power position between 2021-22 and 2023-24 was that net import of electricity:",
    options: [
      "Collapsed from 647.61 MU to 0.41 MU",
      "Rose from 0.41 MU to 647.61 MU",
      "Remained steady at about 600 MU",
      "Fell modestly from 647.61 MU to 500 MU"
    ],
    answerIndex: 0,
    explanation: "Net import fell from 647.61 MU in 2021-22 to 29.83 MU in 2022-23 and just 0.41 MU in 2023-24, while own generation rose from 28.12 MU to 85.28 MU (Table 20.1) — a marked move towards self-sufficiency.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "power",
      "infrastructure",
      "imports",
      "self-sufficiency"
    ]
  },
  {
    id: "mzshb24-power-006",
    type: "mcq",
    subject: "gk",
    topic: "power",
    topicLabel: "Power & Electricity",
    difficulty: "hard",
    question: "Which category of consumer accounted for the largest share of electricity consumption in Mizoram in 2023-24?",
    options: [
      "Domestic (306.16 MU)",
      "Commercial (57.71 MU)",
      "Public water works (95.56 MU)",
      "Industrial (16.03 MU)"
    ],
    answerIndex: 0,
    explanation: "Domestic consumption was 306.16 MU out of a total 515.49 MU — nearly 60% (Table 20.4). Public water works (95.56 MU) and commercial (57.71 MU) followed; agriculture was smallest at 0.27 MU.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "power",
      "infrastructure",
      "consumption"
    ]
  },
  {
    id: "mzshb24-power-007",
    type: "mcq",
    subject: "gk",
    topic: "power",
    topicLabel: "Power & Electricity",
    difficulty: "hard",
    question: "Mizoram's per capita electricity consumption in 2023-24 was:",
    options: [
      "411.74 kWh",
      "439.42 kWh",
      "342.68 kWh",
      "515.49 kWh"
    ],
    answerIndex: 0,
    explanation: "Per capita consumption was 411.74 kWh in 2023-24, down from 439.42 kWh in 2022-23 (Table 20.4). 515.49 MU was total consumption.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "power",
      "infrastructure",
      "per-capita-consumption"
    ]
  },
  {
    id: "mzshb24-power-008",
    type: "mcq",
    subject: "gk",
    topic: "power",
    topicLabel: "Power & Electricity",
    difficulty: "hard",
    question: "The number of villages electrified in Mizoram up to 31st March 2024 was:",
    options: [
      "717 out of 730 inhabited villages",
      "730 out of 730 inhabited villages",
      "704 out of 830 villages",
      "690 out of 730 inhabited villages"
    ],
    answerIndex: 0,
    explanation: "717 of Mizoram's 730 inhabited villages were electrified up to 31 March 2024, giving a state figure of 98.19% (Table 20.3). Lawngtlai had the largest shortfall, with 164 of 170 villages electrified.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "power",
      "infrastructure",
      "electrification",
      "lawngtlai"
    ]
  },
  {
    id: "mzshb24-transport-001",
    type: "mcq",
    subject: "gk",
    topic: "transport",
    topicLabel: "Roads, Transport & Communication",
    difficulty: "medium",
    question: "The total length of roads in Mizoram in 2023-24 was:",
    options: [
      "7,708.00 km",
      "6,688.52 km",
      "3,999.21 km",
      "1,016.48 km"
    ],
    answerIndex: 0,
    explanation: "Total road length was 7,708.00 km — 6,688.52 km surfaced and 1,016.48 km unsurfaced (Table 21.5), at an overall road density of 31.38 km per 100 sq km.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "transport",
      "infrastructure",
      "roads"
    ]
  },
  {
    id: "mzshb24-transport-002",
    type: "mcq",
    subject: "gk",
    topic: "transport",
    topicLabel: "Roads, Transport & Communication",
    difficulty: "hard",
    question: "Which category accounts for the greatest road length in Mizoram (2023-24)?",
    options: [
      "Village roads (3,999.21 km)",
      "Town roads (1,384.55 km)",
      "District roads (1,362.63 km)",
      "National Highways (590.29 km)"
    ],
    answerIndex: 0,
    explanation: "Village roads, at 3,999.21 km, make up over half of Mizoram's 7,708.00 km network (Table 21.5). Town roads (1,384.55 km) and district roads (1,362.63 km) follow.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "transport",
      "infrastructure",
      "roads"
    ]
  },
  {
    id: "mzshb24-transport-003",
    type: "mcq",
    subject: "gk",
    topic: "transport",
    topicLabel: "Roads, Transport & Communication",
    difficulty: "hard",
    question: "The total length of National Highways in Mizoram in 2023-24 was:",
    options: [
      "590.29 km",
      "371.32 km",
      "549.29 km",
      "1,362.63 km"
    ],
    answerIndex: 0,
    explanation: "National Highways ran 590.29 km — 549.29 km surfaced and 41.00 km unsurfaced (Table 21.5). State Highways accounted for a further 371.32 km, all of it surfaced.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "transport",
      "infrastructure",
      "roads",
      "national-highways"
    ]
  },
  {
    id: "mzshb24-transport-004",
    type: "mcq",
    subject: "gk",
    topic: "transport",
    topicLabel: "Roads, Transport & Communication",
    difficulty: "hard",
    question: "The overall road density of Mizoram in 2023-24 was:",
    options: [
      "31.38 km per 100 sq km",
      "16.28 km per 100 sq km",
      "2.40 km per 100 sq km",
      "43.20 km per 100 sq km"
    ],
    answerIndex: 0,
    explanation: "Overall road density was 31.38 km per 100 sq km (Table 21.5), of which village roads alone contributed 16.28.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "transport",
      "infrastructure",
      "roads",
      "density"
    ]
  },
  {
    id: "mzshb24-transport-005",
    type: "mcq",
    subject: "gk",
    topic: "transport",
    topicLabel: "Roads, Transport & Communication",
    difficulty: "medium",
    question: "The total number of vehicles on road in Mizoram as on 31.3.2024 was:",
    options: [
      "3,03,801",
      "3,00,906",
      "2,07,351",
      "51,389"
    ],
    answerIndex: 0,
    explanation: "There were 3,03,801 vehicles — 3,00,906 private and 2,895 government (Table 21.1). Of these, 2,07,351 were motor cycles and scooters.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "transport",
      "infrastructure",
      "vehicles"
    ]
  },
  {
    id: "mzshb24-transport-006",
    type: "mcq",
    subject: "gk",
    topic: "transport",
    topicLabel: "Roads, Transport & Communication",
    difficulty: "hard",
    question: "Which type of vehicle is most numerous on Mizoram's roads as on 31.3.2024?",
    options: [
      "Motor cycles / scooters (2,07,351)",
      "Motor cars (51,389)",
      "Goods carriers (21,708)",
      "Three-wheelers (6,219)"
    ],
    answerIndex: 0,
    explanation: "Motor cycles and scooters number 2,07,351, roughly 68% of all 3,03,801 registered vehicles (Table 21.1). Motor cars (51,389) and goods carriers (21,708) follow.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "transport",
      "infrastructure",
      "vehicles"
    ]
  },
  {
    id: "mzshb24-transport-007",
    type: "mcq",
    subject: "gk",
    topic: "transport",
    topicLabel: "Roads, Transport & Communication",
    difficulty: "hard",
    question: "In 2023-24, the number of airlines operating in Mizoram and the total air passengers carried were:",
    options: [
      "2 airlines and 2,10,046 passengers",
      "3 airlines and 1,68,474 passengers",
      "2 airlines and 1,68,474 passengers",
      "3 airlines and 2,10,046 passengers"
    ],
    answerIndex: 0,
    explanation: "In 2023-24 just 2 airlines operated in Mizoram (down from 3), yet passenger numbers rose to 2,10,046 from 1,68,474 (Table 21.7).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "transport",
      "infrastructure",
      "aviation"
    ]
  },
  {
    id: "mzshb24-transport-008",
    type: "mcq",
    subject: "gk",
    topic: "transport",
    topicLabel: "Roads, Transport & Communication",
    difficulty: "hard",
    question: "The number of operational helipads in Mizoram in 2023-24 was:",
    options: [
      "40",
      "33",
      "26",
      "23"
    ],
    answerIndex: 0,
    explanation: "Mizoram had 40 operational helipads in 2023-24, up from 33 (Table 21.7), serving 26 helicopter destinations. Helicopter passengers, however, fell from 14,846 to 9,868.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "transport",
      "infrastructure",
      "aviation",
      "helicopter"
    ]
  },
  {
    id: "mzshb24-tourism-001",
    type: "mcq",
    subject: "gk",
    topic: "tourism",
    topicLabel: "Tourism",
    difficulty: "medium",
    question: "The number of foreign tourists who arrived in Mizoram in 2023-24 was:",
    options: [
      "3,884",
      "3,551",
      "5,469",
      "2,15,230"
    ],
    answerIndex: 0,
    explanation: "Foreign tourist arrivals rose to 3,884 in 2023-24 from 3,551 in 2022-23, while domestic arrivals fell from 2,18,457 to 2,15,230 (Table 17.1).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "tourism",
      "tourist-arrivals"
    ]
  },
  {
    id: "mzshb24-tourism-002",
    type: "mcq",
    subject: "gk",
    topic: "tourism",
    topicLabel: "Tourism",
    difficulty: "hard",
    question: "Revenue collected from tourist facilities in Mizoram in 2023-24 was:",
    options: [
      "Rs. 374.37 lakh",
      "Rs. 297.68 lakh",
      "Rs. 297.19 lakh",
      "Rs. 436.89 lakh"
    ],
    answerIndex: 0,
    explanation: "Revenue from tourist facilities was Rs. 374.37 lakh in 2023-24, up from Rs. 297.68 lakh in 2022-23 (Table 17.1) — a rise achieved even though domestic arrivals fell.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "tourism",
      "tourism-revenue"
    ]
  },
  {
    id: "mzshb24-tourism-003",
    type: "mcq",
    subject: "gk",
    topic: "tourism",
    topicLabel: "Tourism",
    difficulty: "hard",
    question: "In calendar year 2024, total tourist arrivals in Mizoram numbered:",
    options: [
      "5,22,629",
      "5,17,160",
      "2,15,230",
      "5,469"
    ],
    answerIndex: 0,
    explanation: "Total arrivals in 2024 were 5,22,629 — 5,17,160 domestic and 5,469 foreign (Table 17.2). Note this calendar-year count is far above the 2023-24 financial-year figure in Table 17.1, which is compiled differently.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "tourism",
      "tourist-arrivals"
    ]
  },
  {
    id: "mzshb24-tourism-004",
    type: "mcq",
    subject: "gk",
    topic: "tourism",
    topicLabel: "Tourism",
    difficulty: "hard",
    question: "In 2024, which month recorded the highest tourist arrivals in Mizoram?",
    options: [
      "December (60,112)",
      "January (56,470)",
      "March (53,598)",
      "November (52,256)"
    ],
    answerIndex: 0,
    explanation: "December recorded 60,112 arrivals — the peak month for both domestic (59,132) and foreign (980) tourists (Table 17.2), coinciding with Christmas and the Winter Festival. August was the trough at 29,808.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "tourism",
      "tourist-arrivals",
      "seasonality",
      "mizo-hills"
    ]
  },
  {
    id: "mzshb24-tourism-005",
    type: "mcq",
    subject: "gk",
    topic: "tourism",
    topicLabel: "Tourism",
    difficulty: "hard",
    question: "In 2024, the LOWEST monthly tourist arrivals in Mizoram were recorded in:",
    options: [
      "August (29,808)",
      "July (32,695)",
      "September (30,507)",
      "June (35,722)"
    ],
    answerIndex: 0,
    explanation: "August was the lowest month at 29,808 arrivals, followed by September (30,507) and July (32,695) — Table 17.2. The monsoon months are Mizoram's tourism trough.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "tourism",
      "tourist-arrivals",
      "seasonality"
    ]
  },
  {
    id: "mzshb24-polity-admin-001",
    type: "mcq",
    subject: "polity",
    topic: "polity_admin",
    topicLabel: "Election, MPSC & Local Administration",
    difficulty: "easy",
    question: "The Mizoram Legislative Assembly has how many seats?",
    options: [
      "40",
      "60",
      "32",
      "45"
    ],
    answerIndex: 0,
    explanation: "The Mizoram Legislative Assembly has 40 seats (Table 31.1). Elections to the Assembly were last held in 2023.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "mizoram",
      "polity",
      "administration",
      "assembly",
      "election"
    ]
  },
  {
    id: "mzshb24-polity-admin-002",
    type: "mcq",
    subject: "polity",
    topic: "polity_admin",
    topicLabel: "Election, MPSC & Local Administration",
    difficulty: "hard",
    question: "The total electorate in the 2023 general election to the Mizoram Legislative Assembly was:",
    options: [
      "8,57,063 (including service voters)",
      "7,05,057",
      "6,99,867",
      "4,39,026"
    ],
    answerIndex: 0,
    explanation: "The electorate numbered 8,57,063 including service voters, of whom 4,39,026 were women (Table 31.1). Total votes polled including NOTA were 7,05,057.",
    sourceNote: "The Handbook's own Table of Contents lists this table as the '2018' Assembly election, but the table itself is headed and dated 2023 and its figures (40 seats, 8,57,063 electors) match the actual 2023 contest, not 2018. Treated here as 2023, per the table's own heading.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "mizoram",
      "polity",
      "administration",
      "election-2023"
    ]
  },
  {
    id: "mzshb24-polity-admin-003",
    type: "mcq",
    subject: "polity",
    topic: "polity_admin",
    topicLabel: "Election, MPSC & Local Administration",
    difficulty: "hard",
    question: "The voter turnout in the 2023 Mizoram Legislative Assembly election was:",
    options: [
      "82.26%",
      "78.26%",
      "85.26%",
      "80.11%"
    ],
    answerIndex: 0,
    explanation: "Turnout was 82.26% — 7,05,057 votes polled (including NOTA) from an electorate of 8,57,063 (Table 31.1).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "mizoram",
      "polity",
      "administration",
      "election-2023",
      "turnout"
    ]
  },
  {
    id: "mzshb24-polity-admin-004",
    type: "mcq",
    subject: "polity",
    topic: "polity_admin",
    topicLabel: "Election, MPSC & Local Administration",
    difficulty: "hard",
    question: "In the 2023 Mizoram Legislative Assembly election, the number of votes polled in favour of NOTA was:",
    options: [
      "2,779",
      "2,411",
      "1,276",
      "5,190"
    ],
    answerIndex: 0,
    explanation: "NOTA received 2,779 votes, while a further 2,411 votes were rejected (Table 31.1). Valid votes excluding NOTA totalled 6,99,867.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "mizoram",
      "polity",
      "administration",
      "election-2023",
      "nota"
    ]
  },
  {
    id: "mzshb24-polity-admin-005",
    type: "mcq",
    subject: "polity",
    topic: "polity_admin",
    topicLabel: "Election, MPSC & Local Administration",
    difficulty: "hard",
    question: "In the 2023 Mizoram Legislative Assembly election, the number of candidates and of women candidates was:",
    options: [
      "174 candidates, of whom 18 were women",
      "174 candidates, of whom 40 were women",
      "140 candidates, of whom 18 were women",
      "216 candidates, of whom 18 were women"
    ],
    answerIndex: 0,
    explanation: "There were 174 candidates in all, of whom 18 were women (Table 31.1), contesting across 1,276 polling stations.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "mizoram",
      "polity",
      "administration",
      "election-2023"
    ]
  },
  {
    id: "mzshb24-polity-admin-006",
    type: "mcq",
    subject: "polity",
    topic: "polity_admin",
    topicLabel: "Election, MPSC & Local Administration",
    difficulty: "medium",
    question: "In 2023-24, the total number of vacant posts advertised by the Mizoram Public Service Commission (MPSC) was:",
    options: [
      "133",
      "114",
      "83",
      "20"
    ],
    answerIndex: 0,
    explanation: "MPSC advertised 133 vacant posts in 2023-24 — 114 Group A, 16 Group B Gazetted, 3 Group B and none in Group C (Table 32.1).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "mizoram",
      "polity",
      "administration",
      "mpsc",
      "recruitment"
    ]
  },
  {
    id: "mzshb24-polity-admin-007",
    type: "mcq",
    subject: "polity",
    topic: "polity_admin",
    topicLabel: "Election, MPSC & Local Administration",
    difficulty: "hard",
    question: "Of the 133 posts advertised by MPSC in 2023-24, how many were Group A posts?",
    options: [
      "114",
      "16",
      "83",
      "17"
    ],
    answerIndex: 0,
    explanation: "Group A accounted for 114 of the 133 posts advertised, with 16 Group B Gazetted and 3 Group B (Table 32.1).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "mizoram",
      "polity",
      "administration",
      "mpsc",
      "recruitment"
    ]
  },
  {
    id: "mzshb24-polity-admin-008",
    type: "mcq",
    subject: "polity",
    topic: "polity_admin",
    topicLabel: "Election, MPSC & Local Administration",
    difficulty: "hard",
    question: "In 2023-24, MPSC recommended 83 persons for appointment. These were drawn entirely from which category?",
    options: [
      "Group B Gazetted",
      "Group A",
      "Group C",
      "Group B (non-gazetted)"
    ],
    answerIndex: 0,
    explanation: "All 83 persons recommended in 2023-24 were for Group B Gazetted posts; recommendations for Group A and Group B (non-gazetted) were nil that year (Table 32.1).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "mizoram",
      "polity",
      "administration",
      "mpsc",
      "recruitment",
      "group-b-gazetted"
    ]
  },
  {
    id: "mzshb24-polity-admin-009",
    type: "mcq",
    subject: "polity",
    topic: "polity_admin",
    topicLabel: "Election, MPSC & Local Administration",
    difficulty: "hard",
    question: "The number of direct recruitment examinations conducted by MPSC in 2023-24 was:",
    options: [
      "20",
      "133",
      "83",
      "17"
    ],
    answerIndex: 0,
    explanation: "MPSC conducted 20 direct recruitment examinations in 2023-24 — 17 for Group A and 3 for Group B Gazetted posts (Table 32.1).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "mizoram",
      "polity",
      "administration",
      "mpsc",
      "recruitment"
    ]
  },
  {
    id: "mzshb24-polity-admin-010",
    type: "mcq",
    subject: "polity",
    topic: "polity_admin",
    topicLabel: "Election, MPSC & Local Administration",
    difficulty: "medium",
    question: "The total number of Village Councils in Mizoram, as per the 2025 general election, was:",
    options: [
      "830",
      "704",
      "4,021",
      "3,122"
    ],
    answerIndex: 0,
    explanation: "Mizoram has 830 Village Councils (Table 40.1), with 4,021 Village Council members in all — 3,122 general seats and 899 reserved for women.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "mizoram",
      "polity",
      "administration",
      "village-council",
      "local-government",
      "panchayat"
    ]
  },
  {
    id: "mzshb24-polity-admin-011",
    type: "mcq",
    subject: "polity",
    topic: "polity_admin",
    topicLabel: "Election, MPSC & Local Administration",
    difficulty: "hard",
    question: "In the 2025 Village Council election in Mizoram, the number of seats reserved for women was:",
    options: [
      "899",
      "3,122",
      "4,021",
      "830"
    ],
    answerIndex: 0,
    explanation: "899 of the 4,021 Village Council seats were reserved for women, alongside 3,122 general seats (Table 40.1) — roughly 22% reservation.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "mizoram",
      "polity",
      "administration",
      "village-council",
      "women-reservation",
      "panchayat"
    ]
  },
  {
    id: "mzshb24-polity-admin-012",
    type: "mcq",
    subject: "polity",
    topic: "polity_admin",
    topicLabel: "Election, MPSC & Local Administration",
    difficulty: "hard",
    question: "Which district has the largest number of Village Councils in Mizoram (2025 election)?",
    options: [
      "Mamit (92)",
      "Lunglei (88)",
      "Aizawl (70)",
      "Champhai (62)"
    ],
    answerIndex: 0,
    explanation: "Among the districts, Mamit has the most Village Councils at 92, followed by Lunglei (88) and Aizawl (70) — Table 40.1. Hnahthial has the fewest at 32. Note that the Mara and Lai Autonomous District Councils each have 99 and the Chakma ADC 88, counted separately from the districts.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "mizoram",
      "polity",
      "administration",
      "village-council",
      "mamit",
      "sixth-schedule-adc",
      "northeast",
      "panchayat"
    ]
  },
  {
    id: "mzshb24-polity-admin-013",
    type: "mcq",
    subject: "polity",
    topic: "polity_admin",
    topicLabel: "Election, MPSC & Local Administration",
    difficulty: "hard",
    question: "In the 2025 Village Council election table, which Autonomous District Councils each account for 99 Village Councils?",
    options: [
      "Mara (MADC) and Lai (LADC)",
      "Lai (LADC) and Chakma (CADC)",
      "Mara (MADC) and Chakma (CADC)",
      "All three ADCs have 99 each"
    ],
    answerIndex: 0,
    explanation: "The Mara (MADC) and Lai (LADC) Autonomous District Councils have 99 Village Councils each, while the Chakma (CADC) has 88 (Table 40.1).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "mizoram",
      "polity",
      "administration",
      "village-council",
      "adc",
      "sixth-schedule-adc",
      "northeast",
      "panchayat"
    ]
  },
  {
    id: "mzshb24-crime-police-001",
    type: "mcq",
    subject: "gk",
    topic: "crime_police",
    topicLabel: "Police, Crime & Public Order",
    difficulty: "medium",
    question: "The total number of police stations in Mizoram in 2024 was:",
    options: [
      "44",
      "93",
      "14",
      "15"
    ],
    answerIndex: 0,
    explanation: "Mizoram had 44 police stations in 2024, unchanged from 2023, along with 14 out-posts, 15 check-posts and 93 wireless stations (Table 27.1). The figure of 44 includes 3 CID (Crime) police stations.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "crime",
      "police",
      "police-stations"
    ]
  },
  {
    id: "mzshb24-crime-police-002",
    type: "mcq",
    subject: "gk",
    topic: "crime_police",
    topicLabel: "Police, Crime & Public Order",
    difficulty: "hard",
    question: "Which district of Mizoram has the largest number of police stations?",
    options: [
      "Aizawl (9)",
      "Mamit and Lawngtlai (5 each)",
      "Kolasib and Lunglei (4 each)",
      "Champhai (3)"
    ],
    answerIndex: 0,
    explanation: "Aizawl has 9 police stations, the most of any district (Table 27.1). Mamit and Lawngtlai have 5 each; Khawzawl has just 1.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "crime",
      "police",
      "police-stations",
      "aizawl",
      "lawngtlai"
    ]
  },
  {
    id: "mzshb24-crime-police-003",
    type: "mcq",
    subject: "gk",
    topic: "crime_police",
    topicLabel: "Police, Crime & Public Order",
    difficulty: "hard",
    question: "The total number of suicides recorded in Mizoram in 2024, and the suicide rate per lakh population, were:",
    options: [
      "96 suicides, rate 6.7",
      "81 suicides, rate 5.7",
      "96 suicides, rate 11.5",
      "82 suicides, rate 6.7"
    ],
    answerIndex: 0,
    explanation: "Mizoram recorded 96 suicides in 2024 (82 male, 14 female), a rate of 6.7 per lakh population — up from 81 suicides and a rate of 5.7 in 2023 (Table 27.6). The male rate (11.5) is about six times the female rate (1.9).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "crime",
      "police",
      "suicide"
    ]
  },
  {
    id: "mzshb24-crime-police-004",
    type: "mcq",
    subject: "gk",
    topic: "crime_police",
    topicLabel: "Police, Crime & Public Order",
    difficulty: "hard",
    question: "In 2024, which district of Mizoram recorded the highest suicide RATE per lakh population?",
    options: [
      "Hnahthial (12.4)",
      "Kolasib (11.3)",
      "Aizawl (9.0)",
      "Siaha (8.4)"
    ],
    answerIndex: 0,
    explanation: "Hnahthial recorded the highest rate at 12.4 per lakh, ahead of Kolasib (11.3) and Aizawl (9.0) — Table 27.6. Aizawl had the highest absolute number (44) but a lower rate because of its much larger population — a good illustration of why rate and count differ.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "crime",
      "police",
      "suicide",
      "hnahthial"
    ]
  },
  {
    id: "mzshb24-all-india-001",
    type: "mcq",
    subject: "geography",
    topic: "all_india",
    topicLabel: "All-India Comparison (Census 2011)",
    difficulty: "easy",
    question: "The total population of India as per Census 2011 was:",
    options: [
      "1,21,01,93,422",
      "1,02,87,37,436",
      "1,32,01,93,422",
      "1,17,01,93,422"
    ],
    answerIndex: 0,
    explanation: "India's Census 2011 population was 1,21,01,93,422 — 62,37,24,248 males and 58,64,69,174 females (Table 47.1), at a density of 382 persons per sq km.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "india",
      "census-2011",
      "comparative",
      "population"
    ]
  },
  {
    id: "mzshb24-all-india-002",
    type: "mcq",
    subject: "geography",
    topic: "all_india",
    topicLabel: "All-India Comparison (Census 2011)",
    difficulty: "easy",
    question: "The sex ratio and literacy rate of India as per Census 2011 were respectively:",
    options: [
      "940 and 74.04%",
      "976 and 91.33%",
      "933 and 64.83%",
      "943 and 77.70%"
    ],
    answerIndex: 0,
    explanation: "India's sex ratio was 940 females per 1000 males and literacy 74.04% — male 82.14% and female 65.46% (Table 47.3). Mizoram exceeded both, at 976 and 91.58%.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "india",
      "census-2011",
      "comparative",
      "sex-ratio",
      "literacy"
    ]
  },
  {
    id: "mzshb24-all-india-003",
    type: "mcq",
    subject: "geography",
    topic: "all_india",
    topicLabel: "All-India Comparison (Census 2011)",
    difficulty: "medium",
    question: "As per Census 2011, which State recorded the highest literacy rate in India?",
    options: [
      "Kerala (93.91%)",
      "Mizoram (91.58%)",
      "Tripura (87.75%)",
      "Goa (87.40%)"
    ],
    answerIndex: 0,
    explanation: "Kerala led with 93.91% literacy, followed by Mizoram at 91.58% (Table 47.3). Among Union Territories, Lakshadweep recorded 92.28%.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "india",
      "census-2011",
      "comparative",
      "literacy",
      "kerala"
    ]
  },
  {
    id: "mzshb24-all-india-004",
    type: "mcq",
    subject: "geography",
    topic: "all_india",
    topicLabel: "All-India Comparison (Census 2011)",
    difficulty: "hard",
    question: "As per Census 2011, Mizoram's rank among the STATES of India on literacy rate was:",
    options: [
      "Second, after Kerala",
      "First",
      "Third, after Kerala and Tripura",
      "Fifth"
    ],
    answerIndex: 0,
    explanation: "Mizoram's 91.58% literacy was second only to Kerala's 93.91% among the States (Table 47.3). If Union Territories are included, Lakshadweep (92.28%) pushes Mizoram to third overall — a distinction worth watching in the question's wording.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "india",
      "census-2011",
      "comparative",
      "literacy",
      "ranking"
    ]
  },
  {
    id: "mzshb24-all-india-005",
    type: "mcq",
    subject: "geography",
    topic: "all_india",
    topicLabel: "All-India Comparison (Census 2011)",
    difficulty: "hard",
    question: "As per Census 2011, which State recorded the LOWEST literacy rate in India?",
    options: [
      "Bihar (63.82%)",
      "Arunachal Pradesh (66.95%)",
      "Rajasthan (67.06%)",
      "Jharkhand (67.63%)"
    ],
    answerIndex: 0,
    explanation: "Bihar recorded the lowest literacy rate among States at 63.82%, followed by Arunachal Pradesh (66.95%) and Rajasthan (67.06%) — Table 47.3. Rajasthan had the lowest FEMALE literacy at 52.66%.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "india",
      "census-2011",
      "comparative",
      "literacy",
      "bihar"
    ]
  },
  {
    id: "mzshb24-all-india-006",
    type: "mcq",
    subject: "geography",
    topic: "all_india",
    topicLabel: "All-India Comparison (Census 2011)",
    difficulty: "medium",
    question: "As per Census 2011, which State had the highest sex ratio in India?",
    options: [
      "Kerala (1,084)",
      "Tamil Nadu (995)",
      "Andhra Pradesh (992)",
      "Puducherry (1,038)"
    ],
    answerIndex: 0,
    explanation: "Kerala had the highest sex ratio among States at 1,084 females per 1000 males (Table 47.3). Puducherry, at 1,038, was the only Union Territory above 1000.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "india",
      "census-2011",
      "comparative",
      "sex-ratio",
      "kerala"
    ]
  },
  {
    id: "mzshb24-all-india-007",
    type: "mcq",
    subject: "geography",
    topic: "all_india",
    topicLabel: "All-India Comparison (Census 2011)",
    difficulty: "hard",
    question: "As per Census 2011, which State recorded the LOWEST population density in India?",
    options: [
      "Arunachal Pradesh (17 per sq km)",
      "Mizoram (52 per sq km)",
      "Sikkim (86 per sq km)",
      "Nagaland (119 per sq km)"
    ],
    answerIndex: 0,
    explanation: "Arunachal Pradesh, at 17 persons per sq km, was the least densely populated State; Mizoram was second lowest at 52 (Tables 47.1 and 47.2).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "india",
      "census-2011",
      "comparative",
      "density",
      "arunachal"
    ]
  },
  {
    id: "mzshb24-all-india-008",
    type: "mcq",
    subject: "geography",
    topic: "all_india",
    topicLabel: "All-India Comparison (Census 2011)",
    difficulty: "hard",
    question: "As per Census 2011, Mizoram's rank among the States of India on population density was:",
    options: [
      "Second lowest, after Arunachal Pradesh",
      "Lowest of all States",
      "Third lowest, after Arunachal Pradesh and Sikkim",
      "Fifth lowest"
    ],
    answerIndex: 0,
    explanation: "With 52 persons per sq km, Mizoram was the second least densely populated State after Arunachal Pradesh (17). Sikkim followed at 86 (Tables 47.1 and 47.2).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "india",
      "census-2011",
      "comparative",
      "density",
      "ranking"
    ]
  },
  {
    id: "mzshb24-all-india-009",
    type: "mcq",
    subject: "geography",
    topic: "all_india",
    topicLabel: "All-India Comparison (Census 2011)",
    difficulty: "hard",
    question: "As per Census 2011, which State had the highest population density in India?",
    options: [
      "Bihar (1,102 per sq km)",
      "West Bengal (1,029 per sq km)",
      "Uttar Pradesh (828 per sq km)",
      "Kerala (859 per sq km)"
    ],
    answerIndex: 0,
    explanation: "Bihar was the densest State at 1,102 persons per sq km, ahead of West Bengal (1,029) and Kerala (859) — Tables 47.1 and 47.2. Among Union Territories, Delhi recorded 11,297 and Chandigarh 9,252.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "india",
      "census-2011",
      "comparative",
      "density",
      "bihar"
    ]
  },
  {
    id: "mzshb24-all-india-010",
    type: "mcq",
    subject: "geography",
    topic: "all_india",
    topicLabel: "All-India Comparison (Census 2011)",
    difficulty: "hard",
    question: "As per Census 2011, which was the least populous State of India?",
    options: [
      "Sikkim (6,07,688)",
      "Mizoram (10,91,014)",
      "Arunachal Pradesh (13,82,611)",
      "Goa (14,57,723)"
    ],
    answerIndex: 0,
    explanation: "Sikkim, with 6,07,688 persons, was the least populous State; Mizoram was second least populous at 10,91,014 as printed in Table 47.1 (Tables 47.1 and 47.2).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "india",
      "census-2011",
      "comparative",
      "population",
      "sikkim",
      "ranking"
    ]
  },
  {
    id: "mzshb24-all-india-011",
    type: "mcq",
    subject: "geography",
    topic: "all_india",
    topicLabel: "All-India Comparison (Census 2011)",
    difficulty: "hard",
    question: "As per Census 2011, Mizoram ranked where among Indian States by total population?",
    options: [
      "Second least populous, after Sikkim",
      "Least populous",
      "Third least populous, after Sikkim and Goa",
      "Fourth least populous"
    ],
    answerIndex: 0,
    explanation: "Mizoram was the second least populous State after Sikkim (6,07,688), ahead of Arunachal Pradesh (13,82,611) and Goa (14,57,723) — Tables 47.1 and 47.2.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "india",
      "census-2011",
      "comparative",
      "population",
      "ranking"
    ]
  },
  {
    id: "mzshb24-all-india-012",
    type: "mcq",
    subject: "geography",
    topic: "all_india",
    topicLabel: "All-India Comparison (Census 2011)",
    difficulty: "hard",
    question: "As per Census 2011, which Union Territory recorded the lowest sex ratio in India?",
    options: [
      "Daman & Diu (618)",
      "Chandigarh (818)",
      "Dadra & Nagar Haveli (775)",
      "Delhi (866)"
    ],
    answerIndex: 0,
    explanation: "Daman & Diu recorded 618 females per 1000 males, the lowest of any State or UT, followed by Dadra & Nagar Haveli (775) and Chandigarh (818) — Table 47.4. Among States, Haryana was lowest at 877.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "india",
      "census-2011",
      "comparative",
      "sex-ratio"
    ]
  },
  {
    id: "mzshb24-all-india-013",
    type: "mcq",
    subject: "geography",
    topic: "all_india",
    topicLabel: "All-India Comparison (Census 2011)",
    difficulty: "hard",
    question: "On which of these Census 2011 indicators did Mizoram perform BELOW the all-India average?",
    options: [
      "Population density",
      "Literacy rate",
      "Sex ratio",
      "Female literacy rate"
    ],
    answerIndex: 0,
    explanation: "Mizoram's density of 52 per sq km is far below the national 382 — but that reflects its hilly terrain, not a deficit. On literacy (91.58% vs 74.04%), sex ratio (975 vs 940) and female literacy (89.40% vs 65.46%) Mizoram is well above the national average (Tables 47.1–47.4).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "india",
      "census-2011",
      "comparative"
    ]
  },
  {
    id: "mzshb24-descriptive-stats-001",
    type: "descriptive",
    subject: "gk",
    topic: "descriptive_stats",
    topicLabel: "Descriptive & Essay — Data-Backed Answers",
    difficulty: "hard",
    question: "Mizoram's economy has undergone a marked structural shift over the last decade. Using data from the Statistical Handbook 2024, describe this shift and discuss its implications.",
    guidance: "Lead with the numbers, then interpret. Examiners reward a candidate who can quote the sectoral shares AND explain why a falling agricultural share is not automatically good news.",
    wordLimit: 250,
    explanation: "MODEL FRAMEWORK (all figures Table 3.1 and 3.4, 2011-12 series):\n\nTHE SHIFT — sectoral share of GSDP:\n• Agriculture & allied: 31.49% (2014-15) → 19.61% (2023-24 P) — a fall of nearly 12 percentage points.\n• Industry: 20.87% → 31.06% — a rise of over 10 points; industry overtook agriculture in 2017-18 (26.64% vs 26.51%).\n• Services: 47.63% → 49.33% — consistently the largest sector throughout.\n\nTHE GROWTH RECORD:\n• GSDP at current prices: Rs. 13,509.40 crore (2014-15) → Rs. 33,276.73 crore (2023-24 P), roughly 2.5x in nine years.\n• Per capita income at current prices: Rs. 1,03,049 → Rs. 2,34,996.\n• The one contraction: 2020-21, when GSDP fell to Rs. 23,922.94 crore from Rs. 24,989.60 crore (COVID-19).\n\nIMPLICATIONS TO DISCUSS:\n• Agriculture's shrinking GSDP share has NOT been matched by a comparable shift of workers out of agriculture — a productivity and employment concern.\n• Within agriculture, the WRC-versus-jhum contrast matters: WRC yields 2,216 kg/ha against jhum's 1,220 kg/ha (Table 8.1), so raising productivity is as much about cultivation method as about area.\n• Industry's rise is partly construction- and power-led rather than manufacturing-led — note installed capacity nearly doubling from 31.70 MW to 62.70 MW (Table 20.1).\n• A services-dominated, government-heavy economy raises questions about own-revenue generation and fiscal sustainability.\n\nCAUTION: 2023-24 figures are Provisional (P) — say so in an exam answer.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "descriptive",
      "mains",
      "essay",
      "economy",
      "gsdp",
      "structural-change"
    ]
  },
  {
    id: "mzshb24-descriptive-stats-002",
    type: "descriptive",
    subject: "gk",
    topic: "descriptive_stats",
    topicLabel: "Descriptive & Essay — Data-Backed Answers",
    difficulty: "hard",
    question: "Mizoram has the second highest forest cover percentage in India, yet the Statistical Handbook records substantial forest offences. Examine this apparent paradox using data.",
    guidance: "The strongest answers distinguish forest COVER (satellite-assessed, 85.34%) from RECORDED forest area (legal, 46.92%) and from forest QUALITY (very dense = 1.2%). Do not treat the three as interchangeable.",
    wordLimit: 250,
    explanation: "MODEL FRAMEWORK:\n\nTHE FOREST ENDOWMENT:\n• Forest cover (ISFR 2023): 17,990.46 sq km = 85.34% of the state's 21,081 sq km (Table 13.1).\n• ISFR 2021 comparison: 17,820.03 sq km = 84.53% — so total cover rose only slightly.\n• But the internal composition shifted sharply: moderately dense forest 5,715.24 → 8,635.76 sq km, while open forest fell 11,948.00 → 9,093.18 sq km.\n• Very dense forest is small in absolute terms: just 261.52 sq km, about 1.2% of the state.\n• District extremes: Siaha highest at 90.76%, Khawzawl lowest at 75.64% (Table 13.2). Hnahthial has NIL very dense forest.\n\nTHE PRESSURE:\n• Forest offence cases 2023-24: 1,842, involving 1,579 persons; money realised Rs. 2,31,50,906 (Table 13.9).\n• Wildlife offence cases 2023-24: 28 cases, 50 persons, Rs. 58,100 realised (Table 13.8).\n• Notably, ZERO forest offence cases were filed in court — all disposal was by compounding.\n• Current jhum area: 18.10 thousand ha in 2022-23 (Table 8.3).\n\nRESOLVING THE PARADOX:\n• High percentage cover coexists with low forest QUALITY — the very dense category is tiny.\n• Recorded Forest Area is only 9,891.29 sq km (46.92%), so more than half the forest cover lies outside formal legal protection, much of it community or District Council land (Table 13.3).\n• Jhum cultivation, a livelihood necessity, structurally converts dense forest to open forest.\n• Compounding rather than prosecution suggests enforcement calibrated to subsistence offences rather than organised crime.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "descriptive",
      "mains",
      "essay",
      "forest",
      "environment",
      "jhum",
      "siaha"
    ]
  },
  {
    id: "mzshb24-descriptive-stats-003",
    type: "descriptive",
    subject: "gk",
    topic: "descriptive_stats",
    topicLabel: "Descriptive & Essay — Data-Backed Answers",
    difficulty: "hard",
    question: "Discuss Mizoram's demographic profile as revealed by Census 2011, highlighting the features that distinguish it from the all-India pattern.",
    guidance: "Move from state aggregates to inter-district disparity — that progression is what separates a descriptive answer from an analytical one. The Lawngtlai/Siaha growth contrast is the single most striking data point available.",
    wordLimit: 250,
    explanation: "MODEL FRAMEWORK:\n\nWHERE MIZORAM LEADS INDIA:\n• Literacy 91.33% (state tables) / 91.58% (Table 47.3) against all-India 74.04% — second among States, after Kerala.\n• Female literacy 89.40% against all-India 65.46% — one of the narrowest gender gaps in the country.\n• Sex ratio 976 against all-India 940.\n• Urbanisation: urban population 5,71,771 EXCEEDS rural 5,25,435 — about 52% urban, exceptional for a hill state.\n\nWHERE MIZORAM IS DISTINCTIVE, NOT BETTER:\n• Density just 52 per sq km against 382 all-India — second lowest among States after Arunachal Pradesh (17).\n• Total population 10,97,206 — second smallest State after Sikkim.\n• Work participation 44.36% (4,86,705 workers).\n\nINTERNAL DISPARITIES — the real analytical content:\n• Aizawl district alone holds 4,00,309 of 10,97,206 persons (over a third), at density 112 against Mamit's 29.\n• Aizawl is the ONLY district with a sex ratio above 1000 (1,009); Mamit is lowest at 927.\n• Lawngtlai grew 60.14% in 2001-11 while Siaha SHRANK by 7.34% — an extraordinary 67-point spread.\n\nTREND CONTEXT (Table 1.1):\n• Growth has decelerated: 48.55% (1971-81) → 39.70% → 28.82% → 23.48% (2001-11).\n• Females outnumbered males in every Census from 1901 to 1961; males have led since 1971.\n\nCAUTION: Census 2011 predates the 2019 creation of Saitual, Khawzawl and Hnahthial, so district data is on an 8-district basis.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "descriptive",
      "mains",
      "essay",
      "demography",
      "census-2011",
      "lawngtlai",
      "siaha"
    ]
  },
  {
    id: "mzshb24-descriptive-stats-004",
    type: "descriptive",
    subject: "gk",
    topic: "descriptive_stats",
    topicLabel: "Descriptive & Essay — Data-Backed Answers",
    difficulty: "hard",
    question: "Assess the state of Mizoram's power sector using the Statistical Handbook 2024, and identify the principal challenges.",
    guidance: "The trap here is to write a purely positive answer from the import-collapse figure. A strong answer sets that against rising AT&C losses (19.86% → 37.00%) and the tiny industrial load.",
    wordLimit: 250,
    explanation: "MODEL FRAMEWORK:\n\nTHE POSITIVE STORY:\n• Installed capacity doubled: 31.70 MW (2021-22) → 62.70 MW (2022-23 and 2023-24), driven by solar rising from 2.35 MW to 23.85 MW and hydro from 29.35 MW to 38.35 MW (Table 20.1).\n• Own generation rose from 28.12 MU to 85.28 MU.\n• Net import collapsed from 647.61 MU (2021-22) to 0.41 MU (2023-24) — a dramatic move toward self-sufficiency.\n• Import expenditure fell from Rs. 60,538.86 lakh to Rs. 41,400.00 lakh (Table 20.2).\n• Village electrification: 717 of 730 inhabited villages, 98.19% (Table 20.3).\n• Mizoram has ZERO thermal capacity — an unusually clean generation mix.\n\nTHE CHALLENGES:\n• Capacity 62.70 MW against peak demand 159.12 MW — a large structural gap, covered by the allocated central share of 222.51 MW.\n• Estimated potential is 3,500 MW; less than 2% is developed.\n• Transmission & distribution losses ROSE from 24.00% to 27.90%.\n• AT&C losses rose steeply from 19.86% to 37.00% — the single most worrying indicator.\n• Per capita consumption FELL from 439.42 kWh to 411.74 kWh (Table 20.4).\n• Consumption is overwhelmingly domestic (306.16 of 515.49 MU); industrial demand is just 16.03 MU and agricultural 0.27 MU — a sign of a weak productive base.\n\nCONCLUSION: generation self-sufficiency has improved markedly, but distribution efficiency has deteriorated and demand remains consumption-led rather than production-led.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "descriptive",
      "mains",
      "essay",
      "power",
      "infrastructure",
      "energy",
      "mizo-hills"
    ]
  },
  {
    id: "mzshb24-descriptive-stats-005",
    type: "descriptive",
    subject: "gk",
    topic: "descriptive_stats",
    topicLabel: "Descriptive & Essay — Data-Backed Answers",
    difficulty: "hard",
    question: "Using NFHS-5 (2019-21) data from the Statistical Handbook, evaluate Mizoram's health and nutrition status, noting both achievements and areas of concern.",
    guidance: "Resist a uniformly positive or uniformly negative framing. The data supports a specific thesis: strong on access and fertility transition, weak on rural maternal-care continuity and behavioural risk.",
    wordLimit: 250,
    explanation: "MODEL FRAMEWORK (all figures Table 23.10, urban/rural/total):\n\nACHIEVEMENTS:\n• TFR 1.9 (urban 1.6, rural 2.2) — below the replacement level of 2.1.\n• Improved drinking water 95.5%; improved sanitation 95.2%.\n• Full immunization of children 12-23 months 83.7% — and notably RURAL (85.1%) exceeds URBAN (82.2%), an inversion of the usual pattern.\n• IMR fell sharply from 13.25 (2023) to 8.75 (2024) per 1000 as per CRS (Table 23.15).\n\nAREAS OF CONCERN:\n• TOBACCO is the standout problem: 62.6% of women and 73.5% of men use some form of tobacco — among the highest in India.\n• Child nutrition: 28.7% of under-fives stunted; 46.2% of children aged 6-59 months anaemic.\n• Institutional births only 85.7%, and the rural figure is just 72.5% against 98.8% urban — the widest urban-rural gap of any indicator.\n• Full antenatal care only 57.7% (urban 70.3%, rural 45.0%); first-trimester ANC 72.5%.\n\nTHE ANALYTICAL POINT:\n• Mizoram's weakness is not access to facilities but rural continuity of maternal care and behavioural risk factors.\n• Alcohol use is low (women 0.9%, men 24.0%) while tobacco use is very high — so a single 'substance use' framing would be wrong.\n• Health infrastructure expanded in 2023-24: CHCs 9 → 16, Health Sub Centres 372 → 408, though PHCs fell 61 → 54 (Table 23.1).",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "descriptive",
      "mains",
      "essay",
      "health",
      "nfhs-5",
      "nutrition"
    ]
  },
  {
    id: "mzshb24-descriptive-stats-006",
    type: "descriptive",
    subject: "gk",
    topic: "descriptive_stats",
    topicLabel: "Descriptive & Essay — Data-Backed Answers",
    difficulty: "medium",
    question: "Write short notes on any THREE of the following, using figures from the Statistical Handbook of Mizoram 2024.",
    subparts: [
      {
        label: "a",
        text: "Mizoram's international boundaries",
        marks: 5,
        modelAnswer: "Mizoram shares 510 km with Myanmar and 318 km with Bangladesh — a total international boundary of 828 km, against an inter-State boundary of only 284 km (Assam 123, Manipur 95, Tripura 66). More of Mizoram's perimeter is international than domestic, which shapes its security, trade and border-management concerns. The state lies between 92°15'-93°29' E and 21°58'-24°35' N, measuring 277 km north-south and 121 km east-west (Mizoram at a Glance, SN 3-6)."
      },
      {
        label: "b",
        text: "Chapchar Kut and the festival calendar of Mizoram",
        marks: 5,
        modelAnswer: "Chapchar Kut, Mizoram's best known festival, falls on the first Friday of March. It is a spring festival marking the completion of jhum clearing — linking the festival calendar directly to the agricultural cycle. Other festivals listed are Pawl Kut (during January, a harvest festival), the Winter Festival (second week of December), Christmas (25 December), and Lyuva Khutla and Hlukhla (both first week of March). The December cluster shows in the tourism data: December 2024 was the peak month with 60,112 arrivals (State Information SN 13; Table 17.2)."
      },
      {
        label: "c",
        text: "Village Councils in Mizoram",
        marks: 5,
        modelAnswer: "Mizoram has 830 Village Councils with 4,021 members in all — 3,122 general seats and 899 reserved for women, about 22% (2025 general election, Table 40.1). Among districts Mamit has the most Village Councils (92) and Hnahthial the fewest (32). The three Autonomous District Councils are counted separately: Mara and Lai have 99 Village Councils each and Chakma 88. Village Councils are the grassroots tier of Mizoram's local administration, distinct from the Sixth Schedule ADC structure."
      },
      {
        label: "d",
        text: "Tourism in Mizoram",
        marks: 5,
        modelAnswer: "In 2023-24 Mizoram received 2,15,230 domestic tourists (down from 2,18,457) and 3,884 foreign tourists (up from 3,551), earning Rs. 374.37 lakh from tourist facilities against Rs. 297.68 lakh the previous year — revenue rose even as domestic arrivals fell. The state had 68 tourist lodges with 625 rooms. In calendar 2024 total arrivals were 5,22,629. Tourism is strongly seasonal: December peaked at 60,112 arrivals and August troughed at 29,808, reflecting the monsoon (Tables 17.1 and 17.2)."
      },
      {
        label: "e",
        text: "Jhum versus Wet Rice Cultivation",
        marks: 5,
        modelAnswer: "In 2023-24 jhum rice covered 14,684 ha yielding 17,916 MT at 1,220 kg/ha, while wet rice cultivation (WRC) covered 9,931 ha yielding 22,008 MT at 2,216 kg/ha — WRC is roughly 1.8 times as productive per hectare despite occupying less land (Table 8.1). Current jhum area stood at 18.10 thousand ha in 2022-23, down from 18.89 thousand (Table 8.3). The productivity gap is the core rationale for Mizoram's policy of promoting WRC, though jhum remains embedded in livelihoods and land-tenure practice."
      }
    ],
    guidance: "Attempt any three. Each note should be about 100 words and must contain at least two exact figures with the source table named.",
    explanation: "Each sub-part should carry concrete figures — an examiner rewards a candidate who quotes the number, names the source table, and adds one line of interpretation.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "descriptive",
      "mains",
      "essay",
      "short-notes"
    ]
  },
  {
    id: "mzshb24-descriptive-stats-007",
    type: "descriptive",
    subject: "gk",
    topic: "descriptive_stats",
    topicLabel: "Descriptive & Essay — Data-Backed Answers",
    difficulty: "hard",
    question: "'Mizoram's statistical profile is one of high human development on a small demographic and economic base.' Critically examine this statement.",
    guidance: "This is an essay-length synthesis question. Marshal data from at least five different chapters, and make sure the 'critically examine' instruction is honoured by identifying at least three counter-currents to the headline claim.",
    wordLimit: 400,
    explanation: "MODEL FRAMEWORK — an essay-style question requiring synthesis across chapters.\n\nEVIDENCE FOR 'HIGH HUMAN DEVELOPMENT':\n• Literacy 91.33%/91.58% — second among States after Kerala; female literacy 89.40% vs all-India 65.46%.\n• Sex ratio 976 vs all-India 940.\n• TFR 1.9, below replacement (NFHS-5).\n• IMR down to 8.75 per 1000 in 2024 (CRS).\n• Improved water 95.5%, sanitation 95.2%.\n• Village electrification 98.19%.\n• Forest cover 85.34% — among the highest in India.\n\nEVIDENCE FOR 'SMALL BASE':\n• Population 10,97,206 — second smallest State; density 52 vs 382 all-India.\n• GSDP Rs. 33,276.73 crore (2023-24 P) — a very small absolute economy.\n• Installed power capacity 62.70 MW; industrial electricity consumption just 16.03 MU of 515.49 MU total.\n• Total road length 7,708 km; only 2 airlines operating.\n\nTHE CRITICAL EDGE — where the statement needs qualification:\n• Human development is unevenly distributed: Lawngtlai grew 60.14% while Siaha shrank 7.34%; Khawzawl's forest cover (75.64%) trails Siaha's (90.76%); Hnahthial has the highest suicide rate (12.4 per lakh).\n• Some indicators are deteriorating: AT&C losses 19.86% → 37.00%; per capita electricity consumption fell; rainfall has run below the 2,090.33 mm normal for several years (1,473.10 mm in 2023, 1,547.80 mm in 2024).\n• Behavioural health is a genuine weakness: tobacco use 62.6% of women and 73.5% of men.\n• The economy is consumption- and government-led: domestic users take 306.16 of 515.49 MU of electricity; agriculture's GSDP share has fallen to 19.61% without a corresponding industrial employment base.\n\nCONCLUSION: the statement is broadly accurate on aggregates but conceals sharp inter-district disparity and several adverse trends.",
    source: "Statistical Handbook Mizoram 2024",
    answerSource: "derived",
    tags: [
      "descriptive",
      "mains",
      "essay",
      "human-development",
      "synthesis",
      "lawngtlai",
      "siaha"
    ]
  }
];

export const mizoramStatHandbook2024: QuestionBank = {
  id: 'mizoram-stat-handbook-2024',
  title: 'Mizoram Statistical Handbook 2024',
  description:
    'Data-driven MPSC/UPSC prep mined from the Statistical Handbook Mizoram 2024 ' +
    '(Directorate of Economics & Statistics) — 169 MCQs and 7 descriptive/essay ' +
    'prompts covering geography, demography, the state economy, forests, agriculture, ' +
    'health and NFHS-5, education, infrastructure, polity and all-India comparisons.',
  questions: mizoramStatHandbook2024Questions,
};
