// ============================================
// Shape of a unit from mpsc-jso-prep/data/*.js (window.MPSC.units.push
// records) — kept as-is when converting to real ES modules, so the
// converted files stay a faithful, lossless copy of the source content.
// ============================================

export interface JsoQuestion {
  q: string;
  o: string[];
  a: number;
  /** Explanation HTML — carries the `<p class="src">Source: ...</p>` tag
   *  that GK loader parses for exam name / year provenance. */
  e: string;
}

export interface JsoUnit {
  id: string;
  paper: string;
  title: string;
  marks?: number;
  /** True for mined past-paper banks rather than authored syllabus units. */
  bank?: boolean;
  syllabus?: string;
  notes?: { h: string; b: string }[];
  questions?: JsoQuestion[];
}
