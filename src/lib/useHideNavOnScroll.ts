import { useCallback, useEffect, useRef } from 'react';
import { useApp } from '@/lib/store';

/** Collapse the mobile nav bands while a long list is being read.
 *
 *  Attach the returned ref to the element that actually scrolls — in this
 *  app that is an inner `overflow-y-auto` pane, not the document, so a
 *  window scroll listener would never fire.
 *
 *  Scrolling DOWN past the threshold hides the chrome; any upward scroll
 *  brings it straight back. Scroll-up is deliberately the whole "exit"
 *  gesture: it is what a reader already does to get back to the top, so
 *  there is no extra control to find or explain.
 *
 *  Three guards, each for a real failure mode:
 *   - a 24px threshold, so a stray touch or a rubber-band bounce does not
 *     flap the bars;
 *   - it never hides unless the pane can actually scroll a screenful, so a
 *     short list cannot strand the nav off-screen with no way to scroll up;
 *   - it always restores on unmount, or navigating away mid-scroll would
 *     leave the next page with no nav at all.
 */
const THRESHOLD = 24;

export function useHideNavOnScroll() {
  const setNavHidden = useApp((s) => s.setNavHidden);
  const lastY = useRef(0);
  const cleanup = useRef<(() => void) | null>(null);

  /* Only resets the flag. It must NOT detach the listener: under
     StrictMode React runs this cleanup for its simulated unmount, but does
     not re-run the ref callback afterwards — so detaching here left the
     scroller with no listener at all and nothing to re-attach it. The ref
     owns attach/detach, and React calls it with null on a real unmount. */
  useEffect(() => () => setNavHidden(false), [setNavHidden]);

  return useCallback((node: HTMLElement | null) => {
    cleanup.current?.();
    cleanup.current = null;
    if (!node) {
      setNavHidden(false);
      return;
    }

    lastY.current = node.scrollTop;
    const onScroll = () => {
      const y = node.scrollTop;
      const delta = y - lastY.current;
      if (Math.abs(delta) < THRESHOLD) return;
      lastY.current = y;

      // Nothing to gain — and hiding here risks a list too short to scroll
      // back up with.
      if (node.scrollHeight - node.clientHeight < node.clientHeight) {
        setNavHidden(false);
        return;
      }
      setNavHidden(delta > 0 && y > THRESHOLD);
    };

    node.addEventListener('scroll', onScroll, { passive: true });
    cleanup.current = () => node.removeEventListener('scroll', onScroll);
  }, [setNavHidden]);
}
