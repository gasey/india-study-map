# Key-attribution audit (Tier 1)

Tier 1 is not a bulk/automated win. Only assignments that validate (>=25 upstream comparisons and >=70% option-text agreement) are safe to register without a human eye; everything else is either contradicted (wrong paper) or unverifiable and must be confirmed against the printed key.

## Summary

- Candidate one-to-one assignments: **8 papers (611 held questions)**
- `validated` (safe to register): **0**
- `contradicted` (wrong paper — reject): **5**
- `unverifiable` (needs printed-key confirmation): **3**

Validation compares the proposed key against the upstream solved corpus by chosen option text. A correct key scores near the corpus baseline (~86%); a wrong one scores near chance (~25%).

| verdict | paper | subject | held | key file | src | upstream n | agreement |
|---|---|---|---|---|---|---|---|
| unverifiable | mpsc-group-b-geologist-jun-nov-2020-english-p3 | General English Paper-III | 100 | Provisional Answer Key of Geologist under Commerce & Industries Dept.-2024..pdf | ocr | 1 | 0% |
| unverifiable | mpsc-group-b-archive2325-acf-2023-mathematics | Mathematics | 9 | Jr. Gr. of Mizoram Forest Service (ACF) Provisional Answer Key..pdf | pdf | 0 | — |
| unverifiable | mpsc-group-b-si-fcs-2025-p2 | General Knowledge, Arithmetic & Reasoning | 2 | Final Answer Key of Sr. Grade of MHS (Specialist Sub-cadre) under H&FW Deptt..pdf | pdf | 0 | — |
| contradicted | mpsc-group-b-inspector-fcs-2019-gs3 | General Studies Paper-III | 100 | Grade-V of Mizoram Food, Civil Supplies & Consumer Affairs Services (Inspector of Supplies) Final Answer Key..pdf | pdf | 75 | 36% |
| contradicted | mpsc-group-b-ng-january-2026-group-b-non-gazetted-technical-common-examination-general-studies | General Studies | 100 | Provisional Answer Key of Mizoram Group B (Gazetted) General Service (Combined) Examination..pdf | ocr | 40 | 15% |
| contradicted | mpsc-group-b-geologist-jun-nov-2020-english-p2 | General English Paper-II | 100 | Final Answer Key Geologist under Commerce & Industries Dept.-2024..pdf | ocr | 90 | 24% |
| contradicted | mpsc-group-b-archive2325-jr-grade-of-mls-under-law-judicial-deptt-general-knowledge | General Knowledge | 100 | Provisional Answer Key of Jr. Grade of Mizoram Legal Service (Law Officer) under Law & Judicial Dept...pdf | ocr | 75 | 27% |
| contradicted | mpsc-group-b-fr-2019-english-2 | General English Paper-II | 100 | Forest Ranger under EF & CC Dept Provisional Answer Key..pdf | ocr | 48 | 33% |

## Registered keys (`verified-general-keys.json`)

| slug | answers | href |
|---|---|---|
| aao-2024-arithmetic | 100 | /papers/group-b/keys/final-answer-key-of-assistant-audit-accounts-officer-and-assistant-accounts-officer-under-finance-dept.pdf#page=3 |
| aao-2024-english | 100 | /papers/group-b/keys/final-answer-key-of-assistant-audit-accounts-officer-and-assistant-accounts-officer-under-finance-dept.pdf#page=1 |
| aao-2024-gk | 100 | /papers/group-b/keys/final-answer-key-of-assistant-audit-accounts-officer-and-assistant-accounts-officer-under-finance-dept.pdf#page=2 |
| adfd-2025-technical-p1 | 50 | /papers/group-b/keys/adfd-2025-final-key.pdf#page=3 |
| adfd-2025-technical-p2 | 50 | /papers/group-b/keys/adfd-2025-final-key.pdf#page=4 |
| adfd-2025-technical-p3 | 50 | /papers/group-b/keys/adfd-2025-final-key.pdf#page=5 |
| archive-lang-2023-inspector-of-legal-metrology-legal-metrology-general-english-paper-ii-16ff5440 | 100 | /papers/group-b/keys/inspector-of-legal-metrology-final-key.pdf |
| archive-lang-2025-assistant-director-food-drugs-november-2025-assistant-director-general-e-34693fde | 66 | /papers/group-b/keys/assistant-director-food-drugs-2025-general-english-provisional-key.pdf |
| archive-lang-2025-asst-controller-of-mines-under-geology-mining-and-commerce-industries-de-2d3c9208 | 66 | /papers/group-b/keys/acm-2026-final-key.pdf |
| archive-lang-2025-inspector-of-excise-under-excise-narcotics-dept-august-2025-general-engl-029fa88a | 36 | /papers/group-b/keys/inspector-excise-2025-final-key.pdf#page=1 |
| archive-lang-2025-jr-accounts-officer-jr-accounts-officer-paper-i-general-english-series-b-f162a11a | 59 | /papers/group-b/keys/final-answer-key-of-junior-accounts-officer-jao-under-fcsca-deptt-july-2026.pdf#page=2 |
| archive-lang-2025-jr-accounts-officer-jr-accounts-officer-paper-ii-gk-arithmetic-reasoning-0ea2ba29 | 99 | /papers/group-b/keys/final-answer-key-of-junior-accounts-officer-jao-under-fcsca-deptt-july-2026.pdf#page=4 |
| archive-lang-2025-lecturer-vse-and-vocational-guidance-officer-2025-lecturer-vse-general-e-57916eb1 | 66 | /papers/group-b/keys/lecturer-vse-2025-final-key.pdf#page=2 |
| archive-lang-2025-lecturer-vse-and-vocational-guidance-officer-2025-lecturer-vse-general-e-7e2875f9 | 66 | /papers/group-b/keys/lecturer-vse-2025-final-key.pdf#page=1 |
| archive-lang-2025-lecturer-vse-and-vocational-guidance-officer-2025-lecturer-vse-general-e-95d9a281 | 66 | /papers/group-b/keys/lecturer-vse-2025-final-key.pdf#page=3 |
| archive-lang-2025-lecturer-vse-and-vocational-guidance-officer-2025-lecturer-vse-general-e-a1074237 | 66 | /papers/group-b/keys/lecturer-vse-2025-final-key.pdf#page=4 |
| archive-lang-2026-assistant-controller-of-mines-august-2026-assistant-controller-of-mines-cd36d7cc | 66 | /papers/group-b/keys/final-answer-key-assistant-controller-of-mines-august-2026.pdf#page=1 |
| archive-lang-2026-assistant-director-town-planning-under-ud-pa-deptt-2026-assistant-direct-fb729a17 | 66 | /papers/group-b/keys/adtp-2026-ge-final-key.pdf |
| archive-lang-2026-cooperative-audit-officer-march-2026-cao-march-2026-general-english-seri-0538ee53 | 66 | /papers/group-b/keys/cao-2026-final-key.pdf |
| archive-lang-2026-cooperative-audit-officer-march-2026-cao-march-2026-general-english-seri-37cd76e4 | 66 | /papers/group-b/keys/cao-2026-final-key.pdf |
| archive-lang-2026-instructor-iti-april-2026-paper-i-general-english-192ed890 | 30 | /papers/group-b/keys/instructor-iti-2026-paper-i-general-english-final-key.pdf |
| archive-lang-2026-lecturer-govt-hr-secondary-school-serchhip-contract-2026-lecturer-govt-h-bbb95237 | 66 | /papers/group-b/keys/lecturer-hss-serchhip-2026-final-key.pdf |
| archive2325-acf-2023-general-knowledge | 100 | /papers/group-b/keys/acf-2023-general-knowledge-final-key.pdf |
| archive2325-agriculture-allied-service-general-studies-december-2024 | 100 | /papers/group-b/keys/agri-gs-final-key.pdf |
| archive2325-assist-director-town-planning-general-studies | 100 | /papers/group-b/keys/adtp-2023-gs-final-key.pdf |
| archive2325-group-b-combined-general-studies-paper-i-july-2024 | 50 | /papers/group-b/keys/gb-gazetted-2024-gs-final-key.pdf |
| archive2325-group-b-combined-general-studies-paper-ii-july-2024 | 50 | /papers/group-b/keys/gb-gazetted-2024-gs-final-key.pdf |
| archive2325-group-b-combined-general-studies-paper-iii-july-2024 | 49 | /papers/group-b/keys/gb-gazetted-2024-gs-final-key.pdf |
| archive2325-inpector-of-supplies-2023-general-studies-i | 100 | /papers/group-b/keys/inspector-of-supplies-2023-final-key.pdf |
| archive2325-inpector-of-supplies-2023-general-studies-ii | 99 | /papers/group-b/keys/inspector-of-supplies-2023-final-key.pdf |
| archive2325-inpector-of-supplies-2023-general-studies-iii | 98 | /papers/group-b/keys/inspector-of-supplies-2023-final-key.pdf |
| archive2325-jr-grade-of-mes-electrical-wing-under-pe-deptt-general-studies | 100 | /papers/group-b/keys/mes-electrical-wing-gs-final-key.pdf |
| archive2325-lecturer-vse-general-studies-paper-i-a-2025 | 100 | /papers/group-b/keys/lecturer-vse-2025-final-key.pdf#page=5 |
| archive2325-lecturer-vse-general-studies-paper-i-b-2025 | 100 | /papers/group-b/keys/lecturer-vse-2025-final-key.pdf#page=6 |
| archive2325-lecturer-vse-general-studies-paper-i-c-2025 | 100 | /papers/group-b/keys/lecturer-vse-2025-final-key.pdf#page=7 |
| archive2325-lecturer-vse-general-studies-paper-i-d-2025 | 100 | /papers/group-b/keys/lecturer-vse-2025-final-key.pdf#page=8 |
| archive2325-lecturer-vse-general-studies-paper-ii-a-2025 | 100 | /papers/group-b/keys/lecturer-vse-2025-final-key.pdf#page=9 |
| archive2325-lecturer-vse-general-studies-paper-ii-b-2025 | 100 | /papers/group-b/keys/lecturer-vse-2025-final-key.pdf#page=10 |
| archive2325-lecturer-vse-general-studies-paper-ii-c-2025 | 100 | /papers/group-b/keys/lecturer-vse-2025-final-key.pdf#page=11 |
| archive2325-lecturer-vse-general-studies-paper-ii-d-2025 | 100 | /papers/group-b/keys/lecturer-vse-2025-final-key.pdf#page=12 |
| archive2325-lecturer-vse-general-studies-paper-iii-a-2025 | 100 | /papers/group-b/keys/lecturer-vse-2025-final-key.pdf#page=13 |
| archive2325-lecturer-vse-general-studies-paper-iii-b-2025 | 100 | /papers/group-b/keys/lecturer-vse-2025-final-key.pdf#page=14 |
| archive2325-lecturer-vse-general-studies-paper-iii-c-2025 | 100 | /papers/group-b/keys/lecturer-vse-2025-final-key.pdf#page=15 |
| archive2325-lecturer-vse-general-studies-paper-iii-d-2025 | 100 | /papers/group-b/keys/lecturer-vse-2025-final-key.pdf#page=16 |
| archive2325-technical-officer-scert-general-studies-april-2025 | 100 | /papers/group-b/keys/scert-gs-final-key.pdf |
| cdpo-2025-gs | 100 | /papers/group-b/keys/cdpo-2025-final-key.pdf#page=2 |
| cdpo-2025-home-science-p1 | 50 | /papers/group-b/keys/cdpo-2025-final-key.pdf#page=3 |
| cdpo-2025-home-science-p2 | 50 | /papers/group-b/keys/cdpo-2025-final-key.pdf#page=4 |
| cdpo-2025-home-science-p3 | 50 | /papers/group-b/keys/cdpo-2025-final-key.pdf#page=5 |
| cdpo-2025-social-work-p1 | 50 | /papers/group-b/keys/cdpo-2025-final-key.pdf#page=6 |
| cdpo-2025-social-work-p2 | 50 | /papers/group-b/keys/cdpo-2025-final-key.pdf#page=7 |
| cdpo-2025-social-work-p3 | 50 | /papers/group-b/keys/cdpo-2025-final-key.pdf#page=8 |
| co-2026-p1 | 60 | /papers/group-b/keys/co-2026-final-key.pdf#page=1 |
| co-2026-p2 | 100 | /papers/group-b/keys/co-2026-final-key.pdf#page=3 |
| inspector-excise-2025-gs1 | 50 | /papers/group-b/keys/inspector-excise-2025-final-key.pdf#page=2 |
| inspector-excise-2025-gs2 | 50 | /papers/group-b/keys/inspector-excise-2025-final-key.pdf#page=3 |
| inspector-excise-2025-gs3 | 50 | /papers/group-b/keys/inspector-excise-2025-final-key.pdf#page=4 |
| jao-2026-p1 | 60 | /papers/group-b/keys/final-answer-key-of-junior-accounts-officer-jao-under-fcsca-deptt-july-2026.pdf#page=1 |
| jao-2026-p2 | 100 | /papers/group-b/keys/final-answer-key-of-junior-accounts-officer-jao-under-fcsca-deptt-july-2026.pdf#page=3 |
| ng-april-2026-assistant-leso-general-english | 66 | /papers/group-b/keys/final-answer-key-assistant-leso-april-2026.pdf#page=1 |
| ng-april-2026-assistant-leso-under-labour-employment-skill-development-entrepreneurship-department-general-studies | 99 | /papers/group-b/keys/final-answer-key-assistant-leso-april-2026.pdf#page=2 |
| radio-2026-p1 | 60 | /papers/group-b/keys/provisional-answer-key-of-radiotherapy-technologist-contract-under-hfw-deptt.pdf#page=1 |
| radio-2026-p2 | 100 | /papers/group-b/keys/provisional-answer-key-of-radiotherapy-technologist-contract-under-hfw-deptt.pdf#page=2 |
| ri-2026-p1 | 60 | /papers/group-b/keys/ri-2026-final-key.pdf#page=1 |
| ri-2026-p2 | 100 | /papers/group-b/keys/ri-2026-final-key.pdf#page=2 |
| si-excise-2025-p1 | 30 | /papers/group-b/keys/final-answer-key-for-sub-inspector-of-excise-under-exise-narcotics-department.pdf#page=1 |
| si-police-2026-p1 | 60 | /papers/group-b/keys/si-police-2026-final-key.pdf#page=1 |
| si-police-2026-p2 | 100 | /papers/group-b/keys/si-police-2026-final-key.pdf#page=2 |
| si-stats-2026-p1 | 50 | /papers/group-b/keys/si-statistics-2026-final-key.pdf#page=1 |
| si-stats-2026-p2 | 100 | /papers/group-b/keys/si-statistics-2026-final-key.pdf#page=2 |
| steno-2025-english | 75 | /papers/group-b/keys/steno-2025-english-final-key.pdf |
| steno-2025-gk | 100 | /papers/group-b/keys/steno-2025-gk-final-key.pdf |

