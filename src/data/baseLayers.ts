import type { Layer } from '@/types';

// ============================================
// Base layers — available to every chapter as
// an always-available administrative context.
//
// Currently:
//   - india-states: All 28 states + UTs of India
//
// Data source: DataMeet (CC BY 4.0) via Subhash9325's
// GeoJSON conversion, simplified to ~1% with mapshaper.
//
// Note: source data predates 2014 — Telangana is still
// merged into Andhra Pradesh, J&K still includes Ladakh.
// State names are corrected (Odisha, Uttarakhand).
// Educational use; not survey-grade.
// ============================================

export const baseLayers: Layer[] = [
  {
    id: 'base-states',
    name: 'India States & UTs',
    description: 'Administrative boundaries \u2014 always-available reference.',
    kind: 'vector',
    data: '/data/india-states.geojson',
    defaultOn: true,
    labelKey: 'name',
    style: {
      color: '#888880',
      fillColor: 'transparent',
      fillOpacity: 0,
      weight: 1,
      dashArray: '2 3',
    },
  },
];

export const baseLayerIds = baseLayers.map((l) => l.id);
