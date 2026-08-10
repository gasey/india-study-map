import { useNavigate } from 'react-router-dom';
import { mindmaps } from '@/data/mindmaps';
import type { MindNode } from '@/data/mindmaps/types';
import { SUBJECT_HUE } from '@/lib/subjectHue';
import { SimplePane, type SimpleItem } from './SimplePane';

function countNodes(n: MindNode): { total: number; linked: number } {
  let total = 1;
  let linked = n.chapterId ? 1 : 0;
  for (const c of n.children ?? []) {
    const sub = countNodes(c);
    total += sub.total;
    linked += sub.linked;
  }
  return { total, linked };
}

// ============================================
// Recall's Mind maps tab is deliberately a lightweight summary, not the
// design's inline node-graph canvas: MindMapsPage.tsx is a full page with
// its own header/canvas/detail-panel and pan/scroll state, and shrinking
// that into this pane's 380px canvas slot would mean either duplicating a
// lot of chrome or a second, degraded implementation of the same graph.
// The real map lives at /mindmaps; this pane's job is real numbers +
// a fast way in, not a second renderer.
// ============================================

export function MindMapsTab() {
  const navigate = useNavigate();

  const counts = mindmaps.map((m) => ({ map: m, ...countNodes(m.root) }));
  const items: SimpleItem[] = counts.map(({ map, total }) => ({
    label: map.title,
    meta: `${total} nodes`,
    color: SUBJECT_HUE[map.subject],
    onClick: () => navigate('/mindmaps'),
  }));
  const totalLinked = counts.reduce((s, c) => s + c.linked, 0);

  return (
    <SimplePane
      heading={`Mind Maps — ${mindmaps.length} interactive map${mindmaps.length === 1 ? '' : 's'}`}
      blurb="Topics laid out as a node graph, not a flat list — click a branch to read it, or jump straight into the Study Map chapter behind it. A state pill and accuracy only appear where there's a real quiz backing that node."
      cta={{ label: 'Open Mind Maps', onClick: () => navigate('/mindmaps') }}
      canvasLabel="Preview"
      canvasBody={
        <div className="text-center px-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--text-muted)' }}>
            Full canvas lives at /mindmaps
          </div>
          <div className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Pan, collapse branches, and read notes on the real node-graph canvas — it's
            a full page of its own, not something that fits in this preview.
          </div>
        </div>
      }
      footNote={`${totalLinked} node${totalLinked === 1 ? '' : 's'} linked to a Study Map chapter with mastery tracking`}
      listLabel="Maps"
      items={items}
    />
  );
}
