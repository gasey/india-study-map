from qlib import Q, q

# ---------------- POWER ----------------
T, L = "power", "Power & Electricity"
G = ["mizoram", "power", "infrastructure"]

q(T, L, "medium",
  "Mizoram's total installed power generation capacity in 2023-24 was:",
  ["62.70 MW", "31.70 MW", "222.51 MW", "159.12 MW"], 0,
  "Total installed capacity was 62.70 MW in 2023-24 — hydro 38.35 MW, solar 23.85 MW and diesel 0.50 MW, with no thermal capacity (Table 20.1). Capacity had nearly doubled from 31.70 MW in 2021-22.",
  G + ["installed-capacity"])

q(T, L, "hard",
  "The sharp rise in Mizoram's installed capacity between 2021-22 and 2022-23 was driven mainly by:",
  ["A large addition of solar capacity, from 2.35 MW to 23.85 MW",
   "New thermal power plants", "A doubling of hydro capacity",
   "New diesel generating sets"], 0,
  "Solar capacity rose from 2.35 MW to 23.85 MW, and hydro from 29.35 MW to 38.35 MW, taking the total from 31.70 MW to 62.70 MW (Table 20.1). Mizoram has no thermal capacity at all.",
  G + ["solar", "renewables"])

q(T, L, "hard",
  "Mizoram's estimated hydropower potential, as recorded in the Statistical Handbook, is:",
  ["3,500 MW", "222.51 MW", "159.12 MW", "62.70 MW"], 0,
  "Estimated power potential is 3,500 MW (Table 20.2) — against an installed capacity of just 62.70 MW and a peak demand of 159.12 MW, showing how little of the potential is developed.",
  G + ["hydropower", "potential"])

q(T, L, "hard",
  "Mizoram's peak power demand and allocated share of power in 2023-24 were respectively:",
  ["159.12 MW and 222.51 MW", "222.51 MW and 159.12 MW",
   "62.70 MW and 159.12 MW", "3,500 MW and 222.51 MW"], 0,
  "Peak power demand was 159.12 MW while the allocated share of power was 222.51 MW (Table 20.2).",
  G + ["demand"])

q(T, L, "hard",
  "A striking change in Mizoram's power position between 2021-22 and 2023-24 was that net import of electricity:",
  ["Collapsed from 647.61 MU to 0.41 MU", "Rose from 0.41 MU to 647.61 MU",
   "Remained steady at about 600 MU", "Fell modestly from 647.61 MU to 500 MU"], 0,
  "Net import fell from 647.61 MU in 2021-22 to 29.83 MU in 2022-23 and just 0.41 MU in 2023-24, while own generation rose from 28.12 MU to 85.28 MU (Table 20.1) — a marked move towards self-sufficiency.",
  G + ["imports", "self-sufficiency"])

q(T, L, "hard",
  "Which category of consumer accounted for the largest share of electricity consumption in Mizoram in 2023-24?",
  ["Domestic (306.16 MU)", "Commercial (57.71 MU)", "Public water works (95.56 MU)", "Industrial (16.03 MU)"], 0,
  "Domestic consumption was 306.16 MU out of a total 515.49 MU — nearly 60% (Table 20.4). Public water works (95.56 MU) and commercial (57.71 MU) followed; agriculture was smallest at 0.27 MU.",
  G + ["consumption"])

q(T, L, "hard",
  "Mizoram's per capita electricity consumption in 2023-24 was:",
  ["411.74 kWh", "439.42 kWh", "342.68 kWh", "515.49 kWh"], 0,
  "Per capita consumption was 411.74 kWh in 2023-24, down from 439.42 kWh in 2022-23 (Table 20.4). 515.49 MU was total consumption.",
  G + ["per-capita-consumption"])

q(T, L, "hard",
  "The number of villages electrified in Mizoram up to 31st March 2024 was:",
  ["717 out of 730 inhabited villages", "730 out of 730 inhabited villages",
   "704 out of 830 villages", "690 out of 730 inhabited villages"], 0,
  "717 of Mizoram's 730 inhabited villages were electrified up to 31 March 2024, giving a state figure of 98.19% (Table 20.3). Lawngtlai had the largest shortfall, with 164 of 170 villages electrified.",
  G + ["electrification"])

# ---------------- ROADS & TRANSPORT ----------------
T, L = "transport", "Roads, Transport & Communication"
G = ["mizoram", "transport", "infrastructure"]

q(T, L, "medium",
  "The total length of roads in Mizoram in 2023-24 was:",
  ["7,708.00 km", "6,688.52 km", "3,999.21 km", "1,016.48 km"], 0,
  "Total road length was 7,708.00 km — 6,688.52 km surfaced and 1,016.48 km unsurfaced (Table 21.5), at an overall road density of 31.38 km per 100 sq km.",
  G + ["roads"])

q(T, L, "hard",
  "Which category accounts for the greatest road length in Mizoram (2023-24)?",
  ["Village roads (3,999.21 km)", "Town roads (1,384.55 km)",
   "District roads (1,362.63 km)", "National Highways (590.29 km)"], 0,
  "Village roads, at 3,999.21 km, make up over half of Mizoram's 7,708.00 km network (Table 21.5). Town roads (1,384.55 km) and district roads (1,362.63 km) follow.",
  G + ["roads"])

q(T, L, "hard",
  "The total length of National Highways in Mizoram in 2023-24 was:",
  ["590.29 km", "371.32 km", "549.29 km", "1,362.63 km"], 0,
  "National Highways ran 590.29 km — 549.29 km surfaced and 41.00 km unsurfaced (Table 21.5). State Highways accounted for a further 371.32 km, all of it surfaced.",
  G + ["roads", "national-highways"])

q(T, L, "hard",
  "The overall road density of Mizoram in 2023-24 was:",
  ["31.38 km per 100 sq km", "16.28 km per 100 sq km",
   "2.40 km per 100 sq km", "43.20 km per 100 sq km"], 0,
  "Overall road density was 31.38 km per 100 sq km (Table 21.5), of which village roads alone contributed 16.28.",
  G + ["roads", "density"])

q(T, L, "medium",
  "The total number of vehicles on road in Mizoram as on 31.3.2024 was:",
  ["3,03,801", "3,00,906", "2,07,351", "51,389"], 0,
  "There were 3,03,801 vehicles — 3,00,906 private and 2,895 government (Table 21.1). Of these, 2,07,351 were motor cycles and scooters.",
  G + ["vehicles"])

q(T, L, "hard",
  "Which type of vehicle is most numerous on Mizoram's roads as on 31.3.2024?",
  ["Motor cycles / scooters (2,07,351)", "Motor cars (51,389)",
   "Goods carriers (21,708)", "Three-wheelers (6,219)"], 0,
  "Motor cycles and scooters number 2,07,351, roughly 68% of all 3,03,801 registered vehicles (Table 21.1). Motor cars (51,389) and goods carriers (21,708) follow.",
  G + ["vehicles"])

q(T, L, "hard",
  "In 2023-24, the number of airlines operating in Mizoram and the total air passengers carried were:",
  ["2 airlines and 2,10,046 passengers", "3 airlines and 1,68,474 passengers",
   "2 airlines and 1,68,474 passengers", "3 airlines and 2,10,046 passengers"], 0,
  "In 2023-24 just 2 airlines operated in Mizoram (down from 3), yet passenger numbers rose to 2,10,046 from 1,68,474 (Table 21.7).",
  G + ["aviation"])

q(T, L, "hard",
  "The number of operational helipads in Mizoram in 2023-24 was:",
  ["40", "33", "26", "23"], 0,
  "Mizoram had 40 operational helipads in 2023-24, up from 33 (Table 21.7), serving 26 helicopter destinations. Helicopter passengers, however, fell from 14,846 to 9,868.",
  G + ["aviation", "helicopter"])

# ---------------- TOURISM ----------------
T, L = "tourism", "Tourism"
G = ["mizoram", "tourism"]

q(T, L, "medium",
  "The number of foreign tourists who arrived in Mizoram in 2023-24 was:",
  ["3,884", "3,551", "5,469", "2,15,230"], 0,
  "Foreign tourist arrivals rose to 3,884 in 2023-24 from 3,551 in 2022-23, while domestic arrivals fell from 2,18,457 to 2,15,230 (Table 17.1).",
  G + ["tourist-arrivals"])

q(T, L, "hard",
  "Revenue collected from tourist facilities in Mizoram in 2023-24 was:",
  ["Rs. 374.37 lakh", "Rs. 297.68 lakh", "Rs. 297.19 lakh", "Rs. 436.89 lakh"], 0,
  "Revenue from tourist facilities was Rs. 374.37 lakh in 2023-24, up from Rs. 297.68 lakh in 2022-23 (Table 17.1) — a rise achieved even though domestic arrivals fell.",
  G + ["tourism-revenue"])

q(T, L, "hard",
  "In calendar year 2024, total tourist arrivals in Mizoram numbered:",
  ["5,22,629", "5,17,160", "2,15,230", "5,469"], 0,
  "Total arrivals in 2024 were 5,22,629 — 5,17,160 domestic and 5,469 foreign (Table 17.2). Note this calendar-year count is far above the 2023-24 financial-year figure in Table 17.1, which is compiled differently.",
  G + ["tourist-arrivals"])

q(T, L, "hard",
  "In 2024, which month recorded the highest tourist arrivals in Mizoram?",
  ["December (60,112)", "January (56,470)", "March (53,598)", "November (52,256)"], 0,
  "December recorded 60,112 arrivals — the peak month for both domestic (59,132) and foreign (980) tourists (Table 17.2), coinciding with Christmas and the Winter Festival. August was the trough at 29,808.",
  G + ["tourist-arrivals", "seasonality"])

q(T, L, "hard",
  "In 2024, the LOWEST monthly tourist arrivals in Mizoram were recorded in:",
  ["August (29,808)", "July (32,695)", "September (30,507)", "June (35,722)"], 0,
  "August was the lowest month at 29,808 arrivals, followed by September (30,507) and July (32,695) — Table 17.2. The monsoon months are Mizoram's tourism trough.",
  G + ["tourist-arrivals", "seasonality"])
