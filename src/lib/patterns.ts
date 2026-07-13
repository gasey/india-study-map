// ============================================
// SVG patterns for polygon fills.
// Leaflet renders vectors to an SVG layer in the
// DOM. We inject a <defs> block once so any path
// can reference them via fill="url(#pattern-id)".
// ============================================

export const PATTERN_IDS = {
  dots: 'pattern-dots',
  hatch: 'pattern-hatch',
  wave: 'pattern-wave',
  cross: 'pattern-cross',
} as const;

/** Inject pattern <defs> into Leaflet's SVG layer if not already present.
 *  Call once after the map mounts. */
export function injectPatterns(svgEl: SVGSVGElement, accentColor: string): void {
  if (svgEl.querySelector('#study-map-patterns')) return;

  const NS = 'http://www.w3.org/2000/svg';
  const defs = document.createElementNS(NS, 'defs');
  defs.id = 'study-map-patterns';

  // Dots pattern — parchment / paper feel
  const dots = makePattern('dots', PATTERN_IDS.dots, 8, accentColor);
  const dot = document.createElementNS(NS, 'circle');
  dot.setAttribute('cx', '4');
  dot.setAttribute('cy', '4');
  dot.setAttribute('r', '1');
  dot.setAttribute('fill', accentColor);
  dot.setAttribute('opacity', '0.4');
  dots.appendChild(dot);

  // Diagonal hatch — empire / territory feel
  const hatch = makePattern('hatch', PATTERN_IDS.hatch, 8, accentColor);
  const hatchLine = document.createElementNS(NS, 'path');
  hatchLine.setAttribute('d', 'M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4');
  hatchLine.setAttribute('stroke', accentColor);
  hatchLine.setAttribute('stroke-width', '1');
  hatchLine.setAttribute('opacity', '0.4');
  hatch.appendChild(hatchLine);

  // Wave pattern — water / monsoon feel
  const wave = makePattern('wave', PATTERN_IDS.wave, 16, accentColor);
  const wavePath = document.createElementNS(NS, 'path');
  wavePath.setAttribute('d', 'M0,8 Q4,4 8,8 T16,8');
  wavePath.setAttribute('fill', 'none');
  wavePath.setAttribute('stroke', accentColor);
  wavePath.setAttribute('stroke-width', '1');
  wavePath.setAttribute('opacity', '0.35');
  wave.appendChild(wavePath);

  // Crosshatch — administrative / political feel
  const cross = makePattern('cross', PATTERN_IDS.cross, 10, accentColor);
  const crossLines = document.createElementNS(NS, 'path');
  crossLines.setAttribute('d', 'M0,5 L10,5 M5,0 L5,10');
  crossLines.setAttribute('stroke', accentColor);
  crossLines.setAttribute('stroke-width', '0.5');
  crossLines.setAttribute('opacity', '0.35');
  cross.appendChild(crossLines);

  defs.append(dots, hatch, wave, cross);

  // Drop shadow filter for prominent features
  const filter = document.createElementNS(NS, 'filter');
  filter.id = 'study-map-shadow';
  filter.setAttribute('x', '-20%');
  filter.setAttribute('y', '-20%');
  filter.setAttribute('width', '140%');
  filter.setAttribute('height', '140%');
  filter.innerHTML = `
    <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
    <feOffset dx="0" dy="1" result="offsetblur" />
    <feComponentTransfer><feFuncA type="linear" slope="0.4" /></feComponentTransfer>
    <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
  `;
  defs.appendChild(filter);

  svgEl.insertBefore(defs, svgEl.firstChild);
}

function makePattern(_name: string, id: string, size: number, _color: string): SVGPatternElement {
  const NS = 'http://www.w3.org/2000/svg';
  const p = document.createElementNS(NS, 'pattern');
  p.setAttribute('id', id);
  p.setAttribute('width', String(size));
  p.setAttribute('height', String(size));
  p.setAttribute('patternUnits', 'userSpaceOnUse');
  return p;
}
