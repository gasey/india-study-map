#!/usr/bin/env python3
"""Break the oversized `gs1_history_modern` bucket into period sub-topics.

    python3 tools/bank-rebuild/retag_history_modern.py

Run after retag_history.py and before apply.py (see README.md).

WHY. retag_history.py split the flat `gs1_history` bucket, but it did so with a
per-id override table and a DEFAULT of `gs1_history_modern` for anything not
listed. That was fine for the 235 questions it was written against. Since then
the bank has grown to 3,479 and every new GS-I history question — plus every
GS-I question that matched no keyword rule at all — has landed in that default.
Measured 2026-09-05: 521 of the bank's 530 history questions sat in
`gs1_history_modern`, i.e. 98% in one bucket, which is barely better than the
single bucket it replaced.

TWO DIFFERENT PROBLEMS WERE MIXED IN THERE, and this script separates both.

1. **Real Modern History with no internal structure.** 448 questions genuinely
   are modern Indian history; they are split here into eight period/theme
   buckets so the topic is actually studiable.

2. **Questions that are not history at all.** 73 had leaked in through the
   default — the same failure retag_history.py documented for the 2016 paper,
   recurring in every sitting added since, because those sittings were never
   added to its override table. `mpsc-fccas-inspector-2019-gs-i-q052..q100` is
   almost an entire current-affairs section sitting under "Modern India &
   Freedom Struggle"; the 2021 papers contribute another large block. These are
   returned to `gs1_current`, and the handful that are really polity, economy,
   geography, science or Mizoram GK go to those topics rather than being swept
   into current affairs, which would only relocate the lumping problem.

THE CLASSIFICATION IS A CHECKED-IN PER-ID LOOKUP, NOT A HEURISTIC — the same
choice retag_history.py made, for the same reason: keyword rules are what
produced the mess. It lives in `history-modern-split.json` (id -> topic + a
short reason), was produced by reading all 521 questions, and is checked in so
this script is reproducible without re-deriving it.

FUTURE SITTINGS. A question that reaches this script in `gs1_history_modern`
without an entry in the lookup is left where it is and reported as UNCLASSIFIED.
That is deliberate: it must not silently inherit a period it was never assessed
for, and a rebuild should not hard-fail just because new material arrived. Add
the new ids to the lookup when they show up.
"""

import json
import os
import sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = "gs1_history_modern"

# topic slug -> (topicLabel, subject)
LABELS = {
    "gs1_history_modern_colonial_rule": ("Colonial Rule & Company Raj", "history"),
    "gs1_history_modern_revolt_1857": ("Revolt of 1857", "history"),
    "gs1_history_modern_social_reform": ("Social & Religious Reform", "history"),
    "gs1_history_modern_early_nationalism": ("Early Nationalism (1885–1918)", "history"),
    "gs1_history_modern_gandhian_era": ("Gandhian Era (1919–1947)", "history"),
    "gs1_history_modern_revolutionary_ina": ("Revolutionaries & the INA", "history"),
    "gs1_history_modern_constitutional": ("Constitutional Development", "history"),
    "gs1_history_modern_post_independence": ("Post-Independence India", "history"),
    # buckets questions are moved OUT to; labels match what the bank already uses
    "gs1_history_ancient": ("Ancient India", "history"),
    "gs1_history_medieval": ("Medieval India", "history"),
    "gs1_history_art_culture": ("Art & Culture", "history"),
    "gs1_current": ("Current Affairs", "current-affairs"),
    "gs2_polity": ("Indian Polity & Governance", "polity"),
    "gs2_economy": ("Indian Economy", "economics"),
    "gs2_geography": ("Geography", "geography"),
    "gs3_scitech": ("Science & Technology", "science"),
    "gs3_mizoram": ("Mizoram GK", "gk"),
}

STILL_HISTORY = {t for t, (_, s) in LABELS.items() if s == "history"}


def main():
    path = os.path.join(HERE, "bank-rebuilt.json")
    lookup_path = os.path.join(HERE, "history-modern-split.json")
    bank = json.load(open(path))
    lookup = json.load(open(lookup_path))

    bad = {v["topic"] for v in lookup.values()} - set(LABELS)
    if bad:
        sys.exit("retag_history_modern: lookup names unknown topic(s): %s" % ", ".join(sorted(bad)))

    # No early return when this is empty: the label normalisation below still
    # has to run on an already-split bank, and it is idempotent either way.
    targets = [q for q in bank["questions"] if q.get("topic") == SRC]
    if not targets:
        print("nothing tagged %s — already split; checking labels only" % SRC)

    counts, unclassified = Counter(), []
    for q in targets:
        entry = lookup.get(q["id"])
        if entry is None:
            unclassified.append(q["id"])
            continue
        topic = entry["topic"]
        label, subject = LABELS[topic]
        q["topic"] = topic
        q["topicLabel"] = label
        q["subject"] = subject
        counts[topic] += 1

    # Normalise the labels on the history buckets this script did not move
    # into. gs1_history_ancient / _medieval / _art_culture predate the split and
    # some of their records carry topicLabel "General" with subject "gk" —
    # inherited from the GS-I default rather than set by retag_history.py. The
    # UI titles a topic by the most common label among its questions, so a
    # 3-vs-2 split left "Art & Culture" reading as "General" on screen. The
    # canonical label for every one of these topics is already in LABELS.
    relabelled = Counter()
    for q in bank["questions"]:
        topic = q.get("topic")
        if topic not in STILL_HISTORY:
            continue
        label, subject = LABELS[topic]
        if q.get("topicLabel") != label or q.get("subject") != subject:
            q["topicLabel"] = label
            q["subject"] = subject
            relabelled[topic] += 1
    if relabelled:
        print("\nnormalised topicLabel/subject on %d pre-existing history record(s):"
              % sum(relabelled.values()))
        for t, n in sorted(relabelled.items(), key=lambda kv: -kv[1]):
            print("  %-38s %4d" % (t, n))

    stale = sorted(set(lookup) - {q["id"] for q in bank["questions"]})
    if stale:
        print("WARNING: %d lookup id(s) are not in the bank:" % len(stale))
        for s in stale[:10]:
            print("  ", s)

    json.dump(bank, open(path, "w"), indent=1, ensure_ascii=False)

    kept = sum(n for t, n in counts.items() if t in STILL_HISTORY)
    moved = sum(n for t, n in counts.items() if t not in STILL_HISTORY)
    print("retagged %s -> %d buckets" % (SRC, len(counts)))
    for topic, n in sorted(counts.items(), key=lambda kv: -kv[1]):
        flag = "" if topic in STILL_HISTORY else "   (out of history)"
        print("  %-38s %4d%s" % (topic, n, flag))
    print("  %-38s %4d" % ("still history", kept))
    print("  %-38s %4d" % ("moved out of history", moved))
    print("  %-38s %4d" % ("total", kept + moved))

    if unclassified:
        print("\nUNCLASSIFIED: %d question(s) stayed in %s because the lookup has no "
              "entry for them. Add them to history-modern-split.json." % (len(unclassified), SRC))
        for u in unclassified[:20]:
            print("  ", u)


if __name__ == "__main__":
    main()
