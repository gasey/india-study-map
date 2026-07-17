// Simple geometric icon paths on a 20×20 grid — shared by Rail and CommandBar.
export const IC = {
  home: 'M4 9.5L10 4l6 5.5M5.5 8.5V16h9V8.5',
  map: 'M3 5l4.5-1.5L12 5l4.5-1.5V15L12 16.5 7.5 15 3 16.5zM7.5 3.5V15M12 5v11.5',
  pyq: 'M5 3h10v14H5zM8 7h4M8 10.5h4',
  cards: 'M6 6h11v11H6zM3 3h11v3',
  mind: 'M10 7a2 2 0 100-4 2 2 0 000 4zM5 17a2 2 0 100-4 2 2 0 000 4zM15 17a2 2 0 100-4 2 2 0 000 4zM10 7v3M9 11l-3 2.5M11 11l3 2.5',
  chronicle: 'M5 3h10M5 3l5 7 5-7M5 17h10M5 17l5-7 5 7',
  codex: 'M5 3h9a2 2 0 012 2v12H7a2 2 0 01-2-2zM5 3v12M9 7h4',
  labs: 'M8 3h4M9 3v5l-4.5 8a1.5 1.5 0 001.3 2.2h8.4a1.5 1.5 0 001.3-2.2L11 8V3',
  layout: 'M3 3h14v4H3zM3 9h6v8H3zM11 9h6v8h-6z',
  sun: 'M10 2v2.5M10 15.5V18M2 10h2.5M15.5 10H18M4.3 4.3l1.8 1.8M13.9 13.9l1.8 1.8M15.7 4.3l-1.8 1.8M6.1 13.9l-1.8 1.8',
  moon: 'M10 2v3M10 15v3M2 10h3M15 10h3',
} as const;

export function IconSvg({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
      <path d={d} />
    </svg>
  );
}
