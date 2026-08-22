from qlib import Q, q

T, L = "symbols_gk", "State Symbols, Peaks, Rivers & Heritage"
G = ["mizoram", "state-gk"]

q(T, L, "easy",
  "The State Animal of Mizoram is:",
  ["Saza (Serow)", "Sangha (Barking Deer)", "Vawk (Wild Boar)", "Sakei (Tiger)"], 0,
  "Mizoram's State Animal is the Saza or Serow, a goat-antelope of the Himalayan and North-East hill forests (State Information, SN 3).",
  G + ["state-symbols"])

q(T, L, "easy",
  "The State Bird of Mizoram is:",
  ["Vavu (Pheasant)", "Vahui (Hornbill)", "Savawm (Peacock)", "Chawnghnawtchhi (Sunbird)"], 0,
  "The State Bird is the Vavu, or Pheasant (State Information, SN 4). Hume's Pheasant and the Great Indian Hornbill are separately listed among Mizoram's important birds.",
  G + ["state-symbols"])

q(T, L, "medium",
  "The State Tree of Mizoram is:",
  ["Herhse (Iron Wood)", "Thingsia (Oak)", "Mau (Bamboo)", "Fartuah (Pine)"], 0,
  "Mizoram's State Tree is Herhse, the Iron Wood tree (State Information, SN 5).",
  G + ["state-symbols"])

q(T, L, "easy",
  "The State Flower of Mizoram is:",
  ["Senhri (Red Vanda)", "Senhri (Blue Vanda)", "Tlaizawng (Rhododendron)", "Zawngtah (Orchid)"], 0,
  "The State Flower is Senhri, the Red Vanda orchid (State Information, SN 6).",
  G + ["state-symbols"])

# ---- Peaks ----
q(T, L, "easy",
  "The highest mountain peak in Mizoram is:",
  ["Phawngpui (Blue Mountain)", "Lengteng", "Surtlang", "Tantlang"], 0,
  "Phawngpui, also called the Blue Mountain, is Mizoram's highest peak at 2,157 metres (7,077 feet) and lies in Lawngtlai district (Table 46.1 and State Information, SN 7). Lengteng is second at 2,141 m.",
  G + ["mountains", "phawngpui"])

q(T, L, "medium",
  "The height of Phawngpui, Mizoram's highest peak, is:",
  ["2,157 metres", "2,141 metres", "1,967 metres", "1,132 metres"], 0,
  "Phawngpui stands at 2,157 metres (7,077 feet) — Table 46.1. 2,141 m is Lengteng, the second highest; 1,132 m is the altitude of Aizawl city.",
  G + ["mountains", "phawngpui"])

q(T, L, "medium",
  "Phawngpui, the highest peak of Mizoram, is located in which district?",
  ["Lawngtlai", "Champhai", "Serchhip", "Siaha"], 0,
  "Phawngpui lies in Lawngtlai district (State Information, SN 7). Phawngpui National Park, at Sangau in Lawngtlai, protects the peak and its surroundings.",
  G + ["mountains", "phawngpui", "lawngtlai"])

q(T, L, "hard",
  "Which is the SECOND highest mountain peak in Mizoram?",
  ["Lengteng (2,141 m)", "Surtlang (1,967 m)", "Lurhtlang (1,935 m)", "Tantlang (1,929 m)"], 0,
  "Lengteng, at 2,141 metres (7,024 feet), is second only to Phawngpui's 2,157 m — a margin of just 16 metres (Table 46.1). Lengteng also gives its name to the Lengteng Wildlife Sanctuary.",
  G + ["mountains"])

q(T, L, "hard",
  "In the Statistical Handbook's list of the Ten Highest Mountains of Mizoram, which peak ranks third?",
  ["Surtlang (1,967 m)", "Lurhtlang (1,935 m)", "Tantlang (1,929 m)", "Vapartlang (1,897 m)"], 0,
  "The order is Phawngpui 2,157 m, Lengteng 2,141 m, Surtlang 1,967 m, Lurhtlang 1,935 m, Tantlang 1,929 m (Table 46.1).",
  G + ["mountains"])

q(T, L, "hard",
  "Which peak completes the list of the Ten Highest Mountains of Mizoram at rank 10?",
  ["Tawizo (1,837 m)", "Zopuitlang (1,850 m)", "Hrangturzotlang (1,854 m)", "Chalfilhtlang (1,866 m)"], 0,
  "Tawizo, at 1,837 metres (6,027 feet), is tenth in Table 46.1. The full order from 6th to 10th is Vapartlang, Chalfilhtlang, Hrangturzotlang, Zopuitlang, Tawizo.",
  G + ["mountains"])

# ---- Rivers ----
q(T, L, "easy",
  "The longest river in Mizoram is:",
  ["Tlawng", "Tiau", "Chhimtuipui", "Tuivai"], 0,
  "The Tlawng, at 185.15 km, is Mizoram's longest river (Table 46.2). It rises in Zopui Hill near Zobawk in Lunglei district at an elevation of 1,395 metres (4,577 feet).",
  G + ["rivers", "tlawng"])

q(T, L, "medium",
  "The length of the Tlawng, Mizoram's longest river, is:",
  ["185.15 km", "159.39 km", "138.46 km", "128.08 km"], 0,
  "The Tlawng measures 185.15 km (Table 46.2). The Tiau is second at 159.39 km.",
  G + ["rivers", "tlawng"])

q(T, L, "hard",
  "The Tlawng river originates from which hill?",
  ["Zopui Hill, near Zobawk in Lunglei district", "Phawngpui, in Lawngtlai district",
   "Reiek Tlang, in Mamit district", "Lengteng, in Champhai district"], 0,
  "The Tlawng originates in Zopui Hill near Zobawk in Lunglei district, at an elevation of 1,395 metres or 4,577 feet (State Information, SN 8).",
  G + ["rivers", "tlawng"])

q(T, L, "hard",
  "Which is the SECOND longest river in Mizoram?",
  ["Tiau (159.39 km)", "Chhimtuipui (138.46 km)", "Tut (138.25 km)", "Tuivai (134.61 km)"], 0,
  "The Tiau, at 159.39 km, is second longest (Table 46.2). The Tiau also forms part of the international boundary between Mizoram and Myanmar.",
  G + ["rivers"])

q(T, L, "hard",
  "The Chhimtuipui river of Mizoram is also known as:",
  ["Kolodyne", "Karnaphuli", "Barak", "Dhaleswari"], 0,
  "The Chhimtuipui (138.46 km) is also called the Kolodyne (Table 46.2). Separately, the Khawthlangtuipui (128.08 km) is known as the Karnaphuli.",
  G + ["rivers"])

q(T, L, "hard",
  "In Mizoram, the river Khawthlangtuipui is better known by which other name?",
  ["Karnaphuli", "Kolodyne", "Kaladan", "Gomti"], 0,
  "The Khawthlangtuipui, 128.08 km long, is the Karnaphuli (Table 46.2) — it flows on into Bangladesh. The Chhimtuipui is the Kolodyne.",
  G + ["rivers"])

q(T, L, "hard",
  "Arrange these Mizoram rivers in DESCENDING order of length: Tut, Tiau, Tuivai, Tuichang.",
  ["Tiau > Tut > Tuivai > Tuichang", "Tut > Tiau > Tuichang > Tuivai",
   "Tuivai > Tiau > Tut > Tuichang", "Tiau > Tuivai > Tut > Tuichang"], 0,
  "Tiau 159.39 km > Tut 138.25 km > Tuivai 134.61 km > Tuichang 120.75 km (Table 46.2).",
  G + ["rivers"])

# ---- Festivals ----
q(T, L, "easy",
  "Chapchar Kut, the best known festival of Mizoram, is celebrated on:",
  ["The first Friday of March", "The first Friday of January", "The second week of December", "25th December"], 0,
  "Chapchar Kut is celebrated on the first Friday of March (State Information, SN 13) — a spring festival marking the completion of jhum clearing.",
  G + ["festivals", "chapchar-kut", "culture"])

q(T, L, "medium",
  "Pawl Kut, one of Mizoram's important festivals, is celebrated during which month?",
  ["January", "March", "December", "October"], 0,
  "Pawl Kut is celebrated during January (State Information, SN 13). It is a harvest festival. Chapchar Kut falls on the first Friday of March.",
  G + ["festivals", "culture"])

q(T, L, "hard",
  "The Winter Festival of Mizoram is held in:",
  ["The second week of December", "The first week of March", "The last week of January", "The first week of December"], 0,
  "The Winter Festival is held in the second week of December (State Information, SN 13). Lyuva Khutla and Hlukhla are both held in the first week of March.",
  G + ["festivals", "culture"])

# ---- Heritage / tourism ----
q(T, L, "medium",
  "Kawtchhuah Ropui, the noted archaeological site of menhirs, is located in which district?",
  ["Champhai (at Vangchhia)", "Mamit (at Ailawng)", "Lunglei (at Tlabung)", "Serchhip (at Thenzawl)"], 0,
  "Kawtchhuah Ropui is at Vangchhia in Champhai district (State Information, SN 14). The Vangchhia monoliths are among Mizoram's most important archaeological remains.",
  G + ["heritage", "champhai"])

q(T, L, "hard",
  "Mizoram's oldest Post Office, oldest Police Station and oldest Hospital are all located at:",
  ["Tlabung, in Lunglei district", "Serkawn, in Lunglei district",
   "Falkawn, in Aizawl district", "Zanlawn, in Kolasib district"], 0,
  "All three — along with the oldest Bungalow — are at Tlabung in Lunglei district (State Information, SN 14). Tlabung, near the Bangladesh border, was an early administrative and trading centre.",
  G + ["heritage", "lunglei"])

q(T, L, "hard",
  "The Pioneer Missionary Bungalow, an important heritage site of Mizoram, is located at:",
  ["Serkawn, in Lunglei district", "Tlabung, in Lunglei district",
   "Mission Veng, in Aizawl district", "Theiriat, in Lunglei district"], 0,
  "The Pioneer Missionary Bungalow is at Serkawn in Lunglei district (State Information, SN 14). Serkawn was the base of the Baptist Missionary Society in south Mizoram.",
  G + ["heritage", "lunglei"])

q(T, L, "medium",
  "Vantawng Khawhthla, the well known waterfall of Mizoram, is located near:",
  ["Thenzawl, in Serchhip district", "Sangau, in Lawngtlai district",
   "Reiek, in Mamit district", "Murlen, in Champhai district"], 0,
  "Vantawng Khawhthla is at Thenzawl in Serchhip district (State Information, SN 15) — Mizoram's highest waterfall. Thenzawl also has the state's golf course and a deer park.",
  G + ["tourism", "serchhip"])

q(T, L, "medium",
  "Solomon's Temple, a prominent tourist attraction, is located at:",
  ["Chawlhhmun, in Aizawl district", "Hlimen, in Aizawl district",
   "Falkawn, in Aizawl district", "Lungverh, in Aizawl district"], 0,
  "Solomon's Temple is at Chawlhhmun in Aizawl district (State Information, SN 15). Lungverh is the site of the Zoological Garden and Hlimen of Lalsavunga Park.",
  G + ["tourism", "aizawl"])

q(T, L, "hard",
  "Tam Dil, the natural lake and tourist spot, lies in which district of Mizoram?",
  ["Saitual", "Mamit", "Kolasib", "Siaha"], 0,
  "Tam Dil is in Saitual district (State Information, SN 15). Dil Nupa is in Mamit, Serlui B Lake in Kolasib, and Pala Tipo (Palak Dil) in Siaha.",
  G + ["tourism", "saitual", "lakes"])

q(T, L, "hard",
  "Reiek Tlang, a popular tourist destination near Aizawl, falls within which district?",
  ["Mamit", "Aizawl", "Kolasib", "Serchhip"], 0,
  "Reiek Tlang is in Mamit district (State Information, SN 15), though it is a short drive from Aizawl city.",
  G + ["tourism", "mamit"])
