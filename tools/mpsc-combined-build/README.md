# MPSC Combined Prelims module data

The page at `/mpsc-combined-prelims` is built from the sibling
`mpsc-question-bank` archive. Run:

```sh
python3 tools/mpsc-combined-build/build.py
python3 -m unittest discover -s tools/mpsc-combined-build
```

`build.py` writes `src/data/banks/mpsc-combined-prelims.json` and copies the
selected source PDFs and 2023 final keys into `public/papers/mpsc-combined-prelims/`.
It is deterministic and safe to rerun. Update `SELECT` after auditing a new
paper's question numbers, options, and final key. A paper can be added for
browsing without a parsed final key; its answers stay unknown.

Current scope: 2023 Series A/B/D and 2025 Series A/B/C where the extract has a
complete paper, plus 2025 Paper II Series A/D. Series C of 2023 is excluded
because its paper extract is missing or partial. 2023 Paper II is readable
with source PDF and final key, but excluded from scored practice because the
legacy extract omitted its passage text and two questions per series. The
2025 final key PDF is present in the archive but has no usable parsed answer
map, so no 2025 answer is supplied. The timed view scores 2023 Paper I only,
with a clearly labelled practice timer and raw score.
