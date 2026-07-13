import type { MindMap } from './types';
import { parliamentMindMap } from './parliament';
import { judiciaryMindMap } from './judiciary';

// Register mind maps here — one file per map.
export const mindmaps: MindMap[] = [parliamentMindMap, judiciaryMindMap];

export function getMindMap(id: string): MindMap | undefined {
  return mindmaps.find((m) => m.id === id);
}
