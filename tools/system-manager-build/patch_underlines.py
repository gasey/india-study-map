#!/usr/bin/env python3
"""
Recover the underline markers the bank's extractor lost, for the parts-of-speech
block of the SAD General English paper (Q39-44).

THE BUG: `SOLVE_BRIEF.md` says underlined words arrive marked `__like this__`.
The bank does carry them for 18 of this paper's questions (33-38, 45-48, 54-58)
but LOST them for 39-44 — the one block where the underline IS the question.
"Identify the parts of speech for the underlined word in: This phone is much
better than that." is unanswerable as stored: much/better/than/that are four
different parts of speech and the options offer four different answers.

pdftotext cannot see underlining, so these were read off a 300dpi render of
page 5 of the source PDF (verified visually, 2026-08-28):

    39. This phone is much better than [that].       -> Pronoun
    40. [Poverty] is a huge problem in India.         -> Noun
    41. Smoking has a bad [effect] on one's health.   -> NOUN — NOT AN OPTION
    42. I [have] supported you a lot in the past...   -> Verb
    43. He came [yesterday] to see you...             -> Adverb
    44. She coloured her hair [green].                -> Adjective

Q41 IS DEFECTIVE. Its printed options are Preposition / Verb / Adverb /
Adjective; the underlined word "effect" is a noun, so no printed option is
correct. Both the bank's stored answer (Verb) and the blind solve's (Preposition)
are wrong. It is marked low confidence with the defect stated, per the
"flag broken questions, don't guess" rule.

This is a hand-curated patch, not a general recovery: it needs a human to look at
the page. Kept as a script so it is re-applied on every rebuild rather than being
a one-off edit to generated output.

Usage:  python3 tools/system-manager-build/patch_underlines.py
        (writes staged/underline_patch.json; assemble.py applies it)
"""

import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
STAGED = os.path.join(HERE, "staged")

# id -> (word to underline, correct letter, conf, explanation)
PATCH = {
    "CO2016A-GE-39": (
        "that", "A", "high",
        "Here 'that' stands in for the noun 'phone' in a comparison — 'better than that "
        "[phone]' — so it is a demonstrative pronoun. It would be a determiner only if it "
        "were followed by the noun, as in 'that phone'."),
    "CO2016A-GE-40": (
        "Poverty", "C", "high",
        "'Poverty' is an abstract noun and the subject of the sentence. The adjective form "
        "is 'poor'; there is no verb or adverb form in play here."),
    "CO2016A-GE-41": (
        "effect", "A", "low",
        "The underlined word 'effect' is a NOUN — 'a bad effect'. None of the four printed "
        "options (Preposition, Verb, Adverb, Adjective) is correct, so this question is "
        "defective as printed. Note the classic trap it gestures at: 'effect' is the noun, "
        "'affect' the verb."),
    "CO2016A-GE-42": (
        "have", "D", "high",
        "'have' is the auxiliary verb forming the present perfect 'have supported'. "
        "Auxiliaries are verbs, so the part of speech is verb."),
    "CO2016A-GE-43": (
        "yesterday", "A", "high",
        "'yesterday' modifies the verb 'came' by telling us when, which makes it an adverb "
        "of time. It can be a noun elsewhere ('yesterday was cold'), but not in this slot."),
    "CO2016A-GE-44": (
        "green", "C", "high",
        "'green' is an object complement describing the resulting state of 'her hair', so "
        "it is an adjective. It would be a noun only as a colour name in its own right, as "
        "in 'green is my favourite colour'."),

    # Q54-58: "Pick the correct clause of the words underlined". Here the underline
    # spans a whole clause, not a single word — read off page 6 of the same render.
    "CO2016A-GE-54": (
        "gave you yesterday", "B", "high",
        "The underlined words belong to the relative clause 'that I gave you yesterday', "
        "which modifies the noun 'money' — that is an adjective (relative) clause. A noun "
        "clause would itself be a subject or object, not a modifier."),
    "CO2016A-GE-55": (
        "which was stolen", "B", "high",
        "'which was stolen' modifies the noun 'book', so it is an adjective (relative) "
        "clause. The relative pronoun 'which' introducing a modifier is the giveaway."),
    "CO2016A-GE-56": (
        "since I came here", "A", "high",
        "'since I came here' answers 'since when' about the state 'have been ill', so it "
        "modifies the verb and is an adverb clause of time. 'Since' here is a subordinating "
        "conjunction of time, not a preposition."),
    "CO2016A-GE-57": (
        "that you have succeeded", "A", "high",
        "'that you have succeeded' is the object of 'to know' — it fills a noun slot, so it "
        "is a noun clause. Contrast the 'that' of a relative clause, which modifies a noun "
        "instead of replacing one."),
    "CO2016A-GE-58": (
        "wherever he went", "D", "high",
        "'wherever he went' tells us where he carried the laptop, modifying the verb, so it "
        "is an adverb clause of place. 'Wherever' is a subordinating conjunction here."),
}


def main():
    out = {}
    for qid, (word, ans, conf, exp) in PATCH.items():
        out[qid] = {
            "underline": word,
            "ans": ans,
            "conf": conf,
            "exp": exp,
            "prov": ("Underline marker recovered from a 300dpi render of the source PDF — "
                     "the question bank lost it, leaving the question unanswerable. "
                     "Answer derived from the recovered text; no official MPSC key exists."),
            "note": ("defective as printed: the underlined word is a noun, which is not "
                     "among the options" if qid == "CO2016A-GE-41" else
                     "underline recovered from the source PDF"),
        }

    os.makedirs(STAGED, exist_ok=True)
    path = os.path.join(STAGED, "underline_patch.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)

    print(f"wrote {len(out)} underline recoveries -> "
          f"{os.path.relpath(path, os.getcwd())}")
    for qid, v in out.items():
        flag = "  <-- DEFECTIVE" if v["conf"] == "low" else ""
        print(f"  {qid}: underline '{v['underline']}' -> {v['ans']} "
              f"({v['conf']}){flag}")


if __name__ == "__main__":
    main()
