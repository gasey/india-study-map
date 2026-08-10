import { useState } from 'react';
import type { BankQuestion } from '@/data/banks/types';
import type { Correction } from '@/lib/mpscApi';
import { QuestionCard } from './QuestionCard';

interface PassageGroupProps {
  passage: string;
  questions: BankQuestion[];
  corrections?: Map<string, Correction>;
  showCorrections?: boolean;
}

/**
 * Groups multiple questions that share the same passage, displaying the passage
 * once at the top (collapsible) and all dependent questions below.
 * Used when 2+ questions reference the same comprehension/passage text.
 */
export function PassageGroup({ passage, questions, corrections, showCorrections }: PassageGroupProps) {
  const [expanded, setExpanded] = useState(false);

  if (questions.length === 0) return null;

  return (
    <div className="space-y-3 p-4 rounded-lg" style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
      {/* Passage header — collapsible */}
      <details open={expanded} onToggle={(e) => setExpanded(e.currentTarget.open)}>
        <summary
          className="text-xs font-semibold cursor-pointer select-none flex items-center gap-2 mb-3 pb-3"
          style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)' }}
        >
          <span>{expanded ? '▼' : '▶'}</span>
          <span>📄 Passage ({questions.length} question{questions.length === 1 ? '' : 's'})</span>
        </summary>
        <div className="mb-4 p-3 rounded" style={{ background: 'var(--bg-panel-elev)' }}>
          <p className="text-xs whitespace-pre-wrap" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {passage}
          </p>
        </div>
      </details>

      {/* All questions in this group */}
      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.id}>
            <QuestionCard
              q={q}
              correction={corrections?.get(q.id)}
              showAnswer={showCorrections ?? false}
              hidePassage
            />
          </div>
        ))}
      </div>
    </div>
  );
}
