from qlib import Q, q

T, L = "economy", "State Economy, GSDP & Budget"
G = ["mizoram", "economy", "gsdp"]
P = "All GSDP/NSDP figures follow the 2011-12 base-year series; 2023-24 figures are Provisional (P). "

q(T, L, "medium",
  "Mizoram's Gross State Domestic Product (GSDP) at current prices in 2023-24 (P) was:",
  ["Rs. 33,276.73 crore", "Rs. 21,663.97 crore", "Rs. 30,184.18 crore", "Rs. 29,233.56 crore"], 0,
  P + "GSDP at current prices for 2023-24 (P) was Rs. 33,276.73 crore; at constant prices it was Rs. 21,663.97 crore (Table 3.1). Rs. 29,233.56 crore is the NSDP at current prices.",
  G)

q(T, L, "medium",
  "Mizoram's Per Capita Income (NSDP) at current prices in 2023-24 (P) was:",
  ["Rs. 2,34,996", "Rs. 1,51,676", "Rs. 2,13,665", "Rs. 1,95,365"], 0,
  P + "Per capita income at current prices was Rs. 2,34,996 in 2023-24 (P); at constant prices it was Rs. 1,51,676 (Table 3.1). Rs. 2,13,665 was the 2022-23 current-price figure.",
  G + ["per-capita-income"])

q(T, L, "hard",
  "Mizoram's Net State Domestic Product (NSDP) at current prices in 2023-24 (P) was:",
  ["Rs. 29,233.56 crore", "Rs. 33,276.73 crore", "Rs. 18,868.48 crore", "Rs. 26,344.96 crore"], 0,
  P + "NSDP at current prices was Rs. 29,233.56 crore, against a GSDP of Rs. 33,276.73 crore (Table 3.1).",
  G)

q(T, L, "hard",
  "In which year did Mizoram's GSDP at current prices CONTRACT compared with the previous year?",
  ["2020-21", "2019-20", "2022-23", "2021-22"], 0,
  "GSDP at current prices fell from Rs. 24,989.60 crore in 2019-20 to Rs. 23,922.94 crore in 2020-21 — the COVID-19 contraction and the only decline in the series (Table 3.1). Per capita income also fell, from Rs. 1,95,365 to Rs. 1,73,521.",
  G + ["covid"])

q(T, L, "medium",
  "As per the percentage sectoral share of Mizoram's GSDP in 2023-24 (P), which sector contributed the most?",
  ["Service sector (49.33%)", "Industry sector (31.06%)", "Agriculture & allied sector (19.61%)", "The three are nearly equal"], 0,
  "The service sector contributed 49.33%, industry 31.06% and agriculture & allied 19.61% in 2023-24 (P) — Table 3.4. Services have been the largest sector throughout the series.",
  G + ["sectoral-share"])

q(T, L, "hard",
  "Between 2014-15 and 2023-24 (P), the share of the agriculture & allied sector in Mizoram's GSDP:",
  ["Fell sharply, from 31.49% to 19.61%", "Rose from 19.61% to 31.49%",
   "Remained almost unchanged at about 30%", "Fell slightly, from 31.49% to 28.65%"], 0,
  "Agriculture's share fell from 31.49% in 2014-15 to 19.61% in 2023-24 (P), while industry's share rose from 20.87% to 31.06% (Table 3.4) — a structural shift in which industry overtook agriculture.",
  G + ["sectoral-share", "structural-change"])

q(T, L, "hard",
  "In Mizoram's GSDP sectoral composition, the industry sector overtook the agriculture & allied sector in which year?",
  ["2017-18", "2014-15", "2020-21", "2023-24"], 0,
  "In 2017-18 industry reached 26.64% against agriculture's 26.51% — the first year industry exceeded agriculture (Table 3.4). The gap has widened since, to 31.06% versus 19.61% in 2023-24 (P).",
  G + ["sectoral-share", "structural-change"])

q(T, L, "medium",
  "Mizoram's total revenue receipt in 2023-24 (Actual) was:",
  ["Rs. 11,41,405.07 lakh", "Rs. 13,29,437.94 lakh", "Rs. 10,83,696.04 lakh", "Rs. 6,42,599.71 lakh"], 0,
  "Total revenue receipt in 2023-24 (Actual) was Rs. 11,41,405.07 lakh; the 2024-25 Revised Estimate is Rs. 13,29,437.94 lakh (Mizoram at a Glance, SN 12A). Rs. 10,83,696.04 lakh was revenue expenditure.",
  G + ["budget", "state-finance"])

q(T, L, "hard",
  "Comparing Mizoram's 2023-24 (Actual) budget figures, which statement is correct?",
  ["Revenue receipt exceeded revenue expenditure, giving a revenue surplus",
   "Revenue expenditure exceeded revenue receipt, giving a revenue deficit",
   "Revenue receipt and expenditure were exactly equal",
   "Capital receipt exceeded total revenue receipt"], 0,
  "In 2023-24 (Actual) revenue receipt was Rs. 11,41,405.07 lakh against revenue expenditure of Rs. 10,83,696.04 lakh — a revenue surplus of about Rs. 57,709 lakh (Mizoram at a Glance, SN 12). In the 2024-25 R.E., however, revenue expenditure (Rs. 13,33,357.15 lakh) slightly exceeds revenue receipt (Rs. 13,29,437.94 lakh).",
  G + ["budget", "state-finance"])

q(T, L, "hard",
  "Mizoram's total capital expenditure in 2023-24 (Actual) was:",
  ["Rs. 6,16,734.68 lakh", "Rs. 3,08,219.35 lakh", "Rs. 6,42,599.71 lakh", "Rs. 2,09,863.00 lakh"], 0,
  "Total capital expenditure in 2023-24 (Actual) was Rs. 6,16,734.68 lakh, against a capital receipt of Rs. 6,42,599.71 lakh (Mizoram at a Glance, SN 12C and 12D).",
  G + ["budget", "state-finance"])
