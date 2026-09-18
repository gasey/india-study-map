"""Topic taxonomy for MPSC Practice Hub 2.

One place to say what a topic slug *means* and which subject family it belongs
to. Deliberately open: an unknown slug does NOT break the build, it gets a
prettified label and lands in the "Other" group, and `validate.py` reports it
so you can decide whether to name it properly.

That openness is the point. The failure mode this repo has already been bitten
by (see CLAUDE.md on `retag_history.py`) is a lookup with a silent default:
every paper added after the table was written piled into the default bucket and
nobody noticed for months. Here the default is loud — validate.py prints every
slug that fell through.
"""

# group slug -> display label, in the order they should appear in the UI
GROUPS = [
    ("english",   "General English"),
    ("gk",        "General Knowledge"),
    ("mizoram",   "Mizoram"),
    ("aptitude",  "Arithmetic & Aptitude"),
    ("reasoning", "Reasoning"),
    ("other",     "Other"),
]

# topic slug -> (group slug, display label)
TOPICS = {
    # ---------------------------------------------------------- English
    "parts_of_speech":        ("english", "Parts of Speech"),
    "prepositions":           ("english", "Prepositions"),
    "clauses":                ("english", "Clauses"),
    "sentence_transformation": ("english", "Sentence Transformation"),
    "narration":              ("english", "Narration / Reported Speech"),
    "voice":                  ("english", "Active & Passive Voice"),
    "vocabulary_antonym":     ("english", "Antonyms"),
    "vocabulary_synonym":     ("english", "Synonyms"),
    "one_word_substitution":  ("english", "One-Word Substitution"),
    "idioms_phrases":         ("english", "Idioms & Phrases"),
    "collective_nouns":       ("english", "Collective Nouns"),
    "degrees_of_comparison":  ("english", "Degrees of Comparison"),
    "sentence_correction":    ("english", "Sentence Correction"),
    "subject_verb_agreement": ("english", "Subject–Verb Agreement"),
    "word_usage":             ("english", "Word Usage & Fill in the Blanks"),
    "comprehension":          ("english", "Comprehension"),

    # ---------------------------------------------------------- GK
    "current_affairs":           ("gk", "Current Affairs"),
    "history_modern":            ("gk", "History — Modern India"),
    "history_ancient_medieval":  ("gk", "History — Ancient & Medieval"),
    "geography_physical":        ("gk", "Geography — Physical"),
    "geography_world":           ("gk", "Geography — World & India"),
    "polity":                    ("gk", "Polity & Constitution"),
    "economy":                   ("gk", "Economy"),
    "environment_ecology":       ("gk", "Environment & Ecology"),
    "science_physics":           ("gk", "Science — Physics"),
    "science_chemistry":         ("gk", "Science — Chemistry"),
    "science_biology":           ("gk", "Science — Biology"),
    "sports_misc":               ("gk", "Sports & Miscellaneous"),

    # ---------------------------------------------------------- Mizoram
    "mizoram_gk":      ("mizoram", "Mizoram — General"),
    "mizoram_history": ("mizoram", "Mizoram — History"),
    "mizoram_culture": ("mizoram", "Mizoram — Culture & Folklore"),

    # ---------------------------------------------------------- Aptitude
    "number_system":             ("aptitude", "Number System"),
    "average":                   ("aptitude", "Averages"),
    "percentage":                ("aptitude", "Percentages"),
    "profit_loss":               ("aptitude", "Profit & Loss"),
    "ratio_proportion":          ("aptitude", "Ratio & Proportion"),
    "time_work":                 ("aptitude", "Time & Work"),
    "pipes_cisterns":            ("aptitude", "Pipes & Cisterns"),
    "simple_compound_interest":  ("aptitude", "Simple & Compound Interest"),
    "mensuration":               ("aptitude", "Mensuration"),
    "permutation_combination":   ("aptitude", "Permutation & Combination"),
    "probability":               ("aptitude", "Probability"),
    "algebra":                   ("aptitude", "Algebra"),
    "data_interpretation":       ("aptitude", "Data Interpretation"),
    "speed_distance_time":       ("aptitude", "Speed, Distance & Time"),
    "mixture_alligation":        ("aptitude", "Mixtures & Alligation"),
    "age_problems":              ("aptitude", "Ages"),

    # ---------------------------------------------------------- Reasoning
    "analogy":            ("reasoning", "Analogy"),
    "classification":     ("reasoning", "Classification"),
    "coding_decoding":    ("reasoning", "Coding & Decoding"),
    "number_series":      ("reasoning", "Series"),
    "blood_relation":     ("reasoning", "Blood Relations"),
    "direction_sense":    ("reasoning", "Direction Sense"),
    "seating_arrangement": ("reasoning", "Seating Arrangement"),
    "syllogism":          ("reasoning", "Syllogism"),
    "figure_counting":    ("reasoning", "Figure Counting"),
    "paper_folding":      ("reasoning", "Paper Folding"),
    "mirror_image":       ("reasoning", "Mirror & Water Images"),
    "venn_diagram":       ("reasoning", "Venn Diagrams"),
    "calendar_clock":     ("reasoning", "Calendars & Clocks"),
    "ranking":            ("reasoning", "Ranking & Order"),
    "alphabet_test":      ("reasoning", "Alphabet Test"),
    "matrix_reasoning":   ("reasoning", "Number / Letter Matrices"),
    "odd_one_out":        ("reasoning", "Odd One Out"),
    "logical_sequence":   ("reasoning", "Logical Sequence"),
    "dice":               ("reasoning", "Dice"),
    "figure_series":      ("reasoning", "Figure Series"),
}

GROUP_LABELS = dict(GROUPS)
GROUP_ORDER = [g for g, _ in GROUPS]


def prettify(slug: str) -> str:
    """Fallback label for a slug that is not in TOPICS."""
    return slug.replace("_", " ").replace("-", " ").title()


def resolve(slug: str):
    """(group_slug, label, known) for a topic slug. Never raises."""
    if slug in TOPICS:
        group, label = TOPICS[slug]
        return group, label, True
    return "other", prettify(slug), False
