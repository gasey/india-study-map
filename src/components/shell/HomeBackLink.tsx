import { Link } from 'react-router-dom';

/** Small "back to Home" arrow for a module page's own header — shown
 *  whenever the global Rail/CommandBar chrome (which already has its own
 *  Home link) isn't present, same gating every header already uses for
 *  ModuleSwitcher. */
export function HomeBackLink({ hasDesktopChrome }: { hasDesktopChrome: boolean }) {
  return (
    <Link
      to="/"
      className={hasDesktopChrome ? 'lg:hidden' : ''}
      style={{ color: 'var(--text-secondary)' }}
      title="Back to Home"
    >
      ←
    </Link>
  );
}
