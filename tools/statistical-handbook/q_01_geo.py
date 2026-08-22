from qlib import Q, q

T, L = "geo_area", "Geography, Area & Boundaries"
G = ["mizoram", "geography"]

q(T, L, "easy",
  "What is the total geographical area of Mizoram?",
  ["21,081 sq km", "22,327 sq km", "20,081 sq km", "16,579 sq km"], 0,
  "Mizoram's geographical area is 21,081 sq km (Mizoram at a Glance, SN 2). The same figure is used as the denominator in the forest-cover tables, where total forest cover of 17,990.46 sq km works out to 85.34% of 21,081 sq km.",
  G + ["area"])

q(T, L, "medium",
  "Mizoram's longitudinal extent, as given in the Statistical Handbook, is:",
  ["92°15' E to 93°29' E", "91°15' E to 92°29' E", "92°58' E to 94°35' E", "93°15' E to 94°29' E"], 0,
  "Mizoram lies between 92°15' E and 93°29' E longitude, and between 21°58' N and 24°35' N latitude (Mizoram at a Glance, SN 3).",
  G + ["coordinates"])

q(T, L, "medium",
  "Mizoram's latitudinal extent is:",
  ["21°58' N to 24°35' N", "21°15' N to 23°29' N", "22°58' N to 25°35' N", "20°58' N to 23°35' N"], 0,
  "Mizoram extends from 21°58' N to 24°35' N latitude (Mizoram at a Glance, SN 3). Note the Tropic of Cancer (23°26' N) passes through the state.",
  G + ["coordinates"])

q(T, L, "medium",
  "What are the north-to-south and east-to-west lengths of Mizoram respectively?",
  ["277 km and 121 km", "121 km and 277 km", "310 km and 180 km", "277 km and 210 km"], 0,
  "Mizoram measures 277 km from north to south and 121 km from east to west (Mizoram at a Glance, SN 4) — a markedly elongated north–south shape.",
  G + ["extent"])

q(T, L, "easy",
  "Mizoram shares its longest international border with which country?",
  ["Myanmar", "Bangladesh", "China", "Bhutan"], 0,
  "Mizoram shares a 510 km border with Myanmar and a 318 km border with Bangladesh (Mizoram at a Glance, SN 5) — a total international boundary of 828 km.",
  G + ["borders", "myanmar"])

q(T, L, "medium",
  "The length of Mizoram's international border with Bangladesh is:",
  ["318 km", "510 km", "404 km", "123 km"], 0,
  "Mizoram's border with Bangladesh runs 318 km; the Myanmar border runs 510 km (Mizoram at a Glance, SN 5).",
  G + ["borders", "bangladesh"])

q(T, L, "hard",
  "Mizoram's total international boundary length (Myanmar + Bangladesh) is:",
  ["828 km", "784 km", "892 km", "740 km"], 0,
  "510 km (Myanmar) + 318 km (Bangladesh) = 828 km. By contrast the total inter-State boundary is only 284 km (Assam 123 + Manipur 95 + Tripura 66), so Mizoram's international border is nearly three times its domestic one.",
  G + ["borders"])

q(T, L, "hard",
  "Match Mizoram's inter-State boundary lengths: Assam, Tripura and Manipur respectively.",
  ["123 km, 66 km, 95 km", "95 km, 123 km, 66 km", "66 km, 95 km, 123 km", "123 km, 95 km, 66 km"], 0,
  "Mizoram's inter-State borders are Assam 123 km, Tripura 66 km and Manipur 95 km (Mizoram at a Glance, SN 6). Assam is the longest, Tripura the shortest.",
  G + ["borders", "assam", "tripura", "manipur"])

q(T, L, "medium",
  "Which State shares the longest inter-State boundary with Mizoram?",
  ["Assam", "Manipur", "Tripura", "Nagaland"], 0,
  "Assam, at 123 km, has the longest inter-State boundary with Mizoram, ahead of Manipur (95 km) and Tripura (66 km). Nagaland does not border Mizoram.",
  G + ["borders", "assam"])

q(T, L, "easy",
  "How many districts does Mizoram have, as recorded in the Statistical Handbook 2024?",
  ["11", "8", "9", "12"], 0,
  "Mizoram has 11 districts (Mizoram at a Glance, SN 7). The three newest — Saitual, Khawzawl and Hnahthial — were created in 2019, which is why Census 2011 tables still show only 8 districts.",
  G + ["districts", "administration"])

q(T, L, "medium",
  "How many Autonomous District Councils are there in Mizoram?",
  ["3", "2", "4", "1"], 0,
  "Mizoram has 3 Autonomous District Councils (Mizoram at a Glance, SN 7): the Chakma (CADC), Lai (LADC) and Mara (MADC) Autonomous District Councils, constituted under the Sixth Schedule of the Constitution.",
  G + ["adc", "sixth-schedule", "administration"])

q(T, L, "medium",
  "The number of Sub-Divisions and R.D. Blocks in Mizoram is respectively:",
  ["23 and 27", "27 and 23", "22 and 26", "23 and 26"], 0,
  "Mizoram has 23 Sub-Divisions and 27 Rural Development Blocks (Mizoram at a Glance, SN 7 and SN 10).",
  G + ["administration"])

q(T, L, "hard",
  "As per Census 2011, the total number of villages in Mizoram was 830, of which the number of uninhabited villages was:",
  ["126", "704", "106", "146"], 0,
  "Of 830 villages, 704 were inhabited and 126 uninhabited (Mizoram at a Glance, SN 7). Note that the 2025 Village Council election table also records exactly 830 Village Councils.",
  G + ["villages", "census-2011"])

q(T, L, "medium",
  "The total number of households in Mizoram as per Census 2011 was:",
  ["222,853", "212,853", "232,853", "202,853"], 0,
  "Census 2011 recorded 222,853 households in Mizoram (Mizoram at a Glance, SN 8). Against a population of 10,97,206 this implies an average household size of about 4.9 persons.",
  G + ["households", "census-2011"])

q(T, L, "easy",
  "Aizawl, the capital of Mizoram, is located at an altitude of approximately:",
  ["1,132 metres above sea level", "1,320 metres above sea level", "932 metres above sea level", "2,157 metres above sea level"], 0,
  "Aizawl lies in the northern part of Mizoram at an altitude of 1,132 metres above sea level (State Information, SN 2). 2,157 m is the height of Phawngpui, the state's highest peak.",
  G + ["aizawl", "capital"])

q(T, L, "hard",
  "Which district of Mizoram has the largest number of R.D. Blocks (as on 2024)?",
  ["Mamit and Aizawl and Lawngtlai (4 each)", "Lunglei (5)", "Champhai (4)", "Serchhip (4)"], 0,
  "Mamit, Aizawl and Lawngtlai each have 4 R.D. Blocks — the joint highest (Mizoram at a Glance, SN 10). Khawzawl and Hnahthial have just 1 each.",
  G + ["administration", "districts"])

q(T, L, "hard",
  "Which two districts of Mizoram have only one Sub-Division and one R.D. Block each?",
  ["Khawzawl and Hnahthial", "Saitual and Khawzawl", "Siaha and Serchhip", "Champhai and Kolasib"], 0,
  "Khawzawl and Hnahthial each have 1 Sub-Division and 1 R.D. Block (Mizoram at a Glance, SN 10) — both are among the districts created in 2019. Champhai is the only other district with a single Sub-Division, but it has 2 R.D. Blocks.",
  G + ["administration", "districts"])

