import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mindmaps } from '@/data/mindmaps';
import type { MindNode } from '@/data/mindmaps/types';
import { useApp } from '@/lib/store';
import { ModuleSwitcher } from '@/modules/ModuleSwitcher';

// ============================================
// MIND MAPS — collapsible left-to-right tree in pure SVG.
// No layout deps: y-positions from leaf counts, x from depth.
// Click a node = select (note panel); ▸/▾ chevron = collapse.
// Wheel = zoom, drag = pan. Nodes with chapterId deep-link
// into the Study Map.
// ============================================

const X_GAP = 240;
const Y_GAP = 46;
const NODE_H = 34;

interface Laid {
  node: MindNode;
  x: number;
  y: number;
  parent?: Laid;
  depth: number;
  hasChildren: boolean;
}

function layout(root: MindNode, collapsed: Set<string>): { nodes: Laid[]; height: number } {
  const nodes: Laid[] = [];
  let cursor = 0;
  const walk = (n: MindNode, depth: number, parent?: Laid): Laid => {
    const open = !collapsed.has(n.id);
    const kids = open ? n.children ?? [] : [];
    const self: Laid = { node: n, x: depth * X_GAP, y: 0, parent, depth, hasChildren: !!n.children?.length };
    nodes.push(self);
    if (kids.length === 0) {
      self.y = cursor * Y_GAP;
      cursor += 1;
    } else {
      const laidKids = kids.map((k) => walk(k, depth + 1, self));
      self.y = (laidKids[0].y + laidKids[laidKids.length - 1].y) / 2;
    }
    return self;
  };
  walk(root, 0);
  return { nodes, height: Math.max(cursor, 1) * Y_GAP };
}

/** Rough text width so node pills hug their labels. */
const w = (s: string) => Math.min(200, Math.max(60, s.length * 7.2 + 26));

export function MindMapsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme, setChapter } = useApp();

  const [mapId, setMapId] = useState(mindmaps[0]?.id ?? '');
  const mm = mindmaps.find((m) => m.id === mapId) ?? mindmaps[0];

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<MindNode | null>(null);
  const [view, setView] = useState({ x: -40, y: -40, k: 1 });
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const { nodes, height } = useMemo(() => layout(mm.root, collapsed), [mm, collapsed]);

  const toggle = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const resetFor = (id: string) => {
    setMapId(id);
    setCollapsed(new Set());
    setSelected(null);
    setView({ x: -40, y: -40, k: 1 });
  };

  const onWheel = (e: React.WheelEvent) => {
    const k = Math.min(2.2, Math.max(0.4, view.k * (e.deltaY > 0 ? 0.9 : 1.1)));
    setView((v) => ({ ...v, k }));
  };
  const onDown = (e: React.PointerEvent) => { dragRef.current = { x: e.clientX, y: e.clientY }; };
  const onMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = (e.clientX - dragRef.current.x) / view.k;
    const dy = (e.clientY - dragRef.current.y) / view.k;
    dragRef.current = { x: e.clientX, y: e.clientY };
    setView((v) => ({ ...v, x: v.x - dx, y: v.y - dy }));
  };
  const onUp = () => { dragRef.current = null; };

  const vw = 1100 / view.k;
  const vh = Math.max(height + 120, 560) / view.k;

  const selectStyle = { background: 'var(--bg-panel-elev)', color: 'var(--text-primary)', border: '1px solid var(--border)' } as const;

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      <header className="safe-top h-12 shrink-0 border-b flex items-center justify-between px-5 gap-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-panel)' }}>
        <div className="flex items-center gap-3 min-w-0">
          <ModuleSwitcher />
          <span className="label-eyebrow hidden md:inline">Mind Maps</span>
        </div>
        <div className="flex items-center gap-2">
          <select value={mapId} onChange={(e) => resetFor(e.target.value)} className="px-2 py-1 rounded-md text-sm" style={selectStyle}>
            {mindmaps.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
          <button onClick={toggleTheme} className="px-2 py-1 rounded-md text-sm hover:bg-[var(--bg-panel-elev)] transition-colors" style={{ border: '1px solid var(--border)' }} title="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 flex flex-col md:flex-row">
        {/* Canvas */}
        <div
          className="flex-1 min-h-0 overflow-hidden touch-none cursor-grab active:cursor-grabbing"
          onWheel={onWheel}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
        >
          <svg className="w-full h-full" viewBox={`${view.x} ${view.y} ${vw} ${vh}`}>
            {/* Edges */}
            {nodes.filter((n) => n.parent).map((n) => {
              const p = n.parent!;
              const x1 = p.x + w(p.node.label);
              const y1 = p.y + NODE_H / 2;
              const x2 = n.x;
              const y2 = n.y + NODE_H / 2;
              const mx = (x1 + x2) / 2;
              return (
                <path
                  key={`e-${n.node.id}`}
                  d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth={1.6 / view.k < 1 ? 1 : 1.6}
                />
              );
            })}
            {/* Nodes */}
            {nodes.map((n) => {
              const isSel = selected?.id === n.node.id;
              const isRoot = n.depth === 0;
              const pillW = w(n.node.label);
              return (
                <g
                  key={n.node.id}
                  transform={`translate(${n.x},${n.y})`}
                  className="cursor-pointer"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => setSelected(n.node)}
                >
                  <rect
                    width={pillW}
                    height={NODE_H}
                    rx={NODE_H / 2}
                    fill={isRoot ? 'var(--accent)' : isSel ? 'var(--bg-panel-elev)' : 'var(--bg-panel)'}
                    stroke={isSel ? 'var(--accent)' : 'var(--border)'}
                    strokeWidth={isSel ? 2 : 1.2}
                  />
                  <text
                    x={pillW / 2}
                    y={NODE_H / 2 + 4}
                    textAnchor="middle"
                    fontSize={isRoot ? 13 : 12}
                    fontWeight={isRoot || n.depth === 1 ? 600 : 400}
                    fill={isRoot ? '#fff' : 'var(--text-primary)'}
                  >
                    {n.node.label.length > 26 ? n.node.label.slice(0, 25) + '…' : n.node.label}
                  </text>
                  {n.hasChildren && (
                    <g
                      transform={`translate(${pillW + 4},${NODE_H / 2 - 8})`}
                      onClick={(e) => { e.stopPropagation(); toggle(n.node.id); }}
                    >
                      <circle cx={8} cy={8} r={8} fill="var(--bg-panel-elev)" stroke="var(--border)" />
                      <text x={8} y={11.5} textAnchor="middle" fontSize={10} fill="var(--text-secondary)">
                        {collapsed.has(n.node.id) ? '▸' : '▾'}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
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
              Click a node to read its note. Use the ▸ chevrons to collapse branches, scroll to zoom, drag to pan.
            </p>
          )}
          <div className="mt-6 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <Link to="/" className="hover:underline">← Back to Study Map</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default MindMapsPage;
