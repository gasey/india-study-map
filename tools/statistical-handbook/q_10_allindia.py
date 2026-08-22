from qlib import Q, q

T, L = "all_india", "All-India Comparison (Census 2011)"
G = ["india", "census-2011", "comparative"]
C = ("Chapter 47 of the Handbook reproduces Census 2011 on the units of that time — 28 States and 7 UTs "
     "(Telangana had not been formed, and J&K was still a State). ")

q(T, L, "easy",
  "The total population of India as per Census 2011 was:",
  ["1,21,01,93,422", "1,02,87,37,436", "1,32,01,93,422", "1,17,01,93,422"], 0,
  "India's Census 2011 population was 1,21,01,93,422 — 62,37,24,248 males and 58,64,69,174 females (Table 47.1), at a density of 382 persons per sq km.",
  G + ["population"])

q(T, L, "easy",
  "The sex ratio and literacy rate of India as per Census 2011 were respectively:",
  ["940 and 74.04%", "976 and 91.33%", "933 and 64.83%", "943 and 77.70%"], 0,
  "India's sex ratio was 940 females per 1000 males and literacy 74.04% — male 82.14% and female 65.46% (Table 47.3). Mizoram exceeded both, at 976 and 91.58%.",
  G + ["sex-ratio", "literacy"])

q(T, L, "medium",
  "As per Census 2011, which State recorded the highest literacy rate in India?",
  ["Kerala (93.91%)", "Mizoram (91.58%)", "Tripura (87.75%)", "Goa (87.40%)"], 0,
  "Kerala led with 93.91% literacy, followed by Mizoram at 91.58% (Table 47.3). Among Union Territories, Lakshadweep recorded 92.28%.",
  G + ["literacy", "kerala"])

q(T, L, "hard",
  "As per Census 2011, Mizoram's rank among the STATES of India on literacy rate was:",
  ["Second, after Kerala", "First", "Third, after Kerala and Tripura", "Fifth"], 0,
  "Mizoram's 91.58% literacy was second only to Kerala's 93.91% among the States (Table 47.3). If Union Territories are included, Lakshadweep (92.28%) pushes Mizoram to third overall — a distinction worth watching in the question's wording.",
  G + ["literacy", "mizoram", "ranking"])

q(T, L, "hard",
  "As per Census 2011, which State recorded the LOWEST literacy rate in India?",
  ["Bihar (63.82%)", "Arunachal Pradesh (66.95%)", "Rajasthan (67.06%)", "Jharkhand (67.63%)"], 0,
  "Bihar recorded the lowest literacy rate among States at 63.82%, followed by Arunachal Pradesh (66.95%) and Rajasthan (67.06%) — Table 47.3. Rajasthan had the lowest FEMALE literacy at 52.66%.",
  G + ["literacy", "bihar"])

q(T, L, "medium",
  "As per Census 2011, which State had the highest sex ratio in India?",
  ["Kerala (1,084)", "Tamil Nadu (995)", "Andhra Pradesh (992)", "Puducherry (1,038)"], 0,
  "Kerala had the highest sex ratio among States at 1,084 females per 1000 males (Table 47.3). Puducherry, at 1,038, was the only Union Territory above 1000.",
  G + ["sex-ratio", "kerala"])

q(T, L, "hard",
  "As per Census 2011, which State recorded the LOWEST population density in India?",
  ["Arunachal Pradesh (17 per sq km)", "Mizoram (52 per sq km)",
   "Sikkim (86 per sq km)", "Nagaland (119 per sq km)"], 0,
  "Arunachal Pradesh, at 17 persons per sq km, was the least densely populated State; Mizoram was second lowest at 52 (Tables 47.1 and 47.2).",
  G + ["density", "arunachal"])

q(T, L, "hard",
  "As per Census 2011, Mizoram's rank among the States of India on population density was:",
  ["Second lowest, after Arunachal Pradesh", "Lowest of all States",
   "Third lowest, after Arunachal Pradesh and Sikkim", "Fifth lowest"], 0,
  "With 52 persons per sq km, Mizoram was the second least densely populated State after Arunachal Pradesh (17). Sikkim followed at 86 (Tables 47.1 and 47.2).",
  G + ["density", "mizoram", "ranking"])

q(T, L, "hard",
  "As per Census 2011, which State had the highest population density in India?",
  ["Bihar (1,102 per sq km)", "West Bengal (1,029 per sq km)",
   "Uttar Pradesh (828 per sq km)", "Kerala (859 per sq km)"], 0,
  "Bihar was the densest State at 1,102 persons per sq km, ahead of West Bengal (1,029) and Kerala (859) — Tables 47.1 and 47.2. Among Union Territories, Delhi recorded 11,297 and Chandigarh 9,252.",
  G + ["density", "bihar"])

q(T, L, "hard",
  "As per Census 2011, which was the least populous State of India?",
  ["Sikkim (6,07,688)", "Mizoram (10,91,014)", "Arunachal Pradesh (13,82,611)", "Goa (14,57,723)"], 0,
  "Sikkim, with 6,07,688 persons, was the least populous State; Mizoram was second least populous at 10,91,014 as printed in Table 47.1 (Tables 47.1 and 47.2).",
  G + ["population", "sikkim", "ranking"])

q(T, L, "hard",
  "As per Census 2011, Mizoram ranked where among Indian States by total population?",
  ["Second least populous, after Sikkim", "Least populous",
   "Third least populous, after Sikkim and Goa", "Fourth least populous"], 0,
  "Mizoram was the second least populous State after Sikkim (6,07,688), ahead of Arunachal Pradesh (13,82,611) and Goa (14,57,723) — Tables 47.1 and 47.2.",
  G + ["population", "mizoram", "ranking"])

q(T, L, "hard",
  "As per Census 2011, which Union Territory recorded the lowest sex ratio in India?",
  ["Daman & Diu (618)", "Chandigarh (818)", "Dadra & Nagar Haveli (775)", "Delhi (866)"], 0,
  "Daman & Diu recorded 618 females per 1000 males, the lowest of any State or UT, followed by Dadra & Nagar Haveli (775) and Chandigarh (818) — Table 47.4. Among States, Haryana was lowest at 877.",
  G + ["sex-ratio"])

q(T, L, "hard",
  "On which of these Census 2011 indicators did Mizoram perform BELOW the all-India average?",
  ["Population density", "Literacy rate", "Sex ratio", "Female literacy rate"], 0,
  "Mizoram's density of 52 per sq km is far below the national 382 — but that reflects its hilly terrain, not a deficit. On literacy (91.58% vs 74.04%), sex ratio (975 vs 940) and female literacy (89.40% vs 65.46%) Mizoram is well above the national average (Tables 47.1–47.4).",
  G + ["mizoram", "comparative"])
