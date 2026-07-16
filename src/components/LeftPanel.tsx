import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { chapters } from '@/data';
import { baseLayers } from '@/data/baseLayers';
import { useApp } from '@/lib/store';
import type { Chapter, Layer } from '@/types';

interface LeftPanelProps {
  chapter: Chapter;
  /** Render without the docked column chrome — used inside a floating card (shell style 1c). */
  floating?: boolean;
}

function LayerToggle({ layer, on, onToggle }: { layer: Layer; on: boolean; onToggle: () => void }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <button
        type="button"
        onClick={onToggle}
        className={`mt-0.5 w-[42px] h-6 rounded-full relative transition-colors shrink-0 ${
          on ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
        }`}
        aria-pressed={on}
      >
        <motion.span
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
          animate={{ x: on ? 18 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {layer.name}
        </div>
        {layer.description && (
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {layer.description}
          </div>
        )}
      </div>
    </label>
  );
}

export function LeftPanel({ chapter, floating }: LeftPanelProps) {
  const {
    currentChapterId,
    setChapter,
    activeLayerIds,
    toggleLayer,
    activeBaseLayerIds,
    toggleBaseLayer,
  } = useApp();

  return (
    <aside className={floating ? 'h-full w-full overflow-hidden flex flex-col' : 'surface w-72 h-full shrink-0 border-r flex flex-col overflow-hidden'} style={floating ? { background: 'var(--bg-panel)' } : undefined}>
      {/* Header */}
      <div className="px-5 py-5 border-b border-themed">
        <div className="label-eyebrow mb-1">Bhārat Atlas</div>
        <h1 className="font-display text-2xl leading-tight" style={{ color: 'var(--text-primary)' }}>
          Study Map
        </h1>
      </div>

      {/* Chapter navigator — subject tabs, then unit groups */}
      <ChapterNav currentChapterId={currentChapterId} setChapter={setChapter} />

      {/* Layers */}
      <div className="scroll-panel px-5 py-4 flex-1 overflow-y-auto space-y-5">
        {/* Chapter layers */}
        <div>
          <div className="label-eyebrow mb-3">Chapter Layers</div>
          <ul className="space-y-2">
            {chapter.layers.map((layer) => (
              <li key={layer.id}>
                <LayerToggle
                  layer={layer}
                  on={activeLayerIds.includes(layer.id)}
                  onToggle={() => toggleLayer(layer.id)}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Base layers — always available */}
        {baseLayers.length > 0 && (
          <div className="pt-4 border-t border-themed">
            <div className="label-eyebrow mb-3">Reference (Always Available)</div>
            <ul className="space-y-2">
              {baseLayers.map((layer) => (
                <li key={layer.id}>
                  <LayerToggle
                    layer={layer}
                    on={activeBaseLayerIds.includes(layer.id)}
                    onToggle={() => toggleBaseLayer(layer.id)}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}


const SUBJECTS = ['geography', 'history', 'polity'] as const;
const UNIT_ORDER: Record<string, string[]> = {
  geography: ['India Physical', 'World', 'Mizoram'],
  history: ['Ancient', 'Medieval', 'Modern'],
};
const SUBJECT_LABEL: Record<string, string> = { geography: 'Geography', history: 'History' };

function ChapterNav({
  currentChapterId,
  setChapter,
}: {
  currentChapterId: string;
  setChapter: (id: string) => void;
}) {
  const current = chapters.find((c) => c.id === currentChapterId);
  const [tab, setTab] = useState<string>(current?.subject ?? 'geography');

  // Keep the open tab in sync when a connection link jumps subjects.
  useEffect(() => {
    if (current && current.subject !== tab && SUBJECTS.includes(current.subject as never)) {
      setTab(current.subject);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChapterId]);

  const inTab = chapters.filter((c) => c.subject === tab);
  const units = [
    ...(UNIT_ORDER[tab] ?? []).filter((u) => inTab.some((c) => (c.unit ?? 'Other') === u)),
    ...Array.from(new Set(inTab.map((c) => c.unit ?? 'Other'))).filter(
      (u) => !(UNIT_ORDER[tab] ?? []).includes(u)
    ),
  ];

  return (
    <div className={`border-b border-themed flex-1 min-h-0 flex flex-col subject-${tab}`}>
      {/* Subject tabs */}
      <div className="px-5 pt-4">
        <div className="label-eyebrow mb-2">Chapters</div>
        <div
          className="flex rounded-lg p-1 gap-1"
          style={{ background: 'var(--bg-panel-elev)' }}
          role="tablist"
          aria-label="Subject"
        >
          {SUBJECTS.map((subj) => {
            const active = subj === tab;
            const count = chapters.filter((c) => c.subject === subj).length;
            return (
              <button
                key={subj}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(subj)}
                className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                  active ? 'shadow-sm' : 'opacity-60 hover:opacity-90'
                }`}
                style={
                  active
                    ? { background: 'var(--bg-panel)', color: 'var(--text-primary)' }
                    : { color: 'var(--text-secondary)' }
                }
              >
                {SUBJECT_LABEL[subj]}
                <span className="ml-1.5 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Unit groups */}
      <div className="scroll-panel px-5 py-3 overflow-y-auto flex-1 min-h-0">
        {units.map((unit) => {
          const group = inTab.filter((c) => (c.unit ?? 'Other') === unit);
          return (
            <div key={unit} className="mb-4 last:mb-1">
              <div className="subject-chip mb-2">
                <span className="subject-dot" />
                {unit}
              </div>
              <ul className="space-y-1">
                {group.map((c) => {
                  const active = c.id === currentChapterId;
                  return (
                    <li key={c.id}>
                      <button
                        onClick={() => setChapter(c.id)}
                        className={`w-full text-left pl-3 pr-3 py-2 rounded-md transition-all border-l-2 ${
                          active
                            ? 'bg-[var(--accent)] text-white border-transparent shadow-sm'
                            : 'hover:bg-[var(--bg-panel-elev)] hover:translate-x-0.5'
                        }`}
                        style={
                          !active
                            ? { color: 'var(--text-primary)', borderColor: 'var(--subject)' }
                            : undefined
                        }
                      >
                        <div className="text-sm font-medium leading-snug">{c.title}</div>
                        <div
                          className={`text-xs mt-0.5 ${active ? 'opacity-90' : ''}`}
                          style={!active ? { color: 'var(--text-muted)' } : undefined}
                        >
                          {c.summary}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
