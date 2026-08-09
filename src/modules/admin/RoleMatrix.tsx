// ============================================
// RoleMatrix — per components.md: real <table>, capability rows x role
// columns, min-width 900px with horizontal scroll below that.
//
// Two deliberate departures from the literal spec, both because the spec
// predates the actual Phase 3 RBAC build and describes a system this app
// doesn't have:
//   - "7 role columns" -> the real RANK ladder (auth.py) has 6 ranks,
//     learner..owner. Using a real 6 beats inventing a 7th to match a
//     stale number.
//   - "● full / ◐ scoped / · none" -> this app's has_cap() is rank-additive
//     and binary (a role either meets a capability's rank or doesn't);
//     there is no partial/"scoped" state in the real model. Rendering a ◐
//     that doesn't correspond to any real backend behavior would just be
//     decoration standing in for a fact — dropped, using only ●/· .
//
// The CAPS map mirrors auth.py exactly (backend is the source of truth;
// this frontend copy is display-only, never used for an actual permission
// decision) — keep the two in sync by hand if a capability is added there.
// ============================================

const ROLES = ['learner', 'moderator', 'reviewer', 'editor', 'admin', 'owner'] as const;
const RANK: Record<(typeof ROLES)[number], number> = { learner: 1, moderator: 2, reviewer: 3, editor: 4, admin: 5, owner: 6 };

const CAPS: { cap: string; rank: number; label: string }[] = [
  { cap: 'question.read', rank: 0, label: 'Read questions' },
  { cap: 'attempt.write', rank: 1, label: 'Record attempts' },
  { cap: 'comment.create', rank: 1, label: 'Post comments' },
  { cap: 'comment.edit_own', rank: 1, label: 'Edit own comment' },
  { cap: 'comment.delete_own', rank: 1, label: 'Delete own comment' },
  { cap: 'report.create', rank: 1, label: 'File a report' },
  { cap: 'note.write', rank: 1, label: 'Write private notes' },
  { cap: 'report.reject', rank: 2, label: 'Reject reports' },
  { cap: 'comment.moderate', rank: 2, label: 'Moderate comments' },
  { cap: 'report.accept', rank: 3, label: 'Accept reports' },
  { cap: 'verification.review', rank: 3, label: 'Review verification queue' },
  { cap: 'correction.write', rank: 4, label: 'Write corrections' },
  { cap: 'static_set.write', rank: 4, label: 'Edit static sets' },
  { cap: 'import.run', rank: 4, label: 'Run imports' },
  { cap: 'test.publish', rank: 4, label: 'Publish tests' },
  { cap: 'flag.write', rank: 5, label: 'Toggle feature flags' },
  { cap: 'admin.stats', rank: 5, label: 'View admin dashboard' },
  { cap: 'audit.read', rank: 5, label: 'Read audit log' },
  { cap: 'user.read', rank: 5, label: 'List users' },
  { cap: 'user.role.assign', rank: 6, label: 'Assign roles' },
];

export function RoleMatrix() {
  return (
    <div className="overflow-x-auto">
      <table className="text-sm" style={{ minWidth: 900, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th className="text-left py-2 pr-3 text-xs font-semibold" style={{ width: 190, color: 'var(--text-secondary)' }}>Capability</th>
            {ROLES.map((r) => (
              <th key={r} className="text-center py-2 px-2 text-xs font-semibold capitalize" style={{ color: 'var(--text-secondary)' }}>{r}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CAPS.map((c) => (
            <tr key={c.cap} style={{ borderBottom: '1px solid var(--border)' }}>
              <td className="py-2 pr-3">
                <div style={{ color: 'var(--text-primary)' }}>{c.label}</div>
                <div className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>{c.cap}</div>
              </td>
              {ROLES.map((r) => (
                <td key={r} className="text-center py-2 px-2">
                  <span style={{ color: RANK[r] >= c.rank ? 'var(--ok)' : 'var(--line-strong)' }}>
                    {RANK[r] >= c.rank ? '●' : '·'}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
