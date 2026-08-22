"""Shared collector for the Mizoram Statistical Handbook 2024 question batches."""

Q = []


def q(topic, label, diff, question, options, ans, expl, tags, source_note=None):
    """Register one MCQ. `ans` is the 0-based index of the correct option.

    `source_note`: set only when the HANDBOOK ITSELF contradicts this exact
    figure elsewhere (two tables disagree) — renders as a distinct "Source
    note" badge, separate from the prose explanation. Don't use it for
    ordinary distractor context.
    """
    rec = dict(type="mcq", topic=topic, topicLabel=label, difficulty=diff,
               question=question, options=options, answerIndex=ans,
               explanation=expl, tags=tags)
    if source_note:
        rec["sourceNote"] = source_note
    Q.append(rec)


def d(topic, label, diff, question, expl, tags, subparts=None, guidance=None, words=None):
    """Register one descriptive / essay-style question."""
    rec = dict(type="descriptive", topic=topic, topicLabel=label, difficulty=diff,
               question=question, explanation=expl, tags=tags)
    if subparts:
        rec["subparts"] = subparts
    if guidance:
        rec["guidance"] = guidance
    if words:
        rec["wordLimit"] = words
    Q.append(rec)
