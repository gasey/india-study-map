import { useApp, type ChronicleTrackMode } from '@/lib/store';
import { eras } from '@/data/timeline/eras';
import type { ChronicleScaleHandle, ChronicleViewInfo } from './TimelineCanvas';

interface ControlsRowProps {
  viewInfo: ChronicleViewInfo | null;
  scaleHandleRef: React.RefObject<ChronicleScaleHandle | null>;
  onStartQuiz: () => void;
}

/** Controls row (design handoff §"Screens / Views" → Canvas view → Controls
 *  row): era pills, track chips, lens chips, quiz button. Replaces the old
 *  inline toolbar that used to live inside `TimelineCanvas`. */
export function ControlsRow({ viewInfo, scaleHandleRef, onStartQuiz }: ControlsRowProps) {
  const trackMode = useApp((s) => s.chronicle.trackMode);
  const setTrackMode = useApp((s) => s.setChronicleTrackMode);
  const lens = useApp((s) => s.chronicle.lens);
  const setChronicleLens = useApp((s) => s.setChronicleLens);

  return (
    <div
      className="h-[46px] shrink-0 flex items-center gap-2.5 px-3 border-b overflow-x-auto"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-panel)' }}
    >
      <div className="flex items-center gap-1 shrink-0">
        {eras.map((era) => {
          const active = viewInfo?.currentEraId === era.id;
          return (
            <button
              key={era.id}
              onClick={() => scaleHandleRef.current?.zoomToYearRange(era.start, era.end, 0.9)}
              className="px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors"
              style={{
                background: active ? 'color-mix(in srgb, var(--accent) 14%, transparent)' : 'transparent',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
              }}
            >
              {era.label}
            </button>
          );
        })}
      </div>

      <div className="w-px h-5 shrink-0" style={{ background: 'var(--border)' }} />

      <div className="flex items-center gap-1 shrink-0">
        {(['both', 'history', 'polity'] as ChronicleTrackMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setTrackMode(m)}
            className="px-2.5 py-1 text-xs font-medium capitalize rounded-md transition-all"
            style={{
              background: trackMode === m ? 'var(--accent)' : 'transparent',
              color: trackMode === m ? '#fff' : 'var(--text-secondary)',
            }}
          >
            {m}
          </button>
        ))}
        <button
          disabled
          title="Economy track — coming soon"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md cursor-not-allowed opacity-50"
          style={{ color: 'var(--text-secondary)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--text-muted)' }} />
          Economy
        </button>
      </div>

      <div className="flex-1" />

      <span className="label-eyebrow shrink-0" style={{ fontSize: 10 }}>
        Lens
      </span>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setChronicleLens(lens === 'heat' ? 'none' : 'heat')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
          style={{
            background: lens === 'heat' ? 'var(--accent-soft)' : 'var(--bg-panel-elev)',
            color: lens === 'heat' ? 'var(--accent)' : 'var(--text-secondary)',
            border: `1px solid ${lens === 'heat' ? 'color-mix(in srgb, var(--accent) 45%, transparent)' : 'var(--border)'}`,
          }}
          title="Exam heat — glow intensity shows attached question count"
        >
          <span style={{ filter: lens === 'heat' ? 'none' : 'grayscale(1) opacity(0.7)' }}>🔥</span> Heat
        </button>
        <button
          onClick={() => setChronicleLens(lens === 'mastery' ? 'none' : 'mastery')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
          style={{
            background: lens === 'mastery' ? 'var(--accent-soft)' : 'var(--bg-panel-elev)',
            color: lens === 'mastery' ? 'var(--accent)' : 'var(--text-secondary)',
            border: `1px solid ${lens === 'mastery' ? 'color-mix(in srgb, var(--accent) 45%, transparent)' : 'var(--border)'}`,
          }}
          title="Mastery — colours entries by your quiz record (visual styling lands in a later update)"
        >
          <span style={{ filter: lens === 'mastery' ? 'none' : 'grayscale(1) opacity(0.7)' }}>🎯</span> Mastery
        </button>
      </div>

      <div className="w-px h-5 shrink-0" style={{ background: 'var(--border)' }} />

      <button
        onClick={onStartQuiz}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all hover:brightness-110 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
          color: '#fff',
          boxShadow: '0 2px 8px color-mix(in srgb, var(--accent) 40%, transparent)',
        }}
      >
        <span>✦</span>
        Quiz range
      </button>
    </div>
  );
}
