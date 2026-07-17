import type { Era } from './types';

// ============================================
// ERA BACKBONE
// Single ordered array covering the full range with no gaps —
// consecutive eras share boundaries. `weight` is a *relative*
// px/year density; useTimelineScale normalizes it so the republic
// era gets far more screen space than four millennia of pre-history,
// matching how densely each era is actually studied.
//
// `color` is a gentle color-mix(--accent) ramp — a subtle sense of
// "time accumulating" toward the present, built entirely from the
// existing --accent token (same color-mix pattern as .subject-chip
// in globals.css) rather than a new palette.
// ============================================

export const eras: Era[] = [
  {
    id: 'prehistoric',
    label: 'Prehistoric',
    start: -3300,
    end: -600,
    weight: 0.5,
    color: 'color-mix(in srgb, var(--accent) 4%, transparent)',
  },
  {
    id: 'ancient',
    label: 'Ancient',
    start: -600,
    end: 550,
    weight: 2,
    color: 'color-mix(in srgb, var(--accent) 6%, transparent)',
  },
  {
    id: 'early-medieval',
    label: 'Early Medieval',
    start: 550,
    end: 1206,
    weight: 2,
    color: 'color-mix(in srgb, var(--accent) 8%, transparent)',
  },
  {
    id: 'sultanate-mughal',
    label: 'Sultanate & Mughal',
    start: 1206,
    end: 1707,
    weight: 4,
    color: 'color-mix(in srgb, var(--accent) 9%, transparent)',
  },
  {
    id: 'company',
    label: 'Company Rule',
    start: 1707,
    end: 1857,
    weight: 10,
    color: 'color-mix(in srgb, var(--accent) 11%, transparent)',
  },
  {
    id: 'crown-freedom',
    label: 'Crown Rule & Freedom Struggle',
    start: 1857,
    end: 1947,
    weight: 30,
    color: 'color-mix(in srgb, var(--accent) 13%, transparent)',
  },
  {
    id: 'republic',
    label: 'Republic',
    start: 1947,
    end: 2026,
    weight: 40,
    color: 'color-mix(in srgb, var(--accent) 15%, transparent)',
  },
];
