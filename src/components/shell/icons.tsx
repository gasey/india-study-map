// Simple geometric icon paths on a 20×20 grid — shared by Rail and AppHeader.
export const IC = {
  home: 'M4 9.5L10 4l6 5.5M5.5 8.5V16h9V8.5',
  map: 'M3 5l4.5-1.5L12 5l4.5-1.5V15L12 16.5 7.5 15 3 16.5zM7.5 3.5V15M12 5v11.5',
  pyq: 'M5 3h10v14H5zM8 7h4M8 10.5h4',
  cards: 'M6 6h11v11H6zM3 3h11v3',
  mind: 'M10 7a2 2 0 100-4 2 2 0 000 4zM5 17a2 2 0 100-4 2 2 0 000 4zM15 17a2 2 0 100-4 2 2 0 000 4zM10 7v3M9 11l-3 2.5M11 11l3 2.5',
  chronicle: 'M5 3h10M5 3l5 7 5-7M5 17h10M5 17l5-7 5 7',
  codex: 'M5 3h9a2 2 0 012 2v12H7a2 2 0 01-2-2zM5 3v12M9 7h4',
  labs: 'M8 3h4M9 3v5l-4.5 8a1.5 1.5 0 001.3 2.2h8.4a1.5 1.5 0 001.3-2.2L11 8V3',
  study: 'M3 5c2.5-1.3 5-1.3 7 0v10c-2-1.3-4.5-1.3-7 0zM17 5c-2.5-1.3-5-1.3-7 0v10c2-1.3 4.5-1.3 7 0z',
  qbank: 'M4 5h12v2.5H4zM4 9h12v2.5H4zM4 13h8v2.5H4z',
  sun: 'M10 2v2.5M10 15.5V18M2 10h2.5M15.5 10H18M4.3 4.3l1.8 1.8M13.9 13.9l1.8 1.8M15.7 4.3l-1.8 1.8M6.1 13.9l-1.8 1.8',
  moon: 'M10 2v3M10 15v3M2 10h3M15 10h3',
  // ---- Phase 2 additions ----
  tests: 'M6 3h8a1 1 0 011 1v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1zM8 7h4M8 10.5h4M8 14h2',
  papers: 'M5 3h7l3 3v11H5zM12 3v3h3M8 10.5h5M8 14h5',
  recall: 'M10 3v3M10 14v3M4 10h3M13 10h3M6.5 6.5l2 2M11.5 11.5l2 2M13.5 6.5l-2 2M8.5 11.5l-2 2',
  library: 'M4 4h4v12H4zM9 3.5h4v12.5H9zM14 4.5l3.5 1-3 11.5-3.5-1z',
  more: 'M4 10a1 1 0 102 0 1 1 0 10-2 0zM9 10a1 1 0 102 0 1 1 0 10-2 0zM14 10a1 1 0 102 0 1 1 0 10-2 0z',
  admin: 'M10 2.5l6 2.2v5c0 4-2.6 6.8-6 7.8-3.4-1-6-3.8-6-7.8v-5z M7.5 10l2 2 3-4',
  avatar: 'M10 10a3 3 0 100-6 3 3 0 000 6zM4 17c.5-3.5 3-5.5 6-5.5s5.5 2 6 5.5',
  code: 'M7 5L3 10l4 5M13 5l4 5-4 5M11 4l-2 12',
  games: 'M5 8h2.5l1-1.5h3l1 1.5H15a2 2 0 012 2v4a2 2 0 01-2 2h-1l-1.5-2h-5L6 16H5a2 2 0 01-2-2v-4a2 2 0 012-2zM7 10.5v2M6 11.5h2M13 10.5h.01M14.5 12h.01',
  search: 'M7 1.5A5.5 5.5 0 1112.5 7 5.5 5.5 0 017 1.5zM11 11l4 4',
  db: 'M4 5c0-1.1 2.7-2 6-2s6 .9 6 2-2.7 2-6 2-6-.9-6-2zM4 5v10c0 1.1 2.7 2 6 2s6-.9 6-2V5M4 10c0 1.1 2.7 2 6 2s6-.9 6-2',
  nihongo: 'M3 6h14M4.5 8.5h11M6.5 8.5v9M13.5 8.5v9',
} as const;

export function IconSvg({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
      <path d={d} />
    </svg>
  );
}
