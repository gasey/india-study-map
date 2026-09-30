import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/authStore';
import * as api from '@/lib/mpscApi';
import type { QuestionReport } from '@/lib/mpscApi';
import { BANK_ID } from './filters';

/**
 * Which questions the signed-in reader has flagged, and what came of it.
 *
 * Scoped to THIS reader's own reports, because that is the only report list a
 * non-admin account can read — `/api/questions/my-reports`. A bank-wide "what
 * has anyone flagged" view exists at `/api/admin/reports` and is gated on
 * `report.accept`, so showing it here would 403 for an ordinary learner and,
 * worse, would silently show nothing rather than say why.
 *
 * Returns a map keyed by questionId. A question flagged more than once keeps
 * the most RECENTLY created report: the status of the latest attempt is what
 * a reader wants to see, and an older rejected report would otherwise mask a
 * pending re-flag.
 */
export type FlagStatus = 'pending' | 'accepted' | 'rejected';

export interface FlagInfo {
  status: FlagStatus;
  issueType: string;
  createdAt: string;
  adminNote: string | null;
}

export function useFlags() {
  const user = useAuthStore((s) => s.user);
  const [flags, setFlags] = useState<Record<string, FlagInfo>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setFlags({});
      setLoaded(true);
      return;
    }
    let live = true;
    api.myReports(BANK_ID)
      .then((res: { reports: QuestionReport[] }) => {
        if (!live) return;
        const out: Record<string, FlagInfo> = {};
        for (const r of res.reports ?? []) {
          const prev = out[r.questionId];
          if (prev && prev.createdAt >= r.createdAt) continue;
          out[r.questionId] = {
            status: r.status,
            issueType: r.issueType,
            createdAt: r.createdAt,
            adminNote: r.adminNote,
          };
        }
        setFlags(out);
      })
      // A review service that is down must not take the question bank with
      // it: the bank is a static file and reads fine offline, so a failed
      // fetch leaves the flags empty and everything else keeps working.
      .catch(() => { if (live) setFlags({}); })
      .finally(() => { if (live) setLoaded(true); });
    return () => { live = false; };
  }, [user]);

  return { flags, loaded, signedIn: !!user };
}
