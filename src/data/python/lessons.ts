// ============================================
// PYTHON — 6-stage path, real content (not filler). Stages 5-6 quote real
// functions from the user's own MPSC extraction pipeline
// (~/Downloads/mpsc_classify.py, mpsc_merge.py) rather than invented
// examples — per the user's own instruction to source lesson material from
// their own scripts. No MCQ-drill-via-Question-Bank-filter here: the real
// bank has zero questions tagged for programming/Python (checked directly
// against the live DB — subjects are gk/english/polity/reasoning/
// current-affairs/history/geography/chemistry, nothing else), so filtering
// into it the way build-order.md §7.1 describes would show an empty result.
// The quizzes below are small, locally-authored MCQ sets instead — clearly
// a different, honest data source, not a second competing "engine": no
// scoring, palette, or timer, just a lightweight card list (see
// src/components/shared/MiniQuiz.tsx, shared with Postgres and Nihongo).
// ============================================
import type { QuizQuestion } from '@/lib/quizTypes';

export interface PyStage {
  id: string;
  title: string;
  blurb: string;
  notes: string[];
  code?: { label: string; source?: string; snippet: string };
  quiz: QuizQuestion[];
}

export const pyStages: PyStage[] = [
  {
    id: 'basics',
    title: '1. Variables & types',
    blurb: 'Names, values, and the four types you\'ll use constantly.',
    notes: [
      'A variable is just a name pointing at a value — `x = 5` doesn\'t declare a type, Python figures it out.',
      'Core types: `int` (5), `float` (5.0), `str` ("five"), `bool` (True/False).',
      '`type(x)` tells you what you actually have — reach for it when something looks wrong.',
      'f-strings (`f"{x} items"`) are the normal way to build strings from variables — clearer than `+` concatenation.',
    ],
    code: {
      label: 'A few real lines',
      snippet: `count = 27318\nlabel = f"{count} questions extracted"\nis_done = count > 25000\nprint(label, is_done)`,
    },
    quiz: [
      { q: 'What does `type(5.0)` return?', options: ['int', 'float', 'str', 'bool'], answerIndex: 1, explanation: 'Any number written with a decimal point is a float, even 5.0.' },
      { q: 'Which is a valid f-string?', options: ['f"{x + 1}"', "f'x + 1'", '"f{x+1}"', 'fstring(x+1)'], answerIndex: 0, explanation: 'f-strings evaluate expressions inside `{}` — the f prefix and quotes are required together.' },
      { q: '`bool(0)` evaluates to:', options: ['True', 'False', '0', 'Error'], answerIndex: 1, explanation: '0, 0.0, "", None, and empty collections are all falsy in Python.' },
    ],
  },
  {
    id: 'control-flow',
    title: '2. Control flow',
    blurb: '`if`/`elif`/`else`, `for`, `while` — how a script makes decisions and repeats work.',
    notes: [
      'Indentation is the block delimiter — no `{}`, no `end`. Get the indent wrong and Python won\'t run.',
      '`for x in some_list:` walks every item; `for i, x in enumerate(some_list):` gives you the index too.',
      '`while condition:` repeats until the condition is false — used for "keep going until done", not "for each item".',
      '`continue` skips to the next loop iteration; `break` exits the loop entirely.',
    ],
    code: {
      label: 'From mpsc_classify.py\'s spirit',
      source: '~/Downloads/mpsc_classify.py',
      snippet: `for keyword in NON_PAPER_KEYWORDS:\n    if keyword in filename.lower():\n        return "not_a_paper"\nreturn "paper"`,
    },
    quiz: [
      { q: 'What ends a Python code block?', options: ['A closing brace `}`', 'The keyword `end`', 'Returning to the previous indentation level', 'A semicolon'], answerIndex: 2, explanation: 'Python uses indentation, not braces or keywords, to mark where a block ends.' },
      { q: '`for i, x in enumerate(items):` gives you:', options: ['Just the index', 'Just the value', 'Both index and value', 'A syntax error'], answerIndex: 2, explanation: '`enumerate()` pairs each item with its position, unpacked as `i, x`.' },
      { q: 'Inside a loop, `continue` does what?', options: ['Exits the loop', 'Skips to the next iteration', 'Restarts the whole script', 'Pauses execution'], answerIndex: 1, explanation: '`continue` jumps straight to the next loop iteration, skipping the rest of the current one.' },
    ],
  },
  {
    id: 'functions',
    title: '3. Functions',
    blurb: 'Packaging logic so you write it once and call it everywhere.',
    notes: [
      '`def name(params):` starts a function; `return value` sends a result back to the caller.',
      'A docstring (`"""like this"""` right after `def`) documents what the function does — real scripts lean on this heavily.',
      'Default arguments (`def f(x, limit=10):`) let a caller skip parameters they don\'t need to change.',
      'Type hints (`def f(x: int) -> str:`) are optional but make intent explicit — common in real codebases.',
    ],
    code: {
      label: 'A real function, unedited',
      source: '~/Downloads/mpsc_merge.py',
      snippet: `def stem_hash(question_text: str) -> str:\n    """Normalize question text to a stable hash for deduplication."""\n    norm = re.sub(r'\\s+', ' ', question_text.strip().lower())\n    return hashlib.sha1(norm.encode()).hexdigest()[:16]`,
    },
    quiz: [
      { q: 'What does `return` do inside a function?', options: ['Prints a value', 'Sends a value back to the caller and exits the function', 'Deletes a variable', 'Restarts the function'], answerIndex: 1, explanation: 'The function stops running at `return` and the caller receives that value.' },
      { q: 'In `def f(x, limit=10):`, what is `limit`?', options: ['A required argument', 'A default argument — optional when calling f', 'A return type', 'A global variable'], answerIndex: 1, explanation: 'A parameter with `=value` becomes optional; the caller can omit it and get 10.' },
      { q: 'What does a docstring do?', options: ["Nothing, it's just a comment style", 'Documents the function, readable via help() or tooling', 'Makes the function run faster', 'Declares the return type'], answerIndex: 1, explanation: "It's a real string object attached to the function, used by documentation tools and help()." },
    ],
  },
  {
    id: 'data-structures',
    title: '4. Data structures',
    blurb: 'Lists, dicts, and sets — the containers almost every real script is built on.',
    notes: [
      'A list (`[1, 2, 3]`) is ordered and mutable — append, index, slice.',
      'A dict (`{"key": "value"}`) maps keys to values — the workhorse for structured data (this whole app\'s question objects are dicts/JSON under the hood).',
      'A set (`{1, 2, 3}`) holds unique values only — good for dedup, exactly what mpsc_merge.py uses `seen_papers = set()` for.',
      '`dict.get(key, default)` reads a key without crashing if it\'s missing — safer than `dict[key]` when data is messy.',
    ],
    code: {
      label: 'From mpsc_merge.py',
      source: '~/Downloads/mpsc_merge.py',
      snippet: `all_papers = {}   # by id\nall_questions = {}   # by stem_hash, keep the first occurrence\nseen_papers = set()`,
    },
    quiz: [
      { q: 'Which container holds only unique values?', options: ['list', 'dict', 'set', 'str'], answerIndex: 2, explanation: 'A set automatically drops duplicates — adding an existing value does nothing.' },
      { q: '`d.get("year", 0)` when "year" is missing returns:', options: ['A crash (KeyError)', '0', 'None always', 'An empty string'], answerIndex: 1, explanation: 'The second argument to .get() is the fallback used when the key is absent.' },
      { q: 'What is `{"id": "p1", "year": 2019}` an example of?', options: ['A list', 'A tuple', 'A dict', 'A set'], answerIndex: 2, explanation: "Curly braces with key: value pairs — that's a dict." },
    ],
  },
  {
    id: 'files-json',
    title: '5. Files & JSON',
    blurb: 'Reading/writing data on disk — how every extraction batch in this project actually moves.',
    notes: [
      '`with open(path) as f:` opens a file and guarantees it closes afterward, even if something goes wrong inside.',
      '`json.load(f)` reads a JSON file straight into Python dicts/lists; `json.dump(data, f)` writes it back out.',
      'Real pipelines wrap file reads in `try/except` — a corrupted or half-written batch file shouldn\'t crash the whole run.',
      '`glob.glob(pattern)` finds every file matching a pattern (e.g. `"mpsc_batch*_out*.json"`) — how mpsc_merge.py finds every batch to combine.',
    ],
    code: {
      label: 'From mpsc_merge.py, real error handling',
      source: '~/Downloads/mpsc_merge.py',
      snippet: `for batch_file in sorted(glob.glob(batch_pattern)):\n    try:\n        with open(batch_file, 'r', encoding='utf-8') as f:\n            batch = json.load(f)\n    except (json.JSONDecodeError, FileNotFoundError) as e:\n        print(f"  WARNING: {e}")\n        continue`,
    },
    quiz: [
      { q: 'Why use `with open(path) as f:` instead of `f = open(path)`?', options: ['It\'s faster', 'The file closes automatically, even on error', 'It reads JSON automatically', 'There\'s no difference'], answerIndex: 1, explanation: 'The `with` block guarantees cleanup (closing the file) runs no matter how the block exits.' },
      { q: '`json.load(f)` on a valid JSON file returns:', options: ['A string of raw text', 'Python dicts/lists matching the JSON structure', 'A file handle', 'Nothing, it writes instead'], answerIndex: 1, explanation: 'json.load parses the file content into native Python objects — objects become dicts, arrays become lists.' },
      { q: 'What does catching `except (json.JSONDecodeError, FileNotFoundError):` protect against?', options: ['Slow disks', 'A bad/missing file crashing the whole batch run', 'Running out of memory', 'Network errors'], answerIndex: 1, explanation: 'One corrupted or missing batch file shouldn\'t stop every other file in the run from processing.' },
    ],
  },
  {
    id: 'real-project',
    title: '6. Real project — read your own pipeline',
    blurb: 'Everything above is real code from the same MPSC extraction pipeline that built this app\'s question bank. Go read the source.',
    notes: [
      '`~/Downloads/mpsc_classify.py` — pure regex classification, zero API cost, decides which PDFs are worth paying for extraction on.',
      '`~/Downloads/mpsc_merge.py` — dedups extraction batches by a content hash and writes both the frontend JSON and the Postgres INSERT statements.',
      '`~/Downloads/mpsc_canonical_pipeline.py` — the orchestrator: build-manifest → validate → extract, the same shape as this admin console\'s own dry-run → apply → rollback Import pipeline.',
      'Reading real, working code you already trust (because it built the data you\'re studying from) is a better second step than another toy exercise.',
    ],
    quiz: [],
  },
];
