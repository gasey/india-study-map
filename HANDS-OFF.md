# Daily Current Affairs — hands-off operations guide

What runs on its own, what still needs you, and why. See `DEVLOG.md` for
the full build history if you want the blow-by-blow of how this was made.

---

## What's fully automatic

Every day at **6:00 AM IST** (`.github/workflows/current-affairs.yml`,
cron `30 0 * * *` UTC), GitHub Actions:

1. Fetches today's India news (politics, world, business, science,
   environment) from NewsData.io.
2. Summarizes it and writes key facts via Gemini, with Groq as a fallback
   if Gemini errors.
3. Generates ~15 MCQs from that summary, matching the exact schema
   `src/modules/current-affairs/types.ts` expects.
4. Writes `public/data/current-affairs/{today}.json`, updates `index.json`.
5. Pushes all of that to a branch called `current-affairs/auto-update`.

None of this touches `main`, and nothing deploys yet at this point.

## What still needs you — and why

**Two clicks, once a day:**

1. Open `github.com/gasey/india-study-map` — GitHub shows a
   **"Compare & pull request"** banner for `current-affairs/auto-update`.
   Click it. (If yesterday's PR is still open when today's run happens,
   it just adds a new commit to that same PR — no new click needed that
   day.)
2. **Read the generated MCQs**, then merge.

Step 2 is deliberate, not a limitation: this is LLM-generated content
that a student will actually be quizzed on, and nothing has verified it's
factually correct yet. The merge is the point where a human looks at it
once before it goes live. Once merged, Vercel's normal deploy picks it up
automatically — no extra step there.

Step 1 is a limitation, not a choice — see below.

## Why step 1 isn't automatic (and how it could be)

The workflow tried to open the PR itself two different ways, both of
which failed at the exact same point:

- The repo's own **Settings → Actions → General → "Allow GitHub Actions
  to create and approve pull requests"** toggle — saved fine, then
  silently reverted every time on reload (tested 3 times).
- A fine-grained personal access token (`GH_PAT` secret) with
  `Pull requests: write` — got `Resource not accessible by personal
  access token` specifically on the create-PR API call, even though the
  same token's branch **push** succeeded fine.

Same failure point both times, with two different token types — that
pattern points to an **org/enterprise-level policy** tied to your GitHub
account overriding repo-level settings, not a misconfiguration in this
repo. If you have access to check that (or know who administers it),
fixing it there would restore fully automatic PR creation and this would
drop to one click a day (just the merge).

## If you want zero clicks a day

Possible, but it means removing the review gate entirely — the workflow
would push straight to `main` and unread AI-generated content goes live
within minutes. I'd recommend against it, but if you want it:

Edit `.github/workflows/current-affairs.yml`'s last step to push directly
to `main` instead of `current-affairs/auto-update`, and drop the branch
name from the URL. Ask me to make this change if you decide you want it
— I won't do it without you explicitly saying so, same as everything else
in this pipeline that touches real content or credentials.

## Secrets this depends on

Four repo secrets (Settings → Secrets and variables → Actions), all
already set:

| Secret | What it's for |
|---|---|
| `NEWSDATA_API_KEY` | News fetch |
| `GEMINI_API_KEY` | Summarization + MCQ generation (primary) |
| `GROQ_API_KEY` | Same, fallback if Gemini errors |
| `GH_PAT` | Pushes the `current-affairs/auto-update` branch (Contents: read/write) |

If any of these ever get rotated/regenerated, update the corresponding
secret — the workflow itself doesn't need to change.

## Troubleshooting

Check **Actions → Daily Current Affairs** for the latest run's logs.
Known past failure modes (all fixed, listed here in case something
similar recurs after an API changes shape again):

- `newsdata_http_error: 422` — NewsData.io's free tier caps categories at
  5 per query.
- Gemini `404 ... no longer available to new users` — a pinned model
  name (e.g. `gemini-2.5-flash`) got deprecated for this API key;
  `gemini-flash-latest` is used instead specifically to avoid this.
- `summary_parse_failed` / `mcq_parse_failed` — the LLM's response wasn't
  valid JSON. Both providers are asked for structured JSON output
  explicitly now (`responseMimeType`/`response_format`) to prevent this,
  but if a provider changes how that works, this is where it'd show up
  again.
- `Resource not accessible by personal access token` on PR creation —
  see the section above; this is now sidestepped entirely, not fixed.

## Manual test run

**Actions → Daily Current Affairs → Run workflow** triggers it on demand
without waiting for the schedule — useful for testing after any change to
`tools/current-affairs/build.mjs` or the workflow file.
