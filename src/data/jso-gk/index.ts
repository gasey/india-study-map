// ============================================
// Current Affairs & GK question pool for the Question Bank tab — flattens
// the 6 mpsc-jso-prep Paper II GK/Current-Affairs unit files (converted to
// real ES modules, see the sibling *.ts files) into one filterable list.
// ============================================

import type { JsoUnit } from './types';
import currentEvents from './p2-current-events';
import historyGeography from './p2-history-geography';
import polityEconomy from './p2-polity-economy';
import environmentScience from './p2-environment-science';
import mizoram from './p2gk-mizoram';
import verified from './p2gk-verified';

export interface GkQuestion {
  id: string;
  topic: string;
  q: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  examName: string;
  year: string | null;
}

const ALL_UNITS: JsoUnit[] = [
  ...currentEvents,
  ...historyGeography,
  ...polityEconomy,
  ...environmentScience,
  ...mizoram,
  ...verified,
];

/** Pulls exam name + year out of a question's explanation HTML, e.g.
 *  `<p class="src">Source: General Studies Paper-I - Inspector of
 *  Excise-2025., Q2.</p>` -> { examName: 'General Studies Paper-I -
 *  Inspector of Excise', year: '2025' }. Authored (non-mined) questions
 *  have no such tag and fall back to 'Authored (syllabus)' / null. */
function parseProvenance(html: string): { examName: string; year: string | null } {
  const m = /Source:\s*([^<]*)</.exec(html || '');
  if (!m) return { examName: 'Authored (syllabus)', year: null };
  const raw = m[1];
  const yearMatch = /(20\d{2})/.exec(raw);
  const year = yearMatch ? yearMatch[1] : null;
  const examName = raw.split(',')[0].replace(/[-\s]*\d{4}\.?$/, '').trim() || 'MPSC past paper';
  return { examName, year };
}

export const gkQuestions: GkQuestion[] = ALL_UNITS.flatMap((u) =>
  (u.questions ?? []).map((q, i) => {
    const prov = parseProvenance(q.e);
    return {
      id: `${u.id}-${i}`,
      topic: u.title,
      q: q.q,
      options: q.o,
      answerIndex: q.a,
      explanation: q.e,
      examName: prov.examName,
      year: prov.year,
    };
  }),
);
