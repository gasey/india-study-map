#!/usr/bin/env python3
"""
Split the single flat `gs1_history` bucket into finer-grained topics.

All 235 questions tagged `gs1_history` (from every sitting: 2016, 2019, 2021,
2024, 2025) carried the same label, "Modern Indian History" -- even though a
few are Ancient India, a few are Medieval India, several are Art & Culture,
and a couple dozen aren't history at all (they're 2015-16 current-affairs
questions that fell through merge_native.py's keyword rules and landed on the
"GS-I defaults to gs1_history" fallback in PAPER_DEFAULT).

This script was written by reading all 235 questions' text/options (dumped
from bank.json, the pre-rebuild bank) and classifying each by hand -- there is
no heuristic here, just a per-id lookup. Run it after merge.py + merge_native.py
have produced bank-rebuilt.json (see README.md), before apply.py.

Buckets:
  gs1_history_ancient  -- Ancient India (up to ~1200 CE)
  gs1_history_medieval -- Medieval India (~1200-1757: Sultanate/Mughals/regional
                           kingdoms), as long as the question is actually ABOUT
                           that era's polity/society -- not merely mentioning a
                           Mughal emperor's name in a colonial-contact question
                           (by the standard exam convention, "Modern Indian
                           History" starts at the arrival of the Europeans,
                           ~1600, and a farman granting a trading post is a
                           Modern History question, not a Medieval one)
  gs1_history_modern   -- Modern India / Freedom Struggle (the large majority)
  gs1_history_art_culture -- architecture, classical music/dance, cave art,
                           where the question is about the art form itself,
                           not a historical event

A handful of questions in the old gs1_history bucket are not history at all
and are moved back to the topic they actually belong to:
  gs1_current   -- 2015/16-era current affairs that leaked into the "GS-I"
                   default bucket (TRAI penalty, Pay Commission chair, Paris
                   attacks, PMJDY, Modi's first foreign trip, etc.)
  gs3_scitech   -- "Missile Woman of India" (Tessy Thomas) -- a science/DRDO
                   question, not history
  gs3_mizoram   -- "First chairman of the state Planning Board" -- Mizoram
                   state machinery, not history
  gs2_geography -- "southernmost point of India" (Indira Point) -- geography

No World History bucket: none of the 235 questions are about non-Indian
history (the ones that look like it -- Paris attacks, ISIL, Netanyahu -- are
2015 current events, not history, and are moved to gs1_current above).
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))

NEW_LABELS = {
    "gs1_history_ancient": "Ancient India",
    "gs1_history_medieval": "Medieval India",
    "gs1_history_modern": "Modern India & Freedom Struggle",
    "gs1_history_art_culture": "Art & Culture",
}

# id -> new topic slug. Anything tagged gs1_history but NOT listed here
# defaults to gs1_history_modern (see main()) -- that covers the ~199
# East-India-Company-through-independence questions, which is most of them.
OVERRIDES = {
    # ---- Ancient India ----
    "mpsc-inspector-of-taxes-2016-gs-i-q041": "gs1_history_ancient",       # Bhagavad Gita / Mahabharata
    "mpsc-inspector-of-excise-&-narcotics-2019-gs-iii-q006": "gs1_history_ancient",  # first to compute with zero

    # ---- Medieval India ----
    "mpsc-inspector-of-taxes-2016-gs-i-q009": "gs1_history_medieval",     # Mughal court language = Persian
    "mpsc-inspector-of-taxes-2016-gs-i-q050": "gs1_history_medieval",     # Purdah widespread under the Mughals
    "mpsc-inspector-of-excise-&-narcotics-2019-gs-i-q004": "gs1_history_medieval",  # Nana Saheb / Peshwa

    # ---- Art & Culture ----
    "mpsc-inspector-of-taxes-2016-gs-i-q037": "gs1_history_art_culture",  # Carnatic Music
    "mpsc-inspector-of-taxes-2016-gs-i-q038": "gs1_history_art_culture",  # Muslim Art architecture
    "mpsc-inspector-of-taxes-2016-gs-i-q039": "gs1_history_art_culture",  # Ajanta & Ellora cave painting
    "mpsc-inspector-of-taxes-2016-gs-i-q040": "gs1_history_art_culture",  # Bhangra harvest dance

    # ---- Not history at all: send back to the bucket they actually belong in ----
    # 2015/16 current affairs that leaked in via merge_native.py's PAPER_DEFAULT
    # ("GS-I" -> "gs1_history" when no keyword rule matched).
    "mpsc-inspector-of-taxes-2016-gs-i-q051": "gs1_current",  # TRAI call-drop penalty
    "mpsc-inspector-of-taxes-2016-gs-i-q052": "gs1_current",  # 7th Pay Commission chairman
    "mpsc-inspector-of-taxes-2016-gs-i-q053": "gs1_current",  # new CBI Director
    "mpsc-inspector-of-taxes-2016-gs-i-q054": "gs1_current",  # Patricia Scotland / Commonwealth
    "mpsc-inspector-of-taxes-2016-gs-i-q055": "gs1_current",  # Andy Murray / Davis Cup
    "mpsc-inspector-of-taxes-2016-gs-i-q056": "gs1_current",  # Prithvi-II missile test
    "mpsc-inspector-of-taxes-2016-gs-i-q059": "gs1_current",  # Mauricio Macri / Argentina
    "mpsc-inspector-of-taxes-2016-gs-i-q060": "gs1_current",  # China animal-cloning factory
    "mpsc-inspector-of-taxes-2016-gs-i-q067": "gs1_current",  # 2015 Paris attacks
    "mpsc-inspector-of-taxes-2016-gs-i-q070": "gs1_current",  # NSCN-K / UAPA
    "mpsc-inspector-of-taxes-2016-gs-i-q072": "gs1_current",  # Nobel Prize in Economics 2015
    "mpsc-inspector-of-taxes-2016-gs-i-q073": "gs1_current",  # PMJDY scheme
    "mpsc-inspector-of-taxes-2016-gs-i-q078": "gs1_current",  # AAP 2015 Delhi Assembly win
    "mpsc-inspector-of-taxes-2016-gs-i-q079": "gs1_current",  # Mann Ki Baat with Obama
    "mpsc-inspector-of-taxes-2016-gs-i-q080": "gs1_current",  # Modi's first foreign visit as PM
    "mpsc-inspector-of-taxes-2016-gs-i-q085": "gs1_current",  # National Food Security Act 2013
    "mpsc-inspector-of-taxes-2016-gs-i-q088": "gs1_current",  # A.P.J. Abdul Kalam's books
    "mpsc-inspector-of-taxes-2016-gs-i-q093": "gs1_current",  # Sania Mirza Grand Slam doubles
    "mpsc-inspector-of-taxes-2016-gs-i-q094": "gs1_current",  # free-education state scheme
    "mpsc-inspector-of-taxes-2016-gs-i-q096": "gs1_current",  # Seychelles / WTO 161st member
    "mpsc-inspector-of-taxes-2016-gs-i-q097": "gs1_current",  # Netanyahu / Likud
    "mpsc-inspector-of-taxes-2016-gs-i-q098": "gs1_current",  # ISIL meaning
    "mpsc-inspector-of-taxes-2016-gs-i-q099": "gs1_current",  # Charlie Hebdo attack
    "mpsc-inspector-of-excise-&-narcotics-2019-gs-i-q053": "gs1_current",  # Modi electricity-for-all scheme

    "mpsc-inspector-of-excise-&-narcotics-2019-gs-iii-q004": "gs3_scitech",  # "Missile Woman of India" (Tessy Thomas)
    "mpsc-inspector-of-excise-&-narcotics-2021-gs-ii-q059": "gs3_mizoram",   # first chairman, state Planning Board
    "mpsc-inspector-of-taxes-2016-gs-ii-q099": "gs2_geography",             # southernmost point of India (Indira Point)
}

# Labels/subjects for the topics questions get MOVED OUT to, so this script
# doesn't need to import merge.py/merge_native.py's tables just for four ids.
EXTRA_LABELS = {
    "gs1_current": ("Current Affairs", "current-affairs"),
    "gs3_scitech": ("Science & Technology", "science"),
    "gs3_mizoram": ("Mizoram GK", "gk"),
    "gs2_geography": ("Geography", "geography"),
}


def main():
    path = os.path.join(HERE, "bank-rebuilt.json")
    bank = json.load(open(path))

    counts = {}
    missing = []
    for q in bank["questions"]:
        if q.get("topic") != "gs1_history":
            continue
        new_topic = OVERRIDES.get(q["id"], "gs1_history_modern")
        q["topic"] = new_topic
        if new_topic in NEW_LABELS:
            q["topicLabel"] = NEW_LABELS[new_topic]
            q["subject"] = "history"
        else:
            label, subject = EXTRA_LABELS[new_topic]
            q["topicLabel"] = label
            q["subject"] = subject
        counts[new_topic] = counts.get(new_topic, 0) + 1

    for qid in OVERRIDES:
        if not any(q["id"] == qid for q in bank["questions"]):
            missing.append(qid)
    if missing:
        print(f"WARNING: {len(missing)} override id(s) not found in bank-rebuilt.json:")
        for m in missing:
            print("  ", m)

    json.dump(bank, open(path, "w"), indent=1, ensure_ascii=False)

    print("retagged gs1_history ->")
    for topic, n in sorted(counts.items(), key=lambda kv: -kv[1]):
        print(f"  {topic:28} {n:4}")
    print(f"  {'total':28} {sum(counts.values()):4}")


if __name__ == "__main__":
    main()
