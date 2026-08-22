from qlib import Q, q

# ---------------- HEALTH ----------------
T, L = "health", "Health, NFHS-5 & Vital Statistics"
G = ["mizoram", "health"]
N = "From Table 23.10, Key Indicators of NFHS-5 (2019-21), Mizoram. "

q(T, L, "medium",
  "As per NFHS-5 (2019-21), the Total Fertility Rate (TFR) of Mizoram is:",
  ["1.9 children per woman", "2.2 children per woman", "1.6 children per woman", "2.4 children per woman"], 0,
  N + "Mizoram's TFR is 1.9 — urban 1.6 and rural 2.2. This is below the replacement level of 2.1.",
  G + ["nfhs-5", "tfr"])

q(T, L, "medium",
  "As per NFHS-5 (2019-21), the percentage of institutional births in Mizoram is:",
  ["85.7%", "95.5%", "72.5%", "83.7%"], 0,
  N + "Institutional births stand at 85.7% overall, but with a wide gap — 98.8% in urban areas against just 72.5% in rural areas, the largest urban-rural divide among the NFHS-5 indicators for Mizoram.",
  G + ["nfhs-5", "institutional-births"])

q(T, L, "hard",
  "As per NFHS-5 (2019-21), what percentage of children aged 12–23 months in Mizoram are fully immunized?",
  ["83.7%", "85.7%", "95.2%", "72.5%"], 0,
  N + "83.7% of children aged 12–23 months are fully immunized (BCG, measles and three doses each of polio and DPT). Unusually, rural coverage (85.1%) is HIGHER than urban (82.2%) — an inversion worth noting.",
  G + ["nfhs-5", "immunization"])

q(T, L, "hard",
  "Which NFHS-5 (2019-21) indicator for Mizoram shows rural performance BETTER than urban?",
  ["Children aged 12–23 months fully immunized", "Institutional births",
   "Mothers with antenatal check-up in the first trimester", "Households using improved sanitation"], 0,
  N + "Full immunization is 85.1% rural against 82.2% urban — the one indicator where rural Mizoram outperforms urban. Institutional births (72.5% rural vs 98.8% urban), first-trimester ANC (63.9% vs 81.0%) and improved sanitation (93.2% vs 97.1%) all favour urban areas.",
  G + ["nfhs-5", "immunization"])

q(T, L, "hard",
  "As per NFHS-5 (2019-21), the percentage of children under five years in Mizoram who are stunted is:",
  ["28.7%", "46.2%", "25.5%", "31.9%"], 0,
  N + "28.7% of under-five children are stunted (urban 25.5%, rural 31.9%). Separately, 46.2% of children aged 6–59 months are anaemic.",
  G + ["nfhs-5", "nutrition", "stunting"])

q(T, L, "hard",
  "As per NFHS-5 (2019-21), the percentage of children aged 6–59 months in Mizoram who are anaemic is:",
  ["46.2%", "28.7%", "42.8%", "49.6%"], 0,
  N + "46.2% of children aged 6–59 months are anaemic — 42.8% urban and 49.6% rural.",
  G + ["nfhs-5", "nutrition", "anaemia"])

q(T, L, "hard",
  "As per NFHS-5 (2019-21), tobacco use in Mizoram stands at:",
  ["62.6% of women and 73.5% of men", "24.0% of women and 62.6% of men",
   "0.9% of women and 24.0% of men", "46.2% of women and 56.6% of men"], 0,
  N + "62.6% of women and 73.5% of men in Mizoram use some form of tobacco — among the highest rates in India. By contrast alcohol consumption is low: 0.9% of women and 24.0% of men.",
  G + ["nfhs-5", "tobacco"])

q(T, L, "hard",
  "As per NFHS-5 (2019-21), what percentage of households in Mizoram have an improved drinking-water source?",
  ["95.5%", "95.2%", "92.6%", "98.4%"], 0,
  N + "95.5% of households have an improved drinking-water source (urban 98.4%, rural 92.6%). A near-identical 95.2% use an improved sanitation facility.",
  G + ["nfhs-5", "water-sanitation"])

q(T, L, "hard",
  "As per the Civil Registration System, Mizoram's Infant Mortality Rate (IMR) in 2024 was:",
  ["8.75 per 1000", "13.25 per 1000", "20.11 per 1000", "5.96 per 1000"], 0,
  "IMR as per CRS fell sharply from 13.25 per 1000 in 2023 to 8.75 per 1000 in 2024 (Table 23.15). 20.11 is the 2024 birth rate and 5.96 the 2024 death rate.",
  G + ["imr", "crs", "vital-statistics"])

q(T, L, "hard",
  "As per the Civil Registration System, Mizoram's birth rate and death rate in 2024 were respectively:",
  ["20.11 and 5.96 per 1000", "18.89 and 6.28 per 1000",
   "22.24 and 6.92 per 1000", "17.68 and 4.87 per 1000"], 0,
  "In 2024 Mizoram's birth rate was 20.11 and death rate 5.96 per 1000 (Table 23.15). The 2023 figures were 18.89 and 6.28. Urban birth rates (22.24) exceed rural (17.68).",
  G + ["crs", "vital-statistics"])

q(T, L, "hard",
  "In 2023-24, the number of Health Sub Centres (SC) in Mizoram was:",
  ["408", "322", "372", "54"], 0,
  "There were 408 Health Sub Centres in 2023-24, up from 372 in 2022-23 (Table 23.1). 322 is the number of Health Sub Centre Clinics and 54 the number of Primary Health Centres.",
  G + ["health-infrastructure"])

q(T, L, "hard",
  "Between 2022-23 and 2023-24, the number of Community Health Centres (CHC) in Mizoram:",
  ["Rose from 9 to 16", "Fell from 16 to 9", "Remained unchanged at 9", "Rose from 9 to 10"], 0,
  "CHCs rose from 9 to 16 (Table 23.1). Over the same period Primary Health Centres fell from 61 to 54, and Health Sub Centre Clinics rose sharply from 175 to 322.",
  G + ["health-infrastructure"])

# ---------------- EDUCATION ----------------
T, L = "education", "Education"
G = ["mizoram", "education"]

q(T, L, "medium",
  "The total number of primary schools in Mizoram in 2023-24 was:",
  ["1,920", "1,477", "713", "1,922"], 0,
  "Mizoram had 1,920 primary schools in 2023-24, down marginally from 1,922 in 2022-23 (Table 24.1). Middle schools numbered 1,477, high schools 713 and higher secondary schools 206.",
  G + ["schools"])

q(T, L, "hard",
  "Between 2022-23 and 2023-24, which category of school in Mizoram saw the LARGEST decline in number?",
  ["Middle (Upper Primary) schools, from 1,552 to 1,477",
   "Primary schools, from 1,922 to 1,920",
   "High schools, from 718 to 713",
   "Higher secondary schools, from 204 to 206"], 0,
  "Middle schools fell by 75, from 1,552 to 1,477 (Table 24.1) — much the largest drop. Higher secondary schools actually rose, from 204 to 206.",
  G + ["schools"])

q(T, L, "hard",
  "Among the management types of primary schools in Mizoram in 2023-24, which accounted for the largest number?",
  ["State Government (789)", "Private unaided (653)", "Local bodies (289)", "Samagra Shiksha / SSA (189)"], 0,
  "State Government ran 789 of the 1,920 primary schools, ahead of private unaided (653), local bodies (289) and Samagra Shiksha (189) — Table 24.2. Central Government schools fell from 4 to 0.",
  G + ["schools", "management"])

q(T, L, "medium",
  "The number of universities in Mizoram, as recorded in the Statistical Handbook 2024, is:",
  ["2 (Mizoram University and ICFAI)", "1 (Mizoram University only)", "3", "4"], 0,
  "Mizoram has 2 universities — Mizoram University (MZU, a central university) and ICFAI University (Table 24.12).",
  G + ["higher-education", "universities"])

q(T, L, "hard",
  "In 2023-24, the total number of Arts/Science/Commerce colleges in Mizoram was:",
  ["29 (21 Government and 8 private)", "43 (all types of college)",
   "21 (all Government)", "30 (22 Government and 8 private)"], 0,
  "There were 29 Arts/Science/Commerce colleges — 21 Government (State) and 8 private (Table 24.12). The total of ALL colleges, including nursing, theological, law, veterinary and NIT, was 43.",
  G + ["higher-education", "colleges"])

q(T, L, "hard",
  "How many Colleges of Nursing were there in Mizoram in 2023-24?",
  ["6", "2", "1", "9"], 0,
  "Mizoram had 6 Colleges of Nursing in 2023-24 (Table 24.12) — the largest single category after Arts/Science/Commerce colleges. There were 2 theological colleges and one each of law, veterinary science, Hindi training, IASE, Pachhunga University College and NIT.",
  G + ["higher-education", "nursing"])
