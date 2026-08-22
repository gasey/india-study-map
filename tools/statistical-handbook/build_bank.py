"""Build src/data/banks/mizoram-statistical-handbook-2024.ts from the q_*.py batches.

Validates before emitting: unique ids, answerIndex in range, 4 distinct options,
non-empty explanation, no duplicate question text.
"""
import importlib, json, re, sys, pathlib

sys.path.insert(0, str(pathlib.Path(__file__).parent))

BATCHES = [
    "q_01_geo", "q_02_demography", "q_03_symbols", "q_04_economy",
    "q_05_forest", "q_06_agri_climate", "q_07_health_edu", "q_08_infra",
    "q_09_polity", "q_10_allindia", "q_11_descriptive",
]

import qlib
for m in BATCHES:
    importlib.import_module(m)
Q = qlib.Q

SUBJECT_BY_TOPIC = {
    "geo_area": "geography", "demography": "geography", "climate": "geography",
    "symbols_gk": "gk", "economy": "economics", "forest_env": "geography",
    "agriculture": "geography", "health": "gk", "education": "gk",
    "power": "gk", "transport": "gk", "tourism": "gk",
    "polity_admin": "polity", "crime_police": "gk", "all_india": "geography",
    "descriptive_stats": "gk",
}

# ---------------- validate ----------------
errors, seen_q = [], {}
for i, r in enumerate(Q):
    tag = f"[{i}] {r['question'][:60]}"
    if r["topic"] not in SUBJECT_BY_TOPIC:
        errors.append(f"{tag}: unmapped topic {r['topic']!r}")
    if not r.get("explanation", "").strip():
        errors.append(f"{tag}: empty explanation")
    key = re.sub(r"\W+", "", r["question"].lower())
    if key in seen_q:
        errors.append(f"{tag}: duplicate of [{seen_q[key]}]")
    seen_q[key] = i
    if r["type"] == "mcq":
        opts = r["options"]
        if len(opts) != 4:
            errors.append(f"{tag}: {len(opts)} options, expected 4")
        if len(set(opts)) != len(opts):
            errors.append(f"{tag}: duplicate option text")
        if not isinstance(r["answerIndex"], int) or not 0 <= r["answerIndex"] < len(opts):
            errors.append(f"{tag}: answerIndex {r['answerIndex']} out of range")
    else:
        for sp in r.get("subparts", []):
            if not sp.get("label") or not sp.get("text"):
                errors.append(f"{tag}: malformed subpart")

if errors:
    print("VALIDATION FAILED:", file=sys.stderr)
    for e in errors:
        print("  " + e, file=sys.stderr)
    sys.exit(1)

# ---------------- normalise tags to the map's real vocabulary ----------------
# Cross-linking ("View on map") matches a question's tags against chapter tags.
# A tag carried by EVERY question is worse than no tag: 'mizoram' is held only by
# three POLITY chapters (judiciary, states-reorganisation, sixth-schedule), so
# leaving it on all 176 questions made a forest question link to "Judiciary,
# Writs & PIL". Keep 'mizoram' only where those chapters are genuinely relevant,
# and otherwise attach the tags the mizoram-geography / mountains chapters use.
KEEP_MIZORAM_TAG = {"polity_admin"}

# substring in question+explanation -> extra chapter tags to attach
TEXT_TAGS = [
    ("tlawng",              ["tlawng", "mizo-hills"]),
    ("kolodyne",            ["kaladan"]),
    ("chhimtuipui",         ["kaladan"]),
    ("karnaphuli",          ["karnaphuli"]),
    ("khawthlangtuipui",    ["karnaphuli"]),
    ("latitude",            ["tropic-of-cancer"]),
    ("phawngpui",           ["mizo-hills", "purvanchal"]),
    ("mountain",            ["mizo-hills", "purvanchal"]),
    ("peak",                ["mizo-hills"]),
    ("myanmar",             ["northeast"]),
    ("bangladesh",          ["northeast"]),
    ("assam",               ["assam", "northeast"]),
    ("tripura",             ["tripura", "northeast"]),
    ("manipur",             ["northeast"]),
    ("autonomous district", ["sixth-schedule-adc", "mizoram", "northeast"]),
    ("village council",     ["panchayat", "mizoram"]),
    ("lawngtlai",           ["lawngtlai"]),
    ("siaha",               ["siaha"]),
]

for r in Q:
    tags = [t for t in r["tags"] if t != "mizoram" or r["topic"] in KEEP_MIZORAM_TAG]
    hay = (r["question"] + " " + r.get("explanation", "")).lower()
    for needle, extra in TEXT_TAGS:
        if needle in hay:
            tags.extend(extra)
    # 'india'/'comparative' on the all-India set links to national geography chapters
    seen, out = set(), []
    for t in tags:
        if t not in seen:
            seen.add(t)
            out.append(t)
    r["tags"] = out

# ---------------- assign ids ----------------
counters = {}
for r in Q:
    t = r["topic"]
    counters[t] = counters.get(t, 0) + 1
    r["id"] = f"mzshb24-{t.replace('_', '-')}-{counters[t]:03d}"
    r["subject"] = SUBJECT_BY_TOPIC[t]
    r["source"] = "Statistical Handbook Mizoram 2024"
    # No `year`: the schema reserves it for the EXAM year of a true PYQ. These
    # are authored questions, not questions from a 2024 paper, and setting it
    # also made the source badge read "…Mizoram 2024 2024".
    r["answerSource"] = "derived"

# ---------------- emit ----------------
def ts(v, indent=2):
    pad = " " * indent
    if isinstance(v, str):
        return json.dumps(v, ensure_ascii=False)
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, list):
        if not v:
            return "[]"
        inner = ",\n".join(pad + "  " + ts(x, indent + 2) for x in v)
        return "[\n" + inner + "\n" + pad + "]"
    if isinstance(v, dict):
        inner = ",\n".join(
            pad + "  " + (k if re.fullmatch(r"[A-Za-z_$][\w$]*", k) else json.dumps(k))
            + ": " + ts(val, indent + 2)
            for k, val in v.items())
        return "{\n" + inner + "\n" + pad + "}"
    raise TypeError(type(v))

ORDER = ["id", "type", "subject", "topic", "topicLabel", "difficulty", "question",
         "options", "answerIndex", "subparts", "guidance", "wordLimit",
         "explanation", "sourceNote", "source", "year", "answerSource", "tags"]
ordered = [{k: r[k] for k in ORDER if k in r} for r in Q]

n_mcq = sum(1 for r in Q if r["type"] == "mcq")
n_desc = len(Q) - n_mcq
topics = sorted({r["topicLabel"] for r in Q})

header = f'''import type {{ BankQuestion, QuestionBank }} from './types';

// ============================================
// MIZORAM STATISTICAL HANDBOOK 2024 — QUESTION BANK
//
// Source: "Statistical Handbook Mizoram 2024" (25th in the series),
// Directorate of Economics & Statistics, Government of Mizoram.
// Published 2025. 279 pp., 48 chapters.
//
// {n_mcq} MCQs + {n_desc} descriptive/essay questions across {len(topics)} topics.
//
// PROVENANCE: every figure was transcribed from the source PDF in this
// repo's usual way — `pdftotext -layout` for the tables, plus direct
// page-image reads for the dense bilingual "Mizoram at a Glance" and
// "State Information" pages (pp. v-xiv), which the text extractor
// mangles. Questions were written only from figures verified against
// one of those two views.
//
// `answerSource` is 'derived' throughout: these are authored questions,
// not questions from a published MPSC paper with an official key. The
// underlying STATISTICS are official; the question framing is not.
//
// KNOWN SOURCE INCONSISTENCIES that questions deliberately avoid or
// explicitly disambiguate (the handbook itself is not self-consistent):
//   - Mizoram's Census 2011 population is 10,97,206 in the state
//     chapters but 10,91,014 in the All-India chapter (Table 47.1);
//     literacy likewise 91.33% vs 91.58%. Questions name the table.
//   - Forest cover is quoted against BOTH ISFR 2021 (17,820.03 sq km,
//     84.53%) and ISFR 2023 (17,990.46 sq km, 85.34%). Questions always
//     state which report.
//   - Annual normal rainfall is 2,090.33 mm in Table 2.1 but 2,213.51 mm
//     in Table 2.2. Only the Table 2.1 figure is used, and it is named.
//   - Table 20.3's per-district "% electrified" column does not
//     reconcile with its own village counts (e.g. Kolasib 36/36 shown as
//     99.21%), so only the counts and the state total are used.
//   - Table 13.6 files Dampa Tiger Reserve under the "National Park"
//     heading; the National Parks question notes that Mizoram has two
//     (Murlen, Phawngpui) and that Dampa is a tiger reserve.
//   - Table 24.10 (drop-out rate) is entirely NA and Table 24.11 (GER)
//     prints ratios rather than percentages, so neither is used.
// ============================================

export const mizoramStatHandbook2024Questions: BankQuestion[] = '''

body = ts(ordered, 0)

footer = f''';

export const mizoramStatHandbook2024: QuestionBank = {{
  id: 'mizoram-stat-handbook-2024',
  title: 'Mizoram Statistical Handbook 2024',
  description:
    'Data-driven MPSC/UPSC prep mined from the Statistical Handbook Mizoram 2024 ' +
    '(Directorate of Economics & Statistics) — {n_mcq} MCQs and {n_desc} descriptive/essay ' +
    'prompts covering geography, demography, the state economy, forests, agriculture, ' +
    'health and NFHS-5, education, infrastructure, polity and all-India comparisons.',
  questions: mizoramStatHandbook2024Questions,
}};
'''

out = pathlib.Path(sys.argv[1])
out.write_text(header + body + footer, encoding="utf-8")
print(f"wrote {out}")
print(f"  {n_mcq} MCQ + {n_desc} descriptive = {len(Q)} questions")
for t in topics:
    print(f"    {sum(1 for r in Q if r['topicLabel'] == t):3d}  {t}")
