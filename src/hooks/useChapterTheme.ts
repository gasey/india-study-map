import { useEffect } from 'react';
import type { Chapter } from '@/types';

/** Apply a chapter's theme by overwriting CSS variables on :root.
 *  When chapter changes, transitions to the new palette.
 *  When chapter has no theme, restores defaults. */
export function useChapterTheme(chapter: Chapter, isDark: boolean) {
  useEffect(() => {
    const root = document.documentElement;
    const theme = chapter.theme;

    // Smooth transition for color variable changes
    root.style.setProperty('transition', 'background-color 400ms ease');

    if (theme?.accent) {
      root.style.setProperty('--accent', theme.accent);
    } else {
      // Restore defaults
      root.style.setProperty('--accent', isDark ? '#5fa5a5' : '#3a7a7a');
    }

    if (theme?.mapBg) {
      root.style.setProperty('--map-bg', theme.mapBg);
    } else {
      root.style.setProperty('--map-bg', isDark ? '#0f0f0e' : '#f3eddf');
    }

    return () => {
      root.style.removeProperty('transition');
    };
  }, [chapter.id, chapter.theme, isDark]);
}
