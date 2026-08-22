from qlib import Q, q

T, L = "demography", "Population & Census 2011"
G = ["mizoram", "census-2011", "demography"]

q(T, L, "easy",
  "The total population of Mizoram as per Census 2011 was:",
  ["10,97,206", "10,91,014", "8,88,573", "11,97,206"], 0,
  "Census 2011 recorded Mizoram's population at 10,97,206 — 5,55,339 males and 5,41,867 females (Table 1.1 and Mizoram at a Glance, SN 9). Note that the Handbook's All-India chapter (Table 47.1) prints a slightly different figure of 10,91,014 for Mizoram; the state chapters use 10,97,206.",
  G + ["population"],
  source_note="The Handbook contradicts itself: the state chapters (Table 1.1, Mizoram at a Glance) print 10,97,206, but the All-India chapter (Table 47.1) prints 10,91,014 for the same Census. Both are answered here as 10,97,206 since that is the figure used throughout the state-specific chapters.")

q(T, L, "medium",
  "The decadal population growth rate of Mizoram during 2001–2011 was:",
  ["23.48%", "28.82%", "27.28%", "22.92%"], 0,
  "Mizoram's population grew 23.48% between 2001 and 2011, an absolute increase of 2,08,633 persons (Table 1.1). The previous decade (1991–2001) had recorded 28.82%.",
  G + ["growth-rate"])

q(T, L, "easy",
  "The population density of Mizoram as per Census 2011 is:",
  ["52 persons per sq km", "62 persons per sq km", "42 persons per sq km", "382 persons per sq km"], 0,
  "Mizoram's density is 52 persons per sq km (Table 1.2) — far below the all-India figure of 382. Only Arunachal Pradesh (17) is sparser among the States.",
  G + ["density"])

q(T, L, "easy",
  "The sex ratio of Mizoram as per Census 2011 is:",
  ["976 females per 1000 males", "940 females per 1000 males", "1,009 females per 1000 males", "975 females per 1000 males"], 0,
  "Mizoram's sex ratio is 976 females per 1000 males (Table 1.2), above the all-India figure of 940. 1,009 is Aizawl district's ratio — the only district above 1000.",
  G + ["sex-ratio"])

q(T, L, "easy",
  "The literacy rate of Mizoram as per Census 2011 is:",
  ["91.33%", "91.58%", "93.72%", "89.40%"], 0,
  "Mizoram's literacy rate is 91.33% (male 4,38,529 and female 4,09,646 literates out of 8,48,175 total). Note the All-India chapter (Table 47.3) prints 91.58% for Mizoram — quote whichever table the question cites.",
  G + ["literacy"],
  source_note="The Handbook contradicts itself: Table 1.4/1.5 (state chapter) give 91.33%, while Table 47.3 (All-India chapter) gives 91.58% for the same Census. Answered here as 91.33%, the state-chapter figure.")

q(T, L, "hard",
  "A distinctive feature of Mizoram's Census 2011 population distribution is that:",
  ["The urban population exceeds the rural population",
   "The rural population exceeds the urban population by a wide margin",
   "The population is exactly evenly split between rural and urban",
   "More than 80% of the population is rural"], 0,
  "Mizoram's urban population (5,71,771) exceeds its rural population (5,25,435) — an urbanisation level of about 52%, one of the highest among Indian states (Mizoram at a Glance, SN 9). This is a frequently tested and counter-intuitive fact about a hill state.",
  G + ["urbanisation"])

q(T, L, "medium",
  "The 0–6 age group population of Mizoram as per Census 2011 was:",
  ["1,68,531", "1,58,531", "1,78,531", "1,48,531"], 0,
  "The 0–6 population was 1,68,531 — 85,561 males and 82,970 females (Mizoram at a Glance, SN 9E), about 15.4% of the total population.",
  G + ["age-structure"])

q(T, L, "medium",
  "The total number of workers in Mizoram as per Census 2011, and their share of total population, was:",
  ["4,86,705 and 44.36%", "4,15,030 and 37.82%", "4,86,705 and 40.36%", "5,86,705 and 44.36%"], 0,
  "Total workers numbered 4,86,705 — 44.36% of the population — comprising 4,15,030 main workers and 71,675 marginal workers (Mizoram at a Glance, SN 9G).",
  G + ["workers", "employment"])

q(T, L, "medium",
  "In which decade did Mizoram record its highest ever decadal population growth rate?",
  ["1971–1981 (48.55%)", "1991–2001 (28.82%)", "1961–1971 (24.93%)", "1981–1991 (39.70%)"], 0,
  "The 1971–81 decade recorded 48.55% growth, the highest in the 1901–2011 series (Table 1.1) — a period covering the Mizo insurgency-era grouping of villages and large-scale resettlement. The lowest was 1911–21 at 7.90%.",
  G + ["growth-rate", "population-trend"])

q(T, L, "hard",
  "In which decade did Mizoram record its LOWEST decadal population growth rate between 1901 and 2011?",
  ["1911–1921 (7.90%)", "1901–1911 (10.64%)", "2001–2011 (23.48%)", "1931–1941 (22.81%)"], 0,
  "The 1911–21 decade recorded just 7.90% growth (Table 1.1), the lowest in the series — the decade of the 1918–19 influenza pandemic. 1901–11 at 10.64% was the second lowest.",
  G + ["growth-rate", "population-trend"])

q(T, L, "hard",
  "Mizoram's population first crossed the one-million mark in which Census year?",
  ["2011", "2001", "1991", "2021"], 0,
  "Mizoram's population reached 10,97,206 in 2011, crossing one million for the first time; in 2001 it stood at 8,88,573 (Table 1.1).",
  G + ["population-trend"])

q(T, L, "hard",
  "A notable feature of Mizoram's population in the Censuses from 1901 to 1961 was that:",
  ["Females outnumbered males in every one of those Censuses",
   "Males outnumbered females in every one of those Censuses",
   "The population declined in absolute terms",
   "The sex ratio was below 900 throughout"], 0,
  "From 1901 to 1961 females outnumbered males in every Census — e.g. in 1901, 43,430 females against 39,004 males (Table 1.1). Males have outnumbered females in every Census since 1971.",
  G + ["sex-ratio", "population-trend"])

# ---- District-wise (Census 2011, 8-district basis) ----
D = "Mizoram had only 8 districts at the 2011 Census; Saitual, Khawzawl and Hnahthial were created in 2019, so all Census 2011 district tables use the 8-district basis. "

q(T, L, "medium",
  "As per Census 2011, which was the most populous district of Mizoram?",
  ["Aizawl", "Lunglei", "Champhai", "Lawngtlai"], 0,
  D + "Aizawl district had 4,00,309 persons — well over twice Lunglei's 1,61,428, the second largest (Table 1.2).",
  G + ["districts"])

q(T, L, "medium",
  "As per Census 2011, which district of Mizoram had the smallest population?",
  ["Siaha", "Serchhip", "Kolasib", "Mamit"], 0,
  D + "Siaha had 56,574 persons, the smallest; Serchhip followed with 64,937 (Table 1.2).",
  G + ["districts"])

q(T, L, "medium",
  "Which is the largest district of Mizoram by geographical area?",
  ["Lunglei (4,536 sq km)", "Aizawl (3,576 sq km)", "Champhai (3,185 sq km)", "Mamit (3,025 sq km)"], 0,
  "Lunglei, at 4,536 sq km, is the largest district by area, followed by Aizawl (3,576) and Champhai (3,185). Kolasib is the smallest at 1,382 sq km (Table 1.2).",
  G + ["districts", "area"])

q(T, L, "hard",
  "Which district recorded a NEGATIVE decadal population growth rate in Mizoram during 2001–2011?",
  ["Siaha (−7.34%)", "Champhai (−1.60%)", "Serchhip (−2.05%)", "No district recorded negative growth"], 0,
  D + "Siaha was the only district to record negative growth, at −7.34% (Table 1.2). At the other extreme Lawngtlai grew 60.14%.",
  G + ["districts", "growth-rate"])

q(T, L, "hard",
  "Which district of Mizoram recorded the highest decadal growth rate (2001–2011)?",
  ["Lawngtlai (60.14%)", "Mamit (37.56%)", "Kolasib (27.28%)", "Aizawl (22.92%)"], 0,
  D + "Lawngtlai recorded 60.14% growth, by far the highest, ahead of Mamit at 37.56% (Table 1.2).",
  G + ["districts", "growth-rate"])

q(T, L, "hard",
  "Which is the only district of Mizoram with a sex ratio above 1000 (Census 2011)?",
  ["Aizawl (1,009)", "Siaha (979)", "Serchhip (977)", "Champhai (984)"], 0,
  D + "Aizawl, with 1,009 females per 1000 males, is the only district above parity (Table 1.2). Mamit has the lowest at 927.",
  G + ["districts", "sex-ratio"])

q(T, L, "hard",
  "Which district of Mizoram has the LOWEST population density (Census 2011)?",
  ["Mamit (29 per sq km)", "Lunglei (36 per sq km)", "Siaha (40 per sq km)", "Champhai (39 per sq km)"], 0,
  D + "Mamit has the lowest density at 29 persons per sq km; Aizawl has the highest at 112 (Table 1.2). Mamit also has the lowest sex ratio (927).",
  G + ["districts", "density"])

q(T, L, "hard",
  "Which district of Mizoram has BOTH the lowest population density and the lowest sex ratio as per Census 2011?",
  ["Mamit", "Lawngtlai", "Siaha", "Lunglei"], 0,
  D + "Mamit is lowest on both counts — density 29 per sq km and sex ratio 927 (Table 1.2).",
  G + ["districts"])
