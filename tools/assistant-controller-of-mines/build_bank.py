"""Turn parsed.json into src/data/banks/assistant-controller-of-mines-2026.ts.

Run parse.py first. This script assigns topic/subject by NUMBER RANGE within
each section — the source has no per-question topic label, but the questions
cluster tightly by number (verified by reading the source start to finish;
see RANGE tables below), so range lookup is far more reliable than keyword
heuristics on question text.

difficulty is a flat 'medium' default throughout: the source (unlike the
pipeline-solved mpsc-state-tax-officer bank) carries no difficulty signal,
and grading 166 questions by hand wasn't worth the time for what is already
a fast, low-ambiguity mechanical import. Don't read the flat default as a
judged rating.
"""
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).parent
RECORDS = json.loads((HERE / "parsed.json").read_text(encoding="utf-8"))

# (last_num_in_range, subject, topic, topicLabel) — first match wins, ranges
# ascending. Built by reading the source top to bottom; see README.
ENGLISH_RANGES = [
    (10, "english", "parts-of-speech", "Parts of Speech & Word Classes"),
    (15, "english", "error-spotting", "Spotting Errors"),
    (25, "english", "parts-of-speech", "Parts of Speech & Word Classes"),
    (30, "english", "word-transformation", "Word Transformation"),
    (35, "english", "parts-of-speech", "Parts of Speech & Word Classes"),
    (40, "english", "vocabulary-fill", "Vocabulary: Fill in the Blank"),
    (46, "english", "idioms", "Idioms & Phrases"),
    (51, "english", "one-word-sub", "One-Word Substitution"),
    (56, "english", "antonyms", "Antonyms"),
    (61, "english", "sentence-transformation", "Sentence Transformation"),
    (66, "english", "correct-usage", "Correct Usage"),
]
GS_RANGES = [
    (4, "current-affairs", "current-affairs-2026", "Current Affairs 2026"),
    (12, "history", "modern-indian-history", "Modern Indian History"),
    (18, "geography", "geography", "Geography"),
    (25, "polity", "polity-constitution", "Polity & Constitution"),
    (32, "economics", "economy", "Economy"),
    (47, "science", "science-environment", "Science & Environment"),
    (54, "gk", "mizoram-history-culture", "Mizoram History & Culture"),
    (55, "gk", "sports", "Sports"),
    (58, "current-affairs", "current-affairs-2026", "Current Affairs 2026"),
    (62, "history", "modern-indian-history", "Modern Indian History"),
    (66, "geography", "geography", "Geography"),
    (68, "gk", "mining-minerals", "Mining & Minerals"),
    (77, "polity", "polity-constitution", "Polity & Constitution"),
    (78, "gk", "mining-minerals", "Mining & Minerals"),
    (87, "science", "science-environment", "Science & Environment"),
    (95, "gk", "mizoram-history-culture", "Mizoram History & Culture"),
    (96, "polity", "polity-constitution", "Polity & Constitution"),
    (98, "gk", "mining-minerals", "Mining & Minerals"),
    (100, "gk", "mizoram-current-affairs", "Mizoram Current Affairs"),
]

def lookup(num, ranges):
    for last, subject, topic, label in ranges:
        if num <= last:
            return subject, topic, label
    raise ValueError(f"No range covers question {num}")

# Q67's own editorial note flags a real-world inconsistency it can't resolve
# (32 vs 44-47 tunnels) even after "fixing" the answer to match its own
# key — worth carrying forward as a disputeNote so a learner sees the same
# doubt the source recorded, rather than presenting 45 as a clean fact.
DISPUTE_NOTES = {
    ("GENERAL STUDIES", 67): (
        "The source's own editorial note flags an unresolved inconsistency: "
        "\"The Bairabi-Sairang has 32 tunnels, but options are 44-47\" — i.e. "
        "the note-writer isn't sure any of the 4 printed options is factually "
        "right, even the one it settles on. Answered here as 45, the source's "
        "final corrected key, but treat this figure as unverified."
    ),
}

Q = []
for r in RECORDS:
    subject, topic, topic_label = lookup(r["num"], ENGLISH_RANGES if "ENGLISH" in r["section"] else GS_RANGES)
    rec = {
        "type": "mcq",
        "subject": subject,
        "topic": topic,
        "topicLabel": topic_label,
        "difficulty": "medium",
        "question": r["question"],
        "options": r["options"],
        "answerIndex": r["answerIndex"],
        "explanation": (
            f"Marked correct in the source answer key: "
            f"({'abcd'[r['answerIndex']]}) {r['options'][r['answerIndex']]}."
        ),
        "source": "Assistant Controller of Mines 2026 — Marked Answer Key",
        "answerSource": "derived",
        # Deliberately untagged: "View on map" cross-linking matches a
        # question's tags against MAP CHAPTER tags, and this bank has no
        # reliable per-question correspondence to verify against (unlike the
        # Statistical Handbook bank, where every tag was checked against a
        # real river/mountain/district). A blanket 'mizoram' tag on this
        # bank's mining/history/current-affairs questions was tried and
        # reverted — it linked a Jharkhand geology question (Singhbhum Shear
        # Zone) to "Judiciary, Writs & PIL" purely because the tag exists on
        # that chapter, not because the two are related. Wrong cross-links
        # are worse than none.
        "tags": [],
    }
    note = DISPUTE_NOTES.get((r["section"], r["num"]))
    if note:
        rec["disputeNote"] = note
    Q.append(rec)

# ---------------- validate ----------------
errors, seen_q = [], {}
for i, rec in enumerate(Q):
    tag = f"[{i}] {rec['question'][:60]}"
    opts = rec["options"]
    if len(opts) != 4:
        errors.append(f"{tag}: {len(opts)} options, expected 4")
    if len(set(opts)) != len(opts):
        errors.append(f"{tag}: duplicate option text")
    if not 0 <= rec["answerIndex"] < len(opts):
        errors.append(f"{tag}: answerIndex out of range")
    key = re.sub(r"\W+", "", rec["question"].lower())
    if key in seen_q:
        errors.append(f"{tag}: duplicate of [{seen_q[key]}]")
    seen_q[key] = i
if errors:
    print("VALIDATION FAILED:", file=sys.stderr)
    for e in errors:
        print("  " + e, file=sys.stderr)
    sys.exit(1)

# ---------------- assign ids ----------------
counters = {}
for rec in Q:
    t = rec["topic"]
    counters[t] = counters.get(t, 0) + 1
    rec["id"] = f"acom26-{t}-{counters[t]:03d}"

# ---------------- emit ----------------
def ts(v, indent=2):
    pad = " " * indent
    if isinstance(v, str):
        return json.dumps(v, ensure_ascii=False)
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, list):
        if not v:
            return "[]"
        inner = ",\n".join(pad + "  " + ts(x, indent + 2) for x in v)
        return "[\n" + inner + "\n" + pad + "]"
    raise TypeError(type(v))

ORDER = ["id", "type", "subject", "topic", "topicLabel", "difficulty", "question",
         "options", "answerIndex", "explanation", "disputeNote", "source", "answerSource", "tags"]
ordered = [{k: rec[k] for k in ORDER if k in rec} for rec in Q]

def emit_record(rec, indent=2):
    pad = " " * indent
    lines = []
    for k in ORDER:
        if k not in rec:
            continue
        key = k if re.fullmatch(r"[A-Za-z_$][\w$]*", k) else json.dumps(k)
        lines.append(f"{pad}  {key}: {ts(rec[k], indent + 2)}")
    return pad + "{\n" + ",\n".join(lines) + "\n" + pad + "}"

body = "[\n" + ",\n".join(emit_record(r) for r in ordered) + "\n]"

n_eng = sum(1 for r in Q if r["subject"] == "english")
n_gs = len(Q) - n_eng
topics = sorted({r["topicLabel"] for r in Q})

header = f'''import type {{ BankQuestion, QuestionBank }} from './types';

// ============================================
// ASSISTANT CONTROLLER OF MINES 2026 — QUESTION BANK
//
// Source: "ASSISTANT CONTROLLER OF MINES - 2026" marked answer key HTML
// ({len(Q)} questions: {n_eng} General English Part-B + {n_gs} General Studies).
//
// GENERATED FILE — do not hand-edit. Re-run tools/assistant-controller-of-mines/
// parse.py then build_bank.py to reproduce.
//
// PROVENANCE — read before trusting these as authoritative: the source
// document is a "Marked Answer Key" but contains its own leaked reasoning
// trace (e.g. GS Q33: "Wait, the provided key array... Let's fix this to
// match the key exactly"), which means it was authored by an LLM working
// from a described key, not transcribed from a real MPSC-published PDF.
// `answerSource` is 'derived' throughout for exactly that reason — there is
// no independently-verifiable "official" key behind this bank, unlike the
// state-tax-officer bank's answerKeyRef-bearing records.
//
// Three questions (English Q9, GS Q33, GS Q67) had two answer blocks in the
// source, the first superseded by an inline editorial correction — this
// bank carries only the corrected (second) answer, per tools/assistant-
// controller-of-mines/parse.py. GS Q67 additionally carries a disputeNote:
// its own correction left an unresolved contradiction ("32 tunnels" vs.
// printed options "44-47") that no amount of "let's fix this" resolves.
//
// Topics are assigned by NUMBER RANGE within each section (no per-question
// topic label exists in the source) — see build_bank.py's RANGE tables.
// ============================================

export const assistantControllerOfMines2026Questions: BankQuestion[] = '''

footer = f''';

export const assistantControllerOfMines2026: QuestionBank = {{
  id: 'assistant-controller-of-mines-2026',
  title: 'Assistant Controller of Mines 2026',
  description:
    'Mock MPSC Assistant Controller of Mines paper — {n_eng} General English (Part-B) and ' +
    '{n_gs} General Studies MCQs, including Mizoram-specific mining, history and current-affairs ' +
    'questions distinctive to this post. Self-authored practice content, not a published exam key.',
  questions: assistantControllerOfMines2026Questions,
}};
'''

out = Path(sys.argv[1])
out.write_text(header + body + footer, encoding="utf-8")
print(f"wrote {out}", file=sys.stderr)
print(f"  {n_eng} English + {n_gs} GS = {len(Q)} questions", file=sys.stderr)
for t in topics:
    print(f"    {sum(1 for r in Q if r['topicLabel'] == t):3d}  {t}", file=sys.stderr)
