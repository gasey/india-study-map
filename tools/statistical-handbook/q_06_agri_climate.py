from qlib import Q, q

# ---------------- CLIMATE ----------------
T, L = "climate", "Climate & Rainfall"
G = ["mizoram", "climate", "rainfall"]

q(T, L, "medium",
  "The annual normal rainfall of Mizoram, as given in Table 2.1 of the Statistical Handbook, is:",
  ["2,090.33 mm", "1,547.80 mm", "2,974.90 mm", "1,473.10 mm"], 0,
  "Table 2.1 gives Mizoram's annual normal rainfall as 2,090.33 mm. (Table 2.2 carries a differing normal of 2,213.51 mm computed on monthly data, so always name the table.)",
  G,
  source_note="Table 2.1 prints the normal as 2,090.33 mm; Table 2.2, in the same chapter, prints 2,213.51 mm for the same 'annual normal rainfall'. This question is scoped to Table 2.1's figure specifically — a question scoped to Table 2.2 would need the other number.")

q(T, L, "medium",
  "Mizoram's actual annual rainfall in 2024 was:",
  ["1,547.80 mm", "1,473.10 mm", "2,090.33 mm", "1,622.10 mm"], 0,
  "Rainfall in 2024 was 1,547.80 mm (Table 2.1) — well below the annual normal of 2,090.33 mm, and only slightly above 2023's 1,473.10 mm.",
  G)

q(T, L, "hard",
  "In the twenty-year series 2005–2024, Mizoram recorded its LOWEST annual rainfall in which year?",
  ["2023 (1,473.10 mm)", "2024 (1,547.80 mm)", "2021 (1,551.60 mm)", "2019 (1,812.74 mm)"], 0,
  "2023 recorded the lowest rainfall of the series at 1,473.10 mm, followed by 2024 (1,547.80 mm) and 2021 (1,551.60 mm) — Table 2.1. The state has run below normal for several consecutive years.",
  G)

q(T, L, "hard",
  "In the series 2005–2024, Mizoram's HIGHEST annual rainfall was recorded in:",
  ["2010 (2,974.90 mm)", "2007 (2,962.90 mm)", "2011 (2,526.40 mm)", "2013 (2,422.50 mm)"], 0,
  "2010 recorded 2,974.90 mm, narrowly ahead of 2007's 2,962.90 mm (Table 2.1).",
  G)

# ---------------- AGRICULTURE ----------------
T, L = "agriculture", "Agriculture & Land Use"
G = ["mizoram", "agriculture"]
A = "Figures are from Table 8.1, area in hectares, production in metric tonnes, yield in kg per hectare. "

q(T, L, "medium",
  "In Mizoram, the crop occupying the largest area under cultivation in 2023-24 was:",
  ["Rice", "Maize", "Oilseeds", "Sugarcane"], 0,
  A + "Rice occupied 24,615 ha in 2023-24 (jhum rice 14,684 ha plus WRC 9,931 ha), far ahead of maize at 6,398 ha.",
  G + ["rice", "crops"])

q(T, L, "hard",
  "Total rice production in Mizoram in 2023-24 was:",
  ["39,924 MT", "58,836 MT", "22,008 MT", "17,916 MT"], 0,
  A + "Total rice production was 39,924 MT in 2023-24, down sharply from 58,836 MT in 2022-23. Of this, wet rice cultivation contributed 22,008 MT and jhum rice 17,916 MT.",
  G + ["rice", "crops"])

q(T, L, "hard",
  "Comparing jhum rice and wet rice cultivation (WRC) in Mizoram in 2023-24, which statement is correct?",
  ["Jhum occupied more area but WRC gave a higher yield per hectare",
   "WRC occupied more area and also gave a higher yield per hectare",
   "Jhum gave a higher yield per hectare than WRC",
   "Jhum and WRC had identical yields per hectare"], 0,
  A + "Jhum rice covered 14,684 ha against WRC's 9,931 ha, but WRC yielded 2,216 kg/ha against jhum's 1,220 kg/ha — WRC is roughly 1.8 times as productive per hectare. This contrast underpins Mizoram's policy of promoting WRC over shifting cultivation.",
  G + ["rice", "jhum", "wrc"])

q(T, L, "hard",
  "Among the crops listed in Table 8.1 for 2023-24, which recorded the highest yield rate per hectare?",
  ["Sugarcane (23,394 kg/ha)", "Potato (5,857 kg/ha)", "WRC-Rabi rice (2,079 kg/ha)", "Maize (1,668 kg/ha)"], 0,
  A + "Sugarcane yielded 23,394 kg/ha in 2023-24, an order of magnitude above the cereals; potato was next at 5,857 kg/ha.",
  G + ["crops", "yield"])

q(T, L, "medium",
  "The area under current jhum (shifting cultivation) in Mizoram in 2022-23 was approximately:",
  ["18.10 thousand hectares", "1.81 thousand hectares", "181 thousand hectares", "38.10 thousand hectares"], 0,
  "Current jhum covered 18.10 thousand hectares in 2022-23, down from 18.89 thousand hectares in 2021-22 (Table 8.3, Land Use Statistics).",
  G + ["jhum", "land-use"])

q(T, L, "hard",
  "As per Mizoram's Land Use Statistics for 2022-23, the net irrigated area was:",
  ["12.24 thousand hectares", "20.32 thousand hectares", "19.24 thousand hectares", "214 thousand hectares"], 0,
  "Net irrigated area was 12.24 thousand hectares in 2022-23, down from 19.24 thousand ha in 2021-22; gross irrigated area was 20.32 thousand ha (Table 8.3).",
  G + ["irrigation", "land-use"])
