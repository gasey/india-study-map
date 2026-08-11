import { useState } from 'react';
import { KANA, type KanaGroup } from '@/data/kana';
import { KanaQuiz } from './KanaQuiz';

type Script = 'hira' | 'kata';
type Mode = 'browse' | 'quiz';

function Seg<T extends string>({ value, set, options }: { value: T; set: (v: T) => void; options: [T, string][] }) {
  return (
    <div className="inline-flex rounded-lg p-1 gap-0.5" style={{ background: 'var(--bg-panel-elev)', border: '1px solid var(--border)' }}>
      {options.map(([v, label]) => {
        const on = value === v;
        return (
          <button
            key={v}
            onClick={() => set(v)}
            className="px-3 py-1 rounded-md text-xs font-medium"
            style={{ background: on ? 'var(--accent-soft)' : 'transparent', color: on ? 'var(--accent)' : 'var(--text-secondary)' }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function KanaChart() {
  const [script, setScript] = useState<Script>('hira');
  const [group, setGroup] = useState<KanaGroup | 'all'>('base');
  const [mode, setMode] = useState<Mode>('browse');
  const rows = KANA.filter((k) => group === 'all' || k[3] === group);
  const idx = script === 'hira' ? 0 : 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 items-center">
        <Seg value={script} set={setScript} options={[['hira', 'ひらがな'], ['kata', 'カタカナ']]} />
        <Seg value={group} set={setGroup} options={[['base', 'Basic'], ['dakuten', 'Dakuten'], ['yoon', 'Combo'], ['all', 'All']]} />
        <div className="ml-auto">
          <Seg value={mode} set={setMode} options={[['browse', 'Browse'], ['quiz', 'Quiz']]} />
        </div>
      </div>

      {mode === 'browse' ? (
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))' }}>
          {rows.map((k) => (
            <div key={k[2] + k[idx]} className="rounded-lg p-2 flex flex-col items-center gap-0.5"
              style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: 26, lineHeight: 1.1, color: 'var(--text-primary)' }}>{k[idx]}</span>
              <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{k[2]}</span>
            </div>
          ))}
        </div>
      ) : (
        <KanaQuiz rows={rows} script={script} />
      )}
    </div>
  );
}
