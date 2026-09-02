#!/usr/bin/env python3
"""Re-derive the General Studies unit weights from what MPSC has actually asked.

    python3 tools/system-analyst-build/rebalance_gs_units.py          # dry run
    python3 tools/system-analyst-build/rebalance_gs_units.py --write

WHY. `syllabus.js` has always said the GS unit breakdown is *derived* - "the
regulation gives no topic list, so the unit breakdown below is derived from what
MPSC has actually asked". When it was written there were no real GS papers in
the bank, so the numbers were an informed guess. There are now three fully
tagged sittings (300 questions), and the guess is off by up to 11 points: General
Science was weighted 12 and is asked 23 times per 100, IT was weighted 10 and is
asked 1.4.

That is not cosmetic. `app.js` samples practice questions in proportion to unit
marks ("a unit worth 40 marks should appear twice as often as one worth 20"), so
a wrong weight means the wrong revision mix - IT at seven times its real rate,
reasoning at half.

METHOD - a 50/50 BLEND, not raw observation. Three papers is a small sample and
a syllabus is a forecast of the next exam, not a description of the last three.
Weighting purely by observation would push History to 2 and IT to 1, betting the
whole revision plan on MPSC never asking them again. So each unit's new weight is
the mean of (a) what it is asked per 100 questions across the tagged sittings and
(b) its existing declared weight, which carries the original judgement that a
syllabus should cover breadth. Unit 11 has no prior estimate - it did not exist -
so it takes observation alone.

Totals are forced to exactly 100 by largest-remainder apportionment, because
every paper in syllabus.js has units summing to its paper total and GS is 1 mark
per question, so a unit's marks are also its expected question count.

RE-RUN THIS when a fourth sitting is tagged. It reads the staged tags files, so
it needs no argument beyond that.
"""

import argparse
import collections
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
SYLLABUS = ROOT / "public" / "mpsc-system-analyst" / "data" / "syllabus.js"
STAGED = HERE / "staged"
TAGS = ["gs-mes2025-tags.json", "gs-pe2023-tags.json", "gs-phe2024-tags.json"]

# The weights as first derived, before any paper existed to check them against.
# The blend is taken against THESE, not against whatever is currently in the
# file, so re-running the script is idempotent instead of drifting a little
# further toward observation on every run.
ORIGINAL = {"1": 12, "2": 12, "3": 10, "4": 10, "5": 8, "6": 12,
            "7": 10, "8": 8, "9": 12, "10": 6}


def load_js(path, name):
    m = re.search(rf"window\.{name}\s*=\s*([\[{{].*[\]}}])\s*;\s*$",
                  path.read_text(encoding="utf-8"), re.S)
    return json.loads(m.group(1))


def observed():
    c = collections.Counter()
    for f in TAGS:
        for t in json.load(open(STAGED / f, encoding="utf-8"))["tags"]:
            if t.get("unit"):
                c[t["unit"]] += 1
    return c


def apportion(shares, total=100):
    """Largest-remainder rounding so the result sums to `total` exactly."""
    floors = {k: int(v) for k, v in shares.items()}
    rem = total - sum(floors.values())
    order = sorted(shares, key=lambda k: shares[k] - floors[k], reverse=True)
    for k in order[:rem]:
        floors[k] += 1
    return floors


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true")
    args = ap.parse_args()

    syl = load_js(SYLLABUS, "SYLLABUS")
    gs = next(p for p in syl["papers"] if p["id"] == "GS")
    units = {u["no"]: u for u in gs["units"]}
    obs = observed()
    n = sum(obs.values())

    per100 = {u: 100 * obs.get(u, 0) / n for u in units}
    blend = {u: (per100[u] + ORIGINAL[u]) / 2 if u in ORIGINAL else per100[u]
             for u in units}
    scale = 100 / sum(blend.values())
    new = apportion({u: v * scale for u, v in blend.items()})

    print(f"Observed across {n} tagged questions in {len(TAGS)} sittings\n")
    print(f"{'unit':<46}{'now':>5}{'asked':>7}{'new':>5}{'move':>6}")
    for u in sorted(units, key=int):
        cur = units[u]["marks"]
        print(f"{u + ' ' + units[u]['title'][:42]:<46}{cur:>5}{per100[u]:>7.1f}"
              f"{new[u]:>5}{new[u] - cur:>+6}")
    print(f"\n{'total':<46}{sum(u['marks'] for u in gs['units']):>5}"
          f"{sum(per100.values()):>7.1f}{sum(new.values()):>5}")

    assert sum(new.values()) == 100, sum(new.values())
    assert all(v >= 1 for v in new.values()), new
    changed = {u: (units[u]["marks"], new[u]) for u in new if units[u]["marks"] != new[u]}

    if not args.write:
        print(f"\n{len(changed)} unit(s) would change — re-run with --write to apply")
        return

    text = SYLLABUS.read_text(encoding="utf-8")
    # rewrite only the marks line inside each GS unit block, located by title so
    # a unit in another paper with the same number is never touched
    for u in sorted(units, key=int):
        title = units[u]["title"]
        i = text.find(f'"title": "{title}"')
        if i < 0:
            raise SystemExit(f"cannot locate GS unit {u} by title {title!r}")
        seg = text[i:i + 220]
        new_seg, cnt = re.subn(r'"marks": \d+', f'"marks": {new[u]}', seg, count=1)
        if cnt != 1:
            raise SystemExit(f"no marks field found for GS unit {u}")
        text = text[:i] + new_seg + text[i + 220:]
    SYLLABUS.write_text(text, encoding="utf-8")

    check = next(p for p in load_js(SYLLABUS, "SYLLABUS")["papers"] if p["id"] == "GS")
    got = {u["no"]: u["marks"] for u in check["units"]}
    assert got == new, (got, new)
    assert sum(got.values()) == check["marks"]
    for p in load_js(SYLLABUS, "SYLLABUS")["papers"]:
        if "units" in p:
            assert sum(u["marks"] for u in p["units"]) == p["marks"], p["id"]
    print(f"\nwrote {SYLLABUS.relative_to(ROOT)} — {len(changed)} unit(s) changed, "
          f"all papers still sum to their totals")


if __name__ == "__main__":
    main()
