# Combined Prelims data build

The module at `/mpsc-combined-prelims` uses the sibling `mpsc-question-bank`
archive. From this repository, run:

```sh
python3 tools/mpsc-combined-build/build.py
python3 -m unittest discover -s tools/mpsc-combined-build
npm run build
```

The build includes all 36 archived MCS Combined Prelims paper PDFs from
2014, 2016, 2021, 2023, 2024 and 2025. It uses existing parsed rows where
coverage is high, and the archive's OCR sidecars for otherwise missing
scanned papers. OCR items have unverified numbering and low confidence; they
must be checked against their source PDF before use as authoritative data.
The UI reports each paper's extraction coverage. Do not treat 3,292 extracted
rows as 3,600 verified questions.

The 2023 final key has parsed answers, but only complete, valid Paper I items
are scored. Official 2024/2025 final-key PDFs are scanned; unambiguous OCR
cells are shown as provisional official-key OCR and are not scored. They are
matched only to questions whose printed number came from the legacy bank.
For OCR questions, a visible candidate answer can be shown when OCR found a
printed question number, but it stays unverified and unscored.
No official key was found in the local archive for 2014, 2016, or 2021.
The build never uses a derived answer as an official answer.

`model-queue.jsonl` contains every extracted question, including those with
an official answer, so a cheaper model can independently solve and compare.
Send those rows to a model after reviewing OCR items against the source PDF.
To import results, create `derived-answers.jsonl` in this directory, one
JSON object per line:

```json
{"id":"mcs-2021-i-q001","answer":"B","model":"your-model-name","explanation":"Reason for B"}
```

`id`, `answer` (A–D), and `model` are required. Rebuild to show these
answers beside the official key in the UI. The builder rejects duplicate or
unknown IDs. A disagreement remains visible for human review; derived answers
do not change scored practice.

The builder copies source and key PDFs into `public/papers/mpsc-combined-prelims`,
writes the versioned bank JSON, and regenerates the model queue. Rerunning it
is deterministic. Subject tags are keyword based and marked provisional.
