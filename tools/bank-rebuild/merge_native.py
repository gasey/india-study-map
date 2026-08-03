#!/usr/bin/env python3
"""
Merge the re-extracted Jan-2016 / Nov-2019 / Feb-2021 papers into the bank.

No official MPSC answer key exists for any of these sittings, so answers cannot
come from an authority. The next best thing is the answers already in the bank —
but the OLD OPTION ORDER CANNOT BE TRUSTED, because the OCR that produced those
records is exactly what mangled the options. So an old answer is carried across
only by matching the TEXT of the option it pointed at against the newly
extracted options. If that text is not found, the answer is dropped and the
question is queued for solving.

Carrying `answerIndex` across positionally would be the single easiest way to
silently corrupt this entire bank.
"""
import json
import os
import re
import sys
import unicodedata
from difflib import SequenceMatcher

HERE = os.path.dirname(os.path.abspath(__file__))

# paper key -> bank paperId
PAPER_IDS = {
    "2016:English-II": "mpsc-inspector-of-taxes-2016-english-ii",
    "2016:GS-I":       "mpsc-inspector-of-taxes-2016-gs-i",
    "2016:GS-II":      "mpsc-inspector-of-taxes-2016-gs-ii",
    "2016:GS-III":     "mpsc-inspector-of-taxes-2016-gs-iii",
    "2019:English-II": "mpsc-inspector-of-excise-&-narcotics-2019-english-ii",
    "2019:GS-I":       "mpsc-inspector-of-excise-&-narcotics-2019-gs-i",
    "2019:GS-II":      "mpsc-inspector-of-excise-&-narcotics-2019-gs-ii",
    "2019:GS-III":     "mpsc-inspector-of-excise-&-narcotics-2019-gs-iii",
    "2021:English-II": "mpsc-inspector-of-excise-&-narcotics-2021-english-ii",
    "2021:GS-I":       "mpsc-inspector-of-excise-&-narcotics-2021-gs-i",
    "2021:GS-II":      "mpsc-inspector-of-excise-&-narcotics-2021-gs-ii",
    "2021:GS-III":     "mpsc-inspector-of-excise-&-narcotics-2021-gs-iii",
}

TOPIC_LABELS = {
    "gs1_history": "Modern Indian History",
    "gs1_current": "Current Affairs",
    "gs2_polity": "Indian Polity & Governance",
    "gs2_economy": "Indian Economy",
    "gs2_geography": "Geography",
    "gs3_mizoram": "Mizoram GK",
    "gs3_scitech": "Science & Technology",
    "gs3_aptitude": "Reasoning & Aptitude",
    "eng_grammar": "English Grammar",
    "eng_vocab": "English Vocabulary",
    "eng_sentence": "Sentence Correction & Usage",
    "eng_comprehension": "Reading Comprehension",
}
SUBJECT_OF_TOPIC = {
    "gs1_history": "history", "gs1_current": "current-affairs",
    "gs2_polity": "polity", "gs2_economy": "economics", "gs2_geography": "geography",
    "gs3_mizoram": "gk", "gs3_scitech": "science", "gs3_aptitude": "reasoning",
    "eng_grammar": "english", "eng_vocab": "english",
    "eng_sentence": "english", "eng_comprehension": "english",
}

# Ordered: first match wins. Only used when there is no matched old record to
# inherit a topic from.
TOPIC_RULES = [
    ("gs3_aptitude", r"\bseries\b|missing number|next figure|odd one out|if .* is coded|"
                     r"average of|ratio of|how many .*(?:students|men|women|days)|"
                     r"related to that (?:boy|girl)|arrange|sequence"),
    ("gs3_mizoram", r"\bmizo|mizoram|lushai|zawlbuk|aizawl|rihdil|chapchar|mim kut|pawl kut|"
                    r"bawi|mautam|puan|khuallam|sailo|thangliana|young lushai"),
    ("eng_grammar", r"part of speech|parts of speech|preposition|correct form of the verb|"
                    r"tense|active voice|passive voice|article|conjunction|"
                    r"correct adjective|correct adverb|correct verb|correct pronoun"),
    ("eng_vocab", r"synonym|antonym|opposite in meaning|nearest in meaning|one word|"
                  r"meaning of the (?:word|idiom)|idiom|word[- ]substitute"),
    ("eng_sentence", r"sentence|phrase|spelt correctly|correctly spelt|error in|"
                     r"improve the sentence|direct speech|indirect speech"),
    ("gs2_polity", r"constitution|parliament|lok sabha|rajya sabha|fundamental right|"
                   r"directive principle|president of india|governor|supreme court|"
                   r"high court|amendment|panchayat|election commission|schedule"),
    ("gs2_economy", r"\bgdp\b|inflation|reserve bank|\brbi\b|budget|tax|fiscal|monetary|"
                    r"five[- ]year plan|niti aayog|bank|poverty|census.*economic|repo"),
    ("gs2_geography", r"river|mountain|plateau|monsoon|climate|soil|forest|latitude|"
                      r"longitude|tropic|desert|national park|wildlife sanctuary|mineral"),
    ("gs3_scitech", r"\batom|molecul|chemical|physics|vitamin|disease|blood|enzyme|"
                    r"planet|satellite|isro|dna|cell\b|acid|metal|element|energy|"
                    r"light|sound|gravity|computer|software|internet"),
    ("gs1_history", r"gandhi|nehru|mughal|british|independence|freedom|congress|"
                    r"ashoka|maurya|gupta|sultanate|revolt|movement|viceroy|treaty|"
                    r"war of|dynasty|emperor|satyagraha"),
    ("gs1_current", r"\b202[0-9]\b|recently|award|summit|appointed|launched|first ever"),
]


def squash(s):
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]", "", s.lower())


def norm_words(s):
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9 ]", " ", re.sub(r"\s+", " ", s.lower())).strip()


# Last resort when neither the keyword rules nor an inherited topic decide it.
# Every paper has a dominant subject, so this is far better than dumping the
# question into "other" — an "other" bucket is invisible in the topic filter and
# is where questions go to be never revised.
PAPER_DEFAULT = {
    "English-II": "eng_sentence",
    "GS-I": "gs1_history",
    "GS-II": "gs2_polity",
    "GS-III": "gs3_scitech",
}


def classify(stem, options, direction, fallback, paper_key=""):
    text = f"{direction or ''} {stem} {' '.join(options)}".lower()
    for topic, pat in TOPIC_RULES:
        if re.search(pat, text):
            return topic
    if fallback and fallback != "other":
        return fallback
    return PAPER_DEFAULT.get(paper_key.split(":")[-1], "other")


# The Jan-2016 GS-III printing has a font failure: the Mizo letter "ṭ" did not
# render and came out as a literal "|" or "\" (e.g. "|au thla", "Lam\huamthum",
# "J.H.Ro\huama"). Confirmed as ṭ rather than a scanning artifact because a
# sibling paper prints the same month as "Tau thla" -- ṭ is what ASCII sources
# transliterate as T. Left as raw punctuation these words are unsearchable and
# look like corruption, which is exactly what this rebuild is meant to remove.
GLYPH = re.compile(r"[|\\](?=[a-z])")


def fix_glyphs(text):
    if not text or not GLYPH.search(text):
        return text, False
    # Word-initial takes the capital form, mid-word the lower.
    out = []
    for i, ch in enumerate(text):
        if ch in "|\\" and i + 1 < len(text) and text[i + 1].islower():
            at_word_start = i == 0 or not text[i - 1].isalpha()
            out.append("Ṭ" if at_word_start else "ṭ")
        else:
            out.append(ch)
    return "".join(out), True


def load_parsed():
    out = dict(json.load(open(os.path.join(HERE, "parsed-native.json"))))
    scan = os.path.join(HERE, "parsed-2016-GS-III.json")
    if os.path.exists(scan):
        out["2016:GS-III"] = json.load(open(scan))
    else:
        print("  (parsed-2016-GS-III.json absent — that paper will be left as-is)")
    return out


def apply_underlines(parsed):
    """Wrap the underlined word in __..__ so the UI can render it."""
    path = os.path.join(HERE, "underlines.json")
    if not os.path.exists(path):
        print("  (underlines.json absent — underline markup not applied)")
        return 0
    marks = json.load(open(path))
    n = 0
    for key, items in marks.items():
        by_n = {q["n"]: q for q in parsed.get(key, [])}
        for item in items:
            word = item.get("underlined")
            q = by_n.get(item["n"])
            if not word or q is None:
                continue
            if word not in q["stem"]:
                print(f"    !! {key} Q{item['n']}: underlined {word!r} not found in stem")
                continue
            # Replace the first occurrence only.
            q["stem"] = q["stem"].replace(word, f"__{word}__", 1)
            n += 1
    return n


def main():
    bank = json.load(open(os.path.join(HERE, "bank.json")))
    parsed = load_parsed()
    n_marked = apply_underlines(parsed)

    old_by_paper = {}
    for q in bank["questions"]:
        old_by_paper.setdefault(q.get("paperId"), []).append(q)

    rebuilt_ids, new_questions = set(), []
    stats = dict(carried_answer=0, dropped_answer=0, no_match=0,
                 carried_expl=0, figure=0, defect=0, glyph_fixed=0)

    for key, qs in sorted(parsed.items()):
        paper_id = PAPER_IDS[key]
        rebuilt_ids.add(paper_id)
        olds = old_by_paper.get(paper_id, [])
        year = int(key.split(":")[0])

        for q in qs:
            if q.get("unreadable"):
                continue
            n = q["n"]
            opts = q.get("options", [])
            rec = {
                "id": f"{paper_id}-q{n:03d}",
                "difficulty": "medium",
                "question": q.get("stem", ""),
                "options": opts,
                "explanation": "",
                "source": "MPSC State Tax Officer / Group B Gazetted",
                "year": year,
                "paperId": paper_id,
            }
            if q.get("direction"):
                rec["passage"] = q["direction"]
            if q.get("figureBased"):
                rec["figureBased"] = True
                stats["figure"] += 1
            if q.get("sourceDefect"):
                rec["sourceDefect"] = q["sourceDefect"]
                stats["defect"] += 1

            rec["question"], hit_q = fix_glyphs(rec["question"])
            fixed_opts, hits = [], hit_q
            for o in rec["options"]:
                fo, h = fix_glyphs(o)
                fixed_opts.append(fo)
                hits = hits or h
            rec["options"] = fixed_opts
            opts = fixed_opts
            if hits:
                stats["glyph_fixed"] += 1

            # ---- find the old counterpart ----
            best, score = None, 0.0
            nq = norm_words(rec["question"])
            if nq:
                for o in olds:
                    s = SequenceMatcher(None, nq, norm_words(o.get("question", ""))).ratio()
                    if s > score:
                        best, score = o, s
            matched = best if score >= 0.78 else None

            # ---- topic (set before the answer logic so every exit path has it) ----
            if matched:
                if matched.get("tags"):
                    rec["tags"] = matched["tags"]
            else:
                stats["no_match"] += 1
            topic = classify(rec["question"], opts, q.get("direction"),
                             (matched.get("topic") if matched else None) or "other",
                             key)
            rec["topic"] = topic
            rec["topicLabel"] = TOPIC_LABELS.get(topic, "General")
            rec["subject"] = SUBJECT_OF_TOPIC.get(topic, "gk")

            # ---- answer: remap by OPTION TEXT, never by index ----
            rec["answerSource"] = "derived"
            if rec.get("figureBased"):
                # No options and no images available as text — there is nothing
                # to solve and nothing to point an index at.
                rec["answerIndex"] = -1
                rec["explanation"] = (
                    "This is a non-verbal reasoning question whose options are printed as "
                    "diagrams, so they cannot be reproduced as text here. No official answer "
                    "key exists for this sitting. Work it from the original paper."
                )
                new_questions.append(rec)
                continue
            rec["answerIndex"] = 0
            rec["needsSolving"] = True
            if matched:
                old_ai = matched.get("answerIndex")
                old_opts = matched.get("options") or []
                if isinstance(old_ai, int) and 0 <= old_ai < len(old_opts):
                    target = squash(old_opts[old_ai])
                    # Require a solid, unambiguous text match.
                    hits = [i for i, o in enumerate(opts)
                            if target and squash(o) == target]
                    if len(hits) == 1:
                        rec["answerIndex"] = hits[0]
                        rec.pop("needsSolving")
                        stats["carried_answer"] += 1
                    else:
                        stats["dropped_answer"] += 1

            # An explanation is only worth keeping if its answer survived: an
            # explanation arguing for an answer we just dropped is worse than none.
            if matched and matched.get("explanation") and not rec.get("needsSolving"):
                rec["explanation"] = matched["explanation"]
                stats["carried_expl"] += 1

            if not rec["explanation"]:
                rec["needsExplanation"] = True
            new_questions.append(rec)

    kept = [q for q in bank["questions"] if q.get("paperId") not in rebuilt_ids]
    bank["questions"] = kept + new_questions
    json.dump(bank, open(os.path.join(HERE, "bank-rebuilt.json"), "w"),
              indent=1, ensure_ascii=False)

    print(f"kept {len(kept)}, rebuilt {len(new_questions)} across {len(rebuilt_ids)} papers")
    print(f"  underlined words marked      : {n_marked}")
    print(f"  answers carried (text-matched): {stats['carried_answer']}")
    print(f"  answers DROPPED (text moved)  : {stats['dropped_answer']}")
    print(f"  no old counterpart            : {stats['no_match']}")
    print(f"  explanations carried          : {stats['carried_expl']}")
    print(f"  figure-based                  : {stats['figure']}")
    print(f"  source defects                : {stats['defect']}")
    print(f"  broken Mizo glyphs repaired   : {stats['glyph_fixed']}")
    print(f"  NEED SOLVING                  : {sum(1 for q in new_questions if q.get('needsSolving'))}")


if __name__ == "__main__":
    main()
