// ============================================
// MIND MAP SCHEMA
//
// A mind map is a tree: one root, branches, leaves.
// Each node can carry a `note` (shown on select) and an
// optional `chapterId` linking back into the Study Map.
// One file per map in src/data/mindmaps/, registered in
// src/data/mindmaps/index.ts — same pattern as everything.
// ============================================

export interface MindNode {
  id: string;
  label: string;
  /** Longer explanation shown in the detail panel when selected. */
  note?: string;
  /** Jump target in the Study Map module. */
  chapterId?: string;
  children?: MindNode[];
}

export interface MindMap {
  id: string;
  title: string;
  description: string;
  root: MindNode;
}
