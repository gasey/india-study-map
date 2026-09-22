import type { MindMap } from './types';
import { parliamentMindMap } from './parliament';
import { judiciaryMindMap } from './judiciary';
import { udpaMindMap } from './udpa';

// Register mind maps here — one file per map.
export const mindmaps: MindMap[] = [parliamentMindMap, judiciaryMindMap, udpaMindMap];

export function getMindMap(id: string): MindMap | undefined {
  return mindmaps.find((m) => m.id === id);
}
