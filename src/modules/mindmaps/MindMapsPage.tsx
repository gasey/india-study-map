import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mindmaps } from '@/data/mindmaps';
import type { MindNode } from '@/data/mindmaps/types';
import { useApp } from '@/lib/store';
import { chapterMastery, type ChapterMastery, type MasteryState } from '@/lib/mindMapMastery';
import { MIN_ATTEMPTS } from '@/lib/weakTopics';
import { SUBJECT_HUE } from '@/lib/subjectHue';
import { ModuleSwitcher } from '@/modules/ModuleSwitcher';
import { HomeBackLink } from '@/components/shell/HomeBackLink';
import { useHasDesktopChrome } from '@/lib/useShellChrome';

// ============================================
// MIND MAPS — node-graph canvas per the Jabreeze redesign (components.md
// "Recall → Mind maps"), rebuilt on top of the original tree-layout math
// (y from leaf counts, x from depth — no layout dep) since these trees run
// 30-40 nodes deep, well past the prototype's 8-node demo.
//
// State pills / accuracy are real, not decorative: they read
// progress[chapterId] via lib/mindMapMastery.ts, the same attempt log the
// Home page's weak-topics widget uses. Only nodes carrying a chapterId get
// one — most outline nodes don't have a matching quiz anywhere, so they
// render as plain cards with a real (structural) sub-topic count instead of
// an invented mastery number. See mindMapMastery.ts for why that gap is
// architectural, not something to fake around.
// ============================================

const X_GAP = 300;
const Y_SLOT = 122;
const CARD_H_FULL = 92;
const CARD_H_PLAIN = 54;
const PAD_X = 110;
const PAD_Y = 70;

const KICKER = (depth: number) => (depth === 0 ? 'Root' : depth === 1 ? 'Branch' : 'Leaf');

const STATE_PILL: Record<MasteryState, { label: string; bg: string; fg: string; bd: string }> = {
  done: { label: 'Cleared', bg: 'var(--ok)', fg: 'var(--on-accent)', bd: 'transparent' },
  weak: { label: 'Weak', fg: 'var(--warn)', bd: 'var(--warn)', bg: 'transparent' },
  new: { label: 'New', fg: 'var(--faint)', bd: 'var(--line)', bg: 'transparent' },
};

const EDGE_STATE: Record<MasteryState, { stroke: string; w: number; dash: string }> = {
  done: { stroke: 'var(--ok)', w: 3, dash: 'none' },
  weak: { stroke: 'var(--warn)', w: 2.5, dash: '7 7' },
  new: { stroke: 'var(--line-strong)', w: 2.5, dash: 'none' },
};

function cardWidth(label: string): number {
  return Math.min(224, Math.max(168, Math.round(label.length * 7.6 + 60)));
}

/** A node gets a footer (any count at all) if it has real mastery data
 *  (chapterId) or real structural data (children to count). Pure leaves
 *  with neither get a compact, footer-less card. */
function hasFooter(n: MindNode): boolean {
  return !!n.chapterId || !!n.children?.length;
}

interface Laid {
  node: MindNode;
  x: number; y: number; w: number; h: number;
  parent?: Laid;
  depth: number;
  hasChildren: boolean;
}

function layout(root: MindNode, collapsed: Set<string>): { nodes: Laid[]; width: number; height: number } {
  const nodes: Laid[] = [];
  let cursor = 0;
  let maxRight = 0;
  const walk = (n: MindNode, depth: number, parent?: Laid): Laid => {
    const open = !collapsed.has(n.id);
    const kids = open ? n.children ?? [] : [];
    const w = cardWidth(n.label);
    const h = hasFooter(n) ? CARD_H_FULL : CARD_H_PLAIN;
    const x = PAD_X + depth * X_GAP;
    const self: Laid = { node: n, x, y: 0, w, h, depth, parent, hasChildren: !!n.children?.length };
    nodes.push(self);
    maxRight = Math.max(maxRight, x + w / 2);
    if (kids.length === 0) {
      self.y = PAD_Y + cursor * Y_SLOT;
      cursor += 1;
    } else {
      const laidKids = kids.map((k) => walk(k, depth + 1, self));
      self.y = (laidKids[0].y + laidKids[laidKids.length - 1].y) / 2;
    }
    return self;
  };
  walk(root, 0);
  return { nodes, width: maxRight + PAD_X, height: PAD_Y + Math.max(cursor - 1, 0) * Y_SLOT + CARD_H_FULL + PAD_Y };
}

export function MindMapsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme, setChapter, progress } = useApp();

  const [mapId, setMapId] = useState(mindmaps[0]?.id ?? '');
  const mm = mindmaps.find((m) => m.id === mapId) ?? mindmaps[0];
  const hue = SUBJECT_HUE[mm.subject];

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<MindNode | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; left: number; top: number } | null>(null);

  const { nodes, width, height } = useMemo(() => layout(mm.root, collapsed), [mm, collapsed]);

  const mastery = useMemo(() => {
    const map = new Map<string, ChapterMastery>();
    for (const n of nodes) {
      if (n.node.chapterId) {
        const m = chapterMastery(n.node.chapterId, progress);
        if (m) map.set(n.node.id, m);
      }
    }
    return map;
  }, [nodes, progress]);

  const selectedMastery = selected?.chapterId ? mastery.get(selected.id) : undefined;

  const toggle = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const resetView = () => scrollRef.current?.scrollTo({ left: 0, top: 0, behavior: 'smooth' });

  const resetFor = (id: string) => {
    setMapId(id);
    setCollapsed(new Set());
    setSelected(null);
    resetView();
  };

  const onDown = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    dragRef.current = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    const el = scrollRef.current;
    if (!d || !el) return;
    el.scrollLeft = d.left - (e.clientX - d.x);
    el.scrollTop = d.top - (e.clientY - d.y);
  };
  const onUp = () => { dragRef.current = null; };

  const selectStyle = { background: 'var(--bg-panel-elev)', color: 'var(--text-primary)', border: '1px solid var(--border)' } as const;
  const hasDesktopChrome = useHasDesktopChrome('home');

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      <header className="safe-top h-12 shrink-0 border-b flex items-center justify-between px-5 gap-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-panel)' }}>
        <div className="flex items-center gap-3 min-w-0">
          <HomeBackLink hasDesktopChrome={hasDesktopChrome} />
          <span className={hasDesktopChrome ? 'lg:hidden' : ''}><ModuleSwitcher /></span>
          <span className={`label-eyebrow hidden md:inline ${hasDesktopChrome ? 'lg:hidden' : ''}`}>Mind Maps</span>
        </div>
        <div className="flex items-center gap-2">
          <select value={mapId} onChange={(e) => resetFor(e.target.value)} className="px-2 py-1 rounded-md text-sm" style={selectStyle}>
            {mindmaps.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
          <button onClick={resetView} className="px-2.5 py-1 rounded-md text-xs font-medium" style={selectStyle}>Fit</button>
          <button onClick={toggleTheme} className={`${hasDesktopChrome ? 'lg:hidden' : ''} px-2 py-1 rounded-md text-sm hover:bg-[var(--bg-panel-elev)] transition-colors`} style={{ border: '1px solid var(--border)' }} title="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 flex flex-col md:flex-row">
        {/* Canvas */}
        <div className="flex-1 min-h-0 flex flex-col gap-2 p-3 min-w-0">
          <div
            ref={scrollRef}
            className="flex-1 min-h-0 overflow-auto cursor-grab active:cursor-grabbing rounded-xl"
            style={{ background: 'var(--sunk)', border: '1px solid var(--border)' }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerLeave={onUp}
          >
            <div style={{ position: 'relative', width, height }}>
              <svg width={width} height={height} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {/* Edges */}
                {nodes.filter((n) => n.parent).map((n) => {
                  const p = n.parent!;
                  const st = mastery.get(n.node.id)?.state ?? 'new';
                  const es = EDGE_STATE[st];
                  const x1 = p.x + p.w / 2;
                  const y1 = p.y;
                  const x2 = n.x - n.w / 2;
                  const y2 = n.y;
                  const mx = (x1 + x2) / 2;
                  return (
                    <path
                      key={`e-${n.node.id}`}
                      d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                      fill="none"
                      stroke={es.stroke}
                      strokeWidth={es.w}
                      strokeLinecap="round"
                      strokeDasharray={es.dash}
                    />
                  );
                })}

                {/* Branch-point dots */}
                {nodes.filter((n) => n.hasChildren).map((n) => (
                  <circle key={`d-${n.node.id}`} cx={n.x + n.w / 2} cy={n.y} r={5} fill={hue} stroke="var(--bg-panel-elev)" strokeWidth={3} />
                ))}
              </svg>

              {/* Nodes */}
              {nodes.map((n) => {
                const isSel = selected?.id === n.node.id;
                const m = mastery.get(n.node.id);
                const pill = m ? STATE_PILL[m.state] : null;
                const showFooter = hasFooter(n.node);
                const barPct = m?.accuracyPct != null ? `${m.accuracyPct}%` : null;
                return (
                  <div
                    key={n.node.id}
                    className="card-lift"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => setSelected(n.node)}
                    style={{
                      position: 'absolute', left: n.x, top: n.y, width: n.w, height: n.h,
                      transform: 'translate(-50%, -50%)', borderRadius: 'var(--r-xl)', overflow: 'hidden', cursor: 'pointer',
                      background: 'var(--bg-panel)',
                      border: `1px solid ${isSel ? hue : 'var(--border)'}`,
                      boxShadow: isSel ? `0 0 0 2px color-mix(in srgb, ${hue} 35%, transparent)` : 'var(--sh-1)',
                    }}
                  >
                    <div style={{ height: 4, background: hue }} />
                    <div style={{ padding: '8px 10px 9px' }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-mono text-[9px] font-bold uppercase" style={{ letterSpacing: '0.1em', color: hue }}>{KICKER(n.depth)}</span>
                        {pill && (
                          <span
                            className="ml-auto font-semibold uppercase"
                            style={{ fontSize: 9, letterSpacing: '0.04em', padding: '2px 6px', borderRadius: 5, background: pill.bg, color: pill.fg, border: `1px solid ${pill.bd}` }}
                          >
                            {pill.label}
                          </span>
                        )}
                        {n.hasChildren && (
                          <button
                            onClick={(e) => { e.stopPropagation(); toggle(n.node.id); }}
                            className="rounded-full flex items-center justify-center shrink-0"
                            style={{ width: 16, height: 16, marginLeft: pill ? 4 : 'auto', background: 'var(--bg-panel-elev)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 9 }}
                          >
                            {collapsed.has(n.node.id) ? '▸' : '▾'}
                          </button>
                        )}
                      </div>
                      <div className="text-[12.5px] font-semibold leading-tight" style={{ color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {n.node.label}
                      </div>
                      {showFooter && (
                        <div className="flex items-center gap-2 mt-1.5 pt-1.5" style={{ borderTop: '1px dashed var(--border)' }}>
                          {n.node.chapterId ? (
                            m && barPct ? (
                              <>
                                <span className="font-mono text-[10px]" style={{ color: 'var(--text-secondary)' }}>{m.quizTotal} Qs</span>
                                <span className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-panel-elev)' }}>
                                  <span className="block h-full" style={{ width: barPct, background: hue }} />
                                </span>
                                <span className="font-mono text-[10px]" style={{ color: hue }}>{barPct}</span>
                              </>
                            ) : (
                              <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                {m ? `${m.quizTotal} Qs · not attempted yet` : '—'}
                              </span>
                            )
                          ) : (
                            <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                              {n.node.children!.length} sub-topic{n.node.children!.length === 1 ? '' : 's'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap text-[11px] px-1" style={{ color: 'var(--text-secondary)' }}>
            <Legend color="var(--ok)" label="cleared" />
            <Legend color="var(--line-strong)" label="not tracked / new" />
            <Legend color="var(--warn)" label="weak — revisit" dashed />
            <span className="ml-auto">State shown only where a topic is linked to a Study Map chapter with quiz attempts.</span>
          </div>
        </div>

        {/* Detail panel */}
        <aside className="scroll-panel md:w-80 shrink-0 border-t md:border-t-0 md:border-l p-4 overflow-y-auto" style={{ borderColor: 'var(--border)', background: 'var(--bg-panel)' }}>
          <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{mm.description}</div>
          {selected ? (
            <div className="fact-in" key={selected.id}>
              <h3 className="font-semibold mb-2">{selected.label}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {selected.note ?? 'No extra notes — expand the branch for detail.'}
              </p>
              {selected.chapterId && (
                <div className="mt-3 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {selectedMastery
                    ? selectedMastery.accuracyPct != null
                      ? `${selectedMastery.attempts} attempts logged · ${selectedMastery.accuracyPct}% accuracy · ${selectedMastery.quizTotal} quiz questions.`
                      : `${selectedMastery.quizTotal} quiz questions here — needs ${MIN_ATTEMPTS}+ attempts before accuracy shows (${selectedMastery.attempts} so far).`
                    : null}
                </div>
              )}
              {selected.chapterId && (
                <button
                  onClick={() => { setChapter(selected.chapterId!); navigate('/'); }}
                  className="mt-3 px-3 py-1.5 rounded-md text-xs font-medium"
                  style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }}
                >
                  🗺️ Open on the Study Map
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Click a node to read its note. Use the ▸ chevrons to collapse branches, scroll or drag to pan.
            </p>
          )}
          <div className="mt-6 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <Link to="/map" className="hover:underline">← Back to Study Map</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span style={dashed ? { width: 16, height: 0, borderTop: `2.5px dashed ${color}`, display: 'block' } : { width: 16, height: 2.5, borderRadius: 2, background: color, display: 'block' }} />
      {label}
    </span>
  );
}

export default MindMapsPage;
