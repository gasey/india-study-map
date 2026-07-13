import { useEffect, useRef, useState } from 'react';
import type { TouchEvent } from 'react';
import { useApp } from '@/lib/store';
import { getChapter } from '@/data';
import { baseLayers } from '@/data/baseLayers';
import { LeftPanel } from '@/components/LeftPanel';
import { MapView } from '@/components/MapView';
import { RightPanel } from '@/components/RightPanel';
import { TopBar } from '@/components/TopBar';
import { Timeline } from '@/components/Timeline';
import { AuthorPanel, AuthorMapLayer, EMPTY_AUTHOR_STATE, type AuthorState, type Tool } from '@/components/AuthorTool';
import { useChapterTheme } from '@/hooks/useChapterTheme';
import type { TimelineEvent } from '@/types';

export function App() {
  const {
    theme,
    currentChapterId,
    activeLayerIds,
    activeBaseLayerIds,
    mode,
    quizIndex,
    setActiveLayers,
    basemapOverride,
  } = useApp();
  const chapter = getChapter(currentChapterId);

  const [mapClick, setMapClick] = useState<{ lat: number; lng: number } | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [eventCenter, setEventCenter] = useState<{ center: [number, number]; zoom: number } | null>(null);

  // Author mode
  const [authorMode, setAuthorMode] = useState(false);
  // Mobile chrome: chapter drawer + facts/quiz bottom sheet
  const [navOpen, setNavOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [authorState, setAuthorState] = useState<AuthorState>(EMPTY_AUTHOR_STATE);
  const [tool, setTool] = useState<Tool>('marker');
  const [draftPolygon, setDraftPolygon] = useState<[number, number][]>([]);
  const [draftLine, setDraftLine] = useState<[number, number][]>([]);

  // Swipe-up/down on the bottom sheet's handle, in addition to tap-to-toggle.
  // Tracked with refs (not state) so every touchmove doesn't trigger a re-render.
  const dragStartY = useRef<number | null>(null);
  const dragDelta = useRef(0);
  const SWIPE_THRESHOLD = 32;

  function handleSheetTouchStart(e: TouchEvent) {
    dragStartY.current = e.touches[0].clientY;
    dragDelta.current = 0;
  }
  function handleSheetTouchMove(e: TouchEvent) {
    if (dragStartY.current === null) return;
    dragDelta.current = e.touches[0].clientY - dragStartY.current;
  }
  function handleSheetTouchEnd() {
    const delta = dragDelta.current;
    dragStartY.current = null;
    if (delta <= -SWIPE_THRESHOLD) setSheetOpen(true);
    else if (delta >= SWIPE_THRESHOLD) setSheetOpen(false);
    else setSheetOpen((v) => !v); // small movement / plain tap
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useChapterTheme(chapter ?? ({} as any), theme === 'dark');

  useEffect(() => {
    setMapClick(null);
    setShowAnswer(false);
  }, [quizIndex, mode]);

  useEffect(() => {
    setEventCenter(null);
    setNavOpen(false);
  }, [currentChapterId]);

  useEffect(() => {
    if (mode === 'quiz') setSheetOpen(true);
  }, [mode]);

  // Mobile: a map-click question needs the map — duck the sheet until the user taps.
  useEffect(() => {
    if (mode === 'quiz' && chapter?.quiz[quizIndex]?.type === 'map_click' && !mapClick) {
      setSheetOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizIndex, mode, currentChapterId]);

  if (!chapter) {
    return (
      <div className="h-full flex items-center justify-center">
        <p style={{ color: 'var(--text-muted)' }}>No chapter found.</p>
      </div>
    );
  }

  const currentQuiz = chapter.quiz[quizIndex];
  const inMapClickQuestion = !authorMode && mode === 'quiz' && currentQuiz?.type === 'map_click';

  const answerMarker =
    !authorMode && showAnswer && currentQuiz?.type === 'map_click'
      ? {
          lat: currentQuiz.answer.lat,
          lng: currentQuiz.answer.lng,
          toleranceKm: currentQuiz.answer.toleranceKm,
        }
      : null;

  function handleEventSelect(evt: TimelineEvent | null) {
    if (!evt) { setEventCenter(null); return; }
    let nextLayers = [...activeLayerIds];
    if (evt.hideLayers) nextLayers = nextLayers.filter((id) => !evt.hideLayers!.includes(id));
    if (evt.showLayers) for (const id of evt.showLayers) if (!nextLayers.includes(id)) nextLayers.push(id);
    setActiveLayers(nextLayers);
    if (evt.view) setEventCenter(evt.view);
  }

  // Author click router based on active tool
  function handleAuthorClick(ll: { lat: number; lng: number }) {
    if (tool === 'marker') {
      setAuthorState({
        ...authorState,
        markers: [
          ...authorState.markers,
          { id: `m${authorState.markers.length + 1}`, name: `Point ${authorState.markers.length + 1}`, lat: ll.lat, lng: ll.lng },
        ],
      });
    } else if (tool === 'polygon') {
      setDraftPolygon([...draftPolygon, [ll.lat, ll.lng]]);
    } else if (tool === 'line') {
      setDraftLine([...draftLine, [ll.lat, ll.lng]]);
    }
  }

  const mapView = eventCenter ?? chapter.view;

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-app)' }}>
      <TopBar
        authorMode={authorMode}
        onToggleAuthor={() => setAuthorMode(!authorMode)}
        onToggleNav={() => setNavOpen((v) => !v)}
      />
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop: fixed column. Mobile: slide-in drawer over the map. */}
        {!authorMode && (
          <>
            <div className="hidden lg:flex h-full">
              <LeftPanel chapter={chapter} />
            </div>
            {/* Mobile drawer */}
            <div
              className={`lg:hidden fixed inset-0 z-[700] transition-opacity duration-300 ${
                navOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              style={{ background: 'rgba(20, 18, 14, 0.45)' }}
              onClick={() => setNavOpen(false)}
              aria-hidden={!navOpen}
            />
            <div
              className={`lg:hidden fixed inset-y-0 left-0 z-[710] w-72 max-w-[85vw] shadow-2xl transition-transform duration-300 ease-out-soft safe-top safe-bottom ${
                navOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <LeftPanel chapter={chapter} />
            </div>
          </>
        )}
        <main className="flex-1 relative">
          <MapView
            basemapOverride={basemapOverride}
            chapter={chapter}
            activeLayerIds={authorMode ? [] : activeLayerIds}
            baseLayers={baseLayers.filter((l) => activeBaseLayerIds.includes(l.id))}
            view={mapView}
            onMapClick={
              authorMode ? handleAuthorClick : (
                inMapClickQuestion
                  ? (ll) => { if (!showAnswer) { setMapClick(ll); setSheetOpen(true); } }
                  : undefined
              )
            }
            clickMarker={!authorMode && inMapClickQuestion ? mapClick : null}
            answerMarker={answerMarker}
            authorLayer={
              authorMode ? (
                <AuthorMapLayer
                  active={authorMode}
                  state={authorState}
                  draftPolygon={draftPolygon}
                  draftLine={draftLine}
                />
              ) : null
            }
          />
          {chapter.events && chapter.events.length > 0 && mode === 'study' && !authorMode && (
            <Timeline
              events={chapter.events}
              onEventSelect={handleEventSelect}
            />
          )}
        </main>
        {authorMode ? (
          <AuthorPanel
            active={authorMode}
            onClose={() => setAuthorMode(false)}
            state={authorState}
            setState={setAuthorState}
            tool={tool}
            setTool={setTool}
            draftPolygon={draftPolygon}
            draftLine={draftLine}
            setDraftPolygon={setDraftPolygon}
            setDraftLine={setDraftLine}
          />
        ) : (
          <>
            {/* Desktop: right column */}
            <div className="hidden lg:block h-full">
              <RightPanel
                chapter={chapter}
                mapClick={mapClick}
                clearMapClick={() => setMapClick(null)}
                setShowAnswer={setShowAnswer}
              />
            </div>
            {/* Mobile: bottom sheet — peek bar grows into a ~62dvh panel.
                Tap the handle to toggle, or swipe it up/down. */}
            <div
              className={`lg:hidden fixed inset-x-0 bottom-0 z-[600] flex flex-col rounded-t-2xl shadow-[0_-8px_32px_rgba(0,0,0,0.18)] transition-[height] duration-300 ease-out-soft ${
                sheetOpen ? 'h-[calc(62dvh+env(safe-area-inset-bottom))]' : 'h-[calc(3.5rem+env(safe-area-inset-bottom))]'
              }`}
              style={{ background: 'var(--bg-panel)', borderTop: '1px solid var(--border)' }}
            >
              <button
                onClick={() => setSheetOpen((v) => !v)}
                onTouchStart={handleSheetTouchStart}
                onTouchMove={handleSheetTouchMove}
                onTouchEnd={(e) => { e.preventDefault(); handleSheetTouchEnd(); }}
                className="shrink-0 h-14 w-full flex items-center justify-between px-5"
                aria-expanded={sheetOpen}
                aria-label={sheetOpen ? 'Collapse panel' : 'Expand facts and quiz'}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span className="w-8 h-1 rounded-full shrink-0" style={{ background: 'var(--border)' }} />
                  <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {mode === 'quiz' ? 'Quiz' : 'Facts'} — {chapter.title}
                  </span>
                </span>
                <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>
                  {sheetOpen ? '▾ close' : '▴ open'}
                </span>
              </button>
              <div className={`safe-bottom flex-1 min-h-0 ${sheetOpen ? '' : 'hidden'}`}>
                <RightPanel
                  chapter={chapter}
                  mapClick={mapClick}
                  clearMapClick={() => setMapClick(null)}
                  setShowAnswer={setShowAnswer}
                  frameless
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
