from qlib import Q, q

T, L = "forest_env", "Forest, Environment & Wildlife"
G = ["mizoram", "forest", "environment"]
W = "Note the two ISFR vintages carried in the Handbook: the At-a-Glance section quotes ISFR 2021 (17,820.03 sq km, 84.53%), while Chapter 13 carries both ISFR 2021 and ISFR 2023 (17,990.46 sq km, 85.34%). Always check which report a question refers to. "

q(T, L, "easy",
  "As per India State of Forest Report (ISFR) 2023, the total forest cover of Mizoram is:",
  ["17,990.46 sq km", "17,820.03 sq km", "18,434.46 sq km", "9,891.29 sq km"], 0,
  "ISFR 2023 puts Mizoram's forest cover at 17,990.46 sq km (Table 13.1). 17,820.03 sq km was the ISFR 2021 figure; 18,434.46 sq km is forest AND tree cover combined under ISFR 2023.",
  G + ["isfr", "forest-cover"])

q(T, L, "easy",
  "As per ISFR 2023, forest cover as a percentage of Mizoram's geographical area is:",
  ["85.34%", "84.53%", "46.92%", "90.76%"], 0,
  W + "ISFR 2023 gives 85.34% (Table 13.1). 84.53% is the ISFR 2021 figure quoted in the At-a-Glance section; 46.92% is the Recorded Forest Area share; 90.76% is Siaha district's forest cover.",
  G + ["isfr", "forest-cover"],
  source_note="Not a printing error but two different, correctly-dated figures in the same Handbook: 'Mizoram at a Glance' (front matter) quotes ISFR 2021 (84.53%), while Chapter 13's own Table 13.1 carries both ISFR 2021 and the newer ISFR 2023 (85.34%). Always check which report a question means.")

q(T, L, "medium",
  "As per ISFR 2021 — the figure quoted in the Handbook's 'State Information' section — Mizoram's forest area was:",
  ["17,820 sq km, or 84.53% of the geographical area", "17,990 sq km, or 85.34% of the geographical area",
   "9,891 sq km, or 46.92% of the geographical area", "15,850 sq km, or 75.18% of the geographical area"], 0,
  W + "State Information SN 12 quotes ISFR 2021: 17,820 sq km, 84.53% of the state's geographical area.",
  G + ["isfr", "forest-cover"])

q(T, L, "hard",
  "Between ISFR 2021 and ISFR 2023, the most striking change in Mizoram's forest cover was:",
  ["A large rise in moderately dense forest and a corresponding fall in open forest",
   "A large fall in total forest cover", "A sharp fall in very dense forest",
   "No change in any category"], 0,
  "Moderately dense forest rose from 5,715.24 to 8,635.76 sq km while open forest fell from 11,948.00 to 9,093.18 sq km (Table 13.1) — largely a reclassification of open forest into denser classes. Very dense forest also rose, from 156.79 to 261.52 sq km, and total cover rose only modestly, from 17,820.03 to 17,990.46 sq km.",
  G + ["isfr", "forest-cover"])

q(T, L, "hard",
  "As per ISFR 2023, which district of Mizoram has the HIGHEST percentage of forest cover to its geographical area?",
  ["Siaha (90.76%)", "Mamit (89.30%)", "Lunglei (88.42%)", "Hnahthial (86.37%)"], 0,
  "Siaha leads at 90.76%, followed by Mamit (89.30%) and Lunglei (88.42%) — Table 13.2. Khawzawl is lowest at 75.64%.",
  G + ["isfr", "districts", "siaha"])

q(T, L, "hard",
  "As per ISFR 2023, which district of Mizoram has the LOWEST percentage of forest cover?",
  ["Khawzawl (75.64%)", "Lawngtlai (80.09%)", "Saitual (82.35%)", "Champhai (83.17%)"], 0,
  "Khawzawl has the lowest forest-cover percentage at 75.64%, with Lawngtlai next at 80.09% (Table 13.2). Every district nonetheless exceeds 75%.",
  G + ["isfr", "districts", "khawzawl"])

q(T, L, "hard",
  "As per ISFR 2023, which district has the largest forest cover by AREA?",
  ["Lunglei (3,258.43 sq km)", "Mamit (2,722.05 sq km)", "Aizawl (1,899.89 sq km)", "Siaha (1,388.10 sq km)"], 0,
  "Lunglei has the largest forest area at 3,258.43 sq km — it is also the largest district by geographical area (Table 13.2). Hnahthial has the smallest forest area, 735.46 sq km. Note the distinction from Siaha, which leads on PERCENTAGE but not area.",
  G + ["isfr", "districts", "lunglei"])

q(T, L, "hard",
  "As per ISFR 2023, which district of Mizoram records NIL very dense forest?",
  ["Hnahthial", "Siaha", "Kolasib", "Khawzawl"], 0,
  "Hnahthial records 0.00 sq km of very dense forest (Table 13.2). Siaha (0.49 sq km) and Kolasib (1.32 sq km) have the next lowest — notably Siaha has the highest overall forest-cover percentage yet almost no very dense forest.",
  G + ["isfr", "districts"])

q(T, L, "hard",
  "The Recorded Forest Area (RFA) of Mizoram, as a percentage of the state's geographical area, is:",
  ["46.92%", "85.34%", "84.53%", "62.50%"], 0,
  "Recorded Forest Area is 9,891.29 sq km, or 46.92% of the state's area (Table 13.3). This is a legal/administrative category and is quite distinct from satellite-assessed forest COVER of 85.34% — a classic distractor pair.",
  G + ["recorded-forest-area"])

q(T, L, "hard",
  "Among the categories of Recorded Forest Area in Mizoram, the largest is:",
  ["Reserved Forests (4,498.54 sq km)", "District Council Forests (2,562.00 sq km)",
   "Protected Forests (1,997.75 sq km)", "Unclassed Forests (833.00 sq km)"], 0,
  "Reserved Forests account for 4,498.54 sq km of the 9,891.29 sq km Recorded Forest Area, followed by District Council Forests (2,562.00), Protected Forests (1,997.75) and Unclassed Forests (833.00) — Table 13.3.",
  G + ["recorded-forest-area"])

q(T, L, "medium",
  "How many National Parks are there in Mizoram?",
  ["2 — Murlen and Phawngpui", "1 — only Murlen", "3 — Murlen, Phawngpui and Dampa", "4"], 0,
  "Mizoram has two National Parks: Murlen (100 sq km) and Phawngpui or Blue Mountain (50 sq km) — State Information SN 9. Dampa, though listed under the National Park heading in Table 13.6, is a Tiger Reserve, not a National Park.",
  G + ["national-parks", "protected-areas"],
  source_note="Table 13.6 itself mis-files Dampa Tiger Reserve under its 'B. National Park' heading. State Information SN 9 correctly names only Murlen and Phawngpui as National Parks — that count is used here, not Table 13.6's heading.")

q(T, L, "hard",
  "Dampa Tiger Reserve, Mizoram's largest protected area, covers an area of:",
  ["500 sq km", "110 sq km", "100 sq km", "50 sq km"], 0,
  "Dampa Tiger Reserve covers 500 sq km and was finally notified on 07.12.1994 — both the largest and the earliest-notified protected area in Table 13.6. It lies in Mamit district.",
  G + ["protected-areas", "dampa", "mamit"])

q(T, L, "hard",
  "Which is the largest Wildlife Sanctuary in Mizoram by area?",
  ["Ngengpui (110 sq km)", "Lengteng (60 sq km)", "Thorangtlang (50 sq km)", "Khawnglung (35.75 sq km)"], 0,
  "Ngengpui Wildlife Sanctuary, at 110 sq km, is the largest of the six wildlife sanctuaries listed in Table 13.6. Tawi, at 35 sq km, is the smallest.",
  G + ["protected-areas", "wildlife-sanctuary"])

q(T, L, "hard",
  "Murlen National Park, Mizoram, was finally notified in which year?",
  ["2003", "1997", "1994", "2002"], 0,
  "Murlen National Park (100 sq km) was finally notified on 24.01.2003. Phawngpui National Park (50 sq km) was notified earlier, on 22.07.1997 (Table 13.6).",
  G + ["protected-areas", "national-parks"])

q(T, L, "hard",
  "Which of these Mizoram protected areas was notified EARLIEST?",
  ["Dampa Tiger Reserve (1994)", "Ngengpui Wildlife Sanctuary (1997)",
   "Murlen National Park (2003)", "Pualreng Wildlife Sanctuary (2004)"], 0,
  "Dampa Tiger Reserve was finally notified on 07.12.1994, the earliest in Table 13.6. Pualreng (29.07.2004) is the latest.",
  G + ["protected-areas"])

q(T, L, "medium",
  "Which of the following is listed among Mizoram's important wildlife in the Statistical Handbook?",
  ["Hoolock Gibbon", "Asiatic Lion", "One-horned Rhinoceros", "Snow Leopard"], 0,
  "The Handbook lists Serow, Hoolock Gibbon, Binturong, Indian Bison and Clouded Leopard among Mizoram's important animals (State Information, SN 11). Important birds include Hume's Pheasant and the Great Indian Hornbill.",
  G + ["wildlife"])
