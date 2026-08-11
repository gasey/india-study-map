# Jabreeze redesign — Phase 3 (RBAC extension) — continuation brief

Paste this into a new chat to resume. It's self-contained — no need to re-read prior
conversation history.

## What this is

`map.hawayu.in` (=the `india-study-map` React/Vite app,
`/home/hruaia/workspace/projects/personal/india-study-map`) is mid-redesign per a
handoff doc ("Jabreeze") living at
`~/Downloads/Hawayu Website Redesign (2)/handoff/`. The redesign is split into 8 phases
(`build-order.md`). **Phases 1 and 2 are done and verified.** This document is the
handoff for **Phase 3**, which is backend-only and has not been implemented yet.

- **Phase 1 (design tokens)** — shipped: `src/styles/tokens.css`/`motion.css` added,
  `globals.css` reconciled onto them for the light theme (verified byte-exact), dark
  theme deliberately kept on its own literal palette (tokens.css's ink theme didn't
  actually match closely enough — this was caught live, not assumed).
- **Phase 2 (shell rebuild)** — shipped: new persistent `<Rail/>` (76px, 8 items + More
  flyout + pinned Admin + Avatar), new `<AppHeader/>`, 3 new pages, `shellStyle` system
  fully removed. Verified live in the browser, `tsc`+`build` clean.
- Full history and the reasoning behind various judgment calls: see memory file
  `hawayu-jabreeze-redesign-handoff.md` (if this new chat has access to the same memory
  store — `~/.claude/projects/-home-hruaia-workspace-projects-work/memory/`). If not,
  everything you need for Phase 3 specifically is below.

## Why Phase 3 shrank from what the handoff doc originally specified

The handoff's `api-contract.md` assumed one Django backend (`mpsc-api` on Render) that
needed new `Correction`/`Report`/`Comment`/`AuditLog`/`Profile` tables and a 7-role RBAC
system built from scratch. Direct investigation found:

1. A **second**, already-deployed FastAPI backend exists on a droplet (`shiksha-dev`,
   SSH access available) with almost exactly that review/RBAC/audit system already
   built — bank-agnostic (`bank_id text + question_id text` keying, no FK into any
   specific questions table). **User chose to extend this instead of building a
   parallel system in Django.**
2. The Django/Render backend the handoff assumed was live is actually **abandoned**
   (confirmed via the droplet's own `~/mpsc_api/WIP.md` and directly by the user
   2026-08-09) — Render's free tier couldn't handle the data volume, so the full
   73,405-question batch was merged straight into the droplet's existing Postgres
   instead (now 76,093 rows total: old 164-paper/6,380-question curated set + new
   1,899-paper/73,405-question batch, no ID collisions by construction). This is
   already served to the frontend via the existing `/api/mpsc/bank` endpoint with
   **zero frontend code changes** (it already pointed there).
3. The originally-scoped "wire a new `bank_id` for the merged bank into the review
   system" turned out to be **already done** — the frontend already tags everything
   under one `bank_id = 'mpsc-old-questions'`
   (`india-study-map/src/modules/mpsc/useMpscData.ts:18`), regardless of which of the
   two merged batches a question actually came from. Nothing to wire.

**Net result, confirmed with the user: Phase 3 is now just the RBAC extension.** A real
gap this investigation surfaced — `/api/mpsc/bank` returns the whole ~41MB dataset in
one uncached, unfiltered response, no server-side pagination/filtering exists at all —
is **explicitly deferred**, not part of this phase (confirmed with user: "RBAC only for
now").

## Access

- SSH: `ssh shiksha-dev` (config alias already set up in `~/.ssh/config`, points at
  `134.209.154.122`). Code lives at `~/mpsc_api` on that box (`main.py`, `auth.py`,
  `db.py`, plus `migrate_v2.sql` as the existing migration-style reference).
- DB: Postgres `mpsc_study`, connected via `db.py`'s `get_conn()`, which reads
  `MPSC_DB_DSN`/`MPSC_DB_PASSWORD` from `~/mpsc_api/mpsc_api.env` on the droplet. To run
  a one-off Python/SQL check over SSH:
  ```bash
  ssh shiksha-dev "cd ~/mpsc_api && set -a && source mpsc_api.env && set +a && source venv/bin/activate && python3 -c \"...\""
  ```
- Existing users table has 4 seeded accounts, **all currently `role='admin'`**:
  `gasey`, `admin1`, `admin2`, `admin3`. `role` is a plain-text column (confirmed no
  existing CHECK constraint or enum type as of 2026-08-09 — **re-verify with
  `\d users` before migrating**, in case anything changed).

## Confirmed decisions (do not re-ask, already approved)

1. **Role mapping**: `gasey → owner` (gains the ability to assign roles to others).
   `admin1`/`admin2`/`admin3` **stay `admin`** — they keep every other admin power
   (triage, corrections, stats, audit, comment moderation, users list) but **lose**
   `user.role.assign`. This is a real, hard-to-reverse permission change to 3 live
   accounts — already explicitly approved by the user, don't re-litigate, but do
   mention it's happened when you report back.
2. **Guest signup stays invite-only.** No public `/api/auth/register` endpoint.
   Accounts are still only created by an admin/owner via direct DB insert (the
   existing `seed_accounts.py` pattern). Unauthenticated requests are the `guest` tier
   (rank 0, `question.read` only) purely in code — never a stored role.
3. **No Django/Render work.** That backend is dead; don't touch it, don't build
   against it.
4. **No new `bank_id` wiring.** Already covered (see above).
5. **No filtering/pagination rebuild.** Deferred to a separate future phase.

## The concrete design (ready to implement, not yet applied)

### 1. Role model — pure rank-additive (matches this codebase's hand-rolled, no-ORM style)

Add to `~/mpsc_api/auth.py`:

```python
RANK = {"learner": 1, "moderator": 2, "reviewer": 3, "editor": 4, "admin": 5, "owner": 6}
# guest = unauthenticated, rank 0, computed only — never a stored role.

CAPS = {
    "question.read": 0, "attempt.write": 1, "comment.create": 1, "comment.edit_own": 1,
    "comment.delete_own": 1, "report.create": 1, "note.write": 1,
    "report.reject": 2, "comment.moderate": 2,
    "report.accept": 3, "verification.review": 3,
    "correction.write": 4, "static_set.write": 4, "import.run": 4,
    "flag.write": 5, "admin.stats": 5, "audit.read": 5, "user.read": 5,
    "user.role.assign": 6,
}

def rank_of(role): return RANK.get(role, 0)
def has_cap(role, cap): return rank_of(role) >= CAPS[cap]
def capabilities_for(role): return sorted(c for c, r in CAPS.items() if rank_of(role) >= r)

def require_cap(cap: str):
    def _dep(user = Depends(get_current_user)):
        if not has_cap(user["role"], cap):
            raise HTTPException(status_code=403, detail=f"missing capability: {cap}")
        return user
    return _dep

# Keep require_admin as a thin alias (rank >= 5) so nothing breaks mid-migration:
def require_admin(user = Depends(get_current_user)):
    if rank_of(user["role"]) < RANK["admin"]:
        raise HTTPException(status_code=403, detail="admin required")
    return user
```

### 2. DB migration — `migrate_v3.sql` (same style as the existing `migrate_v2.sql`)

```sql
BEGIN;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('learner','moderator','reviewer','editor','admin','owner'));
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'learner';
UPDATE users SET role = 'owner' WHERE username = 'gasey';
COMMIT;
```

**Verify first**: `ssh shiksha-dev` then `psql` (or the Python one-liner pattern above)
→ `\d users` to confirm `role` is still a plain varchar with no conflicting constraint.

### 3. `main.py` call-site remapping

Every current `Depends(require_admin)` site stays admin/owner-callable unchanged
(swap in the matching `require_cap(...)` — zero breakage, since admin/owner rank ≥
every cap except `user.role.assign`). Every current bare `Depends(get_current_user)`
site gets its matching cap too.

| Endpoint (as it exists in `main.py` today) | Old gate | New gate |
|---|---|---|
| bulk report accept/reject | `require_admin` | `require_cap("report.accept")` / `require_cap("report.reject")` per action |
| upsert correction (`/api/admin/corrections`) | `require_admin` | `require_cap("correction.write")` |
| pin comment | `require_admin` | `require_cap("comment.moderate")` |
| delete others' comment | `require_admin` (owner-or-admin check) | owner-or-`comment.moderate` |
| `/api/admin/stats` | `require_admin` | `require_cap("admin.stats")` |
| `/api/admin/audit-log` | `require_admin` | `require_cap("audit.read")` |
| `/api/admin/users` | `require_admin` | `require_cap("user.read")` |
| change a user's role | *(new endpoint — doesn't exist yet)* | `require_cap("user.role.assign")` — **must audit-log**, including the grant of the actor's own role |
| submit report / create comment / edit-own / delete-own / write note / mock attempt | bare `get_current_user` | matching `report.create`/`comment.create`/`comment.edit_own`/`comment.delete_own`/`note.write`/`attempt.write` |

`/api/auth/me` response should gain `capabilities: capabilities_for(user["role"])`.
**Do not touch the frontend's own `useAuthStore`/`AdminNavMenu` gate** — Phase 2 kept
its existing `role !== 'admin'` check verbatim on purpose, and rewiring it to read
`capabilities[]` is out of scope for this pass (don't couple the two phases).

## Verification (do this after implementing, before calling it done)

Over SSH:
1. `\d users` before migrating — confirm no surprises.
2. Run `migrate_v3.sql`.
3. Log in as each of the 4 seeded accounts (`gasey`, `admin1`, `admin2`, `admin3`) and
   confirm:
   - All 4 still hit every endpoint they could before (no regressions from the
     `require_admin`→`require_cap` swap).
   - Only `gasey` can call the new role-assign endpoint; `admin1/2/3` get a 403.
   - `/api/auth/me` returns the expected `capabilities[]` list for each role.
4. Confirm existing frontend flows still work end-to-end against the live droplet:
   file a report, add a comment, write a note, record a mock attempt (all as a
   logged-in learner-tier — but note there are no learner-tier accounts yet, since all
   4 existing accounts are admin/owner; you may need to seed a throwaway `learner`
   account via `seed_accounts.py` to actually exercise the low-rank caps, then decide
   whether to keep or delete it after testing).

## Files you'll touch

- `~/mpsc_api/auth.py` (droplet) — add `RANK`/`CAPS`/`require_cap`, keep `require_admin`
  as an alias.
- `~/mpsc_api/main.py` (droplet) — call-site remapping per the table above, new
  role-assign endpoint, `/api/auth/me` capabilities field.
- New file `~/mpsc_api/migrate_v3.sql` (droplet).

Nothing in the `india-study-map` frontend repo needs to change for this phase.
