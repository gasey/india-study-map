import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleMarker, Polygon, Polyline, Tooltip } from 'react-leaflet';
import { searchPlaces, type PlaceEntry } from '@/lib/places';

// ============================================
// Author Tool — click to build a chapter visually.
//
// State is owned by the parent App. This file exports:
//
//   - AuthorMapLayer: drops inside MapContainer to render
//     drafted features and previews.
//   - AuthorPanel: a right-side drawer with controls,
//     place search, and code generation.
// ============================================

export type Tool = 'select' | 'marker' | 'polygon' | 'line';

export interface AuthorMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
}
export interface AuthorPolygon {
  id: string;
  name: string;
  coords: [number, number][];
  color: string;
}
export interface AuthorLine {
  id: string;
  name: string;
  coords: [number, number][];
  color: string;
}

export interface AuthorState {
  chapterTitle: string;
  chapterSummary: string;
  chapterFocus: string;
  subject: 'geography' | 'history' | 'polity';
  basemap: string;
  markers: AuthorMarker[];
  polygons: AuthorPolygon[];
  lines: AuthorLine[];
}

export const EMPTY_AUTHOR_STATE: AuthorState = {
  chapterTitle: '',
  chapterSummary: '',
  chapterFocus: '',
  subject: 'history',
  basemap: 'topo',
  markers: [],
  polygons: [],
  lines: [],
};

/** Renders drafted features inside the MapContainer. */
export function AuthorMapLayer({
  active,
  state,
  draftPolygon,
  draftLine,
}: {
  active: boolean;
  state: AuthorState;
  draftPolygon: [number, number][];
  draftLine: [number, number][];
}) {
  if (!active) return null;
  return (
    <>
      {state.markers.map((m) => (
        <CircleMarker
          key={m.id}
          center={[m.lat, m.lng]}
          radius={7}
          pathOptions={{ color: '#1a1a17', fillColor: '#c46a3d', fillOpacity: 0.9, weight: 2 }}
        >
          <Tooltip permanent direction="top" offset={[0, -7]}>{m.name}</Tooltip>
        </CircleMarker>
      ))}
      {state.polygons.map((p) => (
        <Polygon
          key={p.id}
          positions={p.coords}
          pathOptions={{ color: p.color, fillColor: p.color, fillOpacity: 0.3, weight: 2 }}
        >
          <Tooltip sticky>{p.name}</Tooltip>
        </Polygon>
      ))}
      {state.lines.map((l) => (
        <Polyline
          key={l.id}
          positions={l.coords}
          pathOptions={{ color: l.color, weight: 3 }}
        >
          <Tooltip sticky>{l.name}</Tooltip>
        </Polyline>
      ))}
      {/* Draft polygon preview */}
      {draftPolygon.length >= 2 && (
        <Polyline
          positions={draftPolygon}
          pathOptions={{ color: '#c46a3d', weight: 2, dashArray: '4 4' }}
        />
      )}
      {draftPolygon.map((pt, idx) => (
        <CircleMarker
          key={`dp-${idx}`}
          center={pt}
          radius={4}
          pathOptions={{ color: '#c46a3d', fillColor: '#fff', fillOpacity: 1, weight: 2 }}
        />
      ))}
      {/* Draft line preview */}
      {draftLine.length >= 2 && (
        <Polyline
          positions={draftLine}
          pathOptions={{ color: '#1d4f7a', weight: 2, dashArray: '4 4' }}
        />
      )}
      {draftLine.map((pt, idx) => (
        <CircleMarker
          key={`dl-${idx}`}
          center={pt}
          radius={4}
          pathOptions={{ color: '#1d4f7a', fillColor: '#fff', fillOpacity: 1, weight: 2 }}
        />
      ))}
    </>
  );
}

function PlaceSearchInput({ onPick }: { onPick: (p: PlaceEntry) => void }) {
  const [q, setQ] = useState('');
  const results = searchPlaces(q, 6);
  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search places (e.g. Pataliputra, Chennai)"
        className="w-full px-3 py-2 rounded-md text-sm border border-themed surface focus:outline-none focus:border-[var(--accent)]"
        style={{ color: 'var(--text-primary)' }}
      />
      {q && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 surface border border-themed rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
          {results.map((p) => (
            <li key={p.name}>
              <button
                onClick={() => { onPick(p); setQ(''); }}
                className="w-full text-left px-3 py-2 hover:bg-[var(--bg-panel-elev)] text-sm"
                style={{ color: 'var(--text-primary)' }}
              >
                <div className="font-medium">{p.name}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {p.category} · {p.coords[0].toFixed(2)}, {p.coords[1].toFixed(2)}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DraftList({
  title,
  items,
  onRename,
  onDelete,
}: {
  title: string;
  items: { id: string; name: string; meta: string }[];
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div>
      <div className="label-eyebrow mb-2">{title}</div>
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.id} className="flex items-center gap-2 group">
            <input
              value={it.name}
              onChange={(e) => onRename(it.id, e.target.value)}
              className="flex-1 px-2 py-1 text-sm rounded border border-themed surface min-w-0"
              style={{ color: 'var(--text-primary)' }}
            />
            <span className="font-mono text-[10px] shrink-0 w-20 truncate" style={{ color: 'var(--text-muted)' }}>
              {it.meta}
            </span>
            <button
              onClick={() => onDelete(it.id)}
              className="text-lg leading-none px-1.5 opacity-30 hover:opacity-100"
              title="Delete"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The author drawer panel. */
export function AuthorPanel({
  active,
  onClose,
  state,
  setState,
  tool,
  setTool,
  draftPolygon,
  draftLine,
  setDraftPolygon,
  setDraftLine,
}: {
  active: boolean;
  onClose: () => void;
  state: AuthorState;
  setState: (s: AuthorState) => void;
  tool: Tool;
  setTool: (t: Tool) => void;
  draftPolygon: [number, number][];
  draftLine: [number, number][];
  setDraftPolygon: (pts: [number, number][]) => void;
  setDraftLine: (pts: [number, number][]) => void;
}) {
  const [output, setOutput] = useState<string | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === '1') setTool('select');
      if (e.key === '2') setTool('marker');
      if (e.key === '3') setTool('polygon');
      if (e.key === '4') setTool('line');
      if (e.key === 'Escape') { setDraftPolygon([]); setDraftLine([]); }
      if (e.key === 'Enter') {
        if (tool === 'polygon' && draftPolygon.length >= 3) finishPolygon();
        if (tool === 'line' && draftLine.length >= 2) finishLine();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function finishPolygon() {
    if (draftPolygon.length < 3) return;
    setState({
      ...state,
      polygons: [
        ...state.polygons,
        {
          id: `p${state.polygons.length + 1}`,
          name: `Region ${state.polygons.length + 1}`,
          coords: draftPolygon,
          color: '#7a4a2a',
        },
      ],
    });
    setDraftPolygon([]);
  }

  function finishLine() {
    if (draftLine.length < 2) return;
    setState({
      ...state,
      lines: [
        ...state.lines,
        {
          id: `l${state.lines.length + 1}`,
          name: `Line ${state.lines.length + 1}`,
          coords: draftLine,
          color: '#1d4f7a',
        },
      ],
    });
    setDraftLine([]);
  }

  function addFromPlace(p: PlaceEntry) {
    setState({
      ...state,
      markers: [
        ...state.markers,
        { id: `m${state.markers.length + 1}`, name: p.name, lat: p.coords[0], lng: p.coords[1] },
      ],
    });
  }

  function renameMarker(id: string, name: string) {
    setState({ ...state, markers: state.markers.map((m) => (m.id === id ? { ...m, name } : m)) });
  }
  function renamePolygon(id: string, name: string) {
    setState({ ...state, polygons: state.polygons.map((p) => (p.id === id ? { ...p, name } : p)) });
  }
  function renameLine(id: string, name: string) {
    setState({ ...state, lines: state.lines.map((l) => (l.id === id ? { ...l, name } : l)) });
  }

  function generate() {
    setOutput(buildScaffold(state));
  }

  function clearAll() {
    if (!confirm('Clear all drafted features?')) return;
    setState({ ...EMPTY_AUTHOR_STATE, chapterTitle: state.chapterTitle, chapterSummary: state.chapterSummary, chapterFocus: state.chapterFocus });
    setDraftPolygon([]);
    setDraftLine([]);
  }

  if (!active) return null;
  const total = state.markers.length + state.polygons.length + state.lines.length;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.3 }}
        className="surface w-[420px] shrink-0 border-l flex flex-col overflow-hidden relative"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-themed flex items-center justify-between">
          <div>
            <div className="label-eyebrow">Author Mode</div>
            <h2 className="font-display text-lg" style={{ color: 'var(--text-primary)' }}>
              Build a Chapter
            </h2>
          </div>
          <button onClick={onClose} className="text-sm px-3 py-1 rounded-md hover:bg-[var(--bg-panel-elev)]" style={{ color: 'var(--text-secondary)' }}>
            Exit
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Tools */}
          <div>
            <div className="label-eyebrow mb-2">Tool</div>
            <div className="grid grid-cols-4 gap-1">
              {(['select', 'marker', 'polygon', 'line'] as Tool[]).map((t, i) => (
                <button
                  key={t}
                  onClick={() => setTool(t)}
                  className={`py-2 px-1 text-xs rounded-md border transition-colors ${
                    tool === t ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'border-themed hover:bg-[var(--bg-panel-elev)]'
                  }`}
                  style={tool !== t ? { color: 'var(--text-primary)' } : undefined}
                >
                  <div className="font-medium capitalize">{t}</div>
                  <div className="text-[10px] opacity-60 mt-0.5 font-mono">{i + 1}</div>
                </button>
              ))}
            </div>

            {tool === 'select' && (
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                Drag the map to navigate. No drawing in this mode.
              </p>
            )}
            {tool === 'marker' && (
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                Click the map to drop a marker. Rename it below.
              </p>
            )}
            {tool === 'polygon' && (
              <div className="mt-2 space-y-1.5">
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Click to add vertices. <strong style={{ color: 'var(--text-primary)' }}>{draftPolygon.length}</strong> placed. Need ≥ 3.
                </p>
                <div className="flex gap-2">
                  <button onClick={finishPolygon} disabled={draftPolygon.length < 3} className="flex-1 py-1.5 px-2 text-xs rounded-md bg-[var(--accent)] text-white disabled:opacity-30 disabled:cursor-not-allowed">
                    Finish region (Enter)
                  </button>
                  <button onClick={() => setDraftPolygon([])} disabled={draftPolygon.length === 0} className="py-1.5 px-2 text-xs rounded-md border border-themed disabled:opacity-30" style={{ color: 'var(--text-primary)' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {tool === 'line' && (
              <div className="mt-2 space-y-1.5">
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Click to add points. <strong style={{ color: 'var(--text-primary)' }}>{draftLine.length}</strong> placed. Need ≥ 2.
                </p>
                <div className="flex gap-2">
                  <button onClick={finishLine} disabled={draftLine.length < 2} className="flex-1 py-1.5 px-2 text-xs rounded-md bg-[var(--accent)] text-white disabled:opacity-30 disabled:cursor-not-allowed">
                    Finish line (Enter)
                  </button>
                  <button onClick={() => setDraftLine([])} disabled={draftLine.length === 0} className="py-1.5 px-2 text-xs rounded-md border border-themed disabled:opacity-30" style={{ color: 'var(--text-primary)' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Place library quick-add */}
          <div>
            <div className="label-eyebrow mb-2">Add From Place Library</div>
            <PlaceSearchInput onPick={addFromPlace} />
            <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
              Common Indian cities, capitals, historic sites & battles.
            </p>
          </div>

          {/* Chapter details */}
          <div className="space-y-2">
            <div className="label-eyebrow">Chapter Details</div>
            <input
              value={state.chapterTitle}
              onChange={(e) => setState({ ...state, chapterTitle: e.target.value })}
              placeholder="Title (e.g. Battle of Buxar, 1764)"
              className="w-full px-3 py-2 rounded-md text-sm border border-themed surface"
              style={{ color: 'var(--text-primary)' }}
            />
            <input
              value={state.chapterSummary}
              onChange={(e) => setState({ ...state, chapterSummary: e.target.value })}
              placeholder="One-line summary"
              className="w-full px-3 py-2 rounded-md text-sm border border-themed surface"
              style={{ color: 'var(--text-primary)' }}
            />
            <textarea
              value={state.chapterFocus}
              onChange={(e) => setState({ ...state, chapterFocus: e.target.value })}
              placeholder="The Idea — one sentence the chapter exists to teach"
              rows={2}
              className="w-full px-3 py-2 rounded-md text-sm border border-themed surface resize-none"
              style={{ color: 'var(--text-primary)' }}
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={state.subject}
                onChange={(e) => setState({ ...state, subject: e.target.value as any })}
                className="px-3 py-2 rounded-md text-sm border border-themed surface"
                style={{ color: 'var(--text-primary)' }}
              >
                <option value="geography">Geography</option>
                <option value="history">History</option>
                <option value="polity">Polity</option>
              </select>
              <select
                value={state.basemap}
                onChange={(e) => setState({ ...state, basemap: e.target.value })}
                className="px-3 py-2 rounded-md text-sm border border-themed surface"
                style={{ color: 'var(--text-primary)' }}
              >
                <option value="topo">Topographic</option>
                <option value="physical">Physical Atlas</option>
                <option value="natgeo">National Geographic</option>
                <option value="opentopo">OpenTopoMap</option>
                <option value="voyager">Voyager</option>
                <option value="clean">Clean</option>
              </select>
            </div>
          </div>

          {/* Drafted features */}
          {state.markers.length > 0 && (
            <DraftList
              title={`Markers (${state.markers.length})`}
              items={state.markers.map((m) => ({ id: m.id, name: m.name, meta: `${m.lat.toFixed(2)},${m.lng.toFixed(2)}` }))}
              onRename={renameMarker}
              onDelete={(id) => setState({ ...state, markers: state.markers.filter((m) => m.id !== id) })}
            />
          )}
          {state.polygons.length > 0 && (
            <DraftList
              title={`Regions (${state.polygons.length})`}
              items={state.polygons.map((p) => ({ id: p.id, name: p.name, meta: `${p.coords.length} pts` }))}
              onRename={renamePolygon}
              onDelete={(id) => setState({ ...state, polygons: state.polygons.filter((p) => p.id !== id) })}
            />
          )}
          {state.lines.length > 0 && (
            <DraftList
              title={`Lines (${state.lines.length})`}
              items={state.lines.map((l) => ({ id: l.id, name: l.name, meta: `${l.coords.length} pts` }))}
              onRename={renameLine}
              onDelete={(id) => setState({ ...state, lines: state.lines.filter((l) => l.id !== id) })}
            />
          )}

          {total === 0 && (
            <div className="text-center py-6 text-sm" style={{ color: 'var(--text-muted)' }}>
              Pick a tool above and start drawing.
              <br />
              Or search a place in the library.
            </div>
          )}

          {total > 0 && (
            <button
              onClick={clearAll}
              className="text-xs underline opacity-60 hover:opacity-100"
              style={{ color: 'var(--text-muted)' }}
            >
              Clear all features
            </button>
          )}

          <div className="px-3 py-2 rounded-md text-xs border border-themed" style={{ color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Shortcuts:</strong> 1–4 switch tools, Enter finishes a polygon/line, Esc cancels.
          </div>
        </div>

        <div className="px-5 py-4 border-t border-themed surface-elev">
          <button
            onClick={generate}
            disabled={total === 0}
            className="w-full py-3 rounded-md text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            Generate Chapter Code
          </button>
        </div>

        {/* Output modal */}
        {output && (
          <div className="absolute inset-0 z-50 surface flex flex-col p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="label-eyebrow">Generated Code</div>
                <h3 className="font-display text-lg" style={{ color: 'var(--text-primary)' }}>
                  Save to src/data/chapters/
                </h3>
              </div>
              <button onClick={() => setOutput(null)} className="text-sm px-3 py-1 rounded-md hover:bg-[var(--bg-panel-elev)]" style={{ color: 'var(--text-secondary)' }}>
                Close
              </button>
            </div>
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
              Copy this, save as a .ts file under <code>src/data/chapters/</code>,
              then add it to the registry in <code>src/data/index.ts</code>.
            </p>
            <textarea
              readOnly
              value={output}
              className="flex-1 w-full px-3 py-2 font-mono text-xs border border-themed surface rounded-md resize-none"
              style={{ color: 'var(--text-primary)' }}
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(output);
                }}
                className="flex-1 py-2 rounded-md text-sm font-medium"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                Copy to clipboard
              </button>
              <button
                onClick={() => setOutput(null)}
                className="py-2 px-4 rounded-md text-sm border border-themed"
                style={{ color: 'var(--text-primary)' }}
              >
                Keep editing
              </button>
            </div>
          </div>
        )}
      </motion.aside>
    </AnimatePresence>
  );
}

function escapeStr(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ');
}
function camelCase(s: string): string {
  return s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function buildScaffold(state: AuthorState): string {
  const id = (state.chapterTitle || 'new-chapter')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const allPts: [number, number][] = [
    ...state.markers.map((m): [number, number] => [m.lat, m.lng]),
    ...state.polygons.flatMap((p) => p.coords),
    ...state.lines.flatMap((l) => l.coords),
  ];
  const avgLat = allPts.length ? allPts.reduce((s, p) => s + p[0], 0) / allPts.length : 22;
  const avgLng = allPts.length ? allPts.reduce((s, p) => s + p[1], 0) / allPts.length : 80;

  const layers: string[] = [];

  if (state.markers.length) {
    const features = state.markers
      .map(
        (m) =>
          `          { type: 'Feature', properties: { id: '${m.id}', name: '${escapeStr(m.name)}' }, geometry: { type: 'Point', coordinates: [${m.lng.toFixed(4)}, ${m.lat.toFixed(4)}] } },`
      )
      .join('\n');
    layers.push(`    {
      id: 'locations',
      name: 'Locations',
      kind: 'vector',
      data: {
        type: 'FeatureCollection',
        features: [
${features}
        ],
      },
      defaultOn: true,
      labelKey: 'name',
    },`);
  }

  if (state.polygons.length) {
    const features = state.polygons
      .map((p) => {
        const ring = p.coords
          .map(([la, ln]) => `                [${ln.toFixed(4)}, ${la.toFixed(4)}]`)
          .join(',\n');
        const closing = `                [${p.coords[0][1].toFixed(4)}, ${p.coords[0][0].toFixed(4)}]`;
        return `          {
            type: 'Feature',
            properties: { id: '${p.id}', name: '${escapeStr(p.name)}' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
${ring},
${closing}
              ]],
            },
          },`;
      })
      .join('\n');
    layers.push(`    {
      id: 'regions',
      name: 'Regions',
      kind: 'vector',
      data: {
        type: 'FeatureCollection',
        features: [
${features}
        ],
      },
      defaultOn: true,
      labelKey: 'name',
      style: { color: '#7a4a2a', fillOpacity: 0.35, weight: 2, pattern: 'hatch' },
    },`);
  }

  if (state.lines.length) {
    const features = state.lines
      .map((l) => {
        const pts = l.coords
          .map(([la, ln]) => `                [${ln.toFixed(4)}, ${la.toFixed(4)}]`)
          .join(',\n');
        return `          {
            type: 'Feature',
            properties: { id: '${l.id}', name: '${escapeStr(l.name)}' },
            geometry: {
              type: 'LineString',
              coordinates: [
${pts},
              ],
            },
          },`;
      })
      .join('\n');
    layers.push(`    {
      id: 'routes',
      name: 'Routes',
      kind: 'vector',
      data: {
        type: 'FeatureCollection',
        features: [
${features}
        ],
      },
      defaultOn: true,
      style: { color: '#1d4f7a', weight: 3 },
    },`);
  }

  const exportName = (camelCase(id) || 'newChapter') + 'Chapter';

  return `import type { Chapter } from '@/types';

export const ${exportName}: Chapter = {
  id: '${id || 'new-chapter'}',
  subject: '${state.subject}',
  title: '${escapeStr(state.chapterTitle || 'Untitled Chapter')}',
  summary: '${escapeStr(state.chapterSummary)}',
  focus: '${escapeStr(state.chapterFocus)}',
  view: { center: [${avgLat.toFixed(3)}, ${avgLng.toFixed(3)}], zoom: 6 },
  basemap: '${state.basemap}',
  layers: [
${layers.join('\n')}
  ],
  facts: [
    // Add facts: { id: 'f1', text: '...' },
  ],
  quiz: [
    // MCQ: { id: 'q1', type: 'mcq', question: '...', options: ['A','B','C','D'], answerIndex: 0, explanation: '...' },
    // Map-click: { id: 'q2', type: 'map_click', question: '...', answer: { lat: 0, lng: 0, toleranceKm: 50 }, explanation: '...' },
  ],
};

// Register in src/data/index.ts:
//   import { ${exportName} } from './chapters/${id || 'new-chapter'}';
//   chapters: [..., ${exportName}]
`;
}
