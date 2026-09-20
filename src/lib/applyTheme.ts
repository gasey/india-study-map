/** Single place that decides what goes on <html>.
 *
 *  Two things are being set, and they are not the same thing:
 *
 *   - the `dark` class, which globals.css uses to swap the chrome palette
 *     (--bg-app and friends) to its own literal dark hexes;
 *   - `data-theme`, which tokens.css uses to pick a token set.
 *
 *  The collectible skin is light-only (see the Skin comment in store.ts),
 *  so it must clear the `dark` class as well as claim data-theme. Leaving
 *  `dark` on would let globals.css's `.dark` block override --bg-app with
 *  a dark hex while the tokens underneath stayed bright — a half-applied
 *  theme that looks like a bug rather than a skin.
 *
 *  Root.tsx and App.tsx both need this, and drifted apart once before;
 *  keep the logic here rather than inline in either.
 */
export function applyTheme(theme: 'light' | 'dark', skin: 'default' | 'collectible') {
  const el = document.documentElement;
  const collectible = skin === 'collectible';
  el.classList.toggle('dark', !collectible && theme === 'dark');
  el.setAttribute('data-theme', collectible ? 'collectible' : theme === 'dark' ? 'ink' : 'paper');
}
