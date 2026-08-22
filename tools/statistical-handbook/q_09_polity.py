from qlib import Q, q

# ---------------- ELECTION ----------------
T, L = "polity_admin", "Election, MPSC & Local Administration"
G = ["mizoram", "polity", "administration"]

q(T, L, "easy",
  "The Mizoram Legislative Assembly has how many seats?",
  ["40", "60", "32", "45"], 0,
  "The Mizoram Legislative Assembly has 40 seats (Table 31.1). Elections to the Assembly were last held in 2023.",
  G + ["assembly", "election"])

q(T, L, "hard",
  "The total electorate in the 2023 general election to the Mizoram Legislative Assembly was:",
  ["8,57,063 (including service voters)", "7,05,057", "6,99,867", "4,39,026"], 0,
  "The electorate numbered 8,57,063 including service voters, of whom 4,39,026 were women (Table 31.1). Total votes polled including NOTA were 7,05,057.",
  G + ["election-2023"],
  source_note="The Handbook's own Table of Contents lists this table as the '2018' Assembly election, but the table itself is headed and dated 2023 and its figures (40 seats, 8,57,063 electors) match the actual 2023 contest, not 2018. Treated here as 2023, per the table's own heading.")

q(T, L, "hard",
  "The voter turnout in the 2023 Mizoram Legislative Assembly election was:",
  ["82.26%", "78.26%", "85.26%", "80.11%"], 0,
  "Turnout was 82.26% — 7,05,057 votes polled (including NOTA) from an electorate of 8,57,063 (Table 31.1).",
  G + ["election-2023", "turnout"])

q(T, L, "hard",
  "In the 2023 Mizoram Legislative Assembly election, the number of votes polled in favour of NOTA was:",
  ["2,779", "2,411", "1,276", "5,190"], 0,
  "NOTA received 2,779 votes, while a further 2,411 votes were rejected (Table 31.1). Valid votes excluding NOTA totalled 6,99,867.",
  G + ["election-2023", "nota"])

q(T, L, "hard",
  "In the 2023 Mizoram Legislative Assembly election, the number of candidates and of women candidates was:",
  ["174 candidates, of whom 18 were women", "174 candidates, of whom 40 were women",
   "140 candidates, of whom 18 were women", "216 candidates, of whom 18 were women"], 0,
  "There were 174 candidates in all, of whom 18 were women (Table 31.1), contesting across 1,276 polling stations.",
  G + ["election-2023"])

# ---------------- MPSC ----------------
q(T, L, "medium",
  "In 2023-24, the total number of vacant posts advertised by the Mizoram Public Service Commission (MPSC) was:",
  ["133", "114", "83", "20"], 0,
  "MPSC advertised 133 vacant posts in 2023-24 — 114 Group A, 16 Group B Gazetted, 3 Group B and none in Group C (Table 32.1).",
  G + ["mpsc", "recruitment"])

q(T, L, "hard",
  "Of the 133 posts advertised by MPSC in 2023-24, how many were Group A posts?",
  ["114", "16", "83", "17"], 0,
  "Group A accounted for 114 of the 133 posts advertised, with 16 Group B Gazetted and 3 Group B (Table 32.1).",
  G + ["mpsc", "recruitment"])

q(T, L, "hard",
  "In 2023-24, MPSC recommended 83 persons for appointment. These were drawn entirely from which category?",
  ["Group B Gazetted", "Group A", "Group C", "Group B (non-gazetted)"], 0,
  "All 83 persons recommended in 2023-24 were for Group B Gazetted posts; recommendations for Group A and Group B (non-gazetted) were nil that year (Table 32.1).",
  G + ["mpsc", "recruitment", "group-b-gazetted"])

q(T, L, "hard",
  "The number of direct recruitment examinations conducted by MPSC in 2023-24 was:",
  ["20", "133", "83", "17"], 0,
  "MPSC conducted 20 direct recruitment examinations in 2023-24 — 17 for Group A and 3 for Group B Gazetted posts (Table 32.1).",
  G + ["mpsc", "recruitment"])

# ---------------- LOCAL ADMINISTRATION ----------------
q(T, L, "medium",
  "The total number of Village Councils in Mizoram, as per the 2025 general election, was:",
  ["830", "704", "4,021", "3,122"], 0,
  "Mizoram has 830 Village Councils (Table 40.1), with 4,021 Village Council members in all — 3,122 general seats and 899 reserved for women.",
  G + ["village-council", "local-government"])

q(T, L, "hard",
  "In the 2025 Village Council election in Mizoram, the number of seats reserved for women was:",
  ["899", "3,122", "4,021", "830"], 0,
  "899 of the 4,021 Village Council seats were reserved for women, alongside 3,122 general seats (Table 40.1) — roughly 22% reservation.",
  G + ["village-council", "women-reservation"])

q(T, L, "hard",
  "Which district has the largest number of Village Councils in Mizoram (2025 election)?",
  ["Mamit (92)", "Lunglei (88)", "Aizawl (70)", "Champhai (62)"], 0,
  "Among the districts, Mamit has the most Village Councils at 92, followed by Lunglei (88) and Aizawl (70) — Table 40.1. Hnahthial has the fewest at 32. Note that the Mara and Lai Autonomous District Councils each have 99 and the Chakma ADC 88, counted separately from the districts.",
  G + ["village-council", "mamit"])

q(T, L, "hard",
  "In the 2025 Village Council election table, which Autonomous District Councils each account for 99 Village Councils?",
  ["Mara (MADC) and Lai (LADC)", "Lai (LADC) and Chakma (CADC)",
   "Mara (MADC) and Chakma (CADC)", "All three ADCs have 99 each"], 0,
  "The Mara (MADC) and Lai (LADC) Autonomous District Councils have 99 Village Councils each, while the Chakma (CADC) has 88 (Table 40.1).",
  G + ["village-council", "adc"])

# ---------------- POLICE / CRIME ----------------
T, L = "crime_police", "Police, Crime & Public Order"
G = ["mizoram", "crime", "police"]

q(T, L, "medium",
  "The total number of police stations in Mizoram in 2024 was:",
  ["44", "93", "14", "15"], 0,
  "Mizoram had 44 police stations in 2024, unchanged from 2023, along with 14 out-posts, 15 check-posts and 93 wireless stations (Table 27.1). The figure of 44 includes 3 CID (Crime) police stations.",
  G + ["police-stations"])

q(T, L, "hard",
  "Which district of Mizoram has the largest number of police stations?",
  ["Aizawl (9)", "Mamit and Lawngtlai (5 each)", "Kolasib and Lunglei (4 each)", "Champhai (3)"], 0,
  "Aizawl has 9 police stations, the most of any district (Table 27.1). Mamit and Lawngtlai have 5 each; Khawzawl has just 1.",
  G + ["police-stations", "aizawl"])

q(T, L, "hard",
  "The total number of suicides recorded in Mizoram in 2024, and the suicide rate per lakh population, were:",
  ["96 suicides, rate 6.7", "81 suicides, rate 5.7", "96 suicides, rate 11.5", "82 suicides, rate 6.7"], 0,
  "Mizoram recorded 96 suicides in 2024 (82 male, 14 female), a rate of 6.7 per lakh population — up from 81 suicides and a rate of 5.7 in 2023 (Table 27.6). The male rate (11.5) is about six times the female rate (1.9).",
  G + ["suicide"])

q(T, L, "hard",
  "In 2024, which district of Mizoram recorded the highest suicide RATE per lakh population?",
  ["Hnahthial (12.4)", "Kolasib (11.3)", "Aizawl (9.0)", "Siaha (8.4)"], 0,
  "Hnahthial recorded the highest rate at 12.4 per lakh, ahead of Kolasib (11.3) and Aizawl (9.0) — Table 27.6. Aizawl had the highest absolute number (44) but a lower rate because of its much larger population — a good illustration of why rate and count differ.",
  G + ["suicide", "hnahthial"])
